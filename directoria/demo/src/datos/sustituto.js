DEMO.rol({
  id: 'sustituto',
  orden: 6,
  persona: {
    nombre: 'Pablo Sanz',
    cargo: 'Profesor que sustituye',
    detalle: 'Maestro de apoyo de Primaria · hoy cubre dos sesiones',
    ilustracion: 'sustituto',
  },
  acceso: 'Fichas de sustitución de 3.º B, jornada de hoy y correo resumido',

  // ───────────────────────────── Inicio ─────────────────────────────
  // Panel de mando (6.2 bis). Lo que cubre Pablo sigue a «Guardias de hoy» de jefatura.
  // Cifras, día y calendario salen de reglas y de los datos del colegio: sin insignia de IA.
  // Las filas que resumen un correo y los plazos sacados de un correo llevan la insignia (la pone el motor).
  // Los textos de base son los de las 8:00, antes de que jefatura confirme; lo de después va en «siConfirmada».
  // Si jefatura elige a otra persona para la 1.ª (g1) o para la 6.ª y la salida (g4), lo que cambia va en «siOtra»:
  // la celda pasa a «Ya no la cubres», sale de tu recuento, y la cifra, el carril y la fila de la salida lo dicen.
  // Si jefatura te elige a ti para la 3.ª (g2) o para el recreo (g3), la sesión sale en tu día («siElegido»).
  inicio: {
    antetitulo: 'Miércoles 18 de noviembre · 8:00',
    titulo: 'Buenos días, Pablo',
    // No da por hecho lo que decide jefatura: vale antes y después de que confirme, y si elige a otra persona.
    entradilla: 'Sergio Prieto no viene hoy. Aquí tienes tu jornada. Nada se envía sin ti.',

    cifras: [
      {
        // Un valor, la hora, que la etiqueta ya rotula. Sin rótulo para que la hora y «Hoy» quepan en una línea en media
        // tarjeta del móvil. A las 8:00 es una propuesta: la ficha aún no ha llegado, así que la acción lleva a tu jornada
        // y la cifra no se puede dar por hecha. Cuando jefatura confirma las guardias (siConfirmada), te pide leer la
        // ficha y está hecha cuando marcas en «Tu jornada» que la has leído.
        etiqueta: 'Tu primera sesión',
        icono: 'reloj',
        valor: '9:00',
        hoy: true,
        nota: 'Te proponen para Lengua con 3.º B. Tu ficha llega cuando jefatura confirme las guardias.',
        ir: 'jornada',
        accion: 'Ver tu jornada',
        accionCorta: 'Tu jornada',
        alTerminar: 'Ficha leída',
        accionHecha: 'Ver tu ficha',
        siConfirmada: [
          { cuando: 'jefatura/guardias', nota: 'Lengua con 3.º B, en tu hora de guardia. Lee su ficha antes de entrar.', sigue: 'jornada#0', ir: 'ficha', accion: 'Leer tu ficha de 1.ª', accionCorta: 'Leer la ficha' },
          { cuando: 'jefatura/guardias#g1', nota: 'Cubres Lengua con 3.º B. Tu ficha llega cuando jefatura confirme las demás guardias.' },
        ],
        // Si la 1.ª es para otra persona, tu primera sesión es el apoyo de 2.ª.
        siOtra: [
          { cuando: 'jefatura/guardias#g1', valor: '9:45', nota: 'Apoyo de lectoescritura con 1.º B. Jefatura ha elegido a otra persona para la 1.ª.', sigue: 'jornada#2', ir: 'jornada', accion: 'Ver tu jornada', accionCorta: 'Tu jornada', alTerminar: 'Hecha', accionHecha: 'Ver tu jornada' },
        ],
      },
      {
        // Las fichas que te llegan: una por cada sesión de «Guardias de hoy» con ficha que es tuya, porque DirectorIA te
        // la proponía o porque jefatura te ha elegido (las cuenta el motor). Llegan juntas cuando jefatura confirma.
        etiqueta: 'Tus fichas de hoy',
        icono: 'documento',
        fichas: 'jefatura/guardias',
        rotulo: 'por llegar',
        ir: 'ficha',
        accion: 'Ir a tus fichas',
        alTerminar: 'Ya las tienes',
        alTerminarUna: 'Ya la tienes',
        accionHecha: 'Ver tus fichas',
        // Sin ninguna (jefatura ha elegido a otras personas): la cifra no se da por hecha, dice «Ninguna» y lleva a tu jornada.
        siNinguna: { valor: 'Ninguna', nota: 'Jefatura ha elegido a otra persona para la 1.ª y para la 6.ª de 3.º B.', ir: 'jornada', accion: 'Ver tu jornada' },
      },
      {
        etiqueta: 'Correos por responder',
        icono: 'correo',
        cuenta: 'correo',
        accion: 'Abrir el correo',
        alTerminar: 'Al día',
      },
    ],

    // Tu jornada por sesiones (horario de Primaria). Las dos de 3.º B y la salida siguen a jefatura:
    // «Por confirmar · Propuesta: tú» y, al confirmarlas, «Cubres tú · Confirmada a las 8:0x».
    dia: {
      titulo: 'Tu jornada',
      carriles: [
        {
          titulo: 'Tus sesiones',
          // Los textos del carril dicen lo que hay de verdad en tu día: el motor rellena {clases} (los apoyos que te quedan:
          // con la 3.ª de 3.º B, tu apoyo de 3.º A queda sin hacer), {hechas} y {faltan} (lo que cubres, confirmado o no:
          // «la 1.ª, la 3.ª, la 6.ª y la salida»), también si jefatura te elige para otra sesión (siElegido).
          detalle: '{Clases} apoyos y lo que cubres de Sergio',
          icono: 'clase',
          cuenta: 'confirmadas',
          pendiente: 'DirectorIA te propone para cubrir a Sergio Prieto. Jefatura lo está revisando.',
          parcial: 'Jefatura ha confirmado que cubres {hechas}. {Faltan}, por confirmar.',
          alTerminar: 'Jefatura ha confirmado que cubres a Sergio Prieto: {hechas}.',
          // Si jefatura da a otra persona lo que te proponía. Si te lo quita todo y no te elige para nada, siNinguna.
          siOtra: [
            { cuando: ['jefatura/guardias#g1', 'jefatura/guardias#g4'], pendiente: 'Para la 1.ª, la 6.ª y la salida, jefatura ha elegido a otra persona. {Faltan}, por confirmar.', alTerminar: 'Para la 1.ª, la 6.ª y la salida, jefatura ha elegido a otra persona. Ha confirmado que cubres {hechas}.' },
            { cuando: 'jefatura/guardias#g1', pendiente: 'Para la 1.ª, jefatura ha elegido a otra persona. {Faltan}, por confirmar.', alTerminar: 'Para la 1.ª, jefatura ha elegido a otra persona. Ha confirmado que cubres {hechas}.' },
            { cuando: 'jefatura/guardias#g4', pendiente: 'Para la 6.ª y la salida, jefatura ha elegido a otra persona. {Faltan}, por confirmar.', alTerminar: 'Para la 6.ª y la salida, jefatura ha elegido a otra persona. Ha confirmado que cubres {hechas}.' },
          ],
          siNinguna: { detalle: 'Cuatro apoyos. En 3.º B no cubres nada.', linea: 'Jefatura ha elegido a otra persona para la 1.ª y para la 6.ª de 3.º B. Tus apoyos no cambian.' },
          // Si jefatura te elige para una sesión que DirectorIA proponía a otra persona, sale en su franja, en lugar de lo que
          // tenías a esa hora, y cuenta en tu recuento. El aviso, bajo el día.
          siElegido: [
            { cuando: 'jefatura/guardias#g2', franja: '3', titulo: 'Ciencias de la Naturaleza', detalle: '3.º B', nota: 'Cubres a Sergio Prieto. Tu apoyo de Matemáticas en 3.º A queda sin hacer.', aviso: 'Jefatura te ha elegido para la 3.ª de 3.º B: tu apoyo de Matemáticas en 3.º A queda sin hacer.' },
            { cuando: 'jefatura/guardias#g3', franja: 'recreo', titulo: 'Patio de Primaria', detalle: 'Turno de Sergio', nota: 'Vigilas el patio en el turno de Sergio Prieto.', aviso: 'Jefatura te ha elegido para el turno de patio de Sergio Prieto, en el recreo.' },
          ],
          sesiones: [
            { franja: '1', titulo: 'Lengua', detalle: '3.º B', tipo: 'cubre', sigue: 'jefatura/guardias#g1', nota: 'Cubres a Sergio Prieto en tu hora de guardia.' },
            { franja: '2', titulo: 'Apoyo de lectoescritura', detalle: '1.º B', tipo: 'clase', nota: 'Grupo pequeño en el aula de apoyo: sílabas trabadas.' },
            { franja: '3', titulo: 'Apoyo de Matemáticas', detalle: '3.º A', tipo: 'clase', nota: 'Dentro del aula: problemas de dos operaciones.' },
            { franja: '4', titulo: 'Apoyo de Lengua', detalle: '4.º B', tipo: 'clase', nota: 'Grupo pequeño en el aula de apoyo: comprensión lectora.' },
            { franja: '5', titulo: 'Apoyo de Matemáticas', detalle: '2.º A', tipo: 'clase', nota: 'Dentro del aula: sumas con llevada.' },
            { franja: '6', titulo: 'Matemáticas', detalle: '3.º B', tipo: 'cubre', sigue: 'jefatura/guardias#g4', nota: 'Cubres a Sergio Prieto en tu hora de preparación.' },
            { franja: 'salida', titulo: 'Salida de 3.º B', tipo: 'cubre', sigue: 'jefatura/guardias#g4', nota: 'Acompañas al grupo a la puerta de Primaria. Antes, pregunta en conserjería cómo se hace la salida de 3.º B.' },
          ],
        },
      ],
    },

    // Lo que te necesita: empieza por lo que las cifras no dicen. Lo que tiene fecha va en la agenda.
    lista: {
      titulo: 'Lo que te necesita',
      items: [
        { grupo: 'Hoy', icono: 'correo', titulo: 'Laura Sánchez te pide material', detalle: 'Saquitos y aros del aula de apoyo, para su Educación Física de mañana con 4.º A.', estado: 'hoy', ir: 'correo:c-laura', sigue: 'correo:c-laura' },
        {
          // La salida va con la 6.ª (g4). A las 8:00 es una propuesta: para saber, sin pedir nada. Cuando jefatura confirma
          // (siConfirmada), pasa a hoy: antes de la salida, pregunta en conserjería cómo se hace. Las indicaciones de recogida
          // de los alumnos no están en DirectorIA: las tiene el colegio (lo dice la línea fija de cada ficha).
          grupo: 'Hoy', icono: 'persona', titulo: '16:00: te proponen para la salida de 3.º B', detalle: 'Va con la 6.ª. Si jefatura lo confirma, pregunta antes en conserjería cómo se hace la salida.', estado: 'info', ir: 'jornada',
          siConfirmada: [
            { cuando: 'jefatura/guardias', titulo: '16:00: haces tú la salida de 3.º B', detalle: 'Antes, lee tu ficha de 6.ª y pregunta en conserjería cómo se hace la salida.', estado: 'hoy', ir: 'ficha', sigue: 'jornada#7', verbo: 'Hecha' },
            { cuando: 'jefatura/guardias#g4', titulo: '16:00: haces tú la salida de 3.º B', detalle: 'Tu ficha de 6.ª te llega cuando jefatura confirme las demás guardias. Antes, pregunta en conserjería.', estado: 'hoy', sigue: 'jornada#7', verbo: 'Hecha' },
          ],
          // Si jefatura la da a otra persona, la fila pasa a ser para saber, sin enlace.
          siOtra: [{ cuando: 'jefatura/guardias#g4', titulo: '16:00: la salida de 3.º B ya no es tuya', detalle: 'Va con la 6.ª, y para la 6.ª jefatura ha elegido a otra persona.', estado: 'info', ir: null }],
        },
        {
          // Choque: desde enero se lee de 14:30 a 14:50 y sus apoyos de 5.ª empiezan a las 14:30 (correos de Pilar Serrano y de dirección).
          grupo: 'Esta semana', icono: 'alerta', titulo: 'Tus apoyos de 5.ª coinciden con la lectura de enero',
          detalle: 'Desde enero se lee de 14:30 a 14:50 en toda Primaria. Tenlo en cuenta en tu propuesta para Pilar Serrano.',
          // Lo resuelven las respuestas que hablan de la lectura: empezar los apoyos a las 14:50 (#0) o preguntar a Pilar cómo
          // encajarla (#2). Pedirle más tiempo (#1) no: el choque sigue.
          estado: 'pendiente', choque: true, ir: 'correo:c-ciclo', sigue: 'correo:c-ciclo#0,2',
          aMedias: { sigue: 'correo:c-ciclo', detalle: 'Le has pedido a Pilar Serrano más tiempo. Tenlo en cuenta en tu propuesta.' },
        },
        { grupo: 'Para saber', icono: 'documento', titulo: 'Tus fichas se cierran al acabar la jornada', detalle: 'Cada una trae solo la clase: la tarea, el material y a quién llamar. Queda registrado quién la ve.', estado: 'info' },
      ],
    },

    // Lo que viene: lo que Pilar Serrano pide en su correo (lleva la insignia).
    agenda: {
      titulo: 'Lo que viene',
      desde: '2026-11-16',
      semanas: 3,
      marcas: [
        { fecha: '2026-11-20', tipo: 'plazo', titulo: 'Tu propuesta de apoyos para enero', detalle: 'Pásasela a Pilar Serrano antes de este día, para la reunión de ciclo.', fuente: 'correo', ir: 'correo:c-ciclo' },
        { fecha: '2026-11-24', hora: '16:15', tipo: 'evento', titulo: 'Reunión del 2.º ciclo', detalle: 'Hasta las 17:15, en el aula de 4.º B. Entre otros puntos, los apoyos del 2.º trimestre.', fuente: 'correo', ir: 'correo:c-ciclo' },
      ],
    },
  },

  // ───────────────────────────── Correo ─────────────────────────────
  correo: [
    {
      id: 'c-jefatura',
      de: 'Javier Martín',
      deDetalle: 'Jefe de estudios',
      asunto: 'Hoy cubres 1.ª y 6.ª en 3.º B',
      hora: '7:52',
      categoria: 'Equipo directivo',
      etiqueta: { texto: 'Sustitución de hoy', tipo: 'hoy' },
      resumen: [
        'Sergio Prieto no viene. Javier te pone con 3.º B a 1.ª hora (Lengua) y a 6.ª (Matemáticas).',
        'Entras en tu guardia de 1.ª y en tu hora de preparación de 6.ª: tus apoyos de hoy no cambian.',
        'Las fichas te llegan cuando confirme las guardias. A las 16:00 haces tú la salida de 3.º B.',
      ],
      piden: 'Que entres en 3.º B a 1.ª y a 6.ª, leas antes las fichas y hagas la salida de las 16:00.',
      original: 'Buenos días, Pablo:\n\nSergio Prieto no viene hoy. Te adelanto lo que te va a llegar: cubres 3.º B a 1.ª hora, Lengua, en tu guardia, y a 6.ª, Matemáticas, en tu hora de preparación. Así el grupo empieza y acaba el día contigo, y tus apoyos no se tocan.\n\nAhora reviso la propuesta en DirectorIA y, en cuanto la confirme, te llegan las dos fichas con la tarea de su programación quincenal, el material y a quién llamar. La salida de las 16:00 la haces tú: antes, pásate por conserjería.\n\nRosa entra en 3.ª y Teresa se queda con su turno de patio.\n\nGracias por echar una mano.\n\nUn abrazo,\nJavier Martín\nJefe de estudios',
      respuestas: [
        {
          titulo: 'Confirmar y dejar nota a Sergio',
          texto: 'Buenos días, Javier:\n\nDe acuerdo: entro con 3.º B a 1.ª y a 6.ª. Leeré las fichas antes de cada sesión y a las 16:00 hago yo la salida; antes paso por conserjería a preguntar cómo se hace.\n\nAl terminar le dejo a Sergio en su mesa una nota con lo que hemos hecho en Lengua y en Matemáticas, para que sepa por dónde seguir cuando vuelva.\n\nUn abrazo,\nPablo Sanz\nMaestro de apoyo de Primaria',
        },
        {
          titulo: 'Ofrecerse también para mañana',
          texto: 'Buenos días, Javier:\n\nCuenta conmigo para 1.ª y 6.ª con 3.º B.\n\nSi mañana Sergio tampoco viene, puedo volver a entrar a 1.ª, que los jueves también tengo guardia: así el grupo empieza el día con alguien que ya conoce. El resto del jueves tengo apoyos y prefiero no moverlos.\n\nDime algo esta tarde, cuando sepas si viene, y lo dejo preparado.\n\nUn abrazo,\nPablo Sanz\nMaestro de apoyo de Primaria',
        },
        {
          titulo: 'Pedir las fichas antes de las 8:45',
          texto: 'Buenos días, Javier:\n\nMe viene bien. Solo te pido una cosa: ¿puedes confirmar las guardias antes de las 8:45? Así leo la ficha de 1.ª con calma y, si me falta algo, te lo pregunto antes de entrar en 3.º B.\n\nEn 6.ª me quedo con el grupo hasta la salida de las 16:00.\n\nGracias,\nPablo Sanz\nMaestro de apoyo de Primaria',
        },
      ],
      nota: 'Tus fichas de 1.ª y 6.ª aparecen en «Tus fichas de hoy» cuando jefatura confirma las guardias.',
      ir: 'ficha',
    },
    {
      id: 'c-laura',
      de: 'Laura Sánchez',
      deDetalle: 'Tutora de 4.º A · Educación Física en 2.º ciclo',
      asunto: '¿Me prestas los saquitos y los aros para el jueves?',
      hora: 'ayer',
      categoria: 'Claustro',
      etiqueta: { texto: 'Responder hoy', tipo: 'hoy' },
      resumen: [
        'Laura te pide 12 saquitos y 10 aros pequeños del aula de apoyo para su Educación Física con 4.º A del jueves, a 2.ª hora.',
        'Si las tienes, también las tarjetas de las estaciones del circuito. Le iría bien tenerlo hoy en el cuarto de material del gimnasio.',
        'Hoy estás con 3.º B hasta la salida de las 16:00. Te lo devuelve el jueves en el recreo.',
      ],
      piden: 'Dejarle hoy en el gimnasio 12 saquitos, 10 aros pequeños y, si puedes, las tarjetas de las estaciones del circuito.',
      original: 'Hola, Pablo:\n\n¿Me puedes prestar para el jueves los saquitos y los aros pequeños del aula de apoyo? A 2.ª hora hago con 4.º A un circuito de lanzamientos y en el gimnasio solo quedan seis aros en buen estado. Con 12 saquitos y 10 aros me apaño.\n\nSi tienes a mano las tarjetas con dibujos para explicar las estaciones, mejor todavía: así lo entienden todos de un vistazo.\n\nSi te viene bien, déjamelo todo mañana en el cuarto de material del gimnasio, en la estantería de arriba. Te lo devuelvo el jueves en el recreo, que ya sé que por la tarde lo usas con los de 1.º.\n\n¡Gracias! Te debo un café.\n\nLaura',
      respuestas: [
        {
          titulo: 'Dejárselo hoy después de la salida',
          texto: 'Hola, Laura:\n\nClaro que sí. Hoy estoy con 3.º B hasta las 16:00, así que después de la salida te dejo en el cuarto de material del gimnasio, en la estantería de arriba, los 12 saquitos, los 10 aros y las tarjetas de las estaciones, todo en una caja con tu nombre.\n\nDevuélvemelo el jueves en el recreo, que a 5.ª lo uso con 1.º.\n\nY el café, cuando quieras.\n\nUn abrazo,\nPablo Sanz\nMaestro de apoyo de Primaria',
        },
        {
          titulo: 'Llevárselo mañana a las 8:50',
          texto: 'Hola, Laura:\n\nTe lo presto sin problema, pero hoy voy con el tiempo justo: cubro a Sergio a 1.ª y a 6.ª y hago la salida de 3.º B. ¿Te vale si mañana a las 8:50 te llevo al gimnasio los saquitos, los aros y las tarjetas? Así lo tienes todo antes de tu clase de 2.ª.\n\nDevuélvemelo en el recreo, que por la tarde lo necesito.\n\nUn abrazo,\nPablo Sanz\nMaestro de apoyo de Primaria',
        },
        {
          titulo: 'Preguntar qué estaciones va a montar',
          texto: 'Hola, Laura:\n\nClaro, te lo presto. Para las tarjetas, ¿me dices qué estaciones vas a montar? Así te dejo solo las que encajan y, si falta alguna, la preparo yo.\n\nCon lo que me digas, hoy después de la salida de las 16:00 te lo dejo todo en el cuarto de material del gimnasio, con los saquitos y los aros.\n\nUn abrazo,\nPablo Sanz\nMaestro de apoyo de Primaria',
        },
      ],
      nota: 'DirectorIA lo ha añadido a tu jornada, después de la salida de las 16:00, por si decides prestárselo hoy.',
      ir: 'jornada',
    },
    {
      id: 'c-ciclo',
      de: 'Pilar Serrano',
      deDetalle: 'Coordinadora del 2.º ciclo de Primaria',
      asunto: 'Reunión de ciclo del martes 24',
      hora: 'ayer',
      categoria: 'Claustro',
      etiqueta: { texto: 'Propuesta antes del vie 20', tipo: 'plazo' },
      resumen: [
        'Reunión del 2.º ciclo el martes 24, de 16:15 a 17:15, en el aula de 4.º B.',
        'Puntos: sesiones de la 1.ª evaluación, salida al Botánico, lectura de enero y apoyos del 2.º trimestre.',
        'A ti te pide tu propuesta de horario de apoyos para enero antes del viernes 20.',
      ],
      piden: 'Enviar tu propuesta de horario de apoyos para enero antes del viernes 20.',
      original: 'Hola a todos:\n\nEl martes 24 tenemos reunión de ciclo, de 16:15 a 17:15, en el aula de 4.º B. Estos son los puntos:\n\n- Sesiones de la 1.ª evaluación, del 9 al 11 de diciembre: traed las observaciones de vuestro grupo.\n- Salida de 4.º al Jardín Botánico del viernes 27: últimos detalles.\n- Lectura de enero: cómo organizamos en el ciclo los 20 minutos de 14:30 a 14:50.\n- Apoyos del 2.º trimestre.\n\nPablo, para el último punto, ¿me puedes pasar antes del viernes 20 tu propuesta de horario de apoyos para enero? Así la miro con calma y el martes solo tenemos que cerrarla entre todos.\n\nSi alguien no puede venir, que me avise.\n\nGracias,\nPilar Serrano\nCoordinadora del 2.º ciclo',
      respuestas: [
        {
          titulo: 'Confirmar y enviarla el viernes',
          texto: 'Hola, Pilar:\n\nCuenta conmigo el martes. Te paso la propuesta de apoyos el viernes 20, antes de las 14:00. Mantengo los grupos de este trimestre y empiezo los apoyos de 5.ª a las 14:50, después de los 20 minutos de lectura.\n\nSi algún tutor quiere cambiar algo, que me lo diga el jueves como muy tarde y lo incluyo.\n\nUn abrazo,\nPablo Sanz\nMaestro de apoyo de Primaria',
        },
        {
          titulo: 'Proponer enviarla el lunes 23',
          texto: 'Hola, Pilar:\n\nEl martes allí estaré. Con la propuesta voy más justo: hoy cubro a Sergio en 3.º B en la hora que tenía para prepararla. ¿Te vale si te la paso el lunes 23 antes de las 9:00? Así la tienes un día antes de la reunión.\n\nUn abrazo,\nPablo Sanz\nMaestro de apoyo de Primaria',
        },
        {
          titulo: 'Preguntar cómo encajar la lectura',
          texto: 'Hola, Pilar:\n\nAntes de prepararla, una duda: desde enero se lee de 14:30 a 14:50 en todas las aulas, y mis apoyos de 5.ª empiezan a las 14:30. ¿Prefieres que esos 20 minutos esté dentro del aula, acompañando la lectura, o que empiece los apoyos a las 14:50?\n\nCon lo que me digas, te la paso el viernes 20.\n\nUn abrazo,\nPablo Sanz\nMaestro de apoyo de Primaria',
        },
      ],
      nota: 'Desde enero, de 14:30 a 14:50 se lee en toda Primaria, y tus apoyos de 5.ª empiezan a las 14:30. Tenlo en cuenta en la propuesta.',
    },
    {
      id: 'c-lectura',
      de: 'Elena Ruiz',
      deDetalle: 'Directora',
      asunto: 'Plan de lectura de Primaria: así empezamos en enero',
      hora: 'ayer',
      categoria: 'Equipo directivo',
      etiqueta: { texto: 'Solo para leer', tipo: 'info' },
      resumen: [
        'Desde enero, 20 minutos de lectura cada día de 14:30 a 14:50 en toda Primaria, con quien tenga clase con el grupo a esa hora.',
        'Tus apoyos de 5.ª empiezan a las 14:30, así que coinciden con esos 20 minutos.',
        'Sin notas ni fichas: se lee por gusto. Los lotes de libros llegan a las aulas la semana del 14 de diciembre.',
      ],
      piden: '',
      original: 'Queridos compañeros de Primaria:\n\nComo acordamos en el claustro del lunes, a partir de enero dedicaremos 20 minutos diarios a la lectura en todos los cursos de Primaria. Así lo vamos a organizar:\n\nSerá cada día de 14:30 a 14:50, al volver de comer, en el aula y con quien tenga clase con el grupo a esa hora. También los especialistas.\n\nCada aula tendrá un lote de 30 libros de la biblioteca, que iremos cambiando cada trimestre. Los repartiremos la semana del 14 de diciembre. Si queréis títulos concretos para vuestro grupo, pedídselos a la biblioteca antes del viernes 4 de diciembre.\n\nNo se pone nota ni hay fichas: se trata de que lean por gusto.\n\nGracias por las ideas que salieron en el claustro.\n\nUn abrazo,\nElena Ruiz\nDirectora',
      adjuntos: ['Plan de lectura de Primaria.pdf'],
      respuestas: [],
      nota: 'Solo para leer. DirectorIA lo ha tenido en cuenta en el correo de Pilar Serrano sobre tus apoyos de enero.',
    },
  ],

  // ───────────────────────────── Módulos ─────────────────────────────
  modulos: [
    // E2. Fichas de sustitución de 3.º B (las mismas que ve jefatura en su vista previa). Solo la clase: grupo, materia,
    // hora y aula; la tarea, el material y a quién llamar. La línea fija de salud y recogidas la pone el motor.
    {
      id: 'ficha',
      tipo: 'ficha',
      menu: 'Tus fichas de hoy',
      antetitulo: 'Sustitución de hoy · 3.º B',
      titulo: 'Tus fichas para cubrir a Sergio Prieto en 3.º B',
      entradilla: 'Solo la clase: la tarea de la programación quincenal de Sergio, el material y a quién llamar. Las indicaciones de salud y de recogida de los alumnos no están en DirectorIA: las tiene el colegio.',
      bandera: 'guardias',
      fichas: [
        {
          sesion: '3.º B · Matemáticas · 6.ª hora',
          hora: '15:15-16:00',
          aula: 'Aula de 3.º B, planta baja',
          para: 'Pablo Sanz',
          origen: 'Preparada por DirectorIA · confirmada por jefatura',
          datos: [
            { dt: 'Tarea', dd: 'Ejercicios 4 a 9 de la página 58, de la programación quincenal de Sergio Prieto.' },
            { dt: 'Material', dd: 'Los libros de Matemáticas, en el armario del aula. Las hojas de cuadrícula, en la bandeja de la mesa del tutor.' },
            { dt: 'A quién llamar', dd: 'Tutoría: Ana Torres, tutora de 3.º A (ext. 213) · Jefatura de estudios (ext. 202) · Conserjería (ext. 200)' },
            { dt: 'Al acabar', dd: 'A las 16:00, acompaña al grupo a la puerta de Primaria.' },
          ],
          pie: 'Se abre antes de la sesión y se cierra al acabar la jornada. Queda registrado quién la ve.',
        },
        {
          sesion: '3.º B · Lengua · 1.ª hora',
          hora: '9:00-9:45',
          aula: 'Aula de 3.º B, planta baja',
          para: 'Pablo Sanz',
          origen: 'Preparada por DirectorIA · confirmada por jefatura',
          datos: [
            { dt: 'Tarea', dd: 'Lectura de las páginas 40-41 y las preguntas 1 a 3 en el cuaderno, de la programación quincenal de Sergio Prieto.' },
            { dt: 'Material', dd: 'Los libros de Lengua y los cuadernos, en el armario del aula.' },
            { dt: 'A quién llamar', dd: 'Tutoría: Ana Torres, tutora de 3.º A (ext. 213) · Jefatura de estudios (ext. 202) · Conserjería (ext. 200)' },
            { dt: 'Al acabar', dd: 'A las 9:45 llega Teresa Gil, la maestra de Inglés: espera en el aula hasta que entre.' },
          ],
          pie: 'Se abre antes de la sesión y se cierra al acabar la jornada. Queda registrado quién la ve.',
        },
      ],
      registro: [
        'Vista previa abierta por Javier Martín (jefatura) hoy a las 7:56',
      ],
    },

    // Tu horario de hoy, con las dos sesiones que cubres
    {
      id: 'jornada',
      tipo: 'plazos',
      menu: 'Tu jornada',
      antetitulo: 'Miércoles 18 de noviembre · de 9:00 a 16:00',
      titulo: 'Tu jornada: cuatro apoyos y dos sesiones en 3.º B',
      entradilla: 'DirectorIA ha juntado tu horario con la propuesta de guardias de jefatura. Cubres en tu guardia de 1.ª y en tu hora de preparación de 6.ª, así que tus apoyos no cambian. Marca cada sesión al acabarla.',
      items: [
        {
          fecha: 'Antes de las 9:00',
          titulo: 'Lee tu ficha de 1.ª',
          detalle: 'La tarea, el material y a quién llamar. Aparece en «Tus fichas de hoy» cuando jefatura confirma las guardias.',
          quien: 'Tú',
          origen: 'Fichas de sustitución',
          estado: 'hoy',
        },
        {
          fecha: '9:00-9:45',
          titulo: '1.ª hora · 3.º B · Lengua',
          detalle: 'Cubres a Sergio Prieto en tu hora de guardia. Lectura de las páginas 40-41 y preguntas 1 a 3 en el cuaderno.',
          quien: 'Tú',
          origen: 'Propuesta de guardias de jefatura',
          estado: 'pronto',
        },
        {
          fecha: '9:45-10:30',
          titulo: '2.ª hora · Apoyo de lectoescritura · 1.º B',
          detalle: 'Grupo pequeño en el aula de apoyo: sílabas trabadas.',
          quien: 'Tú',
          origen: 'Tu horario y tu programación de apoyos',
          estado: 'despues',
        },
        {
          fecha: '10:30-11:15',
          titulo: '3.ª hora · Apoyo de Matemáticas · 3.º A',
          detalle: 'Dentro del aula: problemas de dos operaciones.',
          quien: 'Tú',
          origen: 'Tu horario y tu programación de apoyos',
          estado: 'despues',
        },
        {
          fecha: '11:45-12:30',
          titulo: '4.ª hora · Apoyo de Lengua · 4.º B',
          detalle: 'Grupo pequeño en el aula de apoyo: comprensión lectora.',
          quien: 'Tú',
          origen: 'Tu horario y tu programación de apoyos',
          estado: 'despues',
        },
        {
          fecha: '14:30-15:15',
          titulo: '5.ª hora · Apoyo de Matemáticas · 2.º A',
          detalle: 'Dentro del aula: sumas con llevada.',
          quien: 'Tú',
          origen: 'Tu horario y tu programación de apoyos',
          estado: 'despues',
        },
        {
          fecha: '15:15-16:00',
          titulo: '6.ª hora · 3.º B · Matemáticas',
          detalle: 'Cubres a Sergio Prieto en tu hora de preparación. Ejercicios 4 a 9 de la página 58; los libros están en el armario del aula.',
          quien: 'Tú',
          origen: 'Propuesta de guardias de jefatura',
          estado: 'despues',
        },
        {
          fecha: '16:00',
          titulo: 'Salida de 3.º B',
          detalle: 'Acompañas al grupo a la puerta de Primaria. Antes, pregunta en conserjería cómo se hace la salida de 3.º B.',
          quien: 'Tú',
          origen: 'Ficha de 6.ª hora',
          estado: 'despues',
        },
        {
          fecha: '16:15',
          titulo: 'Material de Educación Física para Laura',
          detalle: 'Si se lo prestas, déjale en el cuarto de material del gimnasio los saquitos, los aros y las tarjetas. Lo necesita el jueves a 2.ª hora.',
          quien: 'Tú',
          origen: 'Correo de Laura Sánchez',
          estado: 'despues',
        },
      ],
    },
  ],
});
