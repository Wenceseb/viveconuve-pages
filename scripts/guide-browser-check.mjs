import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { mkdir } from 'node:fs/promises';
const server = spawn(process.execPath, ['scripts/serve.mjs'], {
  env: { ...process.env, PORT: '8086' },
  stdio: ['ignore', 'pipe', 'inherit'],
});
let browser;
try {
  await once(server.stdout, 'data');
  await mkdir('.cache', { recursive: true });
  browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || 'msedge' });
  for (const width of [320, 390, 768, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 } });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto('http://127.0.0.1:8086/hyrox-despues-de-los-50.html');
    const reject = page.getByRole('button', { name: 'Solo las necesarias', exact: true });
    if (await reject.isVisible()) await reject.click();
    await page.locator('.guide-photo img').evaluate((img) => img.decode());
    await page.evaluate(() => document.fonts.ready);
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
      false,
    );
    assert.deepEqual(
      (
        await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
          .analyze()
      ).violations.map((v) => v.id),
      [],
    );
    await page.locator('.guide-header').screenshot({ path: `.cache/guide-header-${width}.png` });
    await page.locator('.guide-example').screenshot({ path: `.cache/guide-example-${width}.png` });
    for (const href of await page
      .locator('.h-toc a')
      .evaluateAll((links) => links.map((a) => a.getAttribute('href'))))
      assert.equal(await page.locator(href).count(), 1);
    const exampleTotal = await page.locator('.guide-total dd').textContent();
    await page.getByRole('link', { name: 'Probar esta cuenta en el planificador' }).click();
    await page.waitForURL('**/planificador-hyrox.html#example');
    // Opening the guide link must not populate a visitor's strategy automatically.
    assert.equal(await page.locator('#runs-0').inputValue(), '');
    await page.locator('#plan-name').fill('Mi borrador');
    page.once('dialog', (dialog) => dialog.dismiss());
    await page.locator('#example').click();
    assert.equal(await page.locator('#plan-name').inputValue(), 'Mi borrador');
    page.once('dialog', (dialog) => dialog.accept());
    await page.locator('#example').click();
    assert.equal(await page.locator('#plan-summary .race-total').textContent(), exampleTotal);
    await page.locator('#uniform-pace').fill('5:45');
    await page.locator('#uniform').click();
    await page.getByRole('button', { name: 'Calcular mi estrategia', exact: true }).click();
    assert.equal(await page.locator('#plan-summary .race-total').textContent(), '74:00');
    assert.deepEqual(errors, []);
    await context.close();
    console.log(
      `${width}px: guide layout, accessibility, example journey, cancellation and 72-to-74 minute calculation passed`,
    );
  }
} finally {
  await browser?.close();
  server.kill();
}
