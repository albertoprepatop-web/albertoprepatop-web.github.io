// Ronda 5: ¿se puede hacer el visto más propio? Ligadura i + visto, chispa como inicio del gesto, etc.
import { C, P, add, sub, mul, norm, tick, capsule, circle, squircle, svgDoc, pathEl, write } from '../lib.mjs';
import { previewSheet } from '../preview.mjs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));

const T = (pts, rs) => tick(pts.map(([x, y]) => P(x, y)), Array.isArray(rs) ? rs : [rs, rs, rs]);
const doc = body => svgDoc([-3, -3, 106, 106], body);
const tile = fill => pathEl(squircle(0, 0, 100, 100, 29), fill);
const items = [];
const add2 = (label, pos, neg) => items.push({ label, pos: doc(pos), neg: doc(neg ?? pos) });
const pair = (label, inner) => add2(label, tile(C.pizarra) + inner, inner);

// 1 · ligadura «i» + visto: el trazo corto casi vertical con su punto
{
  const t = T([[36, 42], [41, 72], [78, 28]], [8, 8.6, 7.4]);
  pair('1 · i + visto (ligadura)', pathEl(t, C.tiza) + pathEl(circle(34.6, 24.5, 8), C.chispa));
}
// 2 · ligadura más abierta
{
  const t = T([[30, 46], [40, 72], [78, 30]], [8, 8.6, 7.4]);
  const u = norm(sub(P(40, 72), P(30, 46)));
  const d = add(P(30, 46), mul(u, -(8 + 4.5 + 8)));
  pair('2 · i + visto (más abierta)', pathEl(t, C.tiza) + pathEl(circle(d.x, d.y, 8), C.chispa));
}
// 3 · el visto nace de la chispa (sin hueco, la chispa más grande que el trazo)
{
  const t = T([[33, 50], [45, 66], [77, 31]], [7.2, 8.4, 7]);
  pair('3 · nace de la chispa', pathEl(t, C.tiza) + pathEl(circle(29, 45, 10.5), C.pizarra) + pathEl(circle(29, 45, 8.2), C.chispa));
}
// 4 · base actual (para comparar)
{
  const t = T([[37, 50], [48.5, 64], [78, 30]], [7.6, 8.6, 7]);
  const u = norm(sub(P(48.5, 64), P(37, 50)));
  const d = add(P(37, 50), mul(u, -(7.6 + 4.2 + 7.8)));
  pair('4 · base (punto de partida)', pathEl(t, C.tiza) + pathEl(circle(d.x, d.y, 7.8), C.chispa));
}
// 5 · Vº compacto: la chispa en la esquina que deja el trazo largo
{
  const t = T([[20, 52], [37, 70], [66, 36]], [8, 8.6, 7.4]);
  pair('5 · Vº compacto', pathEl(t, C.tiza) + pathEl(circle(78.5, 25, 7.8), C.chispa));
}
// 6 · visto grande que se apoya en la chispa (la chispa como pie del trazo corto)
{
  const t = T([[24, 48], [40, 68], [80, 24]], [8, 9, 7.4]);
  pair('6 · visto amplio + chispa arriba', pathEl(t, C.tiza) + pathEl(circle(24, 26, 8), C.chispa));
}

for (const [i, it] of items.entries()) write(path.join(here, 'r5', `${i + 1}.svg`), it.pos);
await previewSheet(path.join(here, 'r5', 'ronda5.png'), items, { title: 'Ronda 5 · símbolo' });
console.log('ok');
