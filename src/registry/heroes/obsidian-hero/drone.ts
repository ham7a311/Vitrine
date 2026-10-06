/**
 * A quiet ambient bed made in the browser: two low detuned tones and a
 * breath of filtered noise, faded in and out so it never clicks.
 */
export type Drone = { start: () => Promise<void>; stop: () => void; level: (into: Uint8Array<ArrayBuffer>) => void; close: () => void };

export function createDrone(): Drone | null {
  const AC = (window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext);
  if (!AC) return null;
  const ctx = new AC();
  const out = ctx.createGain();
  out.gain.value = 0;
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 256;
  out.connect(analyser).connect(ctx.destination);

  const tones = [55, 82.6, 110.4].map((f, i) => {
    const o = ctx.createOscillator();
    o.type = i === 2 ? "triangle" : "sine";
    o.frequency.value = f;
    o.detune.value = i === 1 ? 7 : -4;
    const g = ctx.createGain();
    g.gain.value = [0.5, 0.32, 0.08][i];
    // A very slow swell on each tone, out of step with the others.
    const lfo = ctx.createOscillator(), depth = ctx.createGain();
    lfo.frequency.value = 0.05 + i * 0.031;
    depth.gain.value = [0.18, 0.12, 0.05][i];
    lfo.connect(depth).connect(g.gain);
    o.connect(g).connect(out);
    o.start(); lfo.start();
    return o;
  });
  const len = ctx.sampleRate * 2, buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
  for (let i = 0, b = 0; i < len; i++) { b = 0.97 * b + 0.03 * (Math.random() * 2 - 1); d[i] = b * 3; }
  const noise = ctx.createBufferSource();
  noise.buffer = buf; noise.loop = true;
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass"; lp.frequency.value = 420;
  const ng = ctx.createGain(); ng.gain.value = 0.22;
  noise.connect(lp).connect(ng).connect(out);
  noise.start();
  void ctx.suspend();

  return {
    async start() {
      await ctx.resume();
      out.gain.cancelScheduledValues(ctx.currentTime);
      out.gain.setValueAtTime(out.gain.value, ctx.currentTime);
      out.gain.linearRampToValueAtTime(0.16, ctx.currentTime + 1.4);
    },
    stop() {
      out.gain.cancelScheduledValues(ctx.currentTime);
      out.gain.setValueAtTime(out.gain.value, ctx.currentTime);
      out.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8);
      setTimeout(() => { if (out.gain.value < 0.01) void ctx.suspend(); }, 900);
    },
    level(into) { analyser.getByteTimeDomainData(into); },
    close() { tones.forEach((o) => o.stop()); noise.stop(); void ctx.close(); },
  };
}
