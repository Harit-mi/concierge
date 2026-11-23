import { describe, it } from 'node:test';
import assert from 'node:assert';
import { canTransition, OrderStatus } from '../src/lib/state-machine';

describe('22-State Fulfilment Machine Transitions', () => {
  it('allows authorized forward transitions along the procurement path', () => {
    // 1. Operator moving request from SUBMITTED to UNDER_REVIEW
    const t1 = canTransition('REQUEST_SUBMITTED', 'UNDER_REVIEW', 'CONCIERGE_OPERATOR');
    assert.strictEqual(t1.allowed, true);

    // 2. Operator sending quote
    const t2 = canTransition('UNDER_REVIEW', 'QUOTE_SENT', 'CONCIERGE_OPERATOR');
    assert.strictEqual(t2.allowed, true);

    // 3. Customer accepting quote -> QUOTE_ACCEPTED -> AWAITING_PAYMENT
    const t3 = canTransition('QUOTE_SENT', 'QUOTE_ACCEPTED', 'CUSTOMER');
    assert.strictEqual(t3.allowed, true);

    const t3b = canTransition('QUOTE_ACCEPTED', 'AWAITING_PAYMENT', 'CUSTOMER');
    assert.strictEqual(t3b.allowed, false, 'AWAITING_PAYMENT is an automated system state rather than a direct customer action');

    // 4. Payment confirmed -> SOURCING_IN_PROGRESS
    const t4 = canTransition('PAYMENT_CONFIRMED', 'SOURCING_IN_PROGRESS', 'ADMIN');
    assert.strictEqual(t4.allowed, true);

    // 5. Intake -> Quality Check -> Packing -> Shipped -> Out for Delivery -> Delivered
    assert.strictEqual(canTransition('SOURCING_IN_PROGRESS', 'PRODUCT_ACQUIRED', 'CONCIERGE_OPERATOR').allowed, true);
    assert.strictEqual(canTransition('PRODUCT_ACQUIRED', 'QUALITY_CHECK', 'CONCIERGE_OPERATOR').allowed, true);
    assert.strictEqual(canTransition('QUALITY_CHECK', 'PACKING', 'CONCIERGE_OPERATOR').allowed, true);
    assert.strictEqual(canTransition('PACKING', 'SHIPPED', 'CONCIERGE_OPERATOR').allowed, true);
    assert.strictEqual(canTransition('SHIPPED', 'OUT_FOR_DELIVERY', 'CONCIERGE_OPERATOR').allowed, true);
    assert.strictEqual(canTransition('OUT_FOR_DELIVERY', 'DELIVERED', 'CONCIERGE_OPERATOR').allowed, true);
  });

  it('rejects illegal state jumps that bypass verification milestones', () => {
    // Cannot jump straight from REQUEST_SUBMITTED to DELIVERED
    const jump1 = canTransition('REQUEST_SUBMITTED', 'DELIVERED', 'ADMIN');
    assert.strictEqual(jump1.allowed, false);

    // Cannot jump from SOURCING_IN_PROGRESS to SHIPPED without intake/authentication
    const jump2 = canTransition('SOURCING_IN_PROGRESS', 'SHIPPED', 'CONCIERGE_OPERATOR');
    assert.strictEqual(jump2.allowed, false);

    // Cannot transition out of terminal state CANCELLED
    const term1 = canTransition('CANCELLED', 'SOURCING_IN_PROGRESS', 'ADMIN');
    assert.strictEqual(term1.allowed, false);

    // Cannot transition out of terminal state REFUNDED
    const term2 = canTransition('REFUNDED', 'DELIVERED', 'ADMIN');
    assert.strictEqual(term2.allowed, false);
  });

  it('enforces role-based transition guardrails', () => {
    // Customer CANNOT mark an item as QUALITY_CHECK or PACKING
    const custQuality = canTransition('PRODUCT_ACQUIRED', 'QUALITY_CHECK', 'CUSTOMER');
    assert.strictEqual(custQuality.allowed, false);

    // Customer CANNOT dispatch courier shipment
    const custShipment = canTransition('PACKING', 'SHIPPED', 'CUSTOMER');
    assert.strictEqual(custShipment.allowed, false);

    // Customer CAN request cancellation when order is in early phase
    const custCancel = canTransition('AWAITING_PAYMENT', 'CANCELLATION_REQUESTED', 'CUSTOMER');
    assert.strictEqual(custCancel.allowed, true);

    // Customer CAN confirm delivery upon arrival from OUT_FOR_DELIVERY
    const custDelivery = canTransition('OUT_FOR_DELIVERY', 'DELIVERED', 'CUSTOMER');
    assert.strictEqual(custDelivery.allowed, true);
  });
});
