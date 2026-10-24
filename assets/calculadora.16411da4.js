(function () {
'use strict';
var marco = document.querySelector('[data-calculadora]');
var iframe = document.getElementById('calc');
if (!marco || !iframe) return;
var captacion = document.querySelector('[data-captacion]');
var pasoAnterior = '';
var especialidadAnterior = null;
function documentoInterno() {
try { return iframe.contentDocument || (iframe.contentWindow && iframe.contentWindow.document); } catch (e) { return null; }
}
function ajustarAltura() {
var doc = documentoInterno();
if (!doc || !doc.body) return;
var alto = Math.max(doc.documentElement.scrollHeight, doc.body.scrollHeight);
if (alto > 200) iframe.style.height = (alto + 24) + 'px';
}
function especialidadElegida() {
var doc = documentoInterno();
if (!doc) return '';
var sel = doc.querySelector('#ptop-calc select');
if (!sel || !sel.value) return '';
var opcion = sel.options[sel.selectedIndex];
return (opcion && opcion.textContent ? opcion.textContent : sel.value).trim();
}
function actualizarCaptacion() {
var doc = documentoInterno();
if (!doc || !captacion) return;
var hayResultados = !!doc.querySelector('#ptop-calc .res-tarjetas');
if (hayResultados && captacion.hidden) captacion.hidden = false;
var esp = especialidadElegida();
if (esp === especialidadAnterior) return;
especialidadAnterior = esp;
var boton = captacion.querySelector('a[data-wa-con]');
if (!boton) return;
var base = document.body.getAttribute('data-wa-base') || 'https://wa.me/34641423510?text=';
var texto = boton.querySelector('span');
if (esp) {
boton.href = base + encodeURIComponent(boton.getAttribute('data-wa-con').replace('{esp}', esp));
if (texto) texto.textContent = 'Hablar con un preparador de ' + esp;
} else {
boton.href = base + encodeURIComponent(boton.getAttribute('data-wa-sin'));
if (texto) texto.textContent = 'Hablar con un preparador';
}
}
function vigilarPaso() {
var doc = documentoInterno();
if (!doc) return;
var paso = doc.getElementById('prog-paso');
var actual = paso ? paso.textContent : '';
if (pasoAnterior && actual !== pasoAnterior) {
var y = marco.getBoundingClientRect().top + window.pageYOffset - 88;
window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
}
pasoAnterior = actual;
}
var mostrado = false;
marco.classList.add('esperando');
function mostrar() { if (mostrado) return; mostrado = true; marco.classList.remove('esperando'); ajustarAltura(); }
function conectar() {
var doc = documentoInterno();
if (!doc || !doc.body) { iframe.style.minHeight = '100vh'; mostrar(); return; }
ajustarAltura(); actualizarCaptacion();
try { // las fuentes de Google que usa la app (Inter y Playfair Display): se piden y se espera a que lleguen
Promise.all(['400 16px Inter', '600 16px Inter', '700 16px Inter', '700 16px "Playfair Display"'].map(function (f) { return doc.fonts.load(f); })).then(mostrar, mostrar);
} catch (e) { mostrar(); }
setTimeout(mostrar, 2000);
try {
if ('ResizeObserver' in window) new ResizeObserver(ajustarAltura).observe(doc.body);
new MutationObserver(function () { ajustarAltura(); vigilarPaso(); actualizarCaptacion(); })
.observe(doc.body, { childList: true, subtree: true, characterData: true, attributes: true });
doc.addEventListener('change', actualizarCaptacion);
} catch (e) { iframe.style.minHeight = '100vh'; }
window.addEventListener('resize', ajustarAltura);
}
iframe.addEventListener('load', conectar);
var inicial = documentoInterno(); // el about:blank inicial también está «complete»: no cuenta
if (inicial && inicial.readyState === 'complete' && inicial.URL !== 'about:blank') conectar();
var copiar = document.querySelector('[data-copiar-desglose]');
if (copiar) copiar.addEventListener('click', function () {
var doc = documentoInterno();
if (!doc) return;
var lineas = [];
doc.querySelectorAll('#ptop-calc .res-t').forEach(function (t) {
var titulo = t.querySelector('.titulo'), cifra = t.querySelector('.cifra');
if (titulo && cifra) lineas.push(titulo.textContent.trim() + ': ' + cifra.textContent.trim());
});
if (!lineas.length) return;
lineas.push('Calculado con la calculadora gratuita de PrepaTop · prepatop.com/calculadora');
var texto = lineas.join('\n');
var original = copiar.textContent;
function hecho() { copiar.textContent = 'Copiado'; setTimeout(function () { copiar.textContent = original; }, 2000); }
if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(texto).then(hecho, function () {});
});
var imprimir = document.querySelector('[data-imprimir-desglose]');
if (imprimir) imprimir.addEventListener('click', function () {
try { iframe.contentWindow.focus(); iframe.contentWindow.print(); } catch (e) { window.print(); }
});
})();
