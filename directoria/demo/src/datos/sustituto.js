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
  inicio: {
    antetitulo: 'Miércoles 18 de noviembre · 8:00',
    titulo: 'Buenos días, Pablo',
    entradilla: 'Sergio Prieto no viene y jefatura cuenta contigo para 3.º B a 1.ª y a 6.ª. DirectorIA te ha preparado la jornada, las fichas y el correo. Nada se envía sin ti.',
    bloques: [
      {
        titulo: 'Tu jornada',
        items: [
          {
            texto: 'DirectorIA te propone para cubrir a Sergio Prieto en 3.º B a 1.ª (Lengua) y a 6.ª (Matemáticas). Jefatura lo está revisando.',
            estado: 'pendiente',
            ir: 'correo:c-jefatura',
            bandera: 'guardias',
            textoSi: 'Jefatura ha confirmado que cubres a Sergio Prieto en 3.º B a 1.ª (Lengua) y a 6.ª (Matemáticas).',
            estadoSi: 'hecho',
          },
          {
            texto: 'Tus cuatro apoyos se mantienen: 1.º B a 2.ª, 3.º A a 3.ª, 4.º B a 4.ª y 2.º A a 5.ª. Cubres en tu guardia y en tu hora de preparación.',
            estado: 'info',
            ir: 'jornada',
          },
          {
            texto: '16:00 · Haces tú la salida de 3.º B. Antes, lee el aviso de recogida de tu ficha de 6.ª.',
            estado: 'hoy',
            ir: 'ficha',
          },
        ],
      },
      {
        titulo: 'Tus fichas',
        items: [
          {
            texto: 'Tus fichas de 1.ª y 6.ª llegan en cuanto jefatura confirme las guardias.',
            estado: 'pendiente',
            ir: 'ficha',
            bandera: 'guardias',
            textoSi: 'Ya tienes tus fichas de 1.ª y 6.ª, con la tarea y lo que debes saber del grupo.',
            estadoSi: 'hoy',
          },
          {
            texto: 'Cada ficha se abre antes de su sesión y solo incluye lo que necesitas para dar la clase.',
            estado: 'info',
          },
          {
            texto: 'Aviso: la ficha se cierra al acabar la jornada y queda registrado quién la ve.',
            estado: 'info',
          },
        ],
      },
      {
        titulo: 'Tu correo',
        items: [
          {
            texto: 'Laura Sánchez te pide material del aula de apoyo para su Educación Física de mañana con 4.º A.',
            estado: 'hoy',
            ir: 'correo:c-laura',
          },
          {
            texto: 'Pilar Serrano quiere tu propuesta de apoyos para enero antes del viernes 20, para la reunión de ciclo del martes 24.',
            estado: 'pendiente',
            ir: 'correo:c-ciclo',
          },
          {
            texto: 'Desde enero se lee de 14:30 a 14:50 en toda Primaria, y tus apoyos de 5.ª empiezan a las 14:30.',
            estado: 'info',
            ir: 'correo:c-lectura',
          },
        ],
      },
    ],
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
      original: 'Buenos días, Pablo:\n\nSergio Prieto no viene hoy. Te adelanto lo que te va a llegar: cubres 3.º B a 1.ª hora, Lengua, en tu guardia, y a 6.ª, Matemáticas, en tu hora de preparación. Así el grupo empieza y acaba el día contigo, y tus apoyos no se tocan.\n\nAhora reviso la propuesta en DirectorIA y, en cuanto la confirme, te llegan las dos fichas con la tarea de su programación quincenal y lo que tienes que saber del grupo. Léete con calma la de 6.ª: la salida de las 16:00 la haces tú.\n\nRosa entra en 3.ª y Teresa se queda con su turno de patio.\n\nGracias por echar una mano.\n\nUn abrazo,\nJavier Martín\nJefe de estudios',
      respuestas: [
        {
          titulo: 'Confirmar y dejar nota a Sergio',
          texto: 'Buenos días, Javier:\n\nDe acuerdo: entro con 3.º B a 1.ª y a 6.ª. Leeré las fichas antes de cada sesión y a las 16:00 hago yo la salida, atento a las recogidas que indique la de 6.ª.\n\nAl terminar le dejo a Sergio en su mesa una nota con lo que hemos hecho en Lengua y en Matemáticas, para que sepa por dónde seguir cuando vuelva.\n\nUn abrazo,\nPablo Sanz\nMaestro de apoyo de Primaria',
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
    // E2. Fichas de sustitución de 3.º B (las mismas que ve jefatura en su vista previa)
    {
      id: 'ficha',
      tipo: 'ficha',
      menu: 'Tus fichas de hoy',
      antetitulo: 'Sustitución de hoy · 3.º B',
      titulo: 'Tus fichas para cubrir a Sergio Prieto en 3.º B',
      entradilla: 'Lo que necesitas para entrar en 3.º B, y nada más. La tarea sale de la programación quincenal de Sergio; las pautas, de orientación y tutoría; la salud y las recogidas, de dirección y tutoría.',
      bandera: 'guardias',
      fichas: [
        {
          sesion: '3.º B · Matemáticas · 6.ª hora',
          hora: '15:15-16:00',
          origen: 'Preparada por DirectorIA para Pablo Sanz',
          datos: [
            { dt: 'Tarea', dd: 'Ejercicios 4 a 9 de la página 58. Los libros están en el armario del aula.' },
            { dt: 'Necesidades', dd: 'Mario: instrucciones por escrito y más tiempo.' },
            { dt: 'Salud', dd: 'Lucía: alérgica a frutos secos. Su autoinyector está en conserjería.', aviso: true },
            { dt: 'Recogida · última hora', dd: 'Hugo solo puede salir con su madre o su abuela. Si viene otra persona, no lo entregues y avisa a dirección (ext. 201).', aviso: true },
          ],
          pie: 'Se abre antes de la sesión y se cierra al acabar la jornada. Queda registrado quién la ve.',
        },
        {
          sesion: '3.º B · Lengua · 1.ª hora',
          hora: '9:00-9:45',
          origen: 'Preparada por DirectorIA para Pablo Sanz',
          datos: [
            { dt: 'Tarea', dd: 'Lectura de las páginas 40-41 y las preguntas 1 a 3 en el cuaderno.' },
            { dt: 'Necesidades', dd: 'Mario: instrucciones por escrito y más tiempo.' },
            { dt: 'Salud', dd: 'Lucía: alérgica a frutos secos. Su autoinyector está en conserjería.', aviso: true },
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
          detalle: 'Tarea, pautas y salud de 3.º B. Aparece en «Tus fichas de hoy» cuando jefatura confirma las guardias.',
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
          detalle: 'Acompañas al grupo a la puerta de Primaria. Antes, lee el aviso de recogida de tu ficha de 6.ª.',
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
