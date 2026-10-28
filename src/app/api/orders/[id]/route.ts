import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getSession } from '@/lib/auth';
import { recordAuditLog } from '@/lib/audit';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const sessionUser = await getSession();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const orderId = params.id;
    const order = db.prepare(`
      SELECT o.*,
             r.product_name, r.brand, r.category, r.size_variant, r.color_variant,
             r.destination_postal_code, r.desired_delivery_timeframe, r.additional_notes,
             r.reference_number as requestReferenceNumber,
             u.name as customerName, u.email as customerEmail, u.phone as customerPhone,
             s.name as assignedStaffName,
             q.quote_number, q.product_price_minor, q.sourcing_fee_minor, q.shipping_fee_minor,
             q.applicable_taxes_minor, q.disclosed_charges_minor, q.discount_minor,
             q.total_payable_minor, q.expected_fulfilment_estimate, q.notes_and_assumptions as quoteNotes
      FROM orders o
      JOIN product_requests r ON o.request_id = r.id
      JOIN users u ON o.customer_id = u.id
      JOIN quotes q ON o.quote_id = q.id
      LEFT JOIN users s ON o.assigned_staff_id = s.id
      WHERE o.id = ? OR o.order_number = ?
    `).get(orderId, orderId) as any;

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Role ownership check
    if (sessionUser.role === 'CUSTOMER' && order.customer_id !== sessionUser.id) {
      return NextResponse.json({ error: 'Unauthorized to view this order.' }, { status: 403 });
    }

    // Sourcing record
    const sourcingRecord = db.prepare(`
      SELECT src.*, sup.name as supplierName, sup.website as supplierWebsite
      FROM sourcing_records src
      LEFT JOIN suppliers sup ON src.supplier_id = sup.id
      WHERE src.order_id = ?
    `).get(order.id);

    // Shipment details
    const shipment = db.prepare('SELECT * FROM shipments WHERE order_id = ?').get(order.id);

    // Payments
    const payments = db.prepare('SELECT * FROM payments WHERE order_id = ? ORDER BY created_at DESC').all(order.id);

    // Refunds
    const refunds = db.prepare('SELECT * FROM refunds WHERE order_id = ? ORDER BY created_at DESC').all(order.id);

    // Order status history
    const statusHistory = db.prepare(`
      SELECT h.*, u.name as changedByName, u.role as changedByRole
      FROM order_status_history h
      JOIN users u ON h.changed_by_user_id = u.id
      WHERE h.order_id = ?
      ORDER BY h.created_at ASC
    `).all(order.id);

    // Delivery confirmation
    const deliveryConfirmation = db.prepare('SELECT * FROM delivery_confirmations WHERE order_id = ?').get(order.id);

    // Documents (filtered by role confidentiality)
    let documentsQuery = 'SELECT * FROM documents WHERE order_id = ? OR request_id = ?';
    if (sessionUser.role === 'CUSTOMER') {
      documentsQuery += ' AND is_confidential_operator_only = 0';
    }
    const documents = db.prepare(documentsQuery).all(order.id, order.request_id);

    return NextResponse.json({
      order,
      sourcingRecord,
      shipment,
      payments,
      refunds,
      statusHistory,
      deliveryConfirmation,
      documents,
    });
  } catch (err: any) {
    console.error('Fetch order details error:', err);
    return NextResponse.json({ error: 'Failed to retrieve order details.' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const sessionUser = await getSession();
    if (!sessionUser || sessionUser.role === 'CUSTOMER') {
      return NextResponse.json({ error: 'Only operators can modify order fulfilment details.' }, { status: 403 });
    }

    const orderId = params.id;
    const body = await req.json();
    const { sourcing, shipment: shipmentData, assignedStaffId } = body;
    const now = new Date().toISOString();

    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId) as any;
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // 1. Upsert Sourcing Record
    if (sourcing) {
      const existing = db.prepare('SELECT id FROM sourcing_records WHERE order_id = ?').get(orderId) as any;
      const costMinor = Math.round(parseFloat(sourcing.costPriceMajor || '0') * 100);

      if (existing) {
        db.prepare(`
          UPDATE sourcing_records
          SET supplier_id = ?, supplier_order_reference = ?, cost_price_minor = ?,
              acquisition_date = ?, quality_check_notes = ?, quality_passed = ?, updated_at = ?
          WHERE id = ?
        `).run(
          sourcing.supplierId || null,
          sourcing.supplierOrderReference || null,
          costMinor,
          sourcing.acquisitionDate || null,
          sourcing.qualityCheckNotes || null,
          sourcing.qualityPassed !== undefined ? (sourcing.qualityPassed ? 1 : 0) : null,
          now,
          existing.id
        );
      } else {
        db.prepare(`
          INSERT INTO sourcing_records (
            id, order_id, supplier_id, supplier_order_reference, cost_price_minor,
            currency, acquisition_date, quality_check_notes, quality_passed, created_by_user_id,
            created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, 'USD', ?, ?, ?, ?, ?, ?)
        `).run(
          `src-${Date.now()}`,
          orderId,
          sourcing.supplierId || null,
          sourcing.supplierOrderReference || null,
          costMinor,
          sourcing.acquisitionDate || null,
          sourcing.qualityCheckNotes || null,
          sourcing.qualityPassed !== undefined ? (sourcing.qualityPassed ? 1 : 0) : null,
          sessionUser.id,
          now,
          now
        );
      }
      recordAuditLog(sessionUser.id, 'SOURCING_RECORD_UPDATED', 'orders', orderId, sourcing);
    }

    // 2. Upsert Shipment
    if (shipmentData) {
      const existingShipment = db.prepare('SELECT id FROM shipments WHERE order_id = ?').get(orderId) as any;
      if (existingShipment) {
        db.prepare(`
          UPDATE shipments
          SET carrier_name = ?, tracking_number = ?, tracking_url = ?, status = ?,
              shipped_at = ?, estimated_delivery_at = ?, updated_at = ?
          WHERE id = ?
        `).run(
          shipmentData.carrierName,
          shipmentData.trackingNumber,
          shipmentData.trackingUrl || null,
          shipmentData.status || 'LABEL_CREATED',
          shipmentData.shippedAt || now,
          shipmentData.estimatedDeliveryAt || null,
          now,
          existingShipment.id
        );
      } else {
        db.prepare(`
          INSERT INTO shipments (
            id, order_id, carrier_name, tracking_number, tracking_url,
            status, shipped_at, estimated_delivery_at, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          `shp-${Date.now()}`,
          orderId,
          shipmentData.carrierName,
          shipmentData.trackingNumber,
          shipmentData.trackingUrl || null,
          shipmentData.status || 'SHIPPED',
          shipmentData.shippedAt || now,
          shipmentData.estimatedDeliveryAt || null,
          now,
          now
        );
      }
      recordAuditLog(sessionUser.id, 'SHIPMENT_UPDATED', 'orders', orderId, shipmentData);
    }

    // 3. Staff Assignment
    if (assignedStaffId) {
      db.prepare('UPDATE orders SET assigned_staff_id = ?, updated_at = ? WHERE id = ?').run(assignedStaffId, now, orderId);
      db.prepare('UPDATE product_requests SET assigned_staff_id = ?, updated_at = ? WHERE id = ?').run(assignedStaffId, now, order.request_id);
    }

    return NextResponse.json({ success: true, message: 'Order details updated successfully.' });
  } catch (err: any) {
    console.error('Update order error:', err);
    return NextResponse.json({ error: err.message || 'Failed to update order.' }, { status: 500 });
  }
}
