interface RoundProgressProps {
  current: number; // completed in this round
  total: number;   // pomodoros per round
}

export function RoundProgress({ current, total }: RoundProgressProps) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`text-sm transition-all duration-300 ${
            i < current ? 'scale-110' : 'opacity-30 grayscale'
          }`}
        >
          {i < current ? '🍅' : '○'}
        </span>
      ))}
    </div>
  );
}
