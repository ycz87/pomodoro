import { useState } from 'react';
import type { PomodoroRecord } from '../types';
import { getGrowthStage, GROWTH_EMOJI } from '../types';

interface TaskListProps {
  records: PomodoroRecord[];
  onUpdate: (id: string, task: string) => void;
  onDelete: (id: string) => void;
}

export function TaskList({ records, onUpdate, onDelete }: TaskListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  if (records.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-white/20 text-[15px]">准备好了吗？</p>
        <p className="text-white/12 text-sm mt-1.5">开始你的第一个番茄钟 🌱</p>
      </div>
    );
  }

  const startEdit = (record: PomodoroRecord) => {
    setEditingId(record.id);
    setEditValue(record.task);
  };

  const saveEdit = () => {
    if (editingId) {
      onUpdate(editingId, editValue);
      setEditingId(null);
    }
  };

  return (
    <div className="w-full max-w-xs sm:max-w-sm space-y-1">
      <h3 className="text-white/25 text-xs tracking-wider px-1 mb-2 font-medium uppercase">
        今日记录
      </h3>
      <div className="space-y-0.5">
        {records.map((record, index) => {
          const time = new Date(record.completedAt);
          const timeStr = `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`;
          const duration = record.durationMinutes || 25;
          const stage = getGrowthStage(duration);
          const isEditing = editingId === record.id;

          return (
            <div
              key={record.id}
              className="group flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors hover:bg-white/[0.03] animate-fade-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Growth stage icon */}
              <span className="text-sm shrink-0" title={`${duration}分钟`}>
                {GROWTH_EMOJI[stage]}
              </span>

              {/* Task name — editable */}
              {isEditing ? (
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={saveEdit}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveEdit();
                    if (e.key === 'Escape') setEditingId(null);
                  }}
                  autoFocus
                  className="flex-1 bg-white/[0.06] text-white/80 text-sm rounded-md px-2 py-0.5 outline-none focus:bg-white/[0.10] min-w-0"
                  maxLength={100}
                />
              ) : (
                <span
                  className="flex-1 text-white/50 text-sm truncate cursor-pointer hover:text-white/70 transition-colors"
                  onClick={() => startEdit(record)}
                  title="点击编辑"
                >
                  {record.task || '未命名任务'}
                </span>
              )}

              {/* Duration */}
              <span className="text-white/20 text-xs shrink-0">
                {duration}min
              </span>

              {/* Time */}
              <span className="text-white/15 text-xs font-timer tabular-nums shrink-0">
                {timeStr}
              </span>

              {/* Delete button — visible on hover */}
              {!isEditing && (
                <button
                  onClick={() => onDelete(record.id)}
                  className="opacity-0 group-hover:opacity-100 text-white/15 hover:text-red-400/60 transition-all cursor-pointer shrink-0"
                  aria-label="删除"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 2L10 10M10 2L2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
