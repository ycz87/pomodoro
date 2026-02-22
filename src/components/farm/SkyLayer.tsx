/**
 * SkyLayer — 农场天空层
 *
 * 按当前时间渲染太阳或月亮，并根据时段计算天空中的固定位置。
 */
import { useMemo } from 'react';
import type { Weather } from '../../types/farm';

interface SkyLayerProps {
  weather: Weather | null;
  currentTime: Date;
}

interface CelestialPosition {
  x: string;
  y: string;
}

function getCloudCount(weather: Weather | null): number {
  if (weather === null) return 0;
  if (weather === 'sunny') return 1;
  if (weather === 'cloudy') return 4;
  if (weather === 'rainy' || weather === 'snowy') return 5;
  if (weather === 'stormy') return 6;
  return 0;
}

function getSunPosition(hour: number): CelestialPosition {
  if (hour >= 6 && hour < 10) {
    return { x: '80%', y: '20%' };
  }
  if (hour >= 10 && hour < 14) {
    return { x: '50%', y: '10%' };
  }
  return { x: '20%', y: '20%' };
}

export function SkyLayer({ weather, currentTime }: SkyLayerProps) {
  const hour = currentTime.getHours();
  const isNight = hour < 6 || hour >= 18;
  const position = isNight ? { x: '75%', y: '15%' } : getSunPosition(hour);
  const cloudCount = getCloudCount(weather);
  const cloudPositions = useMemo<CelestialPosition[]>(
    () => Array.from({ length: cloudCount }, () => ({
      x: `${10 + Math.random() * 80}%`,
      y: `${5 + Math.random() * 30}%`,
    })),
    [cloudCount],
  );

  return (
    <div className="w-full h-full relative" data-weather={weather ?? 'clear'}>
      <span
        className={`absolute z-10 opacity-90 select-none pointer-events-none ${isNight ? 'text-5xl' : 'text-6xl'}`}
        style={{
          left: position.x,
          top: position.y,
          transform: 'translate(-50%, -50%)',
        }}
        role="img"
        aria-label={isNight ? 'moon' : 'sun'}
      >
        {isNight ? '🌙' : '☀️'}
      </span>
      {cloudPositions.map((cloudPosition, index) => (
        <span
          key={`${cloudPosition.x}-${cloudPosition.y}-${index}`}
          className="absolute z-20 text-4xl opacity-75 select-none pointer-events-none"
          style={{
            left: cloudPosition.x,
            top: cloudPosition.y,
            transform: 'translate(-50%, -50%)',
          }}
          aria-hidden="true"
        >
          ☁️
        </span>
      ))}
    </div>
  );
}
