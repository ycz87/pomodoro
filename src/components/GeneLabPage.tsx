/**
 * GeneLabPage — 基因实验室背包页面
 *
 * 按星系分组展示已收集的基因片段，支持折叠展开查看每个星系的片段明细。
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTheme } from '../hooks/useTheme';
import { useI18n } from '../i18n';
import type { GeneInventory } from '../types/gene';
import { GALAXIES, VARIETY_DEFS, RARITY_COLOR, RARITY_STARS } from '../types/farm';
import type { GalaxyId } from '../types/farm';
import type { SeedCounts, SeedQuality } from '../types/slicing';

interface GeneLabPageProps {
  geneInventory: GeneInventory;
  seeds: SeedCounts;
  onInject: (galaxyId: GalaxyId, quality: SeedQuality) => void;
}

type GeneFragmentItem = GeneInventory['fragments'][number];

interface GalaxyFragmentGroup {
  galaxyId: GalaxyId;
  galaxyEmoji: string;
  fragments: GeneFragmentItem[];
}

const SEED_QUALITY_OPTIONS: Array<{ quality: SeedQuality; color: string }> = [
  { quality: 'normal', color: '#a3a3a3' },
  { quality: 'epic', color: '#a78bfa' },
  { quality: 'legendary', color: '#fbbf24' },
];

export function GeneLabPage({ geneInventory, seeds, onInject }: GeneLabPageProps) {
  const theme = useTheme();
  const t = useI18n();
  const [expandedGalaxyIds, setExpandedGalaxyIds] = useState<Set<GalaxyId>>(() => new Set());
  const [selectedGalaxyId, setSelectedGalaxyId] = useState<GalaxyId | null>(null);
  const [selectedQuality, setSelectedQuality] = useState<SeedQuality | null>(null);
  const [showInjectToast, setShowInjectToast] = useState(false);
  const toastTimerRef = useRef<number | null>(null);

  const totalFragments = geneInventory.fragments.length;
  const totalSeeds = seeds.normal + seeds.epic + seeds.legendary;

  const galaxyGroups = useMemo<GalaxyFragmentGroup[]>(() => {
    const fragmentsByGalaxy = new Map<GalaxyId, GeneFragmentItem[]>();

    geneInventory.fragments.forEach((fragment) => {
      const existing = fragmentsByGalaxy.get(fragment.galaxyId);
      if (existing) {
        existing.push(fragment);
        return;
      }
      fragmentsByGalaxy.set(fragment.galaxyId, [fragment]);
    });

    return GALAXIES.flatMap((galaxy) => {
      const fragments = fragmentsByGalaxy.get(galaxy.id) ?? [];
      if (fragments.length === 0) {
        return [];
      }
      return [{
        galaxyId: galaxy.id,
        galaxyEmoji: galaxy.emoji,
        fragments,
      }];
    });
  }, [geneInventory.fragments]);

  const handleToggleGalaxy = (galaxyId: GalaxyId) => {
    setExpandedGalaxyIds((prev) => {
      const next = new Set(prev);
      if (next.has(galaxyId)) {
        next.delete(galaxyId);
      } else {
        next.add(galaxyId);
      }
      return next;
    });
  };

  const fragmentCounts = useMemo(() => {
    const counts = new Map<GalaxyId, number>();
    galaxyGroups.forEach((group) => counts.set(group.galaxyId, group.fragments.length));
    return counts;
  }, [galaxyGroups]);

  useEffect(() => {
    if (selectedGalaxyId === null) return;
    if ((fragmentCounts.get(selectedGalaxyId) ?? 0) > 0) return;
    setSelectedGalaxyId(null);
  }, [fragmentCounts, selectedGalaxyId]);

  useEffect(() => {
    if (selectedQuality === null) return;
    if (seeds[selectedQuality] > 0) return;
    setSelectedQuality(null);
  }, [seeds, selectedQuality]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current !== null) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const selectedGalaxyFragments = selectedGalaxyId ? (fragmentCounts.get(selectedGalaxyId) ?? 0) : 0;
  const selectedQualityCount = selectedQuality ? seeds[selectedQuality] : 0;
  const hasFragments = totalFragments > 0;
  const hasSeeds = totalSeeds > 0;
  const canInject = selectedGalaxyId !== null
    && selectedQuality !== null
    && selectedGalaxyFragments > 0
    && selectedQualityCount > 0;

  const handleInject = () => {
    if (!canInject || selectedGalaxyId === null || selectedQuality === null) return;
    onInject(selectedGalaxyId, selectedQuality);
    setShowInjectToast(true);
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setShowInjectToast(false);
      toastTimerRef.current = null;
    }, 2000);
  };

  return (
    <div className="flex-1 w-full px-4 pb-4 overflow-y-auto">
      <h2 className="text-base sm:text-lg font-semibold mb-3" style={{ color: theme.text }}>
        {t.geneLabTitle}
      </h2>

      {totalFragments === 0 ? (
        <div
          className="rounded-2xl border px-4 py-8 text-center"
          style={{ backgroundColor: theme.surface, borderColor: theme.border }}
        >
          <p className="text-sm leading-relaxed" style={{ color: theme.textMuted }}>
            {t.geneLabEmpty}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {galaxyGroups.map((group) => {
            const isExpanded = expandedGalaxyIds.has(group.galaxyId);
            return (
              <section
                key={group.galaxyId}
                className="rounded-2xl border overflow-hidden"
                style={{ backgroundColor: theme.surface, borderColor: theme.border }}
              >
                <button
                  type="button"
                  onClick={() => handleToggleGalaxy(group.galaxyId)}
                  className="w-full px-4 py-3 flex items-center justify-between gap-3 text-left"
                  aria-expanded={isExpanded}
                >
                  <div className="min-w-0 flex items-center gap-2">
                    <span className="text-base shrink-0">{group.galaxyEmoji}</span>
                    <span className="text-sm font-medium truncate" style={{ color: theme.text }}>
                      {t.galaxyName(group.galaxyId)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs" style={{ color: theme.textMuted }}>
                      {t.geneLabFragmentCount(group.fragments.length)}
                    </span>
                    <span
                      className="text-xs transition-transform duration-200"
                      style={{
                        color: theme.textFaint,
                        transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                      }}
                    >
                      &gt;
                    </span>
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-2">
                    {group.fragments.map((fragment, index) => {
                      const variety = VARIETY_DEFS[fragment.varietyId];
                      const rarityColor = RARITY_COLOR[fragment.rarity];
                      const rarityStars = RARITY_STARS[fragment.rarity];
                      return (
                        <div
                          key={fragment.id}
                          className={`py-2 flex items-center justify-between gap-3${index === 0 ? '' : ' border-t'}`}
                          style={{ borderColor: theme.border }}
                        >
                          <div className="min-w-0 flex items-center gap-2">
                            <span className="text-lg shrink-0">{variety.emoji}</span>
                            <span className="text-sm truncate" style={{ color: theme.text }}>
                              {t.varietyName(fragment.varietyId)}
                            </span>
                          </div>
                          <div className="flex items-center gap-0.5 shrink-0">
                            {Array.from({ length: rarityStars }).map((_, starIndex) => (
                              <span key={`${fragment.id}-star-${starIndex}`} className="text-xs" style={{ color: rarityColor }}>
                                ⭐
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}

      <div
        className="mt-4 rounded-2xl border px-4 py-3 flex items-center justify-between"
        style={{ backgroundColor: theme.surface, borderColor: theme.border }}
      >
        <span className="text-xs" style={{ color: theme.textMuted }}>
          {t.geneLabFragments}
        </span>
        <span className="text-sm font-semibold" style={{ color: theme.text }}>
          {t.geneLabFragmentCount(totalFragments)}
        </span>
      </div>

      <section
        className="mt-4 rounded-2xl border px-4 py-4"
        style={{ backgroundColor: theme.surface, borderColor: theme.border }}
      >
        <h3 className="text-sm sm:text-base font-semibold mb-1" style={{ color: theme.text }}>
          {t.geneInjectTitle}
        </h3>
        <p className="text-xs leading-relaxed mb-4" style={{ color: theme.textMuted }}>
          {t.geneInjectDesc}
        </p>

        <div className="mb-4">
          <p className="text-xs font-semibold mb-2" style={{ color: theme.text }}>
            {`1. ${t.geneInjectSelectGalaxy}`}
          </p>
          {galaxyGroups.length === 0 ? (
            <p className="text-xs" style={{ color: theme.textFaint }}>
              {t.geneInjectNoFragments}
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {galaxyGroups.map((group) => {
                const isSelected = selectedGalaxyId === group.galaxyId;
                return (
                  <button
                    key={`inject-${group.galaxyId}`}
                    type="button"
                    onClick={() => setSelectedGalaxyId(group.galaxyId)}
                    className="rounded-xl border px-3 py-2 text-left transition-colors"
                    style={{
                      backgroundColor: isSelected ? `${theme.accent}22` : theme.inputBg,
                      borderColor: isSelected ? `${theme.accent}66` : theme.border,
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{group.galaxyEmoji}</span>
                      <span className="text-sm font-medium" style={{ color: theme.text }}>
                        {t.galaxyName(group.galaxyId)}
                      </span>
                    </div>
                    <p className="text-xs mt-1" style={{ color: theme.textMuted }}>
                      {t.geneLabFragmentCount(group.fragments.length)}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="mb-4">
          <p className="text-xs font-semibold mb-2" style={{ color: theme.text }}>
            {`2. ${t.geneInjectSelectSeed}`}
          </p>
          <div className="grid grid-cols-3 gap-2">
            {SEED_QUALITY_OPTIONS.map((option) => {
              const count = seeds[option.quality];
              const disabled = count <= 0;
              const isSelected = selectedQuality === option.quality;
              return (
                <button
                  key={`inject-quality-${option.quality}`}
                  type="button"
                  disabled={disabled}
                  onClick={() => setSelectedQuality(option.quality)}
                  className="rounded-xl border px-2 py-2 text-center transition-colors"
                  style={{
                    opacity: disabled ? 0.45 : 1,
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    backgroundColor: disabled ? theme.inputBg : `${option.color}${isSelected ? '20' : '10'}`,
                    borderColor: disabled ? theme.border : (isSelected ? option.color : `${option.color}55`),
                  }}
                >
                  <p className="text-xs font-semibold leading-none" style={{ color: disabled ? theme.textFaint : option.color }}>
                    {t.seedQualityLabel(option.quality)}
                  </p>
                  <p className="text-xs mt-1" style={{ color: theme.textMuted }}>
                    ×{count}
                  </p>
                </button>
              );
            })}
          </div>
          {!hasSeeds && (
            <p className="text-xs mt-2" style={{ color: theme.textFaint }}>
              {t.geneInjectNoSeeds}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={handleInject}
          disabled={!canInject}
          className="w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors"
          style={{
            backgroundColor: canInject ? `${theme.accent}22` : theme.inputBg,
            border: `1px solid ${canInject ? `${theme.accent}66` : theme.border}`,
            color: canInject ? theme.accent : theme.textFaint,
            cursor: canInject ? 'pointer' : 'not-allowed',
          }}
        >
          {t.geneInjectButton}
        </button>

        <p className="text-xs mt-2 text-center" style={{ color: theme.textFaint }}>
          {t.geneInjectCost}
        </p>
        {!hasFragments && (
          <p className="text-xs mt-1 text-center" style={{ color: theme.textFaint }}>
            {t.geneInjectNoFragments}
          </p>
        )}
      </section>

      {showInjectToast && (
        <div
          className="fixed left-1/2 bottom-20 z-[90] -translate-x-1/2 rounded-xl border px-4 py-2 text-sm"
          style={{ backgroundColor: theme.surface, borderColor: `${theme.accent}66`, color: theme.text }}
        >
          {t.geneInjectSuccess}
        </div>
      )}
    </div>
  );
}
