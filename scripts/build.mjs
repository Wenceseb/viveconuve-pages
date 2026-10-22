import { readFile, writeFile, mkdir, cp, rm, lstat } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { parse, serialize } from 'parse5';
import { loadPages, render, escapeHtml } from './lib/content.mjs';
import { buildImages, optimizeDocumentImages } from './lib/images.mjs';
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
  (await read('src/styles/components.css'));
const js = await read('src/scripts/site.js');
const hash = (value) => createHash('sha256').update(value).digest('hex').slice(0, 12);
const cssUrl = `/assets/styles/site.${hash(css)}.css`,
  jsUrl = `/assets/scripts/site.${hash(js)}.js`;
await writeFile(join(output, cssUrl), css);
await writeFile(join(output, jsUrl), js);
const newsletterJs = await read('src/scripts/newsletter.js');
const newsletterUrl = `/assets/scripts/newsletter.${hash(newsletterJs)}.js`;
await writeFile(join(output, newsletterUrl), newsletterJs);
for (const page of await loadPages(root)) {
  const content = page.content.replaceAll('{{> newsletter}}', partials.newsletter);
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
    canonical: site.url + (page.permalink === '/index.html' ? '/' : page.permalink),
    cssUrl,
    jsUrl,
    header: render(partials.header, { navigation }),
    footer: render(partials.footer, { year: new Date().getUTCFullYear() }),
    cookies: partials.cookies,
    schemas: page.structuredData
      .map(
        (data) =>
          `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`,
      )
      .join('\n'),
    newsletterHead: page.newsletter
      ? '<link rel="stylesheet" href="https://sibforms.com/forms/end-form/build/sib-styles.css"><link rel="preconnect" href="https://sibforms.com">'
      : '',
    newsletterScript: page.newsletter
      ? `<script defer src="${newsletterUrl}"></script><script defer src="https://sibforms.com/forms/end-form/build/main.js"></script>`
      : '',
  });
  if (/\{\{[>#\w]/.test(html)) throw new Error(`${page.source}: unresolved template`);
  const document = parse(html);
  optimizeDocumentImages(document, imageManifest);
  await writeFile(join(output, page.permalink), serialize(document) + '\n');
}
console.log(`Built ${(await loadPages(root)).length} pages in dist/`);
