import type { Messages } from '../types';

/** 中文翻译 — 默认语言 */
export const zh: Messages = {
  // App
  appName: '西瓜时钟',
  appNameShort: '西瓜钟',

  // Timer phases
  phaseWork: '🍉 专注时间',
  phaseShortBreak: '☕ 休息一下',
  phaseLongBreak: '🌙 长休息',

  // Timer controls
  abandon: '放弃本次',
  quickTimeHint: '点击快速调整时长',

  // Task input
  taskPlaceholder: '这个西瓜钟要做什么？',
  clearTask: '清除',

  // Task list
  emptyTitle: '准备好了吗？',
  emptySubtitle: '开始你的第一个西瓜钟 🍉',
  todayRecords: '今日记录',
  unnamed: '未命名任务',
  editHint: '点击编辑',
  deleteConfirm: '确认?',

  // Today stats
  todayHarvest: '今日收获',
  totalFocus: (time: string) => `共专注 ${time}`,

  // Notifications
  workComplete: (emoji: string) => `${emoji} 西瓜钟完成！`,
  skipComplete: (emoji: string) => `${emoji} 手动完成`,
  breakOver: '☕ 休息结束',
  breakOverBody: '准备好开始下一个西瓜钟了吗？',
  longBreakOver: '🌙 长休息结束',
  longBreakOverBody: '新一轮开始，准备好了吗？',

  // Celebration
  celebrationRipe: ['太棒了！🎉', '干得漂亮！✨', '完美专注！🔥', '继续保持！💪'],
  celebrationShort: ['不错！👍', '完成了！✨', '好的开始！🌱'],

  // Settings
  settings: '设置',
  timerRunningHint: '⏳ 计时进行中，完成或重置后可调整',
  workDuration: '专注时长',
  shortBreak: '短休息',
  longBreak: '长休息',
  longBreakInterval: '长休息间隔',
  autoStartBreak: '自动开始休息',
  autoStartWork: '自动开始工作',

  // Alert sound
  alertSound: '提醒音效',
  alertRepeatCount: '循环次数',
  alertVolume: '提醒音量',
  alertCustomize: '自定义',
  repeatTimes: (n: number) => `${n}次`,

  // Ambience
  focusAmbience: '专注背景音',
  ambienceVolume: '背景音量',
  ambienceCustomize: '自定义',
  ambienceOff: '未开启',
  ambienceCategoryNature: '🌧️ 自然',
  ambienceCategoryEnvironment: '🏠 环境',
  ambienceCategoryNoise: '🎵 噪音',
  ambienceCategoryClock: '🕐 时钟',

  // Ambience sound names
  ambienceNames: {
    rain: '雨声',
    thunderstorm: '雷雨',
    ocean: '海浪',
    stream: '溪流',
    birds: '鸟鸣',
    wind: '风声',
    crickets: '虫鸣',
    cafe: '咖啡厅',
    fireplace: '壁炉',
    keyboard: '键盘敲击',
    library: '图书馆',
    whiteNoise: '白噪音',
    pinkNoise: '粉噪音',
    brownNoise: '棕噪音',
    binauralBeats: '双耳节拍',
    tickClassic: '经典钟摆',
    tickSoft: '轻柔滴答',
    tickMechanical: '机械钟表',
    tickWooden: '木质钟声',
  },

  // Alert sound names
  alertNames: {
    chime: '🎵 和弦',
    bell: '🔔 铃声',
    nature: '🌿 自然',
    xylophone: '🎶 木琴',
    piano: '🎹 钢琴',
    electronic: '⚡ 电子',
    waterdrop: '💧 水滴',
    birdsong: '🐦 鸟鸣',
    marimba: '🪘 马林巴',
    gong: '🔊 锣声',
  },

  // Modal
  modalClose: '关闭',
  modalDone: '完成',

  theme: '主题',
  language: '语言',
  exportData: '📦 导出数据',
  minutes: '分钟',
  seconds: '秒',

  // Theme names
  themeDark: '经典暗色',
  themeLight: '纯净亮色',
  themeForest: '森林绿',
  themeOcean: '海洋蓝',
  themeWarm: '暖橙色',

  // Growth stages
  stageSeed: '发芽',
  stageSprout: '幼苗',
  stageBloom: '开花',
  stageGreen: '青瓜',
  stageRipe: '成熟',

  // Guide
  guideTitle: '🍉 西瓜时钟使用指南',
  guidePomodoro: '番茄工作法',
  guidePomodoroDesc: '西瓜时钟采用番茄工作法（Pomodoro Technique）计时，帮助你高效专注。专注工作 25 分钟 → 短休息 5 分钟 → 重复 4 轮 → 长休息 15 分钟。',
  guideBasic: '基本操作',
  guideBasicItems: [
    '点击播放按钮开始专注',
    '计时中可暂停或放弃',
    '完成后自动进入休息，每 4 轮触发长休息',
    'idle 时点击时间数字可快速调整时长',
  ],
  guideGrowth: '🌱 西瓜生长',
  guideGrowthDesc: '专注时长越长，西瓜长得越好：',
  guideGrowthStages: ['<10分钟 · 种子发芽', '10-14分钟 · 幼苗生长', '15-19分钟 · 开花期', '20-24分钟 · 小西瓜', '≥25分钟 · 成熟西瓜'],
  guideSettings: '⚙️ 设置',
  guideSettingsDesc: '右上角齿轮可自定义：专注/休息时长、自动开始、提醒音效、背景音混音器、音量、主题配色、数据导出。',
  guideStart: '开始使用',

  // Install prompt
  installTitle: '安装到桌面',
  installDesc: '像 App 一样使用，体验更好',
  installButton: '安装',

  // History panel
  historyTab: '📅 历史',
  statsTab: '📊 统计',
  streakBanner: (days: number) => `🔥 已连续专注 ${days} 天`,
  noRecords: '这天没有记录',
  today: '今天',
  yesterday: '昨天',
  dateFormat: (m: number, d: number) => `${m}月${d}日`,

  // Stats
  currentStreak: '当前连续',
  longestStreak: '历史最长',
  focusTrend: '专注趋势',
  thisWeek: '本周',
  thisMonth: '本月',
  totalTime: '累计时长',
  totalCount: '累计完成',
  countUnit: (n: number) => `${n} 个`,

  // Time formatting
  formatMinutes: (mins: number) => {
    if (mins < 60) return `${mins}分钟`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m > 0 ? `${h}小时${m}分钟` : `${h}小时`;
  },

  // Weekdays (Mon-Sun)
  weekdays: ['一', '二', '三', '四', '五', '六', '日'],
  weekdaysShort: ['日', '一', '二', '三', '四', '五', '六'],

  // Month nav
  monthFormat: (year: number, month: number) => `${year}年${month}月`,
};
