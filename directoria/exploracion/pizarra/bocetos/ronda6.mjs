// Ronda 6: la IA como la tiza (herramienta a mano) frente a la IA como punto de partida.
import { C, P, add, sub, mul, norm, tick, capsule, circle, squircle, svgDoc, pathEl, write } from '../lib.mjs';
import { previewSheet } from '../preview.mjs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));

const T = (pts, rs) => tick(pts.map(([x, y]) => P(x, y)), Array.isArray(rs) ? rs : [rs, rs, rs]);
const doc = body => svgDoc([-3, -3, 106, 106], body);
const tile = fill => pathEl(squircle(0, 0, 100, 100, 29), fill);
const items = [];
const pair = (label, inner) => items.push({ label, pos: doc(tile(C.pizarra) + inner), neg: doc(inner) });

// 1 · tiza tumbada abajo a la derecha
{
  const t = T([[25, 45], [40, 61], [74, 25]], [8, 8.8, 7.4]);
  pair('1 · visto + tiza tumbada', pathEl(t, C.tiza) + pathEl(capsule(P(60, 80), P(80, 80), 5.6), C.chispa));
}
// 2 · tiza corta inclinada, como recién soltada
{
  const t = T([[24, 46], [39, 62], [73, 26]], [8, 8.8, 7.4]);
  pair('2 · tiza recién soltada', pathEl(t, C.tiza) + pathEl(capsule(P(64, 82), P(80, 76), 5.6), C.chispa));
}
// 3 · tiza a la izquierda, bajo el arranque del visto
{
  const t = T([[30, 40], [44, 56], [76, 22]], [8, 8.8, 7.4]);
  pair('3 · tiza bajo el arranque', pathEl(t, C.tiza) + pathEl(capsule(P(22, 78), P(42, 78), 5.6), C.chispa));
}
// 4 · tiza vertical a la derecha (en pie)
{
  const t = T([[20, 52], [35, 68], [64, 34]], [8, 8.8, 7.4]);
  pair('4 · tiza en pie', pathEl(t, C.tiza) + pathEl(capsule(P(80, 52), P(80, 74), 5.6), C.chispa));
}
// 5 · base: chispa como punto de partida (control)
{
  const t = T([[37, 50], [48.5, 64], [78, 30]], [7.6, 8.6, 7]);
  const u = norm(sub(P(48.5, 64), P(37, 50)));
  const d = add(P(37, 50), mul(u, -(7.6 + 4.2 + 7.8)));
  pair('5 · base (control)', pathEl(t, C.tiza) + pathEl(circle(d.x, d.y, 7.8), C.chispa));
}
// 6 · tiza = el punto de partida alargado (en el eje del trazo corto)
{
  const p0 = P(38, 52), v = P(49, 65);
  const t = tick([p0, v, P(78, 31)], [7.6, 8.6, 7]);
  const u = norm(sub(v, p0));
  const a = add(p0, mul(u, -(7.6 + 4.4 + 6.4))), b = add(a, mul(u, -9));
  pair('6 · tiza en el eje del visto', pathEl(t, C.tiza) + pathEl(capsule(a, b, 6.4), C.chispa));
}

for (const [i, it] of items.entries()) write(path.join(here, 'r6', `${i + 1}.svg`), it.pos);
await previewSheet(path.join(here, 'r6', 'ronda6.png'), items, { title: 'Ronda 6 · símbolo' });
console.log('ok');
