// Tres ilustraciones propias de la demo, dibujadas con las mismas piezas del kit de la marca
// (directoria/ilustraciones/generar.mjs: disco, cabeza, torso, manos, gafas, sello y bocadillo):
// - secretaria.svg: Carmen López, secretaria de unos 60 (el kit trae un secretario);
// - orientacion.svg: Andrés Vidal, orientador (el kit trae una orientadora con hiyab);
// - direccion.svg: Elena Ruiz, la directora del kit, con la tableta sin la insignia de la IA. El resumen de las 8:00 sale
//   de reglas y de los datos del colegio, y la chispa solo va en lo que escribe un modelo de lenguaje: en la esquina de la
//   pantalla lleva el ✓ de «al día» en lugar de la insignia.
// construir.mjs usa estas tres en lugar de las del kit. Están pendientes del visto bueno de la marca:
// si se aceptan, sus bloques pasan a generar.mjs; si no, basta con borrar las SVG de esta carpeta.
// Uso: node generar-dos.mjs [carpeta de salida]   (por defecto, la carpeta de este archivo)
// Todo se dibuja con formas planas y solo con los colores de la marca (directoria/tokens.json).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = process.argv[2] || path.dirname(fileURLToPath(import.meta.url));
fs.mkdirSync(OUT, { recursive: true });
const files = {};

// ───────────────────────── utilidades de dibujo ─────────────────────────
const C = {
  pizarra: '#17322C', pizarra2: '#21433B', pizarraLinea: '#2E5A50',
  tiza: '#F6F3EC', salvia: '#E7EEE9', papel: '#FFFDF8', linea: '#D5DED9',
  texto: '#41524D', textoSuave: '#C9DAD4',
  chispa: '#E07A3A', chispaTexto: '#B4531C', chispaSuave: '#FBE6D8',
};
const n = v => (Math.round(v * 10) / 10).toString();
const attrs = o => Object.entries(o).filter(([, v]) => v !== undefined && v !== null).map(([k, v]) => `${k}="${v}"`).join(' ');
const rect = (x, y, w, h, r, fill, extra = {}) => `<rect ${attrs({ x: n(x), y: n(y), width: n(w), height: n(h), rx: r ? n(r) : undefined, fill, ...extra })}/>`;
const circle = (cx, cy, r, fill, extra = {}) => `<circle ${attrs({ cx: n(cx), cy: n(cy), r: n(r), fill, ...extra })}/>`;
const ellipse = (cx, cy, rx, ry, fill, extra = {}) => `<ellipse ${attrs({ cx: n(cx), cy: n(cy), rx: n(rx), ry: n(ry), fill, ...extra })}/>`;
const P = (d, fill, extra = {}) => `<path ${attrs({ d: d.replace(/-?\d+\.\d+/g, m => n(+m)), fill, ...extra })}/>`;
// trazo con extremos redondos (para líneas de texto, firmas, ticks)
const stroke = (d, color, w, extra = {}) => `<path ${attrs({ d: d.replace(/-?\d+\.\d+/g, m => n(+m)), fill: 'none', stroke: color, 'stroke-width': n(w), 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...extra })}/>`;
const line = (x1, y1, x2, y2, color, w) => stroke(`M${n(x1)} ${n(y1)}L${n(x2)} ${n(y2)}`, color, w);
// chispa de cuatro puntas (la IA). k = cuánto «engorda» el núcleo.
// Marca de «la IA actúa»: la aguja de brújula del logotipo «Norte» (un rombo alargado),
// para que las ilustraciones hablen el mismo idioma que el logo. (Antes era una estrella de
// cuatro puntas, que el jurado del logo consideró el tópico de la IA.)
function spark(cx, cy, R, fill, k = 0.2) {
  const w = R * 0.46;
  return `<path fill="${fill}" d="${roundPoly([[cx, cy - R], [cx + w, cy], [cx, cy + R], [cx - w, cy]], R * 0.08)}"/>`;
}
// rectángulo con radios distintos por esquina [tl, tr, br, bl]
function rrectPath(x, y, w, h, [tl, tr, br, bl]) {
  return `M${n(x + tl)} ${n(y)}H${n(x + w - tr)}${tr ? `A${n(tr)} ${n(tr)} 0 0 1 ${n(x + w)} ${n(y + tr)}` : ''}V${n(y + h - br)}${br ? `A${n(br)} ${n(br)} 0 0 1 ${n(x + w - br)} ${n(y + h)}` : ''}H${n(x + bl)}${bl ? `A${n(bl)} ${n(bl)} 0 0 1 ${n(x)} ${n(y + h - bl)}` : ''}V${n(y + tl)}${tl ? `A${n(tl)} ${n(tl)} 0 0 1 ${n(x + tl)} ${n(y)}` : ''}Z`;
}
const svgDoc = (content, title) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="240" height="240">${title ? `<title>${title}</title>` : ''}${content}</svg>\n`;
// polígono con esquinas redondeadas (puntos en sentido horario en pantalla)
function roundPoly(pts, r) {
  const m = pts.length;
  let d = '';
  for (let i = 0; i < m; i++) {
    const Q = pts[(i - 1 + m) % m], V = pts[i], N = pts[(i + 1) % m];
    const rr = Array.isArray(r) ? r[i] : r;
    const u1 = norm([Q[0] - V[0], Q[1] - V[1]]), u2 = norm([N[0] - V[0], N[1] - V[1]]);
    const cos = u1[0] * u2[0] + u1[1] * u2[1];
    const half = Math.acos(Math.max(-1, Math.min(1, cos))) / 2;
    const t = rr / Math.tan(half);
    const A = [V[0] + u1[0] * t, V[1] + u1[1] * t], B = [V[0] + u2[0] * t, V[1] + u2[1] * t];
    const cross = u1[0] * u2[1] - u1[1] * u2[0];
    const sweep = cross < 0 ? 1 : 0;
    d += (i === 0 ? `M${n(A[0])} ${n(A[1])}` : `L${n(A[0])} ${n(A[1])}`) + `A${n(rr)} ${n(rr)} 0 0 ${sweep} ${n(B[0])} ${n(B[1])}`;
  }
  return d + 'Z';
}
function norm(v) { const l = Math.hypot(v[0], v[1]); return [v[0] / l, v[1] / l]; }

// ───────────────────────── sistema ─────────────────────────
// Disco de fondo común (linea): todo se lee igual sobre tiza, salvia, papel o pizarra.
const D = { cx: 120, cy: 120, r: 104 };
const DISC = circle(D.cx, D.cy, D.r, C.linea);
const save = (name, title, body) => { files[name] = svgDoc(DISC + body, title); };
const SKIN = C.papel;          // cabezas y manos: un tono neutro, no realista, igual para todos
const INK = C.pizarra;         // ojos, gafas, trazos finos
// Radios de esquina del kit: 4 (piezas pequeñas), 10 (hojas, tarjetas, pantallas), 16 (cuerpos grandes)
const R1 = 4, R2 = 10, R3 = 16;

// Torso con hombros redondeados; la base sigue el borde del disco. Si un hombro se sale del disco
// (figuras descentradas), el contorno se corta justo donde el arco del hombro toca el borde.
function torso(fill, { cx = 120, T = 142, W = 70, s = 30 } = {}) {
  const L = cx - W, R = cx + W;
  const yb = x => D.cy + Math.sqrt(D.r ** 2 - (x - D.cx) ** 2);
  const inside = (x, y) => Math.hypot(x - D.cx, y - D.cy) <= D.r;
  // corte del arco del hombro (centro ox, oy; radio s) con el borde del disco, del lado «side» (-1 izq., 1 der.)
  const cut = (ox, oy, side) => {
    const dx = ox - D.cx, dy = oy - D.cy, d = Math.hypot(dx, dy);
    const a = (D.r ** 2 - s ** 2 + d ** 2) / (2 * d), h = Math.sqrt(D.r ** 2 - a ** 2);
    const px = D.cx + a * dx / d, py = D.cy + a * dy / d;
    const c = [[px - h * dy / d, py + h * dx / d], [px + h * dy / d, py - h * dx / d]];
    return c.find(([x, y]) => y < oy && (x - ox) * side > 0);
  };
  const left = inside(L, T + s) ? [L, yb(L)] : cut(L + s, T + s, -1);
  const right = inside(R, T + s) ? [R, yb(R)] : cut(R - s, T + s, 1);
  // la base va de izquierda a derecha por abajo; arco largo solo si pasa de media vuelta
  const ang = ([x, y]) => Math.atan2(y - D.cy, x - D.cx);
  const big = (ang(left) < 0 ? ang(left) + 2 * Math.PI : ang(left)) - ang(right) > Math.PI ? 1 : 0;
  let d = inside(L, T + s) ? `M${L} ${T + s}L${left[0]} ${left[1]}` : `M${left[0]} ${left[1]}`;
  d += `A${D.r} ${D.r} 0 ${big} 0 ${right[0]} ${right[1]}`;
  d += inside(R, T + s) ? `L${R} ${T + s}A${s} ${s} 0 0 0 ${R - s} ${T}` : `A${s} ${s} 0 0 0 ${R - s} ${T}`;
  d += `L${L + s} ${T}A${s} ${s} 0 0 0 ${inside(L, T + s) ? `${L} ${T + s}` : `${left[0]} ${left[1]}`}Z`;
  return P(d, fill);
}
// Cabeza ligeramente ovalada; misma medida para todos los adultos (k < 1 para la niña).
const head = (cx = 120, cy = 97.5, k = 1) => P(`M${cx} ${cy - 33.5 * k}C${cx + 19 * k} ${cy - 33.5 * k} ${cx + 29 * k} ${cy - 19.5 * k} ${cx + 29 * k} ${cy - 0.5 * k}C${cx + 29 * k} ${cy + 19.5 * k} ${cx + 17 * k} ${cy + 33.5 * k} ${cx} ${cy + 33.5 * k}C${cx - 17 * k} ${cy + 33.5 * k} ${cx - 29 * k} ${cy + 19.5 * k} ${cx - 29 * k} ${cy - 0.5 * k}C${cx - 29 * k} ${cy - 19.5 * k} ${cx - 19 * k} ${cy - 33.5 * k} ${cx} ${cy - 33.5 * k}Z`, SKIN);
const ears = (cx = 120, cy = 101) => circle(cx - 28.5, cy, 6.5, SKIN) + circle(cx + 28.5, cy, 6.5, SKIN);
const neck = (cx = 120) => rect(cx - 10, 118, 20, 30, 0, SKIN);
const eyes = (cx = 120, y = 100) => circle(cx - 10.5, y, 2.7, INK) + circle(cx + 10.5, y, 2.7, INK);
const smile = (cx = 120, y = 116) => stroke(`M${cx - 5.5} ${y}Q${cx} ${y + 3.2} ${cx + 5.5} ${y}`, INK, 2.5);
const glassesRound = (cx = 120, y = 100) => stroke(`M${cx - 19} ${y}a8.5 7.5 0 1 0 17 0a8.5 7.5 0 1 0 -17 0M${cx + 2} ${y}a8.5 7.5 0 1 0 17 0a8.5 7.5 0 1 0 -17 0M${cx - 2} ${y - 1}L${cx + 2} ${y - 1}`, INK, 3);
const glassesRect = (cx = 120, y = 100) => P(`${rrectPath(cx - 20, y - 7, 18, 14, [5, 5, 5, 5])}${rrectPath(cx + 2, y - 7, 18, 14, [5, 5, 5, 5])}M${cx - 2} ${y - 2}H${cx + 2}`, 'none', { stroke: INK, 'stroke-width': 3, 'stroke-linecap': 'round' });
const hand = (x, y) => ellipse(x, y, 7, 10, SKIN);
// Brazo levantado: la manga es un trazo redondeado del color de la ropa y acaba en la mano.
const arm = (x1, y1, x2, y2, fill, w = 16) => stroke(`M${x1} ${y1}L${x2} ${y2}`, fill, w);

// La chispa (la IA): naranja y siempre sobre pizarra.
const aiBadge = (cx, cy, r = 23) => circle(cx, cy, r, C.pizarra) + spark(cx, cy, r * 0.66, C.chispa);
// La misma insignia con un aro del color del disco que la separa de lo que tiene debajo.
const aiBadgeCut = (cx, cy, r, gap = 4) => circle(cx, cy, r + gap, C.linea) + aiBadge(cx, cy, r);

// Hoja de papel con esquina doblada (todas las hojas del kit comparten medidas).
const SHEET = { x: 66, y: 40, w: 108, h: 150, fold: 28 };
function sheet({ x, y, w, h, fold } = SHEET) {
  return P(`M${x + R2} ${y}H${x + w - fold}L${x + w} ${y + fold}V${y + h - R2}A${R2} ${R2} 0 0 1 ${x + w - R2} ${y + h}H${x + R2}A${R2} ${R2} 0 0 1 ${x} ${y + h - R2}V${y + R2}A${R2} ${R2} 0 0 1 ${x + R2} ${y}Z`, C.papel) +
    P(`M${x + w - fold} ${y}V${y + fold - 8}A8 8 0 0 0 ${x + w - fold + 8} ${y + fold}H${x + w}Z`, C.textoSuave);
}
const textLine = (x1, x2, y, color = C.textoSuave, w = 6) => line(x1, y, x2, y, color, w);
const titleLine = (x1, x2, y) => line(x1, y, x2, y, C.pizarra, 8);
const tick = (x, y, color, w) => stroke(`M${x - 4} ${y}L${x - 1} ${y + 3.5}L${x + 4.5} ${y - 3.5}`, color, w);

// ───────────────────────── personas ─────────────────────────
// Secretaría (demo): Carmen López, mujer de unos 60, pelo canoso recogido en un moño y gafas; levanta el sello
// del centro y en la hoja ya se ve su marca, el mismo aro que el sello de la circular.
{
  let s = '';
  s += circle(120, 57, 12, C.texto);                                                  // moño (detrás)
  s += neck() + torso(C.pizarra2);
  s += P('M104 142L136 142L120 166Z', C.textoSuave) + P('M110 142L130 142L120 156Z', SKIN); // blusa
  s += ears() + head();
  s += P('M90.5 99C88.5 75 102 61 120 61C138 61 151.5 75 149.5 99C147 89 141 82 133 79C125 82 115 82 107 79C99 82 93 89 90.5 99Z', C.texto); // pelo canoso, recogido
  s += eyes() + smile() + glassesRect();
  // hoja con la marca del sello, sujeta con una mano
  s += P(rrectPath(64, 170, 60, 46, [R1, R1, R1, R1]), C.papel);
  const mx = 94, my = 191;
  s += circle(mx, my, 12.5, 'none', { stroke: C.pizarraLinea, 'stroke-width': 3 });
  s += P(roundPoly([[mx, my - 7.5], [mx + 8, my - 2.2], [mx - 8, my - 2.2]], 1), C.pizarraLinea);
  s += rect(mx - 6, my - 1, 2.6, 6, 0, C.pizarraLinea) + rect(mx - 1.3, my - 1, 2.6, 6, 0, C.pizarraLinea) + rect(mx + 3.4, my - 1, 2.6, 6, 0, C.pizarraLinea);
  s += rect(mx - 7.5, my + 5, 15, 2.6, 1, C.pizarraLinea);
  s += hand(64, 196);
  // el sello, en alto: la base tapa la muñeca
  const sx = 177, sy = 100;
  s += arm(148, 180, sx - 2, sy + 22, C.pizarra2, 18);
  s += P(rrectPath(sx - 20, sy + 12, 40, 13, [R1, R1, 2, 2]), C.pizarraLinea);
  s += rect(sx - 18, sy + 24, 36, 5, 1.5, C.pizarra);
  s += P(`M${sx - 5} ${sy - 12}H${sx + 5}L${sx + 8} ${sy + 13}H${sx - 8}Z`, C.pizarraLinea);
  s += hand(sx, sy);
  s += circle(sx, sy - 16, 9, C.pizarraLinea);
  save('secretaria', 'Secretaría: secretaria con el sello del centro y una hoja sellada', s);
}
// Orientación (demo): Andrés Vidal, hombre de unos 45, pelo corto con raya y gafas redondas; bocadillo con un corazón.
{
  let s = '';
  s += neck() + torso(C.texto);
  s += P('M103 142L120 157L137 142L133 137L120 147L107 137Z', C.papel);             // cuello de camisa
  s += ears() + head();
  s += P('M90 97C88 72 102 58 121 58C139 58 152 71 150 96C147 86 141 80 133 77C123 80 106 79 97 74C94 80 91 88 90 97Z', C.pizarra2); // pelo corto con raya
  s += eyes() + smile() + glassesRound();
  s += P(rrectPath(140, 40, 66, 52, [R2, R2, R2, R2]), C.pizarra);                   // bocadillo
  s += P('M160 90L154 106L174 90Z', C.pizarra);
  s += P('M173 82C164 75 156 69 156 61C156 55 160 52 165 52C169 52 172 55 173 58C174 55 177 52 181 52C186 52 190 55 190 61C190 69 182 75 173 82Z', C.papel);
  save('orientacion', 'Orientación: orientador con gafas y un bocadillo con un corazón', s);
}
// Dirección (demo): la misma directora del kit (mujer de unos 55, melena corta y gafas, con americana), con la tableta
// del resumen del día. En la esquina de la pantalla, el ✓ de «al día» (pizarra y papel) en lugar de la insignia de la IA.
{
  let s = '';
  s += P(rrectPath(86, 58, 68, 74, [34, 34, 12, 12]), C.pizarra);                  // melena (detrás)
  s += neck() + torso(C.texto);                                                       // americana clara: la tableta oscura se separa de ella
  s += P('M102 142L138 142L120 166Z', C.textoSuave);                                  // blusa
  s += P('M109 142L131 142L120 157Z', SKIN);
  s += P('M94 142L104 142L120 170L111 180Z', C.pizarra2) + P('M146 142L136 142L120 170L129 180Z', C.pizarra2); // solapas
  s += head();
  s += P('M90 101C88 72 103 58 121 58C140 58 153 71 151 95C145 84 138 76 130 70C118 84 104 94 90 101Z', C.pizarra); // flequillo
  s += eyes() + smile() + glassesRound();
  s += rect(78, 154, 84, 58, R2, C.pizarra);                                          // tableta
  s += rect(85, 161, 70, 44, R1, C.papel);                                            // pantalla: el resumen
  s += textLine(93, 115, 170, C.pizarra, 5);                                          // barra corta (titular)
  [182, 194].forEach((y, i) => { s += circle(95, y, 3, C.pizarra) + textLine(103, i ? 128 : 138, y, C.textoSuave, 5); });
  s += circle(144, 173, 9, C.pizarra) + tick(144, 173, C.papel, 2.4);                // al día (sin la insignia de la IA)
  s += hand(78, 194) + hand(162, 194);
  save('direccion', 'Dirección: directora con la tableta del resumen del día', s);
}
for (const [name, svg] of Object.entries(files)) fs.writeFileSync(path.join(OUT, name + '.svg'), svg);
console.log(Object.keys(files).length + ' SVG en ' + OUT);
