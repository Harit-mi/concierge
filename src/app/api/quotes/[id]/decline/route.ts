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

    const quoteId = params.id;
    const body = await req.json().catch(() => ({}));
    const { reason } = body;

    const quote = db.prepare('SELECT * FROM quotes WHERE id = ?').get(quoteId) as any;
    if (!quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }

    const request = db.prepare('SELECT * FROM product_requests WHERE id = ?').get(quote.request_id) as any;
    if (!request) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    if (sessionUser.role === 'CUSTOMER' && request.customer_id !== sessionUser.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const now = new Date().toISOString();

    db.prepare(`
      UPDATE quotes
      SET status = 'QUOTE_DECLINED', customer_action_at = ?, updated_at = ?
      WHERE id = ?
    `).run(now, now, quoteId);

    db.prepare(`
      UPDATE product_requests
      SET status = 'QUOTE_DECLINED', updated_at = ?
      WHERE id = ?
    `).run(now, request.id);

    db.prepare(`
      INSERT INTO request_status_history (id, request_id, from_status, to_status, changed_by_user_id, note, created_at)
      VALUES (?, ?, 'QUOTE_SENT', 'QUOTE_DECLINED', ?, ?, ?)
    `).run(`rsh-${Date.now()}`, request.id, sessionUser.id, reason ? `Customer declined quote: ${reason}` : 'Customer declined quote terms', now);

    recordAuditLog(sessionUser.id, 'QUOTE_DECLINED', 'quotes', quoteId, { reason });

    return NextResponse.json({ success: true, message: 'Quote declined.' });
  } catch (err: any) {
    console.error('Decline quote error:', err);
    return NextResponse.json({ error: err.message || 'Failed to decline quote.' }, { status: 500 });
  }
}
