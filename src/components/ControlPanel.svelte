<script>
  import { timerStore } from '../lib/timerStore';
  import { playStartBeeps, playEndBeeps, playWarningBeep } from '../lib/audio';
  import { onMount, onDestroy } from 'svelte';
  
  let timerInterval;
  let warningPlayed = false;
  
  // Timer logic
  function startTimer() {
    timerStore.start();
    playStartBeeps();
    
    // Clear any existing interval
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    
    timerInterval = setInterval(() => {
      timerStore.update(state => {
        if (state.state === 'running' && !state.isCooldown) {
          const newTimeLeft = state.timeLeft - 1;
          
          // Check for 30-second warning
          if (newTimeLeft === 30 && !warningPlayed) {
            playWarningBeep();
            warningPlayed = true;
          }
          
           // Check if timer completed
           if (newTimeLeft <= 0) {
             playEndBeeps();
             clearInterval(timerInterval);
             
             // Start cooldown timer immediately
             const cooldownInterval = setInterval(() => {
               timerStore.update(cooldownState => {
                 if (cooldownState.isCooldown) {
                   const newCooldownTime = cooldownState.timeLeft - 1;
                   
                    // Check if cooldown completed
                    if (newCooldownTime <= 0) {
                      clearInterval(cooldownInterval);
                      playStartBeeps(); // Beep when restarting
                      
                      // Reset warning flag before restarting
                      warningPlayed = false;
                      
                      // Use setTimeout to ensure clean restart outside reactive context
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
                 
                 // If not in cooldown state, clear interval
                 clearInterval(cooldownInterval);
                 return cooldownState;
               });
             }, 1000);
             
             // Return the cooldown state manually
             return {
               ...state,
               state: 'cooldown',
               isCooldown: true,
               timeLeft: 30,
               colorState: 'red'
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
    timerStore.setDuration(minutes * 60);
  }
  
  onDestroy(() => {
    if (timerInterval) {
      clearInterval(timerInterval);
    }
  });
</script>

<div class="controls-container-full">
  <div class="duration-selector-full">
    <button 
      class="duration-btn-full {($timerStore.timerDuration === 120 && $timerStore.state === 'idle') ? 'active' : ''}"
      on:click={() => setDuration(2)}
      disabled={$timerStore.state !== 'idle'}
    >
      2 MIN
    </button>
    <button 
      class="duration-btn-full {($timerStore.timerDuration === 180 && $timerStore.state === 'idle') ? 'active' : ''}"
      on:click={() => setDuration(3)}
      disabled={$timerStore.state !== 'idle'}
    >
      3 MIN
    </button>
  </div>
  
  <div class="control-buttons-full">
    <button 
      class="control-btn-full start-btn"
      on:click={startTimer}
      disabled={$timerStore.state === 'running'}
    >
      START
    </button>
     
    <button 
      class="control-btn-full pause-btn"
      on:click={pauseTimer}
      disabled={$timerStore.state !== 'running'}
    >
      PAUSE
    </button>
     
    <button 
      class="control-btn-full reset-btn"
      on:click={resetTimer}
      disabled={$timerStore.state === 'idle'}
    >
      RESET
    </button>
  </div>
</div>

<style>
  .controls-container-full {
    width: 100%;
    padding: 1rem;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
  }
  
  .duration-selector-full {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-bottom: 1rem;
    width: 100%;
  }
  
  .duration-btn-full {
    padding: 0.8rem 1.5rem;
    font-size: clamp(0.9rem, 2.5vw, 1.2rem);
    font-weight: bold;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    background-color: #f0f0f0;
    color: #333;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    min-width: 100px;
    flex: 1;
    max-width: 180px;
  }
  
  .duration-btn-full:hover:not(:disabled) {
    background-color: #e0e0e0;
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
  }
  
  .duration-btn-full:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .duration-btn-full.active {
    background-color: #4CAF50;
    color: white;
    box-shadow: 0 4px 8px rgba(76, 175, 80, 0.3);
  }
  
  .control-buttons-full {
    display: flex;
    gap: 1rem;
    justify-content: center;
    width: 100%;
  }
  
  .control-btn-full {
    padding: 1rem 2rem;
    font-size: clamp(1rem, 3vw, 1.4rem);
    font-weight: bold;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    min-width: 120px;
    flex: 1;
    max-width: 200px;
  }
  
  .control-btn-full:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  .control-btn-full:active:not(:disabled) {
    transform: translateY(0);
  }
  
  .control-btn-full:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .start-btn {
    background-color: #4CAF50;
    color: white;
  }
  
  .start-btn:hover:not(:disabled) {
    background-color: #45a049;
  }
  
  .pause-btn {
    background-color: #FFC107;
    color: #333;
  }
  
  .pause-btn:hover:not(:disabled) {
    background-color: #e6ac00;
  }
  
  .reset-btn {
    background-color: #F44336;
    color: white;
  }
  
  .reset-btn:hover:not(:disabled) {
    background-color: #d32f2f;
  }
  
  /* Landscape optimization - ensure buttons are touch-friendly */
  @media (orientation: landscape) {
    .duration-selector-full {
      gap: 0.8rem;
      margin-bottom: 0.8rem;
    }
    
    .duration-btn-full {
      padding: 0.7rem 1.2rem;
      font-size: clamp(0.8rem, 2.2vw, 1.1rem);
      min-width: 90px;
    }
    
    .control-buttons-full {
      gap: 0.8rem;
    }
    
    .control-btn-full {
      padding: 0.9rem 1.6rem;
      font-size: clamp(0.9rem, 2.5vw, 1.2rem);
      min-width: 100px;
    }
  }
  
  /* iPad Mini 6 specific optimizations */
  @media only screen 
    and (min-device-width: 744px) 
    and (max-device-width: 1133px) 
    and (-webkit-min-device-pixel-ratio: 2) {
      
    /* Portrait */
    @media (orientation: portrait) {
      .duration-btn-full {
        padding: 0.9rem 1.6rem;
        font-size: clamp(1rem, 2.8vw, 1.3rem);
        min-width: 110px;
      }
      
      .control-btn-full {
        padding: 1.1rem 2.2rem;
        font-size: clamp(1.1rem, 3.2vw, 1.5rem);
        min-width: 130px;
      }
    }
    
    /* Landscape - touch-friendly buttons */
    @media (orientation: landscape) {
      .duration-btn-full {
        padding: 0.8rem 1.4rem;
        font-size: clamp(0.9rem, 2.5vw, 1.2rem);
        min-width: 100px;
      }
      
      .control-btn-full {
        padding: 1rem 1.8rem;
        font-size: clamp(1rem, 2.8vw, 1.3rem);
        min-width: 110px;
      }
    }
  }
  
  /* Firefox specific adjustments */
  @-moz-document url-prefix() {
    .control-btn-full {
      -moz-transition: all 0.2s ease;
    }
  }
  
  /* Small screens - stack buttons vertically */
  @media (max-width: 480px) {
    .control-buttons-full {
      flex-direction: column;
      gap: 0.8rem;
    }
    
    .control-btn-full {
      width: 100%;
      padding: 1rem;
    }
    
    .duration-selector-full {
      flex-direction: column;
      gap: 0.8rem;
    }
    
    .duration-btn-full {
      width: 100%;
    }
  }
</style>