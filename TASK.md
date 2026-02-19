# 当前任务：Phase 4 Step 2 — 买道具 + 地块购买
派发时间：2026-02-19 13:37
优先级：P0
背景：Phase 4 Step 1（瓜币+商城+卖瓜 v0.29.0）验收通过，继续完善商城买入侧。
目标：商城买 Tab 上线常驻商品 + 地块购买 + 道具背包

## 子任务
- [ ] ① 常驻商品数据：14 种道具录入（名称/价格/效果/图标），按 MARKET-DESIGN-v1.md 和 ENCYCLOPEDIA-v1.md
- [ ] ② 买 Tab UI：商品列表展示（图标+名称+价格）、点击购买确认弹窗（显示价格+当前余额）、购买成功动画、余额不足按钮置灰+提示
- [ ] ③ 道具背包存储：购买后道具入背包（useShedStorage 扩展）、道具数量显示
- [ ] ④ 地块购买：商城内购买地块（200/500/1000/2000/5000 瓜币，第5-9块）、与里程碑解锁取先到的、已解锁地块不重复购买
- [ ] ⑤ i18n 8 语言覆盖所有新增文案
- [ ] ⑥ E2E 测试 + 版本号 v0.30.0 + 四文档同步

## 验收标准
- 14 种常驻商品在买 Tab 正确展示（E2E）
- 购买道具后瓜币减少、道具出现在背包（E2E）
- 余额不足时无法购买，按钮置灰（E2E）
- 地块购买后立即可用（E2E）
- 已通过里程碑解锁的地块不显示购买选项（E2E）
- 购买确认弹窗显示正确信息（E2E）
- i18n 8 语言无遗漏（E2E）
- package.json v0.30.0 + DEVLOG/CHANGELOG/PRODUCT/README 同步

## 相关文件
- docs/MARKET-DESIGN-v1.md（商城设计，常驻商品+地块价格）
- docs/ENCYCLOPEDIA-v1.md（道具图鉴，14 种道具详情）
- src/components/MarketPage.tsx（商城页面，Step 1 已搭框架）
- src/hooks/useMelonCoin.ts（瓜币 hook）
- src/hooks/useShedStorage.ts（仓库存储）

## 阻塞
（无）
