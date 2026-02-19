import { test, expect, type Page } from '@playwright/test';
import { zh } from '../src/i18n/locales/zh';
import { VARIETY_DEFS, type Plot, type VarietyId } from '../src/types/farm';

interface SeedState {
  settings: {
    workMinutes: number;
    shortBreakMinutes: number;
    theme: 'dark';
    language: 'zh';
  };
  farm: {
    plots: Plot[];
    collection: Array<Record<string, unknown>>;
    lastActiveDate: string;
    consecutiveInactiveDays: number;
    lastActivityTimestamp: number;
    guardianBarrierDate: string;
    stolenRecords: Array<Record<string, unknown>>;
  };
  shed: {
    seeds: { normal: number; epic: number; legendary: number };
    items: Record<string, number>;
    totalSliced: number;
    pity: { epicPity: number; legendaryPity: number };
    injectedSeeds: Array<Record<string, unknown>>;
    hybridSeeds: Array<Record<string, unknown>>;
  };
  genes: {
    fragments: Array<Record<string, unknown>>;
  };
  coins: {
    balance: number;
  };
}

interface FarmSnapshot {
  plots: Plot[];
  guardianBarrierDate: string;
}

const ONE_HOUR_MS = 60 * 60 * 1000;
const APP_URL = process.env.E2E_APP_URL ?? '/';

function getDateKey(offsetDays: number = 0): string {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().slice(0, 10);
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

function createGrowingPlot(id: number, overrides: Partial<Plot> = {}): Plot {
  return {
    id,
    state: 'growing',
    seedQuality: 'normal',
    varietyId: 'jade-stripe',
    progress: 0.85,
    mutationStatus: 'none',
    mutationChance: 0,
    isMutant: false,
    accumulatedMinutes: 8500,
    plantedDate: getDateKey(-1),
    lastUpdateDate: getDateKey(-1),
    lastActivityTimestamp: Date.now() - ONE_HOUR_MS,
    hasTracker: false,
    ...overrides,
  };
}

function createMaturePlot(id: number, overrides: Partial<Plot> = {}): Plot {
  return {
    id,
    state: 'mature',
    seedQuality: 'normal',
    varietyId: 'jade-stripe',
    progress: 1,
    mutationStatus: 'none',
    mutationChance: 0,
    isMutant: false,
    accumulatedMinutes: VARIETY_DEFS['jade-stripe'].matureMinutes,
    plantedDate: getDateKey(-1),
    lastUpdateDate: getDateKey(-1),
    lastActivityTimestamp: Date.now() - ONE_HOUR_MS,
    hasTracker: false,
    ...overrides,
  };
}

function createSeedState(overrides: Partial<SeedState> = {}): SeedState {
  const now = Date.now();
  const todayKey = getDateKey();

  return {
    settings: {
      workMinutes: 25,
      shortBreakMinutes: 5,
      theme: 'dark',
      language: 'zh',
    },
    farm: {
      plots: [createEmptyPlot(0), createEmptyPlot(1), createEmptyPlot(2), createEmptyPlot(3)],
      collection: [],
      lastActiveDate: todayKey,
      consecutiveInactiveDays: 0,
      lastActivityTimestamp: now,
      guardianBarrierDate: '',
      stolenRecords: [],
    },
    shed: {
      seeds: { normal: 0, epic: 0, legendary: 0 },
      items: {},
      totalSliced: 0,
      pity: { epicPity: 0, legendaryPity: 0 },
      injectedSeeds: [],
      hybridSeeds: [],
    },
    genes: {
      fragments: [],
    },
    coins: {
      balance: 0,
    },
    ...overrides,
  };
}

async function bootWithSeed(page: Page, seed: SeedState, options?: { forceRandomZero?: boolean }) {
  if (options?.forceRandomZero) {
    await page.addInitScript(() => {
      Math.random = () => 0;
    });
  }

  await page.addInitScript((state: SeedState) => {
    localStorage.clear();
    localStorage.setItem('pomodoro-guide-seen', '1');
    localStorage.setItem('watermelon-debug', 'true');
    localStorage.setItem('pomodoro-settings', JSON.stringify(state.settings));
    localStorage.setItem('watermelon-farm', JSON.stringify(state.farm));
    localStorage.setItem('watermelon-shed', JSON.stringify(state.shed));
    localStorage.setItem('watermelon-genes', JSON.stringify(state.genes));
    localStorage.setItem('watermelon-coins', JSON.stringify(state.coins));
    localStorage.setItem('pomodoro-records', JSON.stringify([]));
  }, seed);

  await page.goto(APP_URL);
}

async function goToFarm(page: Page) {
  await page.locator('header button').filter({ hasText: '🌱' }).first().click();
  await expect(page.locator('.farm-grid-perspective')).toBeVisible();
}

async function openDebugToolbar(page: Page) {
  const debugTitle = page.getByText('🧪 Debug Toolbar');
  const resetAll = page.getByRole('button', { name: '🔄 重置所有数据' });

  if (!(await resetAll.isVisible().catch(() => false))) {
    await debugTitle.click();
  }

  await expect(resetAll).toBeVisible();
}

async function setDebugMultiplier10000x(page: Page) {
  await openDebugToolbar(page);
  const section = page.locator('section').filter({ hasText: '时间倍率' });
  await expect(section.getByRole('button', { name: '10000x' })).toBeVisible();
  await section.getByRole('button', { name: '10000x' }).click();
}

async function readFarm(page: Page): Promise<FarmSnapshot> {
  return page.evaluate(() => {
    const raw = localStorage.getItem('watermelon-farm');
    if (!raw) {
      return {
        plots: [],
        guardianBarrierDate: '',
      };
    }
    const parsed = JSON.parse(raw) as FarmSnapshot;
    return {
      plots: Array.isArray(parsed.plots) ? parsed.plots : [],
      guardianBarrierDate: typeof parsed.guardianBarrierDate === 'string' ? parsed.guardianBarrierDate : '',
    };
  });
}

async function readShedItemCount(page: Page, itemId: string): Promise<number> {
  return page.evaluate((targetItemId: string) => {
    const raw = localStorage.getItem('watermelon-shed');
    if (!raw) return 0;
    const parsed = JSON.parse(raw) as { items?: Record<string, unknown> };
    const value = parsed.items?.[targetItemId];
    return typeof value === 'number' ? value : 0;
  }, itemId);
}

async function readCoinBalance(page: Page): Promise<number> {
  return page.evaluate(() => {
    const raw = localStorage.getItem('watermelon-coins');
    if (!raw) return 0;
    const parsed = JSON.parse(raw) as { balance?: unknown };
    return typeof parsed.balance === 'number' ? parsed.balance : 0;
  });
}

test.describe('Thief & Items', () => {
  test('AC1: 星际大盗出现判定（成熟/成长中地块）', async ({ page }) => {
    const oneHourAgo = Date.now() - ONE_HOUR_MS;
    const seed = createSeedState({
      farm: {
        plots: [
          createGrowingPlot(0, {
            progress: 0.86,
            accumulatedMinutes: 8600,
            lastActivityTimestamp: oneHourAgo,
            lastUpdateDate: getDateKey(-1),
          }),
          createEmptyPlot(1),
          createEmptyPlot(2),
          createEmptyPlot(3),
        ],
        collection: [],
        lastActiveDate: getDateKey(-1),
        consecutiveInactiveDays: 1,
        lastActivityTimestamp: oneHourAgo,
        guardianBarrierDate: '',
        stolenRecords: [],
      },
    });

    await bootWithSeed(page, seed, { forceRandomZero: true });
    await goToFarm(page);

    await expect(page.getByText(zh.thiefAppeared)).toBeVisible();
    await expect(page.locator('.farm-plot-thief-status').first()).toContainText('⚠️');

    await page.waitForFunction(() => {
      const raw = localStorage.getItem('watermelon-farm');
      if (!raw) return false;
      const farm = JSON.parse(raw) as { plots?: Array<{ id?: number; thief?: { appearedAt?: number; stealsAt?: number } }> };
      if (!Array.isArray(farm.plots)) return false;
      const plot0 = farm.plots.find((plot) => plot.id === 0) ?? farm.plots[0];
      if (!plot0?.thief) return false;
      return typeof plot0.thief.appearedAt === 'number'
        && typeof plot0.thief.stealsAt === 'number'
        && plot0.thief.stealsAt > plot0.thief.appearedAt;
    });
  });

  test('AC3: 使用捕网抓住大盗并获得 100 瓜币', async ({ page }) => {
    const now = Date.now();
    const seed = createSeedState({
      farm: {
        plots: [
          createGrowingPlot(0, {
            thief: {
              appearedAt: now - 2 * 60 * 1000,
              stealsAt: now + 20 * 60 * 1000,
            },
          }),
          createEmptyPlot(1),
          createEmptyPlot(2),
          createEmptyPlot(3),
        ],
        collection: [],
        lastActiveDate: getDateKey(),
        consecutiveInactiveDays: 0,
        lastActivityTimestamp: now,
        guardianBarrierDate: '',
        stolenRecords: [],
      },
      shed: {
        seeds: { normal: 0, epic: 0, legendary: 0 },
        items: {
          'trap-net': 1,
        },
        totalSliced: 0,
        pity: { epicPity: 0, legendaryPity: 0 },
        injectedSeeds: [],
        hybridSeeds: [],
      },
      coins: {
        balance: 200,
      },
    });

    await bootWithSeed(page, seed);
    await goToFarm(page);

    await page.locator('.farm-grid-perspective > div').first().click();
    const trapButton = page.locator('button').filter({ hasText: `🪤 ${zh.itemName('trap-net')}` }).first();
    await expect(trapButton).toBeVisible();
    await trapButton.click();

    await expect(page.getByText(zh.thiefCaught)).toBeVisible();

    await expect.poll(async () => {
      const farm = await readFarm(page);
      const plot0 = farm.plots.find((plot) => plot.id === 0) ?? farm.plots[0];
      return Boolean(plot0?.thief);
    }).toBe(false);

    await expect.poll(async () => readCoinBalance(page)).toBe(300);
    await expect.poll(async () => readShedItemCount(page, 'trap-net')).toBe(0);
  });

  test('AC4: 激活结界后免疫大盗出现', async ({ page }) => {
    const now = Date.now();
    const todayKey = getDateKey();
    const seed = createSeedState({
      farm: {
        plots: [
          createMaturePlot(0, {
            lastActivityTimestamp: now,
            lastUpdateDate: todayKey,
          }),
          createEmptyPlot(1),
          createEmptyPlot(2),
          createEmptyPlot(3),
        ],
        collection: [],
        lastActiveDate: todayKey,
        consecutiveInactiveDays: 0,
        lastActivityTimestamp: now,
        guardianBarrierDate: '',
        stolenRecords: [],
      },
      shed: {
        seeds: { normal: 0, epic: 0, legendary: 0 },
        items: {
          'guardian-barrier': 1,
        },
        totalSliced: 0,
        pity: { epicPity: 0, legendaryPity: 0 },
        injectedSeeds: [],
        hybridSeeds: [],
      },
    });

    await bootWithSeed(page, seed, { forceRandomZero: true });
    await goToFarm(page);

    const barrierButton = page.locator('button').filter({ hasText: zh.itemName('guardian-barrier') }).first();
    await expect(barrierButton).toBeVisible();
    await barrierButton.click();

    await expect(page.getByText(zh.itemGuardianBarrierActive)).toBeVisible();

    await setDebugMultiplier10000x(page);
    await page.waitForTimeout(6000);

    const farm = await readFarm(page);
    const plot0 = farm.plots.find((plot) => plot.id === 0) ?? farm.plots[0];
    expect(plot0?.thief).toBeUndefined();
    expect(farm.guardianBarrierDate).toBe(todayKey);
  });

  test('AC6: 星际追踪器在被偷时自动追回并提示', async ({ page }) => {
    const now = Date.now();
    const seed = createSeedState({
      farm: {
        plots: [
          createGrowingPlot(0, {
            progress: 0.92,
            accumulatedMinutes: 9200,
            hasTracker: true,
            thief: {
              appearedAt: now - 1000,
              stealsAt: now + 1200,
            },
          }),
          createEmptyPlot(1),
          createEmptyPlot(2),
          createEmptyPlot(3),
        ],
        collection: [],
        lastActiveDate: getDateKey(),
        consecutiveInactiveDays: 0,
        lastActivityTimestamp: now,
        guardianBarrierDate: '',
        stolenRecords: [],
      },
    });

    await bootWithSeed(page, seed);
    await goToFarm(page);

    await page.locator('.farm-grid-perspective > div').first().click();
    await expect(page.getByText(zh.itemStarTrackerActive)).toBeVisible();

    await setDebugMultiplier10000x(page);
    await page.waitForTimeout(6000);

    await expect(page.getByText(zh.thiefRecoveryActive)).toBeVisible();

    const farm = await readFarm(page);
    const plot0 = farm.plots.find((plot) => plot.id === 0) ?? farm.plots[0];
    expect(plot0?.thief).toBeUndefined();
    expect(plot0?.state).not.toBe('stolen');
    expect(plot0?.hasTracker).toBe(false);
  });

  test('AC7: 琼浆玉露可复活枯萎西瓜', async ({ page }) => {
    const seed = createSeedState({
      farm: {
        plots: [
          {
            ...createGrowingPlot(0),
            state: 'withered',
            progress: 0,
            accumulatedMinutes: 0,
            mutationStatus: 'negative',
          },
          createEmptyPlot(1),
          createEmptyPlot(2),
          createEmptyPlot(3),
        ],
        collection: [],
        lastActiveDate: getDateKey(),
        consecutiveInactiveDays: 0,
        lastActivityTimestamp: Date.now(),
        guardianBarrierDate: '',
        stolenRecords: [],
      },
      shed: {
        seeds: { normal: 0, epic: 0, legendary: 0 },
        items: {
          nectar: 1,
        },
        totalSliced: 0,
        pity: { epicPity: 0, legendaryPity: 0 },
        injectedSeeds: [],
        hybridSeeds: [],
      },
    });

    await bootWithSeed(page, seed);
    await goToFarm(page);

    const nectarButton = page.locator('button').filter({ hasText: '💧 1' }).first();
    await expect(nectarButton).toBeVisible();
    await nectarButton.click();

    await expect(page.getByText(zh.itemNectarSuccess)).toBeVisible();

    await expect.poll(async () => {
      const farm = await readFarm(page);
      const plot0 = farm.plots.find((plot) => plot.id === 0) ?? farm.plots[0];
      return plot0?.state;
    }).toBe('growing');

    await expect.poll(async () => readShedItemCount(page, 'nectar')).toBe(0);
  });

  test('AC8: 月神甘露提升成熟西瓜稀有度', async ({ page }) => {
    const originalVariety: VarietyId = 'jade-stripe';
    const seed = createSeedState({
      farm: {
        plots: [
          createMaturePlot(0, {
            varietyId: originalVariety,
          }),
          createEmptyPlot(1),
          createEmptyPlot(2),
          createEmptyPlot(3),
        ],
        collection: [],
        lastActiveDate: getDateKey(),
        consecutiveInactiveDays: 0,
        lastActivityTimestamp: Date.now(),
        guardianBarrierDate: '',
        stolenRecords: [],
      },
      shed: {
        seeds: { normal: 0, epic: 0, legendary: 0 },
        items: {
          'moon-dew': 1,
        },
        totalSliced: 0,
        pity: { epicPity: 0, legendaryPity: 0 },
        injectedSeeds: [],
        hybridSeeds: [],
      },
    });

    await bootWithSeed(page, seed);
    await goToFarm(page);

    const moonDewButton = page.locator('button').filter({ hasText: '🌙 1' }).first();
    await expect(moonDewButton).toBeVisible();
    await moonDewButton.click();

    await expect(page.getByText(zh.itemMoonDewSuccess)).toBeVisible();

    await expect.poll(async () => {
      const farm = await readFarm(page);
      const plot0 = farm.plots.find((plot) => plot.id === 0) ?? farm.plots[0];
      return plot0?.varietyId;
    }).not.toBe(originalVariety);

    const farm = await readFarm(page);
    const plot0 = farm.plots.find((plot) => plot.id === 0) ?? farm.plots[0];
    const nextVarietyId = plot0?.varietyId;
    expect(nextVarietyId).toBeTruthy();
    if (nextVarietyId) {
      expect(VARIETY_DEFS[nextVarietyId].rarity).toBe('rare');
    }

    await expect.poll(async () => readShedItemCount(page, 'moon-dew')).toBe(0);
  });
});
