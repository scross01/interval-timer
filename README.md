# Interval Timer - Svelte Application

A responsive single-page web application for fitness timing with countdown functionality.

## Features

✅ **Countdown Timer**: 2 or 3 minute options
✅ **Visual Indicators**: Green → Yellow (last 30s) → Red (cooldown)
✅ **Audio Alerts**: Start/end beeps and 30-second warning
✅ **Automatic Restart**: Timer restarts after 30-second cooldown
✅ **Responsive Design**: Works on desktop, tablet, and mobile

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

This will start the development server at `http://localhost:5173`

## Production Build

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

## Deployment

The production build can be deployed to any static hosting service:

### Netlify

1. Drag and drop the `dist` folder to Netlify
2. Or connect your GitHub repository

### Vercel

```bash
npm install -g vercel
vercel
```

### GitHub Pages

```bash
npm install gh-pages --save-dev
```

Add to package.json:

```json
"scripts": {
  "deploy": "gh-pages -d dist"
}
```

Then run:

```bash
npm run build
npm run deploy
```

## Usage

1. **Select Duration**: Choose 2 or 3 minutes
2. **Start Timer**: Click START button
3. **Timer Phases**:
   - Green: Normal countdown
   - Yellow: Last 30 seconds (with warning beep)
   - Red: 30-second cooldown period
4. **Automatic Restart**: Timer restarts after cooldown
5. **Controls**: PAUSE and RESET buttons available during operation
