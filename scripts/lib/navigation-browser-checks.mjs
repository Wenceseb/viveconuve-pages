import assert from 'node:assert/strict';
export async function checkNavigation(page, base) {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base + '/');
  const toggle = page.locator('.nav-toggle');
  const links = page.locator('#primary-navigation a');
  const first = links.first();
  if (await page.locator('#cookie-banner').isVisible())
    await page.locator('[data-cookie-action="reject"]').click();
  await toggle.click();
  await page.locator('h1').click();
  assert.equal(await toggle.getAttribute('aria-expanded'), 'false', 'Outside tap closes menu');
  await toggle.focus();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Tab');
  assert.equal(await first.evaluate((e) => e === document.activeElement), true);
  await page.keyboard.press('Escape');
  assert.equal(await toggle.evaluate((e) => e === document.activeElement), true);
  assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
  await toggle.click();
  await links.last().focus();
  await page.keyboard.press('Tab');
  assert.equal(await toggle.getAttribute('aria-expanded'), 'false', 'Leaving menu closes it');
  await toggle.click();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.waitForFunction(
    () => document.querySelector('.nav-toggle').getAttribute('aria-expanded') === 'false',
  );
  assert.equal(await first.isVisible(), true);
  await first.focus();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForFunction(
    () => document.activeElement === document.querySelector('.nav-toggle'),
  );
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.waitForFunction(
    () => document.activeElement === document.querySelector('#primary-navigation a'),
  );
  for (const width of [320, 390, 768, 769, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
      false,
      `${width}: no overflow`,
    );
    if (width <= 768) {
      await toggle.click();
      assert.equal(await first.isVisible(), true);
      await page.keyboard.press('Escape');
    }
  }
  console.log('Navigation: outside tap, keyboard, Escape, breakpoint focus and 320–1440px pass.');
}
