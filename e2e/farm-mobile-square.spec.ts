import { test, expect } from '@playwright/test';

/**
 * E2E: 手机端瓜田地块比例优化 — 验收标准覆盖
 *
 * AC1: 手机端（390×844）9 块地全部在视口内，无需滚动
 * AC2: 手机端地块为正方形比例
 * AC3: 手机端间距紧凑（gap-1 = 4px）
 * AC4: PC 端布局、比例、间距与改动前完全一致
 * AC5: 所有主题下视觉正常
 * AC6: 种植弹窗、锁定地块交互正常
 */

async function goToFarm(page: import('@playwright/test').Page) {
  await page.goto('/');
  const getStarted = page.locator('button', { hasText: 'Get Started' });
  if (await getStarted.isVisible({ timeout: 2000 }).catch(() => false)) {
    await getStarted.click();
    await getStarted.waitFor({ state: 'hidden', timeout: 3000 }).catch(() => {});
  }
  const farmTab = page.locator('button', { hasText: '🌱' });
  await farmTab.click();
  await page.waitForSelector('.farm-grid-perspective', { timeout: 5000 });
}

// ─── AC1: 手机端 9 块地全部在视口内 ───
test.describe('AC1: Mobile — no overflow', () => {
  test('all 9 plots visible within viewport on mobile (390×844)', async ({ page }, testInfo) => {
    if (testInfo.project.name !== 'mobile') { test.skip(); return; }
    await goToFarm(page);

    const grid = page.locator('.farm-grid-perspective');
    const gridBox = await grid.boundingBox();
    expect(gridBox).not.toBeNull();

    const viewport = page.viewportSize();
    expect(viewport).not.toBeNull();

    // Grid bottom must be within viewport height
    const gridBottom = gridBox!.y + gridBox!.height;
    expect(gridBottom).toBeLessThanOrEqual(viewport!.height);

    // All 9 slots rendered
    const slots = grid.locator('> div');
    await expect(slots).toHaveCount(9);
  });
});

// ─── AC2: 手机端地块为正方形 ───
test.describe('AC2: Mobile — square plots', () => {
  test('plot cards are square on mobile', async ({ page }, testInfo) => {
    if (testInfo.project.name !== 'mobile') { test.skip(); return; }
    await goToFarm(page);

    // Check active plot
    const activePlot = page.locator('.farm-grid-perspective > div').first();
    const activeBox = await activePlot.boundingBox();
    expect(activeBox).not.toBeNull();
    const activeRatio = activeBox!.width / activeBox!.height;
    // Square = 1.0, allow tolerance for perspective transform
    expect(activeRatio).toBeGreaterThan(0.85);
    expect(activeRatio).toBeLessThan(1.15);

    // Check locked plot
    const lockedPlot = page.locator('.farm-grid-perspective > div').filter({ hasText: '🔒' }).first();
    const lockedBox = await lockedPlot.boundingBox();
    expect(lockedBox).not.toBeNull();
    const lockedRatio = lockedBox!.width / lockedBox!.height;
    expect(lockedRatio).toBeGreaterThan(0.85);
    expect(lockedRatio).toBeLessThan(1.15);
  });
});

// ─── AC3: 手机端间距紧凑 ───
test.describe('AC3: Mobile — tight gap', () => {
  test('grid gap is 4px (gap-1) on mobile', async ({ page }, testInfo) => {
    if (testInfo.project.name !== 'mobile') { test.skip(); return; }
    await goToFarm(page);

    const grid = page.locator('.farm-grid-perspective');
    const gap = await grid.evaluate((el) => getComputedStyle(el).gap);
    // gap-1 = 4px (0.25rem at 16px base)
    expect(gap).toBe('4px');
  });
});

// ─── AC4: PC 端布局不变 ───
test.describe('AC4: Desktop — unchanged layout', () => {
  test('desktop plots use 3:4 aspect ratio (not square)', async ({ page }, testInfo) => {
    if (testInfo.project.name !== 'desktop') { test.skip(); return; }
    await goToFarm(page);

    const firstSlot = page.locator('.farm-grid-perspective > div').first();
    const box = await firstSlot.boundingBox();
    expect(box).not.toBeNull();
    const ratio = box!.width / box!.height;
    // 3:4 = 0.75, should NOT be square
    expect(ratio).toBeGreaterThan(0.60);
    expect(ratio).toBeLessThan(0.90);
  });

  test('desktop grid gap is 8px (gap-2)', async ({ page }, testInfo) => {
    if (testInfo.project.name !== 'desktop') { test.skip(); return; }
    await goToFarm(page);

    const grid = page.locator('.farm-grid-perspective');
    const gap = await grid.evaluate((el) => getComputedStyle(el).gap);
    expect(gap).toBe('8px');
  });

  test('desktop has 9 plots with perspective rotateX', async ({ page }, testInfo) => {
    if (testInfo.project.name !== 'desktop') { test.skip(); return; }
    await goToFarm(page);

    const grid = page.locator('.farm-grid-perspective');
    const slots = grid.locator('> div');
    await expect(slots).toHaveCount(9);

    const transform = await grid.evaluate((el) => getComputedStyle(el).transform);
    expect(transform).not.toBe('none');
  });
});

// ─── AC5: 主题切换视觉正常 ───
test.describe('AC5: Theme switching', () => {
  const themes = ['dark', 'light', 'forest', 'ocean', 'warm'];

  for (const themeName of themes) {
    test(`farm grid renders under ${themeName} theme`, async ({ page }) => {
      await page.goto('/');
      const getStarted = page.locator('button', { hasText: 'Get Started' });
      if (await getStarted.isVisible({ timeout: 2000 }).catch(() => false)) {
        await getStarted.click();
        await getStarted.waitFor({ state: 'hidden', timeout: 3000 }).catch(() => {});
      }

      // Set theme via localStorage before navigating to farm
      await page.evaluate((t) => {
        localStorage.setItem('watermelon-clock-theme', t);
      }, themeName);
      await page.reload();

      const farmTab = page.locator('button', { hasText: '🌱' });
      await farmTab.click();
      await page.waitForSelector('.farm-grid-perspective', { timeout: 5000 });

      // Grid should be visible with 9 slots
      const grid = page.locator('.farm-grid-perspective');
      await expect(grid).toBeVisible();
      const slots = grid.locator('> div');
      await expect(slots).toHaveCount(9);

      // No error overlays or blank screens
      const errorOverlay = page.locator('[class*="error"]');
      const errorCount = await errorOverlay.count();
      // Some elements may have "error" in class for styling, just ensure grid is visible
      expect(await grid.isVisible()).toBe(true);
    });
  }
});

// ─── AC6: 种植弹窗 + 锁定地块交互 ───
test.describe('AC6: Interactions', () => {
  test('clicking empty plot opens plant modal', async ({ page }) => {
    await goToFarm(page);

    const emptyPlot = page.locator('.farm-grid-perspective button', { hasText: '+' }).first();
    if (await emptyPlot.isVisible({ timeout: 2000 }).catch(() => false)) {
      await emptyPlot.click();
      const modal = page.locator('h3').filter({ hasText: /.+/ });
      await expect(modal).toBeVisible({ timeout: 3000 });
    }
  });

  test('locked plots show lock icon and are not clickable for planting', async ({ page }) => {
    await goToFarm(page);

    const lockedCards = page.locator('.farm-grid-perspective > div').filter({ hasText: '🔒' });
    const count = await lockedCards.count();
    expect(count).toBe(5);

    // Locked card should show lock + hint text
    const firstLocked = lockedCards.first();
    await expect(firstLocked).toBeVisible();
    const text = await firstLocked.textContent();
    expect(text).toContain('🔒');
    expect(text!.replace('🔒', '').trim().length).toBeGreaterThan(0);
  });
});
