"""Estilos de marca de DirectorIA para documentos de Word (python-docx).

Lo usa generar_docx.py (membrete y propuesta comercial). Prepara:
  - fuentes: Rubik en títulos y Nunito Sans en el texto, también como fuentes del tema
    (+Títulos y +Cuerpo en el selector de fuentes de Word);
  - colores: los de directoria/tokens.json, también como colores del tema;
  - estilos: Normal, Title, Subtitle, Heading 1-3, List Bullet, List Number y algunos propios
    (Antetítulo, Destacado, Nota, Pie DirectorIA, Tabla);
  - idioma: español de España (corrector y separadores).
Si Rubik o Nunito Sans no están instaladas, Word las sustituye por otra fuente sin remates.

Word es estricto con el orden de los elementos dentro de rPr, pPr, tblPr y tcPr: todo lo que
se añade a mano pasa por insertar(), que respeta el orden del esquema.
"""
import re
import zipfile

from docx.enum.style import WD_STYLE_TYPE
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Mm, Pt, RGBColor

# Paleta (directoria/tokens.json)
PIZARRA = RGBColor(0x17, 0x32, 0x2C)
PIZARRA_2 = RGBColor(0x21, 0x43, 0x3B)
PIZARRA_LINEA = RGBColor(0x2E, 0x5A, 0x50)
TIZA = RGBColor(0xF6, 0xF3, 0xEC)
SALVIA = RGBColor(0xE7, 0xEE, 0xE9)
PAPEL = RGBColor(0xFF, 0xFD, 0xF8)
LINEA = RGBColor(0xD5, 0xDE, 0xD9)
TEXTO = RGBColor(0x41, 0x52, 0x4D)
TEXTO_SUAVE = RGBColor(0xC9, 0xDA, 0xD4)
CHISPA = RGBColor(0xE0, 0x7A, 0x3A)
CHISPA_TEXTO = RGBColor(0xB4, 0x53, 0x1C)

TITULARES = 'Rubik'
CUERPO = 'Nunito Sans'


def hexa(color):
    return '%02X%02X%02X' % (color[0], color[1], color[2])


def twips(mm):
    return str(int(round(mm / 25.4 * 1440)))


# ---------------------------------------------------------------- orden del esquema

ORDEN = {
    'rPr': ['rStyle', 'rFonts', 'b', 'bCs', 'i', 'iCs', 'caps', 'smallCaps', 'strike', 'dstrike', 'outline',
            'shadow', 'emboss', 'imprint', 'noProof', 'snapToGrid', 'vanish', 'webHidden', 'color', 'spacing',
            'w', 'kern', 'position', 'sz', 'szCs', 'highlight', 'u', 'effect', 'bdr', 'shd', 'fitText',
            'vertAlign', 'rtl', 'cs', 'em', 'lang', 'eastAsianLayout', 'specVanish', 'oMath'],
    'pPr': ['pStyle', 'keepNext', 'keepLines', 'pageBreakBefore', 'framePr', 'widowControl', 'numPr',
            'suppressLineNumbers', 'pBdr', 'shd', 'tabs', 'suppressAutoHyphens', 'kinsoku', 'wordWrap',
            'overflowPunct', 'topLinePunct', 'autoSpaceDE', 'autoSpaceDN', 'bidi', 'adjustRightInd',
            'snapToGrid', 'spacing', 'ind', 'contextualSpacing', 'mirrorIndents', 'suppressOverlap', 'jc',
            'textDirection', 'textAlignment', 'textboxTightWrap', 'outlineLvl', 'divId', 'cnfStyle', 'rPr',
            'sectPr', 'pPrChange'],
    'tblPr': ['tblStyle', 'tblpPr', 'tblOverlap', 'bidiVisual', 'tblStyleRowBandSize', 'tblStyleColBandSize',
              'tblW', 'jc', 'tblCellSpacing', 'tblInd', 'tblBorders', 'shd', 'tblLayout', 'tblCellMar',
              'tblLook', 'tblCaption', 'tblDescription'],
    'tcPr': ['cnfStyle', 'tcW', 'gridSpan', 'hMerge', 'vMerge', 'tcBorders', 'shd', 'noWrap', 'tcMar',
             'textDirection', 'tcFitText', 'vAlign', 'hideMark'],
}


def insertar(padre, el):
    """Inserta el en padre respetando el orden del esquema; sustituye al que tenga la misma etiqueta."""
    tipo = padre.tag.split('}')[1]
    orden = [qn('w:' + n) for n in ORDEN[tipo]]
    for viejo in padre.findall(el.tag):
        padre.remove(viejo)
    pos = orden.index(el.tag)
    for hijo in list(padre):
        if hijo.tag in orden and orden.index(hijo.tag) > pos:
            hijo.addprevious(el)
            return el
    padre.append(el)
    return el


def elemento(etiqueta, **atributos):
    e = OxmlElement('w:' + etiqueta)
    for k, v in atributos.items():
        e.set(qn('w:' + k), str(v))
    return e


# ---------------------------------------------------------------- fuentes y estilos

def fijar_fuente(rpr, nombre):
    """Pone la fuente en los cuatro atributos de w:rFonts y quita las del tema, que mandarían sobre ella."""
    rfonts = rpr.find(qn('w:rFonts'))
    if rfonts is None:
        rfonts = insertar(rpr, elemento('rFonts'))
    for att in ('w:asciiTheme', 'w:hAnsiTheme', 'w:eastAsiaTheme', 'w:cstheme'):
        if rfonts.get(qn(att)) is not None:
            del rfonts.attrib[qn(att)]
    for att in ('w:ascii', 'w:hAnsi', 'w:eastAsia', 'w:cs'):
        rfonts.set(qn(att), nombre)


def interletraje(rpr, puntos):
    insertar(rpr, elemento('spacing', val=int(round(puntos * 20))))


def estilo_parrafo(doc, nombre, base='Normal'):
    try:
        st = doc.styles[nombre]
    except KeyError:
        st = doc.styles.add_style(nombre, WD_STYLE_TYPE.PARAGRAPH)
        st.base_style = doc.styles[base]
        st.quick_style = True
    return st


def configurar(doc, cuerpo_pt=10.5, interlineado=1.0):
    """Estilos de marca. Devuelve un diccionario con los numId de las viñetas y la numeración.

    Ojo con el interlineado: en Word, «sencillo» ya es la altura de línea propia de cada fuente, que en
    Nunito Sans es de 1,43 veces el cuerpo y en Rubik de 1,53. Por eso el texto va a interlineado
    sencillo y los titulares, con interlineado exacto (1,2 veces el cuerpo).
    """
    styles = doc.styles

    # Valores por defecto del documento: Nunito Sans, color texto, español de España
    defaults = styles.element.find(qn('w:docDefaults'))
    rpr = defaults.find(qn('w:rPrDefault')).find(qn('w:rPr'))
    fijar_fuente(rpr, CUERPO)
    insertar(rpr, elemento('color', val=hexa(TEXTO)))
    insertar(rpr, elemento('sz', val=int(cuerpo_pt * 2)))
    insertar(rpr, elemento('szCs', val=int(cuerpo_pt * 2)))
    insertar(rpr, elemento('lang', val='es-ES', eastAsia='es-ES', bidi='ar-SA'))
    ppr = defaults.find(qn('w:pPrDefault')).find(qn('w:pPr'))
    insertar(ppr, elemento('spacing', after=160, line=int(round(240 * interlineado)), lineRule='auto'))

    normal = styles['Normal']
    fijar_fuente(normal.element.get_or_add_rPr(), CUERPO)
    normal.font.size = Pt(cuerpo_pt)
    normal.font.color.rgb = TEXTO
    normal.paragraph_format.widow_control = True

    def titular(nombre, pt, antes, despues, color=PIZARRA, bold=True, fuente=TITULARES, interl=1.2):
        st = styles[nombre]
        fijar_fuente(st.element.get_or_add_rPr(), fuente)
        st.font.size = Pt(pt)
        st.font.bold = bold
        st.font.italic = False
        st.font.color.rgb = color
        pf = st.paragraph_format
        pf.space_before = Pt(antes)
        pf.space_after = Pt(despues)
        pf.line_spacing = Pt(round(pt * interl * 2) / 2)  # exacto
        pf.keep_with_next = True
        return st

    # Title, sin la raya azul ni el interletraje de la plantilla
    t = titular('Title', 20, 0, 10, interl=1.18)
    tppr = t.element.get_or_add_pPr()
    for el in tppr.findall(qn('w:pBdr')) + tppr.findall(qn('w:contextualSpacing')):
        tppr.remove(el)
    trpr = t.element.get_or_add_rPr()
    for tag in ('w:kern', 'w:spacing'):
        for el in trpr.findall(qn(tag)):
            trpr.remove(el)

    st = styles['Subtitle']
    sppr = st.element.get_or_add_pPr()
    for el in sppr.findall(qn('w:numPr')):
        sppr.remove(el)
    fijar_fuente(st.element.get_or_add_rPr(), CUERPO)
    st.font.size = Pt(12.5)
    st.font.italic = False
    st.font.bold = False
    st.font.color.rgb = TEXTO
    srpr = st.element.get_or_add_rPr()
    for el in srpr.findall(qn('w:spacing')) + srpr.findall(qn('w:iCs')):
        srpr.remove(el)
    st.paragraph_format.space_after = Pt(14)
    st.paragraph_format.line_spacing = 1.0

    titular('Heading 1', 15, 20, 6)
    titular('Heading 2', 11.5, 12, 3)
    titular('Heading 3', cuerpo_pt, 10, 2, fuente=CUERPO, interl=1.35)

    # Antetítulo: mayúsculas espaciadas en chispa-texto sobre el título (como en la presentación)
    ant = estilo_parrafo(doc, 'Antetítulo')
    fijar_fuente(ant.element.get_or_add_rPr(), CUERPO)
    ant.font.size = Pt(8.5)
    ant.font.bold = True
    ant.font.all_caps = True
    ant.font.color.rgb = CHISPA_TEXTO
    interletraje(ant.element.get_or_add_rPr(), 1.2)
    ant.paragraph_format.space_before = Pt(0)
    ant.paragraph_format.space_after = Pt(4)
    ant.paragraph_format.keep_with_next = True
    ant.next_paragraph_style = styles['Title']

    # Destacado: una frase importante sobre fondo salvia, con filete chispa-texto a la izquierda
    dst = estilo_parrafo(doc, 'Destacado')
    fijar_fuente(dst.element.get_or_add_rPr(), TITULARES)
    dst.font.size = Pt(12)
    dst.font.bold = True
    dst.font.color.rgb = PIZARRA
    pf = dst.paragraph_format
    pf.space_before = Pt(12)
    pf.space_after = Pt(14)
    pf.left_indent = Mm(3.5)
    pf.right_indent = Mm(3.5)
    pf.line_spacing = Pt(16)
    dppr = dst.element.get_or_add_pPr()
    insertar(dppr, sombra(SALVIA))
    insertar(dppr, bordes_p(left=(CHISPA_TEXTO, 24, 9), top=(SALVIA, 4, 7), bottom=(SALVIA, 4, 7),
                            right=(SALVIA, 4, 9)))

    nota = estilo_parrafo(doc, 'Nota')
    nota.font.size = Pt(8.5)
    nota.paragraph_format.space_after = Pt(4)
    nota.paragraph_format.line_spacing = 1.0

    pie = estilo_parrafo(doc, 'Pie DirectorIA')
    pie.font.size = Pt(7.5)
    pie.font.color.rgb = TEXTO
    pie.paragraph_format.space_after = Pt(0)
    pie.paragraph_format.space_before = Pt(0)
    pie.paragraph_format.line_spacing = 1.0

    tabla = estilo_parrafo(doc, 'Tabla')
    tabla.font.size = Pt(9.5)
    tabla.paragraph_format.space_after = Pt(0)
    tabla.paragraph_format.space_before = Pt(0)
    tabla.paragraph_format.line_spacing = 1.0

    for nombre in ('Header', 'Footer'):
        s = styles[nombre]
        s.paragraph_format.space_after = Pt(0)
        hppr = s.element.get_or_add_pPr()
        for el in hppr.findall(qn('w:tabs')):
            hppr.remove(el)

    ids = numeraciones(doc)
    for nombre, nid in (('List Bullet', ids['vinetas']), ('List Number', ids['numeros'])):
        st = styles[nombre]
        lppr = st.element.get_or_add_pPr()
        poner_numpr(lppr, nid)
        for el in lppr.findall(qn('w:contextualSpacing')):
            lppr.remove(el)
        st.paragraph_format.space_after = Pt(4)
    return ids


# ---------------------------------------------------------------- listas

def numeraciones(doc):
    """Añade una lista de viñetas y una numerada con la marca. Devuelve sus numId."""
    numbering = doc.part.numbering_part.element

    def abstract(aid, formato, texto, fuente):
        a = elemento('abstractNum', abstractNumId=aid)
        a.append(elemento('multiLevelType', val='hybridMultilevel'))
        for nivel in range(2):
            lvl = elemento('lvl', ilvl=nivel)
            lvl.append(elemento('start', val=1))
            lvl.append(elemento('numFmt', val=formato if nivel == 0 else 'bullet'))
            lvl.append(elemento('lvlText', val=texto if nivel == 0 else '–'))
            lvl.append(elemento('lvlJc', val='left'))
            ppr = elemento('pPr')
            ppr.append(elemento('ind', left=284 + nivel * 284, hanging=284))  # 5 mm por nivel
            lvl.append(ppr)
            rpr = elemento('rPr')
            fijar_fuente(rpr, fuente)
            insertar(rpr, elemento('b'))
            insertar(rpr, elemento('color', val=hexa(CHISPA_TEXTO)))
            lvl.append(rpr)
            a.append(lvl)
        return a

    primera_num = numbering.find(qn('w:num'))
    for a in (abstract(90, 'bullet', '•', CUERPO), abstract(91, 'decimal', '%1.', TITULARES)):
        if primera_num is not None:
            primera_num.addprevious(a)
        else:
            numbering.append(a)
    for nid in (90, 91):
        n = elemento('num', numId=nid)
        n.append(elemento('abstractNumId', val=nid))
        numbering.append(n)
    return {'vinetas': 90, 'numeros': 91, '_siguiente': 92}


def nueva_numeracion(doc, ids):
    """Una lista numerada que vuelve a empezar en 1. Devuelve su numId."""
    numbering = doc.part.numbering_part.element
    nid = ids['_siguiente']
    ids['_siguiente'] += 1
    n = elemento('num', numId=nid)
    n.append(elemento('abstractNumId', val=91))
    ov = elemento('lvlOverride', ilvl=0)
    ov.append(elemento('startOverride', val=1))
    n.append(ov)
    numbering.append(n)
    return nid


def poner_numpr(ppr, num_id, nivel=0):
    numpr = elemento('numPr')
    numpr.append(elemento('ilvl', val=nivel))
    numpr.append(elemento('numId', val=num_id))
    insertar(ppr, numpr)


# ---------------------------------------------------------------- párrafos

def sombra(color):
    return elemento('shd', val='clear', color='auto', fill=hexa(color))


def bordes_p(**lados):
    """lados: top/left/bottom/right = (color, grosor en octavos de punto, separación en puntos)."""
    pbdr = elemento('pBdr')
    for lado in ('top', 'left', 'bottom', 'right'):
        if lado in lados:
            color, sz, space = lados[lado]
            pbdr.append(elemento(lado, val='single', sz=sz, space=space, color=hexa(color)))
    return pbdr


def borde_parrafo(paragraph, **lados):
    insertar(paragraph._p.get_or_add_pPr(), bordes_p(**lados))


def tabulador(paragraph, pos_mm, alineacion='right'):
    ppr = paragraph._p.get_or_add_pPr()
    tabs = ppr.find(qn('w:tabs'))
    if tabs is None:
        tabs = insertar(ppr, elemento('tabs'))
    tabs.append(elemento('tab', val=alineacion, pos=twips(pos_mm)))


def run(paragraph, texto, fuente=None, pt=None, bold=None, color=None, caps=None, tracking=None):
    r = paragraph.add_run(texto)
    if fuente:
        fijar_fuente(r._r.get_or_add_rPr(), fuente)
    if pt:
        r.font.size = Pt(pt)
    if bold is not None:
        r.font.bold = bold
    if color is not None:
        r.font.color.rgb = color
    if caps is not None:
        r.font.all_caps = caps
    if tracking is not None:
        interletraje(r._r.get_or_add_rPr(), tracking)
    return r


def subir(run_, puntos):
    """Sube (o baja, si es negativo) el texto respecto a la línea base, en puntos."""
    insertar(run_._r.get_or_add_rPr(), elemento('position', val=int(round(puntos * 2))))


def campo(paragraph, instruccion, resultado='1', **fmt):
    """Campo de Word (PAGE, NUMPAGES...) con runs begin/instr/separate/end."""
    def r_con(hijo):
        r = run(paragraph, '', **fmt)
        r._r.append(hijo)
    r_con(elemento('fldChar', fldCharType='begin'))
    it = OxmlElement('w:instrText')
    it.set(qn('xml:space'), 'preserve')
    it.text = ' %s ' % instruccion
    r_con(it)
    r_con(elemento('fldChar', fldCharType='separate'))
    run(paragraph, resultado, **fmt)
    r_con(elemento('fldChar', fldCharType='end'))


def imagen_alineada(paragraph, ruta, ancho_mm, margen_izquierdo_mm):
    """Inserta un PNG cuyo margen transparente se mete en el margen de la página, para que la
    tinta del logotipo quede alineada con el texto."""
    paragraph.paragraph_format.left_indent = Mm(-margen_izquierdo_mm)
    paragraph.paragraph_format.space_after = Pt(0)
    paragraph.paragraph_format.space_before = Pt(0)
    paragraph.paragraph_format.line_spacing = 1.0
    r = paragraph.add_run()
    pic = r.add_picture(ruta, width=Mm(ancho_mm))
    sin_separacion(pic)
    return pic


def sin_separacion(inline_shape):
    """python-docx no escribe distT/distB/distL/distR en wp:inline. Word los toma como 0, pero
    LibreOffice aplica entonces la separación por defecto (3,175 mm) y la imagen se desplaza."""
    for att in ('distT', 'distB', 'distL', 'distR'):
        inline_shape._inline.set(att, '0')


def texto_alternativo(inline_shape, texto):
    docpr = inline_shape._inline.find(qn('wp:docPr'))
    docpr.set('descr', texto)
    docpr.set('title', texto)


# ---------------------------------------------------------------- tablas

def preparar_tabla(table, anchos_mm, margenes=(1.8, 2.4, 1.8, 2.4)):
    """Anchos fijos, sin bordes y con márgenes de celda (arriba, izquierda, abajo, derecha, en mm)."""
    tblpr = table._tbl.tblPr
    for el in tblpr.findall(qn('w:tblStyle')):
        tblpr.remove(el)
    insertar(tblpr, elemento('tblW', w=twips(sum(anchos_mm)), type='dxa'))
    bordes = elemento('tblBorders')
    for lado in ('top', 'left', 'bottom', 'right', 'insideH', 'insideV'):
        bordes.append(elemento(lado, val='nil'))
    insertar(tblpr, bordes)
    insertar(tblpr, elemento('tblLayout', type='fixed'))
    mar = elemento('tblCellMar')
    for lado, mm in zip(('top', 'left', 'bottom', 'right'), margenes):
        mar.append(elemento(lado, w=twips(mm), type='dxa'))
    insertar(tblpr, mar)
    insertar(tblpr, elemento('tblLook', val='0000', firstRow=0, lastRow=0, firstColumn=0, lastColumn=0,
                             noHBand=1, noVBand=1))
    grid = table._tbl.tblGrid
    for i, gc in enumerate(grid.findall(qn('w:gridCol'))):
        gc.set(qn('w:w'), twips(anchos_mm[i]))
    for row in table.rows:
        for i, cell in enumerate(row.cells):
            tcpr = cell._tc.get_or_add_tcPr()
            insertar(tcpr, elemento('tcW', w=twips(anchos_mm[i]), type='dxa'))


def borde_celda(cell, **lados):
    """lados: top/left/bottom/right = (color, grosor en octavos de punto)."""
    tcpr = cell._tc.get_or_add_tcPr()
    existentes = tcpr.find(qn('w:tcBorders'))
    actuales = {}
    if existentes is not None:
        for h in existentes:
            actuales[h.tag.split('}')[1]] = h
    nuevos = elemento('tcBorders')
    for lado in ('top', 'left', 'bottom', 'right'):
        if lado in lados:
            color, sz = lados[lado]
            nuevos.append(elemento(lado, val='single', sz=sz, space=0, color=hexa(color)))
        elif lado in actuales:
            nuevos.append(actuales[lado])
    insertar(tcpr, nuevos)


def sombrear_celda(cell, color):
    insertar(cell._tc.get_or_add_tcPr(), sombra(color))


def alinear_celda(cell, vertical='center'):
    insertar(cell._tc.get_or_add_tcPr(), elemento('vAlign', val=vertical))


def margen_celda(cell, arriba=None, izquierda=None, abajo=None, derecha=None):
    mar = elemento('tcMar')
    for lado, mm in (('top', arriba), ('left', izquierda), ('bottom', abajo), ('right', derecha)):
        if mm is not None:
            mar.append(elemento(lado, w=twips(mm), type='dxa'))
    insertar(cell._tc.get_or_add_tcPr(), mar)


def no_partir_filas(table, cabecera=False):
    for i, row in enumerate(table.rows):
        trpr = row._tr.get_or_add_trPr()
        trpr.append(elemento('cantSplit'))
        if cabecera and i == 0:
            trpr.append(elemento('tblHeader'))


def parrafo_celda(cell, texto='', estilo='Tabla', **fmt):
    """Primer párrafo de la celda (o uno nuevo) con texto y formato."""
    p = cell.paragraphs[0] if (len(cell.paragraphs) == 1 and not cell.paragraphs[0].text) else cell.add_paragraph()
    p.style = estilo
    if texto:
        run(p, texto, **fmt)
    return p


# ---------------------------------------------------------------- posproceso del .docx

TEMA_COLORES = '''<a:clrScheme name="DirectorIA">
      <a:dk1><a:sysClr val="windowText" lastClr="000000"/></a:dk1>
      <a:lt1><a:sysClr val="window" lastClr="FFFFFF"/></a:lt1>
      <a:dk2><a:srgbClr val="17322C"/></a:dk2>
      <a:lt2><a:srgbClr val="F6F3EC"/></a:lt2>
      <a:accent1><a:srgbClr val="17322C"/></a:accent1>
      <a:accent2><a:srgbClr val="B4531C"/></a:accent2>
      <a:accent3><a:srgbClr val="2E5A50"/></a:accent3>
      <a:accent4><a:srgbClr val="41524D"/></a:accent4>
      <a:accent5><a:srgbClr val="D5DED9"/></a:accent5>
      <a:accent6><a:srgbClr val="E07A3A"/></a:accent6>
      <a:hlink><a:srgbClr val="B4531C"/></a:hlink>
      <a:folHlink><a:srgbClr val="2E5A50"/></a:folHlink>
    </a:clrScheme>'''

FUENTES_TABLA = '''  <w:font w:name="Rubik">
    <w:panose1 w:val="00000000000000000000"/>
    <w:charset w:val="00"/>
    <w:family w:val="swiss"/>
    <w:pitch w:val="variable"/>
  </w:font>
  <w:font w:name="Nunito Sans">
    <w:panose1 w:val="00000000000000000000"/>
    <w:charset w:val="00"/>
    <w:family w:val="swiss"/>
    <w:pitch w:val="variable"/>
  </w:font>
</w:fonts>'''


def posprocesar(ruta):
    """Tema de colores y fuentes de la marca, fuentes declaradas «sin remates» (para que Word
    elija una sustituta parecida si no están instaladas) e idioma español en los ajustes."""
    with zipfile.ZipFile(ruta) as z:
        nombres = z.namelist()
        partes = {n: z.read(n) for n in nombres}
    tema = partes['word/theme/theme1.xml'].decode('utf-8')
    tema = re.sub(r'<a:clrScheme name="[^"]*">.*?</a:clrScheme>', TEMA_COLORES, tema, flags=re.S)
    tema = re.sub(r'(<a:majorFont>\s*<a:latin typeface=")[^"]*"', r'\1Rubik"', tema)
    tema = re.sub(r'(<a:minorFont>\s*<a:latin typeface=")[^"]*"', r'\1Nunito Sans"', tema)
    tema = tema.replace('name="Office Theme"', 'name="DirectorIA"', 1)
    tema = re.sub(r'<a:fontScheme name="[^"]*">', '<a:fontScheme name="DirectorIA">', tema)
    partes['word/theme/theme1.xml'] = tema.encode('utf-8')

    ft = partes['word/fontTable.xml'].decode('utf-8')
    if 'w:name="Rubik"' not in ft:
        ft = ft.replace('</w:fonts>', FUENTES_TABLA)
    partes['word/fontTable.xml'] = ft.encode('utf-8')

    st = partes['word/settings.xml'].decode('utf-8')
    st = re.sub(r'<w:themeFontLang [^>]*/>', '<w:themeFontLang w:val="es-ES"/>', st)
    st = st.replace('<w:decimalSymbol w:val="."/>', '<w:decimalSymbol w:val=","/>')
    st = st.replace('<w:listSeparator w:val=","/>', '<w:listSeparator w:val=";"/>')
    # Modo de compatibilidad de Word 2013 o posterior: sin el aviso «Modo de compatibilidad» y con las
    # tablas alineadas por su borde (en el modo 14, el borde se sale del margen lo que mide el margen de celda)
    st = re.sub(r'(<w:compatSetting w:name="compatibilityMode" w:uri="[^"]*" w:val=")\d+(")', r'\g<1>15\2', st)
    partes['word/settings.xml'] = st.encode('utf-8')

    # La miniatura que trae la plantilla de python-docx no es de este documento: fuera
    if 'docProps/thumbnail.jpeg' in partes:
        del partes['docProps/thumbnail.jpeg']
        nombres.remove('docProps/thumbnail.jpeg')
        rels = partes['_rels/.rels'].decode('utf-8')
        rels = re.sub(r'<Relationship [^>]*Target="docProps/thumbnail.jpeg"[^>]*/>', '', rels)
        partes['_rels/.rels'] = rels.encode('utf-8')
        ct = partes['[Content_Types].xml'].decode('utf-8')
        ct = re.sub(r'<Override [^>]*PartName="/docProps/thumbnail.jpeg"[^>]*/>', '', ct)
        partes['[Content_Types].xml'] = ct.encode('utf-8')

    with zipfile.ZipFile(ruta, 'w', zipfile.ZIP_DEFLATED) as z:
        for n in ['[Content_Types].xml'] + [n for n in nombres if n != '[Content_Types].xml']:
            z.writestr(n, partes[n])
