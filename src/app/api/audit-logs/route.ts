import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const sessionUser = await getSession();
    if (!sessionUser || sessionUser.role === 'CUSTOMER') {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
    }

    const logs = db.prepare(`
      SELECT a.*, u.name as actorName, u.email as actorEmail, u.role as actorRole
      FROM audit_logs a
      JOIN users u ON a.actor_user_id = u.id
      ORDER BY a.created_at DESC
      LIMIT 100
    `).all();

    return NextResponse.json({ logs });
  } catch (err: any) {
    console.error('Fetch audit logs error:', err);
    return NextResponse.json({ error: 'Failed to retrieve audit trail.' }, { status: 500 });
  }
}
