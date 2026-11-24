#!/usr/bin/env node
// DirectorIA · PNG del logotipo, sacados de los SVG de esta carpeta con resvg (sin navegador).
//
// «npm run png» (es «node png.mjs») escribe en png/ el juego completo:
//   logo-horizontal, logotipo y logo-eslogan, en positivo y en negativo, con fondo transparente y con el área de
//   respeto (1 x) incluida como margen transparente, a 600 y a 1600 px de ancho;
//   logo-horizontal-negativo-fondo-1600.png, el negativo sobre su fondo pizarra;
//   logotipo-firma.png y logotipo-firma-2x.png, para la firma de correo;
//   app-icon-512.png.
//
// Un PNG suelto de cualquier SVG de la carpeta:
//   node png.mjs logo-vertical.svg --ancho 1600 [--fondo "#17322C"] [--sin-margen] [--ppp 300] [--salida png/x.png]
//   Por defecto lleva como margen el área de respeto de su versión: 1 x en las versiones con palabra, 1 a en el
//   isotipo y nada en el favicon y el icono, que ya van sobre su ficha. Con --sin-margen, el margen pequeño del SVG.
//
// Cada PNG lleva anotada su resolución, para que Word, PowerPoint y Outlook lo inserten ya a un tamaño razonable:
// los de 1600 px a 300 ppp (13,5 cm de ancho), los de 600 a 192 ppp (7,9 cm) y la firma 2x a 192 ppp, que así
// suele entrar a su tamaño de 1x (118 × 20 px).
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';
import { PAL, SIM, comprobarDependencias } from './build.mjs';
import { outline } from './outline.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
comprobarDependencias(['@resvg/resvg-js']);
const { Resvg } = require('@resvg/resvg-js');
const paper = require('paper');

const X = outline('DirectorIA', { font: 'rubik', weight: PAL.weight, size: 100 }).capHeight; // x = altura de la I de «IA» (70)
const A = 2 * SIM.hw;                 // a = ancho de la aguja en el isotipo (26)
const PIZARRA = '#17322C';
const FIRMA = { cap: 16, margen: 1 }; // firma de correo en 1x: mayúscula de 16 px y 1 px de margen mínimo
const SALIDA = path.join(here, 'png');

// ---------- Lectura del SVG: viewBox y caja real de la tinta ----------
function leerSvg(archivo) {
  const ruta = path.resolve(here, archivo);
  if (!fs.existsSync(ruta)) throw new Error(`No existe ${ruta}. Los SVG se generan con «npm run build».`);
  const svg = fs.readFileSync(ruta, 'utf8');
  const vb = /viewBox="([^"]+)"/.exec(svg)[1].trim().split(/[\s,]+/).map(Number);
  let tinta = null;
  for (const [, d] of svg.matchAll(/\sd="([^"]+)"/g)) {
    const b = new paper.CompoundPath({ pathData: d, insert: false }).bounds;
    tinta = tinta ? tinta.unite(b) : b;
  }
  return { svg, vb, tinta };
}

// ---------- Cajas de exportación ----------
// Tinta + margen m por los cuatro lados, a un ancho dado. El alto se redondea a píxel entero y la diferencia
// de proporción (menos de 1 px) se reparte arriba y abajo.
function cajaConMargen(t, m, ancho) {
  const w = t.width + 2 * m, h0 = t.height + 2 * m;
  const alto = Math.round(ancho * h0 / w), h = w * alto / ancho;
  return { vb: [t.left - m, t.top - m - (h - h0) / 2, w, h], ancho, alto };
}
// El viewBox del propio SVG, a un ancho dado
function cajaPropia(vb, ancho) {
  const alto = Math.round(ancho * vb[3] / vb[2]), h = vb[2] * alto / ancho;
  return { vb: [vb[0], vb[1] - (h - vb[3]) / 2, vb[2], h], ancho, alto };
}
// Firma de correo: márgenes mínimos y ajuste a píxel en 1x. La línea base (y = 0) y la altura de mayúscula caen
// en píxel entero y el asta de la D empieza en una columna entera. La 2x es la misma caja con el doble de píxeles.
function cajaFirma(t, escala) {
  const s = FIRMA.cap / X, m = FIRMA.margen; // s = px por unidad en 1x
  const arriba = Math.ceil(-t.top * s + m), abajo = Math.ceil(t.bottom * s + m);
  const ancho = Math.ceil(m + t.width * s + m);
  return { vb: [t.left - m / s, -arriba / s, ancho / s, (arriba + abajo) / s], ancho: ancho * escala, alto: (arriba + abajo) * escala };
}

// ---------- PNG ----------
function renderizar(svg, caja, fondo) {
  const conCaja = svg.replace(/viewBox="[^"]+"/, `viewBox="${caja.vb.join(' ')}" width="${caja.ancho}" height="${caja.alto}"`);
  const opciones = { fitTo: { mode: 'original' }, font: { loadSystemFonts: false }, shapeRendering: 2 };
  if (fondo) opciones.background = fondo;
  const img = new Resvg(conCaja, opciones).render();
  if (img.width !== caja.ancho || img.height !== caja.alto) throw new Error(`Tamaño inesperado: ${img.width} × ${img.height}`);
  return img.asPng();
}
// Anota la resolución (fragmento pHYs, en píxeles por metro) justo después de la cabecera IHDR
const TABLA = new Uint32Array(256).map((_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; return c; });
const crc32 = buf => { let c = 0xFFFFFFFF; for (const b of buf) c = TABLA[(c ^ b) & 0xFF] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; };
const u32 = v => { const b = Buffer.alloc(4); b.writeUInt32BE(v >>> 0); return b; };
function conResolucion(png, ppp) {
  const ppm = Math.round(ppp / 0.0254), datos = Buffer.concat([u32(ppm), u32(ppm), Buffer.from([1])]);
  const cuerpo = Buffer.concat([Buffer.from('pHYs', 'latin1'), datos]);
  const trozo = Buffer.concat([u32(datos.length), cuerpo, u32(crc32(cuerpo))]);
  const partes = [png.subarray(0, 8)];
  for (let i = 8; i < png.length;) {
    const len = png.readUInt32BE(i), tipo = png.toString('latin1', i + 4, i + 8), fin = i + 12 + len;
    if (tipo !== 'pHYs') partes.push(png.subarray(i, fin));
    if (tipo === 'IHDR') partes.push(trozo);
    i = fin;
  }
  return Buffer.concat(partes);
}

function exportar({ svg: archivo, png, caja, fondo, ppp }) {
  const datos = leerSvg(archivo);
  const c = caja(datos);
  const buf = conResolucion(renderizar(datos.svg, c, fondo), ppp);
  const destino = path.resolve(SALIDA, png);
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  fs.writeFileSync(destino, buf);
  console.log(`${path.relative(here, destino).padEnd(46)} ${String(c.ancho).padStart(4)} × ${String(c.alto).padEnd(4)} ${String(ppp).padStart(3)} ppp ${fondo ? 'fondo ' + fondo : 'transparente'}`);
}

const margenDe = archivo => {
  const b = path.basename(archivo);
  if (b.startsWith('favicon') || b.startsWith('app-icon')) return null; // la ficha es su propia área
  return b.startsWith('isotipo') ? A : X;
};

// ---------- Juego completo ----------
function juego() {
  const trabajos = [];
  for (const v of ['logo-horizontal', 'logotipo', 'logo-eslogan']) {
    for (const color of ['', '-negativo']) {
      for (const [ancho, ppp] of [[600, 192], [1600, 300]]) {
        trabajos.push({ svg: `${v}${color}.svg`, png: `${v}${color}-${ancho}.png`, ppp, caja: d => cajaConMargen(d.tinta, X, ancho) });
      }
    }
  }
  trabajos.push({ svg: 'logo-horizontal-negativo.svg', png: 'logo-horizontal-negativo-fondo-1600.png', ppp: 300, fondo: PIZARRA, caja: d => cajaConMargen(d.tinta, X, 1600) });
  trabajos.push({ svg: 'logotipo.svg', png: 'logotipo-firma.png', ppp: 96, caja: d => cajaFirma(d.tinta, 1) });
  trabajos.push({ svg: 'logotipo.svg', png: 'logotipo-firma-2x.png', ppp: 192, caja: d => cajaFirma(d.tinta, 2) });
  trabajos.push({ svg: 'app-icon.svg', png: 'app-icon-512.png', ppp: 96, caja: d => cajaPropia(d.vb, 512) });
  return trabajos;
}

try {
  const args = process.argv.slice(2);
  const opt = (n, def) => { const i = args.indexOf('--' + n); return i > -1 ? args[i + 1] : def; };
  if (args[0] && args[0].endsWith('.svg')) {
    const archivo = args[0], ancho = parseInt(opt('ancho', '1600'), 10), m = margenDe(archivo);
    const sinMargen = args.includes('--sin-margen') || m === null;
    exportar({
      svg: archivo, png: path.resolve(opt('salida', path.join(SALIDA, `${path.basename(archivo, '.svg')}-${ancho}.png`))),
      ppp: parseFloat(opt('ppp', '300')), fondo: opt('fondo', null),
      caja: d => (sinMargen ? cajaPropia(d.vb, ancho) : cajaConMargen(d.tinta, m, ancho)),
    });
  } else if (args.length) {
    throw new Error('Uso: node png.mjs  (juego completo)  o  node png.mjs <archivo.svg> --ancho 1600 [--fondo "#17322C"] [--sin-margen] [--ppp 300] [--salida ruta.png]');
  } else {
    for (const t of juego()) exportar(t);
  }
} catch (e) {
  console.error(`\nDirectorIA · logotipo: ${e.message}\n`);
  process.exit(1);
}
