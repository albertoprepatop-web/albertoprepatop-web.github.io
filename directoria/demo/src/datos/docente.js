DEMO.rol({
  id: 'docente',
  orden: 4,
  persona: {
    nombre: 'Laura Sánchez',
    cargo: 'Docente',
    detalle: 'Tutora de 4.º A · Educación Física en 2.º ciclo',
    ilustracion: 'docente',
  },
  acceso: 'Correo y dictado, banco de recursos, plazos, justificantes y material con Claude',

  // ───────────────────────────── Inicio ─────────────────────────────
  // Panel de mando. Cifras, día y calendario salen de reglas y de los datos del colegio: sin insignia de IA.
  // Las filas que resumen un correo y los plazos sacados de un correo llevan la insignia (la pone el motor).
  inicio: {
    antetitulo: 'Miércoles 18 de noviembre · 8:00',
    titulo: 'Buenos días, Laura',
    entradilla: 'Tus clases, lo que te ha llegado y lo que vence. Nada sale sin que lo revises y lo envíes tú.',

    cifras: [
      {
        // Un correo general a las familias de un grupo, sin datos de ningún alumno.
        etiqueta: 'Correo a las familias',
        icono: 'microfono',
        progreso: 'dictado',
        hoy: true,
        nota: 'El recordatorio de la salida, para 4.º A. Te llega redactado para revisar.',
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
        { grupo: 'Hoy', icono: 'familia', titulo: 'Una familia de 4.º A: qué llevar a la salida', detalle: 'No les ha llegado la circular. Tienes tres respuestas propuestas.', estado: 'hoy', ir: 'correo:c-salida', sigue: 'correo:c-salida' },
        { grupo: 'Hoy', icono: 'familia', titulo: 'Una familia de 4.º A escribe en inglés por el chándal', detalle: 'Tu Educación Física con 4.º A es mañana. Las respuestas están en inglés y traducidas.', estado: 'hoy', ir: 'correo:c-chandal', sigue: 'correo:c-chandal' },
        { grupo: 'Hoy', icono: 'microfono', titulo: 'Recordatorio de la salida a las familias de 4.º A', detalle: 'Dicta el correo y te llega redactado para revisar.', estado: 'hoy', ir: 'dictado', sigue: 'dictado', siDictado: { detalle: 'Ya lo has dictado. Te queda revisar el correo y enviarlo.' } },
        // El justificante de su ausencia del lunes 16 (E8): lo sube desde DirectorIA, no por correo, y un programa lo archiva
        // en su carpeta. Sin el motivo y sin la insignia de la IA (no sale de un correo).
        { grupo: 'Esta semana', icono: 'documento', titulo: 'Tu justificante del lunes 16', detalle: 'El de tu ausencia de 9:00 a 10:30. Súbelo desde aquí, no por correo: un programa lo archiva en tu carpeta.', estado: 'pendiente', ir: 'justificantes', sigue: 'justificantes#j1', verbo: 'Entregado' },
        // El choque lo detecta DirectorIA cruzando tu horario con la salida: son reglas y fechas, así que va sin insignia
        // (ia: false, aunque siga a tu correo en jefatura). Va en «Para saber»: es la semana que viene, la guardia la cubre
        // otra persona y tú no haces nada. Pasa a hecho («Confirmado») cuando jefatura te contesta: las dos respuestas dicen
        // que esa guardia también la cubre otra persona (#0,1). Si jefatura archiva tu correo, no cambia.
        { grupo: 'Para saber', icono: 'alerta', titulo: 'Tu guardia del viernes 27 coincide con la salida', detalle: 'Estarás en el Jardín Botánico de 9:15 a 13:30, así que la cubre otra persona. Jefatura ya lo sabe.', estado: 'info', choque: true, ia: false, ir: 'plazos', sigue: 'jefatura/correo:c-laura#0,1', verbo: 'Confirmado', si: { detalle: 'Jefatura te ha confirmado que la cubre otra persona.' } },
        { grupo: 'Para saber', icono: 'libro', titulo: 'Plan de lectura desde enero', detalle: '20 minutos diarios en Primaria, de 14:30 a 14:50. Dirección te cuenta cómo se organiza.', estado: 'info', ir: 'correo:c-lectura' },
      ],
    },

    // fuente: 'correo' para los plazos que la IA ha sacado de un correo (llevan la insignia), como en «Tus plazos».
    // La tutoría del jueves sale de tu correo a jefatura y sigue a ese correo en jefatura: cuando jefatura lo responde (las
    // dos respuestas dicen que tu guardia la cubre Rosa Medina), el detalle lo dice. Si jefatura lo archiva, sigue sin contestar.
    // El choque del viernes 27 no sale de ningún correo, sino de tu horario y la salida: va sin fuente y sin insignia.
    agenda: {
      titulo: 'Lo que viene',
      desde: '2026-11-16',
      semanas: 3,
      marcas: [
        { fecha: '2026-11-19', hora: '11:45', tipo: 'evento', titulo: 'Tutoría con una familia de 4.º A', detalle: 'Coincide con tu guardia. Has pedido a jefatura que la cubra otra persona y aún no te ha contestado.', fuente: 'correo', ir: 'plazos', sigue: 'jefatura/correo:c-laura', si: { detalle: 'Coincide con tu guardia. Jefatura te ha contestado: la cubre Rosa Medina.', estado: 'pendiente' } },
        { fecha: '2026-11-20', tipo: 'plazo', titulo: 'Programación quincenal', detalle: 'Del 23 de noviembre al 4 de diciembre, con el modelo del ciclo.', fuente: 'correo', ir: 'plazos', sigue: 'plazos#3', verbo: 'Entregada' },
        { fecha: '2026-11-20', tipo: 'plazo', titulo: 'Autorizaciones de la salida, antes de las 14:00', detalle: 'Las de 4.º A firmadas, en secretaría. Dile a Carmen cuántas faltan.', fuente: 'correo', ir: 'plazos', sigue: 'plazos#4', verbo: 'Entregadas' },
        { fecha: '2026-11-27', hora: '9:15', tipo: 'evento', titulo: 'Salida al Jardín Botánico', detalle: 'Con 4.º. Vuelta a las 13:30.', ir: 'plazos' },
        { fecha: '2026-11-27', tipo: 'aviso', choque: true, titulo: 'Tu guardia de 3.ª hora y la salida', detalle: 'Estarás en la salida, así que la cubre otra persona. Jefatura ya lo sabe.', ir: 'plazos', sigue: 'jefatura/correo:c-laura#0,1', verbo: 'Confirmado', si: { detalle: 'Jefatura te ha confirmado que la cubre otra persona.' } },
        { fecha: '2026-12-04', tipo: 'plazo', titulo: 'Títulos para el lote de lectura', detalle: 'Si quieres libros concretos para 4.º A, pídeselos a la biblioteca antes de este día.', fuente: 'correo', ir: 'plazos', sigue: 'plazos#6', verbo: 'Pedidos' },
      ],
    },
  },

  // ───────────────────────────── Correo ─────────────────────────────
  correo: [
    {
      // Las familias escriben de temas generales y sin nombres de alumnos: «mi hijo», «una familia de 4.º A».
      id: 'c-salida',
      de: 'Raquel',
      deDetalle: 'Familia de 4.º A de Primaria',
      asunto: 'Excursión al Botánico: ¿qué tienen que llevar?',
      hora: '7:38',
      categoria: 'Familias',
      etiqueta: { texto: 'Autorización antes del vie 20', tipo: 'plazo' },
      resumen: [
        'A una familia de 4.º A no le ha llegado la circular de la salida al Jardín Botánico del viernes 27.',
        'Pregunta el horario, qué hay que llevar, si comen allí y cuánto cuesta.',
        'Ofrece traer la autorización firmada el lunes 23, pero el plazo acaba el viernes 20.',
      ],
      piden: 'Saber el horario, qué hay que llevar, si comen allí, el precio y si hay que firmar algo.',
      original: 'Hola, Laura:\n\nMi hijo nos ha dicho que el viernes 27 os vais de excursión al Jardín Botánico, pero la circular no ha llegado a casa. Suponemos que estará en el fondo de la mochila, como casi todo últimamente.\n\n¿Nos puedes decir a qué hora salís y a qué hora volvéis, y qué tienen que llevar? No sabemos si hace falta almuerzo o si comen allí. Tampoco sabemos cuánto cuesta.\n\nSi hay que firmar algo, dínoslo y te lo llevamos el lunes sin falta.\n\nMuchas gracias y un saludo,\nRaquel',
      respuestas: [
        {
          titulo: 'Contarle todo y mandar otra copia',
          texto: 'Hola, Raquel:\n\nGracias por escribir. Le cuento: el viernes 27 salimos a las 9:15 y volvemos a las 13:30. No comen allí: llegamos a tiempo para la comida. Tienen que llevar almuerzo, agua, gorra y ropa cómoda. Cuesta 6 €, con la entrada y el autobús, y va en el recibo de diciembre.\n\nHoy le doy a su hijo otra copia de la circular, con la autorización. Tiene que volver firmada antes del viernes 20: el lunes ya sería tarde para confirmar las plazas.\n\nUn saludo,\nLaura Sánchez\nTutora de 4.º A',
        },
        {
          titulo: 'Dársela hoy en mano a la salida',
          texto: 'Hola, Raquel:\n\nGracias por avisar. Si viene hoy a las 16:00 a la salida del colegio, le doy la circular en mano y le cuento lo que necesite.\n\nLo principal: el viernes 27 salimos a las 9:15 y volvemos a las 13:30, a tiempo para la comida. Tienen que llevar almuerzo, agua, gorra y ropa cómoda, y cuesta 6 €. La autorización tiene que estar firmada antes del viernes 20; el lunes ya sería tarde.\n\nUn saludo,\nLaura Sánchez\nTutora de 4.º A',
        },
        {
          titulo: 'Proponer que la firme en secretaría',
          texto: 'Hola, Raquel:\n\nGracias por escribir. Como la circular no ha llegado a casa, puede pasar a firmar la autorización por secretaría cualquier mañana hasta el viernes 20: allí tienen copias. El lunes ya sería tarde para confirmar las plazas.\n\nLo que necesita saber: salimos a las 9:15 y volvemos a las 13:30, a tiempo para la comida. Tienen que llevar almuerzo, agua, gorra y ropa cómoda. Cuesta 6 €, con la entrada y el autobús.\n\nUn saludo,\nLaura Sánchez\nTutora de 4.º A',
        },
      ],
      nota: 'Datos sacados de la circular de la salida. Si quieres recordárselo a todas las familias de 4.º A, díctalo en «Correo dictado».',
      ir: 'dictado',
    },
    {
      id: 'c-chandal',
      de: 'Nadia',
      deDetalle: 'Familia de 4.º A de Primaria',
      asunto: 'PE uniform',
      hora: 'ayer',
      categoria: 'Familias',
      etiqueta: { texto: 'Responder hoy', tipo: 'hoy' },
      resumen: [
        'Una familia de 4.º A escribe en inglés: su hija hace Educación Física con su propia ropa de deporte.',
        'Pregunta si vale así de momento, dónde se compra el chándal del colegio, cuánto cuesta y qué días hay Educación Física.',
        'Tu Educación Física con 4.º A es mañana: conviene contestar hoy.',
      ],
      piden: 'Saber si vale su ropa de deporte, dónde se compra el chándal, cuánto cuesta y qué días hay Educación Física.',
      original: 'Dear Ms Sánchez,\n\nMy daughter is in your class, 4.º A, and she is very happy there. She told me that the other children wear the school tracksuit for PE. At the moment she wears her own leggings and trainers. I hope this is OK for now.\n\nI would like to know where we can buy the tracksuit and how much it costs. I would also like to know which days the class has PE, so she always brings the right clothes.\n\nSorry for writing in English. My Spanish is still very basic.\n\nThank you very much,\nNadia',
      respuestas: [
        {
          titulo: 'Contestar a todo',
          texto: 'Dear Nadia,\n\nThank you for your message. Your daughter can wear her own leggings and trainers until you buy the PE kit. The school tracksuit (€42) and T-shirt (€12) are sold at the uniform shop next to the school office, on Tuesdays and Thursdays from 16:00 to 17:30. The class has PE on Mondays and Thursdays.\n\nBest wishes,\nLaura Sánchez\nClass teacher of 4.º A and PE teacher\n\n[En español: Gracias por su mensaje. Su hija puede venir con sus mallas y sus zapatillas hasta que compren el uniforme. El chándal (42 €) y la camiseta (12 €) se venden en la tienda de uniformes, junto a secretaría, los martes y jueves de 16:00 a 17:30. La clase tiene Educación Física los lunes y los jueves.]',
        },
        {
          titulo: 'Quedar mañana a la salida',
          texto: 'Dear Nadia,\n\nThank you for writing, and please don’t worry about your Spanish. Your daughter can wear her own sports clothes for now. We can meet tomorrow at 16:00 at the school gate, and I will show you the PE kit and the uniform shop. The tracksuit costs €42 and the T-shirt €12. The class has PE on Mondays and Thursdays.\n\nKind regards,\nLaura Sánchez\nClass teacher of 4.º A and PE teacher\n\n[En español: Gracias por escribir, y no se preocupe por el español. De momento, su hija puede venir con su ropa de deporte. Podemos vernos mañana a las 16:00 en la puerta del colegio y le enseño el uniforme y la tienda. El chándal cuesta 42 € y la camiseta, 12 €. La clase tiene Educación Física los lunes y los jueves.]',
        },
        {
          titulo: 'Explicarle cómo encargarlo',
          texto: 'Dear Nadia,\n\nYour daughter can wear her own sports clothes for now, and the class has PE on Mondays and Thursdays.\n\nThe uniform shop next to the school office can keep a tracksuit (€42) and a T-shirt (€12) for you: just tell them the size when you go. It is open on Tuesdays and Thursdays from 16:00 to 17:30.\n\nBest wishes,\nLaura Sánchez\nClass teacher of 4.º A and PE teacher\n\n[En español: De momento, su hija puede venir con su ropa de deporte, y la clase tiene Educación Física los lunes y los jueves. En la tienda de uniformes, junto a secretaría, le pueden guardar un chándal (42 €) y una camiseta (12 €): basta con decirles la talla. Abre los martes y jueves de 16:00 a 17:30.]',
        },
      ],
      nota: 'Tienda y precios, de la guía para familias del colegio. Orientación está adaptando la circular de la salida al inglés y a lectura fácil.',
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
        'Las autorizaciones firmadas de 4.º A tienen que estar en secretaría el viernes 20 antes de las 14:00. Quiere saber cuántas faltan.',
        'El lunes 23 Carmen confirma las entradas del Jardín y las plazas del autobús: no puede esperar más.',
        'Sin autorización firmada no se puede ir. Si una familia tiene problemas con el pago, que hable con ella.',
      ],
      piden: 'Llevar las autorizaciones de 4.º A a secretaría el viernes 20 antes de las 14:00 y decir cuántas faltan.',
      original: 'Hola, Laura:\n\nTe recuerdo que las autorizaciones de la salida al Jardín Botánico tienen que estar en secretaría como muy tarde el viernes 20, antes de las 14:00. Tráemelas todas juntas y dime cuántas faltan.\n\nEl lunes 23 a primera hora tengo que confirmar al Jardín el número de entradas y a la empresa de autobuses las plazas, así que no puedo esperar más.\n\nYa sabes que quien no tenga la autorización firmada no puede ir. Si alguna familia tiene algún problema con el pago, que hable conmigo y lo resolvemos con discreción.\n\nGracias,\nCarmen López\nSecretaría',
      respuestas: [
        {
          titulo: 'Confirmar que se las llevas el viernes',
          texto: 'Hola, Carmen:\n\nDe acuerdo. El viernes 20 te llevo las de 4.º A antes de las 14:00, todas juntas, y te digo cuántas faltan.\n\nHoy lo recuerdo en clase y lo apunto en las agendas, para que no se quede ninguna en la mochila.\n\nGracias,\nLaura Sánchez\nTutora de 4.º A',
        },
        {
          titulo: 'Pedirle más copias',
          texto: 'Hola, Carmen:\n\n¿Me puedes dejar cinco copias más de la autorización en mi casillero de la sala de profesores? A alguna familia no le ha llegado la circular y prefiero dársela hoy en mano.\n\nEl viernes 20 te las llevo todas antes de las 14:00 y te digo cuántas faltan.\n\nGracias,\nLaura Sánchez\nTutora de 4.º A',
        },
        {
          titulo: 'Preguntar por una que llegue tarde',
          texto: 'Hola, Carmen:\n\nEl viernes 20 te llevo las de 4.º A antes de las 14:00. Una pregunta: esta semana sale la circular en inglés y en lectura fácil. Si alguna autorización me la traen el lunes 23 a primera hora, ¿todavía la puedes contar antes de confirmar las plazas?\n\nGracias,\nLaura Sánchez\nTutora de 4.º A',
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
    // Correo dictado a las familias de 4.º A: una comunicación general, sin datos de ningún alumno.
    {
      id: 'dictado',
      tipo: 'dictado',
      menu: 'Correo dictado',
      antetitulo: 'Del dictado al correo',
      titulo: 'Correo a las familias de 4.º A',
      entradilla: 'Dicta el correo como se lo contarías a un compañero. DirectorIA lo redacta en el tono de las circulares del colegio; tú lo revisas, lo cambias si quieres y lo envías.',
      para: 'Familias de 4.º A',
      transcripcion: 'Vale, a ver. Es para todas las familias de mi clase. Eh… que el viernes 27 nos vamos al Botánico, salimos a las nueve y cuarto y volvemos a la una y media, a tiempo para comer. Que traigan almuerzo, agua, gorra y ropa cómoda. Y lo importante: que la autorización tiene que estar firmada el viernes 20 como muy tarde, que el lunes ya no se pueden confirmar las plazas. Ah, y que si a alguien no le ha llegado la circular, que me lo diga y le doy otra copia.',
      asunto: 'Salida al Jardín Botánico: autorizaciones antes del viernes 20',
      borrador: 'Estimadas familias:\n\nLes recuerdo que el viernes 27 de noviembre 4.º A va de excursión al Jardín Botánico. Saldremos del colegio a las 9:15 y volveremos a las 13:30, a tiempo para la comida.\n\nCada alumno tiene que llevar almuerzo, agua, gorra y ropa cómoda. La salida cuesta 6 €, con la entrada y el autobús, y se cobra en el recibo de diciembre: no hace falta que traigan dinero.\n\nLo más importante: la autorización tiene que estar firmada antes del viernes 20. El lunes 23 ya no podremos confirmar las plazas.\n\nSi la circular no les ha llegado a casa, díganmelo y les doy otra copia.\n\nUn saludo cordial,\nLaura Sánchez\nTutora de 4.º A',
      notas: [
        'Tono cordial y de usted, como en las circulares del colegio',
        'Fecha, horas y plazo, comprobados con la circular de la salida',
        'Añade algo que no dijiste: el precio y que va en el recibo de diciembre',
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
          meta: 'Educación Física · 6.º de Primaria · De Marta Ramos · Hecho con IA y revisado',
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
            nota: 'Versión preparada con IA a partir del recurso de Marta Ramos, con frases más cortas, seis tarjetas en vez de diez y sin la tabla de nutrientes. Revísala antes de usarla; queda enlazada al original.',
          },
        },
        {
          titulo: 'Tarjetas de hábitos saludables',
          meta: 'Educación Física · 2.º de Primaria · De Luis García',
          cercania: 'Misma materia, ciclo anterior',
        },
        {
          titulo: 'Juego: la pirámide de los alimentos',
          meta: 'Ciencias de la Naturaleza · 4.º de Primaria · De Pilar Serrano',
          cercania: 'Mismo curso, materia afín',
        },
      ],
      subir: {
        titulo: 'Flashcards: frutas y verduras de temporada',
        curso: ['3.º de Primaria', '4.º de Primaria'],
        materia: ['Educación Física'],
        contenidos: ['Alimentación saludable', 'Hábitos de vida activa'],
        casillas: ['Sin fotos ni datos de alumnos', 'Es mío o puedo compartirlo'],
        // Lo que se comprueba al leer el archivo: con reglas (un DNI, un ©, un ISBN) y con IA (nombres o datos de salud).
        // Es el filtro que impide que entren datos de alumnos en el banco.
        comprobado: [
          { texto: 'Sin DNI, ni ©, ni ISBN', como: 'reglas' },
          { texto: 'Sin nombres ni datos de salud', como: 'ia' },
        ],
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
        intento: 'Situación de aprendizaje sobre alimentación saludable para 4.º A: tres sesiones, una en el gimnasio, y que el cartel final lo presenten Lucas y Sara.',
        mensaje: 'Lleva nombres, «Lucas» y «Sara», y en el módulo de Claude no se escriben datos de alumnos. No se ha enviado nada. Quita los nombres y pídelo sin ellos.',
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
          { tipo: 'aviso', texto: 'Antes de usar alimentos de verdad en clase, pregunta en el colegio: las indicaciones de salud de los alumnos no están en DirectorIA. No hace falta escribirlas aquí.' },
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
          detalle: 'Repartida en clase. Las versiones en inglés y en lectura fácil las está preparando orientación.',
          quien: 'Tú',
          origen: 'Acuerdo del claustro del lunes 16',
          estado: 'hecho',
        },
        {
          fecha: 'Hoy, mié 18 nov',
          titulo: 'Recordar a las familias de 4.º A la salida y las autorizaciones',
          detalle: 'Díctalo en «Correo dictado»: te llega redactado para revisar y enviarlo tú.',
          quien: 'Tú',
          origen: 'Tu nota del lunes 16',
          estado: 'hoy',
        },
        {
          fecha: 'jue 19 nov · 11:45',
          titulo: 'Tutoría con una familia de 4.º A',
          // «Tus plazos» no cambia cuando jefatura contesta: lo de si ya te ha contestado lo dice la marca del jueves 19 en el Inicio.
          detalle: 'Es a 4.ª hora, en tu guardia. Has pedido a jefatura que la cubra otra persona.',
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
          detalle: 'Las de 4.º A firmadas, en secretaría, todas juntas. Dile a Carmen cuántas faltan. Sin autorización no se puede ir.',
          quien: 'Tú',
          origen: 'Correo de secretaría',
          estado: 'pronto',
        },
        {
          // Tu guardia de 3.ª no va como plazo aparte, porque no tienes nada que entregar: la nombra la salida, y el choque va
          // en el Inicio. «De: Acuerdo del claustro», sin insignia: no lo saca la IA de un correo.
          fecha: 'vie 27 nov · 9:15',
          titulo: 'Salida al Jardín Botánico con 4.º',
          detalle: 'Vuelta a las 13:30. Deja en la programación la tarea de tu Educación Física de 3.º A a 4.ª hora. Jefatura organiza quién cubre esa clase y tu guardia de 3.ª.',
          quien: 'Tú, con el equipo de 4.º',
          origen: 'Acuerdo del claustro del lunes 16',
          estado: 'despues',
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

    // E8. Tus justificantes: lo subes desde aquí (no por correo) y eliges la ausencia; un programa lo renombra y lo guarda
    // en tu carpeta. Ni la IA ni ningún programa leen lo que pone: solo lo abrís tú y secretaría. En el registro de ausencias
    // solo pone «entregado» o «pendiente».
    {
      id: 'justificantes',
      tipo: 'justificantes',
      vista: 'subir',
      menu: 'Tus justificantes',
      antetitulo: 'Personal · tus ausencias',
      titulo: 'Tus justificantes',
      entradilla: 'Sube el justificante y elige la ausencia a la que corresponde. Un programa lo renombra y lo guarda en tu carpeta. Ni la IA ni ningún programa leen lo que pone, y el motivo no se guarda.',
      confidencial: 'Reservado · lo ves tú y secretaría, con registro de accesos',
      curso: '2026-27',
      archivo: 'escaneo_0001.pdf',
      ausencias: [
        { id: 'j1', fecha: '2026-11-16', horas: '9:00-10:30', justificante: 'pendiente' },
        { fecha: '2026-10-08', horas: 'Toda la jornada', justificante: 'entregado' },
      ],
      reglas: [
        'Un programa, con reglas y sin IA, lo renombra con la fecha y lo guarda en tu carpeta: Justificantes / curso / mes / tu nombre.',
        'Ni la IA ni ningún programa leen lo que pone: no se extrae nada de él.',
        'En el registro de ausencias solo pone «Justificante: entregado» o «pendiente», nunca el motivo.',
        'Lo ves tú y secretaría, que lleva el personal, con registro de accesos.',
        'Se borra cuando pasa el plazo que fija el colegio.',
      ],
    },
  ],
});
