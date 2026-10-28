import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';

const dbDirectory = path.join(process.cwd(), 'data');
if (!fs.existsSync(dbDirectory)) {
  fs.mkdirSync(dbDirectory, { recursive: true });
}

const dbPath = path.join(dbDirectory, 'concierge.db');
const db = new Database(dbPath);
db.pragma('foreign_keys = ON');

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'CUSTOMER' CHECK(role IN ('CUSTOMER', 'CONCIERGE_OPERATOR', 'ADMIN')),
    is_active BOOLEAN NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS customer_profiles (
    id TEXT PRIMARY KEY,
    user_id TEXT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    preferred_currency TEXT NOT NULL DEFAULT 'USD',
    shipping_address_line1 TEXT,
    shipping_address_line2 TEXT,
    city TEXT,
    state_province TEXT,
    postal_code TEXT,
    country_code TEXT NOT NULL DEFAULT 'US',
    delivery_instructions TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS product_requests (
    id TEXT PRIMARY KEY,
    reference_number TEXT UNIQUE NOT NULL,
    customer_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_name TEXT NOT NULL,
    brand TEXT NOT NULL,
    product_url TEXT,
    category TEXT NOT NULL CHECK(category IN ('CLOTHING', 'SNEAKERS_FOOTWEAR', 'ACCESSORIES_NON_REGULATED')),
    size_variant TEXT,
    color_variant TEXT,
    preferred_seller TEXT,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK(quantity > 0),
    max_budget_minor INTEGER,
    currency TEXT NOT NULL DEFAULT 'USD',
    destination_postal_code TEXT NOT NULL,
    desired_delivery_timeframe TEXT,
    additional_notes TEXT,
    assigned_staff_id TEXT REFERENCES users(id),
    status TEXT NOT NULL DEFAULT 'REQUEST_SUBMITTED',
    rejection_reason TEXT,
    consent_given_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS product_request_images (
    id TEXT PRIMARY KEY,
    request_id TEXT NOT NULL REFERENCES product_requests(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_size_bytes INTEGER NOT NULL,
    mime_type TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS request_status_history (
    id TEXT PRIMARY KEY,
    request_id TEXT NOT NULL REFERENCES product_requests(id) ON DELETE CASCADE,
    from_status TEXT,
    to_status TEXT NOT NULL,
    changed_by_user_id TEXT NOT NULL REFERENCES users(id),
    note TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS quotes (
    id TEXT PRIMARY KEY,
    quote_number TEXT UNIQUE NOT NULL,
    request_id TEXT NOT NULL REFERENCES product_requests(id) ON DELETE CASCADE,
    product_price_minor INTEGER NOT NULL,
    sourcing_fee_minor INTEGER NOT NULL,
    shipping_fee_minor INTEGER NOT NULL,
    applicable_taxes_minor INTEGER NOT NULL,
    disclosed_charges_minor INTEGER NOT NULL DEFAULT 0,
    discount_minor INTEGER NOT NULL DEFAULT 0,
    total_payable_minor INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    expires_at DATETIME NOT NULL,
    expected_fulfilment_estimate TEXT NOT NULL,
    notes_and_assumptions TEXT,
    status TEXT NOT NULL DEFAULT 'QUOTE_SENT' CHECK(status IN ('DRAFT', 'QUOTE_SENT', 'QUOTE_ACCEPTED', 'QUOTE_DECLINED', 'EXPIRED')),
    customer_action_at DATETIME,
    created_by_user_id TEXT NOT NULL REFERENCES users(id),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS quote_line_items (
    id TEXT PRIMARY KEY,
    quote_id TEXT NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    category TEXT NOT NULL CHECK(category IN ('PRODUCT', 'SERVICE_FEE', 'SHIPPING', 'TAX', 'HANDLING', 'DISCOUNT')),
    amount_minor INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    order_number TEXT UNIQUE NOT NULL,
    request_id TEXT UNIQUE NOT NULL REFERENCES product_requests(id),
    quote_id TEXT UNIQUE NOT NULL REFERENCES quotes(id),
    customer_id TEXT NOT NULL REFERENCES users(id),
    assigned_staff_id TEXT REFERENCES users(id),
    status TEXT NOT NULL DEFAULT 'AWAITING_PAYMENT',
    total_paid_minor INTEGER NOT NULL DEFAULT 0,
    currency TEXT NOT NULL DEFAULT 'USD',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS order_status_history (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    from_status TEXT,
    to_status TEXT NOT NULL,
    changed_by_user_id TEXT NOT NULL REFERENCES users(id),
    note TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS suppliers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    contact_email TEXT,
    website TEXT,
    reputation_score INTEGER DEFAULT 5,
    is_verified BOOLEAN DEFAULT 1,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS sourcing_records (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    supplier_id TEXT REFERENCES suppliers(id),
    supplier_order_reference TEXT,
    cost_price_minor INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    acquisition_date DATETIME,
    quality_check_notes TEXT,
    quality_passed BOOLEAN,
    created_by_user_id TEXT NOT NULL REFERENCES users(id),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS shipments (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    carrier_name TEXT NOT NULL,
    tracking_number TEXT NOT NULL,
    tracking_url TEXT,
    label_url TEXT,
    shipped_at DATETIME,
    estimated_delivery_at DATETIME,
    actual_delivery_at DATETIME,
    status TEXT NOT NULL DEFAULT 'LABEL_CREATED',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS delivery_confirmations (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    confirmed_by_user_id TEXT NOT NULL REFERENCES users(id),
    delivered_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    recipient_notes TEXT,
    satisfaction_rating INTEGER CHECK(satisfaction_rating BETWEEN 1 AND 5),
    issue_reported BOOLEAN DEFAULT 0,
    issue_description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS payments (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    payment_reference TEXT UNIQUE NOT NULL,
    provider TEXT NOT NULL DEFAULT 'MOCK_STRIPE',
    amount_minor INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    status TEXT NOT NULL CHECK(status IN ('PENDING', 'VERIFIED', 'FAILED')),
    provider_transaction_id TEXT,
    idempotency_key TEXT UNIQUE NOT NULL,
    verified_at DATETIME,
    raw_payload_json TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS refunds (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    payment_id TEXT REFERENCES payments(id),
    amount_minor INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    reason TEXT NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('PENDING', 'APPROVED', 'PROCESSED', 'REJECTED')),
    processed_at DATETIME,
    authorized_by_user_id TEXT REFERENCES users(id),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS conversations (
    id TEXT PRIMARY KEY,
    request_id TEXT NOT NULL REFERENCES product_requests(id) ON DELETE CASCADE,
    order_id TEXT REFERENCES orders(id) ON DELETE SET NULL,
    customer_id TEXT NOT NULL REFERENCES users(id),
    last_message_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id TEXT NOT NULL REFERENCES users(id),
    message_text TEXT NOT NULL,
    is_internal_note BOOLEAN NOT NULL DEFAULT 0,
    read_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS documents (
    id TEXT PRIMARY KEY,
    request_id TEXT REFERENCES product_requests(id) ON DELETE CASCADE,
    order_id TEXT REFERENCES orders(id) ON DELETE CASCADE,
    uploaded_by_user_id TEXT NOT NULL REFERENCES users(id),
    document_type TEXT NOT NULL,
    title TEXT NOT NULL,
    file_path TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    is_confidential_operator_only BOOLEAN NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS admin_notes (
    id TEXT PRIMARY KEY,
    request_id TEXT REFERENCES product_requests(id) ON DELETE CASCADE,
    order_id TEXT REFERENCES orders(id) ON DELETE CASCADE,
    author_id TEXT NOT NULL REFERENCES users(id),
    note_text TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    link_url TEXT,
    is_read BOOLEAN NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    actor_user_id TEXT NOT NULL REFERENCES users(id),
    action_type TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT NOT NULL,
    metadata_json TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed default users and sample data safely
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

// Insert Sample Requests
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

export default db;
