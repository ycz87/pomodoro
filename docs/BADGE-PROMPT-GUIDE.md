# 🎨 徽章设计指南 — AI 生成提示词手册

> 日期：2026-02-14（v2 更新）
> 用途：Charles 用 AI 生成徽章图标时的参考手册
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

示例：
- `S1-three-day-streak.png`
- `F5-focus-legend.png`
- `H3-golden-arrival.png`
- `G4-galaxy-conqueror.png`
- `X2-valentine-melon.png`

### 文件要求
- 格式：PNG
- 背景：透明
- 尺寸：512 × 512 px（正方形，app 内会缩放到 64/48/32px，大图保证清晰度）
- 色彩模式：sRGB
- 形状：圆形图标（内容在圆形区域内，圆外透明）

---

## 二、品牌视觉参考

西瓜时钟的 logo 是一个**切开的西瓜横截面做成的时钟**：
- 最外圈：**西瓜绿外皮**（#4CAF50）
- 中间圈：**白色瓜皮**
- 内圈：**红色果肉做表盘**（#F06B6B）
- 表盘上散布着**深绿色西瓜籽**（#1B5E20，泪滴形）
- **深绿色时钟指针**（#2E7D32）
- 底部有一个 **kawaii 可爱小表情**（两个圆眼睛 + 微笑弧线，深绿色）

所有徽章必须延续这个品牌风格：**西瓜元素 + 时钟元素 + 可爱 kawaii 风格**。

### 品牌色板
```
西瓜绿（外皮）：#4CAF50
深绿色（籽/指针/表情）：#2E7D32 / #1B5E20
西瓜红（果肉）：#F06B6B / #E85D5D
白色（瓜皮圈）：#FFFFFF
```

---

## 三、基础提示词（所有徽章通用）

每个徽章生成时，先粘贴这段基础提示词，再接上系列色调，最后接具体徽章描述。

```
A circular badge icon, 512x512px, transparent background.
Style: kawaii, cute, rounded — inspired by a watermelon clock brand.
The badge should feel like it belongs to a watermelon-themed focus timer app.
Core brand elements to incorporate where appropriate: watermelon slices, watermelon seeds, clock hands, cute kawaii faces.
Color palette: watermelon green (#4CAF50), dark green (#2E7D32), watermelon red/pink (#F06B6B), white, with the series accent color.
The badge has a subtle 3D feel with soft shadows and highlights.
Keep it simple: ONE core visual element in the center, readable at small sizes.
No text on the badge. No letters, no numbers, no words.
The icon should look good on both dark and light backgrounds.
```

---

## 四、系列色调（接在基础提示词后面）

```
⭐️ 坚持系列：Accent color warm orange (#FF8C42). Combine watermelon elements with calendar/streak/chain motifs.
⏱️ 专注系列：Accent color watermelon red (#FF3B5C). Combine watermelon elements with clock/timer/hourglass motifs.
🏠 瓜棚系列：Accent color watermelon green (#4CAF50). Combine watermelon elements with harvest/collection/shed motifs.
🌱 农场系列：Accent color earthy brown (#8D6E63). Combine watermelon elements with farm/soil/planting motifs.
🌟 隐藏系列：Accent color gold-to-purple gradient (#FFD700 to #9C27B0). Combine watermelon elements with mysterious/sparkle/secret motifs.
```

---

## 五、每个徽章的具体提示词

### ⭐️ 坚持系列（10个）

| 文件名 | 提示词（接在基础提示词 + 系列色调后面） |
|--------|--------------------------------------|
| S1-three-day-streak.png | Three small watermelon slices arranged in a row like a streak chain, each with a tiny kawaii smile. Warm orange glow connecting them. Fresh start feeling. |
| S2-week-warrior.png | A mini calendar page with 7 days, each day marked with a tiny watermelon seed checkmark. The calendar has a watermelon-green border. Neat and satisfying. |
| S3-fortnight-focus.png | A half-moon shape made of watermelon rind segments linked together like a chain, 14 pieces. Sturdy and warm with orange accents. |
| S4-iron-will.png | A shield made of watermelon rind (green exterior, white edge), with a clock face in the center showing determination. Metallic sheen on the green. Strong and kawaii. |
| S5-century-legend.png | A golden watermelon trophy cup, the cup shaped like a watermelon half with seeds visible inside. Radiating warm golden-orange light. Grand and legendary. |
| S6-hundred-days.png | A warm glowing sun with watermelon-slice rays radiating outward. The sun center is a watermelon clock face with a kawaii smile. Cozy and bright. |
| S7-early-bird.png | A cute kawaii bird perched on a watermelon slice, with a sunrise behind. The bird has watermelon-seed eyes. Fresh morning colors with orange tint. |
| S8-night-owl.png | A cute kawaii owl sitting on a watermelon, crescent moon behind. The owl's belly has a watermelon pattern (green outside, red inside). Night sky with warm orange accents. |
| S9-weekend-warrior.png | A tiny watermelon wearing a cute warrior headband, holding a miniature clock as a shield. Playful weekend warrior vibe, kawaii expression. |
| S10-year-one.png | A watermelon birthday cake — a whole watermelon with a single candle on top shaped like a clock hand. Celebration sparkles around it. Milestone feeling. |

### ⏱️ 专注系列（10个）

| 文件名 | 提示词 |
|--------|--------|
| F1-first-melon.png | A single tiny watermelon with a small sprout on top and a kawaii happy face, sitting on soil. A faint clock outline behind it. First achievement, fresh and new. |
| F2-focus-rookie.png | A watermelon-clock (the brand logo style: green rind circle, red face, seeds, clock hands) but miniature and cute, with a "beginner" sprout growing from the top. Rookie energy. |
| F3-focus-pro.png | A watermelon-clock with small stars orbiting around it. The clock hands glow red. The watermelon has a confident kawaii expression. Growing confidence. |
| F4-focus-master.png | A watermelon-clock wearing a tiny golden crown. The clock face shows mastery with bold hands. Rich red and gold tones. Kawaii proud expression. |
| F5-focus-legend.png | A golden glowing watermelon-clock radiating light beams outward. The watermelon seeds are golden. Epic legendary aura. The face shows awe-inspiring kawaii expression. |
| F6-time-lord.png | An hourglass where the sand is tiny watermelon seeds flowing down. Watermelon vines wrap around the hourglass frame. Timeless and majestic, green and gold. |
| F7-deep-dive.png | A watermelon wearing a cute diving mask, submerged in blue water with bubbles rising. Watermelon seeds float around like fish. Deep blue-red gradient. Kawaii underwater adventure. |
| F8-marathon-runner.png | A watermelon with tiny legs wearing running shoes, crossing a finish line ribbon. Motion lines behind. The finish line posts are clock hands. Energetic and triumphant kawaii. |
| F9-ten-a-day.png | A pile of 10 tiny kawaii watermelons stacked in a pyramid, each with a different cute expression. Overflowing abundance. Joyful harvest feeling with red accents. |
| F10-project-pro.png | A clipboard/checklist where each checkbox is a watermelon seed, all checked. A gold star watermelon at the top. Organized and accomplished feeling. |

### 🏠 瓜棚系列（10个）

| 文件名 | 提示词 |
|--------|--------|
| H1-first-harvest.png | A single watermelon seed just sprouting with a tiny green leaf, sitting in rich soil. A faint watermelon outline above showing what it will become. Hopeful new beginning. |
| H2-full-garden.png | Five watermelon growth stages in a row: seed, sprout, flower, small melon, big watermelon — each with a kawaii face showing progressive happiness. Colorful garden, green theme. |
| H3-golden-arrival.png | A golden watermelon glowing with divine light rays, watermelon seeds around it turned to gold. The watermelon has an amazed kawaii face. Rare and precious moment. |
| H4-golden-collector.png | Five golden watermelons arranged in a crown/arc formation, each with a proud kawaii expression. Rich golden glow on green background. Collector's pride. |
| H5-warehouse-tycoon.png | A cute wooden shed/barn (瓜棚) with its door open, watermelons of various sizes spilling out. The shed has a watermelon-slice roof. Abundance and wealth, green theme. |
| H6-first-synthesis.png | Two small watermelons merging together with a sparkle effect, becoming one bigger glowing watermelon. Upward arrow made of watermelon vines. Transformation magic, green glow. |
| H7-synthesis-master.png | An alchemy flask with green bubbling liquid, a golden watermelon floating inside. Watermelon vine tendrils wrap around the flask. Mad scientist kawaii energy. |
| H8-first-slice.png | A watermelon being sliced open with a satisfying cut, red juice splashing in a starburst pattern. Seeds flying out. The watermelon halves have surprised kawaii faces. Fresh and crisp. |
| H9-hundred-slices.png | A master chef's knife with watermelon juice on the blade, surrounded by perfectly cut watermelon pieces arranged in a fan pattern. Seeds scattered artfully. Master slicer feeling. |
| H10-tool-collector.png | A treasure chest made of watermelon rind (green exterior), open to reveal colorful tools and items glowing inside. Watermelon seeds decorate the chest edges. Collector's treasure. |

### 🌱 农场系列（8个）

| 文件名 | 提示词 |
|--------|--------|
| G1-first-planting.png | A cute hand gently placing a watermelon seed into a small hole in brown soil. A tiny clock above shows "time to grow". Warm earthy tones with green accents. Tender and hopeful. |
| G2-first-farm-harvest.png | A ripe watermelon being picked from a vine, with sparkles around it. The watermelon has a happy kawaii face. Earthy brown soil below, green vine, red watermelon. Satisfying moment. |
| G3-hundred-plants.png | A lush farm field stretching into distance with rows of watermelon plants, each tiny watermelon visible. Brown earth paths between green rows. Abundant oasis feeling. |
| G4-galaxy-conqueror.png | A planet/globe with watermelon pattern (green continents on red surface, seeds as landmarks), a tiny flag with a clock symbol planted on top. Space meets farming, brown-green palette. |
| G5-codex-master.png | An open book/encyclopedia with watermelon illustrations on its pages — different varieties drawn in kawaii style. The book glows with completion light. Green and brown tones. |
| G6-alien-friend.png | A cute green alien with big kawaii eyes waving hello, holding a small watermelon as a gift. The alien wears a tiny clock necklace. Friendly and quirky, earthy-green palette. |
| G7-thief-buster.png | A cage trap made of watermelon vines with a caught purple masked creature inside looking defeated. A victorious watermelon guard stands next to it with a kawaii smirk. Defense victory. |
| G8-evergreen-farm.png | A thriving farm plot with lush watermelon vines and healthy watermelons, all with content kawaii faces. A small calendar in the corner shows 30 days. Vitality, brown-green palette. |

### 🌟 隐藏/彩蛋系列（6个）

| 文件名 | 提示词 |
|--------|--------|
| X1-time-traveler.png | A swirling time vortex/portal with a watermelon-clock being pulled into it. Clock hands spinning wildly. Gold and purple gradient with watermelon green accents. Mysterious and surreal. |
| X2-valentine-melon.png | A heart-shaped watermelon (green rind in heart shape, red inside visible) with a cute bow on top. The watermelon has a blushing kawaii face. Pink sparkles. Sweet and romantic. |
| X3-sound-explorer.png | A pair of headphones where the ear cups are watermelon halves (green outside, red inside). Colorful music notes made of watermelon seeds floating out. Gold-purple gradient. Playful and musical. |
| X4-perfectionist.png | A flawless diamond-cut watermelon (geometrically perfect facets, green and red), with 5 small golden stars orbiting around it. Brilliant gold-purple shine. Perfection achieved. |
| X5-all-rounder.png | Three interconnected watermelon slices forming a triangle (one red/timer, one green/shed, one brown/farm), with a golden star in the center. Unity and completeness. Gold-purple glow. |
| X6-midnight-gardener.png | A small watermelon plant glowing softly in moonlight, with a tiny watermelon-clock lantern beside it lighting the way. Stars in dark purple sky above. Peaceful midnight garden secret. |

---

## 六、生成后检查清单

生成每个徽章后，请确认：
- [ ] 512 × 512 px
- [ ] PNG 格式
- [ ] 背景透明（不是白色背景）
- [ ] 圆形构图（主要内容在圆形区域内）
- [ ] 没有文字/字母/数字出现在图上
- [ ] 能看出西瓜元素（西瓜纹路/籽/切面/藤蔓等）
- [ ] 风格统一：kawaii 可爱风，与西瓜时钟 logo 一致
- [ ] 在深色和浅色背景下都能看清
- [ ] 文件名正确（按上面的命名规则）
- [ ] 放在 `docs/badges/` 文件夹下
