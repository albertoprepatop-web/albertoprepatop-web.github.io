# Herramientas de la presentación

Sirven para ver las diapositivas sin abrir claude.ai, rehacer las láminas de referencia y dejar apuntado lo que falta subir a la presentación y al sistema de diseño publicados en claude.ai.

| Archivo | Para qué |
|---|---|
| `vista-previa.mjs` | Vista previa de una diapositiva o de todas en una hoja (`../vista-general.png`). |
| `render.mjs` | SVG o HTML a PNG, HTML a PDF y hojas de contactos. Lo usa `kit.sh`. |
| `kit.sh` | Rehace `../../ilustraciones/kit.png`. |
| `blob-map.json` | Qué archivo del repositorio es cada imagen que citan las diapositivas (`/_blob/<id>`). Las rutas son relativas a `directoria/`. |
| `blobs.mjs` · `pendientes.json` | Lo que falta subir a los dos artifacts y cómo apuntarlo después (ver «Publicar en claude.ai»). |
| `package.json` | Playwright 1.63.0. |

Necesitan Node 18 o superior y Playwright con Chromium: `npm install` y `npx playwright install chromium` en esta carpeta, o Playwright instalado de forma global.

## Cómo se usan

Desde esta carpeta:

- **Una diapositiva:** `node vista-previa.mjs .. funciona-datos /tmp/funciona-datos.png` (a media escala; `--scale 1` para 1920 × 1080). Avisa si algo se sale del área segura.
- **Todas, en el orden de `deck.json`:** `node vista-previa.mjs .. --all ../vista-general.png --scale 0.2` (1184 px de ancho, tres columnas).
- **La hoja de las ilustraciones:** `bash kit.sh`.

La vista previa es aproximada: los elementos propios de Slides (`<x-icon>`, `<x-shape>`) salen como cajas vacías. Si una imagen sale en blanco, es que su `/_blob/<id>` no está en `blob-map.json`: el aviso lo dice.

## Publicar en claude.ai

La presentación (https://claude.ai/artifact/9x2eLc8Y7yPi2XKvhJwiFN) y el sistema de diseño (https://claude.ai/artifact/FF3BxQXTHnNnQjXp86JjUd) citan sus imágenes como `/_blob/<id>`, la dirección que da el artifact al subir cada archivo. Cuando una ilustración cambia o es nueva, el repositorio la cita como `/_blob/pendiente-<nombre>` hasta que alguien la sube: la vista previa y el manual la muestran con el archivo local, pero el artifact todavía no la tiene.

1. **Ver qué falta:** `node blobs.mjs pendientes`.
2. **Subir cada archivo** como recurso del artifact que toca (Artifact `publish` con `asset: true` y la `url` de ese artifact). La respuesta da su `/_blob/<id>`. Las ilustraciones se suben tal cual salen de `generar.mjs`.
3. **Apuntarlo:**
   - presentación: `node blobs.mjs presentacion ficha=/_blob/<id> documento=/_blob/<id> …`;
   - sistema de diseño: `node blobs.mjs sistema ficha.svg=<id> documento.svg=<id> kit.png=<id> …` (pone `blob`, `size`, `type` y `lastChange` en `design-system.json`).
4. **Publicar los archivos cambiados**, cada artifact en una sola llamada:
   - presentación: `root` = `directoria/presentacion`, con `project/deck.css` y las diapositivas cambiadas por su ruta `project/slides/<id>.html`. `project/deck.json` solo si cambia el orden, el título o las secciones;
   - sistema de diseño: `root` = `directoria/manual/sistema`, con las rutas `project/…` cambiadas y `project/design-system.json` en la última llamada.
5. **Comprobar:** abrir los dos artifacts y mirar las diapositivas y las piezas que han cambiado. `node blobs.mjs pendientes` debe decir «Nada pendiente».

`inversion.html` sigue citando a propósito la ficha antigua (`pendientes.json`, «antiguos»): esa diapositiva lleva los precios y se publica con ellos. Cuando se publique, `node blobs.mjs presentacion ficha=<id de la ficha nueva> --antiguos` le pone la ficha nueva.

## La presentación en tres partes (26 de noviembre de 2026)

La presentación publicada tiene 35 diapositivas: apertura, parte 1 (DirectorIA Esencial, sin IA), parte 2 (DirectorIA Completo, con IA), parte 3 (comparativa, precios y condiciones), cierre y un anexo. Todos los estilos van en `project/deck.css`: el visor de Slides solo lee esa hoja, y una segunda hoja en `format.shared` no se carga (así salió mal la versión 21). Tampoco usa `grid-row: span`, `clip-path`, `text-wrap` ni reglas con `#id`: la tabla comparativa pone el cargo en la primera fila de cada grupo y las diapositivas con estilos propios llevan una clase en su `<section>`.

- **Las diapositivas de antes** (`cover`, `solucion`, `funciona-colegio`, `mejora`, `rol-*`, `ahorro`, `inversion`, `piloto`…) siguen en `project/slides/` porque de ellas salen las derivadas, pero ya no están en `deck.json` ni en la presentación publicada (se quitaron al publicar la versión 21). `ahorro` e `inversion` llevan precios antiguos: no las volváis a poner sin cambiarlos.
- **`versiones/`** guarda los generadores con los que se hicieron las nuevas: `derivar.py` (las que salen de una original), `gen_funciones.py`, `gen_cmp.py`, `gen_parte3.py` (paso a Completo, precios y condiciones; los precios están en `PRECIOS` y `COND`), `gen_analista_esencial.py`, `gen_funciona_esencial.py`, `ilus.py`, `comprobar.py`, `construir.sh` y `render.mjs`. Esperan una carpeta de trabajo con `project/` y, al lado, esta carpeta copiada como `tools/` (y `blob-map-versiones.json` copiado como `blob-map.json`). Allí: `bash tools/construir.sh`, mirar las capturas y copiar de vuelta las diapositivas cambiadas.
- **Precios:** los de los planes del 26 de noviembre de 2026, sin IVA y con IVA debajo. Si cambian, se cambian en `gen_parte3.py` y se regeneran `precios-versiones` y `condiciones-versiones`.
