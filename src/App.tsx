import { useState, useCallback, useEffect } from 'react';
import { Timer } from './components/Timer';
import { TaskInput } from './components/TaskInput';
import { TodayStats } from './components/TodayStats';
import { TaskList } from './components/TaskList';
import { useTimer } from './hooks/useTimer';
import type { TimerPhase } from './hooks/useTimer';
import { useLocalStorage } from './hooks/useLocalStorage';
import { sendNotification, requestNotificationPermission } from './utils/notification';
import { getTodayKey } from './utils/time';
import type { PomodoroRecord } from './types';

function App() {
  const [currentTask, setCurrentTask] = useState('');
  const [records, setRecords] = useLocalStorage<PomodoroRecord[]>('pomodoro-records', []);

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
      sendNotification('🍅 番茄钟完成！', `"${currentTask || '未命名任务'}" 已完成，休息一下吧`);
    } else {
      sendNotification('☕ 休息结束', '准备好开始下一个番茄钟了吗？');
    }
  }, [currentTask, setRecords]);

  const timer = useTimer(handleTimerComplete);

  const todayKey = getTodayKey();
  const todayRecords = records.filter((r) => r.date === todayKey);

  // Update page title with timer
  useEffect(() => {
    if (timer.status === 'running' || timer.status === 'paused') {
      const minutes = Math.floor(timer.timeLeft / 60);
      const seconds = timer.timeLeft % 60;
      const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      const phaseEmoji = timer.phase === 'work' ? '🍅' : '☕';
      document.title = `${timeStr} ${phaseEmoji} 番茄时钟`;
    } else {
      document.title = '番茄时钟';
    }
  }, [timer.timeLeft, timer.phase, timer.status]);

  const isWork = timer.phase === 'work';

  return (
    <div
      className={`min-h-dvh flex flex-col items-center px-4 py-6 sm:py-8 transition-colors duration-700 ${
        timer.status === 'idle'
          ? 'bg-[#0f0f13]'
          : isWork
            ? 'bg-[#130f0f]'
            : 'bg-[#0f1311]'
      }`}
    >
      {/* Main content — vertically centered */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6 sm:gap-8 w-full">
        {/* Header */}
        <header>
          <h1 className="text-white/50 text-base font-light tracking-widest uppercase">
            番茄时钟
          </h1>
        </header>

        {/* Timer */}
        <Timer
          timeLeft={timer.timeLeft}
          phase={timer.phase}
          status={timer.status}
          onStart={timer.start}
          onPause={timer.pause}
          onResume={timer.resume}
          onSkip={timer.skip}
        />

        {/* Task Input */}
        <TaskInput
          value={currentTask}
          onChange={setCurrentTask}
          disabled={timer.status === 'running'}
        />
      </div>

      {/* Bottom section — stats and records */}
      <div className="flex flex-col items-center gap-4 sm:gap-6 w-full max-w-sm sm:max-w-md pt-6 sm:pt-8 pb-4">
        <TodayStats count={todayRecords.length} />
        <TaskList records={todayRecords} />
      </div>
    </div>
  );
}

export default App;
