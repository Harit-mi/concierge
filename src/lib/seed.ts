import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';

export function seedDemoData(db: Database.Database) {
  const passwordHash = bcrypt.hashSync('password123', 10);
  const now = new Date().toISOString();

  // Insert Users idempotently
  const insertUser = db.prepare(`
    INSERT OR IGNORE INTO users (id, email, password_hash, name, phone, role, is_active, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?)
  `);

  insertUser.run('usr-admin-1', 'admin@example.com', passwordHash, 'Eleanor Vance (Head of Operations)', '+1 (555) 019-2831', 'ADMIN', now, now);
  insertUser.run('usr-concierge-1', 'concierge@example.com', passwordHash, 'Julian Thorne (Senior Sourcing Specialist)', '+1 (555) 019-4820', 'CONCIERGE_OPERATOR', now, now);
  insertUser.run('usr-customer-1', 'customer@example.com', passwordHash, 'Alexander Hayes', '+1 (555) 012-9842', 'CUSTOMER', now, now);
  insertUser.run('usr-customer-2', 'clara@example.com', passwordHash, 'Clara Dupont', '+1 (555) 014-7719', 'CUSTOMER', now, now);

  // Insert Profile
  const insertProfile = db.prepare(`
    INSERT OR IGNORE INTO customer_profiles (id, user_id, preferred_currency, shipping_address_line1, city, state_province, postal_code, country_code, delivery_instructions)
    VALUES (?, ?, 'USD', '742 Evergreen Terrace, Apt 4B', 'New York', 'NY', '10001', 'US', 'Leave with 24/7 building concierge. Signature required for high-value parcels.')
  `);
  insertProfile.run('prof-1', 'usr-customer-1');

  // Insert Verified Suppliers
  const insertSupplier = db.prepare(`
    INSERT OR IGNORE INTO suppliers (id, name, contact_email, website, reputation_score, is_verified, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  insertSupplier.run('sup-1', 'Atelier Vault Milan', 'orders@ateliervault.it', 'https://ateliervault.it', 5, 1, 'Verified luxury archive partner. Certified provenance.');
  insertSupplier.run('sup-2', 'Flight Club / Stadium Goods Wholesale', 'concierge@flightclub.com', 'https://flightclub.com', 5, 1, 'Tier-1 sneaker verification partner with double authentication guarantee.');
  insertSupplier.run('sup-3', 'Tokyo Rare Archive', 'japan@tokyoarchive.jp', 'https://tokyoarchive.jp', 5, 1, 'Japanese domestic designer boutique specializing in vintage Issey Miyake & Yohji.');

  // Request 1: Travis Scott Air Jordan 1 Low 'Canary' (Paid and Sourcing)
  const req1Id = 'req-travis-01';
  db.prepare(`
    INSERT OR IGNORE INTO product_requests (
      id, reference_number, customer_id, product_name, brand, product_url, category,
      size_variant, color_variant, preferred_seller, quantity, max_budget_minor, currency,
      destination_postal_code, desired_delivery_timeframe, additional_notes, assigned_staff_id,
      status, consent_given_at, created_at, updated_at
    ) VALUES (
      ?, 'REQ-2026-9041', 'usr-customer-1', 'Air Jordan 1 Retro Low OG SP "Canary"', 'Jordan / Travis Scott',
      'https://www.nike.com/launch/t/air-jordan-1-low-travis-scott-canary', 'SNEAKERS_FOOTWEAR',
      'US Men 10.5', 'Canary / Racer Blue / Light Silver', 'GOAT or Flight Club verified deadstock',
      1, 65000, 'USD', '10001', 'Within 7 business days',
      'Must include original undamaged box, extra laces, and verified authentication tags.',
      'usr-concierge-1', 'SOURCING_IN_PROGRESS', ?, ?, ?
    )
  `).run(req1Id, now, now, now);

  // Quote 1
  const qte1Id = 'qte-travis-01';
  const expiresAt = new Date(Date.now() + 7 * 86400000).toISOString();
  db.prepare(`
    INSERT OR IGNORE INTO quotes (
      id, quote_number, request_id, product_price_minor, sourcing_fee_minor, shipping_fee_minor,
      applicable_taxes_minor, disclosed_charges_minor, discount_minor, total_payable_minor,
      currency, expires_at, expected_fulfilment_estimate, notes_and_assumptions, status,
      customer_action_at, created_by_user_id, created_at, updated_at
    ) VALUES (
      ?, 'QTE-2026-8801', ?, 52000, 5000, 2500, 4600, 0, 0, 64100,
      'USD', ?, '5-7 business days via insured overnight courier',
      'Verified Deadstock Grade A. Sourced from authorized consignment partner with physical RFID scan.',
      'QUOTE_ACCEPTED', ?, 'usr-concierge-1', ?, ?
    )
  `).run(qte1Id, req1Id, expiresAt, now, now, now);

  // Quote 1 Line Items
  const insertLineItem = db.prepare(`
    INSERT OR IGNORE INTO quote_line_items (id, quote_id, description, category, amount_minor)
    VALUES (?, ?, ?, ?, ?)
  `);
  insertLineItem.run('qli-1', qte1Id, 'Air Jordan 1 Retro Low OG SP "Canary" (Deadstock US 10.5)', 'PRODUCT', 52000);
  insertLineItem.run('qli-2', qte1Id, 'Concierge Personal Sourcing & Provenance Authentication Fee', 'SERVICE_FEE', 5000);
  insertLineItem.run('qli-3', qte1Id, 'Domestic Insured Priority Courier Delivery', 'SHIPPING', 2500);
  insertLineItem.run('qli-4', qte1Id, 'Applicable Domestic State Sales Tax (Estimated)', 'TAX', 4600);

  // Order 1
  const ord1Id = 'ord-travis-01';
  db.prepare(`
    INSERT OR IGNORE INTO orders (
      id, order_number, request_id, quote_id, customer_id, assigned_staff_id, status,
      total_paid_minor, currency, created_at, updated_at
    ) VALUES (
      ?, 'ORD-2026-1029', ?, ?, 'usr-customer-1', 'usr-concierge-1', 'SOURCING_IN_PROGRESS',
      64100, 'USD', ?, ?
    )
  `).run(ord1Id, req1Id, qte1Id, now, now);

  // Payment 1
  db.prepare(`
    INSERT OR IGNORE INTO payments (
      id, order_id, payment_reference, provider, amount_minor, currency, status,
      provider_transaction_id, idempotency_key, verified_at, created_at
    ) VALUES (
      'pay-01', ?, 'PAY-REF-2026-778', 'STRIPE_VERIFIED', 64100, 'USD', 'VERIFIED',
      'ch_3OpxZ2LkdIwHu7ix0rWXYZ', 'idemp_key_ord_1029_init', ?, ?
    )
  `).run(ord1Id, now, now);

  // Sourcing Record 1
  db.prepare(`
    INSERT OR IGNORE INTO sourcing_records (
      id, order_id, supplier_id, supplier_order_reference, cost_price_minor, currency,
      acquisition_date, quality_check_notes, quality_passed, created_by_user_id, created_at
    ) VALUES (
      'src-01', ?, 'sup-2', 'FC-NY-99214', 51000, 'USD', ?,
      'Order placed with Tier-1 partner. Physical unit dispatched to our Manhattan intake lounge.',
      null, 'usr-concierge-1', ?
    )
  `).run(ord1Id, now, now);

  // Request 2: Issey Miyake Homme Plissé Pleated Blazer (Under Review)
  const req2Id = 'req-issey-02';
  db.prepare(`
    INSERT OR IGNORE INTO product_requests (
      id, reference_number, customer_id, product_name, brand, product_url, category,
      size_variant, color_variant, preferred_seller, quantity, max_budget_minor, currency,
      destination_postal_code, desired_delivery_timeframe, additional_notes, assigned_staff_id,
      status, consent_given_at, created_at, updated_at
    ) VALUES (
      ?, 'REQ-2026-9042', 'usr-customer-1', 'Homme Plissé Basic Pleated Tailored Jacket', 'Homme Plissé Issey Miyake',
      'https://us-store.isseymiyake.com/collections/homme-plisse', 'CLOTHING',
      'Size 3 (Medium/Large)', 'Charcoal Grey / Black', 'Official boutique or SSENSE',
      1, 80000, 'USD', '10001', 'Next 10 days',
      'Looking for pristine condition with original garment dust cover.',
      'usr-concierge-1', 'UNDER_REVIEW', ?, ?, ?
    )
  `).run(req2Id, now, now, now);

  // Request 3: Bottega Veneta Intrecciato Leather Card Case (New - Request Submitted)
  const req3Id = 'req-bottega-03';
  db.prepare(`
    INSERT OR IGNORE INTO product_requests (
      id, reference_number, customer_id, product_name, brand, product_url, category,
      size_variant, color_variant, preferred_seller, quantity, max_budget_minor, currency,
      destination_postal_code, desired_delivery_timeframe, additional_notes, assigned_staff_id,
      status, consent_given_at, created_at, updated_at
    ) VALUES (
      ?, 'REQ-2026-9043', 'usr-customer-2', 'Intrecciato Calfskin Card Case', 'Bottega Veneta',
      'https://www.bottegaveneta.com/en-us/credit-card-case', 'ACCESSORIES_NON_REGULATED',
      'One Size (6 Card Slots)', 'Deep Parakeet Green or Fondant Dark Brown', 'Any authorized retailer',
      1, 45000, 'USD', '90210', 'As soon as verified',
      'Must be authentic with presentation box and felt pouch.',
      null, 'REQUEST_SUBMITTED', ?, ?, ?
    )
  `).run(req3Id, now, now, now);

  // Conversation & Messages for Request 1
  const conv1Id = 'conv-01';
  db.prepare(`
    INSERT OR IGNORE INTO conversations (id, request_id, order_id, customer_id, last_message_at, created_at)
    VALUES (?, ?, ?, 'usr-customer-1', ?, ?)
  `).run(conv1Id, req1Id, ord1Id, now, now);

  const insertMsg = db.prepare(`
    INSERT OR IGNORE INTO messages (id, conversation_id, sender_id, message_text, is_internal_note, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  insertMsg.run('msg-1', conv1Id, 'usr-concierge-1', 'Hello Alexander, I have located deadstock inventory for the Canary Jordan 1 in US 10.5 from our verified partner. Sourcing has commenced.', 0, now);
  insertMsg.run('msg-2', conv1Id, 'usr-customer-1', 'Thank you Julian! Excited to receive it. Please inspect the box corners closely during quality check.', 0, now);
  insertMsg.run('msg-3', conv1Id, 'usr-concierge-1', 'Absolutely. Our intake protocol includes high-res photography of the box edges, barcode labels, and UV seam inspection.', 0, now);

  // Documents
  const insertDoc = db.prepare(`
    INSERT OR IGNORE INTO documents (id, request_id, order_id, uploaded_by_user_id, document_type, title, file_path, mime_type, is_confidential_operator_only, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertDoc.run('doc-1', req1Id, ord1Id, 'usr-concierge-1', 'QUOTE_PDF', 'Itemized Concierge Sourcing Quote #QTE-2026-8801.pdf', '/documents/quotes/QTE-2026-8801.pdf', 'application/pdf', 0, now);
  insertDoc.run('doc-2', req1Id, ord1Id, 'usr-concierge-1', 'CUSTOMER_RECEIPT', 'Payment Receipt & Sourcing Authorization #PAY-778.pdf', '/documents/receipts/PAY-778.pdf', 'application/pdf', 0, now);
  insertDoc.run('doc-3', req1Id, ord1Id, 'usr-concierge-1', 'SUPPLIER_INVOICE', 'Partner Wholesaler Invoice #FC-NY-99214.pdf', '/documents/internal/FC-NY-99214.pdf', 'application/pdf', 1, now);

  // Initial Audit Logs
  const insertAudit = db.prepare(`
    INSERT OR IGNORE INTO audit_logs (id, actor_user_id, action_type, resource_type, resource_id, metadata_json, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  insertAudit.run('aud-1', 'usr-customer-1', 'REQUEST_CREATED', 'product_requests', req1Id, JSON.stringify({ ref: 'REQ-2026-9041' }), now);
  insertAudit.run('aud-2', 'usr-concierge-1', 'QUOTE_PUBLISHED', 'quotes', qte1Id, JSON.stringify({ total: 64100 }), now);
  insertAudit.run('aud-3', 'usr-customer-1', 'QUOTE_ACCEPTED', 'quotes', qte1Id, JSON.stringify({ acceptedAt: now }), now);
  insertAudit.run('aud-4', 'usr-concierge-1', 'PAYMENT_VERIFIED', 'orders', ord1Id, JSON.stringify({ amount: 64100, provider: 'STRIPE_VERIFIED' }), now);
  insertAudit.run('aud-5', 'usr-concierge-1', 'STATE_TRANSITION', 'orders', ord1Id, JSON.stringify({ from: 'PAYMENT_CONFIRMED', to: 'SOURCING_IN_PROGRESS' }), now);
}
