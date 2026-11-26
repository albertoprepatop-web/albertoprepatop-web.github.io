# Crea analista-esencial.html a partir de analista.html (original del repositorio, sin tocarla): sin IA, cuatro salidas.
# Uso: python3 tools/gen_analista_esencial.py project/slides
import sys, os, re
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from conectores import flecha, borde, halo
from ilus import B, antetitulo
D = sys.argv[1]
s = open(os.path.join(D, 'analista.html')).read()
HX, HY, HR = 832, 328, 132.7
svg = [halo(HX, HY, HR)]
for y in (216, 328, 440):
    ex, ey = borde(HX, HY, HR + 10, 445.6, y); svg.append(flecha(445.6, y, ex, ey))
for y in (160, 272, 384, 496):
    sx, sy = borde(HX, HY, HR + 10, 1138.4, y); svg.append(flecha(sx, sy, 1138.4, y))
nuevo_svg = '<svg class="fn-svg" width="1664" height="600" viewBox="0 0 1664 600" aria-hidden="true">' + ''.join(svg) + '</svg>'
cambios = [
 ('<section id="analista">', '<section id="analista-esencial">'),
 ('<p class="eyebrow">El analista de gastos</p>', antetitulo('Esencial · El analista de gastos', 'esencial')),
 ('<p class="anl-lab anl-lab-out">Os devuelve</p>', '<p class="anl-lab ane-lab-out">Os devuelve</p>'),
 ('<h3 class="fn-name">Facturas</h3><p class="fn-line">En PDF, en foto o por correo</p>', '<h3 class="fn-name">Facturas</h3><p class="fn-line">Las electrónicas, como llegan</p>'),
 ('re', r'<img class="anl-hero" src="[^"]+" alt="Servidor de DirectorIA" width="260" height="260">', f'<img class="anl-hero" src="{B("colegio")}" alt="El colegio, con el servidor de DirectorIA dentro" width="260" height="260">'),
 # Informe mensual: la hoja del kit sin insignia (documento), la del análisis y el informe de gastos
 ('re', r'<div class="anl-node anl-out anl-o1"><img class="anl-ill" src="[^"]+" alt="[^"]*" width="96" height="96">', f'<div class="anl-node anl-out ane-o1"><img class="anl-ill" src="{B("documento")}" alt="Informe de gastos" width="96" height="96">'),
 ('<div class="anl-node anl-out anl-o2">', '<div class="anl-node anl-out ane-o2">'),
 ('<div class="anl-node anl-out anl-o3">', '<div class="anl-node anl-out ane-o3">'),
 ('<div class="anl-node anl-out anl-o4">', '<div class="anl-node anl-out ane-o4">'),
]
for c in cambios:
    if c[0] == 're':
        m = re.findall(c[1], s)
        if len(m) != 1: raise SystemExit('no encaja: ' + c[1][:70])
        s = re.sub(c[1], lambda _m: c[2], s)
    else:
        a, b = c
        if s.count(a) != 1: raise SystemExit('no encaja: ' + a[:70])
        s = s.replace(a, b)
# Fuera «Cobros y ayudas» (no está en la lista de funciones de Esencial)
m = re.search(r'<div class="anl-node anl-out anl-o5">.*?</div></div>\n', s)
if not m: raise SystemExit('no encuentro anl-o5')
s = s.replace(m.group(0), '')
# Conectores recalculados para cuatro salidas
m = re.search(r'<svg class="fn-svg".*?</svg>', s, re.S)
s = s.replace(m.group(0), nuevo_svg)
# Notas
m = re.search(r'<aside>.*?</aside>', s, re.S)
s = s.replace(m.group(0), '<aside>El analista de gastos de Esencial trabaja todo el año, sin IA. A la izquierda, lo que le pasa secretaría: las facturas electrónicas, tal como llegan del proveedor, los contratos con su fecha de renovación y los extractos del banco. En el centro, el servidor del colegio, donde se tratan, con acceso por cargo. A la derecha, lo que devuelve, con cálculos y reglas: el informe mensual por partidas para dirección y titularidad, dónde ahorrar con una estimación en cada caso, el aviso antes de cada renovación y los presupuestos comparados. Detenerse en las renovaciones: es difícil acordarse de cuándo vence cada contrato. Las nóminas y los datos de personas solo se ven agregados. No sustituye a la gestoría ni lleva la contabilidad oficial. Con Completo, además, la IA lee las facturas escaneadas o en foto.</aside>')
open(os.path.join(D, 'analista-esencial.html'), 'w').write(s)
print('ok analista-esencial')
