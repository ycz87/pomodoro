import type { Messages } from '../types';

/** English translations */
export const en: Messages = {
  // App
  appName: 'Watermelon Clock',
  appNameShort: 'WM Clock',

  // Timer phases
  phaseWork: '🍉 Focus',
  phaseShortBreak: '☕ Short Break',
  phaseLongBreak: '🌙 Long Break',

  // Timer controls
  abandon: 'Give Up',
  quickTimeHint: 'Tap to adjust duration',

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
  longBreakOver: '🌙 Long break over',
  longBreakOverBody: 'New round — ready to go?',

  // Celebration
  celebrationRipe: ['Amazing! 🎉', 'Well done! ✨', 'Perfect focus! 🔥', 'Keep it up! 💪'],
  celebrationShort: ['Nice! 👍', 'Done! ✨', 'Good start! 🌱'],

  // Settings
  settings: 'Settings',
  timerRunningHint: '⏳ Timer is running — adjust after it stops',
  workDuration: 'Focus',
  shortBreak: 'Short Break',
  longBreak: 'Long Break',
  longBreakInterval: 'Long Break Every',
  autoStartBreak: 'Auto-start Break',
  autoStartWork: 'Auto-start Work',

  // Alert sound
  alertSound: 'Alert Sound',
  alertRepeatCount: 'Repeat',
  alertVolume: 'Alert Volume',
  alertCustomize: 'Customize',
  repeatTimes: (n: number) => `${n}×`,

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
  stageSeed: 'Seed',
  stageSprout: 'Sprout',
  stageBloom: 'Bloom',
  stageGreen: 'Unripe',
  stageRipe: 'Ripe',

  // Guide
  guideTitle: '🍉 How to Use',
  guidePomodoro: 'Pomodoro Technique',
  guidePomodoroDesc: 'Watermelon Clock uses the Pomodoro Technique to help you stay focused. Work for 25 min → short break 5 min → repeat 4 rounds → long break 15 min.',
  guideBasic: 'Getting Started',
  guideBasicItems: [
    'Tap play to start focusing',
    'Pause or give up anytime',
    'Breaks start automatically after each session',
    'Tap the timer digits to quickly adjust duration',
  ],
  guideGrowth: '🌱 Watermelon Growth',
  guideGrowthDesc: 'The longer you focus, the bigger your watermelon grows:',
  guideGrowthStages: ['<10 min · Seed', '10–14 min · Sprout', '15–19 min · Bloom', '20–24 min · Unripe', '≥25 min · Ripe'],
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
};
