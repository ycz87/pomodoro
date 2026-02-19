import type { GalaxyId, VarietyId } from '../types/farm';
import type { SeedQuality } from '../types/slicing';
import { GALAXY_VARIETIES, VARIETY_DEFS } from '../types/farm';

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
