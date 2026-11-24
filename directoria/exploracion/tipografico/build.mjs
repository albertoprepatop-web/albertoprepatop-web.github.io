// DirectorIA · concepto «tipográfico» — genera los SVG finales (todo en trazos, sin <text>).
//   node build.mjs  → isotipo.svg, isotipo-negativo.svg, logo-horizontal.svg, logo-horizontal-negativo.svg
//   Necesita brandtools/outline.mjs (ruta en TOOLS) para pasar Rubik a contornos.
//   Los scripts de bocetos/ importan estas funciones para las rondas de comparación.
//
// Construcción:
//   · Logotipo: «Director» en Rubik 600 (contornos de la fuente) + «IA» con una I dibujada a mano:
//     asta del mismo grosor que la I de Rubik 600 (16,3) y remates con pequeña cartela (transición curva).
//   · Símbolo: dibujado en una rejilla de 32 px (u = 100/32) para que el favicon de 32 px quede nítido:
//     una ficha color pizarra, una D hueca en tiza y, dentro, la I con remates en chispa.
//     Sobre pizarra, la ficha pasa a pizarra-2 (el color de las tarjetas oscuras de la presentación).
//   · En la composición horizontal, la D del símbolo mide exactamente la altura de las mayúsculas
//     y se apoya en la misma línea base que «DirectorIA».
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const TOOLS = '/tmp/claude-0/-home-user-albertoprepatop-web-github-io/db30fac1-e41f-5e34-8ec7-ae08fc5fe643/scratchpad/brandtools';

export const C = {
  pizarra: '#17322C', pizarra2: '#21433B', pizarraLinea: '#2E5A50',
  tiza: '#F6F3EC', salvia: '#E7EEE9', papel: '#FFFDF8', linea: '#D5DED9',
  texto: '#41524D', textoSuave: '#C9DAD4',
  chispa: '#E07A3A', chispaTexto: '#B4531C', chispaSuave: '#FBE6D8',
};

const r2 = n => +n.toFixed(2);
const P = (pts) => pts.map(r2).join(' ');

// ---------- texto a contornos ----------
const cache = new Map();
export function outline(text, { font = 'rubik', weight = 600, size = 100, x = 0, y = 0 } = {}) {
  const key = [text, font, weight, size, x, y].join('|');
  if (!cache.has(key)) {
    const out = execFileSync('node', [`${TOOLS}/outline.mjs`, '--font', font, '--weight', String(weight), '--size', String(size),
      '--text', text, '--x', String(x), '--y', String(y)], { encoding: 'utf8' });
    cache.set(key, JSON.parse(out));
  }
  return cache.get(key);
}

// ---------- geometría ----------
// Polígono con esquinas redondeadas (cuadráticas con el control en el vértice, como las esquinas de Rubik).
export function roundPoly(pts, radii) {
  const n = pts.length;
  const seg = pts.map((p, i) => {
    const a = pts[(i - 1 + n) % n], b = pts[(i + 1) % n], r = radii[i] || 0;
    if (!r) return { p, A: p, B: p, c: false };
    const da = Math.hypot(a[0] - p[0], a[1] - p[1]), db = Math.hypot(b[0] - p[0], b[1] - p[1]);
    const ra = Math.min(r, da / 2), rb = Math.min(r, db / 2);
    return {
      p, c: true,
      A: [p[0] + (a[0] - p[0]) / da * ra, p[1] + (a[1] - p[1]) / da * ra],
      B: [p[0] + (b[0] - p[0]) / db * rb, p[1] + (b[1] - p[1]) / db * rb],
    };
  });
  let d = `M${P(seg[0].B)}`;
  for (let k = 1; k <= n; k++) {
    const s = seg[k % n];
    d += `L${P(s.A)}`;
    if (s.c) d += `Q${P(s.p)} ${P(s.B)}`;
  }
  return d + 'Z';
}

// La «I» con remates. x = borde izquierdo de los remates; base = línea base; H = altura;
// S = asta; o = vuelo del remate a cada lado; t = grosor del remate; r = esquina exterior; rIn = cartela.
export function serifI({ x, base, H, S, o, t, r, rIn }) {
  const xl = x, xs = x + o, xe = xs + S, xr = xe + o, top = base - H;
  const pts = [[xl, top], [xr, top], [xr, top + t], [xe, top + t], [xe, base - t], [xr, base - t],
    [xr, base], [xl, base], [xl, base - t], [xs, base - t], [xs, top + t], [xl, top + t]];
  return { d: roundPoly(pts, [r, r, r, rIn, rIn, r, r, r, r, rIn, rIn, r]), width: xr - xl };
}

// D hueca con esquinas derechas de radio Rr (Rr = H/2 → panza semicircular). Contornos concéntricos.
export function hollowD({ left, top, W, H, ss, sa, sr, rl, Rr }) {
  Rr = Math.min(Rr ?? H / 2, H / 2);
  const right = left + W, bot = top + H, cx = right - Rr, cyT = top + Rr, cyB = bot - Rr;
  const rx = Rr - sr, ry = Rr - sa;
  const outer = `M${P([left + rl, top])}H${r2(cx)}A${r2(Rr)} ${r2(Rr)} 0 0 1 ${P([right, cyT])}` + (cyB > cyT ? `V${r2(cyB)}` : '') +
    `A${r2(Rr)} ${r2(Rr)} 0 0 1 ${P([cx, bot])}H${r2(left + rl)}Q${P([left, bot])} ${P([left, bot - rl])}V${r2(top + rl)}` +
    `Q${P([left, top])} ${P([left + rl, top])}Z`;
  const inner = `M${P([left + ss, top + sa])}V${r2(bot - sa)}H${r2(cx)}A${r2(rx)} ${r2(ry)} 0 0 0 ${P([right - sr, cyB])}` +
    (cyB > cyT ? `V${r2(cyT)}` : '') + `A${r2(rx)} ${r2(ry)} 0 0 0 ${P([cx, top + sa])}Z`;
  return outer + inner;
}

export function rrect(x, y, w, h, r) {
  return `M${P([x + r, y])}H${r2(x + w - r)}A${r2(r)} ${r2(r)} 0 0 1 ${P([x + w, y + r])}V${r2(y + h - r)}` +
    `A${r2(r)} ${r2(r)} 0 0 1 ${P([x + w - r, y + h])}H${r2(x + r)}A${r2(r)} ${r2(r)} 0 0 1 ${P([x, y + h - r])}V${r2(y + r)}` +
    `A${r2(r)} ${r2(r)} 0 0 1 ${P([x + r, y])}Z`;
}

// ---------- símbolo (caja 100 x 100; rejilla de 32 px) ----------
const u = 100 / 32;
export const SYM = {
  tileR: 7 * u,
  // D de trazo uniforme (4 px a 32 px), esquinas derechas de radio 10 px como la D de Rubik; ocupa el 75 % de la ficha.
  D: { left: 6 * u, top: 4 * u, W: 22 * u, H: 24 * u, ss: 4 * u, sa: 4 * u, sr: 4 * u, rl: 0.6 * u, Rr: 10 * u },
  // I con remates de 12 px de alto; todos sus bordes rectos caen en píxel entero a 16 y 32 px.
  I: { x: 12 * u, base: 22 * u, H: 12 * u, S: 4 * u, o: 2 * u, t: 2 * u, r: 0.4 * u, rIn: 0.9 * u },
};
// Devuelve los trazos del símbolo trasladados y escalados (sin <g transform>, coordenadas horneadas).
export function symbolPaths({ x = 0, y = 0, s = 1, tile = C.pizarra, dCol = C.tiza, iCol = C.chispa, withTile = true, D = SYM.D, I = SYM.I } = {}) {
  const sc = v => v * s;
  const Dd = hollowD({ left: x + sc(D.left), top: y + sc(D.top), W: sc(D.W), H: sc(D.H), ss: sc(D.ss), sa: sc(D.sa), sr: sc(D.sr), rl: sc(D.rl), Rr: D.Rr == null ? undefined : sc(D.Rr) });
  const Id = serifI({ x: x + sc(I.x), base: y + sc(I.base), H: sc(I.H), S: sc(I.S), o: sc(I.o), t: sc(I.t), r: sc(I.r), rIn: sc(I.rIn) }).d;
  const parts = [];
  if (withTile) parts.push(`<path fill="${tile}" d="${rrect(x, y, sc(100), sc(100), sc(SYM.tileR))}"/>`);
  parts.push(`<path fill="${dCol}" fill-rule="evenodd" d="${Dd}"/>`);
  parts.push(`<path fill="${iCol}" d="${Id}"/>`);
  return parts.join('\n');
}

// ---------- logotipo ----------
export const WORD = { weight: 600, S: 16.3, o: 10, t: 11, r: 2.5, rIn: 5, gapL: 5, gapR: 6.5 };
export function wordmark({ dir = C.pizarra, ia = C.chispa, W = WORD } = {}) {
  const D = outline('Director', { weight: W.weight });
  const ix = D.bbox.x2 + W.gapL;                 // la tinta de la «r» acaba en su brazo
  const I = serifI({ x: ix, base: 0, H: 70, S: W.S, o: W.o, t: W.t, r: W.r, rIn: W.rIn });
  const a0 = outline('A', { weight: W.weight });
  const A = outline('A', { weight: W.weight, x: r2(ix + I.width + W.gapR - a0.bbox.x1) });
  return {
    body: `<path fill="${dir}" d="${D.d}"/>\n<path fill="${ia}" d="${I.d}${A.d}"/>`,
    x1: D.bbox.x1, x2: A.bbox.x2, top: -70, bot: 0,
  };
}

// Composición horizontal: la D del símbolo = altura de mayúsculas (70) y misma línea base.
export const LOCK = { gap: 25, margin: 5 };
export function horizontal({ dir, ia, tile, dCol, iCol, withTile = true, gap = LOCK.gap, margin = LOCK.margin, D = SYM.D, I = SYM.I } = {}) {
  const w = wordmark({ dir, ia });
  const symH = 70 / (D.H / 100);                 // la D del símbolo mide 70 = altura de mayúsculas
  const s = symH / 100;
  const y = -35 - symH / 2;                      // centrado en la banda de mayúsculas
  let x = w.x1 - gap - symH;
  let x0 = x, y0 = y, y1 = y + symH;
  if (!withTile) {
    // sin ficha: el borde visible es el de la D; se conserva la misma distancia óptica a la palabra
    x = w.x1 - gap - (D.left + D.W) * s;
    x0 = x + D.left * s; y0 = y + D.top * s; y1 = y0 + D.H * s;
  }
  const sym = symbolPaths({ x, y, s, tile, dCol, iCol, withTile, D, I });
  const top = Math.min(y0, w.top) - margin, bot = Math.max(y1, w.bot) + margin;
  const left = x0 - margin, right = w.x2 + margin;
  return svg([left, top, right - left, bot - top], sym + '\n' + w.body);
}

export function svg(vb, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb.map(r2).join(' ')}">\n${body}\n</svg>\n`;
}

// Isotipo sin ficha, en caja cuadrada ajustada a la D con un margen pequeño e igual.
export function isoSinFicha({ dCol = C.tiza, iCol = C.chispa, margin = 1.5 * u } = {}) {
  const D = SYM.D;
  const side = Math.max(D.W, D.H) + 2 * margin;
  const cx = D.left + D.W / 2, cy = D.top + D.H / 2;
  return svg([cx - side / 2, cy - side / 2, side, side], symbolPaths({ withTile: false, dCol, iCol }));
}

// ---------- salida ----------
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const w = (f, s) => fs.writeFileSync(path.join(here, f), s);
  // Sobre fondo claro la ficha es pizarra; sobre pizarra, la ficha pasa a pizarra-2 (el color de las
  // tarjetas oscuras de la presentación): el símbolo conserva su forma y no se lee «D DirectorIA».
  w('isotipo.svg', svg([0, 0, 100, 100], symbolPaths()));
  w('isotipo-negativo.svg', svg([0, 0, 100, 100], symbolPaths({ tile: C.pizarra2 })));
  w('logo-horizontal.svg', horizontal({}));
  w('logo-horizontal-negativo.svg', horizontal({ dir: C.tiza, ia: C.chispa, tile: C.pizarra2 }));
  console.log('SVG finales escritos');
}
