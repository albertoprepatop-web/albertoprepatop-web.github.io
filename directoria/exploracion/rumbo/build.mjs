#!/usr/bin/env node
// DirectorIA · concepto «Norte» (territorio: rumbo)
// Genera isotipo.svg, isotipo-negativo.svg, logo-horizontal.svg y logo-horizontal-negativo.svg.
//
// La D del isotipo tiene por asta una aguja de brújula: la mitad norte en naranja (la chispa, la IA que
// señala) y el cuenco de la D en pizarra (la persona que decide).
//
// Requisitos: paper.js (booleanas de trazados) y la herramienta outline.mjs de la marca (texto a contornos).
//   BRANDTOOLS=<carpeta con outline.mjs>  PAPER_FROM=<carpeta con node_modules/paper>  node build.mjs
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const SCRATCH = '/tmp/claude-0/-home-user-albertoprepatop-web-github-io/db30fac1-e41f-5e34-8ec7-ae08fc5fe643/scratchpad';
const BRANDTOOLS = process.env.BRANDTOOLS || path.join(SCRATCH, 'brandtools');
const PAPER_FROM = process.env.PAPER_FROM || path.join(SCRATCH, 'rumbo-work');
const paper = createRequire(path.join(PAPER_FROM, 'x.js'))('paper');
paper.setup(new paper.Size(2000, 2000));
const { Point, Path, Segment, CompoundPath } = paper;

// ---------- Paleta (solo los hex de la marca) ----------
const C = { pizarra: '#17322C', tiza: '#F6F3EC', chispa: '#E07A3A', chispaTexto: '#B4531C' };

// ---------- Parámetros del isotipo (unidades sobre una caja de 100) ----------
export const SIM = {
  xn: 27,          // eje de la aguja
  yT: 4.5, yB: 95.5, // puntas de la aguja (rebasan casi 2 u el cuenco una vez redondeadas: compensación óptica)
  hw: 13,          // semiancho de la aguja en su centro (aguja visible de 26 × 88)
  tipR: 0.6,       // radio de las puntas
  yt: 8, yb: 92,   // alto exterior del cuenco
  xr: 88,          // lado derecho del cuenco
  tb: 17.5,        // grosor de los tramos horizontales
  tr: 19.5,        // grosor de la curva (algo mayor: compensación óptica)
  rc: 37,          // radio exterior de las esquinas del cuenco (eco de la D de Rubik)
  g: 4,            // hueco entre aguja y cuenco
  round: 2.4,      // redondeo de esquinas vivas del cuenco (como Rubik)
};
// ---------- Parámetros del logotipo ----------
export const PAL = {
  weight: 600,     // Rubik SemiBold
  serif: { e: 7, st: 10.5 }, // remates de la I: vuelo a cada lado y grosor
  gapRI: 6, gapIA: 3.5,      // espacios r–I e I–A (unidades a cuerpo 100), ajustados a ojo
  k: 1.4,          // alto del isotipo = 1,4 × altura de mayúsculas
  gap: 0.42,       // separación isotipo–palabra = 0,42 × altura de mayúsculas
};

// ---------- Geometría ----------
const pt = (x, y) => new Point(x, y);
const poly = pts => new Path({ segments: pts.map(([x, y]) => pt(x, y)), closed: true, insert: false });
const sub = (a, ...bs) => bs.reduce((acc, b) => acc.subtract(b, { insert: false }), a);

function offsetLine(p1, p2, d) {
  const dir = p2.subtract(p1).normalize();
  const n = pt(-dir.y, dir.x);
  return [p1.add(n.multiply(d)), p2.add(n.multiply(d))];
}
function lineX([p1, p2], [q1, q2]) {
  const d = (p2.x - p1.x) * (q2.y - q1.y) - (p2.y - p1.y) * (q2.x - q1.x);
  const t = ((q1.x - p1.x) * (q2.y - q1.y) - (q1.y - p1.y) * (q2.x - q1.x)) / d;
  return p1.add(p2.subtract(p1).multiply(t));
}
function extend([p1, p2], k = 1000) {
  const dir = p2.subtract(p1).normalize();
  return [p1.subtract(dir.multiply(k)), p2.add(dir.multiply(k))];
}
// Polígono con radio por vértice (0 = esquina viva); arcos aproximados con cúbicas
function roundPoly(pts, rs) {
  const n = pts.length;
  const p = new Path({ insert: false, closed: true });
  for (let i = 0; i < n; i++) {
    const V = pt(...pts[i]), Vp = pt(...pts[(i - 1 + n) % n]), Vn = pt(...pts[(i + 1) % n]);
    const r = Array.isArray(rs) ? rs[i] : rs;
    if (!r) { p.add(new Segment(V)); continue; }
    const u1 = Vp.subtract(V).normalize(), u2 = Vn.subtract(V).normalize();
    const ang = Math.acos(Math.max(-1, Math.min(1, u1.dot(u2))));
    let t = r / Math.tan(ang / 2);
    t = Math.min(t, Vp.getDistance(V) * 0.45, Vn.getDistance(V) * 0.45);
    const A = V.add(u1.multiply(t)), B = V.add(u2.multiply(t));
    const rr = t * Math.tan(ang / 2), h = (4 / 3) * Math.tan((Math.PI - ang) / 4) * rr;
    p.add(new Segment(A, null, u1.multiply(-h)));
    p.add(new Segment(B, u2.multiply(-h), null));
  }
  return p;
}
// Redondea las esquinas entre tramos rectos de un trazado ya construido
function roundCorners(item, r) {
  const paths = item.children ? item.children : [item];
  const out = paths.map(p => {
    const segs = p.segments, n = segs.length;
    const np = new Path({ insert: false, closed: p.closed });
    for (let i = 0; i < n; i++) {
      const s = segs[i], prev = segs[(i - 1 + n) % n], next = segs[(i + 1) % n];
      const straight = s.handleIn.isZero() && prev.handleOut.isZero() && s.handleOut.isZero() && next.handleIn.isZero();
      if (!straight) { np.add(new Segment(s.point, s.handleIn, s.handleOut)); continue; }
      const V = s.point, u1 = prev.point.subtract(V).normalize(), u2 = next.point.subtract(V).normalize();
      const ang = Math.acos(Math.max(-1, Math.min(1, u1.dot(u2))));
      if (ang > Math.PI * 0.9) { np.add(new Segment(V)); continue; }
      let t = r / Math.tan(ang / 2);
      t = Math.min(t, prev.point.getDistance(V) * 0.45, next.point.getDistance(V) * 0.45);
      const A = V.add(u1.multiply(t)), B = V.add(u2.multiply(t));
      const rr = t * Math.tan(ang / 2), h = (4 / 3) * Math.tan((Math.PI - ang) / 4) * rr;
      np.add(new Segment(A, null, u1.multiply(-h)));
      np.add(new Segment(B, u2.multiply(-h), null));
    }
    return np;
  });
  return out.length === 1 ? out[0] : new CompoundPath({ children: out, insert: false });
}
// Rectángulo con las esquinas derechas redondeadas
function rightRounded(x, y, w, h, rc) {
  rc = Math.min(rc, h / 2, w);
  const k = 0.5523 * rc;
  const p = new Path({ insert: false, closed: true });
  p.add(new Segment(pt(x, y)));
  p.add(new Segment(pt(x + w - rc, y), null, pt(k, 0)));
  p.add(new Segment(pt(x + w, y + rc), pt(0, -k), null));
  p.add(new Segment(pt(x + w, y + h - rc), null, pt(0, k)));
  p.add(new Segment(pt(x + w - rc, y + h), pt(k, 0), null));
  p.add(new Segment(pt(x, y + h)));
  return p;
}

// ---------- Isotipo: D con asta de aguja ----------
export function isotipo(p = SIM) {
  const A = pt(p.xn, p.yT), B = pt(p.xn, p.yB), M = pt(p.xn, (p.yT + p.yB) / 2);
  const L = pt(p.xn - p.hw, M.y), R = pt(p.xn + p.hw, M.y);
  // zona que se reserva a la aguja: todo lo que queda a la izquierda de sus bordes derechos + hueco g
  const e1 = offsetLine(A, R, -p.g), e2 = offsetLine(R, B, -p.g);
  const fix = (e, a, b) => (e[0].x + e[1].x > a.x + b.x ? e : offsetLine(a, b, p.g));
  const f1 = fix(e1, A, R), f2 = fix(e2, R, B);
  const mid = lineX(f1, f2), X1 = extend(f1, 400), X2 = extend(f2, 400);
  const reserva = poly([[-500, -500], [X1[0].x, X1[0].y], [mid.x, mid.y], [X2[1].x, X2[1].y], [-500, 600]]);
  const outer = rightRounded(-50, p.yt, p.xr + 50, p.yb - p.yt, p.rc);
  const inner = rightRounded(-50, p.yt + p.tb, p.xr - p.tr + 50, p.yb - p.yt - 2 * p.tb, Math.max(p.rc - p.tr, 2));
  const cuenco = roundCorners(sub(outer, inner, reserva), p.round);
  const norte = roundPoly([[A.x, A.y], [R.x, R.y], [L.x, L.y]], [p.tipR, 0, 0]);
  const sur = roundPoly([[L.x, L.y], [R.x, R.y], [B.x, B.y]], [0, 0, p.tipR]);
  return { cuenco, norte, sur };
}

// ---------- Palabra: Rubik con la I de «IA» con remates ----------
function outline(text, weight, size = 100) {
  const out = execFileSync('node', [path.join(BRANDTOOLS, 'outline.mjs'), '--font', 'rubik', '--weight', String(weight), '--size', String(size), '--text', text], { encoding: 'utf8' });
  return JSON.parse(out);
}
const fromD = d => new CompoundPath({ pathData: d, insert: false });

function serifI(x, cap, sw, st, e, r) {
  const L = x, R = x + sw + 2 * e, sL = x + e, sR = x + e + sw, top = -cap, bot = 0;
  const pts = [[L, top], [R, top], [R, top + st], [sR, top + st], [sR, bot - st], [R, bot - st],
    [R, bot], [L, bot], [L, bot - st], [sL, bot - st], [sL, top + st], [L, top + st]];
  const rs = [r, r, r * 0.6, 0.8, 0.8, r * 0.6, r, r, r * 0.6, 0.8, 0.8, r * 0.6];
  return roundPoly(pts, rs);
}

export function palabra(o = PAL) {
  const j = outline('DirectorIA', o.weight);
  const g = j.glyphs;
  const director = fromD(g.slice(0, 8).map(x => x.d).join(' '));
  const iOrig = fromD(g[8].d).bounds;
  const rEnd = fromD(g[7].d).bounds.right;
  const I = serifI(rEnd + o.gapRI, j.capHeight, iOrig.width, o.serif.st, o.serif.e, 2.5);
  const A = fromD(g[9].d);
  A.translate(pt(I.bounds.right + o.gapIA - A.bounds.left, 0));
  return { director, I, A, cap: j.capHeight };
}

// ---------- Salida SVG ----------
const r2 = v => +v.toFixed(2);
const dOf = items => items.map(it => it.getPathData(null, 2)).join('');
function svg(vb, layers, label = 'DirectorIA') {
  const body = layers.map(l => `<path fill="${l.fill}" d="${dOf(l.items)}"/>`).join('\n');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb.map(r2).join(' ')}" role="img" aria-label="${label}">\n${body}\n</svg>\n`;
}
function bounds(items) {
  return items.reduce((b, it) => (b ? b.unite(it.bounds) : it.bounds.clone()), null);
}

function build() {
  // Isotipo en caja cuadrada con margen uniforme del 6 %
  const s = isotipo();
  const b = bounds([s.cuenco, s.norte, s.sur]);
  const side = Math.max(b.width, b.height) * 1.12;
  const vbIso = [b.center.x - side / 2, b.center.y - side / 2, side, side];
  // Regla de color: sobre fondo claro todo el naranja es chispa-texto (contraste 4,5:1 sobre tiza);
  // sobre pizarra, chispa. Así la aguja y la «IA» siempre comparten el mismo naranja.
  fs.writeFileSync(path.join(here, 'isotipo.svg'), svg(vbIso, [
    { fill: C.pizarra, items: [s.cuenco, s.sur] }, { fill: C.chispaTexto, items: [s.norte] }]));
  fs.writeFileSync(path.join(here, 'isotipo-negativo.svg'), svg(vbIso, [
    { fill: C.tiza, items: [s.cuenco, s.sur] }, { fill: C.chispa, items: [s.norte] }]));

  // Logotipo horizontal: isotipo centrado en la altura de mayúsculas
  const w = palabra();
  const H = PAL.k * w.cap, sc = H / b.height;
  const sym = [s.cuenco, s.norte, s.sur].map(it => {
    const c = it.clone({ insert: false });
    c.translate(pt(-b.left, -b.center.y));
    c.scale(sc, pt(0, 0));
    c.translate(pt(w.director.bounds.left - PAL.gap * w.cap - b.width * sc, -w.cap / 2));
    return c;
  });
  const [cuenco, norte, sur] = sym;
  const all = bounds([cuenco, norte, sur, w.director, w.I, w.A]);
  const m = 0.12 * w.cap; // margen uniforme
  const vbLogo = [all.left - m, all.top - m, all.width + 2 * m, all.height + 2 * m];
  fs.writeFileSync(path.join(here, 'logo-horizontal.svg'), svg(vbLogo, [
    { fill: C.pizarra, items: [cuenco, sur, w.director] }, { fill: C.chispaTexto, items: [norte, w.I, w.A] }]));
  fs.writeFileSync(path.join(here, 'logo-horizontal-negativo.svg'), svg(vbLogo, [
    { fill: C.tiza, items: [cuenco, sur, w.director] }, { fill: C.chispa, items: [norte, w.I, w.A] }]));
  console.log('OK', { vbIso: vbIso.map(r2), vbLogo: vbLogo.map(r2), symbolScale: r2(sc) });
}

build();
