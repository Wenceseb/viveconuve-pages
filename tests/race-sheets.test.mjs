import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { parse } from 'parse5';
import { nodes, attr, text } from '../scripts/lib/html.mjs';
import { categoryLabels } from '../public/assets/tools/model.js';
const doc = parse(
  await readFile(new URL('../dist/estaciones-hyrox.html', import.meta.url), 'utf8'),
);
const sheets = nodes(doc, 'details').filter((n) => attr(n, 'data-race-category'));
const rows = (key) =>
  nodes(
    sheets.find((n) => attr(n, 'data-race-category') === key),
    'tbody',
  ).flatMap((n) => nodes(n, 'tr'));
const values = (key) => rows(key).map((r) => nodes(r, 'td').map(text));
test('race reference covers the same 12 divisions as planner, each with eight station links', () => {
  assert.deepEqual(
    sheets.map((n) => attr(n, 'data-race-category')),
    Object.keys(categoryLabels),
  );
  for (const key of Object.keys(categoryLabels)) {
    assert.equal(rows(key).length, 8);
    assert.ok(rows(key).every((r) => nodes(r, 'a').length === 1));
  }
});
test('race reference keeps womens Pro, mixed doubles and relay loads distinct', () => {
  assert.equal(values('Women Pro')[1][1], '152 kg');
  assert.equal(values('Doubles Mixed Open')[1][1], '152 kg');
  assert.equal(values('Doubles Men Pro')[1][1], '202 kg');
  assert.equal(values('Relay Women')[1][1], '102 kg');
  assert.equal(values('Relay Men')[1][1], '152 kg');
  assert.equal(values('Women Open')[7][1], '4 kg · 2,70 m');
  assert.equal(values('Men Pro')[7][1], '9 kg · 3,00 m');
  assert.equal(values('Relay Mixed').filter((r) => r[1].includes('Por confirmar')).length, 5);
  assert.deepEqual(
    values('Men Open').map((r) => r[0]),
    ['1.000 m', '50 m', '50 m', '80 m', '1.000 m', '200 m', '100 m', '100 repeticiones'],
  );
});
