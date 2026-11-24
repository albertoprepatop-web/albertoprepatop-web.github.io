// Ronda 3: afinar las direcciones con más futuro y probar alternativas de colocación de la chispa.
import { C, P, add, sub, mul, norm, tick, capsule, circle, rrect, squircle, svgDoc, pathEl, write } from '../lib.mjs';
import { previewSheet } from '../preview.mjs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));

const T = (pts, rs) => tick(pts.map(([x, y]) => P(x, y)), Array.isArray(rs) ? rs : [rs, rs, rs]);
const doc = body => svgDoc([0, 0, 100, 100], body);
const tile = fill => pathEl(squircle(6, 6, 88, 88, 26), fill);
const items = [];
const add2 = (label, pos, neg) => items.push({ label, pos: doc(pos), neg: doc(neg ?? pos) });

// helper: el punto en el eje del trazo corto, a una distancia «gap» del arranque
function startDot(p0, p1, r0, rd, gap) {
  const u = norm(sub(P(...p1), P(...p0)));
  return add(P(...p0), mul(u, -(r0 + gap + rd)));
}

// 1 · arranque pegado: el punto es el primer toque de la tiza
{
  const p0 = [38, 50], p1 = [48.5, 62], p2 = [74, 34];
  const t = T([p0, p1, p2], [6.5, 7.5, 6]);
  const d = startDot(p0, p1, 6.5, 6.8, 3.6);
  const b = bg => tile(bg) + pathEl(t, C.tiza) + pathEl(circle(d.x, d.y, 6.8), C.chispa);
  add2('1 · punto de partida (junto)', b(C.pizarra), pathEl(t, C.tiza) + pathEl(circle(d.x, d.y, 6.8), C.chispa));
}
// 2 · Vº tipográfico: anillo con subrayado, como el ordinal
{
  const t = T([[17, 51], [33, 68], [60, 35]], 8);
  const ox = 78, oy = 33;
  const ringD = `${circle(ox, oy, 7.4)}${circle(ox, oy, 3.6)}`;
  const bar = rrect(ox - 7.4, oy + 11, 14.8, 4.2, 2.1);
  const mk = (fg) => pathEl(t, fg) + `<path fill="${C.chispa}" fill-rule="evenodd" d="${ringD}"/>` + pathEl(bar, C.chispa);
  add2('2 · Vº con ordinal', mk(C.pizarra), mk(C.tiza));
}
// 3 · tiza apoyada en el borde inferior de la pizarra
{
  const t = T([[29, 47], [42, 60], [70, 31]], 7.5);
  const chalk = capsule(P(58, 94), P(80, 94), 5.2);
  const halo = capsule(P(58, 94), P(80, 94), 8.2);
  const b = bg => tile(bg) + pathEl(t, C.tiza) + pathEl(halo, C.tiza) + pathEl(chalk, C.chispa);
  const bn = bg => tile(bg) + pathEl(t, C.tiza) + pathEl(halo, C.pizarra) + pathEl(chalk, C.chispa);
  add2('3 · tiza en el borde', b(C.pizarra), bn(C.pizarraLinea));
}
// 4 · renglón: el visto sobre la línea que traza la IA
{
  const t = T([[26, 44], [40, 58], [70, 27]], 7.5);
  const line = capsule(P(24, 74), P(76, 74), 4);
  const b = bg => tile(bg) + pathEl(t, C.tiza) + pathEl(line, C.chispa);
  add2('4 · visto sobre el renglón', b(C.pizarra), b(C.pizarraLinea));
}
// 5 · visto calado que abre la esquina (silueta propia)
{
  const t = T([[25, 50], [40, 66], [100, 0]], 8);
  const tileD = squircle(6, 6, 88, 88, 26);
  const pos = `<path fill="${C.pizarra}" fill-rule="evenodd" d="${tileD}${t}"/>` + pathEl(circle(83, 17, 0.1), C.chispa);
  add2('5 · visto que abre la esquina', pos, `<path fill="${C.tiza}" fill-rule="evenodd" d="${tileD}${t}"/>`);
}
// 6 · chispa en el arranque, visto con gesto (más corto y alto)
{
  const p0 = [40, 54], p1 = [50, 66], p2 = [72, 30];
  const t = T([p0, p1, p2], [6, 7.6, 5.4]);
  const d = startDot(p0, p1, 6, 6.6, 4.4);
  const b = bg => tile(bg) + pathEl(t, C.tiza) + pathEl(circle(d.x, d.y, 6.6), C.chispa);
  add2('6 · arranque + visto alto', b(C.pizarra), b(C.pizarraLinea));
}
// 7 · visto + chispa sin baldosa (marca libre)
{
  const p0 = [33, 52], p1 = [47, 68], p2 = [84, 28];
  const t = T([p0, p1, p2], [8, 9.5, 7.5]);
  const d = startDot(p0, p1, 8, 8.5, 5);
  add2('7 · marca libre', pathEl(t, C.pizarra) + pathEl(circle(d.x, d.y, 8.5), C.chispa),
    pathEl(t, C.tiza) + pathEl(circle(d.x, d.y, 8.5), C.chispa));
}
// 8 · la chispa como remate superior del visto, separada (punto final del gesto)
{
  const t = T([[22, 52], [37, 67], [62, 40]], 7.5);
  const u = norm(P(25, -27));
  const dc = add(P(62, 40), mul(u, 7.5 + 6 + 7));
  const b = bg => tile(bg) + pathEl(t, C.tiza) + pathEl(circle(dc.x, dc.y, 7), C.chispa);
  add2('8 · trazo y chispa en línea', b(C.pizarra), b(C.pizarraLinea));
}
// 9 · dos pasos: la chispa propone (punto) y el visto decide, en una baldosa apaisada de pizarra
{
  const board = squircle(4, 16, 92, 68, 20);
  const t = T([[42, 50], [52, 61], [74, 36]], 7);
  const b = bg => pathEl(board, bg) + pathEl(t, C.tiza) + pathEl(circle(26, 50, 7), C.chispa);
  add2('9 · pizarra apaisada', b(C.pizarra), b(C.pizarraLinea));
}

for (const [i, it] of items.entries()) write(path.join(here, 'r3', `${i + 1}.svg`), it.pos);
await previewSheet(path.join(here, 'r3', 'ronda3.png'), items, { title: 'Ronda 3 · símbolo' });
console.log('ok');
