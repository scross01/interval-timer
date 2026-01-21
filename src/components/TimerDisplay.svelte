<script>
  import { timerStore, formattedTime, timerColor } from '../lib/timerStore';
  import { onMount, onDestroy } from 'svelte';
</script>

<div class="timer-container">
  <div class="timer-display {$timerColor}">
    {$formattedTime}
  </div>
  <div class="timer-status">
    {#if $timerStore.isCooldown}
      <span>COOLDOWN</span>
    {:else if $timerStore.state === 'running'}
      <span>RUNNING</span>
    {:else if $timerStore.state === 'paused'}
      <span>PAUSED</span>
    {:else}
      <span>READY</span>
    {/if}
  </div>
</div>

<style>
  .timer-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin: 2rem 0;
    padding: 1.5rem;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .timer-display {
    font-size: clamp(3rem, 10vw, 8rem);
    font-weight: bold;
    text-align: center;
    transition: all 0.3s ease;
    min-width: 120px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
    font-family: 'Courier New', monospace;
  }
  
  .timer-display.green {
    color: #4CAF50; /* Green */
  }
  
  .timer-display.yellow {
    color: #FFC107; /* Yellow */
    animation: pulse 1s infinite alternate;
  }
  
  .timer-display.red {
    color: #F44336; /* Red */
    animation: flash 0.5s infinite alternate;
  }
  
  .timer-status {
    font-size: clamp(1rem, 3vw, 1.5rem);
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: #666;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    background-color: rgba(255, 255, 255, 0.2);
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
</style>