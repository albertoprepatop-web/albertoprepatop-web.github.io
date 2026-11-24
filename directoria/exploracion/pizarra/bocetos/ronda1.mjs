// Ronda 1: bocetos del símbolo dentro del territorio «pizarra».
import { C, P, add, sub, mul, norm, tick, capsule, circle, rrect, svgDoc, pathEl, write } from '../lib.mjs';
import { previewSheet } from '../preview.mjs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));

const T = (pts, r) => tick(pts.map(([x, y]) => P(x, y)), [r, r, r]);
const doc = body => svgDoc([0, 0, 100, 100], body);
const tile = fill => pathEl(rrect(6, 6, 88, 88, 20), fill);

const items = [];
function add2(label, posBody, negBody) {
  items.push({ label, pos: doc(posBody), neg: doc(negBody ?? posBody) });
}

// S1 · Visto bueno: el punto naranja (propuesta) y el visto de tiza (decisión)
{
  const t = T([[38, 52], [49, 63], [72, 38]], 7);
  const dot = circle(25.5, 39.5, 6.5);
  const body = (bg) => `${tile(bg)}${pathEl(t, C.tiza)}${pathEl(dot, C.chispa)}`;
  add2('S1 · punto + visto', body(C.pizarra), body(C.pizarraLinea));
}
// S2 · Vº: el visto con su «º» volado
{
  const t = T([[24, 52], [37, 65], [61, 39]], 7);
  const dot = circle(76, 37, 6.5);
  const body = (bg) => `${tile(bg)}${pathEl(t, C.tiza)}${pathEl(dot, C.chispa)}`;
  add2('S2 · Vº (visto bueno)', body(C.pizarra), body(C.pizarraLinea));
}
// S3 · Pizarra apaisada con repisa y tiza naranja
{
  const board = rrect(10, 16, 80, 56, 8);
  const tray = rrect(5, 76, 90, 8, 4);
  const t = T([[35, 43], [45, 53], [65, 31]], 6);
  const chalk = capsule(P(62, 72.4), P(77, 72.4), 3.6);
  const body = (bg) => `${pathEl(board, bg)}${pathEl(tray, bg)}${pathEl(t, C.tiza)}${pathEl(chalk, C.chispa)}`;
  add2('S3 · pizarra con repisa', body(C.pizarra), body(C.pizarraLinea));
}
// S4 · Orden del día: dos hechos y el siguiente, preparado
{
  let b = '';
  const rows = [30, 50, 70];
  rows.forEach((y, i) => {
    if (i < 2) b += pathEl(T([[21, y], [25.5, y + 4.5], [33, y - 4]], 3.2), C.tiza);
    else b += pathEl(circle(27, y, 5), C.chispa);
    b += pathEl(capsule(P(43, y), P(76, y), 4), C.tiza);
  });
  add2('S4 · orden del día', tile(C.pizarra) + b, tile(C.pizarraLinea) + b);
}
// S5 · Dos trazos: la IA hace el primero, la persona cierra
{
  const a = capsule(P(28, 50), P(42, 64), 7.5);
  const bb = capsule(P(42, 64), P(72, 34), 7.5);
  const body = (bg) => `${tile(bg)}${pathEl(a, C.chispa)}${pathEl(bb, C.tiza)}`;
  add2('S5 · dos trazos', body(C.pizarra), body(C.pizarraLinea));
}
// S6 · El visto sostiene la chispa
{
  const t = T([[26, 46], [43, 66], [76, 30]], 7);
  const dot = circle(43, 38, 7.5);
  const body = (bg) => `${tile(bg)}${pathEl(t, C.tiza)}${pathEl(dot, C.chispa)}`;
  add2('S6 · visto con chispa dentro', body(C.pizarra), body(C.pizarraLinea));
}
// S7 · Cuaderno de dirección con cinta
{
  const cover = rrect(18, 6, 64, 82, 9);
  const spine = rrect(18, 6, 12, 82, 0);
  const t = T([[38, 46], [48, 56], [67, 34]], 6);
  const ribbon = `M60 80H70V96L65 91.5L60 96Z`;
  const body = (bg) => `${pathEl(cover, bg)}${pathEl(t, C.tiza)}${pathEl(ribbon, C.chispa)}`;
  add2('S7 · cuaderno con cinta', body(C.pizarra), body(C.pizarraLinea));
}
// S8 · La tiza que acaba de hacer el visto
{
  const t = T([[24, 54], [36, 66], [58, 42]], 6.5);
  const chalk = capsule(P(64, 35.5), P(78, 20.5), 6.5);
  const body = (bg) => `${tile(bg)}${pathEl(t, C.tiza)}${pathEl(chalk, C.chispa)}`;
  add2('S8 · la tiza del visto', body(C.pizarra), body(C.pizarraLinea));
}
// S9 · Pizarra cuadrada con repisa (para favicon)
{
  const board = rrect(8, 6, 84, 70, 14);
  const tray = rrect(4, 81, 92, 10, 5);
  const t = T([[32, 41], [44, 53], [68, 28]], 7.5);
  const chalk = capsule(P(62, 76.5), P(80, 76.5), 4.5);
  const body = (bg) => `${pathEl(board, bg)}${pathEl(tray, bg)}${pathEl(t, C.tiza)}${pathEl(chalk, C.chispa)}`;
  add2('S9 · pizarra cuadrada + repisa', body(C.pizarra), body(C.pizarraLinea));
}

for (const [i, it] of items.entries()) write(path.join(here, 'r1', `s${i + 1}.svg`), it.pos);
await previewSheet(path.join(here, 'r1', 'ronda1.png'), items, { title: 'Ronda 1 · símbolo' });
console.log('ok');
