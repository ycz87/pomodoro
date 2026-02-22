import { test, expect, type Page } from '@playwright/test';
import type { Plot, Weather, WeatherState } from '../src/types/farm';
import type { SeedCounts } from '../src/types/slicing';

interface DebugState {
  settings: Record<string, unknown>;
  farm: Record<string, unknown>;
  shed: Record<string, unknown>;
  gene: Record<string, unknown>;
  weatherState: WeatherState;
}

function getTodayKey(now: number): string {
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

function createSeedPayload(options: {
  now: number;
  weather: Weather;
  seedCounts?: SeedCounts;
}): DebugState {
  const todayKey = getTodayKey(options.now);
  const seedCounts = options.seedCounts ?? { normal: 6, epic: 0, legendary: 0 };

  return {
    settings: {
      workMinutes: 25,
      shortBreakMinutes: 5,
      theme: 'dark',
      language: 'zh',
    },
    farm: {
      plots: [0, 1, 2, 3].map((id) => createEmptyPlot(id)),
      collection: [],
      lastActiveDate: todayKey,
      consecutiveInactiveDays: 0,
      lastActivityTimestamp: options.now,
      guardianBarrierDate: '',
      stolenRecords: [],
    },
    shed: {
      seeds: seedCounts,
      items: {},
      totalSliced: 0,
      pity: { epicPity: 0, legendaryPity: 0 },
      injectedSeeds: [],
      hybridSeeds: [],
      prismaticSeeds: [],
      darkMatterSeeds: [],
    },
    gene: {
      fragments: [],
    },
    weatherState: {
      current: options.weather,
      lastChangeAt: options.now,
    },
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
    localStorage.setItem('weatherState', JSON.stringify(state.weatherState));
    localStorage.removeItem('creatures');
    localStorage.removeItem('alienVisit');
  }, payload);
}

async function goToFarm(page: Page) {
  await page.goto('/');
  await page.locator('header button').filter({ hasText: '🌱' }).first().click();
  await expect(page.locator('.farm-grid-perspective')).toBeVisible();
}

async function setupFarm(page: Page, options: {
  hour: number;
  weather: Weather;
  seedCounts?: SeedCounts;
}) {
  const fixedTime = new Date(2026, 1, 22, options.hour, 0, 0, 0);
  await page.clock.setFixedTime(fixedTime);
  await seedInit(page, createSeedPayload({
    now: fixedTime.getTime(),
    weather: options.weather,
    seedCounts: options.seedCounts,
  }));
  await goToFarm(page);
}

test.describe('Farm sky layer & seed emoji', () => {
  test('天空层容器存在且不遮挡地块交互', async ({ page }) => {
    await setupFarm(page, {
      hour: 12,
      weather: 'sunny',
      seedCounts: { normal: 7, epic: 0, legendary: 0 },
    });

    const skyLayer = page.locator('[data-weather="sunny"]');
    await expect(skyLayer).toBeVisible();

    const parentPointerEvents = await skyLayer.evaluate((el) => {
      const parent = el.parentElement;
      return parent ? getComputedStyle(parent).pointerEvents : null;
    });
    expect(parentPointerEvents).toBe('none');

    const plantButton = page.locator('.farm-grid-perspective button').filter({ hasText: '+' }).first();
    await expect(plantButton).toBeVisible();
    await plantButton.click();

    await expect(page.locator('h3')).toBeVisible();
    await expect(
      page.locator('button').filter({ hasText: '🌱' }).filter({ hasText: '×7' }).first(),
    ).toBeVisible();
  });

  test('白天显示太阳，夜间显示月亮（mock Date）', async ({ page }) => {
    await setupFarm(page, { hour: 10, weather: 'sunny' });

    const daySkyLayer = page.locator('[data-weather="sunny"]');
    await expect(daySkyLayer.getByRole('img', { name: 'sun' })).toBeVisible();
    await expect(daySkyLayer.getByRole('img', { name: 'moon' })).toHaveCount(0);
  });

  test('夜间显示月亮，白天太阳不显示（mock Date）', async ({ page }) => {
    await setupFarm(page, { hour: 21, weather: 'sunny' });

    const nightSkyLayer = page.locator('[data-weather="sunny"]');
    await expect(nightSkyLayer.getByRole('img', { name: 'moon' })).toBeVisible();
    await expect(nightSkyLayer.getByRole('img', { name: 'sun' })).toHaveCount(0);
  });

  for (const weatherCase of [
    { weather: 'sunny' as const, expectedClouds: 1 },
    { weather: 'cloudy' as const, expectedClouds: 4 },
    { weather: 'rainy' as const, expectedClouds: 5 },
    { weather: 'stormy' as const, expectedClouds: 6 },
  ]) {
    test(`天气 ${weatherCase.weather} 显示 ${weatherCase.expectedClouds} 朵云`, async ({ page }) => {
      await setupFarm(page, { hour: 12, weather: weatherCase.weather });

      const skyLayer = page.locator(`[data-weather="${weatherCase.weather}"]`);
      await expect(skyLayer).toBeVisible();
      await expect(skyLayer.locator('> span[aria-hidden="true"]')).toHaveCount(weatherCase.expectedClouds);
    });
  }

  test('种子图标显示为 🌱（背包统计与种植按钮）', async ({ page }) => {
    await setupFarm(page, {
      hour: 12,
      weather: 'sunny',
      seedCounts: { normal: 9, epic: 0, legendary: 0 },
    });

    await expect(page.locator('span').filter({ hasText: /🌱\s*9\s*·\s*🧬/ }).first()).toBeVisible();

    const plantButton = page.locator('.farm-grid-perspective button').filter({ hasText: '+' }).first();
    await plantButton.click();
    await expect(
      page.locator('button').filter({ hasText: '🌱' }).filter({ hasText: '×9' }).first(),
    ).toBeVisible();
  });
});
