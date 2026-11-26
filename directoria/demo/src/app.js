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
    return { reloj: 0, banderas: {}, correo: {}, sel: {}, leyendo: {}, borrador: {}, aprob: {}, docs: {}, plazos: {}, tablas: {}, banco: {}, dictado: {}, material: {}, trad: {}, informe: {}, fichas: {} };
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
  // Cada estado lleva su glifo además del texto, nunca solo el color: ✓ hecho, «…» pendiente, banderín plazo, reloj hoy,
  // triángulo aviso, «i» para saber. Los estados van en los colores de la marca, no en los de las categorías (app.css).
  var GLIFO_ESTADO = { pendiente: 'espera', curso: 'espera', revisar: 'espera', plazo: 'plazo', pronto: 'plazo', despues: 'plazo', hoy: 'reloj', aviso: 'aviso', falta: 'aviso', info: 'info' };
  function pastilla(estado, texto) {
    var el = h('span', { class: 'pastilla p-' + estado });
    if (estado === 'hecho' || estado === 'ok') el.append(visto());
    else if (GLIFO_ESTADO[estado]) el.append(glifo(GLIFO_ESTADO[estado]));
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
    el.creado = Date.now();
    zonaAvisos.append(el);
    setTimeout(function () { el.remove(); }, 5200);
  }
  // Al cambiar de pantalla, los avisos de la anterior se van: si no, «Todo confirmado» tapa la fila que acaba de cambiar.
  // Se queda el que acaba de salir (menos de medio segundo), como «Demo reiniciada», que se lanza justo antes de cambiar.
  function quitarAvisos() {
    var ya = Date.now();
    Array.prototype.slice.call(zonaAvisos.children).forEach(function (el) { if (ya - (el.creado || 0) > 500) el.remove(); });
  }
  var dialogo = h('dialog', { class: 'confirmar', 'aria-labelledby': 'confirmar-titulo' });
  function confirmar(op) {
    dialogo.replaceChildren(h('form', { method: 'dialog', class: 'confirmar-dentro', onsubmit: function (e) { e.preventDefault(); } },
      h('h2', { id: 'confirmar-titulo', tabindex: '-1' }, op.titulo),
      op.intro ? h('p', null, op.intro) : null,
      op.vista ? h('div', { class: 'vista-previa' }, op.vista) : null,
      op.sinNotaDemo ? null : h('p', { class: 'con-insignia suave' }, svg(SVG_VISTO), 'Demo: no se envía nada de verdad.'),
      h('div', { class: 'acciones' },
        boton(op.boton, function () { cerrarDialogo(); op.alAceptar(); }, { id: 'confirmar-si' }),
        boton(op.cancelar || 'Seguir revisando', cerrarDialogo, { cls: 'boton-borde' }))));
    if (typeof dialogo.showModal === 'function') dialogo.showModal(); else dialogo.setAttribute('open', '');
    // El foco va al título, no al botón: un Intro por inercia no envía nada y el lector de pantalla empieza por lo que se va a enviar.
    var tt = document.getElementById('confirmar-titulo'); if (tt) tt.focus();
  }
  function cerrarDialogo() { if (typeof dialogo.close === 'function' && dialogo.open) dialogo.close(); else dialogo.removeAttribute('open'); }

  /* ---------- Globo: el detalle de cada marca de un gráfico, al pasar el ratón o al llevar el foco ----------
     Solo amplía lo que ya se lee en la marca: nunca es la única forma de ver un dato.
     Se abre siempre debajo de la marca; en la última columna de una rejilla, a su izquierda. Va en coordenadas
     de la página, dentro de la región principal: al desplazar la página se mueve con la marca y no se cierra.
     Si con el teclado queda por debajo de la pantalla, la página baja lo justo para verlo. Se cierra con Escape,
     y se puede pasar el ratón por encima sin que desaparezca (WCAG 1.4.13). Con el ratón sale tras una espera corta,
     para no tapar lo que se iba a pulsar al cruzar una marca; con el foco, sin espera.
     El globo que se ve va oculto para el lector de pantalla: cada marca lleva su propia descripción (conGlobo),
     así nunca se oye la de otra marca que se abrió antes. */
  var globo = h('div', { class: 'globo', id: 'globo', 'aria-hidden': 'true', hidden: true });
  var globoEspera = null, globoAncla = null, globoN = 0, globoRaton = null;
  // Con el ratón, el globo espera un momento: al cruzar una marca de camino a otra cosa (el atajo de la demo, la acción
  // de una cifra) no sale ni tapa lo que se iba a pulsar. Si ya hay uno abierto, el de al lado sale sin esperar.
  var ESPERA_RATON = 300;
  function lineaGlobo(t, i) { return h(i ? 'span' : 'b', null, t); }
  function mostrarGlobo(el, lineas, lado) {
    clearTimeout(globoEspera);
    globoAncla = el;
    globo.replaceChildren.apply(globo, lineas.map(lineaGlobo));
    globo.hidden = false;
    var r = el.getBoundingClientRect(), g = globo.getBoundingClientRect(), m = 8;
    var ancho = document.documentElement.clientWidth;
    var x = Math.min(Math.max(m, r.left + r.width / 2 - g.width / 2), ancho - g.width - m), y = r.bottom + m;
    if (lado && r.left - g.width - m >= m) {
      var cab = document.querySelector('.cabecera');
      x = r.left - g.width - m;
      y = Math.max(r.top, (cab ? cab.getBoundingClientRect().bottom : 0) + m);
    }
    globo.style.left = Math.round(x + window.scrollX) + 'px';
    globo.style.top = Math.round(y + window.scrollY) + 'px';
    if (!el.matches(':focus-visible')) return;
    requestAnimationFrame(function () {
      if (globo.hidden || globoAncla !== el) return;
      var falta = globo.getBoundingClientRect().bottom + m - window.innerHeight;
      if (falta > 0) window.scrollBy(0, Math.ceil(falta));
    });
  }
  function ocultarGlobo() { clearTimeout(globoEspera); clearTimeout(globoRaton); globo.hidden = true; globoAncla = null; }
  // Al dejar una marca con el ratón: si otra tiene el foco del teclado, vuelve su globo; si no, se cierra.
  function soltarGlobo() {
    clearTimeout(globoRaton);
    clearTimeout(globoEspera);
    globoEspera = setTimeout(function () {
      var f = document.activeElement;
      if (f && f.globoDatos && (!f.globoDatos[2] || f.matches(':focus-visible'))) mostrarGlobo(f, f.globoDatos[0], f.globoDatos[1]); else ocultarGlobo();
    }, 160);
  }
  // describir: lo que dice el globo, menos su primera línea (la hora o la cifra, que ya están en el nombre), es la
  // descripción del elemento (solo en lo que recibe el foco). Va en un texto oculto propio, en una sola frase.
  // lado: se abre a un lado y no debajo (la última columna de una rejilla).
  // disparadores: con el ratón, el globo sale al pasar por estas piezas de la marca y no por toda ella; con el foco, solo
  // con el del teclado. Es lo de las cifras: su globo es largo (las piezas del dosier, los pasos del caso) y, si saliera
  // al cruzar la tarjeta camino de su acción o de la rejilla de debajo, la taparía. Sale al detenerse en la cifra o en
  // su medidor, que es lo que el globo detalla; lo mismo está en su módulo y en la descripción accesible.
  function conGlobo(el, lineas, describir, lado, disparadores) {
    var desc = describir ? frases(lineas.slice(1)) : '';
    if (desc) {
      var id = 'globo-desc-' + (++globoN);
      el.append(h('span', { id: id, hidden: true }, desc));
      el.setAttribute('aria-describedby', id);
    }
    var soloTeclado = !!disparadores;
    el.globoDatos = [lineas, lado, soloTeclado];
    [].concat(disparadores || el).filter(Boolean).forEach(function (d) {
      d.addEventListener('pointerenter', function (e) {
        if (e.pointerType === 'touch') return;
        clearTimeout(globoRaton);
        if (!globo.hidden && globoAncla !== el) { mostrarGlobo(el, lineas, lado); return; }
        clearTimeout(globoEspera);
        globoRaton = setTimeout(function () { if (el.isConnected) mostrarGlobo(el, lineas, lado); }, ESPERA_RATON);
      });
      d.addEventListener('pointerleave', soltarGlobo);
    });
    el.addEventListener('focus', function () { if (!soloTeclado || el.matches(':focus-visible')) mostrarGlobo(el, lineas, lado); });
    el.addEventListener('blur', function () { if (globoAncla === el) ocultarGlobo(); });
    return el;
  }
  globo.addEventListener('pointerenter', function () { clearTimeout(globoEspera); });
  globo.addEventListener('pointerleave', soltarGlobo);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') ocultarGlobo(); });
  // Solo se cierra si cambia el ancho (al girar la pantalla): en el móvil, la barra del navegador cambia el alto al desplazar.
  var anchoVentana = window.innerWidth;
  window.addEventListener('resize', function () { if (window.innerWidth !== anchoVentana) { anchoVentana = window.innerWidth; ocultarGlobo(); } });

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
    ocultarGlobo();
    raiz.replaceChildren(vistaSegura(r));
    // El globo va dentro de la región principal (main), con el resto del contenido.
    (raiz.querySelector('main') || document.body).append(globo);
    vigilarPanel();
    // En el móvil el menú es una fila que se desplaza de lado: deja a la vista el apartado en el que estás.
    var act = raiz.querySelector('.menu nav a[aria-current="page"]');
    var barra = act && act.closest('nav');
    if (barra && barra.scrollWidth > barra.clientWidth) barra.scrollLeft += act.getBoundingClientRect().left - barra.getBoundingClientRect().left - 16;
    ultimaRuta = clave;
    document.title = r.rol ? 'Demo de DirectorIA · ' + D.roles[r.rol].persona.cargo : 'Demo de DirectorIA';
    if (cambia) {
      quitarAvisos();
      window.scrollTo(0, 0);
      var f = raiz.querySelector('[data-foco]');
      if (f) f.focus({ preventScroll: true });
    } else {
      window.scrollTo(0, y);
      if (focoK) { var el = raiz.querySelector('[data-k="' + focoK + '"]'); if (el) el.focus({ preventScroll: true }); }
    }
  }
  function repintar() { guardar(); pintar(false); }
  // Si una pantalla no se puede pintar (por un dato que falta, por ejemplo), la demo no se queda en blanco:
  // sale un aviso con «Reiniciar la demo». El error sigue apareciendo en la consola, y probar.mjs lo detecta.
  function vistaSegura(r) {
    try { return r.rol ? vistaApp(r.rol, r.vista) : vistaAcceso(); }
    catch (e) {
      if (window.console) console.error(e);
      return h('main', { class: 'fallo marco', id: 'contenido', lang: 'es' },
        h('h1', { class: 'titulo-vista', 'data-foco': '', tabindex: '-1' }, 'Esta pantalla no se ha podido pintar'),
        h('p', { class: 'entradilla' }, 'Reinicia la demo para volver a como estaba a las 8:00, o elige otro perfil.'),
        h('div', { class: 'acciones' }, boton('Reiniciar la demo', reiniciar), boton('Elegir otro perfil', function () { ir(null); }, { cls: 'boton-borde' })));
    }
  }

  /* ---------- Acceso ---------- */
  var RECORRIDO = [
    { rol: 'jefatura', vista: 'guardias', t: 'Falta un profesor', d: 'Revisa quién cubre cada hora y lo confirma.' },
    { rol: 'sustituto', vista: 'ficha', t: 'La ficha de quien sustituye', d: 'Solo lo necesario, y solo para quien entra al aula.' },
    { rol: 'direccion', vista: 'inicio', t: 'El resumen de las 8:00', d: 'Ve quién falta, qué vence y qué correos importan, y responde a inspección.' },
    { rol: 'docente', vista: 'dictado', t: 'Un correo dictado', d: 'La tutora dicta; el correo llega redactado para revisar.' },
    { rol: 'orientacion', vista: 'acoso', t: 'Un protocolo, con reserva', d: 'Paso a paso, con fechas, responsables y documentos.' },
    { rol: 'secretaria', vista: 'gastos', t: 'El analista de gastos', d: 'Facturas y contratos revisados, con avisos de renovaciones y ahorros.' },
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
          return h('li', null, h('button', { type: 'button', 'data-perfil': p.rol, onclick: function () { ir(p.rol, destino); } },
            h('div', null, h('b', null, p.t), h('span', null, D.roles[p.rol].persona.cargo + ' · ' + p.d))));
        }))),
      h('div', { class: 'acceso-pie' },
        h('p', { class: 'lema-corto' }, 'DirectorIA propone. Vosotros decidís.'),
        h('p', null, 'Demo con datos ficticios. Nada se envía ni se guarda fuera de esta página.'),
        boton('Reiniciar la demo', reiniciar, { cls: 'boton-borde boton-pequeno' })));

    var lista = h('ul', { class: 'perfiles' }, PERFILES.map(function (p) {
      var cargo = p.persona.cargo;
      return h('li', null, h('button', { class: 'perfil', type: 'button', 'data-perfil': p.id, 'aria-label': 'Entrar como ' + p.persona.nombre + ', ' + cargo, onclick: function () { ir(p.id, 'inicio'); } },
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
    confirmar({
      titulo: '¿Reiniciar la demo?',
      intro: 'Todo vuelve a como estaba a las 8:00: las guardias, los correos enviados, los documentos y los plazos.',
      boton: 'Reiniciar la demo', cancelar: 'Seguir con la demo', sinNotaDemo: true,
      alAceptar: function () {
        S = estadoInicial(); guardar();
        avisar('Demo reiniciada', 'Todo vuelve a como estaba a las 8:00.');
        ir(null);
      },
    });
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
      // En un móvil estrecho (360 px) el botón dice «Cambiar», en una línea; su nombre sigue siendo «Cambiar de perfil».
      boton([h('span', { class: 'cambiar-largo' }, 'Cambiar de perfil'), h('span', { class: 'cambiar-corto' }, 'Cambiar')], function () { ir(null); }, { cls: 'boton-borde boton-pequeno boton-cambiar', 'aria-label': 'Cambiar de perfil' }));

    var n = pendientes(rol);
    // Cada función lleva el punto de color de su tipo de trabajo (data-cat); el Inicio y el correo, sin tono.
    var items = [{ id: 'inicio', t: 'Inicio' }, { id: 'correo', t: 'Correo', c: n, cat: 'comunicacion' }].concat((p.modulos || []).map(function (m) { return { id: m.id, t: m.menu, cat: categoriaModulo(m) }; }));
    var menu = h('aside', { class: 'menu' },
      h('nav', { 'aria-label': 'Secciones de ' + p.persona.cargo, onfocusin: verEnlaceMenu }, h('ul', null, items.map(function (it, i) {
        var li = h('li', null, h('a', { href: enlace(rol, it.id), 'aria-current': it.id === vista ? 'page' : null, 'data-cat': it.cat || null, onclick: it.id === 'correo' ? function () { S.leyendo[rol] = false; guardar(); } : null },
          h('span', null, it.t), it.c ? h('span', { class: 'contador', 'aria-label': it.c + ' por responder' }, String(it.c)) : null));
        return i === 2 ? [h('li', { class: 'grupo', 'aria-hidden': 'true' }, 'Tus funciones'), li] : li;
      }))),
      h('div', { class: 'menu-pie' }, h('p', { class: 'lema-corto' }, 'DirectorIA propone. Tú decides.'), h('p', null, 'Demo con datos ficticios.'), h('button', { class: 'enlace', type: 'button', onclick: reiniciar }, 'Reiniciar la demo')));

    var contenido;
    if (vista === 'inicio') contenido = vistaInicio(rol);
    else if (vista === 'correo') contenido = vistaCorreo(rol);
    else contenido = vistaModulo(rol, modulo(rol, vista));

    var esPanel = vista === 'inicio' && p.inicio && p.inicio.cifras;
    // El tono de la función abierta (correo o módulo): lo toman el icono de la cabecera y los acentos de sus tarjetas.
    var catVista = vista === 'correo' ? 'comunicacion' : vista !== 'inicio' ? categoriaModulo(modulo(rol, vista)) : null;
    return h('div', { class: 'app', lang: 'es' }, cab, h('div', { class: 'cuerpo' }, menu, h('main', { class: 'principal marco' + (esPanel ? ' principal-inicio' : ''), id: 'contenido', 'data-cat': catVista || null }, h('div', { class: 'principal-dentro' }, contenido))));
  }

  // Con el menú en una fila que se desplaza de lado (hasta 1279 px y en el móvil), el enlace que recibe el foco entra
  // entero en la barra, con su anillo: el navegador solo lo asoma.
  function verEnlaceMenu(e) {
    var nav = e.currentTarget, a = e.target;
    if (!a || a.tagName !== 'A') return;
    requestAnimationFrame(function () {
      if (nav.scrollWidth <= nav.clientWidth) return;
      var nr = nav.getBoundingClientRect(), ar = a.getBoundingClientRect(), m = 8;
      if (ar.left < nr.left + m) nav.scrollLeft -= nr.left + m - ar.left;
      else if (ar.right > nr.right - m) nav.scrollLeft += ar.right - (nr.right - m);
    });
  }

  function cabezaVista(antetitulo, titulo, entradilla, extra) {
    return h('div', { class: 'cabeza-vista' },
      antetitulo ? h('p', { class: 'antetitulo' }, antetitulo) : null,
      h('h1', { class: 'titulo-vista', 'data-foco': '', tabindex: '-1' }, titulo),
      entradilla ? h('p', { class: 'entradilla' }, entradilla) : null,
      extra || null);
  }
  // La cabecera de una función lleva delante del título el icono de color de su tipo de trabajo (decorativo).
  function conIcono(cab, nombre) {
    if (!nombre) return cab;
    cab.classList.add('con-icono');
    cab.insertBefore(icono(nombre), cab.querySelector('.titulo-vista'));
    return cab;
  }

  /* ---------- Inicio ----------
     Dos formatos, según los datos del perfil:
     - el panel de mando (inicio.cifras): la cabecera con la persona, las cifras que llevan a donde se actúa,
       el día por sesiones, lo que te necesita y lo que viene. Sale de reglas, de los datos del perfil y del estado
       de la demo; la insignia de la IA solo va en lo que ha escrito un modelo de lenguaje: los resúmenes de correo
       y los plazos sacados de un correo o de una circular;
     - el de bloques (inicio.bloques): tarjetas con una pastilla de estado por línea. */
  function vistaInicio(rol) {
    var p = D.roles[rol], ini = p.inicio;
    if (ini.cifras) return [cabezaInicio(p, ini), panelInicio(rol, ini)];
    var cabeza = cabezaVista(ini.antetitulo, ini.titulo, ini.entradilla, h('p', { class: 'origen-inicio' }, sinInsignia('Preparado por DirectorIA en el servidor del colegio')));
    return [
      cabeza,
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

  // La cabecera del panel: el saludo, con una sola línea de entradilla, y a la derecha la ilustración de la persona.
  // «Preparado por DirectorIA en el servidor del colegio» va en el antetítulo y sin insignia: el panel sale de reglas.
  function cabezaInicio(p, ini) {
    // En un móvil estrecho (360 px), la fecha corta: «Mié 18 nov · Tu resumen de las 8:00».
    var ante = String(ini.antetitulo), larga = mayuscula(fechaLarga(HOY)), d = fecha(HOY);
    var corta = ante.indexOf(larga) === 0 ? mayuscula(DIA_CORTO[d.getUTCDay()]) + ' ' + d.getUTCDate() + ' ' + MES_CORTO[d.getUTCMonth()] + ante.slice(larga.length) : ante;
    // El «·» se queda al final de la línea, no al principio de la siguiente (también el de «Preparado por…»).
    var conPunto = function (t) { return t.replace(/ · /g, '\u00a0· '); };
    return juntarOrdinales(h('div', { class: 'cabeza-inicio' },
      h('div', { class: 'cabeza-inicio-texto' },
        h('p', { class: 'antetitulo' }, sr(frases([ini.antetitulo, 'Preparado por DirectorIA en el servidor del colegio'])),
          oculto(h('span', { class: corta !== ante ? 'ante-largo' : null }, conPunto(ante))),
          corta !== ante ? oculto(h('span', { class: 'ante-corto' }, conPunto(corta))) : null,
          oculto(h('span', { class: 'origen' }, h('span', { class: 'sep' }, '\u00a0· '), 'Preparado por DirectorIA en el servidor del colegio'))),
        h('h1', { class: 'titulo-vista', 'data-foco': '', tabindex: '-1' }, ini.titulo),
        ini.entradilla ? h('p', { class: 'entradilla' }, ini.entradilla) : null),
      ilus(p.persona.ilustracion, 'cabeza-ilus', '')));
  }

  /* ---------- Panel de mando ---------- */
  // El día de la demo: el calendario, la agenda y el tiempo relativo cuentan desde aquí.
  var HOY = '2026-11-18';
  var DIA_CORTO = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
  var DIA_LARGO = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  var MES_CORTO = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  var MES_LARGO = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  function fecha(iso) { var p = String(iso).split('-'); return new Date(Date.UTC(+p[0], +p[1] - 1, +p[2])); }
  function masDias(iso, n) { var d = fecha(iso); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); }
  function diasEntre(a, b) { return Math.round((fecha(b) - fecha(a)) / 864e5); }
  function fechaLarga(iso) { var d = fecha(iso); return DIA_LARGO[d.getUTCDay()] + ' ' + d.getUTCDate() + ' de ' + MES_LARGO[d.getUTCMonth()]; }
  function lunesDe(iso) { return masDias(iso, -((fecha(iso).getUTCDay() + 6) % 7)); }
  // Tiempo relativo desde hoy, como se dice en el colegio: «Mañana», «Pasado mañana», «Este sábado»,
  // «La semana que viene» (de lunes a domingo) y «Dentro de dos semanas».
  var CUANTAS = ['', 'una', 'dos', 'tres', 'cuatro', 'cinco', 'seis'];
  function relativo(iso) {
    var n = diasEntre(HOY, iso);
    if (n < 0) return mayuscula(fechaLarga(iso));
    if (n === 0) return 'Hoy';
    if (n === 1) return 'Mañana';
    if (n === 2) return 'Pasado mañana';
    var semanas = diasEntre(lunesDe(HOY), lunesDe(iso)) / 7;
    if (semanas === 0) return 'Este ' + DIA_LARGO[fecha(iso).getUTCDay()];
    if (semanas === 1) return 'La semana que viene';
    return 'Dentro de ' + (CUANTAS[semanas] || semanas) + ' semanas';
  }
  function mayuscula(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }
  // «a», «a y b», «a, b y c»
  function juntar(xs) { return xs.length < 2 ? xs.join('') : xs.slice(0, -1).join(', ') + ' y ' + xs[xs.length - 1]; }
  // Lo que va detrás de un texto antes de seguir leyendo: un punto, salvo que ya lleve uno.
  function trasTexto(t) { return typeof t === 'string' && /[.:;!?…]$/.test(t.trim()) ? ' ' : '. '; }
  function sr(t) { return h('span', { class: 'sr' }, t); }
  // Lo que oye el lector de pantalla va en una sola frase, con su puntuación, y las piezas que se ven van ocultas para él
  // (aria-hidden): así no quedan signos sueltos entre bloques («Correos : 5 .»).
  function frases(xs) { return xs.filter(Boolean).reduce(function (acc, x) { return acc ? acc + trasTexto(acc) + x : x; }, ''); }
  function oculto(el) { if (el) el.setAttribute('aria-hidden', 'true'); return el; }

  // Horario de Primaria (guion-de-datos.md §1): las columnas del día. Un perfil puede traer las suyas en inicio.dia.franjas.
  var HORARIO = [
    { id: '1', nombre: '1.ª', desde: '9:00', hasta: '9:45' },
    { id: '2', nombre: '2.ª', desde: '9:45', hasta: '10:30' },
    { id: '3', nombre: '3.ª', desde: '10:30', hasta: '11:15' },
    { id: 'recreo', nombre: 'Recreo', desde: '11:15', hasta: '11:45', pausa: true },
    { id: '4', nombre: '4.ª', desde: '11:45', hasta: '12:30' },
    { id: 'comida', nombre: 'Comida', desde: '12:30', hasta: '14:30', pausa: true },
    { id: '5', nombre: '5.ª', desde: '14:30', hasta: '15:15' },
    { id: '6', nombre: '6.ª', desde: '15:15', hasta: '16:00' },
    { id: 'salida', nombre: 'Salida', desde: '16:00', pausa: true },
  ];

  // Iconos de las cifras y de la lista, con el estilo de las ilustraciones: trazo pizarra sobre círculo salvia.
  // Son actos de personas (firmar, leer, ir a clase…): ninguno lleva la chispa, que es solo de la insignia de la IA.
  var ICONOS = {
    correo: '<rect x="6.3" y="7.8" width="11.4" height="8.6" rx="1.4"/><path d="M6.9 8.6l5.1 4 5.1-4"/>',
    firma: '<path d="M8.7 14.9l.7-2.6 5.4-5.4a1.2 1.2 0 0 1 1.7 0l.4.4a1.2 1.2 0 0 1 0 1.7l-5.4 5.4z"/><path d="M6.8 17.6h10.4"/>',
    carpeta: '<path d="M6.3 9V16a1.2 1.2 0 0 0 1.2 1.2h9a1.2 1.2 0 0 0 1.2-1.2v-5.6a1.2 1.2 0 0 0-1.2-1.2h-4.4L10.6 7.8H7.5A1.2 1.2 0 0 0 6.3 9z"/><path d="M9.3 13.6h5.4"/>',
    reloj: '<circle cx="12" cy="12" r="5.6"/><path d="M12 9.2V12l1.9 1.3"/><circle class="f" cx="12" cy="12" r=".9"/>',
    calendario: '<rect x="6.4" y="7.6" width="11.2" height="10" rx="1.4"/><path d="M6.4 10.8h11.2M9.4 6.2v2.6M14.6 6.2v2.6"/><rect class="f" x="13.2" y="13" width="2.2" height="2.2" rx=".5"/>',
    persona: '<circle cx="12" cy="9.8" r="2.6"/><path d="M7.4 17.4c.6-2.6 2.4-4 4.6-4s4 1.4 4.6 4"/>',
    familia: '<circle cx="9.8" cy="9.4" r="2.2"/><path d="M6.2 16.8c.4-2.3 1.8-3.5 3.6-3.5s3.2 1.2 3.6 3.5"/><circle cx="15.3" cy="11.6" r="1.6"/><path d="M13.6 16.8c.3-1.5 1-2.3 1.9-2.3s1.6.8 1.9 2.3"/>',
    alerta: '<path d="M12 6.6l5.8 10H6.2z"/><path d="M12 10.6v2.6"/><circle class="f" cx="12" cy="15" r=".75"/>',
    libro: '<path d="M12 8.6c-1.6-1-3.6-1.3-5.4-1v8.8c1.8-.3 3.8 0 5.4 1 1.6-1 3.6-1.3 5.4-1V7.6c-1.8-.3-3.8 0-5.4 1zM12 8.6v8.8"/>',
    acta: '<path d="M8.2 6.4h5.2l2.6 2.6v8a1.2 1.2 0 0 1-1.2 1.2H8.2A1.2 1.2 0 0 1 7 17V7.6a1.2 1.2 0 0 1 1.2-1.2z"/><path d="M9.4 11.2h4.4"/><path d="M9.4 14.6c.6-.9 1.1-.9 1.5 0s.9.9 1.5 0 .9-.9 1.5 0"/>',
    documento: '<path d="M8.2 6.4h5.2l2.6 2.6v8a1.2 1.2 0 0 1-1.2 1.2H8.2A1.2 1.2 0 0 1 7 17V7.6a1.2 1.2 0 0 1 1.2-1.2z"/><path d="M13.4 6.4V9H16M9.4 12.2h5.2M9.4 14.8h3.6"/>',
    microfono: '<rect x="10" y="6.2" width="4" height="7.4" rx="2"/><path d="M7.8 11.6a4.2 4.2 0 0 0 8.4 0M12 15.8v2.2M10 18h4"/>',
    clase: '<rect x="6.2" y="7" width="11.6" height="7.6" rx="1"/><path d="M9.4 18l1.8-3.4M14.6 18l-1.8-3.4"/><path d="M8.6 10.8h4"/>',
    autobus: '<rect x="7" y="6.6" width="10" height="9.8" rx="2"/><path d="M7 11.6h10M9 16.4v1.6M15 16.4v1.6"/><circle class="f" cx="9.6" cy="14" r=".75"/><circle class="f" cx="14.4" cy="14" r=".75"/>',
    colegio: '<path d="M6.4 17.6V11l5.6-3.6 5.6 3.6v6.6zM10.4 17.6v-3.4h3.2v3.4"/><circle class="f" cx="12" cy="10.8" r=".9"/>',
    info: '<circle cx="12" cy="12" r="5.6"/><path d="M12 11.2v3.4"/><circle class="f" cx="12" cy="9.2" r=".75"/>',
    hecho: '<path d="M7.6 12.4l3 3 5.8-6"/>',
  };
  function icono(nombre) {
    return svg('<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle class="ico-fondo" cx="12" cy="12" r="12"/><g class="ico-trazo">' + (ICONOS[nombre] || ICONOS.info) + '</g></svg>');
  }
  // Color por significado («Colores de la app» en el README): cada tipo de trabajo tiene su tono, el mismo en toda la app.
  // El motor solo pone data-cat (y data-perfil en la pantalla de acceso); los tonos están en app.css. Una sola regla: el
  // color dice adónde lleva una pieza (su función) y el icono, de qué trata. Lo que lleva al correo es «comunicacion»,
  // que va sin tono (es donde escribe la IA, y su único color es la chispa); lo que no lleva a ninguna función, sin tono.
  var CATEGORIA_TIPO = { dictado: 'comunicacion', traduccion: 'comunicacion', aprobaciones: 'personas', ficha: 'personas', documento: 'documentos',
    tabla: 'documentos', plazos: 'plazos', protocolo: 'protocolos', informe: 'recursos', banco: 'recursos', material: 'recursos' };
  // Dos funciones cuyo tipo no dice su trabajo: «Tu jornada» es el día (como el panel del día) y «Exámenes», un calendario.
  var CATEGORIA_MODULO = { jornada: 'personas', examenes: 'plazos' };
  // El icono de la cabecera de una función, si ninguna cifra del Inicio lleva a ella (o llevan varias), por su tipo.
  var ICONO_TIPO = { dictado: 'microfono', traduccion: 'documento', aprobaciones: 'persona', ficha: 'documento', documento: 'documento', tabla: 'documento',
    plazos: 'calendario', protocolo: 'carpeta', informe: 'carpeta', banco: 'libro', material: 'libro' };
  // Lo confidencial (el protocolo y lo que es de un caso, como la citación que firma la directora) va siempre en su tono.
  function categoriaModulo(m) { return m ? (m.confidencial ? 'protocolos' : CATEGORIA_MODULO[m.id] || CATEGORIA_TIPO[m.tipo] || null) : null; }
  // Lo que lleva a una función (cifra, fila o marca) toma su tono: la cifra del dosier, su fila, su marca y
  // «Dosier para inspección» en el menú van del mismo color. Se mira el enlace vigente: si cambia, el tono lo sigue.
  function categoria(rol, ir) {
    if (!ir) return null;
    var s = String(ir), barra = s.indexOf('/');
    var otro = barra > 0 ? s.slice(0, barra) : rol;
    if (barra > 0) s = s.slice(barra + 1);
    if (s === 'correo' || s.indexOf('correo:') === 0) return 'comunicacion';
    return D.roles[otro] ? categoriaModulo(modulo(otro, s.split('#')[0])) : null;
  }
  // El icono de la cabecera de una función: el mismo dibujo que la cifra que lleva a ella en el Inicio; si no la hay, o si
  // llevan varias (el protocolo: la entrevista con un reloj y el paso del caso con una carpeta), el de su tipo.
  function iconoModulo(rol, m) {
    var cs = ((D.roles[rol].inicio || {}).cifras || []).filter(function (c) { return c.ir === m.id; });
    return cs.length === 1 && cs[0].icono ? cs[0].icono : ICONO_TIPO[m.tipo];
  }
  // Glifos de estado y formas del calendario, sin disco: toman el color del texto (currentColor).
  // Banderín: plazo. Calendario: cita, salida o fecha del colegio. Triángulo: aviso. ✓: hecho. «…»: por confirmar.
  var GLIFOS = {
    plazo: '<path class="trazo" d="M4.4 14.3V2.3"/><path class="relleno" d="M4.4 2.6h8.4l-2.2 3 2.2 3H4.4z"/>',
    evento: '<rect class="trazo" x="2.2" y="3.3" width="11.6" height="10.7" rx="1.8"/><path class="trazo" d="M2.2 6.9h11.6M5.3 1.8v3M10.7 1.8v3"/><rect class="relleno" x="8.9" y="9.2" width="2.8" height="2.6" rx=".5"/>',
    aviso: '<path class="relleno" d="M7.1 2.2a1 1 0 0 1 1.8 0l6 10.5a1 1 0 0 1-.9 1.5H2a1 1 0 0 1-.9-1.5z"/><path class="hueco" d="M8 6.1v3.5"/><circle class="hueco-f" cx="8" cy="11.8" r=".95"/>',
    hecho: '<path class="trazo grueso" d="M2.7 8.5l3.4 3.4 7.2-7.4"/>',
    espera: '<circle class="trazo" cx="8" cy="8" r="6.5"/><circle class="relleno" cx="5.2" cy="8" r="1.05"/><circle class="relleno" cx="8" cy="8" r="1.05"/><circle class="relleno" cx="10.8" cy="8" r="1.05"/>',
    reloj: '<circle class="trazo" cx="8" cy="8" r="6.5"/><path class="trazo" d="M8 4.6V8l2.4 1.6"/>',
    info: '<circle class="trazo" cx="8" cy="8" r="6.5"/><path class="trazo grueso" d="M8 7.3v4"/><circle class="relleno" cx="8" cy="4.8" r="1.05"/>',
  };
  // «Cita, salida o fecha»: el calendario vale también para una fecha del colegio (el corte de la calle, el inicio de los exámenes).
  var NOMBRE_FORMA = { plazo: 'Plazo', evento: 'Cita, salida o fecha', aviso: 'Aviso', hecho: 'Hecho' };
  function glifo(nombre, cls) {
    return svg('<svg class="glifo' + (cls ? ' ' + cls : '') + '" viewBox="0 0 16 16" aria-hidden="true" focusable="false">' + (GLIFOS[nombre] || GLIFOS.plazo) + '</svg>');
  }
  function flecha() { return svg('<svg class="flecha" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M6 3.5L10.5 8 6 12.5"/></svg>'); }

  // Lo que sigue el Inicio para estar al día: 'correo:<id>', '<módulo>', '<módulo>#<elemento>' o 'bandera:<nombre>',
  // y lo mismo de otro perfil con su id delante: 'jefatura/guardias#g1'. Devuelve { hecho, hora, verbo } y, si cuenta,
  // { n, de, partes }; una propuesta de aprobaciones devuelve además quién la cubre (quien), que es la persona que
  // jefatura ha elegido en el desplegable o, si no ha cambiado nada, la propuesta. Solo lee el estado: no lo cambia.
  var SECCION = { documento: 'docs', aprobaciones: 'aprob', plazos: 'plazos', tabla: 'tablas', dictado: 'dictado', traduccion: 'trad', informe: 'informe', banco: 'banco', material: 'material', ficha: 'fichas' };
  function leer(seccion, rol, id) { var a = S[seccion] && S[seccion][rol]; return (a && a[id]) || {}; }
  function ultimaHora(horas) { return horas.filter(Boolean).sort(function (a, b) { return a.length - b.length || (a < b ? -1 : 1); }).pop() || null; }
  function estadoDe(rol, ref) {
    // Una lista ('dosier' y 'correo:c-inspeccion#1'): hecha cuando lo están todas (el dosier con el visto bueno y enviado).
    // La hora es la de la última; el verbo, el de la última que lo tiene.
    if (Array.isArray(ref)) {
      var es = ref.map(function (x) { return estadoDe(rol, x); });
      var todas = es.length > 0 && es.every(function (x) { return x.hecho; });
      var conVerbo = es.filter(function (x) { return x.verbo; });
      return { hecho: todas, hora: todas ? ultimaHora(es.map(function (x) { return x.hora; })) : null,
        verbo: conVerbo.length ? conVerbo[conVerbo.length - 1].verbo : null, archivado: todas && es.some(function (x) { return x.archivado; }) };
    }
    var r = rol, s = String(ref || '');
    var barra = s.indexOf('/');
    if (barra > 0) { r = s.slice(0, barra); s = s.slice(barra + 1); }
    if (!D.roles[r]) return { hecho: false };
    if (s.indexOf('bandera:') === 0) return { hecho: !!S.banderas[s.slice(8)] };
    if (s.indexOf('correo:') === 0) {
      // 'correo:<id>': respondido o archivado. Archivar cuenta como hecho, pero no es responder: «archivado» lo dice para
      // que nadie dé por avisado lo que no se ha avisado.
      // 'correo:<id>#1' (o '#0,1'): hecho solo si se ha enviado esa respuesta propuesta (desde 0), la que avisa o adjunta
      // lo que pide el plazo. 'correo:<id>#archivado': archivado sin responder.
      var pc = s.slice(7).split('#'), c = (S.correo[r] || {})[pc[0]];
      var archivado = !!(c && c.estado === 'archivado');
      var res = { hora: c ? c.hora : null, verbo: c ? (archivado ? 'Archivado' : c.para ? 'Enviado' : 'Respondido') : null };
      if (pc[1] === undefined) { res.hecho = !!c; res.archivado = archivado; }
      else if (pc[1] === 'archivado') res.hecho = archivado;
      else res.hecho = !!(c && c.estado === 'enviado' && pc[1].split(',').map(Number).indexOf(c.opcion) >= 0);
      return res;
    }
    var partes = s.split('#'), m = modulo(r, partes[0]);
    if (!m) return { hecho: false };
    var est = leer(SECCION[m.tipo], r, m.id);
    if (m.tipo === 'aprobaciones' || m.tipo === 'plazos') {
      var lista = m.items.map(function (it, i) { return { clave: m.tipo === 'plazos' ? String(i) : it.id, it: it }; });
      if (partes[1] !== undefined) lista = lista.filter(function (x) { return x.clave === partes[1]; });
      var hechos = lista.map(function (x) { return m.tipo === 'plazos' ? est[x.clave] === true || x.it.estado === 'hecho' : !!(est[x.clave] && est[x.clave].hecho); });
      var n = hechos.filter(Boolean).length;
      var res = { hecho: lista.length > 0 && n === lista.length, n: n, de: lista.length, partes: hechos,
        // Los plazos guardan la hora en «h<n>» al marcarlos; las propuestas, en su hora de confirmación.
        hora: ultimaHora(lista.map(function (x) { return m.tipo === 'plazos' ? est['h' + x.clave] : est[x.clave] && est[x.clave].hora; })) };
      if (m.tipo === 'aprobaciones' && lista.length === 1) {
        var it = lista[0].it, e1 = est[it.id] || {};
        res.propuesta = it.propuesta;
        res.quien = e1.quien || it.propuesta;
        res.personas = [it.propuesta].concat(it.alternativas || []);
      }
      return res;
    }
    if (m.tipo === 'dictado') return { hecho: est.fase === 'enviado', hora: est.hora || null, fase: est.fase || 'inicio', verbo: 'Enviado' };
    if (m.tipo === 'ficha') return { hecho: !m.bandera || !!S.banderas[m.bandera] };
    if (m.tipo === 'banco' || m.tipo === 'material') return { hecho: !!(est.guardado || est.compartido) };
    if (m.tipo === 'protocolo') return { hecho: false };
    return { hecho: !!est.hecho, hora: est.hora || null };
  }
  // Una propuesta que DirectorIA hacía para la persona del perfil y para la que jefatura ha elegido a otra.
  function otraPersona(rol, ref) {
    var e = estadoDe(rol, ref), yo = D.roles[rol].persona.nombre;
    return !!(e.propuesta && e.propuesta === yo && e.quien && e.quien !== yo);
  }
  // Una propuesta que DirectorIA hacía para otra persona y para la que jefatura ha elegido a la persona del perfil.
  function teElige(rol, ref) {
    var e = estadoDe(rol, ref), yo = D.roles[rol].persona.nombre;
    return !!(e.propuesta && e.propuesta !== yo && e.quien === yo);
  }
  // Variantes de una cifra, una fila de la lista o un carril del día. Cada una lleva «cuando» (una referencia o varias)
  // y solo los campos que cambian; lo demás sigue como en los datos. Vale la primera de la lista que se cumple.
  // - siOtra: jefatura ha elegido a otra persona para lo que DirectorIA te proponía a ti (todas las de «cuando»);
  // - siConfirmada: lo de «cuando» está confirmado (una propuesta, o todo el módulo: 'jefatura/guardias') y sigue
  //   siendo tuyo. Los datos dicen lo de las 8:00, cuando aún no se ha confirmado, y la variante, lo de después.
  // siOtra va antes: si jefatura ha elegido a otra persona, lo confirmado ya no es tuyo.
  function cumple(vs, prueba) {
    vs = [].concat(vs || []);
    for (var i = 0; i < vs.length; i++) {
      var cuando = [].concat(vs[i].cuando || []);
      if (cuando.length && cuando.every(prueba)) return vs[i];
    }
    return null;
  }
  function variante(rol, x) {
    if (!x || (!x.siOtra && !x.siConfirmada)) return x;
    var v = cumple(x.siOtra, function (ref) { return otraPersona(rol, ref); }) ||
      cumple(x.siConfirmada, function (ref) { return estadoDe(rol, ref).hecho && !otraPersona(rol, ref); });
    return v ? Object.assign({}, x, v) : x;
  }
  // aMedias: lo que cambia mientras lo que se sigue no está hecho, pero se ha hecho otra cosa que va hacia ello
  // (el visto bueno al dosier, que aún no se ha enviado; una respuesta a la empresa que no avisa del preaviso).
  // Cada variante lleva su propio «sigue»; vale la primera que está hecha. Un correo archivado no va «a medias»:
  // para eso está 'correo:<id>#archivado'.
  function aMediasDe(rol, x) {
    var vs = [].concat((x && x.aMedias) || []);
    for (var i = 0; i < vs.length; i++) { var e = estadoDe(rol, vs[i].sigue); if (e.hecho && !e.archivado) return vs[i]; }
    return null;
  }
  // Quién confirma lo que sigue una sesión: null si es el propio perfil (entonces se le habla de tú).
  var NOMBRE_PERFIL = { direccion: 'dirección', jefatura: 'jefatura', secretaria: 'secretaría', orientacion: 'orientación', docente: 'la tutora', sustituto: 'quien sustituye' };
  function quienDecide(rol, ref) {
    var s = String(ref || ''), barra = s.indexOf('/');
    if (barra < 1 || s.slice(0, barra) === rol) return null;
    return NOMBRE_PERFIL[s.slice(0, barra)] || s.slice(0, barra);
  }

  // Los enlaces del Inicio son enlaces de verdad (se abren con teclado y con el ratón). Si llevan a un correo,
  // antes de cambiar de pantalla dejan elegido ese correo, como hace irA.
  function hrefDe(rol, destino) { return destino ? enlace(rol, destino.indexOf('correo') === 0 ? 'correo' : destino) : null; }
  function prepararIr(rol, destino, elegido) {
    if (!destino) return;
    if (destino === 'correo') { S.leyendo[rol] = false; if (elegido) S.sel[rol] = elegido; guardar(); }
    else if (destino.indexOf('correo:') === 0) { S.sel[rol] = destino.slice(7); S.leyendo[rol] = true; guardar(); }
  }
  function enlaceInicio(rol, destino, attrs, contenido) {
    var a = Object.assign({ href: hrefDe(rol, destino), onclick: function () { prepararIr(rol, destino, attrs && attrs.elegido); } }, attrs || {});
    delete a.elegido;
    return h('a', a, contenido);
  }

  // Medidor fino: un tramo por elemento. «lleno» si está hecho o listo; «revisar» o «actual» (en curso), solo con el borde;
  // «falta» o «condicional», con el borde discontinuo; sin clase, vacío. Va rotulado por la cifra («6 de 8 listas»),
  // así que no se lee dos veces.
  function medidor(estados) { return h('span', { class: 'medidor', 'aria-hidden': 'true' }, estados.map(function (x) { return h('i', { class: x || null }); })); }
  // Tramos con su nombre debajo: los pasos del dictado o los días que quedan de una cuenta atrás.
  function tramos(nombres, clases, cls) {
    return h('span', { class: 'tramos' + (cls ? ' ' + cls : ''), style: '--n:' + nombres.length, 'aria-hidden': 'true' },
      nombres.map(function (x, i) { return h('span', { class: clases[i] || null }, x); }));
  }
  // Cuenta atrás hasta una fecha que la fuente da como «antes del…»: un tramo por cada día que queda, empezando por hoy.
  function diasHasta(limite) { var n = diasEntre(HOY, limite), d = []; for (var i = 0; i < n; i++) d.push(DIA_CORTO[fecha(masDias(HOY, i)).getUTCDay()]); return d; }

  // El panel. En el móvil (el panel por debajo de ANCHO_MOVIL), «Lo que te necesita» va antes del día,
  // también en el orden del foco: ordenarPanel mueve los nodos y se vuelve a llamar si cambia el ancho.
  // El día pasa a una sesión por fila antes, por debajo de 62rem (app.css), pero sigue detrás de las cifras:
  // así, con el menú lateral en una tableta apaisada (1180 px), la fila de 3.º B no sale de la primera pantalla.
  var ANCHO_MOVIL = 56; // rem
  function panelInicio(rol, ini) {
    var panel = h('div', { class: 'panel' },
      filaCifras(rol, ini.cifras),
      ini.dia ? lineaDelDia(rol, ini.dia) : null,
      ini.lista ? listaInicio(rol, ini.lista) : null,
      ini.agenda ? agendaInicio(rol, ini.agenda) : null);
    noPartir(juntarGrupos(juntarOrdinales(panel)));
    return panel;
  }
  function ordenarPanel(panel) {
    var dia = panel.querySelector(':scope > .panel-dia'), lista = panel.querySelector(':scope > .panel-lista');
    if (!dia || !lista || !panel.isConnected) return;
    var rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    var estrecho = panel.getBoundingClientRect().width < ANCHO_MOVIL * rem;
    var listaAntes = !!(lista.compareDocumentPosition(dia) & Node.DOCUMENT_POSITION_FOLLOWING);
    if (estrecho === listaAntes) return;
    // Al mover un nodo, el navegador le quita el foco (al girar una tableta o al cambiar el zoom): se le devuelve, para
    // que el siguiente Tab siga donde estaba. moveBefore, donde existe, mueve sin perderlo.
    var foco = document.activeElement, mover = estrecho ? lista : dia, antes = estrecho ? dia : lista;
    try { if (typeof panel.moveBefore === 'function') panel.moveBefore(mover, antes); else panel.insertBefore(mover, antes); }
    catch (e) { panel.insertBefore(mover, antes); }
    if (foco && foco !== document.body && panel.contains(foco) && document.activeElement !== foco) foco.focus({ preventScroll: true });
  }
  var observador = typeof ResizeObserver === 'function' ? new ResizeObserver(function (es) { es.forEach(function (x) { ordenarPanel(x.target); }); }) : null;
  function vigilarPanel() {
    if (observador) observador.disconnect();
    var pn = raiz.querySelector('.panel');
    if (!pn) return;
    ordenarPanel(pn);
    if (observador) observador.observe(pn);
  }
  // «3.º B», «1.ª hora», «2.º ESO A», «sáb 21», «sábado 21», «las 8:00», «Daniel M.», «1 de diciembre»: el ordinal, el día, la hora,
  // la inicial o el número no se quedan solos al final de una línea.
  function juntarOrdinales(el) {
    var w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), n;
    while ((n = w.nextNode())) {
      if (/\d\.[ºª] /.test(n.nodeValue)) n.nodeValue = n.nodeValue.replace(/(\d\.[ºª]) /g, '$1\u00a0');
      if (/(lun|mar|mié|jue|vie|sáb|dom|lunes|martes|miércoles|jueves|viernes|sábado|domingo|las) \d/.test(n.nodeValue)) n.nodeValue = n.nodeValue.replace(/(lun|mar|mié|jue|vie|sáb|dom|lunes|martes|miércoles|jueves|viernes|sábado|domingo|las) (\d)/g, '$1\u00a0$2');
      if (/\S [A-ZÁÉÍÓÚÑ]\./.test(n.nodeValue)) n.nodeValue = n.nodeValue.replace(/(\S) ([A-ZÁÉÍÓÚÑ]\.)/g, '$1\u00a0$2');
      // «el 1 de diciembre», «6 de 8»: el número no se queda solo al final de la línea.
      if (/\d de\s/.test(n.nodeValue)) n.nodeValue = n.nodeValue.replace(/(\d) (de\s)/g, '$1\u00a0$2');
    }
    return el;
  }
  // «1.º ESO A», «2.º ESO B»: el grupo no se queda solo al principio de la línea.
  function juntarGrupos(el) {
    var w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), n;
    while ((n = w.nextNode())) if (/ESO [A-D]\b/.test(n.nodeValue)) n.nodeValue = n.nodeValue.replace(/ESO ([A-D])\b/g, 'ESO\u00a0$1');
    return el;
  }
  // «Caso 2026-07» no se parte por el guion: el número va en un trozo que no se corta. El texto entero pasa a un solo
  // elemento, para no partir la línea si el contenedor es una rejilla (la nota de una cifra).
  function noPartir(el) {
    var w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), n, cuales = [];
    while ((n = w.nextNode())) if (/\d{4}-\d{2}/.test(n.nodeValue) && !n.parentNode.closest('.sr, .junto, [hidden]')) cuales.push(n);
    cuales.forEach(function (t) {
      t.replaceWith(h('span', null, t.nodeValue.split(/(\d{4}-\d{2})/).map(function (x, i) { return i % 2 ? h('span', { class: 'junto' }, x) : x; })));
    });
    return el;
  }
  // Pasa a minúscula el principio de un título que va dentro de una frase, salvo que empiece por un nombre propio
  // («Caso 2026-07», «AMPA», «Laura Sánchez»).
  function minusculaTitulo(s) { return /^(Caso \d|[A-ZÁÉÍÓÚÑ]{2,}|[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+ [A-ZÁÉÍÓÚÑ])/.test(s || '') ? s : minuscula(s); }

  /* Cifras: 3-4 tarjetas grandes; cada una es un enlace a donde se actúa y tiene un solo sentido:
     o cuenta lo que queda (sin medidor), o es un progreso «X de Y» con su medidor rotulado,
     o es un valor con su rótulo (una cuenta atrás, por ejemplo). Las filas de las tarjetas se alinean (subgrid). */
  var FASE_DICTADO = { inicio: ['Por dictar', 0], escuchando: ['Por dictar', 0], dictado: ['Por revisar', 1], borrador: ['Por revisar', 1], enviado: ['Enviado', 3] };
  // Lo que dice la cifra de un dictado ya dictado y por revisar, si los datos no lo cambian con «siDictado».
  var POR_REVISAR = { nota: 'Ya lo has dictado. Te queda revisar el correo y enviarlo tú.', accion: 'Revisar y enviar', accionCorta: 'Revisar' };
  var NOMBRE_PIEZA = { ok: 'lista', revisar: 'por revisar', falta: 'falta' };
  var ORDEN_PIEZA = { ok: 0, revisar: 1, falta: 2 };
  // Los pasos de un protocolo en el medidor: hechos (rellenos), en curso (con borde), pendientes (vacíos)
  // y los que solo van si se confirma (borde discontinuo).
  var TRAMO_PASO = { hecho: 'lleno', curso: 'actual', pendiente: null, condicional: 'condicional' };
  var NOMBRE_PASO = { hecho: 'hecho', curso: 'en curso', pendiente: 'pendiente', condicional: 'solo si se confirma' };
  function valorCifra(rol, c) {
    var p = D.roles[rol];
    if (c.cuenta === 'correo') {
      // Lo que queda, como el contador del menú: los correos con respuestas propuestas que siguen sin responder ni archivar.
      // Los ha resumido la IA: la nota lo dice con la insignia.
      var est = S.correo[rol] || {};
      var con = (p.correo || []).filter(function (x) { return (x.respuestas || []).length; });
      var quedan = con.filter(function (x) { return !est[x.id]; });
      return { valor: String(quedan.length), hecho: !quedan.length, ir: 'correo', elegido: quedan[0] && quedan[0].id,
        nota: [c.nota ? h('span', { class: 'linea' }, c.nota) : null, h('span', { class: 'marca-ia' }, insignia(), 'Resumidos con IA')],
        notaTexto: frases([c.nota, 'Resumidos con IA']),
        hora: ultimaHora(con.map(function (x) { return est[x.id] && est[x.id].hora; })) };
    }
    if (c.pendientes) {
      // Lo que queda, sin medidor. La nota resume lo que queda («La citación y el acta del claustro»); si queda uno, lo dice entero.
      // Hecho todo, la cifra lleva a su «ir» o, si no lo tiene, adonde llevaba el último pendiente.
      var es = c.pendientes.map(function (x) { return estadoDe(rol, x.sigue); });
      var resto = c.pendientes.filter(function (x, i) { return !es[i].hecho; });
      var pr = resto[0] || {};
      return { valor: String(resto.length), hecho: !resto.length, ir: pr.ir || c.ir || c.pendientes[c.pendientes.length - 1].ir,
        accion: pr.accion || c.accion, accionCorta: pr.accionCorta || c.accionCorta, hoy: !!pr.hoy,
        nota: resto.length === 1 ? pr.texto : mayuscula(juntar(resto.map(function (x) { return x.corto || minuscula(x.texto); }))),
        hora: ultimaHora(es.map(function (e) { return e.hora; })) };
    }
    if (c.progreso) {
      var m = modulo(rol, c.progreso), e = estadoDe(rol, c.progreso);
      var r = { hecho: e.hecho, hora: e.hora, nota: c.nota, hoy: !!c.hoy, rotulo: c.rotulo };
      if (!m) { r.valor = c.valor || ''; return r; } // el validador avisa si el módulo no existe
      if (m.tipo === 'documento' && m.documentos) {
        // Cuenta solo las piezas listas. El medidor pinta las tres, ordenadas: listas, por revisar y la que falta.
        // El orden del módulo va en el globo.
        var listas = m.documentos.filter(function (d) { return d.estado === 'ok'; }).length;
        var piezas = m.documentos.slice().sort(function (a, b) { return ORDEN_PIEZA[a.estado] - ORDEN_PIEZA[b.estado]; });
        r.rotulo = c.rotulo || 'listas';
        r.valor = [String(listas), h('small', null, ' de ' + m.documentos.length)];
        r.valorTexto = listas + ' de ' + m.documentos.length;
        r.barra = medidor(piezas.map(function (d) { return d.estado === 'ok' ? 'lleno' : d.estado; }));
        r.globo = [c.etiqueta + ': ' + listas + ' de ' + m.documentos.length + ' ' + r.rotulo].concat(m.documentos.map(function (d) { return d.nombre + ': ' + NOMBRE_PIEZA[d.estado] + '.'; }));
      } else if (m.tipo === 'protocolo' && m.pasos) {
        // El paso en curso de un protocolo («4 de 9», rotulado «en curso»), con un tramo por paso. El globo da los pasos.
        var k = m.pasos.map(function (x) { return x.estado; }).indexOf('curso');
        var n = k >= 0 ? k + 1 : m.pasos.filter(function (x) { return x.estado === 'hecho'; }).length;
        r.rotulo = c.rotulo || 'en curso';
        r.valor = [String(n), h('small', null, ' de ' + m.pasos.length)];
        r.valorTexto = n + ' de ' + m.pasos.length;
        r.barra = medidor(m.pasos.map(function (x) { return TRAMO_PASO[x.estado]; }));
        r.globo = [c.etiqueta + ': ' + r.valorTexto + ', ' + r.rotulo].concat(m.pasos.map(function (x, i) { return (i + 1) + '. ' + x.nombre + ': ' + NOMBRE_PASO[x.estado] + '.'; }));
      } else if (m.tipo === 'dictado') {
        var f = FASE_DICTADO[e.fase] || FASE_DICTADO.inicio;
        r.valor = f[0];
        r.barra = tramos(['Dictar', 'Revisar', 'Enviar'], [0, 1, 2].map(function (i) { return i < f[1] ? 'hecho' : i === f[1] ? 'actual' : null; }), 'pasos');
        r.ancha = true; // los tres pasos con su nombre no caben en media tarjeta del móvil
        // Ya dictado y por revisar: la nota y la acción lo dicen, para no pedir otra vez que se dicte.
        if (f[1] === 1) { var pd = Object.assign({}, POR_REVISAR, c.siDictado || {}); r.nota = pd.nota; r.accion = pd.accion; r.accionCorta = pd.accionCorta; }
      } else if (e.de) {
        r.valor = [String(e.n), h('small', null, ' de ' + e.de)];
        r.valorTexto = e.n + ' de ' + e.de;
        r.barra = medidor(e.partes.map(function (x) { return x ? 'lleno' : null; }));
      } else r.valor = c.valor || '';
      return r;
    }
    if (c.fichas) return valorFichas(rol, c);
    var s = c.sigue ? estadoDe(rol, c.sigue) : { hecho: false };
    var dias = c.cuentaAtras ? diasHasta(c.cuentaAtras) : null;
    // Archivar no completa una cuenta atrás: el plazo sigue corriendo, como en «Lo que viene».
    var hecha = !!s.hecho && !(s.archivado && c.cuentaAtras);
    // A medias (o archivado, con 'correo:<id>#archivado'), la cifra sigue con su valor y su cuenta atrás, y la nota lo dice.
    var am = (hecha ? null : aMediasDe(rol, c)) || {};
    // Si lo que sigue es un correo archivado sin responder, la cifra dice «Archivado», no lo que diría al terminar.
    return { valor: c.valor, rotulo: c.rotulo, hecho: hecha, hora: s.hora, nota: am.nota || c.nota, hoy: !!c.hoy, alTerminar: s.archivado ? 'Archivado' : null,
      ir: am.ir, accion: am.accion, accionCorta: am.accionCorta,
      barra: dias && dias.length ? tramos(dias, dias.map(function () { return 'queda'; }), 'cuenta-atras') : null };
  }
  // Las fichas que te llegan: las sesiones con ficha de una propuesta de guardias ('jefatura/guardias') que son tuyas,
  // porque DirectorIA te las proponía o porque jefatura te ha elegido. Llegan todas juntas cuando jefatura confirma
  // las guardias. Sin ninguna (jefatura ha elegido a otras personas), la cifra no se da por hecha: dice «siNinguna».
  function valorFichas(rol, c) {
    var s = String(c.fichas), barra = s.indexOf('/'), otro = barra > 0 ? s.slice(0, barra) : rol;
    var m = modulo(otro, barra > 0 ? s.slice(barra + 1) : s), yo = D.roles[rol].persona.nombre;
    if (!m) return { valor: '', hecho: false };
    var est = leer('aprob', otro, m.id), tuyas = [], otras = [], quienes = {};
    m.items.forEach(function (it) {
      if (!it.ficha) return;
      var quien = (est[it.id] && est[it.id].quien) || it.propuesta, nombre = String(it.cuando).split(/\s/)[0];
      if (quien === yo) tuyas.push(nombre);
      else if (it.propuesta === yo) { otras.push(nombre); quienes[quien] = true; }
    });
    var todo = estadoDe(rol, c.fichas), decide = quienDecide(rol, c.fichas) || 'jefatura';
    if (!tuyas.length) { var sn = c.siNinguna || {}; return { valor: sn.valor || 'Ninguna', hecho: false, nota: sn.nota || c.nota, ir: sn.ir, accion: sn.accion, accionCorta: sn.accionCorta }; }
    if (todo.hecho) return { hecho: true, hora: todo.hora, alTerminar: tuyas.length === 1 && c.alTerminarUna ? c.alTerminarUna : null };
    var las = function (xs) { return juntar(xs.map(function (x, i) { return (i ? 'la de ' : 'La de ') + x; })); };
    var nota = las(tuyas) + (tuyas.length === 1 ? ' llega' : ' llegan') + ' cuando ' + decide + ' confirme las guardias.';
    if (otras.length) nota += ' Para ' + juntar(otras.map(function (x) { return 'la ' + x; })) + ', ' + decide + ' ha elegido a ' + (Object.keys(quienes).length > 1 ? 'otras personas.' : 'otra persona.');
    return { valor: String(tuyas.length), rotulo: c.rotulo, hecho: false, hoy: !!c.hoy, nota: nota };
  }
  // Sin una palabra sola en la última línea de una nota: las dos últimas van juntas si son cortas («las guardias.»).
  // Con sitio lo resuelve text-wrap: pretty (app.css); en media tarjeta del móvil no siempre llega.
  function sinViuda(t) {
    return typeof t === 'string' ? t.replace(/ (\S+) (\S+)$/, function (todo, a, b) { return (a + b).length < 18 ? ' ' + a + '\u00a0' + b : todo; }) : t;
  }
  function accionMovil(v, c) { return v.hecho ? '' : (v.accionCorta || c.accionCorta || v.accion || c.accion || ''); }
  // La acción de una cifra hecha: «accionHecha» («Ver el dosier») o, si lleva a un correo, «Ver el correo».
  function accionHecha(rol, c, destino) {
    if (c.accionHecha) return c.accionHecha;
    if (destino && destino.indexOf('correo') === 0) return 'Ver el correo';
    return etiquetaIr(rol, destino);
  }
  function cifra(rol, c, v) {
    var destino = v.ir || c.ir;
    // El tono de la función a la que lleva ahora: «Pendiente de tu firma» va en el de la citación (un caso) y, firmada,
    // en el del acta.
    var cat = categoria(rol, destino || c.cuenta);
    var larga = v.hecho ? accionHecha(rol, c, destino) : (v.accion || c.accion || etiquetaIr(rol, destino));
    // En el móvil, la acción corta. Hecha la cifra, «accionHecha», que ya es corta.
    var corta = v.hecho ? null : (v.accionCorta || c.accionCorta || null);
    var fin = v.alTerminar || c.alTerminar;
    var nota = v.hecho ? (v.hora ? 'Hoy a las ' + v.hora + '.' : null) : v.nota;
    var largo = typeof v.valor === 'string' && v.valor.length > 7;
    var valorTexto = v.valorTexto || (typeof v.valor === 'string' ? v.valor : '');
    var leer = frases([c.etiqueta + ': ' + (v.hecho ? minuscula(fin) : minuscula(valorTexto) + (v.rotulo ? ' ' + v.rotulo : '') + (v.hoy ? ', hoy' : '')),
      typeof nota === 'string' ? nota : v.notaTexto, larga]);
    var a = enlaceInicio(rol, destino, { class: 'indicador' + (v.hecho ? ' hecha' : v.hoy ? ' es-hoy' : ''), 'data-cat': cat || null, elegido: v.elegido }, [
      sr(leer),
      oculto(h('span', { class: 'indicador-cabeza' }, icono(c.icono), h('span', { class: 'indicador-etiqueta' }, c.etiqueta))),
      oculto(v.hecho ? h('span', { class: 'indicador-fila' }, h('span', { class: 'indicador-hecho' }, visto(), h('span', null, fin)))
        : h('span', { class: 'indicador-fila' },
          h('span', { class: 'indicador-valor' + (largo ? ' largo' : '') }, v.valor),
          v.rotulo ? h('span', { class: 'indicador-rotulo' + (v.rotulo.length > 12 ? ' largo' : '') }, ' ' + v.rotulo) : null,
          v.hoy ? pastilla('hoy') : null)),
      oculto(h('span', { class: 'indicador-barra' }, v.hecho ? null : v.barra || null)),
      oculto(h('span', { class: 'indicador-nota' }, sinViuda(nota) || null)),
      oculto(h('span', { class: 'indicador-accion' },
        h('span', null, h('span', { class: 'accion-larga' + (corta ? ' con-corta' : '') }, larga), corta ? h('span', { class: 'accion-corta' }, corta) : null),
        flecha())),
    ]);
    // El globo de una cifra (las piezas del dosier, los pasos del caso): con el ratón, al detenerse en la cifra o en su
    // medidor, no al cruzar la tarjeta; con el foco, solo con el del teclado (ver conGlobo).
    if (v.globo && !v.hecho) conGlobo(a, v.globo, true, false, [a.querySelector('.indicador-fila'), a.querySelector('.indicador-barra')]);
    return a;
  }
  function filaCifras(rol, cifras) {
    // siOtra: si jefatura ha elegido a otra persona para lo que te proponían, la cifra cambia (ver «variante»).
    var cs = cifras.map(function (c) { return variante(rol, c); });
    var vs = cs.map(function (c) { return valorCifra(rol, c); });
    // En el móvil van dos por fila. Ocupa la fila entera la que lleva pasos con nombre, la que lo pide (ancha: true)
    // o la que tiene una acción que no cabe en media tarjeta (sin accionCorta), y, si en una racha de medias
    // queda una suelta, la última de la racha.
    var entera = vs.map(function (v, i) { return !!v.ancha || !!cs[i].ancha || accionMovil(v, cs[i]).length > 16; });
    var racha = [];
    var cerrar = function () { if (racha.length % 2) entera[racha[racha.length - 1]] = true; racha = []; };
    entera.forEach(function (e, i) { if (e) cerrar(); else racha.push(i); });
    cerrar();
    return h('section', { class: 'indicadores-zona', 'aria-labelledby': 'indicadores-titulo' },
      h('h2', { class: 'sr', id: 'indicadores-titulo' }, 'Lo más importante'),
      h('ul', { class: 'indicadores', style: '--n:' + cs.length }, cs.map(function (c, i) { return h('li', { class: entera[i] ? 'entera' : null }, cifra(rol, c, vs[i])); })));
  }

  /* El día, como el horario del colegio: una columna por sesión y un carril por grupo o por persona.
     Las pausas sin nada (la comida, el recreo de quien no vigila) son un separador fino.
     Cada celda dice su estado con icono y texto: por confirmar (borde discontinuo), confirmada (pizarra),
     sin cambios (salvia) o aviso (chispa suave). Solo las celdas con cambio reciben el foco. */
  // siElegido: las sesiones que DirectorIA proponía a otra persona y para las que jefatura te ha elegido a ti. Salen en su
  // franja como «cubre», en lugar de lo que tenías a esa hora, y cuentan en tu recuento; su «aviso» va bajo el día.
  function sesionesDe(rol, c, pos) {
    var extra = [].concat(c.siElegido || []).filter(function (x) { return teElige(rol, x.cuando); });
    if (!extra.length) return { sesiones: c.sesiones, avisos: [] };
    var tapadas = extra.map(function (x) { return pos[x.franja]; });
    var quedan = c.sesiones.filter(function (s) {
      var i = pos[s.franja], j = s.hasta ? pos[s.hasta] : i;
      return !tapadas.some(function (k) { return k >= i && k <= j; });
    });
    return {
      sesiones: quedan.concat(extra.map(function (x) { return { franja: x.franja, titulo: x.titulo, detalle: x.detalle, tipo: 'cubre', sigue: x.cuando, nota: x.nota }; })),
      avisos: extra.map(function (x) { return x.aviso; }).filter(Boolean),
    };
  }
  function lineaDelDia(rol, dia) {
    var franjas = dia.franjas || HORARIO;
    var yo = D.roles[rol].persona.nombre;
    var pos = {}, usada = {};
    franjas.forEach(function (f, i) { pos[f.id] = i; });
    // Cada carril con su variante (siOtra, siConfirmada) y con las sesiones para las que jefatura te ha elegido.
    var vistos = dia.carriles.map(function (c0) { var c = variante(rol, c0); return { c0: c0, c: c, d: sesionesDe(rol, c, pos) }; });
    vistos.forEach(function (v) { v.d.sesiones.forEach(function (s) { var i = pos[s.franja], j = s.hasta ? pos[s.hasta] : i; for (var k = i; k <= j; k++) usada[k] = true; }); });
    var fina = franjas.map(function (f, k) { return !!f.pausa && !usada[k]; });
    var cols = franjas.map(function (f, k) { return fina[k] ? '.75rem' : 'minmax(0, 1fr)'; }).join(' ');
    var primera = franjas.filter(function (f) { return !f.pausa; })[0];
    var cabeza = h('div', { class: 'horario-cabeza', 'aria-hidden': 'true' },
      franjas.map(function (f, k) { return h('span', { class: 'franja' + (fina[k] ? ' fina' : '') }, fina[k] ? null : [h('b', null, f.nombre), ' ', f.desde]); }));
    var estados = [];
    var carriles = vistos.map(function (v, ci) {
      // siOtra: los textos del carril cambian si jefatura ha elegido a otra persona para lo que te proponían.
      var c = v.c, cambiada = c !== v.c0 || v.d.avisos.length > 0;
      // lugares: dónde cubre cada propuesta que es tuya («la 6.ª» y «la salida», las dos de g4), para la línea de estado.
      // otras: las que DirectorIA te proponía y jefatura ha dado a otra persona. clases: las sesiones «clase» que quedan.
      var seguidos = {}, celdas = [], iguales = {}, lugares = [], otras = 0, clases = 0;
      v.d.avisos.forEach(function (a) { estados.push(h('p', { class: 'dia-aviso carril-aviso' }, glifo('aviso'), h('span', null, a))); });
      v.d.sesiones.forEach(function (s) {
        var i = pos[s.franja], j = s.hasta ? pos[s.hasta] : i;
        var e = s.sigue ? estadoDe(rol, s.sigue) : null;
        // Lo que DirectorIA te proponía y jefatura ha dado a otra persona ya no es tuyo: no entra en tu recuento.
        if (s.sigue && s.tipo === 'cubre') {
          if (otraPersona(rol, s.sigue)) otras++;
          else { seguidos[s.sigue] = e; lugares.push({ k: i, ref: s.sigue, texto: laFranja(franjas[i]) + (j > i ? ' y ' + laFranja(franjas[j]) : '') }); }
        }
        if (s.tipo === 'clase') clases++;
        var el = celdaSesion(s, franjas[i], franjas[j], i, j, e, j === franjas.length - 1, yo, quienDecide(rol, s.sigue));
        celdas.push({ k: i, el: el });
        if (s.tipo === 'igual') (iguales[s.detalle || ''] = iguales[s.detalle || ''] || []).push({ s: s, f: franjas[i], el: el });
      });
      // Las pausas: un separador fino si ningún carril las usa; si otro carril sí, una celda vacía.
      franjas.forEach(function (f, k) {
        var ocupada = v.d.sesiones.some(function (s) { return pos[s.franja] <= k && (s.hasta ? pos[s.hasta] : pos[s.franja]) >= k; });
        if (fina[k]) celdas.push({ k: k, el: h('li', { class: 'sesion separador', 'aria-hidden': 'true', style: 'grid-column:' + (k + 1) }) });
        else if (f.pausa && !ocupada) celdas.push({ k: k, el: h('li', { class: 'sesion vacia', 'aria-hidden': 'true', style: 'grid-column:' + (k + 1) }) });
      });
      celdas.sort(function (a, b) { return a.k - b.k; });
      // En filas (el móvil), las sesiones sin cambios con el mismo detalle se juntan al final: «2.ª, 4.ª y 5.ª: con su especialista».
      Object.keys(iguales).forEach(function (d) {
        var g = iguales[d];
        if (g.length < 2) return;
        g.forEach(function (x) { x.el.classList.add('junta'); });
        var cuales = juntar(g.map(function (x) { return x.f.nombre; }));
        var que = juntar(g.map(function (x) { return x.s.titulo; }));
        celdas.push({ k: 999, el: h('li', { class: 'sesion t-igual juntas' },
          sr(cuales + ': ' + (d ? minuscula(d) + ', ' : '') + que + '. Sin cambios.'),
          h('span', { class: 'sesion-texto', 'aria-hidden': 'true' }, h('b', null, cuales + (d ? ': ' + minuscula(d) : '')), h('span', { class: 'sesion-detalle' }, que))) });
      });
      // Las propuestas en el orden del día (la 3.ª que te da jefatura va entre la 1.ª y la 6.ª, no al final).
      lugares.sort(function (a, b) { return a.k - b.k; });
      var claves = lugares.map(function (x) { return x.ref; }).filter(function (x, n, xs) { return xs.indexOf(x) === n; });
      var hechas = claves.filter(function (x) { return seguidos[x].hecho; });
      // Sin nada tuyo que cubrir (jefatura lo ha dado todo a otras personas): lo que dice siNinguna.
      var nada = !claves.length;
      if (nada && otras && c.siNinguna) { c = Object.assign({}, c, c.siNinguna); cambiada = true; }
      // Lo que rellena los textos del carril: {hechas} y {faltan} (dónde cubres, confirmado o no: «la 1.ª, la 6.ª y la
      // salida»), {n} y {de} (cuántas propuestas, como el recuento) y {clases} (cuántas sesiones «clase» quedan, en letra).
      var donde = function (hecha) { return juntar(lugares.filter(function (x) { return !!seguidos[x.ref].hecho === hecha; }).map(function (x) { return x.texto; })); };
      var datos = { n: hechas.length, de: claves.length, hechas: donde(true), faltan: donde(false), clases: NUMEROS[clases] || String(clases) };
      var detalle = rellenar(c.detalle, datos);
      var id = 'carril-' + ci;
      var cuenta = claves.length ? h('span', { class: 'carril-cuenta' }, medidor(claves.map(function (x) { return seguidos[x].hecho ? 'lleno' : null; })),
        h('span', null, h('b', null, hechas.length + ' de ' + claves.length), ' ' + (c.cuenta || 'confirmadas'))) : null;
      if (claves.length || cambiada) {
        // Sin nada tuyo que confirmar, la línea es un aviso. Con todo confirmado, «alTerminar» con la hora; con una parte,
        // «parcial» (lo confirmado ya se ha avisado; lo demás, no); sin nada confirmado, «pendiente».
        var todas = !nada && hechas.length === claves.length, alguna = hechas.length > 0 && !todas;
        var hora = ultimaHora(hechas.map(function (x) { return seguidos[x].hora; }));
        var pendiente = claves.filter(function (x) { return !seguidos[x].hecho; })[0];
        var linea = rellenar(nada ? (c.linea || c.alTerminar) : todas ? c.alTerminar : alguna && c.parcial ? c.parcial : c.pendiente, datos);
        // Lo que oye el lector de pantalla va en una sola frase («8:01: Jefatura ha confirmado…»), sin signos sueltos.
        estados.push(h('div', { class: 'carril-estado' + (todas ? ' hecho' : '') }, nada ? glifo('aviso') : todas ? visto() : glifo('reloj'),
          h('p', null, todas ? [sr((hora ? hora + ': ' : '') + linea), oculto(h('span', null, hora ? h('b', null, hora + ' · ') : null, linea))] : linea),
          todas || nada ? null : atajoDe(rol, pendiente)));
      }
      return h('div', { class: 'carril' },
        h('div', { class: 'carril-titulo', id: id }, sr([c.titulo, detalle, claves.length ? hechas.length + ' de ' + claves.length + ' ' + (c.cuenta || 'confirmadas') : null].filter(Boolean).join(', ')),
          oculto(icono(c.icono)), oculto(h('b', null, c.titulo)), detalle ? oculto(h('span', { class: 'carril-detalle' }, detalle)) : null, oculto(cuenta)),
        h('ol', { class: 'carril-sesiones', 'aria-labelledby': id }, celdas.map(function (x) { return x.el; })));
    });
    return h('section', { class: 'tarjeta panel-dia', 'aria-labelledby': 'dia-titulo' },
      h('div', { class: 'panel-cabeza' },
        h('h2', { id: 'dia-titulo' }, dia.titulo),
        h('span', { class: 'ahora' }, glifo('reloj'), sr('Son las ' + horaActual() + (primera ? ', clases desde las ' + primera.desde : '') + '.'),
          oculto(h('span', null, 'Son las ' + horaActual() + (primera ? ' · clases desde las ' + primera.desde : '')))),
        dia.nota ? h('p', { class: 'panel-nota' }, dia.nota) : null),
      dia.aviso ? h('p', { class: 'dia-aviso' }, glifo('aviso'), h('span', null, dia.aviso)) : null,
      h('div', { class: 'horario', style: '--cols:' + cols }, cabeza, carriles),
      estados);
  }
  // Mientras falte confirmar algo que se decide en otro perfil, un atajo de la demo para ir allí.
  function atajoDe(rol, ref) {
    var s = String(ref || ''), barra = s.indexOf('/');
    if (barra < 1 || s.slice(0, barra) === rol || !D.roles[s.slice(0, barra)]) return null;
    var otro = s.slice(0, barra), m = modulo(otro, s.slice(barra + 1).split('#')[0]);
    if (!m) return null;
    return h('a', { class: 'atajo', href: enlace(otro, m.id) }, h('span', null, (m.tipo === 'aprobaciones' ? 'Ver la propuesta' : 'Ir a «' + m.menu + '»') + ' (atajo de la demo)'), flecha());
  }
  // Una franja dicha dentro de una frase: «la 1.ª», «el recreo», «la salida».
  function laFranja(f) { var n = String(f.nombre || ''); return f.conArticulo || (/^recreo$/i.test(n) ? 'el recreo' : 'la ' + (/^\d/.test(n) ? n : minuscula(n))); }
  var NUMEROS = ['ningún', 'un', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
  // Rellena los huecos de un texto del carril: «{hechas}», «{faltan}», «{n}», «{de}», «{clases}». Con mayúscula
  // («{Faltan}»), el valor empieza por mayúscula: va al principio de una frase.
  function rellenar(t, datos) {
    if (typeof t !== 'string') return t;
    return t.replace(/\{([A-Za-z]+)\}/g, function (todo, k) {
      var x = datos[k.toLowerCase()];
      if (x === undefined || x === null) return todo;
      x = String(x);
      return k.charAt(0) === k.charAt(0).toUpperCase() ? mayuscula(x) : x;
    });
  }
  // El nombre de una persona no se parte: si no cabe, nombre e inicial («Pablo S.»).
  function persona(nombre) {
    var p = String(nombre || '').split(' ');
    return h('span', { class: 'persona' }, h('span', { class: 'nombre-largo' }, nombre), h('span', { class: 'nombre-corto' }, p.length > 1 ? p[0] + ' ' + p[1].charAt(0) + '.' : nombre));
  }
  /* Una sesión del día. yo: la persona del perfil (si es quien cubre, «Cubres tú» o «Propuesta: tú»).
     decide: quién confirma («jefatura»), o null si es el propio perfil, y entonces el globo le habla de tú.
     Si jefatura elige a otra persona que la propuesta, la celda dice «Elección: Rosa Medina» («Elección: tú» si te elige
     a ti); y si la propuesta eras tú, al confirmarse la celda pasa a aviso: «Ya no la cubres · La cubre Rosa Medina». */
  function celdaSesion(s, f1, f2, i, j, e, ultima, yo, decide) {
    var nombre = f1 === f2 ? f1.nombre : f1.nombre + ' y ' + f2.nombre;
    var horas = f1.desde + (f2.hasta ? '-' + f2.hasta : '');
    var leerHoras = f2.hasta ? 'de ' + f1.desde + ' a ' + f2.hasta : 'a las ' + f1.desde;
    var cubre = s.tipo === 'cubre', hecha = !!(cubre && e && e.hecho);
    var quien = cubre && e ? e.quien || null : null;
    var titulo = s.titulo, detalle = s.detalle;
    // Si el título es la persona (como en el primer formato), la persona sale de jefatura y el título pasa a ser lo que se cubre.
    if (cubre && e && e.personas && e.personas.indexOf(titulo) >= 0 && detalle) { titulo = detalle; detalle = null; }
    var elegida = !!(quien && e.propuesta && quien !== e.propuesta);
    var sinTi = !!(cubre && e && e.propuesta === yo && quien && quien !== yo);
    var estado = null, linea = null, leerEstado = '', clase = '';
    var aLas = hecha && e.hora ? ' a las ' + e.hora : '';
    if (sinTi && hecha) {
      // Te la proponían a ti y jefatura ha confirmado a otra persona: un aviso, fuera de tu recuento.
      estado = [glifo('aviso'), h('span', null, 'Ya no la cubres')]; linea = ['La cubre ', persona(quien)];
      leerEstado = 'Ya no la cubres: la cubre ' + quien + ', confirmada' + aLas; clase = ' t-aviso sin-ti';
    } else if (cubre) {
      // Por confirmar: «…», «Por confirmar» y debajo «Propuesta: Pablo Sanz». Confirmada: ✓, «Cubre Pablo Sanz» y «Confirmada a las 8:01».
      var tu = quien && quien === yo;
      if (hecha) { estado = [visto(), h('span', null, tu ? 'Cubres tú' : quien ? ['Cubre ', persona(quien)] : 'Confirmada')]; linea = quien ? 'Confirmada' + aLas : (aLas ? mayuscula(aLas.trim()) : null); leerEstado = 'Confirmada' + aLas; clase = ' confirmada'; }
      // «Propuesta:» (la de DirectorIA) o «Elección:» (la de jefatura), con la persona en su propia línea en la rejilla.
      else { estado = [glifo('espera'), h('span', null, 'Por confirmar')]; linea = quien ? [elegida ? 'Elección: ' : 'Propuesta: ', tu ? 'tú' : persona(quien)] : null; leerEstado = 'Por confirmar'; clase = ' por-confirmar'; }
    } else if (s.tipo === 'aviso') { estado = [glifo('aviso'), h('span', null, s.aviso)]; leerEstado = s.aviso; }
    else if (s.tipo === 'igual') leerEstado = 'Sin cambios';
    var cambio = !!estado;
    var leer = nombre + ', ' + leerHoras + ': ' + (quien && !(sinTi && hecha) ? quien + (quien === yo ? ' (tú)' : '') + ', ' : '') + titulo + (detalle ? ', ' + minuscula(detalle) : '') + '.' + (leerEstado ? ' ' + leerEstado + '.' : '');
    var li = h('li', { class: 'sesion t-' + s.tipo + clase, style: 'grid-column:' + (i + 1) + ' / ' + (j + 2), tabindex: cambio ? '0' : null },
      sr(leer),
      h('span', { class: 'sesion-franja', 'aria-hidden': 'true' }, h('b', null, nombre), h('span', null, horas)),
      h('span', { class: 'sesion-texto', 'aria-hidden': 'true' }, h('b', null, titulo), detalle ? h('span', { class: 'sesion-detalle' }, detalle) : null),
      estado ? h('span', { class: 'sesion-cambio', 'aria-hidden': 'true' }, h('span', { class: 'sesion-estado' }, estado), linea ? h('span', { class: 'sesion-quien' }, linea) : null) : null);
    // El globo: la hora, quién confirma y por qué (la materia, la persona y el estado ya están en la celda).
    var lineas = [nombre + (f1.pausa ? '' : ' hora') + ', ' + leerHoras];
    if (cubre) {
      var Decide = decide ? mayuscula(decide) : null, aTi = quien === yo;
      if (hecha) lineas.push(!decide ? 'La has confirmado' + aLas + '.' : sinTi ? Decide + ' ha elegido a ' + quien + ' y lo ha confirmado' + aLas + '.' : Decide + ' la ha confirmado' + aLas + '.');
      else if (elegida) lineas.push(decide ? Decide + (aTi ? ' te ha elegido' : ' ha elegido a ' + quien) + '. Falta que lo confirme.' : 'Has elegido a ' + quien + '. Falta que lo confirmes.');
      else lineas.push('Propuesta de DirectorIA con las reglas del colegio. Falta que la ' + (decide ? 'confirme ' + decide : 'confirmes') + '.');
      // La nota explica la propuesta de DirectorIA: si jefatura ha elegido a otra persona, ya no vale. Si te ha elegido a ti
      // (una sesión de siElegido), la nota es la tuya: lo que dejas de hacer a esa hora.
      if (elegida) lineas.push(sinTi ? 'DirectorIA te proponía a ti.' : 'DirectorIA proponía a ' + e.propuesta + '.');
      if (s.nota && (!elegida || aTi)) lineas.push(s.nota);
    } else if (s.nota) lineas.push(s.nota);
    // Una sesión sin cambios y sin nota no lleva globo: solo diría la hora, que ya está en la cabecera de su columna.
    if (!cambio && lineas.length < 2) return li;
    return conGlobo(li, lineas, cambio, ultima);
  }

  /* Lo que te necesita: la lista de lo que pide acción, por grupos (Hoy, Esta semana, Para saber).
     Cada grupo lleva su recuento de lo que queda; lo pendiente va arriba y lo hecho baja al final, con su verbo y su hora.
     Las filas que resumen un correo llevan la insignia de la IA; los choques van en una tarjeta de aviso. */
  // Cómo se ve una fila o una marca según lo que sigue (x es la fila con su variante «siOtra», si la hay):
  // - hecha, cambia con «si» (titulo, detalle y estado, que por defecto pasa a «hecho»); sin «si.detalle», no repite
  //   su detalle, que suele decir lo que había que hacer;
  // - un correo archivado sin responder cuenta como hecho en la lista («Archivado a las…»), pero sin «si»: archivar
  //   no es avisar ni responder. En la agenda no cuenta: el plazo sigue en pie;
  // - a medias (aMedias, con su propio «sigue»), cambia sin darse por hecha: el visto bueno al dosier sin enviarlo;
  // - un dictado ya dictado y por revisar cambia con «siDictado».
  function siguiendo(rol, it, enAgenda) {
    var x = variante(rol, it);
    var e = x.sigue ? estadoDe(rol, x.sigue) : null;
    var si = !!(e && e.hecho && !(enAgenda && e.archivado));
    var otro = (si && !e.archivado && x.si) || {};
    if (!si) otro = aMediasDe(rol, x) || otro;
    // A medias puede llevar a otro sitio («Falta enviarlo a Inspección desde el correo» lleva al correo).
    if (otro.ir !== undefined) x = Object.assign({}, x, { ir: otro.ir });
    if (!si && x.siDictado && e && (e.fase === 'dictado' || e.fase === 'borrador')) otro = x.siDictado;
    var estado = si ? otro.estado || 'hecho' : otro.estado || x.estado;
    // cat: el tono de la fila o de la marca, el de la función a la que lleva (su enlace vigente); sin función, ninguno.
    return { x: x, estado: estado, cat: categoria(rol, x.ir), titulo: otro.titulo || x.titulo || x.texto,
      detalle: otro.detalle !== undefined ? otro.detalle : (si && estado === 'hecho' ? null : x.detalle),
      hora: e && e.hora, verbo: e && e.verbo, archivado: !!(si && e.archivado) };
  }
  function hechoCon(verbo, hora) { return (verbo || 'Hecho') + (hora ? ' a las ' + hora : ''); }
  // El verbo de lo hecho: el de los datos («Firmada») o, si el correo se archivó, «Archivado».
  function verboDe(x, v) { return v.archivado ? v.verbo : x.verbo || v.verbo; }
  // Una fila sale de un correo si sigue o lleva a un correo (salvo que diga ia: false): su texto es un resumen de la IA.
  function deCorreo(it) {
    if (it.ia !== undefined) return !!it.ia;
    return String(it.sigue || it.ir || '').replace(/^[a-z]+\//, '').indexOf('correo:') === 0;
  }
  function listaInicio(rol, l) {
    var grupos = [];
    l.items.forEach(function (it) {
      var g = grupos[grupos.length - 1];
      if (!g || g.titulo !== it.grupo) grupos.push(g = { titulo: it.grupo, items: [] });
      g.items.push({ v: siguiendo(rol, it) });
    });
    return h('section', { class: 'tarjeta panel-lista', 'aria-labelledby': 'lista-titulo' },
      h('div', { class: 'panel-cabeza' }, h('h2', { id: 'lista-titulo' }, l.titulo)),
      h('div', { class: 'grupos', style: '--g:' + grupos.length + anchosGrupos(grupos) }, grupos.map(function (g) {
        var pend = g.items.filter(function (x) { return x.v.estado !== 'hecho'; });
        var hechos = g.items.filter(function (x) { return x.v.estado === 'hecho'; });
        // El recuento cuenta lo que queda por hacer (hoy y pendiente). Las filas para saber solo cuentan en un grupo
        // que es todo para saber («Para saber · 1»): «16:00: la salida de 3.º B ya no es tuya» no suma en «Hoy».
        var accionable = function (e0) { return e0 === 'hoy' || e0 === 'pendiente'; };
        var deHacer = g.items.some(function (x) { return accionable(x.v.x.estado) || accionable(x.v.estado); });
        var n = deHacer ? pend.filter(function (x) { return accionable(x.v.estado); }).length : pend.length;
        return h('div', { class: 'grupo-lista' },
          // «Hoy: 2 pendientes»; en un grupo que es solo para saber, «Para saber: 1».
          h('h3', { class: 'grupo-titulo' }, sr(g.titulo + ': ' + (!n ? 'nada pendiente' : !deHacer ? String(n) : n + (n === 1 ? ' pendiente' : ' pendientes'))),
            oculto(h('span', null, g.titulo)),
            oculto(h('span', { class: 'grupo-cuenta' }, ' · ', n ? String(n) : [glifo('hecho'), 'hecho']))),
          h('ul', { class: 'filas' }, pend.concat(hechos).map(function (x) { return filaInicio(rol, x.v.x, x.v); })));
      })));
  }
  // Con dos grupos muy desiguales (cuatro filas y dos), el que tiene más se lleva el doble de ancho: así las dos columnas
  // acaban a una altura parecida y no queda un hueco grande debajo del corto.
  function anchosGrupos(grupos) {
    if (grupos.length !== 2) return '';
    var a = grupos[0].items.length, b = grupos[1].items.length;
    if (Math.abs(a - b) < 2) return '';
    return ';--cols-grupos:' + (a > b ? 'minmax(0, 2fr) minmax(0, 1fr)' : 'minmax(0, 1fr) minmax(0, 2fr)');
  }
  function filaInicio(rol, it, v) {
    var hecho = v.estado === 'hecho';
    var choque = !!it.choque && !hecho;
    var ia = deCorreo(it);
    var hechaCon = hecho ? hechoCon(verboDe(it, v), v.hora) : null;
    // «Choque.» va como frase aparte: el título puede llevar sus propios dos puntos («AMPA: fecha del festival…»).
    var leer = frases([choque ? 'Choque' : null, v.titulo, v.detalle, ia ? 'Resumido con IA' : null, !hecho && it.fecha ? it.fecha : null, hechaCon]);
    var dentro = [sr(leer), oculto(icono(hecho ? 'hecho' : choque ? 'alerta' : it.icono)),
      oculto(h('span', { class: 'fila-texto' },
        choque ? h('span', { class: 'etiqueta-choque' }, 'Choque') : null,
        h('b', null, v.titulo),
        v.detalle ? h('span', null, v.detalle) : null,
        ia ? h('span', { class: 'marca-ia' }, insignia(), 'Resumido con IA') : null,
        hecho ? h('span', { class: 'fila-hecho' }, pastilla('hecho', hechaCon)) : null)),
      oculto(h('span', { class: 'fila-marca' }, !hecho && it.fecha ? h('span', { class: 'chip-fecha' }, it.fecha) : null)), it.ir ? flecha() : null];
    return h('li', { class: 'fila' + (hecho ? ' hecha' : '') + (choque ? ' choque' : '') + (it.ir ? '' : ' sin-enlace'), 'data-cat': v.cat || null },
      it.ir ? enlaceInicio(rol, it.ir, { class: 'fila-dentro' }, dentro) : h('div', { class: 'fila-dentro' }, dentro));
  }

  /* Lo que viene: un calendario de pocas semanas, con marcas que tienen forma (banderín, calendario, triángulo, ✓),
     y al lado la agenda con lo de cada día, que dice cuándo es contado desde hoy («Mañana · 11:45»). */
  function cuandoDia(iso, marcas) {
    var hora = marcas.length === 1 && marcas[0].hora ? marcas[0].hora : null;
    return { texto: relativo(iso), hora: hora };
  }
  // El día dicho para el lector de pantalla: «Jueves 26 de noviembre, la semana que viene».
  function diaParaLeer(iso) { return mayuscula(fechaLarga(iso)) + ', ' + minuscula(relativo(iso)); }
  function agendaInicio(rol, ag) {
    var porDia = {};
    ag.marcas.forEach(function (m) { (porDia[m.fecha] = porDia[m.fecha] || []).push(m); });
    var fechas = Object.keys(porDia).sort();
    return h('section', { class: 'tarjeta panel-agenda', 'aria-labelledby': 'agenda-titulo' },
      h('div', { class: 'panel-cabeza' }, h('h2', { id: 'agenda-titulo' }, ag.titulo)),
      h('div', { class: 'agenda-cuerpo' }, miniCalendario(rol, ag, porDia),
        h('ol', { class: 'agenda' }, fechas.map(function (f) {
          var d = fecha(f), ms = porDia[f], cu = cuandoDia(f, ms);
          var vs = ms.map(function (m) { return siguiendo(rol, m, true); });
          var orden = vs.filter(function (v) { return v.estado !== 'hecho'; }).concat(vs.filter(function (v) { return v.estado === 'hecho'; }));
          return h('li', { class: 'ag-dia', id: 'ag-' + f, tabindex: '-1' },
            h('span', { class: 'ag-fecha', 'aria-hidden': 'true' }, h('span', null, DIA_CORTO[d.getUTCDay()]), h('b', null, String(d.getUTCDate())), h('small', null, MES_CORTO[d.getUTCMonth()])),
            h('div', { class: 'ag-contenido' },
              h('h3', { class: 'ag-cuando' }, sr(diaParaLeer(f) + (cu.hora ? ', a las ' + cu.hora : '')),
                oculto(h('span', null, cu.texto + (cu.hora ? ' · ' + cu.hora : '')))),
              h('ul', { class: 'ag-items' }, orden.map(function (v) { return marcaAgenda(rol, v.x, v, ms.length > 1, f); }))));
        }))));
  }
  function formaDe(m, hecho) { return hecho ? 'hecho' : m.choque ? 'aviso' : m.tipo; }
  // Cada enlace de la agenda empieza por el día y la hora: con el tabulador se oye cuándo es, aunque el día vaya fuera.
  function marcaAgenda(rol, m, v, conHora, iso) {
    var hecho = v.estado === 'hecho';
    var choque = !!m.choque && !hecho;
    var forma = formaDe(m, hecho);
    var fuente = m.fuente === 'correo' ? 'Sacado del correo' : m.fuente === 'circular' ? 'Sacado de la circular' : null;
    var titulo = (conHora && m.hora ? m.hora + ' · ' : '') + v.titulo;
    var hechaCon = hecho ? hechoCon(verboDe(m, v), v.hora) : null;
    var leer = frases([diaParaLeer(iso) + (m.hora ? ', a las ' + m.hora : '') + '. ' + (choque ? 'Choque. ' + v.titulo : v.titulo + (hecho ? '' : ' (' + minuscula(NOMBRE_FORMA[forma]) + ')')),
      v.detalle, fuente, hechaCon]);
    var dentro = [sr(leer), oculto(h('span', { class: 'ag-forma forma-' + forma }, glifo(forma))),
      oculto(h('span', { class: 'fila-texto' },
        choque ? h('span', { class: 'etiqueta-choque' }, 'Choque') : null,
        h('b', null, titulo),
        v.detalle ? h('span', null, v.detalle) : null,
        fuente ? h('span', { class: 'marca-ia' }, insignia(), fuente) : null,
        hecho ? h('span', { class: 'fila-hecho' }, pastilla('hecho', hechaCon)) : null)),
      m.ir ? flecha() : null];
    return h('li', { class: 'ag-item' + (hecho ? ' hecha' : '') + (choque ? ' choque' : ''), 'data-cat': v.cat || null },
      m.ir ? enlaceInicio(rol, m.ir, { class: 'ag-dentro' }, dentro) : h('div', { class: 'ag-dentro' }, dentro));
  }
  function miniCalendario(rol, ag, porDia) {
    var reducido = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var presentes = {};
    var filas = [];
    for (var w = 0; w < (ag.semanas || 3); w++) {
      var celdas = [];
      for (var k = 0; k < 7; k++) (function (iso, finde, ultima) {
        var d = fecha(iso), n = String(d.getUTCDate());
        var marcas = porDia[iso] || [];
        var num = d.getUTCDate() === 1 ? [n, h('small', null, ' ' + MES_CORTO[d.getUTCMonth()])] : n;
        var cls = (iso < HOY ? 'pasado' : iso === HOY ? 'hoy' : '') + (finde ? ' finde' : '');
        var dentro;
        if (marcas.length) {
          var cu = cuandoDia(iso, marcas);
          var vs = marcas.map(function (m) { return siguiendo(rol, m, true); });
          var formas = marcas.map(function (m, i) { var f = formaDe(vs[i].x, vs[i].estado === 'hecho'); presentes[f] = true; return f; });
          var hechaV = function (i) { return vs[i].estado === 'hecho'; };
          var textos = marcas.map(function (m, i) { return (marcas.length > 1 && m.hora ? m.hora + ' · ' : '') + (vs[i].x.choque && !hechaV(i) ? 'Choque: ' + minusculaTitulo(vs[i].titulo) : vs[i].titulo) + (hechaV(i) ? ' (hecho)' : ''); });
          // «Miércoles 2 de diciembre, dentro de dos semanas. Choque: 4.º ESO A, con dos exámenes el mismo día. Ver en la agenda.»
          var leer = marcas.map(function (m, i) {
            var t = marcas.length > 1 && m.hora ? 'A las ' + m.hora + ', ' + minusculaTitulo(vs[i].titulo) : vs[i].titulo;
            return (vs[i].x.choque && !hechaV(i) ? 'Choque: ' + minusculaTitulo(t) : t) + (hechaV(i) ? ' (hecho)' : '');
          });
          // Los días del calendario no reciben el foco: la agenda tiene los mismos enlaces. Con el ratón, el globo da el detalle.
          dentro = conGlobo(h('button', {
            type: 'button', class: 'minical-dia', tabindex: '-1', 'aria-label': diaParaLeer(iso) + (cu.hora ? ', a las ' + cu.hora : '') + '. ' + leer.map(function (t) { return t + trasTexto(t).trim(); }).join(' ') + ' Ver en la agenda.',
            onclick: function () { var x = document.getElementById('ag-' + iso); if (x) { x.scrollIntoView({ block: 'nearest', behavior: reducido ? 'auto' : 'smooth' }); x.focus({ preventScroll: true }); } },
          }, h('span', null, num), h('span', { class: 'formas' }, formas.map(function (f, i) { var g = glifo(f, 'forma-' + f); if (vs[i].cat) g.setAttribute('data-cat', vs[i].cat); return g; }))),
          [cu.texto + (cu.hora ? ' · ' + cu.hora : ''), mayuscula(fechaLarga(iso))].concat(textos), false, ultima);
        } else if (iso === HOY) dentro = h('span', { class: 'minical-num' }, oculto(h('span', null, num)), sr(n + ', hoy'));
        else dentro = h('span', { class: 'minical-num' }, num);
        celdas.push(h('td', { class: cls.trim() || null }, dentro));
      })(masDias(ag.desde, w * 7 + k), k >= 5, k === 6);
      filas.push(h('tr', null, celdas));
    }
    var cab = ['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(function (x, i) { return h('th', { scope: 'col' }, h('span', { 'aria-hidden': 'true' }, x), sr(DIA_LARGO[(i + 1) % 7])); });
    var leyenda = ['plazo', 'evento', 'aviso', 'hecho'].filter(function (f) { return presentes[f]; }).map(function (f) { return h('span', null, glifo(f, 'forma-' + f), NOMBRE_FORMA[f]); });
    return h('div', { class: 'minical-caja' },
      h('table', { class: 'minical' }, h('caption', { class: 'sr' }, 'Calendario desde el ' + fechaLarga(ag.desde)), h('thead', null, h('tr', null, cab)), h('tbody', null, filas)),
      h('p', { class: 'leyenda', 'aria-hidden': 'true' }, leyenda, h('span', null, h('i', { class: 'muestra-hoy' }), 'Hoy')));
  }

  function etiquetaIr(rol, destino) {
    if (!destino) return 'Abrir';
    if (destino === 'correo') return 'Abrir el correo';
    if (destino.indexOf('correo:') === 0) return 'Leer el correo';
    var m = modulo(rol, destino);
    return m ? irAModulo(m) : 'Abrir';
  }
  // Los enlaces a funciones nombran el menú tal cual: «Ir a «Pendiente de firma»».
  function irAModulo(m) { return 'Ir a «' + m.menu + '»'; }

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
        // data-cat: el tono de la función a la que lleva el correo («Ir a…»), para el punto delante del asunto.
        return h('li', null, h('button', {
          type: 'button', class: 'mensaje' + (e ? ' hecho' : ''), 'aria-current': c.id === sel ? 'true' : 'false', 'data-k': 'msg-' + c.id, 'data-cat': categoria(rol, c.ir) || null,
          onclick: function () { S.sel[rol] = c.id; S.leyendo[rol] = true; repintar(); var l = raiz.querySelector('.lectura h2'); if (l && window.matchMedia('(max-width: 900px)').matches) l.focus(); },
        },
          h('span', { class: 'fila1' }, h('span', { class: 'de' }, c.de), h('span', { class: 'hora' }, c.hora)),
          h('span', { class: 'asunto' }, c.asunto),
          h('span', { class: 'extracto' }, (c.resumen || [])[0] || ''),
          h('span', { class: 'fila3' },
            e && e.estado === 'enviado' ? pastilla('hecho', (e.para ? 'Enviado ' : 'Respondido ') + e.hora) : e && e.estado === 'archivado' ? pastilla('hecho', 'Archivado') : pastilla(c.etiqueta.tipo, c.etiqueta.texto),
            h('span', { class: 'pastilla p-info' }, c.categoria))));
      })));

    var cabeza = conIcono(cabezaVista('Correo', 'Tu correo, resumido', n ? (n === 1 ? 'Tienes un correo con respuestas propuestas.' : 'Tienes ' + n + ' correos con respuestas propuestas.') + ' Elige una, cámbiala si hace falta y envíala tú: nada sale sin que lo envíes.' : 'No te queda ningún correo por responder.'), 'correo');
    return [cabeza, h('div', { class: 'correo' + (S.leyendo[rol] ? ' leyendo' : '') }, bandeja, actual ? lectura(rol, actual) : h('p', null, 'No hay correos.'))];
  }

  function lectura(rol, c) {
    var p = D.roles[rol];
    var e = (S.correo[rol] || {})[c.id];
    var claveB = rol + ':' + c.id;
    var b = S.borrador[claveB] || (S.borrador[claveB] = { opcion: (c.respuestas || []).length ? 0 : -1, texto: (c.respuestas && c.respuestas[0]) ? c.respuestas[0].texto : '' });
    var m = c.ir ? modulo(rol, c.ir) : null;
    // Cada respuesta propuesta va a quien escribió, con «Re:» y su asunto, salvo que traiga su propio «para» y «asunto»
    // (por ejemplo, una circular para las familias). «adjuntos» es lo que va adjunto a esa respuesta.
    var rSel = (c.respuestas || [])[b.opcion] || {};
    var para = rSel.para || (c.de + (c.deDetalle ? ' (' + c.deDetalle + ')' : ''));
    var asunto = rSel.asunto || 'Re: ' + c.asunto;
    var adj = rSel.adjuntos || [];
    // Archivar no lanza aviso flotante: el sello «Archivado a las…» ya lo dice, y en el móvil el aviso tapaba «Deshacer».
    // El foco pasa a «Deshacer», que lleva el sello como descripción: así lo oye también quien usa lector de pantalla.
    function archivar() {
      bolsa('correo', rol)[c.id] = { estado: 'archivado', hora: ahora() }; repintar();
      var x = raiz.querySelector('[data-k="deshacer-' + c.id + '"]'); if (x) x.focus();
    }

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
    // El enlace a la función lleva su tono (data-cat), como en el menú; el dictado y las circulares adaptadas, ninguno.
    if (c.nota) partes.push(h('div', { class: 'nota-ia' }, h('div', null, h('p', null, c.nota), m ? h('button', { class: 'enlace', type: 'button', style: 'margin-top:.375rem', 'data-cat': categoriaModulo(m) || null, onclick: function () { ir(rol, m.id); } }, irAModulo(m)) : null)));
    else if (m) partes.push(h('div', null, h('button', { class: 'enlace', type: 'button', 'data-cat': categoriaModulo(m) || null, onclick: function () { ir(rol, m.id); } }, irAModulo(m))));
    partes.push(h('details', { class: 'original' }, h('summary', null, 'Ver el correo original'), h('div', { class: 'texto-original' }, parrafos(c.original))));

    if (e && e.estado === 'enviado') {
      partes.push(h('section', { class: 'tarjeta enviado' },
        h('p', { class: 'sello' }, visto(), (e.para ? 'Enviado a ' + minuscula(e.para) : 'Respondido') + ' a las ' + e.hora + ' desde tu cuenta del colegio'),
        h('div', { class: 'cuerpo-enviado' }, parrafos(e.texto))));
    } else if (e && e.estado === 'archivado') {
      // Archivar no es definitivo: «Deshacer» devuelve el correo a la bandeja tal como estaba.
      partes.push(h('div', { class: 'acciones' },
        h('p', { class: 'sello', id: 'archivado-' + c.id }, visto(), 'Archivado a las ' + e.hora + '.'),
        boton('Deshacer', function () {
          delete S.correo[rol][c.id]; repintar();
          var x = raiz.querySelector('[data-k="enviar-' + c.id + '"], [data-k="archivar-' + c.id + '"]'); if (x) x.focus();
        }, { cls: 'boton-borde boton-pequeno', 'data-k': 'deshacer-' + c.id, 'aria-describedby': 'archivado-' + c.id })));
    } else if ((c.respuestas || []).length) {
      var area = h('textarea', { id: 'resp-' + c.id, 'data-k': 'area-' + c.id, 'aria-label': 'Texto de la respuesta', oninput: function (ev) { b.texto = ev.target.value; guardar(); } });
      area.value = b.texto;
      var opciones = h('div', { class: 'opciones', role: 'radiogroup', 'aria-label': 'Respuestas propuestas' }, c.respuestas.map(function (r, i) {
        return h('label', { class: 'opcion' },
          // Al cambiar de propuesta se guarda lo que has escrito en la que dejas, y vuelve si regresas a ella.
          h('input', { type: 'radio', name: 'op-' + c.id, checked: b.opcion === i, 'data-k': 'op-' + c.id + '-' + i, onchange: function () { b.textos = b.textos || {}; b.textos[b.opcion] = b.texto; b.opcion = i; b.texto = b.textos[i] !== undefined ? b.textos[i] : r.texto; repintar(); } }),
          h('span', { class: 't' }, r.titulo),
          h('span', { class: 'pre' }, r.texto.replace(/\s+/g, ' ')));
      }));
      partes.push(h('section', { class: 'tarjeta' },
        h('div', { class: 'tarjeta-cabeza' }, h('h3', null, 'Respuestas propuestas'), conInsignia('Preparadas con IA', true)),
        h('p', { style: 'font-size:var(--t-s)' }, 'Elige una y cámbiala lo que quieras. Nada se envía hasta que pulses Enviar.'),
        opciones,
        h('div', { class: 'editor' },
          h('p', { class: 'linea-campo' }, h('b', null, 'Para'), h('span', null, para)),
          h('p', { class: 'linea-campo' }, h('b', null, 'Asunto'), h('span', null, asunto)),
          adj.length ? h('div', { class: 'linea-campo' }, h('b', null, 'Adjuntos'), h('span', { class: 'adjuntos' }, adj.map(function (a) { return h('span', { class: 'adjunto' }, a); }))) : null,
          h('label', { class: 'sr', for: 'resp-' + c.id }, 'Texto de la respuesta'),
          area,
          h('div', { class: 'acciones' },
            boton('Revisar y enviar', function () {
              var texto = (S.borrador[claveB].texto || '').trim();
              if (!texto) { avisar('La respuesta está vacía', 'Elige una respuesta propuesta o escribe la tuya.'); return; }
              confirmar({
                titulo: '¿Enviar esta respuesta?',
                vista: [
                  h('p', null, h('b', null, 'Para: '), para),
                  h('p', null, h('b', null, 'Asunto: '), asunto),
                  adj.length ? h('p', null, h('b', null, 'Adjuntos: '), adj.join(', ')) : null,
                  parrafos(texto)],
                boton: 'Enviar desde mi cuenta del colegio',
                alAceptar: function () {
                  var hora = ahora();
                  // «opcion»: qué respuesta propuesta se ha enviado (el Inicio sigue 'correo:<id>#<n>': la que avisa, la que adjunta…).
                  bolsa('correo', rol)[c.id] = { estado: 'enviado', hora: hora, texto: texto, para: rSel.para || null, opcion: b.opcion };
                  repintar();
                  avisar(rSel.para ? 'Correo enviado' : 'Respuesta enviada', 'Ha salido desde tu cuenta del colegio. (En la demo no se envía nada.)');
                },
              });
            }, { 'data-k': 'enviar-' + c.id }),
            boton('Archivar sin responder', archivar, { cls: 'boton-borde', 'data-k': 'archivar-' + c.id })))));
    } else {
      partes.push(h('div', { class: 'acciones' }, boton('Archivar', archivar, { cls: 'boton-borde', 'data-k': 'archivar-' + c.id })));
    }
    return h('article', { class: 'lectura', 'aria-label': c.asunto }, partes);
  }

  /* ---------- Módulos ---------- */
  function vistaModulo(rol, m) {
    var fn = MODULOS[m.tipo];
    var cuerpo = fn ? fn(rol, m) : h('p', null, 'Esta función todavía no está en la demo.');
    return [conIcono(cabezaVista(m.antetitulo, m.titulo, m.entradilla), iconoModulo(rol, m)), m.confidencial ? bandaConfidencial(m.confidencial) : null].concat(cuerpo);
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
    if (m.contexto) cab.push(h('section', { class: 'tarjeta contexto' }, ilus('calendario', null, ''), h('div', null, h('b', null, m.contexto.titulo), h('p', null, m.contexto.texto))));
    cab.push(h('div', { class: 'tarjeta-cabeza' },
      h('p', null, esIA(m) ? conInsignia('Propuesta de la IA · ' + hechos + ' de ' + m.items.length + ' confirmadas', true) : sinInsignia('Propuesta de DirectorIA, con las reglas del colegio · ' + hechos + ' de ' + m.items.length + ' confirmadas')),
      // «Confirmar todas» es una sola decisión: todas quedan confirmadas a la misma hora.
      todos ? pastilla('hecho', 'Todo confirmado') : boton(m.botonTodo, function () { var hora = ahora(); m.items.forEach(function (it) { var e = est[it.id] || (est[it.id] = {}); if (!e.hecho) { e.hecho = true; e.hora = hora; e.quien = e.quien || it.propuesta; } }); comprobarTodo(); }, { 'data-k': 'todo-' + m.id })));
    var lista = h('ul', { class: 'propuestas' }, m.items.map(function (it) {
      var e = est[it.id] || {};
      var elegido = e.quien || it.propuesta;
      var opciones = [it.propuesta].concat(it.alternativas || []);
      var sel = h('select', { id: 'sel-' + m.id + '-' + it.id, 'data-k': 'sel-' + it.id, disabled: e.hecho ? true : null, onchange: function (ev) { (est[it.id] || (est[it.id] = {})).quien = ev.target.value; repintar(); } },
        opciones.map(function (o) { return h('option', { value: o, selected: o === elegido ? true : null }, o + (o === it.propuesta ? ' (propuesta)' : '')); }));
      return h('li', { class: 'propuesta' + (e.hecho ? ' hecha' : '') },
        h('div', { class: 'cuando' }, it.cuando, h('small', null, it.que)),
        h('div', { class: 'quien' }, h('label', { for: 'sel-' + m.id + '-' + it.id, class: 'sr' }, 'Quién cubre ' + it.cuando), sel),
        h('p', { class: 'motivo' }, esIA(m) ? insignia() : null, elegido === it.propuesta ? it.motivo : 'Has elegido a ' + elegido + '. DirectorIA lo tendrá en cuenta al proponer el reparto de las próximas guardias. En la demo, el Inicio de cada perfil enseña a quien elijas; las fichas siguen la propuesta inicial.'),
        h('div', { class: 'lado' },
          e.hecho ? pastilla('hecho', 'Confirmado ' + e.hora) : boton(m.boton, function () { confirmarUno(it); }, { cls: 'boton-pequeno', 'data-k': 'ok-' + it.id }),
          e.hecho && it.ficha ? pastilla('hecho', 'Ficha enviada a ' + elegido) : null));
    }));
    return cab.concat([lista, todos ? h('div', { class: 'aviso ok' }, visto(), h('p', null, m.alConfirmar)) : h('p', { class: 'nota-ia' }, 'Nada cambia hasta que confirmes. Puedes elegir a otra persona en cada sesión.')]);
  };

  // ed: lo que la persona ha cambiado en cada párrafo (por número de bloque); editable: si los párrafos se pueden cambiar ahora.
  function bloquesDoc(bloques, ed, editable) {
    var out = [];
    var campos = null;
    bloques.forEach(function (b, i) {
      if (b.tipo === 'campo') {
        if (!campos) { campos = h('dl', null); out.push(campos); }
        campos.append(h('div', { class: 'campo' }, h('dt', null, b.etiqueta), h('dd', null, b.texto)));
        return;
      }
      campos = null;
      if (b.tipo === 'titulo') out.push(h('h3', null, b.texto));
      else if (b.tipo === 'parrafo') {
        var txt = ed && ed[i] !== undefined ? ed[i] : b.texto;
        if (editable) out.push(h('div', { class: 'parrafo-edit', contenteditable: 'true', role: 'textbox', 'aria-multiline': 'true', 'aria-label': 'Texto editable del documento', oninput: function (ev) { ed[i] = ev.target.innerText.replace(/\n{3,}/g, '\n\n').trim(); guardar(); } }, parrafos(txt)));
        else out.push.apply(out, parrafos(txt));
      }
      else if (b.tipo === 'lista') out.push(h('ul', null, b.items.map(function (x) { return h('li', null, x); })));
      else if (b.tipo === 'aviso') out.push(h('div', { class: 'aviso' }, glifo('aviso'), h('p', null, b.texto)));
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
    // Lo que se cambia con «Editar el texto» se guarda en est.ed, así no se pierde al marcar casillas, dejar de editar ni dar el visto bueno.
    est.ed = est.ed || {};
    var doc = h('article', { class: 'papel-doc', 'aria-label': m.documento.titulo, 'data-k': 'doc-' + m.id },
      h('div', { class: 'doc-cabeza' }, h('h2', { class: 'doc-titulo' }, m.documento.titulo), m.documento.subtitulo ? h('p', { class: 'doc-sub' }, m.documento.subtitulo) : null),
      bloquesDoc(m.documento.bloques, est.ed, est.editando && !est.hecho),
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
          !hecho ? h('button', { class: 'enlace', type: 'button', style: 'font-size:var(--t-s)', 'data-k': 'plazo-' + m.id + '-' + i, onclick: function () { est[i] = true; est['h' + i] = horaActual(); repintar(); avisar('Marcado como hecho', it.titulo); } }, 'Marcar como hecho') : null));
    }));
  };

  // El estado de un documento del protocolo viene en palabras («Firmado el lun 16», «Para revisar»): el motor le pone el
  // glifo de su estado (✓, «…» o «i»), para que lo hecho y lo pendiente no se distingan solo leyendo. El texto no cambia.
  function estadoDocumento(t) {
    if (/^(firmad|revisad|enviad|hech|list)/i.test(t)) return 'hecho';
    if (/^en curso/i.test(t)) return 'curso';
    if (/^(para revisar|pendiente|por )/i.test(t)) return 'pendiente';
    return 'info';
  }
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
        h('ul', { class: 'piezas' }, m.documentos.map(function (d) { return h('li', { class: 'pieza' }, h('span', { class: 'n' }, d.nombre), pastilla(estadoDocumento(d.estado), d.estado)); }))),
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
        // En la demo solo hay una búsqueda: si se escribe otra, se dice y se vuelve a la del ejemplo.
        h('form', { class: 'buscador', role: 'search', onsubmit: function (ev) { ev.preventDefault(); if ((est.consulta || m.consulta).trim() !== m.consulta.trim()) { est.consulta = m.consulta; repintar(); avisar('En la demo hay una sola búsqueda', 'Te enseñamos la del ejemplo: «' + m.consulta + '».'); return; } est.buscado = true; repintar(); avisar('Búsqueda hecha', 'Ordenada por lo que más se parece a lo que pides.'); } },
          h('label', { class: 'sr', for: 'buscar-' + m.id }, 'Qué buscas'), entrada, h('button', { class: 'boton', type: 'submit' }, 'Buscar')),
        h('div', { class: 'chips' }, h('span', { class: 'con-insignia' }, insignia(), 'Entendido como'), m.entendido.map(function (c) { return h('span', { class: 'chip' }, c); })),
        h('div', { class: 'aviso' }, glifo('aviso'), h('p', null, m.aviso)),
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
        // Declarar que está hecho con IA es voluntario: no impide compartir. Si se marca, el recurso lleva la etiqueta.
        s.declaracion ? h('div', { class: 'campo-f' }, h('span', { class: 'etq' }, 'Si lo has hecho con IA'),
          h('label', { class: 'campo-casilla' }, h('input', { type: 'checkbox', checked: !!est.ia, disabled: est.compartido ? true : null, 'data-k': 'cas-ia', onchange: function (ev) { est.ia = ev.target.checked; repintar(); } }), h('span', null, s.declaracion)),
          sinInsignia('Es voluntario. Si lo marcas, el recurso lleva la etiqueta «Hecho con IA y revisado».')) : null,
        h('fieldset', { style: 'border:0;margin:0;padding:0' }, h('legend', { class: 'etq' }, 'Antes de compartir, confirma'), s.casillas.map(function (x, i) {
          return h('label', { class: 'campo-casilla' }, h('input', { type: 'checkbox', checked: !!est.cas[i], disabled: est.compartido ? true : null, 'data-k': 'cas-' + i, onchange: function (ev) { est.cas[i] = ev.target.checked; repintar(); } }), h('span', null, x));
        })),
        est.compartido ? selloHecho('Compartido con el claustro' + (s.declaracion && est.ia ? ', con la etiqueta «Hecho con IA y revisado»' : '') + '. Tu nombre queda como autora.') : h('div', { class: 'acciones' }, h('button', { class: 'boton', type: 'submit', disabled: listoSubir ? null : true, 'data-k': 'compartir' }, 'Compartir con el claustro'), !listoSubir ? h('span', { class: 'ayuda' }, 'El curso y la materia son obligatorios, y hay que marcar las casillas de «Antes de compartir».') : null));
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

  var dictadoEnCurso = null; // el intervalo que escribe la transcripción, si hay uno en marcha
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
        // Con el borrador ya redactado, «Volver a empezar» no aparece aquí: un doble clic en «Redactar el correo» lo borraría.
        fase === 'escuchando' || fase === 'dictado' ? boton('Volver a empezar', function () { est.fase = 'inicio'; est.texto = ''; repintar(); }, { cls: 'boton-borde boton-pequeno' }) : null),
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
            }, { 'data-k': 'enviar-dictado' }), boton('Volver a dictar', function () { est.fase = 'inicio'; est.texto = ''; repintar(); }, { cls: 'boton-borde', 'data-k': 'volver-dictar' }), h('span', { class: 'ayuda' }, 'Nunca sale sin que lo revises.')))));
      }
    }
    function escribir() {
      var zona = document.getElementById('transcripcion');
      var palabras = m.transcripcion.split(/\s+/);
      var reducido = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!zona || reducido) { est.fase = 'dictado'; repintar(); return; }
      var i = 0;
      clearInterval(dictadoEnCurso);
      var t = dictadoEnCurso = setInterval(function () {
        var z = document.getElementById('transcripcion');
        if (!z || est.fase !== 'escuchando') { clearInterval(t); if (dictadoEnCurso === t) dictadoEnCurso = null; return; }
        i += 2; z.textContent = palabras.slice(0, i).join(' ');
        if (i >= palabras.length) { clearInterval(t); dictadoEnCurso = null; est.fase = 'dictado'; setTimeout(repintar, 350); }
      }, 90);
    }
    // Si se sale de la pantalla mientras escucha (o se recarga), el dictado se queda en «Escuchando…» sin nada que lo mueva:
    // al volver, sigue donde lo dejó la demo, desde el principio de la transcripción.
    if (fase === 'escuchando' && !dictadoEnCurso) setTimeout(function () { if (!dictadoEnCurso && est.fase === 'escuchando') escribir(); }, 0);
    return partes;
  };

  // Filtro de la demo: para la petición si lleva un nombre de pila habitual escrito con mayúscula.
  // Es una muestra, no el filtro real: por eso, si la petición no es la del ejemplo, la respuesta lo dice.
  var NOMBRES = ('Daniel Amira Mario Lucía Hugo Irene Nora Iker Sofía Adrián Gonzalo Carla Alba Óliver Oliver Samuel ' +
    'María Martina Julia Paula Valeria Emma Daniela Sara Carmen Laura Lara Olivia Claudia Jimena Aitana Ana Elena Candela Alejandra Ainhoa Marta Carlota Noa Lola ' +
    'Martín Lucas Mateo Alejandro Pablo Manuel Álvaro Diego David Marcos Álex Alex Javier Bruno Miguel Liam Carlos Juan Ángel Nicolás José Sergio Gabriel Jorge Darío Eric Héctor Rodrigo Jaime Rubén Iván Víctor Guillermo Luis Pedro Raúl Óscar Andrés Unai').split(' ');
  function nombreEn(t) {
    var re = /[A-ZÁÉÍÓÚÑ][a-záéíóúüñ]+/g, x;
    while ((x = re.exec(t))) if (NOMBRES.indexOf(x[0]) >= 0) return x[0];
    return null;
  }

  MODULOS.material = function (rol, m) {
    var est = bolsa('material', rol, m.id);
    var area = h('textarea', { class: 'area', id: 'peticion-' + m.id, style: 'min-height:6rem', 'data-k': 'peticion', 'aria-label': 'Qué necesitas', oninput: function (ev) { est.peticion = ev.target.value; est.bloqueado = false; guardar(); } });
    area.value = est.peticion !== undefined ? est.peticion : m.peticion;
    var partes = [
      h('div', { class: 'nube' }, ilus('nube-claude', null, ''), h('div', null, h('p', { style: 'color:var(--tinta);font-weight:700' }, 'Módulo opcional con Claude, en la nube'), h('p', { style: 'font-size:var(--t-s)' }, m.aviso))),
      h('section', { class: 'tarjeta' },
        h('h2', { style: 'margin-bottom:.5rem' }, h('label', { for: 'peticion-' + m.id }, 'Qué necesitas')), area,
        est.bloqueado ? h('div', { class: 'bloqueo', role: 'alert', style: 'margin-top:.75rem' }, ilus('candado', null, ''), h('div', null, h('p', { style: 'font-weight:700' }, 'El filtro ha parado la petición'),
          h('p', null, est.nombre && est.peticion !== m.bloqueo.intento ? 'Lleva un nombre, «' + est.nombre + '», y en el módulo de Claude no se escriben datos de alumnos. No se ha enviado nada. Quita el nombre y pídelo sin datos personales.' : m.bloqueo.mensaje))) : null,
        h('div', { class: 'acciones', style: 'margin-top:.875rem' },
          boton('Pedir a Claude', function () {
            var t = (est.peticion !== undefined ? est.peticion : m.peticion);
            var nombre = nombreEn(t);
            if (nombre || t === m.bloqueo.intento) { est.bloqueado = true; est.nombre = nombre; est.respuesta = false; repintar(); return; }
            est.respuesta = true; est.otra = t.trim() !== m.peticion.trim(); est.bloqueado = false; repintar();
          }, { 'data-k': 'pedir' }),
          boton('Probar el filtro con un nombre', function () { est.peticion = m.bloqueo.intento; est.nombre = null; est.bloqueado = true; est.respuesta = false; repintar(); }, { cls: 'boton-borde', 'data-k': 'probar-filtro' }),
          est.bloqueado ? boton('Volver a la petición sin nombres', function () { est.peticion = m.peticion; est.nombre = null; est.bloqueado = false; repintar(); }, { cls: 'boton-borde boton-pequeno' }) : null)),
    ];
    if (est.respuesta) partes.push(h('article', { class: 'papel-doc', 'aria-label': m.respuesta.titulo },
      h('div', { class: 'doc-cabeza' }, h('h2', { class: 'doc-titulo' }, m.respuesta.titulo), h('p', { class: 'doc-sub' }, (est.otra ? 'En la demo, Claude devuelve siempre este ejemplo. ' : 'Preparado con Claude a partir de tu petición, sin datos de alumnos. ') + 'Revísalo antes de usarlo.')),
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
      h('div', { class: 'doc-cabeza' }, h('h2', { class: 'doc-titulo' }, m.original.titulo), h('p', { class: 'doc-sub con-insignia suave' }, tab === 0 ? null : insignia(), (tab === 0 ? 'Circular original' : 'Versión preparada con IA: ' + minuscula(v.idioma)) + ' · para la ' + minuscula(m.para))),
      parrafos(v.texto));
    var lateral = h('div', { class: 'lateral' },
      h('section', { class: 'tarjeta' }, h('h2', null, 'Antes de enviar, comprueba'),
        h('div', { style: 'margin-top:.5rem' }, m.comprobaciones.map(function (x, i) {
          return h('label', { class: 'campo-casilla' }, h('input', { type: 'checkbox', checked: !!est.checks[i] || est.hecho, disabled: est.hecho ? true : null, 'data-k': 'tchk-' + i, onchange: function (ev) { est.checks[i] = ev.target.checked; repintar(); } }), h('span', null, x));
        })),
        est.hecho ? h('div', { style: 'margin-top:.75rem' }, selloHecho(m.alTerminar)) : h('div', { class: 'acciones', style: 'margin-top:.875rem' }, boton(m.boton, function () {
          confirmar({ titulo: '¿Enviarlo a la ' + minuscula(m.para) + '?', intro: 'Se envía desde la cuenta del colegio con las versiones que has revisado.', boton: m.boton, alAceptar: function () { est.hecho = true; est.hora = ahora(); repintar(); avisar('Enviado', m.alTerminar); } });
        }, { disabled: listo ? null : true, 'data-k': 'enviar-trad' })),
        !listo && !est.hecho ? h('p', { style: 'font-size:var(--t-s);margin-top:.5rem' }, 'Marca las comprobaciones para poder enviarlo.') : null));
    // La insignia va en la versión, que es lo que prepara la IA; el destinatario lo pone el colegio.
    return [h('p', { class: 'linea-campo', style: 'color:var(--tinta)' }, h('b', null, 'Para: '), m.para), pest, h('div', { class: 'dos-columnas' }, doc, lateral)];
  };

  MODULOS.ficha = function (rol, m) {
    // Hasta que jefatura confirma las guardias, quien sustituye no ve ningún dato de la ficha.
    // El botón es solo un atajo de la demo para cambiar de perfil: en el colegio, solo jefatura confirma.
    if (m.bandera && !S.banderas[m.bandera]) {
      var j = D.roles.jefatura;
      var mod = j && (j.modulos || []).filter(function (x) { return x.tipo === 'aprobaciones'; })[0];
      return h('section', { class: 'tarjeta espera' }, ilus('reloj', null, ''), h('div', null,
        h('h2', null, 'Jefatura todavía no ha confirmado las guardias de hoy'),
        h('p', null, 'Tu ficha aparece aquí en cuanto jefatura de estudios confirma quién cubre cada sesión. Así nadie recibe una ficha que luego cambia.'),
        mod ? h('div', { class: 'acciones' }, boton('Cambiar al perfil de jefatura', function () { ir('jefatura', mod.id); }, { 'data-k': 'ir-jefatura' })) : null,
        mod ? h('p', { class: 'ayuda' }, 'Atajo de la demo: en el colegio, solo jefatura confirma las guardias.') : null));
    }
    var partes = [h('div', { class: 'fichas' }, m.fichas.map(function (f) {
      return h('article', { class: 'ficha', 'aria-label': 'Ficha de ' + f.sesion },
        h('div', { class: 'ficha-cabeza' }, h('p', { class: 'ficha-sesion' }, f.sesion), h('p', { class: 'ficha-hora' }, f.hora), h('p', { class: 'ficha-origen' }, esIA(m) ? insignia() : null, f.origen)),
        // Un aviso de la ficha (salud, recogida) lleva el triángulo delante de su título, como los demás avisos.
        h('dl', { class: 'ficha-datos' }, f.datos.map(function (d) { return h('div', { class: d.aviso ? 'ficha-aviso' : null }, h('dt', null, d.aviso ? [glifo('aviso'), d.dt] : d.dt), h('dd', null, d.dd)); })),
        h('p', { class: 'ficha-pie' }, f.pie));
    }))];
    if (m.registro) {
      /* Quien recibe la ficha (módulo con bandera) deja su propia entrada en el registro, con la hora de la demo. */
      var lineas = m.registro;
      if (m.bandera) {
        var acceso = bolsa('fichas', rol, m.id);
        // La hora que ya marca la cabecera: el reloj no avanza al pintar, solo al hacer algo.
        if (!acceso.hora) { acceso.hora = horaActual(); guardar(); }
        var quien = (D.roles[rol] && D.roles[rol].persona) ? D.roles[rol].persona.nombre : 'ti';
        lineas = ['Abierta por ' + quien + ' hoy a las ' + acceso.hora].concat(m.registro);
      }
      partes.push(h('section', { class: 'tarjeta' }, h('h2', { style: 'margin-bottom:.5rem' }, 'Registro de accesos'), h('ul', { class: 'lista-puntos' }, lineas.map(function (x) { return h('li', null, x); }))));
    }
    return partes;
  };

  MODULOS.tabla = function (rol, m) {
    var est = bolsa('tablas', rol, m.id);
    var marcas = {};
    (m.marcas || []).forEach(function (x) { marcas[x.fila + ':' + x.columna] = x.tipo; });
    var tabla = h('div', { class: 'tabla-caja columna-fija', role: 'region', 'aria-label': m.titulo, tabindex: '0' }, h('table', null,
      h('thead', null, h('tr', null, m.columnas.map(function (c) { return h('th', { scope: 'col' }, c); }))),
      h('tbody', null, m.filas.map(function (f, i) {
        return h('tr', null, f.map(function (c, j) {
          var t = marcas[i + ':' + j];
          var celda = h(j === 0 ? 'th' : 'td', j === 0 ? { scope: 'row', style: 'text-transform:none;letter-spacing:0;font-size:var(--t-s);color:var(--tinta);background:var(--papel);white-space:normal' } : { class: t ? 'm-' + t : null });
          if (t === 'aviso') celda.append(h('span', { class: 'marca-celda', 'aria-label': 'Aviso' }, '!'));
          if (t === 'ok') celda.append(visto());
          celda.append(document.createTextNode(' ' + c));
          return celda;
        }));
      }))));
    var avisos = h('ul', { class: 'lista-avisos' }, m.avisos.map(function (a) {
      return h('li', { class: 'aviso' + (a.estado === 'aviso' ? '' : ' ' + a.estado) }, a.estado === 'ok' ? visto() : a.estado === 'aviso' ? h('span', { class: 'marca-celda', 'aria-hidden': 'true' }, '!') : (esIA(m) ? insignia() : glifo('info')), h('p', null, a.texto));
    }));
    var partes = [avisos, tabla];
    if (m.boton) partes.push(est.hecho ? selloHecho(m.alTerminar + ' (' + personaDe(rol).nombre + ', hoy a las ' + est.hora + ')') :
      h('div', { class: 'acciones' }, boton(m.boton, function () { est.hecho = true; est.hora = ahora(); repintar(); avisar(m.boton, m.alTerminar); }, { 'data-k': 'tabla-' + m.id }), h('span', { class: 'ayuda' }, 'Nada se envía ni se publica hasta que pulses el botón.')));
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
  document.body.append(zonaAvisos, dialogo, globo);
  window.addEventListener('hashchange', function () { pintar(); });
  pintar();
})();
