#!/usr/bin/env node
// DirectorIA · concepto «Dirección con chispa» (territorio monograma-d-chispa)
// Genera isotipo.svg, isotipo-negativo.svg, logo-horizontal.svg y logo-horizontal-negativo.svg.
//
// Uso: node build.mjs [ruta/a/outline.mjs]
//   (por defecto usa la variable BRANDTOOLS o el outline.mjs de las herramientas de marca)
// El logotipo se convierte a contornos con Rubik 700 (SIL OFL); la «I» de «IA» se dibuja aparte con remates.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const OUTLINE = process.argv[2] || (process.env.BRANDTOOLS ? path.join(process.env.BRANDTOOLS, 'outline.mjs')
  : '/tmp/claude-0/-home-user-albertoprepatop-web-github-io/db30fac1-e41f-5e34-8ec7-ae08fc5fe643/scratchpad/brandtools/outline.mjs');

// Paleta de la marca (solo estos valores)
const C = { pizarra: '#17322C', tiza: '#F6F3EC', chispa: '#E07A3A', chispaTexto: '#B4531C' };
const n = v => +(+v).toFixed(2);

// ---------- Geometría del símbolo (rejilla de 100) ----------
// D: caja 8–92, grosor de trazo 22, cuenco semicircular, esquina inferior izquierda r 5.
// La esquina superior izquierda es la chispa: círculo de radio 11 (= medio trazo), tangente a los bordes,
// encajado en un corte circular (hueco 6.5) con las puntas suavizadas (radio 1.6).
const SYM = { xL: 8, yT: 8, xR: 92, yB: 92, s: 22, rc: 5, g: 6.5, f: 1.6 };

function circle(cx, cy, r) {
  return `M${n(cx - r)} ${n(cy)}A${n(r)} ${n(r)} 0 1 0 ${n(cx + r)} ${n(cy)}A${n(r)} ${n(r)} 0 1 0 ${n(cx - r)} ${n(cy)}Z`;
}
function symbol({ xL, yT, xR, yB, s, rc, g, f }) {
  const H = yB - yT, R = H / 2, xC = xR - R, k = 0.5523, yM = (yT + yB) / 2;
  const r = R - s, iT = yT + s, iB = yB - s, iL = xL + s;
  const cx0 = xL + s / 2, cy0 = yT + s / 2, rD = s / 2, Rg = rD + g, RF = Rg + f;
  const A = (rr, sw, x, y) => `A${n(rr)} ${n(rr)} 0 0 ${sw} ${n(x)} ${n(y)}`;
  const on = (fx, fy) => [cx0 + (fx - cx0) * Rg / RF, cy0 + (fy - cy0) * Rg / RF];
  const fo = { x: xL + f, y: cy0 + Math.sqrt(RF ** 2 - (xL + f - cx0) ** 2) };   // filete exterior del asta
  const fi = { x: iL - f, y: cy0 + Math.sqrt(RF ** 2 - (iL - f - cx0) ** 2) };   // filete interior del asta
  const ai = { x: cx0 + Math.sqrt(RF ** 2 - (iT - f - cy0) ** 2), y: iT - f };   // filete interior del brazo
  const ao = { x: cx0 + Math.sqrt(RF ** 2 - (yT + f - cy0) ** 2), y: yT + f };   // filete exterior del brazo
  const P1 = on(fo.x, fo.y), P2 = on(fi.x, fi.y), P3 = on(ai.x, ai.y), P4 = on(ao.x, ao.y);
  const h2 = H / 2, ih2 = (iB - iT) / 2;
  const d = `M${n(ao.x)} ${n(yT)}H${n(xC)}` +
    `C${n(xC + k * R)} ${n(yT)} ${n(xR)} ${n(yM - k * h2)} ${n(xR)} ${n(yM)}` +
    `C${n(xR)} ${n(yM + k * h2)} ${n(xC + k * R)} ${n(yB)} ${n(xC)} ${n(yB)}` +
    `H${n(xL + rc)}A${rc} ${rc} 0 0 1 ${n(xL)} ${n(yB - rc)}V${n(fo.y)}` +
    A(f, 1, P1[0], P1[1]) + A(Rg, 0, P2[0], P2[1]) + A(f, 1, iL, fi.y) +
    `V${n(iB)}H${n(xC)}` +
    `C${n(xC + k * r)} ${n(iB)} ${n(xC + r)} ${n(yM + k * ih2)} ${n(xC + r)} ${n(yM)}` +
    `C${n(xC + r)} ${n(yM - k * ih2)} ${n(xC + k * r)} ${n(iT)} ${n(xC)} ${n(iT)}` +
    `H${n(ai.x)}` + A(f, 1, P3[0], P3[1]) + A(Rg, 0, P4[0], P4[1]) + A(f, 1, ao.x, yT) + 'Z';
  return { d, dot: circle(cx0, cy0, rD) };
}

// ---------- Logotipo ----------
function outline(text, x, y, size, weight = 700) {
  const out = execFileSync('node', [OUTLINE, '--font', 'rubik', '--weight', String(weight), '--size', String(size),
    '--text', text, '--x', String(x), '--y', String(y)], { encoding: 'utf8' });
  return JSON.parse(out);
}
// I mayúscula con remates (mismo asta que la I de Rubik 700 y esquinas redondeadas como Rubik)
function serifI(x, y0, capH, S) {
  const sw = 0.18 * S, t = 0.13 * S, o = 0.105 * S, r = 0.025 * S;
  const w = sw + 2 * o, top = y0 - capH, bot = y0;
  const a = (X, Y) => `A${n(r)} ${n(r)} 0 0 1 ${n(X)} ${n(Y)}`;
  const d = `M${n(x + r)} ${n(top)}H${n(x + w - r)}` + a(x + w, top + r) + `V${n(top + t - r)}` + a(x + w - r, top + t) +
    `H${n(x + o + sw)}V${n(bot - t)}H${n(x + w - r)}` + a(x + w, bot - t + r) + `V${n(bot - r)}` + a(x + w - r, bot) +
    `H${n(x + r)}` + a(x, bot - r) + `V${n(bot - t + r)}` + a(x + r, bot - t) +
    `H${n(x + o)}V${n(top + t)}H${n(x + r)}` + a(x, top + t - r) + `V${n(top + r)}` + a(x + r, top) + 'Z';
  return { d, w };
}
const LOCK = { S: 100, symH: 1.46, gap: 0.4, gapRI: 0.05, gapIA: 0.035, yShift: -0.01, margin: 0.12 };
function wordmark(x0, S) {
  const dir = outline('Director', x0, 0, S);
  const capH = dir.capHeight;
  const xI = dir.bbox.x2 + LOCK.gapRI * S;
  const I = serifI(xI, 0, capH, S);
  const A0 = outline('A', 0, 0, S);
  const A = outline('A', xI + I.w + LOCK.gapIA * S - A0.bbox.x1, 0, S);
  return { dirD: dir.d, iaD: I.d + A.d, capH, x2: A.bbox.x2, y1: Math.min(dir.bbox.y1, -capH), y2: Math.max(dir.bbox.y2, 0) };
}

// ---------- Salida ----------
const svg = (vb, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}">${body}</svg>\n`;
const P = (d, fill) => `<path fill="${fill}" d="${d}"/>`;
const sym = symbol(SYM);

// Isotipo: margen uniforme de 4 sobre la caja 8–92
const isoVB = '4 4 92 92';
fs.writeFileSync(path.join(here, 'isotipo.svg'), svg(isoVB, P(sym.d, C.pizarra) + P(sym.dot, C.chispa)));
fs.writeFileSync(path.join(here, 'isotipo-negativo.svg'), svg(isoVB, P(sym.d, C.tiza) + P(sym.dot, C.chispa)));

// Horizontal: símbolo centrado (con leve ajuste óptico hacia abajo) en la altura de mayúscula
function horizontal(dark) {
  const S = LOCK.S;
  const probe = outline('D', 0, 0, S);
  const capH = probe.capHeight;
  const h = LOCK.symH * capH, k = h / 84;           // la D ocupa 84 unidades de la rejilla
  const cy = -capH / 2 + LOCK.yShift * capH;         // centro vertical del símbolo
  const symX = 0, symY = cy - h / 2;                 // esquina superior izquierda del símbolo
  const wmX = 84 * k + LOCK.gap * capH;
  const wm = wordmark(wmX, S);
  const fg = dark ? C.tiza : C.pizarra;
  const ia = dark ? C.chispa : C.chispaTexto;
  const body = `<g transform="translate(${n(symX - 8 * k)} ${n(symY - 8 * k)}) scale(${n(k)})">${P(sym.d, fg)}${P(sym.dot, C.chispa)}</g>` +
    P(wm.dirD, fg) + P(wm.iaD, ia);
  const m = LOCK.margin * capH;
  const x1 = 0, y1 = Math.min(symY, wm.y1), x2 = wm.x2, y2 = Math.max(symY + h, wm.y2);
  return svg(`${n(x1 - m)} ${n(y1 - m)} ${n(x2 - x1 + 2 * m)} ${n(y2 - y1 + 2 * m)}`, body);
}
fs.writeFileSync(path.join(here, 'logo-horizontal.svg'), horizontal(false));
fs.writeFileSync(path.join(here, 'logo-horizontal-negativo.svg'), horizontal(true));
console.log('OK: isotipo.svg, isotipo-negativo.svg, logo-horizontal.svg, logo-horizontal-negativo.svg');
