/**
 * AchievementsPage — full-screen achievement gallery
 * Shows all 44 achievements grouped by series with progress bars.
 */
import { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from '../hooks/useTheme';
import { useI18n } from '../i18n';
import type { AchievementData, AchievementSeries } from '../achievements/types';
import { SERIES_CONFIG } from '../achievements/types';
import { ACHIEVEMENTS_BY_SERIES, ALL_ACHIEVEMENTS } from '../achievements/definitions';
import type { AchievementDef } from '../achievements/types';

interface AchievementsPageProps {
  data: AchievementData;
  onClose: () => void;
  onMarkSeen: (ids: string[]) => void;
  language: 'zh' | 'en' | string;
}

const SERIES_ORDER: AchievementSeries[] = ['streak', 'focus', 'house', 'farm', 'hidden'];

function BadgeIcon({ def, unlocked, series, size = 64 }: {
  def: AchievementDef; unlocked: boolean; series: AchievementSeries; size?: number;
}) {
  const config = SERIES_CONFIG[series];
  const isHidden = series === 'hidden';

  if (!unlocked) {
    return (
      <div
        className="rounded-full flex items-center justify-center shrink-0"
        style={{
          width: size, height: size,
          backgroundColor: 'rgba(128,128,128,0.2)',
          border: '2px solid rgba(128,128,128,0.3)',
        }}
      >
        <span style={{ fontSize: size * 0.35 }}>
          {isHidden ? '❓' : '🔒'}
        </span>
      </div>
    );
  }

  const bg = config.colorEnd
    ? `linear-gradient(135deg, ${config.color}, ${config.colorEnd})`
    : config.color;

  return (
    <div
      className="rounded-full flex items-center justify-center shrink-0 relative"
      style={{
        width: size, height: size,
        background: bg,
        boxShadow: `0 0 ${size * 0.3}px ${config.color}40`,
      }}
    >
      <span style={{ fontSize: size * 0.4 }}>{def.emoji}</span>
      {/* Subtle glow */}
      <div className="absolute inset-0 rounded-full" style={{
        background: `radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)`,
      }} />
    </div>
  );
}

function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(128,128,128,0.2)' }}>
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  );
}

function BadgeDetailModal({ def, data, series, language, onClose }: {
  def: AchievementDef;
  data: AchievementData;
  series: AchievementSeries;
  language: string;
  onClose: () => void;
}) {
  const theme = useTheme();
  const i18n = useI18n();
  const unlocked = def.id in data.unlocked;
  const isHidden = series === 'hidden';
  const config = SERIES_CONFIG[series];
  const isZh = language.startsWith('zh');

  const name = isHidden && !unlocked ? i18n.achievementsHiddenLocked : (isZh ? def.nameZh : def.nameEn);
  const desc = isHidden && !unlocked
    ? i18n.achievementsHiddenHint
    : (isZh ? def.descZh : def.descEn);

  // Progress for locked achievements
  let progressValue = 0;
  let progressMax = 0;
  if (!unlocked && def.target && def.progressKey) {
    progressMax = def.target;
    const key = def.progressKey as keyof typeof data.progress;
    progressValue = Math.min(Number(data.progress[key]) || 0, progressMax);
  }

  const unlockedDate = unlocked
    ? new Date(data.unlocked[def.id]).toLocaleDateString(isZh ? 'zh-CN' : 'en-US')
    : '';

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
      onClick={onClose}
      data-modal-overlay
    >
      <div
        className="w-full max-w-xs rounded-2xl p-6 border animate-fade-up"
        style={{ backgroundColor: theme.surface, borderColor: theme.border }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex flex-col items-center gap-4">
          <BadgeIcon def={def} unlocked={unlocked} series={series} size={96} />
          <div className="text-center">
            <div className="text-base font-semibold" style={{ color: theme.text }}>{name}</div>
            {desc && (
              <div className="text-sm mt-1" style={{ color: theme.textMuted }}>{desc}</div>
            )}
          </div>

          {unlocked ? (
            <div className="text-xs" style={{ color: theme.textFaint }}>
              {i18n.achievementsUnlockedAt(unlockedDate)}
            </div>
          ) : (
            <div className="w-full flex flex-col gap-2">
              {!isHidden && (isZh ? def.conditionZh : def.conditionEn) && (
                <div className="text-xs text-center" style={{ color: theme.textMuted }}>
                  {i18n.achievementsCondition}: {isZh ? def.conditionZh : def.conditionEn}
                </div>
              )}
              {progressMax > 0 && !isHidden && (
                <div className="flex flex-col gap-1">
                  <ProgressBar value={progressValue} max={progressMax} color={config.color} />
                  <div className="text-xs text-center" style={{ color: theme.textFaint }}>
                    {progressValue} / {progressMax}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

export function AchievementsPage({ data, onClose, onMarkSeen, language }: AchievementsPageProps) {
  const theme = useTheme();
  const i18n = useI18n();
  const [selectedBadge, setSelectedBadge] = useState<AchievementDef | null>(null);
  const isZh = language.startsWith('zh');

  const totalUnlocked = Object.keys(data.unlocked).length;
  const totalAchievements = ALL_ACHIEVEMENTS.length;

  // Mark all unseen as seen when page opens
  const unseenIds = useMemo(() => {
    return Object.keys(data.unlocked).filter(id => !data.seen.includes(id));
  }, [data.unlocked, data.seen]);

  // Mark seen on mount
  useMemo(() => {
    if (unseenIds.length > 0) onMarkSeen(unseenIds);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const seriesNames: Record<AchievementSeries, string> = {
    streak: i18n.achievementsSeriesStreak,
    focus: i18n.achievementsSeriesFocus,
    house: i18n.achievementsSeriesHouse,
    farm: i18n.achievementsSeriesFarm,
    hidden: i18n.achievementsSeriesHidden,
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex flex-col" style={{ backgroundColor: theme.bg }}>
      {/* Header */}
      <header
        className="w-full h-12 flex items-center px-4 shrink-0 border-b"
        style={{ backgroundColor: theme.surface, borderColor: theme.border }}
      >
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
          style={{ color: theme.textMuted }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1 text-center text-sm font-semibold" style={{ color: theme.text }}>
          {i18n.achievementsTitle}
        </div>
        <div className="w-8" />
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 settings-scrollbar">
        {/* Total progress */}
        <div className="mb-6">
          <div className="text-xs mb-2 text-center" style={{ color: theme.textMuted }}>
            {i18n.achievementsProgress(totalUnlocked, totalAchievements)}
          </div>
          <ProgressBar
            value={totalUnlocked}
            max={totalAchievements}
            color={theme.accent}
          />
        </div>

        {/* Series sections */}
        {SERIES_ORDER.map(seriesKey => {
          const config = SERIES_CONFIG[seriesKey];
          const achievements = ACHIEVEMENTS_BY_SERIES[seriesKey] || [];
          const seriesUnlocked = achievements.filter(a => a.id in data.unlocked).length;

          return (
            <div key={seriesKey} className="mb-6">
              {/* Series header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold" style={{ color: config.color }}>
                    {seriesNames[seriesKey]}
                  </span>
                  {config.comingSoon && (
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded-full"
                      style={{ backgroundColor: 'rgba(128,128,128,0.2)', color: theme.textFaint }}
                    >
                      {i18n.achievementsComingSoon}
                    </span>
                  )}
                </div>
                <span className="text-xs" style={{ color: theme.textFaint }}>
                  {i18n.achievementsSeriesProgress(seriesUnlocked, config.count)}
                </span>
              </div>

              {/* Series progress bar */}
              <div className="mb-3">
                <ProgressBar value={seriesUnlocked} max={config.count} color={config.color} />
              </div>

              {/* Badge grid */}
              <div className="grid grid-cols-5 gap-2">
                {achievements.map(def => {
                  const unlocked = def.id in data.unlocked;
                  const isHidden = seriesKey === 'hidden';
                  const name = isHidden && !unlocked
                    ? '???'
                    : (isZh ? def.nameZh : def.nameEn);

                  return (
                    <button
                      key={def.id}
                      className={`flex flex-col items-center gap-1 p-1.5 rounded-xl transition-all ${
                        config.comingSoon ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer active:scale-95'
                      }`}
                      onClick={() => !config.comingSoon && setSelectedBadge(def)}
                      disabled={config.comingSoon}
                    >
                      <BadgeIcon def={def} unlocked={unlocked} series={seriesKey} size={48} />
                      <span
                        className="text-[10px] leading-tight text-center line-clamp-2"
                        style={{ color: unlocked ? theme.text : theme.textFaint }}
                      >
                        {name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Badge detail modal */}
      {selectedBadge && (
        <BadgeDetailModal
          def={selectedBadge}
          data={data}
          series={selectedBadge.series}
          language={language}
          onClose={() => setSelectedBadge(null)}
        />
      )}
    </div>,
    document.body,
  );
}
