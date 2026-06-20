/**
 * Little Town - Procedural Audio Manager
 * Generates BGM and SFX using Web Audio API (Offline & lightweight)
 */

const AudioSynth = {
  ctx: null,
  mainBgmTimer: null,
  gameBgmTimer: null,
  isMuted: false,
  activeOscillators: [],
  
  // Chord progression for cozy Home BGM
  homeChords: [
    [130.81, 164.81, 196.00, 261.63], // C3, E3, G3, C4 (C Major)
    [174.61, 220.00, 261.63, 349.23], // F3, A3, C4, F4 (F Major)
    [196.00, 246.94, 293.66, 392.00], // G3, B3, D4, G4 (G Major)
    [164.81, 196.00, 220.00, 329.63]  // E3, G3, A3, E4 (Am7)
  ],
  homeChordIndex: 0,

  // Melodic steps for Match-3 Game BGM
  gameMelody: [
    523.25, 659.25, 783.99, 1046.50, // C5, E5, G5, C6
    880.00, 698.46, 587.33, 493.88,  // A5, F5, D5, B4
    523.25, 783.99, 659.25, 880.00,  // C5, G5, E5, A5
    987.77, 783.99, 698.46, 587.33   // B5, G5, F5, D5
  ],
  gameMelodyIndex: 0,
  
  _noiseBuffer: null,

  init() {
    // Load muted state from localStorage
    const savedMuted = localStorage.getItem('lt_audio_muted');
    this.isMuted = savedMuted === 'true';
    this.updateMuteUI();
  },

  getContext() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  },

  toggleMute() {
    this.isMuted = !this.isMuted;
    localStorage.setItem('lt_audio_muted', this.isMuted ? 'true' : 'false');
    this.updateMuteUI();
    
    if (this.isMuted) {
      this.stopAllBgm();
    } else {
      // Resume current context and restart main BGM
      const ctx = this.getContext();
      if (ctx) {
        // If match-3 screen is open, play game BGM, otherwise play main BGM
        const gamePlayVisible = document.getElementById('gamePlayScreen') && document.getElementById('gamePlayScreen').style.display === 'flex';
        const gameViewActive = document.getElementById('viewGame') && document.getElementById('viewGame').classList.contains('active');
        if (gameViewActive && gamePlayVisible) {
          this.startGameBgm();
        } else {
          this.startMainBgm();
        }
      }
    }
  },

  updateMuteUI() {
    const btn = document.getElementById('btnAudioMute');
    if (btn) {
      btn.textContent = this.isMuted ? '🔇' : '🔊';
      btn.title = this.isMuted ? 'Bật âm thanh' : 'Tắt âm thanh';
    }
  },

  getNoiseBuffer(ctx) {
    if (this._noiseBuffer) return this._noiseBuffer;
    const bufferSize = ctx.sampleRate * 1.5; // 1.5 seconds of noise
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    this._noiseBuffer = buffer;
    return buffer;
  },

  // ----------------------------------------------------
  // BACKGROUND MUSIC
  // ----------------------------------------------------

  startMainBgm() {
    if (this.isMuted) return;
    this.stopAllBgm();

    const ctx = this.getContext();
    
    // Play first chord immediately
    this.playHomeChord();
    
    // Loop chord progression every 4.5 seconds
    this.mainBgmTimer = setInterval(() => {
      this.playHomeChord();
    }, 4500);
  },

  stopMainBgm() {
    if (this.mainBgmTimer) {
      clearInterval(this.mainBgmTimer);
      this.mainBgmTimer = null;
    }
  },

  playHomeChord() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;
    
    const chord = this.homeChords[this.homeChordIndex];
    this.homeChordIndex = (this.homeChordIndex + 1) % this.homeChords.length;

    // Strum the chord with a gentle delay between notes (arpeggiate)
    chord.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t + i * 0.08);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1000, t);
      filter.frequency.exponentialRampToValueAtTime(300, t + 3.0);

      // Soft envelope (gentle attack, long release)
      gainNode.gain.setValueAtTime(0, t);
      gainNode.gain.linearRampToValueAtTime(0.015, t + i * 0.08 + 0.3); // Peak volume
      gainNode.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.08 + 3.8); // Fade out

      osc.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(t + i * 0.08);
      osc.stop(t + i * 0.08 + 4.0);
    });
  },

  startGameBgm() {
    if (this.isMuted) return;
    this.stopAllBgm();

    const ctx = this.getContext();
    
    // Play first note immediately
    this.playGameMelodyStep();

    // Melody step runs every 280ms (approx. 107 BPM)
    this.gameBgmTimer = setInterval(() => {
      this.playGameMelodyStep();
    }, 280);
  },

  stopGameBgm() {
    if (this.gameBgmTimer) {
      clearInterval(this.gameBgmTimer);
      this.gameBgmTimer = null;
    }
  },

  playGameMelodyStep() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;

    const freq = this.gameMelody[this.gameMelodyIndex];
    this.gameMelodyIndex = (this.gameMelodyIndex + 1) % this.gameMelody.length;

    // Simple cozy chiptune sound
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, t);

    // Staccato envelope
    gainNode.gain.setValueAtTime(0.01, t);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.28);
  },

  stopAllBgm() {
    this.stopMainBgm();
    this.stopGameBgm();
  },

  // ----------------------------------------------------
  // SOUND EFFECTS
  // ----------------------------------------------------

  // Pet sounds (meow for cat, bark/woof for dog)
  playPetSound(type) {
    if (this.isMuted) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;

    if (type === 'cat') {
      // Cozy Cat Meow: Frequency sweep up, then slightly down with soft vibrato
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(450, t);
      osc.frequency.quadraticRampToValueAtTime(800, t + 0.12);
      osc.frequency.quadraticRampToValueAtTime(650, t + 0.26);

      // Add a quick vibrato effect manually by modulating pitch
      let vibratoInterval = 0.02;
      for (let i = 0.08; i < 0.24; i += vibratoInterval) {
        osc.frequency.setValueAtTime(700 + Math.sin(i * 50) * 20, t + i);
      }

      // Vol envelope
      gainNode.gain.setValueAtTime(0, t);
      gainNode.gain.linearRampToValueAtTime(0.08, t + 0.04);
      gainNode.gain.linearRampToValueAtTime(0.06, t + 0.16);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.3);

    } else if (type === 'dog') {
      // Cute Dog Bark: Double quick bark "ruff-ruff"
      const playSingleBark = (startTime, isSecond) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        const noise = ctx.createBufferSource();
        const noiseFilter = ctx.createBiquadFilter();
        const noiseGain = ctx.createGain();

        // Voice component
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(isSecond ? 260 : 240, startTime);
        osc.frequency.exponentialRampToValueAtTime(80, startTime + 0.06);

        gainNode.gain.setValueAtTime(0.08, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.07);

        // Noise scratch component
        noise.buffer = this.getNoiseBuffer(ctx);
        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.setValueAtTime(400, startTime);
        
        noiseGain.gain.setValueAtTime(0.03, startTime);
        noiseGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.06);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.08);
        noise.start(startTime);
        noise.stop(startTime + 0.08);
      };

      playSingleBark(t, false);
      playSingleBark(t + 0.13, true); // Second quick bark
    }
  },

  // Furniture & Decor: Wood block tap sound on drag end, rotate, flip, place
  playFurnitureSound() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;

    // Body resonance
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.exponentialRampToValueAtTime(60, t + 0.08);

    gainNode.gain.setValueAtTime(0.12, t);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);

    // Initial click/contact
    const clickOsc = ctx.createOscillator();
    const clickGain = ctx.createGain();
    clickOsc.type = 'sine';
    clickOsc.frequency.setValueAtTime(1000, t);
    clickGain.gain.setValueAtTime(0.04, t);
    clickGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.006);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    clickOsc.connect(clickGain);
    clickGain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.1);
    clickOsc.start(t);
    clickOsc.stop(t + 0.02);
  },

  // Match-3: Normal Match 3 chime (ascending G5 to C6)
  playMatch3Sound() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;

    const playChime = (freq, startTime, duration) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gainNode.gain.setValueAtTime(0.04, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.05);
    };

    playChime(784, t, 0.12);        // G5
    playChime(1046.5, t + 0.08, 0.18); // C6
  },

  // Match-3: Line Blast laser sweep (vertical/horizontal line blasts)
  playLineBlastSound() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const noise = ctx.createBufferSource();
    const noiseFilter = ctx.createBiquadFilter();
    const noiseGain = ctx.createGain();

    // Laser sweep
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1100, t);
    osc.frequency.exponentialRampToValueAtTime(150, t + 0.24);

    gainNode.gain.setValueAtTime(0.08, t);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);

    // Soft wind noise sweep
    noise.buffer = this.getNoiseBuffer(ctx);
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.setValueAtTime(400, t);
    
    noiseGain.gain.setValueAtTime(0.02, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.28);
    noise.start(t);
    noise.stop(t + 0.28);
  },

  // Match-3: Bomb explosion (deep resonant boom + noise rumble)
  playBombBlastSound() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const noise = ctx.createBufferSource();
    const noiseFilter = ctx.createBiquadFilter();
    const noiseGain = ctx.createGain();

    // Deep sub bass drop
    osc.type = 'sine';
    osc.frequency.setValueAtTime(110, t);
    osc.frequency.exponentialRampToValueAtTime(32, t + 0.45);

    gainNode.gain.setValueAtTime(0.18, t);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);

    // Rumble noise
    noise.buffer = this.getNoiseBuffer(ctx);
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(350, t);
    noiseFilter.frequency.exponentialRampToValueAtTime(40, t + 0.5);

    noiseGain.gain.setValueAtTime(0.10, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.6);
    noise.start(t);
    noise.stop(t + 0.6);
  },

  // Game Victory: Celebrating arpeggiated fanfare
  playLevelWin() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;

    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98]; // C5, E5, G5, C6, E6, G6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = idx === notes.length - 1 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, t + idx * 0.08);

      const playTime = idx * 0.08;
      gainNode.gain.setValueAtTime(0, t);
      gainNode.gain.linearRampToValueAtTime(0.05, t + playTime + 0.02);
      
      const duration = idx === notes.length - 1 ? 0.6 : 0.15;
      gainNode.gain.exponentialRampToValueAtTime(0.0001, t + playTime + duration);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(t + playTime);
      osc.stop(t + playTime + duration + 0.05);
    });
  },

  // Game Defeat: Descending sad sliding pitch
  playLevelLose() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, t); // A4
    osc.frequency.linearRampToValueAtTime(293.66, t + 0.16); // D4
    osc.frequency.linearRampToValueAtTime(220.00, t + 0.45); // A3

    gainNode.gain.setValueAtTime(0.06, t);
    gainNode.gain.linearRampToValueAtTime(0.05, t + 0.16);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.65);
  }
};

// Bind to window for easy inline access
window.AudioSynth = AudioSynth;
window.playPetSound = (type) => AudioSynth.playPetSound(type);
window.playFurnitureSound = () => AudioSynth.playFurnitureSound();
window.toggleMute = () => AudioSynth.toggleMute();
