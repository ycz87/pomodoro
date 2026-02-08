/**
 * Alert sound generators — 10 distinct notification sounds
 * All synthesized with Web Audio API, no audio files.
 * Each function plays one cycle of the sound.
 */
import { getCtx, getAlertGain } from '../context';

export type AlertSoundId =
  | 'chime'      // C-E-G arpeggio (original)
  | 'bell'       // Classic bell (original)
  | 'nature'     // Nature whoosh (original)
  | 'xylophone'  // Bright mallet hits
  | 'piano'      // Soft piano chord
  | 'electronic' // Synth notification
  | 'waterdrop'  // Water drop plop
  | 'birdsong'   // Short bird melody
  | 'marimba'    // Warm wooden tone
  | 'gong';      // Deep resonant gong

/** Duration of one cycle for each alert (seconds) */
export const ALERT_CYCLE_DURATION: Record<AlertSoundId, number> = {
  chime: 0.8,
  bell: 1.5,
  nature: 1.2,
  xylophone: 1.0,
  piano: 1.5,
  electronic: 0.8,
  waterdrop: 0.6,
  birdsong: 1.2,
  marimba: 1.0,
  gong: 2.5,
};

// ─── Original 3 (migrated) ───

function playChime(): void {
  const ctx = getCtx();
  const dest = getAlertGain();
  const now = ctx.currentTime;
  const freqs = [523.25, 659.25, 783.99];
  const starts = [0, 0.15, 0.3];
  freqs.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0, now + starts[i]);
    g.gain.linearRampToValueAtTime(0.25, now + starts[i] + 0.05);
    g.gain.exponentialRampToValueAtTime(0.01, now + starts[i] + 0.5);
    osc.connect(g);
    g.connect(dest);
    osc.start(now + starts[i]);
    osc.stop(now + starts[i] + 0.5);
  });
}

function playBell(): void {
  const ctx = getCtx();
  const dest = getAlertGain();
  const now = ctx.currentTime;
  const osc1 = ctx.createOscillator();
  const g1 = ctx.createGain();
  osc1.type = 'sine';
  osc1.frequency.value = 880;
  g1.gain.setValueAtTime(0.35, now);
  g1.gain.exponentialRampToValueAtTime(0.01, now + 1.2);
  osc1.connect(g1); g1.connect(dest);
  osc1.start(now); osc1.stop(now + 1.2);

  const osc2 = ctx.createOscillator();
  const g2 = ctx.createGain();
  osc2.type = 'sine';
  osc2.frequency.value = 2640;
  g2.gain.setValueAtTime(0.12, now);
  g2.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
  osc2.connect(g2); g2.connect(dest);
  osc2.start(now); osc2.stop(now + 0.6);
}

function playNature(): void {
  const ctx = getCtx();
  const dest = getAlertGain();
  const now = ctx.currentTime;
  const dur = 1.2;

  const bufSize = Math.floor(ctx.sampleRate * dur);
  const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1) * 0.3;
  const noise = ctx.createBufferSource();
  noise.buffer = buf;
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 800;
  filter.Q.value = 0.5;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, now);
  g.gain.linearRampToValueAtTime(0.12, now + 0.2);
  g.gain.setValueAtTime(0.12, now + dur - 0.3);
  g.gain.linearRampToValueAtTime(0, now + dur);
  noise.connect(filter); filter.connect(g); g.connect(dest);
  noise.start(now); noise.stop(now + dur);

  const osc = ctx.createOscillator();
  const og = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = 440;
  og.gain.setValueAtTime(0, now);
  og.gain.linearRampToValueAtTime(0.15, now + 0.15);
  og.gain.exponentialRampToValueAtTime(0.01, now + 1.0);
  osc.connect(og); og.connect(dest);
  osc.start(now); osc.stop(now + 1.0);
}

// ─── New alert sounds ───

function playXylophone(): void {
  const ctx = getCtx();
  const dest = getAlertGain();
  const now = ctx.currentTime;
  // Bright descending mallet hits: G6-E6-C6
  const notes = [1568, 1318.5, 1047];
  notes.forEach((freq, i) => {
    const t = now + i * 0.18;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;
    // Add harmonic for brightness
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = freq * 3;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.2, t);
    g.gain.exponentialRampToValueAtTime(0.01, t + 0.4);
    const g2 = ctx.createGain();
    g2.gain.setValueAtTime(0.06, t);
    g2.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
    osc.connect(g); g.connect(dest);
    osc2.connect(g2); g2.connect(dest);
    osc.start(t); osc.stop(t + 0.4);
    osc2.start(t); osc2.stop(t + 0.15);
  });
}

function playPiano(): void {
  const ctx = getCtx();
  const dest = getAlertGain();
  const now = ctx.currentTime;
  // Soft C major chord: C4-E4-G4-C5
  const freqs = [261.63, 329.63, 392, 523.25];
  freqs.forEach((freq) => {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;
    // Add 2nd harmonic for piano-like timbre
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = freq * 2;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.12, now);
    g.gain.exponentialRampToValueAtTime(0.01, now + 1.3);
    const g2 = ctx.createGain();
    g2.gain.setValueAtTime(0.04, now);
    g2.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
    osc.connect(g); g.connect(dest);
    osc2.connect(g2); g2.connect(dest);
    osc.start(now); osc.stop(now + 1.3);
    osc2.start(now); osc2.stop(now + 0.5);
  });
}

function playElectronic(): void {
  const ctx = getCtx();
  const dest = getAlertGain();
  const now = ctx.currentTime;
  // Two-tone synth beep
  const osc = ctx.createOscillator();
  osc.type = 'square';
  osc.frequency.setValueAtTime(880, now);
  osc.frequency.setValueAtTime(1100, now + 0.15);
  osc.frequency.setValueAtTime(880, now + 0.3);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.08, now);
  g.gain.setValueAtTime(0.08, now + 0.55);
  g.gain.linearRampToValueAtTime(0, now + 0.7);
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 3000;
  osc.connect(lp);
  lp.connect(g);
  g.connect(dest);
  osc.start(now);
  osc.stop(now + 0.7);
}

function playWaterdrop(): void {
  const ctx = getCtx();
  const dest = getAlertGain();
  const now = ctx.currentTime;
  // Two water drops
  [0, 0.25].forEach((offset) => {
    const t = now + offset;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    const freq = offset === 0 ? 600 : 800;
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.3, t + 0.15);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.25, t);
    g.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
    osc.connect(g);
    g.connect(dest);
    osc.start(t);
    osc.stop(t + 0.2);
  });
}

function playBirdsong(): void {
  const ctx = getCtx();
  const dest = getAlertGain();
  const now = ctx.currentTime;
  // Short ascending melody
  const notes = [2000, 2400, 2800, 3200, 2600];
  const timing = [0, 0.15, 0.28, 0.4, 0.55];
  notes.forEach((freq, i) => {
    const t = now + timing[i];
    const dur = 0.12;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.linearRampToValueAtTime(freq * 1.1, t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.1, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.01, t + dur);
    osc.connect(g);
    g.connect(dest);
    osc.start(t);
    osc.stop(t + dur);
  });
}

function playMarimba(): void {
  const ctx = getCtx();
  const dest = getAlertGain();
  const now = ctx.currentTime;
  // Warm wooden tone: fundamental + soft harmonics
  const notes = [523.25, 659.25]; // C5, E5
  notes.forEach((freq, i) => {
    const t = now + i * 0.3;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = freq * 4; // 4th harmonic for marimba character
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.2, t);
    g.gain.exponentialRampToValueAtTime(0.01, t + 0.6);
    const g2 = ctx.createGain();
    g2.gain.setValueAtTime(0.08, t);
    g2.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
    osc.connect(g); g.connect(dest);
    osc2.connect(g2); g2.connect(dest);
    osc.start(t); osc.stop(t + 0.6);
    osc2.start(t); osc2.stop(t + 0.1);
  });
}

function playGong(): void {
  const ctx = getCtx();
  const dest = getAlertGain();
  const now = ctx.currentTime;
  // Deep resonant gong: low fundamental + inharmonic partials
  const freqs = [65, 130, 195, 260, 390];
  const amps = [0.2, 0.15, 0.08, 0.05, 0.03];
  const decays = [2.2, 1.8, 1.2, 0.8, 0.5];
  freqs.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq * (1 + Math.random() * 0.01); // slight detuning
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(amps[i], now + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, now + decays[i]);
    osc.connect(g);
    g.connect(dest);
    osc.start(now);
    osc.stop(now + decays[i]);
  });
  // Noise burst for attack
  const dur = 0.05;
  const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (data.length * 0.1));
  const noise = ctx.createBufferSource();
  noise.buffer = buf;
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 500;
  const ng = ctx.createGain();
  ng.gain.setValueAtTime(0.15, now);
  ng.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
  noise.connect(lp);
  lp.connect(ng);
  ng.connect(dest);
  noise.start(now);
  noise.stop(now + 0.1);
}

// ─── Public API ───

const ALERT_FUNCTIONS: Record<AlertSoundId, () => void> = {
  chime: playChime,
  bell: playBell,
  nature: playNature,
  xylophone: playXylophone,
  piano: playPiano,
  electronic: playElectronic,
  waterdrop: playWaterdrop,
  birdsong: playBirdsong,
  marimba: playMarimba,
  gong: playGong,
};

/** Play one cycle of an alert sound */
export function playAlertOnce(id: AlertSoundId): void {
  try {
    ALERT_FUNCTIONS[id]?.();
  } catch { /* Audio not available */ }
}

/** Play alert sound with repeat count */
export function playAlertRepeated(id: AlertSoundId, repeats: number): void {
  try {
    const cycleDur = ALERT_CYCLE_DURATION[id] ?? 1;
    for (let i = 0; i < repeats; i++) {
      setTimeout(() => playAlertOnce(id), i * cycleDur * 1000);
    }
  } catch { /* Audio not available */ }
}

/** All alert sound IDs in display order */
export const ALL_ALERT_IDS: AlertSoundId[] = [
  'chime', 'bell', 'nature', 'xylophone', 'piano',
  'electronic', 'waterdrop', 'birdsong', 'marimba', 'gong',
];
