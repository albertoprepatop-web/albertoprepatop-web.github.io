# Ilustraciones de DirectorIA

Veintiuna ilustraciones planas para contar, desde la primera diapositiva, cómo funciona DirectorIA. Hay un servidor dentro del colegio y, a su alrededor, las personas que lo usan, lo que la IA prepara para ellas y, aparte, la nube opcional. `kit.png` las reúne todas en una hoja.

## Cómo son

- **Un mismo disco para todas.** Cada ilustración va sobre un disco color linea (#D5DED9), con un lienzo de 240 × 240 y fondo transparente fuera del disco. Gracias al disco se leen igual sobre tiza, salvia, papel o pizarra, y las hojas blancas no se pierden sobre el fondo claro.
- **Formas planas y redondeadas.** No llevan degradados, sombras, texturas ni textos, y solo usan los colores de la paleta (`directoria/tokens.json`).
- **Personas.** Se ven de pecho para arriba y todas tienen las mismas medidas: cabeza, hombros, altura de los ojos. La cabeza y las manos van en papel (#FFFDF8), un tono que no imita ningún color de piel y es igual para todos. La ropa y el pelo van en la gama pizarra. Cada persona lleva un solo objeto que dice a qué se dedica.
- **Radios de esquina.** Son siempre los mismos: 4 en las piezas pequeñas, 10 en hojas, tarjetas y pantallas, y 16 en los cuerpos grandes (servidor y candado).
- **El naranja significa «aquí actúa la IA».** Como dice la identidad verbal, la IA prepara, resume, propone y avisa. Por eso el naranja solo aparece en cuatro sitios:
  - la chispa del servidor (`servidor`, `colegio-servidor`);
  - la chispa sobre pizarra de lo que prepara la IA (`documento-ia`);
  - sus avisos (`ficha`, `calendario`, `alerta`).

  Las personas no llevan naranja. Tampoco lo llevan lo que firman o aprueban las personas (`acta`, `circular`) ni la nube.
- **Se leen a 96 px.** Están comprobadas a ese tamaño sobre tiza, salvia, papel y pizarra.

## Archivos

### Lugares

| Archivo | Qué muestra |
|---|---|
| `colegio-servidor.svg` | **La imagen clave.** El colegio tiene un corte en el cuerpo central y dentro se ve el servidor con su chispa naranja, el único naranja de la imagen. Es «Vuestra IA, dentro del colegio». |
| `servidor.svg` | Una torre en pizarra con la chispa naranja en la ventana, dos bahías y un escudo con cerradura. Es el servidor que vive en el colegio y guarda los datos. |
| `colegio.svg` | Un colegio español: alas con tejado de pizarra, ventanas altas, cuerpo central con frontón curvo, reloj a las ocho y puerta en arco. |
| `nube-claude.svg` | Una nube con un libro abierto, que representa el material didáctico. Es el módulo opcional, que está fuera del colegio y no lleva naranja. Solo recibe peticiones de material didáctico, sin datos personales. |

### Personas

| Archivo | Quién es | Su objeto |
|---|---|---|
| `direccion.svg` | Directora de unos 55 años, con melena corta y gafas | Tableta con el resumen del día |
| `jefatura.svg` | Jefe de estudios de unos 45, con barba recortada | Cuadrante de horarios |
| `secretaria.svg` | Secretario de unos 60, con gafas y bigote | Carpeta con documentos |
| `docente.svg` | Maestra de unos 35, con pelo rizado | Pizarra con un triángulo y una suma |
| `orientacion.svg` | Orientadora o tutora con melena larga | Bocadillo con un corazón |
| `sustituto.svg` | Profesor sustituto joven | Su ficha: una lista con casillas marcadas |
| `familia.svg` | Madre con hiyab y su hija | Son las familias que reciben cartas y circulares |

### Documentos e iconos

| Archivo | Qué muestra |
|---|---|
| `documento-ia.svg` | Una hoja con la chispa naranja sobre pizarra: este documento lo ha preparado la IA. |
| `circular.svg` | Una circular con sello oficial, un aro con un pequeño edificio institucional. |
| `acta.svg` | Un acta con dos firmas. |
| `ficha.svg` | La ficha de sustitución: una lista de tareas con un aviso naranja (alergias, necesidades o recogidas). |
| `correo.svg` | Un sobre. |
| `calendario.svg` | Un calendario con un plazo marcado en naranja, porque la IA avisa de los plazos. |
| `candado.svg` | Un candado: la privacidad. |
| `microfono.svg` | Un micrófono: el dictado por voz, «del dictado al acta». |
| `reloj.svg` | Un reloj a las ocho, cuando llega el resumen del día, antes de las clases. |
| `alerta.svg` | Un aviso suave: un triángulo naranja de esquinas redondeadas sobre un halo chispa-suave. |

### Otros

- `kit.png`: hoja de contactos con todo el kit sobre tiza y el nombre de cada archivo.
- `generar.mjs`: el programa que dibuja los 21 SVG (ver «Para cambiarlas»).

## Cómo usarlas

- **En la presentación.** En PowerPoint se insertan como imagen (Insertar → Imagen) y se pueden escalar sin perder calidad. Si la herramienta no admite SVG, como Google Slides, hay que usar una versión en PNG.
- **Tamaño mínimo: 96 px.** Por debajo, las caras y las líneas de los documentos se pierden.
- **Sin retoques.** No se recolorean, no se deforman, no se giran y no se les quita el disco: sin él, las hojas en papel desaparecen sobre la tiza.
- **Diapositiva «Así funciona».** Esta es la composición recomendada:
  - `colegio-servidor` grande, en el centro;
  - alrededor, las personas del colegio (`direccion`, `jefatura`, `secretaria`, `docente`, `orientacion`, `sustituto`), unidas al centro con líneas finas en pizarra-linea;
  - sobre esas líneas, en pequeño, lo que les llega: `documento-ia` a dirección, `ficha` al sustituto, etc.;
  - más lejos, fuera del colegio, `familia`, que recibe `circular` o `correo`;
  - `nube-claude` aparte, unida con una línea discontinua y la etiqueta «solo material didáctico, sin datos personales».
- **Parejas que cuentan una función de un vistazo:**
  - `sustituto` + `ficha`: ausencia cubierta, sustituto informado;
  - `direccion` + `reloj` + `documento-ia`: el resumen del día a las ocho;
  - `docente` + `microfono` + `acta`: del dictado al acta;
  - `jefatura` + `calendario` + `alerta`: plazos y choques avisados;
  - `secretaria` + `circular` + `correo` + `familia`: circulares a las familias;
  - `colegio-servidor` + `candado`: los datos de los alumnos no salen del colegio.

## Para cambiarlas

- `node generar.mjs` vuelve a dibujar los 21 SVG en esta carpeta. Necesita Node 18 o superior y nada más. Los colores, los radios, el disco y la chispa están definidos al principio del archivo, y cada ilustración es un bloque comentado.
- Si el logotipo final usa un punto naranja en vez de la chispa de cuatro puntas, basta con cambiar la función `spark` de `generar.mjs` y volver a generar.
- Datos técnicos de cada SVG:
  - `viewBox="0 0 240 240"`, fondo transparente y formas planas;
  - sin textos, imágenes ni referencias externas;
  - un `<title>` en español para los lectores de pantalla;
  - pesan entre 0,5 y 3,2 KB.
