// Recorre la demo con Playwright y hace capturas.
// Uso: node probar.mjs <index.html> <carpeta-capturas> [rutas separadas por comas]
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
import path from 'node:path';
import fs from 'node:fs';

const archivo = path.resolve(process.argv[2]);
const salida = path.resolve(process.argv[3] || 'capturas');
fs.mkdirSync(salida, { recursive: true });
const url = 'file://' + archivo;
const errores = [];

const navegador = await chromium.launch();
async function pagina(ancho, alto, movil) {
  const ctx = await navegador.newContext({ viewport: { width: ancho, height: alto }, deviceScaleFactor: 1, isMobile: !!movil, hasTouch: !!movil });
  const p = await ctx.newPage();
  p.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errores.push(`[${ancho}] consola ${m.type()}: ${m.text()}`); });
  p.on('pageerror', (e) => errores.push(`[${ancho}] error: ${e.message}`));
  return p;
}
async function ir(p, hash) { await p.goto(url + (hash ? '#' + hash : '')); await p.waitForTimeout(150); }
async function foto(p, nombre, completa = true) { await p.screenshot({ path: path.join(salida, nombre + '.png'), fullPage: completa }); }
async function desborde(p, nombre) {
  const d = await p.evaluate(() => {
    const ancho = document.documentElement.clientWidth;
    const fuera = [];
    document.querySelectorAll('body *').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width && r.right > ancho + 1 && !el.closest('.tabla-caja, .menu nav, .pestanas')) fuera.push((el.className || el.tagName) + ' ' + Math.round(r.right));
    });
    return { scroll: document.documentElement.scrollWidth > ancho, fuera: fuera.slice(0, 6) };
  });
  if (d.scroll || d.fuera.length) errores.push(`[${nombre}] desborde horizontal: ${JSON.stringify(d)}`);
}

const roles = await (async () => { const p = await pagina(1440, 900); await ir(p, ''); const r = await p.evaluate(() => Object.keys(window.DEMO.roles)); await p.close(); return r; })();

// Escritorio
const p = await pagina(1440, 900);
await ir(p, ''); await foto(p, '00-acceso', false); await desborde(p, 'acceso');
for (const rol of roles) {
  await ir(p, rol); await foto(p, `${rol}-1-inicio`); await desborde(p, rol + ' inicio');
  await ir(p, rol + '-correo'); await foto(p, `${rol}-2-correo`); await desborde(p, rol + ' correo');
  const mods = await p.evaluate((r) => window.DEMO.roles[r].modulos.map((m) => m.id), rol);
  for (const [i, m] of mods.entries()) { await ir(p, rol + '-' + m); await foto(p, `${rol}-${3 + i}-${m}`); await desborde(p, rol + ' ' + m); }
}

// Interacciones clave
if (roles.includes('jefatura')) {
  const g = await p.evaluate(() => (window.DEMO.roles.jefatura.modulos.find((m) => m.tipo === 'aprobaciones') || {}).id);
  if (g) {
    await ir(p, 'jefatura-' + g);
    const todo = p.locator(`[data-k="todo-${g}"]`);
    if (await todo.count()) { await todo.click(); await p.waitForTimeout(200); await foto(p, 'x-jefatura-guardias-confirmadas'); }
  }
}
if (roles.includes('sustituto')) {
  const f = await p.evaluate(() => (window.DEMO.roles.sustituto.modulos.find((m) => m.tipo === 'ficha') || {}).id);
  if (f) { await p.evaluate(() => {}); await p.goto(url + '#sustituto-' + f); await p.waitForTimeout(150); await foto(p, 'x-sustituto-ficha-tras-confirmar'); }
}
// Correo: responder al primero que tenga respuestas
for (const rol of roles.slice(0, 2)) {
  await ir(p, rol + '-correo');
  const c = await p.evaluate((r) => (window.DEMO.roles[r].correo.find((x) => x.respuestas.length) || {}).id, rol);
  if (!c) continue;
  await p.locator(`[data-k="msg-${c}"]`).click();
  await p.locator(`[data-k="enviar-${c}"]`).click();
  await p.waitForTimeout(150); await foto(p, `x-${rol}-confirmar-envio`, false);
  await p.locator('#confirmar-si').click(); await p.waitForTimeout(200); await foto(p, `x-${rol}-enviado`);
}
// Docente: dictado y banco
if (roles.includes('docente')) {
  const mods = await p.evaluate(() => window.DEMO.roles.docente.modulos.map((m) => [m.id, m.tipo]));
  const dict = mods.find((m) => m[1] === 'dictado'); const banco = mods.find((m) => m[1] === 'banco'); const mat = mods.find((m) => m[1] === 'material');
  if (dict) { await ir(p, 'docente-' + dict[0]); await p.locator('[data-k="dictar"]').click(); await p.waitForTimeout(4500); await p.locator('[data-k="redactar"]').click(); await p.waitForTimeout(150); await foto(p, 'x-docente-dictado-borrador'); }
  if (banco) { await ir(p, 'docente-' + banco[0]); await p.locator('[data-k="adaptar"]').click(); await p.waitForTimeout(400); await foto(p, 'x-docente-banco-adaptado'); await p.locator('[data-k="tab-subir"]').click(); await foto(p, 'x-docente-banco-subir'); await p.locator('[data-k="tab-impacto"]').click(); await foto(p, 'x-docente-banco-impacto'); }
  if (mat) { await ir(p, 'docente-' + mat[0]); await p.locator('[data-k="probar-filtro"]').click(); await foto(p, 'x-docente-material-filtro'); await p.locator('[data-k="pedir"]').click(); }
}

// Móvil
const m = await pagina(390, 844, true);
await ir(m, ''); await foto(m, 'm-acceso'); await desborde(m, 'móvil acceso');
for (const rol of roles) {
  await ir(m, rol); await desborde(m, 'móvil ' + rol);
  await ir(m, rol + '-correo'); await desborde(m, 'móvil ' + rol + ' correo');
  const mods = await m.evaluate((r) => window.DEMO.roles[r].modulos.map((x) => x.id), rol);
  for (const x of mods) { await ir(m, rol + '-' + x); await desborde(m, 'móvil ' + rol + ' ' + x); }
}
await ir(m, roles[0]); await foto(m, 'm-' + roles[0] + '-inicio');
await ir(m, roles[0] + '-correo'); await foto(m, 'm-' + roles[0] + '-correo');
const primero = await m.evaluate((r) => window.DEMO.roles[r].correo[0].id, roles[0]);
await m.locator(`[data-k="msg-${primero}"]`).click(); await m.waitForTimeout(150); await foto(m, 'm-' + roles[0] + '-correo-leer');

await navegador.close();
fs.writeFileSync(path.join(salida, 'errores.txt'), errores.join('\n'));
console.log(errores.length ? errores.join('\n') : 'Sin errores de consola ni desbordes.');
console.log('Capturas en ' + salida);
