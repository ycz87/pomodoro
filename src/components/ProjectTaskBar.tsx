/**
 * ProjectTaskBar — 项目模式计时时显示在 Timer 上方的任务信息条
 * 显示：项目名 + 当前任务名 + 进度 + 超时提示
 */
import { useTheme } from '../hooks/useTheme';
import { useI18n } from '../i18n';
import type { ProjectTimerView } from '../hooks/useProjectTimer';

interface Props {
  projectName: string;
  view: ProjectTimerView;
  onComplete: () => void;
  onContinueOvertime: () => void;
}

export function ProjectTaskBar({ projectName, view, onComplete, onContinueOvertime }: Props) {
  const theme = useTheme();
  const t = useI18n();

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
            style={{ width: `${view.progressFraction * 100}%`, backgroundColor: theme.accent }} />
        </div>
        <span className="text-xs shrink-0 tabular-nums" style={{ color: theme.textFaint }}>
          {view.progressLabel}
        </span>
      </div>

      {/* Current task name */}
      {view.phase === 'work' && (
        <div className="text-sm font-medium truncate max-w-full" style={{ color: theme.text }}>
          {view.taskName}
        </div>
      )}

      {/* Overtime prompt */}
      {view.showOvertimePrompt && (
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs px-2 py-0.5 rounded-full animate-pulse"
            style={{ backgroundColor: '#ef444420', color: '#ef4444' }}>
            ⏰ {t.projectOvertime}
          </span>
          <button onClick={onContinueOvertime}
            className="text-xs px-2 py-0.5 rounded-full cursor-pointer transition-colors"
            style={{ backgroundColor: theme.inputBg, color: theme.textMuted }}>
            {t.projectContinue}
          </button>
          <button onClick={onComplete}
            className="text-xs px-2 py-0.5 rounded-full cursor-pointer transition-colors font-medium"
            style={{ backgroundColor: `${theme.accent}20`, color: theme.accent }}>
            ✓ {t.projectMarkDone}
          </button>
        </div>
      )}
    </div>
  );
}
