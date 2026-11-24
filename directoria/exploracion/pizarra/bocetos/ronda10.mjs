// Ronda 10 (refinado 3): equilibrio óptico entre la pizarra y la palabra.
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { base, horizontal } from '../build.mjs';
import { previewLogos } from '../preview.mjs';
const here = path.dirname(fileURLToPath(import.meta.url));
const V = o => ({ ...base, ...o });
const sets = [
  ['a · pizarra 1,42 × mayúscula, hueco 0,34', V({})],
  ['b · pizarra 1,32 ×, hueco 0,32', V({ tileScale: 1.32, gap: 0.32 })],
  ['c · pizarra 1,25 ×, hueco 0,30', V({ tileScale: 1.25, gap: 0.30 })],
  ['d · 1,32 ×, baldosa bajada 6 % (alineada a la base óptica)', V({ tileScale: 1.32, gap: 0.32, tileDrop: 0.06 })],
];
await previewLogos(path.join(here, 'r10', 'ronda10.png'), sets.map(([label, o]) => ({ label, pos: horizontal('pos', o), neg: horizontal('neg', o), h: 100 })), { title: 'Ronda 10 · símbolo y palabra' });
console.log('ok');
