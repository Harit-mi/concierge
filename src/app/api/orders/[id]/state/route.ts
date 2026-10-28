import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getSession } from '@/lib/auth';
import { canTransition, OrderStatus } from '@/lib/state-machine';
import { recordAuditLog } from '@/lib/audit';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const sessionUser = await getSession();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const orderId = params.id;
    const body = await req.json();
    const { targetStatus, note } = body;

    if (!targetStatus) {
      return NextResponse.json({ error: 'targetStatus is required.' }, { status: 400 });
    }

    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId) as any;
    if (!order) {
      return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    }

    // Role ownership check
    if (sessionUser.role === 'CUSTOMER' && order.customer_id !== sessionUser.id) {
      return NextResponse.json({ error: 'Unauthorized to change order status.' }, { status: 403 });
    }

    const transitionCheck = canTransition(order.status as OrderStatus, targetStatus as OrderStatus, sessionUser.role);
    if (!transitionCheck.allowed) {
      return NextResponse.json({ error: transitionCheck.reason }, { status: 400 });
    }

    // State machine rule: Do NOT mark as paid without verified provider event or payment record
    if (targetStatus === 'PAYMENT_CONFIRMED' && order.status === 'AWAITING_PAYMENT') {
      const verifiedPayment = db.prepare('SELECT id FROM payments WHERE order_id = ? AND status = "VERIFIED"').get(order.id);
      if (!verifiedPayment && sessionUser.role !== 'ADMIN') {
        return NextResponse.json({
          error: 'Cannot transition to PAYMENT_CONFIRMED without a verified payment provider transaction or authorized admin reconciliation.',
        }, { status: 400 });
      }
    }

    const now = new Date().toISOString();

    // 1. Update Order status
    db.prepare(`
      UPDATE orders
      SET status = ?, updated_at = ?
      WHERE id = ?
    `).run(targetStatus, now, orderId);

    // 2. Synchronize associated product_requests status
    db.prepare(`
      UPDATE product_requests
      SET status = ?, updated_at = ?
      WHERE id = ?
    `).run(targetStatus, now, order.request_id);

    // 3. Record Order Status History
    db.prepare(`
      INSERT INTO order_status_history (id, order_id, from_status, to_status, changed_by_user_id, note, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(`osh-${Date.now()}`, orderId, order.status, targetStatus, sessionUser.id, note || null, now);

    // 4. Record Request Status History
    db.prepare(`
      INSERT INTO request_status_history (id, request_id, from_status, to_status, changed_by_user_id, note, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(`rsh-${Date.now()}`, order.request_id, order.status, targetStatus, sessionUser.id, note || null, now);

    // 5. Send Notification to Customer if updated by operator
    if (sessionUser.role !== 'CUSTOMER') {
      db.prepare(`
        INSERT INTO notifications (id, user_id, title, body, link_url, created_at)
        VALUES (?, ?, 'Order Status Update', ?, ?, ?)
      `).run(
        `notif-${Date.now()}`,
        order.customer_id,
        `Your order #${order.order_number} status has been updated to ${targetStatus.replace(/_/g, ' ')}.`,
        `/portal/orders/${order.id}`,
        now
      );
    }

    recordAuditLog(sessionUser.id, 'ORDER_STATE_TRANSITION', 'orders', orderId, {
      from: order.status,
      to: targetStatus,
      note,
    });

    return NextResponse.json({
      success: true,
      from: order.status,
      to: targetStatus,
      message: `Order transitioned successfully to ${targetStatus}.`,
    });
  } catch (err: any) {
    console.error('Order state transition error:', err);
    return NextResponse.json({ error: err.message || 'Failed to update order state.' }, { status: 500 });
  }
}
