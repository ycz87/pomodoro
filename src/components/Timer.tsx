import { useEffect, useRef } from 'react';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const prevStatusRef = useRef<TimerStatus>(status);

  // Scale-in animation when starting
  useEffect(() => {
    if (status === 'running' && prevStatusRef.current === 'idle' && containerRef.current) {
      containerRef.current.classList.remove('animate-scale-in');
      // Force reflow
      void containerRef.current.offsetWidth;
      containerRef.current.classList.add('animate-scale-in');
    }
    prevStatusRef.current = status;
  }, [status]);

  // SVG circle parameters
  const radius = 140;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  // Gradient IDs
  const gradientId = isWork ? 'grad-work' : 'grad-break';

  return (
    <div ref={containerRef} className="flex flex-col items-center gap-4 sm:gap-6">
      {/* Phase indicator */}
      <div
        className={`text-sm font-medium tracking-widest transition-colors duration-500 ${
          isWork ? 'text-red-400/80' : 'text-emerald-400/80'
        }`}
      >
        {isWork ? '🍅 专注时间' : '☕ 休息时间'}
      </div>

      {/* Circular timer */}
      <div className="relative w-[260px] h-[260px] sm:w-[320px] sm:h-[320px] flex items-center justify-center">
        <svg
          className={`absolute inset-0 -rotate-90 ${
            status === 'running' ? 'animate-glow' : ''
          }`}
          viewBox="0 0 320 320"
          style={{
            '--glow-color': isWork ? 'rgba(239, 68, 68, 0.4)' : 'rgba(52, 211, 153, 0.4)',
          } as React.CSSProperties}
        >
          <defs>
            {/* Work gradient: red → orange */}
            <linearGradient id="grad-work" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
            {/* Break gradient: emerald → teal */}
            <linearGradient id="grad-break" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#2dd4bf" />
            </linearGradient>
          </defs>

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
          {/* Progress circle with gradient */}
          <circle
            cx="160"
            cy="160"
            r={radius}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-linear"
          />
        </svg>

        {/* Time display */}
        <span
          className={`text-6xl sm:text-7xl font-timer font-light text-white tracking-tight select-none transition-opacity ${
            status === 'paused' ? 'animate-pulse' : ''
          }`}
        >
          {formatTime(timeLeft)}
        </span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 sm:gap-4 h-16">
        {status === 'idle' && (
          <button
            onClick={onStart}
            className={`group w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer ${
              isWork
                ? 'bg-gradient-to-br from-red-500 to-orange-500 hover:from-red-400 hover:to-orange-400'
                : 'bg-gradient-to-br from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400'
            }`}
          >
            {/* Play triangle */}
            <svg width="20" height="24" viewBox="0 0 20 24" fill="none" className="ml-0.5">
              <path d="M2 2L18 12L2 22V2Z" fill="white" />
            </svg>
          </button>
        )}

        {status === 'running' && (
          <button
            onClick={onPause}
            className="w-14 h-14 rounded-full flex items-center justify-center bg-white/[0.08] hover:bg-white/[0.14] transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
          >
            {/* Pause bars */}
            <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
              <rect x="1" y="1" width="4.5" height="18" rx="1" fill="white" />
              <rect x="10.5" y="1" width="4.5" height="18" rx="1" fill="white" />
            </svg>
          </button>
        )}

        {status === 'paused' && (
          <button
            onClick={onResume}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer ${
              isWork
                ? 'bg-gradient-to-br from-red-500 to-orange-500 hover:from-red-400 hover:to-orange-400'
                : 'bg-gradient-to-br from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400'
            }`}
          >
            <svg width="20" height="24" viewBox="0 0 20 24" fill="none" className="ml-0.5">
              <path d="M2 2L18 12L2 22V2Z" fill="white" />
            </svg>
          </button>
        )}

        {status !== 'idle' && (
          <button
            onClick={onSkip}
            className="w-11 h-11 rounded-full flex items-center justify-center bg-white/[0.04] text-white/40 hover:bg-white/[0.08] hover:text-white/60 transition-all duration-200 cursor-pointer"
          >
            {/* Skip forward icon */}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 2L10 8L2 14V2Z" fill="currentColor" />
              <rect x="11" y="2" width="3" height="12" rx="0.5" fill="currentColor" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
