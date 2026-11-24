#!/usr/bin/env bash
# Regenera toda la papelería de DirectorIA en la carpeta de arriba (aplicaciones/papeleria/).
#
# Necesita:
#   - Node 18 o posterior con Playwright y su Chromium:  npm install && npx playwright install chromium
#   - Python 3 con python-docx y pypdf:                   pip install python-docx pypdf
#   - poppler-utils (pdftoppm) e ImageMagick (convert)
#
# Uso, desde esta carpeta:  bash construir.sh
set -euo pipefail
cd "$(dirname "$0")"
OUT=..
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

# 1. Tarjeta de visita: 91 × 61 mm (85 × 55 al corte + 3 mm de sangrado), dos páginas
node render.mjs tarjeta.html "$TMP/tarjeta.pdf"
python3 cajas_pdf.py "$TMP/tarjeta.pdf" "$OUT/tarjeta.pdf" --ancho 91 --alto 61 --sangrado 3 \
  --titulo "DirectorIA · Tarjeta de visita" \
  --asunto "85 × 55 mm al corte, 3 mm de sangrado por cada lado (91 × 61 mm)"
# Vistas previas recortadas al corte y a 2x (85 mm a 192 ppp = 643 × 416 px), sacadas del propio PDF
pdftoppm -png -r 768 "$OUT/tarjeta.pdf" "$TMP/tj"
convert "$TMP/tj-1.png" -crop 2571x1663+91+91 +repage -filter Lanczos -resize '643x416!' -strip "$OUT/tarjeta-anverso.png"
convert "$TMP/tj-2.png" -crop 2571x1663+91+91 +repage -filter Lanczos -resize '643x416!' -strip "$OUT/tarjeta-reverso.png"

# 2. Firma de correo: vista previa con el logotipo local y sin Nunito Sans (en Arial, como la verá la mayoría)
LOGO_FIRMA="$(cd ../../../logo/png && pwd)/logotipo-firma-2x.png"
sed -e "s#https://\[dominio.es\]/directoria/logo/png/logotipo-firma-2x.png#file://$LOGO_FIRMA#" \
    -e "s#'Nunito Sans', ##g" "$OUT/firma-correo.html" > "$TMP/firma.html"
node render.mjs "$TMP/firma.html" "$TMP/firma.png" --width 520 --height 300 --scale 2 --full
convert "$TMP/firma.png" -trim +repage -bordercolor "#FFFFFF" -border 48 -strip "$OUT/firma-correo.png"

# 3. Membrete (Word y PDF) y propuesta comercial (Word)
python3 generar_docx.py
node render.mjs membrete.html "$TMP/membrete.pdf"
python3 cajas_pdf.py "$TMP/membrete.pdf" "$OUT/membrete.pdf" --ancho 210 --alto 297 \
  --titulo "DirectorIA · Membrete" --asunto "Carta con membrete de DirectorIA (A4)"
pdftoppm -png -r 150 -singlefile "$OUT/membrete.pdf" "$TMP/membrete"
convert "$TMP/membrete.png" -strip "$OUT/membrete.png"

# 4. Hoja comercial: A4, dos páginas
node render.mjs hoja-comercial.html "$TMP/hoja.pdf"
python3 cajas_pdf.py "$TMP/hoja.pdf" "$OUT/hoja-comercial.pdf" --ancho 210 --alto 297 \
  --titulo "DirectorIA · Hoja comercial" \
  --asunto "Qué es DirectorIA, qué cambia para cada cargo, privacidad, cómo empezamos y precios (A4, 2 páginas)"
pdftoppm -png -r 150 "$OUT/hoja-comercial.pdf" "$TMP/hc"
convert "$TMP/hc-1.png" -strip "$OUT/hoja-comercial-1.png"
convert "$TMP/hc-2.png" -strip "$OUT/hoja-comercial-2.png"

echo "Listo. Revisad las vistas previas antes de enviar nada a imprenta."
