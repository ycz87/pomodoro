/**
 * App — Watermelon Clock main application component
 *
 * Orchestrates the entire app: timer state, records, settings, audio, i18n,
 * and routes between Pomodoro mode and Project mode.
 *
 * Architecture:
 * - useTimer: drives the simple pomodoro countdown (work → break cycle)
 * - useProjectTimer: drives the multi-task project mode with its own state machine
 * - Both modes share the same Timer component for rendering
 * - Records (PomodoroRecord[]) are unified — project task completions also
 *   create pomodoro records for consistent daily stats
 * - Settings, records, and project state are persisted to localStorage
 *
 * Key design decisions:
 * - `key={settings.language}` on the root div forces full re-render on language
 *   switch, avoiding stale closure issues with i18n (v0.4.6 fix)
 * - Background audio lifecycle is tied to timer running state via useEffect
 * - Mode switch is disabled while any timer is active
 */
import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { Timer } from './components/Timer';
import { TaskInput } from './components/TaskInput';
import { TodayStats } from './components/TodayStats';
import { TaskList } from './components/TaskList';
import { Settings } from './components/Settings';
import { GuideButton } from './components/Guide';
import { InstallPrompt } from './components/InstallPrompt';
import { HistoryPanel } from './components/HistoryPanel';
import { ModeSwitch } from './components/ModeSwitch';
import { ProjectMode } from './components/ProjectMode';
import { ProjectTaskBar } from './components/ProjectTaskBar';
import { ProjectRecoveryModal } from './components/ProjectRecoveryModal';
import { ConfirmModal } from './components/ConfirmModal';
import { ProjectExitModal } from './components/ProjectExitModal';
import { EncouragementBanner } from './components/EncouragementBanner';
import { WarehousePage } from './components/WarehousePage';
import { AchievementsPage } from './components/AchievementsPage';
import { AchievementCelebration } from './components/AchievementCelebration';
import { SlicingScene } from './components/SlicingScene';
import { updatePity as updatePityCalc } from './slicing/engine';
import { FarmPage } from './components/FarmPage';
import { MarketPage } from './components/MarketPage';
import { DebugToolbar } from './components/DebugToolbar';
import { Toast } from './components/Toast';
import { useTimer } from './hooks/useTimer';
import type { TimerPhase } from './hooks/useTimer';
import { useProjectTimer } from './hooks/useProjectTimer';
import { useWarehouse } from './hooks/useWarehouse';
import { useShedStorage } from './hooks/useShedStorage';
import { useAchievements } from './hooks/useAchievements';
import { useFarmStorage } from './hooks/useFarmStorage';
import { useGeneStorage } from './hooks/useGeneStorage';
import { useMelonCoin } from './hooks/useMelonCoin';
import { useAuth } from './hooks/useAuth';
import { useSync } from './hooks/useSync';
import { ThemeProvider } from './hooks/useTheme';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useDragScroll } from './hooks/useDragScroll';
import {
  requestNotificationPermission, sendBrowserNotification,
  playAlertRepeated, stopAlert,
  setMasterAlertVolume, setMasterAmbienceVolume,
  applyMixerConfig, stopAllAmbience,
} from './audio';
import { getTodayKey } from './utils/time';
import { getStreak, getDayMinutes } from './utils/stats';
import {
  applyGrowthWithMutation as applyGrowthWithMutationEngine,
  calculateOfflineGrowth,
  calculateFocusBoost,
  getWitherStatus,
  type MutationOutcome,
  witherPlots,
} from './farm/growth';
import { getUnlockedGalaxies } from './farm/galaxy';
import { rollInjectedVariety, createInjectedSeedId, attemptFusion, rollHybridVariety } from './farm/gene';
import { I18nProvider, getMessages } from './i18n';
import type { PomodoroRecord, PomodoroSettings } from './types';
import { DEFAULT_SETTINGS, migrateSettings, THEMES, getGrowthStage, GROWTH_EMOJI, rollLegendary } from './types';
import type { GrowthStage } from './types';
import type { AppMode } from './types/project';
import type { ProjectRecord } from './types/project';
import { DEFAULT_FARM_STORAGE, VARIETY_DEFS } from './types/farm';
import type { CollectedVariety, Plot, VarietyId } from './types/farm';
import { SHOP_ITEMS, PLOT_PRICES } from './types/market';
import type { ShopItemId } from './types/market';

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

function App() {
  const [currentTask, setCurrentTask] = useState('');
  const [records, setRecords] = useLocalStorage<PomodoroRecord[]>('pomodoro-records', []);
  const [projectRecords, setProjectRecords] = useLocalStorage<ProjectRecord[]>('pomodoro-project-records', []);
  const [settings, setSettings] = useLocalStorage<PomodoroSettings>('pomodoro-settings', DEFAULT_SETTINGS, migrateSettings);

  // i18n - Move up to avoid use-before-declaration
  const t = useMemo(() => getMessages(settings.language), [settings.language]);

  const theme = THEMES[settings.theme]?.colors ?? THEMES.dark.colors;

  const [showHistory, setShowHistory] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [achievementCelebrationIds, setAchievementCelebrationIds] = useState<string[]>([]);
  const [mode, setMode] = useState<AppMode>('pomodoro');
  const [showGuide, setShowGuide] = useState(false);
  const [lastRolledStage, setLastRolledStage] = useState<GrowthStage | null>(null);

  const [activeTab, setActiveTab] = useState<'focus' | 'warehouse' | 'farm' | 'market'>('focus');
  const [debugMode, setDebugMode] = useState(() => localStorage.getItem('watermelon-debug') === 'true');
  const [timeMultiplier, setTimeMultiplier] = useState(1);
  const [mutationToastQueue, setMutationToastQueue] = useState<MutationOutcome[]>([]);
  const [recoveryToastQueue, setRecoveryToastQueue] = useState<string[]>([]);
  const suppressCelebrationRef = useRef(false);
  const timeMultiplierRef = useRef(timeMultiplier);

  // PC drag-to-scroll (mouse drag = touch scroll)
  useDragScroll();

  // Auth
  const auth = useAuth();

  // Cloud sync (fire-and-forget, local-first)
  const { syncSettings, syncRecord, syncWarehouse, syncAchievements, pullAll, migrateLocalData } = useSync(auth.isAuthenticated);

  // Warehouse (with cloud sync callback)
  const { warehouse, setWarehouse, addItem, addItems, updatePity, consumeMelon, synthesize, synthesizeAll, getHighestStage, resetWarehouse } = useWarehouse(syncWarehouse);

  // Shed storage (seeds + items from slicing)
  const {
    shed,
    addSeeds,
    addItem: addShedItem,
    incrementSliced,
    updatePityCounter,
    consumeSeed,
    consumeItem,
    consumeShopItem,
    addInjectedSeed,
    consumeInjectedSeed,
    addHybridSeed,
    consumeHybridSeed,
  } = useShedStorage();

  // Farm storage
  const {
    farm,
    setFarm,
    plantSeed,
    plantSeedWithVariety,
    harvestPlot,
    sellVariety,
    clearPlot,
    updatePlots,
    updatePlotMutationChance,
    buyPlot,
    updateActiveDate,
    activateGuardianBarrier,
    addPlotTracker,
    addStolenRecord,
    markStolenRecordRecovered,
    revivePlot,
    upgradePlotRarity,
  } = useFarmStorage();
  const { geneInventory, addFragment, removeFragment, removeFragmentsByGalaxy } = useGeneStorage();
  const { balance, addCoins, spendCoins } = useMelonCoin();
  const farmPlotsRef = useRef(farm.plots);
  const previousFarmPlotsRef = useRef<Plot[] | null>(null);
  const updatePlotsRef = useRef(updatePlots);
  const sellingRef = useRef(false);
  const mutationGunMutexRef = useRef(false);

  // Slicing scene state
  const [slicingMelon, setSlicingMelon] = useState<'ripe' | 'legendary' | null>(null);
  const [comboCount, setComboCount] = useState(0);

  useEffect(() => {
    timeMultiplierRef.current = timeMultiplier;
  }, [timeMultiplier]);

  useEffect(() => {
    farmPlotsRef.current = farm.plots;
  }, [farm.plots]);

  useEffect(() => {
    updatePlotsRef.current = updatePlots;
  }, [updatePlots]);

  // Achievements (with cloud sync callback)
  const achievements = useAchievements(records, projectRecords.length, syncAchievements);

  // ─── Farm daily update ───
  const todayKey = getTodayKey();
  const todayFocusMinutes = useMemo(() => getDayMinutes(records, todayKey), [records, todayKey]);
  const farmUpdatedRef = useRef(false);
  const activeMutationToast = mutationToastQueue[0] ?? null;
  const activeRecoveryToast = recoveryToastQueue[0] ?? null;

  const enqueueMutationToasts = useCallback((toasts: MutationOutcome[]) => {
    if (toasts.length === 0) return;
    setMutationToastQueue((prev) => [...prev, ...toasts]);
  }, []);

  const dismissMutationToast = useCallback(() => {
    setMutationToastQueue((prev) => prev.slice(1));
  }, []);

  const enqueueRecoveryToast = useCallback((message: string) => {
    if (!message) return;
    setRecoveryToastQueue((prev) => [...prev, message]);
  }, []);

  const dismissRecoveryToast = useCallback(() => {
    setRecoveryToastQueue((prev) => prev.slice(1));
  }, []);

  useEffect(() => {
    const previousPlots = previousFarmPlotsRef.current;
    if (!previousPlots) {
      previousFarmPlotsRef.current = farm.plots;
      return;
    }

    for (const plot of farm.plots) {
      const previousPlot = previousPlots.find((item) => item.id === plot.id);
      if (!previousPlot) continue;

      const thiefJustAppeared = !previousPlot.thief && Boolean(plot.thief);
      if (thiefJustAppeared) {
        enqueueRecoveryToast(t.thiefAppeared);
        continue;
      }

      const trackerRecovered = Boolean(previousPlot.thief)
        && !plot.thief
        && previousPlot.hasTracker
        && plot.hasTracker === false
        && plot.state !== 'stolen';
      if (trackerRecovered) {
        enqueueRecoveryToast(t.thiefRecoveryActive);
      }
    }

    previousFarmPlotsRef.current = farm.plots;
  }, [farm.plots, enqueueRecoveryToast, t]);

  const runFarmGrowth = useCallback((
    plots: Plot[],
    growthMinutes: number,
    nowTimestamp: number,
    enableThiefRoll: boolean = true,
  ) => applyGrowthWithMutationEngine(plots, growthMinutes, {
    nowTimestamp,
    todayKey,
    focusMinutesToday: todayFocusMinutes,
    guardianBarrierDate: farm.guardianBarrierDate,
    enableThiefRoll,
  }), [todayKey, todayFocusMinutes, farm.guardianBarrierDate]);

  useEffect(() => {
    const nowTimestamp = Date.now();
    if (farmUpdatedRef.current) return;
    if (!farm.lastActiveDate || farm.lastActiveDate === todayKey) {
      // First visit or same day — still settle overdue thief countdown once.
      const { plots: settledPlots, stolenRecords } = runFarmGrowth(
        farm.plots,
        0,
        nowTimestamp,
        false,
      );
      const changed = settledPlots.length !== farm.plots.length
        || settledPlots.some((plot, index) => plot !== farm.plots[index]);
      if (changed) {
        updatePlots(settledPlots);
      }
      stolenRecords.forEach(addStolenRecord);
      updateActiveDate(
        todayKey,
        farm.lastActiveDate === todayKey ? farm.consecutiveInactiveDays : 0,
        nowTimestamp,
      );
      farmUpdatedRef.current = true;
      return;
    }

    const parsedLastActiveTs = new Date(`${farm.lastActiveDate}T00:00:00`).getTime();
    const effectiveLastActivityTs = farm.lastActivityTimestamp > 0
      ? farm.lastActivityTimestamp
      : (Number.isFinite(parsedLastActiveTs) ? parsedLastActiveTs : 0);
    const witherStatus = getWitherStatus(effectiveLastActivityTs, nowTimestamp);

    if (witherStatus.shouldWither) {
      // Wither all growing/mature plots
      updatePlots(witherPlots(farm.plots, nowTimestamp, effectiveLastActivityTs));
      updateActiveDate(todayKey, witherStatus.inactiveDays, nowTimestamp);
    } else {
      // Apply minute-based growth: offline growth + focus boost
      const offlineGrowthMinutes = calculateOfflineGrowth(witherStatus.inactiveMinutes);
      const focusBoostMinutes = calculateFocusBoost(todayFocusMinutes);
      const totalGrowthMinutes = (offlineGrowthMinutes + focusBoostMinutes) * timeMultiplierRef.current;
      const { plots: newPlots, mutationToasts, stolenRecords } = runFarmGrowth(farm.plots, totalGrowthMinutes, nowTimestamp);
      updatePlots(newPlots);
      enqueueMutationToasts(mutationToasts);
      stolenRecords.forEach(addStolenRecord);
      updateActiveDate(todayKey, witherStatus.inactiveDays, nowTimestamp);
    }
    farmUpdatedRef.current = true;
  }, [todayKey]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (timeMultiplier <= 1) return;

    const TICK_INTERVAL_MS = 5000; // 每 5 秒 tick 一次
    const intervalId = window.setInterval(() => {
      const minutesPerTick = (TICK_INTERVAL_MS / 60000) * timeMultiplier;
      const nowTimestamp = Date.now();
      const { plots: newPlots, mutationToasts, stolenRecords } = runFarmGrowth(
        farmPlotsRef.current,
        minutesPerTick,
        nowTimestamp,
      );
      updatePlotsRef.current(newPlots);
      enqueueMutationToasts(mutationToasts);
      stolenRecords.forEach(addStolenRecord);
    }, TICK_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [timeMultiplier, runFarmGrowth, enqueueMutationToasts, addStolenRecord]);

  // 常规节拍：仅处理大盗倒计时（不触发新判定）
  useEffect(() => {
    const intervalId = window.setInterval(() => {
      const nowTimestamp = Date.now();
      const { plots: newPlots, stolenRecords } = runFarmGrowth(
        farmPlotsRef.current,
        0,
        nowTimestamp,
        false,
      );
      const currentPlots = farmPlotsRef.current;
      const changed = newPlots.length !== currentPlots.length
        || newPlots.some((plot, index) => plot !== currentPlots[index]);
      if (changed) {
        updatePlotsRef.current(newPlots);
      }
      stolenRecords.forEach(addStolenRecord);
    }, 60_000);

    return () => window.clearInterval(intervalId);
  }, [runFarmGrowth, addStolenRecord]);

  // Wrapped synthesize with achievement detection
  const handleSynthesize = useCallback((recipe: import('./types').SynthesisRecipe, count: number = 1): boolean => {
    const result = synthesize(recipe, count);
    if (result) {
      const actual = Math.min(count, Math.floor(warehouse.items[recipe.from] / recipe.cost));
      const newAchievements = achievements.checkWarehouse(warehouse, 'synthesize', { synthesisCount: actual > 0 ? actual : 1 });
      if (newAchievements.length > 0) {
        setTimeout(() => setAchievementCelebrationIds(prev => [...prev, ...newAchievements]), 500);
      }
    }
    return result;
  }, [synthesize, warehouse, achievements]);

  const handleSynthesizeAll = useCallback((recipe: import('./types').SynthesisRecipe): number => {
    const count = synthesizeAll(recipe);
    if (count > 0) {
      const newAchievements = achievements.checkWarehouse(warehouse, 'synthesize', { synthesisCount: count });
      if (newAchievements.length > 0) {
        setTimeout(() => setAchievementCelebrationIds(prev => [...prev, ...newAchievements]), 500);
      }
    }
    return count;
  }, [synthesizeAll, warehouse, achievements]);

  // Slicing handlers
  const handleStartSlice = useCallback((type: 'ripe' | 'legendary') => {
    if (consumeMelon(type)) {
      setComboCount(prev => prev + 1);
      setSlicingMelon(type);
    }
  }, [consumeMelon]);

  const handleSliceComplete = useCallback((result: import('./types/slicing').SlicingResult) => {
    addSeeds(result.seeds, result.seedQuality);
    result.items.forEach(itemId => addShedItem(itemId));
    incrementSliced();
    updatePityCounter(updatePityCalc(shed.pity, result.seedQuality));
    setSlicingMelon(null);
  }, [addSeeds, addShedItem, incrementSliced, updatePityCounter, shed.pity]);

  const handleSliceContinue = useCallback(() => {
    // 继续切下一个：找到可切的瓜
    const type: 'ripe' | 'legendary' = warehouse.items.legendary > 0 ? 'legendary' : 'ripe';
    if (warehouse.items[type] > 0) {
      handleStartSlice(type);
    }
  }, [warehouse.items, handleStartSlice]);

  const handleSliceCancel = useCallback(() => {
    if (slicingMelon) {
      addItem(slicingMelon === 'legendary' ? 'legendary' : 'ripe');
    }
    setSlicingMelon(null);
    setComboCount(0); // 取消重置 combo
  }, [slicingMelon, addItem]);

  // 检查是否还有瓜可以继续切
  const canContinueSlicing = warehouse.items.ripe > 0 || warehouse.items.legendary > 0;

  // ─── Farm handlers ───
  const handleFarmPlant = useCallback((
    plotId: number,
    quality: import('./types/slicing').SeedQuality,
  ) => {
    const unlockedGalaxies = getUnlockedGalaxies(farm.collection);
    const varietyId = plantSeed(plotId, unlockedGalaxies, quality, todayKey);
    if (varietyId) {
      consumeSeed(quality);
    }
    return varietyId;
  }, [consumeSeed, farm.collection, plantSeed, todayKey]);

  const handleFarmHarvest = useCallback((plotId: number) => {
    const result = harvestPlot(plotId, todayKey);
    if (result.varietyId) {
      const variety = VARIETY_DEFS[result.varietyId];
      addFragment(variety.galaxy, result.varietyId, variety.rarity);
      if (result.isNew) {
        addCoins(variety.sellPrice);
      }
    }
    return result;
  }, [addCoins, addFragment, harvestPlot, todayKey]);

  const handleSellVariety = useCallback((varietyId: VarietyId, isMutant: boolean = false) => {
    const basePrice = VARIETY_DEFS[varietyId]?.sellPrice ?? 0;
    const price = basePrice * (isMutant ? 3 : 1);
    if (price <= 0) return;

    if (sellingRef.current) return;
    sellingRef.current = true;
    try {
      const sold = sellVariety(varietyId, isMutant);
      if (sold) {
        addCoins(price);
      }
    } finally {
      sellingRef.current = false;
    }
  }, [sellVariety, addCoins]);

  const handleBuyItem = useCallback((itemId: ShopItemId) => {
    const itemDef = SHOP_ITEMS.find((item) => item.id === itemId);
    if (!itemDef) return;
    const spent = spendCoins(itemDef.price);
    if (!spent) return;
    addShedItem(itemId, 1);
  }, [addShedItem, spendCoins]);

  const handleBuyPlot = useCallback((plotIndex: number) => {
    const price = PLOT_PRICES[plotIndex];
    if (!price) return;
    if (farm.plots.length > plotIndex) return;
    const spent = spendCoins(price);
    if (!spent) return;
    const bought = buyPlot(plotIndex);
    if (!bought) {
      addCoins(price);
    }
  }, [farm.plots.length, spendCoins, buyPlot, addCoins]);

  const handleUseMutationGun = useCallback((plotId: number) => {
    if (mutationGunMutexRef.current) return;

    // Check shed items from current render snapshot
    const gunCount = (shed.items as Record<string, number>)['mutation-gun'] ?? 0;
    if (gunCount <= 0) return;

    mutationGunMutexRef.current = true;
    try {
      const consumed = consumeShopItem('mutation-gun');
      if (!consumed) return;

      const increased = updatePlotMutationChance(plotId, 0.20);
      if (!increased) {
        addShedItem('mutation-gun', 1);
      }
    } finally {
      setTimeout(() => {
        mutationGunMutexRef.current = false;
      }, 0);
    }
  }, [shed.items, updatePlotMutationChance, consumeShopItem, addShedItem]);

  const handleUseMoonDew = useCallback((plotId: number) => {
    const plot = farm.plots.find((item) => item.id === plotId);
    if (!plot || plot.state !== 'mature' || !plot.varietyId) return;

    const rarity = VARIETY_DEFS[plot.varietyId]?.rarity;
    if (rarity === 'legendary') {
      enqueueRecoveryToast(t.itemMoonDewFail);
      return;
    }

    const consumed = consumeShopItem('moon-dew');
    if (!consumed) return;

    const upgraded = upgradePlotRarity(plotId);
    if (!upgraded) {
      addShedItem('moon-dew', 1);
      return;
    }
    enqueueRecoveryToast(t.itemMoonDewSuccess);
  }, [farm.plots, consumeShopItem, upgradePlotRarity, addShedItem, enqueueRecoveryToast, t]);

  const handleUseNectar = useCallback((plotId: number) => {
    const consumed = consumeShopItem('nectar');
    if (!consumed) return;
    const revived = revivePlot(plotId);
    if (!revived) {
      addShedItem('nectar', 1);
      return;
    }
    enqueueRecoveryToast(t.itemNectarSuccess);
  }, [consumeShopItem, revivePlot, addShedItem, enqueueRecoveryToast, t]);

  const handleUseStarTracker = useCallback((plotId: number) => {
    const consumed = consumeShopItem('star-tracker');
    if (!consumed) return;
    const tracked = addPlotTracker(plotId);
    if (!tracked) {
      addShedItem('star-tracker', 1);
    }
  }, [consumeShopItem, addPlotTracker, addShedItem]);

  const handleUseGuardianBarrier = useCallback(() => {
    if (farm.guardianBarrierDate === todayKey) return;
    const consumed = consumeShopItem('guardian-barrier');
    if (!consumed) return;
    const activated = activateGuardianBarrier(todayKey);
    if (!activated) {
      addShedItem('guardian-barrier', 1);
      return;
    }
    enqueueRecoveryToast(t.itemGuardianBarrierActive);
  }, [farm.guardianBarrierDate, todayKey, consumeShopItem, activateGuardianBarrier, addShedItem, enqueueRecoveryToast, t]);

  const handleUseTrapNet = useCallback((plotId: number) => {
    const consumed = consumeShopItem('trap-net');
    if (!consumed) return;

    let success = false;
    setFarm((prev) => {
      const targetPlot = prev.plots.find((plot) => plot.id === plotId);
      if (!targetPlot?.thief) return prev;
      success = true;
      return {
        ...prev,
        plots: prev.plots.map((plot) => (
          plot.id === plotId
            ? { ...plot, thief: undefined }
            : plot
        )),
      };
    });

    if (!success) {
      addShedItem('trap-net', 1);
      return;
    }
    addCoins(100);
    enqueueRecoveryToast(t.thiefCaught);
  }, [consumeShopItem, setFarm, addShedItem, addCoins, enqueueRecoveryToast, t]);

  // ─── Gene injection handler ───
  const handleGeneInject = useCallback((galaxyId: import('./types/farm').GalaxyId, quality: import('./types/slicing').SeedQuality) => {
    removeFragmentsByGalaxy(galaxyId, 1);
    consumeSeed(quality);
    addInjectedSeed({
      id: createInjectedSeedId(),
      quality,
      targetGalaxyId: galaxyId,
    });
  }, [removeFragmentsByGalaxy, consumeSeed, addInjectedSeed]);

  // ─── Gene fusion handler ───
  const handleGeneFusion = useCallback((fragment1Id: string, fragment2Id: string, useModifier: boolean) => {
    if (fragment1Id === fragment2Id) return null;

    const fragment1 = geneInventory.fragments.find((fragment) => fragment.id === fragment1Id);
    const fragment2 = geneInventory.fragments.find((fragment) => fragment.id === fragment2Id);
    if (!fragment1 || !fragment2) return null;

    const isSupportedGalaxy = (galaxyId: string): boolean => (
      galaxyId === 'thick-earth'
      || galaxyId === 'fire'
      || galaxyId === 'water'
      || galaxyId === 'wood'
      || galaxyId === 'metal'
    );
    if (!isSupportedGalaxy(fragment1.galaxyId) || !isSupportedGalaxy(fragment2.galaxyId)) {
      return null;
    }

    let fusionResult = attemptFusion(fragment1, fragment2, useModifier ? 0.20 : 0);
    if (!fusionResult) return null;

    if (useModifier) {
      const consumedModifier = consumeItem('gene-modifier');
      if (!consumedModifier) {
        fusionResult = attemptFusion(fragment1, fragment2, 0);
        if (!fusionResult) return null;
      }
    }

    removeFragment(fragment1Id);
    removeFragment(fragment2Id);

    if (fusionResult.success) {
      addHybridSeed({
        id: createInjectedSeedId(),
        galaxyPair: fusionResult.galaxyPair,
      });
    }

    return {
      success: fusionResult.success,
      galaxyPair: fusionResult.galaxyPair,
    };
  }, [geneInventory.fragments, consumeItem, removeFragment, addHybridSeed]);

  // ─── Plant injected seed handler ───
  const handleFarmPlantInjected = useCallback((plotId: number, seedId: string) => {
    const seed = shed.injectedSeeds.find(s => s.id === seedId);
    if (!seed) return;
    const unlockedGalaxies = getUnlockedGalaxies(farm.collection);
    const varietyId = rollInjectedVariety(seed.targetGalaxyId, unlockedGalaxies, seed.quality);
    const success = plantSeedWithVariety(plotId, varietyId, seed.quality, todayKey);
    if (success) {
      consumeInjectedSeed(seedId);
    }
  }, [shed.injectedSeeds, farm.collection, plantSeedWithVariety, consumeInjectedSeed, todayKey]);

  // ─── Plant hybrid seed handler ───
  const handleFarmPlantHybrid = useCallback((plotId: number, seedId: string) => {
    const seed = shed.hybridSeeds.find((hybridSeed) => hybridSeed.id === seedId);
    if (!seed) return;

    const varietyId = rollHybridVariety(seed.galaxyPair);
    const success = plantSeedWithVariety(plotId, varietyId, 'normal', todayKey);
    if (success) {
      consumeHybridSeed(seedId);
    }
  }, [shed.hybridSeeds, plantSeedWithVariety, consumeHybridSeed, todayKey]);

  // ─── Debug mode ───
  const activateDebugMode = useCallback(() => {
    localStorage.setItem('watermelon-debug', 'true');
    setDebugMode(true);
  }, []);

  const deactivateDebugMode = useCallback(() => {
    localStorage.removeItem('watermelon-debug');
    setDebugMode(false);
    setTimeMultiplier(1);
  }, []);

  const setFarmPlots = useCallback((plots: Plot[]) => {
    updatePlots(plots);
  }, [updatePlots]);

  const setFarmCollection = useCallback((collection: CollectedVariety[]) => {
    setFarm((prev) => ({ ...prev, collection }));
  }, [setFarm]);

  const resetFarm = useCallback(() => {
    setFarm({
      ...DEFAULT_FARM_STORAGE,
      plots: DEFAULT_FARM_STORAGE.plots.map((plot) => ({ ...plot })),
      collection: [...DEFAULT_FARM_STORAGE.collection],
    });
  }, [setFarm]);

  // Modal states
  const [showAbandonConfirm, setShowAbandonConfirm] = useState(false);
  const [showProjectExit, setShowProjectExit] = useState(false);

  const activeMutationToastMessage = activeMutationToast
    ? (t.mutationPositiveToast
      ? t.mutationPositiveToast(t.varietyName(activeMutationToast.varietyId))
      : `${t.mutationRevealed} · ${t.mutationPositive}`)
    : null;

  // 连续打卡
  const streak = useMemo(() => getStreak(records), [records]);

  // Default task name: "专注 #N" where N = today's count + 1
  const getDefaultTaskName = useCallback(() => {
    const todayCount = records.filter((r) => r.date === getTodayKey()).length;
    return t.defaultTaskName(todayCount + 1);
  }, [records, t]);

  // Resolve task name: user input or default
  const resolveTaskName = useCallback(() => {
    return currentTask.trim() || getDefaultTaskName();
  }, [currentTask, getDefaultTaskName]);

  // 初始化音量
  useEffect(() => {
    requestNotificationPermission();
    setMasterAlertVolume(settings.alertVolume);
    setMasterAmbienceVolume(settings.ambienceVolume);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Cloud sync: pull data on login ───
  const hasSyncedRef = useRef(false);
  useEffect(() => {
    if (!auth.isAuthenticated || auth.isLoading || hasSyncedRef.current) return;
    hasSyncedRef.current = true;
    pullAll().then((result) => {
      if (result.hasData) {
        // Cloud has data — overwrite local
        if (result.settings) setSettings(result.settings);
        if (result.records.length > 0) setRecords(result.records);
        if (result.warehouse) setWarehouse(result.warehouse);
        if (result.achievements) achievements.mergeFromCloud(result.achievements);
      } else {
        // Cloud empty — migrate local data up
        migrateLocalData(settings, records, warehouse, achievements.data);
      }
    });
  }, [auth.isAuthenticated, auth.isLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Cloud sync: push settings on change (skip initial) ───
  const settingsMountedRef = useRef(false);
  useEffect(() => {
    if (!settingsMountedRef.current) {
      settingsMountedRef.current = true;
      return;
    }
    syncSettings(settings);
  }, [settings, syncSettings]);

  // ─── Stop looping alert on any user interaction ───
  // When alertRepeatCount is 0 (continuous loop), clicking or pressing any key stops the alert.
  useEffect(() => {
    const handler = () => stopAlert();
    document.addEventListener('click', handler, { capture: true });
    document.addEventListener('keydown', handler, { capture: true });
    return () => {
      document.removeEventListener('click', handler, { capture: true });
      document.removeEventListener('keydown', handler, { capture: true });
    };
  }, []);

  /** Determine final growth stage including legendary roll, store to warehouse */
  const resolveStageAndStore = useCallback((minutes: number): GrowthStage => {
    if (minutes < 5) {
      // <5min: no item stored, return seed for display only
      setLastRolledStage('seed');
      return 'seed';
    }
    let stage = getGrowthStage(minutes);
    // 金西瓜只在 61-90 分钟触发，>90 分钟直接给 ripe
    if (minutes >= 61 && minutes <= 90) {
      const gotLegendary = rollLegendary(warehouse.legendaryPity);
      updatePity(gotLegendary);
      if (gotLegendary) stage = 'legendary';
    }
    addItem(stage);
    setLastRolledStage(stage);
    // Check warehouse achievements after adding item
    // Use warehouse with updated totalCollected (addItem increments it)
    const updatedWarehouse = {
      ...warehouse,
      items: { ...warehouse.items, [stage]: warehouse.items[stage] + 1 },
      totalCollected: warehouse.totalCollected + 1,
    };
    const newAchievements = achievements.checkWarehouse(updatedWarehouse, 'addItem', { addedStage: stage });
    if (newAchievements.length > 0) {
      setTimeout(() => setAchievementCelebrationIds(prev => [...prev, ...newAchievements]), 3500);
    }
    return stage;
  }, [warehouse, updatePity, addItem, achievements]);

  const recoverStolenHarvest = useCallback((focusMinutesAfterCompletion: number) => {
    if (focusMinutesAfterCompletion < 25) return;

    const nowTimestamp = Date.now();
    const recoverableRecords = farm.stolenRecords.filter((record) => (
      !record.resolved && nowTimestamp - record.stolenAt <= ONE_DAY_MS
    ));
    if (recoverableRecords.length === 0) return;

    const recoveredCoins = recoverableRecords.reduce((total, record) => {
      const varietyDef = VARIETY_DEFS[record.varietyId];
      if (!varietyDef) return total;

      const stolenPlot = farm.plots.find((plot) => (
        plot.id === record.plotId
        && plot.state === 'stolen'
        && plot.varietyId === record.varietyId
      ));
      const multiplier = stolenPlot?.isMutant === true ? 3 : 1;
      return total + (varietyDef.sellPrice * 0.5 * multiplier);
    }, 0);

    recoverableRecords.forEach((record) => {
      markStolenRecordRecovered(record.stolenAt);
    });
    if (recoveredCoins > 0) {
      addCoins(recoveredCoins);
    }
    enqueueRecoveryToast(t.thiefRecovered);
  }, [
    farm.plots,
    farm.stolenRecords,
    markStolenRecordRecovered,
    addCoins,
    enqueueRecoveryToast,
    t,
  ]);

  const handleTimerComplete = useCallback((phase: TimerPhase) => {
    try {
      if (phase === 'work') {
        const taskName = currentTask.trim() || t.defaultTaskName(records.filter((r) => r.date === getTodayKey()).length + 1);
        const stage = resolveStageAndStore(settings.workMinutes);
        const emoji = GROWTH_EMOJI[stage];
        const record: PomodoroRecord = {
          id: Date.now().toString(),
          task: taskName,
          durationMinutes: settings.workMinutes,
          completedAt: new Date().toISOString(),
          date: getTodayKey(),
          status: 'completed',
        };
        setRecords((prev) => [record, ...prev]);
        syncRecord(record);
        recoverStolenHarvest(todayFocusMinutes + settings.workMinutes);
        sendBrowserNotification(t.workComplete(emoji), `"${taskName}" · ${settings.workMinutes}${t.minutes}`);
        playAlertRepeated(settings.alertSound, settings.alertRepeatCount);
        // Check achievements after work completion
        const newAchievements = achievements.checkAfterSession(settings.workMinutes, true, settings.ambienceMixer);
        if (newAchievements.length > 0) {
          // Delay showing achievement celebration until after the main celebration
          setTimeout(() => setAchievementCelebrationIds(newAchievements), 3000);
        }
      } else {
        sendBrowserNotification(t.breakOver, t.breakOverBody);
        playAlertRepeated(settings.alertSound, settings.alertRepeatCount);
      }
    } catch (err) {
      // Prevent timer completion errors from crashing the app
      console.error('[Timer] onComplete error:', err);
    }
  }, [
    currentTask,
    records,
    setRecords,
    settings.alertSound,
    settings.alertRepeatCount,
    settings.workMinutes,
    t,
    resolveStageAndStore,
    syncRecord,
    achievements,
    recoverStolenHarvest,
    todayFocusMinutes,
  ]);

  const handleSkipWork = useCallback((elapsedSeconds: number) => {
    try {
      const elapsedMinutes = Math.round(elapsedSeconds / 60);
      if (elapsedMinutes < 1) return;
      const taskName = currentTask.trim() || t.defaultTaskName(records.filter((r) => r.date === getTodayKey()).length + 1);

      // 防挂机：实际时间超过设定 2 倍 → 不给收获物
      const isOvertime2x = elapsedSeconds > settings.workMinutes * 60 * 2;

      const record: PomodoroRecord = {
        id: Date.now().toString(),
        task: taskName,
        durationMinutes: elapsedMinutes,
        completedAt: new Date().toISOString(),
        date: getTodayKey(),
        status: 'completed',
      };
      setRecords((prev) => [record, ...prev]);
      syncRecord(record);

      if (isOvertime2x) {
        // 超时 2 倍：记录但不给奖励，不存瓜棚，不播庆祝
        setLastRolledStage(null);
        suppressCelebrationRef.current = true;
        sendBrowserNotification(t.overtimeNoReward, `"${taskName}" · ${elapsedMinutes}${t.minutes}`);
      } else {
        // 奖励按设定时间算
        const stage = resolveStageAndStore(settings.workMinutes);
        const emoji = GROWTH_EMOJI[stage];
        sendBrowserNotification(t.skipComplete(emoji), `"${taskName}" · ${elapsedMinutes}${t.minutes}`);
      }
      playAlertRepeated(settings.alertSound, 1);
      // Check achievements after skip-complete
      if (!isOvertime2x) {
        const newAchievements = achievements.checkAfterSession(settings.workMinutes, true, settings.ambienceMixer);
        if (newAchievements.length > 0) {
          setTimeout(() => setAchievementCelebrationIds(newAchievements), 3000);
        }
      }
    } catch (err) {
      console.error('[Timer] onSkipWork error:', err);
    }
  }, [currentTask, records, setRecords, settings.alertSound, settings.workMinutes, t, resolveStageAndStore, syncRecord, achievements]);

  const timer = useTimer({ settings, onComplete: handleTimerComplete, onSkipWork: handleSkipWork });

  // ─── Pomodoro abandon with confirm ───
  // Shows a ConfirmModal before abandoning; records partial work (≥1min) as 'abandoned'
  const handleAbandonClick = useCallback(() => {
    setShowAbandonConfirm(true);
  }, []);

  const handleAbandonConfirm = useCallback(() => {
    const totalSeconds = settings.workMinutes * 60;
    const elapsedSeconds = timer.phase === 'overtime'
      ? totalSeconds + timer.overtimeSeconds
      : totalSeconds - timer.timeLeft;
    const elapsedMinutes = Math.round(elapsedSeconds / 60);
    if (elapsedMinutes >= 1) {
      const taskName = resolveTaskName();
      const record: PomodoroRecord = {
        id: Date.now().toString(),
        task: taskName,
        durationMinutes: elapsedMinutes,
        completedAt: new Date().toISOString(),
        date: getTodayKey(),
        status: 'abandoned',
      };
      setRecords((prev) => [record, ...prev]);
      syncRecord(record);
    }
    timer.abandon();
    // Track abandoned session for achievement detection (resets perfectionist counter)
    achievements.checkAfterSession(0, false);
    setShowAbandonConfirm(false);
  }, [settings.workMinutes, timer, resolveTaskName, setRecords, syncRecord, achievements]);

  // ─── Project timer callbacks ───
  // When a project task completes, also create a PomodoroRecord for unified daily stats.
  // Only records tasks ≥1min to avoid noise from instant skips.
  // If result.previousSeconds is set, this is a revisited task — update existing record instead of creating new.
  const handleProjectTaskComplete = useCallback((result: import('./types/project').ProjectTaskResult) => {
    const isRevisit = result.previousSeconds != null;
    const incrementalSeconds = isRevisit
      ? result.actualSeconds - result.previousSeconds!
      : result.actualSeconds;
    const incrementalMinutes = Math.round(incrementalSeconds / 60);
    const totalMinutes = Math.round(result.actualSeconds / 60);

    if (totalMinutes >= 1 && (result.status === 'completed' || result.status === 'abandoned')) {
      const pomodoroStatus = result.status === 'completed' ? 'completed' : 'abandoned';

      if (isRevisit) {
        // Revisit: update the existing record's duration (total time, not incremental)
        setRecords((prev) => {
          const idx = prev.findIndex(r => r.task === result.name && r.date === getTodayKey());
          if (idx !== -1) {
            const updated = [...prev];
            updated[idx] = { ...updated[idx], durationMinutes: totalMinutes, status: pomodoroStatus };
            return updated;
          }
          // Fallback: no existing record found, create with incremental time only
          return [{ id: Date.now().toString(), task: result.name, durationMinutes: incrementalMinutes, completedAt: result.completedAt, date: getTodayKey(), status: pomodoroStatus }, ...prev];
        });
      } else {
        // Normal: create a new record + store to warehouse
        // 防挂机：overtime 超过预估 2 倍不给奖励
        const isOvertime2x = result.actualSeconds > result.estimatedMinutes * 60 * 2;
        const stage = (result.status === 'completed' && !isOvertime2x)
          ? resolveStageAndStore(result.estimatedMinutes)
          : getGrowthStage(result.estimatedMinutes);
        const emoji = GROWTH_EMOJI[stage];
        const record: PomodoroRecord = {
          id: Date.now().toString(),
          task: result.name,
          durationMinutes: totalMinutes,
          completedAt: result.completedAt,
          date: getTodayKey(),
          status: pomodoroStatus,
        };
        setRecords((prev) => [record, ...prev]);
        syncRecord(record);
        if (result.status === 'completed') {
          if (isOvertime2x) {
            sendBrowserNotification(t.overtimeNoReward, `"${result.name}" · ${totalMinutes}${t.minutes}`);
          } else {
            sendBrowserNotification(t.workComplete(emoji), `"${result.name}" · ${totalMinutes}${t.minutes}`);
          }
        }
      }
    }
    playAlertRepeated(settings.alertSound, 1);
    // Check achievements after project task completion
    if (result.status === 'completed') {
      const newAchievements = achievements.checkAfterSession(
        Math.round(result.actualSeconds / 60),
        true,
        settings.ambienceMixer,
      );
      if (newAchievements.length > 0) {
        setTimeout(() => setAchievementCelebrationIds(newAchievements), 3000);
      }
    }
  }, [setRecords, settings.alertSound, t, resolveStageAndStore, syncRecord, achievements]);

  const handleProjectComplete = useCallback((record: ProjectRecord) => {
    setProjectRecords((prev) => [record, ...prev]);
    sendBrowserNotification(t.projectComplete, record.name);
    playAlertRepeated(settings.alertSound, settings.alertRepeatCount);
  }, [setProjectRecords, settings.alertSound, settings.alertRepeatCount, t]);

  const handleProjectOvertimeStart = useCallback(() => {
    sendBrowserNotification(t.projectOvertime, t.phaseWork);
    playAlertRepeated(settings.alertSound, settings.alertRepeatCount);
  }, [settings.alertSound, settings.alertRepeatCount, t]);

  const project = useProjectTimer(handleProjectTaskComplete, handleProjectComplete, handleProjectOvertimeStart, settings.autoStartWork);

  // ─── Project exit flow ───
  const handleProjectExitClick = useCallback(() => {
    setShowProjectExit(true);
  }, []);

  // Determine if any timer is active (for disabling mode switch)
  const isAnyTimerActive = timer.status !== 'idle' || (project.state !== null && project.state.phase !== 'setup' && project.state.phase !== 'summary');

  // ─── Background audio lifecycle ───
  // Play ambience only during active work phases (pomodoro or project).
  // Serialize mixer config to detect changes without deep comparison.
  const ambienceMixerKey = JSON.stringify(settings.ambienceMixer);

  const isProjectWorking = project.state?.phase === 'running' || project.state?.phase === 'overtime';
  useEffect(() => {
    try {
      if ((timer.status === 'running' && timer.phase === 'work') || isProjectWorking) {
        applyMixerConfig(settings.ambienceMixer);
      } else {
        stopAllAmbience();
      }
    } catch (err) {
      console.error('[App] ambience error:', err);
    }
    return () => { try { stopAllAmbience(); } catch { /* ignore */ } };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer.status, timer.phase, ambienceMixerKey, isProjectWorking]);

  const todayRecords = records.filter((r) => r.date === todayKey);

  const totalDuration = (timer.phase === 'work' || timer.phase === 'overtime')
    ? settings.workMinutes * 60
    : settings.shortBreakMinutes * 60;

  // ─── Document title ───
  // Shows countdown in browser tab: "12:34 🍉 西瓜时钟" during work,
  // "12:34 ☕ 西瓜时钟" during break, "+01:23 ⏰" during overtime.
  // Project mode uses 📋 emoji to distinguish from pomodoro mode.
  useEffect(() => {
    if (project.state && (project.state.phase === 'running' || project.state.phase === 'overtime' || project.state.phase === 'break' || project.state.phase === 'paused')) {
      const ps = project.state;
      if (ps.phase === 'break') {
        const m = Math.floor(ps.timeLeft / 60);
        const s = ps.timeLeft % 60;
        document.title = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')} ☕ ${t.appName}`;
      } else if (ps.phase === 'overtime') {
        const m = Math.floor(ps.elapsedSeconds / 60);
        const s = ps.elapsedSeconds % 60;
        document.title = `+${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')} ⏰ ${t.appName}`;
      } else {
        const m = Math.floor(ps.timeLeft / 60);
        const s = ps.timeLeft % 60;
        document.title = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')} 📋 ${t.appName}`;
      }
      return;
    }
    if (timer.status === 'running' || timer.status === 'paused') {
      if (timer.phase === 'overtime') {
        const m = Math.floor(timer.overtimeSeconds / 60);
        const s = timer.overtimeSeconds % 60;
        document.title = `+${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')} ⏰ ${t.appName}`;
      } else {
        const minutes = Math.floor(timer.timeLeft / 60);
        const seconds = timer.timeLeft % 60;
        const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        const phaseEmoji = timer.phase === 'work' ? '🍉' : '☕';
        document.title = `${timeStr} ${phaseEmoji} ${t.appName}`;
      }
    } else if (timer.phase !== 'work') {
      document.title = `${t.phaseShortBreak} · ${t.appName}`;
    } else {
      document.title = t.appName;
    }
  }, [timer.timeLeft, timer.phase, timer.status, t, project.state]);

  const handleUpdateRecord = useCallback((id: string, task: string) => {
    setRecords((prev) => prev.map((r) => r.id === id ? { ...r, task } : r));
  }, [setRecords]);

  const handleDeleteRecord = useCallback((id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
  }, [setRecords]);

  const handleExport = useCallback(() => {
    const data = {
      exportedAt: new Date().toISOString(),
      settings,
      records,
    };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const dateStr = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `watermelon-clock-export-${dateStr}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [settings, records]);

  const handleChangeWorkMinutes = useCallback((minutes: number) => {
    setSettings((prev) => ({
      ...prev,
      workMinutes: minutes,
      // >25min 时自动关闭 autoStartBreak（与 Settings 联动一致）
      ...(minutes > 25 ? { autoStartBreak: false } : {}),
    }));
  }, [setSettings]);

  const isWork = timer.phase === 'work';

  // Celebration — use lastRolledStage if available (includes legendary), fallback to getGrowthStage
  // null lastRolledStage = overtime 2x, suppress celebration
  useEffect(() => {
    if (timer.celebrating && suppressCelebrationRef.current) {
      suppressCelebrationRef.current = false;
      timer.dismissCelebration();
    }
  }, [timer.celebrating, timer.dismissCelebration]);
  const celebrationGrowthStage: GrowthStage | null = timer.celebrating && lastRolledStage
    ? lastRolledStage
    : null;
  const celebrationIsRipe = celebrationGrowthStage === 'ripe' || celebrationGrowthStage === 'legendary';

  const isProjectActive = project.state !== null && project.state.phase !== 'setup';
  const bgColor = isProjectActive
    ? (project.state?.phase === 'break' ? theme.bgBreak : theme.bgWork)
    : !isWork ? theme.bgBreak
    : timer.status === 'idle' ? theme.bg
    : theme.bgWork;

  const mainTabs = [
    { id: 'focus', emoji: '🍉', label: t.tabFocus },
    { id: 'warehouse', emoji: '🏠', label: t.tabWarehouse },
    { id: 'farm', emoji: '🌱', label: t.tabFarm },
    { id: 'market', emoji: '🏪', label: t.tabMarket },
  ] as const;
  const activeTabIndex = Math.max(0, mainTabs.findIndex((tab) => tab.id === activeTab));

  return (
    <I18nProvider value={t}>
    <ThemeProvider value={theme}>
      <div key={settings.language} className="min-h-dvh flex flex-col items-center transition-colors duration-[1500ms]"
        style={{ backgroundColor: bgColor }}>

        {/* Header — 48px, logo left, segmented center, icons right */}
        <header
          className="w-full h-12 flex items-center px-3 sm:px-5 shrink-0 z-40 sticky top-0 border-b"
          style={{
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            backgroundColor: `${theme.surface}cc`,
            borderColor: theme.border,
          }}
        >
          {/* Left: logo + brand name + streak */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <img src="/icon-192.png" alt={t.appName} className="w-7 h-7 sm:w-8 sm:h-8 shrink-0" style={{ filter: 'drop-shadow(0 0 6px rgba(34, 197, 94, 0.4))' }} />
            <span className="hidden sm:inline text-sm font-semibold truncate" style={{ color: theme.text }}>
              {t.appName}
            </span>
            {streak.current > 0 && (
              <span className="text-xs font-medium shrink-0" style={{ color: theme.accent }}>
                🔥{streak.current}
              </span>
            )}
          </div>

          {/* Center: Main Tab Bar */}
          <div
            className="relative flex items-center rounded-full p-[3px]"
            style={{ backgroundColor: theme.inputBg }}
          >
            {/* Sliding indicator */}
            <div
              className="absolute top-[3px] bottom-[3px] rounded-full transition-all duration-200 ease-out"
              style={{
                backgroundColor: theme.accent,
                opacity: 0.15,
                width: `calc((100% - 6px) / ${mainTabs.length})`,
                left: '3px',
                transform: `translateX(${activeTabIndex * 100}%)`,
              }}
            />
            {mainTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => !isAnyTimerActive && setActiveTab(tab.id)}
                  className={`relative z-10 px-2.5 py-1.5 rounded-full text-xs font-semibold transition-colors duration-200 flex-1 text-center ${isAnyTimerActive && !isActive ? 'opacity-40' : 'cursor-pointer'}`}
                  style={{ color: isActive ? theme.accent : theme.textMuted }}
                >
                  {tab.emoji} {tab.label}
                </button>
              );
            })}
          </div>

          {/* Right: achievements + history + settings */}
          <div className="flex items-center gap-0.5 flex-1 justify-end">
            <button
              onClick={() => setShowAchievements(true)}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer text-sm relative"
              style={{ color: theme.textMuted }}
              aria-label={t.achievementsButton}
            >
              🏆
              {achievements.unseenCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] font-bold text-white px-1"
                  style={{ backgroundColor: '#ef4444' }}
                >
                  {achievements.unseenCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setShowHistory(true)}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer text-sm"
              style={{ color: theme.textMuted }}
              aria-label={t.historyTab}
            >
              📅
            </button>
            <Settings
              settings={settings}
              onChange={setSettings}
              disabled={timer.status !== 'idle'}
              isWorkRunning={(timer.status === 'running' && timer.phase === 'work') || isProjectWorking === true}
              onExport={handleExport}
              onActivateDebug={activateDebugMode}
              onShowGuide={() => setShowGuide(true)}
              auth={auth}
            />
          </div>
        </header>

        {/* 主内容 */}
        {activeTab === 'focus' && (() => {
          const pv = project.timerView;
          const isProjectExecuting = pv !== null && mode === 'project';

          if (isProjectExecuting && project.state) {
            const projWorkMinutes = project.state.tasks[project.state.currentTaskIndex]?.estimatedMinutes || 25;
            const projGrowthStage: GrowthStage | null = null;
            return (
              <>
                <div className="flex-1 flex flex-col items-center w-full px-4 pt-8">
                  <ProjectTaskBar
                    projectName={project.state.name}
                    view={pv}
                  />
                  <div className="mt-4">
                    <Timer
                      timeLeft={pv.isOvertime ? 0 : pv.timeLeft}
                      totalDuration={pv.totalDuration}
                      phase={pv.phase}
                      status={pv.status}
                      celebrating={false}
                      celebrationStage={projGrowthStage}
                      celebrationIsRipe={false}
                      workMinutes={projWorkMinutes}
                      onCelebrationComplete={() => {}}
                      onStart={() => {}}
                      onPause={project.pause}
                      onResume={project.resume}
                      onSkip={project.completeCurrentTask}
                      onAbandon={handleProjectExitClick}
                      onChangeWorkMinutes={() => {}}
                      overtime={pv.isOvertime ? { seconds: pv.overtimeSeconds } : undefined}
                    />
                  </div>
                </div>
                <div className="w-full max-w-xs sm:max-w-sm px-4 pt-4 pb-6">
                  <div className="rounded-2xl p-5 border" style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
                    <div className="flex flex-col items-center gap-5">
                      <EncouragementBanner todayRecords={todayRecords} allRecords={records} />
                      <TodayStats records={todayRecords} hideTitle />
                    </div>
                  </div>
                </div>
              </>
            );
          }

          if (mode === 'pomodoro') {
            return (
              <>
                <div className="flex-1 flex flex-col items-center w-full px-4 pt-4">
                  <div className="mb-4">
                    <ModeSwitch mode={mode} onChange={setMode} disabled={isAnyTimerActive} />
                  </div>
                  <Timer
                    timeLeft={timer.timeLeft} totalDuration={totalDuration}
                    phase={timer.phase} status={timer.status}
                    celebrating={timer.celebrating}
                    celebrationStage={celebrationGrowthStage}
                    celebrationIsRipe={celebrationIsRipe}
                    workMinutes={settings.workMinutes}
                    onCelebrationComplete={timer.dismissCelebration}
                    onStart={timer.start} onPause={timer.pause}
                    onResume={timer.resume} onSkip={timer.skip}
                    onAbandon={handleAbandonClick}
                    onChangeWorkMinutes={handleChangeWorkMinutes}
                    overtime={timer.overtimeSeconds > 0 ? { seconds: timer.overtimeSeconds } : undefined}
                  />
                  <div className="mt-6">
                    <TaskInput value={currentTask} onChange={setCurrentTask} disabled={timer.status !== 'idle'} />
                  </div>
                </div>
                <div className="w-full max-w-xs sm:max-w-sm px-4 pt-4 pb-6">
                  <div className="rounded-2xl p-5 border" style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
                    <div className="flex flex-col items-center gap-5">
                      <EncouragementBanner todayRecords={todayRecords} allRecords={records} />
                      <TodayStats records={todayRecords} idle={timer.status === 'idle'} hideTitle />
                      <TaskList records={todayRecords} onUpdate={handleUpdateRecord} onDelete={handleDeleteRecord} />
                    </div>
                  </div>
                </div>
              </>
            );
          }

          // Project mode: setup, summary, or exited
          return (
            <>
              <div className="flex justify-center pt-4 mb-2">
                <ModeSwitch mode={mode} onChange={setMode} disabled={isAnyTimerActive} />
              </div>
              <ProjectMode
                project={project}
                onSwitchToPomodoro={() => setMode('pomodoro')}
              />
            </>
          );
        })()}

        {activeTab === 'warehouse' && (
          <WarehousePage
            warehouse={warehouse}
            shed={shed}
            onSynthesize={handleSynthesize}
            onSynthesizeAll={handleSynthesizeAll}
            onSlice={handleStartSlice}
            highestStage={getHighestStage()}
            inline
            onGoFarm={() => setActiveTab('farm')}
          />
        )}

        {activeTab === 'farm' && (
          <FarmPage
            farm={farm}
            geneInventory={geneInventory}
            seeds={shed.seeds}
            items={shed.items}
            injectedSeeds={shed.injectedSeeds}
            hybridSeeds={shed.hybridSeeds}
            todayFocusMinutes={todayFocusMinutes}
            todayKey={todayKey}
            addSeeds={addSeeds}
            onPlant={handleFarmPlant}
            onPlantInjected={handleFarmPlantInjected}
            onPlantHybrid={handleFarmPlantHybrid}
            onHarvest={handleFarmHarvest}
            onClear={clearPlot}
            onUseMutationGun={handleUseMutationGun}
            onUseMoonDew={handleUseMoonDew}
            onUseNectar={handleUseNectar}
            onUseStarTracker={handleUseStarTracker}
            onUseGuardianBarrier={handleUseGuardianBarrier}
            onUseTrapNet={handleUseTrapNet}
            onInject={handleGeneInject}
            onFusion={handleGeneFusion}
            onGoWarehouse={() => setActiveTab('warehouse')}
          />
        )}

        {activeTab === 'market' && (
          <MarketPage
            balance={balance}
            collection={farm.collection}
            onSellVariety={handleSellVariety}
            onBuyItem={handleBuyItem}
            onBuyPlot={handleBuyPlot}
            unlockedPlotCount={farm.plots.length}
            messages={t}
          />
        )}
        {/* 全屏切瓜场景 */}
        {slicingMelon && (
          <SlicingScene
            melonType={slicingMelon}
            comboCount={comboCount}
            canContinue={canContinueSlicing}
            pity={shed.pity}
            onComplete={handleSliceComplete}
            onContinue={handleSliceContinue}
            onCancel={handleSliceCancel}
          />
        )}

        {/* PWA 安装提示 */}
        <InstallPrompt />

        {activeMutationToastMessage && (
          <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[140]">
            <Toast
              message={activeMutationToastMessage}
              duration={2600}
              onDone={dismissMutationToast}
            />
          </div>
        )}

        {activeRecoveryToast && (
          <div className="fixed top-28 left-1/2 -translate-x-1/2 z-[140]">
            <Toast
              message={activeRecoveryToast}
              duration={2600}
              onDone={dismissRecoveryToast}
            />
          </div>
        )}

        {/* Debug: version badge — helps confirm PWA cache is updated */}
        <div style={{
          position: 'fixed', bottom: 4, right: 8, zIndex: 9999,
          fontSize: '10px', color: 'rgba(255,255,255,0.2)',
          fontFamily: 'monospace', pointerEvents: 'none',
        }}>
          v{__APP_VERSION__}
        </div>

        {/* 历史记录面板 */}
        {showHistory && (
          <HistoryPanel records={records} projectRecords={projectRecords} onClose={() => setShowHistory(false)} />
        )}

        {/* 项目恢复提示 */}
        {project.hasSavedProject && (
          <ProjectRecoveryModal
            onRecover={() => { project.recoverProject(); setMode('project'); }}
            onDiscard={project.discardSavedProject}
          />
        )}

        {/* 番茄钟退出确认弹窗 */}
        {showAbandonConfirm && (
          <ConfirmModal
            title={t.confirmExitTitle}
            message={t.confirmExitMessage}
            confirmText={t.confirm}
            cancelText={t.cancel}
            onConfirm={handleAbandonConfirm}
            onCancel={() => setShowAbandonConfirm(false)}
            danger
          />
        )}

        {/* 项目模式退出弹窗 */}
        {showProjectExit && project.state && (
          <ProjectExitModal
            taskName={project.state.tasks[project.state.currentTaskIndex]?.name || ''}
            isFirstTask={project.state.currentTaskIndex === 0}
            isLastTask={project.state.currentTaskIndex >= project.state.tasks.length - 1}
            isBreak={project.state.phase === 'break' || (project.state.phase === 'paused' && project.state.pausedFrom === 'break')}
            onCancel={() => setShowProjectExit(false)}
            onExitTask={() => project.exitCurrentTask()}
            onAbandonProject={() => { project.abandonProject(); setShowProjectExit(false); setMode('pomodoro'); }}
            onRestart={() => { project.restartCurrentTask(); setShowProjectExit(false); }}
            onNext={() => { project.goToNextTask(); setShowProjectExit(false); }}
            onPrevious={() => { project.goToPreviousTask(); setShowProjectExit(false); }}
          />
        )}

        {/* Guide modal — triggered from settings */}
        <GuideButton externalShow={showGuide} onExternalClose={() => setShowGuide(false)} />

        {/* Achievements page */}
        {showAchievements && (
          <AchievementsPage
            data={achievements.data}
            onClose={() => setShowAchievements(false)}
            onMarkSeen={achievements.markSeen}
            language={settings.language}
          />
        )}

        {/* Achievement celebration overlay */}
        {achievementCelebrationIds.length > 0 && (
          <AchievementCelebration
            unlockedIds={achievementCelebrationIds}
            onComplete={() => setAchievementCelebrationIds([])}
            language={settings.language}
          />
        )}

        {debugMode && (
          <DebugToolbar
            addItems={addItems}
            resetWarehouse={resetWarehouse}
            farm={farm}
            setFarmPlots={setFarmPlots}
            setFarmCollection={setFarmCollection}
            resetFarm={resetFarm}
            timerStatus={timer.status}
            skipTimer={timer.skip}
            timeMultiplier={timeMultiplier}
            setTimeMultiplier={setTimeMultiplier}
            onClose={deactivateDebugMode}
          />
        )}
      </div>
    </ThemeProvider>
    </I18nProvider>
  );
}

export default App;
