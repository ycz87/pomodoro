import type { Messages } from '../types';

/** English translations */
export const en: Messages = {
  // App
  appName: 'Watermelon Clock',
  appNameShort: 'WM Clock',

  // Timer phases
  phaseWork: '🍉 Focus',
  phaseShortBreak: '☕ Break',

  // Timer controls
  abandon: 'Give Up',
  quickTimeHint: 'Tap to adjust duration',
  toggleTimerMode: 'Tap to toggle count up/down',

  // Task input
  taskPlaceholder: 'What are you working on?',
  clearTask: 'Clear',

  // Task list
  emptyTitle: 'Ready to go?',
  emptySubtitle: 'Start your first focus session 🍉',
  todayRecords: "Today's Sessions",
  unnamed: 'Untitled',
  editHint: 'Tap to edit',
  deleteConfirm: 'Sure?',

  // Today stats
  todayHarvest: "Today's Harvest",
  totalFocus: (time: string) => `Total: ${time}`,

  // Notifications
  workComplete: (emoji: string) => `${emoji} Session complete!`,
  skipComplete: (emoji: string) => `${emoji} Manually completed`,
  breakOver: '☕ Break over',
  breakOverBody: 'Ready for the next session?',

  // Celebration
  celebrationRipe: ['Amazing! 🎉', 'Well done! ✨', 'Perfect focus! 🔥', 'Keep it up! 💪'],
  celebrationShort: ['Nice! 👍', 'Done! ✨', 'Good start! 🌱'],

  // Per-stage celebration text (v0.7.1)
  celebrateSeed: [
    'Every sproutling holds a watermelon field 🌱',
    'A small start, a big possibility ✨',
    'The sproutling is in your hands now',
    'Your first step of focus, taken 🌱',
    'A tiny sproutling, waiting to bloom',
  ],
  celebrateSprout: [
    'A sprout breaks through — your focus is taking root 🌿',
    'Look, your effort is sprouting',
    'Keep going, it\'ll grow into something amazing 🌿',
    'Every minute of focus is sunshine and rain',
    'The sprout is here, good things are coming 🌿',
  ],
  celebrateBloom: [
    'A little flower blooms — can the fruit be far behind? 🌼',
    'Not just a flower blooming, but your focus too',
    'Little flowers in bloom, good things ahead 🌼',
    'Just a little more, and fruit will come',
    'Your focus is blooming 🌼',
  ],
  celebrateGreen: [
    'The melon is forming — harvest is near 🍈',
    'So close to a perfect watermelon!',
    'Your focus has borne fruit 🍈',
    'A little more next time, and it\'s a big one!',
    'The fruit of your focus is showing 🍈',
  ],
  celebrateRipe: [
    'A perfect watermelon! You\'re amazing 🍉🎉',
    'This melon is the sweetest fruit of focus',
    'Harvest time! You deserve this celebration 🍉',
    '25 minutes of focus for the sweetest reward 🎉',
    'Big harvest! This is the power of focus 🍉',
  ],
  celebrateLegendary: [
    'The legendary Golden Watermelon! You\'re a focus master 👑',
    'Golden glory! The highest honor is yours 👑✨',
    'The Golden Watermelon descends! All hail the focus king 🏆',
    '90 minutes of deep focus for a legendary reward 👑',
    'Golden Watermelon! The whole world applauds you 🎉👑',
  ],

  // Warehouse & Synthesis
  warehouseTitle: '🏠 My Melon Shed',
  warehouseTotal: 'Total Collected',
  warehouseHighest: 'Highest Tier',
  warehouseLocked: '🔒',
  warehouseLockedName: '???',
  synthesisTitle: '⚗️ Synthesis',
  synthesisYouHave: (n) => `You have ${n}`,
  synthesisCanMake: (n, name) => `Can make ${n} ${name}`,
  synthesisNotEnough: 'Not enough',
  synthesisSynthesize: 'Synthesize',
  synthesisSynthesizeAll: 'Synthesize All',
  synthesisSuccess: (name) => `Success! Got ${name}`,
  warehouseEmpty: 'Your shed is empty — start focusing! 🍉',
  stageNameSeed: 'Sproutling',
  stageNameSprout: 'Sprout',
  stageNameBloom: 'Little Flower',
  stageNameGreen: 'Unripe Melon',
  stageNameRipe: 'Watermelon',
  stageNameLegendary: 'Golden Melon',
  legendaryUnlocked: 'Unlocked',

  // Anti-AFK & Health
  overtimeNoReward: 'Overtime too long — no reward this time ⏰',
  healthReminder: 'Longer focus sessions won\'t auto-switch to break — remember to take a rest when time\'s up 🧘',

  // Settings
  settings: 'Settings',
  timerRunningHint: '⏳ Timer is running — adjust after it stops',
  workDuration: 'Focus',
  shortBreak: 'Break',
  autoStartBreak: 'Auto-start Break',
  autoStartWork: 'Auto-start Work',

  // Alert sound
  alertSound: 'Alert Sound',
  alertRepeatCount: 'Repeat',
  alertVolume: 'Alert Volume',
  alertCustomize: 'Customize',
  repeatTimes: (n: number) => n === 0 ? 'Loop' : `${n}×`,

  // Ambience
  focusAmbience: 'Focus Ambience',
  ambienceVolume: 'Ambience Volume',
  ambienceCustomize: 'Customize',
  ambienceOff: 'Off',
  ambienceCategoryNature: '🌧️ Nature',
  ambienceCategoryEnvironment: '🏠 Environment',
  ambienceCategoryNoise: '🎵 Noise',
  ambienceCategoryClock: '🕐 Clock',

  // Ambience sound names
  ambienceNames: {
    rain: 'Rain',
    thunderstorm: 'Thunderstorm',
    ocean: 'Ocean Waves',
    stream: 'Stream',
    birds: 'Birds',
    wind: 'Wind',
    crickets: 'Crickets',
    cafe: 'Café',
    fireplace: 'Fireplace',
    keyboard: 'Keyboard',
    library: 'Library',
    whiteNoise: 'White Noise',
    pinkNoise: 'Pink Noise',
    brownNoise: 'Brown Noise',
    binauralBeats: 'Binaural Beats',
    tickClassic: 'Classic Pendulum',
    tickSoft: 'Soft Tick',
    tickMechanical: 'Mechanical',
    tickWooden: 'Wooden',
    tickGrandfather: 'Grandfather Clock',
    tickPocketWatch: 'Pocket Watch',
    tickMetronome: 'Metronome',
    tickWaterDrop: 'Water Drop',
    campfire: 'Campfire',
    softPiano: 'Soft Piano',
    catPurr: 'Cat Purr',
    night: 'Night',
    train: 'Train',
    underwater: 'Underwater',
  },

  // Alert sound names
  alertNames: {
    chime: '🎵 Chime',
    bell: '🔔 Bell',
    nature: '🌿 Nature',
    xylophone: '🎶 Xylophone',
    piano: '🎹 Piano',
    electronic: '⚡ Electronic',
    waterdrop: '💧 Waterdrop',
    birdsong: '🐦 Birdsong',
    marimba: '🪘 Marimba',
    gong: '🔊 Gong',
  },

  // Modal
  modalClose: 'Close',
  modalDone: 'Done',

  theme: 'Theme',
  language: 'Language',
  exportData: '📦 Export Data',
  minutes: 'min',
  seconds: 's',

  // Theme names
  themeDark: 'Dark',
  themeLight: 'Light',
  themeForest: 'Forest',
  themeOcean: 'Ocean',
  themeWarm: 'Warm',

  // Growth stages
  stageSeed: 'Sproutling',
  stageSprout: 'Sprout',
  stageBloom: 'Bloom',
  stageGreen: 'Unripe',
  stageRipe: 'Ripe',

  // Guide
  guideTitle: '🍉 How to Use',
  guidePomodoro: 'Pomodoro Technique',
  guidePomodoroDesc: 'Watermelon Clock uses the Pomodoro Technique to help you stay focused. Focus → Break → Focus → Break, simple cycle.',
  guideBasic: 'Getting Started',
  guideBasicItems: [
    'Tap play to start focusing',
    'Pause, complete early, or exit anytime',
    'Breaks start automatically after each session',
    'Tap the timer digits to quickly adjust duration',
  ],
  guideGrowth: '🌱 Watermelon Growth',
  guideGrowthDesc: 'The longer you focus, the bigger your watermelon grows:',
  guideGrowthStages: ['5–15 min · Sproutling', '16–25 min · Sprout', '26–45 min · Little Flower', '46–60 min · Unripe', '61–90 min · Ripe'],
  guideSettings: '⚙️ Settings',
  guideSettingsDesc: 'Customize focus/break durations, auto-start, alert sounds, ambience mixer, themes, and export your data from the gear icon.',
  guideStart: 'Get Started',

  // Install prompt
  installTitle: 'Install App',
  installDesc: 'Use it like a native app',
  installButton: 'Install',

  // History panel
  historyTab: '📅 History',
  statsTab: '📊 Stats',
  streakBanner: (days: number) => `🔥 ${days}-day streak`,
  noRecords: 'No sessions this day',
  today: 'Today',
  yesterday: 'Yesterday',
  dateFormat: (m: number, d: number) => `${m}/${d}`,

  // Stats
  currentStreak: 'Current Streak',
  longestStreak: 'Longest Streak',
  focusTrend: 'Focus Trend',
  thisWeek: 'This Week',
  thisMonth: 'This Month',
  totalTime: 'All Time',
  totalCount: 'Total Sessions',
  countUnit: (n: number) => `${n}`,

  // Time formatting
  formatMinutes: (mins: number) => {
    if (mins < 60) return `${mins}m`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  },

  // Weekdays (Mon-Sun)
  weekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  weekdaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],

  // Month nav
  monthFormat: (year: number, month: number) => `${year}/${month}`,

  // ─── Project mode ───
  modePomodoro: 'Pomodoro',
  modeProject: 'Project',

  // Setup
  projectNamePlaceholder: 'Project name',
  projectTasks: 'Tasks',
  projectTaskPlaceholder: 'Task name',
  projectAddTask: 'Add task',
  projectEstimatedTotal: 'Estimated total',
  projectBreakTotal: 'breaks',
  projectCancel: 'Cancel',
  projectStart: 'Start',

  // Execution
  projectCurrentTask: 'Task',
  projectBreakTime: 'Break time',
  projectOvertime: 'Overtime',
  projectEstimated: 'Est.',
  projectContinue: 'Continue',
  projectMarkDone: 'Done',
  projectPause: 'Pause',
  projectResume: 'Resume',
  projectTaskList: 'Tasks',
  projectInsertTask: 'Insert task',
  projectInsert: 'Insert',
  projectAbandon: 'Abandon project',
  projectAbandonConfirm: 'Abandon? Progress will be lost.',
  projectAbandonYes: 'Confirm',

  // Summary
  projectComplete: 'Project Complete!',
  projectTotalEstimated: 'Estimated',
  projectTotalActual: 'Actual',
  projectAheadOfSchedule: 'Ahead by',
  projectBehindSchedule: 'Over by',
  projectTaskBreakdown: 'Task Breakdown',
  projectCompleted: 'completed',
  projectSkipped: 'skipped',
  projectDone: 'Done',

  // Confirm modal
  confirmExitTitle: 'Exit this session?',
  confirmExitMessage: 'Progress will be marked as incomplete',
  confirm: 'Exit',
  cancel: 'Cancel',

  // Default task name
  defaultTaskName: (n: number) => `Focus #${n}`,

  // Project exit modal
  projectExitConfirmTitle: 'Exit current task?',
  projectExitConfirm: 'Exit Task',
  projectExitAll: 'Exit Entire Project',
  projectExitChooseTitle: 'What next?',
  projectExitRestart: 'Restart This Task',
  projectExitNext: 'Next Task',
  projectExitPrevious: 'Back to Previous (Overtime)',
  projectExitFinish: 'Finish Project',
  projectAbandoned: 'abandoned',
  projectOvertimeContinued: 'overtime',

  // Recovery
  projectRecoveryTitle: 'Unfinished Project Found',
  projectRecoveryDesc: 'You have an unfinished project. Resume?',
  projectRecoveryResume: 'Resume',
  projectRecoveryDiscard: 'Start Fresh',

  // History
  projectHistory: 'Projects',
  projectHistoryEstimated: 'Est.',
  projectHistoryActual: 'Actual',

  // Settings section headers
  sectionTimer: '⏱ TIMER',
  sectionAlerts: '🔔 ALERTS',
  sectionAppearance: '🎨 APPEARANCE',
  sectionGeneral: '⚙ GENERAL',

  // Empty state
  emptyTodayHint: 'No records yet today',

  // Guide in settings
  settingsGuide: 'User Guide',

  // Encouragement banner
  encourageEmpty: [
    'Grow your watermelon, grow your focus 🍉',
    'Ready to plant your first melon? 🌱',
    'Your watermelon field awaits 🍉',
  ],
  encourageFirst: [
    'Your watermelon is growing 🌱',
    'First melon planted, keep going!',
    'Focus and let it ripen 🍉',
  ],
  encourageSecond: [
    'Keep it up! 2 melons harvested',
    'Second melon down, nice 👍',
    'Your melon patch is growing 🍉',
  ],
  encourageThird: [
    'Today\'s melon tastes extra sweet 🍉',
    '3 melons, what a harvest!',
    'Your melon patch is thriving 🌱',
  ],
  encourageMany: [
    '{n} melons harvested — you\'re crushing it!',
    '{n} melons, what a day 🔥',
    '{n} melons, unstoppable harvest! 🍉',
  ],
  encourageBeatYesterday: (count, diff) => `${count} done, ${diff} more than yesterday 💪`,
  encourageTiedYesterday: (count) => `${count} done, same as yesterday`,
  streakShort: (days) => `🔥 ${days}-day streak`,
  streakMedium: (days) => `🔥 ${days}-day streak, building a habit`,
  streakLong: (days) => `🔥 ${days}-day streak! Incredible!`,

  // Week trend chart
  weekTrend: 'This Week',
  weekTotal: (time) => `Total: ${time}`,

  // Long-press buttons
  holdToFinish: 'Hold to finish early',
  holdToGiveUp: 'Hold to give up',
};
