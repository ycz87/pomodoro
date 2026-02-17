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
    'black-pearl': '黒真珠瓜',
    'honey-bomb': '蜜糖ボム瓜',
    'mini-round': 'ミニ丸瓜',
    'star-moon': '星月瓜',
    'golden-heart': '金心瓜',
    'ice-sugar-snow': '氷砂糖雪瓜',
    'cube-melon': 'キューブ瓜',
    'lava-melon': '溶岩メロン',
    'caramel-crack': 'キャラメル裂紋瓜',
    'charcoal-roast': '炭火焼き瓜',
    'flame-pattern': '火焔紋瓜',
    'molten-core': '溶核瓜',
    'sun-stone': '太陽石瓜',
    'ash-rebirth': '灰燼再生瓜',
    'phoenix-nirvana': '鳳凰涅槃瓜',
    'snow-velvet': '雪絨瓜',
    'ice-crystal': '氷晶瓜',
    'tidal-melon': '潮汐瓜',
    'aurora-melon': '極光瓜',
    'moonlight-melon': '月光瓜',
    'diamond-melon': 'ダイヤ瓜',
    'abyss-melon': '深淵瓜',
    permafrost: '永凍瓜',
    'vine-melon': '藤蔓瓜',
    'moss-melon': '苔瓜',
    'mycelium-melon': '菌糸瓜',
    'flower-whisper': '花語瓜',
    'tree-ring': '年輪瓜',
    'world-tree': '世界樹瓜',
    'spirit-root': '霊根瓜',
    'all-spirit': '万霊瓜',
    'golden-armor': '黄金甲瓜',
    'copper-patina': '銅錆瓜',
    'tinfoil-melon': '錫箔瓜',
    'galaxy-stripe': '銀河紋瓜',
    'mercury-melon': '水銀瓜',
    'meteorite-melon': '隕鉄瓜',
    'alloy-melon': '合金瓜',
    'eternal-melon': '永恒瓜',
  }[id] ?? id),
  varietyStory: (id) => ({
    'jade-stripe': '宇宙大爆発後に最初に芽吹き、原初の白い縞を受け継ぐ。',
    'black-pearl': '深い黒土で育ち、大地の精華を黒い皮に宿す。',
    'honey-bomb': '太陽の糖分を果肉に閉じ込め、爆発級の甘さを放つ。',
    'mini-round': '赤道の重力で、手のひらサイズの完璧な球体になる。',
    'star-moon': '二つの月光で、夜の皮に星と月の紋様が浮かぶ。',
    'golden-heart': '金脈に触れた根が、果肉をまばゆい金色へ変える。',
    'ice-sugar-snow': '千年に一度の極雪の日だけ、白く溶ける実を結ぶ。',
    'cube-melon': '原初の立方体片がそのまま残った、唯一無二の遺伝子。',
    'lava-melon': '火口縁で育ち、橙色の果肉が溶岩のように揺れる。',
    'caramel-crack': '灼熱で皮が割れ、裂け目からキャラメル色の蜜が滲む。',
    'charcoal-roast': '地熱噴気のそばで自然に焼け、淡い燻香をまとう。',
    'flame-pattern': '火炎嵐の季節だけ実り、皮に凍った炎の筋が走る。',
    'molten-core': '発光する溶核が、地心から吸い上げた力を蓄える。',
    'sun-stone': '恒星の欠片を吸収し、暗闇でも絶えず光り続ける。',
    'ash-rebirth': '噴火後の灰からだけ芽吹き、破壊を越えて再生する。',
    'phoenix-nirvana': '鳳凰の炎が残した種は、永遠に枯れないと伝わる。',
    'snow-velvet': '皮に霜花をまとい、触れるだけで凍るように冷たい。',
    'ice-crystal': '氷河の裂け目で育ち、半透明の皮に青い果肉が透ける。',
    'tidal-melon': '果肉の紋様が、氷下海の潮の流れに合わせて揺れる。',
    'aurora-melon': '極地磁場が光を曲げ、皮に極光の色彩を映し出す。',
    'moonlight-melon': '長い極夜に熟し、月光を吸った銀白色に輝く。',
    'diamond-melon': '超高圧で天然結晶を宿し、ダイヤより稀少とされる。',
    'abyss-melon': '氷海の最深部で育ち、幽かな青い冷光を放つ。',
    permafrost: '摂氏マイナス200度でも凍り切らない水片の末裔。',
    'vine-melon': '生きた蔓が自ら伸び、支柱へ絡みついて成長する。',
    'moss-melon': '濃い苔に紛れ、森の中では見つけるのが難しい。',
    'mycelium-melon': '根が菌糸網とつながり、森全体の気配を感じ取る。',
    'flower-whisper': '開花の香りで意思を伝え、香調で機嫌がわかる。',
    'tree-ring': '果肉の年輪一つ一つに、季節の記憶が刻まれる。',
    'world-tree': '世界樹の最上冠でしか実らない高空の果実。',
    'spirit-root': '地核まで伸びた根が命脈を吸い、ひと口で大地の鼓動が響く。',
    'all-spirit': '原初の木片の種に由来し、あらゆる生命の声を聞かせる。',
    'golden-armor': '鎧のように硬い皮は、専用合金刃でなければ割れない。',
    'copper-patina': '緑青の皮は老化ではなく、古鉱石を模した擬態である。',
    'tinfoil-melon': '錫箔のように薄い皮が強靭で、叩くと金属音が鳴る。',
    'galaxy-stripe': '銀河渦の紋は、惑星磁場が皮に刻んだ痕跡である。',
    'mercury-melon': '水銀のような果肉は流れ出ても、すぐ自ら再集合する。',
    'meteorite-melon': '隕石孔で育ち、宇宙金属の熱を果実に取り込む。',
    'alloy-melon': '希少金属の微量元素を含み、鉱夫の貴重な栄養源となる。',
    'eternal-melon': '原初の金片が核で鍛えられ、永遠に朽ちない果実となった。',
  }[id] ?? ''),
};
