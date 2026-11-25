DEMO.rol({
  id: 'jefatura',
  orden: 2,
  persona: {
    nombre: 'Javier Martín',
    cargo: 'Jefe de estudios',
    detalle: 'Jefatura de estudios · Primaria y ESO',
    ilustracion: 'jefatura',
  },
  acceso: 'Guardias y fichas de sustitución, exámenes, programaciones y correo resumido',

  // ───────────────────────────── Inicio ─────────────────────────────
  inicio: {
    antetitulo: 'Miércoles 18 de noviembre · 7:55',
    titulo: 'Buenos días, Javier',
    entradilla: 'Sergio Prieto no viene hoy: la propuesta de guardias y las fichas están listas para que las revises. Nada se confirma ni se envía sin ti.',
    bloques: [
      {
        titulo: 'Ausencias de hoy',
        items: [
          {
            texto: 'Sergio Prieto (3.º B) no viene hoy. La propuesta para cubrir sus tres sesiones y su turno de patio está lista: revísala y confírmala.',
            estado: 'pendiente',
            ir: 'guardias',
            bandera: 'guardias',
            textoSi: 'Has confirmado las guardias para cubrir a Sergio Prieto. Cada persona tiene ya su aviso.',
            estadoSi: 'hecho',
          },
          {
            texto: 'Las fichas de 1.ª, 3.ª y 6.ª hora de 3.º B están preparadas. Pablo Sanz y Rosa Medina las reciben cuando confirmes.',
            estado: 'pendiente',
            ir: 'fichas',
            bandera: 'guardias',
            textoSi: 'Quien sustituye en 3.º B ya tiene su ficha. Se cierra al acabar la jornada.',
            estadoSi: 'hecho',
          },
        ],
      },
      {
        titulo: 'Exámenes de la 1.ª evaluación',
        items: [
          {
            texto: '4.º ESO A tiene dos exámenes el miércoles 2 de diciembre: Matemáticas e Inglés. DirectorIA propone pasar Inglés al jueves 3.',
            estado: 'pendiente',
            ir: 'examenes',
          },
          {
            texto: 'Matemáticas espera tu respuesta sobre la fecha del examen de 4.º ESO para decírselo a los alumnos esta semana.',
            estado: 'pendiente',
            ir: 'correo:c-matematicas',
          },
        ],
      },
      {
        titulo: 'Programaciones',
        items: [
          {
            texto: 'Educación Física y Música tienen apartados sin completar. Las de Matemáticas, que pide inspección, están completas.',
            estado: 'pendiente',
            ir: 'programaciones',
          },
        ],
      },
      {
        titulo: 'Esta semana',
        items: [
          {
            texto: 'Caso 2026-07: entrevistas jue 19 y vie 20 (equipo del caso).',
            estado: 'info',
          },
          {
            texto: 'Laura Sánchez pide cambiar su guardia de mañana. El día que propone para devolverla coincide con la salida al Jardín Botánico.',
            estado: 'hoy',
            ir: 'correo:c-laura',
          },
          {
            texto: 'Una familia de 2.º ESO A pide cambiar de Francés a Tecnología. El plazo del centro terminó el 30 de septiembre.',
            estado: 'pendiente',
            ir: 'correo:c-optativa',
          },
        ],
      },
    ],
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
        'Sergio Prieto tiene fiebre y no viene hoy. Lo ha marcado en la app a las 7:45.',
        'La tarea de 3.º B está en su programación quincenal. Hoy le tocaba vigilar el patio en el recreo.',
        'Mañana a primera hora dirá si puede venir.',
      ],
      piden: 'Que se cubran sus sesiones con 3.º B y su turno de patio.',
      original: 'Hola, Javier:\n\nMe he levantado con fiebre y no voy a poder ir hoy. Ya lo he marcado en la app. Siento avisar tan justo.\n\nLo de hoy con 3.º B está en la programación quincenal que subí, con las páginas de cada asignatura. Los libros están en el armario del aula, como siempre.\n\nHoy me tocaba vigilar el patio en el recreo, por si hay que buscar a alguien.\n\nMañana a primera hora te digo cómo sigo.\n\nUn abrazo,\nSergio',
      respuestas: [
        {
          titulo: 'Recupérate; tu clase está cubierta',
          texto: 'Hola, Sergio:\n\nRecupérate tranquilo. Tu clase está cubierta: Pablo Sanz entra en 1.ª y en 6.ª hora, Rosa Medina en 3.ª y Teresa Gil se queda con tu turno de patio. Pablo y Rosa tienen su ficha con la tarea de tu programación quincenal.\n\nNo tienes que preparar nada más. Cuídate.\n\nUn abrazo,\nJavier Martín\nJefe de estudios',
        },
        {
          titulo: 'Pedir que avise esta tarde',
          texto: 'Hola, Sergio:\n\nGracias por avisar. Hoy está todo cubierto y la tarea sale de tu programación quincenal, así que olvídate de la clase.\n\nSi puedes, dime esta tarde, antes de las 18:00, si mañana vas a poder venir. Así dejo cerradas las guardias del jueves y quien te cubra tiene su ficha desde primera hora.\n\nQue te mejores.\n\nJavier Martín\nJefe de estudios',
        },
        {
          titulo: 'Recordar el justificante',
          texto: 'Hola, Sergio:\n\nQue te mejores. Tu clase está cubierta y no tienes que preparar nada.\n\nCuando vuelvas, deja en secretaría el justificante del médico, que Carmen lo necesita para el registro de ausencias. Si al final son más días, avísame y vemos con ella qué papeles hacen falta.\n\nUn abrazo,\nJavier Martín\nJefe de estudios',
        },
      ],
      nota: 'La propuesta para cubrirlo está en «Guardias de hoy». Confírmala antes de contestarle.',
      ir: 'guardias',
    },
    {
      id: 'c-optativa',
      de: 'Madre de Gonzalo R.',
      deDetalle: '2.º ESO A',
      asunto: 'Cambio de optativa: de Francés a Tecnología',
      hora: '7:20',
      categoria: 'Familias',
      etiqueta: { texto: 'Responder esta semana', tipo: 'plazo' },
      resumen: [
        'La madre de Gonzalo R. (2.º ESO A) pide pasarlo de Francés a Tecnología: le cuesta mucho seguir las clases.',
        'El plazo del centro para cambiar de optativa terminó el 30 de septiembre.',
        'Las normas permiten un cambio excepcional al acabar la 1.ª evaluación, si hay plaza. En Tecnología de 2.º quedan 3.',
      ],
      piden: 'Saber si Gonzalo puede pasar de Francés a Tecnología este curso.',
      original: 'Buenos días:\n\nLes escribo porque a mi hijo Gonzalo, de 2.º ESO A, le está costando mucho el Francés este curso. Se esfuerza, pero no consigue seguir las clases y está bastante desmotivado.\n\nNos gustaría saber si es posible cambiarlo a Tecnología, que le gusta mucho y en la que creemos que estaría más a gusto. Sabemos que el curso ya ha empezado, pero preferimos preguntarlo antes de que acabe el trimestre.\n\nQuedamos a la espera de su respuesta. Muchas gracias.\n\nUn saludo,\nCristina, madre de Gonzalo R. (2.º ESO A)',
      respuestas: [
        {
          titulo: 'Explicar el plazo y cómo pedirlo',
          texto: 'Buenos días:\n\nGracias por contarnos cómo está Gonzalo. El plazo para cambiar de optativa terminó el 30 de septiembre, así que ahora no podemos hacer el cambio directamente.\n\nLas normas del centro sí permiten estudiarlo de forma excepcional al acabar la 1.ª evaluación. Si quieren pedirlo, envíennos antes del viernes 4 de diciembre la solicitud firmada, que tienen en secretaría. El equipo docente lo valorará en la sesión de evaluación y les comunicaré la decisión. Si sale adelante, Gonzalo empezaría Tecnología en enero, con un plan para ponerse al día.\n\nUn saludo,\nJavier Martín\nJefe de estudios del Colegio Ejemplo',
        },
        {
          titulo: 'Proponer una reunión',
          texto: 'Buenos días:\n\nGracias por escribirnos. Antes de plantear el cambio, me gustaría hablarlo con ustedes con calma y saber cómo lo está viviendo Gonzalo. El plazo ordinario terminó el 30 de septiembre, pero hay margen para estudiar un cambio excepcional al acabar el trimestre.\n\n¿Les vendría bien el miércoles 25 a las 15:30 o el viernes 27 a las 9:00? Si ninguna de las dos fechas les encaja, díganme qué día les viene mejor.\n\nUn saludo,\nJavier Martín\nJefe de estudios del Colegio Ejemplo',
        },
        {
          titulo: 'Contestar antes del viernes',
          texto: 'Buenos días:\n\nGracias por escribirnos y por contarnos cómo está Gonzalo. Antes de darles una respuesta, quiero hablarlo con el Departamento de Lenguas Extranjeras y con la tutoría de 2.º ESO A.\n\nLes escribiré antes del viernes 20 con una respuesta concreta y, si el cambio es posible, con los pasos que hay que dar.\n\nUn saludo,\nJavier Martín\nJefe de estudios del Colegio Ejemplo',
        },
      ],
    },
    {
      id: 'c-laura',
      de: 'Laura Sánchez',
      deDetalle: 'Tutora de 4.º A de Primaria',
      asunto: 'Cambio de guardia del jueves',
      hora: 'ayer',
      categoria: 'Claustro',
      etiqueta: { texto: 'Responder hoy', tipo: 'hoy' },
      resumen: [
        'Laura Sánchez pide cambiar su guardia del jueves 19 a 4.ª hora: tiene tutoría con una familia de 4.º A.',
        'Rosa Medina la hace por ella y Laura le devuelve la del viernes 27 a 3.ª hora.',
      ],
      piden: 'Aprobar el cambio de guardia y anotarlo en el cuadrante.',
      original: 'Hola, Javier:\n\n¿Te importa si cambio mi guardia de este jueves a 4.ª hora? Una familia de mi tutoría solo puede venir a esa hora y no quiero dejarlo para después de la evaluación.\n\nLo he hablado con Rosa y me la hace ella. A cambio, yo le hago la suya del viernes 27 a 3.ª hora.\n\nSi te parece bien, ¿lo cambias en el cuadrante para que no haya líos?\n\nGracias,\nLaura',
      respuestas: [
        {
          titulo: 'Aprobar y cambiar el día de vuelta',
          texto: 'Hola, Laura:\n\nPor mi parte, de acuerdo: el jueves 19 a 4.ª hora hace la guardia Rosa. Lo que no puede ser es la vuelta del viernes 27, porque ese día estás en la salida al Jardín Botánico hasta las 13:30.\n\nTe propongo que le hagas la del lunes 30 a 3.ª hora: Rosa tiene guardia y tú estás libre. Si a ella le viene bien, lo dejo así en el cuadrante.\n\nQue vaya bien la tutoría.\n\nUn abrazo,\nJavier Martín\nJefe de estudios',
        },
        {
          titulo: 'Pedir otro día para la vuelta',
          texto: 'Hola, Laura:\n\nEl cambio del jueves está aprobado: a 4.ª hora hace la guardia Rosa. Pero el viernes 27 estás en la salida al Jardín Botánico, de 9:15 a 13:30, así que ese día no puedes devolvérsela.\n\n¿Podéis mirar entre las dos otro día? Cuando me lo digáis, lo cambio en el cuadrante.\n\nGracias,\nJavier Martín\nJefe de estudios',
        },
      ],
      nota: 'Ojo: el viernes 27 Laura está en la salida al Jardín Botánico (9:15-13:30). La vuelta que propone no puede ser.',
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
          texto: 'Hola, Ramón:\n\nOs dejo el examen de 4.º ESO el miércoles 2, en los dos grupos. Ese día 4.º A tenía también Inglés, así que voy a proponer a Lenguas Extranjeras pasarlo al jueves 3, que el grupo tiene libre.\n\nPodéis decírselo ya a los alumnos. En cuanto lo cierre con ellos, publico el calendario completo para el claustro y las familias.\n\nUn abrazo,\nJavier Martín\nJefe de estudios',
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
        texto: 'Avisó a las 7:45 de que tiene fiebre y no viene hoy. Hay que cubrir tres sesiones con 3.º B y su turno de patio. Inglés, Educación Física y Música las dan especialistas.',
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
          motivo: 'Así 3.º B acaba el día con la misma persona que lo empezó. Es la última hora: su ficha incluye la recogida de las 16:00.',
          alternativas: ['Rosa Medina', 'Teresa Gil'],
          ficha: true,
        },
      ],
      boton: 'Confirmar',
      botonTodo: 'Confirmar todas',
      alConfirmar: 'Guardias confirmadas. Cada persona recibe su aviso y quien sustituye en 3.º B, su ficha. Dirección lo verá en su resumen.',
      bandera: 'guardias',
    },

    // E2. Vista previa de las fichas de sustitución
    {
      id: 'fichas',
      tipo: 'ficha',
      menu: 'Fichas de sustitución',
      antetitulo: 'Vista previa · lo que recibe quien sustituye',
      titulo: 'Fichas de hoy para 3.º B',
      entradilla: 'Así verán Pablo Sanz y Rosa Medina sus fichas cuando confirmes las guardias. La tarea sale de la programación quincenal de Sergio; las pautas, la salud y las recogidas las ponen tutoría, orientación y dirección.',
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
        {
          sesion: '3.º B · Ciencias de la Naturaleza · 3.ª hora',
          hora: '10:30-11:15',
          origen: 'Preparada por DirectorIA para Rosa Medina',
          datos: [
            { dt: 'Tarea', dd: 'Unidad 3, los animales vertebrados: lectura de la página 34 y el cuadro de la página 35 en el cuaderno.' },
            { dt: 'Necesidades', dd: 'Mario: instrucciones por escrito y más tiempo.' },
            { dt: 'Salud', dd: 'Lucía: alérgica a frutos secos. Su autoinyector está en conserjería.', aviso: true },
            { dt: 'Al acabar', dd: 'A las 11:15 acompaña al grupo al patio. Hoy vigila Teresa Gil.' },
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
      entradilla: 'DirectorIA ha reunido las fechas que han dado los departamentos y ha comprobado que ningún grupo tenga dos exámenes el mismo día. Hay un choque: revisa la propuesta y aprueba el calendario.',
      columnas: ['Grupo', 'Lun 30', 'Mar 1', 'Mié 2', 'Jue 3', 'Vie 4'],
      filas: [
        ['1.º ESO A', 'Lengua', 'Biología y Geología', 'Geografía e Historia', 'Matemáticas', 'Inglés'],
        ['1.º ESO B', 'Matemáticas', 'Lengua', 'Inglés', 'Geografía e Historia', 'Biología y Geología'],
        ['2.º ESO A', 'Inglés', 'Matemáticas', 'Física y Química', 'Lengua', 'Geografía e Historia'],
        ['2.º ESO B', 'Geografía e Historia', 'Inglés', 'Lengua', 'Física y Química', 'Matemáticas'],
        ['3.º ESO A', 'Física y Química', 'Lengua', 'Matemáticas', 'Inglés', 'Biología y Geología'],
        ['3.º ESO B', 'Lengua', 'Biología y Geología', 'Inglés', 'Matemáticas', 'Física y Química'],
        ['4.º ESO A', 'Lengua', 'Geografía e Historia', 'Matemáticas e Inglés', '—', 'Física y Química'],
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
  ],
});
