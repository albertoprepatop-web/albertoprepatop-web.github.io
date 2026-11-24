#!/usr/bin/env node
// Genera los PNG de redes sociales de DirectorIA a partir de los HTML de esta carpeta.
//
// Cada HTML mide exactamente lo que mide su imagen y Chromium lo captura a 1 px CSS = 1 px de imagen,
// con las fuentes locales (directoria/fuentes) y los SVG reales del logotipo y de las ilustraciones.
// Después marca cada PNG como sRGB (bloque sRGB, intención perceptual): los colores ya son sRGB
// y así lo declara el archivo. Las imágenes salen opacas (RGB de 8 bits, sin canal alfa).
//
// Requisitos: Node 18 o posterior y Playwright con su Chromium, por ejemplo:
//   npm install --global playwright@1.63.0
//   npx playwright install chromium
//
// Uso (desde cualquier carpeta):
//   node directoria/aplicaciones/redes/html/generar.mjs           todas las imágenes
//   node directoria/aplicaciones/redes/html/generar.mjs avatar    solo las que contienen «avatar» en el nombre
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const aqui = path.dirname(fileURLToPath(import.meta.url));
const carpetaSalida = path.resolve(aqui, '..');

// [página HTML, imagen PNG, ancho, alto]
const PIEZAS = [
  ['avatar.html', 'avatar-400.png', 400, 400],
  ['linkedin-banner.html', 'linkedin-banner.png', 1584, 396],
  ['x-cabecera.html', 'x-cabecera.png', 1500, 500],
  ['compartir.html', 'compartir-1200x630.png', 1200, 630],
  ['post-presentacion.html', 'post-presentacion.png', 1200, 1200],
  ['post-sustituciones.html', 'post-sustituciones.png', 1200, 1200],
];

function cargarPlaywright() {
  const require = createRequire(import.meta.url);
  try { return require('playwright'); } catch { /* se prueba la instalación global */ }
  try {
    const global = execSync('npm root -g', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
    return require(path.join(global, 'playwright'));
  } catch {
    console.error('Falta Playwright. Instaladlo con:\n  npm install --global playwright@1.63.0\n  npx playwright install chromium');
    process.exit(1);
  }
}

// --- PNG: CRC-32 y bloques -------------------------------------------------------------
const TABLA_CRC = new Uint32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
function crc32(buf) {
  let c = 0xFFFFFFFF;
  for (const b of buf) c = TABLA_CRC[(c ^ b) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}
function bloque(tipo, datos) {
  const cab = Buffer.alloc(8);
  cab.writeUInt32BE(datos.length, 0);
  cab.write(tipo, 4, 'ascii');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([Buffer.from(tipo, 'ascii'), datos])), 0);
  return Buffer.concat([cab, datos, crc]);
}
// Deja IHDR, añade sRGB justo detrás y quita cualquier otra declaración de color (gAMA, cHRM, iCCP, sRGB).
function marcarSRGB(png, nombre, ancho, alto) {
  const firma = png.subarray(0, 8);
  const partes = [firma];
  let i = 8;
  while (i < png.length) {
    const largo = png.readUInt32BE(i);
    const tipo = png.toString('ascii', i + 4, i + 8);
    const total = 12 + largo;
    if (tipo === 'IHDR') {
      const w = png.readUInt32BE(i + 8), h = png.readUInt32BE(i + 12);
      const bits = png[i + 16], tipoColor = png[i + 17];
      if (w !== ancho || h !== alto) throw new Error(`${nombre}: mide ${w} × ${h} y debería medir ${ancho} × ${alto}`);
      if (bits !== 8 || tipoColor !== 2) throw new Error(`${nombre}: se esperaba RGB de 8 bits sin alfa (tipo ${tipoColor}, ${bits} bits)`);
      partes.push(png.subarray(i, i + total), bloque('sRGB', Buffer.from([0])));
    } else if (!['sRGB', 'gAMA', 'cHRM', 'iCCP'].includes(tipo)) {
      partes.push(png.subarray(i, i + total));
    }
    i += total;
  }
  return Buffer.concat(partes);
}

// --- Captura ---------------------------------------------------------------------------
const filtro = process.argv[2];
const piezas = PIEZAS.filter(([html, png]) => !filtro || html.includes(filtro) || png.includes(filtro));
if (!piezas.length) { console.error('Ninguna pieza coincide con «' + filtro + '»'); process.exit(1); }

const { chromium } = cargarPlaywright();
const navegador = await chromium.launch();
try {
  for (const [html, png, ancho, alto] of piezas) {
    const pagina = await navegador.newPage({ viewport: { width: ancho, height: alto }, deviceScaleFactor: 1 });
    await pagina.goto(pathToFileURL(path.join(aqui, html)).href);
    await pagina.waitForLoadState('networkidle');
    const fallos = await pagina.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all([...document.images].map(img => img.decode().catch(() => null)));
      const malas = [...document.images].filter(img => !img.complete || img.naturalWidth === 0).map(img => img.getAttribute('src'));
      const conTexto = document.body.innerText.trim().length > 0;
      const fuentes = ['600 40px Rubik', '600 40px "Nunito Sans"'].filter(f => !document.fonts.check(f));
      return { malas, fuentes: conTexto ? fuentes : [] };
    });
    if (fallos.malas.length) throw new Error(`${html}: no se han cargado ${fallos.malas.join(', ')}`);
    if (fallos.fuentes.length) throw new Error(`${html}: no se han cargado las fuentes ${fallos.fuentes.join(', ')}`);
    const captura = await pagina.screenshot({ type: 'png' });
    await pagina.close();
    const destino = path.join(carpetaSalida, png);
    fs.writeFileSync(destino, marcarSRGB(captura, png, ancho, alto));
    console.log(`OK ${png} (${ancho} × ${alto}, ${Math.round(fs.statSync(destino).size / 1024)} KB)`);
  }
} finally {
  await navegador.close();
}
