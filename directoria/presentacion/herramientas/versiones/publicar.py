# Escribe publicar.json: lo que hay que publicar en el artifact de la presentación, que es solo lo del orden (deck.json,
# deck.css y una diapositiva por cada id de deck.json). Las originales y las diapositivas fuera del orden no se publican:
# algunas aún llevan datos de alumnos o frases que ya no valen (decisión del 26-28 de noviembre de 2026).
# También dice qué archivos de versiones anteriores hay que quitar del artifact si siguen publicados (con null en `files`).
# Uso: python3 tools/publicar.py (lo llama construir.sh cuando comprobar.py no da errores)
import json, os
AQUI = os.path.dirname(os.path.abspath(__file__))
MAZO = os.path.dirname(AQUI)
orden = json.load(open(os.path.join(MAZO, 'project/deck.json')))['order']
archivos = ['project/deck.json', 'project/deck.css'] + [f'project/slides/{i}.html' for i in orden]
# Publicados en versiones anteriores y fuera del orden ahora: el caso de acoso abierto en DirectorIA, que ya no existe, y el
# dato con «los datos de vuestros alumnos» (ahora es dato-dos).
QUITAR = ['project/slides/acoso-caso-esencial.html', 'project/slides/acoso-documento-esencial.html',
          'project/slides/acoso-plan-esencial.html', 'project/slides/dato.html']
quitar = [q for q in QUITAR if q not in archivos]
json.dump({'publicar': archivos, 'quitar_si_siguen_publicados': quitar},
          open(os.path.join(MAZO, 'publicar.json'), 'w'), ensure_ascii=False, indent=1)
print(f'publicar.json: {len(archivos)} archivos del orden; {len(quitar)} para quitar si siguen publicados')
