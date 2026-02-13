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
import { useTimer } from './hooks/useTimer';
import type { TimerPhase } from './hooks/useTimer';
import { useProjectTimer } from './hooks/useProjectTimer';
import { useWarehouse } from './hooks/useWarehouse';
import { useAuth } from './hooks/useAuth';
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
import { getStreak } from './utils/stats';
import { I18nProvider, getMessages } from './i18n';
import type { PomodoroRecord, PomodoroSettings } from './types';
import { DEFAULT_SETTINGS, migrateSettings, THEMES, getGrowthStage, GROWTH_EMOJI, rollLegendary } from './types';
import type { GrowthStage } from './types';
import type { AppMode } from './types/project';
import type { ProjectRecord } from './types/project';

function App() {
  const [currentTask, setCurrentTask] = useState('');
  const [records, setRecords] = useLocalStorage<PomodoroRecord[]>('pomodoro-records', []);
  const [projectRecords, setProjectRecords] = useLocalStorage<ProjectRecord[]>('pomodoro-project-records', []);
  const [settings, setSettings] = useLocalStorage<PomodoroSettings>('pomodoro-settings', DEFAULT_SETTINGS, migrateSettings);
  const [showHistory, setShowHistory] = useState(false);
  const [showWarehouse, setShowWarehouse] = useState(false);
  const [mode, setMode] = useState<AppMode>('pomodoro');
  const [showGuide, setShowGuide] = useState(false);
  const [lastRolledStage, setLastRolledStage] = useState<GrowthStage | null>(null);
  const suppressCelebrationRef = useRef(false);

  // PC drag-to-scroll (mouse drag = touch scroll)
  useDragScroll();

  // Auth
  const auth = useAuth();

  // Warehouse
  const { warehouse, addItem, addItems, updatePity, synthesize, synthesizeAll, getHighestStage, resetWarehouse } = useWarehouse();

  // Modal states
  const [showAbandonConfirm, setShowAbandonConfirm] = useState(false);
  const [showProjectExit, setShowProjectExit] = useState(false);

  const theme = THEMES[settings.theme]?.colors ?? THEMES.dark.colors;

  // i18n
  const t = useMemo(() => getMessages(settings.language), [settings.language]);

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
    return stage;
  }, [warehouse.legendaryPity, updatePity, addItem]);

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
        sendBrowserNotification(t.workComplete(emoji), `"${taskName}" · ${settings.workMinutes}${t.minutes}`);
        playAlertRepeated(settings.alertSound, settings.alertRepeatCount);
      } else {
        sendBrowserNotification(t.breakOver, t.breakOverBody);
        playAlertRepeated(settings.alertSound, settings.alertRepeatCount);
      }
    } catch (err) {
      // Prevent timer completion errors from crashing the app
      console.error('[Timer] onComplete error:', err);
    }
  }, [currentTask, records, setRecords, settings.alertSound, settings.alertRepeatCount, settings.workMinutes, t, resolveStageAndStore]);

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
    } catch (err) {
      console.error('[Timer] onSkipWork error:', err);
    }
  }, [currentTask, records, setRecords, settings.alertSound, settings.workMinutes, t, resolveStageAndStore]);

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
    }
    timer.abandon();
    setShowAbandonConfirm(false);
  }, [settings.workMinutes, timer, resolveTaskName, setRecords]);

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
  }, [setRecords, settings.alertSound, t, resolveStageAndStore]);

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

  const todayKey = getTodayKey();
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

          {/* Center: Segmented Control */}
          <ModeSwitch mode={mode} onChange={setMode} disabled={isAnyTimerActive} />

          {/* Right: warehouse + history + settings */}
          <div className="flex items-center gap-0.5 flex-1 justify-end">
            <button
              onClick={() => setShowWarehouse(true)}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer text-sm"
              style={{ color: theme.textMuted }}
              aria-label={t.warehouseTitle}
            >
              🏠
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
              onShowGuide={() => setShowGuide(true)}
              auth={auth}
              testMode={{ addItems, resetWarehouse }}
            />
          </div>
        </header>

        {/* 主内容 */}
        {(() => {
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
                {/* 8pt grid: header→32px→phase→16px→ring→24px→controls→24px→input→24px→stats */}
                <div className="flex-1 flex flex-col items-center w-full px-4 pt-8">
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
            <ProjectMode
              project={project}
              onSwitchToPomodoro={() => setMode('pomodoro')}
            />
          );
        })()}

        {/* PWA 安装提示 */}
        <InstallPrompt />

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

        {/* Warehouse page */}
        {showWarehouse && (
          <WarehousePage
            warehouse={warehouse}
            onSynthesize={synthesize}
            onSynthesizeAll={synthesizeAll}
            highestStage={getHighestStage()}
            onClose={() => setShowWarehouse(false)}
          />
        )}
      </div>
    </ThemeProvider>
    </I18nProvider>
  );
}

export default App;
