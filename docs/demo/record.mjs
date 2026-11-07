import { spawn, execFileSync } from 'node:child_process';
import { mkdtempSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const outDir = join(root, 'docs', 'demo');
const port = Number(process.env.DEMO_PORT ?? 4140);
const baseUrl = `http://127.0.0.1:${port}/`;

const pause = (page, ms) => page.waitForTimeout(ms);

async function smoothScrollTo(page, y, duration = 1600) {
  await page.evaluate(
    ([targetY, ms]) =>
      new Promise((resolve) => {
        const startY = window.scrollY;
        const start = performance.now();
        const step = (now) => {
          const t = Math.min(1, (now - start) / ms);
          const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
          window.scrollTo(0, startY + (targetY - startY) * eased);
          if (t < 1) requestAnimationFrame(step);
          else resolve();
        };
        requestAnimationFrame(step);
      }),
    [y, duration],
  );
}

async function sectionTop(page, selector) {
  return page.$eval(selector, (el) => el.getBoundingClientRect().top + window.scrollY - 64);
}

const scenes = {
  async tour(page) {
    await pause(page, 2000);
    await page.mouse.move(700, 300);
    await page.hover('nav a[href="#work"]');
    await pause(page, 600);
    await page.click('nav a[href="#work"]');
    await pause(page, 2200);
    const cards = page.locator('#work .group');
    for (let i = 0; i < 3; i++) {
      await cards.nth(i).hover();
      await pause(page, 1300);
    }
    await page.mouse.move(640, 80);
    await page.hover('nav a[href="#posts"]');
    await pause(page, 600);
    await page.click('nav a[href="#posts"]');
    await pause(page, 2500);
  },

  async contact(page) {
    await pause(page, 1800);
    await page.hover('#email-display');
    await pause(page, 1200);
    await page.hover('#contact-btn');
    await pause(page, 900);
    await page.click('#contact-btn');
    await pause(page, 1000);
    await page.hover('#email-display a');
    await pause(page, 2500);
  },

  async mobile(page) {
    await pause(page, 1500);
    for (const selector of ['#about', '#work', '#posts']) {
      await smoothScrollTo(page, await sectionTop(page, selector), 1200);
      await pause(page, 1400);
    }
  },
};

const setups = {
  async contact(page) {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.evaluate(() =>
      window.scrollTo(0, document.querySelector('#contact').getBoundingClientRect().top + window.scrollY - 140),
    );
  },
};

const gifSettings = {
  tour: { width: 800, fps: 7 },
  contact: { width: 800, fps: 10 },
  mobile: { width: 300, fps: 7 },
};

const viewports = {
  tour: { width: 1280, height: 800 },
  contact: { width: 1280, height: 800 },
  mobile: { width: 390, height: 844 },
};

function startPreview() {
  const proc = spawn('npx', ['astro', 'preview', '--host', '127.0.0.1', '--port', String(port)], {
    cwd: root,
    stdio: 'ignore',
    detached: true,
  });
  return proc;
}

async function waitForServer() {
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(baseUrl);
      if (res.ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`preview server did not start on ${baseUrl}`);
}

function toGif(video, name, offset) {
  const gif = join(outDir, `${name}.gif`);
  const { width, fps } = gifSettings[name];
  const filter = `fps=${fps},scale=${width}:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=128:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle`;
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-ss', offset.toFixed(2), '-i', video, '-vf', filter, gif]);
  return gif;
}

const preview = startPreview();
const work = mkdtempSync(join(tmpdir(), 'portfolio-demo-'));
try {
  await waitForServer();
  const browser = await chromium.launch({ channel: 'chrome' });
  const only = process.argv.slice(2);
  for (const [name, scene] of Object.entries(scenes)) {
    if (only.length && !only.includes(name)) continue;
    const viewport = viewports[name];
    const isMobile = name === 'mobile';
    const videoDir = join(work, name);
    const context = await browser.newContext({
      viewport,
      deviceScaleFactor: 1,
      isMobile,
      hasTouch: isMobile,
      reducedMotion: 'no-preference',
      recordVideo: { dir: videoDir, size: viewport },
    });
    await context.route(/google(tagmanager|-analytics)\.com|analytics\.google\.com/, (route) => route.abort());
    const page = await context.newPage();
    const recordingStart = Date.now();
    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await setups[name]?.(page);
    await pause(page, 300);
    const offset = (Date.now() - recordingStart) / 1000;
    await scene(page);
    await context.close();
    const video = join(videoDir, readdirSync(videoDir)[0]);
    console.log(toGif(video, name, offset));
  }
  await browser.close();
} finally {
  rmSync(work, { recursive: true, force: true });
  process.kill(-preview.pid);
}
