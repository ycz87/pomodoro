import { useEffect, useRef, useState } from 'react';
import type { TimerPhase, TimerStatus } from '../hooks/useTimer';
import type { GrowthStage } from '../types';
import { formatTime } from '../utils/time';
import { useTheme } from '../hooks/useTheme';
import { useI18n } from '../i18n';
import { CelebrationOverlay } from './CelebrationOverlay';

const QUICK_DURATIONS = [5, 10, 15, 20, 25, 30, 45, 60];

interface TimerProps {
  timeLeft: number;
  totalDuration: number;
  phase: TimerPhase;
  status: TimerStatus;
  celebrating: boolean;
  celebrationStage: GrowthStage | null;
  celebrationIsRipe: boolean;
  workMinutes: number;
  onCelebrationComplete: () => void;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onSkip: () => void;
  onAbandon: () => void;
  onChangeWorkMinutes: (minutes: number) => void;
  /** Overtime mode: show elapsed time counting up with red styling */
  overtime?: { seconds: number };
}

export function Timer({ timeLeft, totalDuration, phase, status, celebrating, celebrationStage, celebrationIsRipe, workMinutes, onCelebrationComplete, onStart, onPause, onResume, onSkip, onAbandon, onChangeWorkMinutes, overtime }: TimerProps) {
  const isWork = phase === 'work';
  const isOvertime = !!overtime;
  const progress = isOvertime ? 1 : (totalDuration > 0 ? (totalDuration - timeLeft) / totalDuration : 0);
  const containerRef = useRef<HTMLDivElement>(null);
  const prevStatusRef = useRef<TimerStatus>(status);
  const [showQuickPicker, setShowQuickPicker] = useState(false);

  useEffect(() => {
    if (status === 'running' && prevStatusRef.current === 'idle' && containerRef.current) {
      containerRef.current.classList.remove('animate-scale-in');
      void containerRef.current.offsetWidth;
      containerRef.current.classList.add('animate-scale-in');
    }
    if (status !== 'idle') setShowQuickPicker(false);
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

  const theme = useTheme();
  const t = useI18n();

  // 根据主题和阶段选择颜色
  const workColors = { from: theme.accent, mid: theme.accentEnd, to: theme.accentEnd };
  const breakColors = { from: theme.breakAccent, mid: theme.breakAccentEnd, to: theme.breakAccentEnd };
  const overtimeColors = { from: '#ef4444', mid: '#f87171', to: '#fca5a5' };
  const colors = isOvertime ? overtimeColors : isWork ? workColors : breakColors;

  const phaseLabel = isOvertime ? t.projectOvertime
    : phase === 'work' ? t.phaseWork
    : phase === 'longBreak' ? t.phaseLongBreak
    : t.phaseShortBreak;

  return (
    <div ref={containerRef} className="flex flex-col items-center gap-4 sm:gap-6 relative">
      {/* Celebration overlay */}
      {celebrating && celebrationStage && (
        <CelebrationOverlay
          stage={celebrationStage}
          isRipe={celebrationIsRipe}
          onComplete={onCelebrationComplete}
        />
      )}

      {/* Phase indicator */}
      <div className={`text-sm font-medium tracking-widest transition-all duration-500 ${
        !isWork && status !== 'idle' ? 'text-base' : ''
      }`}
        style={{ color: isWork ? theme.accent : theme.breakAccent }}>
        {phaseLabel}
      </div>

      {/* Circular timer */}
      <div className="relative w-[260px] h-[260px] sm:w-[320px] sm:h-[320px] flex items-center justify-center overflow-visible">
        <svg className={`absolute inset-0 overflow-visible ${celebrating ? 'animate-ring-pulse' : ''} ${isOvertime ? 'animate-ring-pulse' : ''}`} viewBox={`0 0 ${size} ${size}`} overflow="visible">
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
          className={`text-6xl sm:text-7xl font-timer tracking-tight select-none transition-opacity ${
            status === 'paused' ? 'animate-pulse' : ''
          } ${isOvertime ? 'animate-pulse' : ''} ${status === 'idle' && isWork && !isOvertime ? 'cursor-pointer hover:opacity-70' : ''}`}
          style={{ fontWeight: 300, color: isOvertime ? '#ef4444' : theme.text }}
          onClick={() => {
            if (status === 'idle' && isWork && !isOvertime) setShowQuickPicker(!showQuickPicker);
          }}
          title={status === 'idle' && isWork && !isOvertime ? t.quickTimeHint : undefined}
        >
          {isOvertime ? `+${formatTime(overtime!.seconds)}` : formatTime(timeLeft)}
        </span>

        {/* Quick duration picker */}
        {showQuickPicker && status === 'idle' && isWork && (
          <div className="absolute -bottom-2 translate-y-full flex flex-wrap justify-center gap-1.5 px-4 py-2.5 rounded-2xl border animate-fade-up z-10"
            style={{ backgroundColor: `${theme.surface}f0`, borderColor: theme.textFaint }}>
            {QUICK_DURATIONS.map((m) => (
              <button key={m}
                onClick={() => { onChangeWorkMinutes(m); setShowQuickPicker(false); }}
                className="px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer"
                style={{
                  backgroundColor: workMinutes === m ? `${theme.accent}30` : theme.inputBg,
                  color: workMinutes === m ? theme.accent : theme.textMuted,
                  fontWeight: workMinutes === m ? 600 : 400,
                }}>
                {m}min
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Controls — 使用主题色 */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-3 sm:gap-4 h-16">
        {status === 'idle' && (
          <button onClick={onStart}
            className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
            style={{ background: `linear-gradient(135deg, ${colors.from}, ${colors.to})`, boxShadow: `0 4px 24px ${colors.from}66` }}>
            <svg width="20" height="24" viewBox="0 0 20 24" fill="none" className="ml-0.5">
              <path d="M2 2L18 12L2 22V2Z" fill="white" />
            </svg>
          </button>
        )}

        {status === 'running' && (
          <button onClick={onPause}
            className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer border"
            style={{ backgroundColor: `${colors.from}20`, borderColor: `${colors.from}40` }}>
            <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
              <rect x="1" y="1" width="4.5" height="18" rx="1.5" fill={colors.from} fillOpacity="0.7" />
              <rect x="10.5" y="1" width="4.5" height="18" rx="1.5" fill={colors.from} fillOpacity="0.7" />
            </svg>
          </button>
        )}

        {status === 'paused' && (
          <button onClick={onResume}
            className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
            style={{ background: `linear-gradient(135deg, ${colors.from}, ${colors.to})`, boxShadow: `0 4px 24px ${colors.from}66` }}>
            <svg width="20" height="24" viewBox="0 0 20 24" fill="none" className="ml-0.5">
              <path d="M2 2L18 12L2 22V2Z" fill="white" />
            </svg>
          </button>
        )}

        {status !== 'idle' && (
          <button onClick={onSkip}
            className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer"
            style={{ backgroundColor: `${colors.from}15`, color: `${colors.from}99` }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 2L10 8L2 14V2Z" fill="currentColor" />
              <rect x="11" y="2" width="3" height="12" rx="0.5" fill="currentColor" />
            </svg>
          </button>
        )}
        </div>

        {/* Abandon button — visible but secondary, hover turns red */}
        {status !== 'idle' && (
          <button
            onClick={onAbandon}
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 cursor-pointer hover:border-red-400/60 hover:text-red-400/90 hover:bg-red-400/15 active:scale-95"
            style={{ color: theme.textMuted, borderColor: `${theme.text}25`, backgroundColor: `${theme.text}10` }}
          >
            {t.abandon}
          </button>
        )}
      </div>
    </div>
  );
}
