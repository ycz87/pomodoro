// Generate a short beep notification sound using Web Audio API
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

export function playNotificationSound(): void {
  try {
    const ctx = getAudioContext();

    // Play a pleasant two-tone chime
    const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5
    const startTimes = [0, 0.15, 0.3];

    frequencies.forEach((freq, i) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(freq, ctx.currentTime);

      gainNode.gain.setValueAtTime(0, ctx.currentTime + startTimes[i]);
      gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + startTimes[i] + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + startTimes[i] + 0.5);

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.start(ctx.currentTime + startTimes[i]);
      oscillator.stop(ctx.currentTime + startTimes[i] + 0.5);
    });
  } catch {
    // Audio not available — silently ignore
  }
}

export function requestNotificationPermission(): void {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
}

export function sendNotification(title: string, body: string): void {
  // Browser notification
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, { body, icon: '/tomato.svg' });
  }

  // Always play sound
  playNotificationSound();
}
