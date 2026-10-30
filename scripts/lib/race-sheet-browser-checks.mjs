import assert from 'node:assert/strict';
import { categoryLabels } from '../../public/assets/tools/model.js';
export async function checkRaceSheets(page, base) {
  await page.goto(base + '/estaciones-hyrox.html');
  const select = page.locator('#race-category');
  assert.equal(await select.inputValue(), '');
  assert.equal(await page.locator('#race-print').isVisible(), false);
  for (const key of Object.keys(categoryLabels)) {
    await select.selectOption(key);
    assert.equal(await page.locator('[data-race-category]:visible').count(), 1);
    assert.equal(await page.locator('[data-race-category]:visible tbody tr').count(), 8);
    assert.equal(new URL(page.url()).searchParams.get('modalidad'), key);
  }
  await page.reload();
  assert.equal(await select.inputValue(), 'Relay Mixed');
  assert.equal(await page.locator('.race-sheet-warning:visible').count(), 1);
  let printCalls = 0;
  await page.exposeFunction('recordRacePrint', () => printCalls++);
  await page.evaluate(() => {
    window.print = () => window.recordRacePrint();
  });
  await page.locator('#race-print').click();
  assert.equal(printCalls, 1);
  await page.emulateMedia({ media: 'print' });
  assert.equal(await page.locator('.station-course').isVisible(), false);
  assert.equal(await page.locator('#race-sheet').isVisible(), true);
  assert.equal(await page.locator('.site-header').isVisible(), false);
  await page.emulateMedia({ media: 'screen' });
  await page.goto(base + '/estaciones-hyrox.html?modalidad=invalid');
  assert.equal(await select.inputValue(), '');
  assert.equal(await page.locator('[data-race-category]:visible').count(), 0);
  console.log(
    'Race sheets: 12 categories, URL, reload, mixed warning, print and invalid input pass.',
  );
}
