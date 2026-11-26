# Demo de DirectorIA

Una aplicación de ejemplo para enseñar DirectorIA en la reunión con un colegio. Primero se elige un cargo: dirección, jefatura de estudios, secretaría, docente, orientación o profesor que sustituye. Después se entra en su panel, que tiene:

- el resumen del día;
- el correo resumido, con respuestas ya propuestas para revisar y enviar;
- las funciones propias de ese cargo.

Todo es inventado y nada sale de la página.

## Cómo abrirla

- **En claude.ai:** [Demo de DirectorIA](https://claude.ai/artifact/QVHqnL2PZ1ioxfGBxAEBMq). Es el enlace para enseñarla o mandarla.
- **Sin conexión:** abrid `index.html` en el navegador. Lleva dentro las fuentes, el logotipo y las ilustraciones, y no carga nada de internet.
- **Pantalla:** se ve bien en el móvil, pero para enseñarla es mejor un portátil o la pantalla de la sala. Para enseñarla, a pantalla completa (F11; en Mac, ⌃⌘F) y con el zoom al 100 %: en un portátil de 1366×768 con la barra de pestañas y la de marcadores, o con el zoom al 110 %, la fila de 3.º B del Inicio no cabe entera en la primera pantalla.
- **Estado:** lo que hagáis (confirmar guardias, enviar correos, marcar plazos) se guarda solo en esa pestaña. «Reiniciar la demo» lo deja todo como al principio, y cerrar la pestaña también.
- **Ir directo a una pantalla:** añadid al enlace `#perfil` o `#perfil-función`. Por ejemplo, `#jefatura-guardias`, `#sustituto-ficha` o `#docente-dictado`.

## El colegio de ejemplo

Colegio Ejemplo, miércoles 18 de noviembre de 2026, a las 8:00. Sergio Prieto, tutor de 3.º B, tiene fiebre y no viene. A partir de ahí se encadena todo lo demás.

| Perfil | Persona | Qué enseña |
|---|---|---|
| Dirección | Elena Ruiz, directora | Resumen de las 8:00, correo resumido, dosier para la inspección, acta del claustro a partir de un dictado y una citación del protocolo pendiente de firma |
| Jefatura de estudios | Javier Martín | Guardias de hoy, fichas de sustitución, calendario de exámenes y programaciones frente al modelo del centro |
| Secretaría | Carmen López | Analista de gastos, certificado de matrícula, autorizaciones de imagen y plazos de las circulares |
| Docente | Laura Sánchez, tutora de 4.º A | Correo dictado a una familia, banco de recursos, material con Claude y sus plazos |
| Orientación | Andrés Vidal, orientador | Protocolo de acoso paso a paso (Caso 2026-07), pautas para el aula y una circular adaptada a lectura fácil y al inglés |
| Profesor que sustituye | Pablo Sanz, maestro de apoyo | Sus fichas para cubrir 3.º B y su jornada |

## Recorrido de 10 minutos

La pantalla de entrada tiene este mismo recorrido, en «Recorrido para enseñarla». Seguid el orden: el primer paso cambia lo que se ve en los siguientes.

1. **Falta un profesor** (Jefatura de estudios → Guardias de hoy).
   - DirectorIA propone quién cubre cada sesión de Sergio con las reglas del colegio: horarios, guardias y reparto. Para esto no hace falta IA.
   - Si queréis enseñar que decide jefatura, cambiad antes una propuesta en su desplegable. Por ejemplo, Rosa Medina en el recreo, en lugar de Teresa Gil: el Inicio de cada perfil enseña a la elegida.
   - Si cambiáis la 1.ª o la 6.ª, que DirectorIA proponía para Pablo Sanz, su Inicio lo dice («Ya no la cubres · La cubre Rosa Medina»). Si elegís a Pablo Sanz para la 3.ª o el recreo, su Inicio también lo enseña: la sesión sale en su día («Elección: tú»), un aviso dice qué deja de hacer a esa hora y, al confirmar, la línea de su día dice todo lo que cubre («la 1.ª, la 3.ª, la 6.ª y la salida»).
   - Las fichas siguen la propuesta inicial: las de Pablo («Tus fichas de hoy» y «Tu jornada») y la vista previa de jefatura («Fichas de sustitución», donde la de 3.ª dice «Hoy vigila Teresa Gil»). Si cambiáis la propuesta, no las abráis después.
   - Pulsad «Confirmar todas». Todas quedan confirmadas a la misma hora.
   - Qué decir: «Hasta que jefatura confirma, no se avisa a nadie».
2. **La ficha de quien sustituye** (Profesor que sustituye → Tus fichas de hoy).
   - Pablo ve solo lo que necesita para entrar en 3.º B: la tarea, una pauta, una alergia y quién puede recoger a Hugo.
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
     - Si en el paso 1 elegisteis a otra persona, todos los paneles enseñan a la elegida: «Cubre Rosa Medina · Confirmada a las 8:01» (antes de confirmar, «Elección: Rosa Medina»). Qué decir: «La IA propone y tú decides».
   - Firmad la citación del Caso 2026-07 (Pendiente de firma: marcad las cuatro comprobaciones y pulsad «Firmar la citación») y volved al Inicio:
     - la cifra de la firma baja de 2 a 1, y ahora lleva al acta;
     - la fila de la citación baja al final de «Hoy», con «Firmada a las 8:0x», y el recuento de «Hoy» baja.
     - Si dais también el visto bueno al acta, la cifra pasa a «Todo firmado», con la hora.
   - El dosier, en este orden: primero el visto bueno (Dosier para inspección) y después, en el correo de la inspección, la respuesta «Confirmar y enviar ya el dosier». En «Lo que viene», el lunes 23 dice entonces «Enviado sin el acta de 2.º ESO A. Esa acta, antes de este día.»: el plazo sigue abierto para esa acta, así que no pasa a ✓. Con solo el visto bueno, dice que falta enviarlo; si lo enviáis sin el visto bueno, también lo dice.
4. **Un correo dictado** (Docente → Correo dictado).
   - Pulsad «Empezar a dictar» y después «Redactar el correo».
   - Laura lo cuenta como se lo contaría a un compañero y le llega el correo para la familia de Daniel ya redactado. Lo revisa y lo envía ella.
   - Si volvéis al Inicio antes de enviarlo, la cifra de la tutoría dice «Por revisar», con «Revisar y enviar».
5. **Un protocolo, con reserva** (Orientación → Protocolo de acoso).
   - El Caso 2026-07 paso a paso, con fechas, responsables y documentos preparados con las plantillas del protocolo.
   - Qué decir: el expediente del caso no pasa por la IA (por correo solo va el número del caso), y si hay acoso lo decide el equipo del centro.
6. **El analista de gastos** (Secretaría → Analista de gastos).
   - Facturas, contratos y extractos de octubre, con avisos de renovaciones y posibles ahorros.
   - Secretaría lo envía a dirección y a la titularidad, que son quienes deciden.

El correo funciona igual en todos los perfiles. Cada mensaje llega resumido, con lo que piden y hasta tres respuestas propuestas. Se elige una, se cambia si hace falta y se envía después de confirmar. Los que solo informan se archivan sin responder.

## Qué lleva IA y qué no

- **«Preparado con IA», con la insignia naranja.** Solo aparece donde ha escrito el modelo de lenguaje:
  - los resúmenes y las respuestas del correo;
  - el dictado y el acta;
  - los plazos sacados de circulares y correos;
  - el banco de recursos, las traducciones y el material con Claude.
- **«Preparado por DirectorIA», sin insignia.** Aparece donde DirectorIA aplica reglas o rellena plantillas: guardias, fichas, certificados, dosier, protocolo, registros e informe de gastos.
- **En el Inicio,** las cifras, la fila del día y el calendario salen de reglas y de los datos del colegio, así que van sin insignia. La insignia solo sale en lo que ha escrito la IA a partir de un correo o de una circular:
  - la cifra de correos, con «Resumidos con IA»;
  - las filas de «Lo que te necesita» que salen de un correo, con «Resumido con IA»;
  - los plazos y citas de «Lo que viene» que la IA ha sacado de un correo o de una circular, con «Sacado del correo» o «Sacado de la circular».
- La ilustración de la directora es la propia de la demo: lleva en la tableta el ✓ de «al día» y no la insignia de la IA, porque su resumen de las 8:00 sale de reglas.

Es el mismo criterio del documento [Qué funciones necesitan IA](https://claude.ai/artifact/5KaRG2PbmxAfFtQJQjM5md).

## Cómo cambiarla

- **Textos:** los de cada perfil están en `src/datos/<perfil>.js`. En `guion-de-datos.md` están el formato y las reglas comunes:
  - el colegio, la fecha y las personas;
  - las historias que cruzan perfiles;
  - el tono;
  - la privacidad;
  - el criterio de las etiquetas de IA.
- **Motor y estilos:** el motor está en `src/app.js` y los estilos en `src/app.css`, con los colores y las tipografías de la marca.
- **Ilustraciones:** salen del kit de la marca (`../ilustraciones`), salvo tres que trae la demo en `src/ilustraciones/`: la secretaria y el orientador, para que cuadren con Carmen López y Andrés Vidal (el kit tiene un secretario y una orientadora), y la directora, con la tableta sin la insignia de la IA. Están hechas con las piezas del generador de la marca (`src/ilustraciones/generar-dos.mjs`) y falta el visto bueno de la marca. Si no se aceptan, basta con borrar sus SVG.

Después de cambiar algo, desde esta carpeta:

```
node validar.mjs src/datos/*.js       # comprueba textos, longitudes, enlaces entre pantallas y que el Inicio no lleve datos de salud ni nombre al alumno del caso
node construir.mjs .                  # regenera index.html
node probar.mjs index.html capturas   # opcional: recorre todas las pantallas y hace capturas
```

- `construir.mjs` toma las fuentes, el logotipo y las ilustraciones de las carpetas de la marca (`../fuentes`, `../logo` y `../ilustraciones`). Necesita Node 18 o posterior.
- `construir.mjs` también genera `demo-directoria.html`, la versión que se publica en claude.ai. No hace falta guardarla en el repositorio.
- `probar.mjs` necesita Playwright con Chromium. Avisa si hay errores en la consola o si alguna pantalla se sale de lado a 390 px de ancho. Además:
  - hace capturas de la primera pantalla del Inicio de los seis perfiles a 1366×768, a 1280×720 y a 1180×820, los anchos de un portátil, de un proyector y de una tableta apaisada, y comprueba que a esos anchos el día sale en columnas;
  - firma la citación y da el visto bueno al acta, marca las dos entregas del viernes 20 y comprueba que el Inicio sigue pintando sus cifras;
  - con todos los correos respondidos o archivados, comprueba a 390 y a 360 px que lo hecho («Al día», «Todo firmado») cabe en su tarjeta y que ninguna palabra se parte en dos líneas;
  - elige a otra persona para la 1.ª y la 6.ª en las guardias, confirma y comprueba que el Inicio de quien sustituye dice «Ya no la cubres»;
  - elige a Pablo Sanz para la 3.ª y el recreo y comprueba que su Inicio enseña esas dos sesiones y cuenta tres fichas;
  - responde a la empresa de fotocopiadoras con la respuesta que sale elegida y comprueba que la cuenta atrás sigue y que el sábado 21 no pasa a ✓; con «Comunicar el preaviso», que sí;
  - con Pablo Sanz elegido para la 3.ª y el recreo, comprueba también que la línea de su día nombra la 3.ª y el recreo y que su carril cuenta tres apoyos;
  - confirma solo la 1.ª y comprueba, a 1440×900 y a 1280×720, que en la fila de 3.º B todos los estados quedan a la misma altura y que la línea de estado dice lo confirmado, con el atajo;
  - tras confirmar, comprueba que la fila del día cabe en la primera pantalla de un portátil de 1366×768 con el navegador maximizado (1366×643) y de un proyector de 1280×720 en una ventana (1280×633). Con el zoom al 110 % (1242×607) no cabe: lo dice como aviso, no como error;
  - con el ratón, va de la tarjeta de Fotocopiadoras al atajo de la demo y comprueba que ningún globo lo tapa;
  - envía el dosier con la respuesta que lo adjunta, con y sin el visto bueno, y comprueba que el lunes 23 no pasa a ✓ y dice lo que falta.

## Privacidad de la demo

- Todos los nombres, cursos y casos son inventados. El alumno del protocolo aparece como «Alumno/a A».
- No hay inicio de sesión ni formularios que recojan datos: se entra eligiendo un perfil.
- No hace ninguna petición a internet. Lo que se toca se queda en la pestaña del navegador.
