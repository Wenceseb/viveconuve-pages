import { readFile, writeFile, mkdir, cp, rm, lstat } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { parse, serialize } from 'parse5';
import { loadPages, render, escapeHtml } from './lib/content.mjs';
import { buildImages, optimizeDocumentImages } from './lib/images.mjs';
import { renderAgenda } from './lib/agenda.mjs';
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
const agenda = JSON.parse(await read('content/agenda.json'));
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
const cssSource =
  (await read('src/styles/tokens.css')) +
  '\n' +
  (await read('src/styles/base.css')) +
  '\n' +
  (await read('src/styles/components.css')) +
  '\n' +
  (await read('src/styles/hybrid.css')) +
  '\n' +
  (await read('src/styles/design-v2.css'));
const css = cssSource
  .split('\n')
  .map((line) => line.trim())
  .filter(Boolean)
  .join('\n');
const js = await read('src/scripts/site.js');
const hash = (value) => createHash('sha256').update(value).digest('hex').slice(0, 12);
const cssUrl = `/assets/styles/site.${hash(css)}.css`,
  jsUrl = `/assets/scripts/site.${hash(js)}.js`;
await writeFile(join(output, cssUrl), css);
await writeFile(join(output, jsUrl), js);
const pages = await loadPages(root);
const editorial = JSON.parse(await read('content/editorial.json'));
const cardLinks = (slugs) =>
  '<div class="h-links">' +
  slugs
    .map((slug) => {
      const page = pages.find((item) => item.permalink === `/${slug}.html`);
      if (!page || page.editorialStatus !== 'active')
        throw new Error(`Invalid editorial selection: ${slug}`);
      return `<a href="${escapeHtml(page.permalink)}"><strong>${escapeHtml(page.title.replace(' – ViveConUve', ''))}</strong><span>${escapeHtml(page.description)}</span></a>`;
    })
    .join('') +
  '</div>';
const editorialValues = Object.fromEntries(
  Object.entries(editorial).map(([key, slugs]) => [`${key}Links`, cardLinks(slugs)]),
);
editorialValues.recuperarLinks = cardLinks(
  editorial.habitos.filter((slug) => slug !== 'cambio-fisico-a-los-50'),
);
const toolsJs = await read('src/scripts/tools.js');
const toolsUrl = `/assets/scripts/tools.${hash(toolsJs)}.js`;
await writeFile(join(output, toolsUrl), toolsJs);
// Version the complete module family together, including transitive imports.
// A change in model/local must invalidate the entry points too.
const featureNames = [
  'model.js',
  'local.js',
  'planner.js',
  'progress.js',
  'agenda.js',
  'workshop.css',
];
const featureSources = await Promise.all(
  featureNames.map((name) => read(`public/assets/tools/${name}`)),
);
const featureVersion = hash(JSON.stringify(featureSources));
const featureUrls = Object.fromEntries(
  featureNames.map((name) => [
    name,
    `/assets/tools/${name.replace(/\.(js|css)$/, `.${featureVersion}.$1`)}`,
  ]),
);
for (const [index, name] of featureNames.entries()) {
  let source = featureSources[index];
  for (const dependency of featureNames.filter((name) => name.endsWith('.js'))) {
    source = source.replaceAll(`'./${dependency}'`, `'${featureUrls[dependency]}'`);
  }
  await writeFile(join(output, featureUrls[name]), source);
  await rm(join(output, 'assets/tools', name));
}
const libraryCss = await read('public/assets/library/library.css');
const libraryCssUrl = `/assets/library/library.${hash(libraryCss)}.css`;
await writeFile(join(output, libraryCssUrl), libraryCss);
await rm(join(output, 'assets/library/library.css'));
const sectionsCss = await read('public/assets/editorial/sections.css');
const sectionsCssUrl = `/assets/editorial/sections.${hash(sectionsCss)}.css`;
await writeFile(join(output, sectionsCssUrl), sectionsCss);
await rm(join(output, 'assets/editorial/sections.css'));
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
  const content = render(page.content.replaceAll('{{> newsletter}}', partials.newsletter), {
    agendaEvents: renderAgenda(agenda),
    ...competitionValues,
    ...editorialValues,
  });
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
    toolsScript: page.layout.includes('station-library')
      ? `<link rel="stylesheet" href="${libraryCssUrl}">`
      : page.permalink === '/competiciones.html'
        ? `<link rel="stylesheet" href="${sectionsCssUrl}"><script defer src="${featureUrls['agenda.js']}"></script>`
        : page.permalink === '/laboratorio.html'
          ? `<link rel="stylesheet" href="${sectionsCssUrl}">`
          : page.permalink === '/recursos.html'
            ? `<script defer src="${toolsUrl}"></script>`
            : ['/planificador-hyrox.html', '/mi-progreso.html'].includes(page.permalink)
              ? `<link rel="stylesheet" href="${featureUrls['workshop.css']}"><script type="module" src="${featureUrls[page.permalink === '/planificador-hyrox.html' ? 'planner.js' : 'progress.js']}"></script>`
              : '',
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
