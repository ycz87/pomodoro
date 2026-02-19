import type { Messages } from '../types';

const formatDuration = (minutes: number): string => {
  const safeMinutes = Math.max(0, Math.round(minutes));
  if (safeMinutes < 60) return `${safeMinutes}분`;
  if (safeMinutes < 1440) {
    const hours = Math.floor(safeMinutes / 60);
    const remainMinutes = safeMinutes % 60;
    return `${hours}시간 ${remainMinutes}분`;
  }
  const days = Math.floor(safeMinutes / 1440);
  const remainHours = Math.floor((safeMinutes % 1440) / 60);
  return `${days}일 ${remainHours}시간`;
};

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
  farmSelectGalaxy: '은하 선택',
  farmSelectSeed: '씨앗 선택',
  farmSeedHint: '품질이 높을수록 희귀 품종 확률 증가',
  farmNoSeeds: '아직 씨앗이 없어요. 수박을 잘라서 얻어보세요!',
  farmGoSlice: '자르러 가기 🔪',
  farmReveal: '딩! 정체는——',
  farmNewVariety: '새 품종!',
  farmNewFlash: 'NEW',
  farmAlreadyCollected: '이미 수집됨',
  farmStage: (s) => ({ seed: '씨앗기', sprout: '발아기', leaf: '성장기', flower: '개화기', green: '청과기', fruit: '결실기' }[s] ?? s),
  farmGrowthTime: (a, t) => `성장 ${formatDuration(a)} / 필요 ${formatDuration(t)}`,
  farmRemainingTime: (r) => `${formatDuration(r)} 남음`,
  farmFocusBoostHint: '집중하면 더 빨리 자라요 ⚡',
  farmHelpTitle: '🌱 농장 규칙',
  farmHelpPlant: '🌱 심기: 은하와 씨앗 품질을 고르면 성장이 시작됩니다',
  farmHelpGrow: '⏱️ 성장: 순종은 성숙까지 약 10000분이 필요합니다. 집중 시 가속(≤2시간: 10배, >2시간: 20배), 오프라인 시간도 반영됩니다',
  farmHelpHarvest: '🍉 수확: 성숙 후 탭해서 수확하면 품종이 도감에 기록됩니다',
  farmHelpWither: '💀 시듦: 72시간 이상 활동이 없으면 식물이 시듭니다',
  farmHelpUnlock: '🔓 해제: 더 많은 품종을 모으면 새 밭과 은하가 해제됩니다',
  formatDuration,
  farmGoFarm: '농장으로 🌱',
  farmUnlockHint: (n) => `${n}품종 수집 시 해제`,

  starJourneyTitle: '🚀 성간 여정',
  collectionProgress: (c, t) => `${c}/${t} 수집`,
  collectionLocked: '잠김',
  collectionUnlockHint: (id) => ({
    'thick-earth': '기본 해제',
    fire: '두터운 대지 은하 품종 5개 수집 시 해제',
    water: '화염 은하 품종 5개 수집 시 해제',
    wood: '물결 은하 품종 5개 수집 시 해제',
    metal: '초목 은하 품종 5개 수집 시 해제',
    rainbow: '곧 출시',
    'dark-matter': '곧 출시',
  }[id] ?? '곧 출시'),
  galaxyName: (id) => ({
    'thick-earth': '두터운 대지 은하',
    fire: '화염 은하',
    water: '물결 은하',
    wood: '초목 은하',
    metal: '금속 은하',
    'rainbow': '레인보우',
    'dark-matter': '암흑 물질',
  }[id] ?? id),
  varietyName: (id) => ({
    'jade-stripe': '비취줄무늬',
    'black-pearl': '블랙펄',
    'honey-bomb': '허니밤',
    'mini-round': '미니동글이',
    'star-moon': '별달수박',
    'golden-heart': '골든하트',
    'ice-sugar-snow': '빙당설과',
    'cube-melon': '큐브멜론',
    'lava-melon': '용암수박',
    'caramel-crack': '카라멜균열',
    'charcoal-roast': '숯불수박',
    'flame-pattern': '화염무늬수박',
    'molten-core': '용핵수박',
    'sun-stone': '태양석수박',
    'ash-rebirth': '재의환생수박',
    'phoenix-nirvana': '봉황열반수박',
    'snow-velvet': '설융수박',
    'ice-crystal': '빙정수박',
    'tidal-melon': '조수수박',
    'aurora-melon': '오로라수박',
    'moonlight-melon': '월광수박',
    'diamond-melon': '다이아수박',
    'abyss-melon': '심연수박',
    permafrost: '영구동토수박',
    'vine-melon': '덩굴수박',
    'moss-melon': '이끼수박',
    'mycelium-melon': '균사수박',
    'flower-whisper': '꽃속삭임수박',
    'tree-ring': '나이테수박',
    'world-tree': '세계수수박',
    'spirit-root': '정령뿌리수박',
    'all-spirit': '만령수박',
    'golden-armor': '황금갑옷수박',
    'copper-patina': '구리녹수박',
    'tinfoil-melon': '은박수박',
    'galaxy-stripe': '은하무늬수박',
    'mercury-melon': '수은수박',
    'meteorite-melon': '운석철수박',
    'alloy-melon': '합금수박',
    'eternal-melon': '영원수박',
  }[id] ?? id),
  varietyStory: (id) => ({
    'jade-stripe': '대폭발 뒤 가장 먼저 싹튼 품종으로, 원초 수박의 흰 줄을 간직했다.',
    'black-pearl': '깊은 흑토에서 자라 대지의 정수를 검은 껍질에 품었다.',
    'honey-bomb': '햇빛의 당분을 과육에 가둬 폭발적인 단맛을 낸다.',
    'mini-round': '적도 중력이 이 수박을 완벽한 작은 구체로 만든다.',
    'star-moon': '두 개의 달빛이 밤마다 껍질에 별과 달 무늬를 새긴다.',
    'golden-heart': '금맥에 닿은 뿌리가 과육을 눈부신 금빛으로 물들인다.',
    'ice-sugar-snow': '천년에 한 번 내리는 극지 눈날에만 하얀 열매를 맺는다.',
    'cube-melon': '원초 조각의 정육면체 유전자를 그대로 간직한 유일한 품종이다.',
    'lava-melon': '화구 가장자리에서 자라며 주황빛 과육이 용암처럼 흐른다.',
    'caramel-crack': '지표의 열로 껍질이 갈라지고 캐러멜빛 즙이 스며 나온다.',
    'charcoal-roast': '지열 분기공 곁에서 자연스럽게 익어 은은한 훈연 향을 남긴다.',
    'flame-pattern': '화염 폭풍기에서만 결실하며 껍질 무늬가 굳은 불꽃 같다.',
    'molten-core': '빛나는 용핵이 행성 중심에서 끌어온 에너지를 저장한다.',
    'sun-stone': '항성 파편을 흡수해 완전한 암흑에서도 계속 빛난다.',
    'ash-rebirth': '분화 뒤의 재에서만 싹트며 파괴를 지나 다시 태어난다.',
    'phoenix-nirvana': '전설에 따르면 봉황의 불꽃이 시들지 않는 씨앗을 남겼다.',
    'snow-velvet': '서리꽃이 껍질을 덮어 손끝에 얼음 같은 차가움을 남긴다.',
    'ice-crystal': '빙하 균열에서 자라 반투명 껍질 너머 푸른 과육이 비친다.',
    'tidal-melon': '과육의 결이 얼음 아래 조수의 흐름에 맞춰 움직인다.',
    'aurora-melon': '극지 자기장이 빛을 굴절시켜 오로라 색을 껍질에 띄운다.',
    'moonlight-melon': '긴 극야에 익어 달빛을 머금은 은백색으로 빛난다.',
    'diamond-melon': '초고압이 천연 결정을 만들어 다이아보다 희귀하다고 전해진다.',
    'abyss-melon': '얼음 바다 최심부에서 자라 차가운 푸른빛을 스스로 낸다.',
    permafrost: '영하 200도에서도 이 후손은 완전히 얼어붙지 않는다.',
    'vine-melon': '살아 있는 덩굴이 스스로 뻗어 지지대를 감아 자란다.',
    'moss-melon': '짙은 이끼가 숲 그늘에서 모습을 완벽히 숨긴다.',
    'mycelium-melon': '뿌리가 균사 네트워크와 연결되어 숲 전체를 감지한다.',
    'flower-whisper': '꽃향기로 신호를 보내 농부에게 자신의 상태를 알려 준다.',
    'tree-ring': '과육의 나이테마다 한 계절의 이야기가 기록된다.',
    'world-tree': '세계수의 가장 높은 수관에서만 이 열매가 열린다.',
    'spirit-root': '깊은 뿌리가 행성의 생명력을 빨아들여 한입마다 대지의 맥박이 들린다.',
    'all-spirit': '원초 목편의 씨앗에서 태어나 모든 생명의 언어를 들려준다.',
    'golden-armor': '갑옷 같은 껍질은 전용 합금 칼날로만 가를 수 있다.',
    'copper-patina': '초록빛 녹청은 노화가 아니라 고대 광석을 닮은 위장이다.',
    'tinfoil-melon': '은박처럼 얇은 껍질이 질기고 두드리면 맑은 금속음이 난다.',
    'galaxy-stripe': '은하 소용돌이 무늬는 행성 자기장이 남긴 자국이다.',
    'mercury-melon': '수은 같은 과육은 흘러나와도 곧 다시 스스로 모인다.',
    'meteorite-melon': '운석구에서 자라 우주 금속의 열을 흡수한다.',
    'alloy-melon': '희귀 금속 미량원소가 많아 광부들의 귀한 영양원이 된다.',
    'eternal-melon': '원초 금 조각이 핵에서 단련되어 영원히 썩지 않는 열매가 되었다.',
  }[id] ?? ''),
  varietyDetailTitle: '품종 상세',
  varietyDetailFirstObtained: '첫 획득일',
  varietyDetailHarvestCount: (count) => `누적 수확 ${count}회`,
  varietyDetailClose: '닫기',
  geneLabTab: '🧬 연구소',
  geneLabTitle: '유전자 인벤토리',
  geneLabEmpty: '아직 유전자 조각이 없습니다. 품종을 수확하면 자동으로 획득됩니다.',
  geneLabFragments: '유전자 조각',
  geneLabFragmentCount: (count) => `${count}개`,
  geneLabVarietySource: '원본 품종',
  geneLabObtainedAt: '획득일',
  geneLabGalaxySection: (galaxyName, count) => `${galaxyName} · ${count}개`,
  geneInjectTitle: '유전자 주입',
  geneInjectDesc: '유전자 조각을 씨앗에 주입하여 특정 성계 품종을 목표로 합니다',
  geneInjectSelectGalaxy: '성계 유전자 선택',
  geneInjectSelectSeed: '씨앗 품질 선택',
  geneInjectButton: '🧬 주입',
  geneInjectSuccess: '주입 성공! 주입 씨앗 획득',
  geneInjectNoFragments: '유전자 조각 없음',
  geneInjectNoSeeds: '씨앗 없음',
  geneInjectCost: '소모: 유전자 조각 1개 + 씨앗 1개',
  injectedSeedLabel: (galaxyName) => `🧬 주입 씨앗 (${galaxyName})`,
  injectedSeedHint: '주입 씨앗: 80% 확률로 목표 성계 품종',
};
