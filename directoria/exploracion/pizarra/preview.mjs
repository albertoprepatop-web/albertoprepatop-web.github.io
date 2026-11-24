// Hoja de pruebas propia: cada símbolo en grande (claro y oscuro), a 32 y 16 px reales,
// y los píxeles reales de 16 px ampliados ×8 para juzgar el favicon sin engañarse.
import { createRequire } from 'node:module';
import path from 'node:path';
import { TOOLS, C } from './lib.mjs';

const require = createRequire(path.join(TOOLS, 'package.json'));
const { chromium } = require('playwright');

const uri = svg => 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');

// items: [{label, pos: svgString, neg: svgString (opcional)}]
export async function previewSheet(out, items, { big = 180, title = '' } = {}) {
  const cells = items.map((it, i) => {
    const pos = uri(it.pos), neg = uri(it.neg || it.pos);
    return `<div class="cell">
      <div class="lab">${it.label}</div>
      <div class="row">
        <div class="box" style="background:${C.tiza}"><img src="${pos}" style="width:${big}px;height:${big}px"></div>
        <div class="box" style="background:${C.pizarra}"><img src="${neg}" style="width:${big}px;height:${big}px"></div>
      </div>
      <div class="row small">
        <div class="box s" style="background:${C.tiza}"><img src="${pos}" style="width:32px;height:32px"><img src="${pos}" style="width:16px;height:16px"></div>
        <div class="box s" style="background:${C.pizarra}"><img src="${neg}" style="width:32px;height:32px"><img src="${neg}" style="width:16px;height:16px"></div>
        <canvas data-src="${pos}" data-bg="${C.tiza}" width="128" height="128"></canvas>
        <canvas data-src="${neg}" data-bg="${C.pizarra}" width="128" height="128"></canvas>
      </div>
    </div>`;
  }).join('');
  const html = `<!doctype html><html><head><style>
    body{margin:0;padding:24px;background:#fff;font-family:Arial,sans-serif}
    h1{font:700 24px Arial;margin:0 0 16px}
    .grid{display:grid;grid-template-columns:repeat(3, 1fr);gap:20px}
    .cell{border:1px solid #ddd;border-radius:10px;padding:12px}
    .lab{font:700 16px Arial;color:#222;margin-bottom:8px}
    .row{display:flex;gap:10px;align-items:center}
    .box{display:flex;align-items:center;justify-content:center;border-radius:8px;padding:12px}
    .small{margin-top:10px}
    .s{gap:12px;padding:10px;height:56px}
    canvas{width:64px;height:64px;image-rendering:pixelated;border-radius:6px}
  </style></head><body>${title ? `<h1>${title}</h1>` : ''}<div class="grid">${cells}</div>
  <script>
    (async () => {
      for (const cv of document.querySelectorAll('canvas')) {
        const img = new Image(); img.src = cv.dataset.src; await img.decode();
        const s = document.createElement('canvas'); s.width = 16; s.height = 16;
        const sx = s.getContext('2d'); sx.fillStyle = cv.dataset.bg; sx.fillRect(0,0,16,16); sx.drawImage(img, 0, 0, 16, 16);
        const x = cv.getContext('2d'); x.imageSmoothingEnabled = false; x.drawImage(s, 0, 0, 128, 128);
      }
      document.body.dataset.done = '1';
    })();
  </script></body></html>`;
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1500, height: 800 } });
  await page.setContent(html);
  await page.waitForSelector('body[data-done="1"]');
  await page.screenshot({ path: out, fullPage: true });
  await browser.close();
}

// Logos horizontales en varios tamaños sobre claro y oscuro.
export async function previewLogos(out, items, { title = '' } = {}) {
  const rows = items.map(it => `<div class="cell"><div class="lab">${it.label}</div>
    <div class="pair">
      <div class="box" style="background:${C.tiza}"><img src="${uri(it.pos)}" style="height:${it.h || 90}px"></div>
      <div class="box" style="background:${C.pizarra}"><img src="${uri(it.neg || it.pos)}" style="height:${it.h || 90}px"></div>
    </div>
    <div class="pair">
      <div class="box" style="background:#fff;border:1px solid #ddd"><img src="${uri(it.pos)}" style="height:40px"><img src="${uri(it.pos)}" style="height:24px"><img src="${uri(it.pos)}" style="height:16px"></div>
      <div class="box" style="background:${C.pizarra}"><img src="${uri(it.neg || it.pos)}" style="height:40px"><img src="${uri(it.neg || it.pos)}" style="height:24px"><img src="${uri(it.neg || it.pos)}" style="height:16px"></div>
    </div></div>`).join('');
  const html = `<!doctype html><html><head><style>
    body{margin:0;padding:24px;background:#fff;font-family:Arial,sans-serif;width:1452px}
    h1{font:700 24px Arial;margin:0 0 16px}
    .cell{border:1px solid #ddd;border-radius:10px;padding:12px;margin-bottom:16px}
    .lab{font:700 16px Arial;color:#222;margin-bottom:8px}
    .pair{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px}
    .box{display:flex;align-items:center;justify-content:center;gap:28px;border-radius:8px;padding:24px;flex-wrap:wrap}
  </style></head><body>${title ? `<h1>${title}</h1>` : ''}${rows}</body></html>`;
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1500, height: 800 } });
  await page.setContent(html);
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: out, fullPage: true });
  await browser.close();
}
