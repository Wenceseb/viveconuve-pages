import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateSite } from './lib/validate.mjs';
const result = await validateSite(resolve(dirname(fileURLToPath(import.meta.url)), '../dist'));
if (result.errors.length) {
  console.error(result.errors.join('\n'));
  process.exitCode = 1;
} else
  console.log(
    `Validated ${result.pages} pages and ${result.files} files: links, anchors, metadata, scripts, images and budgets pass.`,
  );
