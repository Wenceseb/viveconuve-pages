import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { parse } from 'parse5';
import { nodes, attr } from '../scripts/lib/html.mjs';
const data = JSON.parse(
  await readFile(new URL('../content/station-details.json', import.meta.url), 'utf8'),
);
test('eight station sheets expose separate doubles and relay tables with working routes', async () => {
  assert.equal(new Set(data.map((s) => s.slug)).size, 8);
  for (const station of data) {
    assert.equal(station.doubles.length, 5);
    assert.equal(station.relay.length, 2);
    const html = parse(
      await readFile(new URL(`../dist/hyrox-${station.slug}.html`, import.meta.url), 'utf8'),
    );
    assert.equal(nodes(html, 'section').filter((n) => attr(n, 'id') === 'equipos').length, 1);
    assert.equal(nodes(html, 'title').filter((n) => attr(n, 'id') === 'material-title').length, 1);
    assert.ok(
      nodes(html, 'a').some((n) =>
        (attr(n, 'href') || '').includes('RulebookDoubles_EN.pdf#page='),
      ),
    );
    assert.ok(
      nodes(html, 'a').some((n) => (attr(n, 'href') || '').includes('RulebookRelay_EN.pdf#page=')),
    );
  }
});
test('doubles Pro and mixed loads do not leak into relay references', () => {
  assert.deepEqual(data.find((s) => s.slug === 'sled-push').relay, ['102 kg', '152 kg']);
  assert.deepEqual(data.find((s) => s.slug === 'sled-pull').doubles, [
    '78 kg',
    '103 kg',
    '103 kg',
    '103 kg',
    '153 kg',
  ]);
  assert.deepEqual(data.find((s) => s.slug === 'wall-balls').relay, ['4 kg', '6 kg']);
});
test('owner rejected slogan is absent from the personal introduction', async () => {
  const html = await readFile(new URL('../dist/sobre-mi.html', import.meta.url), 'utf8');
  assert.doesNotMatch(html, /queda mucho por competir/i);
  assert.match(html, /Entreno\. Aprendo\. Lo cuento\./);
});
