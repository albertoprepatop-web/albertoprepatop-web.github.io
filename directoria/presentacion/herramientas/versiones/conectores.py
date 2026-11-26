# Conectores con el lenguaje de «cómo funciona» de deck.css: trazo pizarra-línea de 3 px, punto de 5 en el origen
# y punta abierta (14 hacia atrás, 8,1 a cada lado) en el destino; halo salvia detrás del servidor.
import math
C = '#2E5A50'
def fmt(v): 
    s = f'{v:.1f}'
    return s[:-2] if s.endswith('.0') else s
def flecha(x1, y1, x2, y2, punto=True, discontinua=False):
    dx, dy = x2 - x1, y2 - y1
    L = math.hypot(dx, dy); ux, uy = dx / L, dy / L; px, py = -uy, ux
    a = (x2 - 14 * ux + 8.1 * px, y2 - 14 * uy + 8.1 * py)
    b = (x2 - 14 * ux - 8.1 * px, y2 - 14 * uy - 8.1 * py)
    dash = ' stroke-dasharray="12 11"' if discontinua else ''
    s = f'<path d="M{fmt(x1)} {fmt(y1)}L{fmt(x2)} {fmt(y2)}" fill="none" stroke="{C}" stroke-width="3" stroke-linecap="round"{dash}/>'
    if punto: s += f'<circle cx="{fmt(x1)}" cy="{fmt(y1)}" r="5" fill="{C}"/>'
    s += f'<path d="M{fmt(a[0])} {fmt(a[1])}L{fmt(x2)} {fmt(y2)}L{fmt(b[0])} {fmt(b[1])}" fill="none" stroke="{C}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>'
    return s
def borde(cx, cy, r, hacia_x, hacia_y):
    dx, dy = hacia_x - cx, hacia_y - cy; L = math.hypot(dx, dy)
    return cx + r * dx / L, cy + r * dy / L
def halo(cx, cy, r):
    return f'<circle cx="{fmt(cx)}" cy="{fmt(cy)}" r="{fmt(r)}" fill="#E7EEE9"/>'
