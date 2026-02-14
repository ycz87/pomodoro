/**
 * useAchievements — manages achievement state, detection, and unlock events
 */
import { useCallback, useRef, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { AchievementData } from '../achievements/types';
import { DEFAULT_ACHIEVEMENT_DATA } from '../achievements/types';
import { detectAchievements, detectOnDailyOpen } from '../achievements/detection';
import type { PomodoroRecord } from '../types';

const STORAGE_KEY = 'achievements';

export function useAchievements(records: PomodoroRecord[], totalProjects: number) {
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
  const checkAfterSession = useCallback((sessionMinutes: number, sessionCompleted: boolean): string[] => {
    const { updatedData, newlyUnlocked } = detectAchievements({
      data,
      records,
      sessionMinutes,
      sessionCompleted,
      now: new Date(),
      totalProjects,
    });
    setData(updatedData);
    if (newlyUnlocked.length > 0) {
      pendingUnlocksRef.current = [...pendingUnlocksRef.current, ...newlyUnlocked];
    }
    return newlyUnlocked;
  }, [data, records, totalProjects, setData]);

  /** Mark achievements as seen (user viewed them) */
  const markSeen = useCallback((ids: string[]) => {
    setData(prev => ({
      ...prev,
      seen: [...new Set([...prev.seen, ...ids])],
    }));
  }, [setData]);

  /** Get count of unseen unlocked achievements */
  const unseenCount = Object.keys(data.unlocked).filter(id => !data.seen.includes(id)).length;

  /** Consume pending unlocks (for celebration display) */
  const consumePendingUnlocks = useCallback((): string[] => {
    const pending = [...pendingUnlocksRef.current];
    pendingUnlocksRef.current = [];
    return pending;
  }, []);

  return {
    data,
    checkAfterSession,
    markSeen,
    unseenCount,
    consumePendingUnlocks,
  };
}
