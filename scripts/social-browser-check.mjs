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
    assert.equal(
      await page.locator('main a').first().getAttribute('href'),
      '/athlonx-fuengirola-2026-cronica.html',
    );
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
    assert.equal(new URL(page.url()).pathname, '/athlonx-fuengirola-2026-cronica.html');
    await page.getByRole('link', { name: 'el camino a HYROX Málaga 2027', exact: true }).click();
    const card = await page.locator('meta[property="og:image"]').getAttribute('content');
    await page.goto(origin + new URL(card).pathname);
    const size = await page.locator('img').evaluate((img) => [img.naturalWidth, img.naturalHeight]);
    assert.deepEqual(size, [1200, 630]);
    assert.deepEqual(external, []);
    await page.goto(origin + '/articulos.html');
    await page.getByRole('link', { name: 'Seguir el camino a Málaga', exact: true }).click();
    assert.equal(new URL(page.url()).pathname, '/camino-a-hyrox.html');
    assert.equal(await page.locator('#sib-form').count(), 1);
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
      path: `.cache/distribution-review/camino-newsletter-${width}.png`,
      fullPage: true,
    });
    let submissions = 0;
    await context.route('https://*.sibforms.com/**', async (route) => {
      assert.equal(route.request().method(), 'POST');
      submissions++;
      await route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: '<p>Prueba local interceptada. No se ha enviado ninguna suscripción.</p>',
      });
    });
    await page.getByRole('button', { name: 'Suscribirme', exact: true }).click();
    assert.equal(submissions, 0, 'empty email must not submit');
    await page.locator('#EMAIL').fill('test@example.invalid');
    await page.getByRole('button', { name: 'Suscribirme', exact: true }).click();
    await page
      .getByText('Prueba local interceptada.', { exact: false })
      .waitFor({ state: 'visible' });
    assert.equal(submissions, 1);
    await context.close();
    console.log(
      `${width}px: campaign landing, clean canonical, first destination, accessibility, social image and preview privacy pass`,
    );
  }
} finally {
  await browser?.close();
  server.kill();
}
