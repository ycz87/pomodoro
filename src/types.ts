export interface PomodoroRecord {
  id: string;
  task: string;
  durationMinutes: number; // how long this pomodoro was
  completedAt: string; // ISO string
  date: string; // YYYY-MM-DD
}

export type SoundType = 'chime' | 'bell' | 'nature';

export interface PomodoroSettings {
  workMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  pomodorosPerRound: number;
  sound: SoundType;
}

export const DEFAULT_SETTINGS: PomodoroSettings = {
  workMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  pomodorosPerRound: 4,
  sound: 'chime',
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
