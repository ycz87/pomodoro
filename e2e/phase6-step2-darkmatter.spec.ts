import { test, expect, type Page } from '@playwright/test';
import { getBlackHoleMelonFusionFragments, getVoidMelonFusionFragments } from '../src/farm/gene';
import type { GeneFragment } from '../src/types/gene';
import {
  ALL_VARIETY_IDS,
  HYBRID_GALAXY_PAIRS,
  HYBRID_VARIETIES,
  PRISMATIC_VARIETIES,
  VARIETY_DEFS,
} from '../src/types/farm';
import type { CollectedVariety, VarietyId } from '../src/types/farm';
import { zh } from '../src/i18n/locales/zh';

interface DebugState {
  settings: Record<string, unknown>;
  farm: Record<string, unknown>;
  shed: Record<string, unknown>;
  gene: Record<string, unknown>;
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

interface FarmCollectionSnapshot {
  collection: Array<{
    varietyId: VarietyId;
    count: number;
    isMutant?: boolean;
  }>;
}

interface GeneSnapshot {
  fragments: GeneFragment[];
}

interface ShedSnapshot {
  darkMatterSeeds: Array<{ id: string; varietyId: VarietyId }>;
}

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
  varietyId: VarietyId,
  rarity: GeneFragment['rarity'],
): GeneFragment {
  const def = VARIETY_DEFS[varietyId];
  return {
    id,
    galaxyId: def.galaxy,
    varietyId,
    rarity,
    obtainedAt: new Date().toISOString(),
  };
}

function createPrismaticFragments(count: number): GeneFragment[] {
  return PRISMATIC_VARIETIES.slice(0, count).map((varietyId, index) => (
    createFragment(`prismatic-${index}`, varietyId, VARIETY_DEFS[varietyId].rarity)
  ));
}

function createHybridPairFragments(count: number): GeneFragment[] {
  return HYBRID_GALAXY_PAIRS.slice(0, count).map((pair, index) => {
    const pairVarieties = HYBRID_VARIETIES[pair];
    const varietyId = pairVarieties[0];
    return createFragment(`hybrid-${index}`, varietyId, VARIETY_DEFS[varietyId].rarity);
  });
}

function createFullCollectionWithoutCosmicHeart(): CollectedVariety[] {
  const todayKey = new Date().toISOString().slice(0, 10);
  return ALL_VARIETY_IDS
    .filter((varietyId) => varietyId !== 'cosmic-heart')
    .map((varietyId) => ({
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
      darkMatterSeeds: [],
      ...options?.shedOverrides,
    },
    gene: {
      fragments: options?.fragments ?? [],
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

async function goToGeneLab(page: Page) {
  await goToFarm(page);
  await page.locator('button').filter({ hasText: zh.geneLabTab }).click();
  await expect(page.getByText(zh.geneFusionTitle)).toBeVisible();
}

function getDarkMatterSection(page: Page) {
  return page.locator('section').filter({ hasText: zh.geneDarkMatterTitle }).first();
}

function getPlotById(farm: FarmSnapshot, plotId: number) {
  return farm.plots.find((plot) => plot.id === plotId) ?? farm.plots[plotId];
}

test.describe('Phase 6 Step 2 - Dark Matter Fusion', () => {
  test('1. 虚空瓜融合按钮在条件未达成时锁定', async ({ page }) => {
    const fragments = createPrismaticFragments(PRISMATIC_VARIETIES.length - 1);
    expect(getVoidMelonFusionFragments(fragments)).toBeNull();

    await seedInit(page, createSeedPayload({ fragments }));
    await goToGeneLab(page);

    const darkMatterSection = getDarkMatterSection(page);
    const button = darkMatterSection.getByRole('button', { name: zh.geneDarkMatterVoidButton });

    await expect(darkMatterSection.getByText(zh.geneDarkMatterVoidProgress(4, PRISMATIC_VARIETIES.length))).toBeVisible();
    await expect(button).toBeDisabled();
  });

  test('2. 条件达成后（5个不同幻彩基因）按钮解锁', async ({ page }) => {
    const fragments = createPrismaticFragments(PRISMATIC_VARIETIES.length);
    const selected = getVoidMelonFusionFragments(fragments);
    expect(selected).not.toBeNull();
    expect(selected).toHaveLength(PRISMATIC_VARIETIES.length);

    await seedInit(page, createSeedPayload({ fragments }));
    await goToGeneLab(page);

    const darkMatterSection = getDarkMatterSection(page);
    const button = darkMatterSection.getByRole('button', { name: zh.geneDarkMatterVoidButton });

    await expect(darkMatterSection.getByText(zh.geneDarkMatterVoidProgress(5, PRISMATIC_VARIETIES.length))).toBeVisible();
    await expect(button).toBeEnabled();
  });

  test('3. 虚空瓜融合成功获得暗物质种子', async ({ page }) => {
    const fragments = createPrismaticFragments(PRISMATIC_VARIETIES.length);
    await seedInit(page, createSeedPayload({ fragments }));
    await goToGeneLab(page);

    const darkMatterSection = getDarkMatterSection(page);
    await darkMatterSection.getByRole('button', { name: zh.geneDarkMatterVoidButton }).click();

    await expect(page.getByText(zh.geneDarkMatterSuccess(zh.varietyName('void-melon')))).toBeVisible();
    await expect(darkMatterSection.getByText(zh.darkMatterSeedCountLabel(1))).toBeVisible();

    const genes = await readStorage<GeneSnapshot>(page, 'watermelon-genes', { fragments: [] });
    const shed = await readStorage<ShedSnapshot>(page, 'watermelon-shed', { darkMatterSeeds: [] });

    expect(genes.fragments).toHaveLength(0);
    expect(shed.darkMatterSeeds).toHaveLength(1);
    expect(shed.darkMatterSeeds[0].varietyId).toBe('void-melon');
  });

  test('4. 黑洞瓜融合按钮在条件未达成时锁定', async ({ page }) => {
    const fragments = createHybridPairFragments(HYBRID_GALAXY_PAIRS.length - 1);
    expect(getBlackHoleMelonFusionFragments(fragments)).toBeNull();

    await seedInit(page, createSeedPayload({ fragments }));
    await goToGeneLab(page);

    const darkMatterSection = getDarkMatterSection(page);
    const button = darkMatterSection.getByRole('button', { name: zh.geneDarkMatterBlackHoleButton });

    await expect(darkMatterSection.getByText(zh.geneDarkMatterBlackHoleProgress(9, HYBRID_GALAXY_PAIRS.length))).toBeVisible();
    await expect(button).toBeDisabled();
  });

  test('5. 条件达成后（10种双元素基因）按钮解锁', async ({ page }) => {
    const fragments = createHybridPairFragments(HYBRID_GALAXY_PAIRS.length);
    const selected = getBlackHoleMelonFusionFragments(fragments);
    expect(selected).not.toBeNull();
    expect(selected).toHaveLength(HYBRID_GALAXY_PAIRS.length);

    await seedInit(page, createSeedPayload({ fragments }));
    await goToGeneLab(page);

    const darkMatterSection = getDarkMatterSection(page);
    const button = darkMatterSection.getByRole('button', { name: zh.geneDarkMatterBlackHoleButton });

    await expect(darkMatterSection.getByText(zh.geneDarkMatterBlackHoleProgress(10, HYBRID_GALAXY_PAIRS.length))).toBeVisible();
    await expect(button).toBeEnabled();
  });

  test('6. 黑洞瓜融合成功获得暗物质种子', async ({ page }) => {
    await seedInit(page, createSeedPayload({
      fragments: createHybridPairFragments(HYBRID_GALAXY_PAIRS.length),
    }));
    await goToGeneLab(page);

    const darkMatterSection = getDarkMatterSection(page);
    await darkMatterSection.getByRole('button', { name: zh.geneDarkMatterBlackHoleButton }).click();

    await expect(page.getByText(zh.geneDarkMatterSuccess(zh.varietyName('blackhole-melon')))).toBeVisible();
    await expect(darkMatterSection.getByText(zh.darkMatterSeedCountLabel(1))).toBeVisible();

    const genes = await readStorage<GeneSnapshot>(page, 'watermelon-genes', { fragments: [] });
    const shed = await readStorage<ShedSnapshot>(page, 'watermelon-shed', { darkMatterSeeds: [] });

    expect(genes.fragments).toHaveLength(0);
    expect(shed.darkMatterSeeds).toHaveLength(1);
    expect(shed.darkMatterSeeds[0].varietyId).toBe('blackhole-melon');
  });

  test('7. 宇宙之心自动触发（收集78品种后自动获得）', async ({ page }) => {
    const initialCollection = createFullCollectionWithoutCosmicHeart();
    expect(initialCollection).toHaveLength(ALL_VARIETY_IDS.length - 1);

    await seedInit(page, createSeedPayload({
      collection: initialCollection,
    }));
    await page.goto('/');

    await expect(page.getByText(zh.cosmicHeartUnlockTitle)).toBeVisible();
    await expect(page.getByText(zh.cosmicHeartUnlockDesc)).toBeVisible();

    await page.waitForFunction(() => {
      const farmRaw = localStorage.getItem('watermelon-farm');
      const shedRaw = localStorage.getItem('watermelon-shed');
      if (!farmRaw || !shedRaw) return false;

      try {
        const farmData = JSON.parse(farmRaw) as {
          collection?: Array<{ varietyId?: string; isMutant?: boolean }>;
        };
        const shedData = JSON.parse(shedRaw) as {
          darkMatterSeeds?: Array<{ varietyId?: string }>;
        };

        const hasCosmicHeartInCollection = Array.isArray(farmData.collection)
          && farmData.collection.some((item) => item.varietyId === 'cosmic-heart' && item.isMutant !== true);
        const hasCosmicHeartSeed = Array.isArray(shedData.darkMatterSeeds)
          && shedData.darkMatterSeeds.some((seed) => seed.varietyId === 'cosmic-heart');
        return hasCosmicHeartInCollection && hasCosmicHeartSeed;
      } catch {
        return false;
      }
    }, { timeout: 8_000 });

    const farm = await readStorage<FarmCollectionSnapshot>(page, 'watermelon-farm', { collection: [] });
    const shed = await readStorage<ShedSnapshot>(page, 'watermelon-shed', { darkMatterSeeds: [] });
    const cosmicHeartCollection = farm.collection.filter((item) => item.varietyId === 'cosmic-heart' && item.isMutant !== true);

    expect(cosmicHeartCollection).toHaveLength(1);
    expect(cosmicHeartCollection[0].count).toBeGreaterThan(0);
    expect(shed.darkMatterSeeds.some((seed) => seed.varietyId === 'cosmic-heart')).toBe(true);
  });

  test('8. 暗物质种子可种植', async ({ page }) => {
    await seedInit(page, createSeedPayload({
      shedOverrides: {
        darkMatterSeeds: [{ id: 'dark-seed-void', varietyId: 'void-melon' }],
      },
    }));
    await goToFarm(page);

    await page.locator('button').filter({ hasText: zh.farmPlotsTab }).first().click();
    const plantButton = page.locator('.farm-grid-perspective button').filter({ hasText: zh.farmPlant }).first();
    await plantButton.click();

    const darkMatterSeedLabel = zh.darkMatterSeedLabel(zh.varietyName('void-melon'));
    await page.locator('button').filter({ hasText: darkMatterSeedLabel }).first().click();

    await page.waitForTimeout(120);

    const farm = await readStorage<FarmSnapshot>(page, 'watermelon-farm', { plots: [] });
    const shed = await readStorage<ShedSnapshot>(page, 'watermelon-shed', { darkMatterSeeds: [] });
    const plot0 = getPlotById(farm, 0);

    expect(plot0).toBeTruthy();
    if (!plot0) return;

    expect(plot0.state).toBe('growing');
    expect(plot0.varietyId).toBe('void-melon');
    expect(plot0.seedQuality).toBe('legendary');
    expect(plot0.progress).toBe(0);
    expect(shed.darkMatterSeeds).toHaveLength(0);
  });
});
