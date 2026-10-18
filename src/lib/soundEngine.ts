// A lightweight, zero-asset sound engine using the Web Audio API.
// This ensures instant feedback with no network requests, perfect for low-bandwidth environments.

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
}

function playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume = 0.1) {
  // Respect user's device silent mode / preferences if needed, but for UI sounds we play directly.
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, ctx.currentTime);
  
  // Smooth fade out to prevent clicking sounds
  gainNode.gain.setValueAtTime(volume, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + duration);
}

export const playClick = () => playTone(800, 0.05, 'square', 0.05);
export const playSuccess = () => {
  playTone(600, 0.1, 'sine', 0.1);
  setTimeout(() => playTone(800, 0.15, 'sine', 0.1), 100);
};
export const playError = () => playTone(200, 0.3, 'sawtooth', 0.1);
export const playNotification = () => {
  playTone(1000, 0.1, 'sine', 0.08);
  setTimeout(() => playTone(1200, 0.2, 'sine', 0.08), 150);
};