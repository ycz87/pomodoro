# Farm Phase 2 - Data Spec for Codex

## Task: Rewrite src/types/farm.ts

### GalaxyId
Replace old galaxies with: 'thick-earth' | 'fire' | 'water' | 'wood' | 'metal' | 'rainbow' | 'dark-matter'

### GALAXIES array
```ts
{ id: 'thick-earth', emoji: '🌍', unlockCondition: 'default' },
{ id: 'fire', emoji: '🔥', unlockCondition: 'collect-5-thick-earth' },
{ id: 'water', emoji: '💧', unlockCondition: 'collect-5-fire' },
{ id: 'wood', emoji: '🌿', unlockCondition: 'collect-5-water' },
{ id: 'metal', emoji: '✨', unlockCondition: 'collect-5-wood' },
{ id: 'rainbow', emoji: '🌈', unlockCondition: 'collect-5-metal' },
{ id: 'dark-matter', emoji: '🌑', unlockCondition: 'collect-all' },
```

### VarietyDef additions
Add to VarietyDef:
- breedType: 'pure' | 'hybrid' | 'prismatic'
- matureMinutes: number (all pure = 10000)

### 40 Varieties (id | galaxy | rarity | dropRate | emoji)

thick-earth:
jade-stripe | thick-earth | common | 0.15 | 🍉
black-pearl | thick-earth | common | 0.13 | 🖤
honey-bomb | thick-earth | common | 0.12 | 🍯
mini-round | thick-earth | rare | 0.07 | 🔴
star-moon | thick-earth | rare | 0.06 | 🌙
golden-heart | thick-earth | epic | 0.03 | 💛
ice-sugar-snow | thick-earth | epic | 0.02 | ❄️
cube-melon | thick-earth | legendary | 0.01 | 🧊

fire:
lava-melon | fire | common | 0.15 | 🌋
caramel-crack | fire | common | 0.13 | 🍮
charcoal-roast | fire | common | 0.12 | 🔥
flame-pattern | fire | rare | 0.07 | 🔶
molten-core | fire | rare | 0.06 | 💎
sun-stone | fire | epic | 0.03 | ☀️
ash-rebirth | fire | epic | 0.02 | 🌅
phoenix-nirvana | fire | legendary | 0.01 | 🦅

water:
snow-velvet | water | common | 0.15 | 🤍
ice-crystal | water | common | 0.13 | 💠
tidal-melon | water | common | 0.12 | 🌊
aurora-melon | water | rare | 0.07 | 🌌
moonlight-melon | water | rare | 0.06 | 🌕
diamond-melon | water | epic | 0.03 | 💎
abyss-melon | water | epic | 0.02 | 🫧
permafrost | water | legendary | 0.01 | 🧊

wood:
vine-melon | wood | common | 0.15 | 🌱
moss-melon | wood | common | 0.13 | 🍀
mycelium-melon | wood | common | 0.12 | 🍄
flower-whisper | wood | rare | 0.07 | 🌸
tree-ring | wood | rare | 0.06 | 🪵
world-tree | wood | epic | 0.03 | 🌳
spirit-root | wood | epic | 0.02 | 🌿
all-spirit | wood | legendary | 0.01 | 🧚

metal:
golden-armor | metal | common | 0.15 | 🛡️
copper-patina | metal | common | 0.13 | 🪙
tinfoil-melon | metal | common | 0.12 | 🔔
galaxy-stripe | metal | rare | 0.07 | 🌀
mercury-melon | metal | rare | 0.06 | 🪩
meteorite-melon | metal | epic | 0.03 | ☄️
alloy-melon | metal | epic | 0.02 | ⚙️
eternal-melon | metal | legendary | 0.01 | 👑

### Plot interface additions
Add to Plot: accumulatedMinutes: number (default 0), lastActivityTimestamp: number (default 0)

### FarmStorage additions
Add: lastActivityTimestamp: number (default 0)

### Plot milestones
```ts
export const PLOT_MILESTONES = [
  { requiredVarieties: 0, totalPlots: 4 },
  { requiredVarieties: 3, totalPlots: 5 },
  { requiredVarieties: 5, totalPlots: 6 },
  { requiredVarieties: 8, totalPlots: 7 },
  { requiredVarieties: 15, totalPlots: 8 },
  { requiredVarieties: 22, totalPlots: 9 },
];
```

### Helper exports needed
- THICK_EARTH_VARIETIES, FIRE_VARIETIES, WATER_VARIETIES, WOOD_VARIETIES, METAL_VARIETIES arrays
- BLUE_STAR_VARIETIES as alias for THICK_EARTH_VARIETIES (backward compat)
- GALAXY_VARIETIES: Record<GalaxyId, VarietyId[]>
- ALL_VARIETY_IDS updated
