/**
 * CollectionPage — 图鉴页面
 *
 * 按星系分类展示品种收集进度。
 */
import { useMemo, useState } from 'react';
import { useTheme } from '../hooks/useTheme';
import { useI18n } from '../i18n';
import type { CollectedVariety, VarietyId } from '../types/farm';
import {
  ALL_VARIETY_IDS, DARK_MATTER_VARIETIES, GALAXIES, GALAXY_VARIETIES, VARIETY_DEFS,
  RARITY_COLOR, RARITY_STARS,
} from '../types/farm';
import { getUnlockedGalaxies } from '../farm/galaxy';

interface CollectionPageProps {
  collection: CollectedVariety[];
}

export function CollectionPage({ collection }: CollectionPageProps) {
  const theme = useTheme();
  const t = useI18n();
  const [selectedVarietyId, setSelectedVarietyId] = useState<VarietyId | null>(null);

  const collectionMap = useMemo(
    () => new Map(collection.map(item => [item.varietyId, item] as const)),
    [collection],
  );
  const collectedIds = new Set(collectionMap.keys());
  const collectedCount = collectedIds.size;
  const totalCount = ALL_VARIETY_IDS.length;
  const unlockedGalaxies = getUnlockedGalaxies(collection);
  const selectedVariety = selectedVarietyId ? collectionMap.get(selectedVarietyId) : undefined;
  const overallPercent = totalCount > 0 ? Math.round((collectedCount / totalCount) * 100) : 0;

  const starJourneyProgress = GALAXIES.map(galaxy => {
    const varieties = GALAXY_VARIETIES[galaxy.id] ?? [];
    const collectedInGalaxy = varieties.reduce((sum, varietyId) => (
      collectedIds.has(varietyId) ? sum + 1 : sum
    ), 0);
    const totalInGalaxy = varieties.length;
    const percent = totalInGalaxy > 0 ? Math.round((collectedInGalaxy / totalInGalaxy) * 100) : 0;

    return {
      galaxy,
      collectedInGalaxy,
      totalInGalaxy,
      percent,
      isUnlocked: unlockedGalaxies.includes(galaxy.id) || collectedInGalaxy > 0 || galaxy.id === 'dark-matter',
    };
  });

  return (
    <div className="flex-1 w-full px-4 pb-4 overflow-y-auto">
      {/* 总进度 */}
      <div className="flex items-center justify-between mb-4 px-1">
        <span className="text-sm font-medium" style={{ color: theme.text }}>
          {t.collectionProgress(collectedCount, totalCount)}
        </span>
      </div>

      {/* 星际旅程 */}
      <div className="mb-5 rounded-2xl border p-4" style={{ backgroundColor: `${theme.surface}70`, borderColor: theme.border }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color: theme.text }}>
          {t.starJourneyTitle}
        </h3>
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs mb-1" style={{ color: theme.textMuted }}>
            <span>{collectedCount}/{totalCount}</span>
            <span>{overallPercent}%</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: `${theme.inputBg}90` }}>
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${overallPercent}%`, backgroundColor: theme.accent }}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {starJourneyProgress.map(({ galaxy, collectedInGalaxy, totalInGalaxy, percent, isUnlocked }) => (
            <div
              key={galaxy.id}
              className="rounded-xl border px-3 py-2"
              style={{
                borderColor: isUnlocked ? `${theme.accent}35` : theme.border,
                backgroundColor: isUnlocked ? `${theme.accent}10` : `${theme.surface}55`,
                opacity: isUnlocked ? 1 : 0.75,
              }}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-base shrink-0">{galaxy.emoji}</span>
                  <span className="text-xs font-medium truncate" style={{ color: isUnlocked ? theme.text : theme.textMuted }}>
                    {t.galaxyName(galaxy.id)}
                  </span>
                </div>
                {isUnlocked ? (
                  <span className="text-[11px] shrink-0" style={{ color: theme.textMuted }}>
                    {collectedInGalaxy}/{totalInGalaxy}
                  </span>
                ) : (
                  <span className="text-[11px] shrink-0" style={{ color: theme.textFaint }}>
                    🔒 {t.collectionLocked}
                  </span>
                )}
              </div>
              {isUnlocked && totalInGalaxy > 0 && (
                <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: `${theme.inputBg}90` }}>
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${percent}%`, backgroundColor: theme.accent }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 星系列表 */}
      {GALAXIES
        .filter(galaxy => (GALAXY_VARIETIES[galaxy.id] ?? []).length > 0)
        .map(galaxy => {
          const varieties = GALAXY_VARIETIES[galaxy.id] ?? [];
          const collectedInGalaxy = varieties.reduce((sum, varietyId) => (
            collectedIds.has(varietyId) ? sum + 1 : sum
          ), 0);
          const isUnlocked = unlockedGalaxies.includes(galaxy.id) || collectedInGalaxy > 0 || galaxy.id === 'dark-matter';

          return (
            <div key={galaxy.id} className="mb-5">
              {/* 星系标题 */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{galaxy.emoji}</span>
                <span className="text-sm font-semibold" style={{ color: isUnlocked ? theme.text : theme.textMuted }}>
                  {t.galaxyName(galaxy.id)}
                </span>
                {!isUnlocked && (
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${theme.border}50`, color: theme.textFaint }}>
                    🔒 {t.collectionLocked}
                  </span>
                )}
              </div>

              {/* 品种网格 */}
              {isUnlocked ? (
                <div className="grid grid-cols-2 gap-2">
                  {varieties.map(id => {
                    const collected = collectionMap.get(id);
                    return (
                      <VarietyCard
                        key={id}
                        varietyId={id}
                        collected={collected}
                        collectionCount={collectedCount}
                        totalCount={totalCount}
                        theme={theme}
                        t={t}
                        onOpenDetail={setSelectedVarietyId}
                      />
                    );
                  })}
                </div>
              ) : (
                <div
                  className="rounded-xl border p-4 text-center"
                  style={{ backgroundColor: `${theme.surface}50`, borderColor: theme.border }}
                >
                  <span className="text-2xl">🔒</span>
                  <p className="text-xs mt-1" style={{ color: theme.textFaint }}>
                    {t.collectionUnlockHint(galaxy.id)}
                  </p>
                </div>
              )}
            </div>
          );
        })}

      {selectedVarietyId && (
        <VarietyDetailModal
          varietyId={selectedVarietyId}
          collected={selectedVariety}
          collectionCount={collectedCount}
          totalCount={totalCount}
          theme={theme}
          t={t}
          onClose={() => setSelectedVarietyId(null)}
        />
      )}
    </div>
  );
}

function VarietyCard({ varietyId, collected, collectionCount, totalCount, theme, t, onOpenDetail }: {
  varietyId: VarietyId;
  collected?: CollectedVariety;
  collectionCount: number;
  totalCount: number;
  theme: ReturnType<typeof useTheme>;
  t: ReturnType<typeof useI18n>;
  onOpenDetail: (varietyId: VarietyId) => void;
}) {
  const variety = VARIETY_DEFS[varietyId];
  const color = RARITY_COLOR[variety.rarity];
  const isCollected = !!collected;
  const isDarkMatter = DARK_MATTER_VARIETIES.includes(varietyId as typeof DARK_MATTER_VARIETIES[number]);
  const canOpenDetail = isCollected || isDarkMatter;

  return (
    <button
      type="button"
      disabled={!canOpenDetail}
      onClick={() => onOpenDetail(varietyId)}
      className="w-full rounded-xl border p-3 flex flex-col items-center gap-1.5 transition-all text-center"
      style={{
        backgroundColor: isCollected ? `${color}08` : isDarkMatter ? `${theme.accent}08` : theme.surface,
        borderColor: isCollected ? `${color}25` : isDarkMatter ? `${theme.accent}30` : theme.border,
        opacity: isCollected ? 1 : isDarkMatter ? 0.8 : 0.5,
        cursor: canOpenDetail ? 'pointer' : 'default',
      }}
      title={!isCollected && isDarkMatter ? t.collectionAcquireHintTitle : undefined}
    >
      {/* Emoji or silhouette */}
      <span className="text-3xl" style={{
        filter: isCollected ? `drop-shadow(0 0 4px ${color})` : 'grayscale(1) brightness(0.3)',
      }}>
        {isCollected ? variety.emoji : '❓'}
      </span>

      {/* Name */}
      <span className="text-xs font-medium text-center" style={{ color: isCollected ? theme.text : theme.textFaint }}>
        {isCollected ? t.varietyName(varietyId) : '???'}
      </span>

      {/* Stars */}
      <div className="flex gap-0.5">
        {Array.from({ length: RARITY_STARS[variety.rarity] }).map((_, i) => (
          <span key={i} style={{ color: isCollected ? color : theme.textFaint, fontSize: 10 }}>⭐</span>
        ))}
      </div>

      {/* Story (collected only) */}
      {isCollected && (
        <p className="text-[10px] text-center leading-tight mt-0.5" style={{ color: theme.textMuted }}>
          {t.varietyStory(varietyId)}
        </p>
      )}

      {!isCollected && isDarkMatter && (
        <p className="text-[10px] text-center leading-tight mt-0.5" style={{ color: theme.textFaint }}>
          {varietyId === 'cosmic-heart' ? t.darkMatterGuideProgress(collectionCount, totalCount) : t.collectionAcquireHintTitle}
        </p>
      )}

      {/* Date */}
      {collected && (
        <span className="text-[10px]" style={{ color: theme.textFaint }}>
          {collected.firstObtainedDate}
        </span>
      )}
    </button>
  );
}

function VarietyDetailModal({ varietyId, collected, collectionCount, totalCount, theme, t, onClose }: {
  varietyId: VarietyId;
  collected?: CollectedVariety;
  collectionCount: number;
  totalCount: number;
  theme: ReturnType<typeof useTheme>;
  t: ReturnType<typeof useI18n>;
  onClose: () => void;
}) {
  const variety = VARIETY_DEFS[varietyId];
  const color = RARITY_COLOR[variety.rarity];
  const isCollected = Boolean(collected);
  const isDarkMatter = DARK_MATTER_VARIETIES.includes(varietyId as typeof DARK_MATTER_VARIETIES[number]);

  const darkMatterGuide = varietyId === 'void-melon'
    ? t.darkMatterGuideVoid
    : varietyId === 'blackhole-melon'
      ? t.darkMatterGuideBlackHole
      : t.darkMatterGuideCosmicHeart;

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4"
      data-modal-overlay
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-sm rounded-2xl border p-5 max-h-[85vh] overflow-y-auto shadow-2xl animate-fade-up"
        style={{ backgroundColor: theme.surface, borderColor: theme.border }}
      >
        <h3 className="text-sm font-semibold mb-4" style={{ color: theme.text }}>
          {t.varietyDetailTitle}
        </h3>
        <div className="flex flex-col items-center mb-4">
          <span
            className="text-7xl leading-none"
            style={{ filter: isCollected ? `drop-shadow(0 0 12px ${color}) drop-shadow(0 0 24px ${color}AA)` : 'grayscale(1) brightness(0.4)' }}
          >
            {isCollected ? variety.emoji : '❓'}
          </span>
          <p className="text-base font-semibold mt-2" style={{ color: theme.text }}>
            {isCollected || isDarkMatter ? t.varietyName(varietyId) : '???'}
          </p>
          <div className="flex gap-1 mt-1">
            {Array.from({ length: RARITY_STARS[variety.rarity] }).map((_, i) => (
              <span key={i} style={{ color, fontSize: 14 }}>⭐</span>
            ))}
          </div>
        </div>
        {isCollected ? (
          <>
            <p className="text-sm leading-relaxed mb-4" style={{ color: theme.textMuted }}>
              {t.varietyStory(varietyId)}
            </p>
            <div className="rounded-xl border p-3 mb-4" style={{ borderColor: theme.border, backgroundColor: `${theme.inputBg}70` }}>
              <p className="text-xs mb-1" style={{ color: theme.textFaint }}>
                {t.varietyDetailFirstObtained}
              </p>
              <p className="text-sm font-medium mb-2" style={{ color: theme.text }}>
                {collected?.firstObtainedDate ?? '-'}
              </p>
              <p className="text-xs" style={{ color: theme.textMuted }}>
                {t.varietyDetailHarvestCount(collected?.count ?? 0)}
              </p>
            </div>
          </>
        ) : (
          <div className="rounded-xl border p-3 mb-4" style={{ borderColor: theme.border, backgroundColor: `${theme.inputBg}70` }}>
            <p className="text-xs mb-1" style={{ color: theme.textFaint }}>
              {t.collectionAcquireHintTitle}
            </p>
            <p className="text-sm font-medium" style={{ color: theme.text }}>
              {darkMatterGuide}
            </p>
            {varietyId === 'cosmic-heart' && (
              <p className="text-xs mt-2" style={{ color: theme.textMuted }}>
                {t.darkMatterGuideProgress(collectionCount, totalCount)}
              </p>
            )}
          </div>
        )}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-xl text-sm font-medium transition-all"
          style={{ backgroundColor: `${theme.accent}20`, color: theme.accent }}
        >
          {t.varietyDetailClose}
        </button>
      </div>
    </div>
  );
}
