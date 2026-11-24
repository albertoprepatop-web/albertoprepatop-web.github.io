# Papelería y documentos comerciales de DirectorIA

Esta carpeta tiene la tarjeta de visita, la firma de correo, el membrete, la propuesta comercial y la hoja comercial de DirectorIA. Usan los colores y las fuentes de `../../tokens.json`, el logotipo según `../../logo/construccion.md` y los textos de `../../manual/identidad-verbal.md`.

## Archivos

| Archivo | Tamaño | Qué es |
|---|---|---|
| `tarjeta.pdf` | 24 KB · 2 páginas de 91 × 61 mm | Tarjeta de visita para la imprenta: 85 × 55 mm al corte, con 3 mm de sangrado por cada lado. Página 1: anverso, con el logotipo con eslogan en negativo sobre pizarra. Página 2: reverso, con los datos y el isotipo sobre tiza. |
| `tarjeta-anverso.png` · `tarjeta-reverso.png` | 35 KB · 30 KB · 643 × 416 px | Vistas previas recortadas al corte, a 2x. |
| `firma-correo.html` | 3 KB | Firma de correo, hecha con tablas y estilos en línea. |
| `firma-correo.png` | 49 KB · 936 × 535 px | Vista previa de la firma, en Arial, que es como la verá la mayoría. |
| `membrete.docx` | 46 KB · A4 | Membrete para Word, con los estilos de la marca y una carta de ejemplo a la dirección de un colegio: los próximos pasos después de una demo. |
| `membrete.pdf` | 24 KB · A4, 1 página | El mismo membrete con la misma carta, en PDF. |
| `membrete.png` | 215 KB · 1241 × 1754 px | Vista previa de `membrete.pdf`, a 150 ppp. |
| `propuesta-comercial.docx` | 136 KB · A4, unas 5 páginas | Plantilla de propuesta comercial: portada y ocho apartados, con los datos que hay que completar entre corchetes. |
| `hoja-comercial.pdf` | 79 KB · A4, 2 páginas | Hoja comercial para enviar por correo o imprimir. |
| `hoja-comercial-1.png` · `hoja-comercial-2.png` | 236 KB · 252 KB · 1241 × 1754 px | Vista previa de cada página, a 150 ppp. |
| `fuente/` | 121 KB | Los archivos que generan todo lo anterior. Ver «Cómo regenerarlo todo». |

## Antes de usar nada

- **Cambiad los datos entre corchetes:** [Tu nombre], [Cargo], [teléfono], [correo@dominio.es], [dominio.es], [Razón social], [NIF], [Dirección postal], [Nombre del colegio], [fecha]… En Word, buscad «[» para ir de uno a otro. No pongáis testimonios, nombres de colegios clientes ni cifras que no podáis enseñar.
- **Fuentes.** Todo va en Rubik (títulos) y Nunito Sans (texto), las dos con licencia SIL OFL.
  - Los PDF y los PNG ya llevan las fuentes dentro.
  - Para editar los .docx, **instalad Rubik y Nunito Sans en el ordenador**. Se descargan gratis en Google Fonts. Si no están instaladas, Word pone otra fuente sin remates en su lugar y el documento cambia de aspecto: más ancho o más estrecho, y con otros saltos de línea y de página.
  - Los archivos woff2 de `directoria/fuentes/` son solo para la web. Word no los usa.

## Tarjeta de visita (`tarjeta.pdf`)

- **Medidas.** Corte de 85 × 55 mm y sangrado de 3 mm, en una página de 91 × 61 mm. Los textos quedan a 6 mm del corte (el mínimo es 4 mm). El PDF lleva TrimBox (corte) y BleedBox (sangrado), las fuentes incrustadas y el logotipo en vectores.
- **Anverso.** Logotipo con eslogan en negativo, de 60 mm de ancho (el mínimo es 45 mm).
- **Reverso.**
  - Nombre en Rubik 600 a 10,5 pt.
  - Cargo en chispa-texto.
  - Contacto en Nunito Sans a 7,5 pt.
  - Isotipo de 10 mm de alto (el mínimo es 6 mm): su cuenco mide lo mismo que el bloque de contacto.
- **Para personalizarla,** cambiad los corchetes de `fuente/tarjeta.html` y volved a generarla. Si el nombre es largo, bajad `.nombre` a 9,5 pt.
- **Con la imprenta, antes de la primera tirada:**
  1. **Confirmad el perfil de color.** El PDF va en RGB (sRGB), con pizarra `#17322C`, tiza `#F6F3EC`, chispa `#E07A3A` y chispa-texto `#B4531C`. Pedid que lo conviertan a su perfil CMYK, o que os digan cuál usar. El kit de marca todavía no fija equivalencias CMYK ni Pantone.
  2. **Confirmad el sangrado:** 3 mm por cada lado. El PDF no lleva marcas de corte; si las necesitan, las añade la imprenta.
  3. **Pedid una prueba de color.** Hay que comprobar que `#B4531C` no sale marrón, que la «IA» se distingue y que el fondo pizarra sale uniforme.

## Firma de correo (`firma-correo.html`)

### Preparar la firma

1. **Publicad el logotipo en la web.** La imagen tiene que estar en una dirección pública con https: si se pega desde el ordenador, muchos programas la mandan como adjunto o la bloquean.
   - Subid `directoria/logo/png/logotipo-firma-2x.png`, y también `logotipo-firma.png`, para que queden en `https://[dominio.es]/directoria/logo/png/`.
   - Si este repositorio se publica con GitHub Pages, ya están en esa ruta dentro de la dirección de Pages.
2. **Cambiad los datos.**
   - Abrid `firma-correo.html` con un editor de texto: Bloc de notas, TextEdit en modo texto o VS Code.
   - Cambiad los corchetes. Cambiad también [dominio.es] en la dirección de la imagen y en los enlaces `tel:` y `mailto:`.
3. **Copiadla.** Abrid el archivo en el navegador y comprobad que se ve el logotipo. Después seleccionad todo (Ctrl+A o Cmd+A) y copiadlo (Ctrl+C o Cmd+C).

**Área de respeto del logotipo.** Entre el logotipo y los textos de arriba y de abajo quedan al menos 16 px. Es 1 x, la altura de la I a 118 × 20 px, como pide `logo/construccion.md`. Si retocáis la firma, no bajéis el `padding` de la fila del logotipo (14 px) ni el de la fila del eslogan (12 px), y no pongáis nada a su lado.

### Gmail

1. Pulsad la rueda dentada, luego «Ver todos los ajustes». En la pestaña «General», id a «Firma» y pulsad «Crear nueva». Ponedle un nombre, por ejemplo «DirectorIA».
2. Pegad la firma en el cuadro (Ctrl+V o Cmd+V).
3. Gmail no deja fijar el tamaño exacto de una imagen. Si el logotipo sale más grande de la cuenta, usad en la firma `logotipo-firma.png`, que ya mide 118 × 20 px, y volved a pegarla.
4. En «Valores predeterminados de firma», elegidla para los correos nuevos y para las respuestas.
5. Bajad hasta el final de la página y pulsad «Guardar cambios».
6. Enviaos un correo de prueba y abridlo también en el móvil.

### Outlook

- **Outlook nuevo y Outlook en la web.**
  1. Pulsad la rueda dentada y luego «Cuentas» → «Firmas» → «Nueva firma».
  2. Ponedle un nombre y pegad la firma.
  3. Elegidla como firma predeterminada para los mensajes nuevos y para las respuestas.
  4. Pulsad «Guardar».
- **Outlook clásico para Windows.**
  1. Id a «Archivo» → «Opciones» → «Correo» → «Firmas…» → «Nueva» y ponedle un nombre.
  2. Pegad la firma en «Editar firma».
  3. Elegidla en «Mensajes nuevos» y en «Respuestas o reenvíos», y pulsad «Aceptar».
  4. Si al pegarla se pierde el formato: cerrad Outlook, guardad el `firma-correo.html` ya cambiado como `DirectorIA.htm` en la carpeta `%APPDATA%\Microsoft\Signatures` y volved a abrir Outlook. La firma aparece en la lista.
- **Outlook para Mac.**
  1. Id a «Outlook» → «Configuración» → «Firmas» y pulsad «+».
  2. Pegad la firma y ponedle un nombre.
  3. Elegidla como firma predeterminada.
- Enviaos un correo de prueba.

### Cómo se ve en cada programa

- **Imágenes bloqueadas.** Muchos programas no enseñan las imágenes hasta que quien recibe el correo lo permite. Por eso DirectorIA va también escrito en el texto, y la imagen lleva «DirectorIA» como texto alternativo.
- **Fuentes.** La firma sale en Nunito Sans si quien la recibe la tiene instalada; si no, en Arial o Helvetica.
- **Modo oscuro.** Algunos programas ponen un fondo oscuro detrás del logotipo, y «Director» casi desaparece. El nombre escrito lo cubre.

## Membrete (`membrete.docx` y `membrete.pdf`)

- **Página.** A4, con márgenes de 40 mm arriba, 28 mm abajo y 25 mm a los lados.
- **Cabecera.** `logo/png/logo-horizontal-600.png` a 45 mm de ancho. El logotipo en sí mide 36,9 mm y empieza en el margen: el resto de la imagen es su área de respeto, transparente.
- **Pie.** [Razón social] · [NIF] · [Dirección postal] · [teléfono] · [correo@dominio.es] · [dominio.es], a 7,5 pt.
- **Estilos** (Inicio → Estilos). Los colores y las fuentes del tema de Word también son los de la marca.
  - Título: Rubik 20 pt, pizarra.
  - Título 1: Rubik 15 pt.
  - Título 2: Rubik 11,5 pt.
  - Normal: Nunito Sans 10,5 pt, color texto `#41524D`.
  - Lista con viñetas y Lista con números, con la viñeta o el número en pizarra-linea `#2E5A50`. Los números de los apartados de la propuesta, también. El naranja es solo para la IA: no lo uséis en viñetas, números ni filetes.
  - Propios: Antetítulo (mayúsculas espaciadas en chispa-texto), Antetítulo con nombre (sin mayúsculas: usadlo si el antetítulo lleva DirectorIA, para que no salga «DIRECTORIA»), Destacado (una frase sobre fondo salvia, sin filete de color a un lado), Nota, Tabla y Pie DirectorIA.
- **Para usarlo.** Abridlo, cambiad los corchetes y escribid encima de la carta de ejemplo. Para tenerlo como plantilla: «Archivo» → «Guardar como» → «Plantilla de Word (*.dotx)».
- **Carta de ejemplo.** Es una carta del día a día a la dirección de un colegio: los próximos pasos después de una demo, con una lista numerada y otra de viñetas. No presenta DirectorIA, así que no lleva el logotipo con eslogan. La instalación va «en la fecha que acordemos»: no prometáis la fecha que elija el colegio, porque en verano se instala un colegio al día.
- **Cartas de presentación.** Las cartas que presentan DirectorIA a un colegio llevan el logotipo con eslogan, como pide el manual del logotipo. La información a las familias sobre DirectorIA la da el colegio, que es el responsable del tratamiento, con su propio membrete: DirectorIA le prepara el borrador y, si lleva la marca de DirectorIA, va detrás del escudo del colegio y más pequeña. En las cartas a un colegio:
  1. Borrad el logotipo de la cabecera e insertad en su lugar `logo/png/logo-eslogan-600.png`, a 55 mm de ancho como mínimo. Así su tinta mide 45 mm, el mínimo impreso.
  2. Poned la sangría izquierda de ese párrafo en −0,5 cm, para que la tinta quede alineada con el texto. Cabe en la cabecera sin mover la carta.
- **El PDF.** `membrete.pdf` es el mismo diseño, hecho desde `fuente/membrete.html`. Sirve para imprimir o para verlo sin Word. `membrete.png` es su vista previa.

## Propuesta comercial (`propuesta-comercial.docx`)

- **Estructura.**
  - La portada lleva el logotipo con eslogan, «Propuesta para [Nombre del colegio]» y la ilustración del colegio con su servidor.
  - Después vienen ocho apartados: 1 Resumen, 2 Qué incluye DirectorIA (por cargo), 3 Privacidad y protección de datos, 4 Instalación y formación, 5 Precio, 6 Análisis de gastos gratuito, 7 Próximos pasos y 8 Firma.
- **Para rellenarla.** Completad los corchetes y borrad lo que no aplique, como los planes que no proponéis en «Plan propuesto». Los números de página se actualizan solos; si no, seleccionad todo y pulsad F9.
- **Precios, sin IVA:**
  - Básico, hasta 40 docentes: cuota inicial de 6.000 € y 1.200 € al mes.
  - Centro, de 41 a 80 docentes: 9.000 € y 1.600 € al mes.
  - Grande, de 81 a 150 docentes: 14.000 € y 2.200 € al mes.
  - El compromiso mínimo es de dos cursos escolares.
  - La cuota inicial incluye el servidor, que pasa a ser del colegio, y la instalación. Si el colegio lo prefiere, el servidor también se puede pagar mediante alquiler.
  - La suscripción incluye 6 horas de formación al claustro, soporte en horario lectivo, actualizaciones, una visita al año y el borrador de la evaluación de impacto, que revisa el delegado de protección de datos del colegio y aprueba el colegio. Es la misma lista que en la hoja comercial, la web y la presentación: no añadáis ni quitéis nada en una sola pieza.
  - Claude: «Claude es opcional. Si lo usáis, el colegio paga su uso directamente a Anthropic, con su propia cuenta.» Sin cifras estimadas de su coste en documentos para clientes.
  - Las condiciones van al mismo tamaño que el resto del texto, sin letra pequeña: no las paséis a una nota al pie.
- **Privacidad.** Solo hay frases que se pueden demostrar:
  - la IA trata los datos de vuestros alumnos en un servidor dentro del colegio, sin transferencias internacionales de esos datos;
  - el colegio sigue siendo el responsable del tratamiento;
  - DirectorIA entrega los borradores de la evaluación de impacto y del registro de actividades de tratamiento, para que el delegado de protección de datos del colegio los revise y el colegio los apruebe;
  - el módulo opcional de Claude es solo para preparar material didáctico, no para datos de alumnos.

  No añadáis «riesgo cero» ni «cumplimiento garantizado», y nada sobre el Reglamento europeo de IA sin una revisión legal. Tampoco digáis que los datos «no salen» o «se quedan» en el colegio, ni que Claude «nunca recibe datos»: si hace falta explicarlo, Claude no tiene acceso a los datos del colegio y un filtro está pensado para bloquear datos personales; la norma de uso es no introducirlos.
- **Próximos pasos.** La demo es de 45 minutos en el colegio, con una mañana de ejemplo y sin datos reales: una sustitución, su ficha y un acta. No la ofrezcáis «con vuestros horarios» ni con una sustitución real. La tabla de pasos no se parte entre dos páginas.

## Hoja comercial (`hoja-comercial.pdf`)

- **Página 1:** qué es DirectorIA, el eslogan, la ilustración del colegio con su servidor, qué cambia para cada cargo (una línea por cargo) y la privacidad, con quién revisa y quién aprueba la evaluación de impacto.
- **Página 2:** cómo empezamos (demo de 45 minutos con una mañana de ejemplo y sin datos reales; análisis de gastos gratis y antes de firmar, con facturas y contratos solo de empresas y sin nóminas; instalación en un día; formación y soporte), los tres planes con lo que incluye la suscripción y lo que se paga aparte (Claude, a Anthropic), lo que no hace y el contacto («¿Os lo enseñamos en vuestro colegio?»).
- **Si cambiáis los pasos de «Cómo empezamos»,** que cada título quepa en una línea y no acabe en preposición, y que ningún texto pase de cuatro líneas: con los textos de ahora quedan unos 10 mm libres sobre el recuadro de contacto. Si alguno pasa a dos líneas, los cuatro textos siguen empezando a la misma altura.
- **Viñetas y guiones** en pizarra-linea, como en el resto de la marca: el naranja queda para los antetítulos y la IA.
- **Impresión.** Página blanca con márgenes de 14 mm y sin sangrado, para que salga bien en la impresora de la oficina.
- **Vuestros datos de contacto:** cambiad los corchetes de `fuente/hoja-comercial.html` y volved a generarla.

## Cómo regenerarlo todo

Desde la carpeta de la papelería: `bash fuente/construir.sh`. En unos segundos rehace los PDF, los PNG y los .docx.

**Qué hay en `fuente/`:**

| Archivo | Para qué |
|---|---|
| `tarjeta.html` · `membrete.html` · `hoja-comercial.html` | Las piezas en HTML. Usan las fuentes de `directoria/fuentes/` y los SVG del logotipo y de las ilustraciones. |
| `generar_docx.py` · `marca_docx.py` | Generan los dos .docx con python-docx. `marca_docx.py` tiene los estilos de la marca. |
| `cajas_pdf.py` | Ajusta el tamaño exacto de página y añade TrimBox y BleedBox a los PDF. |
| `render.mjs` · `package.json` | Pasan el HTML a PDF o a PNG con Chromium (Playwright 1.63.0). |
| `construir.sh` | Lo hace todo. |
| `recursos/colegio-servidor.png` | La ilustración clave en PNG, para la portada de Word. |

**Qué hace falta:**
- Node 18 o posterior; la primera vez, `npm install` y `npx playwright install chromium` dentro de `fuente/`.
- Python 3 con `python-docx` y `pypdf`.
- `pdftoppm` (poppler-utils) e ImageMagick.

**Sin esas herramientas:** abrid el HTML en Chrome → «Imprimir» → destino «Guardar como PDF», márgenes «Ninguno» y «Gráficos de fondo» activado. Sale el mismo diseño, pero sin TrimBox ni BleedBox. Si es la tarjeta, decidle a la imprenta que la página ya incluye 3 mm de sangrado.

## Datos fijados

Son los mismos en todas las piezas (web, presentación, hoja comercial y propuesta). Si cambia alguno, cambiadlo en todas.

- **Planes y precios, sin IVA.** Básico, hasta 40 docentes: 6.000 € y 1.200 € al mes. Centro, de 41 a 80: 9.000 € y 1.600 € al mes. Grande, de 81 a 150: 14.000 € y 2.200 € al mes. Los tramos no se solapan: ningún colegio queda en dos planes a la vez.
- **Compromiso.** Mínimo de dos cursos escolares.
- **La suscripción incluye** 6 horas de formación al claustro, soporte en horario lectivo, actualizaciones, una visita al año y el borrador de la evaluación de impacto (lo revisa el delegado de protección de datos del colegio y lo aprueba el colegio).
- **Claude** es opcional y solo para material didáctico; si lo usan, el colegio paga su uso directamente a Anthropic, con su propia cuenta.
- **Demo.** 45 minutos en el colegio, con una mañana de ejemplo y sin datos reales: una sustitución, su ficha y un acta.
- **Oferta para el primer colegio** (solo el primero): servidor e instalación gratis y suscripción desde el tercer mes; sin compromiso los dos primeros meses y, si sigue, un año desde el tercer mes. No está en estas plantillas: si la ofrecéis, ponedla por escrito en la propuesta de ese colegio.
