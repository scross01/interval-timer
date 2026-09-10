<script>
  import TimerDisplay from './components/TimerDisplay.svelte';
  import ControlPanel from './components/ControlPanel.svelte';
  import { cleanupAudio } from './lib/audio';
  import { onDestroy } from 'svelte';

  onDestroy(() => {
    cleanupAudio();
  });
</script>

<main class="app-container">
  <div class="timer-section">
    <TimerDisplay />
  </div>

  <div class="controls-section">
    <ControlPanel />
  </div>
</main>

<style>
  .app-container {
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    height: 100dvh;
    min-height: 100dvh;
    width: 100%;
    overflow: hidden;
    box-sizing: border-box;
    position: fixed;
    inset: 0;
    background: var(--canvas);
    color: var(--ink);
  }

  .timer-section {
    flex: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    padding-top: max(1rem, env(safe-area-inset-top));
    box-sizing: border-box;
    min-height: 58vh;
  }

  .controls-section {
    width: 100%;
    box-sizing: border-box;
    min-height: 0;
    flex-shrink: 0;
  }

  @media (orientation: landscape) {
    .timer-section {
      min-height: 0;
      flex: 1.6;
      padding: 0.75rem;
    }
  }

  @media (max-width: 360px) {
    .timer-section {
      min-height: 50vh;
      padding: 0.5rem;
    }
  }
</style>
