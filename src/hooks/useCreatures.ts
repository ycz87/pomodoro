import { useEffect } from 'react';
import type { Creature } from '../types/farm';
import { useLocalStorage } from './useLocalStorage';
import {
  createRandomCreature,
  migrateCreatures,
  pruneExpiredCreatures,
  shouldSpawnCreature,
} from '../utils/creatures';

const CREATURES_STORAGE_KEY = 'creatures';

export function useCreatures() {
  const [creatures, setCreatures] = useLocalStorage<Creature[]>(
    CREATURES_STORAGE_KEY,
    [],
    migrateCreatures,
  );

  // App open check: cleanup expired creatures, then roll 10% spawn chance.
  useEffect(() => {
    const now = Date.now();
    setCreatures((prev) => {
      const active = pruneExpiredCreatures(prev, now);
      if (active.length > 0) {
        return active.slice(0, 1);
      }
      if (!shouldSpawnCreature()) {
        return active;
      }
      return [createRandomCreature(now)];
    });
  }, [setCreatures]);

  // Auto remove creature after 5-15 seconds.
  useEffect(() => {
    if (creatures.length === 0) return;

    const now = Date.now();
    const nextExpiry = Math.min(...creatures.map((creature) => creature.expiresAt));
    const delay = Math.max(0, nextExpiry - now);
    const timeoutId = window.setTimeout(() => {
      setCreatures((prev) => pruneExpiredCreatures(prev, Date.now()));
    }, delay + 10);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [creatures, setCreatures]);

  return {
    creatures,
    setCreatures,
  };
}
