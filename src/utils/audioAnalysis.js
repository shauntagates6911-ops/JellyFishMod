/**
 * Audio Analysis Utility
 * Analyzes audio input for frequency, volume, and patterns
 */

export class AudioAnalysis {
  constructor(audioContext) {
    this.audioContext = audioContext;
    this.analyser = audioContext.createAnalyser();
    this.analyser.fftSize = 2048;
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.timeDataArray = new Uint8Array(this.analyser.frequencyBinCount);
    
    this.audioData = {
      volume: 0,
      frequency: 0,
      frequencyRange: [],
      pattern: 'none',
      waveform: []
    };

    this.setupMicrophone();
  }

  async setupMicrophone() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const source = this.audioContext.createMediaStreamSource(stream);
      source.connect(this.analyser);
    } catch (error) {
      console.warn('Microphone access denied:', error);
    }
  }

  analyze() {
    this.analyser.getByteFrequencyData(this.dataArray);
    this.analyser.getByteTimeDomainData(this.timeDataArray);

    // Calculate volume
    let sum = 0;
    for (let i = 0; i < this.timeDataArray.length; i++) {
      sum += Math.abs(this.timeDataArray[i] - 128);
    }
    const volume = Math.min(100, Math.round((sum / this.timeDataArray.length) * 2));

    // Find dominant frequency
    let maxValue = 0;
    let maxIndex = 0;
    for (let i = 0; i < this.dataArray.length; i++) {
      if (this.dataArray[i] > maxValue) {
        maxValue = this.dataArray[i];
        maxIndex = i;
      }
    }
    const frequency = (maxIndex * this.audioContext.sampleRate) / this.analyser.fftSize;

    // Analyze frequency ranges (bass, mid, treble)
    const bassRange = this.getFrequencyRange(0, this.dataArray.length / 8);
    const midRange = this.getFrequencyRange(this.dataArray.length / 8, this.dataArray.length / 2);
    const trebleRange = this.getFrequencyRange(this.dataArray.length / 2, this.dataArray.length);

    // Detect pattern
    const pattern = this.detectPattern(this.timeDataArray);

    // Store waveform data
    const waveform = Array.from(this.timeDataArray.slice(0, 256)).map(v => v - 128);

    this.audioData = {
      volume,
      frequency: Math.round(frequency),
      frequencyRange: [
        { name: 'bass', value: bassRange },
        { name: 'mid', value: midRange },
        { name: 'treble', value: trebleRange }
      ],
      pattern,
      waveform
    };

    return this.audioData;
  }

  getFrequencyRange(start, end) {
    let sum = 0;
    for (let i = Math.floor(start); i < Math.floor(end); i++) {
      sum += this.dataArray[i];
    }
    return Math.round((sum / (end - start)) / 255 * 100);
  }

  detectPattern(timeData) {
    const threshold = 140;
    let peakCount = 0;
    
    for (let i = 1; i < timeData.length - 1; i++) {
      if (timeData[i] > threshold && 
          timeData[i] > timeData[i - 1] && 
          timeData[i] > timeData[i + 1]) {
        peakCount++;
      }
    }

    if (peakCount > 10) return 'rhythmic';
    if (peakCount > 5) return 'pulsing';
    if (peakCount > 0) return 'peaked';
    return 'smooth';
  }

  getAudioData() {
    return this.audioData;
  }
}

export default AudioAnalysis;
