import type { SoundType } from '../types';

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

// Sound 1: Chime — pleasant C-E-G arpeggio (original)
function playChime(): void {
  const ctx = getAudioContext();
  const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5
  const startTimes = [0, 0.15, 0.3];

  frequencies.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0, ctx.currentTime + startTimes[i]);
    gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + startTimes[i] + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + startTimes[i] + 0.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + startTimes[i]);
    osc.stop(ctx.currentTime + startTimes[i] + 0.5);
  });
}

// Sound 2: Bell — single resonant bell tone
function playBell(): void {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  // Fundamental
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(880, now); // A5
  gain1.gain.setValueAtTime(0.4, now);
  gain1.gain.exponentialRampToValueAtTime(0.01, now + 1.5);
  osc1.connect(gain1);
  gain1.connect(ctx.destination);
  osc1.start(now);
  osc1.stop(now + 1.5);

  // Overtone
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(2640, now); // 3rd harmonic
  gain2.gain.setValueAtTime(0.15, now);
  gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
  osc2.connect(gain2);
  gain2.connect(ctx.destination);
  osc2.start(now);
  osc2.stop(now + 0.8);

  // Second strike
  setTimeout(() => {
    const t = ctx.currentTime;
    const osc3 = ctx.createOscillator();
    const gain3 = ctx.createGain();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(880, t);
    gain3.gain.setValueAtTime(0.3, t);
    gain3.gain.exponentialRampToValueAtTime(0.01, t + 1.2);
    osc3.connect(gain3);
    gain3.connect(ctx.destination);
    osc3.start(t);
    osc3.stop(t + 1.2);
  }, 600);
}

// Sound 3: Nature — soft wind-like white noise + gentle tone
function playNature(): void {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  // Filtered noise (wind-like)
  const bufferSize = ctx.sampleRate * 1.5;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.3;
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(800, now);
  filter.Q.setValueAtTime(0.5, now);

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0, now);
  noiseGain.gain.linearRampToValueAtTime(0.15, now + 0.3);
  noiseGain.gain.linearRampToValueAtTime(0, now + 1.5);

  noise.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(ctx.destination);
  noise.start(now);
  noise.stop(now + 1.5);

  // Gentle tone
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(440, now); // A4
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.2, now + 0.2);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 1.2);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 1.2);
}

export function playNotificationSound(sound: SoundType = 'chime'): void {
  try {
    switch (sound) {
      case 'chime': playChime(); break;
      case 'bell': playBell(); break;
      case 'nature': playNature(); break;
    }
  } catch {
    // Audio not available
  }
}

export function requestNotificationPermission(): void {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
}

export function sendNotification(title: string, body: string, sound: SoundType = 'chime'): void {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, { body });
  }
  playNotificationSound(sound);
}
