/**
 * MarketPage — 商城页面（买入 / 卖出）
 *
 * 买入 Tab 支持常驻道具购买与地块扩展，卖出 Tab 支持西瓜售卖。
 */
import { useMemo, useState } from 'react';
import { useTheme } from '../hooks/useTheme';
import type { Messages } from '../i18n/types';
import { VARIETY_DEFS } from '../types/farm';
import type { CollectedVariety, VarietyId } from '../types/farm';
import type { ShopItemDef, ShopItemId } from '../types/market';
import { SHOP_ITEMS, PLOT_PRICES } from '../types/market';
import { ConfirmModal } from './ConfirmModal';

interface MarketPageProps {
  balance: number;
  collection: CollectedVariety[];
  onSellVariety: (varietyId: VarietyId) => void;
  onBuyItem: (itemId: ShopItemId) => void;
  onBuyPlot: (plotIndex: number) => void;
  unlockedPlotCount: number;
  messages: Messages;
}

type MarketTab = 'buy' | 'sell';

interface SellableVariety {
  varietyId: VarietyId;
  name: string;
  emoji: string;
  count: number;
  sellPrice: number;
}

type PendingPurchase =
  | { type: 'item'; item: ShopItemDef }
  | { type: 'plot'; plotIndex: number; price: number };

export function MarketPage(props: MarketPageProps) {
  const theme = useTheme();
  const { balance, collection, onSellVariety, onBuyItem, onBuyPlot, unlockedPlotCount, messages } = props;
  const [activeTab, setActiveTab] = useState<MarketTab>('buy');
  const [pendingSellId, setPendingSellId] = useState<VarietyId | null>(null);
  const [pendingPurchase, setPendingPurchase] = useState<PendingPurchase | null>(null);
  const [recentBoughtItemId, setRecentBoughtItemId] = useState<ShopItemId | null>(null);

  const sellableVarieties = useMemo<SellableVariety[]>(() => {
    return collection.flatMap((entry) => {
      const def = VARIETY_DEFS[entry.varietyId];
      if (!def || entry.count <= 0 || def.sellPrice <= 0) return [];
      return [{
        varietyId: entry.varietyId,
        name: messages.varietyName(entry.varietyId),
        emoji: def.emoji,
        count: entry.count,
        sellPrice: def.sellPrice,
      }];
    });
  }, [collection, messages]);

  const pendingVariety = useMemo(() => {
    if (!pendingSellId) return null;
    return sellableVarieties.find((item) => item.varietyId === pendingSellId) ?? null;
  }, [pendingSellId, sellableVarieties]);

  const handleConfirmSell = () => {
    if (!pendingVariety) {
      setPendingSellId(null);
      return;
    }
    onSellVariety(pendingVariety.varietyId);
    setPendingSellId(null);
  };

  const buyablePlots = useMemo(() => {
    return Object.entries(PLOT_PRICES)
      .map(([index, price]) => ({
        plotIndex: Number(index),
        price,
      }))
      .sort((a, b) => a.plotIndex - b.plotIndex);
  }, []);

  const handleConfirmPurchase = () => {
    if (!pendingPurchase) return;

    if (pendingPurchase.type === 'item') {
      if (balance < pendingPurchase.item.price) {
        setPendingPurchase(null);
        return;
      }
      onBuyItem(pendingPurchase.item.id);
      setRecentBoughtItemId(pendingPurchase.item.id);
      window.setTimeout(() => setRecentBoughtItemId((prev) => (
        prev === pendingPurchase.item.id ? null : prev
      )), 1000);
      setPendingPurchase(null);
      return;
    }

    const { plotIndex, price } = pendingPurchase;
    if (balance < price || unlockedPlotCount > plotIndex) {
      setPendingPurchase(null);
      return;
    }
    onBuyPlot(plotIndex);
    setPendingPurchase(null);
  };

  return (
    <div className="w-full max-w-xs sm:max-w-sm px-4 pt-4 pb-6">
      <div
        className="rounded-2xl p-5 border"
        style={{ backgroundColor: theme.surface, borderColor: theme.border }}
      >
        <div className="mb-4 flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold" style={{ color: theme.text }}>{messages.marketTitle}</h2>
          <div
            className="text-sm font-semibold px-3 py-1.5 rounded-full"
            style={{ backgroundColor: theme.inputBg, color: '#fbbf24' }}
          >
            💰 {balance}
          </div>
        </div>

        <div className="mb-4 relative flex items-center rounded-full p-[3px]" style={{ backgroundColor: theme.inputBg }}>
          <div
            className="absolute top-[3px] bottom-[3px] rounded-full transition-all duration-200 ease-out"
            style={{
              backgroundColor: theme.border,
              width: 'calc(50% - 3px)',
              left: activeTab === 'buy' ? '3px' : 'calc(50%)',
            }}
          />
          <button
            onClick={() => setActiveTab('buy')}
            className="relative z-10 px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors duration-200 cursor-pointer flex-1"
            style={{ color: activeTab === 'buy' ? theme.text : theme.textMuted }}
          >
            {messages.marketTabBuy}
          </button>
          <button
            onClick={() => setActiveTab('sell')}
            className="relative z-10 px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors duration-200 cursor-pointer flex-1"
            style={{ color: activeTab === 'sell' ? theme.text : theme.textMuted }}
          >
            {messages.marketTabSell}
          </button>
        </div>

        {activeTab === 'buy' && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              {SHOP_ITEMS.map((item) => {
                const affordable = balance >= item.price;
                const itemName = messages.itemName(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => setPendingPurchase({ type: 'item', item })}
                    disabled={!affordable}
                    className="w-full p-3 rounded-xl border transition-all text-left disabled:cursor-not-allowed cursor-pointer"
                    style={{
                      backgroundColor: theme.inputBg,
                      borderColor: theme.border,
                      opacity: affordable ? 1 : 0.55,
                    }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xl">{item.emoji}</span>
                        <div className="text-sm font-medium truncate" style={{ color: theme.text }}>
                          {itemName}
                        </div>
                      </div>
                      <div className="shrink-0 flex items-center gap-2">
                        {recentBoughtItemId === item.id && (
                          <span className="text-sm animate-bounce" style={{ color: '#10b981' }}>✅</span>
                        )}
                        <span
                          className="text-sm font-semibold"
                          style={{ color: affordable ? '#fbbf24' : '#ef4444' }}
                        >
                          {item.price} 💰
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-4 border-t" style={{ borderColor: theme.border }}>
              <h3 className="text-sm font-semibold mb-2" style={{ color: theme.text }}>
                {messages.marketPlotSection}
              </h3>
              <div className="flex flex-col gap-2">
                {buyablePlots.map((plot) => {
                  const unlocked = unlockedPlotCount > plot.plotIndex;
                  const affordable = balance >= plot.price;
                  const disabled = unlocked || !affordable;
                  return (
                    <button
                      key={plot.plotIndex}
                      onClick={() => setPendingPurchase({ type: 'plot', plotIndex: plot.plotIndex, price: plot.price })}
                      disabled={disabled}
                      className="w-full p-3 rounded-xl border transition-all text-left disabled:cursor-not-allowed cursor-pointer"
                      style={{
                        backgroundColor: theme.inputBg,
                        borderColor: theme.border,
                        opacity: disabled ? 0.6 : 1,
                      }}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm font-medium" style={{ color: theme.text }}>
                          {messages.marketPlotName(plot.plotIndex)}
                        </div>
                        {unlocked ? (
                          <div className="text-sm font-medium" style={{ color: '#10b981' }}>{messages.marketPlotUnlocked}</div>
                        ) : (
                          <div
                            className="text-sm font-semibold"
                            style={{ color: affordable ? '#fbbf24' : '#ef4444' }}
                          >
                            {plot.price} 💰
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sell' && (
          <>
            {sellableVarieties.length === 0 ? (
              <div
                className="text-sm text-center py-10 rounded-xl border"
                style={{ color: theme.textMuted, borderColor: theme.border, backgroundColor: theme.inputBg }}
              >
                {messages.marketSellEmpty}
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {sellableVarieties.map((item) => (
                  <button
                    key={item.varietyId}
                    onClick={() => setPendingSellId(item.varietyId)}
                    className="w-full p-3 rounded-xl border cursor-pointer transition-all text-left"
                    style={{ backgroundColor: theme.inputBg, borderColor: theme.border }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xl">{item.emoji}</span>
                        <div className="min-w-0">
                          <div className="text-sm font-medium truncate" style={{ color: theme.text }}>
                            {item.name}
                          </div>
                          <div className="text-xs" style={{ color: theme.textMuted }}>
                            {messages.marketSellOwned(item.count)}
                          </div>
                        </div>
                      </div>
                      <div className="shrink-0 text-sm font-semibold" style={{ color: '#fbbf24' }}>
                        {item.sellPrice} 💰
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {pendingVariety && (
        <ConfirmModal
          title={messages.marketSellConfirmTitle}
          message={messages.marketSellConfirmMessage(pendingVariety.name, pendingVariety.sellPrice)}
          confirmText={messages.marketSellConfirmButton}
          cancelText={messages.marketSellCancelButton}
          onConfirm={handleConfirmSell}
          onCancel={() => setPendingSellId(null)}
        />
      )}

      {pendingPurchase && (
        <ConfirmModal
          title={pendingPurchase.type === 'item' ? messages.marketBuyConfirmTitle : messages.marketPlotConfirmTitle}
          message={
            pendingPurchase.type === 'item'
              ? messages.marketBuyConfirmMessage(
                messages.itemName(pendingPurchase.item.id),
                pendingPurchase.item.price,
                balance,
              )
              : messages.marketPlotConfirmMessage(
                messages.marketPlotName(pendingPurchase.plotIndex),
                pendingPurchase.price,
                balance,
              )
          }
          confirmText={messages.marketBuyConfirmButton}
          cancelText={messages.marketBuyCancelButton}
          onConfirm={handleConfirmPurchase}
          onCancel={() => setPendingPurchase(null)}
        />
      )}
    </div>
  );
}
