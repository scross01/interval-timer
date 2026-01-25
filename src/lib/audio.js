// Audio Manager for Interval Timer
// Handles all audio notifications for the timer

let audioContext = null;
let audioBufferCache = {};

// Initialize audio context
function initAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
}

// Create a beep sound with specific frequency and duration
function createBeep(frequency, duration, volume = 0.1) {
  const context = initAudioContext();
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();
  
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(frequency, context.currentTime);
  
  gainNode.gain.setValueAtTime(volume, context.currentTime);
  
  oscillator.connect(gainNode);
  gainNode.connect(context.destination);
  
  oscillator.start(context.currentTime);
  oscillator.stop(context.currentTime + duration);
}

// Play multiple beeps for start/end notifications
function playMultipleBeeps(count = 3, frequency = 800, beepDuration = 0.1, interval = 0.2) {
  const context = initAudioContext();
  
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      createBeep(frequency, beepDuration);
    }, i * interval * 1000);
  }
}

// Play warning beep (different pattern)
export function playWarningBeep() {
  const context = initAudioContext();
  
  // Create a more urgent beep pattern
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      createBeep(1000, 0.05);
    }, i * 150);
  }
}

// Play start beeps
export function playStartBeeps() {
  playMultipleBeeps(3, 800, 0.15, 0.2);
}

// Play end beeps
export function playEndBeeps() {
  playMultipleBeeps(5, 600, 0.2, 0.15);
}

// Clean up audio resources
export function cleanupAudio() {
  if (audioContext && audioContext.state !== 'closed') {
    audioContext.close().catch(console.error);
    audioContext = null;
  }
}