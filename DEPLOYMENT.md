# VERITAS Private Client Concierge: Production Pilot Deployment & Operational Guide

## 1. Market Scope & Pilot Jurisdiction Confirmation
* **Confirmed Market:** **United States (Mainland US Domestic Pilot)**.
* **Currency:** USD (amounts modeled in integer minor currency units / cents).
* **Taxation:** US state-specific sales tax calculation (origin/destination rules modeled across 50 US states).
* **Fulfillment:** Sourced from verified US and domestic archive boutique partners (e.g., Stadium Goods, Flight Club, authorized US luxury stockists); routed through the Manhattan intake lounge for multi-point physical authenticity inspection before domestic insured courier dispatch.
* **Prohibited Pilot Categories:** Watches, perfumes, cosmetics, pharmaceuticals, and unverified international traveler sourcing remain strictly disabled during this phase.

> **Note on India Expansion:** If an India pilot is commissioned in the future, set `TARGET_MARKET=IN`. This requires enabling GST breakdown (CGST/SGST/IGST), Indian PIN code validation, PAN collection for high-value transactions, customs clearance/import documentation, and Razorpay/Stripe India UPI integration.

---

## 2. Startup & Environment Configuration

In production (`NODE_ENV=production`), the application validates environment variables immediately at process boot. Missing or weak secrets halt process startup with a fatal error.

| Environment Variable | Required in Production | Description / Format |
| :--- | :--- | :--- |
| `NODE_ENV` | Yes | Must be `production` |
| `PORT` | Optional (default 3044) | HTTP port to bind |
| `NEXT_PUBLIC_APP_URL` | Yes | Public URL (e.g. `https://concierge.veritas.com`) |
| `JWT_SECRET` | **Strictly Required** | Secure random key, minimum 32 characters |
| `DATABASE_PATH` | Optional | Path to SQLite file (e.g. `/data/concierge.db`) |
| `ENABLE_DEMO_SEED` | **Forbidden in Prod** | Default is `false`. When `false`, zero demo accounts or seeded requests are inserted. |
| `PAYMENT_PROVIDER` | Yes | Set to `stripe` |
| `STRIPE_SECRET_KEY` | Yes | Live/restricted key starting with `sk_live_...` or `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | Yes | Webhook signing secret starting with `whsec_...` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Yes | Publishable key starting with `pk_...` |

### Generating a Secure JWT Secret
```bash
openssl rand -base64 48
```

---

## 3. Database Architecture, Persistence & Migrations

### Storage Engine
VERITAS uses **SQLite with Write-Ahead Logging (WAL)**:
* `PRAGMA journal_mode = WAL;` — Allows concurrent readers and a writer without blocking.
* `PRAGMA synchronous = NORMAL;` — Crash-safe with minimal disk I/O latency.
* `PRAGMA busy_timeout = 5000;` — Automatic 5-second queueing for transient locks.
* `PRAGMA foreign_keys = ON;` — Strict relational constraint enforcement.

### Persistent Volume Requirements
In containerized environments (Docker, Fly.io, AWS ECS, Railway):
* Mount a dedicated persistent volume at `/data`.
* Point `DATABASE_PATH=/data/concierge.db`.
* Never store the database on an ephemeral container layer.

### Schema Migrations
Migrations are tracked in the `_schema_migrations` table:
* `001_initial_schema` tracks the baseline 22-state machine relational model.
* Incremental migrations are executed sequentially in transaction blocks.

---

## 4. Backup & Disaster Recovery Runbook

### Online Hot Backups
SQLite backups run **without blocking active web traffic or writers** via the non-blocking backup API:
```bash
# Automated non-blocking backup with integrity check
npm run db:backup
# Or directly via script:
./scripts/backup-db.sh
```
* Backups are written to `./backups/concierge-backup-<ISO-timestamp>.db`.
* Automated `PRAGMA integrity_check` runs immediately after snapshotting.

### Recommended Continuous Replication (Litestream)
For high-availability pilot operations, run [Litestream](https://litestream.io) as a sidecar process:
```yaml
# litestream.yml
dbs:
  - path: /data/concierge.db
    replicas:
      - type: s3
        bucket: veritas-concierge-db-backups
        path: db
        region: us-east-1
```
Litestream replicates WAL changes to S3/Cloud Storage continuously with sub-second RPO.

### Disaster Recovery Restoration
To restore from a verified backup:
```bash
./scripts/restore-db.sh ./backups/concierge-backup-2026-11-23T23-00-00-000Z.db
```
The script:
1. Validates the integrity of the backup file first.
2. Creates an emergency `.pre-restore.<timestamp>` rollback file of the active database.
3. Restores the database file and flushes stale WAL/SHM locks.
4. Performs an integrity check on the restored database.

---

## 5. Payment Gateway & Webhook Operational Configuration

1. In the Stripe Dashboard:
   - Create a Webhook endpoint pointing to: `https://<YOUR_DOMAIN>/api/webhooks/stripe`.
   - Listen for events: `payment_intent.succeeded` and `checkout.session.completed`.
   - Copy the Signing Secret (`whsec_...`) into `STRIPE_WEBHOOK_SECRET`.
2. VERITAS cryptographically verifies the `Stripe-Signature` header using HMAC-SHA256 and rejects any replay attacks outside a 300-second window.
3. Every payment event runs inside an atomic SQLite transaction:
   - Updates `payments`, `orders`, `product_requests`, `order_status_history`, and `request_status_history`.
   - Generates an official payment receipt in `documents`.
   - Dispatches an operator alert to the assigned sourcing officer.
   - Idempotently prevents double-crediting if duplicate webhooks arrive.
