# Ilustraciones de DirectorIA

Veintidós ilustraciones planas para contar, desde la primera diapositiva, cómo funciona DirectorIA. Hay un servidor dentro del colegio y, a su alrededor, las personas que lo usan, lo que DirectorIA prepara para ellas y, aparte, la nube opcional. `kit.png` las reúne todas en una hoja.

## Cómo son

- **Un mismo disco para todas.** Cada ilustración va sobre un disco color linea (#D5DED9), con un lienzo de 240 × 240 y fondo transparente fuera del disco. Gracias al disco se leen igual sobre tiza, salvia, papel o pizarra, y las hojas blancas no se pierden sobre el fondo claro.
- **Formas planas y redondeadas.** No llevan degradados, sombras, texturas ni textos, y solo usan los colores de la paleta (`directoria/tokens.json`).
- **Personas.** Se ven de pecho para arriba y todas tienen las mismas medidas: cabeza, hombros, altura de los ojos. La cabeza y las manos van en papel (#FFFDF8), un tono que no imita ningún color de piel y es igual para todos. La ropa, el pelo y el hiyab van en los verdes oscuros de la paleta (pizarra, pizarra-2, pizarra-linea y texto). Cada persona lleva un solo objeto que dice a qué se dedica.
- **Radios de esquina.** Son siempre los mismos: 4 en las piezas pequeñas, 10 en hojas, tarjetas y pantallas, y 16 en los cuerpos grandes (servidor y candado).
- **El naranja es solo la chispa (la aguja, sobre pizarra) donde actúa la IA: la luz del servidor y lo que escribe la IA.** La chispa es la aguja de brújula del logotipo «Norte» (un rombo alargado), para que las ilustraciones y el logo hablen el mismo idioma. Va siempre sobre pizarra y aparece solo en estos dos casos:
  - la luz del servidor (`servidor`, `colegio-servidor`);
  - la insignia de lo que escribe la IA, un círculo pizarra con la chispa (`documento-ia`): resúmenes y respuestas de correo, actas dictadas, traducciones, plazos sacados de circulares.

  Lo que prepara DirectorIA con una plantilla y los datos del colegio usa la misma hoja sin insignia (`documento`).

  Lo que sale de las reglas y los datos del colegio va sin chispa, porque lo hace DirectorIA sin IA: la ficha de sustitución (`ficha`), el resumen de las 8:00 (la tableta de `direccion`, con el ✓ de «al día»), los avisos (`alerta`) y los avisos de plazos (`calendario`). El naranja no es un color de aviso ni de peligro: los avisos (`alerta` y el aviso de `ficha`) van en pizarra. Las personas no llevan naranja. Tampoco lo llevan lo que firman o aprueban las personas (`acta`, `circular`) ni la nube. Chispa-suave y chispa-texto no se usan en las ilustraciones.
- **Se leen a 96 px.** Están comprobadas a ese tamaño sobre tiza, salvia, papel y pizarra.

## Archivos

### Lugares

| Archivo | Qué muestra |
|---|---|
| `colegio-servidor.svg` | **La imagen clave.** Es el mismo edificio que `colegio`, con la puerta en arco en su sitio. Por el ventanal del cuerpo central se ve una sala, con pared del fondo, paredes laterales y suelo, y en ella está el servidor: el mismo de `servidor.svg` a media escala (con el panel de la chispa un poco más alto, para que la chispa se vea bien a 96 px) y con su chispa naranja, el único naranja de la imagen. Es «Vuestra IA, dentro del colegio». |
| `servidor.svg` | Una torre en pizarra con la chispa naranja en la ventana, dos bahías y un escudo con cerradura. Es el servidor que vive en el colegio y guarda los datos. |
| `colegio.svg` | Un colegio español: alas con tejado de pizarra y ventanas altas, y un cuerpo central con frontón curvo, reloj a las ocho, un ventanal de cuarterones y la puerta en arco. |
| `nube-claude.svg` | Una nube con un libro abierto, que representa el material didáctico. Es el módulo opcional, que está fuera del colegio y no lleva naranja. Solo recibe peticiones de material didáctico, con un filtro pensado para bloquear datos personales. |

### Personas

| Archivo | Quién es | Su objeto |
|---|---|---|
| `direccion.svg` | Directora de unos 55 años, con melena corta, gafas y americana | Tableta oscura con el resumen del día (un titular y dos puntos) y, en la esquina de la pantalla, el ✓ de «al día». No lleva la insignia de la IA: el resumen de las 8:00 sale de las reglas y los datos del colegio. Es la misma directora de la demo |
| `jefatura.svg` | Jefe de estudios de unos 45, con barba recortada | Cuadrante de horarios |
| `secretaria.svg` | Secretario de unos 60, con gafas y bigote | El sello del centro en alto y, en la otra mano, una hoja con su marca: el mismo aro que el sello de `circular` |
| `docente.svg` | Maestra de unos 35, con pelo rizado | La tiza en la mano: dibuja en la pizarra un sol y una casa (dibujos, no letras ni números) |
| `orientacion.svg` | Orientadora o tutora con hiyab | Bocadillo con un corazón |
| `sustituto.svg` | Profesor sustituto joven | Su ficha: una lista con casillas marcadas |
| `familia.svg` | Padre de unos 40 con su hija: la rodea con el brazo y le apoya la mano en el hombro | Son las familias que reciben las circulares y los correos del colegio |

### Documentos e iconos

| Archivo | Qué muestra |
|---|---|
| `documento-ia.svg` | Una hoja con la insignia de la IA (la chispa naranja sobre un círculo pizarra) en la esquina de abajo: este texto lo ha escrito la IA (un resumen, una respuesta, un acta dictada, una traducción). Solo para eso: no para la ficha, un informe de gastos ni un documento que rellena DirectorIA con una plantilla. |
| `documento.svg` | La misma hoja, sin insignia y con un pequeño gráfico de barras: lo que prepara DirectorIA con las reglas, las plantillas y los datos del colegio. Es la del análisis y el informe de gastos, la evaluación de impacto y las plantillas en blanco de la guía de un protocolo. |
| `circular.svg` | Una circular con sello oficial, un aro con un pequeño edificio institucional. |
| `acta.svg` | Un acta con dos firmas. |
| `ficha.svg` | La ficha de sustitución: una lista de tareas con un aviso en un triángulo pizarra del tamaño de las casillas. Desde el 28 de noviembre de 2026 la ficha solo lleva la clase, y el aviso es la línea fija que recuerda preguntar la salud y las recogidas en conserjería o a la tutora: DirectorIA no guarda datos de alumnos. No lleva la insignia de la IA: la prepara DirectorIA con las reglas y los datos del colegio («Preparada por DirectorIA · confirmada por jefatura»). |
| `correo.svg` | Un sobre. |
| `calendario.svg` | Un calendario con un plazo marcado: un círculo pizarra con un punto claro, sin chispa, porque los avisos de plazos salen de las reglas del colegio. (Lo que sí hace la IA es sacar los plazos de una circular: para eso, `documento-ia`.) |
| `candado.svg` | Un candado: la privacidad. |
| `microfono.svg` | Un micrófono: el dictado por voz, «del dictado al acta». |
| `reloj.svg` | Un reloj a las ocho, cuando llega el resumen del día, antes de las clases. |
| `alerta.svg` | Un aviso suave: un triángulo pizarra-linea de esquinas redondeadas con la exclamación en papel, sin halo y sin insignia, porque los avisos los da DirectorIA con las reglas del colegio. |

### Otros

- `kit.png`: hoja de contactos con todo el kit sobre tiza y el nombre de cada archivo.
- `generar.mjs`: el programa que dibuja los 22 SVG (ver «Para cambiarlas»).

## Cómo usarlas

- **En la presentación.** En PowerPoint se insertan como imagen (Insertar → Imagen) y se pueden escalar sin perder calidad. Si la herramienta no admite SVG, como Google Slides, hay que usar una versión en PNG.
- **Tamaño mínimo: 96 px.** Por debajo, las caras y las líneas de los documentos se pierden.
- **Sin retoques.** No se recolorean, no se deforman, no se giran y no se les quita el disco: sin él, las hojas en papel desaparecen sobre la tiza.
- **Del colegio al servidor.** `colegio` y `colegio-servidor` son el mismo edificio. Puestas una después de otra, el ventanal «se abre» y deja ver el servidor.
- **Diapositiva «Así funciona».** Esta es la composición recomendada:
  - `colegio-servidor` grande, en el centro;
  - alrededor, las personas del colegio (`direccion`, `jefatura`, `secretaria`, `docente`, `orientacion`, `sustituto`), unidas al centro con líneas finas en pizarra-linea;
  - sobre esas líneas, en pequeño, lo que les llega: `documento-ia` a dirección, `ficha` al sustituto, etc.;
  - más lejos, fuera del colegio, `familia`, que recibe `circular` o `correo`;
  - `nube-claude` aparte, unida con una línea discontinua y la etiqueta «solo peticiones de material didáctico, con un filtro pensado para bloquear datos personales».
- **Parejas que cuentan una función de un vistazo:**
  - `sustituto` + `ficha`: ausencia cubierta, sustituto informado;
  - `direccion` + `reloj`: el resumen del día a las ocho;
  - `direccion` + `correo` + `documento-ia`: cada correo, resumido por la IA y con una respuesta propuesta;
  - `secretaria` + `documento`: el informe de gastos;
  - `docente` + `microfono` + `acta`: del dictado al acta;
  - `jefatura` + `calendario` + `alerta`: plazos y choques avisados;
  - `secretaria` + `circular` + `correo` + `familia`: circulares a las familias;
  - `colegio-servidor` + `candado`: la aplicación y los datos, en un servidor dentro del colegio; DirectorIA no guarda datos de alumnos;
  - `docente` + `candado`: los justificantes del profesorado, archivados en su carpeta y sin que la IA los lea.

## Para cambiarlas

- `node generar.mjs` vuelve a dibujar los 22 SVG en esta carpeta. Necesita Node 18 o superior y nada más. Los colores, los radios, el disco, la chispa y la insignia de la IA están definidos al principio del archivo, y cada ilustración es un bloque comentado. `servidor` y `colegio-servidor` dibujan el servidor con la misma función (`serverTower`).
- La chispa es la aguja del logotipo «Norte». Si algún día cambia el logo, basta con cambiar la función `spark` de `generar.mjs` y volver a generar.
- Datos técnicos de cada SVG:
  - `viewBox="0 0 240 240"`, fondo transparente y formas planas;
  - sin textos, imágenes ni referencias externas;
  - un `<title>` en español para los lectores de pantalla;
  - pesan entre 0,5 y 4,1 KB.
- **Después de regenerarlas:**
  - copiad las que cambien a la web (`../web/img/ilustraciones/`), que lleva su propia copia;
  - rehaced `kit.png` desde esta carpeta, con las herramientas de `../presentacion/herramientas/` (Node 18 y Playwright con Chromium): `bash ../presentacion/herramientas/kit.sh`. Dibuja cada SVG a 240 px y los pone en una hoja de 5 columnas sobre tiza, en el orden de `generar.mjs`;
  - si la ilustración sale en la presentación o en el sistema de diseño, hay que subirla otra vez a ese artifact: el archivo nuevo tiene otra dirección `/_blob/…` (ver `../presentacion/herramientas/LEEME.md`).

## Cambio del 28 de noviembre de 2026

DirectorIA ya no guarda datos de alumnos. Ningún dibujo cambia: `ficha.svg` no lleva textos, así que su aviso vale para la línea fija de la ficha nueva. Cambian las descripciones de `ficha`, `documento` y `familia` y la pareja de `colegio-servidor` y `candado`, y se añade la de `docente` y `candado` para los justificantes del profesorado.
