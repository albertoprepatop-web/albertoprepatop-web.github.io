# Web de DirectorIA

Web estática de DirectorIA: una página principal con todo el contenido comercial y dos páginas legales. No necesita compilarse ni ningún programa en el servidor, y funciona igual en la raíz de un dominio que en una subcarpeta (por ejemplo, `/directoria/web/`), porque todas las rutas son relativas.

**Estado: borrador listo para revisar, no para publicar con dominio propio.** Faltan los datos de la empresa (van entre corchetes), la revisión de un abogado de las páginas legales y la confirmación de algunas frases de producto. Mientras tanto, las tres páginas llevan `noindex` para que los buscadores no las indexen. Ver «Antes de publicar».

## Qué hay en la carpeta

| Archivo o carpeta | Qué es |
|---|---|
| `index.html` | La página principal. Secciones: portada, cómo funciona (el servidor en el colegio y una mañana con una ausencia), para cada cargo, la ficha de sustitución, protocolos paso a paso, privacidad, lo que no hace, análisis de gastos gratis, cómo empezamos, precios, preguntas frecuentes y contacto. |
| `aviso-legal.html` | Aviso legal (datos de la LSSI-CE). **Plantilla pendiente de revisión por un abogado.** |
| `privacidad.html` | Política de privacidad de la web: responsable, datos de quien escribe, finalidades, base jurídica, plazos, derechos y AEPD. **Plantilla pendiente de revisión por un abogado.** |
| `estilos.css` | La única hoja de estilos. Los colores de `directoria/tokens.json` están al principio como variables CSS (`--pizarra`, `--tiza`, `--chispa-texto`…). |
| `fuentes/` | Rubik y Nunito Sans en woff2, con `fuentes.css` y sus licencias (SIL OFL 1.1). Copiadas de `directoria/fuentes/`. |
| `img/logo/` | Logotipo horizontal (cabecera), con eslogan en negativo (pie) y horizontal en negativo (imagen para redes). Copiados de `directoria/logo/`. |
| `img/ilustraciones/` | Las 21 ilustraciones del kit (`directoria/ilustraciones/`). La web usa 14; las otras 7 (`acta`, `alerta`, `calendario`, `circular`, `colegio`, `correo`, `microfono`) se dejan para futuras secciones. |
| `img/og.png` | Imagen para compartir en redes (1200 × 630). |
| `img/og-fuente.html` y `img/og-fuente.css` | La página de la que sale `og.png`. No está enlazada desde la web y lleva `noindex`. |
| `favicon.svg`, `favicon.ico` | Icono de pestaña. El `.ico` lleva 16, 32 y 48 px, sacados del favicon dibujado a píxel de `directoria/logo/favicon.svg`. |
| `apple-touch-icon.png` | Icono de 180 px para iPhone y iPad (ficha a sangre: iOS redondea las esquinas). |
| `icon-192.png`, `icon-512.png`, `icon-maskable-512.png` | Iconos del manifiesto. Los dos primeros con las esquinas redondeadas del icono de app; el «maskable» a sangre, para Android. |
| `site.webmanifest` | Manifiesto (nombre, colores e iconos). |

## Cómo verla

- **Lo más fiel:** servirla por HTTP desde la carpeta, por ejemplo con `python3 -m http.server 8000` y abrir `http://localhost:8000/`.
- **Abriendo `index.html` con doble clic** también se ve bien. La consola del navegador avisará de que no puede precargar dos fuentes: es una limitación de los archivos locales (`file://`) y desaparece al servirla por HTTP.

## Cómo publicarla

No hay que compilar nada: se sube la carpeta tal cual.

- **GitHub Pages, en este mismo repositorio.** Si el repositorio ya se publica con GitHub Pages desde la raíz, la web queda en `https://<usuario>.github.io/directoria/web/` sin hacer nada más.
- **Con dominio propio.** Lo recomendable es un repositorio solo para la web: se copia el contenido de esta carpeta a la raíz del repositorio, se activa GitHub Pages (Settings → Pages) y se configura el dominio (archivo `CNAME` y registros DNS que indica GitHub).
- **Cualquier alojamiento estático** (Netlify, Cloudflare Pages o un alojamiento clásico por FTP): se sube el contenido de la carpeta. No necesita PHP, bases de datos ni redirecciones.
- **Cabeceras (opcional).** La política de seguridad ya va dentro de cada página (`<meta http-equiv="Content-Security-Policy">`). Si el alojamiento permite añadir cabeceras HTTP, conviene repetirla como cabecera y añadir `frame-ancestors 'none'`, que solo funciona así.

## Marcadores que hay que rellenar

Todos van entre corchetes y, en las páginas legales, resaltados en naranja claro para que no se escapen. Para encontrarlos: `grep -noE "\[[^]<>]+\]" *.html`.

| Marcador | Dónde | Notas |
|---|---|---|
| `[Razón social]` | Pie de las tres páginas, aviso legal y privacidad | La sociedad titular de DirectorIA. |
| `[NIF]` | Aviso legal y privacidad | |
| `[Dirección postal]` | Aviso legal y privacidad | También es la dirección para ejercer derechos por carta. |
| `[correo@dominio.es]` | Contacto y preguntas frecuentes de la portada, aviso legal y privacidad | **Ojo:** los enlaces `mailto:` llevan la dirección sin corchetes (`correo@dominio.es`). Sustituid primero la forma con corchetes y después la otra: `sed -i -e 's/\[correo@dominio\.es\]/hola@vuestrodominio.es/g' -e 's/correo@dominio\.es/hola@vuestrodominio.es/g' *.html` (en macOS, `sed -i ''`). |
| `[teléfono]` | Contacto y preguntas frecuentes de la portada, aviso legal y privacidad | Se muestra como texto seleccionable; no lleva enlace `tel:` hasta tener el número. |
| `[dominio.es]` | Comentarios de `canonical` y `og:url` en las tres páginas, dirección de la web en el aviso legal | Ver «Antes de publicar». |
| `[Registro Mercantil, tomo, folio, hoja e inscripción]` | Aviso legal | |
| `[Juzgados competentes…]` | Aviso legal | Lo define el abogado. |
| `[proveedor de alojamiento]`, `[proveedor de correo]` | Privacidad | Y el párrafo de transferencias internacionales (por ejemplo, GitHub, Inc. está en EE. UU.). |
| `[plazo, por ejemplo, 12 meses]` | Privacidad | Plazo de conservación de los mensajes si no se llega a un acuerdo. |
| `[Datos de contacto del delegado…]` | Privacidad | Si no hay delegado de protección de datos, se borra la fila. |
| `[fecha]` | Aviso legal y privacidad | Fecha de la última actualización. |

## Antes de publicar

1. **Rellenar los marcadores** de la tabla anterior.
2. **Revisión legal.** Un abogado debe revisar `aviso-legal.html` y `privacidad.html` (con el delegado de protección de datos, si lo hay) y, después, quitar el recuadro «Plantilla pendiente de revisión por un abogado».
3. **Quitar `noindex`.** Borrar la línea `<meta name="robots" content="noindex">` de las tres páginas.
4. **Dirección definitiva.** Descomentar `canonical` y `og:url` con la dirección real, y poner la dirección completa en `og:image` y `twitter:image` (`https://vuestrodominio.es/img/og.png`): las redes sociales no aceptan rutas relativas. Hasta entonces se dejan relativas para que la web funcione en cualquier carpeta.
5. **Confirmar con producto y con el asesor jurídico estas frases**, que la web da por ciertas:
   - «Los datos de vuestros alumnos no salen del colegio» (subtítulo de portada, tomado de la identidad verbal) y «No envía los datos de vuestros alumnos fuera del colegio». Según la revisión jurídica, solo se sostienen si el contrato y la descripción técnica dejan por escrito que el soporte remoto no accede a los datos (o lo hace desde el Espacio Económico Europeo y con contrato de encargo), que las copias de seguridad, actualizaciones y registros de errores no sacan datos del centro, que el correo y el resumen diario no pasan por terceros nuevos y que el módulo de Claude no recibe datos de alumnos. La sección «Privacidad» ya usa la fórmula prudente: «la IA trata los datos de vuestros alumnos en un servidor dentro del colegio, sin transferencias internacionales de esos datos».
   - **Compromiso mínimo de dos cursos escolares.** Es lo que pide el encargo y dice la diapositiva de precios, pero `manual/identidad-verbal.md` dice «Si no estáis contentos, no tenéis ningún compromiso; si seguís, el compromiso es de un año». Hay que decidir cuál vale y cambiar la otra pieza. En la web aparece en «Precios» y en la pregunta «¿Qué compromiso nos pedís?».
   - **Qué pasa con el servidor si un colegio lo deja** (pregunta «¿De quién es el servidor…?»): la web dice que el servidor es del colegio, que DirectorIA cierra sus accesos y devuelve o borra cualquier copia. El contrato debe decir lo mismo.
   - **Sin internet** (pregunta «¿Y si se cae internet?»): la web dice que, desde la red del colegio, se sigue trabajando con fichas, actas, plazos y protocolos.
   - **Reglamento europeo de IA:** la web dice que las guardias se proponen «a partir de los horarios y las normas de vuestro centro». Debe ser así (sin valorar el comportamiento ni los rasgos de los docentes), y DirectorIA debe tener documentado por escrito su análisis.
   - **Tramos de los planes:** la presentación dice «Hasta 40», «40–80» y «80–150 docentes»; la web lo escribe sin solapes: «Hasta 40», «De 41 a 80» y «De 81 a 150».

## Cómo cambiar cosas

- **Textos:** directamente en los HTML. Siguen `manual/identidad-verbal.md`: «vosotros» en la web, «usted» o impersonal en los textos legales; la IA prepara, resume, propone y avisa, y decidir, aprobar y firmar es de personas; sin cifras, estudios ni testimonios que no se puedan enseñar; sin señalar a otras herramientas.
- **DirectorIA en titulares:** no se escribe con Rubik (con la I de palo se lee «DirectorlA»). Por eso ningún titular lleva el nombre, y ningún estilo usa `text-transform: uppercase`.
- **Colores y medidas:** en las variables del principio de `estilos.css`. Combinaciones comprobadas: texto sobre tiza 7,5:1, pizarra sobre tiza 12,4:1, chispa-texto sobre tiza 4,5:1 y sobre papel 4,9:1, chispa sobre pizarra 4,6:1. **Chispa-texto no llega a 4,5:1 sobre salvia ni sobre chispa-suave**: en las secciones salvia los antetítulos pasan a pizarra-línea (6,6:1), y en el aviso de la ficha la etiqueta va en pizarra.
- **El mapa de «Cómo funciona»:** en escritorio (desde 1100 px) se dibuja sobre una rejilla de 1200 × 760. Las posiciones de las personas están en `estilos.css` (bloque 6) y las líneas, en el SVG de `index.html`, con las mismas coordenadas. Si se mueve una persona, hay que mover también su línea. Por debajo de 1100 px, el mapa pasa a una rejilla sin líneas.
- **Imagen para redes (`img/og.png`):** se edita `img/og-fuente.html` y se captura a 1200 × 630, por ejemplo con `node render.mjs img/og-fuente.html img/og.png --width 1200 --height 630` (el renderizador de la marca, con Playwright) o con las herramientas de desarrollo de cualquier navegador.
- **Favicons:** salen de `directoria/logo/favicon.svg` y `directoria/logo/app-icon.svg`. Para regenerarlos: PNG de 16, 32 y 48 px del favicon unidos con ImageMagick (`convert fav-16.png fav-32.png fav-48.png favicon.ico`), y el icono de app a 180 px con fondo `#17322C` (`apple-touch-icon.png`), a 192 y 512 px con fondo transparente y a 512 px con fondo `#17322C` (`icon-maskable-512.png`).

## Decisiones técnicas

- **Sin JavaScript.** El menú del móvil es un `<details>` y las preguntas frecuentes también, así que todo funciona sin scripts. La política de seguridad prohíbe ejecutar ninguno (`script-src 'none'`).
- **Sin peticiones a terceros.** Fuentes, imágenes y estilos se sirven desde la propia web. La política de seguridad de cada página (`default-src 'self'`) lo garantiza: el navegador bloquearía cualquier petición a otro sitio. Los únicos enlaces externos son a la web de la AEPD, y no cargan nada hasta que se pulsan.
- **Sin cookies ni almacenamiento.** Ni cookies, ni `localStorage`, ni analítica. Por eso no hay aviso de cookies, y la política de privacidad lo dice.
- **Sin formulario.** El contacto es por correo (`mailto:`, con el asunto y unas líneas para rellenar) o por teléfono. Un formulario necesitaría un servidor o un servicio externo.
- **Listas con `role="list"`.** Safari con VoiceOver deja de anunciar como lista las listas sin viñetas; el `role="list"` lo corrige. Los validadores lo marcan como redundante: es a propósito.

## Comprobaciones hechas

Hechas el 24 de noviembre de 2026 sobre la web servida por HTTP, en la subcarpeta `/directoria/web/` y también en la raíz de un dominio.

- **Diseño:** capturas de página completa a 1440, 390 y 360 px, y de las secciones delicadas a 768, 1024, 1100 y 1920 px, revisadas una a una. El titular de portada se parte en dos líneas («Vuestra propia IA, / dentro del colegio») en todos los anchos, de 320 a 2560 px.
- **Sin desplazamiento horizontal ni solapes:** barrido automático de 24 anchos, de 320 a 2560 px, en las tres páginas. Ningún elemento se sale de la pantalla y las piezas del mapa no se pisan.
- **Accesibilidad (WCAG 2.1 AA):** axe-core 4.10.2 con las reglas WCAG 2.0 y 2.1 A y AA y las buenas prácticas, con las preguntas frecuentes desplegadas: 0 infracciones en las tres páginas, a 1440 y a 390 px. Revisado además a mano: `lang="es"`, enlace «Saltar al contenido», orden de titulares sin saltos, textos alternativos (las ilustraciones decorativas llevan `alt=""` porque el texto de al lado ya dice lo mismo), foco visible en fondos claros y oscuros, orden de tabulación, zonas táctiles de al menos 44 px en botones, menús y enlaces sueltos (los enlaces dentro de una frase quedan fuera, como permite la norma), `prefers-reduced-motion` y contrastes calculados (ver «Cómo cambiar cosas»). Una sola `h1` por página y ningún salto en el orden de los titulares.
- **HTML válido:** html-validate 9.4.1 con su configuración recomendada: 0 errores, salvo el aviso de `role="list"` explicado arriba.
- **Privacidad de la web:** 0 peticiones a otros sitios, 0 cookies, 0 datos en `localStorage` o `sessionStorage` y 0 scripts, medido con el navegador.
- **Enlaces:** todos los enlaces, anclas, imágenes, fuentes e iconos del manifiesto existen y responden 200.
- **Peso:** la portada pide 24 archivos y pesa unos 223 KB sin comprimir (unos 140 KB transferidos con compresión). El HTML ocupa 10 KB comprimido y la hoja de estilos, 8,5 KB.
- **Textos:** revisión automática de la identidad verbal: ni palabras vetadas («automáticamente», «riesgo cero», «ilegal», «on-premise»…), ni nombres de otras herramientas, ni el nombre mal escrito («Directoria», «DirectorlA», «Director IA»), ni asteriscos, ni cifras o testimonios inventados.
