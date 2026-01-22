# Sports Timer - Svelte Application

A responsive single-page web application for sports timing with countdown functionality.

## Features

✅ **Countdown Timer**: 2 or 3 minute options
✅ **Visual Indicators**: Green → Yellow (last 30s) → Red (cooldown)
✅ **Audio Alerts**: Start/end beeps and 30-second warning
✅ **Automatic Restart**: Timer restarts after 30-second cooldown
✅ **Responsive Design**: Works on desktop, tablet, and mobile with optimized layouts for iPad Mini 6 and Firefox
✅ **State Management**: Comprehensive timer state handling

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

## Technical Stack

- **Framework**: Svelte with Vite
- **State Management**: Svelte Stores
- **Audio**: Web Audio API
- **Styling**: CSS with responsive design
- **Build**: Vite for optimized production bundles

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── TimerDisplay.svelte  # Main timer display
│   └── ControlPanel.svelte  # Timer controls
├── lib/                 # Utility functions and stores
│   ├── audio.js          # Audio management
│   └── timerStore.js     # Timer state management
├── App.svelte           # Main application
└── main.js             # Entry point
```

## Testing

Run the timer store tests:
```bash
node test-timer.js
```

Open `test-components.html` in a browser to verify component functionality.

## Browser Support

- Chrome 55+
- Firefox 52+
- Safari 11+
- Edge 79+
- Mobile browsers with Web Audio API support

## Responsive Design Features

The Sports Timer application features a comprehensive responsive design that adapts to various screen sizes and orientations:

### 📱 Device-Specific Optimizations

#### iPad Mini 6 (744x1133)
- **Portrait**: Maximized timer display with large font sizes
- **Landscape**: Optimized button layout for wider screens  
- **Touch Targets**: Larger buttons for better touch interaction

#### Mobile Devices
- **Portrait**: Full-screen timer with stacked controls
- **Landscape**: Balanced layout with appropriate spacing
- **Small Screens**: Compact controls with vertical button stacking

#### Desktop
- **Standard Layout**: Optimal spacing and sizing
- **Large Screens**: Centered content with maximum readability

### 🎨 Responsive Techniques

1. **CSS Clamp**: Fluid typography that scales between minimum and maximum sizes
2. **Viewport Units**: Dynamic sizing based on available screen space
3. **Flexbox Layout**: Flexible container sizing and alignment
4. **Media Queries**: Device-specific optimizations
5. **Orientation Detection**: Different layouts for portrait vs landscape

### 🔧 Browser-Specific Adjustments

- **Firefox**: Custom styling and font smoothing
- **WebKit Browsers**: Optimized animations and transitions
- **Mobile Browsers**: Touch-friendly controls and proper viewport scaling

### 📐 Layout Structure

```
App Container
├── Header (Title)
├── Timer Wrapper (Flexible, takes available space)
│   └── Timer Display (Maximized for visibility)
├── Controls Wrapper (Fixed height)
│   └── Control Panel (Responsive buttons)
└── Instructions (Compact, scrollable if needed)
```

### 📏 Key Breakpoints

- **360px**: Very small mobile devices
- **480px**: Small mobile devices (buttons stack vertically)
- **768px**: Tablets and larger mobile devices
- **1024px**: Desktop and landscape tablets

### 🎯 Design Principles

1. **Timer Priority**: Timer display gets maximum available space
2. **Touch Optimization**: Buttons sized appropriately for touch interaction
3. **Readability**: Font sizes scale with screen size
4. **Consistency**: Uniform spacing and layout patterns
5. **Performance**: Efficient CSS with minimal reflows

## Testing Responsive Layout

Run the responsive layout tests:
```bash
npm run test-responsive
```

This will test the application across multiple device sizes and orientations, generating screenshots for visual verification.

## Manual Testing Guide

1. **iPad Mini 6 Testing**:
   - Open Safari/Firefox on iPad Mini 6
   - Test both portrait and landscape orientations
   - Verify timer display fills available space
   - Check button sizes are touch-friendly

2. **Mobile Testing**:
   - Test on various mobile devices
   - Verify portrait and landscape layouts
   - Check button stacking on small screens

3. **Desktop Testing**:
   - Resize browser window to test responsiveness
   - Verify layout adapts smoothly
   - Check maximum font sizes are appropriate

4. **Firefox Testing**:
   - Test in Firefox browser
   - Verify Firefox-specific adjustments work
   - Check font rendering and spacing

## Responsive Layout Files

- `src/App.svelte`: Main layout with responsive containers
- `src/components/TimerDisplay.svelte`: Responsive timer display
- `src/components/ControlPanel.svelte`: Responsive control buttons
- `src/app.css`: Global responsive styles and media queries
- `test-responsive-layout.js`: Automated responsive testing script

## Common Responsive Issues & Solutions

### Issue: Timer display too small on mobile
**Solution**: Use `clamp()` with appropriate min/max values and higher viewport percentages

### Issue: Buttons too close together on small screens
**Solution**: Implement vertical stacking for buttons on screens < 480px

### Issue: Layout breaks in landscape orientation
**Solution**: Use orientation-specific media queries with adjusted spacing

### Issue: Firefox rendering differences
**Solution**: Use `-moz-document` queries for Firefox-specific adjustments

### Issue: iPad Mini 6 specific quirks
**Solution**: Use device-specific media queries with precise dimensions

## Future Responsive Enhancements

- Add dark/light mode support
- Implement system preference detection
- Add theme color customization
- Consider user preference persistence
- Explore CSS container queries for component-level responsiveness

## License

MIT License

## Credits

Built with ❤️ using Svelte and Vite
