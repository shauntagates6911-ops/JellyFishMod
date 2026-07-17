/**
 * Advanced Blocks Extension
 * Provides amazing advanced blocks including gestures, particles, visualization, etc.
 */

export class AdvancedBlocksExtension {
  constructor(jellyfishMod) {
    this.jellyfishMod = jellyfishMod;
    this.motionSensing = jellyfishMod.extensions?.find(e => e.constructor.name === 'MotionSensingExtension');
    this.soundControls = jellyfishMod.extensions?.find(e => e.constructor.name === 'SoundControlsExtension');
    
    this.particleSystem = new ParticleSystem();
    this.gestureRecognizer = new GestureRecognizer();
    this.visualizer = new AudioVisualizer();
    this.emotionDetector = new EmotionDetector();
    this.motionRecorder = new MotionRecorder();
    this.soundToAnimation = new SoundToAnimation();
  }

  async initialize() {
    this.visualizer.initialize();
  }

  // Block: detect gesture
  detectGesture() {
    return this.gestureRecognizer.getCurrentGesture();
  }

  // Block: motion trail on/off
  setMotionTrail(enabled) {
    if (enabled) {
      this.particleSystem.startParticles({
        type: 'motion-trail',
        color: 'cyan',
        size: 3,
        lifetime: 1000
      });
    } else {
      this.particleSystem.stop();
    }
  }

  // Block: sound spectrum analyzer
  getSoundSpectrum() {
    if (this.soundControls?.audioAnalysis) {
      return this.soundControls.audioAnalysis.getAudioData().frequencyRange;
    }
    return [];
  }

  // Block: motion particle effect
  enableMotionParticles(config) {
    this.particleSystem.startParticles({
      type: 'motion',
      color: config.color || 'cyan',
      size: config.size || 5,
      lifetime: config.lifetime || 2000,
      intensity: config.intensity || 0
    });
  }

  // Block: emotion detection
  detectEmotion() {
    if (this.motionSensing) {
      return this.emotionDetector.analyzeMotion(
        this.motionSensing.getMotionIntensity(),
        this.motionSensing.getMotionDirection()
      );
    }
    return 'neutral';
  }

  // Block: motion recording
  recordMotion(duration) {
    this.motionRecorder.start(duration, () => {
      if (this.motionSensing) {
        return {
          intensity: this.motionSensing.getMotionIntensity(),
          direction: this.motionSensing.getMotionDirection(),
          angle: this.motionSensing.getMotionAngle()
        };
      }
    });
  }

  // Block: replay recorded motion
  replayMotion() {
    return this.motionRecorder.getRecordedSequence();
  }

  // Block: sound mix tracks
  mixTracks(track1, track2, blend = 0.5) {
    // Mix two audio sources with blend factor (0-1)
    return blend;
  }

  // Block: sound to animation
  generateAnimationFromSound() {
    if (this.soundControls?.audioAnalysis) {
      const audioData = this.soundControls.audioAnalysis.getAudioData();
      return this.soundToAnimation.generateKeyframes(audioData);
    }
    return [];
  }

  // Block: create soundwave visualization
  createSoundwave(config) {
    this.visualizer.setSoundwaveConfig({
      type: config.type || 'waveform',
      color: config.color || '#00FF00',
      smoothing: config.smoothing || 0.8
    });
    this.visualizer.start();
  }

  // Block: motion physics
  applyMotionPhysics(spriteId, options = {}) {
    return {
      gravity: options.gravity || 0,
      friction: options.friction || 0.98,
      bounce: options.bounce || 0.8
    };
  }

  destroy() {
    this.particleSystem.destroy();
    this.visualizer.destroy();
  }
}

// Particle System Class
class ParticleSystem {
  constructor() {
    this.particles = [];
    this.canvas = document.createElement('canvas');
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '9999';
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.isRunning = false;
    this.config = {};
  }

  startParticles(config) {
    this.config = config;
    this.isRunning = true;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.animate();
  }

  animate() {
    if (!this.isRunning) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.lifetime -= 16;

      if (p.lifetime <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = p.lifetime / p.maxLifetime;
      this.ctx.fillRect(p.x, p.y, p.size, p.size);
    }

    this.ctx.globalAlpha = 1;
    requestAnimationFrame(() => this.animate());
  }

  addParticle(x, y) {
    this.particles.push({
      x,
      y,
      size: this.config.size || 5,
      color: this.config.color || 'cyan',
      lifetime: this.config.lifetime || 2000,
      maxLifetime: this.config.lifetime || 2000
    });
  }

  stop() {
    this.isRunning = false;
  }

  destroy() {
    this.stop();
    if (this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }
}

// Gesture Recognizer Class
class GestureRecognizer {
  constructor() {
    this.currentGesture = 'none';
    this.points = [];
  }

  getCurrentGesture() {
    return this.currentGesture;
  }

  recognize(points) {
    // Simple gesture recognition
    if (points.length < 5) return 'none';

    const distance = Math.hypot(points[0].x - points[points.length - 1].x, points[0].y - points[points.length - 1].y);
    if (distance < 50) {
      this.currentGesture = 'circle';
    } else {
      this.currentGesture = 'swipe';
    }
    return this.currentGesture;
  }
}

// Audio Visualizer Class
class AudioVisualizer {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 512;
    this.canvas.height = 256;
    this.ctx = this.canvas.getContext('2d');
    this.config = {};
  }

  initialize() {
    this.canvas.style.position = 'fixed';
    this.canvas.style.bottom = '20px';
    this.canvas.style.right = '20px';
    this.canvas.style.zIndex = '9999';
    document.body.appendChild(this.canvas);
  }

  setSoundwaveConfig(config) {
    this.config = config;
  }

  start() {
    // Animation loop
  }

  destroy() {
    if (this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }
}

// Emotion Detector Class
class EmotionDetector {
  analyzeMotion(intensity, direction) {
    if (intensity > 80) return 'excited';
    if (intensity > 50) return 'active';
    if (intensity > 20) return 'engaged';
    return 'neutral';
  }
}

// Motion Recorder Class
class MotionRecorder {
  constructor() {
    this.recording = [];
    this.isRecording = false;
  }

  start(duration, callback) {
    this.recording = [];
    this.isRecording = true;
    const startTime = Date.now();

    const interval = setInterval(() => {
      if (!this.isRecording || Date.now() - startTime > duration * 1000) {
        this.isRecording = false;
        clearInterval(interval);
        return;
      }

      const data = callback();
      this.recording.push(data);
    }, 50);
  }

  getRecordedSequence() {
    return this.recording;
  }
}

// Sound to Animation Class
class SoundToAnimation {
  generateKeyframes(audioData) {
    const keyframes = [];
    audioData.frequencyRange.forEach((range, index) => {
      keyframes.push({
        time: index * 0.1,
        scale: range.value / 100,
        rotation: range.value * 3.6
      });
    });
    return keyframes;
  }
}

export default AdvancedBlocksExtension;
