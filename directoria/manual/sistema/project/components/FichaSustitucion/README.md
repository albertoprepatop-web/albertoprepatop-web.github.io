# FichaSustitucion

La ficha que recibe quien sustituye: qué hacer en esa sesión, con qué material y a quién llamar. Solo lleva la clase: ningún dato de alumnos. Es la pantalla de la app que mejor cuenta el producto, y se usa igual en la web, en la presentación y en la hoja comercial.

- **Qué pone quien la usa:**
  - Una cabecera con la sesión (`ficha-sesion`: grupo, materia, hora y aula) y quién la ha preparado (`ficha-origen`): «Preparada por DirectorIA · confirmada por jefatura». Va sin la `insignia` de la IA, porque la ficha sale de las reglas y los datos del colegio, no de la IA.
  - Una lista `dl.ficha-datos` con Tarea (sale de la programación quincenal de quien falta), Material (qué hace falta y dónde está) y A quién llamar (tutoría, jefatura y conserjería).
  - En `ficha-aviso`, con la etiqueta «Lo que no está en esta ficha», la línea fija, igual en todas las fichas: «Las indicaciones de salud y de recogida de los alumnos no están en DirectorIA: las tiene el colegio. Pregúntalas en conserjería o a la tutora antes de empezar.» No es un dato: no cambia de una ficha a otra.
  - Un pie con las condiciones de acceso.
- **Nunca:** etiquetas como «Necesidades», «Salud» o «Recogida», ni nombres, iniciales o datos de alumnos. Tampoco campos de evaluación, notas ni diagnósticos. DirectorIA no guarda datos de alumnos (decisión del 28 de noviembre de 2026).
- **Siempre en `papel` con `sombra`,** también dentro de una sección oscura, porque es una pantalla.
- **El aviso** va sobre `chispa-suave` con la etiqueta en `pizarra`. Nunca en rojo, y nunca en `chispa-texto` sobre `chispa-suave` (4,2:1).
- **Ejemplos ficticios:** grupo, aula y extensiones inventados, y debajo la nota «Ejemplo ficticio».
- **La ficha muestra solo lo necesario para esa sesión** y se cierra al acabar la jornada.
