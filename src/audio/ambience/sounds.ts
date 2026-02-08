/**
 * Ambience sound base class + all 15 ambient sound generators
 * Each generator creates continuous audio using Web Audio API nodes.
 * No audio files — everything is synthesized in real-time.
 */
import { getCtx } from '../context';

// ─── Base class ───

export abstract class AmbienceSound {
  protected nodes: AudioNode[] = [];
  protected sources: (AudioBufferSourceNode | OscillatorNode)[] = [];
  protected gainNode: GainNode | null = null;
  protected _running = false;
  protected loopTimer: ReturnType<typeof setInterval> | null = null;

  get running(): boolean { return this._running; }

  /** Create the sound graph, connect to the provided destination, return the output gain */
  abstract create(dest: AudioNode): GainNode;

  start(dest: AudioNode, volume: number): void {
    if (this._running) return;
    this._running = true;
    this.gainNode = this.create(dest);
    this.gainNode.gain.setValueAtTime(volume, getCtx().currentTime);
  }

  stop(): void {
    this._running = false;
    if (this.loopTimer) { clearInterval(this.loopTimer); this.loopTimer = null; }
    for (const s of this.sources) { try { s.stop(); } catch { /* already stopped */ } }
    for (const n of this.nodes) { try { n.disconnect(); } catch { /* ok */ } }
    this.sources = [];
    this.nodes = [];
    this.gainNode = null;
  }

  setVolume(v: number): void {
    if (this.gainNode) {
      this.gainNode.gain.setValueAtTime(v, getCtx().currentTime);
    }
  }
}

// ─── Helper: create noise buffer ───

function noiseBuffer(ctx: AudioContext, durationSec: number): AudioBuffer {
  const len = Math.floor(ctx.sampleRate * durationSec);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  return buf;
}

// ─── 🌧️ Natural sounds ───

/** Rain — layered filtered noise with varying intensity + random droplets */
export class RainSound extends AmbienceSound {
  create(dest: AudioNode): GainNode {
    const ctx = getCtx();
    const gain = ctx.createGain();
    gain.connect(dest);
    this.nodes.push(gain);

    // Layer 1: steady base rain (mid-frequency)
    const buf1 = noiseBuffer(ctx, 4);
    const src1 = ctx.createBufferSource();
    src1.buffer = buf1;
    src1.loop = true;
    const bp1 = ctx.createBiquadFilter();
    bp1.type = 'bandpass';
    bp1.frequency.value = 1200;
    bp1.Q.value = 0.4;
    const lp1 = ctx.createBiquadFilter();
    lp1.type = 'lowpass';
    lp1.frequency.value = 4000;
    const g1 = ctx.createGain();
    g1.gain.value = 0.35;
    src1.connect(bp1);
    bp1.connect(lp1);
    lp1.connect(g1);
    g1.connect(gain);
    src1.start();
    this.sources.push(src1);
    this.nodes.push(bp1, lp1, g1);

    // Layer 2: high-frequency shimmer (light rain on surfaces)
    const buf2 = noiseBuffer(ctx, 4);
    const src2 = ctx.createBufferSource();
    src2.buffer = buf2;
    src2.loop = true;
    const hp2 = ctx.createBiquadFilter();
    hp2.type = 'highpass';
    hp2.frequency.value = 3000;
    const g2 = ctx.createGain();
    g2.gain.value = 0.12;
    // Slow modulation for intensity variation
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.05; // very slow
    const lfoG = ctx.createGain();
    lfoG.gain.value = 0.06;
    lfo.connect(lfoG);
    lfoG.connect(g2.gain);
    src2.connect(hp2);
    hp2.connect(g2);
    g2.connect(gain);
    lfo.start();
    src2.start();
    this.sources.push(src2, lfo);
    this.nodes.push(hp2, g2, lfoG);

    // Layer 3: low rumble (heavy rain on roof)
    const buf3 = noiseBuffer(ctx, 4);
    const src3 = ctx.createBufferSource();
    src3.buffer = buf3;
    src3.loop = true;
    const lp3 = ctx.createBiquadFilter();
    lp3.type = 'lowpass';
    lp3.frequency.value = 500;
    const g3 = ctx.createGain();
    g3.gain.value = 0.15;
    src3.connect(lp3);
    lp3.connect(g3);
    g3.connect(gain);
    src3.start();
    this.sources.push(src3);
    this.nodes.push(lp3, g3);

    // Random droplet impacts
    const droplet = () => {
      if (!this._running) return;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      const freq = 2000 + Math.random() * 4000;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.3, ctx.currentTime + 0.03);
      g.gain.setValueAtTime(0.015 + Math.random() * 0.025, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.connect(g);
      g.connect(gain);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    };
    this.loopTimer = setInterval(() => {
      // Variable density: 1-3 drops per tick
      const count = Math.random() < 0.3 ? 2 : 1;
      for (let i = 0; i < count; i++) {
        if (Math.random() < 0.5) droplet();
      }
    }, 60);

    return gain;
  }
}

/** Thunderstorm — heavy rain + thunder rumbles + lightning cracks */
export class ThunderstormSound extends AmbienceSound {
  create(dest: AudioNode): GainNode {
    const ctx = getCtx();
    const gain = ctx.createGain();
    gain.connect(dest);
    this.nodes.push(gain);

    // Heavy rain base — denser, lower frequency
    const buf = noiseBuffer(ctx, 4);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 700;
    bp.Q.value = 0.3;
    const lp2 = ctx.createBiquadFilter();
    lp2.type = 'lowpass';
    lp2.frequency.value = 3000;
    const rainGain = ctx.createGain();
    rainGain.gain.value = 0.7;
    src.connect(bp);
    bp.connect(lp2);
    lp2.connect(rainGain);
    rainGain.connect(gain);
    src.start();
    this.sources.push(src);
    this.nodes.push(bp, lp2, rainGain);

    // Thunder rumble — deep low-frequency rolling
    const thunderRumble = () => {
      if (!this._running) return;
      const now = ctx.currentTime;
      const dur = 2 + Math.random() * 3;
      const tBuf = noiseBuffer(ctx, dur);
      const tSrc = ctx.createBufferSource();
      tSrc.buffer = tBuf;
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 80 + Math.random() * 80;
      lp.Q.value = 0.7;
      const tGain = ctx.createGain();
      tGain.gain.setValueAtTime(0, now);
      tGain.gain.linearRampToValueAtTime(0.4 + Math.random() * 0.3, now + 0.15);
      // Rolling decay with slight bumps
      tGain.gain.setValueAtTime(0.3 + Math.random() * 0.2, now + dur * 0.3);
      tGain.gain.exponentialRampToValueAtTime(0.001, now + dur);
      tSrc.connect(lp);
      lp.connect(tGain);
      tGain.connect(gain);
      tSrc.start(now);
      tSrc.stop(now + dur);
    };

    // Lightning crack — sharp high-frequency burst
    const lightningCrack = () => {
      if (!this._running) return;
      const now = ctx.currentTime;
      const crackDur = 0.08 + Math.random() * 0.05;
      const cBuf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * crackDur), ctx.sampleRate);
      const data = cBuf.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (data.length * 0.08));
      }
      const cSrc = ctx.createBufferSource();
      cSrc.buffer = cBuf;
      const hp = ctx.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.value = 2000 + Math.random() * 3000;
      const cGain = ctx.createGain();
      cGain.gain.setValueAtTime(0.5 + Math.random() * 0.3, now);
      cGain.gain.exponentialRampToValueAtTime(0.001, now + crackDur + 0.05);
      cSrc.connect(hp);
      hp.connect(cGain);
      cGain.connect(gain);
      cSrc.start(now);
      cSrc.stop(now + crackDur + 0.06);
      // Follow with rumble
      setTimeout(() => thunderRumble(), (0.1 + Math.random() * 0.5) * 1000);
    };

    this.loopTimer = setInterval(() => {
      const r = Math.random();
      if (r < 0.03) lightningCrack();       // ~3% chance per second: crack + rumble
      else if (r < 0.07) thunderRumble();    // ~4% chance: distant rumble only
    }, 1000);

    return gain;
  }
}

/** Ocean waves — slow amplitude-modulated noise */
export class OceanSound extends AmbienceSound {
  create(dest: AudioNode): GainNode {
    const ctx = getCtx();
    const gain = ctx.createGain();
    gain.connect(dest);
    this.nodes.push(gain);

    const buf = noiseBuffer(ctx, 4);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;

    const bp = ctx.createBiquadFilter();
    bp.type = 'lowpass';
    bp.frequency.value = 800;

    // LFO for wave rhythm
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.12; // ~7s wave cycle
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.35;

    const waveGain = ctx.createGain();
    waveGain.gain.value = 0.5;

    lfo.connect(lfoGain);
    lfoGain.connect(waveGain.gain);
    src.connect(bp);
    bp.connect(waveGain);
    waveGain.connect(gain);
    lfo.start();
    src.start();

    this.sources.push(src, lfo);
    this.nodes.push(bp, lfoGain, waveGain);

    return gain;
  }
}

/** Stream / Creek — higher-frequency filtered noise with gentle modulation */
export class StreamSound extends AmbienceSound {
  create(dest: AudioNode): GainNode {
    const ctx = getCtx();
    const gain = ctx.createGain();
    gain.connect(dest);
    this.nodes.push(gain);

    const buf = noiseBuffer(ctx, 4);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;

    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 2500;
    bp.Q.value = 0.6;

    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.3;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 600;
    lfo.connect(lfoGain);
    lfoGain.connect(bp.frequency);

    const streamGain = ctx.createGain();
    streamGain.gain.value = 0.4;

    src.connect(bp);
    bp.connect(streamGain);
    streamGain.connect(gain);
    lfo.start();
    src.start();

    this.sources.push(src, lfo);
    this.nodes.push(bp, lfoGain, streamGain);

    return gain;
  }
}

/** Birds — realistic chirps with FM synthesis, varied timing, stereo spread */
export class BirdsSound extends AmbienceSound {
  create(dest: AudioNode): GainNode {
    const ctx = getCtx();
    const gain = ctx.createGain();
    gain.connect(dest);
    this.nodes.push(gain);

    const chirp = () => {
      if (!this._running) return;
      const now = ctx.currentTime;
      const baseFreq = 2200 + Math.random() * 2000;
      const noteCount = 1 + Math.floor(Math.random() * 4); // 1-4 note phrase
      const pan = (Math.random() - 0.5) * 1.8;

      const panner = ctx.createStereoPanner();
      panner.pan.value = pan;
      panner.connect(gain);

      let offset = 0;
      for (let n = 0; n < noteCount; n++) {
        const dur = 0.05 + Math.random() * 0.12;
        const freq = baseFreq * (0.8 + Math.random() * 0.5);
        const t = now + offset;

        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        // Frequency sweep for natural bird sound
        osc.frequency.linearRampToValueAtTime(freq * (0.85 + Math.random() * 0.3), t + dur);

        const g = ctx.createGain();
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.06 + Math.random() * 0.04, t + dur * 0.15);
        g.gain.exponentialRampToValueAtTime(0.001, t + dur);

        osc.connect(g);
        g.connect(panner);
        osc.start(t);
        osc.stop(t + dur + 0.01);

        offset += dur + 0.02 + Math.random() * 0.06;
      }
    };

    this.loopTimer = setInterval(() => {
      if (Math.random() < 0.15) chirp();
    }, 400);

    return gain;
  }
}

/** Wind — slowly modulated lowpass noise */
export class WindSound extends AmbienceSound {
  create(dest: AudioNode): GainNode {
    const ctx = getCtx();
    const gain = ctx.createGain();
    gain.connect(dest);
    this.nodes.push(gain);

    const buf = noiseBuffer(ctx, 4);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;

    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 400;

    // Slow modulation of cutoff
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.08;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 250;
    lfo.connect(lfoGain);
    lfoGain.connect(lp.frequency);

    // Amplitude modulation for gusts
    const lfo2 = ctx.createOscillator();
    lfo2.type = 'sine';
    lfo2.frequency.value = 0.15;
    const lfo2Gain = ctx.createGain();
    lfo2Gain.gain.value = 0.25;

    const windGain = ctx.createGain();
    windGain.gain.value = 0.6;
    lfo2.connect(lfo2Gain);
    lfo2Gain.connect(windGain.gain);

    src.connect(lp);
    lp.connect(windGain);
    windGain.connect(gain);
    lfo.start();
    lfo2.start();
    src.start();

    this.sources.push(src, lfo, lfo2);
    this.nodes.push(lp, lfoGain, lfo2Gain, windGain);

    return gain;
  }
}

/** Crickets / Insects — rhythmic chirping with multiple overlapping crickets */
export class CricketsSound extends AmbienceSound {
  create(dest: AudioNode): GainNode {
    const ctx = getCtx();
    const gain = ctx.createGain();
    gain.connect(dest);
    this.nodes.push(gain);

    // Create 3-4 independent "crickets" with different rhythms
    const cricketCount = 3 + Math.floor(Math.random() * 2);
    const timers: ReturnType<typeof setInterval>[] = [];

    for (let c = 0; c < cricketCount; c++) {
      const baseFreq = 3800 + Math.random() * 1500; // each cricket has its own pitch
      const chirpRate = 600 + Math.random() * 400;   // ms between chirp bursts
      const burstLen = 3 + Math.floor(Math.random() * 4); // pulses per burst
      const pan = (Math.random() - 0.5) * 1.6; // stereo position

      const panner = ctx.createStereoPanner();
      panner.pan.value = pan;
      panner.connect(gain);
      this.nodes.push(panner);

      const doChirpBurst = () => {
        if (!this._running) return;
        const now = ctx.currentTime;
        for (let p = 0; p < burstLen; p++) {
          const t = now + p * 0.04; // rapid pulses ~25Hz
          const osc = ctx.createOscillator();
          osc.type = 'sine';
          osc.frequency.value = baseFreq + (Math.random() - 0.5) * 100;
          const g = ctx.createGain();
          g.gain.setValueAtTime(0, t);
          g.gain.linearRampToValueAtTime(0.04 + Math.random() * 0.02, t + 0.005);
          g.gain.linearRampToValueAtTime(0, t + 0.025);
          osc.connect(g);
          g.connect(panner);
          osc.start(t);
          osc.stop(t + 0.03);
        }
      };

      // Stagger start times
      const startDelay = Math.random() * chirpRate;
      const timer = setInterval(() => {
        if (Math.random() < 0.7) doChirpBurst(); // occasional silence for realism
      }, chirpRate);
      setTimeout(() => doChirpBurst(), startDelay);
      timers.push(timer);
    }

    // Store timers for cleanup
    const origStop = this.stop.bind(this);
    this.stop = () => {
      timers.forEach((t) => clearInterval(t));
      origStop();
    };

    return gain;
  }
}

// ─── 🏠 Environment sounds ───

/** Café — murmuring voices (filtered noise) + occasional clinks */
export class CafeSound extends AmbienceSound {
  create(dest: AudioNode): GainNode {
    const ctx = getCtx();
    const gain = ctx.createGain();
    gain.connect(dest);
    this.nodes.push(gain);

    // Background murmur
    const buf = noiseBuffer(ctx, 4);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;

    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 400;
    bp.Q.value = 0.8;

    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 1200;

    const murmurGain = ctx.createGain();
    murmurGain.gain.value = 0.5;

    src.connect(bp);
    bp.connect(lp);
    lp.connect(murmurGain);
    murmurGain.connect(gain);
    src.start();

    this.sources.push(src);
    this.nodes.push(bp, lp, murmurGain);

    // Occasional cup clinks
    const clink = () => {
      if (!this._running) return;
      const now = ctx.currentTime;
      const freq = 3000 + Math.random() * 2000;
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.04 + Math.random() * 0.03, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(g);
      g.connect(gain);
      osc.start(now);
      osc.stop(now + 0.08);
    };

    this.loopTimer = setInterval(() => {
      if (Math.random() < 0.06) clink();
    }, 500);

    return gain;
  }
}

/** Fireplace — crackling noise bursts */
export class FireplaceSound extends AmbienceSound {
  create(dest: AudioNode): GainNode {
    const ctx = getCtx();
    const gain = ctx.createGain();
    gain.connect(dest);
    this.nodes.push(gain);

    // Base warmth — low rumble
    const buf = noiseBuffer(ctx, 4);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 200;
    const baseGain = ctx.createGain();
    baseGain.gain.value = 0.3;
    src.connect(lp);
    lp.connect(baseGain);
    baseGain.connect(gain);
    src.start();
    this.sources.push(src);
    this.nodes.push(lp, baseGain);

    // Crackles
    const crackle = () => {
      if (!this._running) return;
      const now = ctx.currentTime;
      const dur = 0.02 + Math.random() * 0.04;
      const cBuf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
      const data = cBuf.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (data.length * 0.3));
      }
      const cSrc = ctx.createBufferSource();
      cSrc.buffer = cBuf;
      const hp = ctx.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.value = 1000 + Math.random() * 2000;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.1 + Math.random() * 0.15, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + dur + 0.02);
      cSrc.connect(hp);
      hp.connect(g);
      g.connect(gain);
      cSrc.start(now);
      cSrc.stop(now + dur + 0.02);
    };

    this.loopTimer = setInterval(() => {
      if (Math.random() < 0.35) crackle();
    }, 80);

    return gain;
  }
}

/** Keyboard typing — random key press sounds */
export class KeyboardSound extends AmbienceSound {
  create(dest: AudioNode): GainNode {
    const ctx = getCtx();
    const gain = ctx.createGain();
    gain.connect(dest);
    this.nodes.push(gain);

    const keyPress = () => {
      if (!this._running) return;
      const now = ctx.currentTime;
      const dur = 0.015 + Math.random() * 0.01;
      const kBuf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
      const data = kBuf.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (data.length * 0.15));
      }
      const src = ctx.createBufferSource();
      src.buffer = kBuf;
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = 800 + Math.random() * 1500;
      bp.Q.value = 1.5;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.08 + Math.random() * 0.06, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + dur + 0.02);
      src.connect(bp);
      bp.connect(g);
      g.connect(gain);
      src.start(now);
      src.stop(now + dur + 0.03);
    };

    // Typing bursts with pauses
    let typing = true;
    let burstCount = 0;
    this.loopTimer = setInterval(() => {
      if (typing) {
        if (Math.random() < 0.7) keyPress();
        burstCount++;
        if (burstCount > 15 + Math.random() * 20) {
          typing = false;
          burstCount = 0;
        }
      } else {
        burstCount++;
        if (burstCount > 5 + Math.random() * 10) {
          typing = true;
          burstCount = 0;
        }
      }
    }, 80);

    return gain;
  }
}

/** Library — very quiet ambience: soft air + occasional page turn */
export class LibrarySound extends AmbienceSound {
  create(dest: AudioNode): GainNode {
    const ctx = getCtx();
    const gain = ctx.createGain();
    gain.connect(dest);
    this.nodes.push(gain);

    // Quiet air / HVAC hum
    const buf = noiseBuffer(ctx, 4);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 300;
    const airGain = ctx.createGain();
    airGain.gain.value = 0.25;
    src.connect(lp);
    lp.connect(airGain);
    airGain.connect(gain);
    src.start();
    this.sources.push(src);
    this.nodes.push(lp, airGain);

    // Page turns
    const pageTurn = () => {
      if (!this._running) return;
      const now = ctx.currentTime;
      const dur = 0.15 + Math.random() * 0.1;
      const pBuf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
      const data = pBuf.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        const env = Math.sin((i / data.length) * Math.PI);
        data[i] = (Math.random() * 2 - 1) * env * 0.5;
      }
      const pSrc = ctx.createBufferSource();
      pSrc.buffer = pBuf;
      const hp = ctx.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.value = 2000;
      const g = ctx.createGain();
      g.gain.value = 0.04;
      pSrc.connect(hp);
      hp.connect(g);
      g.connect(gain);
      pSrc.start(now);
      pSrc.stop(now + dur);
    };

    this.loopTimer = setInterval(() => {
      if (Math.random() < 0.03) pageTurn();
    }, 1000);

    return gain;
  }
}

// ─── 🎵 Noise generators ───

/** White noise — flat spectrum */
export class WhiteNoiseSound extends AmbienceSound {
  create(dest: AudioNode): GainNode {
    const ctx = getCtx();
    const gain = ctx.createGain();
    gain.connect(dest);
    this.nodes.push(gain);

    const buf = noiseBuffer(ctx, 4);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    const g = ctx.createGain();
    g.gain.value = 0.3;
    src.connect(g);
    g.connect(gain);
    src.start();
    this.sources.push(src);
    this.nodes.push(g);

    return gain;
  }
}

/** Pink noise — 1/f spectrum (approximated with cascaded filters) */
export class PinkNoiseSound extends AmbienceSound {
  create(dest: AudioNode): GainNode {
    const ctx = getCtx();
    const gain = ctx.createGain();
    gain.connect(dest);
    this.nodes.push(gain);

    const buf = noiseBuffer(ctx, 4);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;

    // Approximate pink noise with cascaded lowpass filters
    const lp1 = ctx.createBiquadFilter();
    lp1.type = 'lowpass';
    lp1.frequency.value = 8000;
    const lp2 = ctx.createBiquadFilter();
    lp2.type = 'lowpass';
    lp2.frequency.value = 2000;
    const g = ctx.createGain();
    g.gain.value = 0.5;

    src.connect(lp1);
    lp1.connect(lp2);
    lp2.connect(g);
    g.connect(gain);
    src.start();

    this.sources.push(src);
    this.nodes.push(lp1, lp2, g);

    return gain;
  }
}

/** Brown noise — 1/f² spectrum (heavy lowpass) */
export class BrownNoiseSound extends AmbienceSound {
  create(dest: AudioNode): GainNode {
    const ctx = getCtx();
    const gain = ctx.createGain();
    gain.connect(dest);
    this.nodes.push(gain);

    const buf = noiseBuffer(ctx, 4);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;

    const lp1 = ctx.createBiquadFilter();
    lp1.type = 'lowpass';
    lp1.frequency.value = 400;
    const lp2 = ctx.createBiquadFilter();
    lp2.type = 'lowpass';
    lp2.frequency.value = 400;
    const g = ctx.createGain();
    g.gain.value = 0.8;

    src.connect(lp1);
    lp1.connect(lp2);
    lp2.connect(g);
    g.connect(gain);
    src.start();

    this.sources.push(src);
    this.nodes.push(lp1, lp2, g);

    return gain;
  }
}

/** Binaural beats — two slightly detuned sine waves (L/R) */
export class BinauralBeatsSound extends AmbienceSound {
  create(dest: AudioNode): GainNode {
    const ctx = getCtx();
    const gain = ctx.createGain();
    gain.connect(dest);
    this.nodes.push(gain);

    const baseFreq = 200; // carrier
    const beatFreq = 10;  // alpha waves (10 Hz)

    // Create stereo panner for left/right separation
    const oscL = ctx.createOscillator();
    oscL.type = 'sine';
    oscL.frequency.value = baseFreq;
    const panL = ctx.createStereoPanner();
    panL.pan.value = -1;
    const gL = ctx.createGain();
    gL.gain.value = 0.15;

    const oscR = ctx.createOscillator();
    oscR.type = 'sine';
    oscR.frequency.value = baseFreq + beatFreq;
    const panR = ctx.createStereoPanner();
    panR.pan.value = 1;
    const gR = ctx.createGain();
    gR.gain.value = 0.15;

    oscL.connect(gL);
    gL.connect(panL);
    panL.connect(gain);
    oscR.connect(gR);
    gR.connect(panR);
    panR.connect(gain);

    oscL.start();
    oscR.start();

    this.sources.push(oscL, oscR);
    this.nodes.push(panL, panR, gL, gR);

    return gain;
  }
}

// ─── 🕐 Clock tick sounds (preserved from v0.03) ───

/** Classic pendulum tick — frequency-dropping short pulse, once per second */
export class TickClassicSound extends AmbienceSound {
  create(dest: AudioNode): GainNode {
    const ctx = getCtx();
    const gain = ctx.createGain();
    gain.connect(dest);
    this.nodes.push(gain);

    const tick = () => {
      if (!this._running) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.03);
      g.gain.setValueAtTime(0.08, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.connect(g); g.connect(gain);
      osc.start(now); osc.stop(now + 0.06);
    };
    tick();
    this.loopTimer = setInterval(tick, 1000);
    return gain;
  }
}

/** Soft tick — gentle high-frequency pulse */
export class TickSoftSound extends AmbienceSound {
  create(dest: AudioNode): GainNode {
    const ctx = getCtx();
    const gain = ctx.createGain();
    gain.connect(dest);
    this.nodes.push(gain);

    const tick = () => {
      if (!this._running) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 1200;
      g.gain.setValueAtTime(0.04, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(g); g.connect(gain);
      osc.start(now); osc.stop(now + 0.04);
    };
    tick();
    this.loopTimer = setInterval(tick, 1000);
    return gain;
  }
}

/** Mechanical clock — square wave + resonant harmonic */
export class TickMechanicalSound extends AmbienceSound {
  create(dest: AudioNode): GainNode {
    const ctx = getCtx();
    const gain = ctx.createGain();
    gain.connect(dest);
    this.nodes.push(gain);

    const tick = () => {
      if (!this._running) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.02);
      g.gain.setValueAtTime(0.06, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(g); g.connect(gain);
      osc.start(now); osc.stop(now + 0.04);

      const osc2 = ctx.createOscillator();
      const g2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.value = 1500;
      g2.gain.setValueAtTime(0.02, now + 0.01);
      g2.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc2.connect(g2); g2.connect(gain);
      osc2.start(now + 0.01); osc2.stop(now + 0.05);
    };
    tick();
    this.loopTimer = setInterval(tick, 1000);
    return gain;
  }
}

/** Wooden clock — bandpass-filtered noise impulse */
export class TickWoodenSound extends AmbienceSound {
  create(dest: AudioNode): GainNode {
    const ctx = getCtx();
    const gain = ctx.createGain();
    gain.connect(dest);
    this.nodes.push(gain);

    const tick = () => {
      if (!this._running) return;
      const now = ctx.currentTime;
      const bufSize = Math.floor(ctx.sampleRate * 0.03);
      const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufSize * 0.2));
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = 1000;
      bp.Q.value = 2;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.12, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      src.connect(bp); bp.connect(g); g.connect(gain);
      src.start(now); src.stop(now + 0.05);
    };
    tick();
    this.loopTimer = setInterval(tick, 1000);
    return gain;
  }
}
