import type { Creature, CreatureType } from '../types/farm';

export const CREATURE_SPAWN_CHANCE = 0.10;
export const CREATURE_MIN_STAY_MS = 5_000;
export const CREATURE_MAX_STAY_MS = 15_000;

const CREATURE_TYPES: CreatureType[] = ['bee', 'butterfly', 'ladybug', 'bird'];

function isCreatureType(value: unknown): value is CreatureType {
  return typeof value === 'string' && (
    value === 'bee'
    || value === 'butterfly'
    || value === 'ladybug'
    || value === 'bird'
  );
}

function randomInRange(min: number, max: number, randomFn: () => number = Math.random): number {
  return min + (max - min) * randomFn();
}

function createCreatureId(now: number): string {
  return `${now}-${Math.random().toString(36).slice(2, 9)}`;
}

export function shouldSpawnCreature(randomFn: () => number = Math.random): boolean {
  return randomFn() < CREATURE_SPAWN_CHANCE;
}

export function createRandomCreature(
  now: number = Date.now(),
  randomFn: () => number = Math.random,
): Creature {
  const type = CREATURE_TYPES[Math.floor(randomFn() * CREATURE_TYPES.length)] ?? 'bee';
  const stayMs = Math.round(randomInRange(CREATURE_MIN_STAY_MS, CREATURE_MAX_STAY_MS, randomFn));

  return {
    id: createCreatureId(now),
    type,
    xPercent: Number(randomInRange(8, 88, randomFn).toFixed(2)),
    yPercent: Number(randomInRange(10, 66, randomFn).toFixed(2)),
    expiresAt: now + stayMs,
  };
}

export function pruneExpiredCreatures(creatures: Creature[], now: number = Date.now()): Creature[] {
  return creatures.filter((creature) => (
    Number.isFinite(creature.expiresAt)
    && creature.expiresAt > now
  ));
}

export function migrateCreatures(raw: unknown): Creature[] {
  const now = Date.now();
  if (!Array.isArray(raw)) return [];

  const migrated: Creature[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const candidate = item as Record<string, unknown>;
    if (typeof candidate.id !== 'string' || candidate.id.length === 0) continue;
    if (!isCreatureType(candidate.type)) continue;

    const xPercent = typeof candidate.xPercent === 'number' && Number.isFinite(candidate.xPercent)
      ? candidate.xPercent
      : 50;
    const yPercent = typeof candidate.yPercent === 'number' && Number.isFinite(candidate.yPercent)
      ? candidate.yPercent
      : 45;
    const expiresAt = typeof candidate.expiresAt === 'number' && Number.isFinite(candidate.expiresAt)
      ? candidate.expiresAt
      : now;

    if (expiresAt <= now) continue;

    migrated.push({
      id: candidate.id,
      type: candidate.type,
      xPercent: Math.max(0, Math.min(100, xPercent)),
      yPercent: Math.max(0, Math.min(100, yPercent)),
      expiresAt,
    });
  }

  return migrated;
}
