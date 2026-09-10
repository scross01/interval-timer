# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: someone doing HIIT or other interval fitness training (gym, home workout, or timed rounds). They are mid-effort, often not looking at a phone, and need the cycle to run itself with clear visual phase cues and audio alerts.

## Product Purpose

Interval Timer owns a hands-free work/rest loop: a 2- or 3-minute work countdown, then a fixed 30-second cooldown, then automatic restart of the work interval. Success is continuous unattended cycling so the trainee never has to touch controls mid-session.

## Positioning

Not a generic stopwatch or multi-exercise workout library. The product is the continuous loop itself — phase color (green work / yellow final 30s / red cooldown), audio cues at start/warning/end, and auto-restart after cooldown — with duration locked to simple 2- or 3-minute work intervals.

## Operating Context

- Browser on phone, tablet, or desktop during a workout
- Hands may be occupied; large glanceable digits and audio matter more than dense UI
- Live at https://scross01.github.io/interval-timer/
- Local development via `npm run dev` (Vite)

## Capabilities and Constraints

Confirmed from the implementation:

- Work durations: 2 minutes (default) or 3 minutes only; changeable only while idle; last choice persists in localStorage
- Phases: green (normal work) → yellow (last 30s, warning beep) → red (30s cooldown) → auto-restart work
- Controls: START / RESUME, PAUSE (work and cooldown), HOLD RESET (~800ms); duration selection idle-only
- Audio: start beeps, 30s warning pattern, end beeps, restart beeps (Web Audio API; AudioContext must start on user gesture; mid-session re-arm). Edges-only by design — no halfway/mid-interval cue is required.
- Continuous loop until RESET; cooldown is always 30 seconds and is not skippable
- Full-viewport, touch-oriented single-page UI (no scroll)
- High-contrast phase colors; deep variants on light canvas

Undecided / not established:

- Accessibility beyond high-contrast color overrides (no named WCAG target or screen-reader second-by-second announcements)
- Custom durations, custom cooldown length, interval counts, or workout presets
- Offline/PWA install behavior
- Brand assets beyond the descriptive name

## Brand Commitments

- Product name: **Interval Timer**
- No logo, voice guide, or visual identity assets committed yet

## Evidence on Hand

- README.md, CONTRIBUTING.md, AGENTS.md (product behavior and stack notes)
- Live source: `src/components/TimerDisplay.svelte`, `src/components/ControlPanel.svelte`, `src/lib/timerStore.js`, `src/lib/audio.js`
- No testimonials, press, user research, or marketing assets — future work must not invent them

## Product Principles

1. Hands-free first: once started, the loop should require no interaction until the trainee chooses to stop or reset.
2. Phase clarity at a glance: color + status label + audio must all agree on work / final-30s / cooldown.
3. Keep the cycle simple: two fixed work durations and one fixed 30s rest beat a configurable gym toolkit.
4. Audio is load-bearing: cues must fire at start, 30s warning, end, and restart without extra taps after first start.
5. Mobile-first physical use: large targets, full-viewport layout, and orientation-aware spacing for in-workout phones.

## Accessibility & Inclusion

High-contrast preference is respected for phase colors (`prefers-contrast: high`; deep phase tokens on light canvas only). No further product-specific accessibility standard is confirmed.
