// Kit de ilustraciones de DirectorIA: genera los 21 SVG de esta carpeta.
// Uso: node generar.mjs [carpeta de salida]   (por defecto, la carpeta de este archivo)
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
// Dirección: mujer de unos 55, melena corta y gafas, con americana; tableta con el resumen del día.
// El resumen de las 8:00 sale de las reglas y los datos del colegio, sin IA: en la esquina de la pantalla
// lleva el ✓ de «al día» (pizarra y papel), no la insignia de la IA. Es el mismo dibujo que la demo.
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
// Jefatura de estudios: hombre de unos 45, pelo corto y barba recortada; cuadrante de horarios.
{
  let s = '';
  s += neck() + torso(C.pizarraLinea);
  s += P('M103 142L120 157L137 142L133 137L120 147L107 137Z', C.papel);             // cuello de camisa
  s += ears() + head();
  s += P('M90 97C88 73 102 59 120 59C139 59 152 72 150 97C148 89 146 84 141 80C129 84 110 82 99 75C95 81 92 88 90 97Z', C.pizarra); // pelo corto
  s += P('M91 99C91 121 103 133 120 133C137 133 149 121 149 99L146.5 99C146 110 141 117 133 120C127 122 113 122 107 120C99 117 94 110 93.5 99Z', C.pizarra); // barba
  s += P('M108 114.5C111 111.5 116 111 120 113C124 111 129 111.5 132 114.5C128 115.8 124 115.6 120 114.8C116 115.6 112 115.8 108 114.5Z', C.pizarra); // bigote
  s += eyes();
  s += rect(80, 156, 80, 56, R2, C.papel);                                            // cuadrante
  s += P(rrectPath(80, 156, 80, 14, [R2, R2, 0, 0]), C.pizarra);
  const cols = [87, 105, 123, 141], rows = [176, 188, 200];
  const on = [[1, 0, 1, 0], [0, 1, 0, 1], [1, 0, 0, 1]];
  rows.forEach((y, j) => cols.forEach((x, i) => { s += rect(x, y, 13, 8, 2, on[j][i] ? C.pizarraLinea : C.linea); }));
  s += hand(80, 192) + hand(160, 192);
  save('jefatura', 'Jefatura de estudios: jefe de estudios con el cuadrante de horarios', s);
}
// Secretaría: hombre de unos 60, calvo con canas a los lados, gafas y bigote; levanta el sello
// del centro y en la hoja ya se ve su marca, el mismo aro que el sello de la circular.
{
  let s = '';
  s += neck() + torso(C.pizarra2);
  s += P('M104 142L136 142L120 168Z', C.papel);
  s += P('M116.5 146L123.5 146L125.5 163L120 170L114.5 163Z', C.pizarraLinea);        // corbata
  s += head();
  s += P('M91.5 110C88 99 89 88 95 80C97.5 86 98.5 93 98 100C97.8 104 97 108 95.5 111Z', C.texto) + P('M148.5 110C152 99 151 88 145 80C142.5 86 141.5 93 142 100C142.2 104 143 108 144.5 111Z', C.texto); // canas
  s += ears();
  s += P('M108 114C112 109 117 110 120 112.5C123 110 128 109 132 114C126 116 114 116 108 114Z', C.texto); // bigote
  s += eyes() + glassesRect();
  // hoja con la marca del sello, sujeta con una mano
  s += P(rrectPath(64, 170, 60, 46, [R1, R1, R1, R1]), C.papel);
  const mx = 94, my = 191;
  s += circle(mx, my, 12.5, 'none', { stroke: C.pizarraLinea, 'stroke-width': 3 });
  s += P(roundPoly([[mx, my - 7.5], [mx + 8, my - 2.2], [mx - 8, my - 2.2]], 1), C.pizarraLinea);
  s += rect(mx - 6, my - 1, 2.6, 6, 0, C.pizarraLinea) + rect(mx - 1.3, my - 1, 2.6, 6, 0, C.pizarraLinea) + rect(mx + 3.4, my - 1, 2.6, 6, 0, C.pizarraLinea);
  s += rect(mx - 7.5, my + 5, 15, 2.6, 1, C.pizarraLinea);
  s += hand(64, 196);
  // el sello, en alto: la base tapa la muñeca
  const sx = 177, sy = 100;                                                          // la mano agarra el mango
  s += arm(148, 180, sx - 2, sy + 22, C.pizarra2, 18);
  s += P(rrectPath(sx - 20, sy + 12, 40, 13, [R1, R1, 2, 2]), C.pizarraLinea);       // base
  s += rect(sx - 18, sy + 24, 36, 5, 1.5, C.pizarra);                                // goma
  s += P(`M${sx - 5} ${sy - 12}H${sx + 5}L${sx + 8} ${sy + 13}H${sx - 8}Z`, C.pizarraLinea); // mango
  s += hand(sx, sy);
  s += circle(sx, sy - 16, 9, C.pizarraLinea);                                       // pomo
  save('secretaria', 'Secretaría: secretario con el sello del centro y una hoja sellada', s);
}
// Docente: maestra de unos 35, pelo rizado; con la tiza en la mano, dibuja en la pizarra un sol y una casa
// (dibujos, no letras ni números, para que nada se lea como un carácter).
{
  let s = '';
  const cx = 150;
  s += rect(46, 56, 64, 54, R2, C.pizarraLinea);                                      // pizarra (a más de 12 del borde del disco)
  const sx = 63, sy = 73;                                                              // sol
  s += circle(sx, sy, 5.5, C.tiza);
  for (let a = 0; a < 8; a++) { const t = a * Math.PI / 4; s += line(sx + Math.cos(t) * 9, sy + Math.sin(t) * 9, sx + Math.cos(t) * 12.5, sy + Math.sin(t) * 12.5, C.tiza, 2.6); }
  s += stroke('M71 101V89L82 79L93 89V101Z', C.tiza, 3.2) + stroke('M79.5 101V94H84.5V101', C.tiza, 2.6); // casa con su puerta
  s += neck(cx) + torso(C.pizarra2, { cx });
  s += P(`M${cx - 15} 142L${cx + 15} 142L${cx} 160Z`, SKIN);
  const curls = [[-24, -20], [-12, -30], [2, -33], [16, -29], [26, -18], [30, -4], [-28, -6], [-31, 8], [31, 10], [-29, 22], [30, 24]];
  curls.forEach(([dx, dy]) => { s += circle(cx + dx, 97.5 + dy, 13, C.pizarra); });  // rizos
  s += head(cx);
  s += P(`M${cx - 27} 92C${cx - 24} 74 ${cx - 10} 68 ${cx} 68C${cx + 12} 68 ${cx + 25} 74 ${cx + 27} 92C${cx + 18} 82 ${cx + 8} 79 ${cx} 79C${cx - 9} 79 ${cx - 18} 82 ${cx - 27} 92Z`, C.pizarra);
  s += eyes(cx) + smile(cx);
  s += arm(128, 172, 104, 112, C.pizarra2, 17);                                       // brazo levantado hasta la pizarra
  s += line(98, 100, 94, 95, C.tiza, 4);                                              // la tiza, en la esquina de la casa
  s += hand(102, 106);
  save('docente', 'Docente: maestra dibujando en la pizarra con la tiza', s);
}
// Orientación y tutoría: mujer de unos 45 con hiyab; bocadillo con un corazón.
{
  let s = '';
  const ax = 120;
  s += torso(C.texto);
  s += P(`M${ax - 38} 100C${ax - 38} 70 ${ax - 22} 56 ${ax} 56C${ax + 22} 56 ${ax + 38} 70 ${ax + 38} 100C${ax + 38} 126 ${ax + 34} 140 ${ax + 46} 150L${ax - 46} 150C${ax - 34} 140 ${ax - 38} 126 ${ax - 38} 100Z`, C.pizarraLinea); // hiyab
  s += P(`M${ax} 68C${ax + 16} 68 ${ax + 25} 80 ${ax + 25} 97C${ax + 25} 116 ${ax + 15} 129 ${ax} 129C${ax - 15} 129 ${ax - 25} 116 ${ax - 25} 97C${ax - 25} 80 ${ax - 16} 68 ${ax} 68Z`, SKIN);
  s += eyes(ax, 100) + smile(ax, 115);
  s += P(rrectPath(140, 40, 66, 52, [R2, R2, R2, R2]), C.pizarra);                   // bocadillo
  s += P('M160 90L154 106L174 90Z', C.pizarra);
  s += P('M173 82C164 75 156 69 156 61C156 55 160 52 165 52C169 52 172 55 173 58C174 55 177 52 181 52C186 52 190 55 190 61C190 69 182 75 173 82Z', C.papel);
  save('orientacion', 'Orientación y tutoría: orientadora con hiyab y un bocadillo con un corazón', s);
}
// Sustituto: hombre de unos 28, tupé; tarjeta con una lista.
{
  let s = '';
  s += neck() + torso(C.pizarra);
  s += P('M106 142L134 142L120 160Z', C.tiza);                                        // camiseta
  s += P('M106 142L120 160L134 142L138 142L120 166L102 142Z', C.pizarraLinea);
  s += ears() + head();
  s += P('M90 96C86 72 98 56 118 54C132 52 146 56 152 66C156 74 152 84 150 94C147 86 142 80 136 77C126 80 110 80 100 76C95 82 92 88 90 96Z', C.pizarra);
  s += eyes() + smile();
  s += rect(91, 156, 58, 58, R2, C.papel);                                            // tarjeta
  for (let i = 0; i < 3; i++) {
    const y = 170 + i * 14;
    s += rect(98, y - 5, 10, 10, 2.5, C.pizarraLinea) + tick(103, y, C.papel, 2.2);
    s += textLine(115, i === 1 ? 132 : 141, y, C.textoSuave, 5);
  }
  s += hand(91, 194) + hand(149, 194);
  save('sustituto', 'Profesor sustituto con su ficha', s);
}
// Familia: padre de unos 40 (pelo ondulado con raya, sin barba) que rodea a su hija con el brazo
// y le apoya la mano en el hombro. Son quienes reciben las cartas y circulares.
{
  let s = '';
  const ax = 98;
  s += neck(ax) + torso(C.pizarraLinea, { cx: ax, W: 66 });
  s += P(`M${ax - 14} 142L${ax} 156L${ax + 14} 142Z`, SKIN);
  s += ears(ax) + head(ax);
  s += P(`M${ax - 30} 99C${ax - 33} 74 ${ax - 18} 58 ${ax + 1} 58C${ax + 20} 58 ${ax + 33} 70 ${ax + 30} 97C${ax + 27} 87 ${ax + 22} 81 ${ax + 14} 79C${ax + 8} 84 ${ax - 2} 86 ${ax - 10} 82C${ax - 15} 79 ${ax - 18} 76 ${ax - 19} 73C${ax - 24} 79 ${ax - 27} 88 ${ax - 30} 99Z`, C.pizarra); // pelo ondulado con raya
  s += eyes(ax) + smile(ax);
  const kx = 158;                                                                    // niña
  s += torso(C.texto, { cx: kx, T: 178, W: 38, s: 18 });
  s += stroke(`M${kx - 34} 186L${kx + 24} 181`, C.pizarraLinea, 13);                 // el brazo del padre, por detrás de su cuello
  s += rect(kx - 8, 160, 16, 22, 0, SKIN);
  s += P(`M${kx - 10} 178L${kx + 10} 178L${kx} 190Z`, SKIN);
  s += circle(kx - 21, 128, 9, C.pizarra) + circle(kx + 21, 128, 9, C.pizarra);       // moñitos
  s += head(kx, 148, 0.72);
  s += P(`M${kx - 21} 146C${kx - 22} 128 ${kx - 12} 122 ${kx} 122C${kx + 12} 122 ${kx + 22} 128 ${kx + 21} 146C${kx + 14} 138 ${kx + 6} 134 ${kx} 134C${kx - 6} 134 ${kx - 14} 138 ${kx - 21} 146Z`, C.pizarra);
  s += circle(kx - 7.5, 150, 2.2, INK) + circle(kx + 7.5, 150, 2.2, INK) + stroke(`M${kx - 4} 161Q${kx} 163.5 ${kx + 4} 161`, INK, 2.2);
  s += hand(kx + 26, 184);                                                            // y su mano en el hombro de ella
  save('familia', 'Familia: padre con la mano en el hombro de su hija', s);
}

// ───────────────────────── lugares ─────────────────────────
// Servidor: torre en pizarra con la chispa, dos bahías y un escudo con cerradura.
// Se dibuja con su esquina superior izquierda en (ox, oy) y a escala k; mide 84k × 162k con las patas.
// El colegio con el servidor usa esta misma función a escala reducida, así son el mismo servidor.
function serverTower(ox, oy, k = 1, { sparkR = 16 * k, grow = 0 } = {}) {
  const X = v => ox + v * k, Y = v => oy + v * k;
  // grow (máx. 10): el panel de la chispa crece hacia abajo, primero ocupando el hueco que lo separa
  // de las bahías; solo lo que pase de 7 baja las bahías y el escudo. La torre mide lo mismo.
  const b1 = Math.max(70, 63 + grow), sh = b1 - 70;
  let s = '';
  s += rect(X(0), Y(0), 84 * k, 156 * k, R3 * k, C.pizarra);
  s += rect(X(11), Y(11), 62 * k, (48 + grow) * k, R2 * k, C.pizarra2);
  s += spark(X(42), Y(35 + grow / 2), sparkR, C.chispa);
  [b1, b1 + 22].forEach(y => { s += rect(X(11), Y(y), 62 * k, 15 * k, 5 * k, C.pizarra2) + line(X(20), Y(y + 7.5), X(42), Y(y + 7.5), C.tiza, 4 * k) + circle(X(63), Y(y + 7.5), 3 * k, C.textoSuave); });
  const Ys = v => Y(v + sh);
  s += P(`M${X(42)} ${Ys(113)}L${X(58)} ${Ys(119)}V${Ys(129)}C${X(58)} ${Ys(138)} ${X(51)} ${Ys(144)} ${X(42)} ${Ys(148)}C${X(33)} ${Ys(144)} ${X(26)} ${Ys(138)} ${X(26)} ${Ys(129)}V${Ys(119)}Z`, C.tiza); // escudo
  s += circle(X(42), Ys(127), 4.2 * k, C.pizarra) + P(`M${X(39.2)} ${Ys(129)}L${X(44.8)} ${Ys(129)}L${X(45.8)} ${Ys(138)}L${X(38.2)} ${Ys(138)}Z`, C.pizarra);
  s += rect(X(10), Y(152), 16 * k, 10 * k, 3 * k, C.pizarra) + rect(X(58), Y(152), 16 * k, 10 * k, 3 * k, C.pizarra); // patas
  return s;
}
save('servidor', 'Servidor de DirectorIA, dentro del colegio', serverTower(78, 38));
function clockFace(cx, cy, r) {
  const ah = 8 * Math.PI / 6;
  return circle(cx, cy, r, C.papel) + circle(cx, cy, r, 'none', { stroke: C.pizarra, 'stroke-width': 3 }) +
    stroke(`M${cx} ${cy}L${cx} ${cy - r * 0.62}M${cx} ${cy}L${n(cx + Math.sin(ah) * r * 0.45)} ${n(cy - Math.cos(ah) * r * 0.45)}`, C.pizarra, 2.6);
}
// El colegio: dos alas con tejado de pizarra y un cuerpo central con frontón curvo, reloj,
// un ventanal grande y la puerta en arco debajo. Con server = true, por el ventanal se ve
// el interior (pared del fondo, suelo y el grosor del muro) y, dentro, el servidor.
const WIN = { x: 87, y: 54, w: 66, h: 100, t: 4 };                                       // ventanal (marco por fuera)
function school({ server = false } = {}) {
  let s = '';
  const yg = 188, hw = Math.sqrt(D.r ** 2 - (yg - D.cy) ** 2);                       // patio
  s += P(`M${D.cx - hw} ${yg}H${D.cx + hw}A${D.r} ${D.r} 0 0 1 ${D.cx - hw} ${yg}Z`, C.salvia);
  s += P(roundPoly([[42, 114], [59, 98], [181, 98], [198, 114]], 3), C.pizarra);       // tejado de pizarra
  s += rect(44, 112, 152, 76, 0, C.papel);                                            // alas
  const win = (x, y) => rect(x, y, 12, 22, 3, C.pizarraLinea) + line(x + 6, y + 3, x + 6, y + 19, C.tiza, 2);
  [48, 63, 165, 180].forEach(x => { s += win(x, 122) + win(x, 152); });
  // cuerpo central: muros rectos y remate en arco rebajado
  const bx = 78, bw = 84, top = 56, sag = 18, Rb = ((bw / 2) ** 2 + sag ** 2) / (2 * sag), cyb = top - sag + Rb;
  s += P(`M${bx} 188V${top}A${n(Rb)} ${n(Rb)} 0 0 1 ${bx + bw} ${top}V188Z`, C.tiza);
  const ro = Rb + 2.5, ri = Rb - 3.5, yc = top + 2;                                   // frontón curvo (cornisa)
  const xo = Math.sqrt(ro ** 2 - (cyb - yc) ** 2), xi = Math.sqrt(ri ** 2 - (cyb - yc) ** 2);
  s += P(`M${n(120 - xo)} ${yc}A${n(ro)} ${n(ro)} 0 0 1 ${n(120 + xo)} ${yc}L${n(120 + xi)} ${yc}A${n(ri)} ${n(ri)} 0 0 0 ${n(120 - xi)} ${yc}Z`, C.pizarra);
  s += clockFace(120, 40, 11);
  // ventanal
  const { x, y, w, h, t } = WIN, ix = x + t, iy = y + t, iw = w - 2 * t, ih = h - 2 * t;
  s += rect(x, y, w, h, 6, C.pizarraLinea);                                           // marco
  s += rect(x - 4, y + h - 2, w + 8, 6, 2, C.pizarraLinea);                           // alféizar
  if (!server) {
    // cristales: rejilla de 3 × 4 cuarterones, como los ventanales de las aulas
    s += rect(ix, iy, iw, ih, 3, C.pizarraLinea);
    for (let c = 1; c < 3; c++) s += line(ix + c * iw / 3, iy + 3, ix + c * iw / 3, iy + ih - 3, C.tiza, 2.5);
    for (let r = 1; r < 4; r++) s += line(ix + 3, iy + r * ih / 4, ix + iw - 3, iy + r * ih / 4, C.tiza, 2.5);
  } else {
    // la sala, en perspectiva: techo y paredes laterales (el grosor del muro), pared del fondo y suelo
    const dx = 8, dt = 6, db = 14;                                                    // profundidad a los lados, arriba y abajo
    const L = ix, R = ix + iw, T = iy, B = iy + ih;
    s += rect(L, T, iw, ih, 3, C.linea);
    s += rect(L + dx, T + dt, iw - 2 * dx, ih - dt - db, 0, C.salvia);                // pared del fondo
    s += P(`M${L} ${B}L${L + dx} ${B - db}H${R - dx}L${R} ${B}Z`, C.textoSuave);      // suelo
    // el mismo servidor a media escala (42 × 81); su panel crece 10 para que la chispa sea de radio 13
    const k = 0.5, sw = 84 * k, sh = 162 * k;
    s += serverTower(120 - sw / 2, B - 6 - sh, k, { sparkR: 13, grow: 10 });
  }
  s += P('M108 188V172A12 12 0 0 1 132 172V188Z', C.pizarra2);                        // puerta en arco
  s += line(120, 166, 120, 186, C.pizarraLinea, 2);
  s += rect(44, 184, 152, 8, 3, C.pizarraLinea);                                      // zócalo
  return s;
}
save('colegio', 'Colegio con reloj, ventanal y puerta en arco', school());
save('colegio-servidor', 'Colegio con el servidor de DirectorIA dentro, a la vista por el ventanal', school({ server: true }));
// Nube (módulo opcional): fuera del colegio; solo recibe peticiones de material didáctico (un libro abierto).
{
  let s = '';
  s += P('M62 162C46 162 35 150 35 135C35 120 47 109 61 109C63 86 81 70 103 70C119 70 133 79 140 94C144 92 149 91 154 91C174 91 189 106 190 125C200 128 206 137 206 148C206 156 200 162 192 162Z', C.papel);
  const cx = 120, W = 38, T = 106, B = 147;
  s += P(`M${cx - W} ${T}C${cx - W + 14} ${T - 5} ${cx - 10} ${T - 4} ${cx} ${T + 3}C${cx + 10} ${T - 4} ${cx + W - 14} ${T - 5} ${cx + W} ${T}V${B}C${cx + W - 14} ${B - 5} ${cx + 10} ${B - 4} ${cx} ${B + 3}C${cx - 10} ${B - 4} ${cx - W + 14} ${B - 5} ${cx - W} ${B}Z`, C.pizarraLinea);
  const page = sgn => P(`M${cx + sgn * (W - 4)} ${T - 2}C${cx + sgn * (W - 16)} ${T - 7} ${cx + sgn * 9} ${T - 6} ${cx + sgn * 2} ${T + 1}V${B - 3}C${cx + sgn * 9} ${B - 8} ${cx + sgn * (W - 16)} ${B - 9} ${cx + sgn * (W - 4)} ${B - 4}Z`, C.textoSuave);
  s += page(-1) + page(1);
  [116, 126, 136].forEach(y => {
    s += stroke(`M${cx - 29} ${y}C${cx - 22} ${y - 3} ${cx - 15} ${y - 3} ${cx - 9} ${y}`, C.pizarraLinea, 3.2);
    s += stroke(`M${cx + 9} ${y}C${cx + 15} ${y - 3} ${cx + 22} ${y - 3} ${cx + 29} ${y}`, C.pizarraLinea, 3.2);
  });
  save('nube-claude', 'Nube opcional, fuera del colegio: solo recibe peticiones de material didáctico, con un filtro pensado para bloquear datos personales', s);
}

// ───────────────────────── documentos e iconos ─────────────────────────
{
  const { x, y, w } = SHEET;
  let s = sheet();
  s += titleLine(x + 18, x + 62, y + 30);
  for (let i = 0; i < 5; i++) s += textLine(x + 18, x + w - 18 - (i === 4 ? 34 : 0), y + 52 + i * 16);
  s += aiBadge(164, 172);
  save('documento-ia', 'Documento preparado por la IA', s);
}
{
  const { x, y, w } = SHEET;
  let s = sheet();
  s += rect(x + 18, y + 18, 18, 18, R1, C.pizarraLinea);
  s += titleLine(x + 44, x + 72, y + 27);
  for (let i = 0; i < 4; i++) s += textLine(x + 18, x + w - 18 - (i === 3 ? 30 : 0), y + 56 + i * 16);
  const cx = x + 76, cy = y + 122;                                                    // sello oficial
  s += circle(cx, cy, 18, 'none', { stroke: C.pizarraLinea, 'stroke-width': 3.5 });
  s += P(roundPoly([[cx, cy - 10], [cx + 11, cy - 3], [cx - 11, cy - 3]], 1), C.pizarraLinea);
  s += rect(cx - 8, cy - 2, 3.2, 8, 0, C.pizarraLinea) + rect(cx - 1.6, cy - 2, 3.2, 8, 0, C.pizarraLinea) + rect(cx + 4.8, cy - 2, 3.2, 8, 0, C.pizarraLinea);
  s += rect(cx - 10, cy + 6.5, 20, 3.5, 1, C.pizarraLinea);
  s += textLine(x + 18, x + 46, y + 128, C.pizarra, 5);
  save('circular', 'Circular con sello oficial', s);
}
{
  const { x, y, w } = SHEET;
  let s = sheet();
  s += titleLine(x + 18, x + 54, y + 30);
  for (let i = 0; i < 4; i++) s += textLine(x + 18, x + w - 18 - (i === 3 ? 30 : 0), y + 52 + i * 16);
  s += stroke(`M${x + 18} ${y + 124}c4 -10 8 -10 8 -2s4 6 8 -4c3 -6 6 -2 8 2`, C.pizarra, 3.5);   // firmas
  s += stroke(`M${x + 62} ${y + 124}c3 -8 9 -12 10 -4c1 6 4 6 7 0c2 -4 5 -4 8 1`, C.pizarra, 3.5);
  s += textLine(x + 16, x + 46, y + 132, C.textoSuave, 4) + textLine(x + 60, x + 92, y + 132, C.textoSuave, 4);
  save('acta', 'Acta con firmas', s);
}
{
  let s = '';
  s += rect(58, 50, 124, 140, R2, C.papel);
  s += P(rrectPath(58, 50, 124, 34, [R2, R2, 0, 0]), C.pizarraLinea);
  s += circle(80, 67, 9, C.papel) + textLine(98, 140, 67, C.papel, 6);
  for (let i = 0; i < 4; i++) {
    const yy = 104 + i * 22;
    if (i === 2) {                                                                    // aviso (alergia, necesidad…): en pizarra, como las casillas
      s += P(roundPoly([[80, yy - 9], [90, yy + 8], [70, yy + 8]], 2.5), C.pizarra);
      s += line(80, yy - 2.5, 80, yy + 1.5, C.papel, 2.6) + circle(80, yy + 4.8, 1.4, C.papel);
    } else {
      s += rect(72, yy - 8, 16, 16, R1, C.pizarra) + tick(80, yy, C.papel, 2.6);
    }
    s += textLine(98, i === 1 ? 140 : 164, yy, i === 2 ? C.texto : C.textoSuave, 6);
  }
  // Sin insignia: la ficha la prepara DirectorIA con las reglas y los datos del colegio, sin IA
  save('ficha', 'Ficha de sustitución: una lista y un aviso', s);
}
{
  let s = '';
  s += rect(44, 70, 152, 104, R2, C.papel);
  s += stroke('M54 164L110 124M186 164L130 124', C.textoSuave, 5);
  s += P(roundPoly([[48, 73], [192, 73], [120, 130]], [8, 8, 10]), C.pizarraLinea);
  save('correo', 'Sobre de correo', s);
}
{
  let s = '';
  s += rect(56, 58, 128, 132, R2, C.papel);
  s += P(rrectPath(56, 58, 128, 32, [R2, R2, 0, 0]), C.pizarra);
  s += rect(82, 48, 10, 22, 5, C.texto) + rect(148, 48, 10, 22, 5, C.texto);
  for (let r = 0; r < 4; r++) for (let c = 0; c < 5; c++) {
    const cx = 74 + c * 23, cy = 108 + r * 22;
    if (r === 2 && c === 3) s += circle(cx, cy, 11, C.pizarra) + circle(cx, cy, 4.5, C.papel); // el plazo, marcado (sin chispa: los plazos salen de las reglas del colegio)
    else s += rect(cx - 7, cy - 7, 14, 14, 3, C.linea);
  }
  save('calendario', 'Calendario con un plazo marcado', s);
}
{
  let s = '';
  s += stroke('M90 110V88A30 30 0 0 1 150 88V110', C.texto, 15);
  s += rect(68, 104, 104, 92, R3, C.pizarra);
  s += circle(120, 142, 10, C.papel) + P('M114 146L126 146L128 170L112 170Z', C.papel);
  save('candado', 'Candado: privacidad', s);
}
{
  let s = '';
  s += stroke('M82 106C82 130 98 148 120 148C142 148 158 130 158 106', C.pizarraLinea, 8);
  s += line(120, 150, 120, 176, C.pizarraLinea, 8);
  s += rect(94, 174, 52, 12, 6, C.pizarraLinea);
  s += rect(98, 46, 44, 86, 22, C.pizarra);
  for (let i = 0; i < 3; i++) s += line(110, 64 + i * 12, 130, 64 + i * 12, C.pizarraLinea, 4);
  s += stroke('M64 84C58 92 58 106 64 114M50 76C40 90 40 110 50 124', C.texto, 5);
  s += stroke('M176 84C182 92 182 106 176 114M190 76C200 90 200 110 190 124', C.texto, 5);
  save('microfono', 'Micrófono: dictado por voz', s);
}
{
  let s = '';
  s += circle(120, 120, 70, C.pizarra) + circle(120, 120, 58, C.papel);
  for (let h = 0; h < 12; h++) {
    const a = h * Math.PI / 6, big = h % 3 === 0;
    const r1 = big ? 41 : 46, r2 = 50;
    s += line(120 + Math.sin(a) * r1, 120 - Math.cos(a) * r1, 120 + Math.sin(a) * r2, 120 - Math.cos(a) * r2, big ? C.pizarra : C.textoSuave, big ? 5 : 4);
  }
  const ah = 8 * Math.PI / 6;
  s += line(120, 120, 120 + Math.sin(ah) * 27, 120 - Math.cos(ah) * 27, C.pizarra, 8);
  s += line(120, 120, 120, 80, C.pizarra, 6);
  s += circle(120, 120, 7, C.pizarra);
  save('reloj', 'Reloj a las ocho', s);
}
{
  let s = '';
  s += P(roundPoly([[120, 54], [190, 176], [50, 176]], 14), C.pizarraLinea);
  s += line(120, 98, 120, 132, C.papel, 12) + circle(120, 152, 7, C.papel);
  // Sin insignia: los avisos los da DirectorIA con las reglas del colegio, sin IA
  save('alerta', 'Aviso suave', s);
}

for (const [name, svg] of Object.entries(files)) fs.writeFileSync(path.join(OUT, name + '.svg'), svg);
console.log(Object.keys(files).length + ' SVG en ' + OUT);
