import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getSession } from '@/lib/auth';
import { canTransition, OrderStatus } from '@/lib/state-machine';
import { recordAuditLog } from '@/lib/audit';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const sessionUser = await getSession();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const requestId = params.id;
    const normalizedId = requestId.replace(/^quo-/, 'qte-');
    const request = db.prepare(`
      SELECT r.*,
             u.name as customerName, u.email as customerEmail, u.phone as customerPhone,
             s.name as assignedStaffName
      FROM product_requests r
      JOIN users u ON r.customer_id = u.id
      LEFT JOIN users s ON r.assigned_staff_id = s.id
      LEFT JOIN quotes q ON r.id = q.request_id
      LEFT JOIN orders o ON r.id = o.request_id
      WHERE r.id = ? OR r.reference_number = ? OR q.id = ? OR q.id = ? OR q.quote_number = ? OR o.id = ? OR o.order_number = ?
    `).get(requestId, requestId, requestId, normalizedId, requestId, requestId, requestId) as any;

    if (!request) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    // Role ownership check
    if (sessionUser.role === 'CUSTOMER' && request.customer_id !== sessionUser.id) {
      return NextResponse.json({ error: 'Unauthorized access to this request.' }, { status: 403 });
    }

    // Fetch Images
    const images = db.prepare('SELECT * FROM product_request_images WHERE request_id = ?').all(request.id);

    // Fetch Quote if exists
    const quote = db.prepare('SELECT * FROM quotes WHERE request_id = ? ORDER BY created_at DESC LIMIT 1').get(request.id) as any;
    if (quote) {
      quote.lineItems = db.prepare('SELECT * FROM quote_line_items WHERE quote_id = ?').all(quote.id);
    }

    // Fetch Order if exists
    const order = db.prepare(`
      SELECT o.*, 
             s.carrier_name, s.tracking_number, s.tracking_url, s.status as shipmentStatus,
             src.cost_price_minor, src.quality_passed, src.quality_check_notes,
             dc.delivered_at as confirmedDeliveredAt, dc.recipient_notes
      FROM orders o
      LEFT JOIN shipments s ON o.id = s.order_id
      LEFT JOIN sourcing_records src ON o.id = src.order_id
      LEFT JOIN delivery_confirmations dc ON o.id = dc.order_id
      WHERE o.request_id = ?
    `).get(request.id);

    // Fetch Status History
    const statusHistory = db.prepare(`
      SELECT h.*, u.name as changedByName, u.role as changedByRole
      FROM request_status_history h
      JOIN users u ON h.changed_by_user_id = u.id
      WHERE h.request_id = ?
      ORDER BY h.created_at ASC
    `).all(request.id);

    // Fetch Admin Notes if operator
    let adminNotes: any[] = [];
    if (sessionUser.role !== 'CUSTOMER') {
      adminNotes = db.prepare(`
        SELECT n.*, u.name as authorName
        FROM admin_notes n
        JOIN users u ON n.author_id = u.id
        WHERE n.request_id = ?
        ORDER BY n.created_at DESC
      `).all(request.id);
    }

    return NextResponse.json({
      request,
      images,
      quote,
      order,
      statusHistory,
      adminNotes,
    });
  } catch (err: any) {
    console.error('Get request details error:', err);
    return NextResponse.json({ error: 'Failed to load request details.' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const sessionUser = await getSession();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const requestId = params.id;
    const body = await req.json();
    const { status, assignedStaffId, rejectionReason, note, adminNote } = body;

    const request = db.prepare('SELECT * FROM product_requests WHERE id = ?').get(requestId) as any;
    if (!request) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    // Check permissions
    if (sessionUser.role === 'CUSTOMER') {
      return NextResponse.json({ error: 'Only concierge operators can update request metadata.' }, { status: 403 });
    }

    const now = new Date().toISOString();

    // 1. Status Transition
    if (status && status !== request.status) {
      const check = canTransition(request.status as OrderStatus, status as OrderStatus, sessionUser.role);
      if (!check.allowed) {
        return NextResponse.json({ error: check.reason }, { status: 400 });
      }

      db.prepare(`
        UPDATE product_requests
        SET status = ?, rejection_reason = ?, updated_at = ?
        WHERE id = ?
      `).run(status, rejectionReason || null, now, requestId);

      // Record History
      db.prepare(`
        INSERT INTO request_status_history (id, request_id, from_status, to_status, changed_by_user_id, note, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(`rsh-${Date.now()}`, requestId, request.status, status, sessionUser.id, note || null, now);

      recordAuditLog(sessionUser.id, 'REQUEST_STATUS_UPDATED', 'product_requests', requestId, {
        from: request.status,
        to: status,
        reason: rejectionReason,
      });
    }

    // 2. Staff Assignment
    if (assignedStaffId !== undefined) {
      db.prepare(`
        UPDATE product_requests
        SET assigned_staff_id = ?, updated_at = ?
        WHERE id = ?
      `).run(assignedStaffId, now, requestId);

      recordAuditLog(sessionUser.id, 'STAFF_ASSIGNED', 'product_requests', requestId, { assignedStaffId });
    }

    // 3. Admin internal note
    if (adminNote) {
      db.prepare(`
        INSERT INTO admin_notes (id, request_id, author_id, note_text, created_at)
        VALUES (?, ?, ?, ?, ?)
      `).run(`note-${Date.now()}`, requestId, sessionUser.id, adminNote, now);
    }

    return NextResponse.json({ success: true, message: 'Request updated successfully.' });
  } catch (err: any) {
    console.error('Update request error:', err);
    return NextResponse.json({ error: err.message || 'Failed to update request.' }, { status: 500 });
  }
}
