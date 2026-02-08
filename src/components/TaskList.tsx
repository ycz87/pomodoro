import type { PomodoroRecord } from '../types';

interface TaskListProps {
  records: PomodoroRecord[];
}

export function TaskList({ records }: TaskListProps) {
  if (records.length === 0) {
    return (
      <div className="text-center text-white/20 py-6">
        <p className="text-base">还没有完成的番茄钟</p>
        <p className="text-sm mt-1 text-white/15">开始你的第一个番茄钟吧</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm sm:max-w-md space-y-1.5">
      <h3 className="text-white/30 text-xs uppercase tracking-wider px-1 mb-2 font-medium">
        今日记录
      </h3>
      <div className="space-y-1">
        {records.map((record, index) => {
          const time = new Date(record.completedAt);
          const timeStr = `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`;

          return (
            <div
              key={record.id}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] transition-colors hover:bg-white/[0.04]"
              style={{
                animationDelay: `${index * 50}ms`,
              }}
            >
              <span className="text-red-500/40 text-sm">●</span>
              <span className="flex-1 text-white/60 text-sm truncate">
                {record.task || '未命名任务'}
              </span>
              <span className="text-white/20 text-xs font-mono tabular-nums">{timeStr}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
