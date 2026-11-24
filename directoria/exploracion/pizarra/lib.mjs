// Utilidades del concepto «pizarra»: colores de marca, texto a trazos, geometría y render.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

export const TOOLS = '/tmp/claude-0/-home-user-albertoprepatop-web-github-io/db30fac1-e41f-5e34-8ec7-ae08fc5fe643/scratchpad/brandtools';

export const C = {
  pizarra: '#17322C', pizarra2: '#21433B', pizarraLinea: '#2E5A50',
  tiza: '#F6F3EC', salvia: '#E7EEE9', papel: '#FFFDF8', linea: '#D5DED9',
  texto: '#41524D', textoSuave: '#C9DAD4',
  chispa: '#E07A3A', chispaTexto: '#B4531C', chispaSuave: '#FBE6D8',
};

// ---------- texto a trazos ----------
const cache = new Map();
export function outline(text, { font = 'rubik', weight = 700, size = 100, tracking = 0, x = 0, y = 0 } = {}) {
  const key = JSON.stringify([text, font, weight, size, tracking, x, y]);
  if (cache.has(key)) return cache.get(key);
  const out = execFileSync('node', [path.join(TOOLS, 'outline.mjs'), '--font', font, '--weight', String(weight),
    '--size', String(size), '--text', text, '--tracking', String(tracking), '--x', String(x), '--y', String(y)]);
  const j = JSON.parse(out.toString());
  cache.set(key, j);
  return j;
}

// ---------- render ----------
export function render(svgFile, pngFile, { width = 600, bg, pad = 0 } = {}) {
  const args = [path.join(TOOLS, 'render.mjs'), svgFile, pngFile, '--width', String(width), '--pad', String(pad)];
  if (bg) args.push('--bg', bg);
  execFileSync('node', args);
}
export function sheet(out, items, { cols = 4, cell = 300, bg = '#ffffff' } = {}) {
  const args = [path.join(TOOLS, 'render.mjs'), '--sheet', out, '--cols', String(cols), '--cell', String(cell), '--bg', bg];
  for (const it of items) args.push('--label', it.label, it.file);
  execFileSync('node', args);
}

// ---------- vectores ----------
export const P = (x, y) => ({ x, y });
export const add = (a, b) => P(a.x + b.x, a.y + b.y);
export const sub = (a, b) => P(a.x - b.x, a.y - b.y);
export const mul = (a, k) => P(a.x * k, a.y * k);
export const len = a => Math.hypot(a.x, a.y);
export const norm = a => { const l = len(a); return P(a.x / l, a.y / l); };
export const perp = a => P(-a.y, a.x);
export const dot = (a, b) => a.x * b.x + a.y * b.y;
const ang = a => Math.atan2(a.y, a.x);
const TAU = Math.PI * 2;
const mod = (a, m) => ((a % m) + m) % m;
export const n2 = v => +(+v).toFixed(2);
const pt = p => `${n2(p.x)} ${n2(p.y)}`;

// Arco SVG desde «from» hasta «to» alrededor de «c» (radio r) pasando por la dirección «via».
export function arcVia(c, r, from, to, via) {
  const a0 = ang(sub(from, c)), a1 = ang(sub(to, c)), am = ang(via);
  const span1 = mod(a1 - a0, TAU), offm = mod(am - a0, TAU);
  let sweep, large;
  if (offm <= span1) { sweep = 1; large = span1 > Math.PI ? 1 : 0; }
  else { sweep = 0; large = mod(a0 - a1, TAU) > Math.PI ? 1 : 0; }
  return `A${n2(r)} ${n2(r)} 0 ${large} ${sweep} ${pt(to)}`;
}

// Tangente exterior entre dos círculos, del lado s (+1 / −1).
function tangent(c1, r1, c2, r2, s) {
  const d = sub(c2, c1), L = len(d), u = mul(d, 1 / L);
  const k = (r1 - r2) / L;
  const n = add(mul(u, k), mul(perp(u), s * Math.sqrt(Math.max(0, 1 - k * k))));
  return { n, a: add(c1, mul(n, r1)), b: add(c2, mul(n, r2)) };
}
function intersect(p1, p2, p3, p4) {
  const d1 = sub(p2, p1), d2 = sub(p4, p3);
  const den = d1.x * d2.y - d1.y * d2.x;
  if (Math.abs(den) < 1e-9) return p2;
  const t = ((p3.x - p1.x) * d2.y - (p3.y - p1.y) * d2.x) / den;
  return add(p1, mul(d1, t));
}

// Trazo de dos tramos (un «visto») con extremos redondos y grosor variable en cada punto.
// pts = [P0, P1, P2], rs = [r0, r1, r2]. Devuelve un único contorno cerrado (sin solapes).
export function tick(pts, rs, { innerRound = 0 } = {}) {
  const [c0, c1, c2] = pts, [r0, r1, r2] = rs;
  const mid = mul(add(c0, c2), 0.5);
  // lado exterior = el que se aleja del punto medio de los extremos
  const tA = [tangent(c0, r0, c1, r1, 1), tangent(c0, r0, c1, r1, -1)];
  const tB = [tangent(c1, r1, c2, r2, 1), tangent(c1, r1, c2, r2, -1)];
  const outerA = dot(tA[0].n, sub(mid, c1)) < 0 ? tA[0] : tA[1];
  const innerA = outerA === tA[0] ? tA[1] : tA[0];
  const outerB = dot(tB[0].n, sub(mid, c1)) < 0 ? tB[0] : tB[1];
  const innerB = outerB === tB[0] ? tB[1] : tB[0];
  const X = intersect(innerA.a, innerA.b, innerB.a, innerB.b);
  const viaJoin = add(outerA.n, outerB.n);
  let d = `M${pt(outerA.a)}L${pt(outerA.b)}`;
  d += arcVia(c1, r1, outerA.b, outerB.a, viaJoin);
  d += `L${pt(outerB.b)}`;
  d += arcVia(c2, r2, outerB.b, innerB.b, sub(c2, c1));
  if (innerRound > 0) {
    // redondea la esquina interior con un arco de radio innerRound
    const uB = norm(sub(innerB.a, innerB.b)), uA = norm(sub(innerA.a, innerA.b));
    const half = Math.acos(Math.max(-1, Math.min(1, dot(mul(uB, -1), mul(uA, -1))))) / 2;
    const off = innerRound / Math.tan(half);
    const q1 = add(X, mul(norm(sub(innerB.b, X)), off));
    const q2 = add(X, mul(norm(sub(innerA.a, X)), off));
    d += `L${pt(q1)}Q${pt(X)} ${pt(q2)}`;
  } else {
    d += `L${pt(X)}`;
  }
  d += `L${pt(innerA.a)}`;
  d += arcVia(c0, r0, innerA.a, outerA.a, sub(c0, c1));
  return d + 'Z';
}

// Segmento con extremos redondos (cápsula), radios r1 y r2.
export function capsule(a, b, r1, r2 = r1) {
  const t1 = tangent(a, r1, b, r2, 1), t2 = tangent(a, r1, b, r2, -1);
  return `M${pt(t1.a)}L${pt(t1.b)}${arcVia(b, r2, t1.b, t2.b, sub(b, a))}L${pt(t2.a)}${arcVia(a, r1, t2.a, t1.a, sub(a, b))}Z`;
}

export function circle(cx, cy, r) {
  return `M${n2(cx - r)} ${n2(cy)}A${n2(r)} ${n2(r)} 0 1 0 ${n2(cx + r)} ${n2(cy)}A${n2(r)} ${n2(r)} 0 1 0 ${n2(cx - r)} ${n2(cy)}Z`;
}

// Rectángulo redondeado (sentido horario).
export function rrect(x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  if (r <= 0) return `M${n2(x)} ${n2(y)}H${n2(x + w)}V${n2(y + h)}H${n2(x)}Z`;
  return `M${n2(x + r)} ${n2(y)}H${n2(x + w - r)}A${n2(r)} ${n2(r)} 0 0 1 ${n2(x + w)} ${n2(y + r)}` +
    `V${n2(y + h - r)}A${n2(r)} ${n2(r)} 0 0 1 ${n2(x + w - r)} ${n2(y + h)}` +
    `H${n2(x + r)}A${n2(r)} ${n2(r)} 0 0 1 ${n2(x)} ${n2(y + h - r)}` +
    `V${n2(y + r)}A${n2(r)} ${n2(r)} 0 0 1 ${n2(x + r)} ${n2(y)}Z`;
}

// «Squircle»: cuadrado de esquinas continuas (curvas de Bézier), más suave que el redondeado simple.
export function squircle(x, y, w, h, r, k = 0.62) {
  // r = longitud de la curva en cada lado; k controla la tensión
  const c = r * (1 - k);
  return `M${n2(x + r)} ${n2(y)}H${n2(x + w - r)}C${n2(x + w - c)} ${n2(y)} ${n2(x + w)} ${n2(y + c)} ${n2(x + w)} ${n2(y + r)}` +
    `V${n2(y + h - r)}C${n2(x + w)} ${n2(y + h - c)} ${n2(x + w - c)} ${n2(y + h)} ${n2(x + w - r)} ${n2(y + h)}` +
    `H${n2(x + r)}C${n2(x + c)} ${n2(y + h)} ${n2(x)} ${n2(y + h - c)} ${n2(x)} ${n2(y + h - r)}` +
    `V${n2(y + r)}C${n2(x)} ${n2(y + c)} ${n2(x + c)} ${n2(y)} ${n2(x + r)} ${n2(y)}Z`;
}

// Transformación afín sencilla de un path (solo M/L/H/V/C/Q/A/Z absolutos que generamos aquí o que da opentype).
export function transformPath(d, { sx = 1, sy = sx, tx = 0, ty = 0 } = {}) {
  const tokens = d.match(/[MLHVCQAZ]|-?\d*\.?\d+(?:e-?\d+)?/gi);
  let out = '', cmd = '', args = [];
  const flush = () => {
    if (!cmd) return;
    const a = args.map(Number);
    const X = v => n2(v * sx + tx), Y = v => n2(v * sy + ty);
    switch (cmd) {
      case 'M': case 'L': for (let i = 0; i < a.length; i += 2) out += (i ? 'L' : cmd) + X(a[i]) + ' ' + Y(a[i + 1]); break;
      case 'H': out += 'H' + a.map(X).join(' '); break;
      case 'V': out += 'V' + a.map(Y).join(' '); break;
      case 'C': case 'Q': out += cmd + a.map((v, i) => (i % 2 ? Y(v) : X(v))).join(' '); break;
      case 'A': for (let i = 0; i < a.length; i += 7) out += `A${n2(a[i] * Math.abs(sx))} ${n2(a[i + 1] * Math.abs(sy))} ${a[i + 2]} ${a[i + 3]} ${a[i + 4]} ${X(a[i + 5])} ${Y(a[i + 6])}`; break;
      case 'Z': out += 'Z'; break;
    }
  };
  for (const t of tokens) {
    if (/[A-Z]/i.test(t)) { flush(); cmd = t.toUpperCase(); args = []; if (cmd === 'Z') { out += 'Z'; cmd = ''; } }
    else args.push(t);
  }
  flush();
  return out;
}

// Polígono con esquinas redondeadas (convexas o cóncavas). pts = [[x,y],...], radii = número o lista.
export function roundPoly(pts, radii) {
  const V = pts.map(([x, y]) => P(x, y));
  const R = Array.isArray(radii) ? radii : V.map(() => radii);
  const n = V.length;
  let d = '';
  for (let i = 0; i < n; i++) {
    const A = V[(i - 1 + n) % n], B = V[i], Cn = V[(i + 1) % n], r = R[i];
    const u1 = norm(sub(A, B)), u2 = norm(sub(Cn, B));
    const cosT = Math.max(-1, Math.min(1, dot(u1, u2)));
    const th = Math.acos(cosT);
    if (r <= 0 || th < 1e-6) { d += (i ? 'L' : 'M') + pt(B); continue; }
    const k = r / Math.tan(th / 2);
    const t1 = add(B, mul(u1, k)), t2 = add(B, mul(u2, k));
    const cross = (B.x - A.x) * (Cn.y - B.y) - (B.y - A.y) * (Cn.x - B.x);
    d += (i ? 'L' : 'M') + pt(t1) + `A${n2(r)} ${n2(r)} 0 0 ${cross > 0 ? 1 : 0} ${pt(t2)}`;
  }
  return d + 'Z';
}

export function svgDoc(vb, body) {
  const [x, y, w, h] = vb.map(n2);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${w} ${h}">\n${body}\n</svg>\n`;
}
export const pathEl = (d, fill, extra = '') => `<path fill="${fill}"${extra} d="${d}"/>`;

export function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}
