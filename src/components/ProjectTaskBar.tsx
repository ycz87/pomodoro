/**
 * ProjectTaskBar — 项目模式计时时显示在 Timer 上方的任务信息条
 * 显示：项目名 + 当前任务名 + 进度
 */
import { useTheme } from '../hooks/useTheme';
import type { ProjectTimerView } from '../hooks/useProjectTimer';

interface Props {
  projectName: string;
  view: ProjectTimerView;
}

export function ProjectTaskBar({ projectName, view }: Props) {
  const theme = useTheme();
  const isBreak = view.phase === 'break';
  const progressColor = isBreak ? theme.breakAccent : theme.accent;

  return (
    <div className="w-full max-w-xs sm:max-w-sm flex flex-col items-center gap-2">
      {/* Project name + progress */}
      <div className="flex items-center gap-2 w-full">
        <span className="text-xs truncate" style={{ color: theme.textMuted }}>
          📋 {projectName}
        </span>
        <div className="flex-1 h-1 rounded-full overflow-hidden"
          style={{ backgroundColor: theme.inputBg }}>
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${view.progressFraction * 100}%`, backgroundColor: progressColor }} />
        </div>
        <span className="text-xs shrink-0 tabular-nums" style={{ color: theme.textMuted }}>
          {view.progressLabel}
        </span>
      </div>

      {/* Current task name */}
      {view.phase === 'work' && (
        <div className="text-sm font-medium truncate max-w-full" style={{ color: theme.text }}>
          {view.taskName}
        </div>
      )}
    </div>
  );
}
