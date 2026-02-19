import type { GeneFragment } from '../types/gene';
import type { GalaxyId, HybridGalaxyPair, Rarity, VarietyId } from '../types/farm';
import type { SeedQuality } from '../types/slicing';
import {
  GALAXY_VARIETIES,
  HYBRID_GALAXY_PAIRS,
  HYBRID_VARIETIES,
  PRISMATIC_VARIETIES,
  RARITY_STARS,
  VARIETY_DEFS,
} from '../types/farm';

/**
 * 注入种子品种抽取：80% 目标星系，20% 其他已解锁星系
 * 不会出杂交品种（当前阶段没有杂交品种，但逻辑上预留）
 */
export function rollInjectedVariety(
  targetGalaxyId: GalaxyId,
  unlockedGalaxies: GalaxyId[],
  quality: SeedQuality = 'normal',
): VarietyId {
  const roll = Math.random();
  let sourceGalaxies: GalaxyId[];

  if (roll < 0.8) {
    // 80% 从目标星系
    sourceGalaxies = [targetGalaxyId];
  } else {
    // 20% 从其他已解锁星系（排除目标星系）
    const others = unlockedGalaxies.filter(g => g !== targetGalaxyId);
    sourceGalaxies = others.length > 0 ? others : [targetGalaxyId];
  }

  // 复用 rollVariety 的加权逻辑
  const multiplier = quality === 'legendary' ? 4 : quality === 'epic' ? 2 : 1;
  const sourcePool: VarietyId[] = [];
  for (const gid of sourceGalaxies) {
    sourcePool.push(...(GALAXY_VARIETIES[gid] ?? []));
  }
  if (sourcePool.length === 0) sourcePool.push(...GALAXY_VARIETIES['thick-earth']);

  const pool: { id: VarietyId; weight: number }[] = sourcePool.map(id => {
    const def = VARIETY_DEFS[id];
    const isHighRarity = def.rarity === 'rare' || def.rarity === 'epic' || def.rarity === 'legendary';
    return { id, weight: def.dropRate * (isHighRarity ? multiplier : 1) };
  });

  const totalWeight = pool.reduce((sum, p) => sum + p.weight, 0);
  let r = Math.random() * totalWeight;
  for (const p of pool) {
    r -= p.weight;
    if (r <= 0) return p.id;
  }
  return pool[pool.length - 1].id;
}

/**
 * 生成注入种子 ID
 */
export function createInjectedSeedId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export type FiveElementGalaxyId = 'thick-earth' | 'fire' | 'water' | 'wood' | 'metal';

export const FIVE_ELEMENT_GALAXIES: FiveElementGalaxyId[] = ['thick-earth', 'fire', 'water', 'wood', 'metal'];

const FIVE_ELEMENT_RARITY_BONUS: Record<Rarity, number> = {
  common: 0,
  rare: 0.10,
  epic: 0.20,
  legendary: 0.30,
};

type HybridGalaxyName = 'earth' | 'fire' | 'water' | 'wood' | 'metal';

const HYBRID_GALAXY_ORDER: Record<HybridGalaxyName, number> = {
  earth: 0,
  fire: 1,
  water: 2,
  wood: 3,
  metal: 4,
};

function normalizeHybridGalaxy(galaxyId: GalaxyId): HybridGalaxyName {
  switch (galaxyId) {
    case 'thick-earth':
      return 'earth';
    case 'fire':
      return 'fire';
    case 'water':
      return 'water';
    case 'wood':
      return 'wood';
    case 'metal':
      return 'metal';
    default:
      throw new Error(`Unsupported galaxy for fusion: ${galaxyId}`);
  }
}

export function toHybridGalaxyPair(g1: GalaxyId, g2: GalaxyId): HybridGalaxyPair {
  const galaxy1 = normalizeHybridGalaxy(g1);
  const galaxy2 = normalizeHybridGalaxy(g2);
  const sorted = [galaxy1, galaxy2].sort((a, b) => HYBRID_GALAXY_ORDER[a] - HYBRID_GALAXY_ORDER[b]);
  return `${sorted[0]}-${sorted[1]}` as HybridGalaxyPair;
}

export function fusionSuccessRate(rarity1: Rarity, rarity2: Rarity): number {
  const pair = [rarity1, rarity2];
  if (pair.includes('legendary')) return 0.90;
  if (pair.includes('epic')) return 0.70;
  if (pair[0] === 'rare' && pair[1] === 'rare') return 0.55;
  if (pair.includes('rare')) return 0.50;
  return 0.30;
}

function isFiveElementGalaxy(galaxyId: GalaxyId): galaxyId is FiveElementGalaxyId {
  return FIVE_ELEMENT_GALAXIES.includes(galaxyId as FiveElementGalaxyId);
}

function pickBestFiveElementFragment(fragments: GeneFragment[]): GeneFragment {
  return fragments.reduce((best, current) => {
    const starDiff = RARITY_STARS[current.rarity] - RARITY_STARS[best.rarity];
    if (starDiff !== 0) return starDiff > 0 ? current : best;
    return current.obtainedAt > best.obtainedAt ? current : best;
  });
}

function pickPreferredFragment(fragments: GeneFragment[]): GeneFragment {
  return fragments.reduce((best, current) => {
    const starDiff = RARITY_STARS[current.rarity] - RARITY_STARS[best.rarity];
    if (starDiff !== 0) return starDiff > 0 ? current : best;
    return current.obtainedAt > best.obtainedAt ? current : best;
  });
}

export function getBestFiveElementFragments(fragments: GeneFragment[]): GeneFragment[] | null {
  const grouped = new Map<FiveElementGalaxyId, GeneFragment[]>();

  for (const fragment of fragments) {
    if (!isFiveElementGalaxy(fragment.galaxyId)) continue;
    const list = grouped.get(fragment.galaxyId) ?? [];
    list.push(fragment);
    grouped.set(fragment.galaxyId, list);
  }

  if (FIVE_ELEMENT_GALAXIES.some((galaxyId) => (grouped.get(galaxyId)?.length ?? 0) <= 0)) {
    return null;
  }

  return FIVE_ELEMENT_GALAXIES.map((galaxyId) => pickBestFiveElementFragment(grouped.get(galaxyId) as GeneFragment[]));
}

export function canFuseFiveElements(
  fragments: GeneFragment[],
  harvestedHybridVarietyCount: number,
): boolean {
  if (harvestedHybridVarietyCount < 3) return false;
  const bestFragments = getBestFiveElementFragments(fragments);
  return bestFragments !== null;
}

export function fiveElementFusionSuccessRate(fragments: GeneFragment[]): number {
  if (fragments.length !== 5) return 0;
  const averageBonus = fragments.reduce((sum, fragment) => sum + FIVE_ELEMENT_RARITY_BONUS[fragment.rarity], 0) / 5;
  return Math.min(1, 0.5 + averageBonus);
}

export function getVoidMelonFusionFragments(fragments: GeneFragment[]): GeneFragment[] | null {
  const grouped = new Map<VarietyId, GeneFragment[]>();

  for (const fragment of fragments) {
    if (!PRISMATIC_VARIETIES.includes(fragment.varietyId)) continue;
    const list = grouped.get(fragment.varietyId) ?? [];
    list.push(fragment);
    grouped.set(fragment.varietyId, list);
  }

  if (PRISMATIC_VARIETIES.some((varietyId) => (grouped.get(varietyId)?.length ?? 0) <= 0)) {
    return null;
  }

  return PRISMATIC_VARIETIES.map((varietyId) => pickPreferredFragment(grouped.get(varietyId) as GeneFragment[]));
}

export function getBlackHoleMelonFusionFragments(fragments: GeneFragment[]): GeneFragment[] | null {
  const grouped = new Map<HybridGalaxyPair, GeneFragment[]>();

  for (const fragment of fragments) {
    const hybridPair = VARIETY_DEFS[fragment.varietyId]?.hybridPair;
    if (!hybridPair) continue;
    const list = grouped.get(hybridPair) ?? [];
    list.push(fragment);
    grouped.set(hybridPair, list);
  }

  if (HYBRID_GALAXY_PAIRS.some((pair) => (grouped.get(pair)?.length ?? 0) <= 0)) {
    return null;
  }

  return HYBRID_GALAXY_PAIRS.map((pair) => pickPreferredFragment(grouped.get(pair) as GeneFragment[]));
}

export function attemptFusion(
  fragment1: GeneFragment,
  fragment2: GeneFragment,
  modifierBonus = 0,
): { success: boolean; successRate: number; galaxyPair: HybridGalaxyPair } | null {
  if (fragment1.galaxyId === fragment2.galaxyId) return null;

  let galaxyPair: HybridGalaxyPair;
  try {
    galaxyPair = toHybridGalaxyPair(fragment1.galaxyId, fragment2.galaxyId);
  } catch {
    return null;
  }
  const successRate = Math.min(1, fusionSuccessRate(fragment1.rarity, fragment2.rarity) + modifierBonus);

  return {
    success: Math.random() < successRate,
    successRate,
    galaxyPair,
  };
}

export function rollHybridVariety(galaxyPair: HybridGalaxyPair): VarietyId {
  const candidates = HYBRID_VARIETIES[galaxyPair];
  const pool = candidates.map(id => ({ id, weight: VARIETY_DEFS[id].dropRate }));
  const totalWeight = pool.reduce((sum, p) => sum + p.weight, 0);

  let r = Math.random() * totalWeight;
  for (const p of pool) {
    r -= p.weight;
    if (r <= 0) return p.id;
  }

  return pool[pool.length - 1].id;
}

export function rollPrismaticVariety(pool: VarietyId[] = PRISMATIC_VARIETIES): VarietyId {
  const resolvedPool = pool.filter((id) => PRISMATIC_VARIETIES.includes(id));
  const candidates = resolvedPool.length > 0 ? resolvedPool : PRISMATIC_VARIETIES;
  const weightedPool = candidates.map((id) => ({ id, weight: VARIETY_DEFS[id].dropRate }));
  const totalWeight = weightedPool.reduce((sum, item) => sum + item.weight, 0);

  let roll = Math.random() * totalWeight;
  for (const item of weightedPool) {
    roll -= item.weight;
    if (roll <= 0) return item.id;
  }

  return weightedPool[weightedPool.length - 1].id;
}
