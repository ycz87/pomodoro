/**
 * 农场系统类型定义
 *
 * 品种、地块、图鉴、农场存储。
 */
import type { SeedQuality } from './slicing';

// ─── 星系 ───
export type GalaxyId = 'thick-earth' | 'fire' | 'water' | 'wood' | 'metal' | 'rainbow' | 'dark-matter';

export interface GalaxyDef {
  id: GalaxyId;
  emoji: string;
  unlockCondition: string; // 描述性，解锁顺序由数据定义
}

export const GALAXIES: GalaxyDef[] = [
  { id: 'thick-earth', emoji: '🌍', unlockCondition: 'default' },
  { id: 'fire', emoji: '🔥', unlockCondition: 'collect-5-thick-earth' },
  { id: 'water', emoji: '💧', unlockCondition: 'collect-5-fire' },
  { id: 'wood', emoji: '🌿', unlockCondition: 'collect-5-water' },
  { id: 'metal', emoji: '✨', unlockCondition: 'collect-5-wood' },
  { id: 'rainbow', emoji: '🌈', unlockCondition: 'collect-5-metal' },
  { id: 'dark-matter', emoji: '🌑', unlockCondition: 'collect-all' },
];

// ─── 稀有度 ───
export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

export const RARITY_STARS: Record<Rarity, number> = {
  common: 1, rare: 2, epic: 3, legendary: 4,
};

export const RARITY_COLOR: Record<Rarity, string> = {
  common: '#4ade80',   // 绿
  rare: '#60a5fa',     // 蓝
  epic: '#a78bfa',     // 紫
  legendary: '#fbbf24', // 金
};

// ─── 品种 ───
export type BreedType = 'pure' | 'hybrid' | 'prismatic';

export type VarietyId =
  // 厚土星系 8 个
  | 'jade-stripe' | 'black-pearl' | 'honey-bomb' | 'mini-round'
  | 'star-moon' | 'golden-heart' | 'ice-sugar-snow' | 'cube-melon'
  // 火星系 8 个
  | 'lava-melon' | 'caramel-crack' | 'charcoal-roast' | 'flame-pattern'
  | 'molten-core' | 'sun-stone' | 'ash-rebirth' | 'phoenix-nirvana'
  // 水星系 8 个
  | 'snow-velvet' | 'ice-crystal' | 'tidal-melon' | 'aurora-melon'
  | 'moonlight-melon' | 'diamond-melon' | 'abyss-melon' | 'permafrost'
  // 木星系 8 个
  | 'vine-melon' | 'moss-melon' | 'mycelium-melon' | 'flower-whisper'
  | 'tree-ring' | 'world-tree' | 'spirit-root' | 'all-spirit'
  // 金星系 8 个
  | 'golden-armor' | 'copper-patina' | 'tinfoil-melon' | 'galaxy-stripe'
  | 'mercury-melon' | 'meteorite-melon' | 'alloy-melon' | 'eternal-melon';

export interface VarietyDef {
  id: VarietyId;
  galaxy: GalaxyId;
  rarity: Rarity;
  dropRate: number;  // 基础掉率（0-1）
  emoji: string;
  breedType: BreedType;
  matureMinutes: number;
}

const PURE_MATURE_MINUTES = 10000;

/** Phase 2 品种定义（当前全部为 pure） */
export const VARIETY_DEFS: Record<VarietyId, VarietyDef> = {
  // thick-earth
  'jade-stripe': {
    id: 'jade-stripe', galaxy: 'thick-earth', rarity: 'common', dropRate: 0.15, emoji: '🍉',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES,
  },
  'black-pearl': {
    id: 'black-pearl', galaxy: 'thick-earth', rarity: 'common', dropRate: 0.13, emoji: '🖤',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES,
  },
  'honey-bomb': {
    id: 'honey-bomb', galaxy: 'thick-earth', rarity: 'common', dropRate: 0.12, emoji: '🍯',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES,
  },
  'mini-round': {
    id: 'mini-round', galaxy: 'thick-earth', rarity: 'rare', dropRate: 0.07, emoji: '🔴',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES,
  },
  'star-moon': {
    id: 'star-moon', galaxy: 'thick-earth', rarity: 'rare', dropRate: 0.06, emoji: '🌙',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES,
  },
  'golden-heart': {
    id: 'golden-heart', galaxy: 'thick-earth', rarity: 'epic', dropRate: 0.03, emoji: '💛',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES,
  },
  'ice-sugar-snow': {
    id: 'ice-sugar-snow', galaxy: 'thick-earth', rarity: 'epic', dropRate: 0.02, emoji: '❄️',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES,
  },
  'cube-melon': {
    id: 'cube-melon', galaxy: 'thick-earth', rarity: 'legendary', dropRate: 0.01, emoji: '🧊',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES,
  },

  // fire
  'lava-melon': {
    id: 'lava-melon', galaxy: 'fire', rarity: 'common', dropRate: 0.15, emoji: '🌋',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES,
  },
  'caramel-crack': {
    id: 'caramel-crack', galaxy: 'fire', rarity: 'common', dropRate: 0.13, emoji: '🍮',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES,
  },
  'charcoal-roast': {
    id: 'charcoal-roast', galaxy: 'fire', rarity: 'common', dropRate: 0.12, emoji: '🔥',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES,
  },
  'flame-pattern': {
    id: 'flame-pattern', galaxy: 'fire', rarity: 'rare', dropRate: 0.07, emoji: '🔶',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES,
  },
  'molten-core': {
    id: 'molten-core', galaxy: 'fire', rarity: 'rare', dropRate: 0.06, emoji: '💎',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES,
  },
  'sun-stone': {
    id: 'sun-stone', galaxy: 'fire', rarity: 'epic', dropRate: 0.03, emoji: '☀️',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES,
  },
  'ash-rebirth': {
    id: 'ash-rebirth', galaxy: 'fire', rarity: 'epic', dropRate: 0.02, emoji: '🌅',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES,
  },
  'phoenix-nirvana': {
    id: 'phoenix-nirvana', galaxy: 'fire', rarity: 'legendary', dropRate: 0.01, emoji: '🦅',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES,
  },

  // water
  'snow-velvet': {
    id: 'snow-velvet', galaxy: 'water', rarity: 'common', dropRate: 0.15, emoji: '🤍',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES,
  },
  'ice-crystal': {
    id: 'ice-crystal', galaxy: 'water', rarity: 'common', dropRate: 0.13, emoji: '💠',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES,
  },
  'tidal-melon': {
    id: 'tidal-melon', galaxy: 'water', rarity: 'common', dropRate: 0.12, emoji: '🌊',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES,
  },
  'aurora-melon': {
    id: 'aurora-melon', galaxy: 'water', rarity: 'rare', dropRate: 0.07, emoji: '🌌',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES,
  },
  'moonlight-melon': {
    id: 'moonlight-melon', galaxy: 'water', rarity: 'rare', dropRate: 0.06, emoji: '🌕',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES,
  },
  'diamond-melon': {
    id: 'diamond-melon', galaxy: 'water', rarity: 'epic', dropRate: 0.03, emoji: '💎',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES,
  },
  'abyss-melon': {
    id: 'abyss-melon', galaxy: 'water', rarity: 'epic', dropRate: 0.02, emoji: '🫧',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES,
  },
  'permafrost': {
    id: 'permafrost', galaxy: 'water', rarity: 'legendary', dropRate: 0.01, emoji: '🧊',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES,
  },

  // wood
  'vine-melon': {
    id: 'vine-melon', galaxy: 'wood', rarity: 'common', dropRate: 0.15, emoji: '🌱',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES,
  },
  'moss-melon': {
    id: 'moss-melon', galaxy: 'wood', rarity: 'common', dropRate: 0.13, emoji: '🍀',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES,
  },
  'mycelium-melon': {
    id: 'mycelium-melon', galaxy: 'wood', rarity: 'common', dropRate: 0.12, emoji: '🍄',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES,
  },
  'flower-whisper': {
    id: 'flower-whisper', galaxy: 'wood', rarity: 'rare', dropRate: 0.07, emoji: '🌸',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES,
  },
  'tree-ring': {
    id: 'tree-ring', galaxy: 'wood', rarity: 'rare', dropRate: 0.06, emoji: '🪵',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES,
  },
  'world-tree': {
    id: 'world-tree', galaxy: 'wood', rarity: 'epic', dropRate: 0.03, emoji: '🌳',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES,
  },
  'spirit-root': {
    id: 'spirit-root', galaxy: 'wood', rarity: 'epic', dropRate: 0.02, emoji: '🌿',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES,
  },
  'all-spirit': {
    id: 'all-spirit', galaxy: 'wood', rarity: 'legendary', dropRate: 0.01, emoji: '🧚',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES,
  },

  // metal
  'golden-armor': {
    id: 'golden-armor', galaxy: 'metal', rarity: 'common', dropRate: 0.15, emoji: '🛡️',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES,
  },
  'copper-patina': {
    id: 'copper-patina', galaxy: 'metal', rarity: 'common', dropRate: 0.13, emoji: '🪙',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES,
  },
  'tinfoil-melon': {
    id: 'tinfoil-melon', galaxy: 'metal', rarity: 'common', dropRate: 0.12, emoji: '🔔',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES,
  },
  'galaxy-stripe': {
    id: 'galaxy-stripe', galaxy: 'metal', rarity: 'rare', dropRate: 0.07, emoji: '🌀',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES,
  },
  'mercury-melon': {
    id: 'mercury-melon', galaxy: 'metal', rarity: 'rare', dropRate: 0.06, emoji: '🪩',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES,
  },
  'meteorite-melon': {
    id: 'meteorite-melon', galaxy: 'metal', rarity: 'epic', dropRate: 0.03, emoji: '☄️',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES,
  },
  'alloy-melon': {
    id: 'alloy-melon', galaxy: 'metal', rarity: 'epic', dropRate: 0.02, emoji: '⚙️',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES,
  },
  'eternal-melon': {
    id: 'eternal-melon', galaxy: 'metal', rarity: 'legendary', dropRate: 0.01, emoji: '👑',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES,
  },
};

export const THICK_EARTH_VARIETIES: VarietyId[] = [
  'jade-stripe', 'black-pearl', 'honey-bomb', 'mini-round',
  'star-moon', 'golden-heart', 'ice-sugar-snow', 'cube-melon',
];

export const FIRE_VARIETIES: VarietyId[] = [
  'lava-melon', 'caramel-crack', 'charcoal-roast', 'flame-pattern',
  'molten-core', 'sun-stone', 'ash-rebirth', 'phoenix-nirvana',
];

export const WATER_VARIETIES: VarietyId[] = [
  'snow-velvet', 'ice-crystal', 'tidal-melon', 'aurora-melon',
  'moonlight-melon', 'diamond-melon', 'abyss-melon', 'permafrost',
];

export const WOOD_VARIETIES: VarietyId[] = [
  'vine-melon', 'moss-melon', 'mycelium-melon', 'flower-whisper',
  'tree-ring', 'world-tree', 'spirit-root', 'all-spirit',
];

export const METAL_VARIETIES: VarietyId[] = [
  'golden-armor', 'copper-patina', 'tinfoil-melon', 'galaxy-stripe',
  'mercury-melon', 'meteorite-melon', 'alloy-melon', 'eternal-melon',
];

// 兼容旧逻辑：蓝星品种等价于 thick-earth 品种池
export const BLUE_STAR_VARIETIES: VarietyId[] = THICK_EARTH_VARIETIES;

export const GALAXY_VARIETIES: Record<GalaxyId, VarietyId[]> = {
  'thick-earth': THICK_EARTH_VARIETIES,
  fire: FIRE_VARIETIES,
  water: WATER_VARIETIES,
  wood: WOOD_VARIETIES,
  metal: METAL_VARIETIES,
  rainbow: [],
  'dark-matter': [],
};

export const ALL_VARIETY_IDS: VarietyId[] = [
  ...THICK_EARTH_VARIETIES,
  ...FIRE_VARIETIES,
  ...WATER_VARIETIES,
  ...WOOD_VARIETIES,
  ...METAL_VARIETIES,
];

// ─── 生长阶段 ───
export type GrowthStage = 'seed' | 'sprout' | 'leaf' | 'flower' | 'fruit';

export interface StageDef {
  id: GrowthStage;
  threshold: number; // 进度阈值 (0-1)
  emoji: string;
}

export const GROWTH_STAGES: StageDef[] = [
  { id: 'seed',   threshold: 0,    emoji: '🌰' },
  { id: 'sprout', threshold: 0.20, emoji: '🌱' },
  { id: 'leaf',   threshold: 0.50, emoji: '🌿' },
  { id: 'flower', threshold: 0.75, emoji: '🌼' },
  { id: 'fruit',  threshold: 1.00, emoji: '🍉' },
];

// ─── 地块 ───
export type PlotState = 'empty' | 'growing' | 'mature' | 'withered';

export interface Plot {
  id: number;
  state: PlotState;
  seedQuality?: SeedQuality;
  varietyId?: VarietyId;
  progress: number;       // 0-1
  accumulatedMinutes: number; // 累积成长分钟（Phase 2）
  plantedDate?: string;   // ISO date
  lastUpdateDate?: string; // ISO date (最后一次生长更新)
  lastActivityTimestamp: number; // 最近活跃时间戳（ms）
}

export function createEmptyPlot(id: number): Plot {
  return {
    id,
    state: 'empty',
    progress: 0,
    accumulatedMinutes: 0,
    lastActivityTimestamp: 0,
  };
}

// ─── 图鉴 ───
export interface CollectedVariety {
  varietyId: VarietyId;
  firstObtainedDate: string;
  count: number;
}

// ─── 农场存储 ───
export interface FarmStorage {
  plots: Plot[];
  collection: CollectedVariety[];
  lastActiveDate: string; // YYYY-MM-DD
  consecutiveInactiveDays: number; // 连续未活跃天数（用于枯萎检测）
  lastActivityTimestamp: number; // 最近活跃时间戳（ms）
}

export const DEFAULT_FARM_STORAGE: FarmStorage = {
  plots: [0, 1, 2, 3].map(createEmptyPlot),
  collection: [],
  lastActiveDate: '',
  consecutiveInactiveDays: 0,
  lastActivityTimestamp: 0,
};

export const PLOT_MILESTONES = [
  { requiredVarieties: 0, totalPlots: 4 },
  { requiredVarieties: 3, totalPlots: 5 },
  { requiredVarieties: 5, totalPlots: 6 },
  { requiredVarieties: 8, totalPlots: 7 },
  { requiredVarieties: 15, totalPlots: 8 },
  { requiredVarieties: 22, totalPlots: 9 },
];
