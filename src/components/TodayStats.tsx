interface TodayStatsProps {
  count: number;
}

export function TodayStats({ count }: TodayStatsProps) {
  if (count === 0) return null;

  // Show tomato icons for count (max 10 visible, then show +N)
  const maxVisible = 10;
  const visibleCount = Math.min(count, maxVisible);
  const overflow = count - maxVisible;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="text-white/30 text-xs tracking-wider font-medium uppercase">
        今日收获
      </div>
      <div className="flex items-center gap-1.5 flex-wrap justify-center">
        {Array.from({ length: visibleCount }).map((_, i) => (
          <span
            key={i}
            className="text-lg animate-bounce-in"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            🍅
          </span>
        ))}
        {overflow > 0 && (
          <span className="text-white/30 text-sm font-medium ml-1">
            +{overflow}
          </span>
        )}
      </div>
    </div>
  );
}
