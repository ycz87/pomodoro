import { test, expect } from '@playwright/test';

interface DebugState {
  settings: Record<string, unknown>;
  farm: Record<string, unknown>;
  shed: Record<string, unknown>;
  gene: Record<string, unknown>;
}

function createSeedPayload(): DebugState {
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
      plots: [
        { id: 0, state: 'empty', progress: 0, accumulatedMinutes: 0, lastActivityTimestamp: 0 },
        { id: 1, state: 'empty', progress: 0, accumulatedMinutes: 0, lastActivityTimestamp: 0 },
        { id: 2, state: 'empty', progress: 0, accumulatedMinutes: 0, lastActivityTimestamp: 0 },
        { id: 3, state: 'empty', progress: 0, accumulatedMinutes: 0, lastActivityTimestamp: 0 },
      ],
      collection: [],
      lastActiveDate: todayKey,
      consecutiveInactiveDays: 0,
      lastActivityTimestamp: now,
    },
    shed: {
      seeds: { normal: 3, epic: 1, legendary: 0 },
      injectedSeeds: [],
    },
    gene: {
      fragments: [
        { id: 'frag-1', galaxyId: 'thick-earth', varietyId: 'jade-stripe', rarity: 'common', obtainedAt: new Date().toISOString() },
        { id: 'frag-2', galaxyId: 'thick-earth', varietyId: 'black-pearl', rarity: 'common', obtainedAt: new Date().toISOString() },
        { id: 'frag-3', galaxyId: 'fire', varietyId: 'lava-melon', rarity: 'common', obtainedAt: new Date().toISOString() },
      ],
    },
  };
}

function seedInit(page: import('@playwright/test').Page, payload: DebugState) {
  return page.addInitScript((state: DebugState) => {
    localStorage.clear();
    localStorage.setItem('pomodoro-guide-seen', '1');
    localStorage.setItem('pomodoro-settings', JSON.stringify(state.settings));
    localStorage.setItem('watermelon-farm', JSON.stringify(state.farm));
    localStorage.setItem('watermelon-shed', JSON.stringify(state.shed));
    localStorage.setItem('watermelon-genes', JSON.stringify(state.gene));
  }, payload);
}

async function goToFarmLab(page: import('@playwright/test').Page) {
  await page.goto('/');
  await page.locator('header button').filter({ hasText: '🌱' }).first().click();
  await expect(page.locator('.farm-grid-perspective')).toBeVisible();
  await page.locator('button').filter({ hasText: '🧬 实验室' }).click();
  await expect(page.getByText('基因背包')).toBeVisible();
}

async function goToFarmPlots(page: import('@playwright/test').Page) {
  await page.goto('/');
  await page.locator('header button').filter({ hasText: '🌱' }).first().click();
  await expect(page.locator('.farm-grid-perspective')).toBeVisible();
}

test.describe('Gene Injection', () => {
  test('AC1: Gene Lab has injection section', async ({ page }) => {
    await seedInit(page, createSeedPayload());
    await goToFarmLab(page);
    await expect(page.getByText('基因注入')).toBeVisible();
    await expect(page.getByText('将基因片段注入种子，定向培育目标星系品种')).toBeVisible();
  });

  test('AC2, AC3: Select galaxy + seed quality, inject consumes fragment + seed, creates injected seed', async ({ page }) => {
    await seedInit(page, createSeedPayload());
    await goToFarmLab(page);

    // The injection section's galaxy buttons don't have aria-expanded
    // Use the injection section heading as anchor
    const injectSection = page.locator('section').filter({ hasText: '基因注入' });

    // Select thick-earth galaxy in injection section
    const galaxyButton = injectSection.locator('button').filter({ hasText: '厚土星系' });
    await galaxyButton.click();

    // Select normal seed quality (text is "普通 ×3")
    const normalSeedButton = injectSection.locator('button').filter({ hasText: '普通' });
    await normalSeedButton.click();

    // Click inject button
    const injectButton = page.getByRole('button', { name: '🧬 注入' });
    await expect(injectButton).toBeEnabled();
    await injectButton.click();

    // Wait for state update
    await page.waitForTimeout(500);

    const shed = await page.evaluate(() => JSON.parse(localStorage.getItem('watermelon-shed') || '{}'));
    const genes = await page.evaluate(() => JSON.parse(localStorage.getItem('watermelon-genes') || '{}'));

    // 1 fragment consumed (was 2 thick-earth, now 1)
    const thickEarthFragments = genes.fragments.filter((f: { galaxyId: string }) => f.galaxyId === 'thick-earth');
    expect(thickEarthFragments).toHaveLength(1);

    // 1 normal seed consumed (was 3, now 2)
    expect(shed.seeds.normal).toBe(2);

    // 1 injected seed created
    expect(shed.injectedSeeds).toHaveLength(1);
    expect(shed.injectedSeeds[0].targetGalaxyId).toBe('thick-earth');
    expect(shed.injectedSeeds[0].quality).toBe('normal');
  });

  test('AC4: Injected seed stored with target galaxy in localStorage', async ({ page }) => {
    const payload = createSeedPayload();
    (payload.shed as Record<string, unknown>).injectedSeeds = [
      { id: 'inj-1', quality: 'normal', targetGalaxyId: 'thick-earth' },
    ];
    await seedInit(page, payload);
    await page.goto('/');

    const shed = await page.evaluate(() => JSON.parse(localStorage.getItem('watermelon-shed') || '{}'));
    expect(shed.injectedSeeds).toHaveLength(1);
    expect(shed.injectedSeeds[0].targetGalaxyId).toBe('thick-earth');
    expect(shed.injectedSeeds[0].quality).toBe('normal');
  });

  test('AC5: PlantModal shows injected seed option', async ({ page }) => {
    const payload = createSeedPayload();
    (payload.shed as Record<string, unknown>).injectedSeeds = [
      { id: 'inj-1', quality: 'normal', targetGalaxyId: 'thick-earth' },
    ];
    await seedInit(page, payload);
    await goToFarmPlots(page);

    // Click the plant button (it's a button with text containing "种植")
    const plantButton = page.locator('.farm-grid-perspective button').filter({ hasText: '种植' }).first();
    await plantButton.click();

    // PlantModal should show injected seed
    await expect(page.getByText('🧬 注入种子（厚土星系）')).toBeVisible();
  });

  test('AC6, AC7: Plant injected seed — plot grows, seed consumed', async ({ page }) => {
    const payload = createSeedPayload();
    (payload.shed as Record<string, unknown>).injectedSeeds = [
      { id: 'inj-1', quality: 'normal', targetGalaxyId: 'thick-earth' },
    ];
    await seedInit(page, payload);
    await goToFarmPlots(page);

    // Open plant modal
    const plantButton = page.locator('.farm-grid-perspective button').filter({ hasText: '种植' }).first();
    await plantButton.click();

    // Select injected seed
    await page.getByText('🧬 注入种子（厚土星系）').click();

    // Wait for planting
    await page.waitForTimeout(1000);

    // Verify farm state — plot 0 should be growing
    const farm = await page.evaluate(() => JSON.parse(localStorage.getItem('watermelon-farm') || '{}'));
    expect(farm.plots[0].state).toBe('growing');
    expect(farm.plots[0].varietyId).toBeTruthy();

    // Verify injected seed consumed
    const shed = await page.evaluate(() => JSON.parse(localStorage.getItem('watermelon-shed') || '{}'));
    expect(shed.injectedSeeds).toHaveLength(0);
  });

  test('AC8: i18n support - English', async ({ page }) => {
    const payload = createSeedPayload();
    payload.settings.language = 'en';
    await seedInit(page, payload);

    await page.goto('/');
    await page.locator('header button').filter({ hasText: '🌱' }).first().click();
    await page.locator('button').filter({ hasText: '🧬 Lab' }).click();

    await expect(page.getByText('Gene Injection')).toBeVisible();
    await expect(page.getByText('Cost: 1 gene fragment + 1 seed')).toBeVisible();
  });
});
