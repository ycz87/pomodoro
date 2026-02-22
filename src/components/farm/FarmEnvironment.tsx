/**
 * FarmEnvironment - Full-screen farm background.
 *
 * Renders a split sky/ground gradient with a soft horizon blend,
 * and applies optional weather overlays.
 */
import type { Weather } from '../../types/farm';

interface FarmEnvironmentProps {
  weather?: Weather | null;
}

function getWeatherOverlay(weather: Weather | null | undefined): string | null {
  if (weather === 'sunny') {
    return 'radial-gradient(circle at 80% 14%, rgba(255,247,204,0.36) 0%, rgba(255,247,204,0) 38%)';
  }
  if (weather === 'cloudy') {
    return 'linear-gradient(to bottom, rgba(120,136,150,0.26) 0%, rgba(120,136,150,0.08) 44%, rgba(74,103,74,0.12) 100%)';
  }
  if (weather === 'rainy') {
    return 'linear-gradient(to bottom, rgba(36,67,99,0.34) 0%, rgba(36,67,99,0.16) 45%, rgba(24,56,40,0.22) 100%), repeating-linear-gradient(105deg, rgba(255,255,255,0.14) 0px, rgba(255,255,255,0.14) 1px, rgba(255,255,255,0) 4px, rgba(255,255,255,0) 12px)';
  }
  if (weather === 'night') {
    return 'linear-gradient(to bottom, rgba(5,20,44,0.3) 0%, rgba(10,30,58,0.2) 44%, rgba(20,48,40,0.25) 100%)';
  }
  if (weather === 'rainbow') {
    return 'radial-gradient(circle at 22% 18%, rgba(255,255,255,0.26) 0%, rgba(255,255,255,0) 34%), linear-gradient(112deg, rgba(255,0,0,0.2) 0%, rgba(255,127,0,0.2) 16%, rgba(255,255,0,0.18) 32%, rgba(0,255,0,0.16) 48%, rgba(0,127,255,0.16) 64%, rgba(0,0,255,0.16) 80%, rgba(139,0,255,0.2) 100%)';
  }
  if (weather === 'snowy') {
    return 'linear-gradient(to bottom, rgba(208,227,255,0.35) 0%, rgba(228,240,255,0.24) 45%, rgba(226,242,232,0.26) 100%), radial-gradient(circle at 26% 16%, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0) 34%)';
  }
  if (weather === 'stormy') {
    return 'linear-gradient(to bottom, rgba(18,24,42,0.7) 0%, rgba(24,30,46,0.46) 40%, rgba(18,35,30,0.48) 100%), radial-gradient(circle at 78% 18%, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 30%)';
  }
  return null;
}

export function FarmEnvironment({ weather = null }: FarmEnvironmentProps) {
  const weatherOverlay = getWeatherOverlay(weather);

  return (
    <div className="pointer-events-none absolute inset-0 z-[-1] overflow-hidden" aria-hidden="true">
      <div
        className="absolute left-0 top-0 h-1/2 w-full"
        style={{
          background: 'linear-gradient(to bottom, #87CEEB 0%, #B0E0E6 100%)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 h-1/2 w-full"
        style={{
          background: 'linear-gradient(to bottom, #9ACD32 0%, #90EE90 100%)',
        }}
      />
      <div
        className="absolute left-0 top-1/2 h-24 w-full -translate-y-1/2"
        style={{
          background: 'linear-gradient(to bottom, rgba(224,246,255,0) 0%, rgba(224,246,255,0.62) 38%, rgba(187,237,190,0.64) 64%, rgba(187,237,190,0) 100%)',
        }}
      />
      {weatherOverlay && (
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            background: weatherOverlay,
          }}
        />
      )}
    </div>
  );
}
