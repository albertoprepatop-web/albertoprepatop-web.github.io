// Ronda 9 (refinado 2): que el visto parezca escrito con tiza (gesto afinado) y no un icono de interfaz.
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { base, isotipo } from '../build.mjs';
import { previewSheet } from '../preview.mjs';
const here = path.dirname(fileURLToPath(import.meta.url));

const V = o => ({ ...base, negTile: null, tileShape: 'rrect', tileR: 18, ...o });
const sets = {
  'a · grueso uniforme (ref.)': { vertex: [46, 67], short: { len: 17, ang: 46 }, long: { len: 50, ang: 50 }, radii: [7.8, 8.8, 6.8] },
  'b · gesto: arranque firme, final fino': { vertex: [46, 66], short: { len: 21, ang: 47 }, long: { len: 52, ang: 51 }, radii: [8.2, 7.6, 4.8], dotR: 7.4, dotGap: 4.6 },
  'c · gesto más ligero': { vertex: [46, 66], short: { len: 21, ang: 47 }, long: { len: 53, ang: 51 }, radii: [7.2, 6.8, 4.2], dotR: 6.8, dotGap: 4.4 },
  'd · gesto con brazo corto más vertical': { vertex: [45, 67], short: { len: 22, ang: 56 }, long: { len: 54, ang: 50 }, radii: [8, 7.4, 4.6], dotR: 7.2, dotGap: 4.6 },
  'e · gesto, final muy fino': { vertex: [46, 66], short: { len: 21, ang: 47 }, long: { len: 54, ang: 51 }, radii: [8.4, 7.6, 3.6], dotR: 7.4, dotGap: 4.6 },
  'f · gesto b, pizarra menos redonda': { tileR: 14, vertex: [46, 66], short: { len: 21, ang: 47 }, long: { len: 52, ang: 51 }, radii: [8.2, 7.6, 4.8], dotR: 7.4, dotGap: 4.6 },
};
const items = Object.entries(sets).map(([label, o]) => ({ label, pos: isotipo('pos', V(o)), neg: isotipo('neg', V(o)) }));
await previewSheet(path.join(here, 'r9', 'ronda9.png'), items, { title: 'Ronda 9 · el gesto de tiza', big: 170 });
console.log('ok');
