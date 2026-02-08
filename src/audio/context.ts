/**
 * Shared AudioContext singleton + master gain nodes
 * All audio routes through here for centralized volume control
 */

let ctx: AudioContext | null = null;
let masterAlertGain: GainNode | null = null;
let masterAmbienceGain: GainNode | null = null;

export function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

export function getAlertGain(): GainNode {
  const c = getCtx();
  if (!masterAlertGain) {
    masterAlertGain = c.createGain();
    masterAlertGain.connect(c.destination);
  }
  return masterAlertGain;
}

export function getAmbienceGain(): GainNode {
  const c = getCtx();
  if (!masterAmbienceGain) {
    masterAmbienceGain = c.createGain();
    masterAmbienceGain.connect(c.destination);
  }
  return masterAmbienceGain;
}

/** Set master alert volume (0-100) */
export function setMasterAlertVolume(vol: number): void {
  const g = getAlertGain();
  g.gain.setValueAtTime(vol / 100, getCtx().currentTime);
}

/** Set master ambience volume (0-100) */
export function setMasterAmbienceVolume(vol: number): void {
  const g = getAmbienceGain();
  g.gain.setValueAtTime(vol / 100, getCtx().currentTime);
}
