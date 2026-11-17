import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { mkdir } from 'node:fs/promises';
const origin = 'http://127.0.0.1:8087';
const server = spawn(process.execPath, ['scripts/serve.mjs'], {
  env: { ...process.env, PORT: '8087' },
  stdio: ['ignore', 'pipe', 'inherit'],
});
let browser;
try {
  await Promise.race([
    once(server.stdout, 'data'),
    once(server, 'exit').then(() => {
      throw Error('Preview server failed');
    }),
  ]);
  browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || 'msedge' });
  await mkdir('.cache/distribution-review', { recursive: true });
  for (const width of [390, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await context.newPage();
    const external = [];
    page.on('request', (request) => {
      if (!request.url().startsWith(origin)) external.push(request.url());
    });
    await page.goto(
      origin +
        '/desde-instagram.html?utm_source=instagram&utm_medium=social&utm_campaign=camino_malaga_2027&utm_content=bio',
    );
    assert.equal(
      await page.locator('link[rel="canonical"]').getAttribute('href'),
      'https://viveconuve.com/desde-instagram.html',
    );
    assert.equal(await page.locator('main a').first().getAttribute('href'), '/camino-a-hyrox.html');
    await page.locator('[data-cookie-action="reject"]').click();
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
    await page.screenshot({
      path: `.cache/distribution-review/entrada-${width}.png`,
      fullPage: true,
    });
    await page.locator('main a').first().click();
    assert.equal(new URL(page.url()).pathname, '/camino-a-hyrox.html');
    const card = await page.locator('meta[property="og:image"]').getAttribute('content');
    await page.goto(origin + new URL(card).pathname);
    const size = await page.locator('img').evaluate((img) => [img.naturalWidth, img.naturalHeight]);
    assert.deepEqual(size, [1200, 630]);
    assert.deepEqual(external, []);
    await context.close();
    console.log(
      `${width}px: campaign landing, clean canonical, first destination, accessibility, social image and preview privacy pass`,
    );
  }
} finally {
  await browser?.close();
  server.kill();
}
