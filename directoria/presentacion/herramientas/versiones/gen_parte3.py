# Genera paso-completo.html, precios-versiones.html y condiciones-versiones.html, y pone los nombres bajo la pareja de colegios de la portadilla 3.
# Uso: python3 tools/gen_parte3.py project/slides
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from conectores import flecha
from ilus import B, OK, servidor_sin_chispa
D = sys.argv[1]

# ---------- El paso de Esencial a Completo ----------
# El servidor de datos va sin la chispa (no actúa la IA); el servidor de IA, con ella.
svg = ['<rect x="1.5" y="1.5" width="557" height="457" rx="36" fill="#FFFDF8" stroke="#2E5A50" stroke-width="3"/>',
       '<rect x="781.5" y="1.5" width="881" height="457" rx="36" fill="#FFFDF8" stroke="#2E5A50" stroke-width="3"/>',
       flecha(594, 146, 748, 146, punto=True),
       '<path d="M1093 146L1337 146" fill="none" stroke="#2E5A50" stroke-width="3" stroke-linecap="round"/><circle cx="1093" cy="146" r="5" fill="#2E5A50"/><circle cx="1337" cy="146" r="5" fill="#2E5A50"/>']
SVG = '<svg class="fn-svg" width="1664" height="460" viewBox="0 0 1664 460" aria-hidden="true">' + ''.join(svg) + '</svg>'
open(os.path.join(D, 'paso-completo.html'), 'w').write(f'''<section id="paso-completo">
<img class="marca" src="{B('isotipo')}" alt="" width="56" height="56">
<p class="eyebrow">De Esencial a Completo</p>
<h2 class="title">Añadir la IA sin perder nada</h2>
<div class="fn-stage ps-stage">
{SVG}
<p class="ps-legend ps-l1">Hoy, con Esencial</p>
<p class="ps-legend ps-l2">Con Completo</p>
<div class="ps-node ps-n1"><div class="ps-ic">{servidor_sin_chispa('ps-srv', 'Servidor de DirectorIA, sin la luz de la IA', 200)}</div><h3 class="fn-name">Servidor de DirectorIA</h3><p class="fn-line">Vuestros datos, vuestras reglas<br>y todo el historial</p></div>
<p class="ps-when">Cuando queráis</p>
<div class="ps-node ps-n2"><div class="ps-ic">{servidor_sin_chispa('ps-srv', 'El mismo servidor de DirectorIA, sin la luz de la IA', 200)}</div><h3 class="fn-name">El mismo servidor</h3><p class="fn-line">Sigue como servidor de datos,<br>con todo lo que tenía</p></div>
<div class="ps-node ps-n3"><div class="ps-ic"><img src="{B('servidor')}" alt="Servidor de IA, con la luz naranja de la IA" width="200" height="200"><p class="vs-tag ia">con IA</p></div><h3 class="fn-name">Servidor de IA</h3><p class="fn-line">Se añade al lado, en el colegio.<br>La IA trabaja ahí, también<br>con el correo</p></div>
</div>
<div class="ps-facts">
<div class="ps-fact">{OK()}<p>Datos, reglas, usuarios e historial se quedan donde estaban.</p></div>
<div class="ps-fact">{OK()}<p>Guardias, fichas y protocolos siguen con las reglas del colegio.</p></div>
<div class="ps-fact">{OK()}<p>La copia de seguridad cifrada sigue en el colegio y en la UE.</p></div>
</div>
<aside>Pasar de Esencial a Completo no obliga a empezar de cero. El servidor de Esencial se queda donde está y pasa a ser el servidor de datos, con todo lo que tenía: datos, reglas, usuarios e historial. A su lado, dentro del colegio, se añade el servidor de IA, que es donde trabaja la IA, también con el correo. DirectorIA sigue sin guardar datos de alumnos: solo del profesorado y del funcionamiento del colegio. Fijaos en el dibujo: el servidor de datos no lleva la luz naranja, porque ahí no actúa la IA; el servidor de IA, sí. Nada de lo que ya funcionaba cambia: guardias, fichas y guías de los protocolos siguen saliendo de las reglas del colegio, los justificantes del profesorado siguen en su carpeta, sin que la IA los lea, y la copia de seguridad cifrada sigue en el colegio y en un centro de datos de la UE. Por eso se puede empezar con Esencial y decidir más adelante. Lo que cuesta el paso está en las condiciones, después de los precios.</aside>
</section>
''')
print('ok paso-completo')

# ---------- Precios: lo que cuesta cada versión ----------
# Solo la tabla y la banda. Las condiciones van enteras en la diapositiva siguiente (condiciones-versiones).
def ppl(n, label):
    g = ''.join(f'<circle cx="{12+32*i}" cy="9" r="7"/><path d="M{1+32*i} 35V27a8 8 0 0 1 8-8h6a8 8 0 0 1 8 8v8z"/>' for i in range(n))
    w = 32 * n - 8
    return f'<svg class="inv-ppl" width="{w}" height="36" viewBox="0 0 {w} 36" role="img" aria-label="{label}"><g fill="#2E5A50">{g}</g></svg>'
# Precios de los planes del 26 de noviembre de 2026, sin IVA, y debajo con IVA (lo que paga el colegio).
PRECIOS = {
 'Hasta 40 docentes': ((600, 4700), (1200, 7750)),
 'De 41 a 80 docentes': ((800, 4700), (1600, 7750)),
 'De 81 a 150 docentes': ((1100, 6100), (2200, 9150)),
}
def eur(n):
    return f'{n:,}'.replace(',', '.') + '\u00a0€'
def iva(n):
    return int(n * 1.21 + 0.5)
def celda(mes, ini):
    return (f'<div class="pr-cell"><p class="pr-num">{eur(mes)} <span>al mes</span></p>'
            f'<p class="pr-fee">+ <b>{eur(ini)}</b> de cuota inicial</p>'
            f'<p class="pr-iva">Con IVA: {eur(iva(mes))} al mes y {eur(iva(ini))}</p></div>')
def fila(t, n, label):
    (em, ei), (cm, ci) = PRECIOS[t]
    return f'<div class="pr-size"><h3>{t}</h3>{ppl(n, label)}</div>{celda(em, ei)}{celda(cm, ci)}'
open(os.path.join(D, 'precios-versiones.html'), 'w').write(f'''<section id="precios-versiones">
<img class="marca" src="{B('isotipo')}" alt="" width="56" height="56">
<p class="eyebrow">Precios</p>
<h2 class="title ac-title">Lo que cuesta cada versión</h2>
<div class="pr-grid">
<div class="pr-corner"><p>Precios sin IVA</p></div>
<div class="pr-hd pr-e"><div class="pr-hd-top"><h3 class="pr-v">Esencial</h3><p class="vs-tag">sin IA</p></div><p class="pr-sub">Servidor de datos en el colegio</p></div>
<div class="pr-hd pr-c"><div class="pr-hd-top"><h3 class="pr-v">Completo</h3><p class="vs-tag ia">con IA</p></div><p class="pr-sub">Servidor de datos y servidor de IA en el colegio</p></div>
{fila("Hasta 40 docentes", 2, "Claustro pequeño")}
{fila("De 41 a 80 docentes", 4, "Claustro mediano")}
{fila("De 81 a 150 docentes", 8, "Claustro grande")}
</div>
<div class="pr-band"><img class="pr-band-ill" src="{B('colegio')}" alt="Un colegio, con el servidor de DirectorIA dentro" width="88" height="88"><p><b>Las dos, llave en mano:</b> equipos, instalación, borradores de protección de datos, formación al claustro, soporte, actualizaciones y una visita al año.</p></div>
<aside>Los precios de cada versión según el tamaño del claustro: hasta 40 docentes, de 41 a 80 y de 81 a 150. Como en la web, cada plan tiene una suscripción al mes y una cuota inicial, que paga los equipos y la instalación. Decir las cifras enteras, las dos, y que van sin IVA. Debajo de cada una está con IVA, que es lo que suele pagar un colegio: la enseñanza está exenta de IVA y normalmente no lo recupera. Con IVA, el primer año sale a 14.399, 17.303 y 23.353 € con Esencial, y a 26.802, 32.610 y 43.016 € con Completo; los años siguientes, a 8.712, 11.616 y 15.972 € con Esencial, y a 17.424, 23.232 y 31.944 € con Completo. La luz va aparte, y con Completo también el consumo de Claude, si el colegio lo activa. Esencial lleva el servidor de datos dentro del colegio; Completo, el servidor de datos y el servidor de IA, también dentro del colegio. Las figuras de cada fila solo indican el tamaño del claustro. Las dos versiones van llave en mano: equipos, instalación, los borradores de protección de datos (el registro de actividades, los textos para informar al profesorado y al comité y la evaluación de impacto, que en Esencial puede no hacer falta: es una pregunta para el abogado; los revisa el delegado de protección de datos del colegio y los aprueba el colegio), formación al claustro, soporte, actualizaciones y una visita al año. Las condiciones (el paso de Esencial a Completo, el IVA, el compromiso, los claustros de más de 150 docentes y Claude) van enteras en la diapositiva siguiente.</aside>
</section>
''')
print('ok precios-versiones')

# ---------- Las condiciones, enteras ----------
# «Sin letra pequeña»: cada condición, a 28 px y con su título, en vez de cuatro líneas grises al pie de la tabla.
COND = [
 ('Cuota inicial', 'Paga los equipos y la instalación, y los equipos son vuestros. Si su precio sube más de un 10&nbsp;% antes del pedido, la cuota sube lo&nbsp;mismo.'),
 ('Pasar de Esencial a Completo', '3.050&nbsp;€ (3.690&nbsp;€ con IVA) por el servidor de IA, su instalación y la formación, más la diferencia de cuota. Precio fijado en el contrato desde el&nbsp;principio.'),
 ('Precios sin IVA', 'A la cuota inicial y a la suscripción se les suma el 21&nbsp;%&nbsp;de&nbsp;IVA.'),
 ('Compromiso mínimo', 'Dos cursos escolares, por escrito antes de&nbsp;firmar.'),
 ('Más de 150 docentes', 'Lo vemos juntos, con equipos y precio a vuestra&nbsp;medida.'),
 ('Claude, opcional en Completo', 'Si lo usáis, el colegio paga su uso directamente a Anthropic, con su propia&nbsp;cuenta.'),
]
items = '\n'.join(f'<div class="cd-it"><h3 class="cd-h">{h}</h3><p class="cd-p">{t}</p></div>' for h, t in COND)
open(os.path.join(D, 'condiciones-versiones.html'), 'w').write(f'''<section id="condiciones-versiones" class="cd-slide">
<img class="marca" src="{B('isotipo')}" alt="" width="56" height="56">
<p class="eyebrow">Precios · Condiciones</p>
<h2 class="title vs-t">Las condiciones, enteras</h2>
<div class="cd-grid">
{items}
</div>
<div class="vf-band"><img class="vf-band-ill" src="{B('acta')}" alt="Documento firmado" width="88" height="88"><p><b>Sin letra pequeña:</b> antes de firmar, tenéis todo esto por&nbsp;escrito.</p></div>
<aside>Las condiciones, enteras y sin letra pequeña; valen para las dos versiones. La cuota inicial paga los equipos y la instalación, y los equipos son del colegio. Los precios van sin IVA: a la cuota inicial y a la suscripción se les suma el 21 % de IVA. El compromiso mínimo es de dos cursos escolares y se da por escrito antes de firmar. Pasar de Esencial a Completo cuesta 3.050 € sin IVA (3.690 € con IVA) en los tres tamaños, por el servidor de IA, su instalación y dos horas más de formación, más la diferencia de cuota: 600, 800 o 1.100 € al mes sin IVA. Así, empezar con Esencial y pasar después cuesta lo mismo que empezar con Completo, menos los meses sin IA. El precio queda fijado en el contrato desde el principio. Si el precio de los equipos sube más de un 10 % antes del pedido, la cuota inicial sube lo mismo: memoria y discos han subido mucho en 2026, y cada presupuesto se pide por escrito, con 30 días de validez. Si el claustro pasa de 150 docentes, se estudian aparte los equipos y el precio. Claude es un módulo opcional de Completo: si lo usan, el colegio paga su uso directamente a Anthropic, con su propia cuenta. Todo esto va por escrito antes de firmar.</aside>
</section>
''')
print('ok condiciones-versiones')

# ---------- Portadilla de la comparativa: el nombre de cada versión bajo su colegio ----------
p = os.path.join(D, 'portadilla-comparativa.html'); s = open(p).read()
a = '<div class="pt-pair"><img src="/_blob/90f154b5ce218459d66291997a8912f3" alt="Un colegio" width="300" height="300"><img src="/_blob/195ef65697985bbbe261d2103f560951" alt="El mismo colegio, con el servidor de DirectorIA a la vista" width="300" height="300"></div>'
b = '<div class="pt-pair"><div class="pt-fig"><img src="/_blob/90f154b5ce218459d66291997a8912f3" alt="Un colegio" width="300" height="300"><p>Esencial</p></div><div class="pt-fig"><img src="/_blob/195ef65697985bbbe261d2103f560951" alt="El mismo colegio, con el servidor de DirectorIA a la vista" width="300" height="300"><p>Completo</p></div></div>'
if a in s:
    s = s.replace(a, b); open(p, 'w').write(s)
print('ok portadilla-comparativa')
