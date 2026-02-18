/**
 * FarmPage — 农场主页面
 *
 * 3×3 地块网格（未解锁显示锁定卡）+ 种植/收获/清除交互 + 品种揭晓动画 + 收获动画。
 * 内嵌图鉴入口（顶部 tab 切换）。
 */
import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useTheme } from '../hooks/useTheme';
import { useI18n } from '../i18n';
import type { Plot, VarietyId, FarmStorage, GalaxyId } from '../types/farm';
import type { SeedQuality, SeedCounts } from '../types/slicing';
import { VARIETY_DEFS, RARITY_COLOR, RARITY_STARS, GALAXIES, PLOT_MILESTONES } from '../types/farm';
import { getGrowthStage, getStageEmoji, isVarietyRevealed } from '../farm/growth';
import { getUnlockedGalaxies } from '../farm/galaxy';
import { CollectionPage } from './CollectionPage';

interface FarmPageProps {
  farm: FarmStorage;
  seeds: SeedCounts;
  todayFocusMinutes: number;
  addSeeds: (count: number, quality?: SeedQuality) => void;
  onPlant: (plotId: number, galaxyId: GalaxyId, quality: SeedQuality) => VarietyId;
  onHarvest: (plotId: number) => { varietyId?: VarietyId; isNew: boolean; collectedCount?: number; rewardSeedQuality?: SeedQuality };
  onClear: (plotId: number) => void;
  onGoWarehouse: () => void;
}

type SubTab = 'plots' | 'collection';

// ─── 动画 overlay 类型 ───
interface RevealAnim { varietyId: VarietyId; plotId: number }
interface HarvestAnim {
  varietyId: VarietyId;
  isNew: boolean;
  collectedCount: number;
  rewardSeedQuality?: SeedQuality;
}

const REVEAL_DURATION_MS = 3000;
const REVEAL_DURATION_RARE_PLUS_MS = 3800;
const HARVEST_DURATION_NEW_MS = 4200;
const HARVEST_DURATION_REPEAT_MS = 2800;
const REVEAL_RARE_PLUS_MIN_STARS = 2;
const TOTAL_PLOT_SLOTS = 9;
const LAST_PLOT_UNLOCK_REQUIRED = PLOT_MILESTONES[PLOT_MILESTONES.length - 1]?.requiredVarieties ?? 0;
const PLOT_UNLOCK_BY_TOTAL = new Map(PLOT_MILESTONES.map((milestone) => [milestone.totalPlots, milestone.requiredVarieties]));

export function FarmPage({ farm, seeds, todayFocusMinutes, addSeeds, onPlant, onHarvest, onClear, onGoWarehouse }: FarmPageProps) {
  const theme = useTheme();
  const t = useI18n();
  const unlockedGalaxies = useMemo(() => getUnlockedGalaxies(farm.collection), [farm.collection]);

  const [subTab, setSubTab] = useState<SubTab>('plots');
  const [plantingPlotId, setPlantingPlotId] = useState<number | null>(null);
  const [revealAnim, setRevealAnim] = useState<RevealAnim | null>(null);
  const [harvestAnim, setHarvestAnim] = useState<HarvestAnim | null>(null);

  // 追踪已揭晓的地块（避免重复触发动画）
  const revealedRef = useRef<Set<number>>(new Set());

  // 检测品种揭晓
  useEffect(() => {
    for (const plot of farm.plots) {
      if (
        plot.state === 'growing' &&
        plot.varietyId &&
        isVarietyRevealed(plot.progress) &&
        !revealedRef.current.has(plot.id)
      ) {
        revealedRef.current.add(plot.id);
        setRevealAnim({ varietyId: plot.varietyId, plotId: plot.id });
        const rarityStars = RARITY_STARS[VARIETY_DEFS[plot.varietyId].rarity];
        const revealDuration = rarityStars >= REVEAL_RARE_PLUS_MIN_STARS
          ? REVEAL_DURATION_RARE_PLUS_MS
          : REVEAL_DURATION_MS;
        const timer = setTimeout(() => setRevealAnim(null), revealDuration);
        return () => clearTimeout(timer);
      }
    }
  }, [farm.plots]);

  const totalSeeds = seeds.normal + seeds.epic + seeds.legendary;
  const plotSlots = useMemo(
    () => Array.from({ length: TOTAL_PLOT_SLOTS }, (_, index) => {
      const plot = farm.plots[index];
      if (plot) {
        return {
          kind: 'plot' as const,
          plot,
        };
      }
      return {
        kind: 'locked' as const,
        requiredVarieties: PLOT_UNLOCK_BY_TOTAL.get(index + 1) ?? LAST_PLOT_UNLOCK_REQUIRED,
      };
    }),
    [farm.plots],
  );

  const handlePlant = useCallback((galaxyId: GalaxyId, quality: SeedQuality) => {
    if (plantingPlotId === null) return;
    onPlant(plantingPlotId, galaxyId, quality);
    setPlantingPlotId(null);
  }, [plantingPlotId, onPlant]);

  const handleHarvest = useCallback((plotId: number) => {
    const result = onHarvest(plotId);
    if (result.varietyId) {
      if (result.isNew && result.rewardSeedQuality) {
        addSeeds(1, result.rewardSeedQuality);
      }
      const collectedCount = Math.max(result.isNew ? 1 : 2, result.collectedCount ?? (result.isNew ? 1 : 2));
      setHarvestAnim({
        varietyId: result.varietyId,
        isNew: result.isNew,
        collectedCount,
        rewardSeedQuality: result.rewardSeedQuality,
      });
      setTimeout(
        () => setHarvestAnim(null),
        result.isNew ? HARVEST_DURATION_NEW_MS : HARVEST_DURATION_REPEAT_MS,
      );
    }
  }, [onHarvest, addSeeds]);

  if (subTab === 'collection') {
    return (
      <div className="flex-1 flex flex-col w-full">
        {/* Sub-tab header */}
        <SubTabHeader subTab={subTab} setSubTab={setSubTab} theme={theme} t={t} />
        <CollectionPage collection={farm.collection} />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col w-full px-4 pb-2 sm:pb-4">
      {/* Sub-tab header */}
      <SubTabHeader subTab={subTab} setSubTab={setSubTab} theme={theme} t={t} />

      {/* 今日专注信息 */}
      <div className="flex items-center justify-between mb-2 sm:mb-3 px-1">
        <span className="text-xs" style={{ color: theme.textFaint }}>
          {t.farmTodayFocus(todayFocusMinutes)}
        </span>
        <span className="text-xs" style={{ color: theme.textFaint }}>
          🌰 {totalSeeds}
        </span>
      </div>

      {/* 3×3 俯视网格 */}
      <div className="relative mb-3 sm:mb-5 overflow-visible">
        <div className="relative mx-auto w-full max-w-[calc(100%-36px)] sm:max-w-[760px]">
          <div
            className="pointer-events-none absolute inset-0 rounded-[30px]"
            style={{
              background: `radial-gradient(circle at 50% 16%, ${theme.surface}66 0%, ${theme.surface}00 72%)`,
            }}
          />
          <div
            className="farm-grid-perspective relative grid grid-cols-3 gap-1 sm:gap-2"
          >
            {plotSlots.map((slot, index) => (
              <div key={slot.kind === 'plot' ? `plot-${slot.plot.id}` : `locked-${index}`}>
                {slot.kind === 'plot' ? (
                  <PlotCard
                    plot={slot.plot}
                    theme={theme}
                    t={t}
                    onPlantClick={() => {
                      if (totalSeeds > 0) setPlantingPlotId(slot.plot.id);
                      else onGoWarehouse();
                    }}
                    onHarvestClick={() => handleHarvest(slot.plot.id)}
                    onClearClick={() => onClear(slot.plot.id)}
                  />
                ) : (
                  <LockedPlotCard requiredVarieties={slot.requiredVarieties} theme={theme} t={t} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        .farm-grid-perspective {
          transform: perspective(600px) rotateX(12deg);
          transform-origin: center top;
          transform-style: flat;
        }
        @media (min-width: 640px) {
          .farm-grid-perspective {
            transform: perspective(800px) rotateX(18deg);
          }
        }
      `}</style>

      {/* 没有种子提示 */}
      {totalSeeds === 0 && farm.plots.every(p => p.state === 'empty') && (
        <div className="text-center py-4">
          <p className="text-sm mb-2" style={{ color: theme.textMuted }}>{t.farmNoSeeds}</p>
          <button
            onClick={onGoWarehouse}
            className="text-sm font-medium px-4 py-2 rounded-xl"
            style={{ color: theme.accent, backgroundColor: `${theme.accent}15` }}
          >
            {t.farmGoSlice}
          </button>
        </div>
      )}

      {/* 种植弹窗 */}
      {plantingPlotId !== null && (
        <PlantModal
          seeds={seeds}
          unlockedGalaxies={unlockedGalaxies}
          theme={theme}
          t={t}
          onSelect={handlePlant}
          onClose={() => setPlantingPlotId(null)}
        />
      )}

      {/* 品种揭晓动画 */}
      {revealAnim && (
        <RevealOverlay varietyId={revealAnim.varietyId} t={t} />
      )}

      {/* 收获动画 */}
      {harvestAnim && (
        <HarvestOverlay
          varietyId={harvestAnim.varietyId}
          isNew={harvestAnim.isNew}
          collectedCount={harvestAnim.collectedCount}
          rewardSeedQuality={harvestAnim.rewardSeedQuality}
          t={t}
        />
      )}
    </div>
  );
}

// ─── Sub-tab header ───
function SubTabHeader({ subTab, setSubTab, theme, t }: {
  subTab: SubTab;
  setSubTab: (t: SubTab) => void;
  theme: ReturnType<typeof useTheme>;
  t: ReturnType<typeof useI18n>;
}) {
  return (
    <div className="px-1 py-3">
      <div className="relative flex items-center rounded-full p-[3px]" style={{ backgroundColor: theme.inputBg }}>
        <div
          className="absolute top-[3px] bottom-[3px] rounded-full transition-all duration-200 ease-out"
          style={{
            backgroundColor: theme.border,
            width: 'calc(50% - 3px)',
            left: subTab === 'plots' ? '3px' : 'calc(50%)',
          }}
        />
        <button
          onClick={() => setSubTab('plots')}
          className="relative z-10 px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors duration-200 cursor-pointer flex-1"
          style={{
            color: subTab === 'plots' ? theme.text : theme.textMuted,
          }}
        >
          🌱 {t.farmPlotsTab}
        </button>
        <button
          onClick={() => setSubTab('collection')}
          className="relative z-10 px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors duration-200 cursor-pointer flex-1"
          style={{
            color: subTab === 'collection' ? theme.text : theme.textMuted,
          }}
        >
          📖 {t.farmCollectionTab}
        </button>
      </div>
    </div>
  );
}

// ─── 地块卡片 ───
function PlotCard({ plot, theme, t, onPlantClick, onHarvestClick, onClearClick }: {
  plot: Plot;
  theme: ReturnType<typeof useTheme>;
  t: ReturnType<typeof useI18n>;
  onPlantClick: () => void;
  onHarvestClick: () => void;
  onClearClick: () => void;
}) {
  const variety = plot.varietyId ? VARIETY_DEFS[plot.varietyId] : null;
  const revealed = plot.varietyId ? isVarietyRevealed(plot.progress) : false;
  const stage = getGrowthStage(plot.progress);
  const stageEmoji = getStageEmoji(plot.progress, plot.varietyId);
  const rarityColor = variety ? RARITY_COLOR[variety.rarity] : '#4ade80';
  const progressPercent = Math.min(100, plot.progress * 100);
  const progressGlow = variety
    ? `0 0 8px ${rarityColor}AA, 0 0 16px ${rarityColor}55`
    : `0 0 6px ${rarityColor}66`;
  const hasFlowingShine = variety ? (variety.rarity === 'epic' || variety.rarity === 'legendary') : false;
  const flowShineColor = variety?.rarity === 'legendary' ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.62)';
  const tileBackground = plot.state === 'empty'
    ? 'linear-gradient(145deg, #8b5a2b 0%, #6f4424 100%)'
    : plot.state === 'withered'
      ? `linear-gradient(145deg, ${theme.surface} 0%, ${theme.border} 100%)`
      : `linear-gradient(145deg, ${theme.surface} 0%, ${theme.inputBg} 100%)`;
  const tileBorderColor = plot.state === 'mature'
    ? '#fbbf24'
    : plot.state === 'empty'
      ? '#7b4b2b'
      : theme.border;
  const tileShadow = plot.state === 'mature'
    ? '0 14px 26px rgba(251,191,36,0.26), 0 0 16px rgba(251,191,36,0.22)'
    : '0 10px 20px rgba(0,0,0,0.2), inset 0 -10px 16px rgba(0,0,0,0.14)';

  return (
    <div className="group relative aspect-square sm:aspect-[3/4] w-full select-none">
      <div className="relative h-full w-full transition-transform duration-200 group-hover:-translate-y-1">
        <div
          className="absolute inset-0 rounded-2xl border-2"
          style={{
            background: tileBackground,
            borderColor: tileBorderColor,
            boxShadow: tileShadow,
            opacity: plot.state === 'withered' ? 0.74 : 1,
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 46%)',
          }}
        />

        {/* Empty plot */}
        {plot.state === 'empty' && (
          <button
            onClick={onPlantClick}
            className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center gap-1 text-center"
          >
            <span className="text-[clamp(1.7rem,5vw,2.4rem)] font-light leading-none" style={{ color: '#f8eddc' }}>+</span>
            <span className="text-[10px] font-medium tracking-wide leading-none" style={{ color: '#f8eddc' }}>
              {t.farmPlant}
            </span>
          </button>
        )}

        {/* Growing plot */}
        {plot.state === 'growing' && (
          <div
            className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center px-3 py-3 text-center"
          >
            <span
              className="text-[clamp(1.9rem,6vw,2.6rem)]"
              style={{
                filter: variety && revealed && variety.rarity !== 'common'
                  ? `drop-shadow(0 0 6px ${rarityColor})`
                  : 'none',
              }}
            >
              {stageEmoji}
            </span>
            {revealed && variety ? (
              <span className="text-[11px] font-semibold leading-tight" style={{ color: theme.text }}>
                {t.varietyName(plot.varietyId!)}
              </span>
            ) : (
              <span className="text-[11px] font-medium" style={{ color: theme.textFaint }}>???</span>
            )}
            <div className="mt-1 h-1.5 w-[74%] overflow-hidden rounded-full" style={{ backgroundColor: theme.border }}>
              <div
                className="relative h-full overflow-hidden rounded-full transition-all duration-500"
                style={{
                  width: `${progressPercent}%`,
                  backgroundColor: rarityColor,
                  boxShadow: progressPercent > 1 ? progressGlow : 'none',
                }}
              >
                {hasFlowingShine && progressPercent > 2 && (
                  <span
                    className="absolute inset-y-0 left-[-35%] w-[35%] rounded-full"
                    style={{
                      background: `linear-gradient(115deg, transparent 0%, ${flowShineColor} 50%, transparent 100%)`,
                      filter: 'blur(0.5px)',
                      animation: 'progressShine 1.7s linear infinite',
                    }}
                  />
                )}
              </div>
            </div>
            <span className="mt-1 text-[10px]" style={{ color: theme.textFaint }}>
              {t.farmStage(stage)}
            </span>
          </div>
        )}

        {/* Mature plot */}
        {plot.state === 'mature' && variety && (
          <button
            onClick={onHarvestClick}
            className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center px-3 py-3 text-center"
          >
            <span className="text-[clamp(2rem,6vw,2.7rem)]" style={{
              filter: `drop-shadow(0 0 8px ${rarityColor})`,
              animation: 'maturePulse 2s ease-in-out infinite',
            }}>
              {variety.emoji}
            </span>
            <span className="text-[11px] font-semibold leading-tight" style={{ color: theme.text }}>
              {t.varietyName(plot.varietyId!)}
            </span>
            <span
              className="mt-1 rounded-full px-3 py-1 text-[10px] font-bold"
              style={{ backgroundColor: '#fbbf24', color: '#000' }}
            >
              ✋ {t.farmHarvest}
            </span>
          </button>
        )}

        {/* Withered plot */}
        {plot.state === 'withered' && (
          <button
            onClick={onClearClick}
            className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center px-3 py-3 text-center"
          >
            <span className="text-[clamp(1.9rem,6vw,2.5rem)] grayscale">💀</span>
            <span className="text-[11px] font-medium" style={{ color: theme.textMuted }}>{t.farmWithered}</span>
            <span
              className="mt-1 rounded-full px-3 py-1 text-[10px] font-medium"
              style={{ color: theme.textMuted, backgroundColor: `${theme.border}66` }}
            >
              {t.farmClear}
            </span>
          </button>
        )}

        {/* Seed quality badge */}
        {plot.seedQuality && plot.state !== 'empty' && plot.state !== 'withered' && (
          <div className="absolute right-2 top-2 z-20">
            <span
              className="rounded-full px-1.5 py-0.5 text-[10px] font-medium"
              style={{
                backgroundColor: plot.seedQuality === 'legendary' ? '#fbbf2420' : plot.seedQuality === 'epic' ? '#a78bfa20' : `${theme.border}50`,
                color: plot.seedQuality === 'legendary' ? '#fbbf24' : plot.seedQuality === 'epic' ? '#a78bfa' : theme.textFaint,
              }}
            >
              {t.seedQualityLabel(plot.seedQuality)}
            </span>
          </div>
        )}
      </div>

      <style>{`
        @keyframes maturePulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        @keyframes progressShine {
          0% { transform: translateX(-110%); opacity: 0.2; }
          35% { opacity: 0.95; }
          100% { transform: translateX(390%); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function LockedPlotCard({ requiredVarieties, theme, t }: {
  requiredVarieties: number;
  theme: ReturnType<typeof useTheme>;
  t: ReturnType<typeof useI18n>;
}) {
  return (
    <div className="relative aspect-square sm:aspect-[3/4] w-full select-none">
      <div
        className="absolute inset-0 rounded-2xl border-2"
        style={{
          background: `linear-gradient(145deg, ${theme.surface} 0%, ${theme.inputBg} 100%)`,
          borderColor: theme.border,
          opacity: 0.8,
          boxShadow: '0 8px 16px rgba(0,0,0,0.16), inset 0 -10px 14px rgba(0,0,0,0.14)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 56%)' }}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center px-3 text-center">
        <span className="text-[clamp(1.5rem,4.8vw,2.2rem)]">🔒</span>
        <span className="mt-1 text-[11px] font-semibold" style={{ color: theme.textMuted }}>
          {t.collectionLocked}
        </span>
        <span className="mt-1 text-[10px] leading-snug" style={{ color: theme.textFaint }}>
          {t.farmUnlockHint(requiredVarieties)}
        </span>
      </div>
    </div>
  );
}

// ─── 种植弹窗 ───
function PlantModal({ seeds, unlockedGalaxies, theme, t, onSelect, onClose }: {
  seeds: SeedCounts;
  unlockedGalaxies: GalaxyId[];
  theme: ReturnType<typeof useTheme>;
  t: ReturnType<typeof useI18n>;
  onSelect: (galaxyId: GalaxyId, quality: SeedQuality) => void;
  onClose: () => void;
}) {
  const [selectedGalaxyId, setSelectedGalaxyId] = useState<GalaxyId | null>(
    unlockedGalaxies.length === 1 ? unlockedGalaxies[0] : null,
  );
  const galaxyEmojiMap = useMemo(
    () => Object.fromEntries(GALAXIES.map(g => [g.id, g.emoji])) as Record<GalaxyId, string>,
    [],
  );

  useEffect(() => {
    if (unlockedGalaxies.length === 1) {
      setSelectedGalaxyId(unlockedGalaxies[0]);
      return;
    }
    if (selectedGalaxyId && !unlockedGalaxies.includes(selectedGalaxyId)) {
      setSelectedGalaxyId(null);
    }
  }, [selectedGalaxyId, unlockedGalaxies]);

  const showGalaxyStep = unlockedGalaxies.length > 1 && selectedGalaxyId === null;
  const activeGalaxyId = selectedGalaxyId ?? unlockedGalaxies[0] ?? 'thick-earth';
  const options: { quality: SeedQuality; emoji: string; count: number; color: string }[] = [
    { quality: 'normal', emoji: '🌰', count: seeds.normal, color: '#a3a3a3' },
    { quality: 'epic', emoji: '💎', count: seeds.epic, color: '#a78bfa' },
    { quality: 'legendary', emoji: '🌟', count: seeds.legendary, color: '#fbbf24' },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="rounded-2xl border p-5 mx-4 max-w-sm w-full" style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
        <h3 className="text-base font-semibold text-center mb-4" style={{ color: theme.text }}>
          {showGalaxyStep ? t.farmSelectGalaxy : t.farmSelectSeed}
        </h3>
        {showGalaxyStep ? (
          <div className="flex flex-col gap-2">
            {unlockedGalaxies.map(galaxyId => (
              <button
                key={galaxyId}
                onClick={() => setSelectedGalaxyId(galaxyId)}
                className="flex items-center justify-between p-3 rounded-xl border transition-all"
                style={{
                  backgroundColor: `${theme.accent}08`,
                  borderColor: `${theme.accent}30`,
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{galaxyEmojiMap[galaxyId] ?? '🪐'}</span>
                  <span className="text-sm font-medium" style={{ color: theme.text }}>
                    {t.galaxyName(galaxyId)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <>
            <div className="mb-3 rounded-xl border px-3 py-2 text-xs flex items-center justify-between" style={{ borderColor: theme.border, backgroundColor: `${theme.inputBg}80` }}>
              <span style={{ color: theme.textMuted }}>
                {`${galaxyEmojiMap[activeGalaxyId] ?? '🪐'} ${t.galaxyName(activeGalaxyId)}`}
              </span>
              {unlockedGalaxies.length > 1 && (
                <button
                  onClick={() => setSelectedGalaxyId(null)}
                  className="font-medium"
                  style={{ color: theme.accent }}
                >
                  {t.farmSelectGalaxy}
                </button>
              )}
            </div>
            <div className="flex flex-col gap-2">
              {options.map(opt => (
                <button
                  key={opt.quality}
                  disabled={opt.count <= 0}
                  onClick={() => onSelect(activeGalaxyId, opt.quality)}
                  className="flex items-center justify-between p-3 rounded-xl border transition-all"
                  style={{
                    backgroundColor: opt.count > 0 ? `${opt.color}08` : theme.inputBg,
                    borderColor: opt.count > 0 ? `${opt.color}30` : theme.border,
                    opacity: opt.count > 0 ? 1 : 0.4,
                    cursor: opt.count > 0 ? 'pointer' : 'not-allowed',
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{opt.emoji}</span>
                    <span className="text-sm font-medium" style={{ color: opt.count > 0 ? opt.color : theme.textMuted }}>
                      {t.seedQualityLabel(opt.quality)}
                    </span>
                  </div>
                  <span className="text-sm" style={{ color: theme.textMuted }}>×{opt.count}</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-center mt-3" style={{ color: theme.textFaint }}>
              {t.farmSeedHint}
            </p>
          </>
        )}
        <button
          onClick={onClose}
          className="w-full mt-3 py-2.5 rounded-xl text-sm"
          style={{ color: theme.textMuted, backgroundColor: `${theme.border}30` }}
        >
          {t.cancel}
        </button>
      </div>
    </div>
  );
}

// ─── 品种揭晓动画 ───
function RevealOverlay({ varietyId, t }: {
  varietyId: VarietyId;
  t: ReturnType<typeof useI18n>;
}) {
  const variety = VARIETY_DEFS[varietyId];
  const color = RARITY_COLOR[variety.rarity];
  const rarityStars = RARITY_STARS[variety.rarity];
  const isRarePlus = rarityStars >= REVEAL_RARE_PLUS_MIN_STARS;
  const revealDuration = isRarePlus ? REVEAL_DURATION_RARE_PLUS_MS : REVEAL_DURATION_MS;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center pointer-events-none overflow-hidden"
      style={{ backgroundColor: isRarePlus ? 'rgba(2,6,14,0.56)' : 'transparent' }}
    >
      {isRarePlus && (
        <div className="absolute inset-0">
          <div
            className="absolute left-1/2 top-1/2 w-[460px] h-[460px] rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl"
            style={{
              background: `conic-gradient(from 0deg, transparent 0%, ${color}88 20%, transparent 38%, ${color}66 56%, transparent 74%, ${color}99 92%, transparent 100%)`,
              animation: 'revealRareBandSpin 6.5s linear infinite',
            }}
          />
          <div
            className="absolute left-1/2 top-1/2 w-[360px] h-[360px] rounded-full -translate-x-1/2 -translate-y-1/2"
            style={{
              border: `1px solid ${color}66`,
              boxShadow: `0 0 48px ${color}55`,
              animation: 'revealRareBandReverse 5.4s linear infinite',
            }}
          />
          <div
            className="absolute left-1/2 top-1/2 w-[320px] h-[320px] -translate-x-1/2 -translate-y-1/2"
            style={{ animation: 'revealParticleRing 5.2s linear infinite' }}
          >
            {Array.from({ length: 16 }).map((_, i) => {
              const angle = (Math.PI * 2 * i) / 16;
              const x = 50 + Math.cos(angle) * 43;
              const y = 50 + Math.sin(angle) * 43;
              const size = i % 3 === 0 ? 6 : 4;
              return (
                <span
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    width: size,
                    height: size,
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: i % 2 === 0 ? color : '#fff',
                    boxShadow: `0 0 12px ${color}`,
                    animation: `revealParticleFlicker 1.4s ease-in-out ${i * 0.08}s infinite`,
                  }}
                />
              );
            })}
          </div>
        </div>
      )}

      <div
        className="relative flex flex-col items-center"
        style={{
          animation: isRarePlus
            ? `revealPopRare ${revealDuration}ms cubic-bezier(0.22, 1.25, 0.35, 1) forwards`
            : `revealPop ${revealDuration}ms ease-out forwards`,
        }}
      >
        {rarityStars >= 2 && (
          <div
            className="absolute w-44 h-44 rounded-full"
            style={{
              background: `radial-gradient(circle, ${color}44 0%, transparent 72%)`,
              animation: 'revealGlow 1.4s ease-in-out infinite alternate',
            }}
          />
        )}
        <span className="text-6xl mb-3" style={{
          filter: rarityStars >= 2 ? `drop-shadow(0 0 24px ${color})` : 'none',
          animation: isRarePlus
            ? 'revealEmojiRare 1.05s cubic-bezier(0.34, 1.66, 0.58, 1) forwards'
            : 'revealEmoji 0.82s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        }}>
          {variety.emoji}
        </span>
        <div className="text-center">
          <p
            className="text-lg font-bold mb-1"
            style={{
              color: '#fff',
              textShadow: isRarePlus
                ? `0 0 14px ${color}, 0 0 26px ${color}88, 0 3px 12px rgba(0,0,0,0.65)`
                : '0 2px 8px rgba(0,0,0,0.5)',
            }}
          >
            {t.farmReveal}
          </p>
          <p
            className="text-xl font-black"
            style={{
              color: isRarePlus ? '#fff' : color,
              textShadow: isRarePlus
                ? `0 0 18px ${color}, 0 0 36px ${color}AA`
                : `0 0 15px ${color}80`,
            }}
          >
            {t.varietyName(varietyId)}
          </p>
          <div className="flex items-center justify-center gap-0.5 mt-1">
            {Array.from({ length: rarityStars }).map((_, i) => (
              <span
                key={i}
                style={{
                  color,
                  fontSize: 14,
                  textShadow: isRarePlus ? `0 0 10px ${color}` : 'none',
                }}
              >
                ⭐
              </span>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes revealPop {
          0% { opacity: 0; transform: scale(0.3); }
          20% { opacity: 1; transform: scale(1.1); }
          40% { transform: scale(1); }
          80% { opacity: 1; }
          100% { opacity: 0; transform: scale(1) translateY(-20px); }
        }
        @keyframes revealPopRare {
          0% { opacity: 0; transform: scale(0.16) rotate(-8deg); }
          18% { opacity: 1; transform: scale(1.2) rotate(3deg); }
          34% { transform: scale(0.96) rotate(-1deg); }
          50% { transform: scale(1.05) rotate(0deg); }
          82% { opacity: 1; transform: scale(1.02); }
          100% { opacity: 0; transform: scale(1) translateY(-30px); }
        }
        @keyframes revealGlow {
          0% { transform: scale(0.8); opacity: 0.5; }
          100% { transform: scale(1.2); opacity: 1; }
        }
        @keyframes revealEmoji {
          0% { transform: scale(0) rotate(-30deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        @keyframes revealEmojiRare {
          0% { transform: scale(0) rotate(-38deg); }
          60% { transform: scale(1.2) rotate(4deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        @keyframes revealRareBandSpin {
          0% { transform: translate(-50%, -50%) rotate(0deg) scale(0.95); opacity: 0.6; }
          100% { transform: translate(-50%, -50%) rotate(360deg) scale(1.05); opacity: 0.95; }
        }
        @keyframes revealRareBandReverse {
          0% { transform: translate(-50%, -50%) rotate(0deg); opacity: 0.35; }
          100% { transform: translate(-50%, -50%) rotate(-360deg); opacity: 0.75; }
        }
        @keyframes revealParticleRing {
          0% { transform: translate(-50%, -50%) rotate(0deg) scale(0.9); opacity: 0.8; }
          100% { transform: translate(-50%, -50%) rotate(360deg) scale(1.08); opacity: 1; }
        }
        @keyframes revealParticleFlicker {
          0%, 100% { opacity: 0.25; transform: translate(-50%, -50%) scale(0.65); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.15); }
        }
      `}</style>
    </div>
  );
}

// ─── 收获动画 ───
function HarvestOverlay({ varietyId, isNew, collectedCount, rewardSeedQuality, t }: {
  varietyId: VarietyId;
  isNew: boolean;
  collectedCount: number;
  rewardSeedQuality?: SeedQuality;
  t: ReturnType<typeof useI18n>;
}) {
  const variety = VARIETY_DEFS[varietyId];
  const color = RARITY_COLOR[variety.rarity];
  const safeCollectedCount = Math.max(isNew ? 1 : 2, collectedCount);
  const stars = RARITY_STARS[variety.rarity];

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: isNew ? 'rgba(4,8,22,0.82)' : 'rgba(0,0,0,0.62)' }}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="absolute inset-0"
        style={{
          background: isNew
            ? `radial-gradient(circle at 50% 50%, ${color}26 0%, rgba(0,0,0,0) 52%)`
            : `radial-gradient(circle at 50% 50%, ${color}18 0%, rgba(0,0,0,0) 48%)`,
          animation: isNew ? 'harvestBackdropBreath 1.8s ease-in-out infinite alternate' : 'harvestRepeatBackdrop 2.3s ease-in-out infinite',
        }}
      />
      {isNew && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 40 }).map((_, i) => {
            const left = 4 + ((i * 23) % 92);
            const delay = (i % 9) * 0.11;
            const duration = 1.9 + (i % 4) * 0.35;
            const size = 3 + (i % 3) * 2;
            const animationName = i % 3 === 0 ? 'harvestFireworkA' : i % 3 === 1 ? 'harvestFireworkB' : 'harvestFireworkC';
            const tint = i % 2 === 0 ? color : '#ffffff';
            return (
              <span
                key={i}
                className="absolute rounded-full"
                style={{
                  left: `${left}%`,
                  bottom: '-10%',
                  width: size,
                  height: size,
                  backgroundColor: tint,
                  boxShadow: `0 0 12px ${tint}`,
                  animation: `${animationName} ${duration}s ease-out ${delay}s infinite`,
                }}
              />
            );
          })}
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={`ray-${i}`}
              className="absolute left-1/2 top-1/2 w-[2px] h-[220px] origin-bottom"
              style={{
                transform: `translate(-50%, -88%) rotate(${i * 45}deg)`,
                background: `linear-gradient(180deg, ${color}DD 0%, transparent 100%)`,
                animation: `harvestRay 1.9s ease-out ${i * 0.07}s infinite`,
              }}
            />
          ))}
        </div>
      )}
      {!isNew && (
        <div
          className="absolute left-1/2 top-1/2 w-72 h-72 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl"
          style={{
            background: `radial-gradient(circle, ${color}24 0%, transparent 70%)`,
            animation: 'harvestRepeatGlow 2.3s ease-in-out infinite',
          }}
        />
      )}

      <div
        className="relative flex flex-col items-center"
        style={{
          animation: isNew
            ? 'harvestEntry 0.72s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
            : 'harvestEntryRepeat 0.45s ease-out forwards',
        }}
      >
        <span className="text-7xl mb-4" style={{
          filter: `drop-shadow(0 0 ${isNew ? 28 : 10}px ${color})`,
          animation: isNew ? 'harvestEmojiPulse 1.3s ease-in-out infinite' : 'none',
        }}>
          {variety.emoji}
        </span>

        <p className="text-xl font-black mb-1" style={{
          color: isNew ? '#fff' : color,
          textShadow: isNew ? `0 0 14px ${color}, 0 0 30px ${color}99` : `0 0 12px ${color}66`,
        }}>
          {t.varietyName(varietyId)}
        </p>

        <div className="flex items-center gap-0.5 mb-2">
          {Array.from({ length: stars }).map((_, i) => (
            <span key={i} style={{ color, fontSize: 16 }}>⭐</span>
          ))}
        </div>

        {isNew ? (
          <div className="flex flex-col items-center gap-1 mb-1">
            <span
              className="text-[11px] font-black"
              style={{
                color: '#fff',
                letterSpacing: '0.38em',
                paddingLeft: '0.38em',
                textShadow: `0 0 12px ${color}, 0 0 24px ${color}`,
                animation: 'newFlash 0.75s steps(2, end) infinite',
              }}
            >
              {t.farmNewFlash}
            </span>
            <div className="px-4 py-1.5 rounded-full text-sm font-bold" style={{
              backgroundColor: `${color}22`,
              color,
              border: `1px solid ${color}55`,
              animation: 'newBadgePulse 1s ease-in-out infinite alternate',
            }}>
              ✨ {t.farmNewVariety}
            </div>
            {rewardSeedQuality && (
              <div
                className="px-3 py-1 rounded-full text-xs font-semibold"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.14)',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.28)',
                }}
              >
                {`🌰 +1 ${t.seedQualityLabel(rewardSeedQuality)}`}
              </div>
            )}
          </div>
        ) : (
          <span className="text-sm font-medium" style={{
            color: 'rgba(255,255,255,0.82)',
            textShadow: '0 2px 6px rgba(0,0,0,0.45)',
          }}>
            {`${t.farmAlreadyCollected} ×${safeCollectedCount}`}
          </span>
        )}

        <p className="text-xs mt-3 max-w-[240px] text-center leading-relaxed" style={{ color: isNew ? 'rgba(255,255,255,0.72)' : 'rgba(255,255,255,0.56)' }}>
          {t.varietyStory(varietyId)}
        </p>
      </div>

      <style>{`
        @keyframes harvestEntry {
          0% { opacity: 0; transform: scale(0.45) translateY(40px); }
          75% { opacity: 1; transform: scale(1.06) translateY(-6px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes harvestEntryRepeat {
          0% { opacity: 0; transform: scale(0.82) translateY(14px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes harvestBackdropBreath {
          0% { opacity: 0.55; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1.06); }
        }
        @keyframes harvestRepeatGlow {
          0%, 100% { opacity: 0.45; transform: translate(-50%, -50%) scale(0.95); }
          50% { opacity: 0.85; transform: translate(-50%, -50%) scale(1.06); }
        }
        @keyframes harvestRepeatBackdrop {
          0%, 100% { opacity: 0.35; }
          50% { opacity: 0.7; }
        }
        @keyframes harvestEmojiPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        @keyframes harvestFireworkA {
          0% { opacity: 1; transform: translate(0, 0) scale(1); }
          100% { opacity: 0; transform: translate(-70px, -84vh) scale(0.2); }
        }
        @keyframes harvestFireworkB {
          0% { opacity: 1; transform: translate(0, 0) scale(1); }
          100% { opacity: 0; transform: translate(12px, -78vh) scale(0.2); }
        }
        @keyframes harvestFireworkC {
          0% { opacity: 1; transform: translate(0, 0) scale(1); }
          100% { opacity: 0; transform: translate(72px, -88vh) scale(0.2); }
        }
        @keyframes harvestRay {
          0% { opacity: 0; filter: blur(0.5px); }
          20% { opacity: 0.95; }
          100% { opacity: 0; filter: blur(2px); }
        }
        @keyframes newBadgePulse {
          0% { transform: scale(1); }
          100% { transform: scale(1.06); }
        }
        @keyframes newFlash {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0.25; }
        }
      `}</style>
    </div>
  );
}
