# AGENTS.md - Sports Timer Development Guidelines

This document provides comprehensive guidelines for AI agents and developers working on the Sports Timer application.

## 🚀 Build, Lint, and Test Commands

### Build Commands

```bash
# Production build
npm run build

# Build and preview in one command
npm run build && npm run preview
```

### Testing Commands

```bash
# ⚠️ IMPORTANT: NEVER run these commands automatically
# Always ask the user to manually test by running:
# npm run dev
# npm run preview

# Test specific functionality by creating test files
# Example: node test-timer.js
# (Create test files as needed for specific functionality)

# Test timer store functionality
node test-timer-store.js

# Test cooldown functionality  
node test-cooldown.js

# Test pause/resume functionality
node test-pause-resume.js
```

### Code Analysis Commands

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# List installed dependencies
npm list

# Check for outdated dependencies
npm outdated
```

## 🎨 Code Style Guidelines

### 1. File Organization

```
src/
├── components/          # Reusable Svelte components
│   ├── TimerDisplay.svelte  # Main timer display
│   └── ControlPanel.svelte  # Timer controls
├── lib/                 # Utility functions and stores
│   ├── audio.js          # Audio management
│   └── timerStore.js     # Timer state management
├── App.svelte           # Main application component
└── main.js             # Entry point
```

### 2. Import Guidelines

```javascript
// ✅ CORRECT: Import from specific files
import { timerStore } from './lib/timerStore.js';
import { playStartBeeps } from './lib/audio.js';

// ❌ INCORRECT: Avoid wildcard imports
import * as timer from './lib/timerStore.js';

// ✅ CORRECT: Named imports for Svelte stores
import { writable, derived } from 'svelte/store';

// ✅ CORRECT: Import lifecycle functions
import { onMount, onDestroy } from 'svelte';
```

### 3. Formatting Rules

```javascript
// ✅ CORRECT: Consistent indentation (2 spaces)
function example() {
  const result = calculate();
  return result;
}

// ✅ CORRECT: Arrow functions for callbacks
const callback = () => {
  // function body
};

// ✅ CORRECT: Template literals for strings
const message = `Timer: ${formattedTime}`;

// ✅ CORRECT: Destructuring for cleaner code
const { timeLeft, state } = timerState;
```

### 4. TypeScript/JSDoc Guidelines

```javascript
// ✅ CORRECT: Use JSDoc for complex functions
/**
 * Calculates remaining time with proper formatting
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time string (MM:SS)
 */
function formatTime(seconds) {
  // implementation
}

// ✅ CORRECT: Type annotations in comments
// @type {import('svelte/store').Writable<TimerState>}
const timerStore = writable(initialState);
```

### 5. Naming Conventions

```javascript
// ✅ CORRECT: Component names (PascalCase)
// TimerDisplay.svelte, ControlPanel.svelte

// ✅ CORRECT: Function names (camelCase)
function playStartBeeps() {}
function formatTime(seconds) {}

// ✅ CORRECT: Variable names (camelCase)
const timeLeft = 120;
const isCooldown = false;

// ✅ CORRECT: Constant names (UPPER_CASE)
const TIMER_STATES = {
  IDLE: 'idle',
  RUNNING: 'running'
};

// ✅ CORRECT: Store names (camelCase with Store suffix)
const timerStore = createTimerStore();
```

### 6. Error Handling

```javascript
// ✅ CORRECT: Graceful error handling
try {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
} catch (error) {
  console.error('Audio context failed:', error);
  // Fallback or user notification
}

// ✅ CORRECT: Cleanup in lifecycle hooks
onDestroy(() => {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
  cleanupAudio();
});

// ✅ CORRECT: Input validation
if (typeof duration !== 'number' || duration <= 0) {
  throw new Error('Invalid duration');
}
```

### 7. Svelte-Specific Guidelines

```svelte
<!-- ✅ CORRECT: Component structure -->
<script>
  // Imports first
  import { timerStore } from './lib/timerStore';
  
  // Component logic
  let localState;
  const unsubscribe = timerStore.subscribe(state => {
    localState = state;
  });
  
  onDestroy(() => unsubscribe());
</script>

<!-- ✅ CORRECT: Template with proper binding -->
<div class="timer-display {$timerColor}">
  {$formattedTime}
</div>

<!-- ✅ CORRECT: Event handling -->
<button on:click={handleClick} disabled={isDisabled}>
  {buttonText}
</button>

<style>
  /* ✅ CORRECT: Scoped styles */
  .timer-display {
    font-size: clamp(3rem, 10vw, 8rem);
  }
</style>
```

### 8. State Management

```javascript
// ✅ CORRECT: Store structure
const timerStore = writable({
  timeLeft: 0,
  timerDuration: 120,
  state: 'idle',
  isCooldown: false,
  colorState: 'green'
});

// ✅ CORRECT: Derived stores for computed values
export const formattedTime = derived(timerStore, $state => {
  const mins = Math.floor($state.timeLeft / 60);
  const secs = $state.timeLeft % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
});

// ✅ CORRECT: Store updates with proper state management
timerStore.update(state => ({
  ...state,
  timeLeft: state.timeLeft - 1,
  colorState: state.timeLeft <= 30 ? 'yellow' : 'green'
}));
```

### 9. Audio Management

```javascript
// ✅ CORRECT: Audio context handling
function initAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
}

// ✅ CORRECT: Audio cleanup
function cleanupAudio() {
  if (audioContext && audioContext.state !== 'closed') {
    audioContext.close().catch(console.error);
    audioContext = null;
  }
}
```

### 10. Responsive Design

```css
/* ✅ CORRECT: Mobile-first responsive design */
.timer-display {
  font-size: clamp(3rem, 10vw, 8rem);
}

/* ✅ CORRECT: Media queries */
@media (max-width: 600px) {
  .control-panel {
    padding: 1rem;
  }
}

/* ✅ CORRECT: CSS variables for theming */
:root {
  --primary-color: #4CAF50;
  --warning-color: #FFC107;
  --danger-color: #F44336;
}
```

### 11. Testing Guidelines

```javascript
// ✅ CORRECT: Test structure
import { timerStore } from './lib/timerStore.js';

console.log('Testing timer functionality...');

// Test initial state
timerStore.reset();
let initialState;
timerStore.subscribe(state => {
  initialState = state;
})();

console.assert(initialState.timeLeft === 0, 'Initial time should be 0');
console.assert(initialState.state === 'idle', 'Initial state should be idle');

// Test state transitions
timerStore.start();
let runningState;
timerStore.subscribe(state => {
  runningState = state;
})();

console.assert(runningState.state === 'running', 'Should transition to running');
```

### 12. Performance Guidelines

```javascript
// ✅ CORRECT: Clean up intervals and timeouts
onDestroy(() => {
  if (timerInterval) clearInterval(timerInterval);
  if (audioTimeout) clearTimeout(audioTimeout);
});

// ✅ CORRECT: Debounce rapid events
let debounceTimeout;
function handleResize() {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    // Handle resize
  }, 100);
}

// ✅ CORRECT: Use requestAnimationFrame for animations
function animate() {
  // Animation logic
  requestAnimationFrame(animate);
}
```

### 13. Accessibility Guidelines

```svelte
<!-- ✅ CORRECT: Accessible buttons -->
<button 
  on:click={handleClick}
  aria-label="Start timer"
  disabled={isDisabled}
  class="start-button"
>
  Start
</button>

<!-- ✅ CORRECT: ARIA attributes -->
<div 
  role="timer"
  aria-live="polite"
  class="timer-display {$timerColor}"
>
  {$formattedTime}
</div>

<!-- ✅ CORRECT: Keyboard navigation -->
<script>
  function handleKeyDown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      handleClick();
    }
  }
</script>
```

### 14. Documentation Guidelines

```javascript
// ✅ CORRECT: Function documentation
/**
 * Starts the timer with the selected duration
 * @param {number} minutes - Duration in minutes (2 or 3)
 * @returns {void}
 * @example
 * startTimer(2); // Starts 2-minute timer
 */
function startTimer(minutes) {
  // implementation
}

// ✅ CORRECT: Component documentation
/**
 * TimerDisplay Component
 * 
 * Displays the current timer value with color-coded phases:
 * - Green: Normal countdown (> 30 seconds)
 * - Yellow: Warning phase (≤ 30 seconds)
 * - Red: Cooldown phase
 * 
 * @component
 */
```

### 15. Git Guidelines

```bash
# ✅ CORRECT: Commit message format
# <type>(<scope>): <subject>
# 
# Types: feat, fix, docs, style, refactor, perf, test, chore
# Example: feat(timer): add continuous loop functionality

# ✅ CORRECT: Branch naming
# feature/<description>
# fix/<issue>
# docs/<topic>

# ✅ CORRECT: Pull request format
# Title: Clear description of changes
# Description:
# - What was changed
# - Why it was changed
# - How to test
# - Screenshots (if applicable)
```

## 📚 Additional Resources

- **Svelte Documentation**: https://svelte.dev/docs
- **Vite Documentation**: https://vitejs.dev/guide/
- **Web Audio API**: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
- **CSS Clamp**: https://developer.mozilla.org/en-US/docs/Web/CSS/clamp

## 🤖 AI Agent Specific Instructions

### For Coding Agents:
1. Always check existing code style before making changes
2. Follow the component structure and naming conventions
3. Use derived stores for computed values
4. Clean up intervals and audio resources in onDestroy
5. **NEVER run `npm run preview` or `npm run dev` - always ask the user to manually test**

### For Review Agents:
1. Verify state management is consistent
2. Check for proper cleanup of resources
3. Ensure responsive design principles are followed
4. Validate accessibility attributes
5. Confirm error handling is present

### For Testing Agents:
1. **NEVER run `npm run preview` or `npm run dev` - always ask the user to manually test**
2. Test both 2-minute and 3-minute durations
3. Verify pause/resume functionality
4. Check cooldown transition and restart
5. Test on different screen sizes
6. Validate audio works across browsers

## 🔧 Troubleshooting

### Common Issues:
- **Audio not working**: Check if AudioContext was initialized properly
- **Timer not updating**: Verify store subscriptions are cleaned up
- **Cooldown not restarting**: Check interval cleanup and restart logic
- **Styles not applying**: Ensure proper scoping in Svelte components

### Debugging Tips:
```javascript
// Debug store values
timerStore.subscribe(state => {
  console.log('Timer state:', state);
});

// Debug lifecycle
onMount(() => {
  console.log('Component mounted');
});

// Debug intervals
console.log('Interval ID:', timerInterval);
```

## 📝 Changelog

### v1.0.0 (Current)
- Initial implementation with continuous loop
- Fixed cooldown restart functionality
- Added comprehensive error handling
- Improved responsive design

### Future Enhancements
- Add settings persistence
- Implement custom duration options
- Add visual themes
- Include sound volume control

---

**Last Updated**: 2024-01-21
**Maintainer**: AI Development Team
**License**: MIT