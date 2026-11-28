DEMO.rol({
  id: 'jefatura',
  orden: 2,
  persona: {
    nombre: 'Javier Martín',
    cargo: 'Jefe de estudios',
    detalle: 'Jefatura de estudios · Primaria y ESO',
    ilustracion: 'jefatura',
  },
  acceso: 'Guardias, fichas de sustitución, exámenes, ausencias, programaciones y correo',

  // ─── Inicio: el panel de mando de jefatura (6.2 bis) ───────────────
  // Cifras, día y calendario salen de reglas y de los datos del colegio: sin insignia de IA.
  // Las filas que resumen un correo y los plazos sacados de un correo llevan la insignia (la pone el motor).
  inicio: {
    antetitulo: 'Miércoles 18 de noviembre · 8:00',
    titulo: 'Buenos días, Javier',
    // Vale antes y después de confirmar: no pide revisar lo que ya está confirmado.
    entradilla: 'Sergio Prieto no viene. Tú confirmas quién cubre sus sesiones; hasta entonces, no se avisa a nadie.',

    // Lo que importa a las 8:00, de lo más urgente a lo menos. Cada cifra lleva a donde se actúa.
    cifras: [
      {
        // Progreso «X de Y», con el medidor rotulado por la cifra: las cuatro propuestas de «Guardias de hoy»
        // (tres sesiones con 3.º B y el turno de patio).
        etiqueta: 'Guardias confirmadas',
        icono: 'persona',
        progreso: 'guardias',
        hoy: true,
        nota: 'Tres sesiones de Sergio Prieto con 3.º B y su turno de patio.',
        ir: 'guardias',
        accion: 'Revisar y confirmar',
        accionCorta: 'Confirmar',
        alTerminar: 'Todas',
        accionHecha: 'Ver las guardias',
      },
      {
        etiqueta: 'Correos por responder',
        icono: 'correo',
        cuenta: 'correo',
        accion: 'Abrir el correo',
        alTerminar: 'Al día',
      },
      {
        // Cuenta lo que queda: el choque del calendario de exámenes. Está hecho cuando apruebas el calendario.
        etiqueta: 'Exámenes de ESO',
        icono: 'calendario',
        valor: '1',
        rotulo: 'choque',
        nota: '4.º ESO A tiene dos el miércoles 2. DirectorIA propone pasar Inglés al jueves 3.',
        sigue: 'examenes',
        ir: 'examenes',
        accion: 'Revisar el calendario',
        accionCorta: 'Revisar',
        alTerminar: 'Sin choques',
        accionHecha: 'Ver los exámenes',
      },
      {
        // Cuenta lo que queda: dos programaciones con apartados sin completar. Está hecho cuando pides lo que falta.
        etiqueta: 'Programaciones de ESO',
        icono: 'documento',
        valor: '2',
        rotulo: 'incompletas',
        nota: 'Educación Física y Música. Las de Matemáticas, que pide inspección, están completas.',
        sigue: 'programaciones',
        ir: 'programaciones',
        accion: 'Ver qué falta',
        alTerminar: 'Ya lo has pedido',
        accionHecha: 'Ver lo pedido',
      },
    ],

    // Quién cubre a Sergio Prieto en cada sesión de 3.º B. La persona sale de «Guardias de hoy»:
    // la propuesta o, si eliges a otra en el desplegable, la que elijas.
    dia: {
      titulo: 'Quién cubre 3.º B hoy',
      carriles: [
        {
          titulo: '3.º B',
          detalle: 'Sergio Prieto no viene',
          icono: 'persona',
          cuenta: 'confirmadas',
          pendiente: 'En «Guardias de hoy» puedes elegir a otra persona para cada sesión antes de confirmar.',
          // Si confirmas una a una: a quien cubre lo confirmado ya le ha llegado el aviso; a los demás, no ({n} de {de}).
          parcial: 'Has confirmado {n} de {de}. Hasta que confirmes las demás, no se avisa a quien las cubre.',
          alTerminar: 'Has confirmado quién cubre a Sergio Prieto. Cada persona tiene su aviso y quien entra en 3.º B, su ficha.',
          sesiones: [
            { franja: '1', titulo: 'Lengua', tipo: 'cubre', sigue: 'guardias#g1', nota: 'Tiene guardia a esa hora. Lleva 2 guardias este mes; la media es 3.' },
            { franja: '2', titulo: 'Inglés', detalle: 'Con su especialista', tipo: 'igual' },
            { franja: '3', titulo: 'Ciencias de la Naturaleza', tipo: 'cubre', sigue: 'guardias#g2', nota: 'Tiene guardia a esa hora. Lleva 3 guardias este mes, en la media.' },
            { franja: 'recreo', titulo: 'Patio de Primaria', tipo: 'cubre', sigue: 'guardias#g3', nota: 'Hace el turno de patio de Sergio. Lleva 4 recreos este mes; la media es 6.' },
            { franja: '4', titulo: 'Educación Física', detalle: 'Con su especialista', tipo: 'igual' },
            { franja: '5', titulo: 'Música', detalle: 'Con su especialista', tipo: 'igual' },
            { franja: '6', titulo: 'Matemáticas', tipo: 'cubre', sigue: 'guardias#g4', nota: 'Así 3.º B acaba el día con la misma persona que lo empezó.' },
            { franja: 'salida', titulo: 'Salida de 3.º B', tipo: 'cubre', sigue: 'guardias#g4', nota: 'Acompaña al grupo a la puerta de Primaria a las 16:00. Va con la 6.ª hora.' },
          ],
        },
      ],
    },

    // Lo que te necesita: empieza por lo que las cifras no dicen. Lo que tiene fecha va en la agenda.
    lista: {
      titulo: 'Lo que te necesita',
      items: [
        {
          grupo: 'Hoy', icono: 'documento', titulo: 'Fichas de 1.ª, 3.ª y 6.ª hora de 3.º B',
          detalle: 'Están listas. Quien cubre en 3.º B recibe la suya cuando confirmes las guardias.', estado: 'pendiente', ir: 'fichas',
          sigue: 'guardias', verbo: 'Enviadas', si: { detalle: 'Quien cubre en 3.º B ya tiene su ficha. Se cierra al acabar la jornada.' },
        },
        {
          // Sale del correo de Laura (lleva la insignia). No propone a nadie: quién cubre su guardia lo decides tú, con la
          // propuesta de DirectorIA que va en la nota del correo. El choque de su guardia del viernes 27 con la salida no sale
          // del correo, sino de su horario: va en la agenda, sin insignia.
          grupo: 'Hoy', icono: 'correo', titulo: 'Laura Sánchez pide que cubran su guardia de mañana',
          detalle: 'A 4.ª hora tiene una tutoría con una familia de 4.º A. Quién la cubre lo decides tú.',
          estado: 'hoy', ir: 'correo:c-laura', sigue: 'correo:c-laura',
        },
        { grupo: 'Esta semana', icono: 'familia', titulo: 'Una familia de 4.º ESO pregunta por las fechas de los exámenes', detalle: 'Las quieren para organizarse en casa. Salen cuando apruebes el calendario de la 1.ª evaluación.', estado: 'pendiente', ir: 'correo:c-fechas', sigue: 'correo:c-fechas' },
        { grupo: 'Para saber', icono: 'info', titulo: 'Consejería: instrucciones de las sesiones de evaluación', detalle: 'Calificaciones en Raíces antes del viernes 18 de diciembre. Las sesiones del 9 al 11 encajan en ese plazo.', estado: 'info', ir: 'correo:c-consejeria', sigue: 'correo:c-consejeria' },
        {
          // El informe de ausencias: quién falta y a qué horas, sin motivos, y si el justificante está entregado o pendiente.
          // Cuando Laura Sánchez sube el suyo en su perfil, el recuento cambia.
          grupo: 'Para saber', icono: 'persona', titulo: 'Ausencias del profesorado en noviembre: cuatro',
          detalle: 'Dos con el justificante entregado. Faltan el de hoy de Sergio Prieto y el del lunes 16 de Laura Sánchez.', estado: 'info', ir: 'ausencias',
          sigue: 'docente/justificantes#j1', si: { detalle: 'Tres con el justificante entregado. Falta el de hoy de Sergio Prieto.', estado: 'info' },
        },
      ],
    },

    // Lo que viene: plazos (lo que haces tú), citas o salidas y choques, en las próximas tres semanas.
    // fuente: 'correo' para lo que la IA ha sacado de un correo (lleva la insignia).
    agenda: {
      titulo: 'Lo que viene',
      desde: '2026-11-16',
      semanas: 3,
      marcas: [
        // La guardia del jueves 19 de Laura Sánchez: la decide jefatura al contestarle (las dos respuestas dicen que la cubre
        // Rosa Medina). Si archivas su correo, sigue pendiente.
        {
          fecha: '2026-11-19', hora: '11:45', tipo: 'plazo', titulo: 'La guardia de 4.ª de Laura Sánchez', detalle: 'Tiene una tutoría a esa hora. DirectorIA propone a Rosa Medina, la única con la 4.ª libre.',
          ir: 'correo:c-laura', sigue: 'correo:c-laura#0,1', verbo: 'Decidido', si: { detalle: 'La cubre Rosa Medina. Ya se lo has dicho a Laura.' },
        },
        // De las programaciones quincenales sale la tarea de las fichas de sustitución. Es una fecha del colegio: sin enlace.
        { fecha: '2026-11-20', tipo: 'evento', titulo: 'Entrega de las programaciones quincenales de Primaria', detalle: 'Del 23 de noviembre al 4 de diciembre. De ellas sale la tarea de las fichas de sustitución.' },
        // Lo cumplen las dos respuestas que dan fecha (#0 y #1). La que pregunta antes si el examen es de una sesión (#2)
        // no la da: el plazo sigue pendiente (aMedias).
        {
          fecha: '2026-11-20', tipo: 'plazo', titulo: 'Fecha del examen de Matemáticas de 4.º ESO', detalle: 'Respóndele a Ramón Esteban antes de este día: quieren decírselo a los alumnos esta semana.', fuente: 'correo',
          ir: 'correo:c-matematicas', sigue: 'correo:c-matematicas#0,1',
          aMedias: { sigue: 'correo:c-matematicas', detalle: 'Le has preguntado a Matemáticas. La fecha, antes de este día.' },
        },
        { fecha: '2026-11-27', hora: '9:15', tipo: 'evento', titulo: 'Salida de 4.º al Jardín Botánico', detalle: 'Vuelven a las 13:30. Laura Sánchez va con 4.º A.' },
        {
          // Choque que detecta DirectorIA cruzando el horario de Laura con la salida: reglas y fechas, sin fuente ni insignia
          // (en docente, el mismo choque). Las dos respuestas a Laura le dicen que esa guardia también la cubre otra persona
          // (#0,1): el detalle cambia, pero no pasa a ✓, porque falta decidir quién, y pierde el enlace (ir: null), porque en su
          // correo, ya respondido, no se decide nada. Si archivas su correo, no cambia.
          fecha: '2026-11-27', tipo: 'aviso', choque: true, titulo: 'La guardia de 3.ª de Laura Sánchez y la salida',
          detalle: 'Tiene guardia a 3.ª hora y estará en la salida con 4.º A: hay que cubrirla.', ir: 'correo:c-laura',
          sigue: 'correo:c-laura#0,1', si: { detalle: 'Ya le has dicho a Laura que la cubre otra persona. Quién la cubre lo decides ese día, en «Guardias de hoy».', estado: 'pendiente', ir: null },
        },
        { fecha: '2026-11-30', tipo: 'evento', titulo: 'Empiezan los exámenes de ESO', detalle: '1.ª evaluación, hasta el viernes 4 de diciembre.', ir: 'examenes' },
        {
          // Choque del calendario de exámenes: lo resuelve el calendario aprobado (módulo «Exámenes»).
          fecha: '2026-12-02', tipo: 'aviso', choque: true, titulo: '4.º ESO A, con dos exámenes el mismo día',
          detalle: 'Matemáticas e Inglés. Si apruebas la propuesta, Inglés pasa al jueves 3, que el grupo tiene libre.', ir: 'examenes', sigue: 'examenes', verbo: 'Aprobado',
          si: { titulo: 'Inglés de 4.º ESO A, al jueves 3', detalle: 'Has aprobado el calendario. Matemáticas sigue el miércoles 2.' },
        },
      ],
    },
  },

  // ───────────────────────────── Correo ─────────────────────────────
  correo: [
    {
      id: 'c-sergio',
      de: 'Sergio Prieto',
      deDetalle: 'Tutor de 3.º B de Primaria',
      asunto: 'No voy a poder ir hoy',
      hora: '7:45',
      categoria: 'Claustro',
      etiqueta: { texto: 'Ausencia de hoy', tipo: 'hoy' },
      resumen: [
        'Sergio Prieto no viene hoy. Lo ha marcado en la app a las 7:45.',
        'La tarea de 3.º B está en su programación quincenal. Hoy le tocaba vigilar el patio en el recreo.',
        'Mañana a primera hora te confirmará si viene.',
      ],
      piden: 'Que se cubran sus sesiones con 3.º B y su turno de patio.',
      original: 'Hola, Javier:\n\nHoy no voy a poder ir. Ya lo he marcado en la app. Siento avisar tan justo.\n\nLo de hoy con 3.º B está en la programación quincenal que subí, con las páginas de cada asignatura. Los libros están en el armario del aula, como siempre.\n\nHoy me tocaba vigilar el patio en el recreo, por si hay que buscar a alguien.\n\nMañana a primera hora te confirmo si voy.\n\nUn abrazo,\nSergio',
      respuestas: [
        {
          titulo: 'Decirle que su clase está cubierta',
          texto: 'Hola, Sergio:\n\nNo te preocupes por la clase: está cubierta. Pablo Sanz entra en 1.ª y en 6.ª hora, Rosa Medina en 3.ª y Teresa Gil se queda con tu turno de patio. Pablo y Rosa tienen su ficha con la tarea de tu programación quincenal.\n\nNo tienes que preparar nada más.\n\nUn abrazo,\nJavier Martín\nJefe de estudios',
        },
        {
          titulo: 'Pedir que avise esta tarde',
          texto: 'Hola, Sergio:\n\nGracias por avisar. Hoy está todo cubierto y la tarea sale de tu programación quincenal, así que olvídate de la clase.\n\nSi puedes, dime esta tarde, antes de las 18:00, si mañana vienes. Así dejo cerradas las guardias del jueves y quien te cubra tiene su ficha desde primera hora.\n\nUn abrazo,\nJavier Martín\nJefe de estudios',
        },
        {
          titulo: 'Recordarle cómo subir el justificante',
          texto: 'Hola, Sergio:\n\nTu clase está cubierta y no tienes que preparar nada.\n\nCuando puedas, sube el justificante desde DirectorIA, en «Tus justificantes», y elige la ausencia de hoy: lo archiva un programa en tu carpeta y solo lo ves tú y secretaría. No lo mandes por correo. En el registro de ausencias solo pondrá que está entregado.\n\nUn abrazo,\nJavier Martín\nJefe de estudios',
        },
      ],
      nota: 'La propuesta para cubrirlo está en «Guardias de hoy». Confírmala antes de contestarle.',
      ir: 'guardias',
    },
    {
      // Una familia pregunta por algo general (las fechas de los exámenes): sin nombres de alumnos.
      id: 'c-fechas',
      de: 'Marcos',
      deDetalle: 'Familia de 4.º ESO B',
      asunto: '¿Cuándo salen las fechas de los exámenes?',
      hora: '7:20',
      categoria: 'Familias',
      etiqueta: { texto: 'Responder esta semana', tipo: 'plazo' },
      resumen: [
        'Una familia de 4.º ESO B pregunta cuándo se publican las fechas de los exámenes de la 1.ª evaluación.',
        'Las quieren para organizar en casa las tardes de estudio.',
        'Los exámenes de ESO son del lunes 30 al viernes 4. El calendario por materias está por aprobar.',
      ],
      piden: 'Saber cuándo se publican las fechas de los exámenes de la 1.ª evaluación.',
      original: 'Buenos días:\n\nSomos una familia de 4.º de ESO B. Nos han dicho que los exámenes de la 1.ª evaluación empiezan a finales de mes, pero todavía no sabemos qué día es cada asignatura.\n\n¿Cuándo vais a publicar las fechas? Lo preguntamos para organizarnos en casa las tardes de estudio, que entre semana vamos con el tiempo muy justo.\n\nMuchas gracias y un saludo,\nMarcos',
      respuestas: [
        {
          titulo: 'Darle la semana y cuándo se publica',
          texto: 'Buenos días, Marcos:\n\nGracias por escribirnos. Los exámenes de la 1.ª evaluación de ESO son del lunes 30 de noviembre al viernes 4 de diciembre.\n\nEl calendario por asignaturas lo publicaremos esta semana para todas las familias de ESO, en cuanto quede cerrado con los departamentos.\n\nUn saludo,\nJavier Martín\nJefe de estudios del Colegio Ejemplo',
        },
        {
          titulo: 'Explicar dónde se publica',
          texto: 'Buenos días, Marcos:\n\nGracias por preguntarlo. El calendario de exámenes de la 1.ª evaluación sale esta semana: lo recibirán por correo todas las familias de ESO y estará también en el tablón de la entrada de Secundaria.\n\nLos exámenes son del lunes 30 de noviembre al viernes 4 de diciembre, como mucho uno al día por grupo.\n\nUn saludo,\nJavier Martín\nJefe de estudios del Colegio Ejemplo',
        },
        {
          titulo: 'Pedirle un poco de paciencia',
          texto: 'Buenos días, Marcos:\n\nGracias por escribirnos. Estamos cerrando con los departamentos un último cambio, para que ningún grupo tenga dos exámenes el mismo día. En cuanto quede aprobado, se lo enviaremos a todas las familias de ESO, como muy tarde el viernes 20.\n\nPara ir organizándose: los exámenes son del lunes 30 de noviembre al viernes 4 de diciembre.\n\nUn saludo,\nJavier Martín\nJefe de estudios del Colegio Ejemplo',
        },
      ],
      nota: 'Las fechas salen del calendario de exámenes, que tienes por aprobar en «Exámenes».',
      ir: 'examenes',
    },
    {
      // Laura pide que otra persona cubra su guardia del jueves, sin proponer a nadie: lo decide jefatura. La nota es de
      // DirectorIA (reglas, sin insignia): su propuesta para el jueves (primero quien tiene guardia a esa hora; si no hay,
      // quien tiene hora libre; entre varios, quien lleva menos guardias este mes) y el choque del viernes 27 con la salida.
      // A 4.ª no hay nadie más de guardia y Rosa Medina es la única con esa hora libre: no hace falta mirar cuántas guardias
      // lleva (hoy DirectorIA también la propone para la 3.ª de 3.º B). Las dos respuestas dicen quién la cubre el jueves y
      // que la del viernes 27 también la cubre otra persona.
      id: 'c-laura',
      de: 'Laura Sánchez',
      deDetalle: 'Tutora de 4.º A de Primaria',
      asunto: 'Mi guardia del jueves coincide con una tutoría',
      hora: 'ayer',
      categoria: 'Claustro',
      etiqueta: { texto: 'Responder hoy', tipo: 'hoy' },
      resumen: [
        'Laura Sánchez tiene guardia el jueves 19 a 4.ª hora, y una familia de su tutoría de 4.º A solo puede venir a esa hora.',
        'Pide que cubra su guardia otra persona, la que tú decidas, y que lo dejes en el cuadrante.',
      ],
      piden: 'Decidir quién cubre su guardia del jueves 19 a 4.ª hora y dejarlo en el cuadrante.',
      original: 'Hola, Javier:\n\nEste jueves 19 tengo guardia a 4.ª hora, y una familia de mi tutoría solo puede venir a esa hora. No quiero dejarlo para después de la evaluación.\n\n¿Puede cubrir mi guardia otra persona? Quien tú veas. Si te parece bien, ¿lo dejas en el cuadrante para que no haya líos?\n\nGracias,\nLaura',
      respuestas: [
        {
          titulo: 'Decirle que la cubre Rosa',
          texto: 'Hola, Laura:\n\nSin problema: el jueves 19 a 4.ª hora cubre tu guardia Rosa Medina, que tiene esa hora libre. Lo dejo así en el cuadrante.\n\nY otra cosa: el viernes 27 tienes guardia a 3.ª hora y estarás en la salida al Jardín Botánico. Esa guardia también la cubre otra persona; tú no tienes que hacer nada.\n\nQue vaya bien la tutoría.\n\nUn abrazo,\nJavier Martín\nJefe de estudios',
        },
        {
          titulo: 'Explicarle por qué la cubre Rosa',
          texto: 'Hola, Laura:\n\nLo he mirado: a 4.ª hora no hay nadie más de guardia, y Rosa Medina es la única que tiene esa hora libre. Así que el jueves 19 tu guardia la cubre ella. Lo dejo en el cuadrante.\n\nTe aviso también de que el viernes 27 tu guardia de 3.ª hora cae en la salida al Jardín Botánico, de 9:15 a 13:30. Esa también la cubre otra persona: cuando cierre las guardias de ese día, te digo quién.\n\nGracias por avisar con tiempo,\nJavier Martín\nJefe de estudios',
        },
      ],
      nota: 'DirectorIA propone a Rosa Medina, la única con la 4.ª libre. Ojo: el viernes 27 Laura está en la salida y hay que cubrir su guardia de 3.ª.',
    },
    {
      id: 'c-matematicas',
      de: 'Ramón Esteban',
      deDetalle: 'Jefe del Departamento de Matemáticas',
      asunto: 'Fecha del examen de 4.º ESO (1.ª evaluación)',
      hora: 'ayer',
      categoria: 'Claustro',
      etiqueta: { texto: 'Responder antes del vie 20', tipo: 'plazo' },
      resumen: [
        'Matemáticas propone el miércoles 2 de diciembre para el examen de 4.º ESO, el mismo día en los dos grupos.',
        'Si no encaja, les vale el jueves 3. Quieren decírselo a los alumnos esta semana.',
        'El miércoles 2, 4.º ESO A ya tiene Inglés. El jueves 3, 4.º ESO B tiene Lengua.',
      ],
      piden: 'Confirmar la fecha del examen de 4.º ESO esta semana.',
      original: 'Hola, Javier:\n\nEn la reunión de departamento de esta tarde hemos quedado en hacer el examen de la 1.ª evaluación de 4.º ESO el miércoles 2 de diciembre, en los dos grupos el mismo día. Es el mismo examen para A y B, y así no circulan las preguntas de un grupo a otro.\n\nEntran los temas 1 a 3. Si el miércoles no encaja, nos valdría el jueves 3.\n\n¿Nos lo confirmas cuando puedas? Queremos decírselo a los alumnos esta semana.\n\nGracias,\nRamón Esteban\nJefe del Departamento de Matemáticas',
      respuestas: [
        {
          titulo: 'Aceptar el miércoles 2',
          texto: 'Hola, Ramón:\n\nOs dejo el examen de 4.º ESO el miércoles 2, en los dos grupos. Ese día 4.º A tenía también Inglés, así que voy a proponer a Lenguas Extranjeras pasarlo al jueves 3, que el grupo tiene libre.\n\nPodéis decírselo ya a los alumnos. En cuanto lo cierre con Lenguas Extranjeras, publico el calendario completo para el claustro y las familias.\n\nUn abrazo,\nJavier Martín\nJefe de estudios',
        },
        {
          titulo: 'Proponer el jueves 3',
          texto: 'Hola, Ramón:\n\n¿Os vale el jueves 3, vuestra segunda opción? El miércoles 2, 4.º A ya tiene Inglés. Con el jueves solo habría que pasar Lengua de 4.º B al miércoles, que ese grupo tiene libre, y eso lo hablo yo con el Departamento de Lengua.\n\nDime algo antes del viernes y lo dejo cerrado en el calendario.\n\nUn abrazo,\nJavier Martín\nJefe de estudios',
        },
        {
          titulo: 'Preguntar si es de una sesión',
          texto: 'Hola, Ramón:\n\nGracias. Antes de cerrarlo, una pregunta: ¿el examen es de una sesión o necesitáis dos seguidas? Si es de dos, tengo que avisar en los dos grupos a quien tiene clase a la hora siguiente.\n\nEn cuanto me lo digas, te confirmo la fecha. Ten en cuenta que el miércoles 2, 4.º A ya tiene Inglés y habrá que moverlo.\n\nUn abrazo,\nJavier Martín\nJefe de estudios',
        },
      ],
      nota: 'DirectorIA ha puesto el examen en el calendario de la 1.ª evaluación, con una propuesta para resolver el choque.',
      ir: 'examenes',
    },
    {
      id: 'c-consejeria',
      de: 'Consejería de Educación',
      deDetalle: 'Comunidad de Madrid',
      asunto: 'Instrucciones sobre las sesiones de evaluación del primer trimestre',
      hora: 'lun 16',
      categoria: 'Consejería',
      etiqueta: { texto: 'Solo para leer', tipo: 'info' },
      resumen: [
        'Nota informativa sobre las sesiones de la 1.ª evaluación en Primaria y ESO: equipo docente, acta y aviso a las familias.',
        'Las calificaciones tienen que estar grabadas en Raíces antes del viernes 18 de diciembre.',
        'Las sesiones del colegio, del 9 al 11 de diciembre, encajan en ese plazo.',
      ],
      piden: '',
      original: 'Estimados equipos directivos:\n\nLes informamos de que está disponible en el portal de centros la nota informativa sobre el desarrollo de las sesiones de evaluación del primer trimestre del curso 2026-2027, para Educación Primaria y Educación Secundaria Obligatoria.\n\nLa nota recoge la composición del equipo docente en cada sesión, el contenido mínimo del acta y la información que debe trasladarse a las familias tras la evaluación. Les recordamos que las calificaciones del primer trimestre deberán estar grabadas en Raíces antes del 18 de diciembre de 2026.\n\nLes rogamos que hagan llegar esta información a la jefatura de estudios y a los equipos docentes.\n\nAtentamente,\nConsejería de Educación',
      adjuntos: ['Nota informativa sesiones de evaluación 1.er trimestre.pdf'],
      respuestas: [],
      nota: 'Solo para leer. DirectorIA te recordará el plazo de Raíces el lunes 14 de diciembre.',
    },
  ],

  // ───────────────────────────── Módulos ─────────────────────────────
  modulos: [
    // E1. Propuesta de guardias para cubrir a Sergio Prieto
    {
      id: 'guardias',
      tipo: 'aprobaciones',
      menu: 'Guardias de hoy',
      antetitulo: 'Ausencia de hoy · Sergio Prieto',
      titulo: 'Propuesta para cubrir a Sergio Prieto',
      entradilla: 'DirectorIA propone quién cubre cada sesión de Sergio, con las guardias bien repartidas. Revisa cada propuesta, cámbiala si hace falta y confírmala: hasta entonces no se avisa a nadie.',
      contexto: {
        titulo: 'Sergio Prieto · tutor de 3.º B',
        texto: 'Avisó a las 7:45 de que no viene hoy. Hay que cubrir tres sesiones con 3.º B y su turno de patio. Inglés, Educación Física y Música las dan especialistas.',
      },
      items: [
        {
          id: 'g1',
          cuando: '1.ª hora · 9:00-9:45',
          que: '3.º B · Lengua',
          propuesta: 'Pablo Sanz',
          motivo: 'Tiene guardia a esa hora. Lleva 2 guardias este mes; la media es 3.',
          alternativas: ['Rosa Medina', 'Teresa Gil'],
          ficha: true,
        },
        {
          id: 'g2',
          cuando: '3.ª hora · 10:30-11:15',
          que: '3.º B · Ciencias de la Naturaleza',
          propuesta: 'Rosa Medina',
          motivo: 'Tiene guardia a esa hora. Lleva 3 guardias este mes, en la media.',
          alternativas: ['Pablo Sanz', 'Teresa Gil'],
          ficha: true,
        },
        {
          id: 'g3',
          cuando: 'Recreo · 11:15-11:45',
          que: 'Vigilancia del patio de Primaria',
          propuesta: 'Teresa Gil',
          motivo: 'Cubre el turno de Sergio. Hoy no vigila y lleva 4 recreos este mes; la media es 6.',
          alternativas: ['Rosa Medina', 'Pablo Sanz'],
        },
        {
          id: 'g4',
          cuando: '6.ª hora · 15:15-16:00',
          que: '3.º B · Matemáticas',
          propuesta: 'Pablo Sanz',
          motivo: 'Así 3.º B acaba el día con la misma persona que lo empezó. Es la última hora: también hace la salida de las 16:00.',
          alternativas: ['Rosa Medina', 'Teresa Gil'],
          ficha: true,
        },
      ],
      boton: 'Confirmar',
      botonTodo: 'Confirmar todas',
      alConfirmar: 'Guardias confirmadas. Cada persona recibe su aviso y quien sustituye en 3.º B, su ficha. Dirección lo verá en su resumen.',
      bandera: 'guardias',
    },

    // E2. Vista previa de las fichas de sustitución: solo la clase. La línea fija de salud y recogidas la pone el motor.
    {
      id: 'fichas',
      tipo: 'ficha',
      menu: 'Fichas de sustitución',
      antetitulo: 'Vista previa · lo que recibe quien sustituye',
      titulo: 'Fichas de hoy para 3.º B',
      entradilla: 'Así verán Pablo Sanz y Rosa Medina sus fichas cuando confirmes las guardias. Solo la clase: la tarea de la programación quincenal de Sergio, el material y a quién llamar.',
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
        {
          sesion: '3.º B · Ciencias de la Naturaleza · 3.ª hora',
          hora: '10:30-11:15',
          aula: 'Aula de 3.º B, planta baja',
          para: 'Rosa Medina',
          origen: 'Preparada por DirectorIA · confirmada por jefatura',
          datos: [
            { dt: 'Tarea', dd: 'Unidad 3, los animales vertebrados: lectura de la página 34 y el cuadro de la página 35 en el cuaderno.' },
            { dt: 'Material', dd: 'Los libros de Ciencias, en el armario del aula. Las láminas de los vertebrados, en el corcho del fondo.' },
            { dt: 'A quién llamar', dd: 'Tutoría: Ana Torres, tutora de 3.º A (ext. 213) · Jefatura de estudios (ext. 202) · Conserjería (ext. 200)' },
            { dt: 'Al acabar', dd: 'A las 11:15, acompaña al grupo al patio. Hoy vigila Teresa Gil.' },
          ],
          pie: 'Se abre antes de la sesión y se cierra al acabar la jornada. Queda registrado quién la ve.',
        },
      ],
      registro: ['Vista previa abierta por Javier Martín (jefatura) hoy a las 7:56'],
    },

    // Calendario de exámenes de la 1.ª evaluación de ESO
    {
      id: 'examenes',
      tipo: 'tabla',
      menu: 'Exámenes',
      antetitulo: '1.ª evaluación · ESO',
      titulo: 'Calendario de exámenes del 30 de noviembre al 4 de diciembre',
      entradilla: 'DirectorIA ha reunido las fechas que han dado los departamentos y ha comprobado si algún grupo tiene dos exámenes el mismo día. Hay un choque: revisa la propuesta y aprueba el calendario.',
      columnas: ['Grupo', 'Lun 30', 'Mar 1', 'Mié 2', 'Jue 3', 'Vie 4'],
      filas: [
        ['1.º ESO A', 'Lengua', 'Biología y Geología', 'Geografía e Historia', 'Matemáticas', 'Inglés'],
        ['1.º ESO B', 'Matemáticas', 'Lengua', 'Inglés', 'Geografía e Historia', 'Biología y Geología'],
        ['2.º ESO A', 'Inglés', 'Matemáticas', 'Física y Química', 'Lengua', 'Geografía e Historia'],
        ['2.º ESO B', 'Geografía e Historia', 'Inglés', 'Lengua', 'Física y Química', 'Matemáticas'],
        ['3.º ESO A', 'Física y Química', 'Lengua', 'Matemáticas', 'Inglés', 'Biología y Geología'],
        ['3.º ESO B', 'Lengua', 'Biología y Geología', 'Inglés', 'Matemáticas', 'Física y Química'],
        ['4.º ESO A', 'Lengua', 'Geografía e Historia', 'Matemáticas e Inglés', 'Propuesta: Inglés', 'Física y Química'],
        ['4.º ESO B', 'Geografía e Historia', 'Inglés', 'Matemáticas', 'Lengua', 'Física y Química'],
      ],
      marcas: [
        { fila: 6, columna: 3, tipo: 'aviso' },
        { fila: 6, columna: 4, tipo: 'ok' },
      ],
      avisos: [
        { texto: '4.º ESO A tiene dos exámenes el miércoles 2: Matemáticas e Inglés. Propuesta: pasar Inglés al jueves 3, que ese grupo tiene libre.', estado: 'aviso' },
        { texto: 'Así se mantiene la fecha que pide Matemáticas para los dos grupos. Su segunda opción, el jueves 3, chocaría con Lengua en 4.º ESO B.', estado: 'info' },
        { texto: 'Antes de aprobar, coméntalo con el Departamento de Lenguas Extranjeras, que es quien tendría que mover el examen de Inglés.', estado: 'info' },
        { texto: 'El resto de grupos tiene como mucho un examen al día, como fijan las normas del centro.', estado: 'ok' },
      ],
      boton: 'Aprobar el calendario',
      alTerminar: 'Calendario aprobado, con Inglés de 4.º ESO A el jueves 3. Se publica para el claustro y para las familias de ESO.',
    },

    // Estado de las programaciones frente al modelo del centro
    {
      id: 'programaciones',
      tipo: 'tabla',
      menu: 'Programaciones',
      antetitulo: 'Programaciones didácticas de ESO · 2026-27',
      titulo: 'Programaciones frente al modelo del centro',
      entradilla: 'DirectorIA ha comparado la programación de cada departamento con los diez apartados del modelo del centro. Señala lo que falta, no si está bien hecha: eso lo valoras tú con cada departamento.',
      columnas: ['Departamento', 'Apartados del modelo', 'Qué falta'],
      filas: [
        ['Lengua Castellana y Literatura', '10 de 10', '—'],
        ['Matemáticas', '10 de 10', '—'],
        ['Ciencias', '10 de 10', '—'],
        ['Geografía e Historia', '10 de 10', '—'],
        ['Lenguas Extranjeras', '10 de 10', '—'],
        ['Tecnología', '10 de 10', '—'],
        ['Educación Física', '8 de 10', 'Evaluación de la práctica docente y atención a las diferencias individuales'],
        ['Música', '9 de 10', 'Evaluación de la práctica docente'],
        ['Educación Plástica', '10 de 10', '—'],
        ['Religión', '10 de 10', '—'],
      ],
      marcas: [
        { fila: 6, columna: 2, tipo: 'aviso' },
        { fila: 7, columna: 2, tipo: 'aviso' },
      ],
      avisos: [
        { texto: 'Educación Física y Música tienen apartados sin completar. Las dos coinciden en la evaluación de la práctica docente.', estado: 'aviso' },
        { texto: 'Las de Matemáticas, que pide inspección antes del lunes 23, están completas y ya están en el dosier que prepara dirección.', estado: 'ok' },
        { texto: 'En Primaria, las programaciones quincenales se entregan el viernes 20. De ellas sale la tarea de las fichas de sustitución.', estado: 'info' },
      ],
      boton: 'Pedir lo que falta',
      alTerminar: 'Has pedido a Educación Física y a Música que completen lo que falta. DirectorIA te avisará cuando suban la nueva versión.',
    },

    // E8. Informe de ausencias del profesorado: quién falta y a qué horas, sin motivos. Del justificante, solo si está
    // entregado o pendiente: los archivos los ve secretaría, no jefatura.
    {
      id: 'ausencias',
      tipo: 'justificantes',
      vista: 'informe',
      menu: 'Ausencias',
      antetitulo: 'Profesorado · noviembre de 2026',
      titulo: 'Ausencias del profesorado en noviembre',
      entradilla: 'Quién ha faltado este mes y a qué horas, y si el justificante está entregado. Sin motivos: el justificante va a su carpeta, y aquí solo pone «entregado» o «pendiente».',
      nota: 'Aquí no se ven: los ve secretaría.',
      curso: '2026-27',
      ausencias: [
        { docente: 'Sergio Prieto', fecha: '2026-11-18', horas: 'Toda la jornada', justificante: 'pendiente' },
        { docente: 'Laura Sánchez', fecha: '2026-11-16', horas: '9:00-10:30', justificante: 'pendiente', sigue: 'docente/justificantes#j1' },
        { docente: 'Teresa Gil', fecha: '2026-11-12', horas: 'Toda la jornada', justificante: 'entregado' },
        { docente: 'Rosa Medina', fecha: '2026-11-05', horas: '9:00-11:15', justificante: 'entregado' },
      ],
      reglas: [
        'El registro guarda quién falta y a qué horas. Nunca el motivo.',
        'Del justificante solo dice si está entregado o pendiente.',
        'Cada docente lo sube desde DirectorIA, no por correo.',
        'Las guardias de cada ausencia se proponen en «Guardias de hoy», con las reglas del colegio.',
      ],
    },
  ],
});
