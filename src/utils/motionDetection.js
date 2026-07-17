/**
 * Motion Detection Utility
 * Analyzes video frames for motion
 */

export class MotionDetection {
  constructor(videoCapture) {
    this.videoCapture = videoCapture;
    this.previousFrame = null;
    this.threshold = 30;
    this.motionData = {
      detected: false,
      intensity: 0,
      direction: 'none',
      velocityX: 0,
      velocityY: 0,
      angle: 0
    };
  }

  setThreshold(value) {
    this.threshold = Math.max(0, Math.min(255, value));
  }

  analyze() {
    const currentFrame = this.videoCapture.getFrame();
    
    if (!this.previousFrame) {
      this.previousFrame = currentFrame;
      return this.motionData;
    }

    const currentData = currentFrame.data;
    const previousData = this.previousFrame.data;
    
    let totalDiff = 0;
    let motionX = 0;
    let motionY = 0;
    let pixelCount = 0;

    for (let i = 0; i < currentData.length; i += 4) {
      const dr = currentData[i] - previousData[i];
      const dg = currentData[i + 1] - previousData[i + 1];
      const db = currentData[i + 2] - previousData[i + 2];
      const diff = Math.sqrt(dr * dr + dg * dg + db * db);

      if (diff > this.threshold) {
        totalDiff += diff;
        pixelCount++;
        
        // Calculate motion direction
        const pixelIndex = i / 4;
        const width = currentFrame.width;
        const x = pixelIndex % width;
        const y = Math.floor(pixelIndex / width);
        
        motionX += x * diff;
        motionY += y * diff;
      }
    }

    const intensity = Math.min(100, (totalDiff / (currentData.length / 4)) * 2);
    
    if (pixelCount > 0) {
      motionX /= pixelCount;
      motionY /= pixelCount;
    }

    // Calculate velocity and angle
    const velocityX = motionX - (this.previousMotionX || motionX);
    const velocityY = motionY - (this.previousMotionY || motionY);
    const angle = Math.atan2(velocityY, velocityX) * 180 / Math.PI;

    this.previousMotionX = motionX;
    this.previousMotionY = motionY;
    this.previousFrame = currentFrame;

    // Determine direction
    let direction = 'none';
    if (Math.abs(velocityX) > Math.abs(velocityY)) {
      direction = velocityX > 0 ? 'right' : 'left';
    } else if (velocityY !== 0) {
      direction = velocityY > 0 ? 'down' : 'up';
    }

    this.motionData = {
      detected: intensity > 5,
      intensity: Math.round(intensity),
      direction,
      velocityX: Math.round(velocityX),
      velocityY: Math.round(velocityY),
      angle: Math.round(angle)
    };

    return this.motionData;
  }

  getMotionData() {
    return this.motionData;
  }
}

export default MotionDetection;
