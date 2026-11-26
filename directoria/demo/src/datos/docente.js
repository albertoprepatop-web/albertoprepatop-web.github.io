DEMO.rol({
  id: 'docente',
  orden: 4,
  persona: {
    nombre: 'Laura Sánchez',
    cargo: 'Docente',
    detalle: 'Tutora de 4.º A · Educación Física en 2.º ciclo',
    ilustracion: 'docente',
  },
  acceso: 'Correo resumido y dictado, banco de recursos, plazos y material con Claude',

  // ───────────────────────────── Inicio ─────────────────────────────
  // Panel de mando. Cifras, día y calendario salen de reglas y de los datos del colegio: sin insignia de IA.
  // Las filas que resumen un correo y los plazos sacados de un correo llevan la insignia (la pone el motor).
  inicio: {
    antetitulo: 'Miércoles 18 de noviembre · 8:00',
    titulo: 'Buenos días, Laura',
    entradilla: 'Tus clases, lo que te ha llegado y lo que vence. Nada sale sin que lo revises y lo envíes tú.',

    cifras: [
      {
        etiqueta: 'Tutoría de Daniel M.',
        icono: 'microfono',
        progreso: 'dictado',
        hoy: true,
        nota: 'Dicta la propuesta para su familia. Te llega redactada para revisar.',
        ir: 'dictado',
        accion: 'Empezar a dictar',
        accionCorta: 'Dictar',
        // Ya dictado y por revisar, la nota y la acción cambian: no se pide otra vez que se dicte.
        siDictado: { nota: 'Ya lo has dictado. Te queda revisar el correo y enviarlo tú.', accion: 'Revisar y enviar', accionCorta: 'Revisar' },
        alTerminar: 'Enviado',
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
        etiqueta: 'Entregas del viernes 20',
        icono: 'calendario',
        // Cuenta lo que queda. La nota lo resume: «La programación y las autorizaciones».
        // «ir» también en la cifra: es adonde lleva cuando ya no queda nada pendiente.
        ir: 'plazos',
        pendientes: [
          { texto: 'La programación quincenal', corto: 'la programación', sigue: 'plazos#3', ir: 'plazos' },
          { texto: 'Las autorizaciones de la salida, antes de las 14:00', corto: 'las autorizaciones', sigue: 'plazos#4', ir: 'plazos' },
        ],
        accion: 'Ver tus plazos',
        alTerminar: 'Todo entregado',
        accionHecha: 'Ver tus plazos',
      },
    ],

    // Tu día por sesiones (horario de Primaria).
    dia: {
      titulo: 'Tu día',
      aviso: 'Hoy no viene Sergio Prieto, el tutor de 3.º B: tu Educación Física con ellos no cambia.',
      carriles: [
        {
          titulo: 'Tus clases',
          detalle: 'Tutora de 4.º A',
          icono: 'clase',
          sesiones: [
            { franja: '1', hasta: '2', titulo: 'Lengua y Matemáticas', detalle: '4.º A', tipo: 'clase' },
            { franja: '3', titulo: 'Educación Física', detalle: '4.º B', tipo: 'clase' },
            { franja: '4', titulo: 'Educación Física', detalle: '3.º B', tipo: 'aviso', aviso: 'Falta su tutor', nota: 'Hoy no viene su tutor, Sergio Prieto. Tu sesión no cambia.' },
            { franja: '5', hasta: '6', titulo: 'Ciencias de la Naturaleza y Plástica', detalle: '4.º A', tipo: 'clase' },
            { franja: 'salida', titulo: 'Con tu grupo', detalle: '4.º A', tipo: 'clase' },
          ],
        },
      ],
    },

    lista: {
      titulo: 'Lo que te necesita',
      items: [
        { grupo: 'Hoy', icono: 'familia', titulo: 'Familia de Daniel M.: qué llevar a la salida', detalle: 'No les ha llegado la circular. Tienes tres respuestas propuestas.', estado: 'hoy', ir: 'correo:c-daniel', sigue: 'correo:c-daniel' },
        { grupo: 'Hoy', icono: 'familia', titulo: 'Madre de Amira: el chándal, en inglés', detalle: 'Amira tiene Educación Física mañana. Las respuestas están en inglés y traducidas.', estado: 'hoy', ir: 'correo:c-amira', sigue: 'correo:c-amira' },
        { grupo: 'Hoy', icono: 'microfono', titulo: 'Tutoría con la familia de Daniel M.', detalle: 'Dicta el correo y te llega redactado para revisar.', estado: 'hoy', ir: 'dictado', sigue: 'dictado', siDictado: { detalle: 'Ya lo has dictado. Te queda revisar el correo y enviarlo.' } },
        // Sale de tu correo a jefatura del martes 17, como el plazo de «Tus plazos» («Sacado con IA»): lleva la insignia.
        // El texto vale antes y después de que jefatura conteste (las dos respuestas piden otro día para la vuelta).
        { grupo: 'Esta semana', icono: 'alerta', titulo: 'Tu guardia del viernes 27 coincide con la salida', detalle: 'Es la que ofreciste a Rosa Medina a cambio de la de mañana. Cierra con ella y con jefatura qué día se la devuelves.', estado: 'pendiente', choque: true, ia: true, ir: 'plazos', sigue: 'plazos#6', verbo: 'Resuelto' },
        { grupo: 'Para saber', icono: 'libro', titulo: 'Plan de lectura desde enero', detalle: '20 minutos diarios en Primaria, de 14:30 a 14:50. Dirección te cuenta cómo se organiza.', estado: 'info', ir: 'correo:c-lectura' },
      ],
    },

    // fuente: 'correo' para los plazos que la IA ha sacado de un correo (llevan la insignia), como en «Tus plazos».
    // La tutoría del jueves sigue al correo de Laura en jefatura: cuando jefatura lo responde (las dos respuestas
    // aprueban el cambio del jueves), el detalle lo dice. Si jefatura lo archiva, sigue sin contestar.
    agenda: {
      titulo: 'Lo que viene',
      desde: '2026-11-16',
      semanas: 3,
      marcas: [
        { fecha: '2026-11-19', hora: '11:45', tipo: 'evento', titulo: 'Tutoría con una familia de 4.º A', detalle: 'Coincide con tu guardia. Pediste a jefatura que la haga Rosa Medina y aún no te ha contestado.', fuente: 'correo', ir: 'plazos', sigue: 'jefatura/correo:c-laura', si: { detalle: 'Coincide con tu guardia. Jefatura ya ha aprobado que la haga Rosa Medina.', estado: 'pendiente' } },
        { fecha: '2026-11-20', tipo: 'plazo', titulo: 'Programación quincenal', detalle: 'Del 23 de noviembre al 4 de diciembre, con el modelo del ciclo.', fuente: 'correo', ir: 'plazos', sigue: 'plazos#3', verbo: 'Entregada' },
        { fecha: '2026-11-20', tipo: 'plazo', titulo: 'Autorizaciones de la salida, antes de las 14:00', detalle: 'Las de 4.º A firmadas, en secretaría y con la lista de quién falta.', fuente: 'correo', ir: 'plazos', sigue: 'plazos#4', verbo: 'Entregadas' },
        { fecha: '2026-11-27', hora: '9:15', tipo: 'evento', titulo: 'Salida al Jardín Botánico', detalle: 'Con 4.º. Vuelta a las 13:30.', ir: 'plazos' },
        { fecha: '2026-11-27', tipo: 'aviso', choque: true, titulo: 'Tu guardia de 3.ª hora y la salida', detalle: 'Cierra con Rosa Medina y con jefatura qué día se la devuelves.', fuente: 'correo', ir: 'plazos', sigue: 'plazos#6', verbo: 'Resuelto' },
        { fecha: '2026-12-04', tipo: 'plazo', titulo: 'Títulos para el lote de lectura', detalle: 'Si quieres libros concretos para 4.º A, pídeselos a la biblioteca antes de este día.', fuente: 'correo', ir: 'plazos', sigue: 'plazos#7', verbo: 'Pedidos' },
      ],
    },
  },

  // ───────────────────────────── Correo ─────────────────────────────
  correo: [
    {
      id: 'c-daniel',
      de: 'Familia de Daniel M.',
      deDetalle: '4.º A de Primaria',
      asunto: 'Excursión al Botánico: ¿qué tiene que llevar Daniel?',
      hora: '7:38',
      categoria: 'Familias',
      etiqueta: { texto: 'Autorización antes del vie 20', tipo: 'plazo' },
      resumen: [
        'La circular de la salida al Jardín Botánico del viernes 27 no ha llegado a casa de Daniel M.',
        'Su madre pregunta el horario, qué tiene que llevar, si comen allí y cuánto cuesta.',
        'Ofrece traer la autorización firmada el lunes 23, pero el plazo acaba el viernes 20.',
      ],
      piden: 'Saber el horario, qué tiene que llevar Daniel, si comen allí, el precio y si hay que firmar algo.',
      original: 'Hola, Laura:\n\nDaniel nos ha dicho que el viernes 27 os vais de excursión al Jardín Botánico, pero la circular no ha llegado a casa. Suponemos que estará en el fondo de la mochila, como casi todo últimamente.\n\n¿Nos puedes decir a qué hora salís y a qué hora volvéis, y qué tiene que llevar? No sabemos si hace falta almuerzo o si comen allí. Tampoco sabemos cuánto cuesta.\n\nSi hay que firmar algo, dínoslo y Daniel te lo lleva el lunes sin falta.\n\nMuchas gracias y un saludo,\nRaquel, madre de Daniel M. (4.º A)',
      respuestas: [
        {
          titulo: 'Contarle todo y mandar otra copia',
          texto: 'Hola, Raquel:\n\nGracias por escribir. Le cuento: el viernes 27 salimos a las 9:15 y volvemos a las 13:30. No comen allí: llegamos a tiempo para la comida. Daniel tiene que llevar almuerzo, agua, gorra y ropa cómoda. Cuesta 6 €, con la entrada y el autobús, y en la circular viene cómo pagarlo.\n\nHoy le pongo a Daniel en la agenda otra copia, con la autorización. Tiene que volver firmada antes del viernes 20: el lunes ya sería tarde para confirmar las plazas.\n\nUn saludo,\nLaura Sánchez\nTutora de 4.º A',
        },
        {
          titulo: 'Dársela hoy en mano a la salida',
          texto: 'Hola, Raquel:\n\nGracias por avisar. Si viene a recoger a Daniel hoy a las 16:00, le doy la circular en mano a la salida y le cuento lo que necesite.\n\nLo principal: el viernes 27 salimos a las 9:15 y volvemos a las 13:30, a tiempo para la comida. Daniel tiene que llevar almuerzo, agua, gorra y ropa cómoda, y cuesta 6 €. La autorización tiene que estar firmada antes del viernes 20; el lunes ya sería tarde.\n\nUn saludo,\nLaura Sánchez\nTutora de 4.º A',
        },
        {
          titulo: 'Proponer que la firme en secretaría',
          texto: 'Hola, Raquel:\n\nGracias por escribir. Como la circular no ha llegado a casa, puede pasar a firmar la autorización por secretaría cualquier mañana hasta el viernes 20: allí tienen copias. El lunes ya sería tarde para confirmar las plazas.\n\nLo que necesita saber: salimos a las 9:15 y volvemos a las 13:30, a tiempo para la comida. Daniel tiene que llevar almuerzo, agua, gorra y ropa cómoda. Cuesta 6 €, con la entrada y el autobús.\n\nUn saludo,\nLaura Sánchez\nTutora de 4.º A',
        },
      ],
      nota: 'Datos sacados de la circular de la salida. Si quieres proponerles la tutoría que tienes apuntada, díctala en «Correo dictado».',
      ir: 'dictado',
    },
    {
      id: 'c-amira',
      de: 'Madre de Amira',
      deDetalle: '4.º A de Primaria',
      asunto: 'PE uniform for Amira',
      hora: 'ayer',
      categoria: 'Familias',
      etiqueta: { texto: 'Responder hoy', tipo: 'hoy' },
      resumen: [
        'La madre de Amira escribe en inglés. Amira llegó a 4.º A en octubre y hace Educación Física con su ropa de deporte.',
        'Pregunta si vale así de momento, dónde se compra el chándal del colegio, cuánto cuesta y qué días hay Educación Física.',
        'Amira tiene Educación Física mañana: conviene contestar hoy.',
      ],
      piden: 'Saber si vale su ropa de deporte, dónde se compra el chándal, cuánto cuesta y qué días tiene Educación Física.',
      original: 'Dear Ms Sánchez,\n\nMy name is Nadia and I am Amira’s mother. Amira started in 4.º A in October and she is very happy in your class.\n\nShe told me that she needs a special uniform for PE and that the other children wear the school tracksuit. At the moment she wears her own leggings and trainers. I hope this is OK for now.\n\nI would like to know where we can buy the tracksuit and how much it costs. I would also like to know which days she has PE, so she always brings the right clothes.\n\nSorry for writing in English. My Spanish is still very basic.\n\nThank you very much,\nNadia',
      respuestas: [
        {
          titulo: 'Contestar a todo',
          texto: 'Dear Nadia,\n\nThank you for your message. Amira can wear her own leggings and trainers until you buy the PE kit. The school tracksuit (€42) and T-shirt (€12) are sold at the uniform shop next to the school office, on Tuesdays and Thursdays from 16:00 to 17:30. She has PE on Mondays and Thursdays.\n\nBest wishes,\nLaura Sánchez\nClass teacher of 4.º A and PE teacher\n\n[En español: Gracias por su mensaje. Amira puede venir con sus mallas y sus zapatillas hasta que compren el uniforme. El chándal (42 €) y la camiseta (12 €) se venden en la tienda de uniformes, junto a secretaría, los martes y jueves de 16:00 a 17:30. Tiene Educación Física los lunes y los jueves.]',
        },
        {
          titulo: 'Quedar mañana a la salida',
          texto: 'Dear Nadia,\n\nThank you for writing, and please don’t worry about your Spanish. Amira can wear her own sports clothes for now. We can meet tomorrow at 16:00 at the school gate, and I will show you the PE kit and the uniform shop. The tracksuit costs €42 and the T-shirt €12. She has PE on Mondays and Thursdays.\n\nKind regards,\nLaura Sánchez\nClass teacher of 4.º A and PE teacher\n\n[En español: Gracias por escribir, y no se preocupe por el español. De momento, Amira puede venir con su ropa de deporte. Podemos vernos mañana a las 16:00 en la puerta del colegio y le enseño el uniforme y la tienda. El chándal cuesta 42 € y la camiseta, 12 €. Tiene Educación Física los lunes y los jueves.]',
        },
        {
          titulo: 'Pedirle la talla',
          texto: 'Dear Nadia,\n\nAmira can wear her own sports clothes for now, and she has PE on Mondays and Thursdays.\n\nCould you tell me her size? I will ask the uniform shop next to the school office to keep a tracksuit (€42) and a T-shirt (€12) for her. It is open on Tuesdays and Thursdays from 16:00 to 17:30.\n\nBest wishes,\nLaura Sánchez\nClass teacher of 4.º A and PE teacher\n\n[En español: De momento, Amira puede venir con su ropa de deporte, y tiene Educación Física los lunes y los jueves. ¿Me dice su talla? Pediré a la tienda de uniformes, junto a secretaría, que le guarde un chándal (42 €) y una camiseta (12 €). Abre los martes y jueves de 16:00 a 17:30.]',
        },
      ],
      nota: 'Tienda y precios, de la guía para familias del colegio. La circular de la salida en inglés la está revisando orientación.',
    },
    {
      id: 'c-secretaria',
      de: 'Carmen López',
      deDetalle: 'Secretaría y administración',
      asunto: 'Autorizaciones de la salida al Jardín Botánico',
      hora: 'ayer',
      categoria: 'Equipo directivo',
      etiqueta: { texto: 'En secretaría el vie 20', tipo: 'plazo' },
      resumen: [
        'Las autorizaciones firmadas de 4.º A tienen que estar en secretaría el viernes 20 antes de las 14:00, con la lista de quién falta.',
        'El lunes 23 Carmen confirma las entradas del Jardín y las plazas del autobús: no puede esperar más.',
        'Sin autorización firmada no se puede ir. Si una familia tiene problemas con el pago, que hable con ella.',
      ],
      piden: 'Llevar las autorizaciones de 4.º A a secretaría el viernes 20 antes de las 14:00, con la lista de quién falta.',
      original: 'Hola, Laura:\n\nTe recuerdo que las autorizaciones de la salida al Jardín Botánico tienen que estar en secretaría como muy tarde el viernes 20, antes de las 14:00. Tráemelas todas juntas, con una lista de quién no la ha entregado.\n\nEl lunes 23 a primera hora tengo que confirmar al Jardín el número de entradas y a la empresa de autobuses las plazas, así que no puedo esperar más.\n\nYa sabes que quien no tenga la autorización firmada no puede ir. Si alguna familia tiene algún problema con el pago, que hable conmigo y lo resolvemos con discreción.\n\nGracias,\nCarmen López\nSecretaría',
      respuestas: [
        {
          titulo: 'Confirmar que se las llevas el viernes',
          texto: 'Hola, Carmen:\n\nDe acuerdo. El viernes 20 te llevo las de 4.º A antes de las 14:00, todas juntas y con la lista de quién falta.\n\nHoy lo recuerdo en clase y lo apunto en las agendas, para que no se quede ninguna en la mochila.\n\nGracias,\nLaura Sánchez\nTutora de 4.º A',
        },
        {
          titulo: 'Pedirle más copias',
          texto: 'Hola, Carmen:\n\n¿Me puedes dejar cinco copias más de la autorización en mi casillero de la sala de profesores? A alguna familia no le ha llegado la circular y prefiero dársela hoy en mano.\n\nEl viernes 20 te las llevo todas antes de las 14:00, con la lista de quién falta.\n\nGracias,\nLaura Sánchez\nTutora de 4.º A',
        },
        {
          titulo: 'Preguntar por una que llegue tarde',
          texto: 'Hola, Carmen:\n\nEl viernes 20 te llevo las de 4.º A antes de las 14:00. Una pregunta: a una familia de mi clase le llega esta semana la circular en inglés. Si su autorización me la traen el lunes 23 a primera hora, ¿todavía la puedes contar antes de confirmar las plazas?\n\nGracias,\nLaura Sánchez\nTutora de 4.º A',
        },
      ],
      nota: 'DirectorIA ha añadido la entrega a tus plazos: viernes 20, antes de las 14:00.',
      ir: 'plazos',
    },
    {
      id: 'c-coordinacion',
      de: 'Pilar Serrano',
      deDetalle: 'Coordinadora del 2.º ciclo de Primaria',
      asunto: 'Programación quincenal del 23 de noviembre al 4 de diciembre',
      hora: 'lun 16',
      categoria: 'Claustro',
      etiqueta: { texto: 'Subir el vie 20', tipo: 'plazo' },
      resumen: [
        'Hay que subir la programación quincenal del 23 de noviembre al 4 de diciembre, como muy tarde el viernes 20.',
        'Con el modelo del ciclo y, en cada sesión, la tarea y la página del libro: de ahí sale la ficha de quien te cubra.',
        'Para 4.º: el viernes 27 por la mañana es la salida, y hay que dejar tarea para las sesiones con otros grupos.',
      ],
      piden: 'Subir la programación quincenal del 23 de noviembre al 4 de diciembre, como muy tarde el viernes 20.',
      original: 'Hola a todos:\n\nOs recuerdo que, como muy tarde el viernes 20, hay que subir a DirectorIA la programación quincenal del 23 de noviembre al 4 de diciembre. Usad el modelo del ciclo y poned en cada sesión la tarea y la página del libro, aunque os parezca obvio: si un día faltáis, de ahí sale la ficha de quien os cubra y no tenéis que mandar nada desde casa.\n\nPara 4.º: el viernes 27 por la mañana es la salida al Botánico. Dejad tarea para las sesiones que tengáis esa mañana con otros grupos.\n\nGracias y buena semana,\nPilar Serrano\nCoordinadora del 2.º ciclo',
      adjuntos: ['Modelo de programación quincenal del 2.º ciclo.docx'],
      respuestas: [
        {
          titulo: 'Confirmar que la subes el viernes',
          texto: 'Hola, Pilar:\n\nLa subo el viernes con el modelo del ciclo. Dejo también preparada la tarea de mi Educación Física con 3.º A del viernes 27 a 4.ª hora, que ese día estaré en el Botánico con 4.º A.\n\nUn abrazo,\nLaura Sánchez\nTutora de 4.º A',
        },
        {
          titulo: 'Preguntar por Educación Física',
          texto: 'Hola, Pilar:\n\nUna duda antes de subirla: mis sesiones de Educación Física con 3.º A, 3.º B y 4.º B, ¿las incluyo en mi programación o las pone cada tutor en la suya? Lo pregunto para que la tarea no salga repetida en las fichas ni falte.\n\nLa subo el viernes.\n\nGracias,\nLaura Sánchez\nTutora de 4.º A',
        },
      ],
      nota: 'El viernes 27 estás en la salida: tu Educación Física de 3.º A a 4.ª hora necesita tarea. Lo tienes en tus plazos.',
      ir: 'plazos',
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
        'Desde enero, lectura diaria de 14:30 a 14:50 en toda Primaria, con quien tenga clase a esa hora, también los especialistas.',
        'Cada aula tendrá un lote de 30 libros de la biblioteca, que se reparte la semana del 14 de diciembre. Sin notas ni fichas.',
        'Si quieres títulos concretos para 4.º A, pídeselos a la biblioteca antes del viernes 4 de diciembre.',
      ],
      piden: '',
      original: 'Queridos compañeros de Primaria:\n\nComo acordamos en el claustro del lunes, a partir de enero dedicaremos 20 minutos diarios a la lectura en todos los cursos de Primaria. Así lo vamos a organizar:\n\nSerá cada día de 14:30 a 14:50, al volver de comer, en el aula y con quien tenga clase con el grupo a esa hora. También los especialistas.\n\nCada aula tendrá un lote de 30 libros de la biblioteca, que iremos cambiando cada trimestre. Los repartiremos la semana del 14 de diciembre. Si queréis títulos concretos para vuestro grupo, pedídselos a la biblioteca antes del viernes 4 de diciembre.\n\nNo se pone nota ni hay fichas: se trata de que lean por gusto.\n\nGracias por las ideas que salieron en el claustro.\n\nUn abrazo,\nElena Ruiz\nDirectora',
      adjuntos: ['Plan de lectura de Primaria.pdf'],
      respuestas: [],
      nota: 'Solo para leer. DirectorIA ha añadido a tus plazos la petición de títulos para el lote de 4.º A, antes del viernes 4 de diciembre.',
      ir: 'plazos',
    },
  ],

  // ───────────────────────────── Módulos ─────────────────────────────
  modulos: [
    // Correo dictado a la familia de Daniel M.
    {
      id: 'dictado',
      tipo: 'dictado',
      menu: 'Correo dictado',
      antetitulo: 'Del dictado al correo',
      titulo: 'Correo a la familia de Daniel M.',
      entradilla: 'Dicta el correo como se lo contarías a un compañero. DirectorIA lo redacta en el tono adecuado para la familia; tú lo revisas, lo cambias si quieres y lo envías.',
      para: 'Familia de Daniel M. (4.º A)',
      transcripcion: 'Vale, a ver. Es para la familia de Daniel, el de mi clase. Eh… quiero contarles que lleva como una semana sin traer los deberes, desde el martes pasado o así, y que en clase le veo cansado, que le cuesta arrancar por las mañanas. Pero que no es una queja, ¿eh? Que Daniel participa un montón y es un cielo con los compañeros. Bueno, que me gustaría verles para hablarlo con calma. Proponles el lunes a las cuatro y cuarto, que es mi hora de tutorías, o el miércoles 25 a mediodía, a la una menos cuarto. Y si no les va bien ninguna, que me digan ellos.',
      asunto: 'Tutoría para hablar de Daniel',
      borrador: 'Estimada familia:\n\nMe gustaría que nos viéramos para hablar de Daniel con calma.\n\nDesde hace una semana, más o menos, no trae los deberes hechos, y en clase lo noto más cansado de lo habitual: le cuesta arrancar por las mañanas. No se lo cuento como una queja. Daniel participa mucho y se lleva muy bien con sus compañeros, y quiero que entre todos le ayudemos a estar a gusto.\n\nLes propongo el lunes 23 de noviembre a las 16:15 o el miércoles 25 a las 12:45, en el aula de 4.º A. Si ninguno de los dos momentos les viene bien, díganme qué día les encaja mejor y lo buscamos.\n\nY si en casa han notado algo, será un buen momento para hablarlo.\n\nUn saludo cordial,\nLaura Sánchez\nTutora de 4.º A',
      notas: [
        'Tono cercano y sin juicios: cuenta lo que ves en clase, sin dar nada por supuesto',
        'Dos horarios, comprobados en tu agenda: lun 23 a las 16:15 y mié 25 a las 12:45',
        'Añade algo que no dijiste: una invitación a contar lo que hayan notado en casa',
      ],
    },

    // E12. Banco de recursos
    {
      id: 'banco',
      tipo: 'banco',
      menu: 'Banco de recursos',
      antetitulo: 'Banco de recursos del claustro',
      titulo: 'Encuentra lo que buscas, o lo más parecido',
      entradilla: 'Fichas, flashcards, juegos y rúbricas del claustro, hechos con IA o sin ella. El buscador entiende lo que pides y, si no hay nada para tu curso, te enseña lo más cercano.',
      consulta: 'flashcards de alimentos para EF 2.º ciclo',
      entendido: ['Flashcards', 'Alimentación saludable', 'Educación Física', '3.º y 4.º de Primaria'],
      aviso: 'Todavía no hay de Educación Física en 2.º ciclo. Te enseñamos lo más parecido:',
      resultados: [
        {
          titulo: 'Flashcards: los grupos de alimentos',
          meta: 'Educación Física · 6.º de Primaria · De Marta R. · Hecho con IA y revisado',
          cercania: 'Misma materia, ciclo siguiente',
          adaptar: {
            boton: 'Adaptar a 3.º–4.º',
            titulo: 'Flashcards: los grupos de alimentos · versión para 3.º y 4.º',
            texto: [
              'Tarjeta 1 · Frutas: manzana, mandarina y plátano. «Te dan energía y vitaminas. Toma fruta cada día».',
              'Tarjeta 2 · Verduras y hortalizas: zanahoria, tomate y brócoli. «Con ellas llenas medio plato».',
              'Tarjeta 3 · Cereales: pan, arroz y pasta, mejor integrales. «Son la gasolina para correr y jugar».',
              'Tarjeta 4 · Legumbres, huevos, pescado y carne. «Te ayudan a crecer y a tener los músculos fuertes».',
              'Tarjeta 5 · Leche, yogur y queso. «Cuidan tus huesos y tus dientes».',
              'Tarjeta 6 · Agua. «La mejor bebida antes, durante y después de hacer deporte».',
              'Juego para el gimnasio: reparte las tarjetas por la pista. Cada equipo corre a por ellas y monta en su aro un almuerzo para el recreo.',
            ],
            nota: 'Versión preparada con IA a partir del recurso de Marta R., con frases más cortas, seis tarjetas en vez de diez y sin la tabla de nutrientes. Revísala antes de usarla; queda enlazada al original.',
          },
        },
        {
          titulo: 'Tarjetas de hábitos saludables',
          meta: 'Educación Física · 2.º de Primaria · De Luis G.',
          cercania: 'Misma materia, ciclo anterior',
        },
        {
          titulo: 'Juego: la pirámide de los alimentos',
          meta: 'Ciencias de la Naturaleza · 4.º de Primaria · De Pilar S.',
          cercania: 'Mismo curso, materia afín',
        },
      ],
      subir: {
        titulo: 'Flashcards: frutas y verduras de temporada',
        curso: ['3.º de Primaria', '4.º de Primaria'],
        materia: ['Educación Física'],
        contenidos: ['Alimentación saludable', 'Hábitos de vida activa'],
        casillas: ['Sin fotos ni datos de alumnos', 'Es mío o puedo compartirlo'],
        declaracion: 'Lo he hecho con IA y lo he revisado',
      },
      impacto: {
        texto: 'Tus 12 recursos se han usado 87 veces y 9 compañeros han dicho «Me ha servido».',
        insignias: ['Primer recurso', 'Un compañero lo adaptó', 'Primera situación de aprendizaje'],
        meta: '6 de 8 peticiones «Se busca» del 2.º ciclo ya tienen respuesta',
      },
    },

    // E13. Material didáctico con Claude (módulo opcional)
    {
      id: 'material',
      tipo: 'material',
      menu: 'Material con Claude',
      antetitulo: 'Opcional · material didáctico',
      titulo: 'Prepara material didáctico con Claude',
      entradilla: 'Pide fichas, juegos o situaciones de aprendizaje. Escribe sin nombres ni datos de alumnos; si se cuela alguno, el filtro está pensado para pararlo. Lo que te devuelve Claude, lo revisas tú.',
      aviso: 'Solo para material didáctico. No tiene acceso a los datos del colegio, un filtro está pensado para bloquear datos personales y la norma de uso es no introducirlos. El colegio lo paga en su propia cuenta.',
      peticion: 'Situación de aprendizaje sobre alimentación saludable para 4.º de Primaria: tres sesiones de 45 minutos, una en el gimnasio, y una versión con tareas más cortas para quien lo necesite.',
      bloqueo: {
        intento: 'Situación de aprendizaje sobre alimentación saludable para 4.º de Primaria: tres sesiones, una en el gimnasio, y tareas más cortas para Daniel M., que necesita las instrucciones de una en una.',
        mensaje: 'Lleva un nombre, «Daniel M.», y en el módulo de Claude no se escriben datos de alumnos. No se ha enviado nada. Quita el nombre y pídelo así: «para quien lo necesite».',
      },
      respuesta: {
        titulo: 'Situación de aprendizaje · Almuerzos con energía (4.º de Primaria)',
        bloques: [
          { tipo: 'campo', etiqueta: 'Curso', texto: '4.º de Primaria' },
          { tipo: 'campo', etiqueta: 'Áreas', texto: 'Ciencias de la Naturaleza y Educación Física' },
          { tipo: 'campo', etiqueta: 'Duración', texto: 'Tres sesiones de 45 minutos: dos en el aula y una en el gimnasio' },
          { tipo: 'campo', etiqueta: 'Producto final', texto: 'Un cartel por equipos con un almuerzo saludable para el recreo, que cada equipo presenta a la clase' },
          { tipo: 'titulo', texto: 'El reto' },
          { tipo: 'parrafo', texto: 'En el recreo gastamos mucha energía corriendo y jugando. ¿Qué almuerzo nos la devuelve y, además, nos gusta? Cada equipo diseña uno, explica por qué es saludable y lo defiende ante la clase.' },
          { tipo: 'titulo', texto: 'Sesión 1 · En el aula: el plato saludable' },
          {
            tipo: 'lista',
            items: [
              'Para empezar, cada uno dice qué le gusta almorzar en el recreo. Se apunta en la pizarra, sin juzgar a nadie.',
              'Por parejas, clasifican tarjetas de alimentos en el plato saludable: la mitad, frutas y verduras; un cuarto, cereales, mejor integrales; y otro cuarto, legumbres, huevos, pescado o carne. Para beber, agua.',
              'Por equipos, eligen tres almuerzos que les gusten y comprueban en el plato si son equilibrados.',
            ],
          },
          { tipo: 'titulo', texto: 'Sesión 2 · En el gimnasio: el relevo del almuerzo' },
          {
            tipo: 'lista',
            items: [
              'Calentamiento: el alumnado salta cuando oye una fruta, se agacha con una verdura y corre a su línea si oye «agua».',
              'Relevo por equipos: cada uno corre a por una tarjeta y, entre todos, montan en su aro un almuerzo equilibrado.',
              'Vuelta a la calma: cómo se siente el cuerpo después de moverse y por qué el agua es la mejor bebida.',
            ],
          },
          { tipo: 'titulo', texto: 'Sesión 3 · En el aula: nuestro almuerzo con energía' },
          {
            tipo: 'lista',
            items: [
              'Cada equipo hace su cartel: el almuerzo, de qué grupos de alimentos es y por qué da energía.',
              'Presentación de dos minutos por equipo y una pregunta de la clase a cada uno.',
              'Los carteles se cuelgan en el pasillo para que los vean los demás cursos.',
            ],
          },
          { tipo: 'titulo', texto: 'Para quien lo necesite' },
          {
            tipo: 'lista',
            items: [
              'Tareas más cortas: en la sesión 1, dos almuerzos en vez de tres.',
              'Instrucciones de una en una, con una tarjeta para cada paso.',
              'En el relevo, un papel fijo dentro del equipo, por ejemplo colocar las tarjetas en el aro.',
            ],
          },
          { tipo: 'titulo', texto: 'Para tu evaluación' },
          { tipo: 'parrafo', texto: 'Una lista de cotejo con cuatro aspectos: clasifica los alimentos en el plato, diseña un almuerzo equilibrado, explica por qué da energía y colabora con su equipo. La observación y la valoración son tuyas.' },
          { tipo: 'aviso', texto: 'Ten en cuenta las alergias e intolerancias de tu grupo al elegir los alimentos de las tarjetas y de los almuerzos. Ese dato lo conoces tú: no hace falta escribirlo aquí.' },
        ],
      },
    },

    // Tus plazos y entregas
    {
      id: 'plazos',
      tipo: 'plazos',
      menu: 'Tus plazos',
      antetitulo: 'Plazos y entregas',
      titulo: 'Lo que tienes que entregar, y cuándo',
      entradilla: 'DirectorIA saca tus plazos de los correos, las circulares y los acuerdos del claustro, y te avisa antes de que venzan. Cuando entregues algo, márcalo como hecho.',
      items: [
        {
          fecha: 'mar 17 nov',
          titulo: 'Repartir en 4.º A la circular de la salida',
          detalle: 'Repartida en clase. La versión en inglés para la familia de Amira la está revisando orientación.',
          quien: 'Tú',
          origen: 'Acuerdo del claustro del lunes 16',
          estado: 'hecho',
        },
        {
          fecha: 'Hoy, mié 18 nov',
          titulo: 'Proponer una tutoría a la familia de Daniel M.',
          detalle: 'Díctalo en «Correo dictado»: te llega redactado y con dos horarios para elegir.',
          quien: 'Tú',
          origen: 'Tu nota del lunes 16',
          estado: 'hoy',
        },
        {
          fecha: 'jue 19 nov · 11:45',
          titulo: 'Tutoría con una familia de 4.º A',
          detalle: 'Es a 4.ª hora, en tu guardia. Pediste a jefatura que la haga Rosa Medina y todavía no te ha contestado.',
          quien: 'Tú',
          origen: 'Tu correo a jefatura del martes 17',
          estado: 'pronto',
        },
        {
          fecha: 'vie 20 nov',
          titulo: 'Programación quincenal del 23 de noviembre al 4 de diciembre',
          detalle: 'Con el modelo del ciclo y, en cada sesión, la tarea y la página del libro. De ahí sale la ficha de quien te cubra si faltas.',
          quien: 'Tú',
          origen: 'Correo de la coordinadora del 2.º ciclo',
          estado: 'pronto',
        },
        {
          fecha: 'vie 20 nov · 14:00',
          titulo: 'Autorizaciones de la salida al Jardín Botánico',
          detalle: 'Las de 4.º A firmadas, en secretaría, todas juntas y con la lista de quién falta. Sin autorización no se puede ir.',
          quien: 'Tú',
          origen: 'Correo de secretaría',
          estado: 'pronto',
        },
        {
          fecha: 'vie 27 nov · 9:15',
          titulo: 'Salida al Jardín Botánico con 4.º',
          detalle: 'Vuelta a las 13:30. Deja en la programación la tarea de tu Educación Física de 3.º A a 4.ª hora; jefatura organiza quién la cubre.',
          quien: 'Tú, con el equipo de 4.º',
          origen: 'Acuerdo del claustro del lunes 16',
          estado: 'despues',
        },
        {
          fecha: 'vie 27 nov · 3.ª hora',
          titulo: 'La guardia que ofreciste devolver a Rosa Medina',
          detalle: 'Coincide con la salida: estarás fuera de 9:15 a 13:30. Busca con ella otro día y díselo a jefatura.',
          quien: 'Tú y Rosa Medina',
          origen: 'Tu correo a jefatura del martes 17',
          estado: 'pronto',
        },
        {
          fecha: 'vie 4 dic',
          titulo: 'Títulos para el lote de lectura de 4.º A',
          detalle: 'Si quieres libros concretos para el aula, pídeselos a la biblioteca. Los 20 minutos diarios de lectura empiezan en enero.',
          quien: 'Tú',
          origen: 'Correo de dirección del martes 17',
          estado: 'despues',
        },
        {
          fecha: '9-11 dic',
          titulo: 'Sesión de la 1.ª evaluación de 4.º A',
          detalle: 'Jefatura publicará el calendario por grupos. Como tutora, coordinas la sesión con el equipo docente de 4.º A.',
          quien: 'Tú, con el equipo docente',
          origen: 'Acuerdo del claustro del lunes 16',
          estado: 'despues',
        },
      ],
    },
  ],
});
