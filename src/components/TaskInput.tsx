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
    <div className="w-full max-w-sm sm:max-w-md px-2">
      <div
        className={`relative flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all duration-200 focus-within:border-white/30 focus-within:bg-white/10 ${
          disabled
            ? 'border-white/5 bg-white/[0.02] opacity-60'
            : 'border-white/10 bg-white/5'
        }`}
      >
        <span className="text-white/30 text-base shrink-0">📝</span>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="正在做什么？"
          className="flex-1 bg-transparent text-white placeholder-white/25 outline-none text-base min-w-0"
          maxLength={100}
        />
        {value && !disabled && (
          <button
            onClick={() => onChange('')}
            className="text-white/20 hover:text-white/50 transition-colors text-sm shrink-0 cursor-pointer"
            aria-label="清除"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
