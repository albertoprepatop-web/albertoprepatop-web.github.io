// Ronda 13 (refinado de la composición en diagonal): tamaños y posiciones de chispa y visto.
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { base, isotipo, horizontal } from '../build.mjs';
import { previewSheet, previewLogos } from '../preview.mjs';
const here = path.dirname(fileURLToPath(import.meta.url));
const V = o => ({ ...base, ...o });
const sets = {
  'a · base diagonal': {},
  'b · chispa mayor': { dotC: [25, 25], dotR: 9.6 },
  'c · visto mayor': { vertex: [55, 77], short: { len: 21, ang: 47 }, long: { len: 45, ang: 51 }, radii: [8.8, 8.4, 5.6], dotC: [24, 24], dotR: 9 },
  'd · más aire en los bordes': { dotC: [26, 26], dotR: 9, vertex: [56, 74], short: { len: 19, ang: 47 }, long: { len: 41, ang: 51 } },
  'e · c + pizarra r20': { tileR: 20, vertex: [55, 77], short: { len: 21, ang: 47 }, long: { len: 45, ang: 51 }, radii: [8.8, 8.4, 5.6], dotC: [24.5, 24.5], dotR: 9 },
  'f · c con trazo corto más largo': { vertex: [56, 77], short: { len: 24, ang: 45 }, long: { len: 44, ang: 52 }, radii: [8.8, 8.4, 5.6], dotC: [24, 24], dotR: 9 },
};
const items = Object.entries(sets).map(([label, o]) => ({ label, pos: isotipo('pos', V(o)), neg: isotipo('neg', V(o)) }));
await previewSheet(path.join(here, 'r13', 'simbolos.png'), items, { title: 'Ronda 13 · diagonal', big: 170 });
const logos = ['a · base diagonal', 'c · visto mayor', 'f · c con trazo corto más largo'].map(k => ({ label: k, pos: horizontal('pos', V(sets[k])), neg: horizontal('neg', V(sets[k])), h: 90 }));
await previewLogos(path.join(here, 'r13', 'logos.png'), logos, { title: 'Ronda 13 · logotipo' });
console.log('ok');
