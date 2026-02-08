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

// ─── 音效类型 ───
export type SoundType = 'chime' | 'bell' | 'nature';
export type TickType = 'none' | 'classic' | 'soft' | 'mechanical' | 'wooden';

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
  sound: SoundType;
  alertDurationSeconds: number;
  tickSound: TickType;
  alertVolume: number;   // 0-100，提示音音量
  tickVolume: number;    // 0-100，背景音音量
  theme: ThemeId;
  autoStartBreak: boolean;   // 工作结束后自动开始休息
  autoStartWork: boolean;    // 休息结束后自动开始工作
}

export const DEFAULT_SETTINGS: PomodoroSettings = {
  workMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  pomodorosPerRound: 4,
  sound: 'chime',
  alertDurationSeconds: 3,
  tickSound: 'none',
  alertVolume: 80,
  tickVolume: 40,
  theme: 'dark',
  autoStartBreak: true,
  autoStartWork: false,
};

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
