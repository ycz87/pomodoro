/**
 * ProjectRecoveryModal — 中断恢复提示
 */
import { useTheme } from '../hooks/useTheme';
import { useI18n } from '../i18n';

interface Props {
  onRecover: () => void;
  onDiscard: () => void;
}

export function ProjectRecoveryModal({ onRecover, onDiscard }: Props) {
  const theme = useTheme();
  const t = useI18n();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" />
      <div className="relative w-full max-w-sm rounded-2xl border shadow-2xl p-6 flex flex-col gap-4 animate-fade-up"
        style={{ backgroundColor: theme.surface, borderColor: theme.textFaint }}>
        <div className="text-center">
          <div className="text-2xl mb-2">📋</div>
          <h3 className="text-base font-medium" style={{ color: theme.text }}>
            {t.projectRecoveryTitle}
          </h3>
          <p className="text-sm mt-1" style={{ color: theme.textMuted }}>
            {t.projectRecoveryDesc}
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={onDiscard}
            className="flex-1 py-2.5 rounded-xl text-sm transition-all cursor-pointer"
            style={{ backgroundColor: theme.inputBg, color: theme.textMuted }}>
            {t.projectRecoveryDiscard}
          </button>
          <button onClick={onRecover}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer"
            style={{ backgroundColor: `${theme.accent}20`, color: theme.accent }}>
            {t.projectRecoveryResume}
          </button>
        </div>
      </div>
    </div>
  );
}
