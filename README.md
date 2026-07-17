# JellyFishMod

A custom Scratch modification with advanced motion sensing and sound controls.

## Features

### Standard Scratch Features
- Sprite creation and manipulation
- Block-based programming
- Event handling
- Variables and lists
- Control flow (loops, conditionals)

### Advanced Motion Sensing
- Real-time motion detection via webcam
- Motion threshold customization
- Motion direction tracking (up, down, left, right)
- Motion intensity measurement
- Multi-point motion tracking

### Advanced Sound Controls
- Real-time microphone input analysis
- Sound frequency detection
- Volume level monitoring
- Sound pattern recognition
- Audio visualization
- Frequency spectrum analysis
- Pause/Play sound controls
- Stop event triggers

## Getting Started

1. Clone or download this repository
2. Install dependencies: `npm install`
3. Run the development server: `npm start`
4. Open the JellyFishMod interface in your browser

## Project Structure

```
JellyFishMod/
├── src/
│   ├── blocks/
│   │   ├── motionSensing.js
│   │   ├── soundControls.js
│   │   └── advancedBlocks.js
│   ├── extensions/
│   │   ├── MotionSensingExtension.js
│   │   ├── SoundControlsExtension.js
│   │   └── AdvancedBlocksExtension.js
│   ├── utils/
│   │   ├── videoCapture.js
│   │   ├── audioAnalysis.js
│   │   ├── motionDetection.js
│   │   └── soundManager.js
│   └── index.js
├── package.json
└── README.md
```

## Blocks

### Motion Sensing Blocks
- `detect motion` - Returns true/false if motion detected
- `motion direction` - Returns direction of detected motion
- `motion intensity` - Returns intensity level (0-100)
- `motion threshold` - Set sensitivity threshold
- `track point x, y` - Track motion at specific coordinates
- `motion x velocity` - Returns horizontal motion speed
- `motion y velocity` - Returns vertical motion speed
- `motion angle` - Returns angle of motion in degrees

### Sound Control Blocks
- `detect sound` - Returns true/false if sound detected
- `sound volume` - Returns current volume level (0-100)
- `sound frequency` - Returns detected frequency in Hz
- `frequency range detection` - Detect sounds in frequency range
- `sound pattern detected` - Recognize specific sound patterns
- `play sound` - Play audio file or synthesized sound
- `pause sound` - Pause currently playing sound
- `resume sound` - Resume paused sound
- `stop all sounds` - Stop all audio playback
- `set sound volume` - Set playback volume (0-100)
- `sound playback speed` - Set speed multiplier (0.5-2.0)

### Amazing Advanced Blocks
- `when stopped` - Trigger when green flag is stopped
- `when stopped play sound` - Play sound when program stops
- `motion trail on/off` - Display motion tracking visualization
- `sound spectrum analyzer` - Get detailed frequency breakdown
- `detect gesture` - Recognize hand gestures (swipe, circle, point)
- `motion recording` - Record and replay motion sequences
- `sound mix tracks` - Combine multiple audio sources
- `motion particle effect` - Create particle effects based on motion
- `emotion detection` - Detect mood from motion patterns
- `sound to animation` - Auto-generate animations from music
- `synchronized sprites` - Sync multiple sprites to motion/sound
- `create soundwave` - Visualize audio as animated waveforms
- `motion physics` - Apply realistic physics to sprites
- `sound echo effect` - Add echo/reverb to audio
- `gesture recorder` - Record and save gesture sequences

## Usage Example

```javascript
// Enable motion sensing
whenMotionDetected(() => {
  sprite.move(motionIntensity());
});

// Sound-responsive sprite
whenSoundDetected(() => {
  sprite.playSound('beep');
  sprite.changeSize(soundVolume());
});

// Stop event handling
whenStopped(() => {
  pauseSound();
  stopAllSounds();
  stopAllMotionTracking();
});

// Advanced gesture and emotion
whenGestureDetected('swipe') => {
  playSound('whoosh');
  sprite.glide(100, 100);
};

// Synchronized motion and sound
motionTrail(true);
soundSpectrumAnalyzer().forEach(band => {
  adjustSpriteHeight(band.intensity);
});
```

## Event Handlers

- `when green flag clicked` - Program start
- `when [key] key pressed` - Keyboard input
- `when sprite clicked` - Mouse click on sprite
- `when motion detected` - Motion sensor trigger
- `when sound detected` - Audio sensor trigger
- `when stopped` - **Green flag stop button clicked**
- `when gesture detected [gesture]` - Gesture recognition trigger

## Sound Management

### Pause/Play Controls
```javascript
// Play a sound
playSound('background-music');

// Pause the currently playing sound
pauseSound();

// Resume the paused sound
resumeSound();

// Stop all sounds immediately
stopAllSounds();

// This happens automatically when Stop is clicked
onStopClicked(() => {
  stopAllSounds();
  pauseAllActiveOperations();
});
```

## Requirements

- Modern web browser with WebRTC support
- Webcam and microphone access
- Node.js 14+ (for development)
- Audio context API support
- Canvas API support

## Advanced Features

### Motion Particle Effects
Create visual feedback with particles that follow motion patterns:
```javascript
enableMotionParticles({
  color: 'cyan',
  size: 5,
  lifetime: 2000,
  intensity: motionIntensity()
});
```

### Sound Visualization
Transform audio data into visual displays:
```javascript
enableSoundWaveVisualization({
  type: 'waveform', // waveform, spectrum, circular
  color: '#00FF00',
  smoothing: 0.8
});
```

### Gesture Recognition
Detect complex hand gestures for interactive control:
- Swipe (left, right, up, down)
- Circle (clockwise, counterclockwise)
- Point (single, double, triple)
- Wave
- Thumbs up/down

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues.
