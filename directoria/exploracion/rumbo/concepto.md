# Norte

> **Archivo.** Es el concepto que ganó («Norte»), tal como se presentó, y sus frases no se han puesto al día. Dice que los datos de los alumnos «no salen» del colegio y usa una segunda línea antigua. El logotipo definitivo y cómo contarlo están en `directoria/logo/construccion.md`; cómo escribir sobre DirectorIA, en `directoria/manual/identidad-verbal.md`.

**Territorio:** rumbo · **Tipografía:** Rubik SemiBold (600) pasada a contornos, con una «I» de remates dibujada a medida. No lleva Nunito Sans: esa queda para el texto corrido.

## La idea en una frase

El asta de la D de DirectorIA es una aguja de brújula. Su mitad norte, en naranja, es la IA que señala el rumbo. El cuenco, en pizarra, es el equipo directivo, que decide si lo sigue.

## Por qué encaja con DirectorIA

- **Da rumbo al curso.** En español, «curso» es a la vez el año escolar y la dirección que se lleva. «No perder el norte» es justo lo que pide un equipo directivo en plena semana de sustituciones, plazos y actas. El símbolo acompaña bien al eslogan «Vuestra IA, dentro del colegio». Para una campaña admitiría además la línea «Un curso con norte».
- **La IA propone y una persona decide.** La aguja forma parte de la D, pero no se funde con ella: entre las dos hay un hueco. La aguja propone una dirección y la letra, que es el equipo, la sostiene y decide. Es la segunda línea de la marca, «La IA propone. Vosotros decidís.», dibujada. Solo la punta va en naranja: el resto es pizarra.
- **Una brújula funciona sin conexión.** No depende de satélites ni de servidores ajenos y orienta desde donde está. Es el valor «Puertas adentro»: el servidor de DirectorIA trabaja dentro del colegio y los datos de los alumnos no salen de él.
- **Transmite calma.** La aguja apunta al norte, en vertical, y no hacia arriba a la derecha como las flechas de crecimiento. Da estabilidad, orden e institución, con un toque cálido y sin estridencias, para equipos de 45 a 60 años.
- **No usa los tópicos de la IA.** No hay robots, cerebros, circuitos ni destellos. La aguja de mitad naranja y mitad oscura es un objeto que todo el mundo reconoce desde el colegio.
- **Es una sola forma y es una letra.** No es un dibujo puesto al lado de una D. A una tinta, las dos mitades de la aguja se unen en un rombo y la D se sigue leyendo.

## Construcción (retícula de 100)

- **Aguja.** Mide 26 × 88 y está partida por la mitad: norte arriba, sur abajo. Sus puntas rebasan casi 2 unidades el cuenco por compensación óptica, porque una punta parece más corta que un borde recto.
- **Cuenco.** El trazo mide 17,5 en los tramos horizontales y 19,5 en la curva, que necesita algo más de grosor para verse igual. Las esquinas exteriores tienen un radio de 37, como eco de la D de Rubik. Los extremos se cortan en paralelo a los bordes de la aguja y dejan un hueco constante de 4. Las esquinas vivas se suavizan con un radio de 2,4, igual que las de Rubik.
- **Isotipo.** Va en una caja cuadrada con un margen uniforme del 6 %.

## El logotipo y la «IA»

- **La I lleva remates.** Así nunca se lee «DirectorlA», ni siquiera a una tinta. El asta es la de la I de Rubik 600. Los remates sobresalen 7 a cada lado y tienen un grosor de 10,5 (a cuerpo 100), el mismo lenguaje que el brazo de la «r» y la «t».
- **Espaciado.** Se ha ajustado a ojo: 6 entre la r y la I, y 3,5 entre la I y la A.
- **El color es una segunda garantía.**
  - Sobre fondo claro, la punta norte y «IA» van en chispa-texto `#B4531C`, que tiene un contraste de 4,5:1 sobre tiza.
  - Sobre pizarra, van en chispa `#E07A3A`.
  - Regla: dentro de cada versión solo hay un naranja, y la aguja y la IA comparten siempre el mismo.
- **Composición horizontal.**
  - El isotipo mide 1,4 veces la altura de mayúscula y va centrado en ella.
  - La separación con la palabra es 0,42 veces la altura de mayúscula.
  - El margen alrededor es de 0,12 veces la altura de mayúscula.

## Uso

- **Tamaños mínimos.**
  - El isotipo funciona a 16 px como «D con punta naranja». La aguja se reconoce como tal a partir de 32 px.
  - El logotipo horizontal funciona a partir de 24 px de alto, que es cuando los remates de la I aún se distinguen.
- **Área de respeto.** Hay que dejar libre alrededor al menos el ancho de la aguja.
- **En negativo.** El sur de la aguja va en tiza, como la mitad blanca de una brújula clásica.

## Lo que hay que vigilar

- A 16 px el rombo de la aguja se pierde: queda una D con una esquina naranja. Se lee bien, pero la brújula solo aparece a partir de 32 px.
- Sobre fondo claro, el naranja es el oscuro (chispa-texto). Gana legibilidad, pero brilla menos que la chispa.
- El símbolo y la palabra repiten la D, como pasa en cualquier monograma con la inicial.
- La brújula es una metáfora de orientación conocida. Lo propio de esta propuesta es que la aguja sea el asta de la D, y eso hay que defenderlo en el uso: no separar nunca la aguja de la letra.

## Archivos

- `isotipo.svg` / `isotipo-negativo.svg`: el símbolo para fondo claro y para pizarra.
- `logo-horizontal.svg` / `logo-horizontal-negativo.svg`: el símbolo con el logotipo.
- `tablero.png`: el tablero de evaluación.
- `bocetos.png`: las siete variantes de la primera ronda y los pasos de afinado.
- `build.mjs`: genera todos los SVG a partir de los parámetros de arriba.
