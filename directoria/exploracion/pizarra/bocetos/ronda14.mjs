// Ronda 14 (refinado 4): peso del visto frente a la palabra y nitidez del favicon.
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { base, isotipo, horizontal } from '../build.mjs';
import { previewSheet, previewLogos } from '../preview.mjs';
const here = path.dirname(fileURLToPath(import.meta.url));
const V = o => ({ ...base, ...o });
const sets = {
  'a · actual': {},
  'b · visto +8 % de grosor': { radii: [9.3, 8.9, 5.9] },
  'c · visto +8 % y algo mayor': { vertex: [52.5, 77.5], short: { len: 25.5, ang: 46 }, long: { len: 48.5, ang: 51 }, radii: [9.3, 8.9, 5.9] },
  'd · c con chispa 9,4': { vertex: [52.5, 77.5], short: { len: 25.5, ang: 46 }, long: { len: 48.5, ang: 51 }, radii: [9.3, 8.9, 5.9], dotR: 9.4, dotC: [24.4, 24.4] },
};
const items = Object.entries(sets).map(([label, o]) => ({ label, pos: isotipo('pos', V(o), 100 / 14), neg: isotipo('neg', V(o), 100 / 14) }));
await previewSheet(path.join(here, 'r14', 'simbolos.png'), items, { title: 'Ronda 14 · peso y favicon (margen = 1 px a 16 px)', big: 170 });
await previewLogos(path.join(here, 'r14', 'logos.png'), Object.entries(sets).map(([label, o]) => ({ label, pos: horizontal('pos', V(o)), neg: horizontal('neg', V(o)), h: 90 })), { title: 'Ronda 14 · logotipo' });
console.log('ok');
