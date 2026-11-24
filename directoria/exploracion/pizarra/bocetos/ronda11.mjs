// Ronda 11: el riesgo «casilla marcada» (☑ + etiqueta). ¿Qué silueta lo rompe sin perder la pizarra?
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { base, wordmark, symbolParts } from '../build.mjs';
import { C, P, add, sub, mul, norm, tick, circle, rrect, roundPoly, transformPath, svgDoc, pathEl, n2 } from '../lib.mjs';
import { previewSheet, previewLogos } from '../preview.mjs';
const here = path.dirname(fileURLToPath(import.meta.url));
const rad = d => d * Math.PI / 180;

// visto + chispa genéricos en una caja dada (x, y, w, h), centrados con corrección
function mark(o, box) {
  const V = P(...o.vertex);
  const p0 = add(V, P(-o.short.len * Math.cos(rad(o.short.ang)), -o.short.len * Math.sin(rad(o.short.ang))));
  const p2 = add(V, P(o.long.len * Math.cos(rad(o.long.ang)), -o.long.len * Math.sin(rad(o.long.ang))));
  const [r0, r1, r2] = o.radii;
  const u = norm(sub(V, p0));
  const dc = add(p0, mul(u, -(r0 + o.dotGap + o.dotR)));
  const cs = [[p0, r0], [V, r1], [p2, r2], [dc, o.dotR]];
  const x1 = Math.min(...cs.map(([c, r]) => c.x - r)), x2 = Math.max(...cs.map(([c, r]) => c.x + r));
  const y1 = Math.min(...cs.map(([c, r]) => c.y - r)), y2 = Math.max(...cs.map(([c, r]) => c.y + r));
  const k = o.k ?? 1;
  const cx = box.x + box.w / 2 + (o.dx ?? 0), cy = box.y + box.h / 2 + (o.dy ?? 0);
  const T = q => P(cx + (q.x - (x1 + x2) / 2) * k, cy + (q.y - (y1 + y2) / 2) * k);
  return { tick: tick([T(p0), T(V), T(p2)], [r0 * k, r1 * k, r2 * k]), dot: circle(T(dc).x, T(dc).y, o.dotR * k) };
}

// cada variante devuelve el cuerpo del símbolo en una caja 0–100 de ancho, alto variable
const variants = {
  'V1 · baldosa cuadrada (actual)': o => {
    const m = mark(o, { x: 0, y: 0, w: 100, h: 100 });
    return { w: 100, h: 100, body: (bg, fg) => pathEl(rrect(0, 0, 100, 100, 16), bg) + pathEl(m.tick, fg) + pathEl(m.dot, C.chispa) };
  },
  'V2 · pizarra apaisada 4:3': o => {
    const m = mark({ ...o, k: 0.86 }, { x: 0, y: 0, w: 100, h: 76 });
    return { w: 100, h: 76, body: (bg, fg) => pathEl(rrect(0, 0, 100, 76, 12), bg) + pathEl(m.tick, fg) + pathEl(m.dot, C.chispa) };
  },
  'V3 · apaisada con repisa integrada': o => {
    const m = mark({ ...o, k: 0.84, dy: -2 }, { x: 4, y: 0, w: 92, h: 70 });
    const sil = roundPoly([[4, 0], [96, 0], [96, 70], [100, 70], [100, 78], [0, 78], [0, 70], [4, 70]], [11, 11, 0, 1.5, 3, 3, 1.5, 0]);
    return { w: 100, h: 78, body: (bg, fg) => pathEl(sil, bg) + pathEl(m.tick, fg) + pathEl(m.dot, C.chispa) };
  },
  'V4 · apaisada 5:4, visto más pequeño': o => {
    const m = mark({ ...o, k: 0.78 }, { x: 0, y: 0, w: 100, h: 80 });
    return { w: 100, h: 80, body: (bg, fg) => pathEl(rrect(0, 0, 100, 80, 13), bg) + pathEl(m.tick, fg) + pathEl(m.dot, C.chispa) };
  },
};

const items = [], logos = [];
const W = wordmark(base);
for (const [label, fn] of Object.entries(variants)) {
  const v = fn(base);
  // isotipo en caja cuadrada
  const pad = 3, side = Math.max(v.w, v.h) + 2 * pad;
  const off = [(side - v.w) / 2 - pad, (side - v.h) / 2 - pad];
  const iso = (bg, fg) => svgDoc([-off[0] - pad, -off[1] - pad, side, side], v.body(bg, fg));
  items.push({ label, pos: iso(C.pizarra, C.tiza), neg: iso(C.pizarraLinea, C.tiza) });
  // horizontal: misma altura de pizarra relativa (alto de la caja = 1,32 × mayúscula para la cuadrada; las apaisadas, igual alto)
  const H = W.cap * 1.32, s = H / v.h, gap = H * 0.32;
  const tx = W.x1 - gap - v.w * s, ty = -W.cap / 2 - H / 2;
  const lock = (bg, fg, ia) => {
    const sym = `<g transform="translate(${n2(tx)} ${n2(ty)}) scale(${n2(s)})">${v.body(bg, fg)}</g>`;
    const words = pathEl(W.director, fg === C.tiza && bg !== C.pizarra ? C.tiza : (bg === C.pizarra ? C.pizarra : C.tiza)) ;
    return { sym, words };
  };
  const top = Math.min(ty, W.y1), bottom = Math.max(ty + H, W.y2), m = (bottom - top) * 0.06;
  const vb = [tx - m, top - m, W.x2 - tx + 2 * m, bottom - top + 2 * m];
  const pos = svgDoc(vb, `<g transform="translate(${n2(tx)} ${n2(ty)}) scale(${n2(s)})">${v.body(C.pizarra, C.tiza)}</g>` + pathEl(W.director, C.pizarra) + pathEl(W.I + W.A, C.chispaTexto));
  const neg = svgDoc(vb, `<g transform="translate(${n2(tx)} ${n2(ty)}) scale(${n2(s)})">${v.body(C.pizarraLinea, C.tiza)}</g>` + pathEl(W.director, C.tiza) + pathEl(W.I + W.A, C.chispa));
  logos.push({ label, pos, neg, h: 90 });
}
await previewSheet(path.join(here, 'r11', 'simbolos.png'), items, { title: 'Ronda 11 · silueta', big: 170 });
await previewLogos(path.join(here, 'r11', 'logos.png'), logos, { title: 'Ronda 11 · ¿casilla o pizarra?' });
console.log('ok');
