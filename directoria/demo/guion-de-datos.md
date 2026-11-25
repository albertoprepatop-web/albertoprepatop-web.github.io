# Demo de DirectorIA: guion común y formato de los datos

Esta demo es la aplicación modelo que el fundador de DirectorIA enseña a los equipos directivos de colegios privados y concertados. Primero se elige con qué perfil entrar: directora, jefe de estudios, secretaría, docente, orientador o profesor que sustituye. Dentro, cada perfil ve su panel:

- **Inicio:** lo de hoy.
- **Correo:** cada correo llega resumido y con respuestas propuestas para revisar, editar y enviar.
- **Funciones propias del cargo.**

Todo es un ejemplo ficticio y nada se envía de verdad.

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
- **DirectorIA** funciona en un servidor dentro del colegio. El correo sale por la cuenta de correo que el colegio ya tiene.

## 2. Personas (todas inventadas)

| Persona | Cargo | Perfil de la demo |
|---|---|---|
| Elena Ruiz | Directora | `direccion` |
| Javier Martín | Jefe de estudios | `jefatura` |
| Carmen López | Secretaría y administración | `secretaria` |
| Laura Sánchez | Tutora de 4.º A de Primaria; da Educación Física en 2.º ciclo | `docente` |
| Andrés Vidal | Orientador (Departamento de Orientación) | `orientacion` |
| Pablo Sanz | Maestro de apoyo de Primaria; hoy cubre dos sesiones | `sustituto` |
| Sergio Prieto | Tutor de 3.º B de Primaria; hoy no viene | — |
| Rosa Medina | Maestra de Primaria (guardia en 3.ª hora) | — |
| Teresa Gil | Maestra de Inglés (vigilancia del recreo) | — |
| Beatriz Romero | Tutora de 2.º ESO B | — |
| Nuria Castro | Coordinadora de bienestar y protección | — |
| Marta Ramos, Luis García, Pilar Serrano | Docentes que han compartido recursos en el banco | — |

**Alumnado.** Solo nombre de pila, o nombre e inicial, siempre inventados:

- **3.º B:** Mario, Lucía, Hugo (los de la ficha).
- **4.º A:** Daniel M. e Irene. Amira llegó en octubre y su familia prefiere el inglés.
- **1.º ESO:** Nora D.
- **2.º ESO B:** el caso de acoso. Ahí nunca hay nombres: «Alumno/a A», «Alumno/a B», «Alumno/a C».

**Familias:** «la familia de Daniel M.», «la madre de Mario».

**Organismos:** se nombran de forma genérica:

- «Inspección educativa (DAT Madrid-Capital)»;
- «Consejería de Educación»;
- «Ayuntamiento»;
- «AMPA del colegio»;
- empresas sin marca, por ejemplo «la empresa de fotocopiadoras».

**Sin direcciones de correo ni teléfonos.** Solo una extensión interna (ext. 201) en la ficha.

## 3. La historia común (lo que cada perfil ve tiene que cuadrar)

### E1. Ausencia de Sergio Prieto

A las 7:45 avisa por la app de que tiene fiebre y no viene. DirectorIA propone cómo cubrir sus sesiones con 3.º B y jefatura lo revisa:

| Sesión | Grupo y materia | Propuesta | Motivo |
|---|---|---|---|
| 1.ª hora, 9:00-9:45 | 3.º B, Lengua | Pablo Sanz | Tiene guardia a esa hora. Lleva 2 guardias este mes; la media es 3. |
| 3.ª hora, 10:30-11:15 | 3.º B, Ciencias de la Naturaleza | Rosa Medina | Tiene guardia. |
| Recreo, 11:15-11:45 | Vigilancia del patio de Primaria (turno de Sergio) | Teresa Gil | — |
| 6.ª hora, 15:15-16:00 | 3.º B, Matemáticas | Pablo Sanz | — |

Las sesiones 2.ª, 4.ª y 5.ª de 3.º B las dan especialistas: Inglés, Educación Física y Música.

**Estado al empezar la demo:** la propuesta está pendiente de que jefatura la confirme. Cuando jefatura la confirma en la demo, cambian dos cosas:

- el resumen de la directora;
- el panel de Pablo.

Se marca con `bandera: 'guardias'`; ver el formato.

### E2. Ficha de sustitución de la 6.ª hora

**3.º B · Matemáticas · 6.ª hora**, para Pablo Sanz.

| Apartado | Contenido |
|---|---|
| Tarea | Ejercicios 4 a 9 de la página 58. Los libros están en el armario del aula. |
| Necesidades | Mario: instrucciones por escrito y más tiempo. |
| Salud | Lucía: alérgica a frutos secos. Su autoinyector está en conserjería. |
| Recogida · última hora | Hugo solo puede salir con su madre o su abuela. Si viene otra persona, no lo entregues y avisa a dirección (ext. 201). |

**Cómo funciona la ficha:**

- **Origen:** «Preparada por DirectorIA para Pablo Sanz», sin IA. La tarea sale de la programación quincenal de Sergio. Las pautas las pone orientación y tutoría; la salud y las recogidas, la dirección y la tutoría.
- **Apertura:** se abre antes de la sesión y se cierra al acabar la jornada.
- **Registro:** queda registrado quién la ve.

También hay una ficha más corta de la 1.ª hora (3.º B, Lengua), con la tarea: lectura de las páginas 40-41 y las preguntas 1 a 3 en el cuaderno.

### E3. Caso 2026-07, posible acoso escolar

Alumno/a A, 2.º ESO B. Lo comunicó la tutora (Beatriz Romero) el lunes 16 a las 9:40.

**Estado de hoy:** paso 4 de 9, recogida de información (Anexo II), del martes 17 al lunes 23.

**Pasos del protocolo** (protocolo de la Comunidad de Madrid):

1. Comunicación a la dirección (hecho, lun 16 nov, Anexo I.a).
2. Apertura y comunicación oficial (hecho, lun 16 nov, Raíces).
3. Medidas de protección (hecho, adoptadas el lun 16 nov).
4. Recogida de información (en curso, Anexo II, 17-23 nov).
5. Reunión para la toma de decisiones (pendiente, Anexo III, mar 24 nov).
6. Fiscalía de Menores e Inspección (si se confirma).
7. Familias y plan de intervención (si se confirma).
8. Procedimiento disciplinario (si se confirma).
9. Seguimiento y cierre (pendiente, Anexo IV.c, Raíces).

**Entrevistas:**

- Alumno/a A: hecha hoy, mié 18.
- Compañeros observadores y profesorado: jue 19 y vie 20.
- Familia de Alumno/a A: vie 20 nov, 17:00, despacho de orientación.
- Alumnado mencionado (B y C) y sus familias: lun 23.

**Equipo del caso:**

- los dos docentes que designó la dirección el mar 17;
- el orientador (Andrés Vidal);
- la coordinadora de bienestar (Nuria Castro);
- el jefe de estudios;
- la tutora.

**Pendiente de la directora:** firmar la citación a la familia de Alumno/a A para el vie 20 a las 17:00.

**Confidencialidad:**

- solo lo ve el equipo del caso, con registro de accesos;
- en el resumen de las 8:00 aparece solo «Caso 2026-07»;
- en las fichas, solo instrucciones, nunca el caso;
- los datos del caso nunca se envían a Claude.

**Decisiones:** la IA guía, recuerda y redacta. Si hay acoso, y con qué medidas, lo decide el equipo del centro.

### E4. Visita de inspección

Inspección educativa (DAT Madrid-Capital) visitará el colegio el **jueves 26 de noviembre a las 10:00**. Pide, **antes del lunes 23**:

- el plan de convivencia 2026-27;
- los horarios de 2.º ESO;
- las programaciones de Matemáticas de ESO;
- las actas de la evaluación inicial de ESO.

DirectorIA reúne un dosier con lo que hay en el servidor del colegio. Falta el acta de la evaluación inicial de 2.º ESO A: no está en el archivo, y la directora decide si se la pide a jefatura.

### E5. Claustro del lunes 16

La directora dictó un resumen de 12 minutos. El borrador del acta recoge tres acuerdos:

1. Las sesiones de la 1.ª evaluación serán del 9 al 11 de diciembre.
2. Salida de 4.º de Primaria al Jardín Botánico el viernes 27 de noviembre.
3. En Primaria se dedicarán 20 minutos diarios a la lectura a partir de enero.

Asistieron 47 de 52 docentes.

**Lo que hay que revisar:**

- que los acuerdos recogen lo que se votó;
- que no hay datos de alumnos.

Una vez aprobada, el acta se guarda en el archivo de actas, con buscador.

### E6. Analista de gastos

Lo usa sobre todo secretaría, y el informe mensual llega a dirección y a la titularidad.

**Avisos del informe de octubre:**

- El contrato de las fotocopiadoras se renueva solo el 1 de diciembre; se puede negociar o cambiar antes del 21 de noviembre (preaviso del contrato).
- La potencia de luz contratada es mayor que la que se usa: bajarla ahorraría unos 1.800 € al año (estimación).
- Hay dos presupuestos de seguro escolar comparados.
- El banco cobra 46 € al mes de comisión de mantenimiento: conviene pedir que la quite.
- Cobros pendientes de octubre: 6 recibos devueltos (1.240 €). Solo se dan cifras agregadas, sin nombres.

No sustituye a la gestoría ni lleva la contabilidad oficial.

### E7. Circular de la Consejería

Pide los datos para la estadística de inicio de curso 2026-27.

- **Qué hay que entregar:** los datos de matrícula por curso y grupo, y los del profesorado.
- **Quién:** secretaría.
- **Cómo y cuándo:** por la plataforma de la Consejería, antes del viernes 27 de noviembre. DirectorIA avisa el miércoles 25.

### E8. Certificado de matrícula de Nora D. (1.º ESO)

Su familia lo pide por correo para una beca deportiva del club. DirectorIA lo prepara con los datos del centro: curso 2026-27, 1.º ESO A, matrícula del 3 de julio de 2026.

**Cómo sigue:** secretaría lo revisa y lo pasa a la firma; firma la secretaría con el visto bueno de la directora. Después se envía a la familia.

### E9. Autorizaciones de imagen

Hay fotos del festival de otoño de Primaria para la web y la revista. Según el registro de autorizaciones, en esos grupos hay tres alumnos sin autorización:

| Alumno | Grupo |
|---|---|
| Iker P. | 4.º A |
| Sofía L. | 4.º B |
| Adrián C. | 3.º B |

DirectorIA **no reconoce caras ni mira las fotos**. Solo dice quién no puede aparecer, y una persona revisa las fotos antes de publicar.

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
- **Autorizaciones:** firmadas antes del viernes 20.
- **Precio:** 6 € (entrada y autobús).

### E12. Banco de recursos

Laura busca «flashcards de alimentos para EF 2.º ciclo». La IA lo entiende como: Flashcards · Alimentación saludable · Educación Física · 3.º y 4.º de Primaria.

Aviso: «Todavía no hay de Educación Física en 2.º ciclo. Te enseñamos lo más parecido:»

| Resultado | Datos | Etiqueta |
|---|---|---|
| Flashcards: los grupos de alimentos | Educación Física · 6.º de Primaria · De Marta R. · Hecho con IA y revisado | «Misma materia, ciclo siguiente» (con el botón «Adaptar a 3.º–4.º») |
| Tarjetas de hábitos saludables | Educación Física · 2.º de Primaria · De Luis G. | «Misma materia, ciclo anterior» |
| Juego: la pirámide de los alimentos | Ciencias de la Naturaleza · 4.º de Primaria · De Pilar S. | «Mismo curso, materia afín» |

Al subir un recurso, el curso y la materia son obligatorios.

La gamificación no tiene clasificaciones ni premios a la cantidad. Los datos de uso nunca sirven para evaluar a nadie.

### E13. Material didáctico con Claude (opcional)

Es un módulo en la nube, solo para material didáctico y sin acceso a los datos del colegio. Un filtro está pensado para bloquear datos personales, y la norma de uso es no introducirlos. Cada colegio lo paga en su propia cuenta.

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

- No digas que los datos «no salen del colegio». La fórmula es: «la IA trata los datos de los alumnos en el servidor del colegio».
- Nada de «riesgo cero» ni de «cumplimiento garantizado».

**Etiquetas de origen.** Decisión del 25-11-2026 (documento «qué funciones necesitan IA»):

- «Preparado con IA» y la insignia van solo en lo que prepara la IA: resúmenes y respuestas de correo, dictados, actas, plazos sacados de circulares, banco de recursos, traducciones y material con Claude.
- Lo que sale de reglas y plantillas lleva «Preparado por DirectorIA», sin insignia: guardias, fichas, certificados, dosier, protocolos, registros e informe de gastos.
- «Hecho con IA y revisado» es la etiqueta de los recursos del banco que el docente declara hechos con IA.

## 5. Privacidad en la demo

- Todos los nombres son inventados y los datos de alumnos, los mínimos.
- **Datos de salud:** solo donde hacen falta (la ficha) y nunca en correos a terceros.
- **Caso de acoso:** solo «Alumno/a A/B/C». Fuera del perfil de orientación y de la firma de la directora, solo «Caso 2026-07».
- **Respuestas propuestas:** no incluyen datos de otros alumnos.

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
  modulos: [ ... ],                      // 2-4 funciones propias, ver 6.4
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
    },
  ],
  nota: 'DirectorIA ha reunido los documentos en «Dosier para inspección».', // opcional, ≤ 140 caracteres
  ir: 'dosier',                          // opcional: id de un módulo relacionado (botón «Abrir»)
}
```

- Ordena los correos como en una bandeja: el más importante o el más reciente primero.
- Al menos uno tiene que ser de una familia, salvo en `sustituto`.
- Si un correo no pide respuesta, `respuestas: []` y una `nota`, por ejemplo: «Solo para leer. DirectorIA ha añadido la fecha a tus plazos».

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
  confidencial: 'Confidencial · solo equipo del caso', // opcional: muestra una banda de confidencialidad
}
```

Cada tipo añade sus propios campos.

#### `aprobaciones`: propuestas que una persona confirma una a una

```js
{ tipo: 'aprobaciones',
  contexto: { titulo: 'Sergio Prieto · tutor de 3.º B', texto: 'Avisó a las 7:45 de que tiene fiebre y no viene hoy.' },
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

#### `protocolo`: un protocolo paso a paso (solo para el caso de acoso)

```js
{ tipo: 'protocolo',
  caso: 'Alumno/a A, 2.º ESO B · comunicado el lun 16 nov a las 9:40',
  pasos: [ { nombre: 'Comunicación a la dirección', estado: 'hecho', nota: 'lun 16 nov · Anexo I.a' } ], // estado: hecho | curso | pendiente | condicional
  actual: {
    titulo: 'Paso 4 de 9 · Recogida de información (Anexo II)',
    secciones: [ { titulo: 'Entrevistas previstas', items: ['...'] } ], // 2-4 secciones
  },
  documentos: [ { nombre: 'Anexo II con los datos del caso', estado: 'Listo para los docentes' } ],
  pie: 'La IA guía, recuerda y redacta; deciden las personas.',
}
```

#### `banco`: banco de recursos (solo `docente`)

```js
{ tipo: 'banco',
  consulta: 'flashcards de alimentos para EF 2.º ciclo',
  entendido: ['Flashcards', 'Alimentación saludable', 'Educación Física', '3.º y 4.º de Primaria'],
  aviso: 'Todavía no hay de Educación Física en 2.º ciclo. Te enseñamos lo más parecido:',
  resultados: [
    { titulo: 'Flashcards: los grupos de alimentos',
      meta: 'Educación Física · 6.º de Primaria · De Marta R. · Hecho con IA y revisado',
      cercania: 'Misma materia, ciclo siguiente',
      adaptar: {                         // opcional: solo en el primero
        boton: 'Adaptar a 3.º–4.º',
        titulo: 'Flashcards: los grupos de alimentos · versión para 3.º y 4.º',
        texto: ['Tarjeta 1 · Frutas: ...', '...'],  // 4-8 líneas de la versión adaptada
        nota: 'Versión preparada con IA a partir del recurso de Marta R. Revísala antes de usarla; queda enlazada al original.',
      },
    },
  ],
  subir: {
    titulo: 'Flashcards: frutas y verduras de temporada',
    curso: ['3.º de Primaria', '4.º de Primaria'],
    materia: ['Educación Física'],
    contenidos: ['Alimentación saludable', 'Hábitos de vida activa'],   // los sugiere la IA
    casillas: ['Hecho con IA y revisado por mí', 'Sin fotos ni datos de alumnos', 'Es mío o puedo compartirlo'],
  },
  impacto: {                             // lo que ve en privado
    texto: 'Tus 12 recursos se han usado 87 veces y 9 compañeros han dicho «Me ha servido».',
    insignias: ['Primer recurso', 'Un compañero lo adaptó', 'Primera situación de aprendizaje'],
    meta: '6 de 8 peticiones «Se busca» del 2.º ciclo ya tienen respuesta',
  },
}
```

#### `dictado`: correo dictado (solo `docente`)

```js
{ tipo: 'dictado',
  para: 'Familia de Daniel M. (4.º A)',
  transcripcion: 'Lo que dice la docente al dictar, tal cual, con muletillas (60-110 palabras).',
  asunto: '...',
  borrador: 'El correo redactado en el tono adecuado (90-160 palabras), firmado por la docente.',
  notas: ['Tono cercano y sin juicios', 'Propone una tutoría con dos horarios'], // 2-3
}
```

#### `material`: material didáctico con Claude, módulo opcional (solo `docente`)

```js
{ tipo: 'material',
  aviso: 'Módulo opcional en la nube. Solo para material didáctico: no tiene acceso a los datos del colegio, y un filtro está pensado para bloquear datos personales.',
  peticion: 'Situación de aprendizaje sobre alimentación saludable para 4.º de Primaria, de tres sesiones.',
  bloqueo: { intento: 'Adáptala para Daniel, que ...', mensaje: 'He quitado «Daniel»: el módulo de Claude no recibe datos de alumnos. Escríbelo sin nombres.' },
  respuesta: { titulo: '...', bloques: [ { tipo: 'titulo', texto: '...' }, { tipo: 'parrafo', texto: '...' }, { tipo: 'lista', items: ['...'] } ] },
}
```

#### `traduccion`: una carta o circular en lectura fácil o en otro idioma (solo `orientacion`)

```js
{ tipo: 'traduccion',
  para: 'Familia de Amira (4.º A)',
  original: { titulo: 'Salida al Jardín Botánico', texto: '...' },
  versiones: [ { idioma: 'Lectura fácil', texto: '...' }, { idioma: 'Inglés', texto: '...' } ], // el inglés, correcto y natural
  comprobaciones: ['La fecha, la hora y el precio coinciden con el original', 'No hay datos de otros alumnos'],
  boton: 'Enviar a la familia',
  alTerminar: 'Enviado desde la cuenta del colegio, con la versión en inglés y el original en español.',
}
```

#### `ficha`: fichas de sustitución (`sustituto` y, como vista previa, `jefatura`)

```js
{ tipo: 'ficha',
  bandera: 'guardias',                   // opcional: si las guardias aún no están confirmadas, avisa y deja ir a jefatura
  fichas: [
    {
      sesion: '3.º B · Matemáticas · 6.ª hora',
      hora: '15:15-16:00',
      origen: 'Preparada con IA para Pablo Sanz',
      datos: [ { dt: 'Tarea', dd: '...' }, { dt: 'Salud', dd: '...', aviso: true } ],
      pie: 'Se abre antes de la sesión y se cierra al acabar la jornada. Queda registrado quién la ve.',
    },
  ],
  registro: ['Abierta por Pablo Sanz hoy a las 8:05'], // opcional
}
```

#### `tabla`: tabla con avisos y una acción opcional

Sirve para el calendario de exámenes, las programaciones, las autorizaciones de imagen, el mantenimiento o los certificados.

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

## 7. Qué tiene cada perfil

### `direccion` · Elena Ruiz · orden 1

**Inicio: «Tu resumen de las 8:00»**, con cuatro bloques:

- **Quién falta:** Sergio Prieto. Usa `bandera: 'guardias'` con `textoSi`.
- **Qué vence hoy y esta semana:** el dosier de inspección (lun 23) y la reclamación del comedor.
- **Correos que importan:** con `ir` a cada uno.
- **Pendiente de tu firma:**
  - la citación del Caso 2026-07; solo «Caso 2026-07: citación a la familia»;
  - el certificado de Nora D.

**Correo (5):**

1. Inspección, la visita del jueves 26 → «Dosier para inspección».
2. Una familia de 5.º de Primaria, con una reclamación por el cambio de horario del comedor. Plazo de respuesta: vie 27 nov. La IA solo controla el plazo.
3. El AMPA propone fecha para el festival de Navidad.
4. La empresa de fotocopiadoras ofrece renovar. Nota con el aviso del analista: se renueva solo el 1 dic.
5. El Ayuntamiento avisa de un corte de la calle por obras el lunes 30. Informativo, con una respuesta propuesta para avisar a las familias.

**Módulos:**

- `dosier` (documento con `documentos`): documentos para inspección; uno falta.
- `acta` (documento): acta del claustro del lunes 16 (E5).
- `firma` (documento, `confidencial`): «Citación a la familia de Alumno/a A», Caso 2026-07. El borrador lo hace la app y lo revisa y firma la dirección. Las comprobaciones son las de la presentación:
  - ningún dato de otros alumnos ni detalles del caso;
  - tono neutro: no da nada por probado;
  - fecha y hora acordadas antes con la familia;
  - idioma de la familia y canal de entrega.

### `jefatura` · Javier Martín · orden 2

**Inicio:**

- **Ausencias de hoy:** la propuesta, pendiente de confirmar.
- **Exámenes de la 1.ª evaluación:** un choque detectado.
- **Programaciones:** dos incompletas.
- **Caso 2026-07:** solo «Caso 2026-07: entrevistas jue 19 y vie 20 (equipo del caso)».

**Correo (5):**

1. Sergio Prieto, a las 7:45: «No voy a poder ir hoy». Respuestas: «Recupérate; tu clase está cubierta» y otras.
2. La familia de un alumno de 2.º ESO pide cambiar de optativa, de Francés a Tecnología. Respuesta propuesta según el plazo del centro.
3. El Departamento de Matemáticas propone fecha para el examen de 4.º ESO; enlaza con exámenes.
4. Laura Sánchez pide cambiar su guardia del jueves.
5. La Consejería avisa de las instrucciones sobre las sesiones de evaluación. Informativo.

**Módulos:**

- `guardias` (aprobaciones, `bandera: 'guardias'`): E1. Los items de 3.º B que llevan ficha, con `ficha: true`.
- `fichas` (ficha, vista previa de lo que reciben quienes sustituyen): la de 6.ª y la de 1.ª.
- `examenes` (tabla): calendario de la 1.ª evaluación de ESO, del lun 30 nov al vie 4 dic. Un choque en 4.º ESO A el miércoles 2, con la propuesta de moverlo. Botón para aprobar.
- `programaciones` (tabla): estado de las programaciones por departamento frente al modelo del centro. Dos con apartados que faltan; por ejemplo, «evaluación de la práctica docente».

### `secretaria` · Carmen López · orden 3

**Inicio:** plazos de la semana, renovaciones del analista, certificados pendientes y revisiones del edificio.

**Correo (5):**

1. La familia de Nora D. pide el certificado de matrícula → certificados.
2. La Consejería, con la circular de la estadística (E7) → plazos.
3. La empresa mantenedora, para fijar la revisión de extintores antes del 30 nov.
4. El banco, con la nueva tarifa de comisiones. Nota del analista.
5. La familia de Iker P. pregunta si puede cambiar su autorización de imagen → registro de autorizaciones.

**Módulos:**

- `gastos` (informe): analista de gastos, informe de octubre (E6).
- `certificados` (documento): el certificado de matrícula de Nora D. Botón: «Pasar a la firma».
- `imagen` (tabla): autorizaciones de imagen para las fotos del festival de otoño (E9). La app no mira las fotos.
- `circulares` (plazos): lo que sale de las circulares y el mantenimiento: E7 y E10, con quién y cuándo.

### `docente` · Laura Sánchez · orden 4

**Inicio:** tu día (clases de hoy, en pocas líneas), tus plazos y avisos. Por ejemplo: la programación quincenal se entrega el viernes; de ahí sale la tarea si un día faltas.

**Correo (5):**

1. La familia de Daniel M. pregunta qué llevar a la salida (E11).
2. La madre de Amira escribe en inglés por el uniforme de Educación Física. Respuestas propuestas en inglés, con traducción al español entre corchetes al final.
3. Secretaría: recoger las autorizaciones firmadas antes del vie 20.
4. La coordinadora de ciclo: entregar la programación quincenal antes del viernes.
5. Dirección: el plan de lectura de enero. Informativo.

**Módulos:**

- `dictado`: correo a la familia de Daniel M.: lleva una semana sin traer los deberes y se le ve cansado; propone una tutoría.
- `banco`: E12.
- `material`: E13, una situación de aprendizaje sobre alimentación saludable.
- `plazos`: tus plazos y entregas.

### `orientacion` · Andrés Vidal · orden 5

**Inicio:**

- Caso 2026-07 (aquí sí, con el paso actual).
- Entrevistas de hoy y de mañana.
- Pautas actualizadas.
- La traducción pendiente de revisar.

**Correo (5):**

1. Nuria Castro, coordinadora de bienestar: recordatorio de las entrevistas del Caso 2026-07. Interno: solo el número del caso.
2. La madre de Mario (3.º B) pide una reunión para hablar de cómo va.
3. Beatriz Romero, tutora de 2.º ESO B, pide pautas de organización para el aula, sobre otro tema: un alumno con dificultades de atención y sin diagnóstico. Sin nombres.
4. Laura Sánchez: la familia de Amira prefiere el inglés y le pide que revise la circular → traducción.
5. Un centro de formación, con un curso de lectura fácil. Informativo.

**Módulos:**

- `acoso` (protocolo, `confidencial`): E3 completo.
- `pautas` (tabla): pautas para el aula por grupo y alumno, con nombre de pila inventado, y quién las ve. Las de Mario, en la ficha de 3.º B: «Instrucciones por escrito y más tiempo». Añade un aviso: «Pablo Sanz verá la pauta de Mario en su ficha de la 6.ª hora; queda registrado».
- `traduccion`: E11 para la familia de Amira: lectura fácil e inglés.

### `sustituto` · Pablo Sanz · orden 6

**Inicio:**

- tu jornada: tus sesiones de apoyo y las dos que cubres;
- tus fichas: se abren antes de cada sesión;
- un aviso: «La ficha se cierra al acabar la jornada».

**Correo (3-4):**

1. Jefatura: «Hoy cubres 1.ª y 6.ª en 3.º B».
2. Laura Sánchez: pide material de Educación Física para el jueves.
3. La coordinadora de ciclo, con la reunión de ciclo del martes.

No hay correos de familias.

**Módulos:**

- `ficha` (ficha, `bandera: 'guardias'`): la de 6.ª y la de 1.ª (E2), con el registro.
- `jornada` (plazos): tu horario de hoy como plazos con hora; los estados según la hora: 9:00 «pronto», etc.
