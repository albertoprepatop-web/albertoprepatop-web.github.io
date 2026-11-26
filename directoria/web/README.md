# Web de DirectorIA

Web estática de DirectorIA: una página principal con todo el contenido comercial y dos páginas legales. No necesita compilarse ni ningún programa en el servidor, y funciona igual en la raíz de un dominio que en una subcarpeta (por ejemplo, `/directoria/web/`), porque todas las rutas son relativas.

**Estado: borrador listo para revisar, no para publicar con dominio propio.** Faltan los datos de la empresa (van entre corchetes), la revisión de un abogado de las páginas legales y que producto confirme algunas frases. Mientras tanto, las tres páginas llevan `noindex` para que los buscadores no las indexen. Ver «Antes de publicar».

## Qué hay en la carpeta

| Archivo o carpeta | Qué es |
|---|---|
| `index.html` | La página principal. Secciones: portada, cómo funciona (el servidor en el colegio y una mañana con una ausencia), para cada cargo, la ficha de sustitución, protocolos paso a paso, privacidad, lo que no hace, análisis de gastos gratis, cómo empezamos, precios, preguntas frecuentes y contacto. |
| `aviso-legal.html` | Aviso legal (datos de la LSSI-CE). **Plantilla pendiente de revisión por un abogado.** |
| `privacidad.html` | Política de privacidad de la web: responsable, datos de quien escribe, finalidades, base jurídica, plazos, derechos y AEPD. **Plantilla pendiente de revisión por un abogado.** |
| `estilos.css` | La única hoja de estilos. Los colores de `directoria/tokens.json` están al principio como variables CSS (`--pizarra`, `--tiza`, `--chispa-texto`…). |
| `fuentes/` | Rubik y Nunito Sans en woff2, con `fuentes.css` y sus licencias (SIL OFL 1.1). Copiadas de `directoria/fuentes/`. |
| `img/logo/` | Logotipo horizontal (cabecera y, al imprimir, pie), con eslogan en negativo (pie en pantalla) y horizontal en negativo (imagen para redes). Copiados de `directoria/logo/`. |
| `img/ilustraciones/` | Las 21 ilustraciones del kit (`directoria/ilustraciones/`). La web usa 14; las otras 7 (`acta`, `alerta`, `calendario`, `circular`, `colegio`, `correo`, `microfono`) se dejan para futuras secciones. |
| `img/og.png` | Imagen para compartir en redes (1200 × 630). |
| `favicon.svg`, `favicon.ico` | Icono de pestaña. El `.ico` lleva 16, 32 y 48 px, sacados del favicon dibujado a píxel de `directoria/logo/favicon.svg`. |
| `apple-touch-icon.png` | Icono de 180 px para iPhone y iPad (ficha a sangre: iOS redondea las esquinas). |
| `icon-192.png`, `icon-512.png`, `icon-maskable-512.png` | Iconos del manifiesto. Los dos primeros con las esquinas redondeadas del icono de app; el «maskable» a sangre, para Android. |
| `site.webmanifest` | Manifiesto (nombre, colores e iconos). |
| `README.md` | Este archivo. **Archivo de trabajo: no se publica.** |
| `img/og-fuente.html` y `img/og-fuente.css` | La página de la que sale `og.png`. **Archivos de trabajo: no se publican.** |

## Cómo verla

- **Lo más fiel:** servirla por HTTP desde la carpeta, por ejemplo con `python3 -m http.server 8000` y abrir `http://localhost:8000/`.
- **Abriendo `index.html` con doble clic** (`file://`) también se ve bien, con sus fuentes. En Chromium (Chrome, Edge), la consola del navegador queda limpia.

## Cómo publicarla

No hay que compilar nada. **Se publica todo menos los tres archivos de trabajo:** `README.md`, `img/og-fuente.html` e `img/og-fuente.css`. No forman parte de la web ni están enlazados desde ella, pero si se suben quedan a la vista de cualquiera (`README.md`, además, como portada del repositorio). Por eso no se sube la carpeta tal cual, sino una copia sin ellos. Desde la raíz del repositorio, en macOS o Linux:

```sh
mkdir -p ~/directoria-web
cp -R directoria/web/. ~/directoria-web/
rm ~/directoria-web/README.md ~/directoria-web/img/og-fuente.html ~/directoria-web/img/og-fuente.css
```

En Windows: copiad la carpeta y borrad esos tres archivos de la copia. Lo que queda (53 archivos) es la web.

- **Con dominio propio (la versión definitiva).** Un repositorio solo para la web: se pone la copia en su raíz, se activa GitHub Pages (Settings → Pages) y se configura el dominio (archivo `CNAME` y registros DNS que indica GitHub). Si ese repositorio necesita un README, que sea uno nuevo y corto, no este.
- **Cualquier alojamiento estático** (Netlify, Cloudflare Pages o un alojamiento clásico por FTP): se sube la copia. No necesita PHP, bases de datos ni redirecciones.
- **GitHub Pages en este mismo repositorio, solo para revisar el borrador.** Si el repositorio ya se publica con GitHub Pages desde la raíz, la web queda en `https://<usuario>.github.io/directoria/web/` sin hacer nada más. Pero así se publica el repositorio entero, este README y los archivos de trabajo incluidos: no vale para la versión definitiva.
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
5. **Confirmar las frases de producto** con producto y con el asesor jurídico. La lista está en `directoria/web-pendientes.md`, fuera de esta carpeta para que no se publique con la web.
6. **Publicar sin los archivos de trabajo**, como se explica en «Cómo publicarla».

## Cómo cambiar cosas

- **Textos:** directamente en los HTML. Siguen `manual/identidad-verbal.md`: «vosotros» en la web, «usted» o impersonal en los textos legales; DirectorIA prepara, resume, propone y avisa, y decidir, aprobar y firmar es de personas; sin cifras, estudios ni testimonios que no se puedan enseñar; sin señalar a otras herramientas. Las frases que tienen que decir lo mismo en todas las piezas:
  - **Con IA y sin IA:** guardias, sustituciones, horarios, la ficha de sustitución, plazos de jefatura, protocolos, certificados y dosier los hace DirectorIA con las reglas y los datos del colegio, sin IA: «DirectorIA propone quién cubre cada hora, con las reglas del colegio», nunca «La IA propone quién cubre…». «La IA» y su insignia, solo en lo que escribe la IA: resúmenes y respuestas de correo, dictados y actas, traducciones y lectura fácil, plazos sacados de circulares, búsqueda por significado y adaptación de recursos. La ficha lleva «Preparada por DirectorIA · confirmada por jefatura», sin insignia.
  - **Los datos:** «La IA trata los datos de vuestros alumnos en un servidor dentro del colegio. La copia de seguridad, cifrada, está en la UE. Los correos salen por la cuenta del propio colegio. El mantenimiento a distancia queda registrado.» (forma corta, donde no cabe entera: «La IA trata los datos de vuestros alumnos dentro del colegio»). Las copias de seguridad van cifradas: una en el colegio y otra en un centro de datos de la UE. Nunca «no salen», «se quedan», «todo queda en el colegio» ni que las copias «se guardan en el colegio» sin más.
  - **Claude:** opcional y solo para material didáctico; «no tiene acceso a los datos del colegio y un filtro está pensado para bloquear datos personales; la norma de uso es no introducirlos». Lo paga el colegio a Anthropic, con su propia cuenta, sin cifra estimada. Nunca «sin datos de alumnos» ni «nunca recibe datos» como garantía.
  - **La demo:** 45 minutos en el colegio con una mañana de ejemplo, sin datos reales: una sustitución, su ficha y un acta. Titular de contacto: «¿Os lo enseñamos en vuestro colegio?».
  - **Lo que incluye:** el servidor y la instalación (cuota inicial); 6 horas de formación al claustro, soporte en horario lectivo, actualizaciones, una visita al año y el borrador de la evaluación de impacto, que revisa el delegado de protección de datos del colegio y aprueba el colegio.
  - **Ejemplos:** todo caso de ejemplo visible lleva su aviso. La ficha: «Ejemplo ficticio de ficha de sustitución: los nombres son inventados.»; el protocolo, que no lleva nombres: «Ejemplo ficticio basado en el protocolo…».
- **DirectorIA en titulares:** el sistema de diseño permite escribirlo en Rubik, del color del titular; en esta web se ha preferido que ningún titular lo lleve, y ningún estilo usa `text-transform: uppercase`.
- **Colores y medidas:** en las variables del principio de `estilos.css`, y solo esas: ni colores sueltos ni transparencias que den mezclas fuera de la paleta. La marca es plana: la cabecera fija es tiza opaca, sin desenfoque. Combinaciones comprobadas: texto sobre tiza 7,5:1, pizarra sobre tiza 12,4:1, chispa-texto sobre tiza 4,5:1 y sobre papel 4,9:1, chispa sobre pizarra 4,6:1. **Chispa-texto no llega a 4,5:1 sobre salvia ni sobre chispa-suave**: en las secciones salvia los antetítulos pasan a pizarra-línea (6,6:1), y en el aviso de la ficha la etiqueta va en pizarra. **Chispa sobre pizarra-2 solo vale desde 24 px**: el enlace de la nota de contacto pasa a tiza al pasar el ratón. Los avisos (como el de «Plantilla pendiente…») van en chispa-suave con el radio de los avisos y sin filete de color a un lado.
- **Tamaño del texto:** nunca por debajo de 14 px (`.875rem`), tampoco en etiquetas, píldoras ni números de paso.
- **Área de respeto del logotipo:** al menos 1 x (la altura de la I de «IA») alrededor de la tinta. Por eso la cabecera de escritorio mide 82 px de alto (unos 23,5 px arriba y abajo del horizontal de 40 px) y el texto del pie empieza a 1,5rem del logotipo con eslogan.
- **El mapa de «Cómo funciona»:** en escritorio (desde 1100 px) se dibuja sobre una rejilla de 1200 × 760. Las posiciones de las personas están en `estilos.css` (bloque 6) y las líneas, en el SVG de `index.html`, con las mismas coordenadas. Si se mueve una persona, hay que mover también su línea. Por debajo de 1100 px, el mapa pasa a una rejilla sin líneas. Los conectores miden 3 px, en pizarra-línea opaco; la línea discontinua se reserva para lo que cruza la frontera del colegio (Claude), y el recinto «Fuera del colegio» va con borde discontinuo en pizarra-línea. La línea de «Una mañana con una ausencia» es continua, porque no sale del colegio.
- **Impresión:** los fondos no se imprimen (es lo predeterminado), así que las secciones oscuras, la caja del análisis y el pie pasan a pizarra sobre blanco, y el pie cambia el logotipo en negativo por el horizontal en positivo (`.logo-impresion`). La etiqueta del mapa y la ventana del protocolo conservan sus colores (`print-color-adjust: exact`).
- **Imagen para redes (`img/og.png`):** se edita `img/og-fuente.html` y se captura a 1200 × 630. Desde esta carpeta, con el renderizador de la marca (Playwright): `node ../aplicaciones/papeleria/fuente/render.mjs img/og-fuente.html img/og.png --width 1200 --height 630`; también vale con las herramientas de desarrollo de cualquier navegador. El horizontal va a 512 px de ancho para que mida al menos 24 px de alto aunque la imagen se vea pequeña (unos 306 px de ancho en X).
- **Favicons:** salen de `directoria/logo/favicon.svg` y `directoria/logo/app-icon.svg`. Para regenerarlos: PNG de 16, 32 y 48 px del favicon unidos con ImageMagick (`convert fav-16.png fav-32.png fav-48.png favicon.ico`), y el icono de app a 180 px con fondo `#17322C` (`apple-touch-icon.png`), a 192 y 512 px con fondo transparente y a 512 px con fondo `#17322C` (`icon-maskable-512.png`).

## Decisiones técnicas

- **Sin JavaScript.** El menú del móvil es un `<details>` y las preguntas frecuentes también, así que todo funciona sin scripts. La política de seguridad prohíbe ejecutar ninguno (`script-src 'none'`).
- **Sin peticiones a terceros.** Fuentes, imágenes y estilos se sirven desde la propia web. La política de seguridad de cada página (`default-src 'self'`) lo garantiza: el navegador bloquearía cualquier petición a otro sitio. Los únicos enlaces externos son a la web de la AEPD, y no cargan nada hasta que se pulsan.
- **Sin precarga de fuentes.** Las fuentes se piden desde `fuentes/fuentes.css`. Un `<link rel="preload">` las adelantaría muy poco y, al abrir la página como archivo (`file://`), llenaría la consola de errores.
- **Sin cookies ni almacenamiento.** Ni cookies, ni `localStorage`, ni analítica. Por eso no hay aviso de cookies, y la política de privacidad lo dice.
- **Sin formulario.** El contacto es por correo (`mailto:`, con el asunto y unas líneas para rellenar) o por teléfono. Un formulario necesitaría un servidor o un servicio externo.
- **Listas con `role="list"`.** Safari con VoiceOver deja de anunciar como lista las listas sin viñetas; el `role="list"` lo corrige. Los validadores lo marcan como redundante: es a propósito.

## Comprobaciones hechas

Hechas el 24 de noviembre de 2026 sobre la web servida por HTTP, en la subcarpeta `/directoria/web/` y también en la raíz de un dominio, y abriendo los archivos directamente (`file://`). Repetidas ese mismo día, después de aplicar las correcciones de la auditoría de voz, diseño, textos legales y condiciones.

- **Diseño:** capturas de página completa a 1440 y 390 px (y a 360 px en la primera pasada), y de las secciones delicadas y las que han cambiado a 360, 768, 992, 1024, 1100 y 1920 px, revisadas una a una. El titular de portada se parte en dos líneas («Vuestra propia IA, / dentro del colegio») en todos los anchos, de 320 a 2560 px. El anillo de la ilustración de portada es un círculo con el mismo centro que el disco (medido en píxeles a 390, 768, 1100 y 1440 px), y la línea de «Una mañana con una ausencia» va del centro del primer disco al del quinto, sin sobrar por ningún lado (de 992 a 2560 px). El mapa, revisado a 1100, 1180, 1280, 1440, 1920 y 2560 px: ninguna línea cruza un texto.
- **Sin desplazamiento horizontal ni solapes:** barrido automático de 24 anchos, de 320 a 2560 px, en las tres páginas. Ningún elemento se sale de la pantalla y las piezas del mapa no se pisan.
- **Texto:** ningún texto por debajo de 14 px en las tres páginas, a 1440, 390 y 360 px (medido en el navegador, con las preguntas desplegadas).
- **Área de respeto del logotipo:** medida en la tinta, a escala 2. Cabecera de escritorio: 23,5 px arriba y 24 px hasta el filete (x = 23 px). Pie: 33 px de la tinta del eslogan al texto (x = 27,7 px).
- **Cabecera fija y anclas:** la cabecera es tiza opaca (sin `backdrop-filter`). Los enlaces del menú, el índice de cargos y «Leer por qué» dejan su destino a la vista, por debajo de la cabecera.
- **Impresión:** PDF en A4 de las tres páginas, con y sin gráficos de fondo. Sin fondos, todo el texto queda en pizarra, texto o chispa-texto sobre blanco, y el pie lleva el logotipo en positivo.
- **Imagen para redes:** `og.png` regenerada a 1200 × 630 y revisada a tamaño real.
- **Accesibilidad (WCAG 2.1 AA):** axe-core 4.10.2 con las reglas WCAG 2.0 y 2.1 A y AA y las buenas prácticas, con las preguntas frecuentes desplegadas: 0 infracciones en las tres páginas, a 1440 y a 390 px. Revisado además a mano: `lang="es"`, enlace «Saltar al contenido», orden de titulares sin saltos, textos alternativos (las ilustraciones decorativas llevan `alt=""` porque el texto de al lado ya dice lo mismo), foco visible en fondos claros y oscuros, orden de tabulación, zonas táctiles de al menos 44 px en botones, menús y enlaces sueltos (los enlaces dentro de una frase quedan fuera, como permite la norma), `prefers-reduced-motion` y contrastes calculados (ver «Cómo cambiar cosas»). Una sola `h1` por página y ningún salto en el orden de los titulares.
- **HTML válido:** html-validate 9.4.1 con su configuración recomendada: 0 errores, salvo los avisos de `role="list"` explicados arriba.
- **Consola del navegador (Chromium):** 0 mensajes y 0 peticiones fallidas en las tres páginas, a 1440 y a 390 px, tanto por HTTP como abiertas con `file://`. Se cargan las cinco variantes de fuente que usa la portada.
- **Privacidad de la web:** 0 peticiones a otros sitios, 0 cookies, 0 datos en `localStorage` o `sessionStorage` y 0 scripts, medido con el navegador.
- **Enlaces:** todos los enlaces, anclas, imágenes, fuentes e iconos del manifiesto existen y responden 200, también en la copia sin archivos de trabajo servida en la raíz de un dominio. El correo de la demo se abre con el asunto «Demo de DirectorIA en nuestro colegio» y las líneas «Colegio y localidad», «Cargo», «Número de docentes» y «Teléfono de contacto».
- **Peso:** la portada pide 24 archivos y pesa unos 225 KB sin comprimir (unos 115 KB si el servidor comprime con gzip el HTML, el CSS y los SVG). El HTML ocupa 10 KB comprimido y la hoja de estilos, 9 KB. El logotipo para imprimir es el mismo archivo que el de la cabecera, así que no añade ninguna petición.
- **Textos:** revisión automática de la identidad verbal: ni palabras vetadas («automáticamente», «riesgo cero», «ilegal», «on-premise», «no salen del colegio», «se quedan», «todo queda», «sin datos de alumnos», «nunca recibe», «¿Probamos…?», «renting»…), ni nombres de otras herramientas, ni el nombre mal escrito («Directoria», «DirectorlA», «Director IA»), ni asteriscos, ni cifras o testimonios inventados. Los precios llevan «sin IVA» junto a cada cifra.
- **Con IA y sin IA (26 de noviembre de 2026):** ninguna frase atribuye a la IA las guardias, la ficha, los plazos de jefatura ni los protocolos («La IA propone quién cubre», «Preparada por la IA», «La IA guía, recuerda y redacta»); la ficha y los documentos del protocolo van sin insignia, y la insignia solo queda en la píldora «La IA propone.» de la portada. La privacidad usa la forma de la copia de seguridad cifrada en la UE. `og.png` regenerada con el subtítulo nuevo. Revisado en capturas a 1440 y 390 px.
