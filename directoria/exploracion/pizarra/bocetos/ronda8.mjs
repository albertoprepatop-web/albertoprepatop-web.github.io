// Ronda 8 (refinado 1): forma de la pizarra y proporciones del visto.
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { base, isotipo } from '../build.mjs';
import { previewSheet } from '../preview.mjs';
const here = path.dirname(fileURLToPath(import.meta.url));

const V = o => ({ ...base, negTile: null, ...o });
const tiles = {
  'squircle 29': { tileShape: 'squircle', tileR: 29 },
  'rrect 18': { tileShape: 'rrect', tileR: 18 },
  'rrect 22': { tileShape: 'rrect', tileR: 22 },
};
const ticks = {
  't1 actual': {},
  't2 trazo largo': { vertex: [46, 67], short: { len: 17, ang: 46 }, long: { len: 50, ang: 50 }, radii: [7.8, 8.8, 6.8] },
  't3 más erguido': { vertex: [45, 68], short: { len: 16, ang: 50 }, long: { len: 48, ang: 57 }, radii: [7.8, 8.8, 7.0] },
};
const items = [];
for (const [tn, to] of Object.entries(tiles)) for (const [kn, ko] of Object.entries(ticks)) {
  const o = V({ ...to, ...ko });
  items.push({ label: `${tn} · ${kn}`, pos: isotipo('pos', o), neg: isotipo('neg', o) });
}
await previewSheet(path.join(here, 'r8', 'ronda8.png'), items, { title: 'Ronda 8 · pizarra y visto', big: 170 });
console.log('ok');
