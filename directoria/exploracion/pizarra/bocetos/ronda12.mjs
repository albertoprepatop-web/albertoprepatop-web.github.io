// Ronda 12: romper la «casilla». La pizarra es la página del día: la chispa arriba a la izquierda (donde empieza)
// y el visto abajo a la derecha (donde el profesor pone el visto al revisar).
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { C, P, add, mul, tick, circle, rrect, svgDoc, pathEl, write } from '../lib.mjs';
import { previewSheet } from '../preview.mjs';
const here = path.dirname(fileURLToPath(import.meta.url));
const rad = d => d * Math.PI / 180;
const doc = b => svgDoc([-3, -3, 106, 106], b);

function vis(vx, vy, sl, sa, ll, la, rs) {
  const V = P(vx, vy);
  const p0 = add(V, P(-sl * Math.cos(rad(sa)), -sl * Math.sin(rad(sa))));
  const p2 = add(V, P(ll * Math.cos(rad(la)), -ll * Math.sin(rad(la))));
  return tick([p0, V, p2], rs);
}
const items = [];
const add2 = (label, inner, tileR = 16) => items.push({ label, pos: doc(pathEl(rrect(0, 0, 100, 100, tileR), C.pizarra) + inner), neg: doc(pathEl(rrect(0, 0, 100, 100, tileR), C.pizarraLinea) + inner) });

add2('D1 · chispa arriba-izq., visto pequeño abajo-der.', pathEl(circle(25, 25, 8.5), C.chispa) + pathEl(vis(62, 77, 15, 47, 32, 51, [7, 6.8, 4.6]), C.tiza));
add2('D2 · visto mediano', pathEl(circle(24, 24, 8.5), C.chispa) + pathEl(vis(57, 76, 19, 47, 40, 51, [8.2, 7.8, 5.2]), C.tiza));
add2('D3 · visto grande, chispa en la esquina', pathEl(circle(21, 21, 8), C.chispa) + pathEl(vis(52, 76, 22, 46, 50, 51, [9, 8.6, 5.6]), C.tiza));
add2('D4 · D2 con pizarra más redonda', pathEl(circle(24.5, 24.5, 8.5), C.chispa) + pathEl(vis(57, 76, 19, 47, 40, 51, [8.2, 7.8, 5.2]), C.tiza), 22);
add2('D5 · chispa y visto en diagonal, más juntos', pathEl(circle(29, 29, 8.5), C.chispa) + pathEl(vis(55, 74, 19, 47, 40, 51, [8.2, 7.8, 5.2]), C.tiza));
add2('D6 · visto abajo-der. que sale del eje de la chispa', pathEl(circle(23, 23, 8.5), C.chispa) + pathEl(vis(60, 76, 17, 45, 36, 52, [7.8, 7.4, 5]), C.tiza));

for (const [i, it] of items.entries()) write(path.join(here, 'r12', `d${i + 1}.svg`), it.pos);
await previewSheet(path.join(here, 'r12', 'ronda12.png'), items, { title: 'Ronda 12 · de la propuesta al visto', big: 170 });
console.log('ok');
