import type { Messages } from '../types';

/** 日本語翻訳 */
export const ja: Messages = {
  // App
  appName: 'スイカ時計',
  appNameShort: 'スイカ時計',

  // Timer phases
  phaseWork: '🍉 集中タイム',
  phaseShortBreak: '☕ 休憩',

  // Timer controls
  abandon: '中断する',
  quickTimeHint: 'タップで時間を調整',
  toggleTimerMode: 'タップでカウント切替',

  // Task input
  taskPlaceholder: '何に取り組みますか？',
  clearTask: 'クリア',

  // Task list
  emptyTitle: '準備はいい？',
  emptySubtitle: '最初の集中セッションを始めよう 🍉',
  todayRecords: '今日の記録',
  unnamed: '無題',
  editHint: 'タップで編集',
  deleteConfirm: '本当に？',

  // Today stats
  todayHarvest: '今日の収穫',
  totalFocus: (time: string) => `合計: ${time}`,

  // Notifications
  workComplete: (emoji: string) => `${emoji} セッション完了！`,
  skipComplete: (emoji: string) => `${emoji} 手動で完了`,
  breakOver: '☕ 休憩終了',
  breakOverBody: '次のセッションを始めますか？',

  // Celebration
  celebrationRipe: ['すごい！🎉', 'お見事！✨', '完璧な集中！🔥', 'この調子！💪'],
  celebrationShort: ['いいね！👍', '完了！✨', 'いいスタート！🌱'],

  // Per-stage celebration text
  celebrateSeed: [
    'すべての芽にスイカ畑が眠っている 🌱',
    '小さな一歩、大きな可能性 ✨',
    '芽が手の中に — 未来はあなた次第',
    '集中の第一歩を踏み出した 🌱',
    '小さな芽、花開く日を待っている',
  ],
  celebrateSprout: [
    '芽が出た — 集中が根を張り始めている 🌿',
    'ほら、あなたの努力が芽吹いた',
    '続ければ、きっと大きく育つ 🌿',
    '集中の一分一秒が太陽と雨になる',
    '芽が出た、いいことが待っている 🌿',
  ],
  celebrateBloom: [
    '花が咲いた — 実りはもうすぐ？🌼',
    '咲いたのは花だけじゃない、あなたの集中力も',
    '花が咲いた、いいことが近づいている 🌼',
    'もう少しで実がなる',
    'あなたの集中が花開いている 🌼',
  ],
  celebrateGreen: [
    'スイカが形になった — 収穫は目前 🍈',
    'あと少しで完璧なスイカに！',
    'あなたの集中が実を結んだ 🍈',
    '次はもっと大きく育てよう！',
    '集中の成果が見えてきた 🍈',
  ],
  celebrateRipe: [
    '完璧なスイカ！あなたは最高 🍉🎉',
    'このスイカは集中の最も甘い果実',
    '収穫の時！このお祝いにふさわしい 🍉',
    '25分の集中で最高のご褒美 🎉',
    '大収穫！これが集中の力 🍉',
  ],
  celebrateLegendary: [
    '伝説の金のスイカ！集中マスター 👑',
    '金色に輝く！最高の栄誉 👑✨',
    '金のスイカ降臨！集中の王者 🏆',
    '90分の深い集中で伝説の報酬 👑',
    '金のスイカ！世界中が拍手している 🎉👑',
  ],

  // Warehouse & Synthesis
  warehouseTitle: '🏠 スイカ小屋',
  warehouseTabShed: '🍉 小屋',
  warehouseTabBackpack: '🎒 リュック',
  warehouseTotal: '総収穫数',
  warehouseHighest: '最高ランク',
  warehouseLocked: '🔒',
  warehouseLockedName: '???',
  synthesisTitle: '⚗️ 合成',
  synthesisYouHave: (n) => `${n}個所持`,
  synthesisCanMake: (n, name) => `${n}個の${name}を合成可能`,
  synthesisNotEnough: '素材不足',
  synthesisSynthesize: '合成',
  synthesisSynthesizeAll: 'すべて合成',
  synthesisSuccess: (name) => `合成成功！${name}を獲得`,
  warehouseEmpty: '小屋はまだ空 — 集中を始めよう 🍉',
  stageNameSeed: '芽',
  stageNameSprout: '若芽',
  stageNameBloom: '花',
  stageNameGreen: '青スイカ',
  stageNameRipe: 'スイカ',
  stageNameLegendary: '金のスイカ',
  legendaryUnlocked: '解放済み',

  // Anti-AFK & Health
  overtimeNoReward: '超過時間が長すぎ — 今回は報酬なし ⏰',
  healthReminder: '長時間の集中では自動で休憩に切り替わりません — 時間になったら休憩を忘れずに 🧘',

  // Settings
  settings: '設定',
  timerRunningHint: '⏳ タイマー動作中 — 停止後に調整できます',
  workDuration: '集中時間',
  shortBreak: '休憩時間',
  autoStartBreak: '自動で休憩開始',
  autoStartWork: '自動で集中開始',

  // Alert sound
  alertSound: 'アラート音',
  alertRepeatCount: 'リピート',
  alertVolume: 'アラート音量',
  alertCustomize: 'カスタマイズ',
  repeatTimes: (n: number) => n === 0 ? 'ループ' : `${n}回`,

  // Ambience
  focusAmbience: '集中BGM',
  ambienceVolume: 'BGM音量',
  ambienceCustomize: 'カスタマイズ',
  ambienceOff: 'オフ',
  ambienceCategoryNature: '🌧️ 自然',
  ambienceCategoryEnvironment: '🏠 環境',
  ambienceCategoryNoise: '🎵 ノイズ',
  ambienceCategoryClock: '🕐 時計',

  // Ambience sound names
  ambienceNames: {
    rain: '雨',
    thunderstorm: '雷雨',
    ocean: '波の音',
    stream: '小川',
    birds: '鳥のさえずり',
    wind: '風',
    crickets: '虫の声',
    cafe: 'カフェ',
    fireplace: '暖炉',
    keyboard: 'キーボード',
    library: '図書館',
    whiteNoise: 'ホワイトノイズ',
    pinkNoise: 'ピンクノイズ',
    brownNoise: 'ブラウンノイズ',
    binauralBeats: 'バイノーラルビート',
    tickClassic: 'クラシック振り子',
    tickSoft: 'ソフトチック',
    tickMechanical: '機械式',
    tickWooden: '木製時計',
    tickGrandfather: '置き時計',
    tickPocketWatch: '懐中時計',
    tickMetronome: 'メトロノーム',
    tickWaterDrop: '水滴',
    campfire: '焚き火',
    softPiano: 'ソフトピアノ',
    catPurr: '猫のゴロゴロ',
    night: '夜',
    train: '電車',
    underwater: '水中',
  },

  // Alert sound names
  alertNames: {
    chime: '🎵 チャイム',
    bell: '🔔 ベル',
    nature: '🌿 自然',
    xylophone: '🎶 木琴',
    piano: '🎹 ピアノ',
    electronic: '⚡ エレクトロ',
    waterdrop: '💧 水滴',
    birdsong: '🐦 鳥の歌',
    marimba: '🪘 マリンバ',
    gong: '🔊 ゴング',
  },

  // Modal
  modalClose: '閉じる',
  modalDone: '完了',

  theme: 'テーマ',
  language: '言語',
  exportData: '📦 データ書き出し',
  minutes: '分',
  seconds: '秒',

  // Theme names
  themeDark: 'ダーク',
  themeLight: 'ライト',
  themeForest: 'フォレスト',
  themeOcean: 'オーシャン',
  themeWarm: 'ウォーム',

  // Growth stages
  stageSeed: '芽',
  stageSprout: '若芽',
  stageBloom: '花',
  stageGreen: '青実',
  stageRipe: '完熟',

  // Guide
  guideTitle: '🍉 使い方ガイド',
  guidePomodoro: 'ポモドーロ・テクニック',
  guidePomodoroDesc: 'スイカ時計はポモドーロ・テクニックで集中をサポートします。集中 → 休憩 → 集中 → 休憩、シンプルなサイクルです。',
  guideBasic: '基本操作',
  guideBasicItems: [
    '再生ボタンで集中開始',
    '一時停止、早期完了、中断がいつでも可能',
    'セッション後は自動で休憩に入ります',
    'タイマーの数字をタップで時間を素早く調整',
  ],
  guideGrowth: '🌱 スイカの成長',
  guideGrowthDesc: '集中時間が長いほど、スイカは大きく育ちます：',
  guideGrowthStages: ['5〜15分 · 芽', '16〜25分 · 若芽', '26〜45分 · 花', '46〜60分 · 青実', '61〜90分 · 完熟'],
  guideSettings: '⚙️ 設定',
  guideSettingsDesc: '歯車アイコンから集中/休憩時間、自動開始、アラート音、BGMミキサー、テーマ、データ書き出しをカスタマイズできます。',
  guideStart: 'はじめる',

  // Install prompt
  installTitle: 'アプリをインストール',
  installDesc: 'ネイティブアプリのように使えます',
  installButton: 'インストール',

  // History panel
  historyTab: '📅 履歴',
  statsTab: '📊 統計',
  streakBanner: (days: number) => `🔥 ${days}日連続`,
  noRecords: 'この日の記録はありません',
  today: '今日',
  yesterday: '昨日',
  dateFormat: (m: number, d: number) => `${m}/${d}`,

  // Stats
  currentStreak: '現在の連続',
  longestStreak: '最長連続',
  focusTrend: '集中トレンド',
  thisWeek: '今週',
  thisMonth: '今月',
  totalTime: '累計時間',
  totalCount: '累計セッション',
  countUnit: (n: number) => `${n}`,

  // Time formatting
  formatMinutes: (mins: number) => {
    if (mins < 60) return `${mins}分`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m > 0 ? `${h}時間${m}分` : `${h}時間`;
  },

  // Weekdays (Mon-Sun)
  weekdays: ['月', '火', '水', '木', '金', '土', '日'],
  weekdaysShort: ['日', '月', '火', '水', '木', '金', '土'],

  // Month nav
  monthFormat: (year: number, month: number) => `${year}年${month}月`,

  // ─── Project mode ───
  modePomodoro: 'ポモドーロ',
  modeProject: 'プロジェクト',

  // Setup
  projectNamePlaceholder: 'プロジェクト名',
  projectTasks: 'タスク',
  projectTaskPlaceholder: 'タスク名',
  projectAddTask: 'タスクを追加',
  projectEstimatedTotal: '見積もり合計',
  projectBreakTotal: '休憩',
  projectCancel: 'キャンセル',
  projectStart: '開始',

  // Execution
  projectCurrentTask: 'タスク',
  projectBreakTime: '休憩時間',
  projectOvertime: '超過',
  projectEstimated: '見積もり',
  projectContinue: '続ける',
  projectMarkDone: '完了',
  projectPause: '一時停止',
  projectResume: '再開',
  projectTaskList: 'タスク一覧',
  projectInsertTask: 'タスクを挿入',
  projectInsert: '挿入',
  projectAbandon: 'プロジェクトを中断',
  projectAbandonConfirm: '中断しますか？進捗は失われます。',
  projectAbandonYes: '確認',

  // Summary
  projectComplete: 'プロジェクト完了！',
  projectTotalEstimated: '見積もり',
  projectTotalActual: '実績',
  projectAheadOfSchedule: '前倒し',
  projectBehindSchedule: '超過',
  projectTaskBreakdown: 'タスク内訳',
  projectCompleted: '完了',
  projectSkipped: 'スキップ',
  projectDone: '完了',

  // Confirm modal
  confirmExitTitle: 'このセッションを終了しますか？',
  confirmExitMessage: '進捗は未完了として記録されます',
  confirm: '終了',
  cancel: 'キャンセル',

  // Default task name
  defaultTaskName: (n: number) => `集中 #${n}`,

  // Project exit modal
  projectExitConfirmTitle: '現在のタスクを終了しますか？',
  projectExitConfirm: 'タスクを終了',
  projectExitAll: 'プロジェクト全体を終了',
  projectExitChooseTitle: '次はどうしますか？',
  projectExitRestart: 'このタスクをやり直す',
  projectExitNext: '次のタスクへ',
  projectExitPrevious: '前のタスクに戻る（超過継続）',
  projectExitFinish: 'プロジェクトを終了',
  projectAbandoned: '中断',
  projectOvertimeContinued: '超過継続',

  // Recovery
  projectRecoveryTitle: '未完了のプロジェクトがあります',
  projectRecoveryDesc: '前回のプロジェクトが未完了です。再開しますか？',
  projectRecoveryResume: '再開',
  projectRecoveryDiscard: '最初から',

  // History
  projectHistory: 'プロジェクト',
  projectHistoryEstimated: '見積もり',
  projectHistoryActual: '実績',

  // Settings section headers
  sectionTimer: '⏱ タイマー',
  sectionAlerts: '🔔 アラート',
  sectionAppearance: '🎨 外観',
  sectionGeneral: '⚙ 一般',

  // Empty state
  emptyTodayHint: '今日はまだ記録がありません',

  // Guide in settings
  settingsGuide: '使い方ガイド',

  // Encouragement banner
  encourageEmpty: [
    'スイカを育てて、集中力も育てよう 🍉',
    '最初のスイカを植える準備はできた？🌱',
    'あなたのスイカ畑が待っている 🍉',
  ],
  encourageFirst: [
    'スイカが育ち始めた 🌱',
    '最初のスイカを植えた、この調子！',
    '集中して、熟すのを待とう 🍉',
  ],
  encourageSecond: [
    'いい調子！スイカ2個収穫',
    '2個目もゲット、いいね 👍',
    'スイカ畑が広がっている 🍉',
  ],
  encourageThird: [
    '今日のスイカは格別に甘い 🍉',
    '3個のスイカ、大収穫！',
    'スイカ畑が活気づいている 🌱',
  ],
  encourageMany: [
    '{n}個のスイカを収穫 — 絶好調！',
    '{n}個のスイカ、すごい一日 🔥',
    '{n}個のスイカ、止まらない収穫！🍉',
  ],
  encourageBeatYesterday: (count, diff) => `${count}個完了、昨日より${diff}個多い 💪`,
  encourageTiedYesterday: (count) => `${count}個完了、昨日と同じペース`,
  streakShort: (days) => `🔥 ${days}日連続`,
  streakMedium: (days) => `🔥 ${days}日連続、習慣になりつつある`,
  streakLong: (days) => `🔥 ${days}日連続！素晴らしい！`,

  // Week trend chart
  weekTrend: '今週',
  weekTotal: (time) => `合計: ${time}`,

  // Long-press buttons
  holdToFinish: '長押しで早期完了',
  holdToGiveUp: '長押しで中断',

  // Auth
  authTitle: 'ログイン',
  authEmailPlaceholder: 'メールアドレスを入力',
  authSendCode: 'コードを送信',
  authSendFailed: '送信に失敗しました。もう一度お試しください',
  authVerifyFailed: 'コードが無効または期限切れです',
  authOr: 'または',
  authGoogle: 'Googleでログイン',
  authMicrosoft: 'Microsoftでログイン',
  authLoginToSync: 'ログインしてデータを同期',
  authLogout: 'ログアウト',

  // Profile editing
  profileEditName: '名前を変更',
  profileSaving: '保存中...',
  profileUploadAvatar: 'アバターを変更',

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
  sliceHint: 'スワイプしてスイカを切ろう 🔪',
  slicePerfect: '✨ パーフェクト！',
  sliceResult: '🍉 スイカカット結果',
  sliceGoldResult: '👑 金スイカカット結果',
  sliceSeedsObtained: (n) => `ミステリーシード ×${n}`,
  slicePerfectBonus: '+1 パーフェクトボーナス',
  sliceRare: 'レア',
  sliceCollect: '受け取る',
  sliceContinue: '🔪 次をカット',
  sliceButton: '🔪 カット',
  itemName: (id) => ({
    'starlight-fertilizer': '⚡ スターライト肥料',
    'supernova-bottle': '☀️ 超新星エネルギーボトル',
    'alien-flare': '🛸 エイリアン信号弾',
    'thief-trap': '🪤 泥棒トラップ',
    'star-telescope': '🔮 星間望遠鏡',
    'moonlight-dew': '🌙 月光の雫',
    'circus-tent': '🎪 スイカサーカステント',
    'gene-modifier': '🧬 遺伝子改造液',
    'lullaby-record': '🎵 スイカの子守唄レコード',
  }[id] ?? id),
  itemFlavor: (id) => ({
    'starlight-fertilizer': '遠い銀河からの神秘的な肥料、星の香りがする',
    'supernova-bottle': '超新星の爆発エネルギーが詰まっている',
    'alien-flare': '宇宙に「ここにスイカがある！」と叫んで、良い人が来ることを祈る',
    'thief-trap': '普通のスイカに見えるが、実は檻',
    'star-telescope': 'エイリアン天文台の遺物と言われている',
    'moonlight-dew': '満月の夜にだけ凝結する神秘的な露',
    'circus-tent': '通りすがりのエイリアンサーカスが残していった',
    'gene-modifier': '変異博士の秘蔵コレクション',
    'lullaby-record': 'エイリアンが録音した子守唄、スイカの成長が早くなる',
  }[id] ?? ''),
  shedSeedsTitle: '🌰 ミステリーシード',
  shedSeedsCount: (n) => `×${n}`,
  shedGoFarm: '農場へ行く',
  shedFarmComingSoon: '農場は近日公開',
  shedItemsTitle: '🎒 アイテム',
  shedNoItems: 'アイテムはまだありません。スイカを切ってみよう！',
  shedSliceSection: '🔪 カット',
  shedTotalSliced: '総カット数',
  seedQualityLabel: (q) => ({ normal: 'ノーマル', epic: 'エピック', legendary: 'レジェンド' }[q] ?? q),
  comboExpert: '🔪 カット達人！',
  comboGod: '⚡ 瓜神降臨！',

  tabFocus: '集中',
  tabWarehouse: '倉庫',
  tabFarm: '農場',

  farmPlotsTab: '畑',
  farmCollectionTab: '図鑑',
  farmTodayFocus: (m) => `今日の集中 ${m} 分`,
  farmPlant: '植える',
  farmHarvest: '収穫',
  farmWithered: '枯れた',
  farmClear: '片付け',
  farmSelectGalaxy: '銀河を選択',
  farmSelectSeed: '種を選ぶ',
  farmSeedHint: '品質が高いほどレア品種の確率アップ',
  farmNoSeeds: 'まだ種がありません。スイカを切って手に入れよう！',
  farmGoSlice: 'カットへ 🔪',
  farmReveal: 'ピン！正体は——',
  farmNewVariety: '新品種！',
  farmNewFlash: 'NEW',
  farmAlreadyCollected: '収集済み',
  farmStage: (s) => ({ seed: '種子期', sprout: '発芽期', leaf: '成長期', flower: '開花期', fruit: '結実期' }[s] ?? s),
  farmGoFarm: '農場へ 🌱',

  collectionProgress: (c, t) => `${c}/${t} 収集済み`,
  collectionLocked: '未解放',
  collectionUnlockHint: (id) => ({
    'thick-earth': '初期解放',
    fire: '厚土銀河の品種を5つ集めると解放',
    water: '火焔銀河の品種を5つ集めると解放',
    wood: '流水銀河の品種を5つ集めると解放',
    metal: '草木銀河の品種を5つ集めると解放',
    rainbow: '近日公開',
    'dark-matter': '近日公開',
  }[id] ?? '近日公開'),
  galaxyName: (id) => ({
    'thick-earth': '厚土銀河',
    fire: '火焔銀河',
    water: '流水銀河',
    wood: '草木銀河',
    metal: '金石銀河',
    rainbow: '虹彩銀河',
    'dark-matter': '暗黒物質銀河',
  }[id] ?? id),
  varietyName: (id) => ({
    'jade-stripe': '翠紋瓜',
    'black-pearl': 'ブラックパール',
    'honey-bomb': 'ハニーボム',
    'mini-round': 'ミニまるまる',
    'star-moon': '星月瓜',
    'golden-heart': 'ゴールデンハート',
    'ice-sugar-snow': '氷砂糖スノー',
    'cube-melon': 'キューブメロン',
  }[id] ?? id),
  varietyStory: (id) => ({
    'jade-stripe': '最も定番のスイカ、緑の皮に白い縞模様',
    'black-pearl': '真っ黒な皮の下に最も甘い秘密が隠れている',
    'honey-bomb': '甘さ爆発！一口で三日間甘い',
    'mini-round': '手のひらサイズの可愛いやつ',
    'star-moon': '深い青の皮に月と星の模様が自然に浮かぶ',
    'golden-heart': '切ると金色の果肉、まるで黄金を隠しているよう',
    'ice-sugar-snow': '白い果肉、口の中でとろける、初雪の時だけ実る伝説',
    'cube-melon': '自然に四角く育つ奇跡、地球だけの存在',
  }[id] ?? ''),
};
