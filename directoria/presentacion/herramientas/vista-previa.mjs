#!/usr/bin/env node
// Vista previa aproximada de las diapositivas del mazo (formato Slides: una <section> por archivo, estilos en deck.css).
// Renderiza en un lienzo de 1920 × 1080 con las fuentes locales Rubik y Nunito Sans (directoria/fuentes/).
// Limitación: <x-icon>, <x-shape> y <x-connector> son elementos propios de Slides y aquí se ven como cajas vacías.
//
// Uso, desde cualquier carpeta:
//   node vista-previa.mjs <carpeta-del-mazo> <id-diapositiva> <salida.png> [--scale 0.5]
//   node vista-previa.mjs <carpeta-del-mazo> --all <salida-hoja.png> [--scale 0.25]   (todas, en el orden de deck.json)
//
// <carpeta-del-mazo> es la que contiene project/deck.json, project/deck.css y project/slides/ (en este repositorio,
// directoria/presentacion). Las imágenes subidas al mazo se citan como /_blob/<id>; blob-map.json, junto a este
// archivo, dice qué archivo del repositorio es cada una (rutas relativas a directoria/). Con --blob-map se usa otro.
// Necesita Node 18+ y Playwright con Chromium: require() lo encuentra instalado aquí (npm install) o global (NODE_PATH).
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const AQUI = path.dirname(fileURLToPath(import.meta.url));
const DIR = path.resolve(AQUI, '../..');                                     // directoria/
const FONTS = path.join(DIR, 'fuentes/fuentes.css');

const argv = process.argv.slice(2);
const opt = (n, d) => { const i = argv.indexOf('--' + n); return i > -1 ? argv[i + 1] : d; };
const root = path.resolve(argv[0]);
const all = argv[1] === '--all';
const scale = parseFloat(opt('scale', all ? '0.25' : '0.5'));
const deckCss = fs.readFileSync(path.join(root, 'project/deck.css'), 'utf8');
const deck = JSON.parse(fs.readFileSync(path.join(root, 'project/deck.json'), 'utf8'));
const blobMapFile = path.resolve(opt('blob-map', path.join(AQUI, 'blob-map.json')));
const blobMap = fs.existsSync(blobMapFile) ? JSON.parse(fs.readFileSync(blobMapFile, 'utf8')) : {};
const local = f => pathToFileURL(path.isAbsolute(f) ? f : path.join(DIR, f)).href;
const sinMapa = new Set();
const withBlobs = html => html.replace(/\/_blob\/[A-Za-z0-9_-]+/g, m => { if (blobMap[m]) return local(blobMap[m]); sinMapa.add(m); return m; });

function pageHtml(sectionsHtml, cols) {
  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="${pathToFileURL(FONTS).href}">
<style>${deckCss}
html,body{margin:0;padding:0;background:#888}
section{width:1920px;height:1080px;position:relative;overflow:hidden;flex-shrink:0}
aside{display:none !important}
x-icon,x-shape{display:inline-block;background:currentColor;opacity:.25;border-radius:6px}
.grid-prev{display:grid;grid-template-columns:repeat(${cols},1920px);gap:40px;padding:40px}
.lbl{font:600 48px Arial;color:#fff;margin:0 0 12px 0}
</style></head><body>${sectionsHtml}</body></html>`;
}

const browser = await chromium.launch();
try {
  if (!all) {
    const id = argv[1];
    const out = argv[2];
    const html = withBlobs(fs.readFileSync(path.join(root, 'project/slides', id + '.html'), 'utf8'));
    const tmp = path.join(path.dirname(path.resolve(out)), `.prev-${id}.html`);
    fs.writeFileSync(tmp, pageHtml(html, 1));
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: scale });
    await page.goto(pathToFileURL(tmp).href);
    await page.evaluate(() => document.fonts.ready);
    // Avisa de contenido que se sale del lienzo o de los márgenes inferiores
    const overflow = await page.evaluate(() => {
      const s = document.querySelector('section');
      const r = s.getBoundingClientRect();
      const bad = [];
      for (const el of s.querySelectorAll('*')) {
        if (el.closest('aside')) continue;
        const b = el.getBoundingClientRect();
        if (b.width === 0 && b.height === 0) continue;
        if (b.bottom > r.bottom - 64 || b.right > r.right - 64) bad.push(`${el.tagName.toLowerCase()}.${el.className} bottom=${Math.round(b.bottom)} right=${Math.round(b.right)}`);
      }
      return bad.slice(0, 12);
    });
    await page.screenshot({ path: out, clip: { x: 0, y: 0, width: 1920, height: 1080 } });
    fs.unlinkSync(tmp);
    console.log('OK ' + out);
    if (overflow.length) console.log('AVISO: elementos fuera del área segura (a menos de 64 px del borde):\n  ' + overflow.join('\n  '));
  } else {
    const out = argv[2];
    const cols = 3;
    const parts = deck.order.map((id, i) => {
      const f = path.join(root, 'project/slides', id + '.html');
      const h = fs.existsSync(f) ? withBlobs(fs.readFileSync(f, 'utf8')) : `<section><h2>Falta ${id}</h2></section>`;
      return `<div><p class="lbl">${i + 1}. ${id}</p>${h}</div>`;
    }).join('');
    const tmp = path.join(path.dirname(path.resolve(out)), `.prev-all.html`);
    fs.writeFileSync(tmp, pageHtml(`<div class="grid-prev">${parts}</div>`, cols));
    const page = await browser.newPage({ viewport: { width: cols * 1960 + 40, height: 1200 }, deviceScaleFactor: scale });
    await page.goto(pathToFileURL(tmp).href);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: out, fullPage: true });
    fs.unlinkSync(tmp);
    console.log('OK ' + out);
  }
  if (sinMapa.size) console.log('AVISO: imágenes sin archivo en blob-map.json (salen en blanco):\n  ' + [...sinMapa].join('\n  '));
} finally {
  await browser.close();
}
