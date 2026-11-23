import { describe, it } from 'node:test';
import assert from 'node:assert';
import crypto from 'crypto';
import db, { withTransaction } from '../src/lib/db';
import { MockPaymentProvider } from '../src/lib/payment/mock';
import { StripePaymentProvider } from '../src/lib/payment/stripe';
import { _resetConfigForTesting } from '../src/lib/config';

describe('Payment, Idempotency & Webhook Verification', () => {
  it('rejects idempotency result before ownership authorization', () => {
    const custOwner = 'usr-pay-owner';
    const custAttacker = 'usr-pay-attacker';
    const ordId = 'ord-pay-idemp-01';
    const idempKey = 'idemp_token_unique_9981';

    db.prepare(`
      INSERT OR IGNORE INTO users (id, email, password_hash, name, role, is_active)
      VALUES (?, 'owner@veritas.private', 'hash', 'Owner', 'CUSTOMER', 1)
    `).run(custOwner);

    db.prepare(`
      INSERT OR IGNORE INTO users (id, email, password_hash, name, role, is_active)
      VALUES (?, 'attacker@veritas.private', 'hash', 'Attacker', 'CUSTOMER', 1)
    `).run(custAttacker);

    db.prepare(`
      INSERT OR IGNORE INTO users (id, email, password_hash, name, role, is_active)
      VALUES ('usr-admin-1', 'admin@veritas.private', 'hash', 'Admin', 'ADMIN', 1)
    `).run();

    db.prepare(`
      INSERT OR IGNORE INTO product_requests (id, reference_number, customer_id, product_name, brand, category, destination_postal_code, status)
      VALUES ('req-pay-01', 'REQ-PAY-01', ?, 'Chanel Flap Bag', 'Chanel', 'ACCESSORIES_NON_REGULATED', '10001', 'AWAITING_PAYMENT')
    `).run(custOwner);

    db.prepare(`
      INSERT OR IGNORE INTO quotes (id, quote_number, request_id, product_price_minor, sourcing_fee_minor, shipping_fee_minor, applicable_taxes_minor, total_payable_minor, expires_at, expected_fulfilment_estimate, created_by_user_id, status)
      VALUES ('qte-pay-01', 'QTE-PAY-01', 'req-pay-01', 500000, 50000, 5000, 40000, 595000, ?, '5 days', 'usr-admin-1', 'QUOTE_ACCEPTED')
    `).run(new Date(Date.now() + 86400000).toISOString());

    db.prepare(`
      INSERT OR IGNORE INTO orders (id, order_number, request_id, quote_id, customer_id, status, total_paid_minor)
      VALUES (?, 'ORD-PAY-01', 'req-pay-01', 'qte-pay-01', ?, 'AWAITING_PAYMENT', 0)
    `).run(ordId, custOwner);

    // Record an existing payment with this idempotency key
    db.prepare(`
      INSERT OR IGNORE INTO payments (id, order_id, payment_reference, provider, amount_minor, currency, status, provider_transaction_id, idempotency_key, verified_at, created_at)
      VALUES ('pay-idemp-test', ?, 'PAY-REF-9981', 'STRIPE', 595000, 'USD', 'VERIFIED', 'ch_test_9981', ?, ?, ?)
    `).run(ordId, idempKey, new Date().toISOString(), new Date().toISOString());

    // Simulated API handler checking ownership FIRST before returning idempotency result
    const processPayment = (orderId: string, actorUserId: string, actorRole: string, key: string) => {
      const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId) as any;
      if (!order) return { status: 404 };

      // 1. Ownership check MUST happen before idempotency lookup!
      if (actorRole === 'CUSTOMER' && order.customer_id !== actorUserId) {
        return { status: 403, error: 'Unauthorized to pay for this order.' };
      }

      // 2. Idempotency check after ownership confirmation
      const existing = db.prepare('SELECT * FROM payments WHERE idempotency_key = ?').get(key) as any;
      if (existing) {
        if (existing.order_id !== order.id) {
          return { status: 409, error: 'Idempotency key collision.' };
        }
        return { status: 200, isIdempotentReturn: true, payment: existing };
      }

      return { status: 200, isNewPayment: true };
    };

    // Attacker tries to submit or retrieve payment details using the key
    const attackerAttempt = processPayment(ordId, custAttacker, 'CUSTOMER', idempKey);
    assert.strictEqual(
      attackerAttempt.status,
      403,
      'Attacker must be blocked by 403 before any payment or idempotency record is returned'
    );

    // Legitimate owner gets the idempotent return
    const ownerAttempt = processPayment(ordId, custOwner, 'CUSTOMER', idempKey);
    assert.strictEqual(ownerAttempt.status, 200);
    assert.strictEqual(ownerAttempt.isIdempotentReturn, true);
    assert.strictEqual(ownerAttempt.payment.payment_reference, 'PAY-REF-9981');
  });

  it('verifies cryptographically valid webhook signatures and rejects tampered ones', async () => {
    const mockProvider = new MockPaymentProvider();
    const rawPayload = JSON.stringify({
      id: 'evt_stripe_test_001',
      type: 'payment_intent.succeeded',
      data: {
        object: {
          id: 'pi_test_stripe_001',
          amount: 64100,
          currency: 'usd',
          client_reference_id: 'ord-travis-01',
          metadata: { order_id: 'ord-travis-01', idempotency_key: 'idemp_wh_001' },
        },
      },
    });

    // 1. Valid signature
    const validSig = mockProvider.generateMockSignature(rawPayload);
    const parsedEvent = await mockProvider.verifyAndParseWebhook(rawPayload, validSig);
    assert.ok(parsedEvent);
    assert.strictEqual(parsedEvent.orderId, 'ord-travis-01');
    assert.strictEqual(parsedEvent.amountMinor, 64100);
    assert.strictEqual(parsedEvent.eventType, 'payment_intent.succeeded');

    // 2. Tampered body should fail verification
    const tamperedPayload = rawPayload.replace('64100', '10000');
    await assert.rejects(
      async () => {
        await mockProvider.verifyAndParseWebhook(tamperedPayload, validSig);
      },
      (err: any) => err.message.includes('signature verification failed')
    );

    // 3. Fake signature should fail verification
    await assert.rejects(
      async () => {
        await mockProvider.verifyAndParseWebhook(rawPayload, 't=1234567,v1=bad_signature_hash');
      },
      (err: any) => err.message.includes('signature verification failed')
    );
  });

  it('rejects webhook with timestamp outside 300-second tolerance window', async () => {
    (process.env as any).NODE_ENV = 'development';
    process.env.STRIPE_SECRET_KEY = 'sk_test_123';
    process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test_secret_1234567890';
    _resetConfigForTesting();

    const stripeProvider = new StripePaymentProvider();
    const rawPayload = JSON.stringify({ id: 'evt_old_01', type: 'payment_intent.succeeded' });

    // Timestamp from 10 minutes ago (600 seconds)
    const oldTimestamp = Math.floor(Date.now() / 1000) - 600;
    const signedPayload = `${oldTimestamp}.${rawPayload}`;
    const sig = crypto.createHmac('sha256', 'whsec_test_secret_1234567890').update(signedPayload, 'utf8').digest('hex');
    const oldSigHeader = `t=${oldTimestamp},v1=${sig}`;

    await assert.rejects(
      async () => {
        await stripeProvider.verifyAndParseWebhook(rawPayload, oldSigHeader);
      },
      (err: any) => err.message.includes('timestamp outside tolerance window')
    );
  });
});
