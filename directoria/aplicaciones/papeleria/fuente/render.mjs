#!/usr/bin/env node
// Convierte un HTML en PDF o en PNG con Chromium (Playwright). Lo usa construir.sh.
//
//   node render.mjs pagina.html salida.pdf                       (tamaño de página: el @page del CSS)
//   node render.mjs pagina.html salida.png --width 520 --height 300 [--scale 2] [--full]
//
// Espera a que carguen las fuentes (fuentes.css) antes de imprimir o capturar.
import { createRequire } from 'node:module';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

// require() encuentra Playwright tanto instalado aquí (npm install) como instalado de forma global (NODE_PATH)
const { chromium } = createRequire(import.meta.url)('playwright');

const args = process.argv.slice(2);
const opt = (nombre, porDefecto) => {
  const i = args.indexOf('--' + nombre);
  return i > -1 ? args[i + 1] : porDefecto;
};
const [entrada, salida] = args.filter((a, i) => !a.startsWith('--') && !(i > 0 && args[i - 1].startsWith('--') && args[i - 1] !== '--full'));
if (!entrada || !salida) {
  console.error('Uso: node render.mjs entrada.html salida.(pdf|png) [--width W --height H --scale 2 --full]');
  process.exit(1);
}

const navegador = await chromium.launch();
try {
  const pagina = await navegador.newPage({
    viewport: { width: parseInt(opt('width', '1200')), height: parseInt(opt('height', '900')) },
    deviceScaleFactor: parseFloat(opt('scale', '1')),
  });
  await pagina.goto(pathToFileURL(path.resolve(entrada)).href);
  await pagina.waitForLoadState('networkidle');
  await pagina.evaluate(() => document.fonts.ready);
  if (salida.endsWith('.pdf')) {
    await pagina.pdf({ path: salida, printBackground: true, preferCSSPageSize: true });
  } else {
    await pagina.screenshot({ path: salida, fullPage: args.includes('--full') });
  }
  console.log('OK ' + salida);
} finally {
  await navegador.close();
}
