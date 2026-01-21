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
  const { subscribe, set, update } = writable({
    timeLeft: 0,
    timerDuration: 120, // 2 minutes default
    state: TIMER_STATES.IDLE,
    isCooldown: false,
    colorState: 'green' // 'green', 'yellow', 'red'
  });

  return {
    subscribe,
    set,
    update,
    // Start the timer
    start: () => update(state => {
      if (state.state === TIMER_STATES.IDLE || state.state === TIMER_STATES.PAUSED) {
        return {
          ...state,
          state: TIMER_STATES.RUNNING,
          timeLeft: state.isCooldown ? 30 : state.timeLeft
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
    // Reset the timer
    reset: () => set({
      timeLeft: 0,
      timerDuration: 120,
      state: TIMER_STATES.IDLE,
      isCooldown: false,
      colorState: 'green'
    }),
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
      timeLeft: 30,
      colorState: 'red'
    })),
    // Restart main timer after cooldown
    restartMainTimer: () => update(state => ({
      ...state,
      state: TIMER_STATES.RUNNING,
      isCooldown: false,
      timeLeft: state.timerDuration,
      colorState: 'green'
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