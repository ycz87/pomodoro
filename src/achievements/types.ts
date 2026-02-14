/**
 * Achievement system types — v0.17.0
 */

export type AchievementSeries = 'streak' | 'focus' | 'house' | 'farm' | 'hidden';

export interface AchievementDef {
  id: string;
  series: AchievementSeries;
  nameZh: string;
  nameEn: string;
  descZh: string;
  descEn: string;
  conditionZh?: string;  // unlock condition text (for display)
  conditionEn?: string;
  emoji: string;         // placeholder icon
  /** For progress-based achievements */
  target?: number;
  progressKey?: string;  // key in AchievementProgress to show progress bar
}

export interface AchievementProgress {
  totalFocusMinutes: number;
  maxStreak: number;
  currentStreak: number;
  totalSessions: number;
  totalProjects: number;
  totalDays: number;
  firstUseDate: string;       // ISO date string
  // Daily tracking
  lastCheckInDate: string;    // YYYY-MM-DD
  todaySessions: number;
  // Weekend warrior tracking
  weekendSatDone: boolean;
  weekendSunDone: boolean;
  weekendWeekKey: string;     // YYYY-WW to track which week
  // Perfectionist tracking (X4)
  consecutiveCompleted: number;
  // Sound explorer tracking (X3)
  soundComboDays: string[];   // last 7 dates with unique combos
  soundComboHashes: string[]; // hash of combo used each day
}

export interface AchievementData {
  unlocked: Record<string, string>;  // id -> ISO timestamp
  progress: AchievementProgress;
  seen: string[];                     // ids user has viewed
}

export const DEFAULT_PROGRESS: AchievementProgress = {
  totalFocusMinutes: 0,
  maxStreak: 0,
  currentStreak: 0,
  totalSessions: 0,
  totalProjects: 0,
  totalDays: 0,
  firstUseDate: '',
  lastCheckInDate: '',
  todaySessions: 0,
  weekendSatDone: false,
  weekendSunDone: false,
  weekendWeekKey: '',
  consecutiveCompleted: 0,
  soundComboDays: [],
  soundComboHashes: [],
};

export const DEFAULT_ACHIEVEMENT_DATA: AchievementData = {
  unlocked: {},
  progress: { ...DEFAULT_PROGRESS },
  seen: [],
};

/** Series display config */
export const SERIES_CONFIG: Record<AchievementSeries, {
  emoji: string;
  color: string;
  colorEnd?: string;
  count: number;
  comingSoon?: boolean;
}> = {
  streak: { emoji: '⭐️', color: '#FF8C42', count: 10 },
  focus:  { emoji: '⏱️', color: '#FF3B5C', count: 10 },
  house:  { emoji: '🏠', color: '#4CAF50', count: 10, comingSoon: true },
  farm:   { emoji: '🌱', color: '#8D6E63', count: 8, comingSoon: true },
  hidden: { emoji: '🌟', color: '#FFD700', colorEnd: '#9C27B0', count: 6 },
};
