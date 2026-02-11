/**
 * WarehousePage — 仓库页面（收获物展示 + 合成系统）
 *
 * 全屏 overlay，显示 6 种收获物 + 数量，合成入口，简单统计。
 * 金西瓜未获得时显示 🔒 + "???"。
 */
import { useState, useCallback } from 'react';
import { useTheme } from '../hooks/useTheme';
import { useI18n } from '../i18n';
import type { GrowthStage, SynthesisRecipe } from '../types';
import type { Warehouse } from '../types';
import { SYNTHESIS_RECIPES } from '../types';
import { GrowthIcon } from './GrowthIcon';

interface WarehousePageProps {
  warehouse: Warehouse;
  onSynthesize: (recipe: SynthesisRecipe, count?: number) => boolean;
  onSynthesizeAll: (recipe: SynthesisRecipe) => number;
  highestStage: GrowthStage | null;
  onClose: () => void;
}

const DISPLAY_ORDER: GrowthStage[] = ['seed', 'sprout', 'bloom', 'green', 'ripe', 'legendary'];

function getStageName(stage: GrowthStage, t: ReturnType<typeof useI18n>): string {
  const map: Record<GrowthStage, string> = {
    seed: t.stageNameSeed,
    sprout: t.stageNameSprout,
    bloom: t.stageNameBloom,
    green: t.stageNameGreen,
    ripe: t.stageNameRipe,
    legendary: t.stageNameLegendary,
  };
  return map[stage];
}

export function WarehousePage({ warehouse, onSynthesize, onSynthesizeAll, highestStage, onClose }: WarehousePageProps) {
  const theme = useTheme();
  const t = useI18n();
  const [toast, setToast] = useState<string | null>(null);
  const [synthAnim, setSynthAnim] = useState<string | null>(null); // recipe.from key for animation

  const legendaryUnlocked = warehouse.items.legendary > 0;

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  }, []);

  const handleSynthesize = useCallback((recipe: SynthesisRecipe) => {
    setSynthAnim(recipe.from);
    setTimeout(() => {
      const ok = onSynthesize(recipe);
      setSynthAnim(null);
      if (ok) showToast(t.synthesisSuccess(getStageName(recipe.to, t)));
    }, 600);
  }, [onSynthesize, showToast, t]);

  const handleSynthesizeAll = useCallback((recipe: SynthesisRecipe) => {
    setSynthAnim(recipe.from);
    setTimeout(() => {
      const count = onSynthesizeAll(recipe);
      setSynthAnim(null);
      if (count > 0) showToast(`${t.synthesisSuccess(getStageName(recipe.to, t))} x${count}`);
    }, 600);
  }, [onSynthesizeAll, showToast, t]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
      <div
        className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border p-5 mx-4 animate-fade-up"
        style={{ backgroundColor: theme.surface, borderColor: theme.border }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold" style={{ color: theme.text }}>{t.warehouseTitle}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
            style={{ color: theme.textMuted, backgroundColor: theme.inputBg }}
          >✕</button>
        </div>

        {/* Items grid */}
        {warehouse.totalCollected === 0 ? (
          <div className="text-center py-8 text-sm" style={{ color: theme.textMuted }}>
            {t.warehouseEmpty}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3 mb-5">
            {DISPLAY_ORDER.map((stage) => {
              const isLegendary = stage === 'legendary';
              const locked = isLegendary && !legendaryUnlocked;
              const count = warehouse.items[stage];
              return (
                <div
                  key={stage}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all"
                  style={{
                    backgroundColor: locked ? theme.inputBg : count > 0 ? `${theme.accent}08` : theme.inputBg,
                    borderColor: count > 0 && !locked ? `${theme.accent}30` : theme.border,
                    opacity: locked ? 0.5 : 1,
                  }}
                >
                  {locked ? (
                    <span className="text-2xl">🔒</span>
                  ) : (
                    <GrowthIcon stage={stage} size={36} />
                  )}
                  <span className="text-xs font-medium" style={{ color: locked ? theme.textFaint : theme.textMuted }}>
                    {locked ? t.warehouseLockedName : getStageName(stage, t)}
                  </span>
                  <span className="text-sm font-semibold" style={{ color: locked ? theme.textFaint : theme.text }}>
                    {locked ? '—' : `×${count}`}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between px-2 py-3 mb-5 rounded-xl" style={{ backgroundColor: theme.inputBg }}>
          <div className="text-xs" style={{ color: theme.textMuted }}>
            {t.warehouseTotal}: <span style={{ color: theme.text, fontWeight: 600 }}>{warehouse.totalCollected}</span>
          </div>
          <div className="text-xs" style={{ color: theme.textMuted }}>
            {t.warehouseHighest}: <span style={{ color: theme.text, fontWeight: 600 }}>
              {highestStage ? getStageName(highestStage, t) : '—'}
            </span>
          </div>
          {legendaryUnlocked && (
            <div className="text-xs" style={{ color: '#fbbf24', fontWeight: 600 }}>
              👑 {t.legendaryUnlocked}
            </div>
          )}
        </div>

        {/* Synthesis */}
        <div className="mb-2">
          <h3 className="text-sm font-semibold mb-3" style={{ color: theme.text }}>{t.synthesisTitle}</h3>
          <div className="flex flex-col gap-2.5">
            {SYNTHESIS_RECIPES.map((recipe) => {
              const available = warehouse.items[recipe.from];
              const canMake = Math.floor(available / recipe.cost);
              const isAnimating = synthAnim === recipe.from;
              return (
                <div
                  key={`${recipe.from}-${recipe.to}`}
                  className="flex items-center gap-3 p-3 rounded-xl border transition-all"
                  style={{
                    backgroundColor: isAnimating ? `${theme.accent}15` : theme.inputBg,
                    borderColor: theme.border,
                  }}
                >
                  {/* Recipe visual */}
                  <div className="flex items-center gap-1.5 flex-1 min-w-0">
                    <GrowthIcon stage={recipe.from} size={22} />
                    <span className="text-xs font-medium" style={{ color: theme.textMuted }}>×{recipe.cost}</span>
                    <span className="text-xs" style={{ color: theme.textFaint }}>→</span>
                    <GrowthIcon stage={recipe.to} size={22} />
                    <span className="text-xs font-medium" style={{ color: theme.textMuted }}>×1</span>
                  </div>

                  {/* Status + buttons */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {canMake > 0 ? (
                      <>
                        <button
                          onClick={() => handleSynthesize(recipe)}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-all"
                          style={{ backgroundColor: `${theme.accent}20`, color: theme.accent }}
                        >
                          {t.synthesisSynthesize}
                        </button>
                        {canMake > 1 && (
                          <button
                            onClick={() => handleSynthesizeAll(recipe)}
                            className="px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-all"
                            style={{ backgroundColor: `${theme.accent}10`, color: theme.accent }}
                          >
                            {t.synthesisSynthesizeAll}
                          </button>
                        )}
                      </>
                    ) : (
                      <span className="text-xs" style={{ color: theme.textFaint }}>
                        {t.synthesisNotEnough}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Toast */}
        {toast && (
          <div
            className="fixed bottom-8 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full text-sm font-medium animate-fade-up z-[60]"
            style={{ backgroundColor: theme.surface, color: theme.accent, border: `1px solid ${theme.border}` }}
          >
            {toast}
          </div>
        )}
      </div>
    </div>
  );
}
