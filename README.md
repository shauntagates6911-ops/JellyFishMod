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
│   │   └── soundControls.js
│   ├── extensions/
│   │   ├── MotionSensingExtension.js
│   │   └── SoundControlsExtension.js
│   ├── utils/
│   │   ├── videoCapture.js
│   │   ├── audioAnalysis.js
│   │   └── motionDetection.js
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

### Sound Control Blocks
- `detect sound` - Returns true/false if sound detected
- `sound volume` - Returns current volume level (0-100)
- `sound frequency` - Returns detected frequency in Hz
- `frequency range detection` - Detect sounds in frequency range
- `sound pattern detected` - Recognize specific sound patterns

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
```

## Requirements

- Modern web browser with WebRTC support
- Webcam and microphone access
- Node.js 14+ (for development)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues.
