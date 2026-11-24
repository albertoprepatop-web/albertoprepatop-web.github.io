// Ronda 1 de bocetos: varias formas de resolver la «IA» dentro del territorio tipográfico.
import { outline, roundPoly, rrect, serifI, svgDoc, path, render, sheet, write, C } from './lib.mjs';
import path_ from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path_.dirname(fileURLToPath(import.meta.url));
const out = n => path_.join(here, 'r1', n);

// ---------- palabra «Director» ----------
function director(weight = 700, x = 0) {
  const j = outline('Director', { weight, x });
  const ink = j.glyphs.map(g => g.d).join('');
  return { d: ink, end: j.bbox.x2, adv: x + j.width, json: j };
}
function glyphA(weight, x) {
  const j = outline('A', { weight, x });
  return { d: j.d, x1: j.bbox.x1, x2: j.bbox.x2 };
}
function inkOf(text, weight, x = 0, size = 100, y = 0) {
  const j = outline(text, { weight, x, size, y });
  return j;
}

// ---------- símbolos (en una caja de 100 x 100) ----------
const tile = (fill = C.pizarra, r = 22) => path(rrect(0, 0, 100, 100, r), fill);

// S1: la D se cierra con la «I» con remates (el asta de la D es la I de IA)
function symS1({ bowl = C.tiza, stem = C.chispa, H = 54, cy = 50, S = 13, t = 10.5, o = 7, gap = 3.5, w = 13, x0 = 20, bg = true } = {}) {
  const top = cy - H / 2, bot = cy + H / 2;
  const I = serifI({ x: x0, base: bot, H, S, o, t, r: 2 });
  const bx = x0 + I.width + gap;            // empieza la panza
  const R = H / 2, cx = bx + 4;             // centro de la curva
  const rx = R - w, ry = R - t;
  const d = `M${bx + 1.5} ${top}H${cx}A${R} ${R} 0 0 1 ${cx + R} ${cy}A${R} ${R} 0 0 1 ${cx} ${bot}H${bx + 1.5}Q${bx} ${bot} ${bx} ${bot - 1.5}V${bot - t + 1.5}Q${bx} ${bot - t} ${bx + 1.5} ${bot - t}H${cx}A${rx} ${ry} 0 0 0 ${cx + rx} ${cy}A${rx} ${ry} 0 0 0 ${cx} ${top + t}H${bx + 1.5}Q${bx} ${top + t} ${bx} ${top + t - 1.5}V${top + 1.5}Q${bx} ${top} ${bx + 1.5} ${top}Z`;
  const glyphW = cx + R - x0;
  return { body: (bg ? tile() : '') + path(I.d, stem) + path(d, bowl), glyphW };
}

// S2: la «I» dentro de la D (la IA vive dentro del colegio)
function symS2() {
  const top = 21, bot = 79, x0 = 22, sw = 10, H = bot - top, R = H / 2, cx = 80 - R;
  const outer = `M${x0 + 2} ${top}H${cx}A${R} ${R} 0 0 1 80 50A${R} ${R} 0 0 1 ${cx} ${bot}H${x0 + 2}Q${x0} ${bot} ${x0} ${bot - 2}V${top + 2}Q${x0} ${top} ${x0 + 2} ${top}Z`;
  const ri = R - sw;
  const inner = `M${x0 + sw} ${top + sw}V${bot - sw}H${cx}A${ri} ${ri} 0 0 0 ${cx + ri} 50A${ri} ${ri} 0 0 0 ${cx} ${top + sw}Z`;
  const I = serifI({ x: 39, base: 64, H: 28, S: 7.5, o: 4.5, t: 6, r: 1 });
  return tile() + path(outer + inner, C.tiza) + path(I.d, C.chispa);
}

// S3: D de Rubik con la chispa (rombo) arriba a la derecha
function symS3() {
  const j = inkOf('D', 700, 22, 80, 78);
  const s = 9, cx = 78, cy = 24;
  const diamond = `M${cx} ${cy - s}L${cx + s} ${cy}L${cx} ${cy + s}L${cx - s} ${cy}Z`;
  return tile() + path(j.d, C.tiza) + path(roundPoly([[cx, cy - s], [cx + s, cy], [cx, cy + s], [cx - s, cy]], 1.5), C.chispa);
}

// S4: ficha naranja con «IA» calada
function symS4() {
  const j = inkOf('IA', 700, 0, 64, 0);
  const w = j.bbox.x2 - j.bbox.x1, h = j.bbox.y2 - j.bbox.y1;
  const dx = 50 - (j.bbox.x1 + w / 2), dy = 50 - (j.bbox.y1 + h / 2);
  const j2 = inkOf('IA', 700, dx, 64, dy);
  return path(rrect(0, 0, 100, 100, 22), C.chispa) + path(j2.d, C.papel);
}

// S5: ligadura IA (la I y la A comparten el remate superior)
function ligaIA({ x = 0, base = 0, H = 70, S = 18.5, t = 15, weight = 700 } = {}) {
  // I: asta + remate superior que se prolonga hasta el ápice plano de la A
  const A = glyphA(weight, 0);
  return null;
}

// ---------- palabras (logotipo) ----------
function wordRemates({ weight = 700, ia = C.chispa, dir = C.pizarra, S = 18.5, o = 12, t = 14.5, gapL = 4, gapR = 6 } = {}) {
  const D = director(weight, 0);
  // fin real de la tinta de la «r»: brazo en 416 (700). Usamos bbox.x2 de «Director».
  const ix = D.end + gapL;
  const I = serifI({ x: ix, base: 0, H: 70, S, o, t, r: 2.5 });
  const Araw = glyphA(weight, 0);
  const ax = ix + I.width + gapR - Araw.x1;
  const A = glyphA(weight, ax);
  return { body: path(D.d, dir) + path(I.d + A.d, ia), x1: D.json.bbox.x1, x2: A.x2, top: -70, bot: 0 };
}

function wordFicha({ weight = 700, ia = C.chispa, dir = C.pizarra, gap = 7, padX = 12, padY = 10, size = 100 } = {}) {
  const D = director(weight, 0);
  const j0 = inkOf('IA', weight, 0, size * 0.86, 0);
  const iw = j0.bbox.x2 - j0.bbox.x1, ih = j0.bbox.y2 - j0.bbox.y1;
  const tx = D.end + gap, tw = iw + 2 * padX;
  const th = 70 + 2 * padY * 0.6, ty = -70 - padY * 0.6;
  const cyT = ty + th / 2;
  const j = inkOf('IA', weight, tx + padX - j0.bbox.x1, size * 0.86, cyT + ih / 2 - j0.bbox.y2 + 0);
  return { body: path(D.d, dir) + path(rrect(tx, ty, tw, th, 12), ia) + path(j.d, C.papel), x1: D.json.bbox.x1, x2: tx + tw, top: ty, bot: ty + th };
}

function wordChispa({ weight = 700, ia = C.chispa, dir = C.pizarra, gap = 9 } = {}) {
  const D = director(weight, 0);
  const j = inkOf('IA', weight, D.adv + gap, 100, 0);
  const I = j.glyphs[0];
  const stemL = I.x + 7, stemR = stemL + (weight == 700 ? 18.5 : 16.3);
  const cx = (stemL + stemR) / 2, s = 10, cy = -70 - 8 - s;
  const dia = roundPoly([[cx, cy - s], [cx + s, cy], [cx, cy + s], [cx - s, cy]], 1.5);
  return { body: path(D.d, dir) + path(j.d + dia, ia), x1: D.json.bbox.x1, x2: j.bbox.x2, top: cy - s, bot: 0 };
}

function wordLiga({ weight = 700, ia = C.chispa, dir = C.pizarra, gap = 5 } = {}) {
  // I con remate superior largo que hace de «sombrero» y la A cuelga debajo: IA como una sola pieza
  const D = director(weight, 0);
  const ix = D.end + gap, S = 18.5, t = 14.5;
  const Araw = glyphA(weight, 0);
  const ax = ix + S + 7 - Araw.x1;
  const A = glyphA(weight, ax);
  const bar = roundPoly([[ix, -70], [A.x2 - 2, -70], [A.x2 - 2, -70 + t], [ix, -70 + t]], [2.5, 2.5, 2.5, 0]);
  const stem = roundPoly([[ix, -70 + t - 1], [ix + S, -70 + t - 1], [ix + S, 0], [ix, 0]], [0, 0, 2.5, 2.5]);
  return { body: path(D.d, dir) + path(bar + stem + A.d, ia), x1: D.json.bbox.x1, x2: A.x2, top: -70, bot: 0 };
}

// ---------- composición horizontal ----------
function lockup(word, symBody, { symH = 100, gap = 28, pad = 10, symFirst = true } = {}) {
  // símbolo de 100 x 100 escalado a symH, centrado en la altura de mayúsculas (cy = -35)
  const s = symH / 100, sy = -35 - symH / 2;
  const sx = word.x1 - gap - symH;
  const g = `<g transform="translate(${sx} ${sy}) scale(${s})">${symBody}</g>`;
  const top = Math.min(sy, word.top), bot = Math.max(sy + symH, word.bot);
  const vb = [sx - pad, top - pad, word.x2 - sx + 2 * pad, bot - top + 2 * pad];
  return svgDoc(vb, g + word.body);
}

const variants = [
  { id: 'A-remates-700', word: wordRemates({ weight: 700 }), sym: symS1().body },
  { id: 'A2-remates-700-chispaTexto', word: wordRemates({ weight: 700, ia: C.chispaTexto }), sym: symS1().body },
  { id: 'B-remates-600', word: wordRemates({ weight: 600, S: 16.3, t: 13, o: 11 }), sym: symS2() },
  { id: 'C-ficha', word: wordFicha({}), sym: symS4() },
  { id: 'D-chispa', word: wordChispa({}), sym: symS3() },
  { id: 'E-ligadura', word: wordLiga({}), sym: symS1().body },
];

const items = [];
for (const v of variants) {
  const f = out(`${v.id}.svg`);
  write(f, lockup(v.word, v.sym));
  render(f, out(`${v.id}.png`), { width: 1100, bg: C.tiza, pad: 30 });
  items.push({ label: v.id, file: out(`${v.id}.png`) });
}
// símbolos sueltos
const syms = { S1: symS1().body, S2: symS2(), S3: symS3(), S4: symS4() };
for (const [k, b] of Object.entries(syms)) {
  const f = out(`sym-${k}.svg`);
  write(f, svgDoc([0, 0, 100, 100], b));
  render(f, out(`sym-${k}.png`), { width: 300, bg: C.tiza, pad: 20 });
  items.push({ label: `símbolo ${k}`, file: out(`sym-${k}.png`) });
}
sheet(out('ronda1.png'), items, { cols: 2, cell: 720, bg: '#ffffff' });
console.log('ok');
