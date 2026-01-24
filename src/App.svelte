<script>
  import TimerDisplay from './components/TimerDisplay.svelte';
  import ControlPanel from './components/ControlPanel.svelte';
  import { timerStore } from './lib/timerStore';
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
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    box-sizing: border-box;
    position: fixed;
    top: 0;
    left: 0;
  }
  
  .timer-section {
    flex: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    box-sizing: border-box;
    min-height: 60vh;
    max-height: 70vh;
  }
  
  .controls-section {
    width: 100%;
    padding: 1rem;
    box-sizing: border-box;
    min-height: 25vh;
    max-height: 35vh;
  }
  
  /* Responsive layout based on orientation */
  @media (orientation: landscape) {
    .timer-section {
      min-height: 65vh;
      max-height: 75vh;
      flex: 1.5;
    }
    
    .controls-section {
      padding: 0.8rem;
      min-height: 20vh;
      max-height: 30vh;
    }
  }
  
  /* Extra small screens */
  @media (max-width: 360px) {
    .timer-section {
      min-height: 45vh;
      max-height: 60vh;
      padding: 0.5rem;
    }
    
    .controls-section {
      padding: 0.5rem;
      min-height: 35vh;
      max-height: 45vh;
    }
  }
  
</style>
