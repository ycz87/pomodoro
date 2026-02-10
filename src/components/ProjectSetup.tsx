/**
 * ProjectSetup — 项目创建 + 子任务编辑
 */
import { useState, useCallback } from 'react';
import { useTheme } from '../hooks/useTheme';
import { useI18n } from '../i18n';
import type { ProjectTask } from '../types/project';

interface Props {
  onStart: (name: string, tasks: ProjectTask[]) => void;
  onCancel: () => void;
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function createEmptyTask(): ProjectTask {
  return { id: generateId(), name: '', estimatedMinutes: 25, breakMinutes: 5 };
}

export function ProjectSetup({ onStart, onCancel }: Props) {
  const theme = useTheme();
  const t = useI18n();
  const [name, setName] = useState('');
  const [tasks, setTasks] = useState<ProjectTask[]>([createEmptyTask()]);
  const [editingBreak, setEditingBreak] = useState<string | null>(null);

  const addTask = useCallback(() => {
    setTasks((prev) => [...prev, createEmptyTask()]);
  }, []);

  const updateTask = useCallback((id: string, patch: Partial<ProjectTask>) => {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, ...patch } : t));
  }, []);

  const removeTask = useCallback((id: string) => {
    setTasks((prev) => prev.length > 1 ? prev.filter((t) => t.id !== id) : prev);
  }, []);

  const moveTask = useCallback((index: number, direction: -1 | 1) => {
    setTasks((prev) => {
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= prev.length) return prev;
      const arr = [...prev];
      [arr[index], arr[newIndex]] = [arr[newIndex], arr[index]];
      return arr;
    });
  }, []);

  const canStart = name.trim().length > 0 && tasks.some((t) => t.name.trim().length > 0);

  const handleStart = () => {
    const validTasks = tasks.filter((t) => t.name.trim().length > 0);
    if (validTasks.length === 0) return;
    onStart(name.trim(), validTasks);
  };

  const totalEstimated = tasks.reduce((sum, t) => sum + (t.name.trim() ? t.estimatedMinutes : 0), 0);
  const totalBreak = tasks.slice(0, -1).reduce((sum, t) => sum + (t.name.trim() ? t.breakMinutes : 0), 0);

  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-4 px-4">
      {/* Project name */}
      <div>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t.projectNamePlaceholder}
          className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-colors"
          style={{ backgroundColor: theme.inputBg, color: theme.text }}
          autoFocus
        />
      </div>

      {/* Task list */}
      <div className="flex flex-col gap-2">
        <div className="text-xs font-medium uppercase tracking-wider"
          style={{ color: theme.textMuted }}>
          {t.projectTasks}
        </div>

        {tasks.map((task, index) => (
          <div key={task.id}
            className="flex flex-col gap-1.5 p-3 rounded-xl transition-colors"
            style={{ backgroundColor: theme.inputBg }}>
            <div className="flex items-center gap-2">
              {/* Index */}
              <span className="text-xs font-medium w-5 text-center shrink-0"
                style={{ color: theme.textMuted }}>
                {index + 1}
              </span>

              {/* Task name */}
              <input
                type="text"
                value={task.name}
                onChange={(e) => updateTask(task.id, { name: e.target.value })}
                placeholder={t.projectTaskPlaceholder}
                className="flex-1 px-2 py-1.5 rounded-lg text-sm outline-none bg-transparent"
                style={{ color: theme.text }}
              />

              {/* Estimated time */}
              <div className="flex items-center gap-1 shrink-0">
                <input
                  type="number"
                  value={task.estimatedMinutes}
                  onChange={(e) => {
                    const v = parseInt(e.target.value, 10);
                    if (!isNaN(v) && v > 0 && v <= 240) updateTask(task.id, { estimatedMinutes: v });
                  }}
                  className="w-12 px-1 py-1 rounded-lg text-xs text-center outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  style={{ backgroundColor: `${theme.surface}`, color: theme.text }}
                />
                <span className="text-xs" style={{ color: theme.textMuted }}>{t.minutes}</span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-0.5 shrink-0">
                <button onClick={() => moveTask(index, -1)}
                  className="w-6 h-6 rounded flex items-center justify-center text-xs cursor-pointer transition-colors"
                  style={{ color: index === 0 ? theme.textFaint : theme.textMuted }}
                  disabled={index === 0}>↑</button>
                <button onClick={() => moveTask(index, 1)}
                  className="w-6 h-6 rounded flex items-center justify-center text-xs cursor-pointer transition-colors"
                  style={{ color: index === tasks.length - 1 ? theme.textFaint : theme.textMuted }}
                  disabled={index === tasks.length - 1}>↓</button>
                <button onClick={() => removeTask(task.id)}
                  className="w-6 h-6 rounded flex items-center justify-center text-xs cursor-pointer transition-colors"
                  style={{ color: tasks.length <= 1 ? theme.textFaint : theme.textMuted }}
                  disabled={tasks.length <= 1}>✕</button>
              </div>
            </div>

            {/* Break time (expandable) */}
            {index < tasks.length - 1 && (
              <div className="flex items-center gap-2 ml-7">
                <button
                  onClick={() => setEditingBreak(editingBreak === task.id ? null : task.id)}
                  className="text-xs cursor-pointer transition-colors"
                  style={{ color: theme.textMuted }}>
                  ☕ {task.breakMinutes}{t.minutes}
                </button>
                {editingBreak === task.id && (
                  <input
                    type="number"
                    value={task.breakMinutes}
                    onChange={(e) => {
                      const v = parseInt(e.target.value, 10);
                      if (!isNaN(v) && v >= 0 && v <= 60) updateTask(task.id, { breakMinutes: v });
                    }}
                    className="w-12 px-1 py-0.5 rounded text-xs text-center outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    style={{ backgroundColor: theme.surface, color: theme.text }}
                    autoFocus
                  />
                )}
              </div>
            )}
          </div>
        ))}

        {/* Add task button */}
        <button onClick={addTask}
          className="w-full py-2 rounded-xl text-sm transition-all cursor-pointer border border-dashed"
          style={{ borderColor: theme.border, color: theme.textMuted }}>
          + {t.projectAddTask}
        </button>
      </div>

      {/* Summary */}
      {totalEstimated > 0 && (
        <div className="text-xs text-center" style={{ color: theme.textMuted }}>
          {t.projectEstimatedTotal}: {totalEstimated}{t.minutes}
          {totalBreak > 0 && ` + ${t.projectBreakTotal} ${totalBreak}${t.minutes}`}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button onClick={onCancel}
          className="flex-1 py-2.5 rounded-xl text-sm transition-all cursor-pointer"
          style={{ backgroundColor: theme.inputBg, color: theme.textMuted }}>
          {t.projectCancel}
        </button>
        <button onClick={handleStart}
          className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${canStart ? 'cursor-pointer' : 'opacity-40'}`}
          style={{ backgroundColor: `${theme.accent}20`, color: theme.accent }}
          disabled={!canStart}>
          {t.projectStart}
        </button>
      </div>
    </div>
  );
}
