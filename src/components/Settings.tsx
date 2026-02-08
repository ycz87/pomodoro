import { useState, useRef, useEffect } from 'react';
import type { PomodoroSettings, SoundType, TickType } from '../types';
import { playNotificationSound, previewTickSound } from '../utils/notification';

interface SettingsProps {
  settings: PomodoroSettings;
  onChange: (settings: PomodoroSettings) => void;
  disabled: boolean;
}

function NumberStepper({ label, value, onChange, min, max, step = 1, unit = '分钟', disabled }: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  disabled: boolean;
}) {
  const clamp = (v: number) => Math.min(max, Math.max(min, v));
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="text-white/50 text-sm">{label}</div>
      <div className={`flex items-center gap-1 ${disabled ? 'opacity-40 pointer-events-none' : ''}`}>
        <button
          onClick={() => onChange(clamp(value - step))}
          className="w-7 h-7 rounded-lg bg-white/[0.06] text-white/40 hover:bg-white/[0.12] hover:text-white/70 flex items-center justify-center transition-all cursor-pointer text-sm"
        >−</button>
        <input
          ref={inputRef}
          type="number"
          value={value}
          onChange={(e) => {
            const v = parseInt(e.target.value, 10);
            if (!isNaN(v)) onChange(clamp(v));
          }}
          onBlur={() => {
            if (inputRef.current) {
              const v = parseInt(inputRef.current.value, 10);
              if (isNaN(v) || v < min) onChange(min);
              else if (v > max) onChange(max);
            }
          }}
          min={min} max={max}
          className="w-12 h-7 rounded-lg bg-white/[0.06] text-white text-center text-sm outline-none focus:bg-white/[0.10] transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <button
          onClick={() => onChange(clamp(value + step))}
          className="w-7 h-7 rounded-lg bg-white/[0.06] text-white/40 hover:bg-white/[0.12] hover:text-white/70 flex items-center justify-center transition-all cursor-pointer text-sm"
        >+</button>
        <span className="text-white/25 text-xs ml-0.5 w-8">{unit}</span>
      </div>
    </div>
  );
}

const SOUND_LABELS: Record<SoundType, string> = {
  chime: '🎵 和弦',
  bell: '🔔 铃声',
  nature: '🌿 自然',
};

const ALERT_DURATION_OPTIONS = [1, 3, 5, 10];

const TICK_LABELS: Record<TickType, string> = {
  none: '关闭',
  classic: '经典钟摆',
  soft: '轻柔滴答',
  mechanical: '机械钟表',
  wooden: '木质钟声',
};

const ROUND_OPTIONS = [2, 3, 4, 5, 6];

export function Settings({ settings, onChange, disabled }: SettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

  const update = (patch: Partial<PomodoroSettings>) => {
    onChange({ ...settings, ...patch });
  };

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
          isOpen ? 'bg-white/10 text-white/60' : 'bg-transparent text-white/20 hover:text-white/40'
        }`}
        aria-label="设置"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 w-72 sm:w-80 p-5 rounded-2xl bg-[#1a1a20] border border-white/[0.08] shadow-2xl shadow-black/50 z-50 animate-fade-up max-h-[70vh] overflow-y-auto">
          <div className="flex flex-col gap-4">
            {disabled && (
              <div className="text-amber-400/70 text-xs">
                ⏸ 计时中无法修改，暂停后可调整
              </div>
            )}

            {/* ── Timer durations ── */}
            <NumberStepper label="专注时长" value={settings.workMinutes}
              onChange={(v) => update({ workMinutes: v })} min={1} max={120} disabled={disabled} />
            <NumberStepper label="短休息" value={settings.shortBreakMinutes}
              onChange={(v) => update({ shortBreakMinutes: v })} min={1} max={30} disabled={disabled} />
            <NumberStepper label="长休息" value={settings.longBreakMinutes}
              onChange={(v) => update({ longBreakMinutes: v })} min={1} max={60} disabled={disabled} />

            {/* Pomodoros per round */}
            <div className="flex items-center justify-between gap-3">
              <div className={`text-white/50 text-sm ${disabled ? 'opacity-40' : ''}`}>长休息间隔</div>
              <div className={`flex gap-1 ${disabled ? 'opacity-40 pointer-events-none' : ''}`}>
                {ROUND_OPTIONS.map((n) => (
                  <button key={n} onClick={() => update({ pomodorosPerRound: n })}
                    className={`w-8 h-7 rounded-lg text-sm transition-all cursor-pointer ${
                      settings.pomodorosPerRound === n
                        ? 'bg-white/15 text-white font-medium'
                        : 'bg-white/[0.04] text-white/40 hover:bg-white/[0.08] hover:text-white/60'
                    }`}>{n}</button>
                ))}
              </div>
            </div>

            <div className="border-t border-white/[0.06]" />

            {/* ── Sound settings ── */}

            {/* Alert sound type */}
            <div className="flex items-center justify-between gap-3">
              <div className="text-white/50 text-sm">提醒音效</div>
              <div className="flex gap-1.5">
                {(Object.keys(SOUND_LABELS) as SoundType[]).map((s) => (
                  <button key={s}
                    onClick={() => { update({ sound: s }); playNotificationSound(s, 1); }}
                    className={`px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer ${
                      settings.sound === s
                        ? 'bg-white/15 text-white font-medium'
                        : 'bg-white/[0.04] text-white/40 hover:bg-white/[0.08] hover:text-white/60'
                    }`}>{SOUND_LABELS[s]}</button>
                ))}
              </div>
            </div>

            {/* Alert duration */}
            <div className="flex items-center justify-between gap-3">
              <div className="text-white/50 text-sm">提醒时长</div>
              <div className="flex gap-1">
                {ALERT_DURATION_OPTIONS.map((d) => (
                  <button key={d} onClick={() => update({ alertDurationSeconds: d })}
                    className={`px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer ${
                      settings.alertDurationSeconds === d
                        ? 'bg-white/15 text-white font-medium'
                        : 'bg-white/[0.04] text-white/40 hover:bg-white/[0.08] hover:text-white/60'
                    }`}>{d}秒</button>
                ))}
              </div>
            </div>

            <div className="border-t border-white/[0.06]" />

            {/* Tick-tock background sound */}
            <div className="flex flex-col gap-2">
              <div className="text-white/50 text-sm">专注背景音</div>
              <div className="flex flex-wrap gap-1.5">
                {(Object.keys(TICK_LABELS) as TickType[]).map((t) => (
                  <button key={t}
                    onClick={() => { update({ tickSound: t }); previewTickSound(t); }}
                    className={`px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer ${
                      settings.tickSound === t
                        ? 'bg-white/15 text-white font-medium'
                        : 'bg-white/[0.04] text-white/40 hover:bg-white/[0.08] hover:text-white/60'
                    }`}>{TICK_LABELS[t]}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
