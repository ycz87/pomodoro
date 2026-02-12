import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../hooks/useTheme';

interface ToastProps {
  message: string | null;
  durationMs?: number;
  className?: string;
}

export function Toast({ message, durationMs = 3500, className = '' }: ToastProps) {
  const theme = useTheme();
  const [visible, setVisible] = useState(false);
  const [renderedMessage, setRenderedMessage] = useState<string | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const unmountTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    if (unmountTimerRef.current) clearTimeout(unmountTimerRef.current);

    if (!message) {
      setVisible(false);
      setRenderedMessage(null);
      return;
    }

    setRenderedMessage(message);
    setVisible(true);

    const fadeOutMs = 300;
    const visibleDurationMs = Math.max(durationMs - fadeOutMs, 1200);

    hideTimerRef.current = setTimeout(() => {
      setVisible(false);
    }, visibleDurationMs);

    unmountTimerRef.current = setTimeout(() => {
      setRenderedMessage(null);
    }, visibleDurationMs + fadeOutMs);

    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      if (unmountTimerRef.current) clearTimeout(unmountTimerRef.current);
    };
  }, [message, durationMs]);

  if (!renderedMessage) return null;

  return (
    <div
      className={`text-xs font-medium px-3 py-1.5 rounded-full z-20 transition-all duration-300 mt-2 ${className}`}
      style={{
        backgroundColor: `${theme.surface}ee`,
        color: theme.textMuted,
        border: `1px solid ${theme.border}`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(8px)',
      }}
    >
      {renderedMessage}
    </div>
  );
}
