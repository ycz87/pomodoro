import { test, expect, type Page } from '@playwright/test';
import { createEmptyPlot, type Plot, type VarietyId } from '../src/types/farm';
import { zh } from '../src/i18n/locales/zh';
import type { WeeklyDecorationId, WeeklyItem, WeeklyShop } from '../src/types/market';

interface DebugState {
  settings: Record<string, unknown>;
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
    prismaticSeeds: Array<Record<string, unknown>>;
    darkMatterSeeds: Array<Record<string, unknown>>;
  };
  gene: {
    fragments: Array<Record<string, unknown>>;
  };
  coins: {
    balance: number;
  };
  weeklyShop?: WeeklyShop;
}

interface CoinsSnapshot {
  balance: number;
}

interface GeneSnapshot {
  fragments: Array<{
    id?: string;
    varietyId?: string;
    rarity?: string;
  }>;
}

interface ShedSnapshot {
  items: Record<string, number>;
  prismaticSeeds: Array<{
    id?: string;
    varietyId?: string;
  }>;
}

function createWeeklyShop(items: WeeklyItem[], nowTimestamp: number = Date.now()): WeeklyShop {
  return {
    items,
    refreshAt: new Date(nowTimestamp + 7 * 24 * 60 * 60 * 1000).toISOString(),
    lastRefreshAt: new Date(nowTimestamp).toISOString(),
  };
}

function createRareGeneItem(options?: {
  id?: string;
  price?: number;
  stock?: number;
  varietyId?: VarietyId;
  rarity?: 'epic' | 'legendary';
}): WeeklyItem {
  const varietyId = options?.varietyId ?? 'golden-heart';
  const rarity = options?.rarity ?? 'epic';
  return {
    id: options?.id ?? 'weekly-rare-gene',
    type: 'rare-gene-fragment',
    name: `Gene Fragment · ${varietyId}`,
    price: options?.price ?? 260,
    stock: options?.stock ?? 2,
    data: {
      varietyId,
      rarity,
      emoji: '🧬',
    },
  };
}

function createLegendarySeedItem(options?: {
  id?: string;
  price?: number;
  stock?: number;
  varietyId?: VarietyId;
}): WeeklyItem {
  const varietyId = options?.varietyId ?? 'sun-stone';
  return {
    id: options?.id ?? 'weekly-legendary-seed',
    type: 'legendary-seed',
    name: `Legendary Seed · ${varietyId}`,
    price: options?.price ?? 300,
    stock: options?.stock ?? 2,
    data: {
      varietyId,
      emoji: '🌱',
    },
  };
}

function createDecorationItem(options?: {
  id?: string;
  price?: number;
  stock?: number;
  decorationId?: WeeklyDecorationId;
}): WeeklyItem {
  const decorationId = options?.decorationId ?? 'star-lamp';
  return {
    id: options?.id ?? 'weekly-decoration',
    type: 'limited-decoration',
    name: 'Star Lamp',
    price: options?.price ?? 150,
    stock: options?.stock ?? 2,
    data: {
      decorationId,
      emoji: '🏮',
    },
  };
}

function createSeedPayload(options?: {
  balance?: number;
  weeklyShop?: WeeklyShop;
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
      plots: [0, 1, 2, 3].map((index) => createEmptyPlot(index)),
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
      prismaticSeeds: [],
      darkMatterSeeds: [],
    },
    gene: {
      fragments: [],
    },
    coins: {
      balance: options?.balance ?? 0,
    },
    weeklyShop: options?.weeklyShop,
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
    localStorage.setItem('watermelon-coins', JSON.stringify(state.coins));

    if (state.weeklyShop !== undefined) {
      localStorage.setItem('watermelon-weekly-shop', JSON.stringify(state.weeklyShop));
    } else {
      localStorage.removeItem('watermelon-weekly-shop');
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

async function goToWeeklyShop(page: Page) {
  await page.goto('/');
  await page.getByRole('button', { name: '🏪' }).click();
  await expect(page.getByRole('heading', { name: zh.marketTitle })).toBeVisible();
  await page.getByRole('button', { name: zh.marketTabWeekly }).click();
  await expect(page.getByText(zh.marketWeeklyTitle)).toBeVisible();
}

test.describe('Phase 6 Step 4 - Weekly Shop', () => {
  test('1. 每周商城初始化（验证 weeklyShop 存在和结构）', async ({ page }) => {
    await seedInit(page, createSeedPayload({ balance: 999 }));
    await goToWeeklyShop(page);

    await page.waitForFunction(() => {
      const raw = localStorage.getItem('watermelon-weekly-shop');
      if (!raw) return false;
      try {
        const data = JSON.parse(raw) as { items?: unknown; refreshAt?: unknown; lastRefreshAt?: unknown };
        return Array.isArray(data.items)
          && typeof data.refreshAt === 'string'
          && typeof data.lastRefreshAt === 'string';
      } catch {
        return false;
      }
    });

    const weeklyShop = await readStorage<WeeklyShop | null>(
      page,
      'watermelon-weekly-shop',
      null,
    );

    expect(weeklyShop).not.toBeNull();
    if (!weeklyShop) return;

    expect(Array.isArray(weeklyShop.items)).toBeTruthy();
    expect(Number.isFinite(Date.parse(weeklyShop.refreshAt))).toBeTruthy();
    expect(Number.isFinite(Date.parse(weeklyShop.lastRefreshAt))).toBeTruthy();
  });

  test('2. 商品生成逻辑（验证 3-5 件商品，每种类型至少 1 件）', async ({ page }) => {
    await seedInit(page, createSeedPayload({ balance: 999 }));
    await goToWeeklyShop(page);

    await page.waitForFunction(() => {
      const raw = localStorage.getItem('watermelon-weekly-shop');
      if (!raw) return false;
      try {
        const data = JSON.parse(raw) as { items?: unknown };
        return Array.isArray(data.items) && data.items.length >= 3;
      } catch {
        return false;
      }
    });

    const weeklyShop = await readStorage<WeeklyShop>(page, 'watermelon-weekly-shop', {
      items: [],
      refreshAt: '',
      lastRefreshAt: '',
    });

    expect(weeklyShop.items.length).toBeGreaterThanOrEqual(3);
    expect(weeklyShop.items.length).toBeLessThanOrEqual(5);

    const typeSet = new Set(weeklyShop.items.map((item) => item.type));
    expect(typeSet.has('rare-gene-fragment')).toBeTruthy();
    expect(typeSet.has('legendary-seed')).toBeTruthy();
    expect(typeSet.has('limited-decoration')).toBeTruthy();

    for (const item of weeklyShop.items) {
      expect(typeof item.id).toBe('string');
      expect(item.id.length).toBeGreaterThan(0);
      expect(item.price).toBeGreaterThan(0);
      expect(item.stock).toBeGreaterThan(0);
    }
  });

  test('3. 购买稀有基因片段（余额扣除 + 基因添加到背包 + stock-1）', async ({ page }) => {
    const rareItem = createRareGeneItem({
      id: 'weekly-rare-gene-target',
      varietyId: 'golden-heart',
      rarity: 'epic',
      price: 260,
      stock: 2,
    });
    await seedInit(page, createSeedPayload({
      balance: 1000,
      weeklyShop: createWeeklyShop([rareItem]),
    }));
    await goToWeeklyShop(page);

    const buyButton = page.getByRole('button', { name: zh.marketWeeklyBuyButton }).first();
    await expect(buyButton).toBeEnabled();
    await buyButton.click();

    await page.waitForFunction((args: {
      expectedBalance: number;
      itemId: string;
      varietyId: string;
      expectedStock: number;
    }) => {
      const coinsRaw = localStorage.getItem('watermelon-coins');
      const genesRaw = localStorage.getItem('watermelon-genes');
      const shopRaw = localStorage.getItem('watermelon-weekly-shop');
      if (!coinsRaw || !genesRaw || !shopRaw) return false;
      try {
        const coins = JSON.parse(coinsRaw) as { balance?: unknown };
        const genes = JSON.parse(genesRaw) as {
          fragments?: Array<{ varietyId?: unknown }>;
        };
        const shop = JSON.parse(shopRaw) as {
          items?: Array<{ id?: unknown; stock?: unknown }>;
        };
        const hasGene = Array.isArray(genes.fragments)
          && genes.fragments.some((fragment) => fragment.varietyId === args.varietyId);
        const targetItem = Array.isArray(shop.items)
          ? shop.items.find((entry) => entry.id === args.itemId)
          : null;
        return coins.balance === args.expectedBalance
          && hasGene
          && targetItem?.stock === args.expectedStock;
      } catch {
        return false;
      }
    }, {
      expectedBalance: 740,
      itemId: rareItem.id,
      varietyId: rareItem.data.varietyId,
      expectedStock: 1,
    });

    const coins = await readStorage<CoinsSnapshot>(page, 'watermelon-coins', { balance: 0 });
    const genes = await readStorage<GeneSnapshot>(page, 'watermelon-genes', { fragments: [] });
    const weeklyShop = await readStorage<WeeklyShop>(page, 'watermelon-weekly-shop', {
      items: [],
      refreshAt: '',
      lastRefreshAt: '',
    });
    const targetItem = weeklyShop.items.find((entry) => entry.id === rareItem.id);

    expect(coins.balance).toBe(740);
    expect(genes.fragments.some((fragment) => fragment.varietyId === rareItem.data.varietyId)).toBe(true);
    expect(targetItem?.stock).toBe(1);
  });

  test('4. 购买传说种子（余额扣除 + 种子添加到背包 + stock-1）', async ({ page }) => {
    const seedItem = createLegendarySeedItem({
      id: 'weekly-legendary-seed-target',
      varietyId: 'sun-stone',
      price: 300,
      stock: 2,
    });
    await seedInit(page, createSeedPayload({
      balance: 900,
      weeklyShop: createWeeklyShop([seedItem]),
    }));
    await goToWeeklyShop(page);

    const buyButton = page.getByRole('button', { name: zh.marketWeeklyBuyButton }).first();
    await expect(buyButton).toBeEnabled();
    await buyButton.click();

    await page.waitForFunction((args: {
      expectedBalance: number;
      itemId: string;
      varietyId: string;
      expectedStock: number;
    }) => {
      const coinsRaw = localStorage.getItem('watermelon-coins');
      const shedRaw = localStorage.getItem('watermelon-shed');
      const shopRaw = localStorage.getItem('watermelon-weekly-shop');
      if (!coinsRaw || !shedRaw || !shopRaw) return false;
      try {
        const coins = JSON.parse(coinsRaw) as { balance?: unknown };
        const shed = JSON.parse(shedRaw) as {
          prismaticSeeds?: Array<{ varietyId?: unknown }>;
        };
        const shop = JSON.parse(shopRaw) as {
          items?: Array<{ id?: unknown; stock?: unknown }>;
        };
        const hasSeed = Array.isArray(shed.prismaticSeeds)
          && shed.prismaticSeeds.some((seed) => seed.varietyId === args.varietyId);
        const targetItem = Array.isArray(shop.items)
          ? shop.items.find((entry) => entry.id === args.itemId)
          : null;
        return coins.balance === args.expectedBalance
          && hasSeed
          && targetItem?.stock === args.expectedStock;
      } catch {
        return false;
      }
    }, {
      expectedBalance: 600,
      itemId: seedItem.id,
      varietyId: seedItem.data.varietyId,
      expectedStock: 1,
    });

    const coins = await readStorage<CoinsSnapshot>(page, 'watermelon-coins', { balance: 0 });
    const shed = await readStorage<ShedSnapshot>(page, 'watermelon-shed', {
      items: {},
      prismaticSeeds: [],
    });
    const weeklyShop = await readStorage<WeeklyShop>(page, 'watermelon-weekly-shop', {
      items: [],
      refreshAt: '',
      lastRefreshAt: '',
    });
    const targetItem = weeklyShop.items.find((entry) => entry.id === seedItem.id);

    expect(coins.balance).toBe(600);
    expect(shed.prismaticSeeds.some((seed) => seed.varietyId === seedItem.data.varietyId)).toBe(true);
    expect(targetItem?.stock).toBe(1);
  });

  test('5. 购买限定装饰（余额扣除 + 装饰添加到背包 + stock-1）', async ({ page }) => {
    const decorationItem = createDecorationItem({
      id: 'weekly-decoration-target',
      decorationId: 'star-lamp',
      price: 150,
      stock: 2,
    });
    await seedInit(page, createSeedPayload({
      balance: 500,
      weeklyShop: createWeeklyShop([decorationItem]),
    }));
    await goToWeeklyShop(page);

    const buyButton = page.getByRole('button', { name: zh.marketWeeklyBuyButton }).first();
    await expect(buyButton).toBeEnabled();
    await buyButton.click();

    await page.waitForFunction((args: {
      expectedBalance: number;
      itemId: string;
      decorationId: string;
      expectedStock: number;
    }) => {
      const coinsRaw = localStorage.getItem('watermelon-coins');
      const shedRaw = localStorage.getItem('watermelon-shed');
      const shopRaw = localStorage.getItem('watermelon-weekly-shop');
      if (!coinsRaw || !shedRaw || !shopRaw) return false;
      try {
        const coins = JSON.parse(coinsRaw) as { balance?: unknown };
        const shed = JSON.parse(shedRaw) as {
          items?: Record<string, unknown>;
        };
        const shop = JSON.parse(shopRaw) as {
          items?: Array<{ id?: unknown; stock?: unknown }>;
        };
        const count = shed.items?.[args.decorationId];
        const targetItem = Array.isArray(shop.items)
          ? shop.items.find((entry) => entry.id === args.itemId)
          : null;
        return coins.balance === args.expectedBalance
          && count === 1
          && targetItem?.stock === args.expectedStock;
      } catch {
        return false;
      }
    }, {
      expectedBalance: 350,
      itemId: decorationItem.id,
      decorationId: decorationItem.data.decorationId,
      expectedStock: 1,
    });

    const coins = await readStorage<CoinsSnapshot>(page, 'watermelon-coins', { balance: 0 });
    const shed = await readStorage<ShedSnapshot>(page, 'watermelon-shed', {
      items: {},
      prismaticSeeds: [],
    });
    const weeklyShop = await readStorage<WeeklyShop>(page, 'watermelon-weekly-shop', {
      items: [],
      refreshAt: '',
      lastRefreshAt: '',
    });
    const targetItem = weeklyShop.items.find((entry) => entry.id === decorationItem.id);

    expect(coins.balance).toBe(350);
    expect(shed.items[decorationItem.data.decorationId]).toBe(1);
    expect(targetItem?.stock).toBe(1);
  });

  test('6. 售罄后按钮置灰（stock=0 时按钮禁用）', async ({ page }) => {
    const soldOutItem = createDecorationItem({
      id: 'weekly-sold-out-item',
      stock: 0,
      price: 120,
    });
    await seedInit(page, createSeedPayload({
      balance: 999,
      weeklyShop: createWeeklyShop([soldOutItem]),
    }));
    await goToWeeklyShop(page);

    const soldOutButton = page.getByRole('button', { name: zh.marketWeeklySoldOut }).first();
    await expect(soldOutButton).toBeVisible();
    await expect(soldOutButton).toBeDisabled();
  });

  test('7. 余额不足时按钮置灰（瓜币 < price 时按钮禁用）', async ({ page }) => {
    const expensiveItem = createLegendarySeedItem({
      id: 'weekly-expensive-item',
      price: 600,
      stock: 2,
    });
    await seedInit(page, createSeedPayload({
      balance: 100,
      weeklyShop: createWeeklyShop([expensiveItem]),
    }));
    await goToWeeklyShop(page);

    const buyButton = page.getByRole('button', { name: zh.marketWeeklyBuyButton }).first();
    await expect(buyButton).toBeVisible();
    await expect(buyButton).toBeDisabled();
  });
});
