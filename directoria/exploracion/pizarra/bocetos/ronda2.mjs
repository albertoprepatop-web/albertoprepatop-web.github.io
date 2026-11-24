// Ronda 2: buscar un visto propio (gesto de tiza, «Vº», cuadrícula, cuaderno) y no una casilla genérica.
import { C, P, add, sub, mul, norm, tick, capsule, circle, rrect, svgDoc, pathEl, write } from '../lib.mjs';
import { previewSheet } from '../preview.mjs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));

const T = (pts, rs) => tick(pts.map(([x, y]) => P(x, y)), Array.isArray(rs) ? rs : [rs, rs, rs]);
const doc = body => svgDoc([0, 0, 100, 100], body);
const tile = fill => pathEl(rrect(6, 6, 88, 88, 20), fill);
const ring = (cx, cy, ro, ri) => `${circle(cx, cy, ro)}${circle(cx, cy, ri)}`; // usar con evenodd
const ringEl = (cx, cy, ro, ri, fill) => `<path fill="${fill}" fill-rule="evenodd" d="${ring(cx, cy, ro, ri)}"/>`;

const items = [];
const add2 = (label, pos, neg) => items.push({ label, pos: doc(pos), neg: doc(neg ?? pos) });

// A · gesto de tiza (trazo afinado) + punto de partida
{
  const t = T([[37, 50], [48, 64], [75, 33]], [5.2, 8, 4.6]);
  const dot = circle(25, 37.5, 6.2);
  const b = bg => tile(bg) + pathEl(t, C.tiza) + pathEl(dot, C.chispa);
  add2('A · trazo de tiza + punto de partida', b(C.pizarra), b(C.pizarraLinea));
}
// B · Vº con anillo (ordinal)
{
  const t = T([[22, 50], [36, 65], [60, 37]], 7);
  const b = bg => tile(bg) + pathEl(t, C.tiza) + ringEl(74.5, 36.5, 8, 3.8, C.chispa);
  add2('B · Vº: visto + º', b(C.pizarra), b(C.pizarraLinea));
}
// C · Vº sin baldosa
{
  const t = T([[14, 52], [32, 72], [62, 36]], 9);
  const pos = pathEl(t, C.pizarra) + ringEl(80, 37, 10, 4.8, C.chispa);
  const neg = pathEl(t, C.tiza) + ringEl(80, 37, 10, 4.8, C.chispa);
  add2('C · Vº sin baldosa', pos, neg);
}
// D · cuadrícula: el visto hecho a cuadros (el último, naranja)
{
  const s = 13, g = 2.4, ox = 50 - (5 * s + 4 * g) / 2, oy = 50 - (4 * s + 3 * g) / 2;
  const cells = [[0, 2], [1, 3], [2, 2], [3, 1], [4, 0]];
  const sq = ([cx, cy]) => rrect(ox + cx * (s + g), oy + cy * (s + g), s, s, 3.2);
  const b = bg => tile(bg) + cells.map((c, i) => pathEl(sq(c), i === 4 ? C.chispa : C.tiza)).join('');
  add2('D · visto a cuadros', b(C.pizarra), b(C.pizarraLinea));
}
// E · repasar: la IA deja el punteado, la persona traza
{
  const t = T([[24, 50], [38, 64], [52, 49]], 7);
  const dots = [[61.5, 38.8], [71, 28.2]].map(([x, y]) => pathEl(circle(x, y, 4.6), C.chispa)).join('');
  const b = bg => tile(bg) + pathEl(t, C.tiza) + dots;
  add2('E · repasar el punteado', b(C.pizarra), b(C.pizarraLinea));
}
// F · cuaderno de anillas con pestaña
{
  const cover = rrect(14, 8, 72, 84, 14);
  const rings = [26, 44, 62, 80].map(y => pathEl(capsule(P(9, y - 4), P(9, y - 4), 0), C.pizarra)).join('');
  const holes = [24, 41, 58, 75].map(y => pathEl(capsule(P(14, y), P(24, y), 3.4), C.tiza)).join('');
  const t = T([[38, 50], [49, 61], [70, 37]], 6.5);
  const tab = rrect(82, 20, 10, 18, 4);
  const b = bg => pathEl(tab, C.chispa) + pathEl(cover, bg) + holes + pathEl(t, C.tiza);
  add2('F · cuaderno con pestaña', b(C.pizarra), b(C.pizarraLinea));
}
// G · la tiza al final del trazo
{
  const t = T([[24, 52], [37, 66], [60, 40]], 7);
  const u = norm(P(23, -26));
  const dc = add(P(60, 40), mul(u, 7 + 5 + 6.5));
  const b = bg => tile(bg) + pathEl(t, C.tiza) + pathEl(circle(dc.x, dc.y, 6.5), C.chispa);
  add2('G · chispa al final', b(C.pizarra), b(C.pizarraLinea));
}
// H · la chispa en el vértice (bisagra)
{
  const a = capsule(P(26, 47), P(41, 64), 7);
  const bb = capsule(P(41, 64), P(74, 31), 7);
  const b = bg => tile(bg) + pathEl(a, C.tiza) + pathEl(bb, C.tiza) + pathEl(circle(41, 64, 10.5), bg) + pathEl(circle(41, 64, 7.6), C.chispa);
  add2('H · chispa en el vértice', b(C.pizarra), b(C.pizarraLinea));
}
// I · gesto de tiza (más carácter) sin punto, la IA en el remate
{
  const t = T([[25, 49], [40, 66], [76, 30]], [5.5, 8.5, 4]);
  const b = bg => tile(bg) + pathEl(t, C.tiza) + pathEl(circle(76, 30, 4), C.chispa);
  add2('I · remate naranja', b(C.pizarra), b(C.pizarraLinea));
}

for (const [i, it] of items.entries()) write(path.join(here, 'r2', `${String.fromCharCode(97 + i)}.svg`), it.pos);
await previewSheet(path.join(here, 'r2', 'ronda2.png'), items, { title: 'Ronda 2 · símbolo' });
console.log('ok');
