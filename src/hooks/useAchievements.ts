/**
 * useAchievements — manages achievement state, detection, and unlock events
 */
import { useCallback, useRef, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { AchievementData } from '../achievements/types';
import { DEFAULT_ACHIEVEMENT_DATA } from '../achievements/types';
import { detectAchievements, detectOnDailyOpen, detectWarehouseAchievements, detectFarmAchievements } from '../achievements/detection';
import type { PomodoroRecord, Warehouse } from '../types';
import type { AmbienceMixerConfig } from '../audio';
import { ALL_ACHIEVEMENTS } from '../achievements/definitions';

const STORAGE_KEY = 'achievements';

function createEmptyAchievementData(): AchievementData {
  return {
    unlocked: {},
    progress: {
      ...DEFAULT_ACHIEVEMENT_DATA.progress,
      soundComboDays: [],
      soundComboHashes: [],
      collectedStages: [],
      collectedTools: [],
      dailyModules: {
        ...DEFAULT_ACHIEVEMENT_DATA.progress.dailyModules,
        modules: [],
      },
    },
    seen: [],
  };
}

export function useAchievements(
  records: PomodoroRecord[],
  totalProjects: number,
  onSync?: (data: AchievementData) => void,
) {
  const [data, setData] = useLocalStorage<AchievementData>(STORAGE_KEY, DEFAULT_ACHIEVEMENT_DATA);
  const pendingUnlocksRef = useRef<string[]>([]);
  const dailyCheckedRef = useRef(false);

  // Daily open check (runs once per mount)
  useEffect(() => {
    if (dailyCheckedRef.current) return;
    dailyCheckedRef.current = true;

    const lastCheck = data.progress.lastCheckInDate;
    const today = new Date().toISOString().slice(0, 10);
    if (lastCheck !== today) {
      const { updatedData, newlyUnlocked } = detectOnDailyOpen(data, records, totalProjects);
      if (newlyUnlocked.length > 0 || updatedData.progress !== data.progress) {
        setData(updatedData);
        if (newlyUnlocked.length > 0) {
          pendingUnlocksRef.current = [...pendingUnlocksRef.current, ...newlyUnlocked];
        }
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Call after a focus session completes.
   * Returns array of newly unlocked achievement IDs.
   */
  const checkAfterSession = useCallback((
    sessionMinutes: number,
    sessionCompleted: boolean,
    ambienceMixer?: AmbienceMixerConfig,
  ): string[] => {
    const { updatedData, newlyUnlocked } = detectAchievements({
      data,
      records,
      sessionMinutes,
      sessionCompleted,
      now: new Date(),
      totalProjects,
      ambienceMixer,
    });
    setData(updatedData);
    onSync?.(updatedData);
    if (newlyUnlocked.length > 0) {
      pendingUnlocksRef.current = [...pendingUnlocksRef.current, ...newlyUnlocked];
    }
    return newlyUnlocked;
  }, [data, records, totalProjects, setData, onSync]);

  /** Mark achievements as seen (user viewed them) */
  const markSeen = useCallback((ids: string[]) => {
    setData(prev => ({
      ...prev,
      seen: [...new Set([...prev.seen, ...ids])],
    }));
  }, [setData]);

  /**
   * Call after warehouse operations (addItem, synthesize).
   * Returns array of newly unlocked achievement IDs.
   */
  const checkWarehouse = useCallback((
    warehouse: Warehouse,
    trigger: 'addItem' | 'synthesize' | 'slice' | 'collectTool' | 'init',
    opts?: { addedStage?: string; synthesisCount?: number },
  ): string[] => {
    const { updatedData, newlyUnlocked } = detectWarehouseAchievements({
      data,
      warehouse,
      trigger,
      addedStage: opts?.addedStage,
      synthesisCount: opts?.synthesisCount,
    });
    setData(updatedData);
    onSync?.(updatedData);
    if (newlyUnlocked.length > 0) {
      pendingUnlocksRef.current = [...pendingUnlocksRef.current, ...newlyUnlocked];
    }
    return newlyUnlocked;
  }, [data, setData, onSync]);

  /**
   * Call after farm operations (plant, harvest, alien visit, thief defense, daily check).
   * Returns array of newly unlocked achievement IDs.
   * Not yet called — will be integrated when farm feature launches.
   */
  const checkFarm = useCallback((): string[] => {
    const { updatedData, newlyUnlocked } = detectFarmAchievements(data);
    setData(updatedData);
    onSync?.(updatedData);
    if (newlyUnlocked.length > 0) {
      pendingUnlocksRef.current = [...pendingUnlocksRef.current, ...newlyUnlocked];
    }
    return newlyUnlocked;
  }, [data, setData, onSync]);

  /** Get count of unseen unlocked achievements */
  const unseenCount = Object.keys(data.unlocked).filter(id => !data.seen.includes(id)).length;

  /** Consume pending unlocks (for celebration display) */
  const consumePendingUnlocks = useCallback((): string[] => {
    const pending = [...pendingUnlocksRef.current];
    pendingUnlocksRef.current = [];
    return pending;
  }, []);

  /** Merge cloud data into local (union of unlocked, earlier timestamps win) */
  const mergeFromCloud = useCallback((cloud: AchievementData) => {
    setData(prev => {
      const merged = { ...prev };
      const mergedUnlocked = { ...prev.unlocked };
      for (const [id, ts] of Object.entries(cloud.unlocked)) {
        if (!mergedUnlocked[id] || ts < mergedUnlocked[id]) {
          mergedUnlocked[id] = ts;
        }
      }
      merged.unlocked = mergedUnlocked;
      // Merge seen list
      merged.seen = [...new Set([...prev.seen, ...cloud.seen])];
      return merged;
    });
  }, [setData]);

  /** Debug helper: unlock all achievements with current timestamp */
  const unlockAll = useCallback(() => {
    const nowIso = new Date().toISOString();
    const unlocked: AchievementData['unlocked'] = {};
    for (const def of ALL_ACHIEVEMENTS) {
      unlocked[def.id] = nowIso;
    }

    const nextData: AchievementData = {
      ...data,
      unlocked,
    };
    setData(nextData);
    onSync?.(nextData);
    pendingUnlocksRef.current = [];
  }, [data, setData, onSync]);

  /** Debug helper: clear all achievement progress and unlocked states */
  const resetAll = useCallback(() => {
    const nextData = createEmptyAchievementData();
    setData(nextData);
    onSync?.(nextData);
    pendingUnlocksRef.current = [];
  }, [setData, onSync]);

  return {
    data,
    checkAfterSession,
    checkWarehouse,
    checkFarm,
    markSeen,
    unseenCount,
    consumePendingUnlocks,
    mergeFromCloud,
    unlockAll,
    resetAll,
  };
}
