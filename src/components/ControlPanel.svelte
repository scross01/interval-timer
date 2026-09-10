<script>
  import { timerStore } from '../lib/timerStore';
  import { playStartBeeps, playEndBeeps, playWarningBeep } from '../lib/audio';
  import { onDestroy } from 'svelte';

  let timerInterval;
  let warningPlayed = false;

  $: isIdle = $timerStore.state === 'idle';
  $: isRunning = $timerStore.state === 'running';
  $: canStart = !isRunning && $timerStore.timeLeft > 0;

  function startTimer() {
    if (!canStart) return;
    timerStore.start();
    playStartBeeps();

    if (timerInterval) {
      clearInterval(timerInterval);
    }

    timerInterval = setInterval(() => {
      timerStore.update(state => {
        if (state.state === 'running' && !state.isCooldown) {
          const newTimeLeft = state.timeLeft - 1;

          if (newTimeLeft === 30 && !warningPlayed) {
            playWarningBeep();
            warningPlayed = true;
          }

          if (newTimeLeft <= 0) {
            playEndBeeps();
            clearInterval(timerInterval);

            const cooldownInterval = setInterval(() => {
              timerStore.update(cooldownState => {
                if (cooldownState.isCooldown) {
                  const newCooldownTime = cooldownState.timeLeft - 1;

                  if (newCooldownTime <= 0) {
                    clearInterval(cooldownInterval);
                    playStartBeeps();
                    warningPlayed = false;

                    setTimeout(() => {
                      timerStore.restartMainTimer();
                      startTimer();
                    }, 100);

                    return {
                      ...cooldownState,
                      timeLeft: 0
                    };
                  }

                  return {
                    ...cooldownState,
                    timeLeft: newCooldownTime
                  };
                }

                clearInterval(cooldownInterval);
                return cooldownState;
              });
            }, 1000);

            return {
              ...state,
              state: 'cooldown',
              isCooldown: true,
              timeLeft: 30
            };
          }

          return {
            ...state,
            timeLeft: newTimeLeft
          };
        }
        return state;
      });
    }, 1000);
  }

  function pauseTimer() {
    timerStore.pause();
    if (timerInterval) {
      clearInterval(timerInterval);
    }
  }

  function resetTimer() {
    timerStore.reset();
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    warningPlayed = false;
  }

  function setDuration(minutes) {
    if (!isIdle) return;
    timerStore.setDuration(minutes * 60);
  }

  onDestroy(() => {
    if (timerInterval) {
      clearInterval(timerInterval);
    }
  });
</script>

<div class="controls-container">
  <div class="duration-selector" role="group" aria-label="Work interval length">
    <button
      type="button"
      class="duration-btn {($timerStore.timerDuration === 120 && isIdle) ? 'active' : ''}"
      on:click={() => setDuration(2)}
      disabled={!isIdle}
      aria-pressed={$timerStore.timerDuration === 120}
    >
      2 MIN
    </button>
    <button
      type="button"
      class="duration-btn {($timerStore.timerDuration === 180 && isIdle) ? 'active' : ''}"
      on:click={() => setDuration(3)}
      disabled={!isIdle}
      aria-pressed={$timerStore.timerDuration === 180}
    >
      3 MIN
    </button>
  </div>

  <div class="control-buttons" role="group" aria-label="Timer controls">
    <button
      type="button"
      class="control-btn start-btn"
      on:click={startTimer}
      disabled={!canStart}
    >
      START
    </button>

    <button
      type="button"
      class="control-btn pause-btn"
      on:click={pauseTimer}
      disabled={!isRunning}
    >
      PAUSE
    </button>

    <button
      type="button"
      class="control-btn reset-btn"
      on:click={resetTimer}
      disabled={isIdle}
    >
      RESET
    </button>
  </div>
</div>

<style>
  .controls-container {
    width: 100%;
    padding: 1rem;
    padding-bottom: max(1rem, env(safe-area-inset-bottom));
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .duration-selector,
  .control-buttons {
    display: flex;
    gap: 0.8rem;
    justify-content: center;
    width: 100%;
    flex-wrap: wrap;
  }

  .duration-selector {
    margin-bottom: 0.25rem;
  }

  .duration-btn,
  .control-btn {
    font-family: var(--font-ui);
    font-weight: 700;
    border: none;
    border-radius: var(--radius-control);
    cursor: pointer;
    transition: background-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease, color 0.2s ease;
    box-shadow: var(--shadow-control);
    min-height: var(--touch-min);
    flex: 1;
  }

  .duration-btn {
    font-size: var(--type-duration);
    padding: 0.65rem 1.2rem;
    min-width: 88px;
    max-width: 160px;
    background-color: var(--control-rest);
    color: var(--control-text);
  }

  .duration-btn:hover:not(:disabled) {
    background-color: var(--control-rest-hover);
    transform: translateY(-2px);
    box-shadow: var(--shadow-control-hover);
  }

  .duration-btn:active:not(:disabled) {
    transform: translateY(0);
  }

  .duration-btn:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  .duration-btn.active {
    background-color: var(--phase-work);
    color: #fff;
    box-shadow: var(--shadow-active-work);
  }

  .duration-btn.active:hover:not(:disabled) {
    background-color: var(--phase-work-hover);
  }

  .control-btn {
    font-size: var(--type-control);
    padding: 0.85rem 1.4rem;
    min-width: 96px;
    max-width: 180px;
    letter-spacing: 0.04em;
  }

  .control-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: var(--shadow-control-hover);
  }

  .control-btn:active:not(:disabled) {
    transform: translateY(0);
  }

  .control-btn:disabled {
    opacity: 0.45;
    cursor: not-allowed;
    box-shadow: none;
  }

  .start-btn {
    background-color: var(--phase-work);
    color: #fff;
  }

  .start-btn:hover:not(:disabled) {
    background-color: var(--phase-work-hover);
  }

  .pause-btn {
    background-color: var(--phase-warning);
    color: var(--control-text);
  }

  .pause-btn:hover:not(:disabled) {
    background-color: var(--phase-warning-hover);
  }

  .reset-btn {
    background-color: var(--phase-cooldown);
    color: #fff;
  }

  .reset-btn:hover:not(:disabled) {
    background-color: var(--phase-cooldown-hover);
  }

  @media (prefers-color-scheme: light) {
    .start-btn,
    .reset-btn,
    .duration-btn.active {
      color: #fff;
    }

    .pause-btn {
      color: #fff;
    }
  }

  @media (orientation: landscape) {
    .duration-selector {
      gap: 0.6rem;
      margin-bottom: 0.35rem;
    }

    .duration-btn {
      max-width: 140px;
    }

    .control-buttons {
      gap: 0.6rem;
    }

    .control-btn {
      max-width: 160px;
      padding: 0.7rem 1.2rem;
    }
  }

  @media (max-width: 360px) {
    .controls-container {
      padding: 0.65rem;
      gap: 0.75rem;
    }

    .duration-btn,
    .control-btn {
      min-width: 0;
      max-width: none;
    }

    .duration-btn {
      padding: 0.55rem 0.7rem;
    }

    .control-btn {
      padding: 0.7rem 0.85rem;
    }
  }
</style>
