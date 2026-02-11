/**
 * useWarehouse — 仓库数据管理 hook
 *
 * 管理收获物存储、合成操作、保底计数器。
 * 数据持久化到 localStorage。
 */
import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { GrowthStage, Warehouse, SynthesisRecipe } from '../types';
import { DEFAULT_WAREHOUSE, SYNTHESIS_RECIPES } from '../types';

const WAREHOUSE_KEY = 'watermelon-warehouse';

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

export function useWarehouse() {
  const [warehouse, setWarehouse] = useLocalStorage<Warehouse>(WAREHOUSE_KEY, DEFAULT_WAREHOUSE, migrateWarehouse);

  /** 添加收获物到仓库 */
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

  /** 执行合成 */
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

  /** 合成全部（某条配方） */
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

  return {
    warehouse,
    addItem,
    updatePity,
    synthesize,
    synthesizeAll,
    getHighestStage,
    recipes: SYNTHESIS_RECIPES,
  };
}
