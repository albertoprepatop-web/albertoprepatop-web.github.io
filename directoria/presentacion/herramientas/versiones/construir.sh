#!/usr/bin/env bash
# Rehace todas las diapositivas generadas y derivadas a partir de las originales de project/slides.
# Antes de juntar con el repositorio: copiar otra vez las originales corregidas (las de tools/originales.txt) y deck.css,
# y volver a ejecutar esto. Si una original ha cambiado y un cambio ya no encaja, derivar.py se para y dice cuál.
set -euo pipefail
cd "$(dirname "$0")/.."
python3 tools/derivar.py project/slides
python3 tools/gen_analista_esencial.py project/slides
python3 tools/gen_funciones.py project/slides
python3 tools/gen_cmp.py project/slides
python3 tools/gen_parte3.py project/slides
python3 tools/gen_protocolo.py project/slides
python3 tools/gen_justificantes.py project/slides
python3 tools/ilus.py .
python3 -I tools/comprobar.py "$@"
# Solo si comprobar.py no da errores: la lista de lo que se publica (solo lo del orden) y lo que hay que quitar del artifact
python3 tools/publicar.py
