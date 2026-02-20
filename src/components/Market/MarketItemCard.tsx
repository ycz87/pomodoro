/**
 * MarketItemCard — 商城 Buy Tab 统一卡片组件。
 *
 * 展示道具/地块的图标、名称、简述、价格与购买按钮。
 * 仅负责视觉与交互触发，不包含具体购买逻辑。
 */
import type { ThemeColors } from '../../types';

interface MarketItemCardProps {
  icon: string;
  name: string;
  description: string;
  priceText: string;
  actionText: string;
  disabled?: boolean;
  onAction: () => void;
  theme: ThemeColors;
}

export function MarketItemCard(props: MarketItemCardProps) {
  const {
    icon,
    name,
    description,
    priceText,
    actionText,
    disabled = false,
    onAction,
    theme,
  } = props;

  return (
    <div
      className={`h-full rounded-[var(--radius-card)] border p-3 flex flex-col shadow-[var(--shadow-card)] transition-all duration-200 ease-out ${
        disabled ? '' : 'hover:scale-[1.02] hover:shadow-[0_14px_28px_rgba(0,0,0,0.3)]'
      }`}
      style={{
        backgroundColor: theme.inputBg,
        borderColor: theme.border,
        opacity: disabled ? 0.68 : 1,
      }}
    >
      <div className="text-3xl leading-none">{icon}</div>

      <div className="mt-2 text-sm font-semibold leading-5" style={{ color: theme.text }}>
        {name}
      </div>

      <div
        className="mt-1 text-xs leading-5 min-h-10"
        style={{
          color: theme.textMuted,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {description}
      </div>

      <div className="mt-3 text-sm font-semibold" style={{ color: disabled ? theme.textMuted : '#fbbf24' }}>
        {priceText}
      </div>

      <button
        type="button"
        onClick={onAction}
        disabled={disabled}
        className="mt-3 w-full rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200 ease-out cursor-pointer disabled:cursor-not-allowed"
        style={{
          backgroundColor: disabled ? theme.border : theme.accent,
          color: disabled ? theme.textMuted : '#ffffff',
        }}
      >
        {actionText}
      </button>
    </div>
  );
}
