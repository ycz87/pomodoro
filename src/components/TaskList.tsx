import { useState } from 'react';
import type { PomodoroRecord } from '../types';
import { getGrowthStage } from '../types';
import { useTheme } from '../hooks/useTheme';
import { useI18n } from '../i18n';
import { GrowthIcon } from './GrowthIcon';

interface TaskListProps {
  records: PomodoroRecord[];
  onUpdate: (id: string, task: string) => void;
  onDelete: (id: string) => void;
}

export function TaskList({ records, onUpdate, onDelete }: TaskListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);
  const theme = useTheme();
  const t = useI18n();

  if (records.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-xs" style={{ color: theme.textFaint }}>🌱 {t.emptyTodayHint}</p>
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

  const handleDeleteClick = (id: string) => {
    if (confirmingDeleteId === id) {
      // Second click — confirm delete
      onDelete(id);
      setConfirmingDeleteId(null);
    } else {
      // First click — enter confirm state
      setConfirmingDeleteId(id);
      // Auto-reset after 2.5 seconds
      setTimeout(() => setConfirmingDeleteId((prev) => prev === id ? null : prev), 2500);
    }
  };

  return (
    <div className="w-full max-w-xs sm:max-w-sm space-y-1">
      <h3 className="text-xs tracking-wider px-1 mb-2 font-medium uppercase"
        style={{ color: theme.textMuted }}>
        {t.todayRecords}
      </h3>
      <div className="space-y-0.5">
        {records.map((record, index) => {
          const time = new Date(record.completedAt);
          const timeStr = `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`;
          const duration = record.durationMinutes || 25;
          const stage = getGrowthStage(duration);
          const isEditing = editingId === record.id;
          const isConfirmingDelete = confirmingDeleteId === record.id;

          return (
            <div
              key={record.id}
              className="group flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors animate-fade-up"
              style={{ animationDelay: `${index * 50}ms`, backgroundColor: 'transparent' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.inputBg}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              {/* Growth stage icon */}
              <GrowthIcon stage={stage} size={20} className="shrink-0" />

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
                  className="flex-1 rounded-md px-2 py-0.5 outline-none text-sm min-w-0"
                  style={{ backgroundColor: theme.inputBg, color: theme.text }}
                  maxLength={100}
                />
              ) : (
                <span
                  className="flex-1 text-sm truncate cursor-pointer transition-colors"
                  style={{ color: theme.textMuted }}
                  onClick={() => startEdit(record)}
                  title={t.editHint}
                >
                  {record.task || t.unnamed}
                  {record.status === 'abandoned' && (
                    <span className="ml-1 opacity-50">✗</span>
                  )}
                </span>
              )}

              {/* Duration */}
              <span className="text-xs shrink-0" style={{ color: theme.textFaint }}>
                {duration}min
              </span>

              {/* Time */}
              <span className="text-xs font-timer tabular-nums shrink-0" style={{ color: theme.textFaint }}>
                {timeStr}
              </span>

              {/* Delete button — inline confirm */}
              {!isEditing && (
                <button
                  onClick={() => handleDeleteClick(record.id)}
                  className={`shrink-0 transition-all cursor-pointer ${
                    isConfirmingDelete
                      ? 'opacity-100 text-xs px-1.5 py-0.5 rounded'
                      : 'opacity-0 group-hover:opacity-100'
                  }`}
                  style={isConfirmingDelete
                    ? { color: '#ef4444', backgroundColor: 'rgba(239,68,68,0.1)' }
                    : { color: theme.textFaint }
                  }
                  aria-label="Delete"
                >
                  {isConfirmingDelete ? (
                    t.deleteConfirm
                  ) : (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 2L10 10M10 2L2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  )}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
