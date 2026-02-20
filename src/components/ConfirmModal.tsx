/**
 * ConfirmModal — 通用确认弹窗
 * 用于番茄钟退出确认等场景
 * v0.4.6: min-h-[44px] for stable mobile touch targets
 */
import { useTheme } from '../hooks/useTheme';

interface Props {
  title: string;
  message?: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
}

export function ConfirmModal({ title, message, confirmText, cancelText, onConfirm, onCancel, danger }: Props) {
  const theme = useTheme();
  const accentColor = danger ? '#ef4444' : theme.accent;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4" data-modal-overlay>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onCancel} />
      <div className="relative w-full max-w-xs rounded-2xl p-5 animate-fade-up"
        style={{ backgroundColor: theme.surface }}>
        <h3 className="text-base font-semibold mb-2" style={{ color: theme.text }}>{title}</h3>
        {message && (
          <p className="text-sm mb-4" style={{ color: theme.textMuted }}>{message}</p>
        )}
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 min-h-[44px] py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer whitespace-nowrap"
            style={{ backgroundColor: theme.inputBg, color: theme.textMuted }}>
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 min-h-[44px] py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer whitespace-nowrap"
            style={{ backgroundColor: `${accentColor}20`, color: accentColor }}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
