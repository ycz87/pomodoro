/**
 * DebugToolbar — 开发调试工具栏
 *
 * 底部固定显示，提供仓库、农场、计时器、时间倍率与数据重置等调试操作。
 */
import { useCallback, useState } from 'react';
import { useTheme } from '../hooks/useTheme';
import { VARIETY_DEFS } from '../types/farm';

interface DebugToolbarProps {
  // Warehouse actions (migrated from Settings testMode)
  addItems: (stage: import('../types').GrowthStage, count: number) => void;
  resetWarehouse: () => void;
  // Farm actions
  farm: import('../types/farm').FarmStorage;
  setFarmPlots: (plots: import('../types/farm').Plot[]) => void;
  setFarmCollection: (collection: import('../types/farm').CollectedVariety[]) => void;
  resetFarm: () => void;
  // Timer actions
  timerStatus: string;
  skipTimer: () => void;
  // Time multiplier
  timeMultiplier: number;
  setTimeMultiplier: (m: number) => void;
  // Close
  onClose: () => void;
}

function withOpacity(color: string, alpha: number): string {
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    if (hex.length === 3) {
      const r = parseInt(hex[0] + hex[0], 16);
      const g = parseInt(hex[1] + hex[1], 16);
      const b = parseInt(hex[2] + hex[2], 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    if (hex.length === 6 || hex.length === 8) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
  }

  const match = color.match(/^rgba?\(([^)]+)\)$/);
  if (!match) return color;
  const values = match[1].split(',').map((v) => Number.parseFloat(v.trim()));
  if (values.length < 3 || values.some((v) => Number.isNaN(v))) return color;
  const [r, g, b] = values;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const ITEM_ACTIONS: ReadonlyArray<{
  stage: import('../types').GrowthStage;
  label: string;
  emoji: string;
  counts: readonly number[];
}> = [
  { stage: 'seed', label: 'seed', emoji: '🌱', counts: [1, 10, 50] },
  { stage: 'sprout', label: 'sprout', emoji: '🌿', counts: [1, 10] },
  { stage: 'bloom', label: 'bloom', emoji: '🌼', counts: [1, 10] },
  { stage: 'green', label: 'green', emoji: '🍈', counts: [1, 5] },
  { stage: 'ripe', label: 'ripe', emoji: '🍉', counts: [1, 5] },
  { stage: 'legendary', label: 'legendary', emoji: '👑', counts: [1] },
];

const MULTIPLIERS = [1, 5, 10, 50, 100] as const;

export function DebugToolbar({
  addItems,
  resetWarehouse,
  farm,
  setFarmPlots,
  setFarmCollection,
  resetFarm,
  timerStatus,
  skipTimer,
  timeMultiplier,
  setTimeMultiplier,
  onClose,
}: DebugToolbarProps) {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(true);

  const toolbarBg = withOpacity(theme.surface, 0.95);
  const actionBtnClass = 'text-[11px] rounded px-2 py-0.5 cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed';

  const handleInstantMature = useCallback(() => {
    const nowTimestamp = Date.now();
    const nextPlots = farm.plots.map((plot) => {
      if (plot.state !== 'growing') return plot;
      const matureMinutes = plot.varietyId ? VARIETY_DEFS[plot.varietyId].matureMinutes : plot.accumulatedMinutes;
      return {
        ...plot,
        state: 'mature' as const,
        progress: 1,
        accumulatedMinutes: matureMinutes,
        lastActivityTimestamp: nowTimestamp,
      };
    });
    setFarmPlots(nextPlots);
  }, [farm.plots, setFarmPlots]);

  const handleAddVarieties = useCallback((count: number) => {
    const existing = new Set(farm.collection.map((item) => item.varietyId));
    const candidates = (Object.keys(VARIETY_DEFS) as import('../types/farm').VarietyId[])
      .filter((varietyId) => !existing.has(varietyId));
    const picked = candidates.slice(0, count);
    if (picked.length === 0) return;

    const todayKey = new Date().toISOString().slice(0, 10);
    const additions: import('../types/farm').CollectedVariety[] = picked.map((varietyId) => ({
      varietyId,
      firstObtainedDate: todayKey,
      count: 1,
    }));

    setFarmCollection([...farm.collection, ...additions]);
  }, [farm.collection, setFarmCollection]);

  const handleResetAllData = useCallback(() => {
    localStorage.clear();
    window.location.reload();
  }, []);

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-2 pb-2">
      <div
        className="mx-auto max-w-[1280px] rounded-xl border"
        style={{
          backgroundColor: toolbarBg,
          borderColor: theme.border,
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
        }}
      >
        <div
          role="button"
          tabIndex={0}
          onClick={() => setExpanded((prev) => !prev)}
          onKeyDown={(e) => {
            if (e.key !== 'Enter' && e.key !== ' ') return;
            e.preventDefault();
            setExpanded((prev) => !prev);
          }}
          className="w-full flex items-center justify-between px-3 py-1.5 cursor-pointer"
          style={{ color: theme.text }}
        >
          <span className="text-xs font-semibold">🧪 Debug Toolbar</span>
          <span className="flex items-center gap-1.5">
            <span className="text-[11px]" style={{ color: theme.textMuted }}>
              {expanded ? '▾' : '▸'}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="text-xs cursor-pointer px-1"
              aria-label="Close debug toolbar"
            >
              ✕
            </button>
          </span>
        </div>

        {expanded && (
          <div className="px-3 pb-2">
            <div className="flex flex-wrap items-start text-[11px]">
              <section className="flex flex-col gap-1 pr-2 mr-2 border-r" style={{ borderColor: theme.border }}>
                <div className="text-[11px] font-semibold" style={{ color: theme.textMuted }}>瓜棚道具</div>
                {ITEM_ACTIONS.map((item) => (
                  <div key={item.stage} className="flex items-center gap-1">
                    <span className="min-w-20" style={{ color: theme.textMuted }}>{item.label} {item.emoji}</span>
                    {item.counts.map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => addItems(item.stage, n)}
                        className={actionBtnClass}
                        style={{ backgroundColor: withOpacity(theme.accent, 0.16), color: theme.accent }}
                      >
                        +{n}
                      </button>
                    ))}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={resetWarehouse}
                  className={actionBtnClass}
                  style={{ backgroundColor: 'rgba(239,68,68,0.18)', color: '#ef4444' }}
                >
                  清空瓜棚
                </button>
              </section>

              <section className="flex flex-col gap-1 pr-2 mr-2 border-r" style={{ borderColor: theme.border }}>
                <div className="text-[11px] font-semibold" style={{ color: theme.textMuted }}>农场</div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handleInstantMature}
                    className={actionBtnClass}
                    style={{ backgroundColor: theme.inputBg, color: theme.text }}
                  >
                    ⏭️ 立即成熟
                  </button>
                </div>
                <div className="flex items-center gap-1">
                  {[3, 5, 10].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => handleAddVarieties(n)}
                      className={actionBtnClass}
                      style={{ backgroundColor: theme.inputBg, color: theme.text }}
                    >
                      🌱 +{n}品种
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={resetFarm}
                  className={actionBtnClass}
                  style={{ backgroundColor: 'rgba(239,68,68,0.18)', color: '#ef4444' }}
                >
                  🗑️ 重置农场
                </button>
              </section>

              <section className="flex flex-col gap-1 pr-2 mr-2 border-r" style={{ borderColor: theme.border }}>
                <div className="text-[11px] font-semibold" style={{ color: theme.textMuted }}>专注</div>
                <button
                  type="button"
                  onClick={skipTimer}
                  disabled={timerStatus === 'idle'}
                  className={actionBtnClass}
                  style={{ backgroundColor: theme.inputBg, color: theme.text }}
                >
                  ⏭️ 快速完成
                </button>
              </section>

              <section className="flex flex-col gap-1 pr-2 mr-2 border-r" style={{ borderColor: theme.border }}>
                <div className="text-[11px] font-semibold" style={{ color: theme.textMuted }}>时间倍率</div>
                <div className="flex items-center gap-1">
                  {MULTIPLIERS.map((m) => {
                    const active = m === timeMultiplier;
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setTimeMultiplier(m)}
                        className={actionBtnClass}
                        style={{
                          backgroundColor: active ? withOpacity(theme.accent, 0.2) : theme.inputBg,
                          color: active ? theme.accent : theme.text,
                        }}
                      >
                        {m}x
                      </button>
                    );
                  })}
                </div>
              </section>

              <section className="flex flex-col gap-1">
                <div className="text-[11px] font-semibold" style={{ color: theme.textMuted }}>数据</div>
                <button
                  type="button"
                  onClick={handleResetAllData}
                  className={actionBtnClass}
                  style={{ backgroundColor: 'rgba(239,68,68,0.18)', color: '#ef4444' }}
                >
                  🔄 重置所有数据
                </button>
              </section>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
