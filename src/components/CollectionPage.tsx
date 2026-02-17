/**
 * CollectionPage — 图鉴页面
 *
 * 按星系分类展示品种收集进度。
 */
import { useTheme } from '../hooks/useTheme';
import { useI18n } from '../i18n';
import type { CollectedVariety, VarietyId } from '../types/farm';
import {
  ALL_VARIETY_IDS, GALAXIES, GALAXY_VARIETIES, VARIETY_DEFS,
  RARITY_COLOR, RARITY_STARS,
} from '../types/farm';
import { getUnlockedGalaxies } from '../farm/galaxy';

interface CollectionPageProps {
  collection: CollectedVariety[];
}

export function CollectionPage({ collection }: CollectionPageProps) {
  const theme = useTheme();
  const t = useI18n();

  const collectedIds = new Set(collection.map(c => c.varietyId));
  const collectedCount = collectedIds.size;
  const totalCount = ALL_VARIETY_IDS.length;
  const unlockedGalaxies = getUnlockedGalaxies(collection);

  return (
    <div className="flex-1 w-full px-4 pb-4 overflow-y-auto">
      {/* 总进度 */}
      <div className="flex items-center justify-between mb-4 px-1">
        <span className="text-sm font-medium" style={{ color: theme.text }}>
          {t.collectionProgress(collectedCount, totalCount)}
        </span>
      </div>

      {/* 星系列表 */}
      {GALAXIES
        .filter(galaxy => (GALAXY_VARIETIES[galaxy.id] ?? []).length > 0)
        .map(galaxy => {
          const varieties = GALAXY_VARIETIES[galaxy.id] ?? [];
          const isUnlocked = unlockedGalaxies.includes(galaxy.id);

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
                    const collected = collection.find(c => c.varietyId === id);
                    return (
                      <VarietyCard
                        key={id}
                        varietyId={id}
                        collected={collected}
                        theme={theme}
                        t={t}
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
    </div>
  );
}

function VarietyCard({ varietyId, collected, theme, t }: {
  varietyId: VarietyId;
  collected?: CollectedVariety;
  theme: ReturnType<typeof useTheme>;
  t: ReturnType<typeof useI18n>;
}) {
  const variety = VARIETY_DEFS[varietyId];
  const color = RARITY_COLOR[variety.rarity];
  const isCollected = !!collected;

  return (
    <div
      className="rounded-xl border p-3 flex flex-col items-center gap-1.5 transition-all"
      style={{
        backgroundColor: isCollected ? `${color}08` : theme.surface,
        borderColor: isCollected ? `${color}25` : theme.border,
        opacity: isCollected ? 1 : 0.5,
      }}
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

      {/* Date */}
      {collected && (
        <span className="text-[10px]" style={{ color: theme.textFaint }}>
          {collected.firstObtainedDate}
        </span>
      )}
    </div>
  );
}
