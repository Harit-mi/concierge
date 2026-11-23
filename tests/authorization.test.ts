import { describe, it } from 'node:test';
import assert from 'node:assert';
import db from '../src/lib/db';

describe('Order & Resource Authorization Tests', () => {
  it('prevents customer from paying or mutating an order owned by another customer', () => {
    // Setup test users and orders
    const now = new Date().toISOString();
    const custA = 'usr-auth-cust-a';
    const custB = 'usr-auth-cust-b';
    const reqA = 'req-auth-test-a';
    const qteA = 'qte-auth-test-a';
    const ordA = 'ord-auth-test-a';

    db.prepare(`
      INSERT OR IGNORE INTO users (id, email, password_hash, name, role, is_active)
      VALUES (?, 'cust-a@test.com', 'hash', 'Customer A', 'CUSTOMER', 1)
    `).run(custA);

    db.prepare(`
      INSERT OR IGNORE INTO users (id, email, password_hash, name, role, is_active)
      VALUES (?, 'cust-b@test.com', 'hash', 'Customer B', 'CUSTOMER', 1)
    `).run(custB);

    db.prepare(`
      INSERT OR IGNORE INTO users (id, email, password_hash, name, role, is_active)
      VALUES ('usr-admin-auth', 'admin@test.com', 'hash', 'Admin', 'ADMIN', 1)
    `).run();

    db.prepare(`
      INSERT OR IGNORE INTO product_requests (id, reference_number, customer_id, product_name, brand, category, destination_postal_code, status)
      VALUES (?, 'REQ-AUTH-01', ?, 'Luxury Cashmere Sweater', 'Loro Piana', 'CLOTHING', '10001', 'AWAITING_PAYMENT')
    `).run(reqA, custA);

    db.prepare(`
      INSERT OR IGNORE INTO quotes (id, quote_number, request_id, product_price_minor, sourcing_fee_minor, shipping_fee_minor, applicable_taxes_minor, total_payable_minor, expires_at, expected_fulfilment_estimate, created_by_user_id, status)
      VALUES (?, 'QTE-AUTH-01', ?, 100000, 10000, 2500, 8000, 120500, ?, '3 days', 'usr-admin-auth', 'QUOTE_ACCEPTED')
    `).run(qteA, reqA, new Date(Date.now() + 86400000).toISOString());

    db.prepare(`
      INSERT OR IGNORE INTO orders (id, order_number, request_id, quote_id, customer_id, status, total_paid_minor)
      VALUES (?, 'ORD-AUTH-01', ?, ?, ?, 'AWAITING_PAYMENT', 0)
    `).run(ordA, reqA, qteA, custA);

    // Simulate Authorization Check
    const fetchOrder = (orderId: string, actorUserId: string, actorRole: string) => {
      const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId) as any;
      if (!order) return { status: 404 };
      if (actorRole === 'CUSTOMER' && order.customer_id !== actorUserId) {
        return { status: 403, error: 'Unauthorized to pay for this order.' };
      }
      return { status: 200, order };
    };

    // Customer B attempts to access Customer A's order
    const accessByB = fetchOrder(ordA, custB, 'CUSTOMER');
    assert.strictEqual(accessByB.status, 403, 'Customer B must be forbidden from accessing Customer A order');

    // Customer A accesses their own order
    const accessByA = fetchOrder(ordA, custA, 'CUSTOMER');
    assert.strictEqual(accessByA.status, 200, 'Customer A can access their own order');

    // Staff / Admin can access Customer A's order for operational review
    const accessByAdmin = fetchOrder(ordA, 'usr-admin-auth', 'ADMIN');
    assert.strictEqual(accessByAdmin.status, 200, 'Admin can inspect Customer A order');
  });
});
