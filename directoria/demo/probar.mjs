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

// Inicio de los seis perfiles, primera pantalla, a anchos de portátil, de proyector y de tableta apaisada
// (1366×768, 1280×720 y 1180×820). Cada ancho va en una pestaña nueva, con la demo como a las 8:00.
// A esos anchos, el día va en columnas (no en una sesión por fila): con el menú al lado, a 1180 no llegaba.
for (const [ancho, alto] of [[1366, 768], [1280, 720], [1180, 820]]) {
  const q = await pagina(ancho, alto);
  for (const rol of roles) {
    await ir(q, rol); await q.mouse.move(1, 1); await foto(q, `${rol}-inicio-${ancho}x${alto}`, false); await desborde(q, `${rol} inicio ${ancho}`);
    const filas = await q.evaluate(() => { const c = document.querySelector('.horario-cabeza'); return !!c && getComputedStyle(c).display === 'none'; });
    if (filas) errores.push(`[${rol} ${ancho}x${alto}] el día sale en filas, no en columnas`);
  }
  await q.context().close();
}

// Lo que se termina en el Inicio, cada caso en una pestaña nueva (la demo como a las 8:00).
async function nueva(ancho, alto, movil) { const q = await pagina(ancho, alto, movil); await ir(q, ''); return q; }
async function cifras(q, rol, cuantas, nombre) {
  await ir(q, rol);
  const n = await q.locator('.indicador').count();
  if (n !== cuantas) errores.push(`[${nombre}] el Inicio de ${rol} pinta ${n} cifras y tiene ${cuantas}`);
}
// 1. Todos los pendientes de una cifra hechos (antes, el Inicio se quedaba en blanco): firma y acta en dirección,
//    las dos entregas del viernes 20 en docente.
if (roles.includes('direccion')) {
  const q = await nueva(1366, 768);
  for (const doc of ['firma', 'acta']) {
    await ir(q, 'direccion-' + doc);
    const casillas = q.locator(`[data-k^="chk-${doc}-"]`);
    for (let i = 0; i < await casillas.count(); i++) await casillas.nth(i).check();
    await q.locator(`[data-k="fin-${doc}"]`).click(); await q.waitForTimeout(150);
  }
  await cifras(q, 'direccion', (await q.evaluate(() => window.DEMO.roles.direccion.inicio.cifras.length)), 'firma y acta');
  await q.reload(); await q.waitForTimeout(150);
  if (!(await q.locator('.indicador').count())) errores.push('[firma y acta] al recargar, el Inicio de dirección sale en blanco');
  await foto(q, 'x-direccion-firma-y-acta-hechas', false);
  await q.context().close();
}
if (roles.includes('docente')) {
  const q = await nueva(1366, 768);
  await ir(q, 'docente-plazos');
  for (const i of [3, 4]) { const b = q.locator(`[data-k="plazo-plazos-${i}"]`); if (await b.count()) { await b.click(); await q.waitForTimeout(100); } }
  await cifras(q, 'docente', (await q.evaluate(() => window.DEMO.roles.docente.inicio.cifras.length)), 'entregas del vie 20');
  await foto(q, 'x-docente-entregas-hechas', false);
  await q.context().close();
}
// 2. Todo respondido en el móvil, a 390 y a 360: lo hecho («Al día», «Todo firmado», «Archivado») cabe en su tarjeta.
for (const ancho of [390, 360]) {
  const q = await nueva(ancho, 800, true);
  await q.evaluate(() => {
    const S = { reloj: 9, banderas: {}, correo: {}, sel: {}, leyendo: {}, borrador: {}, aprob: {}, docs: { direccion: { firma: { hecho: true, hora: '8:05' }, acta: { hecho: true, hora: '8:06' } } }, plazos: {}, tablas: {}, banco: {}, dictado: {}, material: {}, trad: {}, informe: {}, fichas: {} };
    // Los enviados, con la 2.ª respuesta propuesta: en dirección, la que comunica el preaviso a la empresa de fotocopiadoras.
    Object.keys(window.DEMO.roles).forEach((r) => { S.correo[r] = {}; window.DEMO.roles[r].correo.forEach((c, i) => { S.correo[r][c.id] = { estado: i % 2 ? 'archivado' : 'enviado', hora: '8:0' + (i + 1), texto: 'x', opcion: 1 }; }); });
    sessionStorage.setItem('directoria-demo-v1', JSON.stringify(S));
  });
  for (const rol of roles) {
    await ir(q, rol); await q.reload(); await q.waitForTimeout(120);
    const fuera = await q.evaluate(() => [...document.querySelectorAll('.indicador-hecho, .indicador-accion')].filter((x) => { const c = x.closest('.indicador').getBoundingClientRect(); return [...x.querySelectorAll('*')].concat(x).some((y) => y.getBoundingClientRect().right > c.right - 1); }).map((x) => x.textContent.trim()));
    if (fuera.length) errores.push(`[${rol} ${ancho} todo hecho] se sale de la tarjeta: ${fuera.join(' | ')}`);
    // Ninguna palabra de lo hecho se parte en dos líneas sin guion («Respondid / o»).
    const partidas = await q.evaluate(() => {
      const out = [];
      document.querySelectorAll('.indicador-hecho > span').forEach((sp) => {
        const w = document.createTreeWalker(sp, NodeFilter.SHOW_TEXT); let n;
        while ((n = w.nextNode())) {
          const re = /\S+/g; let m;
          while ((m = re.exec(n.nodeValue))) {
            const r = document.createRange(); r.setStart(n, m.index); r.setEnd(n, m.index + m[0].length);
            const tops = new Set([...r.getClientRects()].map((x) => Math.round(x.top)));
            if (tops.size > 1) out.push(m[0]);
          }
        }
      });
      return out;
    });
    if (partidas.length) errores.push(`[${rol} ${ancho} todo hecho] palabras partidas en dos líneas: ${partidas.join(', ')}`);
    await desborde(q, `${rol} ${ancho} todo hecho`);
  }
  await ir(q, roles[0]); await q.reload(); await q.waitForTimeout(120); await foto(q, `m-${roles[0]}-${ancho}-todo-hecho`, false);
  await q.context().close();
}
// 3. Jefatura elige a otra persona para la 1.ª y la 6.ª y confirma: los paneles enseñan a la elegida, y en el de quien
//    sustituye esas sesiones pasan a «Ya no la cubres» y salen de su recuento.
if (roles.includes('jefatura')) {
  const q = await nueva(1440, 900);
  const g = await q.evaluate(() => (window.DEMO.roles.jefatura.modulos.find((m) => m.tipo === 'aprobaciones') || {}).id);
  if (g) {
    await ir(q, 'jefatura-' + g);
    const opciones = await q.evaluate((id) => window.DEMO.roles.jefatura.modulos.find((m) => m.id === id).items.map((it) => [it.id, it.alternativas[0]]), g);
    for (const [id, otra] of opciones.filter((x) => ['g1', 'g4'].includes(x[0]))) { await q.selectOption(`[data-k="sel-${id}"]`, otra); await q.waitForTimeout(80); }
    await q.locator(`[data-k="todo-${g}"]`).click(); await q.waitForTimeout(200);
    if (roles.includes('sustituto')) {
      await ir(q, 'sustituto');
      const sinTi = await q.locator('.sesion.sin-ti').count();
      if (!sinTi) errores.push('[otra persona] en el Inicio de quien sustituye no sale «Ya no la cubres»');
      await foto(q, 'x-sustituto-otra-persona', true);
    }
    await ir(q, 'direccion'); await foto(q, 'x-direccion-otra-persona', false);
  }
  await q.context().close();
}

// 4. Jefatura elige a Pablo Sanz para la 3.ª y el recreo, que DirectorIA proponía a otras personas: su Inicio enseña esas
//    dos sesiones (cinco que cubre en total), cuenta tres fichas y, al confirmar, las da por recibidas.
if (roles.includes('jefatura') && roles.includes('sustituto')) {
  const q = await nueva(1440, 900);
  await ir(q, 'jefatura-guardias');
  for (const id of ['g2', 'g3']) { await q.selectOption(`[data-k="sel-${id}"]`, 'Pablo Sanz'); await q.waitForTimeout(80); }
  await ir(q, 'sustituto');
  const cubre = await q.locator('.panel-dia .sesion.t-cubre').count();
  if (cubre !== 5) errores.push(`[Pablo elegido] en el Inicio de quien sustituye salen ${cubre} sesiones que cubre, y son cinco`);
  const fichas = await q.evaluate(() => (document.querySelectorAll('.indicador .sr')[1] || {}).textContent || '');
  if (!/: 3 por llegar/.test(fichas)) errores.push(`[Pablo elegido] la cifra de las fichas no cuenta tres: ${fichas}`);
  await foto(q, 'x-sustituto-elegido-3a-y-recreo', false);
  await ir(q, 'jefatura-guardias'); await q.locator('[data-k="todo-guardias"]').click(); await q.waitForTimeout(700);
  await ir(q, 'sustituto');
  const conf = await q.locator('.panel-dia .sesion.t-cubre.confirmada').count();
  if (conf !== 5) errores.push(`[Pablo elegido] tras confirmar, salen ${conf} sesiones confirmadas, y son cinco`);
  // La línea de estado y el detalle del carril dicen lo que hay de verdad: la 3.ª y el recreo, y tres apoyos (el de 3.º A queda sin hacer).
  const linea = await q.evaluate(() => [...document.querySelectorAll('.panel-dia .carril-estado p')].map((x) => x.textContent).join(' '));
  if (!/la 3\.ª/.test(linea) || !/el recreo/.test(linea)) errores.push(`[Pablo elegido] la línea de estado no nombra la 3.ª y el recreo: ${linea}`);
  const detalle = await q.evaluate(() => (document.querySelector('.panel-dia .carril-detalle') || {}).textContent || '');
  if (!/^Tres apoyos/.test(detalle)) errores.push(`[Pablo elegido] el detalle del carril no cuenta tres apoyos: ${detalle}`);
  await foto(q, 'x-sustituto-elegido-confirmadas', false);
  await q.context().close();
}
// 4 bis. Jefatura confirma una a una (solo la 1.ª): en cada fila, el estado de todas las celdas con cambio queda a la misma
//    altura (aunque debajo lleven distinto número de líneas), y la línea de estado dice lo confirmado y lo que falta, con el atajo.
if (roles.includes('jefatura')) {
  for (const [ancho, alto] of [[1440, 900], [1280, 720]]) {
    const q = await nueva(ancho, alto);
    await ir(q, 'jefatura-guardias'); await q.locator('[data-k="ok-g1"]').click(); await q.waitForTimeout(150);
    for (const rol of roles.filter((x) => ['direccion', 'jefatura', 'sustituto'].includes(x))) {
      await ir(q, rol); await q.mouse.move(1, 1);
      const tops = await q.evaluate(() => [...document.querySelectorAll('.panel-dia .carril-sesiones')].map((c) => [...new Set([...c.querySelectorAll('.sesion-estado')].map((x) => Math.round(x.getBoundingClientRect().top)))]));
      if (tops.some((t) => t.length > 1)) errores.push(`[una a una ${ancho}] en ${rol}, los estados de la fila no están a la misma altura: ${JSON.stringify(tops)}`);
      const est = await q.evaluate(() => ({ t: (document.querySelector('.panel-dia .carril-estado p') || {}).textContent || '', atajo: !!document.querySelector('.panel-dia .carril-estado .atajo') }));
      if (rol === 'direccion' && (!/1\sde\s4/.test(est.t) || !est.atajo)) errores.push(`[una a una ${ancho}] en dirección, la línea de estado no dice «1 de 4» con el atajo: ${est.t}`);
      if (rol === 'sustituto' && !/la 1\.ª/.test(est.t)) errores.push(`[una a una ${ancho}] en quien sustituye, la línea de estado no dice que la 1.ª está confirmada: ${est.t}`);
      if (ancho === 1440) await foto(q, `x-${rol}-una-a-una`, false);
    }
    await q.context().close();
  }
}
// 4 ter. Ventanas reales: un portátil de 1366×768 con el navegador maximizado (1366×643) y un proyector de 1280×720 en una
//    ventana (1280×633). Tras confirmar, «Confirmada a las 8:01» de la fila del día cabe en la primera pantalla. Con el zoom
//    al 110 % (1242×607) no cabe: solo se avisa (el README pide pantalla completa y el zoom al 100 %).
const avisos = [];
if (roles.includes('jefatura')) {
  for (const [ancho, alto, soloAviso] of [[1366, 643], [1280, 633], [1242, 607, true]]) {
    const q = await nueva(ancho, alto);
    await ir(q, 'jefatura-guardias'); await q.locator('[data-k="todo-guardias"]').click(); await q.waitForTimeout(150);
    for (const rol of roles.filter((x) => ['direccion', 'jefatura', 'docente', 'sustituto'].includes(x))) {
      await ir(q, rol); await q.mouse.move(1, 1);
      const m = await q.evaluate(() => {
        const xs = [...document.querySelectorAll('.panel-dia .carril-sesiones > .sesion:not(.separador):not(.vacia)')].filter((x) => x.getBoundingClientRect().width > 0);
        const textos = xs.flatMap((x) => [...x.querySelectorAll('.sesion-quien, .sesion-estado, .sesion-texto')]);
        return { fondo: Math.round(Math.max(...textos.map((x) => x.getBoundingClientRect().bottom))), alto: innerHeight };
      });
      if (m.fondo > m.alto) (soloAviso ? avisos : errores).push(`[ventana ${ancho}x${alto}] en ${rol}, tras confirmar la fila del día acaba en y=${m.fondo}, por debajo de la pantalla (${m.alto})`);
      if (rol === 'direccion') await foto(q, `x-direccion-ventana-${ancho}x${alto}-confirmadas`, false);
    }
    await q.context().close();
  }
}
// 4 quater. Con el ratón, de la tarjeta de Fotocopiadoras al atajo «Ver la propuesta»: el globo de la 6.ª, que se cruza por
//    el camino, no tapa el atajo (sale con una espera corta) y en su centro está el enlace.
if (roles.includes('direccion')) {
  for (const [ancho, alto] of [[1440, 900], [1366, 768], [1280, 720]]) {
    const q = await nueva(ancho, alto);
    await ir(q, 'direccion');
    const desde = await q.locator('.indicador').nth(2).boundingBox(), hasta = await q.locator('.panel-dia .atajo').boundingBox();
    if (desde && hasta) {
      const x0 = desde.x + desde.width / 2, y0 = desde.y + desde.height / 2, x1 = hasta.x + hasta.width / 2, y1 = hasta.y + hasta.height / 2;
      await q.mouse.move(x0, y0);
      for (let i = 1; i <= 20; i++) { await q.mouse.move(x0 + (x1 - x0) * i / 20, y0 + (y1 - y0) * i / 20); await q.waitForTimeout(12); }
      await q.waitForTimeout(450);
      const ok = await q.evaluate(([x, y]) => { const el = document.elementFromPoint(x, y); return !!(el && el.closest('.atajo')); }, [x1, y1]);
      if (!ok) errores.push(`[ratón ${ancho}] de Fotocopiadoras al atajo, en su centro no está el enlace: lo tapa un globo`);
    } else errores.push(`[ratón ${ancho}] en dirección no está el atajo de la demo`);
    await q.context().close();
  }
}
// 4 quinquies. El dosier del lunes 23: la respuesta que lo adjunta lo envía sin el acta de 2.º ESO A, así que no pasa a ✓
//    (ni con el visto bueno ni sin él), y sin visto bueno lo dice.
if (roles.includes('direccion')) {
  for (const visto of [false, true]) {
    const q = await nueva(1440, 900);
    if (visto) {
      await ir(q, 'direccion-dosier');
      const casillas = q.locator('[data-k^="chk-dosier-"]');
      for (let i = 0; i < await casillas.count(); i++) await casillas.nth(i).check();
      const fin = q.locator('[data-k="fin-dosier"]'); if (await fin.count()) { await fin.click(); await q.waitForTimeout(150); }
    }
    await ir(q, 'direccion-correo');
    await q.locator('[data-k="msg-c-inspeccion"]').click(); await q.waitForTimeout(80);
    await q.locator('[data-k="op-c-inspeccion-1"]').check(); await q.waitForTimeout(80);
    await q.locator('[data-k="enviar-c-inspeccion"]').click(); await q.waitForTimeout(80);
    await q.locator('#confirmar-si').click(); await q.waitForTimeout(150);
    await ir(q, 'direccion');
    const lun = await q.evaluate(() => { const d = document.getElementById('ag-2026-11-23'); return d ? { hechas: d.querySelectorAll('.ag-item.hecha').length, t: d.textContent } : null; });
    if (!lun || lun.hechas) errores.push(`[dosier ${visto ? 'con' : 'sin'} visto bueno] el lunes 23 pasa a ✓ aunque falta el acta de 2.º ESO A`);
    else if (!/sin el acta de 2\.º\sESO\sA/.test(lun.t) || (!visto && !/sin tu visto bueno/.test(lun.t))) errores.push(`[dosier ${visto ? 'con' : 'sin'} visto bueno] el lunes 23 no dice lo que falta: ${lun.t}`);
    await foto(q, `x-direccion-dosier-enviado-${visto ? 'con' : 'sin'}-visto-bueno`, false);
    await q.context().close();
  }
}
// 5. Fotocopiadoras: la respuesta que sale elegida al abrir el correo pide la oferta, no avisa. La cuenta atrás sigue y el
//    sábado 21 no pasa a ✓. Con «Comunicar el preaviso» (la 2.ª), sí.
if (roles.includes('direccion')) {
  for (const opcion of [null, 1]) {
    const q = await nueva(1440, 900);
    await ir(q, 'direccion-correo');
    await q.locator('[data-k="msg-c-fotocopiadoras"]').click(); await q.waitForTimeout(80);
    if (opcion !== null) { await q.locator(`[data-k="op-c-fotocopiadoras-${opcion}"]`).check(); await q.waitForTimeout(80); }
    await q.locator('[data-k="enviar-c-fotocopiadoras"]').click(); await q.waitForTimeout(80);
    await q.locator('#confirmar-si').click(); await q.waitForTimeout(150);
    await ir(q, 'direccion');
    const cuenta = await q.locator('.indicador .cuenta-atras').count();
    const sab = await q.evaluate(() => { const d = document.getElementById('ag-2026-11-21'); return d ? d.querySelectorAll('.ag-item.hecha').length : -1; });
    if (opcion === null && (!cuenta || sab)) errores.push('[fotocopiadoras] con la respuesta que pide la oferta, la cifra o el sábado 21 se dan por hechos');
    if (opcion === 1 && (cuenta || sab !== 1)) errores.push('[fotocopiadoras] con «Comunicar el preaviso», la cifra o el sábado 21 no se dan por hechos');
    await foto(q, `x-direccion-fotocopiadoras-${opcion === null ? 'pide-la-oferta' : 'preaviso'}`, false);
    await q.context().close();
  }
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
fs.writeFileSync(path.join(salida, 'errores.txt'), errores.concat(avisos.map((x) => 'AVISO ' + x)).join('\n'));
for (const x of avisos) console.log('AVISO ' + x);
console.log(errores.length ? errores.join('\n') : 'Sin errores de consola ni desbordes.');
console.log('Capturas en ' + salida);
