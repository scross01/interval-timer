# Contributing

## Technical Stack

- **Framework**: Svelte with Vite
- **State Management**: Svelte Stores
- **Audio**: Web Audio API
- **Styling**: CSS with responsive design
- **Build**: Vite for optimized production bundles

## Project Structure

```txt
src/
├── components/              # Reusable components
│   ├── TimerDisplay.svelte  # Main timer display
│   └── ControlPanel.svelte  # Timer controls
├── lib/                     # Utility functions and stores
│   ├── audio.js             # Audio management
│   └── timerStore.js        # Timer state management
├── App.svelte               # Main application
└── main.js                  # Entry point
```

## Local Installation

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

### GitHub Pages

```bash
npm run deploy
```
