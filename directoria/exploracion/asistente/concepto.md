# Chispa dentro

> **Archivo.** Este concepto se exploró antes de elegir el logotipo, y sus frases no se han puesto al día. Algunas dicen que los datos del alumnado «no salen» del colegio o dan a la IA trabajo que hace DirectorIA con las reglas del colegio, como las sustituciones. Para escribir sobre DirectorIA, seguid `directoria/manual/identidad-verbal.md`.

Territorio: **asistente**. Tipografía: **Rubik SemiBold (600)**.

## La idea en una frase

La D de Dirección se convierte en un bocadillo de diálogo que se apoya en la línea base y lleva dentro una sola chispa naranja: el asistente vive dentro del centro, conversa y propone, y la dirección decide.

## Por qué encaja con DirectorIA

- **La D es un bocadillo.** DirectorIA es un asistente con el que dirección, jefatura de estudios, secretaría y profesorado conversan sobre sustituciones, plazos, actas, correo, protocolos y gasto. El lado recto de la D transmite institución y orden. El lado curvo, conversación y cercanía.
- **La chispa está dentro.** La IA es la chispa, del mismo naranja que la «IA» del logotipo, y vive dentro de la D. Así se cuenta lo más diferencial del producto: el servidor está en el propio centro y los datos del alumnado no salen de él. Es una sola chispa, quieta y sin brillos alrededor. Sus cuatro puntas también recuerdan una rosa de los vientos, es decir, *dirección* y rumbo.
- **Un bocadillo que se asienta.** La cola no cuelga como en las aplicaciones de mensajería, que suelen usar un círculo con la cola hacia abajo. Aquí se apoya en la línea base y apunta a la izquierda. Transmite calma y estabilidad y aleja el símbolo de WhatsApp o Messenger.
- **La IA propone y la persona decide.** El bocadillo es la voz del asistente, que propone. La forma maciza de la D es el marco de quien decide.
- **«IA» sin ambigüedad.** La I de «IA» se ha dibujado con remates, igual que en las tipografías pensadas para leerse bien (Verdana, Atkinson Hyperlegible), y con el grosor de los brazos de la E de Rubik. Nunca se lee «DirectorlA», ni siquiera a una tinta. De paso recuerda al cursor de texto, porque el asistente redacta actas, correos y protocolos.
- **Para equipos directivos de 45 a 60 años.** Son dos formas sencillas con los colores sobrios de la paleta (pizarra, tiza y chispa). No hay robots, cerebros, circuitos ni nada infantil.
- **Funciona pequeño y a una tinta.** La silueta maciza aguanta 16 px. El isotipo está encajado en la retícula de 16 px (`viewBox="-18 -12 96 96"`): el asta y los bordes superior e inferior caen en píxel entero y se ven nítidos en el favicon. A una tinta, la chispa queda calada (ver `bocetos/7-una-tinta.png`).

## Construcción

- **Isotipo.** Cuerpo de 68 × 72 con el lado izquierdo recto y un cuenco semicircular de radio 36. Las esquinas van suavizadas, como en Rubik. La cola mide 14,6 hacia la izquierda sobre la base. La chispa es de cuatro puntas, con radio 17,5 y núcleo del 45 %, y está al 48,5 % del ancho, en el centro óptico de la D.
- **Logotipo horizontal.** Rubik 600 con interletraje del −1 %, convertida a trazos. La «I» es un glifo propio con remates: mide 0,37 em de ancho, sus remates tienen el 90 % del grosor de los brazos de la E y conserva las esquinas suaves de Rubik. El bocadillo mide 1,45 veces la altura de las mayúsculas y va centrado con ellas. La separación con el texto es de 0,38 veces esa altura, y el margen, de 0,14 a cada lado.
- **Colores.** En positivo: bocadillo y «Director» en pizarra #17322C, chispa e «IA» en chispa #E07A3A. En negativo: bocadillo y «Director» en tiza #F6F3EC, chispa e «IA» en chispa #E07A3A. La chispa y la «IA» comparten color a propósito: la chispa *es* la IA.

## Notas de uso

- El naranja chispa sobre fondo claro tiene poco contraste (2,7:1 sobre tiza). Si el logotipo mide menos de unos 24 px de alto sobre fondo claro, la «IA» puede pasar a chispa-texto #B4531C (4,5:1). La chispa del isotipo va sobre pizarra y ya tiene 4,6:1.
- Una posible extensión: en la aplicación, el indicador de «pensando» puede ser una animación de tres puntos que se convierten en la chispa. Así se recupera esa idea sin recargar el logotipo.

## Puntos débiles

- Un bocadillo con una chispa de cuatro puntas es un motivo habitual en los botones de «IA». Lo propio aquí es la D asentada y la I con remates, pero hace falta una búsqueda de registro de marca: hay parentesco conceptual con Disqus y Discourse, que también combinan D y bocadillo.
- En el horizontal, la D del símbolo precede a la D de «Director», así que hay algo de repetición.
- En la versión negativa, la chispa naranja sobre el bocadillo claro tiene poco contraste (2,7:1). A 16 px se ve como un punto suave.
- La I con remates no existe en Rubik. En texto corrido, «DirectorIA» seguirá mostrando la I de palo de Rubik o Nunito Sans. Ahí lo resuelven el contexto y, si hace falta, poner «IA» en color.

## Archivos

- `isotipo.svg`, `isotipo-negativo.svg`: el símbolo, para fondo claro y para fondo pizarra.
- `logo-horizontal.svg`, `logo-horizontal-negativo.svg`: símbolo y «DirectorIA».
- `tablero.png`: tablero de evaluación.
- `bocetos/`: el proceso (9 variaciones iniciales, 9 pruebas de cola y de señal de IA, los primeros logotipos, el refinado y la retícula de 16 px) y las pruebas a una tinta.
- `build.mjs` y `lib.mjs`: regeneran los SVG con `node build.mjs`. Necesitan `outline.mjs` de las herramientas de marca; su carpeta se indica con la variable `BRANDTOOLS`.
