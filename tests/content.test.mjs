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
test('original URLs remain available and unchanged editorial pages retain metadata and headings', async () => {
  const baseline = JSON.parse(await readFile(resolve(root, 'tests/content-baseline.json'), 'utf8'));
  const pages = await loadPages(root);
  for (const url of Object.keys(baseline))
    assert.ok(
      pages.some((page) => page.permalink === url),
      url,
    );
  const revised = JSON.parse(await readFile(resolve(root, 'docs/editorial-revision.json'), 'utf8'));
  const redesigned = new Set([
    '/index.html',
    '/sobre-mi.html',
    '/articulos.html',
    '/10.000 pasos.html',
    ...revised.map((item) => item.url),
  ]);
  for (const page of pages.filter(
    (page) => baseline[page.permalink] && !redesigned.has(page.permalink),
  )) {
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
  assert.equal(result.pages, (await loadPages(root)).length);
});
test('newsletter uses native submission without third-party scripts or styles', async () => {
  for (const page of await loadPages(root)) {
    const source = await readFile(resolve(root, 'dist', '.' + page.permalink), 'utf8');
    assert.ok(!source.includes('sibforms.com/forms/end-form/build/'));
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

test('article social previews and structured data use existing editorial images', async () => {
  const images = new Set();
  for (const page of (await loadPages(root)).filter((page) => page.type === 'article')) {
    const document = parse(await readFile(resolve(root, 'dist', '.' + page.permalink), 'utf8'));
    const image = nodes(document, 'meta').find((node) => attr(node, 'property') === 'og:image');
    const url = new URL(attr(image, 'content'));
    assert.equal(url.origin, 'https://viveconuve.com');
    assert.ok((await readFile(resolve(root, 'dist', '.' + url.pathname))).length > 0);
    const schema = nodes(document, 'script')
      .filter((node) => attr(node, 'type') === 'application/ld+json')
      .map((node) => JSON.parse(text(node)))
      .find((data) => data['@type'] === 'BlogPosting');
    if (schema) assert.equal(schema.image, url.href);
    images.add(url.href);
  }
  assert.ok(images.size > 5, 'Articles should not all share the generic logo');
});
