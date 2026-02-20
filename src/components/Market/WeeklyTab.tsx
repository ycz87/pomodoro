/**
 * WeeklyTab — Weekly special offers tab in market.
 *
 * Shows:
 * - Countdown to next Monday 00:00 UTC refresh
 * - Weekly item cards
 * - Purchase button with sold-out/insufficient balance states
 */
import { useEffect, useMemo, useState } from 'react';
import { useTheme } from '../../hooks/useTheme';
import type { Messages } from '../../i18n/types';
import type { WeeklyItem, WeeklyShop } from '../../types/market';
import { getWeeklyCountdownParts } from '../../utils/weeklyShop';

interface WeeklyTabProps {
  balance: number;
  shop: WeeklyShop;
  messages: Messages;
  onBuyItem: (itemId: string) => void;
}

function getWeeklyItemDisplayName(item: WeeklyItem, messages: Messages): string {
  if (item.type === 'rare-gene-fragment') {
    const stars = item.data.rarity === 'legendary' ? 4 : 3;
    return messages.marketWeeklyGeneName(messages.varietyName(item.data.varietyId), stars);
  }
  if (item.type === 'legendary-seed') {
    return messages.marketWeeklySeedName(messages.varietyName(item.data.varietyId));
  }
  return messages.marketWeeklyDecorationName(item.data.decorationId);
}

function getWeeklyItemTypeLabel(item: WeeklyItem, messages: Messages): string {
  if (item.type === 'rare-gene-fragment') return messages.marketWeeklyTypeRareGene;
  if (item.type === 'legendary-seed') return messages.marketWeeklyTypeLegendarySeed;
  return messages.marketWeeklyTypeDecoration;
}

export function WeeklyTab(props: WeeklyTabProps) {
  const { balance, shop, messages, onBuyItem } = props;
  const theme = useTheme();
  const [nowTimestamp, setNowTimestamp] = useState(() => Date.now());

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setNowTimestamp(Date.now());
    }, 60 * 1000);
    return () => window.clearInterval(timerId);
  }, []);

  const countdown = useMemo(
    () => getWeeklyCountdownParts(shop.refreshAt, nowTimestamp),
    [shop.refreshAt, nowTimestamp],
  );

  return (
    <div className="flex flex-col gap-4">
      <div
        className="rounded-xl border p-3"
        style={{
          backgroundColor: theme.inputBg,
          borderColor: theme.border,
        }}
      >
        <div className="text-sm font-semibold" style={{ color: theme.text }}>
          {messages.marketWeeklyTitle}
        </div>
        <div className="text-xs mt-1" style={{ color: theme.textMuted }}>
          {messages.marketWeeklyRefreshIn(countdown.days, countdown.hours)}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {shop.items.map((item) => {
          const soldOut = item.stock <= 0;
          const affordable = balance >= item.price;
          const disabled = soldOut || !affordable;
          const itemName = getWeeklyItemDisplayName(item, messages);
          const itemTypeLabel = getWeeklyItemTypeLabel(item, messages);

          return (
            <div
              key={item.id}
              className="h-full rounded-xl border p-3 flex flex-col"
              style={{
                backgroundColor: theme.inputBg,
                borderColor: theme.border,
                opacity: soldOut ? 0.65 : 1,
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <span className="text-3xl leading-none">{item.data.emoji}</span>
              <div className="mt-2 min-w-0">
                <div className="text-sm font-semibold truncate" style={{ color: theme.text }}>
                  {itemName}
                </div>
                <div className="text-xs mt-1 truncate" style={{ color: theme.textMuted }}>
                  {itemTypeLabel}
                </div>
              </div>
              <div className="mt-3 text-sm font-semibold" style={{ color: affordable ? '#fbbf24' : '#ef4444' }}>
                {item.price} 💰
              </div>
              <span className="mt-1 text-xs" style={{ color: theme.textMuted }}>
                {messages.marketWeeklyStock(item.stock)}
              </span>
              <button
                onClick={() => onBuyItem(item.id)}
                disabled={disabled}
                className="mt-3 w-full px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer disabled:cursor-not-allowed"
                style={{
                  backgroundColor: disabled ? theme.border : `${theme.accent}22`,
                  color: disabled ? theme.textMuted : theme.accent,
                }}
              >
                {soldOut ? messages.marketWeeklySoldOut : messages.marketWeeklyBuyButton}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
