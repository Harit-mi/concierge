const puppeteer = require('puppeteer-core');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

const JWT_SECRET = 'concierge_luxury_jwt_secure_secret_key_2026_x';
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE_URL = 'http://localhost:3044';
const OUT_DIR = '/Users/haritmishra/.gemini/antigravity/brain/4b0b5a10-644b-4dea-ae50-6df29cc67ec3/screenshots';

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

function createToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

const customerToken = createToken({
  userId: 'usr-customer-1',
  email: 'customer@example.com',
  role: 'CUSTOMER',
  name: 'Alexander Hayes',
});

const adminToken = createToken({
  userId: 'usr-admin-1',
  email: 'admin@example.com',
  role: 'ADMIN',
  name: 'Eleanor Vance (Head of Operations)',
});

async function main() {
  console.log('Launching Chrome for Warm Ivory Luxury UI capture...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu', '--user-data-dir=/tmp/chrome-puppeteer-user-data-ivory'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Homepage Desktop (/)
  console.log('Capturing / (Homepage Desktop)...');
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(OUT_DIR, '01-homepage.png') });

  // 1b. Homepage Mobile (/)
  console.log('Capturing / (Homepage Mobile)...');
  await page.setViewport({ width: 390, height: 844, isMobile: true });
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(OUT_DIR, '01-homepage-mobile.png') });

  // Reset to desktop viewport
  await page.setViewport({ width: 1440, height: 900 });

  // 2. How It Works (/how-it-works)
  console.log('Capturing /how-it-works...');
  await page.goto(`${BASE_URL}/how-it-works`, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(OUT_DIR, '02-how-it-works.png') });

  // 3. Request Form (/request)
  console.log('Capturing /request (4-Step Guided Form)...');
  await page.goto(`${BASE_URL}/request`, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(OUT_DIR, '03-request-form.png') });

  // 4. Request Confirmation (/request/confirmation)
  console.log('Capturing /request/confirmation...');
  await page.goto(`${BASE_URL}/request/confirmation?ref=REQ-2026-9041`, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(OUT_DIR, '04-request-confirmation.png') });

  // 5. Policies (/policies)
  console.log('Capturing /policies...');
  await page.goto(`${BASE_URL}/policies`, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(OUT_DIR, '05-policies.png') });

  // 6. Account (/account)
  console.log('Capturing /account...');
  await page.goto(`${BASE_URL}/account`, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(OUT_DIR, '06-account.png') });

  // 7. Auth Login (/auth/login)
  console.log('Capturing /auth/login...');
  await page.goto(`${BASE_URL}/auth/login`, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(OUT_DIR, '07-auth-login.png') });

  // 8. Auth Register (/auth/register)
  console.log('Capturing /auth/register...');
  await page.goto(`${BASE_URL}/auth/register`, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(OUT_DIR, '08-auth-register.png') });

  // --- Authenticated Customer Routes ---
  console.log('Setting Customer Cookie...');
  await page.setCookie({
    name: 'concierge_session',
    value: customerToken,
    domain: 'localhost',
    path: '/',
    httpOnly: true,
  });

  // 9. Dashboard Overview (/dashboard)
  console.log('Capturing /dashboard...');
  await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(OUT_DIR, '09-dashboard.png') });

  // 10. Dashboard Requests (/dashboard/requests)
  console.log('Capturing /dashboard/requests...');
  await page.goto(`${BASE_URL}/dashboard/requests`, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(OUT_DIR, '10-dashboard-requests.png') });

  // 11. Request Detail (/requests/[id])
  console.log('Capturing /requests/[id]...');
  await page.goto(`${BASE_URL}/requests/req-travis-01`, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(OUT_DIR, '11-request-detail.png') });

  // 12. Quote Detail (/quotes/[id])
  console.log('Capturing /quotes/[id]...');
  await page.goto(`${BASE_URL}/quotes/quo-travis-01`, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(OUT_DIR, '12-quote-detail.png') });

  // 13. Order Tracking (/orders/[id])
  console.log('Capturing /orders/[id]...');
  await page.goto(`${BASE_URL}/orders/ord-travis-01`, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(OUT_DIR, '13-order-tracking.png') });

  // 14. Customer Messages (/messages)
  console.log('Capturing /messages...');
  await page.goto(`${BASE_URL}/messages`, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(OUT_DIR, '14-messages.png') });

  // --- Authenticated Admin Operations ---
  console.log('Setting Admin Cookie...');
  await page.setCookie({
    name: 'concierge_session',
    value: adminToken,
    domain: 'localhost',
    path: '/',
    httpOnly: true,
  });

  // 15. Admin Dashboard (/admin)
  console.log('Capturing /admin...');
  await page.goto(`${BASE_URL}/admin`, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(OUT_DIR, '15-admin-dashboard.png') });

  // 16. Admin Requests Queue (/admin/requests)
  console.log('Capturing /admin/requests...');
  await page.goto(`${BASE_URL}/admin/requests`, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(OUT_DIR, '16-admin-requests.png') });

  // 17. Admin Quotes Builder (/admin/quotes)
  console.log('Capturing /admin/quotes...');
  await page.goto(`${BASE_URL}/admin/quotes?requestId=req-travis-01`, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(OUT_DIR, '17-admin-quotes.png') });

  // 18. Admin Orders Pipeline (/admin/orders)
  console.log('Capturing /admin/orders...');
  await page.goto(`${BASE_URL}/admin/orders`, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(OUT_DIR, '18-admin-orders.png') });

  // 19. Admin Order Cockpit (/admin/orders/[id])
  console.log('Capturing /admin/orders/[id]...');
  await page.goto(`${BASE_URL}/admin/orders/ord-travis-01`, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(OUT_DIR, '19-admin-order-cockpit.png') });

  await browser.close();
  console.log('All warm ivory luxury screenshots captured successfully in:', OUT_DIR);
}

main().catch((err) => {
  console.error('Screenshot capture error:', err);
  process.exit(1);
});
