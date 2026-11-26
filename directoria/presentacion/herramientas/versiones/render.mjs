#!/usr/bin/env node
// Renderiza diapositivas del mazo (formato Slides) a 1920x1080 con las hojas compartidas de deck.json,
// las fuentes locales Rubik y Nunito Sans y los /_blob/ cambiados por los archivos de blob-map.json.
// Además comprueba cada diapositiva: letra de menos de 24 px, elementos fuera del área segura
// (padding de 128 px; la marca y las imágenes a sangre se avisan aparte), contenedores que recortan,
// textos que se salen de su caja, textos que se pisan, contenido que se sale de su tarjeta, hijos que se salen de su rejilla
// o de su contenedor flex (aunque no tengan borde ni fondo) y palabra sola en la última línea.
//
// Uso:
//   node render.mjs <carpeta-del-mazo> <id> [<id> ...] [--out <carpeta>]
//   node render.mjs <carpeta-del-mazo> --order [--out <carpeta>]          (todas, en el orden de deck.json)
//   node render.mjs <carpeta-del-mazo> --sheet <hoja.png> [--cols 4]      (hoja de contactos con los PNG ya hechos)
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';

const require = createRequire('/opt/node-tools/node_modules/x.js');
const { chromium } = require('playwright');
const FONTS = '/home/user/albertoprepatop-web.github.io/directoria/fuentes/fuentes.css';

const argv = process.argv.slice(2);
const opt = (n, d) => { const i = argv.indexOf('--' + n); return i > -1 ? argv[i + 1] : d; };
const root = path.resolve(argv[0]);
const deck = JSON.parse(fs.readFileSync(path.join(root, 'project/deck.json'), 'utf8'));
const shared = (deck.format && deck.format.shared) || ['project/deck.css'];
const css = shared.map(f => fs.readFileSync(path.join(root, f), 'utf8')).join('\n');
const blobMap = JSON.parse(fs.readFileSync(path.join(root, 'blob-map.json'), 'utf8'));
const withBlobs = h => h.replace(/\/_blob\/[A-Za-z0-9_-]+/g, m => {
  if (!blobMap[m]) throw new Error('Blob sin archivo local: ' + m);
  return pathToFileURL(blobMap[m]).href;
});
const outDir = path.resolve(opt('out', path.join(root, 'renders')));
fs.mkdirSync(outDir, { recursive: true });

function pageHtml(sectionHtml) {
  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="${pathToFileURL(FONTS).href}">
<style>${css}
html,body{margin:0;padding:0;background:#888}
section{width:1920px;height:1080px;position:relative;overflow:hidden;flex-shrink:0}
aside{display:none !important}
</style></head><body>${sectionHtml}</body></html>`;
}

async function checks(page) {
  return page.evaluate(() => {
    const s = document.querySelector('section');
    const sr = s.getBoundingClientRect();
    const out = { small: [], beyond: [], clipped: [], spill: [], overlap: [], orphan: [], lines: [] };
    const all = [...s.querySelectorAll('*')].filter(e => !e.closest('aside'));
    const textEls = all.filter(e => [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()));
    const name = e => `${e.tagName.toLowerCase()}${e.className && typeof e.className === 'string' ? '.' + e.className.trim().split(/\s+/).join('.') : ''}`;
    const txt = e => e.textContent.trim().replace(/\s+/g, ' ').slice(0, 60);
    for (const e of textEls) {
      const fs = parseFloat(getComputedStyle(e).fontSize);
      if (fs < 23.5) out.small.push(`${name(e)} ${fs}px «${txt(e)}»`);
      if (e.scrollWidth > e.clientWidth + 1 && getComputedStyle(e).overflow !== 'visible') out.spill.push(`${name(e)} «${txt(e)}»`);
    }
    for (const e of all) {
      const b = e.getBoundingClientRect();
      if (b.width === 0 && b.height === 0) continue;
      if (e.classList.contains('marca')) continue;
      const L = b.left - sr.left, T = b.top - sr.top, R = b.right - sr.left, B = b.bottom - sr.top;
      if (B > 952.5 || R > 1792.5 || L < 127.5 || T < 100) out.beyond.push(`${name(e)} L${Math.round(L)} T${Math.round(T)} R${Math.round(R)} B${Math.round(B)}`);
      const cs = getComputedStyle(e);
      if ((cs.overflow === 'hidden' || cs.overflowX === 'hidden' || cs.overflowY === 'hidden') && e !== s) {
        if (e.scrollHeight > e.clientHeight + 1 || e.scrollWidth > e.clientWidth + 1) out.clipped.push(`${name(e)} contenido ${e.scrollWidth}x${e.scrollHeight} en ${e.clientWidth}x${e.clientHeight}`);
      }
    }
    // Textos que se pisan: rectángulos de las líneas de cada bloque de texto contra los de los demás bloques
    const rectsOf = e => {
      const r = document.createRange(); r.selectNodeContents(e);
      return [...r.getClientRects()].filter(x => x.width > 1 && x.height > 1);
    };
    const blocks = textEls.map(e => ({ e, rs: rectsOf(e) }));
    for (let i = 0; i < blocks.length; i++) for (let j = i + 1; j < blocks.length; j++) {
      const A = blocks[i], Bk = blocks[j];
      if (A.e.contains(Bk.e) || Bk.e.contains(A.e)) continue;
      let hit = false;
      for (const a of A.rs) { for (const b of Bk.rs) { if (a.left < b.right - 3 && b.left < a.right - 3 && a.top < b.bottom - 9 && b.top < a.bottom - 9) { hit = true; break; } } if (hit) break; }
      if (hit) out.overlap.push(`${name(A.e)} «${txt(A.e)}» ↔ ${name(Bk.e)} «${txt(Bk.e)}»`);
    }
    // Contenido que se sale de su tarjeta sin recortarse: un descendiente fuera de la caja de un contenedor con borde
    // o fondo y esquinas redondeadas (tarjetas, ventanas, bandas)
    out.desborda = [];
    for (const e of all) {
      const cs = getComputedStyle(e);
      const conCaja = parseFloat(cs.borderTopWidth) > 0 || cs.backgroundColor !== 'rgba(0, 0, 0, 0)';
      if (!conCaja || parseFloat(cs.borderTopLeftRadius) < 12) continue;
      const b = e.getBoundingClientRect();
      for (const d of e.querySelectorAll('*')) {
        const r = d.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        if (r.bottom > b.bottom + 1 || r.right > b.right + 1 || r.top < b.top - 1 || r.left < b.left - 1) {
          out.desborda.push(`${name(d)} «${txt(d)}» se sale de ${name(e)}`); break;
        }
      }
    }
    // Hijos que se salen de su rejilla o de su contenedor flex por abajo o por la derecha, aunque ni el hijo ni el
    // contenedor tengan borde o fondo (p. ej., tarjetas más altas que la fila de su rejilla). Más de 10 px, para no
    // avisar de los márgenes negativos pequeños que se ponen a propósito (ilustraciones de -8 px).
    out.rejilla = [];
    for (const e of all) {
      if (e === s) continue;
      const cs = getComputedStyle(e);
      if (!/^(inline-)?(grid|flex)$/.test(cs.display)) continue;
      const b = e.getBoundingClientRect();
      if (b.width === 0 || b.height === 0) continue;
      for (const d of e.children) {
        const ds = getComputedStyle(d);
        if (ds.position === 'absolute' || ds.position === 'fixed' || ds.display === 'none') continue;
        const r = d.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        const fuera = Math.max(r.bottom - b.bottom, r.right - b.right);
        if (fuera > 10) { out.rejilla.push(`${name(d)} «${txt(d)}» se sale ${Math.round(fuera)} px de ${name(e)}`); break; }
      }
    }
    // Palabra sola en la última línea de un bloque de varias líneas
    for (const e of all.filter(e => /^(H1|H2|H3|P|LI)$/.test(e.tagName))) {
      const words = [];
      const w = document.createTreeWalker(e, NodeFilter.SHOW_TEXT);
      let n;
      while ((n = w.nextNode())) {
        const re = /\S+/g; let m;
        while ((m = re.exec(n.textContent))) {
          const r = document.createRange(); r.setStart(n, m.index); r.setEnd(n, m.index + m[0].length);
          const rr = [...r.getClientRects()];
          if (rr.length) words.push({ w: m[0], top: Math.round(rr[0].top) });
        }
      }
      if (!words.length) continue;
      const tops = [...new Set(words.map(x => x.top))].sort((a, b) => a - b);
      const lines = [];
      for (const t of tops) if (!lines.length || t - lines[lines.length - 1] > 6) lines.push(t);
      const lastTop = lines[lines.length - 1];
      const last = words.filter(x => x.top >= lastTop - 6).map(x => x.w);
      out.lines.push(`${lines.length} l · ${txt(e)}`);
      if (lines.length > 1 && last.length === 1 && last[0].length < 12) out.orphan.push(`${name(e)} «${txt(e)}» → «${last[0]}»`);
    }
    return out;
  });
}

async function renderIds(ids) {
  const browser = await chromium.launch();
  try {
    for (const id of ids) {
      const f = path.join(root, 'project/slides', id + '.html');
      const html = withBlobs(fs.readFileSync(f, 'utf8'));
      if (!/<aside>[\s\S]+<\/aside>/.test(html)) console.log(`AVISO ${id}: sin notas en <aside>`);
      const tmp = path.join(outDir, `.prev-${id}.html`);
      fs.writeFileSync(tmp, pageHtml(html));
      const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
      await page.goto(pathToFileURL(tmp).href);
      await page.evaluate(() => document.fonts.ready);
      await page.waitForLoadState('networkidle');
      const broken = await page.evaluate(() => [...document.images].filter(i => !i.complete || i.naturalWidth === 0).map(i => i.src));
      const res = await checks(page);
      const png = path.join(outDir, id + '.png');
      await page.screenshot({ path: png, clip: { x: 0, y: 0, width: 1920, height: 1080 } });
      await page.close();
      fs.unlinkSync(tmp);
      const issues = [];
      if (broken.length) issues.push('IMAGEN ROTA: ' + broken.join(', '));
      for (const k of ['small', 'clipped', 'spill', 'overlap', 'orphan', 'desborda', 'rejilla']) for (const x of res[k]) issues.push(`${k}: ${x}`);
      if (argv.includes('--beyond')) for (const x of res.beyond) issues.push(`fuera: ${x}`);
      else if (res.beyond.length) issues.push(`fuera del área segura: ${res.beyond.length} elementos (con --beyond se listan)`);
      if (argv.includes('--lines')) for (const x of res.lines) issues.push(`  ${x}`);
      console.log(`${issues.length ? '··' : 'OK'} ${id}${issues.length ? '\n   ' + issues.join('\n   ') : ''}`);
    }
  } finally {
    await browser.close();
  }
}

async function sheet(out, cols) {
  const ids = deck.order;
  const secOf = {};
  for (const [k, v] of Object.entries(deck.sections || {})) secOf[v.start] = v.description;
  const cell = 456;
  const items = ids.map((id, i) => {
    const png = path.join(outDir, id + '.png');
    const src = fs.existsSync(png) ? 'data:image/png;base64,' + fs.readFileSync(png).toString('base64') : '';
    const sec = secOf[id] ? `<div class="sec">${secOf[id].replace(/</g, '&lt;')}</div>` : '<div class="sec"></div>';
    return `<div class="c">${sec}<img src="${src}"><div class="l"><b>${i + 1}</b> ${id}</div></div>`;
  }).join('');
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>
body{margin:0;padding:24px;background:#3b4a46;font:16px Arial,sans-serif;color:#fff}
.g{display:grid;grid-template-columns:repeat(${cols},${cell}px);gap:18px 18px}
.c img{display:block;width:${cell}px;height:${Math.round(cell * 9 / 16)}px;border-radius:4px;background:#888}
.l{margin-top:5px;font-size:15px}.l b{color:#E07A3A;margin-right:4px}
.sec{height:18px;font-size:12px;color:#C9DAD4;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:3px}
</style></head><body><div class="g">${items}</div></body></html>`;
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: cols * (cell + 18) + 30, height: 600 } });
    await page.setContent(html);
    await page.screenshot({ path: out, fullPage: true });
    await page.close();
  } finally { await browser.close(); }
  console.log('OK ' + out);
}

if (argv.includes('--sheet')) await sheet(path.resolve(opt('sheet')), parseInt(opt('cols', '4')));
else {
  const ids = argv.includes('--order') ? deck.order : argv.slice(1).filter((a, i, arr) => !a.startsWith('--') && !(i > 0 && arr[i - 1] === '--out'));
  await renderIds(ids);
}
