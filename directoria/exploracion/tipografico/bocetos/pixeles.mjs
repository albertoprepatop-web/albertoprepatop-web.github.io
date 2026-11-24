// Muestra SVG a tamaño real pequeño (16, 24, 32, 48 px) y ampliados con píxeles visibles,
// para juzgar de verdad cómo se ve el símbolo como favicon.
// Uso: node pixeles.mjs salida.png --bg "#F6F3EC" a.svg b.svg ...
import { createRequire } from 'node:module';
import fs from 'node:fs';
import { TOOLS } from './lib.mjs';
const require = createRequire(TOOLS + '/package.json');
const { chromium } = require('playwright');

const argv = process.argv.slice(2);
const out = argv[0];
const bgI = argv.indexOf('--bg');
const bg = bgI > -1 ? argv[bgI + 1] : '#F6F3EC';
const files = argv.slice(1).filter((a, i, arr) => !a.startsWith('--') && arr[i - 1] !== '--bg');
const sizes = [16, 24, 32, 48];

const browser = await chromium.launch();
// 1) captura real de cada tamaño
const shots = [];
for (const f of files) {
  const uri = 'data:image/svg+xml;base64,' + fs.readFileSync(f).toString('base64');
  const row = [];
  for (const s of sizes) {
    const page = await browser.newPage({ viewport: { width: s, height: s }, deviceScaleFactor: 1 });
    await page.setContent(`<html><body style="margin:0;background:${bg}"><img src="${uri}" style="display:block;width:${s}px;height:${s}px"></body></html>`);
    const buf = await page.screenshot();
    row.push({ s, b64: buf.toString('base64') });
    await page.close();
  }
  shots.push({ f, row });
}
// 2) hoja: tamaño real + ampliado x8 con píxeles nítidos
const html = `<html><body style="margin:0;padding:20px;background:#fff;font:14px Arial">
${shots.map(sh => `<div style="display:flex;gap:24px;align-items:flex-end;margin-bottom:24px;padding:16px;background:${bg}">
  <div style="width:160px;color:#888">${sh.f.split('/').pop()}</div>
  ${sh.row.map(r => `<div style="display:flex;flex-direction:column;align-items:center;gap:6px"><img src="data:image/png;base64,${r.b64}" style="width:${r.s}px;height:${r.s}px"><span style="color:#888">${r.s}</span></div>`).join('')}
  ${sh.row.filter(r => r.s <= 32).map(r => `<img src="data:image/png;base64,${r.b64}" style="width:${r.s * (r.s === 16 ? 8 : 4)}px;height:${r.s * (r.s === 16 ? 8 : 4)}px;image-rendering:pixelated">`).join('')}
</div>`).join('')}
</body></html>`;
const page = await browser.newPage({ viewport: { width: 1100, height: 300 } });
await page.setContent(html);
await page.screenshot({ path: out, fullPage: true });
await browser.close();
console.log('OK ' + out);
