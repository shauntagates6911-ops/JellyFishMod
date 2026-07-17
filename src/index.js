/**
 * JellyFishMod - Main Entry Point
 * Initializes all extensions and blocks
 */

import MotionSensingExtension from './extensions/MotionSensingExtension';
import SoundControlsExtension from './extensions/SoundControlsExtension';
import AdvancedBlocksExtension from './extensions/AdvancedBlocksExtension';

class JellyFishMod {
  constructor() {
    this.extensions = [];
    this.isRunning = false;
    this.audioContext = null;
    this.videoStream = null;
  }

  async initialize() {
    console.log('Initializing JellyFishMod...');
    
    // Initialize audio context
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Request permissions
    try {
      this.videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
      await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('Media permissions granted');
    } catch (error) {
      console.warn('Media permissions denied:', error);
    }

    // Load extensions
    this.extensions.push(new MotionSensingExtension(this));
    this.extensions.push(new SoundControlsExtension(this));
    this.extensions.push(new AdvancedBlocksExtension(this));

    // Initialize all extensions
    for (const extension of this.extensions) {
      await extension.initialize();
    }

    this.isRunning = true;
    console.log('JellyFishMod initialized successfully');
  }

  destroy() {
    if (this.videoStream) {
      this.videoStream.getTracks().forEach(track => track.stop());
    }
    if (this.audioContext) {
      this.audioContext.close();
    }
    this.isRunning = false;
  }

  getAudioContext() {
    return this.audioContext;
  }

  getVideoStream() {
    return this.videoStream;
  }
}

export default JellyFishMod;
