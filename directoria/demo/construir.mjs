// Monta la demo de DirectorIA en un solo archivo HTML, sin nada externo.
// Uso: node construir.mjs [carpeta-de-salida]
// Saca dos archivos:
//   demo-directoria.html  fragmento para publicar como página (sin <html> ni <head>)
//   index.html            documento completo para abrirlo en el navegador, también sin conexión
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
// La carpeta de la marca (fuentes, ilustraciones y logotipo): la de arriba, porque la demo vive en directoria/demo/.
// Si la demo está en otro sitio, indica la carpeta de la marca en DIRECTORIA_MARCA.
const MARCA = path.resolve(process.env.DIRECTORIA_MARCA || path.join(AQUI, '..'));
if (!fs.existsSync(path.join(MARCA, 'fuentes'))) {
  console.error(`No encuentro las fuentes de la marca en ${MARCA}. Pon la demo dentro de directoria/ o indica la carpeta de la marca en DIRECTORIA_MARCA.`);
  process.exit(1);
}
const SALIDA = path.resolve(process.argv[2] || path.join(AQUI, 'dist'));
const SRC = path.join(AQUI, 'src');

const b64 = (f) => fs.readFileSync(f).toString('base64');
const leer = (f) => fs.readFileSync(f, 'utf8');

// Fuentes de la marca (latin: cubre el castellano, «», €, ª/º y la raya)
const FUENTES = [
  ['Rubik', 500, 'rubik-latin-500-normal.woff2'],
  ['Rubik', 600, 'rubik-latin-600-normal.woff2'],
  ['Rubik', 700, 'rubik-latin-700-normal.woff2'],
  ['Nunito Sans', 400, 'nunito-sans-latin-400-normal.woff2'],
  ['Nunito Sans', 600, 'nunito-sans-latin-600-normal.woff2'],
  ['Nunito Sans', 700, 'nunito-sans-latin-700-normal.woff2'],
];
const fontFace = FUENTES.map(([fam, peso, archivo]) =>
  `@font-face{font-family:'${fam}';font-style:normal;font-weight:${peso};font-display:swap;src:url(data:font/woff2;base64,${b64(path.join(MARCA, 'fuentes', archivo))}) format('woff2')}`).join('\n');

const css = leer(path.join(SRC, 'app.css')).replace('/*FUENTES*/', fontFace);

// Ilustraciones de la casa, con su disco
const ILUS = ['direccion', 'jefatura', 'secretaria', 'docente', 'orientacion', 'sustituto', 'servidor', 'candado', 'reloj', 'microfono', 'nube-claude', 'correo', 'acta', 'ficha', 'calendario', 'documento-ia', 'familia', 'circular', 'alerta', 'colegio-servidor'];
const ilus = Object.fromEntries(ILUS.map((n) => [n, 'data:image/svg+xml;base64,' + b64(path.join(MARCA, 'ilustraciones', n + '.svg'))]));

const sinDeclaracion = (s) => s.replace(/<\?xml[^>]*>\s*/, '').trim();
const logo = sinDeclaracion(leer(path.join(MARCA, 'logo', 'logo-horizontal.svg')));
const logoNegativo = sinDeclaracion(leer(path.join(MARCA, 'logo', 'logo-horizontal-negativo.svg')));

// Datos: un archivo por perfil
const carpetaDatos = process.env.DIRECTORIA_DATOS ? path.resolve(process.env.DIRECTORIA_DATOS) : path.join(SRC, 'datos');
const datos = fs.readdirSync(carpetaDatos).filter((f) => f.endsWith('.js') && !f.startsWith('_')).sort()
  .map((f) => `/* datos/${f} */\n` + leer(path.join(carpetaDatos, f)).trim()).join('\n\n');

const nucleo = `window.DEMO = { roles: {}, rol: function (o) { this.roles[o.id] = o; }, ilus: ${JSON.stringify(ilus)}, logo: ${JSON.stringify(logo)}, logoNegativo: ${JSON.stringify(logoNegativo)} };`;
const app = leer(path.join(SRC, 'app.js'));
const guion = (js) => js.replace(/<\/script/gi, '<\\/script');

const TITULO = 'Demo de DirectorIA';
const cuerpo = `<div id="demo"></div>
<noscript><p style="padding:2rem;font-family:sans-serif">La demo de DirectorIA necesita JavaScript.</p></noscript>
<script>
${guion(nucleo)}
${guion(datos)}
</script>
<script>
${guion(app)}
</script>`;

const fragmento = `<title>${TITULO}</title>
<meta name="claude:viewport-fit-sides" content="cover">
<meta name="description" content="Aplicación de ejemplo de DirectorIA: se entra como directora, jefe de estudios, secretaría, docente, orientador o profesor que sustituye, y se ve el panel de cada uno.">
<style>
${css}
</style>
${cuerpo}
`;

const documento = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex">
<title>${TITULO}</title>
<meta name="description" content="Aplicación de ejemplo de DirectorIA: se entra como directora, jefe de estudios, secretaría, docente, orientador o profesor que sustituye, y se ve el panel de cada uno.">
<link rel="icon" href="data:image/svg+xml;base64,${b64(path.join(MARCA, 'logo', 'favicon.svg'))}">
<style>
${css}
</style>
</head>
<body>
${cuerpo}
</body>
</html>
`;

fs.mkdirSync(SALIDA, { recursive: true });
fs.writeFileSync(path.join(SALIDA, 'demo-directoria.html'), fragmento);
fs.writeFileSync(path.join(SALIDA, 'index.html'), documento);
const kb = (s) => Math.round(Buffer.byteLength(s) / 1024);
console.log(`Hecho: ${path.join(SALIDA, 'index.html')} (${kb(documento)} KB) y demo-directoria.html (${kb(fragmento)} KB)`);
