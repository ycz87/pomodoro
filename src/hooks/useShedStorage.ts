/**
 * useShedStorage — 种子/道具/保底存储 hook
 *
 * 管理切瓜产出的种子（三品质）、道具和保底计数器，持久化到 localStorage。
 */
import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { ItemId, ShedStorage, SeedQuality, PityCounter, InjectedSeed } from '../types/slicing';
import { DEFAULT_SHED_STORAGE, ALL_ITEM_IDS, DEFAULT_PITY, DEFAULT_SEED_COUNTS } from '../types/slicing';

const SHED_KEY = 'watermelon-shed';
const INJECTED_SEED_QUALITIES: SeedQuality[] = ['normal', 'epic', 'legendary'];
const INJECTED_SEED_GALAXIES: InjectedSeed['targetGalaxyId'][] = [
  'thick-earth', 'fire', 'water', 'wood', 'metal', 'rainbow', 'dark-matter',
];

function migrateShed(raw: unknown): ShedStorage {
  if (!raw || typeof raw !== 'object') return DEFAULT_SHED_STORAGE;
  const s = raw as Record<string, unknown>;
  const result: ShedStorage = {
    seeds: { ...DEFAULT_SEED_COUNTS },
    items: { ...DEFAULT_SHED_STORAGE.items },
    totalSliced: 0,
    pity: { ...DEFAULT_PITY },
    injectedSeeds: [],
  };

  // Migrate seeds: old format was a single number, new format is { normal, epic, legendary }
  if (typeof s.seeds === 'number') {
    result.seeds.normal = s.seeds;
  } else if (s.seeds && typeof s.seeds === 'object') {
    const sc = s.seeds as Record<string, number>;
    if (typeof sc.normal === 'number') result.seeds.normal = sc.normal;
    if (typeof sc.epic === 'number') result.seeds.epic = sc.epic;
    if (typeof sc.legendary === 'number') result.seeds.legendary = sc.legendary;
  }

  if (typeof s.totalSliced === 'number') result.totalSliced = s.totalSliced;

  if (s.items && typeof s.items === 'object') {
    const items = s.items as Record<string, number>;
    for (const id of ALL_ITEM_IDS) {
      if (typeof items[id] === 'number') result.items[id] = items[id];
    }
  }

  if (s.pity && typeof s.pity === 'object') {
    const p = s.pity as Record<string, number>;
    if (typeof p.epicPity === 'number') result.pity.epicPity = p.epicPity;
    if (typeof p.legendaryPity === 'number') result.pity.legendaryPity = p.legendaryPity;
  }

  if (Array.isArray(s.injectedSeeds)) {
    for (const seed of s.injectedSeeds) {
      if (!seed || typeof seed !== 'object') continue;
      const candidate = seed as Record<string, unknown>;
      if (
        typeof candidate.id === 'string'
        && INJECTED_SEED_QUALITIES.includes(candidate.quality as SeedQuality)
        && INJECTED_SEED_GALAXIES.includes(candidate.targetGalaxyId as InjectedSeed['targetGalaxyId'])
      ) {
        result.injectedSeeds.push({
          id: candidate.id,
          quality: candidate.quality as SeedQuality,
          targetGalaxyId: candidate.targetGalaxyId as InjectedSeed['targetGalaxyId'],
        });
      }
    }
  }

  return result;
}

export function useShedStorage() {
  const [shed, setShed] = useLocalStorage<ShedStorage>(SHED_KEY, DEFAULT_SHED_STORAGE, migrateShed);

  const addSeeds = useCallback((count: number, quality: SeedQuality = 'normal') => {
    setShed(prev => ({
      ...prev,
      seeds: { ...prev.seeds, [quality]: prev.seeds[quality] + count },
    }));
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

  const updatePityCounter = useCallback((newPity: PityCounter) => {
    setShed(prev => ({ ...prev, pity: newPity }));
  }, [setShed]);

  const resetShed = useCallback(() => {
    setShed({
      seeds: { ...DEFAULT_SEED_COUNTS },
      items: { ...DEFAULT_SHED_STORAGE.items },
      totalSliced: 0,
      pity: { ...DEFAULT_PITY },
      injectedSeeds: [],
    });
  }, [setShed]);

  const addInjectedSeed = useCallback((seed: InjectedSeed): void => {
    setShed(prev => ({
      ...prev,
      injectedSeeds: [...prev.injectedSeeds, seed],
    }));
  }, [setShed]);

  /** 消耗一颗注入种子（返回是否成功） */
  const consumeInjectedSeed = useCallback((id: string): boolean => {
    let success = false;
    setShed(prev => {
      const index = prev.injectedSeeds.findIndex(seed => seed.id === id);
      if (index < 0) return prev;
      success = true;
      return {
        ...prev,
        injectedSeeds: [
          ...prev.injectedSeeds.slice(0, index),
          ...prev.injectedSeeds.slice(index + 1),
        ],
      };
    });
    return success;
  }, [setShed]);

  /** 消耗一颗种子（种植时调用），返回是否成功 */
  const consumeSeed = useCallback((quality: SeedQuality): boolean => {
    let success = false;
    setShed(prev => {
      if (prev.seeds[quality] <= 0) return prev;
      success = true;
      return { ...prev, seeds: { ...prev.seeds, [quality]: prev.seeds[quality] - 1 } };
    });
    return success;
  }, [setShed]);

  return {
    shed,
    addSeeds,
    addItem,
    incrementSliced,
    updatePityCounter,
    consumeSeed,
    addInjectedSeed,
    consumeInjectedSeed,
    resetShed,
  };
}
