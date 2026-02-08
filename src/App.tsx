/**
 * App — 西瓜时钟主应用
 * 管理计时器状态、记录、设置，串联所有组件
 */
import { useState, useCallback, useEffect, useMemo } from 'react';
import { Timer } from './components/Timer';
import { TaskInput } from './components/TaskInput';
import { TodayStats } from './components/TodayStats';
import { TaskList } from './components/TaskList';
import { RoundProgress } from './components/RoundProgress';
import { Settings } from './components/Settings';
import { GuideButton } from './components/Guide';
import { InstallPrompt } from './components/InstallPrompt';
import { HistoryPanel } from './components/HistoryPanel';
import { useTimer } from './hooks/useTimer';
import type { TimerPhase } from './hooks/useTimer';
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

function App() {
  const [currentTask, setCurrentTask] = useState('');
  const [records, setRecords] = useLocalStorage<PomodoroRecord[]>('pomodoro-records', []);
  const [settings, setSettings] = useLocalStorage<PomodoroSettings>('pomodoro-settings', DEFAULT_SETTINGS, migrateSettings);
  const [showHistory, setShowHistory] = useState(false);

  const theme = THEMES[settings.theme]?.colors ?? THEMES.dark.colors;

  // i18n
  const t = useMemo(() => getMessages(settings.language), [settings.language]);

  // 连续打卡
  const streak = useMemo(() => getStreak(records), [records]);

  // 初始化音量
  useEffect(() => {
    requestNotificationPermission();
    setMasterAlertVolume(settings.alertVolume);
    setMasterAmbienceVolume(settings.ambienceVolume);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleTimerComplete = useCallback((phase: TimerPhase) => {
    if (phase === 'work') {
      const stage = getGrowthStage(settings.workMinutes);
      const emoji = GROWTH_EMOJI[stage];
      const record: PomodoroRecord = {
        id: Date.now().toString(),
        task: currentTask,
        durationMinutes: settings.workMinutes,
        completedAt: new Date().toISOString(),
        date: getTodayKey(),
      };
      setRecords((prev) => [record, ...prev]);
      sendBrowserNotification(t.workComplete(emoji), `"${currentTask || t.unnamed}" · ${settings.workMinutes}${t.minutes}`);
      playAlertRepeated(settings.alertSound, settings.alertRepeatCount);
    } else if (phase === 'longBreak') {
      sendBrowserNotification(t.longBreakOver, t.longBreakOverBody);
      playAlertRepeated(settings.alertSound, settings.alertRepeatCount);
    } else {
      sendBrowserNotification(t.breakOver, t.breakOverBody);
      playAlertRepeated(settings.alertSound, settings.alertRepeatCount);
    }
  }, [currentTask, setRecords, settings.alertSound, settings.alertRepeatCount, settings.workMinutes, t]);

  const handleSkipWork = useCallback((elapsedSeconds: number) => {
    const elapsedMinutes = Math.round(elapsedSeconds / 60);
    if (elapsedMinutes < 1) return;
    const stage = getGrowthStage(elapsedMinutes);
    const emoji = GROWTH_EMOJI[stage];
    const record: PomodoroRecord = {
      id: Date.now().toString(),
      task: currentTask,
      durationMinutes: elapsedMinutes,
      completedAt: new Date().toISOString(),
      date: getTodayKey(),
    };
    setRecords((prev) => [record, ...prev]);
    sendBrowserNotification(t.skipComplete(emoji), `"${currentTask || t.unnamed}" · ${elapsedMinutes}${t.minutes}`);
    playAlertRepeated(settings.alertSound, 1);
  }, [currentTask, setRecords, settings.alertSound, t]);

  const timer = useTimer({ settings, onComplete: handleTimerComplete, onSkipWork: handleSkipWork });

  // 管理背景音生命周期 — 工作阶段运行时播放混音器配置的音效
  useEffect(() => {
    if (timer.status === 'running' && timer.phase === 'work') {
      applyMixerConfig(settings.ambienceMixer);
    } else {
      stopAllAmbience();
    }
    return () => stopAllAmbience();
  }, [timer.status, timer.phase, settings.ambienceMixer]);

  const todayKey = getTodayKey();
  const todayRecords = records.filter((r) => r.date === todayKey);

  const totalDuration = timer.phase === 'work'
    ? settings.workMinutes * 60
    : timer.phase === 'longBreak'
      ? settings.longBreakMinutes * 60
      : settings.shortBreakMinutes * 60;

  // 页面标题显示倒计时
  useEffect(() => {
    if (timer.status === 'running' || timer.status === 'paused') {
      const minutes = Math.floor(timer.timeLeft / 60);
      const seconds = timer.timeLeft % 60;
      const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      const phaseEmoji = timer.phase === 'work' ? '🍉' : timer.phase === 'longBreak' ? '🌙' : '☕';
      document.title = `${timeStr} ${phaseEmoji} ${t.appName}`;
    } else if (timer.phase !== 'work') {
      const breakLabel = timer.phase === 'longBreak' ? t.phaseLongBreak : t.phaseShortBreak;
      document.title = `${breakLabel} · ${t.appName}`;
    } else {
      document.title = t.appName;
    }
  }, [timer.timeLeft, timer.phase, timer.status, t]);

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

  const bgColor = !isWork ? theme.bgBreak
    : timer.status === 'idle' ? theme.bg
    : theme.bgWork;

  return (
    <I18nProvider value={t}>
    <ThemeProvider value={theme}>
      <div className="min-h-dvh flex flex-col items-center transition-colors duration-700"
        style={{ backgroundColor: bgColor }}>

        {/* Header */}
        <header className="w-full flex items-center justify-between px-3 sm:px-6 py-2 sm:py-4 shrink-0 z-40 relative">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-base shrink-0">🍉</span>
            <span className="text-sm font-medium tracking-wide truncate" style={{ color: theme.textMuted }}>{t.appName}</span>
            {streak.current > 0 && (
              <span className="text-xs font-medium shrink-0 ml-1" style={{ color: theme.accent }}>
                🔥{streak.current}
              </span>
            )}
          </div>
          <div className="flex items-center gap-0.5 shrink-0">
            <button
              onClick={() => setShowHistory(true)}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer text-sm"
              style={{ color: theme.textMuted }}
              aria-label={t.historyTab}
            >
              📅
            </button>
            <GuideButton />
            <Settings settings={settings} onChange={setSettings} disabled={timer.status !== 'idle'} onExport={handleExport} />
          </div>
        </header>

        {/* 主内容 */}
        <div className="flex-1 flex flex-col items-center justify-center gap-5 sm:gap-7 w-full px-4">
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
            onAbandon={timer.abandon}
            onChangeWorkMinutes={handleChangeWorkMinutes}
          />
          <RoundProgress current={timer.roundProgress} total={settings.pomodorosPerRound} idle={timer.status === 'idle'} />
          <TaskInput value={currentTask} onChange={setCurrentTask} disabled={timer.status !== 'idle'} />
        </div>

        {/* 底部 */}
        <div className="flex flex-col items-center gap-5 w-full max-w-xs sm:max-w-sm px-4 pt-4 sm:pt-6 pb-6">
          <TodayStats records={todayRecords} />
          <TaskList records={todayRecords} onUpdate={handleUpdateRecord} onDelete={handleDeleteRecord} />
        </div>

        {/* PWA 安装提示 */}
        <InstallPrompt />

        {/* 历史记录面板 */}
        {showHistory && (
          <HistoryPanel records={records} onClose={() => setShowHistory(false)} />
        )}
      </div>
    </ThemeProvider>
    </I18nProvider>
  );
}

export default App;
