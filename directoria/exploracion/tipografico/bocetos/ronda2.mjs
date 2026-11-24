// Ronda 2: la «I con remates» en el logotipo + monograma «la I dentro de la D».
import { outline, roundPoly, rrect, serifI, svgDoc, path, render, sheet, write, C } from './lib.mjs';
import { execFileSync } from 'node:child_process';
import path_ from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path_.dirname(fileURLToPath(import.meta.url));
const out = n => path_.join(here, 'r2', n);
execFileSync('mkdir', ['-p', path_.join(here, 'r2')]);
const f2 = n => +n.toFixed(2);

// ---------- monograma: D hueca con la I dentro (caja 100 x 100) ----------
export function dOutline({ left, top, W, H, ss, sa, sr, Rr, rl = 3 }) {
  const right = left + W, bot = top + H;
  const rx = Math.max(Rr - sr, 1), ry = Math.max(Rr - sa, 1);
  const o = `M${f2(left + rl)} ${f2(top)}H${f2(right - Rr)}A${f2(Rr)} ${f2(Rr)} 0 0 1 ${f2(right)} ${f2(top + Rr)}V${f2(bot - Rr)}A${f2(Rr)} ${f2(Rr)} 0 0 1 ${f2(right - Rr)} ${f2(bot)}H${f2(left + rl)}Q${f2(left)} ${f2(bot)} ${f2(left)} ${f2(bot - rl)}V${f2(top + rl)}Q${f2(left)} ${f2(top)} ${f2(left + rl)} ${f2(top)}Z`;
  const i = `M${f2(left + ss)} ${f2(top + sa)}V${f2(bot - sa)}H${f2(right - Rr)}A${f2(rx)} ${f2(ry)} 0 0 0 ${f2(right - sr)} ${f2(bot - Rr)}V${f2(top + Rr)}A${f2(rx)} ${f2(ry)} 0 0 0 ${f2(right - Rr)} ${f2(top + sa)}Z`;
  return { d: o + i, counter: { x1: left + ss, x2: right - sr, y1: top + sa, y2: bot - sa } };
}

export function monogram({ H = 60, W = 58, ss = 12.5, sa = 10.5, sr = 12.5, Rr = 30, gapY = 7, S = 8.5, o = 5, t = 6.5, shiftX = -1.5,
  tile = C.pizarra, dCol = C.tiza, iCol = C.chispa, tileR = 22, withTile = true } = {}) {
  const left = 50 - W / 2, top = 50 - H / 2;
  const D = dOutline({ left, top, W, H, ss, sa, sr, Rr });
  const c = D.counter;
  const Hi = (c.y2 - c.y1) - 2 * gapY;
  const Iw = S + 2 * o;
  const cxC = (c.x1 + c.x2) / 2 + shiftX;
  const I = serifI({ x: cxC - Iw / 2, base: c.y2 - gapY, H: Hi, S, o, t, r: 1.2 });
  return (withTile ? path(rrect(0, 0, 100, 100, tileR), tile) : '') + path(D.d, dCol) + path(I.d, iCol);
}

// ---------- logotipo ----------
export function word({ weight = 700, ia = C.chispa, dir = C.pizarra, S, o = 11, t = 13, gapL = 4, gapR = 6, rS = 2.5 } = {}) {
  S = S ?? ({ 500: 14.2, 600: 16.3, 700: 18.5 })[weight];
  const D = outline('Director', { weight });
  const ix = D.bbox.x2 + gapL;
  const I = serifI({ x: ix, base: 0, H: 70, S, o, t, r: rS });
  const a0 = outline('A', { weight });
  const ax = ix + I.width + gapR - a0.bbox.x1;
  const A = outline('A', { weight, x: ax });
  return { body: path(D.d, dir) + path(I.d + A.d, ia), x1: D.bbox.x1, x2: A.bbox.x2, top: -70, bot: 0 };
}

export function lockup(w, symBody, { symH = 100, gap = 28, pad = 8 } = {}) {
  const s = symH / 100, sy = -35 - symH / 2;
  const sx = w.x1 - gap - symH;
  const g = `<g transform="translate(${f2(sx)} ${f2(sy)}) scale(${f2(s)})">${symBody}</g>`;
  const top = Math.min(sy, w.top), bot = Math.max(sy + symH, w.bot);
  return svgDoc([sx - pad, top - pad, w.x2 - sx + 2 * pad, bot - top + 2 * pad], g + w.body);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const syms = {
    'm-semi': monogram({ Rr: 30 }),
    'm-rubik': monogram({ Rr: 23 }),
    'm-cuadrada': monogram({ Rr: 16 }),
    'm-semi-Igrande': monogram({ Rr: 30, gapY: 5, S: 9.5, o: 5.5, t: 7 }),
    'm-semi-sinfondo': monogram({ Rr: 30, withTile: false, dCol: C.pizarra, iCol: C.chispaTexto }),
    'm-semi-neg': monogram({ Rr: 30, withTile: false }),
  };
  const items = [];
  for (const [k, b] of Object.entries(syms)) {
    write(out(`${k}.svg`), svgDoc([0, 0, 100, 100], b));
    const bg = k.endsWith('neg') ? C.pizarra : C.tiza;
    render(out(`${k}.svg`), out(`${k}.png`), { width: 260, bg, pad: 20 });
    items.push({ label: k, file: out(`${k}.png`) });
  }
  const L = [
    ['L1-700-semi', lockup(word({ weight: 700 }), syms['m-semi'])],
    ['L2-600-rubik', lockup(word({ weight: 600, o: 10, t: 12 }), syms['m-rubik'])],
    ['L3-neg-700', lockup(word({ weight: 700, dir: C.tiza, ia: C.chispa }), syms['m-semi-neg']), C.pizarra],
    ['L4-neg-tile-tiza', lockup(word({ weight: 700, dir: C.tiza, ia: C.chispa }), monogram({ tile: C.tiza, dCol: C.pizarra, iCol: C.chispaTexto })), C.pizarra],
    ['L5-sinfondo-700', lockup(word({ weight: 700 }), syms['m-semi-sinfondo'], { gap: 22 })],
    ['L6-600-semi', lockup(word({ weight: 600, o: 10, t: 12 }), syms['m-semi'])],
  ];
  for (const [k, svg, bg] of L) {
    write(out(`${k}.svg`), svg);
    render(out(`${k}.svg`), out(`${k}.png`), { width: 1000, bg: bg || C.tiza, pad: 30 });
    items.push({ label: k, file: out(`${k}.png`) });
  }
  sheet(out('ronda2.png'), items, { cols: 3, cell: 560 });
  execFileSync('node', [path_.join(here, 'pixeles.mjs'), out('pix-claro.png'), '--bg', C.tiza,
    ...['m-semi', 'm-rubik', 'm-cuadrada', 'm-semi-Igrande', 'm-semi-sinfondo'].map(k => out(`${k}.svg`))]);
  execFileSync('node', [path_.join(here, 'pixeles.mjs'), out('pix-oscuro.png'), '--bg', C.pizarra, out('m-semi-neg.svg')]);
  console.log('ok');
}
