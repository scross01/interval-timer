<script>
  import { timerStore, formattedTime, timerColor } from '../lib/timerStore';
  import { onMount, onDestroy } from 'svelte';
</script>

<div class="timer-container-full">
  <div class="timer-display-full {$timerColor}">
    {$formattedTime}
  </div>
  <div class="timer-status-full">
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
  .timer-container-full {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    width: 100%;
    padding: 1rem;
    box-sizing: border-box;
  }
  
  .timer-display-full {
    font-size: clamp(3.8rem, 18vw, 11rem);
    font-weight: bold;
    text-align: center;
    transition: all 0.3s ease;
    text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.3);
    font-family: 'Courier New', monospace;
    line-height: 1;
    width: 100%;
    margin: 0.5rem 0;
  }
  
  .timer-display-full.green {
    color: #4CAF50; /* Green */
  }
  
  .timer-display-full.yellow {
    color: #FFC107; /* Yellow */
    animation: pulse 1s infinite alternate;
  }
  
  .timer-display-full.red {
    color: #F44336; /* Red */
    animation: flash 0.5s infinite alternate;
  }
  
  .timer-status-full {
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
  
  /* Landscape optimization - maximize horizontal space */
  @media (orientation: landscape) {
    .timer-display-full {
      font-size: clamp(4.2rem, 22vw, 13rem);
    }
    
    .timer-status-full {
      font-size: clamp(1.1rem, 3vw, 1.4rem);
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
        font-size: clamp(4rem, 20vw, 12rem);
      }
    }
    
    /* Landscape - maximize screen usage */
    @media (orientation: landscape) {
      .timer-display-full {
        font-size: clamp(4.8rem, 26vw, 14rem);
        text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.3);
      }
      
      .timer-status-full {
        font-size: clamp(1.2rem, 3.5vw, 1.6rem);
        padding: 0.5rem 1rem;
      }
    }
  }
  
  /* Firefox specific adjustments */
  @-moz-document url-prefix() {
    .timer-display-full {
      -moz-font-smoothing: antialiased;
      -moz-text-size-adjust: none;
    }
    
    @media (orientation: landscape) {
      .timer-display-full {
        font-size: clamp(5rem, 28vw, 15rem);
      }
    }
  }
  
  /* Small screens */
  @media (max-width: 480px) {
    .timer-display-full {
      font-size: clamp(3.5rem, 18vw, 10rem);
    }
    
    .timer-status-full {
      font-size: clamp(0.9rem, 2.5vw, 1.2rem);
      padding: 0.4rem 0.8rem;
    }
  }
</style>