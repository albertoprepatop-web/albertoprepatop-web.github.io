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
- **1.º ESO A:** Nora D.
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
- los datos del caso nunca se envían a Claude;
- el expediente del caso (anexos, guiones y citaciones) se prepara con las plantillas del protocolo y no pasa por la IA. Por correo, solo el número del caso.

**Decisiones:** DirectorIA guía, recuerda y prepara los documentos con las plantillas del protocolo. Si hay acoso, y con qué medidas, lo decide el equipo del centro.

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

Al subir un recurso, el curso y la materia son obligatorios. Declarar que está hecho con IA es voluntario: si se marca, el recurso lleva la etiqueta «Hecho con IA y revisado».

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
- **En el Inicio:** ningún dato de salud de nadie (ni «fiebre», ni alergias, ni diagnósticos): basta con «Sergio Prieto no viene». «Alumno/a A» solo sale en el de orientación, que es el equipo del caso; los demás nombran el Caso 2026-07 solo por su número. `validar.mjs` lo comprueba en todos los textos del Inicio.

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
- `'<módulo>'`: hecho cuando el módulo está terminado (documento firmado o con el visto bueno, dictado enviado, tabla aprobada, todas las propuestas confirmadas, todos los plazos hechos…);
- `'<módulo>#<elemento>'`: una propuesta de `aprobaciones` (por su id, `guardias#g1`) o un plazo de `plazos` (por su posición, desde 0: `plazos#3`);
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
    // («La citación y el acta del claustro»); si queda uno, dice su «texto». La acción y el destino son los del primero
    // que queda. «ir» es obligatorio también en la cifra: es adonde lleva cuando ya no queda nada pendiente.
    { etiqueta: 'Pendiente de tu firma', icono: 'firma', ir: 'firma',
      pendientes: [
        { texto: 'La citación del Caso 2026-07', corto: 'la citación', sigue: 'firma', ir: 'firma', hoy: true, accion: 'Revisar y firmar', accionCorta: 'Firmar' },
        { texto: 'El acta del claustro del lunes 16', corto: 'el acta del claustro', sigue: 'acta', ir: 'acta', accion: 'Dar el visto bueno', accionCorta: 'Visto bueno' },
      ],
      alTerminar: 'Todo firmado', accionHecha: 'Ver lo firmado' },

    // Progreso «X de Y», con el medidor rotulado por la cifra. Vale:
    // - un documento con «documentos»: cuenta las piezas listas; el medidor pinta las listas (rellenas), las que hay que
    //   revisar (solo con borde) y las que faltan (borde discontinuo), en ese orden; el globo da las piezas en su orden;
    // - un protocolo con «pasos»: el paso en curso («4 de 9», rotulado «en curso»); el medidor pinta los pasos hechos,
    //   el que está en curso (con borde), los pendientes (vacíos) y los que solo van si se confirma (discontinuo);
    // - un dictado: los pasos Dictar, Revisar y Enviar; ya dictado, la nota y la acción son las de «siDictado»
    //   (si no, «Ya lo has dictado. Te queda revisar el correo y enviarlo tú.» y «Revisar y enviar»);
    // - aprobaciones o plazos: los hechos de todos.
    // rotulo: lo que se cuenta («listas» en un dosier y «en curso» en un protocolo, por defecto).
    { etiqueta: 'Dosier para inspección', icono: 'carpeta', progreso: 'dosier', nota: 'Falta el acta de 2.º ESO A y revisar el escrito de remisión.',
      ir: 'dosier', accion: 'Revisar el dosier', accionCorta: 'Revisar', alTerminar: 'Visto bueno dado', accionHecha: 'Ver el dosier' },
    { etiqueta: 'Tutoría de Daniel M.', icono: 'microfono', progreso: 'dictado', hoy: true, nota: '...', ir: 'dictado', accion: 'Empezar a dictar', accionCorta: 'Dictar',
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
  // El globo de una cifra (las piezas del dosier, los pasos del caso) sale con el ratón al detenerse en la cifra o en su
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
      { grupo: 'Hoy', icono: 'firma', titulo: 'Caso 2026-07: citación a la familia', detalle: '...', estado: 'hoy', ir: 'firma', sigue: 'firma', verbo: 'Firmada' },
      { grupo: 'Hoy', icono: 'microfono', titulo: 'Tutoría con la familia de Daniel M.', detalle: '...', estado: 'hoy', ir: 'dictado', sigue: 'dictado', siDictado: { detalle: 'Ya la has dictado. Te queda revisar el correo y enviarlo.' } },
      { grupo: 'Esta semana', icono: 'correo', titulo: 'AMPA: fecha del festival de Navidad', detalle: '...', estado: 'pendiente', choque: true, ir: 'correo:c-ampa', sigue: 'correo:c-ampa' },
      { grupo: 'Para saber', icono: 'documento', titulo: '...', detalle: '...', estado: 'info', sigue: 'secretaria/certificados', si: { detalle: '...', estado: 'info' } },
    ],
  },
  // 1-10 · grupo ≤ 20 · titulo ≤ 70 · detalle ≤ 130 · fecha ≤ 12 (opcional: una etiqueta a la derecha) · verbo ≤ 24
  // estado: hoy | pendiente | info | hecho. Cada grupo lleva el recuento de lo que queda por hacer («Hoy · 3»), que baja
  //   al hacer cosas: cuenta las filas en hoy y pendiente. Las filas para saber solo cuentan en un grupo que es todo para
  //   saber («Para saber · 1»). Con dos grupos muy desiguales (cuatro filas y dos), el que tiene más va más ancho.
  // Lo pendiente va arriba; lo hecho baja al final del grupo, con su verbo y su hora («Firmada a las 8:05»). Sin «verbo»:
  //   «Respondido» o «Enviado» si sigue un correo, «Enviado» si sigue un dictado y, si no, «Hecho»; «Archivado» si el correo
  //   se archivó.
  // si: lo que cambia cuando lo seguido está hecho (titulo, detalle y estado, que por defecto es «hecho»). Hecha sin
  //   «si.detalle», la fila no repite su detalle, que suele decir lo que había que hacer («Revísala y fírmala»).
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
      { fecha: '2026-11-27', tipo: 'aviso', choque: true, titulo: 'Tu guardia de 3.ª hora y la salida', detalle: '...', fuente: 'correo', ir: 'plazos', sigue: 'plazos#6' },
      // Un «si» con estado 'pendiente' cambia el texto sin dar la marca por hecha (lo que contesta otro perfil, por ejemplo).
      { fecha: '2026-11-19', hora: '11:45', tipo: 'evento', titulo: '...', detalle: '...', sigue: 'jefatura/correo:c-laura', si: { detalle: '...', estado: 'pendiente' } },
      // Una lista en «sigue»: hecho cuando lo están todas (el visto bueno y la respuesta que adjunta el dosier). Aun así no pasa
      // a ✓ («si» con estado 'pendiente'): esa respuesta lo envía sin el acta de 2.º ESO A. Lo que va hacia ello, a medias
      // (vale la primera que está hecha).
      { fecha: '2026-11-23', tipo: 'plazo', titulo: 'Dosier para inspección', detalle: 'Envíalo antes de este día. Falta el acta de 2.º ESO A.', fuente: 'correo', ir: 'dosier',
        sigue: ['dosier', 'correo:c-inspeccion#1'],
        si: { detalle: 'Enviado sin el acta de 2.º ESO A. Esa acta, antes de este día.', estado: 'pendiente' },
        aMedias: [
          { sigue: 'correo:c-inspeccion#1', detalle: 'Enviado sin el acta de 2.º ESO A y sin tu visto bueno al dosier. Esa acta, antes de este día.', ir: 'dosier' },
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
  // Un plazo solo pasa a ✓ con lo que lo cumple: si una respuesta no lo cumple (las de la reclamación del comedor dejan el
  //   fondo para después), usa «si» con estado 'pendiente' o sigue la respuesta que sí lo cumple ('correo:<id>#<n>') con
  //   «aMedias» para lo demás.
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
- Al menos uno tiene que ser de una familia, salvo en `sustituto`.
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
  pie: 'DirectorIA guía, recuerda y prepara los documentos con las plantillas del protocolo. Si hay acoso, y con qué medidas, lo decide el equipo del centro. El expediente del caso no pasa por la IA.', // ≤ 220 caracteres
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
    casillas: ['Sin fotos ni datos de alumnos', 'Es mío o puedo compartirlo'], // 2-3: obligatorias para compartir
    declaracion: 'Lo he hecho con IA y lo he revisado', // opcional: casilla voluntaria; si se marca, el recurso lleva «Hecho con IA y revisado»
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
  bloqueo: { intento: 'Adáptala para Daniel, que ...', mensaje: 'He quitado «Daniel»: en el módulo de Claude no se escriben datos de alumnos. Escríbelo sin nombres.' },
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
      origen: 'Preparada por DirectorIA para Pablo Sanz', // sin insignia: sale de reglas y plantillas (§4)
      datos: [ { dt: 'Tarea', dd: '...' }, { dt: 'Salud', dd: '...', aviso: true } ],
      pie: 'Se abre antes de la sesión y se cierra al acabar la jornada. Queda registrado quién la ve.',
    },
  ],
  registro: ['Vista previa abierta por Javier Martín (jefatura) hoy a las 7:56'], // opcional: accesos anteriores. Con bandera, el motor añade antes «Abierta por <persona> hoy a las <hora>», con la hora de la demo
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

**Inicio: «Tu resumen de las 8:00»**, como panel de mando (6.2 bis), con la ilustración de la directora (la propia de la demo, con el ✓ de «al día» en la tableta y sin la insignia de la IA):

- **Cifras:**
  - Pendiente de tu firma: 2, la citación del Caso 2026-07 (hoy) y el acta del claustro. La nota dice «La citación y el acta del claustro». Con las dos hechas, «Todo firmado» y «Ver lo firmado», que lleva a la citación (`ir: 'firma'`).
  - Correos por responder: 5, resumidos con IA. Sin ninguno por responder, «Al día».
  - Fotocopiadoras: «3 días», «para avisar, antes del sáb 21». La cuenta atrás va de miércoles a viernes: el preaviso del contrato es antes del sábado 21 (E6). Solo lo cumple la 2.ª respuesta propuesta, «Comunicar el preaviso» (`sigue: 'correo:c-fotocopiadoras#1'`): entonces, «Preaviso enviado» y la hora. Con otra respuesta (la que sale elegida, «Pedir la oferta por escrito», o «Proponer una reunión el jueves»), la cuenta atrás sigue y la nota dice «Has respondido sin el preaviso. Si no avisas, se renueva solo el 1 de diciembre.». Si se archiva el correo, también sigue: «Archivado sin avisar. Si no avisas, el contrato se renueva solo el 1 de diciembre.» (`aMedias`).
  - Dosier para inspección: «6 de 8 listas». Hay seis piezas listas, el escrito de remisión por revisar y el acta de 2.º ESO A, que falta. El medidor va en ese orden; el globo da las ocho piezas en el orden del dosier. Con el visto bueno, «Visto bueno dado».
- **Quién cubre 3.º B hoy:** cada sesión de 3.º B, con la persona que la cubre. Sigue a `jefatura/guardias`, también a la persona que elija jefatura en el desplegable («Elección: Rosa Medina» y, al confirmar, «Cubre Rosa Medina · Confirmada a las 8:01»). «Confirmar todas» deja todas a la misma hora. Mientras falten guardias, «Las guardias las confirma jefatura.» y el atajo a la propuesta. Si jefatura las confirma una a una, la línea dice cuántas lleva: «Jefatura ha confirmado 2 de 4. Hasta que confirme las demás, no se avisa a quien las cubre.», con el atajo (`parcial`). La salida de las 16:00 la hace quien cubre la 6.ª.
- **Lo que te necesita:**
  - Hoy: confirmar la visita a Inspección y la citación (solo «Caso 2026-07: citación a la familia»).
  - Esta semana: el acta y el choque del festival del AMPA con las sesiones de evaluación.
  - Para saber: el certificado de Nora D. (1.º ESO A), que sigue a `secretaria/certificados`. Cuando secretaría lo pasa a la firma, sigue siendo para saber: «Carmen López lo ha pasado a la firma y te lo lleva para tu visto bueno.» (en dirección no hay un módulo para firmarlo).
- **Lo que viene.** Cada plazo pasa a ✓ solo con lo que lo cumple; lo que va hacia ello lo dice sin el ✓ (`aMedias`):
  - sáb 21: fotocopiadoras, avisar antes de este día (sale del analista de gastos, sin insignia). Sigue a la respuesta del preaviso (`#1`): «Preaviso enviado a las…». Con otra respuesta, lo mismo que dice la cifra: «Has respondido sin el preaviso. Si no avisas, se renueva solo el 1 de diciembre.»;
  - lun 23: el dosier, sacado del correo de Inspección: «Envíalo antes de este día. Falta el acta de 2.º ESO A.». Sigue a dos cosas a la vez (`['dosier', 'correo:c-inspeccion#1']`): el visto bueno y la respuesta que lo adjunta, «Confirmar y enviar ya el dosier». Ni así pasa a ✓, porque esa respuesta lo envía «salvo la de 2.º ESO A, que le enviaré antes del lunes 23»: «Enviado sin el acta de 2.º ESO A. Esa acta, antes de este día.» (un `si` con estado `pendiente`). A medias:
    - enviado sin el visto bueno: «Enviado sin el acta de 2.º ESO A y sin tu visto bueno al dosier. Esa acta, antes de este día.», con el enlace al dosier;
    - con otra respuesta (confirmar la visita o preguntar por los horarios), que no lo adjunta: «Has confirmado la visita sin el dosier. Envíaselo antes de este día.»;
    - con el visto bueno y el correo sin responder: «Visto bueno dado. Falta enviarlo a Inspección desde el correo.», con el enlace al correo;
  - jue 26: la visita de inspección a las 10:00;
  - vie 27: la reclamación del comedor («Familia de 5.º A: respóndeles antes de este día…») y la salida de 4.º a las 9:15. Las tres respuestas propuestas dejan el fondo para después, así que contestar no cumple el plazo: «Ya les has contestado. La respuesta por escrito, antes de este día.» (un `si` con estado `pendiente`);
  - lun 30: el corte de la calle y los exámenes de ESO, con el calendario de «Cita, salida o fecha». El corte sigue a la circular a las familias (`correo:c-ayuntamiento#0`): «Enviado a las…». Si se responde al Ayuntamiento para pedir paso seguro, la circular, que era la otra respuesta del mismo correo, ya no se puede enviar desde ahí: «De 7:00 a 19:00. Has escrito al Ayuntamiento; falta avisar a las familias.»; archivado, sigue igual.

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

**Inicio:** panel de mando (6.2 bis), con la ilustración del jefe de estudios. La entradilla vale antes y después de confirmar: «Sergio Prieto no viene. Tú confirmas quién cubre sus sesiones; hasta entonces, no se avisa a nadie.»

- **Cifras:**
  - Guardias confirmadas: «0 de 4», hoy y en pizarra. Son las cuatro propuestas de «Guardias de hoy»: tres sesiones con 3.º B y el turno de patio de Sergio. Al confirmarlas, «Todas».
  - Correos por responder: 4, resumidos con IA. Sin ninguno por responder, «Al día».
  - Exámenes de ESO: «1 choque», el de 4.º ESO A el miércoles 2. Pasa a «Sin choques» al aprobar el calendario.
  - Programaciones de ESO: «2 incompletas», Educación Física y Música. Pasa a «Ya lo has pedido» al pedir lo que falta.
- **Quién cubre 3.º B hoy:** el mismo carril que dirección, pero siguiendo su propio módulo (`guardias#g1`…`g4`). Mientras falten guardias, una línea recuerda que en «Guardias de hoy» se puede elegir a otra persona para cada sesión antes de confirmar. Si jefatura elige a otra persona en el desplegable, la celda la enseña ya antes de confirmar («Elección: Rosa Medina») y, después, «Cubre Rosa Medina · Confirmada a las 8:01». «Confirmar todas» deja todas a la misma hora. Como lo confirma él, los globos le hablan de tú: «Falta que la confirmes», «Has elegido a Rosa Medina. Falta que lo confirmes» y «La has confirmado a las 8:01». Si confirma una a una, la línea dice «Has confirmado 2 de 4. Hasta que confirmes las demás, no se avisa a quien las cubre.» (`parcial`).
- **Lo que te necesita:**
  - Hoy: las fichas de 1.ª, 3.ª y 6.ª hora de 3.º B, que pasan a «Enviadas» al confirmar las guardias, y el cambio de guardia que pide Laura Sánchez. Va como choque: la vuelta que ofrece, el viernes 27 a 3.ª hora, coincide con la salida de 4.º (en docente, el mismo choque).
  - Esta semana: la familia de 2.º ESO A que pide cambiar de optativa.
  - Para saber: la nota de la Consejería. Las calificaciones, en Raíces antes del viernes 18 de diciembre.
- **Lo que viene:**
  - jue 19 y vie 20: «Caso 2026-07: entrevistas», del equipo del caso (solo el número);
  - vie 20: contestar a Matemáticas con la fecha del examen de 4.º ESO («Respóndele a Ramón Esteban antes de este día: quieren decírselo a los alumnos esta semana.»), sacado del correo. Lo cumplen las dos respuestas que dan fecha (`correo:c-matematicas#0,1`); la que pregunta antes si el examen es de una sesión no la da: «Le has preguntado a Matemáticas. La fecha, antes de este día.»;
  - vie 27: la salida de 4.º al Jardín Botánico a las 9:15, con Laura Sánchez;
  - lun 30: empiezan los exámenes de ESO;
  - mié 2 dic: el choque de 4.º ESO A, con Matemáticas e Inglés el mismo día. Al aprobar el calendario pasa a ✓: «Inglés de 4.º ESO A, al jueves 3».

**Correo (5):**

1. Sergio Prieto, a las 7:45: «No voy a poder ir hoy». Respuestas: «Recupérate; tu clase está cubierta» y otras.
2. La familia de un alumno de 2.º ESO pide cambiar de optativa, de Francés a Tecnología. Respuesta propuesta según el plazo del centro.
3. El Departamento de Matemáticas propone fecha para el examen de 4.º ESO; enlaza con exámenes.
4. Laura Sánchez pide cambiar su guardia del jueves.
5. La Consejería avisa de las instrucciones sobre las sesiones de evaluación. Informativo.

**Módulos:**

- `guardias` (aprobaciones, `bandera: 'guardias'`): E1. Los items de 3.º B que llevan ficha, con `ficha: true`.
- `fichas` (ficha, vista previa de lo que reciben quienes sustituyen): la de 6.ª y la de 1.ª, de Pablo Sanz, y la de 3.ª, de Rosa Medina. Las tres llevan la pauta de Mario y la alergia de Lucía. Como las de Pablo, siguen la propuesta inicial: si jefatura elige a otra persona (Rosa Medina en el recreo, por ejemplo), la de 3.ª sigue diciendo «Hoy vigila Teresa Gil». En la demo no se abren después de cambiar la propuesta (lo dicen «Guardias de hoy» y el README).
- `examenes` (tabla): calendario de la 1.ª evaluación de ESO, del lun 30 nov al vie 4 dic. Un choque en 4.º ESO A el miércoles 2, con la propuesta de moverlo. Botón para aprobar.
- `programaciones` (tabla): estado de las programaciones por departamento frente al modelo del centro. Dos con apartados que faltan; por ejemplo, «evaluación de la práctica docente».

### `secretaria` · Carmen López · orden 3

**Inicio:** panel de mando (6.2 bis), con la ilustración de la secretaria: la propia de la demo, una mujer de unos 60 con el sello del centro (6.2 bis). Va sin el día por sesiones: su trabajo no sigue el horario de Primaria. La entradilla: «Certificados, gastos, plazos y revisiones del edificio. Nada se envía ni se firma sin ti.»

- **Cifras:**
  - Certificados por revisar: 1, hoy y en pizarra. Es el de matrícula de Nora D. (1.º ESO A, E8), que su familia necesita antes del viernes 20. Pasa a «Pasado a la firma» con la hora, y en dirección la fila del certificado cambia a la vez.
  - Correos por responder: 5, resumidos con IA. Sin ninguno por responder, «Al día».
  - Informe de gastos: «5 avisos para dirección», los del informe de octubre (E6). La nota da el más urgente: las fotocopiadoras, que dirección decide antes del sábado 21. Pasa a «Enviado» al enviar el informe.
  - Fotos del festival: «3 alumnos sin autorización», los de E9. Pasa a «Lista enviada» al enviar la lista a las tutorías.
- **Lo que te necesita:**
  - Esta semana: la familia de Iker P., que quiere cambiar su autorización; los extintores, como choque, y el acuse de recibo de la estadística («Estadística: acusa recibo a la Consejería»). También la comisión de mantenimiento del banco. Las cuatro salen de correos y llevan «Resumido con IA». Con cuatro filas aquí y dos en «Para saber», este grupo va más ancho.
  - El choque de los extintores: la empresa propone el jueves 26, de 9:00 a 12:00, cuando llega la inspección (E4), o el martes 24 por la tarde, que Carmen tiene libre. Al responder, la fila pasa a «Extintores: el día de la revisión».
  - Para saber: la inspección del ascensor (vie 15 ene) y la caldera, «Hecha el lun 2 nov».
- **Lo que viene,** en cuatro semanas, hasta los electrodos. Cada plazo sigue a su línea de «Circulares y plazos»:
  - vie 20: las autorizaciones de la salida, que las tutorías de 4.º traen antes de las 14:00 (sacado de la circular). Al marcarlo: «Recogidas a las…»;
  - jue 26: la visita de inspección a las 10:00. Es una fecha del colegio: secretaría no tiene ese correo, así que va sin insignia;
  - vie 27: la estadística, que se sube antes de ese día (sacado de la circular);
  - lun 30: vence la revisión de los extintores, que sale del calendario de mantenimiento y va sin insignia. Cuando Carmen responde a la empresa, el detalle lo dice y el plazo sigue pendiente (si archiva el correo, no cambia). Ese día, además, cortan la calle de 7:00 a 19:00 y hay que avisar a los proveedores. En «Circulares y plazos» sale «De: Aviso del Ayuntamiento», sin IA, así que aquí también va sin insignia;
  - sáb 12 dic: caducan los electrodos del desfibrilador (calendario de mantenimiento). Al marcarlo: «Recambio pedido a las…».

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

**Inicio:** panel de mando (6.2 bis), con la ilustración de la docente:

- **Cifras:**
  - la tutoría de Daniel M., hoy, con sus pasos (dictar, revisar y enviar) y la nota «Dicta la propuesta para su familia. Te llega redactada para revisar.». Ya dictada, «Por revisar», con la nota «Ya lo has dictado. Te queda revisar el correo y enviarlo tú.» y la acción «Revisar y enviar» (`siDictado`); enviada, «Enviado». Si se sale del dictado mientras escucha, al volver sigue escuchando;
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
  - Hoy: las dos familias (resumidas con IA) y la tutoría: «Dicta el correo y te llega redactado para revisar.»; ya dictada, «Ya lo has dictado. Te queda revisar el correo y enviarlo.».
  - Esta semana: el choque de la guardia del viernes 27 con la salida. Sale de su correo a jefatura del martes 17, como en «Tus plazos» («Sacado con IA»), así que lleva la insignia. Su texto vale antes y después de que jefatura conteste (las dos respuestas piden otro día para la vuelta): «Es la que ofreciste a Rosa Medina a cambio de la de mañana. Cierra con ella y con jefatura qué día se la devuelves.».
  - Para saber: el plan de lectura.
- **Lo que viene,** de «Tus plazos»:
  - jue 19: la tutoría de las 11:45, que coincide con su guardia: «Coincide con tu guardia. Pediste a jefatura que la haga Rosa Medina y aún no te ha contestado.». Sigue al correo de Laura en jefatura (`jefatura/correo:c-laura`): cuando jefatura lo responde (las dos respuestas aprueban el cambio del jueves), dice «Coincide con tu guardia. Jefatura ya ha aprobado que la haga Rosa Medina.»; si lo archiva, sigue sin contestar;
  - vie 20: la programación quincenal y las autorizaciones. Al marcarlas en «Tus plazos», «Entregada a las…» y «Entregadas a las…»;
  - vie 27: la salida a las 9:15 y el choque con su guardia de 3.ª hora (sacado del correo): «Cierra con Rosa Medina y con jefatura qué día se la devuelves.»;
  - vie 4 dic: los títulos para el lote de lectura. Al marcarlo, «Pedidos a las…».

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

**Inicio:** panel de mando (6.2 bis), con la ilustración del orientador: la propia de la demo, un hombre con gafas y el bocadillo con el corazón (6.2 bis). Aquí sí salen el Caso 2026-07 con su paso y Alumno/a A: es el perfil del equipo del caso. Va sin el día por sesiones: las entrevistas no siguen el horario de Primaria. La entradilla: «El Caso 2026-07, tus entrevistas, las pautas y la circular de Amira. Nada se envía sin ti.»

- **Cifras:**
  - Entrevista de hoy: «10:15», hoy y en pizarra, con Alumno/a A en su despacho. El guion ya está revisado. En el móvil, la acción es «Repasar».
  - Paso del Caso 2026-07: «4 de 9», rotulado «en curso»: la recogida de información (Anexo II), hasta el lunes 23. Es un progreso del protocolo (`progreso: 'acoso'`): el medidor tiene un tramo por paso, con los tres hechos rellenos, el 4.º con borde, los pendientes vacíos y los tres que solo van si se confirma con borde discontinuo. El globo da los nueve pasos con su estado.
  - Correos por responder: 4, resumidos con IA. Sin ninguno por responder, «Al día».
  - Circular adaptada: «Por enviar». Es la de la salida, en lectura fácil y en inglés, para la familia de Amira (E11). Pasa a «Enviada» al enviarla.
- **Lo que te necesita:**
  - Hoy: el guion que pide Nuria Castro y la reunión que pide la madre de Mario. Salen de correos y llevan «Resumido con IA».
  - Esta semana: la convocatoria de la reunión del martes 24 (Anexo III), lista para revisar. Sale de la plantilla del protocolo y va sin insignia.
  - Para saber: la citación a la familia de Alumno/a A, que sigue a `direccion/firma` y pasa a «Firmada por la directora a las…», con el detalle «Para el viernes 20 a las 17:00.». También la pauta de Mario, que sigue a `jefatura/guardias` y pasa a «Guardias confirmadas a las…»; no nombra a nadie, porque jefatura puede elegir a otra persona. Y la pauta de Amira, «Actualizada el lun 16».
- **Lo que viene,** del calendario del protocolo (sin insignia):
  - jue 19: el alumnado observador por la mañana y el profesorado del grupo, de 15:00 a 17:00;
  - vie 20: el alumnado observador por la mañana y la familia de Alumno/a A a las 17:00, en su despacho;
  - lun 23: termina la recogida de información, con el alumnado mencionado y sus familias. El Anexo II, completo por la tarde;
  - mar 24: la reunión para la toma de decisiones (Anexo III);
  - lun 30: las pautas para 2.º ESO B que pide Beatriz Romero (sacado del correo). Solo las envía la 1.ª respuesta propuesta (`correo:c-beatriz#0`): «Enviadas a las…». Con las otras dos (ver una clase antes, preparar juntos una hoja), «Ya has contestado a Beatriz Romero. Las pautas, antes de este día.». Si se archiva su correo sin responder, el plazo sigue en pie.

**Correo (5):**

1. Nuria Castro, coordinadora de bienestar: recordatorio de las entrevistas del Caso 2026-07. Interno: solo el número del caso.
2. La madre de Mario (3.º B) pide una reunión para hablar de cómo va.
3. Beatriz Romero, tutora de 2.º ESO B, pide pautas de organización para el aula, sobre otro tema: un alumno con dificultades de atención y sin diagnóstico. Sin nombres.
4. Laura Sánchez: la familia de Amira prefiere el inglés y le pide que revise la circular → traducción.
5. Un centro de formación, con un curso de lectura fácil. Informativo.

**Módulos:**

- `acoso` (protocolo, `confidencial`): E3 completo.
- `pautas` (tabla): pautas para el aula por grupo y alumno, con nombre de pila inventado, y quién las ve. Las de Mario, en la ficha de 3.º B: «Instrucciones por escrito y más tiempo». Añade un aviso: «Pablo Sanz (1.ª y 6.ª hora) y Rosa Medina (3.ª hora) verán la pauta de Mario en sus fichas de 3.º B; queda registrado».
- `traduccion`: E11 para la familia de Amira: lectura fácil e inglés.

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
  - Hoy: el material que le pide Laura Sánchez (resumido con IA) y la salida de 3.º B a las 16:00. A las 8:00 es para saber: «16:00: te proponen para la salida de 3.º B», «Va con la 6.ª. Cuando jefatura lo confirme, lee el aviso de recogida de tu ficha de 6.ª.», y no suma en el recuento («Hoy · 1»). Con las guardias confirmadas, «16:00: haces tú la salida de 3.º B», con el aviso de recogida de la ficha de 6.ª, y ya cuenta («Hoy · 2»).
  - Esta semana: un choque. Desde enero se lee de 14:30 a 14:50 en toda Primaria y sus apoyos de 5.ª empiezan a las 14:30; lo tiene que tener en cuenta en la propuesta para Pilar Serrano (lo dicen los correos de Pilar y de dirección). Lo resuelven las respuestas a Pilar que hablan de la lectura (`correo:c-ciclo#0,2`: empezar los apoyos a las 14:50 o preguntarle cómo encajarla). Si solo le pide más tiempo (la 2.ª), sigue el choque: «Le has pedido a Pilar Serrano más tiempo. Tenlo en cuenta en tu propuesta.» (`aMedias`).
  - Para saber: la ficha se abre antes de cada sesión, se cierra al acabar la jornada y queda registrado quién la ve.
- **Lo que viene,** del correo de Pilar Serrano:
  - vie 20: la propuesta de apoyos para enero, antes de este día;
  - mar 24: la reunión del 2.º ciclo, de 16:15 a 17:15.
- **Si jefatura da a otra persona la 1.ª (g1) o la 6.ª y la salida (g4)** (`siOtra`):
  - esas celdas dicen «Por confirmar · Elección: Rosa Medina» y, confirmadas, pasan a aviso: «Ya no la cubres · La cubre Rosa Medina». Salen de su recuento («1 de 1 confirmadas»);
  - sin la 1.ª, su primera sesión es el apoyo de 2.ª: «9:45», «Apoyo de lectoescritura con 1.º B. Jefatura ha elegido a otra persona para la 1.ª.», con «Ver tu jornada»;
  - las fichas: «1 por llegar», con la nota que dice cuál y para cuál ha elegido jefatura a otra persona («Ya la tienes» al confirmar). Sin ninguna de las dos, «Ninguna», sin darse por hecha y con «Ver tu jornada» (`siNinguna`);
  - la línea del carril dice qué ha elegido jefatura y qué le queda por confirmar o ha confirmado: «Para la 1.ª, jefatura ha elegido a otra persona. Ha confirmado que cubres la 6.ª y la salida.» (con la 3.ª, si jefatura se la da a él, en un intercambio);
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

- `ficha` (ficha, `bandera: 'guardias'`): la de 6.ª y la de 1.ª (E2), con el registro.
- `jornada` (plazos): tu horario de hoy como plazos con hora; los estados según la hora: 9:00 «pronto», etc.
