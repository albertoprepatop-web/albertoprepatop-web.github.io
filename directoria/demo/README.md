# Demo de DirectorIA

Una aplicación de ejemplo para enseñar DirectorIA en la reunión con un colegio. Primero se elige un cargo: dirección, jefatura de estudios, secretaría, docente, orientación o profesor que sustituye. Después se entra en su panel, que tiene:

- el resumen del día;
- el correo resumido, con respuestas ya propuestas para revisar y enviar;
- las funciones propias de ese cargo.

Todo es inventado y nada sale de la página. Y la demo cuenta lo que hace el producto: **DirectorIA no guarda datos de alumnos: solo del profesorado y del funcionamiento del colegio.**

## Cómo abrirla

- **En claude.ai:** [Demo de DirectorIA](https://claude.ai/artifact/QVHqnL2PZ1ioxfGBxAEBMq). Es el enlace para enseñarla o mandarla. Enseña la última versión que se ha publicado ahí: después de cambiar la demo, volved a publicar `demo-directoria.html` en ese mismo enlace antes de mandarlo (ver «Cómo cambiarla»).
- **Sin conexión:** abrid `index.html` en el navegador. Lleva dentro las fuentes, el logotipo y las ilustraciones, y no carga nada de internet.
- **Pantalla:** se ve bien en el móvil, pero para enseñarla es mejor un portátil o la pantalla de la sala. Para enseñarla, a pantalla completa (F11; en Mac, ⌃⌘F) y con el zoom al 100 %: en un portátil de 1366×768 con la barra de pestañas y la de marcadores, o con el zoom al 110 %, la fila de 3.º B del Inicio no cabe entera en la primera pantalla.
- **Estado:** lo que hagáis (confirmar guardias, enviar correos, marcar plazos) se guarda solo en esa pestaña. «Reiniciar la demo» lo deja todo como al principio, y cerrar la pestaña también.
- **Ir directo a una pantalla:** añadid al enlace `#perfil` o `#perfil-función`. Por ejemplo, `#jefatura-guardias`, `#sustituto-ficha` o `#docente-dictado`.

## El colegio de ejemplo

Colegio Ejemplo, miércoles 18 de noviembre de 2026, a las 8:00. Sergio Prieto, tutor de 3.º B, no viene: el motivo no se guarda, y su justificante está pendiente. A partir de ahí se encadena todo lo demás.

| Perfil | Persona | Qué enseña |
|---|---|---|
| Dirección | Elena Ruiz, directora | Resumen de las 8:00, correo resumido, dosier para la inspección, acta del claustro a partir de un dictado, la convocatoria del consejo escolar, pendiente de firma, y las guías de los protocolos (acoso, absentismo y accidentes) |
| Jefatura de estudios | Javier Martín | Guardias de hoy, fichas de sustitución (solo la clase), calendario de exámenes, programaciones frente al modelo del centro y ausencias del profesorado, sin motivos |
| Secretaría | Carmen López | Analista de gastos, justificantes del profesorado (los archiva un programa en carpetas) y plazos de las circulares y del edificio |
| Docente | Laura Sánchez, tutora de 4.º A | Correo dictado a las familias de su grupo, banco de recursos, material con Claude, sus plazos y sus justificantes |
| Orientación | Andrés Vidal, orientador | Guías de los protocolos (acoso, absentismo y accidentes), plan de convivencia y una circular adaptada a lectura fácil y al inglés |
| Profesor que sustituye | Pablo Sanz, maestro de apoyo | Sus fichas para cubrir 3.º B (solo la clase) y su jornada |

En ningún perfil sale un alumno: ni nombres, ni salud, ni recogidas, ni casos. Las familias escriben de temas generales («mi hijo», «una familia de 4.º A»).

## Recorrido de 10 minutos

La pantalla de entrada tiene este mismo recorrido, en «Recorrido para enseñarla». Seguid el orden: el primer paso cambia lo que se ve en los siguientes.

1. **Falta un profesor** (Jefatura de estudios → Guardias de hoy).
   - DirectorIA propone quién cubre cada sesión de Sergio con las reglas del colegio: horarios, guardias y reparto. Para esto no hace falta IA.
   - Si queréis enseñar que decide jefatura, cambiad antes una propuesta en su desplegable. Por ejemplo, Rosa Medina en el recreo, en lugar de Teresa Gil: el Inicio de cada perfil enseña a la elegida.
   - Si cambiáis la 1.ª o la 6.ª, que DirectorIA proponía para Pablo Sanz, su Inicio lo dice («Ya no la cubres · La cubre Rosa Medina»). Si elegís a Pablo Sanz para la 3.ª o el recreo, su Inicio también lo enseña: la sesión sale en su día («Elección: tú»), un aviso dice qué deja de hacer a esa hora y, al confirmar, la línea de su día dice todo lo que cubre («la 1.ª, la 3.ª, la 6.ª y la salida»).
   - Las fichas siguen la propuesta inicial: las de Pablo («Tus fichas de hoy» y «Tu jornada») y la vista previa de jefatura («Fichas de sustitución», donde la de 3.ª dice «Hoy vigila Teresa Gil»). Si cambiáis la propuesta, no las abráis después.
   - Pulsad «Confirmar todas». Todas quedan confirmadas a la misma hora.
   - Qué decir: «Hasta que jefatura confirma, no se avisa a nadie».
   - Si os preguntan quién recupera la guardia: nadie. Quien cubre una guardia no recupera esa hora y nadie le debe una guardia a nadie. Lo enseña el correo de Laura Sánchez en jefatura («Mi guardia del jueves coincide con una tutoría»):
     - Laura pide que otra persona cubra su guardia del jueves y no propone a nadie: decide jefatura.
     - La nota de DirectorIA propone a Rosa Medina con las reglas del colegio: primero, quien tiene guardia a esa hora; si no hay, quien tiene hora libre; entre varios, quien lleva menos guardias este mes. A 4.ª no hay nadie más de guardia y Rosa es la única con esa hora libre: por eso es ella, aunque hoy DirectorIA también la proponga para la 3.ª de 3.º B.
     - La nota avisa además de que el viernes 27 Laura está en la salida y hay que cubrir su guardia de 3.ª. Ese choque sale también en la agenda de jefatura y en el Inicio de Laura, sin insignia: lo detecta DirectorIA con su horario y la salida.
     - Las dos respuestas propuestas le dicen que el jueves la cubre Rosa Medina y que la del viernes 27 también la cubre otra persona, sin pedirle nada. Al enviar una, el Inicio de Laura lo dice («la cubre Rosa Medina») y su choque del viernes 27 pasa a «Confirmado». En jefatura, ese choque sigue abierto, sin enlace: quién la cubre se decide ese día, en «Guardias de hoy». Si archiváis el correo, Laura sigue sin respuesta.
2. **La ficha de quien sustituye** (Profesor que sustituye → Tus fichas de hoy).
   - Solo la clase: grupo, materia, hora y aula; la tarea, que sale de la programación quincenal de Sergio; el material y dónde está, y a quién llamar (tutoría, jefatura y conserjería, con su extensión). «Preparada por DirectorIA · confirmada por jefatura».
   - Y una línea fija, igual en todas las fichas: «Las indicaciones de salud y de recogida de los alumnos no están en DirectorIA: las tiene el colegio. Pregúntalas en conserjería o a la tutora antes de empezar.»
   - Qué decir: «DirectorIA no guarda datos de alumnos: solo del profesorado y del funcionamiento del colegio».
   - La ficha se cierra al acabar la jornada y queda registrado quién la abre.
   - Si no se han confirmado las guardias, la ficha espera y ofrece ir a jefatura.
3. **El resumen de las 8:00** (Dirección → Inicio).
   - Enseñad primero las cifras de arriba. Cada una lleva a donde se actúa:
     - lo que espera la firma de Elena;
     - los correos por responder, resumidos con IA;
     - los 3 días que quedan para avisar a la empresa de fotocopiadoras. Solo los da por avisados la respuesta «Comunicar el preaviso»: con otra (la que sale elegida pide la oferta por escrito), la cuenta atrás sigue y la cifra dice que falta el preaviso;
     - el dosier para inspección, con 6 de 8 piezas listas.
   - Después, la fila de 3.º B, que dice quién cubre cada sesión de Sergio:
     - Antes de que jefatura confirme, cada sesión sale «Por confirmar», con borde discontinuo y la propuesta debajo («Propuesta: Pablo Sanz»). Si entráis aquí antes del paso 1, el atajo «Ver la propuesta (atajo de la demo)» lleva a jefatura.
     - Cuando jefatura confirma, pasan a «Confirmada», en pizarra y con la hora: «Cubre Pablo Sanz · Confirmada a las 8:01». Si confirma una a una, la línea de debajo dice cuántas lleva («Jefatura ha confirmado 2 de 4…»).
     - Si en el paso 1 elegisteis a otra persona, todos los paneles enseñan a la elegida: «Cubre Rosa Medina · Confirmada a las 8:01» (antes de confirmar, «Elección: Rosa Medina»). Qué decir: «DirectorIA propone con las reglas del colegio, y tú decides».
   - Firmad la convocatoria del consejo escolar (Pendiente de firma: marcad las cuatro comprobaciones y pulsad «Firmar la convocatoria») y volved al Inicio:
     - la cifra de la firma baja de 2 a 1, y ahora lleva al acta;
     - la fila de la convocatoria baja al final de «Hoy», con «Firmada a las 8:0x», y el recuento de «Hoy» baja.
     - Si dais también el visto bueno al acta, la cifra pasa a «Todo firmado», con la hora.
   - El dosier, en este orden: primero el visto bueno (Dosier para inspección) y después, en el correo de la inspección, la respuesta «Confirmar y enviar ya el dosier». En «Lo que viene», el lunes 23 dice entonces «Enviado sin el acta del martes 17. Esa acta, antes de este día.»: el plazo sigue abierto para el acta de Matemáticas que falta, así que no pasa a ✓. Con solo el visto bueno, dice que falta enviarlo; si lo enviáis sin el visto bueno, también lo dice. El dosier son documentos del centro, sin datos de alumnos.
4. **Un correo dictado** (Docente → Correo dictado).
   - Pulsad «Empezar a dictar» y después «Redactar el correo».
   - Laura lo cuenta como se lo contaría a un compañero y le llega redactado el recordatorio de la salida para todas las familias de 4.º A: una comunicación general, sin datos de ningún alumno. Lo revisa y lo envía ella.
   - Si volvéis al Inicio antes de enviarlo, la cifra del correo a las familias dice «Por revisar», con «Revisar y enviar».
5. **La guía de un protocolo** (Orientación → Guías de protocolos; las mismas guías están en Dirección → Guías de protocolos).
   - El protocolo de acoso de la Comunidad de Madrid, paso a paso: en cada paso, qué se hace, quién lo hace, el plazo, el anexo (la plantilla oficial en blanco, para descargar e imprimir) y qué hay que cuidar. Los tres pasos que solo van si se confirma, aparte. Con las pestañas, absentismo y accidentes.
   - Qué decir: no se abre ningún caso en DirectorIA; los datos del caso van donde manda el protocolo, Raíces y el expediente del centro. Si hay acoso, y con qué medidas, lo decide la dirección. La guía es la lectura del protocolo que ha hecho el equipo de DirectorIA, no la de un abogado.
   - Si quien os escucha es la directora, enseñadla desde su perfil: en el de acoso, casi todos los pasos son de la dirección, y su Inicio la enlaza desde «Para saber».
6. **El analista de gastos** (Secretaría → Analista de gastos).
   - Facturas, contratos y extractos de octubre, con avisos de renovaciones y posibles ahorros.
   - Secretaría lo envía a dirección y a la titularidad, que son quienes deciden.
7. **Un justificante, a su carpeta** (Docente → Tus justificantes; después, Secretaría → Justificantes y Jefatura de estudios → Ausencias).
   - Laura elige la ausencia del lunes 16 y el archivo (en la demo, uno de ejemplo), ve el nombre que le va a dar el programa («Justificantes/2026-27/2026-11/Laura Sánchez/2026-11-16 justificante.pdf») y lo sube.
   - En secretaría sale en su carpeta, por curso, mes y docente, y la cifra del Inicio pasa de 5 a 6 de 7 entregados. Hasta entonces, su hueco decía «Sin archivo todavía». El registro de accesos dice quién sube cada uno y quién lo abre. En jefatura, el informe de ausencias dice «Entregado», sin el motivo y sin el archivo.
   - Qué decir: «Los justificantes los archiva un programa en su carpeta; la IA no los lee». Lo ven el docente y quien lleva el personal, con registro de accesos, y se borran cuando pasa el plazo que fija el colegio. Se suben por DirectorIA, no por correo.

El correo funciona igual en todos los perfiles. Cada mensaje llega resumido, con lo que piden y hasta tres respuestas propuestas. Se elige una, se cambia si hace falta y se envía después de confirmar. Los que solo informan se archivan sin responder.

## Lo que no sale en la demo

La demo es el Completo y no enseña todas las funciones. Si os preguntan por una de estas, contadla; no la busquéis en la demo:

- **Dirección:** el archivo de actas (del claustro y del consejo escolar), con su búsqueda por palabras y, en Completo, también por tema. La demo enseña el acta del claustro a partir del dictado y nombra el archivo («queda en el archivo de actas»), pero no lo abre.
- **Jefatura de estudios:** los horarios, con el programa que cuadra las restricciones, y las aulas, con aviso de cada choque (solo salen los exámenes, con el suyo). En las programaciones, la demo compara cada una con los apartados del modelo (Esencial); la revisión de que cada apartado tenga sentido (Completo) no sale.
- **Secretaría:** las facturas escaneadas o en foto (Completo). El analista de gastos habla de facturas, contratos y extractos, sin distinguir.
- **Docentes:** la programación quincenal, que solo sale como plazo (la entrega del viernes 20) y como origen de la tarea de la ficha, y el asistente para dudas sobre los documentos del centro, que cita la fuente (Completo).
- **Para todos:** las copias de seguridad cifradas (una en el colegio y otra en la UE). Los permisos por cargo se ven en que cada perfil solo tiene lo suyo, pero no hay cuentas: se entra eligiendo un perfil.
- **Esencial:** la demo no tiene una versión aparte. Es lo mismo sin nada de lo que lleva la insignia o «con IA» (ver abajo): sin correo resumido (el resumen de las 8:00 trae quién falta, qué vence y qué hay que firmar), sin dictado ni acta por dictado, sin plazos sacados de las circulares y con el banco de recursos buscando por palabras.

## Qué lleva IA y qué no

- **«Preparado con IA», con la insignia naranja.** Solo aparece donde ha escrito el modelo de lenguaje:
  - los resúmenes y las respuestas del correo;
  - el dictado y el acta;
  - los plazos sacados de circulares y correos;
  - en el banco de recursos, la versión adaptada a otro curso y el título que propone al subir;
  - las traducciones y el material con Claude.
- **«Preparado por DirectorIA», sin insignia.** Aparece donde DirectorIA aplica reglas o rellena plantillas: guardias, fichas, dosier, convocatoria, guías de los protocolos, justificantes, registros e informe de gastos.
- **«con IA», sin insignia.** Lo que la IA busca, lee o detecta sin escribir nada. En el banco de recursos: lo que entiende de la búsqueda («Entendido como»), los contenidos que sugiere del catálogo al subir un recurso («Sugeridos del catálogo · con IA») y la comprobación de que el archivo no lleva nombres ni datos de salud (la de un DNI, un © o un ISBN va «con reglas, sin IA»).
- **En el Inicio,** las cifras, la fila del día y el calendario salen de reglas y de los datos del colegio, así que van sin insignia. La insignia solo sale en lo que ha escrito la IA a partir de un correo o de una circular:
  - la cifra de correos, con «Resumidos con IA»;
  - las filas de «Lo que te necesita» que salen de un correo, con «Resumido con IA»;
  - los plazos y citas de «Lo que viene» que la IA ha sacado de un correo o de una circular, con «Sacado del correo» o «Sacado de la circular».
- **Un choque va sin insignia cuando sale solo de datos del colegio** (horarios y calendario), aunque lleve a un correo: la guardia del viernes 27 de Laura Sánchez, que cae en la salida, la detecta DirectorIA con su horario, no la IA. Si una de las fechas la saca la IA de un correo, el choque lleva «Resumido con IA»: el festival que propone el AMPA (dirección), los extintores (secretaría) y la lectura de enero (profesor que sustituye). La tutoría del jueves de Laura también lleva «Sacado del correo»: esa cita sale de su correo a jefatura.
- La ilustración de la directora es la propia de la demo: lleva en la tableta el ✓ de «al día» y no la insignia de la IA, porque su resumen de las 8:00 sale de reglas.

Es el mismo criterio del documento [Qué funciones necesitan IA](https://claude.ai/artifact/5KaRG2PbmxAfFtQJQjM5md).

## Colores de la app

La app sigue en los colores de la marca:

- tiza y papel en las superficies grandes;
- pizarra en lo urgente y en lo confirmado;
- la chispa (el naranja), solo en la insignia de la IA y en el antetítulo con su raya.

Para que no sea todo verde pizarra y crema, lleva además una paleta de apoyo de cinco tonos. Solo sale en acentos pequeños: el disco y el aro de los iconos y de las marcas de la agenda, los puntos del menú, del correo y de los títulos, las marcas del calendario y algunas etiquetas. Es solo de la aplicación; el bloque para `tokens.json` de la marca está propuesto en `tokens-apoyo.json`.

### La paleta de apoyo

Cada tono tiene tres pasos:

- **tinte:** fondo claro, el del disco de los iconos y de las marcas de la agenda;
- **medio:** el aro de los iconos, los puntos y los bordes, con 3:1 o más sobre papel, tiza y su tinte;
- **tinta:** texto y marcas del calendario, con 4,5:1 o más sobre papel, tiza y su tinte (y también sobre salvia, 6:1 o más, y sobre linea, 5:1 o más).

| Tono | Tinte | Medio | Tinta | Contraste del medio (papel · tiza · su tinte) | Contraste de la tinta (papel · tiza · su tinte) |
|---|---|---|---|---|---|
| Turquesa | `#CEFAFE` | `#0398A1` | `#026167` | 3,4 · 3,2 · 3,1 | 7,1 · 6,5 · 6,4 |
| Granate | `#FDE8EE` | `#84383D` | `#70252C` | 7,9 · 7,2 · 6,9 | 10,4 · 9,5 · 9,0 |
| Mostaza | `#FAF4CD` | `#9D8B09` | `#615604` | 3,4 · 3,1 · 3,1 | 7,3 · 6,7 · 6,6 |
| Rosa | `#FDD6DC` | `#CB5672` | `#86374B` | 4,0 · 3,7 · 3,1 | 7,8 · 7,1 · 5,9 |
| Verde | `#E0FBDC` | `#0B7B00` | `#2C6427` | 5,4 · 4,9 · 4,9 | 7,0 · 6,4 · 6,4 |

- **Sin azules ni morados.** La regla 8 de la marca los prohíbe («nada de la IA de moda»), así que la paleta no los lleva. Sin ellos no caben seis tonos que se distingan bien: con cinco ya se aprovecha todo el círculo que queda (rosa, granate, mostaza, verde y turquesa).
- **Validada** con `validate_palette.js` en modo claro, en este orden: rosa, granate, mostaza, turquesa y verde. Los cinco medios pasan todas las pruebas sobre blanco, papel y tiza:
  - banda de luminosidad y croma mínimo;
  - contraste de 3:1 sobre la superficie;
  - con vecinos, la distancia más corta es 17,2 a la vista normal y 14,7 con daltonismo (las dos, entre el granate y el rosa).
- **Con todos los pares a la vez** (en el menú o en una fila de cifras puede tocarse cualquier pareja), la distancia a la vista normal no baja de 17,1 (mostaza y verde). Con deuteranopía baja a 7,9 en granate y verde: es la franja que el validador admite si hay una segunda pista. Aquí la hay siempre: el icono, la forma o la palabra.
- **El granate y el rosa ya no son el mismo tono.** El granate es un rojo vino apagado y oscuro (`#84383D`); el rosa, un rosa frambuesa más claro. Entre sus medios hay 17,2 a la vista normal. Sus discos también se separan: el tinte del rosa es el más rosado de todos y está a 4,4 del tinte del granate (antes, 1,5), así que un disco de documentos (fondo casi blanco y aro oscuro) no se confunde con uno de protocolos (fondo rosa y aro rosa).
- **Ninguno es naranja.** A la vista normal, todos los medios están a 10,9 o más de la chispa y de la chispa-texto: la mostaza tira a amarillo; el granate es un rojo vino apagado, y el rosa, un rosa frambuesa.
- **El verde se ve como verde nuevo,** no como la pizarra: está a 15,0 de la pizarra-linea.
- **Los tintes, con color.** Los de la turquesa, la mostaza, el rosa y el verde están a entre 4,1 y 6,2 de la salvia (antes, a entre 2,8 y 3,3), así que el disco ya se lee de color aunque no se mire el aro. El del granate se queda a 3,4: en un rosa tan claro, sRGB no da más color sin oscurecerlo, y su aro oscuro (6,9:1 sobre él) basta para leerlo.
- **Con daltonismo no basta el color, y no se le pide.** Por eso la IA se reconoce por su insignia y su texto («Resumido con IA»), nunca por el color, y cada tono va siempre con su icono, su forma o su palabra. Los pares que se confunden (OKLab ×100; con protanopía o deuteranopía):
  - **medios:** la mostaza con la chispa (2,3 con protanopía) y el verde con la chispa-texto (4,7 con protanopía); el granate se acerca a la pizarra-linea (4,8 con deuteranopía);
  - **tintas (texto y marcas):** la del verde con la chispa-texto (2,8 con protanopía: «Misma materia, ciclo siguiente», en el banco, sale del mismo oliva que el antetítulo de la IA); la del granate con la pizarra (2,5 con protanopía: en el calendario, el banderín del dosier del lunes 23 se ve como las marcas sin tono); la del rosa con la pizarra-linea (3,5 con deuteranopía); la de la turquesa está a 4,0 de la pizarra-linea incluso a la vista normal. Entre ellas, la mostaza y el verde (2,8 con deuteranopía);
  - **tintes:** el del verde con la chispa-suave, el fondo de los avisos (2,1 con deuteranopía); el del granate está a 2,9 de la chispa-suave incluso a la vista normal. Entre ellos, la mostaza y el verde (2,0–2,2 con daltonismo);
  - en la pantalla de acceso, con deuteranopía, el nombre de la docente y el de la secretaria (en su tinta) se ven del mismo oliva; los separan el punto de su cargo (13,6) y, sobre todo, el texto.

### El mapa: un tono por tipo de trabajo

| Tono | Tipo de trabajo | Funciones | Perfil en la pantalla de acceso |
|---|---|---|---|
| Turquesa | Personas, guardias y el día | Guardias de hoy, Fichas de sustitución, Ausencias, Tus fichas de hoy y Tu jornada; el panel del día del Inicio | Jefe de estudios y profesor que sustituye |
| Granate | Documentos y firmas | Dosier para inspección, Actas, Pendiente de firma, Programaciones, Justificantes y Tus justificantes | Directora |
| Mostaza | Plazos y calendario | Tus plazos, Circulares y plazos y Exámenes | Docente: sus plazos (las entregas del viernes 20 y la salida) |
| Rosa | Protocolos y convivencia | Guías de protocolos y Plan de convivencia | Orientador |
| Verde | Recursos | Las funciones de recursos: Analista de gastos, Banco de recursos y Material con Claude | Secretaria |
| Sin tono (la marca) | Correo y comunicación | Correo, Correo dictado y Circulares adaptadas | — |

- **El correo y la comunicación van sin tono: donde escribe la IA, los colores de la marca.** Ahí escribe la IA (resúmenes, respuestas propuestas, dictado, traducciones), y el único color debe ser la chispa. En el menú no llevan punto, y su cabecera lleva el icono neutro, sobre salvia. Así, el Correo dictado y las Circulares adaptadas no tienen color propio, y no es un olvido.
- **El correo sí dice adónde lleva cada mensaje.** Por la regla 1, el mensaje que lleva a una función con tono lleva su punto delante del asunto, y en la lectura, el enlace «Ir a «…»» va con ese punto y con el subrayado del medio: en dirección, la visita de la inspección y el festival del AMPA, en granate. Son 16 correos entre los seis perfiles. Los que llevan al dictado o a las circulares adaptadas, sin punto.
- **De siete tipos a cinco tonos.** «Gastos y edificio» y «recursos y aprendizaje» van juntos en el verde, y el correo, sin tono. El verde es de las tres funciones de recursos. Lo del edificio no tiene función propia y toma el tono de la función a la que lleva: el ascensor, el corte de la calle y los electrodos del desfibrilador llevan a Circulares y plazos (mostaza), y la revisión de los extintores, al correo (sin tono).
- **Cinco tonos para seis perfiles.** Cada perfil lleva el tono de su función principal. El jefe de estudios y el profesor que sustituye comparten la turquesa, porque su trabajo es el mismo: las guardias y la ficha (los pasos 1 y 2 del recorrido). Por eso el Inicio del profesor que sustituye solo lleva turquesa: todo lo suyo es su jornada y sus fichas. En la pantalla de acceso, el tono identifica al perfil; por eso los pasos 4 y 7 del recorrido, el correo dictado y el justificante de la docente, van numerados en mostaza aunque el dictado no tenga tono y los justificantes sean granate.

### Las reglas

1. **El color dice adónde lleva una pieza; el icono, de qué trata.** Nunca la posición ni el estado. Es fijo: el mismo tono en el menú, en la cabecera de la función, en sus cifras, en sus filas, en sus marcas de la agenda y del calendario y en sus correos.
   - Lo que lleva a una función toma su tono: la cifra del dosier, su fila, su marca del lunes 23, «Dosier para inspección» en el menú y, en el correo de la inspección, el punto del asunto y «Ir a «Dosier para inspección»» van en granate.
   - Lo que lleva al correo, o a ningún sitio, va sin tono: icono pizarra sobre salvia y marca en la tinta de la marca. «Tus fichas se cierran al acabar la jornada», por ejemplo, no lleva a ninguna parte y va sin tono.
   - Lo reservado no cambia de tono: los justificantes van en granate, como los demás documentos, con la banda pizarra y el candado. El rosa es de las guías de los protocolos y del plan de convivencia: ya no hay casos.
   - Se mira el enlace vigente: si cambia, el tono lo sigue. La marca del dosier del lunes 23, en dirección, va en granate porque lleva al dosier; con el visto bueno dado y sin enviar, lleva al correo de la inspección («Falta enviarlo a Inspección desde el correo») y pasa a sin tono. Al revés, la cifra «Sesión para el claustro», en orientación, va sin tono porque lleva al correo de Nuria Castro; si se le contesta sin el guion, lleva a la guía y pasa a rosa.
   - Dos funciones van por su trabajo y no por su tipo: «Tu jornada» es el día (turquesa, como el panel del día) y «Exámenes» es un calendario (mostaza).
   - La misma fecha puede llevar tono en un perfil y no en otro: «Empiezan los exámenes de ESO» lleva a Exámenes en jefatura (mostaza) y a ningún sitio en dirección (sin tono).
2. **Dónde va el color:**
   - en el menú, un punto por función, con un filo en la tinta de su tono (sobre salvia, la mostaza y la turquesa no llegan a 3:1, con 2,90 y 2,96; el filo da 6:1 o más). El Inicio y el correo, sin punto;
   - en las cifras, el disco del icono (tinte), su aro (medio) y el subrayado de la acción. Los medidores y las cuentas atrás siguen en pizarra: son magnitudes, y su forma (lleno, con borde, discontinuo) dice el estado;
   - en las filas de «Lo que te necesita», el disco y el aro del icono;
   - en la agenda de «Lo que viene», cada marca va dentro de un disco de su tono, como los iconos de las filas: el tinte, el aro del medio y la forma en la tinta. En el calendario de al lado, la marca va en la tinta de su tono. La forma sigue siendo la del plazo, la cita, el aviso o lo hecho;
   - en la cabecera de cada función, el icono con su disco y su aro delante del título. Es el mismo dibujo que la cifra que lleva a ella en el Inicio (el calendario de Exámenes, la carpeta de Justificantes, el reloj de Tu jornada); si no hay cifra, o si llevan varias, el de la función (la persona de Ausencias) o el de su tipo. En el móvil la cabecera va sin icono: la raya del antetítulo abre la línea, y el punto de la función ya está en el menú, justo encima;
   - en las tarjetas, un punto del tono delante del título. En el Inicio solo lo lleva el día (turquesa): «Lo que te necesita» y «Lo que viene» mezclan tipos y van sin punto, y cada fila y cada marca llevan el suyo. No lo llevan las tarjetas del correo ni las que llevan la insignia de la IA;
   - en el correo, el punto delante del asunto de cada mensaje que lleva a una función con tono y, en la lectura, el enlace «Ir a «…»» con ese punto y el subrayado del medio;
   - dentro de una función, las etiquetas («Para», «Tarea», las horas de las guardias, las fechas de los plazos, las cabeceras de las tablas) van en la tinta, y las viñetas, en el medio. En el banco de recursos, el primer resultado lleva el borde del medio y el fondo del tinte;
   - en la pantalla de acceso, un punto delante del cargo, el nombre de la persona en su tinta y el subrayado de «Entrar en su panel». El número de su paso del recorrido va en un disco de su tinte, con su aro. La ilustración va tal cual, sobre su disco linea.
3. **Los discos son redondos.** El icono se recorta en círculo (`clip-path`), no en el cuadrado del SVG, y el aro mide 2,25 unidades de 24 (3 px en un icono de 32), igual en todo el borde. Sobre fondo oscuro (la cifra urgente en pizarra, que pasa a pizarra-2 con el ratón encima, y los números del recorrido en la banda pizarra), el aro va entre dos bandas del tinte: así no se pierde en el fondo (el aro del granate solo daría 1,4:1 sobre pizarra-2) y queda a 3,1:1 o más de lo que tiene a cada lado.
4. **Las superficies grandes siguen neutras.** El fondo es tiza y las tarjetas, papel. Ninguna tarjeta lleva filo ni borde de color a un lado; el mensaje abierto del correo lleva su barra en pizarra, que es un estado. La cifra urgente sigue en pizarra: solo su icono lleva el tono. El documento (`papel-doc`) y la ficha van sin acento, como el papel. Un tinte nunca va como fondo grande junto a un aviso sin el borde de su medio: así lo lleva el primer resultado del banco, justo debajo del aviso «Todavía no hay…», porque con deuteranopía el tinte del verde y la chispa-suave se confunden.
5. **Los estados van en los colores de la marca, con icono y texto.** No usan ningún tono de la paleta, así que no chocan con el mapa:
   - hecho o confirmado: ✓ sobre salvia, o la celda en pizarra;
   - pendiente o por confirmar: «…» con borde, discontinuo en el día;
   - plazo: banderín;
   - hoy: reloj, en pizarra;
   - aviso o choque: triángulo sobre chispa-suave, que es el fondo de avisos de la marca;
   - para saber: «i» sobre salvia.

   El día mantiene su lógica: por confirmar, con borde discontinuo; confirmada, en pizarra; sin cambios, en salvia. Lo hecho y los choques de la lista y de la agenda dejan su tono y pasan al icono del estado (en la agenda, en un disco salvia o, en un choque, papel). Los justificantes llevan ✓ «Entregado» o «…» «Pendiente»; la línea fija de la ficha («Antes de empezar») lleva el triángulo, y «Ficha enviada a…», el ✓. Los pasos de una guía no tienen estado: van numerados, y los que solo van si se confirma, con el número en borde discontinuo.
6. **La chispa, solo para la IA.** Va en la insignia y en el antetítulo con su raya. Fuera de eso solo queda el foco de la marca: chispa-texto, y chispa sobre pizarra.
   - Las etiquetas de los documentos, de la ficha y de las guías («Para», «Tarea», «Material», «Qué se hace»…) van en la tinta de su tipo de trabajo. En el componente de la marca van en chispa-texto; en la app no, porque la ficha la prepara DirectorIA con reglas. El aviso de la ficha («Antes de empezar», la línea fija) sigue en pizarra, con su triángulo.
7. **El foco se sigue viendo sobre el color.** El anillo de chispa-texto mide de 3,8:1 a 4,9:1 sobre papel, tiza, salvia, chispa-suave y los cinco tintes (el más justo, el tinte del rosa, 3,8:1; después, chispa-suave y salvia, 4,2:1). Sobre pizarra, el anillo es de chispa: 4,6:1. En el correo, el anillo va por dentro del mensaje, para que la bandeja no lo recorte.
8. **Medido en la página de verdad** (el acceso, el Inicio, el correo y todas las funciones de los seis perfiles, a 1440 y a 390 px, antes de quitar los datos de alumnos): 897 medidas de texto y de gráfico en un tono o sobre un tinte, 118 pares distintos y ninguno por debajo de su mínimo. El texto más justo es la tinta del rosa sobre su tinte, en el número del paso 5 del recorrido (5,9:1), el mismo par que los números de los pasos de las guías; el gráfico más justo, el aro de la mostaza sobre su tinte (3,1:1). Las piezas nuevas (guías, justificantes, ficha) usan pares ya medidos, pero no se ha vuelto a medir la página entera. Los subrayados de color son adorno: el enlace ya se reconoce por su texto en negrita y subrayado.
9. **En el código:**
   - Cada color es una variable de `:root`, con su comentario. Fuera de `:root` no hay ningún color suelto: las transparencias también son variables (`--tiza-velo`, `--foco-halo`, `--velo`).
   - El motor solo pone `data-cat` (cifras, filas, marcas, menú, la región principal, los mensajes del correo y su enlace «Ir a…») y `data-perfil` (pantalla de acceso). Las tablas están en `src/app.js`: `CATEGORIA_TIPO`, `CATEGORIA_MODULO`, `ICONO_TIPO` e `ICONO_MODULO`, con `categoriaModulo()`, `categoria()` e `iconoModulo()`.
   - Los estilos pintan con `--cat-tinte`, `--cat-medio` y `--cat-tinta`; sin tono, con los colores de la marca. `data-cat="comunicacion"` y los estados de la lista y de la agenda los anulan, para que no hereden el tono de lo que los rodea.
   - Una función nueva necesita su tipo en `CATEGORIA_TIPO`; su icono sale de su cifra o de `ICONO_TIPO`.

### Para la revisión de la marca

Lo que la app hace distinto del sistema de la marca, para que la marca lo apruebe o lo cambie:

- **La paleta de apoyo:** cinco tonos nuevos, solo en la aplicación y solo en acentos pequeños; nunca en superficies, degradados ni piezas comerciales. Respeta la regla 8: ni azules ni morados.
- **El granate no es un color de aviso.** Es de documentos y firmas, y no se usa para avisos ni errores: los avisos siguen en chispa-suave con su triángulo, como en la marca. Por eso es un rojo vino apagado y oscuro, no un rojo vivo.
- **Lo reservado no lo marca el color.** Lo marcan la banda pizarra y el candado (en los justificantes). El rosa solo dice que una pieza lleva a las guías de los protocolos o al plan de convivencia.
- **Los iconos pequeños de interfaz** (Iconografía pide señalarlos en la revisión): trazo con extremos redondos, en pizarra, como pide la marca. El tono va en el disco, redondo como el de las ilustraciones: relleno del tinte y un aro del medio.
- **Las etiquetas de la ficha y de los documentos,** en la tinta de su tono y no en chispa-texto, y las viñetas de las listas, en el medio y no en pizarra-linea.
- **Sin filos ni halos.** Las tarjetas no llevan bordes de color a un lado (componente Tarjeta) y las ilustraciones van sin retocar, sobre su disco linea.

**Límites que conviene saber:**

- **Un tinte nunca va solo.** Los tintes de la mostaza y del verde están a 3,6 entre sí, y el del granate, a 3,4 de la salvia. Por eso siempre van con el aro o el borde del medio, o con su tinta encima.
- **En el calendario, el color solo separa lo que tiene tono de lo que no.** Sus marcas son glifos de 12 px sobre salvia, donde los medios de la mostaza y de la turquesa no llegan a 3:1, así que van en la tinta. Y las tintas no pasan como paleta categórica: con `validate_palette.js` sobre salvia y todos los pares, la del granate se sale de la banda de luminosidad, las de la turquesa y la mostaza se leen grises, y en las marcas no se distinguen el granate del rosa (7,4) ni la mostaza del verde (7,4; 2,8 con deuteranopía). El tipo de trabajo se lee al lado, en la agenda, donde cada marca va en el disco de su tono con el aro del medio, que sí está validado. Hoy cada calendario lleva un solo tono además de las marcas sin tono: dirección, granate; jefatura, secretaría y docente, mostaza; orientación, rosa; el profesor que sustituye, ninguno. Si un calendario fuera a mezclar tonos, habría que validar las tintas sobre salvia con todos los pares y separarlas, sin volver a los medios.

## Cómo cambiarla

- **Textos:** los de cada perfil están en `src/datos/<perfil>.js`. En `guion-de-datos.md` están el formato y las reglas comunes:
  - el colegio, la fecha y las personas;
  - las historias que cruzan perfiles;
  - el tono;
  - la privacidad: DirectorIA no guarda datos de alumnos;
  - el criterio de las etiquetas de IA.
- **Motor y estilos:** el motor está en `src/app.js` y los estilos en `src/app.css`, con los colores y las tipografías de la marca y la paleta de apoyo (ver «Colores de la app»).
- **Ilustraciones:** salen del kit de la marca (`../ilustraciones`), salvo tres que trae la demo en `src/ilustraciones/`: la secretaria y el orientador, para que cuadren con Carmen López y Andrés Vidal (el kit tiene un secretario y una orientadora), y la directora, con la tableta sin la insignia de la IA. Están hechas con las piezas del generador de la marca (`src/ilustraciones/generar-dos.mjs`) y falta el visto bueno de la marca. Si no se aceptan, basta con borrar sus SVG.

Después de cambiar algo, desde esta carpeta:

```
node validar.mjs src/datos/*.js       # comprueba textos, longitudes, enlaces entre pantallas, que ningún texto lleve datos de alumnos ni el motivo de una ausencia, que las fichas solo traigan la clase y que ninguna guardia se devuelva
node construir.mjs .                  # regenera index.html
node probar.mjs index.html capturas   # opcional: recorre todas las pantallas y hace capturas
```

- `construir.mjs` toma las fuentes, el logotipo y las ilustraciones de las carpetas de la marca (`../fuentes`, `../logo` y `../ilustraciones`). Necesita Node 18 o posterior.
- `construir.mjs` también genera `demo-directoria.html`, la versión que se publica en claude.ai. No hace falta guardarla en el repositorio. Después de cada cambio, publicadla otra vez en el mismo enlace (el de «Cómo abrirla»): si no, el enlace sigue enseñando la versión anterior.
- `probar.mjs` necesita Playwright con Chromium. Avisa si hay errores en la consola o si alguna pantalla se sale de lado a 390 px de ancho. Además:
  - hace capturas de la primera pantalla del Inicio de los seis perfiles a 1366×768, a 1280×720 y a 1180×820, los anchos de un portátil, de un proyector y de una tableta apaisada, y comprueba que a esos anchos el día sale en columnas;
  - firma la convocatoria del consejo escolar y da el visto bueno al acta, marca las dos entregas del viernes 20 y comprueba que el Inicio sigue pintando sus cifras;
  - con todos los correos respondidos o archivados, comprueba a 390 y a 360 px que lo hecho («Al día», «Todo firmado») cabe en su tarjeta y que ninguna palabra se parte en dos líneas;
  - elige a otra persona para la 1.ª y la 6.ª en las guardias, confirma y comprueba que el Inicio de quien sustituye dice «Ya no la cubres»;
  - elige a Pablo Sanz para la 3.ª y el recreo y comprueba que su Inicio enseña esas dos sesiones y cuenta tres fichas;
  - responde a la empresa de fotocopiadoras con la respuesta que sale elegida y comprueba que la cuenta atrás sigue y que el sábado 21 no pasa a ✓; con «Comunicar el preaviso», que sí;
  - con Pablo Sanz elegido para la 3.ª y el recreo, comprueba también que la línea de su día nombra la 3.ª y el recreo y que su carril cuenta tres apoyos;
  - confirma solo la 1.ª y comprueba, a 1440×900 y a 1280×720, que en la fila de 3.º B todos los estados quedan a la misma altura y que la línea de estado dice lo confirmado, con el atajo;
  - tras confirmar, comprueba que la fila del día cabe en la primera pantalla de un portátil de 1366×768 con el navegador maximizado (1366×643) y de un proyector de 1280×720 en una ventana (1280×633). Con el zoom al 110 % (1242×607) no cabe: lo dice como aviso, no como error;
  - con el ratón, va de la tarjeta de Fotocopiadoras al atajo de la demo y comprueba que ningún globo lo tapa;
  - envía el dosier con la respuesta que lo adjunta, con y sin el visto bueno, y comprueba que el lunes 23 no pasa a ✓ y dice lo que falta;
  - responde al correo de Laura Sánchez en jefatura y comprueba que su Inicio dice «la cubre Rosa Medina» y da por confirmado el choque del viernes 27, y que en jefatura ese choque sigue abierto y sin enlace. Si se archiva el correo, nada cambia;
  - antes de subir el justificante de Laura Sánchez, comprueba que en secretaría los pendientes no salen con nombre de archivo («Sin archivo todavía») y que el registro de accesos dice quién ha abierto uno; después lo sube y comprueba el nombre que le da el programa, que en secretaría sale en su carpeta y la cifra pasa de 5 a 6 de 7, que en jefatura dice «Entregado» sin enseñar archivos, y que ninguna de esas pantallas lleva la insignia de la IA;
  - con las guardias confirmadas, recorre todas las pantallas de los seis perfiles, abre cada correo y comprueba que no sale ningún dato de alumno (casos, «Alumno/a», los alumnos que tenía la demo, salud, recogidas, motivos de ausencia), salvo la línea fija de la ficha; que cada ficha la lleva y solo trae la clase, y que cada guía enseña sus pasos y sus anexos en blanco, sin la insignia, en orientación y en dirección.

## Privacidad de la demo

- **DirectorIA no guarda datos de alumnos: solo del profesorado y del funcionamiento del colegio.** En la demo no sale ningún alumno: ni nombres ni iniciales, ni salud, ni recogidas, ni pautas, ni casos. Se habla de grupos («3.º B»), de cifras agregadas y, en lo que escriben las familias, de «su hijo» o «su hija».
- Del profesorado, el registro de ausencias no guarda el motivo. Los justificantes los archiva un programa en su carpeta; la IA no los lee.
- El correo es la única excepción en el producto (lo escriben las familias y puede traer nombres de alumnos); en la demo, las familias escriben de temas generales y sin nombres.
- Lo que se dice de los datos: «La aplicación y los datos están en un servidor dentro del colegio. La copia de seguridad, cifrada, está en la UE. Los correos salen por la cuenta del propio colegio. El mantenimiento a distancia queda registrado.» Nunca «los datos no salen del colegio».
- Todos los nombres son inventados. No hay inicio de sesión ni formularios que recojan datos: se entra eligiendo un perfil. En «Tus justificantes», el archivo es un ejemplo de la demo: no se elige ningún archivo de verdad.
- No hace ninguna petición a internet. Lo que se toca se queda en la pestaña del navegador.
