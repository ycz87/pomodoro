import type { Messages } from '../types';

/** 中文翻译 — 默认语言 */
export const zh: Messages = {
  // App
  appName: '西瓜时钟',
  appNameShort: '西瓜钟',

  // Timer phases
  phaseWork: '🍉 专注时间',
  phaseShortBreak: '☕ 休息一下',

  // Timer controls
  abandon: '放弃本次',
  quickTimeHint: '点击快速调整时长',
  toggleTimerMode: '点击切换正计时/倒计时',

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

  // Celebration
  celebrationRipe: ['太棒了！🎉', '干得漂亮！✨', '完美专注！🔥', '继续保持！💪'],
  celebrationShort: ['不错！👍', '完成了！✨', '好的开始！🌱'],

  // Settings
  settings: '设置',
  timerRunningHint: '⏳ 计时进行中，完成或重置后可调整',
  workDuration: '专注时长',
  shortBreak: '休息时长',
  autoStartBreak: '自动开始休息',
  autoStartWork: '自动开始工作',

  // Alert sound
  alertSound: '提醒音效',
  alertRepeatCount: '循环次数',
  alertVolume: '提醒音量',
  alertCustomize: '自定义',
  repeatTimes: (n: number) => n === 0 ? '持续' : `${n}次`,

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
    tickGrandfather: '老式座钟',
    tickPocketWatch: '怀表',
    tickMetronome: '电子节拍器',
    tickWaterDrop: '水滴计时',
    campfire: '篝火',
    softPiano: '轻音乐',
    catPurr: '猫咪呼噜',
    night: '夜晚',
    train: '火车',
    underwater: '水下',
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
  guidePomodoroDesc: '西瓜时钟采用番茄工作法（Pomodoro Technique）计时，帮助你高效专注。专注工作 → 休息 → 专注 → 休息，简单循环。',
  guideBasic: '基本操作',
  guideBasicItems: [
    '点击播放按钮开始专注',
    '计时中可暂停、提前完成或退出',
    '完成后自动进入休息',
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

  // ─── Project mode ───
  modePomodoro: '番茄钟',
  modeProject: '项目模式',

  // Setup
  projectNamePlaceholder: '项目名称',
  projectTasks: '子任务',
  projectTaskPlaceholder: '任务名称',
  projectAddTask: '添加子任务',
  projectEstimatedTotal: '预计总时间',
  projectBreakTotal: '休息',
  projectCancel: '取消',
  projectStart: '开始执行',

  // Execution
  projectCurrentTask: '当前任务',
  projectBreakTime: '休息时间',
  projectOvertime: '已超时',
  projectEstimated: '预计',
  projectContinue: '继续计时',
  projectMarkDone: '标记完成',
  projectPause: '暂停',
  projectResume: '继续',
  projectTaskList: '任务列表',
  projectInsertTask: '插入新任务',
  projectInsert: '插入',
  projectAbandon: '放弃项目',
  projectAbandonConfirm: '确定放弃？进度将丢失',
  projectAbandonYes: '确定',

  // Summary
  projectComplete: '项目完成！',
  projectTotalEstimated: '预计总时间',
  projectTotalActual: '实际总时间',
  projectAheadOfSchedule: '提前完成',
  projectBehindSchedule: '超出预期',
  projectTaskBreakdown: '任务明细',
  projectCompleted: '已完成',
  projectSkipped: '已跳过',
  projectDone: '完成',

  // Confirm modal
  confirmExitTitle: '退出本次专注？',
  confirmExitMessage: '当前进度将标记为未完成',
  confirm: '确认退出',
  cancel: '取消',

  // Default task name
  defaultTaskName: (n: number) => `专注 #${n}`,

  // Project exit modal
  projectExitConfirmTitle: '退出当前任务？',
  projectExitConfirm: '确认退出',
  projectExitAll: '退出整个项目',
  projectExitChooseTitle: '接下来做什么？',
  projectExitRestart: '重新开始本任务',
  projectExitNext: '下一个任务',
  projectExitPrevious: '返回上一个任务（超时继续）',
  projectExitFinish: '结束项目',
  projectAbandoned: '已退出',
  projectOvertimeContinued: '超时继续',

  // Recovery
  projectRecoveryTitle: '发现未完成的项目',
  projectRecoveryDesc: '上次有一个项目还没完成，要继续吗？',
  projectRecoveryResume: '恢复进度',
  projectRecoveryDiscard: '重新开始',

  // History
  projectHistory: '项目记录',
  projectHistoryEstimated: '预计',
  projectHistoryActual: '实际',

  // Settings section headers
  sectionTimer: '⏱ 计时',
  sectionAlerts: '🔔 提醒',
  sectionAppearance: '🎨 外观',
  sectionGeneral: '⚙ 通用',

  // Empty state
  emptyTodayHint: '今日尚无记录',

  // Guide in settings
  settingsGuide: '使用说明',

  // Encouragement banner
  encourageEmpty: [
    '新的一天，开始第一个番茄吧 🍉',
    '准备好了吗？开始专注吧',
    '今天也要加油哦 💪',
  ],
  encourageFirst: [
    '好的开始！第一个番茄完成 🍉',
    '今天的第一步，迈出去了！',
    '开局顺利，继续保持 ✨',
  ],
  encourageSecond: [
    '保持节奏！已完成 2 个',
    '第二个也拿下了，不错 👍',
    '节奏稳了，继续！',
  ],
  encourageThird: [
    '今天状态不错 💪',
    '3 个了，效率很高！',
    '越来越顺了，继续加油',
  ],
  encourageMany: [
    '已完成 {n} 个，超过大多数人了！',
    '{n} 个番茄，今天太强了 🔥',
    '已完成 {n} 个，生产力爆表！',
  ],
  encourageBeatYesterday: (count, diff) => `已完成 ${count} 个，比昨天多了 ${diff} 个 💪`,
  encourageTiedYesterday: (count) => `已完成 ${count} 个，和昨天持平`,
  streakShort: (days) => `🔥 连续 ${days} 天`,
  streakMedium: (days) => `🔥 连续 ${days} 天，习惯正在养成`,
  streakLong: (days) => `🔥 连续 ${days} 天！了不起的坚持`,

  // Week trend chart
  weekTrend: '本周专注',
  weekTotal: (time) => `本周共 ${time}`,

  // Long-press buttons
  holdToFinish: '长按以提前完成',
  holdToGiveUp: '长按以放弃',
};
