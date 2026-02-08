import type { PomodoroRecord } from '../types';
import { getGrowthStage } from '../types';
import { useTheme } from '../hooks/useTheme';
import { GrowthIcon } from './GrowthIcon';

interface TodayStatsProps {
  records: PomodoroRecord[];
}

export function TodayStats({ records }: TodayStatsProps) {
  const theme = useTheme();

  if (records.length === 0) return null;

  const totalMinutes = records.reduce((sum, r) => sum + (r.durationMinutes || 25), 0);
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  const timeStr = hours > 0 ? `${hours}小时${mins > 0 ? ` ${mins}分钟` : ''}` : `${mins}分钟`;

  // Show growth icons (max 12 visible, then +N)
  const maxVisible = 12;
  const visibleRecords = records.slice(0, maxVisible);
  const overflow = records.length - maxVisible;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="text-xs tracking-wider font-medium uppercase"
        style={{ color: theme.textMuted }}>
        今日收获
      </div>
      <div className="flex items-center gap-1 flex-wrap justify-center">
        {visibleRecords.map((record, i) => {
          const stage = getGrowthStage(record.durationMinutes || 25);
          return (
            <span
              key={record.id}
              className="animate-bounce-in"
              style={{ animationDelay: `${i * 60}ms` }}
              title={`${record.task || '未命名'} · ${record.durationMinutes || 25}分钟`}
            >
              <GrowthIcon stage={stage} size={20} />
            </span>
          );
        })}
        {overflow > 0 && (
          <span className="text-sm font-medium ml-1" style={{ color: theme.textMuted }}>
            +{overflow}
          </span>
        )}
      </div>
      <div className="text-xs" style={{ color: theme.textFaint }}>
        共专注 {timeStr}
      </div>
    </div>
  );
}
