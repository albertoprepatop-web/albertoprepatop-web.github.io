// Concepto «pizarra» para DirectorIA: genera el isotipo y el logotipo horizontal (positivo y negativo).
// Todo el texto va convertido a trazos con outline.mjs; solo se usan los colores de la marca.
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { C, P, add, sub, mul, norm, tick, circle, squircle, roundPoly, outline, transformPath, svgDoc, pathEl, write, n2 } from './lib.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));

// ---------------- parámetros ----------------
export const base = {
  // símbolo, en una baldosa de 100 × 100
  tileR: 29,                  // longitud de la curva de esquina del «squircle»
  vertex: [47, 66],           // vértice del visto
  short: { len: 18, ang: 48 },// trazo corto: longitud y ángulo (grados bajo la horizontal, hacia el vértice)
  long: { len: 45, ang: 49 }, // trazo largo: longitud y ángulo (grados sobre la horizontal)
  radii: [7.6, 8.6, 7.0],     // medio grosor en arranque, vértice y final
  dotR: 7.8, dotGap: 4.2,     // la chispa y su separación del arranque
  optical: [0, 0],            // corrección óptica del grupo visto + chispa
  // logotipo
  weight: 700, tracking: -0.005, size: 100,
  iStyle: 'serif',            // 'serif' = I con remates; 'plain' = I de Rubik
  serifW: 2.05, serifH: 0.7,  // ancho total del remate y grosor, en múltiplos del asta
  iaLight: C.chispaTexto, iaDark: C.chispa,
  tileScale: 1.42,            // alto de la baldosa / altura de mayúsculas
  tileDrop: 0,                // desplaza la baldosa hacia abajo (fracción de la altura de mayúsculas)
  gap: 0.34,                  // separación símbolo–texto / alto de la baldosa
  negTile: C.pizarra2,        // baldosa en negativo (null = sin baldosa: el fondo es la pizarra)
};

const rad = d => d * Math.PI / 180;

// ---------------- símbolo ----------------
export function symbolParts(o = base) {
  const V = P(...o.vertex);
  const p0 = add(V, P(-o.short.len * Math.cos(rad(o.short.ang)), -o.short.len * Math.sin(rad(o.short.ang))));
  const p2 = add(V, P(o.long.len * Math.cos(rad(o.long.ang)), -o.long.len * Math.sin(rad(o.long.ang))));
  const [r0, r1, r2] = o.radii;
  const u = norm(sub(V, p0));
  const dc = add(p0, mul(u, -(r0 + o.dotGap + o.dotR)));
  // centra el grupo (visto + chispa) en la baldosa y aplica la corrección óptica
  const circles = [[p0, r0], [V, r1], [p2, r2], [dc, o.dotR]];
  const x1 = Math.min(...circles.map(([c, r]) => c.x - r)), x2 = Math.max(...circles.map(([c, r]) => c.x + r));
  const y1 = Math.min(...circles.map(([c, r]) => c.y - r)), y2 = Math.max(...circles.map(([c, r]) => c.y + r));
  const sh = P(50 - (x1 + x2) / 2 + o.optical[0], 50 - (y1 + y2) / 2 + o.optical[1]);
  const T = q => add(q, sh);
  return {
    tile: squircle(0, 0, 100, 100, o.tileR),
    tick: tick([T(p0), T(V), T(p2)], [r0, r1, r2]),
    dot: circle(T(dc).x, T(dc).y, o.dotR),
    bbox: { x1: x1 + sh.x, y1: y1 + sh.y, x2: x2 + sh.x, y2: y2 + sh.y },
  };
}

// cuerpo del símbolo (en coordenadas 0–100) según el fondo
export function symbolBody(mode, o = base) {
  const s = symbolParts(o);
  if (mode === 'pos') return pathEl(s.tile, C.pizarra) + pathEl(s.tick, C.tiza) + pathEl(s.dot, C.chispa);
  if (mode === 'neg') return (o.negTile ? pathEl(s.tile, o.negTile) : '') + pathEl(s.tick, C.tiza) + pathEl(s.dot, C.chispa);
  if (mode === 'mono') return `<path fill="${C.pizarra}" fill-rule="evenodd" d="${s.tile}${s.tick}${s.dot}"/>`;
  if (mode === 'monoNeg') return `<path fill="${C.tiza}" fill-rule="evenodd" d="${s.tile}${s.tick}${s.dot}"/>`;
  throw new Error(mode);
}

export function isotipo(mode, o = base, m = 3) {
  return svgDoc([-m, -m, 100 + 2 * m, 100 + 2 * m], symbolBody(mode, o));
}

// ---------------- I con remates (proporciones de Rubik) ----------------
export function serifI(x, stem, cap, o = base) {
  const W = stem * o.serifW, sh = stem * o.serifH;
  const xs = x + (W - stem) / 2;
  const ro = stem * 0.135, ri = stem * 0.16; // esquinas exteriores como Rubik; uniones suaves
  const pts = [
    [x, -cap], [x + W, -cap], [x + W, -cap + sh], [xs + stem, -cap + sh], [xs + stem, -sh], [x + W, -sh], [x + W, 0],
    [x, 0], [x, -sh], [xs, -sh], [xs, -cap + sh], [x, -cap + sh],
  ];
  const radii = [ro, ro, ro * 0.8, ri, ri, ro * 0.8, ro, ro, ro * 0.8, ri, ri, ro * 0.8];
  return { d: roundPoly(pts, radii), W };
}

// ---------------- palabra ----------------
export function wordmark(o = base) {
  const j = outline('DirectorIA', { weight: o.weight, size: o.size, tracking: o.tracking });
  const cap = j.capHeight;
  const g = j.glyphs;
  const director = g.slice(0, 8).map(q => q.d).join('');
  const Ig = g[8], Ag = g[9];
  // asta de la I de Rubik: lee su caja
  const nums = Ig.d.match(/-?\d*\.?\d+/g).map(Number);
  const xs = nums.filter((_, i) => i % 2 === 0);
  const ix1 = Math.min(...xs), ix2 = Math.max(...xs);
  const stem = ix2 - ix1;
  let Id, aShift = 0, right;
  if (o.iStyle === 'serif') {
    const sI = serifI(0, stem, cap, o);
    const over = (sI.W - stem) / 2;
    // la I con remates ocupa más: la separamos de la «r» y empujamos la «A»
    const lsb = ix1 - Ig.x, rsb = Ig.x + Ig.advance - ix2;
    const left = Ig.x + lsb * 0.55;          // remate algo más cerca de la «r» que el asta original
    Id = transformPath(sI.d, { tx: left, ty: 0 });
    const iRight = left + sI.W;
    aShift = (iRight + rsb * 0.62) - (Ig.x + Ig.advance);
    right = Ag.x + Ag.advance + aShift;
  } else {
    Id = Ig.d;
    right = Ag.x + Ag.advance;
  }
  const Ad = transformPath(Ag.d, { tx: aShift, ty: 0 });
  // caja real de tinta
  const bb = j.bbox;
  return { director, I: Id, A: Ad, cap, x1: bb.x1, x2: bb.x2 + aShift, y1: bb.y1, y2: bb.y2, stem };
}

// ---------------- logotipo horizontal ----------------
export function horizontal(mode, o = base) {
  const w = wordmark(o);
  const H = w.cap * o.tileScale;                 // alto de la baldosa
  const s = H / 100;
  const yTop = -w.cap / 2 - H / 2 + o.tileDrop * w.cap; // centrada en la altura de mayúsculas
  const gap = H * o.gap;
  const tx = w.x1 - gap - H;                     // la baldosa a la izquierda del texto
  const sym = `<g transform="translate(${n2(tx)} ${n2(yTop)}) scale(${n2(s * 1000) / 1000})">${symbolBody(mode === 'pos' ? 'pos' : mode === 'neg' ? 'neg' : mode, o)}</g>`;
  const fg = mode === 'pos' || mode === 'mono' ? C.pizarra : C.tiza;
  const ia = mode === 'pos' ? o.iaLight : mode === 'neg' ? o.iaDark : fg;
  const words = pathEl(w.director, fg) + pathEl(w.I + w.A, ia);
  const top = Math.min(yTop, w.y1), bottom = Math.max(yTop + H, w.y2);
  const m = (bottom - top) * 0.06;
  const vb = [tx - m, top - m, (w.x2 - tx) + 2 * m, (bottom - top) + 2 * m];
  return svgDoc(vb, sym + '\n' + words);
}

// Versión aplanada (sin <g transform>) para los archivos finales: escala los trazos del símbolo.
export function horizontalFlat(mode, o = base) {
  const w = wordmark(o);
  const H = w.cap * o.tileScale, s = H / 100;
  const yTop = -w.cap / 2 - H / 2 + o.tileDrop * w.cap;
  const gap = H * o.gap;
  const tx = w.x1 - gap - H;
  const sp = symbolParts(o);
  const X = d => transformPath(d, { sx: s, sy: s, tx, ty: yTop });
  let sym;
  if (mode === 'pos') sym = pathEl(X(sp.tile), C.pizarra) + pathEl(X(sp.tick), C.tiza) + pathEl(X(sp.dot), C.chispa);
  else if (mode === 'neg') sym = (o.negTile ? pathEl(X(sp.tile), o.negTile) : '') + pathEl(X(sp.tick), C.tiza) + pathEl(X(sp.dot), C.chispa);
  else if (mode === 'mono') sym = `<path fill="${C.pizarra}" fill-rule="evenodd" d="${X(sp.tile)}${X(sp.tick)}${X(sp.dot)}"/>`;
  else if (mode === 'monoNeg') sym = `<path fill="${C.tiza}" fill-rule="evenodd" d="${X(sp.tile)}${X(sp.tick)}${X(sp.dot)}"/>`;
  const fg = mode === 'pos' || mode === 'mono' ? C.pizarra : C.tiza;
  const ia = mode === 'pos' ? o.iaLight : mode === 'neg' ? o.iaDark : fg;
  const words = pathEl(w.director, fg) + pathEl(w.I + w.A, ia);
  // si en negativo no hay baldosa, la caja se ajusta a la tinta del visto y la chispa
  let left = tx, top = Math.min(yTop, w.y1), bottom = Math.max(yTop + H, w.y2);
  if (mode === 'neg' && !o.negTile) {
    left = tx + sp.bbox.x1 * s;
  }
  const m = (bottom - top) * 0.06;
  const vb = [left - m, top - m, (w.x2 - left) + 2 * m, (bottom - top) + 2 * m];
  return svgDoc(vb, sym + '\n' + words);
}

// ---------------- salida final ----------------
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  write(path.join(here, 'isotipo.svg'), isotipo('pos'));
  write(path.join(here, 'isotipo-negativo.svg'), isotipo('neg'));
  write(path.join(here, 'logo-horizontal.svg'), horizontalFlat('pos'));
  write(path.join(here, 'logo-horizontal-negativo.svg'), horizontalFlat('neg'));
  console.log('ok');
}
