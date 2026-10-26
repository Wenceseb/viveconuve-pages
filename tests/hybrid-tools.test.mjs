import test from 'node:test';
import assert from 'node:assert/strict';
import {
  time,
  clock,
  scenario,
  sumPlan,
  comparePlans,
  record,
  comparable,
  pack,
  unpack,
  csv,
} from '../public/assets/tools/model.js';
const plan = () =>
  scenario({
    id: 'one',
    name: 'A',
    category: 'Men Open',
    target: 4800,
    runs: Array(8).fill(330),
    work: Array(8).fill(180),
    entry: Array(8).fill(15),
    exit: Array(8).fill(15),
  });
const reference = () =>
  record({
    id: 'one',
    activity: 'run',
    date: '2026-10-25',
    name: '5 km',
    amount: 5000,
    load: null,
    seconds: 1500,
    context: 'fresh',
    conditions: 'Circuito A, asfalto, continuo',
    notes: '',
    verified: true,
  });
test('time conversion accepts explicit units, Spanish decimals and rejects missing or invalid fields', () => {
  for (const v of ['5:30', '5,5', '5.5']) assert.equal(time(v), 330);
  assert.equal(time('1:20:00'), 4800);
  assert.equal(clock(4800), '80:00');
  assert.equal(time('0:00', true), 0);
  for (const v of ['', '5:60', '5:3', '-1', 'Infinity', '1e3', '0', '24:01:00'])
    assert.throws(() => time(v));
});
test('32 segments sum exactly; no duplicated transition and cumulative finish agrees', () => {
  const p = plan(),
    r = sumPlan(p);
  assert.equal(r.runs, 2640);
  assert.equal(r.work, 1440);
  assert.equal(r.transitions, 240);
  assert.equal(r.total, 4320);
  assert.equal(r.delta, -480);
  assert.equal(r.timeline.length, 32);
  assert.equal(r.timeline.at(-1).cumulative, r.total);
  assert.equal(comparePlans(p, p).total, 0);
  const b = structuredClone(p);
  b.work[2] -= 30;
  const diff = comparePlans(p, b);
  assert.equal(diff.total, -30);
  assert.equal(diff.rows.filter((v) => v.delta !== 0).length, 1);
  assert.equal(diff.rows.find((v) => v.delta !== 0).label, 'Sled Pull');
});
test('plan import validates whole document before use, removes unknown keys and keeps integer seconds', () => {
  const p = plan();
  assert.deepEqual(unpack(pack('plans', [p]), 'plans', scenario, 30), [p]);
  for (const invalid of [
    { ...p, runs: [330] },
    { ...p, target: null },
    { ...p, work: Array(8).fill(-1) },
    { ...p, entry: Array(8).fill(0.5) },
  ])
    assert.throws(() => scenario(invalid));
  assert.throws(() => unpack(pack('plans', [p, p]), 'plans', scenario, 30));
  assert.throws(() => unpack({ ...pack('plans', [p]), version: 2 }, 'plans', scenario, 30));
  assert.equal(Object.hasOwn(scenario({ ...p, script: 'alert(1)' }), 'script'), false);
});
test('records compare only equivalent units, loads, context and declared conditions', () => {
  const a = reference(),
    b = { ...a, id: 'two', seconds: 1450, date: '2026-10-26' };
  assert.equal(comparable(a, b), true);
  for (const changed of [
    { amount: 1000 },
    { activity: 'ski' },
    { context: 'after' },
    { conditions: 'Tierra' },
    { conditions: '' },
  ])
    assert.equal(comparable(a, { ...b, ...changed }), false);
  const r = { ...a, activity: 'race', amount: null, name: 'HYROX Men Open' };
  assert.equal(comparable(r, { ...r, name: 'HYROX Men Pro' }), false);
  assert.throws(() => record({ ...a, date: '2026-02-30' }));
  assert.throws(() => record({ ...a, amount: 0 }));
  assert.throws(() => record({ ...a, seconds: NaN }));
});
test('CSV quotes multiline notes and neutralizes spreadsheet formulas', () => {
  const r = { ...reference(), name: '=HYPERLINK("x")', notes: 'line 1, "quoted"\nline 2' };
  const result = csv([r]);
  assert.ok(result.includes('"\'=HYPERLINK(""x"")"'));
  assert.ok(result.includes('"line 1, ""quoted""\nline 2"'));
});
