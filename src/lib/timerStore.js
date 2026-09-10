import { writable, derived } from 'svelte/store';

// Timer states
const TIMER_STATES = {
  IDLE: 'idle',
  RUNNING: 'running', 
  PAUSED: 'paused',
  COMPLETED: 'completed',
  COOLDOWN: 'cooldown'
};

// Create timer store
function createTimerStore() {
  const DEFAULT_DURATION = 120;
  const { subscribe, set, update } = writable({
    timeLeft: DEFAULT_DURATION,
    timerDuration: DEFAULT_DURATION,
    state: TIMER_STATES.IDLE,
    isCooldown: false
  });

  return {
    subscribe,
    set,
    update,
    // Start the timer
    start: () => update(state => {
      if (state.state === TIMER_STATES.IDLE || state.state === TIMER_STATES.PAUSED) {
        const timeLeft = state.isCooldown
          ? 30
          : (state.timeLeft > 0 ? state.timeLeft : state.timerDuration);
        return {
          ...state,
          state: TIMER_STATES.RUNNING,
          timeLeft
        };
      }
      return state;
    }),
    // Pause the timer
    pause: () => update(state => {
      if (state.state === TIMER_STATES.RUNNING) {
        return { ...state, state: TIMER_STATES.PAUSED };
      }
      return state;
    }),
    // Reset the timer (keeps the chosen work duration)
    reset: () => update(state => ({
      timeLeft: state.timerDuration,
      timerDuration: state.timerDuration,
      state: TIMER_STATES.IDLE,
      isCooldown: false
    })),
    // Set timer duration
    setDuration: (duration) => update(state => {
      if (state.state === TIMER_STATES.IDLE) {
        return { ...state, timerDuration: duration, timeLeft: duration };
      }
      return state;
    }),
    // Start cooldown
    startCooldown: () => update(state => ({
      ...state,
      state: TIMER_STATES.COOLDOWN,
      isCooldown: true,
      timeLeft: 30
    })),
    // Restart main timer after cooldown
    restartMainTimer: () => update(state => ({
      ...state,
      state: TIMER_STATES.RUNNING,
      isCooldown: false,
      timeLeft: state.timerDuration
    }))
  };
}

export const timerStore = createTimerStore();

// Derived store for formatted time display
export const formattedTime = derived(timerStore, $timerStore => {
  const minutes = Math.floor($timerStore.timeLeft / 60);
  const seconds = $timerStore.timeLeft % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

// Derived store for color state
export const timerColor = derived(timerStore, $timerStore => {
  if ($timerStore.isCooldown) {
    return 'red';
  } else if ($timerStore.timeLeft <= 30 && !$timerStore.isCooldown) {
    return 'yellow';
  } else {
    return 'green';
  }
});