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
export type BreedType = 'pure' | 'hybrid' | 'prismatic' | 'dark-matter';
export type HybridGalaxyPair =
  | 'earth-fire' | 'earth-water' | 'earth-wood' | 'earth-metal'
  | 'fire-water' | 'fire-wood' | 'fire-metal'
  | 'water-wood' | 'water-metal'
  | 'wood-metal';

export type DarkMatterVarietyId = 'void-melon' | 'blackhole-melon' | 'cosmic-heart';

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
  | 'mercury-melon' | 'meteorite-melon' | 'alloy-melon' | 'eternal-melon'
  // 幻彩星系 5 个
  | 'prism-melon' | 'bubble-melon' | 'nebula-melon' | 'aurora-cascade' | 'dream-melon'
  // 暗物质星系 3 个
  | 'void-melon' | 'blackhole-melon' | 'cosmic-heart'
  // 杂交品种 30 个（10 组 x 3）
  | 'lava-field' | 'volcanic-ash' | 'earth-core'
  | 'hot-spring' | 'mud-pool' | 'oasis'
  | 'ancient-root' | 'fossil' | 'earth-mother'
  | 'ore-vein' | 'amber' | 'gemstone'
  | 'steam' | 'geyser' | 'mist'
  | 'wildfire' | 'ash-bloom' | 'fire-seed'
  | 'forge' | 'molten-iron' | 'solar-furnace'
  | 'rainforest' | 'lotus' | 'dewdrop'
  | 'ice-blade' | 'mirror' | 'mercury-spring'
  | 'golden-leaf' | 'iron-tree' | 'mech-vine';

export interface VarietyDef {
  id: VarietyId;
  galaxy: GalaxyId;
  hybridPair?: HybridGalaxyPair;
  rarity: Rarity;
  dropRate: number;  // 基础掉率（0-1）
  emoji: string;
  breedType: BreedType;
  matureMinutes: number;
  sellPrice: number;
}

const PURE_MATURE_MINUTES = 10000;
export const HYBRID_MATURE_MINUTES = 20000;
export const PRISMATIC_MATURE_MINUTES = 50000;
export const DARK_MATTER_MATURE_MINUTES = 50000;

/** Phase 2 品种定义（当前全部为 pure） */
export const VARIETY_DEFS: Record<VarietyId, VarietyDef> = {
  // thick-earth
  'jade-stripe': {
    id: 'jade-stripe', galaxy: 'thick-earth', rarity: 'common', dropRate: 0.15, emoji: '🍉',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES, sellPrice: 8,
  },
  'black-pearl': {
    id: 'black-pearl', galaxy: 'thick-earth', rarity: 'common', dropRate: 0.13, emoji: '🖤',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES, sellPrice: 10,
  },
  'honey-bomb': {
    id: 'honey-bomb', galaxy: 'thick-earth', rarity: 'common', dropRate: 0.12, emoji: '🍯',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES, sellPrice: 12,
  },
  'mini-round': {
    id: 'mini-round', galaxy: 'thick-earth', rarity: 'rare', dropRate: 0.07, emoji: '🔴',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES, sellPrice: 25,
  },
  'star-moon': {
    id: 'star-moon', galaxy: 'thick-earth', rarity: 'rare', dropRate: 0.06, emoji: '🌙',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES, sellPrice: 30,
  },
  'golden-heart': {
    id: 'golden-heart', galaxy: 'thick-earth', rarity: 'epic', dropRate: 0.03, emoji: '💛',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES, sellPrice: 80,
  },
  'ice-sugar-snow': {
    id: 'ice-sugar-snow', galaxy: 'thick-earth', rarity: 'epic', dropRate: 0.02, emoji: '❄️',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES, sellPrice: 120,
  },
  'cube-melon': {
    id: 'cube-melon', galaxy: 'thick-earth', rarity: 'legendary', dropRate: 0.01, emoji: '🧊',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES, sellPrice: 300,
  },

  // fire
  'lava-melon': {
    id: 'lava-melon', galaxy: 'fire', rarity: 'common', dropRate: 0.15, emoji: '🌋',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES, sellPrice: 8,
  },
  'caramel-crack': {
    id: 'caramel-crack', galaxy: 'fire', rarity: 'common', dropRate: 0.13, emoji: '🍮',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES, sellPrice: 10,
  },
  'charcoal-roast': {
    id: 'charcoal-roast', galaxy: 'fire', rarity: 'common', dropRate: 0.12, emoji: '🔥',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES, sellPrice: 12,
  },
  'flame-pattern': {
    id: 'flame-pattern', galaxy: 'fire', rarity: 'rare', dropRate: 0.07, emoji: '🔶',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES, sellPrice: 25,
  },
  'molten-core': {
    id: 'molten-core', galaxy: 'fire', rarity: 'rare', dropRate: 0.06, emoji: '💎',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES, sellPrice: 30,
  },
  'sun-stone': {
    id: 'sun-stone', galaxy: 'fire', rarity: 'epic', dropRate: 0.03, emoji: '☀️',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES, sellPrice: 80,
  },
  'ash-rebirth': {
    id: 'ash-rebirth', galaxy: 'fire', rarity: 'epic', dropRate: 0.02, emoji: '🌅',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES, sellPrice: 120,
  },
  'phoenix-nirvana': {
    id: 'phoenix-nirvana', galaxy: 'fire', rarity: 'legendary', dropRate: 0.01, emoji: '🦅',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES, sellPrice: 300,
  },

  // water
  'snow-velvet': {
    id: 'snow-velvet', galaxy: 'water', rarity: 'common', dropRate: 0.15, emoji: '🤍',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES, sellPrice: 8,
  },
  'ice-crystal': {
    id: 'ice-crystal', galaxy: 'water', rarity: 'common', dropRate: 0.13, emoji: '💠',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES, sellPrice: 10,
  },
  'tidal-melon': {
    id: 'tidal-melon', galaxy: 'water', rarity: 'common', dropRate: 0.12, emoji: '🌊',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES, sellPrice: 12,
  },
  'aurora-melon': {
    id: 'aurora-melon', galaxy: 'water', rarity: 'rare', dropRate: 0.07, emoji: '🌌',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES, sellPrice: 25,
  },
  'moonlight-melon': {
    id: 'moonlight-melon', galaxy: 'water', rarity: 'rare', dropRate: 0.06, emoji: '🌕',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES, sellPrice: 30,
  },
  'diamond-melon': {
    id: 'diamond-melon', galaxy: 'water', rarity: 'epic', dropRate: 0.03, emoji: '💎',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES, sellPrice: 80,
  },
  'abyss-melon': {
    id: 'abyss-melon', galaxy: 'water', rarity: 'epic', dropRate: 0.02, emoji: '🫧',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES, sellPrice: 120,
  },
  'permafrost': {
    id: 'permafrost', galaxy: 'water', rarity: 'legendary', dropRate: 0.01, emoji: '🧊',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES, sellPrice: 300,
  },

  // wood
  'vine-melon': {
    id: 'vine-melon', galaxy: 'wood', rarity: 'common', dropRate: 0.15, emoji: '🌱',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES, sellPrice: 8,
  },
  'moss-melon': {
    id: 'moss-melon', galaxy: 'wood', rarity: 'common', dropRate: 0.13, emoji: '🍀',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES, sellPrice: 10,
  },
  'mycelium-melon': {
    id: 'mycelium-melon', galaxy: 'wood', rarity: 'common', dropRate: 0.12, emoji: '🍄',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES, sellPrice: 12,
  },
  'flower-whisper': {
    id: 'flower-whisper', galaxy: 'wood', rarity: 'rare', dropRate: 0.07, emoji: '🌸',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES, sellPrice: 25,
  },
  'tree-ring': {
    id: 'tree-ring', galaxy: 'wood', rarity: 'rare', dropRate: 0.06, emoji: '🪵',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES, sellPrice: 30,
  },
  'world-tree': {
    id: 'world-tree', galaxy: 'wood', rarity: 'epic', dropRate: 0.03, emoji: '🌳',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES, sellPrice: 80,
  },
  'spirit-root': {
    id: 'spirit-root', galaxy: 'wood', rarity: 'epic', dropRate: 0.02, emoji: '🌿',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES, sellPrice: 120,
  },
  'all-spirit': {
    id: 'all-spirit', galaxy: 'wood', rarity: 'legendary', dropRate: 0.01, emoji: '🧚',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES, sellPrice: 300,
  },

  // metal
  'golden-armor': {
    id: 'golden-armor', galaxy: 'metal', rarity: 'common', dropRate: 0.15, emoji: '🛡️',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES, sellPrice: 8,
  },
  'copper-patina': {
    id: 'copper-patina', galaxy: 'metal', rarity: 'common', dropRate: 0.13, emoji: '🪙',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES, sellPrice: 10,
  },
  'tinfoil-melon': {
    id: 'tinfoil-melon', galaxy: 'metal', rarity: 'common', dropRate: 0.12, emoji: '🔔',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES, sellPrice: 12,
  },
  'galaxy-stripe': {
    id: 'galaxy-stripe', galaxy: 'metal', rarity: 'rare', dropRate: 0.07, emoji: '🌀',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES, sellPrice: 25,
  },
  'mercury-melon': {
    id: 'mercury-melon', galaxy: 'metal', rarity: 'rare', dropRate: 0.06, emoji: '🪩',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES, sellPrice: 30,
  },
  'meteorite-melon': {
    id: 'meteorite-melon', galaxy: 'metal', rarity: 'epic', dropRate: 0.03, emoji: '☄️',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES, sellPrice: 80,
  },
  'alloy-melon': {
    id: 'alloy-melon', galaxy: 'metal', rarity: 'epic', dropRate: 0.02, emoji: '⚙️',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES, sellPrice: 120,
  },
  'eternal-melon': {
    id: 'eternal-melon', galaxy: 'metal', rarity: 'legendary', dropRate: 0.01, emoji: '👑',
    breedType: 'pure', matureMinutes: PURE_MATURE_MINUTES, sellPrice: 300,
  },

  // rainbow (prismatic)
  'prism-melon': {
    id: 'prism-melon', galaxy: 'rainbow', rarity: 'rare', dropRate: 0.30, emoji: '🔷',
    breedType: 'prismatic', matureMinutes: PRISMATIC_MATURE_MINUTES, sellPrice: 150,
  },
  'bubble-melon': {
    id: 'bubble-melon', galaxy: 'rainbow', rarity: 'rare', dropRate: 0.30, emoji: '🫧',
    breedType: 'prismatic', matureMinutes: PRISMATIC_MATURE_MINUTES, sellPrice: 150,
  },
  'nebula-melon': {
    id: 'nebula-melon', galaxy: 'rainbow', rarity: 'epic', dropRate: 0.20, emoji: '🌌',
    breedType: 'prismatic', matureMinutes: PRISMATIC_MATURE_MINUTES, sellPrice: 600,
  },
  'aurora-cascade': {
    id: 'aurora-cascade', galaxy: 'rainbow', rarity: 'epic', dropRate: 0.15, emoji: '🌈',
    breedType: 'prismatic', matureMinutes: PRISMATIC_MATURE_MINUTES, sellPrice: 600,
  },
  'dream-melon': {
    id: 'dream-melon', galaxy: 'rainbow', rarity: 'legendary', dropRate: 0.05, emoji: '💭',
    breedType: 'prismatic', matureMinutes: PRISMATIC_MATURE_MINUTES, sellPrice: 2000,
  },

  // dark-matter
  'void-melon': {
    id: 'void-melon', galaxy: 'dark-matter', rarity: 'epic', dropRate: 1, emoji: '🌑',
    breedType: 'dark-matter', matureMinutes: DARK_MATTER_MATURE_MINUTES, sellPrice: 1000,
  },
  'blackhole-melon': {
    id: 'blackhole-melon', galaxy: 'dark-matter', rarity: 'legendary', dropRate: 1, emoji: '🕳️',
    breedType: 'dark-matter', matureMinutes: DARK_MATTER_MATURE_MINUTES, sellPrice: 5000,
  },
  'cosmic-heart': {
    id: 'cosmic-heart', galaxy: 'dark-matter', rarity: 'legendary', dropRate: 1, emoji: '💖',
    breedType: 'dark-matter', matureMinutes: DARK_MATTER_MATURE_MINUTES, sellPrice: 0,
  },

  // earth-fire
  'lava-field': {
    id: 'lava-field', galaxy: 'thick-earth', hybridPair: 'earth-fire', rarity: 'common', dropRate: 0.60, emoji: '🌋',
    breedType: 'hybrid', matureMinutes: HYBRID_MATURE_MINUTES, sellPrice: 30,
  },
  'volcanic-ash': {
    id: 'volcanic-ash', galaxy: 'thick-earth', hybridPair: 'earth-fire', rarity: 'rare', dropRate: 0.30, emoji: '🌫️',
    breedType: 'hybrid', matureMinutes: HYBRID_MATURE_MINUTES, sellPrice: 80,
  },
  'earth-core': {
    id: 'earth-core', galaxy: 'thick-earth', hybridPair: 'earth-fire', rarity: 'epic', dropRate: 0.10, emoji: '🌎',
    breedType: 'hybrid', matureMinutes: HYBRID_MATURE_MINUTES, sellPrice: 250,
  },

  // earth-water
  'hot-spring': {
    id: 'hot-spring', galaxy: 'thick-earth', hybridPair: 'earth-water', rarity: 'common', dropRate: 0.60, emoji: '♨️',
    breedType: 'hybrid', matureMinutes: HYBRID_MATURE_MINUTES, sellPrice: 30,
  },
  'mud-pool': {
    id: 'mud-pool', galaxy: 'thick-earth', hybridPair: 'earth-water', rarity: 'rare', dropRate: 0.30, emoji: '🟤',
    breedType: 'hybrid', matureMinutes: HYBRID_MATURE_MINUTES, sellPrice: 80,
  },
  oasis: {
    id: 'oasis', galaxy: 'thick-earth', hybridPair: 'earth-water', rarity: 'epic', dropRate: 0.10, emoji: '🏝️',
    breedType: 'hybrid', matureMinutes: HYBRID_MATURE_MINUTES, sellPrice: 250,
  },

  // earth-wood
  'ancient-root': {
    id: 'ancient-root', galaxy: 'thick-earth', hybridPair: 'earth-wood', rarity: 'common', dropRate: 0.60, emoji: '🌱',
    breedType: 'hybrid', matureMinutes: HYBRID_MATURE_MINUTES, sellPrice: 30,
  },
  fossil: {
    id: 'fossil', galaxy: 'thick-earth', hybridPair: 'earth-wood', rarity: 'rare', dropRate: 0.30, emoji: '🦴',
    breedType: 'hybrid', matureMinutes: HYBRID_MATURE_MINUTES, sellPrice: 80,
  },
  'earth-mother': {
    id: 'earth-mother', galaxy: 'thick-earth', hybridPair: 'earth-wood', rarity: 'epic', dropRate: 0.10, emoji: '🌳',
    breedType: 'hybrid', matureMinutes: HYBRID_MATURE_MINUTES, sellPrice: 250,
  },

  // earth-metal
  'ore-vein': {
    id: 'ore-vein', galaxy: 'thick-earth', hybridPair: 'earth-metal', rarity: 'common', dropRate: 0.60, emoji: '⛏️',
    breedType: 'hybrid', matureMinutes: HYBRID_MATURE_MINUTES, sellPrice: 30,
  },
  amber: {
    id: 'amber', galaxy: 'thick-earth', hybridPair: 'earth-metal', rarity: 'rare', dropRate: 0.30, emoji: '🟠',
    breedType: 'hybrid', matureMinutes: HYBRID_MATURE_MINUTES, sellPrice: 80,
  },
  gemstone: {
    id: 'gemstone', galaxy: 'thick-earth', hybridPair: 'earth-metal', rarity: 'epic', dropRate: 0.10, emoji: '💎',
    breedType: 'hybrid', matureMinutes: HYBRID_MATURE_MINUTES, sellPrice: 250,
  },

  // fire-water
  steam: {
    id: 'steam', galaxy: 'thick-earth', hybridPair: 'fire-water', rarity: 'common', dropRate: 0.60, emoji: '☁️',
    breedType: 'hybrid', matureMinutes: HYBRID_MATURE_MINUTES, sellPrice: 30,
  },
  geyser: {
    id: 'geyser', galaxy: 'thick-earth', hybridPair: 'fire-water', rarity: 'rare', dropRate: 0.30, emoji: '⛲',
    breedType: 'hybrid', matureMinutes: HYBRID_MATURE_MINUTES, sellPrice: 80,
  },
  mist: {
    id: 'mist', galaxy: 'thick-earth', hybridPair: 'fire-water', rarity: 'epic', dropRate: 0.10, emoji: '🌫️',
    breedType: 'hybrid', matureMinutes: HYBRID_MATURE_MINUTES, sellPrice: 250,
  },

  // fire-wood
  wildfire: {
    id: 'wildfire', galaxy: 'thick-earth', hybridPair: 'fire-wood', rarity: 'common', dropRate: 0.60, emoji: '🔥',
    breedType: 'hybrid', matureMinutes: HYBRID_MATURE_MINUTES, sellPrice: 30,
  },
  'ash-bloom': {
    id: 'ash-bloom', galaxy: 'thick-earth', hybridPair: 'fire-wood', rarity: 'rare', dropRate: 0.30, emoji: '🌸',
    breedType: 'hybrid', matureMinutes: HYBRID_MATURE_MINUTES, sellPrice: 80,
  },
  'fire-seed': {
    id: 'fire-seed', galaxy: 'thick-earth', hybridPair: 'fire-wood', rarity: 'epic', dropRate: 0.10, emoji: '🌰',
    breedType: 'hybrid', matureMinutes: HYBRID_MATURE_MINUTES, sellPrice: 250,
  },

  // fire-metal
  forge: {
    id: 'forge', galaxy: 'thick-earth', hybridPair: 'fire-metal', rarity: 'common', dropRate: 0.60, emoji: '🔨',
    breedType: 'hybrid', matureMinutes: HYBRID_MATURE_MINUTES, sellPrice: 30,
  },
  'molten-iron': {
    id: 'molten-iron', galaxy: 'thick-earth', hybridPair: 'fire-metal', rarity: 'rare', dropRate: 0.30, emoji: '🧲',
    breedType: 'hybrid', matureMinutes: HYBRID_MATURE_MINUTES, sellPrice: 80,
  },
  'solar-furnace': {
    id: 'solar-furnace', galaxy: 'thick-earth', hybridPair: 'fire-metal', rarity: 'epic', dropRate: 0.10, emoji: '☀️',
    breedType: 'hybrid', matureMinutes: HYBRID_MATURE_MINUTES, sellPrice: 250,
  },

  // water-wood
  rainforest: {
    id: 'rainforest', galaxy: 'thick-earth', hybridPair: 'water-wood', rarity: 'common', dropRate: 0.60, emoji: '🌴',
    breedType: 'hybrid', matureMinutes: HYBRID_MATURE_MINUTES, sellPrice: 30,
  },
  lotus: {
    id: 'lotus', galaxy: 'thick-earth', hybridPair: 'water-wood', rarity: 'rare', dropRate: 0.30, emoji: '🪷',
    breedType: 'hybrid', matureMinutes: HYBRID_MATURE_MINUTES, sellPrice: 80,
  },
  dewdrop: {
    id: 'dewdrop', galaxy: 'thick-earth', hybridPair: 'water-wood', rarity: 'epic', dropRate: 0.10, emoji: '💧',
    breedType: 'hybrid', matureMinutes: HYBRID_MATURE_MINUTES, sellPrice: 250,
  },

  // water-metal
  'ice-blade': {
    id: 'ice-blade', galaxy: 'thick-earth', hybridPair: 'water-metal', rarity: 'common', dropRate: 0.60, emoji: '🗡️',
    breedType: 'hybrid', matureMinutes: HYBRID_MATURE_MINUTES, sellPrice: 30,
  },
  mirror: {
    id: 'mirror', galaxy: 'thick-earth', hybridPair: 'water-metal', rarity: 'rare', dropRate: 0.30, emoji: '🪞',
    breedType: 'hybrid', matureMinutes: HYBRID_MATURE_MINUTES, sellPrice: 80,
  },
  'mercury-spring': {
    id: 'mercury-spring', galaxy: 'thick-earth', hybridPair: 'water-metal', rarity: 'epic', dropRate: 0.10, emoji: '⚗️',
    breedType: 'hybrid', matureMinutes: HYBRID_MATURE_MINUTES, sellPrice: 250,
  },

  // wood-metal
  'golden-leaf': {
    id: 'golden-leaf', galaxy: 'thick-earth', hybridPair: 'wood-metal', rarity: 'common', dropRate: 0.60, emoji: '🍁',
    breedType: 'hybrid', matureMinutes: HYBRID_MATURE_MINUTES, sellPrice: 30,
  },
  'iron-tree': {
    id: 'iron-tree', galaxy: 'thick-earth', hybridPair: 'wood-metal', rarity: 'rare', dropRate: 0.30, emoji: '🌲',
    breedType: 'hybrid', matureMinutes: HYBRID_MATURE_MINUTES, sellPrice: 80,
  },
  'mech-vine': {
    id: 'mech-vine', galaxy: 'thick-earth', hybridPair: 'wood-metal', rarity: 'epic', dropRate: 0.10, emoji: '🤖',
    breedType: 'hybrid', matureMinutes: HYBRID_MATURE_MINUTES, sellPrice: 250,
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

export const PRISMATIC_VARIETIES: VarietyId[] = [
  'prism-melon', 'bubble-melon', 'nebula-melon', 'aurora-cascade', 'dream-melon',
];

export const DARK_MATTER_VARIETIES: DarkMatterVarietyId[] = [
  'void-melon', 'blackhole-melon', 'cosmic-heart',
];

export const HYBRID_GALAXY_PAIRS: HybridGalaxyPair[] = [
  'earth-fire',
  'earth-water',
  'earth-wood',
  'earth-metal',
  'fire-water',
  'fire-wood',
  'fire-metal',
  'water-wood',
  'water-metal',
  'wood-metal',
];

export const HYBRID_VARIETIES: Record<HybridGalaxyPair, VarietyId[]> = {
  'earth-fire': ['lava-field', 'volcanic-ash', 'earth-core'],
  'earth-water': ['hot-spring', 'mud-pool', 'oasis'],
  'earth-wood': ['ancient-root', 'fossil', 'earth-mother'],
  'earth-metal': ['ore-vein', 'amber', 'gemstone'],
  'fire-water': ['steam', 'geyser', 'mist'],
  'fire-wood': ['wildfire', 'ash-bloom', 'fire-seed'],
  'fire-metal': ['forge', 'molten-iron', 'solar-furnace'],
  'water-wood': ['rainforest', 'lotus', 'dewdrop'],
  'water-metal': ['ice-blade', 'mirror', 'mercury-spring'],
  'wood-metal': ['golden-leaf', 'iron-tree', 'mech-vine'],
};

// 兼容旧逻辑：蓝星品种等价于 thick-earth 品种池
export const BLUE_STAR_VARIETIES: VarietyId[] = THICK_EARTH_VARIETIES;

export const GALAXY_VARIETIES: Record<GalaxyId, VarietyId[]> = {
  'thick-earth': THICK_EARTH_VARIETIES,
  fire: FIRE_VARIETIES,
  water: WATER_VARIETIES,
  wood: WOOD_VARIETIES,
  metal: METAL_VARIETIES,
  rainbow: PRISMATIC_VARIETIES,
  'dark-matter': DARK_MATTER_VARIETIES,
};

export const ALL_VARIETY_IDS: VarietyId[] = [
  ...THICK_EARTH_VARIETIES,
  ...FIRE_VARIETIES,
  ...WATER_VARIETIES,
  ...WOOD_VARIETIES,
  ...METAL_VARIETIES,
  ...PRISMATIC_VARIETIES,
  ...DARK_MATTER_VARIETIES,
  ...HYBRID_VARIETIES['earth-fire'],
  ...HYBRID_VARIETIES['earth-water'],
  ...HYBRID_VARIETIES['earth-wood'],
  ...HYBRID_VARIETIES['earth-metal'],
  ...HYBRID_VARIETIES['fire-water'],
  ...HYBRID_VARIETIES['fire-wood'],
  ...HYBRID_VARIETIES['fire-metal'],
  ...HYBRID_VARIETIES['water-wood'],
  ...HYBRID_VARIETIES['water-metal'],
  ...HYBRID_VARIETIES['wood-metal'],
];

// ─── 生长阶段 ───
export type GrowthStage = 'seed' | 'sprout' | 'leaf' | 'flower' | 'green' | 'fruit';

export interface StageDef {
  id: GrowthStage;
  threshold: number; // 进度阈值 (0-1)
  emoji: string;
}

export const GROWTH_STAGES: StageDef[] = [
  { id: 'seed',   threshold: 0,    emoji: '🌰' },
  { id: 'sprout', threshold: 0.20, emoji: '🌱' },
  { id: 'leaf',   threshold: 0.35, emoji: '🌿' },
  { id: 'flower', threshold: 0.55, emoji: '🌼' },
  { id: 'green',  threshold: 0.80, emoji: '🍈' },
  { id: 'fruit',  threshold: 1.00, emoji: '🍉' },
];

// ─── Farm ambience (Phase 6) ───
export type Weather = 'sunny' | 'cloudy' | 'rainy' | 'night' | 'rainbow';

export interface WeatherState {
  current: Weather;
  lastChangeAt: number; // ms timestamp
}

export type CreatureType = 'bee' | 'butterfly' | 'ladybug' | 'bird';

export interface Creature {
  id: string;
  type: CreatureType;
  xPercent: number;
  yPercent: number;
  expiresAt: number; // ms timestamp
}

export type AlienType = 'melon-alien' | 'mutation-doctor';
export type AlienDialogueKey = 'alienMelonGreeting' | 'alienMutationDoctor';

export interface AlienAppearance {
  id: string;
  type: AlienType;
  messageKey: AlienDialogueKey;
  appearedAt: number;
  expiresAt: number; // ms timestamp
}

export interface AlienVisit {
  lastMelonAlienCheckDate: string; // YYYY-MM-DD
  current: AlienAppearance | null;
}

export const DEFAULT_ALIEN_VISIT: AlienVisit = {
  lastMelonAlienCheckDate: '',
  current: null,
};

// ─── 地块 ───
export type PlotState = 'empty' | 'growing' | 'mature' | 'withered' | 'stolen';
export type MutationStatus = 'none' | 'positive' | 'negative';

export interface ThiefStatus {
  appearedAt: number; // 大盗出现时间（ms）
  stealsAt: number; // 预计偷瓜时间（ms）
}

export interface StolenRecord {
  id: string;
  plotId: number;
  varietyId: VarietyId;
  stolenAt: number; // 被偷时间（ms）
  resolved: boolean; // 是否已经处理（追回/过期）
  recoveredCount: number; // 追回数量
  recoveredAt?: number; // 追回时间（ms）
}

export interface Plot {
  id: number;
  state: PlotState;
  seedQuality?: SeedQuality;
  varietyId?: VarietyId;
  progress: number;       // 0-1
  mutationStatus?: MutationStatus; // 默认 'none'
  mutationChance?: number; // 默认 0.02
  isMutant?: boolean; // 默认 false
  accumulatedMinutes: number; // 累积成长分钟（Phase 2）
  plantedDate?: string;   // ISO date
  lastUpdateDate?: string; // ISO date (最后一次生长更新)
  lastActivityTimestamp: number; // 最近活跃时间戳（ms）
  pausedAt?: number; // 幻彩暂停开始时间戳（ms）
  pausedProgress?: number; // 幻彩暂停基线进度（0-1）
  hasTracker: boolean;    // 星际追踪器
  thief?: ThiefStatus;
}

export function createEmptyPlot(id: number): Plot {
  return {
    id,
    state: 'empty',
    progress: 0,
    mutationStatus: 'none',
    mutationChance: 0.02,
    isMutant: false,
    accumulatedMinutes: 0,
    lastActivityTimestamp: 0,
    hasTracker: false,
  };
}

// ─── 图鉴 ───
export interface CollectedVariety {
  varietyId: VarietyId;
  isMutant?: boolean;
  firstObtainedDate: string;
  count: number;
}

export interface FusionHistory {
  lastVarietyId?: VarietyId;
  sameVarietyStreak: number;
  obtainedPrismaticVarietyIds: VarietyId[];
}

export const DEFAULT_FUSION_HISTORY: FusionHistory = {
  sameVarietyStreak: 0,
  obtainedPrismaticVarietyIds: [],
};

// ─── 农场存储 ───
export interface FarmStorage {
  plots: Plot[];
  collection: CollectedVariety[];
  lastActiveDate: string; // YYYY-MM-DD
  consecutiveInactiveDays: number; // 连续未活跃天数（用于枯萎检测）
  lastActivityTimestamp: number; // 最近活跃时间戳（ms）
  guardianBarrierDate: string; // 守护结界生效日期 (YYYY-MM-DD)
  stolenRecords: StolenRecord[]; // 用于追回机制
}

export const DEFAULT_FARM_STORAGE: FarmStorage = {
  plots: [0, 1, 2, 3].map(createEmptyPlot),
  collection: [],
  lastActiveDate: '',
  consecutiveInactiveDays: 0,
  lastActivityTimestamp: 0,
  guardianBarrierDate: '',
  stolenRecords: [],
};

export const PLOT_MILESTONES = [
  { requiredVarieties: 0, totalPlots: 4 },
  { requiredVarieties: 3, totalPlots: 5 },
  { requiredVarieties: 5, totalPlots: 6 },
  { requiredVarieties: 8, totalPlots: 7 },
  { requiredVarieties: 15, totalPlots: 8 },
  { requiredVarieties: 22, totalPlots: 9 },
];
