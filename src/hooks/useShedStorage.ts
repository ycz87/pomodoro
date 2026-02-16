/**
 * useShedStorage — 种子/道具存储 hook
 *
 * 管理切瓜产出的种子和道具，持久化到 localStorage。
 */
import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { ItemId, ShedStorage } from '../types/slicing';
import { DEFAULT_SHED_STORAGE, ALL_ITEM_IDS } from '../types/slicing';

const SHED_KEY = 'watermelon-shed';

function migrateShed(raw: unknown): ShedStorage {
  if (!raw || typeof raw !== 'object') return DEFAULT_SHED_STORAGE;
  const s = raw as Record<string, unknown>;
  const result: ShedStorage = {
    seeds: 0,
    items: { ...DEFAULT_SHED_STORAGE.items },
    totalSliced: 0,
  };
  if (typeof s.seeds === 'number') result.seeds = s.seeds;
  if (typeof s.totalSliced === 'number') result.totalSliced = s.totalSliced;
  if (s.items && typeof s.items === 'object') {
    const items = s.items as Record<string, number>;
    for (const id of ALL_ITEM_IDS) {
      if (typeof items[id] === 'number') result.items[id] = items[id];
    }
  }
  return result;
}

export function useShedStorage() {
  const [shed, setShed] = useLocalStorage<ShedStorage>(SHED_KEY, DEFAULT_SHED_STORAGE, migrateShed);

  const addSeeds = useCallback((count: number) => {
    setShed(prev => ({ ...prev, seeds: prev.seeds + count }));
  }, [setShed]);

  const addItem = useCallback((id: ItemId) => {
    setShed(prev => ({
      ...prev,
      items: { ...prev.items, [id]: prev.items[id] + 1 },
    }));
  }, [setShed]);

  const incrementSliced = useCallback(() => {
    setShed(prev => ({ ...prev, totalSliced: prev.totalSliced + 1 }));
  }, [setShed]);

  const resetShed = useCallback(() => {
    setShed({ ...DEFAULT_SHED_STORAGE, items: { ...DEFAULT_SHED_STORAGE.items } });
  }, [setShed]);

  return { shed, addSeeds, addItem, incrementSliced, resetShed };
}
