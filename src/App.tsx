/**
 * App — 西瓜时钟主应用
 * 管理计时器状态、记录、设置，串联所有组件
 */
import { useState, useCallback, useEffect } from 'react';
import { Timer } from './components/Timer';
import { TaskInput } from './components/TaskInput';
import { TodayStats } from './components/TodayStats';
import { TaskList } from './components/TaskList';
import { RoundProgress } from './components/RoundProgress';
import { Settings } from './components/Settings';
import { GuideButton } from './components/Guide';
import { InstallPrompt } from './components/InstallPrompt';
import { useTimer } from './hooks/useTimer';
import type { TimerPhase } from './hooks/useTimer';
import { ThemeProvider } from './hooks/useTheme';
import { useLocalStorage } from './hooks/useLocalStorage';
import { sendNotification, requestNotificationPermission, startTickSound, stopTickSound, setAlertVolume, setTickVolume } from './utils/notification';
import { getTodayKey } from './utils/time';
import type { PomodoroRecord, PomodoroSettings } from './types';
import { DEFAULT_SETTINGS, THEMES, getGrowthStage, GROWTH_EMOJI } from './types';
import type { GrowthStage } from './types';

function App() {
  const [currentTask, setCurrentTask] = useState('');
  const [records, setRecords] = useLocalStorage<PomodoroRecord[]>('pomodoro-records', []);
  const [settings, setSettings] = useLocalStorage<PomodoroSettings>('pomodoro-settings', DEFAULT_SETTINGS);

  const theme = THEMES[settings.theme]?.colors ?? THEMES.dark.colors;

  // 初始化音量
  useEffect(() => {
    requestNotificationPermission();
    setAlertVolume(settings.alertVolume);
    setTickVolume(settings.tickVolume);
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
      sendNotification(`${emoji} 西瓜钟完成！`, `"${currentTask || '未命名任务'}" · ${settings.workMinutes}分钟`, settings.sound, settings.alertDurationSeconds);
    } else if (phase === 'longBreak') {
      sendNotification('🌙 长休息结束', '新一轮开始，准备好了吗？', settings.sound, settings.alertDurationSeconds);
    } else {
      sendNotification('☕ 休息结束', '准备好开始下一个西瓜钟了吗？', settings.sound, settings.alertDurationSeconds);
    }
  }, [currentTask, setRecords, settings.sound, settings.workMinutes, settings.alertDurationSeconds]);

  const handleSkipWork = useCallback((elapsedSeconds: number) => {
    const elapsedMinutes = Math.round(elapsedSeconds / 60);
    if (elapsedMinutes < 1) return; // less than 1 minute, don't record
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
    sendNotification(`${emoji} 手动完成`, `\"${currentTask || '未命名任务'}\" · 专注了 ${elapsedMinutes} 分钟`, settings.sound, settings.alertDurationSeconds);
  }, [currentTask, setRecords, settings.sound, settings.alertDurationSeconds]);

  const timer = useTimer({ settings, onComplete: handleTimerComplete, onSkipWork: handleSkipWork });

  // 管理背景滴答声生命周期
  useEffect(() => {
    if (timer.status === 'running' && timer.phase === 'work' && settings.tickSound !== 'none') {
      startTickSound(settings.tickSound);
    } else {
      stopTickSound();
    }
    return () => stopTickSound();
  }, [timer.status, timer.phase, settings.tickSound]);

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
      document.title = `${timeStr} ${phaseEmoji} 西瓜时钟`;
    } else if (timer.phase !== 'work') {
      // Idle in break phase — show break label
      const breakLabel = timer.phase === 'longBreak' ? '🌙 长休息' : '☕ 休息一下';
      document.title = `${breakLabel} · 西瓜时钟`;
    } else {
      document.title = '西瓜时钟';
    }
  }, [timer.timeLeft, timer.phase, timer.status]);

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

  // Celebration: determine growth stage for the work duration
  const celebrationGrowthStage: GrowthStage | null = timer.celebrating ? getGrowthStage(settings.workMinutes) : null;
  const celebrationIsRipe = settings.workMinutes >= 25;

  // 根据阶段和状态选择背景色
  // 工作阶段 idle 时用默认背景，休息阶段始终用休息背景（让用户一眼看出处于休息）
  const bgColor = !isWork ? theme.bgBreak
    : timer.status === 'idle' ? theme.bg
    : theme.bgWork;

  return (
    <ThemeProvider value={theme}>
      <div className="min-h-dvh flex flex-col items-center transition-colors duration-700"
        style={{ backgroundColor: bgColor }}>

        {/* Header */}
        <header className="w-full flex items-center justify-between px-3 sm:px-6 py-2 sm:py-4 shrink-0 z-40 relative">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-base shrink-0">🍉</span>
            <span className="text-sm font-medium tracking-wide truncate" style={{ color: theme.textMuted }}>西瓜时钟</span>
          </div>
          <div className="flex items-center gap-0.5 shrink-0">
            <GuideButton />
            <Settings settings={settings} onChange={setSettings} disabled={timer.status !== 'idle'} onExport={handleExport} />
          </div>
        </header>

        {/* 主内容 — 垂直居中 */}
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

        {/* 底部 — 统计和记录 */}
        <div className="flex flex-col items-center gap-5 w-full max-w-xs sm:max-w-sm px-4 pt-4 sm:pt-6 pb-6">
          <TodayStats records={todayRecords} />
          <TaskList records={todayRecords} onUpdate={handleUpdateRecord} onDelete={handleDeleteRecord} />
        </div>

        {/* PWA 安装提示 */}
        <InstallPrompt />
      </div>
    </ThemeProvider>
  );
}

export default App;
