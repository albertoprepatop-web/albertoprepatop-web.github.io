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
| `membrete.png` | 214 KB · 1241 × 1754 px | Vista previa de `membrete.pdf`, a 150 ppp. |
| `propuesta-comercial.docx` | 139 KB · A4, unas 8 páginas | Plantilla de propuesta comercial: portada, ocho apartados y un anexo opcional (DirectorIA Esencial, sin IA), con los datos que hay que completar entre corchetes. |
| `hoja-comercial.pdf` | 81 KB · A4, 2 páginas | Hoja comercial para enviar por correo o imprimir. |
| `hoja-comercial-1.png` · `hoja-comercial-2.png` | 273 KB · 285 KB · 1241 × 1754 px | Vista previa de cada página, a 150 ppp. |
| `fuente/` | 133 KB | Los archivos que generan todo lo anterior. Ver «Cómo regenerarlo todo». |

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
- **Carta de ejemplo.** Es una carta del día a día a la dirección de un colegio: los próximos pasos después de una demo, con una lista numerada y otra de viñetas. No presenta DirectorIA, así que no lleva el logotipo con eslogan. La instalación va «en la fecha que acordemos»: no prometáis la fecha que elija el colegio, porque cada colegio lleva 4-9 días de trabajo y en verano se juntan las instalaciones.
- **Cartas de presentación.** Las cartas que presentan DirectorIA a un colegio llevan el logotipo con eslogan, como pide el manual del logotipo. La información a las familias sobre DirectorIA la da el colegio, que es el responsable del tratamiento, con su propio membrete: DirectorIA le prepara el borrador y, si lleva la marca de DirectorIA, va detrás del escudo del colegio y más pequeña. En las cartas a un colegio:
  1. Borrad el logotipo de la cabecera e insertad en su lugar `logo/png/logo-eslogan-600.png`, a 55 mm de ancho como mínimo. Así su tinta mide 45 mm, el mínimo impreso.
  2. Poned la sangría izquierda de ese párrafo en −0,5 cm, para que la tinta quede alineada con el texto. Cabe en la cabecera sin mover la carta.
- **El PDF.** `membrete.pdf` es el mismo diseño, hecho desde `fuente/membrete.html`. Sirve para imprimir o para verlo sin Word. `membrete.png` es su vista previa.

## Propuesta comercial (`propuesta-comercial.docx`)

- **Estructura.**
  - La portada lleva el logotipo con eslogan, «Propuesta para [Nombre del colegio]» y la ilustración del colegio con su servidor.
  - Después vienen ocho apartados: 1 Resumen, 2 Qué incluye DirectorIA (por cargo), 3 Privacidad y protección de datos, 4 Instalación y formación, 5 Precio (empieza en página nueva), 6 Análisis de gastos gratuito, 7 Próximos pasos y 8 Firma.
  - Al final, en página aparte, va el **anexo opcional «DirectorIA Esencial, sin IA»**, marcado entre corchetes como opcional. Solo se deja si el colegio ha pedido empezar sin IA: como primera fase, con la fecha del paso a Completo pactada, o porque ha rechazado Completo y pasará cuando lo decida. Lleva qué hace Esencial y qué incluye, su precio, el paso a Completo y su fecha («[fecha pactada / cuando lo decidáis]»). Si se deja, en «Lo que os proponemos», en el Resumen, se elige «DirectorIA Esencial, sin IA, con el paso a Completo del anexo» y se ponen sus importes: así quien firma sabe qué firma. Si el colegio no lo ha pedido, se borra entero, desde el aviso entre corchetes hasta el final. La firma dice «con esta propuesta y, en su caso, con su anexo», así que vale con anexo o sin él.
- **Para rellenarla.** Completad los corchetes y borrad lo que no aplique, como los planes que no proponéis en «Plan propuesto». Los números de página se actualizan solos; si no, seleccionad todo y pulsad F9.
- **Precios de DirectorIA Completo, con IA** (sin IVA; debajo de cada cifra, con el 21 % de IVA):
  - Básico, hasta 40 docentes: cuota inicial de 7.750 € (9.378 € con IVA) y 1.200 € al mes (1.452 € con IVA).
  - Centro, de 41 a 80 docentes: 7.750 € (9.378 €) y 1.600 € al mes (1.936 €).
  - Grande, de 81 a 150 docentes: 9.150 € (11.072 €) y 2.200 € al mes (2.662 €).
  - Con IVA, el primer año sale a 26.802, 32.610 y 43.016 €, y los siguientes, a 17.424, 23.232 y 31.944 €.
  - El compromiso mínimo es de dos cursos escolares.
  - La cuota inicial paga los equipos, que pasan a ser del colegio (el servidor de datos, el servidor de IA y el disco de copias; en el Grande, dos servidores de datos: si uno falla, el otro toma el relevo en 10-15 minutos), su instalación, las 6 horas de formación al claustro, el borrador de la evaluación de impacto y los textos para informar al profesorado y al comité.
  - La propuesta ya no ofrece alquiler. Si el colegio quiere pagar la cuota inicial a plazos, el plan de negocio prevé un renting con una financiera que paga el total a DirectorIA; se añade a mano en la propuesta de ese colegio.
  - Si el precio de los equipos sube más de un 10 % antes del pedido, la cuota inicial sube lo mismo.
  - Aparte, la luz de los equipos: unos 60-118 € al año en el Básico y el Centro, y 71-135 € en el Grande (estimación de los planes).
  - Con unos pocos docentes más, el colegio sigue en su plan: hasta 44 en el Básico, 88 en el Centro y 165 en el Grande. Por encima, presupuesto aparte.
  - La garantía del servidor de IA cubre 3 años; en el cuarto y el quinto, el colegio la renueva por 49,99 € al año, sin IVA porque es un seguro, o paga sus reparaciones. A los 5 o 6 años, los equipos se renuevan con otra cuota inicial.
  - Lo que incluye es la misma lista en la hoja comercial, la web, la presentación y la propuesta: los equipos y su instalación, 6 horas de formación al claustro, soporte en horario lectivo, actualizaciones, una visita al año, el borrador de la evaluación de impacto y los textos para informar al profesorado y al comité (por el reparto de guardias: art. 64.4.d del Estatuto de los Trabajadores), que revisa el delegado de protección de datos del colegio y aprueba el colegio. No añadáis ni quitéis nada en una sola pieza. La propuesta y la web la detallan (actualizaciones de seguridad durante 5 años como mínimo, gestión de las garantías, capítulo de IA de la evaluación de impacto, tiempo de respuesta en el contrato), sin cambiar la lista.
  - Qué paga cada cuota, en la hoja comercial y en la propuesta: la formación y los borradores se hacen una vez y los paga la cuota inicial; la suscripción paga el soporte, las actualizaciones, la visita y la gestión de las garantías. No pongáis la formación en la suscripción: junto a «una visita al año», se leería como 6 horas cada año.
  - Claude: «Claude es opcional. Si lo usáis, el colegio paga su uso directamente a Anthropic, con su propia cuenta.» Sin cifras estimadas de su coste en documentos para clientes.
  - Las condiciones van al mismo tamaño que el resto del texto, sin letra pequeña: no las paséis a una nota al pie.
- **El anexo de DirectorIA Esencial** (sin IVA; debajo, con IVA): Básico, 4.700 € (5.687 €) y 600 € al mes (726 €); Centro, 4.700 € (5.687 €) y 800 € al mes (968 €); Grande, 6.100 € (7.381 €) y 1.100 € al mes (1.331 €). Con IVA, el primer año sale a 14.399, 17.303 y 23.353 €, y los siguientes, a 8.712, 11.616 y 15.972 €; la luz, unos 26-65 € al año. Incluye el servidor de datos y el disco de copias, 4 horas de formación, soporte, actualizaciones, una visita al año y, en «Qué incluye», los papeles: «Los borradores del contrato de encargo, del registro de actividades y de la información al profesorado y al comité (por el reparto de guardias); el de la evaluación de impacto, si vuestro delegado de protección de datos ve que hace falta, y el anexo de IA, ya redactado y sin activar.» Sin datos de alumnos, quizá el Esencial no necesite evaluación de impacto: es una pregunta para el abogado, así que no la deis por segura ni por innecesaria. Por eso «El paso a Completo» trae «la evaluación de impacto o su anexo de IA». El paso a Completo cuesta 3.050 € (3.690 € con IVA) en los tres tamaños, por el servidor de IA, su instalación y 2 horas más de formación, más la diferencia de cuota (600, 800 o 1.100 € al mes; 726, 968 o 1.331 € con IVA), con el precio fijado en el contrato desde el principio. Sobre los datos usa «DirectorIA no guarda datos de alumnos: solo del profesorado y del funcionamiento del colegio» y la frase de las dos versiones: «La aplicación y los datos están en un servidor dentro del colegio…».
- **Privacidad.** Solo hay frases que se pueden demostrar:
  - DirectorIA no guarda datos de alumnos: solo del profesorado y del funcionamiento del colegio (horarios, grupos, aulas, guardias, ausencias del profesorado sin el motivo, plazos, documentos del centro, gastos y contratos); los protocolos son guías de pasos, sin ningún caso abierto en DirectorIA;
  - el correo es la única excepción: lo escriben las familias y puede traer nombres de alumnos; la IA lo lee en el servidor del colegio para resumirlo, y DirectorIA no crea fichas de alumnos ni guarda sus datos aparte;
  - los justificantes los archiva un programa en su carpeta; la IA no los lee (solo los ven el propio docente y quien lleve el personal, con registro de accesos, y se borran cuando pasa el plazo que fije el colegio);
  - la aplicación y los datos están en un servidor dentro del colegio; las copias de seguridad van cifradas, una en el colegio y otra en un centro de datos de la UE; los correos salen por la cuenta del propio colegio, y el mantenimiento a distancia queda registrado; la IA trabaja dentro del colegio, también con el correo;
  - el colegio sigue siendo el responsable del tratamiento;
  - DirectorIA entrega los borradores de la evaluación de impacto, del registro de actividades de tratamiento y de los textos para informar al profesorado y al comité, para que el delegado de protección de datos del colegio los revise y el colegio los apruebe;
  - el módulo opcional de Claude es solo para preparar material didáctico, no para datos de alumnos.

  No añadáis «riesgo cero» ni «cumplimiento garantizado», y nada sobre el Reglamento europeo de IA sin una revisión legal. Tampoco digáis que los datos «no salen» o «se quedan» en el colegio, que las copias «se guardan en el colegio» sin más, ni que Claude «nunca recibe datos»: si hace falta explicarlo, Claude no tiene acceso a los datos del colegio y un filtro está pensado para bloquear datos personales; la norma de uso es no introducirlos.
- **Próximos pasos.** La demo es de 45 minutos en el colegio, con una mañana de ejemplo y sin datos reales: una sustitución, su ficha y un acta. No la ofrezcáis «con vuestros horarios» ni con una sustitución real. La tabla de pasos no se parte entre dos páginas.

## Hoja comercial (`hoja-comercial.pdf`)

- **Página 1:** qué es DirectorIA, el eslogan, la ilustración del colegio con su servidor, qué cambia para cada cargo (una línea por cargo) y «Qué datos guarda y dónde están»: que DirectorIA no guarda datos de alumnos, con la excepción del correo y el módulo de Claude solo para material didáctico; las frases aprobadas sobre los datos, con los justificantes, y quién revisa y quién aprueba la evaluación de impacto.
- **Sitio en la página 1.** Desde el 28 de noviembre de 2026 la privacidad lleva más texto: el recuadro va a 7 mm de la tabla de cargos (antes, 9 mm) y con 6 mm de relleno arriba y abajo (antes, 6,5 mm), y quedan 5,3 mm libres sobre el pie. «DirectorIA propone y una persona decide…» ya no está en esta página: lo dice «Lo que no hace», en la página 2. Si cambiáis una fila de cargos, que siga cabiendo en una línea; «Orientación y convivencia» es el nombre más largo que cabe en su columna.
- **Página 2:** cómo empezamos (demo de 45 minutos con una mañana de ejemplo y sin datos reales; análisis de gastos gratis y antes de firmar, con facturas y contratos solo de empresas y sin nóminas; instalación en un día; formación y soporte), los tres planes de DirectorIA Completo, con IA (cada cifra, con su importe con IVA debajo), las condiciones (qué paga la cuota inicial y su revisión si los equipos suben más de un 10 %, qué incluye la suscripción, la luz y Claude aparte), lo que no hace y el contacto («¿Os lo enseñamos en vuestro colegio?»), que invita a preguntar por la oferta para el primer colegio.
- **Sin DirectorIA Esencial.** La hoja, como la web, solo lleva los precios con IA. Esencial se ofrece en persona (ver «Datos fijados»).
- **Sitio en la página 2.** Con las cifras con IVA ya no cabe nada más: quedan 6 mm entre «Lo que no hace» y el recuadro de contacto, que va anclado al pie. Para hacer sitio, las tarjetas ya no llevan la etiqueta «Suscripción» (lo dice el titular) y en la página 2 los bloques van a 5,5 mm en vez de 7 mm. El margen de docentes (44, 88 y 165) y la oferta pionera completa están en la web y en la propuesta, no en la hoja.
- **Si cambiáis los pasos de «Cómo empezamos»,** que cada título quepa en una línea y no acabe en preposición, y que ningún texto pase de cuatro líneas: con los textos de ahora quedan unos 6 mm libres sobre el recuadro de contacto. Si alguno pasa a dos líneas, los cuatro textos siguen empezando a la misma altura.
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

Son los mismos en todas las piezas (web, presentación, hoja comercial y propuesta), salvo donde se dice otra cosa. Si cambia alguno, cambiadlo en todas.

- **Planes y precios de DirectorIA Completo, con IA, sin IVA y con el IVA (21 %) al lado.** Básico, hasta 40 docentes: 7.750 € (9.378 €) y 1.200 € al mes (1.452 €). Centro, de 41 a 80: 7.750 € (9.378 €) y 1.600 € al mes (1.936 €). Grande, de 81 a 150: 9.150 € (11.072 €) y 2.200 € al mes (2.662 €). Los tramos no se solapan: ningún colegio queda en dos planes a la vez. Con un 10 % de margen, un colegio de 41 a 44 docentes sigue en el Básico; de 81 a 88, en el Centro, y de 151 a 165, en el Grande. Por encima, presupuesto aparte.
- **Cuota inicial.** Paga lo que se hace una vez: los equipos, que pasan a ser del colegio, su instalación, las 6 horas de formación al claustro, el borrador de la evaluación de impacto y los textos para informar al profesorado y al comité. Si el precio de los equipos sube más de un 10 % antes del pedido, sube lo mismo. La luz va aparte.
- **DirectorIA Esencial, sin IA** (4.700 €, 4.700 € y 6.100 € de cuota inicial; 600, 800 y 1.100 € al mes) no va en la web ni en la hoja comercial. Va en la presentación y, solo si el colegio lo pide, en el anexo de la propuesta. Paso a Completo: 3.050 € (3.690 € con IVA), más la diferencia de cuota.
- **Compromiso.** Mínimo de dos cursos escolares.
- **La suscripción incluye** soporte en horario lectivo, actualizaciones (las de seguridad, durante 5 años como mínimo), una visita al año y la gestión de las garantías. La formación, el borrador de la evaluación de impacto y los textos para informar al profesorado y al comité (los revisa el delegado de protección de datos del colegio y los aprueba el colegio) van con la cuota inicial.
- **Claude** es opcional y solo para material didáctico; si lo usan, el colegio paga su uso directamente a Anthropic, con su propia cuenta.
- **Con IA y sin IA.** Guardias, sustituciones, horarios, la ficha de sustitución, plazos de jefatura, las guías de los protocolos, el archivo de los justificantes y el dosier los hace DirectorIA con las reglas y los datos del colegio, sin IA: «DirectorIA propone quién cubre cada hora, con las reglas del colegio». «La IA» solo para lo que escribe la IA: resúmenes y respuestas de correo, actas a partir del dictado, traducciones y lectura fácil, plazos sacados de circulares.
- **Los datos (desde el 28 de noviembre de 2026).** «DirectorIA no guarda datos de alumnos: solo del profesorado y del funcionamiento del colegio.» Las frases aprobadas van sin añadidos, en las dos versiones: «La aplicación y los datos están en un servidor dentro del colegio. La copia de seguridad, cifrada, está en la UE. Los correos salen por la cuenta del propio colegio. El mantenimiento a distancia queda registrado.» En las piezas que venden la versión con IA (la web, la hoja comercial y la propuesta), donde haga falta: «La IA trabaja dentro del colegio, también con el correo», y la excepción del correo (lo escriben las familias y puede traer nombres de alumnos; la IA lo resume en el servidor del colegio, sin crear fichas de alumnos ni guardar sus datos aparte). De los justificantes: «Los justificantes los archiva un programa en su carpeta; la IA no los lee.» Ya no se escribe «y la IA los trata ahí» ni que la IA trata los datos de los alumnos. Nunca que los datos «no salen del colegio».
- **Funciones que ya no están** (desde el 28 de noviembre de 2026): certificados de matrícula y de estudios, autorizaciones de imagen, optativas por alumno, reclamaciones de familias, pautas y anotaciones de orientación, el acta de la junta de evaluación por dictado y las cartas personalizadas a una familia. La ficha de sustitución lleva solo la clase, y los protocolos son guías de pasos. El cargo «Orientación y tutoría» se llama ahora «Orientación y convivencia».
- **Demo.** 45 minutos en el colegio, con una mañana de ejemplo y sin datos reales: una sustitución, su ficha y un acta.
- **Oferta para el primer colegio** (solo el primero, con IA y de más de 40 docentes, es decir, Completo Centro o Grande): equipos e instalación gratis y suscripción desde el tercer mes; sin compromiso los dos primeros meses y, si sigue, un año desde el tercer mes. Los equipos pasan al colegio al empezar el segundo año de suscripción; si se va al acabar el primero, nos los llevamos o los compra por un valor pactado de antemano. Va entera en la web (pregunta «¿Hay una oferta para el primer colegio?») y en la presentación; la hoja comercial solo invita a preguntar por ella. No está en la propuesta: si la ofrecéis, ponedla por escrito en la de ese colegio. El contrato tiene que decir que la cuota incluye la entrega de los equipos, para no pagar IVA como si fueran un regalo: es una lectura del equipo, no de un abogado, y hay que confirmarla con la gestoría. Sin IA no hay oferta pionera que se anuncie.

## Cambio del 26 de noviembre de 2026: precios nuevos

- **Qué cambia.** Hay dos familias de planes: DirectorIA Esencial, sin IA, y DirectorIA Completo, con IA. La hoja comercial, la web y la propuesta llevan los precios de Completo, que es lo que se vende primero. Su cuota inicial pasa de 6.000, 9.000 y 14.000 € a 7.750, 7.750 y 9.150 €. Ahora sigue una regla: cubre lo que cuesta poner en marcha el colegio, también en el peor caso (los equipos, los viajes, la reserva para repuestos y los días de trabajo). El Básico sube porque lleva dos equipos, el servidor de datos y el servidor de IA; el Centro y el Grande bajan porque los equipos cuestan mucho menos que los del presupuesto anterior. Las cuotas mensuales no cambian. Junto a cada precio sin IVA va el precio con IVA, que es lo que suele pagar un colegio: la enseñanza está exenta de IVA y normalmente no lo recupera.
- **Por qué DirectorIA Esencial no está en la web ni en la hoja.** Cada colegio que baja de Completo a Esencial cuesta 9.225 € al año en el plan Centro, y hacen falta 1,2 colegios nuevos con Esencial para compensarlo. Por eso Esencial no se anuncia: se ofrece cuando un colegio rechaza Completo, o como primera fase con la fecha del paso ya pactada. Va en la presentación, que se enseña en persona, y en el anexo opcional de la propuesta.
- **Precios por validar.** Antes de publicar nada con precios: presupuestos por escrito de los equipos (con 30 días de validez), 5-10 entrevistas de precio con colegios y la cláusula de revisión en el contrato.

## Cambio del 28 de noviembre de 2026: sin datos de alumnos

- **Qué decidió el dueño.** DirectorIA no guarda datos de alumnos: solo del profesorado y del funcionamiento del colegio. En un caso de acoso, explica cómo se hace y los pasos que hay que seguir. Y los justificantes del profesorado los archiva un programa en su carpeta, por curso, mes y docente; la IA no los lee.
- **Hoja comercial.** Jefatura: la ficha del sustituto, «solo con la clase». «Orientación y convivencia»: las guías de los protocolos de acoso, absentismo y accidentes, con sus plantillas. Cada docente: sus justificantes, en su carpeta. El recuadro de privacidad se titula «Qué datos guarda y dónde están» y empieza por «DirectorIA no guarda datos de alumnos…», con la excepción del correo; la frase aprobada va sin «y la IA los trata ahí» y con los justificantes. En «Lo que no hace», «No guarda datos de alumnos ni evalúa, puntúa o clasifica a ninguno». Los precios no cambian.
- **Propuesta comercial.** La portada dice «qué datos guarda» en lugar de «cómo trata los datos de vuestros alumnos». En «Qué incluye»: la ficha solo con la clase, el calendario de exámenes y aulas, el informe de ausencias sin el motivo, los justificantes (secretaría y cada docente), las guías de los protocolos, las circulares generales en lectura fácil o traducidas y el plan de convivencia; el correo dictado de los docentes es para las familias del grupo. «Lo que no hace» empieza por «No guarda datos de alumnos». La privacidad añade «Qué datos guarda», «El correo», «Justificantes del profesorado, el único dato de salud que guarda DirectorIA» y «La IA trabaja dentro del colegio, también con el correo». El anexo de Esencial quita los certificados y añade las guías, los justificantes y la frase sobre los datos de alumnos; su párrafo de precios ya no se parte entre dos páginas. En LibreOffice ocupa 8 páginas (antes, 7).
- **Lo que no cambia:** la tarjeta, la firma de correo y el membrete (sus archivos son los mismos), los precios, los nombres de las versiones y la voz.
- **Comprobado:** `hoja-comercial.pdf` regenerada (A4, 2 páginas, fuentes incrustadas) y sus dos PNG revisados a tamaño real: cada fila de cargos en una línea, 5,3 mm libres en la página 1 y 6 mm en la 2. `propuesta-comercial.docx` regenerada y revisada página a página pasada a PDF con LibreOffice, con Rubik y Nunito Sans instaladas.
- **Correcciones de la revisión (28 de noviembre de 2026, por la tarde).**
  - Propuesta, Dirección: «El acta del claustro, a partir del dictado, y el archivo de las actas de claustro y consejo escolar, con buscador.» El acta del consejo escolar ya no se redacta por dictado, porque el consejo trata a veces admisiones y sanciones de alumnos; de él queda el archivo.
  - Propuesta, privacidad: «Justificantes del profesorado, el único dato de salud que guarda DirectorIA.», y en «El responsable es el colegio», los borradores de la evaluación de impacto, del registro de actividades y de los textos para informar al profesorado y al comité. La cuota inicial también incluye esos textos.
  - Anexo de Esencial, «Qué incluye»: los borradores del contrato de encargo, del registro de actividades y de la información al profesorado y al comité (por el reparto de guardias); el de la evaluación de impacto, si el delegado de protección de datos ve que hace falta, y el anexo de IA, sin activar. En «El paso a Completo», «la evaluación de impacto o su anexo de IA» en lugar de «el anexo de la evaluación de impacto», que daba por hecho que el Esencial ya la tiene.
  - Hoja comercial: la cuota inicial (página 2) paga también «los textos para informar al profesorado y al comité»; cabe sin cambiar la altura del párrafo, y siguen los 6 mm libres. La privacidad de la página 1 no cambia: con esos textos pasaba a una línea más y dejaba 0,2 mm sobre el pie. `hoja-comercial-1.png` no cambia. La web también los lleva; falta la presentación, cuya lista de lo que incluye todavía no los nombra (ver `web-pendientes.md`).
  - `membrete.docx`, `tarjeta.pdf`, la firma y `membrete.pdf` siguen siendo los mismos archivos. `generar_docx.py` rehace también el membrete, con el mismo texto pero con otra fecha dentro del archivo; por eso, después de ejecutarlo, se ha vuelto a dejar el `membrete.docx` de antes, para no cambiar un archivo que dice lo mismo.
  - Comprobado: `propuesta-comercial.docx` pasada a PDF con LibreOffice, con Rubik y Nunito Sans instaladas, sigue en 8 páginas, y las páginas que cambian (2-5, 7 y 8) se han revisado una a una; `hoja-comercial.pdf` regenerada (A4, 2 páginas, fuentes incrustadas) y medida: 5,3 mm libres en la página 1 y 6 mm en la 2.
