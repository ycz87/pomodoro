import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { WeatherState } from '../types/farm';
import {
  createInitialWeatherState,
  getMsUntilNextWeatherSwitch,
  migrateWeatherState,
  rotateWeatherState,
} from '../utils/weather';

const WEATHER_STORAGE_KEY = 'weatherState';

export function useWeather() {
  const [weatherState, setWeatherState] = useLocalStorage<WeatherState>(
    WEATHER_STORAGE_KEY,
    createInitialWeatherState(),
    migrateWeatherState,
  );

  // App open check: apply missed rotations while offline.
  useEffect(() => {
    setWeatherState((prev) => rotateWeatherState(prev, Date.now()));
  }, [setWeatherState]);

  // Keep rotating every 6 hours while app stays open.
  useEffect(() => {
    const delay = getMsUntilNextWeatherSwitch(weatherState, Date.now());
    const timeoutId = window.setTimeout(() => {
      setWeatherState((prev) => rotateWeatherState(prev, Date.now()));
    }, delay);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [weatherState, setWeatherState]);

  return {
    weatherState,
    setWeatherState,
  };
}
