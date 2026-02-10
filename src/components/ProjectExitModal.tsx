/**
 * ProjectExitModal — 项目模式两步退出弹窗
 * Step 1: 确认退出当前任务 + 退出整个项目选项
 * Step 2: 选择下一步（重新开始/下一个/返回上一个）
 */
import { useState } from 'react';
import { useTheme } from '../hooks/useTheme';
import { useI18n } from '../i18n';

interface Props {
  taskName: string;
  isFirstTask: boolean;
  isLastTask: boolean;
  onCancel: () => void;
  onExitTask: () => void;       // Confirm exit current task
  onAbandonProject: () => void; // Exit entire project
  onRestart: () => void;        // Restart same task
  onNext: () => void;           // Go to next task (or finish project)
  onPrevious: () => void;       // Go back to previous task
}

type Step = 'confirm' | 'choose';

export function ProjectExitModal({
  taskName, isFirstTask, isLastTask,
  onCancel, onExitTask, onAbandonProject,
  onRestart, onNext, onPrevious,
}: Props) {
  const [step, setStep] = useState<Step>('confirm');
  const theme = useTheme();
  const t = useI18n();

  if (step === 'confirm') {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center px-4" data-modal-overlay>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
        <div className="relative w-full max-w-xs rounded-2xl p-5 animate-fade-up"
          style={{ backgroundColor: theme.surface }}>
          <h3 className="text-base font-semibold mb-1" style={{ color: theme.text }}>
            {t.projectExitConfirmTitle}
          </h3>
          <p className="text-sm mb-4 truncate" style={{ color: theme.textMuted }}>
            {taskName}
          </p>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => { onExitTask(); setStep('choose'); }}
              className="w-full py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer"
              style={{ backgroundColor: `${theme.accent}20`, color: theme.accent }}>
              {t.projectExitConfirm}
            </button>
            <button
              onClick={onCancel}
              className="w-full py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer"
              style={{ backgroundColor: theme.inputBg, color: theme.textMuted }}>
              {t.cancel}
            </button>
            <div className="border-t my-1" style={{ borderColor: theme.border }} />
            <button
              onClick={onAbandonProject}
              className="w-full py-2 rounded-xl text-xs transition-all cursor-pointer"
              style={{ color: '#ef4444' }}>
              {t.projectExitAll}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Choose next action
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4" data-modal-overlay>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative w-full max-w-xs rounded-2xl p-5 animate-fade-up"
        style={{ backgroundColor: theme.surface }}>
        <h3 className="text-base font-semibold mb-4" style={{ color: theme.text }}>
          {t.projectExitChooseTitle}
        </h3>
        <div className="flex flex-col gap-2">
          <button
            onClick={onRestart}
            className="w-full py-3 rounded-xl text-sm font-medium transition-all cursor-pointer flex items-center justify-center gap-2"
            style={{ backgroundColor: `${theme.accent}15`, color: theme.accent }}>
            🔄 {t.projectExitRestart}
          </button>
          <button
            onClick={onNext}
            className="w-full py-3 rounded-xl text-sm font-medium transition-all cursor-pointer flex items-center justify-center gap-2"
            style={{ backgroundColor: theme.inputBg, color: theme.text }}>
            ⏭️ {isLastTask ? t.projectExitFinish : t.projectExitNext}
          </button>
          {!isFirstTask && (
            <button
              onClick={onPrevious}
              className="w-full py-3 rounded-xl text-sm font-medium transition-all cursor-pointer flex items-center justify-center gap-2"
              style={{ backgroundColor: theme.inputBg, color: theme.textMuted }}>
              ⏮️ {t.projectExitPrevious}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
