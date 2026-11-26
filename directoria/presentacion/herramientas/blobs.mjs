#!/usr/bin/env node
// Lo que falta subir a la presentación y al sistema de diseño de claude.ai, y cómo apuntarlo después.
//
// Las diapositivas (presentacion/project/slides) y las piezas del sistema (manual/sistema/project/components)
// citan las imágenes subidas a su artifact como /_blob/<id>. Mientras una ilustración nueva o cambiada no está
// subida, el repositorio la cita como /_blob/pendiente-<nombre>: vista-previa.mjs y el generador del manual la
// muestran con el archivo local, pero el artifact no la tiene. pendientes.json dice qué hay que subir y adónde.
//
//   node blobs.mjs pendientes
//       Lista lo que falta subir y los marcadores que quedan. Sale con error si queda algo.
//   node blobs.mjs presentacion ficha=/_blob/<id> documento=<id> … [--antiguos]
//       Tras subir esos archivos al mazo: cambia /_blob/pendiente-<nombre> por /_blob/<id> en las diapositivas y
//       apunta el blob en blob-map.json. Con --antiguos cambia también el blob viejo que se dejó a propósito
//       (por ejemplo, la ficha de inversion.html, que se publica con los precios).
//   node blobs.mjs sistema ficha.svg=<id> documento.svg=<id> kit.png=<id> … [--nota "…"]
//       Tras subir esos archivos al sistema: pone blob, size y type en design-system.json (añade el registro
//       si es nuevo), cambia /_blob/pendiente-<nombre> en las piezas y pone lastChange.
// Después se publica cada artifact con los archivos cambiados (ver LEEME.md).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const DIR = path.resolve(AQUI, '../..');                                   // directoria/
const SLIDES = path.join(DIR, 'presentacion/project/slides');
const SIS = path.join(DIR, 'manual/sistema/project');
const PEND = path.join(AQUI, 'pendientes.json');
const MAPA = path.join(AQUI, 'blob-map.json');
const leerJson = f => JSON.parse(fs.readFileSync(f, 'utf8'));
const escribirJson = (f, o) => fs.writeFileSync(f, JSON.stringify(o, null, 1) + '\n');
const id = v => { const m = /^(?:\/_blob\/)?([0-9a-f]{32})$/.exec(v); if (!m) throw new Error(`«${v}» no es un /_blob/<id> de 32 cifras hexadecimales`); return m[1]; };
const pares = args => args.filter(a => a.includes('=')).map(a => { const i = a.indexOf('='); return [a.slice(0, i), id(a.slice(i + 1))]; });
const piezas = () => fs.readdirSync(path.join(SIS, 'components'), { withFileTypes: true }).filter(d => d.isDirectory())
  .map(d => path.join(SIS, 'components', d.name, 'preview.html')).filter(f => fs.existsSync(f));
const diapositivas = () => fs.readdirSync(SLIDES).filter(f => f.endsWith('.html')).map(f => path.join(SLIDES, f));
const marcadores = files => files.flatMap(f => [...fs.readFileSync(f, 'utf8').matchAll(/\/_blob\/pendiente-([a-z0-9-]+)/g)].map(m => [path.relative(DIR, f), m[1]]));
const tipo = f => ({ '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.pdf': 'application/pdf' })[path.extname(f)] || 'application/octet-stream';

const [orden, ...resto] = process.argv.slice(2);
const pend = leerJson(PEND);

if (orden === 'pendientes') {
  let falta = 0;
  for (const destino of ['presentacion', 'sistema']) {
    const p = pend[destino];
    const subir = Object.entries(p.subir || {});
    if (subir.length) { falta += subir.length; console.log(`${destino} (${p.url}) · subir:\n` + subir.map(([n, f]) => `  ${n} ← ${f}`).join('\n')); }
    for (const [n, v] of Object.entries(p.antiguos || {})) { falta++; console.log(`${destino} · blob antiguo que sigue citado a propósito: ${n} (${v})`); }
  }
  const m = [...marcadores(diapositivas()), ...marcadores(piezas())];
  if (m.length) { falta += m.length; console.log('Marcadores sin blob:\n' + m.map(([f, n]) => `  ${f}: pendiente-${n}`).join('\n')); }
  if (!falta) console.log('Nada pendiente.');
  process.exit(falta ? 1 : 0);
}

if (orden === 'presentacion') {
  const mapa = leerJson(MAPA);
  const antiguos = resto.includes('--antiguos');
  for (const [nombre, nuevo] of pares(resto)) {
    const local = pend.presentacion.subir[nombre] || Object.values(mapa).find(v => path.basename(v, '.svg') === nombre);
    if (!local) throw new Error(`No sé qué archivo es «${nombre}»`);
    const viejo = antiguos ? pend.presentacion.antiguos?.[nombre] : null;
    let cambios = 0;
    for (const f of diapositivas()) {
      let s = fs.readFileSync(f, 'utf8'); const antes = s;
      s = s.split(`/_blob/pendiente-${nombre}`).join(`/_blob/${nuevo}`);
      if (viejo) s = s.split(viejo).join(`/_blob/${nuevo}`);
      if (s !== antes) { fs.writeFileSync(f, s); cambios++; }
    }
    mapa[`/_blob/${nuevo}`] = local;
    delete mapa[`/_blob/pendiente-${nombre}`];
    delete pend.presentacion.subir[nombre];
    if (viejo) delete pend.presentacion.antiguos[nombre];
    console.log(`${nombre}: /_blob/${nuevo} en ${cambios} diapositivas`);
  }
  escribirJson(MAPA, mapa); escribirJson(PEND, pend);
} else if (orden === 'sistema') {
  const dsFile = path.join(SIS, 'design-system.json');
  const ds = leerJson(dsFile);
  const i = resto.indexOf('--nota');
  const nota = i > -1 ? resto[i + 1] : 'Ilustraciones y láminas al día: la ficha, los avisos, el calendario y la tableta de dirección, sin la chispa; ilustración nueva «documento»';
  for (const [nombre, nuevo] of pares(resto)) {
    const clave = Object.keys(pend.sistema.subir).find(k => k.endsWith('/' + nombre));
    if (!clave) throw new Error(`«${nombre}» no está en pendientes.json (sistema)`);
    const [grupo] = clave.split('/');
    const local = path.join(DIR, pend.sistema.subir[clave]);
    const g = ds.assetGroups[grupo];
    if (!g.files[nombre]) {                                          // registro nuevo: detrás de su pareja, si la tiene
      const tras = nombre === 'documento.svg' ? 'documento-ia.svg' : null;
      const k = tras ? g.order.indexOf(tras) : -1;
      if (k > -1) g.order.splice(k + 1, 0, nombre); else g.order.push(nombre);
    }
    g.files[nombre] = { name: nombre, blob: nuevo, size: fs.statSync(local).size, type: tipo(local) };
    const base = path.basename(nombre, path.extname(nombre));
    for (const f of piezas()) {
      const s = fs.readFileSync(f, 'utf8');
      const t = s.split(`/_blob/pendiente-${base}`).join(`/_blob/${nuevo}`);
      if (t !== s) { fs.writeFileSync(f, t); console.log(`  ${path.relative(DIR, f)}: /_blob/${nuevo}`); }
    }
    delete pend.sistema.subir[clave];
    console.log(`${clave}: ${nuevo} (${g.files[nombre].size} bytes)`);
  }
  ds.lastChange = { by: 'Claude', at: new Date().toISOString().replace(/\.\d+Z$/, 'Z'), via: 'Claude Code', note: nota };
  escribirJson(dsFile, ds); escribirJson(PEND, pend);
} else {
  console.error('Uso: node blobs.mjs pendientes | presentacion nombre=<id>… [--antiguos] | sistema archivo=<id>… [--nota "…"]');
  process.exit(1);
}
