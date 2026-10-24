import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { parse } from 'parse5';
import { loadPages } from '../scripts/lib/content.mjs';
import { nodes, text, attr } from '../scripts/lib/html.mjs';
const root = resolve(import.meta.dirname, '..');
test('all legacy articles are reviewed and their structured titles match the visible headings', async () => {
  for (const page of (await loadPages(root)).filter((p) => p.source.startsWith('articles/'))) {
    assert.ok(['2026-10-23', '2026-10-24'].includes(page.editorialReviewed), page.source);
    const html = await readFile(resolve(root, 'dist', '.' + page.permalink), 'utf8');
    assert.ok(
      !/CTA:|para SEO y para retener|deshinchar en 2 días|Eso no es insomnio|\{first\w+\}/.test(
        html,
      ),
      page.source,
    );
    const doc = parse(html);
    const h1 = text(nodes(doc, 'h1')[0]).replace(/\s+/g, ' ').trim();
    const schema = page.structuredData.find((s) => s['@type'] === 'BlogPosting');
    if (schema) assert.equal(schema.headline, h1, page.source);
  }
});
test('podium caption uses the exact owner-approved name and date, without a duplicate year', async () => {
  for (const name of ['index', 'competiciones', 'atlhonx-cordoba-caliphate-2026']) {
    const doc = parse(await readFile(resolve(root, `dist/${name}.html`), 'utf8'));
    const captions = nodes(doc, 'figcaption').map((n) => text(n).replace(/\s+/g, ' ').trim());
    assert.ok(
      captions.some((caption) =>
        caption.startsWith('AthlonX Córdoba (Caliphate), 13 de junio de 2026'),
      ),
      name,
    );
  }
});
test('article archive links to all primary reviewed articles, not the duplicate legacy URL', async () => {
  const doc = parse(await readFile(resolve(root, 'dist/articulos.html'), 'utf8'));
  const links = nodes(doc, 'a').map((n) => attr(n, 'href'));
  for (const p of (await loadPages(root)).filter((p) => p.editorialStatus === 'active'))
    assert.ok(links.includes(p.permalink), p.permalink);
  assert.ok(!links.includes('/10.000 pasos.html'));
});
