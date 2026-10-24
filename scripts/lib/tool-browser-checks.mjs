import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
export async function checkTools(page, origin, width) {
  await page.goto(`${origin}/recursos.html`);
  const requests = [];
  const watch = (request) => requests.push(request.url());
  page.on('request', watch);
  await page.locator('[data-preset="hyrox"]').click();
  assert.equal(await page.locator('#run-total').textContent(), '44:00');
  assert.equal(await page.locator('#per-leg').textContent(), '5:30');
  await page.locator('[data-preset="cordoba"]').click();
  assert.equal(await page.locator('#run-total').textContent(), '20:00');
  assert.equal(await page.locator('#per-leg').textContent(), '2:00');
  await page.locator('#extra-min').fill('3');
  await page.locator('#extra-sec').fill('15');
  await page.locator('#pace-form button[type="submit"]').click();
  assert.equal(await page.locator('#combined-total').textContent(), '23:15');
  for (const value of ['60', '-1', '', '1.5', 'abc']) {
    await page.locator('#pace-sec').fill(value);
    await page.locator('#pace-form button[type="submit"]').click();
    assert.ok(await page.locator('#pace-error').textContent());
    assert.equal(await page.locator('#pace-result').isHidden(), true);
    assert.equal(await page.locator('#pace-sec').getAttribute('aria-invalid'), 'true');
  }
  await page.locator('[data-preset="hyrox"]').click();
  await page.locator('#segments').fill('0');
  await page.locator('#pace-form button[type="submit"]').click();
  assert.ok(await page.locator('#pace-error').textContent());
  await page.locator('#checklist input[name="rules"]').check();
  await page.locator('#custom-check').fill('Prueba de guardado local');
  await page.locator('#add-check-form button').click();
  await page.locator('#custom-checks input').check();
  await page.locator('#race-name').fill('Prueba local, no enviada');
  await page.locator('#race-good').fill('Notas con <etiquetas> y saltos\nde línea.');
  await page.reload();
  assert.equal(await page.locator('#checklist input[name="rules"]').isChecked(), true);
  assert.equal(await page.locator('#custom-checks input').isChecked(), true);
  assert.equal(await page.locator('#race-name').inputValue(), 'Prueba local, no enviada');
  assert.equal(
    await page.locator('#race-good').inputValue(),
    'Notas con <etiquetas> y saltos\nde línea.',
  );
  assert.equal(
    await page.locator('#review-print etiquetas').count(),
    0,
    'notes must remain plain text',
  );
  const download = page.waitForEvent('download');
  await page.locator('#export-review').click();
  assert.equal((await download).suggestedFilename(), 'mi-revision-competicion.txt');
  await page.emulateMedia({ media: 'print' });
  assert.equal(await page.locator('#review-form').isHidden(), true);
  assert.equal(await page.locator('#review-print').isVisible(), true);
  assert.ok(
    (await page.locator('#review-print').textContent()).includes('Prueba local, no enviada'),
  );
  assert.equal(await page.locator('.site-header').isHidden(), true);
  await page.emulateMedia({ media: 'screen' });
  page.once('dialog', (dialog) => dialog.dismiss());
  await page.locator('#clear-review').click();
  assert.equal(await page.locator('#race-name').inputValue(), 'Prueba local, no enviada');
  page.once('dialog', (dialog) => dialog.accept());
  await page.locator('#clear-review').click();
  page.once('dialog', (dialog) => dialog.accept());
  await page.locator('#reset-checks').click();
  assert.equal(await page.locator('#custom-checks input').isChecked(), false);
  page.once('dialog', (dialog) => dialog.accept());
  await page.locator('#clear-checks').click();
  await page.reload();
  assert.equal(await page.locator('#race-name').inputValue(), '');
  assert.equal(await page.locator('#custom-checks label').count(), 0);
  assert.equal(await page.locator('#checklist input[name="rules"]').isChecked(), false);
  assert.ok(
    requests.every((url) => url.startsWith(origin)),
    'tools must never send notes or analytics externally',
  );
  page.off('request', watch);
  console.log(
    `Tools passed at ${width}px: calculations, invalid inputs, local persistence, safe export, print, cancel and reset.`,
  );
}
export async function captureReview(page, origin) {
  const directory = resolve('.cache/review-2026-10-24');
  await mkdir(directory, { recursive: true });
  for (const width of [375, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const name of ['index', 'atlhonx-cordoba-caliphate-2026', 'camino-a-hyrox', 'recursos']) {
      await page.goto(`${origin}/${name}.html`);
      assert.equal(
        await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
        false,
        `${name} overflow ${width}`,
      );
      await page.locator('img').evaluateAll(async (images) =>
        Promise.all(
          images.map((img) => {
            img.loading = 'eager';
            return img.decode().catch(() => {});
          }),
        ),
      );
      if (width === 390 || width === 1440)
        await page.screenshot({ path: resolve(directory, `${name}-${width}.png`), fullPage: true });
    }
  }
  await page.goto(`${origin}/recursos.html`);
  await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
  assert.equal(
    await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
    false,
    'text enlargement overflow',
  );
  console.log(
    'Representative layouts passed 375, 390, 768 and 1440px; screenshots saved in .cache/review-2026-10-24.',
  );
}
export async function checkBlockedStorage(browser, origin) {
  const context = await browser.newContext();
  await context.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new Error('Storage blocked for test');
      },
    });
  });
  const page = await context.newPage();
  await page.goto(`${origin}/recursos.html`);
  assert.ok((await page.locator('#storage-status').textContent()).includes('No se puede guardar'));
  await page.locator('[data-preset="hyrox"]').click();
  assert.equal(await page.locator('#run-total').textContent(), '44:00');
  await page.locator('#race-good').fill('Sesión local');
  assert.ok((await page.locator('#review-status').textContent()).includes('solo en esta sesión'));
  const dialog = page.waitForEvent('dialog');
  const navigation = page.goto(`${origin}/`).catch(() => {});
  const warning = await dialog;
  assert.equal(warning.type(), 'beforeunload');
  await warning.accept();
  await navigation;
  await context.close();
  console.log(
    'Blocked storage: calculator and notes work, limitation is visible and leaving prompts before data loss.',
  );
}
