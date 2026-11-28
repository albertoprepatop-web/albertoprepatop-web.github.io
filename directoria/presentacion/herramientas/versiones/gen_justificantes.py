# Genera justificantes-esencial: los justificantes del profesorado, en las dos versiones (decisión del 26-28 de noviembre de 2026).
# Cada docente sube su justificante (médico o de cualquier tipo) desde DirectorIA y elige la ausencia a la que corresponde.
# Un programa, con reglas y sin IA, lo renombra y lo archiva en su carpeta: Justificantes / curso / mes / docente.
# Ningún programa lee su contenido. En el registro de ausencias solo pone «Justificante: entregado» o «pendiente», nunca el motivo.
# Solo lo ven el propio docente y quien lleva el personal (secretaría o dirección), con registro de accesos, y se borra cuando
# pasa el plazo que fije el colegio. Sigue el ejemplo de las guardias: Sergio Prieto, que faltó el miércoles 18 de noviembre.
# Es su única ausencia del curso, como en la demo (informe de jefatura y carpetas de secretaría): no se inventan otras.
# Uso: python3 tools/gen_justificantes.py project/slides
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from ilus import B, antetitulo
D = sys.argv[1]

DOTS = '<div class="ac-dots"><span class="ac-dot"></span><span class="ac-dot"></span><span class="ac-dot"></span></div>'
# Carpeta y archivo, con los colores de la marca (sin el naranja de la IA: es la parte de Esencial)
CARPETA = ('<svg class="js-ic" viewBox="0 0 28 24" aria-hidden="true"><path d="M2 5.5A2.5 2.5 0 0 1 4.5 3h6.2l2.6 2.6h10.2A2.5 2.5 0 0 1 26 8.1v11.4A2.5 2.5 0 0 1 23.5 22h-19A2.5 2.5 0 0 1 2 19.5z" '
           'fill="#C9DAD4" stroke="#2E5A50" stroke-width="2" stroke-linejoin="round"/></svg>')
ARCHIVO = ('<svg class="js-ic" viewBox="0 0 28 24" aria-hidden="true"><path d="M7 1.5h9.5l5.5 5.5v14a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 6 21V3a1.5 1.5 0 0 1 1-1.5z" '
           'fill="#FFFDF8" stroke="#2E5A50" stroke-width="2" stroke-linejoin="round"/><path d="M16.5 1.5V7H22M10 12h8M10 16h8" fill="none" stroke="#2E5A50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>')
RUTA = [('Justificantes', CARPETA), ('2026-27', CARPETA), ('2026-11', CARPETA), ('Sergio Prieto', CARPETA), ('2026-11-18 justificante.pdf', ARCHIVO)]

def it(texto):
    return f'<div class="ac-it"><span class="ac-bul"></span><p>{texto}</p></div>'

arbol = '\n'.join(f'<div class="js-row js-l{i}{" js-new" if i == len(RUTA) - 1 else ""}">{ic}<p>{nombre}</p></div>' for i, (nombre, ic) in enumerate(RUTA))

HTML = f'''<section id="justificantes-esencial">
<img class="marca" src="{B('isotipo')}" alt="" width="56" height="56">
{antetitulo('Esencial · Ejemplo · Justificantes del profesorado', 'esencial')}
<h2 class="title ac-title">Cada justificante, a su carpeta</h2>
<div class="ac-win">
<div class="ac-bar">{DOTS}<p class="ac-wt">DirectorIA · Justificantes · Sergio Prieto</p><div class="ac-badge"><p>Solo lo ven él y secretaría</p></div></div>
<div class="ac-body">
<div class="js-side">
<div class="ac-bt"><p>Subir un justificante</p></div>
<p class="js-lab">¿De qué ausencia es?</p>
<div class="js-opt on"><span class="js-radio"></span><div><p class="js-o1">Miércoles 18 de noviembre</p><p class="js-o2">Toda la jornada · pendiente</p></div></div>
<p class="js-lab">Archivo</p>
<div class="js-file">{ARCHIVO}<p>escaneo-0412.pdf</p></div>
<p class="js-lab">Se guarda como</p>
<div class="js-file js-saved">{ARCHIVO}<p>2026-11-18 justificante.pdf</p></div>
<p class="js-btn">Subir el justificante</p>
<p class="js-foot">Se sube por DirectorIA, no por correo.</p>
</div>
<div class="ac-main">
<p class="ac-h">Lo que hace el programa al subirlo</p>
<p class="ac-sub">Con reglas fijas y sin leer lo que pone</p>
<div class="ac-grid">
<div class="js-col">
<div class="ac-blk"><div class="ac-bt"><p>Lo renombra y lo archiva en su carpeta</p></div>
<div class="js-tree">
{arbol}
</div>
</div>
<div class="ac-blk"><div class="ac-bt"><p>Lo apunta en el registro de ausencias</p></div>
<div class="js-reg"><p>Mié 18 de noviembre</p><p class="js-chip">Justificante: entregado</p></div>
</div>
</div>
<div class="ac-blk warn"><div class="ac-bt"><p>Reglas de la carpeta</p></div>
{it('Ni la IA ni ningún programa leen lo que&nbsp;pone')}
{it('Solo lo ven Sergio y secretaría, con registro de&nbsp;accesos')}
{it('En el registro, nunca el motivo de la&nbsp;ausencia')}
{it('Se borra cuando pasa el plazo que fija el&nbsp;colegio')}
</div>
</div>
</div>
</div>
</div>
<p class="ac-note"><span class="ac-lead">Un programa lo archiva con reglas, sin leer lo que pone.</span> En el registro solo consta «entregado» o «pendiente».</p>
<p class="ac-disc">Ejemplo ficticio: los nombres son inventados. El plazo de borrado lo fija cada colegio.</p>
<aside>Los justificantes del profesorado, en las dos versiones. Seguimos con el ejemplo de las guardias: Sergio Prieto, el tutor de 3.º B que faltó el miércoles 18, sube su justificante desde DirectorIA, sea médico o de cualquier tipo, y elige a qué ausencia corresponde; antes de subirlo, ya ve cómo se va a guardar. Un programa, con reglas y sin IA, lo renombra con la fecha de la ausencia y lo archiva en su carpeta: Justificantes, el curso, el mes y el docente; en el ejemplo, «Justificantes/2026-27/2026-11/Sergio Prieto/2026-11-18 justificante.pdf». Ningún programa lee su contenido: ni la IA ni ningún otro lo extrae. En el registro de ausencias solo pone «Justificante: entregado» o «pendiente», nunca el motivo; por eso en las guardias de esa mañana ponía «pendiente». Solo lo ven el propio docente y quien lleva el personal, secretaría o dirección, con registro de accesos, y se borra cuando pasa el plazo que fije el colegio. Se suben por DirectorIA, no por correo. Es el único dato de salud que guarda DirectorIA, y es del profesorado: guardado y ordenado, nunca leído. Con Completo es igual: la IA no tiene acceso a esa carpeta; no la busca, no la resume y el asistente no la usa. La frase: «Los justificantes los archiva un programa en su carpeta; la IA no los lee.»</aside>
</section>
'''
open(os.path.join(D, 'justificantes-esencial.html'), 'w').write(HTML)
print('ok justificantes-esencial')
