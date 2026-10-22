import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
export function parseContent(source, filename = 'content') {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/.exec(source);
  if (!match) throw new Error(`${filename}: missing JSON front matter`);
  const meta = JSON.parse(match[1]);
  if (
    !meta.title ||
    !meta.description ||
    !/^\/[^/]+\.html$/.test(meta.permalink) ||
    meta.permalink.includes('..')
  )
    throw new Error(`${filename}: invalid page metadata`);
  return { ...meta, content: match[2], source: filename };
}
export async function loadPages(root) {
  const pages = [];
  for (const folder of ['pages', 'articles']) {
    for (const name of (await readdir(join(root, 'content', folder))).sort()) {
      if (name.endsWith('.html'))
        pages.push(
          parseContent(
            await readFile(join(root, 'content', folder, name), 'utf8'),
            `${folder}/${name}`,
          ),
        );
    }
  }
  const seen = new Set();
  for (const page of pages) {
    if (seen.has(page.permalink)) throw new Error(`Duplicate permalink: ${page.permalink}`);
    seen.add(page.permalink);
  }
  return pages.sort((a, b) => a.permalink.localeCompare(b.permalink, 'en'));
}
export const escapeHtml = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  );
export function render(template, data) {
  return template.replace(/\{\{\{(\w+)\}\}\}|\{\{(\w+)\}\}/g, (_, raw, escaped) => {
    const key = raw || escaped;
    if (!(key in data)) throw new Error(`Missing template value: ${key}`);
    return raw ? String(data[key]) : escapeHtml(data[key]);
  });
}
