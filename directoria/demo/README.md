# Demo de DirectorIA

Una aplicación de ejemplo para enseñar DirectorIA en la reunión con un colegio. Primero se elige un cargo: dirección, jefatura de estudios, secretaría, docente, orientación o profesor que sustituye. Después se entra en su panel, que tiene:

- el resumen del día;
- el correo resumido, con respuestas ya propuestas para revisar y enviar;
- las funciones propias de ese cargo.

Todo es inventado y nada sale de la página.

## Cómo abrirla

- **En claude.ai:** [Demo de DirectorIA](https://claude.ai/artifact/QVHqnL2PZ1ioxfGBxAEBMq). Es el enlace para enseñarla o mandarla.
- **Sin conexión:** abrid `index.html` en el navegador. Lleva dentro las fuentes, el logotipo y las ilustraciones, y no carga nada de internet.
- **Pantalla:** se ve bien en el móvil, pero para enseñarla es mejor un portátil o la pantalla de la sala.
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
   - Pulsad «Confirmar todas».
   - Qué decir: «Hasta que jefatura confirma, no se avisa a nadie».
2. **La ficha de quien sustituye** (Profesor que sustituye → Tus fichas de hoy).
   - Pablo ve solo lo que necesita para entrar en 3.º B: la tarea, una pauta, una alergia y quién puede recoger a Hugo.
   - La ficha se cierra al acabar la jornada y queda registrado quién la abre.
   - Si no se han confirmado las guardias, la ficha espera y ofrece ir a jefatura.
3. **El resumen de las 8:00** (Dirección → Inicio).
   - Elena ve quién falta y cómo se ha cubierto (ya con las guardias confirmadas), qué vence y qué correos importan.
   - Abrid el correo de la inspección y, desde él, el dosier.
4. **Un correo dictado** (Docente → Correo dictado).
   - Pulsad «Empezar a dictar» y después «Redactar el correo».
   - Laura lo cuenta como se lo contaría a un compañero y le llega el correo para la familia de Daniel ya redactado. Lo revisa y lo envía ella.
5. **Un protocolo, con reserva** (Orientación → Protocolo de acoso).
   - El Caso 2026-07 paso a paso, con fechas, responsables y documentos preparados con las plantillas del protocolo.
   - Qué decir: los datos del caso no pasan por la IA, y si hay acoso lo decide el equipo del centro.
6. **El analista de gastos** (Secretaría → Analista de gastos).
   - Facturas, contratos y extractos de octubre, con avisos de renovaciones y posibles ahorros.
   - Secretaría lo envía a dirección y a la titularidad, que son quienes deciden.

El correo funciona igual en todos los perfiles. Cada mensaje llega resumido, con lo que piden y tres respuestas propuestas. Se elige una, se cambia si hace falta y se envía después de confirmar.

## Qué lleva IA y qué no

- **«Preparado con IA», con la insignia naranja.** Solo aparece donde ha escrito el modelo de lenguaje:
  - los resúmenes y las respuestas del correo;
  - el dictado y el acta;
  - los plazos sacados de circulares y correos;
  - el banco de recursos, las traducciones y el material con Claude.
- **«Preparado por DirectorIA», sin insignia.** Aparece donde DirectorIA aplica reglas o rellena plantillas: guardias, fichas, certificados, dosier, protocolo, registros e informe de gastos.

Es el mismo criterio del documento [Qué funciones necesitan IA](https://claude.ai/artifact/5KaRG2PbmxAfFtQJQjM5md).

## Cómo cambiarla

- **Textos:** los de cada perfil están en `src/datos/<perfil>.js`. En `guion-de-datos.md` están el formato y las reglas comunes:
  - el colegio, la fecha y las personas;
  - las historias que cruzan perfiles;
  - el tono;
  - la privacidad;
  - el criterio de las etiquetas de IA.
- **Motor y estilos:** el motor está en `src/app.js` y los estilos en `src/app.css`, con los colores y las tipografías de la marca.

Después de cambiar algo, desde esta carpeta:

```
node validar.mjs src/datos/*.js       # comprueba textos, longitudes y enlaces entre pantallas
node construir.mjs .                  # regenera index.html
node probar.mjs index.html capturas   # opcional: recorre todas las pantallas y hace capturas
```

- `construir.mjs` toma las fuentes, el logotipo y las ilustraciones de las carpetas de la marca (`../fuentes`, `../logo` y `../ilustraciones`). Necesita Node 18 o posterior.
- `construir.mjs` también genera `demo-directoria.html`, la versión que se publica en claude.ai. No hace falta guardarla en el repositorio.
- `probar.mjs` necesita Playwright con Chromium. Avisa si hay errores en la consola o si alguna pantalla se sale de lado a 390 px de ancho.

## Privacidad de la demo

- Todos los nombres, cursos y casos son inventados. El alumno del protocolo aparece como «Alumno/a A».
- No hay inicio de sesión ni formularios que recojan datos: se entra eligiendo un perfil.
- No hace ninguna petición a internet. Lo que se toca se queda en la pestaña del navegador.
