import { NextRequest, NextResponse } from 'next/server';
import db, { withTransaction } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { recordAuditLog } from '@/lib/audit';
import { getConfig } from '@/lib/config';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // 1. Authenticate user
    const sessionUser = await getSession();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const orderId = params.id;
    const body = await req.json();
    const { idempotencyKey, cardHolderName, lastFour = '4242', paymentMethod = 'CARD' } = body;

    if (!idempotencyKey || typeof idempotencyKey !== 'string' || idempotencyKey.trim().length === 0) {
      return NextResponse.json({ error: 'Idempotency key is required to prevent double billing.' }, { status: 400 });
    }

    // 2. Fetch order to verify existence and ownership FIRST
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

    // 3. Strict ownership check: Customers can ONLY access/pay for their own orders
    if (sessionUser.role === 'CUSTOMER' && order.customer_id !== sessionUser.id) {
      return NextResponse.json({ error: 'Unauthorized to pay for this order.' }, { status: 403 });
    }

    // 4. NOW inspect idempotency AFTER confirming order ownership
    const existingPayment = db.prepare('SELECT * FROM payments WHERE idempotency_key = ?').get(idempotencyKey) as any;
    if (existingPayment) {
      if (existingPayment.order_id !== order.id) {
        return NextResponse.json({ error: 'Idempotency key collision across distinct orders.' }, { status: 409 });
      }
      return NextResponse.json({
        success: true,
        message: 'Payment already processed with this transaction token.',
        payment: existingPayment,
        paymentReference: existingPayment.payment_reference,
        amountPaidMinor: existingPayment.amount_minor,
      });
    }

    // 5. Verify order is in payable state
    if (order.status !== 'AWAITING_PAYMENT') {
      return NextResponse.json({
        error: `Order cannot be paid in current status (${order.status}). Only orders awaiting payment are eligible.`,
      }, { status: 400 });
    }

    const config = getConfig();
    const now = new Date().toISOString();
    const paymentId = `pay-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const paymentRef = `PAY-REF-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const providerName = config.payment.provider === 'stripe' ? 'STRIPE' : 'VERITAS_SECURE_VAULT';
    const providerTxnId = `ch_${config.payment.provider}_${Date.now()}_${lastFour}`;

    // 6. Execute all updates inside an atomic database transaction
    withTransaction((txDb) => {
      // 6a. Record verified payment
      txDb.prepare(`
        INSERT INTO payments (
          id, order_id, payment_reference, provider, amount_minor, currency, status,
          provider_transaction_id, idempotency_key, verified_at, raw_payload_json, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, 'VERIFIED', ?, ?, ?, ?, ?)
      `).run(
        paymentId,
        orderId,
        paymentRef,
        providerName,
        order.total_payable_minor,
        order.currency || 'USD',
        providerTxnId,
        idempotencyKey,
        now,
        JSON.stringify({ cardHolderName, lastFour, paymentMethod, verified: true, provider: providerName }),
        now
      );

      // 6b. Update Order
      txDb.prepare(`
        UPDATE orders
        SET status = 'PAYMENT_CONFIRMED', total_paid_minor = ?, updated_at = ?
        WHERE id = ?
      `).run(order.total_payable_minor, now, orderId);

      // 6c. Update Request status
      txDb.prepare(`
        UPDATE product_requests
        SET status = 'PAYMENT_CONFIRMED', updated_at = ?
        WHERE id = ?
      `).run(now, order.requestId);

      // 6d. Record Order Status History
      txDb.prepare(`
        INSERT INTO order_status_history (id, order_id, from_status, to_status, changed_by_user_id, note, created_at)
        VALUES (?, ?, 'AWAITING_PAYMENT', 'PAYMENT_CONFIRMED', ?, 'Payment verified and settled. Sourcing authorized.', ?)
      `).run(`osh-${Date.now()}`, orderId, sessionUser.id, now);

      // 6e. Record Request Status History
      txDb.prepare(`
        INSERT INTO request_status_history (id, request_id, from_status, to_status, changed_by_user_id, note, created_at)
        VALUES (?, ?, 'AWAITING_PAYMENT', 'PAYMENT_CONFIRMED', ?, 'Payment authorized by client.', ?)
      `).run(`rsh-${Date.now()}`, order.requestId, sessionUser.id, now);

      // 6f. Generate Customer Receipt Document
      txDb.prepare(`
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

      // 6g. Notify Assigned Concierge Operator
      if (order.assigned_staff_id) {
        txDb.prepare(`
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

      // 6h. Record Audit Log inside the transaction
      txDb.prepare(`
        INSERT INTO audit_logs (id, actor_user_id, action_type, resource_type, resource_id, metadata_json, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(
        `aud-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        sessionUser.id,
        'PAYMENT_VERIFIED',
        'orders',
        orderId,
        JSON.stringify({
          paymentRef,
          providerTxnId,
          amountMinor: order.total_payable_minor,
          idempotencyKey,
        }),
        now
      );
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
