/**
 * 农场生长引擎
 *
 * 计算分钟级生长进度、枯萎检测、品种随机。
 */
import type { Plot, VarietyId, GrowthStage, GalaxyId, MutationStatus } from '../types/farm';
import type { SeedQuality } from '../types/slicing';
import {
  GALAXY_VARIETIES, VARIETY_DEFS, GROWTH_STAGES,
} from '../types/farm';

const MINUTES_PER_HOUR = 60;
const MINUTES_PER_DAY = 24 * MINUTES_PER_HOUR;
const WITHER_THRESHOLD_HOURS = 72;
const WITHER_THRESHOLD_MINUTES = WITHER_THRESHOLD_HOURS * MINUTES_PER_HOUR;
const MUTATION_TRIGGER_PROGRESS = 0.20;

/**
 * 离线成长分钟数：
 * - <= 24 小时：全额计入
 * - 24~72 小时：封顶 1440 分钟
 * - > 72 小时：不再成长（应由枯萎逻辑处理）
 */
export function calculateOfflineGrowth(offlineMinutes: number): number {
  const normalized = Math.max(0, Math.floor(offlineMinutes));
  if (normalized <= MINUTES_PER_DAY) return normalized;
  if (normalized <= WITHER_THRESHOLD_MINUTES) return MINUTES_PER_DAY;
  return 0;
}

/**
 * 专注加速分钟数：
 * - <= 2 小时：10x
 * - > 2 小时：20x
 */
export function calculateFocusBoost(focusMinutes: number): number {
  const normalized = Math.max(0, Math.floor(focusMinutes));
  if (normalized === 0) return 0;
  const multiplier = normalized <= 120 ? 10 : 20;
  return normalized * multiplier;
}

export interface WitherStatus {
  inactiveMinutes: number;
  inactiveHours: number;
  inactiveDays: number;
  shouldWither: boolean;
}

export function getWitherStatus(
  lastActivityTimestamp: number,
  nowTimestamp: number = Date.now(),
): WitherStatus {
  if (!Number.isFinite(lastActivityTimestamp) || lastActivityTimestamp <= 0) {
    return {
      inactiveMinutes: 0,
      inactiveHours: 0,
      inactiveDays: 0,
      shouldWither: false,
    };
  }

  const safeNow = Number.isFinite(nowTimestamp) && nowTimestamp > 0 ? nowTimestamp : Date.now();
  const inactiveMs = Math.max(0, safeNow - lastActivityTimestamp);
  const inactiveMinutes = Math.floor(inactiveMs / (1000 * 60));

  return {
    inactiveMinutes,
    inactiveHours: Math.floor(inactiveMinutes / MINUTES_PER_HOUR),
    inactiveDays: Math.floor(inactiveMinutes / MINUTES_PER_DAY),
    shouldWither: inactiveMinutes >= WITHER_THRESHOLD_MINUTES,
  };
}

// ─── 生长阶段 ───

export function getGrowthStage(progress: number): GrowthStage {
  let stage: GrowthStage = 'seed';
  for (const s of GROWTH_STAGES) {
    if (progress >= s.threshold) stage = s.id;
  }
  return stage;
}

export function getStageEmoji(progress: number, varietyId?: VarietyId): string {
  const stage = getGrowthStage(progress);
  if (stage === 'fruit' && varietyId) {
    return VARIETY_DEFS[varietyId]?.emoji ?? '🍉';
  }
  return GROWTH_STAGES.find(s => s.id === stage)?.emoji ?? '🌰';
}

/** 品种是否已揭晓（进度 >= 60%） */
export function isVarietyRevealed(progress: number): boolean {
  return progress >= 0.60;
}

function downgradeSeedQuality(seedQuality: SeedQuality | undefined): SeedQuality {
  if (seedQuality === 'legendary') return 'epic';
  if (seedQuality === 'epic') return 'normal';
  return 'normal';
}

/**
 * 变异判定（单次）：
 * - 已判定（positive/negative）直接跳过
 * - 一旦判定（包含未命中概率）即将 mutationChance 归零，避免重复判定
 */
export function rollMutation(plot: Plot): Plot {
  if ((plot.mutationStatus ?? 'none') !== 'none') return plot;

  const mutationChance = plot.mutationChance ?? 0.02;
  if (mutationChance <= 0) return plot;
  if (Math.random() >= mutationChance) {
    return {
      ...plot,
      mutationChance: 0,
      isMutant: false,
    };
  }

  const mutationRoll = Math.random();

  // 40% 良性变异 (0.0 <= roll < 0.4)
  if (mutationRoll < 0.4) {
    return {
      ...plot,
      mutationStatus: 'positive',
      mutationChance: 0,
      isMutant: true,
    };
  }

  // 30% 恶性变异 (0.4 <= roll < 0.7)
  if (mutationRoll < 0.7) {
    const shouldWither = Math.random() < 0.5;
    return shouldWither
      ? {
          ...plot,
          state: 'withered',
          mutationStatus: 'negative',
          mutationChance: 0,
          isMutant: false,
        }
      : {
          ...plot,
          mutationStatus: 'negative',
          mutationChance: 0,
          isMutant: false,
          seedQuality: downgradeSeedQuality(plot.seedQuality),
        };
  }

  // 30% 触发但无效果 (0.7 <= roll < 1.0)
  return {
    ...plot,
    mutationStatus: 'none',
    mutationChance: 0,
    isMutant: false,
  };
}

export interface MutationOutcome {
  varietyId: VarietyId;
  status: Exclude<MutationStatus, 'none'>;
}

// ─── 品种随机 ───

/**
 * 根据种子品质随机品种
 * epic 种子：稀有+ 概率 ×2
 * legendary 种子：稀有+ 概率 ×4
 */
export function rollVariety(unlockedGalaxies: GalaxyId[], seedQuality: SeedQuality = 'normal'): VarietyId {
  const multiplier = seedQuality === 'legendary' ? 4 : seedQuality === 'epic' ? 2 : 1;
  const sourcePool: VarietyId[] = [];
  for (const gid of unlockedGalaxies) {
    sourcePool.push(...(GALAXY_VARIETIES[gid] || []));
  }
  if (sourcePool.length === 0) sourcePool.push(...GALAXY_VARIETIES['thick-earth']);

  // 构建加权池
  const pool: { id: VarietyId; weight: number }[] = sourcePool.map(id => {
    const def = VARIETY_DEFS[id];
    const isHighRarity = def.rarity === 'rare' || def.rarity === 'epic' || def.rarity === 'legendary';
    return { id, weight: def.dropRate * (isHighRarity ? multiplier : 1) };
  });

  // 归一化
  const totalWeight = pool.reduce((sum, p) => sum + p.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const p of pool) {
    roll -= p.weight;
    if (roll <= 0) return p.id;
  }
  return pool[pool.length - 1].id;
}

// ─── 地块更新 ───

/**
 * 更新单个地块的生长进度
 * @returns 更新后的地块 + 是否刚揭晓品种
 */
export function updatePlotGrowth(
  plot: Plot,
  growthMinutes: number,
  nowTimestamp: number = Date.now(),
): { plot: Plot; justRevealed: boolean; mutationOutcome?: MutationOutcome } {
  if (plot.state !== 'growing') return { plot, justRevealed: false };
  if (!plot.varietyId) return { plot, justRevealed: false };

  const varietyDef = VARIETY_DEFS[plot.varietyId];
  const matureMinutes = varietyDef?.matureMinutes ?? 10000;
  const safeGrowthMinutes = Math.max(0, Math.floor(growthMinutes));
  const prevAccumulatedMinutes = Math.max(
    0,
    Math.floor(plot.accumulatedMinutes > 0 ? plot.accumulatedMinutes : plot.progress * matureMinutes),
  );
  const prevProgress = plot.progress;
  const nextAccumulatedMinutes = Math.min(matureMinutes, prevAccumulatedMinutes + safeGrowthMinutes);
  const newProgress = Math.min(1, nextAccumulatedMinutes / matureMinutes);
  const safeNow = Number.isFinite(nowTimestamp) && nowTimestamp > 0 ? nowTimestamp : Date.now();
  const todayKey = new Date(safeNow).toISOString().slice(0, 10);

  const wasRevealed = isVarietyRevealed(prevProgress);
  const nowRevealed = isVarietyRevealed(newProgress);
  const justRevealed = !wasRevealed && nowRevealed;

  const newState = newProgress >= 1 ? 'mature' as const : 'growing' as const;
  const preMutationPlot: Plot = {
    ...plot,
    progress: newProgress,
    accumulatedMinutes: nextAccumulatedMinutes,
    state: newState,
    lastUpdateDate: todayKey,
    lastActivityTimestamp: safeNow,
  };
  const currentMutationStatus = preMutationPlot.mutationStatus ?? 'none';
  const currentMutationChance = preMutationPlot.mutationChance ?? 0.02;
  const shouldRollMutation = newProgress >= MUTATION_TRIGGER_PROGRESS
    && currentMutationStatus === 'none'
    && currentMutationChance > 0
    && (prevProgress < MUTATION_TRIGGER_PROGRESS || currentMutationChance > 0.02);
  const finalPlot = shouldRollMutation ? rollMutation(preMutationPlot) : preMutationPlot;
  const finalMutationStatus = finalPlot.mutationStatus;
  const mutationOutcome = shouldRollMutation && (finalMutationStatus === 'positive' || finalMutationStatus === 'negative')
    ? { varietyId: plot.varietyId, status: finalMutationStatus }
    : undefined;

  return {
    plot: finalPlot,
    justRevealed,
    mutationOutcome,
  };
}

/**
 * 枯萎检测：连续 3 天未活跃 → 所有生长中的地块枯萎
 */
export function witherPlots(
  plots: Plot[],
  nowTimestamp: number = Date.now(),
  fallbackLastActivityTimestamp: number = 0,
): Plot[] {
  const safeNow = Number.isFinite(nowTimestamp) && nowTimestamp > 0 ? nowTimestamp : Date.now();
  const todayKey = new Date(safeNow).toISOString().slice(0, 10);

  return plots.map(p => {
    if (p.state === 'growing' || p.state === 'mature') {
      const plotLastActivity = p.lastActivityTimestamp > 0 ? p.lastActivityTimestamp : fallbackLastActivityTimestamp;
      const status = getWitherStatus(plotLastActivity, safeNow);
      if (status.shouldWither) {
        return {
          ...p,
          state: 'withered' as const,
          lastUpdateDate: todayKey,
          lastActivityTimestamp: safeNow,
        };
      }
    }
    return p;
  });
}
