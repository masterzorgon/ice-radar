export const es = {
  // Header
  header: {
    title: 'RASTREADOR DE AVISTAMIENTOS DE ICE',
    subtitle: 'SISTEMA DE ALERTA COMUNITARIA (BETA)',
    systemOnline: 'SISTEMA EN LINEA',
  },

  // Navigation
  nav: {
    home: '[INICIO]',
    resources: '[RECURSOS]',
    blog: '[NOTICIAS]',
    analytics: '[ESTADISTICAS]',
    info: '[INFO]',
    disclaimer: '[AVISO]',
    alerts: '[ALERTAS]',
    donate: 'DONAR',
    submitReport: '[+ ENVIAR REPORTE]',
  },

  // Stats Panel
  stats: {
    title: '[ESTADISTICAS]',
    subtitle: 'RESUMEN 24H',
    reports: 'REPORTES',
    active: 'ACTIVOS',
    verified: 'VERIFICADOS',
    topStates: 'ESTADOS MAS AFECTADOS:',
  },

  // Info Panel
  infoPanel: {
    title: '[INFO]',
    subtitle: 'ACTIVIDAD DE REPORTES',
    description: 'Ayuda a mantener tu comunidad informada y segura',
    whatToReport: 'Que Reportar:',
    whatToReportDesc: 'Vehiculos de ICE, retenes o detenciones.',
    where: 'Donde:',
    whereDesc: 'Usa la barra de ubicacion para compartir detalles exactos (intersecciones, direcciones o puntos de referencia).',
    when: 'Cuando:',
    whenDesc: 'Envia reportes tan pronto como sea seguro hacerlo.',
    privacy: 'Privacidad:',
    privacyDesc: 'Todos los reportes son completamente anonimos.',
  },

  // Anonymous Notice
  anonymous: {
    title: 'ANONIMO',
    description: 'Todos los reportes son anonimos. No se recopilan direcciones IP, informacion del dispositivo ni datos personales.',
  },

  // Report Feed
  feed: {
    title: '[FEED]',
    subtitle: 'REPORTES EN VIVO',
    entries: 'entradas',
    filtering: 'Filtrando:',
    clear: '[LIMPIAR]',
    noReports: 'No se encontraron reportes para este estado',
    verified: 'verificados',
  },

  // Status Bar
  statusBar: {
    system: 'SISTEMA:',
    operational: 'OPERACIONAL',
    disclaimer: 'Todos los datos son proporcionados por la comunidad, anonimos y deben verificarse independientemente',
  },

  // Map
  map: {
    loading: 'CARGANDO DATOS DEL MAPA',
  },

  // Report Statuses
  status: {
    active: 'ACTIVO',
    unverified: 'SIN VERIFICAR',
    resolved: 'RESUELTO',
  },

  // Report Types
  reportTypes: {
    raid: 'REDADA',
    checkpoint: 'RETEN',
    patrol: 'PATRULLA',
    detention: 'DETENCION',
    surveillance: 'VIGILANCIA',
  },

  // Donate Modal
  donate: {
    title: '[DONAR]',
    subtitle: 'APOYAR PROYECTO',
    message: 'Tu contribucion apoya directamente el mantenimiento y desarrollo de este sistema de alerta comunitaria para uso publico.',
    serverCosts: 'Costos de servidor e infraestructura',
    development: 'Desarrollo y actualizaciones de seguridad',
    keepFree: 'Mantener la plataforma gratuita para todos',
    donateButton: '[APOYAR ESTE PROYECTO]',
    securePayment: 'Pago seguro via Stripe',
    securityNote: 'Todas las transacciones estan encriptadas y procesadas de forma segura por Stripe.',
    noStorage: 'No se almacena informacion de pago en nuestros servidores.',
  },

  // Donation Popup Modal
  donationPopup: {
    title: '[APOYO]',
    subtitle: 'PROYECTO COMUNITARIO',
    mainMessage: 'Has estado usando ICE Radar para ayudar a mantener tu comunidad segura. Esta plataforma es 100% gratuita, anonima y administrada por voluntarios.',
    impactMessage: 'Tu donacion apoya directamente:',
    impact1: 'Costos de servidor para mantener alertas 24/7',
    impact2: 'Actualizaciones de seguridad para proteger el anonimato',
    impact3: 'Nuevas funciones solicitadas por la comunidad',
    credibility: 'Cada dolar va directamente a mantener esta plataforma viva',
    donateButton: '[APOYAR ESTE PROYECTO]',
    maybeLater: '[QUIZAS LUEGO]',
    dontShowAgain: '[NO MOSTRAR DE NUEVO]',
  },

  // Info Modal
  infoModal: {
    title: '[INFO]',
    subtitle: 'GUIA DE TERMINOLOGIA',
    close: '[CERRAR]',
    reportStatuses: 'ESTADOS DE REPORTES',
    reportTypes: 'TIPOS DE REPORTES',
    threatLevels: 'NIVELES DE AMENAZA',
    verificationSystem: 'SISTEMA DE VERIFICACION',
    activeDesc: 'Un reporte que ha sido verificado por 3 o mas miembros de la comunidad y representa un incidente en curso o reciente. Estas son alertas de alta prioridad.',
    unverifiedDesc: 'Un reporte recien enviado que aun no ha sido confirmado por otros miembros de la comunidad. Estos reportes necesitan verificacion de personas en el area.',
    resolvedDesc: 'Un incidente que ya no esta activo. El area ha sido confirmada como despejada por miembros de la comunidad.',
    raidDesc: 'Una operacion de aplicacion coordinada en una ubicacion especifica como un lugar de trabajo, residencia o area publica. Tipicamente involucra multiples agentes y vehiculos.',
    checkpointDesc: 'Una ubicacion fija donde se detienen vehiculos y se interroga a los ocupantes. A menudo se instalan en autopistas, cerca de fronteras o en centros de transito.',
    patrolDesc: 'Actividad de aplicacion movil donde los agentes conducen por vecindarios o areas. Puede involucrar vehiculos marcados o sin marcar.',
    detentionDesc: 'Un reporte de individuos siendo detenidos o puestos bajo custodia. A menudo ocurre en juzgados, carceles o durante otras acciones de aplicacion.',
    surveillanceDesc: 'Agentes observados monitoreando un area sin aplicacion activa. Puede indicar actividad proxima o recopilacion de informacion.',
    critical: 'CRITICO',
    elevated: 'ELEVADO',
    normal: 'NORMAL',
    criticalDesc: 'Nivel de alerta de alta prioridad que indica actividad de aplicacion significativa e inmediata en una region. Multiples incidentes activos reportados con altos conteos de verificacion.',
    elevatedDesc: 'Nivel de actividad moderado que indica alguna presencia de aplicacion en una region. Se han enviado algunos reportes activos o sin verificar. Ten precaucion.',
    normalDesc: 'Baja o ninguna actividad de aplicacion reciente reportada en una region. No hay incidentes activos siendo rastreados actualmente. Se recomienda conciencia estandar.',
    verifiedCount: 'Conteo de Verificaciones:',
    verifiedCountDesc: 'El numero de miembros de la comunidad que han confirmado ver o experimentar la actividad reportada.',
    verificationNote: 'Los reportes se vuelven ACTIVOS despues de recibir 3 o mas verificaciones. Esto ayuda a filtrar reportes falsos y priorizar incidentes confirmados.',
  },

  // Report Modal
  reportModal: {
    title: '[REPORTE]',
    subtitle: 'ENVIAR INCIDENTE',
    incidentType: 'TIPO DE INCIDENTE:',
    useLocation: 'USAR MI UBICACION ACTUAL',
    detectingLocation: 'DETECTANDO UBICACION...',
    locationDetected: 'Ubicacion detectada:',
    nearbyIncidents: 'INCIDENTES CERCANOS RECIENTES',
    nearbyDescription: 'Encontramos {count} incidente{plural} reportado{plural} cerca de tu ubicacion en las ultimas 2 horas. Si tu incidente ya fue reportado, por favor verificalo en lugar de crear un duplicado.',
    milesAway: 'millas',
    verifyButton: '[VERIFICAR]',
    verifiedButton: 'VERIFICADO',
    continueNew: 'Si ninguno coincide, continua con tu nuevo reporte abajo',
    city: 'CIUDAD:',
    cityPlaceholder: 'Ingresa ciudad...',
    state: 'ESTADO:',
    statePlaceholder: 'Selecciona...',
    address: 'DIRECCION / UBICACION:',
    addressPlaceholder: 'Interseccion, punto de referencia, etc...',
    description: 'DESCRIPCION:',
    descriptionPlaceholder: 'Describe lo que observaste...',
    safetyWarning: 'No te pongas en peligro. Solo reporta lo que puedas observar de forma segura.',
    anonymousNotice: 'Tu reporte es completamente anonimo. No se recopilan ni almacenan datos personales.',
    cancel: '[CANCELAR]',
    submit: '[ENVIAR REPORTE]',
    submitting: 'ENVIANDO...',
    locationErrors: {
      notSupported: 'La geolocalizacion no es compatible con tu navegador',
      denied: 'Acceso a ubicacion denegado. Por favor habilita los permisos de ubicacion.',
      unavailable: 'Informacion de ubicacion no disponible.',
      timeout: 'La solicitud de ubicacion expiro.',
      default: 'Ocurrio un error al obtener tu ubicacion.',
    },
  },

  // Report Detail Modal
  detailModal: {
    title: '[INCIDENTE]',
    report: 'REPORTE',
    location: 'UBICACION:',
    viewOnMaps: 'Ver en Google Maps',
    coordinates: 'Coordenadas:',
    descriptionLabel: 'DESCRIPCION:',
    reported: 'REPORTADO:',
    verification: 'VERIFICACION:',
    verified: 'verificados',
    reporter: 'reportero',
    reporters: 'reporteros',
    comments: 'COMENTARIOS',
    addComment: 'Agregar comentario anonimo...',
    post: '[PUBLICAR]',
    posting: 'PUBLICANDO...',
    close: '[CERRAR]',
    verifyReport: '[VERIFICAR REPORTE]',
    verifiedCheck: 'VERIFICADO',
    anonymousNote: 'Todos los reportes se envian y ven de forma anonima',
    typeDescriptions: {
      raid: 'Operacion de aplicacion activa dirigida a una ubicacion especifica',
      checkpoint: 'Reten de inmigracion instalado en la carretera',
      patrol: 'Vehiculos de patrulla o agentes observados en el area',
      detention: 'Individuo(s) siendo detenido(s) o transportado(s)',
      surveillance: 'Agentes observando o monitoreando un area',
    },
  },

  // Common
  common: {
    ago: 'hace',
  },

  // Resources
  resources: {
    pageTitle: 'CONOCE TUS DERECHOS Y OBTÉN AYUDA',
    visitLink: 'VISITAR RECURSO',
    disclaimerTitle: 'AVISO IMPORTANTE',
    disclaimer: 'Esta informacion se proporciona solo con fines educativos y no constituye asesoramiento legal. Cada situacion es diferente. Si necesita asistencia legal, consulte con un abogado de inmigracion calificado. Los enlaces proporcionados son a organizaciones externas y no somos responsables de su contenido.',
    categories: 'Categorias',
    footer: 'Los enlaces externos se abren en nuevas pestanas',
  },

  // Disclaimer Modal
  disclaimer: {
    title: '[AVISO]',
    subtitle: 'AVISO IMPORTANTE',
    close: '[CERRAR]',
    mainText: 'Esta informacion se proporciona solo con fines educativos y no constituye asesoramiento legal. Cada situacion es diferente. Si necesita asistencia legal, consulte con un abogado de inmigracion calificado. Los enlaces proporcionados son a organizaciones externas y no somos responsables de su contenido. Todos los datos son proporcionados por la comunidad, anonimos y/o de recursos publicos. La informacion debe verificarse de forma independiente.',
    notLegalAdvice: 'No Es Asesoramiento Legal',
    notLegalAdviceDesc: 'Esta informacion es solo para fines educativos. Cada situacion es unica y requiere evaluacion individual.',
    externalLinks: 'Enlaces Externos',
    externalLinksDesc: 'Los enlaces proporcionados son a organizaciones externas. No somos responsables de su contenido o precision.',
    communityData: 'Datos de la Comunidad',
    communityDataDesc: 'Todos los datos son proporcionados por la comunidad, anonimos y/o de recursos publicos.',
    verifyIndependently: 'Verificar Informacion',
    verifyIndependentlyDesc: 'La informacion siempre debe verificarse de forma independiente antes de tomar accion.',
  },

  // Subscribe Modal
  subscribe: {
    title: '[ALERTAS]',
    subtitle: 'NOTIFICACIONES POR EMAIL',
    description: 'Recibe notificaciones cuando se reporten nuevos avistamientos de ICE en los estados que selecciones. Tu email solo se usa para alertas.',
    emailLabel: 'CORREO ELECTRONICO',
    emailPlaceholder: 'tu@email.com',
    statesLabel: 'SELECCIONA ESTADOS',
    selectAll: 'Seleccionar Todos',
    deselectAll: 'Deseleccionar Todos',
    privacyNotice: 'Tu email se almacena de forma segura y solo se usa para alertas. Cancela cuando quieras.',
    submit: '[SUSCRIBIRSE A ALERTAS]',
    submitting: 'SUSCRIBIENDO...',
    successTitle: 'Revisa Tu Email',
    successMessage: 'Te enviamos un enlace de verificacion. Haz clic para activar tus alertas.',
    close: '[CERRAR]',
  },

  // Analytics
  analytics: {
    pageTitle: 'DATOS DE APLICACION Y DEMOGRAFICOS',
    dataAsOf: 'Datos al',
    totalDeportations: 'Deportaciones Totales',
    totalArrests: 'Arrestos Totales',
    avgDailyDetentions: 'Detenciones Diarias Prom.',
    activeCases: 'Casos Activos',
    dataSources: 'Fuentes de Datos',
    disclaimer: 'Los datos se agregan de fuentes publicas y pueden no reflejar cifras en tiempo real.',
    aboutData: 'Sobre Estos Datos',
    aboutDataDesc: 'Este panel muestra estadisticas agregadas de aplicacion de inmigracion compiladas de agencias gubernamentales e instituciones de investigacion. Los datos se actualizan periodicamente y representan cifras acumulativas para el periodo seleccionado.',
    period: 'Periodo',
    footerDisclaimer: 'Las estadisticas son solo para fines informativos',
    // Chart titles
    trendsTitle: 'TENDENCIAS',
    trendsSubtitle: 'DATOS MENSUALES DE APLICACION',
    originTitle: 'ORIGEN',
    originSubtitle: 'PAISES PRINCIPALES',
    ageTitle: 'EDAD',
    ageSubtitle: 'DISTRIBUCION',
    statusTitle: 'ESTADO',
    statusSubtitle: 'COMPOSICION FAMILIAR',
    mapTitle: 'MAPA',
    mapSubtitle: 'ACTIVIDAD DE APLICACION POR ESTADO',
  },
};
