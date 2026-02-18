import { test, expect } from '@playwright/test';

interface SeedDebugStatePayload {
  settings: Record<string, unknown>;
  farm: Record<string, unknown>;
  shed: Record<string, unknown>;
}

async function seedDebugState(page: import('@playwright/test').Page) {
  const now = Date.now();
  const todayKey = new Date(now).toISOString().slice(0, 10);

  const payload: SeedDebugStatePayload = {
    settings: {
      workMinutes: 25,
      shortBreakMinutes: 5,
      alertSound: 'chime',
      alertRepeatCount: 2,
      alertVolume: 80,
      ambienceVolume: 40,
      autoStartBreak: true,
      autoStartWork: false,
      theme: 'dark',
      language: 'zh',
    },
    farm: {
      plots: [
        {
          id: 0,
          state: 'growing',
          seedQuality: 'normal',
          varietyId: 'jade-stripe',
          progress: 0.32,
          accumulatedMinutes: 3200,
          plantedDate: todayKey,
          lastUpdateDate: todayKey,
          lastActivityTimestamp: now,
        },
        {
          id: 1,
          state: 'empty',
          progress: 0,
          accumulatedMinutes: 0,
          lastActivityTimestamp: 0,
        },
        {
          id: 2,
          state: 'empty',
          progress: 0,
          accumulatedMinutes: 0,
          lastActivityTimestamp: 0,
        },
        {
          id: 3,
          state: 'empty',
          progress: 0,
          accumulatedMinutes: 0,
          lastActivityTimestamp: 0,
        },
      ],
      collection: [],
      lastActiveDate: todayKey,
      consecutiveInactiveDays: 0,
      lastActivityTimestamp: now,
    },
    shed: {
      seeds: { normal: 8, epic: 0, legendary: 0 },
    },
  };

  await page.addInitScript((seed: SeedDebugStatePayload) => {
    localStorage.clear();
    localStorage.setItem('pomodoro-guide-seen', '1');
    localStorage.setItem('watermelon-debug', 'true');
    localStorage.setItem('pomodoro-settings', JSON.stringify(seed.settings));
    localStorage.setItem('watermelon-farm', JSON.stringify(seed.farm));
    localStorage.setItem('watermelon-shed', JSON.stringify(seed.shed));
  }, payload);
}

async function goToFarm(page: import('@playwright/test').Page) {
  await page.goto('/');
  const farmTab = page.locator('header button').filter({ hasText: '🌱' }).first();
  await farmTab.click();
  await expect(page.locator('.farm-grid-perspective')).toBeVisible();
}

async function switchLanguageToEnglish(page: import('@playwright/test').Page) {
  const settingsButton = page.getByRole('button', { name: /settings|设置/i });
  await settingsButton.click();

  const settingsPanel = page.locator('.settings-scrollbar').first();
  await expect(settingsPanel).toBeVisible();

  await settingsPanel.getByRole('button', { name: /中文/ }).click();
  await page.getByRole('button', { name: /English/ }).click();

  await expect(page.getByRole('button', { name: /🌱\s*Plots/ })).toBeVisible();
}

test.describe('Farm vitality AC coverage', () => {
  test.beforeEach(async ({ page }) => {
    await seedDebugState(page);
  });

  test('desktop: growing plot shows full time text + boost hint + sway animation', async ({ page }, testInfo) => {
    if (testInfo.project.name !== 'desktop') {
      test.skip();
      return;
    }

    await goToFarm(page);

    const growingPlot = page.locator('.farm-grid-perspective > div').first();

    await expect(growingPlot.getByText(/已生长/)).toBeVisible();
    await expect(growingPlot.getByText(/共需/)).toBeVisible();
    await expect(growingPlot.getByText(/专注可加速生长/)).toBeVisible();

    const animation = await growingPlot.locator('span').first().evaluate((el) => (el as HTMLElement).style.animation);
    expect(animation).toContain('plantSway');
  });

  test('mobile: growing plot shows compact time text + boost hint + sway animation', async ({ page }, testInfo) => {
    if (!testInfo.project.name.startsWith('mobile')) {
      test.skip();
      return;
    }

    await goToFarm(page);

    const growingPlot = page.locator('.farm-grid-perspective > div').first();

    await expect(growingPlot.getByText(/\d+%\s*·\s*还需/)).toBeVisible();
    await expect(growingPlot.getByText(/专注可加速生长/)).toBeVisible();

    const animation = await growingPlot.locator('span').first().evaluate((el) => (el as HTMLElement).style.animation);
    expect(animation).toContain('plantSway');
  });

  test('farm page has help button and shows rules modal content', async ({ page }, testInfo) => {
    if (testInfo.project.name !== 'desktop') {
      test.skip();
      return;
    }

    await goToFarm(page);

    const helpButton = page.getByRole('button', { name: '🌱 农场规则' });
    await expect(helpButton).toBeVisible();
    await helpButton.click();

    await expect(page.getByRole('heading', { name: '🌱 农场规则' })).toBeVisible();
    await expect(page.getByText(/🌱\s*种植：/)).toBeVisible();
    await expect(page.getByText(/⏱️\s*生长：/)).toBeVisible();
    await expect(page.getByText(/🍉\s*收获：/)).toBeVisible();
    await expect(page.getByText(/💀\s*枯萎：/)).toBeVisible();
    await expect(page.getByText(/🔓\s*解锁：/)).toBeVisible();
  });

  test('i18n: switching language updates farm help copy', async ({ page }, testInfo) => {
    if (testInfo.project.name !== 'desktop') {
      test.skip();
      return;
    }

    await goToFarm(page);

    await expect(page.getByRole('button', { name: /🌱\s*地块/ })).toBeVisible();
    await switchLanguageToEnglish(page);

    await expect(page.getByRole('button', { name: /🌱\s*Plots/ })).toBeVisible();

    const helpButton = page.getByRole('button', { name: '🌱 Farm Rules' });
    await expect(helpButton).toBeVisible();
    await helpButton.click();

    await expect(page.getByRole('heading', { name: '🌱 Farm Rules' })).toBeVisible();
    await expect(page.getByText(/🌱\s*Plant:/)).toBeVisible();
    await expect(page.getByText(/🌱\s*种植：/)).toHaveCount(0);
  });
});
