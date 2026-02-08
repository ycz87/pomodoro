import type { TimerPhase, TimerStatus } from '../hooks/useTimer';
import { formatTime } from '../utils/time';

interface TimerProps {
  timeLeft: number;
  phase: TimerPhase;
  status: TimerStatus;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onSkip: () => void;
}

export function Timer({ timeLeft, phase, status, onStart, onPause, onResume, onSkip }: TimerProps) {
  const isWork = phase === 'work';
  const totalDuration = isWork ? 25 * 60 : 5 * 60;
  const progress = (totalDuration - timeLeft) / totalDuration;

  // SVG circle parameters
  const radius = 140;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="flex flex-col items-center gap-4 sm:gap-6">
      {/* Phase indicator */}
      <div
        className={`text-sm font-semibold uppercase tracking-widest transition-colors duration-500 ${
          isWork ? 'text-red-400' : 'text-emerald-400'
        }`}
      >
        {isWork ? '🍅 专注时间' : '☕ 休息时间'}
      </div>

      {/* Circular timer */}
      <div className="relative w-[260px] h-[260px] sm:w-[320px] sm:h-[320px] flex items-center justify-center">
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 320 320">
          {/* Background circle */}
          <circle
            cx="160"
            cy="160"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            className="text-white/[0.06]"
          />
          {/* Progress circle */}
          <circle
            cx="160"
            cy="160"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={`transition-all duration-1000 ease-linear ${
              isWork ? 'text-red-500' : 'text-emerald-500'
            }`}
          />
        </svg>

        {/* Time display */}
        <span
          className={`text-6xl sm:text-7xl font-mono font-light text-white tracking-tight select-none transition-opacity ${
            status === 'paused' ? 'animate-pulse' : ''
          }`}
        >
          {formatTime(timeLeft)}
        </span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 sm:gap-4 h-14">
        {status === 'idle' && (
          <button
            onClick={onStart}
            className={`px-8 py-3 rounded-full text-white font-medium text-lg transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer ${
              isWork
                ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/25'
                : 'bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/25'
            }`}
          >
            开始
          </button>
        )}

        {status === 'running' && (
          <button
            onClick={onPause}
            className="px-8 py-3 rounded-full bg-white/10 text-white font-medium text-lg hover:bg-white/20 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
          >
            暂停
          </button>
        )}

        {status === 'paused' && (
          <button
            onClick={onResume}
            className={`px-8 py-3 rounded-full text-white font-medium text-lg transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer ${
              isWork
                ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/25'
                : 'bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/25'
            }`}
          >
            继续
          </button>
        )}

        {status !== 'idle' && (
          <button
            onClick={onSkip}
            className="px-6 py-3 rounded-full bg-white/5 text-white/50 font-medium text-lg hover:bg-white/10 hover:text-white/70 transition-all duration-200 cursor-pointer"
          >
            跳过
          </button>
        )}
      </div>
    </div>
  );
}
