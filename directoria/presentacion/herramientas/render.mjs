#!/usr/bin/env node
// Renderiza SVG o HTML a PNG (o HTML a PDF) con Chromium (Playwright). require() lo encuentra instalado
// aquí (npm install) o de forma global (NODE_PATH). Lo usa kit.sh para rehacer ilustraciones/kit.png.
//
// PNG de un SVG (escala el SVG al ancho pedido, fondo transparente por defecto):
//   node render.mjs logo.svg logo.png --width 1200 [--bg "#F6F3EC"] [--pad 0]
//
// PNG de un HTML (captura de página completa o de un tamaño fijo):
//   node render.mjs pagina.html captura.png --width 1440 [--height 900] [--full] [--scale 2]
//
// PDF de un HTML (usa los tamaños @page del CSS si existen):
//   node render.mjs tarjeta.html tarjeta.pdf --pdf [--page-width 85mm --page-height 55mm]
//
// Hoja de contactos (varias imágenes en una rejilla con etiquetas):
//   node render.mjs --sheet salida.png --cols 3 --cell 600 --label "A" a.png --label "B" b.png [--bg "#ffffff"]
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const argv = process.argv.slice(2);
function opt(name, def) {
  const i = argv.indexOf('--' + name);
  return i > -1 ? argv[i + 1] : def;
}
const flag = name => argv.includes('--' + name);

async function main() {
  const browser = await chromium.launch();
  try {
    if (flag('sheet')) return await sheet(browser);
    const [input, output] = argv.filter((a, i) => !a.startsWith('--') && !(i > 0 && argv[i - 1].startsWith('--') && !['--pdf', '--full', '--sheet'].includes(argv[i - 1])));
    if (!input || !output) throw new Error('Faltan entrada y salida');
    const abs = path.resolve(input);
    const scale = parseFloat(opt('scale', '1'));
    if (abs.endsWith('.svg')) {
      const svg = fs.readFileSync(abs, 'utf8');
      const vb = /viewBox\s*=\s*"([^"]+)"/.exec(svg);
      if (!vb) throw new Error('El SVG necesita viewBox');
      const [, , w, h] = vb[1].trim().split(/[\s,]+/).map(Number);
      const width = parseFloat(opt('width', '1200'));
      const pad = parseFloat(opt('pad', '0'));
      const height = Math.round(width * h / w);
      const bg = opt('bg', 'transparent');
      const page = await browser.newPage({ viewport: { width: Math.round(width + 2 * pad), height: Math.round(height + 2 * pad) }, deviceScaleFactor: scale });
      const data = 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
      await page.setContent(`<html><body style="margin:0;padding:${pad}px;background:${bg}"><img src="${data}" style="display:block;width:${width}px;height:${height}px"></body></html>`);
      await page.waitForLoadState('networkidle');
      await page.screenshot({ path: output, omitBackground: bg === 'transparent' });
      await page.close();
    } else {
      const width = parseInt(opt('width', '1440'));
      const height = parseInt(opt('height', '900'));
      const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: scale });
      await page.goto(pathToFileURL(abs).href);
      await page.waitForLoadState('networkidle');
      await page.evaluate(() => document.fonts && document.fonts.ready);
      if (flag('pdf') || output.endsWith('.pdf')) {
        const pw = opt('page-width', null), ph = opt('page-height', null);
        const o = { path: output, printBackground: true, preferCSSPageSize: !pw };
        if (pw) { o.width = pw; o.height = ph; }
        await page.pdf(o);
      } else {
        await page.screenshot({ path: output, fullPage: flag('full') });
      }
      await page.close();
    }
    console.log('OK ' + output);
  } finally {
    await browser.close();
  }
}

async function sheet(browser) {
  const output = opt('sheet');
  const cols = parseInt(opt('cols', '3'));
  const cell = parseInt(opt('cell', '520'));
  const bg = opt('bg', '#ffffff');
  const items = [];
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--label') { items.push({ label: argv[i + 1], file: argv[i + 2] }); i += 2; }
  }
  const html = `<html><body style="margin:0;padding:24px;background:${bg};font-family:Arial,sans-serif">
  <div style="display:grid;grid-template-columns:repeat(${cols},${cell}px);gap:24px">
  ${items.map(it => `<div style="border:1px solid #ccc;padding:12px;background:${bg}">
     <div style="height:${Math.round(cell * 0.62)}px;display:flex;align-items:center;justify-content:center">
       <img src="data:image/png;base64,${fs.readFileSync(it.file).toString('base64')}" style="max-width:100%;max-height:100%">
     </div>
     <div style="font-size:20px;margin-top:8px;color:#222">${it.label}</div></div>`).join('')}
  </div></body></html>`;
  const width = cols * cell + (cols - 1) * 24 + 48 + cols * 26;
  const page = await browser.newPage({ viewport: { width, height: 400 } });
  await page.setContent(html);
  await page.screenshot({ path: output, fullPage: true });
  await page.close();
  console.log('OK ' + output);
}

main().catch(e => { console.error(e.message); process.exit(1); });
