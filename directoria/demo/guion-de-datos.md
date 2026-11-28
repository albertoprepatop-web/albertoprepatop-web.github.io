# Demo de DirectorIA: guion común y formato de los datos

Esta demo es la aplicación modelo que el fundador de DirectorIA enseña a los equipos directivos de colegios privados y concertados. Primero se elige con qué perfil entrar: directora, jefe de estudios, secretaría, docente, orientador o profesor que sustituye. Dentro, cada perfil ve su panel:

- **Inicio:** lo de hoy.
- **Correo:** cada correo llega resumido y con respuestas propuestas para revisar, editar y enviar.
- **Funciones propias del cargo.**

Todo es un ejemplo ficticio y nada se envía de verdad. Y **DirectorIA no guarda datos de alumnos: solo del profesorado y del funcionamiento del colegio** (§5).

Cada perfil tiene un archivo de datos, `src/datos/<id>.js`. Este documento fija:

- la historia común, para que los perfiles cuadren entre sí;
- la voz;
- las reglas de privacidad;
- el formato exacto de los datos.

## 1. El colegio y el día

- **Colegio Ejemplo** (ficticio), concertado, en la Comunidad de Madrid: Infantil, Primaria y ESO. Unos 52 docentes.
- **Hoy:** miércoles 18 de noviembre de 2026. La demo empieza a las 7:55-8:00.
- **Horario de Primaria** (jornada partida):

  | Sesión | Hora |
  |---|---|
  | 1.ª | 9:00-9:45 |
  | 2.ª | 9:45-10:30 |
  | 3.ª | 10:30-11:15 |
  | Recreo | 11:15-11:45 |
  | 4.ª | 11:45-12:30 |
  | Comida | 12:30-14:30 |
  | 5.ª | 14:30-15:15 |
  | 6.ª | 15:15-16:00 |

  Salida y recogida a las 16:00.
- **ESO:** de 8:15 a 14:45.
- **DirectorIA:** «La aplicación y los datos están en un servidor dentro del colegio. La copia de seguridad, cifrada, está en la UE. Los correos salen por la cuenta del propio colegio. El mantenimiento a distancia queda registrado.»

## 2. Personas (todas inventadas)

| Persona | Cargo | Perfil de la demo |
|---|---|---|
| Elena Ruiz | Directora | `direccion` |
| Javier Martín | Jefe de estudios | `jefatura` |
| Carmen López | Secretaría y administración; lleva el personal | `secretaria` |
| Laura Sánchez | Tutora de 4.º A de Primaria; da Educación Física en 2.º ciclo | `docente` |
| Andrés Vidal | Orientador (Departamento de Orientación) | `orientacion` |
| Pablo Sanz | Maestro de apoyo de Primaria; hoy cubre dos sesiones | `sustituto` |
| Sergio Prieto | Tutor de 3.º B de Primaria; hoy no viene | — |
| Rosa Medina | Maestra de Primaria (guardia en 3.ª hora) | — |
| Teresa Gil | Maestra de Inglés (vigilancia del recreo) | — |
| Ana Torres | Tutora de 3.º A: la tutoría a la que se llama desde las fichas de 3.º B | — |
| Pilar Serrano | Coordinadora del 2.º ciclo de Primaria | — |
| Ramón Esteban | Jefe del Departamento de Matemáticas | — |
| Beatriz Romero | Tutora de 2.º ESO B | — |
| Nuria Castro | Coordinadora de bienestar y protección | — |
| Marta Ramos, Luis García | Docentes que han compartido recursos en el banco, con Pilar Serrano | — |

**Alumnado: ninguno.** DirectorIA no guarda datos de alumnos (§5), y la demo tampoco los tiene: ni nombres ni iniciales. Se habla de grupos («3.º B», «4.º A»), de cifras agregadas («6 recibos devueltos») y de «su hijo» o «su hija» en lo que escriben las familias. El único nombre que se parece al de un alumno es el que escribe la docente para probar el filtro del material con Claude («Lucas y Sara»): el filtro lo para y no se envía nada.

**Familias:** escriben de temas generales, sin nombres de alumnos y sin nada de salud, y firman con su nombre de pila:

- Raquel y Nadia, de 4.º A (docente): qué llevar a la salida y el chándal, en inglés;
- Inés, de 4.º B (secretaría): cómo pagar la salida;
- Elisa, de 5.º (orientación): una charla para familias sobre pantallas;
- Marcos, de 4.º ESO B (jefatura): cuándo salen las fechas de los exámenes.

**Docentes:** con su nombre entero, también en el banco de recursos («De Marta Ramos»). Nombre e inicial es como se nombraba antes a los alumnos, y `validar.mjs` lo rechaza.

**Organismos:** se nombran de forma genérica:

- «Inspección educativa (DAT Madrid-Capital)»;
- «Consejería de Educación»;
- «Ayuntamiento»;
- «AMPA del colegio»;
- «la universidad» (el Máster de Formación del Profesorado);
- empresas sin marca, por ejemplo «la empresa de fotocopiadoras».

**Sin direcciones de correo ni teléfonos.** Solo las extensiones internas de las fichas: conserjería (ext. 200), jefatura de estudios (ext. 202) y la tutoría de 3.º A (ext. 213).

## 3. La historia común (lo que cada perfil ve tiene que cuadrar)

### E1. Ausencia de Sergio Prieto

A las 7:45 avisa por la app de que no viene. **El motivo no se guarda:** el registro de ausencias dice que falta y a qué horas (toda la jornada) y, del justificante, «pendiente». Cuando lo tenga, lo sube desde DirectorIA (E8). En ningún perfil se dice por qué falta, ni de pasada («que te mejores»).

DirectorIA propone cómo cubrir sus sesiones con 3.º B y jefatura lo revisa:

| Sesión | Grupo y materia | Propuesta | Motivo |
|---|---|---|---|
| 1.ª hora, 9:00-9:45 | 3.º B, Lengua | Pablo Sanz | Tiene guardia a esa hora. Lleva 2 guardias este mes; la media es 3. |
| 3.ª hora, 10:30-11:15 | 3.º B, Ciencias de la Naturaleza | Rosa Medina | Tiene guardia. |
| Recreo, 11:15-11:45 | Vigilancia del patio de Primaria (turno de Sergio) | Teresa Gil | — |
| 6.ª hora, 15:15-16:00 | 3.º B, Matemáticas | Pablo Sanz | También hace la salida de las 16:00. |

Las sesiones 2.ª, 4.ª y 5.ª de 3.º B las dan especialistas: Inglés, Educación Física y Música.

**Quién cubre una guardia o una clase.** Lo decide jefatura. DirectorIA lo propone con las reglas del colegio, sin IA: primero, quien tiene guardia a esa hora; si no hay, quien tiene hora libre; entre varios, quien lleva menos guardias este mes. Lo mismo vale para la guardia del jueves 19 de Laura Sánchez, que tiene una tutoría a esa hora: a 4.ª no hay nadie más de guardia y Rosa Medina es la única con esa hora libre, así que la propuesta es ella sin mirar cuántas guardias lleva (ver `jefatura` y `docente` en §7).

**Las guardias no se devuelven.** Quien cubre una guardia no recupera esa hora más tarde, y nadie le debe una guardia a nadie: en la demo no hay «vuelta», ni nada «a cambio», ni intercambios entre docentes. `validar.mjs` falla si una pieza que habla de una guardia (una fila, una marca, un correo con sus respuestas, un plazo…) dice que se devuelve, habla de su «vuelta», de algo «a cambio», de un intercambio o de un «cambio de guardia», o dice que alguien le debe una guardia a otro («le debo una guardia», «te la debo»). La hora de regreso de una salida («Vuelta a las 13:30») no cuenta, aunque la pieza nombre una guardia.

**Estado al empezar la demo:** la propuesta está pendiente de que jefatura la confirme. Cuando jefatura la confirma en la demo, cambian dos cosas:

- el resumen de la directora;
- el panel de Pablo.

Se marca con `bandera: 'guardias'`; ver el formato.

### E2. Ficha de sustitución de la 6.ª hora

**3.º B · Matemáticas · 6.ª hora**, para Pablo Sanz. **Solo la clase:**

| Apartado | Contenido |
|---|---|
| Hora y aula | 15:15-16:00 · Aula de 3.º B, planta baja |
| Origen | «Preparada por DirectorIA · confirmada por jefatura», sin insignia |
| Tarea | Ejercicios 4 a 9 de la página 58, de la programación quincenal de Sergio Prieto. |
| Material | Los libros de Matemáticas, en el armario del aula. Las hojas de cuadrícula, en la bandeja de la mesa del tutor. |
| A quién llamar | Tutoría: Ana Torres, tutora de 3.º A (ext. 213) · Jefatura de estudios (ext. 202) · Conserjería (ext. 200) |
| Al acabar | A las 16:00, acompaña al grupo a la puerta de Primaria. |
| Antes de empezar | La línea fija (abajo). |

**La línea fija**, igual en todas las fichas, en un aviso con el triángulo: «Las indicaciones de salud y de recogida de los alumnos no están en DirectorIA: las tiene el colegio. Pregúntalas en conserjería o a la tutora antes de empezar.» No es un dato: la pone el motor (`LINEA_FICHA` en `src/app.js`) y `validar.mjs` la deja pasar, también cuando se cita en otro sitio («Las indicaciones de salud y de recogida de los alumnos no están en DirectorIA: las tiene el colegio», en la entradilla de «Tus fichas de hoy»).

**Cómo funciona la ficha:**

- **Lo que no lleva:** nada de «Necesidades», «Salud» ni «Recogida», ni nombres de alumnos. Lo de salud y recogidas lo tiene el colegio: por eso Pablo pregunta en conserjería antes de la salida de las 16:00.
- **Origen:** la tarea sale de la programación quincenal de Sergio; el material, de su programación y del aula; a quién llamar, de la lista del centro. Sin IA.
- **Apertura:** se abre antes de la sesión y se cierra al acabar la jornada.
- **Registro:** queda registrado quién la ve.

También hay una ficha más corta de la 1.ª hora (3.º B, Lengua: lectura de las páginas 40-41 y las preguntas 1 a 3 en el cuaderno; al acabar, a las 9:45, llega Teresa Gil, la maestra de Inglés) y, en la vista previa de jefatura, la de la 3.ª de Rosa Medina (3.º B, Ciencias de la Naturaleza; al acabar, a las 11:15, acompaña al grupo al patio, donde vigila Teresa Gil).

### E3. Guías de los protocolos

Dirección y orientación tienen las guías de tres protocolos: acoso escolar, absentismo y accidentes. Son las mismas y se escriben una vez, en `orientacion`; dirección las toma de ahí (`guias: 'orientacion/protocolos'`, §6.4). **DirectorIA explica cómo se hace y los pasos que hay que seguir**, según el protocolo vigente de la Comunidad de Madrid. En cada paso:

- qué se hace;
- quién lo hace;
- el plazo («Según el protocolo vigente» si no hay uno fijo);
- el anexo: la plantilla oficial en blanco, para descargar e imprimir;
- dónde queda (Raíces, el expediente del centro), si hace falta;
- qué hay que cuidar: la confidencialidad, no prejuzgar, que decide la dirección.

**Los pasos del protocolo de acoso escolar:**

1. Comunicación a la dirección (Anexo I.a o I.b).
2. Apertura y comunicación oficial (en Raíces).
3. Medidas de protección (las decide la dirección).
4. Recogida de información (Anexo II, dos docentes que designa la dirección).
5. Reunión para la toma de decisiones (Anexo III).
6. Si se confirma: comunicación a Fiscalía de Menores e Inspección.
7. Si se confirma: familias y plan de intervención.
8. Si se confirma: procedimiento disciplinario (Decreto 32/2019 de convivencia).
9. Seguimiento y cierre (Anexo IV.c, en Raíces).

Los pasos 6 a 8 van detrás de «Si se confirma el acoso», con el número en borde discontinuo. Las guías de absentismo (cinco pasos, de las faltas en Raíces o en el programa de gestión del colegio a la derivación al programa municipal) y de accidentes (cinco pasos, de atender y llamar al 112 al parte del seguro escolar) siguen el mismo formato.

**No se abre ningún caso en DirectorIA.** No hay «Caso 2026-07», ni «Alumno/a A», ni citaciones a una familia, ni recordatorios de un caso: los datos del caso van donde manda el protocolo, Raíces y el expediente del centro. La guía lo dice así, arriba, y lo repiten los pasos («El caso se registra en Raíces, no en DirectorIA»).

**Lo legal, como lectura del equipo.** El pie de la guía: «Es la lectura del protocolo vigente que ha hecho el equipo de DirectorIA, no la de un abogado: manda siempre el texto oficial. Si hay acoso, y con qué medidas, lo decide la dirección.»

**En la historia:** Nuria Castro quiere dedicar 20 minutos del claustro del miércoles 25, a las 16:15, a explicar el protocolo de acoso, y le pide a Andrés Vidal un guion antes del lunes 23. Andrés lo prepara con la guía. Sin ejemplos de casos del colegio. En dirección, la guía recuerda que en el de acoso casi todos los pasos son de la dirección, y el Inicio de Elena Ruiz la enlaza desde «Para saber».

### E4. Visita de inspección

Inspección educativa (DAT Madrid-Capital) visitará el colegio el **jueves 26 de noviembre a las 10:00**. Pide, **antes del lunes 23**:

- el plan de convivencia 2026-27;
- los horarios de 2.º ESO;
- las programaciones de Matemáticas de ESO;
- las actas de las reuniones del Departamento de Matemáticas de este trimestre.

DirectorIA reúne un dosier con lo que hay en el servidor del colegio: documentos del centro, sin datos de alumnos. Falta el acta de la reunión del Departamento de Matemáticas del martes 17 (la reunión en la que se habló del examen de 4.º ESO): todavía no está en el archivo, y la directora decide si se la pide a Ramón Esteban.

### E5. Claustro del lunes 16

La directora dictó un resumen de 12 minutos. El borrador del acta recoge tres acuerdos:

1. Las sesiones de la 1.ª evaluación serán del 9 al 11 de diciembre.
2. Salida de 4.º de Primaria al Jardín Botánico el viernes 27 de noviembre.
3. En Primaria se dedicarán 20 minutos diarios a la lectura a partir de enero.

Asistieron 47 de 52 docentes.

**Lo que hay que revisar:**

- que los acuerdos recogen lo que se votó. El borrador avisa de que, en el dictado, el recuento del tercer acuerdo no queda claro (39 o 38 votos a favor): pone 39, que es lo que suma con los 47 asistentes;
- que no hay datos de alumnos.

Una vez aprobada, el acta se guarda en el archivo de actas, con buscador.

### E6. Analista de gastos

Lo usa sobre todo secretaría, y el informe mensual llega a dirección y a la titularidad.

**Avisos del informe de octubre:**

- El contrato de las fotocopiadoras se renueva solo el 1 de diciembre; se puede negociar o cambiar antes del 21 de noviembre (preaviso del contrato).
- La potencia de luz contratada es mayor que la que se usa: bajarla ahorraría unos 1.800 € al año (estimación).
- Hay dos presupuestos de seguro escolar comparados (la póliza vence el 31 de diciembre).
- El banco cobra 46 € al mes de comisión de mantenimiento: conviene pedir que la quite.
- Cobros pendientes de octubre: 6 recibos devueltos (1.240 €). Solo se dan cifras agregadas, sin nombres.

No sustituye a la gestoría ni lleva la contabilidad oficial.

### E7. Circular de la Consejería

Pide los datos para la estadística de inicio de curso 2026-27.

- **Qué hay que entregar:** cuántos alumnos hay por curso y grupo (cifras, sin nombres) y los datos del profesorado, por etapa y jornada.
- **Quién:** secretaría.
- **Cómo y cuándo:** por la plataforma de la Consejería, antes del viernes 27 de noviembre. DirectorIA avisa el miércoles 25.

### E8. Justificantes del profesorado

Una función de las dos versiones, Esencial y Completo, sin IA.

- **Cada docente sube el suyo** (médico o de cualquier tipo) desde DirectorIA, no por correo, y elige la ausencia a la que corresponde.
- **Un programa, con reglas y sin IA, lo renombra y lo archiva en su carpeta:** Justificantes / curso / mes / docente. Por ejemplo, «Justificantes/2026-27/2026-11/Laura Sánchez/2026-11-16 justificante.pdf».
- **Ni la IA ni ningún programa lee su contenido:** nada lo extrae. La IA no tiene acceso a esa carpeta: no la busca, no la resume y el asistente no la usa. Solo lo abren las personas que pueden verlo (abajo).
- **En el registro de ausencias** solo pone «Justificante: entregado» o «pendiente», nunca el motivo.
- **Lo ven** el propio docente y quien lleva el personal (en el Colegio Ejemplo, secretaría), con registro de accesos: quién sube cada uno y quién lo abre («Carmen López abrió el de Teresa Gil del jueves 12 de noviembre, el viernes 13 a las 18:05»). Jefatura ve el registro de ausencias, no los archivos.
- **Se borra** cuando pasa el plazo que fija el colegio.
- Es el único dato de salud que guarda DirectorIA, y es del profesorado: guardado y ordenado, nunca leído.

Se dice así: «Los justificantes los archiva un programa en su carpeta; la IA no los lee.»

**En la historia:**

| Docente | Ausencia | Justificante |
|---|---|---|
| Sergio Prieto | Miércoles 18 de noviembre (hoy), toda la jornada | Pendiente |
| Laura Sánchez | Lunes 16 de noviembre, 9:00-10:30 | Pendiente: lo sube en la demo |
| Teresa Gil | Jueves 12 de noviembre, toda la jornada | Entregado |
| Rosa Medina | Jueves 5 de noviembre, 9:00-11:15 | Entregado |
| Beatriz Romero | Martes 27 de octubre, 8:15-10:05 | Entregado |
| Ramón Esteban | Miércoles 21 de octubre, 12:30-14:45 | Entregado |
| Laura Sánchez | Jueves 8 de octubre, toda la jornada | Entregado |

Mientras está pendiente, en la carpeta no hay archivo: su hueco dice «Sin archivo todavía». Cuando Laura sube el suyo (en la demo, un archivo de ejemplo, «escaneo_0001.pdf»), sale en su carpeta con su nuevo nombre, la cifra de secretaría pasa de 5 a 6 de 7 entregados y el informe de jefatura dice «Entregado». Sergio Prieto le pregunta a secretaría cómo hacerle llegar el suyo, y las respuestas propuestas le explican cómo subirlo.

### E9. Convocatoria del consejo escolar

La directora convoca la sesión ordinaria del consejo escolar el **jueves 3 de diciembre a las 17:00**, en la sala de reuniones. DirectorIA prepara la convocatoria con la plantilla del centro, sin IA, y la directora la firma.

**Orden del día:**

1. Lectura y aprobación, si procede, del acta de la sesión anterior.
2. Información de la visita de Inspección educativa del jueves 26 de noviembre.
3. Calendario de la 1.ª evaluación y fecha del festival de Navidad.
4. Plan de lectura de Primaria, desde enero.
5. Ruegos y preguntas.

El borrador avisa de que la fecha del festival depende de lo que la directora responda al AMPA, que propone el viernes 11, en plenas sesiones de evaluación. Si la firma hoy, llega con dos semanas de margen; después la envía ella desde su correo.

### E10. Calendario de mantenimiento (ejemplo)

| Instalación | Revisión | Fecha |
|---|---|---|
| Extintores | Revisión anual de la empresa mantenedora | vence el 30 de noviembre |
| Desfibrilador | Cambio de electrodos | 12 de diciembre |
| Caldera | Revisión anual | hecha el 2 de noviembre |
| Ascensor | Inspección periódica | 15 de enero de 2027 |

### E11. Salida al Jardín Botánico

4.º de Primaria, viernes 27 de noviembre.

- **Horario:** salida a las 9:15 y vuelta a las 13:30.
- **Qué hay que llevar:** almuerzo, agua, gorra y ropa cómoda.
- **Autorizaciones:** firmadas antes del viernes 20. Las tutorías las llevan a secretaría y dicen cuántas faltan (una cifra, sin lista de nombres).
- **Precio:** 6 € (entrada y autobús), en el recibo de diciembre.

La circular es general: orientación la adapta a lectura fácil y al inglés para las familias de 4.º que lo prefieren, y sale a todas las familias de 4.º con las tres versiones. Laura Sánchez dicta además un recordatorio para las familias de 4.º A (el correo dictado, en `docente`).

### E12. Banco de recursos

Laura busca «flashcards de alimentos para EF 2.º ciclo». La IA lo entiende como: Flashcards · Alimentación saludable · Educación Física · 3.º y 4.º de Primaria («con IA», sin la insignia: entiende la petición y busca en el catálogo, no escribe).

Aviso: «Todavía no hay de Educación Física en 2.º ciclo. Te enseñamos lo más parecido:»

| Resultado | Datos | Etiqueta |
|---|---|---|
| Flashcards: los grupos de alimentos | Educación Física · 6.º de Primaria · De Marta Ramos · Hecho con IA y revisado | «Misma materia, ciclo siguiente» (con el botón «Adaptar a 3.º–4.º») |
| Tarjetas de hábitos saludables | Educación Física · 2.º de Primaria · De Luis García | «Misma materia, ciclo anterior» |
| Juego: la pirámide de los alimentos | Ciencias de la Naturaleza · 4.º de Primaria · De Pilar Serrano | «Mismo curso, materia afín» |

Al subir un recurso, el curso y la materia son obligatorios, y la IA sugiere los contenidos del catálogo («Sugeridos del catálogo · con IA», sin la insignia: elige, no escribe). Declarar que está hecho con IA es voluntario: si se marca, el recurso lleva la etiqueta «Hecho con IA y revisado». Al leer el archivo, DirectorIA comprueba con reglas que no lleve un DNI, un © ni un ISBN, y con IA («con IA», sin la insignia: lee, no escribe) que no lleve nombres ni datos de salud. Es el filtro que impide que entren datos de alumnos en el banco.

La gamificación no tiene clasificaciones ni premios a la cantidad. Los datos de uso nunca sirven para evaluar a nadie.

### E13. Material didáctico con Claude (opcional)

Es un módulo en la nube, solo para material didáctico y sin acceso a los datos del colegio. Un filtro está pensado para bloquear datos personales, y la norma de uso es no introducirlos. Cada colegio lo paga en su propia cuenta. En la demo, el filtro se prueba con una petición que lleva dos nombres («que el cartel final lo presenten Lucas y Sara»): la para y no se envía nada.

## 4. Voz (obligatorio)

**Lee también** la identidad verbal de la marca, en `../manual/identidad-verbal.md`.

**Trato:**

- La aplicación habla a quien la usa de **tú**: «Revisa y envía», «Tu resumen».
- Las respuestas propuestas usan el trato de cada destinatario:
  - a las familias, de usted o ustedes, cordial y claro;
  - a Inspección y a la Consejería, de usted, formal;
  - a los compañeros, de tú.

**Quién hace qué:**

- La IA **prepara, resume, propone y avisa**.
- Decidir, aprobar, firmar, enviar y evaluar son cosas de **personas**.
- Nada se envía ni se firma solo. Nunca escribas «automáticamente», «la IA decide», «la IA envía» ni «la IA asigna».

**Estilo:**

- Frases cortas, voz activa y vocabulario de colegio: guardia, claustro, jefatura, acta, tutoría, programación quincenal.
- Sin anglicismos, salvo «flashcards», que usa el colegio, y sin siglas sin explicar.
- Español de España, con tildes y signos de apertura.
- Ordinales: 1.º, 2.ª, 3.er. Horas: 9:00. Fechas: «vie 20 nov» en las etiquetas y «viernes 20 de noviembre» en el texto. Importes: «1.240 €».

**Lo que la IA nunca hace:** evaluar, puntuar ni clasificar a ningún alumno. Tampoco detecta casos, vigila a nadie ni reconoce caras.

**Privacidad:**

- La frase aprobada sobre los datos: «La aplicación y los datos están en un servidor dentro del colegio. La copia de seguridad, cifrada, está en la UE. Los correos salen por la cuenta del propio colegio. El mantenimiento a distancia queda registrado.» Nunca digas que los datos «no salen del colegio».
- Y esta: «DirectorIA no guarda datos de alumnos: solo del profesorado y del funcionamiento del colegio.» Nada de «la IA trata los datos de los alumnos» ni parecidas; en Completo, si hace falta: «La IA trabaja dentro del colegio, también con el correo.»
- De los justificantes del profesorado: «Los justificantes los archiva un programa en su carpeta; la IA no los lee.» De su contenido se dice «Ni la IA ni ningún programa leen lo que pone»; nunca «Nadie lee lo que pone», que choca con «lo ves tú y secretaría»: el docente y quien lleva el personal sí los abren.
- Lo legal se presenta como lectura del equipo, no de un abogado (el pie de las guías de los protocolos).
- Nada de «riesgo cero» ni de «cumplimiento garantizado».

**Etiquetas de origen.** Decisión del 25-11-2026 (documento «qué funciones necesitan IA»):

- «Preparado con IA» y la insignia van solo en lo que prepara la IA: resúmenes y respuestas de correo, dictados, actas, plazos sacados de circulares, en el banco de recursos la versión adaptada a otro curso y el título que propone al subir, traducciones y material con Claude.
- Lo que sale de reglas y plantillas lleva «Preparado por DirectorIA», sin insignia: guardias, fichas, dosier, convocatorias, guías de los protocolos, justificantes, registros e informe de gastos.
- Lo que la IA busca, lee o detecta sin escribir nada lleva «con IA», sin insignia: en la demo, en el banco de recursos, lo que entiende de la búsqueda («Entendido como»), los contenidos que sugiere del catálogo al subir un recurso y la comprobación de nombres y datos de salud.
- «Hecho con IA y revisado» es la etiqueta de los recursos del banco que el docente declara hechos con IA.

## 5. Privacidad en la demo

Decisión del 26-28 de noviembre de 2026: **DirectorIA no guarda datos de alumnos: solo del profesorado y del funcionamiento del colegio.**

- **Lo que no guarda:** nombres ni iniciales de alumnos, salud, alergias, necesidades o adaptaciones, recogidas, anotaciones, pautas personales, notas, certificados de un alumno, autorizaciones de imagen, optativas elegidas por un alumno, reclamaciones de una familia ni casos.
- **Lo que sí:** horarios, grupos («3.º B» no es un dato personal), aulas, guardias, plazos, documentos del centro, gastos y contratos. Las cifras agregadas sin identificar a nadie valen («6 recibos devueltos», «cuántos alumnos hay por grupo»).
- **Del profesorado:** el registro de ausencias guarda que alguien falta y a qué horas, nunca el motivo («Sergio Prieto no viene», nunca «tiene fiebre»). El justificante va a su carpeta (E8) y el registro solo dice «Justificante: entregado» o «pendiente».
- **El correo es la única excepción:** lo que llega por correo puede traer nombres de alumnos, porque lo escriben las familias. En Completo, la IA lo lee en el servidor del colegio para resumirlo, y DirectorIA no crea fichas de alumnos ni guarda sus datos aparte. En la demo, las familias escriben de temas generales y sin nombres de alumnos («mi hijo», «una familia de 4.º A»), y nada de salud.
- **La ficha de sustitución:** solo la clase, con la línea fija de salud y recogidas (E2).
- **Los protocolos:** guías de pasos, sin casos (E3).
- **Funciones que salieron de la demo:** certificados de matrícula y de estudios, autorizaciones de imagen, optativas por alumno, reclamaciones de familias, pautas y anotaciones de orientación, el acta de la junta de evaluación por dictado y las cartas personalizadas a una familia (el correo dictado de la docente es ahora un aviso general a las familias de su grupo).

**Lo comprueba `validar.mjs`** en todos los textos de los seis perfiles (el Inicio, el correo y los módulos). Falla si sale:

- un caso («Caso 2026-07») o «Alumno/a»;
- uno de los alumnos que tenía la demo (Mario, Lucía, Hugo, Daniel, Irene, Amira, Nora, Iker, Sofía, Adrián, Gonzalo, Carla, Alba, Óliver, Samuel) o un nombre con inicial («Nora D.»);
- datos de salud o diagnósticos (alergias, autoinyector, intolerancias, medicación…), necesidades o adaptaciones, recogidas («Recogida · última hora», «solo puede salir con…»);
- autorizaciones de imagen, certificados de un alumno, optativas, reclamaciones o pautas de un alumno;
- un motivo de ausencia («fiebre», «médico», «gripe», «que te mejores», «recupérate»…);
- en una ficha, otro apartado que no sea Tarea, Material, A quién llamar o Al acabar, o un aviso de alumnos;
- en una guía, un caso, un paso con estado («hecho», «en curso») o un progreso en el Inicio.

Deja pasar la línea fija de la ficha (también citada: «Las indicaciones de salud y de recogida de los alumnos»), los grupos, las cifras agregadas, «Recogida de información» (el paso del protocolo), «la información recogida» y «la recogida de datos» de la estadística.

**Lo vuelve a comprobar `probar.mjs`** en la página montada: recorre todas las pantallas de los seis perfiles, abre cada correo y busca lo mismo en el texto, con las guardias confirmadas para ver las fichas.

- **Respuestas propuestas:** no incluyen datos de alumnos.
- **En el Inicio:** ningún dato de salud de nadie: basta con «Sergio Prieto no viene».
- Todos los nombres son inventados.

## 6. Formato de los datos

Cada perfil es un archivo `src/datos/<id>.js` con **una sola llamada** `DEMO.rol({...})`. Es JavaScript normal: comillas simples o dobles, comas finales permitidas y sin funciones. Los textos largos van con `\n\n` entre párrafos; no uses HTML ni Markdown dentro de los textos.

Para comprobarlo:

```
node validar.mjs src/datos/<id>.js
```

Tiene que terminar sin errores.

### 6.1 Raíz

```js
DEMO.rol({
  id: 'direccion',                       // direccion | jefatura | secretaria | docente | orientacion | sustituto
  orden: 1,                              // posición en la pantalla de acceso (1-6)
  persona: {
    nombre: 'Elena Ruiz',
    cargo: 'Directora',                  // corto: sale en la tarjeta de acceso y en la cabecera
    detalle: 'Dirección del colegio',    // segunda línea
    ilustracion: 'direccion',            // una de: direccion, jefatura, secretaria, docente, orientacion, sustituto
  },
  acceso: 'Resumen de las 8:00, correo resumido, actas y dosier para inspección', // ≤ 90 caracteres
  inicio: { ... },                       // ver 6.2
  correo: [ ... ],                       // 4-6 correos, ver 6.3
  modulos: [ ... ],                      // 2-5 funciones propias, ver 6.4
});
```

### 6.2 Inicio

```js
inicio: {
  antetitulo: 'Miércoles 18 de noviembre · 8:00',
  titulo: 'Buenos días, Elena',
  entradilla: 'Esto es lo que ha preparado DirectorIA para hoy. Nada se envía ni se firma sin ti.', // ≤ 160 caracteres
  bloques: [                             // 2-4 bloques
    {
      titulo: 'Quién falta',             // ≤ 40 caracteres
      items: [                           // 1-4 items
        {
          texto: 'Sergio Prieto (3.º B) no viene hoy. La propuesta de guardias está lista y la revisa jefatura.',
          estado: 'pendiente',           // hoy | pendiente | hecho | info
          ir: 'correo:c-sergio',         // opcional: 'correo', 'correo:<id de correo>' o '<id de módulo>'
          // Opcional, solo para la historia E1: si ya se han confirmado las guardias en la demo,
          // se ve textoSi y estadoSi en lugar de texto y estado.
          bandera: 'guardias',
          textoSi: 'Jefatura ha confirmado las guardias para cubrir a Sergio Prieto.',
          estadoSi: 'hecho',
        },
      ],
    },
  ],
}
```

### 6.2 bis Inicio como panel de mando

En lugar de `bloques`, el Inicio puede ser un panel de mando: si lleva `cifras`, el motor pinta el panel y no admite `bloques`. Lo usan los seis perfiles. El panel tiene cinco partes, de arriba abajo:

1. **La cabecera:** el antetítulo, el saludo y una sola línea de entradilla, con la ilustración de la persona (`persona.ilustracion`) a la derecha, a 120 px (136 px desde 1500 px de ancho y 104 px en tableta; en el móvil no va). El motor añade al antetítulo «Preparado por DirectorIA en el servidor del colegio», sin insignia.
2. **Las cifras** (`cifras`): 3 o 4 tarjetas que llevan a donde se actúa.
3. **El día** (`dia`): el horario por sesiones, con un carril por grupo o por persona.
4. **Lo que te necesita** (`lista`): por grupos, con lo pendiente arriba.
5. **Lo que viene** (`agenda`): un calendario de pocas semanas y la agenda por días.

Con el panel por debajo de 62rem, el día pasa a una sesión por fila y sigue detrás de las cifras. Por debajo de 56rem (el móvil), «Lo que te necesita» va antes del día.

**Anchos y alturas.** Hasta 1279 px, el menú va en una fila bajo la cabecera, en todas las pantallas: así, en una tableta apaisada (1180 px) o en un portátil de 1366 px con el zoom al 110 % (1242 px), el panel llega a 62rem y el día sale en columnas. En una pantalla Full HD (1920 px), el Inicio llega hasta 96rem. En pantallas bajas (720 px de alto o menos, como 1280×720 o 1242×698), la cabecera y los márgenes se recogen y la ilustración baja a 96 px, para que la fila de 3.º B quepa entera. En ventanas de 700 px de alto o menos (un portátil de 1366×768 con el navegador maximizado, 1366×643, o un proyector de 1280×720 en una ventana, 1280×633), el saludo y la entradilla van en la misma línea, la ilustración se mete en el margen y las tarjetas se recogen un poco más: así, tras confirmar, «Confirmada a las 8:01» sigue en la primera pantalla. Con el menú en fila, 660 px de alto o menos y ratón (1366×768 con el zoom al 110 %, 1242×607), el menú se recoge (en una tableta táctil, no: sus enlaces siguen midiendo 44 px), pero la fila de 3.º B no cabe entera: para enseñar la demo, pantalla completa y el zoom al 100 % (README). En un móvil estrecho (por debajo de 368 px), el antetítulo lleva la fecha corta («Mié 18 nov · Tu resumen de las 8:00»), «Preparado por…» va en una línea pequeña y el botón de la cabecera dice «Cambiar» (su nombre sigue siendo «Cambiar de perfil»).

**Las ilustraciones de la cabecera.** Son las del kit de la marca (`directoria/ilustraciones`), salvo tres que trae la demo en `src/ilustraciones/`:

- `secretaria` y `orientacion`: el kit dibuja un secretario y una orientadora con hiyab, y aquí son Carmen López y Andrés Vidal;
- `direccion`: la misma directora del kit, pero la tableta lleva en la esquina el ✓ de «al día» en lugar de la insignia de la IA. El resumen de las 8:00 sale de reglas, y la chispa solo va en lo que escribe un modelo de lenguaje.

Están hechas con las mismas piezas del generador de la marca (`src/ilustraciones/generar-dos.mjs`) y están pendientes del visto bueno de la marca: si se aceptan, pasan al kit; si no, basta con borrar sus SVG y `construir.mjs` vuelve a usar las del kit.

**Qué lleva la insignia de la IA.** Las cifras, el día y el calendario salen de reglas y de los datos del colegio, así que no la llevan. El motor la pone solo en lo que ha escrito un modelo de lenguaje:

- en la nota de la cifra de correos, con «Resumidos con IA»;
- en las filas de la lista que resumen un correo, con «Resumido con IA»;
- en las marcas de la agenda que llevan `fuente`, con «Sacado del correo» o «Sacado de la circular».

**Lo que sigue el panel.** `sigue` es una de estas referencias:

- `'correo:<id>'`: hecho cuando el correo se ha respondido o archivado. Archivar no es responder: en la lista, la fila pasa a «Archivado a las…» sin su `si`; en una cifra, sale «Archivado» en lugar de `alTerminar` (salvo en una cuenta atrás, que sigue corriendo); y en la agenda no cuenta, porque el plazo sigue en pie;
- `'correo:<id>#<n>'`: hecho solo si se ha enviado la respuesta propuesta `n` (se cuentan desde 0), la que de verdad cumple el plazo: la que comunica el preaviso o la que adjunta el dosier. Varias, con comas: `'correo:<id>#0,1'`. El correo guarda qué respuesta se envió;
- `'correo:<id>#archivado'`: hecho si el correo se ha archivado sin responder (sirve en `aMedias`);
- `'<módulo>'`: hecho cuando el módulo está terminado (documento firmado o con el visto bueno, dictado enviado, tabla aprobada, todas las propuestas confirmadas, todos los plazos hechos, todos los justificantes entregados…). Una guía de un protocolo nunca está hecha: no se abre ningún caso;
- `'<módulo>#<elemento>'`: una propuesta de `aprobaciones` (por su id, `guardias#g1`), un plazo de `plazos` (por su posición, desde 0: `plazos#3`) o una ausencia de `justificantes` (por su id, `justificantes#j1`: hecho cuando su justificante está entregado);
- `'bandera:guardias'`;
- lo mismo de otro perfil, con su id delante: `'jefatura/guardias#g1'`;
- una lista de las anteriores, hecha cuando lo están todas: `['dosier', 'correo:c-inspeccion#1']` (el dosier con el visto bueno y enviado con la respuesta que lo adjunta). La hora es la de la última.

**Cuando jefatura elige a otra persona.** Si en «Guardias de hoy» jefatura elige a otra persona en el desplegable, todos los paneles enseñan a la elegida, antes y después de confirmar: «Elección: Rosa Medina» (un sustantivo, como «Propuesta:», que vale para cualquiera) y, confirmada, «Cubre Rosa Medina · Confirmada a las 8:01». «Confirmar todas» es una sola decisión: todas quedan confirmadas a la misma hora. Si la propuesta era la persona del perfil (Pablo Sanz, en el de quien sustituye), esa sesión deja de ser suya: sale de su recuento y, confirmada, pasa a aviso («Ya no la cubres · La cubre Rosa Medina»). Lo demás que cambia lo dicen los datos con `siOtra`: una lista de variantes, cada una con `cuando` (una propuesta, `'jefatura/guardias#g1'`, o varias) y los campos que cambian. Vale la primera variante cuyas propuestas han pasado todas a otra persona; `null` quita un campo (`rotulo`, `ir`, `sigue`). Va en las cifras con `valor`, en las filas de la lista y en los carriles del día.

**Cuando jefatura elige a la persona del perfil** para algo que DirectorIA proponía a otra (a Pablo Sanz para la 3.ª o el recreo), su panel también lo enseña. El carril lo dice con `siElegido`: una lista de sesiones, cada una con `cuando` (una sola propuesta), `franja`, `titulo`, `detalle`, `nota` (va en el globo) y `aviso`. Si jefatura la elige, la sesión sale en su franja como «cubre», en lugar de lo que tuviera a esa hora, con «Por confirmar · Elección: tú» y, confirmada, «Cubres tú»; cuenta en su recuento, y el `aviso` sale bajo el día, con el triángulo («Jefatura te ha elegido para la 3.ª de 3.º B: tu apoyo de Matemáticas en 3.º A queda sin hacer»). El validador comprueba que la propuesta era para otra persona y que la del perfil está entre las alternativas.

**La línea de estado del carril** (bajo el día) dice en qué punto está lo que confirma jefatura, con el recuento («2 de 4 confirmadas»):

- `pendiente`: nada confirmado todavía (con el atajo de la demo, si se confirma en otro perfil);
- `parcial`: jefatura ha confirmado una parte («Jefatura ha confirmado 2 de 4. Hasta que confirme las demás, no se avisa a quien las cubre.»), también con el atajo. Sin `parcial`, sale `pendiente`;
- `alTerminar`: todo confirmado, con la hora («8:01 · …»);
- `siNinguna` (`{ detalle, linea }`): en el panel de quien cubre, si jefatura le ha quitado todo lo que DirectorIA le proponía y no lo ha elegido para nada. La línea va con el triángulo.

Para que estos textos y el `detalle` digan lo que hay de verdad en el carril, también cuando jefatura elige a otra persona o a la del perfil, el motor rellena estos huecos:

| Hueco | Qué pone | Dónde vale |
|---|---|---|
| `{hechas}` | dónde cubre lo confirmado: «la 1.ª, la 3.ª, el recreo, la 6.ª y la salida» | `parcial`, `alTerminar` |
| `{faltan}` | lo que falta por confirmar: «la 6.ª y la salida» | `pendiente`, `parcial` |
| `{n}` y `{de}` | cuántas propuestas están confirmadas y cuántas hay, como el recuento | `pendiente` (solo `{de}`), `parcial`, `alTerminar` |
| `{clases}` | cuántas sesiones «clase» quedan, en letra («cuatro»; «tres» si jefatura le da la 3.ª y su apoyo de 3.º A queda sin hacer) | todos, también `detalle` y `siNinguna` |

Con mayúscula (`{Faltan}`, `{Clases}`), el valor empieza por mayúscula: va al principio de una frase. Solo cuentan las sesiones «cubre» que son de la persona del perfil (las que jefatura ha dado a otra, no). El validador comprueba que cada texto lleva solo los huecos que pueden tener valor en su momento y que fuera del carril no hay ninguno.

**Lo de las 8:00 y lo de después.** Los datos de una cifra con `valor` o de una fila dicen lo de las 8:00, cuando jefatura aún no ha confirmado. `siConfirmada` dice lo de después: una lista de variantes con `cuando` (una propuesta, o todo el módulo, `'jefatura/guardias'`, que es cuando llegan las fichas) y los campos que cambian. Vale la primera que está confirmada y sigue siendo de la persona del perfil; `siOtra` va antes. Así, a las 8:00, la cifra de Pablo no le pide leer una ficha que todavía no existe.

**A medias.** `aMedias` (en las cifras con `valor`, en las filas y en las marcas de la agenda) dice lo que cambia mientras lo que se sigue no está hecho, pero sí otra cosa que va hacia ello: el visto bueno al dosier, que aún no se ha enviado; una respuesta a la empresa de fotocopiadoras que no comunica el preaviso. Es una variante o una lista; cada una lleva su propio `sigue` y vale la primera que está hecha. No da nada por hecho: la marca sigue con su banderín y la cifra, con su cuenta atrás. Un correo archivado no va a medias: para eso está `'correo:<id>#archivado'`.

```js
inicio: {
  antetitulo: 'Miércoles 18 de noviembre · Tu resumen de las 8:00', // ≤ 60, sin «Preparado por…»: lo añade el motor
  titulo: 'Buenos días, Elena',
  entradilla: 'Lo que te espera hoy, quién cubre 3.º B y lo que vence. Nada se envía ni se firma sin ti.', // una línea a 1440 px: ≤ 100

  // Cifras: 3-4, de lo más urgente a lo menos. Cada una tiene un solo sentido y una sola de estas formas.
  cifras: [
    // Cuenta lo que queda, sin medidor: los correos con respuestas propuestas sin responder ni archivar (como el contador
    // del menú). La nota dice «Resumidos con IA», con la insignia; si pones «nota», va delante. Al terminar: «Al día»,
    // en los seis perfiles (cuenta también lo archivado).
    { etiqueta: 'Correos por responder', icono: 'correo', cuenta: 'correo', accion: 'Abrir el correo', alTerminar: 'Al día' },

    // Cuenta lo que queda, sin medidor: los pendientes que siguen sin hacer. La nota los resume con «corto»
    // («La convocatoria y el acta del claustro»); si queda uno, dice su «texto». La acción y el destino son los del primero
    // que queda. «ir» es obligatorio también en la cifra: es adonde lleva cuando ya no queda nada pendiente.
    { etiqueta: 'Pendiente de tu firma', icono: 'firma', ir: 'firma',
      pendientes: [
        { texto: 'La convocatoria del consejo escolar del jueves 3', corto: 'la convocatoria', sigue: 'firma', ir: 'firma', hoy: true, accion: 'Revisar y firmar', accionCorta: 'Firmar' },
        { texto: 'El acta del claustro del lunes 16', corto: 'el acta del claustro', sigue: 'acta', ir: 'acta', accion: 'Dar el visto bueno', accionCorta: 'Visto bueno' },
      ],
      alTerminar: 'Todo firmado', accionHecha: 'Ver lo firmado' },

    // Progreso «X de Y», con el medidor rotulado por la cifra. Vale:
    // - un documento con «documentos»: cuenta las piezas listas; el medidor pinta las listas (rellenas), las que hay que
    //   revisar (solo con borde) y las que faltan (borde discontinuo), en ese orden; el globo da las piezas en su orden;
    // - un dictado: los pasos Dictar, Revisar y Enviar; ya dictado, la nota y la acción son las de «siDictado»
    //   (si no, «Ya lo has dictado. Te queda revisar el correo y enviarlo tú.» y «Revisar y enviar»);
    // - aprobaciones, plazos o justificantes: los hechos (o entregados) de todos. Una guía de un protocolo no tiene progreso.
    // rotulo: lo que se cuenta («listas» en un dosier, por defecto; «entregados» en los justificantes).
    { etiqueta: 'Dosier para inspección', icono: 'carpeta', progreso: 'dosier', nota: 'Falta el acta de Matemáticas del martes 17 y revisar el escrito.',
      ir: 'dosier', accion: 'Revisar el dosier', accionCorta: 'Revisar', alTerminar: 'Visto bueno dado', accionHecha: 'Ver el dosier' },
    { etiqueta: 'Correo a las familias', icono: 'microfono', progreso: 'dictado', hoy: true, nota: '...', ir: 'dictado', accion: 'Empezar a dictar', accionCorta: 'Dictar',
      siDictado: { nota: 'Ya lo has dictado. Te queda revisar el correo y enviarlo tú.', accion: 'Revisar y enviar', accionCorta: 'Revisar' },
      alTerminar: 'Enviado', accionHecha: 'Ver lo enviado' },

    // Un valor, con su rótulo, que sigue algo para saber cuándo está hecho. Con cuentaAtras (la fecha que la fuente da como
    // «antes del…»), el motor pinta un tramo por cada día que queda, empezando por hoy, con su nombre (mié, jue, vie),
    // y el validador comprueba que el valor dice esos días. Si lo que sigue es un correo archivado, sale «Archivado»,
    // salvo en una cuenta atrás: archivar no la completa, porque el plazo sigue corriendo.
    // Aquí solo cumple el plazo la respuesta que comunica el preaviso (#1). Con otra respuesta, o archivado, la cuenta
    // atrás sigue y la nota lo dice (aMedias: la primera variante cuyo «sigue» está hecho).
    { etiqueta: 'Fotocopiadoras', icono: 'reloj', valor: '3 días', rotulo: 'para avisar, antes del sáb 21', cuentaAtras: '2026-11-21',
      nota: 'Si no avisas, el contrato se renueva solo el 1 de diciembre.', sigue: 'correo:c-fotocopiadoras#1',
      aMedias: [
        { sigue: 'correo:c-fotocopiadoras#archivado', nota: 'Archivado sin avisar. Si no avisas, el contrato se renueva solo el 1 de diciembre.' },
        { sigue: 'correo:c-fotocopiadoras', nota: 'Has respondido sin el preaviso. Si no avisas, se renueva solo el 1 de diciembre.' },
      ],
      ir: 'correo:c-fotocopiadoras', accion: 'Leer la oferta', alTerminar: 'Preaviso enviado', accionHecha: 'Ver el correo' },

    // Un valor con lo de las 8:00 y lo de después (siConfirmada), y lo que cambia si jefatura elige a otra persona (siOtra,
    // que va antes). Sin «sigue» en los datos, la cifra no se da por hecha hasta que lo diga la variante.
    { etiqueta: 'Tu primera sesión', icono: 'reloj', valor: '9:00', hoy: true,
      nota: 'Te proponen para Lengua con 3.º B. Tu ficha llega cuando jefatura confirme las guardias.', ir: 'jornada', accion: 'Ver tu jornada',
      siConfirmada: [
        { cuando: 'jefatura/guardias', nota: 'Lengua con 3.º B, en tu hora de guardia. Lee su ficha antes de entrar.', sigue: 'jornada#0', ir: 'ficha', accion: 'Leer tu ficha de 1.ª' },
        { cuando: 'jefatura/guardias#g1', nota: 'Cubres Lengua con 3.º B. Tu ficha llega cuando jefatura confirme las demás guardias.' },
      ],
      siOtra: [ { cuando: 'jefatura/guardias#g1', valor: '9:45', nota: '...', sigue: 'jornada#2', ir: 'jornada', accion: 'Ver tu jornada' } ],
      alTerminar: 'Ficha leída', accionHecha: 'Ver tu ficha' },

    // Las fichas que llegan (fichas: un módulo de aprobaciones con propuestas que llevan ficha). El motor cuenta las que son
    // de la persona del perfil, porque DirectorIA se las proponía o porque jefatura la ha elegido, y escribe la nota
    // («La de 1.ª y la de 6.ª llegan cuando jefatura confirme las guardias.»). Llegan todas al confirmar el módulo:
    // «alTerminar» o, si es una, «alTerminarUna». Sin ninguna, la cifra no se da por hecha: dice lo de «siNinguna».
    { etiqueta: 'Tus fichas de hoy', icono: 'documento', fichas: 'jefatura/guardias', rotulo: 'por llegar', ir: 'ficha',
      accion: 'Ir a tus fichas', alTerminar: 'Ya las tienes', alTerminarUna: 'Ya la tienes', accionHecha: 'Ver tus fichas',
      siNinguna: { valor: 'Ninguna', nota: 'Jefatura ha elegido a otra persona para la 1.ª y para la 6.ª de 3.º B.', ir: 'jornada', accion: 'Ver tu jornada' } },
  ],
  // etiqueta ≤ 32 · valor ≤ 10 · rotulo ≤ 32 · nota ≤ 90 · accion ≤ 28 · accionCorta ≤ 16 · accionHecha ≤ 16 · alTerminar ≤ 24
  //   · alTerminarUna ≤ 24 · siNinguna.nota ≤ 90 (lo mismo en las variantes)
  //   · corto ≤ 30, en minúscula
  // hoy: true pinta la cifra en pizarra con «Hoy» (una como mucho; en «pendientes», va en el pendiente).
  // El globo de una cifra (las piezas del dosier) sale con el ratón al detenerse en la cifra o en su
  //   medidor, no al cruzar la tarjeta camino de su acción o de la rejilla (así no tapa lo que se iba a pulsar), y con el
  //   foco del teclado. Lo mismo está en su módulo y en la descripción para el lector de pantalla.
  // La nota resume: no repite la primera fila de la lista. Sin medidor, la nota sube justo debajo de la cifra.
  // Formas: cuenta, pendientes, progreso, valor o fichas (una sola por cifra).
  // accionHecha: la acción cuando la cifra está hecha («Ver el dosier»). Sin ella, «Ver el correo» si lleva a un correo
  //   y, si no, «Ir a «…»», que no cabe en media tarjeta del móvil: el validador avisa.
  // En el móvil van dos cifras por fila y la acción, en «accionCorta». Sin ella, una acción de más de 16 caracteres
  //   pasa la cifra a una fila entera, como la del dictado, que lleva sus pasos con nombre. ancha: true la pasa a
  //   una fila entera a propósito. Lo hecho («Al día», «Visto bueno dado») va un poco más pequeño en media tarjeta.

  // El día por sesiones (opcional), sobre el horario de Primaria: 1, 2, 3, recreo, 4, comida, 5, 6 y salida.
  dia: {
    titulo: 'Quién cubre 3.º B hoy',       // ≤ 40, dice lo que hay: «Quién cubre 3.º B hoy», «Tu día», «Tu jornada»
    aviso: 'Hoy no viene Sergio Prieto, el tutor de 3.º B: tu Educación Física con ellos no cambia.', // opcional, ≤ 120: a la vista bajo el título
    nota: '...',                           // opcional, ≤ 60: a la derecha del título
    franjas: [ ... ],                      // opcional (2-12): otro horario, con { id, nombre, desde, hasta?, pausa? }; por defecto, el de Primaria
    carriles: [ {                          // 1-3
      titulo: '3.º B', detalle: 'Sergio Prieto no viene', icono: 'persona',
      // Si hay sesiones «cubre»: el recuento («2 de 4 confirmadas»), la línea de mientras tanto, la de a medias y la de al terminar.
      cuenta: 'confirmadas', pendiente: 'Las guardias las confirma jefatura. Hasta entonces, no se avisa a nadie.',
      parcial: 'Jefatura ha confirmado {n} de {de}. Hasta que confirme las demás, no se avisa a quien las cubre.', alTerminar: '...',
      // En el panel de quien cubre, con huecos que rellena el motor (ver la tabla de arriba):
      //   detalle: '{Clases} apoyos y lo que cubres de Sergio', parcial: 'Jefatura ha confirmado que cubres {hechas}. {Faltan}, por confirmar.',
      //   alTerminar: 'Jefatura ha confirmado que cubres a Sergio Prieto: {hechas}.'
      // siOtra (opcional): otra «pendiente», «parcial», «alTerminar» o «detalle» si jefatura elige a otra persona para lo tuyo.
      siOtra: [ { cuando: 'jefatura/guardias#g1', pendiente: 'Para la 1.ª, jefatura ha elegido a otra persona. {Faltan}, por confirmar.', alTerminar: '...' } ],
      // siNinguna (opcional): si jefatura te lo ha quitado todo y no te ha elegido para nada.
      siNinguna: { detalle: 'Cuatro apoyos. En 3.º B no cubres nada.', linea: '...' },
      // siElegido (opcional): las sesiones que DirectorIA proponía a otra persona y para las que jefatura te elige a ti.
      siElegido: [ { cuando: 'jefatura/guardias#g2', franja: '3', titulo: 'Ciencias de la Naturaleza', detalle: '3.º B',
        nota: 'Cubres a Sergio Prieto. Tu apoyo de Matemáticas en 3.º A queda sin hacer.',
        aviso: 'Jefatura te ha elegido para la 3.ª de 3.º B: tu apoyo de Matemáticas en 3.º A queda sin hacer.' } ],
      sesiones: [                          // sin pisarse; «hasta» une franjas seguidas (1.ª y 2.ª)
        { franja: '1', titulo: 'Lengua', tipo: 'cubre', sigue: 'jefatura/guardias#g1', nota: 'Tiene guardia a esa hora.' },
        { franja: '2', titulo: 'Inglés', detalle: 'Con su especialista', tipo: 'igual' },
        { franja: '4', titulo: 'Educación Física', detalle: '3.º B', tipo: 'aviso', aviso: 'Falta su tutor', nota: '...' },
        { franja: '5', hasta: '6', titulo: 'Ciencias de la Naturaleza y Plástica', detalle: '4.º A', tipo: 'clase' },
      ],
    } ],
  },
  // titulo y detalle de una sesión ≤ 40 · aviso ≤ 24 · nota ≤ 120 (va en el globo de la sesión)
  //   · en siElegido: titulo y detalle ≤ 40, nota y aviso ≤ 120
  //   · del carril: detalle ≤ 40, pendiente y parcial ≤ 120, alTerminar y siNinguna.linea ≤ 140 (con los huecos rellenos)
  // tipo: clase o igual (sin cambios): salvia plano, sin borde · aviso: chispa suave, con el triángulo y su texto
  //   · cubre: sigue una propuesta de jefatura. El título es lo que se cubre; la persona sale de la propuesta o de quien
  //     elija jefatura en el desplegable. Por confirmar: borde discontinuo, «…», «Por confirmar» y «Propuesta: Pablo Sanz»
  //     («Elección: Rosa Medina» si jefatura ha elegido a otra persona). Confirmada: pizarra, ✓, «Cubre Pablo Sanz» y
  //     «Confirmada a las 8:01». En la rejilla, el nombre va siempre en su propia línea y el texto de debajo, equilibrado
  //     («Confirmada / a las 8:01»): así el ✓ y «Por confirmar» quedan a la misma altura en todas las celdas.
  //     En el panel de quien cubre, «Propuesta: tú» o «Elección: tú» y, confirmada, «Cubres tú»; si jefatura ha elegido
  //     a otra persona para algo que te proponían, aviso: «Ya no la cubres · La cubre Rosa Medina», fuera de tu recuento.
  //     Con la rejilla en columnas, el estado («… Por confirmar», «✓ Cubre», «Ya no la cubres») va arriba de su zona, en una
  //     fila que comparten todas las celdas del carril: queda a la misma altura aunque debajo lleven distinto número de
  //     líneas (confirmando una a una, o con «Elección: Rosa Medina»).
  // Solo reciben el foco las sesiones con cambio (cubre y aviso). Una sesión sin cambios y sin nota no lleva globo (solo
  //   diría la hora, que ya está en la cabecera). Con el ratón, el globo sale tras una espera corta (300 ms; si ya hay uno
  //   abierto, el de al lado sale sin esperar): al cruzar una celda camino del atajo o de una cifra no tapa lo que se iba a
  //   pulsar. Con el foco, sin espera. Su globo, debajo de la celda (en la última columna, a su
  //   izquierda), da la hora, quién confirma y por qué; en el panel de jefatura, de tú («Falta que la confirmes»,
  //   «Has elegido a Rosa Medina», «La has confirmado a las 8:01»). Va en coordenadas de la página: al desplazarla se mueve
  //   con la celda, y con el teclado la página baja lo justo para que se vea. El globo que se ve va oculto para el lector de
  //   pantalla: cada celda (y cada cifra con globo) lleva su propia descripción, sin la primera línea, que ya está en su nombre.
  // Las pausas en las que no hay nada (la comida, el recreo de quien no vigila) son un separador fino.
  // Por debajo de 62rem, una sesión por fila; las «igual» con el mismo detalle se juntan al final («2.ª, 4.ª y 5.ª: con su especialista»).
  // Mientras falte confirmar algo que se decide en otro perfil, junto a «pendiente» va el atajo «Ver la propuesta (atajo de la demo)».

  // Lo que te necesita: por grupos seguidos (Hoy, Esta semana, Para saber). Empieza por lo que las cifras no dicen.
  lista: {
    titulo: 'Lo que te necesita',
    items: [
      { grupo: 'Hoy', icono: 'correo', titulo: 'Inspección: confírmale la visita del jueves 26', detalle: '...', estado: 'pendiente', ir: 'correo:c-inspeccion', sigue: 'correo:c-inspeccion' },
      { grupo: 'Hoy', icono: 'firma', titulo: 'Consejo escolar: la convocatoria del jueves 3', detalle: '...', estado: 'hoy', ir: 'firma', sigue: 'firma', verbo: 'Firmada' },
      { grupo: 'Hoy', icono: 'microfono', titulo: 'Recordatorio de la salida a las familias de 4.º A', detalle: '...', estado: 'hoy', ir: 'dictado', sigue: 'dictado', siDictado: { detalle: 'Ya lo has dictado. Te queda revisar el correo y enviarlo.' } },
      { grupo: 'Esta semana', icono: 'correo', titulo: 'AMPA: fecha del festival de Navidad', detalle: '...', estado: 'pendiente', choque: true, ir: 'correo:c-ampa', sigue: 'correo:c-ampa' },
      { grupo: 'Para saber', icono: 'documento', titulo: '...', detalle: '...', estado: 'info', sigue: 'secretaria/gastos', si: { detalle: '...', estado: 'info' } },
    ],
  },
  // 1-10 · grupo ≤ 20 · titulo ≤ 70 · detalle ≤ 130 · fecha ≤ 12 (opcional: una etiqueta a la derecha) · verbo ≤ 24
  // estado: hoy | pendiente | info | hecho. Cada grupo lleva el recuento de lo que queda por hacer («Hoy · 3»), que baja
  //   al hacer cosas: cuenta las filas en hoy y pendiente. Las filas para saber solo cuentan en un grupo que es todo para
  //   saber («Para saber · 1»). Con dos grupos muy desiguales (cuatro filas y dos), el que tiene más va más ancho.
  // Lo pendiente va arriba; lo hecho baja al final del grupo, con su verbo y su hora («Firmada a las 8:05»). Sin «verbo»:
  //   «Respondido» o «Enviado» si sigue un correo, «Enviado» si sigue un dictado y, si no, «Hecho»; «Archivado» si el correo
  //   se archivó.
  // si: lo que cambia cuando lo seguido está hecho (titulo, detalle, estado, que por defecto es «hecho», e ir). Hecha sin
  //   «si.detalle», la fila no repite su detalle, que suele decir lo que había que hacer («Revísala y fírmala»). ir: null
  //   quita el enlace cuando lo que se sigue ya está respondido y ahí no queda nada por hacer (en las marcas, igual).
  // siDictado: lo que cambia mientras el dictado que se sigue está dictado y por revisar. siOtra, siConfirmada y aMedias:
  //   ver arriba (en las filas cambian titulo, detalle, estado, ir, icono y, en siOtra y siConfirmada, también sigue y verbo).
  // choque: en el lector de pantalla, «Choque.» va como frase aparte (el título puede llevar sus propios dos puntos).
  // choque: true pinta una tarjeta de aviso en chispa suave, con el triángulo y la palabra «Choque».
  // Las filas que siguen o llevan a un correo llevan la insignia y «Resumido con IA». ia: false la quita; ia: true la pone
  //   (por ejemplo, en un plazo que la IA ha sacado de un correo).

  // Lo que viene (opcional): un calendario que empieza un lunes e incluye hoy, y la agenda por días.
  agenda: {
    titulo: 'Lo que viene', desde: '2026-11-16', semanas: 3,   // semanas: 1-5
    marcas: [
      // Solo lo cumple la respuesta que comunica el preaviso (#1); con otra, a medias, con el mismo texto que la cifra.
      { fecha: '2026-11-21', tipo: 'plazo', titulo: 'Fotocopiadoras: avisar antes de este día', detalle: '...', ir: 'correo:c-fotocopiadoras',
        sigue: 'correo:c-fotocopiadoras#1', verbo: 'Preaviso enviado',
        aMedias: { sigue: 'correo:c-fotocopiadoras', detalle: 'Has respondido sin el preaviso. Si no avisas, se renueva solo el 1 de diciembre.' } },
      { fecha: '2026-11-26', hora: '10:00', tipo: 'evento', titulo: 'Visita de inspección', detalle: '...', fuente: 'correo', ir: 'correo:c-inspeccion' },
      // Sin fuente: el choque lo detecta DirectorIA cruzando el horario con la salida (reglas y fechas), así que va sin insignia.
      // Lo resuelven las respuestas de jefatura al correo de Laura (#0,1); si lo archiva, no cambia.
      { fecha: '2026-11-27', tipo: 'aviso', choque: true, titulo: 'Tu guardia de 3.ª hora y la salida', detalle: '...', ir: 'plazos',
        sigue: 'jefatura/correo:c-laura#0,1', verbo: 'Confirmado', si: { detalle: '...' } },
      // Un «si» con estado 'pendiente' cambia el texto sin dar la marca por hecha (lo que contesta otro perfil, por ejemplo).
      { fecha: '2026-11-19', hora: '11:45', tipo: 'evento', titulo: '...', detalle: '...', sigue: 'jefatura/correo:c-laura', si: { detalle: '...', estado: 'pendiente' } },
      // Una lista en «sigue»: hecho cuando lo están todas (el visto bueno y la respuesta que adjunta el dosier). Aun así no pasa
      // a ✓ («si» con estado 'pendiente'): esa respuesta lo envía sin el acta del martes 17. Lo que va hacia ello, a medias
      // (vale la primera que está hecha).
      { fecha: '2026-11-23', tipo: 'plazo', titulo: 'Dosier para inspección', detalle: 'Envíalo antes de este día. Falta el acta de Matemáticas del martes 17.', fuente: 'correo', ir: 'dosier',
        sigue: ['dosier', 'correo:c-inspeccion#1'],
        si: { detalle: 'Enviado sin el acta del martes 17. Esa acta, antes de este día.', estado: 'pendiente' },
        aMedias: [
          { sigue: 'correo:c-inspeccion#1', detalle: 'Enviado sin el acta del martes 17 y sin tu visto bueno al dosier. Esa acta, antes de este día.', ir: 'dosier' },
          { sigue: 'correo:c-inspeccion', detalle: 'Has confirmado la visita sin el dosier. Envíaselo antes de este día.' },
          { sigue: 'dosier', detalle: 'Visto bueno dado. Falta enviarlo a Inspección desde el correo.', ir: 'correo:c-inspeccion' },
        ] },
    ],
  },
  // tipo: plazo (lo haces tú: banderín) · evento (una cita, una salida o una fecha del colegio, como el corte de la calle o el
  //   inicio de los exámenes: calendario) · aviso (un choque: triángulo, con choque: true). Lo hecho pasa a ✓. La leyenda
  //   enseña las formas que hay («Plazo», «Cita, salida o fecha», «Aviso», «Hecho» y «Hoy»); con cuatro o cinco, en dos filas
  //   parejas. Nada de puntos ● ni ○. Un correo archivado no cuenta como hecho.
  // fecha: después de hoy y dentro del calendario · hora: opcional (9:15) · titulo ≤ 60 · detalle ≤ 110 · verbo ≤ 24
  // Un plazo solo pasa a ✓ con lo que lo cumple: si una respuesta no lo cumple (en las prácticas del máster, la que solo
  //   dice que lo hablará con Matemáticas), sigue la respuesta que sí lo cumple ('correo:<id>#<n>') con «aMedias» para lo
  //   demás, o usa «si» con estado 'pendiente'.
  // Encima de cada día va cuándo es, contado desde hoy: «Mañana», «Pasado mañana», «Este sábado» o «Este domingo»,
  //   «La semana que viene» (del lunes 23 al domingo 29), «Dentro de dos semanas» (del lunes 30 al domingo 6) y
  //   «Dentro de tres semanas» (del lunes 7 en adelante: el sábado 12 de diciembre, en secretaría). Si el día tiene una
  //   sola marca con hora: «Mañana · 11:45»; si tiene más, la hora va delante de cada una. También en los globos del calendario.
  // Cada enlace de la agenda empieza, para el lector de pantalla, por el día y la hora («Jueves 26 de noviembre, la semana
  //   que viene, a las 10:00. Visita de inspección…»): con el tabulador se oye cuándo es.
  // Si la fuente da el plazo como «antes del…», escribe «antes de este día» («Fotocopiadoras: avisar antes de este día»).
  //   En el detalle, de tú, como el resto del panel: «Envíalo antes de este día», «Respóndeles antes de este día».
  // fuente: 'correo' o 'circular' cuando la IA ha sacado el plazo o la cita de ahí. Lleva la insignia y «Sacado del correo»
  //   o «Sacado de la circular». Lo que sale de reglas, como el preaviso de un contrato que lee el analista de gastos o una
  //   fecha del colegio, no la lleva.
  // Los días del calendario no reciben el foco del teclado (la agenda tiene los mismos enlaces); con el ratón, el globo da el detalle.
  //   Con la agenda en una columna larga, el calendario la acompaña al bajar.
}
```

Iconos de las cifras y de la lista: `correo`, `firma`, `carpeta`, `reloj`, `calendario`, `persona`, `familia`, `alerta`, `libro`, `acta`, `documento`, `microfono`, `clase`, `autobus`, `colegio`, `info`. Todos van en pizarra sobre un disco salvia, sin la chispa: la chispa es solo de la insignia de la IA.

**Si algo falla al pintar.** Si una pantalla no se puede pintar (por un dato que falta, por ejemplo), la demo no se queda en blanco: sale un aviso con «Reiniciar la demo» y «Elegir otro perfil», y el error queda en la consola, donde lo detecta `probar.mjs`.

### 6.3 Correo

```js
{
  id: 'c-inspeccion',                    // único dentro del perfil, empieza por c-
  de: 'Inspección educativa',            // quién lo envía
  deDetalle: 'DAT Madrid-Capital',       // opcional: cargo u organismo
  asunto: 'Documentación para la visita del jueves 26',
  hora: '7:12',                          // de hoy; para días anteriores, 'ayer' o 'lun 16'
  categoria: 'Inspección',               // Familias | Inspección | Consejería | Claustro | Equipo directivo | Proveedores | Otros
  etiqueta: { texto: 'Responder antes del lun 23', tipo: 'plazo' }, // tipo: hoy | plazo | info
  resumen: [                             // 1-3 frases de ≤ 140 caracteres: lo que ha resumido la IA
    'La inspección visitará el colegio el jueves 26 a las 10:00.',
    'Pide cuatro documentos antes del lunes 23.',
  ],
  piden: 'Confirmar la visita y enviar los documentos antes del lunes 23.', // ≤ 160 caracteres; '' si no piden nada
  original: 'Buenos días:\n\nLes comunico que...\n\nUn saludo,\nInspección educativa', // 60-180 palabras, realista
  adjuntos: ['Solicitud de documentación.pdf'],  // opcional
  respuestas: [                          // 0-3 respuestas propuestas; 0 solo si el correo es informativo
    {
      titulo: 'Confirmar y enviar el dosier',  // ≤ 40 caracteres: lo que hace esta respuesta
      texto: 'Buenos días:\n\nLe confirmo...\n\nUn saludo,\nElena Ruiz\nDirectora del Colegio Ejemplo', // 40-130 palabras, firmado por la persona del perfil
      adjuntos: ['Dosier para la visita de inspección.pdf'], // opcional, 1-4 de ≤ 70 caracteres: lo que va adjunto a esta respuesta
      // para: 'Todas las familias del colegio', asunto: '...', // opcionales: solo si la respuesta no va a quien escribió (ver abajo)
    },
  ],
  nota: 'DirectorIA ha reunido los documentos en «Dosier para inspección».', // opcional, ≤ 140 caracteres
  ir: 'dosier',                          // opcional: id de un módulo relacionado (botón «Ir a» y el nombre del menú)
}
```

- Ordena los correos como en una bandeja: el más importante o el más reciente primero.
- Al menos uno tiene que ser de una familia, salvo en `sustituto`. Las familias escriben de temas generales, sin nombres de alumnos («mi hijo», «una familia de 4.º A») y sin nada de salud (§5).
- Si un correo no pide respuesta, `respuestas: []` y una `nota`, por ejemplo: «Solo para leer. DirectorIA ha añadido la fecha a tus plazos».
- Si una respuesta no va a quien escribió, por ejemplo una circular para las familias, lleva `para` (≤ 60 caracteres) y `asunto` (≤ 90); con `para`, el validador pide también `asunto`. Si no, va a quien escribió, con «Re: » y su asunto.
- Si una respuesta lleva algo adjunto, como el dosier en la respuesta a Inspección, va en `adjuntos`. El editor y la ventana «¿Enviar esta respuesta?» enseñan el Para, el Asunto y los Adjuntos de la respuesta elegida.

### 6.4 Módulos

Todos los módulos comparten estos campos:

```js
{
  id: 'acta',                 // único; letras minúsculas y guiones
  tipo: 'documento',          // ver tipos abajo
  menu: 'Actas',              // ≤ 22 caracteres: texto del menú lateral
  antetitulo: 'Del dictado al acta', // ≤ 50 caracteres
  titulo: 'Acta del claustro del lunes 16', // ≤ 70 caracteres
  entradilla: '...',          // ≤ 220 caracteres: qué hace aquí la persona
  confidencial: 'Reservado · lo ves tú y secretaría, con registro de accesos', // opcional, ≤ 60: la banda con el candado (los justificantes)
}
```

Cada tipo añade sus propios campos.

#### `aprobaciones`: propuestas que una persona confirma una a una

```js
{ tipo: 'aprobaciones',
  contexto: { titulo: 'Sergio Prieto · tutor de 3.º B', texto: 'Avisó a las 7:45 de que no viene hoy.' }, // sin el motivo
  items: [
    {
      id: 'g1',
      cuando: '1.ª hora · 9:00-9:45',
      que: '3.º B · Lengua',
      propuesta: 'Pablo Sanz',
      motivo: 'Tiene guardia a esa hora. Lleva 2 guardias este mes; la media es 3.',
      alternativas: ['Rosa Medina', 'Teresa Gil'],
      ficha: true,                       // opcional: al confirmarla, quien sustituye recibe su ficha
    },
  ],
  boton: 'Confirmar',
  botonTodo: 'Confirmar todas',
  alConfirmar: 'Confirmado. Cada persona recibe su aviso y quien sustituye, su ficha.',
  bandera: 'guardias',                   // opcional: al confirmarlo todo, activa esta bandera (historia E1)
}
```

#### `documento`: un borrador que una persona revisa y aprueba o firma

```js
{ tipo: 'documento',
  origen: 'Preparado con IA a partir de tu dictado de 12 minutos', // ≤ 120 caracteres
  documento: {
    titulo: 'Acta del claustro ordinario',
    subtitulo: 'Lunes 16 de noviembre de 2026 · 17:00 · Sala de profesores',
    bloques: [                           // en orden
      { tipo: 'campo', etiqueta: 'Asistentes', texto: '47 de 52 docentes. Preside la directora.' },
      { tipo: 'titulo', texto: 'Acuerdos' },
      { tipo: 'parrafo', texto: '...' },
      { tipo: 'lista', items: ['...', '...'] },
      { tipo: 'aviso', texto: '...' },        // recuadro de aviso (por ejemplo, algo que falta)
    ],
  },
  rellenado: ['Asistentes, del registro del claustro', 'Acuerdos, de tu dictado'], // 2-4: lo que ha rellenado la IA
  comprobaciones: ['Los acuerdos recogen lo que se votó', 'No hay datos de alumnos'], // 2-4: lo que comprueba la persona antes de firmar
  boton: 'Aprobar el acta',              // ≤ 30 caracteres
  alTerminar: 'Acta aprobada. Se ha guardado en el archivo de actas, con buscador.', // ≤ 160 caracteres
  documentos: [                          // opcional: en un dosier, la lista de piezas con su estado
    { nombre: 'Plan de convivencia 2026-27', estado: 'ok', detalle: 'Aprobado el 30 de septiembre' }, // estado: ok | falta | revisar
  ],
}
```

#### `plazos`: lista de plazos y entregas

```js
{ tipo: 'plazos',
  items: [
    {
      fecha: 'vie 20 nov',
      titulo: 'Autorizaciones de la salida al Jardín Botánico',
      detalle: 'Recoger las de 4.º A firmadas y dejarlas en secretaría.',
      quien: 'Tú',
      origen: 'Circular de la salida',   // opcional: de dónde lo ha sacado la IA
      estado: 'pronto',                  // hoy | pronto | hecho | despues
    },
  ],
}
```

#### `protocolo`: la guía de un protocolo, paso a paso (`orientacion` y `direccion`)

Explica cómo se aplica cada protocolo (acoso escolar, absentismo, accidentes). Es una guía: no se abre ningún caso en DirectorIA, no hay estados («hecho», «en curso») y no tiene progreso en el Inicio. Sin banda confidencial: no lleva datos de nadie.

Las guías se escriben una vez. Otro perfil las toma con una referencia en lugar de la lista: `guias: 'orientacion/protocolos'` (así las tiene dirección, con su propia entradilla). El motor enseña las de ese módulo y cada perfil guarda su pestaña; el validador comprueba que el módulo existe, que es de tipo `protocolo` y que tiene sus guías escritas, no otra referencia.

```js
{ tipo: 'protocolo',
  aviso: 'No se abre ningún caso en DirectorIA. Los datos de cada caso van donde manda el protocolo: Raíces y el expediente del centro.', // ≤ 180
  guias: [                               // 1-4: una pestaña por protocolo (o 'orientacion/protocolos': las de otro perfil)
    {
      id: 'acoso',
      nombre: 'Acoso escolar',           // ≤ 30: el nombre de la pestaña
      fuente: 'Según el protocolo vigente de la Comunidad de Madrid para la actuación contra el acoso escolar.', // ≤ 140
      si: 'Si se confirma el acoso',     // ≤ 40: el título que va antes de los pasos condicionales (obligatorio si los hay)
      pasos: [                           // 3-12, en orden
        { nombre: 'Comunicación a la dirección',          // ≤ 60
          que: 'Quien conozca o sospeche una situación de acoso lo comunica por escrito a la dirección del centro.', // ≤ 220: qué se hace
          quien: 'Cualquier persona del centro: profesorado, personal, familias o alumnado', // ≤ 90
          plazo: 'En cuanto se conozcan los hechos',      // ≤ 60: «Según el protocolo vigente» si no hay uno fijo
          anexo: 'Anexo I.a o I.b',                       // opcional, ≤ 40: la plantilla oficial en blanco
          donde: 'Raíces',                                // opcional, ≤ 50: dónde queda (Raíces, el expediente del centro)
          cuidar: 'Confidencialidad desde el primer momento… No se prejuzga a nadie.', // opcional, ≤ 160
          condicional: true,                              // opcional: solo va si se confirma (borde discontinuo)
        },
      ],
      plantillas: [ { nombre: 'Anexo I.a', detalle: 'Notificación a la dirección' } ], // opcional, 1-8: «Descargar» (en la demo, un aviso)
    },
  ],
  pie: 'Es la lectura del protocolo vigente que ha hecho el equipo de DirectorIA, no la de un abogado: manda siempre el texto oficial. …', // ≤ 220
}
```

El validador avisa si el aviso no dice que no se abre ningún caso, si el pie no presenta lo legal como lectura del equipo («no la de un abogado») o si una plantilla no la usa ningún paso. Falla si la guía lleva `caso`, `actual` o `documentos` (el formato de antes) o si un paso lleva `estado`.

#### `banco`: banco de recursos (solo `docente`)

```js
{ tipo: 'banco',
  consulta: 'flashcards de alimentos para EF 2.º ciclo',
  entendido: ['Flashcards', 'Alimentación saludable', 'Educación Física', '3.º y 4.º de Primaria'],
  aviso: 'Todavía no hay de Educación Física en 2.º ciclo. Te enseñamos lo más parecido:',
  resultados: [
    { titulo: 'Flashcards: los grupos de alimentos',
      meta: 'Educación Física · 6.º de Primaria · De Marta Ramos · Hecho con IA y revisado', // los docentes, con su nombre entero
      cercania: 'Misma materia, ciclo siguiente',
      adaptar: {                         // opcional: solo en el primero
        boton: 'Adaptar a 3.º–4.º',
        titulo: 'Flashcards: los grupos de alimentos · versión para 3.º y 4.º',
        texto: ['Tarjeta 1 · Frutas: ...', '...'],  // 4-8 líneas de la versión adaptada
        nota: 'Versión preparada con IA a partir del recurso de Marta Ramos. Revísala antes de usarla; queda enlazada al original.',
      },
    },
  ],
  subir: {
    titulo: 'Flashcards: frutas y verduras de temporada',
    curso: ['3.º de Primaria', '4.º de Primaria'],
    materia: ['Educación Física'],
    contenidos: ['Alimentación saludable', 'Hábitos de vida activa'],   // los sugiere la IA
    casillas: ['Sin fotos ni datos de alumnos', 'Es mío o puedo compartirlo'], // 2-3: obligatorias para compartir
    comprobado: [                        // opcional, 1-4: lo que se comprueba al leer el archivo, sin la insignia
      { texto: 'Sin DNI, ni ©, ni ISBN', como: 'reglas' },        // «con reglas, sin IA»
      { texto: 'Sin nombres ni datos de salud', como: 'ia' },     // «con IA»: el filtro que impide que entren datos de alumnos
    ],
    declaracion: 'Lo he hecho con IA y lo he revisado', // opcional: casilla voluntaria; si se marca, el recurso lleva «Hecho con IA y revisado»
  },
  impacto: {                             // lo que ve en privado
    texto: 'Tus 12 recursos se han usado 87 veces y 9 compañeros han dicho «Me ha servido».',
    insignias: ['Primer recurso', 'Un compañero lo adaptó', 'Primera situación de aprendizaje'],
    meta: '6 de 8 peticiones «Se busca» del 2.º ciclo ya tienen respuesta',
  },
}
```

#### `dictado`: correo dictado (solo `docente`): un correo general a las familias de un grupo, sin datos de ningún alumno

```js
{ tipo: 'dictado',
  para: 'Familias de 4.º A',
  transcripcion: 'Lo que dice la docente al dictar, tal cual, con muletillas (60-110 palabras).',
  asunto: '...',
  borrador: 'El correo redactado en el tono adecuado (90-160 palabras), firmado por la docente.',
  notas: ['Tono cordial y de usted, como en las circulares del colegio', 'Fecha, horas y plazo, comprobados con la circular'], // 2-3
}
```

#### `material`: material didáctico con Claude, módulo opcional (solo `docente`)

```js
{ tipo: 'material',
  aviso: 'Módulo opcional en la nube. Solo para material didáctico: no tiene acceso a los datos del colegio, y un filtro está pensado para bloquear datos personales.',
  peticion: 'Situación de aprendizaje sobre alimentación saludable para 4.º de Primaria, de tres sesiones.',
  bloqueo: { intento: '... y que el cartel final lo presenten Lucas y Sara.', mensaje: 'Lleva nombres, «Lucas» y «Sara», y en el módulo de Claude no se escriben datos de alumnos. No se ha enviado nada. …' },
  respuesta: { titulo: '...', bloques: [ { tipo: 'titulo', texto: '...' }, { tipo: 'parrafo', texto: '...' }, { tipo: 'lista', items: ['...'] } ] },
}
```

#### `traduccion`: una circular general en lectura fácil o en otro idioma (solo `orientacion`)

```js
{ tipo: 'traduccion',
  para: 'Las familias de 4.º de Primaria',          // con su artículo: el motor dice «¿Enviarlo a las familias…?»
  original: { titulo: 'Salida al Jardín Botánico', texto: '...' },
  versiones: [ { idioma: 'Lectura fácil', texto: '...' }, { idioma: 'Inglés', texto: '...' } ], // el inglés, correcto y natural
  comprobaciones: ['La fecha, la hora y el precio coinciden con el original', 'No hay nombres ni datos de alumnos'],
  boton: 'Enviar a las familias',
  alTerminar: 'Enviado a las familias de 4.º desde la cuenta del colegio, con el original en español y las dos versiones.',
}
```

#### `ficha`: fichas de sustitución (`sustituto` y, como vista previa, `jefatura`)

Solo la clase. El motor añade a cada ficha la línea fija, con el triángulo y «Antes de empezar»: «Las indicaciones de salud y de recogida de los alumnos no están en DirectorIA: las tiene el colegio. Pregúntalas en conserjería o a la tutora antes de empezar.» (`LINEA_FICHA` en `src/app.js`).

```js
{ tipo: 'ficha',
  bandera: 'guardias',                   // opcional: si las guardias aún no están confirmadas, avisa y deja ir a jefatura
  fichas: [
    {
      sesion: '3.º B · Matemáticas · 6.ª hora', // grupo, materia y hora
      hora: '15:15-16:00',
      aula: 'Aula de 3.º B, planta baja',       // ≤ 50
      para: 'Pablo Sanz',                       // opcional, ≤ 40: «Para Pablo Sanz»
      origen: 'Preparada por DirectorIA · confirmada por jefatura', // exactamente así, sin insignia
      datos: [                                  // 3-5, solo estos apartados
        { dt: 'Tarea', dd: '…' },               // de la programación quincenal de quien falta
        { dt: 'Material', dd: '…' },            // qué hay y dónde está
        { dt: 'A quién llamar', dd: 'Tutoría: … (ext. 213) · Jefatura de estudios (ext. 202) · Conserjería (ext. 200)' }, // una por línea
        { dt: 'Al acabar', dd: '…' },           // opcional: la salida, quién entra después
      ],
      pie: 'Se abre antes de la sesión y se cierra al acabar la jornada. Queda registrado quién la ve.',
    },
  ],
  registro: ['Vista previa abierta por Javier Martín (jefatura) hoy a las 7:56'], // opcional: accesos anteriores. Con bandera, el motor añade antes «Abierta por <persona> hoy a las <hora>», con la hora de la demo
}
```

Nada de «Necesidades», «Salud» ni «Recogida», ni nombres de alumnos, ni `aviso` en los datos: el validador falla. «A quién llamar» nombra la tutoría, jefatura y conserjería, con su extensión.

#### `tabla`: tabla con avisos y una acción opcional

Sirve para el calendario de exámenes o el estado de las programaciones.

```js
{ tipo: 'tabla',
  columnas: ['Grupo', 'Lun 30', 'Mar 1', 'Mié 2'],
  filas: [
    ['4.º ESO A', 'Matemáticas', '—', 'Inglés'], // textos cortos
  ],
  marcas: [ { fila: 0, columna: 3, tipo: 'aviso' } ],  // opcional: celdas resaltadas (tipo: aviso | ok)
  avisos: [ { texto: '4.º ESO A tiene dos exámenes el miércoles 2. Propuesta: pasar Inglés al jueves 3.', estado: 'aviso' } ], // estado: aviso | ok | info
  boton: 'Aprobar el calendario',        // opcional
  alTerminar: 'Calendario aprobado y publicado para el claustro y las familias.', // obligatorio si hay botón
}
```

#### `informe`: el analista de gastos (`secretaria`) o un resumen con cifras

```js
{ tipo: 'informe',
  cifras: [ { valor: '1.800 €', texto: 'ahorro estimado al año en la luz' } ], // 2-4
  avisos: [ { titulo: 'Fotocopiadoras: se renueva solo el 1 dic', detalle: '...', estado: 'hoy' } ], // estado: hoy | pronto | info | hecho
  filas: [ { partida: 'Suministros', proveedor: 'Luz', importe: '2.310 €', nota: '...' } ], // opcional, 4-8: gasto de octubre por partidas
  pie: 'No sustituye a la gestoría ni lleva la contabilidad oficial. Las nóminas y los datos de personas solo se ven agregados.',
}
```

#### `justificantes`: los justificantes del profesorado (`docente`, `secretaria` y `jefatura`)

E8. Sin la insignia de la IA en ninguna vista: los archiva un programa, con reglas. El motor pone arriba, siempre, «Los justificantes los archiva un programa en su carpeta; la IA no los lee.», y compone el nombre de cada archivo: Justificantes/<curso>/<AAAA-MM>/<docente>/<AAAA-MM-DD> justificante.pdf. En «carpetas», un pendiente no tiene archivo: su hueco dice «Sin archivo todavía». En «subir», el desplegable de la ausencia lleva la fecha corta de las etiquetas («Lun 16 nov · 9:00-10:30»), que cabe en el móvil.

```js
{ tipo: 'justificantes',
  vista: 'subir',                        // subir (el docente) | carpetas (secretaría) | informe (jefatura, sin los archivos)
  curso: '2026-27',
  confidencial: 'Reservado · lo ves tú y secretaría, con registro de accesos', // obligatorio en subir y carpetas, ≤ 60
  nota: 'Aquí no se ven: los ve secretaría.', // opcional, ≤ 80: va detrás de la frase fija
  archivo: 'escaneo_0001.pdf',           // solo en subir: el archivo de ejemplo que se elige en la demo
  ausencias: [                           // 1-12. Nunca el motivo
    // En «subir», las de la persona del perfil; la pendiente lleva id (es la que se elige al subir).
    { id: 'j1', fecha: '2026-11-16', horas: '9:00-10:30', justificante: 'pendiente' },
    // En «carpetas» e «informe», con docente. Si se sube en otro perfil, «sigue» y empieza pendiente.
    { docente: 'Laura Sánchez', fecha: '2026-11-16', horas: '9:00-10:30', justificante: 'pendiente', sigue: 'docente/justificantes#j1' },
  ],
  reglas: ['Un programa, con reglas y sin IA, lo renombra…', '…'], // 2-6, ≤ 150: «Cómo se guardan» o «Qué guarda el registro»
  registro: ['Carmen López abrió el de Teresa Gil del jueves 12 de noviembre, el viernes 13 a las 18:05', 'Teresa Gil subió el de su ausencia del jueves 12 de noviembre, el viernes 13 a las 17:40'], // opcional, solo en carpetas: quién sube y quién abre, lo más reciente arriba (el motor añade antes lo que se sube en la demo)
}
```

- `progreso: 'justificantes'` en una cifra cuenta los entregados de todos («5 de 7 entregados»), con los entregados primero en el medidor.
- `'justificantes#j1'` (o `'docente/justificantes#j1'`) sigue a una ausencia: hecho cuando su justificante está entregado.
- El validador comprueba que el `sigue` de una ausencia lleva a la vista `subir` de otro perfil, a la misma persona y el mismo día.

## 7. Qué tiene cada perfil

### `direccion` · Elena Ruiz · orden 1

**Inicio: «Tu resumen de las 8:00»**, como panel de mando (6.2 bis), con la ilustración de la directora (la propia de la demo, con el ✓ de «al día» en la tableta y sin la insignia de la IA):

- **Cifras:**
  - Pendiente de tu firma: 2, la convocatoria del consejo escolar del jueves 3 (hoy, E9) y el acta del claustro. La nota dice «La convocatoria y el acta del claustro». Con las dos hechas, «Todo firmado» y «Ver lo firmado», que lleva a la convocatoria (`ir: 'firma'`).
  - Correos por responder: 5, resumidos con IA. Sin ninguno por responder, «Al día».
  - Fotocopiadoras: «3 días», «para avisar, antes del sáb 21». La cuenta atrás va de miércoles a viernes: el preaviso del contrato es antes del sábado 21 (E6). Solo lo cumple la 2.ª respuesta propuesta, «Comunicar el preaviso» (`sigue: 'correo:c-fotocopiadoras#1'`): entonces, «Preaviso enviado» y la hora. Con otra respuesta (la que sale elegida, «Pedir la oferta por escrito», o «Proponer una reunión el jueves»), la cuenta atrás sigue y la nota dice «Has respondido sin el preaviso. Si no avisas, se renueva solo el 1 de diciembre.». Si se archiva el correo, también sigue: «Archivado sin avisar. Si no avisas, el contrato se renueva solo el 1 de diciembre.» (`aMedias`).
  - Dosier para inspección: «6 de 8 listas». Hay seis piezas listas, el escrito de remisión por revisar y el acta de Matemáticas del martes 17, que falta. El medidor va en ese orden; el globo da las ocho piezas en el orden del dosier. Con el visto bueno, «Visto bueno dado».
- **Quién cubre 3.º B hoy:** cada sesión de 3.º B, con la persona que la cubre. Sigue a `jefatura/guardias`, también a la persona que elija jefatura en el desplegable («Elección: Rosa Medina» y, al confirmar, «Cubre Rosa Medina · Confirmada a las 8:01»). «Confirmar todas» deja todas a la misma hora. Mientras falten guardias, «Las guardias las confirma jefatura.» y el atajo a la propuesta. Si jefatura las confirma una a una, la línea dice cuántas lleva: «Jefatura ha confirmado 2 de 4. Hasta que confirme las demás, no se avisa a quien las cubre.», con el atajo (`parcial`). La salida de las 16:00 la hace quien cubre la 6.ª.
- **Lo que te necesita:**
  - Hoy: confirmar la visita a Inspección y la convocatoria del consejo escolar («Si la firmas hoy, llega con dos semanas de margen.»).
  - Esta semana: el acta y el choque del festival del AMPA con las sesiones de evaluación.
  - Para saber: el seguro escolar, con dos presupuestos para decidir (la póliza vence el 31 de diciembre). Sigue a `secretaria/gastos`: cuando secretaría envía el informe de octubre, sigue siendo para saber: «Carmen López te ha enviado el informe de gastos de octubre, con los dos presupuestos.». Y las guías de los protocolos, «Casi todos los pasos del de acoso son de la dirección. Con los anexos en blanco; ningún caso se abre en DirectorIA.», sin insignia y con enlace a «Guías de protocolos».
- **Lo que viene.** Cada plazo pasa a ✓ solo con lo que lo cumple; lo que va hacia ello lo dice sin el ✓ (`aMedias`):
  - sáb 21: fotocopiadoras, avisar antes de este día (sale del analista de gastos, sin insignia). Sigue a la respuesta del preaviso (`#1`): «Preaviso enviado a las…». Con otra respuesta, lo mismo que dice la cifra: «Has respondido sin el preaviso. Si no avisas, se renueva solo el 1 de diciembre.»;
  - lun 23: el dosier, sacado del correo de Inspección: «Envíalo antes de este día. Falta el acta de Matemáticas del martes 17.». Sigue a dos cosas a la vez (`['dosier', 'correo:c-inspeccion#1']`): el visto bueno y la respuesta que lo adjunta, «Confirmar y enviar ya el dosier». Ni así pasa a ✓, porque esa respuesta lo envía «salvo la de la reunión del martes 17, que le enviaré antes del lunes 23»: «Enviado sin el acta del martes 17. Esa acta, antes de este día.» (un `si` con estado `pendiente`). A medias:
    - enviado sin el visto bueno: «Enviado sin el acta del martes 17 y sin tu visto bueno al dosier. Esa acta, antes de este día.», con el enlace al dosier;
    - con otra respuesta (confirmar la visita o preguntar por los horarios), que no lo adjunta: «Has confirmado la visita sin el dosier. Envíaselo antes de este día.»;
    - con el visto bueno y el correo sin responder: «Visto bueno dado. Falta enviarlo a Inspección desde el correo.», con el enlace al correo;
  - jue 26: la visita de inspección a las 10:00;
  - vie 27: las prácticas del máster («Prácticas del máster: responde antes de este día», sacado del correo) y la salida de 4.º a las 9:15. Lo cumplen las dos respuestas que dicen cuántos estudiantes acoge el colegio (`correo:c-practicas#0,1`); la que lo habla antes con Matemáticas no: «Le has dicho que lo hablas con Matemáticas. La respuesta, antes de este día.» (`aMedias`);
  - lun 30: el corte de la calle y los exámenes de ESO, con el calendario de «Cita, salida o fecha». El corte sigue a la circular a las familias (`correo:c-ayuntamiento#0`): «Enviado a las…». Si se responde al Ayuntamiento para pedir paso seguro, la circular, que era la otra respuesta del mismo correo, ya no se puede enviar desde ahí: «De 7:00 a 19:00. Has escrito al Ayuntamiento; falta avisar a las familias.»; archivado, sigue igual;
  - jue 3 dic, 17:00: el consejo escolar, que lleva a la convocatoria («Pendiente de firma»).

**Correo (5):**

1. Inspección, la visita del jueves 26 → «Dosier para inspección».
2. La universidad: dos estudiantes del Máster de Formación del Profesorado, de Matemáticas, en prácticas del 11 de enero al 26 de marzo. Hay que responder antes del viernes 27.
3. El AMPA propone fecha para el festival de Navidad.
4. La empresa de fotocopiadoras ofrece renovar. Nota con el aviso del analista: se renueva solo el 1 dic.
5. El Ayuntamiento avisa de un corte de la calle por obras el lunes 30. Informativo, con una respuesta propuesta para avisar a las familias.

**Módulos:**

- `dosier` (documento con `documentos`): documentos para inspección, sin datos de alumnos; falta el acta de Matemáticas del martes 17.
- `acta` (documento): acta del claustro del lunes 16 (E5), con el aviso del recuento del tercer acuerdo.
- `firma` (documento, `ia: false`): «Convocatoria del consejo escolar del jueves 3» (E9). La prepara DirectorIA con la plantilla del centro y la firma la directora. Las comprobaciones:
  - el orden del día recoge todo lo que quiere tratar;
  - la fecha y la sala están libres en el calendario;
  - va a todos los miembros, también a los representantes de las familias;
  - no lleva datos de alumnos.
- `protocolos` (protocolo): «Guías de protocolos», E3. Son las de orientación, escritas una vez (`guias: 'orientacion/protocolos'`): acoso escolar, absentismo y accidentes, con sus anexos en blanco. Su entradilla añade: «En el de acoso, casi todos los pasos son de la dirección: abrirlo, decidir las medidas y comunicarlo.». Sin banda confidencial y sin insignia.

### `jefatura` · Javier Martín · orden 2

**Inicio:** panel de mando (6.2 bis), con la ilustración del jefe de estudios. La entradilla vale antes y después de confirmar: «Sergio Prieto no viene. Tú confirmas quién cubre sus sesiones; hasta entonces, no se avisa a nadie.»

- **Cifras:**
  - Guardias confirmadas: «0 de 4», hoy y en pizarra. Son las cuatro propuestas de «Guardias de hoy»: tres sesiones con 3.º B y el turno de patio de Sergio. Al confirmarlas, «Todas».
  - Correos por responder: 4, resumidos con IA. Sin ninguno por responder, «Al día».
  - Exámenes de ESO: «1 choque», el de 4.º ESO A el miércoles 2. Pasa a «Sin choques» al aprobar el calendario.
  - Programaciones de ESO: «2 incompletas», Educación Física y Música. Pasa a «Ya lo has pedido» al pedir lo que falta.
- **Quién cubre 3.º B hoy:** el mismo carril que dirección, pero siguiendo su propio módulo (`guardias#g1`…`g4`). Mientras falten guardias, una línea recuerda que en «Guardias de hoy» se puede elegir a otra persona para cada sesión antes de confirmar. Si jefatura elige a otra persona en el desplegable, la celda la enseña ya antes de confirmar («Elección: Rosa Medina») y, después, «Cubre Rosa Medina · Confirmada a las 8:01». «Confirmar todas» deja todas a la misma hora. Como lo confirma él, los globos le hablan de tú: «Falta que la confirmes», «Has elegido a Rosa Medina. Falta que lo confirmes» y «La has confirmado a las 8:01». Si confirma una a una, la línea dice «Has confirmado 2 de 4. Hasta que confirmes las demás, no se avisa a quien las cubre.» (`parcial`).
- **Lo que te necesita:**
  - Hoy: las fichas de 1.ª, 3.ª y 6.ª hora de 3.º B, que pasan a «Enviadas» al confirmar las guardias, y la petición de Laura Sánchez: «Laura Sánchez pide que cubran su guardia de mañana», con «A 4.ª hora tiene una tutoría con una familia de 4.º A. Quién la cubre lo decides tú.». Resume su correo, así que lleva «Resumido con IA». No va como choque: el choque de su guardia del viernes 27 va en la agenda.
  - Esta semana: una familia de 4.º ESO pregunta cuándo salen las fechas de los exámenes (salen cuando apruebe el calendario).
  - Para saber: la nota de la Consejería (las calificaciones, en Raíces antes del viernes 18 de diciembre) y las ausencias del profesorado de noviembre: «cuatro», con «Dos con el justificante entregado. Faltan el de hoy de Sergio Prieto y el del lunes 16 de Laura Sánchez.». Sigue a `docente/justificantes#j1`: cuando Laura sube el suyo, «Tres con el justificante entregado. Falta el de hoy de Sergio Prieto.». Sin motivos.
- **Lo que viene:**
  - jue 19, 11:45: «La guardia de 4.ª de Laura Sánchez» (un plazo), con la propuesta de DirectorIA: Rosa Medina, la única con la 4.ª libre. Sigue a las respuestas a Laura (`correo:c-laura#0,1`): «Decidido a las…», con «La cubre Rosa Medina. Ya se lo has dicho a Laura.»;
  - vie 20: la entrega de las programaciones quincenales de Primaria, de las que sale la tarea de las fichas (una fecha del colegio, sin enlace);
  - vie 20: contestar a Matemáticas con la fecha del examen de 4.º ESO («Respóndele a Ramón Esteban antes de este día: quieren decírselo a los alumnos esta semana.»), sacado del correo. Lo cumplen las dos respuestas que dan fecha (`correo:c-matematicas#0,1`); la que pregunta antes si el examen es de una sesión no la da: «Le has preguntado a Matemáticas. La fecha, antes de este día.»;
  - vie 27: la salida de 4.º al Jardín Botánico a las 9:15, con Laura Sánchez, y el choque de su guardia de 3.ª con la salida: «La guardia de 3.ª de Laura Sánchez y la salida», con «Tiene guardia a 3.ª hora y estará en la salida con 4.º A: hay que cubrirla.». Lo detecta DirectorIA cruzando el horario de Laura con la salida (reglas y fechas), así que va sin insignia (en docente, el mismo choque). Sigue a las respuestas a Laura (`correo:c-laura#0,1`), que le dicen que esa guardia también la cubre otra persona: entonces dice «Ya le has dicho a Laura que la cubre otra persona. Quién la cubre lo decides ese día, en «Guardias de hoy».», no pasa a ✓ (un `si` con estado `pendiente`) y pierde el enlace (`ir: null`), porque en su correo, ya respondido, no se decide nada. Si se archiva su correo, no cambia;
  - lun 30: empiezan los exámenes de ESO;
  - mié 2 dic: el choque de 4.º ESO A, con Matemáticas e Inglés el mismo día. Al aprobar el calendario pasa a ✓: «Inglés de 4.º ESO A, al jueves 3».

**Correo (5):**

1. Sergio Prieto, a las 7:45: «No voy a poder ir hoy», sin el motivo. Respuestas: «Decirle que su clase está cubierta», «Pedir que avise esta tarde» y «Recordarle cómo subir el justificante» (desde DirectorIA, no por correo). Ninguna habla de su salud.
2. Una familia de 4.º ESO B (Marcos) pregunta cuándo salen las fechas de los exámenes de la 1.ª evaluación → exámenes.
3. El Departamento de Matemáticas propone fecha para el examen de 4.º ESO; enlaza con exámenes.
4. Laura Sánchez: «Mi guardia del jueves coincide con una tutoría». El jueves 19 tiene guardia a 4.ª hora y una familia de su tutoría solo puede venir a esa hora; pide que cubra su guardia otra persona y no propone a nadie: lo decide jefatura. La nota es de DirectorIA, sin insignia: «DirectorIA propone a Rosa Medina, la única con la 4.ª libre. Ojo: el viernes 27 Laura está en la salida y hay que cubrir su guardia de 3.ª.» (a 4.ª no hay nadie más de guardia, así que va quien tiene hora libre; como solo la tiene Rosa, no hace falta mirar cuántas guardias lleva, aunque hoy DirectorIA también la propone para la 3.ª de 3.º B). Las dos respuestas propuestas le dicen que el jueves la cubre Rosa Medina y que la del viernes 27 también la cubre otra persona, sin pedirle nada: «Decirle que la cubre Rosa» y «Explicarle por qué la cubre Rosa», que cuenta la regla («Rosa Medina es la única que tiene esa hora libre») y promete decirle quién cubre el viernes cuando cierre las guardias de ese día.
5. La Consejería avisa de las instrucciones sobre las sesiones de evaluación. Informativo.

**Módulos:**

- `guardias` (aprobaciones, `bandera: 'guardias'`): E1. Los items de 3.º B que llevan ficha, con `ficha: true`.
- `fichas` (ficha, vista previa de lo que reciben quienes sustituyen): la de 6.ª y la de 1.ª, de Pablo Sanz, y la de 3.ª, de Rosa Medina. Solo la clase (E2), con la línea fija. Como las de Pablo, siguen la propuesta inicial: si jefatura elige a otra persona (Rosa Medina en el recreo, por ejemplo), la de 3.ª sigue diciendo «Hoy vigila Teresa Gil». En la demo no se abren después de cambiar la propuesta (lo dicen «Guardias de hoy» y el README).
- `examenes` (tabla): calendario de la 1.ª evaluación de ESO, del lun 30 nov al vie 4 dic. Un choque en 4.º ESO A el miércoles 2, con la propuesta de moverlo. Botón para aprobar.
- `programaciones` (tabla): estado de las programaciones por departamento frente al modelo del centro. Dos con apartados que faltan; por ejemplo, «evaluación de la práctica docente».
- `ausencias` (justificantes, vista `informe`): «Ausencias del profesorado en noviembre» (E8): quién ha faltado, qué día y a qué horas, y «Entregado» o «Pendiente». Sin motivos y sin los archivos, que ve secretaría.

### `secretaria` · Carmen López · orden 3

**Inicio:** panel de mando (6.2 bis), con la ilustración de la secretaria: la propia de la demo, una mujer de unos 60 con el sello del centro (6.2 bis). Va sin el día por sesiones: su trabajo no sigue el horario de Primaria. Secretaría no guarda datos de alumnos: lleva gastos y contratos, plazos, el edificio y los justificantes del profesorado. La entradilla: «Gastos, justificantes, plazos y revisiones del edificio. Nada se envía ni se firma sin ti.»

- **Cifras:**
  - Informe de gastos: «5 avisos para dirección», hoy y en pizarra: los del informe de octubre (E6). La nota da el más urgente: las fotocopiadoras, que dirección decide antes del sábado 21. Pasa a «Enviado» al enviar el informe (y en dirección, la fila del seguro escolar lo dice).
  - Correos por responder: 5, resumidos con IA. Sin ninguno por responder, «Al día».
  - Justificantes del profesorado: «5 de 7 entregados» (`progreso: 'justificantes'`), con la nota «Los justificantes los archiva un programa en su carpeta; la IA no los lee.». Cuando Laura Sánchez sube el suyo en su perfil, «6 de 7». El de hoy de Sergio Prieto sigue pendiente, así que la cifra no se da por hecha.
  - Estadística 2026-27: «vie 27», «para subirla», con la nota «Los recuentos por curso y grupo están listos: cifras, sin nombres.». Pasa a «Datos subidos» al marcarla en «Circulares y plazos».
- **Lo que te necesita:**
  - Hoy: Sergio Prieto pregunta cómo entregar su justificante (correo, resumido con IA). Las respuestas le explican cómo subirlo desde DirectorIA.
  - Esta semana: una familia de 4.º B pregunta cómo pagar la salida; los extintores, como choque, y el acuse de recibo de la estadística («Estadística: acusa recibo a la Consejería»). También la comisión de mantenimiento del banco. Las cuatro salen de correos y llevan «Resumido con IA».
  - El choque de los extintores: la empresa propone el jueves 26, de 9:00 a 12:00, cuando llega la inspección (E4), o el martes 24 por la tarde, que Carmen tiene libre. Al responder, la fila pasa a «Extintores: el día de la revisión».
  - Para saber: la inspección del ascensor (vie 15 ene) y la caldera, «Hecha el lun 2 nov».
- **Lo que viene,** en cuatro semanas, hasta los electrodos. Cada plazo sigue a su línea de «Circulares y plazos»:
  - vie 20: las autorizaciones de la salida, que las tutorías de 4.º traen antes de las 14:00 y dicen cuántas faltan (sacado de la circular). Al marcarlo: «Recibidas a las…»;
  - jue 26: la visita de inspección a las 10:00. Es una fecha del colegio: secretaría no tiene ese correo, así que va sin insignia;
  - vie 27: la estadística, que se sube antes de ese día (sacado de la circular);
  - lun 30: vence la revisión de los extintores, que sale del calendario de mantenimiento y va sin insignia. Cuando Carmen responde a la empresa, el detalle lo dice y el plazo sigue pendiente (si archiva el correo, no cambia). Ese día, además, cortan la calle de 7:00 a 19:00 y hay que avisar a los proveedores. En «Circulares y plazos» sale «De: Aviso del Ayuntamiento», sin IA, así que aquí también va sin insignia;
  - sáb 12 dic: caducan los electrodos del desfibrilador (calendario de mantenimiento). Al marcarlo: «Recambio pedido a las…».

**Correo (5):**

1. Sergio Prieto: «¿Cómo te hago llegar el justificante de hoy?». No lo adjunta. Las tres respuestas le dicen que lo suba desde DirectorIA, en «Tus justificantes», y no por correo → justificantes.
2. Una familia de 4.º B (Inés) pregunta si puede pagar la salida por transferencia o en secretaría, porque cambia de banco. Nota: las cuentas de las familias están en el programa de gestión del colegio, no en DirectorIA.
3. La Consejería, con la circular de la estadística (E7) → plazos.
4. La empresa mantenedora, para fijar la revisión de extintores antes del 30 nov.
5. El banco, con la nueva tarifa de comisiones. Nota del analista.

**Módulos:**

- `gastos` (informe): analista de gastos, informe de octubre (E6).
- `justificantes` (justificantes, vista `carpetas`): las carpetas de los justificantes del profesorado (E8), Justificantes / curso / mes / docente, con el estado de cada uno (un pendiente, «Sin archivo todavía»), las reglas («Cómo se guardan») y el registro de accesos, que dice quién sube cada uno y quién lo abre. Lleva la banda «Solo cada docente y secretaría, con registro de accesos». Sin la insignia de la IA.
- `circulares` (plazos): lo que sale de las circulares y del mantenimiento del edificio: E7, E10 y las autorizaciones de la salida, con quién y cuándo.

### `docente` · Laura Sánchez · orden 4

**Inicio:** panel de mando (6.2 bis), con la ilustración de la docente:

- **Cifras:**
  - el correo a las familias de 4.º A, hoy, con sus pasos (dictar, revisar y enviar) y la nota «El recordatorio de la salida, para 4.º A. Te llega redactado para revisar.». Ya dictado, «Por revisar», con la nota «Ya lo has dictado. Te queda revisar el correo y enviarlo tú.» y la acción «Revisar y enviar» (`siDictado`); enviado, «Enviado». Si se sale del dictado mientras escucha, al volver sigue escuchando;
  - correos por responder: 4, resumidos con IA. Sin ninguno por responder, «Al día»;
  - entregas del viernes 20: 2. La nota dice «La programación y las autorizaciones». Con las dos marcadas, «Todo entregado» y «Ver tus plazos» (`ir: 'plazos'`).
- **Tu día:** sus sesiones del miércoles (dato de la demo):

  | Sesión | Clase |
  |---|---|
  | 1.ª y 2.ª | Lengua y Matemáticas, con 4.º A |
  | 3.ª | Educación Física, con 4.º B |
  | Recreo | Hoy no vigila el patio |
  | 4.ª | Educación Física, con 3.º B |
  | 5.ª y 6.ª | Ciencias de la Naturaleza y Plástica, con 4.º A |
  | Salida, 16:00 | Con su grupo, 4.º A |

  Bajo el título va «Hoy no viene Sergio Prieto, el tutor de 3.º B: tu Educación Física con ellos no cambia.», y en la 4.ª, con 3.º B, el aviso «Falta su tutor».
- **Lo que te necesita:**
  - Hoy: las dos familias de 4.º A (resumidas con IA), sin nombres de alumnos: «Una familia de 4.º A: qué llevar a la salida» y «Una familia de 4.º A escribe en inglés por el chándal». Y el recordatorio de la salida: «Dicta el correo y te llega redactado para revisar.»; ya dictado, «Ya lo has dictado. Te queda revisar el correo y enviarlo.».
  - Esta semana: «Tu justificante del lunes 16», con «El de tu ausencia de 9:00 a 10:30. Súbelo desde aquí, no por correo: un programa lo archiva en tu carpeta.». Sigue a `justificantes#j1`: al subirlo, «Entregado a las…». Sin insignia: no sale de un correo.
  - Para saber: el choque de su guardia del viernes 27 a 3.ª hora con la salida y el plan de lectura. El choque, «Tu guardia del viernes 27 coincide con la salida», con «Estarás en el Jardín Botánico de 9:15 a 13:30, así que la cubre otra persona. Jefatura ya lo sabe.», va primero. Lo detecta DirectorIA cruzando su horario con la salida (reglas y fechas, no sale de ningún correo), así que va sin insignia (`ia: false`). Va en «Para saber» (`estado: 'info'`): es la semana que viene y Laura no tiene que hacer nada. Sigue a las respuestas de jefatura a su correo (`jefatura/correo:c-laura#0,1`), que le dicen que esa guardia también la cubre otra persona: entonces pasa a «Confirmado a las…», con «Jefatura te ha confirmado que la cubre otra persona.». Si jefatura archiva su correo, no cambia.
- **Lo que viene,** de «Tus plazos»:
  - jue 19: la tutoría de las 11:45 con una familia de 4.º A, que coincide con su guardia (sacada de su correo a jefatura, con la insignia): «Coincide con tu guardia. Has pedido a jefatura que la cubra otra persona y aún no te ha contestado.». Sigue al correo de Laura en jefatura (`jefatura/correo:c-laura`): cuando jefatura lo responde (las dos respuestas le dicen que la cubre Rosa Medina), dice «Coincide con tu guardia. Jefatura te ha contestado: la cubre Rosa Medina.»; si lo archiva, sigue sin contestar;
  - vie 20: la programación quincenal y las autorizaciones («Las de 4.º A firmadas, en secretaría. Dile a Carmen cuántas faltan.»). Al marcarlas en «Tus plazos», «Entregada a las…» y «Entregadas a las…»;
  - vie 27: la salida a las 9:15 y el choque con su guardia de 3.ª hora, sin insignia: «Estarás en la salida, así que la cubre otra persona. Jefatura ya lo sabe.». Como la fila de «Lo que te necesita», pasa a ✓ («Confirmado a las…») cuando jefatura le contesta, y no cambia si archiva su correo;
  - vie 4 dic: los títulos para el lote de lectura. Al marcarlo, «Pedidos a las…».

**Correo (5):**

1. Una familia de 4.º A (Raquel) pregunta qué llevar a la salida (E11): no le ha llegado la circular. Escribe «mi hijo», sin su nombre.
2. Una familia de 4.º A (Nadia) escribe en inglés por el chándal de Educación Física: «my daughter», sin su nombre. Respuestas propuestas en inglés, con traducción al español entre corchetes al final.
3. Secretaría: llevar las autorizaciones firmadas antes del vie 20 y decir cuántas faltan.
4. La coordinadora de ciclo: entregar la programación quincenal antes del viernes.
5. Dirección: el plan de lectura de enero. Informativo.

**Módulos:**

- `dictado`: correo a las familias de 4.º A, una comunicación general, sin datos de ningún alumno: el recordatorio de la salida (horario, qué llevar, el precio en el recibo de diciembre y las autorizaciones antes del viernes 20).
- `banco`: E12, con lo que se comprueba al subir un recurso.
- `material`: E13, una situación de aprendizaje sobre alimentación saludable. El aviso de la respuesta no habla de alergias: «Antes de usar alimentos de verdad en clase, pregunta en el colegio: las indicaciones de salud de los alumnos no están en DirectorIA.».
- `plazos`: tus plazos y entregas. El de hoy es recordar a las familias de 4.º A la salida y las autorizaciones (en «Correo dictado»). La tutoría del jueves 19 sale de su correo a jefatura («Sacado con IA de: Tu correo a jefatura del martes 17»), con «Es a 4.ª hora, en tu guardia. Has pedido a jefatura que la cubra otra persona.». No dice si jefatura ha contestado, porque «Tus plazos» no cambia cuando jefatura actúa: eso lo dice la marca del jueves 19 en el Inicio. Su guardia del viernes 27 no va como plazo aparte, porque Laura no tiene nada que entregar: la nombra la salida («Jefatura organiza quién cubre esa clase y tu guardia de 3.ª.», de «Acuerdo del claustro del lunes 16», sin insignia), y el choque va en el Inicio. La fila y la marca del choque llevan a «Tus plazos», a esa salida.
- `justificantes` (justificantes, vista `subir`): «Tus justificantes» (E8). El pendiente, de su ausencia del lunes 16 de 9:00 a 10:30: elige la ausencia («Lun 16 nov · 9:00-10:30») y el archivo (en la demo, «escaneo_0001.pdf», un ejemplo), ve cómo se va a llamar («Justificantes/2026-27/2026-11/Laura Sánchez/2026-11-16 justificante.pdf») y lo sube. Debajo, los entregados, con su carpeta; al lado, «Cómo se guardan». Lleva la banda «Reservado · lo ves tú y secretaría, con registro de accesos», y la entradilla dice «Ni la IA ni ningún programa leen lo que pone», no «Nadie lee lo que pone». Sin la insignia de la IA.

### `orientacion` · Andrés Vidal · orden 5

**Inicio:** panel de mando (6.2 bis), con la ilustración del orientador: la propia de la demo, un hombre con gafas y el bocadillo con el corazón (6.2 bis). Orientación no guarda datos de alumnos: ni casos, ni pautas personales, ni anotaciones. Trabaja con las guías de los protocolos, el plan de convivencia, los documentos del departamento y circulares generales adaptadas. Va sin el día por sesiones: su trabajo no sigue el horario de Primaria. La entradilla: «La circular adaptada, la sesión del claustro y el plan de convivencia. Nada se envía sin ti.»

- **Cifras:**
  - Circular adaptada: «Por enviar», hoy y en pizarra. Es la de la salida, en lectura fácil y en inglés, para las familias de 4.º (E11): las autorizaciones son antes del viernes 20. Pasa a «Enviada» al enviarla.
  - Correos por responder: 4, resumidos con IA. Sin ninguno por responder, «Al día».
  - Sesión para el claustro: «mié 25», «a las 16:15»: el protocolo de acoso, paso a paso (E3). Está hecha cuando le pasa a Nuria Castro el guion (`correo:c-nuria#0`), así que lleva a su correo, con «Pasarle el guion»; hecha, «Guion enviado» y «Ver el correo». Con otra respuesta, la nota dice «Ya has contestado a Nuria Castro. El guion, antes del lunes 23.» y la cifra lleva a la guía, con «Ver la guía» (`aMedias`), porque el guion se prepara con ella. La guía también está enlazada desde la nota del correo y desde «Para saber».
  - Plan de convivencia: «1 de 6 hechas» (`progreso: 'convivencia'`), con la nota «Esta semana, el Día de los Derechos de la Infancia, el viernes 20.».
- **Lo que te necesita:**
  - Hoy: Beatriz Romero pide materiales de técnicas de estudio para todo 2.º ESO B, y una familia de 5.º pregunta por una charla sobre pantallas. Salen de correos y llevan «Resumido con IA».
  - Esta semana: el Día de los Derechos de la Infancia, el viernes 20, con la actividad de tutoría para toda Primaria. Sigue a `convivencia#1`: «Hecha a las…».
  - Para saber: las guías de los protocolos («Paso a paso y con los anexos en blanco. Ningún caso se abre en DirectorIA: va a Raíces y al expediente del centro.»), sin insignia, y el curso de lectura fácil (resumido con IA).
- **Lo que viene,** en cuatro semanas:
  - vie 20: el Día de los Derechos de la Infancia (del plan de convivencia, sin insignia);
  - lun 23: el guion de la sesión del claustro, para Nuria Castro (sacado del correo). Solo lo envía la 1.ª respuesta propuesta (`correo:c-nuria#0`): «Enviado a las…». Con las otras, «Ya has contestado a Nuria Castro. El guion, antes de este día.»;
  - mié 25, 16:15: el protocolo de acoso en el claustro, con la guía y los anexos en blanco;
  - jue 26: los materiales de técnicas de estudio para 2.º ESO B (sacado del correo). Solo los envía la 1.ª respuesta propuesta (`correo:c-beatriz#0`); con las otras, «Ya has contestado a Beatriz Romero. Los materiales, antes de este día.»;
  - vie 11 dic: la inscripción en el curso de lectura fácil (sacado del correo).

**Correo (5):**

1. Nuria Castro, coordinadora de bienestar: la sesión del claustro sobre el protocolo de acoso, el miércoles 25 a las 16:15. Pide un guion antes del lunes 23, práctico y sin ejemplos de casos del colegio → guías.
2. Una familia de 5.º (Elisa) pregunta si habrá una charla para familias sobre móviles y pantallas; ofrece la ayuda del AMPA → plan de convivencia.
3. Beatriz Romero, tutora de 2.º ESO B: materiales de técnicas de estudio para hacer en la tutoría del jueves 26 con todo el grupo, antes de los exámenes. Nada de un alumno en concreto.
4. Laura Sánchez: la circular de la salida en inglés y en lectura fácil, para las familias de 4.º → circulares adaptadas.
5. Un centro de formación, con un curso de lectura fácil. Informativo.

**Módulos:**

- `protocolos` (protocolo): «Guías de protocolos», E3 completo: acoso escolar (nueve pasos y cinco anexos en blanco), absentismo y accidentes. Sin banda confidencial: no lleva datos de nadie. Las guías están escritas aquí; dirección las toma de este módulo (`guias: 'orientacion/protocolos'`), así que un cambio en ellas vale para los dos perfiles.
- `convivencia` (plazos, `ia: false`): el plan de convivencia 2026-27, con sus actividades del curso y quién lleva cada una: normas de aula (hecho), Día de los Derechos de la Infancia (vie 20), el protocolo de acoso en el claustro (mié 25), charlas sobre el uso seguro de internet con el Plan Director (enero), sesión para familias sobre pantallas con el AMPA (enero) y la memoria (junio).
- `traduccion`: E11, para todas las familias de 4.º: lectura fácil e inglés («su hijo o hija», «your child»). Se envía a las familias de 4.º con las tres versiones; Laura Sánchez va en copia.

### `sustituto` · Pablo Sanz · orden 6

**Inicio:** panel de mando (6.2 bis), con la ilustración del profesor que sustituye. Los textos de base son los de las 8:00, cuando jefatura aún no ha confirmado las guardias; lo de después va en `siConfirmada`. La entradilla vale para todo, antes y después de confirmar y aunque jefatura elija a otra persona: «Sergio Prieto no viene hoy. Aquí tienes tu jornada. Nada se envía sin ti.»

- **Cifras:**
  - Tu primera sesión: «9:00», hoy y en pizarra. A las 8:00 es una propuesta: «Te proponen para Lengua con 3.º B. Tu ficha llega cuando jefatura confirme las guardias.», con «Ver tu jornada», y no se puede dar por hecha. Con las guardias confirmadas (`siConfirmada`, `cuando: 'jefatura/guardias'`), «Lengua con 3.º B, en tu hora de guardia. Lee su ficha antes de entrar.», con «Leer tu ficha de 1.ª»; pasa a «Ficha leída» cuando marca en «Tu jornada» que la ha leído. Si jefatura confirma solo la 1.ª, «Cubres Lengua con 3.º B. Tu ficha llega cuando jefatura confirme las demás guardias.».
  - Tus fichas de hoy (`fichas: 'jefatura/guardias'`): cuántas le llegan, «por llegar». Las cuenta el motor: las sesiones con ficha que son suyas, porque DirectorIA se las proponía o porque jefatura lo ha elegido. A las 8:00, «2 por llegar», la de 1.ª y la de 6.ª; si jefatura lo elige para la 3.ª, «3». Llegan juntas cuando jefatura confirma todas las guardias: «Ya las tienes» (o «Ya la tienes», si es una).
  - Correos por responder: 3, resumidos con IA. Sin ninguno por responder, «Al día».
- **Tu jornada:** sus cuatro apoyos, sin cambios, y lo que cubre en 3.º B: la 1.ª, la 6.ª y la salida de las 16:00, que siguen a `jefatura/guardias#g1` y `#g4`. Antes de confirmar, «Por confirmar · Propuesta: tú» y el atajo a la propuesta de jefatura; después, «Cubres tú · Confirmada a las 8:01». Los textos del carril los rellena el motor con lo que hay de verdad en su día (6.2 bis):
  - el detalle: «Cuatro apoyos y lo que cubres de Sergio» (`{Clases}`); «Tres apoyos…» si jefatura le da la 3.ª, porque su apoyo de 3.º A queda sin hacer;
  - la línea, a las 8:00: «DirectorIA te propone para cubrir a Sergio Prieto. Jefatura lo está revisando.»;
  - si jefatura confirma una parte: «Jefatura ha confirmado que cubres la 1.ª. La 6.ª y la salida, por confirmar.» (`parcial`, con `{hechas}` y `{Faltan}`);
  - con todo confirmado: «Jefatura ha confirmado que cubres a Sergio Prieto: la 1.ª, la 6.ª y la salida.» (`{hechas}`), con la 3.ª o el recreo si jefatura lo ha elegido para ellos.
- **Lo que te necesita:**
  - Hoy: el material que le pide Laura Sánchez (resumido con IA) y la salida de 3.º B a las 16:00. A las 8:00 es para saber: «16:00: te proponen para la salida de 3.º B», «Va con la 6.ª. Si jefatura lo confirma, pregunta antes en conserjería cómo se hace la salida.», y no suma en el recuento («Hoy · 1»). Con las guardias confirmadas, «16:00: haces tú la salida de 3.º B», con «Antes, lee tu ficha de 6.ª y pregunta en conserjería cómo se hace la salida.», y ya cuenta («Hoy · 2»). Las indicaciones de recogida de los alumnos no están en DirectorIA: las tiene el colegio.
  - Esta semana: un choque. Desde enero se lee de 14:30 a 14:50 en toda Primaria y sus apoyos de 5.ª empiezan a las 14:30; lo tiene que tener en cuenta en la propuesta para Pilar Serrano (lo dicen los correos de Pilar y de dirección). Lo resuelven las respuestas a Pilar que hablan de la lectura (`correo:c-ciclo#0,2`: empezar los apoyos a las 14:50 o preguntarle cómo encajarla). Si solo le pide más tiempo (la 2.ª), sigue el choque: «Le has pedido a Pilar Serrano más tiempo. Tenlo en cuenta en tu propuesta.» (`aMedias`).
  - Para saber: «Tus fichas se cierran al acabar la jornada», con «Cada una trae solo la clase: la tarea, el material y a quién llamar. Queda registrado quién la ve.».
- **Lo que viene,** del correo de Pilar Serrano:
  - vie 20: la propuesta de apoyos para enero, antes de este día;
  - mar 24: la reunión del 2.º ciclo, de 16:15 a 17:15.
- **Si jefatura da a otra persona la 1.ª (g1) o la 6.ª y la salida (g4)** (`siOtra`):
  - esas celdas dicen «Por confirmar · Elección: Rosa Medina» y, confirmadas, pasan a aviso: «Ya no la cubres · La cubre Rosa Medina». Salen de su recuento («1 de 1 confirmadas»);
  - sin la 1.ª, su primera sesión es el apoyo de 2.ª: «9:45», «Apoyo de lectoescritura con 1.º B. Jefatura ha elegido a otra persona para la 1.ª.», con «Ver tu jornada»;
  - las fichas: «1 por llegar», con la nota que dice cuál y para cuál ha elegido jefatura a otra persona («Ya la tienes» al confirmar). Sin ninguna de las dos, «Ninguna», sin darse por hecha y con «Ver tu jornada» (`siNinguna`);
  - la línea del carril dice qué ha elegido jefatura y qué le queda por confirmar o ha confirmado: «Para la 1.ª, jefatura ha elegido a otra persona. Ha confirmado que cubres la 6.ª y la salida.» (y la 3.ª, si jefatura se la da a él);
  - sin la 1.ª ni la 6.ª, y sin nada para lo que jefatura lo haya elegido (`siNinguna`), el detalle del carril es «Cuatro apoyos. En 3.º B no cubres nada.» y la línea, con el triángulo, «Jefatura ha elegido a otra persona para la 1.ª y para la 6.ª de 3.º B. Tus apoyos no cambian.»;
  - sin la 6.ª, la fila de la salida pasa a «16:00: la salida de 3.º B ya no es tuya», para saber, sin enlace y sin sumar en el recuento.
- **Si jefatura lo elige para la 3.ª (g2) o para el recreo (g3)** (`siElegido`), que DirectorIA proponía a Rosa Medina y a Teresa Gil:
  - la sesión sale en su franja: «Ciencias de la Naturaleza · 3.º B» en lugar de su apoyo de Matemáticas en 3.º A, o «Patio de Primaria · Turno de Sergio» en el recreo, con «Por confirmar · Elección: tú» y, confirmada, «Cubres tú · Confirmada a las 8:01». Cuenta en su recuento («0 de 4 confirmadas»);
  - el detalle y la línea del carril la cuentan: «Tres apoyos y lo que cubres de Sergio» y, al confirmar, «Jefatura ha confirmado que cubres a Sergio Prieto: la 1.ª, la 3.ª, el recreo, la 6.ª y la salida.»;
  - bajo el día, con el triángulo: «Jefatura te ha elegido para la 3.ª de 3.º B: tu apoyo de Matemáticas en 3.º A queda sin hacer.» y «Jefatura te ha elegido para el turno de patio de Sergio Prieto, en el recreo.»;
  - la cifra de las fichas cuenta también la de 3.ª.
- Los módulos «Tus fichas de hoy» y «Tu jornada» siguen la propuesta inicial, como dice «Guardias de hoy»: en la demo no se abren después de cambiarla.

**Correo (3-4):**

1. Jefatura: «Hoy cubres 1.ª y 6.ª en 3.º B».
2. Laura Sánchez: pide material de Educación Física para el jueves.
3. La coordinadora de ciclo, con la reunión de ciclo del martes.

No hay correos de familias.

**Módulos:**

- `ficha` (ficha, `bandera: 'guardias'`): la de 6.ª y la de 1.ª (E2), solo la clase y con la línea fija, y el registro.
- `jornada` (plazos): tu horario de hoy como plazos con hora; los estados según la hora: 9:00 «pronto», etc. La salida de las 16:00: «Acompañas al grupo a la puerta de Primaria. Antes, pregunta en conserjería cómo se hace la salida de 3.º B.».
