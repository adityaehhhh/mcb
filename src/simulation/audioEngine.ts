// Web Audio API Synthesizer for MCB Testing System Physical Equipment
class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private humOsc: OscillatorNode | null = null;
  private humGain: GainNode | null = null;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopCurrentHum();
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  // 1. POWER ON: Soft electrical startup hum
  public playPowerOn() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(50, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.3);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.6);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.65);
  }

  // 2. CONTACTOR CLOSE: Mechanical high-force magnetic contact snap
  public playContactorClose() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // Contact 1: Initial armature strike
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(180, now);
    osc1.frequency.exponentialRampToValueAtTime(40, now + 0.04);
    gain1.gain.setValueAtTime(0.25, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.045);
    osc1.connect(gain1);
    gain1.connect(this.ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.05);

    // Contact 2: Main contact impact (12ms later)
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'square';
    osc2.frequency.setValueAtTime(110, now + 0.012);
    osc2.frequency.exponentialRampToValueAtTime(30, now + 0.06);
    gain2.gain.setValueAtTime(0.2, now + 0.012);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
    osc2.connect(gain2);
    gain2.connect(this.ctx.destination);
    osc2.start(now + 0.012);
    osc2.stop(now + 0.08);
  }

  // 3. CURRENT FLOW: Continuous low-level 50Hz load hum
  public startCurrentHum(intensityRatio: number = 0.5) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    if (!this.humOsc) {
      this.humOsc = this.ctx.createOscillator();
      this.humGain = this.ctx.createGain();

      this.humOsc.type = 'sawtooth';
      this.humOsc.frequency.setValueAtTime(50, this.ctx.currentTime);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(160, this.ctx.currentTime);

      this.humGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      const targetVol = Math.min(0.08, 0.02 + intensityRatio * 0.06);
      this.humGain.gain.linearRampToValueAtTime(targetVol, this.ctx.currentTime + 0.3);

      this.humOsc.connect(filter);
      filter.connect(this.humGain);
      this.humGain.connect(this.ctx.destination);

      this.humOsc.start();
    } else if (this.humGain) {
      const targetVol = Math.min(0.12, 0.02 + intensityRatio * 0.08);
      this.humGain.gain.linearRampToValueAtTime(targetVol, this.ctx.currentTime + 0.2);
    }
  }

  public stopCurrentHum() {
    if (this.humOsc && this.humGain && this.ctx) {
      try {
        this.humGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.1);
        const osc = this.humOsc;
        setTimeout(() => {
          try {
            osc.stop();
            osc.disconnect();
          } catch (e) {}
        }, 120);
      } catch (e) {}
      this.humOsc = null;
      this.humGain = null;
    }
  }

  // 4. MCB TRIP: Crisp, sharp mechanical toggle latch release
  public playMcbTrip() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    this.stopCurrentHum();
    const now = this.ctx.currentTime;

    // High frequency mechanical click
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.06);
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);

    // Spring slap thump
    const thud = this.ctx.createOscillator();
    const thudGain = this.ctx.createGain();
    thud.type = 'sine';
    thud.frequency.setValueAtTime(140, now + 0.01);
    thud.frequency.exponentialRampToValueAtTime(30, now + 0.08);
    thudGain.gain.setValueAtTime(0.3, now + 0.01);
    thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
    thud.connect(thudGain);
    thudGain.connect(this.ctx.destination);
    thud.start(now + 0.01);
    thud.stop(now + 0.1);
  }

  // 5. SHORT-CIRCUIT FAULT: Crisp electric arc crack / spark sound at downstream fault point
  public playShortCircuitSpark() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.12; // 120ms burst
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      // Noise burst with decaying envelope
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, now);
    filter.Q.setValueAtTime(2.0, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
  }

  // 6. EMERGENCY STOP: Heavy shutoff clunk
  public playEmergencyStop() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    this.stopCurrentHum();
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.14);
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.16);
  }

  // 7. TEST COMPLETE: Gentle positive chime
  public playTestComplete() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.setValueAtTime(880, now + 0.12); // A5

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.52);
  }
}

export const audioEngine = new SoundEngine();
