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

<div class="control-panel">
  <div class="duration-selector">
    <button 
      class="duration-btn {($timerStore.timerDuration === 120 && $timerStore.state === 'idle') ? 'active' : ''}"
      on:click={() => setDuration(2)}
      disabled={$timerStore.state !== 'idle'}
    >
      2 MIN
    </button>
    <button 
      class="duration-btn {($timerStore.timerDuration === 180 && $timerStore.state === 'idle') ? 'active' : ''}"
      on:click={() => setDuration(3)}
      disabled={$timerStore.state !== 'idle'}
    >
      3 MIN
    </button>
  </div>
  
  <div class="control-buttons">
    <button 
      class="control-btn start-btn"
      on:click={startTimer}
      disabled={$timerStore.state === 'running'}
    >
      START
    </button>
    
    <button 
      class="control-btn pause-btn"
      on:click={pauseTimer}
      disabled={$timerStore.state !== 'running'}
    >
      PAUSE
    </button>
    
    <button 
      class="control-btn reset-btn"
      on:click={resetTimer}
      disabled={$timerStore.state === 'idle'}
    >
      RESET
    </button>
  </div>
</div>

<style>
  .control-panel {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    align-items: center;
    margin: 2rem 0;
    padding: 1.5rem;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .duration-selector {
    display: flex;
    gap: 1rem;
  }
  
  .duration-btn {
    padding: 0.8rem 1.5rem;
    font-size: clamp(0.8rem, 2vw, 1rem);
    font-weight: bold;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    background-color: #f0f0f0;
    color: #333;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .duration-btn:hover:not(:disabled) {
    background-color: #e0e0e0;
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
  }
  
  .duration-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .duration-btn.active {
    background-color: #4CAF50;
    color: white;
    box-shadow: 0 4px 8px rgba(76, 175, 80, 0.3);
  }
  
  .control-buttons {
    display: flex;
    gap: 1rem;
  }
  
  .control-btn {
    padding: 1rem 2rem;
    font-size: clamp(0.9rem, 2.5vw, 1.2rem);
    font-weight: bold;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .control-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  .control-btn:active:not(:disabled) {
    transform: translateY(0);
  }
  
  .control-btn:disabled {
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
</style>