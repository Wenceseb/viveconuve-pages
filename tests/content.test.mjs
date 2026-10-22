import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { parse, parseFragment } from 'parse5';
import { resolve } from 'node:path';
import { parseContent, loadPages, render } from '../scripts/lib/content.mjs';
import { nodes, text, attr } from '../scripts/lib/html.mjs';
import { validateSite } from '../scripts/lib/validate.mjs';
const root = resolve(import.meta.dirname, '..');
const normalize = (value) => value.replace(/\s+/g, ' ').trim();
test('front matter rejects incomplete or unsafe page metadata', () => {
  for (const value of [
    'no metadata',
    '---\n{}\n---\ntext',
    '---\n{"title":"a","description":"b","permalink":"/../bad.html"}\n---\ntext',
  ])
    assert.throws(() => parseContent(value));
});
test('templates escape metadata and reject missing values', () => {
  assert.equal(
    render('<title>{{title}}</title>', { title: '<unsafe & text>' }),
    '<title>&lt;unsafe &amp; text&gt;</title>',
  );
  assert.throws(() => render('{{unknown}}', {}));
});
test('all original editorial pages retain URLs, titles and principal headings', async () => {
  const baseline = JSON.parse(await readFile(resolve(root, 'tests/content-baseline.json'), 'utf8'));
  const pages = await loadPages(root);
  assert.equal(pages.length, Object.keys(baseline).length);
  for (const page of pages) {
    const expected = baseline[page.permalink];
    assert.ok(expected, page.permalink);
    assert.equal(page.title, expected.title);
    assert.equal(page.description, expected.description);
    const document = parse(await readFile(resolve(root, 'dist', '.' + page.permalink), 'utf8'));
    assert.deepEqual(
      nodes(document, 'h1').map((n) => normalize(text(n))),
      expected.headings.map((h) => normalize(text(parseFragment(h)))),
    );
    const current = nodes(document, 'a').filter((n) => attr(n, 'aria-current') === 'page');
    assert.ok(current.length <= 1);
  }
});
test('generated production output has no broken links, invalid metadata, trackers or budget violations', async () => {
  const result = await validateSite(resolve(root, 'dist'));
  assert.deepEqual(result.errors, []);
  assert.equal(result.pages, 23);
});
test('newsletter scripts and styles are isolated to pages containing the shared form', async () => {
  for (const page of await loadPages(root)) {
    const source = await readFile(resolve(root, 'dist', '.' + page.permalink), 'utf8');
    assert.equal(source.includes('sibforms.com/forms/end-form/build/main.js'), page.newsletter);
    assert.equal(source.includes('id="sib-form"'), page.newsletter);
    assert.ok(!source.includes('vcv-newsletter-feedback'));
  }
});

test('newsletter input, locale and submit button belong to the same form', async () => {
  const document = parse(await readFile(resolve(root, 'dist/index.html'), 'utf8'));
  const form = nodes(document, 'form').find((node) => attr(node, 'id') === 'sib-form');
  assert.ok(form);
  assert.equal(attr(form, 'method').toLowerCase(), 'post');
  assert.ok(attr(form, 'action').startsWith('https://bcd38566.sibforms.com/serve/'));
  assert.ok(
    nodes(form, 'input').some(
      (node) => attr(node, 'name') === 'EMAIL' && attr(node, 'type') === 'email',
    ),
  );
  assert.ok(nodes(form, 'input').some((node) => attr(node, 'name') === 'locale'));
  assert.ok(nodes(form, 'button').some((node) => attr(node, 'type') === 'submit'));
});
