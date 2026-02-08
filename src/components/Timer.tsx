import { useEffect, useRef } from 'react';
import type { TimerPhase, TimerStatus } from '../hooks/useTimer';
import { formatTime } from '../utils/time';

interface TimerProps {
  timeLeft: number;
  totalDuration: number;
  phase: TimerPhase;
  status: TimerStatus;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onSkip: () => void;
}

export function Timer({ timeLeft, totalDuration, phase, status, onStart, onPause, onResume, onSkip }: TimerProps) {
  const isWork = phase === 'work';
  const progress = totalDuration > 0 ? (totalDuration - timeLeft) / totalDuration : 0;
  const containerRef = useRef<HTMLDivElement>(null);
  const prevStatusRef = useRef<TimerStatus>(status);

  useEffect(() => {
    if (status === 'running' && prevStatusRef.current === 'idle' && containerRef.current) {
      containerRef.current.classList.remove('animate-scale-in');
      void containerRef.current.offsetWidth;
      containerRef.current.classList.add('animate-scale-in');
    }
    prevStatusRef.current = status;
  }, [status]);

  const size = 320;
  const center = size / 2;
  const radius = 136;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  const angle = progress * 2 * Math.PI - Math.PI / 2;
  const headX = center + radius * Math.cos(angle);
  const headY = center + radius * Math.sin(angle);

  const workColors = { from: '#ef4444', mid: '#f97316', to: '#fb923c' };
  const breakColors = { from: '#34d399', mid: '#2dd4bf', to: '#5eead4' };
  const colors = isWork ? workColors : breakColors;

  const phaseLabel = phase === 'work' ? '🍅 专注时间'
    : phase === 'longBreak' ? '🌙 长休息'
    : '☕ 短休息';

  return (
    <div ref={containerRef} className="flex flex-col items-center gap-4 sm:gap-6">
      {/* Phase indicator */}
      <div
        className={`text-sm font-medium tracking-widest transition-colors duration-500 ${
          isWork ? 'text-red-400' : 'text-emerald-400'
        }`}
      >
        {phaseLabel}
      </div>

      {/* Circular timer */}
      <div className="relative w-[260px] h-[260px] sm:w-[320px] sm:h-[320px] flex items-center justify-center overflow-visible">
        <svg className="absolute inset-0 overflow-visible" viewBox={`0 0 ${size} ${size}`} overflow="visible">
          <defs>
            <linearGradient id="grad-progress" gradientUnits="userSpaceOnUse"
              x1={center} y1="0" x2={size} y2={size}>
              <stop offset="0%" stopColor={colors.from} />
              <stop offset="50%" stopColor={colors.mid} />
              <stop offset="100%" stopColor={colors.to} />
            </linearGradient>
            <linearGradient id="grad-base" gradientUnits="userSpaceOnUse"
              x1={center} y1="0" x2={size} y2={size}>
              <stop offset="0%" stopColor={colors.from} stopOpacity="0.35" />
              <stop offset="100%" stopColor={colors.mid} stopOpacity="0.15" />
            </linearGradient>
            <filter id="glow-head" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="10" result="blur" />
              <feFlood floodColor={colors.mid} floodOpacity="1" />
              <feComposite in2="blur" operator="in" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <radialGradient id="inner-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={colors.from} stopOpacity="0.10" />
              <stop offset="50%" stopColor={colors.from} stopOpacity="0.04" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>
          </defs>

          <circle cx={center} cy={center} r={radius - 10} fill="url(#inner-glow)" />

          <circle
            cx={center} cy={center} r={radius}
            fill="none" stroke="url(#grad-base)" strokeWidth="10"
            transform={`rotate(-90 ${center} ${center})`}
          />

          <circle
            cx={center} cy={center} r={radius}
            fill="none" stroke="url(#grad-progress)" strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform={`rotate(-90 ${center} ${center})`}
            className="transition-all duration-1000 ease-linear"
          />

          {progress > 0.005 && status !== 'idle' && (
            <circle
              cx={headX} cy={headY} r="6"
              fill={colors.to} filter="url(#glow-head)"
              className={status === 'running' ? 'animate-glow-dot' : ''}
            />
          )}
        </svg>

        <span
          className={`text-6xl sm:text-7xl font-timer text-white tracking-tight select-none transition-opacity ${
            status === 'paused' ? 'animate-pulse' : ''
          }`}
          style={{ fontWeight: 300 }}
        >
          {formatTime(timeLeft)}
        </span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 sm:gap-4 h-16">
        {status === 'idle' && (
          <button
            onClick={onStart}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer ${
              isWork
                ? 'bg-gradient-to-br from-red-500 to-orange-500 hover:from-red-400 hover:to-orange-400'
                : 'bg-gradient-to-br from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300'
            }`}
            style={{
              boxShadow: isWork
                ? '0 4px 24px rgba(239, 68, 68, 0.4)'
                : '0 4px 24px rgba(52, 211, 153, 0.4)',
            }}
          >
            <svg width="20" height="24" viewBox="0 0 20 24" fill="none" className="ml-0.5">
              <path d="M2 2L18 12L2 22V2Z" fill="white" />
            </svg>
          </button>
        )}

        {status === 'running' && (
          <button
            onClick={onPause}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer ${
              isWork
                ? 'bg-red-500/20 hover:bg-red-500/30 border border-red-500/30'
                : 'bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30'
            }`}
          >
            <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
              <rect x="1" y="1" width="4.5" height="18" rx="1.5" fill={isWork ? '#f87171' : '#6ee7b7'} />
              <rect x="10.5" y="1" width="4.5" height="18" rx="1.5" fill={isWork ? '#f87171' : '#6ee7b7'} />
            </svg>
          </button>
        )}

        {status === 'paused' && (
          <button
            onClick={onResume}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer ${
              isWork
                ? 'bg-gradient-to-br from-red-500 to-orange-500 hover:from-red-400 hover:to-orange-400'
                : 'bg-gradient-to-br from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300'
            }`}
            style={{
              boxShadow: isWork
                ? '0 4px 24px rgba(239, 68, 68, 0.4)'
                : '0 4px 24px rgba(52, 211, 153, 0.4)',
            }}
          >
            <svg width="20" height="24" viewBox="0 0 20 24" fill="none" className="ml-0.5">
              <path d="M2 2L18 12L2 22V2Z" fill="white" />
            </svg>
          </button>
        )}

        {status !== 'idle' && (
          <button
            onClick={onSkip}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
              isWork
                ? 'bg-red-500/10 text-red-400/60 hover:bg-red-500/20 hover:text-red-400/80'
                : 'bg-emerald-500/10 text-emerald-400/60 hover:bg-emerald-500/20 hover:text-emerald-400/80'
            }`}
          >
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
