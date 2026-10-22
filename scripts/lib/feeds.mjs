import { escapeHtml } from './content.mjs';
const urlFor = (site, page) => site.url + (page.permalink === '/index.html' ? '/' : page.permalink);
const dateFor = (page) =>
  page.published ||
  page.structuredData.find((item) => item['@type'] === 'BlogPosting')?.datePublished;
export function createFeeds(site, pages) {
  const indexed = pages.filter((page) => !page.robots.includes('noindex'));
  const sitemap =
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    indexed
      .map((page) => {
        const modified = page.updated || dateFor(page);
        if (modified && !/^\d{4}-\d{2}-\d{2}$/.test(modified))
          throw new Error(`Invalid date: ${page.source}`);
        return `<url><loc>${escapeHtml(urlFor(site, page))}</loc>${modified ? `<lastmod>${modified}</lastmod>` : ''}</url>`;
      })
      .join('\n') +
    '\n</urlset>\n';
  const articles = indexed
    .filter((page) => page.type === 'article' && dateFor(page))
    .sort((a, b) => dateFor(b).localeCompare(dateFor(a)) || a.permalink.localeCompare(b.permalink));
  const rss =
    '<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel>' +
    `<title>${escapeHtml(site.name)}</title><link>${escapeHtml(site.url)}/</link><description>Artículos de ViveConUve: cuerpo, mente y movimiento.</description><language>es-es</language><atom:link href="${escapeHtml(site.url)}/rss.xml" rel="self" type="application/rss+xml"/>` +
    articles
      .map(
        (page) =>
          `<item><title>${escapeHtml(page.title)}</title><link>${escapeHtml(urlFor(site, page))}</link><guid isPermaLink="true">${escapeHtml(urlFor(site, page))}</guid><description>${escapeHtml(page.description)}</description><pubDate>${new Date(dateFor(page) + 'T00:00:00Z').toUTCString()}</pubDate></item>`,
      )
      .join('') +
    '</channel></rss>\n';
  return { sitemap, rss };
}
