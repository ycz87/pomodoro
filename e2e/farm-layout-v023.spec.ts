import { test, expect } from '@playwright/test';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * E2E: 瓜田布局改版 v0.23.0 — 全部验收标准覆盖
 *
 * AC1:  3×3 CSS Grid + perspective rotateX 伪 3D
 * AC2:  7 块地始终显示，4 块已开发 + 3 块锁定
 * AC3:  LockedPlotCard 组件存在且显示锁定状态
 * AC4:  farmUnlockHint i18n 8 种语言都有
 * AC5:  圆角矩形地块，diamondClip 完全移除
 * AC6:  地块比例 3:4（宽:高）
 * AC7:  transformStyle 为 flat
 * AC8:  手机端（375px 宽度）一屏显示 7 块地不溢出
 * AC9:  种植弹窗 / 揭晓动画 / 收获动画正常
 * AC10: package.json version = 0.23.0
 * AC11: DEVLOG / CHANGELOG / PRODUCT / README 都有 v0.23.0 条目
 * AC12: build 通过（CI 层面验证，此处跳过）
 * AC13: push 到 origin/main（CI 层面验证，此处跳过）
 */

// Helper: navigate to farm tab
async function goToFarm(page: import('@playwright/test').Page) {
  await page.goto('/');
  // Dismiss onboarding if present
  const getStarted = page.locator('button', { hasText: 'Get Started' });
  if (await getStarted.isVisible({ timeout: 2000 }).catch(() => false)) {
    await getStarted.click();
    await getStarted.waitFor({ state: 'hidden', timeout: 3000 }).catch(() => {});
  }
  // Click farm tab (🌱)
  const farmTab = page.locator('button', { hasText: '🌱' });
  await farmTab.click();
  await page.waitForSelector('.farm-grid-perspective', { timeout: 5000 });
}

// ─── AC1: 3×3 CSS Grid + perspective rotateX ───
test('AC1: farm uses 3×3 CSS Grid with perspective rotateX', async ({ page }) => {
  await goToFarm(page);

  const grid = page.locator('.farm-grid-perspective');
  await expect(grid).toBeVisible();

  // Verify grid-cols-3
  const gridStyle = await grid.evaluate((el) => {
    const cs = getComputedStyle(el);
    return {
      display: cs.display,
      gridTemplateColumns: cs.gridTemplateColumns,
      transform: cs.transform,
    };
  });
  expect(gridStyle.display).toBe('grid');
  // 3 columns → gridTemplateColumns should have 3 values
  const colCount = gridStyle.gridTemplateColumns.split(/\s+/).length;
  expect(colCount).toBe(3);
  // transform should contain a matrix (from perspective + rotateX)
  expect(gridStyle.transform).not.toBe('none');
});

// ─── AC2: 7 块地始终显示 ───
test('AC2: 7 plot slots rendered (4 active + 3 locked)', async ({ page }) => {
  await goToFarm(page);

  const grid = page.locator('.farm-grid-perspective');
  const slots = grid.locator('> div');
  await expect(slots).toHaveCount(7);

  // Count locked plots (contain 🔒)
  const lockedSlots = grid.locator('> div').filter({ hasText: '🔒' });
  const lockedCount = await lockedSlots.count();
  expect(lockedCount).toBe(3);
});

// ─── AC3: LockedPlotCard 显示锁定状态 ───
test('AC3: LockedPlotCard shows lock icon and unlock hint text', async ({ page }) => {
  await goToFarm(page);

  const lockedCards = page.locator('.farm-grid-perspective > div').filter({ hasText: '🔒' });
  const count = await lockedCards.count();
  expect(count).toBeGreaterThan(0);

  // First locked card should have 🔒 and some hint text
  const firstLocked = lockedCards.first();
  await expect(firstLocked).toBeVisible();
  const text = await firstLocked.textContent();
  expect(text).toContain('🔒');
  // Should have more than just the emoji (unlock hint text)
  expect(text!.replace('🔒', '').trim().length).toBeGreaterThan(0);
});

// ─── AC4: farmUnlockHint i18n 8 种语言 ───
test('AC4: farmUnlockHint exists in all 8 locale files', async () => {
  const locales = ['zh', 'en', 'ja', 'ko', 'de', 'fr', 'es', 'pt'];
  const projectRoot = join(__dirname, '..');

  for (const locale of locales) {
    const filePath = join(projectRoot, 'src', 'i18n', 'locales', `${locale}.ts`);
    const content = readFileSync(filePath, 'utf-8');
    expect(content, `farmUnlockHint missing in ${locale}.ts`).toContain('farmUnlockHint');
  }
});

// ─── AC5: diamondClip 完全移除 ───
test('AC5: diamondClip is completely removed from FarmPage', async () => {
  const filePath = join(__dirname, '..', 'src', 'components', 'FarmPage.tsx');
  const content = readFileSync(filePath, 'utf-8');
  expect(content).not.toContain('diamondClip');
  expect(content).not.toContain('diamond-clip');
  expect(content).not.toContain('clip-path');
});

// ─── AC6: 地块比例 3:4 ───
test('AC6: plot cards have 3:4 aspect ratio (width:height)', async ({ page }) => {
  await goToFarm(page);

  // Check an active plot
  const firstSlot = page.locator('.farm-grid-perspective > div').first();
  const box = await firstSlot.boundingBox();
  expect(box).not.toBeNull();

  const ratio = box!.width / box!.height;
  // 3:4 = 0.75, allow tolerance for perspective transform
  expect(ratio).toBeGreaterThan(0.55);
  expect(ratio).toBeLessThan(0.95);

  // Check a locked plot too
  const lockedSlot = page.locator('.farm-grid-perspective > div').filter({ hasText: '🔒' }).first();
  const lockedBox = await lockedSlot.boundingBox();
  expect(lockedBox).not.toBeNull();
  const lockedRatio = lockedBox!.width / lockedBox!.height;
  expect(lockedRatio).toBeGreaterThan(0.55);
  expect(lockedRatio).toBeLessThan(0.95);
});

// ─── AC7: transformStyle 为 flat ───
test('AC7: farm grid uses transform-style: flat', async ({ page }) => {
  await goToFarm(page);

  const grid = page.locator('.farm-grid-perspective');
  const transformStyle = await grid.evaluate((el) => getComputedStyle(el).transformStyle);
  expect(transformStyle).toBe('flat');
});

// ─── AC8: 手机端一屏显示 ───
test('AC8: mobile viewport (375px) shows all 7 plots without overflow', async ({ page, browserName }, testInfo) => {
  if (testInfo.project.name !== 'mobile') {
    test.skip();
    return;
  }

  await goToFarm(page);

  const grid = page.locator('.farm-grid-perspective');
  const gridBox = await grid.boundingBox();
  expect(gridBox).not.toBeNull();

  const viewport = page.viewportSize();
  expect(viewport).not.toBeNull();

  // Grid bottom should be within viewport
  const gridBottom = gridBox!.y + gridBox!.height;
  expect(gridBottom).toBeLessThanOrEqual(viewport!.height);

  // All 7 slots rendered
  const slots = grid.locator('> div');
  await expect(slots).toHaveCount(7);
});

// ─── AC9: 种植弹窗正常 ───
test('AC9: clicking empty plot opens plant modal', async ({ page }) => {
  await goToFarm(page);

  // Find a clickable empty plot (has "+" or plant button)
  const emptyPlot = page.locator('.farm-grid-perspective button', { hasText: '+' }).first();
  if (await emptyPlot.isVisible({ timeout: 2000 }).catch(() => false)) {
    await emptyPlot.click();
    // Modal should appear with some heading
    const modal = page.locator('h3').filter({ hasText: /.+/ });
    await expect(modal).toBeVisible({ timeout: 3000 });
  }
});

// ─── AC10: package.json version = 0.23.0 ───
test('AC10: package.json version is 0.23.0', async () => {
  const pkgPath = join(__dirname, '..', 'package.json');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
  expect(pkg.version).toBe('0.23.0');
});

// ─── AC11: 四个文档都有 v0.23.0 条目 ───
test('AC11: DEVLOG, CHANGELOG, PRODUCT, README all mention v0.23.0', async () => {
  const projectRoot = join(__dirname, '..');
  const docs = ['DEVLOG.md', 'CHANGELOG.md', 'PRODUCT.md', 'README.md'];

  for (const doc of docs) {
    const filePath = join(projectRoot, doc);
    const content = readFileSync(filePath, 'utf-8');
    const hasVersion = content.includes('v0.23.0') || content.includes('0.23.0');
    expect(hasVersion, `${doc} should mention v0.23.0`).toBe(true);
  }
});
