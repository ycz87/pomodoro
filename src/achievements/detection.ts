/**
 * Achievement detection — checks unlock conditions for streak, focus, house & hidden series.
 * Returns array of newly unlocked achievement IDs.
 */
import type { AchievementData } from './types';
import type { PomodoroRecord, Warehouse } from '../types';
import { formatDateKey } from '../utils/stats';

interface DetectionContext {
  data: AchievementData;
  records: PomodoroRecord[];
  /** Duration of the session that just completed (minutes), 0 if not from session */
  sessionMinutes: number;
  /** Whether this session was completed (not abandoned) */
  sessionCompleted: boolean;
  /** Current date/time */
  now: Date;
  /** Total project records count */
  totalProjects: number;
}

/** Get ISO week key YYYY-WW */
function getWeekKey(date: Date): string {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const week1 = new Date(d.getFullYear(), 0, 4);
  const weekNum = 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
  return `${d.getFullYear()}-${weekNum.toString().padStart(2, '0')}`;
}

/**
 * Update progress based on a completed session, then check all unlockable achievements.
 * Returns { updatedData, newlyUnlocked[] }
 */
export function detectAchievements(ctx: DetectionContext): {
  updatedData: AchievementData;
  newlyUnlocked: string[];
} {
  const { records, sessionMinutes, sessionCompleted, now, totalProjects } = ctx;
  const data: AchievementData = JSON.parse(JSON.stringify(ctx.data));
  const progress = data.progress;
  const todayKey = formatDateKey(now);
  const newlyUnlocked: string[] = [];

  const isUnlocked = (id: string) => id in data.unlocked;
  const unlock = (id: string) => {
    if (!isUnlocked(id)) {
      data.unlocked[id] = now.toISOString();
      newlyUnlocked.push(id);
    }
  };

  // ── Update progress from session ──
  if (sessionMinutes > 0 && sessionCompleted) {
    progress.totalSessions++;
    progress.totalFocusMinutes += sessionMinutes;

    // First use date
    if (!progress.firstUseDate) {
      progress.firstUseDate = todayKey;
    }

    // Daily check-in tracking
    if (progress.lastCheckInDate !== todayKey) {
      progress.lastCheckInDate = todayKey;
      progress.todaySessions = 1;
    } else {
      progress.todaySessions++;
    }

    // Total unique days
    const allDates = new Set(records.map(r => r.date));
    allDates.add(todayKey);
    progress.totalDays = allDates.size;

    // Streak calculation from records
    const dateSet = new Set(records.filter(r => r.status !== 'abandoned').map(r => r.date));
    dateSet.add(todayKey);
    let streak = 0;
    const d = new Date(now);
    while (dateSet.has(formatDateKey(d))) {
      streak++;
      d.setDate(d.getDate() - 1);
    }
    progress.currentStreak = streak;
    if (streak > progress.maxStreak) progress.maxStreak = streak;

    // Weekend warrior tracking
    const dayOfWeek = now.getDay(); // 0=Sun, 6=Sat
    const weekKey = getWeekKey(now);
    if (progress.weekendWeekKey !== weekKey) {
      progress.weekendSatDone = false;
      progress.weekendSunDone = false;
      progress.weekendWeekKey = weekKey;
    }
    if (dayOfWeek === 6) progress.weekendSatDone = true;
    if (dayOfWeek === 0) progress.weekendSunDone = true;

    // Perfectionist tracking (X4)
    progress.consecutiveCompleted++;

    // Project count
    progress.totalProjects = totalProjects;
  }

  // If session was abandoned, reset perfectionist counter
  if (sessionMinutes > 0 && !sessionCompleted) {
    progress.consecutiveCompleted = 0;
  }

  // ── Check Streak Series ──
  // S1-S5: consecutive streak
  if (!isUnlocked('S1') && progress.currentStreak >= 3) unlock('S1');
  if (!isUnlocked('S2') && progress.currentStreak >= 7) unlock('S2');
  if (!isUnlocked('S3') && progress.currentStreak >= 14) unlock('S3');
  if (!isUnlocked('S4') && progress.currentStreak >= 30) unlock('S4');
  if (!isUnlocked('S5') && progress.currentStreak >= 100) unlock('S5');

  // S6: total days >= 100
  if (!isUnlocked('S6') && progress.totalDays >= 100) unlock('S6');

  // S7: Early Bird (6:00-8:00)
  if (!isUnlocked('S7') && sessionCompleted && sessionMinutes > 0) {
    const hour = now.getHours();
    if (hour >= 6 && hour < 8) unlock('S7');
  }

  // S8: Night Owl (22:00-00:00)
  if (!isUnlocked('S8') && sessionCompleted && sessionMinutes > 0) {
    const hour = now.getHours();
    if (hour >= 22 && hour <= 23) unlock('S8');
  }

  // S9: Weekend Warrior
  if (!isUnlocked('S9') && progress.weekendSatDone && progress.weekendSunDone) unlock('S9');

  // S10: Year One (365 days since first use)
  if (!isUnlocked('S10') && progress.firstUseDate) {
    const firstDate = new Date(progress.firstUseDate);
    const daysSinceFirst = Math.floor((now.getTime() - firstDate.getTime()) / 86400000);
    if (daysSinceFirst >= 365) unlock('S10');
  }

  // ── Check Focus Series ──
  // F1: first session
  if (!isUnlocked('F1') && progress.totalSessions >= 1) unlock('F1');

  // F2-F6: cumulative focus time
  if (!isUnlocked('F2') && progress.totalFocusMinutes >= 60) unlock('F2');
  if (!isUnlocked('F3') && progress.totalFocusMinutes >= 600) unlock('F3');
  if (!isUnlocked('F4') && progress.totalFocusMinutes >= 3000) unlock('F4');
  if (!isUnlocked('F5') && progress.totalFocusMinutes >= 6000) unlock('F5');
  if (!isUnlocked('F6') && progress.totalFocusMinutes >= 30000) unlock('F6');

  // F7: single session >= 45 min
  if (!isUnlocked('F7') && sessionCompleted && sessionMinutes >= 45) unlock('F7');

  // F8: single session >= 90 min
  if (!isUnlocked('F8') && sessionCompleted && sessionMinutes >= 90) unlock('F8');

  // F9: 10 sessions in one day
  if (!isUnlocked('F9') && progress.todaySessions >= 10) unlock('F9');

  // F10: 10 projects completed
  if (!isUnlocked('F10') && progress.totalProjects >= 10) unlock('F10');

  // ── Check Hidden Series ──
  // X1: Time Traveler (midnight ±30s)
  if (!isUnlocked('X1') && sessionCompleted && sessionMinutes > 0) {
    const totalSec = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    if (totalSec <= 30 || totalSec >= 86370) unlock('X1');
  }

  // X2: Valentine Melon (Feb 14)
  if (!isUnlocked('X2') && sessionCompleted && sessionMinutes > 0) {
    if (now.getMonth() === 1 && now.getDate() === 14) unlock('X2');
  }

  // X3: Sound Explorer (7 consecutive days with different sound combos)
  // This is tracked externally via updateSoundCombo()

  // X4: Perfectionist (5 consecutive completed sessions)
  if (!isUnlocked('X4') && progress.consecutiveCompleted >= 5) unlock('X4');

  // X5: All-Rounder — needs warehouse + farm interaction, skip for now
  // (would need external tracking)

  // X6: Midnight Gardener (2:00-4:00 AM)
  if (!isUnlocked('X6') && sessionCompleted && sessionMinutes > 0) {
    const hour = now.getHours();
    if (hour >= 2 && hour < 4) unlock('X6');
  }

  return { updatedData: data, newlyUnlocked };
}

/**
 * Check achievements on daily first open (non-session checks like S10, S6)
 */
export function detectOnDailyOpen(data: AchievementData, records: PomodoroRecord[], totalProjects: number): {
  updatedData: AchievementData;
  newlyUnlocked: string[];
} {
  return detectAchievements({
    data,
    records,
    sessionMinutes: 0,
    sessionCompleted: false,
    now: new Date(),
    totalProjects,
  });
}

/** Normal stages (excluding legendary) for H2 check */
const NORMAL_STAGES = ['seed', 'sprout', 'bloom', 'green', 'ripe'] as const;

interface WarehouseDetectionContext {
  data: AchievementData;
  warehouse: Warehouse;
  /** Which event triggered this check */
  trigger: 'addItem' | 'synthesize' | 'slice' | 'collectTool' | 'init';
  /** The stage just added (for addItem trigger) */
  addedStage?: string;
  /** Number of synthesis operations just performed */
  synthesisCount?: number;
}

/**
 * Detect warehouse (house series) achievements.
 * Call after addItem, synthesize, slice, or tool collection.
 * Updates progress fields and checks H1-H10.
 */
export function detectWarehouseAchievements(ctx: WarehouseDetectionContext): {
  updatedData: AchievementData;
  newlyUnlocked: string[];
} {
  const { warehouse, trigger, addedStage, synthesisCount } = ctx;
  const data: AchievementData = JSON.parse(JSON.stringify(ctx.data));
  const progress = data.progress;
  const now = new Date();
  const newlyUnlocked: string[] = [];

  const isUnlocked = (id: string) => id in data.unlocked;
  const unlock = (id: string) => {
    if (!isUnlocked(id)) {
      data.unlocked[id] = now.toISOString();
      newlyUnlocked.push(id);
    }
  };

  // ── Update progress based on trigger ──
  if (trigger === 'addItem' && addedStage) {
    // Track collected stages (for H2)
    if (!progress.collectedStages.includes(addedStage)) {
      progress.collectedStages = [...progress.collectedStages, addedStage];
    }
    // Track golden melons (for H3/H4)
    if (addedStage === 'legendary') {
      progress.goldenMelons++;
    }
  }

  if (trigger === 'synthesize' && synthesisCount) {
    progress.totalSynthesis += synthesisCount;
  }

  // Sync display fields from warehouse
  progress.totalCollected = warehouse.totalCollected;
  progress.collectedStagesCount = progress.collectedStages.filter(
    s => NORMAL_STAGES.includes(s as typeof NORMAL_STAGES[number]),
  ).length;

  // ── Check House Series ──
  // H1: first harvest (totalCollected >= 1)
  if (!isUnlocked('H1') && warehouse.totalCollected >= 1) unlock('H1');

  // H2: collected all 5 normal stages
  if (!isUnlocked('H2')) {
    const hasAll = NORMAL_STAGES.every(s => progress.collectedStages.includes(s));
    if (hasAll) unlock('H2');
  }

  // H3: first golden melon
  if (!isUnlocked('H3') && progress.goldenMelons >= 1) unlock('H3');

  // H4: 5 golden melons
  if (!isUnlocked('H4') && progress.goldenMelons >= 5) unlock('H4');

  // H5: total collected >= 100
  if (!isUnlocked('H5') && warehouse.totalCollected >= 100) unlock('H5');

  // H6: first synthesis
  if (!isUnlocked('H6') && progress.totalSynthesis >= 1) unlock('H6');

  // H7: 50 syntheses
  if (!isUnlocked('H7') && progress.totalSynthesis >= 50) unlock('H7');

  // H8: first slice
  if (!isUnlocked('H8') && progress.totalSlices >= 1) unlock('H8');

  // H9: 100 slices
  if (!isUnlocked('H9') && progress.totalSlices >= 100) unlock('H9');

  // H10: all tool types collected (placeholder — no tool system yet)
  // Will auto-trigger when collectedTools contains all types
  // if (!isUnlocked('H10') && progress.collectedTools.length >= ALL_TOOL_TYPES.length) unlock('H10');

  return { updatedData: data, newlyUnlocked };
}

/**
 * Detect farm series achievements (G1-G8).
 * Call after farm operations (plant, harvest, alien visit, thief defense, daily check).
 * Farm feature is not yet implemented — this is pre-wired for future integration.
 */
export function detectFarmAchievements(data: AchievementData): {
  updatedData: AchievementData;
  newlyUnlocked: string[];
} {
  const result: AchievementData = JSON.parse(JSON.stringify(data));
  const progress = result.progress;
  const now = new Date();
  const newlyUnlocked: string[] = [];

  const isUnlocked = (id: string) => id in result.unlocked;
  const unlock = (id: string) => {
    if (!isUnlocked(id)) {
      result.unlocked[id] = now.toISOString();
      newlyUnlocked.push(id);
    }
  };

  // G1: First Planting — totalPlants >= 1
  if (!isUnlocked('G1') && progress.totalPlants >= 1) unlock('G1');

  // G2: First Farm Harvest — totalFarmHarvests >= 1
  if (!isUnlocked('G2') && progress.totalFarmHarvests >= 1) unlock('G2');

  // G3: Hundred Plants — totalPlants >= 100
  if (!isUnlocked('G3') && progress.totalPlants >= 100) unlock('G3');

  // G4: Galaxy Conqueror — completedGalaxies >= 1
  if (!isUnlocked('G4') && progress.completedGalaxies >= 1) unlock('G4');

  // G5: Codex Master — totalVarieties >= 28
  if (!isUnlocked('G5') && progress.totalVarieties >= 28) unlock('G5');

  // G6: Alien Friend — alienVisits >= 10
  if (!isUnlocked('G6') && progress.alienVisits >= 10) unlock('G6');

  // G7: Thief Buster — thiefDefenses >= 5
  if (!isUnlocked('G7') && progress.thiefDefenses >= 5) unlock('G7');

  // G8: Evergreen Farm — farmActiveStreak >= 30
  if (!isUnlocked('G8') && progress.farmActiveStreak >= 30) unlock('G8');

  return { updatedData: result, newlyUnlocked };
}
