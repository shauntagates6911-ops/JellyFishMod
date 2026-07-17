/**
 * Video Capture Utility
 * Handles webcam access and frame capture
 */

export class VideoCapture {
  constructor(videoStream) {
    this.stream = videoStream;
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.video = document.createElement('video');
    this.video.srcObject = videoStream;
    this.video.play();
    this.frameCallback = null;
  }

  startCapture(callback) {
    this.frameCallback = callback;
    this.captureFrame();
  }

  captureFrame() {
    if (!this.frameCallback) return;

    this.canvas.width = this.video.videoWidth;
    this.canvas.height = this.video.videoHeight;
    this.ctx.drawImage(this.video, 0, 0);

    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    this.frameCallback(imageData);

    requestAnimationFrame(() => this.captureFrame());
  }

  stopCapture() {
    this.frameCallback = null;
  }

  getFrame() {
    this.canvas.width = this.video.videoWidth;
    this.canvas.height = this.video.videoHeight;
    this.ctx.drawImage(this.video, 0, 0);
    return this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
  }

  destroy() {
    this.stopCapture();
    this.stream.getTracks().forEach(track => track.stop());
  }
}

export default VideoCapture;
