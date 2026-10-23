import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { parse } from 'parse5';
import { loadPages } from '../scripts/lib/content.mjs';
import { nodes, attr } from '../scripts/lib/html.mjs';
const root = resolve(import.meta.dirname, '..');
test('sitemap contains exactly primary indexable HTTPS URLs and every page is reachable from home', async () => {
  const pages = await loadPages(root);
  const indexed = pages.filter((p) => !p.canonical && !p.robots.includes('noindex'));
  const xml = await readFile(resolve(root, 'dist/sitemap.xml'), 'utf8');
  const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
  const expected = indexed.map(
    (p) =>
      new URL(p.permalink === '/index.html' ? '/' : p.permalink, 'https://viveconuve.com').href,
  );
  assert.deepEqual([...urls].sort(), expected.sort());
  assert.equal(new Set(urls).size, urls.length);
  const graph = new Map();
  for (const p of pages) {
    const doc = parse(await readFile(resolve(root, 'dist', '.' + p.permalink), 'utf8'));
    const canonical = nodes(doc, 'link').find((n) => attr(n, 'rel') === 'canonical');
    const target = p.canonical || p.permalink;
    assert.equal(
      attr(canonical, 'href'),
      new URL(target === '/index.html' ? '/' : target, 'https://viveconuve.com').href,
    );
    graph.set(
      p.permalink,
      nodes(doc, 'a')
        .map((n) => attr(n, 'href')?.split('#')[0])
        .map((h) => (h === '/' ? '/index.html' : h)),
    );
  }
  const seen = new Set(),
    queue = ['/index.html'];
  while (queue.length) {
    const path = queue.shift();
    if (seen.has(path)) continue;
    seen.add(path);
    for (const h of graph.get(path) || []) if (graph.has(h)) queue.push(h);
  }
  for (const p of indexed) assert.ok(seen.has(p.permalink), `Orphan page: ${p.permalink}`);
});
test('old strength URL is preserved with the current canonical, not submitted as a duplicate', async () => {
  const old = '/rutina-fuerza-en-casa-3-dias-full-body-gente-normal.html';
  const pages = await loadPages(root);
  assert.equal(
    pages.find((p) => p.permalink === old).canonical,
    '/rutina-fuerza-casa-3-dias-full-body.html',
  );
  const xml = await readFile(resolve(root, 'dist/sitemap.xml'), 'utf8');
  assert.ok(!xml.includes(old));
});
