// Utilidades compartidas para dibujar el logotipo de DirectorIA (concepto tipográfico).
// Todo se dibuja como trazos: el texto se convierte a contornos con brandtools/outline.mjs.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

export const TOOLS = '/tmp/claude-0/-home-user-albertoprepatop-web-github-io/db30fac1-e41f-5e34-8ec7-ae08fc5fe643/scratchpad/brandtools';

export const C = {
  pizarra: '#17322C', pizarra2: '#21433B', pizarraLinea: '#2E5A50',
  tiza: '#F6F3EC', salvia: '#E7EEE9', papel: '#FFFDF8', linea: '#D5DED9',
  texto: '#41524D', textoSuave: '#C9DAD4',
  chispa: '#E07A3A', chispaTexto: '#B4531C', chispaSuave: '#FBE6D8',
};

const cache = new Map();
// Contornos de un texto. Devuelve el JSON de outline.mjs (glyphs[] con d, x, advance).
export function outline(text, { font = 'rubik', weight = 700, size = 100, tracking = 0, x = 0, y = 0 } = {}) {
  const key = JSON.stringify([text, font, weight, size, tracking, x, y]);
  if (cache.has(key)) return cache.get(key);
  const out = execFileSync('node', [`${TOOLS}/outline.mjs`, '--font', font, '--weight', String(weight), '--size', String(size),
    '--text', text, '--tracking', String(tracking), '--x', String(x), '--y', String(y)], { encoding: 'utf8' });
  const j = JSON.parse(out);
  cache.set(key, j);
  return j;
}

const f = n => +n.toFixed(2);

// Polígono con esquinas redondeadas (curva cuadrática con el control en el vértice, como hace Rubik).
// pts: [[x,y],...]; r: número o array por vértice (0 = esquina viva).
export function roundPoly(pts, r) {
  const n = pts.length;
  const rad = i => (Array.isArray(r) ? r[i] : r) || 0;
  const seg = [];
  for (let i = 0; i < n; i++) {
    const p = pts[i], a = pts[(i - 1 + n) % n], b = pts[(i + 1) % n];
    const ri = rad(i);
    if (!ri) { seg.push({ p, A: p, B: p, curve: false }); continue; }
    const da = Math.hypot(a[0] - p[0], a[1] - p[1]), db = Math.hypot(b[0] - p[0], b[1] - p[1]);
    const ra = Math.min(ri, da / 2), rb = Math.min(ri, db / 2);
    const A = [p[0] + (a[0] - p[0]) / da * ra, p[1] + (a[1] - p[1]) / da * ra];
    const B = [p[0] + (b[0] - p[0]) / db * rb, p[1] + (b[1] - p[1]) / db * rb];
    seg.push({ p, A, B, curve: true });
  }
  let d = `M${f(seg[0].B[0])} ${f(seg[0].B[1])}`;
  for (let k = 1; k <= n; k++) {
    const s = seg[k % n];
    d += `L${f(s.A[0])} ${f(s.A[1])}`;
    if (s.curve) d += `Q${f(s.p[0])} ${f(s.p[1])} ${f(s.B[0])} ${f(s.B[1])}`;
  }
  return d + 'Z';
}

// Rectángulo redondeado con arcos.
export function rrect(x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  return `M${f(x + r)} ${f(y)}H${f(x + w - r)}A${f(r)} ${f(r)} 0 0 1 ${f(x + w)} ${f(y + r)}V${f(y + h - r)}A${f(r)} ${f(r)} 0 0 1 ${f(x + w - r)} ${f(y + h)}H${f(x + r)}A${f(r)} ${f(r)} 0 0 1 ${f(x)} ${f(y + h - r)}V${f(y + r)}A${f(r)} ${f(r)} 0 0 1 ${f(x + r)} ${f(y)}Z`;
}

// «I» con remates (forma de viga): x = borde izquierdo de los remates; base = línea base (y);
// H = altura; S = grosor del asta; o = vuelo del remate a cada lado; t = grosor del remate.
export function serifI({ x, base = 0, H = 70, S = 18.5, o = 12, t = 14, r = 2.5, rIn = 0, oL, oR, tTop, tBot }) {
  oL = oL ?? o; oR = oR ?? o; tTop = tTop ?? t; tBot = tBot ?? t;
  const xl = x, xs = x + oL, xe = xs + S, xr = xe + oR;
  const top = base - H;
  const pts = [
    [xl, top], [xr, top], [xr, top + tTop], [xe, top + tTop], [xe, base - tBot], [xr, base - tBot],
    [xr, base], [xl, base], [xl, base - tBot], [xs, base - tBot], [xs, top + tTop], [xl, top + tTop],
  ];
  const rr = [r, r, r, rIn, rIn, r, r, r, r, rIn, rIn, r];
  return { d: roundPoly(pts, rr), width: xr - xl, stemX: xs, stemEnd: xe };
}

export function svgDoc(vb, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb.map(f).join(' ')}">\n${body}\n</svg>\n`;
}

export const path = (d, fill) => `<path fill="${fill}" d="${d}"/>`;

export function render(svgFile, pngFile, { width = 1200, bg, pad = 0 } = {}) {
  const args = [`${TOOLS}/render.mjs`, svgFile, pngFile, '--width', String(width), '--pad', String(pad)];
  if (bg) args.push('--bg', bg);
  execFileSync('node', args, { encoding: 'utf8' });
}

export function sheet(out, items, { cols = 2, cell = 700, bg = '#ffffff' } = {}) {
  const args = [`${TOOLS}/render.mjs`, '--sheet', out, '--cols', String(cols), '--cell', String(cell), '--bg', bg];
  for (const it of items) args.push('--label', it.label, it.file);
  execFileSync('node', args, { encoding: 'utf8' });
}

export const write = (file, s) => fs.writeFileSync(file, s);
