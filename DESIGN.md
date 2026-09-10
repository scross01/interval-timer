---
name: Interval Timer
description: Hands-free HIIT work/rest loop with phase color, audio cues, and auto-restart
colors:
  work-green: "#4CAF50"
  work-green-hover: "#45a049"
  work-green-deep: "#2E7D32"
  warning-amber: "#FFC107"
  warning-amber-hover: "#e6ac00"
  warning-amber-deep: "#F57F17"
  warning-ember-light: "#BF360C"
  warning-ember-deep: "#6B1C06"
  cooldown-red: "#F44336"
  cooldown-red-hover: "#d32f2f"
  cooldown-red-deep: "#C62828"
  canvas-dark: "#161616"
  canvas-light: "#f4f4f4"
  ink-dark-canvas: "rgba(255, 255, 255, 0.9)"
  ink-light-canvas: "#1a1a1a"
  control-rest: "#f0f0f0"
  control-rest-hover: "#e0e0e0"
  control-text: "#242424"
  status-ink-dark: "#d0d0d0"
  status-ink-light: "#424242"
  focus-ring-dark: "#ffffff"
  focus-ring-light: "#111111"
  action-work: "#2E7D32"
  action-work-hover: "#1B5E20"
  action-warning: "#FFC107"
  action-warning-light: "#BF360C"
  action-cooldown: "#D32F2F"
  action-cooldown-light: "#C62828"
  on-action-warning-dark: "#242424"
  on-action-warning-light: "#ffffff"
typography:
  display:
    fontFamily: "Courier New, Courier, monospace"
    fontSize: "clamp(4.5rem, 30vw, 18rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.02em"
  display-landscape:
    fontFamily: "Courier New, Courier, monospace"
    fontSize: "clamp(3.5rem, 22vh, 12rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.02em"
  display-xs:
    fontFamily: "Courier New, Courier, monospace"
    fontSize: "clamp(3.5rem, 26vw, 7rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.02em"
  body:
    fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif"
    fontSize: "clamp(1rem, 3vw, 1.35rem)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "2px"
  label-xs:
    fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif"
    fontSize: "clamp(0.85rem, 3.5vw, 1.1rem)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "2px"
  control:
    fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif"
    fontSize: "clamp(0.9rem, 2.5vw, 1.15rem)"
    fontWeight: 700
    lineHeight: 1.2
  duration:
    fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif"
    fontSize: "clamp(0.85rem, 2.2vw, 1.05rem)"
    fontWeight: 700
    lineHeight: 1.2
  hint:
    fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif"
    fontSize: "clamp(0.8rem, 2.4vw, 0.95rem)"
    fontWeight: 500
    lineHeight: 1.35
  hint-short:
    fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif"
    fontSize: "clamp(0.7rem, 2vw, 0.85rem)"
    fontWeight: 500
    lineHeight: 1.35
  onboard:
    fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif"
    fontSize: "clamp(0.85rem, 2.4vw, 0.95rem)"
    fontWeight: 500
    lineHeight: 1.35
  onboard-meta:
    fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1.2
  round:
    fontFamily: "Courier New, Courier, monospace"
    fontSize: "clamp(0.85rem, 2.5vw, 1rem)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.08em"
rounded:
  status: "5px"
  control: "8px"
  beacon: "999px"
spacing:
  xs: "0.5rem"
  sm: "0.65rem"
  md: "0.8rem"
  lg: "1rem"
  xl: "1.5rem"
components:
  timer-display:
    typography: "{typography.display}"
    textColor: "{colors.work-green}"
  timer-display-yellow:
    typography: "{typography.display}"
    textColor: "{colors.warning-amber}"
  timer-display-red:
    typography: "{typography.display}"
    textColor: "{colors.cooldown-red}"
  status-label:
    typography: "{typography.label}"
    textColor: "{colors.status-ink-dark}"
    backgroundColor: "rgba(255, 255, 255, 0.08)"
    rounded: "{rounded.status}"
    padding: "0.5rem 1rem"
  duration-btn:
    typography: "{typography.duration}"
    backgroundColor: "{colors.control-rest}"
    textColor: "{colors.control-text}"
    rounded: "{rounded.control}"
    padding: "0.65rem 1.2rem"
    height: "44px"
  duration-btn-active:
    typography: "{typography.duration}"
    backgroundColor: "{colors.work-green-deep}"
    textColor: "#ffffff"
    rounded: "{rounded.control}"
    padding: "0.65rem 1.2rem"
    height: "44px"
  button-start:
    typography: "{typography.control}"
    backgroundColor: "{colors.work-green-deep}"
    textColor: "#ffffff"
    rounded: "{rounded.control}"
    padding: "0.85rem 1.4rem"
    height: "44px"
  button-pause:
    typography: "{typography.control}"
    backgroundColor: "{colors.warning-amber-deep}"
    textColor: "#ffffff"
    rounded: "{rounded.control}"
    padding: "0.85rem 1.4rem"
    height: "44px"
  button-reset:
    typography: "{typography.control}"
    backgroundColor: "{colors.cooldown-red}"
    textColor: "#ffffff"
    rounded: "{rounded.control}"
    padding: "0.85rem 1.4rem"
    height: "44px"
---

# Design System: Interval Timer

## Overview

**Creative North Star: "The Gym Floor Beacon"**

Interval Timer is a single-surface workout instrument, not a productivity dashboard. Oversized mono digits dominate the viewport, a short phase beacon strip signals the active work/warning/cooldown state, and controls stay large, few, and low in the frame. Personality is direct, athletic, and glanceable—clarity under motion beats quiet sophistication.

Density is intentionally sparse: one non-scrolling full-viewport column, timer stage above, control deck below. Near-flat surfaces; hover lift and a digit text-shadow are the only resting-depth vocabulary. Motion marks urgency only (warning pulse; stronger cooldown rest-pulse), with a static outline + beacon alternative under `prefers-reduced-motion`.

**Key Characteristics:**
- Full-viewport instrument layout (no scroll)
- Phase color + named status (`READY` neutral / `WORKOUT` / `FINAL 30S` / `COOLDOWN` / `PAUSED` variants)
- Phase hues reserved for live states; idle READY uses neutral ink/beacon
- Monospaced tabular digits, never mid-string wrapped
- Controls are chunky, uppercase, ≥44px, with visible focus rings; action fills use deepened greens for label contrast
- Light and dark canvases each use composed phase values (deep variants on light)
- Idle hint states the auto-loop contract; mono round counter tracks completed work intervals

## Colors

Dark canvas is the gym-floor default; light scheme uses deeper phase hues for outdoor/phone legibility. Tokens live as CSS custom properties on `:root` and remapped under `prefers-color-scheme: light`.

### Primary
- **Work Green** (`--phase-work`: #4CAF50 dark / #2E7D32 light): Work-phase **digits**.
- **Action Work** (`--action-work`: #2E7D32): START and selected duration fills (deepened for white-label contrast).
- **Action Work Hover** (#1B5E20): START/duration hover.
- **Work Green Deep** (#2E7D32): High-contrast work digits; also light-scheme primary.

### Secondary
- **Warning Amber** (`--phase-warning`: #FFC107 dark / #BF360C light): Final-30s **digits** (`FINAL 30S`); light value deepened for ≥4.5:1 body contrast on `#f4f4f4`.
- **Action Warning** (`--action-warning`): PAUSE fill; dark ink on dark canvas, white on deepened light fill.
- **Warning Ember** (light `#BF360C` / HC deep `#6B1C06`): Final-30s digits on light canvas; ember is the accurate hue name. HC-light uses deeper ember `#6B1C06` (~10.6:1 on `#f4f4f4`).
- **Warning Amber Deep** (#F57F17): Dark-root token only; not used on light (too pale).

### Tertiary
- **Cooldown Red** (`--phase-cooldown`: #F44336 dark / #C62828 light): Cooldown **digits**.
- **Action Cooldown** (`--action-cooldown`: #D32F2F dark / #C62828 light): RESET fill.
- **Cooldown Red Deep**: High-contrast cooldown digits.

### Neutral
- **Canvas** (`--canvas`: #161616 dark / #f4f4f4 light): Full-bleed background.
- **Ink** (`--ink`): Body/UI text on canvas.
- **Control Rest / Hover / Text**: Duration chip surfaces.
- **Status ink + chip**: Raised contrast status label (#d0d0d0 on dark translucent chip).
- **Focus ring**: White on dark, near-black on light.

### Named Rules
**The Phase Is Palette Rule.** Work/warning/cooldown hues are reserved for phase state and the matching control.
**The One State Color Rule.** Live digits carry exactly one phase color at a time; idle is neutral.
**The Composed Themes Rule.** Light mode is not an invert—phase values step deeper for contrast.

## Typography

**Display Font:** Courier New (tabular-nums, nowrap)
**UI Font:** system-ui stack

### Hierarchy
- **Display** (700, clamp(4.5rem, 30vw, 18rem), lh 1, tracking -0.02em): Countdown only; sized to fill the gym glance (~30vw for `MM:SS`). Landscape/xs variants clamp lower.
- **Label** (700, clamp(1rem, 3vw, 1.35rem), 2px tracking, uppercase): Phase status chip.
- **Control** (700, clamp(0.9rem, 2.5vw, 1.15rem)): START/PAUSE/RESET.
- **Duration** (700, clamp(0.85rem, 2.2vw, 1.05rem)): 2 MIN / 3 MIN chips.

### Named Rules
**The Digit Monopoly Rule.** Mono is for the countdown; labels stay in the system stack.
**The Tabular Instrument Rule.** Digits use tabular numerals and never wrap mid-string.

## Layout

Full-viewport column (`100dvh`, safe-area aware). Stage ~flex 1; control deck flex-shrink 0 with duration row over action row. Landscape and ≤360px shrink digit scale and tighten padding. Touch targets ≥44px.

## Elevation & Depth

Near-flat. Control rest/hover shadows; digit text-shadow; phase beacon uses a soft `box-shadow` glow. Under reduced motion the beacon becomes a solid thicker bar without glow.

### Shadow Vocabulary
- **Control rest** (`0 2px 4px rgba(0,0,0,0.12–0.1)`)
- **Control hover** (`0 4px 8px rgba(0,0,0,0.22–0.16)` + translateY)
- **Active work glow** (green-tinted control shadow on selected duration)
- **Beacon glow** (`0 0 12px currentColor` on the phase strip)
- **Digit legibility** (`3px 3px 6px rgba(0,0,0,0.3)`)

### Named Rules
**The Hover-Only Lift Rule.** No permanent elevated panels.

## Shapes

Controls 8px; status chip 5px; phase beacon is a pill (`999px`)—the only intentional pill.

## Components

### Timer Display (signature)
Phase beacon strip + oversized mono digits + meta row (status chip + optional mono `ROUNDS ##` counter after the first completed interval). Status vocabulary: `READY` / `WORKOUT` / `FINAL 30S` / `COOLDOWN` / `PAUSED` / `PAUSED · COOLDOWN` / `PAUSED · FINAL 30S` — always **COOLDOWN** (never “rest” or “cool”). Idle READY uses **neutral** ink and a quiet beacon (phase hues only when live). Primary control reads `START` or `RESUME` when paused; disabled START uses a neutral fill (not work-green). RESET requires ~800ms hold. When not idle, duration buttons collapse to a static `N MIN INTERVAL` chip (cycle 1: `· 30s cooldown · auto-loop`); last 2/3 MIN choice persists in `localStorage`. First visit shows one onboard beat (pick 2 or 3 → START · 30s cooldown auto-loops until RESET) and suppresses the idle loop hint until dismissed. Urgency pulse/rest-pulse only while actively ticking — **paused uses static outline**. Blocked audio shows a small mute glyph on the status chip (not a continuous footnote). Beep chains are cancelable on PAUSE/RESET. Onboard dismiss meets 44px touch min. Phase edges fire beacon flare (incl. idle→first WORKOUT) + short vibrate (including green start). Beacon 6px (8px ≥768px). START stays visible while running. Edges-only beeps (no halfway cue). Courier New display. Wall-clock + wake lock + visibility resync.

### Duration / Action Buttons
Action fills use deepened phase tokens (`--action-work` etc.) for white-label contrast. Disabled opacity, `:focus-visible` 3px ring, `aria-pressed` on duration chips, grouped with `role="group"` labels. START arms audio via user gesture (`resume()`). START is disabled during active cooldown. PAUSE works during work **and** cooldown; primary control reads `START` or `RESUME` when paused. RESET is hold-to-fire (~800ms) to prevent fat-finger wipes. Timing is wall-clock based with optional screen wake lock while the loop runs.

## Do's and Don'ts

### Do:
- **Do** use CSS variables for phase/canvas/action/control roles.
- **Do** keep digits nowrap + tabular-nums.
- **Do** name the phase in status text (not color alone).
- **Do** provide reduced-motion phase cues that still read as urgency.
- **Do** keep ≥44px targets and visible focus rings.
- **Do** use deeper phase/action hues for labels and light canvas.

### Don't:
- **Don't** reintroduce Vite scaffold colors or page max-width chrome.
- **Don't** lock pinch-zoom (`user-scalable=no`).
- **Don't** rely on scale/opacity loops as the only phase signal.
- **Don't** decorate with phase hues outside state/action meaning.
- **Don't** break the countdown string across lines.
