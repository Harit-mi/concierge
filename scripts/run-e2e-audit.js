const puppeteer = require('puppeteer-core');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

const JWT_SECRET = 'concierge_luxury_jwt_secure_secret_key_2026_x';
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE_URL = 'http://localhost:3044';
const ARTIFACTS_DIR = path.join(__dirname, '..', 'test-artifacts');

const customerToken = jwt.sign({
  userId: 'usr-customer-1',
  email: 'customer@example.com',
  role: 'CUSTOMER',
  name: 'Alexander Hayes',
}, JWT_SECRET, { expiresIn: '7d' });

const adminToken = jwt.sign({
  userId: 'usr-admin-1',
  email: 'admin@example.com',
  role: 'ADMIN',
  name: 'Eleanor Vance (Head of Operations)',
}, JWT_SECRET, { expiresIn: '7d' });

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'laptop', width: 1280, height: 800 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 390, height: 844, isMobile: true },
  { name: 'narrow_mobile', width: 360, height: 800, isMobile: true },
];

async function captureScreen(page, subfolder, filename) {
  const targetDir = path.join(ARTIFACTS_DIR, subfolder);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  const filePath = path.join(targetDir, filename);
  await page.screenshot({ path: filePath, fullPage: false });
  return filePath;
}

async function checkHorizontalOverflow(page) {
  return await page.evaluate(() => {
    const docWidth = document.documentElement.offsetWidth;
    const scrollWidth = document.documentElement.scrollWidth;
    const bodyWidth = document.body.scrollWidth;
    const windowWidth = window.innerWidth;
    return {
      overflow: scrollWidth > windowWidth + 1 || bodyWidth > windowWidth + 1,
      windowWidth,
      scrollWidth,
      bodyWidth,
    };
  });
}

async function runAudit(cycleName = 'baseline') {
  console.log(`\n======================================================`);
  console.log(`Starting UI/UX Audit & Browser Test Cycle: ${cycleName.toUpperCase()}`);
  console.log(`======================================================`);

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu', '--user-data-dir=/tmp/chrome-puppeteer-audit-profile'],
  });

  const page = await browser.newPage();

  const issues = [];
  const consoleErrors = [];
  const networkFailures = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push({ text: msg.text(), location: msg.location() });
    }
  });

  page.on('pageerror', (err) => {
    consoleErrors.push({ text: err.toString(), stack: err.stack });
  });

  page.on('requestfailed', (req) => {
    networkFailures.push({ url: req.url(), failure: req.failure()?.errorText });
  });

  // TEST 1: Multi-Viewport Responsive Audit of Key Pages
  console.log('\n[1/7] Testing Viewports & Responsive Layouts...');
  const keyPages = [
    { name: 'homepage', url: '/' },
    { name: 'how_it_works', url: '/how-it-works' },
    { name: 'request_form', url: '/request' },
    { name: 'policies', url: '/policies' },
  ];

  for (const p of keyPages) {
    for (const vp of VIEWPORTS) {
      await page.setViewport(vp);
      await page.goto(`${BASE_URL}${p.url}`, { waitUntil: 'networkidle0' });
      await captureScreen(page, cycleName, `${p.name}_${vp.name}.png`);

      const overflow = await checkHorizontalOverflow(page);
      if (overflow.overflow) {
        issues.push({
          id: `OVERFLOW-${p.name}-${vp.name}`,
          route: p.url,
          viewport: `${vp.name} (${vp.width}x${vp.height})`,
          severity: 'P1',
          description: `Horizontal overflow detected! Page scrollWidth (${overflow.scrollWidth}px) exceeds windowWidth (${overflow.windowWidth}px).`,
        });
      }
    }
  }

  // TEST 2: Request Form 4-Step Interactive Flow & Validation
  console.log('\n[2/7] Testing 4-Step Request Form Flow & Validation...');
  await page.setViewport(VIEWPORTS[0]);
  await page.goto(`${BASE_URL}/request`, { waitUntil: 'networkidle0' });
  // Ensure pristine state by clearing draft in localStorage
  await page.evaluate(() => {
    localStorage.clear();
  });
  await page.goto(`${BASE_URL}/request`, { waitUntil: 'networkidle0' });
  await page.waitForSelector('input[name="productName"]', { timeout: 5000 });

  // Test Step 1 Validation (Submit without product name)
  await page.evaluate(() => {
    const continueBtn = Array.from(document.querySelectorAll('button')).find((b) => b.textContent.includes('Continue'));
    if (continueBtn) continueBtn.click();
  });
  await new Promise((r) => setTimeout(r, 400));

  const step1Error = await page.evaluate(() => {
    return document.body.innerText.includes('Product name or title is required.');
  });
  if (!step1Error) {
    issues.push({
      id: 'VAL-STEP1',
      route: '/request',
      viewport: 'desktop',
      severity: 'P1',
      description: 'Step 1 validation failed: Submitting empty form did not display required product name error.',
    });
  }
  await captureScreen(page, cycleName, `request_step1_validation.png`);

  // Fill Step 1 correctly
  await page.type('input[name="productName"]', 'Maison Margiela Painted Replica Sneakers');
  await page.type('input[name="productUrl"]', 'https://www.maisonmargiela.com/replica');
  await page.evaluate(() => {
    const continueBtn = Array.from(document.querySelectorAll('button')).find((b) => b.textContent.includes('Continue'));
    if (continueBtn) continueBtn.click();
  });
  await new Promise((r) => setTimeout(r, 600));

  // Verify we are on Step 2
  const onStep2 = await page.evaluate(() => document.body.innerText.includes('Step 2: Brand & Exact Specifications'));
  if (!onStep2) {
    issues.push({
      id: 'NAV-STEP2',
      route: '/request',
      viewport: 'desktop',
      severity: 'P1',
      description: 'Failed to advance to Step 2 after valid Step 1 input.',
    });
  }

  // Fill Step 2
  await page.type('input[name="brand"]', 'Maison Margiela');
  await page.type('input[name="sizeVariant"]', 'EU 43 / US 10');
  await page.type('input[name="colorVariant"]', 'White Paint Splatter');
  await page.evaluate(() => {
    const continueBtn = Array.from(document.querySelectorAll('button')).find((b) => b.textContent.includes('Continue'));
    if (continueBtn) continueBtn.click();
  });
  await new Promise((r) => setTimeout(r, 600));

  // Verify we are on Step 3
  const onStep3 = await page.evaluate(() => document.body.innerText.includes('Step 3: Target Budget & Domestic Destination'));
  if (!onStep3) {
    issues.push({
      id: 'NAV-STEP3',
      route: '/request',
      viewport: 'desktop',
      severity: 'P1',
      description: 'Failed to advance to Step 3.',
    });
  }

  // Test Step 3 Invalid Postal Code
  await page.type('input[name="destinationPostalCode"]', 'INVALID_ZIP');
  await page.evaluate(() => {
    const continueBtn = Array.from(document.querySelectorAll('button')).find((b) => b.textContent.includes('Continue'));
    if (continueBtn) continueBtn.click();
  });
  await new Promise((r) => setTimeout(r, 400));
  const zipError = await page.evaluate(() => document.body.innerText.includes('Please enter a valid 5-digit US ZIP code.'));
  if (!zipError) {
    issues.push({
      id: 'VAL-ZIP',
      route: '/request',
      viewport: 'desktop',
      severity: 'P2',
      description: 'Destination postal code validation did not reject non-numeric ZIP code.',
    });
  }

  // Clear and put valid ZIP & budget using React prototype setter
  await page.evaluate(() => {
    const input = document.querySelector('input[name="destinationPostalCode"]');
    if (input) {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      setter.call(input, '10022');
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
  await page.type('input[name="maxBudgetMajor"]', '680.00');
  await page.evaluate(() => {
    const continueBtn = Array.from(document.querySelectorAll('button')).find((b) => b.textContent.includes('Continue'));
    if (continueBtn) continueBtn.click();
  });
  await new Promise((r) => setTimeout(r, 600));

  // Verify we are on Step 4
  const onStep4 = await page.evaluate(() => document.body.innerText.includes('Step 4: Contact Information & Request Summary'));
  if (!onStep4) {
    issues.push({
      id: 'NAV-STEP4',
      route: '/request',
      viewport: 'desktop',
      severity: 'P1',
      description: 'Failed to advance to Step 4.',
    });
  }
  await captureScreen(page, cycleName, `request_step4_summary.png`);

  // Fill Step 4 & Consent Checkboxes
  await page.type('input[name="customerName"]', 'Julian Alexander');
  await page.type('input[name="customerEmail"]', 'client@veritas-luxury.com');
  await page.click('input[name="consentTerms"]');
  await page.click('input[name="consentPrivacy"]');

  // Submit request form
  await page.evaluate(() => {
    const submitBtn = Array.from(document.querySelectorAll('button')).find((b) => b.textContent.includes('Submit Sourcing Request'));
    if (submitBtn) submitBtn.click();
  });
  await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 8000 }).catch(() => {});
  await new Promise((r) => setTimeout(r, 1000));

  const confirmationLoaded = page.url().includes('/request/confirmation');
  if (!confirmationLoaded) {
    issues.push({
      id: 'FLOW-SUBMIT',
      route: '/request',
      viewport: 'desktop',
      severity: 'P0',
      description: `Request submission failed to redirect to /request/confirmation. Current URL: ${page.url()}`,
    });
  }
  await captureScreen(page, cycleName, `request_confirmation_result.png`);

  // TEST 3: Authenticated Customer Dashboard & Inquiries
  console.log('\n[3/7] Testing Customer Dashboard & Request Dossiers...');
  await page.setCookie({
    name: 'concierge_session',
    value: customerToken,
    domain: 'localhost',
    path: '/',
    httpOnly: true,
  });

  await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle0' });
  await captureScreen(page, cycleName, `dashboard_overview_desktop.png`);

  // Mobile Dashboard Viewport
  await page.setViewport(VIEWPORTS[3]);
  await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle0' });
  await captureScreen(page, cycleName, `dashboard_overview_mobile.png`);

  // Test /dashboard/requests tab switching
  await page.setViewport(VIEWPORTS[0]);
  await page.goto(`${BASE_URL}/dashboard/requests`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => {
    const quotedTab = Array.from(document.querySelectorAll('button')).find((b) => b.textContent.includes('Quoted'));
    if (quotedTab) quotedTab.click();
  });
  await new Promise((r) => setTimeout(r, 400));
  await captureScreen(page, cycleName, `dashboard_requests_quoted_tab.png`);

  // TEST 4: Quote Detail & Approval Confirmation Dialog
  console.log('\n[4/7] Testing Itemized Quote & Accept/Decline Actions...');
  await page.goto(`${BASE_URL}/quotes/quo-travis-01`, { waitUntil: 'networkidle0' });
  await captureScreen(page, cycleName, `quote_detail_initial.png`);

  // Click "Accept & Proceed to Order" to test confirmation modal
  await page.evaluate(() => {
    const acceptBtn = Array.from(document.querySelectorAll('button')).find((b) => b.textContent.includes('Accept & Proceed'));
    if (acceptBtn) acceptBtn.click();
  });
  await new Promise((r) => setTimeout(r, 500));

  const acceptModalVisible = await page.evaluate(() => {
    return document.body.innerText.includes('Confirm Quote Acceptance');
  });
  if (!acceptModalVisible) {
    issues.push({
      id: 'MODAL-QUOTE-ACCEPT',
      route: '/quotes/[id]',
      viewport: 'desktop',
      severity: 'P1',
      description: 'Clicking Accept Quote did not open the required confirmation dialog modal.',
    });
  }
  await captureScreen(page, cycleName, `quote_accept_modal.png`);

  // Cancel modal to test Dismissal
  await page.evaluate(() => {
    const cancelBtn = Array.from(document.querySelectorAll('button')).find((b) => b.textContent.includes('Review Again'));
    if (cancelBtn) cancelBtn.click();
  });
  await new Promise((r) => setTimeout(r, 400));

  // Test Decline Quote Modal
  await page.evaluate(() => {
    const declineBtn = Array.from(document.querySelectorAll('button')).find((b) => b.textContent.includes('Decline This Quote'));
    if (declineBtn) declineBtn.click();
  });
  await new Promise((r) => setTimeout(r, 500));
  const declineModalVisible = await page.evaluate(() => document.body.innerText.includes('Decline Quote'));
  if (!declineModalVisible) {
    issues.push({
      id: 'MODAL-QUOTE-DECLINE',
      route: '/quotes/[id]',
      viewport: 'desktop',
      severity: 'P2',
      description: 'Decline quote modal did not open.',
    });
  }
  await captureScreen(page, cycleName, `quote_decline_modal.png`);

  // TEST 5: Order Tracking Timeline & Support Channel
  console.log('\n[5/7] Testing Order Fulfilment Timeline & Order Support...');
  await page.goto(`${BASE_URL}/orders/ord-travis-01`, { waitUntil: 'networkidle0' });
  const hasTimeline = await page.evaluate(() => document.body.innerText.includes('Order Fulfilment Milestone Timeline'));
  if (!hasTimeline) {
    issues.push({
      id: 'TIMELINE-ORDER',
      route: '/orders/[id]',
      viewport: 'desktop',
      severity: 'P1',
      description: 'Vertical fulfillment milestone timeline missing or broken.',
    });
  }

  // Test Order-Linked Support Form
  await page.type('input[placeholder*="delivery instructions"]', 'Please request morning delivery slot.');
  await page.evaluate(() => {
    const transmitBtn = Array.from(document.querySelectorAll('button')).find((b) => b.textContent.includes('Transmit'));
    if (transmitBtn) transmitBtn.click();
  });
  await new Promise((r) => setTimeout(r, 600));
  const supportSentConfirmed = await page.evaluate(() => document.body.innerText.includes('Message delivered directly to your assigned sourcing officer'));
  if (!supportSentConfirmed) {
    issues.push({
      id: 'ORDER-SUPPORT-FEEDBACK',
      route: '/orders/[id]',
      viewport: 'desktop',
      severity: 'P2',
      description: 'Order support form submission did not show confirmation feedback.',
    });
  }
  await captureScreen(page, cycleName, `order_tracking_with_support_message.png`);

  // TEST 6: Customer Messages Interface
  console.log('\n[6/7] Testing Messages Split-Pane Interface...');
  await page.goto(`${BASE_URL}/messages`, { waitUntil: 'networkidle0' });
  await page.type('input[placeholder*="Send note to"]', 'Testing real-time message dispatch from client console.');
  await page.evaluate(() => {
    const sendBtn = Array.from(document.querySelectorAll('button')).find((b) => b.textContent.includes('Send'));
    if (sendBtn) sendBtn.click();
  });
  await new Promise((r) => setTimeout(r, 600));
  const msgAppended = await page.evaluate(() => document.body.innerText.includes('Testing real-time message dispatch from client console.'));
  if (!msgAppended) {
    issues.push({
      id: 'MSG-APPEND',
      route: '/messages',
      viewport: 'desktop',
      severity: 'P2',
      description: 'Sent message did not immediately append to the conversation thread.',
    });
  }
  await captureScreen(page, cycleName, `messages_chat_appended.png`);

  // TEST 7: Admin Operations Hub & State Transition Controls
  console.log('\n[7/7] Testing Admin Operations Hub, Quotes Builder & State Controller...');
  await page.setCookie({
    name: 'concierge_session',
    value: adminToken,
    domain: 'localhost',
    path: '/',
    httpOnly: true,
  });

  await page.goto(`${BASE_URL}/admin`, { waitUntil: 'networkidle0' });
  await captureScreen(page, cycleName, `admin_radar.png`);

  await page.goto(`${BASE_URL}/admin/requests`, { waitUntil: 'networkidle0' });
  await captureScreen(page, cycleName, `admin_requests_queue.png`);

  // Test Admin Quote Builder auto-calculation
  await page.goto(`${BASE_URL}/admin/quotes?requestId=req-travis-01`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => {
    const autoFeeBtn = Array.from(document.querySelectorAll('button')).find((b) => b.textContent.includes('12% Default'));
    if (autoFeeBtn) autoFeeBtn.click();
  });
  await new Promise((r) => setTimeout(r, 400));
  await captureScreen(page, cycleName, `admin_quote_builder_calculated.png`);

  // Test Order Cockpit & Legal State Transition Controller
  await page.goto(`${BASE_URL}/admin/orders/ord-travis-01`, { waitUntil: 'networkidle0' });
  await captureScreen(page, cycleName, `admin_order_cockpit.png`);

  await browser.close();

  const report = {
    cycle: cycleName,
    timestamp: new Date().toISOString(),
    totalIssues: issues.length,
    issues,
    consoleErrors,
    networkFailures,
  };

  const reportPath = path.join(ARTIFACTS_DIR, `${cycleName}-report.json`);
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log(`\n======================================================`);
  console.log(`Cycle ${cycleName.toUpperCase()} Completed!`);
  console.log(`Total Issues Found: ${issues.length}`);
  console.log(`Console Errors: ${consoleErrors.length}`);
  console.log(`Network Failures: ${networkFailures.length}`);
  console.log(`Report saved to: ${reportPath}`);
  console.log(`======================================================\n`);

  return report;
}

if (require.main === module) {
  const cycle = process.argv[2] || 'baseline';
  runAudit(cycle).catch((err) => {
    console.error('Audit runner error:', err);
    process.exit(1);
  });
}

module.exports = { runAudit };
