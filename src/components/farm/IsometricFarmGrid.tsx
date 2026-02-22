/**
 * IsometricFarmGrid - 7-plot isometric farm layout.
 *
 * Uses a fixed 1-2-2-2 trapezoid arrangement and keeps PlotCard logic centralized
 * by reusing the existing PlotCard component from FarmPage.
 */
import { useTheme } from '../../hooks/useTheme';
import { useI18n } from '../../i18n';
import type { Plot, StolenRecord, Weather } from '../../types/farm';
import { PlotCard } from '../FarmPage';

interface IsometricFarmGridProps {
  plots: Plot[];
  weather: Weather | null;
  nowTimestamp: number;
  activeTooltipPlotId: number | null;
  stolenRecordByPlotId?: Map<number, StolenRecord>;
  mutationGunCount: number;
  moonDewCount: number;
  nectarCount: number;
  starTrackerCount: number;
  trapNetCount: number;
  onActiveTooltipChange: (plotId: number | null) => void;
  onPlant: (plotId: number) => void;
  onHarvest: (plotId: number) => void;
  onClear: (plotId: number) => void;
  onUseMutationGun: (plotId: number) => void;
  onUseMoonDew: (plotId: number) => void;
  onUseNectar: (plotId: number) => void;
  onUseStarTracker: (plotId: number) => void;
  onUseTrapNet: (plotId: number) => void;
}

interface PlotPosition {
  x: number;
  y: number;
}

const SCENE_SIZE = {
  width: 700,
  height: 500,
};

const PLOT_ISLAND_SIZE = 200;

const PLOT_POSITIONS: PlotPosition[] = [
  { x: 350, y: 74 },
  { x: 260, y: 168 },
  { x: 440, y: 168 },
  { x: 240, y: 264 },
  { x: 460, y: 264 },
  { x: 220, y: 360 },
  { x: 480, y: 360 },
];

export function IsometricFarmGrid({
  plots,
  weather,
  nowTimestamp,
  activeTooltipPlotId,
  stolenRecordByPlotId,
  mutationGunCount,
  moonDewCount,
  nectarCount,
  starTrackerCount,
  trapNetCount,
  onActiveTooltipChange,
  onPlant,
  onHarvest,
  onClear,
  onUseMutationGun,
  onUseMoonDew,
  onUseNectar,
  onUseStarTracker,
  onUseTrapNet,
}: IsometricFarmGridProps) {
  const theme = useTheme();
  const t = useI18n();

  return (
    <div className="farm-grid-perspective relative w-full overflow-visible" onClick={() => onActiveTooltipChange(null)}>
      <div
        className="relative mx-auto origin-top scale-[0.7] sm:scale-[0.85] md:scale-100"
        style={{
          width: SCENE_SIZE.width,
          height: SCENE_SIZE.height,
        }}
      >
        {PLOT_POSITIONS.map((position, index) => {
          const plot = plots[index];

          if (!plot) {
            return (
              <div
                key={`missing-plot-${index}`}
                className="absolute"
                style={{
                  left: position.x,
                  top: position.y,
                  width: PLOT_ISLAND_SIZE,
                  height: PLOT_ISLAND_SIZE,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div
                  className="pointer-events-none absolute inset-[10px] rounded-xl"
                  style={{
                    backgroundColor: '#8B4513',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
                    transform: 'perspective(960px) rotateX(45deg) rotateZ(45deg)',
                    transformOrigin: 'center center',
                  }}
                />
                <div className="absolute inset-[20px] z-10 flex items-center justify-center rounded-xl border-2 border-dashed" style={{ borderColor: `${theme.border}cc`, backgroundColor: `${theme.surface}dd` }}>
                  <span className="text-xs font-medium" style={{ color: theme.textMuted }}>
                    {t.collectionLocked}
                  </span>
                </div>
              </div>
            );
          }

          return (
            <div
              key={`plot-isometric-${plot.id}`}
              className="absolute"
              style={{
                left: position.x,
                top: position.y,
                width: PLOT_ISLAND_SIZE,
                height: PLOT_ISLAND_SIZE,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div
                className="pointer-events-none absolute inset-[10px] rounded-xl"
                style={{
                  backgroundColor: '#8B4513',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
                  transform: 'perspective(960px) rotateX(45deg) rotateZ(45deg)',
                  transformOrigin: 'center center',
                }}
              />
              <div className="absolute inset-[18px] z-10">
                <PlotCard
                  plot={plot}
                  weather={weather}
                  stolenRecord={stolenRecordByPlotId?.get(plot.id)}
                  nowTimestamp={nowTimestamp}
                  theme={theme}
                  t={t}
                  isTooltipOpen={activeTooltipPlotId === plot.id}
                  onTooltipToggle={() => onActiveTooltipChange(activeTooltipPlotId === plot.id ? null : plot.id)}
                  onPlantClick={() => onPlant(plot.id)}
                  onHarvestClick={() => onHarvest(plot.id)}
                  onClearClick={() => onClear(plot.id)}
                  mutationGunCount={mutationGunCount}
                  onUseMutationGun={() => onUseMutationGun(plot.id)}
                  moonDewCount={moonDewCount}
                  onUseMoonDew={() => onUseMoonDew(plot.id)}
                  nectarCount={nectarCount}
                  onUseNectar={() => onUseNectar(plot.id)}
                  starTrackerCount={starTrackerCount}
                  onUseStarTracker={() => onUseStarTracker(plot.id)}
                  trapNetCount={trapNetCount}
                  onUseTrapNet={() => onUseTrapNet(plot.id)}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
