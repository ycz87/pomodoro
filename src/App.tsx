import { useState, useCallback, useEffect } from 'react';
import { Timer } from './components/Timer';
import { TaskInput } from './components/TaskInput';
import { TodayStats } from './components/TodayStats';
import { TaskList } from './components/TaskList';
import { RoundProgress } from './components/RoundProgress';
import { Settings } from './components/Settings';
import { useTimer } from './hooks/useTimer';
import type { TimerPhase } from './hooks/useTimer';
import { useLocalStorage } from './hooks/useLocalStorage';
import { sendNotification, requestNotificationPermission } from './utils/notification';
import { getTodayKey } from './utils/time';
import type { PomodoroRecord, PomodoroSettings } from './types';
import { DEFAULT_SETTINGS, getGrowthStage, GROWTH_EMOJI } from './types';

function App() {
  const [currentTask, setCurrentTask] = useState('');
  const [records, setRecords] = useLocalStorage<PomodoroRecord[]>('pomodoro-records', []);
  const [settings, setSettings] = useLocalStorage<PomodoroSettings>('pomodoro-settings', DEFAULT_SETTINGS);

  useEffect(() => {
    requestNotificationPermission();
  }, []);

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
      sendNotification(
        `${emoji} 番茄钟完成！`,
        `"${currentTask || '未命名任务'}" · ${settings.workMinutes}分钟`,
        settings.sound,
      );
    } else if (phase === 'longBreak') {
      sendNotification('🌙 长休息结束', '新一轮开始，准备好了吗？', settings.sound);
    } else {
      sendNotification('☕ 休息结束', '准备好开始下一个番茄钟了吗？', settings.sound);
    }
  }, [currentTask, setRecords, settings.sound, settings.workMinutes]);

  const timer = useTimer({ settings, onComplete: handleTimerComplete });

  const todayKey = getTodayKey();
  const todayRecords = records.filter((r) => r.date === todayKey);

  const totalDuration = timer.phase === 'work'
    ? settings.workMinutes * 60
    : timer.phase === 'longBreak'
      ? settings.longBreakMinutes * 60
      : settings.shortBreakMinutes * 60;

  // Update page title
  useEffect(() => {
    if (timer.status === 'running' || timer.status === 'paused') {
      const minutes = Math.floor(timer.timeLeft / 60);
      const seconds = timer.timeLeft % 60;
      const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      const phaseEmoji = timer.phase === 'work' ? '🍅' : timer.phase === 'longBreak' ? '🌙' : '☕';
      document.title = `${timeStr} ${phaseEmoji} 番茄时钟`;
    } else {
      document.title = '番茄时钟';
    }
  }, [timer.timeLeft, timer.phase, timer.status]);

  const handleUpdateRecord = useCallback((id: string, task: string) => {
    setRecords((prev) => prev.map((r) => r.id === id ? { ...r, task } : r));
  }, [setRecords]);

  const handleDeleteRecord = useCallback((id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
  }, [setRecords]);

  const isWork = timer.phase === 'work';
  const isTimerRunning = timer.status === 'running';

  return (
    <div
      className={`min-h-dvh flex flex-col items-center transition-colors duration-700 ${
        timer.status === 'idle'
          ? 'bg-[#0c0c0f]'
          : isWork
            ? 'bg-[#100c0c]'
            : 'bg-[#0c100e]'
      }`}
    >
      {/* Header bar — lightweight, semi-transparent */}
      <header className="w-full flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-base">🍅</span>
          <span className="text-white/40 text-sm font-medium tracking-wide">番茄时钟</span>
        </div>
        <Settings
          settings={settings}
          onChange={setSettings}
          disabled={isTimerRunning}
        />
      </header>

      {/* Main content — vertically centered */}
      <div className="flex-1 flex flex-col items-center justify-center gap-5 sm:gap-7 w-full px-4">
        {/* Timer */}
        <Timer
          timeLeft={timer.timeLeft}
          totalDuration={totalDuration}
          phase={timer.phase}
          status={timer.status}
          onStart={timer.start}
          onPause={timer.pause}
          onResume={timer.resume}
          onSkip={timer.skip}
        />

        {/* Round progress indicator */}
        <RoundProgress
          current={timer.roundProgress}
          total={settings.pomodorosPerRound}
        />

        {/* Task Input */}
        <TaskInput
          value={currentTask}
          onChange={setCurrentTask}
          disabled={timer.status === 'running'}
        />
      </div>

      {/* Bottom section — stats and records */}
      <div className="flex flex-col items-center gap-5 w-full max-w-xs sm:max-w-sm px-4 pt-4 sm:pt-6 pb-6">
        <TodayStats records={todayRecords} />
        <TaskList
          records={todayRecords}
          onUpdate={handleUpdateRecord}
          onDelete={handleDeleteRecord}
        />
      </div>
    </div>
  );
}

export default App;
