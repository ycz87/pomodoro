import { useRef, useEffect } from 'react';

interface TaskInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

export function TaskInput({ value, onChange, disabled }: TaskInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled]);

  return (
    <div className="w-full max-w-xs sm:max-w-sm px-4">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
          disabled
            ? 'bg-white/[0.02] opacity-50'
            : 'bg-white/[0.04] focus-within:bg-white/[0.07]'
        }`}
      >
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="这个番茄钟要做什么？"
          className="flex-1 bg-transparent text-white/90 placeholder-white/20 outline-none text-[15px] min-w-0"
          maxLength={100}
        />
        {value && !disabled && (
          <button
            onClick={() => onChange('')}
            className="text-white/15 hover:text-white/40 transition-colors shrink-0 cursor-pointer"
            aria-label="清除"
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
