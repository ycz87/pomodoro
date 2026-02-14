# 🎨 徽章设计指南 — AI 生成提示词手册

> 日期：2026-02-14（v3 优化版）
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
- 格式：PNG
- 背景：透明
- 尺寸：512 × 512 px
- 形状：圆形图标

---

## 二、品牌视觉参考

西瓜时钟 logo：切开的西瓜横截面做成的时钟
- 外圈：西瓜绿外皮 #4CAF50
- 中圈：白色瓜皮
- 内圈：红色果肉表盘 #F06B6B
- 深绿色西瓜籽 #1B5E20（泪滴形）
- 深绿色时钟指针 #2E7D32
- kawaii 可爱小表情（圆眼睛+微笑弧线）

---

## 三、基础提示词（所有徽章通用前缀）

```
A single circular achievement badge icon for a mobile app game. 3D rendered, clay-like texture, soft lighting from top-left, subtle drop shadow. Transparent background. The badge sits inside a circular metallic rim with a subtle shine.

Art style: Kawaii, cute, rounded shapes, vibrant saturated colors, Pixar-inspired 3D cartoon. Similar to Duolingo achievement badges or Clash Royale reward icons.

The design incorporates watermelon motifs (green rind, red flesh, black seeds, vines) as the brand identity of a "Watermelon Clock" focus timer app.

Constraints: No text, no letters, no numbers, no words anywhere on the badge. One clear focal element in the center. Must be readable at 48px small size.
```

---

## 四、系列色调（接在基础提示词后面）

```
⭐️ 坚持系列：The badge rim is warm orange (#FF8C42) with a golden inner glow. The overall mood is warm, encouraging, and cozy.

⏱️ 专注系列：The badge rim is watermelon red (#FF3B5C) with a pinkish inner glow. The overall mood is energetic, passionate, and focused.

🏠 瓜棚系列：The badge rim is watermelon green (#4CAF50) with a fresh green inner glow. The overall mood is lush, abundant, and natural.

🌱 农场系列：The badge rim is earthy brown (#8D6E63) with a warm amber inner glow. The overall mood is grounded, nurturing, and organic.

🌟 隐藏系列：The badge rim has a gold-to-purple gradient (#FFD700 to #9C27B0) with sparkle effects. The overall mood is mysterious, magical, and rare.
```

---

## 五、每个徽章的具体提示词

### ⭐️ 坚持系列（10个）

| 文件名 | 提示词（接在基础 + 系列色调后面） |
|--------|--------------------------------------|
| S1-three-day-streak.png | Center element: Three tiny watermelon slices stacked diagonally like dominos, each with a cute kawaii blushing face. A small orange flame flickers above the top slice. The slices have glossy 3D clay texture with visible green rind and red flesh. |
| S2-week-warrior.png | Center element: A cute mini calendar made of watermelon rind (green frame), showing a 7-day grid. Each day cell has a tiny golden watermelon seed as a checkmark. The calendar has a kawaii satisfied face at the bottom. Glossy 3D clay texture. |
| S3-fortnight-focus.png | Center element: A chain made of 5 watermelon-rind links (green with white edge), forming a half-circle arc. The center link is larger and glows orange. The chain has a sturdy, metallic-clay feel. A tiny vine leaf decorates the top. |
| S4-iron-will.png | Center element: A shield made of watermelon rind — the outer layer is dark green with a metallic iron sheen, the inner face shows red watermelon flesh in a heart shape. Two tiny clock hands cross behind the shield like swords. Powerful and cute. |
| S5-century-legend.png | Center element: A golden trophy cup shaped like a hollowed-out watermelon half (green outside, golden inside). Steam/sparkles rise from the cup. Three watermelon seeds orbit around it like stars. Grand and legendary, warm golden lighting. |
| S6-hundred-days.png | Center element: A glowing sun where the sun disc is a watermelon cross-section (green rim, white ring, red center with seeds). Warm orange rays radiate outward. The watermelon-sun has a peaceful kawaii smile. Cozy sunrise feeling. |
| S7-early-bird.png | Center element: A cute round kawaii bird (robin-style, orange breast) perched on a watermelon slice like a branch. The bird has watermelon-seed-shaped eyes. Behind them, a soft sunrise gradient (orange to pink). Morning dew drops on the watermelon. |
| S8-night-owl.png | Center element: A cute round kawaii owl sitting on top of a whole watermelon. The owl's belly has a watermelon pattern (green feathers outside, pinkish inside). A crescent moon behind. The owl's big round eyes glow softly. Night blue-purple background tones. |
| S9-weekend-warrior.png | Center element: A cute chibi watermelon character (round watermelon body with tiny arms and legs) wearing a tiny samurai headband. It holds a miniature clock like a shield in one hand. Determined kawaii expression. Action pose with motion lines. |
| S10-year-one.png | Center element: A whole watermelon styled as a birthday cake — it sits on a small plate, with a single lit candle on top shaped like a clock hand. Tiny sparkles and confetti around it. The watermelon has a happy kawaii birthday face. Celebration mood. |

### ⏱️ 专注系列（10个）

| 文件名 | 提示词 |
|--------|--------|
| F1-first-melon.png | Center element: A single tiny baby watermelon (round, green with darker stripes) with a small sprout and two leaves on top. It has a shy, happy kawaii face (dot eyes, tiny smile). It sits on a small mound of soil. A faint clock outline glows behind it. Soft, hopeful lighting. |
| F2-focus-rookie.png | Center element: A watermelon-clock face (the brand logo style — green rim, white ring, red face with seeds and clock hands) but miniature and extra cute. A tiny green sprout grows from the top of the clock, showing it's a beginner. The clock has eager kawaii eyes. |
| F3-focus-pro.png | Center element: A watermelon-clock (brand logo style) with three small golden stars orbiting around it in a circular path. The clock hands glow with a red energy trail. The watermelon has a confident kawaii wink expression. Slight upward angle, heroic feel. |
| F4-focus-master.png | Center element: A watermelon-clock wearing a small golden crown with red jewels (watermelon seeds as gems). The clock face has a proud, regal kawaii expression. Royal red velvet glow behind. The crown has a subtle metallic 3D shine. |
| F5-focus-legend.png | Center element: A watermelon-clock radiating golden light beams in all directions. The watermelon seeds have turned golden. The clock hands are made of pure light. An epic golden aura surrounds it. The face shows an awe-inspiring kawaii expression. Legendary, divine lighting. |
| F6-time-lord.png | Center element: An hourglass where the glass bulbs are watermelon halves (green rind frame, red interior). Tiny golden watermelon seeds flow as the sand between the halves. Watermelon vines wrap elegantly around the hourglass frame. Majestic and timeless. |
| F7-deep-dive.png | Center element: A cute round watermelon wearing an oversized diving mask and snorkel. It's underwater with blue-tinted lighting. Bubbles rise around it. Tiny watermelon seeds float past like fish. The watermelon has excited kawaii eyes behind the mask. Deep blue-to-red gradient. |
| F8-marathon-runner.png | Center element: A cute chibi watermelon character (round body, tiny limbs) wearing red running shoes, mid-stride breaking through a finish line ribbon. Motion speed lines behind. The finish line posts are shaped like clock hands. Triumphant kawaii expression, sweat drop. |
| F9-ten-a-day.png | Center element: A pyramid stack of 10 tiny kawaii watermelons, each with a slightly different cute expression (happy, sleepy, excited, surprised). They're piled up abundantly. The top watermelon wears a tiny golden crown. Joyful, overflowing harvest feeling. |
| F10-project-pro.png | Center element: A clipboard made of watermelon rind (green board, white clip). On the clipboard, 5 task lines where each checkbox is a watermelon seed — all checked with golden checkmarks. A gold star watermelon sits at the top of the list. Organized and accomplished. |

### 🏠 瓜棚系列（10个）

| 文件名 | 提示词 |
|--------|--------|
| H1-first-harvest.png | Center element: A single watermelon seed cracking open in rich brown soil, with a tiny bright green sprout pushing through. A soft golden light shines down on it. Above, a faint translucent watermelon silhouette shows what it will become. Hopeful, tender moment. |
| H2-full-garden.png | Center element: Five watermelon growth stages arranged in a gentle arc from left to right: seed, sprout, flower, small melon, big watermelon. Each has a progressively happier kawaii face. They sit on a green grassy ground. Rainbow-like color progression. |
| H3-golden-arrival.png | Center element: A golden watermelon descending from above with divine light rays behind it. The watermelon is pure gold with visible seed indentations. Golden sparkle particles surround it. The watermelon has an amazed, blessed kawaii face. Sacred, precious moment. |
| H4-golden-collector.png | Center element: Five golden watermelons arranged in an Olympic-rings-style arc formation. Each has a proud kawaii expression. They sit on a red velvet cushion. Rich golden glow illuminates the scene. Collector's pride, luxurious feeling. |
| H5-warehouse-tycoon.png | Center element: A cute wooden shed (瓜棚) with a watermelon-slice-shaped roof (green top, red underside). The door is open and watermelons of various sizes tumble out abundantly. The shed has a kawaii face on its front. Overflowing abundance. |
| H6-first-synthesis.png | Center element: Two small watermelons floating toward each other with sparkle trails, merging into one bigger glowing watermelon in the center. Upward-pointing arrows made of watermelon vines frame the transformation. Magical green glow, alchemy feeling. |
| H7-synthesis-master.png | Center element: A round-bottom alchemy flask made of glass, filled with bubbling green liquid. A golden watermelon floats inside the flask, glowing. Watermelon vine tendrils wrap around the flask neck. Tiny bubbles and sparkles rise. Mad scientist kawaii energy. |
| H8-first-slice.png | Center element: A watermelon being sliced open at the moment of the cut — the two halves separating with a satisfying splash of red juice and flying seeds. The knife blade gleams. Both watermelon halves have surprised kawaii faces. Dynamic, crisp, juicy moment. |
| H9-hundred-slices.png | Center element: A master chef's knife standing upright, its blade reflecting watermelon red. Around it, perfectly cut watermelon pieces are arranged in a beautiful fan/flower pattern. Watermelon seeds scattered artfully. Professional, masterful composition. |
| H10-tool-collector.png | Center element: A treasure chest made of watermelon rind (green exterior with darker stripe pattern). The chest is open, revealing colorful glowing tools and items inside (stars, potions, seeds). Golden light spills out. The chest has a satisfied kawaii face. |

### 🌱 农场系列（8个）

| 文件名 | 提示词 |
|--------|--------|
| G1-first-planting.png | Center element: A cute chibi hand gently placing a watermelon seed into a small hole in brown tilled soil. The seed glows faintly with potential. A tiny watering can sits nearby. Warm earthy tones, soft afternoon lighting. Tender, hopeful gardening moment. |
| G2-first-farm-harvest.png | Center element: A ripe watermelon being lifted from its vine by two small hands, with a satisfying "pop" effect (sparkle burst). The vine and leaves frame the scene. The watermelon has an overjoyed kawaii face. Earthy brown soil below, lush green surroundings. |
| G3-hundred-plants.png | Center element: A bird's-eye view of a lush miniature farm with neat rows of watermelon plants stretching into the distance. Tiny watermelons visible among green leaves. Brown earth paths between rows. A small scarecrow in the corner. Abundant, thriving oasis. |
| G4-galaxy-conqueror.png | Center element: A small planet/globe with watermelon texture (green continents on red ocean surface, seeds as mountain ranges). A tiny flag with a clock symbol is planted on top. Stars and space dust surround it. Space exploration meets farming, adventurous mood. |
| G5-codex-master.png | Center element: An open leather-bound encyclopedia/codex with watermelon illustrations on its pages — different cute watermelon varieties drawn in kawaii style. The book glows with golden completion light from its pages. A magnifying glass rests on one page. |
| G6-alien-friend.png | Center element: A cute small green alien (big round head, huge kawaii eyes, tiny body) waving hello with one hand, holding a small watermelon as a gift in the other. The alien wears a tiny clock pendant necklace. Friendly, quirky, slightly glowing green skin. |
| G7-thief-buster.png | Center element: A wooden cage trap made of watermelon vines, with a caught purple masked raccoon-like creature inside looking comically defeated. A victorious small watermelon guard stands next to it with arms crossed and a smug kawaii grin. Defense victory scene. |
| G8-evergreen-farm.png | Center element: A thriving farm plot viewed from a slight angle, with lush watermelon vines bearing healthy watermelons, all with content kawaii sleeping faces. A warm golden sunset behind. Fireflies/sparkles float above. Peaceful, eternal garden feeling. |

### 🌟 隐藏/彩蛋系列（6个）

| 文件名 | 提示词 |
|--------|--------|
| X1-time-traveler.png | Center element: A swirling purple-gold time vortex/portal spiral. A watermelon-clock is being pulled into the center, its clock hands spinning wildly. Sparkle particles and clock gears float in the vortex. Mysterious, surreal, interdimensional feeling. |
| X2-valentine-melon.png | Center element: A watermelon naturally grown in a perfect heart shape — green rind with heart contour, a small section cut to reveal red flesh inside. A cute pink bow sits on top. The watermelon has a blushing kawaii face with heart-shaped eyes. Pink sparkles and tiny hearts float around. |
| X3-sound-explorer.png | Center element: A pair of over-ear headphones where each ear cup is a watermelon half (green outside, red inside with seeds visible). Colorful music notes and sound waves made of tiny watermelon seeds flow out from the headphones. Vibrant, musical, playful energy. |
| X4-perfectionist.png | Center element: A watermelon cut into a perfect geometric diamond/gem shape with precise facets — green rind facets and red flesh facets alternating. It floats and rotates slightly, with 5 small golden stars orbiting it. Brilliant prismatic light refractions. Flawless, precious. |
| X5-all-rounder.png | Center element: Three overlapping circles forming a Venn diagram — one red (clock/timer), one green (watermelon/shed), one brown (soil/farm). Where all three overlap in the center, a golden star-shaped watermelon glows. Unity, completeness, mastery of all domains. |
| X6-midnight-gardener.png | Center element: A small watermelon plant with one tiny glowing watermelon, illuminated by a cute lantern shaped like a watermelon-clock sitting beside it. Above, a dark purple starry sky with a crescent moon. Fireflies dot the scene. Peaceful, secret midnight garden. |

---

## 六、生成技巧（Gemini 3 Pro Image）

1. 每次只生成一个徽章，不要批量
2. 如果第一次不满意，在提示词前加 "High quality, highly detailed, professional game asset." 
3. 如果背景不透明，追加 "The badge floats on a completely transparent background, no background elements."
4. 如果太复杂/糊，追加 "Simple, clean composition. One clear focal point. Minimal details."
5. 如果不够 3D，追加 "Soft clay render, subsurface scattering, ambient occlusion, studio lighting."
6. 生成后如果有文字出现，重新生成并强调 "Absolutely no text, letters, numbers, or words anywhere in the image."

## 七、生成后检查清单

- [ ] 512 × 512 px
- [ ] PNG 格式，背景透明
- [ ] 圆形构图
- [ ] 没有文字/字母/数字
- [ ] 能看出西瓜元素
- [ ] kawaii 可爱风格，与品牌一致
- [ ] 深色和浅色背景下都能看清
- [ ] 缩小到 48px 仍能辨认主体
- [ ] 文件名正确，放在 `docs/badges/`
