export interface PomodoroRecord {
  id: string;
  task: string;
  completedAt: string; // ISO string
  date: string; // YYYY-MM-DD
}

export type SoundType = 'chime' | 'bell' | 'nature';

export interface PomodoroSettings {
  workMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  pomodorosPerRound: number; // default 4
  sound: SoundType;
}

export const DEFAULT_SETTINGS: PomodoroSettings = {
  workMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  pomodorosPerRound: 4,
  sound: 'chime',
};

export const WORK_OPTIONS = [15, 20, 25, 30, 45, 60];
export const SHORT_BREAK_OPTIONS = [3, 5, 10];
export const LONG_BREAK_OPTIONS = [10, 15, 20, 30];
