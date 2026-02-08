import type { Locale } from './i18n';
import { detectLocale } from './i18n';
import type { AlertSoundId } from './audio';
import type { AmbienceMixerConfig } from './audio';
import { defaultMixerConfig } from './audio';

/**
 * 西瓜钟记录 — 每完成一个工作阶段生成一条
 */
export interface PomodoroRecord {
  id: string;
  task: string;
  durationMinutes: number; // 本次专注时长（分钟）
  completedAt: string;     // ISO 时间戳
  date: string;            // YYYY-MM-DD，用于按天筛选
}

// ─── 主题系统 ───
export type ThemeId = 'dark' | 'light' | 'forest' | 'ocean' | 'warm';

export interface ThemeColors {
  bg: string;           // 主背景色
  bgWork: string;       // 工作阶段背景色
  bgBreak: string;      // 休息阶段背景色
  surface: string;      // 卡片/面板背景
  text: string;         // 主文字色
  textMuted: string;    // 次要文字色
  textFaint: string;    // 极淡文字
  accent: string;       // 强调色（工作）
  accentEnd: string;    // 渐变终点色
  breakAccent: string;  // 休息强调色
  breakAccentEnd: string;
  ring: string;         // 进度环基底色 opacity
  inputBg: string;      // 输入框背景
}

export const THEMES: Record<ThemeId, { name: string; colors: ThemeColors }> = {
  dark: {
    name: '经典暗色',
    colors: {
      bg: '#0c0c0f', bgWork: '#100c0c', bgBreak: '#0c0e14',
      surface: '#1a1a20', text: 'rgba(255,255,255,0.9)', textMuted: 'rgba(255,255,255,0.4)',
      textFaint: 'rgba(255,255,255,0.15)', accent: '#ef4444', accentEnd: '#fb923c',
      breakAccent: '#6366f1', breakAccentEnd: '#818cf8', ring: '0.35',
      inputBg: 'rgba(255,255,255,0.04)',
    },
  },
  light: {
    name: '纯净亮色',
    colors: {
      bg: '#f8f8fa', bgWork: '#fef2f2', bgBreak: '#eef2ff',
      surface: '#ffffff', text: 'rgba(0,0,0,0.85)', textMuted: 'rgba(0,0,0,0.45)',
      textFaint: 'rgba(0,0,0,0.12)', accent: '#dc2626', accentEnd: '#f97316',
      breakAccent: '#4f46e5', breakAccentEnd: '#818cf8', ring: '0.15',
      inputBg: 'rgba(0,0,0,0.04)',
    },
  },
  forest: {
    name: '森林绿',
    colors: {
      bg: '#0a120e', bgWork: '#0f1510', bgBreak: '#0a0e14',
      surface: '#141f18', text: 'rgba(220,240,220,0.9)', textMuted: 'rgba(180,210,180,0.5)',
      textFaint: 'rgba(180,210,180,0.15)', accent: '#22c55e', accentEnd: '#86efac',
      breakAccent: '#38bdf8', breakAccentEnd: '#7dd3fc', ring: '0.3',
      inputBg: 'rgba(180,210,180,0.06)',
    },
  },
  ocean: {
    name: '海洋蓝',
    colors: {
      bg: '#0a0e14', bgWork: '#0c1018', bgBreak: '#0e0a14',
      surface: '#141a24', text: 'rgba(200,220,255,0.9)', textMuted: 'rgba(160,190,230,0.5)',
      textFaint: 'rgba(160,190,230,0.15)', accent: '#3b82f6', accentEnd: '#818cf8',
      breakAccent: '#a78bfa', breakAccentEnd: '#c4b5fd', ring: '0.3',
      inputBg: 'rgba(160,190,230,0.06)',
    },
  },
  warm: {
    name: '暖橙色',
    colors: {
      bg: '#12100c', bgWork: '#161210', bgBreak: '#100e14',
      surface: '#201c16', text: 'rgba(255,235,210,0.9)', textMuted: 'rgba(230,200,160,0.5)',
      textFaint: 'rgba(230,200,160,0.15)', accent: '#f97316', accentEnd: '#fbbf24',
      breakAccent: '#a3e635', breakAccentEnd: '#d9f99d', ring: '0.3',
      inputBg: 'rgba(230,200,160,0.06)',
    },
  },
};

/**
 * 用户设置 — 全部持久化到 localStorage
 */
export interface PomodoroSettings {
  workMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  pomodorosPerRound: number;
  // Alert sound
  alertSound: AlertSoundId;
  alertRepeatCount: number;    // 循环次数: 1/2/3/5
  alertVolume: number;         // 0-100
  // Ambience
  ambienceMixer: AmbienceMixerConfig;
  ambienceVolume: number;      // 0-100, master ambience volume
  // Theme & UI
  theme: ThemeId;
  autoStartBreak: boolean;
  autoStartWork: boolean;
  language: Locale;
}

export const DEFAULT_SETTINGS: PomodoroSettings = {
  workMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  pomodorosPerRound: 4,
  alertSound: 'chime',
  alertRepeatCount: 2,
  alertVolume: 80,
  ambienceMixer: defaultMixerConfig(),
  ambienceVolume: 40,
  theme: 'dark',
  autoStartBreak: true,
  autoStartWork: false,
  language: detectLocale(),
};

// ─── Settings migration ───
// Handle old settings format gracefully

export function migrateSettings(raw: unknown): PomodoroSettings {
  if (!raw || typeof raw !== 'object') return DEFAULT_SETTINGS;
  const s = raw as Record<string, unknown>;

  // Start from defaults, overlay known fields
  const result = { ...DEFAULT_SETTINGS };

  // Direct numeric/boolean fields
  if (typeof s.workMinutes === 'number') result.workMinutes = s.workMinutes;
  if (typeof s.shortBreakMinutes === 'number') result.shortBreakMinutes = s.shortBreakMinutes;
  if (typeof s.longBreakMinutes === 'number') result.longBreakMinutes = s.longBreakMinutes;
  if (typeof s.pomodorosPerRound === 'number') result.pomodorosPerRound = s.pomodorosPerRound;
  if (typeof s.alertVolume === 'number') result.alertVolume = s.alertVolume;
  if (typeof s.autoStartBreak === 'boolean') result.autoStartBreak = s.autoStartBreak;
  if (typeof s.autoStartWork === 'boolean') result.autoStartWork = s.autoStartWork;
  if (typeof s.theme === 'string' && s.theme in THEMES) result.theme = s.theme as ThemeId;
  if (typeof s.language === 'string') result.language = s.language as Locale;

  // New alert fields
  if (typeof s.alertSound === 'string') result.alertSound = s.alertSound as AlertSoundId;
  if (typeof s.alertRepeatCount === 'number') result.alertRepeatCount = s.alertRepeatCount;

  // Migrate old 'sound' field → alertSound
  if (typeof s.sound === 'string' && !s.alertSound) {
    result.alertSound = s.sound as AlertSoundId;
  }

  // Migrate old tickVolume → ambienceVolume
  if (typeof s.tickVolume === 'number' && !s.ambienceVolume) {
    result.ambienceVolume = s.tickVolume;
  }
  if (typeof s.ambienceVolume === 'number') result.ambienceVolume = s.ambienceVolume;

  // Ambience mixer
  if (s.ambienceMixer && typeof s.ambienceMixer === 'object') {
    result.ambienceMixer = { ...defaultMixerConfig(), ...(s.ambienceMixer as AmbienceMixerConfig) };
  }

  return result;
}

// ─── 西瓜生长阶段 ───
export type GrowthStage = 'seed' | 'sprout' | 'bloom' | 'green' | 'ripe';

/** 根据专注时长返回生长阶段 */
export function getGrowthStage(minutes: number): GrowthStage {
  if (minutes < 10) return 'seed';
  if (minutes < 15) return 'sprout';
  if (minutes < 20) return 'bloom';
  if (minutes < 25) return 'green';
  return 'ripe';
}

/** 通知文案用的 emoji fallback（系统通知不支持 SVG） */
export const GROWTH_EMOJI: Record<GrowthStage, string> = {
  seed: '🌱', sprout: '🌿', bloom: '🌼', green: '🍈', ripe: '🍉',
};

export const GROWTH_LABEL: Record<GrowthStage, string> = {
  seed: '发芽', sprout: '幼苗', bloom: '开花', green: '青瓜', ripe: '成熟',
};
