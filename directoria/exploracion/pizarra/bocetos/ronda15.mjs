// Ronda 15: a una tinta, la diagonal (chispa arriba-izq. + visto abajo-der.) recuerda al icono de «imagen»
// (sol + montaña). Volvemos a la chispa como punto de partida del visto y la afinamos.
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { base, isotipo, horizontal } from '../build.mjs';
import { previewSheet, previewLogos } from '../preview.mjs';
const here = path.dirname(fileURLToPath(import.meta.url));
const V = o => ({ ...base, ...o });
const start = { layout: 'start', vertex: [46, 66], short: { len: 25, ang: 46 }, long: { len: 52, ang: 51 }, radii: [9.3, 8.9, 5.9] };
const sets = {
  'a · diagonal (descartada: sol + montaña)': {},
  'b · punto de partida, hueco 4,8': { ...start, dotR: 9.2, dotGap: 4.8 },
  'c · punto de partida, hueco 3,6': { ...start, dotR: 9.2, dotGap: 3.6 },
  'd · c con visto algo menor (más pizarra)': { ...start, short: { len: 23, ang: 46 }, long: { len: 47, ang: 51 }, radii: [8.8, 8.4, 5.6], dotR: 8.8, dotGap: 3.6 },
  'e · d con corrección óptica (+1,5 dcha, −1 arriba)': { ...start, short: { len: 23, ang: 46 }, long: { len: 47, ang: 51 }, radii: [8.8, 8.4, 5.6], dotR: 8.8, dotGap: 3.6, optical: [1.5, -1] },
};
const items = [];
for (const [label, o] of Object.entries(sets)) {
  items.push({ label: label + ' — color', pos: isotipo('pos', V(o)), neg: isotipo('neg', V(o)) });
  items.push({ label: label + ' — una tinta', pos: isotipo('mono', V(o)), neg: isotipo('monoNeg', V(o)) });
}
await previewSheet(path.join(here, 'r15', 'simbolos.png'), items, { title: 'Ronda 15 · vuelta al punto de partida', big: 150 });
await previewLogos(path.join(here, 'r15', 'logos.png'), ['c · punto de partida, hueco 3,6', 'e · d con corrección óptica (+1,5 dcha, −1 arriba)'].map(k => ({ label: k, pos: horizontal('pos', V(sets[k])), neg: horizontal('neg', V(sets[k])), h: 90 })), { title: 'Ronda 15 · logotipo' });
console.log('ok');
