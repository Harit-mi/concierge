import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getSession } from '@/lib/auth';
import { recordAuditLog } from '@/lib/audit';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

const PROHIBITED_KEYWORDS = [
  'rolex', 'patek', 'audemars', 'omega', 'watch', 'timepiece',
  'perfume', 'cologne', 'fragrance', 'eau de parfum',
  'cosmetic', 'serum', 'skincare', 'creme',
  'iphone', 'ipad', 'laptop', 'macbook', 'airpods', 'electronic',
  'medicine', 'pharma', 'pill', 'supplement', 'drug'
];

export async function GET(req: NextRequest) {
  try {
    const sessionUser = await getSession();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get('status');
    const searchFilter = searchParams.get('q');

    let query = `
      SELECT r.*, 
             u.name as customerName, u.email as customerEmail, u.phone as customerPhone,
             s.name as assignedStaffName,
             q.id as quoteId, q.quote_number as quoteNumber, q.total_payable_minor as quoteTotalMinor, q.status as quoteStatus, q.expires_at as quoteExpiresAt,
             o.id as orderId, o.order_number as orderNumber, o.status as orderStatus
      FROM product_requests r
      JOIN users u ON r.customer_id = u.id
      LEFT JOIN users s ON r.assigned_staff_id = s.id
      LEFT JOIN quotes q ON r.id = q.request_id
      LEFT JOIN orders o ON r.id = o.request_id
      WHERE 1=1
    `;
    const params: any[] = [];

    // Customer can only view their own requests
    if (sessionUser.role === 'CUSTOMER') {
      query += ` AND r.customer_id = ? `;
      params.push(sessionUser.id);
    }

    if (statusFilter && statusFilter !== 'ALL') {
      query += ` AND r.status = ? `;
      params.push(statusFilter);
    }

    if (searchFilter) {
      query += ` AND (r.product_name LIKE ? OR r.brand LIKE ? OR r.reference_number LIKE ?) `;
      params.push(`%${searchFilter}%`, `%${searchFilter}%`, `%${searchFilter}%`);
    }

    query += ` ORDER BY r.created_at DESC `;

    const requests = db.prepare(query).all(...params);
    return NextResponse.json({ requests });
  } catch (err: any) {
    console.error('Fetch requests error:', err);
    return NextResponse.json({ error: 'Failed to retrieve requests.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const sessionUser = await getSession();
    const body = await req.json();

    const {
      productName,
      brand,
      productUrl,
      category,
      sizeVariant,
      colorVariant,
      preferredSeller,
      quantity = 1,
      maxBudgetMajor,
      destinationPostalCode,
      desiredDeliveryTimeframe,
      additionalNotes,
      customerName,
      customerEmail,
      customerPhone,
      consentGiven,
      images = [],
    } = body;

    // Validate consent
    const consentPassed = consentGiven || body.consentTerms || body.consentPrivacy;
    if (!consentPassed) {
      return NextResponse.json({ error: 'You must consent to the privacy policy and sourcing terms.' }, { status: 400 });
    }

    // Validate Required Fields
    if (!productName || !brand || !category || !destinationPostalCode) {
      return NextResponse.json({ error: 'Missing required request specifications.' }, { status: 400 });
    }

    // Validate Category
    const allowedCategories = ['CLOTHING', 'SNEAKERS_FOOTWEAR', 'ACCESSORIES_NON_REGULATED'];
    if (!allowedCategories.includes(category)) {
      return NextResponse.json({
        error: 'Invalid category. During this domestic pilot, only Clothing, Sneakers, and Non-Regulated Accessories are supported.'
      }, { status: 400 });
    }

    // Prohibited products keyword scan
    const combinedText = `${productName} ${brand} ${additionalNotes || ''}`.toLowerCase();
    for (const kw of PROHIBITED_KEYWORDS) {
      if (combinedText.includes(kw)) {
        return NextResponse.json({
          error: `Item flagged: "${kw}" is part of our restricted or specially regulated list (watches, fragrances, cosmetics, electronics, or medicines). We cannot service this request.`,
        }, { status: 422 });
      }
    }

    // Validate US Postal Code (Domestic pilot check)
    const postalRegex = /^[0-9]{5}(-[0-9]{4})?$/;
    if (!postalRegex.test(destinationPostalCode.trim())) {
      return NextResponse.json({
        error: 'Please enter a valid 5-digit US postal code. International sourcing is currently disabled.',
      }, { status: 400 });
    }

    // Determine Customer ID
    let customerId = sessionUser?.id;
    if (!customerId) {
      if (!customerEmail || !customerName) {
        return NextResponse.json({ error: 'Please provide your name and email address.' }, { status: 400 });
      }
      const cleanEmail = customerEmail.toLowerCase().trim();
      let user = db.prepare('SELECT id FROM users WHERE email = ?').get(cleanEmail) as { id: string } | undefined;

      if (!user) {
        // Auto-create customer account
        const newUserId = `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
        const tempPass = bcrypt.hashSync(Math.random().toString(36), 10);
        const now = new Date().toISOString();
        db.prepare(`
          INSERT INTO users (id, email, password_hash, name, phone, role, is_active, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, 'CUSTOMER', 1, ?, ?)
        `).run(newUserId, cleanEmail, tempPass, customerName.trim(), customerPhone || null, now, now);

        db.prepare(`
          INSERT INTO customer_profiles (id, user_id, preferred_currency, postal_code, country_code, created_at, updated_at)
          VALUES (?, ?, 'USD', ?, 'US', ?, ?)
        `).run(`prof-${newUserId}`, newUserId, destinationPostalCode.trim(), now, now);

        customerId = newUserId;
      } else {
        customerId = user.id;
      }
    }

    // Calculate Minor Units for Budget
    const maxBudgetMinor = maxBudgetMajor ? Math.round(parseFloat(maxBudgetMajor) * 100) : null;
    const requestId = `req-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const referenceNumber = `REQ-${new Date().getFullYear()}-${randomSuffix}`;
    const now = new Date().toISOString();

    // Insert Request
    db.prepare(`
      INSERT INTO product_requests (
        id, reference_number, customer_id, product_name, brand, product_url, category,
        size_variant, color_variant, preferred_seller, quantity, max_budget_minor, currency,
        destination_postal_code, desired_delivery_timeframe, additional_notes, status,
        consent_given_at, created_at, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, 'USD',
        ?, ?, ?, 'REQUEST_SUBMITTED',
        ?, ?, ?
      )
    `).run(
      requestId,
      referenceNumber,
      customerId,
      productName.trim(),
      brand.trim(),
      productUrl?.trim() || null,
      category,
      sizeVariant?.trim() || null,
      colorVariant?.trim() || null,
      preferredSeller?.trim() || null,
      parseInt(quantity, 10) || 1,
      maxBudgetMinor,
      destinationPostalCode.trim(),
      desiredDeliveryTimeframe?.trim() || null,
      additionalNotes?.trim() || null,
      now,
      now,
      now
    );

    // Save image references if provided
    if (Array.isArray(images) && images.length > 0) {
      const insertImg = db.prepare(`
        INSERT INTO product_request_images (id, request_id, file_name, file_url, file_size_bytes, mime_type, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      for (const img of images) {
        if (img.url) {
          insertImg.run(
            `img-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
            requestId,
            img.name || 'product-reference.jpg',
            img.url,
            img.size || 1024,
            img.type || 'image/jpeg',
            now
          );
        }
      }
    }

    // Status History
    db.prepare(`
      INSERT INTO request_status_history (id, request_id, from_status, to_status, changed_by_user_id, note, created_at)
      VALUES (?, ?, null, 'REQUEST_SUBMITTED', ?, 'Customer submitted new sourcing inquiry', ?)
    `).run(`rsh-${Date.now()}`, requestId, customerId, now);

    // Conversation thread init
    db.prepare(`
      INSERT INTO conversations (id, request_id, customer_id, last_message_at, created_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(`conv-${requestId}`, requestId, customerId, now, now);

    // Audit Log
    recordAuditLog(customerId, 'REQUEST_CREATED', 'product_requests', requestId, {
      referenceNumber,
      productName,
      brand,
    });

    return NextResponse.json({
      success: true,
      requestId,
      referenceNumber,
      request: {
        id: requestId,
        referenceNumber,
      },
      message: 'Product sourcing request created successfully.',
    });
  } catch (err: any) {
    console.error('Create request error:', err);
    return NextResponse.json({ error: err.message || 'Failed to submit request.' }, { status: 500 });
  }
}
