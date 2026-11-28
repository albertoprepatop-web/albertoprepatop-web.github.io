# Genera las cuatro diapositivas de funciones por cargo: esencial-funciones-1/2 y completo-funciones-1/2.
# Esencial lleva puntos; Completo, la insignia en lo que escribe la IA y la etiqueta «con IA» en lo que la IA
# busca, lee o detecta sin escribir. Uso: python3 tools/gen_funciones.py project/slides
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from ilus import B, INS, CON_IA, antetitulo
D = sys.argv[1]

ROL = {
 'direccion': ('Dirección', 'direccion', 'Directora con la tableta del resumen del día'),
 'jefatura': ('Jefatura de estudios', 'jefatura', 'Jefe de estudios con el cuadrante de horarios'),
 'secretaria': ('Secretaría', 'secretaria', 'Secretario con el sello del centro'),
 'docentes': ('Docentes', 'docente', 'Maestra dibujando en la pizarra'),
 'orientacion': ('Orientación y convivencia', 'orientacion', 'Orientadora con un bocadillo con un corazón'),
}
# Insignia de la banda, dentro de un disco como el de las ilustraciones del kit
DISCO_INS = ('<svg class="vf-band-ill" viewBox="0 0 88 88" width="88" height="88" role="img" aria-label="Lo escribe la IA">'
             '<circle cx="44" cy="44" r="38" fill="#D5DED9"/><circle cx="44" cy="44" r="22" fill="#17322C"/>'
             '<path d="M44 29.7 48.8 44 44 58.3 39.2 44z" fill="#E07A3A"/></svg>')

def item(marca, texto):
    if marca == 'pt':
        return f'<div class="vf-it"><span class="vf-bul"></span><p>{texto}</p></div>'
    if marca == 'ins':
        return f'<div class="vf-it">{INS()}<p>{texto}</p></div>'
    if marca == 'ia':
        return f'<div class="vf-it vf-ia">{CON_IA}<p>{texto}</p></div>'
    raise ValueError(marca)

def tarjeta(rol, items, nota=None, extra=''):
    nombre, ilus, alt = ROL[rol]
    out = [f'<div class="vf-col{extra}">',
           f'<div class="vf-head"><img class="vf-ill" src="{B(ilus)}" alt="{alt}" width="88" height="88"><h3 class="vf-role">{nombre}</h3></div>',
           '<div class="vf-list">']
    hubo_ins = False
    for marca, texto in items:
        if marca == 'ia' and hubo_ins:
            out.append('<div class="vf-sep"></div>'); hubo_ins = False
        if marca == 'ins': hubo_ins = True
        out.append(item(marca, texto))
    out.append('</div>')
    if nota:
        out.append(f'<div class="vf-note"><span class="vf-bul"></span><p>{nota}</p></div>')
    out.append('</div>')
    return '\n'.join(out)

def banda(ill, texto):
    return f'<div class="vf-band">{ill}<p>{texto}</p></div>'
def ill_banda(nombre, alt):
    return f'<img class="vf-band-ill" src="{B(nombre)}" alt="{alt}" width="88" height="88">'

def slide(id_, version, eyebrow, titulo, rejilla, cuerpo, band, notas):
    return f'''<section id="{id_}">
<img class="marca" src="{B('isotipo')}" alt="" width="56" height="56">
{antetitulo(eyebrow, version)}
<h2 class="title vs-t">{titulo}</h2>
<div class="vf-grid {rejilla}">
{cuerpo}
</div>
{band}
<aside>{notas}</aside>
</section>
'''

# ---------------- Esencial ----------------
# Lista de funciones de la decisión del 26-28 de noviembre de 2026: DirectorIA no guarda datos de alumnos, solo del profesorado
# y del funcionamiento del colegio. Fuera certificados, autorizaciones de imagen, optativas, reclamaciones, pautas y anotaciones.
E1 = slide('esencial-funciones-1', 'esencial', 'Esencial · Funciones · 1/2', 'Para dirección y jefatura de estudios', 'c2',
 tarjeta('direccion', [
   ('pt', '<b>Resumen de las 8:00:</b> quién falta del profesorado, qué vence y&nbsp;qué&nbsp;firmar.'),
   ('pt', '<b>Dosier para inspección:</b> documentos del centro por tipo, curso y&nbsp;fecha.'),
   ('pt', '<b>Guías de los protocolos:</b> acoso, absentismo y&nbsp;accidentes.'),
   ('pt', '<b>Archivo de actas</b> del claustro y del consejo escolar, con búsqueda por&nbsp;palabras.'),
 ]) + '\n' +
 tarjeta('jefatura', [
   ('pt', '<b>Guardias y sustituciones,</b> con vuestras&nbsp;reglas.'),
   ('pt', '<b>Ficha de sustitución:</b> solo la&nbsp;clase.'),
   ('pt', '<b>Horarios,</b> con un programa que cuadra las&nbsp;restricciones.'),
   ('pt', '<b>Exámenes y aulas:</b> avisa de cada&nbsp;choque.'),
   ('pt', '<b>Ausencias del profesorado:</b> sin el motivo; justificante entregado o&nbsp;pendiente.'),
   ('pt', '<b>Programaciones:</b> comprueba que tienen los apartados del&nbsp;modelo.'),
 ]),
 banda(ill_banda('colegio', 'Un colegio, con el servidor de DirectorIA dentro'), 'Lo prepara DirectorIA <b>con las reglas del colegio y sin datos de alumnos,</b> y decide siempre una&nbsp;persona.'),
 'Todas las funciones de Esencial para dirección y jefatura de estudios. Ninguna usa IA: salen de las reglas del colegio y de sus datos de funcionamiento, y decide siempre una persona. DirectorIA no guarda datos de alumnos: solo del profesorado y del funcionamiento del colegio. '
 'Dirección recibe a las 8:00 quién falta del profesorado, qué vence y qué hay que firmar (sin resumen de correos, que es de Completo). El dosier para inspección reúne los documentos del centro por tipo, curso y fecha. '
 'Las guías de los protocolos de acoso, absentismo y accidentes explican cómo se hace y los pasos que hay que seguir, con quién, el plazo y la plantilla oficial en blanco de cada anexo; no se abre ningún caso en DirectorIA. Las actas del claustro y del consejo escolar se buscan por palabras. '
 'Para jefatura: DirectorIA propone quién cubre cada hora con las reglas del colegio (quién tiene guardia u hora libre, cuántas lleva este mes y si conoce al grupo), y jefatura confirma; la ficha de sustitución solo lleva la clase: la tarea de la programación, el material y a quién llamar. '
 'Los horarios se cuadran con un programa que tiene en cuenta las restricciones; exámenes y aulas avisan de cada choque, y el informe de ausencias del profesorado dice quién falta y a qué horas, nunca el motivo: del justificante solo pone «entregado» o «pendiente». '
 'DirectorIA comprueba, además, que las programaciones tienen los apartados del modelo del colegio. Los ejemplos que vienen después enseñan las guardias, la ficha, los justificantes y la guía del protocolo de acoso.')

E2 = slide('esencial-funciones-2', 'esencial', 'Esencial · Funciones · 2/2', 'Para secretaría, docentes y orientación', 'c3',
 tarjeta('secretaria', [
   ('pt', '<b>Analista de gastos:</b> facturas, contratos y&nbsp;extractos.'),
   ('pt', '<b>Mantenimiento,</b> con aviso de cada&nbsp;revisión.'),
   ('pt', '<b>Entregas a la Consejería,</b> con&nbsp;aviso.'),
   ('pt', '<b>Justificantes</b> del profesorado, archivados en&nbsp;carpetas.'),
 ]) + '\n' +
 tarjeta('docentes', [
   ('pt', '<b>Programación quincenal:</b> de ahí sale la tarea de la&nbsp;ficha.'),
   ('pt', '<b>Plazos y entregas,</b> con&nbsp;aviso.'),
   ('pt', '<b>Banco de recursos:</b> catálogo, búsqueda y gamificación. Al subir, avisa si hay un DNI, un © o un&nbsp;ISBN.'),
   ('pt', '<b>Sus justificantes:</b> los sube y elige la&nbsp;ausencia.'),
 ]) + '\n' +
 tarjeta('orientacion', [
   ('pt', '<b>Guías de los protocolos,</b> paso a paso y con sus&nbsp;plantillas.'),
   ('pt', '<b>Plan de convivencia</b> y documentos del&nbsp;departamento.'),
 ]),
 banda(ill_banda('candado', 'Candado'), '<b>Para todos:</b> avisos, permisos por cargo, registro de accesos y copias de seguridad cifradas, en el colegio y en la&nbsp;UE.'),
 'El resto de cargos, también sin IA. Secretaría: el analista de gastos, que con cálculos y reglas lee las facturas electrónicas, los contratos y los extractos del banco, avisa de las renovaciones, señala ahorros y compara presupuestos; el calendario de revisiones del edificio, con aviso; los plazos y las entregas a la Consejería, con aviso, y los justificantes del profesorado: cada docente sube el suyo y un programa, con reglas, lo renombra y lo archiva en su carpeta (justificantes, curso, mes y docente). Ningún programa lee su contenido; solo lo abren el propio docente y quien lleva el personal, con registro de accesos, y se borra cuando pasa el plazo que fije el colegio. '
 'Docentes: la programación quincenal por sesiones, de la que sale la tarea de la ficha; sus plazos y entregas, con aviso; el banco de recursos del claustro, con curso y materia obligatorios, catálogo, búsqueda por palabras y gamificación (al subir un recurso, unas reglas avisan si aparece un DNI, un © o un ISBN), y sus justificantes, que suben desde DirectorIA, no por correo, eligiendo la ausencia a la que corresponden. '
 'Orientación y convivencia: las guías de los protocolos, paso a paso y con sus plantillas, y el plan de convivencia y los documentos del departamento. No hay pautas ni anotaciones del alumnado: DirectorIA no guarda datos de alumnos. '
 'Para todos: avisos, permisos por cargo, registro de accesos y copias de seguridad cifradas, una en el colegio y otra en la UE. Los avisos y los correos salen por la cuenta del propio colegio.')

# ---------------- Completo ----------------
C1 = slide('completo-funciones-1', 'completo', 'Completo · Funciones · 1/2', 'Además, para dirección, jefatura y secretaría', 'c2 vf-pila',
 tarjeta('direccion', [
   ('ins', '<b>Correo resumido,</b> con respuestas propuestas que revisa y envía una&nbsp;persona.'),
   ('ins', '<b>Resumen de las 8:00,</b> con los correos que&nbsp;importan.'),
   ('ins', '<b>Acta del claustro,</b> a partir del&nbsp;dictado.'),
   ('ia', '<b>Archivo de actas:</b> busca también por&nbsp;tema.'),
 ]) + '\n<div class="vf-stack">\n' +
 tarjeta('jefatura', [
   ('ins', '<b>Programaciones:</b> revisa que cada apartado tenga&nbsp;sentido.'),
 ]) + '\n' +
 tarjeta('secretaria', [
   ('ins', '<b>Plazos</b> sacados de las circulares en&nbsp;PDF.'),
   ('ia', '<b>Facturas</b> escaneadas o en foto, para el&nbsp;analista.'),
 ]) + '\n</div>',
 banda(DISCO_INS, 'Lo que escribe la IA lleva esta marca y <b>«Preparado con IA»,</b> y lo revisa una persona. Guardias, ficha, horarios y protocolos siguen igual, sin&nbsp;IA.'),
 'Lo que añade la IA, empezando por dirección, jefatura y secretaría; todo lo de Esencial sigue igual. La marca naranja va en lo que escribe la IA, en el servidor del colegio, y siempre lo revisa una persona. '
 'Dirección: el correo llega resumido, con lo que piden y respuestas propuestas, que nunca se envían solas: las revisa y las envía una persona; el resumen de las 8:00 suma los correos que importan, y el acta del claustro sale del dictado. '
 'Jefatura: además de comprobar que las programaciones tienen los apartados del modelo, la IA revisa que cada apartado tenga sentido. Secretaría: la IA saca de las circulares en PDF qué hay que entregar, quién y cuándo. '
 'Las líneas con «con IA» son cosas que la IA busca o lee, sin escribir nada: el archivo de actas se puede buscar por tema, no solo por palabras, y el analista lee también las facturas escaneadas o en foto (las electrónicas ya las leía Esencial). '
 'Insistir en lo de abajo: guardias, ficha, horarios y guías de los protocolos siguen saliendo de las reglas del colegio, sin IA, también en Completo. Y los justificantes del profesorado, igual: los archiva un programa y la IA no los lee.')

C2 = slide('completo-funciones-2', 'completo', 'Completo · Funciones · 2/2', 'Además, para docentes y orientación', 'c2d',
 tarjeta('docentes', [
   ('ins', '<b>Correo dictado:</b> comunicaciones generales, sin datos de un&nbsp;alumno.'),
   ('ins', '<b>Asistente</b> para dudas sobre los documentos del centro: cita la&nbsp;fuente.'),
   ('ins', '<b>Banco:</b> adapta un recurso a otro&nbsp;curso.'),
   ('ins', '<b>Material didáctico con Claude,</b> opcional, en la nube y sin datos de&nbsp;alumnos.'),
   ('ia', '<b>Buscador del banco</b> que entiende la&nbsp;petición.'),
   ('ia', '<b>Al subir,</b> sugiere contenidos y avisa de nombres o datos de&nbsp;salud.'),
 ]) + '\n' +
 tarjeta('orientacion', [
   ('ins', '<b>Circulares generales</b> en lectura fácil o&nbsp;traducidas.'),
 ], nota='Las guías de los protocolos y el plan de convivencia siguen igual, sin&nbsp;IA.'),
 banda(ill_banda('colegio-servidor', 'Colegio con el servidor de DirectorIA dentro'), '<b>Para todos:</b> la IA trabaja dentro del colegio, también con el correo. Los justificantes los archiva un programa en su carpeta; la IA no los&nbsp;lee.'),
 'Lo que añade la IA al resto del claustro. Docentes: el correo se dicta y llega redactado para revisar; sirve para comunicaciones generales, por ejemplo a las familias de un grupo, sin datos de un alumno. Un asistente responde dudas sobre los documentos del centro y cita el documento de donde saca cada respuesta; el banco de recursos adapta un recurso a otro curso. '
 'Claude es un módulo opcional, en la nube, solo para material didáctico y sin datos de alumnos; lo paga el colegio con su propia cuenta. '
 'Las líneas con la etiqueta «con IA» son lo que la IA hace sin escribir: el buscador del banco entiende lo que se le pide y, al subir un recurso, la IA sugiere contenidos del catálogo y avisa si aparecen nombres o datos de salud: es el filtro que impide que entren en el banco. '
 'Orientación y convivencia: circulares generales en lectura fácil o traducidas; las guías de los protocolos y el plan de convivencia siguen igual, sin IA. Todo lo que escribe la IA lleva la marca naranja y «Preparado con IA», y lo revisa una persona. '
 'La IA trabaja dentro del colegio, también con el correo: lo que llega puede traer nombres de alumnos, porque lo escriben las familias; la IA lo lee en el servidor del colegio para resumirlo, y DirectorIA no crea fichas de alumnos ni guarda sus datos aparte. '
 'Los justificantes del profesorado los archiva un programa en su carpeta, y la IA no tiene acceso a ella: no la busca, no la resume y el asistente no la usa.')

for id_, html in (('esencial-funciones-1', E1), ('esencial-funciones-2', E2), ('completo-funciones-1', C1), ('completo-funciones-2', C2)):
    open(os.path.join(D, id_ + '.html'), 'w').write(html)
    print('ok', id_)
