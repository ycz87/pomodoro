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
  /** 完成状态：completed=正常完成, abandoned=中途退出。旧记录无此字段视为 completed */
  status?: 'completed' | 'abandoned';
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
  ring: string;         // 进度环基底色 opacity（fallback）
  ringBase?: string;    // 进度环底圈显式颜色（覆盖 accent+ring opacity）
  ringBaseEnd?: string; // 进度环底圈渐变终点色
  inputBg: string;      // 输入框背景
  border: string;       // 分割线/边框色
  focusLabel?: string;  // Focus 标签胶囊背景色（可选）
}

export const THEMES: Record<ThemeId, { name: string; colors: ThemeColors }> = {
  dark: {
    name: '经典暗色',
    colors: {
      bg: '#111114', bgWork: '#141012', bgBreak: '#101218',
      surface: '#1c1c24', text: 'rgba(255,255,255,0.9)', textMuted: 'rgba(255,255,255,0.55)',
      textFaint: 'rgba(255,255,255,0.3)', accent: '#FF3B5C', accentEnd: '#FF6B8A',
      breakAccent: '#6366f1', breakAccentEnd: '#818cf8', ring: '0.35',
      ringBase: '#2D5A27', ringBaseEnd: '#1a3d18',
      focusLabel: 'rgba(76,175,80,0.15)',
      inputBg: 'rgba(255,255,255,0.04)',
      border: 'rgba(255,255,255,0.08)',
    },
  },
  light: {
    name: '纯净亮色',
    colors: {
      bg: '#f8f8fa', bgWork: '#fef2f2', bgBreak: '#eef2ff',
      surface: '#ffffff', text: 'rgba(0,0,0,0.87)', textMuted: 'rgba(0,0,0,0.65)',
      textFaint: 'rgba(0,0,0,0.35)', accent: '#dc2626', accentEnd: '#f97316',
      breakAccent: '#4f46e5', breakAccentEnd: '#818cf8', ring: '0.15',
      inputBg: 'rgba(0,0,0,0.06)',
      border: 'rgba(0,0,0,0.10)',
    },
  },
  forest: {
    name: '森林绿',
    colors: {
      bg: '#0a120e', bgWork: '#0f1510', bgBreak: '#0a0e14',
      surface: '#141f18', text: 'rgba(220,240,220,0.9)', textMuted: 'rgba(180,210,180,0.65)',
      textFaint: 'rgba(180,210,180,0.3)', accent: '#22c55e', accentEnd: '#86efac',
      breakAccent: '#38bdf8', breakAccentEnd: '#7dd3fc', ring: '0.3',
      inputBg: 'rgba(180,210,180,0.06)',
      border: 'rgba(180,210,180,0.1)',
    },
  },
  ocean: {
    name: '海洋蓝',
    colors: {
      bg: '#0a0e14', bgWork: '#0c1018', bgBreak: '#0e0a14',
      surface: '#141a24', text: 'rgba(200,220,255,0.9)', textMuted: 'rgba(160,190,230,0.65)',
      textFaint: 'rgba(160,190,230,0.3)', accent: '#3b82f6', accentEnd: '#818cf8',
      breakAccent: '#a78bfa', breakAccentEnd: '#c4b5fd', ring: '0.3',
      inputBg: 'rgba(160,190,230,0.06)',
      border: 'rgba(160,190,230,0.1)',
    },
  },
  warm: {
    name: '暖橙色',
    colors: {
      bg: '#12100c', bgWork: '#161210', bgBreak: '#100e14',
      surface: '#201c16', text: 'rgba(255,235,210,0.9)', textMuted: 'rgba(230,200,160,0.65)',
      textFaint: 'rgba(230,200,160,0.3)', accent: '#f97316', accentEnd: '#fbbf24',
      breakAccent: '#a3e635', breakAccentEnd: '#d9f99d', ring: '0.3',
      inputBg: 'rgba(230,200,160,0.06)',
      border: 'rgba(230,200,160,0.1)',
    },
  },
};

/**
 * 用户设置 — 全部持久化到 localStorage
 */
export interface PomodoroSettings {
  workMinutes: number;
  shortBreakMinutes: number;
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
  // Migrate old longBreakMinutes/pomodorosPerRound — just ignore them
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
export type GrowthStage = 'seed' | 'sprout' | 'bloom' | 'green' | 'ripe' | 'legendary';

/** 根据专注时长返回生长阶段（不含 legendary 概率判定） */
export function getGrowthStage(minutes: number): GrowthStage {
  if (minutes < 5) return 'seed'; // <5min 在调用侧判断是否给收获物
  if (minutes < 15) return 'seed';
  if (minutes < 25) return 'sprout';
  if (minutes < 45) return 'bloom';
  if (minutes < 60) return 'green';
  if (minutes < 90) return 'ripe';
  return 'ripe'; // ≥90min 默认 ripe，legendary 由概率判定
}

/** 判定 ≥90min 是否触发金西瓜（10% 概率 + 保底） */
export function rollLegendary(pityCount: number): boolean {
  if (pityCount >= 20) return true; // 保底
  return Math.random() < 0.1;       // 10% 概率
}

/** 通知文案用的 emoji fallback（系统通知不支持 SVG） */
export const GROWTH_EMOJI: Record<GrowthStage, string> = {
  seed: '🌱', sprout: '🌿', bloom: '🌼', green: '🍈', ripe: '🍉', legendary: '👑',
};

export const GROWTH_LABEL: Record<GrowthStage, string> = {
  seed: '发芽', sprout: '幼苗', bloom: '开花', green: '青瓜', ripe: '成熟', legendary: '金西瓜',
};

// ─── 仓库系统 ───
export interface Warehouse {
  items: Record<GrowthStage, number>;
  legendaryPity: number;   // 连续未出金西瓜次数
  totalCollected: number;  // 历史总收获数
}

export const DEFAULT_WAREHOUSE: Warehouse = {
  items: { seed: 0, sprout: 0, bloom: 0, green: 0, ripe: 0, legendary: 0 },
  legendaryPity: 0,
  totalCollected: 0,
};

// ─── 合成配方 ───
export interface SynthesisRecipe {
  from: GrowthStage;
  to: GrowthStage;
  cost: number;
}

export const SYNTHESIS_RECIPES: SynthesisRecipe[] = [
  { from: 'seed', to: 'sprout', cost: 20 },
  { from: 'sprout', to: 'bloom', cost: 15 },
  { from: 'bloom', to: 'green', cost: 10 },
  { from: 'green', to: 'ripe', cost: 5 },
];
