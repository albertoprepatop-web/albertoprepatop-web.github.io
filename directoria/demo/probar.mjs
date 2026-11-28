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
    const S = { reloj: 9, banderas: {}, correo: {}, sel: {}, leyendo: {}, borrador: {}, aprob: {}, docs: { direccion: { firma: { hecho: true, hora: '8:05' }, acta: { hecho: true, hora: '8:06' } } }, plazos: {}, tablas: {}, banco: {}, dictado: {}, material: {}, trad: {}, informe: {}, fichas: {}, guias: {}, justificantes: {} };
    // Los enviados, con la 2.ª respuesta propuesta: en dirección, la que comunica el preaviso a la empresa de fotocopiadoras.
    Object.keys(window.DEMO.roles).forEach((r) => { S.correo[r] = {}; window.DEMO.roles[r].correo.forEach((c, i) => { S.correo[r][c.id] = { estado: i % 2 ? 'archivado' : 'enviado', hora: '8:0' + (i + 1), texto: 'x', opcion: 1 }; }); });
    sessionStorage.setItem('directoria-demo-v2', JSON.stringify(S));
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
// 4 quinquies. El dosier del lunes 23: la respuesta que lo adjunta lo envía sin el acta de Matemáticas del martes 17, así que
//    no pasa a ✓ (ni con el visto bueno ni sin él), y sin visto bueno lo dice.
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
    if (!lun || lun.hechas) errores.push(`[dosier ${visto ? 'con' : 'sin'} visto bueno] el lunes 23 pasa a ✓ aunque falta el acta del martes 17`);
    else if (!/sin el acta del martes\s17/.test(lun.t) || (!visto && !/sin tu visto bueno/.test(lun.t))) errores.push(`[dosier ${visto ? 'con' : 'sin'} visto bueno] el lunes 23 no dice lo que falta: ${lun.t}`);
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
// 6. La guardia de Laura Sánchez (las guardias no se devuelven): si jefatura le contesta, el Inicio de Laura lo dice (el
//    jueves 19, «la cubre Rosa Medina»; el choque de su guardia del viernes 27, ✓ en la lista y en la agenda) y en jefatura
//    ese choque sigue abierto, sin enlace, porque falta decidir quién la cubre. Si jefatura archiva el correo, nada cambia.
if (roles.includes('jefatura') && roles.includes('docente') && await p.evaluate(() => window.DEMO.roles.jefatura.correo.some((c) => c.id === 'c-laura'))) {
  for (const accion of ['responder', 'archivar']) {
    const q = await nueva(1440, 900);
    await ir(q, 'jefatura-correo');
    await q.locator('[data-k="msg-c-laura"]').click(); await q.waitForTimeout(80);
    if (accion === 'responder') {
      await q.locator('[data-k="enviar-c-laura"]').click(); await q.waitForTimeout(80);
      await q.locator('#confirmar-si').click(); await q.waitForTimeout(150);
    } else { await q.locator('[data-k="archivar-c-laura"]').click(); await q.waitForTimeout(150); }
    // Los textos llevan espacios de no separación («viernes 27»): se buscan con \s.
    const dia = (f) => q.evaluate((x) => { const d = document.getElementById('ag-' + x); return d ? [...d.querySelectorAll('.ag-item')].map((li) => ({ t: li.textContent.replace(/\s+/g, ' '), hecha: li.classList.contains('hecha'), choque: li.classList.contains('choque'), enlace: !!li.querySelector('a') })) : []; }, f);
    await ir(q, 'docente'); await q.mouse.move(1, 1);
    const d19 = (await dia('2026-11-19')).map((x) => x.t).join(' '), d27 = await dia('2026-11-27');
    const fila = await q.evaluate(() => { const li = [...document.querySelectorAll('.panel-lista .fila')].find((x) => /viernes\s27/.test(x.textContent)); return li ? li.classList.contains('hecha') : null; });
    const respondido = accion === 'responder';
    if (respondido !== /la cubre Rosa Medina/.test(d19)) errores.push(`[guardia de Laura, ${accion}] el jueves 19 de docente no dice lo que toca: ${d19}`);
    if (fila === null || !d27.some((x) => x.choque || x.hecha)) errores.push(`[guardia de Laura, ${accion}] en docente no sale el choque del viernes 27 en la lista o en la agenda`);
    else if (respondido !== d27.some((x) => x.hecha) || respondido !== fila) errores.push(`[guardia de Laura, ${accion}] en docente, el choque del viernes 27 ${respondido ? 'no pasa' : 'pasa'} a ✓`);
    await foto(q, `x-docente-guardia-${accion === 'responder' ? 'respondida' : 'archivada'}`);
    await ir(q, 'jefatura'); await q.mouse.move(1, 1);
    const j27 = (await dia('2026-11-27')).find((x) => x.choque) || {};
    if (j27.hecha || !j27.choque) errores.push(`[guardia de Laura, ${accion}] en jefatura, el choque del viernes 27 no sigue abierto`);
    if (respondido === j27.enlace) errores.push(`[guardia de Laura, ${accion}] en jefatura, el choque del viernes 27 ${respondido ? 'sigue llevando al correo ya respondido' : 'no lleva al correo'}`);
    if (respondido) await foto(q, 'x-jefatura-guardia-respondida');
    await q.context().close();
  }
}

// 7. Justificantes del profesorado: la docente sube el de su ausencia del lunes 16 y un programa lo archiva en su carpeta,
//    Justificantes / curso / mes / docente. En secretaría sale en la carpeta de noviembre y la cifra pasa de 5 a 6 de 7; en
//    jefatura, el informe dice «Entregado» y no enseña archivos. Ninguna de las tres pantallas lleva la insignia de la IA.
if (roles.includes('docente') && roles.includes('secretaria') && roles.includes('jefatura')) {
  const q = await nueva(1440, 900);
  const sinInsignia = async (donde) => { if (await q.locator('main .insignia').count()) errores.push(`[justificantes] en ${donde} sale la insignia de la IA`); };
  const cifraSr = (re) => q.evaluate((src) => { const r = new RegExp(src); return ([...document.querySelectorAll('.indicador .sr')].map((x) => x.textContent).find((t) => r.test(t)) || ''); }, re);
  await ir(q, 'secretaria');
  let c = await cifraSr('^Justificantes');
  if (!/5\sde\s7/.test(c)) errores.push(`[justificantes] al empezar, la cifra de secretaría no dice 5 de 7: ${c}`);
  // Antes de subirlo: un pendiente no tiene archivo («Sin archivo todavía», sin nombre de archivo), y el registro de accesos
  // dice también quién ha abierto uno, no solo quién ha subido.
  await ir(q, 'secretaria-justificantes');
  const pend = await q.evaluate(() => [...document.querySelectorAll('.arbol .archivo.pendiente')].map((x) => x.textContent));
  if (!pend.length || pend.some((t) => /\.(pdf|jpe?g|png)\b/.test(t) || !/Sin archivo todavía/.test(t))) errores.push(`[justificantes] en secretaría, un pendiente sale con nombre de archivo: ${pend.join(' | ')}`);
  const reg = await q.evaluate(() => { const s = [...document.querySelectorAll('main section')].find((x) => /Registro de accesos/.test(x.textContent)); return s ? s.textContent : ''; });
  if (!/abrió/.test(reg)) errores.push('[justificantes] el registro de accesos de secretaría no dice quién ha abierto un justificante');
  await ir(q, 'docente-justificantes'); await sinInsignia('docente');
  const subir = q.locator('[data-k="subir-justificantes"]');
  if (!(await subir.count())) errores.push('[justificantes] la docente no tiene dónde subir el justificante de su ausencia');
  else {
    if (!(await subir.isDisabled())) errores.push('[justificantes] se puede subir sin elegir el archivo');
    await q.locator('[data-k="elegir-justificantes"]').click(); await q.waitForTimeout(80);
    const ruta = ((await q.locator('.subir-justificante .ruta').textContent()) || '').trim();
    if (ruta !== 'Justificantes/2026-27/2026-11/Laura Sánchez/2026-11-16 justificante.pdf') errores.push(`[justificantes] la carpeta y el nombre no son los del programa: ${ruta}`);
    await foto(q, 'x-docente-justificante-elegido', false);
    await subir.click(); await q.waitForTimeout(200);
    if (await q.locator('.subir-justificante').count()) errores.push('[justificantes] después de subirlo, sigue pidiendo el justificante');
    await foto(q, 'x-docente-justificante-subido');
    await q.waitForTimeout(600); // que el aviso «Justificante archivado» no salga en las capturas de los otros perfiles
    await ir(q, 'docente');
    const filaJ = await q.evaluate(() => { const li = [...document.querySelectorAll('.panel-lista .fila')].find((x) => /Tu justificante/.test(x.textContent)); return li ? { hecha: li.classList.contains('hecha'), t: li.textContent } : null; });
    if (!filaJ || !filaJ.hecha || !/Entregado a las/.test(filaJ.t)) errores.push(`[justificantes] en el Inicio de la docente, su justificante no pasa a «Entregado a las…»: ${filaJ && filaJ.t}`);
    await ir(q, 'secretaria-justificantes'); await sinInsignia('secretaría');
    const archivo = await q.evaluate(() => { const li = [...document.querySelectorAll('.arbol .archivo')].find((x) => /2026-11-16 justificante\.pdf/.test(x.textContent)); return li ? li.textContent : ''; });
    if (!/Entregado/.test(archivo)) errores.push(`[justificantes] en la carpeta de secretaría no sale entregado el del lunes 16: ${archivo}`);
    await foto(q, 'x-secretaria-justificantes-tras-subir');
    await ir(q, 'secretaria');
    c = await cifraSr('^Justificantes');
    if (!/6\sde\s7/.test(c)) errores.push(`[justificantes] tras subirlo, la cifra de secretaría no dice 6 de 7: ${c}`);
    await ir(q, 'jefatura-ausencias'); await sinInsignia('jefatura');
    const fila = await q.evaluate(() => { const tr = [...document.querySelectorAll('main tbody tr')].find((x) => /Laura Sánchez/.test(x.textContent)); return tr ? tr.textContent : ''; });
    if (!/Entregado/.test(fila)) errores.push(`[justificantes] en el informe de jefatura no sale entregado el de Laura Sánchez: ${fila}`);
    if (await q.evaluate(() => /justificante\.pdf|Justificantes\//.test(document.querySelector('main').textContent))) errores.push('[justificantes] el informe de jefatura enseña archivos: solo dice entregado o pendiente');
    await foto(q, 'x-jefatura-ausencias-tras-subir');
  }
  await q.context().close();
}

// 8. Sin datos de alumnos en ninguna pantalla, también en el correo y con las fichas a la vista: ni casos, ni «Alumno/a», ni
//    los alumnos que tenía la demo, ni salud, ni motivos de ausencia. Vale la línea fija de la ficha. Cada ficha trae esa
//    línea y solo la clase; la guía del protocolo de acoso, sus nueve pasos, y cada guía, sus anexos en blanco, en orientación
//    y en dirección.
{
  const q = await nueva(1440, 900);
  await ir(q, 'jefatura-guardias'); await q.locator('[data-k="todo-guardias"]').click(); await q.waitForTimeout(150);
  const LINEA = 'Las indicaciones de salud y de recogida de los alumnos no están en DirectorIA: las tiene el colegio. Pregúntalas en conserjería o a la tutora antes de empezar.';
  const prohibido = (t) => q.evaluate(([texto, linea]) => {
    const limpio = texto.split(linea).join(' ').replace(/[Ll]as indicaciones de salud y de recogida(?: de los alumnos)?/g, ' ');
    const re = /Caso\s+\d{4}|Alumno\/a|(?<![\p{L}])(?:Mario|Lucía|Hugo|Daniel|Irene|Amira|Nora|Iker|Sofía|Adrián|Gonzalo|Carla|Alba|Óliver|Samuel)(?![\p{L}])|fiebre|al[ée]rgic|alergi|autoinyector|te mejores|recup[ée]rate|(?<!informaci[oó]n\s)\brecogidas?\b(?!\s+de\s+(?:la\s+|los\s+)?(?:informaci[oó]n|datos))/iu;
    const m = limpio.match(re); return m ? m[0] : null;
  }, [t, LINEA]);
  for (const rol of roles) {
    const vistas = ['inicio', 'correo'].concat(await q.evaluate((r) => window.DEMO.roles[r].modulos.map((m) => m.id), rol));
    for (const v of vistas) {
      await ir(q, rol + (v === 'inicio' ? '' : '-' + v));
      const ids = v === 'correo' ? await q.evaluate((r) => window.DEMO.roles[r].correo.map((c) => c.id), rol) : [null];
      for (const id of ids) {
        if (id) { await q.locator(`[data-k="msg-${id}"]`).click(); await q.waitForTimeout(40); }
        const m = await prohibido(await q.evaluate(() => (document.querySelector('main') || document.body).textContent));
        if (m) errores.push(`[sin datos de alumnos] en ${rol} · ${v}${id ? ' · ' + id : ''} sale «${m}»`);
      }
    }
  }
  for (const [rol, v] of [['sustituto', 'ficha'], ['jefatura', 'fichas']]) {
    if (!roles.includes(rol)) continue;
    await ir(q, rol + '-' + v);
    const fichas = await q.evaluate((linea) => [...document.querySelectorAll('article.ficha')].map((f) => ({ linea: f.textContent.includes(linea), dts: [...f.querySelectorAll('dt')].map((x) => x.textContent.trim()), origen: (f.querySelector('.ficha-origen') || {}).textContent })), LINEA);
    if (!fichas.length) errores.push(`[ficha] en ${rol} no sale ninguna ficha`);
    fichas.forEach((f, i) => {
      if (!f.linea) errores.push(`[ficha] la ficha ${i + 1} de ${rol} no lleva la línea fija`);
      const malas = f.dts.filter((x) => !['Tarea', 'Material', 'A quién llamar', 'Al acabar', 'Antes de empezar'].includes(x));
      if (malas.length) errores.push(`[ficha] la ficha ${i + 1} de ${rol} lleva ${malas.join(', ')}`);
      if (f.origen !== 'Preparada por DirectorIA · confirmada por jefatura') errores.push(`[ficha] la ficha ${i + 1} de ${rol} dice «${f.origen}»`);
    });
    if (rol === 'sustituto') await foto(q, 'x-sustituto-ficha-sin-datos-de-alumnos');
  }
  // Las guías de los protocolos, en orientación y en dirección. Dirección toma las de orientación («guias:
  // 'orientacion/protocolos'»): se escriben una vez y cada perfil las enseña enteras.
  const NOMBRE_ROL = { orientacion: 'orientación', direccion: 'dirección' };
  for (const rol of ['orientacion', 'direccion'].filter((x) => roles.includes(x))) {
    const info = await q.evaluate((r) => {
      const m = window.DEMO.roles[r].modulos.find((x) => x.tipo === 'protocolo');
      if (!m) return null;
      let g = m.guias;
      if (typeof g === 'string') { const [o, id] = g.split('/'); const x = window.DEMO.roles[o] && window.DEMO.roles[o].modulos.find((y) => y.id === id); g = x && x.guias; }
      return { id: m.id, guias: Array.isArray(g) ? g.map((x) => [x.id, x.pasos.length, (x.plantillas || []).length]) : null };
    }, rol);
    if (!info || !info.guias) { errores.push(`[guía] ${NOMBRE_ROL[rol]} no tiene las guías de los protocolos, paso a paso`); continue; }
    await ir(q, `${rol}-${info.id}`);
    for (const [id, pasos, plantillas] of info.guias) {
      await q.locator(`[data-k="guia-${id}"]`).click(); await q.waitForTimeout(80);
      const n = await q.locator('.guia-paso').count(), np = await q.locator('.plantilla').count();
      if (n !== pasos) errores.push(`[guía] en ${NOMBRE_ROL[rol]}, la de ${id} enseña ${n} pasos y tiene ${pasos}`);
      if (np !== plantillas) errores.push(`[guía] en ${NOMBRE_ROL[rol]}, la de ${id} enseña ${np} anexos en blanco y tiene ${plantillas}`);
      if (await q.locator('main .insignia').count()) errores.push(`[guía] en ${NOMBRE_ROL[rol]}, la de ${id} lleva la insignia de la IA`);
      await foto(q, `x-${rol}-guia-${id}`);
    }
    if (!(await q.evaluate(() => /ningún caso/i.test(document.querySelector('main').textContent)))) errores.push(`[guía] en ${NOMBRE_ROL[rol]}, no dice que no se abre ningún caso en DirectorIA`);
    await q.locator('[data-k="guia-acoso"]').click(); await q.waitForTimeout(80);
    const cond = await q.locator('.guia-paso.condicional').count();
    if (cond !== 3) errores.push(`[guía] en ${NOMBRE_ROL[rol]}, la de acoso tiene ${cond} pasos «si se confirma», y son tres`);
  }
  await q.context().close();
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
