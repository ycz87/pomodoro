import { useState } from 'react';
import type { PomodoroSettings, SoundType } from '../types';
import { WORK_OPTIONS, SHORT_BREAK_OPTIONS, LONG_BREAK_OPTIONS } from '../types';
import { playNotificationSound } from '../utils/notification';

interface SettingsProps {
  settings: PomodoroSettings;
  onChange: (settings: PomodoroSettings) => void;
  disabled: boolean; // disable when timer is running
}

function OptionRow({ label, options, value, onChange, unit = '分钟' }: {
  label: string;
  options: number[];
  value: number;
  onChange: (v: number) => void;
  unit?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-white/40 text-xs tracking-wider uppercase">{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-all cursor-pointer ${
              value === opt
                ? 'bg-white/15 text-white font-medium'
                : 'bg-white/[0.04] text-white/40 hover:bg-white/[0.08] hover:text-white/60'
            }`}
          >
            {opt}{unit}
          </button>
        ))}
      </div>
    </div>
  );
}

const SOUND_LABELS: Record<SoundType, string> = {
  chime: '🎵 和弦',
  bell: '🔔 铃声',
  nature: '🌿 自然',
};

export function Settings({ settings, onChange, disabled }: SettingsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const update = (patch: Partial<PomodoroSettings>) => {
    onChange({ ...settings, ...patch });
  };

  return (
    <div className="relative">
      {/* Gear icon toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
          isOpen
            ? 'bg-white/10 text-white/60'
            : 'bg-transparent text-white/20 hover:text-white/40'
        }`}
        aria-label="设置"
      >
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="10" cy="10" r="3" />
          <path d="M10 1.5v2M10 16.5v2M1.5 10h2M16.5 10h2M3.4 3.4l1.4 1.4M15.2 15.2l1.4 1.4M3.4 16.6l1.4-1.4M15.2 4.8l1.4-1.4" />
        </svg>
      </button>

      {/* Settings panel */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-72 sm:w-80 p-5 rounded-2xl bg-[#1a1a20] border border-white/[0.08] shadow-2xl shadow-black/50 z-50 animate-fade-up">
          <div className="flex flex-col gap-5">
            {disabled && (
              <div className="text-amber-400/70 text-xs">
                ⏸ 暂停或完成当前番茄钟后可修改设置
              </div>
            )}

            <OptionRow
              label="专注时长"
              options={WORK_OPTIONS}
              value={settings.workMinutes}
              onChange={(v) => !disabled && update({ workMinutes: v })}
            />

            <OptionRow
              label="短休息"
              options={SHORT_BREAK_OPTIONS}
              value={settings.shortBreakMinutes}
              onChange={(v) => !disabled && update({ shortBreakMinutes: v })}
            />

            <OptionRow
              label="长休息"
              options={LONG_BREAK_OPTIONS}
              value={settings.longBreakMinutes}
              onChange={(v) => !disabled && update({ longBreakMinutes: v })}
            />

            {/* Sound selection */}
            <div className="flex flex-col gap-2">
              <div className="text-white/40 text-xs tracking-wider uppercase">提醒音效</div>
              <div className="flex gap-1.5">
                {(Object.keys(SOUND_LABELS) as SoundType[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      update({ sound: s });
                      playNotificationSound(s);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-all cursor-pointer ${
                      settings.sound === s
                        ? 'bg-white/15 text-white font-medium'
                        : 'bg-white/[0.04] text-white/40 hover:bg-white/[0.08] hover:text-white/60'
                    }`}
                  >
                    {SOUND_LABELS[s]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
