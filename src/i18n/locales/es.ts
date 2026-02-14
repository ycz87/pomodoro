import type { Messages } from '../types';

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
  tabFocus: 'Enfoque',
  tabWarehouse: 'Cobertizo',
  tabFarm: 'Granja',
  farmComingSoon: 'Próximamente',
};
