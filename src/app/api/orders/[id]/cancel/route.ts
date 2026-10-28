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
    const { reason } = body;

    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId) as any;
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (sessionUser.role === 'CUSTOMER' && order.customer_id !== sessionUser.id) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
    }

    const now = new Date().toISOString();
    // If operator/admin is cancelling, state becomes CANCELLED; if customer, CANCELLATION_REQUESTED
    const targetStatus = sessionUser.role === 'CUSTOMER' ? 'CANCELLATION_REQUESTED' : 'CANCELLED';

    db.prepare('UPDATE orders SET status = ?, updated_at = ? WHERE id = ?').run(targetStatus, now, orderId);
    db.prepare('UPDATE product_requests SET status = ?, updated_at = ? WHERE id = ?').run(targetStatus, now, order.request_id);

    db.prepare(`
      INSERT INTO order_status_history (id, order_id, from_status, to_status, changed_by_user_id, note, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(`osh-${Date.now()}`, orderId, order.status, targetStatus, sessionUser.id, reason || 'Cancellation initiated', now);

    recordAuditLog(sessionUser.id, 'ORDER_CANCELLATION', 'orders', orderId, {
      from: order.status,
      to: targetStatus,
      reason,
    });

    return NextResponse.json({
      success: true,
      status: targetStatus,
      message: sessionUser.role === 'CUSTOMER'
        ? 'Cancellation request submitted for concierge review.'
        : 'Order cancelled.',
    });
  } catch (err: any) {
    console.error('Cancel order error:', err);
    return NextResponse.json({ error: err.message || 'Failed to cancel order.' }, { status: 500 });
  }
}
