// Concepto «pizarra» para DirectorIA: genera el isotipo y el logotipo horizontal (positivo y negativo).
// Todo el texto va convertido a trazos con outline.mjs; solo se usan los colores de la marca.
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { C, P, add, sub, mul, norm, tick, circle, squircle, rrect, roundPoly, outline, transformPath, svgDoc, pathEl, write, n2 } from './lib.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));

// ---------------- parámetros ----------------
export const base = {
  // símbolo, en una pizarra de 100 × 100
  tileShape: 'rrect',         // 'squircle' o 'rrect'
  tileR: 18,                  // radio de las esquinas de la pizarra (o curva del «squircle»)
  layout: 'start',            // 'start': la chispa marca el arranque del visto y el grupo se centra en la pizarra
                              // 'diagonal': chispa arriba-izq. y visto abajo-der. (descartada: a una tinta parece el icono de «imagen»)
  dotC: [24.4, 24.4],         // centro de la chispa (solo layout diagonal)
  vertex: [46, 66],           // vértice del visto (en 'start' el grupo se recentra)
  short: { len: 23, ang: 46 },// trazo corto: longitud y ángulo (grados bajo la horizontal, hacia el vértice)
  long: { len: 47, ang: 51 }, // trazo largo: longitud y ángulo (grados sobre la horizontal)
  radii: [8.8, 8.4, 6.0],     // medio grosor en arranque, vértice y final: arranque firme, final fino
  dotR: 8.8, dotGap: 5.0,     // la chispa y su separación del arranque del visto (en el eje del trazo corto)
  optical: [1.5, -1],         // corrección óptica: el visto pesa abajo a la izquierda
  // logotipo
  weight: 700, tracking: -0.005, size: 100,
  iStyle: 'serif',            // 'serif' = I con remates; 'plain' = I de Rubik
  serifW: 2.05, serifH: 0.7,  // ancho total del remate y grosor, en múltiplos del asta
  iaLight: C.chispaTexto, iaDark: C.chispa,
  tileScale: 1.32,            // alto de la baldosa / altura de mayúsculas
  tileDrop: 0,                // desplaza la baldosa hacia abajo (fracción de la altura de mayúsculas)
  gap: 0.32,                  // separación símbolo–texto / alto de la baldosa
  negTile: C.pizarraLinea,    // baldosa en negativo (null = sin baldosa: el fondo es la pizarra)
  negPull: 0.10,              // en negativo sin baldosa, acerca el visto al texto (fracción de la baldosa)
};

const rad = d => d * Math.PI / 180;

// ---------------- símbolo ----------------
export function symbolParts(o = base) {
  const V = P(...o.vertex);
  const p0 = add(V, P(-o.short.len * Math.cos(rad(o.short.ang)), -o.short.len * Math.sin(rad(o.short.ang))));
  const p2 = add(V, P(o.long.len * Math.cos(rad(o.long.ang)), -o.long.len * Math.sin(rad(o.long.ang))));
  const [r0, r1, r2] = o.radii;
  let dc;
  if (o.layout === 'diagonal') dc = P(...o.dotC);
  else { const u = norm(sub(V, p0)); dc = add(p0, mul(u, -(r0 + o.dotGap + o.dotR))); }
  const circles = [[p0, r0], [V, r1], [p2, r2], [dc, o.dotR]];
  const x1 = Math.min(...circles.map(([c, r]) => c.x - r)), x2 = Math.max(...circles.map(([c, r]) => c.x + r));
  const y1 = Math.min(...circles.map(([c, r]) => c.y - r)), y2 = Math.max(...circles.map(([c, r]) => c.y + r));
  // 'start': centra el grupo en la pizarra; 'diagonal': posiciones absolutas (+ corrección óptica)
  const sh = o.layout === 'diagonal' ? P(o.optical[0], o.optical[1])
    : P(50 - (x1 + x2) / 2 + o.optical[0], 50 - (y1 + y2) / 2 + o.optical[1]);
  const T = q => add(q, sh);
  return {
    tile: o.tileShape === 'rrect' ? rrect(0, 0, 100, 100, o.tileR) : squircle(0, 0, 100, 100, o.tileR),
    tick: tick([T(p0), T(V), T(p2)], [r0, r1, r2]),
    dot: circle(T(dc).x, T(dc).y, o.dotR),
    bbox: { x1: x1 + sh.x, y1: y1 + sh.y, x2: x2 + sh.x, y2: y2 + sh.y },
    pts: { p0: T(p0), V: T(V), p2: T(p2), dc: T(dc) },
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

// margen = 1/14 de la pizarra: a 16 px la pizarra ocupa 14 px exactos y sus bordes caen en píxel entero
export function isotipo(mode, o = base, m = 100 / 14) {
  const f = v => +v.toFixed(4);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${f(-m)} ${f(-m)} ${f(100 + 2 * m)} ${f(100 + 2 * m)}">\n${symbolBody(mode, o)}\n</svg>\n`;
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
    const left = Ig.x + lsb * 0.85;          // el remate respeta el aire que la «r» deja arriba
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
export const horizontal = (mode, o = base) => horizontalFlat(mode, o);

// Versión aplanada (sin <g transform>) para los archivos finales: escala los trazos del símbolo.
export function horizontalFlat(mode, o = base) {
  const w = wordmark(o);
  const H = w.cap * o.tileScale, s = H / 100;
  const yTop = -w.cap / 2 - H / 2 + o.tileDrop * w.cap;
  const gap = H * o.gap;
  const bare = mode === 'neg' && !o.negTile;     // en negativo sin baldosa, el fondo hace de pizarra
  const tx = w.x1 - gap - H + (bare ? o.negPull * H : 0);
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
  // misma altura de caja que en positivo (se pueden intercambiar); sin baldosa, se recorta a la tinta por la izquierda
  const top = Math.min(yTop, w.y1), bottom = Math.max(yTop + H, w.y2);
  const left = bare ? tx + sp.bbox.x1 * s : tx;
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
