import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const requiredVersion = readFileSync(
  new URL('../.node-version', import.meta.url),
  'utf8',
).trim();

export function isSupportedNode(version, required = requiredVersion) {
  if (!/^\d+\.\d+\.\d+$/.test(version)) return false;
  const actual = version.split('.').map(Number);
  const minimum = required.split('.').map(Number);
  return (
    actual[0] === minimum[0] &&
    (actual[1] > minimum[1] || (actual[1] === minimum[1] && actual[2] >= minimum[2]))
  );
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (!isSupportedNode(process.versions.node)) {
    console.error(
      `Unsupported Node ${process.versions.node}. Install Node ${requiredVersion} or a newer patch in the same major line from https://nodejs.org/.`,
    );
    process.exitCode = 1;
  } else console.log(`Node ${process.versions.node}: meets security baseline ${requiredVersion}.`);
}
