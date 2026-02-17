/**
 * useFarmStorage — 农场数据持久化 hook
 */
import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { FarmStorage, Plot, CollectedVariety, VarietyId } from '../types/farm';
import type { SeedQuality } from '../types/slicing';
import { DEFAULT_FARM_STORAGE, createEmptyPlot } from '../types/farm';
import { rollVariety } from '../farm/growth';

const FARM_KEY = 'watermelon-farm';

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

  if (Array.isArray(s.plots)) {
    result.plots = (s.plots as Plot[]).map((p, i) => ({
      ...createEmptyPlot(i),
      ...p,
      id: i,
    }));
    // Ensure at least 4 plots
    while (result.plots.length < 4) {
      result.plots.push(createEmptyPlot(result.plots.length));
    }
  }

  if (Array.isArray(s.collection)) {
    result.collection = s.collection as CollectedVariety[];
  }

  if (typeof s.lastActiveDate === 'string') result.lastActiveDate = s.lastActiveDate;
  if (typeof s.consecutiveInactiveDays === 'number') result.consecutiveInactiveDays = s.consecutiveInactiveDays;
  if (typeof s.lastActivityTimestamp === 'number') result.lastActivityTimestamp = s.lastActivityTimestamp;

  return result;
}

export function useFarmStorage() {
  const [farm, setFarm] = useLocalStorage<FarmStorage>(FARM_KEY, DEFAULT_FARM_STORAGE, migrateFarm);

  /** 种植种子到指定地块 */
  const plantSeed = useCallback((plotId: number, seedQuality: SeedQuality, todayKey: string) => {
    const varietyId = rollVariety(seedQuality);
    setFarm(prev => ({
      ...prev,
      plots: prev.plots.map(p =>
        p.id === plotId ? {
          ...p,
          state: 'growing' as const,
          seedQuality,
          varietyId,
          progress: 0,
          plantedDate: todayKey,
          lastUpdateDate: todayKey,
        } : p
      ),
    }));
    return varietyId;
  }, [setFarm]);

  /** 收获地块 */
  const harvestPlot = useCallback((plotId: number, todayKey: string) => {
    let harvestedVariety: VarietyId | undefined;
    let isNew = false;
    let collectedCount = 0;

    setFarm(prev => {
      const plot = prev.plots.find(p => p.id === plotId);
      if (!plot || plot.state !== 'mature' || !plot.varietyId) return prev;

      harvestedVariety = plot.varietyId;
      const existing = prev.collection.find(c => c.varietyId === plot.varietyId);
      isNew = !existing;
      collectedCount = existing ? existing.count + 1 : 1;

      const newCollection = existing
        ? prev.collection.map(c =>
            c.varietyId === plot.varietyId ? { ...c, count: c.count + 1 } : c
          )
        : [...prev.collection, { varietyId: plot.varietyId, firstObtainedDate: todayKey, count: 1 }];

      return {
        ...prev,
        plots: prev.plots.map(p => p.id === plotId ? createEmptyPlot(plotId) : p),
        collection: newCollection,
      };
    });

    return { varietyId: harvestedVariety, isNew, collectedCount };
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

  /** 更新活跃日信息 */
  const updateActiveDate = useCallback((todayKey: string, consecutiveInactiveDays: number) => {
    setFarm(prev => ({ ...prev, lastActiveDate: todayKey, consecutiveInactiveDays }));
  }, [setFarm]);

  return { farm, plantSeed, harvestPlot, clearPlot, updatePlots, updateActiveDate };
}
