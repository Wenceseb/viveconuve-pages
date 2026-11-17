import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { escapeHtml } from './content.mjs';

// Editorial previews use existing photographs; no remote assets or tracking.
export async function buildSocialCard(root, output, page, manifest) {
  const card = page.socialCard;
  if (!card) return null;
  if (
    !manifest.has(card.image) ||
    !Array.isArray(card.lines) ||
    card.lines.length < 1 ||
    card.lines.length > 3 ||
    card.lines.some((line) => typeof line !== 'string' || line.length > 24) ||
    !card.alt ||
    !card.kicker
  )
    throw new Error(`${page.source}: invalid social card`);
  const layers = [];
  const addText = async (text, size, top, color = '#193b32') => {
    const input = await sharp({
      text: {
        text: `<span foreground="${color}">${escapeHtml(text)}</span>`,
        font: `Barlow Condensed Bold ${size}`,
        fontfile: join(root, 'public/assets/fonts/font-0.ttf'),
        rgba: true,
      },
    })
      .png()
      .toBuffer();
    const { width, height } = await sharp(input).metadata();
    if (width > 640 || top + height > 600)
      throw new Error(`${page.source}: social card text overflows`);
    layers.push({ input, left: 56, top });
  };
  const photo = await sharp(join(root, card.image))
    .rotate()
    .resize(440, 630, { fit: 'cover', position: 'attention' })
    .toBuffer();
  layers.push({ input: photo, left: 760, top: 0 });
  await addText('ViveConUve', 34, 48);
  await addText(card.kicker, 26, 140);
  for (const [index, line] of card.lines.entries()) await addText(line, 76, 210 + index * 88);
  await addText('Entreno. Aprendo. Lo cuento.', 28, 535);
  const buffer = await sharp({
    create: { width: 1200, height: 630, channels: 3, background: '#f6f7f2' },
  })
    .composite(layers)
    .jpeg({ quality: 85, mozjpeg: true })
    .toBuffer();
  const digest = createHash('sha256').update(buffer).digest('hex').slice(0, 12);
  const url = `/assets/social/${page.permalink.slice(1, -5)}.${digest}.jpg`;
  await mkdir(join(output, 'assets/social'), { recursive: true });
  await writeFile(join(output, url), buffer);
  return { url, width: 1200, height: 630, alt: card.alt };
}
