import { NextRequest, NextResponse } from 'next/server';
import db, { withTransaction } from '@/lib/db';
import { getPaymentProvider } from '@/lib/payment';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('stripe-signature') || req.headers.get('Stripe-Signature') || '';

    const provider = getPaymentProvider();
    const event = await provider.verifyAndParseWebhook(rawBody, signature);

    if (!event) {
      return NextResponse.json({ error: 'Unrecognized event payload' }, { status: 400 });
    }

    // Process payment success events
    if (event.eventType === 'payment_intent.succeeded' || event.eventType === 'checkout.session.completed') {
      const orderId = event.orderId;
      if (!orderId) {
        console.warn('Webhook received without order reference in metadata:', event.eventId);
        return NextResponse.json({ received: true, warning: 'No orderId attached' });
      }

      const order = db.prepare(`
        SELECT o.*, r.id as requestId, r.reference_number
        FROM orders o
        JOIN product_requests r ON o.request_id = r.id
        WHERE o.id = ?
      `).get(orderId) as any;

      if (!order) {
        console.warn(`Order #${orderId} not found for webhook event ${event.eventId}`);
        return NextResponse.json({ received: true, warning: 'Order not found' });
      }

      // Idempotency: If order is already paid, acknowledge without duplicating state history
      if (order.status !== 'AWAITING_PAYMENT') {
        return NextResponse.json({
          received: true,
          message: `Order #${order.order_number} already in state ${order.status}`,
        });
      }

      const now = new Date().toISOString();
      const paymentRef = `PAY-STRIPE-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      withTransaction((txDb) => {
        // 1. Record verified payment
        txDb.prepare(`
          INSERT INTO payments (
            id, order_id, payment_reference, provider, amount_minor, currency, status,
            provider_transaction_id, idempotency_key, verified_at, raw_payload_json, created_at
          ) VALUES (?, ?, ?, 'STRIPE', ?, ?, 'VERIFIED', ?, ?, ?, ?, ?)
        `).run(
          `pay-hook-${event.eventId}`,
          orderId,
          paymentRef,
          event.amountMinor || order.total_paid_minor,
          event.currency || 'USD',
          event.providerTransactionId,
          event.idempotencyKey || `wh_evt_${event.eventId}`,
          now,
          JSON.stringify(event.rawPayload),
          now
        );

        // 2. Update Order status
        txDb.prepare(`
          UPDATE orders
          SET status = 'PAYMENT_CONFIRMED', total_paid_minor = ?, updated_at = ?
          WHERE id = ?
        `).run(event.amountMinor, now, orderId);

        // 3. Update Request status
        txDb.prepare(`
          UPDATE product_requests
          SET status = 'PAYMENT_CONFIRMED', updated_at = ?
          WHERE id = ?
        `).run(now, order.requestId);

        // 4. Record status histories
        txDb.prepare(`
          INSERT INTO order_status_history (id, order_id, from_status, to_status, changed_by_user_id, note, created_at)
          VALUES (?, ?, 'AWAITING_PAYMENT', 'PAYMENT_CONFIRMED', 'usr-system-webhook', 'Verified via Stripe webhook signature.', ?)
        `).run(`osh-${Date.now()}`, orderId, now);

        txDb.prepare(`
          INSERT INTO request_status_history (id, request_id, from_status, to_status, changed_by_user_id, note, created_at)
          VALUES (?, ?, 'AWAITING_PAYMENT', 'PAYMENT_CONFIRMED', 'usr-system-webhook', 'Payment confirmed via Stripe webhook.', ?)
        `).run(`rsh-${Date.now()}`, order.requestId, now);

        // 5. Notify assigned staff
        if (order.assigned_staff_id) {
          txDb.prepare(`
            INSERT INTO notifications (id, user_id, title, body, link_url, created_at)
            VALUES (?, ?, 'Payment Confirmed (Webhook)', ?, ?, ?)
          `).run(
            `notif-${Date.now()}`,
            order.assigned_staff_id,
            `Verified payment received for Order #${order.order_number}. Sourcing authorized.`,
            `/admin/orders/${order.id}`,
            now
          );
        }

        // 6. Record audit log
        txDb.prepare(`
          INSERT INTO audit_logs (id, actor_user_id, action_type, resource_type, resource_id, metadata_json, created_at)
          VALUES (?, 'usr-system-webhook', 'PAYMENT_WEBHOOK_VERIFIED', 'orders', ?, ?, ?)
        `).run(
          `aud-wh-${event.eventId}`,
          orderId,
          JSON.stringify({
            eventId: event.eventId,
            amountMinor: event.amountMinor,
            providerTxnId: event.providerTransactionId,
          }),
          now
        );
      });

      return NextResponse.json({ received: true, orderId, status: 'PAYMENT_CONFIRMED' });
    }

    return NextResponse.json({ received: true, unhandledType: event.eventType });
  } catch (err: any) {
    console.error('Webhook error:', err);
    return NextResponse.json({ error: err.message || 'Webhook verification failed' }, { status: 400 });
  }
}
