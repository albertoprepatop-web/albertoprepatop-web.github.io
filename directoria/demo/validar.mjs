// Comprueba un archivo de datos de la demo de DirectorIA.
// Uso: node validar.mjs <archivo.js> [<archivo.js> ...]
// Sale con código 1 si hay errores. Los avisos no impiden seguir.
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';

const ROLES = ['direccion', 'jefatura', 'secretaria', 'docente', 'orientacion', 'sustituto'];
const ILUS = ['direccion', 'jefatura', 'secretaria', 'docente', 'orientacion', 'sustituto'];
const CATEGORIAS = ['Familias', 'Inspección', 'Consejería', 'Claustro', 'Equipo directivo', 'Proveedores', 'Otros'];
const TIPOS = ['aprobaciones', 'documento', 'plazos', 'protocolo', 'banco', 'dictado', 'material', 'traduccion', 'ficha', 'tabla', 'informe'];
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

function validarRol(r) {
  actual = r && r.id ? r.id : '(sin id)';
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
  const modulos = lista('modulos', r.modulos, 2, 4);
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
  lista('inicio.bloques', ini.bloques, 2, 4).forEach((b, i) => {
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
  protocolo(d, m) {
    texto(d + '.caso', m.caso, { max: 120 });
    lista(d + '.pasos', m.pasos, 5, 12).forEach((p, i) => {
      texto(`${d}.pasos[${i}].nombre`, p.nombre, { max: 60 });
      uno(`${d}.pasos[${i}].estado`, p.estado, ['hecho', 'curso', 'pendiente', 'condicional']);
      texto(`${d}.pasos[${i}].nota`, p.nota, { max: 60, opcional: true });
    });
    const a = m.actual || {};
    texto(d + '.actual.titulo', a.titulo, { max: 80 });
    lista(d + '.actual.secciones', a.secciones, 2, 4).forEach((s, i) => {
      texto(`${d}.actual.secciones[${i}].titulo`, s.titulo, { max: 50 });
      lista(`${d}.actual.secciones[${i}].items`, s.items, 1, 6).forEach((x, j) => texto(`${d}.actual.secciones[${i}].items[${j}]`, x, { max: 160 }));
    });
    lista(d + '.documentos', m.documentos, 1, 6).forEach((x, i) => { texto(`${d}.documentos[${i}].nombre`, x.nombre, { max: 80 }); texto(`${d}.documentos[${i}].estado`, x.estado, { max: 50 }); });
    texto(d + '.pie', m.pie, { max: 220 });
    if (!m.confidencial) err(d, 'un protocolo necesita la banda confidencial');
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
    texto(d + '.original.titulo', (m.original || {}).titulo, { max: 80 });
    texto(d + '.original.texto', (m.original || {}).texto, { palabrasMin: 50, palabrasMax: 220 });
    lista(d + '.versiones', m.versiones, 2, 3).forEach((v, i) => { texto(`${d}.versiones[${i}].idioma`, v.idioma, { max: 20 }); texto(`${d}.versiones[${i}].texto`, v.texto, { palabrasMin: 40, palabrasMax: 240 }); });
    lista(d + '.comprobaciones', m.comprobaciones, 2, 4).forEach((s, i) => texto(`${d}.comprobaciones[${i}]`, s, { max: 120 }));
    texto(d + '.boton', m.boton, { max: 30 });
    texto(d + '.alTerminar', m.alTerminar, { max: 160 });
  },
  ficha(d, m) {
    if (m.bandera !== undefined) uno(d + '.bandera', m.bandera, ['guardias']);
    lista(d + '.fichas', m.fichas, 1, 3).forEach((f, i) => {
      const di = `${d}.fichas[${i}]`;
      texto(di + '.sesion', f.sesion, { max: 60 });
      texto(di + '.hora', f.hora, { max: 20 });
      texto(di + '.origen', f.origen, { max: 90 });
      lista(di + '.datos', f.datos, 1, 6).forEach((x, j) => { texto(`${di}.datos[${j}].dt`, x.dt, { max: 30 }); texto(`${di}.datos[${j}].dd`, x.dd, { max: 260 }); });
      texto(di + '.pie', f.pie, { max: 160 });
    });
    if (m.registro !== undefined) lista(d + '.registro', m.registro, 1, 5).forEach((s, i) => texto(`${d}.registro[${i}]`, s, { max: 100 }));
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
  const esperado = path.basename(a, '.js');
  if (recogidos[0].id && recogidos[0].id !== esperado) errores.push(`${actual}: el id «${recogidos[0].id}» no coincide con el nombre del archivo`);
}
for (const x of avisos) console.log('AVISO  ' + x);
for (const x of errores) console.log('ERROR  ' + x);
console.log(errores.length ? `\n${errores.length} errores, ${avisos.length} avisos.` : `\nSin errores (${avisos.length} avisos).`);
process.exit(errores.length ? 1 : 0);
