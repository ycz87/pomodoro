import type { Messages } from '../types';

/** Traduções em português (Brasil) */
export const pt: Messages = {
  // App
  appName: 'Relógio Melancia',
  appNameShort: 'Melancia',

  // Timer phases
  phaseWork: '🍉 Foco',
  phaseShortBreak: '☕ Pausa',

  // Timer controls
  abandon: 'Desistir',
  quickTimeHint: 'Toque para ajustar a duração',
  toggleTimerMode: 'Toque para alternar crescente/decrescente',

  // Task input
  taskPlaceholder: 'No que você está trabalhando?',
  clearTask: 'Limpar',

  // Task list
  emptyTitle: 'Pronto para começar?',
  emptySubtitle: 'Comece sua primeira sessão de foco 🍉',
  todayRecords: 'Sessões de hoje',
  unnamed: 'Sem título',
  editHint: 'Toque para editar',
  deleteConfirm: 'Tem certeza?',

  // Today stats
  todayHarvest: 'Colheita de hoje',
  totalFocus: (time: string) => `Total: ${time}`,

  // Notifications
  workComplete: (emoji: string) => `${emoji} Sessão concluída!`,
  skipComplete: (emoji: string) => `${emoji} Concluída manualmente`,
  breakOver: '☕ Pausa encerrada',
  breakOverBody: 'Pronto para a próxima sessão?',

  // Celebration
  celebrationRipe: ['Incrível! 🎉', 'Muito bem! ✨', 'Foco perfeito! 🔥', 'Continue assim! 💪'],
  celebrationShort: ['Legal! 👍', 'Feito! ✨', 'Bom começo! 🌱'],

  // Per-stage celebration text (v0.7.1)
  celebrateSeed: [
    'Cada broto guarda um campo de melancias 🌱',
    'Um pequeno começo, uma grande possibilidade ✨',
    'O broto está nas suas mãos',
    'Seu primeiro passo de foco, dado 🌱',
    'Um pequeno broto, esperando florescer',
  ],
  celebrateSprout: [
    'Um broto emerge — seu foco está criando raízes 🌿',
    'Olha, seu esforço está brotando',
    'Continue, vai se tornar algo incrível 🌿',
    'Cada minuto de foco é sol e chuva',
    'O broto está aqui, coisas boas vêm por aí 🌿',
  ],
  celebrateBloom: [
    'Uma flor se abre — o fruto pode estar longe? 🌼',
    'Não é só uma flor que desabrocha, é seu foco também',
    'Flores abertas, coisas boas a caminho 🌼',
    'Mais um pouco e o fruto virá',
    'Seu foco está florescendo 🌼',
  ],
  celebrateGreen: [
    'A melancia está se formando — a colheita está perto 🍈',
    'Tão perto de uma melancia perfeita!',
    'Seu foco deu frutos 🍈',
    'Mais um pouco na próxima vez e será enorme!',
    'O fruto do seu foco está aparecendo 🍈',
  ],
  celebrateRipe: [
    'Uma melancia perfeita! Você é incrível 🍉🎉',
    'Essa melancia é o fruto mais doce do foco',
    'Hora da colheita! Você merece essa comemoração 🍉',
    '25 minutos de foco para a recompensa mais doce 🎉',
    'Grande colheita! Esse é o poder do foco 🍉',
  ],
  celebrateLegendary: [
    'A lendária Melancia Dourada! Você é um mestre do foco 👑',
    'Glória dourada! A maior honra é sua 👑✨',
    'A Melancia Dourada desce! Salve o rei do foco 🏆',
    '90 minutos de foco profundo para uma recompensa lendária 👑',
    'Melancia Dourada! O mundo inteiro te aplaude 🎉👑',
  ],

  // Warehouse & Synthesis
  warehouseTitle: '🏠 Meu Galpão de Melancias',
  warehouseTotal: 'Total coletado',
  warehouseHighest: 'Nível mais alto',
  warehouseLocked: '🔒',
  warehouseLockedName: '???',
  synthesisTitle: '⚗️ Síntese',
  synthesisYouHave: (n) => `Você tem ${n}`,
  synthesisCanMake: (n, name) => `Pode fazer ${n} ${name}`,
  synthesisNotEnough: 'Não é suficiente',
  synthesisSynthesize: 'Sintetizar',
  synthesisSynthesizeAll: 'Sintetizar tudo',
  synthesisSuccess: (name) => `Sucesso! Você obteve ${name}`,
  warehouseEmpty: 'Seu galpão está vazio — comece a focar! 🍉',
  stageNameSeed: 'Broto',
  stageNameSprout: 'Muda',
  stageNameBloom: 'Florzinha',
  stageNameGreen: 'Melancia verde',
  stageNameRipe: 'Melancia',
  stageNameLegendary: 'Melancia Dourada',
  legendaryUnlocked: 'Desbloqueado',

  // Anti-AFK & Health
  overtimeNoReward: 'Tempo extra demais — sem recompensa desta vez ⏰',
  healthReminder: 'Sessões longas não mudam automaticamente para pausa — lembre-se de descansar quando o tempo acabar 🧘',

  // Settings
  settings: 'Configurações',
  timerRunningHint: '⏳ O timer está rodando — ajuste depois que parar',
  workDuration: 'Foco',
  shortBreak: 'Pausa',
  autoStartBreak: 'Iniciar pausa automaticamente',
  autoStartWork: 'Iniciar foco automaticamente',

  // Alert sound
  alertSound: 'Som de alerta',
  alertRepeatCount: 'Repetições',
  alertVolume: 'Volume do alerta',
  alertCustomize: 'Personalizar',
  repeatTimes: (n: number) => n === 0 ? 'Loop' : `${n}×`,

  // Ambience
  focusAmbience: 'Ambiente de foco',
  ambienceVolume: 'Volume do ambiente',
  ambienceCustomize: 'Personalizar',
  ambienceOff: 'Desligado',
  ambienceCategoryNature: '🌧️ Natureza',
  ambienceCategoryEnvironment: '🏠 Ambiente',
  ambienceCategoryNoise: '🎵 Ruído',
  ambienceCategoryClock: '🕐 Relógio',

  // Ambience sound names
  ambienceNames: {
    rain: 'Chuva',
    thunderstorm: 'Tempestade',
    ocean: 'Ondas do mar',
    stream: 'Riacho',
    birds: 'Pássaros',
    wind: 'Vento',
    crickets: 'Grilos',
    cafe: 'Cafeteria',
    fireplace: 'Lareira',
    keyboard: 'Teclado',
    library: 'Biblioteca',
    whiteNoise: 'Ruído branco',
    pinkNoise: 'Ruído rosa',
    brownNoise: 'Ruído marrom',
    binauralBeats: 'Batidas binaurais',
    tickClassic: 'Pêndulo clássico',
    tickSoft: 'Tique suave',
    tickMechanical: 'Mecânico',
    tickWooden: 'De madeira',
    tickGrandfather: 'Relógio de pêndulo',
    tickPocketWatch: 'Relógio de bolso',
    tickMetronome: 'Metrônomo',
    tickWaterDrop: 'Gota d\'água',
    campfire: 'Fogueira',
    softPiano: 'Piano suave',
    catPurr: 'Ronronar de gato',
    night: 'Noite',
    train: 'Trem',
    underwater: 'Subaquático',
  },

  // Alert sound names
  alertNames: {
    chime: '🎵 Carrilhão',
    bell: '🔔 Sino',
    nature: '🌿 Natureza',
    xylophone: '🎶 Xilofone',
    piano: '🎹 Piano',
    electronic: '⚡ Eletrônico',
    waterdrop: '💧 Gota d\'água',
    birdsong: '🐦 Canto de pássaro',
    marimba: '🪘 Marimba',
    gong: '🔊 Gong',
  },

  // Modal
  modalClose: 'Fechar',
  modalDone: 'Pronto',

  theme: 'Tema',
  language: 'Idioma',
  exportData: '📦 Exportar dados',
  minutes: 'min',
  seconds: 's',

  // Theme names
  themeDark: 'Escuro',
  themeLight: 'Claro',
  themeForest: 'Floresta',
  themeOcean: 'Oceano',
  themeWarm: 'Quente',

  // Growth stages
  stageSeed: 'Broto',
  stageSprout: 'Muda',
  stageBloom: 'Flor',
  stageGreen: 'Verde',
  stageRipe: 'Madura',

  // Guide
  guideTitle: '🍉 Como usar',
  guidePomodoro: 'Técnica Pomodoro',
  guidePomodoroDesc: 'O Relógio Melancia usa a Técnica Pomodoro para ajudar você a manter o foco. Foco → Pausa → Foco → Pausa, um ciclo simples.',
  guideBasic: 'Primeiros passos',
  guideBasicItems: [
    'Toque em play para começar a focar',
    'Pause, conclua antes ou saia a qualquer momento',
    'As pausas começam automaticamente após cada sessão',
    'Toque nos dígitos do timer para ajustar rapidamente a duração',
  ],
  guideGrowth: '🌱 Crescimento da melancia',
  guideGrowthDesc: 'Quanto mais você foca, maior sua melancia cresce:',
  guideGrowthStages: ['5–15 min · Broto', '16–25 min · Muda', '26–45 min · Florzinha', '46–60 min · Verde', '61–90 min · Madura'],
  guideSettings: '⚙️ Configurações',
  guideSettingsDesc: 'Personalize a duração de foco/pausa, início automático, sons de alerta, mixer de ambiente, temas e exporte seus dados pelo ícone de engrenagem.',
  guideStart: 'Começar',

  // Install prompt
  installTitle: 'Instalar app',
  installDesc: 'Use como um app nativo',
  installButton: 'Instalar',

  // History panel
  historyTab: '📅 Histórico',
  statsTab: '📊 Estatísticas',
  streakBanner: (days: number) => `🔥 Sequência de ${days} dias`,
  noRecords: 'Sem sessões neste dia',
  today: 'Hoje',
  yesterday: 'Ontem',
  dateFormat: (m: number, d: number) => `${d}/${m}`,

  // Stats
  currentStreak: 'Sequência atual',
  longestStreak: 'Maior sequência',
  focusTrend: 'Tendência de foco',
  thisWeek: 'Esta semana',
  thisMonth: 'Este mês',
  totalTime: 'Todo o tempo',
  totalCount: 'Total de sessões',
  countUnit: (n: number) => `${n}`,

  // Time formatting
  formatMinutes: (mins: number) => {
    if (mins < 60) return `${mins}min`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m > 0 ? `${h}h ${m}min` : `${h}h`;
  },

  // Weekdays (Mon-Sun)
  weekdays: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
  weekdaysShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],

  // Month nav
  monthFormat: (year: number, month: number) => `${month}/${year}`,

  // ─── Project mode ───
  modePomodoro: 'Pomodoro',
  modeProject: 'Projeto',

  // Setup
  projectNamePlaceholder: 'Nome do projeto',
  projectTasks: 'Tarefas',
  projectTaskPlaceholder: 'Nome da tarefa',
  projectAddTask: 'Adicionar tarefa',
  projectEstimatedTotal: 'Total estimado',
  projectBreakTotal: 'pausas',
  projectCancel: 'Cancelar',
  projectStart: 'Iniciar',

  // Execution
  projectCurrentTask: 'Tarefa',
  projectBreakTime: 'Hora da pausa',
  projectOvertime: 'Hora extra',
  projectEstimated: 'Est.',
  projectContinue: 'Continuar',
  projectMarkDone: 'Concluído',
  projectPause: 'Pausar',
  projectResume: 'Retomar',
  projectTaskList: 'Tarefas',
  projectInsertTask: 'Inserir tarefa',
  projectInsert: 'Inserir',
  projectAbandon: 'Abandonar projeto',
  projectAbandonConfirm: 'Abandonar? O progresso será perdido.',
  projectAbandonYes: 'Confirmar',

  // Summary
  projectComplete: 'Projeto concluído!',
  projectTotalEstimated: 'Estimado',
  projectTotalActual: 'Real',
  projectAheadOfSchedule: 'Adiantado por',
  projectBehindSchedule: 'Atrasado por',
  projectTaskBreakdown: 'Detalhamento das tarefas',
  projectCompleted: 'concluída',
  projectSkipped: 'pulada',
  projectDone: 'Pronto',

  // Confirm modal
  confirmExitTitle: 'Sair desta sessão?',
  confirmExitMessage: 'O progresso será marcado como incompleto',
  confirm: 'Sair',
  cancel: 'Cancelar',

  // Default task name
  defaultTaskName: (n: number) => `Foco #${n}`,

  // Project exit modal
  projectExitConfirmTitle: 'Sair da tarefa atual?',
  projectExitConfirm: 'Sair da tarefa',
  projectExitAll: 'Sair do projeto inteiro',
  projectExitChooseTitle: 'O que fazer agora?',
  projectExitRestart: 'Reiniciar esta tarefa',
  projectExitNext: 'Próxima tarefa',
  projectExitPrevious: 'Voltar à anterior (Hora extra)',
  projectExitFinish: 'Finalizar projeto',
  projectAbandoned: 'abandonada',
  projectOvertimeContinued: 'hora extra',

  // Recovery
  projectRecoveryTitle: 'Projeto inacabado encontrado',
  projectRecoveryDesc: 'Você tem um projeto inacabado. Retomar?',
  projectRecoveryResume: 'Retomar',
  projectRecoveryDiscard: 'Começar do zero',

  // History
  projectHistory: 'Projetos',
  projectHistoryEstimated: 'Est.',
  projectHistoryActual: 'Real',

  // Settings section headers
  sectionTimer: '⏱ TIMER',
  sectionAlerts: '🔔 ALERTAS',
  sectionAppearance: '🎨 APARÊNCIA',
  sectionGeneral: '⚙ GERAL',

  // Empty state
  emptyTodayHint: 'Sem registros hoje ainda',

  // Guide in settings
  settingsGuide: 'Guia de uso',

  // Encouragement banner
  encourageEmpty: [
    'Cultive sua melancia, cultive seu foco 🍉',
    'Pronto para plantar sua primeira melancia? 🌱',
    'Seu campo de melancias te espera 🍉',
  ],
  encourageFirst: [
    'Sua melancia está crescendo 🌱',
    'Primeira melancia plantada, continue assim!',
    'Foque e deixe amadurecer 🍉',
  ],
  encourageSecond: [
    'Continue assim! 2 melancias colhidas',
    'Segunda melancia pronta, show 👍',
    'Seu campo de melancias está crescendo 🍉',
  ],
  encourageThird: [
    'A melancia de hoje está extra doce! 🍉',
    '3 melancias, que colheita!',
    'Seu campo de melancias está prosperando 🌱',
  ],
  encourageMany: [
    '{n} melancias colhidas — você está arrasando!',
    '{n} melancias, que dia! 🔥',
    '{n} melancias, colheita imparável! 🍉',
  ],
  encourageBeatYesterday: (count, diff) => `${count} feitas, ${diff} a mais que ontem 💪`,
  encourageTiedYesterday: (count) => `${count} feitas, igual a ontem`,
  streakShort: (days) => `🔥 Sequência de ${days} dias`,
  streakMedium: (days) => `🔥 Sequência de ${days} dias, criando um hábito`,
  streakLong: (days) => `🔥 Sequência de ${days} dias! Incrível!`,

  // Week trend chart
  weekTrend: 'Esta semana',
  weekTotal: (time) => `Total: ${time}`,

  // Long-press buttons
  holdToFinish: 'Segure para concluir antes',
  holdToGiveUp: 'Segure para desistir',

  // Auth
  authTitle: 'Entrar',
  authEmailPlaceholder: 'Digite seu email',
  authSendCode: 'Enviar código',
  authSendFailed: 'Falha ao enviar, tente novamente',
  authVerifyFailed: 'Código inválido ou expirado',
  authOr: 'ou',
  authGoogle: 'Continuar com Google',
  authMicrosoft: 'Continuar com Microsoft',
  authLoginToSync: 'Entre para sincronizar seus dados',
  authLogout: 'Sair',

  // Profile editing
  profileEditName: 'Editar nome',
  profileSaving: 'Salvando...',
  profileUploadAvatar: 'Trocar avatar',

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
