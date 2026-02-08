import type { AmbienceSoundId } from '../audio';
import type { AlertSoundId } from '../audio';

/** 翻译字典类型定义 */
export interface Messages {
  appName: string;
  appNameShort: string;
  phaseWork: string;
  phaseShortBreak: string;
  phaseLongBreak: string;
  abandon: string;
  quickTimeHint: string;
  taskPlaceholder: string;
  clearTask: string;
  emptyTitle: string;
  emptySubtitle: string;
  todayRecords: string;
  unnamed: string;
  editHint: string;
  deleteConfirm: string;
  todayHarvest: string;
  totalFocus: (time: string) => string;
  workComplete: (emoji: string) => string;
  skipComplete: (emoji: string) => string;
  breakOver: string;
  breakOverBody: string;
  longBreakOver: string;
  longBreakOverBody: string;
  celebrationRipe: readonly string[];
  celebrationShort: readonly string[];
  settings: string;
  timerRunningHint: string;
  workDuration: string;
  shortBreak: string;
  longBreak: string;
  longBreakInterval: string;
  autoStartBreak: string;
  autoStartWork: string;

  // Alert sound
  alertSound: string;
  alertRepeatCount: string;
  alertVolume: string;
  alertCustomize: string;
  repeatTimes: (n: number) => string;

  // Ambience
  focusAmbience: string;
  ambienceVolume: string;
  ambienceCustomize: string;
  ambienceOff: string;
  ambienceCategoryNature: string;
  ambienceCategoryEnvironment: string;
  ambienceCategoryNoise: string;

  // Ambience sound names
  ambienceNames: Record<AmbienceSoundId, string>;

  // Alert sound names
  alertNames: Record<AlertSoundId, string>;

  // Modal
  modalClose: string;
  modalDone: string;

  theme: string;
  language: string;
  exportData: string;
  minutes: string;
  seconds: string;

  // Theme names
  themeDark: string;
  themeLight: string;
  themeForest: string;
  themeOcean: string;
  themeWarm: string;

  // Growth stages
  stageSeed: string;
  stageSprout: string;
  stageBloom: string;
  stageGreen: string;
  stageRipe: string;

  // Guide
  guideTitle: string;
  guidePomodoro: string;
  guidePomodoroDesc: string;
  guideBasic: string;
  guideBasicItems: readonly string[];
  guideGrowth: string;
  guideGrowthDesc: string;
  guideGrowthStages: readonly string[];
  guideSettings: string;
  guideSettingsDesc: string;
  guideStart: string;

  // Install prompt
  installTitle: string;
  installDesc: string;
  installButton: string;

  // History panel
  historyTab: string;
  statsTab: string;
  streakBanner: (days: number) => string;
  noRecords: string;
  today: string;
  yesterday: string;
  dateFormat: (m: number, d: number) => string;

  // Stats
  currentStreak: string;
  longestStreak: string;
  focusTrend: string;
  thisWeek: string;
  thisMonth: string;
  totalTime: string;
  totalCount: string;
  countUnit: (n: number) => string;
  formatMinutes: (mins: number) => string;
  weekdays: readonly string[];
  weekdaysShort: readonly string[];
  monthFormat: (year: number, month: number) => string;
}
