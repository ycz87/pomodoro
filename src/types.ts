export interface PomodoroRecord {
  id: string;
  task: string;
  durationMinutes: number; // how long this pomodoro was
  completedAt: string; // ISO string
  date: string; // YYYY-MM-DD
}

export type SoundType = 'chime' | 'bell' | 'nature';
export type TickType = 'none' | 'classic' | 'soft' | 'mechanical' | 'wooden';

export interface PomodoroSettings {
  workMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  pomodorosPerRound: number;
  sound: SoundType;
  alertDurationSeconds: number; // 1, 3, 5, 10
  tickSound: TickType;
}

export const DEFAULT_SETTINGS: PomodoroSettings = {
  workMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  pomodorosPerRound: 4,
  sound: 'chime',
  alertDurationSeconds: 3,
  tickSound: 'none',
};

// Growth stages based on focus duration
export type GrowthStage = 'seed' | 'sprout' | 'bloom' | 'green' | 'ripe';

export function getGrowthStage(minutes: number): GrowthStage {
  if (minutes < 10) return 'seed';
  if (minutes < 15) return 'sprout';
  if (minutes < 20) return 'bloom';
  if (minutes < 25) return 'green';
  return 'ripe';
}

export const GROWTH_EMOJI: Record<GrowthStage, string> = {
  seed: '🌱',
  sprout: '🌿',
  bloom: '🌸',
  green: '🫒',
  ripe: '🍅',
};

export const GROWTH_LABEL: Record<GrowthStage, string> = {
  seed: '发芽',
  sprout: '幼苗',
  bloom: '开花',
  green: '青果',
  ripe: '成熟',
};
