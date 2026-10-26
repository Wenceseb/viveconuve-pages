import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { loadPages } from '../scripts/lib/content.mjs';
import { parse } from 'parse5';
import { nodes, attr, text } from '../scripts/lib/html.mjs';
const root = resolve(import.meta.dirname, '..');
test('active journeys cannot promote retired, merged or duplicate articles', async () => {
  const pages = await loadPages(root);
  const inactive = new Set(
    pages
      .filter((p) => ['archived', 'merged', 'alias'].includes(p.editorialStatus))
      .map((p) => p.permalink),
  );
  const selection = JSON.parse(await readFile(resolve(root, 'content/editorial.json'), 'utf8'));
  const active = pages.filter((p) => p.editorialStatus === 'active');
  assert.equal(active.length, new Set(Object.values(selection).flat()).size);
  assert.deepEqual(
    active.map((p) => p.permalink).sort(),
    Object.values(selection)
      .flat()
      .map((s) => `/${s}.html`)
      .sort(),
  );
  assert.equal(pages.filter((p) => p.editorialStatus === 'archived').length, 6);
  for (const page of pages.filter((p) => !inactive.has(p.permalink))) {
    const document = parse(await readFile(resolve(root, 'dist', '.' + page.permalink), 'utf8'));
    for (const node of nodes(document, 'a'))
      assert.ok(
        !inactive.has(attr(node, 'href')?.split('#')[0]),
        `${page.permalink} promotes ${attr(node, 'href')}`,
      );
    const visible = text(nodes(document, 'main')[0]);
    assert.ok(
      !/El artículo anterior|La versión anterior|Este relato conserva|mi primera competición(?! híbrida)/i.test(
        visible,
      ),
      page.permalink,
    );
  }
});
test('consolidations have explicit final links and no fake client redirects', async () => {
  const pages = await loadPages(root);
  const merged = pages.filter((p) => p.editorialStatus === 'merged');
  assert.equal(merged.length, 3);
  for (const page of merged) {
    const target = pages.find((p) => p.permalink === page.canonical);
    assert.equal(target.editorialStatus, 'active');
    assert.ok(page.content.includes(`href="${target.permalink}"`));
    assert.ok(!/http-equiv|location\.(replace|href)/i.test(page.content));
  }
});
test('resource page does not enable analytics or ads, even with consent', async () => {
  const document = parse(await readFile(resolve(root, 'dist/recursos.html'), 'utf8'));
  const script = nodes(document, 'script').find((n) => attr(n, 'data-analytics-id') !== undefined);
  assert.equal(attr(script, 'data-analytics-id'), '');
  assert.equal(attr(script, 'data-adsense-id'), '');
});
