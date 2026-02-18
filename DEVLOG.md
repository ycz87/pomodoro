# 🍉 西瓜时钟 — 开发日志

---

## v0.24.1 — 农场体验优化（2026-02-18）

### 背景
农场 growing 地块缺乏生命力感，用户无法直观了解生长进度和规则。

### 改动

| 文件 | 变更 |
|------|------|
| `src/components/FarmPage.tsx` | 新增时间显示（PC完整/手机精简）、加速提示、摇摆动画、FarmHelpModal 组件 |
| `src/i18n/types.ts` | 新增 10 个 i18n key（farmGrowthTime/farmRemainingTime/farmFocusBoostHint/farmHelp*/formatDuration） |
| `src/i18n/locales/*.ts` | 8 种语言全部补齐新增 key |
| `e2e/farm-vitality.spec.ts` | 新建，5 条 E2E 测试覆盖全部 AC |

### 功能清单
- 进度可视化：Growing 地块显示「已生长 XX / 共需 XX」，手机端精简为「32% · 还需 XX」
- 加速提示：进度 < 50% 显示「专注可加速生长 ⚡」
- 生命力动画：植物 Emoji 微风摇摆（plantSwaySm/Md/Lg），不同阶段幅度递减
- 规则弹窗：ℹ️ 按钮入口，涵盖种植/生长/收获/枯萎/解锁五条规则
- i18n：8 种语言完整覆盖

### 测试
- 5 passed / 7 skipped（viewport 自动跳过不相关端）

---

## v0.24.0 — Debug Toolbar 调试工具栏（2026-02-18）

### 背景
Charles 需要一个隐藏的调试工具栏替代之前 Settings 里的 Test Mode，方便快速测试各模块功能。

### 改动

| 文件 | 变更 |
|------|------|
| `src/components/DebugToolbar.tsx` | 新建，底部固定半透明可折叠面板，5 个功能区 |
| `src/components/Settings.tsx` | 移除 testMode prop，新增版本号 7 连击激活逻辑 |
| `src/App.tsx` | 集成 DebugToolbar，管理 debugMode/timeMultiplier 状态 |
| `src/hooks/useFarmStorage.ts` | 暴露 setFarm setter 供调试直接操作 |
| `e2e/debug-toolbar.spec.ts` | 12 条 E2E 测试覆盖全部功能 |

### 功能清单
- 瓜棚道具：添加各阶段物品 + 清空
- 农场：立即成熟 / +3/5/10 品种 / 重置
- 专注：快速完成计时器
- 时间倍率：1x~100x 加速农场生长
- 数据：重置所有 localStorage

### 测试
- 12 passed（mobile + mobile-wide + desktop × 4 用例）

---

## v0.23.3 — 手机端裁切彻底修复（2026-02-18）

### 背景
v0.23.2 的 `calc(100%-36px)` 固定补偿在 500px 视口下仍溢出 3px，改用百分比约束。

### 改动
1. **max-width 百分比** — `max-w-[calc(100%-36px)]` → `max-w-[90%]`，任何视口宽度都有足够余量
2. **E2E 测试** — 新增 mobile-wide（500×900）测试项目，AC7 在 390px 和 500px 视口都验证通过

### 影响范围
- 修改：src/components/FarmPage.tsx（1 处 class）
- 修改：playwright.config.ts（+mobile-wide project）
- 修改：e2e/farm-mobile-square.spec.ts（AC7 支持 mobile-wide）

---

## v0.23.2 — 手机端底部地块左右裁切修复（2026-02-18）

### 背景
Charles 反馈手机竖屏下底部第三行地块左右被裁切，原因是 perspective + rotateX 让底部行视觉变宽超出视口。

### 改动
1. **grid 容器内边距** — 新增 `px-2 sm:px-0`，手机端额外 8px 两侧留白
2. **overflow-visible** — 外层容器确保不裁切
3. **E2E 测试** — 新增 AC7 验证底部行 3 块地左右边界在视口内

### 影响范围
- 修改：src/components/FarmPage.tsx（2 处 class 调整）
- 修改：e2e/farm-mobile-square.spec.ts（+1 测试用例）

---

## v0.23.1 — 手机端地块比例优化（2026-02-18）

### 背景
Charles 反馈手机端农场页面底部三块地溢出屏幕，需要滚动才能看到。

### 改动
1. **手机端地块比例** — aspect-[3/4] → aspect-square（<640px 正方形，≥640px 保持 3:4）
2. **手机端间距** — gap-1.5 → gap-1（4px）
3. **容器 padding 收紧** — pb-4→pb-2, mb-3→mb-2, mb-5→mb-3（仅手机端）
4. **PC 端完全不变**

### 影响范围
- 修改：src/components/FarmPage.tsx（6 处 Tailwind class 调整）
- 新增：e2e/farm-mobile-square.spec.ts（20 个 E2E 测试）

---

## v0.23.0 — 瓜田布局改版：俯视微倾斜 3×3 网格（2026-02-18）

### 背景
Charles 反馈菱形等距瓜田在竖屏下留白多、地块小，改为俯视微倾斜 3×3 网格。

### 改动
1. **布局重构** — 菱形等距 → 3×3 CSS Grid + perspective(800px) rotateX(18deg)
2. **始终 9 块地** — 已开发地块正常交互，未开发地块显示 LockedPlotCard（🔒 + 解锁条件）
3. **圆角矩形地块** — 去掉 diamondClip，改为 rounded-2xl + aspect-square
4. **i18n** — 新增 farmUnlockHint key，8 种语言

### 影响范围
- 重构：src/components/FarmPage.tsx（布局 + PlotCard + 新增 LockedPlotCard）
- 更新：src/i18n/types.ts + 8 个语言文件

---

## v0.22.0 — 农场 Phase 2 完整实现（2026-02-17）

### 背景
Phase 2 目标：从单星系扩展到五星系，重构数据层，实现等距菱形瓜田 UI，升级图鉴页面。

### 改动
1. **数据层重构** — 5 大星系（厚土/烈火/寒水/青木/玄金）+ 彩虹/暗物质预留，40 个品种完整定义（稀有度/掉率/emoji/生长时间）
2. **分钟级生长引擎** — growth.ts 实现离线生长推进，按实际经过分钟数计算生长阶段
3. **星系解锁链** — galaxy.ts 实现收集 5 个品种解锁下一星系的逻辑
4. **等距菱形瓜田** — FarmPage.tsx 伪 3D 钻石网格，CSS transform 实现等距视角
5. **图鉴星系分页** — CollectionPage 按星系展示，未解锁星系锁定
6. **品种详情弹窗** — 点击已收集品种弹出 Modal，展示故事/首次获得日期/累计收获
7. **星际旅程面板** — 整体进度条 + 各星系独立进度条，跟随主题配色
8. **i18n 全覆盖** — 40 品种名称 + 故事 + 5 个新 UI key，8 种语言

### 影响范围
- 新增：src/farm/growth.ts, src/farm/galaxy.ts
- 重构：src/types/farm.ts（品种/星系/地块完整定义）
- 重构：src/components/FarmPage.tsx（等距瓜田）
- 重构：src/components/CollectionPage.tsx（星系分页 + 详情弹窗 + 星际旅程）
- 更新：src/i18n/types.ts + 8 个语言文件

---

## v0.21.5 — 瓜棚 Tab 改版（2026-02-16）

### 背景
Charles 反馈瓜棚内容太多太乱，需要用 tab 分类整理。

### 改动
1. **WarehousePage 双 Tab** — 新增 `shed` / `backpack` 状态切换，iOS Segmented Control 风格滑块动画
2. **🍉 瓜棚 Tab（默认）** — 收获物网格（6 种）+ 合成区 + 切瓜区（大西瓜/金西瓜），一条龙流程
3. **🎒 背包 Tab** — 种子区（普通/史诗/传说 + 去农场按钮）+ 道具区（3×N 网格 + 点击风味文案）
4. **Stats & Toast** — 移到 tab 外部共享，两个 tab 都能看到统计
5. **i18n** — `warehouseTabShed` / `warehouseTabBackpack` 两个 key，8 种语言全覆盖
6. **Bug 修复** — tab 切换时清除 flavorTooltip 状态

### 影响范围
- `src/components/WarehousePage.tsx`（核心重构）
- `src/i18n/types.ts` + 8 个语言文件
- `package.json`

---

## v0.21.4 — 切瓜系统 4 bug 修复（2026-02-16）

P0 修复，Charles 手机端测试发现的 4 个问题：

1. **切瓜按钮不显眼** → WarehousePage 按钮改为实色大按钮（红色/金色），加 boxShadow
2. **切瓜场景西瓜显示** → ready 阶段用 SVG 画完整圆形西瓜（绿色条纹/金色条纹），split 阶段才用 🍉 emoji 表示切开的两半
3. **切开过程不隆重** → 加屏幕闪白（flashFade）+ CSS shake + 刀光加粗加 glow + 粒子数量翻倍（45/70）+ 粒子尺寸加大 + 金西瓜金光爆发 + split 延迟 200→400ms + 分离动画 0.5→0.8s
4. **结果卡片按钮无反应（严重）** → 根因：容器 onMouseDown/onMouseUp 在 result 阶段仍活跃，吃掉了按钮点击。修复：所有 touch/mouse handler 加 `if (phase !== 'ready') return` 守卫 + 结果卡片 div 加 stopPropagation

---

## v0.21.3 — 修复移动端切瓜 pull-to-refresh（2026-02-16）

### 背景
手机端从上往下滑动切瓜时，浏览器 pull-to-refresh 被触发导致页面刷新（P0 bug）。

### 改动
1. **SlicingScene** — 组件挂载时设置 `document.body.style.overscrollBehavior = 'none'`，卸载时恢复原值
2. **容器样式** — 全屏容器添加 `touchAction: 'none'` + `overscrollBehavior: 'none'`
3. **触摸事件** — `touchstart`/`touchmove`/`touchend` 均调用 `e.preventDefault()` 阻止默认滚动行为

### 影响范围
- `src/components/SlicingScene.tsx`

---

## v0.21.2 — 农场动画与细节打磨（2026-02-16）

### 背景
FarmPage 的交互已经可用，但揭晓/收获反馈层级不足，尤其新品种和高稀有度的视觉差异不够明显。本次聚焦 FarmPage 细节体验升级，强化反馈辨识度。

### 改动
1. **RevealOverlay（品种揭晓）** — rare 及以上稀有度新增旋转光带与粒子环，强化文本发光与阴影；入场动画改为更长且更弹性的节奏
2. **HarvestOverlay（收获动画）** — 新品种与重复品种彻底分流：  
   新品种为全屏烟花粒子 + 光束 + `NEW` 闪烁徽记；重复品种简化背景并展示 `已收集 ×N`
3. **PlotCard 进度条** — 保留稀有度颜色，新增发光效果（box-shadow）；epic / legendary 加入流动高光动画
4. **数据与文案** — `harvestPlot` 返回 `collectedCount`，用于重复收获提示；i18n 新增 `farmNewFlash`（8 语言）

### 文件变更
- 修改 `src/components/FarmPage.tsx` — 三块动画与进度条视觉升级
- 修改 `src/hooks/useFarmStorage.ts` — 收获返回 `collectedCount`
- 修改 `src/i18n/types.ts` — 新增 `farmNewFlash`
- 修改 `src/i18n/locales/{zh,en,ja,ko,es,fr,de,pt}.ts` — 新增 `farmNewFlash` 文案
- 修改 `package.json` — 版本号 `0.21.1` → `0.21.2`

---

## v0.21.1 — 连切 Combo + 保底机制（2026-02-16）

### 背景
Phase 1 切瓜系统验收通过后，Phase 2 增强体验：连切 Combo 奖励和种子保底机制。

### 改动
1. **种子品质系统** — `SeedQuality: 'normal' | 'epic' | 'legendary'`，种子存储从 `number` 改为 `SeedCounts { normal, epic, legendary }`，兼容旧数据迁移
2. **保底机制** — `PityCounter { epicPity, legendaryPity }` 追踪连续未出高品质种子次数，30 瓜必出 epic，80 瓜必出 legendary
3. **Combo 系统** — App.tsx 维护 `comboCount` 状态，3 连+1 种子，5 连必出 legendary 种子
4. **SlicingScene 增强** — Combo 计数器 UI、里程碑特效（"切瓜达人"/"瓜神降临"）、"继续切下一个"按钮
5. **瓜棚种子区** — 按品质分行显示（普通🌰/史诗💎/传说🌟），带颜色标识
6. **i18n** — 8 种语言新增 combo/品质/继续切瓜文案

### 文件变更
- 修改 `src/types/slicing.ts` — 新增 SeedQuality, SeedCounts, PityCounter, SlicingResult.comboBonus
- 修改 `src/slicing/engine.ts` — 保底逻辑 + combo 奖励 + updatePity 导出
- 修改 `src/hooks/useShedStorage.ts` — 适配新存储结构 + 迁移函数
- 修改 `src/components/SlicingScene.tsx` — combo UI + 继续切瓜
- 修改 `src/components/WarehousePage.tsx` — 种子按品质显示
- 修改 `src/App.tsx` — combo 状态管理 + pity 更新
- 修改 `src/i18n/` 全部 locale 文件

---

## v0.21.0 — 切瓜系统 MVP（2026-02-16）

### 背景
切瓜是连接瓜棚（资源中心）和农场（养成中心）的核心环节。用户专注获得大西瓜后，需要通过切瓜获得种子和道具。

### 改动
1. **切瓜基础层** — 新增 `src/types/slicing.ts` (类型), `src/hooks/useShedStorage.ts` (本地存储), `src/slicing/engine.ts` (掉落逻辑)
2. **全屏切瓜场景** — 新增 `src/components/SlicingScene.tsx`。实现触摸/滑动切割交互、CSS 裂开动画、粒子系统模拟汁水飞溅、物理弹跳动画展示掉落物
3. **音效系统** — 新增 `src/slicing/audio.ts`。使用 Web Audio API 纯代码合成切割声、飞溅声和稀有掉落铃声，无需加载外部音频
4. **瓜棚 UI 重构** — 修改 `src/components/WarehousePage.tsx`。布局重构，加入切瓜、种子展示、道具网格及道具风味文案 Tooltip
5. **App 调度** — 在 `App.tsx` 中整合 hooks 和组件，管理切瓜状态流转

### 文件变更
- 新增 `src/types/slicing.ts`
- 新增 `src/hooks/useShedStorage.ts`
- 新增 `src/slicing/engine.ts`
- 新增 `src/slicing/audio.ts`
- 新增 `src/components/SlicingScene.tsx`
- 修改 `src/components/WarehousePage.tsx`
- 修改 `src/App.tsx`
- 修改 `src/hooks/useWarehouse.ts`
- 修改 `src/i18n/` 下所有 locale 文件

---

## v0.20.2 — 庆祝效果增强（2026-02-16）

### 背景
Charles 反馈庆祝效果太短太小，看不清就消失了。需要增强视觉冲击力和持续时间。

### 改动
STAGE_CONFIG 全面调整：
- **时长加倍：** seed 3.5→5s, sprout 4→6s, bloom 4.5→7s, green 5→8.5s, ripe 6→10s, legendary 8→14s
- **图标放大：** seed 80→100, sprout 88→110, bloom 96→130, green 108→150, ripe 120→160, legendary 130→180
- **粒子翻倍：** seed 18→36, sprout 28→56, bloom 40→80, green 55→110, ripe 80→160, legendary 100→200
- **光晕增强：** 每阶段 glowLayers +2, glowIntensity 提升（seed 0.7, sprout 0.8, bloom 0.9, green/ripe/legendary 1.0）

### 文件变更
- 修改 `src/components/CelebrationOverlay.tsx` — STAGE_CONFIG 数值调整

---

## v0.20.1 — 徽章显示修复（2026-02-16）

### 背景
v0.20.0 接入徽章图片后，BadgeIcon 容器使用 `rounded-full overflow-hidden` 导致非圆形徽章（六边形、盾牌、星形、方形圆角）边角被裁切。同时已解锁容器的 `boxShadow` 在深色主题下呈现黑色方块背景。

### 改动
1. **移除圆形裁切** — 已解锁和未解锁图片容器去掉 `rounded-full` + `overflow-hidden`，图片用 `object-contain` 自适应透明背景 PNG 的原始形状
2. **移除 boxShadow** — 已解锁容器去掉 `boxShadow`，背景完全透明
3. **保留圆形背景** — 隐藏系列未解锁 ❓ 和无图片 fallback 🔒 保持圆形样式

### 文件变更
- 修改 `src/components/AchievementsPage.tsx` — BadgeIcon 容器样式

---

## v0.20.0 — 徽章图片接入成就页面（2026-02-16）

### 背景
成就页面之前使用 emoji 占位，44 张 AI 生成的徽章 PNG（512×512 透明背景）已在 `docs/badges/` 就绪，需要接入到成就页面。

### 改动
1. **图片资源** — 44 张 PNG 从 `docs/badges/` 复制到 `public/badges/`，通过 URL 加载（不 inline 进 JS bundle）
2. **映射文件** — 新增 `src/achievements/badges.ts`，建立 achievement id → 图片文件名映射 + `getBadgeUrl()` 函数
3. **BadgeIcon 组件** — 已解锁显示真实图片（带系列色 glow）；未解锁非隐藏显示灰色图片（`grayscale(1) opacity(0.4)`）；未解锁隐藏显示 ❓；图片加载失败 fallback 到 emoji
4. **庆祝弹窗** — `AchievementCelebration.tsx` 灰→彩色动画也使用真实图片 + fallback
5. **详情弹窗** — 96px 大尺寸徽章图片

### 文件变更
- 新增 `public/badges/` — 44 张 PNG
- 新增 `src/achievements/badges.ts` — ID→文件名映射
- 修改 `src/components/AchievementsPage.tsx` — BadgeIcon 图片渲染
- 修改 `src/components/AchievementCelebration.tsx` — 庆祝弹窗图片渲染
- 修改 `package.json` — 版本号 0.19.4 → 0.20.0

---

## v0.19.4 — 全面代码审查 + 安全修复（2026-02-15）

### 背景
Charles 要求对整个项目做一次深度代码审查，找出 bug、安全隐患、类型问题、逻辑漏洞并修复。

### 发现的问题与修复

#### P1 安全修复
1. **OAuth CSRF 防护** — Google/Microsoft OAuth 的 state 参数之前生成了但 callback 没有验证，存在 CSRF 风险。现在 state 存入 KV（10 分钟 TTL），callback 时验证并删除。
2. **邮箱验证码暴力破解防护** — `/email/verify` 之前没有限制尝试次数，攻击者可暴力枚举 6 位验证码。现在每个邮箱 15 分钟内最多 5 次尝试。
3. **CORS preflight 修复** — API 和 Auth 服务的 OPTIONS 请求之前不返回 CORS headers（headers 在 `await next()` 之后设置，但 OPTIONS 路由直接返回 204）。现在在中间件中拦截 OPTIONS 请求并正确返回 CORS headers。

#### P2 安全加固
4. **Admin search LIKE 注入防护** — 管理后台搜索的 LIKE 查询没有转义 `%` 和 `_` 特殊字符，可能导致意外匹配。已添加转义。
5. **POST /records 输入校验** — 之前没有验证请求体字段，现在校验 id、task、durationMinutes、completedAt、status 的类型和范围。
6. **PUT /settings 大小限制** — 防止恶意超大 payload，限制 10KB。
7. **PUT /achievements 大小限制** — 防止恶意超大 payload，限制 50KB。

#### 审查结论（无需修复）
- TypeScript 类型安全：tsc 零错误，无 any 滥用
- SQL 注入：所有 D1 查询均使用参数化绑定
- JWT 处理：HMAC-SHA256 + 15 分钟过期 + refresh token 轮换，实现正确
- 数据同步：fire-and-forget 模式符合 local-first 设计，可接受
- 错误处理：全局 onError 不泄露内部信息，catch 块合理
- useTimer 状态机：逻辑严密，overtime 模式正确
- useProjectTimer：状态持久化和恢复逻辑完善

### 改动文件
- `auth/src/routes/auth.ts` — OAuth state 验证 + 验证码暴力破解防护
- `auth/src/index.ts` — CORS preflight 修复
- `api/src/index.ts` — CORS preflight 修复
- `api/src/routes/admin.ts` — LIKE 转义
- `api/src/routes/records.ts` — 输入校验
- `api/src/routes/settings.ts` — payload 大小限制
- `api/src/routes/achievements.ts` — payload 大小限制
- `package.json`（0.19.3 → 0.19.4）

---

## v0.19.3 — 成就数据云端同步 API（2026-02-15）

### 背景
v0.18.0 实现了成就系统的云端同步前端逻辑（useSync 中 PUT/GET /api/achievements），但后端 API 尚未实现，请求静默失败。本次补齐后端端点。

### 改动
- `api/src/db/schema.sql`：新增 `user_achievements` 表（user_id PK + achievements_json + updated_at）
- `api/src/routes/achievements.ts`：新建，GET/PUT /achievements，参考 settings.ts 模式
- `api/src/index.ts`：注册 achievements 路由
- D1 远程执行 CREATE TABLE migration
- Worker 重新部署

### 改动文件
- `api/src/db/schema.sql`
- `api/src/routes/achievements.ts`（新建）
- `api/src/index.ts`
- `package.json`（0.19.2 → 0.19.3）
- 文档同步

---

## v0.19.2 — 修复 auth 服务 FRONTEND_URL（2026-02-15）

### 背景
OAuth 登录（Google/Microsoft）回调后，auth 服务将用户重定向到 FRONTEND_URL。该值仍指向旧的 Cloudflare Pages 域名 `watermelon-clock.pages.dev`，需要更新为自定义域名 `clock.cosmelon.app`。

### 改动
- `auth/src/routes/auth.ts`：`FRONTEND_URL` 从 `https://watermelon-clock.pages.dev` 改为 `https://clock.cosmelon.app`
- auth worker 重新部署

### 改动文件
- `auth/src/routes/auth.ts`
- `package.json`（0.19.1 → 0.19.2）
- 四个文档同步

---

## v0.19.1 — UI 微调：番茄模式命名 + 移除 phase capsule（2026-02-14）

### 背景
两个小 UI 调整：模式命名对称化，以及去掉时钟上方冗余的 phase label capsule。

### 改动
- zh.ts：`modePomodoro` 从「番茄钟」改为「番茄模式」，与「项目模式」对称
- Timer.tsx：移除 phase indicator capsule（显示"🍉 专注时间"/"☕ 休息一下"的胶囊标签），清理 `phaseLabel` 变量
- 移除 capsule 后去掉 circular timer 的 `mt-4`，间距自然衔接

---

## v0.19.0 — 顶部导航栏重构：主功能 Tab + 工具图标（2026-02-14）

### 背景
顶栏从"模式切换 + 工具按钮"升级为"三个主功能 Tab + 工具图标"，为后续农场功能预留入口，瓜棚从弹窗改为内联页面。

### 改动
- App.tsx：新增 `activeTab` state（focus/warehouse/farm），顶栏中间改为三 Tab segmented control
- ModeSwitch 从顶栏下移到专注页面时钟区域上方，项目模式 setup 页也显示
- WarehousePage：新增 `inline` prop，inline 模式去掉 portal/overlay/关闭按钮
- 新建 FarmPage.tsx：农场占位页（🌱 + Coming Soon）
- 移除顶栏🏠瓜棚按钮和 showWarehouse state
- i18n：types.ts + 8 个语言文件新增 tabFocus/tabWarehouse/tabFarm/farmComingSoon
- Tab 切换在计时器运行中 disabled，选中态用 accent 色

---

## v0.18.1 — 成就按钮移至顶栏（2026-02-14）

### 背景
成就入口藏在设置面板里不够直观，移到顶栏提升可发现性。

### 改动
- App.tsx：顶栏右侧新增🏆成就按钮（w-8 h-8 rounded-full），带未读红点
- Settings.tsx：移除成就按钮及相关 props（onShowAchievements、achievementUnseenCount）
- 顶栏按钮顺序：🏠瓜棚 → 🏆成就 → 📅历史 → ⚙️设置

---

## v0.18.0 — 成就系统完整版：隐藏系列完善 + 云端同步（2026-02-14）

### 背景
Step 4（最后一步）：完善隐藏系列 X3/X5 检测 + 成就数据云端同步。

### 改动

#### X3 音效探索家
- `DetectionContext` 新增 `ambienceMixer?: AmbienceMixerConfig` 字段
- 专注完成时计算当前音效组合 hash（enabled sound ids 排序后 join）
- 更新 `soundComboDays` / `soundComboHashes`，保留最近 7 天
- 检测：7 天连续 + 7 个不同 hash → 解锁

#### X5 全能玩家
- `AchievementProgress` 新增 `dailyModules: { date: string; modules: string[] }`
- `detectAchievements` 中添加 'focus'，`detectWarehouseAchievements` 中添加 'warehouse'，`detectFarmAchievements` 中添加 'farm'
- 每天第一次操作时重置（date 不匹配时）
- 三个模块都有 → 解锁

#### 云端同步
- `useSync` 新增 `syncAchievements(data)` — PUT /api/achievements
- `pullAll()` 新增 GET /api/achievements，PullResult 新增 achievements 字段
- `migrateLocalData()` 新增可选 achievements 参数
- `useAchievements` 新增 `onSync` 回调（每次数据变化时触发）+ `mergeFromCloud` 方法
- App.tsx 中 pullAll 返回 achievements 时调用 mergeFromCloud（取解锁并集，时间取较早的）
- 后端 API 尚未实现，fire-and-forget 静默失败

---

## v0.17.2 — 农场系列成就检测预埋（2026-02-14）

### 背景
Step 3：农场功能尚未上线，先预埋 8 个农场系列成就的检测逻辑和 progress 字段，移除 comingSoon 标记。

### 改动

#### 类型扩展
- `AchievementProgress` 新增 7 个字段：totalPlants, totalFarmHarvests, alienVisits, thiefDefenses, farmActiveStreak, completedGalaxies, totalVarieties
- `DEFAULT_PROGRESS` 同步更新（默认值均为 0）
- `SERIES_CONFIG.farm` 移除 `comingSoon: true`

#### 检测逻辑
- `detection.ts` 新增 `detectFarmAchievements()` 函数
- G1: totalPlants >= 1, G2: totalFarmHarvests >= 1, G3: totalPlants >= 100
- G4: completedGalaxies >= 1, G5: totalVarieties >= 28
- G6: alienVisits >= 10, G7: thiefDefenses >= 5, G8: farmActiveStreak >= 30

#### 集成
- `useAchievements.ts` 新增 `checkFarm()` 方法（暂未调用，等农场功能上线后接入）

#### 成就定义
- `definitions.ts` 农场系列 8 个成就补全 descZh/descEn/conditionZh/conditionEn/target/progressKey

---

## v0.17.1 — 瓜棚系列成就检测（2026-02-14）

### 背景
Step 1 完成了成就页面 UI + 坚持/专注/隐藏系列检测。Step 2 实现瓜棚系列 10 个成就的检测逻辑。

### 改动

#### 类型扩展
- `AchievementProgress` 新增 6 个字段：totalSynthesis, goldenMelons, totalSlices, totalCollected, collectedStagesCount, collectedStages, collectedTools
- `DEFAULT_PROGRESS` 同步更新
- `SERIES_CONFIG.house` 移除 `comingSoon: true`

#### 检测逻辑
- `detection.ts` 新增 `detectWarehouseAchievements()` 函数
- H1-H5: 基于收获物数量/种类/金西瓜数
- H6-H7: 基于合成次数
- H8-H9: 基于切瓜次数（预埋）
- H10: 基于道具收集（预埋）

#### 集成
- `useAchievements.ts` 新增 `checkWarehouse()` 方法
- `App.tsx` 在 `resolveStageAndStore` 后触发瓜棚成就检测
- `App.tsx` 包装 synthesize/synthesizeAll 添加成就检测

#### 成就定义
- `definitions.ts` 瓜棚系列 10 个成就补全 descZh/descEn/conditionZh/conditionEn/target/progressKey

---

## v0.17.0 — 成就徽章系统（2026-02-14）

### 背景
为西瓜时钟添加成就系统，增加长期使用动力和成就感。44 个成就分 5 个系列，覆盖坚持、专注、瓜棚、农场和隐藏成就。

### 改动

#### 成就系统核心
- `src/achievements/types.ts` — 成就类型定义（系列、进度、数据结构）
- `src/achievements/definitions.ts` — 44 个成就完整定义（中英文名称、描述、解锁条件、emoji）
- `src/achievements/detection.ts` — 解锁检测逻辑（坚持 10 个 + 专注 10 个 + 隐藏 6 个）
- `src/hooks/useAchievements.ts` — 状态管理 hook（localStorage 持久化、检测触发、未读计数）

#### UI 组件
- `src/components/AchievementsPage.tsx` — 成就页面（系列分组、进度条、徽章网格、详情弹窗）
- `src/components/AchievementCelebration.tsx` — 解锁庆祝动画（灰→彩色 0.8s + 光波 + 金色粒子）

#### 集成
- `src/components/Settings.tsx` — 新增"🏆 成就"入口按钮 + 未读红点
- `src/App.tsx` — 接入 useAchievements hook，专注完成/放弃时触发检测
- `src/index.css` — 新增成就庆祝动画 CSS
- 8 种语言 i18n 文件全部新增成就相关翻译 key

---

## v0.16.0 — 多语言扩展 + 语言选择弹窗（2026-02-13）

### 背景
从中英双语扩展到 8 种语言，覆盖主要国际市场。

### 改动

#### 新增 6 种语言
- `src/i18n/locales/ja.ts` — 日语 🇯🇵
- `src/i18n/locales/ko.ts` — 韩语 🇰🇷
- `src/i18n/locales/es.ts` — 西班牙语 🇪🇸
- `src/i18n/locales/fr.ts` — 法语 🇫🇷
- `src/i18n/locales/de.ts` — 德语 🇩🇪
- `src/i18n/locales/pt.ts` — 巴西葡萄牙语 🇧🇷

每个语言文件完整实现 Messages 接口的所有 key（200+ 个），包括函数类型、readonly 数组、Record 类型。

#### i18n 系统更新
- `src/i18n/index.ts`：Locale 类型扩展为 8 种，detectLocale 支持所有新语言，默认回退改为英文
- 浏览器语言自动检测覆盖 zh/en/ja/ko/es/fr/de/pt

#### 语言选择弹窗
- 新建 `src/components/LanguagePickerModal.tsx`：弹窗列出 8 种语言（国旗 + 原名），当前选中高亮 + checkmark
- 修改 `src/components/Settings.tsx`：语言切换从两个按钮改为点击打开弹窗，显示当前语言国旗 + 名称

---

## Cloudflare Turnstile 防机器人验证（2026-02-13）

在 email send-code 端点集成 Cloudflare Turnstile 人机验证，防止滥用邮件发送。后端新增 `verifyTurnstile` 服务和 `TURNSTILE_SECRET` 环境变量；前端（西瓜时钟 + Admin）在登录面板邮箱输入下方添加 Turnstile widget，发送验证码时携带 token。当前使用 Cloudflare 测试 key，部署前需替换为真实 key。OAuth 登录不受影响。

---

## v0.15.0 — 管理后台：用户管理（2026-02-13）

### 背景
需要一个管理后台来查看和管理用户，包括用户列表、详情、禁用/启用等操作。

### 改动

#### 数据库
- `api/src/db/schema.sql`：users 表新增 `role`（'user'|'admin'）、`status`（'active'|'disabled'）、`last_active_at` 三个字段
- ALTER TABLE 语句需要手动在 D1 上执行

#### API 后端
- `api/src/middleware/auth.ts`：重构，提取 `verifyAccessToken` 和 `extractBearerToken` 为可复用函数
- `api/src/middleware/admin.ts`：新建，JWT 验证 + D1 查 role=admin
- `api/src/routes/admin.ts`：新建，3 个端点
  - `GET /api/admin/users`：分页用户列表 + 搜索
  - `GET /api/admin/users/:id`：用户详情 + 专注统计
  - `PUT /api/admin/users/:id/status`：禁用/启用用户
- `api/src/index.ts`：挂载 admin 路由，CORS 新增 admin.cosmelon.app
- `auth/src/index.ts`：CORS 新增 admin.cosmelon.app

#### Admin 前端（新建 admin/ 目录）
- React 19 + Vite 7 + Tailwind CSS 4，纯 SPA（无 PWA）
- 邮箱验证码登录（复用 auth.cosmelon.app）
- Hash router：用户列表（#/）、用户详情（#/users/:id）
- 用户列表：搜索、分页、头像/昵称/邮箱/状态
- 用户详情：基本信息 + 专注统计 + 禁用/启用操作

### 部署说明（需要 Charles 手动操作）
- D1 执行 ALTER TABLE 添加 role/status/last_active_at 字段
- api Workers 重新部署
- Cloudflare Pages 创建新项目 cosmelon-admin，绑定 admin.cosmelon.app，构建目录 admin/dist

---

## v0.14.0 — 云端数据同步（2026-02-13）

### 背景
两周冲刺 Day 5-7，用户系统已完成，实现数据云端同步让用户跨设备使用。

### 改动
- 新增 `api/src/routes/settings.ts`：GET/PUT /api/settings
- 新增 `api/src/routes/records.ts`：GET/POST/POST batch /api/records
- 新增 `api/src/routes/warehouse.ts`：GET/PUT /api/warehouse
- 更新 `api/src/index.ts`：挂载三个新路由
- 新增 `src/hooks/useSync.ts`：云端同步 hook（fire-and-forget）
- 更新 `src/App.tsx`：集成 useSync，登录后 pull/migrate，设置变更实时 push
- 更新 `src/hooks/useWarehouse.ts`：接收 onSync 回调，变更时触发同步
- API Workers 已重新部署，health 返回 v0.14.0

### 同步策略
- 本地优先：先写 localStorage，异步推云端
- 登录后拉取：云端有数据则覆盖本地，无数据则迁移本地到云端
- 未登录用户完全不受影响

---

## v0.13.0 — 个人资料编辑：头像上传 + 昵称修改（2026-02-13）

### 背景
用户登录后需要能自定义头像和昵称，提升个性化体验。

### 改动
- **R2 存储**：创建 `cosmelon-avatars` R2 bucket，auth Workers 新增 AVATARS 绑定
- **auth 新增 3 个端点**：
  - `PUT /profile`：authMiddleware 保护，更新 display_name
  - `POST /avatar`：authMiddleware 保护，接收 multipart/form-data，裁剪后存 R2，更新 avatar_url
  - `GET /avatar/:userId`：公开端点，从 R2 读取头像返回，Cache-Control 24h
- **前端 UserProfile 改造**：
  - 头像点击触发隐藏 file input，选择后 Canvas API 裁剪为 256x256 正方形上传
  - 上传中显示 loading spinner 覆盖在头像上，hover 显示相机图标
  - 昵称 hover 显示 ✏️ 编辑图标，点击变为 input 框，回车/失焦保存
  - 保存中显示"保存中..."文案
- **useAuth 新增 updateProfile**：编辑成功后即时更新本地 user 状态
- **i18n**：新增 profileEditName / profileSaving / profileUploadAvatar（中英文）

### 技术决策
- R2 key 不带扩展名（`avatars/{userId}`），content-type 存在 R2 httpMetadata，简化覆盖逻辑
- 前端上传后 URL 附加 `?t=timestamp` cache-buster，强制浏览器刷新头像
- Canvas 裁剪取中心正方形区域，缩放到 256x256，jpg 质量 0.9

### 改动文件
- `auth/wrangler.toml` — 新增 R2 绑定
- `auth/src/index.ts` — Env 类型新增 AVATARS
- `auth/src/routes/auth.ts` — 新增 3 个端点
- `src/components/UserProfile.tsx` — 重写，支持头像上传和昵称编辑
- `src/hooks/useAuth.ts` — 新增 updateProfile
- `src/components/Settings.tsx` — auth prop 新增 updateProfile，传递给 UserProfile
- `src/i18n/types.ts` — 新增 3 个 key
- `src/i18n/locales/zh.ts` / `en.ts` — 新增翻译
- `package.json` — 0.12.0 → 0.13.0
- 四个文档同步

---

## v0.12.0 — Auth 服务拆分 + 自定义域名（2026-02-13）

### 背景
将认证服务从 api Workers 拆分为独立的 auth Workers，为自定义域名（auth.cosmelon.app / api.clock.cosmelon.app）做准备。

### 改动
- **新建 auth/ 目录**：独立 Cloudflare Workers 项目（cosmelon-auth）
  - `auth/src/index.ts`：Hono 入口，basePath `/auth`，CORS 配置
  - `auth/src/routes/auth.ts`：9 个认证端点（从 api 移过来）
  - `auth/src/services/jwt.ts`、`email.ts`、`oauth.ts`：认证服务（从 api 移过来）
  - `auth/src/middleware/auth.ts`：认证中间件（从 api 复制）
  - `auth/wrangler.toml`：绑定 D1 + KV
  - Cookie path 从 `/api/auth` 改为 `/auth`
  - OAuth callback URL 从 `/api/auth/xxx/callback` 改为 `/auth/xxx/callback`

- **清理 api/ 目录**：
  - 删除 `api/src/routes/auth.ts`
  - 删除 `api/src/services/` 整个目录
  - `api/src/index.ts`：移除 auth 路由和相关 import，Env 简化为 DB + JWT_SECRET
  - `api/src/middleware/auth.ts`：改为自包含 JWT 验证（内联 Web Crypto API 实现）
  - `api/wrangler.toml`：移除 KV 绑定
  - `api/src/routes/health.ts`：版本号更新到 0.12.0

- **前端更新**：
  - `LoginPanel.tsx`：API_BASE → AUTH_BASE（https://auth.cosmelon.app），路径 /api/auth → /auth
  - `useAuth.ts`：AUTH_BASE + API_BASE 分离，路径 /api/auth → /auth

- **部署**：auth Workers 和 api Workers 均已部署，JWT_SECRET 已同步设置

### 技术决策
- api/src/middleware/auth.ts 内联 JWT 验证而非保留对 services/jwt.ts 的依赖，因为 api 不再需要签发 token，只需验证
- Cookie path 改为 /auth 匹配新的 basePath
- API_BASE 在 useAuth.ts 中 export 预留，供未来业务 API 使用

---

## v0.11.0 — 用户登录系统（2026-02-13）

### 背景
两周冲刺 Day 1-2 续，实现完整的用户认证系统，为后续数据同步做准备。

### 改动
- **基础设施**：创建 KV namespace `watermelon-clock-sessions`，配置 JWT_SECRET secret
- **API 新增文件**：
  - `api/src/services/jwt.ts`：Web Crypto API HMAC-SHA256 JWT 签发/验证
  - `api/src/services/email.ts`：Resend API 发送验证码邮件
  - `api/src/services/oauth.ts`：Google + Microsoft OAuth 流程
  - `api/src/middleware/auth.ts`：JWT 认证中间件
  - `api/src/routes/auth.ts`：9 个认证端点
- **前端新增文件**：
  - `src/hooks/useAuth.ts`：认证状态管理 hook
  - `src/components/LoginPanel.tsx`：底部滑出登录面板
  - `src/components/CodeInput.tsx`：6 格验证码输入组件
  - `src/components/UserProfile.tsx`：用户信息/登录入口
- **集成**：Settings 组件新增用户区域，App.tsx 接入 useAuth
- **i18n**：新增 10 个 auth 相关翻译 key

### 技术决策
- JWT 用 Web Crypto API 原生实现，不引入 jsonwebtoken 等外部库
- Refresh Token 通过 httpOnly cookie 传递，Access Token 存 localStorage
- OAuth 回调通过 URL fragment 传递 access token，避免 token 出现在服务端日志

---

## v0.10.0 — Workers API 骨架 + GitHub Actions（2026-02-13）

### 背景
两周冲刺 Day 1-2，搭建后端 API 基础设施和 CI/CD 自动部署。

### 改动
- 新建 `api/` 目录，独立的 Cloudflare Workers 项目
  - Hono 框架，TypeScript
  - `api/wrangler.toml`：Workers 配置，绑定 D1 数据库
  - `api/src/index.ts`：入口，CORS 中间件 + 路由挂载
  - `api/src/routes/health.ts`：`GET /api/health` 健康检查
  - `api/src/db/schema.sql`：5 张表 + 索引
- 新建 `.github/workflows/deploy.yml`：push main 自动 build + deploy to Cloudflare Pages
- `.gitignore` 新增 api/node_modules、.dev.vars、.wrangler
- `package.json` 版本号 0.9.2 → 0.10.0

### CORS 允许列表
- `https://watermelon-clock.pages.dev`
- `https://pomodoro-puce-seven-98.vercel.app`
- `http(s)://localhost:*`

### 待办（需要 Charles 手动操作）
- Cloudflare API Token 需添加 D1 权限（当前 token 只有 Pages 权限）
- 创建 D1 数据库：`wrangler d1 create watermelon-clock-db`
- 执行建表：`wrangler d1 execute watermelon-clock-db --file=api/src/db/schema.sql`
- 部署 Workers：`cd api && wrangler deploy`
- GitHub Secret：需在 GitHub 仓库 Settings → Secrets 手动添加 `CLOUDFLARE_API_TOKEN`（PAT 缺少 secrets scope）

---

## Cloudflare Pages 迁移准备（2026-02-13）

### 背景
Charles 确认将西瓜时钟从 Vercel 迁移到 Cloudflare Pages。本次为代码层面的准备工作，不涉及实际部署。

### 改动
- 新增 `wrangler.toml`：Cloudflare Pages 配置，SPA 模式（`not_found_handling = "single-page-application"`）
- 检查确认项：
  - `vite.config.ts`：`base` 默认 `/`，构建输出 `dist`，无 Vercel 特定配置 ✅
  - `package.json`：无 Vercel 特定 scripts 或依赖 ✅
  - 无 `vercel.json` 文件 ✅
  - PWA `scope` 和 `start_url` 均为 `/`，无硬编码域名 ✅
  - `npm run build` 成功，dist 目录结构正常 ✅

### 新增文件
- `wrangler.toml`

### 待办（迁移完成后）
- Cloudflare Pages 项目创建 + 域名绑定（需要 Charles 的 Cloudflare 账号）
- 验证通过后删除 Vercel 相关配置（如有）
- 统一更新版本号

---

## v0.9.2 — Toast 健康提醒文案优化（2026-02-13）

### 需求背景
Charles 确认采用方案 A 的文案风格，从用户健康角度出发，语气自然亲切，替换原有偏指令式的文案。

### 改动
- `zh.ts`：`healthReminder` 从"超过 25 分钟需手动结束，记得适时休息 🧘"改为"专注时间较长，不会自动进入休息～记得到点给自己放个假哦 🧘"
- `en.ts`：`healthReminder` 从"Sessions over 25 min require manual finish — remember to rest 🧘"改为"Longer focus sessions won't auto-switch to break — remember to take a rest when time's up 🧘"
- 设置面板中同一个 `healthReminder` key 也自动同步更新

### 改动文件
- `src/i18n/locales/zh.ts`
- `src/i18n/locales/en.ts`
- `package.json`（0.9.1 → 0.9.2）
- 四个文档同步

---

## v0.9.1 — Toast 体验修复（2026-02-13）

### 需求背景
Charles 测试 v0.9.0 Toast 反馈两个问题：1) Toast 出现时把开始按钮往下推（占用布局空间）；2) 选 >25min 弹 Toast 后快速切回 ≤25min，Toast 不会立即消失。

### 改动
- `Timer.tsx`：Toast 容器从 `flex mt-3` 改为 `absolute` 定位（`top:100%` + `left:50%` + `-translate-x-1/2`），浮动在进度环下方，不占文档流空间
- `Timer.tsx`：快捷选择器 onClick 中，选 ≤25min 时加 `setHealthToast(false)`，立即隐藏正在显示的 Toast
- 不影响 Toast 组件本身逻辑（fade-in/out 动画、3.5s 自动消失）

### 改动文件
- `src/components/Timer.tsx`
- `package.json`（0.9.0 → 0.9.1）
- 四个文档同步

---

## v0.9.0 — 健康提醒 Toast（2026-02-13）

### 需求背景
快捷时间选择器选择 >25 分钟时，需要一个 Toast 提醒用户该时长需手动结束，注意休息。

### 改动
- 新建 `src/components/Toast.tsx`：fade-in / fade-out 动画，3500ms 自动消失，适配 5 套主题，aria-live 无障碍
- 修改 `src/components/Timer.tsx`：
  - 新增独立 `healthToast` state（不与长按提示 `toast` 共用）
  - 快捷选择器 onClick 增加 >25min 判断触发 healthToast
  - Toast 放在进度环容器外部（进度环 div 和控制按钮之间），避免 260x260 固定容器内重叠
  - 恢复长按提示的原始 inline 渲染
- 文案使用 i18n `healthReminder` key（中/英双语）
- ≤25min 不弹 Toast

### 改动文件
- `src/components/Toast.tsx`（新建）
- `src/components/Timer.tsx`
- `package.json`（0.8.9 → 0.9.0）
- 四个文档同步

---

## v0.8.8 — 小瓜和大西瓜图标优化（2026-02-12）

### 需求背景
瓜棚页面中，小瓜（green）原来是浅黄绿色椭圆，不像西瓜；大西瓜（ripe）原来是切开的西瓜，但还没"开瓜"应该是完整的。

### 改动
- `src/components/GrowthIcon.tsx`
  - **小瓜 GreenIcon**：替换为小的、圆的、带深绿色条纹的完整迷你西瓜 SVG（未切开），有藤蒂、小叶、卷须、瓜脐、高光
  - **大西瓜 RipeIcon**：替换为大的、饱满的、带深绿色条纹的完整西瓜 SVG（未切开），比小瓜大一圈，有双叶、卷须、更多条纹
  - 两个图标风格统一，卡通可爱，深色/浅色背景都适配
- 合成区域（Synthesis）使用同一个 `GrowthIcon` 组件，自动同步

### 改动文件
- `src/components/GrowthIcon.tsx`
- `package.json`（0.8.7 → 0.8.8）
- 四个文档同步

---

## v0.8.7 — 音量滑块尺寸缩小（2026-02-12）

### 需求背景
Charles 反馈音量滑块看起来太大，影响美观，希望更精致不突兀。

### 改动
- `src/index.css`
  - `.range-slider` 轨道高度 8px → 5px
  - `::-webkit-slider-thumb` / `::-moz-range-thumb` 尺寸 22px → 16px
  - thumb 描边 2px → 1.5px
  - 外发光 4px → 3px，hover 6px → 4px，active 7px → 5px
  - 阴影整体减弱，比例协调
  - Firefox `::-moz-range-track` / `::-moz-range-progress` 高度同步 5px
- 所有主题下样式一致，滑块仍可正常拖动

### 改动文件
- `src/index.css`
- `package.json`（0.8.6 → 0.8.7）
- 四个文档同步

---

## v0.8.3 — Slider 样式再优化（2026-02-12）

### 需求背景
Charles 反馈设置面板 Alert Volume 滑块在暗色主题下存在感不足，白色滑块质感偏弱，整体像浏览器默认控件。

### 改动
- `src/index.css`
  - `.range-slider` 轨道高度 5px → 8px
  - `::-webkit-slider-thumb` / `::-moz-range-thumb` 尺寸 18px → 22px
  - thumb 增加 radial 渐变、accent 描边、外发光
  - hover/active 增强发光与交互反馈
  - Firefox `::-moz-range-track` / `::-moz-range-progress` 高度同步 8px
- `src/components/Settings.tsx`
  - `--range-bg` 改为固定 `rgba(255,255,255,0.12)`，增强未填充轨道可见性

### 改动文件
- `src/index.css`
- `src/components/Settings.tsx`
- `package.json`（0.8.2 → 0.8.3）
- 四个文档同步

---

## v0.8.2 — autoStartBreak UI 联动 + 提示文案位置（2026-02-12）

### 需求背景
Charles 反馈 >25min 时 autoStartBreak 开关没有自动关闭，提示文案在页面底部太不显眼。

### 改动
- Settings.tsx update() 里检测 workMinutes > 25 时自动 set autoStartBreak = false
- Toggle 组件加 disabled prop（opacity-40 + cursor-not-allowed + aria-disabled）
- autoStartBreak 开关在 workMinutes > 25 时 disabled
- 健康提示从 App.tsx 底部移到 Settings 面板 Focus NumberStepper 下方
- workMinutes 改回 ≤25 时开关恢复可用但不自动开启

### 改动文件
- `src/components/Settings.tsx` — Toggle disabled + update 联动 + 提示文案
- `src/App.tsx` — 移除底部健康提示
- `package.json` — 0.8.1 → 0.8.2
- 四个文档同步

---

## v0.8.1 — 阈值调整 + 防挂机机制（2026-02-11）

### 需求背景
Charles 担心用户挂机刷收获物。两个改动：调整阈值让每个阶段更有辨识度，加防挂机机制。

### 阈值调整
新阈值 5-15/16-25/26-45/46-60/61-90，>90 封顶 ripe。金西瓜触发区间从 ≥90 改为 61-90，>90 不触发概率（防止挂机 90+ 分钟刷金西瓜）。

### 防挂机：overtime 模式
给 useTimer 加了 overtime phase。当 workMinutes > 25 且倒计时到 0 时，不自动完成，而是进入正计时模式。用户必须手动点 Done。同时 autoStartBreak 在 >25min 时自动禁用。

### 防挂机：2x 超时惩罚
handleSkipWork 里检查 `elapsedSeconds > workMinutes * 60 * 2`，超了就不调 resolveStageAndStore，不存瓜棚，不播庆祝。用 suppressCelebrationRef 在下一帧 dismiss 掉 useTimer 内部设的 celebrating。

项目模式同理，handleProjectTaskComplete 里检查 `actualSeconds > estimatedMinutes * 60 * 2`。

### 改动文件
- `src/types.ts` — getGrowthStage 新阈值
- `src/hooks/useTimer.ts` — 重写，新增 overtime phase + overtimeSeconds
- `src/components/Timer.tsx` — isWork 包含 overtime
- `src/App.tsx` — 2x 检查 + 庆祝抑制 + overtime 标题 + 健康提示 + abandon 修复
- `src/i18n/types.ts` + `zh.ts` + `en.ts` — overtimeNoReward + healthReminder
- `package.json` — 0.8.0 → 0.8.1
- `docs/WAREHOUSE-DESIGN-v1.md` — 设计文档更新（小西提供）
- 四个文档同步更新

---

## v0.8.0 — 仓库与合成系统（2026-02-11）

### 需求背景
用户每次专注完成后获得收获物，但只是庆祝画面一闪而过。引入仓库系统让收获物可以被收集、查看、合成。设计文档：`docs/WAREHOUSE-DESIGN-v1.md`。

### 阈值调整
旧版 <10/10-15/15-20/20-25/≥25 间隔太密，新版拉大间隔让每个阶段有明确身份感。bloom（25-44min）区间最宽，覆盖经典番茄钟时长。

### 金西瓜概率系统
- `rollLegendary(pityCount)` 函数：10% 概率 + 保底（≥20 次必出）
- 保底计数器存在 Warehouse.legendaryPity
- `resolveStageAndStore()` 统一处理阶段判定 + 概率 + 存仓库 + 记录 lastRolledStage

### 仓库数据
- `useWarehouse` hook 封装所有仓库操作
- localStorage key: `watermelon-warehouse`
- 带 migration 函数，兼容未来字段扩展

### 合成系统
- 合成代价约为直接专注的 3-5 倍（故意不划算，鼓励长专注）
- `synthesize(recipe, count)` 和 `synthesizeAll(recipe)` 两个操作
- 合成动画用简单的背景色变化（600ms delay）

### 改动文件
- `src/types.ts` — legendary 阶段 + rollLegendary + Warehouse + SynthesisRecipe
- `src/components/GrowthIcon.tsx` — 金西瓜 SVG
- `src/components/CelebrationOverlay.tsx` — legendary 庆祝配置
- `src/hooks/useWarehouse.ts` — 新建，仓库 hook
- `src/components/WarehousePage.tsx` — 新建，仓库页面
- `src/App.tsx` — 接入仓库 + 🎒 按钮 + resolveStageAndStore
- `src/i18n/types.ts` — 新增 20+ 个文案字段
- `src/i18n/locales/zh.ts` / `en.ts` — 仓库/合成/金西瓜文案
- `package.json` — 0.7.1 → 0.8.0
- 四个文档同步更新

---

## v0.7.1 — 庆祝系统升级（2026-02-11）

### 需求背景
Charles 要求庆祝画面要隆重，让用户真的感觉到自己在被庆祝。设计文档：`docs/CELEBRATION-DESIGN-v1.md`。

### 架构设计
四层结构：BackgroundLayer → GlowRings + Icon → ParticleLayer + SpecialEffectLayer → Text

每个阶段有独立的 `StageConfig`，控制粒子数、时长、图标大小、光晕层数/强度、颜色池、是否有礼花/纸屑/特效。

### 粒子系统
5 种粒子类型：`dot`（基础光点）、`leaf`（叶片）、`petal`（花瓣）、`confetti`（纸屑）、`firework`（礼花火花）。
每种有不同的 CSS 形状（borderRadius/clipPath）和运动轨迹（rise/fall/burst）。

### Ripe 随机特效池
4 种特效随机选一种：
1. `firework-burst`：5 个位置各 8 个火花向外绽放
2. `confetti-storm`：30 片纸屑从顶部暴风雨般落下
3. `melon-drop`：5 个小西瓜从天而降 + 弹跳
4. `melon-roll`：两个大西瓜从两侧滚入

### CSS 动画
新增 15+ 个 @keyframes，全部用 transform/opacity 做 GPU 加速。
firework spark 用 CSS 三角函数 `cos()/sin()` 计算方向（现代浏览器支持）。

### 改动文件
- `src/components/CelebrationOverlay.tsx` — 完全重写
- `src/index.css` — 新增庆祝动画
- `src/i18n/types.ts` — 新增 5 个文案池类型
- `src/i18n/locales/zh.ts` — 25 条中文阶段文案
- `src/i18n/locales/en.ts` — 25 条英文阶段文案
- `package.json` — 0.7.0 → 0.7.1
- 四个文档同步更新

---

## v0.7.0 — 品牌视觉升级：西瓜化（2026-02-11）

### 需求背景
产品叫"西瓜时钟"，但视觉上几乎没有西瓜元素，进度环是红色更像番茄钟。Charles 要求先把基础体验打磨好再推进新功能。

### 设计思路
- 进度环 = 西瓜横截面：绿色外皮（底圈）+ 红色瓤（进度条）
- 强调色从番茄红偏移到西瓜红（偏粉红，不是正红）
- Focus 标签加一点西瓜绿底色，和 Break 区分
- 鼓励语全部替换为西瓜主题文案
- 其他主题不强制西瓜绿，保持各自色系

### 配色选择
- 西瓜红：#FF3B5C → #FF6B8A（渐变），偏粉红不偏正红
- 西瓜皮绿：#2D5A27 → #1a3d18（渐变），沉稳深绿不刺眼
- Focus 标签底色：rgba(76,175,80,0.15)，subtle 不抢眼

### 技术实现
- `ThemeColors` 接口新增 `ringBase`/`ringBaseEnd`/`focusLabel` 可选字段
- Dark 主题设置显式 ringBase 颜色，其他主题不设置（走 fallback）
- `Timer.tsx` 进度环底圈渐变支持显式颜色覆盖
- Break 阶段不使用 ringBase（保持原有 accent+opacity 逻辑）
- 鼓励语 i18n 中英文全部替换，保持原有随机轮换机制

### 改动文件
- `src/types.ts` — ThemeColors 接口 + Dark 主题配色
- `src/components/Timer.tsx` — 进度环底圈 + Focus 标签
- `src/i18n/locales/zh.ts` — 中文鼓励语
- `src/i18n/locales/en.ts` — 英文鼓励语
- `package.json` — 版本号 0.6.2 → 0.7.0
- 四个文档同步更新

---

## v0.6.2 — 优化最后冲刺视觉效果（2026-02-11）

### 需求背景
Charles 反馈 v0.6.1 的冲刺效果太温和：数字脉冲幅度太小，变金色像换主题没有紧迫感。

### 设计调整
- 从"突然切换"改为"渐进加强"三级体系
- 保持原色不变，通过 glow + 动画频率 + 幅度递增来传达紧迫感
- 10s 脉冲幅度从 1.05 翻倍到 1.15，加 opacity 闪烁，速度从 0.8s 加到 0.5s

---

## v0.6.1 — 周趋势图 + 专注模式增强（2026-02-10）

### 需求背景
Charles 确认继续推进阶段二：周趋势图 + 专注模式增强（最后冲刺 + 长按确认）。

### 周趋势图
- 纯 div/CSS 实现，不引入图表库
- `getCurrentWeekDays()` 计算本周一到周日的日期 key
- 柱子高度按比例，最高天占满 80px 高度
- 点击柱子 toggle tooltip（`tappedIndex` state）
- 空天显示 3% 高度的底线

### 最后冲刺
- `isFinalSprint = isWork && running && timeLeft <= 60`：切换到金色色系
- `isFinalCountdown = isWork && running && timeLeft <= 10`：数字脉冲动画
- 颜色过渡用 CSS `transition: color 0.5s`，进度环通过 SVG gradient 即时切换

### 长按确认
- `startLongPress(target, action)` 启动 16ms interval 更新进度
- `cancelLongPress(toastMsg)` 取消并可选显示 toast
- SVG 环形进度：`strokeDashoffset = circumference * (1 - progress)`
- 同时支持 mouse 和 touch 事件
- 短按（progress < 0.3）才显示 toast，避免长按中途松手也弹提示

---

## v0.6.0 — 智能鼓励文案 + 专注数据增强（2026-02-10）

### 需求背景
Charles 希望在今日记录区域上方显示基于用户专注数据的鼓励文案，替代静态文字。

### 设计思路
- 不新增 UI 区域，替代现有的 "今日收获" / "No records yet today" 标题
- 文案根据状态自动选择，优先级：昨天对比 > 数量鼓励 > 空状态
- 每种情况 2-3 条备选，用确定性随机（日期+数量作为 seed）避免重渲染闪烁
- Streak 作为后缀独立显示，用 accent 色突出

### 实现细节
- `pick()` 函数用 seed % length 做确定性选择，同一天同一数量总是选同一条
- 昨天数据直接从 allRecords 过滤，不需要额外存储
- Streak 复用现有 `getStreak()` 函数
- `TodayStats` 新增 `hideTitle` prop，Banner 和 Stats 解耦

---

## v0.5.5 — 安卓黑屏深度排查 + 全局错误捕获（2026-02-10）

### 排查背景
v0.5.4 的 Notification fix 没有解决问题。Charles 确认 ErrorBoundary 的恢复 UI 也没出现，说明：
1. 可能不是 React render 错误（ErrorBoundary 只捕获 render 阶段的错误）
2. 可能是 PWA 缓存导致 Charles 还在跑旧版本
3. 可能是 useEffect 中的异步错误（ErrorBoundary 捕获不到）

### 策略：不再猜测，加诊断工具
- 全局 `window.onerror` + `window.onunhandledrejection` → 错误直接渲染到 DOM（红色面板），不依赖 React
- 版本号角标（右下角 `v0.5.5`）→ 确认 Charles 看到的是哪个版本
- 所有 useEffect 回调加 try-catch → 防止任何 effect 崩溃
- 让 Charles 清除 PWA 缓存后重试，看到版本号后截图

---

## v0.5.4 — 修复安卓黑屏 + 错误边界（2026-02-10）

### 需求背景
Charles 补充信息：安卓手机亮屏正常使用时就会黑屏，刷新能恢复但状态丢失。说明不是 CSS 问题，是 JS 层面崩溃。

### 排查过程（第二轮）
1. v0.5.3 的 CSS 修复（transition-all → transition-colors）是正确的优化，但不是根因
2. "刷新能恢复但状态丢失" → 说明 React 组件树被卸载了（JS 崩溃）
3. 没有 ErrorBoundary → 任何未捕获的渲染错误都会导致整个 App 消失
4. 追踪 `handleTimerComplete` 调用链 → `sendBrowserNotification` → `new Notification()`
5. **发现根因：** 安卓 Chrome 不支持 `new Notification()` 构造函数，必须通过 ServiceWorker 的 `showNotification()` 发送。`new Notification()` 抛出 TypeError，未被捕获，React 崩溃

### 为什么之前没发现
- 开发和测试都在桌面浏览器，`new Notification()` 在桌面端正常工作
- 安卓 Chrome 的 `Notification.permission` 返回 `'granted'`（权限检查通过），但构造函数抛异常
- 没有 ErrorBoundary，崩溃后只剩深色背景，看起来像"黑屏"

### 修复方案
1. `sendBrowserNotification` 改为 SW 优先 + 桌面回退 + try-catch
2. 所有 timer 完成回调加 try-catch 防护
3. 新增 ErrorBoundary 作为最后防线

---

## v0.5.3 — 修复手机端专注结束黑屏（2026-02-10）

### 需求背景
Charles 反馈手机端每次专注时间结束后页面变黑屏，像内容没刷出来。P0 紧急。

### 排查过程
1. 检查 work→break 状态切换时的条件渲染 → 无问题，所有分支都有内容
2. 检查 CelebrationOverlay → 无问题，absolute 定位 + pointer-events-none，2.5s 后自动消失
3. 检查背景色计算 → 无问题，所有 theme 的 bgBreak 都有值
4. **发现根因：** 根容器 `transition-all duration-[1500ms]` + `linear-gradient` 背景

### 根因分析
- `transition-all` 会过渡**所有** CSS 属性，包括 `min-height`（dvh 在移动端动态变化）、`flex` 等 layout 属性
- `linear-gradient` 在部分移动端浏览器中无法被 CSS transition 平滑插值，过渡期间可能渲染为透明/黑色
- 1.5s 的过渡时间放大了这个问题窗口

### 修复方案
- `transition-all` → `transition-colors`：只过渡颜色，不碰 layout
- `linear-gradient` → 纯 `backgroundColor`：原渐变仅 100%→90% 透明度差异，视觉影响可忽略

---

## v0.5.2 — PC 鼠标拖拽滚动（2026-02-10）

### 需求背景
Charles 希望 PC 上也能像手机一样按住拖动来滚动页面。

### 设计思路
- 自定义 hook `useDragScroll`，全局 window 级事件监听
- 关键难点：不能拦截按钮/输入框等交互元素的点击。解决方案是在 mousedown 时检查 target 元素链，如果命中交互元素则跳过
- 惯性滚动：记录拖拽过程中的速度（EMA 平滑），松手后用 rAF 驱动衰减滚动

### 实现细节
- `isInteractive()` 向上遍历 DOM 树，检查 tag name 和 role 属性
- 速度计算：`v = 0.8 * (dy/dt) + 0.2 * prevV`，避免突变
- 惯性：每帧 `v *= 0.95`，低于 0.5px/frame 停止
- 拖拽中设置 `cursor: grabbing` + `user-select: none`，松手恢复

---

## v0.5.1 — 隐藏滚动条（2026-02-10）

### 需求背景
Charles 发现页面右侧有可见滚动条，影响视觉美观。

### 实现
- `index.css` 全局隐藏滚动条：`::-webkit-scrollbar { display: none }` + `scrollbar-width: none` + `-ms-overflow-style: none`
- 作用于 `html` 元素，不影响弹窗内部滚动

---

## v0.5.0 — 正计时/倒计时切换（2026-02-10）

### 需求背景
Charles 提出有些用户喜欢正计时（看已经过了多久），有些喜欢倒计时（看还剩多久）。希望在现有基础上增加切换能力。

### 设计思路
- **纯显示层改动**：计时逻辑（useTimer / useProjectTimer）完全不动，只在 Timer.tsx 渲染层做切换
- **计算方式**：正计时 = `totalDuration - timeLeft`（已经过的时间），倒计时 = `timeLeft`（剩余时间）
- **点击区域复用**：idle 时点击数字 = 快速调时间（原有），running/paused 时点击数字 = 切换显示模式
- **超时不切换**：overtime 已经是正计时（+MM:SS），不需要也不应该切换

### 实现细节
- `Timer.tsx` 新增 `TimerDisplayMode` 类型（`'countdown' | 'countup'`）
- `loadDisplayMode()` 从 localStorage 读取偏好，默认 `'countdown'`
- `toggleDisplayMode()` 切换并写入 localStorage，同时触发 200ms 的 `digitBounce` 动画
- 动画用 Tailwind `scale-95` → `scale-100` 过渡实现，轻量不抢眼
- i18n 新增 `toggleTimerMode` 字段作为 title 提示

### 技术决策
- **为什么不用 useLocalStorage hook？** Timer 组件不需要响应外部变化，直接 useState + localStorage 更简洁
- **为什么不在 useTimer 里做？** 这是纯 UI 展示逻辑，不应该污染计时状态机
- **为什么 overtime 不支持切换？** overtime 本身就是正计时（+MM:SS），切换成倒计时没有意义（倒计时到什么？）

---

## v0.4.9 — Bug 修复（2026-02-10）

### 需求背景
v0.4.8 的 goToPreviousTask 修复不彻底：返回上一个任务再完成时，App 层 records 仍然重复累加。另外休息阶段进度环显示位置不对。

### Bug ①：返回上一个任务再完成 → 记录/奖励/时间重复累加
- **根因：** `goToPreviousTask` 从 `state.results` 移除了旧 result，但 App 层的 `records`（PomodoroRecord[]）已经被之前的 callback 写入，无法撤回。完成时又创建新 record，导致重复。
- **修复：** 引入 `previousSeconds` 机制：
  - `ProjectState.revisitPreviousSeconds`：goToPreviousTask 时记录已有秒数
  - `ProjectTaskResult.previousSeconds`：recordTaskResult 时携带
  - App 层 `handleProjectTaskComplete`：检测到 previousSeconds 时更新已有 record 而非新增
- **技术决策：** 选择在 result 里带 previousSeconds 而非在 App 层做 taskId 去重，因为 PomodoroRecord 没有 taskId 字段，按 name+date 匹配更可靠

### Bug ②：休息阶段进度环从 3/4 处开始
- **根因：** break 阶段 `currentTaskIndex` 已指向下一个任务（v0.4.5 设计），但 timerView 的 `totalDuration` 取了 `tasks[currentTaskIndex].breakMinutes`（下一个任务的），而 `state.timeLeft` 是用上一个任务的 `breakMinutes` 初始化的。两者不匹配导致 progress 计算错误。
- **修复：** break 阶段 `totalDuration` 改为 `tasks[currentTaskIndex - 1].breakMinutes * 60`

### 改动文件
- `src/types/project.ts` — ProjectTaskResult 加 previousSeconds，ProjectState 加 revisitPreviousSeconds
- `src/hooks/useProjectTimer.ts` — goToPreviousTask 设 revisitPreviousSeconds，recordTaskResult 携带并清除，break totalDuration 修复
- `src/App.tsx` — handleProjectTaskComplete 支持 revisit 更新逻辑

---

## v0.4.8 — 多项修复 + 新功能（2026-02-10）

### 需求背景
v0.4.7 发布后 Charles 密集测试，发现多个项目模式逻辑 bug + 提出新功能需求。

### 改动总览（按 commit 顺序）

#### 1. P0 fix: useTimer status guard 恢复
- **根因：** v0.4.7 文档注释 commit 误删了 `if (status !== 'running') return;`
- **修复：** 恢复 guard，idle/paused 不再创建 countdown interval
- **教训：** 注释类改动也必须 `git diff` 逐行确认

#### 2. feat: Logo 替换为 PNG + 品牌文字
- Charles 提供透明背景 PNG（640x640 RGBA），替换手绘 SVG
- Header：Logo 从 w-5 增大到 w-7/w-8，新增品牌文字 `t.appName`
- 移动端 `hidden sm:inline` 隐藏文字

#### 3. feat: 提醒音持续循环
- `alertRepeatCount = 0` 表示持续循环
- `playAlertRepeated` 用 setInterval 实现循环，新增 `stopAlert()` 清除
- App.tsx 全局 click/keydown 监听（capture 阶段）调用 `stopAlert()`
- i18n: `repeatTimes(0)` → '持续' / 'Loop'

#### 4. fix: 项目模式 3 个逻辑 bug
- **Bug ①** break 结束无视 autoStartWork → 新增 `autoStartWork` 参数，break 结束时检查
- **Bug ②** 退出→重新开始进度 +1 → `restartCurrentTask` 移除 abandoned result
- **Bug ③** 返回上一个任务超时不累计 → 从 result 恢复 actualSeconds，移除旧 result

#### 5. fix: 延迟 abandoned callback
- **根因：** `exitCurrentTask` 立即触发 App callback，导致 records 无法撤回
- **修复：** callback 延迟到 goToNextTask / abandonProject，restart / goToPrevious 不触发

### 技术决策
- 提醒音停止监听始终挂载（不按需），简化状态管理
- abandoned callback 延迟而非"先写入再撤回"，更干净
- `goToPreviousTask` 用 for 循环替代 `findLastIndex`（ES2022 兼容）

---

## v0.4.7 — Logo 替换 + 品牌文字（2026-02-10）

### 需求背景
Charles 提供了新的西瓜时钟 logo 原图（`watermelon-logo-original.jpg`），要求替换左上角太小的 logo 并加上品牌名称。

### 改动文件
- `public/icon.svg` — 基于原图手绘矢量 SVG（绿色瓜皮 + 白色过渡 + 红色果肉渐变 + 西瓜籽 + 时钟指针 + Kawaii 表情）
- `logo-source.png` — 从 SVG 渲染的 1024x1024 PNG 源文件
- `public/favicon-*.png`, `public/favicon.ico`, `public/icon-*.png`, `public/apple-touch-icon.png` — 全套重新生成
- `src-tauri/icons/*` — Tauri 桌面端图标重新生成
- `src/App.tsx` — Header 左侧：Logo 从 w-5 增大到 w-7/w-8，改用 icon.svg；新增品牌文字 `t.appName`（sm: 以上显示）
- `package.json` — version 0.4.6→0.4.7

### 技术决策
- 选择手绘 SVG 而非自动转换，因为原图是 JPG（有白色背景和压缩噪点），自动 trace 效果不佳
- 品牌文字用 `hidden sm:inline` 做响应式，移动端只显示 Logo 避免挤压中间的 ModeSwitch
- Logo 改用 `/icon.svg` 而非 `/favicon-32x32.png`，SVG 在 Retina 屏上无损缩放

---

## v0.4.6 — Bug 修复（2026-02-10）

### 需求背景
v0.4.5 全面排查发现 5 个 bug（2P2 + 3P3），Charles 要求在进入 v0.5 前全部修掉。

### 改动文件
- `src/components/ProjectExitModal.tsx` — Bug 1: 新增 `isBreak` prop，break 阶段跳过 step 1；挂载时重置 step；所有按钮加 300ms 互斥锁 + min-h-[44px]
- `src/components/Timer.tsx` — Bug 2: `guardedAction` 包装 ✓/✗ 按钮，300ms 互斥；Bug 5: 所有按钮加 min-w/min-h
- `src/types.ts` — Bug 3: Light 主题 textMuted 0.6→0.65, textFaint 0.25→0.35, border 0.08→0.10
- `src/App.tsx` — Bug 1: 传 `isBreak` prop 给 ProjectExitModal；Bug 4: 主容器加 `key={settings.language}` 强制重建
- `src/components/ConfirmModal.tsx` — Bug 5: 按钮加 min-h-[44px] + whitespace-nowrap
- `package.json` — version 0.4.5→0.4.6
- 文档：DEVLOG.md, docs/CHANGELOG.md, docs/PRODUCT.md, README.md

### 技术决策
- Bug 1 选择在 break 阶段跳过 step 1 而非显示不同文案，因为 break 阶段没有"当前任务"可退出，显示"退出当前任务？"语义不对
- Bug 2 用 useRef 锁而非 useState，避免锁状态变化触发额外渲染
- Bug 4 用 `key` 强制重建而非逐个组件排查 stale closure，因为成本低且彻底

---

## v0.4.5 — Bug 修复（2026-02-10）

### 需求背景
Charles 要求在进入 v0.5 之前修复当前版本的 5 个 bug。

### 改动文件
- `src/types/project.ts` — ProjectState 新增 `pausedFrom` 字段
- `src/hooks/useProjectTimer.ts` — Bug 1/2/3: 重构 currentTaskIndex 推进时机（进入 break 时立即 +1）、pause/resume 用 pausedFrom、break 阶段 ✓ 跳过休息、progressLabel 修复
- `src/hooks/useTimer.ts` — Bug 4: skip 检查 autoStartBreak/autoStartWork
- `src/App.tsx` — Bug 5: abandoned 任务（≥1min）记录到历史

### 技术决策
Bug 1 的修复方案选择了"进入 break 时立即推进 currentTaskIndex"，这样 `currentTaskIndex` 始终指向当前/即将执行的任务，语义更清晰。代价是需要同步修改 resume、recovery、timerView 等依赖 index 的逻辑，引入 `pausedFrom` 字段。

---

## v0.4.4 — 全主题对比度修复（2026-02-10）

### 需求背景
Charles 反馈亮色主题下文字看不清，项目模式里休息时间、分钟数也看不清。经审查所有 5 套主题的 textMuted/textFaint 对比度都不达标（WCAG AA）。

### 改动文件
- `src/types.ts` — 5 套主题 textMuted/textFaint 提高对比度，新增 `border` token
- `src/App.tsx` — 硬编码 borderColor→theme.border
- `src/components/ModeSwitch.tsx` — 硬编码白色→theme.inputBg/border/text
- `src/components/Timer.tsx` — 数字颜色硬编码白色→theme.text，quick picker border→theme.border
- `src/components/TaskInput.tsx` — 边框/背景→theme.border/inputBg，placeholder→CSS 变量跟随 textMuted
- `src/components/Settings.tsx` — DIVIDER_COLOR→theme.border
- `src/components/ProjectSetup.tsx` — 序号/单位/休息时间 textFaint→textMuted，add 按钮 border→theme.border
- `src/components/ProjectTaskBar.tsx` — 进度标签 textFaint→textMuted
- `src/components/ProjectExitModal.tsx` — border→theme.border
- `src/components/InstallPrompt.tsx` — border→theme.border
- `src/components/AmbienceMixerModal.tsx` — border→theme.border
- `src/components/HistoryPanel.tsx` — 次要信息 textFaint→textMuted
- `src/index.css` — placeholder 改为 CSS 变量驱动

---

## v0.4.3 — UI 打磨第二轮（2026-02-10）

### 需求背景
上一轮 UI 改版验收后的细节优化，继续按 Apple HIG 标准打磨。

### 改动文件
- `src/components/Timer.tsx` — 播放按钮 shadow 减弱、三角图标缩小 2px
- `src/components/TaskInput.tsx` — 边框 0.08→0.12、加 inset shadow
- `src/index.css` — placeholder 颜色 0.25→0.35
- `src/components/TaskList.tsx` — 空状态加 🌱 emoji
- `src/components/Settings.tsx` — Stepper w-7→w-8、Theme padding 增大
- `src/App.tsx` — 统计卡片 pt-6→pt-4 减少底部空白

---

## v0.4.2 — UI 系统性改版（2026-02-09）

### 需求背景
当前 UI 缺乏设计系统，间距混乱、视觉层级不清晰、设置页无分组。以 Apple HIG + Material 3 为标准做系统性提升。核心原则：时间是绝对主角。

### 改动文件
- `src/types.ts` — dark 主题 bg/bgWork/bgBreak/surface 四色微调
- `src/App.tsx` — Header 重构（去文字、居中 Segmented Control、去帮助按钮）、间距 8pt 网格、分割线统一、Guide 外部控制
- `src/components/ModeSwitch.tsx` — 重写为 iOS Segmented Control（滑动指示器）
- `src/components/Timer.tsx` — 数字提权（300/纯白/tabular-nums）、按钮降权（52px/弱阴影）、Phase 胶囊标签、间距独立控制
- `src/components/TaskInput.tsx` — 圆角 12px、边框 0.08、聚焦 accent 40%、placeholder 0.25
- `src/components/TaskList.tsx` — 空状态改为一行浅色小字
- `src/components/Settings.tsx` — 四组分组标题、Toggle 绿色 #34C759、Theme grid-cols-3、帮助按钮入口
- `src/components/Guide.tsx` — 支持外部 show/close 控制（从设置页触发）
- `src/i18n/types.ts` + `locales/zh.ts` + `locales/en.ts` — 新增分组标题、空状态、帮助按钮文案
- `src/index.css` — task-input-placeholder 样式

---

## v0.4.1 — UI 视觉升级 + 版本号显示（2026-02-09）

### 需求背景
Charles 觉得 UI 不够好看，参考 Tide、Forest 等标杆产品做视觉升级。

### 质感提升
- 进度环：环宽 10→8，加外发光 drop-shadow，底环透明度降低
- 计时数字：字重 300→200，加 text-shadow 悬浮感
- ✗/✓ 按钮：文字改为 SVG 图标（X 交叉线 / checkmark 勾号）
- 任务输入框：加 1px 边框 + 聚焦态主题色边框 + 背景色提升
- Header：毛玻璃效果（backdrop-blur）+ sticky + 底部分割线
- 统计区域：卡片化容器（surface 背景 + 圆角 + 边框）

### 氛围感
- 背景：纯色改为微妙渐变（顶部→底部稍亮）
- 阶段切换：过渡时间 0.7s→1.5s，更优雅
- 西瓜图标：idle 时呼吸动画（scale 1→1.05，3s 循环）

### 品牌感
- Logo 光晕：绿色 drop-shadow
- dark 主题色：番茄红 #ef4444 → 西瓜红 #f43f5e（rose-500），渐变终点 #e11d48

### 涉及文件
- `src/components/Timer.tsx` — 环宽、发光、数字样式、SVG 图标
- `src/components/TaskInput.tsx` — 边框、聚焦态
- `src/components/TodayStats.tsx` — 呼吸动画
- `src/App.tsx` — 背景渐变、Header 毛玻璃、Logo 光晕、统计卡片化
- `src/types.ts` — dark 主题色调整
- `src/index.css` — breathe 动画 keyframes

---

## v0.4 — 番茄钟与项目模式交互重构（2026-02-09）

### 需求背景
Charles 重新定义了番茄钟和项目模式的关系：番茄钟是"原子单位"，项目模式是"多个番茄钟的组合"。去掉长休息/轮次系统，重做退出逻辑。

### 改动 1：去掉长休息/轮次系统
- `TimerPhase` 从 `'work' | 'shortBreak' | 'longBreak'` 简化为 `'work' | 'break'`
- 删除 `roundProgress`、`pomodorosPerRound` 相关逻辑
- 删除 `RoundProgress.tsx` 组件
- `PomodoroSettings` 删除 `longBreakMinutes`、`pomodorosPerRound`
- Settings 面板删除长休息时长和间隔设置
- 循环简化为：专注 → 休息 → 专注 → 休息（无限）

### 改动 2：番茄钟退出确认
- 点 ✗ 退出 → 弹 `ConfirmModal` 确认
- 确认后记录标记为 `status: 'abandoned'`
- `PomodoroRecord` 新增 `status?: 'completed' | 'abandoned'`（旧记录无此字段视为 completed）

### 改动 3：默认任务名
- 不输入任务名时自动生成"专注 #N"（N = 今天第几个，每天重置）
- 完成/跳过/退出都会使用解析后的任务名

### 改动 4：项目模式两步退出
- 新增 `ProjectExitModal.tsx`：
  - 第一步：确认退出当前任务 + "退出整个项目"选项
  - 第二步：重新开始 / 下一个任务 / 返回上一个任务
- `useProjectTimer` 新增方法：`exitCurrentTask`、`restartCurrentTask`、`goToNextTask`、`goToPreviousTask`
- `ProjectPhase` 新增 `'exited'` 状态
- `ProjectTaskResult.status` 新增 `'abandoned'` 和 `'overtime-continued'`
- 边界处理：第一个任务无"返回上一个"，最后一个任务"下一个"变为"结束项目"

### 改动 5：历史记录显示
- 番茄钟记录显示任务名称（用户输入 or 默认名）
- abandoned 记录显示 ✗ 标记
- 项目总结页显示 abandoned 和 overtime-continued 状态

### 涉及文件
- 删除：`src/components/RoundProgress.tsx`
- 新增：`src/components/ConfirmModal.tsx`、`src/components/ProjectExitModal.tsx`
- 重写：`src/hooks/useTimer.ts`、`src/App.tsx`
- 修改：`src/types.ts`、`src/types/project.ts`、`src/hooks/useProjectTimer.ts`
- 修改：`src/components/Timer.tsx`、`src/components/Settings.tsx`
- 修改：`src/components/ProjectSummary.tsx`、`src/components/ProjectMode.tsx`
- 修改：`src/components/TaskList.tsx`
- 修改：`src/i18n/types.ts`、`src/i18n/locales/zh.ts`、`src/i18n/locales/en.ts`

---

## v0.3.1 — 项目模式交互优化（2026-02-08）

### 需求背景
Charles 反馈：超时弹窗打断心流，按钮布局不够直观。后续要求两个模式界面完全统一。

### 改动 1：超时默认继续计时
- 删除超时提示弹窗（"继续计时"和"标记完成"按钮）
- 删除 `overtimeDismissed` 字段（ProjectState 类型 + useProjectTimer）
- 删除 `showOvertimePrompt` 逻辑
- 保留：进度环变红 + 数字变红 "+MM:SS"（用户仍可感知超时）

### 改动 2：统一按钮布局
两个模式完全一致的按钮布局：
- **✗（左）** — 番茄钟: 放弃本次（onAbandon），项目: 跳过子任务（skipCurrentTask）
- **⏸/▶（中）** — 暂停/继续（最大按钮）
- **✓（右）** — 番茄钟: 手动完成（onSkip），项目: 完成子任务（completeCurrentTask）
- idle 状态只显示 ▶ 开始
- break 阶段隐藏 ✗/✓，只保留 ⏸/▶
- 删除底部"放弃本次"文字按钮
- 删除 `projectControls` 和 `hideActions` props（不再需要区分模式）

### Bug 修复：完成子任务后白屏
- **根因：** break 阶段 ✓/✗ 按钮仍然可见，用户在 break 时点击 ✓ 会重复调用 `recordTaskResult`，导致 results 重复 + currentTaskIndex 越界 → 渲染崩溃
- **修复：** break 阶段通过 `isWork` 判断隐藏 ✗/✓；`completeCurrentTask` / `skipCurrentTask` 加 phase 保护

### 涉及文件
- `src/types/project.ts` — 删除 `overtimeDismissed` 字段
- `src/hooks/useProjectTimer.ts` — 删除 `overtimeDismissed`，complete/skip 加 phase 保护
- `src/components/Timer.tsx` — 统一按钮布局，删除 `projectControls`/`hideActions` props
- `src/components/ProjectTaskBar.tsx` — 清理超时提示
- `src/App.tsx` — 项目模式通过 onSkip/onAbandon 映射到 complete/skip

---

## v0.3 — 项目计时模式（2026-02-08）

### commit: 39ebdfd → cc104d1 → (fix/overtime-bugs)

### Bug 修复：超时后"继续计时"无效
- **根因：** `continueOvertime` 将 phase 从 `'overtime'` 改为 `'running'`，但 `timeLeft` 仍为 0，导致 tick 立即检测到 `timeLeft <= 0` 又切回 overtime，形成死循环
- **修复：** 新增 `overtimeDismissed` 标志位。`continueOvertime` 不再改变 phase，只设置 `overtimeDismissed = true`，timer 继续在 overtime phase 中正常 tick
- **timerView** 新增 `showOvertimePrompt`（overtime && !dismissed），控制提示显示

### 超时视觉反馈增强
- 进度环变红 + 脉冲动画（`animate-ring-pulse`）
- 计时数字变红 + 脉冲 + 显示 "+MM:SS" 格式
- 阶段标签显示"已超时"
- Timer 组件新增可选 `overtime` prop：`{ seconds: number }`

### 重构：项目模式计时复用番茄钟 Timer
Charles 反馈项目模式和番茄钟是两个完全不同的界面，体验割裂。重构为：
- **项目编排**（ProjectSetup）→ 独立界面（保持不变）
- **计时执行** → **复用番茄钟 Timer 组件**（进度环、西瓜生长、背景音全部保留）
- **完成总结**（ProjectSummary）→ 独立界面（保持不变）

#### 改动
- 删除 `ProjectExecution.tsx`（独立计时界面）
- 新增 `ProjectTaskBar.tsx`（轻量信息条：项目名 + 进度条 + 当前任务 + 超时提示）
- 重写 `useProjectTimer.ts`：新增 `timerView` 输出，映射项目状态到 Timer 兼容的 phase/status/timeLeft
- 重写 `App.tsx` 主内容区：项目执行时渲染 Timer + ProjectTaskBar，而非 ProjectMode
- `ProjectMode.tsx` 简化为只处理 setup 和 summary

#### 技术方案
`useProjectTimer` 新增 `ProjectTimerView` 接口：
```typescript
interface ProjectTimerView {
  timeLeft: number;        // 映射到 Timer
  totalDuration: number;   // 映射到 Timer
  phase: TimerPhase;       // 'work' | 'shortBreak'
  status: TimerStatus;     // 'running' | 'paused'
  taskName: string;        // 显示在 ProjectTaskBar
  progressLabel: string;   // "2/5"
  progressFraction: number;// 进度条
  isOvertime: boolean;     // 超时状态
  overtimeSeconds: number; // 超时秒数
}
```

构建产物：JS 319KB（比独立界面版 323KB 还小 4KB）

---

## v0.2.4 — 专注中修改背景音即时生效 + 4 种新时钟音效（2026-02-08）

### commit: abe1f30

### Bug 修复：专注中修改背景音不生效
- **问题：** 专注计时中打开混音器修改背景音，关闭弹窗后新的背景音不播放，需暂停再继续才生效
- **根因：** 混音器弹窗关闭时退出 preview 模式，但 App.tsx 的 `useEffect` 不会重新触发（`ambienceMixerKey` 在弹窗打开期间已更新，关闭时无变化）
- **修复：** `AmbienceMixerModal` 中用 `useRef` 追踪最新 config 和 `keepOnClose` 状态，弹窗卸载时若计时器在运行，主动调用 `applyMixerConfig(latestConfig)` 重新同步声音状态
- **涉及文件：** `AmbienceMixerModal.tsx`（核心修复）、`App.tsx`（ambienceMixerKey 序列化 + isWorkRunning prop）、`Settings.tsx`（传递 keepOnClose）

### 新增 4 种时钟音效（共 8 种）
上一轮已实现的 4 个 Sound 类正式接入混音器系统：
1. 🕰️ **老式座钟**（Grandfather Clock）— 低沉基频 300→150Hz + 180Hz 箱体共鸣，衰减 0.25s
2. ⌚ **怀表**（Pocket Watch）— 2800/2400Hz tick-tock 交替 + 高频金属泛音，500ms 间隔（比普通钟快一倍）
3. 🎵 **电子节拍器**（Metronome）— 1500/1000Hz 正弦脉冲，4 拍一循环，首拍重音
4. 💧 **水滴计时**（Water Drop）— 500-700Hz 下行滑音 + 延迟涟漪泛音

### 接入工作
- `mixer.ts`：`AmbienceSoundId` 类型新增 4 个 ID、`ALL_AMBIENCE_SOUNDS` 注册、`createSound` 工厂函数
- `i18n`：中英文翻译完整（老式座钟/Grandfather Clock 等）

### 改动统计
7 files changed, 192 insertions(+), 7 deletions(-)

---

## v0.2.3 — 4 项 Bug 修复 + 6 种新背景音（2026-02-08）

### commit: 5959fb6 → 3d09003

### Bug 修复
1. **Header Logo 替换**：从 emoji 改为实际产品 logo 图片（`favicon-32x32.png`）
2. **设置面板误关闭**：点击 Modal 内部（混音器/提醒音选择器）时设置面板不再关闭。添加 `data-modal-overlay` 属性 + `closest()` 检测
3. **时钟滴答声音量过小**：4 种时钟音效音量提升 3-4 倍
4. **咖啡厅音效重做**：完全重新设计 — 双层人声嘈杂（低频男声 + 高频女声）+ 陶瓷杯碟碰撞（含二次谐波）+ 意式咖啡机蒸汽声

### 新增 6 种背景音（总计 25 种）
- 🏕️ **篝火**（Campfire）— 低频温暖底噪 + 密集噼啪声 + 偶尔木头爆裂
- 🎹 **轻音乐**（Soft Piano）— 五声音阶随机音符，正弦波 + 二次泛音
- 🐱 **猫咪呼噜**（Cat Purr）— 25Hz 锯齿波 + 50Hz 正弦波，呼吸节奏调制
- 🌙 **夜晚**（Night）— 轻柔风声 + 远处蟋蟀 + 偶尔猫头鹰
- 🚂 **火车**（Train）— 低频车轮轰鸣 + 节奏性铁轨咔嗒声（双击模式）
- 🫧 **水下**（Underwater）— 深度低通滤波噪声 + 随机气泡上浮

### 改动统计
8 files changed, 469 insertions(+), 46 deletions(-)

---

## v0.2.2 — Logo 全站替换（2026-02-08）

### 图标更新
- 从 `logo-source.png`（1024x1024）生成全部尺寸图标
- `scripts/generate-icons.mjs`：一键生成脚本（sharp）
- Favicon：16x16, 32x32, 48x48 PNG + 多尺寸 .ico
- PWA：192x192, 512x512
- Apple touch icon：180x180
- Tauri 桌面端：32, 128, 256, 512 + .ico
- SVG：PNG palette 嵌入，11KB
- index.html 更新 favicon 引用

---

## v0.2.1 — 音效系统 4 项修复（2026-02-08）

### Bug 修复
- **自动开始休息失效**：useTimer interval effect 依赖 `[status]`，auto-start 时 status 不变导致 interval 不重启。加 `generation` 计数器，phase 切换时 bump 强制 interval 重建
- **混音器预览**：Modal 打开时进入 preview mode，实时播放/停止音效；`stopAllAmbience()` 在 preview mode 下变 no-op

### 音效拟真度优化
- 雨声：3 层设计（中频基底 + 高频水花 + 低频屋顶轰鸣）+ 慢速强度调制 + 变密度雨滴
- 雷雨：新增闪电劈裂声（高频噪声爆发）→ 触发雷声滚动；更深沉的雷鸣
- 虫鸣：完全重写 — 3-4 只独立蟋蟀，各自音高/节奏/立体声位置
- 鸟鸣：多音符乐句 + 立体声扩展 + 频率滑动

### 保留原有滴答声
- 4 种时钟滴答声加入混音器，新增「🕐 时钟」分类
- 背景音总数：19 种（原 15 + 4 种时钟）

### 改动统计
8 files changed, 407 insertions(+), 129 deletions(-)

---

## v0.2 — 音效系统大改版：自定义混音器 + 提醒音效升级（2026-02-08）

### 自定义背景音混音器
- 全新 `AmbienceMixerModal` 组件：弹窗式混音面板
- 15 种背景音，全部 Web Audio API 实时合成，零音频文件：
  - 🌧️ 自然类（7 种）：雨声、雷雨、海浪、溪流、鸟鸣、风声、虫鸣
  - 🏠 环境类（4 种）：咖啡厅、壁炉、键盘敲击、图书馆
  - 🎵 噪音类（4 种）：白噪音、粉噪音、棕噪音、双耳节拍
- 每个音效独立开关 + 独立音量滑块
- 支持多音效同时叠加组合
- 总音量由设置面板的"背景音量"控制
- 设置面板显示当前组合预览文字（如"雨声 + 白噪音"）+ 「自定义」按钮
- 组合选择和各音效音量持久化到 localStorage

### 提醒音效升级
- 10 种提醒音效（原 3 种 + 新增 7 种）：
  和弦、铃声、自然、木琴、钢琴、电子、水滴、鸟鸣、马林巴、锣声
- 全部 Web Audio API 合成
- `AlertPickerModal` 组件：弹窗选择 + 点击试听
- "提醒时长"改为"循环次数"（1/2/3/5 次）
- 音效按次数循环播放，每次间隔自动计算

### 音频架构重构
- 新建 `src/audio/` 模块，替代旧 `src/utils/notification.ts`
- `context.ts`：共享 AudioContext 单例 + 主音量控制节点
- `ambience/sounds.ts`：15 个 AmbienceSound 子类，基于 OOP 设计
- `alerts/sounds.ts`：10 个 alert 生成函数
- `mixer.ts`：混音器状态管理（启停、音量、配置应用）
- `index.ts`：统一导出

### 设置迁移
- `migrateSettings()` 函数：自动兼容旧版设置格式
- 旧 `sound` → `alertSound`，旧 `tickVolume` → `ambienceVolume`
- `useLocalStorage` hook 新增 `migrate` 参数

### 多语言
- 所有新增文案同步提供中英文翻译
- i18n `Messages` 接口新增：ambienceNames、alertNames、modalClose/Done 等

### 改动统计
- 新增文件：8 个（audio 模块 5 个 + 组件 2 个 + 类型更新）
- 修改文件：7 个（types、i18n、Settings、App、useLocalStorage 等）
- 删除文件：1 个（旧 notification.ts）
- 构建产物：JS 从 254KB → 278KB（+24KB），零音频文件

---

## v0.01 — MVP（2026-02-08）

### commit: 4c9a06a
- 项目搭建：React 19 + Vite 7 + Tailwind CSS 4 + TypeScript
- 核心计时逻辑：`useTimer` hook（工作/短休息/长休息阶段自动切换）
- 圆形进度环 SVG 计时器
- 任务输入框
- 今日完成统计
- 任务记录列表
- 浏览器通知 + 音效提醒
- localStorage 持久化
- 基础响应式布局

---

## v0.02 — 视觉升级（2026-02-08）

### commit: 121762b
- 全面 UI 重设计：现代、极简、精致风格
- 渐变进度环 + 发光头部圆点
- 内发光效果 + 径向渐变背景

### commit: fdf4171
- 根据反馈修复多项视觉问题

### commit: 2165d57 → 62e6b8d → 52c8d26
- 迭代调整进度环亮度、内发光强度、头部光晕大小
- 最终方案：强视觉效果，暗色背景下清晰可见

---

## v0.03 — 功能完善（2026-02-08）

### commit: 957aaef
- 自定义专注/休息时长（1-120 分钟）
- 长休息机制（每 N 轮触发）
- 3 种提醒音效可选（和弦/铃声/自然）

### commit: 0dc6daa
- 修复 Charles 反馈的 4 个问题

### commit: 09e8332
- Header 布局优化
- 番茄生长阶段系统（🌱→🍅，按专注时长分 5 级）
- 记录管理（编辑/删除）

### commit: 2396fd4
- 轮次进度改为圆点指示器，idle 时隐藏

### commit: b8399f5
- 提醒时长可调（1/3/5/10 秒）
- 5 种专注背景音（经典钟摆/轻柔滴答/机械钟表/木质钟声）
- 修复进度环发光裁切问题

### commit: f37cd9e
- 独立音量控制（提醒音 + 背景音）
- 5 套主题系统（暗色/亮色/森林/海洋/暖橙）
- 新手引导弹窗
- 全面代码注释

### commit: 7dc1315 — 庆祝动画 + 休息视觉差异
- `CelebrationOverlay` 组件：弹跳 emoji + 粒子纸屑 + 进度环脉冲 + 鼓励文字
- ≥25min 庆祝效果更强（更多粒子、更大弹跳、发光）
- 休息阶段视觉差异化：背景偏冷色、进度环/按钮切换 breakAccent 色
- 5 套主题全部更新休息配色
- 修复 RoundProgress/TodayStats 硬编码颜色

### commit: a2827e3 — Bug 修复 + 跳过记录
- **Bug**：暂停后可调时间 → 改为 running + paused 都锁定设置
- **Bug**：小屏幕设置按钮被挤 → Header 响应式优化 + z-index
- **功能**：手动跳过（skip）按实际专注时间记录，计入今日收获

### commit: baa498e — PWA 支持
- `vite-plugin-pwa`：generateSW 策略，预缓存所有静态资源
- Google Fonts 运行时缓存（CacheFirst，1 年）
- Web App Manifest：standalone + portrait
- App 图标：SVG 番茄+时钟 → PNG 192/512/180
- iOS meta 标签：web-app-capable、status-bar-style
- `InstallPrompt` 组件：友好安装横幅，关闭后不再弹

### commit: 142a93f
- **Bug**：PWA 打开自动弹键盘 → 删除 TaskInput 的 autofocus useEffect

### commit: 6042870 — 8 项改进
1. **放弃按钮**：计时中显示"放弃本次"，不计入记录
2. **空状态对比度**：用 theme 色替代硬编码 white/20
3. **删除确认**：inline "确认?" 红色文字，2.5s 自动恢复
4. **自动开始休息**（默认开）/ **自动开始工作**（默认关）
5. **快速调时间**：idle 点击数字弹出 8 档时长选择
6. 记录已是倒序（最新在前）✓
7. 数据结构已完整（completedAt ISO + durationMinutes）✓
8. **导出数据**：JSON 文件含记录+设置

### commit: c8d34d5
- README 全量更新，覆盖所有功能

### commit: 14d07e0 → a7dc324 — 放弃按钮样式迭代
- 从文字链接 → 圆角药丸按钮 + 边框
- 最终：`font-semibold` + `theme.text` 透明度底色/边框 + hover 变红

---

## v0.04 — 品牌升级 + 历史统计（2026-02-08）

### commit: b8e9f63 — 番茄→西瓜品牌升级
- 全局文案替换：番茄时钟→西瓜时钟
- PWA manifest name/short_name/description
- 页面 title、header emoji（🍉）、meta 标签
- 使用说明加入"基于番茄工作法（Pomodoro Technique）"
- CSS 选中色：红→绿
- **自定义 SVG 生长图标**（`GrowthIcon` 组件）：
  - 种子发芽：黑色西瓜籽+绿芽
  - 幼苗：绿苗+叶子+卷须
  - 开花：藤蔓+5 瓣黄花
  - 小西瓜：青绿圆形+条纹
  - 成熟西瓜：切开红瓤+黑籽+绿皮
- 所有引用点替换：TodayStats、TaskList、CelebrationOverlay、Guide
- App 图标重新设计：切开西瓜+时钟指针

### commit: 2cbdce1 — 小西瓜图标优化
- 颜色从深绿改为黄绿（#a3e635），模拟未成熟
- 条纹更浅（60% 透明度），个头更小
- 与成熟西瓜（深绿切开红瓤）形成明显对比

### commit: 47a3682 — 历史记录 + 统计图表 + 连续打卡
- **历史面板**（📅 按钮）：底部滑入面板，两个 Tab
- **月历视图**（`MiniCalendar`）：翻月、选日期、有记录日期圆点标记
- **日期详情**：选中某天显示所有记录
- **柱状图**（`BarChart`）：纯 SVG，7/30 天切换，带入场动画
- **汇总卡片**：本周/本月/累计时长+数量
- **连续打卡**：
  - 全自动：当天 ≥1 条记录 = 已打卡
  - Header 显示 🔥N
  - 统计面板：当前连续 + 历史最长
- **统计工具**（`stats.ts`）：分组、打卡计算、汇总、日期工具
- 无第三方图表库，gzip 增量约 3KB

---

## v0.05 — 多语言支持（2026-02-08）

### commit: daadb79
- 自建轻量 i18n 系统：React Context + `useI18n` hook，零第三方依赖
- `Messages` 类型接口（`src/i18n/types.ts`），编译时保证翻译 key 完整
- 完整中英文翻译字典（`src/i18n/locales/zh.ts` / `en.ts`）
- `detectLocale()` 自动检测浏览器语言，匹配不到默认中文
- 语言选择持久化到 `settings.language`（localStorage）
- Settings 面板新增语言切换入口（中文 / EN）
- 切换语言无需刷新：`I18nProvider` 响应 locale 变化即时更新
- 全部 12 个组件从硬编码中文迁移到 `useI18n()`：
  - App, Timer, TaskInput, TaskList, TodayStats, Settings
  - HistoryPanel, MiniCalendar, BarChart, Guide, CelebrationOverlay, InstallPrompt
- 主题名、音效名、生长阶段名等全部走 i18n
- `stats.ts` 的 `formatMinutes` / `getWeekdayShort` 不再被组件直接调用，改用 `t.formatMinutes` / `t.weekdaysShort`
- 17 files changed, 641 insertions(+), 138 deletions(-)

---

## v0.1 — Tauri 桌面应用 + CI 自动构建（2026-02-08）

### commit: (pending — feature/tauri-v0.1)
- Tauri 2.x 集成：手动搭建 `src-tauri` 项目结构
- `Cargo.toml`：tauri 2.10.2 + tray-icon feature + release 优化（LTO、strip、codegen-units=1）
- `tauri.conf.json`：窗口 420×780、系统托盘、NSIS + WiX (Windows)、deb + AppImage (Linux)
- `src/lib.rs` + `src/main.rs`：最小 Rust 入口，opener 插件
- `capabilities/default.json`：Tauri 2.x 权限系统
- `vite.config.ts` 更新：Tauri dev server 配置（固定端口、HMR、忽略 src-tauri）
- 图标生成：32x32、128x128、256x256、512x512 PNG + .ico (Windows)
- GitHub Actions workflow（`.github/workflows/tauri-build.yml`）：
  - 矩阵构建：ubuntu-22.04 + windows-latest
  - push tag `v*` 或手动触发
  - tauri-action 自动构建 + 发布到 GitHub Releases
  - Rust 缓存加速后续构建
- `.gitignore` 更新：排除 `src-tauri/target/`、`gen/`、`Cargo.lock`
- `package.json` 新增 `tauri` 脚本


### commit: pending — 提示展示策略优化（v0.8.9）
- 移除主页面常驻健康提示，减少主界面干扰
- 提示改为设置面板 Focus 时长下方条件显示
- 仅在 `workMinutes > 25` 时显示 tip（与防挂机策略一致）
