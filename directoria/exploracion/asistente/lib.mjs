// Utilidades geométricas para construir el logotipo "asistente" de DirectorIA.
// Todo se genera como trazos (paths) planos; nada de <text>.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

// Carpeta con outline.mjs y render.mjs (las herramientas de marca); se puede cambiar con la variable BRANDTOOLS.
export const TOOLS = process.env.BRANDTOOLS || '/tmp/claude-0/-home-user-albertoprepatop-web-github-io/db30fac1-e41f-5e34-8ec7-ae08fc5fe643/scratchpad/brandtools';

export const C = {
  pizarra: '#17322C', pizarra2: '#21433B', pizarraLinea: '#2E5A50',
  tiza: '#F6F3EC', salvia: '#E7EEE9', papel: '#FFFDF8', linea: '#D5DED9',
  texto: '#41524D', textoSuave: '#C9DAD4',
  chispa: '#E07A3A', chispaTexto: '#B4531C', chispaSuave: '#FBE6D8',
};

// ---------- texto a contornos ----------
const cache = new Map();
export function outline(text, { font = 'rubik', weight = 700, size = 100, tracking = 0, x = 0, y = 0 } = {}) {
  const key = JSON.stringify([text, font, weight, size, tracking, x, y]);
  if (cache.has(key)) return cache.get(key);
  const out = execFileSync('node', [path.join(TOOLS, 'outline.mjs'), '--font', font, '--weight', String(weight),
    '--size', String(size), '--text', text, '--tracking', String(tracking), '--x', String(x), '--y', String(y)],
    { encoding: 'utf8' });
  const j = JSON.parse(out);
  cache.set(key, j);
  return j;
}

// ---------- vectores ----------
const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
const mul = (a, s) => [a[0] * s, a[1] * s];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1];
const len = a => Math.hypot(a[0], a[1]);
const norm = a => { const l = len(a); return [a[0] / l, a[1] / l]; };
export const n2 = v => (Math.round(v * 100) / 100).toString();
const P = p => `${n2(p[0])} ${n2(p[1])}`;

// ---------- polígono con esquinas redondeadas y tramos en arco ----------
// nodes: [{p:[x,y], r:radio}] en sentido horario (pantalla). Si un nodo lleva {arc:{r, large, sweep}},
// el tramo que LLEGA a ese nodo es un arco en vez de una recta (y no se redondean sus extremos).
export function shape(nodes) {
  const n = nodes.length;
  const corners = nodes.map((nd, i) => {
    const prev = nodes[(i - 1 + n) % n], next = nodes[(i + 1) % n];
    const inArc = !!(nd.arc || nd.cubic), outArc = !!(next.arc || next.cubic);
    const r = nd.r || 0;
    if (!r || inArc || outArc) return { S: nd.p, E: nd.p, r: 0 };
    const v1 = norm(sub(prev.p, nd.p)), v2 = norm(sub(next.p, nd.p));
    const ang = Math.acos(Math.max(-1, Math.min(1, dot(v1, v2))));
    let t = r / Math.tan(ang / 2);
    t = Math.min(t, len(sub(prev.p, nd.p)) * 0.5, len(sub(next.p, nd.p)) * 0.5);
    const rr = t * Math.tan(ang / 2);
    const d1 = sub(nd.p, prev.p), d2 = sub(next.p, nd.p);
    const cross = d1[0] * d2[1] - d1[1] * d2[0];
    return { S: add(nd.p, mul(v1, t)), E: add(nd.p, mul(v2, t)), r: rr, sweep: cross > 0 ? 1 : 0 };
  });
  let d = `M${P(corners[0].E)}`;
  for (let i = 1; i <= n; i++) {
    const k = i % n, nd = nodes[k], c = corners[k];
    if (nd.arc) {
      const a = nd.arc;
      d += `A${n2(a.rx ?? a.r)} ${n2(a.ry ?? a.r)} 0 ${a.large ? 1 : 0} ${a.sweep ?? 1} ${P(c.S)}`;
    } else if (nd.cubic) {
      d += `C${P(nd.cubic[0])} ${P(nd.cubic[1])} ${P(c.S)}`;
    } else {
      d += `L${P(c.S)}`;
    }
    if (c.r) d += `A${n2(c.r)} ${n2(c.r)} 0 0 ${c.sweep} ${P(c.E)}`;
  }
  return d + 'Z';
}

// ---------- estrella de 4 puntas (chispa) ----------
// R radio exterior, k = radio interior / R, tipR redondeo de puntas, inR redondeo de los valles.
export function spark({ cx, cy, R, k = 0.42, tipR = 0, inR = 0, rot = 0, sx = 1, sy = 1 }) {
  const nodes = [];
  for (let i = 0; i < 8; i++) {
    const a = (rot - 90 + i * 45) * Math.PI / 180;
    const rad = i % 2 === 0 ? R : R * k;
    nodes.push({ p: [cx + Math.cos(a) * rad * sx, cy + Math.sin(a) * rad * sy], r: i % 2 === 0 ? tipR : inR });
  }
  return shape(nodes);
}

export function circle(cx, cy, r) {
  return `M${n2(cx - r)} ${n2(cy)}A${n2(r)} ${n2(r)} 0 1 0 ${n2(cx + r)} ${n2(cy)}A${n2(r)} ${n2(r)} 0 1 0 ${n2(cx - r)} ${n2(cy)}Z`;
}
// circulo en sentido contrario (para agujeros con regla nonzero)
export function circleRev(cx, cy, r) {
  return `M${n2(cx - r)} ${n2(cy)}A${n2(r)} ${n2(r)} 0 1 1 ${n2(cx + r)} ${n2(cy)}A${n2(r)} ${n2(r)} 0 1 1 ${n2(cx - r)} ${n2(cy)}Z`;
}

export function rrect(x, y, w, h, r) {
  return shape([{ p: [x, y], r }, { p: [x + w, y], r }, { p: [x + w, y + h], r }, { p: [x, y + h], r }]);
}

// ---------- utilidades SVG ----------
export function svg(vb, body, title = null) {
  const [x, y, w, h] = vb.map(v => n2(v));
  const t = title ? `<title>${title}</title>` : '';
  const a = title ? ` role="img" aria-label="${title}"` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${w} ${h}"${a}>${t}${body}</svg>\n`;
}
export const pathEl = (d, fill, extra = '') => `<path fill="${fill}"${extra} d="${d}"/>`;

export function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

export function render(svgFile, pngFile, { width = 600, bg = null, pad = 0 } = {}) {
  const args = [path.join(TOOLS, 'render.mjs'), svgFile, pngFile, '--width', String(width), '--pad', String(pad)];
  if (bg) args.push('--bg', bg);
  execFileSync('node', args, { encoding: 'utf8' });
}

// Traslada un path absoluto (solo comandos absolutos M L H V C Q A Z como los que generan opentype y shape()).
export function translatePath(d, dx, dy, s = 1) {
  const toks = d.match(/[MLHVCQAZmlhvcqaz]|-?\d*\.?\d+(?:e[-+]?\d+)?/g);
  let out = '', cmd = '', idx = 0;
  const fx = v => n2(v * s + dx), fy = v => n2(v * s + dy);
  for (let i = 0; i < toks.length; i++) {
    const t = toks[i];
    if (/[A-Za-z]/.test(t)) { cmd = t; idx = 0; out += t; continue; }
    const v = parseFloat(t);
    let o;
    switch (cmd) {
      case 'M': case 'L': case 'C': case 'Q': o = idx % 2 === 0 ? fx(v) : fy(v); break;
      case 'H': o = fx(v); break;
      case 'V': o = fy(v); break;
      case 'A': { const m = idx % 7; o = m === 5 ? fx(v) : m === 6 ? fy(v) : (m < 2 ? n2(v * s) : n2(v)); break; }
      default: throw new Error('Comando no soportado en translatePath: ' + cmd);
    }
    out += (out.length && !/[A-Za-z]$/.test(out) ? ' ' : '') + o;
    idx++;
  }
  return out;
}

// ---------- caja real de un path (muestrea curvas) ----------
export function pathBBox(d) {
  const toks = d.match(/[MLHVCQAZ]|-?\d*\.?\d+(?:e[-+]?\d+)?/g);
  let x1 = Infinity, y1 = Infinity, x2 = -Infinity, y2 = -Infinity;
  const addPt = (x, y) => { x1 = Math.min(x1, x); y1 = Math.min(y1, y); x2 = Math.max(x2, x); y2 = Math.max(y2, y); };
  let i = 0, cmd = '', cx = 0, cy = 0, sx = 0, sy = 0;
  const num = () => parseFloat(toks[i++]);
  while (i < toks.length) {
    if (/[A-Z]/.test(toks[i])) { cmd = toks[i++]; if (cmd === 'Z') { cx = sx; cy = sy; } continue; }
    if (cmd === 'M') { cx = num(); cy = num(); sx = cx; sy = cy; addPt(cx, cy); cmd = 'L'; }
    else if (cmd === 'L') { cx = num(); cy = num(); addPt(cx, cy); }
    else if (cmd === 'H') { cx = num(); addPt(cx, cy); }
    else if (cmd === 'V') { cy = num(); addPt(cx, cy); }
    else if (cmd === 'Q') {
      const qx = num(), qy = num(), ex = num(), ey = num();
      for (let t = 0; t <= 1.0001; t += 0.05) { const u = 1 - t; addPt(u * u * cx + 2 * u * t * qx + t * t * ex, u * u * cy + 2 * u * t * qy + t * t * ey); }
      cx = ex; cy = ey;
    } else if (cmd === 'C') {
      const ax = num(), ay = num(), bx = num(), by = num(), ex = num(), ey = num();
      for (let t = 0; t <= 1.0001; t += 0.05) { const u = 1 - t; addPt(u*u*u*cx + 3*u*u*t*ax + 3*u*t*t*bx + t*t*t*ex, u*u*u*cy + 3*u*u*t*ay + 3*u*t*t*by + t*t*t*ey); }
      cx = ex; cy = ey;
    } else if (cmd === 'A') {
      const rx = num(), ry = num(); num(); const large = num(), sweep = num(); const ex = num(), ey = num();
      // aproximación: muestrea el arco con el centro calculado
      const pts = arcPoints(cx, cy, rx, ry, large, sweep, ex, ey);
      pts.forEach(p => addPt(p[0], p[1]));
      cx = ex; cy = ey;
    } else { i++; }
  }
  return { x1, y1, x2, y2, w: x2 - x1, h: y2 - y1 };
}
function arcPoints(x0, y0, rx, ry, large, sweep, x, y) {
  // conversión endpoint -> centro (sin rotación)
  const dx = (x0 - x) / 2, dy = (y0 - y) / 2;
  let lam = (dx * dx) / (rx * rx) + (dy * dy) / (ry * ry);
  if (lam > 1) { rx *= Math.sqrt(lam); ry *= Math.sqrt(lam); }
  const sign = large === sweep ? -1 : 1;
  const num = rx * rx * ry * ry - rx * rx * dy * dy - ry * ry * dx * dx;
  const den = rx * rx * dy * dy + ry * ry * dx * dx;
  const co = sign * Math.sqrt(Math.max(0, num / den));
  const cxp = co * (rx * dy / ry), cyp = co * (-ry * dx / rx);
  const cx = cxp + (x0 + x) / 2, cy = cyp + (y0 + y) / 2;
  const ang = (ux, uy, vx, vy) => Math.atan2(ux * vy - uy * vx, ux * vx + uy * vy);
  const t1 = ang(1, 0, (dx - cxp) / rx, (dy - cyp) / ry);
  let dt = ang((dx - cxp) / rx, (dy - cyp) / ry, (-dx - cxp) / rx, (-dy - cyp) / ry);
  if (!sweep && dt > 0) dt -= 2 * Math.PI; else if (sweep && dt < 0) dt += 2 * Math.PI;
  const pts = [];
  for (let k = 0; k <= 24; k++) { const t = t1 + dt * k / 24; pts.push([cx + rx * Math.cos(t), cy + ry * Math.sin(t)]); }
  return pts;
}

// ---------- logotipo: "Director" + I con remates + A ----------
// Devuelve trazos con la línea base en y=0. La I se dibuja con remates (como el cursor de texto)
// para que nunca se lea como una l minúscula.
const ARM = { 500: 0.115, 600: 0.129, 700: 0.144 };   // grosor del brazo superior de la E de Rubik (fracción del cuerpo)
export function wordmark({ weight = 700, size = 100, tracking = 0, serifW = 0.42, serifK = 0.92, gapRI = 0.05, gapIA = 0.05, cornerR = 0.025 } = {}) {
  const S = size;
  const dir = outline('Director', { weight, size, tracking });
  const ib = pathBBox(outline('I', { weight, size }).glyphs[0].d);
  const aG = outline('A', { weight, size }).glyphs[0];
  const ab = pathBBox(aG.d);
  const cap = dir.capHeight;
  const sw = ib.w;                                 // grosor del asta de la I de Rubik
  const st = (ARM[weight] ?? 0.13) * S * serifK;   // remates a juego con los brazos de la E
  const sfw = serifW * S;
  const rb = pathBBox(dir.glyphs[dir.glyphs.length - 1].d);
  const serifLeft = rb.x2 + gapRI * S;
  const I = iBeamPath({ x: serifLeft, w: sfw, sw, st, cap, r: cornerR * S });
  const aShift = serifLeft + sfw + gapIA * S - ab.x1;
  const A = translatePath(aG.d, aShift, 0);
  const x1 = pathBBox(dir.glyphs[0].d).x1;
  const bbox = { x1, x2: ab.x2 + aShift, y1: -cap, y2: 0 };
  return { director: dir.glyphs.map(g => g.d).join(''), glyphs: dir.glyphs, I, A, cap, xh: dir.xHeight, st, sw, sfw, serifLeft, bbox, width: bbox.x2 - bbox.x1 };
}
export function iBeamPath({ x, w, sw, st, cap, r = 2.5, base = 0 }) {
  const cxm = x + w / 2, t = base - cap, b = base;
  return shape([
    { p: [x, t], r }, { p: [x + w, t], r }, { p: [x + w, t + st], r },
    { p: [cxm + sw / 2, t + st], r: 0 }, { p: [cxm + sw / 2, b - st], r: 0 }, { p: [x + w, b - st], r },
    { p: [x + w, b], r }, { p: [x, b], r }, { p: [x, b - st], r },
    { p: [cxm - sw / 2, b - st], r: 0 }, { p: [cxm - sw / 2, t + st], r: 0 }, { p: [x, t + st], r }]);
}

// ---------- isotipo: bocadillo en forma de D ----------
// Cuerpo w x h con cuenco semicircular a la derecha y cola "pie" abajo a la izquierda (apoyada en la línea base).
export function dBody({ x, y, w, h, rL = 5, R = h / 2, type = 'foot', t = {} }) {
  const nodes = [{ p: [x, y], r: rL }, { p: [x + w - R, y], r: 0 }];
  if (R >= h / 2 - 1e-6) nodes.push({ p: [x + w - R, y + h], r: 0, arc: { r: R, sweep: 1 } });
  else {
    nodes.push({ p: [x + w, y + R], r: 0, arc: { r: R, sweep: 1 } });
    nodes.push({ p: [x + w, y + h - R], r: 0 });
    nodes.push({ p: [x + w - R, y + h], r: 0, arc: { r: R, sweep: 1 } });
  }
  if (type === 'foot') {
    nodes.push({ p: [x - (t.foot ?? 14), y + h], r: t.tipR ?? 2.5 });
    nodes.push({ p: [x, y + h - (t.rise ?? 22)], r: t.joinR ?? 6 });
  } else if (type === 'diag') {
    nodes.push({ p: [x + (t.base ?? 20), y + h], r: t.joinR ?? 4 });
    nodes.push({ p: [x - (t.out ?? 8), y + h + (t.down ?? 14)], r: t.tipR ?? 2.5 });
    nodes.push({ p: [x, y + h - (t.rise ?? 10)], r: t.backR ?? 5 });
  }
  return shape(nodes);
}
// Contraforma en D (agujero): grosor s en el asta y el cuenco, sh arriba y abajo.
export function dCounter({ x, y, w, h, R = h / 2, s, sh = s, rc = 2 }) {
  const cx = x + w - R;
  return shape([{ p: [x + s, y + sh], r: rc }, { p: [cx, y + sh], r: 0 },
    { p: [cx, y + h - sh], r: 0, arc: { rx: R - s, ry: R - sh, sweep: 1 } }, { p: [x + s, y + h - sh], r: rc }]);
}
