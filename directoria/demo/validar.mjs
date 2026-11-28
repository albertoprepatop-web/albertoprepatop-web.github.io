// Comprueba un archivo de datos de la demo de DirectorIA.
// Uso: node validar.mjs <archivo.js> [<archivo.js> ...]
// Sale con código 1 si hay errores. Los avisos no impiden seguir.
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';

const ROLES = ['direccion', 'jefatura', 'secretaria', 'docente', 'orientacion', 'sustituto'];
const ILUS = ['direccion', 'jefatura', 'secretaria', 'docente', 'orientacion', 'sustituto'];
const CATEGORIAS = ['Familias', 'Inspección', 'Consejería', 'Claustro', 'Equipo directivo', 'Proveedores', 'Otros'];
const TIPOS = ['aprobaciones', 'documento', 'plazos', 'protocolo', 'banco', 'dictado', 'material', 'traduccion', 'ficha', 'tabla', 'informe', 'justificantes'];
// Panel de mando del Inicio (inicio.cifras): iconos del motor, franjas del horario de Primaria y el día de la demo.
const ICONOS = ['correo', 'firma', 'carpeta', 'reloj', 'calendario', 'persona', 'familia', 'alerta', 'libro', 'acta', 'documento', 'microfono', 'clase', 'autobus', 'colegio', 'info'];
const FRANJAS = ['1', '2', '3', 'recreo', '4', 'comida', '5', '6', 'salida'];
const HOY = '2026-11-18';
const ESTADOS_INICIO = ['hoy', 'pendiente', 'hecho', 'info'];
const PROHIBIDAS = [
  [/autom[aá]ticamente/i, 'no uses «automáticamente»: la IA prepara y una persona decide'],
  [/riesgo cero/i, 'sin «riesgo cero»'],
  [/cumplimiento garantizado/i, 'sin «cumplimiento garantizado»'],
  [/no salen del colegio/i, 'no digas que los datos «no salen del colegio»'],
  [/la IA (decide|env[ií]a|asigna|eval[uú]a|aprueba|firma)/i, 'la IA no decide, envía, asigna, evalúa, aprueba ni firma'],
  [/on-?premise/i, 'sin «on-premise»'],
  [/perfil del alumno/i, 'sin «perfil del alumno»'],
  [/\be-?mail\b/i, 'di «correo», no «email»'],
];

const errores = [];
const avisos = [];
let actual = '';
const err = (donde, msg) => errores.push(`${actual} · ${donde}: ${msg}`);
const av = (donde, msg) => avisos.push(`${actual} · ${donde}: ${msg}`);

const palabras = (t) => (t || '').trim().split(/\s+/).filter(Boolean).length;
const esTexto = (v) => typeof v === 'string' && v.trim().length > 0;

function texto(donde, v, { max, min, opcional, palabrasMin, palabrasMax } = {}) {
  if (v === undefined || v === null || v === '') {
    if (!opcional) err(donde, 'falta el texto');
    return;
  }
  if (typeof v !== 'string') { err(donde, 'tiene que ser un texto'); return; }
  if (max && v.length > max) err(donde, `tiene ${v.length} caracteres (máximo ${max})`);
  if (min && v.length < min) err(donde, `tiene ${v.length} caracteres (mínimo ${min})`);
  const p = palabras(v);
  if (palabrasMin && p < palabrasMin) err(donde, `tiene ${p} palabras (mínimo ${palabrasMin})`);
  if (palabrasMax && p > palabrasMax) err(donde, `tiene ${p} palabras (máximo ${palabrasMax})`);
  revisarEstilo(donde, v);
}

function revisarEstilo(donde, v) {
  if (/<\/?[a-z][^>]*>/i.test(v)) err(donde, 'no uses HTML dentro de los textos');
  // Los huecos que rellena el motor ({hechas}, {faltan}, {n}, {de}, {clases}) solo valen en los textos del carril del día.
  const hueco = v.match(/\{[A-Za-z]+\}/);
  if (hueco) err(donde, `«${hueco[0]}»: los huecos que rellena el motor solo valen en los textos de un carril del día (detalle, pendiente, parcial, alTerminar y siNinguna), y no todos en todos`);
  if (/\*\*|__|^#{1,6}\s/m.test(v)) err(donde, 'no uses Markdown dentro de los textos');
  if (/[\w.+-]+@[\w-]+\.[\w.]+/.test(v)) err(donde, 'sin direcciones de correo');
  if (/(\+34\s?)?\b[6-9]\d{2}[\s.]?\d{3}[\s.]?\d{3}\b/.test(v)) err(donde, 'sin números de teléfono');
  const malNombre = v.match(/\bdirector[il]a\b/gi);
  if (malNombre) for (const m of malNombre) if (m !== 'DirectorIA' && !/^director[a]$/i.test(m)) err(donde, `el nombre se escribe DirectorIA, no «${m}»`);
  if (/DirectorlA/.test(v)) err(donde, 'el nombre lleva una i mayúscula: DirectorIA');
  for (const [re, msg] of PROHIBIDAS) if (re.test(v)) err(donde, msg);
  if (/\?/.test(v) && !/¿/.test(v)) av(donde, 'hay un «?» sin «¿» (comprueba los signos de apertura)');
  if (/!/.test(v) && !/¡/.test(v)) av(donde, 'hay un «!» sin «¡»');
  if (/"[^"]+"/.test(v)) av(donde, 'usa comillas latinas « » en vez de " "');
  if (/\b\d{1,2}\.\d{2}\s?h\b/.test(v)) av(donde, 'las horas se escriben 9:00, no 9.00 h');
}

function lista(donde, v, min, max) {
  if (!Array.isArray(v)) { err(donde, 'tiene que ser una lista'); return []; }
  if (min !== undefined && v.length < min) err(donde, `tiene ${v.length} elementos (mínimo ${min})`);
  if (max !== undefined && v.length > max) err(donde, `tiene ${v.length} elementos (máximo ${max})`);
  return v;
}

function uno(donde, v, opciones) {
  if (!opciones.includes(v)) err(donde, `«${v}» no vale; tiene que ser uno de: ${opciones.join(', ')}`);
}

let actualRol = null;
const justificantesDe = []; // «sigue» de un justificante: tiene que ser una ausencia de la vista «subir» de otro perfil
function validarRol(r) {
  actual = r && r.id ? r.id : '(sin id)';
  actualRol = r;
  if (!r || typeof r !== 'object') { err('raíz', 'DEMO.rol() necesita un objeto'); return; }
  uno('id', r.id, ROLES);
  if (!Number.isInteger(r.orden) || r.orden < 1 || r.orden > 6) err('orden', 'tiene que ser un número del 1 al 6');
  const p = r.persona || {};
  texto('persona.nombre', p.nombre, { max: 40 });
  texto('persona.cargo', p.cargo, { max: 32 });
  texto('persona.detalle', p.detalle, { max: 60 });
  uno('persona.ilustracion', p.ilustracion, ILUS);
  texto('acceso', r.acceso, { max: 90 });

  const correos = lista('correo', r.correo, r.id === 'sustituto' ? 3 : 4, 6);
  const modulos = lista('modulos', r.modulos, 2, 5);
  const idsCorreo = new Set();
  const idsModulo = new Set();
  for (const c of correos) {
    if (!c || !/^c-[a-z0-9-]+$/.test(c.id || '')) err(`correo ${c && c.id}`, 'el id tiene que empezar por c- y llevar solo minúsculas, números y guiones');
    else if (idsCorreo.has(c.id)) err(`correo ${c.id}`, 'id repetido');
    else idsCorreo.add(c.id);
  }
  for (const m of modulos) {
    if (!m || !/^[a-z][a-z0-9-]*$/.test(m.id || '')) err(`módulo ${m && m.id}`, 'el id lleva solo minúsculas, números y guiones');
    else if (idsModulo.has(m.id)) err(`módulo ${m.id}`, 'id repetido');
    else idsModulo.add(m.id);
  }
  const irValido = (donde, ir) => {
    if (ir === undefined) return;
    if (ir === 'correo') return;
    if (typeof ir === 'string' && ir.startsWith('correo:')) {
      if (!idsCorreo.has(ir.slice(7))) err(donde, `el correo «${ir.slice(7)}» no existe`);
      return;
    }
    if (!idsModulo.has(ir)) err(donde, `«${ir}» no es un módulo de este perfil`);
  };

  // Inicio
  const ini = r.inicio || {};
  texto('inicio.antetitulo', ini.antetitulo, { max: 60 });
  texto('inicio.titulo', ini.titulo, { max: 60 });
  texto('inicio.entradilla', ini.entradilla, { max: 160 });
  if (ini.cifras !== undefined) validarPanel(r, ini, irValido);
  else lista('inicio.bloques', ini.bloques, 2, 4).forEach((b, i) => {
    texto(`inicio.bloques[${i}].titulo`, b.titulo, { max: 40 });
    lista(`inicio.bloques[${i}].items`, b.items, 1, 4).forEach((it, j) => {
      const d = `inicio.bloques[${i}].items[${j}]`;
      texto(d + '.texto', it.texto, { max: 180 });
      uno(d + '.estado', it.estado, ['hoy', 'pendiente', 'hecho', 'info']);
      irValido(d + '.ir', it.ir);
      if (it.bandera !== undefined) {
        uno(d + '.bandera', it.bandera, ['guardias']);
        texto(d + '.textoSi', it.textoSi, { max: 180 });
        uno(d + '.estadoSi', it.estadoSi, ['hoy', 'pendiente', 'hecho', 'info']);
      }
    });
  });

  // Correo
  let familias = 0;
  correos.forEach((c) => {
    const d = `correo ${c.id}`;
    texto(d + '.de', c.de, { max: 60 });
    texto(d + '.deDetalle', c.deDetalle, { max: 70, opcional: true });
    texto(d + '.asunto', c.asunto, { max: 90 });
    texto(d + '.hora', c.hora, { max: 12 });
    uno(d + '.categoria', c.categoria, CATEGORIAS);
    if (c.categoria === 'Familias') familias++;
    if (!c.etiqueta) err(d + '.etiqueta', 'falta');
    else { texto(d + '.etiqueta.texto', c.etiqueta.texto, { max: 34 }); uno(d + '.etiqueta.tipo', c.etiqueta.tipo, ['hoy', 'plazo', 'info']); }
    lista(d + '.resumen', c.resumen, 1, 3).forEach((s, i) => texto(`${d}.resumen[${i}]`, s, { max: 140 }));
    if (c.piden === undefined) err(d + '.piden', 'falta (usa \'\' si no piden nada)');
    else if (c.piden !== '') texto(d + '.piden', c.piden, { max: 160 });
    texto(d + '.original', c.original, { palabrasMin: 40, palabrasMax: 220 });
    if (c.adjuntos !== undefined) lista(d + '.adjuntos', c.adjuntos, 0, 4).forEach((a, i) => texto(`${d}.adjuntos[${i}]`, a, { max: 70 }));
    const resp = lista(d + '.respuestas', c.respuestas, 0, 3);
    resp.forEach((x, i) => {
      const dr = `${d}.respuestas[${i}]`;
      texto(dr + '.titulo', x.titulo, { max: 40 });
      texto(dr + '.texto', x.texto, { palabrasMin: 25, palabrasMax: 170 });
      // Opcionales. Sin «para» ni «asunto», la respuesta va a quien escribió, con «Re:» y su asunto.
      texto(dr + '.para', x.para, { max: 60, opcional: true });
      if (esTexto(x.para) && !esTexto(x.asunto)) err(dr + '.asunto', 'falta: si la respuesta lleva «para», necesita su propio asunto (si no, saldría «Re:» en un correo nuevo)');
      else texto(dr + '.asunto', x.asunto, { max: 90, opcional: true });
      if (x.adjuntos !== undefined) lista(dr + '.adjuntos', x.adjuntos, 1, 4).forEach((s, j) => texto(`${dr}.adjuntos[${j}]`, s, { max: 70 }));
      for (const k of Object.keys(x || {})) if (!['titulo', 'texto', 'para', 'asunto', 'adjuntos'].includes(k)) av(dr, `«${k}» no lo usa el motor (las respuestas admiten titulo, texto, para, asunto y adjuntos)`);
    });
    if (resp.length === 0 && !esTexto(c.nota)) err(d, 'si no hay respuestas propuestas, pon una nota');
    texto(d + '.nota', c.nota, { max: 160, opcional: true });
    irValido(d + '.ir', c.ir);
  });
  if (r.id !== 'sustituto' && familias === 0) err('correo', 'tiene que haber al menos un correo de una familia');

  // Módulos
  modulos.forEach((m) => {
    const d = `módulo ${m.id}`;
    uno(d + '.tipo', m.tipo, TIPOS);
    texto(d + '.menu', m.menu, { max: 22 });
    texto(d + '.antetitulo', m.antetitulo, { max: 50 });
    texto(d + '.titulo', m.titulo, { max: 70 });
    texto(d + '.entradilla', m.entradilla, { max: 220 });
    texto(d + '.confidencial', m.confidencial, { max: 60, opcional: true });
    const fn = VALIDA[m.tipo];
    if (fn) fn(d, m, irValido);
  });

  guardiasSinDevolver(r);
  sinDatosDeAlumnos(r);
}

// ─── Panel de mando del Inicio ───
// Lo que sigue el panel para estar al día: 'correo:<id>', '<módulo>', '<módulo>#<elemento>' o 'bandera:<nombre>',
// con '<perfil>/' delante si es de otro perfil. Las de otro perfil se comprueban al final, si se ha cargado su archivo.
const cruces = [];
const cubres = [];
const fichasDe = [];   // cifras «fichas»: tienen que seguir un módulo de aprobaciones con propuestas que llevan ficha
const elegidos = [];   // sesiones de siElegido: la propuesta era para otra persona y la del perfil está entre las alternativas
const guiasDe = [];    // guías tomadas de otro perfil ('orientacion/protocolos'): una guía de protocolos con sus guías escritas
function sigueValido(r, donde, ref) {
  // Una lista ('dosier' y 'correo:c-inspeccion#1'): hecha cuando lo están todas.
  if (Array.isArray(ref)) {
    if (ref.length < 2) err(donde, 'una lista lleva dos referencias o más (con una, pon el texto solo)');
    ref.forEach((x, i) => sigueValido(r, `${donde}[${i}]`, x));
    return;
  }
  if (typeof ref !== 'string' || !ref) { err(donde, 'tiene que ser un texto: correo:<id>, <módulo>, <módulo>#<elemento> o bandera:<nombre>, con «<perfil>/» delante si es de otro perfil'); return; }
  let rol = r.id, s = ref;
  const barra = s.indexOf('/');
  if (barra > 0) {
    rol = s.slice(0, barra); s = s.slice(barra + 1);
    if (!ROLES.includes(rol)) { err(donde, `«${rol}» no es un perfil`); return; }
  }
  if (rol !== r.id) { cruces.push({ archivo: actual, donde, rol, s }); return; }
  refValida(r, donde, s);
}
function refValida(r, donde, s) {
  if (s.startsWith('bandera:')) { uno(donde, s.slice(8), ['guardias']); return; }
  // 'correo:<id>' (respondido o archivado), 'correo:<id>#1' o '#0,1' (enviada esa respuesta propuesta, desde 0)
  // y 'correo:<id>#archivado' (archivado sin responder).
  if (s.startsWith('correo:')) {
    const [cid, el] = s.slice(7).split('#');
    const c = (r.correo || []).find((x) => x.id === cid);
    if (!c) { err(donde, `el correo «${cid}» no existe en ${r.id}`); return; }
    if (el === undefined || el === 'archivado') return;
    const n = (c.respuestas || []).length;
    if (!el.split(',').every((x) => /^\d+$/.test(x) && +x < n)) err(donde, `«#${el}» no vale en «${cid}»: pon el número de una respuesta propuesta, desde 0 (tiene ${n}), varios con comas («#0,1») o «#archivado»`);
    return;
  }
  const [mid, el] = s.split('#');
  const m = (r.modulos || []).find((x) => x.id === mid);
  if (!m) { err(donde, `«${mid}» no es un módulo de ${r.id}`); return; }
  if (el === undefined) return;
  if (m.tipo === 'aprobaciones') { if (!(m.items || []).some((it) => it.id === el)) err(donde, `«${el}» no es una propuesta de «${mid}»`); }
  else if (m.tipo === 'plazos') { if (!/^\d+$/.test(el) || +el >= (m.items || []).length) err(donde, `«${el}» no es un plazo de «${mid}» (se cuentan desde 0)`); }
  else if (m.tipo === 'justificantes') { if (!(m.ausencias || []).some((a) => a.id === el)) err(donde, `«${el}» no es una ausencia con id de «${mid}»`); }
  else err(donde, `un módulo de tipo ${m.tipo} no tiene elementos: quita «#${el}»`);
}
// Lo que cambia cuando lo seguido está hecho: si.titulo, si.detalle, si.estado (por defecto, «hecho») y si.ir (null quita el
// enlace: lo que ya está respondido y no se decide ahí).
function siValido(r, d, it, irValido) {
  if (it.sigue !== undefined) sigueValido(r, d + '.sigue', it.sigue);
  if (it.si === undefined) return;
  if (it.sigue === undefined) err(d + '.si', 'solo tiene sentido con «sigue»');
  texto(d + '.si.titulo', it.si.titulo, { max: 70, opcional: true });
  texto(d + '.si.detalle', it.si.detalle, { max: 130, opcional: true });
  if (it.si.estado !== undefined) uno(d + '.si.estado', it.si.estado, ESTADOS_INICIO);
  if (it.si.ir !== undefined && it.si.ir !== null && irValido) irValido(d + '.si.ir', it.si.ir);
  for (const k of Object.keys(it.si)) if (!['titulo', 'detalle', 'estado', 'ir'].includes(k)) av(d + '.si', `«${k}» no lo cambia el motor (vale: titulo, detalle, estado e ir)`);
}
// siOtra: variantes para cuando jefatura elige a otra persona para lo que DirectorIA proponía a la persona del perfil.
// Cada variante lleva «cuando» (una propuesta de aprobaciones, 'jefatura/guardias#g1', o varias) y solo los campos que cambian.
// Vale la primera cuyas propuestas han pasado todas a otra persona. null quita un campo (rotulo, ir, sigue).
// siConfirmada: lo mismo, para cuando lo de «cuando» está confirmado (una propuesta, 'jefatura/guardias#g1', o todo el
// módulo, 'jefatura/guardias') y sigue siendo de la persona del perfil. Los datos dicen lo de las 8:00 y la variante, lo de después.
function siOtraValido(r, d, vs, campos, comprobar, soloPropuestas = true) {
  if (vs === undefined) return;
  const lista_ = Array.isArray(vs) ? vs : [vs];
  if (!lista_.length) err(d, 'la lista de variantes está vacía');
  lista_.forEach((x, i) => {
    const dv = `${d}[${i}]`;
    if (!x || typeof x !== 'object') { err(dv, 'cada variante es un objeto'); return; }
    const cuando = [].concat(x.cuando === undefined ? [] : x.cuando);
    if (!cuando.length) err(dv + '.cuando', soloPropuestas ? 'falta: la propuesta (o las propuestas) que, dadas a otra persona, activan la variante' : 'falta: lo que, confirmado, activa la variante');
    cuando.forEach((ref, j) => {
      if (typeof ref !== 'string' || (soloPropuestas && !ref.includes('#'))) err(`${dv}.cuando[${j}]`, 'tiene que ser una propuesta de aprobaciones, como «jefatura/guardias#g1»');
      else sigueValido(r, `${dv}.cuando[${j}]`, ref);
    });
    for (const k of Object.keys(x)) if (k !== 'cuando' && !campos.includes(k)) av(dv, `«${k}» no lo cambia el motor en una variante (vale: ${campos.join(', ')})`);
    comprobar(dv, x);
  });
}
// aMedias: lo que cambia mientras lo que se sigue no está hecho, pero sí otra cosa que va hacia ello. Cada variante lleva
// su propio «sigue» (vale la primera que está hecha) y solo los campos que cambian. No puede dar nada por hecho.
function aMediasValido(r, d, it, campos, comprobar) {
  if (it.aMedias === undefined) return;
  if (it.sigue === undefined && !it.siConfirmada) err(d + '.aMedias', 'solo tiene sentido con «sigue»: es lo que pasa mientras eso no está hecho');
  const l = Array.isArray(it.aMedias) ? it.aMedias : [it.aMedias];
  if (!l.length) err(d + '.aMedias', 'la lista de variantes está vacía');
  l.forEach((x, i) => {
    const dv = `${d}.aMedias[${i}]`;
    if (!x || typeof x !== 'object') { err(dv, 'cada variante es un objeto'); return; }
    if (x.sigue === undefined) err(dv + '.sigue', 'falta: lo que se ha hecho a medias (el visto bueno, una respuesta que no cumple el plazo…)');
    else sigueValido(r, dv + '.sigue', x.sigue);
    if (x.sigue !== undefined && x.sigue === it.sigue) err(dv + '.sigue', 'es lo mismo que sigue la marca: a medias tiene que ser otra cosa');
    if (x.estado === 'hecho') err(dv + '.estado', 'a medias no está hecho: usa «si» para cuando lo esté');
    for (const k of Object.keys(x)) if (k !== 'sigue' && !campos.includes(k)) av(dv, `«${k}» no lo cambia el motor a medias (vale: ${campos.join(', ')})`);
    comprobar(dv, x);
  });
}
const masDias = (iso, n) => { const x = new Date(iso + 'T00:00:00Z'); x.setUTCDate(x.getUTCDate() + n); return x.toISOString().slice(0, 10); };
// verbo: cómo se dice lo hecho, con su hora («Firmada a las 8:05»). choque: tarjeta de aviso con el triángulo y «Choque».
function extrasMarca(d, x) {
  texto(d + '.verbo', x.verbo, { max: 24, opcional: true });
  if (x.choque !== undefined && typeof x.choque !== 'boolean') err(d + '.choque', 'tiene que ser true o false');
}
// Los textos de un carril del día pueden llevar huecos que rellena el motor con lo que hay de verdad en el carril:
// {hechas} y {faltan} (dónde cubres, confirmado o no: «la 1.ª, la 6.ª y la salida»), {n} y {de} (cuántas propuestas
// confirmadas y cuántas hay, como el recuento) y {clases} (cuántas sesiones «clase» quedan, en letra: «cuatro»). Con
// mayúscula («{Faltan}»), el valor empieza por mayúscula. Cada texto admite los que pueden tener valor en su momento.
const HUECOS = {
  detalle: ['clases'],
  pendiente: ['faltan', 'de', 'clases'],
  parcial: ['hechas', 'faltan', 'n', 'de', 'clases'],
  alTerminar: ['hechas', 'n', 'de', 'clases'],
  ninguna: ['clases'],
};
const MAX_CARRIL = { detalle: 40, pendiente: 120, parcial: 120, alTerminar: 140, ninguna: 140 };
// Valores de ejemplo, para medir y revisar el texto relleno.
const EJEMPLO = { hechas: 'la 1.ª, la 6.ª y la salida', faltan: 'la 3.ª y el recreo', n: '2', de: '4', clases: 'cuatro' };
function textoCarril(donde, v, clave, opcional = true) {
  if (v === undefined || v === null) { if (!opcional) err(donde, 'falta el texto'); return; }
  if (typeof v !== 'string') { err(donde, 'tiene que ser un texto'); return; }
  const validos = HUECOS[clave];
  const lleno = v.replace(/\{([A-Za-z]+)\}/g, (todo, k) => {
    const kk = k.charAt(0).toLowerCase() + k.slice(1);
    if (!validos.includes(kk)) { err(donde, `«${todo}» no vale aquí (vale: ${validos.map((x) => '{' + x + '}').join(', ')})`); return kk; }
    const x = EJEMPLO[kk];
    return k.charAt(0) === k.charAt(0).toUpperCase() ? x.charAt(0).toUpperCase() + x.slice(1) : x;
  });
  texto(donde, lleno, { max: MAX_CARRIL[clave] });
}

// Privacidad (guion-de-datos.md §5): DirectorIA no guarda datos de alumnos. Ni nombres ni iniciales, salud, alergias,
// necesidades o adaptaciones, recogidas, anotaciones, pautas personales, notas, certificados de un alumno, autorizaciones de
// imagen, optativas por alumno, reclamaciones de una familia ni casos. Solo datos del profesorado y del funcionamiento del
// colegio: horarios, grupos («3.º B» no es un dato personal), aulas, guardias, plazos, documentos del centro, gastos y
// contratos; las cifras agregadas valen. Del profesorado, el registro de ausencias no guarda el motivo. Se mira cada texto
// del perfil: el Inicio, el correo (las familias escriben de temas generales y sin nombres de alumnos) y los módulos.
// Vale la línea fija de la ficha (la pone el motor), también citada: «Las indicaciones de salud y de recogida de los alumnos».
const LINEA_FICHA = 'Las indicaciones de salud y de recogida de los alumnos no están en DirectorIA: las tiene el colegio. Pregúntalas en conserjería o a la tutora antes de empezar.';
const PERMITIDAS = [LINEA_FICHA, /[Ll]as indicaciones de salud y de recogida(?: de los alumnos)?/g];
// Los alumnos que tenía la demo antes del 26-11-2026, con nombre o nombre e inicial. Ninguno puede volver.
const ALUMNOS_DEMO = ['Mario', 'Lucía', 'Hugo', 'Daniel', 'Irene', 'Amira', 'Nora', 'Iker', 'Sofía', 'Adrián', 'Gonzalo', 'Carla', 'Alba', 'Óliver', 'Oliver', 'Samuel'];
const RE_ALUMNOS = new RegExp(`(?<![\\p{L}\\p{N}])(${ALUMNOS_DEMO.join('|')})(?![\\p{L}\\p{N}])`, 'u');
const DATOS_ALUMNO = [
  [/Alumno\/a/, '«Alumno/a»: no se abre ningún caso en DirectorIA'],
  [/\bCaso\s+\d{4}/i, 'no se abre ningún caso en DirectorIA («Caso 20…»): los datos del caso van a Raíces y al expediente del centro'],
  [/al[ée]rgic|alergi|autoinyector|intoleranci|diagn[óo]stic|medicaci|epilep|asm[aá]tic|diab[ée]t|\bTDAH\b|dislexi|discapacidad/i, 'datos de salud o diagnósticos de un alumno'],
  [/\bnecesidades\b|adaptaci[oó]n(?:es)? (?:curricular|de acceso)|\bNEE\b|\bACNEAE\b/i, 'necesidades o adaptaciones de un alumno'],
  // «Recogida de información» (el paso del protocolo), «la información recogida» y «la recogida de datos» de una estadística sí valen.
  [/(?<!informaci[oó]n\s)\brecogidas?\b(?!\s+de\s+(?:la\s+|los\s+)?(?:informaci[oó]n|datos))|\bpuede salir (?:solo )?con\b|\brecog(?:er|e|en)\s+a\s+(?:su |tu |la |el |los |las )?(?:hij|alumn|niñ)/i, 'recogidas de alumnos (solo vale la línea fija de la ficha)'],
  [/autorizaci[oó]n(?:es)? de imagen|derechos de imagen/i, 'autorizaciones de imagen de alumnos'],
  [/certificados? de (?:matr[ií]cula|estudios|notas)/i, 'certificados de un alumno'],
  [/\boptativas?\b/i, 'optativas elegidas por un alumno'],
  [/reclamaci[oó]n/i, 'reclamaciones de una familia'],
  [/\bpautas? (?:de|para) [A-ZÁÉÍÓÚÑ]/, 'pautas personales de un alumno'],
];
// El motivo de una ausencia (del profesorado o de quien sea): nunca, tampoco de pasada («que te mejores»).
const MOTIVO_SALUD = /fiebre|gripe|resfriad|enferm[oa]s?\b|enfermedad|m[ée]dic[oa]s?\b|consulta m[ée]dica|baja (?:m[ée]dica|laboral)|recup[ée]rate|te mejores|hospital|urgencias/i;
// Nombre e inicial («Nora D.»): así se nombraba a los alumnos. Los docentes van con su nombre entero («Marta Ramos»).
const NO_SON_NOMBRES = new Set(['Grupo', 'Curso', 'Anexo', 'Aula', 'Planta', 'Sala', 'Puerta', 'Edificio', 'Fase', 'Paso', 'Tipo']);
function nombreEInicial(t) {
  const re = /(?<![\p{L}])(\p{Lu}\p{Ll}+) (\p{Lu})\.(?=[\s,;:)»]|$)/gu;
  let m;
  while ((m = re.exec(t))) if (!NO_SON_NOMBRES.has(m[1])) return m[0];
  return null;
}
function sinDatosDeAlumnos(r) {
  const piezas = [['inicio', r.inicio]].concat((r.correo || []).map((c) => [`correo ${c.id}`, c]), (r.modulos || []).map((m) => [`módulo ${m.id}`, m]));
  for (const [d, original] of piezas.flatMap(([donde, x]) => textosDe(x, donde))) {
    let t = original;
    for (const x of PERMITIDAS) t = typeof x === 'string' ? t.split(x).join(' ') : t.replace(x, ' ');
    const n = t.match(RE_ALUMNOS);
    if (n) err(d, `«${n[0]}» era un alumno de la demo: DirectorIA no guarda datos de alumnos («una familia de 4.º A», «su hijo»)`);
    const ini = nombreEInicial(t);
    if (ini) err(d, `«${ini}»: nombre e inicial, como se nombraba a los alumnos. Sin nombres de alumnos; a los docentes, con su nombre entero`);
    for (const [re, msg] of DATOS_ALUMNO) { const m = t.match(re); if (m) err(d, `«${m[0]}»: ${msg}. DirectorIA no guarda datos de alumnos (guion-de-datos.md §5)`); }
    const s = t.match(MOTIVO_SALUD);
    if (s) err(d, `«${s[0]}»: ni el motivo de una ausencia ni datos de salud. Di lo que hace falta para actuar («Sergio Prieto no viene»); el justificante va a su carpeta`);
  }
}

// Las guardias no se devuelven (guion-de-datos.md §3, E1): quien cubre una guardia no recupera esa hora más tarde, nadie le
// «debe» una guardia a nadie y no hay intercambios. En cada pieza que habla de una guardia (una cifra, un carril del día, una
// fila, una marca de la agenda, un correo con sus respuestas, una propuesta, un plazo o una ficha), ningún texto puede decir
// que se devuelve (devolver, devuelve, devolvérsela…), ni hablar de su «vuelta», de lo que se hace «a cambio», de un
// intercambio o de un «cambio de guardia», ni decir que alguien le debe una guardia a otro («le debo una guardia», «te la
// debo»). Se mira la pieza entera y no la frase: en «Laura le devuelve la del viernes 27» no sale la palabra guardia, pero en
// su correo sí. La hora de regreso de una salida («Vuelta a las 13:30») no cuenta, aunque la pieza nombre una guardia; «Vuelta
// a la calma» tampoco, porque va en una pieza que no habla de guardias.
const GUARDIA = /guardia/i;
const DEVOLVER = new RegExp([
  '\\bdev(?:ol|uel|uél)[\\wáéíóúüñ]*',                                  // devolver, devuelve, devolvérsela, devolución…
  '\\bvueltas?\\b(?!\\s+a\\s+las?\\s+\\d)',                              // su «vuelta» (no la hora de regreso: «Vuelta a las 13:30»)
  '\\ba cambio\\b',
  '\\bintercambi[\\wáéíóúüñ]*',                                         // intercambio, intercambiar, intercambiamos…
  '\\bcambios?\\s+de\\s+guardias?\\b',
  // «le debo una guardia», «le debo a Rosa una guardia»; no «debe cubrir la guardia» ni «se debe a la guardia de 3.ª».
  '(?<!\\bse\\s)\\bdeb(?:o|es|e|emos|éis|en|ía|ías|íamos|íais|ían)\\s+(?:a\\s+[^\\s.,;:]+(?:\\s+[^\\s.,;:]+)?\\s+)?(?:(?:una|la|esa|otra|dos|tres|\\d+)\\s+)?guardias?\\b',
  '\\b(?:me|te|le|nos|os|les|se)\\s+las?\\s+deb[\\wáéíóúüñ]*',          // te la debo, se la debe
].join('|'), 'i');
function textosDe(x, donde, out = []) {
  if (typeof x === 'string') out.push([donde, x]);
  else if (Array.isArray(x)) x.forEach((y, i) => textosDe(y, `${donde}[${i}]`, out));
  else if (x && typeof x === 'object') Object.keys(x).forEach((k) => textosDe(x[k], `${donde}.${k}`, out));
  return out;
}
function piezasDe(r) {
  const out = [];
  const ini = r.inicio || {};
  out.push(['inicio', { antetitulo: ini.antetitulo, titulo: ini.titulo, entradilla: ini.entradilla }]);
  (ini.bloques || []).forEach((b, i) => (b.items || []).forEach((x, j) => out.push([`inicio.bloques[${i}].items[${j}]`, x])));
  (ini.cifras || []).forEach((x, i) => out.push([`inicio.cifras[${i}]`, x]));
  if (ini.dia) {
    out.push(['inicio.dia', { titulo: ini.dia.titulo, aviso: ini.dia.aviso, nota: ini.dia.nota }]);
    (ini.dia.carriles || []).forEach((x, i) => out.push([`inicio.dia.carriles[${i}]`, x]));
  }
  ((ini.lista || {}).items || []).forEach((x, i) => out.push([`inicio.lista.items[${i}]`, x]));
  ((ini.agenda || {}).marcas || []).forEach((x, i) => out.push([`inicio.agenda.marcas[${i}]`, x]));
  (r.correo || []).forEach((c) => out.push([`correo ${c.id}`, c]));
  // Un módulo con propuestas, plazos o fichas: cada una es su pieza, y el resto del módulo (título, entradilla…), otra.
  (r.modulos || []).forEach((m) => {
    const hijos = Array.isArray(m.items) ? 'items' : Array.isArray(m.fichas) ? 'fichas' : null;
    if (!hijos) { out.push([`módulo ${m.id}`, m]); return; }
    const resto = Object.assign({}, m); delete resto[hijos];
    out.push([`módulo ${m.id}`, resto]);
    m[hijos].forEach((x, i) => out.push([`módulo ${m.id}.${hijos}[${i}]`, x]));
  });
  return out;
}
function guardiasSinDevolver(r) {
  for (const [donde, pieza] of piezasDe(r)) {
    const ts = textosDe(pieza, donde);
    if (!ts.some(([, t]) => GUARDIA.test(t))) continue;
    for (const [d, t] of ts) {
      const m = t.match(DEVOLVER);
      if (m) err(d, `«${m[0]}»: las guardias no se devuelven. Quien cubre una guardia no recupera esa hora y nadie le debe una guardia a nadie: di quién la cubre, sin «vuelta», ni «a cambio», ni intercambios (guion-de-datos.md §3, E1)`);
    }
  }
}

function validarPanel(r, ini, irValido) {
  if (ini.bloques !== undefined) err('inicio.bloques', 'con el panel de mando (cifras) no van bloques: lo de cada línea va en inicio.lista');
  // La cabecera del panel es compacta: la entradilla cabe en una línea a 1440 px y el motor añade al antetítulo
  // «Preparado por DirectorIA en el servidor del colegio».
  if (esTexto(ini.entradilla) && ini.entradilla.length > 100) av('inicio.entradilla', `tiene ${ini.entradilla.length} caracteres: en el panel va en una sola línea a 1440 px (100 como mucho)`);
  if (/preparado por/i.test(ini.antetitulo || '')) av('inicio.antetitulo', 'no pongas «Preparado por…»: el motor lo añade al antetítulo');
  const sigue = (donde, ref) => sigueValido(r, donde, ref);

  // Cifras: 3-4, cada una de un tipo y con un destino.
  let destacadas = 0;
  lista('inicio.cifras', ini.cifras, 3, 4).forEach((c, i) => {
    const d = `inicio.cifras[${i}]`;
    texto(d + '.etiqueta', c.etiqueta, { max: 32 });
    uno(d + '.icono', c.icono, ICONOS);
    const tipos = ['cuenta', 'pendientes', 'progreso', 'valor', 'fichas'].filter((k) => c[k] !== undefined);
    if (tipos.length !== 1) err(d, `lleva una sola de estas claves: cuenta, pendientes, progreso, valor o fichas (tiene: ${tipos.join(', ') || 'ninguna'})`);
    // fichas: '<perfil>/<módulo de aprobaciones>'. El motor cuenta las sesiones con ficha que son de la persona del perfil
    // (por la propuesta o porque jefatura la elige) y pone la nota; «siNinguna» es lo que dice si no le queda ninguna.
    if (c.fichas !== undefined) {
      sigue(d + '.fichas', c.fichas);
      fichasDe.push({ archivo: actual, donde: d + '.fichas', rol: r.id, ref: c.fichas });
      if (c.nota !== undefined) av(d + '.nota', 'con «fichas», la nota la pone el motor (qué fichas llegan y cuándo): quítala');
      texto(d + '.alTerminarUna', c.alTerminarUna, { max: 24, opcional: true });
      const sn = c.siNinguna;
      if (sn === undefined) err(d + '.siNinguna', 'falta: lo que dice la cifra si jefatura ha elegido a otras personas para todo lo tuyo');
      else {
        texto(d + '.siNinguna.valor', sn.valor, { max: 10, opcional: true });
        texto(d + '.siNinguna.nota', sn.nota, { max: 90 });
        texto(d + '.siNinguna.accion', sn.accion, { max: 28, opcional: true });
        texto(d + '.siNinguna.accionCorta', sn.accionCorta, { max: 16, opcional: true });
        irValido(d + '.siNinguna.ir', sn.ir);
        for (const k of Object.keys(sn)) if (!['valor', 'nota', 'ir', 'accion', 'accionCorta'].includes(k)) av(d + '.siNinguna', `«${k}» no lo usa el motor`);
      }
    } else if (c.alTerminarUna !== undefined || c.siNinguna !== undefined) av(d, '«alTerminarUna» y «siNinguna» solo van con «fichas»');
    if (c.cuenta !== undefined) uno(d + '.cuenta', c.cuenta, ['correo']);
    if (c.pendientes !== undefined) lista(d + '.pendientes', c.pendientes, 1, 4).forEach((x, j) => {
      const dp = `${d}.pendientes[${j}]`;
      texto(dp + '.texto', x.texto, { max: 70 });
      // corto: cómo se nombra en la nota que resume lo que queda («la citación» → «La citación y el acta del claustro»).
      texto(dp + '.corto', x.corto, { max: 30, opcional: true });
      if (esTexto(x.corto) && /^[a-záéíóúñ]/.test(x.corto) === false && !/^(Caso|Inspección|AMPA|DirectorIA)/.test(x.corto)) av(dp + '.corto', 'va en minúscula: el motor lo junta con los demás («la citación y el acta»)');
      sigue(dp + '.sigue', x.sigue);
      if (x.ir === undefined) err(dp + '.ir', 'falta: cada pendiente lleva a donde se actúa'); else irValido(dp + '.ir', x.ir);
      texto(dp + '.accion', x.accion, { max: 28, opcional: true });
      texto(dp + '.accionCorta', x.accionCorta, { max: 16, opcional: true });
      if (x.hoy !== undefined && typeof x.hoy !== 'boolean') err(dp + '.hoy', 'tiene que ser true o false');
      if (j === 0 && x.hoy) destacadas++;
      for (const k of Object.keys(x)) if (!['texto', 'corto', 'sigue', 'ir', 'accion', 'accionCorta', 'hoy'].includes(k)) av(dp, `«${k}» no lo usa el motor`);
    });
    if (c.pendientes !== undefined && c.pendientes.length > 1 && c.pendientes.some((x) => !esTexto(x.corto))) av(d + '.pendientes', 'pon «corto» en cada pendiente: la nota de la cifra resume lo que queda («La citación y el acta del claustro») y no repite la primera fila de la lista');
    if (c.progreso !== undefined) {
      const m = (r.modulos || []).find((x) => x.id === c.progreso);
      if (!m) err(d + '.progreso', `«${c.progreso}» no es un módulo de este perfil`);
      else if (m.tipo === 'protocolo') err(d + '.progreso', 'una guía de un protocolo no tiene progreso: no se abre ningún caso en DirectorIA');
      else if (!((m.tipo === 'documento' && m.documentos) || ['dictado', 'aprobaciones', 'plazos', 'justificantes'].includes(m.tipo))) err(d + '.progreso', `un módulo de tipo ${m.tipo} no tiene progreso que contar (vale: documento con «documentos», dictado, aprobaciones, plazos o justificantes)`);
    }
    // siDictado: la nota y la acción de un dictado ya dictado y por revisar (si no, el motor pone las suyas).
    if (c.siDictado !== undefined) {
      const m = (r.modulos || []).find((x) => x.id === c.progreso);
      if (!m || m.tipo !== 'dictado') err(d + '.siDictado', 'solo va en una cifra con progreso de un dictado');
      const sd = c.siDictado || {};
      texto(d + '.siDictado.nota', sd.nota, { max: 90, opcional: true });
      texto(d + '.siDictado.accion', sd.accion, { max: 28, opcional: true });
      texto(d + '.siDictado.accionCorta', sd.accionCorta, { max: 16, opcional: true });
      for (const k of Object.keys(sd)) if (!['nota', 'accion', 'accionCorta'].includes(k)) av(d + '.siDictado', `«${k}» no lo usa el motor`);
    }
    if (c.ancha !== undefined && typeof c.ancha !== 'boolean') err(d + '.ancha', 'tiene que ser true o false');
    // accionHecha: lo que dice la acción cuando la cifra está hecha («Ver el dosier»). Va también en el móvil: ≤ 16.
    texto(d + '.accionHecha', c.accionHecha, { max: 16, opcional: true });
    const destinoHecho = c.ir || (c.pendientes && c.pendientes.length ? c.pendientes[c.pendientes.length - 1].ir : undefined);
    if (c.cuenta === undefined && c.accionHecha === undefined && !(typeof destinoHecho === 'string' && destinoHecho.startsWith('correo'))) av(d + '.accionHecha', 'pon una acción corta para cuando la cifra esté hecha («Ver el dosier»); si no, el motor dirá «Ir a «…»», que no cabe en media tarjeta del móvil');
    if (c.cuenta === 'correo' && c.alTerminar !== 'Al día') av(d + '.alTerminar', 'la cifra de correos dice «Al día» en los seis perfiles (cuenta también lo archivado)');
    siOtraValido(r, d + '.siOtra', c.siOtra, ['valor', 'rotulo', 'nota', 'ir', 'accion', 'accionCorta', 'accionHecha', 'alTerminar', 'sigue', 'hoy'], (dv, x) => {
      if (c.valor === undefined) err(dv, 'siOtra solo va en una cifra con «valor»');
      texto(dv + '.valor', x.valor, { max: 10, opcional: true });
      if (x.rotulo !== null) texto(dv + '.rotulo', x.rotulo, { max: 32, opcional: true });
      texto(dv + '.nota', x.nota, { max: 90, opcional: true });
      texto(dv + '.accion', x.accion, { max: 28, opcional: true });
      texto(dv + '.accionCorta', x.accionCorta, { max: 16, opcional: true });
      texto(dv + '.accionHecha', x.accionHecha, { max: 16, opcional: true });
      texto(dv + '.alTerminar', x.alTerminar, { max: 24, opcional: true });
      if (x.ir !== null) irValido(dv + '.ir', x.ir);
      if (x.sigue !== undefined && x.sigue !== null) sigue(dv + '.sigue', x.sigue);
    });
    // siConfirmada: lo que dice la cifra cuando lo de «cuando» está confirmado (los datos dicen lo de las 8:00).
    siOtraValido(r, d + '.siConfirmada', c.siConfirmada, ['valor', 'rotulo', 'nota', 'ir', 'accion', 'accionCorta', 'accionHecha', 'alTerminar', 'sigue', 'hoy'], (dv, x) => {
      if (c.valor === undefined) err(dv, 'siConfirmada solo va en una cifra con «valor»');
      texto(dv + '.valor', x.valor, { max: 10, opcional: true });
      texto(dv + '.rotulo', x.rotulo, { max: 32, opcional: true });
      texto(dv + '.nota', x.nota, { max: 90, opcional: true });
      texto(dv + '.accion', x.accion, { max: 28, opcional: true });
      texto(dv + '.accionCorta', x.accionCorta, { max: 16, opcional: true });
      texto(dv + '.accionHecha', x.accionHecha, { max: 16, opcional: true });
      texto(dv + '.alTerminar', x.alTerminar, { max: 24, opcional: true });
      if (x.ir !== undefined) irValido(dv + '.ir', x.ir);
      if (x.sigue !== undefined) sigue(dv + '.sigue', x.sigue);
    }, false);
    // aMedias: la nota (y adónde lleva) mientras lo seguido no está hecho, pero sí otra cosa: la cifra no se da por hecha.
    aMediasValido(r, d, c, ['nota', 'ir', 'accion', 'accionCorta'], (dv, x) => {
      if (c.valor === undefined) err(dv, 'aMedias solo va en una cifra con «valor»');
      texto(dv + '.nota', x.nota, { max: 90, opcional: true });
      texto(dv + '.accion', x.accion, { max: 28, opcional: true });
      texto(dv + '.accionCorta', x.accionCorta, { max: 16, opcional: true });
      if (x.ir !== undefined) irValido(dv + '.ir', x.ir);
    });
    if (c.valor !== undefined) {
      texto(d + '.valor', c.valor, { max: 10 });
      // Sin «sigue», la cifra no se puede dar por hecha hasta que lo diga siConfirmada (lo de las 8:00 es una propuesta).
      const conSigue = [].concat(c.siConfirmada || []).some((x) => x && x.sigue !== undefined);
      if (c.sigue === undefined && !conSigue) err(d + '.sigue', 'falta: una cifra fija necesita saber cuándo está hecha (o una variante siConfirmada con «sigue»)');
      else if (c.sigue !== undefined) sigue(d + '.sigue', c.sigue);
    } else if (c.sigue !== undefined) av(d + '.sigue', 'solo se usa con «valor»');
    // rotulo: lo que dice la cifra («para avisar, antes del sáb 21»; en el dosier, por defecto, «listas»).
    texto(d + '.rotulo', c.rotulo, { max: 32, opcional: true });
    // cuentaAtras: la fecha que la fuente da como «antes del…». El motor pinta un tramo por cada día que queda, desde hoy.
    if (c.cuentaAtras !== undefined) {
      if (c.valor === undefined) err(d + '.cuentaAtras', 'solo va con «valor» («3 días»)');
      if (!/^\d{4}-\d{2}-\d{2}$/.test(c.cuentaAtras || '')) err(d + '.cuentaAtras', 'tiene que ser una fecha AAAA-MM-DD');
      else {
        const n = Math.round((new Date(c.cuentaAtras + 'T00:00:00Z') - new Date(HOY + 'T00:00:00Z')) / 864e5);
        const dias = `${n} ${n === 1 ? 'día' : 'días'}`;
        if (n < 1 || n > 7) err(d + '.cuentaAtras', 'tiene que caer entre mañana y dentro de una semana');
        else if (typeof c.valor === 'string' && c.valor !== dias) err(d + '.valor', `con cuentaAtras ${c.cuentaAtras} quedan ${dias}: el valor tiene que decir «${dias}»`);
      }
    }
    texto(d + '.accionCorta', c.accionCorta, { max: 16, opcional: true });
    // En el móvil van dos por fila: una acción de más de 16 caracteres sin acción corta pasa la tarjeta a fila entera.
    const accionMovil = (c.pendientes && c.pendientes[0] && (c.pendientes[0].accionCorta || c.pendientes[0].accion)) || c.accionCorta || c.accion;
    const conPasos = c.progreso !== undefined && ((r.modulos || []).find((x) => x.id === c.progreso) || {}).tipo === 'dictado';
    // ancha: true pasa la cifra a una fila entera en el móvil a propósito (sin aviso).
    if (!conPasos && !c.ancha && esTexto(accionMovil) && accionMovil.length > 16) av(d + '.accionCorta', `en el móvil «${accionMovil}» no cabe en media tarjeta y la cifra ocupará una fila entera: pon una acción corta (16 caracteres como mucho) si quieres que vaya a media fila, o ancha: true si la quieres en una fila entera`);
    for (const k of Object.keys(c)) if (!['etiqueta', 'icono', 'cuenta', 'pendientes', 'progreso', 'valor', 'fichas', 'sigue', 'rotulo', 'cuentaAtras', 'nota', 'ir', 'accion', 'accionCorta', 'accionHecha', 'alTerminar', 'alTerminarUna', 'hoy', 'ancha', 'siOtra', 'siConfirmada', 'siNinguna', 'siDictado', 'aMedias'].includes(k)) av(d, `«${k}» no lo usa el motor`);
    // Con «pendientes», «ir» es adonde lleva la cifra cuando ya no queda nada: sin él, el Inicio no sabría adónde ir.
    if (c.ir === undefined && c.cuenta === undefined) err(d + '.ir', c.pendientes !== undefined ? 'falta: con «pendientes», la cifra necesita su propio «ir», que es adonde lleva cuando ya no queda nada pendiente' : 'falta: cada cifra lleva a donde se actúa');
    if (c.ir !== undefined) irValido(d + '.ir', c.ir);
    texto(d + '.nota', c.nota, { max: 90, opcional: true });
    texto(d + '.accion', c.accion, { max: 28, opcional: true });
    texto(d + '.alTerminar', c.alTerminar, { max: 24 });
    if (c.hoy !== undefined && typeof c.hoy !== 'boolean') err(d + '.hoy', 'tiene que ser true o false');
    if (c.hoy) destacadas++;
  });
  if (destacadas > 1) av('inicio.cifras', 'hay más de una cifra de «hoy»: solo una debería ir en pizarra');

  // La línea del día: sesiones sobre las franjas del horario, sin pisarse.
  if (ini.dia !== undefined) {
    const dia = ini.dia;
    texto('inicio.dia.titulo', dia.titulo, { max: 40 });
    if (/^hoy en el colegio$/i.test(dia.titulo || '')) av('inicio.dia.titulo', 'el título dice lo que hay: «Quién cubre 3.º B hoy», «Tu día», «Tu jornada»…');
    texto('inicio.dia.nota', dia.nota, { max: 60, opcional: true });
    // aviso: una frase a la vista bajo el título («Hoy no viene Sergio Prieto, el tutor de 3.º B: …»).
    texto('inicio.dia.aviso', dia.aviso, { max: 120, opcional: true });
    let ids = FRANJAS;
    if (dia.franjas !== undefined) ids = lista('inicio.dia.franjas', dia.franjas, 2, 12).map((f, i) => {
      texto(`inicio.dia.franjas[${i}].id`, f.id, { max: 12 }); texto(`inicio.dia.franjas[${i}].nombre`, f.nombre, { max: 12 });
      texto(`inicio.dia.franjas[${i}].desde`, f.desde, { max: 5 }); texto(`inicio.dia.franjas[${i}].hasta`, f.hasta, { max: 5, opcional: true });
      return f.id;
    });
    lista('inicio.dia.carriles', dia.carriles, 1, 3).forEach((c, i) => {
      const d = `inicio.dia.carriles[${i}]`;
      texto(d + '.titulo', c.titulo, { max: 30 });
      textoCarril(d + '.detalle', c.detalle, 'detalle');
      uno(d + '.icono', c.icono, ICONOS);
      const usadas = new Set();
      let cubre = 0;
      lista(d + '.sesiones', c.sesiones, 1, 12).forEach((x, j) => {
        const ds = `${d}.sesiones[${j}]`;
        const i0 = ids.indexOf(x.franja), i1 = x.hasta !== undefined ? ids.indexOf(x.hasta) : i0;
        if (i0 < 0) err(ds + '.franja', `«${x.franja}» no es una franja del horario (${ids.join(', ')})`);
        else if (i1 < i0) err(ds + '.hasta', 'tiene que ser una franja del horario igual o posterior a «franja»');
        else for (let k = i0; k <= i1; k++) { if (usadas.has(k)) err(ds, `se pisa con otra sesión en la franja «${ids[k]}»`); usadas.add(k); }
        texto(ds + '.titulo', x.titulo, { max: 40 });
        texto(ds + '.detalle', x.detalle, { max: 40, opcional: true });
        uno(ds + '.tipo', x.tipo, ['clase', 'cubre', 'igual', 'aviso']);
        if (x.tipo === 'cubre') {
          cubre++;
          if (x.sigue === undefined) err(ds + '.sigue', 'falta: una sesión que se cubre sigue lo que confirma jefatura');
          // La persona sale de la propuesta que se sigue (y de quien elija jefatura): el título es lo que se cubre.
          else cubres.push({ archivo: actual, donde: ds + '.titulo', rol: r.id, ref: x.sigue, titulo: x.titulo });
        }
        if (x.sigue !== undefined) sigue(ds + '.sigue', x.sigue);
        if (x.tipo === 'aviso') texto(ds + '.aviso', x.aviso, { max: 24 });
        texto(ds + '.nota', x.nota, { max: 120, opcional: true });
      });
      if (cubre) {
        texto(d + '.cuenta', c.cuenta, { max: 24, opcional: true });
        textoCarril(d + '.pendiente', c.pendiente, 'pendiente');
        textoCarril(d + '.parcial', c.parcial, 'parcial');
        textoCarril(d + '.alTerminar', c.alTerminar, 'alTerminar');
      } else if (c.parcial !== undefined) av(d + '.parcial', 'solo se usa en un carril con sesiones «cubre»');
      siOtraValido(r, d + '.siOtra', c.siOtra, ['pendiente', 'parcial', 'alTerminar', 'detalle'], (dv, x) => {
        if (!cubre) err(dv, 'siOtra solo va en un carril con sesiones «cubre»');
        textoCarril(dv + '.pendiente', x.pendiente, 'pendiente');
        textoCarril(dv + '.parcial', x.parcial, 'parcial');
        textoCarril(dv + '.alTerminar', x.alTerminar, 'alTerminar');
        textoCarril(dv + '.detalle', x.detalle, 'detalle');
      });
      // siNinguna: lo que dicen el detalle y la línea si jefatura ha dado a otras personas todo lo que te proponía y no te
      // ha elegido para nada (no te queda nada que cubrir).
      if (c.siNinguna !== undefined) {
        const sn = c.siNinguna || {};
        if (!cubre) err(d + '.siNinguna', 'solo va en un carril con sesiones «cubre»');
        if (c.siOtra === undefined) av(d + '.siNinguna', 'solo se usa si jefatura puede dar a otra persona lo que te proponía: pon también siOtra');
        textoCarril(d + '.siNinguna.detalle', sn.detalle, 'detalle');
        textoCarril(d + '.siNinguna.linea', sn.linea, 'ninguna', false);
        for (const k of Object.keys(sn)) if (!['detalle', 'linea'].includes(k)) av(d + '.siNinguna', `«${k}» no lo usa el motor (vale: detalle y linea)`);
      }
      // siElegido: las sesiones que DirectorIA proponía a otra persona y para las que jefatura elige a la del perfil.
      // Cada una sale en su franja como «cubre», en lugar de lo que hubiera a esa hora; «aviso» va bajo el día.
      if (c.siElegido !== undefined) {
        if (!cubre && !esTexto(c.pendiente)) err(d + '.pendiente', 'falta: con siElegido, el carril necesita «pendiente» y «alTerminar» para su línea de estado');
        lista(d + '.siElegido', c.siElegido, 1, 6).forEach((x, j) => {
          const dv = `${d}.siElegido[${j}]`;
          if (typeof x.cuando !== 'string' || !x.cuando.includes('#')) err(dv + '.cuando', 'tiene que ser una sola propuesta de aprobaciones, como «jefatura/guardias#g2»');
          else { sigue(dv + '.cuando', x.cuando); elegidos.push({ archivo: actual, donde: dv + '.cuando', rol: r.id, ref: x.cuando, persona: (r.persona || {}).nombre }); }
          if (!ids.includes(x.franja)) err(dv + '.franja', `«${x.franja}» no es una franja del horario (${ids.join(', ')})`);
          texto(dv + '.titulo', x.titulo, { max: 40 });
          texto(dv + '.detalle', x.detalle, { max: 40, opcional: true });
          texto(dv + '.nota', x.nota, { max: 120, opcional: true });
          texto(dv + '.aviso', x.aviso, { max: 120, opcional: true });
          for (const k of Object.keys(x)) if (!['cuando', 'franja', 'titulo', 'detalle', 'nota', 'aviso'].includes(k)) av(dv, `«${k}» no lo usa el motor`);
        });
      }
      for (const k of Object.keys(c)) if (!['titulo', 'detalle', 'icono', 'cuenta', 'pendiente', 'parcial', 'alTerminar', 'siOtra', 'siNinguna', 'siElegido', 'sesiones'].includes(k)) av(d, `«${k}» no lo usa el motor`);
    });
  }

  // Lo que te necesita: por grupos seguidos (Hoy, Esta semana, Para saber).
  if (ini.lista === undefined) err('inicio.lista', 'falta: el panel lleva la lista de lo que te necesita');
  else {
    texto('inicio.lista.titulo', ini.lista.titulo, { max: 40 });
    const grupos = [];
    lista('inicio.lista.items', ini.lista.items, 1, 10).forEach((it, i) => {
      const d = `inicio.lista.items[${i}]`;
      texto(d + '.grupo', it.grupo, { max: 20 });
      if (grupos.length && grupos[grupos.length - 1] !== it.grupo && grupos.includes(it.grupo)) err(d + '.grupo', `«${it.grupo}» ya ha salido antes: pon seguidos los de cada grupo`);
      grupos.push(it.grupo);
      uno(d + '.icono', it.icono, ICONOS);
      texto(d + '.titulo', it.titulo, { max: 70 });
      texto(d + '.detalle', it.detalle, { max: 130, opcional: true });
      uno(d + '.estado', it.estado, ESTADOS_INICIO);
      texto(d + '.fecha', it.fecha, { max: 12, opcional: true });
      irValido(d + '.ir', it.ir);
      siValido(r, d, it, irValido);
      extrasMarca(d, it);
      if (it.ia !== undefined && typeof it.ia !== 'boolean') err(d + '.ia', 'tiene que ser true o false');
      // siDictado: lo que cambia mientras el dictado que se sigue está dictado y por revisar.
      if (it.siDictado !== undefined) {
        const mid = String(it.sigue || '').split('#')[0];
        const m = (r.modulos || []).find((x) => x.id === mid);
        if (!m || m.tipo !== 'dictado') err(d + '.siDictado', 'solo va en una fila que sigue a un dictado de este perfil');
        const sd = it.siDictado || {};
        texto(d + '.siDictado.titulo', sd.titulo, { max: 70, opcional: true });
        texto(d + '.siDictado.detalle', sd.detalle, { max: 130, opcional: true });
        if (sd.estado !== undefined) uno(d + '.siDictado.estado', sd.estado, ESTADOS_INICIO);
        for (const k of Object.keys(sd)) if (!['titulo', 'detalle', 'estado'].includes(k)) av(d + '.siDictado', `«${k}» no lo usa el motor`);
      }
      siOtraValido(r, d + '.siOtra', it.siOtra, ['titulo', 'detalle', 'estado', 'ir', 'sigue', 'verbo', 'icono'], (dv, x) => {
        texto(dv + '.titulo', x.titulo, { max: 70, opcional: true });
        texto(dv + '.detalle', x.detalle, { max: 130, opcional: true });
        if (x.estado !== undefined) uno(dv + '.estado', x.estado, ESTADOS_INICIO);
        if (x.icono !== undefined) uno(dv + '.icono', x.icono, ICONOS);
        if (x.ir !== null) irValido(dv + '.ir', x.ir);
        if (x.sigue !== undefined && x.sigue !== null) sigue(dv + '.sigue', x.sigue);
        texto(dv + '.verbo', x.verbo, { max: 24, opcional: true });
      });
      siOtraValido(r, d + '.siConfirmada', it.siConfirmada, ['titulo', 'detalle', 'estado', 'ir', 'sigue', 'verbo', 'icono'], (dv, x) => {
        texto(dv + '.titulo', x.titulo, { max: 70, opcional: true });
        texto(dv + '.detalle', x.detalle, { max: 130, opcional: true });
        if (x.estado !== undefined) uno(dv + '.estado', x.estado, ESTADOS_INICIO);
        if (x.icono !== undefined) uno(dv + '.icono', x.icono, ICONOS);
        if (x.ir !== undefined) irValido(dv + '.ir', x.ir);
        if (x.sigue !== undefined) sigue(dv + '.sigue', x.sigue);
        texto(dv + '.verbo', x.verbo, { max: 24, opcional: true });
      }, false);
      aMediasValido(r, d, it, ['titulo', 'detalle', 'estado', 'ir', 'icono'], (dv, x) => {
        texto(dv + '.titulo', x.titulo, { max: 70, opcional: true });
        texto(dv + '.detalle', x.detalle, { max: 130, opcional: true });
        if (x.estado !== undefined) uno(dv + '.estado', x.estado, ESTADOS_INICIO);
        if (x.icono !== undefined) uno(dv + '.icono', x.icono, ICONOS);
        if (x.ir !== undefined) irValido(dv + '.ir', x.ir);
      });
      for (const k of Object.keys(it)) if (!['grupo', 'icono', 'titulo', 'detalle', 'estado', 'fecha', 'ir', 'sigue', 'si', 'siDictado', 'siOtra', 'siConfirmada', 'aMedias', 'verbo', 'choque', 'ia'].includes(k)) av(d, `«${k}» no lo usa el motor`);
    });
  }

  // Lo que viene: el calendario empieza un lunes y las marcas caen después de hoy y dentro de sus semanas.
  if (ini.agenda !== undefined) {
    const ag = ini.agenda;
    texto('inicio.agenda.titulo', ag.titulo, { max: 40 });
    const iso = /^\d{4}-\d{2}-\d{2}$/;
    if (!iso.test(ag.desde || '')) err('inicio.agenda.desde', 'tiene que ser una fecha AAAA-MM-DD');
    else if (new Date(ag.desde + 'T00:00:00Z').getUTCDay() !== 1) err('inicio.agenda.desde', 'tiene que ser un lunes');
    if (!Number.isInteger(ag.semanas) || ag.semanas < 1 || ag.semanas > 5) err('inicio.agenda.semanas', 'tiene que ser un número del 1 al 5');
    const fin = iso.test(ag.desde || '') ? masDias(ag.desde, 7 * (ag.semanas || 3)) : '9999';
    if (ag.desde > HOY || fin <= HOY) err('inicio.agenda.desde', `el calendario tiene que incluir hoy (${HOY})`);
    lista('inicio.agenda.marcas', ag.marcas, 1, 12).forEach((m, i) => {
      const d = `inicio.agenda.marcas[${i}]`;
      if (!iso.test(m.fecha || '')) err(d + '.fecha', 'tiene que ser una fecha AAAA-MM-DD');
      else if (m.fecha <= HOY || m.fecha >= fin) err(d + '.fecha', 'tiene que caer después de hoy y dentro de las semanas del calendario (lo de hoy va en la lista)');
      uno(d + '.tipo', m.tipo, ['plazo', 'evento', 'aviso']);
      texto(d + '.titulo', m.titulo, { max: 60 });
      texto(d + '.detalle', m.detalle, { max: 110, opcional: true });
      // hora: sale con el tiempo relativo («Mañana · 11:45»). fuente: de dónde lo ha sacado la IA (lleva la insignia).
      if (m.hora !== undefined && !/^\d{1,2}:\d{2}$/.test(m.hora)) err(d + '.hora', 'tiene que ser una hora como 9:15');
      if (m.fuente !== undefined) uno(d + '.fuente', m.fuente, ['correo', 'circular']);
      if (m.tipo === 'aviso' && !m.choque) av(d + '.tipo', 'el triángulo de aviso es para los choques: pon también choque: true');
      if (m.tipo === 'plazo' && /[úu]ltimo d[ií]a/i.test((m.titulo || '') + ' ' + (m.detalle || ''))) av(d, 'si la fuente dice «antes del…», escribe «antes de este día» y no «último día»');
      irValido(d + '.ir', m.ir);
      siValido(r, d, m, irValido);
      extrasMarca(d, m);
      aMediasValido(r, d, m, ['titulo', 'detalle', 'ir'], (dv, x) => {
        texto(dv + '.titulo', x.titulo, { max: 60, opcional: true });
        texto(dv + '.detalle', x.detalle, { max: 110, opcional: true });
        if (x.ir !== undefined) irValido(dv + '.ir', x.ir);
      });
      for (const k of Object.keys(m)) if (!['fecha', 'hora', 'tipo', 'titulo', 'detalle', 'ir', 'sigue', 'si', 'aMedias', 'verbo', 'choque', 'fuente'].includes(k)) av(d, `«${k}» no lo usa el motor`);
    });
  }
  for (const k of Object.keys(ini)) if (!['antetitulo', 'titulo', 'entradilla', 'cifras', 'dia', 'lista', 'agenda', 'bloques'].includes(k)) av('inicio.' + k, 'el motor no usa esta clave');
}

const bloquesDoc = (d, bloques) => lista(d, bloques, 1, 30).forEach((b, i) => {
  const di = `${d}[${i}]`;
  uno(di + '.tipo', b.tipo, ['campo', 'titulo', 'parrafo', 'lista', 'aviso']);
  if (b.tipo === 'campo') { texto(di + '.etiqueta', b.etiqueta, { max: 40 }); texto(di + '.texto', b.texto, { max: 400 }); }
  else if (b.tipo === 'lista') lista(di + '.items', b.items, 1, 12).forEach((s, j) => texto(`${di}.items[${j}]`, s, { max: 300 }));
  else texto(di + '.texto', b.texto, { max: 900 });
});

const VALIDA = {
  aprobaciones(d, m) {
    if (m.contexto) { texto(d + '.contexto.titulo', m.contexto.titulo, { max: 60 }); texto(d + '.contexto.texto', m.contexto.texto, { max: 200 }); }
    lista(d + '.items', m.items, 1, 8).forEach((it, i) => {
      const di = `${d}.items[${i}]`;
      texto(di + '.id', it.id, { max: 20 });
      texto(di + '.cuando', it.cuando, { max: 40 });
      texto(di + '.que', it.que, { max: 60 });
      texto(di + '.propuesta', it.propuesta, { max: 40 });
      texto(di + '.motivo', it.motivo, { max: 160 });
      lista(di + '.alternativas', it.alternativas, 1, 4).forEach((a, j) => texto(`${di}.alternativas[${j}]`, a, { max: 40 }));
    });
    texto(d + '.boton', m.boton, { max: 24 });
    texto(d + '.botonTodo', m.botonTodo, { max: 30 });
    texto(d + '.alConfirmar', m.alConfirmar, { max: 160 });
    if (m.bandera !== undefined) uno(d + '.bandera', m.bandera, ['guardias']);
  },
  documento(d, m) {
    texto(d + '.origen', m.origen, { max: 120 });
    const doc = m.documento || {};
    texto(d + '.documento.titulo', doc.titulo, { max: 90 });
    texto(d + '.documento.subtitulo', doc.subtitulo, { max: 120, opcional: true });
    bloquesDoc(d + '.documento.bloques', doc.bloques);
    lista(d + '.rellenado', m.rellenado, 2, 5).forEach((s, i) => texto(`${d}.rellenado[${i}]`, s, { max: 120 }));
    lista(d + '.comprobaciones', m.comprobaciones, 2, 5).forEach((s, i) => texto(`${d}.comprobaciones[${i}]`, s, { max: 120 }));
    texto(d + '.boton', m.boton, { max: 30 });
    texto(d + '.alTerminar', m.alTerminar, { max: 160 });
    if (m.documentos !== undefined) lista(d + '.documentos', m.documentos, 1, 10).forEach((x, i) => {
      texto(`${d}.documentos[${i}].nombre`, x.nombre, { max: 80 });
      uno(`${d}.documentos[${i}].estado`, x.estado, ['ok', 'falta', 'revisar']);
      texto(`${d}.documentos[${i}].detalle`, x.detalle, { max: 140, opcional: true });
    });
  },
  plazos(d, m) {
    lista(d + '.items', m.items, 2, 12).forEach((it, i) => {
      const di = `${d}.items[${i}]`;
      texto(di + '.fecha', it.fecha, { max: 24 });
      texto(di + '.titulo', it.titulo, { max: 80 });
      texto(di + '.detalle', it.detalle, { max: 200 });
      texto(di + '.quien', it.quien, { max: 40 });
      texto(di + '.origen', it.origen, { max: 70, opcional: true });
      uno(di + '.estado', it.estado, ['hoy', 'pronto', 'hecho', 'despues']);
    });
  },
  // Una guía de pasos, sin caso: qué se hace, quién, el plazo («Según el protocolo vigente» si no hay uno fijo), el anexo
  // (la plantilla en blanco), dónde queda y qué hay que cuidar. Lo que va solo si se confirma lleva «condicional».
  protocolo(d, m) {
    for (const k of ['caso', 'actual', 'documentos']) if (m[k] !== undefined) err(`${d}.${k}`, 'una guía no lleva caso: no se abre ningún caso en DirectorIA (los datos del caso van a Raíces y al expediente del centro)');
    if (m.confidencial !== undefined) av(d + '.confidencial', 'una guía no lleva datos de nadie: sin banda confidencial');
    texto(d + '.aviso', m.aviso, { max: 180 });
    if (esTexto(m.aviso) && !/ning[uú]n caso/i.test(m.aviso)) av(d + '.aviso', 'di que no se abre ningún caso en DirectorIA y adónde van los datos del caso');
    const ids = new Set();
    // Las guías se escriben una vez: un perfil puede tomar las de otro con «guias: 'orientacion/protocolos'» (dirección
    // usa las de orientación). Se comprueba al final, con ese perfil cargado.
    let guias = [];
    if (typeof m.guias === 'string') {
      const [rolG, modG] = m.guias.split('/');
      if (!rolG || !modG || !ROLES.includes(rolG)) err(d + '.guias', 'una lista de guías o las de otro perfil, como «orientacion/protocolos»');
      else if (rolG === actualRol.id) err(d + '.guias', 'las guías de este mismo perfil van escritas aquí, no con «perfil/módulo»');
      else guiasDe.push({ archivo: actual, donde: d + '.guias', ref: m.guias });
    } else guias = lista(d + '.guias', m.guias, 1, 4);
    guias.forEach((g, i) => {
      const dg = `${d}.guias[${i}]`;
      if (!/^[a-z][a-z0-9-]*$/.test(g.id || '')) err(dg + '.id', 'el id lleva solo minúsculas, números y guiones');
      else if (ids.has(g.id)) err(dg + '.id', 'id repetido'); else ids.add(g.id);
      texto(dg + '.nombre', g.nombre, { max: 30 });
      texto(dg + '.fuente', g.fuente, { max: 140 });
      texto(dg + '.si', g.si, { max: 40, opcional: true });
      const pasos = lista(dg + '.pasos', g.pasos, 3, 12);
      let condicional = false;
      pasos.forEach((p, j) => {
        const dp = `${dg}.pasos[${j}]`;
        texto(dp + '.nombre', p.nombre, { max: 60 });
        texto(dp + '.que', p.que, { max: 220 });
        texto(dp + '.quien', p.quien, { max: 90 });
        texto(dp + '.plazo', p.plazo, { max: 60 });
        texto(dp + '.anexo', p.anexo, { max: 40, opcional: true });
        texto(dp + '.donde', p.donde, { max: 50, opcional: true });
        texto(dp + '.cuidar', p.cuidar, { max: 160, opcional: true });
        if (p.condicional !== undefined && typeof p.condicional !== 'boolean') err(dp + '.condicional', 'tiene que ser true o false');
        if (p.condicional) condicional = true;
        if (p.estado !== undefined || p.nota !== undefined) err(dp, 'una guía no lleva el estado de un caso («hecho», «en curso»): explica cómo se hace cada paso');
        for (const k of Object.keys(p)) if (!['nombre', 'que', 'quien', 'plazo', 'anexo', 'donde', 'cuidar', 'condicional'].includes(k)) av(dp, `«${k}» no lo usa el motor`);
      });
      if (condicional && !esTexto(g.si)) err(dg + '.si', 'falta: el título que va antes de los pasos que solo van si se confirma');
      const anexos = pasos.map((p) => p.anexo || '').join(' · ');
      if (g.plantillas !== undefined) lista(dg + '.plantillas', g.plantillas, 1, 8).forEach((x, j) => {
        texto(`${dg}.plantillas[${j}].nombre`, x.nombre, { max: 40 });
        texto(`${dg}.plantillas[${j}].detalle`, x.detalle, { max: 60, opcional: true });
        const codigo = String(x.nombre || '').replace(/^Anexo\s+/, '');
        if (codigo && !anexos.includes(codigo)) av(`${dg}.plantillas[${j}]`, `«${x.nombre}» no lo usa ningún paso de la guía`);
      });
    });
    texto(d + '.pie', m.pie, { max: 220 });
    if (esTexto(m.pie) && !/abogad/i.test(m.pie)) av(d + '.pie', 'lo legal se presenta como lectura del equipo de DirectorIA, no de un abogado: dilo en el pie');
  },
  banco(d, m) {
    texto(d + '.consulta', m.consulta, { max: 80 });
    lista(d + '.entendido', m.entendido, 2, 6).forEach((x, i) => texto(`${d}.entendido[${i}]`, x, { max: 40 }));
    texto(d + '.aviso', m.aviso, { max: 120 });
    lista(d + '.resultados', m.resultados, 2, 5).forEach((x, i) => {
      const di = `${d}.resultados[${i}]`;
      texto(di + '.titulo', x.titulo, { max: 70 });
      texto(di + '.meta', x.meta, { max: 120 });
      texto(di + '.cercania', x.cercania, { max: 40 });
      if (x.adaptar) {
        texto(di + '.adaptar.boton', x.adaptar.boton, { max: 30 });
        texto(di + '.adaptar.titulo', x.adaptar.titulo, { max: 90 });
        lista(di + '.adaptar.texto', x.adaptar.texto, 3, 10).forEach((s, j) => texto(`${di}.adaptar.texto[${j}]`, s, { max: 200 }));
        texto(di + '.adaptar.nota', x.adaptar.nota, { max: 200 });
      }
    });
    const s = m.subir || {};
    texto(d + '.subir.titulo', s.titulo, { max: 70 });
    lista(d + '.subir.curso', s.curso, 1, 4);
    lista(d + '.subir.materia', s.materia, 1, 3);
    lista(d + '.subir.contenidos', s.contenidos, 1, 4);
    // Las casillas son obligatorias para compartir. Declarar que está hecho con IA es voluntario: va en «declaracion».
    lista(d + '.subir.casillas', s.casillas, 2, 3).forEach((x, i) => {
      texto(`${d}.subir.casillas[${i}]`, x, { max: 60 });
      if (typeof x === 'string' && /\bIA\b/.test(x)) err(`${d}.subir.casillas[${i}]`, 'declarar que el recurso está hecho con IA es voluntario: ponlo en «declaracion», no en las casillas obligatorias');
    });
    texto(d + '.subir.declaracion', s.declaracion, { max: 80, opcional: true });
    // Lo que se comprueba al leer el archivo: con reglas (un DNI, un ©, un ISBN) o con IA (nombres, datos de salud), sin la insignia.
    if (s.comprobado !== undefined) lista(d + '.subir.comprobado', s.comprobado, 1, 4).forEach((x, i) => {
      texto(`${d}.subir.comprobado[${i}].texto`, x.texto, { max: 50 });
      uno(`${d}.subir.comprobado[${i}].como`, x.como, ['reglas', 'ia']);
    });
    const im = m.impacto || {};
    texto(d + '.impacto.texto', im.texto, { max: 160 });
    lista(d + '.impacto.insignias', im.insignias, 1, 4);
    texto(d + '.impacto.meta', im.meta, { max: 90 });
  },
  dictado(d, m) {
    texto(d + '.para', m.para, { max: 60 });
    texto(d + '.transcripcion', m.transcripcion, { palabrasMin: 50, palabrasMax: 130 });
    texto(d + '.asunto', m.asunto, { max: 80 });
    texto(d + '.borrador', m.borrador, { palabrasMin: 80, palabrasMax: 180 });
    lista(d + '.notas', m.notas, 2, 3).forEach((s, i) => texto(`${d}.notas[${i}]`, s, { max: 90 }));
  },
  material(d, m) {
    texto(d + '.aviso', m.aviso, { max: 220 });
    texto(d + '.peticion', m.peticion, { max: 220 });
    if (!m.bloqueo) err(d + '.bloqueo', 'falta');
    else { texto(d + '.bloqueo.intento', m.bloqueo.intento, { max: 200 }); texto(d + '.bloqueo.mensaje', m.bloqueo.mensaje, { max: 200 }); }
    const r = m.respuesta || {};
    texto(d + '.respuesta.titulo', r.titulo, { max: 90 });
    bloquesDoc(d + '.respuesta.bloques', r.bloques);
  },
  traduccion(d, m) {
    texto(d + '.para', m.para, { max: 60 });
    // Una circular general, para las familias de un curso o de un grupo: «para» lleva su artículo («Las familias de 4.º»).
    if (esTexto(m.para) && !/^(La|Las|El|Los) /.test(m.para)) err(d + '.para', 'empieza por su artículo («Las familias de 4.º de Primaria»): el motor lo usa en «¿Enviarlo a las familias…?»');
    texto(d + '.original.titulo', (m.original || {}).titulo, { max: 80 });
    texto(d + '.original.texto', (m.original || {}).texto, { palabrasMin: 50, palabrasMax: 220 });
    lista(d + '.versiones', m.versiones, 2, 3).forEach((v, i) => { texto(`${d}.versiones[${i}].idioma`, v.idioma, { max: 20 }); texto(`${d}.versiones[${i}].texto`, v.texto, { palabrasMin: 40, palabrasMax: 240 }); });
    lista(d + '.comprobaciones', m.comprobaciones, 2, 4).forEach((s, i) => texto(`${d}.comprobaciones[${i}]`, s, { max: 120 }));
    texto(d + '.boton', m.boton, { max: 30 });
    texto(d + '.alTerminar', m.alTerminar, { max: 160 });
  },
  // La ficha de sustitución, solo la clase: grupo, materia, hora y aula; «Preparada por DirectorIA · confirmada por
  // jefatura»; la tarea, el material y a quién llamar. Nada de «Necesidades», «Salud» ni «Recogida», ni nombres de alumnos:
  // la línea fija de salud y recogidas la pone el motor, igual en todas las fichas.
  ficha(d, m) {
    if (m.bandera !== undefined) uno(d + '.bandera', m.bandera, ['guardias']);
    lista(d + '.fichas', m.fichas, 1, 3).forEach((f, i) => {
      const di = `${d}.fichas[${i}]`;
      texto(di + '.sesion', f.sesion, { max: 60 });
      texto(di + '.hora', f.hora, { max: 20 });
      texto(di + '.aula', f.aula, { max: 50 });
      texto(di + '.para', f.para, { max: 40, opcional: true });
      if (f.origen !== 'Preparada por DirectorIA · confirmada por jefatura') err(di + '.origen', '«Preparada por DirectorIA · confirmada por jefatura», sin insignia: la ficha sale de reglas y la confirma jefatura');
      const datos = lista(di + '.datos', f.datos, 3, 5);
      datos.forEach((x, j) => {
        texto(`${di}.datos[${j}].dt`, x.dt, { max: 30 }); texto(`${di}.datos[${j}].dd`, x.dd, { max: 200 });
        if (!['Tarea', 'Material', 'A quién llamar', 'Al acabar'].includes(x.dt)) err(`${di}.datos[${j}].dt`, `«${x.dt}» no va en la ficha: solo la clase (Tarea, Material, A quién llamar y Al acabar)`);
        if (x.aviso !== undefined) err(`${di}.datos[${j}].aviso`, 'la ficha no lleva avisos de alumnos: el único aviso es la línea fija de salud y recogidas, y la pone el motor');
      });
      for (const k of ['Tarea', 'Material', 'A quién llamar']) if (!datos.some((x) => x.dt === k)) err(di + '.datos', `falta «${k}»`);
      const llamar = datos.find((x) => x.dt === 'A quién llamar');
      if (llamar && !(/tutor/i.test(llamar.dd) && /jefatura/i.test(llamar.dd) && /conserjer/i.test(llamar.dd) && /ext\. \d+/.test(llamar.dd))) err(di + '.datos', '«A quién llamar»: tutoría, jefatura y conserjería, con su extensión («ext. 202»)');
      texto(di + '.pie', f.pie, { max: 160 });
    });
    if (m.registro !== undefined) lista(d + '.registro', m.registro, 1, 5).forEach((s, i) => texto(`${d}.registro[${i}]`, s, { max: 100 }));
  },
  // Justificantes del profesorado: un programa los archiva en Justificantes / curso / mes / docente; la IA no los lee.
  // «subir»: las ausencias de la persona del perfil (las pendientes, con id). «carpetas» e «informe»: las de todo el
  // profesorado, con docente; si la entrega se hace en otro perfil, «sigue» ('docente/justificantes#j1'). Nunca el motivo.
  justificantes(d, m) {
    uno(d + '.vista', m.vista, ['subir', 'carpetas', 'informe']);
    if (!/^\d{4}-\d{2}$/.test(m.curso || '')) err(d + '.curso', 'tiene que ser el curso como «2026-27»');
    if (m.ia) err(d + '.ia', 'los justificantes no llevan la insignia de la IA: los archiva un programa y la IA no los lee');
    texto(d + '.nota', m.nota, { max: 80, opcional: true });
    if (m.vista !== 'informe' && !esTexto(m.confidencial)) err(d + '.confidencial', 'falta: los justificantes los ven el propio docente y quien lleva el personal, con registro de accesos');
    if (m.vista === 'subir') { texto(d + '.archivo', m.archivo, { max: 40 }); if (esTexto(m.archivo) && !/\.(pdf|jpe?g|png)$/i.test(m.archivo)) err(d + '.archivo', 'un PDF o una foto (.pdf, .jpg, .png)'); }
    else if (m.archivo !== undefined) av(d + '.archivo', 'solo se usa en la vista «subir»');
    const ids = new Set();
    lista(d + '.ausencias', m.ausencias, 1, 12).forEach((a, i) => {
      const da = `${d}.ausencias[${i}]`;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(a.fecha || '')) err(da + '.fecha', 'tiene que ser una fecha AAAA-MM-DD');
      else if (a.fecha > HOY) err(da + '.fecha', 'una ausencia es de hoy o de antes');
      texto(da + '.horas', a.horas, { max: 24 });
      uno(da + '.justificante', a.justificante, ['entregado', 'pendiente']);
      for (const k of ['motivo', 'causa', 'razon']) if (a[k] !== undefined) err(`${da}.${k}`, 'el registro de ausencias nunca guarda el motivo');
      if (m.vista === 'subir') {
        if (a.docente !== undefined) err(da + '.docente', 'en «subir», las ausencias son de la persona del perfil: sin docente');
        if (a.sigue !== undefined) err(da + '.sigue', 'en «subir», el justificante se sube aquí: sin «sigue»');
        if (a.justificante === 'pendiente' && !esTexto(a.id)) err(da + '.id', 'falta: es la ausencia que se elige al subir el justificante');
      } else {
        texto(da + '.docente', a.docente, { max: 40 });
        if (a.id !== undefined) av(da + '.id', 'solo se usa en «subir»');
        if (a.sigue !== undefined) {
          if (typeof a.sigue !== 'string' || !a.sigue.includes('/')) err(da + '.sigue', 'tiene que ser el justificante de otro perfil, como «docente/justificantes#j1»');
          else { sigueValido(actualRol, da + '.sigue', a.sigue); justificantesDe.push({ archivo: actual, donde: da + '.sigue', ref: a.sigue, docente: a.docente, fecha: a.fecha }); }
          if (a.justificante !== 'pendiente') err(da + '.justificante', 'con «sigue», empieza pendiente: pasa a entregado cuando se sube en el otro perfil');
        }
      }
      if (esTexto(a.id)) { if (ids.has(a.id)) err(da + '.id', 'id repetido'); ids.add(a.id); }
    });
    lista(d + '.reglas', m.reglas, 2, 6).forEach((x, i) => texto(`${d}.reglas[${i}]`, x, { max: 150 }));
    if (m.registro !== undefined) { if (m.vista !== 'carpetas') av(d + '.registro', 'el registro de accesos solo sale en «carpetas»'); lista(d + '.registro', m.registro, 1, 5).forEach((x, i) => texto(`${d}.registro[${i}]`, x, { max: 110 })); }
  },
  tabla(d, m) {
    const cols = lista(d + '.columnas', m.columnas, 2, 7);
    cols.forEach((c, i) => texto(`${d}.columnas[${i}]`, c, { max: 30 }));
    lista(d + '.filas', m.filas, 2, 12).forEach((f, i) => {
      if (!Array.isArray(f) || f.length !== cols.length) err(`${d}.filas[${i}]`, `tiene que tener ${cols.length} celdas`);
      else f.forEach((c, j) => texto(`${d}.filas[${i}][${j}]`, c, { max: 90 }));
    });
    if (m.marcas !== undefined) lista(d + '.marcas', m.marcas, 0, 20).forEach((x, i) => {
      if (!Number.isInteger(x.fila) || !Number.isInteger(x.columna)) err(`${d}.marcas[${i}]`, 'fila y columna son números');
      uno(`${d}.marcas[${i}].tipo`, x.tipo, ['aviso', 'ok']);
    });
    lista(d + '.avisos', m.avisos, 1, 5).forEach((x, i) => { texto(`${d}.avisos[${i}].texto`, x.texto, { max: 220 }); uno(`${d}.avisos[${i}].estado`, x.estado, ['aviso', 'ok', 'info']); });
    if (m.boton !== undefined) { texto(d + '.boton', m.boton, { max: 30 }); texto(d + '.alTerminar', m.alTerminar, { max: 160 }); }
  },
  informe(d, m) {
    lista(d + '.cifras', m.cifras, 2, 4).forEach((x, i) => { texto(`${d}.cifras[${i}].valor`, x.valor, { max: 14 }); texto(`${d}.cifras[${i}].texto`, x.texto, { max: 70 }); });
    lista(d + '.avisos', m.avisos, 2, 6).forEach((x, i) => { texto(`${d}.avisos[${i}].titulo`, x.titulo, { max: 70 }); texto(`${d}.avisos[${i}].detalle`, x.detalle, { max: 260 }); uno(`${d}.avisos[${i}].estado`, x.estado, ['hoy', 'pronto', 'info', 'hecho']); });
    if (m.filas !== undefined) lista(d + '.filas', m.filas, 3, 10).forEach((x, i) => { texto(`${d}.filas[${i}].partida`, x.partida, { max: 40 }); texto(`${d}.filas[${i}].proveedor`, x.proveedor, { max: 50 }); texto(`${d}.filas[${i}].importe`, x.importe, { max: 14 }); texto(`${d}.filas[${i}].nota`, x.nota, { max: 120, opcional: true }); });
    texto(d + '.pie', m.pie, { max: 220 });
  },
};

const cargados = {};
const archivos = process.argv.slice(2);
if (!archivos.length) { console.error('Uso: node validar.mjs <archivo.js> [...]'); process.exit(2); }
for (const a of archivos) {
  actual = path.basename(a);
  const recogidos = [];
  const ctx = { DEMO: { rol: (o) => recogidos.push(o) } };
  try {
    vm.runInNewContext(fs.readFileSync(a, 'utf8'), ctx, { filename: a });
  } catch (e) {
    errores.push(`${actual}: el archivo no se puede ejecutar: ${e.message}`);
    continue;
  }
  if (recogidos.length !== 1) { errores.push(`${actual}: tiene que haber exactamente una llamada DEMO.rol({...}) (hay ${recogidos.length})`); continue; }
  validarRol(recogidos[0]);
  cargados[recogidos[0].id] = recogidos[0];
  const esperado = path.basename(a, '.js');
  if (recogidos[0].id && recogidos[0].id !== esperado) errores.push(`${actual}: el id «${recogidos[0].id}» no coincide con el nombre del archivo`);
}
// Lo que un perfil sigue de otro (por ejemplo, 'jefatura/guardias#g1'): se comprueba si se ha cargado ese perfil.
for (const x of cruces) {
  actual = x.archivo;
  if (cargados[x.rol]) refValida(cargados[x.rol], x.donde, x.s);
  else av(x.donde, `sigue a «${x.rol}», que no se ha cargado: valida también ${x.rol}.js para comprobarlo`);
}
// En las sesiones «cubre», la persona sale de la propuesta que se sigue: si el título es una de esas personas, avisa.
for (const x of cubres) {
  actual = x.archivo;
  let rol = x.rol, s = x.ref;
  const barra = s.indexOf('/');
  if (barra > 0) { rol = s.slice(0, barra); s = s.slice(barra + 1); }
  const [mid, el] = s.split('#');
  const m = cargados[rol] && (cargados[rol].modulos || []).find((y) => y.id === mid);
  if (!m || m.tipo !== 'aprobaciones' || el === undefined) continue;
  const it = (m.items || []).find((y) => y.id === el);
  if (it && [it.propuesta].concat(it.alternativas || []).includes(x.titulo)) av(x.donde, `«${x.titulo}» es una persona: sale de la propuesta de ${rol}/${mid} (y de quien elija jefatura); el título es lo que se cubre («Lengua», «Patio de Primaria»…)`);
}
// «fichas» sigue un módulo de aprobaciones con propuestas que llevan ficha.
const moduloDe = (rol, ref) => { let r0 = rol, s = ref; const b = s.indexOf('/'); if (b > 0) { r0 = s.slice(0, b); s = s.slice(b + 1); } const [mid, el] = s.split('#'); return { m: cargados[r0] && (cargados[r0].modulos || []).find((y) => y.id === mid), el, cargado: !!cargados[r0] }; };
for (const x of fichasDe) {
  actual = x.archivo;
  const { m, el, cargado } = moduloDe(x.rol, x.ref);
  if (!cargado) continue;
  if (el !== undefined) err(x.donde, 'va con el módulo entero («jefatura/guardias»), sin «#»');
  else if (!m || m.tipo !== 'aprobaciones') err(x.donde, 'tiene que ser un módulo de aprobaciones');
  else if (!(m.items || []).some((it) => it.ficha)) err(x.donde, 'ninguna propuesta de ese módulo lleva ficha');
}
// siElegido: la propuesta es para otra persona y la del perfil está entre las alternativas (si no, jefatura no podría elegirla).
for (const x of elegidos) {
  actual = x.archivo;
  const { m, el, cargado } = moduloDe(x.rol, x.ref);
  if (!cargado || !m || m.tipo !== 'aprobaciones') continue;
  const it = (m.items || []).find((y) => y.id === el);
  if (!it) continue;
  if (it.propuesta === x.persona) err(x.donde, `la propuesta ya es para ${x.persona}: va en las sesiones del carril, no en siElegido`);
  else if (!(it.alternativas || []).includes(x.persona)) err(x.donde, `${x.persona} no está entre las alternativas de «${el}»: jefatura no puede elegirla`);
}
// El justificante que se sigue es una ausencia de la vista «subir» de otro perfil, de la misma persona y el mismo día.
for (const x of justificantesDe) {
  actual = x.archivo;
  const { m, el, cargado } = moduloDe(null, x.ref);
  if (!cargado || !m) continue;
  const rol = x.ref.slice(0, x.ref.indexOf('/'));
  if (m.tipo !== 'justificantes' || m.vista !== 'subir') { err(x.donde, 'tiene que seguir la vista «subir» de los justificantes de otro perfil'); continue; }
  const a = (m.ausencias || []).find((y) => y.id === el);
  if (!a) continue;
  if (cargados[rol].persona && cargados[rol].persona.nombre !== x.docente) err(x.donde, `esa ausencia es de ${cargados[rol].persona.nombre}, no de ${x.docente}`);
  if (a.fecha !== x.fecha) err(x.donde, `esa ausencia es del ${a.fecha}, no del ${x.fecha}`);
}
// Las guías tomadas de otro perfil: un módulo de tipo protocolo de ese perfil, con sus guías escritas (no otra referencia).
for (const x of guiasDe) {
  actual = x.archivo;
  const { m, cargado } = moduloDe(null, x.ref);
  if (!cargado) { av(x.donde, `toma las guías de «${x.ref}», que no se ha cargado: valida también ${x.ref.split('/')[0]}.js para comprobarlo`); continue; }
  if (!m) err(x.donde, `«${x.ref}» no es un módulo`);
  else if (m.tipo !== 'protocolo') err(x.donde, `«${x.ref}» no es una guía de protocolos (es de tipo ${m.tipo})`);
  else if (!Array.isArray(m.guias)) err(x.donde, `«${x.ref}» también toma sus guías de otro perfil: apunta al que las tiene escritas`);
}
for (const x of avisos) console.log('AVISO  ' + x);
for (const x of errores) console.log('ERROR  ' + x);
console.log(errores.length ? `\n${errores.length} errores, ${avisos.length} avisos.` : `\nSin errores (${avisos.length} avisos).`);
process.exit(errores.length ? 1 : 0);
