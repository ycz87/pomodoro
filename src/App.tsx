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
import { DEFAULT_SETTINGS } from './types';

function App() {
  const [currentTask, setCurrentTask] = useState('');
  const [records, setRecords] = useLocalStorage<PomodoroRecord[]>('pomodoro-records', []);
  const [settings, setSettings] = useLocalStorage<PomodoroSettings>('pomodoro-settings', DEFAULT_SETTINGS);

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const handleTimerComplete = useCallback((phase: TimerPhase) => {
    if (phase === 'work') {
      const record: PomodoroRecord = {
        id: Date.now().toString(),
        task: currentTask,
        completedAt: new Date().toISOString(),
        date: getTodayKey(),
      };
      setRecords((prev) => [record, ...prev]);
      sendNotification('🍅 番茄钟完成！', `"${currentTask || '未命名任务'}" 已完成，休息一下吧`, settings.sound);
    } else if (phase === 'longBreak') {
      sendNotification('🌙 长休息结束', '新一轮开始，准备好了吗？', settings.sound);
    } else {
      sendNotification('☕ 休息结束', '准备好开始下一个番茄钟了吗？', settings.sound);
    }
  }, [currentTask, setRecords, settings.sound]);

  const timer = useTimer({ settings, onComplete: handleTimerComplete });

  const todayKey = getTodayKey();
  const todayRecords = records.filter((r) => r.date === todayKey);

  // Calculate total duration for current phase
  const totalDuration = timer.phase === 'work'
    ? settings.workMinutes * 60
    : timer.phase === 'longBreak'
      ? settings.longBreakMinutes * 60
      : settings.shortBreakMinutes * 60;

  // Update page title with timer
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

  const isWork = timer.phase === 'work';
  const isTimerActive = timer.status === 'running' || timer.status === 'paused';

  return (
    <div
      className={`min-h-dvh flex flex-col items-center px-4 py-6 sm:py-8 transition-colors duration-700 ${
        timer.status === 'idle'
          ? 'bg-[#0c0c0f]'
          : isWork
            ? 'bg-[#100c0c]'
            : 'bg-[#0c100e]'
      }`}
    >
      {/* Settings gear — top right */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50">
        <Settings
          settings={settings}
          onChange={setSettings}
          disabled={isTimerActive}
        />
      </div>

      {/* Main content — vertically centered */}
      <div className="flex-1 flex flex-col items-center justify-center gap-5 sm:gap-7 w-full">
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
      <div className="flex flex-col items-center gap-5 w-full max-w-xs sm:max-w-sm pt-4 sm:pt-6 pb-6">
        <TodayStats count={todayRecords.length} />
        <TaskList records={todayRecords} />
      </div>
    </div>
  );
}

export default App;
