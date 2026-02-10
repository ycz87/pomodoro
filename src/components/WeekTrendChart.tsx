/**
 * WeekTrendChart — Weekly focus trend bar chart for the History panel.
 *
 * Shows Mon–Sun bars with today highlighted, total weekly time at bottom.
 * Pure div/CSS implementation, no chart library.
 *
 * v0.6.1: Initial implementation.
 */
import { useState, useMemo } from 'react';
import { useTheme } from '../hooks/useTheme';
import { useI18n } from '../i18n';
import { getDayMinutes, formatDateKey } from '../utils/stats';
import type { PomodoroRecord } from '../types';

interface WeekTrendChartProps {
  records: PomodoroRecord[];
}

/** Get Mon–Sun date keys for the current week */
function getCurrentWeekDays(): string[] {
  const now = new Date();
  const dayOfWeek = now.getDay() || 7; // 0=Sun → 7
  const monday = new Date(now);
  monday.setDate(now.getDate() - dayOfWeek + 1);

  const days: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    days.push(formatDateKey(d));
  }
  return days;
}

export function WeekTrendChart({ records }: WeekTrendChartProps) {
  const theme = useTheme();
  const t = useI18n();
  const [tappedIndex, setTappedIndex] = useState<number | null>(null);

  const today = formatDateKey(new Date());

  const { data, maxMinutes, totalMinutes } = useMemo(() => {
    const weekDays = getCurrentWeekDays();
    const data = weekDays.map((d) => ({
      date: d,
      minutes: getDayMinutes(records, d),
    }));
    const maxMinutes = Math.max(...data.map((d) => d.minutes), 1);
    const totalMinutes = data.reduce((sum, d) => sum + d.minutes, 0);
    return { data, maxMinutes, totalMinutes };
  }, [records]);

  // Weekday labels: Mon–Sun using i18n weekdays (index 0 = Mon)
  const weekdayLabels = t.weekdays; // ['一','二','三','四','五','六','日'] or ['Mon',...]

  return (
    <div className="rounded-xl p-4" style={{ backgroundColor: theme.inputBg }}>
      {/* Title */}
      <div className="text-xs font-medium tracking-wider uppercase mb-3"
        style={{ color: theme.textMuted }}>
        {t.weekTrend}
      </div>

      {/* Bars */}
      <div className="flex items-end justify-between gap-1.5" style={{ height: '80px' }}>
        {data.map((d, i) => {
          const isToday = d.date === today;
          const heightPct = maxMinutes > 0 ? (d.minutes / maxMinutes) * 100 : 0;
          const barHeight = d.minutes > 0 ? Math.max(heightPct, 5) : 3; // min 3% for empty days
          const showTooltip = tappedIndex === i && d.minutes > 0;

          return (
            <div
              key={d.date}
              className="flex-1 flex flex-col items-center justify-end h-full relative cursor-pointer"
              onClick={() => setTappedIndex(tappedIndex === i ? null : i)}
            >
              {/* Tooltip */}
              {showTooltip && (
                <div
                  className="absolute -top-5 text-[10px] font-medium whitespace-nowrap"
                  style={{ color: isToday ? theme.accent : theme.textMuted }}
                >
                  {t.formatMinutes(d.minutes)}
                </div>
              )}
              {/* Bar */}
              <div
                className="w-full rounded-t-sm transition-all duration-500"
                style={{
                  height: `${barHeight}%`,
                  backgroundColor: d.minutes > 0
                    ? (isToday ? theme.accent : `${theme.accent}50`)
                    : `${theme.textFaint}30`,
                  borderRadius: '4px 4px 2px 2px',
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Weekday labels */}
      <div className="flex justify-between mt-2">
        {weekdayLabels.map((label, i) => {
          const isToday = data[i]?.date === today;
          return (
            <div
              key={i}
              className="flex-1 text-center text-[10px]"
              style={{
                color: isToday ? theme.accent : theme.textFaint,
                fontWeight: isToday ? 600 : 400,
              }}
            >
              {label}
            </div>
          );
        })}
      </div>

      {/* Weekly total */}
      <div className="text-center mt-3 text-xs" style={{ color: theme.textMuted }}>
        {t.weekTotal(t.formatMinutes(totalMinutes))}
      </div>
    </div>
  );
}
