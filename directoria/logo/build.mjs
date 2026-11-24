#!/usr/bin/env node
// DirectorIA · sistema de logotipo definitivo (concepto «Norte», elegido por el jurado)
//
// Genera en esta carpeta todos los SVG del sistema a partir de los parámetros de abajo:
//   isotipo(-negativo|-mono-pizarra|-mono-tiza).svg
//   logo-horizontal(-negativo|-mono-pizarra|-mono-tiza).svg
//   logo-vertical(-negativo).svg · logo-eslogan(-negativo).svg
//   logotipo(-negativo|-mono-pizarra|-mono-tiza).svg  (solo la palabra)
//   favicon.svg (dibujado a píxel) · app-icon.svg (512 × 512)
//
// Todo va en trazos (sin <text>), con colores planos de la paleta y viewBox ajustado.
// La geometría del símbolo y de la palabra es la misma en todas las versiones; solo el favicon
// tiene un dibujo propio, simplificado y ajustado a la rejilla de píxeles de 16 y 32 px.
//
// Uso, en esta carpeta y con Node 18 o posterior:
//   npm ci          instala las versiones exactas de package-lock.json: paper (booleanas de trazados),
//                   opentype.js y las fuentes @fontsource/rubik y @fontsource/nunito-sans (SIL OFL)
//   npm run build   regenera los 18 SVG (es «node build.mjs»)
//   npm run png     regenera los PNG de la carpeta png/ a partir de los SVG (es «node png.mjs»)
// Con esas versiones, los SVG salen idénticos byte a byte a los del repositorio.
// outline.mjs (texto a trazos) va junto a este archivo.
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

// ---------- Dependencias: si falta algo, se dice qué y cómo arreglarlo ----------
function falla(msg) { console.error(`\nDirectorIA · logotipo: ${msg}\n`); process.exit(1); }
const INSTALAR = `Instálalas con «npm ci» en ${here}.`;
if (+process.versions.node.split('.')[0] < 18) falla(`hace falta Node 18 o posterior; este es Node ${process.versions.node}.`);
for (const f of ['outline.mjs', 'package.json']) {
  if (!fs.existsSync(path.join(here, f))) falla(`falta ${f} junto a build.mjs, en ${here}. Está en el repositorio: recupéralo con «git checkout -- ${f}».`);
}
// Comprueba que están instaladas las versiones exactas de package.json. Si falta alguna, para;
// si hay otra versión, avisa, porque los trazos podrían cambiar.
export function comprobarDependencias(nombres) {
  const fijadas = JSON.parse(fs.readFileSync(path.join(here, 'package.json'), 'utf8')).dependencies || {};
  const faltan = [], otras = [];
  for (const nombre of nombres) {
    const dir = (require.resolve.paths(nombre) || []).map(d => path.join(d, nombre)).find(d => fs.existsSync(path.join(d, 'package.json')));
    if (!dir) { faltan.push(nombre); continue; }
    const v = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8')).version;
    if (fijadas[nombre] && v !== fijadas[nombre]) otras.push(`${nombre} ${v} (package.json fija ${fijadas[nombre]})`);
  }
  if (faltan.length) falla(`faltan dependencias: ${faltan.join(', ')}. ${INSTALAR}`);
  if (otras.length) console.warn(`Aviso: hay versiones distintas de las fijadas: ${otras.join('; ')}. Los archivos pueden no salir idénticos; «npm ci» instala las fijadas.`);
}
comprobarDependencias(['paper', 'opentype.js', '@fontsource/rubik', '@fontsource/nunito-sans']);
const paper = require('paper');
const { outline: contornos } = await import('./outline.mjs');
paper.setup(new paper.Size(2000, 2000));
const { Point, Path, Segment, CompoundPath } = paper;

// ---------- Paleta (solo los hex de la marca) ----------
const C = { pizarra: '#17322C', tiza: '#F6F3EC', chispa: '#E07A3A', chispaTexto: '#B4531C' };
// Versiones de color. Regla: un solo naranja por versión, y la punta norte y la «IA» comparten siempre el mismo.
const VERSION = {
  positivo: { base: C.pizarra, acento: C.chispaTexto }, // sobre claro: chispa-texto (4,5:1 sobre tiza)
  negativo: { base: C.tiza, acento: C.chispa },         // sobre pizarra: chispa (4,6:1)
  'mono-pizarra': { base: C.pizarra, mono: true },      // una tinta oscura (fotocopia, sello, grabado)
  'mono-tiza': { base: C.tiza, mono: true },            // una tinta clara sobre fondos oscuros
};

// ---------- Isotipo (unidades sobre una caja de 100) ----------
export const SIM = {
  xn: 27,           // eje de la aguja
  hw: 13,           // semiancho de la aguja en el ecuador → a = 26 (unidad del área de respeto)
  tipR: 1.8,        // radio de las puntas: blandas como las esquinas de Rubik, sin filo de lápiz
  sobrepaso: 1.5,   // las puntas ya redondeadas rebasan 1,5 el cuenco arriba y abajo (compensación óptica)
  yt: 8, yb: 92,    // alto exterior del cuenco (84)
  xr: 88,           // lado derecho del cuenco
  tb: 17.5,         // grosor de los tramos horizontales
  tr: 19.5,         // grosor de la curva (algo mayor: compensación óptica)
  rc: 37,           // radio exterior de las esquinas del cuenco (eco de la D de Rubik)
  g: 4,             // hueco constante entre aguja y cuenco
  round: 2.4,       // redondeo de las esquinas vivas del cuenco (como Rubik)
  solape: 0.5,      // la mitad sur se mete 0,5 bajo la norte: evita la línea de fondo entre las dos mitades
};
// ---------- Palabra ----------
export const PAL = {
  weight: 600,                                      // Rubik SemiBold
  serif: { e: 7.5, st: 10.5, r: 2.5, bracket: 3.5 }, // remates de la I: vuelo, grosor, esquina y cartela (cuerpo 100)
  gapRI: 6, gapIA: 3.5,                             // espacios r–I e I–A (cuerpo 100)
};
// ---------- Composiciones (en múltiplos de la altura de mayúscula, «cap») ----------
export const LOCK = {
  horizontal: { k: 1.5, gap: 0.55 },  // símbolo = 1,5 cap (centrado en la banda de mayúsculas); separación 0,55 cap
  vertical: { k: 3.0, gap: 0.75 },    // símbolo = 3 cap, centrado ópticamente sobre la palabra; separación 0,75 cap
  eslogan: { gap: 0.5 },              // de la línea base al alto de mayúscula del eslogan: 0,5 cap; ancho = ancho de la palabra
  margen: 0.12,                       // margen del viewBox: 0,12 cap (no es el área de respeto)
};
// ---------- Favicon (rejilla de 32; 2 unidades = 1 px a 16 px) ----------
export const FAV = { xn: 8, hw: 4, tipR: 1.2, apex: 3.4, yt: 4, yb: 28, xr: 28, tb: 6, tr: 6, rc: 11, g: 2, round: 0.8, solape: 0.5, ficha: 6 };
// ---------- Icono de app (512 × 512) ----------
export const APP = { lado: 512, radio: 96, alto: 300 }; // radio = 18,75 % como la ficha del favicon; símbolo de 300 de alto

// ---------- Geometría ----------
const pt = (x, y) => new Point(x, y);
const poly = pts => new Path({ segments: pts.map(([x, y]) => pt(x, y)), closed: true, insert: false });
const sub = (a, ...bs) => bs.reduce((acc, b) => acc.subtract(b, { insert: false }), a);
function offsetLine(p1, p2, d) { const dir = p2.subtract(p1).normalize(); const n = pt(-dir.y, dir.x); return [p1.add(n.multiply(d)), p2.add(n.multiply(d))]; }
function lineX([p1, p2], [q1, q2]) {
  const d = (p2.x - p1.x) * (q2.y - q1.y) - (p2.y - p1.y) * (q2.x - q1.x);
  const t = ((q1.x - p1.x) * (q2.y - q1.y) - (q1.y - p1.y) * (q2.x - q1.x)) / d;
  return p1.add(p2.subtract(p1).multiply(t));
}
function extend([p1, p2], k = 1000) { const dir = p2.subtract(p1).normalize(); return [p1.subtract(dir.multiply(k)), p2.add(dir.multiply(k))]; }
// Polígono con radio por vértice (0 = esquina viva); arcos aproximados con cúbicas
function roundPoly(pts, rs) {
  const n = pts.length; const p = new Path({ insert: false, closed: true });
  for (let i = 0; i < n; i++) {
    const V = pt(...pts[i]), Vp = pt(...pts[(i - 1 + n) % n]), Vn = pt(...pts[(i + 1) % n]);
    const r = Array.isArray(rs) ? rs[i] : rs;
    if (!r) { p.add(new Segment(V)); continue; }
    const u1 = Vp.subtract(V).normalize(), u2 = Vn.subtract(V).normalize();
    const ang = Math.acos(Math.max(-1, Math.min(1, u1.dot(u2))));
    let t = r / Math.tan(ang / 2); t = Math.min(t, Vp.getDistance(V) * 0.45, Vn.getDistance(V) * 0.45);
    const A = V.add(u1.multiply(t)), B = V.add(u2.multiply(t));
    const rr = t * Math.tan(ang / 2), h = (4 / 3) * Math.tan((Math.PI - ang) / 4) * rr;
    p.add(new Segment(A, null, u1.multiply(-h))); p.add(new Segment(B, u2.multiply(-h), null));
  }
  return p;
}
// Redondea las esquinas entre tramos rectos de un trazado ya construido
function roundCorners(item, r) {
  const paths = item.children ? item.children : [item];
  const out = paths.map(p => {
    const segs = p.segments, n = segs.length; const np = new Path({ insert: false, closed: p.closed });
    for (let i = 0; i < n; i++) {
      const s = segs[i], prev = segs[(i - 1 + n) % n], next = segs[(i + 1) % n];
      const straight = s.handleIn.isZero() && prev.handleOut.isZero() && s.handleOut.isZero() && next.handleIn.isZero();
      if (!straight) { np.add(new Segment(s.point, s.handleIn, s.handleOut)); continue; }
      const V = s.point, u1 = prev.point.subtract(V).normalize(), u2 = next.point.subtract(V).normalize();
      const ang = Math.acos(Math.max(-1, Math.min(1, u1.dot(u2))));
      if (ang > Math.PI * 0.9) { np.add(new Segment(V)); continue; }
      let t = r / Math.tan(ang / 2); t = Math.min(t, prev.point.getDistance(V) * 0.45, next.point.getDistance(V) * 0.45);
      const A = V.add(u1.multiply(t)), B = V.add(u2.multiply(t));
      const rr = t * Math.tan(ang / 2), h = (4 / 3) * Math.tan((Math.PI - ang) / 4) * rr;
      np.add(new Segment(A, null, u1.multiply(-h))); np.add(new Segment(B, u2.multiply(-h), null));
    }
    return np;
  });
  return out.length === 1 ? out[0] : new CompoundPath({ children: out, insert: false });
}
// Rectángulo con las esquinas derechas redondeadas
function rightRounded(x, y, w, h, rc) {
  rc = Math.min(rc, h / 2, w); const k = 0.5523 * rc; const p = new Path({ insert: false, closed: true });
  p.add(new Segment(pt(x, y))); p.add(new Segment(pt(x + w - rc, y), null, pt(k, 0)));
  p.add(new Segment(pt(x + w, y + rc), pt(0, -k), null)); p.add(new Segment(pt(x + w, y + h - rc), null, pt(0, k)));
  p.add(new Segment(pt(x + w - rc, y + h), pt(k, 0), null)); p.add(new Segment(pt(x, y + h)));
  return p;
}
// Posición de la punta (ya redondeada) para una aguja simétrica respecto a cy
const apexOf = (yT, cy, hw, r) => { const a = Math.atan(hw / (cy - yT)); return yT + r / Math.sin(a) - r; };
// Busca el vértice teórico yT para que la punta redondeada quede exactamente en «objetivo»
function solveTip(objetivo, cy, hw, r) {
  let lo = objetivo - 40, hi = objetivo;
  for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; if (apexOf(m, cy, hw, r) > objetivo) hi = m; else lo = m; }
  return (lo + hi) / 2;
}

// D con asta de aguja. Devuelve el cuenco, la mitad norte, la mitad sur (con solape) y la aguja entera (para una tinta)
export function simbolo(p, apex) {
  const cy = (p.yt + p.yb) / 2;
  const yT = solveTip(apex, cy, p.hw, p.tipR), yB = 2 * cy - yT;
  const A = pt(p.xn, yT), B = pt(p.xn, yB), L = pt(p.xn - p.hw, cy), R = pt(p.xn + p.hw, cy);
  // zona reservada a la aguja: a la izquierda de sus bordes derechos desplazados el hueco g
  const e1 = offsetLine(A, R, -p.g), e2 = offsetLine(R, B, -p.g);
  const fix = (e, a, b) => (e[0].x + e[1].x > a.x + b.x ? e : offsetLine(a, b, p.g));
  const f1 = fix(e1, A, R), f2 = fix(e2, R, B);
  const mid = lineX(f1, f2), X1 = extend(f1, 400), X2 = extend(f2, 400);
  const reserva = poly([[-500, -500], [X1[0].x, X1[0].y], [mid.x, mid.y], [X2[1].x, X2[1].y], [-500, 600]]);
  const outer = rightRounded(-50, p.yt, p.xr + 50, p.yb - p.yt, p.rc);
  const inner = rightRounded(-50, p.yt + p.tb, p.xr - p.tr + 50, p.yb - p.yt - 2 * p.tb, Math.max(p.rc - p.tr, 2));
  const cuenco = roundCorners(sub(outer, inner, reserva), p.round);
  const norte = roundPoly([[A.x, A.y], [R.x, R.y], [L.x, L.y]], [p.tipR, 0, 0]);
  // la mitad sur sube «solape» por debajo de la norte siguiendo los bordes de la norte
  const ys = cy - p.solape, kx = p.hw * (ys - yT) / (cy - yT);
  const sur = roundPoly([[p.xn - kx, ys], [p.xn + kx, ys], [R.x, R.y], [B.x, B.y], [L.x, L.y]], [0, 0, 0, p.tipR, 0]);
  const surSola = roundPoly([[L.x, L.y], [R.x, R.y], [B.x, B.y]], [0, 0, p.tipR]);
  const aguja = norte.unite(surSola, { insert: false });
  return { cuenco, norte, sur, aguja, yT, yB };
}

// ---------- Texto a contornos ----------
function outline(text, weight, font = 'rubik', size = 100) {
  try { return contornos(text, { font, weight, size }); } catch (e) { falla(e.message); }
}
const fromD = d => new CompoundPath({ pathData: d, insert: false });
// I con remates y cartela: x = borde izquierdo de los remates, línea base en y = 0
function serifI(x, cap, sw, st, e, r, bracket) {
  const L = x, R = x + sw + 2 * e, sL = x + e, sR = x + e + sw, top = -cap, bot = 0;
  const pts = [[L, top], [R, top], [R, top + st], [sR, top + st], [sR, bot - st], [R, bot - st],
    [R, bot], [L, bot], [L, bot - st], [sL, bot - st], [sL, top + st], [L, top + st]];
  const rs = [r, r, r * 0.6, bracket, bracket, r * 0.6, r, r, r * 0.6, bracket, bracket, r * 0.6];
  return roundPoly(pts, rs);
}
// «DirectorIA»: Rubik 600 con la I dibujada (asta = la de la I de Rubik 600)
export function palabra(o = PAL) {
  const j = outline('DirectorIA', o.weight); const g = j.glyphs;
  const director = fromD(g.slice(0, 8).map(x => x.d).join(' '));
  const stem = fromD(g[8].d).bounds.width, rEnd = fromD(g[7].d).bounds.right;
  const I = serifI(rEnd + o.gapRI, j.capHeight, stem, o.serif.st, o.serif.e, o.serif.r, o.serif.bracket);
  const A = fromD(g[9].d); A.translate(pt(I.bounds.right + o.gapIA - A.bounds.left, 0));
  return { director, I, A, cap: j.capHeight, stem };
}
// Eslogan en Nunito Sans 600 con la misma I de remates (proporciones de la del logotipo, sobre el asta de Nunito)
export function eslogan() {
  const texto = 'Vuestra IA, dentro del colegio';
  const t = outline(texto, 600, 'nunito-sans'); const g = t.glyphs;
  const iIdx = g.findIndex(x => x.char === 'I'); const ib = fromD(g[iIdx].d).bounds;
  const k = ib.width / 16.3; // misma proporción que la I del logotipo (asta 16,3 a cuerpo 100)
  const e = PAL.serif.e * k, st = PAL.serif.st * k;
  const shift = 2 * e - 1; // los remates necesitan sitio: se abre el espacio a ambos lados (1 menos: el remate ya separa)
  const antes = fromD(g.slice(0, iIdx).map(x => x.d).join(' '));
  const I = serifI(ib.left - e + shift / 2, t.capHeight, ib.width, st, e, PAL.serif.r * k, PAL.serif.bracket * k);
  const despues = fromD(g.slice(iIdx + 1).map(x => x.d).join(' ')); despues.translate(pt(shift, 0));
  return { items: [antes, I, despues], cap: t.capHeight };
}

// ---------- Utilidades de salida ----------
const r2 = v => +v.toFixed(2);
const dOf = items => items.map(it => it.getPathData(null, 2)).join('');
function svgDoc(vb, layers, label = 'DirectorIA') {
  const body = layers.filter(l => l.items.length).map(l => `<path fill="${l.fill}" d="${dOf(l.items)}"/>`).join('\n');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb.map(r2).join(' ')}" role="img" aria-label="${label}">\n${body}\n</svg>\n`;
}
const bounds = items => items.reduce((b, it) => (b ? b.unite(it.bounds) : it.bounds.clone()), null);
const vbOf = (items, m) => { const b = bounds(items); return [b.left - m, b.top - m, b.width + 2 * m, b.height + 2 * m]; };
function place(item, sc, dx, dy, ox = 0, oy = 0) { const c = item.clone({ insert: false }); c.translate(pt(-ox, -oy)); c.scale(sc, pt(0, 0)); c.translate(pt(dx, dy)); return c; }
// Capas de una versión: con color (base + acento) o a una tinta (aguja entera)
function capas(v, s, palabraItems = [], acentoPalabra = [], extra = []) {
  if (v.mono) return [{ fill: v.base, items: [s.cuenco, s.aguja, ...palabraItems, ...acentoPalabra, ...extra] }];
  return [{ fill: v.base, items: [s.cuenco, s.sur, ...palabraItems, ...extra] }, { fill: v.acento, items: [s.norte, ...acentoPalabra] }];
}
// Centroide de superficie (para el centrado óptico)
function centroide(items) {
  let A = 0, cx = 0;
  for (const it of items) {
    const paths = it.children ? it.children : [it];
    for (const p0 of paths) {
      const p = p0.clone({ insert: false }); p.flatten(0.05);
      const s = p.segments.map(q => q.point); const n = s.length; let a = 0, x = 0;
      for (let i = 0; i < n; i++) { const P = s[i], Q = s[(i + 1) % n]; const c = P.x * Q.y - Q.x * P.y; a += c; x += (P.x + Q.x) * c; }
      A += a / 2; cx += x / 6;
    }
  }
  return cx / A;
}
const write = (f, s) => fs.writeFileSync(path.join(here, f), s);

// ---------- Construcción ----------
function build() {
  const informe = {};
  // Isotipo maestro
  const S = simbolo(SIM, SIM.yt - SIM.sobrepaso);
  const sb = bounds([S.cuenco, S.norte, S.sur]);
  // centrado óptico: el cuenco pesa más que la aguja; se corrige la mitad de la desviación del centroide
  const desvio = centroide([S.cuenco, S.aguja]) - sb.center.x; const optico = desvio / 2;
  const mIso = 4;
  for (const [nombre, v] of Object.entries(VERSION)) {
    const sfx = nombre === 'positivo' ? '' : '-' + nombre;
    write(`isotipo${sfx}.svg`, svgDoc(vbOf([S.cuenco, S.norte, S.sur], mIso), capas(v, S)));
  }
  informe.isotipo = { alto: r2(sb.height), ancho: r2(sb.width), a: 2 * SIM.hw, puntas: [r2(S.yT), r2(S.yB)], desvioCentroide: r2(desvio) };

  // Palabra
  const w = palabra(); const cap = w.cap; const wb = bounds([w.director, w.I, w.A]);
  const m = LOCK.margen * cap;
  const symAt = (k, x, cy) => {
    const sc = (k * cap) / sb.height;
    const it = {}; for (const key of ['cuenco', 'norte', 'sur', 'aguja']) it[key] = place(S[key], sc, x, cy, sb.left, sb.center.y);
    return { ...it, sc };
  };

  // Logotipo (solo la palabra)
  for (const [nombre, v] of Object.entries(VERSION)) {
    const sfx = nombre === 'positivo' ? '' : '-' + nombre;
    const layers = v.mono ? [{ fill: v.base, items: [w.director, w.I, w.A] }] : [{ fill: v.base, items: [w.director] }, { fill: v.acento, items: [w.I, w.A] }];
    write(`logotipo${sfx}.svg`, svgDoc(vbOf([w.director, w.I, w.A], m), layers));
  }
  informe.logotipo = { cap, ancho: r2(wb.width), vb: vbOf([w.director, w.I, w.A], m).map(r2) };

  // Horizontal
  const H = LOCK.horizontal; const symW = sb.width * (H.k * cap) / sb.height;
  const sh = symAt(H.k, wb.left - H.gap * cap - symW, -cap / 2);
  const allH = [sh.cuenco, sh.norte, sh.sur, w.director, w.I, w.A];
  const vbH = vbOf(allH, m);
  for (const [nombre, v] of Object.entries(VERSION)) {
    const sfx = nombre === 'positivo' ? '' : '-' + nombre;
    write(`logo-horizontal${sfx}.svg`, svgDoc(vbH, capas(v, sh, [w.director], [w.I, w.A])));
  }
  informe.horizontal = { a: r2(2 * SIM.hw * sh.sc), aEnCap: r2(2 * SIM.hw * sh.sc / cap), vb: vbH.map(r2), proporcion: r2(vbH[2] / vbH[3]) };

  // Vertical
  const Vt = LOCK.vertical; const svW = sb.width * (Vt.k * cap) / sb.height;
  const sv = symAt(Vt.k, wb.center.x - svW / 2 - optico * (Vt.k * cap) / sb.height, -cap - Vt.gap * cap - (Vt.k * cap) / 2);
  const vbV = vbOf([sv.cuenco, sv.norte, sv.sur, w.director, w.I, w.A], m);
  for (const nombre of ['positivo', 'negativo']) {
    const sfx = nombre === 'positivo' ? '' : '-' + nombre;
    write(`logo-vertical${sfx}.svg`, svgDoc(vbV, capas(VERSION[nombre], sv, [w.director], [w.I, w.A])));
  }
  informe.vertical = { a: r2(2 * SIM.hw * sv.sc), aEnCap: r2(2 * SIM.hw * sv.sc / cap), vb: vbV.map(r2), proporcion: r2(vbV[2] / vbV[3]) };

  // Con eslogan: el horizontal y, debajo de la palabra, el eslogan con el mismo ancho que «DirectorIA»
  // la V empieza en diagonal: se adelanta un poco a la izquierda para alinear ópticamente con el asta de la D;
  // el borde derecho del eslogan coincide con el de la A
  const sangria = 0.012 * wb.width;
  const es = eslogan(); const eb = bounds(es.items); const esc = (wb.width + sangria) / eb.width;
  const capE = es.cap * esc;
  const yBase = LOCK.eslogan.gap * cap + capE;
  const esItems = es.items.map(it => place(it, esc, wb.left - sangria, yBase, eb.left, 0));
  const vbE = vbOf([...allH, ...esItems], m);
  for (const nombre of ['positivo', 'negativo']) {
    const sfx = nombre === 'positivo' ? '' : '-' + nombre;
    write(`logo-eslogan${sfx}.svg`, svgDoc(vbE, capas(VERSION[nombre], sh, [w.director], [w.I, w.A], esItems), 'DirectorIA. Vuestra IA, dentro del colegio'));
  }
  informe.eslogan = { capEslogan: r2(capE), capEsloganEnCap: r2(capE / cap), cuerpoNunito: r2(100 * esc), vb: vbE.map(r2), proporcion: r2(vbE[2] / vbE[3]) };

  // Icono de app: ficha pizarra de 512 con el símbolo maestro en negativo
  {
    const sc = APP.alto / sb.height;
    const x = APP.lado / 2 - (sb.width * sc) / 2 - optico * sc, cy = APP.lado / 2;
    const it = {}; for (const key of ['cuenco', 'norte', 'sur', 'aguja']) it[key] = place(S[key], sc, x, cy, sb.left, sb.center.y);
    const ficha = new Path.Rectangle({ point: [0, 0], size: [APP.lado, APP.lado], radius: APP.radio, insert: false });
    write('app-icon.svg', svgDoc([0, 0, APP.lado, APP.lado], [{ fill: C.pizarra, items: [ficha] }, ...capas(VERSION.negativo, it)]));
    const ib = bounds([it.cuenco, it.norte, it.sur]);
    const far = Math.max(...[[ib.left, ib.top], [ib.right, ib.top], [ib.left, ib.bottom], [ib.right, ib.bottom]].map(([px, py]) => Math.hypot(px - 256, py - 256)));
    informe.app = { simbolo: [r2(ib.left), r2(ib.top), r2(ib.width), r2(ib.height)], radioMaxDesdeCentro: r2(far), zonaSeguraMaskable: 204.8 };
  }

  // Favicon: dibujo propio, ajustado a píxel (todas las aristas horizontales y verticales en píxel entero a 16 y 32 px)
  {
    const F = simbolo(FAV, FAV.apex);
    const ficha = new Path.Rectangle({ point: [0, 0], size: [32, 32], radius: FAV.ficha, insert: false });
    write('favicon.svg', svgDoc([0, 0, 32, 32], [{ fill: C.pizarra, items: [ficha] }, ...capas(VERSION.negativo, F)]));
  }
  console.log(JSON.stringify(informe, null, 1));
}

// Solo genera los archivos cuando se ejecuta directamente (así se puede importar la geometría)
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) build();
