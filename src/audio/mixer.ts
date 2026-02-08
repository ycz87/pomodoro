/**
 * Ambience Mixer — manages multiple concurrent ambient sounds
 * Each sound has independent on/off + volume control.
 * The mixer connects all active sounds to the master ambience gain.
 */
import { getAmbienceGain } from './context';
import {
  AmbienceSound,
  RainSound, ThunderstormSound, OceanSound, StreamSound,
  BirdsSound, WindSound, CricketsSound,
  CafeSound, FireplaceSound, KeyboardSound, LibrarySound,
  WhiteNoiseSound, PinkNoiseSound, BrownNoiseSound, BinauralBeatsSound,
} from './ambience/sounds';

export type AmbienceSoundId =
  | 'rain' | 'thunderstorm' | 'ocean' | 'stream'
  | 'birds' | 'wind' | 'crickets'
  | 'cafe' | 'fireplace' | 'keyboard' | 'library'
  | 'whiteNoise' | 'pinkNoise' | 'brownNoise' | 'binauralBeats';

export interface AmbienceSoundMeta {
  id: AmbienceSoundId;
  emoji: string;
  category: 'nature' | 'environment' | 'noise';
}

/** All available ambience sounds in display order */
export const ALL_AMBIENCE_SOUNDS: AmbienceSoundMeta[] = [
  // Nature
  { id: 'rain', emoji: '🌧️', category: 'nature' },
  { id: 'thunderstorm', emoji: '⛈️', category: 'nature' },
  { id: 'ocean', emoji: '🌊', category: 'nature' },
  { id: 'stream', emoji: '🏞️', category: 'nature' },
  { id: 'birds', emoji: '🐦', category: 'nature' },
  { id: 'wind', emoji: '💨', category: 'nature' },
  { id: 'crickets', emoji: '🦗', category: 'nature' },
  // Environment
  { id: 'cafe', emoji: '☕', category: 'environment' },
  { id: 'fireplace', emoji: '🔥', category: 'environment' },
  { id: 'keyboard', emoji: '⌨️', category: 'environment' },
  { id: 'library', emoji: '📚', category: 'environment' },
  // Noise
  { id: 'whiteNoise', emoji: '⬜', category: 'noise' },
  { id: 'pinkNoise', emoji: '🩷', category: 'noise' },
  { id: 'brownNoise', emoji: '🟤', category: 'noise' },
  { id: 'binauralBeats', emoji: '🎧', category: 'noise' },
];

/** Factory for creating sound instances */
function createSound(id: AmbienceSoundId): AmbienceSound {
  switch (id) {
    case 'rain': return new RainSound();
    case 'thunderstorm': return new ThunderstormSound();
    case 'ocean': return new OceanSound();
    case 'stream': return new StreamSound();
    case 'birds': return new BirdsSound();
    case 'wind': return new WindSound();
    case 'crickets': return new CricketsSound();
    case 'cafe': return new CafeSound();
    case 'fireplace': return new FireplaceSound();
    case 'keyboard': return new KeyboardSound();
    case 'library': return new LibrarySound();
    case 'whiteNoise': return new WhiteNoiseSound();
    case 'pinkNoise': return new PinkNoiseSound();
    case 'brownNoise': return new BrownNoiseSound();
    case 'binauralBeats': return new BinauralBeatsSound();
  }
}

/** Per-sound config (persisted to localStorage) */
export interface AmbienceSoundConfig {
  enabled: boolean;
  volume: number; // 0-1
}

export type AmbienceMixerConfig = Record<AmbienceSoundId, AmbienceSoundConfig>;

/** Default mixer config — everything off */
export function defaultMixerConfig(): AmbienceMixerConfig {
  const cfg = {} as AmbienceMixerConfig;
  for (const s of ALL_AMBIENCE_SOUNDS) {
    cfg[s.id] = { enabled: false, volume: 0.5 };
  }
  return cfg;
}

// ─── Mixer singleton ───

const instances = new Map<AmbienceSoundId, AmbienceSound>();

/** Start a specific ambience sound */
export function startAmbienceSound(id: AmbienceSoundId, volume: number): void {
  stopAmbienceSound(id);
  const sound = createSound(id);
  sound.start(getAmbienceGain(), volume);
  instances.set(id, sound);
}

/** Stop a specific ambience sound */
export function stopAmbienceSound(id: AmbienceSoundId): void {
  const existing = instances.get(id);
  if (existing) {
    existing.stop();
    instances.delete(id);
  }
}

/** Update volume for a running sound */
export function setAmbienceSoundVolume(id: AmbienceSoundId, volume: number): void {
  const existing = instances.get(id);
  if (existing) existing.setVolume(volume);
}

/** Apply full mixer config — start/stop sounds as needed */
export function applyMixerConfig(config: AmbienceMixerConfig): void {
  for (const meta of ALL_AMBIENCE_SOUNDS) {
    const cfg = config[meta.id];
    if (cfg?.enabled) {
      if (!instances.has(meta.id)) {
        startAmbienceSound(meta.id, cfg.volume);
      } else {
        setAmbienceSoundVolume(meta.id, cfg.volume);
      }
    } else {
      stopAmbienceSound(meta.id);
    }
  }
}

/** Stop all ambience sounds */
export function stopAllAmbience(): void {
  for (const [id] of instances) {
    stopAmbienceSound(id);
  }
}

/** Check if any ambience is currently playing */
export function isAmbiencePlaying(): boolean {
  return instances.size > 0;
}

/** Get summary text of active sounds (for display) */
export function getActiveSoundsSummary(
  config: AmbienceMixerConfig,
  nameMap: Record<AmbienceSoundId, string>,
): string {
  const active = ALL_AMBIENCE_SOUNDS
    .filter((s) => config[s.id]?.enabled)
    .map((s) => nameMap[s.id]);
  return active.length > 0 ? active.join(' + ') : '';
}
