import { test, expect, type Page } from '@playwright/test';
import type {
  AlienVisit,
  Creature,
  CreatureType,
  Plot,
  Weather,
  WeatherState,
} from '../src/types/farm';

interface DebugState {
  settings: Record<string, unknown>;
  farm: Record<string, unknown>;
  shed: Record<string, unknown>;
  gene: Record<string, unknown>;
  weatherState?: WeatherState;
  creatures?: Creature[];
  alienVisit?: AlienVisit;
}

const WEATHER_TYPES: Weather[] = ['sunny', 'cloudy', 'rainy', 'night', 'rainbow'];
const CREATURE_TYPES: CreatureType[] = ['bee', 'butterfly', 'ladybug', 'bird'];

function getTodayKey(now: number = Date.now()): string {
  const date = new Date(now);
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
}

function createEmptyPlot(id: number): Plot {
  return {
    id,
    state: 'empty',
    progress: 0,
    mutationStatus: 'none',
    mutationChance: 0.02,
    isMutant: false,
    accumulatedMinutes: 0,
    lastActivityTimestamp: 0,
    hasTracker: false,
  };
}

function createCreature(
  id: string,
  type: CreatureType,
  expiresAt: number,
): Creature {
  return {
    id,
    type,
    xPercent: 50,
    yPercent: 42,
    expiresAt,
  };
}

function createSeedPayload(options?: {
  plots?: Plot[];
  farmOverrides?: Record<string, unknown>;
  shedOverrides?: Record<string, unknown>;
  weatherState?: WeatherState;
  creatures?: Creature[];
  alienVisit?: AlienVisit;
}): DebugState {
  const now = Date.now();
  const todayKey = getTodayKey(now);

  return {
    settings: {
      workMinutes: 25,
      shortBreakMinutes: 5,
      theme: 'dark',
      language: 'zh',
    },
    farm: {
      plots: options?.plots ?? [0, 1, 2, 3].map((id) => createEmptyPlot(id)),
      collection: [],
      lastActiveDate: todayKey,
      consecutiveInactiveDays: 0,
      lastActivityTimestamp: now,
      guardianBarrierDate: '',
      stolenRecords: [],
      ...options?.farmOverrides,
    },
    shed: {
      seeds: { normal: 0, epic: 0, legendary: 0 },
      items: {},
      totalSliced: 0,
      pity: { epicPity: 0, legendaryPity: 0 },
      injectedSeeds: [],
      hybridSeeds: [],
      prismaticSeeds: [],
      darkMatterSeeds: [],
      ...options?.shedOverrides,
    },
    gene: {
      fragments: [],
    },
    weatherState: options?.weatherState,
    creatures: options?.creatures,
    alienVisit: options?.alienVisit,
  };
}

function seedInit(page: Page, payload: DebugState) {
  return page.addInitScript((state: DebugState) => {
    localStorage.clear();
    localStorage.setItem('pomodoro-guide-seen', '1');
    localStorage.setItem('pomodoro-settings', JSON.stringify(state.settings));
    localStorage.setItem('watermelon-farm', JSON.stringify(state.farm));
    localStorage.setItem('watermelon-shed', JSON.stringify(state.shed));
    localStorage.setItem('watermelon-genes', JSON.stringify(state.gene));

    if (state.weatherState !== undefined) {
      localStorage.setItem('weatherState', JSON.stringify(state.weatherState));
    } else {
      localStorage.removeItem('weatherState');
    }

    if (state.creatures !== undefined) {
      localStorage.setItem('creatures', JSON.stringify(state.creatures));
    } else {
      localStorage.removeItem('creatures');
    }

    if (state.alienVisit !== undefined) {
      localStorage.setItem('alienVisit', JSON.stringify(state.alienVisit));
    } else {
      localStorage.removeItem('alienVisit');
    }
  }, payload);
}

async function readStorage<T>(page: Page, key: string, fallback: T): Promise<T> {
  return page.evaluate(([storageKey, fallbackValue]: [string, T]) => {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return fallbackValue;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallbackValue;
    }
  }, [key, fallback]);
}

async function goToFarm(page: Page) {
  await page.goto('/');
  await page.locator('header button').filter({ hasText: '🌱' }).first().click();
  await expect(page.locator('.farm-grid-perspective')).toBeVisible();
}

test.describe('Phase 6 Step 3 - Weather & Life', () => {
  test('1. 天气系统初始化（验证 weatherState 存在和结构）', async ({ page }) => {
    await seedInit(page, createSeedPayload());
    await goToFarm(page);

    await page.waitForFunction(() => {
      const raw = localStorage.getItem('weatherState');
      if (!raw) return false;
      try {
        const data = JSON.parse(raw) as { current?: unknown; lastChangeAt?: unknown };
        return typeof data.current === 'string'
          && typeof data.lastChangeAt === 'number'
          && Number.isFinite(data.lastChangeAt);
      } catch {
        return false;
      }
    });

    const weatherState = await readStorage<WeatherState | null>(
      page,
      'weatherState',
      null,
    );

    expect(weatherState).not.toBeNull();
    if (!weatherState) return;

    expect(WEATHER_TYPES).toContain(weatherState.current);
    expect(weatherState.lastChangeAt).toBeGreaterThan(0);
  });

  test('2. 小动物数据结构（验证 creatures 数组格式）', async ({ page }) => {
    const now = Date.now();
    const seededCreature = createCreature('creature-structure', 'bee', now + 10 * 60 * 1000);

    await seedInit(page, createSeedPayload({
      creatures: [seededCreature],
    }));
    await goToFarm(page);

    await page.waitForFunction(() => {
      const raw = localStorage.getItem('creatures');
      if (!raw) return false;
      try {
        const data = JSON.parse(raw) as unknown;
        return Array.isArray(data);
      } catch {
        return false;
      }
    });

    const creatures = await readStorage<Creature[]>(page, 'creatures', []);
    expect(Array.isArray(creatures)).toBeTruthy();
    expect(creatures.length).toBeGreaterThan(0);

    const creature = creatures[0];
    if (!creature) {
      throw new Error('creatures[0] should exist');
    }
    expect(typeof creature.id).toBe('string');
    expect(CREATURE_TYPES).toContain(creature.type);
    expect(Number.isFinite(creature.xPercent)).toBeTruthy();
    expect(Number.isFinite(creature.yPercent)).toBeTruthy();
    expect(creature.xPercent).toBeGreaterThanOrEqual(0);
    expect(creature.xPercent).toBeLessThanOrEqual(100);
    expect(creature.yPercent).toBeGreaterThanOrEqual(0);
    expect(creature.yPercent).toBeLessThanOrEqual(100);
    expect(Number.isFinite(creature.expiresAt)).toBeTruthy();
    expect(creature.expiresAt).toBeGreaterThan(Date.now());
  });

  test('3. 外星人数据结构（验证 alienVisit 对象格式）', async ({ page }) => {
    await seedInit(page, createSeedPayload({
      alienVisit: {
        lastMelonAlienCheckDate: '',
        current: null,
      },
    }));
    await goToFarm(page);

    await page.waitForFunction(() => {
      const raw = localStorage.getItem('alienVisit');
      if (!raw) return false;
      try {
        const data = JSON.parse(raw) as unknown;
        if (!data || typeof data !== 'object') return false;
        const parsed = data as { lastMelonAlienCheckDate?: unknown; current?: unknown };
        return typeof parsed.lastMelonAlienCheckDate === 'string'
          && Object.prototype.hasOwnProperty.call(parsed, 'current');
      } catch {
        return false;
      }
    });

    const alienVisit = await readStorage<AlienVisit | null>(page, 'alienVisit', null);
    expect(alienVisit).not.toBeNull();
    if (!alienVisit) return;

    expect(typeof alienVisit.lastMelonAlienCheckDate).toBe('string');
    if (alienVisit.current === null) return;

    expect(alienVisit.current.type === 'melon-alien' || alienVisit.current.type === 'mutation-doctor').toBeTruthy();
    expect(
      alienVisit.current.messageKey === 'alienMelonGreeting'
      || alienVisit.current.messageKey === 'alienMutationDoctor',
    ).toBeTruthy();
    expect(Number.isFinite(alienVisit.current.appearedAt)).toBeTruthy();
    expect(Number.isFinite(alienVisit.current.expiresAt)).toBeTruthy();
    expect(alienVisit.current.expiresAt).toBeGreaterThan(alienVisit.current.appearedAt);
  });
});
