"""Genera membrete.docx y propuesta-comercial.docx con python-docx.

Uso (desde esta carpeta):  python3 generar_docx.py
Escribe los dos .docx en la carpeta de arriba (aplicaciones/papeleria/).
"""
import os
import re

import docx
from docx.enum.section import WD_SECTION
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.shared import Mm, Pt

import marca_docx as m

AQUI = os.path.dirname(os.path.abspath(__file__))
SALIDA = os.path.dirname(AQUI)
LOGO = os.path.join(AQUI, '..', '..', '..', 'logo', 'png')
RECURSOS = os.path.join(AQUI, 'recursos')

# Los PNG de 600 y 1600 px llevan 1 x de margen transparente por cada lado (logo/construccion.md).
# Fracción del ancho de la imagen que es margen, por versión (1 x / ancho total en unidades del dibujo):
MARGEN = {
    'logo-horizontal': 70 / 774.71,   # tinta 634,71 + 2 × 70
    'logo-eslogan': 70 / 774.71,
    'logotipo': 70 / 646.9,           # tinta 506,9 + 2 × 70
}


def a4(section, arriba, abajo, izquierda=25, derecha=25, cabecera=13, pie=12):
    section.page_width = Mm(210)
    section.page_height = Mm(297)
    section.top_margin = Mm(arriba)
    section.bottom_margin = Mm(abajo)
    section.left_margin = Mm(izquierda)
    section.right_margin = Mm(derecha)
    section.header_distance = Mm(cabecera)
    section.footer_distance = Mm(pie)


def logo(paragraph, version, archivo, ancho_mm):
    pic = m.imagen_alineada(paragraph, os.path.join(LOGO, archivo), ancho_mm, ancho_mm * MARGEN[version])
    m.texto_alternativo(pic, 'DirectorIA')
    return pic


def pie_legal(paragraph):
    paragraph.style = 'Pie DirectorIA'
    m.borde_parrafo(paragraph, top=(m.LINEA, 4, 6))
    paragraph.add_run('[Razón social] · [NIF] · [Dirección postal] · [teléfono] · [correo@dominio.es] · [dominio.es]')


def propiedades(doc, titulo, asunto):
    cp = doc.core_properties
    cp.title = titulo
    cp.subject = asunto
    cp.author = 'DirectorIA'
    cp.last_modified_by = 'DirectorIA'
    cp.language = 'es-ES'
    cp.keywords = 'DirectorIA; plantilla'
    cp.comments = 'Plantilla de marca. Cambiad los textos entre corchetes.'


def lineas(paragraph, textos, **fmt):
    """Varias líneas en un mismo párrafo, separadas con salto de línea (Mayús + Intro)."""
    for i, t in enumerate(textos):
        r = m.run(paragraph, t, **fmt)
        if i < len(textos) - 1:
            r.add_break()


# ======================================================================= membrete

def membrete():
    doc = docx.Document()
    m.configurar(doc)
    propiedades(doc, 'DirectorIA · Membrete', 'Carta con membrete de DirectorIA')
    sec = doc.sections[0]
    a4(sec, arriba=40, abajo=28)

    # Cabecera: horizontal a 45 mm de ancho de imagen (la tinta mide 36,9 mm), alineado con el texto
    cab = sec.header.paragraphs[0]
    logo(cab, 'logo-horizontal', 'logo-horizontal-600.png', 45)

    pie_legal(sec.footer.paragraphs[0])

    # Carta de ejemplo: una carta del día a día (los pasos después de una demo), no de presentación.
    # Las cartas que presentan DirectorIA a un colegio llevan el logotipo con eslogan (logo/construccion.md).
    # La información a las familias sobre DirectorIA la da el colegio, que es el responsable del
    # tratamiento; DirectorIA le prepara el borrador. Ver el README.
    p = doc.add_paragraph('[Localidad], [fecha]')
    p.paragraph_format.space_after = Pt(14)

    p = doc.add_paragraph()
    lineas(p, ['[Nombre y apellidos]', '[Directora / Director]', '[Nombre del colegio]',
               '[Dirección del colegio]', '[Código postal y localidad]'])
    p.paragraph_format.space_after = Pt(18)

    doc.add_paragraph('Próximos pasos después de la demo', style='Title')

    doc.add_paragraph('[Estimada directora / Estimado director]:')
    doc.add_paragraph('Gracias por recibirnos el [fecha] para la demo. Como quedamos, os confirmo por escrito '
                      'los próximos pasos y lo que necesitamos de vosotros.')

    doc.add_paragraph('Qué haremos y cuándo', style='Heading 2')
    for entradilla, texto in (
            ('Análisis de gastos gratuito.',
             'Analizamos vuestras facturas y contratos, y el [fecha] os entregamos un informe con el ahorro '
             'posible, partida por partida. El informe es vuestro, firméis o no.'),
            ('Propuesta por escrito.',
             'Antes del [fecha] os enviamos la propuesta para [Nombre del colegio]: qué incluye, cuánto cuesta '
             'y qué compromiso os pedimos, sin letra pequeña.'),
            ('Instalación y formación.',
             'Si decidís seguir, instalamos los equipos en un día, en la fecha que acordemos, y damos 6 horas de '
             'formación al claustro.')):
        con_entradilla(doc, entradilla, texto, estilo='List Number')

    doc.add_paragraph('Qué necesitamos de vosotros', style='Heading 2')
    for t in ('Las facturas y los contratos de los últimos 12 meses. Solo de empresas: nunca nóminas ni datos '
              'de personas. Al terminar el análisis, borramos los documentos.',
              'El acuerdo de confidencialidad que va con esta carta, firmado.'):
        p = doc.add_paragraph(t, style='List Bullet')
    # El último punto deja 8 pt, como un párrafo, para que el texto siguiente no parezca parte de la lista
    # (Word suma el espacio después y el espacio antes; LibreOffice puede tomar solo el mayor)
    p.paragraph_format.space_after = Pt(8)

    doc.add_paragraph('Si os surge cualquier duda, podéis escribirme a [correo@dominio.es] o llamarme al '
                      '[teléfono]. La decisión es vuestra y no hay prisa.')  # «La» no queda a final de línea

    p = doc.add_paragraph('Un cordial saludo,')
    p.paragraph_format.space_before = Pt(4)
    p.paragraph_format.space_after = Pt(30)
    p.paragraph_format.keep_with_next = True
    p = doc.add_paragraph()
    p.paragraph_format.keep_with_next = True
    p.paragraph_format.space_after = Pt(0)
    m.run(p, '[Tu nombre]', bold=True, color=m.PIZARRA)
    doc.add_paragraph('[Cargo] · DirectorIA')

    ruta = os.path.join(SALIDA, 'membrete.docx')
    doc.save(ruta)
    m.posprocesar(ruta)
    print('OK', ruta)


# ======================================================================= propuesta comercial

def h1(doc, numero, texto):
    p = doc.add_paragraph(style='Heading 1')
    m.run(p, '%d' % numero, color=m.PIZARRA_LINEA)
    m.run(p, ' ' + texto)
    return p


def con_entradilla(doc, entradilla, texto, estilo=None):
    """Párrafo que empieza en negrita pizarra («Dentro del colegio.») y sigue en texto normal."""
    p = doc.add_paragraph(style=estilo) if estilo else doc.add_paragraph()
    m.run(p, entradilla + ' ', bold=True, color=m.PIZARRA)
    m.run(p, texto)
    return p


def tabla_simple(doc, cabecera, filas, anchos, alinear_derecha=(), cabecera_oscura=True):
    t = doc.add_table(rows=1 + len(filas), cols=len(cabecera))
    t.alignment = WD_TABLE_ALIGNMENT.LEFT
    m.preparar_tabla(t, anchos)
    for j, texto in enumerate(cabecera):
        c = t.rows[0].cells[j]
        if cabecera_oscura:
            m.sombrear_celda(c, m.PIZARRA)
        p = m.parrafo_celda(c, texto, bold=True, color=m.TIZA if cabecera_oscura else m.PIZARRA, pt=9)
        if not cabecera_oscura:
            m.borde_celda(c, bottom=(m.PIZARRA, 8))
        if j in alinear_derecha:
            p.alignment = 2
        m.alinear_celda(c, 'bottom')
    for i, fila in enumerate(filas, start=1):
        for j, valor in enumerate(fila):
            c = t.rows[i].cells[j]
            m.borde_celda(c, bottom=(m.LINEA, 6))
            m.alinear_celda(c, 'top')
            # Una celda puede llevar varias líneas (una lista): por ejemplo, el precio sin IVA y debajo con IVA
            for linea in (valor if isinstance(valor, list) else [valor]):
                if isinstance(linea, tuple):
                    texto, fmt = linea
                else:
                    texto, fmt = linea, {}
                p = m.parrafo_celda(c, texto, **fmt)
                if j in alinear_derecha:
                    p.alignment = 2
    m.no_partir_filas(t, cabecera=True)
    return t


def sin_cortes(doc):
    """Espacio duro entre la cifra (o el corchete de un importe) y «€», «%» u «horas», para que no se separen al
    final de línea: «14.399 €», «[importe] €», «10 %», «2 horas»."""
    def arreglar(paragraphs):
        for p in paragraphs:
            for r in p.runs:
                if re.search(r'[\d\]] (€|%|horas)', r.text):
                    r.text = re.sub(r'([\d\]]) (€|%|horas)', '\\1\u00a0\\2', r.text)
    arreglar(doc.paragraphs)
    for t in doc.tables:
        for row in t.rows:
            for c in row.cells:
                arreglar(c.paragraphs)


def tabla_precios(doc, planes):
    """Tabla de precios: plan, tamaño, cuota inicial y suscripción, cada cifra sin IVA y debajo con IVA.
    planes: (plan, tamaño, cuota inicial, con IVA, suscripción, con IVA), con las cifras ya escritas en español."""
    filas = [((plan, {'bold': True, 'color': m.PIZARRA}), tam,
              [inicial + ' €', inicial_iva + ' € con IVA'],
              [mes + ' € al mes', mes_iva + ' € con IVA'])
             for plan, tam, inicial, inicial_iva, mes, mes_iva in planes]
    t = tabla_simple(doc, ['Plan', 'Tamaño del centro', 'Cuota inicial: equipos e instalación',
                           'Suscripción mensual'], filas, [26, 44, 48, 42], alinear_derecha=(2, 3))
    for row in t.rows:  # la tabla no se separa de sus condiciones
        for c in row.cells:
            for q in c.paragraphs:
                q.paragraph_format.keep_with_next = True
    return t


def propuesta():
    doc = docx.Document()
    ids = m.configurar(doc)
    propiedades(doc, 'DirectorIA · Propuesta para [Nombre del colegio]', 'Propuesta comercial de DirectorIA')
    sec = doc.sections[0]
    a4(sec, arriba=30, abajo=26, cabecera=12, pie=11)
    sec.different_first_page_header_footer = True

    # Cabecera de las páginas interiores: la palabra sola y, a la derecha, a quién va la propuesta
    cab = sec.header.paragraphs[0]
    logo(cab, 'logotipo', 'logotipo-600.png', 30)
    m.tabulador(cab, 160)
    r = m.run(cab, '\tPropuesta para [Nombre del colegio]', pt=8, color=m.TEXTO)
    # La línea base de la palabra queda 71 unidades (1 x + 1) por encima del borde inferior del PNG
    m.subir(r, 71 * 30 / 646.9 / 25.4 * 72)
    sec.first_page_header.is_linked_to_previous = False
    sec.first_page_footer.is_linked_to_previous = False
    # Pie: razón social y web a la izquierda; número de página a la derecha
    pie = sec.footer.paragraphs[0]
    pie.style = 'Pie DirectorIA'
    m.borde_parrafo(pie, top=(m.LINEA, 4, 6))
    m.tabulador(pie, 160)
    m.run(pie, '[Razón social] · [NIF] · [dominio.es]\tPágina ')
    m.campo(pie, 'PAGE', '2')
    m.run(pie, ' de ')
    m.campo(pie, 'NUMPAGES', '6')

    # ---------------------------------------------------------- portada
    p = doc.add_paragraph()
    logo(p, 'logo-eslogan', 'logo-eslogan-1600.png', 75)

    p = doc.add_paragraph('Propuesta comercial', style='Antetítulo')
    p.paragraph_format.space_before = Pt(100)
    p = doc.add_paragraph(style='Title')
    p.paragraph_format.space_after = Pt(14)
    p.paragraph_format.line_spacing = Pt(38)
    r = m.run(p, 'Propuesta para', pt=32)
    r.add_break()
    m.run(p, '[Nombre del colegio]', pt=32)
    doc.add_paragraph('Qué hace DirectorIA por vuestro equipo, qué datos guarda, cómo lo instalamos y cuánto '
                      'cuesta. Todo por escrito y sin letra pequeña.', style='Subtitle')

    # La ilustración, con el borde del disco alineado con el margen (el disco deja 16/240 libres por lado)
    p = doc.add_paragraph()
    pic = m.imagen_alineada(p, os.path.join(RECURSOS, 'colegio-servidor.png'), 64, 64 * 16 / 240)
    p.paragraph_format.space_before = Pt(10)
    p.paragraph_format.space_after = Pt(30)
    m.texto_alternativo(pic, 'Un colegio con el servidor de DirectorIA dentro')

    datos = [('Para', '[Nombre del colegio] · [Nombre y apellidos], [Directora / Director]'),
             ('Preparada por', '[Tu nombre], [Cargo] · [teléfono] · [correo@dominio.es]'),
             ('Fecha', '[fecha]'),
             ('Válida hasta', '[fecha]')]
    t = doc.add_table(rows=len(datos), cols=2)
    m.preparar_tabla(t, [34, 126], margenes=(1.2, 0, 1.2, 0))
    for i, (k, v) in enumerate(datos):
        a, b = t.rows[i].cells
        if i == 0:
            for c in (a, b):
                m.borde_celda(c, top=(m.LINEA, 6))
                m.margen_celda(c, arriba=3.2)
        m.parrafo_celda(a, k, bold=True, color=m.CHISPA_TEXTO, pt=8, caps=True, tracking=0.8)
        m.parrafo_celda(b, v)
        m.alinear_celda(a, 'center')
    # ---------------------------------------------------------- 1. Resumen (empieza en página nueva)
    p = h1(doc, 1, 'Resumen')
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.page_break_before = True
    doc.add_paragraph('[Nombre del colegio] quiere [lo que os contó el equipo directivo; por ejemplo, cubrir '
                      'las ausencias con menos esfuerzo y llevar los plazos al día].')
    doc.add_paragraph('DirectorIA instala en vuestro colegio una IA propia, en un servidor dentro del centro. '
                      'Con las reglas del colegio prepara sustituciones, guardias y avisos de plazos; con IA, '
                      'actas y respuestas de correo. Y cada docente tiene su asistente.')
    doc.add_paragraph('DirectorIA propone. Vosotros decidís.', style='Destacado')
    # Si se deja el anexo de DirectorIA Esencial, se elige aquí Esencial y los importes son los suyos: así quien firma
    # sabe qué firma. Va como elección entre corchetes, igual que el plan: una nota aparte movía el apartado 2 y dejaba
    # la última línea del 4 sola en una página
    con_entradilla(doc, 'Lo que os proponemos.',
                   '[DirectorIA Completo, con IA / DirectorIA Esencial, sin IA, con el paso a Completo del anexo], en '
                   'el plan [Básico / Centro / Grande], para [n.º de docentes] docentes: una cuota inicial de '
                   '[importe] € (equipos e instalación) y una suscripción de [importe] € al mes, sin IVA. Con IVA, '
                   '[importe] € y [importe] € al mes. Compromiso mínimo de dos cursos escolares.')
    con_entradilla(doc, 'Antes de firmar.',
                   'Os enseñamos DirectorIA funcionando en vuestro colegio y analizamos gratis vuestros gastos '
                   'para buscar ahorros.')

    # ---------------------------------------------------------- 2. Qué incluye
    h1(doc, 2, 'Qué incluye DirectorIA')
    doc.add_paragraph('Un asistente para cada cargo, todos dentro del colegio. Lo que preparan lo revisa y lo '
                      'decide siempre una persona.')
    roles = [
        ('Dirección', [
            'Un resumen del día a las 8:00: quién falta, qué vence hoy y qué correos importan.',
            'El correo, resumido y con una respuesta propuesta que revisáis antes de enviarla.',
            'El acta del claustro, a partir del dictado, y el archivo de las actas de claustro y consejo '
            'escolar, con buscador.']),
        ('Jefatura de estudios', [
            'Cuando falta alguien, DirectorIA propone quién cubre cada hora, con las reglas del colegio y un '
            'reparto de guardias equilibrado. Jefatura lo revisa y lo confirma.',
            'La ficha para quien sustituye, solo con la clase: grupo, materia, hora y aula; la tarea, que sale de '
            'la programación quincenal de quien falta; el material y dónde está, y a quién llamar. Las '
            'indicaciones de salud y de recogida de los alumnos no están en DirectorIA: las tiene el colegio, y la '
            'ficha recuerda preguntarlas en conserjería o a la tutora.',
            'El calendario de exámenes y el reparto de aulas, con aviso de cada choque.',
            'El informe de ausencias del profesorado, sin el motivo: solo si el justificante está entregado o '
            'pendiente.']),
        ('Secretaría y administración', [
            'Saca de cada circular qué hay que entregar, quién lo entrega y cuándo, y avisa antes de que '
            'venza el plazo.',
            'Analiza las facturas y los contratos del colegio y señala dónde se puede ahorrar.',
            'Los justificantes del profesorado, cada uno en su carpeta: un programa, con reglas y sin IA, los '
            'archiva por curso, mes y docente. La IA no los lee. Solo los ven el propio docente y quien lleve el '
            'personal, con registro de accesos.']),
        ('Orientación y convivencia', [
            'Las guías de los protocolos de acoso escolar, absentismo y accidentes, según el protocolo vigente en '
            'vuestra comunidad: en cada paso, qué se hace, quién, el plazo, qué anexo se usa (la plantilla '
            'oficial, en blanco) y qué hay que cuidar. En DirectorIA no se abre ningún caso: los datos de cada '
            'caso van donde manda el protocolo, como Raíces y el expediente del centro. Valorar cada caso y '
            'decidir las medidas corresponde al equipo del centro.',
            'Las circulares generales, traducidas o en lectura fácil, para revisarlas antes de enviarlas.',
            'El plan de convivencia y los documentos del departamento, en un solo sitio.']),
        ('Cada docente', [
            'Su propio asistente: dicta un correo para las familias del grupo y le llega redactado, listo para '
            'revisarlo y enviarlo.',
            'Sus plazos a la vista, con aviso antes de que venzan.',
            'Sube sus justificantes desde DirectorIA y elige la ausencia a la que corresponden. En el registro '
            'de ausencias solo pone «Justificante: entregado» o «pendiente», nunca el motivo.',
            'Opcional: el módulo de Claude, en la nube, solo para preparar material didáctico, no para datos '
            'de alumnos.']),
    ]
    for cargo, puntos in roles:
        doc.add_paragraph(cargo, style='Heading 2')
        for t in puntos:
            doc.add_paragraph(t, style='List Bullet')
    doc.add_paragraph('Lo que no hace, a propósito', style='Heading 2')
    for t in ('No guarda datos de alumnos: solo del profesorado y del funcionamiento del colegio.',
              'No evalúa, puntúa ni clasifica a ningún alumno.',
              'No decide: prepara y propone, y una persona del colegio revisa, decide y firma.',
              'No contesta el correo por su cuenta: cada respuesta la revisa y la envía una persona.',
              'No sustituye a la gestoría ni lleva la contabilidad oficial.'):
        doc.add_paragraph(t, style='List Bullet')

    # ---------------------------------------------------------- 3. Privacidad
    h1(doc, 3, 'Privacidad y protección de datos')
    con_entradilla(doc, 'Qué datos guarda.',
                   'DirectorIA no guarda datos de alumnos: solo del profesorado y del funcionamiento del colegio, '
                   'como horarios, grupos, aulas, guardias, ausencias del profesorado (sin el motivo), plazos, '
                   'documentos del centro, gastos y contratos. Los protocolos son guías de pasos: no se abre ningún '
                   'caso, y los datos de cada caso van donde manda el protocolo.')
    con_entradilla(doc, 'El correo.',
                   'Es la única excepción: lo escriben las familias y puede traer nombres de alumnos. La IA lo lee en '
                   'el servidor del colegio para resumirlo; DirectorIA no crea fichas de alumnos ni guarda sus datos '
                   'aparte.')
    con_entradilla(doc, 'Justificantes del profesorado, el único dato de salud que guarda DirectorIA.',
                   'Los justificantes los archiva un programa en su carpeta; la IA no los lee. Solo los ven el '
                   'propio docente y quien lleve el personal, con registro de accesos, y se borran cuando pasa el '
                   'plazo que fije el colegio.')
    con_entradilla(doc, 'Dónde están los datos.',
                   'La aplicación y los datos están en un servidor dentro del colegio. Las copias de seguridad van '
                   'cifradas: una en el colegio y otra en un centro de datos de la UE. Los correos salen por la '
                   'cuenta del propio colegio. El mantenimiento a distancia queda registrado. La IA trabaja dentro '
                   'del colegio, también con el correo.')
    con_entradilla(doc, 'El responsable es el colegio.',
                   'El colegio sigue siendo el responsable del tratamiento. DirectorIA os entrega los borradores '
                   'de la evaluación de impacto (EIPD), del registro de actividades de tratamiento y de los textos '
                   'para informar al profesorado y al comité, para que vuestro delegado de protección de datos los '
                   'revise y el colegio los apruebe.')
    con_entradilla(doc, 'Decide una persona.',
                   'DirectorIA propone y una persona del colegio decide. Nunca evalúa, puntúa ni clasifica a '
                   'ningún alumno.')
    con_entradilla(doc, 'Claude, solo si lo activáis.',
                   'El módulo opcional de Claude, en la nube, es solo para preparar material didáctico, no para '
                   'datos de alumnos.')

    # ---------------------------------------------------------- 4. Instalación y formación
    h1(doc, 4, 'Instalación y formación')
    con_entradilla(doc, 'Llave en mano.',
                   'La cuota inicial incluye los equipos, que pasan a ser vuestros, y su instalación en el '
                   'colegio: el servidor de datos, el servidor de IA y el disco de copias. En el plan Grande, dos '
                   'servidores de datos: si uno falla, el otro toma el relevo en 10-15 minutos.')
    con_entradilla(doc, 'Instalación en un día.',
                   'Los equipos llegan montados. Ese día los instalamos, cargamos los datos del centro y creamos '
                   'los usuarios.')
    con_entradilla(doc, 'Formación.', '6 horas de formación al claustro, con la alfabetización en IA.')
    con_entradilla(doc, 'Soporte.', 'En horario lectivo, con el tiempo de respuesta fijado en el contrato.')
    con_entradilla(doc, 'Fecha prevista de instalación:', '[fecha].')

    # ---------------------------------------------------------- 5. Precio
    # El precio empieza en página nueva: ocupa casi una página, y LibreOffice no mantiene el título junto a
    # una tabla aunque lleve «conservar con el siguiente» (lo dejaba solo al pie de la página anterior)
    p = h1(doc, 5, 'Precio')
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.page_break_before = True
    p = doc.add_paragraph('DirectorIA Completo, con IA: una cuota inicial, que paga los equipos y su instalación, '
                          'y una suscripción mensual.')
    p.paragraph_format.keep_with_next = True
    tabla_precios(doc, [
        ('Básico', 'Hasta 40 docentes', '7.750', '9.378', '1.200', '1.452'),
        ('Centro', 'De 41 a 80 docentes', '7.750', '9.378', '1.600', '1.936'),
        ('Grande', 'De 81 a 150 docentes', '9.150', '11.072', '2.200', '2.662'),
    ])
    # Las condiciones, a tamaño de texto: sin letra pequeña
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(8)
    p.paragraph_format.keep_with_next = True
    m.run(p, 'Precios sin IVA; debajo de cada uno, con el 21 % de IVA. Compromiso mínimo de dos cursos escolares.',
          bold=True, color=m.PIZARRA)
    m.run(p, ' La cuota inicial se paga al empezar; la suscripción, cada mes. Con IVA, el primer año sale a '
             '26.802 € en el Básico, 32.610 € en el Centro y 43.016 € en el Grande, y los siguientes, a 17.424 €, '
             '23.232 € y 31.944 €.')
    # Lo que incluye cada cuota, como en la hoja comercial. La formación y el borrador de la evaluación de impacto
    # son de una vez y los paga la cuota inicial: si fueran en la suscripción, se leerían como 6 horas cada año
    con_entradilla(doc, 'La cuota inicial incluye',
                   'los equipos y su instalación, 6 horas de formación al claustro, con la alfabetización en IA, el '
                   'borrador de la evaluación de impacto, con su capítulo de IA, y los textos para informar al '
                   'profesorado y al comité. Los borradores los revisa vuestro delegado de protección de datos y los '
                   'aprueba el colegio.')
    con_entradilla(doc, 'La suscripción incluye',
                   'soporte en horario lectivo, actualizaciones (también las de seguridad, durante 5 años como '
                   'mínimo), una visita al año y la gestión de las garantías.')
    con_entradilla(doc, 'Si el precio de los equipos sube',
                   'más de un 10 % antes del pedido, la cuota inicial sube lo mismo.')
    con_entradilla(doc, 'Aparte, la luz de los equipos:',
                   'unos 60-118 € al año en el Básico y el Centro, y 71-135 € en el Grande.')
    doc.add_paragraph('Claude es opcional. Si lo usáis, el colegio paga su uso directamente a Anthropic, con su '
                      'propia cuenta.')
    con_entradilla(doc, 'Si el claustro crece un poco,',
                   'seguís en vuestro plan: hasta 44 docentes en el Básico, 88 en el Centro y 165 en el Grande. '
                   'Con más de 165, os hacemos un presupuesto aparte.')
    con_entradilla(doc, 'Garantía y renovación.',
                   'La garantía del servidor de IA cubre 3 años; en el cuarto y el quinto, podéis renovarla por '
                   '49,99 € al año, sin IVA porque es un seguro, o pagar sus reparaciones. A los 5 o 6 años, los '
                   'equipos se renuevan con otra cuota inicial.')
    con_entradilla(doc, 'Plan propuesto para [Nombre del colegio]:',
                   'DirectorIA Completo [Básico / Centro / Grande], para [n.º de docentes] docentes.')

    # ---------------------------------------------------------- 6. Análisis de gastos
    h1(doc, 6, 'Análisis de gastos gratuito')
    doc.add_paragraph('Antes de firmar, analizamos gratis los gastos de vuestro colegio para buscar ahorros.')
    nid = m.nueva_numeracion(doc, ids)
    for t in ('Nos pasáis las facturas y los contratos de los últimos 12 meses. Solo de empresas, nunca '
              'nóminas ni datos de personas, y con un acuerdo de confidencialidad.',
              'Os entregamos un informe con el ahorro posible, partida por partida.',
              'El informe es vuestro, firméis o no. Al terminar, borramos los documentos.'):
        p = doc.add_paragraph(t, style='List Number')
        m.poner_numpr(p._p.get_or_add_pPr(), nid)
    p = doc.add_paragraph('No prometemos una cifra de ahorro: os enseñamos lo que sale de vuestras facturas.')
    p.paragraph_format.space_before = Pt(6)

    # ---------------------------------------------------------- 7. Próximos pasos
    h1(doc, 7, 'Próximos pasos')
    pasos = [
        ('1', 'Demo de 45 minutos en vuestro colegio con una mañana de ejemplo, sin datos reales: una '
              'sustitución, su ficha y un acta.'),
        ('2', 'Análisis de gastos gratuito: nos pasáis facturas y contratos y os entregamos el informe.'),
        ('3', 'Firma de la propuesta y del contrato.'),
        ('4', 'Instalación en un día.'),
        ('5', 'Formación del claustro y puesta en marcha.'),
    ]
    filas = [((n, {'bold': True, 'color': m.PIZARRA_LINEA, 'fuente': m.TITULARES}), q, '[fecha]') for n, q in pasos]
    t = tabla_simple(doc, ['', 'Qué', 'Cuándo'], filas, [10, 120, 30], cabecera_oscura=False)
    for row in t.rows[:-1]:  # los pasos no se parten entre dos páginas
        for c in row.cells:
            for q in c.paragraphs:
                q.paragraph_format.keep_with_next = True

    # ---------------------------------------------------------- 8. Firma
    h1(doc, 8, 'Firma')
    p = doc.add_paragraph('Con su firma, el colegio manifiesta su conformidad con esta propuesta y, en su caso, con '
                          'su anexo. Las condiciones completas se recogerán en el contrato.')
    p.paragraph_format.keep_with_next = True
    t = doc.add_table(rows=1, cols=3)
    m.preparar_tabla(t, [76, 8, 76], margenes=(0, 0, 0, 0))
    bloques = [
        ('Por el colegio', ['[Nombre del colegio]', 'Nombre: [Nombre y apellidos]', 'Cargo: [Cargo en el colegio]',
                            'Fecha: [fecha]']),
        ('Por DirectorIA', ['[Razón social] · [NIF]', 'Nombre: [Tu nombre]', 'Cargo: [Cargo]', 'Fecha: [fecha]']),
    ]
    for celda, (titulo, lineas_) in zip((t.rows[0].cells[0], t.rows[0].cells[2]), bloques):
        p = m.parrafo_celda(celda, titulo, bold=True, color=m.PIZARRA, fuente=m.TITULARES, pt=10.5)
        p.paragraph_format.space_before = Pt(10)
        p.paragraph_format.space_after = Pt(4)
        for l in lineas_:
            m.parrafo_celda(celda, l)
        p = m.parrafo_celda(celda, '')
        p.paragraph_format.space_before = Pt(46)
        m.borde_parrafo(p, top=(m.PIZARRA, 6, 4))
        m.run(p, 'Firma', pt=8.5, color=m.TEXTO)
    m.no_partir_filas(t)
    for c in t.rows[0].cells:  # el bloque de firmas no se parte
        for q in c.paragraphs[:-1]:
            q.paragraph_format.keep_with_next = True

    # ---------------------------------------------------------- Anexo opcional: primera fase sin IA
    # Solo se deja si el colegio ha pedido empezar sin IA. DirectorIA Esencial no va en la web ni en la hoja
    # comercial: se ofrece cuando un colegio rechaza Completo, o como primera fase con la fecha del paso pactada.
    p = doc.add_paragraph()
    p.paragraph_format.page_break_before = True
    p.paragraph_format.keep_with_next = True
    m.run(p, '[Opcional. Dejad este anexo solo si el colegio ha pedido empezar sin IA, y elegid entonces DirectorIA '
             'Esencial en «Lo que os proponemos», en el Resumen. Si no, borradlo entero, desde aquí hasta el final.]',
          bold=True, color=m.PIZARRA)
    p = doc.add_paragraph(style='Heading 1')
    m.run(p, 'Anexo', color=m.PIZARRA_LINEA)
    m.run(p, ' DirectorIA Esencial, sin IA')
    doc.add_paragraph('Empezáis con DirectorIA Esencial y pasáis a DirectorIA Completo [en la fecha que pactemos: '
                      '(fecha) / cuando lo decidáis, con el precio de este anexo].')

    doc.add_paragraph('Qué hace', style='Heading 2')
    for t_ in ('Todo lo que DirectorIA hace con las reglas y los datos del colegio, sin IA: guardias, sustituciones '
               'y la ficha de quien sustituye; las guías de los protocolos, los plazos y el dosier para la '
               'inspección; los justificantes del profesorado, archivados en su carpeta; el resumen de las 8:00, el '
               'banco de recursos y el analista de gastos.',
               'Lo que escribe la IA llega con el paso a Completo: resúmenes y respuestas de correo, actas a partir '
               'del dictado, traducciones y lectura fácil, y los plazos sacados de las circulares. Hasta entonces, '
               'algunas funciones van sin su parte de IA: el resumen de las 8:00, sin los correos, y el analista de '
               'gastos, solo con facturas electrónicas.',
               'DirectorIA no guarda datos de alumnos: solo del profesorado y del funcionamiento del colegio. La '
               'aplicación y los datos están en un servidor dentro del colegio. La copia de seguridad, cifrada, '
               'está en la UE. Los correos salen por la cuenta del propio colegio. El mantenimiento a distancia '
               'queda registrado.'):
        doc.add_paragraph(t_, style='List Bullet')

    doc.add_paragraph('Qué incluye', style='Heading 2')
    for t_ in ('Los equipos, que pasan a ser vuestros, y su instalación: el servidor de datos y el disco de copias. '
               'En el plan Grande, dos servidores de datos.',
               '4 horas de formación al claustro.',
               'Soporte en horario lectivo, actualizaciones y una visita al año.',
               # Sin datos de alumnos, quizá no haga falta evaluación de impacto (pregunta para el abogado); los
               # demás papeles siguen, también la información al comité por el reparto de guardias (art. 64.4.d ET)
               'Los borradores del contrato de encargo, del registro de actividades y de la información al '
               'profesorado y al comité (por el reparto de guardias); el de la evaluación de impacto, si vuestro '
               'delegado de protección de datos ve que hace falta, y el anexo de IA, ya redactado y sin activar.'):
        doc.add_paragraph(t_, style='List Bullet')

    p = doc.add_paragraph('Precio', style='Heading 2')
    tabla_precios(doc, [
        ('Básico', 'Hasta 40 docentes', '4.700', '5.687', '600', '726'),
        ('Centro', 'De 41 a 80 docentes', '4.700', '5.687', '800', '968'),
        ('Grande', 'De 81 a 150 docentes', '6.100', '7.381', '1.100', '1.331'),
    ])
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(8)
    p.paragraph_format.keep_together = True  # que no se parta entre dos páginas
    m.run(p, 'Precios sin IVA; debajo de cada uno, con el 21 % de IVA.', bold=True, color=m.PIZARRA)
    m.run(p, ' Con IVA, el primer año sale a 14.399 € en el Básico, 17.303 € en el Centro y 23.353 € en el '
             'Grande, y los siguientes, a 8.712 €, 11.616 € y 15.972 €. La luz va aparte: unos 26-65 € al año. '
             'Las demás condiciones son las de Completo: compromiso mínimo de dos cursos escolares, los mismos '
             'límites de docentes y la misma revisión si el precio de los equipos sube más de un 10 % antes del '
             'pedido.')

    doc.add_paragraph('El paso a Completo', style='Heading 2')
    con_entradilla(doc, 'Precio.',
                   '3.050 € (3.690 € con IVA) en los tres tamaños, por el servidor de IA, su instalación y 2 horas '
                   'más de formación, más la diferencia de cuota: 600, 800 o 1.100 € más al mes (726, 968 o '
                   '1.331 € con IVA). Este precio queda fijado en el contrato desde el principio.')
    con_entradilla(doc, 'Lo mismo que empezar con IA.',
                   'Empezar sin IA y pasar después cuesta lo mismo que empezar con IA, menos los meses sin IA.')
    con_entradilla(doc, 'Sin empezar de cero.',
                   'El servidor de datos sigue con vuestros datos, reglas, usuarios e historial, y el servidor de IA '
                   'se añade a su lado, dentro del colegio. Con el paso llegan también los documentos de la IA: la '
                   'evaluación de impacto o su anexo de IA, la adenda al contrato y la información al personal y a '
                   'las familias.')
    con_entradilla(doc, 'Fecha del paso a Completo:', '[fecha pactada / cuando lo decidáis].')
    con_entradilla(doc, 'Plan propuesto para la primera fase:',
                   'DirectorIA Esencial [Básico / Centro / Grande], para [n.º de docentes] docentes.')

    sin_cortes(doc)
    ruta = os.path.join(SALIDA, 'propuesta-comercial.docx')
    doc.save(ruta)
    m.posprocesar(ruta)
    print('OK', ruta)


if __name__ == '__main__':
    membrete()
    propuesta()
