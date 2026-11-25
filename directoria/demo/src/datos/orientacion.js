DEMO.rol({
  id: 'orientacion',
  orden: 5,
  persona: {
    nombre: 'Andrés Vidal',
    cargo: 'Orientador',
    detalle: 'Departamento de Orientación',
    ilustracion: 'orientacion',
  },
  acceso: 'Protocolo de acoso paso a paso, pautas para el aula, lectura fácil y correo resumido',

  // ─── Inicio ───────────────────────────────────────────────────────
  inicio: {
    antetitulo: 'Miércoles 18 de noviembre · 8:00',
    titulo: 'Buenos días, Andrés',
    entradilla: 'El Caso 2026-07, tus entrevistas, las pautas para el aula y una circular por revisar. Lo ha preparado DirectorIA; nada se envía sin ti.',
    bloques: [
      {
        titulo: 'Caso 2026-07',
        items: [
          {
            texto: 'Paso 4 de 9: recogida de información (Anexo II), hasta el lunes 23. La reunión para la toma de decisiones es el martes 24.',
            estado: 'pendiente',
            ir: 'acoso',
          },
          {
            texto: 'La citación a la familia de Alumno/a A, para el viernes 20 a las 17:00, está pendiente de la firma de la directora.',
            estado: 'pendiente',
            ir: 'acoso',
          },
          {
            texto: 'Nuria Castro te pide antes del jueves el guion para el alumnado observador. El borrador está listo para que lo revises.',
            estado: 'hoy',
            ir: 'correo:c-nuria',
          },
        ],
      },
      {
        titulo: 'Entrevistas de hoy y de mañana',
        items: [
          {
            texto: 'Caso 2026-07 · hoy a las 10:15: Alumno/a A, en el despacho de orientación. Tienes el guion en el expediente.',
            estado: 'hoy',
            ir: 'acoso',
          },
          {
            texto: 'Caso 2026-07 · mañana, jueves 19: alumnado observador por la mañana y profesorado del grupo, de 15:00 a 17:00.',
            estado: 'pendiente',
            ir: 'acoso',
          },
        ],
      },
      {
        titulo: 'Pautas para el aula',
        items: [
          {
            texto: 'Quien cubra hoy a Sergio Prieto en 3.º B verá en su ficha la pauta de Mario. Falta que jefatura confirme las guardias.',
            estado: 'info',
            ir: 'pautas',
            bandera: 'guardias',
            textoSi: 'Jefatura ha confirmado las guardias: Pablo Sanz (1.ª y 6.ª) y Rosa Medina (3.ª) verán la pauta de Mario en sus fichas. Queda registrado.',
            estadoSi: 'hecho',
          },
          {
            texto: 'Pauta de Amira (4.º A) actualizada el lunes 16 con su tutora: instrucciones cortas y con apoyo visual.',
            estado: 'hecho',
            ir: 'pautas',
          },
          {
            texto: 'Beatriz Romero pide pautas de organización del aula para 2.º ESO B. La propuesta, sin nombres, está lista para revisar.',
            estado: 'pendiente',
            ir: 'correo:c-beatriz',
          },
        ],
      },
      {
        titulo: 'Para revisar y enviar',
        items: [
          {
            texto: 'Circular de la salida al Jardín Botánico para la familia de Amira (4.º A), en lectura fácil y en inglés. Las autorizaciones se entregan antes del viernes 20.',
            estado: 'hoy',
            ir: 'traduccion',
          },
          {
            texto: 'La madre de Mario (3.º B) pide una reunión el jueves o el viernes por la tarde, cuando tienes entrevistas. Las respuestas proponen otros días.',
            estado: 'pendiente',
            ir: 'correo:c-mario',
          },
        ],
      },
    ],
  },

  // ─── Correo ───────────────────────────────────────────────────────
  correo: [
    {
      id: 'c-nuria',
      de: 'Nuria Castro',
      deDetalle: 'Coordinadora de bienestar y protección',
      asunto: 'Caso 2026-07: entrevistas de esta semana',
      hora: '7:40',
      categoria: 'Claustro',
      etiqueta: { texto: 'Guion antes del jue 19', tipo: 'plazo' },
      resumen: [
        'Entrevistas del Caso 2026-07: hoy a las 10:15, en tu despacho; alumnado observador, jueves 19 y viernes 20 por la mañana.',
        'Profesorado del grupo, el jueves 19 de 15:00 a 17:00. La familia, el viernes 20 a las 17:00, en tu despacho.',
        'Pide el guion para el alumnado observador antes del jueves, para repasarlo con los dos docentes designados.',
      ],
      piden: 'Pasarle el guion de la entrevista al alumnado observador antes del jueves 19.',
      original: 'Buenos días, Andrés:\n\nTe recuerdo las entrevistas del Caso 2026-07 que tenemos esta semana:\n\n- Hoy, a las 10:15: la primera, en tu despacho.\n- Jueves 19 y viernes 20, por la mañana: alumnado observador, de uno en uno.\n- Jueves 19, de 15:00 a 17:00: profesorado del grupo, en la sala de reuniones pequeña.\n- Viernes 20, a las 17:00: la familia, en tu despacho.\n\n¿Me pasas antes del jueves el guion para el alumnado observador? Quiero repasarlo con los dos compañeros designados antes de empezar.\n\nY ya sabes: por correo, solo el número del caso. Todo lo demás, en el expediente.\n\nUn abrazo,\nNuria Castro\nCoordinadora de bienestar y protección',
      respuestas: [
        {
          titulo: 'Pasarle el guion hoy',
          texto: 'Buenos días, Nuria:\n\nGracias por el recordatorio; lo tengo todo en la agenda.\n\nReviso el guion para el alumnado observador esta mañana, después de la primera entrevista, y te lo dejo antes de las 14:00 en el expediente del Caso 2026-07, en la carpeta del Anexo II. Si tú o los dos compañeros designados queréis cambiar algo, decídmelo y lo ajusto esta tarde.\n\nUn abrazo,\nAndrés Vidal\nOrientador',
        },
        {
          titulo: 'Repasarlo juntos hoy a las 14:45',
          texto: 'Buenos días, Nuria:\n\nGracias por el recordatorio. Prefiero que repasemos el guion juntos, con los dos compañeros designados, para que todos hagamos las mismas preguntas y en el mismo orden. ¿Os viene bien hoy a las 14:45, al acabar las clases de ESO, en mi despacho? Con media hora basta.\n\nOs lo dejo antes en el expediente del Caso 2026-07 para que podáis leerlo.\n\nUn abrazo,\nAndrés Vidal\nOrientador',
        },
        {
          titulo: 'Preguntar quién avisa al profesorado',
          texto: 'Buenos días, Nuria:\n\nGracias por el recordatorio. Te dejo el guion en el expediente del Caso 2026-07 antes de las 14:00.\n\nUna pregunta para el jueves y el viernes: ¿quién avisa al profesorado que tenga clase con el grupo cuando saquemos a cada alumno? Propongo que lo coordine Javier desde jefatura, con un aviso discreto y sin dar detalles del caso. Si te parece bien, se lo pido yo hoy.\n\nUn abrazo,\nAndrés Vidal\nOrientador',
        },
      ],
      nota: 'Por correo, solo el número del caso. El guion, preparado con la plantilla del protocolo, está en «Protocolo de acoso» para que lo revises.',
      ir: 'acoso',
    },
    {
      id: 'c-mario',
      de: 'Madre de Mario',
      deDetalle: '3.º B de Primaria',
      asunto: '¿Podemos hablar de cómo va Mario?',
      hora: '7:15',
      categoria: 'Familias',
      etiqueta: { texto: 'Responder hoy', tipo: 'hoy' },
      resumen: [
        'La madre de Mario (3.º B) quiere saber cómo lleva lo acordado en septiembre: instrucciones por escrito y más tiempo.',
        'En casa tarda mucho con los deberes y algunas tardes acaba agobiado. Pregunta cómo pueden ayudarle.',
        'Propone veros esta semana, el jueves 19 o el viernes 20, a partir de las 16:15.',
      ],
      piden: 'Una reunión esta semana, por la tarde, para hablar de cómo va Mario.',
      original: 'Buenos días, Andrés:\n\nSoy Marisa, la madre de Mario, de 3.º B. En septiembre acordamos con usted y con Sergio, su tutor, que en clase le dieran las instrucciones por escrito y algo más de tiempo para las tareas. Nos gustaría saber cómo lo está llevando y si se nota.\n\nEn casa lo vemos más tranquilo, pero con los deberes sigue tardando mucho y algunas tardes acaba agobiado. Queremos saber qué podemos hacer nosotros para ayudarle.\n\n¿Podríamos vernos esta semana? Por las tardes puedo a partir de las 16:15; el jueves o el viernes me vendrían muy bien.\n\nMuchas gracias,\nMarisa, madre de Mario (3.º B)',
      respuestas: [
        {
          titulo: 'Proponer el miércoles 25 o el jueves 26',
          texto: 'Buenos días, Marisa:\n\nGracias por escribirme. Me parece muy bien que lo hablemos. El jueves y el viernes por la tarde ya tengo reuniones; ¿le viene bien el miércoles 25 o el jueves 26 de noviembre, a las 16:15, en el despacho de orientación?\n\nLe pediré a Sergio, su tutor, que venga también: él ve a Mario cada día en clase. Llevaremos lo que hemos observado este trimestre y algunas ideas para organizar los deberes en casa.\n\nUn saludo,\nAndrés Vidal\nOrientador del Colegio Ejemplo',
        },
        {
          titulo: 'Ofrecer una llamada mañana',
          texto: 'Buenos días, Marisa:\n\nGracias por escribirme. El jueves y el viernes por la tarde ya tengo reuniones, pero no quiero que tengan que esperar. ¿Le parece que la llame mañana, jueves 19, a las 13:00? En un cuarto de hora le cuento cómo lo vemos en clase y hablamos de los deberes.\n\nDespués, si quiere, nos vemos con calma con su tutor el miércoles 25 a las 16:15.\n\nUn saludo,\nAndrés Vidal\nOrientador del Colegio Ejemplo',
        },
        {
          titulo: 'Preguntar por los deberes antes',
          texto: 'Buenos días, Marisa:\n\nGracias por escribirme. Para aprovechar bien la reunión, ¿me puede contar antes cuánto tiempo le llevan a Mario los deberes un día normal y en qué asignaturas se atasca más? Si quiere, traiga algún cuaderno.\n\nLe propongo vernos el miércoles 25 a las 16:15, en el despacho de orientación, con su tutor. Si no le viene bien, dígame otra tarde de esa semana.\n\nUn saludo,\nAndrés Vidal\nOrientador del Colegio Ejemplo',
        },
      ],
      nota: 'Jueves y viernes por la tarde tienes entrevistas del Caso 2026-07; las respuestas proponen otros días. Su pauta, en «Pautas para el aula».',
      ir: 'pautas',
    },
    {
      id: 'c-beatriz',
      de: 'Beatriz Romero',
      deDetalle: 'Tutora de 2.º ESO B',
      asunto: 'Pautas para organizar la clase de 2.º B',
      hora: 'ayer',
      categoria: 'Claustro',
      etiqueta: { texto: 'Pautas antes del lun 30', tipo: 'plazo' },
      resumen: [
        'Beatriz Romero pide pautas de organización del aula para un alumno de 2.º ESO B al que le cuesta mantener la atención.',
        'Se pierde en las explicaciones largas, deja tareas a medias y no apunta los deberes. No tiene diagnóstico.',
        'Quiere compartirlas con el equipo docente antes de los exámenes de la evaluación, que empiezan el lunes 30.',
      ],
      piden: 'Unas pautas sencillas para el aula, antes del lunes 30, para compartirlas con el equipo docente.',
      original: 'Hola, Andrés:\n\nTe escribo por un alumno de mi tutoría de 2.º B al que le cuesta mucho mantener la atención. Se pierde en las explicaciones largas, deja las tareas a medias y casi nunca apunta los deberes en la agenda. No tiene ningún diagnóstico y la familia no nos ha comentado nada.\n\nNo quiero ponerle etiquetas, pero sí organizar mejor la clase para que no se descuelgue. ¿Me puedes pasar algunas pautas sencillas? Me gustaría compartirlas con el equipo docente antes de los exámenes de la evaluación, que empiezan el lunes 30.\n\nGracias,\nBeatriz\n\nP. D.: no te pongo su nombre por correo; si lo necesitas, te lo digo en persona.',
      respuestas: [
        {
          titulo: 'Enviar cinco pautas para el aula',
          texto: 'Hola, Beatriz:\n\nGracias por contármelo, y por no poner su nombre. Sin diagnóstico, lo mejor es organizar la clase para que le ayude a él y, de paso, a todo el grupo. Te propongo cinco pautas:\n\n1. Siéntalo cerca de ti, lejos de la puerta y de la ventana.\n2. Explica en bloques cortos y deja en la pizarra los pasos de la tarea.\n3. Divide las tareas largas en partes y revisa cada una.\n4. Antes de que suene el timbre, comprueba con él que ha apuntado los deberes.\n5. En los exámenes, deja espacio para responder debajo de cada pregunta.\n\nSi dentro de unas semanas sigues viendo lo mismo, lo hablamos y quedamos con la familia para ver cómo lo ven en casa.\n\nUn abrazo,\nAndrés Vidal\nOrientador',
        },
        {
          titulo: 'Proponer ver una clase antes',
          texto: 'Hola, Beatriz:\n\nGracias por contármelo. Antes de darte pautas a ciegas, me gustaría ver cómo funciona la clase. ¿Qué día de la semana que viene tienes con el grupo una sesión con explicación larga? Me siento al fondo, como en otras observaciones, y luego lo comentamos diez minutos.\n\nMientras tanto, prueba a dejar en la pizarra los pasos de cada tarea: suele ayudar a todo el grupo.\n\nUn abrazo,\nAndrés Vidal\nOrientador',
        },
        {
          titulo: 'Preparar juntos una hoja para el equipo',
          texto: 'Hola, Beatriz:\n\nGracias por escribirme. Te propongo que preparemos juntos una hoja de pautas para el equipo docente de 2.º B, sin nombres, para que todos hagáis lo mismo en clase. ¿Te viene bien el miércoles 25 a las 14:45, al acabar las clases, en mi despacho? Con media hora nos basta.\n\nAsí la tenéis antes de los exámenes del lunes 30.\n\nUn abrazo,\nAndrés Vidal\nOrientador',
        },
      ],
      nota: 'DirectorIA no diagnostica: propone pautas de aula que sirven a todo el grupo. Las tienes, sin nombres, en «Pautas para el aula».',
      ir: 'pautas',
    },
    {
      id: 'c-laura',
      de: 'Laura Sánchez',
      deDetalle: 'Tutora de 4.º A de Primaria',
      asunto: 'Circular del Botánico para la familia de Amira',
      hora: 'ayer',
      categoria: 'Claustro',
      etiqueta: { texto: 'Autorizaciones el vie 20', tipo: 'plazo' },
      resumen: [
        'Laura Sánchez pide una versión en inglés de la circular de la salida al Jardín Botánico del viernes 27 para la familia de Amira (4.º A).',
        'Si se puede, también en lectura fácil: la familia está aprendiendo español.',
        'Las autorizaciones firmadas se entregan antes del viernes 20.',
      ],
      piden: 'Revisar la circular y preparar las versiones en inglés y en lectura fácil antes del viernes 20.',
      original: 'Hola, Andrés:\n\nTe escribo por Amira, la alumna que se incorporó a mi clase en octubre. Su familia prefiere que les escribamos en inglés, y la circular de la salida al Jardín Botánico solo está en español. Me da miedo que no les llegue bien y que Amira se quede sin ir: las autorizaciones hay que entregarlas antes del viernes 20.\n\n¿Puedes revisar la circular y preparar una versión en inglés? Si además puede ir una en lectura fácil, mejor: la familia está aprendiendo español y a Amira le vendrá bien para leerla con ellos.\n\nTe la adjunto. Gracias,\nLaura',
      adjuntos: ['Circular de la salida al Jardín Botánico.pdf'],
      respuestas: [
        {
          titulo: 'Confirmar que se las envías hoy',
          texto: 'Hola, Laura:\n\nGracias por avisar. Ya tengo las dos versiones de la circular, en inglés y en lectura fácil. Las reviso esta mañana y se las envío hoy a la familia de Amira desde la cuenta del colegio, con el original en español. Te pongo en copia.\n\nAsí tienen tiempo de devolverte la autorización firmada antes del viernes 20.\n\nUn abrazo,\nAndrés Vidal\nOrientador',
        },
        {
          titulo: 'Preguntar cómo prefieren recibirla',
          texto: 'Hola, Laura:\n\nLas versiones en inglés y en lectura fácil están casi listas. Antes de enviarlas, una pregunta: ¿la familia de Amira lee el correo del colegio o le llegan mejor las cosas en papel? Si es en papel, te las imprimo y Amira se las lleva mañana en la mochila, con la autorización.\n\nDime qué prefieres y lo hago hoy.\n\nUn abrazo,\nAndrés Vidal\nOrientador',
        },
        {
          titulo: 'Pedirle que las vea antes',
          texto: 'Hola, Laura:\n\nTe mando primero a ti las dos versiones de la circular, en inglés y en lectura fácil, para que las veas: tú conoces mejor a la familia. Si te parecen bien, se las envío esta tarde a la familia de Amira, con el original en español y contigo en copia.\n\nHe puesto tu nombre como contacto y les digo que pueden escribirte en inglés. Si prefieres otra cosa, dímelo.\n\nUn abrazo,\nAndrés Vidal\nOrientador',
        },
      ],
      nota: 'DirectorIA ha preparado la versión en lectura fácil y la inglesa en «Circulares adaptadas». Revísalas y envíalas tú.',
      ir: 'traduccion',
    },
    {
      id: 'c-formacion',
      de: 'Centro de formación del profesorado',
      deDetalle: 'Cursos para docentes · Madrid',
      asunto: 'Curso «Lectura fácil en la escuela»: inscripción abierta',
      hora: 'lun 16',
      categoria: 'Otros',
      etiqueta: { texto: 'Inscripción hasta el vie 11 dic', tipo: 'info' },
      resumen: [
        'Curso de lectura fácil para docentes: 20 horas en línea, con dos sesiones presenciales, los miércoles del 13 de enero al 24 de febrero.',
        'Es gratuito y con certificado. Inscripción hasta el viernes 11 de diciembre o hasta cubrir las 30 plazas.',
      ],
      piden: '',
      original: 'Estimado Departamento de Orientación:\n\nLes informamos de que está abierta la inscripción del curso «Lectura fácil en la escuela: circulares, normas y documentos para las familias», dirigido a orientadores, tutores y equipos directivos de Infantil, Primaria y Secundaria.\n\nEl curso dura 20 horas. Es en línea, con dos sesiones presenciales en Madrid, y se celebra del 13 de enero al 24 de febrero de 2027, los miércoles de 17:30 a 19:30. Cada participante trabaja con circulares reales de su centro, sin datos personales, y las valida con lectores.\n\nLa inscripción es gratuita y está abierta hasta el 11 de diciembre o hasta cubrir las 30 plazas. Al terminar, se entrega un certificado de 20 horas.\n\nAtentamente,\nSecretaría de cursos\nCentro de formación del profesorado',
      adjuntos: ['Programa del curso de lectura fácil.pdf'],
      respuestas: [],
      nota: 'Solo para leer. Encaja con las circulares que adaptas para las familias. DirectorIA te recuerda la inscripción el miércoles 2 de diciembre.',
    },
  ],

  // ─── Módulos ──────────────────────────────────────────────────────
  modulos: [
    // E3. Caso 2026-07: protocolo paso a paso, con reserva
    {
      id: 'acoso',
      tipo: 'protocolo',
      menu: 'Protocolo de acoso',
      antetitulo: 'Protocolo de acoso escolar · Comunidad de Madrid',
      titulo: 'Caso 2026-07 · posible acoso escolar',
      entradilla: 'DirectorIA lleva el calendario del protocolo, te recuerda cada paso y prepara anexos, guiones y citaciones. Lo revisáis y lo decidís tú y el equipo del caso; nada se envía ni se firma solo.',
      confidencial: 'Confidencial · solo equipo del caso, con registro de accesos',
      caso: 'Alumno/a A, 2.º ESO B · lo comunicó la tutora el lun 16 nov a las 9:40',
      pasos: [
        { nombre: 'Comunicación a la dirección', estado: 'hecho', nota: 'lun 16 nov · Anexo I.a' },
        { nombre: 'Apertura y comunicación oficial', estado: 'hecho', nota: 'lun 16 nov · Raíces' },
        { nombre: 'Medidas de protección', estado: 'hecho', nota: 'Adoptadas el lun 16 nov' },
        { nombre: 'Recogida de información', estado: 'curso', nota: 'Anexo II · del mar 17 al lun 23 nov' },
        { nombre: 'Reunión para la toma de decisiones', estado: 'pendiente', nota: 'mar 24 nov · Anexo III' },
        { nombre: 'Fiscalía de Menores e Inspección', estado: 'condicional', nota: 'Lo comunica la dirección' },
        { nombre: 'Familias y plan de intervención', estado: 'condicional', nota: 'Con todo el alumnado implicado' },
        { nombre: 'Procedimiento disciplinario', estado: 'condicional', nota: 'Según el Decreto 32/2019 de convivencia' },
        { nombre: 'Seguimiento y cierre', estado: 'pendiente', nota: 'Anexo IV.c · Raíces' },
      ],
      actual: {
        titulo: 'Paso 4 de 9 · Recogida de información (Anexo II)',
        secciones: [
          {
            titulo: 'Entrevistas previstas',
            items: [
              'Alumno/a A · hoy, mié 18, a las 10:15 · despacho de orientación',
              'Compañeros observadores · jue 19 y vie 20, por la mañana, de uno en uno',
              'Profesorado del grupo · jue 19, de 15:00 a 17:00 · sala de reuniones pequeña',
              'Familia de Alumno/a A · vie 20, a las 17:00 · despacho de orientación',
              'Alumnado mencionado (B y C) y sus familias · lun 23',
            ],
          },
          {
            titulo: 'Equipo del caso',
            items: [
              'Los dos docentes que designó la dirección el mar 17',
              'Tú, como orientador',
              'Nuria Castro, coordinadora de bienestar y protección',
              'Javier Martín, jefe de estudios',
              'Beatriz Romero, tutora de 2.º ESO B',
            ],
          },
          {
            titulo: 'Medidas de protección en vigor',
            items: [
              'Vigilancia reforzada en el recreo, en los cambios de clase y a la salida',
              'Su tutora es cada día la persona de referencia de Alumno/a A',
              'El profesorado del grupo sabe qué vigilar, sin los detalles del caso',
            ],
          },
          {
            titulo: 'Antes de la reunión del mar 24',
            items: [
              'Anexo II completo, con todas las entrevistas, el lunes 23 por la tarde',
              'Convocatoria de la reunión para todo el equipo del caso',
              'DirectorIA guarda lo recogido en cada entrevista en su apartado del Anexo II; no lo valora ni saca conclusiones',
            ],
          },
        ],
      },
      documentos: [
        { nombre: 'Anexo I.a · comunicación de la tutora', estado: 'Firmado el lun 16' },
        { nombre: 'Anexo II con los datos del caso · se completa con cada entrevista', estado: 'En curso' },
        { nombre: 'Guion de la entrevista con Alumno/a A · hoy a las 10:15', estado: 'Revisado por ti' },
        { nombre: 'Guion para el alumnado observador · antes del jue 19', estado: 'Para revisar' },
        { nombre: 'Citación a la familia de Alumno/a A · la firma la directora', estado: 'Pendiente de firma' },
        { nombre: 'Convocatoria de la reunión del mar 24 (Anexo III)', estado: 'Para revisar' },
      ],
      pie: 'DirectorIA guía, recuerda y prepara los documentos con las plantillas del protocolo. Si hay acoso, y con qué medidas, lo decide el equipo del centro. El expediente del caso no pasa por la IA.',
    },

    // Pautas para el aula: qué hacer, para quién y quién la ve
    {
      id: 'pautas',
      tipo: 'tabla',
      menu: 'Pautas para el aula',
      antetitulo: 'Departamento de Orientación · curso 2026-27',
      titulo: 'Pautas para el aula y quién las ve',
      entradilla: 'Las pautas que acuerdas con cada tutoría. Cada docente ve solo las de sus grupos, y quien sustituye, las del grupo que cubre, en su ficha. Sin diagnósticos ni informes.',
      columnas: ['Grupo', 'Alumno/a', 'Pauta para el aula', 'Quién la ve', 'Revisada'],
      filas: [
        ['3.º B', 'Mario', 'Instrucciones por escrito y más tiempo', 'Equipo docente de 3.º B y quien sustituya, en su ficha', 'mar 29 sep'],
        ['4.º A', 'Amira', 'Instrucciones cortas, con apoyo visual, y un compañero de referencia', 'Equipo docente de 4.º A y quien sustituya, en su ficha', 'lun 16 nov'],
        ['2.º A', 'Alba', 'Sentarla en primera fila, cerca de la pizarra', 'Equipo docente de 2.º A y quien sustituya, en su ficha', 'jue 8 oct'],
        ['5.º B', 'Óliver', 'Anticiparle los cambios de rutina y las salidas', 'Equipo docente de 5.º B y quien sustituya, en su ficha', 'mar 29 sep'],
        ['1.º ESO A', 'Samuel', 'En los exámenes, preguntas separadas y espacio para responder', 'Equipo docente de 1.º ESO A', 'mar 20 oct'],
        ['2.º ESO B', 'Todo el grupo', 'Explicaciones en bloques cortos y pasos de la tarea en la pizarra', 'Equipo docente de 2.º ESO B', 'Propuesta de hoy'],
      ],
      marcas: [
        { fila: 0, columna: 3, tipo: 'aviso' },
        { fila: 1, columna: 4, tipo: 'ok' },
        { fila: 5, columna: 4, tipo: 'aviso' },
      ],
      avisos: [
        { texto: 'Pablo Sanz (1.ª y 6.ª hora) y Rosa Medina (3.ª hora) verán la pauta de Mario en sus fichas de 3.º B; queda registrado.', estado: 'aviso' },
        { texto: 'La pauta de 2.º ESO B es para todo el grupo y no nombra a nadie. Sale de la petición de Beatriz Romero y nadie la ve hasta que la apruebes.', estado: 'info' },
        { texto: 'Las pautas dicen qué hacer en el aula, no por qué: en las fichas no van diagnósticos ni informes.', estado: 'info' },
        { texto: 'DirectorIA lleva cada pauta solo a la ficha de quien entra en ese grupo, y la ficha se cierra al acabar la jornada.', estado: 'ok' },
      ],
      boton: 'Aprobar la pauta de 2.º ESO B',
      alTerminar: 'Pauta aprobada. La ve el equipo docente de 2.º ESO B, sin nombres, y queda registrado quién la abre.',
    },

    // E11. La circular de la salida, en lectura fácil y en inglés
    {
      id: 'traduccion',
      tipo: 'traduccion',
      menu: 'Circulares adaptadas',
      antetitulo: 'Lectura fácil e inglés · familia de Amira (4.º A)',
      titulo: 'Circular de la salida al Jardín Botánico',
      entradilla: 'Laura Sánchez te la pidió para la familia de Amira, que prefiere el inglés. DirectorIA ha preparado una versión en lectura fácil y otra en inglés: compáralas con el original y envíalas tú.',
      para: 'Familia de Amira (4.º A)',
      original: {
        titulo: 'Salida al Jardín Botánico',
        texto: 'Estimadas familias:\n\nEl viernes 27 de noviembre, el alumnado de 4.º de Primaria irá de excursión al Jardín Botánico. Haremos una visita guiada para conocer los árboles y las plantas en otoño.\n\nSaldremos del colegio a las 9:15 y volveremos a las 13:30, a tiempo para la comida. Iremos en autobús.\n\nCada alumno tiene que llevar:\n- almuerzo y agua;\n- gorra;\n- ropa cómoda.\n\nEl precio es de 6 €, con la entrada y el autobús incluidos. Se cobrará en el recibo de diciembre: no hace falta que traigan dinero.\n\nPara que su hijo o hija pueda ir, entreguen la autorización firmada a su tutor o tutora antes del viernes 20 de noviembre.\n\nUn saludo,\nEquipo docente de 4.º de Primaria\nColegio Ejemplo',
      },
      versiones: [
        {
          idioma: 'Lectura fácil',
          texto: 'Estimada familia:\n\nLa clase de Amira va de excursión al Jardín Botánico.\nEl Jardín Botánico es un parque grande con muchos árboles y plantas.\nUn guía enseña a los alumnos los árboles y las plantas en otoño.\nVan todos los alumnos de 4.º de Primaria con sus profesores.\n\n¿Qué día?\nEl viernes 27 de noviembre.\n\n¿A qué hora?\nLos alumnos salen del colegio a las 9:15 de la mañana.\nVuelven al colegio a las 13:30, la una y media.\nLlegan a tiempo para la comida.\nVan en autobús.\n\n¿Qué tiene que llevar Amira?\nAlmuerzo: un bocadillo o una fruta para media mañana.\nUna botella de agua.\nUna gorra.\nRopa cómoda para andar.\n\n¿Cuánto cuesta?\n6 euros.\nCon este dinero se pagan la entrada y el autobús.\nEl colegio lo cobra en el recibo de diciembre.\nNo tienen que dar dinero a Amira.\n\n¿Qué tienen que hacer ustedes?\nFirmar la autorización.\nLa autorización es el papel para decir que Amira puede ir.\nDar la autorización a Laura Sánchez, la tutora de Amira.\nTienen que darla antes del viernes 20 de noviembre.\n\nSi tienen dudas, pregunten a Laura Sánchez.',
        },
        {
          idioma: 'Inglés',
          texto: "Dear family,\n\nThis is the English version of the letter sent to all families in Amira’s year group. The original in Spanish is attached.\n\nOn Friday 27 November, the pupils in 4.º de Primaria will go on a trip to the Botanical Garden (Jardín Botánico). They will have a guided tour to learn about trees and plants in autumn.\n\nThe children will leave school at 9:15 am and come back at 1:30 pm (13:30), in time for lunch. They will travel by coach.\n\nPlease make sure Amira brings:\n- a mid-morning snack and water;\n- a cap;\n- comfortable clothes.\n\nThe trip costs €6, which covers the entrance fee and the coach. It will be added to your December school bill, so there is no need to send money.\n\nFor Amira to go on the trip, please sign the permission slip and give it to her class teacher, Laura Sánchez, by Friday 20 November. You are welcome to write to Laura in English if you have any questions.\n\nKind regards,\nThe 4.º de Primaria teachers\nColegio Ejemplo",
        },
      ],
      comprobaciones: [
        'La fecha, la hora, el precio y la forma de pago coinciden con el original',
        'El plazo de la autorización es el mismo: viernes 20 de noviembre',
        'Las dos versiones dicen lo mismo que el original, sin quitar nada importante',
        'No hay datos de otros alumnos',
      ],
      boton: 'Enviar a la familia',
      alTerminar: 'Enviado desde la cuenta del colegio, con la versión en inglés, la de lectura fácil y el original en español. Laura Sánchez va en copia.',
    },
  ],
});
