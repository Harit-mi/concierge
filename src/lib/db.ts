import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { getConfig } from './config';
import { seedDemoData } from './seed';

const dbDirectory = path.join(process.cwd(), 'data');
if (!fs.existsSync(dbDirectory)) {
  fs.mkdirSync(dbDirectory, { recursive: true });
}

const dbPath = path.join(dbDirectory, 'concierge.db');
const db = new Database(dbPath);

// Production-hardened SQLite PRAGMAs for high concurrency and crash-safety
db.pragma('busy_timeout = 5000');
try {
  db.pragma('journal_mode = WAL');
} catch {
  // If journal_mode is already WAL or locked by another worker
}
db.pragma('synchronous = NORMAL');
db.pragma('foreign_keys = ON');

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS _schema_migrations (
    id TEXT PRIMARY KEY,
    description TEXT,
    applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
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

// Record initial baseline migration if not recorded
try {
  db.prepare(`
    INSERT OR IGNORE INTO _schema_migrations (id, description)
    VALUES ('001_initial_schema', 'Initial verified relational schema with 22-state machine tables')
  `).run();
} catch (e) {
  // Ignored if table is locked or testing
}

// Conditionally seed demo accounts only when explicitly enabled (never in production)
try {
  const config = getConfig();
  if (config.enableDemoSeed) {
    seedDemoData(db);
  }
} catch {
  // If config is not loaded or in strict production check
}

/**
 * Execute a sequence of SQL queries atomically within a database transaction.
 * If any error is thrown inside the callback, all mutations roll back automatically.
 */
export function withTransaction<T>(callback: (database: Database.Database) => T): T {
  const runTx = db.transaction(() => callback(db));
  return runTx();
}

export default db;
