# Crea las diapositivas derivadas a partir de las originales del repositorio, sin tocarlas.
# Cada cambio tiene que aplicarse una sola vez: si la original cambia y un cambio ya no encaja, el script se para y avisa.
# Un cambio es (texto, texto nuevo) o ('re', patrón, texto nuevo); el patrón tiene que encontrarse una sola vez.
# Uso: python3 tools/derivar.py project/slides
import os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from ilus import B, OK, antetitulo, servidor_sin_chispa, FICHA_LINEA_FIJA

D = sys.argv[1]
def deriva(origen, destino, cambios):
    s = open(os.path.join(D, origen + '.html')).read()
    for c in cambios:
        if c[0] == 're':
            _, pat, nuevo = c
            m = re.findall(pat, s, re.S)
            if len(m) != 1:
                raise SystemExit(f'{destino}: el patrón aparece {len(m)} veces: {pat[:90]!r}')
            s = re.sub(pat, lambda _m: nuevo, s, flags=re.S)
        else:
            a, b = c
            n = s.count(a)
            if n != 1:
                raise SystemExit(f'{destino}: el texto a cambiar aparece {n} veces: {a[:90]!r}')
            s = s.replace(a, b)
    open(os.path.join(D, destino + '.html'), 'w').write(s)
    print('ok', destino)

def notas(texto):
    return ('re', r'<aside>.*?</aside>', f'<aside>{texto}</aside>')

CB = '<span class="bk-cb"><svg class="bk-chk" viewBox="0 0 20 20" aria-hidden="true"><path d="M4.5 10.4l3.6 3.6 7.4-7.6" fill="none" stroke="#F6F3EC" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>'
INS_BK = '<svg class="bk-ins" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="12" fill="#17322C"/><path d="M12 4.2 14.6 12 12 19.8 9.4 12z" fill="#E07A3A"/></svg>'

# ======================= Apertura =======================
deriva('cover', 'cover-dos', [
 ('<section id="cover" class="dark cover" data-transition="fade">', '<section id="cover-dos" class="dark cover cv2" data-transition="fade">'),
 ('<p class="eyebrow">Presentación para equipos directivos</p>', '<p class="eyebrow">Esencial y Completo · Presentación para equipos directivos</p>'),
 ('<h1 class="display cv-w">Vuestra IA, dentro del colegio</h1>', '<h1 class="display cv-w">DirectorIA propone. Vosotros decidís.</h1>'),
 ('re', r'<p class="sub cv-w">.*?</p>', '<p class="sub cv-w">Esencial organiza el colegio con sus reglas: quién cubre cada ausencia, plazos y protocolos. Completo suma la IA, que redacta actas y correos. Las dos, dentro del colegio.</p>'),
 notas('Presentarse en una frase. El título es la segunda línea del eslogan, que vale para las dos versiones. La idea que tiene que quedar: DirectorIA organiza el colegio desde un servidor dentro del propio colegio; con Esencial, con las reglas del centro, y con Completo, además, con una IA propia que trabaja dentro del colegio, también con el correo. Y desde la primera diapositiva: DirectorIA no guarda datos de alumnos, solo del profesorado y del funcionamiento del colegio. Es para el equipo directivo y el claustro, no un chat más en la nube. Las guardias y las fichas las prepara DirectorIA con las reglas del colegio, sin IA, en las dos versiones; con Completo, la IA redacta actas y correos. DirectorIA prepara y propone; decidís vosotros. Contar cómo va la presentación: primero, todo lo de Esencial, sin IA; después, lo que añade Completo, con IA, y al final la comparativa y los precios.'),
])

# Frases de la decisión del 26-28 de noviembre de 2026 (sin datos de alumnos), iguales en todas las piezas
FRASE_DATOS = '«La aplicación y los datos están en un servidor dentro del colegio. La copia de seguridad, cifrada, está en la UE. Los correos salen por la cuenta del propio colegio. El mantenimiento a distancia queda registrado.»'
FRASE_ALUMNOS = '«DirectorIA no guarda datos de alumnos: solo del profesorado y del funcionamiento del colegio.»'
FRASE_CORREO = '«La IA trabaja dentro del colegio, también con el correo.»'
FRASE_JUSTIFICANTES = '«Los justificantes los archiva un programa en su carpeta; la IA no los lee.»'
CORREO_EXCEPCION = ('El correo es la única excepción, y hay que decirla bien: lo que llega por correo puede traer nombres de alumnos, porque lo escriben las familias. '
                    'Con Completo, la IA lo lee en el servidor del colegio para resumirlo, y DirectorIA no crea fichas de alumnos ni guarda sus datos aparte.')

# El dato que engancha la presentación. La pregunta ya no gira alrededor de «los datos de vuestros alumnos», que DirectorIA no
# guarda; en las notas, la frase nueva justo después de lo de la Agencia de Protección de Datos. La frase del final, sin corte:
# «sino con qué datos y dónde acaban» va entera en la segunda línea.
deriva('dato', 'dato-dos', [
 ('<section id="dato" class="accent statement">', '<section id="dato-dos" class="accent statement">'),
 ('<p class="say">La pregunta ya no es si usar IA en el colegio, sino dónde acaban los datos de vuestros alumnos.</p>',
  '<p class="say">La pregunta ya no es si usar IA en el colegio, sino con qué datos y dónde acaban.</p>'),
 ('en los públicos, la Administración educativa.', f'en los públicos, la Administración educativa. Enlazar con la frase: {FRASE_ALUMNOS}'),
])

# Privacidad, común a las dos versiones: va en la apertura, sin etiqueta de versión. El servidor, sin la chispa
# (el de datos, el mismo de paso-completo); el módulo de Claude, rotulado como solo de Completo.
deriva('funciona-datos', 'funciona-datos-dos', [
 ('<section id="funciona-datos">', '<section id="funciona-datos-dos">'),
 ('<p class="eyebrow">Privacidad</p>', '<p class="eyebrow">Las dos versiones · Privacidad</p>'),
 ('re', r'<img class="fn-ill" src="[^"]+" alt="Servidor de DirectorIA, dentro del colegio" width="160" height="160">',
  servidor_sin_chispa('fn-ill', 'Servidor de DirectorIA, dentro del colegio', 160)),
 # Se guarda, no «se trata»: DirectorIA no guarda datos de alumnos (decisión del 26-28 de noviembre de 2026)
 ('<h2 class="title">Qué se trata dentro del colegio y qué sale</h2>', '<h2 class="title">Qué se guarda dentro del colegio y qué sale</h2>'),
 ('<p class="fnd-at fnd-zt fn-line">Horarios, ausencias, salud, recogidas y actas:<br>en el servidor del colegio, cifrado<br>y con permisos por cargo</p>',
  '<p class="fnd-at fnd-zt fn-line fnd-solo">Horarios, guardias, plazos, gastos y actas,<br>cifrados y con permisos por cargo.<br><b>DirectorIA no guarda datos de alumnos:<br>solo del profesorado y del funcionamiento<br>del colegio.</b></p>'),
 ('<h3 class="fn-name">Módulo de Claude (opcional)</h3><p class="fn-line">Solo peticiones de material didáctico,<br>con un filtro pensado para bloquear<br>datos personales</p>',
  '<h3 class="fn-name">Módulo de Claude (opcional)</h3><p class="fn-line fnd-solo"><b>Solo con Completo,</b> para material<br>didáctico y con un filtro pensado<br>para bloquear datos personales</p>'),
 # La única excepción, el correo: lo que llega puede traer nombres de alumnos (lo escriben las familias)
 ('<h3 class="fn-name">Correo</h3><p class="fn-line">Los correos salen por la cuenta de correo<br>que ya tiene el colegio</p>',
  '<h3 class="fn-name">Correo</h3><p class="fn-line fnd-solo">Sale por la cuenta del colegio.<br><b>Con\u00a0Completo,</b> la IA resume el que llega,<br>sin guardar aparte nombres de alumnos.</p>'),
 notas('Vale para las dos versiones; el módulo de Claude es solo de Completo, y opcional. Aquí se gana la confianza, así que va antes de entrar en cada versión. '
       f'La frase que hay que decir: {FRASE_DATOS} Y enseguida: {FRASE_ALUMNOS} Con Completo, añadir: {FRASE_CORREO} '
       f'{CORREO_EXCEPCION} Lo que se guarda: horarios, grupos, aulas, guardias, ausencias del profesorado (sin el motivo), plazos, documentos del centro, gastos, contratos y actas, cifrados y con permisos por cargo. '
       f'Los justificantes del profesorado los sube cada docente y un programa los archiva en su carpeta; ningún programa lee su contenido: {FRASE_JUSTIFICANTES} Es el único dato de salud que guarda DirectorIA, y es del profesorado. '
       'El servidor del dibujo no lleva la luz naranja porque es el de los datos, el mismo en las dos versiones; con Completo, el servidor de IA va a su lado, también dentro del colegio. '
       'No decir nunca que los datos «no salen del colegio»: hay una copia de seguridad fuera, el correo sale por la cuenta del colegio y hay mantenimiento a distancia. '
       'Las copias de seguridad van cifradas: una en el colegio, en un disco de copias aparte, y otra fuera, en un centro de datos de la UE. '
       'El mantenimiento a distancia no accede a datos personales o, si hace falta, accede desde el Espacio Económico Europeo, con permiso del colegio, registro y contrato de encargo. El colegio sigue siendo el responsable del tratamiento. '
       'El módulo de Claude es opcional y solo para material didáctico: no tiene acceso a los datos del colegio, un filtro está pensado para bloquear datos personales y la norma de uso es no introducirlos. '
       'Las actualizaciones entran revisadas y no sacan datos personales del colegio. Damos borradores del registro de actividades, de los textos para informar al profesorado y al comité y de la evaluación de impacto (en Esencial puede no hacer falta: es una pregunta para el abogado) para el delegado de protección de datos del colegio: '
       'es nuestra lectura de la norma, no la de un abogado, y la última palabra la tiene su delegado.'),
])

# ======================= Parte 1 · Esencial =======================
deriva('funciona-manana', 'funciona-manana-esencial', [
 ('<section id="funciona-manana">', '<section id="funciona-manana-esencial">'),
 ('<p class="eyebrow">Cómo funciona</p>', antetitulo('Esencial · Cómo funciona', 'esencial')),
 # Sin la chispa del servidor, que en el kit marca dónde actúa la IA
 ('re', r'<img class="fn-ill" src="[^"]+" alt="Servidor de DirectorIA" width="160" height="160">',
  f'<img class="fn-ill" src="{B("colegio")}" alt="El colegio, con el servidor de DirectorIA dentro" width="160" height="160">'),
 # La ficha solo lleva la clase (decisión del 26-28 de noviembre de 2026): nada de necesidades, alergias ni recogidas
 ('<p class="fn-line">Quien sustituye recibe<br>su ficha: tarea, necesidades,<br>alergias y recogidas</p>',
  '<p class="fn-line">Quien sustituye recibe<br>su ficha: tarea, material<br>y a quién llamar</p>'),
 notas('Contarlo como una historia, mirando a jefatura de estudios. A las 7:45 un docente avisa de que no viene; DirectorIA apunta que falta y a qué horas, nunca el motivo. '
       'DirectorIA propone quién cubre cada hora, con las reglas del colegio y un reparto equilibrado de guardias: no lo hace la IA, sino las reglas y los datos del centro. '
       'Jefatura lo revisa y lo confirma: decide una persona. Quien sustituye recibe su ficha, que solo lleva la clase: la tarea, el material y a quién llamar. '
       'Nada de los alumnos: las indicaciones de salud y de recogida las tiene el colegio, y la ficha recuerda que hay que preguntarlas en conserjería o a la tutora antes de empezar. '
       'A las 8:00, dirección lo ve en su resumen del día. Es lo que enseñamos en directo en la demo, con una mañana de ejemplo y sin datos reales del colegio.'),
])

# La ficha de sustitución: solo la clase (grupo, materia, hora y aula), la tarea, el material y a quién llamar, y la línea fija,
# igual en todas las fichas, que no es un dato. Ni nombres de alumnos, ni «Necesidades», «Salud» o «Recogida».
# Los textos son los de la ficha de la demo (BIBLIA, E2), para que sea la misma ficha; la clase fch-e da más ancho a la ficha.
deriva('ficha', 'ficha-esencial', [
 ('<section id="ficha" class="alt">', '<section id="ficha-esencial" class="alt fch-e">'),
 ('<p class="eyebrow">En detalle</p>', antetitulo('Esencial · En detalle', 'esencial')),
 ('re', r'<p class="lead">Quien sustituye sabe qué tiene que hacer.*?</p>',
  '<p class="lead">Quien sustituye sabe qué clase tiene, qué tiene que hacer y\u00a0a\u00a0quién llamar. Solo la clase: ningún dato de los\u00a0alumnos.</p>'),
 ('re', r'<li>Los datos los introducen tutoría, orientación.y.dirección\.</li>', '<li>La tarea sale de la programación quincenal de quien\u00a0falta.</li>'),
 ('<p class="mock-head">3.º B · Matemáticas · 6.ª hora<span class="mock-origen">', '<p class="mock-head">3.º B · Matemáticas · 6.ª hora · Aula de 3.º B, planta\u00a0baja<span class="mock-origen">'),
 ('re', r'<div class="item"><p class="label">Tarea</p>.*?</div>\n</div>\n</div>\n<p class="foot-quiet">',
  '<div class="item"><p class="label">Tarea</p><p class="val">Ejercicios 4 a 9 de la página 58, de la programación quincenal de Sergio Prieto.</p></div>\n'
  '<div class="item"><p class="label">Material</p><p class="val">Los libros de Matemáticas, en el armario del aula. Las hojas de cuadrícula, en la bandeja de la mesa del\u00a0tutor.</p></div>\n'
  '<div class="item"><p class="label">A quién llamar</p><p class="val">Tutoría: Ana Torres, tutora de 3.º A (ext.\u00a0213)<br>Jefatura de estudios (ext.\u00a0202) · Conserjería (ext.\u00a0200)</p></div>\n'
  f'<div class="item alert fch-fija"><p class="val">{FICHA_LINEA_FIJA}</p></div>\n'
  '</div>\n</div>\n<p class="foot-quiet">'),
 notas('La ficha solo lleva la clase: grupo, materia, hora y aula; la tarea, que sale de la programación quincenal del docente que falta; el material y dónde está, y a quién llamar, con su extensión. '
       'No lleva nada de los alumnos: ni nombres, ni necesidades, ni salud, ni recogidas. La última línea es fija, igual en todas las fichas, y no es un dato: '
       f'«{FICHA_LINEA_FIJA}» '
       'Como hoy falta el tutor de 3.º B, la ficha da la tutora del grupo paralelo: Ana Torres, de 3.º A. Se abre antes de la sesión, se cierra al acabar la jornada y queda registrado quién la ha visto. '
       'La prepara DirectorIA con los horarios y las programaciones del colegio, sin IA, y la confirma jefatura: «Preparada por DirectorIA · confirmada por jefatura». '
       'Es la ficha de Pablo Sanz, que cubre la 6.ª hora de 3.º B en el ejemplo anterior: el mismo caso que enseñamos en la demo.'),
])

# Protocolo de acoso: ya no se abre ningún caso en DirectorIA. La guía (cómo se hace y los pasos) la genera gen_protocolo.py.

# Banco de recursos: subir sin IA. Otro recurso (Lengua, 3.er ciclo), para que no choque con la búsqueda de la parte 2.
deriva('banco-compartir', 'banco-subir-esencial', [
 ('<section id="banco-compartir">', '<section id="banco-subir-esencial" class="bs-esencial">'),
 ('<p class="eyebrow">Ejemplo · Banco de recursos · 2/2</p>', antetitulo('Esencial · Ejemplo · Banco de recursos', 'esencial')),
 ('<p class="bk-fv">Flashcards: frutas y verduras de temporada</p>', '<p class="bk-fv">Rúbrica de exposición oral</p>'),
 ('<div class="bk-f"><p class="bk-fl">Curso <b>· obligatorio</b></p><div class="bk-fr"><p class="bk-chip bk-sel">3.º de Primaria</p><p class="bk-chip bk-sel">4.º de Primaria</p></div></div>\n<div class="bk-f"><p class="bk-fl">Materia <b>· obligatoria</b></p><div class="bk-fr"><p class="bk-chip bk-sel">Educación Física</p></div></div>',
  '<div class="bk-f bs-cm"><div class="bs-c"><p class="bk-fl">Curso <b>· obligatorio</b></p><div class="bk-fr"><p class="bk-chip bk-sel">5.º de Primaria</p><p class="bk-chip bk-sel">6.º de Primaria</p></div></div><div class="bs-c"><p class="bk-fl">Materia <b>· obligatoria</b></p><div class="bk-fr"><p class="bk-chip bk-sel">Lengua</p></div></div></div>'),
 ('<div class="bk-fr">' + INS_BK + '<p class="bk-chip">Alimentación saludable</p><p class="bk-chip">Hábitos de vida activa</p><p class="bk-sug">sugeridos por la IA</p></div>',
  '<div class="bk-fr"><p class="bk-chip">Comunicación oral</p><p class="bk-chip">Expresión</p><p class="bk-sug">elegidos del catálogo</p></div>'),
 ('<div class="bk-f"><div class="bk-fr">' + CB + '<p class="bk-fv2">Hecho con IA y revisado por mí</p></div><div class="bk-fr">' + CB + '<p class="bk-fv2">Sin fotos ni datos de alumnos</p></div><div class="bk-fr">' + CB + '<p class="bk-fv2">Es mío o puedo compartirlo</p></div></div>',
  '<div class="bk-f"><div class="bk-fr bs-two"><div class="bk-fr">' + CB + '<p class="bk-fv2">Sin fotos ni datos de alumnos</p></div><div class="bk-fr">' + CB + '<p class="bk-fv2">Es mío o puedo compartirlo</p></div></div></div>\n<div class="bk-f"><div class="bk-fr"><p class="bk-fl">Comprobado al subir:</p><p class="bk-chip bs-ok">' + OK(label='Comprobado') + 'Sin números de DNI</p><p class="bk-chip bs-ok">' + OK(label='Comprobado') + 'Sin © ni ISBN</p></div></div>'),
 ('<p class="bk-badge">Un compañero lo adaptó</p>', '<p class="bk-badge">Primer «Me ha servido»</p>'),
 ('<p class="bk-k">Reto del 2.º ciclo</p>', '<p class="bk-k">Reto del 3.er ciclo</p>'),
 notas('Al subir un recurso, el curso y la materia son obligatorios, y los contenidos se eligen del catálogo del colegio. En el ejemplo, una rúbrica de exposición oral de Lengua para 5.º y 6.º. Antes de compartir, el docente marca dos casillas: que no lleva fotos ni datos de alumnos y que puede compartirlo (nada de materiales de editoriales). Además, unas reglas revisan el archivo al subirlo y avisan si aparece un número de DNI, el símbolo © o un ISBN: no es IA, son reglas que buscan esos patrones. La gamificación reconoce lo que ayuda a los demás: cada docente ve en privado cuántas veces se han usado sus recursos y los «Me ha servido», tiene insignias informativas y comparte metas de equipo por ciclo o departamento, como responder a lo que los compañeros buscaron y no encontraron («Se busca»). No hay clasificaciones entre compañeros, y los datos de uso nunca sirven para evaluar al profesorado. Con Completo, además, la IA sugiere contenidos y, al subir, avisa si aparecen nombres o datos de salud: es el filtro que impide que entren en el banco. También adapta un recurso a otro curso.'),
])

# ======================= Parte 2 · Completo =======================
deriva('funciona-papel', 'funciona-papel-ia', [
 ('<section id="funciona-papel">', '<section id="funciona-papel-ia">'),
 ('<p class="eyebrow">Cómo funciona</p>', antetitulo('Completo · Cómo funciona', 'completo')),
 ('<p class="fn-line">DirectorIA saca qué hay que entregar,<br>quién y cuándo</p>', '<p class="fn-line">La IA saca qué hay que entregar,<br>quién y cuándo</p>'),
 ('<p class="fn-line">DirectorIA redacta el acta<br>con acuerdos, responsables y plazos</p>', '<p class="fn-line">La IA redacta el acta<br>con acuerdos, responsables y plazos</p>'),
 ('circular de la consejería: DirectorIA saca qué hay que entregar', 'circular de la consejería: la IA saca qué hay que entregar'),
 ('dictáis lo acordado y DirectorIA redacta el acta', 'dictáis lo acordado y la IA redacta el acta'),
 ('<aside>Dos ejemplos del papeleo de cada semana.', '<aside>Cómo funciona Completo, con dos ejemplos del papeleo de cada semana.'),
])

# Por qué una IA dentro del colegio: abre la parte 2 (antes estaba en la apertura, como si DirectorIA fuera solo una IA).
# Desde la decisión del 26-28 de noviembre de 2026, DirectorIA no guarda datos de alumnos: la diapositiva explica por qué no vale
# cualquier IA con los datos del colegio y con el correo. Lo legal, como lectura del equipo, no de un abogado.
deriva('datos-alumnos', 'datos-alumnos-ia', [
 ('<section id="datos-alumnos">', '<section id="datos-alumnos-ia">'),
 ('<p class="eyebrow">Antes de elegir una IA</p>', antetitulo('Completo · Antes de elegir una IA', 'completo')),
 ('<h2 class="title">Con datos de alumnos, no vale cualquier IA</h2>', '<h2 class="title">Con datos del colegio, no vale cualquier IA</h2>'),
 ('<h3 class="dal-h">Cuentas personales, sin datos de alumnos</h3>', '<h3 class="dal-h">Cuentas personales, sin datos personales</h3>'),
 ('re', r'<p>Con DirectorIA, la IA trata los datos de vuestros alumnos <b>en un servidor dentro del colegio</b>, y la copia de seguridad, cifrada, está en la.UE\.</p>',
  '<p>Con Completo, la IA trabaja <b>en un servidor dentro del colegio</b>, también con el correo. DirectorIA no guarda datos de alumnos: solo del profesorado y del funcionamiento del&nbsp;colegio.</p>'),
 ('<p class="dal-foot">RGPD,', '<p class="dal-foot">Nuestra lectura, no la de un abogado: RGPD,'),
 notas('Abre la parte de Completo: por qué no vale cualquier IA con los datos del colegio y con el correo. Presentarlo como nuestra lectura de la norma, no como la de un abogado: la última palabra la tiene su delegado de protección de datos. '
       'No decir que ChatGPT, Gemini o Copilot están prohibidos ni que la ley obliga a tratar los datos en la UE: es falso y su delegado lo rebatirá. '
       'Sus versiones de empresa o educativas sirven con datos personales si hay base jurídica para cada uso, contrato de encargo, evaluación de impacto, control de transferencias e información a las familias; una cuenta personal, aunque sea de pago, no. '
       f'Lo que tiene que quedar: {FRASE_ALUMNOS} Con Completo: {FRASE_CORREO} {CORREO_EXCEPCION} '
       'Por eso la evaluación de impacto sigue haciendo falta: damos un borrador, la revisa su delegado y la aprueba el colegio. '
       'La copia de seguridad, cifrada, está en un centro de datos de la UE: DirectorIA no saca del Espacio Económico Europeo los datos que guarda. '
       'Sobre Claude, que es un módulo opcional de Completo: solo sirve para material didáctico; no tiene acceso a los datos del colegio, un filtro está pensado para bloquear datos personales y la norma de uso es no introducirlos. '
       'Lo paga el colegio con su propia cuenta comercial de Anthropic. No citar multas a otros colegios.'),
])

deriva('banco-buscar', 'banco-buscar-ia', [
 ('<section id="banco-buscar">', '<section id="banco-buscar-ia">'),
 ('<p class="eyebrow">Ejemplo · Banco de recursos · 1/2</p>', antetitulo('Completo · Ejemplo · Banco de recursos', 'completo')),
 # «Entendido como» es texto que escribe la IA (reformula la petición): conserva la insignia, como en la demo.
])

# Lo que no hace: las dos primeras tarjetas valen igual para Esencial, y se dice en pantalla.
LIM_X = '<svg class="lim-x" width="56" height="56" viewBox="0 0 56 56" aria-label="No"><circle cx="28" cy="28" r="28" fill="#17322C"/><path d="M19 19L37 37M37 19L19 37" stroke="#F6F3EC" stroke-width="5" stroke-linecap="round"/></svg>'
TAMBIEN = '<p class="vs-tag lim-tag">También en Esencial</p>'
def lim_tambien(h3):
    a = LIM_X + f'<h3 class="lim-h">{h3}</h3>'
    # Las dos últimas palabras, juntas: sin palabra sola en la última línea
    h3b = re.sub(r' (\S+)$', '\u00a0\\1', h3)
    return (a, f'<div class="lim-top">{LIM_X}{TAMBIEN}</div><h3 class="lim-h">{h3b}</h3>')
deriva('limites', 'limites-ia', [
 ('<section id="limites" class="alt">', '<section id="limites-ia" class="alt">'),
 ('<p class="eyebrow">Por diseño</p>', antetitulo('Completo · Por diseño', 'completo')),
 lim_tambien('No evalúa, puntúa ni clasifica a ningún alumno'),
 lim_tambien('No decide nada por su cuenta'),
 # Dos líneas, como las otras dos tarjetas (el título ya dice de quién se habla)
 ('<p class="lim-p">DirectorIA propone; decide y firma una persona.</p>', '<p class="lim-p">Propone; decide y firma una persona.</p>'),
 # La tercera, la de Completo: la IA no lee los justificantes del profesorado (antes: «No trata con IA los datos de los alumnos
 # fuera del colegio», que ya no vale porque DirectorIA no guarda datos de alumnos).
 ('<h3 class="lim-h">No trata con IA los datos de los alumnos fuera del colegio</h3>', '<h3 class="lim-h">No lee los justificantes del&nbsp;profesorado</h3>'),
 ('re', r'<img class="lim-ill" src="[^"]+" alt="Colegio con el servidor de DirectorIA dentro" width="144" height="144"><p class="lim-p">La IA trabaja en el servidor del centro\.</p>',
  f'<img class="lim-ill" src="{B("circular")}" alt="Justificante con sello, archivado" width="144" height="144"><p class="lim-p">Un programa los archiva en carpetas.</p>'),
 notas('Los directores suelen preguntar por esto antes que por las funciones. Decirlo claro les quita el miedo. Arriba, lo que DirectorIA no hace; abajo, quién lo hace: el docente evalúa y una persona del equipo decide y firma. '
       'Las dos primeras valen igual para Esencial, y por eso llevan «También en Esencial»; la tercera es de Completo, porque Esencial no usa IA. '
       'Los justificantes del profesorado los sube cada docente desde DirectorIA, y un programa, con reglas, los renombra y los archiva en su carpeta. Ningún programa lee su contenido, y la IA no tiene acceso a esa carpeta: no la busca, no la resume y el asistente no la usa. '
       f'La frase: {FRASE_JUSTIFICANTES} Y si preguntan por los datos: {FRASE_ALUMNOS} Con Completo: {FRASE_CORREO} La copia de seguridad, cifrada, está en la UE; los correos salen por la cuenta del propio colegio, y el mantenimiento a distancia queda registrado. '
       'Sobre el Reglamento de IA: evaluar o clasificar alumnos sería un uso de alto riesgo, y por eso el producto no lo hace. Es nuestra lectura del Reglamento, no la de un abogado.'),
])

# ======================= Cierre =======================
deriva('marcha', 'marcha-dos', [
 ('<section id="marcha">', '<section id="marcha-dos">'),
 ('re', r'<img class="mch-ill" src="[^"]+" alt="Informe de gastos" width="192" height="192">', f'<img class="mch-ill" src="{B("documento")}" alt="Informe de gastos" width="192" height="192">'),
 ('re', r'<img class="mch-ill" src="[^"]+" alt="Servidor de DirectorIA" width="192" height="192">', servidor_sin_chispa('mch-ill', 'Servidor de DirectorIA, ya montado', 192)),
 # Paso 1 en tres líneas, como los otros tres (el texto de la original ocupa cinco)
 ('re', r'<p class="mch-p">45 minutos con una mañana de ejemplo, sin datos reales: una sustitución, su ficha y.un.acta\.</p>',
  '<p class="mch-p">45 minutos con datos de ejemplo: una sustitución, su ficha y\u00a0un\u00a0acta.</p>'),
 # «Equipos», en plural: con Completo son dos (servidor de datos y servidor de IA). Tres líneas, como el resto.
 ('re', r'<p class="mch-p">Servidor ya montado\. (Cargamos los datos y.creamos los usuarios\.)</p>', '<p class="mch-p">Equipos ya montados. Cargamos los datos y creamos los usuarios.</p>'),
 ('re', r'<p class="mch-p">6.horas de formación al.claustro y soporte en.horario lectivo\.</p>', '<p class="mch-p">Formación al claustro, de 4 o 6\u00a0horas, y soporte en\u00a0horario lectivo.</p>'),
 ('La oferta de colegio pionero es solo para el primer colegio.', 'La oferta de colegio pionero es solo para el primer colegio, con Completo y a partir de 41 docentes: es la diapositiva siguiente. La formación es de 4 horas con Esencial y de 6 con Completo, que suma la alfabetización en IA.'),
 ('así que conviene decidir en primavera.', 'así que conviene decidir en primavera. Los equipos llegan ya montados: el servidor de datos y, con Completo, también el servidor de IA.'),
])

# Pionero: solo con Completo, en Centro o Grande (planes del 26 de noviembre de 2026, «6. El colegio pionero»).
deriva('piloto', 'piloto-dos', [
 ('<section id="piloto" class="accent statement">', '<section id="piloto-dos" class="accent statement">'),
 ('<p class="eyebrow">Solo para el primer colegio</p>', '<p class="eyebrow">Solo para el primer colegio · con Completo, desde 41 docentes</p>'),
 ('<p class="big">Servidor e instalación, gratis</p>', '<p class="big">Equipos e instalación, gratis</p>'),
 ('hasta completarlo el servidor sigue siendo nuestro.', 'hasta completarlo los equipos siguen siendo nuestros.'),
 ('re', r'Al completar ese año, el.servidor pasa a ser vuestro\.', 'Al completar ese año, los equipos pasan a ser vuestros.'),
 notas('Solo con Completo y en un colegio de más de 40 docentes, porque lo que hay que demostrar es el tiempo que ahorra la IA: al menos dos horas a la semana por docente. Dice «equipos» porque son varios: el servidor de datos, el de IA y el disco de copias. Equipos e instalación gratis, los dos primeros meses gratis y la suscripción desde el tercero, con un año de compromiso contado desde ahí. Es una oferta única para el primer colegio. A cambio: poder enseñarlo a otros colegios, usar su nombre como referencia y medir juntos el tiempo y el dinero que ahorra. Los equipos pasan a ser del colegio al empezar el segundo año de suscripción; si se van al acabar el primero, nos los llevamos o los compran por un valor pactado de antemano. Si se van en los dos primeros meses, antes de llevárnoslos les devolvemos sus datos y borramos los discos en el propio colegio y la copia de seguridad de la UE, con certificado de borrado. A un colegio que solo quiere Esencial no se le ofrece esta diapositiva: se habla aparte.'),
])
