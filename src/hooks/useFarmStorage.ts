/**
 * useFarmStorage — 农场数据持久化 hook
 */
import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { FarmStorage, Plot, CollectedVariety, VarietyId, GalaxyId } from '../types/farm';
import type { SeedQuality } from '../types/slicing';
import { DEFAULT_FARM_STORAGE, createEmptyPlot } from '../types/farm';
import { rollVariety } from '../farm/growth';
import { getPlotCount } from '../farm/galaxy';

const FARM_KEY = 'watermelon-farm';

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
  };

  if (Array.isArray(s.collection)) {
    result.collection = s.collection as CollectedVariety[];
  }

  if (Array.isArray(s.plots)) {
    result.plots = (s.plots as Plot[]).map((p, i) => ({
      ...createEmptyPlot(i),
      ...p,
      id: i,
    }));
  }

  const targetPlotCount = getPlotCount(result.collection);
  result.plots = ensurePlotCapacity(result.plots, targetPlotCount);

  if (typeof s.lastActiveDate === 'string') result.lastActiveDate = s.lastActiveDate;
  if (typeof s.consecutiveInactiveDays === 'number') result.consecutiveInactiveDays = s.consecutiveInactiveDays;
  if (typeof s.lastActivityTimestamp === 'number') result.lastActivityTimestamp = s.lastActivityTimestamp;

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
            accumulatedMinutes: 0,
            plantedDate: todayKey,
            lastUpdateDate: todayKey,
            lastActivityTimestamp: nowTimestamp,
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
            accumulatedMinutes: 0,
            plantedDate: todayKey,
            lastUpdateDate: todayKey,
            lastActivityTimestamp: nowTimestamp,
          } : p
        ),
      };
    });

    return success;
  }, [setFarm]);

  /** 收获地块 */
  const harvestPlot = useCallback((plotId: number, todayKey: string) => {
    let harvestedVariety: VarietyId | undefined;
    let isNew = false;
    let collectedCount = 0;
    let rewardSeedQuality: SeedQuality | undefined;

    setFarm(prev => {
      const plot = prev.plots.find(p => p.id === plotId);
      if (!plot || plot.state !== 'mature' || !plot.varietyId) return prev;

      harvestedVariety = plot.varietyId;
      const existing = prev.collection.find(c => c.varietyId === plot.varietyId);
      isNew = !existing;
      collectedCount = existing ? existing.count + 1 : 1;
      rewardSeedQuality = isNew ? (plot.seedQuality ?? 'normal') : undefined;

      const newCollection = existing
        ? prev.collection.map(c =>
            c.varietyId === plot.varietyId ? { ...c, count: c.count + 1 } : c
          )
        : [...prev.collection, { varietyId: plot.varietyId, firstObtainedDate: todayKey, count: 1 }];
      const targetPlotCount = getPlotCount(newCollection);
      const nextPlots = prev.plots.map(p => (p.id === plotId ? createEmptyPlot(plotId) : p));

      return {
        ...prev,
        plots: ensurePlotCapacity(nextPlots, targetPlotCount),
        collection: newCollection,
      };
    });

    return { varietyId: harvestedVariety, isNew, collectedCount, rewardSeedQuality };
  }, [setFarm]);

  /** 卖出品种（仅减少图鉴 count，条目保留） */
  const sellVariety = useCallback((varietyId: VarietyId): boolean => {
    let success = false;

    setFarm(prev => {
      const record = prev.collection.find(item => item.varietyId === varietyId);
      if (!record || record.count <= 0) return prev;
      success = true;

      return {
        ...prev,
        collection: prev.collection.map(item => (
          item.varietyId === varietyId
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

  return {
    farm,
    setFarm,
    plantSeed,
    plantSeedWithVariety,
    harvestPlot,
    sellVariety,
    clearPlot,
    updatePlots,
    buyPlot,
    updateActiveDate,
  };
}
