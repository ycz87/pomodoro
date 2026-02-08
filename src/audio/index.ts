/**
 * Audio system — public API
 * Replaces the old notification.ts
 */
export { getCtx, setMasterAlertVolume, setMasterAmbienceVolume } from './context';
export { playAlertOnce, playAlertRepeated, ALL_ALERT_IDS, ALERT_CYCLE_DURATION } from './alerts/sounds';
export type { AlertSoundId } from './alerts/sounds';
export {
  ALL_AMBIENCE_SOUNDS,
  defaultMixerConfig,
  startAmbienceSound, stopAmbienceSound, setAmbienceSoundVolume,
  applyMixerConfig, stopAllAmbience, isAmbiencePlaying,
  getActiveSoundsSummary,
  enterPreviewMode, exitPreviewMode,
} from './mixer';
export type { AmbienceSoundId, AmbienceSoundConfig, AmbienceMixerConfig, AmbienceSoundMeta } from './mixer';

// ─── Browser notification (kept from old system) ───

export function requestNotificationPermission(): void {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
}

export function sendBrowserNotification(title: string, body: string): void {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, { body });
  }
}
