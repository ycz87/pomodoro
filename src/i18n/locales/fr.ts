import type { Messages } from '../types';

/** Traductions françaises */
export const fr: Messages = {
  // App
  appName: 'Horloge Pastèque',
  appNameShort: 'Pastèque',

  // Timer phases
  phaseWork: '🍉 Concentration',
  phaseShortBreak: '☕ Pause',

  // Timer controls
  abandon: 'Abandonner',
  quickTimeHint: 'Appuyez pour ajuster la durée',
  toggleTimerMode: 'Appuyez pour basculer croissant/décroissant',

  // Task input
  taskPlaceholder: 'Sur quoi travaillez-vous ?',
  clearTask: 'Effacer',

  // Task list
  emptyTitle: 'Prêt à commencer ?',
  emptySubtitle: 'Lancez votre première session de concentration 🍉',
  todayRecords: "Sessions d'aujourd'hui",
  unnamed: 'Sans titre',
  editHint: 'Appuyez pour modifier',
  deleteConfirm: 'Sûr ?',

  // Today stats
  todayHarvest: "Récolte d'aujourd'hui",
  totalFocus: (time: string) => `Total : ${time}`,

  // Notifications
  workComplete: (emoji: string) => `${emoji} Session terminée !`,
  skipComplete: (emoji: string) => `${emoji} Terminée manuellement`,
  breakOver: '☕ Pause terminée',
  breakOverBody: 'Prêt pour la prochaine session ?',

  // Celebration
  celebrationRipe: ['Incroyable ! 🎉', 'Bien joué ! ✨', 'Concentration parfaite ! 🔥', 'Continuez ! 💪'],
  celebrationShort: ['Bien ! 👍', 'Fait ! ✨', 'Bon début ! 🌱'],

  // Per-stage celebration text (v0.7.1)
  celebrateSeed: [
    'Chaque pousse cache un champ de pastèques 🌱',
    'Un petit début, une grande possibilité ✨',
    'La pousse est entre vos mains',
    'Votre premier pas de concentration, accompli 🌱',
    'Une petite pousse, en attente de fleurir',
  ],
  celebrateSprout: [
    'Une pousse émerge — votre concentration prend racine 🌿',
    'Regardez, votre effort bourgeonne',
    'Continuez, ça deviendra quelque chose de magnifique 🌿',
    'Chaque minute de concentration est soleil et pluie',
    'La pousse est là, de bonnes choses arrivent 🌿',
  ],
  celebrateBloom: [
    'Une fleur s\'ouvre — le fruit peut-il être loin ? 🌼',
    'Ce n\'est pas qu\'une fleur qui éclot, c\'est votre concentration',
    'Petites fleurs écloses, de bonnes choses en vue 🌼',
    'Encore un peu et le fruit viendra',
    'Votre concentration est en fleur 🌼',
  ],
  celebrateGreen: [
    'La pastèque se forme — la récolte approche 🍈',
    'Si proche d\'une pastèque parfaite !',
    'Votre concentration a porté ses fruits 🍈',
    'Encore un peu la prochaine fois, et elle sera énorme !',
    'Le fruit de votre concentration se montre 🍈',
  ],
  celebrateRipe: [
    'Une pastèque parfaite ! Vous êtes incroyable 🍉🎉',
    'Cette pastèque est le fruit le plus doux de la concentration',
    'C\'est la récolte ! Vous méritez cette célébration 🍉',
    '25 minutes de concentration pour la plus douce récompense 🎉',
    'Grande récolte ! C\'est le pouvoir de la concentration 🍉',
  ],
  celebrateLegendary: [
    'La légendaire Pastèque Dorée ! Vous êtes un maître de la concentration 👑',
    'Gloire dorée ! Le plus grand honneur est vôtre 👑✨',
    'La Pastèque Dorée descend ! Gloire au roi de la concentration 🏆',
    '90 minutes de concentration profonde pour une récompense légendaire 👑',
    'Pastèque Dorée ! Le monde entier vous applaudit 🎉👑',
  ],

  // Warehouse & Synthesis
  warehouseTitle: '🏠 Mon Abri à Melons',
  warehouseTotal: 'Total collecté',
  warehouseHighest: 'Niveau le plus haut',
  warehouseLocked: '🔒',
  warehouseLockedName: '???',
  synthesisTitle: '⚗️ Synthèse',
  synthesisYouHave: (n) => `Vous en avez ${n}`,
  synthesisCanMake: (n, name) => `Peut faire ${n} ${name}`,
  synthesisNotEnough: 'Pas assez',
  synthesisSynthesize: 'Synthétiser',
  synthesisSynthesizeAll: 'Tout synthétiser',
  synthesisSuccess: (name) => `Succès ! Vous avez obtenu ${name}`,
  warehouseEmpty: 'Votre abri est vide — commencez à vous concentrer ! 🍉',
  stageNameSeed: 'Pousse',
  stageNameSprout: 'Germe',
  stageNameBloom: 'Petite fleur',
  stageNameGreen: 'Pastèque verte',
  stageNameRipe: 'Pastèque',
  stageNameLegendary: 'Pastèque Dorée',
  legendaryUnlocked: 'Débloqué',

  // Anti-AFK & Health
  overtimeNoReward: 'Trop de temps supplémentaire — pas de récompense cette fois ⏰',
  healthReminder: 'Les sessions longues ne passent pas automatiquement en pause — pensez à vous reposer quand le temps est écoulé 🧘',

  // Settings
  settings: 'Paramètres',
  timerRunningHint: '⏳ Le minuteur est en marche — ajustez après l\'arrêt',
  workDuration: 'Concentration',
  shortBreak: 'Pause',
  autoStartBreak: 'Démarrer la pause automatiquement',
  autoStartWork: 'Démarrer la concentration automatiquement',

  // Alert sound
  alertSound: 'Son d\'alerte',
  alertRepeatCount: 'Répétitions',
  alertVolume: 'Volume d\'alerte',
  alertCustomize: 'Personnaliser',
  repeatTimes: (n: number) => n === 0 ? 'Boucle' : `${n}×`,

  // Ambience
  focusAmbience: 'Ambiance de concentration',
  ambienceVolume: 'Volume ambiance',
  ambienceCustomize: 'Personnaliser',
  ambienceOff: 'Désactivé',
  ambienceCategoryNature: '🌧️ Nature',
  ambienceCategoryEnvironment: '🏠 Environnement',
  ambienceCategoryNoise: '🎵 Bruit',
  ambienceCategoryClock: '🕐 Horloge',

  // Ambience sound names
  ambienceNames: {
    rain: 'Pluie',
    thunderstorm: 'Orage',
    ocean: 'Vagues',
    stream: 'Ruisseau',
    birds: 'Oiseaux',
    wind: 'Vent',
    crickets: 'Grillons',
    cafe: 'Café',
    fireplace: 'Cheminée',
    keyboard: 'Clavier',
    library: 'Bibliothèque',
    whiteNoise: 'Bruit blanc',
    pinkNoise: 'Bruit rose',
    brownNoise: 'Bruit brun',
    binauralBeats: 'Battements binauraux',
    tickClassic: 'Pendule classique',
    tickSoft: 'Tic doux',
    tickMechanical: 'Mécanique',
    tickWooden: 'En bois',
    tickGrandfather: 'Horloge comtoise',
    tickPocketWatch: 'Montre à gousset',
    tickMetronome: 'Métronome',
    tickWaterDrop: 'Goutte d\'eau',
    campfire: 'Feu de camp',
    softPiano: 'Piano doux',
    catPurr: 'Ronronnement de chat',
    night: 'Nuit',
    train: 'Train',
    underwater: 'Sous l\'eau',
  },

  // Alert sound names
  alertNames: {
    chime: '🎵 Carillon',
    bell: '🔔 Cloche',
    nature: '🌿 Nature',
    xylophone: '🎶 Xylophone',
    piano: '🎹 Piano',
    electronic: '⚡ Électronique',
    waterdrop: '💧 Goutte d\'eau',
    birdsong: '🐦 Chant d\'oiseau',
    marimba: '🪘 Marimba',
    gong: '🔊 Gong',
  },

  // Modal
  modalClose: 'Fermer',
  modalDone: 'Terminé',

  theme: 'Thème',
  language: 'Langue',
  exportData: '📦 Exporter les données',
  minutes: 'min',
  seconds: 's',

  // Theme names
  themeDark: 'Sombre',
  themeLight: 'Clair',
  themeForest: 'Forêt',
  themeOcean: 'Océan',
  themeWarm: 'Chaleureux',

  // Growth stages
  stageSeed: 'Pousse',
  stageSprout: 'Germe',
  stageBloom: 'Fleur',
  stageGreen: 'Verte',
  stageRipe: 'Mûre',

  // Guide
  guideTitle: '🍉 Comment utiliser',
  guidePomodoro: 'Technique Pomodoro',
  guidePomodoroDesc: 'L\'Horloge Pastèque utilise la Technique Pomodoro pour vous aider à rester concentré. Concentration → Pause → Concentration → Pause, un cycle simple.',
  guideBasic: 'Pour commencer',
  guideBasicItems: [
    'Appuyez sur play pour commencer à vous concentrer',
    'Mettez en pause, terminez tôt ou quittez à tout moment',
    'Les pauses commencent automatiquement après chaque session',
    'Appuyez sur les chiffres du minuteur pour ajuster rapidement la durée',
  ],
  guideGrowth: '🌱 Croissance de la pastèque',
  guideGrowthDesc: 'Plus vous vous concentrez, plus votre pastèque grandit :',
  guideGrowthStages: ['5–15 min · Pousse', '16–25 min · Germe', '26–45 min · Petite fleur', '46–60 min · Verte', '61–90 min · Mûre'],
  guideSettings: '⚙️ Paramètres',
  guideSettingsDesc: 'Personnalisez les durées de concentration/pause, le démarrage automatique, les sons d\'alerte, le mixeur d\'ambiance, les thèmes et exportez vos données depuis l\'icône d\'engrenage.',
  guideStart: 'Commencer',

  // Install prompt
  installTitle: 'Installer l\'app',
  installDesc: 'Utilisez-la comme une app native',
  installButton: 'Installer',

  // History panel
  historyTab: '📅 Historique',
  statsTab: '📊 Statistiques',
  streakBanner: (days: number) => `🔥 Série de ${days} jours`,
  noRecords: 'Aucune session ce jour',
  today: "Aujourd'hui",
  yesterday: 'Hier',
  dateFormat: (m: number, d: number) => `${d}/${m}`,

  // Stats
  currentStreak: 'Série actuelle',
  longestStreak: 'Plus longue série',
  focusTrend: 'Tendance de concentration',
  thisWeek: 'Cette semaine',
  thisMonth: 'Ce mois',
  totalTime: 'Tout le temps',
  totalCount: 'Total des sessions',
  countUnit: (n: number) => `${n}`,

  // Time formatting
  formatMinutes: (mins: number) => {
    if (mins < 60) return `${mins}min`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m > 0 ? `${h}h ${m}min` : `${h}h`;
  },

  // Weekdays (Mon-Sun)
  weekdays: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
  weekdaysShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],

  // Month nav
  monthFormat: (year: number, month: number) => `${month}/${year}`,

  // ─── Project mode ───
  modePomodoro: 'Pomodoro',
  modeProject: 'Projet',

  // Setup
  projectNamePlaceholder: 'Nom du projet',
  projectTasks: 'Tâches',
  projectTaskPlaceholder: 'Nom de la tâche',
  projectAddTask: 'Ajouter une tâche',
  projectEstimatedTotal: 'Total estimé',
  projectBreakTotal: 'pauses',
  projectCancel: 'Annuler',
  projectStart: 'Démarrer',

  // Execution
  projectCurrentTask: 'Tâche',
  projectBreakTime: 'Temps de pause',
  projectOvertime: 'Temps supplémentaire',
  projectEstimated: 'Est.',
  projectContinue: 'Continuer',
  projectMarkDone: 'Terminé',
  projectPause: 'Pause',
  projectResume: 'Reprendre',
  projectTaskList: 'Tâches',
  projectInsertTask: 'Insérer une tâche',
  projectInsert: 'Insérer',
  projectAbandon: 'Abandonner le projet',
  projectAbandonConfirm: 'Abandonner ? La progression sera perdue.',
  projectAbandonYes: 'Confirmer',

  // Summary
  projectComplete: 'Projet terminé !',
  projectTotalEstimated: 'Estimé',
  projectTotalActual: 'Réel',
  projectAheadOfSchedule: 'En avance de',
  projectBehindSchedule: 'En retard de',
  projectTaskBreakdown: 'Détail des tâches',
  projectCompleted: 'terminée',
  projectSkipped: 'ignorée',
  projectDone: 'Terminé',

  // Confirm modal
  confirmExitTitle: 'Quitter cette session ?',
  confirmExitMessage: 'La progression sera marquée comme incomplète',
  confirm: 'Quitter',
  cancel: 'Annuler',

  // Default task name
  defaultTaskName: (n: number) => `Concentration #${n}`,

  // Project exit modal
  projectExitConfirmTitle: 'Quitter la tâche en cours ?',
  projectExitConfirm: 'Quitter la tâche',
  projectExitAll: 'Quitter le projet',
  projectExitChooseTitle: 'Que faire ensuite ?',
  projectExitRestart: 'Recommencer cette tâche',
  projectExitNext: 'Tâche suivante',
  projectExitPrevious: 'Revenir à la précédente (Temps supp.)',
  projectExitFinish: 'Terminer le projet',
  projectAbandoned: 'abandonnée',
  projectOvertimeContinued: 'temps supplémentaire',

  // Recovery
  projectRecoveryTitle: 'Projet inachevé trouvé',
  projectRecoveryDesc: 'Vous avez un projet inachevé. Reprendre ?',
  projectRecoveryResume: 'Reprendre',
  projectRecoveryDiscard: 'Recommencer',

  // History
  projectHistory: 'Projets',
  projectHistoryEstimated: 'Est.',
  projectHistoryActual: 'Réel',

  // Settings section headers
  sectionTimer: '⏱ MINUTEUR',
  sectionAlerts: '🔔 ALERTES',
  sectionAppearance: '🎨 APPARENCE',
  sectionGeneral: '⚙ GÉNÉRAL',

  // Empty state
  emptyTodayHint: "Pas encore d'enregistrements aujourd'hui",

  // Guide in settings
  settingsGuide: "Guide d'utilisation",

  // Encouragement banner
  encourageEmpty: [
    'Cultivez votre pastèque, cultivez votre concentration 🍉',
    'Prêt à planter votre première pastèque ? 🌱',
    'Votre champ de pastèques vous attend 🍉',
  ],
  encourageFirst: [
    'Votre pastèque pousse 🌱',
    'Première pastèque plantée, continuez !',
    'Concentrez-vous et laissez-la mûrir 🍉',
  ],
  encourageSecond: [
    'Continuez ! 2 pastèques récoltées',
    'Deuxième pastèque prête, super 👍',
    'Votre champ de pastèques grandit 🍉',
  ],
  encourageThird: [
    "La pastèque d'aujourd'hui est extra sucrée ! 🍉",
    '3 pastèques, quelle récolte !',
    'Votre champ de pastèques prospère 🌱',
  ],
  encourageMany: [
    '{n} pastèques récoltées — vous assurez !',
    '{n} pastèques, quelle journée ! 🔥',
    '{n} pastèques, récolte inarrêtable ! 🍉',
  ],
  encourageBeatYesterday: (count, diff) => `${count} faites, ${diff} de plus qu'hier 💪`,
  encourageTiedYesterday: (count) => `${count} faites, comme hier`,
  streakShort: (days) => `🔥 Série de ${days} jours`,
  streakMedium: (days) => `🔥 Série de ${days} jours, une habitude se forme`,
  streakLong: (days) => `🔥 Série de ${days} jours ! Incroyable !`,

  // Week trend chart
  weekTrend: 'Cette semaine',
  weekTotal: (time) => `Total : ${time}`,

  // Long-press buttons
  holdToFinish: 'Maintenez pour terminer tôt',
  holdToGiveUp: 'Maintenez pour abandonner',

  // Auth
  authTitle: 'Connexion',
  authEmailPlaceholder: 'Entrez votre email',
  authSendCode: 'Envoyer le code',
  authSendFailed: "Échec de l'envoi, réessayez",
  authVerifyFailed: 'Code invalide ou expiré',
  authOr: 'ou',
  authGoogle: 'Continuer avec Google',
  authMicrosoft: 'Continuer avec Microsoft',
  authLoginToSync: 'Connectez-vous pour synchroniser vos données',
  authLogout: 'Déconnexion',

  // Profile editing
  profileEditName: 'Modifier le nom',
  profileSaving: 'Enregistrement...',
  profileUploadAvatar: "Changer l'avatar",

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
};
