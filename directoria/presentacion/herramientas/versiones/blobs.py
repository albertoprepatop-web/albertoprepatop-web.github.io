# Después de subir al artifact de Slides las ilustraciones pendientes, apunta sus /_blob/ en este mazo.
#   python3 tools/blobs.py direccion=<id> ficha=<id> calendario=<id> alerta=<id> documento=<id>
# Cambia ilustraciones.json (lo que usan las diapositivas nuevas), blob-map.json (para renderizar) y
# comprobacion/blob-origen.json (para comparar lo publicado con el kit). Después:
#   1. guardar en comprobacion/assets-publicados.txt el listado nuevo (Artifact list, scope «assets»), con su sha256;
#   2. bash tools/construir.sh   (sin --permitir-pendientes: tiene que acabar sin errores).
# Son los mismos nombres que usa el repositorio (presentacion/herramientas/pendientes.json): con los mismos ids,
# «node blobs.mjs presentacion direccion=<id> …» deja las originales igual, sin volver a subir nada.
import json, os, re, sys
AQUI = os.path.dirname(os.path.abspath(__file__))
MAZO = os.path.dirname(AQUI)
KIT = '/home/user/albertoprepatop-web.github.io/directoria/ilustraciones'
pares = []
for a in sys.argv[1:]:
    m = re.fullmatch(r'([a-z0-9-]+)=(?:/_blob/)?([0-9a-f]{32})', a)
    if not m: raise SystemExit(f'«{a}»: se espera nombre=<id de 32 cifras hexadecimales>')
    pares.append((m.group(1), '/_blob/' + m.group(2)))
if not pares: raise SystemExit(__doc__ if __doc__ else 'Uso: python3 tools/blobs.py nombre=<id> …')
f_ilus = os.path.join(MAZO, 'ilustraciones.json'); ilus = json.load(open(f_ilus))
f_map = os.path.join(MAZO, 'blob-map.json'); mapa = json.load(open(f_map))
f_ori = os.path.join(MAZO, 'comprobacion/blob-origen.json'); origen = json.load(open(f_ori))
for nombre, blob in pares:
    if nombre not in ilus['blobs']: raise SystemExit(f'«{nombre}» no está en ilustraciones.json')
    kit = os.path.join(KIT, nombre + '.svg')
    if not os.path.exists(kit): raise SystemExit(f'no existe {kit}')
    ilus['blobs'][nombre] = blob
    mapa[blob] = kit
    origen[blob] = kit
    print(f'{nombre}: {blob}')
json.dump(ilus, open(f_ilus, 'w'), ensure_ascii=False, indent=1)
json.dump(mapa, open(f_map, 'w'), ensure_ascii=False, indent=1)
json.dump(origen, open(f_ori, 'w'), ensure_ascii=False, indent=1)
print('Ahora: listado nuevo en comprobacion/assets-publicados.txt y bash tools/construir.sh')
