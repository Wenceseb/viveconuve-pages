import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
const port = '8082';
const server = spawn(process.execPath, ['scripts/serve.mjs'], {
  env: { ...process.env, PORT: port },
  stdio: ['ignore', 'pipe', 'inherit'],
});
let browser;
try {
  await Promise.race([
    once(server.stdout, 'data'),
    once(server, 'exit').then(() => {
      throw new Error('Preview server failed');
    }),
  ]);
  browser = await chromium.launch({
    headless: true,
    ...(process.env.BROWSER_CHANNEL ? { channel: process.env.BROWSER_CHANNEL } : {}),
  });
  for (const width of [390, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await context.newPage();
    const external = [];
    page.on('request', (request) => {
      if (!request.url().startsWith(`http://127.0.0.1:${port}`)) external.push(request.url());
    });
    for (const path of [
      '/',
      '/articulos.html',
      '/cambio-fisico-a-los-50.html',
      '/politica-cookies.html',
    ]) {
      await page.goto(`http://127.0.0.1:${port}${path}`);
      await page.locator('img').evaluateAll(async (images) => {
        await Promise.all(
          images.map(async (img) => {
            img.loading = 'eager';
            try {
              await img.decode();
            } catch {}
          }),
        );
      });
      assert.equal(
        await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
        false,
        `${path}: overflow at ${width}`,
      );
      assert.deepEqual(
        await page
          .locator('img')
          .evaluateAll((images) => images.filter((img) => !img.naturalWidth).map((img) => img.src)),
        [],
        `${path}: broken images`,
      );
      const result = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();
      assert.deepEqual(
        result.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
        [],
        `${path}: accessibility at ${width}`,
      );
    }
    await page.goto(`http://127.0.0.1:${port}/`);
    await page.keyboard.press('Tab');
    assert.equal(
      await page.locator('.skip-link').evaluate((el) => el === document.activeElement),
      true,
    );
    await page.locator('[data-cookie-action="reject"]').click();
    await page.reload();
    assert.equal(await page.locator('#cookie-banner').isHidden(), true);
    if (width === 390) {
      await page.locator('.nav-toggle').click();
      assert.equal(await page.locator('.nav-toggle').getAttribute('aria-expanded'), 'true');
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('.nav-toggle').getAttribute('aria-expanded'), 'false');
      assert.equal(
        await page.locator('.nav-toggle').evaluate((el) => el === document.activeElement),
        true,
      );
    }
    assert.deepEqual(external, [], 'No third-party requests before acceptance or form submission');
    // Intercept the POST locally: never create a real newsletter subscription in a test.
    let submission;
    await page.route('https://bcd38566.sibforms.com/serve/**', async (route) => {
      submission = { method: route.request().method(), data: route.request().postData() };
      await route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: '<!doctype html><title>Intercepted test response</title><p>Not sent to Brevo</p>',
      });
    });
    await page.locator('#EMAIL').fill('audit@example.com');
    await Promise.all([
      page.waitForURL('https://bcd38566.sibforms.com/serve/**'),
      page.locator('#sib-form button[type="submit"]').click(),
    ]);
    assert.equal(submission.method, 'POST');
    assert.equal(new URLSearchParams(submission.data).get('EMAIL'), 'audit@example.com');
    await context.close();
    console.log(
      `Browser checks passed at ${width}px: accessibility, images, layout, keyboard, consent and intercepted form submission.`,
    );
  }
} finally {
  await browser?.close();
  server.kill();
}
