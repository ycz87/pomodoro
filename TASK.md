# TASK.md - 任务进度

## 当前任务：Phase 6 Step 2 — 暗物质星
派发时间：2026-02-20 00:50（北京时间）
优先级：P0
背景：Phase 6 Step 1（五行融合+幻彩星）已完成，继续推进 Phase 6。
目标：实现暗物质星 3 个品种 + 虚空瓜/黑洞瓜融合 + 宇宙之心终极动画。

## 子任务
- [x] 暗物质星 3 个品种数据录入（完成 01:08）
- [x] 虚空瓜融合逻辑（5颗幻彩基因 → 100%成功）（完成 01:08）
- [x] 黑洞瓜融合逻辑（10种双元素基因 → 100%成功）（完成 01:08）
- [x] 宇宙之心自动出现逻辑（全收集78品种触发）（完成 01:08）
- [x] 终极动画（宇宙之心出现特效）（完成 01:08）
- [x] 图鉴内获取指引 UI（暗物质品种点击剪影显示条件）（完成 01:08）
- [x] i18n 8 语言翻译（完成 01:08）
- [x] E2E 测试（完成 01:10，8/8 通过）
- [x] Claude Code 审查（完成 01:24，发现 2 个必须修复问题）
- [-] 修复审查问题（进行中 01:24）

## 验收标准
- 拥有5个不同幻彩基因时虚空瓜融合按钮可用，点击后100%成功（E2E 测试覆盖）
- 拥有10种双元素基因时黑洞瓜融合按钮可用，点击后100%成功（E2E 测试覆盖）
- 集齐78品种后宇宙之心自动出现 + 终极动画播放（E2E 测试覆盖）
- 图鉴内暗物质品种剪影点击显示获取指引（视觉验收）
- i18n 8 语言正确显示（视觉验收）
- E2E 测试覆盖三种融合 + 宇宙之心触发

## 技术方案（参考你的计划）

**数据结构：**
```typescript
// types/gene.ts 新增
interface DarkMatterFusion {
  type: 'void' | 'blackhole' | 'cosmic-heart';
  requiredGenes: string[]; // 需要的基因 ID 列表
  success: boolean;
}
```

**核心逻辑：**
- 虚空瓜：检查背包里是否有 5 个不同幻彩品种的基因，有则消耗 → 100% 产出虚空瓜种子
- 黑洞瓜：检查背包里是否有全部 10 种双元素组合的基因（土火/土水/.../木金），有则消耗 → 100% 产出黑洞瓜种子
- 宇宙之心：监听图鉴收集进度，当 encyclopedia.collected.length === 78 时触发特殊事件 → 弹窗动画 → 自动添加宇宙之心到图鉴 + 背包

**UI 布局：**
- 基因实验室新增"暗物质融合"区域（五行融合下方）
- 两个按钮：虚空瓜融合 / 黑洞瓜融合
- 按钮下方显示所需基因清单 + 当前拥有状态（✅/❌）
- 图鉴内暗物质品种剪影点击 → 弹窗显示获取指引

**集成点：**
- `src/store/geneStore.ts` 新增 `fuseDarkMatter()` 方法
- `src/store/encyclopediaStore.ts` 新增 `checkCosmicHeart()` 监听器
- `src/components/Farm/GeneLabTab.tsx` 新增暗物质融合区
- `src/components/Farm/EncyclopediaTab.tsx` 修改品种详情弹窗，暗物质品种显示指引
- `src/data/varieties.ts` 新增暗物质星 3 个品种数据

## 相关文件
- `/home/ycz87/cosmelon/docs/FARM-DESIGN-v3.md` — 农场设计完整文档
- `/home/ycz87/cosmelon/docs/FARM-ROADMAP-v1.md` — Phase 6 详细说明
- `/home/ycz87/cosmelon/docs/ENCYCLOPEDIA-v1.md` — 品种数据

## 阻塞
无

---

## 历史记录
- Phase 6 Step 1 (v0.33.0): 五行融合 + 幻彩星 ✅
- Phase 5 Step 2 (v0.32.0): 星际大盗 + 防护道具 + 月神甘露 ✅
- Phase 5 Step 1 (v0.31.0): 变异系统 ✅
- Phase 4 Step 2 (v0.30.0): 买道具 + 地块购买 ✅
- Phase 4 Step 1 (v0.29.0): 瓜币系统 + 商城框架 + 卖瓜 ✅
- Phase 3 Step 3 (v0.28.0): 双元素融合 + 杂交品种 ✅
- Phase 3 Step 2 (v0.27.0): 基因注入系统 ✅
- Phase 3 Step 1 (v0.26.0): 基因片段系统 + 基因实验室 UI ✅
- Phase 2 (v0.22.0): 生长机制 + 四大星系 + 图鉴升级 ✅
