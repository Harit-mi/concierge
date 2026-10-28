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
    const { satisfactionRating, recipientNotes, issueReported, issueDescription } = body;

    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId) as any;
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (sessionUser.role === 'CUSTOMER' && order.customer_id !== sessionUser.id) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
    }

    const now = new Date().toISOString();
    const targetStatus = issueReported ? 'DISPUTED' : 'DELIVERED';

    // 1. Record Delivery Confirmation
    db.prepare(`
      INSERT INTO delivery_confirmations (
        id, order_id, confirmed_by_user_id, delivered_at, recipient_notes,
        satisfaction_rating, issue_reported, issue_description, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      `dc-${Date.now()}`,
      orderId,
      sessionUser.id,
      now,
      recipientNotes || null,
      satisfactionRating || 5,
      issueReported ? 1 : 0,
      issueDescription || null,
      now
    );

    // 2. Update Order & Request status
    db.prepare('UPDATE orders SET status = ?, updated_at = ? WHERE id = ?').run(targetStatus, now, orderId);
    db.prepare('UPDATE product_requests SET status = ?, updated_at = ? WHERE id = ?').run(targetStatus, now, order.request_id);

    // 3. Status History
    db.prepare(`
      INSERT INTO order_status_history (id, order_id, from_status, to_status, changed_by_user_id, note, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      `osh-${Date.now()}`,
      orderId,
      order.status,
      targetStatus,
      sessionUser.id,
      issueReported ? `Customer reported issue: ${issueDescription}` : 'Customer confirmed parcel receipt in good order',
      now
    );

    recordAuditLog(sessionUser.id, 'DELIVERY_CONFIRMED', 'orders', orderId, {
      status: targetStatus,
      satisfactionRating,
      issueReported,
    });

    return NextResponse.json({
      success: true,
      status: targetStatus,
      message: issueReported
        ? 'Your issue has been logged. A senior concierge specialist is reviewing your file.'
        : 'Thank you for confirming delivery! We hope you love your sourced item.',
    });
  } catch (err: any) {
    console.error('Confirm delivery error:', err);
    return NextResponse.json({ error: err.message || 'Failed to record delivery confirmation.' }, { status: 500 });
  }
}
