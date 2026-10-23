import sharp from 'sharp';
import { readFile, writeFile, mkdir, readdir, copyFile, stat } from 'node:fs/promises';
import { join, parse } from 'node:path';
import { createHash } from 'node:crypto';
import { walk, attr, setAttr } from './html.mjs';
export async function buildImages(root, output) {
  const source = join(root, 'assets/images'),
    target = join(output, 'assets/images'),
    cache = join(root, '.cache/images');
  await mkdir(target, { recursive: true });
  await mkdir(cache, { recursive: true });
  const manifest = new Map();
  let originalBytes = 0,
    fallbackBytes = 0;
  for (const name of (await readdir(source)).sort()) {
    const buffer = await readFile(join(source, name));
    const image = sharp(buffer).rotate();
    const metadata = await image.metadata();
    const width = metadata.autoOrient?.width || metadata.width,
      height = metadata.autoOrient?.height || metadata.height;
    const stem = parse(name).name;
    const digest = createHash('sha256')
      .update(buffer)
      .update(`v3:${sharp.versions.sharp}:${sharp.versions.vips}`)
      .digest('hex');
    const variants = [];
    const widths = [...new Set([96, 400, 640, 800, 1200].map((w) => Math.min(w, width)))];
    for (const w of widths) {
      const filename = `${stem}-${w}.webp`,
        cached = join(cache, `${digest}-${w}.webp`);
      try {
        await stat(cached);
      } catch {
        await image
          .clone()
          .resize({ width: w, withoutEnlargement: true })
          .webp({ quality: 65, effort: 5 })
          .toFile(cached);
      }
      await copyFile(cached, join(target, filename));
      variants.push({ width: w, url: `/assets/images/${filename}` });
    }
    const fallbackWidth = Math.min(width, 1600),
      cachedFallback = join(cache, `${digest}-fallback${parse(name).ext}`);
    try {
      await stat(cachedFallback);
    } catch {
      let fallback = image.clone().resize({ width: fallbackWidth, withoutEnlargement: true });
      fallback = name.endsWith('.png')
        ? fallback.png({ compressionLevel: 9, palette: true })
        : fallback.jpeg({ quality: 82, mozjpeg: true });
      await fallback.toFile(cachedFallback);
    }
    await copyFile(cachedFallback, join(target, name));
    originalBytes += buffer.length;
    fallbackBytes += (await stat(cachedFallback)).size;
    manifest.set(`/assets/images/${name}`, { width, height, variants });
  }
  console.log(
    `Image fallback bytes: ${originalBytes} -> ${fallbackBytes} (${Math.round((1 - fallbackBytes / originalBytes) * 100)}% smaller); responsive WebP variants generated.`,
  );
  return manifest;
}
export function optimizeDocumentImages(document, manifest) {
  walk(document, (node) => {
    if (node.tagName !== 'img') return;
    const image = manifest.get(attr(node, 'src'));
    if (!image) return;
    // Honor intentional CSS sizing while reserving the original image ratio when dimensions were absent.
    if (!attr(node, 'width') || !attr(node, 'height')) {
      setAttr(node, 'width', String(image.width));
      setAttr(node, 'height', String(image.height));
    }
    setAttr(node, 'decoding', 'async');
    const chosen = image.variants.find((v) => v.width >= 800) || image.variants.at(-1);
    setAttr(node, 'src', chosen.url);
    setAttr(node, 'srcset', image.variants.map((v) => `${v.url} ${v.width}w`).join(', '));
    const classes = attr(node, 'class') || '';
    const compact = (attr(node.parentNode, 'class') || '').includes('hero-signature');
    const hero = (attr(node.parentNode, 'class') || '').includes('hero-imagen');
    const sizes = classes.includes('brand-logo')
      ? '(max-width:768px) 72px, 88px'
      : compact
        ? '48px'
        : hero
          ? '(max-width:768px) calc(100vw - 44px), 480px'
          : classes.includes('card-cover')
            ? '(max-width:768px) calc(100vw - 44px), 360px'
            : '(max-width:768px) calc(100vw - 44px), 780px';
    setAttr(node, 'sizes', sizes);
    if (!attr(node, 'fetchpriority')) setAttr(node, 'loading', 'lazy');
    if (attr(node, 'fetchpriority') === 'high')
      node.attrs = node.attrs.filter((a) => a.name !== 'loading');
  });
}
