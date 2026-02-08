import type { PomodoroRecord } from '../types';

interface TaskListProps {
  records: PomodoroRecord[];
}

export function TaskList({ records }: TaskListProps) {
  if (records.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-white/20 text-[15px]">准备好了吗？</p>
        <p className="text-white/12 text-sm mt-1.5">开始你的第一个番茄钟 🍅</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xs sm:max-w-sm space-y-1">
      <h3 className="text-white/25 text-xs tracking-wider px-1 mb-2 font-medium uppercase">
        今日记录
      </h3>
      <div className="space-y-0.5">
        {records.map((record, index) => {
          const time = new Date(record.completedAt);
          const timeStr = `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`;

          return (
            <div
              key={record.id}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors hover:bg-white/[0.03] animate-fade-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <span className="text-xs">🍅</span>
              <span className="flex-1 text-white/50 text-sm truncate">
                {record.task || '未命名任务'}
              </span>
              <span className="text-white/15 text-xs font-timer tabular-nums">{timeStr}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
