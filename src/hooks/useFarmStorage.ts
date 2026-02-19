/**
 * useFarmStorage — 农场数据持久化 hook
 */
import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { FarmStorage, Plot, CollectedVariety, VarietyId, GalaxyId, StolenRecord, Rarity } from '../types/farm';
import type { SeedQuality } from '../types/slicing';
import { DEFAULT_FARM_STORAGE, createEmptyPlot, VARIETY_DEFS } from '../types/farm';
import { rollVariety } from '../farm/growth';
import { getPlotCount } from '../farm/galaxy';

const FARM_KEY = 'watermelon-farm';
const RARITY_UPGRADE_MAP: Record<Rarity, Rarity | null> = {
  common: 'rare',
  rare: 'epic',
  epic: 'legendary',
  legendary: null,
};

function getTodayKeyFromTimestamp(timestamp: number): string {
  return new Date(timestamp).toISOString().slice(0, 10);
}

function normalizeStolenRecord(raw: unknown): StolenRecord | null {
  if (!raw || typeof raw !== 'object') return null;
  const record = raw as Record<string, unknown>;
  if (typeof record.varietyId !== 'string') return null;
  if (typeof record.stolenAt !== 'number' || !Number.isFinite(record.stolenAt)) return null;

  const stolenAt = record.stolenAt;
  const resolved = typeof record.resolved === 'boolean'
    ? record.resolved
    : typeof record.recovered === 'boolean'
      ? record.recovered
      : false;
  const recoveredCount = typeof record.recoveredCount === 'number' && Number.isFinite(record.recoveredCount)
    ? Math.max(0, Math.floor(record.recoveredCount))
    : (record.recovered === true ? 1 : 0);
  const id = typeof record.id === 'string' && record.id.length > 0
    ? record.id
    : `${stolenAt}-${record.varietyId}-${Math.random().toString(36).slice(2, 9)}`;

  return {
    id,
    plotId: typeof record.plotId === 'number' && Number.isFinite(record.plotId) ? Math.max(0, Math.floor(record.plotId)) : 0,
    varietyId: record.varietyId as VarietyId,
    stolenAt,
    resolved,
    recoveredCount,
    recoveredAt: typeof record.recoveredAt === 'number' && Number.isFinite(record.recoveredAt)
      ? record.recoveredAt
      : undefined,
  };
}

function pickUpgradedVariety(currentVarietyId: VarietyId): VarietyId | null {
  const currentDef = VARIETY_DEFS[currentVarietyId];
  if (!currentDef) return null;
  const nextRarity = RARITY_UPGRADE_MAP[currentDef.rarity];
  if (!nextRarity) return null;

  const candidates = (Object.keys(VARIETY_DEFS) as VarietyId[]).filter((varietyId) => {
    const def = VARIETY_DEFS[varietyId];
    if (!def || def.rarity !== nextRarity) return false;
    if (def.breedType !== currentDef.breedType) return false;
    if (def.galaxy !== currentDef.galaxy) return false;
    if (def.hybridPair !== currentDef.hybridPair) return false;
    return true;
  });

  if (candidates.length === 0) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

function ensurePlotCapacity(plots: Plot[], requiredCount: number): Plot[] {
  if (plots.length >= requiredCount) return plots;
  const nextPlots = [...plots];
  while (nextPlots.length < requiredCount) {
    nextPlots.push(createEmptyPlot(nextPlots.length));
  }
  return nextPlots;
}

function migrateFarm(raw: unknown): FarmStorage {
  if (!raw || typeof raw !== 'object') return DEFAULT_FARM_STORAGE;
  const s = raw as Record<string, unknown>;
  const result: FarmStorage = {
    plots: [...DEFAULT_FARM_STORAGE.plots],
    collection: [],
    lastActiveDate: '',
    consecutiveInactiveDays: 0,
    lastActivityTimestamp: 0,
    guardianBarrierDate: '',
    stolenRecords: [],
  };

  if (Array.isArray(s.collection)) {
    result.collection = (s.collection as CollectedVariety[]).map((record) => ({
      ...record,
      isMutant: record.isMutant === true ? true : undefined,
    }));
  }

  if (Array.isArray(s.plots)) {
    result.plots = (s.plots as Plot[]).map((p, i) => {
      const candidate = p as unknown as Record<string, unknown>;
      const rawThief = candidate.thief;
      const thiefRecord = rawThief && typeof rawThief === 'object'
        ? (rawThief as Record<string, unknown>)
        : null;
      const appearedAt = thiefRecord && typeof thiefRecord.appearedAt === 'number' && Number.isFinite(thiefRecord.appearedAt)
        ? thiefRecord.appearedAt
        : 0;
      const legacyStealsAt = thiefRecord && typeof thiefRecord.stealsAt === 'number' && Number.isFinite(thiefRecord.stealsAt)
        ? thiefRecord.stealsAt
        : 0;
      const stealAt = thiefRecord && typeof thiefRecord.stealAt === 'number' && Number.isFinite(thiefRecord.stealAt)
        ? thiefRecord.stealAt
        : legacyStealsAt;

      return {
        ...createEmptyPlot(i),
        ...p,
        id: i,
        hasTracker: p.hasTracker === true,
        thief: appearedAt > 0 && stealAt > 0
          ? { appearedAt, stealAt }
          : undefined,
      };
    });
  }

  const targetPlotCount = getPlotCount(result.collection);
  result.plots = ensurePlotCapacity(result.plots, targetPlotCount);

  if (typeof s.lastActiveDate === 'string') result.lastActiveDate = s.lastActiveDate;
  if (typeof s.consecutiveInactiveDays === 'number') result.consecutiveInactiveDays = s.consecutiveInactiveDays;
  if (typeof s.lastActivityTimestamp === 'number') result.lastActivityTimestamp = s.lastActivityTimestamp;
  if (typeof s.guardianBarrierDate === 'string') result.guardianBarrierDate = s.guardianBarrierDate;
  if (Array.isArray(s.stolenRecords)) {
    result.stolenRecords = s.stolenRecords
      .map((record) => normalizeStolenRecord(record))
      .filter((record): record is StolenRecord => record !== null);
  }

  return result;
}

export function useFarmStorage() {
  const [farm, setFarm] = useLocalStorage<FarmStorage>(FARM_KEY, DEFAULT_FARM_STORAGE, migrateFarm);

  /** 种植种子到指定地块 */
  const plantSeed = useCallback((plotId: number, unlockedGalaxies: GalaxyId[], seedQuality: SeedQuality, todayKey: string) => {
    const nowTimestamp = Date.now();
    const varietyId = rollVariety(unlockedGalaxies, seedQuality);
    let success = true;

    setFarm(prev => {
      const targetPlot = prev.plots.find(p => p.id === plotId);
      if (!targetPlot || targetPlot.state !== 'empty') {
        success = false;
        return prev;
      }

      return {
        ...prev,
        plots: prev.plots.map(p =>
          p.id === plotId ? {
            ...p,
            state: 'growing' as const,
            seedQuality,
            varietyId,
            progress: 0,
            mutationStatus: 'none',
            mutationChance: 0.02,
            isMutant: false,
            accumulatedMinutes: 0,
            plantedDate: todayKey,
            lastUpdateDate: todayKey,
            lastActivityTimestamp: nowTimestamp,
            hasTracker: false,
            thief: undefined,
          } : p
        ),
      };
    });

    return success ? varietyId : ('' as VarietyId);
  }, [setFarm]);

  /** 种植已确定品种的种子（注入种子用） */
  const plantSeedWithVariety = useCallback((plotId: number, varietyId: VarietyId, seedQuality: SeedQuality, todayKey: string) => {
    const nowTimestamp = Date.now();
    let success = true;

    setFarm(prev => {
      const targetPlot = prev.plots.find(p => p.id === plotId);
      if (!targetPlot || targetPlot.state !== 'empty') {
        success = false;
        return prev;
      }

      return {
        ...prev,
        plots: prev.plots.map(p =>
          p.id === plotId ? {
            ...p,
            state: 'growing' as const,
            seedQuality,
            varietyId,
            progress: 0,
            mutationStatus: 'none',
            mutationChance: 0.02,
            isMutant: false,
            accumulatedMinutes: 0,
            plantedDate: todayKey,
            lastUpdateDate: todayKey,
            lastActivityTimestamp: nowTimestamp,
            hasTracker: false,
            thief: undefined,
          } : p
        ),
      };
    });

    return success;
  }, [setFarm]);

  /** 收获地块 */
  const harvestPlot = useCallback((plotId: number, todayKey: string) => {
    let harvestedVariety: VarietyId | undefined;
    let harvestedIsMutant = false;
    let isNew = false;
    let collectedCount = 0;
    let rewardSeedQuality: SeedQuality | undefined;

    setFarm(prev => {
      const plot = prev.plots.find(p => p.id === plotId);
      if (!plot || plot.state !== 'mature' || !plot.varietyId) return prev;

      harvestedVariety = plot.varietyId;
      harvestedIsMutant = plot.isMutant === true;
      const isSameCollectionEntry = (record: CollectedVariety): boolean => (
        record.varietyId === plot.varietyId
        && (record.isMutant === true) === harvestedIsMutant
      );
      const existing = prev.collection.find(isSameCollectionEntry);
      isNew = !existing;
      collectedCount = existing ? existing.count + 1 : 1;
      rewardSeedQuality = isNew ? (plot.seedQuality ?? 'normal') : undefined;

      const newCollection = existing
        ? prev.collection.map(c =>
            isSameCollectionEntry(c) ? { ...c, count: c.count + 1 } : c
          )
        : [
            ...prev.collection,
            {
              varietyId: plot.varietyId,
              isMutant: harvestedIsMutant ? true : undefined,
              firstObtainedDate: todayKey,
              count: 1,
            },
          ];
      const targetPlotCount = getPlotCount(newCollection);
      const nextPlots = prev.plots.map(p => (p.id === plotId ? createEmptyPlot(plotId) : p));

      return {
        ...prev,
        plots: ensurePlotCapacity(nextPlots, targetPlotCount),
        collection: newCollection,
      };
    });

    return {
      varietyId: harvestedVariety,
      isMutant: harvestedIsMutant,
      isNew,
      collectedCount,
      rewardSeedQuality,
    };
  }, [setFarm]);

  /** 卖出品种（仅减少图鉴 count，条目保留） */
  const sellVariety = useCallback((varietyId: VarietyId, isMutant: boolean = false): boolean => {
    let success = false;

    setFarm(prev => {
      const isSameCollectionEntry = (record: CollectedVariety): boolean => (
        record.varietyId === varietyId
        && (record.isMutant === true) === isMutant
      );
      const record = prev.collection.find(isSameCollectionEntry);
      if (!record || record.count <= 0) return prev;
      success = true;

      return {
        ...prev,
        collection: prev.collection.map(item => (
          isSameCollectionEntry(item)
            ? { ...item, count: Math.max(0, item.count - 1) }
            : item
        )),
      };
    });

    return success;
  }, [setFarm]);

  /** 清除枯萎地块 */
  const clearPlot = useCallback((plotId: number) => {
    setFarm(prev => ({
      ...prev,
      plots: prev.plots.map(p => p.id === plotId ? createEmptyPlot(plotId) : p),
    }));
  }, [setFarm]);

  /** 批量更新地块（生长引擎调用后写回） */
  const updatePlots = useCallback((newPlots: Plot[]) => {
    setFarm(prev => ({ ...prev, plots: newPlots }));
  }, [setFarm]);

  /** 增加单个地块的变异概率（返回是否成功） */
  const updatePlotMutationChance = useCallback((plotId: number, increaseBy: number): boolean => {
    let success = false;
    const normalizedIncrease = Math.max(0, increaseBy);

    setFarm(prev => {
      const targetPlot = prev.plots.find(p => p.id === plotId);
      if (!targetPlot) return prev;
      if (targetPlot.state !== 'growing') return prev;
      if (targetPlot.progress >= 0.20) return prev;
      if ((targetPlot.mutationStatus ?? 'none') !== 'none') return prev;

      const currentChance = targetPlot.mutationChance ?? 0.02;
      const nextChance = Math.max(0, Math.min(1, currentChance + normalizedIncrease));
      if (nextChance <= currentChance) return prev;

      success = true;
      return {
        ...prev,
        plots: prev.plots.map(p => (
          p.id === plotId
            ? { ...p, mutationChance: nextChance }
            : p
        )),
      };
    });

    return success;
  }, [setFarm]);

  /** 购买地块并扩容（返回是否成功） */
  const buyPlot = useCallback((plotIndex: number): boolean => {
    if (plotIndex < 0) return false;
    let success = false;
    setFarm(prev => {
      if (prev.plots.length > plotIndex) return prev;
      const nextPlots = [...prev.plots];
      while (nextPlots.length <= plotIndex) {
        nextPlots.push(createEmptyPlot(nextPlots.length));
      }
      success = true;
      return { ...prev, plots: nextPlots };
    });
    return success;
  }, [setFarm]);

  /** 更新活跃日信息 */
  const updateActiveDate = useCallback((todayKey: string, consecutiveInactiveDays: number, activityTimestamp: number = Date.now()) => {
    setFarm(prev => ({
      ...prev,
      lastActiveDate: todayKey,
      consecutiveInactiveDays,
      lastActivityTimestamp: activityTimestamp,
      plots: prev.plots.map(p => (
        p.state === 'growing' || p.state === 'mature'
          ? { ...p, lastActivityTimestamp: activityTimestamp, lastUpdateDate: todayKey }
          : p
      )),
    }));
  }, [setFarm]);

  /** 激活防护结界（当天有效） */
  const activateGuardianBarrier = useCallback((todayKey: string): boolean => {
    if (!todayKey) return false;
    let changed = false;

    setFarm(prev => {
      if (prev.guardianBarrierDate === todayKey && prev.plots.every((plot) => !plot.thief)) {
        return prev;
      }
      changed = true;
      return {
        ...prev,
        guardianBarrierDate: todayKey,
        plots: prev.plots.map((plot) => (plot.thief ? { ...plot, thief: undefined } : plot)),
      };
    });

    return changed;
  }, [setFarm]);

  /** 为地块安装星际追踪器 */
  const addPlotTracker = useCallback((plotId: number): boolean => {
    let success = false;
    setFarm(prev => {
      const plot = prev.plots.find((p) => p.id === plotId);
      if (!plot) return prev;
      if (!(plot.state === 'growing' || plot.state === 'mature')) return prev;
      if (plot.hasTracker) return prev;

      success = true;
      return {
        ...prev,
        plots: prev.plots.map((p) => (p.id === plotId ? { ...p, hasTracker: true } : p)),
      };
    });
    return success;
  }, [setFarm]);

  /** 记录被偷记录（用于追回） */
  const addStolenRecord = useCallback((record: StolenRecord) => {
    setFarm(prev => ({
      ...prev,
      stolenRecords: [...prev.stolenRecords, record],
    }));
  }, [setFarm]);

  /** 标记被偷记录为已追回（按 stolenAt 定位） */
  const markStolenRecordRecovered = useCallback((stolenAt: number): boolean => {
    if (!Number.isFinite(stolenAt) || stolenAt <= 0) return false;
    let updated = false;
    const recoveredAt = Date.now();

    setFarm((prev) => {
      const hasTarget = prev.stolenRecords.some(
        (record) => record.stolenAt === stolenAt && !record.resolved,
      );
      if (!hasTarget) return prev;

      updated = true;
      return {
        ...prev,
        stolenRecords: prev.stolenRecords.map((record) => (
          record.stolenAt === stolenAt && !record.resolved
            ? {
                ...record,
                resolved: true,
                recoveredCount: Math.max(1, record.recoveredCount),
                recoveredAt,
              }
            : record
        )),
      };
    });

    return updated;
  }, [setFarm]);

  /** 复活枯萎西瓜（琼浆玉露） */
  const revivePlot = useCallback((plotId: number): boolean => {
    let success = false;
    const nowTimestamp = Date.now();
    const todayKey = getTodayKeyFromTimestamp(nowTimestamp);

    setFarm(prev => {
      const plot = prev.plots.find((p) => p.id === plotId);
      if (!plot || plot.state !== 'withered') return prev;

      success = true;
      return {
        ...prev,
        plots: prev.plots.map((p) => (
          p.id === plotId
            ? {
                ...p,
                state: 'growing',
                lastActivityTimestamp: nowTimestamp,
                lastUpdateDate: todayKey,
              }
            : p
        )),
      };
    });
    return success;
  }, [setFarm]);

  /** 升级品种稀有度（月神甘露） */
  const upgradePlotRarity = useCallback((plotId: number): boolean => {
    let success = false;

    setFarm(prev => {
      const plot = prev.plots.find((p) => p.id === plotId);
      if (!plot || plot.state !== 'mature' || !plot.varietyId) return prev;

      const upgradedVarietyId = pickUpgradedVariety(plot.varietyId);
      if (!upgradedVarietyId) return prev;

      success = true;
      return {
        ...prev,
        plots: prev.plots.map((p) => (
          p.id === plotId
            ? { ...p, varietyId: upgradedVarietyId }
            : p
        )),
      };
    });

    return success;
  }, [setFarm]);

  return {
    farm,
    setFarm,
    plantSeed,
    plantSeedWithVariety,
    harvestPlot,
    sellVariety,
    clearPlot,
    updatePlots,
    updatePlotMutationChance,
    buyPlot,
    updateActiveDate,
    activateGuardianBarrier,
    addPlotTracker,
    addStolenRecord,
    markStolenRecordRecovered,
    revivePlot,
    upgradePlotRarity,
  };
}
