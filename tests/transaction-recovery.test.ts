import { describe, it } from 'node:test';
import assert from 'node:assert';
import db, { withTransaction } from '../src/lib/db';

describe('Database Transaction Atomicity & Failure Recovery', () => {
  it('commits all mutations atomically when no error occurs', () => {
    const testOrderId = `ord-tx-success-${Date.now()}`;
    const testReqId = `req-tx-success-${Date.now()}`;
    const now = new Date().toISOString();

    withTransaction((txDb) => {
      txDb.prepare(`
        INSERT INTO product_requests (id, reference_number, customer_id, product_name, brand, category, destination_postal_code, status)
        VALUES (?, ?, 'usr-customer-1', 'Transaction Test Item', 'Brand', 'CLOTHING', '10001', 'AWAITING_PAYMENT')
      `).run(testReqId, `REQ-TX-${Date.now()}`);

      txDb.prepare(`
        INSERT INTO quotes (id, quote_number, request_id, product_price_minor, sourcing_fee_minor, shipping_fee_minor, applicable_taxes_minor, total_payable_minor, expires_at, expected_fulfilment_estimate, created_by_user_id)
        VALUES (?, ?, ?, 50000, 5000, 2500, 4000, 61500, ?, '5 days', 'usr-admin-1')
      `).run(`qte-${testReqId}`, `QTE-TX-${Date.now()}`, testReqId, now);

      txDb.prepare(`
        INSERT INTO orders (id, order_number, request_id, quote_id, customer_id, status, total_paid_minor)
        VALUES (?, ?, ?, ?, 'usr-customer-1', 'AWAITING_PAYMENT', 0)
      `).run(testOrderId, `ORD-TX-${Date.now()}`, testReqId, `qte-${testReqId}`);
    });

    // Verify all records were committed
    const order = db.prepare('SELECT id FROM orders WHERE id = ?').get(testOrderId);
    const req = db.prepare('SELECT id FROM product_requests WHERE id = ?').get(testReqId);
    assert.ok(order, 'Order should be committed');
    assert.ok(req, 'Request should be committed');
  });

  it('completely rolls back multi-table writes when an exception occurs midway', () => {
    const testOrderId = `ord-tx-fail-${Date.now()}`;
    const testReqId = `req-tx-fail-${Date.now()}`;
    const testPayId = `pay-tx-fail-${Date.now()}`;
    const now = new Date().toISOString();

    // 1. Initial seed for this test order
    db.prepare(`
      INSERT INTO product_requests (id, reference_number, customer_id, product_name, brand, category, destination_postal_code, status)
      VALUES (?, ?, 'usr-customer-1', 'Rollback Target Item', 'Brand', 'CLOTHING', '10001', 'AWAITING_PAYMENT')
    `).run(testReqId, `REQ-ROLLBACK-${Date.now()}`);

    db.prepare(`
      INSERT INTO quotes (id, quote_number, request_id, product_price_minor, sourcing_fee_minor, shipping_fee_minor, applicable_taxes_minor, total_payable_minor, expires_at, expected_fulfilment_estimate, created_by_user_id)
      VALUES (?, ?, ?, 80000, 8000, 2500, 6400, 96900, ?, '5 days', 'usr-admin-1')
    `).run(`qte-${testReqId}`, `QTE-RB-${Date.now()}`, testReqId, now);

    db.prepare(`
      INSERT INTO orders (id, order_number, request_id, quote_id, customer_id, status, total_paid_minor)
      VALUES (?, ?, ?, ?, 'usr-customer-1', 'AWAITING_PAYMENT', 0)
    `).run(testOrderId, `ORD-RB-${Date.now()}`, testReqId, `qte-${testReqId}`);

    // Verify initial state
    const preOrder = db.prepare('SELECT status, total_paid_minor FROM orders WHERE id = ?').get(testOrderId) as any;
    assert.strictEqual(preOrder.status, 'AWAITING_PAYMENT');
    assert.strictEqual(preOrder.total_paid_minor, 0);

    // 2. Execute a transaction that fails halfway
    let caughtError = false;
    try {
      withTransaction((txDb) => {
        // Step A: insert payment
        txDb.prepare(`
          INSERT INTO payments (id, order_id, payment_reference, provider, amount_minor, currency, status, provider_transaction_id, idempotency_key, verified_at, created_at)
          VALUES (?, ?, 'PAY-RB-TEMP', 'STRIPE', 96900, 'USD', 'VERIFIED', 'ch_rb_123', ?, ?, ?)
        `).run(testPayId, testOrderId, `idemp-rb-${Date.now()}`, now, now);

        // Step B: update order status
        txDb.prepare(`
          UPDATE orders SET status = 'PAYMENT_CONFIRMED', total_paid_minor = 96900 WHERE id = ?
        `).run(testOrderId);

        // Step C: SIMULATED UNHANDLED CRASH (e.g. Constraint violation or external system abort)
        throw new Error('SIMULATED_TRANSACTION_FAILURE: Crash before audit and status history completion!');
      });
    } catch (err: any) {
      caughtError = true;
      assert.ok(err.message.includes('SIMULATED_TRANSACTION_FAILURE'));
    }

    assert.strictEqual(caughtError, true, 'Error should have been caught');

    // 3. Verify clean rollback: Payment record must NOT exist
    const payment = db.prepare('SELECT * FROM payments WHERE id = ?').get(testPayId);
    assert.strictEqual(payment, undefined, 'Payment record must be rolled back');

    // 4. Verify order was rolled back to initial state
    const postOrder = db.prepare('SELECT status, total_paid_minor FROM orders WHERE id = ?').get(testOrderId) as any;
    assert.strictEqual(postOrder.status, 'AWAITING_PAYMENT', 'Order status must remain AWAITING_PAYMENT');
    assert.strictEqual(postOrder.total_paid_minor, 0, 'total_paid_minor must remain 0');
  });
});
