import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getSession } from '@/lib/auth';
import { recordAuditLog } from '@/lib/audit';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const sessionUser = await getSession();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const orderId = params.id;
    const body = await req.json();
    const { idempotencyKey, cardHolderName, lastFour = '4242', paymentMethod = 'CARD_SIMULATION' } = body;

    if (!idempotencyKey) {
      return NextResponse.json({ error: 'Idempotency key is required to prevent double billing.' }, { status: 400 });
    }

    // Check existing payment with this idempotency key
    const existingPayment = db.prepare('SELECT * FROM payments WHERE idempotency_key = ?').get(idempotencyKey) as any;
    if (existingPayment) {
      return NextResponse.json({
        success: true,
        message: 'Payment already processed with this transaction token.',
        payment: existingPayment,
      });
    }

    const order = db.prepare(`
      SELECT o.*, q.total_payable_minor, r.product_name, r.id as requestId, r.reference_number
      FROM orders o
      JOIN quotes q ON o.quote_id = q.id
      JOIN product_requests r ON o.request_id = r.id
      WHERE o.id = ?
    `).get(orderId) as any;

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (sessionUser.role === 'CUSTOMER' && order.customer_id !== sessionUser.id) {
      return NextResponse.json({ error: 'Unauthorized to pay for this order.' }, { status: 403 });
    }

    if (order.status !== 'AWAITING_PAYMENT') {
      return NextResponse.json({
        error: `Order cannot be paid in current status (${order.status}). Only orders awaiting payment are eligible.`,
      }, { status: 400 });
    }

    const now = new Date().toISOString();
    const paymentId = `pay-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const paymentRef = `PAY-REF-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const providerTxnId = `ch_sim_${Date.now()}_auth_${lastFour}`;

    // 1. Record verified payment
    db.prepare(`
      INSERT INTO payments (
        id, order_id, payment_reference, provider, amount_minor, currency, status,
        provider_transaction_id, idempotency_key, verified_at, raw_payload_json, created_at
      ) VALUES (?, ?, ?, ?, ?, 'USD', 'VERIFIED', ?, ?, ?, ?, ?)
    `).run(
      paymentId,
      orderId,
      paymentRef,
      'VERITAS_SECURE_PAYMENT_GATEWAY',
      order.total_payable_minor,
      providerTxnId,
      idempotencyKey,
      now,
      JSON.stringify({ cardHolderName, lastFour, paymentMethod, verified: true }),
      now
    );

    // 2. Update Order
    db.prepare(`
      UPDATE orders
      SET status = 'PAYMENT_CONFIRMED', total_paid_minor = ?, updated_at = ?
      WHERE id = ?
    `).run(order.total_payable_minor, now, orderId);

    // 3. Update Request status
    db.prepare(`
      UPDATE product_requests
      SET status = 'PAYMENT_CONFIRMED', updated_at = ?
      WHERE id = ?
    `).run(now, order.requestId);

    // 4. Record Status Histories
    db.prepare(`
      INSERT INTO order_status_history (id, order_id, from_status, to_status, changed_by_user_id, note, created_at)
      VALUES (?, ?, 'AWAITING_PAYMENT', 'PAYMENT_CONFIRMED', ?, 'Payment verified via gateway. Authorization code generated.', ?)
    `).run(`osh-${Date.now()}`, orderId, sessionUser.id, now);

    db.prepare(`
      INSERT INTO request_status_history (id, request_id, from_status, to_status, changed_by_user_id, note, created_at)
      VALUES (?, ?, 'AWAITING_PAYMENT', 'PAYMENT_CONFIRMED', ?, 'Payment verified via gateway.', ?)
    `).run(`rsh-${Date.now()}`, order.requestId, sessionUser.id, now);

    // 5. Generate Customer Receipt Document
    db.prepare(`
      INSERT INTO documents (id, request_id, order_id, uploaded_by_user_id, document_type, title, file_path, mime_type, is_confidential_operator_only, created_at)
      VALUES (?, ?, ?, ?, 'CUSTOMER_RECEIPT', ?, ?, 'application/pdf', 0, ?)
    `).run(
      `doc-rec-${Date.now()}`,
      order.requestId,
      orderId,
      sessionUser.id,
      `Payment Receipt #${paymentRef}.pdf`,
      `/documents/receipts/${paymentRef}.pdf`,
      now
    );

    // 6. Notify Operator
    if (order.assigned_staff_id) {
      db.prepare(`
        INSERT INTO notifications (id, user_id, title, body, link_url, created_at)
        VALUES (?, ?, 'Payment Confirmed', ?, ?, ?)
      `).run(
        `notif-${Date.now()}`,
        order.assigned_staff_id,
        `Payment of $${(order.total_payable_minor / 100).toFixed(2)} received for order #${order.order_number}. Sourcing authorized.`,
        `/admin/orders/${order.id}`,
        now
      );
    }

    recordAuditLog(sessionUser.id, 'PAYMENT_VERIFIED', 'orders', orderId, {
      paymentRef,
      providerTxnId,
      amountMinor: order.total_payable_minor,
    });

    return NextResponse.json({
      success: true,
      paymentReference: paymentRef,
      amountPaidMinor: order.total_payable_minor,
      message: 'Payment verified and authorized. Sourcing workflow is now unlocked.',
    });
  } catch (err: any) {
    console.error('Payment processing error:', err);
    return NextResponse.json({ error: err.message || 'Payment processing failed.' }, { status: 500 });
  }
}
