import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getSession } from '@/lib/auth';
import { calculateQuoteTotals } from '@/lib/pricing';
import { recordAuditLog } from '@/lib/audit';

export async function POST(req: NextRequest) {
  try {
    const sessionUser = await getSession();
    if (!sessionUser || sessionUser.role === 'CUSTOMER') {
      return NextResponse.json({ error: 'Only authorized concierge operators can generate quotes.' }, { status: 403 });
    }

    const body = await req.json();
    const {
      requestId,
      productPriceMajor,
      sourcingFeeMajor,
      shippingFeeMajor,
      taxMajor,
      chargesMajor = 0,
      discountMajor = 0,
      daysValid = 7,
      fulfilmentEstimate,
      notesAndAssumptions,
      lineItems = [],
    } = body;

    const request = db.prepare('SELECT * FROM product_requests WHERE id = ?').get(requestId) as any;
    if (!request) {
      return NextResponse.json({ error: 'Associated product request not found.' }, { status: 404 });
    }

    const productPriceMinor = Math.round(parseFloat(productPriceMajor || '0') * 100);
    const sourcingFeeMinor = Math.round(parseFloat(sourcingFeeMajor || '0') * 100);
    const shippingFeeMinor = Math.round(parseFloat(shippingFeeMajor || '0') * 100);
    const applicableTaxesMinor = Math.round(parseFloat(taxMajor || '0') * 100);
    const disclosedChargesMinor = Math.round(parseFloat(chargesMajor || '0') * 100);
    const discountMinor = Math.round(parseFloat(discountMajor || '0') * 100);

    const calculated = calculateQuoteTotals({
      productPriceMinor,
      sourcingFeeMinor,
      shippingFeeMinor,
      applicableTaxesMinor,
      disclosedChargesMinor,
      discountMinor,
    });

    const quoteId = `qte-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const quoteNumber = `QTE-${new Date().getFullYear()}-${randomNum}`;
    const now = new Date().toISOString();
    const expiresAt = new Date(Date.now() + daysValid * 86400000).toISOString();

    const insertQuote = db.prepare(`
      INSERT INTO quotes (
        id, quote_number, request_id, product_price_minor, sourcing_fee_minor,
        shipping_fee_minor, applicable_taxes_minor, disclosed_charges_minor, discount_minor,
        total_payable_minor, currency, expires_at, expected_fulfilment_estimate,
        notes_and_assumptions, status, created_by_user_id, created_at, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, 'USD', ?, ?,
        ?, 'QUOTE_SENT', ?, ?, ?
      )
    `);

    insertQuote.run(
      quoteId,
      quoteNumber,
      requestId,
      calculated.productPriceMinor,
      calculated.sourcingFeeMinor,
      calculated.shippingFeeMinor,
      calculated.applicableTaxesMinor,
      calculated.disclosedChargesMinor,
      calculated.discountMinor,
      calculated.totalPayableMinor,
      expiresAt,
      fulfilmentEstimate || '5-7 business days upon payment clearance',
      notesAndAssumptions || null,
      sessionUser.id,
      now,
      now
    );

    // Save line items
    const insertLineItem = db.prepare(`
      INSERT INTO quote_line_items (id, quote_id, description, category, amount_minor, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    if (Array.isArray(lineItems) && lineItems.length > 0) {
      for (const item of lineItems) {
        insertLineItem.run(
          `qli-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
          quoteId,
          item.description,
          item.category || 'PRODUCT',
          Math.round(parseFloat(item.amountMajor) * 100),
          now
        );
      }
    } else {
      // Auto generate standard line items
      insertLineItem.run(`qli-${Date.now()}-1`, quoteId, `${request.product_name} (${request.brand})`, 'PRODUCT', calculated.productPriceMinor, now);
      insertLineItem.run(`qli-${Date.now()}-2`, quoteId, 'Personal Concierge Sourcing & Authenticity Verification', 'SERVICE_FEE', calculated.sourcingFeeMinor, now);
      insertLineItem.run(`qli-${Date.now()}-3`, quoteId, 'Insured Domestic Priority Shipping', 'SHIPPING', calculated.shippingFeeMinor, now);
      if (calculated.applicableTaxesMinor > 0) {
        insertLineItem.run(`qli-${Date.now()}-4`, quoteId, 'Estimated Sales Tax', 'TAX', calculated.applicableTaxesMinor, now);
      }
    }

    // Transition request status to QUOTE_SENT
    db.prepare(`
      UPDATE product_requests
      SET status = 'QUOTE_SENT', updated_at = ?
      WHERE id = ?
    `).run(now, requestId);

    // Record Status History
    db.prepare(`
      INSERT INTO request_status_history (id, request_id, from_status, to_status, changed_by_user_id, note, created_at)
      VALUES (?, ?, ?, 'QUOTE_SENT', ?, 'Concierge dispatched itemized quote', ?)
    `).run(`rsh-${Date.now()}`, requestId, request.status, sessionUser.id, now);

    // Send in-platform notification to customer
    db.prepare(`
      INSERT INTO notifications (id, user_id, title, body, link_url, created_at)
      VALUES (?, ?, 'New Quote Available', ?, ?, ?)
    `).run(
      `notif-${Date.now()}`,
      request.customer_id,
      `Your sourcing quote for ${request.product_name} has arrived. Total: $${(calculated.totalPayableMinor / 100).toFixed(2)}.`,
      `/portal/requests/${request.id}`,
      now
    );

    recordAuditLog(sessionUser.id, 'QUOTE_CREATED', 'quotes', quoteId, {
      quoteNumber,
      requestId,
      totalPayableMinor: calculated.totalPayableMinor,
    });

    return NextResponse.json({
      success: true,
      quoteId,
      quoteNumber,
      totalPayableMinor: calculated.totalPayableMinor,
    });
  } catch (err: any) {
    console.error('Create quote error:', err);
    return NextResponse.json({ error: err.message || 'Failed to generate quote.' }, { status: 500 });
  }
}
