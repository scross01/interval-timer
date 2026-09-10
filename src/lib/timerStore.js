import { writable, derived } from 'svelte/store';

const TIMER_STATES = {
  IDLE: 'idle',
  RUNNING: 'running',
  PAUSED: 'paused',
  COOLDOWN: 'cooldown'
};

const DURATION_KEY = 'interval-timer-duration';
const VALID_DURATIONS = new Set([120, 180]);

function loadDuration() {
  try {
    const raw = localStorage.getItem(DURATION_KEY);
    const n = Number(raw);
    if (VALID_DURATIONS.has(n)) return n;
  } catch {
    // storage unavailable
  }
  return 120;
}

function saveDuration(duration) {
  try {
    localStorage.setItem(DURATION_KEY, String(duration));
  } catch {
    // storage unavailable
  }
}

function createTimerStore() {
  const initialDuration = loadDuration();
  const { subscribe, set, update } = writable({
    timeLeft: initialDuration,
    timerDuration: initialDuration,
    state: TIMER_STATES.IDLE,
    isCooldown: false,
    roundsCompleted: 0
  });

  return {
    subscribe,
    set,
    update,
    start: () => update(state => {
      if (state.state === TIMER_STATES.IDLE || state.state === TIMER_STATES.PAUSED) {
        if (state.isCooldown) {
          return {
            ...state,
            state: TIMER_STATES.COOLDOWN,
            timeLeft: state.timeLeft > 0 ? state.timeLeft : 30
          };
        }
        const timeLeft = state.timeLeft > 0 ? state.timeLeft : state.timerDuration;
        return {
          ...state,
          state: TIMER_STATES.RUNNING,
          timeLeft
        };
      }
      return state;
    }),
    pause: () => update(state => {
      if (state.state === TIMER_STATES.RUNNING || state.state === TIMER_STATES.COOLDOWN) {
        return { ...state, state: TIMER_STATES.PAUSED };
      }
      return state;
    }),
    reset: () => update(state => ({
      timeLeft: state.timerDuration,
      timerDuration: state.timerDuration,
      state: TIMER_STATES.IDLE,
      isCooldown: false,
      roundsCompleted: 0
    })),
    setDuration: (duration) => update(state => {
      if (state.state === TIMER_STATES.IDLE) {
        saveDuration(duration);
        return { ...state, timerDuration: duration, timeLeft: duration };
      }
      return state;
    }),
    restartMainTimer: () => update(state => ({
      ...state,
      state: TIMER_STATES.RUNNING,
      isCooldown: false,
      timeLeft: state.timerDuration
    }))
  };
}

export const timerStore = createTimerStore();

export const formattedTime = derived(timerStore, $timerStore => {
  const minutes = Math.floor($timerStore.timeLeft / 60);
  const seconds = $timerStore.timeLeft % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

/** Idle is neutral — phase hues only for live work / warning / cooldown. */
export const timerColor = derived(timerStore, $timerStore => {
  if ($timerStore.state === 'idle') return 'neutral';
  if ($timerStore.isCooldown) return 'red';
  if ($timerStore.timeLeft <= 30) return 'yellow';
  return 'green';
});

export const statusLabel = derived(
  [timerStore, timerColor],
  ([$timerStore, $timerColor]) => {
    if ($timerStore.state === 'idle') return 'READY';
    if ($timerStore.state === 'paused') {
      if ($timerStore.isCooldown) return 'PAUSED · COOLDOWN';
      if ($timerColor === 'yellow') return 'PAUSED · FINAL 30S';
      return 'PAUSED';
    }
    if ($timerStore.isCooldown || $timerColor === 'red') return 'COOLDOWN';
    if ($timerColor === 'yellow') return 'FINAL 30S';
    return 'WORKOUT';
  }
);

export const onboardVisible = writable(false);
