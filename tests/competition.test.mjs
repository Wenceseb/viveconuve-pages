import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const root = resolve(import.meta.dirname, '..');

test('the owner-corrected first competition date is used across the site', async () => {
  const data = JSON.parse(await readFile(resolve(root, 'content/competitions.json'), 'utf8'));
  assert.equal(data.first.date, '2026-06-13');
  assert.equal(data.first.name, 'AthlonX Córdoba (Caliphate)');
  for (const page of ['index', 'competiciones', 'atlhonx-cordoba-caliphate-2026']) {
    const html = await readFile(resolve(root, `dist/${page}.html`), 'utf8');
    assert.ok(html.includes('13 de junio de 2026'), page);
    assert.ok(!/2026-05-16|16 de mayo de 2026/.test(html), page);
    assert.ok(!html.includes('{{first'), page);
  }
  assert.equal(data.goal.status, 'goal');
  assert.equal(data.goal.period, '2027');
  assert.ok(!data.goal.month);
  assert.equal(data.next.status, 'registered');
  assert.equal(data.next.date, '2026-11-21');
  assert.ok(!data.goal.result);
});
