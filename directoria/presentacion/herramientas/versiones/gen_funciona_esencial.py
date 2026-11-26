import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from conectores import flecha, borde, halo, fmt
W, H = 1664, 560
HX, HY, HR = 832, 290, 126          # centro del servidor y halo
ENT = [210, 330, 450]                # centros de las entradas (y)
SAL = [132, 252, 372, 492]            # centros de las salidas (y)
XE = 470 + 5.6                       # borde derecho del icono de entrada + 5,6
XS = 1150 - 5.6                      # borde izquierdo del icono de salida − 5,6
svg = [halo(HX, HY, HR)]
for y in ENT:
    ex, ey = borde(HX, HY, HR + 10, XE, y)
    svg.append(flecha(XE, y, ex, ey))
for y in SAL:
    sx, sy = borde(HX, HY, HR + 10, XS, y)
    svg.append(flecha(sx, sy, XS, y))
print(f'<svg class="fn-svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" aria-hidden="true">' + ''.join(svg) + '</svg>')
