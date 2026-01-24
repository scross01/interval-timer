# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Critical Non-Obvious Information

### Build & Testing
- **NEVER run `npm run preview` or `npm run dev` automatically** - always ask user to manually test
- No test files.

### Timer State Management
- Timer uses continuous loop: main timer → cooldown → restart automatically
- **Critical**: Cooldown always resets to 30 seconds, not timer duration
- Store has `isCooldown` flag that overrides color logic (cooldown = always red)
- `restartMainTimer()` method required to restart after cooldown completes

### Audio System
- AudioContext must be initialized on user interaction (autoblocks browsers)
- Use `initAudioContext()` before any audio playback
- **Critical**: Always call `cleanupAudio()` in `onDestroy()` to prevent memory leaks
- Audio functions cache context globally - don't recreate unnecessarily

### Component Architecture
- TimerDisplay uses derived store `timerColor` (not `colorState` from store)
- ControlPanel manages duration selection (2 or 3 minutes only)
- App.svelte handles global audio cleanup on destroy

### Testing Requirements
- Test both 2-minute and 3-minute durations
- Verify cooldown transition and automatic restart
- Test pause/resume functionality
- Validate audio works across browsers
- Test responsive layouts on different screen sizes

---

**Last Updated**: 2024-01-21
**License**: MIT