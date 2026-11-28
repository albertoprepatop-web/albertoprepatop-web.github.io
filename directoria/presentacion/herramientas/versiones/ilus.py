# Piezas comunes de las diapositivas nuevas: qué /_blob/ tiene cada ilustración, la etiqueta de versión del antetítulo,
# las marcas (insignia de la IA, visto, «con IA») y el servidor sin la chispa.
#
#   python3 tools/ilus.py <carpeta-del-mazo>
#       Cambia, en las diapositivas nuevas del orden (nunca en las originales del repositorio), los /_blob/ antiguos
#       de las ilustraciones que se corrigieron (dirección, ficha, calendario y aviso, publicados aún con la chispa)
#       y los /_blob/pendiente-<nombre> por lo que diga ilustraciones.json.
import json, os, re, sys

AQUI = os.path.dirname(os.path.abspath(__file__))
MAZO = os.path.dirname(AQUI)
KIT = '/home/user/albertoprepatop-web.github.io/directoria/ilustraciones'

_ilus = json.load(open(os.path.join(MAZO, 'ilustraciones.json')))['blobs']
def B(nombre):
    return _ilus[nombre]

# Publicados el 24 de noviembre con la chispa de la IA; el kit ya no la lleva (commit 9561403). No se citan más.
ANTIGUOS = {
    '/_blob/ef4254e4611d5f545c2fa766ea6c906d': 'direccion',
    '/_blob/da775a64000fc3ca228fba6f940cac3c': 'ficha',
    '/_blob/1cde5a3c3f9bd183eb638b2577a15c1d': 'calendario',
    '/_blob/10a99e9e48d59743807a7696ae0acad4': 'alerta',
}

# Marcas. La insignia (chispa sobre pizarra) solo va en lo que escribe la IA; la etiqueta «con IA», en lo que la IA
# busca, lee o detecta sin escribir; el visto salvia, en lo que está incluido y sale de las reglas del colegio.
def INS(cls='vs-ins', label='Lo escribe la IA'):
    return f'<svg class="{cls}" viewBox="0 0 24 24" role="img" aria-label="{label}"><circle cx="12" cy="12" r="12" fill="#17322C"/><path d="M12 4.2 14.6 12 12 19.8 9.4 12z" fill="#E07A3A"/></svg>'
def OK(cls='vs-ok', label='Incluido'):
    return f'<svg class="{cls}" viewBox="0 0 24 24" role="img" aria-label="{label}"><circle cx="12" cy="12" r="12" fill="#C9DAD4"/><path d="M6.6 12.3l3.5 3.5 7.3-7.4" fill="none" stroke="#17322C" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>'
NO = '<span class="vs-no" role="img" aria-label="No incluido"></span>'
CON_IA = '<span class="vs-tag ia">con IA</span>'

# Ficha de sustitución (decisión del 26-28 de noviembre de 2026): solo la clase. Esta línea es fija, igual en todas las fichas,
# y no es un dato: la ficha no lleva «Necesidades», «Salud» ni «Recogida», ni nombres de alumnos.
FICHA_LINEA_FIJA = ('Las indicaciones de salud y de recogida de los alumnos no están en DirectorIA: las tiene el colegio. '
                    'Pregúntalas en conserjería o a la tutora antes de empezar.')

# Antetítulo con la etiqueta de la versión: «sin IA» clara en Esencial, «con IA» oscura en Completo.
def antetitulo(texto, version):
    tag = '<span class="vs-tag">sin IA</span>' if version == 'esencial' else '<span class="vs-tag ia">con IA</span>'
    return f'<p class="eyebrow vs-eb">{texto} {tag}</p>'

# El servidor del kit sin la chispa: es el servidor de datos, donde no actúa la IA. Mismo dibujo, sin la luz.
def servidor_sin_chispa(cls, label, size):
    s = open(os.path.join(KIT, 'servidor.svg')).read()
    chispa = re.findall(r'<path fill="#E07A3A"[^>]*/>', s)
    if len(chispa) != 1:
        raise SystemExit('servidor.svg ha cambiado: no encuentro una sola chispa')
    s = s.replace(chispa[0], '')
    if '#E07A3A' in s:
        raise SystemExit('servidor.svg sin chispa aún lleva naranja')
    s = re.sub(r'<title>.*?</title>', '', s)
    s = s.replace('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="240" height="240">',
                  f'<svg class="{cls}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="{size}" height="{size}" role="img" aria-label="{label}">')
    if f'aria-label="{label}"' not in s:
        raise SystemExit('servidor.svg ha cambiado: no encuentro la etiqueta <svg>')
    return s

def originales():
    return set(open(os.path.join(AQUI, 'originales.txt')).read().split())

def aplicar(mazo):
    orden = json.load(open(os.path.join(mazo, 'project/deck.json')))['order']
    orig = originales()
    for i in orden:
        if i in orig:
            continue
        f = os.path.join(mazo, 'project/slides', i + '.html')
        s = open(f).read(); t = s
        for viejo, n in ANTIGUOS.items():
            t = t.replace(viejo, B(n))
        t = re.sub(r'/_blob/pendiente-([a-z0-9-]+)', lambda m: B(m.group(1)), t)
        if t != s:
            open(f, 'w').write(t); print('ilustraciones al día:', i)

if __name__ == '__main__':
    aplicar(sys.argv[1] if len(sys.argv) > 1 else MAZO)
