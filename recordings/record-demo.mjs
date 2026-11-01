import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, 'output');
const BASE_URL = process.env.DEMO_URL || 'http://localhost:3000';

fs.rmSync(OUT_DIR, { recursive: true, force: true });
fs.mkdirSync(OUT_DIR, { recursive: true });

const notes = [];
const log = (msg) => {
  notes.push(msg);
  console.log(msg);
};

async function pause(page, ms) {
  await page.waitForTimeout(ms);
}

async function moveTo(page, locator, steps = 18) {
  const box = await locator.boundingBox();
  if (!box) return;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps });
}

async function clickHuman(page, locator) {
  await locator.scrollIntoViewIfNeeded();
  await moveTo(page, locator);
  await pause(page, 280);
  await locator.click();
}

async function fillHuman(page, locator, value, delay = 42) {
  await locator.scrollIntoViewIfNeeded();
  await clickHuman(page, locator);
  await locator.fill('');
  await locator.pressSequentially(String(value), { delay });
}

async function main() {
  const browser = await chromium.launch({
    headless: true,
    channel: process.env.DEMO_CHANNEL || 'chrome',
    args: ['--window-size=1920,1080'],
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
    recordVideo: {
      dir: OUT_DIR,
      size: { width: 1920, height: 1080 },
    },
    reducedMotion: 'no-preference',
  });

  const page = await context.newPage();
  page.setDefaultTimeout(45000);

  const start = Date.now();
  let demoModeVisible = false;
  let generationSource = 'unknown';

  try {
    // SCENE 1 — homepage
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.getByRole('heading', { name: /Flawless Celebrations/i }).waitFor();
    log('Homepage loaded');
    await pause(page, 2800);
    await page.mouse.move(960, 420, { steps: 16 });
    await pause(page, 1800);

    // SCENE 2 — event creation
    const planCta = page.getByRole('link', { name: /Plan Your Celebration/i }).first();
    await clickHuman(page, planCta);
    await page.getByRole('heading', { name: /Craft Your Celebration/i }).waitFor();
    log('Opened event wizard');
    await pause(page, 900);

    await fillHuman(page, page.getByPlaceholder(/Maya & Rohan's Royal Wedding/i), 'Birthday Celebration', 38);
    await clickHuman(page, page.getByRole('button', { name: /Birthday/i }).filter({ hasText: 'Milestone' }).or(page.locator('button').filter({ hasText: /^Birthday$/ })));
    const birthdayCard = page.locator('button').filter({ hasText: 'Birthday' }).filter({ hasText: 'Milestone' });
    if (await birthdayCard.count()) {
      await clickHuman(page, birthdayCard.first());
    }

    const dateInput = page.locator('input[type="date"]');
    await clickHuman(page, dateInput);
    await dateInput.fill('2026-12-20');
    await pause(page, 400);

    await fillHuman(page, page.getByPlaceholder(/Mumbai, Maharashtra/i), 'New Delhi', 50);
    await pause(page, 700);
    await clickHuman(page, page.getByRole('button', { name: /^Continue$/ }));

    await page.getByRole('heading', { name: /Guests & Financial Limits/i }).waitFor();
    const guestInput = page.locator('input[type="number"]').first();
    await clickHuman(page, guestInput);
    await guestInput.fill('100');

    await clickHuman(page, page.getByLabel('Venue Setting'));
    await page.getByLabel('Venue Setting').selectOption('outdoor');

    const budgetInput = page.locator('input[type="number"]').nth(1);
    await clickHuman(page, budgetInput);
    await budgetInput.fill('50000');
    await pause(page, 1400);
    await clickHuman(page, page.getByRole('button', { name: /^Continue$/ }));

    await page.getByRole('heading', { name: /Vision, Styling/i }).waitFor();
    await fillHuman(
      page,
      page.getByPlaceholder(/Marigold & Royal Blue/i),
      'Modern, elegant celebration',
      36,
    );
    await pause(page, 800);
    await clickHuman(page, page.getByRole('button', { name: /^Continue$/ }));

    await page.getByRole('heading', { name: /Review & Generate Plan/i }).waitFor();
    await pause(page, 1600);

    // SCENE 3 — generate
    const generateBtn = page.getByRole('button', { name: /Synthesize Event Plan/i });
    await clickHuman(page, generateBtn);
    log('Clicked Synthesize Event Plan');

    await page.waitForURL(/\/events\/[0-9a-f-]+/i, { timeout: 90000 });
    await page.getByRole('heading', { name: /Birthday Celebration/i }).waitFor({ timeout: 30000 });
    log(`Dashboard URL: ${page.url()}`);

    const bodyText = await page.locator('body').innerText();
    if (/\[DEMO MODE\]/i.test(bodyText)) {
      demoModeVisible = true;
      generationSource = 'demo';
      log('Plan summary includes DEMO MODE label');
    } else if (/Live AI Synthesized/i.test(bodyText)) {
      generationSource = 'ai';
      log('Plan badge: Live AI Synthesized');
    } else if (/Verified Scenario/i.test(bodyText)) {
      generationSource = 'demo-or-template';
      log('Plan badge: Verified Scenario');
    }

    // SCENE 4 — dashboard overview
    await pause(page, 1800);
    await page.mouse.wheel(0, 280);
    await pause(page, 1400);
    await page.mouse.wheel(0, 320);
    await pause(page, 1200);
    await page.mouse.wheel(0, -500);
    await pause(page, 600);

    await clickHuman(page, page.getByRole('button', { name: /Budget & Variance/i }));
    await page.getByText('Total Event Budget').first().waitFor();
    await pause(page, 1600);
    await page.mouse.wheel(0, 260);
    await pause(page, 1100);
    await page.mouse.wheel(0, -260);

    await clickHuman(page, page.getByRole('button', { name: /Timeline & Milestones/i }));
    await pause(page, 1200);

    await clickHuman(page, page.getByRole('button', { name: /Vendor Guides/i }));
    await pause(page, 1400);

    await clickHuman(page, page.getByRole('button', { name: /Inspiration Board/i }));
    await pause(page, 1400);

    await clickHuman(page, page.getByRole('button', { name: /Executive Overview/i }));
    await pause(page, 700);

    // SCENE 5 — adaptive budget replan (review, do not apply)
    const replanBtn = page.getByRole('button', { name: /Adaptive Replan/i }).first();
    await clickHuman(page, replanBtn);
    await page.getByText('Adaptive Replanning Cockpit').waitFor();
    await pause(page, 700);
    await clickHuman(page, page.getByRole('button', { name: /Budget reduced by 15%/i }));
    await pause(page, 800);
    await clickHuman(page, page.getByRole('button', { name: /Analyze & Replan/i }));
    log('Requested 15% budget refinement');

    const proposal = page.getByText('AI Strategic Analysis');
    const refineError = page.locator('div').filter({ hasText: /Replanning error|Failed to refine|DEMO MODE/i });
    try {
      await proposal.waitFor({ timeout: 60000 });
      log('Refinement preview appeared');
      await pause(page, 2200);
      const modalText = await page.locator('[role="dialog"], .fixed').last().innerText().catch(async () => page.locator('body').innerText());
      if (/\[DEMO MODE\]/i.test(modalText)) {
        demoModeVisible = true;
        log('Refinement preview is DEMO MODE');
      }
    } catch {
      const errText = await page.locator('body').innerText();
      log(`Refinement preview did not appear. Visible text snippet: ${errText.slice(0, 400)}`);
    }

    const discardBtn = page.getByRole('button', { name: /^Discard$/ });
    const cancelBtn = page.getByRole('button', { name: /^Cancel$/ });
    if (await discardBtn.count()) {
      await clickHuman(page, discardBtn);
    } else if (await cancelBtn.count()) {
      await clickHuman(page, cancelBtn);
    } else {
      await page.keyboard.press('Escape');
    }
    await pause(page, 500);

    // SCENE 6 — complete a milestone + add a guest
    await clickHuman(page, page.getByRole('button', { name: /Timeline & Milestones/i }));
    await pause(page, 700);
    const taskCheckbox = page.locator('input[type="checkbox"]').first();
    if (await taskCheckbox.count()) {
      await clickHuman(page, taskCheckbox);
      log('Marked a timeline task complete');
      await pause(page, 1200);
    } else {
      log('No timeline checkboxes found');
    }

    await clickHuman(page, page.getByRole('button', { name: /VIP Guest List/i }));
    await pause(page, 700);
    const addGuest = page.getByRole('button', { name: /Add Guest \/ Party/i }).first();
    if (await addGuest.count()) {
      await clickHuman(page, addGuest);
      await fillHuman(page, page.getByPlaceholder(/Vikramaditya/i), 'Rohan Mehta', 45);
      await fillHuman(page, page.getByPlaceholder(/Jain food only/i), 'Vegetarian, no peanuts', 32);
      await clickHuman(page, page.getByRole('button', { name: /Save Guest|Add Guest/i }).last());
      await page.getByText('Rohan Mehta').waitFor({ timeout: 10000 });
      log('Added guest Rohan Mehta');
      await pause(page, 1100);
    } else {
      log('Add Guest control not found');
    }

    // SCENE 7 — save and restore
    await clickHuman(page, page.getByRole('link', { name: /Celebrations/i }).first());
    await page.getByRole('heading', { name: /Flawless Celebrations/i }).waitFor();
    await pause(page, 900);
    const savedCard = page.getByText('Birthday Celebration').first();
    await savedCard.scrollIntoViewIfNeeded();
    await pause(page, 800);
    const openDash = page.getByRole('link', { name: /Open Dashboard/i }).first();
    if (await openDash.count()) {
      await clickHuman(page, openDash);
    } else {
      await page.reload({ waitUntil: 'networkidle' });
    }

    // SCENE 8 — final dashboard
    await page.getByRole('heading', { name: /Birthday Celebration/i }).waitFor({ timeout: 20000 });
    await clickHuman(page, page.getByRole('button', { name: /Executive Overview/i }));
    await pause(page, 1200);
    await page.mouse.wheel(0, 240);
    await pause(page, 2000);
    await page.mouse.move(980, 360, { steps: 14 });
    await pause(page, 1600);
    log('Final dashboard held');
  } catch (err) {
    log(`ERROR: ${err instanceof Error ? err.message : String(err)}`);
    await page.screenshot({ path: path.join(OUT_DIR, 'error.png'), fullPage: true }).catch(() => {});
    throw err;
  } finally {
    const video = page.video();
    await context.close();
    await browser.close();
    const elapsedSec = ((Date.now() - start) / 1000).toFixed(1);

    let videoPath = null;
    if (video) {
      videoPath = await video.path();
      const dest = path.join(OUT_DIR, 'celebrateai-product-demo.webm');
      if (videoPath && fs.existsSync(videoPath)) {
        fs.renameSync(videoPath, dest);
        videoPath = dest;
      }
    }

    const report = {
      durationSecondsEstimate: Number(elapsedSec),
      videoPath,
      generationSource,
      demoModeVisible,
      notes,
    };
    fs.writeFileSync(path.join(OUT_DIR, 'recording-report.json'), JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
