import type { Messages } from '../types';

/** 한국어 번역 */
export const ko: Messages = {
  // App
  appName: '수박 시계',
  appNameShort: '수박 시계',

  // Timer phases
  phaseWork: '🍉 집중 시간',
  phaseShortBreak: '☕ 휴식',

  // Timer controls
  abandon: '포기하기',
  quickTimeHint: '탭하여 시간 조정',
  toggleTimerMode: '탭하여 카운트 전환',

  // Task input
  taskPlaceholder: '무엇을 할 건가요?',
  clearTask: '지우기',

  // Task list
  emptyTitle: '준비됐나요?',
  emptySubtitle: '첫 번째 집중 세션을 시작하세요 🍉',
  todayRecords: '오늘의 기록',
  unnamed: '제목 없음',
  editHint: '탭하여 편집',
  deleteConfirm: '확실한가요?',

  // Today stats
  todayHarvest: '오늘의 수확',
  totalFocus: (time: string) => `총 집중: ${time}`,

  // Notifications
  workComplete: (emoji: string) => `${emoji} 세션 완료!`,
  skipComplete: (emoji: string) => `${emoji} 수동 완료`,
  breakOver: '☕ 휴식 끝',
  breakOverBody: '다음 세션을 시작할까요?',

  // Celebration
  celebrationRipe: ['대단해요! 🎉', '잘했어요! ✨', '완벽한 집중! 🔥', '계속 이 조자! 💪'],
  celebrationShort: ['좋아요! 👍', '완료! ✨', '좋은 시작! 🌱'],

  // Per-stage celebration text
  celebrateSeed: [
    '모든 새싹에는 수박밭이 숨어 있어요 🌱',
    '작은 시작, 큰 가능성 ✨',
    '새싹이 당신 손에 — 미래는 당신이 만들어요',
    '집중의 첫걸음을 내딛었어요 🌱',
    '작은 새싹, 꽃필 날을 기다리며',
  ],
  celebrateSprout: [
    '싹이 돋았어요 — 집중이 뿌리내리고 있어요 🌿',
    '봐요, 당신의 노력이 싹트고 있어요',
    '계속하면 멋지게 자랄 거예요 🌿',
    '집중의 매 순간이 햇살과 비가 돼요',
    '싹이 났어요, 좋은 일이 올 거예요 🌿',
  ],
  celebrateBloom: [
    '꽃이 피었어요 — 열매가 멀지 않아요 🌼',
    '피어난 건 꽃만이 아니에요, 당신의 집중력도요',
    '꽃이 활짝, 좋은 일이 다가와요 🌼',
    '조금만 더 하면 열매가 맺혀요',
    '당신의 집중이 꽃피고 있어요 🌼',
  ],
  celebrateGreen: [
    '수박이 형태를 갖추고 있어요 — 수확이 코앞 🍈',
    '완벽한 수박까지 거의 다 왔어요!',
    '당신의 집중이 열매를 맺었어요 🍈',
    '다음엔 더 크게 키워봐요!',
    '집중의 결실이 보이기 시작해요 🍈',
  ],
  celebrateRipe: [
    '완벽한 수박! 당신은 최고예요 🍉🎉',
    '이 수박은 집중의 가장 달콤한 열매',
    '수확의 시간! 이 축하를 받을 자격이 있어요 🍉',
    '25분의 집중으로 가장 달콤한 보상 🎉',
    '대풍작! 이것이 집중의 힘 🍉',
  ],
  celebrateLegendary: [
    '전설의 황금 수박! 집중의 달인 👑',
    '황금빛 영광! 최고의 영예 👑✨',
    '황금 수박 강림! 집중의 왕 🏆',
    '90분의 깊은 집중으로 전설의 보상 👑',
    '황금 수박! 온 세상이 박수를 보내요 🎉👑',
  ],

  // Warehouse & Synthesis
  warehouseTitle: '🏠 내 수박 창고',
  warehouseTabShed: '🍉 창고',
  warehouseTabBackpack: '🎒 배낭',
  warehouseTotal: '총 수확',
  warehouseHighest: '최고 등급',
  warehouseLocked: '🔒',
  warehouseLockedName: '???',
  synthesisTitle: '⚗️ 합성',
  synthesisYouHave: (n) => `${n}개 보유`,
  synthesisCanMake: (n, name) => `${n}개의 ${name} 합성 가능`,
  synthesisNotEnough: '재료 부족',
  synthesisSynthesize: '합성',
  synthesisSynthesizeAll: '모두 합성',
  synthesisSuccess: (name) => `합성 성공! ${name} 획득`,
  warehouseEmpty: '창고가 비어 있어요 — 집중을 시작하세요! 🍉',
  stageNameSeed: '새싹',
  stageNameSprout: '어린잎',
  stageNameBloom: '꽃',
  stageNameGreen: '풋수박',
  stageNameRipe: '수박',
  stageNameLegendary: '황금 수박',
  legendaryUnlocked: '해금됨',

  // Anti-AFK & Health
  overtimeNoReward: '초과 시간이 너무 길어요 — 이번엔 보상 없음 ⏰',
  healthReminder: '긴 집중 세션은 자동으로 휴식으로 전환되지 않아요 — 시간이 되면 쉬는 걸 잊지 마세요 🧘',

  // Settings
  settings: '설정',
  timerRunningHint: '⏳ 타이머 작동 중 — 정지 후 조정 가능',
  workDuration: '집중 시간',
  shortBreak: '휴식 시간',
  autoStartBreak: '자동 휴식 시작',
  autoStartWork: '자동 집중 시작',

  // Alert sound
  alertSound: '알림음',
  alertRepeatCount: '반복',
  alertVolume: '알림 볼륨',
  alertCustomize: '맞춤 설정',
  repeatTimes: (n: number) => n === 0 ? '반복' : `${n}회`,

  // Ambience
  focusAmbience: '집중 배경음',
  ambienceVolume: '배경음 볼륨',
  ambienceCustomize: '맞춤 설정',
  ambienceOff: '꺼짐',
  ambienceCategoryNature: '🌧️ 자연',
  ambienceCategoryEnvironment: '🏠 환경',
  ambienceCategoryNoise: '🎵 노이즈',
  ambienceCategoryClock: '🕐 시계',

  // Ambience sound names
  ambienceNames: {
    rain: '빗소리',
    thunderstorm: '천둥번개',
    ocean: '파도',
    stream: '시냇물',
    birds: '새소리',
    wind: '바람',
    crickets: '귀뚜라미',
    cafe: '카페',
    fireplace: '벽난로',
    keyboard: '키보드',
    library: '도서관',
    whiteNoise: '화이트 노이즈',
    pinkNoise: '핑크 노이즈',
    brownNoise: '브라운 노이즈',
    binauralBeats: '바이노럴 비트',
    tickClassic: '클래식 진자',
    tickSoft: '부드러운 틱',
    tickMechanical: '기계식',
    tickWooden: '나무 시계',
    tickGrandfather: '괘종시계',
    tickPocketWatch: '회중시계',
    tickMetronome: '메트로놈',
    tickWaterDrop: '물방울',
    campfire: '모닥불',
    softPiano: '소프트 피아노',
    catPurr: '고양이 골골',
    night: '밤',
    train: '기차',
    underwater: '수중',
  },

  // Alert sound names
  alertNames: {
    chime: '🎵 차임',
    bell: '🔔 벨',
    nature: '🌿 자연',
    xylophone: '🎶 실로폰',
    piano: '🎹 피아노',
    electronic: '⚡ 일렉트로닉',
    waterdrop: '💧 물방울',
    birdsong: '🐦 새노래',
    marimba: '🪘 마림바',
    gong: '🔊 징',
  },

  // Modal
  modalClose: '닫기',
  modalDone: '완료',

  theme: '테마',
  language: '언어',
  exportData: '📦 데이터 내보내기',
  minutes: '분',
  seconds: '초',

  // Theme names
  themeDark: '다크',
  themeLight: '라이트',
  themeForest: '포레스트',
  themeOcean: '오션',
  themeWarm: '웜',

  // Growth stages
  stageSeed: '새싹',
  stageSprout: '어린잎',
  stageBloom: '꽃',
  stageGreen: '풋열매',
  stageRipe: '완숙',

  // Guide
  guideTitle: '🍉 사용 가이드',
  guidePomodoro: '포모도로 기법',
  guidePomodoroDesc: '수박 시계는 포모도로 기법으로 집중을 도와줍니다. 집중 → 휴식 → 집중 → 휴식, 간단한 사이클입니다.',
  guideBasic: '기본 사용법',
  guideBasicItems: [
    '재생 버튼을 눌러 집중 시작',
    '언제든 일시정지, 조기 완료, 중단 가능',
    '세션 후 자동으로 휴식 시작',
    '타이머 숫자를 탭하여 빠르게 시간 조정',
  ],
  guideGrowth: '🌱 수박 성장',
  guideGrowthDesc: '집중 시간이 길수록 수박이 더 크게 자라요:',
  guideGrowthStages: ['5~15분 · 새싹', '16~25분 · 어린잎', '26~45분 · 꽃', '46~60분 · 풋열매', '61~90분 · 완숙'],
  guideSettings: '⚙️ 설정',
  guideSettingsDesc: '톱니바퀴 아이콘에서 집중/휴식 시간, 자동 시작, 알림음, 배경음 믹서, 테마, 데이터 내보내기를 설정할 수 있습니다.',
  guideStart: '시작하기',

  // Install prompt
  installTitle: '앱 설치',
  installDesc: '네이티브 앱처럼 사용하세요',
  installButton: '설치',

  // History panel
  historyTab: '📅 기록',
  statsTab: '📊 통계',
  streakBanner: (days: number) => `🔥 ${days}일 연속`,
  noRecords: '이 날의 기록이 없습니다',
  today: '오늘',
  yesterday: '어제',
  dateFormat: (m: number, d: number) => `${m}/${d}`,

  // Stats
  currentStreak: '현재 연속',
  longestStreak: '최장 연속',
  focusTrend: '집중 트렌드',
  thisWeek: '이번 주',
  thisMonth: '이번 달',
  totalTime: '누적 시간',
  totalCount: '누적 세션',
  countUnit: (n: number) => `${n}`,

  // Time formatting
  formatMinutes: (mins: number) => {
    if (mins < 60) return `${mins}분`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m > 0 ? `${h}시간 ${m}분` : `${h}시간`;
  },

  // Weekdays (Mon-Sun)
  weekdays: ['월', '화', '수', '목', '금', '토', '일'],
  weekdaysShort: ['일', '월', '화', '수', '목', '금', '토'],

  // Month nav
  monthFormat: (year: number, month: number) => `${year}년 ${month}월`,

  // ─── Project mode ───
  modePomodoro: '포모도로',
  modeProject: '프로젝트',

  // Setup
  projectNamePlaceholder: '프로젝트 이름',
  projectTasks: '작업',
  projectTaskPlaceholder: '작업 이름',
  projectAddTask: '작업 추가',
  projectEstimatedTotal: '예상 총 시간',
  projectBreakTotal: '휴식',
  projectCancel: '취소',
  projectStart: '시작',

  // Execution
  projectCurrentTask: '작업',
  projectBreakTime: '휴식 시간',
  projectOvertime: '초과',
  projectEstimated: '예상',
  projectContinue: '계속',
  projectMarkDone: '완료',
  projectPause: '일시정지',
  projectResume: '재개',
  projectTaskList: '작업 목록',
  projectInsertTask: '작업 삽입',
  projectInsert: '삽입',
  projectAbandon: '프로젝트 포기',
  projectAbandonConfirm: '포기하시겠습니까? 진행 상황이 사라집니다.',
  projectAbandonYes: '확인',

  // Summary
  projectComplete: '프로젝트 완료!',
  projectTotalEstimated: '예상',
  projectTotalActual: '실제',
  projectAheadOfSchedule: '앞당김',
  projectBehindSchedule: '초과',
  projectTaskBreakdown: '작업 내역',
  projectCompleted: '완료',
  projectSkipped: '건너뜀',
  projectDone: '완료',

  // Confirm modal
  confirmExitTitle: '이 세션을 종료하시겠습니까?',
  confirmExitMessage: '진행 상황이 미완료로 기록됩니다',
  confirm: '종료',
  cancel: '취소',

  // Default task name
  defaultTaskName: (n: number) => `집중 #${n}`,

  // Project exit modal
  projectExitConfirmTitle: '현재 작업을 종료하시겠습니까?',
  projectExitConfirm: '작업 종료',
  projectExitAll: '전체 프로젝트 종료',
  projectExitChooseTitle: '다음은 어떻게 할까요?',
  projectExitRestart: '이 작업 다시 시작',
  projectExitNext: '다음 작업',
  projectExitPrevious: '이전 작업으로 돌아가기 (초과 계속)',
  projectExitFinish: '프로젝트 종료',
  projectAbandoned: '포기됨',
  projectOvertimeContinued: '초과 계속',

  // Recovery
  projectRecoveryTitle: '미완료 프로젝트 발견',
  projectRecoveryDesc: '미완료 프로젝트가 있습니다. 이어서 하시겠습니까?',
  projectRecoveryResume: '이어하기',
  projectRecoveryDiscard: '새로 시작',

  // History
  projectHistory: '프로젝트',
  projectHistoryEstimated: '예상',
  projectHistoryActual: '실제',

  // Settings section headers
  sectionTimer: '⏱ 타이머',
  sectionAlerts: '🔔 알림',
  sectionAppearance: '🎨 외관',
  sectionGeneral: '⚙ 일반',

  // Empty state
  emptyTodayHint: '오늘은 아직 기록이 없어요',

  // Guide in settings
  settingsGuide: '사용 가이드',

  // Encouragement banner
  encourageEmpty: [
    '수박을 키우고, 집중력도 키우세요 🍉',
    '첫 수박을 심을 준비가 됐나요? 🌱',
    '당신의 수박밭이 기다리고 있어요 🍉',
  ],
  encourageFirst: [
    '수박이 자라기 시작했어요 🌱',
    '첫 수박을 심었어요, 계속 가요!',
    '집중하고 익기를 기다려요 🍉',
  ],
  encourageSecond: [
    '좋은 페이스! 수박 2개 수확',
    '두 번째도 완료, 멋져요 👍',
    '수박밭이 커지고 있어요 🍉',
  ],
  encourageThird: [
    '오늘의 수박은 특별히 달아요 🍉',
    '수박 3개, 대단한 수확!',
    '수박밭이 활기차요 🌱',
  ],
  encourageMany: [
    '{n}개의 수박 수확 — 대단해요!',
    '{n}개의 수박, 놀라운 하루 🔥',
    '{n}개의 수박, 멈출 수 없는 수확! 🍉',
  ],
  encourageBeatYesterday: (count, diff) => `${count}개 완료, 어제보다 ${diff}개 더 많아요 💪`,
  encourageTiedYesterday: (count) => `${count}개 완료, 어제와 같은 페이스`,
  streakShort: (days) => `🔥 ${days}일 연속`,
  streakMedium: (days) => `🔥 ${days}일 연속, 습관이 되어가고 있어요`,
  streakLong: (days) => `🔥 ${days}일 연속! 대단해요!`,

  // Week trend chart
  weekTrend: '이번 주',
  weekTotal: (time) => `총: ${time}`,

  // Long-press buttons
  holdToFinish: '길게 눌러 조기 완료',
  holdToGiveUp: '길게 눌러 포기',

  // Auth
  authTitle: '로그인',
  authEmailPlaceholder: '이메일 주소 입력',
  authSendCode: '코드 전송',
  authSendFailed: '전송 실패, 다시 시도해 주세요',
  authVerifyFailed: '코드가 유효하지 않거나 만료되었습니다',
  authOr: '또는',
  authGoogle: 'Google로 로그인',
  authMicrosoft: 'Microsoft로 로그인',
  authLoginToSync: '로그인하여 데이터 동기화',
  authLogout: '로그아웃',

  // Profile editing
  profileEditName: '이름 변경',
  profileSaving: '저장 중...',
  profileUploadAvatar: '아바타 변경',

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
  sliceHint: '스와이프하여 수박을 잘라보세요 🔪',
  slicePerfect: '✨ 퍼펙트!',
  sliceResult: '🍉 수박 자르기 결과',
  sliceGoldResult: '👑 황금 수박 결과',
  sliceSeedsObtained: (n) => `미스터리 씨앗 ×${n}`,
  slicePerfectBonus: '+1 퍼펙트 보너스',
  sliceRare: '레어',
  sliceCollect: '수확',
  sliceContinue: '🔪 다음 자르기',
  sliceButton: '🔪 자르기',
  itemName: (id) => ({
    'starlight-fertilizer': '⚡ 별빛 비료',
    'supernova-bottle': '☀️ 초신성 에너지 병',
    'alien-flare': '🛸 외계인 신호탄',
    'thief-trap': '🪤 도둑 함정',
    'star-telescope': '🔮 성간 망원경',
    'moonlight-dew': '🌙 달빛 이슬',
    'circus-tent': '🎪 수박 서커스 텐트',
    'gene-modifier': '🧬 유전자 개조액',
    'lullaby-record': '🎵 수박 자장가 레코드',
  }[id] ?? id),
  itemFlavor: (id) => ({
    'starlight-fertilizer': '먼 은하에서 온 신비한 비료, 별의 향기가 난다',
    'supernova-bottle': '초소형 초신성의 폭발 에너지가 담겨 있다',
    'alien-flare': '우주를 향해 "여기 수박 있어요!"라고 외치고 좋은 사람이 오길 기도하자',
    'thief-trap': '평범한 수박처럼 보이지만 사실은 우리',
    'star-telescope': '외계 천문대의 유물이라고 한다',
    'moonlight-dew': '보름달에만 맺히는 신비한 이슬',
    'circus-tent': '지나가던 외계 서커스단이 남기고 간 것',
    'gene-modifier': '변이 박사의 개인 소장품',
    'lullaby-record': '외계인이 녹음한 자장가, 수박이 특별히 빨리 자란다',
  }[id] ?? ''),
  shedSeedsTitle: '🌰 미스터리 씨앗',
  shedSeedsCount: (n) => `×${n}`,
  shedGoFarm: '농장으로 가기',
  shedFarmComingSoon: '농장 곧 오픈',
  shedItemsTitle: '🎒 아이템',
  shedNoItems: '아이템이 없습니다. 수박을 잘라보세요!',
  shedSliceSection: '🔪 자르기',
  shedTotalSliced: '총 자른 수',
  seedQualityLabel: (q) => ({ normal: '일반', epic: '에픽', legendary: '전설' }[q] ?? q),
  comboExpert: '🔪 자르기 달인!',
  comboGod: '⚡ 수박의 신!',

  tabFocus: '집중',
  tabWarehouse: '창고',
  tabFarm: '농장',

  farmPlotsTab: '밭',
  farmCollectionTab: '도감',
  farmTodayFocus: (m) => `오늘 집중 ${m}분`,
  farmPlant: '심기',
  farmHarvest: '수확',
  farmWithered: '시들음',
  farmClear: '정리',
  farmSelectSeed: '씨앗 선택',
  farmSeedHint: '품질이 높을수록 희귀 품종 확률 증가',
  farmNoSeeds: '아직 씨앗이 없어요. 수박을 잘라서 얻어보세요!',
  farmGoSlice: '자르러 가기 🔪',
  farmReveal: '딩! 정체는——',
  farmNewVariety: '새 품종!',
  farmNewFlash: 'NEW',
  farmAlreadyCollected: '이미 수집됨',
  farmStage: (s) => ({ seed: '씨앗기', sprout: '발아기', leaf: '성장기', flower: '개화기', fruit: '결실기' }[s] ?? s),
  farmGoFarm: '농장으로 🌱',

  collectionProgress: (c, t) => `${c}/${t} 수집`,
  collectionLocked: '잠김',
  collectionUnlockHint: (id) => ({
    'flame-crystal': '블루스타 5품종 수집 시 해제',
    'frost-moon': '블루스타 전 품종 수집 시 해제',
    'rainbow': '15품종 수집 시 해제',
    'dark-matter': '20품종 수집 시 해제',
  }[id] ?? '곧 출시'),
  galaxyName: (id) => ({
    'blue-star': '블루스타 (지구)',
    'flame-crystal': '플레임 크리스탈',
    'frost-moon': '프로스트 문',
    'rainbow': '레인보우',
    'dark-matter': '다크 매터',
  }[id] ?? id),
  varietyName: (id) => ({
    'jade-stripe': '비취줄무늬',
    'black-pearl': '블랙펄',
    'honey-bomb': '꿀폭탄',
    'mini-round': '미니동글이',
    'star-moon': '별달수박',
    'golden-heart': '골든하트',
    'ice-sugar-snow': '빙설수박',
    'cube-melon': '큐브멜론',
  }[id] ?? id),
  varietyStory: (id) => ({
    'jade-stripe': '가장 클래식한 수박, 초록 껍질에 하얀 줄무늬',
    'black-pearl': '검은 껍질 아래 가장 달콤한 비밀이 숨어있다',
    'honey-bomb': '달콤함 폭발! 한 입이면 3일간 달콤',
    'mini-round': '손바닥 크기의 귀여운 녀석',
    'star-moon': '짙은 파란 껍질에 달과 별 무늬가 자연스럽게',
    'golden-heart': '자르면 금빛 과육, 마치 황금을 숨긴 듯',
    'ice-sugar-snow': '하얀 과육, 입에서 녹는, 첫눈에만 열리는 전설',
    'cube-melon': '자연적으로 정사각형으로 자라는 기적, 지구에만 존재',
  }[id] ?? ''),
};
