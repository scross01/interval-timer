<script>
  import { timerStore, onboardVisible } from '../lib/timerStore';
  import { playStartBeeps, playEndBeeps, playWarningBeep, armAudio, stopBeeps } from '../lib/audio';
  import { onDestroy, onMount } from 'svelte';
  import { get } from 'svelte/store';

  const COOLDOWN_SECONDS = 30;
  const TICK_MS = 200;
  const RESET_HOLD_MS = 800;
  const ONBOARD_KEY = 'interval-timer-onboard-seen';

  let tickTimer = null;
  let phaseEndsAt = 0;
  let warningPlayed = false;
  let wakeLock = null;
  let resetHoldTimer = null;
  let resetHoldProgress = 0;
  let showOnboard = false;

  $: isIdle = $timerStore.state === 'idle';
  $: isRunning = $timerStore.state === 'running';
  $: isCooldownActive = $timerStore.state === 'cooldown';
  $: isPaused = $timerStore.state === 'paused';
  $: canPause = isRunning || isCooldownActive;
  $: canStart = !isRunning && !isCooldownActive && $timerStore.timeLeft > 0;
  $: startLabel = isPaused ? 'RESUME' : 'START';
  $: workMinutesLabel = Math.round($timerStore.timerDuration / 60);

  function clearTick() {
    if (tickTimer) {
      clearInterval(tickTimer);
      tickTimer = null;
    }
  }

  async function requestWakeLock() {
    if (!('wakeLock' in navigator)) return;
    try {
      wakeLock = await navigator.wakeLock.request('screen');
      wakeLock.addEventListener('release', () => {
        wakeLock = null;
      });
    } catch {
      wakeLock = null;
    }
  }

  function releaseWakeLock() {
    if (wakeLock) {
      wakeLock.release().catch(() => {});
      wakeLock = null;
    }
  }

  function armPhase(durationSeconds) {
    phaseEndsAt = Date.now() + durationSeconds * 1000;
    clearTick();
    tickTimer = setInterval(syncFromClock, TICK_MS);
    syncFromClock();
  }

  function remainingFromClock() {
    return Math.max(0, Math.ceil((phaseEndsAt - Date.now()) / 1000));
  }

  function enterCooldown(state) {
    playEndBeeps();
    warningPlayed = false;
    phaseEndsAt = Date.now() + COOLDOWN_SECONDS * 1000;
    clearTick();
    tickTimer = setInterval(syncFromClock, TICK_MS);
    return {
      ...state,
      state: 'cooldown',
      isCooldown: true,
      timeLeft: COOLDOWN_SECONDS,
      roundsCompleted: state.roundsCompleted + 1
    };
  }

  function finishCooldown() {
    clearTick();
    warningPlayed = false;
    const { timerDuration } = get(timerStore);
    // Restart before beeps so digits never paint 00:00 between phases
    timerStore.restartMainTimer();
    armPhase(timerDuration);
    playStartBeeps();
  }

  function syncFromClock() {
    const left = remainingFromClock();
    const snapshot = get(timerStore);

    if (snapshot.state === 'paused' || snapshot.state === 'idle') {
      return;
    }

    if (snapshot.state === 'cooldown' || snapshot.isCooldown) {
      if (left <= 0) {
        finishCooldown();
        return;
      }
      if (left !== snapshot.timeLeft) {
        timerStore.update(s =>
          s.state === 'cooldown' || s.isCooldown ? { ...s, timeLeft: left } : s
        );
      }
      return;
    }

    if (left <= 30 && left > 0 && !warningPlayed) {
      playWarningBeep();
      warningPlayed = true;
    }

    if (left <= 0) {
      timerStore.update(s => (s.state === 'running' && !s.isCooldown ? enterCooldown(s) : s));
      return;
    }

    if (left !== snapshot.timeLeft) {
      timerStore.update(s =>
        s.state === 'running' && !s.isCooldown ? { ...s, timeLeft: left } : s
      );
    }
  }

  async function startTimer() {
    if (!canStart) return;
    const audioReady = await armAudio();
    const before = get(timerStore);
    timerStore.start();
    const remaining = before.isCooldown
      ? (before.timeLeft > 0 ? before.timeLeft : COOLDOWN_SECONDS)
      : (before.timeLeft > 0 ? before.timeLeft : before.timerDuration);
    if (audioReady) playStartBeeps();
    await requestWakeLock();
    armPhase(remaining);
  }

  function pauseTimer() {
    if (!canPause) return;
    stopBeeps();
    const left = remainingFromClock();
    timerStore.update(state => ({
      ...state,
      state: 'paused',
      timeLeft: left > 0 ? left : state.timeLeft
    }));
    clearTick();
  }

  function cancelResetHold() {
    if (resetHoldTimer) {
      clearInterval(resetHoldTimer);
      resetHoldTimer = null;
    }
    resetHoldProgress = 0;
  }

  function beginResetHold() {
    if (isIdle || resetHoldTimer) return;
    const started = Date.now();
    resetHoldTimer = setInterval(() => {
      resetHoldProgress = Math.min(1, (Date.now() - started) / RESET_HOLD_MS);
      if (resetHoldProgress >= 1) {
        cancelResetHold();
        resetTimer();
      }
    }, 40);
  }

  function onResetKeydown(e) {
    if (e.repeat) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      beginResetHold();
    }
  }

  function onResetKeyup(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      cancelResetHold();
    }
  }

  function resetTimer() {
    cancelResetHold();
    stopBeeps();
    timerStore.reset();
    clearTick();
    phaseEndsAt = 0;
    warningPlayed = false;
    releaseWakeLock();
  }

  function setDuration(minutes) {
    if (!isIdle) return;
    timerStore.setDuration(minutes * 60);
  }

  function onVisibilityChange() {
    if (document.visibilityState === 'visible' && (isRunning || isCooldownActive)) {
      syncFromClock();
    }
  }

  function dismissOnboard() {
    showOnboard = false;
    onboardVisible.set(false);
    try {
      localStorage.setItem(ONBOARD_KEY, '1');
    } catch {
      // ignore
    }
  }

  onMount(() => {
    try {
      showOnboard = !localStorage.getItem(ONBOARD_KEY);
    } catch {
      showOnboard = true;
    }
    onboardVisible.set(showOnboard && isIdle);
  });

  $: if (showOnboard) {
    onboardVisible.set(isIdle);
  } else {
    onboardVisible.set(false);
  }

  onDestroy(() => {
    clearTick();
    cancelResetHold();
    stopBeeps();
    releaseWakeLock();
  });
</script>

<svelte:document on:visibilitychange={onVisibilityChange} />

<div class="controls-container">
  {#if isIdle && showOnboard}
    <p class="onboard" role="status">
      <span class="onboard-step">1</span> Pick 2 or 3 min
      <span class="onboard-sep" aria-hidden="true">→</span>
      <span class="onboard-step">2</span> START
      <span class="onboard-contract">· 30s cooldown auto-loops until you RESET</span>
      <button type="button" class="onboard-dismiss" on:click={dismissOnboard} aria-label="Dismiss first-run hint">Got it</button>
    </p>
  {/if}

  {#if isIdle}
    <div class="duration-selector" role="group" aria-label="Interval length">
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
  {:else}
    <div
      class="duration-chip"
      aria-label={$timerStore.roundsCompleted === 0
        ? `Interval ${workMinutesLabel} minutes, then 30 second cooldown, auto-loop until reset`
        : `Interval ${workMinutesLabel} minutes`}
    >
      {workMinutesLabel} MIN INTERVAL{#if $timerStore.roundsCompleted === 0}<span class="chip-contract"> · 30s cooldown · auto-loop</span>{/if}
    </div>
  {/if}

  <div class="control-buttons" role="group" aria-label="Timer controls">
    <button
      type="button"
      class="control-btn start-btn"
      on:click={startTimer}
      disabled={!canStart}
      title="Start or resume (Enter / Space when focused)"
      aria-keyshortcuts="Enter Space"
    >
      {startLabel}
    </button>

    <button
      type="button"
      class="control-btn pause-btn"
      on:click={pauseTimer}
      disabled={!canPause}
      title="Pause workout or cooldown (Enter / Space when focused)"
      aria-keyshortcuts="Enter Space"
    >
      PAUSE
    </button>

    <button
      type="button"
      class="control-btn reset-btn {resetHoldProgress > 0 ? 'holding' : ''}"
      disabled={isIdle}
      aria-label="Reset timer — press and hold"
      title="Hold to reset"
      on:pointerdown={beginResetHold}
      on:pointerup={cancelResetHold}
      on:pointerleave={cancelResetHold}
      on:pointercancel={cancelResetHold}
      on:keydown={onResetKeydown}
      on:keyup={onResetKeyup}
    >
      <span class="reset-label">HOLD RESET</span>
      {#if resetHoldProgress > 0}
        <span
          class="reset-progress"
          style={`width: ${resetHoldProgress * 100}%`}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(resetHoldProgress * 100)}
          aria-label="Reset hold progress"
        ></span>
      {/if}
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

  .onboard {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 0.45rem;
    margin: 0;
    font-size: clamp(0.85rem, 2.4vw, 0.95rem);
    font-weight: 500;
    color: var(--status-ink);
    text-align: center;
  }

  .onboard-step {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.35rem;
    height: 1.35rem;
    border-radius: 999px;
    border: 1px solid var(--status-chip-border);
    font-size: 0.75rem;
    font-weight: 700;
  }

  .onboard-sep {
    opacity: 0.55;
  }

  .onboard-contract {
    font-weight: 500;
    opacity: 0.75;
  }

  .onboard-dismiss {
    font-family: var(--font-ui);
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    min-height: var(--touch-min);
    padding: 0.4rem 0.75rem;
    border: 1px solid var(--status-chip-border);
    border-radius: var(--radius-status);
    background: var(--status-chip-bg);
    color: var(--status-ink);
    cursor: pointer;
  }

  .onboard-dismiss:hover {
    background: var(--control-rest-hover);
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

  .duration-chip {
    display: flex;
    align-items: center;
    justify-content: center;
    align-self: center;
    font-family: var(--font-ui);
    font-size: var(--type-duration);
    font-weight: 700;
    letter-spacing: 0.06em;
    color: var(--status-ink);
    background: var(--status-chip-bg);
    border: 1px solid var(--status-chip-border);
    border-radius: var(--radius-control);
    min-height: var(--touch-min);
    padding: 0.55rem 1rem;
    margin-bottom: 0.25rem;
    text-align: center;
    flex-wrap: wrap;
  }

  .chip-contract {
    font-weight: 500;
    letter-spacing: 0.02em;
    opacity: 0.75;
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
    background-color: var(--action-work);
    color: #fff;
    box-shadow: var(--shadow-active-work);
  }

  .duration-btn.active:hover:not(:disabled) {
    background-color: var(--action-work-hover);
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

  .start-btn:disabled {
    background-color: var(--status-chip-bg);
    color: var(--status-ink);
    border: 1px solid var(--status-chip-border);
  }

  .start-btn {
    background-color: var(--action-work);
    color: #fff;
  }

  .start-btn:hover:not(:disabled) {
    background-color: var(--action-work-hover);
  }

  .pause-btn {
    background-color: var(--action-warning);
    color: var(--on-action-warning);
  }

  .pause-btn:hover:not(:disabled) {
    background-color: var(--action-warning-hover);
  }

  .reset-btn {
    position: relative;
    overflow: hidden;
    background-color: var(--action-cooldown);
    color: #fff;
  }

  .reset-btn:hover:not(:disabled) {
    background-color: var(--action-cooldown-hover);
  }

  .reset-btn.holding {
    background-color: var(--action-cooldown-hover);
  }

  .reset-label {
    position: relative;
    z-index: 1;
  }

  .reset-progress {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.28);
    pointer-events: none;
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
