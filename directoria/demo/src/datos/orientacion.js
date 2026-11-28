DEMO.rol({
  id: 'orientacion',
  orden: 5,
  persona: {
    nombre: 'Andrés Vidal',
    cargo: 'Orientador',
    detalle: 'Departamento de Orientación',
    ilustracion: 'orientacion',
  },
  acceso: 'Guías de los protocolos, plan de convivencia, circulares adaptadas y correo resumido',

  // ─── Inicio: panel de mando (guion-de-datos.md §6.2 bis), solo con datos ───
  // Orientación no guarda datos de alumnos: ni casos, ni pautas personales, ni anotaciones. Trabaja con las guías de los
  // protocolos, el plan de convivencia, los documentos del departamento y circulares generales adaptadas.
  // Sin el día por sesiones: su trabajo no va por el horario de Primaria.
  inicio: {
    antetitulo: 'Miércoles 18 de noviembre · 8:00',
    titulo: 'Buenos días, Andrés',
    entradilla: 'La circular adaptada, la sesión del claustro y el plan de convivencia. Nada se envía sin ti.',

    // Lo que importa a las 8:00, de lo más urgente a lo menos. Cada cifra lleva a donde se actúa y tiene un solo sentido.
    cifras: [
      {
        // La circular de la salida, en lectura fácil y en inglés, para todas las familias de 4.º: las autorizaciones son
        // antes del viernes 20. Está hecha cuando la envías.
        etiqueta: 'Circular adaptada',
        icono: 'documento',
        valor: 'Por enviar',
        hoy: true,
        nota: 'La de la salida al Botánico, en lectura fácil y en inglés, para las familias de 4.º.',
        sigue: 'traduccion',
        ir: 'traduccion',
        accion: 'Revisar y enviar',
        alTerminar: 'Enviada',
        accionHecha: 'Ver lo enviado',
      },
      {
        etiqueta: 'Correos por responder',
        icono: 'correo',
        cuenta: 'correo',
        accion: 'Abrir el correo',
        alTerminar: 'Al día',
      },
      {
        // La sesión del claustro sobre el protocolo de acoso. Está hecha cuando le pasas a Nuria Castro el guion (#0), así
        // que lleva a su correo, donde se hace. Con otra respuesta, a medias: el guion se prepara con la guía, y lleva a ella.
        // La guía también está enlazada desde la nota del correo y desde «Para saber».
        etiqueta: 'Sesión para el claustro',
        icono: 'carpeta',
        valor: 'mié 25',
        rotulo: 'a las 16:15',
        nota: 'El protocolo de acoso, paso a paso. Nuria Castro te pide el guion antes del lunes 23.',
        sigue: 'correo:c-nuria#0',
        aMedias: [
          { sigue: 'correo:c-nuria', nota: 'Ya has contestado a Nuria Castro. El guion, antes del lunes 23.', ir: 'protocolos', accion: 'Ver la guía' },
        ],
        ir: 'correo:c-nuria',
        accion: 'Pasarle el guion',
        alTerminar: 'Guion enviado',
      },
      {
        // Progreso del plan de convivencia: las actividades hechas de todas las del curso.
        etiqueta: 'Plan de convivencia',
        icono: 'calendario',
        progreso: 'convivencia',
        rotulo: 'hechas',
        nota: 'Esta semana, el Día de los Derechos de la Infancia, el viernes 20.',
        ir: 'convivencia',
        accion: 'Ver las actividades',
        accionCorta: 'Ver el plan',
        alTerminar: 'Todo hecho',
        accionHecha: 'Ver el plan',
      },
    ],

    // Lo que te necesita: empieza por lo que las cifras no dicen. Las de «Hoy» salen de correos (llevan «Resumido con IA»).
    lista: {
      titulo: 'Lo que te necesita',
      items: [
        { grupo: 'Hoy', icono: 'correo', titulo: 'Beatriz Romero: técnicas de estudio para 2.º ESO B', detalle: 'Quiere dar la sesión en la tutoría del jueves 26, con todo el grupo. Tienes tres respuestas propuestas.', estado: 'hoy', ir: 'correo:c-beatriz', sigue: 'correo:c-beatriz' },
        { grupo: 'Hoy', icono: 'familia', titulo: 'Una familia de 5.º pregunta por una charla sobre pantallas', detalle: 'Para las familias, sobre el primer móvil. Ofrecen la ayuda del AMPA.', estado: 'hoy', ir: 'correo:c-pantallas', sigue: 'correo:c-pantallas' },
        { grupo: 'Esta semana', icono: 'calendario', titulo: 'Día de los Derechos de la Infancia, el viernes 20', detalle: 'La actividad de tutoría para toda Primaria. Las fichas están en la carpeta del departamento.', estado: 'pendiente', ir: 'convivencia', sigue: 'convivencia#1', verbo: 'Hecha' },
        // La guía sale de reglas y plantillas: sin insignia. No se abre ningún caso en DirectorIA.
        { grupo: 'Para saber', icono: 'carpeta', titulo: 'Guías de protocolos: acoso, absentismo y accidentes', detalle: 'Paso a paso y con los anexos en blanco. Ningún caso se abre en DirectorIA: va a Raíces y al expediente del centro.', estado: 'info', ir: 'protocolos' },
        { grupo: 'Para saber', icono: 'correo', titulo: 'Curso de lectura fácil: inscripción hasta el 11 de diciembre', detalle: 'Gratuito, 20 horas en línea, los miércoles del 13 de enero al 24 de febrero.', estado: 'info', ir: 'correo:c-formacion' },
      ],
    },

    // Lo que viene: el plan de convivencia (sale de reglas, sin insignia) y lo que piden los correos (sacado del correo).
    agenda: {
      titulo: 'Lo que viene',
      desde: '2026-11-16',
      semanas: 4,
      marcas: [
        { fecha: '2026-11-20', tipo: 'evento', titulo: 'Día de los Derechos de la Infancia', detalle: 'Actividad de tutoría en toda Primaria.', ir: 'convivencia', sigue: 'convivencia#1', verbo: 'Hecha' },
        // El guion solo va en la 1.ª respuesta propuesta (#0). Proponer repasarlo juntos o pedir más tiempo no lo envía.
        {
          fecha: '2026-11-23', tipo: 'plazo', titulo: 'Guion de la sesión para el claustro', detalle: 'Pásaselo a Nuria Castro antes de este día.', fuente: 'correo',
          ir: 'correo:c-nuria', sigue: 'correo:c-nuria#0', verbo: 'Enviado',
          aMedias: { sigue: 'correo:c-nuria', detalle: 'Ya has contestado a Nuria Castro. El guion, antes de este día.' },
        },
        { fecha: '2026-11-25', hora: '16:15', tipo: 'evento', titulo: 'El protocolo de acoso, en el claustro', detalle: '20 minutos en la sala de profesores, con la guía y los anexos en blanco.', ir: 'protocolos' },
        // Los materiales solo van en la 1.ª respuesta propuesta (#0): darla juntos o preguntar antes no los envía.
        {
          fecha: '2026-11-26', tipo: 'plazo', titulo: 'Técnicas de estudio para 2.º ESO B', detalle: 'Envíale los materiales a Beatriz Romero antes de este día.', fuente: 'correo',
          ir: 'correo:c-beatriz', sigue: 'correo:c-beatriz#0', verbo: 'Enviados',
          aMedias: { sigue: 'correo:c-beatriz', detalle: 'Ya has contestado a Beatriz Romero. Los materiales, antes de este día.' },
        },
        { fecha: '2026-12-11', tipo: 'plazo', titulo: 'Curso de lectura fácil: inscríbete antes de este día', detalle: 'O hasta que se cubran las 30 plazas.', fuente: 'correo', ir: 'correo:c-formacion' },
      ],
    },
  },

  // ─── Correo ───────────────────────────────────────────────────────
  // Las familias escriben de temas generales, sin nombres de alumnos. Nadie escribe de un caso: no hay casos en DirectorIA.
  correo: [
    {
      id: 'c-nuria',
      de: 'Nuria Castro',
      deDetalle: 'Coordinadora de bienestar y protección',
      asunto: 'Sesión del claustro sobre el protocolo de acoso',
      hora: '7:40',
      categoria: 'Claustro',
      etiqueta: { texto: 'Guion antes del lun 23', tipo: 'plazo' },
      resumen: [
        'Nuria Castro quiere dedicar 20 minutos del claustro del miércoles 25, a las 16:15, a explicar el protocolo de acoso.',
        'Te pide un guion con los pasos, quién hace cada uno y qué anexos se usan, antes del lunes 23.',
        'Lo quiere práctico, sobre todo para el profesorado nuevo, y sin ejemplos de casos del colegio.',
      ],
      piden: 'Pasarle antes del lunes 23 el guion de la sesión sobre el protocolo de acoso.',
      original: 'Buenos días, Andrés:\n\nComo hablamos, me gustaría que el miércoles 25, a las 16:15, dedicáramos 20 minutos del claustro a explicar el protocolo de acoso, sobre todo para el profesorado nuevo de este curso.\n\n¿Me preparas un guion con los pasos, quién hace cada uno y qué anexos se usan? Lo quiero práctico: qué hacer si alguien te cuenta algo, a quién se comunica y qué no se debe hacer nunca. Sin ejemplos de casos del colegio, claro.\n\nSi me lo pasas antes del lunes 23, lo repasamos juntos y lo dejamos listo.\n\nUn abrazo,\nNuria Castro\nCoordinadora de bienestar y protección',
      respuestas: [
        {
          titulo: 'Pasarle el guion hoy',
          texto: 'Buenos días, Nuria:\n\nMe parece muy bien. Te dejo hoy el guion en la carpeta del departamento: los nueve pasos del protocolo de la Comunidad de Madrid, quién hace cada uno, qué anexo se usa y qué hay que cuidar. Lo he preparado con la guía de DirectorIA, y llevaré los anexos en blanco para repartirlos.\n\nEmpiezo por lo práctico: qué hacer si alguien te cuenta algo y a quién se comunica. Sin ejemplos del colegio.\n\nUn abrazo,\nAndrés Vidal\nOrientador',
        },
        {
          titulo: 'Repasarlo juntos el lunes',
          texto: 'Buenos días, Nuria:\n\nGracias. Prefiero que lo preparemos juntos: ¿te viene bien el lunes 23 a las 14:45, en mi despacho? Llevaré un primer borrador con los pasos del protocolo, quién hace cada uno y los anexos en blanco, y lo ajustamos en media hora.\n\nAsí el miércoles 25 lo contamos los dos, con el mismo orden y sin ejemplos del colegio.\n\nUn abrazo,\nAndrés Vidal\nOrientador',
        },
        {
          titulo: 'Proponer un ejemplo inventado',
          texto: 'Buenos días, Nuria:\n\nMe parece muy buena idea. Para que se entienda bien, propongo contar los pasos con un ejemplo inventado de principio a fin, sin nada que se parezca a un caso del colegio, y repartir los anexos en blanco.\n\nSi te parece bien, preparo el guion así y te lo paso antes del lunes 23.\n\nUn abrazo,\nAndrés Vidal\nOrientador',
        },
      ],
      nota: 'La guía del protocolo de acoso, con los anexos en blanco, está en «Guías de protocolos».',
      ir: 'protocolos',
    },
    {
      id: 'c-pantallas',
      de: 'Elisa',
      deDetalle: 'Familia de 5.º de Primaria',
      asunto: '¿Habrá alguna charla sobre móviles para las familias?',
      hora: '7:15',
      categoria: 'Familias',
      etiqueta: { texto: 'Responder hoy', tipo: 'hoy' },
      resumen: [
        'Una familia de 5.º pregunta si el colegio va a organizar alguna charla para las familias sobre el uso del móvil y las pantallas.',
        'En casa empiezan a plantearse el primer móvil y quieren saber qué recomienda el colegio.',
        'Varias familias están igual, y ofrecen la ayuda del AMPA para organizarla.',
      ],
      piden: 'Saber si habrá una charla para familias sobre móviles y pantallas, y cuándo.',
      original: 'Buenos días:\n\nSomos una familia de 5.º de Primaria. En casa empezamos a plantearnos lo del primer móvil y nos gustaría saber qué recomienda el colegio. ¿Vais a organizar este curso alguna charla para las familias sobre el uso del móvil y las pantallas?\n\nHablándolo a la salida, varias familias de la clase estamos igual. Si os viene bien, desde el AMPA podríamos ayudar a organizarla.\n\nMuchas gracias,\nElisa',
      respuestas: [
        {
          titulo: 'Contarle la sesión de enero',
          texto: 'Buenos días, Elisa:\n\nGracias por escribirnos. Sí: en el plan de convivencia de este curso hay una sesión para las familias sobre el uso del móvil y las pantallas, en enero. En cuanto tengamos la fecha, la enviaremos en una circular a todas las familias de Primaria.\n\nNos encantará contar con el AMPA para organizarla: se lo propondré a su junta.\n\nUn saludo cordial,\nAndrés Vidal\nOrientador del Colegio Ejemplo',
        },
        {
          titulo: 'Proponer organizarla con el AMPA',
          texto: 'Buenos días, Elisa:\n\nGracias por la propuesta. Tenemos prevista una sesión para familias sobre pantallas en enero, y nos vendría muy bien organizarla con el AMPA. ¿Le parece que lo hablemos con su junta en la próxima reunión? Así elegimos juntos una tarde que venga bien a la mayoría.\n\nUn saludo cordial,\nAndrés Vidal\nOrientador del Colegio Ejemplo',
        },
        {
          titulo: 'Enviarle una guía mientras tanto',
          texto: 'Buenos días, Elisa:\n\nGracias por escribirnos. En enero haremos una sesión para las familias sobre el uso del móvil y las pantallas; les avisaremos con una circular.\n\nMientras tanto, le dejo en secretaría una guía breve del departamento sobre el primer móvil: qué preguntarse antes, qué normas ayudan en casa y cómo hablarlo en familia.\n\nUn saludo cordial,\nAndrés Vidal\nOrientador del Colegio Ejemplo',
        },
      ],
      nota: 'La sesión para familias sobre pantallas está en el plan de convivencia, en enero, con el AMPA.',
      ir: 'convivencia',
    },
    {
      id: 'c-beatriz',
      de: 'Beatriz Romero',
      deDetalle: 'Tutora de 2.º ESO B',
      asunto: 'Técnicas de estudio para 2.º B antes de los exámenes',
      hora: 'ayer',
      categoria: 'Claustro',
      etiqueta: { texto: 'Materiales antes del jue 26', tipo: 'plazo' },
      resumen: [
        'Beatriz Romero quiere dedicar la tutoría del jueves 26 a técnicas de estudio con todo 2.º ESO B, antes de los exámenes.',
        'Te pide materiales sencillos para hacerlos en clase: organizar la semana, hacer un esquema y repasar.',
        'Los exámenes de la 1.ª evaluación empiezan el lunes 30.',
      ],
      piden: 'Materiales para una sesión de tutoría sobre técnicas de estudio con todo 2.º ESO B, antes del jueves 26.',
      original: 'Hola, Andrés:\n\nEl jueves 26 quiero dedicar la hora de tutoría de 2.º B a las técnicas de estudio, antes de los exámenes de la evaluación, que empiezan el lunes 30. Me gustaría que lleguen con un poco de método.\n\n¿Me puedes pasar algún material sencillo para la sesión? Cómo organizar la semana, cómo hacer un esquema y cómo repasar. Algo práctico, para hacerlo en clase con todo el grupo.\n\nSi me lo pasas antes del jueves, mejor.\n\nGracias,\nBeatriz',
      respuestas: [
        {
          titulo: 'Enviarle los materiales',
          texto: 'Hola, Beatriz:\n\nTe paso la sesión preparada, para hacerla con todo el grupo en 50 minutos:\n\n1. Un horario de la semana, para que cada uno reparta el estudio hasta el lunes 30.\n2. Un esquema de ejemplo con un tema de Geografía e Historia, y otro para hacer por parejas.\n3. Repaso con preguntas: cada uno escribe tres preguntas de examen y se las hace a un compañero.\n\nTe dejo las fichas en la carpeta del departamento, listas para imprimir. Si quieres, me paso al final de la sesión.\n\nUn abrazo,\nAndrés Vidal\nOrientador',
        },
        {
          titulo: 'Proponer darla juntos',
          texto: 'Hola, Beatriz:\n\nMe parece una gran idea. ¿Te parece si la damos juntos el jueves? Yo llevo los materiales y explico cómo hacer un esquema, y tú te encargas del horario de la semana, que conoces mejor sus asignaturas.\n\nSi te viene bien, quedamos el martes 24 a las 14:45 diez minutos para repartirnos la sesión.\n\nUn abrazo,\nAndrés Vidal\nOrientador',
        },
        {
          titulo: 'Preguntarle por las asignaturas',
          texto: 'Hola, Beatriz:\n\nClaro que sí. Antes de prepararlo, una pregunta: ¿qué asignaturas les cuestan más este trimestre? Así uso ejemplos de esas en el esquema y en el repaso, y les sirve para los exámenes del lunes 30.\n\nCon lo que me digas, te lo paso antes del jueves.\n\nUn abrazo,\nAndrés Vidal\nOrientador',
        },
      ],
      nota: 'Los materiales de técnicas de estudio del plan de acción tutorial están en la carpeta del departamento.',
    },
    {
      id: 'c-laura',
      de: 'Laura Sánchez',
      deDetalle: 'Tutora de 4.º A de Primaria',
      asunto: 'Circular del Botánico en inglés y en lectura fácil',
      hora: 'ayer',
      categoria: 'Claustro',
      etiqueta: { texto: 'Autorizaciones el vie 20', tipo: 'plazo' },
      resumen: [
        'Laura Sánchez pide la circular de la salida al Jardín Botánico del viernes 27 en inglés y en lectura fácil.',
        'En 4.º hay familias que prefieren el inglés y otras que están aprendiendo español.',
        'Las autorizaciones firmadas se entregan antes del viernes 20.',
      ],
      piden: 'Preparar las versiones en inglés y en lectura fácil de la circular antes del viernes 20.',
      original: 'Hola, Andrés:\n\nLa circular de la salida al Jardín Botánico solo está en español, y en 4.º hay familias que prefieren que les escribamos en inglés y otras que todavía están aprendiendo español. Me da miedo que no les llegue bien: las autorizaciones hay que entregarlas antes del viernes 20.\n\n¿Puedes preparar una versión en inglés y otra en lectura fácil? Así la mandamos a todas las familias de 4.º con las tres versiones, y cada una lee la que le vaya mejor.\n\nTe la adjunto. Gracias,\nLaura',
      adjuntos: ['Circular de la salida al Jardín Botánico.pdf'],
      respuestas: [
        {
          titulo: 'Confirmar que salen hoy',
          texto: 'Hola, Laura:\n\nGracias por avisar. Ya tengo las dos versiones de la circular, en inglés y en lectura fácil. Las reviso esta mañana y hoy salen a todas las familias de 4.º desde la cuenta del colegio, con el original en español. Te pongo en copia.\n\nAsí tienen tiempo de devolveros la autorización firmada antes del viernes 20.\n\nUn abrazo,\nAndrés Vidal\nOrientador',
        },
        {
          titulo: 'Preguntar si las quiere en papel',
          texto: 'Hola, Laura:\n\nLas versiones en inglés y en lectura fácil están casi listas. Antes de enviarlas, una pregunta: ¿las mando solo por correo o te imprimo también unas copias para repartirlas en clase con la autorización?\n\nDime qué prefieres y lo hago hoy.\n\nUn abrazo,\nAndrés Vidal\nOrientador',
        },
        {
          titulo: 'Pedirle que las vea antes',
          texto: 'Hola, Laura:\n\nTe mando primero a ti las dos versiones de la circular, en inglés y en lectura fácil, para que las veas: tú conoces mejor a las familias de tu clase. Si te parecen bien, esta tarde salen a todas las familias de 4.º, con el original en español y contigo en copia.\n\nHe puesto que pueden escribir a su tutor o tutora en inglés. Si prefieres otra cosa, dímelo.\n\nUn abrazo,\nAndrés Vidal\nOrientador',
        },
      ],
      nota: 'La IA ha preparado la versión en lectura fácil y la inglesa en «Circulares adaptadas». Revísalas y envíalas tú.',
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
      nota: 'Solo para leer. Encaja con las circulares que adaptas para las familias. DirectorIA ha añadido el plazo de inscripción a lo que viene.',
    },
  ],

  // ─── Módulos ──────────────────────────────────────────────────────
  modulos: [
    // E3. Guías de los protocolos (acoso escolar, absentismo y accidentes): cómo se aplica cada uno, paso a paso, según el
    // protocolo vigente de la Comunidad de Madrid. No se abre ningún caso en DirectorIA: los datos de cada caso van donde
    // manda el protocolo (Raíces y el expediente del centro). Sale de reglas y plantillas, sin IA.
    // Dirección toma estas mismas guías (guias: 'orientacion/protocolos' en direccion.js): un cambio aquí vale para los dos.
    {
      id: 'protocolos',
      tipo: 'protocolo',
      menu: 'Guías de protocolos',
      antetitulo: 'Protocolos de la Comunidad de Madrid',
      titulo: 'Cómo se aplica cada protocolo, paso a paso',
      entradilla: 'En cada paso, qué se hace, quién lo hace, en qué plazo y con qué anexo. Los anexos van en blanco, para descargarlos e imprimirlos. Ningún caso se abre en DirectorIA.',
      aviso: 'No se abre ningún caso en DirectorIA. Los datos de cada caso van donde manda el protocolo: Raíces y el expediente del centro.',
      guias: [
        {
          id: 'acoso',
          nombre: 'Acoso escolar',
          fuente: 'Según el protocolo vigente de la Comunidad de Madrid para la actuación contra el acoso escolar.',
          si: 'Si se confirma el acoso',
          pasos: [
            { nombre: 'Comunicación a la dirección', que: 'Quien conozca o sospeche una situación de acoso lo comunica por escrito a la dirección del centro.', quien: 'Cualquier persona del centro: profesorado, personal, familias o alumnado', plazo: 'En cuanto se conozcan los hechos', anexo: 'Anexo I.a o I.b', cuidar: 'Confidencialidad desde el primer momento: lo sabe solo quien tiene que saberlo. No se prejuzga a nadie.' },
            { nombre: 'Apertura y comunicación oficial', que: 'La dirección abre el protocolo y lo comunica por la vía oficial.', quien: 'La dirección', plazo: 'Según el protocolo vigente', donde: 'Raíces', cuidar: 'El caso se registra en Raíces, no en DirectorIA.' },
            { nombre: 'Medidas de protección', que: 'Se adoptan medidas para proteger al alumno o alumna mientras se recoge la información, como más vigilancia en el recreo y en los cambios de clase.', quien: 'Las decide la dirección', plazo: 'Según el protocolo vigente', cuidar: 'Que protejan sin señalar a nadie y sin dar nada por probado.' },
            { nombre: 'Recogida de información', que: 'Dos docentes designados por la dirección entrevistan por separado a quienes están implicados y a quienes lo han visto, y hablan con el profesorado y con las familias.', quien: 'Dos docentes que designa la dirección', plazo: 'Según el protocolo vigente', anexo: 'Anexo II', cuidar: 'Recoger hechos, no opiniones. Entrevistas por separado y con discreción. No prejuzgar.' },
            { nombre: 'Reunión para la toma de decisiones', que: 'Con la información recogida, la dirección reúne a quienes indica el protocolo y decide si hay acoso y qué medidas se toman.', quien: 'Convoca y decide la dirección', plazo: 'Según el protocolo vigente', anexo: 'Anexo III', cuidar: 'Si hay acoso, y con qué medidas, lo decide la dirección.' },
            { nombre: 'Comunicación a Fiscalía de Menores e Inspección', condicional: true, que: 'La dirección lo comunica a la Fiscalía de Menores y al Servicio de Inspección Educativa, en los casos que fija el protocolo.', quien: 'La dirección', plazo: 'Según el protocolo vigente', cuidar: 'Se envía solo lo que pide el protocolo.' },
            { nombre: 'Familias y plan de intervención', condicional: true, que: 'Se informa a las familias del alumnado implicado y se pone en marcha un plan de intervención, con medidas para cada parte y para el grupo.', quien: 'La dirección, con orientación y la tutoría', plazo: 'Según el protocolo vigente', cuidar: 'Cada familia recibe solo la información que le corresponde.' },
            { nombre: 'Procedimiento disciplinario', condicional: true, que: 'Si corresponde, se abre el procedimiento que fija el decreto de convivencia de la Comunidad de Madrid (Decreto 32/2019).', quien: 'La dirección', plazo: 'Los que fija el decreto', cuidar: 'Con las garantías que da el decreto a todas las partes.' },
            { nombre: 'Seguimiento y cierre', que: 'Se comprueba que las medidas funcionan y, cuando procede, se cierra el protocolo.', quien: 'La dirección, con orientación y la tutoría', plazo: 'Según el protocolo vigente', anexo: 'Anexo IV.c', donde: 'Raíces', cuidar: 'El cierre también queda en Raíces y en el expediente del centro.' },
          ],
          plantillas: [
            { nombre: 'Anexo I.a', detalle: 'Notificación a la dirección' },
            { nombre: 'Anexo I.b', detalle: 'Para que lo comunique el alumnado' },
            { nombre: 'Anexo II', detalle: 'Recogida de información' },
            { nombre: 'Anexo III', detalle: 'Reunión para la toma de decisiones' },
            { nombre: 'Anexo IV.c', detalle: 'Seguimiento y cierre' },
          ],
        },
        {
          id: 'absentismo',
          nombre: 'Absentismo',
          fuente: 'Según el protocolo vigente de la Comunidad de Madrid y el programa municipal de absentismo.',
          pasos: [
            { nombre: 'Control de las faltas', que: 'El profesorado anota cada día las faltas de asistencia y la tutoría las revisa.', quien: 'El profesorado y la tutoría', plazo: 'Cada día', donde: 'Raíces o el programa de gestión del colegio', cuidar: 'Las faltas no se anotan en DirectorIA.' },
            { nombre: 'Contacto con la familia', que: 'Si las faltas sin justificar se repiten, la tutoría llama o escribe a la familia para saber qué pasa.', quien: 'La tutoría', plazo: 'Según el protocolo vigente', cuidar: 'Preguntar sin dar nada por supuesto.' },
            { nombre: 'Entrevista y compromisos', que: 'Si siguen las faltas, la tutoría y jefatura de estudios se reúnen con la familia y acuerdan compromisos, con una fecha para revisarlos.', quien: 'La tutoría y jefatura de estudios', plazo: 'Según el protocolo vigente', anexo: 'Acta de compromisos', cuidar: 'Compromisos concretos, que la familia pueda cumplir.' },
            { nombre: 'Derivación al programa de absentismo', que: 'Si no se resuelve, la dirección lo deriva a los servicios municipales que llevan el absentismo, con el informe que pide el protocolo.', quien: 'La dirección, con orientación', plazo: 'Según el protocolo vigente', anexo: 'Ficha de derivación', cuidar: 'Lo decide la dirección. Se envía solo lo que pide el protocolo.' },
            { nombre: 'Seguimiento', que: 'Se sigue la asistencia con los servicios municipales y con la familia hasta que se normaliza.', quien: 'La tutoría, jefatura de estudios y orientación', plazo: 'Según el protocolo vigente', donde: 'El expediente del centro', cuidar: 'El seguimiento va al expediente del centro, no a DirectorIA.' },
          ],
          plantillas: [
            { nombre: 'Acta de compromisos', detalle: 'Para la entrevista con la familia' },
            { nombre: 'Ficha de derivación', detalle: 'Para el programa municipal de absentismo' },
          ],
        },
        {
          id: 'accidentes',
          nombre: 'Accidentes',
          fuente: 'Según el plan de actuación del colegio y la póliza del seguro escolar.',
          pasos: [
            { nombre: 'Atender y valorar', que: 'Quien está con el grupo atiende al alumno o alumna y valora si es leve. Si no lo es, llama al 112 y sigue sus indicaciones.', quien: 'El docente que está con el grupo', plazo: 'En el momento', cuidar: 'No dejar solo al resto del grupo: pide ayuda a conserjería o al aula de al lado.' },
            { nombre: 'Aviso a la familia', que: 'Se avisa a la familia de lo ocurrido y, si hace falta, de adónde lo llevan.', quien: 'La tutoría o la dirección, con los contactos que tiene conserjería', plazo: 'En el momento', cuidar: 'Contar lo que ha pasado, sin valorar culpas.' },
            { nombre: 'Comunicación a la dirección', que: 'Quien lo atendió cuenta a la dirección qué ha pasado, dónde y a qué hora.', quien: 'El docente que lo atendió', plazo: 'El mismo día', cuidar: 'Solo los hechos: qué, dónde y cuándo.' },
            { nombre: 'Parte de accidente', que: 'Secretaría rellena el parte del seguro escolar con quien lo atendió y lo envía a la aseguradora.', quien: 'Secretaría, con el docente que lo atendió', plazo: 'El que fija la póliza', anexo: 'Parte de accidente', donde: 'El expediente del centro', cuidar: 'El parte va al seguro y al expediente del centro, no a DirectorIA.' },
            { nombre: 'Revisión de lo ocurrido', que: 'La dirección revisa si hay que cambiar algo del espacio, del material o de la vigilancia para que no se repita.', quien: 'La dirección', plazo: 'Según el protocolo vigente', cuidar: 'Se buscan causas, no culpables.' },
          ],
          plantillas: [
            { nombre: 'Parte de accidente', detalle: 'Del seguro escolar del colegio' },
          ],
        },
      ],
      pie: 'Es la lectura del protocolo vigente que ha hecho el equipo de DirectorIA, no la de un abogado: manda siempre el texto oficial. Si hay acoso, y con qué medidas, lo decide la dirección.',
    },

    // El plan de convivencia: sus actividades del curso, con quién lleva cada una. Es un documento del departamento, sin
    // datos de alumnos: sale de reglas, sin insignia (ia: false).
    {
      id: 'convivencia',
      tipo: 'plazos',
      ia: false,
      menu: 'Plan de convivencia',
      antetitulo: 'Plan de convivencia 2026-27',
      titulo: 'Las actividades del plan de convivencia, y cuándo',
      entradilla: 'El calendario de actividades del plan de convivencia, con quién lleva cada una. Es un documento del departamento, sin datos de alumnos. Marca cada actividad cuando esté hecha.',
      items: [
        { fecha: 'mar 29 sep', titulo: 'Normas de aula en cada grupo', detalle: 'Acordadas en la tutoría y colgadas en cada aula.', quien: 'Tutorías', origen: 'Plan de convivencia 2026-27', estado: 'hecho' },
        { fecha: 'vie 20 nov', titulo: 'Día de los Derechos de la Infancia', detalle: 'Una actividad de tutoría en toda Primaria. La propuesta y las fichas, en la carpeta del departamento.', quien: 'Tutorías de Primaria, con orientación', origen: 'Plan de convivencia 2026-27', estado: 'pronto' },
        { fecha: 'mié 25 nov · 16:15', titulo: 'El protocolo de acoso, en el claustro', detalle: '20 minutos en la sala de profesores: los pasos, quién hace cada uno y los anexos en blanco. Sin ejemplos de casos del colegio.', quien: 'Tú, con Nuria Castro', origen: 'Plan de convivencia 2026-27', estado: 'pronto' },
        { fecha: 'enero', titulo: 'Charlas sobre el uso seguro de internet en 1.º y 2.º ESO', detalle: 'Con el Plan Director, del Ministerio del Interior. Falta pedir la fecha.', quien: 'Tú, con jefatura de estudios', origen: 'Plan de convivencia 2026-27', estado: 'despues' },
        { fecha: 'enero', titulo: 'Sesión para familias sobre móviles y pantallas', detalle: 'Para las familias de Primaria, con el AMPA. Falta fijar la tarde.', quien: 'Tú, con el AMPA', origen: 'Plan de convivencia 2026-27', estado: 'despues' },
        { fecha: 'junio', titulo: 'Memoria del plan de convivencia', detalle: 'Lo que se ha hecho y lo que se cambia el curso que viene. Se presenta en el consejo escolar.', quien: 'Tú, con dirección', origen: 'Plan de convivencia 2026-27', estado: 'despues' },
      ],
    },

    // E11. La circular de la salida, en lectura fácil y en inglés, para todas las familias de 4.º: una circular general.
    {
      id: 'traduccion',
      tipo: 'traduccion',
      menu: 'Circulares adaptadas',
      antetitulo: 'Lectura fácil e inglés · familias de 4.º',
      titulo: 'Circular de la salida al Jardín Botánico',
      entradilla: 'Laura Sánchez te la pidió para las familias de 4.º que prefieren el inglés o están aprendiendo español. La IA ha preparado una versión en lectura fácil y otra en inglés: compáralas con el original y envíalas tú.',
      para: 'Las familias de 4.º de Primaria',
      original: {
        titulo: 'Salida al Jardín Botánico',
        texto: 'Estimadas familias:\n\nEl viernes 27 de noviembre, el alumnado de 4.º de Primaria irá de excursión al Jardín Botánico. Haremos una visita guiada para conocer los árboles y las plantas en otoño.\n\nSaldremos del colegio a las 9:15 y volveremos a las 13:30, a tiempo para la comida. Iremos en autobús.\n\nCada alumno tiene que llevar:\n- almuerzo y agua;\n- gorra;\n- ropa cómoda.\n\nEl precio es de 6 €, con la entrada y el autobús incluidos. Se cobrará en el recibo de diciembre: no hace falta que traigan dinero.\n\nPara que su hijo o hija pueda ir, entreguen la autorización firmada a su tutor o tutora antes del viernes 20 de noviembre.\n\nUn saludo,\nEquipo docente de 4.º de Primaria\nColegio Ejemplo',
      },
      versiones: [
        {
          idioma: 'Lectura fácil',
          texto: 'Estimada familia:\n\nLa clase de su hijo o hija va de excursión al Jardín Botánico.\nEl Jardín Botánico es un parque grande con muchos árboles y plantas.\nUn guía enseña a los alumnos los árboles y las plantas en otoño.\nVan todos los alumnos de 4.º de Primaria con sus profesores.\n\n¿Qué día?\nEl viernes 27 de noviembre.\n\n¿A qué hora?\nLos alumnos salen del colegio a las 9:15 de la mañana.\nVuelven al colegio a las 13:30, la una y media.\nLlegan a tiempo para la comida.\nVan en autobús.\n\n¿Qué tiene que llevar?\nAlmuerzo: un bocadillo o una fruta para media mañana.\nUna botella de agua.\nUna gorra.\nRopa cómoda para andar.\n\n¿Cuánto cuesta?\n6 euros.\nCon este dinero se pagan la entrada y el autobús.\nEl colegio lo cobra en el recibo de diciembre.\nNo tienen que darle dinero.\n\n¿Qué tienen que hacer ustedes?\nFirmar la autorización.\nLa autorización es el papel para decir que su hijo o hija puede ir.\nDar la autorización a su tutor o tutora.\nTienen que darla antes del viernes 20 de noviembre.\n\nSi tienen dudas, pregunten a su tutor o tutora.',
        },
        {
          idioma: 'Inglés',
          texto: "Dear family,\n\nThis is the English version of the letter sent to all families in 4.º de Primaria. The original in Spanish is attached.\n\nOn Friday 27 November, the pupils in 4.º de Primaria will go on a trip to the Botanical Garden (Jardín Botánico). They will have a guided tour to learn about trees and plants in autumn.\n\nThe children will leave school at 9:15 am and come back at 1:30 pm (13:30), in time for lunch. They will travel by coach.\n\nPlease make sure your child brings:\n- a mid-morning snack and water;\n- a cap;\n- comfortable clothes.\n\nThe trip costs €6, which covers the entrance fee and the coach. It will be added to your December school bill, so there is no need to send money.\n\nFor your child to go on the trip, please sign the permission slip and give it to their class teacher by Friday 20 November. You are welcome to write to the class teacher in English if you have any questions.\n\nKind regards,\nThe 4.º de Primaria teachers\nColegio Ejemplo",
        },
      ],
      comprobaciones: [
        'La fecha, la hora, el precio y la forma de pago coinciden con el original',
        'El plazo de la autorización es el mismo: viernes 20 de noviembre',
        'Las dos versiones dicen lo mismo que el original, sin quitar nada importante',
        'No hay nombres ni datos de alumnos',
      ],
      boton: 'Enviar a las familias',
      alTerminar: 'Enviado a las familias de 4.º desde la cuenta del colegio, con el original en español y las versiones en lectura fácil y en inglés. Laura Sánchez va en copia.',
    },
  ],
});
