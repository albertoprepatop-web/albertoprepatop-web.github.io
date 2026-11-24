// Ronda 6 (refinado 3): D grande (75 % de la ficha) — panza semicircular o «Rubik» (esquinas de radio menor).
import { svg, symbolPaths, horizontal, C } from '../build.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const TOOLS = '/tmp/claude-0/-home-user-albertoprepatop-web-github-io/db30fac1-e41f-5e34-8ec7-ae08fc5fe643/scratchpad/brandtools';
execFileSync('mkdir', ['-p', path.join(here, 'r6')]);
const out = n => path.join(here, 'r6', n);
const u = 100 / 32;
const I = { x: 12 * u, base: 22 * u, H: 12 * u, S: 4 * u, o: 2 * u, t: 2 * u, r: 0.4 * u, rIn: 0.9 * u };
const base = { left: 6 * u, top: 4 * u, W: 22 * u, H: 24 * u, ss: 4 * u, sa: 4 * u, sr: 4 * u, rl: 0.6 * u };
const V = {
  'G-semi': { D: { ...base, Rr: 12 * u }, I },
  'G-rubik10': { D: { ...base, Rr: 10 * u }, I },
  'G-rubik9': { D: { ...base, Rr: 9 * u }, I },
  'G-rubik10-brazo35': { D: { ...base, Rr: 10 * u, sa: 3.5 * u }, I },
};
const items = [], files = [];
for (const [k, v] of Object.entries(V)) {
  fs.writeFileSync(out(`${k}.svg`), svg([0, 0, 100, 100], symbolPaths(v)));
  files.push(out(`${k}.svg`));
  execFileSync('node', [`${TOOLS}/render.mjs`, out(`${k}.svg`), out(`${k}.png`), '--width', '300', '--bg', C.tiza, '--pad', '16']);
  items.push({ label: k, file: out(`${k}.png`) });
}
for (const k of ['G-semi', 'G-rubik10']) {
  fs.writeFileSync(out(`L-${k}.svg`), horizontal({ ...V[k] }));
  execFileSync('node', [`${TOOLS}/render.mjs`, out(`L-${k}.svg`), out(`L-${k}.png`), '--width', '1000', '--bg', C.tiza, '--pad', '24']);
  items.push({ label: 'lockup ' + k, file: out(`L-${k}.png`) });
}
execFileSync('node', [`${TOOLS}/render.mjs`, '--sheet', out('ronda6.png'), '--cols', '2', '--cell', '560', '--bg', '#ffffff', ...items.flatMap(i => ['--label', i.label, i.file])]);
execFileSync('node', [path.join(here, 'pixeles.mjs'), out('pix-r6.png'), '--bg', C.tiza, ...files]);
console.log('ok');
