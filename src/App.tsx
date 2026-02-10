/**
 * App — 西瓜时钟主应用
 * 管理计时器状态、记录、设置，串联所有组件
 */
import { useState, useCallback, useEffect, useMemo } from 'react';
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
import { useTimer } from './hooks/useTimer';
import type { TimerPhase } from './hooks/useTimer';
import { useProjectTimer } from './hooks/useProjectTimer';
import { ThemeProvider } from './hooks/useTheme';
import { useLocalStorage } from './hooks/useLocalStorage';
import {
  requestNotificationPermission, sendBrowserNotification,
  playAlertRepeated,
  setMasterAlertVolume, setMasterAmbienceVolume,
  applyMixerConfig, stopAllAmbience,
} from './audio';
import { getTodayKey } from './utils/time';
import { getStreak } from './utils/stats';
import { I18nProvider, getMessages } from './i18n';
import type { PomodoroRecord, PomodoroSettings } from './types';
import { DEFAULT_SETTINGS, migrateSettings, THEMES, getGrowthStage, GROWTH_EMOJI } from './types';
import type { GrowthStage } from './types';
import type { AppMode } from './types/project';
import type { ProjectRecord } from './types/project';

function App() {
  const [currentTask, setCurrentTask] = useState('');
  const [records, setRecords] = useLocalStorage<PomodoroRecord[]>('pomodoro-records', []);
  const [projectRecords, setProjectRecords] = useLocalStorage<ProjectRecord[]>('pomodoro-project-records', []);
  const [settings, setSettings] = useLocalStorage<PomodoroSettings>('pomodoro-settings', DEFAULT_SETTINGS, migrateSettings);
  const [showHistory, setShowHistory] = useState(false);
  const [mode, setMode] = useState<AppMode>('pomodoro');
  const [showGuide, setShowGuide] = useState(false);

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

  const handleTimerComplete = useCallback((phase: TimerPhase) => {
    if (phase === 'work') {
      const taskName = currentTask.trim() || t.defaultTaskName(records.filter((r) => r.date === getTodayKey()).length + 1);
      const stage = getGrowthStage(settings.workMinutes);
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
  }, [currentTask, records, setRecords, settings.alertSound, settings.alertRepeatCount, settings.workMinutes, t]);

  const handleSkipWork = useCallback((elapsedSeconds: number) => {
    const elapsedMinutes = Math.round(elapsedSeconds / 60);
    if (elapsedMinutes < 1) return;
    const taskName = currentTask.trim() || t.defaultTaskName(records.filter((r) => r.date === getTodayKey()).length + 1);
    const stage = getGrowthStage(elapsedMinutes);
    const emoji = GROWTH_EMOJI[stage];
    const record: PomodoroRecord = {
      id: Date.now().toString(),
      task: taskName,
      durationMinutes: elapsedMinutes,
      completedAt: new Date().toISOString(),
      date: getTodayKey(),
      status: 'completed',
    };
    setRecords((prev) => [record, ...prev]);
    sendBrowserNotification(t.skipComplete(emoji), `"${taskName}" · ${elapsedMinutes}${t.minutes}`);
    playAlertRepeated(settings.alertSound, 1);
  }, [currentTask, records, setRecords, settings.alertSound, t]);

  const timer = useTimer({ settings, onComplete: handleTimerComplete, onSkipWork: handleSkipWork });

  // ─── Pomodoro abandon with confirm ───
  const handleAbandonClick = useCallback(() => {
    setShowAbandonConfirm(true);
  }, []);

  const handleAbandonConfirm = useCallback(() => {
    const totalSeconds = settings.workMinutes * 60;
    const elapsedSeconds = totalSeconds - timer.timeLeft;
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

  // ─── Project timer ───
  const handleProjectTaskComplete = useCallback((result: import('./types/project').ProjectTaskResult) => {
    const minutes = Math.round(result.actualSeconds / 60);
    if (minutes >= 1 && result.status === 'completed') {
      const stage = getGrowthStage(minutes);
      const emoji = GROWTH_EMOJI[stage];
      const record: PomodoroRecord = {
        id: Date.now().toString(),
        task: result.name,
        durationMinutes: minutes,
        completedAt: result.completedAt,
        date: getTodayKey(),
        status: 'completed',
      };
      setRecords((prev) => [record, ...prev]);
      sendBrowserNotification(t.workComplete(emoji), `"${result.name}" · ${minutes}${t.minutes}`);
    }
    playAlertRepeated(settings.alertSound, 1);
  }, [setRecords, settings.alertSound, t]);

  const handleProjectComplete = useCallback((record: ProjectRecord) => {
    setProjectRecords((prev) => [record, ...prev]);
    sendBrowserNotification(t.projectComplete, record.name);
    playAlertRepeated(settings.alertSound, settings.alertRepeatCount);
  }, [setProjectRecords, settings.alertSound, settings.alertRepeatCount, t]);

  const project = useProjectTimer(handleProjectTaskComplete, handleProjectComplete);

  // ─── Project exit flow ───
  const handleProjectExitClick = useCallback(() => {
    setShowProjectExit(true);
  }, []);

  // Determine if any timer is active (for disabling mode switch)
  const isAnyTimerActive = timer.status !== 'idle' || (project.state !== null && project.state.phase !== 'setup' && project.state.phase !== 'summary');

  // Serialize mixer config for effect dependency
  const ambienceMixerKey = JSON.stringify(settings.ambienceMixer);

  // 管理背景音生命周期
  const isProjectWorking = project.state?.phase === 'running' || project.state?.phase === 'overtime';
  useEffect(() => {
    if ((timer.status === 'running' && timer.phase === 'work') || isProjectWorking) {
      applyMixerConfig(settings.ambienceMixer);
    } else {
      stopAllAmbience();
    }
    return () => stopAllAmbience();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer.status, timer.phase, ambienceMixerKey, isProjectWorking]);

  const todayKey = getTodayKey();
  const todayRecords = records.filter((r) => r.date === todayKey);

  const totalDuration = timer.phase === 'work'
    ? settings.workMinutes * 60
    : settings.shortBreakMinutes * 60;

  // 页面标题显示倒计时
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
      const minutes = Math.floor(timer.timeLeft / 60);
      const seconds = timer.timeLeft % 60;
      const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      const phaseEmoji = timer.phase === 'work' ? '🍉' : '☕';
      document.title = `${timeStr} ${phaseEmoji} ${t.appName}`;
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
    setSettings((prev) => ({ ...prev, workMinutes: minutes }));
  }, [setSettings]);

  const isWork = timer.phase === 'work';

  // Celebration
  const celebrationGrowthStage: GrowthStage | null = timer.celebrating ? getGrowthStage(settings.workMinutes) : null;
  const celebrationIsRipe = settings.workMinutes >= 25;

  const isProjectActive = project.state !== null && project.state.phase !== 'setup';
  const bgColor = isProjectActive
    ? (project.state?.phase === 'break' ? theme.bgBreak : theme.bgWork)
    : !isWork ? theme.bgBreak
    : timer.status === 'idle' ? theme.bg
    : theme.bgWork;

  return (
    <I18nProvider value={t}>
    <ThemeProvider value={theme}>
      <div className="min-h-dvh flex flex-col items-center transition-all duration-[1500ms]"
        style={{ background: `linear-gradient(to bottom, ${bgColor}, ${bgColor}e6)` }}>

        {/* Header — 48px, logo left, segmented center, icons right */}
        <header
          className="w-full h-12 flex items-center px-3 sm:px-5 shrink-0 z-40 sticky top-0 border-b"
          style={{
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            backgroundColor: `${theme.surface}cc`,
            borderColor: 'rgba(255,255,255,0.06)',
          }}
        >
          {/* Left: logo + streak */}
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <img src="/favicon-32x32.png" alt="" className="w-5 h-5 shrink-0" style={{ filter: 'drop-shadow(0 0 6px rgba(34, 197, 94, 0.4))' }} />
            {streak.current > 0 && (
              <span className="text-xs font-medium shrink-0" style={{ color: theme.accent }}>
                🔥{streak.current}
              </span>
            )}
          </div>

          {/* Center: Segmented Control */}
          <ModeSwitch mode={mode} onChange={setMode} disabled={isAnyTimerActive} />

          {/* Right: history + settings */}
          <div className="flex items-center gap-0.5 flex-1 justify-end">
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
                  <div className="rounded-2xl p-5 border" style={{ backgroundColor: theme.surface, borderColor: 'rgba(255,255,255,0.06)' }}>
                    <TodayStats records={todayRecords} />
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
                  />
                  <div className="mt-6">
                    <TaskInput value={currentTask} onChange={setCurrentTask} disabled={timer.status !== 'idle'} />
                  </div>
                </div>
                <div className="w-full max-w-xs sm:max-w-sm px-4 pt-4 pb-6">
                  <div className="rounded-2xl p-5 border" style={{ backgroundColor: theme.surface, borderColor: 'rgba(255,255,255,0.06)' }}>
                    <div className="flex flex-col items-center gap-5">
                      <TodayStats records={todayRecords} idle={timer.status === 'idle'} />
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
      </div>
    </ThemeProvider>
    </I18nProvider>
  );
}

export default App;
