# TASK.md - 任务进度

## 当前任务：Phase 6 Step 3 — 天气 + 生命感
派发时间：2026-02-20 01:31（北京时间）
优先级：P0
背景：Phase 6 Step 1（五行融合+幻彩星）和 Step 2（暗物质星）已完成，继续推进 Phase 6。
目标：实现天气系统 + 小动物装饰 + 外星人对话，为农场增添生命感和趣味性。

## 子任务
- [x] 天气系统（5种天气随机切换）（完成 01:42）
- [x] 天气切换逻辑（每6小时随机）（完成 01:42）
- [x] 小动物装饰系统（4种小动物偶尔出现）（完成 01:42）
- [x] 小动物出现逻辑（随机位置 + 随机时机）（完成 01:42）
- [x] 外星人对话系统（瓜瓜星人/变异博士随机出现 + 对话）（完成 01:42）
- [x] 天气/小动物/外星人 UI 渲染（完成 01:42）
- [x] i18n 8 语言翻译（外星人对话）（完成 01:42）
- [x] E2E 测试（完成 01:58，3/3 通过）
- [x] Claude Code 审查（完成 02:04，发现 3 个必须修复问题）
- [-] 修复审查问题（进行中 02:04）

## 验收标准
- 天气每6小时随机切换，彩虹稀有出现（E2E 测试覆盖）
- 小动物偶尔出现在瓜田，停留几秒后消失（E2E 测试覆盖）
- 瓜瓜星人/变异博士按概率出现 + 显示对话（E2E 测试覆盖）
- i18n 8 语言正确显示外星人对话（视觉验收）
- E2E 测试覆盖天气切换 + 小动物出现 + 外星人触发

## 技术方案（参考你的计划）

**数据结构：**
```typescript
// types/farm.ts 新增
type Weather = 'sunny' | 'cloudy' | 'rainy' | 'night' | 'rainbow';

interface WeatherState {
  current: Weather;
  lastChangeAt: number; // 上次切换时间戳
}

interface Creature {
  id: string;
  type: 'bee' | 'butterfly' | 'ladybug' | 'bird';
  x: number; // 位置 %
  y: number;
  appearAt: number; // 出现时间戳
  duration: number; // 停留时长 ms
}

interface AlienVisit {
  type: 'melon-alien' | 'mutation-doctor';
  appearAt: number;
  dialogue: string; // i18n key
}
```

**核心逻辑：**
- 天气切换：每次打开 app 检查距离上次切换是否≥6h，是则随机切换（彩虹5%概率，其他均分）
- 小动物：每次打开 app 10% 概率出现一只，随机类型 + 随机位置，停留 5-15 秒后消失
- 外星人：瓜瓜星人（≥3棵瓜时10%/天）、变异博士（使用基因改造液时15%触发），出现后显示对话气泡 3 秒

**UI 布局：**
- 天气：瓜田背景层渲染对应天气效果（CSS filter + SVG overlay）
- 小动物：absolute 定位在瓜田上方，CSS animation 飞行/爬行
- 外星人：瓜田右下角出现头像 + 对话气泡

**集成点：**
- `src/store/farmStore.ts` 新增 `weatherState` + `creatures` + `alienVisit`
- `src/components/Farm/FarmTab.tsx` 渲染天气层 + 小动物层 + 外星人层
- `src/utils/weather.ts` 天气切换逻辑
- `src/utils/creatures.ts` 小动物生成逻辑
- `src/locales/*.json` 新增外星人对话 i18n key

## 相关文件
- `/home/ycz87/cosmelon/docs/FARM-DESIGN-v3.md` — 农场设计完整文档
- `/home/ycz87/cosmelon/docs/FARM-ROADMAP-v1.md` — Phase 6 详细说明

## 阻塞
无

---

## 历史记录
- Phase 6 Step 2 (v0.34.0): 暗物质星 ✅
- Phase 6 Step 1 (v0.33.0): 五行融合 + 幻彩星 ✅
- Phase 5 Step 2 (v0.32.0): 星际大盗 + 防护道具 + 月神甘露 ✅
- Phase 5 Step 1 (v0.31.0): 变异系统 ✅
- Phase 4 Step 2 (v0.30.0): 买道具 + 地块购买 ✅
- Phase 4 Step 1 (v0.29.0): 瓜币系统 + 商城框架 + 卖瓜 ✅
- Phase 3 Step 3 (v0.28.0): 双元素融合 + 杂交品种 ✅
- Phase 3 Step 2 (v0.27.0): 基因注入系统 ✅
- Phase 3 Step 1 (v0.26.0): 基因片段系统 + 基因实验室 UI ✅
- Phase 2 (v0.22.0): 生长机制 + 四大星系 + 图鉴升级 ✅
