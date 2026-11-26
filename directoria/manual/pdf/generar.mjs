#!/usr/bin/env node
// Genera directoria/manual/manual-de-marca.pdf (A4 vertical) a partir de las fuentes del sistema de diseño
// (directoria/manual/sistema/project): README.md, las secciones 1-4, tokens.json y components/bundle.css.
// Uso, desde esta carpeta:  npm install  y después  npm run pdf
// Necesita Node 18+ y Playwright con Chromium (require('playwright')).
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { marked } from 'marked';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const AQUI = path.dirname(fileURLToPath(import.meta.url));
const DIR = path.resolve(AQUI, '../..');                    // directoria/
const SIS = path.join(DIR, 'manual/sistema/project');
const OUT = path.join(DIR, 'manual/manual-de-marca.pdf');
const url = p => pathToFileURL(path.join(DIR, p)).href;
const leer = p => fs.readFileSync(path.join(SIS, p), 'utf8');

// Captura de la web (portada y primeras secciones) para el capítulo de aplicaciones
if (fs.existsSync(path.join(DIR, 'web/index.html'))) {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1.5 });
  await p.goto(url('web/index.html')); await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: path.join(AQUI, 'web-captura.png'), clip: { x: 0, y: 0, width: 1280, height: 1500 }, fullPage: true });
  await b.close();
}

const tk = JSON.parse(leer('tokens.json'));
const C = Object.fromEntries(tk.color.tokens.filter(t => typeof t.value === 'string').map(t => [t.name, t.value]));

// ---------- tokens.css local (como lo compila la página del sistema) ----------
const temas = tk.color.themes.map(t => t.id);
const v = (x, th) => typeof x === 'string' ? x : (x[th] ?? x[temas[0]]);
const cssv = x => x.replace(/^\{(.+)\}$/, 'var(--$1)');
let tokensCss = `:root, [data-theme="${temas[0]}"] {` + tk.color.tokens.map(t => `--${t.name}:${cssv(v(t.value, temas[0]))};`).join('') + tk.shadow.tokens.map(t => `--${t.name}:${t.value};`).join('') + '}\n';
for (const th of temas.slice(1)) tokensCss += `[data-theme="${th}"] {` + tk.color.tokens.filter(t => typeof t.value !== 'string' && t.value[th]).map(t => `--${t.name}:${cssv(t.value[th])};`).join('') + '}\n';
tokensCss += ':root {' + [...tk.spacing.tokens, ...tk.radius.tokens].map(t => `--${t.name}:${t.value};`).join('') + Object.entries(tk.type.families).map(([k, x]) => `--font-${k}:${x};`).join('') + '}\n';
for (const f of tk.type.fonts) tokensCss += `@font-face{font-family:"${f.family}";src:url("${pathToFileURL(path.join(SIS, f.file)).href}") format("woff2");font-weight:${f.weight};font-style:${f.style};unicode-range:${f.unicodeRange}}\n`;
const bundleCss = leer('components/bundle.css');

// ---------- Markdown → HTML, con una muestra de color delante de cada token de color ----------
const md = s => marked.parse(s, { mangle: false, headerIds: false })
  .replace(/(?<!familia )<code>([a-z0-9-]+)<\/code>/g, (m, n) => C[n] ? `<code class="tk"><i style="background:${C[n]}"></i>${n}</code>` : m);
const sinTitulo = s => s.replace(/^# .*\n+/, '');
function secciones(s) { // separa un markdown por sus «## »
  const partes = {}; let actual = '_intro'; partes[actual] = '';
  for (const linea of s.split('\n')) { const m = /^## (.+)$/.exec(linea); if (m) { actual = m[1].trim(); partes[actual] = ''; } partes[actual] += linea + '\n'; }
  return partes;
}
const readme = secciones(leer('README.md'));

// ---------- Láminas visuales ----------
const ilu = n => url(`ilustraciones/${n}.svg`);
const logoCelda = (archivo, fondo, nombre, alto = 64) => `<figure class="lg" style="background:${fondo}"><img src="${url('logo/' + archivo)}" alt="" style="height:${alto}px"><figcaption>${nombre}</figcaption></figure>`;
const lamLogos = `<div class="lg-rej">
${logoCelda('logo-horizontal.svg', C.tiza, 'Horizontal · positivo')}
${logoCelda('logo-horizontal-negativo.svg', C.pizarra, 'Horizontal · negativo')}
${logoCelda('logo-eslogan.svg', C.papel, 'Con eslogan', 76)}
${logoCelda('logo-eslogan-negativo.svg', C.pizarra, 'Con eslogan · negativo', 76)}
${logoCelda('logotipo.svg', C.salvia, 'Solo la palabra', 40)}
${logoCelda('logo-horizontal-mono-pizarra.svg', '#FFFFFF', 'A una tinta · pizarra')}
${logoCelda('logo-vertical.svg', C.tiza, 'Vertical', 110)}
<figure class="lg" style="background:${C.tiza}"><div class="lg-fila"><img src="${url('logo/isotipo.svg')}" alt="" style="height:72px"><img src="${url('logo/favicon.svg')}" alt="" style="height:32px"><img src="${url('logo/app-icon.svg')}" alt="" style="height:72px"></div><figcaption>Isotipo · favicon · icono de app</figcaption></figure>
</div>`;

const muestra = (n, claro) => { const t = tk.color.tokens.find(x => x.name === n); const hex = C[n];
  const rgb = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16)).join(' · ');
  return `<div class="sw"><div class="sw-c" style="background:${hex};${claro ? `border:1px solid ${C.linea}` : ''}"></div><p class="sw-n">${n}</p><p class="sw-v">${hex} · RGB ${rgb}</p><p class="sw-u">${t.usage}</p></div>`; };
const lamColor = `<div class="sw-rej">${['pizarra', 'pizarra-2', 'pizarra-linea', 'tiza', 'salvia', 'papel', 'linea', 'texto', 'texto-suave', 'chispa', 'chispa-texto', 'chispa-suave'].map(n => muestra(n, ['tiza', 'salvia', 'papel', 'chispa-suave', 'linea'].includes(n))).join('')}</div>`;
const lamSemanticos = `<table><thead><tr><th>Token</th><th>Claro (tiza)</th><th>Oscuro (pizarra)</th><th>Para qué</th></tr></thead><tbody>${tk.color.tokens.filter(t => typeof t.value !== 'string').map(t => `<tr><td><code>${t.name}</code></td><td>${md('`' + t.value.claro.slice(1, -1) + '`').replace(/<\/?p>/g, '')}</td><td>${md('`' + t.value.oscuro.slice(1, -1) + '`').replace(/<\/?p>/g, '')}</td><td>${t.usage}</td></tr>`).join('')}</tbody></table>`;

const lamTipos = `<div class="ty">
<div class="ty-b"><p class="ty-fam">Rubik · titulares</p>
<p style="font:500 30px/1.15 var(--font-titulares);color:${C.pizarra}">500 · Vuestra IA, dentro del colegio</p>
<p style="font:600 30px/1.15 var(--font-titulares);color:${C.pizarra}">600 · Vuestra IA, dentro del colegio</p>
<p style="font:700 30px/1.15 var(--font-titulares);color:${C.pizarra}">700 · Vuestra IA, dentro del colegio</p>
<p class="ty-abc" style="font:600 22px/1.3 var(--font-titulares)">ABCDEFGHIJKLMNÑOPQRSTUVWXYZ<br>abcdefghijklmnñopqrstuvwxyz · áéíóú ü ¿? ¡! 0123456789 € %</p></div>
<div class="ty-b"><p class="ty-fam">Nunito Sans · texto</p>
<p style="font:400 17px/1.55 var(--font-texto);color:${C.texto}">400 · Cuando falta un profesor, DirectorIA propone quién cubre cada hora, con las reglas del colegio, y prepara la ficha para quien sustituye: la tarea, las adaptaciones, las alergias y quién puede recoger a cada alumno.</p>
<p style="font:600 17px/1.55 var(--font-texto);color:${C.texto}">600 · DirectorIA propone. Vosotros decidís.</p>
<p style="font:700 17px/1.55 var(--font-texto);color:${C.texto}">700 · Pedir una demo en el colegio</p>
<p class="ty-abc" style="font:400 17px/1.4 var(--font-texto)">ABCDEFGHIJKLMNÑOPQRSTUVWXYZ · abcdefghijklmnñopqrstuvwxyz · 0123456789</p></div></div>`;
const escala = g => `<table class="esc"><thead><tr><th>Estilo</th><th>Tamaño</th><th>Peso · interlineado</th><th>Muestra</th></tr></thead><tbody>${g.styles.map(s => {
  const fam = (s.family || g.family) === 'titulares' ? 'var(--font-titulares)' : 'var(--font-texto)';
  const px = parseFloat(s.fontSize); const vista = Math.min(px, 30);
  const may = /^(diapo|doc)-antetitulo$/.test(s.name) ? 'text-transform:uppercase;' : '';
  return `<tr><td><code>${s.name}</code></td><td>${s.fontSize}${px > 30 ? '<br><small>(muestra reducida)</small>' : ''}</td><td>${s.fontWeight} · ${s.lineHeight}</td><td><span style="font-family:${fam};font-size:${vista}px;font-weight:${s.fontWeight};line-height:1.2;${s.letterSpacing ? `letter-spacing:${s.letterSpacing};` : ''}${may}color:${C.pizarra}">${s.sample.replace('CÓMO FUNCIONA', 'Cómo funciona').replace('PROPUESTA', 'Propuesta')}</span></td></tr>`; }).join('')}</tbody></table>`;
const lamEscalas = tk.type.groups.map(g => `<h3>Escala ${g.name.toLowerCase()}</h3>${escala(g)}`).join('');

const ilus = ['colegio-servidor', 'servidor', 'colegio', 'nube-claude', 'direccion', 'jefatura', 'secretaria', 'docente', 'orientacion', 'sustituto', 'familia', 'documento-ia', 'documento', 'circular', 'acta', 'ficha', 'correo', 'calendario', 'candado', 'microfono', 'reloj', 'alerta'];
const lamIlus = `<div class="il-rej">${ilus.map(n => `<figure><img src="${ilu(n)}" alt=""><figcaption>${n}</figcaption></figure>`).join('')}</div>`;

const pieza = (nombre, cuerpo) => `<figure class="pz"><div class="pz-v">${cuerpo}</div><figcaption>${nombre}</figcaption></figure>`;
// Las piezas citan las imágenes subidas al sistema (/_blob/<id>); design-system.json dice qué archivo es cada una.
const blobs = {};
for (const [grupo, g] of Object.entries(JSON.parse(leer('design-system.json')).assetGroups)) for (const f of Object.values(g.files)) {
  const local = grupo === 'Ilustraciones' ? `ilustraciones/${f.name}` : grupo === 'Logos' ? (f.name.endsWith('.png') ? `logo/png/${f.name}` : `logo/${f.name}`) : null;
  if (local && fs.existsSync(path.join(DIR, local))) blobs[f.blob] = url(local);
}
// Una ilustración aún sin subir se cita como /_blob/pendiente-<nombre> (ver presentacion/herramientas/blobs.mjs).
const prev = n => leer(`components/${n}/preview.html`).replace(/^<!--.*-->\n/, '')
  .replace(/\/_blob\/pendiente-([a-z0-9-]+)/g, (m, nombre) => ilu(nombre))
  .replace(/\/_blob\/([0-9a-f]{32})/g, (m, id) => {
    if (!blobs[id]) throw new Error(`components/${n}/preview.html cita ${m}, que no está en design-system.json`);
    return blobs[id];
  });
const lamPiezas = `<div class="pz-rej">${pieza('Boton', prev('Boton'))}${pieza('Antetitulo', prev('Antetitulo'))}${pieza('Insignia', prev('Insignia'))}${pieza('Listas', prev('Listas'))}</div>
<div class="pz-rej pz-2">${pieza('Tarjeta', prev('Tarjeta'))}${pieza('CajaOscura', prev('CajaOscura'))}</div>
<div class="pz-rej pz-1">${pieza('FichaSustitucion', prev('FichaSustitucion'))}</div>`;

const img = (p, pie, ancho = '100%') => fs.existsSync(path.join(DIR, p)) ? `<figure class="ap"><img src="${url(p)}" alt="" style="max-width:${ancho}"><figcaption>${pie}</figcaption></figure>` : '';
const lamAplic = `${img('presentacion/vista-general.png', 'La presentación comercial: 35 diapositivas')}
${img('manual/pdf/web-captura.png', 'La web: portada y primeras secciones')}
<div class="ap-2">${img('aplicaciones/papeleria/tarjeta-anverso.png', 'Tarjeta de visita · anverso')}${img('aplicaciones/papeleria/tarjeta-reverso.png', 'Tarjeta de visita · reverso')}</div>
<div class="ap-2">${img('aplicaciones/papeleria/membrete.png', 'Membrete')}${img('aplicaciones/papeleria/hoja-comercial-1.png', 'Hoja comercial')}</div>
<div class="ap-2">${img('aplicaciones/redes/post-presentacion.png', 'Publicación de presentación')}${img('aplicaciones/redes/post-sustituciones.png', 'Publicación sobre sustituciones')}</div>
${img('aplicaciones/redes/linkedin-banner.png', 'Fondo del perfil de LinkedIn')}
${img('aplicaciones/papeleria/firma-correo.png', 'Firma de correo', '70%')}`;

// ---------- Capítulos ----------
const caps = [
  { t: 'La marca', lead: 'Qué es DirectorIA y las reglas que no se saltan nunca.', il: 'colegio-servidor', html: md(readme._intro) + md(readme['Lo esencial']) },
  { t: 'Identidad verbal', lead: 'Cómo habla la marca: eslogan, valores, tono y cómo se escribe el nombre.', il: 'microfono', html: md(sinTitulo(leer('1-identidad-verbal.md'))) },
  { t: 'Logotipo', lead: 'La aguja de brújula: la IA orienta; vosotros decidís.', il: 'direccion', html: lamLogos + md(sinTitulo(leer('2-logotipo.md'))) + img('logo/construccion.png', 'Construcción y área de respeto') + img('logo/usos-incorrectos.png', 'Usos incorrectos') },
  { t: 'Color', lead: 'La pizarra, la tiza y el papel de un aula, con la chispa naranja de la IA.', il: 'servidor', html: lamColor + md(readme['Color'].replace(/\| Token \| Valor[\s\S]*?\n\n/, '')).replace(/<h2>Color<\/h2>/, '') + '<h3>Tokens semánticos</h3>' + lamSemanticos },
  { t: 'Tipografía', lead: 'Rubik para titular, Nunito Sans para leer.', il: 'acta', html: lamTipos + md(readme['Tipografía']).replace(/<h2>Tipografía<\/h2>/, '') + lamEscalas },
  { t: 'Ilustraciones', lead: 'Veintidós ilustraciones planas, cada una sobre su disco.', il: 'docente', html: lamIlus + md(sinTitulo(leer('3-ilustraciones.md'))) },
  { t: 'Composición y piezas', lead: 'Cómo se ordena una página, una diapositiva y un diagrama.', il: 'ficha', html: md(readme['Composición'] + readme['Diagramas']) + '<h2>Piezas</h2><p>Las piezas de la web, tal como están en el sistema de diseño. Cambian solas entre el tema claro y el oscuro.</p>' + lamPiezas + md(readme['Iconografía'] + readme['Movimiento'] + readme['Accesibilidad']) },
  { t: 'Aplicaciones', lead: 'La presentación, la web, la papelería y las redes.', il: 'sustituto', html: md(sinTitulo(leer('4-aplicaciones.md'))) + '<h2 style="break-before:page;margin-top:0">Así quedan</h2>' + lamAplic },
];
const n2 = i => String(i + 1).padStart(2, '0');

const html = `<!doctype html><html lang="es" data-theme="claro"><head><meta charset="utf-8"><title>DirectorIA · Manual de marca</title>
<style>${tokensCss}${bundleCss}
@page { size: A4; margin: 22mm 20mm 24mm;
  @bottom-left { content: "DirectorIA · Manual de marca"; font: 600 8pt "Nunito Sans", Arial, sans-serif; color: ${C.texto}; }
  @bottom-right { content: counter(page); font: 700 8pt "Nunito Sans", Arial, sans-serif; color: ${C['chispa-texto']}; } }
@page portada { margin: 0; @bottom-left { content: none } @bottom-right { content: none } }
@page abre { margin: 0; @bottom-left { content: none } @bottom-right { content: none } }
html, body { margin: 0; background: #FFFFFF; }   /* el papel de imprenta es blanco: así los márgenes no dibujan un recuadro */
body { font: 400 10pt/1.55 "Nunito Sans", Arial, sans-serif; color: ${C.texto}; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
h1, h2, h3 { font-family: "Rubik", Arial, sans-serif; color: ${C.pizarra}; margin: 0; text-wrap: balance; break-after: avoid; }
h2 { font-size: 17pt; font-weight: 600; line-height: 1.15; margin: 20pt 0 8pt; }
h3 { font-size: 12pt; font-weight: 600; margin: 14pt 0 6pt; }
p { margin: 0 0 7pt; } ul, ol { margin: 0 0 8pt; padding-left: 16pt; } li { margin-bottom: 3pt; }
blockquote { margin: 8pt 0; padding: 10pt 14pt; background: ${C.salvia}; border-radius: 8pt; color: ${C.pizarra}; font-weight: 600; }
blockquote p { margin: 0; }
strong { color: ${C.pizarra}; }
table { width: 100%; border-collapse: collapse; margin: 6pt 0 12pt; font-size: 8.8pt; line-height: 1.4; }
th { text-align: left; font-weight: 700; color: ${C.tiza}; background: ${C.pizarra}; padding: 5pt 7pt; }
td { padding: 5pt 7pt; border-bottom: 1px solid ${C.linea}; vertical-align: top; }
tr { break-inside: avoid; } tbody tr:nth-child(even) td { background: ${C.papel}; }
code { font-family: "Nunito Sans", Arial, sans-serif; font-weight: 700; font-size: .95em; color: ${C.pizarra}; background: ${C.papel}; border: 1px solid ${C.linea}; border-radius: 4pt; padding: 0 3pt; white-space: nowrap; }
code.tk i { display: inline-block; width: 7pt; height: 7pt; border-radius: 50%; margin-right: 3pt; vertical-align: -.5pt; box-shadow: 0 0 0 .6pt ${C.linea}; }
.portada { page: portada; position: relative; width: 210mm; height: 297mm; background: ${C.pizarra}; color: ${C['texto-suave']}; overflow: hidden; }
.portada .pl { position: absolute; left: 22mm; top: 24mm; width: 86mm; }
.portada h1 { position: absolute; left: 22mm; top: 168mm; width: 160mm; font: 700 46pt/1.02 "Rubik", Arial, sans-serif; color: ${C.tiza}; letter-spacing: -.01em; }
.portada .ps { position: absolute; left: 22mm; top: 216mm; width: 120mm; font: 400 13pt/1.45 "Nunito Sans", Arial, sans-serif; }
.portada .pv { position: absolute; left: 22mm; bottom: 20mm; font: 700 9pt "Nunito Sans", Arial, sans-serif; color: ${C.chispa}; letter-spacing: .08em; text-transform: uppercase; }
.portada .pi { position: absolute; right: 16mm; top: 62mm; width: 98mm; height: 98mm; }
.indice { break-after: page; }
.indice ol { list-style: none; padding: 0; margin: 14pt 0 0; }
.indice li { display: flex; gap: 14pt; align-items: baseline; padding: 9pt 0; border-bottom: 1px solid ${C.linea}; font: 600 15pt "Rubik", Arial, sans-serif; color: ${C.pizarra}; }
.indice li span { font: 700 11pt "Nunito Sans", Arial, sans-serif; color: ${C['chispa-texto']}; width: 22pt; }
.indice li small { margin-left: auto; font: 400 9.5pt "Nunito Sans", Arial, sans-serif; color: ${C.texto}; max-width: 75mm; text-align: right; }
.abre { page: abre; break-before: page; position: relative; width: 210mm; height: 297mm; background: ${C.pizarra}; overflow: hidden; }
.abre .an { position: absolute; left: 22mm; top: 30mm; font: 700 64pt/1 "Rubik", Arial, sans-serif; color: ${C.chispa}; }
.abre h1 { position: absolute; left: 22mm; top: 190mm; width: 166mm; font: 700 40pt/1.05 "Rubik", Arial, sans-serif; color: ${C.tiza}; }
.abre .al { position: absolute; left: 22mm; top: 232mm; width: 140mm; font: 400 13pt/1.45 "Nunito Sans", Arial, sans-serif; color: ${C['texto-suave']}; }
.abre img { position: absolute; right: 18mm; top: 34mm; width: 104mm; height: 104mm; }
.cap { break-before: page; }
.lg-rej { display: grid; grid-template-columns: 1fr 1fr; gap: 8pt; margin: 4pt 0 14pt; }
.lg { margin: 0; border-radius: 8pt; padding: 16pt 12pt 10pt; display: flex; flex-direction: column; align-items: center; gap: 10pt; border: 1px solid ${C.linea}; break-inside: avoid; }
.lg img { display: block; max-width: 100%; }
.lg-fila { display: flex; align-items: center; gap: 18pt; height: 76px; }
.lg figcaption { font-size: 8pt; font-weight: 700; color: ${C.texto}; align-self: flex-start; }
.lg[style*="#17322C"] figcaption { color: ${C['texto-suave']}; }
.sw-rej { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10pt 10pt; margin: 4pt 0 14pt; }
.sw { break-inside: avoid; }
.sw-c { height: 22mm; border-radius: 6pt; margin-bottom: 5pt; }
.sw-n { margin: 0; font: 600 10pt "Rubik", Arial, sans-serif; color: ${C.pizarra}; }
.sw-v { margin: 0 0 2pt; font-size: 8pt; font-weight: 700; color: ${C['chispa-texto']}; }
.sw-u { margin: 0; font-size: 7.6pt; line-height: 1.4; }
.ty { display: grid; gap: 10pt; margin: 4pt 0 10pt; }
.ty-b { background: ${C.papel}; border: 1px solid ${C.linea}; border-radius: 8pt; padding: 12pt 14pt; break-inside: avoid; }
.ty-b p { margin: 0 0 6pt; }
.ty-fam { font: 700 8pt "Nunito Sans", Arial, sans-serif !important; letter-spacing: .08em; text-transform: uppercase; color: ${C['chispa-texto']} !important; }
.ty-abc { color: ${C.texto}; }
table.esc td { vertical-align: middle; }
.esc small { font-size: 7.5pt; }
.il-rej { display: grid; grid-template-columns: repeat(6, 1fr); gap: 6pt; margin: 4pt 0 14pt; }
.il-rej figure { margin: 0; text-align: center; break-inside: avoid; }
.il-rej img { width: 100%; aspect-ratio: 1; display: block; }
.il-rej figcaption { font-size: 7.5pt; font-weight: 700; color: ${C.texto}; }
.pz-rej { display: grid; grid-template-columns: 1fr 1fr; gap: 10pt; margin: 6pt 0 10pt; zoom: .75; }
.pz-rej.pz-2 { grid-template-columns: 1fr 1fr; } .pz-rej.pz-1 { grid-template-columns: 1fr; width: 60%; }
.pz { margin: 0; break-inside: avoid; border: 1px solid ${C.linea}; border-radius: 10pt; overflow: hidden; background: ${C.tiza}; }
.pz figcaption { font: 700 14px "Nunito Sans", Arial, sans-serif; color: ${C.texto}; padding: 8px 14px; border-top: 1px solid ${C.linea}; background: ${C.papel}; }
.ap { margin: 6pt 0 12pt; break-inside: avoid; text-align: center; }
.ap img { display: block; margin: 0 auto; width: auto; height: auto; max-height: 215mm; border-radius: 6pt; border: 1px solid ${C.linea}; }
.ap-2 .ap img { max-height: 120mm; }
.ap figcaption { margin-top: 4pt; font-size: 8pt; font-weight: 700; color: ${C.texto}; }
.ap-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10pt; align-items: start; }
</style></head><body>
<section class="portada">
<img class="pl" src="${url('logo/logo-eslogan-negativo.svg')}" alt="DirectorIA. Vuestra IA, dentro del colegio.">
<img class="pi" src="${ilu('colegio-servidor')}" alt="">
<h1>Manual de marca</h1>
<p class="ps">Logotipo, color, tipografía, ilustración, voz y aplicaciones de DirectorIA, la IA para dirección y claustro.</p>
<p class="pv">Versión 1 · Noviembre de 2026</p>
</section>
<section class="indice"><h2 style="margin-top:0;font-size:26pt">Índice</h2><ol>${caps.map((c, i) => `<li><span>${n2(i)}</span>${c.t}<small>${c.lead}</small></li>`).join('')}</ol>
<p style="margin-top:22pt">Este manual resume el sistema de diseño de DirectorIA. Los archivos (logotipos, ilustraciones, fuentes y plantillas) están en la carpeta <code>directoria/</code> del repositorio de la marca y en el sistema de diseño publicado.</p></section>
${caps.map((c, i) => `<section class="abre"><p class="an">${n2(i)}</p><img src="${ilu(c.il)}" alt=""><h1>${c.t}</h1><p class="al">${c.lead}</p></section><section class="cap">${c.html}</section>`).join('\n')}
</body></html>`;

const tmp = path.join(AQUI, '.manual.html');
fs.writeFileSync(tmp, html);
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.goto(pathToFileURL(tmp).href, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({ path: OUT, preferCSSPageSize: true, printBackground: true, tagged: true, outline: true });
} finally { await browser.close(); }
fs.rmSync(tmp);
console.log('Escrito', path.relative(process.cwd(), OUT), (fs.statSync(OUT).size / 1024).toFixed(0) + ' KB');
