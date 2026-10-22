import test from 'node:test';
import assert from 'node:assert/strict';
import { createFeeds } from '../scripts/lib/feeds.mjs';
test('feeds use publication dates, exclude noindex and escape XML metadata', () => {
  const article = {
    permalink: '/article.html',
    title: 'A & B',
    description: '<text>',
    robots: 'index, follow',
    type: 'article',
    structuredData: [{ '@type': 'BlogPosting', datePublished: '2025-05-09' }],
  };
  const home = {
    permalink: '/index.html',
    title: 'Home',
    description: 'Home',
    robots: 'index, follow',
    type: 'website',
    structuredData: [],
  };
  const { sitemap, rss } = createFeeds({ name: 'Site', url: 'https://example.com' }, [
    article,
    home,
    { ...home, permalink: '/404.html', robots: 'noindex' },
  ]);
  assert.ok(sitemap.includes('<loc>https://example.com/</loc></url>'));
  assert.ok(sitemap.includes('<lastmod>2025-05-09</lastmod>'));
  assert.ok(!sitemap.includes('404.html'));
  assert.ok(rss.includes('A &amp; B'));
  assert.ok(rss.includes('&lt;text&gt;'));
  assert.ok(rss.includes('Fri, 09 May 2025 00:00:00 GMT'));
  assert.ok(!rss.includes('<lastBuildDate>'));
  const spaced = createFeeds({ name: 'Site', url: 'https://example.com' }, [
    { ...article, permalink: '/10.000 pasos.html' },
  ]);
  assert.ok(spaced.sitemap.includes('/10.000%20pasos.html'));
  assert.ok(spaced.rss.includes('/10.000%20pasos.html'));
  assert.throws(() =>
    createFeeds({ name: 'Site', url: 'https://example.com' }, [
      { ...article, updated: 'invented' },
    ]),
  );
});
