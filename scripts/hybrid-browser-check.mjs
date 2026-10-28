import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { mkdir, readFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
const origin = process.env.TOOLS_ORIGIN || 'http://127.0.0.1:8084';
const server = process.env.TOOLS_ORIGIN
  ? null
  : spawn(process.execPath, ['scripts/serve.mjs'], {
      env: { ...process.env, PORT: '8084' },
      stdio: ['ignore', 'pipe', 'inherit'],
    });
if (server)
  await Promise.race([
    once(server.stdout, 'data'),
    once(server, 'exit').then(() => {
      throw new Error('Tools preview server failed');
    }),
  ]);
const browser = await chromium.launch({
  channel: process.env.BROWSER_CHANNEL || 'msedge',
  headless: true,
});
const dir = '.cache/hybrid-2026-10-26';
await mkdir(dir, { recursive: true });
try {
  for (const width of [390, 768, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } }),
      page = await context.newPage(),
      errors = [],
      external = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('request', (r) => {
      if (!r.url().startsWith(origin)) external.push(r.url());
    });
    page.on('dialog', (d) => d.accept());
    await page.goto(origin + '/planificador-hyrox.html');
    await page.locator('[data-cookie-action="reject"]').click();
    await page.locator('#example').click();
    assert.equal(await page.locator('#plan-summary .race-total').textContent(), '72:00');
    await page.locator('#plan-name').fill('Estrategia A');
    await page.locator('#save-plan').click();
    const aid = await page.locator('#saved-plans').inputValue();
    await page.locator('#clone-plan').click();
    await page.locator('#plan-name').fill('Estrategia B');
    await page.locator('#block-2 summary').click();
    await page.locator('#work-2').fill('2:30');
    await page.locator('#save-plan').click();
    const bid = await page.locator('#saved-plans').inputValue();
    await page.locator('#compare-a').selectOption(aid);
    await page.locator('#compare-b').selectOption(bid);
    await page.locator('#compare').click();
    assert.ok((await page.locator('#compare-difference').textContent()).includes('−0:30'));
    assert.equal(await page.locator('#compare-body tr').count(), 1);
    await page.locator('#compare-b').selectOption(aid);
    assert.equal(await page.locator('#comparison').isHidden(), true);
    await page.locator('#compare').click();
    assert.match(await page.locator('#compare-error').textContent(), /distintos/);
    await page.locator('#compare-b').selectOption(bid);
    assert.equal(await page.locator('#compare-error').textContent(), '');
    await page.locator('#compare').click();
    assert.equal(await page.locator('#comparison').isVisible(), true);
    await page.locator('#plan-name').fill('B renombrada');
    await page.locator('#save-plan').click();
    const exportWait = page.waitForEvent('download');
    await page.locator('#backup-plans').evaluate((node) => {
      node.open = true;
    });
    await page.locator('#export-plans').click();
    const file = await exportWait;
    const payload = JSON.parse(await readFile(await file.path(), 'utf8'));
    assert.equal(payload.items.length, 2);
    await page.locator('#import-plans').setInputFiles({
      name: 'copy.json',
      mimeType: 'application/json',
      buffer: Buffer.from(JSON.stringify(payload)),
    });
    await page.waitForFunction(() =>
      document.getElementById('plan-count').textContent.startsWith('4 de'),
    );
    assert.ok((await page.locator('#plan-count').textContent()).startsWith('4 de'));
    await page.locator('#import-plans').setInputFiles({
      name: 'bad.json',
      mimeType: 'application/json',
      buffer: Buffer.from('{broken'),
    });
    await page.waitForFunction(() =>
      document
        .getElementById('planner-error')
        .textContent.includes('No podemos leer esta copia de seguridad'),
    );
    assert.ok(await page.locator('#planner-error').textContent());
    assert.ok((await page.locator('#plan-count').textContent()).startsWith('4 de'));
    await page.reload();
    await page.locator('#saved-plans').selectOption(bid);
    await page.locator('#load-plan').click();
    assert.equal(await page.locator('#plan-name').inputValue(), 'B renombrada');
    await page.locator('#runs-0').fill('5:60');
    await page.locator('#planner-form button[type=submit]').click();
    assert.equal(await page.locator('#planner-result').isHidden(), true);
    assert.equal(await page.locator('#runs-0').getAttribute('aria-invalid'), 'true');
    await page.locator('#runs-0').fill('5:30');
    await page.locator('#save-plan').click();
    await page.emulateMedia({ media: 'print' });
    assert.equal(await page.locator('#planner-form').isHidden(), true);
    assert.equal(await page.locator('#timeline-body').isVisible(), true);
    await page.emulateMedia({ media: 'screen' });
    await page.locator('#compare-a').selectOption(aid);
    await page.locator('#compare-b').selectOption(bid);
    await page.locator('#compare').click();
    await page.screenshot({ path: `${dir}/planner-${width}.png`, fullPage: true });
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
      false,
    );
    assert.deepEqual(
      (
        await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
          .analyze()
      ).violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
      [],
    );
    await page.goto(origin + '/mi-progreso.html');
    for (const [date, timing] of [
      ['2026-10-25', '25:00'],
      ['2026-10-26', '24:30'],
    ]) {
      await page.locator('#record-name').fill('5 km comprobados');
      await page.locator('#record-date').fill(date);
      await page.locator('#amount').fill('5000');
      await page.locator('#record-time').fill(timing);
      await page.locator('#conditions').fill('Asfalto, recorrido A');
      await page.locator('#verified').check();
      if (!(await page.locator('#notes').isVisible()))
        await page
          .getByText('Sensaciones, carga previa y parciales conocidos', { exact: true })
          .click();
      await page.locator('#notes').fill('<img src=x onerror=alert(1)> Notas reales');
      await page.locator('#record-form button[type=submit]').click();
    }
    const ids = await page
      .locator('#reference-a option')
      .evaluateAll((nodes) => nodes.map((n) => n.value).filter(Boolean));
    assert.equal(ids.length, 2);
    await page.locator('#reference-a').selectOption(ids[0]);
    await page.locator('#reference-b').selectOption(ids[1]);
    await page.locator('#compare-records').click();
    assert.ok((await page.locator('#progress-difference').textContent()).includes('−0:30'));
    assert.equal(await page.locator('#evolution-chart meter').count(), 2);
    await page.locator('#reference-b').selectOption(ids[0]);
    assert.equal(await page.locator('#progress-comparison').isHidden(), true);
    await page.locator('#compare-records').click();
    assert.match(await page.locator('#comparison-error').textContent(), /distintas/);
    await page.locator('#reference-b').selectOption(ids[1]);
    assert.equal(await page.locator('#comparison-error').textContent(), '');
    await page.locator('#compare-records').click();
    assert.equal(await page.locator('#progress-comparison').isVisible(), true);
    await page.locator('#filter-text').fill('No existe esta referencia');
    assert.equal(await page.locator('#no-matching-records').isVisible(), true);
    assert.equal(await page.locator('#empty-records').isHidden(), true);
    await page.locator('#reset-filters').click();
    assert.equal(await page.locator('#records-list .record-row').count(), 2);
    assert.equal(await page.locator('#no-matching-records').isHidden(), true);
    assert.equal(await page.locator('#records-list img').count(), 0);
    await page.reload();
    await page.locator('#records-list .record-row').first().waitFor();
    assert.equal(await page.locator('.record-row').count(), 2);
    await page
      .getByRole('button', { name: 'Editar: 5 km comprobados, 2026-10-26', exact: true })
      .click();
    await page.locator('#amount').fill('1000');
    await page.locator('#record-form button[type=submit]').click();
    await page.locator('#reference-a').selectOption(ids[0]);
    await page.locator('#reference-b').selectOption(ids[1]);
    await page.locator('#compare-records').click();
    assert.ok(
      (await page.locator('#comparison-error').textContent()).includes('No son comparables'),
    );
    await page
      .getByRole('button', { name: 'Editar: 5 km comprobados, 2026-10-26', exact: true })
      .click();
    await page.locator('#amount').fill('5000');
    await page.locator('#record-form button[type=submit]').click();
    await page.locator('#reference-a').selectOption(ids[0]);
    await page.locator('#reference-b').selectOption(ids[1]);
    await page.locator('#compare-records').click();
    const exportRecords = page.waitForEvent('download');
    await page.locator('#export-records').click();
    const records = await exportRecords;
    const data = await readFile(await records.path());
    await page
      .locator('#import-records')
      .setInputFiles({ name: 'records.json', mimeType: 'application/json', buffer: data });
    await page.waitForFunction(() => document.querySelectorAll('.record-row').length === 4);
    assert.equal(await page.locator('.record-row').count(), 4);
    await page
      .getByRole('button', { name: 'Borrar: 5 km comprobados, 2026-10-26', exact: true })
      .first()
      .click();
    assert.equal(await page.locator('.record-row').count(), 3);
    await page.locator('#filter-activity').selectOption('ski');
    assert.equal(await page.locator('.record-row').count(), 0);
    await page.locator('#filter-activity').selectOption('');
    await page.screenshot({ path: `${dir}/progress-${width}.png`, fullPage: true });
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
      false,
    );
    assert.deepEqual(
      (
        await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
          .analyze()
      ).violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
      [],
    );
    assert.deepEqual(errors, []);
    assert.deepEqual(external, []);
    await context.close();
    console.log(
      `${width}px: planner, A/B, CRUD, JSON, persistence, compatible comparisons, print, axe and privacy passed.`,
    );
  }
  for (const mode of ['blocked', 'full', 'corrupt']) {
    const context = await browser.newContext(),
      page = await context.newPage();
    page.on('dialog', (d) => d.accept());
    await context.addInitScript((mode) => {
      if (mode === 'corrupt') {
        localStorage.setItem('vcv_plans_v1', '{not-json');
        localStorage.setItem('vcv_records_v1', '{not-json');
      } else {
        Storage.prototype.setItem = function () {
          throw new DOMException(
            'No storage',
            mode === 'full' ? 'QuotaExceededError' : 'SecurityError',
          );
        };
        if (mode === 'blocked')
          Storage.prototype.getItem = function () {
            throw new DOMException('Blocked', 'SecurityError');
          };
      }
    }, mode);
    await page.goto(origin + '/planificador-hyrox.html');
    await page.locator('[data-cookie-action=reject]').click();
    await page.locator('#example').click();
    await page.locator('#save-plan').click();
    assert.ok((await page.locator('#local-status').textContent()).includes('solo en esta sesión'));
    const wait = page.waitForEvent('download');
    await page.locator('#backup-plans').evaluate((node) => {
      node.open = true;
    });
    await page.locator('#export-plans').click();
    const result = await wait;
    assert.equal(JSON.parse(await readFile(await result.path(), 'utf8')).items.length, 1);
    if (mode === 'corrupt')
      assert.equal(await page.evaluate(() => localStorage.getItem('vcv_plans_v1')), '{not-json');
    await page.goto(origin + '/mi-progreso.html');
    const record = {
      id: 'test',
      activity: 'run',
      date: '2026-10-26',
      name: 'Registro recuperable',
      amount: 1000,
      load: null,
      seconds: 300,
      context: 'fresh',
      conditions: 'Asfalto',
      notes: '',
      verified: true,
    };
    await page.locator('#import-records').setInputFiles({
      name: 'records.json',
      mimeType: 'application/json',
      buffer: Buffer.from(
        JSON.stringify({
          application: 'viveconuve',
          version: 1,
          kind: 'records',
          items: [record],
        }),
      ),
    });
    await page.waitForFunction(() => document.querySelectorAll('.record-row').length === 1);
    assert.ok((await page.locator('#local-status').textContent()).includes('solo en esta sesión'));
    await page
      .getByRole('button', { name: /^Editar:/ })
      .first()
      .click();
    assert.equal(
      await page.evaluate(() => {
        const event = new Event('beforeunload', { cancelable: true });
        window.dispatchEvent(event);
        return event.defaultPrevented;
      }),
      true,
      'Opening a clean form must not clear the warning for memory-only records',
    );
    const exportWait = page.waitForEvent('download');
    await page.locator('#export-records').click();
    const exportFile = await exportWait;
    assert.equal(
      JSON.parse(await readFile(await exportFile.path(), 'utf8')).items[0].name,
      'Registro recuperable',
    );
    if (mode === 'corrupt')
      assert.equal(await page.evaluate(() => localStorage.getItem('vcv_records_v1')), '{not-json');
    await context.close();
    console.log(
      `Storage ${mode}: usable in memory, warning visible, export works, original preserved.`,
    );
  }

  const pdfContext = await browser.newContext();
  const pdfPage = await pdfContext.newPage();
  pdfPage.on('dialog', (dialog) => dialog.accept());
  await pdfPage.goto(origin + '/planificador-hyrox.html');
  await pdfPage.locator('#example').click();
  const categoryValues = await pdfPage
    .locator('#category option')
    .evaluateAll((nodes) => nodes.map((node) => node.value));
  assert.equal(categoryValues.length, 12);
  for (const category of categoryValues) {
    await pdfPage.selectOption('#category', category);
    await pdfPage.locator('#save-plan').click();
    assert.match(await pdfPage.locator('#plan-summary').textContent(), /72:00/);
  }
  await pdfPage.evaluate(() => {
    window.print = () => {
      window.printedStrategy = document.querySelector('#plan-summary').textContent;
    };
  });
  await pdfPage.locator('#print-saved-plan').click();
  assert.match(await pdfPage.evaluate(() => window.printedStrategy), /Equipo mixto/);
  await pdfPage.emulateMedia({ media: 'print' });
  assert.equal(await pdfPage.locator('#timeline-body tr:visible').count(), 32);
  await pdfPage.emulateMedia({ media: 'screen' });
  await pdfPage.goto(origin + '/mi-progreso.html');
  await pdfPage.locator('#print-records').click();
  assert.match(
    await pdfPage.locator('#print-records-error').textContent(),
    /No hay registros visibles/,
  );
  const printable = {
    id: 'print-one',
    activity: 'run',
    date: '2026-10-26',
    name: 'Mi referencia visible',
    amount: 1000,
    load: null,
    seconds: 300,
    context: 'fresh',
    conditions: 'Asfalto',
    notes: 'Nota <b>literal</b>',
    verified: true,
  };
  await pdfPage.locator('#import-records').setInputFiles({
    name: 'backup.json',
    mimeType: 'application/json',
    buffer: Buffer.from(
      JSON.stringify({
        application: 'viveconuve',
        version: 1,
        kind: 'records',
        items: [printable, { ...printable, id: 'print-two', name: 'Otro registro' }],
      }),
    ),
  });
  await pdfPage.locator('#filter-text').fill('Mi referencia visible');
  await pdfPage.emulateMedia({ media: 'print' });
  await pdfPage.evaluate(() => {
    window.print = () => {
      window.printCheck = {
        text: document.querySelector('#progress-print').textContent,
        visible: getComputedStyle(document.querySelector('#progress-print')).display,
        buttons: document.querySelectorAll('#progress-print button').length,
      };
    };
  });
  await pdfPage.locator('#print-records').dispatchEvent('click');
  const printed = await pdfPage.evaluate(() => window.printCheck);
  assert.equal(printed.visible, 'block');
  assert.equal(printed.buttons, 0);
  assert.match(printed.text, /Mi referencia visible/);
  assert.ok(!printed.text.includes('Otro registro'));
  assert.ok(printed.text.includes('Nota <b>literal</b>'));
  assert.equal(await pdfPage.locator('#progress-print b').count(), 0);
  await pdfPage.emulateMedia({ media: 'screen' });
  assert.equal(await pdfPage.locator('#progress-print').isVisible(), false);
  const savedRecords = await pdfPage.evaluate(() => localStorage.getItem('vcv_records_v1'));
  for (const [slug, activity] of Object.entries({
    skierg: 'ski',
    'sled-push': 'push',
    'sled-pull': 'pull',
    'burpee-broad-jumps': 'burpee',
    rowing: 'row',
    'farmers-carry': 'carry',
    'sandbag-lunges': 'lunge',
    'wall-balls': 'wall',
  })) {
    await pdfPage.goto(`${origin}/hyrox-${slug}.html`);
    await pdfPage.locator(`a[href="/mi-progreso.html?actividad=${activity}#anotar"]`).click();
    await pdfPage.waitForFunction(
      (value) => document.querySelector('#activity').value === value,
      activity,
    );
    assert.equal(
      await pdfPage.locator('#activity-guide a').getAttribute('href'),
      `/hyrox-${slug}.html`,
    );
    for (const input of ['record-date', 'record-time', 'amount', 'load'])
      assert.equal(await pdfPage.locator(`#${input}`).inputValue(), '');
    assert.equal(
      await pdfPage.evaluate(() => localStorage.getItem('vcv_records_v1')),
      savedRecords,
    );
  }
  await pdfPage.goto(`${origin}/mi-progreso.html?actividad=__proto__`);
  await pdfPage.waitForFunction(() => document.querySelector('#activity').options.length > 0);
  assert.equal(await pdfPage.locator('#activity').inputValue(), 'run');
  assert.equal(await pdfPage.locator('#activity-guide').isVisible(), false);
  assert.equal(await pdfPage.evaluate(() => localStorage.getItem('vcv_records_v1')), savedRecords);
  const warnsOnLeave = () =>
    pdfPage.evaluate(() => {
      const event = new Event('beforeunload', { cancelable: true });
      window.dispatchEvent(event);
      return event.defaultPrevented;
    });
  await pdfPage.locator('#record-name').fill('Borrador que debo conservar');
  assert.equal(await warnsOnLeave(), true);
  // Deleting a different saved record must not mark the current form as saved.
  await pdfPage
    .getByRole('button', { name: /^Borrar:/ })
    .last()
    .click();
  assert.equal(await pdfPage.locator('#record-name').inputValue(), 'Borrador que debo conservar');
  assert.equal(await warnsOnLeave(), true);
  pdfPage.removeAllListeners('dialog');
  pdfPage.once('dialog', (dialog) => dialog.dismiss());
  await pdfPage
    .getByRole('button', { name: /^Editar:/ })
    .first()
    .click();
  assert.equal(await pdfPage.locator('#record-name').inputValue(), 'Borrador que debo conservar');
  assert.equal(await warnsOnLeave(), true);
  pdfPage.once('dialog', (dialog) => dialog.accept());
  await pdfPage
    .getByRole('button', { name: /^Editar:/ })
    .first()
    .click();
  assert.equal(await warnsOnLeave(), false);
  await pdfPage
    .getByRole('button', { name: /^Duplicar:/ })
    .first()
    .click();
  assert.equal(await warnsOnLeave(), true);
  pdfPage.once('dialog', (dialog) => dialog.accept());
  await pdfPage.locator('#new-record').click();
  assert.equal(await warnsOnLeave(), false);
  await pdfContext.close();
  console.log(
    'Draft survives archive changes and cancelled edits; explicit discard clears only the draft.',
  );
  console.log('Eight station-to-record journeys preserve saved data and leave measurements blank.');
  console.log('12 categories and selected-strategy PDF retain all 32 segments.');
} finally {
  await browser.close();
  server?.kill();
}
