(function () {
'use strict';
var d = document, h = d.documentElement, b = d.body, w = window;
w.prepatopListo = 1; h.classList.add('js'); // red de seguridad de tema-inline.js (B-06)
var $ = function (s, c) { return (c || d).querySelector(s); };
var $$ = function (s, c) { return [].slice.call((c || d).querySelectorAll(s)); };
var on = function (el, ev, fn, o) { if (el) el.addEventListener(ev, fn, o); };
on(d, 'touchstart', function () {}, { passive: true }); // iOS solo aplica :active si hay un escuchador táctil
var quieto = w.matchMedia('(prefers-reduced-motion: reduce)').matches;
var waBase = b.getAttribute('data-wa-base') || 'https://wa.me/34641423510?text=';
var ADS = 'AW-0000000000', CONS = 'prepatop_consent', CONS_V = '2026-10';
var SUPA = 'https://kundythpevxynzjnaymm.supabase.co/functions/v1/send-contact-email';
var CLAVE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1bmR5dGhwZXZ4eW56am5heW1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2MjU5MDUsImV4cCI6MjA4ODIwMTkwNX0.aI2uBrO2o31m8zkEZ2akBAfRWBcm_CCXJN69Ax5IKQw';
var guardar = function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} };
var leer = function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } };
var urlWa = function (t) { return waBase + encodeURIComponent(t); };
var enfocables = function (c) {
return $$('a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])', c)
.filter(function (e) { return e.getClientRects().length > 0; });
};
var atrapar = function (c, e) {
var f = enfocables(c); if (!f.length) return;
var p = f[0], u = f[f.length - 1], a = d.activeElement;
if (e.shiftKey && a === p) { u.focus(); e.preventDefault(); }
else if (!e.shiftKey && a === u) { p.focus(); e.preventDefault(); }
};
/* ── Consentimiento (AEPD + Consent Mode v2, modalidad básica) ── */
var adsCargado = false;
var consentimiento = function () {
try {
var c = JSON.parse(leer(CONS));
if (!c || c.version !== CONS_V) return null;
var t = typeof c.fecha === 'number' ? c.fecha : Date.parse(c.fecha);
return t > 0 && Date.now() - t < 365 * 864e5 ? c : null; // renovación a los 12 meses
} catch (e) { return null; }
};
var publicidadOk = function () { var c = consentimiento(); return !!(c && c.publicidad); };
var gt = function () { if (typeof w.gtag === 'function') w.gtag.apply(null, arguments); };
var activarAds = function () { // solo tras aceptar: única petición a Google de toda la web
if (adsCargado) return; adsCargado = true;
gt('consent', 'update', { ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted' });
var s = d.createElement('script'); s.async = true;
s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ADS; d.head.appendChild(s);
gt('js', new Date()); gt('config', ADS);
};
var banner = $('[data-consentimiento]'), capa1 = $('#cookies-capa-1'), capa2 = $('#cookies-capa-2'), capaActiva = null, abridor = null;
var mostrarBanner = function (segunda, enfocar) {
if (!banner) return;
var c = consentimiento(), sw = $('[data-cookies-publicidad]', banner);
if (sw) sw.checked = !!(c && c.publicidad);
capaActiva = segunda && capa2 ? capa2 : capa1 || banner;
if (capa1) capa1.hidden = capaActiva !== capa1;
if (capa2) capa2.hidden = capaActiva !== capa2;
banner.hidden = false; if (w.prepatopFijos) w.prepatopFijos();
h.style.setProperty('--alto-cookies', banner.offsetHeight + 'px'); // el foco del teclado no queda bajo el aviso (B-12)
if (enfocar) { var f = enfocables(capaActiva); if (f[0]) f[0].focus(); }
};
var decidir = function (publicidad) {
guardar(CONS, JSON.stringify({ version: CONS_V, fecha: new Date().toISOString().slice(0, 10), publicidad: publicidad }));
if (banner) banner.hidden = true; if (w.prepatopFijos) w.prepatopFijos();
if (capaActiva && banner.contains(d.activeElement)) { var ab = abridor || $('#contenido'); if (ab) ab.focus({ preventScroll: true }); }
abridor = null;
capaActiva = null;
if (publicidad) activarAds();
else if (adsCargado) gt('consent', 'update', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
};
var c0 = consentimiento();
if (!c0) mostrarBanner(false, false); else if (c0.publicidad) activarAds();
/* ── Cabecera, menú móvil, tema ── */
var cab = $('[data-cabecera]');
var alScroll = function () { cab.classList.toggle('scrolled', w.scrollY > 8); };
if (cab) { on(w, 'scroll', alScroll, { passive: true }); alScroll(); }
var enlacesNav = $$('[data-nav-principal] a[href^="#"]');
if (enlacesNav.length && w.IntersectionObserver) {
var ioN = new IntersectionObserver(function (es) {
es.forEach(function (en) {
if (en.isIntersecting) enlacesNav.forEach(function (a) { a.classList.toggle('activo', a.getAttribute('href') === '#' + en.target.id); });
});
}, { rootMargin: '-35% 0px -55% 0px' });
enlacesNav.forEach(function (a) { var s = $(a.getAttribute('href')); if (s) ioN.observe(s); });
}
var menuBoton = $('[data-menu-boton]'), menu = $('[data-menu-movil]'), menuAbierto = false;
var alternarMenu = function (abrir) {
if (!menu || !menuBoton) return;
menuAbierto = abrir; menu.classList.remove('oculto-js'); menu.hidden = !abrir;
menuBoton.setAttribute('aria-expanded', String(abrir));
menuBoton.setAttribute('aria-label', abrir ? 'Cerrar el menú' : 'Abrir el menú');
b.classList.toggle('menu-abierto', abrir);
if (abrir) { var f = enfocables(menu); if (f[0]) f[0].focus(); } else menuBoton.focus();
if (w.prepatopFijos) w.prepatopFijos();
};
on(menuBoton, 'click', function () { alternarMenu(!menuAbierto); });
on(menu, 'click', function (e) { if (e.target.closest('a[href]')) alternarMenu(false); });
on(w.matchMedia('(min-width: 56.25em)'), 'change', function (e) { if (e.matches && menuAbierto) alternarMenu(false); }); // giro de tableta con el menú abierto
var temaBotones = $$('[data-tema]'); // cabecera (escritorio) y menú móvil
var pintarTema = function (oscuro) { // aria-label fijo «Modo oscuro»; el estado lo da aria-pressed (B-17)
temaBotones.forEach(function (t) { t.setAttribute('aria-pressed', String(oscuro)); });
};
if (temaBotones.length) {
var oscuro = h.getAttribute('data-theme') ? h.getAttribute('data-theme') === 'dark' : w.matchMedia('(prefers-color-scheme: dark)').matches;
pintarTema(oscuro);
temaBotones.forEach(function (t) {
on(t, 'click', function () {
var cambiar = function () {
oscuro = !oscuro; h.setAttribute('data-theme', oscuro ? 'dark' : 'light'); pintarTema(oscuro); guardar('prepatop_tema', oscuro ? 'dark' : 'light');
$$('meta[name="theme-color"]').forEach(function (m) { m.removeAttribute('media'); m.content = oscuro ? '#142952' : '#FFFFFF'; }); // la barra del navegador sigue la elección
};
if (d.startViewTransition && !quieto) d.startViewTransition(cambiar); else cambiar(); // fundido de 200 ms donde exista
});
});
}
/* ── Carrusel scroll-snap en móvil (< 40em): flechas e indicadores; nunca automático ni en bucle ── */
var mqMovil = w.matchMedia('(max-width: 39.99em)'); // en em, como el CSS (B-19)
var attr = function (e, k, v) { if (e.getAttribute(k) !== v) e.setAttribute(k, v); };
$$('[data-carrusel]').forEach(function (lista) {
var ctr = null, ant, sig, puntos, pintado = '';
var items = function () { return [].filter.call(lista.children, function (e) { return e.getClientRects().length > 0; }); };
var pad = function () { return parseFloat(getComputedStyle(lista).scrollPaddingLeft) || 0; };
var indice = function (it) {
if (lista.scrollLeft + lista.clientWidth >= lista.scrollWidth - 4) return it.length - 1; // al final, la última
var l = lista.getBoundingClientRect().left + pad(), k = 0, m = 1e9;
it.forEach(function (e, i) { var x = Math.abs(e.getBoundingClientRect().left - l); if (x < m) { m = x; k = i; } });
return k;
};
var ir = function (i) { // solo en horizontal: la página no se mueve (B-08)
var it = items(); if (!it.length) return;
i = Math.max(0, Math.min(it.length - 1, i));
lista.scrollBy({ left: it[i].getBoundingClientRect().left - lista.getBoundingClientRect().left - pad(), behavior: quieto ? 'auto' : 'smooth' });
};
var pintar = function () { // solo cuando cambia la tarjeta o el número de tarjetas
if (!ctr || ctr.hidden) return;
var it = items(), n = it.length, k = indice(it), clave = k + '/' + n;
if (clave === pintado) return;
var antes = pintado.split('/')[1]; pintado = clave;
attr(ant, 'aria-disabled', String(k < 1)); attr(sig, 'aria-disabled', String(k >= n - 1));
if (n > 7) { puntos.className = 'carrusel__puntos carrusel__contador'; puntos.textContent = (k + 1) + ' / ' + n; return; } // «3 / 13»
if (String(n) !== antes || puntos.classList.contains('carrusel__contador')) {
puntos.className = 'carrusel__puntos'; puntos.textContent = '';
for (var i = 0; i < n; i++) {
var p = d.createElement('button'); p.type = 'button'; p.className = 'carrusel__punto';
p.setAttribute('aria-label', 'Ir al elemento ' + (i + 1) + ' de ' + n); p.onclick = ir.bind(null, i); puntos.appendChild(p);
}
}
[].forEach.call(puntos.children, function (p, i) { attr(p, 'aria-current', String(i === k)); });
};
var montar = function () {
if (ctr) { ctr.hidden = !mqMovil.matches; pintado = ''; pintar(); return; }
if (!mqMovil.matches) return;
ctr = d.createElement('div'); ctr.className = 'carrusel__controles';
var ch = '<svg class="icono icono--24" aria-hidden="true"><use href="#i-chevron"/></svg>';
ctr.innerHTML = '<button type="button" class="carrusel__anterior" aria-label="Anterior">' + ch + '</button><div class="carrusel__puntos" role="group" aria-label="Posición en el carrusel"></div><button type="button" class="carrusel__siguiente" aria-label="Siguiente">' + ch + '</button>';
lista.parentNode.insertBefore(ctr, lista.nextSibling);
ant = $('.carrusel__anterior', ctr); sig = $('.carrusel__siguiente', ctr); puntos = $('.carrusel__puntos', ctr);
if (lista.scrollWidth > lista.clientWidth + 1 && !enfocables(lista).length) { // desborda sin nada enfocable: el teclado debe poder desplazarlo
var t = $('h2, h3', lista.closest('section, .subbloque') || d);
lista.tabIndex = 0;
if (!lista.hasAttribute('role')) lista.setAttribute('role', 'region');
if (!lista.hasAttribute('aria-label')) lista.setAttribute('aria-label', t ? 'Tarjetas: ' + t.textContent.trim() : 'Carrusel'); // distinto del de la sección (landmark-unique)
}
on(ant, 'click', function () { ir(indice(items()) - 1); });
on(sig, 'click', function () { ir(indice(items()) + 1); });
on(lista, 'scroll', function () { requestAnimationFrame(pintar); }, { passive: true });
pintar();
};
montar(); on(mqMovil, 'change', montar);
});
/* ── Filtros de testimonios/reseñas ── */
$$('[data-filtros]').forEach(function (cont) {
var chips = $$('[data-filtro]', cont), vacio = $('[data-estado-vacio]', cont);
chips.forEach(function (ch) {
on(ch, 'click', function () {
var f = ch.getAttribute('data-filtro'), n = 0;
chips.forEach(function (x) { x.setAttribute('aria-pressed', String(x === ch)); });
if (f !== 'todos') { // al filtrar se muestran también los ocultos tras «Ver los 21»
$$('.oculto-js', cont).forEach(function (e) { e.classList.remove('oculto-js'); });
$$('[data-mostrar]', cont).forEach(function (m) { m.hidden = true; m.setAttribute('aria-expanded', 'true'); });
}
$$('[data-resultado],[data-especialidad]', cont).forEach(function (e) {
var ok = f === 'todos' || (' ' + (e.getAttribute('data-resultado') || '') + ' ').indexOf(' ' + f + ' ') > -1 || e.getAttribute('data-especialidad') === f;
e.hidden = !ok; if (ok) n++;
});
if (vacio) vacio.hidden = n > 0; // nunca una rejilla vacía
var vivo = $('[data-filtro-estado]', cont), k = $$('.tarjeta--testimonio:not([hidden])', cont).length;
if (vivo) vivo.textContent = k === 1 ? '1 testimonio' : k + ' testimonios'; // región viva oculta (B-23)
var l = $('[data-carrusel]', cont); if (l) { l.scrollLeft = 0; l.dispatchEvent(new Event('scroll')); }
});
});
});
/* ── Barra móvil, flotante y panel de WhatsApp ── */
var barra = $('[data-barra-movil]'), flot = $('[data-wa-panel]'), panelBoton = $('[data-wa-panel-boton]');
var panel = panelBoton && $('#' + panelBoton.getAttribute('aria-controls')), panelAbierto = false;
var alternarPanel = function (abrir, sinFoco) { // sinFoco: cierre por clic fuera o por ocultarse el botón
if (!panel) return;
panelAbierto = abrir; panel.hidden = !abrir; panelBoton.setAttribute('aria-expanded', String(abrir));
if (abrir) { var f = enfocables(panel); if (f[0]) f[0].focus(); } else if (!sinFoco) panelBoton.focus();
};
on(panelBoton, 'click', function () { alternarPanel(!panelAbierto); });
var hero = $('main .hero .acciones, main .hero .canales') || $('#inicio'), contacto = $('#contacto') || $('#informacion') || $('#formulario'), calc = $('#calc');
var est = { hero: !!hero, contacto: false, campo: false, calc: false };
var fijos = function () { // barra: tras el hero y no sobre el contacto; flotante: tampoco junto a los botones del hero ni sobre la calculadora
if (barra) {
barra.hidden = est.hero || est.contacto || est.campo || menuAbierto || !!(banner && !banner.hidden);
h.toggleAttribute('data-barra', !barra.hidden); // la cabecera del móvil oculta su teléfono y su WhatsApp
}
if (flot) { var oc = est.hero || est.contacto || est.calc || !!(banner && !banner.hidden); if (oc && panelAbierto) alternarPanel(false, true); flot.hidden = oc; }
};
if (w.IntersectionObserver && (barra || flot)) {
var ioF = new IntersectionObserver(function (es) {
es.forEach(function (en) { est[en.target === hero ? 'hero' : en.target === contacto ? 'contacto' : 'calc'] = en.isIntersecting; });
fijos();
});
[hero, contacto, calc].forEach(function (s) { if (s) ioF.observe(s); });
}
w.prepatopFijos = fijos;
on(d, 'focusin', function (e) { est.campo = !!e.target.closest('[data-formulario]'); fijos(); });
on(d, 'focusout', function (e) { est.campo = !!(e.relatedTarget && e.relatedTarget.closest('[data-formulario]')); fijos(); });
fijos();
var copiar = function (btn, txt, span) {
var o = btn.textContent, fin = function (ok) {
btn.textContent = ok ? 'Copiado' : 'No se ha podido copiar';
if (!ok && span) try { getSelection().selectAllChildren(span); } catch (e) {}
setTimeout(function () { btn.textContent = o; }, 2000);
};
if (navigator.clipboard) navigator.clipboard.writeText(txt).then(function () { fin(true); }, function () { fin(false); }); else fin(false);
};
/* ── Formulario (§5.17): validación en línea, envío a la función de Supabase, éxito y error ── */
var form = $('[data-formulario]');
if (form) {
form.noValidate = true; // sin JS, valida el navegador y el formulario envía a /api/contacto (B-16)
var MSG = { name: 'Escribe tu nombre', phone: 'Escribe un teléfono de 9 cifras', email: 'Escribe un correo con @', specialty: 'Elige tu especialidad', privacidad: 'Marca la casilla para confirmar que has leído la información sobre protección de datos' };
var errorDe = function (c) {
var v = c.value.trim(), n = c.name;
if (n === 'phone') return /^\d{9}$/.test(v.replace(/[\s.()-]/g, '').replace(/^(\+34|0034)/, '')) ? '' : MSG.phone;
if (n === 'email') return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : v.indexOf('@') < 0 ? MSG.email : 'Revisa el final del correo (por ejemplo, @gmail.com)';
if (n === 'privacidad') return c.checked ? '' : MSG.privacidad;
return v ? '' : MSG[n];
};
var validar = function (c) {
var msg = errorDe(c), caja = c.closest('.campo'), err = caja && $('.campo__error', caja);
if (caja) caja.classList.toggle('campo--error', !!msg);
if (err) {
err.textContent = msg; if (!err.id) err.id = c.id + '-error';
var ids = (c.getAttribute('aria-describedby') || '').split(' ').filter(Boolean);
if (ids.indexOf(err.id) < 0) c.setAttribute('aria-describedby', ids.concat(err.id).join(' '));
}
if (msg) c.setAttribute('aria-invalid', 'true'); else c.removeAttribute('aria-invalid');
return !msg;
};
var campos = ['name', 'phone', 'email', 'specialty', 'privacidad'].map(function (n) { return form.elements[n]; }).filter(Boolean);
campos.forEach(function (c) {
on(c, 'blur', function () { if ((c.type !== 'checkbox' && c.value.trim()) || c.getAttribute('aria-invalid')) validar(c); }); // vacío o sin marcar: se valida al enviar
on(c, c.type === 'checkbox' || c.tagName === 'SELECT' ? 'change' : 'input', function () { if (c.getAttribute('aria-invalid')) validar(c); });
});
var enviando = false, estado = $('[data-formulario-estado]', form), boton = $('[type="submit"]', form);
on(form, 'submit', function (e) {
e.preventDefault(); if (enviando) return; // bloqueo del doble envío
var malos = campos.filter(function (c) { return !validar(c); });
if (malos.length) { malos[0].focus(); return; }
var el = form.elements, nombre = el.name.value.trim(), tel = el.phone.value.trim(), correo = el.email.value.trim();
var msg = ((el.message && el.message.value.trim()) || '') + '\nOrigen: ' + (form.getAttribute('data-origen') || 'Web') +
'\nAcepta comunicaciones comerciales: ' + (el.comercial && el.comercial.checked ? 'sí' : 'no');
var exito = function () {
try { sessionStorage.setItem('prepatop_envio', JSON.stringify({ nombre: nombre, telefono: tel, correo: correo, conversion: true })); } catch (x) {}
location.assign('/gracias');
};
if (el.website && el.website.value) { exito(); return; } // campo trampa: se simula el éxito sin enviar nada
enviando = true; var txt = boton.textContent;
boton.textContent = 'Enviando…'; boton.setAttribute('aria-busy', 'true'); boton.disabled = true;
if (estado) estado.textContent = '';
var cuerpo = JSON.stringify({ name: nombre, email: correo, phone: tel, specialty: el.specialty.value, message: msg.replace(/^\n/, '') });
var reserva = function () {
return fetch(SUPA, { method: 'POST', headers: { 'Content-Type': 'application/json', apikey: CLAVE, Authorization: 'Bearer ' + CLAVE }, body: cuerpo })
.then(function (r) { if (!r.ok) throw r; });
};
fetch('/api/contacto', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: cuerpo })
.then(function (r) {
if (r.ok) return;
if (r.status === 400 || r.status === 429) throw r; // datos inválidos o demasiados envíos: no reintentar
return reserva(); // 404/501/5xx: la función propia aún no está configurada
}, reserva)
.then(function () { exito(); })
.catch(function () {
enviando = false; boton.textContent = txt; boton.removeAttribute('aria-busy'); boton.disabled = false;
if (!estado) return;
var g = $('[data-origen="cabecera"]') || $('[data-origen="flotante"]');
estado.innerHTML = 'No hemos podido enviar tu mensaje. Inténtalo de nuevo en unos segundos o escríbenos directamente por WhatsApp al 641 423 510 o a info@prepatop.com ' +
'<a class="boton boton--wa boton--md" href="' + (g ? g.href : urlWa('Hola, PrepaTop. Quiero información sobre la preparación de oposiciones de maestros en Madrid para 2028.')) +
'" data-origen="formulario-error" target="_blank" rel="noopener"><svg class="icono icono--20" aria-hidden="true"><use href="#i-whatsapp"/></svg><span>Escríbenos por WhatsApp</span></a>';
});
});
}
var gn = $('[data-gracias-nombre]');
if (gn) try {
var env = JSON.parse(sessionStorage.getItem('prepatop_envio'));
if (env) {
var gnc = $('[data-gracias-nombre-coma]'), gct = $('[data-gracias-contacto]');
if (env.nombre) { gn.textContent = env.nombre; if (gnc) gnc.hidden = false; } // «Recibido, Ana.»
var gtl = $('[data-gracias-telefono]'), gco = $('[data-gracias-correo]');
if (gtl && env.telefono) gtl.textContent = env.telefono;
if (gco && env.correo) gco.textContent = env.correo;
if (gct && env.telefono && env.correo) gct.hidden = false; // «al 600… o a ana@…»
if (env.conversion) {
delete env.conversion; sessionStorage.setItem('prepatop_envio', JSON.stringify(env));
if (publicidadOk()) { activarAds(); gt('event', 'conversion', { send_to: ADS + '/RvGTCMW9488cEOCuro1E', value: 1, currency: 'EUR' }); }
}
}
} catch (x) {}
/* ── Clics delegados: cookies, mostrar más, leer más, chips, copiar, mapa, llamada, eventos ── */
on(d, 'click', function (e) {
var t = e.target; if (!t.closest) return;
if (panelAbierto && !t.closest('[data-wa-panel]')) alternarPanel(false, true); // clic fuera del panel (B-11)
var sm = t.closest('details[name] > summary'); // la pregunta tocada no se mueve si se cierra otra de arriba (B-07)
if (sm) { var y0 = sm.getBoundingClientRect().top; requestAnimationFrame(function () { var dy = sm.getBoundingClientRect().top - y0; if (Math.abs(dy) > 1) w.scrollBy({ top: dy, behavior: 'instant' }); }); }
var an = t.closest('a[href^="#"]'), dest = an && an.hash.length > 1 && d.getElementById(decodeURIComponent(an.hash.slice(1)));
if (dest && dest.hidden && dest.closest('[data-filtros]')) { var td = $('[data-filtro="todos"]'); if (td) td.click(); } // índice de caras → tarjeta oculta por un filtro
if (dest && !quieto && Math.abs(dest.getBoundingClientRect().top) > 2 * innerHeight) { // ancla lejana: salto y llegada de 260 ms (B-13)
var llegar = function () { // el salto puede esperar a que se maquete el destino: se restaura tras el desplazamiento
if (!h.style.scrollBehavior) return; h.style.scrollBehavior = '';
dest.animate([{ opacity: 0.4, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }], { duration: 260, easing: 'cubic-bezier(.23,1,.32,1)' });
};
h.style.scrollBehavior = 'auto'; on(w, 'scroll', llegar, { once: true, passive: true }); setTimeout(llegar, 600);
}
var x = t.closest('[data-cookies]');
if (x) {
var acc = x.getAttribute('data-cookies');
if (acc === 'abrir') { e.preventDefault(); abridor = x; mostrarBanner(true, true); }
else if (acc === 'configurar') { x.setAttribute('aria-expanded', 'true'); mostrarBanner(true, true); }
else if (acc === 'aceptar') decidir(true);
else if (acc === 'rechazar') decidir(false);
else if (acc === 'guardar') { var sw = $('[data-cookies-publicidad]', banner); decidir(!!(sw && sw.checked)); }
return;
}
if ((x = t.closest('[data-mostrar]'))) {
var els = $$(x.getAttribute('data-mostrar'));
els.forEach(function (el) { el.classList.remove('oculto-js', 'oculto-escritorio', 'oculto-estrecho'); });
x.setAttribute('aria-expanded', 'true'); x.hidden = true;
if (els[0]) { els[0].tabIndex = -1; els[0].focus(); }
if (x.closest('.faq__mas') && els[0] && !quieto) [].slice.call(els[0].children, 0, 8).forEach(function (c, i) {
c.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 220, delay: i * 30, easing: 'cubic-bezier(.23,1,.32,1)', fill: 'backwards' });
});
return;
}
if ((x = t.closest('[data-leer-mas]'))) {
var q = x.previousElementSibling, ab = !!(q && q.classList.toggle('abierto'));
x.setAttribute('aria-expanded', String(ab)); x.textContent = ab ? 'Leer menos' : 'Leer más';
return;
}
if ((x = t.closest('[data-chips-especialidad] [data-esp]'))) { // selección única; reescribe los href con/sin especialidad
var grupo = x.closest('[data-chips-especialidad]'), act = x.getAttribute('aria-pressed') !== 'true', esp = act ? x.getAttribute('data-esp') : '';
$$('[data-esp]', grupo).forEach(function (c) { c.setAttribute('aria-pressed', String(act && c === x)); });
$$('a[data-wa-con]', grupo.closest('[data-wa-ambito]') || d).forEach(function (a) {
var sin = a.getAttribute('data-wa-sin');
a.href = esp ? urlWa(a.getAttribute('data-wa-con').split('{esp}').join(esp)) : sin ? urlWa(sin) : a.href;
});
$$('[data-equipo-esp]', grupo.parentNode).forEach(function (p) { // fichas de esa especialidad
p.hidden = p.getAttribute('data-equipo-esp') !== esp;
var l = !p.hidden && $('[data-carrusel]', p); if (l) { l.scrollLeft = 0; l.dispatchEvent(new Event('scroll')); } // pinta los puntos al verse
});
return;
}
if ((x = t.closest('[data-copiar]'))) { copiar(x, x.getAttribute('data-copiar'), $('[data-copiable]')); return; }
if (t.closest('[data-wa-panel-cerrar]')) { alternarPanel(false); return; }
if ((x = t.closest('[data-mapa-cargar]'))) { // mapa de Google solo bajo demanda
var f = d.createElement('iframe');
f.src = x.getAttribute('data-mapa-src'); f.title = 'Mapa de la sede de PrepaTop en Leganés'; f.width = 800; f.height = 420;
f.loading = 'lazy'; f.referrerPolicy = 'no-referrer-when-downgrade'; x.parentNode.replaceChild(f, x);
return;
}
if (t.closest('[data-prefiero-llamada]')) {
var ta = $('[data-formulario] textarea'), frase = 'Prefiero que me llaméis. Mejor a partir de las ';
if (ta) { e.preventDefault(); if (ta.value.indexOf(frase) < 0) ta.value = frase + ta.value; ta.focus(); ta.setSelectionRange(frase.length, frase.length); }
return;
}
var a = t.closest('a[href]'), hr = a && a.getAttribute('href'); // eventos de Ads solo con consentimiento
if (hr && publicidadOk()) {
if (hr.indexOf('https://wa.me') === 0) gt('event', 'whatsapp_click', { origen: a.getAttribute('data-origen') || '' });
else if (hr.indexOf('tel:') === 0) gt('event', 'call_click', { origen: a.getAttribute('data-origen') || '' });
}
});
on(d, 'keydown', function (e) {
if (e.key === 'Tab') {
var c = menuAbierto ? (menu.closest('.cabecera') || menu) : panelAbierto ? panel : null;
if (c) atrapar(c, e);
} else if (e.key === 'Escape') {
if (menuAbierto) alternarMenu(false); else if (panelAbierto) alternarPanel(false); else if (capaActiva && banner.contains(d.activeElement)) decidir(false);
}
});
var pieCols = $$('details.pie__columna');
var plegarPie = function () {
pieCols.forEach(function (x) { x.open = !mqMovil.matches; var s = x.querySelector('summary'); if (s) s.tabIndex = mqMovil.matches ? 0 : -1; });
$$('[data-plegar-movil]').forEach(function (x) { x.open = !mqMovil.matches; });
};
pieCols.forEach(function (x) { on(x.querySelector('summary'), 'click', function (e) { if (!mqMovil.matches) e.preventDefault(); }); });
plegarPie(); on(mqMovil, 'change', plegarPie);
on(w, 'beforeprint', function () {
$$('details:not([open])').forEach(function (x) { x.setAttribute('data-impreso', x.getAttribute('name') || ''); x.removeAttribute('name'); x.open = true; });
});
on(w, 'afterprint', function () {
$$('details[data-impreso]').forEach(function (x) { x.open = false; if (x.getAttribute('data-impreso')) x.setAttribute('name', x.getAttribute('data-impreso')); x.removeAttribute('data-impreso'); });
});
var masonerias = $$('.resenas,.testimonios__rejilla');
if (masonerias.length && w.ResizeObserver) {
var pendientes = [], colocar = function () {
pendientes.splice(0).forEach(function (r) {
var hijos = [].slice.call(r.children), si = r.classList.contains('masonria');
var n = si ? getComputedStyle(r).gridTemplateColumns.split(' ').length : 0, gap = parseFloat(getComputedStyle(r).columnGap) || 16, alto = [];
for (var i = 0; i < n; i++) alto.push(0);
hijos.forEach(function (c) {
var hm = c.getBoundingClientRect().height;
if (!si || !hm) { c.style.gridColumn = c.style.gridRow = ''; return; }
var k = alto.indexOf(Math.min.apply(null, alto)), filas = Math.ceil((hm + gap) / 4);
c.style.gridColumn = k + 1; c.style.gridRow = (alto[k] + 1) + ' / span ' + filas; alto[k] += filas;
});
});
};
var roM = new ResizeObserver(function (es) {
es.forEach(function (e) { var r = e.target.classList.contains('masonria') ? e.target : e.target.parentNode; if (pendientes.indexOf(r) < 0) pendientes.push(r); });
requestAnimationFrame(colocar);
});
var montar = function () {
var si = !mqMovil.matches;
masonerias.forEach(function (r) {
r.classList.toggle('masonria', si);
[r].concat([].slice.call(r.children)).forEach(function (c) { if (si) roM.observe(c); else roM.unobserve(c); });
if (!si) { pendientes.push(r); colocar(); }
});
};
montar(); on(mqMovil, 'change', montar);
}
var hash = location.hash.slice(1);
if (/^(inicio|resultados|testimonios|garantia|proceso|equipo|contacto)$/.test(hash) && !d.getElementById(hash)) location.replace('/#' + hash);
})();
