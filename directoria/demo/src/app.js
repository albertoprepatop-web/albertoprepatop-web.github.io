/* DirectorIA · demo para enseñar. Todo ocurre en esta página: nada se envía ni se guarda fuera.
   Los datos de cada perfil están en datos/<perfil>.js (DEMO.rol({...})); aquí solo está el motor. */
(function () {
  'use strict';

  var D = window.DEMO;
  var PERFILES = Object.keys(D.roles).map(function (k) { return D.roles[k]; }).sort(function (a, b) { return a.orden - b.orden; });
  var CLAVE = 'directoria-demo-v1';

  var SVG_INSIGNIA = '<svg class="insignia" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="12" fill="#17322C"/><path d="M12 4.2 14.6 12 12 19.8 9.4 12z" fill="#E07A3A"/></svg>';
  var SVG_VISTO = '<svg class="visto" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="12" fill="#17322C"/><path d="M7.2 12.4l3.2 3.2 6.4-6.6" fill="none" stroke="#F6F3EC" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var SVG_VISTO_CLARO = '<svg class="visto" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="12" fill="#F6F3EC"/><path d="M7.2 12.4l3.2 3.2 6.4-6.6" fill="none" stroke="#17322C" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  /* ---------- Estado ---------- */
  function estadoInicial() {
    return { reloj: 0, banderas: {}, correo: {}, sel: {}, leyendo: {}, borrador: {}, aprob: {}, docs: {}, plazos: {}, tablas: {}, banco: {}, dictado: {}, material: {}, trad: {}, informe: {}, previa: {}, fichas: {} };
  }
  var S = cargar() || estadoInicial();
  function cargar() {
    try { var x = JSON.parse(window.sessionStorage.getItem(CLAVE) || 'null'); return x && typeof x === 'object' ? Object.assign(estadoInicial(), x) : null; } catch (e) { return null; }
  }
  function guardar() { try { window.sessionStorage.setItem(CLAVE, JSON.stringify(S)); } catch (e) { /* sin almacenamiento: la demo sigue en memoria */ } }
  function bolsa(seccion, rol, id) {
    S[seccion] = S[seccion] || {};
    S[seccion][rol] = S[seccion][rol] || {};
    if (id === undefined) return S[seccion][rol];
    S[seccion][rol][id] = S[seccion][rol][id] || {};
    return S[seccion][rol][id];
  }
  function horaActual() {
    var m = Math.min(S.reloj || 0, 59);
    return '8:' + (m < 10 ? '0' + m : m);
  }
  function ahora() {
    S.reloj = (S.reloj || 0) + 1;
    return horaActual();
  }

  /* ---------- Utilidades ---------- */
  function h(tag, attrs) {
    var el = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (v === null || v === undefined || v === false) return;
      if (k === 'class') el.className = v;
      else if (k === 'html') el.innerHTML = v; // solo para SVG propios, nunca para datos
      else if (k.slice(0, 2) === 'on') el.addEventListener(k.slice(2), v);
      else if (k === 'value') el.value = v;
      else if (k === 'checked') el.checked = !!v;
      else el.setAttribute(k, v === true ? '' : v);
    });
    for (var i = 2; i < arguments.length; i++) anadir(el, arguments[i]);
    return el;
  }
  function anadir(el, k) {
    if (k === null || k === undefined || k === false) return;
    if (Array.isArray(k)) { k.forEach(function (x) { anadir(el, x); }); return; }
    el.append(k.nodeType ? k : document.createTextNode(String(k)));
  }
  function svg(str) { var t = document.createElement('template'); t.innerHTML = str.trim(); return t.content.firstChild; }
  function insignia() { return svg(SVG_INSIGNIA); }
  function visto() { return svg(SVG_VISTO); }
  function ilus(nombre, cls, alt) { return D.ilus[nombre] ? h('img', { src: D.ilus[nombre], alt: alt || '', class: cls || null, width: 96, height: 96 }) : null; }
  function parrafos(texto) {
    return String(texto || '').split(/\n{2,}/).map(function (p) {
      var lineas = p.split('\n');
      var el = h('p');
      lineas.forEach(function (l, i) { if (i) el.append(h('br')); el.append(document.createTextNode(l)); });
      return el;
    });
  }
  function conInsignia(texto, suave) { return h('span', { class: 'con-insignia' + (suave ? ' suave' : '') }, insignia(), texto); }
  // La insignia de la IA solo va en lo que prepara la IA. Lo demás lo prepara DirectorIA con reglas y plantillas.
  var TIPOS_IA = { banco: true, dictado: true, material: true, traduccion: true, documento: true, plazos: true, aprobaciones: false, ficha: false, protocolo: false, tabla: false, informe: false };
  function esIA(m) { return m && m.ia !== undefined ? !!m.ia : !!TIPOS_IA[m && m.tipo]; }
  function sinInsignia(texto) { return h('span', { class: 'con-insignia suave' }, texto); }
  var NOMBRE_ESTADO = { hoy: 'Hoy', pendiente: 'Pendiente', hecho: 'Hecho', info: 'Para saber', plazo: 'Plazo', pronto: 'Pronto', despues: 'Más adelante', ok: 'Listo', falta: 'Falta', revisar: 'Revisar', aviso: 'Aviso', curso: 'En curso' };
  function pastilla(estado, texto) {
    var el = h('span', { class: 'pastilla p-' + estado });
    if (estado === 'hecho' || estado === 'ok') el.append(visto());
    el.append(document.createTextNode(texto || NOMBRE_ESTADO[estado] || estado));
    return el;
  }
  function boton(texto, onclick, extra) {
    var a = { class: 'boton' + (extra && extra.cls ? ' ' + extra.cls : ''), type: 'button', onclick: onclick };
    if (extra) Object.keys(extra).forEach(function (k) { if (k !== 'cls') a[k] = extra[k]; });
    return h('button', a, texto);
  }
  function minuscula(s) { return s ? s.charAt(0).toLowerCase() + s.slice(1) : s; }

  /* ---------- Avisos flotantes y confirmación ---------- */
  var zonaAvisos = h('div', { class: 'avisos-flotantes', 'aria-live': 'polite', role: 'status' });
  function avisar(titulo, texto) {
    var el = h('div', { class: 'flotante' }, svg(SVG_VISTO_CLARO), h('div', null, h('b', null, titulo), texto ? h('span', null, texto) : null));
    zonaAvisos.append(el);
    setTimeout(function () { el.remove(); }, 5200);
  }
  var dialogo = h('dialog', { class: 'confirmar', 'aria-labelledby': 'confirmar-titulo' });
  function confirmar(op) {
    dialogo.replaceChildren(h('form', { method: 'dialog', class: 'confirmar-dentro', onsubmit: function (e) { e.preventDefault(); } },
      h('h2', { id: 'confirmar-titulo' }, op.titulo),
      op.intro ? h('p', null, op.intro) : null,
      op.vista ? h('div', { class: 'vista-previa' }, op.vista) : null,
      h('p', { class: 'con-insignia suave' }, svg(SVG_VISTO), 'Demo: no se envía nada de verdad.'),
      h('div', { class: 'acciones' },
        boton(op.boton, function () { cerrarDialogo(); op.alAceptar(); }, { id: 'confirmar-si' }),
        boton(op.cancelar || 'Seguir revisando', cerrarDialogo, { cls: 'boton-borde' }))));
    if (typeof dialogo.showModal === 'function') dialogo.showModal(); else dialogo.setAttribute('open', '');
    var si = document.getElementById('confirmar-si'); if (si) si.focus();
  }
  function cerrarDialogo() { if (typeof dialogo.close === 'function' && dialogo.open) dialogo.close(); else dialogo.removeAttribute('open'); }

  /* ---------- Rutas ---------- */
  function ruta() {
    var hs = decodeURIComponent((location.hash || '').slice(1));
    if (!hs || hs === 'acceso') return { rol: null };
    var i = hs.indexOf('-');
    var rol = i < 0 ? hs : hs.slice(0, i);
    var vista = i < 0 ? 'inicio' : hs.slice(i + 1);
    if (!D.roles[rol]) return { rol: null };
    if (vista !== 'inicio' && vista !== 'correo' && !modulo(rol, vista)) vista = 'inicio';
    return { rol: rol, vista: vista };
  }
  function modulo(rol, id) { return (D.roles[rol].modulos || []).filter(function (m) { return m.id === id; })[0]; }
  function enlace(rol, vista) { return '#' + rol + (vista && vista !== 'inicio' ? '-' + vista : ''); }
  function ir(rol, vista) {
    var destino = rol ? enlace(rol, vista) : '#acceso';
    if (location.hash === destino) pintar(false); else location.hash = destino;
  }
  function irA(rol, destino) {
    if (!destino) return;
    if (destino === 'correo') { S.leyendo[rol] = false; guardar(); ir(rol, 'correo'); return; }
    if (destino.indexOf('correo:') === 0) { S.sel[rol] = destino.slice(7); S.leyendo[rol] = true; guardar(); ir(rol, 'correo'); return; }
    ir(rol, destino);
  }

  /* ---------- Pintado ---------- */
  var raiz = document.getElementById('demo');
  var ultimaRuta = '';
  function pintar(nuevaVista) {
    var r = ruta();
    var clave = r.rol ? r.rol + '/' + r.vista : 'acceso';
    var cambia = nuevaVista !== false && clave !== ultimaRuta;
    var focoK = !cambia && document.activeElement && document.activeElement.getAttribute('data-k');
    var y = window.scrollY;
    raiz.replaceChildren(r.rol ? vistaApp(r.rol, r.vista) : vistaAcceso());
    ultimaRuta = clave;
    document.title = r.rol ? 'Demo de DirectorIA · ' + D.roles[r.rol].persona.cargo : 'Demo de DirectorIA';
    if (cambia) {
      window.scrollTo(0, 0);
      var f = raiz.querySelector('[data-foco]');
      if (f) f.focus({ preventScroll: true });
    } else {
      window.scrollTo(0, y);
      if (focoK) { var el = raiz.querySelector('[data-k="' + focoK + '"]'); if (el) el.focus({ preventScroll: true }); }
    }
  }
  function repintar() { guardar(); pintar(false); }

  /* ---------- Acceso ---------- */
  var RECORRIDO = [
    { rol: 'jefatura', vista: 'guardias', t: 'Falta un profesor', d: 'Jefatura de estudios confirma quién cubre cada hora.' },
    { rol: 'sustituto', vista: 'ficha', t: 'La ficha de quien sustituye', d: 'Solo lo necesario, y solo para quien entra al aula.' },
    { rol: 'direccion', vista: 'inicio', t: 'El resumen de las 8:00', d: 'La directora lo ve todo de un vistazo y responde a inspección.' },
    { rol: 'docente', vista: 'dictado', t: 'Un correo dictado', d: 'La tutora dicta; el correo llega redactado para revisar.' },
    { rol: 'orientacion', vista: 'acoso', t: 'Un protocolo, con reserva', d: 'Paso a paso, con fechas, responsables y documentos.' },
    { rol: 'secretaria', vista: 'gastos', t: 'El analista de gastos', d: 'Renovaciones, ahorros y papeles listos para firmar.' },
  ];
  function vistaAcceso() {
    var arriba = h('header', { class: 'acceso-banda acceso-arriba marco' },
      h('div', { class: 'logo', html: D.logoNegativo, role: 'img', 'aria-label': 'DirectorIA' }),
      h('div', null,
        h('h1', null, 'Vuestra IA, dentro del colegio'),
        h('p', { class: 'lema' }, 'Así se trabaja con DirectorIA en un colegio de ejemplo. Elige un cargo y verás su panel.')));
    var banda = h('aside', { class: 'acceso-banda acceso-abajo marco', 'aria-label': 'Recorrido de la demo' },
      h('div', { class: 'recorrido' },
        h('h2', null, 'Recorrido para enseñarla'),
        h('ol', null, RECORRIDO.filter(function (p) { return D.roles[p.rol]; }).map(function (p) {
          var destino = p.vista === 'inicio' || modulo(p.rol, p.vista) ? p.vista : 'inicio';
          return h('li', null, h('button', { type: 'button', onclick: function () { ir(p.rol, destino); } },
            h('div', null, h('b', null, p.t), h('span', null, D.roles[p.rol].persona.cargo + ' · ' + p.d))));
        }))),
      h('div', { class: 'acceso-pie' },
        h('p', { class: 'lema-corto' }, 'La IA propone. Vosotros decidís.'),
        h('p', null, 'Demo con datos ficticios. Nada se envía ni se guarda fuera de esta página.'),
        boton('Reiniciar la demo', reiniciar, { cls: 'boton-borde boton-pequeno' })));

    var lista = h('ul', { class: 'perfiles' }, PERFILES.map(function (p) {
      var cargo = p.persona.cargo;
      return h('li', null, h('button', { class: 'perfil', type: 'button', 'aria-label': 'Entrar como ' + p.persona.nombre + ', ' + cargo, onclick: function () { ir(p.id, 'inicio'); } },
        ilus(p.persona.ilustracion, null, ''),
        h('span', { class: 'cargo' }, cargo),
        h('span', { class: 'quien' }, p.persona.nombre + ' · ' + p.persona.detalle),
        h('span', { class: 'que' }, p.acceso),
        h('span', { class: 'entrar', 'aria-hidden': 'true' }, 'Entrar en su panel')));
    }));

    return h('div', { class: 'acceso', lang: 'es' }, arriba,
      h('main', { class: 'acceso-perfiles marco' },
        h('div', { class: 'cabeza' },
          h('span', { class: 'chip-demo' }, 'Colegio Ejemplo · miércoles 18 de noviembre · 8:00'),
          h('h2', { 'data-foco': '', tabindex: '-1' }, '¿Con qué perfil entras?'),
          h('p', { class: 'entradilla' }, 'Cada cargo tiene su resumen del día, su correo con respuestas propuestas y sus propias funciones. En el colegio, cada persona entra con su cuenta y solo ve lo suyo.')),
        lista,
        h('p', { class: 'acceso-nota' }, 'Todos los nombres y datos son inventados. DirectorIA trata los datos de los alumnos en un servidor dentro del colegio; aquí, todo ocurre en esta página.')),
      banda);
  }
  function reiniciar() {
    S = estadoInicial(); guardar();
    avisar('Demo reiniciada', 'Todo vuelve a como estaba a las 8:00.');
    ir(null);
  }

  /* ---------- App ---------- */
  function pendientes(rol) {
    var est = S.correo[rol] || {};
    return (D.roles[rol].correo || []).filter(function (c) { return !est[c.id] && (c.respuestas || []).length; }).length;
  }
  function vistaApp(rol, vista) {
    var p = D.roles[rol];
    var cab = h('header', { class: 'cabecera marco' },
      h('button', { class: 'logo-boton', type: 'button', 'aria-label': 'Volver a elegir perfil', onclick: function () { ir(null); } }, h('span', { class: 'logo', html: D.logo })),
      h('span', { class: 'colegio' }, 'Colegio Ejemplo'),
      h('span', { class: 'relleno' }),
      h('span', { class: 'chip-hora' }, 'Miércoles 18 nov · ' + horaActual()),
      h('span', { class: 'chip-servidor', title: 'La IA trata los datos de los alumnos en el servidor del colegio' }, ilus('servidor', null, ''), h('span', { class: 'largo' }, 'En el servidor del colegio')),
      h('div', { class: 'usuario' }, ilus(p.persona.ilustracion, null, ''), h('div', null, h('p', { class: 'nombre' }, p.persona.nombre), h('p', { class: 'cargo' }, p.persona.cargo))),
      boton('Cambiar de perfil', function () { ir(null); }, { cls: 'boton-borde boton-pequeno' }));

    var n = pendientes(rol);
    var items = [{ id: 'inicio', t: 'Inicio' }, { id: 'correo', t: 'Correo', c: n }].concat((p.modulos || []).map(function (m) { return { id: m.id, t: m.menu }; }));
    var menu = h('aside', { class: 'menu' },
      h('nav', { 'aria-label': 'Secciones de ' + p.persona.cargo }, h('ul', null, items.map(function (it, i) {
        var li = h('li', null, h('a', { href: enlace(rol, it.id), 'aria-current': it.id === vista ? 'page' : null, onclick: it.id === 'correo' ? function () { S.leyendo[rol] = false; guardar(); } : null },
          h('span', null, it.t), it.c ? h('span', { class: 'contador', 'aria-label': it.c + ' por responder' }, String(it.c)) : null));
        return i === 2 ? [h('li', { class: 'grupo', 'aria-hidden': 'true' }, 'Tus funciones'), li] : li;
      }))),
      h('div', { class: 'menu-pie' }, h('p', { class: 'lema-corto' }, 'La IA propone. Tú decides.'), h('p', null, 'Demo con datos ficticios.'), h('button', { class: 'enlace', type: 'button', onclick: reiniciar }, 'Reiniciar la demo')));

    var contenido;
    if (vista === 'inicio') contenido = vistaInicio(rol);
    else if (vista === 'correo') contenido = vistaCorreo(rol);
    else contenido = vistaModulo(rol, modulo(rol, vista));

    return h('div', { class: 'app', lang: 'es' }, cab, h('div', { class: 'cuerpo' }, menu, h('main', { class: 'principal marco', id: 'contenido' }, h('div', { class: 'principal-dentro' }, contenido))));
  }

  function cabezaVista(antetitulo, titulo, entradilla, extra) {
    return h('div', { class: 'cabeza-vista' },
      antetitulo ? h('p', { class: 'antetitulo' }, antetitulo) : null,
      h('h1', { class: 'titulo-vista', 'data-foco': '', tabindex: '-1' }, titulo),
      entradilla ? h('p', { class: 'entradilla' }, entradilla) : null,
      extra || null);
  }

  /* ---------- Inicio ---------- */
  function vistaInicio(rol) {
    var ini = D.roles[rol].inicio;
    return [
      cabezaVista(ini.antetitulo, ini.titulo, ini.entradilla, h('p', { style: 'margin-top:.875rem' }, sinInsignia('Preparado por DirectorIA en el servidor del colegio'))),
      h('div', { class: 'bloques' }, ini.bloques.map(function (b) {
        return h('section', { class: 'tarjeta' }, h('h2', { style: 'margin-bottom:.75rem' }, b.titulo), h('ul', { class: 'items' }, b.items.map(function (it) {
          var activo = it.bandera && S.banderas[it.bandera];
          var estado = activo ? it.estadoSi : it.estado;
          var texto = activo ? it.textoSi : it.texto;
          return h('li', { class: 'item' }, pastilla(estado), h('span', { class: 'texto' }, texto),
            it.ir ? h('button', { class: 'enlace ir', type: 'button', onclick: function () { irA(rol, it.ir); } }, etiquetaIr(rol, it.ir)) : null);
        })));
      })),
    ];
  }
  function etiquetaIr(rol, destino) {
    if (destino === 'correo') return 'Abrir el correo';
    if (destino.indexOf('correo:') === 0) return 'Leer el correo';
    var m = modulo(rol, destino);
    return m ? 'Abrir ' + minuscula(m.menu) : 'Abrir';
  }

  /* ---------- Correo ---------- */
  function vistaCorreo(rol) {
    var p = D.roles[rol];
    var lista = p.correo || [];
    var est = S.correo[rol] || {};
    var sel = S.sel[rol] && lista.some(function (c) { return c.id === S.sel[rol]; }) ? S.sel[rol] : (lista[0] && lista[0].id);
    var actual = lista.filter(function (c) { return c.id === sel; })[0];
    var n = pendientes(rol);

    var bandeja = h('section', { class: 'bandeja', 'aria-label': 'Bandeja de entrada' },
      h('div', { class: 'bandeja-cabeza' }, h('h2', null, 'Bandeja de entrada'), h('span', { class: 'con-insignia suave' }, insignia(), 'Resumida con IA')),
      h('ul', null, lista.map(function (c) {
        var e = est[c.id];
        return h('li', null, h('button', {
          type: 'button', class: 'mensaje' + (e ? ' hecho' : ''), 'aria-current': c.id === sel ? 'true' : 'false', 'data-k': 'msg-' + c.id,
          onclick: function () { S.sel[rol] = c.id; S.leyendo[rol] = true; repintar(); var l = raiz.querySelector('.lectura h2'); if (l && window.matchMedia('(max-width: 900px)').matches) l.focus(); },
        },
          h('span', { class: 'fila1' }, h('span', { class: 'de' }, c.de), h('span', { class: 'hora' }, c.hora)),
          h('span', { class: 'asunto' }, c.asunto),
          h('span', { class: 'extracto' }, (c.resumen || [])[0] || ''),
          h('span', { class: 'fila3' },
            e && e.estado === 'enviado' ? pastilla('hecho', 'Respondido ' + e.hora) : e && e.estado === 'archivado' ? pastilla('hecho', 'Archivado') : pastilla(c.etiqueta.tipo, c.etiqueta.texto),
            h('span', { class: 'pastilla p-info' }, c.categoria))));
      })));

    var cabeza = cabezaVista('Correo', 'Tu correo, resumido', n ? 'Tienes ' + n + (n === 1 ? ' correo' : ' correos') + ' con una respuesta propuesta. Revísala, cámbiala si hace falta y envíala tú: nada sale sin que lo envíes.' : 'Has respondido todo lo que pedía respuesta. Lo que queda es para leer.');
    return [cabeza, h('div', { class: 'correo' + (S.leyendo[rol] ? ' leyendo' : '') }, bandeja, actual ? lectura(rol, actual) : h('p', null, 'No hay correos.'))];
  }

  function lectura(rol, c) {
    var p = D.roles[rol];
    var e = (S.correo[rol] || {})[c.id];
    var claveB = rol + ':' + c.id;
    var b = S.borrador[claveB] || (S.borrador[claveB] = { opcion: (c.respuestas || []).length ? 0 : -1, texto: (c.respuestas && c.respuestas[0]) ? c.respuestas[0].texto : '' });
    var m = c.ir ? modulo(rol, c.ir) : null;

    var partes = [
      h('button', { class: 'boton boton-borde boton-pequeno volver', type: 'button', onclick: function () { S.leyendo[rol] = false; repintar(); } }, 'Volver a la bandeja'),
      h('div', { class: 'lectura-cabeza' },
        h('div', { class: 'chips' }, pastilla(c.etiqueta.tipo, c.etiqueta.texto), h('span', { class: 'pastilla p-info' }, c.categoria)),
        h('h2', { tabindex: '-1' }, c.asunto),
        h('p', { class: 'quien' }, h('b', null, c.de), c.deDetalle ? ' · ' + c.deDetalle : '', ' · ', c.hora),
        (c.adjuntos || []).length ? h('div', { class: 'adjuntos' }, c.adjuntos.map(function (a) { return h('span', { class: 'adjunto' }, a); })) : null),
      h('section', { class: 'tarjeta resumen-ia', 'aria-label': 'Resumen' },
        conInsignia('Resumen de la IA'),
        h('ul', null, (c.resumen || []).map(function (s) { return h('li', null, s); })),
        c.piden ? h('p', { class: 'piden' }, h('b', null, 'Qué te piden'), c.piden) : null),
    ];
    if (c.nota) partes.push(h('div', { class: 'nota-ia' }, h('div', null, h('p', null, c.nota), m ? h('button', { class: 'enlace', type: 'button', style: 'margin-top:.375rem', onclick: function () { ir(rol, m.id); } }, 'Abrir ' + minuscula(m.menu)) : null)));
    else if (m) partes.push(h('div', null, h('button', { class: 'enlace', type: 'button', onclick: function () { ir(rol, m.id); } }, 'Abrir ' + minuscula(m.menu))));
    partes.push(h('details', { class: 'original' }, h('summary', null, 'Ver el correo original'), h('div', { class: 'texto-original' }, parrafos(c.original))));

    if (e && e.estado === 'enviado') {
      partes.push(h('section', { class: 'tarjeta enviado' },
        h('p', { class: 'sello' }, visto(), 'Respondido a las ' + e.hora + ' desde tu cuenta del colegio'),
        h('div', { class: 'cuerpo-enviado' }, parrafos(e.texto))));
    } else if (e && e.estado === 'archivado') {
      partes.push(h('p', { class: 'sello' }, visto(), 'Archivado a las ' + e.hora + '.'));
    } else if ((c.respuestas || []).length) {
      var area = h('textarea', { id: 'resp-' + c.id, 'data-k': 'area-' + c.id, 'aria-label': 'Texto de la respuesta', oninput: function (ev) { b.texto = ev.target.value; guardar(); } });
      area.value = b.texto;
      var opciones = h('div', { class: 'opciones', role: 'radiogroup', 'aria-label': 'Respuestas propuestas' }, c.respuestas.map(function (r, i) {
        return h('label', { class: 'opcion' },
          h('input', { type: 'radio', name: 'op-' + c.id, checked: b.opcion === i, 'data-k': 'op-' + c.id + '-' + i, onchange: function () { b.opcion = i; b.texto = r.texto; repintar(); } }),
          h('span', { class: 't' }, r.titulo),
          h('span', { class: 'pre' }, r.texto.replace(/\s+/g, ' ')));
      }));
      partes.push(h('section', { class: 'tarjeta' },
        h('div', { class: 'tarjeta-cabeza' }, h('h3', null, 'Respuestas propuestas'), conInsignia('Preparadas con IA', true)),
        h('p', { style: 'font-size:var(--t-s)' }, 'Elige una y cámbiala lo que quieras. Nada se envía hasta que pulses Enviar.'),
        opciones,
        h('div', { class: 'editor' },
          h('p', { class: 'linea-campo' }, h('b', null, 'Para'), h('span', null, c.de + (c.deDetalle ? ' (' + c.deDetalle + ')' : ''))),
          h('p', { class: 'linea-campo' }, h('b', null, 'Asunto'), h('span', null, 'Re: ' + c.asunto)),
          h('label', { class: 'sr', for: 'resp-' + c.id }, 'Texto de la respuesta'),
          area,
          h('div', { class: 'acciones' },
            boton('Revisar y enviar', function () {
              var texto = (S.borrador[claveB].texto || '').trim();
              if (!texto) { avisar('La respuesta está vacía', 'Elige una respuesta propuesta o escribe la tuya.'); return; }
              confirmar({
                titulo: '¿Enviar esta respuesta?',
                vista: [h('p', null, h('b', null, 'Para: '), c.de), h('p', null, h('b', null, 'Asunto: '), 'Re: ' + c.asunto), parrafos(texto)],
                boton: 'Enviar desde mi cuenta del colegio',
                alAceptar: function () {
                  var hora = ahora();
                  bolsa('correo', rol)[c.id] = { estado: 'enviado', hora: hora, texto: texto };
                  repintar();
                  avisar('Respuesta enviada', 'Ha salido desde tu cuenta del colegio. (En la demo no se envía nada.)');
                },
              });
            }, { 'data-k': 'enviar-' + c.id }),
            boton('Archivar sin responder', function () { bolsa('correo', rol)[c.id] = { estado: 'archivado', hora: ahora() }; repintar(); avisar('Archivado', c.asunto); }, { cls: 'boton-borde' })))));
    } else {
      partes.push(h('div', { class: 'acciones' }, boton('Archivar', function () { bolsa('correo', rol)[c.id] = { estado: 'archivado', hora: ahora() }; repintar(); avisar('Archivado', c.asunto); }, { cls: 'boton-borde', 'data-k': 'archivar-' + c.id })));
    }
    return h('article', { class: 'lectura', 'aria-label': c.asunto }, partes);
  }

  /* ---------- Módulos ---------- */
  function vistaModulo(rol, m) {
    var fn = MODULOS[m.tipo];
    var cuerpo = fn ? fn(rol, m) : h('p', null, 'Esta función todavía no está en la demo.');
    return [cabezaVista(m.antetitulo, m.titulo, m.entradilla), m.confidencial ? bandaConfidencial(m.confidencial) : null].concat(cuerpo);
  }
  function bandaConfidencial(texto) { return h('div', { class: 'confidencial' }, ilus('candado', null, ''), h('span', null, texto)); }
  function selloHecho(texto) { return h('p', { class: 'sello' }, visto(), texto); }
  function personaDe(rol) { return D.roles[rol].persona; }

  var MODULOS = {};

  MODULOS.aprobaciones = function (rol, m) {
    var est = bolsa('aprob', rol, m.id);
    var hechos = m.items.filter(function (it) { return est[it.id] && est[it.id].hecho; }).length;
    var todos = hechos === m.items.length;
    function confirmarUno(it) {
      var e = est[it.id] || (est[it.id] = {});
      e.hecho = true; e.hora = ahora(); e.quien = e.quien || it.propuesta;
      comprobarTodo();
    }
    function comprobarTodo() {
      var ya = m.items.every(function (it) { return est[it.id] && est[it.id].hecho; });
      if (ya && m.bandera) S.banderas[m.bandera] = true;
      repintar();
      if (ya) avisar('Todo confirmado', m.alConfirmar);
    }
    var cab = [];
    if (m.contexto) cab.push(h('section', { class: 'tarjeta contexto' }, ilus('sustituto', null, ''), h('div', null, h('b', null, m.contexto.titulo), h('p', null, m.contexto.texto))));
    cab.push(h('div', { class: 'tarjeta-cabeza' },
      h('p', null, esIA(m) ? conInsignia('Propuesta de la IA · ' + hechos + ' de ' + m.items.length + ' confirmadas', true) : sinInsignia('Propuesta de DirectorIA, con las reglas del colegio · ' + hechos + ' de ' + m.items.length + ' confirmadas')),
      todos ? pastilla('hecho', 'Todo confirmado') : boton(m.botonTodo, function () { m.items.forEach(function (it) { var e = est[it.id] || (est[it.id] = {}); if (!e.hecho) { e.hecho = true; e.hora = ahora(); e.quien = e.quien || it.propuesta; } }); comprobarTodo(); }, { 'data-k': 'todo-' + m.id })));
    var lista = h('ul', { class: 'propuestas' }, m.items.map(function (it) {
      var e = est[it.id] || {};
      var elegido = e.quien || it.propuesta;
      var opciones = [it.propuesta].concat(it.alternativas || []);
      var sel = h('select', { id: 'sel-' + m.id + '-' + it.id, 'data-k': 'sel-' + it.id, disabled: e.hecho ? true : null, onchange: function (ev) { (est[it.id] || (est[it.id] = {})).quien = ev.target.value; repintar(); } },
        opciones.map(function (o) { return h('option', { value: o, selected: o === elegido ? true : null }, o + (o === it.propuesta ? ' (propuesta)' : '')); }));
      return h('li', { class: 'propuesta' + (e.hecho ? ' hecha' : '') },
        h('div', { class: 'cuando' }, it.cuando, h('small', null, it.que)),
        h('div', { class: 'quien' }, h('label', { for: 'sel-' + m.id + '-' + it.id, class: 'sr' }, 'Quién cubre ' + it.cuando), sel),
        h('p', { class: 'motivo' }, esIA(m) ? insignia() : null, elegido === it.propuesta ? it.motivo : 'Has elegido a otra persona. DirectorIA lo tendrá en cuenta para repartir las próximas guardias.'),
        h('div', { class: 'lado' },
          e.hecho ? pastilla('hecho', 'Confirmado ' + e.hora) : boton(m.boton, function () { confirmarUno(it); }, { cls: 'boton-pequeno', 'data-k': 'ok-' + it.id }),
          e.hecho && it.ficha ? h('span', { class: 'pastilla p-info' }, 'Ficha enviada a ' + elegido) : null));
    }));
    return cab.concat([lista, todos ? h('div', { class: 'aviso ok' }, visto(), h('p', null, m.alConfirmar)) : h('p', { class: 'nota-ia' }, 'Nada cambia hasta que confirmes. Puedes elegir a otra persona en cada sesión.')]);
  };

  function bloquesDoc(bloques) {
    var out = [];
    var campos = null;
    bloques.forEach(function (b) {
      if (b.tipo === 'campo') {
        if (!campos) { campos = h('dl', null); out.push(campos); }
        campos.append(h('div', { class: 'campo' }, h('dt', null, b.etiqueta), h('dd', null, b.texto)));
        return;
      }
      campos = null;
      if (b.tipo === 'titulo') out.push(h('h3', null, b.texto));
      else if (b.tipo === 'parrafo') out.push.apply(out, parrafos(b.texto));
      else if (b.tipo === 'lista') out.push(h('ul', null, b.items.map(function (x) { return h('li', null, x); })));
      else if (b.tipo === 'aviso') out.push(h('div', { class: 'aviso' }, h('p', null, b.texto)));
    });
    return out;
  }

  MODULOS.documento = function (rol, m) {
    var est = bolsa('docs', rol, m.id);
    est.checks = est.checks || [];
    var listo = m.comprobaciones.every(function (_, i) { return est.checks[i]; });
    var persona = personaDe(rol);
    var cuerpo = [];
    if (m.documentos) cuerpo.push(h('section', { class: 'tarjeta' },
      h('div', { class: 'tarjeta-cabeza' }, h('h2', null, 'Lo que ha reunido DirectorIA'), sinInsignia('Buscado en el archivo del colegio')),
      h('ul', { class: 'piezas' }, m.documentos.map(function (d) {
        return h('li', { class: 'pieza' + (d.estado === 'falta' ? ' falta' : '') }, h('span', { class: 'n' }, d.nombre), d.detalle ? h('span', { class: 'd' }, d.detalle) : null, pastilla(d.estado));
      }))));
    var doc = h('article', { class: 'papel-doc', 'aria-label': m.documento.titulo, 'data-k': 'doc-' + m.id, contenteditable: est.editando && !est.hecho ? 'true' : null },
      h('div', { class: 'doc-cabeza' }, h('h2', { class: 'doc-titulo' }, m.documento.titulo), m.documento.subtitulo ? h('p', { class: 'doc-sub' }, m.documento.subtitulo) : null),
      bloquesDoc(m.documento.bloques),
      est.hecho ? selloHecho('Revisado por ' + persona.nombre + ', ' + minuscula(persona.cargo) + ', hoy a las ' + est.hora) : null);
    var lateral = h('div', { class: 'lateral' },
      h('section', { class: 'tarjeta' }, h('h2', null, esIA(m) ? 'Lo ha rellenado la IA' : 'Lo ha preparado DirectorIA'), h('p', { style: 'font-size:var(--t-s);margin-top:.25rem' }, m.origen), esIA(m) ? h('ul', { class: 'lista-ia' }, m.rellenado.map(function (x) { return h('li', null, insignia(), h('span', null, x)); })) : h('ul', { class: 'lista-puntos', style: 'margin-top:.625rem' }, m.rellenado.map(function (x) { return h('li', null, x); }))),
      h('section', { class: 'tarjeta' }, h('h2', null, 'Antes de terminar, comprueba'),
        h('div', { style: 'margin-top:.5rem' }, m.comprobaciones.map(function (x, i) {
          return h('label', { class: 'campo-casilla' }, h('input', { type: 'checkbox', checked: !!est.checks[i] || est.hecho, disabled: est.hecho ? true : null, 'data-k': 'chk-' + m.id + '-' + i, onchange: function (ev) { est.checks[i] = ev.target.checked; repintar(); } }), h('span', null, x));
        })),
        est.hecho ? h('div', { style: 'margin-top:.75rem' }, h('p', { class: 'sello' }, visto(), m.alTerminar)) : h('div', { class: 'acciones', style: 'margin-top:.875rem' },
          boton(m.boton, function () { est.hecho = true; est.hora = ahora(); est.editando = false; repintar(); avisar(m.boton, m.alTerminar); }, { disabled: listo ? null : true, 'aria-disabled': listo ? null : 'true', 'data-k': 'fin-' + m.id }),
          boton(est.editando ? 'Dejar de editar' : 'Editar el texto', function () { est.editando = !est.editando; repintar(); }, { cls: 'boton-borde boton-pequeno', 'data-k': 'editar-' + m.id })),
        !listo && !est.hecho ? h('p', { style: 'font-size:var(--t-s);margin-top:.5rem' }, 'Marca las comprobaciones para poder terminar.') : null));
    cuerpo.push(h('div', { class: 'dos-columnas' }, doc, lateral));
    return cuerpo;
  };

  MODULOS.plazos = function (rol, m) {
    var est = bolsa('plazos', rol, m.id);
    return h('ul', { class: 'plazos' }, m.items.map(function (it, i) {
      var hecho = it.estado === 'hecho' || est[i];
      return h('li', { class: 'plazo' + (hecho ? ' hecho' : '') },
        h('span', { class: 'fecha' }, it.fecha),
        h('div', null, h('p', { class: 't' }, it.titulo), h('p', { class: 'd' }, it.detalle),
          h('p', { class: 'meta' }, h('span', null, 'Quién: ' + it.quien), it.origen ? (esIA(m) && /circular|correo|carta/i.test(it.origen) ? h('span', { class: 'con-insignia suave', style: 'font-size:var(--t-xs)' }, insignia(), 'Sacado con IA de: ' + it.origen) : h('span', null, 'De: ' + it.origen)) : null)),
        h('div', { class: 'lado' }, pastilla(hecho ? 'hecho' : it.estado),
          !hecho ? h('button', { class: 'enlace', type: 'button', style: 'font-size:var(--t-s)', 'data-k': 'plazo-' + m.id + '-' + i, onclick: function () { est[i] = true; repintar(); avisar('Marcado como hecho', it.titulo); } }, 'Marcar como hecho') : null));
    }));
  };

  MODULOS.protocolo = function (rol, m) {
    var pasos = h('section', { class: 'tarjeta' }, h('h2', { style: 'margin-bottom:.75rem' }, 'Pasos del protocolo'),
      h('ol', { class: 'pasos' }, m.pasos.map(function (p, i) {
        return h('li', { class: 'paso ' + p.estado },
          h('span', { class: 'punto', 'aria-hidden': 'true', html: p.estado === 'hecho' ? SVG_VISTO.replace('class="visto"', 'class="visto" style="width:1.75rem;height:1.75rem"') : '' }, p.estado === 'hecho' ? null : String(i + 1)),
          h('span', { class: 'n' }, p.nombre),
          h('span', { class: 'e' }, ({ hecho: 'Hecho', curso: 'En curso', pendiente: 'Pendiente', condicional: 'Solo si se confirma' })[p.estado] + (p.nota ? ' · ' + p.nota : '')));
      })));
    var actual = h('div', { style: 'display:grid;gap:1rem' },
      h('section', { class: 'tarjeta' },
        h('div', { class: 'tarjeta-cabeza' }, h('h2', null, m.actual.titulo), pastilla('pendiente', 'En curso')),
        h('p', { style: 'font-size:var(--t-s);margin-bottom:1rem' }, m.caso),
        h('div', { class: 'secciones' }, m.actual.secciones.map(function (s) { return h('div', null, h('h4', null, s.titulo), h('ul', { class: 'lista-puntos' }, s.items.map(function (x) { return h('li', null, x); }))); }))),
      h('section', { class: 'tarjeta' },
        h('div', { class: 'tarjeta-cabeza' }, h('h2', null, 'Documentos preparados'), sinInsignia('Con las plantillas del protocolo')),
        h('ul', { class: 'piezas' }, m.documentos.map(function (d) { return h('li', { class: 'pieza' }, h('span', { class: 'n' }, d.nombre), h('span', { class: 'pastilla p-info' }, d.estado)); }))),
      h('p', { class: 'nota-ia' }, m.pie));
    return h('div', { class: 'protocolo' }, pasos, actual);
  };

  MODULOS.banco = function (rol, m) {
    var est = bolsa('banco', rol, m.id);
    var tab = est.tab || 'buscar';
    var tabs = [['buscar', 'Buscar'], ['subir', 'Compartir un recurso'], ['impacto', 'Lo que han servido los tuyos']];
    var cab = h('div', { class: 'pestanas', role: 'group', 'aria-label': 'Banco de recursos' }, tabs.map(function (t) {
      return h('button', { class: 'pestana', type: 'button', 'aria-pressed': tab === t[0] ? 'true' : 'false', 'data-k': 'tab-' + t[0], onclick: function () { est.tab = t[0]; repintar(); } }, t[1]);
    }));
    var cuerpo;
    if (tab === 'buscar') {
      var entrada = h('input', { type: 'search', id: 'buscar-' + m.id, 'aria-label': 'Qué buscas', value: est.consulta || m.consulta, 'data-k': 'consulta', oninput: function (ev) { est.consulta = ev.target.value; guardar(); } });
      var res = m.resultados.map(function (r, i) {
        return h('li', { class: 'resultado' + (i === 0 ? ' primero' : '') },
          h('div', null, h('p', { class: 't' }, r.titulo), h('p', { class: 'm' }, r.meta)),
          h('div', { class: 'lado' }, h('span', { class: 'cerca' }, r.cercania),
            r.adaptar ? boton([insignia(), r.adaptar.boton], function () { est.adaptado = true; repintar(); var a = raiz.querySelector('.adaptado'); if (a) a.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, { cls: 'boton-pequeno', 'data-k': 'adaptar' }) : null));
      });
      var adaptar = m.resultados.filter(function (r) { return r.adaptar; })[0];
      cuerpo = [
        h('form', { class: 'buscador', role: 'search', onsubmit: function (ev) { ev.preventDefault(); est.buscado = true; repintar(); avisar('Búsqueda hecha', 'Ordenada por lo que más se parece a lo que pides.'); } },
          h('label', { class: 'sr', for: 'buscar-' + m.id }, 'Qué buscas'), entrada, h('button', { class: 'boton', type: 'submit' }, 'Buscar')),
        h('div', { class: 'chips' }, h('span', { class: 'con-insignia' }, insignia(), 'Entendido como'), m.entendido.map(function (c) { return h('span', { class: 'chip' }, c); })),
        h('div', { class: 'aviso' }, h('p', null, m.aviso)),
        h('ul', { class: 'resultados' }, res),
        est.adaptado && adaptar ? h('section', { class: 'tarjeta adaptado' },
          h('div', { class: 'tarjeta-cabeza' }, h('h2', null, adaptar.adaptar.titulo), conInsignia('Preparado con IA · pendiente de revisar', true)),
          h('ol', null, adaptar.adaptar.texto.map(function (x) { return h('li', null, x); })),
          h('p', { class: 'nota-ia' }, insignia(), adaptar.adaptar.nota),
          est.guardado ? selloHecho('Guardada en tus recursos como borrador, enlazada al original.') : h('div', { class: 'acciones' },
            boton('Guardar como borrador', function () { est.guardado = true; repintar(); avisar('Guardada como borrador', 'La revisas antes de usarla. Queda enlazada al recurso original.'); }, { 'data-k': 'guardar-adaptado' }),
            boton('Descartar', function () { est.adaptado = false; repintar(); }, { cls: 'boton-borde' }))) : null,
      ];
    } else if (tab === 'subir') {
      var s = m.subir;
      est.cursos = est.cursos || s.curso.slice();
      est.materias = est.materias || s.materia.slice();
      est.cas = est.cas || [];
      var CURSOS = ['1.º de Primaria', '2.º de Primaria', '3.º de Primaria', '4.º de Primaria', '5.º de Primaria', '6.º de Primaria'];
      var MATERIAS = ['Educación Física', 'Ciencias de la Naturaleza', 'Lengua Castellana', 'Matemáticas', 'Inglés', 'Música'];
      s.curso.forEach(function (c) { if (CURSOS.indexOf(c) < 0) CURSOS.push(c); });
      s.materia.forEach(function (c) { if (MATERIAS.indexOf(c) < 0) MATERIAS.push(c); });
      var listoSubir = est.cursos.length && est.materias.length && s.casillas.every(function (_, i) { return est.cas[i]; });
      function conmutar(lista, v) { var i = lista.indexOf(v); if (i < 0) lista.push(v); else lista.splice(i, 1); repintar(); }
      cuerpo = h('form', { class: 'tarjeta formulario', onsubmit: function (ev) { ev.preventDefault(); if (!listoSubir) return; est.compartido = true; repintar(); avisar('Recurso compartido', 'Ya está en el banco del claustro, con tu nombre.'); } },
        h('div', { class: 'campo-f' }, h('label', { class: 'etq', for: 'titulo-recurso' }, 'Título'), h('input', { type: 'text', id: 'titulo-recurso', value: est.titulo || s.titulo, 'data-k': 'titulo-recurso', oninput: function (ev) { est.titulo = ev.target.value; guardar(); } }), h('span', { class: 'con-insignia suave' }, insignia(), 'Lo propone la IA leyendo el archivo. Puedes cambiarlo.')),
        h('fieldset', { class: 'campo-f', style: 'border:0;margin:0;padding:0 0 .875rem' }, h('legend', { class: 'etq' }, 'Curso ', h('b', null, '· obligatorio')), h('div', { class: 'chips' }, CURSOS.map(function (c) { return h('button', { type: 'button', class: 'chip-boton', 'aria-pressed': est.cursos.indexOf(c) >= 0 ? 'true' : 'false', 'data-k': 'curso-' + c, onclick: function () { conmutar(est.cursos, c); } }, c); }))),
        h('fieldset', { class: 'campo-f', style: 'border:0;margin:0;padding:0 0 .875rem' }, h('legend', { class: 'etq' }, 'Materia ', h('b', null, '· obligatoria')), h('div', { class: 'chips' }, MATERIAS.map(function (c) { return h('button', { type: 'button', class: 'chip-boton', 'aria-pressed': est.materias.indexOf(c) >= 0 ? 'true' : 'false', 'data-k': 'materia-' + c, onclick: function () { conmutar(est.materias, c); } }, c); }))),
        h('div', { class: 'campo-f' }, h('span', { class: 'etq' }, 'Contenidos del currículo'), h('div', { class: 'chips' }, s.contenidos.map(function (c) { return h('span', { class: 'chip' }, c); }), h('span', { class: 'con-insignia suave' }, insignia(), 'sugeridos por la IA'))),
        h('fieldset', { style: 'border:0;margin:0;padding:0' }, h('legend', { class: 'etq' }, 'Antes de compartir, confirma'), s.casillas.map(function (x, i) {
          return h('label', { class: 'campo-casilla' }, h('input', { type: 'checkbox', checked: !!est.cas[i], 'data-k': 'cas-' + i, onchange: function (ev) { est.cas[i] = ev.target.checked; repintar(); } }), h('span', null, x));
        })),
        est.compartido ? selloHecho('Compartido con el claustro. Tu nombre queda como autora.') : h('div', { class: 'acciones' }, h('button', { class: 'boton', type: 'submit', disabled: listoSubir ? null : true, 'data-k': 'compartir' }, 'Compartir con el claustro'), !listoSubir ? h('span', { class: 'ayuda' }, 'El curso y la materia son obligatorios, y hay que marcar las tres casillas.') : null));
    } else {
      var im = m.impacto;
      var nums = (im.meta.match(/(\d+)\s+de\s+(\d+)/) || []);
      var pct = nums[1] && nums[2] ? Math.round(100 * nums[1] / nums[2]) : 50;
      cuerpo = h('div', { class: 'impacto' },
        h('span', { class: 'chip-demo' }, 'Solo lo ves tú'),
        h('section', { class: 'tarjeta' }, h('p', { style: 'color:var(--tinta);font-size:var(--t-l)' }, im.texto), h('div', { class: 'insignias', style: 'margin-top:.875rem' }, im.insignias.map(function (x) { return h('span', { class: 'insignia-logro' }, x); }))),
        h('section', { class: 'tarjeta' }, h('h2', { style: 'margin-bottom:.5rem' }, 'Meta del ciclo'), h('p', { style: 'color:var(--tinta);margin-bottom:.625rem' }, im.meta), h('div', { class: 'barra', role: 'img', 'aria-label': im.meta }, h('span', { style: 'width:' + pct + '%' })), h('p', { style: 'font-size:var(--t-s);margin-top:.5rem' }, 'Una meta de equipo, sin clasificaciones entre compañeros.')),
        h('p', { class: 'nota-oscura' }, 'Estos datos nunca sirven para evaluar a nadie.'));
    }
    return [cab].concat(cuerpo);
  };

  MODULOS.dictado = function (rol, m) {
    var est = bolsa('dictado', rol, m.id);
    var fase = est.fase || 'inicio';
    var persona = personaDe(rol);
    var partes = [h('section', { class: 'tarjeta dictado-panel' },
      h('p', { class: 'linea-campo', style: 'color:var(--tinta)' }, h('b', null, 'Para: '), m.para),
      h('div', { class: 'microfono' }, ilus('microfono', null, ''),
        fase === 'inicio' ? boton('Empezar a dictar', function () { est.fase = 'escuchando'; repintar(); escribir(); }, { 'data-k': 'dictar' }) : null,
        fase === 'escuchando' ? h('span', { class: 'escuchando', role: 'status' }, h('i', { 'aria-hidden': 'true' }), 'Escuchando…') : null,
        fase === 'dictado' ? boton([insignia(), 'Redactar el correo'], function () { est.fase = 'borrador'; est.texto = est.texto || m.borrador; repintar(); }, { 'data-k': 'redactar' }) : null,
        fase !== 'inicio' && fase !== 'enviado' ? boton('Volver a empezar', function () { est.fase = 'inicio'; est.texto = ''; repintar(); }, { cls: 'boton-borde boton-pequeno' }) : null),
      h('div', { class: 'transcripcion' + (fase === 'inicio' ? ' vacia' : ''), id: 'transcripcion', 'aria-live': 'polite' }, fase === 'inicio' ? 'Pulsa «Empezar a dictar» y habla como lo harías con un compañero. En la demo, el dictado es un ejemplo.' : (fase === 'escuchando' ? '' : m.transcripcion)))];
    if (fase === 'borrador' || fase === 'enviado') {
      if (fase === 'enviado') partes.push(h('section', { class: 'tarjeta enviado' }, h('p', { class: 'sello' }, visto(), 'Enviado a las ' + est.hora + ' desde tu cuenta del colegio'), h('div', { class: 'cuerpo-enviado' }, parrafos(est.texto))));
      else {
        var area = h('textarea', { class: 'area', id: 'borrador-' + m.id, 'data-k': 'borrador', 'aria-label': 'Borrador del correo', oninput: function (ev) { est.texto = ev.target.value; guardar(); } });
        area.value = est.texto;
        partes.push(h('section', { class: 'tarjeta' },
          h('div', { class: 'tarjeta-cabeza' }, h('h2', null, 'El correo, redactado'), conInsignia('Preparado con IA · revísalo', true)),
          h('ul', { class: 'lista-ia', style: 'margin-bottom:1rem' }, m.notas.map(function (x) { return h('li', null, insignia(), h('span', null, x)); })),
          h('div', { class: 'editor' },
            h('p', { class: 'linea-campo' }, h('b', null, 'Para'), h('span', null, m.para)),
            h('p', { class: 'linea-campo' }, h('b', null, 'Asunto'), h('span', null, m.asunto)),
            area,
            h('div', { class: 'acciones' }, boton('Revisar y enviar', function () {
              confirmar({ titulo: '¿Enviar este correo?', vista: [h('p', null, h('b', null, 'Para: '), m.para), h('p', null, h('b', null, 'Asunto: '), m.asunto), parrafos(est.texto)], boton: 'Enviar desde mi cuenta del colegio', alAceptar: function () { est.fase = 'enviado'; est.hora = ahora(); repintar(); avisar('Correo enviado', 'Lo has revisado y enviado tú. (En la demo no se envía nada.)'); } });
            }, { 'data-k': 'enviar-dictado' }), h('span', { class: 'ayuda' }, 'Nunca sale sin que lo revises.')))));
      }
    }
    function escribir() {
      var zona = document.getElementById('transcripcion');
      var palabras = m.transcripcion.split(/\s+/);
      var reducido = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!zona || reducido) { est.fase = 'dictado'; repintar(); return; }
      var i = 0;
      var t = setInterval(function () {
        var z = document.getElementById('transcripcion');
        if (!z || est.fase !== 'escuchando') { clearInterval(t); return; }
        i += 2; z.textContent = palabras.slice(0, i).join(' ');
        if (i >= palabras.length) { clearInterval(t); est.fase = 'dictado'; setTimeout(repintar, 350); }
      }, 90);
    }
    return partes;
  };

  MODULOS.material = function (rol, m) {
    var est = bolsa('material', rol, m.id);
    var area = h('textarea', { class: 'area', id: 'peticion-' + m.id, style: 'min-height:6rem', 'data-k': 'peticion', 'aria-label': 'Qué necesitas', oninput: function (ev) { est.peticion = ev.target.value; est.bloqueado = false; guardar(); } });
    area.value = est.peticion !== undefined ? est.peticion : m.peticion;
    var partes = [
      h('div', { class: 'nube' }, ilus('nube-claude', null, ''), h('div', null, h('p', { style: 'color:var(--tinta);font-weight:700' }, 'Módulo opcional con Claude, en la nube'), h('p', { style: 'font-size:var(--t-s)' }, m.aviso))),
      h('section', { class: 'tarjeta' },
        h('h2', { style: 'margin-bottom:.5rem' }, h('label', { for: 'peticion-' + m.id }, 'Qué necesitas')), area,
        est.bloqueado ? h('div', { class: 'bloqueo', role: 'alert', style: 'margin-top:.75rem' }, ilus('candado', null, ''), h('div', null, h('p', { style: 'font-weight:700' }, 'El filtro ha parado la petición'), h('p', null, m.bloqueo.mensaje))) : null,
        h('div', { class: 'acciones', style: 'margin-top:.875rem' },
          boton('Pedir a Claude', function () {
            var t = (est.peticion !== undefined ? est.peticion : m.peticion);
            if (t === m.bloqueo.intento) { est.bloqueado = true; repintar(); return; }
            est.respuesta = true; est.bloqueado = false; repintar();
          }, { 'data-k': 'pedir' }),
          boton('Probar el filtro con un nombre', function () { est.peticion = m.bloqueo.intento; est.bloqueado = true; est.respuesta = false; repintar(); }, { cls: 'boton-borde', 'data-k': 'probar-filtro' }),
          est.bloqueado ? boton('Volver a la petición sin nombres', function () { est.peticion = m.peticion; est.bloqueado = false; repintar(); }, { cls: 'boton-borde boton-pequeno' }) : null)),
    ];
    if (est.respuesta) partes.push(h('article', { class: 'papel-doc', 'aria-label': m.respuesta.titulo },
      h('div', { class: 'doc-cabeza' }, h('h2', { class: 'doc-titulo' }, m.respuesta.titulo), h('p', { class: 'doc-sub' }, 'Preparado con Claude a partir de tu petición, sin datos de alumnos. Revísalo antes de usarlo.')),
      bloquesDoc(m.respuesta.bloques),
      est.guardado ? selloHecho('Guardado en tus recursos como borrador.') : h('div', { class: 'acciones' }, boton('Guardar como borrador', function () { est.guardado = true; repintar(); avisar('Guardado', 'Lo revisas y, si quieres, lo compartes en el banco.'); }, { 'data-k': 'guardar-material' }))));
    return partes;
  };

  MODULOS.traduccion = function (rol, m) {
    var est = bolsa('trad', rol, m.id);
    est.checks = est.checks || [];
    var tab = est.tab === undefined ? 1 : est.tab;
    var versiones = [{ idioma: 'Original', texto: m.original.texto, titulo: m.original.titulo }].concat(m.versiones);
    var listo = m.comprobaciones.every(function (_, i) { return est.checks[i]; });
    var pest = h('div', { class: 'pestanas', role: 'group', 'aria-label': 'Versiones' }, versiones.map(function (v, i) {
      return h('button', { class: 'pestana', type: 'button', 'aria-pressed': tab === i ? 'true' : 'false', 'data-k': 'ver-' + i, onclick: function () { est.tab = i; repintar(); } }, v.idioma);
    }));
    var v = versiones[tab];
    var doc = h('article', { class: 'papel-doc version' + (/f[aá]cil/i.test(v.idioma) ? ' facil' : ''), lang: /ingl/i.test(v.idioma) ? 'en' : 'es' },
      h('div', { class: 'doc-cabeza' }, h('h2', { class: 'doc-titulo' }, m.original.titulo), h('p', { class: 'doc-sub' }, (tab === 0 ? 'Circular original' : 'Versión preparada con IA: ' + minuscula(v.idioma)) + ' · para la ' + minuscula(m.para))),
      parrafos(v.texto));
    var lateral = h('div', { class: 'lateral' },
      h('section', { class: 'tarjeta' }, h('h2', null, 'Antes de enviar, comprueba'),
        h('div', { style: 'margin-top:.5rem' }, m.comprobaciones.map(function (x, i) {
          return h('label', { class: 'campo-casilla' }, h('input', { type: 'checkbox', checked: !!est.checks[i] || est.hecho, disabled: est.hecho ? true : null, 'data-k': 'tchk-' + i, onchange: function (ev) { est.checks[i] = ev.target.checked; repintar(); } }), h('span', null, x));
        })),
        est.hecho ? h('div', { style: 'margin-top:.75rem' }, selloHecho(m.alTerminar)) : h('div', { class: 'acciones', style: 'margin-top:.875rem' }, boton(m.boton, function () {
          confirmar({ titulo: '¿Enviarlo a la ' + minuscula(m.para) + '?', intro: 'Se envía desde la cuenta del colegio con las versiones que has revisado.', boton: m.boton, alAceptar: function () { est.hecho = true; est.hora = ahora(); repintar(); avisar('Enviado', m.alTerminar); } });
        }, { disabled: listo ? null : true, 'data-k': 'enviar-trad' }))));
    return [h('p', { class: 'con-insignia' }, insignia(), 'Para: ' + m.para), pest, h('div', { class: 'dos-columnas' }, doc, lateral)];
  };

  MODULOS.ficha = function (rol, m) {
    if (m.bandera && !S.banderas[m.bandera] && !S.previa[rol + ':' + m.id]) {
      var j = D.roles.jefatura;
      var mod = j && (j.modulos || []).filter(function (x) { return x.tipo === 'aprobaciones'; })[0];
      return h('section', { class: 'tarjeta espera' }, ilus('reloj', null, ''), h('div', null,
        h('h2', null, 'Jefatura todavía no ha confirmado las guardias de hoy'),
        h('p', null, 'Tu ficha aparece aquí en cuanto jefatura de estudios confirma quién cubre cada sesión. Así nadie recibe una ficha que luego cambia.'),
        h('div', { class: 'acciones' },
          mod ? boton('Ir a jefatura para confirmarlas', function () { ir('jefatura', mod.id); }, { 'data-k': 'ir-jefatura' }) : null,
          boton('Ver la ficha igualmente', function () { S.previa[rol + ':' + m.id] = true; repintar(); }, { cls: 'boton-borde' }))));
    }
    var partes = [h('div', { class: 'fichas' }, m.fichas.map(function (f) {
      return h('article', { class: 'ficha', 'aria-label': 'Ficha de ' + f.sesion },
        h('div', { class: 'ficha-cabeza' }, h('p', { class: 'ficha-sesion' }, f.sesion), h('p', { class: 'ficha-hora' }, f.hora), h('p', { class: 'ficha-origen' }, esIA(m) ? insignia() : null, f.origen)),
        h('dl', { class: 'ficha-datos' }, f.datos.map(function (d) { return h('div', { class: d.aviso ? 'ficha-aviso' : null }, h('dt', null, d.dt), h('dd', null, d.dd)); })),
        h('p', { class: 'ficha-pie' }, f.pie));
    }))];
    if (m.registro) {
      /* Quien recibe la ficha (módulo con bandera) deja su propia entrada en el registro, con la hora de la demo. */
      var lineas = m.registro;
      if (m.bandera) {
        var acceso = bolsa('fichas', rol, m.id);
        if (!acceso.hora) { acceso.hora = ahora(); acceso.previa = !S.banderas[m.bandera]; guardar(); }
        var quien = (D.roles[rol] && D.roles[rol].persona) ? D.roles[rol].persona.nombre : 'ti';
        lineas = [(acceso.previa ? 'Vista previa abierta por ' : 'Abierta por ') + quien + ' hoy a las ' + acceso.hora].concat(m.registro);
      }
      partes.push(h('section', { class: 'tarjeta' }, h('h2', { style: 'margin-bottom:.5rem' }, 'Registro de accesos'), h('ul', { class: 'lista-puntos' }, lineas.map(function (x) { return h('li', null, x); }))));
    }
    if (m.bandera && !S.banderas[m.bandera]) partes.unshift(h('div', { class: 'aviso' }, h('p', null, 'Vista previa: jefatura todavía no ha confirmado las guardias de hoy.')));
    return partes;
  };

  MODULOS.tabla = function (rol, m) {
    var est = bolsa('tablas', rol, m.id);
    var marcas = {};
    (m.marcas || []).forEach(function (x) { marcas[x.fila + ':' + x.columna] = x.tipo; });
    var tabla = h('div', { class: 'tabla-caja', role: 'region', 'aria-label': m.titulo, tabindex: '0' }, h('table', null,
      h('thead', null, h('tr', null, m.columnas.map(function (c) { return h('th', { scope: 'col' }, c); }))),
      h('tbody', null, m.filas.map(function (f, i) {
        return h('tr', null, f.map(function (c, j) {
          var t = marcas[i + ':' + j];
          var celda = h(j === 0 ? 'th' : 'td', j === 0 ? { scope: 'row', style: 'text-transform:none;letter-spacing:0;font-size:var(--t-s);color:var(--tinta);background:transparent;white-space:normal' } : { class: t ? 'm-' + t : null });
          if (t === 'aviso') celda.append(h('span', { class: 'marca-celda', 'aria-label': 'Aviso' }, '!'));
          if (t === 'ok') celda.append(visto());
          celda.append(document.createTextNode(' ' + c));
          return celda;
        }));
      }))));
    var avisos = h('ul', { class: 'lista-avisos' }, m.avisos.map(function (a) {
      return h('li', { class: 'aviso' + (a.estado === 'aviso' ? '' : ' ' + a.estado) }, a.estado === 'ok' ? visto() : a.estado === 'aviso' ? h('span', { class: 'marca-celda', 'aria-hidden': 'true' }, '!') : (esIA(m) ? insignia() : null), h('p', null, a.texto));
    }));
    var partes = [avisos, tabla];
    if (m.boton) partes.push(est.hecho ? selloHecho(m.alTerminar + ' (' + personaDe(rol).nombre + ', hoy a las ' + est.hora + ')') :
      h('div', { class: 'acciones' }, boton(m.boton, function () { est.hecho = true; est.hora = ahora(); repintar(); avisar(m.boton, m.alTerminar); }, { 'data-k': 'tabla-' + m.id }), h('span', { class: 'ayuda' }, 'Es una propuesta: decides tú.')));
    return partes;
  };

  MODULOS.informe = function (rol, m) {
    var est = bolsa('informe', rol, m.id);
    var partes = [
      h('div', { class: 'cifras' }, m.cifras.map(function (c) { return h('div', { class: 'cifra-tarjeta' }, h('span', { class: 'v' }, c.valor), h('span', { class: 't' }, c.texto)); })),
      h('section', null, h('h2', { style: 'font-size:var(--t-l);margin-bottom:.75rem' }, 'Avisos y dónde ahorrar'),
        h('ul', { class: 'avisos-informe' }, m.avisos.map(function (a) { return h('li', { class: 'aviso-informe' }, pastilla(a.estado), h('p', { class: 't' }, a.titulo), h('p', { class: 'd' }, a.detalle)); }))),
    ];
    if (m.filas) partes.push(h('section', null, h('h2', { style: 'font-size:var(--t-l);margin-bottom:.75rem' }, 'Gasto del mes por partidas'),
      h('div', { class: 'tabla-caja', role: 'region', 'aria-label': 'Gasto por partidas', tabindex: '0' }, h('table', null,
        h('thead', null, h('tr', null, h('th', { scope: 'col' }, 'Partida'), h('th', { scope: 'col' }, 'Proveedor'), h('th', { scope: 'col', class: 'importe' }, 'Importe'), h('th', { scope: 'col' }, 'Nota'))),
        h('tbody', null, m.filas.map(function (f) { return h('tr', null, h('td', null, f.partida), h('td', null, f.proveedor), h('td', { class: 'importe' }, f.importe), h('td', null, f.nota || '')); }))))));
    partes.push(h('p', { class: 'nota-ia' }, esIA(m) ? insignia() : null, m.pie));
    partes.push(est.hecho ? selloHecho('Informe enviado a dirección y a la titularidad a las ' + est.hora + '.') : h('div', { class: 'acciones' }, boton('Enviar el informe a dirección', function () {
      confirmar({ titulo: '¿Enviar el informe a dirección y a la titularidad?', intro: 'Va con las cifras agregadas y los avisos. Las decisiones de compra y contratación son suyas.', boton: 'Enviar el informe', alAceptar: function () { est.hecho = true; est.hora = ahora(); repintar(); avisar('Informe enviado', 'Dirección y titularidad lo tienen en su panel.'); } });
    }, { 'data-k': 'enviar-informe' })));
    return partes;
  };

  /* ---------- Arranque ---------- */
  document.body.append(zonaAvisos, dialogo);
  window.addEventListener('hashchange', function () { pintar(); });
  pintar();
})();
