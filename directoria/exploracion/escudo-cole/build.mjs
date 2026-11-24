#!/usr/bin/env node
// Genera los SVG del concepto «Escudo de casa» (territorio escudo-cole) de DirectorIA.
//
// Uso: node build.mjs [--out carpeta] [--tag sufijo] [--weight 700] [--sym hombros|número] [--gap chispa|número]
//                     [--ia chispa|chispa-texto] [--ring 13] [--dot 14] [--pitch 27]
// Necesita brandtools/outline.mjs (texto a contornos con Rubik, SIL OFL). Ruta: variable BRANDTOOLS.
//
// Reglas de construcción (caja del isotipo = 100):
//  · Escudo de 93 de alto y proporción 5:6 (la del escudo español), base semicircular y tejado a dos aguas de 27°.
//  · La chispa (r 14) va en el centroide de la silueta.
//  · En la composición horizontal, los hombros del escudo caen en la altura de mayúsculas de Rubik y la chispa
//    en la mitad de esa altura; el aire entre escudo y palabra es el diámetro de la chispa.
//  · Sobre fondo oscuro el escudo conserva su interior de pizarra y se perfila con un contorno de tiza (13).
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const TOOLS = process.env.BRANDTOOLS || '/tmp/claude-0/-home-user-albertoprepatop-web-github-io/db30fac1-e41f-5e34-8ec7-ae08fc5fe643/scratchpad/brandtools';
const arg = (n, d) => { const i = process.argv.indexOf('--' + n); return i > -1 ? process.argv[i + 1] : d; };

const OUT = path.resolve(arg('out', here));
const TAG = arg('tag', '');
const WEIGHT = +arg('weight', '700');
const SYM_ARG = arg('sym', 'hombros');
const GAP_ARG = arg('gap', 'chispa');
const IA_LIGHT = arg('ia', 'chispa');
const TRACK = +arg('tracking', '-0.01');
const PITCH = +arg('pitch', '27');
const DOT = +arg('dot', '14');
const RING = +arg('ring', '13');
fs.mkdirSync(OUT, { recursive: true });

const C = { pizarra: '#17322C', tiza: '#F6F3EC', chispa: '#E07A3A', chispaTexto: '#B4531C' };
const IA_COLOR = IA_LIGHT === 'chispa-texto' ? C.chispaTexto : C.chispa;
const f = n => +n.toFixed(2);

// ---------- geometría ----------
const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
const mul = (a, k) => [a[0] * k, a[1] * k];
const unit = a => mul(a, 1 / Math.hypot(a[0], a[1]));
const dot = (a, b) => a[0] * b[0] + a[1] * b[1];
const cross = (a, b) => a[0] * b[1] - a[1] * b[0];
function fillet(A, B, Cc, r) {
  const v1 = unit(sub(A, B)), v2 = unit(sub(Cc, B));
  const th = Math.acos(Math.max(-1, Math.min(1, dot(v1, v2))));
  const t = r / Math.tan(th / 2);
  return { p1: add(B, mul(v1, t)), p2: add(B, mul(v2, t)), sweep: cross(sub(B, A), sub(Cc, B)) > 0 ? 1 : 0, r };
}
function roundedPoly(pts, rs) {
  const n = pts.length;
  const fl = pts.map((B, i) => fillet(pts[(i - 1 + n) % n], B, pts[(i + 1) % n], rs[i]));
  let d = `M${f(fl[0].p2[0])} ${f(fl[0].p2[1])}`;
  for (let i = 1; i <= n; i++) {
    const c = fl[i % n];
    d += `L${f(c.p1[0])} ${f(c.p1[1])}A${f(c.r)} ${f(c.r)} 0 0 ${c.sweep} ${f(c.p2[0])} ${f(c.p2[1])}`;
  }
  return d + 'Z';
}

// Silueta: vértice (cx, apexY), hombros a ±halfW en shY, lados hasta ys, base semicircular de radio halfW.
function crestPath({ cx, apexY, halfW, shY, ys, ra, rs }) {
  const x0 = cx - halfW, x1 = cx + halfW;
  const apex = [cx, apexY], shR = [x1, shY], shL = [x0, shY];
  const fa = fillet(shL, apex, shR, ra), fr = fillet(apex, shR, [x1, ys], rs), fl = fillet([x0, ys], shL, apex, rs);
  return `M${f(fa.p2[0])} ${f(fa.p2[1])}L${f(fr.p1[0])} ${f(fr.p1[1])}A${f(rs)} ${f(rs)} 0 0 1 ${f(fr.p2[0])} ${f(fr.p2[1])}`
    + `V${f(ys)}A${f(halfW)} ${f(halfW)} 0 0 1 ${f(x0)} ${f(ys)}`
    + `L${f(fl.p1[0])} ${f(fl.p1[1])}A${f(rs)} ${f(rs)} 0 0 1 ${f(fl.p2[0])} ${f(fl.p2[1])}`
    + `L${f(fa.p1[0])} ${f(fa.p1[1])}A${f(ra)} ${f(ra)} 0 0 1 ${f(fa.p2[0])} ${f(fa.p2[1])}Z`;
}

// Escudo de casa en la caja (x0, top, alto h). Proporción 5:6. Devuelve silueta, contorno interior (perfil) y centroide.
function crest(x0, top, h) {
  const s = h / 93, w = h * 5 / 6, cx = x0 + w / 2, th = PITCH * Math.PI / 180;
  const o = { cx, apexY: top, halfW: w / 2, shY: top + Math.tan(th) * w / 2, ys: top + h - w / 2, ra: 7 * s, rs: 8 * s };
  const t = RING * s;
  const iApex = top + t / Math.cos(th), iHalf = w / 2 - t;
  const i = { cx, apexY: iApex, halfW: iHalf, shY: iApex + Math.tan(th) * iHalf, ys: o.ys, ra: 2 * s, rs: 2.5 * s };
  // centroide numérico de la silueta
  let A = 0, M = 0;
  for (let y = top; y <= top + h; y += h / 4000) {
    let half;
    if (y < o.shY) half = (y - top) / (o.shY - top) * w / 2;
    else if (y <= o.ys) half = w / 2;
    else half = Math.sqrt(Math.max(0, (w / 2) ** 2 - (y - o.ys) ** 2));
    A += half; M += half * y;
  }
  return { d: crestPath(o), inner: crestPath(i), x0, x1: x0 + w, top, bottom: top + h, w, h, cx, cy: M / A, s, yS: o.shY };
}

// I mayúscula con remates (para que nunca se lea «l»). Tallo = grosor del palo de la I de Rubik.
function serifI(x, base, cap, sw, sfw, st, ro, ri) {
  const cx = x + sfw / 2, s0 = cx - sw / 2, s1 = cx + sw / 2, top = base - cap, bot = base, xl = x, xr = x + sfw;
  const pts = [[xl, top], [xr, top], [xr, top + st], [s1, top + st], [s1, bot - st], [xr, bot - st], [xr, bot], [xl, bot], [xl, bot - st], [s0, bot - st], [s0, top + st], [xl, top + st]];
  return roundedPoly(pts, [ro, ro, ro, ri, ri, ro, ro, ro, ro, ri, ri, ro]);
}

// ---------- texto (Rubik en contornos) ----------
function outline(text, x = 0, weight = WEIGHT, tracking = TRACK, y = 0) {
  return JSON.parse(execFileSync('node', [path.join(TOOLS, 'outline.mjs'), '--font', 'rubik', '--weight', String(weight), '--size', '100',
    '--text', text, '--tracking', String(tracking), '--x', String(x), '--y', String(y)], { encoding: 'utf8' }));
}

// «DirectorIA» con la tinta de la D empezando en xInk y la línea de base en y = base.
// «Director» e «IA» van en trazos separados para colorearlos.
function wordmark(xInk, base = 0) {
  const probe = outline('Director', 0);
  const dir = outline('Director', xInk - probe.bbox.x1, WEIGHT, TRACK, base);
  const rInk = dir.bbox.x2;                              // borde derecho de la «r»
  const Io = outline('I', 0, WEIGHT, 0);
  const sw = Io.bbox.x2 - Io.bbox.x1;                    // palo de la I de Rubik (18,5 en 700)
  const cap = dir.capHeight;
  const sfw = 41 * (sw / 18.5), st = 12.5 * (sw / 18.5); // remates: 41 de ancho, 12,5 de grueso
  const xI = rInk + 9.5;                                 // aire r→I algo mayor: separa «Director» de «IA»
  const iPath = serifI(xI, base, cap, sw, sfw, st, 2.5, 3);
  const A0 = outline('A', 0);
  const A = outline('A', xI + sfw + 5.5 - A0.bbox.x1, WEIGHT, TRACK, base);
  return { director: dir.glyphs.map(g => g.d).join(''), ia: iPath + A.glyphs[0].d, x2: A.bbox.x2, top: Math.min(dir.bbox.y1, base - cap), bottom: Math.max(dir.bbox.y2, base), cap, stem: sw };
}

const svg = (vb, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb.map(f).join(' ')}">${body}</svg>\n`;
const positive = (cr, r) => `<path fill="${C.pizarra}" d="${cr.d}"/><circle cx="${f(cr.cx)}" cy="${f(cr.cy)}" r="${f(r)}" fill="${C.chispa}"/>`;
// Negativo: el mismo escudo (interior de pizarra) perfilado en tiza; la chispa sigue sobre pizarra.
const negative = (cr, r) => `<path fill="${C.pizarra}" d="${cr.inner}"/><path fill="${C.tiza}" fill-rule="evenodd" d="${cr.d}${cr.inner}"/><circle cx="${f(cr.cx)}" cy="${f(cr.cy)}" r="${f(r)}" fill="${C.chispa}"/>`;

// ---------- isotipos (caja 100 × 100) ----------
const iso = crest(50 - (93 * 5 / 6) / 2, 3.5, 93);
fs.writeFileSync(path.join(OUT, `isotipo${TAG}.svg`), svg([0, 0, 100, 100], positive(iso, DOT)));
fs.writeFileSync(path.join(OUT, `isotipo-negativo${TAG}.svg`), svg([0, 0, 100, 100], negative(iso, DOT)));

// ---------- logotipo horizontal (cuerpo de letra 100) ----------
const capH = outline('D', 0).capHeight;
const centroidOffset = iso.cy - iso.top;   // vértice → centroide, en la caja de 93
const rise = iso.yS - iso.top;             // altura del tejado, en la caja de 93
// «hombros»: chispa en la mitad de la altura de mayúsculas y hombros justo en la altura de mayúsculas.
const SYM_H = SYM_ARG === 'hombros' ? 93 * (capH / 2) / (centroidOffset - rise) : +SYM_ARG;
const s = SYM_H / 93;
const m = 6;                                // margen uniforme alrededor de todo el logotipo
// El escudo es más alto que la palabra: su vértice marca el borde superior y su base el inferior.
const base = m + capH / 2 + centroidOffset * s;   // línea de base del texto, para que el viewBox empiece en 0 0
const cr = crest(m, base - capH / 2 - centroidOffset * s, SYM_H);
const GAP = GAP_ARG === 'chispa' ? 2 * DOT * s : +GAP_ARG;
const word = wordmark(cr.x1 + GAP, base);
const vb = [0, 0, word.x2 + m, Math.max(cr.bottom, word.bottom) + m];
if (word.top < cr.top) throw new Error('la palabra sobresale por arriba del escudo');
fs.writeFileSync(path.join(OUT, `logo-horizontal${TAG}.svg`), svg(vb,
  positive(cr, DOT * s) + `<path fill="${C.pizarra}" d="${word.director}"/><path fill="${IA_COLOR}" d="${word.ia}"/>`));
fs.writeFileSync(path.join(OUT, `logo-horizontal-negativo${TAG}.svg`), svg(vb,
  negative(cr, DOT * s) + `<path fill="${C.tiza}" d="${word.director}"/><path fill="${C.chispa}" d="${word.ia}"/>`));

console.log(JSON.stringify({ out: OUT, tag: TAG, weight: WEIGHT, symH: f(SYM_H), gap: f(GAP), ring: f(RING * s), stem: f(word.stem), ia: IA_LIGHT,
  baseline: f(base), crest: { top: f(cr.top), shoulders: f(cr.yS), bottom: f(cr.bottom), w: f(cr.w), cy: f(cr.cy) }, isoCy: f(iso.cy), cap: capH, viewBox: vb.map(f) }));
