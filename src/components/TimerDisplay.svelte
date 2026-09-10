<script>
  import { timerStore, formattedTime, timerColor } from '../lib/timerStore';

  $: statusLabel = $timerColor === 'red' && $timerStore.isCooldown
    ? 'COOLDOWN'
    : $timerStore.state === 'running'
      ? 'RUNNING'
      : $timerStore.state === 'paused'
        ? 'PAUSED'
        : 'READY';
</script>

<div class="timer-container">
  <div class="beacon {$timerColor}" aria-hidden="true"></div>
  <div
    class="timer-display {$timerColor}"
    role="timer"
    aria-live="off"
    aria-atomic="true"
  >
    {$formattedTime}
  </div>
  <div class="timer-status" aria-live="polite" aria-atomic="true">
    <span>{statusLabel}</span>
  </div>
</div>

<style>
  .timer-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    width: 100%;
    padding: 1rem;
    box-sizing: border-box;
  }

  .beacon {
    width: min(12rem, 40vw);
    height: 4px;
    border-radius: 999px;
    background: currentColor;
    box-shadow: 0 0 12px currentColor;
    opacity: 0.9;
  }

  .beacon.green { color: var(--phase-work); }
  .beacon.yellow { color: var(--phase-warning); }
  .beacon.red { color: var(--phase-cooldown); }

  @media (prefers-reduced-motion: reduce) {
    .beacon {
      box-shadow: none;
      height: 6px;
    }
  }

  .timer-display {
    font-family: 'Courier New', Courier, monospace;
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
    margin: 0.3rem 0;
    max-width: 96vw;
  }

  .timer-display.green {
    color: var(--phase-work);
  }

  .timer-display.yellow {
    color: var(--phase-warning);
  }

  .timer-display.red {
    color: var(--phase-cooldown);
  }

  .timer-status {
    font-size: var(--type-status);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: var(--status-ink);
    padding: 0.5rem 1rem;
    border-radius: 5px;
    background-color: var(--status-chip-bg);
    border: 1px solid var(--status-chip-border);
    min-width: 8rem;
    text-align: center;
  }

  /* Phase urgency without scale/opacity loops under reduced motion */
  .timer-display.yellow {
    animation: none;
  }

  .timer-display.red {
    animation: none;
  }

  .timer-display.yellow,
  .timer-display.red {
    outline: 3px solid currentColor;
    outline-offset: 6px;
    border-radius: var(--radius-status);
  }

  .timer-display.green {
    outline: none;
  }

  @media (prefers-reduced-motion: no-preference) {
    .timer-display.yellow {
      outline: none;
      animation: pulse 1s infinite alternate;
    }

    .timer-display.red {
      outline: none;
      animation: flash 0.5s infinite alternate;
    }
  }

  @keyframes pulse {
    from {
      transform: scale(1);
    }
    to {
      transform: scale(1.05);
    }
  }

  @keyframes flash {
    from {
      opacity: 1;
    }
    to {
      opacity: 0.8;
    }
  }

  @media (prefers-contrast: high) {
    .timer-display.green {
      color: var(--phase-work-deep);
    }

    .timer-display.yellow {
      color: var(--phase-warning-deep);
    }

    .timer-display.red {
      color: var(--phase-cooldown-deep);
    }
  }

  @media (orientation: landscape) and (max-height: 500px) {
    .timer-display {
      font-size: var(--type-display-landscape);
    }

    .timer-container {
      gap: 0.6rem;
      padding: 0.5rem;
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
