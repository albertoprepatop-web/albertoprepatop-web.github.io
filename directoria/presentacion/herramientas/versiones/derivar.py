# Crea las diapositivas derivadas a partir de las originales del repositorio, sin tocarlas.
# Cada cambio tiene que aplicarse una sola vez: si la original cambia y un cambio ya no encaja, el script se para y avisa.
# Un cambio es (texto, texto nuevo) o ('re', patrón, texto nuevo); el patrón tiene que encontrarse una sola vez.
# Uso: python3 tools/derivar.py project/slides
import os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from ilus import B, OK, antetitulo, servidor_sin_chispa

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
 notas('Presentarse en una frase. El título es la segunda línea del eslogan, que vale para las dos versiones. La idea que tiene que quedar: DirectorIA organiza el colegio desde un servidor dentro del propio colegio; con Esencial, con las reglas y los datos del centro, y con Completo, además, con una IA propia que trata ahí los datos de los alumnos. Es para el equipo directivo y el claustro, no un chat más en la nube. Las guardias y las fichas las prepara DirectorIA con las reglas del colegio, sin IA, en las dos versiones; con Completo, la IA redacta actas y correos. DirectorIA prepara y propone; decidís vosotros. Contar cómo va la presentación: primero, todo lo de Esencial, sin IA; después, lo que añade Completo, con IA, y al final la comparativa y los precios.'),
])

# Privacidad, común a las dos versiones: va en la apertura, sin etiqueta de versión. El servidor, sin la chispa
# (el de datos, el mismo de paso-completo); el módulo de Claude, rotulado como solo de Completo.
deriva('funciona-datos', 'funciona-datos-dos', [
 ('<section id="funciona-datos">', '<section id="funciona-datos-dos">'),
 ('<p class="eyebrow">Privacidad</p>', '<p class="eyebrow">Las dos versiones · Privacidad</p>'),
 ('re', r'<img class="fn-ill" src="[^"]+" alt="Servidor de DirectorIA, dentro del colegio" width="160" height="160">',
  servidor_sin_chispa('fn-ill', 'Servidor de DirectorIA, dentro del colegio', 160)),
 ('<p class="fnd-at fnd-zt fn-line">Horarios, ausencias, salud, recogidas y actas:<br>en el servidor del colegio, cifrado<br>y con permisos por cargo</p>',
  '<p class="fnd-at fnd-zt fn-line">Horarios, ausencias, salud, recogidas y actas:<br>en el servidor del colegio, cifrado<br>y con permisos por cargo.<br><b>Con Completo, la IA también los trata aquí.</b></p>'),
 ('<h3 class="fn-name">Módulo de Claude (opcional)</h3><p class="fn-line">Solo peticiones de material didáctico,<br>con un filtro pensado para bloquear<br>datos personales</p>',
  '<h3 class="fn-name">Módulo de Claude (opcional)</h3><p class="fn-line fnd-solo"><b>Solo con Completo,</b> para material<br>didáctico y con un filtro pensado<br>para bloquear datos personales</p>'),
 ('<aside>Aquí se gana la confianza. La frase que hay que decir: «La IA trata los datos de los alumnos en un servidor dentro del colegio. La copia de seguridad, cifrada, está en la UE. Los correos salen por la cuenta del propio colegio. El mantenimiento a distancia queda registrado.» ',
  '<aside>Vale para las dos versiones; el módulo de Claude es solo de Completo, y opcional. Aquí se gana la confianza, así que va antes de entrar en cada versión. La frase que hay que decir: «La aplicación y los datos están en un servidor dentro del colegio. La copia de seguridad, cifrada, está en la UE. Los correos salen por la cuenta del propio colegio. El mantenimiento a distancia queda registrado.» Con Completo, añadir: «Y la IA trata los datos de los alumnos en un servidor dentro del colegio.» El servidor del dibujo no lleva la luz naranja porque es el de los datos, el mismo en las dos versiones; con Completo, el servidor de IA va a su lado, también dentro del colegio. '),
])

# ======================= Parte 1 · Esencial =======================
deriva('funciona-manana', 'funciona-manana-esencial', [
 ('<section id="funciona-manana">', '<section id="funciona-manana-esencial">'),
 ('<p class="eyebrow">Cómo funciona</p>', antetitulo('Esencial · Cómo funciona', 'esencial')),
 # Sin la chispa del servidor, que en el kit marca dónde actúa la IA
 ('re', r'<img class="fn-ill" src="[^"]+" alt="Servidor de DirectorIA" width="160" height="160">',
  f'<img class="fn-ill" src="{B("colegio")}" alt="El colegio, con el servidor de DirectorIA dentro" width="160" height="160">'),
])

deriva('ficha', 'ficha-esencial', [
 ('<section id="ficha" class="alt">', '<section id="ficha-esencial" class="alt">'),
 ('<p class="eyebrow">En detalle</p>', antetitulo('Esencial · En detalle', 'esencial')),
 ('</aside>', ' Es la ficha de Pablo Sanz, que cubre la 6.ª hora de 3.º B en el ejemplo anterior: el mismo caso que enseñamos en la demo.</aside>'),
])

# Protocolo de acoso: caso y documento en la parte 1; el plan, como anexo detrás del cierre. Sin menciones a Claude ni a la IA.
deriva('acoso-caso', 'acoso-caso-esencial', [
 ('<section id="acoso-caso">', '<section id="acoso-caso-esencial">'),
 ('<p class="eyebrow">Ejemplo · Protocolo contra el acoso escolar · 1/3</p>', antetitulo('Esencial · Ejemplo · Protocolo contra el acoso escolar · 1/2', 'esencial')),
 ('<p>Datos del caso en el servidor del colegio;<br>nada se envía a Claude</p>', '<p>Datos del caso en el servidor<br>del colegio, cifrados</p>'),
 ('<b>Pendiente</b> · Anexo II</p>', '<b>Pendiente</b> · Anexo II · 17–23 nov</p>'),
 ('<b>Pendiente</b> · Anexo III</p>', '<b>Pendiente</b> · Anexo III · mar 24 nov</p>'),
 ('</aside>', ' Al abrirlo, cada paso queda con fecha y responsable: la recogida de información, del martes 17 al lunes 23, y la reunión para decidir, el martes 24. La app avisa a cada persona antes de su plazo.</aside>'),
])
deriva('acoso-documento', 'acoso-documento-esencial', [
 ('<section id="acoso-documento">', '<section id="acoso-documento-esencial">'),
 ('<p class="eyebrow">Ejemplo · Protocolo contra el acoso escolar · 3/3</p>', antetitulo('Esencial · Ejemplo · Protocolo contra el acoso escolar · 2/2', 'esencial')),
 ('<p class="ac-sub">Caso 2026-07 · borrador de la app · lo revisa y firma la dirección</p>', '<p class="ac-sub">Caso 2026-07 · Preparado por DirectorIA · lo revisa y firma la dirección</p>'),
 ('<p>Versión traducida o en lectura fácil, si hace falta</p>', '<p>El resto, texto fijo de la plantilla</p>'),
 ('<div class="ac-it"><span class="ac-bul"></span><p>La prepara DirectorIA en el colegio;<br>nunca pasa por Claude</p></div>\n', ''),
 ('La app rellena lo que el colegio ya sabe (curso, contacto, fecha y sala del plan, quién atiende) y ofrece versión traducida o en lectura fácil.', 'La app rellena lo que el colegio ya sabe (curso, contacto, fecha y sala del plan, quién atiende); el resto es el texto fijo de la plantilla del protocolo.'),
 ('Insistir: la prepara DirectorIA con la plantilla del protocolo y los datos del colegio, sin IA; si hace falta traducirla o pasarla a lectura fácil, lo hace la IA del servidor del colegio. Claude, si se activa, solo crea material didáctico.', 'Insistir: la prepara DirectorIA con la plantilla del protocolo y los datos del colegio, sin IA. Con Completo, además, la IA puede pasarla a lectura fácil o traducirla, y la dirección la revisa igual antes de firmar.'),
])
deriva('acoso-plan', 'acoso-plan-esencial', [
 ('<section id="acoso-plan">', '<section id="acoso-plan-esencial">'),
 ('<p class="eyebrow">Ejemplo · Protocolo contra el acoso escolar · 2/3</p>', antetitulo('Anexo · Esencial · Protocolo contra el acoso escolar', 'esencial')),
 (' Los datos del caso están en el servidor del colegio y nunca van a Claude.</p>', '</p>'),
 ('<aside>', '<aside>Anexo: enseñarla solo si preguntan cómo sigue el caso después de abrirlo. '),
])

# Banco de recursos: subir sin IA. Otro recurso (Lengua, 3.er ciclo), para que no choque con la búsqueda de la parte 2.
deriva('banco-compartir', 'banco-subir-esencial', [
 ('<section id="banco-compartir">', '<section id="banco-subir-esencial">'),
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
 notas('Al subir un recurso, el curso y la materia son obligatorios, y los contenidos se eligen del catálogo del colegio. En el ejemplo, una rúbrica de exposición oral de Lengua para 5.º y 6.º. Antes de compartir, el docente marca dos casillas: que no lleva fotos ni datos de alumnos y que puede compartirlo (nada de materiales de editoriales). Además, unas reglas revisan el archivo al subirlo y avisan si aparece un número de DNI, el símbolo © o un ISBN: no es IA, son reglas que buscan esos patrones. La gamificación reconoce lo que ayuda a los demás: cada docente ve en privado cuántas veces se han usado sus recursos y los «Me ha servido», tiene insignias informativas y comparte metas de equipo por ciclo o departamento, como responder a lo que los compañeros buscaron y no encontraron («Se busca»). No hay clasificaciones entre compañeros, y los datos de uso nunca sirven para evaluar al profesorado. Con Completo, además, la IA sugiere contenidos, detecta nombres o datos de salud al subir y adapta un recurso a otro curso.'),
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
deriva('datos-alumnos', 'datos-alumnos-ia', [
 ('<section id="datos-alumnos">', '<section id="datos-alumnos-ia">'),
 ('<p class="eyebrow">Antes de elegir una IA</p>', antetitulo('Completo · Antes de elegir una IA', 'completo')),
 ('re', r'<p>Con DirectorIA, la IA trata los datos de vuestros alumnos <b>en un servidor dentro del colegio</b>, y la copia de seguridad, cifrada, está en la.UE\.</p>',
  '<p>Con Completo, la IA trata los datos de vuestros alumnos <b>en un servidor dentro del colegio</b>, y la copia de seguridad, cifrada, está en la&nbsp;UE.</p>'),
 ('<aside>No decir que', '<aside>Abre la parte de Completo: por qué la IA va dentro del colegio. No decir que'),
 ('Con DirectorIA, la IA trata los datos en el centro y', 'Con Completo, la IA trata los datos en el centro y'),
 ('Sobre Claude: es opcional y solo para material didáctico;', 'Sobre Claude, que es un módulo opcional de Completo: solo sirve para material didáctico;'),
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
 ('</aside>', ' Las dos primeras valen igual para Esencial, y por eso llevan «También en Esencial»; la tercera es de Completo, porque Esencial no usa IA.</aside>'),
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
