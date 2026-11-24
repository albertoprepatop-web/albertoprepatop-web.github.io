// Ronda 5: ¿D más grande y ajustada a la rejilla de 16 px? comparación con la versión actual.
import { svg, symbolPaths, SYM, C } from '../build.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const TOOLS = '/tmp/claude-0/-home-user-albertoprepatop-web-github-io/db30fac1-e41f-5e34-8ec7-ae08fc5fe643/scratchpad/brandtools';
const out = n => path.join(here, 'r5', n);
const u = 100 / 32;
const grande = {
  D: { left: 6 * u, top: 4 * u, W: 22 * u, H: 24 * u, ss: 4 * u, sa: 4 * u, sr: 4 * u, rl: 0.6 * u },
  I: { x: 12 * u, base: 22 * u, H: 12 * u, S: 4 * u, o: 2 * u, t: 2 * u, r: 0.4 * u, rIn: 0.9 * u },
};
const media = {
  D: { left: 6 * u, top: 4 * u, W: 22 * u, H: 24 * u, ss: 4 * u, sa: 3.5 * u, sr: 4 * u, rl: 0.6 * u },
  I: { x: 12.5 * u, base: 21.5 * u, H: 11 * u, S: 3 * u, o: 2.25 * u, t: 2.25 * u, r: 0.4 * u, rIn: 1 * u },
};
const V = { actual: {}, grande, media };
const files = [];
for (const [k, v] of Object.entries(V)) {
  const f = out(`sym-${k}.svg`);
  fs.writeFileSync(f, svg([0, 0, 100, 100], symbolPaths(v)));
  files.push(f);
  execFileSync('node', [`${TOOLS}/render.mjs`, f, out(`sym-${k}.png`), '--width', '256', '--bg', C.tiza, '--pad', '16']);
}
execFileSync('node', [`${TOOLS}/render.mjs`, '--sheet', out('ronda5.png'), '--cols', '3', '--cell', '300', '--bg', '#ffffff',
  ...Object.keys(V).flatMap(k => ['--label', k, out(`sym-${k}.png`)])]);
execFileSync('node', [path.join(here, 'pixeles.mjs'), out('pix-r5.png'), '--bg', C.tiza, ...files]);
console.log('ok');
