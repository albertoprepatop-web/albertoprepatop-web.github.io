# Comprobaciones del mazo antes de publicar.
#   python3 -I tools/comprobar.py [--permitir-pendientes]
# 1. Cada diapositiva del orden existe y lleva notas.
# 2. Cada /_blob/ que se cita tiene archivo para renderizar (blob-map.json) y origen en el kit (comprobacion/blob-origen.json).
# 3. Ningún /_blob/ antiguo de las ilustraciones corregidas (publicadas aún con la chispa).
# 4. Lo publicado coincide con el kit: el sha256 de la copia bajada (comprobacion/publicados/<id>.svg) tiene que ser el
#    que da el listado del artifact (comprobacion/assets-publicados.txt, Artifact list con scope «assets»), y su dibujo,
#    el del archivo del kit. Se compara el XML canónico (C14N), porque el artifact guarda los SVG con otra sintaxis
#    (<circle ...></circle> en vez de <circle .../>) y el sha256 en bruto no coincide nunca.
# 5. Los /_blob/pendiente-<nombre> son archivos que aún hay que subir: error, salvo con --permitir-pendientes.
# 6. Parte 1 (Esencial): ni insignia de la IA, ni «Preparado con IA», ni «con IA», ni ilustraciones con la chispa
#    (mirando el archivo que se publica de verdad, no el del kit).
# 7. Partes 1 y 2: cada diapositiva (menos la portadilla) lleva la etiqueta de su versión junto al antetítulo.
# 8. Ningún marcador a la vista: «PENDIENTE» o texto entre corchetes en lo que se proyecta (no en las notas).
#    Excepciones: las cifras de precios-versiones y condiciones-versiones mientras no estén cerradas (aviso), y los
#    huecos del ponente de la portada y el cierre ([Tu nombre], [correo@dominio.es], [teléfono]).
# 9. Sin datos de alumnos (decisión del 26-28 de noviembre de 2026), en lo que se proyecta y en las notas: ni «Alumno/a», ni
#    casos («Caso 2026-07»), ni los nombres de alumnos de la ficha antigua, ni salud de nadie (alergias, fiebre), ni «la IA trata
#    los datos de los alumnos» y parecidas. En lo que se proyecta, además: ni «no salen del colegio», ni apartados «Necesidades»,
#    «Salud» o «Recogida», ni las funciones que salen (certificados de matrícula o de estudios, autorizaciones de imagen,
#    optativas, reclamaciones, pautas y anotaciones, acta de la junta de evaluación, actas de una evaluación, que llevan las
#    notas de cada alumno). La ficha lleva su línea fija, tal cual. En los protocolos, quien decide es la dirección: nunca
#    «decide el equipo». En el resumen de las 8:00, ausencias del profesorado, no «faltas» (se leen como las del alumnado).
import hashlib, json, os, re, sys
from xml.etree.ElementTree import canonicalize

AQUI = os.path.dirname(os.path.abspath(__file__))
MAZO = os.path.dirname(AQUI)
sys.path.insert(0, AQUI)
from ilus import ANTIGUOS, FICHA_LINEA_FIJA

permitir = '--permitir-pendientes' in sys.argv
deck = json.load(open(os.path.join(MAZO, 'project/deck.json')))
orden = deck['order']
render = json.load(open(os.path.join(MAZO, 'blob-map.json')))
origen = json.load(open(os.path.join(MAZO, 'comprobacion/blob-origen.json')))
pubdir = os.path.join(MAZO, 'comprobacion/publicados')
listado = {}
for l in open(os.path.join(MAZO, 'comprobacion/assets-publicados.txt')):
    m = re.search(r'(/_blob/[0-9a-f]{32}).*sha256 ([0-9a-f]{64})', l)
    if m: listado[m.group(1)] = m.group(2)

errores, avisos = [], []
def sha(f): return hashlib.sha256(open(f, 'rb').read()).hexdigest()
def c14(f): return canonicalize(from_file=f, strip_text=True)
def sin_titulo(x): return re.sub(r'<title>.*?</title>', '', x)
def visible(html):
    return re.sub(r'<aside>.*?</aside>', '', html, flags=re.S)

html = {}
for i in orden:
    f = os.path.join(MAZO, 'project/slides', i + '.html')
    if not os.path.exists(f):
        errores.append(f'{i}: no existe'); continue
    html[i] = open(f).read()
    if not re.search(r'<aside>\s*\S', html[i]): errores.append(f'{i}: sin notas')

usados = {}
for i, h in html.items():
    for b in re.findall(r'/_blob/[A-Za-z0-9_-]+', h):
        usados.setdefault(b, []).append(i)

# 2, 3 y 5
pendientes = {}
for b, ids in sorted(usados.items()):
    if b not in render: errores.append(f'{b} (en {", ".join(ids)}): no está en blob-map.json')
    if b not in origen: errores.append(f'{b} (en {", ".join(ids)}): no está en blob-origen.json')
    if b in ANTIGUOS: errores.append(f'{b} = {ANTIGUOS[b]} antigua, con la chispa (en {", ".join(sorted(set(ids)))})')
    if b.startswith('/_blob/pendiente-'): pendientes[b] = sorted(set(ids))
for b, ids in pendientes.items():
    (avisos if permitir else errores).append(f'pendiente de subir: {os.path.relpath(origen.get(b, "?"), "/home/user/albertoprepatop-web.github.io/directoria")} ({b}, en {len(ids)} diapositivas)')

# 4. Lo publicado frente al kit
publicados_ok = {}
for b in sorted(usados):
    if b.startswith('/_blob/pendiente-') or b not in origen: continue
    kit = origen[b]
    copia = os.path.join(pubdir, b.split('/')[-1] + '.svg')
    if b not in listado:
        errores.append(f'{b}: no está en el listado del artifact'); continue
    if sha(kit) == listado[b]:
        publicados_ok[b] = 'igual'; continue
    if not os.path.exists(copia):
        avisos.append(f'{b} ({os.path.basename(kit)}): sin copia bajada para comparar'); continue
    if sha(copia) != listado[b]:
        errores.append(f'{b}: la copia bajada no es la publicada (sha256 distinto)'); continue
    a, k = c14(copia), c14(kit)
    if a == k: publicados_ok[b] = 'igual'
    elif sin_titulo(a) == sin_titulo(k):
        publicados_ok[b] = 'título'
        avisos.append(f'{b} ({os.path.basename(kit)}): mismo dibujo; solo cambia el <title> (no se ve: se cita con <img> y su alt)')
    else:
        errores.append(f'{b} ({os.path.basename(kit)}): lo publicado no es el dibujo del kit; hay que subirlo otra vez')

# 6 y 7. Partes 1 y 2
p1 = orden.index('portadilla-esencial'); p2 = orden.index('portadilla-completo'); p3 = orden.index('portadilla-comparativa')
parte1 = orden[p1 + 1:p2]; parte2 = orden[p2 + 1:p3]
anexo = [i for i in orden[orden.index('cierre') + 1:]] if 'cierre' in orden else []
def chispa_publicada(b):
    if b.startswith('/_blob/pendiente-'): f = origen.get(b)
    else:
        copia = os.path.join(pubdir, b.split('/')[-1] + '.svg')
        f = copia if os.path.exists(copia) else origen.get(b)
    return f and '#E07A3A' in open(f).read().upper()
for i in parte1 + [a for a in anexo if a.endswith('-esencial')]:
    v = visible(html.get(i, ''))
    if re.search(r'class="[^"]*\b(vs-ins|bk-ins)\b', v) or '#E07A3A' in v.upper():
        errores.append(f'{i}: parte 1 con la insignia de la IA o naranja de la chispa')
    if 'Preparado con IA' in v or re.search(r'>\s*con IA\s*<', v):
        errores.append(f'{i}: parte 1 con «Preparado con IA» o «con IA»')
    for b in set(re.findall(r'/_blob/[A-Za-z0-9_-]+', v)):
        if chispa_publicada(b): errores.append(f'{i}: parte 1 con una ilustración que lleva la chispa ({b})')
    if 'vs-eb' not in v or '<span class="vs-tag">sin IA</span>' not in v:
        errores.append(f'{i}: sin la etiqueta «sin IA» en el antetítulo')
for i in parte2:
    v = visible(html.get(i, ''))
    if 'vs-eb' not in v or '<span class="vs-tag ia">con IA</span>' not in v:
        errores.append(f'{i}: sin la etiqueta «con IA» en el antetítulo')

# 8. Marcadores a la vista
PRECIOS = {'precios-versiones', 'condiciones-versiones'}
HUECOS_PONENTE = {'[Tu nombre]', '[correo@dominio.es]', '[teléfono]'}
def texto_visible(h):
    t = visible(h)
    t = re.sub(r'<svg\b.*?</svg>', ' ', t, flags=re.S)
    t = re.sub(r'<[^>]+>', ' ', t)
    return re.sub(r'\s+', ' ', t.replace('&nbsp;', ' ').replace('\u00a0', ' '))
for i in orden:
    t = texto_visible(html.get(i, ''))
    corchetes = [c for c in re.findall(r'\[[^\]]*\]', t) if c not in HUECOS_PONENTE]
    pend = len(re.findall(r'PENDIENTE', t))   # en mayúsculas: el marcador. «Pendiente» es un estado de la app (protocolo)
    if corchetes: errores.append(f'{i}: texto entre corchetes a la vista: {", ".join(corchetes)}')
    if pend and i in PRECIOS: avisos.append(f'{i}: {pend} {"cifra pendiente" if pend == 1 else "cifras pendientes"} («PENDIENTE»): no publicar hasta cerrarlas')
    elif pend: errores.append(f'{i}: «PENDIENTE» a la vista')

# 9. Sin datos de alumnos
EN_TODO = [
 (r'Alumno/a', '«Alumno/a»'),
 (r'\bCaso \d{4}-\d{2}', 'un caso abierto en DirectorIA'),
 (r'\b(Mario|Lucía|Hugo)\b', 'nombres de alumnos de la ficha antigua'),
 (r'(?i)\bfiebre\b|alérgic|autoinyector', 'salud de una persona concreta'),
 (r'(?i)\btrata\b[^.«»<]{0,40}\balumn', '«la IA trata los datos de los alumnos» o parecida'),
]
SOLO_A_LA_VISTA = [
 (r'(?i)no salen (nunca )?del colegio', '«no salen del colegio»'),
 (r'class="label">\s*(Necesidades|Salud|Recogida)', 'apartado «Necesidades», «Salud» o «Recogida» en la ficha'),
 (r'(?i)certificados? de (matrícula|estudios)|autorizaci[oó]n(es)? de imagen|optativas|reclamaci[oó]n|junta de evaluaci[oó]n|pautas para el aula|anotáis',
  'una función que ya no está (sin datos de alumnos)'),
 (r'(?i)actas? de la evaluaci[oó]n', 'actas de una evaluación, con las notas de cada alumno'),
 (r'(?i)decide el equipo', 'en el protocolo decide la dirección, no «el equipo»'),
 (r'\bFaltas, plazos', '«Faltas» en el resumen de las 8:00: son ausencias del profesorado'),
]
for i in orden:
    h = html.get(i, '')
    # Lo que se proyecta, sin etiquetas (una frase partida por <br> también cuenta) y, para los apartados de la ficha, con ellas
    v = visible(h); tv = texto_visible(h); notas_i = ''.join(re.findall(r'<aside>(.*?)</aside>', h, re.S))
    for pat, que in EN_TODO:
        for donde, t in (('a la vista', tv), ('en las notas', notas_i)):
            m = re.search(pat, t)
            if m: errores.append(f'{i}: {que} {donde} («{m.group(0)}»)')
    for pat, que in SOLO_A_LA_VISTA:
        m = re.search(pat, v if pat.startswith('class=') else tv)
        if m: errores.append(f'{i}: {que} («{m.group(0)}»)')
if 'ficha-esencial' in html and FICHA_LINEA_FIJA not in visible(html['ficha-esencial']):
    errores.append('ficha-esencial: falta la línea fija de la ficha, tal cual')

print(f'{len(orden)} diapositivas; {len(usados)} /_blob/ distintos; publicados comprobados: {len(publicados_ok)}')
for a in avisos: print('aviso:', a)
for e in errores: print('ERROR:', e)
sys.exit(1 if errores else 0)
