/**
 * AlertPickerModal — 提醒音效选择弹窗
 * 列出所有可用提醒音，点击试听 + 选中
 */
import { useEffect } from 'react';
import { useTheme } from '../hooks/useTheme';
import { useI18n } from '../i18n';
import type { AlertSoundId } from '../audio';
import { ALL_ALERT_IDS, playAlertOnce } from '../audio';

interface Props {
  selected: AlertSoundId;
  onSelect: (id: AlertSoundId) => void;
  onClose: () => void;
}

export function AlertPickerModal({ selected, onSelect, onClose }: Props) {
  const theme = useTheme();
  const i18n = useI18n();

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full max-w-sm max-h-[70vh] rounded-2xl border shadow-2xl overflow-hidden flex flex-col animate-fade-up"
        style={{ backgroundColor: theme.surface, borderColor: theme.textFaint }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b shrink-0"
          style={{ borderColor: theme.textFaint }}>
          <h2 className="text-base font-medium" style={{ color: theme.text }}>
            🔔 {i18n.alertSound}
          </h2>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer"
            style={{ color: theme.textMuted, backgroundColor: theme.inputBg }}>
            ✕
          </button>
        </div>

        {/* Sound grid */}
        <div className="flex-1 overflow-y-auto px-5 py-3">
          <div className="grid grid-cols-2 gap-2">
            {ALL_ALERT_IDS.map((id) => {
              const isActive = selected === id;
              return (
                <button
                  key={id}
                  onClick={() => {
                    onSelect(id);
                    playAlertOnce(id);
                  }}
                  className="flex items-center gap-2 px-3 py-3 rounded-xl text-sm transition-all cursor-pointer text-left"
                  style={{
                    backgroundColor: isActive ? `${theme.accent}20` : theme.inputBg,
                    color: isActive ? theme.accent : theme.textMuted,
                    borderWidth: '1.5px',
                    borderStyle: 'solid',
                    borderColor: isActive ? `${theme.accent}40` : 'transparent',
                  }}>
                  <span className="text-base">{i18n.alertNames[id].split(' ')[0]}</span>
                  <span className="truncate">{i18n.alertNames[id].split(' ').slice(1).join(' ')}</span>
                  {isActive && (
                    <span className="ml-auto text-xs">✓</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t shrink-0" style={{ borderColor: theme.textFaint }}>
          <button onClick={onClose}
            className="w-full py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer"
            style={{ backgroundColor: `${theme.accent}20`, color: theme.accent }}>
            {i18n.modalDone}
          </button>
        </div>
      </div>
    </div>
  );
}
