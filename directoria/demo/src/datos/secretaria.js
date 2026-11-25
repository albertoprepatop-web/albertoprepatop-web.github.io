DEMO.rol({
  id: 'secretaria',
  orden: 3,
  persona: {
    nombre: 'Carmen López',
    cargo: 'Secretaria',
    detalle: 'Secretaría y administración',
    ilustracion: 'secretaria',
  },
  acceso: 'Analista de gastos, certificados, autorizaciones de imagen, plazos y correo resumido',

  // ─── Inicio ───────────────────────────────────────────────────────
  inicio: {
    antetitulo: 'Miércoles 18 de noviembre · 8:00',
    titulo: 'Buenos días, Carmen',
    entradilla: 'Certificados, plazos, renovaciones y revisiones del edificio. Lo ha preparado DirectorIA; nada se envía ni se firma sin ti.',
    bloques: [
      {
        titulo: 'Certificados y autorizaciones',
        items: [
          {
            texto: 'Certificado de matrícula de Nora D. (1.º ESO A) para una beca deportiva: listo para revisar y pasar a la firma. Su familia lo necesita antes del viernes 20.',
            estado: 'hoy',
            ir: 'certificados',
          },
          {
            texto: 'Fotos del festival de otoño: tres alumnos de Primaria no pueden aparecer. Envía la lista a sus tutorías antes de publicar nada.',
            estado: 'pendiente',
            ir: 'imagen',
          },
          {
            texto: 'La familia de Iker P. (4.º A) quiere cambiar su autorización de imagen. La respuesta está preparada.',
            estado: 'pendiente',
            ir: 'correo:c-iker',
          },
        ],
      },
      {
        titulo: 'Próximos plazos',
        items: [
          {
            texto: 'Viernes 20: las tutorías de 4.º dejan en secretaría las autorizaciones firmadas de la salida al Jardín Botánico.',
            estado: 'pendiente',
            ir: 'circulares',
          },
          {
            texto: 'Viernes 27: estadística de inicio de curso en la plataforma de la Consejería. Los recuentos están preparados para que los revises.',
            estado: 'pendiente',
            ir: 'correo:c-estadistica',
          },
          {
            texto: 'Lunes 30: cortan la calle de la entrada por obras. Avisa a los proveedores que tengan entregas ese día.',
            estado: 'info',
            ir: 'circulares',
          },
        ],
      },
      {
        titulo: 'Renovaciones y ahorros',
        items: [
          {
            texto: 'Fotocopiadoras: el contrato se renueva solo el 1 de diciembre. Para negociar o cambiar de empresa hay que avisar antes del sábado 21. Lo decide dirección.',
            estado: 'pendiente',
            ir: 'gastos',
          },
          {
            texto: 'Banco: 46 € al mes de comisión de mantenimiento. La petición para que la quiten está preparada en el correo.',
            estado: 'pendiente',
            ir: 'correo:c-banco',
          },
          {
            texto: 'El informe de gastos de octubre está listo para enviarlo a dirección y a la titularidad.',
            estado: 'pendiente',
            ir: 'gastos',
          },
        ],
      },
      {
        titulo: 'Revisiones del edificio',
        items: [
          {
            texto: 'Extintores: la revisión anual vence el lunes 30. La empresa propone el martes 24 o el jueves 26, el día de la visita de inspección.',
            estado: 'pendiente',
            ir: 'correo:c-extintores',
          },
          {
            texto: 'Desfibrilador: los electrodos caducan el 12 de diciembre. Conviene pedir ya los de recambio.',
            estado: 'info',
            ir: 'circulares',
          },
          {
            texto: 'Ascensor: inspección periódica el viernes 15 de enero.',
            estado: 'info',
          },
          {
            texto: 'Caldera: revisión anual hecha el 2 de noviembre.',
            estado: 'hecho',
          },
        ],
      },
    ],
  },

  // ─── Correo ───────────────────────────────────────────────────────
  correo: [
    {
      id: 'c-nora',
      de: 'Padre de Nora D.',
      deDetalle: '1.º ESO A',
      asunto: 'Certificado de matrícula para la beca del club',
      hora: '7:34',
      categoria: 'Familias',
      etiqueta: { texto: 'Lo necesitan antes del vie 20', tipo: 'plazo' },
      resumen: [
        'El padre de Nora D. (1.º ESO A) pide un certificado de matrícula de este curso para una beca deportiva de su club.',
        'La solicitud se cierra el viernes 20. Lo prefieren firmado por correo; si no, lo recoge él en secretaría el jueves o el viernes.',
      ],
      piden: 'Un certificado de matrícula del curso 2026-27, firmado, antes del viernes 20.',
      original: 'Buenos días:\n\nMi hija Nora D., de 1.º de ESO A, juega en el club de baloncesto del barrio y este año ha salido la convocatoria de becas deportivas. Entre los papeles nos piden un certificado de matrícula del colegio de este curso.\n\nLa solicitud se cierra el viernes 20, así que vamos un poco justos. ¿Podrían enviárnoslo firmado por correo? Si tiene que ser en papel, me paso a recogerlo por secretaría el jueves o el viernes, a la hora que me digan.\n\nMuchas gracias, y perdonen las prisas.\n\nUn saludo,\nRubén, padre de Nora D. (1.º ESO A)',
      respuestas: [
        {
          titulo: 'Confirmar el envío por correo',
          texto: 'Buenos días, Rubén:\n\nYa tenemos preparado el certificado de matrícula de Nora de este curso. Lo firmo yo, como secretaria, con el visto bueno de la directora, y mañana, jueves 19, se lo envío por correo en PDF, con las dos firmas.\n\nAsí lo tendrán a tiempo para la solicitud del viernes. Si el club les pide algún dato más, díganmelo.\n\nUn saludo,\nCarmen López\nSecretaria del Colegio Ejemplo',
        },
        {
          titulo: 'Ofrecer recogerlo en secretaría',
          texto: 'Buenos días, Rubén:\n\nEl certificado de matrícula de Nora estará firmado mañana, jueves 19. Si el club lo quiere en papel, puede recogerlo en secretaría ese mismo día o el viernes, de 9:00 a 14:00.\n\nSi les basta con el PDF firmado, díganmelo y se lo envío por correo mañana.\n\nUn saludo,\nCarmen López\nSecretaria del Colegio Ejemplo',
        },
        {
          titulo: 'Preguntar si el club tiene un modelo',
          texto: 'Buenos días, Rubén:\n\nTendremos listo el certificado de matrícula de Nora mañana, jueves 19. Antes de firmarlo, ¿el club les ha dado un modelo propio o les pide que conste algo más, como el horario de clases? Si es así, envíenmelo y lo preparamos con ese formato.\n\nSi no, les mandaré nuestro certificado habitual, con el curso, el grupo y la fecha de matrícula.\n\nUn saludo,\nCarmen López\nSecretaria del Colegio Ejemplo',
        },
      ],
      nota: 'El certificado está preparado con los datos del expediente: 1.º ESO A, matrícula del 3 de julio. Revísalo y pásalo a la firma.',
      ir: 'certificados',
    },
    {
      id: 'c-iker',
      de: 'Madre de Iker P.',
      deDetalle: '4.º A de Primaria',
      asunto: 'Cambiar la autorización de imagen de Iker',
      hora: '7:10',
      categoria: 'Familias',
      etiqueta: { texto: 'Responder esta semana', tipo: 'plazo' },
      resumen: [
        'La madre de Iker P. (4.º A) quiere cambiar su autorización de imagen: en la matrícula marcaron que no.',
        'Quiere que Iker salga en la revista del colegio con su clase, pero no en la web.',
        'Pregunta qué impreso tiene que rellenar.',
      ],
      piden: 'Autorizar a Iker en la revista, pero no en la web, y saber cómo hacerlo.',
      original: 'Buenos días:\n\nSoy Silvia, la madre de Iker P., de 4.º A. Cuando hicimos la matrícula marcamos que no autorizábamos el uso de su imagen. Ahora Iker nos ha contado que en la revista del colegio van a salir fotos del festival de otoño, y le hace mucha ilusión aparecer con su clase.\n\n¿Podemos cambiar la autorización? Nos gustaría que saliera en la revista, pero preferimos que sus fotos no se publiquen en la web del colegio.\n\nSi hay que rellenar algún impreso, díganme cómo lo hacemos.\n\nMuchas gracias,\nSilvia, madre de Iker P. (4.º A)',
      respuestas: [
        {
          titulo: 'Explicar cómo cambiarla',
          texto: 'Buenos días, Silvia:\n\nClaro que pueden cambiarla. Basta con rellenar de nuevo la autorización de imagen, con «Sí» en la revista del colegio y «No» en la web. Pueden recoger el impreso en secretaría o se lo mandamos mañana con Iker, en un sobre.\n\nEn cuanto nos llegue firmado, lo anotamos en el registro y Iker podrá salir en la revista con su clase. Hasta entonces, no aparecerá en ninguna foto.\n\nUn saludo,\nCarmen López\nSecretaria del Colegio Ejemplo',
        },
        {
          titulo: 'Proponer firmarlo en secretaría',
          texto: 'Buenos días, Silvia:\n\nLo más rápido es que pase por secretaría y firme aquí el cambio. Le tendré preparado el impreso con «Sí» en la revista y «No» en la web, como nos pide: son cinco minutos.\n\nEstoy en secretaría de 9:00 a 14:00. Si le viene mejor a la salida de clase, a las 16:00, dígamelo y la espero.\n\nUn saludo,\nCarmen López\nSecretaria del Colegio Ejemplo',
        },
        {
          titulo: 'Preguntar qué fotos autorizan',
          texto: 'Buenos días, Silvia:\n\nGracias por escribirnos. Antes de prepararles el cambio, una pregunta: en la revista, ¿autorizan solo las fotos de grupo, con su clase, o también fotos en las que Iker salga solo? En el impreso son dos casillas distintas.\n\nEn cuanto me lo digan, se lo dejo preparado para firmar. Mientras tanto, Iker no aparecerá en ninguna foto.\n\nUn saludo,\nCarmen López\nSecretaria del Colegio Ejemplo',
        },
      ],
      nota: 'En el registro, Iker P. no tiene autorización de imagen. Hasta que llegue el cambio firmado, no puede salir en las fotos del festival.',
      ir: 'imagen',
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
        'Piden los datos de la estadística de inicio de curso 2026-27: el alumnado por curso y grupo, y el profesorado.',
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
      nota: 'Plazo apuntado en «Circulares y plazos». DirectorIA te lo recuerda el miércoles 25 y ha preparado los recuentos para que los revises.',
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
      etiqueta: { texto: 'Nueva tarifa el 1 de febrero', tipo: 'info' },
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

    // E8. Certificado de matrícula de Nora D.
    {
      id: 'certificados',
      ia: false,
      tipo: 'documento',
      menu: 'Certificados',
      antetitulo: 'Pedido hoy por la familia · beca deportiva',
      titulo: 'Certificado de matrícula de Nora D.',
      entradilla: 'DirectorIA lo ha preparado con el expediente y el modelo del centro. Revísalo y pásalo a la firma: firmas tú, como secretaria, y la directora da el visto bueno.',
      origen: 'Preparado por DirectorIA con la plantilla del certificado, el expediente de secretaría y el correo de la familia',
      documento: {
        titulo: 'Certificado de matrícula',
        subtitulo: 'Curso 2026-27 · Borrador para revisar y pasar a la firma',
        bloques: [
          { tipo: 'campo', etiqueta: 'Alumna', texto: 'Nora D.' },
          { tipo: 'campo', etiqueta: 'Curso y grupo', texto: '1.º de ESO, grupo A' },
          { tipo: 'campo', etiqueta: 'Fecha de matrícula', texto: '3 de julio de 2026' },
          { tipo: 'campo', etiqueta: 'Para qué', texto: 'Solicitud de una beca deportiva de su club' },
          { tipo: 'campo', etiqueta: 'Lo pide', texto: 'Su padre, por correo, hoy a las 7:34' },
          { tipo: 'titulo', texto: 'Texto del certificado' },
          { tipo: 'parrafo', texto: 'Carmen López, secretaria del Colegio Ejemplo, centro concertado de la Comunidad de Madrid,\n\nCERTIFICA:\n\nQue la alumna Nora D. está matriculada en este centro en el curso 2026-2027, en 1.º de Educación Secundaria Obligatoria, grupo A. La matrícula se formalizó el 3 de julio de 2026.\n\nY para que conste, a petición de la familia y para la solicitud de una beca deportiva, firmo este certificado en Madrid, a 18 de noviembre de 2026.' },
          { tipo: 'campo', etiqueta: 'La secretaria', texto: 'Carmen López' },
          { tipo: 'campo', etiqueta: 'Visto bueno de la directora', texto: 'Elena Ruiz' },
          { tipo: 'aviso', texto: 'Solo certifica la matrícula. No lleva notas, asistencia ni otros datos del expediente, porque la beca no los pide.' },
        ],
      },
      rellenado: [
        'Alumna, curso, grupo y fecha de matrícula, del expediente de secretaría',
        'Para qué es y quién lo pide, del correo de su padre de hoy a las 7:34',
        'Texto y firmas, del modelo de certificado del centro',
      ],
      comprobaciones: [
        'El curso, el grupo y la fecha coinciden con el expediente',
        'Quien lo pide consta en el expediente como padre o tutor legal',
        'Solo lleva lo que pide la beca: ni notas ni asistencia',
      ],
      boton: 'Pasar a la firma',
      alTerminar: 'Pasado a la firma. Lo firmas tú y le llega a Elena Ruiz para el visto bueno. Con las dos firmas, envíalo a la familia desde el correo.',
    },

    // E9. Autorizaciones de imagen del festival de otoño
    {
      id: 'imagen',
      tipo: 'tabla',
      menu: 'Fotos y autorizaciones',
      antetitulo: 'Fotos del festival de otoño · web y revista',
      titulo: 'Autorizaciones de imagen del festival de otoño',
      entradilla: 'DirectorIA ha cruzado los grupos del festival con el registro de autorizaciones. No mira las fotos ni reconoce caras: te dice quién no puede aparecer, y cada tutoría revisa sus fotos antes de publicar.',
      columnas: ['Alumno', 'Grupo', 'Web', 'Revista'],
      filas: [
        ['Adrián C.', '3.º B', 'No', 'No'],
        ['Iker P.', '4.º A', 'No', 'No, hasta que firmen el cambio'],
        ['Sofía L.', '4.º B', 'No', 'No'],
        ['Resto del alumnado', 'Primaria', 'Sí', 'Sí'],
      ],
      marcas: [
        { fila: 0, columna: 2, tipo: 'aviso' },
        { fila: 0, columna: 3, tipo: 'aviso' },
        { fila: 1, columna: 2, tipo: 'aviso' },
        { fila: 1, columna: 3, tipo: 'aviso' },
        { fila: 2, columna: 2, tipo: 'aviso' },
        { fila: 2, columna: 3, tipo: 'aviso' },
        { fila: 3, columna: 2, tipo: 'ok' },
        { fila: 3, columna: 3, tipo: 'ok' },
      ],
      avisos: [
        { texto: 'DirectorIA no mira las fotos ni reconoce caras. Solo saca del registro de autorizaciones quién no puede aparecer.', estado: 'info' },
        { texto: 'Iker P. (4.º A): su familia pide autorizar la revista, pero no la web. Hasta que llegue el cambio firmado, no puede salir en ninguna de las dos.', estado: 'aviso' },
        { texto: 'Antes de publicar, cada tutoría revisa las fotos de su grupo y quita aquellas en las que salga alguien de esta lista.', estado: 'info' },
        { texto: 'En el resto de grupos de Primaria, todas las familias han autorizado este curso la web y la revista.', estado: 'ok' },
      ],
      boton: 'Enviar la lista a las tutorías',
      alTerminar: 'Lista enviada a las tutorías de 3.º B, 4.º A y 4.º B. Nada se publica hasta que cada una confirme que ha revisado sus fotos.',
    },

    // E7 y E10. Plazos de las circulares, los correos y el mantenimiento
    {
      id: 'circulares',
      tipo: 'plazos',
      menu: 'Circulares y plazos',
      antetitulo: 'Circulares, correos y calendario de mantenimiento',
      titulo: 'Qué hay que hacer, quién y cuándo',
      entradilla: 'DirectorIA saca los plazos de las circulares, de los correos y del calendario de mantenimiento, con quién se encarga de cada uno. Tú decides cuándo está hecho y lo marcas.',
      items: [
        {
          fecha: 'vie 20 nov',
          titulo: 'Certificado de matrícula de Nora D. (1.º ESO A)',
          detalle: 'Lo pide su familia para una beca deportiva del club. Revísalo y pásalo a la firma; con el visto bueno de la directora, se envía por correo.',
          quien: 'Tú, con el visto bueno de dirección',
          origen: 'Correo del padre de Nora D. de hoy',
          estado: 'pronto',
        },
        {
          fecha: 'vie 20 nov',
          titulo: 'Autorizaciones de la salida al Jardín Botánico',
          detalle: 'Las tutorías de 4.º A y 4.º B recogen las autorizaciones firmadas y las dejan en secretaría. La salida es el viernes 27, de 9:15 a 13:30, y cuesta 6 €.',
          quien: 'Tutorías de 4.º y secretaría',
          origen: 'Circular de la salida al Jardín Botánico',
          estado: 'pronto',
        },
        {
          fecha: 'vie 27 nov',
          titulo: 'Estadística de inicio de curso 2026-27',
          detalle: 'Subir a la plataforma de la Consejería el alumnado por curso y grupo y el profesorado por etapa y jornada. Los recuentos están preparados para revisar. DirectorIA te avisa el miércoles 25.',
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
