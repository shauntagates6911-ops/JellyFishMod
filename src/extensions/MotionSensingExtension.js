/**
 * Motion Sensing Extension
 * Provides motion detection blocks
 */

import { VideoCapture } from '../utils/videoCapture';
import { MotionDetection } from '../utils/motionDetection';

export class MotionSensingExtension {
  constructor(jellyfishMod) {
    this.jellyfishMod = jellyfishMod;
    this.videoCapture = null;
    this.motionDetection = null;
    this.analysisInterval = null;
  }

  async initialize() {
    const videoStream = this.jellyfishMod.getVideoStream();
    if (videoStream) {
      this.videoCapture = new VideoCapture(videoStream);
      this.motionDetection = new MotionDetection(this.videoCapture);
      
      // Start continuous analysis
      this.startAnalysis();
    }
  }

  startAnalysis() {
    this.analysisInterval = setInterval(() => {
      if (this.motionDetection) {
        this.motionDetection.analyze();
      }
    }, 33); // ~30fps
  }

  stopAnalysis() {
    if (this.analysisInterval) {
      clearInterval(this.analysisInterval);
    }
  }

  // Block: detect motion
  detectMotion() {
    return this.motionDetection?.getMotionData().detected || false;
  }

  // Block: motion direction
  getMotionDirection() {
    return this.motionDetection?.getMotionData().direction || 'none';
  }

  // Block: motion intensity
  getMotionIntensity() {
    return this.motionDetection?.getMotionData().intensity || 0;
  }

  // Block: motion x velocity
  getMotionVelocityX() {
    return this.motionDetection?.getMotionData().velocityX || 0;
  }

  // Block: motion y velocity
  getMotionVelocityY() {
    return this.motionDetection?.getMotionData().velocityY || 0;
  }

  // Block: motion angle
  getMotionAngle() {
    return this.motionDetection?.getMotionData().angle || 0;
  }

  // Block: set motion threshold
  setMotionThreshold(value) {
    if (this.motionDetection) {
      this.motionDetection.setThreshold(value);
    }
  }

  destroy() {
    this.stopAnalysis();
    if (this.videoCapture) {
      this.videoCapture.destroy();
    }
  }
}

export default MotionSensingExtension;
