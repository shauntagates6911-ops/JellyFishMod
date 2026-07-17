/**
 * Sound Controls Extension
 * Provides sound playback, pause, resume, and effects blocks
 */

import { AudioAnalysis } from '../utils/audioAnalysis';
import { SoundManager } from '../utils/soundManager';

export class SoundControlsExtension {
  constructor(jellyfishMod) {
    this.jellyfishMod = jellyfishMod;
    this.audioAnalysis = null;
    this.soundManager = null;
    this.analysisInterval = null;
    this.eventHandlers = {
      onSoundDetected: [],
      onStopped: []
    };
  }

  async initialize() {
    const audioContext = this.jellyfishMod.getAudioContext();
    if (audioContext) {
      this.audioAnalysis = new AudioAnalysis(audioContext);
      this.soundManager = new SoundManager(audioContext);
      
      // Start continuous analysis
      this.startAnalysis();
    }

    // Setup stop event
    this.setupStopEvent();
  }

  startAnalysis() {
    this.analysisInterval = setInterval(() => {
      if (this.audioAnalysis) {
        this.audioAnalysis.analyze();
      }
    }, 33); // ~30fps
  }

  stopAnalysis() {
    if (this.analysisInterval) {
      clearInterval(this.analysisInterval);
    }
  }

  setupStopEvent() {
    // This would integrate with Scratch's stop event
    window.addEventListener('scratch:stop', () => {
      this.onStopClicked();
    });
  }

  // Block: detect sound
  detectSound() {
    return this.audioAnalysis?.getAudioData().volume > 20 || false;
  }

  // Block: sound volume
  getSoundVolume() {
    return this.audioAnalysis?.getAudioData().volume || 0;
  }

  // Block: sound frequency
  getSoundFrequency() {
    return this.audioAnalysis?.getAudioData().frequency || 0;
  }

  // Block: frequency range detection
  getFrequencyRange(range = 'mid') {
    const ranges = this.audioAnalysis?.getAudioData().frequencyRange || [];
    const found = ranges.find(r => r.name === range);
    return found?.value || 0;
  }

  // Block: sound pattern detected
  getSoundPattern() {
    return this.audioAnalysis?.getAudioData().pattern || 'none';
  }

  // Block: play sound
  playSound(name, options = {}) {
    return this.soundManager?.playSound(name, options);
  }

  // Block: pause sound
  pauseSound() {
    this.soundManager?.pauseSound();
  }

  // Block: resume sound
  resumeSound() {
    this.soundManager?.resumeSound();
  }

  // Block: stop all sounds
  stopAllSounds() {
    this.soundManager?.stopAllSounds();
  }

  // Block: set sound volume
  setSoundVolume(volume) {
    this.soundManager?.setVolume(volume);
  }

  // Block: sound playback speed
  setSoundPlaybackSpeed(speed) {
    this.soundManager?.setPlaybackSpeed(speed);
  }

  // Block: add echo effect
  addEchoEffect(time, feedback) {
    this.soundManager?.addEcho(time, feedback);
  }

  // Event: when stopped
  onStopClicked() {
    this.stopAllSounds();
    this.eventHandlers.onStopped.forEach(handler => handler());
  }

  // Event registration
  onSoundDetected(handler) {
    this.eventHandlers.onSoundDetected.push(handler);
  }

  onStopped(handler) {
    this.eventHandlers.onStopped.push(handler);
  }

  destroy() {
    this.stopAnalysis();
  }
}

export default SoundControlsExtension;
