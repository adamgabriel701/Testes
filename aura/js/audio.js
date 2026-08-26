/* =============================================
   SISTEMA DE ÁUDIO — Micro-sons sintetizados
   ============================================= */
const AudioSystem = {
  ctx: null,
  enabled: true,

  init() {
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
  },

  ensure() {
    if (!this.ctx) this.init();
    if (this.ctx.state === 'suspended') this.ctx.resume();
  },

  click() {
    if (!this.enabled) return;
    this.ensure();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(400, t + 0.08);
    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    osc.connect(gain).connect(this.ctx.destination);
    osc.start(t); osc.stop(t + 0.1);
  },

  hover() {
    if (!this.enabled) return;
    this.ensure();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, t);
    osc.frequency.exponentialRampToValueAtTime(1400, t + 0.04);
    gain.gain.setValueAtTime(0.03, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    osc.connect(gain).connect(this.ctx.destination);
    osc.start(t); osc.stop(t + 0.05);
  },

  hit() {
    if (!this.enabled) return;
    this.ensure();
    const t = this.ctx.currentTime;
    [600, 800, 1000].forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, t + i * 0.06);
      gain.gain.setValueAtTime(0.06, t + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.06 + 0.15);
      osc.connect(gain).connect(this.ctx.destination);
      osc.start(t + i * 0.06); osc.stop(t + i * 0.06 + 0.15);
    });
  },

  miss() {
    if (!this.enabled) return;
    this.ensure();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, t);
    osc.frequency.exponentialRampToValueAtTime(100, t + 0.15);
    gain.gain.setValueAtTime(0.04, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    osc.connect(gain).connect(this.ctx.destination);
    osc.start(t); osc.stop(t + 0.2);
  },

  transition() {
    if (!this.enabled) return;
    this.ensure();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, t);
    osc.frequency.exponentialRampToValueAtTime(600, t + 0.2);
    osc.frequency.exponentialRampToValueAtTime(500, t + 0.4);
    gain.gain.setValueAtTime(0.05, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
    osc.connect(gain).connect(this.ctx.destination);
    osc.start(t); osc.stop(t + 0.5);
  },

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }
};
