interface TodayStatsProps {
  count: number;
}

export function TodayStats({ count }: TodayStatsProps) {
  return (
    <div className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
      <div className="text-3xl" role="img" aria-label="番茄">🍅</div>
      <div>
        <div className="text-white/40 text-xs uppercase tracking-wider font-medium">今日完成</div>
        <div className="text-white text-2xl font-semibold tabular-nums">
          {count}
          <span className="text-sm font-normal text-white/30 ml-1">个番茄钟</span>
        </div>
      </div>
    </div>
  );
}
