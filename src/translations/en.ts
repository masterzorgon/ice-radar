export const en = {
  // Header
  header: {
    title: 'ICE RADAR',
    subtitle: 'COMMUNITY ALERT SYSTEM (BETA)',
    systemOnline: 'SYSTEM ONLINE',
  },

  // Navigation
  nav: {
    home: '[HOME]',
    resources: '[RESOURCES]',
    analytics: '[ANALYTICS]',
    info: '[INFO]',
    disclaimer: '[DISCLAIMER]',
    alerts: '[ALERTS]',
    donate: 'DONATE',
    submitReport: '[+ SUBMIT REPORT]',
  },

  // Stats Panel
  stats: {
    title: '[STATS]',
    subtitle: 'PAST MONTH',
    reports: 'REPORTS',
    active: 'ACTIVE',
    verified: 'VERIFIED',
    topStates: 'TOP AFFECTED STATES:',
  },

  // Info Panel
  infoPanel: {
    title: '[INFO]',
    subtitle: 'REPORTING ACTIVITY',
    description: 'Help keep your community informed and safe',
    whatToReport: 'What to Report:',
    whatToReportDesc: 'ICE vehicles, checkpoints, or detainments.',
    where: 'Where:',
    whereDesc: 'Use the Location bar to share exact details (intersections, addresses, or landmarks).',
    when: 'When:',
    whenDesc: 'Submit reports as soon as it\'s safe for you to do so.',
    privacy: 'Privacy:',
    privacyDesc: 'All reports are completely anonymous.',
  },

  // Anonymous Notice
  anonymous: {
    title: 'ANONYMOUS',
    description: 'All reports are anonymous. No IP addresses, device info, or personal data is collected.',
  },

  // Report Feed
  feed: {
    title: '[FEED]',
    subtitle: 'LIVE REPORTS',
    entries: 'entries',
    filtering: 'Filtering:',
    clear: '[CLEAR]',
    noReports: 'No reports found for this state',
    verified: 'verified',
  },

  // Status Bar
  statusBar: {
    system: 'SYSTEM:',
    operational: 'OPERATIONAL',
    disclaimer: 'All data is community-sourced, anonymous, and should be verified independently',
  },

  // Map
  map: {
    loading: 'LOADING MAP DATA',
  },

  // Report Statuses
  status: {
    active: 'ACTIVE',
    unverified: 'UNVERIFIED',
    resolved: 'RESOLVED',
  },

  // Report Types
  reportTypes: {
    raid: 'RAID',
    checkpoint: 'CHECKPOINT',
    patrol: 'PATROL',
    detention: 'DETENTION',
    surveillance: 'SURVEILLANCE',
  },

  // Donate Modal
  donate: {
    title: '[DONATE]',
    subtitle: 'SUPPORT PROJECT',
    message: 'Your contribution directly supports the maintenance and development of this community alert system for public use.',
    serverCosts: 'Server costs & infrastructure',
    development: 'Development & security updates',
    keepFree: 'Keeping the platform free for all',
    donateButton: '[SUPPORT THIS PROJECT]',
    securePayment: 'Secure payment via Stripe',
    securityNote: 'All transactions are encrypted and processed securely by Stripe.',
    noStorage: 'No payment information is stored on our servers.',
  },

  // Donation Popup Modal
  donationPopup: {
    title: '[SUPPORT]',
    subtitle: 'COMMUNITY PROJECT',
    mainMessage: 'You\'ve been using ICE Radar to help keep your community safe. This platform is 100% free, anonymous, and run by volunteers.',
    impactMessage: 'Your donation directly supports:',
    impact1: 'Server costs to keep alerts running 24/7',
    impact2: 'Security updates to protect user anonymity',
    impact3: 'New features requested by the community',
    credibility: 'Every dollar goes directly to keeping this platform alive',
    donateButton: '[SUPPORT THIS PROJECT]',
    maybeLater: '[MAYBE LATER]',
    dontShowAgain: '[DON\'T SHOW AGAIN]',
  },

  // Info Modal
  infoModal: {
    title: '[INFO]',
    subtitle: 'TERMINOLOGY GUIDE',
    close: '[CLOSE]',
    reportStatuses: 'REPORT STATUSES',
    reportTypes: 'REPORT TYPES',
    threatLevels: 'THREAT LEVELS',
    verificationSystem: 'VERIFICATION SYSTEM',
    activeDesc: 'A report that has been verified by 3 or more community members and represents an ongoing or recent incident. These are high-priority alerts.',
    unverifiedDesc: 'A newly submitted report that has not yet been confirmed by other community members. These reports need verification from people in the area.',
    resolvedDesc: 'An incident that is no longer active. The area has been confirmed clear by community members.',
    raidDesc: 'A coordinated enforcement operation at a specific location such as a workplace, residence, or public area. Typically involves multiple agents and vehicles.',
    checkpointDesc: 'A fixed location where vehicles are stopped and occupants questioned. Often set up on highways, near borders, or at transit hubs.',
    patrolDesc: 'Mobile enforcement activity where agents drive through neighborhoods or areas. May involve marked or unmarked vehicles.',
    detentionDesc: 'A report of individuals being detained or taken into custody. Often occurs at courthouses, jails, or during other enforcement actions.',
    surveillanceDesc: 'Agents observed monitoring an area without active enforcement. May indicate upcoming activity or information gathering.',
    critical: 'CRITICAL',
    elevated: 'ELEVATED',
    normal: 'NORMAL',
    criticalDesc: 'High-priority alert level indicating significant and immediate enforcement activity in a region. Multiple active incidents reported with high verification counts.',
    elevatedDesc: 'Moderate activity level indicating some enforcement presence in a region. A few active or unverified reports have been submitted. Exercise caution.',
    normalDesc: 'Low or no recent enforcement activity reported in a region. No active incidents currently being tracked. Standard awareness recommended.',
    verifiedCount: 'Verified Count:',
    verifiedCountDesc: 'The number of community members who have confirmed seeing or experiencing the reported activity.',
    verificationNote: 'Reports become ACTIVE after receiving 3 or more verifications. This helps filter out false reports and prioritize confirmed incidents.',
  },

  // Report Modal
  reportModal: {
    title: '[REPORT]',
    subtitle: 'SUBMIT INCIDENT',
    incidentType: 'INCIDENT TYPE:',
    useLocation: 'USE MY CURRENT LOCATION',
    detectingLocation: 'DETECTING LOCATION...',
    locationDetected: 'Location detected:',
    nearbyIncidents: 'NEARBY RECENT INCIDENTS',
    nearbyDescription: 'We found {count} incident{plural} reported near your location in the last 2 hours. If your incident was already reported, please verify it instead of creating a duplicate.',
    milesAway: 'mi away',
    verifyButton: '[VERIFY]',
    verifiedButton: 'VERIFIED',
    continueNew: 'If none of these match, continue with your new report below',
    city: 'CITY:',
    cityPlaceholder: 'Enter city...',
    state: 'STATE:',
    statePlaceholder: 'Select...',
    address: 'ADDRESS / LOCATION:',
    addressPlaceholder: 'Intersection, landmark, etc...',
    description: 'DESCRIPTION:',
    descriptionPlaceholder: 'Describe what you observed...',
    safetyWarning: 'Do not put yourself in danger. Only report what you can safely observe.',
    anonymousNotice: 'Your report is completely anonymous. No personal data is collected or stored.',
    cancel: '[CANCEL]',
    submit: '[SUBMIT REPORT]',
    submitting: 'SUBMITTING...',
    locationErrors: {
      notSupported: 'Geolocation is not supported by your browser',
      denied: 'Location access denied. Please enable location permissions.',
      unavailable: 'Location information unavailable.',
      timeout: 'Location request timed out.',
      default: 'An error occurred while getting your location.',
    },
  },

  // Report Detail Modal
  detailModal: {
    title: '[INCIDENT]',
    report: 'REPORT',
    location: 'LOCATION:',
    viewOnMaps: 'View on Google Maps',
    coordinates: 'Coordinates:',
    descriptionLabel: 'DESCRIPTION:',
    reported: 'REPORTED:',
    verification: 'VERIFICATION:',
    verified: 'verified',
    reporter: 'reporter',
    reporters: 'reporters',
    comments: 'COMMENTS',
    addComment: 'Add anonymous comment...',
    post: '[POST]',
    posting: 'POSTING...',
    close: '[CLOSE]',
    verifyReport: '[VERIFY REPORT]',
    verifiedCheck: 'VERIFIED',
    anonymousNote: 'All reports are submitted and viewed anonymously',
    typeDescriptions: {
      raid: 'Active enforcement operation targeting a specific location',
      checkpoint: 'Immigration checkpoint set up on roadway',
      patrol: 'Patrol vehicles or agents observed in area',
      detention: 'Individual(s) being detained or transported',
      surveillance: 'Agents observing or monitoring an area',
    },
  },

  // Common
  common: {
    ago: 'ago',
  },

  // Resources
  resources: {
    pageTitle: 'KNOW YOUR RIGHTS & GET HELP',
    visitLink: 'VISIT RESOURCE',
    categories: 'Categories',
    footer: 'External links open in new tabs',
  },

  // Disclaimer Modal
  disclaimer: {
    title: '[DISCLAIMER]',
    subtitle: 'IMPORTANT NOTICE',
    close: '[CLOSE]',
    mainText: 'This information is provided for educational purposes only and does not constitute legal advice. Every situation is different. If you need legal assistance, please consult with a qualified immigration attorney. The links provided are to external organizations and we are not responsible for their content. All data is community-sourced, anonymous, and/or from public resources. Information should be verified independently.',
    notLegalAdvice: 'Not Legal Advice',
    notLegalAdviceDesc: 'This information is for educational purposes only. Every situation is unique and requires individual assessment.',
    externalLinks: 'External Links',
    externalLinksDesc: 'Links provided are to external organizations. We are not responsible for their content or accuracy.',
    communityData: 'Community Data',
    communityDataDesc: 'All data is community-sourced, anonymous, and/or from public resources.',
    verifyIndependently: 'Verify Information',
    verifyIndependentlyDesc: 'Information should always be verified independently before taking action.',
  },

  // Subscribe Modal
  subscribe: {
    title: '[ALERTS]',
    subtitle: 'EMAIL NOTIFICATIONS',
    description: 'Get notified when new ICE sightings are reported in your selected states. Your email is only used for alerts.',
    emailLabel: 'EMAIL ADDRESS',
    emailPlaceholder: 'your@email.com',
    statesLabel: 'SELECT STATES',
    selectAll: 'Select All',
    deselectAll: 'Deselect All',
    privacyNotice: 'Your email is stored securely and only used for alerts. Unsubscribe anytime.',
    submit: '[SUBSCRIBE TO ALERTS]',
    submitting: 'SUBSCRIBING...',
    successTitle: 'Check Your Email',
    successMessage: 'We sent you a verification link. Click it to activate your alerts.',
    close: '[CLOSE]',
  },

  // Share
  share: {
    title: 'SHARE',
    sms: 'TEXT',
    whatsapp: 'WHATSAPP',
    alertPrefix: 'ICE ALERT',
    viewDetails: 'View details',
  },

  // Analytics
  analytics: {
    pageTitle: 'ENFORCEMENT & DEMOGRAPHIC DATA',
    dataAsOf: 'Data as of',
    totalDeportations: 'Total Deportations',
    totalArrests: 'Total Arrests',
    avgDailyDetentions: 'Avg Daily Detentions',
    activeCases: 'Active Cases',
    dataSources: 'Data Sources',
    disclaimer: 'Data is aggregated from public sources and may not reflect real-time figures.',
    aboutData: 'About This Data',
    aboutDataDesc: 'This dashboard displays aggregated immigration enforcement statistics compiled from government agencies and research institutions. Data is updated periodically and represents cumulative figures for the selected time period.',
    period: 'Period',
    footerDisclaimer: 'Statistics are for informational purposes only',
    // Chart titles
    trendsTitle: 'TRENDS',
    trendsSubtitle: 'MONTHLY ENFORCEMENT DATA',
    originTitle: 'ORIGIN',
    originSubtitle: 'TOP COUNTRIES',
    ageTitle: 'AGE',
    ageSubtitle: 'DISTRIBUTION',
    methodTitle: 'METHOD',
    methodSubtitle: 'APPREHENSION TYPE',
    mapTitle: 'MAP',
    mapSubtitle: 'STATE ENFORCEMENT ACTIVITY',
  },
};
