/**
 * Sound Manager Utility
 * Handles audio playback, pause, resume, and effects
 */

export class SoundManager {
  constructor(audioContext) {
    this.audioContext = audioContext;
    this.sounds = new Map();
    this.currentPlayback = null;
    this.isMuted = false;
    this.masterVolume = 1.0;
    this.effectNodes = {
      reverb: null,
      echo: null,
      compressor: null
    };

    this.setupEffects();
  }

  setupEffects() {
    // Create audio nodes for effects
    this.effectNodes.compressor = this.audioContext.createDynamicsCompressor();
    this.effectNodes.compressor.connect(this.audioContext.destination);
  }

  async loadSound(name, url) {
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      this.sounds.set(name, audioBuffer);
      return true;
    } catch (error) {
      console.error(`Failed to load sound ${name}:`, error);
      return false;
    }
  }

  playSound(name, options = {}) {
    const audioBuffer = this.sounds.get(name);
    if (!audioBuffer) {
      console.warn(`Sound ${name} not found`);
      return null;
    }

    const source = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();
    
    source.buffer = audioBuffer;
    source.playbackRate.value = options.speed || 1.0;
    gainNode.gain.value = (options.volume || 100) / 100 * this.masterVolume;
    
    source.connect(gainNode);
    gainNode.connect(this.effectNodes.compressor);

    source.start(0, options.offset || 0);

    const playback = {
      source,
      gainNode,
      name,
      startTime: this.audioContext.currentTime,
      pauseTime: 0,
      isPaused: false
    };

    this.currentPlayback = playback;
    return playback;
  }

  pauseSound() {
    if (!this.currentPlayback || this.currentPlayback.isPaused) return;

    this.currentPlayback.pauseTime = this.audioContext.currentTime;
    this.currentPlayback.source.stop();
    this.currentPlayback.isPaused = true;
  }

  resumeSound() {
    if (!this.currentPlayback || !this.currentPlayback.isPaused) return;

    const pausedDuration = this.audioContext.currentTime - this.currentPlayback.pauseTime;
    const offset = pausedDuration;
    
    const newSource = this.audioContext.createBufferSource();
    newSource.buffer = this.currentPlayback.source.buffer;
    newSource.connect(this.currentPlayback.gainNode);
    
    newSource.start(0, offset);
    this.currentPlayback.source = newSource;
    this.currentPlayback.isPaused = false;
  }

  stopSound(name = null) {
    if (name) {
      // Stop specific sound
      const playback = Array.from(this.sounds.entries()).find(([key]) => key === name);
      if (playback) {
        playback[1].stop();
      }
    } else if (this.currentPlayback) {
      // Stop current playback
      try {
        this.currentPlayback.source.stop();
      } catch (e) {
        // Already stopped
      }
      this.currentPlayback = null;
    }
  }

  stopAllSounds() {
    if (this.currentPlayback) {
      try {
        this.currentPlayback.source.stop();
      } catch (e) {
        // Already stopped
      }
    }
    this.currentPlayback = null;
  }

  setVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume / 100));
    if (this.currentPlayback) {
      this.currentPlayback.gainNode.gain.value = this.masterVolume;
    }
  }

  setPlaybackSpeed(speed) {
    if (this.currentPlayback) {
      this.currentPlayback.source.playbackRate.value = Math.max(0.25, Math.min(2.0, speed));
    }
  }

  addEcho(time = 0.5, feedback = 0.5) {
    const delayNode = this.audioContext.createDelay(5);
    const feedbackNode = this.audioContext.createGain();
    
    delayNode.delayTime.value = time;
    feedbackNode.gain.value = feedback;
    
    delayNode.connect(feedbackNode);
    feedbackNode.connect(delayNode);
    delayNode.connect(this.audioContext.destination);
    
    this.effectNodes.echo = delayNode;
    return delayNode;
  }

  getCurrentPlayback() {
    return this.currentPlayback;
  }
}

export default SoundManager;
