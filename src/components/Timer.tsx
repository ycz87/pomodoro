import { useEffect, useRef, useState, useCallback } from 'react';
import type { TimerPhase, TimerStatus } from '../hooks/useTimer';
import type { GrowthStage } from '../types';
import { formatTime } from '../utils/time';
import { useTheme } from '../hooks/useTheme';
import { useI18n } from '../i18n';
import { CelebrationOverlay } from './CelebrationOverlay';

const QUICK_DURATIONS = [5, 10, 15, 20, 25, 30, 45, 60];
const ACTION_DEBOUNCE_MS = 300;

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

  // Bug 2 fix: debounce ✓ and ✗ to prevent race conditions
  const actionLockRef = useRef(false);
  const actionLockTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const guardedAction = useCallback((fn: () => void) => {
    if (actionLockRef.current) return;
    actionLockRef.current = true;
    fn();
    actionLockTimer.current = setTimeout(() => { actionLockRef.current = false; }, ACTION_DEBOUNCE_MS);
  }, []);

  useEffect(() => {
    return () => { if (actionLockTimer.current) clearTimeout(actionLockTimer.current); };
  }, []);

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
    : t.phaseShortBreak;

  return (
    <div ref={containerRef} className="flex flex-col items-center relative">
      {/* Celebration overlay */}
      {celebrating && celebrationStage && (
        <CelebrationOverlay
          stage={celebrationStage}
          isRipe={celebrationIsRipe}
          onComplete={onCelebrationComplete}
        />
      )}

      {/* Phase indicator — capsule label */}
      <div
        className="text-sm font-semibold tracking-widest transition-all duration-500 rounded-full"
        style={{
          color: isOvertime ? '#ef4444' : isWork ? theme.accent : theme.breakAccent,
          backgroundColor: isOvertime ? 'rgba(239,68,68,0.12)' : isWork ? `${theme.accent}1f` : `${theme.breakAccent}1f`,
          padding: '6px 14px',
          fontSize: '14px',
          fontWeight: 600,
        }}
      >
        {phaseLabel}
      </div>

      {/* Circular timer */}
      <div className="relative w-[260px] h-[260px] sm:w-[320px] sm:h-[320px] flex items-center justify-center overflow-visible mt-4">
        <svg className={`absolute inset-0 overflow-visible ${celebrating ? 'animate-ring-pulse' : ''} ${isOvertime ? 'animate-ring-pulse' : ''}`} viewBox={`0 0 ${size} ${size}`} overflow="visible" style={{ filter: `drop-shadow(0 0 12px ${colors.from}40)` }}>
          <defs>
            <linearGradient id="grad-progress" gradientUnits="userSpaceOnUse"
              x1={center} y1="0" x2={size} y2={size}>
              <stop offset="0%" stopColor={colors.from} />
              <stop offset="50%" stopColor={colors.mid} />
              <stop offset="100%" stopColor={colors.to} />
            </linearGradient>
            <linearGradient id="grad-base" gradientUnits="userSpaceOnUse"
              x1={center} y1="0" x2={size} y2={size}>
              <stop offset="0%" stopColor={colors.from} stopOpacity="0.20" />
              <stop offset="100%" stopColor={colors.mid} stopOpacity="0.08" />
            </linearGradient>
            <filter id="glow-head" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feFlood floodColor={colors.mid} floodOpacity="0.8" />
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
            fill="none" stroke="url(#grad-base)" strokeWidth="8"
            transform={`rotate(-90 ${center} ${center})`}
          />

          <circle
            cx={center} cy={center} r={radius}
            fill="none" stroke="url(#grad-progress)" strokeWidth="8"
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
          style={{ fontWeight: 300, color: isOvertime ? '#ef4444' : theme.text, fontVariantNumeric: 'tabular-nums' }}
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
            style={{ backgroundColor: `${theme.surface}f0`, borderColor: theme.border }}>
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

      {/* Controls */}
      <div className="flex items-center gap-3 sm:gap-4 h-16 mt-6">

        {/* ✗ Abandon/Skip (left) — hidden during idle and break */}
        {status !== 'idle' && isWork && (
          <button onClick={() => guardedAction(onAbandon)}
            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
            style={{ backgroundColor: `${theme.textMuted}15`, color: theme.textMuted }}
            title={t.abandon}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 2L12 12M12 2L2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        )}

        {/* ▶ Start — idle only */}
        {status === 'idle' && (
          <button onClick={onStart}
            className="w-[52px] h-[52px] min-w-[52px] min-h-[52px] rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
            style={{ background: `linear-gradient(135deg, ${colors.from}, ${colors.to})`, boxShadow: `0 2px 12px ${colors.from}30` }}>
            <svg width="18" height="22" viewBox="0 0 20 24" fill="none" className="ml-0.5">
              <path d="M2 2L18 12L2 22V2Z" fill="white" />
            </svg>
          </button>
        )}

        {/* ⏸ Pause (center) */}
        {status === 'running' && (
          <button onClick={onPause}
            className="w-[52px] h-[52px] min-w-[52px] min-h-[52px] rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer border"
            style={{ backgroundColor: `${colors.from}20`, borderColor: `${colors.from}40` }}>
            <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
              <rect x="1" y="1" width="4.5" height="18" rx="1.5" fill={colors.from} fillOpacity="0.7" />
              <rect x="10.5" y="1" width="4.5" height="18" rx="1.5" fill={colors.from} fillOpacity="0.7" />
            </svg>
          </button>
        )}

        {/* ▶ Resume (center) */}
        {status === 'paused' && (
          <button onClick={onResume}
            className="w-[52px] h-[52px] min-w-[52px] min-h-[52px] rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
            style={{ background: `linear-gradient(135deg, ${colors.from}, ${colors.to})`, boxShadow: `0 2px 12px ${colors.from}30` }}>
            <svg width="18" height="22" viewBox="0 0 20 24" fill="none" className="ml-0.5">
              <path d="M2 2L18 12L2 22V2Z" fill="white" />
            </svg>
          </button>
        )}

        {/* ✓ Complete/Skip (right) — hidden during idle */}
        {status !== 'idle' && (
          <button onClick={() => guardedAction(onSkip)}
            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
            style={{ backgroundColor: `${colors.from}20`, color: colors.from }}
            title={t.projectMarkDone}>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
              <path d="M1.5 6L6 10.5L14.5 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
