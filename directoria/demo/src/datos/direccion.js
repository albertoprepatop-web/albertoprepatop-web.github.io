DEMO.rol({
  id: 'direccion',
  orden: 1,
  persona: {
    nombre: 'Elena Ruiz',
    cargo: 'Directora',
    detalle: 'Dirección del colegio',
    ilustracion: 'direccion',
  },
  acceso: 'Resumen de las 8:00, correo resumido, actas, dosier para inspección y firmas',

  // ─── Inicio: tu resumen de las 8:00 (panel de mando) ───────────────
  // Cifras, día y calendario salen de reglas y de los datos del colegio: sin insignia de IA.
  // Las filas que resumen un correo y los plazos sacados de un correo llevan la insignia (la pone el motor).
  inicio: {
    antetitulo: 'Miércoles 18 de noviembre · Tu resumen de las 8:00',
    titulo: 'Buenos días, Elena',
    entradilla: 'Lo que te espera hoy, quién cubre 3.º B y lo que vence. Nada se envía ni se firma sin ti.',

    // Lo que importa a las 8:00, de lo más urgente a lo menos. Cada cifra lleva a donde se actúa.
    cifras: [
      {
        etiqueta: 'Pendiente de tu firma',
        icono: 'firma',
        // Cuenta lo que queda. La nota lo resume: «La citación y el acta del claustro».
        // «ir» también en la cifra: es adonde lleva cuando ya no queda nada pendiente.
        ir: 'firma',
        pendientes: [
          { texto: 'La citación del Caso 2026-07', corto: 'la citación', sigue: 'firma', ir: 'firma', hoy: true, accion: 'Revisar y firmar', accionCorta: 'Firmar' },
          { texto: 'El acta del claustro del lunes 16', corto: 'el acta del claustro', sigue: 'acta', ir: 'acta', accion: 'Dar el visto bueno', accionCorta: 'Visto bueno' },
        ],
        alTerminar: 'Todo firmado',
        accionHecha: 'Ver lo firmado',
      },
      {
        etiqueta: 'Correos por responder',
        icono: 'correo',
        cuenta: 'correo',
        accion: 'Abrir el correo',
        alTerminar: 'Al día',
      },
      {
        // Cuenta atrás: miércoles, jueves y viernes. El preaviso del contrato es antes del sábado 21 (analista de gastos).
        // Solo avisa la 2.ª respuesta propuesta, «Comunicar el preaviso» (#1). Con otra respuesta, o si se archiva el correo,
        // la cuenta atrás sigue y la nota lo dice (aMedias): pedir la oferta o una reunión no es avisar.
        etiqueta: 'Fotocopiadoras',
        icono: 'reloj',
        valor: '3 días',
        rotulo: 'para avisar, antes del sáb 21',
        cuentaAtras: '2026-11-21',
        nota: 'Si no avisas, el contrato se renueva solo el 1 de diciembre.',
        sigue: 'correo:c-fotocopiadoras#1',
        aMedias: [
          { sigue: 'correo:c-fotocopiadoras#archivado', nota: 'Archivado sin avisar. Si no avisas, el contrato se renueva solo el 1 de diciembre.' },
          { sigue: 'correo:c-fotocopiadoras', nota: 'Has respondido sin el preaviso. Si no avisas, se renueva solo el 1 de diciembre.' },
        ],
        ir: 'correo:c-fotocopiadoras',
        accion: 'Leer la oferta',
        alTerminar: 'Preaviso enviado',
        accionHecha: 'Ver el correo',
      },
      {
        // 6 de 8 listas: 6 piezas listas, el escrito de remisión por revisar y el acta de 2.º ESO A, que falta.
        etiqueta: 'Dosier para inspección',
        icono: 'carpeta',
        progreso: 'dosier',
        nota: 'Falta el acta de 2.º ESO A y revisar el escrito de remisión.',
        ir: 'dosier',
        accion: 'Revisar el dosier',
        accionCorta: 'Revisar',
        alTerminar: 'Visto bueno dado',
        accionHecha: 'Ver el dosier',
      },
    ],

    // Quién cubre a Sergio Prieto en cada sesión de 3.º B. La persona sale de lo que confirma jefatura
    // (si jefatura elige a otra en el desplegable, sale esa).
    dia: {
      titulo: 'Quién cubre 3.º B hoy',
      carriles: [
        {
          titulo: '3.º B',
          detalle: 'Sergio Prieto no viene',
          icono: 'persona',
          cuenta: 'confirmadas',
          pendiente: 'Las guardias las confirma jefatura. Hasta entonces, no se avisa a nadie.',
          // Si jefatura confirma una a una: lo confirmado ya se ha avisado; lo demás, no ({n} de {de}, como el recuento).
          parcial: 'Jefatura ha confirmado {n} de {de}. Hasta que confirme las demás, no se avisa a quien las cubre.',
          alTerminar: 'Jefatura ha confirmado quién cubre a Sergio Prieto. Quien entra en 3.º B ya tiene su ficha.',
          sesiones: [
            { franja: '1', titulo: 'Lengua', tipo: 'cubre', sigue: 'jefatura/guardias#g1', nota: 'Tiene guardia a esa hora. Lleva 2 guardias este mes; la media es 3.' },
            { franja: '2', titulo: 'Inglés', detalle: 'Con su especialista', tipo: 'igual' },
            { franja: '3', titulo: 'Ciencias de la Naturaleza', tipo: 'cubre', sigue: 'jefatura/guardias#g2', nota: 'Tiene guardia a esa hora.' },
            { franja: 'recreo', titulo: 'Patio de Primaria', tipo: 'cubre', sigue: 'jefatura/guardias#g3', nota: 'Hace el turno de patio de Sergio.' },
            { franja: '4', titulo: 'Educación Física', detalle: 'Con su especialista', tipo: 'igual' },
            { franja: '5', titulo: 'Música', detalle: 'Con su especialista', tipo: 'igual' },
            { franja: '6', titulo: 'Matemáticas', tipo: 'cubre', sigue: 'jefatura/guardias#g4', nota: 'Así 3.º B acaba el día con la misma persona que lo empezó.' },
            { franja: 'salida', titulo: 'Salida de 3.º B', tipo: 'cubre', sigue: 'jefatura/guardias#g4', nota: 'Acompaña al grupo a la puerta de Primaria a las 16:00. Va con la 6.ª hora.' },
          ],
        },
      ],
    },

    // Lo que te necesita: empieza por lo que las cifras no dicen. Lo que tiene fecha va en la agenda.
    lista: {
      titulo: 'Lo que te necesita',
      items: [
        { grupo: 'Hoy', icono: 'correo', titulo: 'Inspección: confírmale la visita del jueves 26', detalle: 'A las 10:00, contigo y con el jefe de estudios.', estado: 'pendiente', ir: 'correo:c-inspeccion', sigue: 'correo:c-inspeccion' },
        { grupo: 'Hoy', icono: 'firma', titulo: 'Caso 2026-07: citación a la familia', detalle: 'Revísala con las cuatro comprobaciones y fírmala.', estado: 'hoy', ir: 'firma', sigue: 'firma', verbo: 'Firmada' },
        { grupo: 'Esta semana', icono: 'acta', titulo: 'Acta del claustro del lunes 16', detalle: 'El borrador de tu dictado espera tu visto bueno.', estado: 'pendiente', ir: 'acta', sigue: 'acta', verbo: 'Visto bueno dado' },
        { grupo: 'Esta semana', icono: 'correo', titulo: 'AMPA: fecha del festival de Navidad', detalle: 'Proponen el viernes 11 de diciembre, que coincide con las sesiones de evaluación.', estado: 'pendiente', choque: true, ir: 'correo:c-ampa', sigue: 'correo:c-ampa' },
        {
          grupo: 'Para saber', icono: 'documento', titulo: 'Certificado de matrícula de Nora D. (1.º ESO A)',
          detalle: 'Lo firma secretaría con tu visto bueno. Te llega cuando Carmen López lo pase a la firma.', estado: 'info',
          // Cuando secretaría lo pasa a la firma, sigue siendo para saber: en dirección no hay dónde darle el visto bueno.
          sigue: 'secretaria/certificados', si: { detalle: 'Carmen López lo ha pasado a la firma y te lo lleva para tu visto bueno.', estado: 'info' },
        },
      ],
    },

    // Lo que viene: plazos (lo que haces tú) y citas o salidas, en las próximas tres semanas.
    // fuente: 'correo' para lo que la IA ha sacado de un correo (lleva la insignia).
    agenda: {
      titulo: 'Lo que viene',
      desde: '2026-11-16',
      semanas: 3,
      marcas: [
        // Cada plazo pasa a ✓ solo con lo que lo cumple: el preaviso (#1) o la circular a las familias (#0). Lo que va hacia
        // ello lo dice «aMedias», sin el ✓ (vale la primera variante que está hecha).
        {
          fecha: '2026-11-21', tipo: 'plazo', titulo: 'Fotocopiadoras: avisar antes de este día', detalle: 'Si no avisas, el contrato se renueva solo el 1 de diciembre.',
          ir: 'correo:c-fotocopiadoras', sigue: 'correo:c-fotocopiadoras#1', verbo: 'Preaviso enviado',
          // El mismo texto que la nota de la cifra.
          aMedias: { sigue: 'correo:c-fotocopiadoras', detalle: 'Has respondido sin el preaviso. Si no avisas, se renueva solo el 1 de diciembre.' },
        },
        // El dosier: enviado con la respuesta que lo adjunta (#1) y con tu visto bueno. Ni así pasa a ✓: esa respuesta lo
        // envía sin el acta de 2.º ESO A («que le enviaré antes del lunes 23»), así que el plazo sigue abierto para el acta.
        {
          fecha: '2026-11-23', tipo: 'plazo', titulo: 'Dosier para inspección', detalle: 'Envíalo antes de este día. Falta el acta de 2.º ESO A.', fuente: 'correo',
          ir: 'dosier', sigue: ['dosier', 'correo:c-inspeccion#1'],
          si: { detalle: 'Enviado sin el acta de 2.º ESO A. Esa acta, antes de este día.', estado: 'pendiente' },
          aMedias: [
            // Enviado sin dar antes el visto bueno al dosier.
            { sigue: 'correo:c-inspeccion#1', detalle: 'Enviado sin el acta de 2.º ESO A y sin tu visto bueno al dosier. Esa acta, antes de este día.', ir: 'dosier' },
            // Respondido con otra respuesta (confirmar la visita, preguntar por los horarios): el dosier no ha salido.
            { sigue: 'correo:c-inspeccion', detalle: 'Has confirmado la visita sin el dosier. Envíaselo antes de este día.' },
            // Con el visto bueno y el correo sin responder.
            { sigue: 'dosier', detalle: 'Visto bueno dado. Falta enviarlo a Inspección desde el correo.', ir: 'correo:c-inspeccion' },
          ],
        },
        { fecha: '2026-11-26', hora: '10:00', tipo: 'evento', titulo: 'Visita de inspección', detalle: 'Te reúnes con la inspectora y con el jefe de estudios.', fuente: 'correo', ir: 'correo:c-inspeccion' },
        // Las tres respuestas propuestas dejan el fondo para después: contestar no cumple el plazo, que sigue pendiente.
        {
          fecha: '2026-11-27', tipo: 'plazo', titulo: 'Reclamación del comedor', detalle: 'Familia de 5.º A: respóndeles antes de este día. DirectorIA te lo recuerda el miércoles 25.', fuente: 'correo',
          ir: 'correo:c-comedor', sigue: 'correo:c-comedor', si: { detalle: 'Ya les has contestado. La respuesta por escrito, antes de este día.', estado: 'pendiente' },
        },
        { fecha: '2026-11-27', hora: '9:15', tipo: 'evento', titulo: 'Salida de 4.º al Jardín Botánico', detalle: 'Vuelven a las 13:30.' },
        {
          fecha: '2026-11-30', tipo: 'evento', titulo: 'Corte de la calle de la entrada', detalle: 'De 7:00 a 19:00. El aviso a las familias está listo para revisar.', fuente: 'correo',
          ir: 'correo:c-ayuntamiento', sigue: 'correo:c-ayuntamiento#0', si: { detalle: 'De 7:00 a 19:00.' },
          // Si respondes al Ayuntamiento (pedir paso seguro), la circular a las familias, que era la otra respuesta, ya no está.
          aMedias: { sigue: 'correo:c-ayuntamiento', detalle: 'De 7:00 a 19:00. Has escrito al Ayuntamiento; falta avisar a las familias.' },
        },
        { fecha: '2026-11-30', tipo: 'evento', titulo: 'Empiezan los exámenes de ESO', detalle: '1.ª evaluación, hasta el viernes 4 de diciembre.' },
      ],
    },
  },

  // ─── Correo ───────────────────────────────────────────────────────
  correo: [
    {
      id: 'c-inspeccion',
      de: 'Inspección educativa',
      deDetalle: 'DAT Madrid-Capital',
      asunto: 'Visita al centro el jueves 26 de noviembre y documentación',
      hora: '7:12',
      categoria: 'Inspección',
      etiqueta: { texto: 'Documentos antes del lun 23', tipo: 'plazo' },
      resumen: [
        'Visita de supervisión el jueves 26 a las 10:00. Al empezar, la inspectora quiere reunirse contigo y con el jefe de estudios.',
        'Antes del lunes 23 pide: plan de convivencia, horarios de 2.º ESO, programaciones de Matemáticas y actas de la evaluación inicial de ESO.',
      ],
      piden: 'Confirmar la visita y enviar los cuatro documentos antes del lunes 23.',
      original: 'Estimada directora:\n\nLe comunico que el jueves 26 de noviembre, a las 10:00, visitaré el Colegio Ejemplo dentro de las visitas de supervisión previstas para este trimestre. Al comienzo de la visita me gustaría reunirme con usted y con el jefe de estudios.\n\nPara prepararla, le ruego que me remita antes del lunes 23 de noviembre la siguiente documentación:\n\n- Plan de convivencia del curso 2026-27.\n- Horarios de los grupos de 2.º de ESO.\n- Programaciones didácticas de Matemáticas de ESO.\n- Actas de las sesiones de evaluación inicial de ESO.\n\nLe agradeceré que me confirme la recepción de este correo y la cita.\n\nUn saludo cordial,\n\nLa inspectora de referencia del centro\nServicio de Inspección Educativa\nDirección de Área Territorial Madrid-Capital',
      adjuntos: ['Solicitud de documentación.pdf'],
      respuestas: [
        {
          titulo: 'Confirmar la visita',
          texto: 'Estimada inspectora:\n\nLe confirmo que hemos recibido su correo y que la esperamos el jueves 26 de noviembre a las 10:00. La recibiremos el jefe de estudios, Javier Martín, y yo en el despacho de dirección.\n\nLe enviaré la documentación que nos pide antes del lunes 23.\n\nUn saludo cordial,\nElena Ruiz\nDirectora del Colegio Ejemplo',
        },
        {
          titulo: 'Confirmar y enviar ya el dosier',
          adjuntos: ['Dosier para la visita de inspección.pdf'],
          texto: 'Estimada inspectora:\n\nLe confirmo la visita del jueves 26 de noviembre a las 10:00. La recibiremos el jefe de estudios y yo.\n\nLe adjunto la documentación que nos pide: el plan de convivencia 2026-27, los horarios de 2.º ESO, las programaciones de Matemáticas de ESO y las actas de la evaluación inicial de ESO, salvo la de 2.º ESO A, que le enviaré antes del lunes 23.\n\nUn saludo cordial,\nElena Ruiz\nDirectora del Colegio Ejemplo',
        },
        {
          titulo: 'Confirmar y preguntar por los horarios',
          texto: 'Estimada inspectora:\n\nLe confirmo la visita del jueves 26 de noviembre a las 10:00. Antes de enviarle la documentación, ¿me puede indicar si necesita solo los horarios de grupo de 2.º ESO o también los del profesorado que da clase en esos grupos?\n\nSe lo enviaré todo antes del lunes 23. Si quiere visitar alguna clase ese día, dígamelo y lo organizamos con jefatura.\n\nUn saludo cordial,\nElena Ruiz\nDirectora del Colegio Ejemplo',
        },
      ],
      nota: 'DirectorIA ha reunido el dosier con lo que hay en el servidor. Falta una pieza: el acta de la evaluación inicial de 2.º ESO A.',
      ir: 'dosier',
    },
    {
      id: 'c-comedor',
      de: 'Familia de Carla S.',
      deDetalle: '5.º A de Primaria',
      asunto: 'Reclamación por el nuevo horario del comedor',
      hora: 'ayer',
      categoria: 'Familias',
      etiqueta: { texto: 'Responder antes del vie 27', tipo: 'plazo' },
      resumen: [
        'La familia de Carla S. reclama: desde el lunes 9, 5.º y 6.º comen en el segundo turno (13:40-14:20) y no a las 12:40.',
        'Dicen que su hija pasa una hora sin comer y come con prisa, y que nadie avisó a las familias del cambio.',
        'Plazo para responder: viernes 27 de noviembre (10 días naturales, según el reglamento de régimen interior).',
      ],
      piden: 'Volver al horario anterior o que se les explique el motivo, por escrito, y que se avise a las familias antes de cambios así.',
      original: 'Estimada directora:\n\nLe escribimos para presentar una reclamación por el cambio de horario del comedor. Desde el lunes 9 de noviembre, 5.º y 6.º comen en el segundo turno, de 13:40 a 14:20, cuando hasta ahora comían a las 12:40.\n\nNuestra hija pasa más de una hora en el patio sin comer y luego tiene que hacerlo con prisa: varios días nos ha dicho que no le ha dado tiempo a terminar. Además, nadie avisó a las familias. Nos enteramos por ella.\n\nPedimos que se vuelva al horario anterior o, si no es posible, que se nos explique el motivo. También pedimos que en adelante se informe a las familias antes de hacer cambios así.\n\nQuedamos a la espera de su respuesta por escrito.\n\nAtentamente,\nAna y Óscar\nPadres de Carla S. (5.º A)',
      respuestas: [
        {
          titulo: 'Acusar recibo y dar el plazo',
          texto: 'Estimados Ana y Óscar:\n\nHemos recibido su reclamación sobre el nuevo horario del comedor de 5.º y 6.º. La estamos estudiando con la coordinación del comedor y les responderemos por escrito antes del viernes 27 de noviembre.\n\nGracias por contárnoslo con tanto detalle: nos ayuda a revisarlo bien.\n\nAtentamente,\nElena Ruiz\nDirectora del Colegio Ejemplo',
        },
        {
          titulo: 'Proponer una reunión',
          texto: 'Estimados Ana y Óscar:\n\nGracias por escribirnos. Antes de responderles por escrito, me gustaría escucharles en persona. ¿Les viene bien el jueves 19 o el lunes 23 de noviembre, a las 16:15, en mi despacho? Si ninguno de los dos días les encaja, díganme cuál les va mejor.\n\nEn cualquier caso, tendrán nuestra respuesta por escrito antes del viernes 27.\n\nAtentamente,\nElena Ruiz\nDirectora del Colegio Ejemplo',
        },
        {
          titulo: 'Pedir detalles para comprobarlo',
          texto: 'Estimados Ana y Óscar:\n\nGracias por escribirnos. Para estudiar bien su reclamación, ¿podrían indicarnos qué días se queda Carla al comedor y en cuáles no le ha dado tiempo a terminar? Lo comprobaremos con las monitoras del segundo turno.\n\nLes responderemos por escrito antes del viernes 27 de noviembre.\n\nAtentamente,\nElena Ruiz\nDirectora del Colegio Ejemplo',
        },
      ],
      nota: 'DirectorIA ha apuntado el plazo de respuesta y te avisa el miércoles 25. Las respuestas propuestas no entran en el fondo: eso lo decides tú.',
    },
    {
      id: 'c-fotocopiadoras',
      de: 'Empresa de fotocopiadoras',
      deDetalle: 'Gestor comercial de la cuenta del colegio',
      asunto: 'Renovación de su contrato de equipos multifunción',
      hora: 'lun 16',
      categoria: 'Proveedores',
      etiqueta: { texto: 'Preaviso antes del sáb 21', tipo: 'plazo' },
      resumen: [
        'Proponen renovar ya por 36 meses: equipos nuevos, la misma cuota mensual y un 10 % menos en el precio de la copia en color.',
        'Si no se dice nada, el contrato se renueva solo el 1 de diciembre por 12 meses, en las condiciones actuales.',
      ],
      piden: 'Aceptar la renovación por 36 meses y fijar un día para firmarla.',
      original: 'Buenos días, Elena:\n\nLe escribo porque el contrato de alquiler de sus equipos multifunción termina el 30 de noviembre. Si no nos indica lo contrario, se renovará el 1 de diciembre por otros 12 meses en las mismas condiciones.\n\nQueremos proponerle algo mejor. Si renueva ahora por 36 meses, le cambiamos todos los equipos por modelos nuevos, más rápidos y con impresión segura con tarjeta, y le mantenemos la cuota mensual actual. Además, el precio por copia en color bajaría un 10 %.\n\nSi le parece bien, le preparo el contrato y paso por el colegio el día que mejor le venga para firmarlo.\n\nUn saludo,\nRaúl Ortega\nGestor comercial',
      respuestas: [
        {
          titulo: 'Pedir la oferta por escrito',
          texto: 'Buenos días, Raúl:\n\nGracias por la propuesta. Antes de decidir, le pido que me envíe por escrito la oferta completa: cuota mensual, precio por copia en blanco y negro y en color, copias incluidas, permanencia y condiciones si dejamos el contrato antes de los 36 meses.\n\nLa necesito antes del jueves 19 para poder compararla con calma.\n\nUn saludo,\nElena Ruiz\nDirectora del Colegio Ejemplo',
        },
        {
          titulo: 'Comunicar el preaviso',
          texto: 'Buenos días, Raúl:\n\nGracias por la propuesta. Dentro del plazo de preaviso del contrato, le comunico que no queremos que se renueve el 1 de diciembre en las condiciones actuales.\n\nEstamos dispuestos a estudiar una nueva oferta y a compararla con otras antes de decidir. Para no quedarnos sin servicio mientras tanto, le pido también una prórroga de dos meses en las condiciones de ahora. Le enviaremos esta comunicación por escrito y firmada.\n\nUn saludo,\nElena Ruiz\nDirectora del Colegio Ejemplo',
        },
        {
          titulo: 'Proponer una reunión el jueves',
          texto: 'Buenos días, Raúl:\n\nGracias por escribir. Prefiero que lo veamos en persona antes de decidir. ¿Le viene bien el jueves 19 a las 12:30 en el colegio? Estará también Carmen López, de secretaría, que lleva los contratos.\n\nTraiga, por favor, la oferta por escrito, con el precio por copia y la permanencia.\n\nUn saludo,\nElena Ruiz\nDirectora del Colegio Ejemplo',
        },
      ],
      nota: 'Aviso del analista de gastos: para negociar o cambiar de empresa hay que avisar antes del 21 de noviembre. La oferta no lo menciona.',
    },
    {
      id: 'c-ampa',
      de: 'AMPA del colegio',
      deDetalle: 'Presidenta de la junta directiva',
      asunto: 'Festival de Navidad: os proponemos fecha',
      hora: '7:31',
      categoria: 'Familias',
      etiqueta: { texto: 'Responder esta semana', tipo: 'plazo' },
      resumen: [
        'El AMPA propone el festival de Navidad el viernes 11 de diciembre a las 16:30, en el salón de actos.',
        'Ellos ponen el sonido y la chocolatada; cada curso de Primaria prepararía una actuación con su tutor o tutora.',
        'Quieren mandar la circular a las familias la semana que viene.',
      ],
      piden: 'Confirmar la fecha y el uso del salón de actos.',
      original: 'Hola, Elena:\n\nDesde el AMPA ya estamos con el festival de Navidad. Como el año pasado, nos encargamos de la chocolatada y del equipo de sonido, y la idea es que cada curso de Primaria prepare una actuación con su tutor o tutora.\n\nOs proponemos el viernes 11 de diciembre a las 16:30, en el salón de actos, con la chocolatada después en el patio cubierto. Así no coincide con la última semana antes de las vacaciones, que siempre va muy cargada.\n\n¿Nos confirmáis la fecha y que podemos usar el salón de actos? Si os viene bien, mandamos la circular a las familias la semana que viene.\n\nUn abrazo,\nIsabel Navarro\nPresidenta del AMPA',
      respuestas: [
        {
          titulo: 'Proponer el martes 15 de diciembre',
          texto: 'Hola, Isabel:\n\nGracias por poneros ya con el festival. El viernes 11 no nos va bien: del 9 al 11 de diciembre son las sesiones de evaluación y los tutores las tienen por la tarde.\n\n¿Os parece el martes 15 de diciembre a las 16:30? Si os encaja, os reservamos el salón de actos y el patio cubierto.\n\nUn abrazo,\nElena Ruiz\nDirectora del Colegio Ejemplo',
        },
        {
          titulo: 'Pedirles otra tarde',
          texto: 'Hola, Isabel:\n\nGracias por pensar ya en el festival. El viernes 11 coincide con las sesiones de evaluación, que son del 9 al 11 de diciembre, y los tutores no podrían estar con sus cursos.\n\n¿Nos proponéis otra tarde a partir del lunes 14? En cuanto la tengamos, os reservamos el salón de actos y el patio cubierto para que podáis mandar la circular.\n\nUn abrazo,\nElena Ruiz\nDirectora del Colegio Ejemplo',
        },
        {
          titulo: 'Quedar para organizarlo',
          texto: 'Hola, Isabel:\n\nGracias por la propuesta. El viernes 11 coincide con las sesiones de evaluación, así que tenemos que mover la fecha. ¿Quedamos el jueves 26 a las 16:15 en dirección para cerrarla y ver cómo organizamos las actuaciones?\n\nLlevaré dos o tres tardes posibles a partir del lunes 14 de diciembre.\n\nUn abrazo,\nElena Ruiz\nDirectora del Colegio Ejemplo',
        },
      ],
      nota: 'Coincide con las sesiones de la 1.ª evaluación (del 9 al 11 de diciembre), según el acta del claustro del lunes 16.',
      ir: 'acta',
    },
    {
      id: 'c-ayuntamiento',
      de: 'Ayuntamiento',
      deDetalle: 'Servicio de Obras en la Vía Pública',
      asunto: 'Corte de tráfico por obras el lunes 30 de noviembre',
      hora: 'ayer',
      categoria: 'Otros',
      etiqueta: { texto: 'Obras el lun 30', tipo: 'info' },
      resumen: [
        'El lunes 30 de noviembre, de 7:00 a 19:00, cortan al tráfico la calle frente a la entrada principal por obras en la red de agua.',
        'No se podrá parar en coche delante del colegio. A pie se llegará a la puerta principal por un paso señalizado.',
      ],
      piden: 'Que se avise del corte a las familias y al personal del centro.',
      original: 'Estimada directora:\n\nLe informamos de que el lunes 30 de noviembre, de 7:00 a 19:00, quedará cortado al tráfico el tramo de calle situado frente a la entrada principal del colegio, por obras de renovación de la red de abastecimiento de agua.\n\nDurante el corte no podrán detenerse vehículos delante del centro, tampoco para dejar o recoger al alumnado. El acceso a pie a la entrada principal se mantendrá por un paso señalizado. Si la obra se aplaza por motivos meteorológicos, se lo comunicaremos con antelación.\n\nLe rogamos que traslade esta información a las familias y al personal del centro. Se adjunta el plano del corte.\n\nAtentamente,\nServicio de Obras en la Vía Pública\nAyuntamiento',
      adjuntos: ['Plano del corte de tráfico.pdf'],
      respuestas: [
        {
          titulo: 'Circular para avisar a las familias',
          para: 'Todas las familias del colegio',
          asunto: 'Lunes 30: corte de la calle de la entrada por obras',
          texto: 'Estimadas familias:\n\nEl Ayuntamiento nos informa de que el lunes 30 de noviembre, de 7:00 a 19:00, la calle de la entrada principal estará cortada al tráfico por obras. Ese día no se podrá parar en coche delante del colegio, tampoco un momento para dejar a sus hijos.\n\nSe podrá llegar a pie a la puerta principal por un paso señalizado, y las entradas y salidas serán a la hora de siempre. Les recomendamos salir con tiempo, sobre todo a las familias de ESO: ese día empiezan los exámenes de la 1.ª evaluación.\n\nGracias por su colaboración.\n\nUn saludo cordial,\nElena Ruiz\nDirectora del Colegio Ejemplo',
        },
        {
          titulo: 'Pedir paso seguro en las entradas',
          texto: 'Buenos días:\n\nGracias por el aviso. Ese lunes el alumnado entra a las 8:15 y a las 9:00 y sale a las 14:45 y a las 16:00. Les pido que en esas franjas el paso peatonal hasta la entrada principal esté despejado y, si es posible, que haya un agente de Policía Municipal.\n\n¿Podrían confirmarnos la fecha unos días antes, para avisar a las familias con seguridad?\n\nAtentamente,\nElena Ruiz\nDirectora del Colegio Ejemplo',
        },
      ],
      nota: 'No hace falta contestar al Ayuntamiento. La primera propuesta es una circular para las familias: ese día empiezan los exámenes de ESO.',
    },
  ],

  // ─── Módulos ──────────────────────────────────────────────────────
  modulos: [
    {
      id: 'dosier',
      ia: false,
      tipo: 'documento',
      menu: 'Dosier para inspección',
      antetitulo: 'Inspección educativa · visita del jueves 26',
      titulo: 'Dosier para la visita de inspección',
      entradilla: 'DirectorIA ha reunido lo que pide la inspección con lo que hay en el servidor del colegio. Revisa cada pieza, decide qué haces con la que falta y dale tu visto bueno antes de enviarlo.',
      origen: 'Reunido por DirectorIA a partir del correo de Inspección y del archivo del servidor del colegio',
      documento: {
        titulo: 'Documentación para la visita de Inspección educativa',
        subtitulo: 'Jueves 26 de noviembre de 2026 · 10:00 · Enviar antes del lunes 23',
        bloques: [
          { tipo: 'campo', etiqueta: 'Para', texto: 'Servicio de Inspección Educativa · Dirección de Área Territorial Madrid-Capital' },
          { tipo: 'campo', etiqueta: 'Asunto', texto: 'Documentación para la visita del jueves 26 de noviembre, 10:00' },
          { tipo: 'campo', etiqueta: 'Plazo', texto: 'Antes del lunes 23 de noviembre' },
          { tipo: 'titulo', texto: 'Escrito de remisión' },
          { tipo: 'parrafo', texto: 'Estimada inspectora:\n\nLe remito la documentación que nos pidió para la visita al Colegio Ejemplo del jueves 26 de noviembre a las 10:00. Va ordenada como en su solicitud, con un índice al principio.\n\nEl jefe de estudios, Javier Martín, y yo la recibiremos en el despacho de dirección. Quedo a su disposición para cualquier aclaración.\n\nUn saludo cordial,\nElena Ruiz\nDirectora del Colegio Ejemplo' },
          { tipo: 'titulo', texto: 'Índice del dosier' },
          {
            tipo: 'lista',
            items: [
              'Plan de convivencia 2026-27, aprobado el 30 de septiembre',
              'Horarios de grupo de 2.º ESO A y 2.º ESO B',
              'Programaciones didácticas de Matemáticas de 1.º, 2.º y 3.º de ESO, y de Matemáticas A y B de 4.º',
              'Actas de las sesiones de evaluación inicial de los ocho grupos de ESO',
            ],
          },
          { tipo: 'aviso', texto: 'Falta el acta de la evaluación inicial de 2.º ESO A: no está en el archivo de actas del servidor. Puedes pedírsela a jefatura antes del lunes 23 o enviar el dosier sin ella y explicarlo en el escrito.' },
        ],
      },
      rellenado: [
        'Lista de piezas, del correo de Inspección de hoy a las 7:12',
        'Plan de convivencia, horarios y programaciones, de las carpetas del servidor del colegio',
        'Siete de las ocho actas de evaluación inicial, del archivo de actas',
        'Escrito de remisión, con los datos de la visita',
      ],
      comprobaciones: [
        'Cada pieza es la versión vigente y está firmada',
        'El acta de 2.º ESO A: pedírsela a jefatura o explicarlo en el escrito',
        'Las actas llevan datos de alumnos: solo van a Inspección',
      ],
      boton: 'Dar el visto bueno al dosier',
      alTerminar: 'Visto bueno dado. Adjunta el dosier a tu respuesta a Inspección desde el correo. Si jefatura sube el acta de 2.º ESO A, DirectorIA te avisa.',
      documentos: [
        { nombre: 'Plan de convivencia 2026-27', estado: 'ok', detalle: 'Aprobado el 30 de septiembre. Es la versión vigente.' },
        { nombre: 'Horarios de grupo de 2.º ESO A y 2.º ESO B', estado: 'ok', detalle: 'Versión vigente, del archivo de jefatura de estudios' },
        { nombre: 'Programaciones de Matemáticas de ESO', estado: 'ok', detalle: '1.º, 2.º y 3.º, y Matemáticas A y B de 4.º: cinco documentos' },
        { nombre: 'Actas de la evaluación inicial de 1.º ESO A y B', estado: 'ok' },
        { nombre: 'Acta de la evaluación inicial de 2.º ESO A', estado: 'falta', detalle: 'No está en el archivo de actas. Decide si se la pides a jefatura.' },
        { nombre: 'Acta de la evaluación inicial de 2.º ESO B', estado: 'ok' },
        { nombre: 'Actas de la evaluación inicial de 3.º y 4.º ESO', estado: 'ok', detalle: 'Cuatro actas, de los grupos A y B' },
        { nombre: 'Escrito de remisión a Inspección', estado: 'revisar', detalle: 'Borrador preparado por DirectorIA con los datos de la visita. Lo revisas y lo firmas tú.' },
      ],
    },
    {
      id: 'acta',
      tipo: 'documento',
      menu: 'Actas',
      antetitulo: 'Del dictado al acta',
      titulo: 'Acta del claustro del lunes 16',
      entradilla: 'DirectorIA ha convertido tu dictado en el borrador del acta. Comprueba que los acuerdos son los que se votaron y dale tu visto bueno para guardarlo en el archivo de actas.',
      origen: 'Preparado con IA a partir de tu dictado de 12 minutos y del registro de firmas',
      documento: {
        titulo: 'Acta del claustro ordinario',
        subtitulo: 'Lunes 16 de noviembre de 2026 · 17:00 · Sala de profesores',
        bloques: [
          { tipo: 'campo', etiqueta: 'Asistentes', texto: '47 de 52 docentes. Se adjunta la hoja de firmas.' },
          { tipo: 'campo', etiqueta: 'Preside', texto: 'Elena Ruiz, directora' },
          { tipo: 'titulo', texto: 'Orden del día' },
          {
            tipo: 'lista',
            items: [
              'Calendario de las sesiones de la 1.ª evaluación',
              'Salida de 4.º de Primaria al Jardín Botánico',
              'Plan de lectura en Primaria',
              'Ruegos y preguntas',
            ],
          },
          { tipo: 'titulo', texto: 'Acuerdos' },
          { tipo: 'parrafo', texto: 'Primero. Se acuerda celebrar las sesiones de la 1.ª evaluación del 9 al 11 de diciembre. Jefatura de estudios publicará el calendario por grupos. Aprobado por unanimidad.' },
          { tipo: 'parrafo', texto: 'Segundo. Se acuerda que 4.º de Primaria vaya al Jardín Botánico el viernes 27 de noviembre, de 9:15 a 13:30. Cuesta 6 € por alumno, con la entrada y el autobús, y las autorizaciones firmadas se entregan antes del viernes 20. Aprobado por unanimidad.' },
          { tipo: 'parrafo', texto: 'Tercero. Se acuerda que, a partir de enero, en Primaria se dediquen 20 minutos diarios a la lectura. Aprobado por mayoría: 39 votos a favor, 3 en contra y 5 abstenciones.' },
          { tipo: 'titulo', texto: 'Ruegos y preguntas' },
          { tipo: 'parrafo', texto: 'Una maestra de Primaria pide revisar la salida de las 16:00 por la puerta lateral, donde se juntan muchas familias. La dirección lo estudiará con jefatura de estudios.' },
          { tipo: 'aviso', texto: 'En tu dictado, al hablar de la salida de las 16:00, nombrabas a un alumno. DirectorIA lo ha quitado del borrador: en el acta no van datos de alumnos. Comprueba que se entiende sin él.' },
          { tipo: 'parrafo', texto: 'Sin más asuntos que tratar, se levanta la sesión a las 18:20.' },
        ],
      },
      rellenado: [
        'Asistencia, del registro de firmas del claustro',
        'Orden del día, de la convocatoria',
        'Acuerdos y votaciones, de tu dictado de 12 minutos',
      ],
      comprobaciones: [
        'Los acuerdos recogen lo que se votó, con su recuento',
        'No hay datos de alumnos',
        'Cada punto del orden del día tiene su acuerdo o su resumen',
      ],
      boton: 'Dar el visto bueno al acta',
      alTerminar: 'Visto bueno dado. El acta queda en el archivo de actas, con buscador, y se leerá para su aprobación en el próximo claustro.',
    },
    {
      id: 'firma',
      ia: false,
      tipo: 'documento',
      menu: 'Pendiente de firma',
      antetitulo: 'Caso 2026-07 · Protocolo contra el acoso escolar',
      titulo: 'Citación a la familia de Alumno/a A',
      entradilla: 'DirectorIA ha preparado la citación con la plantilla del protocolo y los datos del plan del caso. Revísala con las cuatro comprobaciones y fírmala: nada se envía sin tu firma.',
      confidencial: 'Confidencial · solo equipo del caso',
      origen: 'Preparado por DirectorIA con la plantilla del protocolo y el plan del caso. No pasa por la IA.',
      documento: {
        titulo: 'Citación a la familia de Alumno/a A',
        subtitulo: 'Caso 2026-07 · 2.º ESO B · Borrador para revisar y firmar',
        bloques: [
          { tipo: 'campo', etiqueta: 'Para', texto: 'Familia de Alumno/a A, 2.º ESO B' },
          { tipo: 'campo', etiqueta: 'Cita', texto: 'Viernes 20 de noviembre, 17:00, despacho de orientación' },
          { tipo: 'campo', etiqueta: 'Quién les atiende', texto: 'Los dos docentes designados por la dirección el martes 17' },
          { tipo: 'campo', etiqueta: 'Paso del protocolo', texto: 'Paso 4 de 9 · Recogida de información (Anexo II), del martes 17 al lunes 23' },
          { tipo: 'titulo', texto: 'Texto de la citación' },
          { tipo: 'parrafo', texto: 'Estimada familia:\n\nNos gustaría hablar con ustedes sobre cómo se encuentra su hijo/a en el centro. Les esperamos el viernes 20 de noviembre a las 17:00 en el despacho de orientación.\n\nLes atenderán dos docentes del colegio, con total discreción. Si esa hora no les viene bien, díganselo a la tutora y buscaremos otra lo antes posible.\n\nAtentamente,\nElena Ruiz\nDirectora del Colegio Ejemplo' },
          { tipo: 'aviso', texto: 'Solo lo ve el equipo del caso. Queda registro de quién abre, edita y firma este documento.' },
        ],
      },
      rellenado: [
        'Nombres, curso y contacto, desde el servidor del colegio',
        'Fecha, hora y sala, tomadas del plan del caso',
        'Quién atiende: los dos docentes designados el mar 17 nov',
        'Versión en otro idioma o en lectura fácil, de la plantilla, si hace falta',
      ],
      comprobaciones: [
        'Ningún dato de otros alumnos ni detalles del caso',
        'Tono neutro: no da nada por probado',
        'Fecha y hora acordadas antes con la familia',
        'Idioma de la familia y canal de entrega',
      ],
      boton: 'Firmar la citación',
      alTerminar: 'Citación firmada. Se guarda en el Caso 2026-07, en el servidor del colegio, con registro de tu firma. Ya se puede entregar a la familia.',
    },
  ],
});
