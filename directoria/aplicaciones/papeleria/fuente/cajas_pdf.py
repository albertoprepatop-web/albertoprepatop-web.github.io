"""Ajusta las cajas de un PDF de imprenta y le pone metadatos.

Chromium redondea el tamaño de página a fracciones de píxel (91 × 61 mm sale como
258 × 173,04 pt). Este script recorta la MediaBox a la medida exacta, desde la esquina
superior izquierda, que es donde empieza el diseño, y añade TrimBox (corte) y BleedBox
(sangrado), que es lo que leen las imprentas.

Uso:
  python3 cajas_pdf.py entrada.pdf salida.pdf --ancho 91 --alto 61 --sangrado 3 --titulo "..."
  python3 cajas_pdf.py entrada.pdf salida.pdf --ancho 210 --alto 297 --titulo "..."   (sin sangrado)
"""
import argparse

from pypdf import PdfReader, PdfWriter
from pypdf.generic import RectangleObject

MM = 72 / 25.4

a = argparse.ArgumentParser()
a.add_argument('entrada')
a.add_argument('salida')
a.add_argument('--ancho', type=float, required=True, help='ancho de página en mm (con sangrado)')
a.add_argument('--alto', type=float, required=True, help='alto de página en mm (con sangrado)')
a.add_argument('--sangrado', type=float, default=0, help='sangrado por cada lado, en mm')
a.add_argument('--titulo', default='')
a.add_argument('--asunto', default='')
args = a.parse_args()

w, h, b = args.ancho * MM, args.alto * MM, args.sangrado * MM
reader = PdfReader(args.entrada)
writer = PdfWriter()
for page in reader.pages:
    top = float(page.mediabox.top)
    left = float(page.mediabox.left)
    media = RectangleObject([left, top - h, left + w, top])
    page.mediabox = media
    page.cropbox = media
    page.bleedbox = media
    page.trimbox = RectangleObject([left + b, top - h + b, left + w - b, top - b])
    writer.add_page(page)
meta = {'/Author': 'DirectorIA', '/Creator': 'DirectorIA · papelería (HTML + Chromium)'}
if args.titulo:
    meta['/Title'] = args.titulo
if args.asunto:
    meta['/Subject'] = args.asunto
writer.add_metadata(meta)
writer.page_mode = '/UseNone'
with open(args.salida, 'wb') as f:
    writer.write(f)
print('OK', args.salida)
