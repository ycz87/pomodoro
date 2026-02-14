# 🎨 徽章设计指南 — AI 生成提示词手册

> 日期：2026-02-14（v5 定稿版）
> 工具：Google Gemini 3 Pro Image Preview
> 关联文档：[成就系统 v2](ACHIEVEMENT-DESIGN-v2.md)

---

## 一、文件规范

### 存放位置
```
cosmelon/docs/badges/
```

### 命名规则
```
{系列前缀}{编号}-{英文短名}.png
```

### 文件要求
- 格式：JPG（生成后手动抠图转 PNG）
- 背景：白色
- 尺寸：512 × 512 px
- 形状：圆形图标

---

## 二、设计风格

### 整体风格
- 卡通徽章，伪 3D 效果（柔和阴影、微微光泽、圆润立体感）
- 构图要美观、有设计感，能传达每个成就的含义和故事
- 色彩明快清新，饱和度适中，颜色根据徽章主题自由搭配
- 所有物体颜色符合现实常识（西瓜籽棕色/黑色，果肉红/粉，瓜皮绿）

### 西瓜拟人元素
徽章中出现的西瓜/西瓜瓣带有拟人表情（跟 app logo 一致）：
- 两个小圆点黑色眼睛 + 一条浅浅的微笑弧线
- 可选：淡淡粉色腮红
- 参考 asamimichan 风格 — 安静、温柔、不夸张
- 注意：只有西瓜元素带这种表情，徽章的其他部分（场景、道具、背景）正常设计，不要全部 asamimichan 化

---

## 三、通用提示词（每个徽章前面都加这段）

```
A cute circular badge/medal icon on a clean white background. The badge has a clear circular border/rim (like a coin or medal edge), giving it a distinct badge shape. Inside the circular frame is the illustration. Pseudo-3D with soft shadows and gentle gloss. Style: asamimichan — soft, warm, dreamy, minimal. The design must be creative, cleverly using watermelon elements (rind, flesh, seeds, slices, vines). Keep it simple — one clear idea, minimal elements, instantly readable meaning. Any watermelon has a cute face: two tiny dot eyes and a gentle smile, with optional pink blush. Only watermelons have faces. Colors: fresh and vibrant, matching the theme. Realistic colors (seeds are brown/black, flesh is red/pink, rind is green). No text, no letters, no numbers.
```

---

## 四、系列色调提示（加在通用提示词后面）

```
⭐️ 坚持系列：Warm orange-gold accent tones. Feeling of persistence and warmth.
⏱️ 专注系列：Watermelon red as the dominant accent. Feeling of energy and focus.
🏠 瓜棚系列：Fresh watermelon green as the dominant color. Feeling of growth and abundance.
🌱 农场系列：Earthy warm brown mixed with green. Feeling of nurturing and harvest.
🌟 隐藏系列：Gold and soft purple sparkle accents. Feeling of mystery and discovery.
```

---

## 五、每个徽章的提示词

每条提示词接在「通用提示词 + 系列色调」后面。

### ⭐️ 坚持系列

| 文件名 | 中文名 | 提示词 |
|--------|--------|--------|
| S1-three-day-streak.png | 三天打鱼 | Three watermelon slices as stepping stones going up, each with a cute face. A small flame on top. |
| S2-week-warrior.png | 一周达人 | A mini calendar made of watermelon rind, 7 days all checked with golden watermelon seeds. |
| S3-fortnight-focus.png | 半月坚持 | A chain of watermelon-seed-shaped links, the center one glowing gold. Unbroken streak. |
| S4-iron-will.png | 钢铁意志 | A shield that is a watermelon cross-section — green rim, red center with a heart shape. |
| S5-century-legend.png | 百日传说 | A golden trophy cup shaped like a watermelon half, sparkles rising from it. |
| S6-hundred-days.png | 累计百天 | A sunrise where the sun is a watermelon (cute face), warm rays spreading out. |
| S7-early-bird.png | 早起鸟 | A cute bird whose body is a watermelon (green back, red belly), perched on a vine at sunrise. |
| S8-night-owl.png | 夜猫子 | A cute owl with a watermelon-pattern belly, sitting on a crescent moon. Starry night. |
| S9-weekend-warrior.png | 周末战士 | A watermelon slice (cute face) wearing a headband, fists up in a fighting pose. |
| S10-year-one.png | 西瓜元年 | A whole watermelon (cute face) as a birthday cake with one candle on top. Confetti. |

### ⏱️ 专注系列

| 文件名 | 中文名 | 提示词 |
|--------|--------|--------|
| F1-first-melon.png | 第一颗西瓜 | A tiny baby watermelon (cute shy face) with a sprout on top, sitting on soil. Warm glow around it. |
| F2-focus-rookie.png | 专注新手 | A watermelon cross-section as a clock face — seeds as hour markers, vine as clock hands. Cute face. A sprout on top. |
| F3-focus-pro.png | 专注达人 | A watermelon-clock with three golden stars orbiting it. Confident cute wink. |
| F4-focus-master.png | 专注大师 | A watermelon-clock wearing a golden crown made of vine and seed-gems. Proud cute face. |
| F5-focus-legend.png | 专注传奇 | A watermelon-clock radiating golden light, seeds turned gold. Epic aura. Serene face. |
| F6-time-lord.png | 时间领主 | An hourglass with watermelon halves as bulbs, golden seeds flowing as sand. Vine-wrapped frame. |
| F7-deep-dive.png | 深度潜水 | A watermelon (cute face) wearing a diving mask, underwater with bubbles. Blue tones. |
| F8-marathon-runner.png | 马拉松选手 | A watermelon (cute face) with tiny running shoes, breaking through a finish line. Speed lines. |
| F9-ten-a-day.png | 日产十瓜 | A pyramid of 10 tiny watermelons stacked up, each with a different cute expression. Top one has a crown. |
| F10-project-pro.png | 项目达人 | A clipboard made of watermelon slice, with seed-checkboxes all checked in gold. |

### 🏠 瓜棚系列

| 文件名 | 中文名 | 提示词 |
|--------|--------|--------|
| H1-first-harvest.png | 初次收获 | A watermelon seed cracking open in soil with a tiny sprout pushing through. Warm golden light above. |
| H2-full-garden.png | 满园春色 | Five watermelon growth stages in a row: seed → sprout → flower → small melon → big melon. Each with a happier face. |
| H3-golden-arrival.png | 金瓜降临 | A golden watermelon (amazed face) descending in a beam of golden light. Sparkles around it. |
| H4-golden-collector.png | 金瓜收藏家 | Five golden watermelons displayed on a vine shelf, each with a content face. Golden glow. |
| H5-warehouse-tycoon.png | 仓库大亨 | A cute shed with a watermelon-slice roof, door bursting open with watermelons tumbling out. |
| H6-first-synthesis.png | 合成初体验 | Two small watermelons (cute faces) merging into one bigger glowing watermelon. Sparkle trails. |
| H7-synthesis-master.png | 合成大师 | A flask shaped like a watermelon, with a golden watermelon (cute face) floating inside. Bubbling. |
| H8-first-slice.png | 第一刀 | A watermelon sliced open — two halves with surprised faces, red juice splash, seeds flying. |
| H9-hundred-slices.png | 切瓜百刀 | A knife with watermelon pieces arranged in a beautiful fan pattern around it. Masterful. |
| H10-tool-collector.png | 道具全收集 | A treasure chest made of watermelon rind, open with colorful glowing items inside. Golden light. |

### 🌱 农场系列

| 文件名 | 中文名 | 提示词 |
|--------|--------|--------|
| G1-first-planting.png | 播种者 | A hand placing a glowing watermelon seed into soil. A tiny watering can nearby. Warm light. |
| G2-first-farm-harvest.png | 第一次丰收 | A ripe watermelon (happy face) being lifted from its vine with sparkles. Lush green around. |
| G3-hundred-plants.png | 种植百株 | Bird's-eye view of a miniature watermelon farm with neat green rows. Tiny melons among leaves. |
| G4-galaxy-conqueror.png | 星系征服者 | A small planet that is a watermelon — green rind continents, red flesh oceans. A flag on top. Stars around. |
| G5-codex-master.png | 图鉴大师 | An open book with watermelon variety illustrations on its pages. Golden completion glow. |
| G6-alien-friend.png | 外星人之友 | A cute green alien holding a watermelon (cute face) as a gift. Spaceship shaped like a watermelon seed behind. |
| G7-thief-buster.png | 瓜贼克星 | A vine cage with a caught raccoon inside. A watermelon guard (cute smug face) standing proud next to it. |
| G8-evergreen-farm.png | 不枯之田 | Peaceful farm with watermelon vines and sleeping watermelons (cute faces). Golden sunset. Fireflies. |

### 🌟 隐藏系列

| 文件名 | 中文名 | 提示词 |
|--------|--------|--------|
| X1-time-traveler.png | 时间旅行者 | A swirling purple-gold vortex with a watermelon-clock (surprised face) being pulled in. Clock gears float around. |
| X2-valentine-melon.png | 情人节西瓜 | A heart-shaped watermelon (blushing face) with a pink bow. Tiny hearts floating around. |
| X3-sound-explorer.png | 音效探索家 | Headphones with watermelon halves as ear cups. Colorful music notes flowing out. |
| X4-perfectionist.png | 完美主义者 | A watermelon cut into a perfect diamond gem shape, floating with five golden stars orbiting it. Prismatic light. |
| X5-all-rounder.png | 全能玩家 | Three overlapping circles (red, green, brown) with a golden star glowing where they all meet. |
| X6-midnight-gardener.png | 午夜园丁 | A tiny glowing watermelon (sleeping face) next to a lantern made from a hollowed watermelon. Starry night, crescent moon, fireflies. |

---

## 六、生成技巧

1. 每次只生成一个徽章
2. 如果太复杂 → 加 "Simpler composition, fewer details, keep it clean and readable."
3. 如果不够美观 → 加 "Make it more visually polished and aesthetically pleasing, like a professional app badge."
4. 如果颜色不协调 → 加 "Fresh, cheerful, harmonious color palette."
5. 如果出现文字 → 加 "Absolutely no text or letters anywhere."
6. 如果西瓜表情太夸张 → 加 "The watermelon face should be very subtle: just two tiny dot eyes and a gentle smile curve, asamimichan style — quiet and warm."
7. 如果西瓜表情缺失 → 加 "The watermelon must have a cute personified face: two small dot eyes and a gentle smile."

## 七、生成后检查清单

- [ ] 512 × 512 px
- [ ] 白色背景（后期抠图）
- [ ] 构图美观，能传达成就含义
- [ ] 没有文字/字母/数字
- [ ] 西瓜元素带 asamimichan 拟人表情
- [ ] 其他元素正常设计，不全部拟人化
- [ ] 物体颜色符合现实（西瓜籽棕/黑色等）
- [ ] 色彩明快清新
- [ ] 缩小到 48px 仍能辨认主体
- [ ] 文件名正确，放在 `docs/badges/`
