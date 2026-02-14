/**
 * FarmPage — 农场占位页（Coming Soon）
 */
import { useTheme } from '../hooks/useTheme';
import { useI18n } from '../i18n';

export function FarmPage() {
  const theme = useTheme();
  const t = useI18n();

  return (
    <div className="flex-1 flex flex-col items-center justify-center w-full px-4">
      <span className="text-6xl mb-4">🌱</span>
      <span className="text-lg font-medium" style={{ color: theme.textMuted }}>
        {t.farmComingSoon}
      </span>
    </div>
  );
}
