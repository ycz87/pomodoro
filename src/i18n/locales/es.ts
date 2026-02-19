import type { Messages } from '../types';

const formatDuration = (minutes: number): string => {
  const safeMinutes = Math.max(0, Math.round(minutes));
  if (safeMinutes < 60) return `${safeMinutes} min`;
  if (safeMinutes < 1440) {
    const hours = Math.floor(safeMinutes / 60);
    const remainMinutes = safeMinutes % 60;
    return `${hours} h ${remainMinutes} min`;
  }
  const days = Math.floor(safeMinutes / 1440);
  const remainHours = Math.floor((safeMinutes % 1440) / 60);
  return `${days} d ${remainHours} h`;
};

/** Traducciones al español */
export const es: Messages = {
  // App
  appName: 'Reloj Sandía',
  appNameShort: 'Sandía',

  // Timer phases
  phaseWork: '🍉 Enfoque',
  phaseShortBreak: '☕ Descanso',

  // Timer controls
  abandon: 'Abandonar',
  quickTimeHint: 'Toca para ajustar la duración',
  toggleTimerMode: 'Toca para alternar ascendente/descendente',

  // Task input
  taskPlaceholder: '¿En qué estás trabajando?',
  clearTask: 'Borrar',

  // Task list
  emptyTitle: '¿Listo para empezar?',
  emptySubtitle: 'Comienza tu primera sesión de enfoque 🍉',
  todayRecords: 'Sesiones de hoy',
  unnamed: 'Sin título',
  editHint: 'Toca para editar',
  deleteConfirm: '¿Seguro?',

  // Today stats
  todayHarvest: 'Cosecha de hoy',
  totalFocus: (time: string) => `Total: ${time}`,

  // Notifications
  workComplete: (emoji: string) => `${emoji} ¡Sesión completada!`,
  skipComplete: (emoji: string) => `${emoji} Completada manualmente`,
  breakOver: '☕ Descanso terminado',
  breakOverBody: '¿Listo para la siguiente sesión?',

  // Celebration
  celebrationRipe: ['¡Increíble! 🎉', '¡Bien hecho! ✨', '¡Enfoque perfecto! 🔥', '¡Sigue así! 💪'],
  celebrationShort: ['¡Bien! 👍', '¡Hecho! ✨', '¡Buen comienzo! 🌱'],

  // Per-stage celebration text (v0.7.1)
  celebrateSeed: [
    'Cada brote guarda un campo de sandías 🌱',
    'Un pequeño inicio, una gran posibilidad ✨',
    'El brote está en tus manos',
    'Tu primer paso de enfoque, dado 🌱',
    'Un pequeño brote, esperando florecer',
  ],
  celebrateSprout: [
    'Un brote emerge — tu enfoque echa raíces 🌿',
    'Mira, tu esfuerzo está brotando',
    'Sigue así, se convertirá en algo increíble 🌿',
    'Cada minuto de enfoque es sol y lluvia',
    'El brote está aquí, vienen cosas buenas 🌿',
  ],
  celebrateBloom: [
    'Una flor se abre — ¿puede el fruto estar lejos? 🌼',
    'No solo florece una flor, también tu enfoque',
    'Flores abiertas, cosas buenas por venir 🌼',
    'Un poco más y llegará el fruto',
    'Tu enfoque está floreciendo 🌼',
  ],
  celebrateGreen: [
    'La sandía se forma — la cosecha está cerca 🍈',
    '¡Tan cerca de una sandía perfecta!',
    'Tu enfoque ha dado fruto 🍈',
    '¡Un poco más la próxima vez y será enorme!',
    'El fruto de tu enfoque se muestra 🍈',
  ],
  celebrateRipe: [
    '¡Una sandía perfecta! Eres increíble 🍉🎉',
    'Esta sandía es el fruto más dulce del enfoque',
    '¡Hora de cosechar! Mereces esta celebración 🍉',
    '25 minutos de enfoque para la recompensa más dulce 🎉',
    '¡Gran cosecha! Este es el poder del enfoque 🍉',
  ],
  celebrateLegendary: [
    '¡La legendaria Sandía Dorada! Eres un maestro del enfoque 👑',
    '¡Gloria dorada! El mayor honor es tuyo 👑✨',
    '¡La Sandía Dorada desciende! Salve al rey del enfoque 🏆',
    '90 minutos de enfoque profundo para una recompensa legendaria 👑',
    '¡Sandía Dorada! El mundo entero te aplaude 🎉👑',
  ],

  // Warehouse & Synthesis
  warehouseTitle: '🏠 Mi Cobertizo',
  warehouseTabShed: '🍉 Cobertizo',
  warehouseTabBackpack: '🎒 Mochila',
  warehouseTotal: 'Total recolectado',
  warehouseHighest: 'Nivel más alto',
  warehouseLocked: '🔒',
  warehouseLockedName: '???',
  synthesisTitle: '⚗️ Síntesis',
  synthesisYouHave: (n) => `Tienes ${n}`,
  synthesisCanMake: (n, name) => `Puedes hacer ${n} ${name}`,
  synthesisNotEnough: 'No es suficiente',
  synthesisSynthesize: 'Sintetizar',
  synthesisSynthesizeAll: 'Sintetizar todo',
  synthesisSuccess: (name) => `¡Éxito! Obtuviste ${name}`,
  warehouseEmpty: 'Tu cobertizo está vacío — ¡empieza a enfocarte! 🍉',
  stageNameSeed: 'Brote',
  stageNameSprout: 'Retoño',
  stageNameBloom: 'Florecita',
  stageNameGreen: 'Sandía verde',
  stageNameRipe: 'Sandía',
  stageNameLegendary: 'Sandía Dorada',
  legendaryUnlocked: 'Desbloqueado',

  // Anti-AFK & Health
  overtimeNoReward: 'Demasiado tiempo extra — sin recompensa esta vez ⏰',
  healthReminder: 'Las sesiones largas no cambian automáticamente a descanso — recuerda descansar cuando termine 🧘',

  // Settings
  settings: 'Ajustes',
  timerRunningHint: '⏳ El temporizador está en marcha — ajusta cuando se detenga',
  workDuration: 'Enfoque',
  shortBreak: 'Descanso',
  autoStartBreak: 'Iniciar descanso automáticamente',
  autoStartWork: 'Iniciar enfoque automáticamente',

  // Alert sound
  alertSound: 'Sonido de alerta',
  alertRepeatCount: 'Repeticiones',
  alertVolume: 'Volumen de alerta',
  alertCustomize: 'Personalizar',
  repeatTimes: (n: number) => n === 0 ? 'Bucle' : `${n}×`,

  // Ambience
  focusAmbience: 'Ambiente de enfoque',
  ambienceVolume: 'Volumen ambiente',
  ambienceCustomize: 'Personalizar',
  ambienceOff: 'Apagado',
  ambienceCategoryNature: '🌧️ Naturaleza',
  ambienceCategoryEnvironment: '🏠 Entorno',
  ambienceCategoryNoise: '🎵 Ruido',
  ambienceCategoryClock: '🕐 Reloj',

  // Ambience sound names
  ambienceNames: {
    rain: 'Lluvia',
    thunderstorm: 'Tormenta',
    ocean: 'Olas del mar',
    stream: 'Arroyo',
    birds: 'Pájaros',
    wind: 'Viento',
    crickets: 'Grillos',
    cafe: 'Cafetería',
    fireplace: 'Chimenea',
    keyboard: 'Teclado',
    library: 'Biblioteca',
    whiteNoise: 'Ruido blanco',
    pinkNoise: 'Ruido rosa',
    brownNoise: 'Ruido marrón',
    binauralBeats: 'Beats binaurales',
    tickClassic: 'Péndulo clásico',
    tickSoft: 'Tic suave',
    tickMechanical: 'Mecánico',
    tickWooden: 'De madera',
    tickGrandfather: 'Reloj de pie',
    tickPocketWatch: 'Reloj de bolsillo',
    tickMetronome: 'Metrónomo',
    tickWaterDrop: 'Gota de agua',
    campfire: 'Fogata',
    softPiano: 'Piano suave',
    catPurr: 'Ronroneo de gato',
    night: 'Noche',
    train: 'Tren',
    underwater: 'Bajo el agua',
  },

  // Alert sound names
  alertNames: {
    chime: '🎵 Campanilla',
    bell: '🔔 Campana',
    nature: '🌿 Naturaleza',
    xylophone: '🎶 Xilófono',
    piano: '🎹 Piano',
    electronic: '⚡ Electrónico',
    waterdrop: '💧 Gota de agua',
    birdsong: '🐦 Canto de pájaro',
    marimba: '🪘 Marimba',
    gong: '🔊 Gong',
  },

  // Modal
  modalClose: 'Cerrar',
  modalDone: 'Listo',

  theme: 'Tema',
  language: 'Idioma',
  exportData: '📦 Exportar datos',
  minutes: 'min',
  seconds: 's',

  // Theme names
  themeDark: 'Oscuro',
  themeLight: 'Claro',
  themeForest: 'Bosque',
  themeOcean: 'Océano',
  themeWarm: 'Cálido',

  // Growth stages
  stageSeed: 'Brote',
  stageSprout: 'Retoño',
  stageBloom: 'Flor',
  stageGreen: 'Verde',
  stageRipe: 'Madura',

  // Guide
  guideTitle: '🍉 Cómo usar',
  guidePomodoro: 'Técnica Pomodoro',
  guidePomodoroDesc: 'Reloj Sandía usa la Técnica Pomodoro para ayudarte a concentrarte. Enfoque → Descanso → Enfoque → Descanso, un ciclo simple.',
  guideBasic: 'Primeros pasos',
  guideBasicItems: [
    'Toca play para empezar a enfocarte',
    'Pausa, completa antes o sal en cualquier momento',
    'Los descansos comienzan automáticamente después de cada sesión',
    'Toca los dígitos del temporizador para ajustar rápidamente la duración',
  ],
  guideGrowth: '🌱 Crecimiento de la sandía',
  guideGrowthDesc: 'Cuanto más te enfoques, más grande crece tu sandía:',
  guideGrowthStages: ['5–15 min · Brote', '16–25 min · Retoño', '26–45 min · Florecita', '46–60 min · Verde', '61–90 min · Madura'],
  guideSettings: '⚙️ Ajustes',
  guideSettingsDesc: 'Personaliza la duración de enfoque/descanso, inicio automático, sonidos de alerta, mezcla de ambiente, temas y exporta tus datos desde el ícono de engranaje.',
  guideStart: 'Empezar',

  // Install prompt
  installTitle: 'Instalar app',
  installDesc: 'Úsala como una app nativa',
  installButton: 'Instalar',

  // History panel
  historyTab: '📅 Historial',
  statsTab: '📊 Estadísticas',
  streakBanner: (days: number) => `🔥 Racha de ${days} días`,
  noRecords: 'Sin sesiones este día',
  today: 'Hoy',
  yesterday: 'Ayer',
  dateFormat: (m: number, d: number) => `${d}/${m}`,

  // Stats
  currentStreak: 'Racha actual',
  longestStreak: 'Racha más larga',
  focusTrend: 'Tendencia de enfoque',
  thisWeek: 'Esta semana',
  thisMonth: 'Este mes',
  totalTime: 'Todo el tiempo',
  totalCount: 'Total de sesiones',
  countUnit: (n: number) => `${n}`,

  // Time formatting
  formatMinutes: (mins: number) => {
    if (mins < 60) return `${mins}min`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m > 0 ? `${h}h ${m}min` : `${h}h`;
  },

  // Weekdays (Mon-Sun)
  weekdays: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
  weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],

  // Month nav
  monthFormat: (year: number, month: number) => `${month}/${year}`,

  // ─── Project mode ───
  modePomodoro: 'Pomodoro',
  modeProject: 'Proyecto',

  // Setup
  projectNamePlaceholder: 'Nombre del proyecto',
  projectTasks: 'Tareas',
  projectTaskPlaceholder: 'Nombre de la tarea',
  projectAddTask: 'Añadir tarea',
  projectEstimatedTotal: 'Total estimado',
  projectBreakTotal: 'descansos',
  projectCancel: 'Cancelar',
  projectStart: 'Iniciar',

  // Execution
  projectCurrentTask: 'Tarea',
  projectBreakTime: 'Hora de descanso',
  projectOvertime: 'Tiempo extra',
  projectEstimated: 'Est.',
  projectContinue: 'Continuar',
  projectMarkDone: 'Hecho',
  projectPause: 'Pausar',
  projectResume: 'Reanudar',
  projectTaskList: 'Tareas',
  projectInsertTask: 'Insertar tarea',
  projectInsert: 'Insertar',
  projectAbandon: 'Abandonar proyecto',
  projectAbandonConfirm: '¿Abandonar? Se perderá el progreso.',
  projectAbandonYes: 'Confirmar',

  // Summary
  projectComplete: '¡Proyecto completado!',
  projectTotalEstimated: 'Estimado',
  projectTotalActual: 'Real',
  projectAheadOfSchedule: 'Adelantado por',
  projectBehindSchedule: 'Retrasado por',
  projectTaskBreakdown: 'Desglose de tareas',
  projectCompleted: 'completada',
  projectSkipped: 'omitida',
  projectDone: 'Listo',

  // Confirm modal
  confirmExitTitle: '¿Salir de esta sesión?',
  confirmExitMessage: 'El progreso se marcará como incompleto',
  confirm: 'Salir',
  cancel: 'Cancelar',

  // Default task name
  defaultTaskName: (n: number) => `Enfoque #${n}`,

  // Project exit modal
  projectExitConfirmTitle: '¿Salir de la tarea actual?',
  projectExitConfirm: 'Salir de tarea',
  projectExitAll: 'Salir del proyecto',
  projectExitChooseTitle: '¿Qué sigue?',
  projectExitRestart: 'Reiniciar esta tarea',
  projectExitNext: 'Siguiente tarea',
  projectExitPrevious: 'Volver a la anterior (Tiempo extra)',
  projectExitFinish: 'Terminar proyecto',
  projectAbandoned: 'abandonada',
  projectOvertimeContinued: 'tiempo extra',

  // Recovery
  projectRecoveryTitle: 'Proyecto sin terminar encontrado',
  projectRecoveryDesc: 'Tienes un proyecto sin terminar. ¿Reanudar?',
  projectRecoveryResume: 'Reanudar',
  projectRecoveryDiscard: 'Empezar de nuevo',

  // History
  projectHistory: 'Proyectos',
  projectHistoryEstimated: 'Est.',
  projectHistoryActual: 'Real',

  // Settings section headers
  sectionTimer: '⏱ TEMPORIZADOR',
  sectionAlerts: '🔔 ALERTAS',
  sectionAppearance: '🎨 APARIENCIA',
  sectionGeneral: '⚙ GENERAL',

  // Empty state
  emptyTodayHint: 'Sin registros hoy todavía',

  // Guide in settings
  settingsGuide: 'Guía de uso',

  // Encouragement banner
  encourageEmpty: [
    'Cultiva tu sandía, cultiva tu enfoque 🍉',
    '¿Listo para plantar tu primera sandía? 🌱',
    'Tu campo de sandías te espera 🍉',
  ],
  encourageFirst: [
    'Tu sandía está creciendo 🌱',
    '¡Primera sandía plantada, sigue así!',
    'Enfócate y déjala madurar 🍉',
  ],
  encourageSecond: [
    '¡Sigue así! 2 sandías cosechadas',
    'Segunda sandía lista, genial 👍',
    'Tu campo de sandías crece 🍉',
  ],
  encourageThird: [
    '¡La sandía de hoy sabe extra dulce! 🍉',
    '3 sandías, ¡qué cosecha!',
    'Tu campo de sandías prospera 🌱',
  ],
  encourageMany: [
    '{n} sandías cosechadas — ¡lo estás aplastando!',
    '{n} sandías, ¡qué día! 🔥',
    '{n} sandías, ¡cosecha imparable! 🍉',
  ],
  encourageBeatYesterday: (count, diff) => `${count} hechas, ${diff} más que ayer 💪`,
  encourageTiedYesterday: (count) => `${count} hechas, igual que ayer`,
  streakShort: (days) => `🔥 Racha de ${days} días`,
  streakMedium: (days) => `🔥 Racha de ${days} días, creando un hábito`,
  streakLong: (days) => `🔥 ¡Racha de ${days} días! ¡Increíble!`,

  // Week trend chart
  weekTrend: 'Esta semana',
  weekTotal: (time) => `Total: ${time}`,

  // Long-press buttons
  holdToFinish: 'Mantén para terminar antes',
  holdToGiveUp: 'Mantén para abandonar',

  // Auth
  authTitle: 'Iniciar sesión',
  authEmailPlaceholder: 'Ingresa tu correo',
  authSendCode: 'Enviar código',
  authSendFailed: 'Error al enviar, intenta de nuevo',
  authVerifyFailed: 'Código inválido o expirado',
  authOr: 'o',
  authGoogle: 'Continuar con Google',
  authMicrosoft: 'Continuar con Microsoft',
  authLoginToSync: 'Inicia sesión para sincronizar datos',
  authLogout: 'Cerrar sesión',

  // Profile editing
  profileEditName: 'Editar nombre',
  profileSaving: 'Guardando...',
  profileUploadAvatar: 'Cambiar avatar',

  // Achievements (v0.17.0)
  achievementsTitle: '🏆 Achievements',
  achievementsButton: '🏆 Achievements',
  achievementsProgress: (unlocked: number, total: number) => `Unlocked ${unlocked} / ${total}`,
  achievementsSeriesProgress: (unlocked: number, total: number) => `${unlocked} / ${total}`,
  achievementsUnlocked: 'Unlocked',
  achievementsLocked: 'Locked',
  achievementsHiddenLocked: '???',
  achievementsHiddenHint: 'This is a hidden achievement — keep exploring...',
  achievementsComingSoon: 'Coming Soon',
  achievementsUnlockedAt: (date: string) => `Unlocked on ${date}`,
  achievementsCondition: 'Condition',
  achievementsCurrentProgress: 'Progress',
  achievementsCelebrationTitle: 'Achievement Unlocked!',
  achievementsSeriesStreak: '⭐️ Streak',
  achievementsSeriesFocus: '⏱️ Focus',
  achievementsSeriesHouse: '🏠 Melon Shed',
  achievementsSeriesFarm: '🌱 Farm',
  achievementsSeriesHidden: '🌟 Hidden',

  // Slicing system
  sliceHint: 'Desliza para cortar la sandía 🔪',
  slicePerfect: '✨ ¡Corte perfecto!',
  sliceResult: '🍉 Resultado del corte',
  sliceGoldResult: '👑 Resultado sandía dorada',
  sliceSeedsObtained: (n) => `Semillas misteriosas ×${n}`,
  slicePerfectBonus: '+1 Bonus perfecto',
  sliceRare: 'Raro',
  sliceCollect: 'Recoger',
  sliceContinue: '🔪 Cortar siguiente',
  sliceButton: '🔪 Cortar',
  itemName: (id) => ({
    'starlight-fertilizer': '⚡ Fertilizante estelar',
    'supernova-bottle': '☀️ Botella supernova',
    'alien-flare': '🛸 Bengala alienígena',
    'thief-trap': '🪤 Trampa para ladrones',
    'star-telescope': '🔮 Telescopio estelar',
    'moonlight-dew': '🌙 Rocío lunar',
    'circus-tent': '🎪 Carpa circo sandía',
    'gene-modifier': '🧬 Modificador genético',
    'lullaby-record': '🎵 Nana de sandía',
  }[id] ?? id),
  itemFlavor: (id) => ({
    'starlight-fertilizer': 'Fertilizante misterioso de una galaxia lejana — huele a polvo de estrellas',
    'supernova-bottle': 'Contiene la energía explosiva de una micro supernova',
    'alien-flare': 'Grita "¡Aquí hay sandías!" al cosmos y reza por visitantes amigables',
    'thief-trap': 'Parece una sandía normal, pero en realidad es una jaula',
    'star-telescope': 'Se dice que es una reliquia de un observatorio alienígena',
    'moonlight-dew': 'Gotas de rocío misteriosas que solo se forman con luna llena',
    'circus-tent': 'Dejado por un circo alienígena de paso',
    'gene-modifier': 'Colección privada del Dr. Mutación',
    'lullaby-record': 'Una nana alienígena que hace crecer las sandías muy rápido',
  }[id] ?? ''),
  shedSeedsTitle: '🌰 Semillas misteriosas',
  shedSeedsCount: (n) => `×${n}`,
  shedGoFarm: 'Ir a la granja',
  shedFarmComingSoon: 'Granja próximamente',
  shedItemsTitle: '🎒 Objetos',
  shedNoItems: 'Sin objetos aún — ¡corta sandías!',
  shedSliceSection: '🔪 Cortar',
  shedTotalSliced: 'Total cortado',
  seedQualityLabel: (q) => ({ normal: 'Normal', epic: 'Épico', legendary: 'Legendario' }[q] ?? q),
  comboExpert: '🔪 ¡Experto cortador!',
  comboGod: '⚡ ¡Dios sandía!',

  tabFocus: 'Enfoque',
  tabWarehouse: 'Cobertizo',
  tabFarm: 'Granja',

  farmPlotsTab: 'Parcelas',
  farmCollectionTab: 'Colección',
  farmTodayFocus: (m) => `Hoy: ${m} min enfocado`,
  farmPlant: 'Plantar',
  farmHarvest: 'Cosechar',
  farmWithered: 'Marchita',
  farmClear: 'Limpiar',
  farmSelectGalaxy: 'Elegir galaxia',
  farmSelectSeed: 'Elegir semilla',
  farmSeedHint: 'Mayor calidad = más probabilidad de variedades raras',
  farmNoSeeds: '¡Aún no tienes semillas. Corta sandías para obtenerlas!',
  farmGoSlice: 'Ir a cortar 🔪',
  farmReveal: '¡Din! Es—',
  farmNewVariety: '¡Nueva variedad!',
  farmNewFlash: 'NEW',
  farmAlreadyCollected: 'Ya coleccionada',
  farmStage: (s) => ({ seed: 'Semilla', sprout: 'Brote', leaf: 'Hoja', flower: 'Flor', green: 'Verde', fruit: 'Fruto' }[s] ?? s),
  farmGrowthTime: (a, t) => `Crecido ${formatDuration(a)} / ${formatDuration(t)} necesarios`,
  farmRemainingTime: (r) => `Faltan ${formatDuration(r)}`,
  farmFocusBoostHint: 'Concéntrate para crecer más rápido ⚡',
  farmHelpTitle: '🌱 Reglas de la granja',
  farmHelpPlant: '🌱 Plantar: Elige galaxia y calidad de semilla para empezar a crecer',
  farmHelpGrow: '⏱️ Crecimiento: Las variedades puras tardan ~10000 min en madurar. El foco acelera (≤2 h: 10x, >2 h: 20x). El tiempo offline también cuenta',
  farmHelpHarvest: '🍉 Cosecha: Toca plantas maduras para recolectar variedades en tu álbum',
  farmHelpWither: '💀 Marchitar: Las plantas se marchitan tras 72 h de inactividad',
  farmHelpUnlock: '🔓 Desbloquear: Recolecta más variedades para abrir nuevas parcelas y galaxias',
  formatDuration,
  farmGoFarm: 'Ir a la granja 🌱',
  farmUnlockHint: (n) => `Recolecta ${n} variedades para desbloquear`,

  starJourneyTitle: '🚀 Viaje Estelar',
  collectionProgress: (c, t) => `${c}/${t} coleccionadas`,
  collectionLocked: 'Bloqueado',
  collectionUnlockHint: (id) => ({
    'thick-earth': 'Desbloqueada por defecto',
    fire: 'Colecciona 5 variedades de Tierra Densa para desbloquear',
    water: 'Colecciona 5 variedades de Fuego para desbloquear',
    wood: 'Colecciona 5 variedades de Agua para desbloquear',
    metal: 'Colecciona 5 variedades de Madera para desbloquear',
    rainbow: 'Próximamente',
    'dark-matter': 'Próximamente',
  }[id] ?? 'Próximamente'),
  galaxyName: (id) => ({
    'thick-earth': 'Tierra Densa',
    fire: 'Fuego',
    water: 'Agua',
    wood: 'Madera',
    metal: 'Metal',
    'rainbow': 'Arcoíris',
    'dark-matter': 'Materia Oscura',
  }[id] ?? id),
  varietyName: (id) => ({
    'jade-stripe': 'Raya de Jade',
    'black-pearl': 'Perla Negra',
    'honey-bomb': 'Bomba de Miel',
    'mini-round': 'Mini Redonda',
    'star-moon': 'Estrella-Luna',
    'golden-heart': 'Corazón Dorado',
    'ice-sugar-snow': 'Nieve Azucarada',
    'cube-melon': 'Melón Cubo',
    'lava-melon': 'Melón de Lava',
    'caramel-crack': 'Grieta de Caramelo',
    'charcoal-roast': 'Melón al Carbón',
    'flame-pattern': 'Patrón de Llama',
    'molten-core': 'Núcleo Fundido',
    'sun-stone': 'Piedra Solar',
    'ash-rebirth': 'Renacer de Ceniza',
    'phoenix-nirvana': 'Fénix Nirvana',
    'snow-velvet': 'Terciopelo de Nieve',
    'ice-crystal': 'Cristal de Hielo',
    'tidal-melon': 'Melón de Marea',
    'aurora-melon': 'Melón Aurora',
    'moonlight-melon': 'Melón Luz de Luna',
    'diamond-melon': 'Melón Diamante',
    'abyss-melon': 'Melón Abisal',
    permafrost: 'Melón Permafrost',
    'vine-melon': 'Melón Enredadera',
    'moss-melon': 'Melón Musgo',
    'mycelium-melon': 'Melón Micelio',
    'flower-whisper': 'Susurro Floral',
    'tree-ring': 'Anillo de Árbol',
    'world-tree': 'Melón Árbol del Mundo',
    'spirit-root': 'Raíz Espiritual',
    'all-spirit': 'Melón Todo-Espíritu',
    'golden-armor': 'Armadura Dorada',
    'copper-patina': 'Pátina de Cobre',
    'tinfoil-melon': 'Melón de Estaño',
    'galaxy-stripe': 'Raya Galáctica',
    'mercury-melon': 'Melón de Mercurio',
    'meteorite-melon': 'Melón Meteorito',
    'alloy-melon': 'Melón de Aleación',
    'eternal-melon': 'Melón Eterno',
  }[id] ?? id),
  varietyStory: (id) => ({
    'jade-stripe': 'Primer brote tras la explosión, con las marcas blancas del melón primordial.',
    'black-pearl': 'Nace en tierra negra profunda y guarda la esencia del planeta.',
    'honey-bomb': 'Encierra todo el azúcar del sol y explota de dulzura.',
    'mini-round': 'La gravedad ecuatorial lo vuelve una esfera pequeña perfecta.',
    'star-moon': 'Dos lunas dibujan estrellas y luna sobre su cáscara nocturna.',
    'golden-heart': 'Raíces en vetas de oro tiñen su pulpa de dorado brillante.',
    'ice-sugar-snow': 'Solo la nieve polar milenaria da este fruto blanco que se derrite.',
    'cube-melon': 'Fragmento cúbico primordial, único en genética en todo el cosmos.',
    'lava-melon': 'Crece junto al cráter con pulpa naranja que parece fluir.',
    'caramel-crack': 'El calor abre grietas y brota jugo dulce color caramelo.',
    'charcoal-roast': 'Se asa junto a respiraderos geotérmicos y deja aroma ahumado suave.',
    'flame-pattern': 'Fructifica en tormentas de fuego con vetas como llamas congeladas.',
    'molten-core': 'Su núcleo brillante guarda energía tomada del corazón del planeta.',
    'sun-stone': 'Absorbió fragmentos estelares y brilla incluso en oscuridad total.',
    'ash-rebirth': 'Solo brota en ceniza volcánica y renace tras la destrucción.',
    'phoenix-nirvana': 'La leyenda dice que el fuego fénix dejó semillas eternas.',
    'snow-velvet': 'Una capa de escarcha cubre su piel y la deja helada.',
    'ice-crystal': 'En grietas glaciares forma cáscara translúcida con pulpa azulada.',
    'tidal-melon': 'Sus vetas se mueven al ritmo de las mareas bajo el hielo.',
    'aurora-melon': 'El magnetismo polar pinta su piel con colores de aurora.',
    'moonlight-melon': 'Madura en noche polar y brilla plateado como la luna.',
    'diamond-melon': 'La presión extrema crea cristales naturales más raros que diamantes.',
    'abyss-melon': 'Desde el mar helado más profundo emite una luz azul fría.',
    permafrost: 'Ni a menos 200 grados este descendiente llega a congelarse.',
    'vine-melon': 'Sus lianas vivas crecen solas y abrazan cualquier soporte.',
    'moss-melon': 'El musgo espeso lo camufla por completo en el bosque.',
    'mycelium-melon': 'Sus raíces se unen al micelio y sienten todo el bosque.',
    'flower-whisper': 'Sus flores envían mensajes en aroma y revelan su ánimo.',
    'tree-ring': 'Cada anillo de su pulpa guarda la historia de una estación.',
    'world-tree': 'Solo madura en la copa más alta del Árbol del Mundo.',
    'spirit-root': 'Raíces profundas beben vida planetaria y cada mordida suena a latido terrestre.',
    'all-spirit': 'Semilla del fragmento de madera primordial que permite oír toda vida.',
    'golden-armor': 'Su cáscara acorazada exige una hoja especial de aleación.',
    'copper-patina': 'La pátina verdosa imita mineral antiguo en lugar de envejecer.',
    'tinfoil-melon': 'Su cáscara fina como lámina resiste y suena a metal claro.',
    'galaxy-stripe': 'Las espirales galácticas nacen del campo magnético del planeta.',
    'mercury-melon': 'La pulpa fluye como mercurio y luego vuelve a reunirse.',
    'meteorite-melon': 'Crece en cráteres y absorbe calor metálico del espacio.',
    'alloy-melon': 'Trazas de metales raros la vuelven alimento valioso para mineros.',
    'eternal-melon': 'Forjado por eones en el núcleo, jamás se pudre.',
  }[id] ?? ''),
  varietyDetailTitle: 'Detalles de la variedad',
  varietyDetailFirstObtained: 'Primera obtención',
  varietyDetailHarvestCount: (count) => `Cosechada ${count} veces`,
  varietyDetailClose: 'Cerrar',
  geneLabTab: '🧬 Lab',
  geneLabTitle: 'Inventario genético',
  geneLabEmpty: 'Aún no tienes fragmentos genéticos. Cosecha variedades para obtenerlos.',
  geneLabFragments: 'Fragmentos genéticos',
  geneLabFragmentCount: (count) => `${count} fragmento${count !== 1 ? 's' : ''}`,
  geneLabVarietySource: 'Variedad de origen',
  geneLabObtainedAt: 'Obtenido',
  geneLabGalaxySection: (galaxyName, count) => `${galaxyName} · ${count} fragmento${count !== 1 ? 's' : ''}`,
  geneInjectTitle: 'Inyección genética',
  geneInjectDesc: 'Inyecta un fragmento genético en una semilla para apuntar a una galaxia específica',
  geneInjectSelectGalaxy: 'Seleccionar gen de galaxia',
  geneInjectSelectSeed: 'Seleccionar calidad de semilla',
  geneInjectButton: '🧬 Inyectar',
  geneInjectSuccess: '¡Inyección exitosa! Semilla inyectada obtenida',
  geneInjectNoFragments: 'Sin fragmentos genéticos',
  geneInjectNoSeeds: 'Sin semillas',
  geneInjectCost: 'Costo: 1 fragmento genético + 1 semilla',
  injectedSeedLabel: (galaxyName) => `🧬 Semilla inyectada (${galaxyName})`,
  injectedSeedHint: 'Semilla inyectada: 80% de probabilidad de variedad de la galaxia objetivo',
};
