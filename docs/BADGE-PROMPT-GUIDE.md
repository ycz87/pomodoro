# 🎨 徽章设计指南 — AI 生成提示词手册

> 日期：2026-02-14（v4 简约可爱版）
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

## 二、设计风格参考

以西瓜时钟 logo 为基准：
- 卡通徽章风格，伪 3D 效果（柔和阴影、微微光泽、圆润立体感）
- 造型简约圆润，没有多余细节
- 色彩明快清新，饱和度适中，不沉闷不刺眼
- 颜色不限于 logo 的绿红白，可以根据每个徽章的主题自由搭配，但整体风格要跟 logo 一致
- 所有物体的颜色要符合现实常识（如：西瓜籽是棕色/黑色，不是绿色）

### 西瓜拟人形象（核心要素）
徽章中的西瓜是拟人角色，跟 logo 一样有表情：
- 两个小圆点眼睛（黑色）
- 一条浅浅的微笑弧线
- 可选：淡淡的粉色腮红
- 风格参考：asamimichan（あさみみちゃん）— 极简、温柔、可爱
- 表情要克制，不夸张，保持安静温暖的感觉

---

## 三、通用提示词（每个徽章前面都加这段）

```
A single cute cartoon badge icon on a clean white background. Pseudo-3D style with soft rounded shapes, gentle shadows, and a slight glossy feel. Simple, minimal, adorable. The watermelon character in the badge has a personified face like the app logo: two small round black dot eyes and a gentle subtle smile curve (asamimichan style — quiet, warm, not exaggerated), optionally with faint pink blush cheeks. The design style should match a watermelon-clock app logo: clean, cheerful, with fresh vibrant colors. Colors are not limited — use whatever palette fits the badge theme, but keep the overall feel consistent with the cute kawaii watermelon brand. All object colors must be realistic (e.g. watermelon seeds are brown/black, not green; watermelon flesh is red/pink, rind is green). No text, no letters, no numbers. One simple focal element, clean composition, easy to recognize at small sizes.
```

---

## 四、系列色调提示（加在通用提示词后面）

```
⭐️ 坚持系列：Warm orange-gold accent tones mixed with watermelon green.
⏱️ 专注系列：Watermelon red as the dominant accent color.
🏠 瓜棚系列：Fresh watermelon green as the dominant color.
🌱 农场系列：Earthy warm brown mixed with green sprout accents.
🌟 隐藏系列：Gold and soft purple sparkle accents, slightly magical.
```

---

## 五、每个徽章的提示词

每条提示词直接接在「通用提示词 + 系列色调」后面。描述尽量简短，只说核心元素。

### ⭐️ 坚持系列

| 文件名 | 提示词 |
|--------|--------|
| S1-three-day-streak.png | Three small watermelon slices in a row, each with a tiny kawaii smile. A small flame above. |
| S2-week-warrior.png | A mini calendar with 7 days, each marked with a cute watermelon seed checkmark. |
| S3-fortnight-focus.png | A chain of watermelon-green links forming a half circle, the center link glows. |
| S4-iron-will.png | A cute shield made of watermelon rind, green outside, red heart shape inside. |
| S5-century-legend.png | A golden trophy cup shaped like a watermelon half, sparkles rising from it. |
| S6-hundred-days.png | A smiling sun with a watermelon cross-section face, warm rays around it. |
| S7-early-bird.png | A cute round bird perched on a watermelon slice, soft sunrise colors behind. |
| S8-night-owl.png | A cute round owl sitting on a watermelon, crescent moon behind, night blue tones. |
| S9-weekend-warrior.png | A round watermelon character wearing a tiny headband, determined cute expression. |
| S10-year-one.png | A whole watermelon as a birthday cake with one lit candle on top, confetti around. |

### ⏱️ 专注系列

| 文件名 | 提示词 |
|--------|--------|
| F1-first-melon.png | A tiny baby watermelon with a small sprout on top, shy kawaii smile, sitting on soil. |
| F2-focus-rookie.png | A small watermelon-clock (green rim, red face, clock hands) with a sprout growing from top. |
| F3-focus-pro.png | A watermelon-clock with three small golden stars orbiting around it. |
| F4-focus-master.png | A watermelon-clock wearing a small golden crown. |
| F5-focus-legend.png | A watermelon-clock radiating golden light, seeds turned golden. |
| F6-time-lord.png | An hourglass with watermelon halves as the bulbs, tiny seeds flowing as sand. |
| F7-deep-dive.png | A cute round watermelon wearing a diving mask, underwater blue tones, bubbles. |
| F8-marathon-runner.png | A round watermelon character with tiny running shoes, breaking a finish line ribbon. |
| F9-ten-a-day.png | A pyramid of 10 tiny kawaii watermelons stacked up, the top one wears a crown. |
| F10-project-pro.png | A clipboard made of watermelon rind with checkmarks made of watermelon seeds. |

### 🏠 瓜棚系列

| 文件名 | 提示词 |
|--------|--------|
| H1-first-harvest.png | A watermelon seed cracking open in soil with a tiny green sprout pushing through. |
| H2-full-garden.png | Five watermelon growth stages in a row: seed, sprout, flower, small melon, big melon. |
| H3-golden-arrival.png | A golden watermelon descending with divine light rays, sparkles around it. |
| H4-golden-collector.png | Five golden watermelons arranged in an arc on a red cushion. |
| H5-warehouse-tycoon.png | A cute wooden shed with watermelon-slice roof, watermelons tumbling out the door. |
| H6-first-synthesis.png | Two small watermelons merging into one bigger glowing watermelon, sparkle trails. |
| H7-synthesis-master.png | A round flask with green bubbling liquid, a golden watermelon floating inside. |
| H8-first-slice.png | A watermelon being sliced open, two halves separating with juice splash. |
| H9-hundred-slices.png | A knife standing upright with watermelon pieces arranged in a fan pattern around it. |
| H10-tool-collector.png | A treasure chest made of watermelon rind, open with colorful items glowing inside. |

### 🌱 农场系列

| 文件名 | 提示词 |
|--------|--------|
| G1-first-planting.png | A hand placing a watermelon seed into soil, the seed glows faintly. |
| G2-first-farm-harvest.png | A ripe watermelon being lifted from its vine with a sparkle burst. |
| G3-hundred-plants.png | A bird's-eye view of a tiny farm with neat rows of watermelon plants. |
| G4-galaxy-conqueror.png | A small planet with watermelon texture, a tiny flag planted on top, stars around. |
| G5-codex-master.png | An open book with cute watermelon illustrations on its pages, golden glow. |
| G6-alien-friend.png | A cute small green alien holding a watermelon as a gift, big kawaii eyes. |
| G7-thief-buster.png | A wooden cage with a caught purple raccoon inside, a watermelon guard standing proud. |
| G8-evergreen-farm.png | A peaceful farm plot with sleeping kawaii watermelons, warm sunset behind. |

### 🌟 隐藏系列

| 文件名 | 提示词 |
|--------|--------|
| X1-time-traveler.png | A swirling purple-gold time vortex with a watermelon-clock being pulled into center. |
| X2-valentine-melon.png | A heart-shaped watermelon with a pink bow on top, blushing kawaii face, tiny hearts. |
| X3-sound-explorer.png | Headphones where each ear cup is a watermelon half, colorful music notes flowing out. |
| X4-perfectionist.png | A watermelon cut into a perfect diamond gem shape, five golden stars orbiting it. |
| X5-all-rounder.png | Three overlapping circles (red, green, brown), a golden star where all three meet. |
| X6-midnight-gardener.png | A small glowing watermelon plant next to a lantern, dark starry sky, fireflies. |

---

## 六、生成技巧

1. 每次只生成一个徽章
2. 如果太复杂 → 加 "Very simple, minimal details, clean design."
3. 如果不够可爱 → 加 "Extra kawaii, baby-like proportions, round soft shapes."
4. 如果颜色不协调 → 加 "Fresh, cheerful color palette that matches a cute kawaii app brand."
5. 如果出现文字 → 加 "Absolutely no text or letters anywhere."
6. 如果表情太夸张 → 加 "The face should be very subtle: just two tiny dot eyes and a gentle smile curve, asamimichan style."

## 七、生成后检查清单

- [ ] 512 × 512 px
- [ ] 白色背景（后期抠图）
- [ ] 简约可爱，不过于复杂
- [ ] 没有文字/字母/数字
- [ ] 能看出西瓜元素
- [ ] 色彩明快清新，风格跟品牌一致
- [ ] 缩小到 48px 仍能辨认主体
- [ ] 文件名正确，放在 `docs/badges/`
