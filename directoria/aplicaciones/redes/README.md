# Redes sociales de DirectorIA

Imágenes para los perfiles de DirectorIA en LinkedIn y X, las dos primeras publicaciones y una imagen apaisada para publicaciones y enlaces que no traen imagen propia. Todas parten de los archivos de la marca: los SVG del logotipo (`../../logo/`), las ilustraciones (`../../ilustraciones/`), Rubik y Nunito Sans (`../../fuentes/`) y los colores de `../../tokens.json`.

Son PNG en sRGB, opacos (RGB de 8 bits, sin transparencia) y con la medida que recomienda cada red. Al no tener transparencias, ninguna red puede rellenar esquinas vacías de negro.

## Archivos

| Archivo | Medidas | Peso | Para qué |
|---|---|---|---|
| `avatar-400.png` | 400 × 400 px | 13 KB | Foto de perfil de la página de empresa en LinkedIn, de la cuenta de X y de cualquier red que recorte en círculo. |
| `linkedin-banner.png` | 1584 × 396 px | 62 KB | Imagen de fondo del perfil personal de LinkedIn de quien presenta DirectorIA. |
| `x-cabecera.png` | 1500 × 500 px | 65 KB | Cabecera de la cuenta de X. |
| `compartir-1200x630.png` | 1200 × 630 px | 64 KB | Imagen apaisada para publicaciones y enlaces que no traen imagen propia. **No es la imagen de la web:** esa es `../../web/img/og.png`. |
| `post-presentacion.png` | 1200 × 1200 px | 127 KB | Primera publicación en LinkedIn: «Vuestra IA, dentro del colegio». |
| `post-sustituciones.png` | 1200 × 1200 px | 172 KB | Publicación de LinkedIn sobre las sustituciones y la ficha de quien sustituye. |
| `html/` | — | — | El origen de cada imagen (una página HTML por imagen, `redes.css` y `generar.mjs`). Ver «Cómo cambiarlas». |

Todas pesan menos de 200 KB, muy por debajo de los límites de LinkedIn y X.

## Cómo usar cada imagen

### Avatar · `avatar-400.png`

- Es el icono de app (`../../logo/app-icon.svg`) a sangre: el fondo pizarra llega a las cuatro esquinas. Cada red le pone su propia máscara (círculo en X y en los perfiles personales, cuadrado con esquinas suaves en las páginas de empresa de LinkedIn) y en ningún caso aparecen esquinas vacías.
- El símbolo ocupa el 58,6 % del alto y cabe entero en el círculo del 80 %. Se ha comprobado recortado en círculo y en cuadrado, a 400, 128, 72, 48, 40 y 32 px, sobre interfaz clara y oscura: la aguja y la D se siguen leyendo.
- Se sube tal cual, sin recortar, sin marco y sin cambiar el fondo.
- Sirve igual para Instagram, Facebook, YouTube o WhatsApp Business.

### Fondo de LinkedIn · `linkedin-banner.png`

- En el perfil personal, editad la imagen de fondo (el lápiz sobre el fondo), subid el archivo y guardad sin recortar: mide justo lo que pide LinkedIn.
- **Lo que tapa LinkedIn.** La foto de perfil queda abajo a la izquierda. El tercio izquierdo (hasta x = 560 px) va vacío a propósito. Se ha comprobado con la foto encima en escritorio (804 px de ancho) y en móvil (390 px).
- **Lleva solo la palabra** (`logotipo-negativo.svg`, a 52 px de alto). En el móvil, LinkedIn muestra el fondo a 390 px de ancho, a una cuarta parte de su tamaño: la palabra mide ahí 12,8 px de alto, por encima de su mínimo de 12 px. El logotipo horizontal se quedaría en 14 px, por debajo de los 24 px que pide `../../logo/construccion.md`, y para llegar a 24 tendría que medir 98 px de alto: no cabría con el titular.
- **La ilustración mide 392 px** (el disco, 340 px, a 66 px del borde derecho y a 28 px de arriba y de abajo). En el móvil se ve a 96,5 px, justo por encima del mínimo de 96 px del kit de ilustraciones (`../../ilustraciones/LEEME.md`). No la hagáis más pequeña.
- **No es la portada de la página de empresa.** Esa mide 1128 × 191 y LinkedIn recortaría este archivo. Si hace falta, se saca de `html/linkedin-banner.html` con esa medida, también con la palabra sola (al lado ya está el avatar con el símbolo), y se vuelve a comprobar el tamaño del logotipo en el móvil.

### Cabecera de X · `x-cabecera.png`

- «Editar perfil», cabecera, subir el archivo y aplicar sin mover el encuadre.
- **Lo que tapa X.** El avatar tapa la esquina de abajo a la izquierda (x < 400 y y > 300 px), que va vacía. Además, X recorta hasta unos 60 px por arriba y por abajo según la pantalla, así que todo lo importante va entre y = 70 y y = 430. Se ha comprobado con el avatar encima en escritorio (600 px) y en móvil (390 px).
- Lleva solo la palabra (`logotipo-negativo.svg`, a 50 px de alto): el avatar, justo al lado, ya muestra el símbolo, y así no se repite la D (`../../logo/construccion.md`). En el móvil, X muestra la cabecera a 390 px de ancho y la palabra mide 13 px de alto (mínimo, 12 px).
- La ilustración mide 370 px: en el móvil, 96,2 px (mínimo, 96 px).

### Imagen para publicaciones y enlaces · `compartir-1200x630.png`

- **No es la imagen de la web.** La web tiene la suya, `../../web/img/og.png`, y la declara en el `<head>` de la portada (`og:image` y `twitter:image`) junto con su título. Al pegar el enlace de la web en LinkedIn o en X sale esa imagen: no la cambiéis por esta ni subáis esta encima. Así cada página tiene una sola imagen y un solo título al compartirla.
- **Para qué sirve.** Para publicaciones que enlazan algo sin imagen propia (un PDF, un formulario, la inscripción a un evento) y para cualquier publicación que necesite una imagen de marca apaisada. Se sube como imagen de la publicación, con el enlace en el texto y con su texto alternativo (más abajo). Si la página enlazada os deja elegir su imagen, poned también esta.
- Lleva el logotipo horizontal (`logo-horizontal.svg`, a 512 px de ancho) y el eslogan compuesto como titular, en Rubik 600 a 64 px, junto a la imagen clave, `colegio-servidor`. No lleva el logotipo con eslogan: al ancho que cabe aquí, en el móvil las mayúsculas de su eslogan se quedarían en unos 7 px.
- **En el móvil.** LinkedIn la muestra a todo el ancho de la pantalla (390 px): el logotipo mide 31 px de alto y el titular se lee a 21 px. X la pone en la columna del texto, de unos 306 px: el logotipo mide 24,4 px, por encima del mínimo de 24.
- **Recortes.** LinkedIn y Facebook la muestran entera. X la recorta a 2 : 1 (15 px arriba y abajo) y no se pierde nada. Las miniaturas cuadradas pequeñas (algunas vistas de WhatsApp, Slack o los mensajes del móvil) recortan el centro: es lo normal en una imagen apaisada y no se puede evitar sin estropear la vista grande.

### Publicaciones · `post-presentacion.png` y `post-sustituciones.png`

- Se suben como imagen (no como documento) a 1200 × 1200, con el texto de abajo y su texto alternativo.
- Orden recomendado: primero la presentación y, unos días después, las sustituciones.
- Se han comprobado al tamaño del feed de LinkedIn en escritorio (552 px) y en móvil (390 px). En el móvil, el logotipo mide 26 px de alto (mínimo, 24 px) y cada ilustración de los tres pasos sigue midiendo unos 96 px, el mínimo del kit.
- Son para LinkedIn, que las muestra a todo el ancho del móvil. En X irían en la columna del texto (unos 306 px) y el logotipo bajaría a 20 px: allí, mejor `compartir-1200x630.png`.
- Los datos de contacto van en el texto de la publicación, no dentro de la imagen.

## Textos para los perfiles

### Biografía (X y redes con límite de 160 caracteres)

Opción A (142 caracteres):

> Vuestra IA, dentro del colegio. Sustituciones, guardias, actas y plazos para colegios privados y concertados. La IA propone. Vosotros decidís.

Opción B (154 caracteres):

> IA para dirección y claustro, en un servidor dentro del colegio y sin transferencias internacionales de datos de alumnos. La IA propone. Vosotros decidís.

Ubicación: Comunidad de Madrid · Web: [dominio.es]

### Página de empresa de LinkedIn

- **Nombre:** DirectorIA
- **Eslogan** (61 de 120 caracteres): Vuestra IA, dentro del colegio · IA para dirección y claustro
- **Sitio web:** https://[dominio.es] · **Sede:** Comunidad de Madrid
- **«Acerca de» · Descripción general** (el texto largo de la identidad verbal, con la frase sobre los datos que usan la web y la papelería, y una línea de contacto al final):

> DirectorIA, empresa de la Comunidad de Madrid, instala en colegios privados y concertados una IA propia: un servidor dentro del centro y un programa para el día a día escolar. Propone sustituciones y un reparto equilibrado de guardias, y prepara la ficha del sustituto. Saca los plazos de las circulares, sugiere respuestas al correo, redacta actas a partir del dictado y envía a dirección un resumen diario a las 8:00. Cada docente tiene su asistente, y un analista de gastos busca ahorros en facturas y contratos. Decide una persona: la IA propone y nunca evalúa, puntúa ni clasifica a los alumnos. La IA trata los datos de los alumnos en un servidor dentro del colegio, sin transferencias internacionales de esos datos. Se entrega llave en mano: servidor, instalación, borrador de la evaluación de impacto, formación y soporte.
>
> ¿Os lo enseñamos en vuestro colegio? Escribidnos a [correo@dominio.es] o llamad al [teléfono].

### Perfil personal de LinkedIn (quien presenta DirectorIA)

- **Titular:** [Cargo] en DirectorIA · Vuestra IA, dentro del colegio
- **«Acerca de»** (el texto corto de la identidad verbal, con la misma frase sobre los datos):

> En DirectorIA instalamos en colegios privados y concertados una IA propia, en un servidor dentro del centro. Prepara sustituciones y guardias, actas, respuestas de correo y avisos de plazos para dirección y claustro. La IA trata los datos de los alumnos en un servidor dentro del colegio, sin transferencias internacionales de esos datos. La IA propone y una persona decide. ¿Os lo enseño en vuestro colegio? Escribidme a [correo@dominio.es].

## Textos de las publicaciones

### 1 · Presentación · con `post-presentacion.png`

```
Vuestra IA, dentro del colegio.

DirectorIA instala en colegios privados y concertados una IA propia, en un servidor dentro del centro. Cada día quita papeleo a dirección y al claustro:

· Cuando falta un profesor, propone quién cubre cada hora y prepara la ficha de quien sustituye.
· Saca los plazos de las circulares y os los recuerda.
· Redacta actas a partir de vuestro dictado y propone respuestas al correo.
· Os guía paso a paso en protocolos como el de acoso o el de absentismo.
· A las 8:00, dirección recibe el resumen del día.

Y cada docente tiene su propio asistente.

La IA propone y una persona decide. Nunca evalúa, puntúa ni clasifica a ningún alumno, y trata los datos de vuestros alumnos en un servidor dentro del colegio, sin transferencias internacionales de esos datos.

¿Os lo enseñamos en vuestro colegio? Escribidnos a [correo@dominio.es] y preparamos una demo de 45 minutos con una mañana de ejemplo, sin datos reales: una sustitución, su ficha y un acta. Y antes de firmar nada, os hacemos gratis un análisis de gastos.

#DirectorIA #EquiposDirectivos #Colegios
```

Texto alternativo de la imagen:

> Vuestra IA, dentro del colegio. Menos papeleo para dirección y claustro. La IA trata los datos de vuestros alumnos en un servidor dentro del colegio. Ilustración de un colegio con el servidor dentro y logotipo de DirectorIA.

### 2 · Sustituciones · con `post-sustituciones.png`

```
Son las 8:05 y falta un profesor. Hay que cubrir sus horas, y quien entre en cada clase tiene que saber qué hacer.

Cuando falta un profesor, DirectorIA propone quién cubre cada hora, con un reparto de guardias equilibrado. Jefatura de estudios revisa la propuesta y decide.

Después, DirectorIA prepara la ficha de quien sustituye: la tarea de la sesión, las adaptaciones, las alergias, quién puede recoger a cada alumno y los avisos de seguridad.

Ausencia cubierta, sustituto informado. Y la IA trata los datos de vuestros alumnos en un servidor dentro del colegio, sin transferencias internacionales de esos datos.

¿Os lo enseñamos en vuestro colegio? Escribidnos a [correo@dominio.es] y preparamos una demo de 45 minutos con una mañana de ejemplo, sin datos reales: una sustitución, su ficha y un acta.

#DirectorIA #EquiposDirectivos #JefaturaDeEstudios
```

Texto alternativo de la imagen:

> Cuando falta un profesor, DirectorIA propone quién cubre cada hora y prepara la ficha de quien sustituye. Tres pasos: guardias equilibradas, que jefatura revisa y decide; la ficha, preparada; y sustituto informado.

### Textos alternativos del resto

- `avatar-400.png`: Logotipo de DirectorIA: una D cuya asta es una aguja de brújula con la punta naranja, en blanco roto sobre verde pizarra.
- `linkedin-banner.png` y `x-cabecera.png`: DirectorIA. Vuestra IA, dentro del colegio. IA para dirección y claustro. Ilustración de un colegio con el servidor de DirectorIA a la vista por el ventanal.
- `compartir-1200x630.png`: DirectorIA. Vuestra IA, dentro del colegio. Ilustración de un colegio con el servidor de DirectorIA dentro.

### Antes de publicar

- Cambiad los marcadores [correo@dominio.es], [teléfono], [dominio.es] y [Cargo] por los datos reales.
- Al copiar el nombre, comprobad que es «DirectorIA» con i mayúscula y no con ele («DirectorlA»).
- **Los datos de los alumnos.** Decid lo mismo que la sección «Privacidad» de la web y la papelería: «La IA trata los datos de vuestros alumnos en un servidor dentro del colegio, sin transferencias internacionales de esos datos». No escribáis que los datos «no salen del colegio»: no se puede sostener, porque el correo, el resumen de las 8:00 y la ficha de quien sustituye se envían a personas, y además hay soporte remoto y un módulo opcional de Claude en la nube. Tampoco «riesgo cero» ni «cumplimiento garantizado».
- **Al compartir el enlace de la web**, WhatsApp, Slack o Facebook enseñan junto a la imagen su descripción para redes (`og:description` en `../../web/index.html`). Ya usa la fórmula prudente: «La IA trata los datos de vuestros alumnos dentro del colegio».
- **La demo.** Es de 45 minutos, en el colegio, con una mañana de ejemplo y sin datos reales: una sustitución, su ficha y un acta. La pregunta de cierre es «¿Os lo enseñamos en vuestro colegio?». No ofrezcáis probarla «con vuestros horarios» ni «con vuestra próxima sustitución»: serían datos reales del colegio antes de que haya contrato.
- Si una publicación habla de precios o condiciones, se dicen enteros y sin asteriscos (identidad verbal). El compromiso mínimo es de dos cursos; el año de compromiso es solo para el colegio pionero, con su oferta propia.

## Qué reglas de la marca siguen

- Logotipo en positivo sobre tiza y en negativo sobre pizarra, a partir de los SVG, sin recomponer. Un solo naranja por fondo: chispa `#E07A3A` sobre pizarra y chispa-texto `#B4531C` sobre claro.
- El naranja es solo para la IA: la «IA» del logotipo y la chispa de las ilustraciones. Las publicaciones no llevan barras ni filetes de adorno; el titular empieza en el margen de 96 px, como el logotipo abajo.
- **Tamaños mínimos, comprobados en el móvil y no solo en escritorio.** `../../logo/construccion.md` pide al menos 24 px de alto para el horizontal y 12 px para la palabra sola. Cada red reduce la imagen al ancho en que la muestra, así que se ha medido el logotipo a ese tamaño: en el móvil, a 390 px de ancho (y a unos 306 px en X, donde una imagen de publicación va en la columna del texto), y en escritorio, al ancho de cada red. Todos quedan por encima del mínimo:

  | Imagen | Logotipo en la imagen | En el móvil | En escritorio |
  |---|---|---|---|
  | `linkedin-banner.png` | Palabra sola, 52 px de alto | 12,8 px (390 px de ancho, ×0,246) | 26 px (804 px) |
  | `x-cabecera.png` | Palabra sola, 50 px | 13 px (390 px, ×0,26) | 20 px (600 px) |
  | `compartir-1200x630.png` | Horizontal, 96 px (512 de ancho) | 31 px en LinkedIn (390 px) · 24,4 px en X (306 px) | 44 px (552 px) |
  | `post-presentacion.png` | Horizontal, 80 px | 26 px (390 px, ×0,325) | 37 px (552 px) |
  | `post-sustituciones.png` | Horizontal, 80 px | 26 px (390 px, ×0,325) | 37 px (552 px) |

  Por debajo de 24 px no se usa el horizontal: por eso las dos cabeceras llevan la palabra sola.

  Las ilustraciones tienen su propio mínimo, 96 px (`../../ilustraciones/LEEME.md`), también medido en el móvil: 96,5 px en el fondo de LinkedIn (392 px × 0,246), 96,2 px en la cabecera de X (370 px × 0,26) y unos 96 px cada paso de las sustituciones.
- **Área de respeto de 1 x** (la altura de la «I» de «IA»), medida desde la tinta en cada PNG. Entre el logotipo y lo más cercano hay 53 px en LinkedIn (1 x = 40 px), 54 px en X (1 x = 38,5 px), 66 px en la imagen para publicaciones y enlaces (1 x = 55 px), 58 px hasta el disco en la presentación y 81 px hasta el texto de los pasos en las sustituciones (1 x = 46 px en las dos). Ninguno toca el borde: el más cercano queda a 1,6 x.
- Ilustraciones del kit sin tocar, con su disco: `colegio-servidor` en las cabeceras, la imagen para publicaciones y enlaces y la presentación, y `jefatura`, `ficha` y `sustituto` en la historia de las sustituciones.
- «DirectorIA» en el titular va en la misma fuente y el mismo color que el resto de la frase. Ningún estilo lo pasa a mayúsculas.
- Verbos de personas para las personas: la IA propone y prepara; jefatura revisa y decide.
- Ningún dato inventado: ni cifras, ni nombres, ni testimonios.

## Cómo cambiarlas

Cada PNG sale de su página en `html/`, que mide exactamente lo mismo que la imagen:

| Página | Imagen |
|---|---|
| `html/avatar.html` | `avatar-400.png` |
| `html/linkedin-banner.html` | `linkedin-banner.png` |
| `html/x-cabecera.html` | `x-cabecera.png` |
| `html/compartir.html` | `compartir-1200x630.png` |
| `html/post-presentacion.html` | `post-presentacion.png` |
| `html/post-sustituciones.html` | `post-sustituciones.png` |

1. Cambiad el texto en el HTML. Los colores están en `html/redes.css` y las zonas que tapa cada red, comentadas en cada página.
2. Regenerad desde la raíz del repositorio:

   ```
   node directoria/aplicaciones/redes/html/generar.mjs                 # todas
   node directoria/aplicaciones/redes/html/generar.mjs sustituciones   # solo las que coincidan
   ```

   Necesita Node 18 o posterior y Playwright con Chromium (`npm install --global playwright@1.63.0` y `npx playwright install chromium`). El script espera a que carguen las fuentes y los SVG, comprueba la medida y escribe un PNG RGB marcado como sRGB. Con los mismos archivos de partida, el resultado es idéntico byte a byte.
3. Mirad la imagen antes de subirla. Si habéis cambiado el tamaño de un logotipo, calculad cuánto medirá en el móvil: su alto en la imagen × 390 ÷ el ancho de la imagen (× 306 ÷ el ancho, si va en una publicación de X). No puede bajar de 24 px con el horizontal ni de 12 px con la palabra sola.

Las páginas cargan las fuentes, el logotipo y las ilustraciones por ruta relativa (`../../../fuentes/`, `../../../logo/`, `../../../ilustraciones/`): hay que mantener la estructura de carpetas de `directoria/`.
