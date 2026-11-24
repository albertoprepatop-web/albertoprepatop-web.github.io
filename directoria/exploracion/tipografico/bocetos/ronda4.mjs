// Ronda 4 (refinado 2): ¿cómo va el símbolo sobre pizarra? sin ficha, ficha pizarra-2 o ficha tiza.
import { horizontal, svg, symbolPaths, isoSinFicha, C } from '../build.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const TOOLS = '/tmp/claude-0/-home-user-albertoprepatop-web-github-io/db30fac1-e41f-5e34-8ec7-ae08fc5fe643/scratchpad/brandtools';
const out = n => path.join(here, 'r4', n);
const V = {
  'N1-sin-ficha': horizontal({ dir: C.tiza, ia: C.chispa, withTile: false }),
  'N2-ficha-pizarra2': horizontal({ dir: C.tiza, ia: C.chispa, tile: C.pizarra2 }),
  'N3-ficha-tiza': horizontal({ dir: C.tiza, ia: C.chispa, tile: C.tiza, dCol: C.pizarra, iCol: C.chispaTexto }),
};
const items = [];
for (const [k, s] of Object.entries(V)) {
  fs.writeFileSync(out(k + '.svg'), s);
  execFileSync('node', [`${TOOLS}/render.mjs`, out(k + '.svg'), out(k + '.png'), '--width', '900', '--bg', C.pizarra, '--pad', '40']);
  execFileSync('node', [`${TOOLS}/render.mjs`, out(k + '.svg'), out(k + '-peq.png'), '--width', '200', '--bg', C.pizarra, '--pad', '20']);
  items.push({ label: k, file: out(k + '.png') }, { label: k + ' (200 px)', file: out(k + '-peq.png') });
}
fs.writeFileSync(out('iso-neg-ficha2.svg'), svg([0, 0, 100, 100], symbolPaths({ tile: C.pizarra2 })));
fs.writeFileSync(out('iso-neg-sinficha.svg'), isoSinFicha());
execFileSync('node', [`${TOOLS}/render.mjs`, '--sheet', out('ronda4.png'), '--cols', '2', '--cell', '640', '--bg', '#ffffff', ...items.flatMap(i => ['--label', i.label, i.file])]);
execFileSync('node', [path.join(here, 'pixeles.mjs'), out('pix-neg.png'), '--bg', C.pizarra, out('iso-neg-sinficha.svg'), out('iso-neg-ficha2.svg')]);
console.log('ok');
