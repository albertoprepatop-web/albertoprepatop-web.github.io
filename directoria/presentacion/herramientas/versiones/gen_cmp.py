# Genera comparativa-1, -2 y -3: la tabla Esencial / Completo por cargo, a 28 px y con filas de 60 px.
# Marcas: el visto salvia (incluido, con las reglas del colegio), la insignia (lo escribe la IA), la etiqueta «con IA»
# (la IA busca, lee o detecta, sin escribir) y la raya (no incluido). Toda celda incluida lleva su marca, también con matiz.
# Uso: python3 tools/gen_cmp.py project/slides
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from ilus import B, INS, OK, NO
D = sys.argv[1]
TAG = '<span class="vs-tag ia">con IA</span>'

def cell(v):
    # True = incluido (visto); None = no incluido; ('ok'|'ins'|'ia', texto) = incluido, con matiz
    if v is True: return OK()
    if v is None: return NO
    marca, texto = v
    m = {'ok': OK(), 'ins': INS(), 'ia': TAG}[marca]
    return m + (f'<p>{texto}</p>' if texto else '')

def table(groups):
    out = ['<div class="cmp">',
           '<div class="cmp-hd"><p>Cargo</p></div><div class="cmp-hd"><p>Función</p></div>',
           '<div class="cmp-hd"><p class="cmp-v">Esencial</p><p class="vs-tag">sin IA</p></div>',
           '<div class="cmp-hd"><p class="cmp-v">Completo</p><p class="vs-tag ia">con IA</p></div>']
    for gi, (role, rows) in enumerate(groups):
        last_group = gi == len(groups) - 1
        n = len(rows)
        end = ' cmp-end' if last_group else ''
        out.append(f'<div class="cmp-role cmp-r{n}{end}"><h3>{role}</h3></div>')
        for ri, (f, e, c) in enumerate(rows):
            e2 = ' cmp-end' if (last_group and ri == n - 1) else ''
            out.append(f'<div class="cmp-f{e2}"><p>{f}</p></div><div class="cmp-e{e2}">{cell(e)}</div><div class="cmp-c{e2}">{cell(c)}</div>')
    out.append('</div>')
    return '\n'.join(out)

LEG = ('<div class="cmp-legend">'
       f'<span class="cmp-li">{OK(label="Incluido")}Incluido</span>'
       f'<span class="cmp-li">{INS()}Lo escribe la IA</span>'
       f'<span class="cmp-li">{TAG}La IA busca, lee o detecta</span>'
       f'<span class="cmp-li">{NO}No incluido</span></div>')

G1 = [
 ('Dirección', [
   ('Resumen de las 8:00', ('ok', 'Faltas, plazos y firmas'), ('ins', 'Y los correos que importan')),
   ('Dosier, reclamaciones y protocolos', True, True),
   ('Archivo de actas', ('ok', 'Por palabras'), ('ia', 'Y por tema')),
   ('Correo resumido, con respuestas', None, ('ins', '')),
   ('Acta del claustro, por dictado', None, ('ins', '')),
 ]),
 ('Jefatura de&nbsp;estudios', [
   ('Guardias, sustituciones y ficha', True, True),
   ('Horarios, exámenes, optativas y aulas', True, True),
   ('Ausencias del profesorado', True, True),
   ('Revisión de programaciones', ('ok', 'Los apartados'), ('ins', 'Y que tengan sentido')),
 ]),
]
G2 = [
 ('Secretaría', [
   ('Certificados con plantilla', True, True),
   ('Autorizaciones de imagen', True, True),
   ('Mantenimiento del edificio', True, True),
   ('Analista de gastos', ('ok', 'Facturas electrónicas'), ('ia', 'Y escaneadas o en foto')),
   ('Plazos de las circulares en PDF', None, ('ins', '')),
 ]),
 ('Orientación y&nbsp;tutoría', [
   ('Pautas en la ficha y anotaciones', True, True),
   ('Cartas en lectura fácil o traducidas', None, ('ins', '')),
   ('Acta de la junta de evaluación', None, ('ins', 'Dictada; ni pone ni propone notas')),
 ]),
]
G3 = [
 ('Docentes', [
   ('Programación, plazos y entregas', True, True),
   ('Banco: catálogo y gamificación', True, ('ia', 'Y sugiere contenidos')),
   ('Banco: búsqueda', ('ok', 'Por palabras'), ('ia', 'Entiende la petición')),
   ('Banco: adaptar a otro curso', None, ('ins', '')),
   ('Al subir un recurso', ('ok', 'Avisa de DNI, © o ISBN'), ('ia', 'Y nombres o datos de salud')),
   ('Correo dictado a familias', None, ('ins', '')),
   ('Asistente para dudas', None, ('ins', 'Cita el documento de donde sale')),
   ('Material didáctico con Claude', None, ('ins', 'Opcional, sin datos de alumnos')),
 ]),
 ('Todos', [
   ('Avisos, permisos, registros y copias', True, True),
 ]),
]
NOTES1 = ('Función a función, en tres diapositivas; esta, para dirección y jefatura de estudios. No hace falta leer fila a fila: señalar lo que cambia. '
 'El visto salvia quiere decir que la función está incluida y sale de las reglas y los datos del colegio; con el visto en las dos columnas, es igual en las dos versiones, también en Completo. '
 'La marca naranja va en lo que escribe la IA: el resumen de las 8:00 suma los correos que importan, el correo llega resumido con respuestas propuestas, el acta del claustro sale del dictado y la revisión de programaciones comprueba también que cada apartado tenga sentido. '
 'La etiqueta «con IA» va en lo que la IA hace sin escribir: buscar las actas por tema. Guardias, sustituciones y ficha son iguales en las dos, y también horarios, exámenes, optativas y aulas, y el informe de ausencias del profesorado.')
NOTES2 = ('Secretaría, orientación y tutoría. Certificados, autorizaciones de imagen y mantenimiento son iguales en las dos versiones. '
 'El analista de gastos lee en Esencial las facturas electrónicas y, en Completo, también las escaneadas o en foto: la IA las lee, no escribe nada, por eso lleva «con IA». '
 'Solo en Completo, y escrito por la IA: los plazos sacados de las circulares en PDF, las cartas y circulares en lectura fácil o traducidas, y el acta de la junta de evaluación por dictado, que recoge acuerdos y no pone ni propone notas. '
 'Las pautas en la ficha y lo que se anota del alumnado son iguales en las dos.')
NOTES3 = ('Docentes y lo que es para todos. La programación quincenal, los plazos y las entregas son iguales. '
 'En el banco de recursos, Esencial ofrece catálogo, búsqueda por palabras y gamificación, y al subir un recurso unas reglas avisan si aparece un DNI, un © o un ISBN; '
 'con Completo, la IA sugiere contenidos del catálogo, el buscador entiende la petición y, al subir, la IA detecta nombres o datos de salud: llevan «con IA» porque la IA no escribe nada. '
 'Lo que escribe la IA, solo en Completo: adaptar un recurso a otro curso, el correo dictado a familias y el asistente para dudas sobre los documentos del centro, que cita el documento de donde saca cada respuesta. '
 'Claude es un módulo opcional de Completo, en la nube, solo para material didáctico y sin datos de alumnos; lo paga el colegio con su propia cuenta. '
 'Avisos, permisos, registro de accesos y copias de seguridad son iguales en las dos.')

def slide(id_, n, groups, notes, titulo):
    return f'''<section id="{id_}">
<img class="marca" src="{B('isotipo')}" alt="" width="56" height="56">
<p class="eyebrow">Comparativa · Esencial y Completo · {n}/3</p>
<h2 class="title ac-title">{titulo}</h2>
{table(groups)}
{LEG}
<aside>{notes}</aside>
</section>
'''
TITULOS = ('Función a función: dirección y jefatura', 'Función a función: secretaría y orientación', 'Función a función: docentes y para todos')
for i, (g, n) in enumerate(((G1, NOTES1), (G2, NOTES2), (G3, NOTES3)), 1):
    open(os.path.join(D, f'comparativa-{i}.html'), 'w').write(slide(f'comparativa-{i}', i, g, n, TITULOS[i - 1]))
    print('ok', f'comparativa-{i}')
