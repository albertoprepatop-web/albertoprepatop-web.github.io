"""Genera membrete.docx y propuesta-comercial.docx con python-docx.

Uso (desde esta carpeta):  python3 generar_docx.py
Escribe los dos .docx en la carpeta de arriba (aplicaciones/papeleria/).
"""
import os

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
             'Si decidís seguir, instalamos el servidor en un día, en la fecha que acordemos, y damos 6 horas de '
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
            if isinstance(valor, tuple):
                texto, fmt = valor
            else:
                texto, fmt = valor, {}
            p = m.parrafo_celda(c, texto, **fmt)
            if j in alinear_derecha:
                p.alignment = 2
    m.no_partir_filas(t, cabecera=True)
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
    doc.add_paragraph('Qué hace DirectorIA por vuestro equipo, cómo trata los datos de vuestros alumnos, '
                      'cómo lo instalamos y cuánto cuesta. Todo por escrito y sin letra pequeña.', style='Subtitle')

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
                      'Prepara sustituciones y guardias, actas, respuestas de correo y avisos de plazos para '
                      'dirección y claustro, y cada docente tiene su asistente.')
    doc.add_paragraph('La IA propone. Vosotros decidís.', style='Destacado')
    con_entradilla(doc, 'Lo que os proponemos.',
                   'El plan [Básico / Centro / Grande], para [n.º de docentes] docentes: una cuota inicial de '
                   '[importe] € (servidor e instalación) y una suscripción de [importe] € al mes. Precios sin '
                   'IVA y con un compromiso mínimo de dos cursos escolares.')
    con_entradilla(doc, 'Antes de firmar.',
                   'Os enseñamos DirectorIA funcionando en vuestro colegio y analizamos gratis vuestros gastos '
                   'para buscar ahorros.')

    # ---------------------------------------------------------- 2. Qué incluye
    h1(doc, 2, 'Qué incluye DirectorIA')
    doc.add_paragraph('Un asistente para cada cargo, todos en el mismo servidor, dentro del colegio. Lo que '
                      'preparan lo revisa y lo decide siempre una persona.')
    roles = [
        ('Dirección', [
            'Un resumen del día a las 8:00: quién falta, qué vence hoy y qué correos importan.',
            'El correo, resumido y con una respuesta propuesta que revisáis antes de enviarla.',
            'Las actas de claustro y de consejo escolar, a partir del dictado.']),
        ('Jefatura de estudios', [
            'Cuando falta alguien, propone quién cubre cada hora, con un reparto de guardias equilibrado. '
            'Jefatura lo revisa y lo confirma.',
            'La ficha para quien sustituye: la tarea de la sesión, las pautas del alumnado con necesidades, '
            'las alergias y las recogidas.']),
        ('Secretaría y administración', [
            'Saca de cada circular qué hay que entregar, quién lo entrega y cuándo, y avisa antes de que '
            'venza el plazo.',
            'Analiza las facturas y los contratos del colegio y señala dónde se puede ahorrar.']),
        ('Orientación y tutoría', [
            'Los protocolos de acoso escolar y de absentismo, paso a paso y con sus documentos preparados. '
            'Valorar cada caso y decidir las medidas corresponde al equipo del centro.',
            'Sus pautas llegan a la ficha de quien sustituye, solo con lo necesario.']),
        ('Cada docente', [
            'Su propio asistente: dicta un correo y le llega redactado, listo para revisarlo y enviarlo.',
            'Sus plazos a la vista, con aviso antes de que venzan.',
            'Opcional: el módulo de Claude, en la nube, solo para preparar material didáctico, no para datos '
            'de alumnos.']),
    ]
    for cargo, puntos in roles:
        doc.add_paragraph(cargo, style='Heading 2')
        for t in puntos:
            doc.add_paragraph(t, style='List Bullet')
    doc.add_paragraph('Lo que no hace, a propósito', style='Heading 2')
    for t in ('No evalúa, puntúa ni clasifica a ningún alumno.',
              'No decide: prepara y propone, y una persona del colegio revisa, decide y firma.',
              'No contesta el correo por su cuenta: cada respuesta la revisa y la envía una persona.',
              'No sustituye a la gestoría ni lleva la contabilidad oficial.'):
        doc.add_paragraph(t, style='List Bullet')

    # ---------------------------------------------------------- 3. Privacidad
    h1(doc, 3, 'Privacidad y protección de datos')
    con_entradilla(doc, 'Dentro del colegio.',
                   'La IA trata los datos de vuestros alumnos en un servidor dentro del colegio, sin '
                   'transferencias internacionales de esos datos.')
    con_entradilla(doc, 'El responsable es el colegio.',
                   'El colegio sigue siendo el responsable del tratamiento. DirectorIA os entrega los borradores '
                   'de la evaluación de impacto (EIPD) y del registro de actividades de tratamiento, para que '
                   'vuestro delegado de protección de datos los revise y el colegio los apruebe.')
    con_entradilla(doc, 'Decide una persona.',
                   'La IA propone y una persona del colegio decide. Nunca evalúa, puntúa ni clasifica a ningún '
                   'alumno.')
    con_entradilla(doc, 'Claude, solo si lo activáis.',
                   'El módulo opcional de Claude, en la nube, es solo para preparar material didáctico, no para '
                   'datos de alumnos.')

    # ---------------------------------------------------------- 4. Instalación y formación
    h1(doc, 4, 'Instalación y formación')
    con_entradilla(doc, 'Llave en mano.',
                   'La cuota inicial incluye el servidor, que pasa a ser vuestro, y su instalación en el colegio. '
                   'Si lo preferís, el servidor también se puede pagar mediante alquiler.')
    con_entradilla(doc, 'Instalación en un día.',
                   'El servidor llega montado. Ese día lo instalamos, cargamos los datos del centro y creamos '
                   'los usuarios.')
    con_entradilla(doc, 'Formación.', '6 horas de formación al claustro.')
    con_entradilla(doc, 'Soporte.', 'En horario lectivo.')
    con_entradilla(doc, 'Fecha prevista de instalación:', '[fecha].')

    # ---------------------------------------------------------- 5. Precio
    h1(doc, 5, 'Precio')
    p = doc.add_paragraph('Una cuota inicial, que incluye el servidor y la instalación, y una suscripción mensual.')
    p.paragraph_format.keep_with_next = True
    filas = [
        (('Básico', {'bold': True, 'color': m.PIZARRA}), 'Hasta 40 docentes', '6.000 €', '1.200 € al mes'),
        (('Centro', {'bold': True, 'color': m.PIZARRA}), 'De 41 a 80 docentes', '9.000 €', '1.600 € al mes'),
        (('Grande', {'bold': True, 'color': m.PIZARRA}), 'De 81 a 150 docentes', '14.000 €', '2.200 € al mes'),
    ]
    t = tabla_simple(doc, ['Plan', 'Tamaño del centro', 'Cuota inicial: servidor e instalación',
                           'Suscripción mensual'], filas, [26, 44, 48, 42], alinear_derecha=(2, 3))
    for row in t.rows:  # la tabla no se separa de sus condiciones
        for c in row.cells:
            for q in c.paragraphs:
                q.paragraph_format.keep_with_next = True
    # Las condiciones, a tamaño de texto: sin letra pequeña
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(8)
    p.paragraph_format.keep_with_next = True
    m.run(p, 'Precios sin IVA. Compromiso mínimo de dos cursos escolares.', bold=True, color=m.PIZARRA)
    m.run(p, ' La cuota inicial se paga una vez; la suscripción, cada mes.')
    # Lo que incluye la suscripción: la misma lista en todas las piezas (web, presentación y hoja comercial)
    con_entradilla(doc, 'La suscripción incluye',
                   '6 horas de formación al claustro, soporte en horario lectivo, actualizaciones, una visita al '
                   'año y el borrador de la evaluación de impacto, que revisa vuestro delegado de protección de '
                   'datos y aprueba el colegio.')
    doc.add_paragraph('Claude es opcional. Si lo usáis, el colegio paga su uso directamente a Anthropic, con su '
                      'propia cuenta.')
    con_entradilla(doc, 'Plan propuesto para [Nombre del colegio]:',
                   '[Básico / Centro / Grande], para [n.º de docentes] docentes.')

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
    p = doc.add_paragraph('Con su firma, el colegio manifiesta su conformidad con esta propuesta. Las condiciones '
                          'completas se recogerán en el contrato.')
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

    ruta = os.path.join(SALIDA, 'propuesta-comercial.docx')
    doc.save(ruta)
    m.posprocesar(ruta)
    print('OK', ruta)


if __name__ == '__main__':
    membrete()
    propuesta()
