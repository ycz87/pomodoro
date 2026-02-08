import { useTheme } from '../hooks/useTheme';

interface RoundProgressProps {
  current: number; // completed in this round
  total: number;   // pomodoros per round
  idle: boolean;   // hide/dim when not started
}

export function RoundProgress({ current, total, idle }: RoundProgressProps) {
  const theme = useTheme();

  // Hide completely when idle and nothing completed
  if (idle && current === 0) return null;

  return (
    <div className={`flex items-center gap-2.5 transition-opacity duration-300 ${
      idle ? 'opacity-40' : 'opacity-100'
    }`}>
      <div className="flex items-center gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className="inline-block w-2 h-2 rounded-full transition-all duration-300"
            style={{
              backgroundColor: i < current ? theme.accent : theme.textFaint,
              transform: i < current ? 'scale(1.1)' : 'scale(1)',
            }}
          />
        ))}
      </div>
      <span className="text-xs tabular-nums" style={{ color: theme.textFaint }}>
        {current}/{total}
      </span>
    </div>
  );
}
