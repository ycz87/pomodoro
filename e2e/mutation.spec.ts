import { test, expect, type Page } from '@playwright/test';
import { createEmptyPlot, VARIETY_DEFS } from '../src/types/farm';
import type { CollectedVariety, Plot, VarietyId } from '../src/types/farm';
import type { SeedQuality } from '../src/types/slicing';
import { rollMutation } from '../src/farm/growth';
import { zh } from '../src/i18n/locales/zh';
import { en } from '../src/i18n/locales/en';
import { ja } from '../src/i18n/locales/ja';
import { ko } from '../src/i18n/locales/ko';
import { de } from '../src/i18n/locales/de';
import { fr } from '../src/i18n/locales/fr';
import { es } from '../src/i18n/locales/es';
import { pt } from '../src/i18n/locales/pt';

type LocaleCode = 'zh' | 'en' | 'ja' | 'ko' | 'de' | 'fr' | 'es' | 'pt';

interface DebugState {
  settings: Record<string, unknown>;
  farm: {
    plots: Plot[];
    collection: CollectedVariety[];
    lastActiveDate: string;
    consecutiveInactiveDays: number;
    lastActivityTimestamp: number;
  };
  shed: {
    seeds: { normal: number; epic: number; legendary: number };
    items: Record<string, number>;
    totalSliced: number;
    pity: { epicPity: number; legendaryPity: number };
    injectedSeeds: Array<Record<string, unknown>>;
    hybridSeeds: Array<Record<string, unknown>>;
  };
  gene: {
    fragments: Array<Record<string, unknown>>;
  };
  coins: {
    balance: number;
  };
}

interface GrowingPlotOptions {
  varietyId?: VarietyId;
  progress?: number;
  mutationChance?: number;
  mutationStatus?: 'none' | 'positive' | 'negative';
  isMutant?: boolean;
  state?: Plot['state'];
  seedQuality?: SeedQuality;
  accumulatedMinutes?: number;
  lastActivityTimestamp?: number;
}

function getDateKey(offsetDays: number = 0): string {
  const now = Date.now();
  const target = new Date(now + offsetDays * 24 * 60 * 60 * 1000);
  return target.toISOString().slice(0, 10);
}

function createGrowingPlot(id: number, options?: GrowingPlotOptions): Plot {
  const varietyId = options?.varietyId ?? 'jade-stripe';
  const progress = options?.progress ?? 0.199;
  const matureMinutes = VARIETY_DEFS[varietyId].matureMinutes;

  return {
    ...createEmptyPlot(id),
    state: options?.state ?? 'growing',
    seedQuality: options?.seedQuality ?? 'normal',
    varietyId,
    progress,
    mutationStatus: options?.mutationStatus ?? 'none',
    mutationChance: options?.mutationChance ?? 0.02,
    isMutant: options?.isMutant ?? false,
    accumulatedMinutes: options?.accumulatedMinutes ?? Math.floor(progress * matureMinutes),
    plantedDate: getDateKey(-1),
    lastUpdateDate: getDateKey(-1),
    lastActivityTimestamp: options?.lastActivityTimestamp ?? (Date.now() - 30 * 60 * 1000),
  };
}

function createSeedPayload(options?: {
  language?: LocaleCode;
  plots?: Plot[];
  collection?: CollectedVariety[];
  shedItems?: Record<string, number>;
  balance?: number;
  lastActiveDate?: string;
  lastActivityTimestamp?: number;
}): DebugState {
  const now = Date.now();

  return {
    settings: {
      workMinutes: 25,
      shortBreakMinutes: 5,
      theme: 'dark',
      language: options?.language ?? 'zh',
    },
    farm: {
      plots: options?.plots ?? [0, 1, 2, 3].map(createEmptyPlot),
      collection: options?.collection ?? [],
      lastActiveDate: options?.lastActiveDate ?? getDateKey(0),
      consecutiveInactiveDays: 0,
      lastActivityTimestamp: options?.lastActivityTimestamp ?? now,
    },
    shed: {
      seeds: { normal: 0, epic: 0, legendary: 0 },
      items: options?.shedItems ?? {},
      totalSliced: 0,
      pity: { epicPity: 0, legendaryPity: 0 },
      injectedSeeds: [],
      hybridSeeds: [],
    },
    gene: {
      fragments: [],
    },
    coins: {
      balance: options?.balance ?? 0,
    },
  };
}

function seedInit(page: Page, payload: DebugState) {
  return page.addInitScript(({ state }: { state: DebugState }) => {
    localStorage.clear();
    localStorage.setItem('pomodoro-guide-seen', '1');
    localStorage.setItem('pomodoro-settings', JSON.stringify(state.settings));
    localStorage.setItem('watermelon-farm', JSON.stringify(state.farm));
    localStorage.setItem('watermelon-shed', JSON.stringify(state.shed));
    localStorage.setItem('watermelon-genes', JSON.stringify(state.gene));
    localStorage.setItem('watermelon-coins', JSON.stringify(state.coins));
  }, { state: payload });
}

async function bootWithSeed(page: Page, payload: DebugState) {
  await seedInit(page, payload);
  await page.goto('/');
  await page.reload();
}

async function goToFarm(page: Page) {
  await page.getByRole('button', { name: '🌱' }).click();
  await expect(page.locator('.farm-grid-perspective')).toBeVisible();
}

async function activateDebugToolbar(page: Page) {
  const settingsButton = page.getByRole('button', { name: /settings|设置/i });
  await settingsButton.click();

  const settingsPanel = page.locator('.settings-scrollbar').first();
  await expect(settingsPanel).toBeVisible();

  const versionBadge = settingsPanel.locator('span').filter({ hasText: /^v\d+\.\d+\.\d+$/ });
  await expect(versionBadge).toBeVisible();
  for (let i = 0; i < 7; i += 1) {
    await versionBadge.click();
  }

  await expect(page.getByText('🧪 Debug Toolbar')).toBeVisible();
  await settingsButton.click();
}

async function openDebugPanel(page: Page) {
  const debugTitle = page.getByText('🧪 Debug Toolbar');
  const resetButton = page.getByRole('button', { name: '🔄 重置所有数据' });
  if (!(await resetButton.isVisible().catch(() => false))) {
    await debugTitle.click();
  }
  await expect(resetButton).toBeVisible();
}

async function goToMarket(page: Page) {
  await page.getByRole('button', { name: '🏪' }).click();
  await expect(page.getByRole('heading', { name: zh.marketTitle })).toBeVisible();
}

async function openSellTab(page: Page) {
  await page.getByRole('button', { name: zh.marketTabSell }).click();
}

async function readFarm(page: Page): Promise<{ plots: Plot[]; collection: CollectedVariety[] }> {
  return page.evaluate(() => {
    const raw = localStorage.getItem('watermelon-farm');
    if (!raw) return { plots: [], collection: [] };

    const parsed = JSON.parse(raw) as { plots?: unknown; collection?: unknown };
    return {
      plots: Array.isArray(parsed.plots) ? parsed.plots as Plot[] : [],
      collection: Array.isArray(parsed.collection) ? parsed.collection as CollectedVariety[] : [],
    };
  });
}

async function readShedItems(page: Page): Promise<Record<string, number>> {
  return page.evaluate(() => {
    const raw = localStorage.getItem('watermelon-shed');
    if (!raw) return {};

    const parsed = JSON.parse(raw) as { items?: unknown };
    if (!parsed.items || typeof parsed.items !== 'object') return {};

    return parsed.items as Record<string, number>;
  });
}

async function readCoins(page: Page): Promise<number> {
  return page.evaluate(() => {
    const raw = localStorage.getItem('watermelon-coins');
    if (!raw) return 0;

    const parsed = JSON.parse(raw) as { balance?: unknown };
    return typeof parsed.balance === 'number' ? parsed.balance : 0;
  });
}

function withMockedRandomSeed(seed: number, run: () => void) {
  const originalRandom = Math.random;
  let state = seed >>> 0;

  Math.random = () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 0x1_0000_0000;
  };

  try {
    run();
  } finally {
    Math.random = originalRandom;
  }
}

async function useMutationGunOnce(page: Page, expectedChance: number) {
  const mutationButton = page.getByRole('button', { name: new RegExp(zh.mutationGunUse) });
  if (!(await mutationButton.isVisible().catch(() => false))) {
    await page.locator('.farm-grid-perspective > div').first().click();
    await expect(mutationButton).toBeVisible();
  }

  await mutationButton.click();

  // Wait for React to flush state + localStorage write
  await page.waitForFunction((targetChance: number) => {
    const farmRaw = localStorage.getItem('watermelon-farm');
    if (!farmRaw) return false;

    const farm = JSON.parse(farmRaw) as { plots?: Array<{ id?: number; mutationChance?: number }> };

    const plot = Array.isArray(farm.plots)
      ? farm.plots.find((item) => item.id === 0)
      : undefined;

    const chance = typeof plot?.mutationChance === 'number' ? plot.mutationChance : 0;

    return Math.abs(chance - targetChance) < 0.000_001;
  }, expectedChance);

  // Extra wait to ensure React re-render completes before next interaction
  await page.waitForTimeout(300);
}

test.describe('Mutation System', () => {
  test('AC1: 发芽期自然变异按 2% 概率阈值判定', async ({ page }) => {
    const plots: Plot[] = [
      createGrowingPlot(0, { progress: 0.199, mutationChance: 1 }),
      createGrowingPlot(1, { progress: 0.10, mutationChance: 0.02 }),
      createEmptyPlot(2),
      createEmptyPlot(3),
    ];

    const payload = createSeedPayload({
      plots,
      lastActiveDate: getDateKey(-1),
      lastActivityTimestamp: Date.now() - 30 * 60 * 1000,
    });

    await bootWithSeed(page, payload);

    await page.waitForFunction(() => {
      const raw = localStorage.getItem('watermelon-farm');
      if (!raw) return false;
      const farm = JSON.parse(raw) as { plots?: Array<{ mutationChance?: number }> };
      if (!Array.isArray(farm.plots) || farm.plots.length < 2) return false;
      const chance0 = farm.plots[0].mutationChance;
      const chance1 = farm.plots[1].mutationChance;
      return chance0 === 0 && Math.abs((chance1 ?? 0) - 0.02) < 0.000_001;
    });

    const farm = await readFarm(page);

    expect(farm.plots[0].progress).toBeGreaterThanOrEqual(0.2);
    expect(farm.plots[0].mutationChance).toBe(0);
    expect(farm.plots[1].progress).toBeLessThan(0.2);
    expect(farm.plots[1].mutationChance).toBeCloseTo(0.02, 6);
  });

  test('AC2: 变异结果分布（宽松统计断言）', () => {
    const plots: Plot[] = Array.from({ length: 100 }, (_, index) => (
      createGrowingPlot(index, { mutationChance: 1 })
    ));

    let rolledPlots: Plot[] = [];
    withMockedRandomSeed(2026_02_19, () => {
      rolledPlots = plots.map((plot) => rollMutation(plot));
    });

    const positiveCount = rolledPlots.filter((plot) => plot.mutationStatus === 'positive').length;
    const negativeCount = rolledPlots.filter((plot) => plot.mutationStatus === 'negative').length;
    const noneCount = rolledPlots.filter((plot) => (plot.mutationStatus ?? 'none') === 'none').length;

    expect(rolledPlots.every((plot) => plot.mutationChance === 0)).toBe(true);
    expect(positiveCount).toBeGreaterThanOrEqual(20);
    expect(negativeCount).toBeGreaterThanOrEqual(15);
    expect(noneCount).toBeGreaterThanOrEqual(15);
  });

  test('AC3: 良性变异产出变异体，收获后图鉴保留 isMutant 标记', async ({ page }) => {
    const varietyId: VarietyId = 'jade-stripe';
    const plots: Plot[] = [
      createGrowingPlot(0, {
        varietyId,
        state: 'mature',
        progress: 1,
        mutationStatus: 'positive',
        mutationChance: 0,
        isMutant: true,
        accumulatedMinutes: VARIETY_DEFS[varietyId].matureMinutes,
      }),
      createEmptyPlot(1),
      createEmptyPlot(2),
      createEmptyPlot(3),
    ];

    const payload = createSeedPayload({
      plots,
      lastActiveDate: getDateKey(0),
      lastActivityTimestamp: Date.now(),
    });

    await bootWithSeed(page, payload);

    await goToFarm(page);

    const matureMutantCard = page
      .locator('.farm-grid-perspective button')
      .filter({ hasText: `${zh.varietyName(varietyId)} · ${zh.mutationPositive}` })
      .first();
    await expect(matureMutantCard).toBeVisible();

    await matureMutantCard.click();

    await page.waitForFunction((targetVarietyId: VarietyId) => {
      const raw = localStorage.getItem('watermelon-farm');
      if (!raw) return false;
      const farm = JSON.parse(raw) as {
        collection?: Array<{ varietyId?: string; isMutant?: boolean; count?: number }>;
      };
      if (!Array.isArray(farm.collection)) return false;

      const record = farm.collection.find((item) => item.varietyId === targetVarietyId && item.isMutant === true);
      return !!record && record.count === 1;
    }, varietyId);

    const farm = await readFarm(page);
    const mutantRecord = farm.collection.find((item) => item.varietyId === varietyId && item.isMutant === true);

    expect(mutantRecord).toBeTruthy();
    expect(mutantRecord?.count).toBe(1);
  });

  test('AC4: 恶性变异状态（枯萎/品质降级）正确展示', async ({ page }) => {
    const plots: Plot[] = [
      createGrowingPlot(0, {
        state: 'withered',
        progress: 0.35,
        mutationStatus: 'negative',
        mutationChance: 0,
        seedQuality: 'legendary',
      }),
      createGrowingPlot(1, {
        state: 'growing',
        progress: 0.35,
        mutationStatus: 'negative',
        mutationChance: 0,
        seedQuality: 'epic',
      }),
      createEmptyPlot(2),
      createEmptyPlot(3),
    ];

    const payload = createSeedPayload({
      plots,
      lastActiveDate: getDateKey(0),
      lastActivityTimestamp: Date.now(),
    });

    await bootWithSeed(page, payload);
    await goToFarm(page);

    await expect(page.getByText(zh.mutationWithered)).toBeVisible();
    await expect(page.getByText(zh.mutationDowngraded)).toBeVisible();

    const farm = await readFarm(page);
    expect(farm.plots[0].state).toBe('withered');
    expect(farm.plots[0].mutationStatus).toBe('negative');
    expect(farm.plots[1].seedQuality).toBe('epic');
    expect(farm.plots[1].mutationStatus).toBe('negative');
  });

  test('AC5: 变异射线枪使用后该株变异概率 +20%', async ({ page }) => {
    const payload = createSeedPayload({
      plots: [
        createGrowingPlot(0, { progress: 0.30, mutationChance: 0.02 }),
        createEmptyPlot(1),
        createEmptyPlot(2),
        createEmptyPlot(3),
      ],
      shedItems: {
        'mutation-gun': 1,
      },
      lastActiveDate: getDateKey(0),
      lastActivityTimestamp: Date.now(),
    });

    await bootWithSeed(page, payload);
    await goToFarm(page);

    await page.locator('.farm-grid-perspective > div').first().click();
    await expect(page.getByText(`${zh.mutationChanceLabel}: 2%`)).toBeVisible();

    await useMutationGunOnce(page, 0.22);

    // Verify localStorage data (UI tooltip may close after gun use)
    const farm = await readFarm(page);
    expect(farm.plots[0].mutationChance).toBeCloseTo(0.22, 6);
  });

  test('AC6: 射线枪使用 5 次后该株 100% 触发变异判定', async ({ page }) => {
    const payload = createSeedPayload({
      plots: [
        createGrowingPlot(0, { progress: 0.199, mutationChance: 0.02 }),
        createEmptyPlot(1),
        createEmptyPlot(2),
        createEmptyPlot(3),
      ],
      shedItems: {
        'mutation-gun': 5,
      },
      lastActiveDate: getDateKey(0),
      lastActivityTimestamp: Date.now(),
    });

    await bootWithSeed(page, payload);
    await goToFarm(page);

    await useMutationGunOnce(page, 0.22);
    await useMutationGunOnce(page, 0.42);
    await useMutationGunOnce(page, 0.62);
    await useMutationGunOnce(page, 0.82);
    await useMutationGunOnce(page, 1.00);

    let farm = await readFarm(page);
    expect(farm.plots[0].mutationChance).toBe(1);

    await activateDebugToolbar(page);
    await openDebugPanel(page);

    const multiplierSection = page.locator('section').filter({ hasText: '时间倍率' });
    await multiplierSection.getByRole('button', { name: '1000x' }).click();

    await page.waitForFunction(() => {
      const raw = localStorage.getItem('watermelon-farm');
      if (!raw) return false;
      const farm = JSON.parse(raw) as { plots?: Array<{ mutationChance?: number }> };
      const first = Array.isArray(farm.plots) ? farm.plots[0] : undefined;
      return typeof first?.mutationChance === 'number' && first.mutationChance === 0;
    });

    farm = await readFarm(page);
    expect(farm.plots[0].mutationChance).toBe(0);
    expect(['none', 'positive', 'negative']).toContain(farm.plots[0].mutationStatus ?? 'none');
  });

  test('AC7: 变异体售价为原品种 3 倍', async ({ page }) => {
    const varietyId: VarietyId = 'jade-stripe';
    const basePrice = VARIETY_DEFS[varietyId].sellPrice;
    const mutantPrice = basePrice * 3;

    const payload = createSeedPayload({
      collection: [
        {
          varietyId,
          isMutant: true,
          firstObtainedDate: '2026-02-19',
          count: 1,
        },
      ],
      balance: 0,
    });

    await bootWithSeed(page, payload);

    await goToMarket(page);
    await openSellTab(page);

    const mutantCard = page
      .locator('button')
      .filter({ hasText: `${zh.varietyName(varietyId)} · ${zh.mutationPositive}` })
      .first();

    await expect(mutantCard).toBeVisible();
    await expect(mutantCard).toContainText(String(mutantPrice));

    await mutantCard.click();
    await page.getByRole('button', { name: zh.marketSellConfirmButton }).click();

    await page.waitForFunction((args: { varietyId: VarietyId; expectedBalance: number }) => {
      const coinRaw = localStorage.getItem('watermelon-coins');
      const farmRaw = localStorage.getItem('watermelon-farm');
      if (!coinRaw || !farmRaw) return false;

      const coins = JSON.parse(coinRaw) as { balance?: unknown };
      const farm = JSON.parse(farmRaw) as {
        collection?: Array<{ varietyId?: string; isMutant?: boolean; count?: number }>;
      };

      if (coins.balance !== args.expectedBalance) return false;
      if (!Array.isArray(farm.collection)) return false;

      const record = farm.collection.find((item) => item.varietyId === args.varietyId && item.isMutant === true);
      return !!record && record.count === 0;
    }, {
      varietyId,
      expectedBalance: mutantPrice,
    });

    const farm = await readFarm(page);
    const coins = await readCoins(page);
    const mutantRecord = farm.collection.find((item) => item.varietyId === varietyId && item.isMutant === true);

    expect(coins).toBe(mutantPrice);
    expect(mutantRecord?.count).toBe(0);
  });

  test('AC8: i18n 8 语言 mutation key 无遗漏', () => {
    const locales: Record<LocaleCode, Record<string, unknown>> = {
      zh: zh as unknown as Record<string, unknown>,
      en: en as unknown as Record<string, unknown>,
      ja: ja as unknown as Record<string, unknown>,
      ko: ko as unknown as Record<string, unknown>,
      de: de as unknown as Record<string, unknown>,
      fr: fr as unknown as Record<string, unknown>,
      es: es as unknown as Record<string, unknown>,
      pt: pt as unknown as Record<string, unknown>,
    };

    const requiredKeys = [
      'mutationRevealed',
      'mutationPositive',
      'mutationNegative',
      'mutationWithered',
      'mutationDowngraded',
      'mutationGunUse',
      'mutationChanceLabel',
    ] as const;

    for (const [localeName, messages] of Object.entries(locales)) {
      for (const key of requiredKeys) {
        expect(typeof messages[key], `${localeName}.${key} should be string`).toBe('string');
        expect(String(messages[key]).trim().length, `${localeName}.${key} should not be empty`).toBeGreaterThan(0);
      }
    }
  });
});
