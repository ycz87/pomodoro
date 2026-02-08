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
      void containerRef.current.offsetWidth;
      containerRef.current.classList.add('animate-scale-in');
    }
    prevStatusRef.current = status;
  }, [status]);

  // SVG parameters — no CSS rotation, handle arc direction in SVG
  const size = 320;
  const center = size / 2;
  const radius = 136;
  const circumference = 2 * Math.PI * radius;
  // We draw the arc starting from top (12 o'clock) going clockwise
  // SVG default starts at 3 o'clock, so we use transform on the circle element
  const strokeDashoffset = circumference * (1 - progress);

  // Calculate the position of the progress head for the glow dot
  const angle = progress * 2 * Math.PI - Math.PI / 2; // -90° to start from top
  const headX = center + radius * Math.cos(angle);
  const headY = center + radius * Math.sin(angle);

  return (
    <div ref={containerRef} className="flex flex-col items-center gap-4 sm:gap-6">
      {/* Phase indicator */}
      <div
        className={`text-sm font-medium tracking-widest transition-colors duration-500 ${
          isWork ? 'text-red-400' : 'text-emerald-400'
        }`}
      >
        {isWork ? '🍅 专注时间' : '☕ 休息时间'}
      </div>

      {/* Circular timer */}
      <div className="relative w-[260px] h-[260px] sm:w-[320px] sm:h-[320px] flex items-center justify-center">
        <svg
          className="absolute inset-0"
          viewBox={`0 0 ${size} ${size}`}
        >
          <defs>
            {/* Work gradient: red → orange, rotated to follow the arc */}
            <linearGradient id="grad-work" gradientUnits="userSpaceOnUse"
              x1={center} y1="0" x2={size} y2={size}>
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="50%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#fb923c" />
            </linearGradient>
            {/* Break gradient: emerald → teal */}
            <linearGradient id="grad-break" gradientUnits="userSpaceOnUse"
              x1={center} y1="0" x2={size} y2={size}>
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="50%" stopColor="#2dd4bf" />
              <stop offset="100%" stopColor="#5eead4" />
            </linearGradient>
            {/* Glow filter for the progress head */}
            <filter id="glow-work" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feFlood floodColor="#ef4444" floodOpacity="0.8" />
              <feComposite in2="blur" operator="in" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glow-break" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feFlood floodColor="#34d399" floodOpacity="0.8" />
              <feComposite in2="blur" operator="in" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Subtle radial gradient for inner area */}
            <radialGradient id="inner-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={isWork ? '#ef4444' : '#34d399'} stopOpacity="0.03" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Inner subtle radial glow */}
          <circle cx={center} cy={center} r={radius - 10} fill="url(#inner-glow)" />

          {/* Background circle — visible but subtle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="white"
            strokeOpacity="0.08"
            strokeWidth="8"
          />

          {/* Progress arc */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={`url(#${isWork ? 'grad-work' : 'grad-break'})`}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform={`rotate(-90 ${center} ${center})`}
            className="transition-all duration-1000 ease-linear"
          />

          {/* Glowing dot at the head of the progress arc */}
          {progress > 0.005 && status !== 'idle' && (
            <circle
              cx={headX}
              cy={headY}
              r="5"
              fill={isWork ? '#fb923c' : '#5eead4'}
              filter={`url(#${isWork ? 'glow-work' : 'glow-break'})`}
              className={status === 'running' ? 'animate-glow-dot' : ''}
            />
          )}
        </svg>

        {/* Time display */}
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
                ? '0 4px 20px rgba(239, 68, 68, 0.3)'
                : '0 4px 20px rgba(52, 211, 153, 0.3)',
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
            className="w-14 h-14 rounded-full flex items-center justify-center bg-white/[0.08] hover:bg-white/[0.14] transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-sm"
          >
            <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
              <rect x="1" y="1" width="4.5" height="18" rx="1.5" fill="white" fillOpacity="0.9" />
              <rect x="10.5" y="1" width="4.5" height="18" rx="1.5" fill="white" fillOpacity="0.9" />
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
                ? '0 4px 20px rgba(239, 68, 68, 0.3)'
                : '0 4px 20px rgba(52, 211, 153, 0.3)',
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
            className="w-11 h-11 rounded-full flex items-center justify-center bg-white/[0.04] text-white/40 hover:bg-white/[0.08] hover:text-white/60 transition-all duration-200 cursor-pointer"
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
