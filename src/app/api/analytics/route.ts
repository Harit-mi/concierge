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

    // 1. Pipeline status breakdown
    const requestStatusCounts = db.prepare(`
      SELECT status, COUNT(*) as count
      FROM product_requests
      GROUP BY status
    `).all() as { status: string; count: number }[];

    const orderStatusCounts = db.prepare(`
      SELECT status, COUNT(*) as count
      FROM orders
      GROUP BY status
    `).all() as { status: string; count: number }[];

    // 2. Financial totals from verified payments
    const financialStats = db.prepare(`
      SELECT 
        COALESCE(SUM(amount_minor), 0) as totalVolumeMinor,
        COUNT(id) as totalTransactions
      FROM payments
      WHERE status = 'VERIFIED'
    `).get() as { totalVolumeMinor: number; totalTransactions: number };

    // 3. Service fee revenue from quotes of paid orders
    const feeStats = db.prepare(`
      SELECT 
        COALESCE(SUM(q.sourcing_fee_minor), 0) as totalServiceFeesMinor
      FROM orders o
      JOIN quotes q ON o.quote_id = q.id
      JOIN payments p ON o.id = p.order_id
      WHERE p.status = 'VERIFIED'
    `).get() as { totalServiceFeesMinor: number };

    // 4. Request Conversion & Rejection
    const totalRequests = (db.prepare('SELECT COUNT(*) as count FROM product_requests').get() as { count: number }).count;
    const rejectedRequests = (db.prepare("SELECT COUNT(*) as count FROM product_requests WHERE status = 'REJECTED'").get() as { count: number }).count;
    const acceptedQuotes = (db.prepare("SELECT COUNT(*) as count FROM quotes WHERE status = 'QUOTE_ACCEPTED'").get() as { count: number }).count;
    const totalQuotes = (db.prepare("SELECT COUNT(*) as count FROM quotes").get() as { count: number }).count;

    const rejectionRatePercent = totalRequests > 0 ? ((rejectedRequests / totalRequests) * 100).toFixed(1) : '0.0';
    const quoteAcceptanceRatePercent = totalQuotes > 0 ? ((acceptedQuotes / totalQuotes) * 100).toFixed(1) : '0.0';
    const averageOrderValueMinor = financialStats.totalTransactions > 0
      ? Math.round(financialStats.totalVolumeMinor / financialStats.totalTransactions)
      : 0;

    // 5. Recent Activity
    const recentActivity = db.prepare(`
      SELECT a.*, u.name as actorName, u.role as actorRole
      FROM audit_logs a
      JOIN users u ON a.actor_user_id = u.id
      ORDER BY a.created_at DESC
      LIMIT 10
    `).all();

    return NextResponse.json({
      metrics: {
        totalRequests,
        totalQuotes,
        acceptedQuotes,
        quoteAcceptanceRatePercent,
        rejectedRequests,
        rejectionRatePercent,
        totalTransactions: financialStats.totalTransactions,
        totalVolumeMinor: financialStats.totalVolumeMinor,
        totalServiceFeesMinor: feeStats.totalServiceFeesMinor,
        averageOrderValueMinor,
      },
      requestStatusCounts,
      orderStatusCounts,
      recentActivity,
    });
  } catch (err: any) {
    console.error('Analytics compute error:', err);
    return NextResponse.json({ error: 'Failed to compute analytics.' }, { status: 500 });
  }
}
