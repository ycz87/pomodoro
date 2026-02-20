import type { Weather, WeatherState } from '../types/farm';

export const WEATHER_SWITCH_INTERVAL_MS = 6 * 60 * 60 * 1000;
const RAINBOW_CHANCE = 0.05;

const BASE_WEATHERS: Weather[] = ['sunny', 'cloudy', 'rainy', 'night'];

function isWeather(value: unknown): value is Weather {
  return typeof value === 'string' && (
    value === 'sunny'
    || value === 'cloudy'
    || value === 'rainy'
    || value === 'night'
    || value === 'rainbow'
    || value === 'snowy'
    || value === 'stormy'
  );
}

export function rollWeather(randomFn: () => number = Math.random): Weather {
  const roll = randomFn();
  if (roll < RAINBOW_CHANCE) {
    return 'rainbow';
  }

  const normalized = (roll - RAINBOW_CHANCE) / (1 - RAINBOW_CHANCE);
  const index = Math.min(
    BASE_WEATHERS.length - 1,
    Math.floor(normalized * BASE_WEATHERS.length),
  );
  return BASE_WEATHERS[index];
}

export function createInitialWeatherState(now: number = Date.now()): WeatherState {
  return {
    current: rollWeather(),
    lastChangeAt: now,
  };
}

export function migrateWeatherState(raw: unknown): WeatherState {
  const now = Date.now();
  if (!raw || typeof raw !== 'object') return createInitialWeatherState(now);

  const candidate = raw as Record<string, unknown>;
  const current = candidate.current === null
    ? null
    : isWeather(candidate.current)
      ? candidate.current
      : rollWeather();
  const lastChangeAt = typeof candidate.lastChangeAt === 'number' && Number.isFinite(candidate.lastChangeAt)
    ? candidate.lastChangeAt
    : now;

  return {
    current,
    lastChangeAt,
  };
}

export function rotateWeatherState(
  state: WeatherState,
  now: number = Date.now(),
  randomFn: () => number = Math.random,
): WeatherState {
  if (!Number.isFinite(now)) return state;
  if (!Number.isFinite(state.lastChangeAt)) {
    return {
      current: rollWeather(randomFn),
      lastChangeAt: now,
    };
  }

  if (state.lastChangeAt > now) {
    return {
      ...state,
      lastChangeAt: now,
    };
  }

  const elapsed = now - state.lastChangeAt;
  const rotations = Math.floor(elapsed / WEATHER_SWITCH_INTERVAL_MS);
  if (rotations <= 0) return state;

  let nextWeather = state.current;
  for (let i = 0; i < rotations; i += 1) {
    nextWeather = rollWeather(randomFn);
  }

  return {
    current: nextWeather,
    lastChangeAt: state.lastChangeAt + rotations * WEATHER_SWITCH_INTERVAL_MS,
  };
}

export function getMsUntilNextWeatherSwitch(state: WeatherState, now: number = Date.now()): number {
  if (state.lastChangeAt > now) {
    return WEATHER_SWITCH_INTERVAL_MS;
  }

  const elapsed = now - state.lastChangeAt;
  const remainder = elapsed % WEATHER_SWITCH_INTERVAL_MS;
  if (remainder === 0) {
    return WEATHER_SWITCH_INTERVAL_MS;
  }
  return WEATHER_SWITCH_INTERVAL_MS - remainder;
}
