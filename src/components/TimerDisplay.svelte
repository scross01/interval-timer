<script>
  import { timerStore, formattedTime, timerColor, statusLabel, onboardVisible } from '../lib/timerStore';
  import { audioBlocked } from '../lib/audio';
  import { onDestroy } from 'svelte';

  let lastColor = 'neutral';
  let flare = false;
  let flareTimeout;

  $: workMinutes = Math.round($timerStore.timerDuration / 60);
  $: showLoopHint = $timerStore.state === 'idle' && !$onboardVisible;
  $: isTicking = $timerStore.state === 'running' || $timerStore.state === 'cooldown';
  $: showMuteGlyph = $timerStore.state !== 'idle' && $audioBlocked;

  $: if ($timerColor !== lastColor) {
    lastColor = $timerColor;
    // Flare on every live phase edge, including idle → first WORKOUT
    if ($timerColor !== 'neutral') {
      flare = true;
      clearTimeout(flareTimeout);
      flareTimeout = setTimeout(() => {
        flare = false;
      }, 220);
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        if ($timerColor === 'green') navigator.vibrate(20);
        else if ($timerColor === 'yellow') navigator.vibrate(35);
        else if ($timerColor === 'red') navigator.vibrate([25, 35, 25]);
      }
    }
  }

  onDestroy(() => {
    clearTimeout(flareTimeout);
  });
</script>

<div class="timer-container" class:motion-live={isTicking}>
  <div class="beacon {$timerColor}" class:flare aria-hidden="true"></div>
  <div
    class="timer-display {$timerColor}"
    role="timer"
    aria-live="off"
    aria-atomic="true"
  >
    {$formattedTime}
  </div>
  <div class="meta-row">
    <div class="timer-status" aria-live="polite" aria-atomic="true">
      <span>{$statusLabel}</span>
      {#if showMuteGlyph}
        <span class="mute-glyph" title="Sound is off" aria-label="Sound is off">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true">
            <path d="M11 5L6 9H3v6h3l5 4V5z" />
            <path d="M23 9l-6 6M17 9l6 6" />
          </svg>
        </span>
      {/if}
    </div>
    {#if $timerStore.roundsCompleted > 0}
      <div
        class="round-counter"
        aria-label={`Rounds completed: ${$timerStore.roundsCompleted}`}
      >
        <span class="round-label" aria-hidden="true">ROUNDS</span>
        <span class="round-value">{$timerStore.roundsCompleted.toString().padStart(2, '0')}</span>
      </div>
    {/if}
  </div>
  {#if showLoopHint}
    <p class="loop-hint loop-hint-full">{workMinutes} min interval · 30s cooldown · auto-restarts until you RESET</p>
    <p class="loop-hint loop-hint-short">{workMinutes}m interval · 30s cooldown · auto-loop</p>
  {/if}
</div>

<style>
  .timer-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.85rem;
    width: 100%;
    padding: 1rem;
    box-sizing: border-box;
  }

  .beacon {
    width: min(18rem, 56vw);
    height: 6px;
    border-radius: 999px;
    background: currentColor;
    box-shadow: 0 0 16px currentColor;
    opacity: 0.95;
  }

  .beacon.green { color: var(--phase-work); }
  .beacon.yellow { color: var(--phase-warning); }
  .beacon.red { color: var(--phase-cooldown); }
  .beacon.neutral { color: var(--status-ink); opacity: 0.45; box-shadow: none; }

  .beacon.flare {
    animation: beacon-flare 0.22s ease-out;
  }

  @keyframes beacon-flare {
    0% {
      transform: scaleY(2.4);
      opacity: 1;
    }
    100% {
      transform: scaleY(1);
      opacity: 0.95;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .beacon.flare {
      animation: none;
    }
  }

  @media (min-width: 768px) {
    .beacon {
      height: 8px;
      width: min(20rem, 48vw);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .beacon {
      box-shadow: none;
      height: 7px;
    }
  }

  .timer-display {
    font-family: var(--font-display);
    font-size: var(--type-display);
    font-weight: 700;
    line-height: 1;
    letter-spacing: -0.02em;
    font-variant-numeric: tabular-nums;
    text-align: center;
    white-space: nowrap;
    overflow-wrap: normal;
    word-break: keep-all;
    transition: color 0.3s ease;
    text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.3);
    width: 100%;
    margin: 0.2rem 0;
    max-width: 96vw;
  }

  .timer-display.green { color: var(--phase-work); }
  .timer-display.yellow { color: var(--phase-warning); }
  .timer-display.red { color: var(--phase-cooldown); }
  .timer-display.neutral { color: var(--status-ink); }

  .meta-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.65rem;
    flex-wrap: wrap;
  }

  .timer-status {
    font-size: var(--type-status);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: var(--status-ink);
    padding: 0.5rem 1rem;
    border-radius: var(--radius-status);
    background-color: var(--status-chip-bg);
    border: 1px solid var(--status-chip-border);
    min-width: 8rem;
    text-align: center;
  }

  .round-counter {
    display: inline-flex;
    align-items: baseline;
    gap: 0.4rem;
    font-family: var(--font-display);
    font-size: clamp(0.85rem, 2.5vw, 1rem);
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.08em;
    color: var(--status-ink);
    opacity: 0.9;
    padding: 0.35rem 0.55rem;
    border-radius: var(--radius-status);
    border: 1px solid var(--status-chip-border);
  }

  .round-label {
    font-family: var(--font-ui);
    font-size: 0.7em;
    letter-spacing: 0.12em;
    opacity: 0.75;
  }

  .round-value {
    font-variant-numeric: tabular-nums;
  }

  .loop-hint {
    margin: 0;
    font-size: clamp(0.8rem, 2.4vw, 0.95rem);
    font-weight: 500;
    letter-spacing: 0.02em;
    color: var(--status-ink);
    opacity: 0.72;
    text-align: center;
    max-width: 28rem;
    padding: 0 0.5rem;
  }

  .loop-hint-short {
    display: none;
  }

  .mute-glyph {
    display: inline-flex;
    align-items: center;
    margin-left: 0.4rem;
    opacity: 0.85;
    vertical-align: middle;
  }

  /* Reduced-motion phase emphasis */
  .timer-display.yellow,
  .timer-display.red {
    animation: none;
    outline: 3px solid currentColor;
    outline-offset: 6px;
    border-radius: var(--radius-status);
  }

  .timer-display.green,
  .timer-display.neutral {
    outline: none;
  }

  @media (prefers-reduced-motion: no-preference) {
    .motion-live .timer-display.yellow {
      outline: none;
      animation: pulse 1s infinite alternate;
    }

    .motion-live .timer-display.red {
      outline: none;
      animation: rest-pulse 0.7s infinite alternate;
    }

    .motion-live .beacon.red {
      animation: beacon-rest 0.7s infinite alternate;
    }
  }

  @keyframes pulse {
    from { transform: scale(1); }
    to { transform: scale(1.05); }
  }

  @keyframes rest-pulse {
    from {
      transform: scale(1);
      opacity: 1;
    }
    to {
      transform: scale(1.06);
      opacity: 0.88;
    }
  }

  @keyframes beacon-rest {
    from {
      transform: scaleY(1);
      opacity: 0.85;
    }
    to {
      transform: scaleY(1.8);
      opacity: 1;
    }
  }

  /* High-contrast deeps only on light canvas — dark base hues already pass large-text AA */
  @media (prefers-contrast: high) and (prefers-color-scheme: light) {
    .timer-display.green { color: var(--phase-work-deep); }
    .timer-display.yellow { color: var(--phase-warning-ember); }
    .timer-display.red { color: var(--phase-cooldown-deep); }
    .timer-display.neutral { color: var(--ink); }
  }

  @media (prefers-contrast: high) and (prefers-color-scheme: dark) {
    .timer-display.neutral { color: #ffffff; }
    .timer-status {
      color: #ffffff;
      border-color: rgba(255, 255, 255, 0.45);
    }
  }

  @media (orientation: landscape) and (max-height: 500px) {
    .timer-display {
      font-size: var(--type-display-landscape);
    }

    .timer-container {
      gap: 0.55rem;
      padding: 0.5rem;
    }

    .loop-hint-full {
      display: none;
    }

    .loop-hint-short {
      display: block;
      font-size: clamp(0.7rem, 2vw, 0.85rem);
    }
  }

  @media (prefers-color-scheme: light) {
    .timer-display {
      text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.06);
    }
  }

  @media (max-width: 360px) {
    .timer-display {
      font-size: var(--type-display-xs);
    }

    .timer-status {
      font-size: var(--type-status-xs);
      padding: 0.4rem 0.75rem;
      min-width: 6.5rem;
    }
  }
</style>
