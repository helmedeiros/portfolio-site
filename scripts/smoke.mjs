import { chromium } from 'playwright';

const base = new URL(process.argv[2] ?? process.env.SMOKE_URL ?? 'http://127.0.0.1:4321/');
const failures = [];
const check = (ok, message) => {
  if (!ok) failures.push(message);
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${message}`);
};
const sameOrigin = (url) => {
  try {
    return new URL(url).origin === base.origin;
  } catch {
    return false;
  }
};

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const brokenResources = [];
  const pageErrors = [];
  page.on('response', (r) => {
    if (sameOrigin(r.url()) && r.status() >= 400) brokenResources.push(`${r.status()} ${r.url()}`);
  });
  page.on('requestfailed', (r) => {
    if (sameOrigin(r.url())) brokenResources.push(`failed ${r.url()}`);
  });
  page.on('pageerror', (e) => pageErrors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error' && sameOrigin(m.location().url || base.href)) pageErrors.push(m.text());
  });

  const response = await page.goto(base.href, { waitUntil: 'load' });
  check(response?.status() === 200, `GET ${base.href} returns 200 (got ${response?.status()})`);

  check((await page.title()).includes('Helio Medeiros'), `title mentions Helio Medeiros ("${await page.title()}")`);
  check((await page.locator('h1').innerText()).trim().length > 0, 'hero heading is rendered');

  for (const id of ['about', 'work', 'posts', 'contact']) {
    check((await page.locator(`section#${id} h2`).count()) === 1, `section #${id} has its heading`);
  }
  check((await page.locator('#work .group').count()) >= 3, 'work section lists project cards');

  const h1Weight = await page.$eval('h1', (el) => getComputedStyle(el).fontWeight);
  check(h1Weight === '900', `Tailwind styles are applied (h1 font-weight ${h1Weight})`);

  const photoLoaded = await page.$eval('img[src="/helio-photo.jpg"]', (img) => img.complete && img.naturalWidth > 0);
  check(photoLoaded, 'profile photo loads');

  for (const asset of ['favicon.svg', 'site.webmanifest', 'helio-photo.jpg', 'assets/helio-cv.pdf']) {
    const r = await page.request.get(new URL(asset, base).href);
    check(r.status() === 200, `/${asset} returns 200 (got ${r.status()})`);
  }

  await page.click('#contact-btn');
  const mailto = await page
    .locator('#email-display a')
    .getAttribute('href', { timeout: 5000 })
    .catch(() => null);
  check(mailto === 'mailto:hi@heliomedeiros.com', `contact button reveals the email (${mailto})`);
  check((await page.locator('#contact-btn').innerText()).trim() === 'Email revealed!', 'contact button confirms the reveal');

  await page.click('nav a[href="#work"]');
  await page.waitForFunction(() => window.scrollY > 0, null, { timeout: 5000 }).catch(() => {});
  check((await page.evaluate(() => window.scrollY)) > 0, 'nav link scrolls to its section');

  await page.setViewportSize({ width: 390, height: 844 });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  check(overflow <= 0, `no horizontal scroll on a phone-sized screen (overflow ${overflow}px)`);

  check(brokenResources.length === 0, `no broken same-origin resources ${brokenResources.join(', ')}`);
  check(pageErrors.length === 0, `no page or console errors ${pageErrors.join(' | ')}`);
} finally {
  await browser.close();
}

if (failures.length) {
  console.error(`smoke: ${failures.length} check(s) failed for ${base.href}`);
  process.exit(1);
}
console.log(`smoke: all checks passed for ${base.href}`);
