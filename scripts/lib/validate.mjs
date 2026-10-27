import { readFile, readdir, stat } from 'node:fs/promises';
import { join, relative, resolve, sep } from 'node:path';
import { parse } from 'parse5';
import { walk, nodes, attr, text } from './html.mjs';
export async function filesIn(dir) {
  const result = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) result.push(...(await filesIn(path)));
    else result.push(path);
  }
  return result;
}
export async function validateSite(output) {
  const files = await filesIn(output),
    errors = [],
    documents = new Map();
  const paths = new Set(files.map((path) => '/' + relative(output, path).split(sep).join('/')));
  for (const path of files.filter((path) => path.endsWith('.html'))) {
    const url = '/' + relative(output, path).split(sep).join('/'),
      source = await readFile(path, 'utf8'),
      document = parse(source),
      ids = new Set();
    walk(document, (node) => {
      const id = attr(node, 'id');
      if (id) {
        if (ids.has(id)) errors.push(`${url}: duplicate id ${id}`);
        ids.add(id);
      }
    });
    documents.set(url, { document, ids });
    if (nodes(document, 'h1').length !== 1) errors.push(`${url}: expected exactly one h1`);
    if (nodes(document, 'main').length !== 1) errors.push(`${url}: expected one main landmark`);
    if (!nodes(document, 'title').some((node) => text(node).trim()))
      errors.push(`${url}: missing title`);
    if (
      !nodes(document, 'meta').some(
        (node) => attr(node, 'name') === 'description' && attr(node, 'content'),
      )
    )
      errors.push(`${url}: missing description`);
    if (
      !nodes(document, 'link').some(
        (node) =>
          attr(node, 'rel') === 'canonical' &&
          attr(node, 'href')?.startsWith('https://viveconuve.com/'),
      )
    )
      errors.push(`${url}: invalid canonical`);
    for (const script of nodes(document, 'script')) {
      if (attr(script, 'type') === 'application/ld+json') {
        try {
          JSON.parse(text(script));
        } catch {
          errors.push(`${url}: invalid JSON-LD`);
        }
      } else if (!attr(script, 'src')) errors.push(`${url}: unexpected inline executable script`);
      const src = attr(script, 'src') || '';
      if (src.includes('googletagmanager') || src.includes('googlesyndication'))
        errors.push(`${url}: optional tracker loaded without consent`);
    }
    for (const img of nodes(document, 'img'))
      if (attr(img, 'alt') === undefined || !attr(img, 'width') || !attr(img, 'height'))
        errors.push(`${url}: image missing alt or intrinsic size`);
    for (const tag of ['img', 'script', 'link'])
      for (const node of nodes(document, tag)) {
        const value = attr(node, tag === 'link' ? 'href' : 'src');
        if (value?.startsWith('http://')) errors.push(`${url}: mixed content ${value}`);
      }
    if (source.includes('{{>')) errors.push(`${url}: unresolved partial`);
    if ((await stat(path)).size > 65000) errors.push(`${url}: HTML exceeds 65 kB budget`);
  }
  for (const [page, { document }] of documents)
    walk(document, (node) => {
      for (const property of ['src', 'href']) {
        const value = attr(node, property);
        if (!value || /^(https?:|mailto:|tel:|data:|javascript:|\/\/)/.test(value)) continue;
        const url = new URL(value, 'https://viveconuve.com' + page),
          target =
            decodeURIComponent(url.pathname) === '/'
              ? '/index.html'
              : decodeURIComponent(url.pathname);
        if (!paths.has(target)) errors.push(`${page}: broken ${property} ${value}`);
        else if (
          property === 'href' &&
          url.hash &&
          documents.has(target) &&
          !documents.get(target).ids.has(decodeURIComponent(url.hash.slice(1)))
        )
          errors.push(`${page}: missing anchor ${value}`);
      }
      const srcset = attr(node, 'srcset');
      if (srcset)
        for (const item of srcset.split(',')) {
          const path = item.trim().split(/\s+/)[0];
          if (!paths.has(path)) errors.push(`${page}: missing responsive image ${path}`);
        }
    });
  for (const path of files) {
    const rel = relative(output, path).split(sep).join('/');
    if (
      /^(node_modules|content|src|scripts|tests|docs|\.git)(\/|$)|package(?:-lock)?\.json|\.md$/.test(
        rel,
      )
    )
      errors.push(`Source leaked into deployment: ${rel}`);
    if (rel.endsWith('.js') && (await stat(path)).size > 12000)
      errors.push(`${rel}: JavaScript exceeds 12 kB budget`);
  }
  const cssFiles = files.filter((path) => path.endsWith('.css'));
  const sharedCss = cssFiles.filter((path) => /site\.[a-f0-9]+\.css$/.test(path));
  if (sharedCss.length !== 1) errors.push('Expected one shared CSS bundle');
  for (const [page, { document }] of documents) {
    const styles = nodes(document, 'link').filter((node) => attr(node, 'rel') === 'stylesheet');
    const isTool = ['/planificador-hyrox.html', '/mi-progreso.html'].includes(page);
    const isLibrary = nodes(document, 'body').some((node) =>
      attr(node, 'class')?.includes('station-library'),
    );
    const isSection = [
      '/competiciones.html',
      '/laboratorio.html',
      '/hyrox-despues-de-los-50.html',
    ].includes(page);
    if (styles.length !== (isTool || isLibrary || isSection ? 2 : 1))
      errors.push(`${page}: unexpected stylesheet count`);
    if (!isTool && styles.some((node) => attr(node, 'href')?.includes('/assets/tools/')))
      errors.push(`${page}: tool CSS loaded outside tools`);
  }
  for (const path of cssFiles)
    if ((await stat(path)).size > 50000) errors.push('CSS exceeds 50 kB budget');
  return { errors, pages: documents.size, files: files.length };
}
