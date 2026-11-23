import { NextRequest, NextResponse } from 'next/server';
import db, { withTransaction } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { recordAuditLog } from '@/lib/audit';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const sessionUser = await getSession();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const quoteId = params.id;
    const quote = db.prepare('SELECT * FROM quotes WHERE id = ?').get(quoteId) as any;
    if (!quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }

    const request = db.prepare('SELECT * FROM product_requests WHERE id = ?').get(quote.request_id) as any;
    if (!request) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    // Must be the owner customer
    if (sessionUser.role === 'CUSTOMER' && request.customer_id !== sessionUser.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Check expiry
    if (new Date(quote.expires_at).getTime() < Date.now()) {
      return NextResponse.json({ error: 'This quote has expired. Please request a refreshed quote.' }, { status: 400 });
    }

    const now = new Date().toISOString();
    let orderId = '';

    withTransaction((txDb) => {
      // 1. Update Quote
      txDb.prepare(`
        UPDATE quotes
        SET status = 'QUOTE_ACCEPTED', customer_action_at = ?, updated_at = ?
        WHERE id = ?
      `).run(now, now, quoteId);

      // 2. Transition Request to QUOTE_ACCEPTED -> AWAITING_PAYMENT
      txDb.prepare(`
        UPDATE product_requests
        SET status = 'AWAITING_PAYMENT', updated_at = ?
        WHERE id = ?
      `).run(now, request.id);

      // 3. Record status history
      txDb.prepare(`
        INSERT INTO request_status_history (id, request_id, from_status, to_status, changed_by_user_id, note, created_at)
        VALUES (?, ?, 'QUOTE_SENT', 'AWAITING_PAYMENT', ?, 'Customer accepted quote and agreed to terms', ?)
      `).run(`rsh-${Date.now()}`, request.id, sessionUser.id, now);

      // 4. Create Order if not already created
      const existingOrder = txDb.prepare('SELECT id FROM orders WHERE request_id = ?').get(request.id) as { id: string } | undefined;
      orderId = existingOrder?.id || '';

      if (!orderId) {
        orderId = `ord-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
        const randomOrderNum = Math.floor(1000 + Math.random() * 9000);
        const orderNumber = `ORD-${new Date().getFullYear()}-${randomOrderNum}`;

        txDb.prepare(`
          INSERT INTO orders (id, order_number, request_id, quote_id, customer_id, assigned_staff_id, status, total_paid_minor, currency, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, 'AWAITING_PAYMENT', 0, 'USD', ?, ?)
        `).run(orderId, orderNumber, request.id, quote.id, request.customer_id, request.assigned_staff_id, now, now);

        txDb.prepare(`
          INSERT INTO order_status_history (id, order_id, from_status, to_status, changed_by_user_id, note, created_at)
          VALUES (?, ?, null, 'AWAITING_PAYMENT', ?, 'Order created from accepted quote', ?)
        `).run(`osh-${Date.now()}`, orderId, sessionUser.id, now);
      }

      // 5. Notify Staff
      if (request.assigned_staff_id) {
        txDb.prepare(`
          INSERT INTO notifications (id, user_id, title, body, link_url, created_at)
          VALUES (?, ?, 'Quote Accepted', ?, ?, ?)
        `).run(
          `notif-${Date.now()}`,
          request.assigned_staff_id,
          `Customer accepted quote for ${request.product_name}. Awaiting payment.`,
          `/admin/orders/${orderId}`,
          now
        );
      }

      // 6. Record Audit Log inside the transaction
      txDb.prepare(`
        INSERT INTO audit_logs (id, actor_user_id, action_type, resource_type, resource_id, metadata_json, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(
        `aud-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        sessionUser.id,
        'QUOTE_ACCEPTED',
        'quotes',
        quoteId,
        JSON.stringify({ requestId: request.id, orderId }),
        now
      );
    });

    return NextResponse.json({
      success: true,
      orderId,
      message: 'Quote accepted successfully. Proceed to payment authorization.',
    });
  } catch (err: any) {
    console.error('Accept quote error:', err);
    return NextResponse.json({ error: err.message || 'Failed to accept quote.' }, { status: 500 });
  }
}
