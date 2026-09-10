import { writable } from 'svelte/store';

let audioContext = null;
let beepTimeouts = new Set();

export const audioBlocked = writable(false);

function initAudioContext() {
  if (!audioContext) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) {
      audioBlocked.set(true);
      return null;
    }
    audioContext = new Ctx();
    audioContext.addEventListener('statechange', () => {
      audioBlocked.set(isAudioBlocked());
    });
  }
  return audioContext;
}

async function ensureAudioReady() {
  const context = initAudioContext();
  if (!context) return null;
  if (context.state === 'suspended') {
    try {
      await context.resume();
    } catch {
      // Gesture missing or policy blocked
    }
  }
  audioBlocked.set(isAudioBlocked());
  return context;
}

export function getAudioState() {
  if (!audioContext) return 'uninitialized';
  return audioContext.state;
}

export function isAudioBlocked() {
  const state = getAudioState();
  return state === 'suspended' || state === 'closed';
}

/** Best-effort mid-session re-arm. Safe to call without a user gesture. */
export async function tryResumeAudio() {
  await ensureAudioReady();
  return !isAudioBlocked();
}

/** Clear any pending beep timers so PAUSE/RESET stop sound immediately. */
export function stopBeeps() {
  for (const id of beepTimeouts) {
    clearTimeout(id);
  }
  beepTimeouts.clear();
}

function scheduleBeep(fn, delayMs) {
  const id = setTimeout(() => {
    beepTimeouts.delete(id);
    fn();
  }, delayMs);
  beepTimeouts.add(id);
}

function createBeep(frequency, duration, volume = 0.1) {
  if (!audioContext || audioContext.state !== 'running') return;
  const context = audioContext;
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

function playMultipleBeeps(count = 3, frequency = 800, beepDuration = 0.1, interval = 0.2) {
  if (!audioContext || audioContext.state !== 'running') {
    audioBlocked.set(true);
    return;
  }
  for (let i = 0; i < count; i++) {
    scheduleBeep(() => {
      createBeep(frequency, beepDuration);
    }, i * interval * 1000);
  }
}

export async function armAudio() {
  return tryResumeAudio();
}

export async function playWarningBeep() {
  await tryResumeAudio();
  if (!audioContext || audioContext.state !== 'running') return;
  for (let i = 0; i < 5; i++) {
    scheduleBeep(() => {
      createBeep(1000, 0.05);
    }, i * 150);
  }
}

export async function playStartBeeps() {
  await tryResumeAudio();
  playMultipleBeeps(3, 800, 0.15, 0.2);
}

export async function playEndBeeps() {
  await tryResumeAudio();
  playMultipleBeeps(5, 600, 0.2, 0.15);
}

export function cleanupAudio() {
  stopBeeps();
  if (audioContext && audioContext.state !== 'closed') {
    audioContext.close().catch(console.error);
    audioContext = null;
  }
  audioBlocked.set(false);
}
