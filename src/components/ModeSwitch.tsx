/**
 * ModeSwitch — iOS-style Segmented Control for Pomodoro / Project mode
 */
import { useTheme } from '../hooks/useTheme';
import { useI18n } from '../i18n';
import type { AppMode } from '../types/project';

interface Props {
  mode: AppMode;
  onChange: (mode: AppMode) => void;
  disabled?: boolean;
}

export function ModeSwitch({ mode, onChange, disabled }: Props) {
  const theme = useTheme();
  const t = useI18n();

  return (
    <div
      className="relative flex items-center rounded-full p-[3px]"
      style={{ backgroundColor: theme.inputBg }}
    >
      {/* Sliding indicator */}
      <div
        className="absolute top-[3px] bottom-[3px] rounded-full transition-all duration-200 ease-out"
        style={{
          backgroundColor: theme.border,
          width: 'calc(50% - 3px)',
          left: mode === 'pomodoro' ? '3px' : 'calc(50%)',
        }}
      />
      <button
        onClick={() => !disabled && onChange('pomodoro')}
        className={`relative z-10 px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors duration-200 ${disabled ? 'opacity-50' : 'cursor-pointer'}`}
        style={{
          color: mode === 'pomodoro' ? theme.text : theme.textMuted,
        }}
      >
        🍉 {t.modePomodoro}
      </button>
      <button
        onClick={() => !disabled && onChange('project')}
        className={`relative z-10 px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors duration-200 ${disabled ? 'opacity-50' : 'cursor-pointer'}`}
        style={{
          color: mode === 'project' ? theme.text : theme.textMuted,
        }}
      >
        📋 {t.modeProject}
      </button>
    </div>
  );
}
