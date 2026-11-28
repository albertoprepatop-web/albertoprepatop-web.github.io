# DirectorIA · Kit de marca

Todo lo que hace falta para presentar DirectorIA, la IA para dirección y claustro que funciona dentro del colegio. Eslogan: **«Vuestra IA, dentro del colegio»**. Segunda línea: **«DirectorIA propone. Vosotros decidís»**.

Si vais a crear algo nuevo, empezad por el manual de marca (`manual/manual-de-marca.pdf`). La versión navegable está en el sistema de diseño de DirectorIA, publicado en claude.ai.

## Qué hay en cada carpeta

| Carpeta | Qué contiene | Empezad por |
|---|---|---|
| `manual/` | El manual de marca: el PDF de 41 páginas, con la vista general de la presentación de 35 diapositivas, la identidad verbal y las fuentes del sistema de diseño (`sistema/project/`). El PDF se regenera con `pdf/generar.mjs`. | `manual-de-marca.pdf` |
| `logo/` | El logotipo «Norte» en SVG (positivo, negativo, a una tinta, vertical, con eslogan, palabra sola, isotipo, favicon e icono de app) y en PNG para correo y redes, con su generador. | `construccion.md` |
| `ilustraciones/` | Las 22 ilustraciones de la marca en SVG y su generador. | `LEEME.md` · `kit.png` |
| `fuentes/` | Rubik y Nunito Sans en woff2, con su licencia SIL OFL, para alojarlas en la web. | `fuentes.css` |
| `tokens.json` | Los colores y las tipografías con sus usos. | — |
| `presentacion/` | Las fuentes de la presentación comercial (35 diapositivas: la apertura, tres partes —Esencial, Completo y comparativa—, el cierre y un anexo), `vista-general.png` y, en `herramientas/`, la vista previa de las diapositivas y lo que falta subir a claude.ai. La presentación se edita y se descarga en PowerPoint o PDF desde el mazo de Slides. | `vista-general.png` · `herramientas/LEEME.md` |
| `demo/` | La demo para enseñar en los colegios. Se entra como directora, jefe de estudios, secretaria, docente, orientador o profesor que sustituye y se ve su panel. Es un solo HTML que funciona sin conexión; la carpeta trae también sus fuentes, el guion de datos y la guía para presentarla. | `README.md` |
| `web/` | La web: portada, privacidad y aviso legal, con favicon, iconos e imagen para compartir. Sin cookies ni fuentes externas. | `README.md` |
| `aplicaciones/papeleria/` | Tarjeta de visita, firma de correo, membrete, propuesta comercial y hoja comercial, con sus generadores. | `README.md` |
| `aplicaciones/redes/` | Avatar, banner de LinkedIn, cabecera de X, imagen para compartir y dos publicaciones, con sus fuentes HTML. | `README.md` |
| `exploracion/` | Los seis conceptos de logotipo que se exploraron antes de elegir «Norte». Solo como archivo. | `propuestas.png` |

## Antes de usar la marca en público

1. **Registro de la marca.** Búsqueda de anterioridades y solicitud en la OEPM, clases 9, 41 y 42. Hasta entonces, sin ® ni ™.
2. **Datos entre corchetes.** Completad [Tu nombre], [teléfono], [correo@dominio.es], [dominio.es], [Razón social], [NIF] y [Dirección postal] en la web, la papelería y la presentación.
3. **Textos legales.** Que un abogado revise la política de privacidad, el aviso legal y las frases sobre protección de datos antes de publicarlos.
4. **Prueba de imprenta.** Una prueba de color del naranja `#B4531C` antes de la primera tirada de tarjetas.

## Cambio del 28 de noviembre de 2026: sin datos de alumnos

El dueño decidió que DirectorIA no guarde datos de alumnos: solo del profesorado y del funcionamiento del colegio. Desde ese día:

- **La frase nueva:** «DirectorIA no guarda datos de alumnos: solo del profesorado y del funcionamiento del colegio.» La frase aprobada sobre los datos sigue igual, sin añadidos, y ya no se dice que la IA trata los datos de los alumnos. En la versión con IA, si hace falta: «La IA trabaja dentro del colegio, también con el correo». El correo es la única excepción: lo escriben las familias y puede traer nombres de alumnos, pero DirectorIA no crea fichas de alumnos ni guarda sus datos aparte.
- **La ficha de sustitución** lleva solo la clase (grupo, materia, hora y aula, la tarea, el material y a quién llamar) y una línea fija que remite al colegio para la salud y las recogidas. **Los protocolos** son guías de pasos, sin ningún caso abierto en DirectorIA.
- **Los justificantes del profesorado:** «Los justificantes los archiva un programa en su carpeta; la IA no los lee.»
- **Cambiados:** la web, la hoja comercial y la propuesta, el manual (`manual/identidad-verbal.md` y el sistema de diseño, con el componente FichaSustitucion), las ilustraciones (solo sus descripciones), las dos publicaciones de redes y `tokens.json`. Cada carpeta lo cuenta en su README, y lo que hay que confirmar antes de publicar está en `web-pendientes.md`.
- **Pendiente:** la demo y la presentación, que cambia otra tarea. Cuando la presentación tenga su `vista-general.png` nueva, hay que regenerar `manual/manual-de-marca.pdf`, que la incluye. Mientras tanto, el PDF va sin la vista de la presentación: la de antes enseñaba diapositivas que ya no valen (el caso de acoso abierto, la ficha con salud y necesidades, certificados y autorizaciones). No lo regeneréis con la `vista-general.png` antigua.
