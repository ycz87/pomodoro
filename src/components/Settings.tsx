/**
 * 设置面板 — 齿轮图标展开，包含所有用户可配置项
 * v2: 自定义混音器 + 提醒音效升级
 */
import { useState, useRef, useEffect } from 'react';
import type { PomodoroSettings, ThemeId } from '../types';
import { THEMES } from '../types';
import { setMasterAlertVolume, setMasterAmbienceVolume, getActiveSoundsSummary } from '../audio';
import type { AmbienceMixerConfig } from '../audio';
import { useTheme } from '../hooks/useTheme';
import { useI18n } from '../i18n';
import type { Locale } from '../i18n';
import { AmbienceMixerModal } from './AmbienceMixerModal';
import { AlertPickerModal } from './AlertPickerModal';

interface SettingsProps {
  settings: PomodoroSettings;
  onChange: (settings: PomodoroSettings) => void;
  disabled: boolean;
  onExport: () => void;
}

/** 开关组件 */
function Toggle({ label, checked, onChange }: {
  label: string; checked: boolean; onChange: (v: boolean) => void;
}) {
  const t = useTheme();
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="text-sm" style={{ color: t.textMuted }}>{label}</div>
      <button
        onClick={() => onChange(!checked)}
        className="relative w-10 h-5.5 rounded-full transition-colors duration-200 cursor-pointer"
        style={{ backgroundColor: checked ? `${t.accent}80` : t.inputBg }}
        role="switch"
        aria-checked={checked}
      >
        <span
          className="absolute top-0.5 left-0.5 w-4.5 h-4.5 rounded-full bg-white shadow transition-transform duration-200"
          style={{ transform: checked ? 'translateX(18px)' : 'translateX(0)' }}
        />
      </button>
    </div>
  );
}

/** 数字步进器 */
function NumberStepper({ label, value, onChange, min, max, step = 1, unit, disabled }: {
  label: string; value: number; onChange: (v: number) => void;
  min: number; max: number; step?: number; unit: string; disabled: boolean;
}) {
  const clamp = (v: number) => Math.min(max, Math.max(min, v));
  const inputRef = useRef<HTMLInputElement>(null);
  const t = useTheme();

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="text-sm" style={{ color: t.textMuted }}>{label}</div>
      <div className={`flex items-center gap-1 ${disabled ? 'opacity-40 pointer-events-none' : ''}`}>
        <button onClick={() => onChange(clamp(value - step))}
          className="w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer text-sm"
          style={{ backgroundColor: t.inputBg, color: t.textMuted }}>−</button>
        <input ref={inputRef} type="number" value={value}
          onChange={(e) => { const v = parseInt(e.target.value, 10); if (!isNaN(v)) onChange(clamp(v)); }}
          onBlur={() => { if (inputRef.current) { const v = parseInt(inputRef.current.value, 10); if (isNaN(v) || v < min) onChange(min); else if (v > max) onChange(max); } }}
          min={min} max={max}
          className="w-12 h-7 rounded-lg text-center text-sm outline-none transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          style={{ backgroundColor: t.inputBg, color: t.text }} />
        <button onClick={() => onChange(clamp(value + step))}
          className="w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer text-sm"
          style={{ backgroundColor: t.inputBg, color: t.textMuted }}>+</button>
        <span className="text-xs ml-0.5 w-8" style={{ color: t.textFaint }}>{unit}</span>
      </div>
    </div>
  );
}

/** 音量滑块 */
function VolumeSlider({ label, value, onChange }: {
  label: string; value: number; onChange: (v: number) => void;
}) {
  const t = useTheme();
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="text-sm shrink-0" style={{ color: t.textMuted }}>{label}</div>
      <div className="flex items-center gap-2 flex-1 max-w-[160px]">
        <input type="range" min={0} max={100} value={value}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
          className="flex-1 h-1 rounded-full appearance-none cursor-pointer accent-current"
          style={{ accentColor: t.accent }} />
        <span className="text-xs w-8 text-right tabular-nums" style={{ color: t.textFaint }}>{value}%</span>
      </div>
    </div>
  );
}

const REPEAT_OPTIONS = [1, 2, 3, 5];
const ROUND_OPTIONS = [2, 3, 4, 5, 6];
const LOCALE_LABELS: Record<Locale, string> = { zh: '中文', en: 'EN' };

export function Settings({ settings, onChange, disabled, onExport }: SettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showAmbienceModal, setShowAmbienceModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const i18n = useI18n();

  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

  const update = (patch: Partial<PomodoroSettings>) => {
    const next = { ...settings, ...patch };
    onChange(next);
    if ('alertVolume' in patch) setMasterAlertVolume(next.alertVolume);
    if ('ambienceVolume' in patch) setMasterAmbienceVolume(next.ambienceVolume);
  };

  const optBtn = (active: boolean) =>
    `px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer ${active ? 'font-medium' : ''}`;
  const optStyle = (active: boolean) => ({
    backgroundColor: active ? `${theme.accent}30` : theme.inputBg,
    color: active ? theme.accent : theme.textMuted,
  });

  // Theme labels from i18n
  const themeLabels: Record<ThemeId, string> = {
    dark: i18n.themeDark,
    light: i18n.themeLight,
    forest: i18n.themeForest,
    ocean: i18n.themeOcean,
    warm: i18n.themeWarm,
  };

  // Ambience summary text
  const ambienceSummary = getActiveSoundsSummary(settings.ambienceMixer, i18n.ambienceNames);

  return (
    <>
      <div className="relative" ref={panelRef}>
        <button onClick={() => setIsOpen(!isOpen)}
          className="w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer"
          style={{ color: isOpen ? theme.textMuted : theme.textFaint }}
          aria-label={i18n.settings}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute right-0 top-12 w-[calc(100vw-1.5rem)] sm:w-80 p-4 sm:p-5 rounded-2xl border shadow-2xl z-50 animate-fade-up max-h-[75vh] overflow-y-auto"
            style={{ backgroundColor: theme.surface, borderColor: theme.textFaint }}>
            <div className="flex flex-col gap-4">
              {disabled && (
                <div className="text-xs" style={{ color: '#fbbf24' }}>{i18n.timerRunningHint}</div>
              )}

              {/* 时长设置 */}
              <NumberStepper label={i18n.workDuration} value={settings.workMinutes}
                onChange={(v) => update({ workMinutes: v })} min={1} max={120} disabled={disabled} unit={i18n.minutes} />
              <NumberStepper label={i18n.shortBreak} value={settings.shortBreakMinutes}
                onChange={(v) => update({ shortBreakMinutes: v })} min={1} max={30} disabled={disabled} unit={i18n.minutes} />
              <NumberStepper label={i18n.longBreak} value={settings.longBreakMinutes}
                onChange={(v) => update({ longBreakMinutes: v })} min={1} max={60} disabled={disabled} unit={i18n.minutes} />

              <div className="flex items-center justify-between gap-3">
                <div className={`text-sm ${disabled ? 'opacity-40' : ''}`} style={{ color: theme.textMuted }}>{i18n.longBreakInterval}</div>
                <div className={`flex gap-1 ${disabled ? 'opacity-40 pointer-events-none' : ''}`}>
                  {ROUND_OPTIONS.map((n) => (
                    <button key={n} onClick={() => update({ pomodorosPerRound: n })}
                      className={optBtn(settings.pomodorosPerRound === n)}
                      style={optStyle(settings.pomodorosPerRound === n)}>{n}</button>
                  ))}
                </div>
              </div>

              {/* 自动开始 */}
              <Toggle label={i18n.autoStartBreak} checked={settings.autoStartBreak}
                onChange={(v) => update({ autoStartBreak: v })} />
              <Toggle label={i18n.autoStartWork} checked={settings.autoStartWork}
                onChange={(v) => update({ autoStartWork: v })} />

              <div className="border-t" style={{ borderColor: theme.textFaint }} />

              {/* ── 提醒音效 ── */}
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm" style={{ color: theme.textMuted }}>{i18n.alertSound}</div>
                <div className="flex items-center gap-2">
                  <span className="text-xs truncate max-w-[100px]" style={{ color: theme.text }}>
                    {i18n.alertNames[settings.alertSound]}
                  </span>
                  <button
                    onClick={() => setShowAlertModal(true)}
                    className="px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer"
                    style={{ backgroundColor: `${theme.accent}20`, color: theme.accent }}>
                    {i18n.alertCustomize}
                  </button>
                </div>
              </div>

              {/* 循环次数 */}
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm" style={{ color: theme.textMuted }}>{i18n.alertRepeatCount}</div>
                <div className="flex gap-1">
                  {REPEAT_OPTIONS.map((n) => (
                    <button key={n} onClick={() => update({ alertRepeatCount: n })}
                      className={optBtn(settings.alertRepeatCount === n)}
                      style={optStyle(settings.alertRepeatCount === n)}>
                      {i18n.repeatTimes(n)}
                    </button>
                  ))}
                </div>
              </div>

              <VolumeSlider label={i18n.alertVolume} value={settings.alertVolume}
                onChange={(v) => update({ alertVolume: v })} />

              <div className="border-t" style={{ borderColor: theme.textFaint }} />

              {/* ── 专注背景音 ── */}
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm" style={{ color: theme.textMuted }}>{i18n.focusAmbience}</div>
                <div className="flex items-center gap-2">
                  <span className="text-xs truncate max-w-[120px]" style={{ color: ambienceSummary ? theme.text : theme.textFaint }}>
                    {ambienceSummary || i18n.ambienceOff}
                  </span>
                  <button
                    onClick={() => setShowAmbienceModal(true)}
                    className="px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer"
                    style={{ backgroundColor: `${theme.accent}20`, color: theme.accent }}>
                    {i18n.ambienceCustomize}
                  </button>
                </div>
              </div>

              {ambienceSummary && (
                <VolumeSlider label={i18n.ambienceVolume} value={settings.ambienceVolume}
                  onChange={(v) => update({ ambienceVolume: v })} />
              )}

              <div className="border-t" style={{ borderColor: theme.textFaint }} />

              {/* 主题选择 */}
              <div className="flex flex-col gap-2">
                <div className="text-sm" style={{ color: theme.textMuted }}>{i18n.theme}</div>
                <div className="flex flex-wrap gap-1.5">
                  {(Object.keys(THEMES) as ThemeId[]).map((id) => (
                    <button key={id} onClick={() => update({ theme: id })}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer"
                      style={{
                        backgroundColor: settings.theme === id ? `${THEMES[id].colors.accent}30` : theme.inputBg,
                        color: settings.theme === id ? THEMES[id].colors.accent : theme.textMuted,
                      }}>
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: THEMES[id].colors.accent }} />
                      {themeLabels[id]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t" style={{ borderColor: theme.textFaint }} />

              {/* 语言切换 */}
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm" style={{ color: theme.textMuted }}>{i18n.language}</div>
                <div className="flex gap-1.5">
                  {(Object.keys(LOCALE_LABELS) as Locale[]).map((loc) => (
                    <button key={loc} onClick={() => update({ language: loc })}
                      className={optBtn(settings.language === loc)}
                      style={optStyle(settings.language === loc)}>
                      {LOCALE_LABELS[loc]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t" style={{ borderColor: theme.textFaint }} />

              {/* 导出数据 */}
              <button
                onClick={onExport}
                className="w-full py-2 rounded-lg text-xs transition-all cursor-pointer"
                style={{ backgroundColor: theme.inputBg, color: theme.textMuted }}
              >
                {i18n.exportData}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals — rendered outside the settings panel */}
      {showAmbienceModal && (
        <AmbienceMixerModal
          config={settings.ambienceMixer}
          onChange={(mixer: AmbienceMixerConfig) => update({ ambienceMixer: mixer })}
          onClose={() => setShowAmbienceModal(false)}
        />
      )}
      {showAlertModal && (
        <AlertPickerModal
          selected={settings.alertSound}
          onSelect={(id) => update({ alertSound: id })}
          onClose={() => setShowAlertModal(false)}
        />
      )}
    </>
  );
}
