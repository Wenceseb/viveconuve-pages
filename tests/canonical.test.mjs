import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { parse } from 'parse5';
import { nodes, attr } from '../scripts/lib/html.mjs';
const root = resolve(import.meta.dirname, '..');
test('legacy steps URL stays reachable but points to the primary article and is excluded from feeds', async () => {
  const html = await readFile(resolve(root, 'dist/10.000 pasos.html'), 'utf8');
  const canonical = nodes(parse(html), 'link').find((node) => attr(node, 'rel') === 'canonical');
  assert.equal(
    attr(canonical, 'href'),
    'https://viveconuve.com/cuantos-pasos-al-dia-mito-10000.html',
  );
  for (const file of ['sitemap.xml', 'rss.xml']) {
    const feed = await readFile(resolve(root, 'dist', file), 'utf8');
    assert.ok(!feed.includes('10.000%20pasos.html'));
    assert.ok(feed.includes('cuantos-pasos-al-dia-mito-10000.html'));
  }
});
