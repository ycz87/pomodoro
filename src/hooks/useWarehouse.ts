/**
 * useWarehouse — 瓜棚数据管理 hook
 *
 * 管理收获物存储、合成操作、保底计数器。
 * 数据持久化到 localStorage。
 *
 * v0.8.0 hotfix: 初始化时自动迁移历史专注记录到瓜棚（一次性）。
 */
import { useCallback, useEffect, useRef } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { GrowthStage, Warehouse, SynthesisRecipe, PomodoroRecord } from '../types';
import { DEFAULT_WAREHOUSE, SYNTHESIS_RECIPES, getGrowthStage } from '../types';

const WAREHOUSE_KEY = 'watermelon-warehouse';
const MIGRATED_KEY = 'warehouse-migrated';
const RECORDS_KEY = 'pomodoro-records';

function migrateWarehouse(raw: unknown): Warehouse {
  if (!raw || typeof raw !== 'object') return DEFAULT_WAREHOUSE;
  const w = raw as Record<string, unknown>;
  const result = { ...DEFAULT_WAREHOUSE };
  if (w.items && typeof w.items === 'object') {
    const items = w.items as Record<string, number>;
    for (const key of Object.keys(result.items) as GrowthStage[]) {
      if (typeof items[key] === 'number') result.items[key] = items[key];
    }
  }
  if (typeof w.legendaryPity === 'number') result.legendaryPity = w.legendaryPity;
  if (typeof w.totalCollected === 'number') result.totalCollected = w.totalCollected;
  return result;
}

/** 从历史记录回填瓜棚（一次性迁移） */
function backfillFromRecords(): Partial<Warehouse> | null {
  try {
    if (localStorage.getItem(MIGRATED_KEY) === 'true') return null;

    const raw = localStorage.getItem(RECORDS_KEY);
    if (!raw) {
      localStorage.setItem(MIGRATED_KEY, 'true');
      return null;
    }

    const records: PomodoroRecord[] = JSON.parse(raw);
    const items: Record<GrowthStage, number> = { seed: 0, sprout: 0, bloom: 0, green: 0, ripe: 0, legendary: 0 };
    let total = 0;

    for (const r of records) {
      // 旧记录无 status 字段视为 completed
      if (r.status === 'abandoned') continue;
      if (r.durationMinutes < 5) continue;

      // ≥90min 历史记录统一给 ripe（不触发金西瓜概率）
      let stage = getGrowthStage(r.durationMinutes);
      if (r.durationMinutes >= 90) stage = 'ripe';

      items[stage]++;
      total++;
    }

    localStorage.setItem(MIGRATED_KEY, 'true');

    if (total === 0) return null;
    return { items, totalCollected: total };
  } catch {
    localStorage.setItem(MIGRATED_KEY, 'true');
    return null;
  }
}

export function useWarehouse() {
  const [warehouse, setWarehouse] = useLocalStorage<Warehouse>(WAREHOUSE_KEY, DEFAULT_WAREHOUSE, migrateWarehouse);
  const migrationDone = useRef(false);

  // 一次性迁移历史记录
  useEffect(() => {
    if (migrationDone.current) return;
    migrationDone.current = true;

    const backfill = backfillFromRecords();
    if (!backfill) return;

    setWarehouse((prev) => {
      // 只在瓜棚为空时回填（避免覆盖已有数据）
      if (prev.totalCollected > 0) return prev;
      return {
        ...prev,
        items: { ...prev.items, ...backfill.items },
        totalCollected: backfill.totalCollected ?? 0,
      };
    });
  }, [setWarehouse]);

  /** 添加收获物到瓜棚 */
  const addItem = useCallback((stage: GrowthStage) => {
    setWarehouse((prev) => ({
      ...prev,
      items: { ...prev.items, [stage]: prev.items[stage] + 1 },
      totalCollected: prev.totalCollected + 1,
    }));
  }, [setWarehouse]);

  /** 更新保底计数器（≥90min 未出金西瓜时 +1，出了时重置） */
  const updatePity = useCallback((gotLegendary: boolean) => {
    setWarehouse((prev) => ({
      ...prev,
      legendaryPity: gotLegendary ? 0 : prev.legendaryPity + 1,
    }));
  }, [setWarehouse]);

  /** 执行合成（手动触发，无自动合成） */
  const synthesize = useCallback((recipe: SynthesisRecipe, count: number = 1): boolean => {
    const available = warehouse.items[recipe.from];
    const maxCount = Math.floor(available / recipe.cost);
    const actual = Math.min(count, maxCount);
    if (actual <= 0) return false;

    setWarehouse((prev) => ({
      ...prev,
      items: {
        ...prev.items,
        [recipe.from]: prev.items[recipe.from] - actual * recipe.cost,
        [recipe.to]: prev.items[recipe.to] + actual,
      },
    }));
    return true;
  }, [warehouse.items, setWarehouse]);

  /** 合成全部（某条配方，手动触发） */
  const synthesizeAll = useCallback((recipe: SynthesisRecipe): number => {
    const available = warehouse.items[recipe.from];
    const count = Math.floor(available / recipe.cost);
    if (count <= 0) return 0;
    synthesize(recipe, count);
    return count;
  }, [warehouse.items, synthesize]);

  /** 获取最高阶收获物 */
  const getHighestStage = useCallback((): GrowthStage | null => {
    const order: GrowthStage[] = ['legendary', 'ripe', 'green', 'bloom', 'sprout', 'seed'];
    for (const stage of order) {
      if (warehouse.items[stage] > 0) return stage;
    }
    return null;
  }, [warehouse.items]);

  /** 批量添加收获物（测试用） */
  const addItems = useCallback((stage: GrowthStage, count: number) => {
    if (count <= 0) return;
    setWarehouse((prev) => ({
      ...prev,
      items: { ...prev.items, [stage]: prev.items[stage] + count },
      totalCollected: prev.totalCollected + count,
    }));
  }, [setWarehouse]);

  /** 清空瓜棚（测试用） */
  const resetWarehouse = useCallback(() => {
    setWarehouse({ ...DEFAULT_WAREHOUSE });
  }, [setWarehouse]);

  /** 重置迁移标记（测试用） */
  const resetMigration = useCallback(() => {
    try { localStorage.removeItem(MIGRATED_KEY); } catch { /* noop */ }
  }, []);

  return {
    warehouse,
    addItem,
    addItems,
    updatePity,
    synthesize,
    synthesizeAll,
    getHighestStage,
    resetWarehouse,
    resetMigration,
    recipes: SYNTHESIS_RECIPES,
  };
}
