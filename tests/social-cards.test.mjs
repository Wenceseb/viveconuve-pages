import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import sharp from 'sharp';
import { parse } from 'parse5';
import { loadPages } from '../scripts/lib/content.mjs';
import { nodes, attr } from '../scripts/lib/html.mjs';
import { buildSocialCard } from '../scripts/lib/social-cards.mjs';

const root = resolve(import.meta.dirname, '..');
test('wide editorial lines fit the card without cropping or aborting the build', async () => {
  const image = '/assets/images/wenceslao-uve.jpg';
  const output = resolve(root, '.cache/social-card-tests');
  const result = await buildSocialCard(
    root,
    output,
    {
      permalink: '/wide-line.html',
      source: 'test',
      socialCard: {
        image,
        kicker: 'PRUEBA',
        lines: ['W'.repeat(24)],
        alt: 'Prueba de ajuste de texto',
      },
    },
    new Map([[image, {}]]),
  );
  const info = await sharp(resolve(output, '.' + result.url)).metadata();
  assert.deepEqual([info.width, info.height], [1200, 630]);
});
test('social previews point to real images with accurate dimensions, alt text and clean canonical URLs', async () => {
  let cards = 0;
  for (const page of await loadPages(root)) {
    const doc = parse(await readFile(resolve(root, 'dist', '.' + page.permalink), 'utf8'));
    const meta = (key) =>
      attr(
        nodes(doc, 'meta').find(
          (node) => attr(node, 'property') === key || attr(node, 'name') === key,
        ),
        'content',
      );
    const url = new URL(meta('og:image'));
    const image = resolve(root, 'dist', '.' + url.pathname);
    const data = await sharp(image).metadata();
    assert.equal(Number(meta('og:image:width')), data.width, page.source);
    assert.equal(Number(meta('og:image:height')), data.height, page.source);
    assert.ok(meta('og:image:alt'), page.source);
    assert.equal(meta('twitter:image'), url.href);
    assert.equal(meta('twitter:image:alt'), meta('og:image:alt'));
    assert.equal(new URL(meta('og:url')).search, '');
    if (page.socialCard) {
      cards++;
      assert.deepEqual([data.width, data.height, data.format], [1200, 630, 'jpeg']);
      assert.ok((await stat(image)).size < 200_000, page.source);
      assert.match(url.pathname, /\.[a-f0-9]{12}\.jpg$/);
    }
  }
  assert.equal(cards, 4);
});
