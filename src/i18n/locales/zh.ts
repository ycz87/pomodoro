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

  // Per-stage celebration text (v0.7.1)
  celebrateSeed: [
    '每一颗小芽，都藏着一片西瓜田 🌱',
    '小小的开始，大大的可能 ✨',
    '小芽已经在你手中，未来由你浇灌',
    '专注的第一步，已经迈出 🌱',
    '播下小芽，静待花开',
  ],
  celebrateSprout: [
    '小苗破土，专注正在生根 🌿',
    '看，你的努力已经发芽了',
    '坚持浇灌，它会长成参天大瓜 🌿',
    '每一分钟专注，都是阳光和雨露',
    '嫩芽已出，好事不远 🌿',
  ],
  celebrateBloom: [
    '小花开了，果实还会远吗？🌼',
    '绽放的不只是小花，还有你的专注力',
    '小花盛开，好事将近 🌼',
    '再多一点点，就能结出果实了',
    '你的专注，正在开花结果 🌼',
  ],
  celebrateGreen: [
    '青瓜已成形，大丰收就在眼前 🍈',
    '差一点点就是完美的西瓜了！',
    '你的专注已经结出了果实 🍈',
    '再坚持一下，下次就是大西瓜！',
    '果实累累，你的努力看得见 🍈',
  ],
  celebrateRipe: [
    '完美的大西瓜！你太棒了 🍉🎉',
    '这颗西瓜，是专注最甜的果实',
    '丰收时刻！你值得这份庆祝 🍉',
    '25 分钟的专注，换来最甜的西瓜 🎉',
    '大丰收！这就是专注的力量 🍉',
  ],
  celebrateLegendary: [
    '传说中的金西瓜！你是专注大师 👑',
    '金光闪闪！这是最高荣耀 👑✨',
    '金西瓜降临！专注之王就是你 🏆',
    '90 分钟的深度专注，换来传说级收获 👑',
    '金西瓜！全世界都在为你鼓掌 🎉👑',
  ],

  // Warehouse & Synthesis
  warehouseTitle: '🏠 我的瓜棚',
  warehouseTabShed: '🍉 瓜棚',
  warehouseTabBackpack: '🎒 背包',
  warehouseTotal: '总收获',
  warehouseHighest: '最高阶',
  warehouseLocked: '🔒',
  warehouseLockedName: '???',
  synthesisTitle: '⚗️ 合成',
  synthesisYouHave: (n) => `你有 ${n} 个`,
  synthesisCanMake: (n, name) => `可合成 ${n} 个${name}`,
  synthesisNotEnough: '数量不足',
  synthesisSynthesize: '合成',
  synthesisSynthesizeAll: '合成全部',
  synthesisSuccess: (name) => `合成成功！获得 ${name}`,
  warehouseEmpty: '瓜棚还是空的，开始专注吧 🍉',
  stageNameSeed: '小芽',
  stageNameSprout: '幼苗',
  stageNameBloom: '小花',
  stageNameGreen: '小瓜',
  stageNameRipe: '大西瓜',
  stageNameLegendary: '金西瓜',
  legendaryUnlocked: '已解锁',

  // Anti-AFK & Health
  overtimeNoReward: '超时太久，这次没有收获物 ⏰',
  healthReminder: '专注时间较长，不会自动进入休息～记得到点给自己放个假哦 🧘',

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
  themeDark: '西瓜色',
  themeLight: '亮红色',
  themeForest: '森林绿',
  themeOcean: '海洋蓝',
  themeWarm: '暖橙色',

  // Growth stages
  stageSeed: '小芽',
  stageSprout: '幼苗',
  stageBloom: '小花',
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
  guideGrowthStages: ['5-15分钟 · 小芽', '16-25分钟 · 幼苗', '26-45分钟 · 小花', '46-60分钟 · 小瓜', '61-90分钟 · 大西瓜'],
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
  modePomodoro: '番茄模式',
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
    '种一颗西瓜，收获专注 🍉',
    '你的西瓜正在等你浇灌 🌱',
    '专注浇灌，西瓜自然甜 🍉',
  ],
  encourageFirst: [
    '专注浇灌，西瓜自然甜 🍉',
    '第一颗西瓜种下了！',
    '你的西瓜正在成长中 🌱',
  ],
  encourageSecond: [
    '保持节奏！已收获 2 个西瓜',
    '第二颗也拿下了，不错 👍',
    '西瓜田越来越大了 🍉',
  ],
  encourageThird: [
    '今天的西瓜，格外甜 🍉',
    '3 颗西瓜，丰收的节奏！',
    '西瓜田生机勃勃 🌱',
  ],
  encourageMany: [
    '已收获 {n} 颗西瓜，超过大多数人了！',
    '{n} 颗西瓜，今天太强了 🔥',
    '已收获 {n} 颗，西瓜田大丰收！🍉',
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

  // Auth
  authTitle: '登录',
  authEmailPlaceholder: '输入邮箱地址',
  authSendCode: '发送验证码',
  authSendFailed: '发送失败，请稍后重试',
  authVerifyFailed: '验证码错误或已过期',
  authOr: '或',
  authGoogle: '使用 Google 登录',
  authMicrosoft: '使用 Microsoft 登录',
  authLoginToSync: '登录以同步数据',
  authLogout: '退出',

  // Profile editing
  profileEditName: '修改昵称',
  profileSaving: '保存中...',
  profileUploadAvatar: '更换头像',

  // Achievements (v0.17.0)
  achievementsTitle: '🏆 成就',
  achievementsButton: '🏆 成就',
  achievementsProgress: (unlocked, total) => `已解锁 ${unlocked} / ${total}`,
  achievementsSeriesProgress: (unlocked, total) => `${unlocked} / ${total}`,
  achievementsUnlocked: '已解锁',
  achievementsLocked: '未解锁',
  achievementsHiddenLocked: '???',
  achievementsHiddenHint: '这是一个隐藏成就，继续探索吧...',
  achievementsComingSoon: '即将开放',
  achievementsUnlockedAt: (date) => `解锁于 ${date}`,
  achievementsCondition: '解锁条件',
  achievementsCurrentProgress: '当前进度',
  achievementsCelebrationTitle: '成就解锁！',
  achievementsSeriesStreak: '⭐️ 坚持',
  achievementsSeriesFocus: '⏱️ 专注',
  achievementsSeriesHouse: '🏠 瓜棚',
  achievementsSeriesFarm: '🌱 农场',
  achievementsSeriesHidden: '🌟 隐藏',

  // Slicing system
  sliceHint: '滑动切开西瓜 🔪',
  slicePerfect: '✨ 完美切割！',
  sliceResult: '🍉 切瓜结果',
  sliceGoldResult: '👑 金西瓜切瓜结果',
  sliceSeedsObtained: (n) => `神秘种子 ×${n}`,
  slicePerfectBonus: '+1 完美奖励',
  sliceRare: '稀有',
  sliceCollect: '收下',
  sliceContinue: '🔪 继续切下一个',
  sliceButton: '🔪 切瓜',
  itemName: (id) => ({
    'starlight-fertilizer': '⚡ 星光肥料',
    'supernova-bottle': '☀️ 超新星能量瓶',
    'alien-flare': '🛸 外星信号弹',
    'thief-trap': '🪤 瓜贼陷阱',
    'star-telescope': '🔮 星际望远镜',
    'moonlight-dew': '🌙 月光露水',
    'circus-tent': '🎪 西瓜马戏团帐篷',
    'gene-modifier': '🧬 基因改造液',
    'lullaby-record': '🎵 西瓜摇篮曲唱片',
  }[id] ?? id),
  itemFlavor: (id) => ({
    'starlight-fertilizer': '来自遥远星系的神秘肥料，闻起来像星星的味道',
    'supernova-bottle': '装着一颗微型超新星的爆发能量',
    'alien-flare': '向宇宙喊一声"这里有瓜！"然后祈祷来的是好人',
    'thief-trap': '看起来像个普通西瓜，其实是个笼子',
    'star-telescope': '据说是外星天文台的遗物',
    'moonlight-dew': '只在满月时凝结的神秘露珠',
    'circus-tent': '外星马戏团路过时留下的，西瓜们在里面很开心',
    'gene-modifier': '变异博士的私人珍藏',
    'lullaby-record': '外星人录制的催眠曲，西瓜听了长得特别快',
  }[id] ?? ''),
  shedSeedsTitle: '🌰 神秘种子',
  shedSeedsCount: (n) => `×${n}`,
  shedGoFarm: '去农场种植',
  shedFarmComingSoon: '农场即将开放',
  shedItemsTitle: '🎒 道具',
  shedNoItems: '还没有道具，切瓜试试运气吧',
  shedSliceSection: '🔪 切瓜',
  shedTotalSliced: '总切瓜数',
  seedQualityLabel: (q) => ({ normal: '普通', epic: '史诗', legendary: '传说' }[q] ?? q),
  comboExpert: '🔪 切瓜达人！',
  comboGod: '⚡ 瓜神降临！',

  tabFocus: '专注',
  tabWarehouse: '瓜棚',
  tabFarm: '农场',

  // Farm
  farmPlotsTab: '地块',
  farmCollectionTab: '图鉴',
  farmTodayFocus: (m) => `今日专注 ${m} 分钟`,
  farmPlant: '种植',
  farmHarvest: '收获',
  farmWithered: '已枯萎',
  farmClear: '清除',
  farmSelectGalaxy: '选择星系',
  farmSelectSeed: '选择种子',
  farmSeedHint: '品质越高，稀有品种概率越大',
  farmNoSeeds: '还没有种子，去切瓜获取吧！',
  farmGoSlice: '去切瓜 🔪',
  farmReveal: '叮！原来是——',
  farmNewVariety: '新品种！',
  farmNewFlash: 'NEW',
  farmAlreadyCollected: '已收藏',
  farmStage: (s) => ({ seed: '种子期', sprout: '发芽期', leaf: '长叶期', flower: '开花期', fruit: '结果期' }[s] ?? s),
  farmGoFarm: '去农场种植 🌱',

  // Collection
  collectionProgress: (c, t) => `已收集 ${c}/${t}`,
  collectionLocked: '未解锁',
  collectionUnlockHint: (id) => ({
    'thick-earth': '默认解锁',
    fire: '集齐厚土星系 5 个品种解锁',
    water: '集齐火焰星系 5 个品种解锁',
    wood: '集齐流水星系 5 个品种解锁',
    metal: '集齐草木星系 5 个品种解锁',
    rainbow: '即将开放',
    'dark-matter': '即将开放',
  }[id] ?? '即将开放'),
  galaxyName: (id) => ({
    'thick-earth': '厚土星系',
    fire: '火焰星系',
    water: '流水星系',
    wood: '草木星系',
    metal: '金石星系',
    rainbow: '幻彩星系',
    'dark-matter': '暗物质星系',
  }[id] ?? id),
  varietyName: (id) => ({
    'jade-stripe': '翠纹瓜',
    'black-pearl': '黑珍珠',
    'honey-bomb': '蜜糖炸弹',
    'mini-round': '迷你圆滚滚',
    'star-moon': '星月瓜',
    'golden-heart': '金心瓜',
    'ice-sugar-snow': '冰糖雪瓜',
    'cube-melon': '方块瓜',
  }[id] ?? id),
  varietyStory: (id) => ({
    'jade-stripe': '最经典的西瓜，绿皮白纹，地球瓜农的老朋友',
    'black-pearl': '深黑色外皮下藏着最甜的秘密',
    'honey-bomb': '甜到爆炸！咬一口能甜三天',
    'mini-round': '巴掌大的小可爱，一个人刚好吃完',
    'star-moon': '深蓝色瓜皮上天然长着月亮和星星的图案',
    'golden-heart': '切开是金黄色的果肉，像藏了一块黄金',
    'ice-sugar-snow': '白色果肉，入口即化，传说只在初雪时结果',
    'cube-melon': '天然长成正方形的奇迹，全宇宙只有地球有',
  }[id] ?? ''),
};
