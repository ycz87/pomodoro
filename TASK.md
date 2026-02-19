# TASK.md - 任务进度

## 当前任务：Phase 6 Step 1 — 五行融合 + 幻彩星
派发时间：2026-02-19 23:51（北京时间）
优先级：P0
背景：Phase 1-5 已全部完成，开始 Phase 6 最终阶段。
目标：实现五行融合系统 + 幻彩星 5 个品种 + 幻彩特殊生长机制。

## 子任务
- [x] 五行共鸣条件判定逻辑（完成 00:10）
- [x] 基因实验室第三个操作区 UI（五行融合按钮）（完成 00:10）
- [x] 融合成功率计算（50% + 稀有度加成）（完成 00:10）
- [x] 失败返还随机基因逻辑（完成 00:10）
- [x] 幻彩品种保底机制（重复3次后必出新品种）（完成 00:10）
- [x] 幻彩星 5 个品种数据录入（完成 00:10）
- [x] 幻彩种子种植 + 50000min 成熟时间（完成 00:10）
- [x] 幻彩不枯萎只暂停逻辑（进度倒退5%/天，最多50%）（完成 00:10）
- [x] i18n 8 语言翻译（完成 00:10）
- [x] E2E 测试（完成 00:25，7/7 通过）
- [x] Claude Code 审查（完成 00:42，发现 4 个必须修复问题）
- [-] 修复审查问题（进行中 00:42）

## 验收标准
- 五行共鸣条件达成后"五行融合"按钮出现（E2E 测试覆盖）
- 融合成功产出幻彩种子，失败返还1份随机基因（E2E 测试覆盖）
- 同品种重复3次后下一次必出新品种（E2E 测试覆盖）
- 幻彩种子种下后正确生长，离线>72h 不枯萎只暂停（E2E 测试覆盖）
- 暂停后每天倒退5%进度，最多50%（E2E 测试覆盖）
- i18n 8 语言正确显示（视觉验收）
- E2E 测试覆盖融合流程 + 保底机制 + 暂停逻辑

## 技术方案（参考你的计划）

**数据结构：**
```typescript
// types/farm.ts 新增
interface FusionHistory {
  varietyId: string;
  count: number; // 该品种重复次数
}

interface PlantState {
  // 现有字段...
  pausedAt?: number; // 幻彩暂停时间戳
  pausedProgress?: number; // 暂停时的进度
}

// types/gene.ts 新增
interface FusionResult {
  success: boolean;
  seed?: Seed;
  returnedGene?: Gene; // 失败时返还的基因
}
```

**核心逻辑：**
- 五行共鸣判定：检查 genes 背包里是否五星系各≥1 + 已收获杂交品种≥3
- 融合成功率：base 50% + 每个基因稀有度加成（⭐+0% / ⭐⭐+10% / ⭐⭐⭐+20% / ⭐⭐⭐⭐+30%），取5个基因平均
- 保底机制：localStorage 存 fusionHistory，记录每个幻彩品种出现次数，同品种≥3次后从未获得品种池抽取
- 幻彩暂停：离线>72h 时不枯萎，记录 pausedAt，每次打开计算暂停天数 × 5% 倒退进度（最多50%）

**UI 布局：**
- 基因实验室第三个操作区（注入、融合下方）
- 标题："五行融合"
- 前置条件未达成时显示锁定状态 + 提示文案
- 达成后显示大按钮 + 当前五行基因库存
- 点击后弹窗确认 → 融合动画 → 结果展示

**集成点：**
- `src/store/geneStore.ts` 新增 `fuseFiveElements()` 方法
- `src/store/farmStore.ts` 修改 `updatePlantGrowth()` 处理幻彩暂停逻辑
- `src/components/Farm/GeneLabTab.tsx` 新增第三个操作区
- `src/data/varieties.ts` 新增幻彩星 5 个品种数据

## 相关文件
- `/home/ycz87/cosmelon/docs/FARM-DESIGN-v3.md` — 农场设计完整文档
- `/home/ycz87/cosmelon/docs/FARM-ROADMAP-v1.md` — Phase 6 详细说明
- `/home/ycz87/cosmelon/docs/ENCYCLOPEDIA-v1.md` — 品种数据

## 阻塞
无

---

## 历史记录
- Phase 5 Step 2 (v0.32.0): 星际大盗 + 防护道具 + 月神甘露 ✅
- Phase 5 Step 1 (v0.31.0): 变异系统 ✅
- Phase 4 Step 2 (v0.30.0): 买道具 + 地块购买 ✅
- Phase 4 Step 1 (v0.29.0): 瓜币系统 + 商城框架 + 卖瓜 ✅
- Phase 3 Step 3 (v0.28.0): 双元素融合 + 杂交品种 ✅
- Phase 3 Step 2 (v0.27.0): 基因注入系统 ✅
- Phase 3 Step 1 (v0.26.0): 基因片段系统 + 基因实验室 UI ✅
- Phase 2 (v0.22.0): 生长机制 + 四大星系 + 图鉴升级 ✅
