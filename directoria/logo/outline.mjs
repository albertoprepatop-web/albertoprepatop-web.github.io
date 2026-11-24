#!/usr/bin/env node
// DirectorIA · texto a trazos (contornos) con las fuentes libres de la marca, Rubik y Nunito Sans (SIL OFL 1.1).
// Lo usa build.mjs para dibujar «DirectorIA» y el eslogan sin <text>.
//
// Como módulo:
//   import { outline } from './outline.mjs';
//   const j = outline('DirectorIA', { font: 'rubik', weight: 600, size: 100 });
//
// Desde la línea de órdenes (escribe el JSON en la salida estándar):
//   node outline.mjs --font rubik --weight 600 --size 100 --text "DirectorIA" [--tracking 0] [--x 0] [--y 0]
//                    [--svg salida.svg --fill "#17322C"]
//
// Fuentes: rubik y nunito-sans (paquetes @fontsource de package.json; se usa el archivo latin-<peso>-normal.woff).
// --tracking: espaciado extra entre letras, en fracción del cuerpo (−0.02 = 2 % más juntas).
// --x, --y: posición de la línea base del primer carácter.
//
// Resultado:
//   { font, weight, size, unitsPerEm, ascender, descender, capHeight, xHeight,  // métricas ya escaladas
//     width,                          // avance total del texto
//     bbox: {x1,y1,x2,y2},            // caja real de la tinta
//     glyphs: [{char, x, advance, d}],// un trazo por carácter (para colorear letras por separado)
//     d }                             // todos los trazos juntos
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const require = createRequire(import.meta.url);
const here = path.dirname(fileURLToPath(import.meta.url));
const INSTALAR = `Instálalas con «npm ci» en ${here} (hace falta Node 18 o posterior).`;

let opentype = null;
function cargarOpentype() {
  if (opentype) return opentype;
  try { opentype = require('opentype.js'); } catch (e) {
    if (e.code === 'MODULE_NOT_FOUND') throw new Error(`Falta la dependencia opentype.js. ${INSTALAR}`);
    throw e;
  }
  return opentype;
}

// Busca el .woff en las carpetas node_modules que vería Node desde aquí
function archivoFuente(font, weight, style) {
  const paquete = `@fontsource/${font}`;
  const nombre = `${font}-latin-${weight}-${style}.woff`;
  const carpetas = (require.resolve.paths(paquete) || []).map(d => path.join(d, paquete));
  const raiz = carpetas.find(d => fs.existsSync(path.join(d, 'package.json')));
  if (!raiz) throw new Error(`Falta la fuente ${paquete}. ${INSTALAR}`);
  const file = path.join(raiz, 'files', nombre);
  if (!fs.existsSync(file)) {
    const dir = path.join(raiz, 'files');
    const hay = fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => f.includes('-latin-') && f.endsWith('.woff')).join(', ') : '(ninguno)';
    throw new Error(`No existe ${file}\nArchivos disponibles en ${paquete}: ${hay}`);
  }
  return file;
}

const cache = new Map();
function fuente(font, weight, style) {
  const key = `${font}|${weight}|${style}`;
  if (!cache.has(key)) {
    const ot = cargarOpentype();
    const buf = fs.readFileSync(archivoFuente(font, weight, style));
    cache.set(key, ot.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)));
  }
  return cache.get(key);
}

export function outline(text, { font = 'rubik', weight = 700, style = 'normal', size = 100, tracking = 0, x: x0 = 0, y: y0 = 0 } = {}) {
  const f = fuente(font, weight, style);
  const scale = size / f.unitsPerEm;
  const glyphs = [];
  let x = x0;
  const chars = Array.from(text);
  let prev = null;
  let x1 = Infinity, y1 = Infinity, x2 = -Infinity, y2 = -Infinity;
  for (const ch of chars) {
    const g = f.charToGlyph(ch);
    if (prev) x += f.getKerningValue(prev, g) * scale;
    const p = g.getPath(x, y0, size);
    const bb = p.getBoundingBox();
    if (isFinite(bb.x1) && bb.x2 > bb.x1) {
      x1 = Math.min(x1, bb.x1); y1 = Math.min(y1, bb.y1); x2 = Math.max(x2, bb.x2); y2 = Math.max(y2, bb.y2);
    }
    const adv = g.advanceWidth * scale;
    glyphs.push({ char: ch, x: +x.toFixed(2), advance: +adv.toFixed(2), d: p.toPathData(2) });
    x += adv + tracking * size;
    prev = g;
  }
  const os2 = f.tables.os2 || {};
  return {
    font, weight: +weight, size,
    unitsPerEm: f.unitsPerEm,
    ascender: +(f.ascender * scale).toFixed(2),
    descender: +(f.descender * scale).toFixed(2),
    capHeight: os2.sCapHeight ? +(os2.sCapHeight * scale).toFixed(2) : null,
    xHeight: os2.sxHeight ? +(os2.sxHeight * scale).toFixed(2) : null,
    width: +(x - x0 - (chars.length ? tracking * size : 0)).toFixed(2),
    bbox: { x1: +x1.toFixed(2), y1: +y1.toFixed(2), x2: +x2.toFixed(2), y2: +y2.toFixed(2) },
    glyphs,
    d: glyphs.map(g => g.d).join(' '),
  };
}

// ---------- Línea de órdenes ----------
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const arg = (name, def) => { const i = process.argv.indexOf('--' + name); return i > -1 ? process.argv[i + 1] : def; };
  try {
    const size = parseFloat(arg('size', '100'));
    const out = outline(arg('text', 'DirectorIA'), {
      font: arg('font', 'rubik'), weight: arg('weight', '700'), style: arg('style', 'normal'), size,
      tracking: parseFloat(arg('tracking', '0')), x: parseFloat(arg('x', '0')), y: parseFloat(arg('y', '0')),
    });
    const svgOut = arg('svg', null);
    if (svgOut) {
      const { x1, y1, x2, y2 } = out.bbox; const pad = size * 0.1;
      const vb = [x1 - pad, y1 - pad, (x2 - x1) + 2 * pad, (y2 - y1) + 2 * pad].map(v => v.toFixed(1)).join(' ');
      fs.writeFileSync(svgOut, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}"><path fill="${arg('fill', '#17322C')}" d="${out.d}"/></svg>\n`);
    }
    process.stdout.write(JSON.stringify(out) + '\n');
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
}
