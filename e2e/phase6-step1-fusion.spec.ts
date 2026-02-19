import { test, expect, type Page } from '@playwright/test';
import { FIVE_ELEMENT_GALAXIES, fiveElementFusionSuccessRate } from '../src/farm/gene';
import type { GeneFragment } from '../src/types/gene';
import {
  HYBRID_GALAXY_PAIRS,
  HYBRID_VARIETIES,
  PRISMATIC_VARIETIES,
  VARIETY_DEFS,
} from '../src/types/farm';
import type { CollectedVariety, FusionHistory, VarietyId } from '../src/types/farm';
import { zh } from '../src/i18n/locales/zh';

type FiveElementGalaxyId = typeof FIVE_ELEMENT_GALAXIES[number];

interface DebugState {
  settings: Record<string, unknown>;
  farm: Record<string, unknown>;
  shed: Record<string, unknown>;
  gene: Record<string, unknown>;
  fusionHistory: FusionHistory;
}

interface FarmSnapshot {
  plots: Array<{
    id: number;
    state: string;
    varietyId?: VarietyId;
    seedQuality?: string;
    progress: number;
    pausedAt?: number;
    pausedProgress?: number;
    accumulatedMinutes?: number;
  }>;
}

interface GeneSnapshot {
  fragments: GeneFragment[];
}

interface ShedSnapshot {
  prismaticSeeds: Array<{ id: string; varietyId: VarietyId }>;
}

const FUSION_HISTORY_KEY = 'watermelon-fusion-history';

function createEmptyPlot(id: number) {
  return {
    id,
    state: 'empty',
    progress: 0,
    accumulatedMinutes: 0,
    lastActivityTimestamp: 0,
    hasTracker: false,
  };
}

function createFragment(
  id: string,
  galaxyId: FiveElementGalaxyId,
  varietyId: VarietyId,
  rarity: GeneFragment['rarity'],
): GeneFragment {
  return {
    id,
    galaxyId,
    varietyId,
    rarity,
    obtainedAt: new Date().toISOString(),
  };
}

function createFiveElementFragments(): GeneFragment[] {
  return [
    createFragment('fe-earth', 'thick-earth', 'jade-stripe', 'common'),
    createFragment('fe-fire', 'fire', 'flame-pattern', 'rare'),
    createFragment('fe-water', 'water', 'diamond-melon', 'epic'),
    createFragment('fe-wood', 'wood', 'vine-melon', 'common'),
    createFragment('fe-metal', 'metal', 'eternal-melon', 'legendary'),
  ];
}

function createHybridCollection(count: number): CollectedVariety[] {
  const todayKey = new Date().toISOString().slice(0, 10);
  const hybridVarieties = HYBRID_GALAXY_PAIRS
    .flatMap((pair) => HYBRID_VARIETIES[pair])
    .slice(0, count);

  return hybridVarieties.map((varietyId) => ({
    varietyId,
    firstObtainedDate: todayKey,
    count: 1,
  }));
}

function createSeedPayload(options?: {
  fragments?: GeneFragment[];
  collection?: CollectedVariety[];
  farmOverrides?: Record<string, unknown>;
  shedOverrides?: Record<string, unknown>;
  fusionHistory?: FusionHistory;
}): DebugState {
  const now = Date.now();
  const todayKey = new Date(now).toISOString().slice(0, 10);

  return {
    settings: {
      workMinutes: 25,
      shortBreakMinutes: 5,
      theme: 'dark',
      language: 'zh',
    },
    farm: {
      plots: [0, 1, 2, 3].map((id) => createEmptyPlot(id)),
      collection: options?.collection ?? [],
      lastActiveDate: todayKey,
      consecutiveInactiveDays: 0,
      lastActivityTimestamp: now,
      ...options?.farmOverrides,
    },
    shed: {
      seeds: { normal: 0, epic: 0, legendary: 0 },
      items: {},
      injectedSeeds: [],
      hybridSeeds: [],
      prismaticSeeds: [],
      ...options?.shedOverrides,
    },
    gene: {
      fragments: options?.fragments ?? [],
    },
    fusionHistory: options?.fusionHistory ?? {
      sameVarietyStreak: 0,
      obtainedPrismaticVarietyIds: [],
    },
  };
}

function seedInit(page: Page, payload: DebugState) {
  return page.addInitScript((state: DebugState) => {
    const win = window as unknown as { __fusionRandomQueue?: number[] };
    win.__fusionRandomQueue = [];

    const originalRandom = Math.random.bind(Math);
    Math.random = () => {
      if (Array.isArray(win.__fusionRandomQueue) && win.__fusionRandomQueue.length > 0) {
        const queued = win.__fusionRandomQueue.shift();
        if (typeof queued === 'number') return queued;
      }
      return originalRandom();
    };

    localStorage.clear();
    localStorage.setItem('pomodoro-guide-seen', '1');
    localStorage.setItem('pomodoro-settings', JSON.stringify(state.settings));
    localStorage.setItem('watermelon-farm', JSON.stringify(state.farm));
    localStorage.setItem('watermelon-shed', JSON.stringify(state.shed));
    localStorage.setItem('watermelon-genes', JSON.stringify(state.gene));
    localStorage.setItem('watermelon-fusion-history', JSON.stringify(state.fusionHistory));
  }, payload);
}

async function queueRandom(page: Page, ...values: number[]) {
  await page.evaluate((nextValues: number[]) => {
    const win = window as unknown as { __fusionRandomQueue?: number[] };
    if (!Array.isArray(win.__fusionRandomQueue)) {
      throw new Error('fusion random queue is not initialized');
    }
    win.__fusionRandomQueue.push(...nextValues);
  }, values);
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

async function goToGeneLab(page: Page) {
  await goToFarm(page);
  await page.locator('button').filter({ hasText: zh.geneLabTab }).click();
  await expect(page.getByText(zh.geneFusionTitle)).toBeVisible();
}

function getFiveElementSection(page: Page) {
  return page.locator('section').filter({ hasText: zh.geneFiveElementTitle }).first();
}

function getPlotById(farm: FarmSnapshot, plotId: number) {
  return farm.plots.find((plot) => plot.id === plotId) ?? farm.plots[plotId];
}

test.describe('Phase 6 Step 1 - Five Element Fusion', () => {
  test('1. 五行融合按钮在条件未达成时锁定', async ({ page }) => {
    const fragments = createFiveElementFragments();
    await seedInit(page, createSeedPayload({
      fragments,
      collection: createHybridCollection(2),
    }));
    await goToGeneLab(page);

    const fiveElementSection = getFiveElementSection(page);
    const button = fiveElementSection.getByRole('button', { name: zh.geneFiveElementButton });

    await expect(fiveElementSection.getByText(zh.geneFiveElementHybridRequirement(2))).toBeVisible();
    await expect(fiveElementSection.getByText(zh.geneFiveElementResonanceLocked)).toBeVisible();
    await expect(fiveElementSection.getByText(zh.geneFiveElementRate(fiveElementFusionSuccessRate(fragments)))).toBeVisible();
    await expect(button).toBeDisabled();
  });

  test('2. 条件达成后按钮解锁且显示成功率', async ({ page }) => {
    const fragments = createFiveElementFragments();
    await seedInit(page, createSeedPayload({
      fragments,
      collection: createHybridCollection(3),
    }));
    await goToGeneLab(page);

    const fiveElementSection = getFiveElementSection(page);
    const expectedRateText = zh.geneFiveElementRate(fiveElementFusionSuccessRate(fragments));
    const button = fiveElementSection.getByRole('button', { name: zh.geneFiveElementButton });

    await expect(fiveElementSection.getByText(zh.geneFiveElementHybridRequirement(3))).toBeVisible();
    await expect(fiveElementSection.getByText(zh.geneFiveElementResonanceReady)).toBeVisible();
    await expect(fiveElementSection.getByText(expectedRateText)).toBeVisible();
    await expect(button).toBeEnabled();
  });

  test('3. 融合成功获得幻彩种子', async ({ page }) => {
    await seedInit(page, createSeedPayload({
      fragments: createFiveElementFragments(),
      collection: createHybridCollection(3),
    }));
    await goToGeneLab(page);

    const fiveElementSection = getFiveElementSection(page);
    await queueRandom(page, 0.01, 0.1);
    await fiveElementSection.getByRole('button', { name: zh.geneFiveElementButton }).click();

    await expect(page.getByText(/^融合成功！获得.+幻彩种子$/)).toBeVisible();
    await expect(fiveElementSection.getByText(zh.prismaticSeedCountLabel(1))).toBeVisible();

    const genes = await readStorage<GeneSnapshot>(page, 'watermelon-genes', { fragments: [] });
    const shed = await readStorage<ShedSnapshot>(page, 'watermelon-shed', { prismaticSeeds: [] });

    expect(genes.fragments).toHaveLength(0);
    expect(shed.prismaticSeeds).toHaveLength(1);
    expect(PRISMATIC_VARIETIES).toContain(shed.prismaticSeeds[0].varietyId);
  });

  test('4. 融合失败返还随机基因', async ({ page }) => {
    const fragments = createFiveElementFragments();
    await seedInit(page, createSeedPayload({
      fragments,
      collection: createHybridCollection(3),
    }));
    await goToGeneLab(page);

    const fiveElementSection = getFiveElementSection(page);
    await queueRandom(page, 0.99, 0.4);
    await fiveElementSection.getByRole('button', { name: zh.geneFiveElementButton }).click();

    await expect(page.getByText(/^融合失败，返还基因：.+$/)).toBeVisible();

    const genes = await readStorage<GeneSnapshot>(page, 'watermelon-genes', { fragments: [] });
    const shed = await readStorage<ShedSnapshot>(page, 'watermelon-shed', { prismaticSeeds: [] });
    const sourceVarietySet = new Set(fragments.map((fragment) => fragment.varietyId));

    expect(genes.fragments).toHaveLength(1);
    expect(shed.prismaticSeeds).toHaveLength(0);
    expect(sourceVarietySet.has(genes.fragments[0].varietyId)).toBe(true);
    expect(FIVE_ELEMENT_GALAXIES.includes(genes.fragments[0].galaxyId as FiveElementGalaxyId)).toBe(true);
  });

  test('5. 保底机制：连续3次同品种后必出新品种', async ({ page }) => {
    const previousObtained: VarietyId[] = ['prism-melon', 'bubble-melon'];
    await seedInit(page, createSeedPayload({
      fragments: createFiveElementFragments(),
      collection: createHybridCollection(3),
      fusionHistory: {
        lastVarietyId: 'prism-melon',
        sameVarietyStreak: 3,
        obtainedPrismaticVarietyIds: previousObtained,
      },
    }));
    await goToGeneLab(page);

    const fiveElementSection = getFiveElementSection(page);
    await expect(fiveElementSection.getByText(zh.geneFiveElementPityReady)).toBeVisible();

    await queueRandom(page, 0.01, 0.8);
    await fiveElementSection.getByRole('button', { name: zh.geneFiveElementButton }).click();

    const shed = await readStorage<ShedSnapshot>(page, 'watermelon-shed', { prismaticSeeds: [] });
    const fusionHistory = await readStorage<FusionHistory>(page, FUSION_HISTORY_KEY, {
      sameVarietyStreak: 0,
      obtainedPrismaticVarietyIds: [],
    });

    expect(shed.prismaticSeeds).toHaveLength(1);
    const rolledVarietyId = shed.prismaticSeeds[0].varietyId;
    expect(previousObtained).not.toContain(rolledVarietyId);
    expect(PRISMATIC_VARIETIES).toContain(rolledVarietyId);
    expect(fusionHistory.lastVarietyId).toBe(rolledVarietyId);
    expect(fusionHistory.sameVarietyStreak).toBe(1);
    expect(fusionHistory.obtainedPrismaticVarietyIds).toContain(rolledVarietyId);
  });

  test('6. 幻彩种子可种植', async ({ page }) => {
    await seedInit(page, createSeedPayload({
      fragments: createFiveElementFragments(),
      collection: createHybridCollection(3),
    }));
    await goToGeneLab(page);

    const fiveElementSection = getFiveElementSection(page);
    await queueRandom(page, 0.01, 0.0);
    await fiveElementSection.getByRole('button', { name: zh.geneFiveElementButton }).click();

    const shedAfterFusion = await readStorage<ShedSnapshot>(page, 'watermelon-shed', { prismaticSeeds: [] });
    expect(shedAfterFusion.prismaticSeeds).toHaveLength(1);

    const fusedSeed = shedAfterFusion.prismaticSeeds[0];

    await page.locator('button').filter({ hasText: zh.farmPlotsTab }).first().click();
    const plantButton = page.locator('.farm-grid-perspective button').filter({ hasText: zh.farmPlant }).first();
    await plantButton.click();

    const prismaticSeedLabel = zh.prismaticSeedLabel(zh.varietyName(fusedSeed.varietyId));
    await page.locator('button').filter({ hasText: prismaticSeedLabel }).first().click();

    await page.waitForTimeout(120);

    const farm = await readStorage<FarmSnapshot>(page, 'watermelon-farm', { plots: [] });
    const shedAfterPlant = await readStorage<ShedSnapshot>(page, 'watermelon-shed', { prismaticSeeds: [] });
    const plot0 = getPlotById(farm, 0);

    expect(plot0).toBeTruthy();
    if (!plot0) return;

    expect(plot0.state).toBe('growing');
    expect(plot0.varietyId).toBe(fusedSeed.varietyId);
    expect(plot0.seedQuality).toBe('legendary');
    expect(plot0.progress).toBe(0);
    expect(shedAfterPlant.prismaticSeeds).toHaveLength(0);
  });

  test('7. 幻彩暂停逻辑（离线>72h进度倒退）', async ({ page }) => {
    const initialProgress = 0.8;
    const inactiveMs = (120 * 60 * 60 * 1000) + (5 * 60 * 1000);
    const inactiveTimestamp = Date.now() - inactiveMs;
    const inactiveDateKey = new Date(inactiveTimestamp).toISOString().slice(0, 10);

    const payload = createSeedPayload({
      farmOverrides: {
        plots: [
          {
            id: 0,
            state: 'growing',
            seedQuality: 'legendary',
            varietyId: 'dream-melon',
            progress: initialProgress,
            mutationStatus: 'none',
            mutationChance: 0.02,
            isMutant: false,
            accumulatedMinutes: Math.floor(VARIETY_DEFS['dream-melon'].matureMinutes * initialProgress),
            plantedDate: inactiveDateKey,
            lastUpdateDate: inactiveDateKey,
            lastActivityTimestamp: inactiveTimestamp,
            hasTracker: false,
          },
          createEmptyPlot(1),
          createEmptyPlot(2),
          createEmptyPlot(3),
        ],
        lastActiveDate: inactiveDateKey,
        consecutiveInactiveDays: 5,
        lastActivityTimestamp: inactiveTimestamp,
      },
    });

    await seedInit(page, payload);
    await goToFarm(page);

    await page.waitForFunction(() => {
      const raw = localStorage.getItem('watermelon-farm');
      if (!raw) return false;

      const farm = JSON.parse(raw) as {
        plots?: Array<{ id?: number; pausedProgress?: number; progress?: number; state?: string }>;
      };
      if (!Array.isArray(farm.plots)) return false;
      const plot = farm.plots.find((item) => item.id === 0) ?? farm.plots[0];
      return Boolean(plot && typeof plot.pausedProgress === 'number' && typeof plot.progress === 'number' && plot.state === 'growing');
    }, { timeout: 8_000 });

    const farm = await readStorage<FarmSnapshot>(page, 'watermelon-farm', { plots: [] });
    const plot0 = getPlotById(farm, 0);
    const expectedProgress = initialProgress * 0.9;
    const expectedAccumulated = Math.floor(VARIETY_DEFS['dream-melon'].matureMinutes * expectedProgress);

    expect(plot0).toBeTruthy();
    if (!plot0) return;

    expect(plot0.state).toBe('growing');
    expect(plot0.progress).toBeLessThan(initialProgress);
    expect(plot0.progress).toBeCloseTo(expectedProgress, 2);
    expect(plot0.pausedProgress).toBeCloseTo(initialProgress, 5);
    expect((plot0.pausedAt ?? 0)).toBeGreaterThan(0);
    expect(plot0.accumulatedMinutes).toBe(expectedAccumulated);
  });
});
