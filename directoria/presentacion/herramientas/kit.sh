#!/usr/bin/env bash
# Rehace directoria/ilustraciones/kit.png: cada SVG dibujado a 240 px (fondo transparente) y todos en una hoja
# de 5 columnas sobre tiza, con el nombre del archivo. El orden es el de ilustraciones/LEEME.md.
# Necesita Node 18+ y Playwright con Chromium (ver LEEME.md de esta carpeta).
# Uso, desde cualquier carpeta:  bash kit.sh [salida.png]   (por defecto, ilustraciones/kit.png)
set -euo pipefail
AQUI="$(cd "$(dirname "$0")" && pwd)"
ILU="$(cd "$AQUI/../../ilustraciones" && pwd)"
SALIDA="${1:-$ILU/kit.png}"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
ORDEN=(servidor colegio colegio-servidor nube-claude
       direccion jefatura secretaria docente orientacion sustituto familia
       documento-ia documento circular acta ficha correo calendario candado microfono reloj alerta)
ARGS=()
for n in "${ORDEN[@]}"; do
  node "$AQUI/render.mjs" "$ILU/$n.svg" "$TMP/$n.png" --width 240 > /dev/null
  ARGS+=(--label "$n.svg" "$TMP/$n.png")
done
node "$AQUI/render.mjs" --sheet "$SALIDA" --cols 5 --cell 300 --bg "#F6F3EC" "${ARGS[@]}"
