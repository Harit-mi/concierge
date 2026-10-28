# VERITAS — Premium Managed Concierge Shopping Platform

> *"Can't Find It? Let Us Source It."*  
> A production-minded, mobile-first managed concierge shopping service built with Next.js (App Router), TypeScript, Tailwind CSS, and SQLite with rigorous relational constraints, integer minor-unit financial arithmetic, a 22-state order state machine, secure role-based access control, and an immutable audit log engine.

---

## 1. System Overview

Veritas is a **managed private concierge shopping platform** rather than an open marketplace. The business operator manually sources authentic clothing, sneakers, and eligible non-regulated fashion accessories, verifies supplier provenance and physical condition, prepares binding itemized quotes, and coordinates insured domestic courier fulfillment.

### Active Domains (Domestic Pilot)
- **Sneakers & Footwear:** Rare silhouettes, deadstock collaborations, archival releases.
- **Designer Clothing:** Sold-out seasonal apparel, runway collections, archive garments.
- **Non-Regulated Fashion Accessories:** Handcrafted leather card cases, wallets, belts, scarves.

### Deactivated Categories & Anti-Evasion Policy
To protect consumers and maintain compliance standards:
- **Deactivated:** Watches & timepieces, perfumes/fragrances, cosmetics/skincare, consumer electronics, and pharmaceuticals.
- **Anti-Evasion:** Strict refusal of customs evasion, gift declarations, or false value documentation. Only verified mainland US delivery is enabled.

---

## 2. Default Seed Accounts

The platform comes pre-seeded with three demo personas for immediate testing:

| Persona | Email | Password | Role | Access Scope |
|:---|:---|:---|:---|:---|
| **Client / Customer** | `customer@example.com` | `password123` | `CUSTOMER` | Inquiries, Quotes, Orders, Payments, Messages, Invoices |
| **Concierge Specialist** | `concierge@example.com` | `password123` | `CONCIERGE_OPERATOR` | Triage, Quote Builder, Sourcing, Shipments, Customer Chat |
| **Director / Admin** | `admin@example.com` | `password123` | `ADMIN` | All operator tools + Analytics, Refunds, Policy & Audit Trail |

*Quick-switch buttons are available on `/auth/login` and in the navigation bar for instant switching.*

---

## 3. The 22 Order & Request Lifecycle States

Veritas enforces a strict state machine verified on every transition via `canTransition()`:

1. `REQUEST_SUBMITTED` — Customer inquiry logged, awaiting feasibility review.
2. `UNDER_REVIEW` — Concierge specialist checking partner inventory & terms.
3. `MORE_INFORMATION_REQUIRED` — Additional specifications requested from client.
4. `REVIEW_REQUIRED` — Senior operator/compliance review.
5. `QUOTE_SENT` — Itemized binding quote dispatched to client dashboard.
6. `QUOTE_ACCEPTED` — Client approves quote terms; generates order.
7. `QUOTE_DECLINED` — Client declines quote; parameter revision enabled.
8. `AWAITING_PAYMENT` — Order locked pending payment authorization.
9. `PAYMENT_CONFIRMED` — Gateway-verified payment on file; sourcing unlocked.
10. `SOURCING_IN_PROGRESS` — Purchase executed with verified partner boutique.
11. `PRODUCT_ACQUIRED` — Physical merchandise received at intake lounge.
12. `QUALITY_CHECK` — Multi-point authenticity, stitch density, and UV forensics.
13. `PACKING` — Archival protective boxing with tamper-evident serial seals.
14. `SHIPPED` — Dispatched via tracked, insured domestic courier.
15. `OUT_FOR_DELIVERY` — Courier driver dispatched for final-mile delivery.
16. `DELIVERED` — Parcel delivered with mandatory adult signature.
17. `CANCELLATION_REQUESTED` — Customer requests cancellation review.
18. `CANCELLED` — Order halted under merchant cancellation policy.
19. `REFUND_PENDING` — Authorized refund queued for gateway settlement.
20. `REFUNDED` — Terminal refund confirmed & recorded in ledger.
21. `DISPUTED` — Client reports delivery damage or discrepancy.
22. `REJECTED` — Request declined due to policy or counterfeit risk.

---

## 4. Financial Calculation Engine (Integer Minor Units)

All prices, fees, and taxes are stored strictly as **integer minor currency units (US cents)** to avoid floating-point math rounding issues.

$$\text{Subtotal} = \text{Product Price} + \text{Sourcing Fee} + \text{Shipping Fee} + \text{Disclosed Charges}$$
$$\text{Total Payable} = \text{Subtotal} + \text{State Sales Tax} - \text{Discount}$$

---

## 5. Directory Structure

```
concierge-platform/
├── data/
│   └── concierge.db               # SQLite database with PRAGMA foreign_keys = ON
├── src/
│   ├── app/
│   │   ├── page.tsx               # Luxury Editorial Homepage
│   │   ├── how-it-works/page.tsx  # Step-by-step operating breakdown
│   │   ├── request/page.tsx       # Guided sourcing intake form with image upload
│   │   ├── request/submitted/[ref]/page.tsx # Inquiry confirmation & tracker
│   │   ├── pricing/page.tsx       # Cost calculation explanation & line item model
│   │   ├── support/page.tsx       # Concierge assistance desk & ticket logging
│   │   ├── policies/              # Draft legal terms, privacy, authenticity, refunds
│   │   ├── auth/                  # Login & registration with 1-click persona switcher
│   │   ├── portal/                # Customer Dashboard (Requests, Orders, Pay, Chat)
│   │   ├── admin/                 # Operator Console (Kanban, Quote Builder, QA, Analytics)
│   │   └── api/                   # RESTful route handlers for all mutations & queries
│   ├── components/
│   │   ├── Navbar.tsx             # Editorial navigation & persona switcher
│   │   ├── Footer.tsx             # Regulatory compliance footer & policy links
│   │   ├── StatusBadge.tsx        # Tailored color-coded status pills
│   │   ├── PortalNav.tsx          # Client portal tab bar
│   │   └── AdminSidebar.tsx       # Operations sidebar with pilot badges
│   ├── lib/
│   │   ├── db.ts                  # Database connection & idempotent seed initialization
│   │   ├── auth.ts                # Session management & JWT token validation
│   │   ├── state-machine.ts       # 22-state legal transition validator
│   │   ├── pricing.ts             # Integer minor-unit arithmetic & quote calculator
│   │   └── audit.ts               # Tamper-evident audit logging engine
│   └── types/
│       └── index.ts               # Complete TypeScript interface declarations
```

---

## 6. How to Run Locally

### Prerequisites
- Node.js v18+ (tested on v22.19.0)
- npm v10+

### Installation & Launch
```bash
# Navigate to project folder
cd /Users/haritmishra/.gemini/antigravity/scratch/concierge-platform

# Install dependencies
npm install

# Build production bundle
npm run build

# Start production server on port 3044 (or configure PORT)
PORT=3044 npm start
```

Visit **`http://localhost:3044`** in your browser.
