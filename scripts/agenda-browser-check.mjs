import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
const server = spawn(process.execPath, ['scripts/serve.mjs'], {
  env: { ...process.env, PORT: '8085' },
  stdio: ['ignore', 'pipe', 'inherit'],
});
let browser;
try {
  await once(server.stdout, 'data');
  browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || 'msedge' });
  for (const width of [390, 768, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await context.newPage();
    await page.clock.setFixedTime(new Date('2026-10-26T12:00:00Z'));
    await page.goto('http://127.0.0.1:8085/competiciones.html');
    assert.equal(await page.locator('[data-event]:visible').count(), 7);
    await page.selectOption('#agenda-format', 'DEKA MILE');
    assert.equal(await page.locator('[data-event]:visible').count(), 1);
    await page.selectOption('#agenda-format', '');
    await page.locator('#agenda-city').fill('malaga');
    assert.equal(await page.locator('[data-event]:visible').count(), 1);
    await page.locator('#agenda-city').fill('sin coincidencia');
    assert.equal(await page.locator('#agenda-empty').isVisible(), true);
    await page.locator('#agenda-filters button').click();
    await page.selectOption('#agenda-period', 'past');
    assert.equal(await page.locator('[data-event]:visible').count(), 2);
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
      false,
    );
    assert.deepEqual(
      (
        await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
      ).violations.map((v) => v.id),
      [],
    );
    await page.clock.setFixedTime(new Date('2027-05-01T12:00:00Z'));
    await page.reload();
    assert.equal(await page.locator('[data-event]:visible').count(), 0);
    assert.equal(await page.locator('#agenda-stale').isVisible(), true);
    await context.close();
    console.log(
      width +
        'px: agenda filters, archive, empty state, stale dates, accessibility and overflow passed',
    );
  }
} finally {
  await browser?.close();
  server.kill();
}
