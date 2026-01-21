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

<main>
  <h1>Sports Timer</h1>
  
  <TimerDisplay />
  
  <ControlPanel />
  
  <div class="instructions">
    <p>Select timer duration (2 or 3 minutes) and click START</p>
    <p>Timer turns yellow at 30 seconds remaining</p>
    <p>Red cooldown period starts after timer completes</p>
    <p>Timer automatically restarts after cooldown</p>
  </div>
</main>

<style>
  main {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    width: 100%;
  }
  
  h1 {
    font-size: clamp(1.5rem, 4vw, 2.5rem);
    color: #333;
    margin-bottom: 2rem;
    background: linear-gradient(45deg, #4CAF50, #2E7D32);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .instructions {
    margin-top: 3rem;
    font-size: clamp(0.8rem, 2vw, 1rem);
    color: #666;
    line-height: 1.6;
    padding: 1rem;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    max-width: 600px;
  }
  
  .instructions p {
    margin: 0.5rem 0;
  }
  
  .instructions p::before {
    content: "• ";
    color: #4CAF50;
    margin-right: 0.5rem;
  }
</style>
