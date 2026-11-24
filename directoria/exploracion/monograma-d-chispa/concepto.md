# Dirección con chispa

**Territorio:** monograma D + chispa · **Tipografía:** Rubik 700 pasada a contornos, con una «I» de remates dibujada a medida.

## La idea en una frase

Es una D de «dirección», rotunda y redondeada. Sus dos trazos se encuentran en una chispa naranja encajada en la esquina: la IA es el punto de unión del trabajo del equipo directivo, y la propia D la sostiene dentro del centro.

## Por qué encaja con DirectorIA

- **La D es el equipo directivo.** Tiene la base plana y el asta firme, y transmite estabilidad e institución. El cuenco semicircular le da calidez. Es una forma seria, pero no fría, para equipos de 45 a 60 años.
- **La chispa está donde se unen los trazos.** Sustituciones, plazos, actas, correo, protocolos y gastos pasan por ese punto. La chispa no sustituye a la D: los dos trazos la rodean y la sujetan. Es la manera visual de decir «la IA propone y una persona decide».
- **La chispa no sale de la D.** Queda encajada en un hueco a su medida, como una pieza engastada. Así se ve la promesa del servidor en el propio colegio: los datos del alumnado no salen del centro.
- **Tiene una segunda lectura.** El asta y la chispa forman una «i»: la i de IA vive dentro de la D de Dirección. Es el nombre entero (Director + IA) en un solo signo.
- **Usa la paleta de la marca.** En negativo es literalmente tiza sobre pizarra con una chispa naranja. No hay robots, cerebros, circuitos ni destellos: solo un círculo.
- **Funciona en las condiciones difíciles.** A una tinta, el hueco sigue separando la chispa. A 16 px la esquina naranja se sigue viendo, aunque el hueco se cierre.

## El logotipo y la «IA»

- Para que nunca se lea «DirectorlA», la **I de «IA» lleva remates**. Está dibujada con las proporciones de Rubik 700: asta de 0,18 em, remates de 0,13 em y esquinas de 0,025 em. Se lee como I mayúscula a cualquier tamaño y también a una tinta.
- El **cambio de color** es una segunda garantía.
  - Sobre fondo claro, «IA» va en chispa-texto `#B4531C`, que tiene un contraste de 4,5:1 sobre tiza. La chispa del símbolo va en chispa `#E07A3A`: es un elemento gráfico que vive pegado al pizarra y así brilla más.
  - Sobre pizarra, la chispa y «IA» van las dos en chispa `#E07A3A`.
- El espaciado entre r, I y A está ajustado a mano para que los remates no choquen con el brazo de la «r» ni con el pie de la «A».

## Construcción

- **Retícula de 100.**
  - La D mide 84 × 84 y su trazo, 22. El cuenco es semicircular y la esquina inferior izquierda tiene un radio de 5.
  - La chispa mide 22 de diámetro (igual que el trazo) y es tangente a los bordes superior e izquierdo.
  - El hueco alrededor de la chispa es de 6,5 y las puntas del corte están suavizadas con un radio de 1,6.
- **Versión horizontal.** El símbolo mide 1,46 veces la altura de mayúscula y va centrado en ella. La separación entre símbolo y texto es 0,4 veces la altura de mayúscula.
- **Tamaños mínimos.** El isotipo funciona a partir de 16 px (favicon). El logotipo horizontal, a partir de 20 px de alto, que es cuando los remates de la I aún se distinguen.
- **Área de respeto.** Alrededor del logotipo hay que dejar libre al menos el diámetro de la chispa.

## Archivos

- `isotipo.svg` / `isotipo-negativo.svg`: el símbolo para fondo claro y para pizarra.
- `logo-horizontal.svg` / `logo-horizontal-negativo.svg`: el símbolo con el logotipo.
- `tablero.png`: el tablero de evaluación.
- `bocetos.png`: las variaciones exploradas y la elegida, también a una tinta.
- `build.mjs`: genera todos los SVG desde los parámetros. Se ejecuta con `node build.mjs [ruta/outline.mjs]`.

## Puntos débiles conocidos

- **El símbolo se lee también «iD».** Puede evocar «identificación». Además, en educación hay marcas con monogramas parecidos (por ejemplo, iDoceo): hay que comprobarlo antes de registrar la marca.
- **La D se repite en la versión horizontal** (símbolo + «Director»). En usos muy pequeños conviene usar solo el isotipo o solo el logotipo.
- **En positivo conviven dos naranjas** (la chispa y «IA»). Es una decisión de contraste, pero queda algo menos unitario que el negativo.
- **La I con remates es un dibujo, no un carácter.** Escribir «DirectorIA» en Rubik desde el teclado muestra la I lisa, así que el logotipo debe usarse siempre como archivo.
