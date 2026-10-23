import { readFile, writeFile, mkdir, cp, rm, lstat } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { parse, serialize } from 'parse5';
import { loadPages, render, escapeHtml } from './lib/content.mjs';
import { buildImages, optimizeDocumentImages } from './lib/images.mjs';
import { createFeeds } from './lib/feeds.mjs';
import { nodes, attr } from './lib/html.mjs';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(root, 'dist');
if (output !== join(root, 'dist')) throw new Error('Unsafe build output');
try {
  if ((await lstat(output)).isSymbolicLink()) throw new Error('Build output must not be a symlink');
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
await rm(output, { recursive: true, force: true });
await mkdir(join(output, 'assets', 'styles'), { recursive: true });
await mkdir(join(output, 'assets', 'scripts'), { recursive: true });
await cp(join(root, 'public'), output, { recursive: true });
const imageManifest = await buildImages(root, output);
const read = (path) => readFile(join(root, path), 'utf8');
const site = JSON.parse(await read('content/site.json'));
const competitions = JSON.parse(await read('content/competitions.json'));
const competitionValues = {
  firstName: competitions.first.name,
  firstDate: competitions.first.date,
  firstDateLabel: competitions.first.dateLabel,
  firstResult: competitions.first.result,
};
const layout = await read('src/templates/layout.html');
const partials = Object.fromEntries(
  await Promise.all(
    ['header', 'footer', 'cookies', 'newsletter'].map(async (name) => [
      name,
      await read(`src/templates/partials/${name}.html`),
    ]),
  ),
);
const css =
  (await read('src/styles/tokens.css')) +
  '\n' +
  (await read('src/styles/base.css')) +
  '\n' +
  (await read('src/styles/components.css')) +
  '\n' +
  (await read('src/styles/hybrid.css'));
const js = await read('src/scripts/site.js');
const hash = (value) => createHash('sha256').update(value).digest('hex').slice(0, 12);
const cssUrl = `/assets/styles/site.${hash(css)}.css`,
  jsUrl = `/assets/scripts/site.${hash(js)}.js`;
await writeFile(join(output, cssUrl), css);
await writeFile(join(output, jsUrl), js);
const pages = await loadPages(root);
for (const page of pages) {
  if (
    page.canonical &&
    !pages.some((target) => target.permalink === page.canonical && !target.canonical)
  ) {
    throw new Error(`${page.source}: canonical must reference an existing primary page`);
  }
}
const feeds = createFeeds(site, pages);
await writeFile(join(output, 'sitemap.xml'), feeds.sitemap);
await writeFile(join(output, 'rss.xml'), feeds.rss);
for (const page of pages) {
  const content = render(
    page.content.replaceAll('{{> newsletter}}', partials.newsletter),
    competitionValues,
  );
  const contentImages = nodes(parse(content), 'img');
  const firstImage = [
    ...contentImages.filter((node) => attr(node, 'fetchpriority') === 'high'),
    ...contentImages,
  ]
    .map((node) => attr(node, 'src'))
    .find((src) => imageManifest.has(src));
  const socialImage = page.socialImage || firstImage || '/assets/images/viveconuve.png';
  if (!imageManifest.has(socialImage)) throw new Error(`${page.source}: missing social image`);
  const navigation = site.navigation
    .map(
      (item) =>
        `<li><a href="${escapeHtml(item.href)}"${item.href === page.permalink ? ' aria-current="page"' : ''}>${escapeHtml(item.label)}</a></li>`,
    )
    .join('');
  const html = render(layout, {
    ...site,
    ...page,
    content,
    canonical: new URL(
      page.canonical || (page.permalink === '/index.html' ? '/' : page.permalink),
      site.url,
    ).href,
    socialImage: site.url + socialImage,
    cssUrl,
    jsUrl,
    header: render(partials.header, { navigation }),
    footer: render(partials.footer, { year: new Date().getUTCFullYear() }),
    cookies: partials.cookies,
    schemas: page.structuredData
      .map((data) =>
        data['@type'] === 'BlogPosting'
          ? {
              ...data,
              image: site.url + socialImage,
              ...(page.updated ? { dateModified: page.updated } : {}),
            }
          : data,
      )
      .map(
        (data) =>
          `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`,
      )
      .join('\n'),
  });
  if (/\{\{[>#\w]/.test(html)) throw new Error(`${page.source}: unresolved template`);
  const document = parse(html);
  optimizeDocumentImages(document, imageManifest);
  await writeFile(join(output, page.permalink), serialize(document) + '\n');
}
console.log(`Built ${pages.length} pages in dist/`);
