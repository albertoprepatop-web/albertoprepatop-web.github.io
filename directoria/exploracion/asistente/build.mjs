#!/usr/bin/env node
// Genera el isotipo y el logotipo horizontal del concepto "asistente" de DirectorIA.
// Uso: node build.mjs            (escribe los SVG en esta carpeta)
//      node build.mjs --out DIR  (los escribe en otra carpeta, para pruebas)
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { C, shape, spark, svg, write, wordmark, translatePath, pathBBox, n2 } from './lib.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const oi = process.argv.indexOf('--out');
const OUT = oi > -1 ? path.resolve(process.argv[oi + 1]) : here;

// ---------------- parámetros (unidades del isotipo: el cuerpo de la D mide h de alto) ----------------
export const P = {
  wm: { weight: 600, tracking: -0.01, serifW: 0.37, serifK: 0.9, gapRI: 0.055, gapIA: 0.05 },
  // cuerpo de 72 de alto = 12 px exactos a 16 px (1 px = 6 unidades): el isotipo queda en viewBox="-18 -12 96 96"
  body: { w: 68, h: 72, rL: 3.4, foot: 14.6, rise: 12.65, tipR: 2.15, joinR: 6.8 },
  spark: { fx: 0.485, fy: 0.5, R: 17.5, k: 0.45, tipR: 1.65, inR: 1.15 },
  lock: { k: 1.45, gap: 0.38, margin: 0.14 },
  // encuadre del isotipo: 'grid' = a 16 px el cuerpo mide bodyPx y el asta cae en la columna stemPx (bordes nítidos)
  iso: { mode: 'grid', px: 16, bodyPx: 12, stemPx: 3, margin: 0.06, ox: 0.025 },
  sparkOnLight: C.chispa,   // color de la chispa cuando el bocadillo es claro (versión negativa)
};

// ---------------- isotipo: bocadillo en D, cola apoyada en la base y chispa dentro ----------------
export function symbolPaths(p = P) {
  const { w, h, rL, foot, rise, tipR, joinR } = p.body;
  const R = h / 2, bx = w - R;
  const body = shape([
    { p: [0, 0], r: rL },
    { p: [bx, 0], r: 0 },
    { p: [bx, h], r: 0, arc: { r: R, sweep: 1 } },
    { p: [-foot, h], r: tipR },
    { p: [0, h - rise], r: joinR },
  ]);
  const s = p.spark;
  const sp = spark({ cx: w * s.fx, cy: h * s.fy, R: s.R, k: s.k, tipR: s.tipR, inR: s.inR });
  return { body, spark: sp, bbox: { x1: -foot, y1: 0, x2: w, y2: h } };
}

export function isotipo(dark, p = P, mono = null) {
  const { body, spark: sp, bbox } = symbolPaths(p);
  const bw = bbox.x2 - bbox.x1, bh = bbox.y2 - bbox.y1;
  let vb;
  if (p.iso.mode === 'grid') {
    // A 16 px: el cuerpo ocupa bodyPx píxeles enteros y el asta empieza en la columna stemPx.
    const side = p.iso.px * p.body.h / p.iso.bodyPx, u = side / p.iso.px;
    vb = [-p.iso.stemPx * u, -((p.iso.px - p.iso.bodyPx) / 2) * u, side, side];
  } else {
    const side = Math.max(bw, bh) * (1 + 2 * p.iso.margin);
    // ox > 0 desplaza el símbolo a la izquierda dentro del cuadro (la cola pesa poco; centramos el cuerpo)
    const cx = (bbox.x1 + bbox.x2) / 2 + p.iso.ox * bw, cy = (bbox.y1 + bbox.y2) / 2;
    vb = [cx - side / 2, cy - side / 2, side, side];
  }
  return svg(vb, symbolMarkup(body, sp, dark, p, mono), 'DirectorIA');
}

// Bocadillo + chispa. En una sola tinta (mono = color) la chispa se calada en el bocadillo.
function symbolMarkup(body, sp, dark, p, mono) {
  if (mono) return `<path fill="${mono}" fill-rule="evenodd" d="${body}${sp}"/>`;
  const fg = dark ? C.tiza : C.pizarra;
  const acc = dark ? p.sparkOnLight : C.chispa;
  return `<path fill="${fg}" d="${body}"/><path fill="${acc}" d="${sp}"/>`;
}

export function horizontal(dark, p = P, mono = null) {
  const wm = wordmark({ size: 100, ...p.wm });
  const { body, spark: sp, bbox } = symbolPaths(p);
  const s = (p.lock.k * wm.cap) / p.body.h;
  const X = wm.bbox.x1 - p.lock.gap * wm.cap - p.body.w * s;
  const Y = -wm.cap / 2 - (p.body.h * s) / 2;
  const b = translatePath(body, X, Y, s), k = translatePath(sp, X, Y, s);
  const fg = mono || (dark ? C.tiza : C.pizarra);
  const ia = mono || C.chispa;
  const x1 = X + bbox.x1 * s, x2 = wm.bbox.x2;
  const y1 = Math.min(Y, -wm.cap), y2 = Math.max(Y + p.body.h * s, 0);
  const m = p.lock.margin * wm.cap;
  const vb = [x1 - m, y1 - m, x2 - x1 + 2 * m, y2 - y1 + 2 * m];
  return svg(vb, symbolMarkup(b, k, dark, p, mono) +
    `<path fill="${fg}" d="${wm.director}"/><path fill="${ia}" d="${wm.I}${wm.A}"/>`, 'DirectorIA');
}

export function buildAll(out = OUT, p = P, { extras = false } = {}) {
  write(path.join(out, 'isotipo.svg'), isotipo(false, p));
  write(path.join(out, 'isotipo-negativo.svg'), isotipo(true, p));
  write(path.join(out, 'logo-horizontal.svg'), horizontal(false, p));
  write(path.join(out, 'logo-horizontal-negativo.svg'), horizontal(true, p));
  if (extras) {
    // Pruebas a una tinta (la chispa queda calada): demuestran que la marca no depende del color.
    write(path.join(out, 'bocetos', 'isotipo-una-tinta.svg'), isotipo(false, p, C.pizarra));
    write(path.join(out, 'bocetos', 'logo-una-tinta.svg'), horizontal(false, p, C.pizarra));
    write(path.join(out, 'bocetos', 'logo-una-tinta-negativo.svg'), horizontal(true, p, C.tiza));
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  buildAll(OUT, P, { extras: true });
  console.log('SVG escritos en ' + OUT);
}
