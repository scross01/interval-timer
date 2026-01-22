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
  <div class="timer-display-full">
    <TimerDisplay />
  </div>
  
  <div class="controls-container">
    <ControlPanel />
  </div>
</main>

<style>
  .app-container {
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    box-sizing: border-box;
  }
  
  .timer-display-full {
    flex: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0.8rem;
    box-sizing: border-box;
  }
  
  .controls-container {
    width: 100%;
    padding: 0.8rem;
    box-sizing: border-box;
  }
  
  /* Base layout - maximize timer visibility */
  .timer-display-full {
    min-height: 55vh;
  }
  
  /* Landscape optimization - maximize horizontal space */
  @media (orientation: landscape) {
    .timer-display-full {
      min-height: 65vh;
      flex: 2;
    }
    
    .controls-container {
      padding: 0.6rem;
      min-height: 28vh;
    }
  }
  
  /* iPad Mini 6 specific optimizations */
  @media only screen 
    and (min-device-width: 744px) 
    and (max-device-width: 1133px) 
    and (-webkit-min-device-pixel-ratio: 2) {
      
    /* Portrait */
    @media (orientation: portrait) {
      .timer-display-full {
        min-height: 60vh;
        flex: 2.5;
      }
    }
    
    /* Landscape - maximize screen usage */
    @media (orientation: landscape) {
      .timer-display-full {
        min-height: 70vh;
        flex: 2.5;
      }
      
      .controls-container {
        min-height: 25vh;
        padding: 0.5rem;
      }
    }
  }
  
  /* Firefox specific adjustments */
  @-moz-document url-prefix() {
    .timer-display-full {
      min-height: calc(60vh + 2px);
    }
    
    @media (orientation: landscape) {
      .timer-display-full {
        min-height: calc(68vh + 2px);
      }
    }
  }
  
  /* Small screens */
  @media (max-width: 480px) {
    .timer-display-full {
      min-height: 55vh;
      padding: 0.8rem;
    }
    
    .controls-container {
      padding: 0.8rem;
    }
  }
</style>
