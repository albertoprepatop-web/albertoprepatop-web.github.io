DEMO.rol({
  id: 'secretaria',
  orden: 3,
  persona: {
    nombre: 'Carmen López',
    cargo: 'Secretaria',
    detalle: 'Secretaría y administración',
    ilustracion: 'secretaria',
  },
  acceso: 'Analista de gastos, justificantes del profesorado, plazos y correo resumido',

  // ─── Inicio: panel de mando (guion-de-datos.md §6.2 bis), solo con datos ───
  // Sin el día por sesiones: el trabajo de secretaría no va por el horario de Primaria.
  // Secretaría no guarda datos de alumnos: lleva gastos y contratos, plazos, el edificio y los justificantes del profesorado.
  inicio: {
    antetitulo: 'Miércoles 18 de noviembre · 8:00',
    titulo: 'Buenos días, Carmen',
    entradilla: 'Gastos, justificantes, plazos y revisiones del edificio. Nada se envía ni se firma sin ti.',

    // Lo que importa a las 8:00, de lo más urgente a lo menos. Cada cifra lleva a donde se actúa y tiene un solo sentido.
    cifras: [
      {
        // Un valor con su rótulo: los cinco avisos del analista (E6). Hoy: dirección decide las fotocopiadoras antes del
        // sábado 21. Está hecho cuando envías el informe.
        etiqueta: 'Informe de gastos',
        icono: 'carpeta',
        valor: '5',
        rotulo: 'avisos para dirección',
        hoy: true,
        nota: 'El más urgente: las fotocopiadoras, que dirección decide antes del sábado 21.',
        sigue: 'gastos',
        ir: 'gastos',
        accion: 'Revisar y enviar',
        alTerminar: 'Enviado',
        accionHecha: 'Ver el informe',
      },
      {
        etiqueta: 'Correos por responder',
        icono: 'correo',
        cuenta: 'correo',
        accion: 'Abrir el correo',
        alTerminar: 'Al día',
      },
      {
        // Progreso «X de Y»: los justificantes del curso que ya están en su carpeta (E8). Cuando Laura Sánchez sube el suyo
        // en su perfil, sube a 6 de 7. El de hoy de Sergio Prieto sigue pendiente: la cifra no se da por hecha.
        etiqueta: 'Justificantes del profesorado',
        icono: 'carpeta',
        progreso: 'justificantes',
        rotulo: 'entregados',
        nota: 'Los justificantes los archiva un programa en su carpeta; la IA no los lee.',
        ir: 'justificantes',
        accion: 'Ver las carpetas',
        alTerminar: 'Todos entregados',
        accionHecha: 'Ver las carpetas',
      },
      {
        // La estadística de inicio de curso (E7): recuentos por curso y grupo, sin nombres. Está hecha cuando la marcas.
        etiqueta: 'Estadística 2026-27',
        icono: 'calendario',
        valor: 'vie 27',
        rotulo: 'para subirla',
        nota: 'Los recuentos por curso y grupo están listos: cifras, sin nombres.',
        sigue: 'circulares#1',
        ir: 'circulares',
        accion: 'Ver el plazo',
        alTerminar: 'Datos subidos',
        accionHecha: 'Ver tus plazos',
      },
    ],

    // Lo que te necesita: empieza por lo que las cifras no dicen. Las de «Hoy» y «Esta semana» salen de correos
    // (llevan «Resumido con IA»).
    lista: {
      titulo: 'Lo que te necesita',
      items: [
        { grupo: 'Hoy', icono: 'correo', titulo: 'Sergio Prieto pregunta cómo entregar su justificante', detalle: 'Si por correo o en papel. Las respuestas le explican cómo subirlo desde DirectorIA.', estado: 'hoy', ir: 'correo:c-sergio', sigue: 'correo:c-sergio' },
        { grupo: 'Esta semana', icono: 'familia', titulo: 'Una familia de 4.º B pregunta cómo pagar la salida', detalle: 'Cambian de banco y no saben si el recibo de diciembre llegará a tiempo. Tienes tres respuestas propuestas.', estado: 'pendiente', ir: 'correo:c-pago', sigue: 'correo:c-pago' },
        // Choque: una de las dos fechas que propone la empresa cae en la visita de inspección (E4).
        { grupo: 'Esta semana', icono: 'calendario', titulo: 'Extintores: el jueves 26 coincide con la visita de inspección', detalle: 'La empresa propone ese día, de 9:00 a 12:00, o el martes 24 por la tarde, que tienes libre.', estado: 'pendiente', choque: true, ir: 'correo:c-extintores', sigue: 'correo:c-extintores', si: { titulo: 'Extintores: el día de la revisión', detalle: 'La empresa proponía el martes 24 o el jueves 26, el día de la visita de inspección.' } },
        { grupo: 'Esta semana', icono: 'correo', titulo: 'Estadística: acusa recibo a la Consejería', detalle: 'Piden también quién cargará los datos. Tienes la respuesta preparada.', estado: 'pendiente', ir: 'correo:c-estadistica', sigue: 'correo:c-estadistica' },
        { grupo: 'Esta semana', icono: 'correo', titulo: 'Banco: 46 € al mes de comisión de mantenimiento', detalle: 'Son 552 € al año. La petición para que la quiten está preparada en el correo.', estado: 'pendiente', ir: 'correo:c-banco', sigue: 'correo:c-banco' },
        { grupo: 'Para saber', icono: 'colegio', titulo: 'Ascensor: inspección periódica el viernes 15 de enero', detalle: 'En diciembre, confirma la hora con la empresa: ese día no se podrá usar.', estado: 'info', ir: 'circulares' },
        { grupo: 'Para saber', icono: 'colegio', titulo: 'Caldera: revisión anual', detalle: 'El certificado está guardado en el archivo de mantenimiento.', estado: 'hecho', verbo: 'Hecha el lun 2 nov', ir: 'circulares' },
      ],
    },

    // Lo que viene: cuatro semanas, hasta los electrodos del sáb 12 dic. Cada plazo sigue a su línea de «Circulares y plazos».
    // fuente: lo que la IA ha sacado de una circular o de un correo (lleva la insignia). El calendario de mantenimiento sale de reglas.
    // La visita de inspección es una fecha del colegio (secretaría no tiene ese correo) y el corte de la calle sale como
    // «De: Aviso del Ayuntamiento» en «Circulares y plazos», sin IA: las dos van sin insignia.
    agenda: {
      titulo: 'Lo que viene',
      desde: '2026-11-16',
      semanas: 4,
      marcas: [
        { fecha: '2026-11-20', tipo: 'plazo', titulo: 'Autorizaciones de la salida al Jardín Botánico', detalle: 'Las tutorías de 4.º las traen antes de las 14:00 y te dicen cuántas faltan.', fuente: 'circular', ir: 'circulares', sigue: 'circulares#0', verbo: 'Recibidas' },
        { fecha: '2026-11-26', hora: '10:00', tipo: 'evento', titulo: 'Visita de inspección', detalle: 'Inspección educativa, con la directora y el jefe de estudios.' },
        { fecha: '2026-11-27', tipo: 'plazo', titulo: 'Estadística de inicio de curso', detalle: 'Súbela a la plataforma de la Consejería antes de este día. Los recuentos, sin nombres, están preparados.', fuente: 'circular', ir: 'circulares', sigue: 'circulares#1', verbo: 'Datos subidos' },
        // Sale del calendario de mantenimiento (sin insignia). Al responder a la empresa, cambia el detalle y sigue pendiente.
        { fecha: '2026-11-30', tipo: 'plazo', titulo: 'Vence la revisión anual de los extintores', detalle: 'Los 42 del colegio. Falta fijar el día con la empresa.', ir: 'correo:c-extintores', sigue: 'correo:c-extintores', si: { detalle: 'Los 42 del colegio. Ya has respondido a la empresa para fijar el día.', estado: 'pendiente' } },
        { fecha: '2026-11-30', tipo: 'evento', titulo: 'Corte de la calle de la entrada por obras', detalle: 'De 7:00 a 19:00. Avisa a los proveedores que tengan entregas ese día, como el comedor.', ir: 'circulares', sigue: 'circulares#3', verbo: 'Proveedores avisados' },
        { fecha: '2026-12-12', tipo: 'plazo', titulo: 'Caducan los electrodos del desfibrilador', detalle: 'Pide ya los de recambio y comprueba con conserjería que quedan puestos.', ir: 'circulares', sigue: 'circulares#4', verbo: 'Recambio pedido' },
      ],
    },
  },

  // ─── Correo ───────────────────────────────────────────────────────
  // Las familias escriben de temas generales, sin nombres de alumnos. Los justificantes no llegan por correo: se suben por DirectorIA.
  correo: [
    {
      id: 'c-sergio',
      de: 'Sergio Prieto',
      deDetalle: 'Tutor de 3.º B de Primaria',
      asunto: '¿Cómo te hago llegar el justificante de hoy?',
      hora: '7:50',
      categoria: 'Claustro',
      etiqueta: { texto: 'Responder hoy', tipo: 'hoy' },
      resumen: [
        'Sergio Prieto no viene hoy y pregunta cómo entregar el justificante: si por correo o en papel cuando vuelva.',
        'No lo adjunta. Jefatura ya sabe que no viene.',
      ],
      piden: 'Saber cómo entregar el justificante de su ausencia de hoy.',
      original: 'Hola, Carmen:\n\nHoy no voy a ir; ya lo he marcado en la app y Javier lo sabe. Te escribo por el justificante: ¿te lo mando por correo o te lo llevo en papel cuando vuelva? No sé cómo lo hacemos este curso.\n\nLo tendré esta tarde. Gracias,\nSergio',
      respuestas: [
        {
          titulo: 'Explicarle cómo subirlo',
          texto: 'Hola, Sergio:\n\nNo me lo mandes por correo. Súbelo desde DirectorIA, en «Tus justificantes»: eliges la ausencia de hoy y el archivo, y un programa lo guarda en tu carpeta con la fecha. Ni la IA ni ningún programa leen lo que pone: solo lo abrimos tú y secretaría, y queda registrado quién lo abre.\n\nEn el registro de ausencias solo pondrá «Justificante: entregado».\n\nUn saludo,\nCarmen López\nSecretaria del Colegio Ejemplo',
        },
        {
          titulo: 'Decirle que no hay prisa',
          texto: 'Hola, Sergio:\n\nNo corre prisa. Cuando lo tengas, súbelo desde DirectorIA, en «Tus justificantes», y elige la ausencia de hoy. No hace falta que me lo mandes por correo ni que lo traigas en papel: un programa lo archiva en tu carpeta y yo ya lo veo ahí.\n\nUn saludo,\nCarmen López\nSecretaria del Colegio Ejemplo',
        },
        {
          titulo: 'Ofrecerle ayuda para subirlo',
          texto: 'Hola, Sergio:\n\nEste curso los justificantes se suben desde DirectorIA, en «Tus justificantes»: no por correo. Si cuando vuelvas no lo encuentras, pásate por secretaría y lo subimos juntos desde tu cuenta en un minuto.\n\nUn saludo,\nCarmen López\nSecretaria del Colegio Ejemplo',
        },
      ],
      nota: 'Los justificantes se suben por DirectorIA, no por correo. Los archiva un programa en su carpeta; la IA no los lee.',
      ir: 'justificantes',
    },
    {
      id: 'c-pago',
      de: 'Inés',
      deDetalle: 'Familia de 4.º B de Primaria',
      asunto: 'Pago de la salida al Jardín Botánico',
      hora: '7:34',
      categoria: 'Familias',
      etiqueta: { texto: 'Responder esta semana', tipo: 'plazo' },
      resumen: [
        'Una familia de 4.º B pregunta si puede pagar la salida al Jardín Botánico por transferencia o en secretaría.',
        'Este mes cambian de banco y no saben si el recibo de diciembre, que lleva la salida, llegará a la cuenta nueva.',
      ],
      piden: 'Saber si pueden pagar los 6 € de la salida de otra forma y cómo hacerlo.',
      original: 'Buenos días:\n\nSomos una familia de 4.º B. En la circular de la salida al Jardín Botánico pone que los 6 € se cobran en el recibo de diciembre. Este mes cambiamos de banco y no sabemos si el recibo llegará a tiempo a la cuenta nueva.\n\n¿Podemos pagarlo por transferencia o en secretaría, para no tener problemas? Si es así, ¿nos dicen cómo?\n\nMuchas gracias,\nInés',
      respuestas: [
        {
          titulo: 'Explicar cómo cambiar la cuenta',
          texto: 'Buenos días, Inés:\n\nNo se preocupen. Si nos traen a secretaría la nueva cuenta, firmada, antes del 1 de diciembre, el recibo de diciembre ya irá a la cuenta nueva, con la salida incluida.\n\nSi les resulta más cómodo, también pueden pagar los 6 € en secretaría, de 9:00 a 14:00, y se lo quitamos del recibo.\n\nUn saludo,\nCarmen López\nSecretaria del Colegio Ejemplo',
        },
        {
          titulo: 'Ofrecer el pago en secretaría',
          texto: 'Buenos días, Inés:\n\nPueden pagar los 6 € de la salida en secretaría, de 9:00 a 14:00, cualquier día antes del viernes 27. Les daremos un recibo y no se les cobrará en el de diciembre.\n\nPara el cambio de cuenta de los demás recibos, tráiganme la nueva firmada cuando puedan.\n\nUn saludo,\nCarmen López\nSecretaria del Colegio Ejemplo',
        },
        {
          titulo: 'Pedirles que avisen si hay problema',
          texto: 'Buenos días, Inés:\n\nGracias por avisar con tiempo. De momento no tienen que hacer nada: si el recibo de diciembre se devuelve por el cambio de banco, se lo diremos y lo pagan en secretaría sin ningún recargo.\n\nY si prefieren evitarlo, tráiganme la nueva cuenta firmada antes del 1 de diciembre.\n\nUn saludo,\nCarmen López\nSecretaria del Colegio Ejemplo',
        },
      ],
      nota: 'El recibo de diciembre lleva la salida. Las cuentas de las familias están en el programa de gestión del colegio, no en DirectorIA.',
    },
    {
      id: 'c-estadistica',
      de: 'Consejería de Educación',
      deDetalle: 'Comunidad de Madrid · Estadística educativa',
      asunto: 'Estadística de inicio de curso 2026-27: plazo de recogida de datos',
      hora: 'ayer',
      categoria: 'Consejería',
      etiqueta: { texto: 'Entregar antes del vie 27', tipo: 'plazo' },
      resumen: [
        'Piden los datos de la estadística de inicio de curso 2026-27: cuántos alumnos hay por curso y grupo, y el profesorado.',
        'Novedad: el profesorado se da por etapa y por jornada, completa o parcial. Se sube a su plataforma antes del viernes 27.',
        'Piden acuse de recibo y el nombre de quien cargará los datos en el colegio.',
      ],
      piden: 'Acusar recibo, decir quién carga los datos y subirlos a la plataforma antes del viernes 27.',
      original: 'Estimados equipos directivos:\n\nSe abre el plazo de recogida de datos de la estadística de inicio del curso 2026-2027 para los centros que imparten enseñanzas no universitarias en la Comunidad de Madrid.\n\nCada centro debe cumplimentar en la plataforma de la Consejería:\n- El alumnado matriculado, por curso y grupo.\n- El profesorado, por etapa educativa y por tipo de jornada, completa o parcial. Este curso se pide por primera vez con este desglose.\n\nEl plazo finaliza el viernes 27 de noviembre de 2026. Les rogamos que acusen recibo de esta comunicación e indiquen qué persona del centro se encargará de cargar los datos. Pueden plantear sus dudas respondiendo a este mismo correo.\n\nAtentamente,\nConsejería de Educación\nComunidad de Madrid',
      adjuntos: ['Instrucciones de la estadística 2026-27.pdf'],
      respuestas: [
        {
          titulo: 'Acusar recibo',
          texto: 'Buenos días:\n\nAcusamos recibo de la comunicación sobre la estadística de inicio del curso 2026-2027. Como secretaria del Colegio Ejemplo, seré yo quien cargue los datos en la plataforma.\n\nSubiremos los datos del alumnado por curso y grupo, y los del profesorado por etapa y tipo de jornada, antes del viernes 27 de noviembre.\n\nAtentamente,\nCarmen López\nSecretaria del Colegio Ejemplo',
        },
        {
          titulo: 'Preguntar por profesores de dos etapas',
          texto: 'Buenos días:\n\nAcusamos recibo de la comunicación sobre la estadística de inicio del curso 2026-2027. Como secretaria del centro, seré yo quien cargue los datos.\n\nAntes de hacerlo, les planteamos una duda: algunos docentes dan clase en Primaria y en ESO. ¿Hay que contarlos en la etapa en la que tienen más horas o en las dos, con las horas de cada una?\n\nAtentamente,\nCarmen López\nSecretaria del Colegio Ejemplo',
        },
        {
          titulo: 'Preguntar la fecha de referencia',
          texto: 'Buenos días:\n\nLes escribo con una duda sobre la estadística de inicio del curso 2026-2027, antes de cargar los datos: ¿a qué fecha hay que contar el alumnado matriculado? Este curso hemos tenido altas en octubre y no sabemos si deben incluirse.\n\nAcusamos recibo de la comunicación. Seré yo, como secretaria del centro, quien cargue los datos en la plataforma.\n\nAtentamente,\nCarmen López\nSecretaria del Colegio Ejemplo',
        },
      ],
      nota: 'Plazo apuntado en «Circulares y plazos». DirectorIA te lo recuerda el miércoles 25. Los recuentos son cifras por grupo, sin nombres.',
      ir: 'circulares',
    },
    {
      id: 'c-extintores',
      de: 'Empresa mantenedora',
      deDetalle: 'Extintores · planificación de revisiones',
      asunto: 'Revisión anual de extintores: propuesta de fechas',
      hora: 'ayer',
      categoria: 'Proveedores',
      etiqueta: { texto: 'Revisión antes del lun 30', tipo: 'plazo' },
      resumen: [
        'La revisión anual de los 42 extintores vence el lunes 30. Proponen el martes 24 de 15:00 a 18:00 o el jueves 26 de 9:00 a 12:00.',
        'Necesitan entrar en todas las plantas, el gimnasio, la cocina y la sala de calderas, con alguien del colegio que acompañe al técnico.',
        'Si un extintor no pasa la revisión, lo cambian en el momento y lo facturan aparte.',
      ],
      piden: 'Elegir el día de la revisión y que alguien del colegio acompañe al técnico.',
      original: 'Buenos días, Carmen:\n\nLe escribimos para programar la revisión anual de los extintores del colegio, que vence el 30 de noviembre. Tenemos técnico disponible en estas dos fechas:\n- Martes 24 de noviembre, de 15:00 a 18:00.\n- Jueves 26 de noviembre, de 9:00 a 12:00.\n\nRevisaremos los 42 extintores del centro. Necesitamos acceso a todas las plantas, también al gimnasio, a la cocina y a la sala de calderas, y que una persona del colegio acompañe al técnico durante la revisión.\n\nAl terminar le dejaremos el certificado de mantenimiento. Si algún extintor no pasa la revisión, lo cambiaremos en el momento por uno de reserva y se facturará aparte.\n\n¿Nos confirma qué día le viene mejor?\n\nUn saludo,\nLorena Ibáñez\nPlanificación de revisiones',
      respuestas: [
        {
          titulo: 'Confirmar el martes 24',
          texto: 'Buenos días, Lorena:\n\nLe confirmo la revisión de los extintores el martes 24 de noviembre, de 15:00 a 18:00. El técnico puede preguntar por el conserje en la entrada principal: le acompañará durante toda la revisión.\n\nA las 16:00 sale el alumnado de Primaria. Entre las 15:50 y las 16:20, eviten, por favor, el vestíbulo y la escalera principal. Al terminar, dejen el certificado de mantenimiento en secretaría.\n\nUn saludo,\nCarmen López\nSecretaria del Colegio Ejemplo',
        },
        {
          titulo: 'Proponer el miércoles 25 por la mañana',
          texto: 'Buenos días, Lorena:\n\nGracias por las fechas. El jueves 26 por la mañana tenemos una visita institucional en el colegio, así que ese día no nos viene bien. ¿Podría venir el técnico el miércoles 25, de 9:00 a 12:00? Nos encaja mejor una mañana.\n\nSi no tienen a nadie ese día, nos quedamos con el martes 24 por la tarde.\n\nUn saludo,\nCarmen López\nSecretaria del Colegio Ejemplo',
        },
        {
          titulo: 'Pedir precios antes de fijar la fecha',
          texto: 'Buenos días, Lorena:\n\nAntes de fijar la fecha, ¿me pueden decir cuánto cuesta un extintor de reserva, por si hay que cambiar alguno, y si la revisión anual va incluida en la cuota del contrato? Queremos tenerlo previsto en el presupuesto.\n\nEn principio nos encaja el martes 24, de 15:00 a 18:00. Se lo confirmo en cuanto me envíen los precios.\n\nUn saludo,\nCarmen López\nSecretaria del Colegio Ejemplo',
        },
      ],
      nota: 'Ojo: el jueves 26 a las 10:00 es la visita de inspección educativa. El martes 24 por la tarde no tienes nada en la agenda.',
      ir: 'circulares',
    },
    {
      id: 'c-banco',
      de: 'Banco',
      deDetalle: 'Gestora de empresas · cuenta del colegio',
      asunto: 'Nueva tarifa de comisiones de su cuenta desde el 1 de febrero',
      hora: 'lun 16',
      categoria: 'Proveedores',
      etiqueta: { texto: 'Nueva tarifa desde el lun 1 feb', tipo: 'info' },
      resumen: [
        'Desde el 1 de febrero, cada recibo devuelto costará 5 € (ahora 3,50 €) y cada transferencia en oficina, 6 € (ahora 4 €).',
        'La comisión de mantenimiento sigue en 46 € al mes. Las transferencias por banca en línea siguen sin coste.',
        'Si no se aceptan las nuevas condiciones, se puede cancelar la cuenta sin coste antes del 1 de febrero.',
      ],
      piden: '',
      original: 'Buenos días, Carmen:\n\nComo gestora de la cuenta del colegio, le adjunto la nueva tarifa de comisiones para cuentas de empresa, que se aplicará a partir del 1 de febrero de 2027. Le resumo lo que cambia en su caso:\n- Devolución de recibos domiciliados: pasa de 3,50 € a 5 € por recibo.\n- Transferencias hechas en la oficina: pasan de 4 € a 6 €. Las que se hacen por la banca en línea siguen sin coste.\n- La comisión de mantenimiento se mantiene en 46 € al mes.\n\nSi no está de acuerdo con las nuevas condiciones, puede cancelar la cuenta sin coste antes de esa fecha.\n\nPara cualquier consulta, estoy en la oficina de lunes a viernes por la mañana.\n\nUn saludo,\nNatalia Vega\nGestora de empresas',
      adjuntos: ['Tarifa de comisiones 2027.pdf'],
      respuestas: [
        {
          titulo: 'Pedir que quiten el mantenimiento',
          texto: 'Buenos días, Natalia:\n\nHemos revisado la nueva tarifa y las comisiones de la cuenta: la de mantenimiento nos supone 552 € al año. Por esta cuenta pasan todos los recibos del colegio y los pagos a proveedores, así que le pido que dejen de cobrárnosla desde el 1 de diciembre.\n\n¿Me lo puede confirmar por escrito?\n\nUn saludo,\nCarmen López\nSecretaria del Colegio Ejemplo',
        },
        {
          titulo: 'Pedir una cita en la oficina',
          texto: 'Buenos días, Natalia:\n\nAntes de que se aplique la nueva tarifa, me gustaría revisar con usted las condiciones de la cuenta del colegio, sobre todo la comisión de mantenimiento y la de devolución de recibos.\n\n¿Le viene bien el martes 1 o el miércoles 2 de diciembre, a las 9:30, en la oficina? Si no, dígame qué día le encaja.\n\nUn saludo,\nCarmen López\nSecretaria del Colegio Ejemplo',
        },
        {
          titulo: 'Pedir una oferta sin mantenimiento',
          texto: 'Buenos días, Natalia:\n\nGracias por la información. Estamos revisando las condiciones de todos nuestros proveedores. ¿Tienen alguna cuenta para centros educativos sin comisión de mantenimiento?\n\nSi es así, le agradeceré que me envíe sus condiciones por escrito, también las de devolución de recibos y transferencias, para compararlas con las de la cuenta actual.\n\nUn saludo,\nCarmen López\nSecretaria del Colegio Ejemplo',
        },
      ],
      nota: 'Aviso del analista de gastos: la comisión de mantenimiento suma 552 € al año. Conviene pedir que la quiten.',
      ir: 'gastos',
    },
  ],

  // ─── Módulos ──────────────────────────────────────────────────────
  modulos: [
    // E6. Analista de gastos, informe de octubre
    {
      id: 'gastos',
      tipo: 'informe',
      menu: 'Analista de gastos',
      antetitulo: 'Analista de gastos · informe de octubre',
      titulo: 'Informe de gastos de octubre',
      entradilla: 'DirectorIA ha revisado las facturas, los contratos y los extractos del banco de octubre. Revisa los avisos y envía el informe a dirección y a la titularidad, que son quienes deciden.',
      cifras: [
        { valor: '1.800 €', texto: 'de ahorro estimado al año si se baja la potencia de luz contratada' },
        { valor: '552 €', texto: 'al año de comisión de mantenimiento del banco' },
        { valor: '1.240 €', texto: 'en 6 recibos devueltos en octubre, pendientes de cobro' },
        { valor: '3 días', texto: 'para avisar a las fotocopiadoras si se quiere negociar o cambiar' },
      ],
      avisos: [
        {
          titulo: 'Fotocopiadoras: el contrato se renueva solo el 1 de diciembre',
          detalle: 'Si no se avisa antes del sábado 21, como fija el preaviso del contrato, se prorroga 12 meses en las mismas condiciones. La empresa ofreció a dirección el lunes 16 renovar por 36 meses; su oferta no menciona el preaviso. Lo decide dirección.',
          estado: 'hoy',
        },
        {
          titulo: 'Luz: la potencia contratada es mayor que la que se usa',
          detalle: 'Hay 150 kW contratados y en los últimos 12 meses el colegio no ha pasado de 104 kW. Bajar a 115 kW ahorraría unos 1.800 € al año (estimación). Antes de pedir el cambio, conviene que lo revise el instalador.',
          estado: 'pronto',
        },
        {
          titulo: 'Banco: 46 € al mes de comisión de mantenimiento',
          detalle: 'Son 552 € al año. Desde el 1 de febrero, además, cada recibo devuelto costará 5 € en vez de 3,50 €: con 6 al mes, como en octubre, serían 9 € más. La petición para que quiten el mantenimiento está preparada en el correo.',
          estado: 'pronto',
        },
        {
          titulo: 'Seguro escolar: dos presupuestos comparados',
          detalle: 'El B cuesta unos 600 € menos al año que el A, pero no cubre la asistencia dental por accidente, que sí cubren el A y la póliza actual. La póliza vence el 31 de diciembre. Lo deciden dirección y la titularidad.',
          estado: 'info',
        },
        {
          titulo: 'Cobros pendientes de octubre: 6 recibos devueltos',
          detalle: 'Suman 1.240 €. Aquí solo se ven cifras agregadas, sin nombres. El detalle por familia está en el programa de gestión del colegio, como siempre.',
          estado: 'info',
        },
      ],
      filas: [
        { partida: 'Suministros', proveedor: 'Luz', importe: '2.310 €', nota: 'Potencia contratada por encima de la que se usa' },
        { partida: 'Suministros', proveedor: 'Agua', importe: '430 €', nota: 'Como en octubre del curso pasado' },
        { partida: 'Limpieza', proveedor: 'Empresa de limpieza', importe: '6.850 €', nota: 'Cuota del contrato. Sin cambios' },
        { partida: 'Mantenimiento', proveedor: 'Ascensor, jardinería y reparaciones', importe: '1.315 €', nota: 'Incluye el cambio de dos cisternas en Infantil' },
        { partida: 'Reprografía', proveedor: 'Empresa de fotocopiadoras', importe: '960 €', nota: 'Cuota y copias. Se renueva solo el 1 de diciembre' },
        { partida: 'Comunicaciones', proveedor: 'Teléfono e internet', importe: '290 €', nota: 'Sin cambios' },
        { partida: 'Banco', proveedor: 'Comisiones de la cuenta', importe: '67 €', nota: 'Mantenimiento (46 €) y 6 recibos devueltos (21 €)' },
      ],
      pie: 'No sustituye a la gestoría ni lleva la contabilidad oficial. Las nóminas y los datos de personas solo se ven agregados. Contratar, cambiar o renegociar lo deciden dirección y la titularidad.',
    },

    // E8. Justificantes del profesorado: las carpetas que archiva el programa, con reglas y sin IA. Ni la IA ni ningún
    // programa leen lo que pone: solo lo abren el docente y secretaría, y el registro de accesos dice quién sube y quién abre.
    {
      id: 'justificantes',
      tipo: 'justificantes',
      vista: 'carpetas',
      menu: 'Justificantes',
      antetitulo: 'Personal · curso 2026-27',
      titulo: 'Justificantes del profesorado',
      entradilla: 'Cada docente sube el suyo desde DirectorIA y elige la ausencia. Un programa lo renombra y lo guarda en su carpeta, por curso, mes y docente. Ni la IA ni ningún programa leen lo que pone.',
      confidencial: 'Solo cada docente y secretaría, con registro de accesos',
      curso: '2026-27',
      ausencias: [
        { docente: 'Sergio Prieto', fecha: '2026-11-18', horas: 'Toda la jornada', justificante: 'pendiente' },
        { docente: 'Laura Sánchez', fecha: '2026-11-16', horas: '9:00-10:30', justificante: 'pendiente', sigue: 'docente/justificantes#j1' },
        { docente: 'Teresa Gil', fecha: '2026-11-12', horas: 'Toda la jornada', justificante: 'entregado' },
        { docente: 'Rosa Medina', fecha: '2026-11-05', horas: '9:00-11:15', justificante: 'entregado' },
        { docente: 'Beatriz Romero', fecha: '2026-10-27', horas: '8:15-10:05', justificante: 'entregado' },
        { docente: 'Ramón Esteban', fecha: '2026-10-21', horas: '12:30-14:45', justificante: 'entregado' },
        { docente: 'Laura Sánchez', fecha: '2026-10-08', horas: 'Toda la jornada', justificante: 'entregado' },
      ],
      reglas: [
        'Un programa, con reglas y sin IA, renombra cada justificante con su fecha y lo guarda en Justificantes / curso / mes / docente.',
        'Ni la IA ni ningún programa leen lo que pone. La IA no tiene acceso a esta carpeta: no la busca ni la resume.',
        'En el registro de ausencias solo pone «Justificante: entregado» o «pendiente», nunca el motivo.',
        'Lo ven el propio docente y secretaría, con registro de accesos.',
        'El programa los borra cuando pasa el plazo que fija el colegio.',
      ],
      // Quién sube y quién abre cada justificante, del más reciente al más antiguo. El motor añade arriba lo que se sube en la demo.
      registro: [
        'Carmen López abrió el de Teresa Gil del jueves 12 de noviembre, el viernes 13 a las 18:05',
        'Teresa Gil subió el de su ausencia del jueves 12 de noviembre, el viernes 13 a las 17:40',
        'Rosa Medina subió el de su ausencia del jueves 5 de noviembre, el viernes 6 a las 9:05',
      ],
    },

    // E7 y E10. Plazos de las circulares, los correos y el mantenimiento
    {
      id: 'circulares',
      tipo: 'plazos',
      menu: 'Circulares y plazos',
      antetitulo: 'Circulares, correos y calendario de mantenimiento',
      titulo: 'Qué hay que hacer, quién y cuándo',
      entradilla: 'DirectorIA saca los plazos de las circulares, de los correos y del calendario de mantenimiento del edificio, con quién se encarga de cada uno. Tú decides cuándo está hecho y lo marcas.',
      items: [
        {
          fecha: 'vie 20 nov',
          titulo: 'Autorizaciones de la salida al Jardín Botánico',
          detalle: 'Las tutorías de 4.º A y 4.º B traen las autorizaciones firmadas a secretaría y dicen cuántas faltan. La salida es el viernes 27, de 9:15 a 13:30, y cuesta 6 €.',
          quien: 'Tutorías de 4.º y secretaría',
          origen: 'Circular de la salida al Jardín Botánico',
          estado: 'pronto',
        },
        {
          fecha: 'vie 27 nov',
          titulo: 'Estadística de inicio de curso 2026-27',
          detalle: 'Subir a la plataforma de la Consejería cuántos alumnos hay por curso y grupo, y el profesorado por etapa y jornada. Son recuentos, sin nombres. DirectorIA te avisa el miércoles 25.',
          quien: 'Tú',
          origen: 'Circular de la Consejería de ayer',
          estado: 'pronto',
        },
        {
          fecha: 'lun 30 nov',
          titulo: 'Revisión anual de los extintores',
          detalle: 'Vence ese día. La empresa mantenedora propone el martes 24 por la tarde o el jueves 26 por la mañana, cuando viene la inspección. Falta fijar el día.',
          quien: 'Tú, con la empresa mantenedora',
          origen: 'Calendario de mantenimiento',
          estado: 'pronto',
        },
        {
          fecha: 'lun 30 nov',
          titulo: 'Corte de la calle de la entrada por obras',
          detalle: 'De 7:00 a 19:00 no se podrá parar delante del colegio. Avisa a los proveedores que tengan entregas ese día, como la empresa del comedor.',
          quien: 'Tú',
          origen: 'Aviso del Ayuntamiento del martes 17',
          estado: 'despues',
        },
        {
          fecha: 'sáb 12 dic',
          titulo: 'Electrodos del desfibrilador',
          detalle: 'Caducan ese día. Pide los de recambio a la empresa del desfibrilador y comprueba con conserjería que quedan puestos antes.',
          quien: 'Tú, con conserjería',
          origen: 'Calendario de mantenimiento',
          estado: 'despues',
        },
        {
          fecha: 'vie 15 ene',
          titulo: 'Inspección periódica del ascensor',
          detalle: 'Es el 15 de enero de 2027. En diciembre, confirma la hora con la empresa del ascensor: mientras dure la inspección, no se podrá usar.',
          quien: 'Tú, con la empresa del ascensor',
          origen: 'Calendario de mantenimiento',
          estado: 'despues',
        },
        {
          fecha: 'lun 2 nov',
          titulo: 'Revisión anual de la caldera',
          detalle: 'Hecha el lunes 2 de noviembre. El certificado está guardado en el archivo de mantenimiento.',
          quien: 'Empresa de la caldera',
          origen: 'Calendario de mantenimiento',
          estado: 'hecho',
        },
      ],
    },
  ],
});
