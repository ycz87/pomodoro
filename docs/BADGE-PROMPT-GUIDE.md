# 🎨 徽章设计指南 — AI 生成提示词手册

> 日期：2026-02-14（v6 定稿版）
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

---

## 二、设计风格

### 核心关键词
创意 · 西瓜元素 · 可爱 · asamimichan · 简约 · 一眼看懂 · 浮雕质感

### 西瓜拟人
- 两个小圆点黑色眼睛 + 浅浅微笑 + 可选粉色腮红
- 只有西瓜带表情，其他元素正常

### 系列视觉区分
| 系列 | 徽章形状 | 底色 |
|------|----------|------|
| ⭐️ 坚持 | 圆形 Circular | 暖橙金 warm orange-gold |
| ⏱️ 专注 | 六边形 Hexagonal | 西瓜红 watermelon-red |
| 🏠 瓜棚 | 盾牌形 Shield | 翠绿 fresh green |
| 🌱 农场 | 方形圆角 Rounded square | 大地棕 earthy brown |
| 🌟 隐藏 | 星形 Star | 紫金 purple-gold |

---

## 三、通用提示词模板

每个徽章的完整提示词 = 模板（替换 `{SHAPE}`、`{COLOR}`、`{SCENE}`）：

```
A game achievement medal badge, white background. {SHAPE} medal with {COLOR} metallic rim and soft {COLOR} inner fill. Bas-relief style, embossed coin look — slightly raised with subtle depth. The main subject is a cute watermelon character with an asamimichan face (two small dot eyes, gentle smile, pink blush). No text, no ribbon, no banner. Simple and clean. {SCENE}
```

---

## 四、每个徽章的提示词

以下为完整可直接使用的提示词。

### ⭐️ 坚持系列（圆形 / 暖橙金）

| 文件名 | 中文名 | 提示词 |
|--------|--------|--------|
| S1-three-day-streak.png | 三天打鱼 | A game achievement medal badge, white background. Circular medal with warm orange-gold metallic rim and soft orange-gold inner fill. Bas-relief style, embossed coin look — slightly raised with subtle depth. The main subject is a cute watermelon character with an asamimichan face (two small dot eyes, gentle smile, pink blush). No text, no ribbon, no banner. Simple and clean. Three watermelon slices as stepping stones going up, each with a cute face. A small flame on top. |
| S2-week-warrior.png | 一周达人 | A game achievement medal badge, white background. Circular medal with warm orange-gold metallic rim and soft orange-gold inner fill. Bas-relief style, embossed coin look — slightly raised with subtle depth. The main subject is a cute watermelon character with an asamimichan face (two small dot eyes, gentle smile, pink blush). No text, no ribbon, no banner. Simple and clean. A mini calendar made of watermelon rind, 7 days all checked with golden watermelon seeds. |
| S3-fortnight-focus.png | 半月坚持 | A game achievement medal badge, white background. Circular medal with warm orange-gold metallic rim and soft orange-gold inner fill. Bas-relief style, embossed coin look — slightly raised with subtle depth. The main subject is a cute watermelon character with an asamimichan face (two small dot eyes, gentle smile, pink blush). No text, no ribbon, no banner. Simple and clean. A chain of watermelon-seed-shaped links, the center one glowing gold. |
| S4-iron-will.png | 钢铁意志 | A game achievement medal badge, white background. Circular medal with warm orange-gold metallic rim and soft orange-gold inner fill. Bas-relief style, embossed coin look — slightly raised with subtle depth. The main subject is a cute watermelon character with an asamimichan face (two small dot eyes, gentle smile, pink blush). No text, no ribbon, no banner. Simple and clean. A shield that is a watermelon cross-section — green rim, red center with a heart shape. |
| S5-century-legend.png | 百日传说 | A game achievement medal badge, white background. Circular medal with warm orange-gold metallic rim and soft orange-gold inner fill. Bas-relief style, embossed coin look — slightly raised with subtle depth. The main subject is a cute watermelon character with an asamimichan face (two small dot eyes, gentle smile, pink blush). No text, no ribbon, no banner. Simple and clean. A golden trophy cup shaped like a watermelon half, sparkles rising from it. |
| S6-hundred-days.png | 累计百天 | A game achievement medal badge, white background. Circular medal with warm orange-gold metallic rim and soft orange-gold inner fill. Bas-relief style, embossed coin look — slightly raised with subtle depth. The main subject is a cute watermelon character with an asamimichan face (two small dot eyes, gentle smile, pink blush). No text, no ribbon, no banner. Simple and clean. A sunrise where the sun is a watermelon (cute face), warm rays spreading out. |
| S7-early-bird.png | 早起鸟 | A game achievement medal badge, white background. Circular medal with warm orange-gold metallic rim and soft orange-gold inner fill. Bas-relief style, embossed coin look — slightly raised with subtle depth. The main subject is a cute watermelon character with an asamimichan face (two small dot eyes, gentle smile, pink blush). No text, no ribbon, no banner. Simple and clean. The watermelon character shaped like a bird with green back and red belly, perched on a vine at sunrise. |
| S8-night-owl.png | 夜猫子 | A game achievement medal badge, white background. Circular medal with warm orange-gold metallic rim and soft orange-gold inner fill. Bas-relief style, embossed coin look — slightly raised with subtle depth. The main subject is a cute watermelon character with an asamimichan face (two small dot eyes, gentle smile, pink blush). No text, no ribbon, no banner. Simple and clean. A cute owl with a watermelon-pattern belly, sitting on a crescent moon. Starry night. |
| S9-weekend-warrior.png | 周末战士 | A game achievement medal badge, white background. Circular medal with warm orange-gold metallic rim and soft orange-gold inner fill. Bas-relief style, embossed coin look — slightly raised with subtle depth. The main subject is a cute watermelon character with an asamimichan face (two small dot eyes, gentle smile, pink blush). No text, no ribbon, no banner. Simple and clean. A watermelon slice (cute face) wearing a headband, fists up in a fighting pose. |
| S10-year-one.png | 西瓜元年 | A game achievement medal badge, white background. Circular medal with warm orange-gold metallic rim and soft orange-gold inner fill. Bas-relief style, embossed coin look — slightly raised with subtle depth. The main subject is a cute watermelon character with an asamimichan face (two small dot eyes, gentle smile, pink blush). No text, no ribbon, no banner. Simple and clean. A whole watermelon (cute face) as a birthday cake with one candle on top. Confetti. |

### ⏱️ 专注系列（六边形 / 西瓜红）

| 文件名 | 中文名 | 提示词 |
|--------|--------|--------|
| F1-first-melon.png | 第一颗西瓜 | A game achievement medal badge, white background. Hexagonal medal with watermelon-red metallic rim and soft red inner fill. Bas-relief style, embossed coin look — slightly raised with subtle depth. The main subject is a cute watermelon character with an asamimichan face (two small dot eyes, gentle smile, pink blush). No text, no ribbon, no banner. Simple and clean. A tiny baby watermelon (cute shy face) with a sprout on top, sitting on soil. Warm glow. |
| F2-focus-rookie.png | 专注新手 | A game achievement medal badge, white background. Hexagonal medal with watermelon-red metallic rim and soft red inner fill. Bas-relief style, embossed coin look — slightly raised with subtle depth. The main subject is a cute watermelon character with an asamimichan face (two small dot eyes, gentle smile, pink blush). No text, no ribbon, no banner. Simple and clean. A watermelon cross-section as a clock face — seeds as hour markers, vine as clock hands. Cute face. |
| F3-focus-pro.png | 专注达人 | A game achievement medal badge, white background. Hexagonal medal with watermelon-red metallic rim and soft red inner fill. Bas-relief style, embossed coin look — slightly raised with subtle depth. The main subject is a cute watermelon character with an asamimichan face (two small dot eyes, gentle smile, pink blush). No text, no ribbon, no banner. Simple and clean. A watermelon-clock with three golden stars orbiting it. Confident cute wink. |
| F4-focus-master.png | 专注大师 | A game achievement medal badge, white background. Hexagonal medal with watermelon-red metallic rim and soft red inner fill. Bas-relief style, embossed coin look — slightly raised with subtle depth. The main subject is a cute watermelon character with an asamimichan face (two small dot eyes, gentle smile, pink blush). No text, no ribbon, no banner. Simple and clean. A watermelon-clock wearing a golden crown made of vine and seed-gems. Proud cute face. |
| F5-focus-legend.png | 专注传奇 | A game achievement medal badge, white background. Hexagonal medal with watermelon-red metallic rim and soft red inner fill. Bas-relief style, embossed coin look — slightly raised with subtle depth. The main subject is a cute watermelon character with an asamimichan face (two small dot eyes, gentle smile, pink blush). No text, no ribbon, no banner. Simple and clean. A watermelon-clock radiating golden light, seeds turned gold. Epic aura. Serene face. |
| F6-time-lord.png | 时间领主 | A game achievement medal badge, white background. Hexagonal medal with watermelon-red metallic rim and soft red inner fill. Bas-relief style, embossed coin look — slightly raised with subtle depth. The main subject is a cute watermelon character with an asamimichan face (two small dot eyes, gentle smile, pink blush). No text, no ribbon, no banner. Simple and clean. A watermelon hourglass — watermelon halves as bulbs, golden seeds flowing as sand. |
| F7-deep-dive.png | 深度潜水 | A game achievement medal badge, white background. Hexagonal medal with watermelon-red metallic rim and soft red inner fill. Bas-relief style, embossed coin look — slightly raised with subtle depth. The main subject is a cute watermelon character with an asamimichan face (two small dot eyes, gentle smile, pink blush). No text, no ribbon, no banner. Simple and clean. A watermelon character wearing a diving mask, underwater with bubbles. Blue tones. |
| F8-marathon-runner.png | 马拉松选手 | A game achievement medal badge, white background. Hexagonal medal with watermelon-red metallic rim and soft red inner fill. Bas-relief style, embossed coin look — slightly raised with subtle depth. The main subject is a cute watermelon character with an asamimichan face (two small dot eyes, gentle smile, pink blush). No text, no ribbon, no banner. Simple and clean. The watermelon character wearing tiny running shoes, breaking through a finish line with speed lines behind. |
| F9-ten-a-day.png | 日产十瓜 | A game achievement medal badge, white background. Hexagonal medal with watermelon-red metallic rim and soft red inner fill. Bas-relief style, embossed coin look — slightly raised with subtle depth. The main subject is a cute watermelon character with an asamimichan face (two small dot eyes, gentle smile, pink blush). No text, no ribbon, no banner. Simple and clean. A pyramid of 10 tiny watermelons stacked up, each with a different cute expression. Top one has a crown. |
| F10-project-pro.png | 项目达人 | A game achievement medal badge, white background. Hexagonal medal with watermelon-red metallic rim and soft red inner fill. Bas-relief style, embossed coin look — slightly raised with subtle depth. The main subject is a cute watermelon character with an asamimichan face (two small dot eyes, gentle smile, pink blush). No text, no ribbon, no banner. Simple and clean. A clipboard made of watermelon slice, with seed-checkboxes all checked in gold. |

### 🏠 瓜棚系列（盾牌形 / 翠绿）

| 文件名 | 中文名 | 提示词 |
|--------|--------|--------|
| H1-first-harvest.png | 初次收获 | A game achievement medal badge, white background. Shield-shaped medal with fresh green metallic rim and soft green inner fill. Bas-relief style, embossed coin look — slightly raised with subtle depth. The main subject is a cute watermelon character with an asamimichan face (two small dot eyes, gentle smile, pink blush). No text, no ribbon, no banner. Simple and clean. A watermelon seed cracking open in soil with a tiny sprout pushing through. Warm golden light above. |
| H2-full-garden.png | 满园春色 | A game achievement medal badge, white background. Shield-shaped medal with fresh green metallic rim and soft green inner fill. Bas-relief style, embossed coin look — slightly raised with subtle depth. The main subject is a cute watermelon character with an asamimichan face (two small dot eyes, gentle smile, pink blush). No text, no ribbon, no banner. Simple and clean. Five watermelon growth stages in a row: seed, sprout, flower, small melon, big melon. Each with a happier face. |
| H3-golden-arrival.png | 金瓜降临 | A game achievement medal badge, white background. Shield-shaped medal with fresh green metallic rim and soft green inner fill. Bas-relief style, embossed coin look — slightly raised with subtle depth. The main subject is a cute watermelon character with an asamimichan face (two small dot eyes, gentle smile, pink blush). No text, no ribbon, no banner. Simple and clean. A golden watermelon (amazed face) descending in a beam of golden light. Sparkles around it. |
| H4-golden-collector.png | 金瓜收藏家 | A game achievement medal badge, white background. Shield-shaped medal with fresh green metallic rim and soft green inner fill. Bas-relief style, embossed coin look — slightly raised with subtle depth. The main subject is a cute watermelon character with an asamimichan face (two small dot eyes, gentle smile, pink blush). No text, no ribbon, no banner. Simple and clean. Five golden watermelons displayed on a vine shelf, each with a content face. Golden glow. |
| H5-warehouse-tycoon.png | 仓库大亨 | A game achievement medal badge, white background. Shield-shaped medal with fresh green metallic rim and soft green inner fill. Bas-relief style, embossed coin look — slightly raised with subtle depth. The main subject is a cute watermelon character with an asamimichan face (two small dot eyes, gentle smile, pink blush). No text, no ribbon, no banner. Simple and clean. A cute shed with a watermelon-slice roof, door bursting open with watermelons tumbling out. |
| H6-first-synthesis.png | 合成初体验 | A game achievement medal badge, white background. Shield-shaped medal with fresh green metallic rim and soft green inner fill. Bas-relief style, embossed coin look — slightly raised with subtle depth. The main subject is a cute watermelon character with an asamimichan face (two small dot eyes, gentle smile, pink blush). No text, no ribbon, no banner. Simple and clean. Two small watermelons (cute faces) merging into one bigger glowing watermelon. Sparkle trails. |
| H7-synthesis-master.png | 合成大师 | A game achievement medal badge, white background. Shield-shaped medal with fresh green metallic rim and soft green inner fill. Bas-relief style, embossed coin look — slightly raised with subtle depth. The main subject is a cute watermelon character with an asamimichan face (two small dot eyes, gentle smile, pink blush). No text, no ribbon, no banner. Simple and clean. A flask shaped like a watermelon, with a golden watermelon (cute face) floating inside. Bubbling. |
| H8-first-slice.png | 第一刀 | A game achievement medal badge, white background. Shield-shaped medal with fresh green metallic rim and soft green inner fill. Bas-relief style, embossed coin look — slightly raised with subtle depth. The main subject is a cute watermelon character with an asamimichan face (two small dot eyes, gentle smile, pink blush). No text, no ribbon, no banner. Simple and clean. A watermelon sliced open — two halves with surprised faces, red juice splash, seeds flying. |
| H9-hundred-slices.png | 切瓜百刀 | A game achievement medal badge, white background. Shield-shaped medal with fresh green metallic rim and soft green inner fill. Bas-relief style, embossed coin look — slightly raised with subtle depth. The main subject is a cute watermelon character with an asamimichan face (two small dot eyes, gentle smile, pink blush). No text, no ribbon, no banner. Simple and clean. A knife with watermelon pieces arranged in a beautiful fan pattern around it. |
| H10-tool-collector.png | 道具全收集 | A game achievement medal badge, white background. Shield-shaped medal with fresh green metallic rim and soft green inner fill. Bas-relief style, embossed coin look — slightly raised with subtle depth. The main subject is a cute watermelon character with an asamimichan face (two small dot eyes, gentle smile, pink blush). No text, no ribbon, no banner. Simple and clean. A treasure chest made of watermelon rind, open with colorful glowing items inside. Golden light. |

### 🌱 农场系列（方形圆角 / 大地棕）

| 文件名 | 中文名 | 提示词 |
|--------|--------|--------|
| G1-first-planting.png | 播种者 | A game achievement medal badge, white background. Rounded square medal with earthy brown metallic rim and soft brown inner fill. Bas-relief style, embossed coin look — slightly raised with subtle depth. The main subject is a cute watermelon character with an asamimichan face (two small dot eyes, gentle smile, pink blush). No text, no ribbon, no banner. Simple and clean. A hand placing a glowing watermelon seed into soil. A tiny watering can nearby. Warm light. |
| G2-first-farm-harvest.png | 第一次丰收 | A game achievement medal badge, white background. Rounded square medal with earthy brown metallic rim and soft brown inner fill. Bas-relief style, embossed coin look — slightly raised with subtle depth. The main subject is a cute watermelon character with an asamimichan face (two small dot eyes, gentle smile, pink blush). No text, no ribbon, no banner. Simple and clean. A ripe watermelon (happy face) being lifted from its vine with sparkles. Lush green around. |
| G3-hundred-plants.png | 种植百株 | A game achievement medal badge, white background. Rounded square medal with earthy brown metallic rim and soft brown inner fill. Bas-relief style, embossed coin look — slightly raised with subtle depth. The main subject is a cute watermelon character with an asamimichan face (two small dot eyes, gentle smile, pink blush). No text, no ribbon, no banner. Simple and clean. Bird's-eye view of a miniature watermelon farm with neat green rows. Tiny melons among leaves. |
| G4-galaxy-conqueror.png | 星系征服者 | A game achievement medal badge, white background. Rounded square medal with earthy brown metallic rim and soft brown inner fill. Bas-relief style, embossed coin look — slightly raised with subtle depth. The main subject is a cute watermelon character with an asamimichan face (two small dot eyes, gentle smile, pink blush). No text, no ribbon, no banner. Simple and clean. A small planet that is a watermelon — green rind continents, red flesh oceans. A flag on top. Stars around. |
| G5-codex-master.png | 图鉴大师 | A game achievement medal badge, white background. Rounded square medal with earthy brown metallic rim and soft brown inner fill. Bas-relief style, embossed coin look — slightly raised with subtle depth. The main subject is a cute watermelon character with an asamimichan face (two small dot eyes, gentle smile, pink blush). No text, no ribbon, no banner. Simple and clean. An open book with watermelon variety illustrations on its pages. Golden completion glow. |
| G6-alien-friend.png | 外星人之友 | A game achievement medal badge, white background. Rounded square medal with earthy brown metallic rim and soft brown inner fill. Bas-relief style, embossed coin look — slightly raised with subtle depth. The main subject is a cute watermelon character with an asamimichan face (two small dot eyes, gentle smile, pink blush). No text, no ribbon, no banner. Simple and clean. A cute green alien holding a watermelon (cute face) as a gift. Spaceship shaped like a watermelon seed behind. |
| G7-thief-buster.png | 瓜贼克星 | A game achievement medal badge, white background. Rounded square medal with earthy brown metallic rim and soft brown inner fill. Bas-relief style, embossed coin look — slightly raised with subtle depth. The main subject is a cute watermelon character with an asamimichan face (two small dot eyes, gentle smile, pink blush). No text, no ribbon, no banner. Simple and clean. A vine cage with a caught raccoon inside. A watermelon guard (cute smug face) standing proud next to it. |
| G8-evergreen-farm.png | 不枯之田 | A game achievement medal badge, white background. Rounded square medal with earthy brown metallic rim and soft brown inner fill. Bas-relief style, embossed coin look — slightly raised with subtle depth. The main subject is a cute watermelon character with an asamimichan face (two small dot eyes, gentle smile, pink blush). No text, no ribbon, no banner. Simple and clean. Peaceful farm with watermelon vines and sleeping watermelons (cute faces). Golden sunset. Fireflies. |

### 🌟 隐藏系列（星形 / 紫金）

| 文件名 | 中文名 | 提示词 |
|--------|--------|--------|
| X1-time-traveler.png | 时间旅行者 | A game achievement medal badge, white background. Star-shaped medal with purple-gold metallic rim and soft purple inner fill. Bas-relief style, embossed coin look — slightly raised with subtle depth. The main subject is a cute watermelon character with an asamimichan face (two small dot eyes, gentle smile, pink blush). No text, no ribbon, no banner. Simple and clean. A swirling purple-gold vortex with a watermelon-clock (surprised face) being pulled in. Clock gears float around. |
| X2-valentine-melon.png | 情人节西瓜 | A game achievement medal badge, white background. Star-shaped medal with purple-gold metallic rim and soft purple inner fill. Bas-relief style, embossed coin look — slightly raised with subtle depth. The main subject is a cute watermelon character with an asamimichan face (two small dot eyes, gentle smile, pink blush). No text, no ribbon, no banner. Simple and clean. A heart-shaped watermelon (blushing face) with a pink bow. Tiny hearts floating around. |
| X3-sound-explorer.png | 音效探索家 | A game achievement medal badge, white background. Star-shaped medal with purple-gold metallic rim and soft purple inner fill. Bas-relief style, embossed coin look — slightly raised with subtle depth. The main subject is a cute watermelon character with an asamimichan face (two small dot eyes, gentle smile, pink blush). No text, no ribbon, no banner. Simple and clean. Headphones with watermelon halves as ear cups. Colorful music notes flowing out. |
| X4-perfectionist.png | 完美主义者 | A game achievement medal badge, white background. Star-shaped medal with purple-gold metallic rim and soft purple inner fill. Bas-relief style, embossed coin look — slightly raised with subtle depth. The main subject is a cute watermelon character with an asamimichan face (two small dot eyes, gentle smile, pink blush). No text, no ribbon, no banner. Simple and clean. A watermelon cut into a perfect diamond gem shape, floating with five golden stars orbiting it. |
| X5-all-rounder.png | 全能玩家 | A game achievement medal badge, white background. Star-shaped medal with purple-gold metallic rim and soft purple inner fill. Bas-relief style, embossed coin look — slightly raised with subtle depth. The main subject is a cute watermelon character with an asamimichan face (two small dot eyes, gentle smile, pink blush). No text, no ribbon, no banner. Simple and clean. Three overlapping circles (red, green, brown) with a golden star glowing where they all meet. |
| X6-midnight-gardener.png | 午夜园丁 | A game achievement medal badge, white background. Star-shaped medal with purple-gold metallic rim and soft purple inner fill. Bas-relief style, embossed coin look — slightly raised with subtle depth. The main subject is a cute watermelon character with an asamimichan face (two small dot eyes, gentle smile, pink blush). No text, no ribbon, no banner. Simple and clean. The watermelon character holding a tiny watering can next to a sprout, under a crescent moon and stars. Peaceful night scene. |

---

## 五、生成技巧

1. 每次只生成一个徽章
2. 如果太复杂 → 加 "Simpler composition, fewer details."
3. 如果不够像徽章 → 加 "More like a real embossed metal medal."
4. 如果西瓜没有表情 → 加 "The watermelon must have a cute face: two dot eyes and a gentle smile."
5. 如果出现文字 → 加 "Absolutely no text or letters anywhere."
6. 如果太立体 → 加 "Flatter, more like a bas-relief engraving."
7. 如果太扁平 → 加 "Add subtle raised depth, like an embossed coin."

## 六、生成后检查清单

- [ ] 512 × 512 px
- [ ] 白色背景（后期抠图）
- [ ] 徽章形状正确（对应系列）
- [ ] 浮雕质感（不是纯平面也不是完全 3D）
- [ ] 西瓜有 asamimichan 拟人表情
- [ ] 没有文字/字母/数字
- [ ] 没有 ribbon/banner
- [ ] 一眼能看懂含义
- [ ] 缩小到 48px 仍能辨认主体
- [ ] 文件名正确，放在 `docs/badges/`
