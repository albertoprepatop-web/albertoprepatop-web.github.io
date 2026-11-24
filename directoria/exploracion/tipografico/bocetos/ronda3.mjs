// Ronda 3 (refinado 1): monograma más grande en la ficha y ajustado a la rejilla de 32 px;
// comparación de la curva de la D, del tamaño de la ficha y de las versiones en negativo.
import { rrect, serifI, svgDoc, path, render, sheet, write, C } from './lib.mjs';
import { dOutline, word, lockup } from './ronda2.mjs';
import { execFileSync } from 'node:child_process';
import path_ from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path_.dirname(fileURLToPath(import.meta.url));
execFileSync('mkdir', ['-p', path_.join(here, 'r3')]);
const out = n => path_.join(here, 'r3', n);
const u = 100 / 32; // un píxel de un favicon de 32 px

export function mono2({ Rr = 0.5, tile = C.pizarra, dCol = C.tiza, iCol = C.chispa, withTile = true, tileR = 7 * u,
  left = 6.5 * u, W = 20 * u, top = 5.5 * u, H = 21 * u, ss = 4 * u, sa = 3.5 * u, sr = 4 * u,
  Hi = 9.5 * u, S = 3 * u, o = 2.25 * u, t = 2.5 * u, shiftX = -1 } = {}) {
  const D = dOutline({ left, top, W, H, ss, sa, sr, Rr: Rr * H });
  const c = D.counter;
  const Iw = S + 2 * o;
  const cx = (c.x1 + c.x2) / 2 + shiftX;
  const base = (c.y1 + c.y2) / 2 + Hi / 2;
  const I = serifI({ x: cx - Iw / 2, base, H: Hi, S, o, t, r: 1.2 });
  return (withTile ? path(rrect(0, 0, 100, 100, tileR), tile) : '') + path(D.d, dCol) + path(I.d, iCol);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const syms = {
    'semi': mono2({ Rr: 0.5 }),
    'media': mono2({ Rr: 0.42 }),
    'semi-negA-sinficha': mono2({ Rr: 0.5, withTile: false }),
    'semi-negB-fichatiza': mono2({ Rr: 0.5, tile: C.tiza, dCol: C.pizarra, iCol: C.chispaTexto }),
    'semi-negC-ficha2': mono2({ Rr: 0.5, tile: C.pizarra2 }),
  };
  const items = [];
  for (const [k, b] of Object.entries(syms)) {
    write(out(`${k}.svg`), svgDoc([0, 0, 100, 100], b));
    const bg = k.includes('neg') ? C.pizarra : C.tiza;
    render(out(`${k}.svg`), out(`${k}.png`), { width: 220, bg, pad: 20 });
    items.push({ label: k, file: out(`${k}.png`) });
  }
  const w6 = (o = {}) => word({ weight: 600, o: 10, t: 12, ...o });
  const L = [
    ['L-semi-100', lockup(w6(), syms.semi, { symH: 100, gap: 28 })],
    ['L-media-100', lockup(w6(), syms.media, { symH: 100, gap: 28 })],
    ['L-semi-110', lockup(w6(), syms.semi, { symH: 110, gap: 30 })],
    ['L-negA', lockup(w6({ dir: C.tiza }), syms['semi-negA-sinficha'], { symH: 100, gap: 24 }), C.pizarra],
    ['L-negB', lockup(w6({ dir: C.tiza }), syms['semi-negB-fichatiza'], { symH: 100, gap: 28 }), C.pizarra],
    ['L-negC', lockup(w6({ dir: C.tiza }), syms['semi-negC-ficha2'], { symH: 100, gap: 28 }), C.pizarra],
    ['L-mono-pizarra', lockup(w6({ ia: C.pizarra }), mono2({ dCol: C.tiza, iCol: C.tiza }), { symH: 100, gap: 28 }), C.papel],
    ['L-700-semi-100', lockup(word({ weight: 700, o: 11, t: 13 }), syms.semi, { symH: 100, gap: 28 })],
  ];
  for (const [k, svg, bg] of L) {
    write(out(`${k}.svg`), svg);
    render(out(`${k}.svg`), out(`${k}.png`), { width: 1000, bg: bg || C.tiza, pad: 30 });
    items.push({ label: k, file: out(`${k}.png`) });
  }
  sheet(out('ronda3.png'), items, { cols: 3, cell: 560 });
  execFileSync('node', [path_.join(here, 'pixeles.mjs'), out('pix-claro.png'), '--bg', C.tiza, out('semi.svg'), out('media.svg')]);
  execFileSync('node', [path_.join(here, 'pixeles.mjs'), out('pix-oscuro.png'), '--bg', C.pizarra,
    out('semi-negA-sinficha.svg'), out('semi-negB-fichatiza.svg'), out('semi-negC-ficha2.svg')]);
  console.log('ok');
}
