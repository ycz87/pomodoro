/**
 * FarmPage — 农场主页面
 *
 * 3×3 地块网格（未解锁显示锁定卡）+ 种植/收获/清除交互 + 品种揭晓动画 + 收获动画。
 * 内嵌图鉴入口（顶部 tab 切换）。
 */
import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useTheme } from '../hooks/useTheme';
import { useI18n } from '../i18n';
import type { Plot, VarietyId, FarmStorage, GalaxyId, StolenRecord, FusionHistory } from '../types/farm';
import type { GeneInventory } from '../types/gene';
import type { FusionResult } from '../types/gene';
import type { SeedQuality, SeedCounts, InjectedSeed, HybridSeed, PrismaticSeed, ItemId } from '../types/slicing';
import { VARIETY_DEFS, RARITY_COLOR, RARITY_STARS, PLOT_MILESTONES } from '../types/farm';
import { getGrowthStage, getStageEmoji, isVarietyRevealed } from '../farm/growth';
import { CollectionPage } from './CollectionPage';
import { HybridDexPage } from './HybridDexPage';
import { GeneLabPage } from './GeneLabPage';

interface FarmPageProps {
  farm: FarmStorage;
  geneInventory: GeneInventory;
  seeds: SeedCounts;
  items: Record<ItemId, number>;
  injectedSeeds: InjectedSeed[];
  hybridSeeds: HybridSeed[];
  prismaticSeeds: PrismaticSeed[];
  todayFocusMinutes: number;
  todayKey: string;
  addSeeds: (count: number, quality?: SeedQuality) => void;
  onPlant: (plotId: number, quality: SeedQuality) => VarietyId;
  onPlantInjected: (plotId: number, seedId: string) => void;
  onPlantHybrid: (plotId: number, seedId: string) => void;
  onPlantPrismatic: (plotId: number, seedId: string) => void;
  onInject: (galaxyId: GalaxyId, quality: SeedQuality) => void;
  onFusion: (fragment1Id: string, fragment2Id: string, useModifier: boolean) => { success: boolean; galaxyPair: string } | null;
  onFiveElementFusion: () => FusionResult | null;
  harvestedHybridVarietyCount: number;
  fusionHistory: FusionHistory;
  onHarvest: (plotId: number) => {
    varietyId?: VarietyId;
    isMutant?: boolean;
    isNew: boolean;
    collectedCount?: number;
    rewardSeedQuality?: SeedQuality;
  };
  onClear: (plotId: number) => void;
  onUseMutationGun: (plotId: number) => void;
  onUseMoonDew: (plotId: number) => void;
  onUseNectar: (plotId: number) => void;
  onUseStarTracker: (plotId: number) => void;
  onUseGuardianBarrier: () => void;
  onUseTrapNet: (plotId: number) => void;
  onGoWarehouse: () => void;
}

type SubTab = 'plots' | 'collection' | 'hybrid' | 'lab';

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

export function FarmPage({
  farm,
  geneInventory,
  seeds,
  items,
  injectedSeeds,
  hybridSeeds,
  prismaticSeeds,
  todayFocusMinutes,
  todayKey,
  addSeeds,
  onPlant,
  onPlantInjected,
  onPlantHybrid,
  onPlantPrismatic,
  onInject,
  onFusion,
  onFiveElementFusion,
  harvestedHybridVarietyCount,
  fusionHistory,
  onHarvest,
  onClear,
  onUseMutationGun,
  onUseMoonDew,
  onUseNectar,
  onUseStarTracker,
  onUseGuardianBarrier,
  onUseTrapNet,
  onGoWarehouse,
}: FarmPageProps) {
  const theme = useTheme();
  const t = useI18n();

  const [subTab, setSubTab] = useState<SubTab>('plots');
  const [plantingPlotId, setPlantingPlotId] = useState<number | null>(null);
  const [revealAnim, setRevealAnim] = useState<RevealAnim | null>(null);
  const [harvestAnim, setHarvestAnim] = useState<HarvestAnim | null>(null);
  const [showFarmHelp, setShowFarmHelp] = useState(false);
  const [activeTooltipPlotId, setActiveTooltipPlotId] = useState<number | null>(null);
  const [nowTimestamp, setNowTimestamp] = useState(() => Date.now());

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

  useEffect(() => {
    const timerId = window.setInterval(() => setNowTimestamp(Date.now()), 1000);
    return () => window.clearInterval(timerId);
  }, []);

  const totalBaseSeeds = seeds.normal + seeds.epic + seeds.legendary;
  const totalPlantableSeeds = totalBaseSeeds + injectedSeeds.length + hybridSeeds.length + prismaticSeeds.length;
  const mutationGunCount = (items as Record<string, number>)['mutation-gun'] ?? 0;
  const moonDewCount = (items as Record<string, number>)['moon-dew'] ?? 0;
  const nectarCount = (items as Record<string, number>)['nectar'] ?? 0;
  const starTrackerCount = (items as Record<string, number>)['star-tracker'] ?? 0;
  const guardianBarrierCount = (items as Record<string, number>)['guardian-barrier'] ?? 0;
  const trapNetCount = (items as Record<string, number>)['trap-net'] ?? 0;
  const barrierActiveToday = farm.guardianBarrierDate === todayKey;

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

  const latestStolenRecordByPlotId = useMemo(() => {
    const latestByPlot = new Map<number, StolenRecord>();
    for (const record of farm.stolenRecords) {
      const previous = latestByPlot.get(record.plotId);
      if (!previous || record.stolenAt > previous.stolenAt) {
        latestByPlot.set(record.plotId, record);
      }
    }
    return latestByPlot;
  }, [farm.stolenRecords]);

  const handlePlant = useCallback((quality: SeedQuality) => {
    if (plantingPlotId === null) return;
    onPlant(plantingPlotId, quality);
    setPlantingPlotId(null);
  }, [plantingPlotId, onPlant]);

  const handlePlantInjected = useCallback((seedId: string) => {
    if (plantingPlotId === null) return;
    onPlantInjected(plantingPlotId, seedId);
    setPlantingPlotId(null);
  }, [plantingPlotId, onPlantInjected]);

  const handlePlantHybrid = useCallback((seedId: string) => {
    if (plantingPlotId === null) return;
    onPlantHybrid(plantingPlotId, seedId);
    setPlantingPlotId(null);
  }, [plantingPlotId, onPlantHybrid]);

  const handlePlantPrismatic = useCallback((seedId: string) => {
    if (plantingPlotId === null) return;
    onPlantPrismatic(plantingPlotId, seedId);
    setPlantingPlotId(null);
  }, [plantingPlotId, onPlantPrismatic]);

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

  if (subTab === 'lab') {
    return (
      <div className="flex-1 flex flex-col w-full">
        {/* Sub-tab header */}
        <SubTabHeader subTab={subTab} setSubTab={setSubTab} theme={theme} t={t} />
        <GeneLabPage
          geneInventory={geneInventory}
          seeds={seeds}
          items={items}
          hybridSeeds={hybridSeeds}
          prismaticSeedCount={prismaticSeeds.length}
          harvestedHybridVarietyCount={harvestedHybridVarietyCount}
          fusionHistory={fusionHistory}
          onInject={onInject}
          onFusion={onFusion}
          onFiveElementFusion={onFiveElementFusion}
        />
      </div>
    );
  }

  if (subTab === 'hybrid') {
    return (
      <div className="flex-1 flex flex-col w-full">
        {/* Sub-tab header */}
        <SubTabHeader subTab={subTab} setSubTab={setSubTab} theme={theme} t={t} />
        <HybridDexPage collection={farm.collection} />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col w-full px-4 pb-2 sm:pb-4">
      {/* Sub-tab header */}
      <SubTabHeader subTab={subTab} setSubTab={setSubTab} theme={theme} t={t} />

      {/* 今日专注信息 */}
      <div className="flex items-center justify-between mb-2 sm:mb-3 px-1">
        <div className="flex items-center gap-1.5">
          <span className="text-xs" style={{ color: theme.textFaint }}>
            {t.farmTodayFocus(todayFocusMinutes)}
          </span>
          <button
            onClick={() => setShowFarmHelp(true)}
            className="h-5 w-5 rounded-full border text-[11px] leading-none flex items-center justify-center"
            style={{
              borderColor: theme.border,
              backgroundColor: `${theme.inputBg}cc`,
              color: theme.textFaint,
            }}
            title={t.farmHelpTitle}
            aria-label={t.farmHelpTitle}
          >
            ℹ️
          </button>
        </div>
        <span className="text-xs whitespace-nowrap" style={{ color: theme.textFaint }}>
          {`🌰 ${totalBaseSeeds} · 🧬 ${injectedSeeds.length} · 🌈 ${prismaticSeeds.length}`}
        </span>
      </div>

      {/* 道具快捷栏 */}
      <div className="flex items-center gap-2 mb-3 overflow-x-auto no-scrollbar pb-1">
        {(guardianBarrierCount > 0 || barrierActiveToday) && (
          <button
            onClick={onUseGuardianBarrier}
            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium"
            style={{
              backgroundColor: `${theme.surface}cc`,
              borderColor: barrierActiveToday ? '#fbbf24' : theme.border,
              color: barrierActiveToday ? '#fbbf24' : theme.text,
            }}
            title={barrierActiveToday ? t.itemGuardianBarrierActive : t.itemName('guardian-barrier')}
          >
            <span>🎪</span>
            <span>{barrierActiveToday ? t.itemGuardianBarrierActive : `${t.itemName('guardian-barrier')} · ${guardianBarrierCount}`}</span>
          </button>
        )}
        {trapNetCount > 0 && (
          <div
            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium"
            style={{
              backgroundColor: `${theme.surface}cc`,
              borderColor: theme.border,
              color: theme.text,
            }}
            title={t.itemName('trap-net')}
            data-testid="trap-net-inventory"
          >
            <span>🪤</span>
            <span>{trapNetCount}</span>
          </div>
        )}
      </div>

      {/* 3×3 俯视网格 */}
      <div className="relative mb-3 sm:mb-5 overflow-visible">
        <div className="relative mx-auto w-full max-w-[90%] sm:max-w-[760px]">
          <div
            className="pointer-events-none absolute inset-0 rounded-[30px]"
            style={{
              background: `radial-gradient(circle at 50% 16%, ${theme.surface}66 0%, ${theme.surface}00 72%)`,
            }}
          />
          <div
            className="farm-grid-perspective relative grid grid-cols-3 gap-1 sm:gap-2"
            onClick={() => setActiveTooltipPlotId(null)}
          >
            {plotSlots.map((slot, index) => (
              <div key={slot.kind === 'plot' ? `plot-${slot.plot.id}` : `locked-${index}`}>
                {slot.kind === 'plot' ? (
                  <PlotCard
                    plot={slot.plot}
                    stolenRecord={latestStolenRecordByPlotId.get(slot.plot.id)}
                    nowTimestamp={nowTimestamp}
                    theme={theme}
                    t={t}
                    isTooltipOpen={activeTooltipPlotId === slot.plot.id}
                    onTooltipToggle={() => {
                      setActiveTooltipPlotId((prev) => (prev === slot.plot.id ? null : slot.plot.id));
                    }}
                    onPlantClick={() => {
                      if (totalPlantableSeeds > 0) setPlantingPlotId(slot.plot.id);
                      else onGoWarehouse();
                    }}
                    onHarvestClick={() => handleHarvest(slot.plot.id)}
                    onClearClick={() => onClear(slot.plot.id)}
                    mutationGunCount={mutationGunCount}
                    onUseMutationGun={() => onUseMutationGun(slot.plot.id)}
                    moonDewCount={moonDewCount}
                    onUseMoonDew={() => onUseMoonDew(slot.plot.id)}
                    nectarCount={nectarCount}
                    onUseNectar={() => onUseNectar(slot.plot.id)}
                    starTrackerCount={starTrackerCount}
                    onUseStarTracker={() => onUseStarTracker(slot.plot.id)}
                    trapNetCount={trapNetCount}
                    onUseTrapNet={() => onUseTrapNet(slot.plot.id)}
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
      {totalPlantableSeeds === 0 && farm.plots.every(p => p.state === 'empty') && (
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
            injectedSeeds={injectedSeeds}
            hybridSeeds={hybridSeeds}
            prismaticSeeds={prismaticSeeds}
            theme={theme}
            t={t}
            onSelect={handlePlant}
            onSelectInjected={handlePlantInjected}
            onSelectHybrid={handlePlantHybrid}
            onSelectPrismatic={handlePlantPrismatic}
            onClose={() => setPlantingPlotId(null)}
          />
        )}

      {/* 农场规则弹窗 */}
      {showFarmHelp && (
        <FarmHelpModal
          theme={theme}
          t={t}
          onClose={() => setShowFarmHelp(false)}
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
  const subTabIndex: Record<SubTab, number> = {
    plots: 0,
    collection: 1,
    hybrid: 2,
    lab: 3,
  };

  return (
    <div className="px-1 py-3">
      <div className="relative flex items-center rounded-full p-[3px]" style={{ backgroundColor: theme.inputBg }}>
        <div
          className="absolute top-[3px] bottom-[3px] rounded-full transition-all duration-200 ease-out"
          style={{
            backgroundColor: theme.border,
            width: 'calc((100% - 6px) / 4)',
            left: '3px',
            transform: `translateX(${subTabIndex[subTab] * 100}%)`,
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
        <button
          onClick={() => setSubTab('hybrid')}
          className="relative z-10 px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors duration-200 cursor-pointer flex-1"
          style={{
            color: subTab === 'hybrid' ? theme.text : theme.textMuted,
          }}
        >
          🧬 {t.hybridDexTab || '杂交'}
        </button>
        <button
          onClick={() => setSubTab('lab')}
          className="relative z-10 px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors duration-200 cursor-pointer flex-1"
          style={{
            color: subTab === 'lab' ? theme.text : theme.textMuted,
          }}
        >
          {t.geneLabTab}
        </button>
      </div>
    </div>
  );
}

// ─── 地块卡片 ───
function PlotCard({ plot, stolenRecord, nowTimestamp, theme, t, isTooltipOpen, onTooltipToggle, onPlantClick, onHarvestClick, onClearClick, mutationGunCount, onUseMutationGun, moonDewCount, onUseMoonDew, nectarCount, onUseNectar, starTrackerCount, onUseStarTracker, trapNetCount, onUseTrapNet }: {
  plot: Plot;
  stolenRecord?: StolenRecord;
  nowTimestamp: number;
  theme: ReturnType<typeof useTheme>;
  t: ReturnType<typeof useI18n>;
  isTooltipOpen: boolean;
  onTooltipToggle: () => void;
  onPlantClick: () => void;
  onHarvestClick: () => void;
  onClearClick: () => void;
  mutationGunCount: number;
  onUseMutationGun: () => void;
  moonDewCount: number;
  onUseMoonDew: () => void;
  nectarCount: number;
  onUseNectar: () => void;
  starTrackerCount: number;
  onUseStarTracker: () => void;
  trapNetCount: number;
  onUseTrapNet: () => void;
}) {
  const variety = plot.varietyId ? VARIETY_DEFS[plot.varietyId] : null;
  const varietyLabel = plot.varietyId
    ? `${t.varietyName(plot.varietyId)}${plot.isMutant ? ` · ${t.mutationPositive}` : ''}`
    : '';
  const negativeStatusText = plot.mutationStatus === 'negative'
    ? (plot.state === 'withered' ? t.mutationWithered : t.mutationDowngraded)
    : null;
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
  const matureMinutes = variety?.matureMinutes ?? 10000;
  const mutationChance = Math.max(0, Math.min(1, plot.mutationChance ?? 0.02));
  const isMutationResolved = plot.progress >= 0.20 && (plot.mutationChance ?? 0.02) === 0;
  const canUseMutationGun = plot.state === 'growing'
    && (plot.mutationStatus ?? 'none') === 'none'
    && mutationGunCount > 0
    && !isMutationResolved
    && plot.progress < 0.20;
  const canUseMoonDew = plot.state === 'mature' && moonDewCount > 0;
  const canUseNectar = plot.state === 'withered' && nectarCount > 0;
  const canUseStarTracker = (plot.state === 'growing' || plot.state === 'mature') && starTrackerCount > 0 && !plot.hasTracker;
  const canUseTrapNet = Boolean(plot.thief) && trapNetCount > 0;
  const shouldPreferMatureTooltip = canUseMoonDew || canUseStarTracker;
  const shouldPreferWitheredTooltip = canUseNectar;
  const thiefTotalMs = plot.thief ? Math.max(1, plot.thief.stealsAt - plot.thief.appearedAt) : 1;
  const thiefRemainingMs = plot.thief ? Math.max(0, plot.thief.stealsAt - nowTimestamp) : 0;
  const thiefElapsedPercent = plot.thief
    ? Math.min(100, ((thiefTotalMs - thiefRemainingMs) / thiefTotalMs) * 100)
    : 0;
  const isStolenRecovered = stolenRecord?.resolved === true && stolenRecord.recoveredCount > 0;

  const stageSwayAnimation = stage === 'seed' || stage === 'sprout'
    ? 'plantSwaySm 4s ease-in-out infinite'
    : stage === 'leaf' || stage === 'flower'
      ? 'plantSwayMd 3.5s ease-in-out infinite'
      : stage === 'green'
        ? 'plantSwayMd 3.2s ease-in-out infinite'
        : 'plantSwayLg 3.8s ease-in-out infinite';
  const tileBackground = plot.state === 'empty'
    ? 'linear-gradient(145deg, #8b5a2b 0%, #6f4424 100%)'
    : plot.state === 'withered'
      ? `linear-gradient(145deg, ${theme.surface} 0%, ${theme.border} 100%)`
      : plot.state === 'stolen'
        ? 'linear-gradient(145deg, rgba(185,28,28,0.5) 0%, rgba(127,29,29,0.36) 100%)'
      : `linear-gradient(145deg, ${theme.surface} 0%, ${theme.inputBg} 100%)`;
  const tileBorderColor = plot.state === 'mature'
    ? '#fbbf24'
    : plot.state === 'stolen'
      ? '#ef4444'
    : plot.state === 'empty'
      ? '#7b4b2b'
      : theme.border;
  const tileShadow = plot.state === 'mature'
    ? '0 14px 26px rgba(251,191,36,0.26), 0 0 16px rgba(251,191,36,0.22)'
    : plot.state === 'stolen'
      ? '0 14px 26px rgba(239,68,68,0.28), 0 0 16px rgba(239,68,68,0.18)'
    : '0 10px 20px rgba(0,0,0,0.2), inset 0 -10px 16px rgba(0,0,0,0.14)';

  return (
    <div className={`group relative aspect-square sm:aspect-[3/4] w-full select-none${isTooltipOpen ? ' z-[100]' : ''}`}>
      <div className="relative h-full w-full transition-transform duration-200 group-hover:-translate-y-1">
        <div
          className="absolute inset-0 rounded-2xl border-2"
          style={{
            background: tileBackground,
            borderColor: tileBorderColor,
            boxShadow: tileShadow,
            opacity: plot.state === 'withered' ? 0.74 : plot.state === 'stolen' ? 0.96 : 1,
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
            className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center px-3 py-3 text-center cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onTooltipToggle();
            }}
          >
            <span
              className="text-[clamp(1.9rem,6vw,2.6rem)]"
              style={{
                filter: variety && revealed && variety.rarity !== 'common'
                  ? `drop-shadow(0 0 6px ${rarityColor})`
                  : 'none',
                animation: stageSwayAnimation,
                transformOrigin: 'bottom center',
              }}
            >
              {stageEmoji}
            </span>
            {revealed && variety ? (
              <span className="text-[11px] font-semibold leading-tight" style={{ color: theme.text }}>
                {varietyLabel}
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
            {plot.thief && (
              <div className="mt-1 w-[78%]">
                <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(239,68,68,0.25)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${thiefElapsedPercent}%`,
                      backgroundColor: '#ef4444',
                      boxShadow: '0 0 8px rgba(239,68,68,0.75)',
                    }}
                  />
                </div>
                <span className="farm-plot-thief-status mt-1 block text-[10px] font-medium leading-tight" style={{ color: '#fca5a5' }}>
                  {t.thiefStealing(Math.max(1, Math.ceil(thiefRemainingMs / 60000)))}
                </span>
              </div>
            )}
            {negativeStatusText && (
              <span className="mt-1 text-[10px] font-medium leading-tight" style={{ color: '#ef4444' }}>
                {negativeStatusText}
              </span>
            )}
            {isTooltipOpen && (
              <div
                className="absolute left-1/2 top-full z-50 mt-2 w-max max-w-[200px] -translate-x-1/2 rounded-[12px] px-4 py-3 text-[11px] leading-relaxed text-white"
                style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}
              >
                <span
                  className="absolute left-1/2 top-[-6px] -translate-x-1/2"
                  style={{
                    width: 0,
                    height: 0,
                    borderLeft: '6px solid transparent',
                    borderRight: '6px solid transparent',
                    borderBottom: '6px solid rgba(0,0,0,0.85)',
                  }}
                />
                {revealed && variety && (
                  <div className="font-semibold">{varietyLabel}</div>
                )}
                {plot.state === 'growing' && (
                  <>
                    <div>{`${Math.round(progressPercent)}%`}</div>
                    <div>{t.farmGrowthTime(plot.accumulatedMinutes, matureMinutes)}</div>
                    {plot.hasTracker && <div style={{ color: '#fbbf24' }}>📡 {t.itemStarTrackerActive}</div>}
                    {plot.progress < 0.5 && <div>{t.farmFocusBoostHint}</div>}
                  </>
                )}
                {plot.thief && (
                  <div className="mt-1" style={{ color: '#ef4444' }}>
                    {thiefRemainingMs > 0
                      ? t.thiefStealing(Math.max(1, Math.ceil(thiefRemainingMs / (1000 * 60))))
                      : t.thiefStolen}
                  </div>
                )}
                {negativeStatusText && <div>{negativeStatusText}</div>}

                <div className="flex flex-col gap-1.5 mt-2">
                  {canUseMutationGun && (
                    <>
                      <div>{`${t.mutationChanceLabel}: ${Math.round(mutationChance * 100)}%`}</div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onUseMutationGun();
                        }}
                        className="w-full rounded-lg px-2.5 py-1.5 text-[11px] font-medium cursor-pointer"
                        style={{ color: '#000', backgroundColor: '#fbbf24' }}
                      >
                        {`🔦 ${t.mutationGunUse} · ${mutationGunCount}`}
                      </button>
                    </>
                  )}
                  {canUseStarTracker && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onUseStarTracker(); }}
                      className="w-full rounded-lg px-2.5 py-1.5 text-[11px] font-medium cursor-pointer"
                      style={{ color: '#000', backgroundColor: '#fbbf24' }}
                    >
                      📡 {t.itemName('star-tracker')} · {starTrackerCount}
                    </button>
                  )}
                  {canUseTrapNet && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onUseTrapNet(); }}
                      className="w-full rounded-lg px-2.5 py-1.5 text-[11px] font-medium cursor-pointer"
                      style={{ color: '#000', backgroundColor: '#fbbf24' }}
                    >
                      🪤 {t.itemName('trap-net')} · {trapNetCount}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mature plot */}
        {plot.state === 'mature' && variety && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (shouldPreferMatureTooltip) {
                onTooltipToggle();
                return;
              }
              onHarvestClick();
            }}
            className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center px-3 py-3 text-center"
          >
            <span className="text-[clamp(2rem,6vw,2.7rem)]" style={{
              filter: `drop-shadow(0 0 8px ${rarityColor})`,
              animation: 'maturePulse 2s ease-in-out infinite',
            }}>
              {variety.emoji}
            </span>
            <span className="text-[11px] font-semibold leading-tight" style={{ color: theme.text }}>
              {varietyLabel}
            </span>
            {negativeStatusText && (
              <span className="mt-1 text-[10px] font-medium leading-tight" style={{ color: '#ef4444' }}>
                {negativeStatusText}
              </span>
            )}
            <span
              className="mt-1 rounded-full px-3 py-1 text-[10px] font-bold"
              style={{ backgroundColor: '#fbbf24', color: '#000' }}
            >
              ✋ {t.farmHarvest}
            </span>
          </button>
        )}

        {plot.state === 'mature' && (
          <div className="absolute left-2 top-2 z-30 flex flex-col gap-1">
            {canUseMoonDew && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onUseMoonDew();
                }}
                className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                style={{ backgroundColor: '#fbbf24', color: '#000' }}
              >
                {`🌙 ${moonDewCount}`}
              </button>
            )}
            {canUseStarTracker && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onUseStarTracker();
                }}
                className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                style={{ backgroundColor: '#60a5fa', color: '#001426' }}
              >
                {`📡 ${starTrackerCount}`}
              </button>
            )}
          </div>
        )}

        {plot.state === 'mature' && isTooltipOpen && (
          <div
            className="absolute left-1/2 top-full z-50 mt-2 w-max max-w-[220px] -translate-x-1/2 rounded-[12px] px-4 py-3 text-[11px] leading-relaxed text-white"
            style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <span
              className="absolute left-1/2 top-[-6px] -translate-x-1/2"
              style={{
                width: 0,
                height: 0,
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderBottom: '6px solid rgba(0,0,0,0.85)',
              }}
            />
            <div className="font-semibold">{varietyLabel}</div>
            <div>{t.farmStage('fruit')}</div>
            <div className="flex flex-col gap-1.5 mt-2">
              {canUseMoonDew && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onUseMoonDew();
                  }}
                  className="w-full rounded-lg px-2.5 py-1.5 text-[11px] font-medium cursor-pointer"
                  style={{ color: '#000', backgroundColor: '#fbbf24' }}
                >
                  🌙 {t.itemName('moon-dew')} · {moonDewCount}
                </button>
              )}
              {canUseStarTracker && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onUseStarTracker();
                  }}
                  className="w-full rounded-lg px-2.5 py-1.5 text-[11px] font-medium cursor-pointer"
                  style={{ color: '#000', backgroundColor: '#60a5fa' }}
                >
                  📡 {t.itemName('star-tracker')} · {starTrackerCount}
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onHarvestClick();
                }}
                className="w-full rounded-lg px-2.5 py-1.5 text-[11px] font-medium cursor-pointer"
                style={{ color: '#000', backgroundColor: '#fbbf24' }}
              >
                ✋ {t.farmHarvest}
              </button>
            </div>
          </div>
        )}

        {/* Withered plot */}
        {plot.state === 'withered' && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (shouldPreferWitheredTooltip) {
                onTooltipToggle();
                return;
              }
              onClearClick();
            }}
            className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center px-3 py-3 text-center"
          >
            <span className="text-[clamp(1.9rem,6vw,2.5rem)] grayscale">💀</span>
            <span className="text-[11px] font-medium" style={{ color: theme.textMuted }}>
              {negativeStatusText ?? t.farmWithered}
            </span>
            <span
              className="mt-1 rounded-full px-3 py-1 text-[10px] font-medium"
              style={{ color: theme.textMuted, backgroundColor: `${theme.border}66` }}
            >
              {t.farmClear}
            </span>
          </button>
        )}

        {plot.state === 'withered' && canUseNectar && (
          <div className="absolute left-2 top-2 z-30">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onUseNectar();
              }}
              className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
              style={{ backgroundColor: '#38bdf8', color: '#001426' }}
            >
              {`💧 ${nectarCount}`}
            </button>
          </div>
        )}

        {plot.state === 'withered' && isTooltipOpen && (
          <div
            className="absolute left-1/2 top-full z-50 mt-2 w-max max-w-[220px] -translate-x-1/2 rounded-[12px] px-4 py-3 text-[11px] leading-relaxed text-white"
            style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <span
              className="absolute left-1/2 top-[-6px] -translate-x-1/2"
              style={{
                width: 0,
                height: 0,
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderBottom: '6px solid rgba(0,0,0,0.85)',
              }}
            />
            <div>{negativeStatusText ?? t.farmWithered}</div>
            <div className="flex flex-col gap-1.5 mt-2">
              {canUseNectar && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onUseNectar();
                  }}
                  className="w-full rounded-lg px-2.5 py-1.5 text-[11px] font-medium cursor-pointer"
                  style={{ color: '#000', backgroundColor: '#38bdf8' }}
                >
                  💧 {t.itemName('nectar')} · {nectarCount}
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClearClick();
                }}
                className="w-full rounded-lg px-2.5 py-1.5 text-[11px] font-medium cursor-pointer"
                style={{ color: theme.textMuted, backgroundColor: `${theme.border}66` }}
              >
                {t.farmClear}
              </button>
            </div>
          </div>
        )}

        {/* Stolen plot */}
        {plot.state === 'stolen' && (
          <button
            onClick={onClearClick}
            className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center px-3 py-3 text-center"
          >
            <span className="text-[clamp(1.8rem,5.8vw,2.4rem)]">📜</span>
            <span className="mt-1 text-[11px] font-semibold leading-tight" style={{ color: '#fee2e2' }}>
              {t.thiefNote}
            </span>
            <span className="mt-1 text-[10px] leading-tight" style={{ color: '#fecaca' }}>
              {t.thiefRecoveryTask}
            </span>
            {isStolenRecovered && (
              <span
                className="mt-1 rounded-full px-2.5 py-1 text-[10px] font-semibold leading-tight"
                style={{
                  color: '#dcfce7',
                  backgroundColor: 'rgba(22,163,74,0.24)',
                  border: '1px solid rgba(110,231,183,0.5)',
                }}
              >
                {t.thiefRecovered}
              </span>
            )}
            <span
              className="mt-1 rounded-full px-3 py-1 text-[10px] font-medium"
              style={{ color: '#fecaca', backgroundColor: 'rgba(127,29,29,0.5)' }}
            >
              {t.farmClear}
            </span>
          </button>
        )}

        {/* Seed quality badge */}
        {plot.seedQuality && plot.state !== 'empty' && plot.state !== 'withered' && plot.state !== 'stolen' && (
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
        @keyframes plantSwaySm {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
        }
        @keyframes plantSwayMd {
          0%, 100% { transform: rotate(-4deg); }
          50% { transform: rotate(4deg); }
        }
        @keyframes plantSwayLg {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
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
function PlantModal({ seeds, injectedSeeds, hybridSeeds, prismaticSeeds, theme, t, onSelect, onSelectInjected, onSelectHybrid, onSelectPrismatic, onClose }: {
  seeds: SeedCounts;
  injectedSeeds: InjectedSeed[];
  hybridSeeds: import('../types/slicing').HybridSeed[];
  prismaticSeeds: PrismaticSeed[];
  theme: ReturnType<typeof useTheme>;
  t: ReturnType<typeof useI18n>;
  onSelect: (quality: SeedQuality) => void;
  onSelectInjected: (seedId: string) => void;
  onSelectHybrid: (seedId: string) => void;
  onSelectPrismatic: (seedId: string) => void;
  onClose: () => void;
}) {
  const options = [
    { quality: 'normal' as SeedQuality, emoji: '🌰', count: seeds.normal, color: '#a3a3a3' },
    { quality: 'epic' as SeedQuality, emoji: '💎', count: seeds.epic, color: '#a78bfa' },
    { quality: 'legendary' as SeedQuality, emoji: '🌟', count: seeds.legendary, color: '#fbbf24' },
  ];
  const qualityColor: Record<SeedQuality, string> = {
    normal: '#a3a3a3',
    epic: '#a78bfa',
    legendary: '#fbbf24',
  };
  const hybridSeedGroups = hybridSeeds.reduce<Array<{
    galaxyPair: import('../types/slicing').HybridSeed['galaxyPair'];
    seedId: string;
    count: number;
  }>>((groups, seed) => {
    const existing = groups.find((group) => group.galaxyPair === seed.galaxyPair);
    if (existing) {
      existing.count += 1;
      return groups;
    }
    groups.push({ galaxyPair: seed.galaxyPair, seedId: seed.id, count: 1 });
    return groups;
  }, []);
  const prismaticSeedGroups = prismaticSeeds.reduce<Array<{
    varietyId: VarietyId;
    seedId: string;
    count: number;
  }>>((groups, seed) => {
    const existing = groups.find((group) => group.varietyId === seed.varietyId);
    if (existing) {
      existing.count += 1;
      return groups;
    }
    groups.push({ varietyId: seed.varietyId, seedId: seed.id, count: 1 });
    return groups;
  }, []);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="rounded-2xl border p-5 mx-4 max-w-sm w-full" style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
        <h3 className="text-base font-semibold text-center mb-4" style={{ color: theme.text }}>{t.farmSelectSeed}</h3>
        <div className="flex flex-col gap-2">
          {options.map(opt => (
            <button
              key={opt.quality}
              disabled={opt.count <= 0}
              onClick={() => onSelect(opt.quality)}
              className="flex items-center justify-between p-3 rounded-xl border transition-all"
              style={{
                backgroundColor: opt.count > 0 ? opt.color + '08' : theme.inputBg,
                borderColor: opt.count > 0 ? opt.color + '30' : theme.border,
                opacity: opt.count > 0 ? 1 : 0.4,
                cursor: opt.count > 0 ? 'pointer' : 'not-allowed',
              }}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{opt.emoji}</span>
                <span className="text-sm font-medium" style={{ color: opt.count > 0 ? opt.color : theme.textMuted }}>{t.seedQualityLabel(opt.quality)}</span>
              </div>
              <span className="text-sm" style={{ color: theme.textMuted }}>×{opt.count}</span>
            </button>
          ))}
        </div>

        {injectedSeeds.length > 0 && (
          <div className="mt-3 pt-3 border-t" style={{ borderColor: theme.border }}>
            <p className="text-xs mb-2 text-center" style={{ color: theme.textFaint }}>
              {t.injectedSeedHint}
            </p>
            <div className="flex flex-col gap-2 max-h-44 overflow-y-auto">
              {injectedSeeds.map((seed) => {
                const badgeColor = qualityColor[seed.quality];
                return (
                  <button
                    key={seed.id}
                    onClick={() => onSelectInjected(seed.id)}
                    className="flex items-center justify-between p-3 rounded-xl border transition-colors text-left"
                    style={{
                      backgroundColor: `${badgeColor}10`,
                      borderColor: `${badgeColor}45`,
                    }}
                  >
                    <span className="text-sm font-medium truncate pr-3" style={{ color: theme.text }}>
                      {t.injectedSeedLabel(t.galaxyName(seed.targetGalaxyId))}
                    </span>
                    <span
                      className="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold"
                      style={{ color: badgeColor, backgroundColor: `${badgeColor}22` }}
                    >
                      {t.seedQualityLabel(seed.quality)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {hybridSeedGroups.length > 0 && (
          <div className="mt-3 pt-3 border-t" style={{ borderColor: theme.border }}>
            <p className="text-xs mb-2 text-center" style={{ color: theme.textFaint }}>
              {t.hybridSeedHint}
            </p>
            <div className="flex flex-col gap-2 max-h-44 overflow-y-auto">
              {hybridSeedGroups.map((seed) => (
                <button
                  key={seed.galaxyPair}
                  onClick={() => onSelectHybrid(seed.seedId)}
                  className="flex items-center justify-between p-3 rounded-xl border transition-colors text-left"
                  style={{
                    backgroundColor: `${theme.accent}10`,
                    borderColor: `${theme.accent}35`,
                  }}
                >
                  <span className="text-sm font-medium truncate pr-3" style={{ color: theme.text }}>
                    {t.hybridGalaxyPairLabel(seed.galaxyPair)}
                  </span>
                  <span className="text-sm shrink-0" style={{ color: theme.textMuted }}>
                    ×{seed.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {prismaticSeedGroups.length > 0 && (
          <div className="mt-3 pt-3 border-t" style={{ borderColor: theme.border }}>
            <p className="text-xs mb-2 text-center" style={{ color: theme.textFaint }}>
              {t.prismaticSeedHint}
            </p>
            <div className="flex flex-col gap-2 max-h-44 overflow-y-auto">
              {prismaticSeedGroups.map((seed) => (
                <button
                  key={seed.varietyId}
                  onClick={() => onSelectPrismatic(seed.seedId)}
                  className="flex items-center justify-between p-3 rounded-xl border transition-colors text-left"
                  style={{
                    backgroundColor: '#a78bfa12',
                    borderColor: '#a78bfa45',
                  }}
                >
                  <span className="text-sm font-medium truncate pr-3" style={{ color: theme.text }}>
                    {t.prismaticSeedLabel(t.varietyName(seed.varietyId))}
                  </span>
                  <span className="text-sm shrink-0" style={{ color: theme.textMuted }}>
                    ×{seed.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        <p className="text-xs text-center mt-3" style={{ color: theme.textFaint }}>{t.farmSeedHint}</p>
        <button onClick={onClose} className="w-full mt-3 py-2.5 rounded-xl text-sm" style={{ color: theme.textMuted, backgroundColor: theme.border + '30' }}>
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

function FarmHelpModal({ theme, t, onClose }: {
  theme: ReturnType<typeof useTheme>;
  t: ReturnType<typeof useI18n>;
  onClose: () => void;
}) {
  const rules = [t.farmHelpPlant, t.farmHelpGrow, t.farmHelpHarvest, t.farmHelpWither, t.farmHelpUnlock];
  return (
    <div className='fixed inset-0 z-[60] flex items-center justify-center' style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className='rounded-2xl border p-5 mx-4 max-w-sm w-full' style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
        <h3 className='text-base font-semibold text-center mb-4' style={{ color: theme.text }}>{t.farmHelpTitle}</h3>
        <div className='flex flex-col gap-3'>
          {rules.map((rule, i) => (
            <p key={i} className='text-sm leading-relaxed' style={{ color: theme.textMuted }}>{rule}</p>
          ))}
        </div>
        <button onClick={onClose} className='w-full mt-4 py-2.5 rounded-xl text-sm' style={{ color: theme.textMuted, backgroundColor: theme.border + '30' }}>
          {t.cancel}
        </button>
      </div>
    </div>
  );
}
