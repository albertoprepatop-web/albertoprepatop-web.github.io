# Genera la guía del protocolo contra el acoso escolar: protocolo-acoso-esencial (parte 1) y protocolo-pasos-esencial (anexo).
# Decisión del 26-28 de noviembre de 2026: DirectorIA explica cómo se hace y los pasos que hay que seguir, según el protocolo
# vigente de la comunidad (el ejemplo, el de la Comunidad de Madrid). No se abre ningún caso en DirectorIA: ni «Caso 2026-07»,
# ni «Alumno/a A», ni citaciones a una familia, ni recordatorios de un caso. Los datos del caso van donde manda el protocolo
# (Raíces y el expediente del centro). En cada paso: qué se hace, quién lo hace, el plazo («según el protocolo vigente» si no
# hay uno fijo), qué anexo se usa (plantilla oficial en blanco, para descargar e imprimir) y qué hay que cuidar.
# Lo legal, como lectura del equipo y no de un abogado (punto 10 de la decisión). Sin IA: es parte de Esencial.
# Uso: python3 tools/gen_protocolo.py project/slides
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from ilus import B, antetitulo
D = sys.argv[1]

# (número, paso, lo que dice el panel de la guía, quién lo hace, plazo, anexo y registro)
# Una sola tabla de pasos: quién y plazo son los de la guía de la demo (src/datos/orientacion.js, guía «acoso»). Hasta
# contrastarla con el texto oficial, todos los plazos dicen «Según el protocolo vigente», salvo el paso 1 («En cuanto se
# conozcan los hechos») y el 8 («Los que fija el decreto», el de convivencia). En el paso 5 se dice quién decide: la
# dirección, tras la reunión; ni «el equipo» ni DirectorIA. Solo los pasos 1, 4, 5 y 9 llevan anexo.
PASOS = [
 (1, 'Comunicación a la dirección', 'Anexo I.a o I.b', 'Cualquier persona del centro: profesorado, personal, familias o alumnado', 'En cuanto se conozcan los hechos', 'Anexo I.a o I.b'),
 (2, 'Apertura y comunicación oficial', 'En Raíces', 'La dirección', 'Según el protocolo vigente', 'En Raíces'),
 (3, 'Medidas de protección', 'Decide la dirección', 'Las decide la dirección', 'Según el protocolo vigente', None),
 (4, 'Recogida de información', 'Anexo II · dos docentes', 'Dos docentes que designa la dirección', 'Según el protocolo vigente', 'Anexo II'),
 (5, 'Reunión para la toma de decisiones', 'Anexo III · decide la dirección', 'Convoca y decide la dirección', 'Según el protocolo vigente', 'Anexo III'),
 (6, 'Fiscalía de Menores e Inspección', None, 'La dirección', 'Según el protocolo vigente', None),
 (7, 'Familias y plan de intervención', None, 'La dirección, con orientación y la tutoría', 'Según el protocolo vigente', None),
 (8, 'Procedimiento disciplinario', None, 'La dirección', 'Los que fija el decreto', None),
 (9, 'Seguimiento y cierre', 'Anexo IV.c · Raíces', 'La dirección, con orientación y la tutoría', 'Según el protocolo vigente', 'Anexo IV.c · Raíces'),
]
SI_SE_CONFIRMA = (6, 7, 8)
ELEGIDO = 4
_con_anexo = [str(p[0]) for p in PASOS if p[5] and p[5].startswith('Anexo')]
CON_ANEXO = ', '.join(_con_anexo[:-1]) + ' y ' + _con_anexo[-1]   # «1, 4, 5 y 9»
DISC = ('Es nuestra lectura del protocolo de la Comunidad de Madrid, no la de un abogado: manda el texto oficial. '
        'Cada colegio sigue el de su comunidad.')
LECTURA = 'Es nuestra lectura del protocolo vigente, no la de un abogado: manda el texto oficial.'
SIN_CASO = 'El caso no se abre en DirectorIA: sus datos van a Raíces y al expediente del centro.'
DOTS = '<div class="ac-dots"><span class="ac-dot"></span><span class="ac-dot"></span><span class="ac-dot"></span></div>'

def it(texto, cls='ac-bul'):
    return f'<div class="ac-it"><span class="{cls}"></span><p>{texto}</p></div>'

# ---------- Parte 1: la guía en la aplicación ----------
def paso_panel(n, nombre, meta):
    on = ' on' if n == ELEGIDO else ''
    if meta:
        return f'<div class="pg-step{on}"><p class="pg-n">{n}</p><div><p class="ac-sl">{nombre}</p><p class="ac-sm">{meta}</p></div></div>'
    return f'<div class="pg-step{on}"><p class="pg-n">{n}</p><p class="ac-sl">{nombre}</p></div>'

panel = []
for n, nombre, meta, *_ in PASOS:
    if n == SI_SE_CONFIRMA[0]:
        panel.append('<div class="ac-grp"><p class="ac-sm ac-grp-cap"><b>Si se confirma el acoso</b></p>')
    panel.append(paso_panel(n, nombre, meta))
    if n == SI_SE_CONFIRMA[-1]:
        panel.append('</div>')
PANEL = '\n'.join(panel)

GUIA = f'''<section id="protocolo-acoso-esencial">
<img class="marca" src="{B('isotipo')}" alt="" width="56" height="56">
{antetitulo('Esencial · Ejemplo · Protocolo contra el acoso escolar', 'esencial')}
<h2 class="title ac-title">Qué hacer ante un posible acoso, paso a paso</h2>
<div class="ac-win">
<div class="ac-bar">{DOTS}<p class="ac-wt">DirectorIA · Guías de los protocolos · Acoso escolar</p><div class="ac-badge"><p>Comunidad de Madrid</p></div></div>
<div class="ac-body">
<div class="ac-side pg-side">
{PANEL}
</div>
<div class="ac-main">
<p class="ac-h">Paso {ELEGIDO} · Recogida de información</p>
<p class="ac-sub">Qué se hace, quién lo hace, en qué plazo y con qué plantilla</p>
<div class="ac-grid">
<div class="ac-blk"><div class="ac-bt"><p>Qué se hace</p></div>
{it('Entrevistar al alumnado implicado, a las familias y&nbsp;a&nbsp;quien lo haya visto')}
{it('Anotarlo en el Anexo II y entregarlo firmado a&nbsp;la&nbsp;dirección')}
</div>
<div class="ac-blk"><div class="ac-bt"><p>Quién lo hace</p></div>
{it('Dos docentes que designa la dirección')}
{it('Pueden apoyar orientación y la coordinación de bienestar')}
</div>
<div class="ac-blk"><div class="ac-bt"><p>Plazo y plantilla</p></div>
{it('Según el protocolo vigente')}
{it('Anexo II: la plantilla oficial, en blanco')}
<div class="pg-btns"><p class="pg-btn">Descargar</p><p class="pg-btn pg-btn2">Imprimir</p></div>
</div>
<div class="ac-blk warn"><div class="ac-bt"><p>Qué hay que cuidar</p></div>
{it('Confidencialidad: solo quien interviene')}
{it('No prejuzgar: un indicio no es una prueba')}
{it('Escuchar sin interpretar')}
{it('Las medidas las decide la dirección')}
</div>
</div>
<div class="pg-aviso"><p>{SIN_CASO}</p></div>
</div>
</div>
</div>
<p class="ac-note"><span class="ac-lead">DirectorIA explica cómo se hace; deciden las personas.</span> Cada paso, con quién lo hace y su plazo; los que llevan anexo, con la plantilla oficial en&nbsp;blanco.</p>
<p class="ac-disc">{DISC}</p>
<aside>La guía del protocolo contra el acoso escolar, en Esencial y sin IA. DirectorIA explica cómo se hace y los pasos que hay que seguir, según el protocolo vigente en la comunidad del colegio; el ejemplo es el de la Comunidad de Madrid. A la izquierda, los nueve pasos: comunicación a la dirección (Anexo I.a, o I.b si lo comunica un alumno); apertura y comunicación oficial, en Raíces; medidas de protección, que decide la dirección; recogida de información, con el Anexo II y dos docentes; reunión para la toma de decisiones, con el Anexo III, en la que la dirección decide si hay acoso y con qué medidas, y, si se confirma, comunicación a la Fiscalía de Menores y a la Inspección, familias y plan de intervención, y procedimiento disciplinario; al final, seguimiento y cierre, con el Anexo IV.c. A la derecha, el paso 4 abierto: qué se hace, quién lo hace, el plazo (si el protocolo no fija uno, «según el protocolo vigente») y la plantilla oficial del anexo, en blanco, para descargarla e imprimirla. Llevan anexo los pasos {CON_ANEXO}; los demás dicen quién lo hace y en qué plazo. Y qué hay que cuidar: la confidencialidad, no prejuzgar y que las medidas las decide la dirección. Insistir en lo de abajo: no se abre ningún caso en DirectorIA. No hay nombres de alumnos, ni citaciones a una familia, ni recordatorios de un caso: los datos del caso van donde manda el protocolo, a Raíces y al expediente del centro. {LECTURA} Hay guías iguales para el protocolo de absentismo y el de accidentes. Si preguntan por todos los pasos, el anexo del final los tiene uno a uno.</aside>
</section>
'''

# ---------- Anexo: los nueve pasos, uno a uno ----------
def fila(n, nombre, quien, plazo, anexo):
    c4 = f'<b>{anexo}</b>' if anexo else ''
    return (f'<div class="pp-row"><div class="pp-c1"><p class="pg-n">{n}</p><p>{nombre}</p></div>'
            f'<p class="pp-c2">{quien}</p><p class="pp-c3">{plazo}</p><p class="pp-c4">{c4}</p></div>')

filas = ['<div class="pp-row pp-hd"><p class="pp-c1">Paso</p><p class="pp-c2">Quién lo hace</p><p class="pp-c3">Plazo</p><p class="pp-c4">Anexo y registro</p></div>']
for n, nombre, _meta, quien, plazo, anexo in PASOS:
    if n == SI_SE_CONFIRMA[0]:
        filas.append('<div class="pp-grp"><p class="pp-cap">Si se confirma el acoso</p>')
    filas.append(fila(n, nombre, quien, plazo, anexo))
    if n == SI_SE_CONFIRMA[-1]:
        filas.append('</div>')
TABLA = '\n'.join(filas)

PASOS_HTML = f'''<section id="protocolo-pasos-esencial">
<img class="marca" src="{B('isotipo')}" alt="" width="56" height="56">
{antetitulo('Anexo · Esencial · Protocolo contra el acoso escolar', 'esencial')}
<h2 class="title ac-title">Los nueve pasos, uno a uno</h2>
<div class="pp-tab">
{TABLA}
</div>
<p class="ac-note"><span class="ac-lead">Los pasos que llevan anexo, con la plantilla oficial en&nbsp;blanco.</span> {SIN_CASO}</p>
<p class="ac-disc">{DISC}</p>
<aside>Anexo: enseñarla solo si preguntan por todos los pasos del protocolo de acoso. Es la guía de la diapositiva de la parte 1, paso a paso: quién hace cada uno, en qué plazo y con qué anexo, según el protocolo de la Comunidad de Madrid. Los plazos los fija el texto oficial: la comunicación a la dirección se hace en cuanto se conocen los hechos, el procedimiento disciplinario sigue los plazos del decreto de convivencia de la comunidad (en Madrid, el Decreto 32/2019) y, en el resto, la guía dice «según el protocolo vigente». Los pasos 6 a 8 solo se siguen si la dirección, tras la reunión del paso 5, concluye que hay acoso; no lo decide DirectorIA. Los pasos que llevan anexo ({CON_ANEXO}) traen la plantilla oficial en blanco, para descargarla e imprimirla; la apertura y el cierre quedan además en Raíces. No se abre ningún caso en DirectorIA: los datos del caso van a Raíces y al expediente del centro. {LECTURA} Cada colegio configura el protocolo vigente en su comunidad autónoma.</aside>
</section>
'''

for id_, html in (('protocolo-acoso-esencial', GUIA), ('protocolo-pasos-esencial', PASOS_HTML)):
    open(os.path.join(D, id_ + '.html'), 'w').write(html)
    print('ok', id_)
