import { useRef } from 'react';
import { useTheme } from '../hooks/useTheme';
import { useI18n } from '../i18n';

interface TaskInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

export function TaskInput({ value, onChange, disabled }: TaskInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const theme = useTheme();
  const t = useI18n();

  return (
    <div className="w-full max-w-xs sm:max-w-sm px-4">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 border ${
          disabled ? 'opacity-50' : ''
        }`}
        style={{
          backgroundColor: disabled ? 'transparent' : theme.inputBg,
          borderColor: disabled ? 'transparent' : theme.border,
          boxShadow: disabled ? 'none' : 'inset 0 1px 2px rgba(0,0,0,0.2)',
        }}
      >
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder={t.taskPlaceholder}
          className="flex-1 bg-transparent outline-none text-[15px] min-w-0 task-input-placeholder"
          style={{ color: theme.text, '--placeholder-color': theme.textMuted } as React.CSSProperties}
          maxLength={100}
          onFocus={(e) => {
            const parent = e.currentTarget.parentElement;
            if (parent) parent.style.borderColor = `${theme.accent}66`;
          }}
          onBlur={(e) => {
            const parent = e.currentTarget.parentElement;
            if (parent) parent.style.borderColor = theme.border;
          }}
        />
        {value && !disabled && (
          <button
            onClick={() => onChange('')}
            className="hover:opacity-70 transition-opacity shrink-0 cursor-pointer"
            style={{ color: theme.textFaint }}
            aria-label={t.clearTask}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 3L11 11M11 3L3 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
