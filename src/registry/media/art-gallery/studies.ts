/**
 * Generative "studies": deterministic artworks painted on a canvas, so a gallery
 * needs no image files. paintStudy(seed) always paints the same picture for a seed;
 * the seed picks one of seven compositions and one of twelve palettes.
 */

export const STUDY_PALETTES: string[][] = [
  ["#0e1a2b", "#f2c14e", "#f78154", "#4d9078", "#b4436c"],
  ["#1b1b1e", "#e4572e", "#f3a712", "#a8c686", "#669bbc"],
  ["#f4efe6", "#1d3557", "#e63946", "#a8dadc", "#457b9d"],
  ["#10002b", "#7b2cbf", "#c77dff", "#e0aaff", "#ff9e00"],
  ["#081c15", "#2d6a4f", "#95d5b2", "#d8f3dc", "#f4a261"],
  ["#2b2d42", "#ef233c", "#edf2f4", "#8d99ae", "#ffb703"],
  ["#fdf0d5", "#c1121f", "#780000", "#003049", "#669bbc"],
  ["#0b090a", "#e5383b", "#f5f3f4", "#b1a7a6", "#660708"],
  ["#03045e", "#0077b6", "#00b4d8", "#90e0ef", "#caf0f8"],
  ["#22223b", "#4a4e69", "#9a8c98", "#c9ada7", "#f2e9e4"],
  ["#1a1423", "#ff5d73", "#ffd166", "#06d6a0", "#118ab2"],
  ["#e9edc9", "#344e41", "#a3b18a", "#dda15e", "#bc6c25"],
];

/** Small, fast, seedable PRNG (mulberry32). */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Ctx = CanvasRenderingContext2D;

function grain(ctx: Ctx, w: number, h: number, r: () => number, amount = 18) {
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (r() - 0.5) * amount;
    d[i] += n;
    d[i + 1] += n;
    d[i + 2] += n;
  }
  ctx.putImageData(img, 0, 0);
}

function flow(ctx: Ctx, w: number, h: number, p: string[], r: () => number) {
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, p[0]);
  g.addColorStop(1, p[4]);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  const f1 = 1.5 + r() * 3, f2 = 1.5 + r() * 3, ph = r() * 6;
  ctx.lineCap = "round";
  for (let i = 0; i < 420; i++) {
    let x = r() * w, y = r() * h;
    ctx.strokeStyle = p[1 + Math.floor(r() * 3)];
    ctx.globalAlpha = 0.25 + r() * 0.55;
    ctx.lineWidth = 0.6 + r() * 2.6;
    ctx.beginPath();
    ctx.moveTo(x, y);
    for (let s = 0; s < 40; s++) {
      const a = Math.sin((x / w) * f1 + ph) * Math.PI + Math.cos((y / h) * f2 - ph) * Math.PI;
      x += Math.cos(a) * 4;
      y += Math.sin(a) * 4;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

function rings(ctx: Ctx, w: number, h: number, p: string[], r: () => number) {
  ctx.fillStyle = p[0];
  ctx.fillRect(0, 0, w, h);
  const cx = w * (0.3 + r() * 0.4), cy = h * (0.3 + r() * 0.4);
  for (let k = 14; k > 0; k--) {
    ctx.beginPath();
    ctx.arc(cx, cy, (k / 14) * w * 0.62, 0, Math.PI * 2);
    ctx.fillStyle = p[1 + (k % 4)];
    ctx.fill();
  }
  ctx.globalCompositeOperation = "multiply";
  ctx.fillStyle = p[0];
  ctx.globalAlpha = 0.5;
  ctx.fillRect(r() > 0.5 ? 0 : w / 2, 0, w / 2, h);
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
}

function blur(ctx: Ctx, w: number, h: number, p: string[], r: () => number) {
  ctx.fillStyle = p[0];
  ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 6; i++) {
    const x = r() * w, y = r() * h, rad = w * (0.25 + r() * 0.45);
    const g = ctx.createRadialGradient(x, y, 0, x, y, rad);
    g.addColorStop(0, p[1 + (i % 4)]);
    g.addColorStop(1, "transparent");
    ctx.globalAlpha = 0.85;
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }
  ctx.globalAlpha = 1;
}

function stripes(ctx: Ctx, w: number, h: number, p: string[], r: () => number) {
  ctx.fillStyle = p[0];
  ctx.fillRect(0, 0, w, h);
  const n = 18 + Math.floor(r() * 14), amp = 10 + r() * 30, fr = 2 + r() * 4;
  for (let i = 0; i < n; i++) {
    ctx.beginPath();
    for (let x = 0; x <= w; x += 4) {
      const y = (i / n) * h + Math.sin((x / w) * fr * Math.PI + i * 0.35) * amp;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fillStyle = p[1 + (i % 4)];
    ctx.fill();
  }
}

function dots(ctx: Ctx, w: number, h: number, p: string[], r: () => number) {
  ctx.fillStyle = p[0];
  ctx.fillRect(0, 0, w, h);
  const n = 6 + Math.floor(r() * 4), s = w / n;
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++) {
      const k = r();
      ctx.fillStyle = p[1 + Math.floor(k * 4)];
      ctx.save();
      ctx.beginPath();
      ctx.rect(i * s, j * s, s, s);
      ctx.clip();
      ctx.beginPath();
      if (k < 0.35) ctx.arc(i * s + s / 2, j * s + s / 2, s * (0.2 + r() * 0.28), 0, Math.PI * 2);
      else if (k < 0.7) ctx.arc(i * s + (k < 0.5 ? 0 : s), j * s + (k < 0.6 ? 0 : s), s, 0, Math.PI * 2);
      else ctx.rect(i * s + s * 0.15, j * s + s * 0.15, s * 0.7, s * 0.7);
      ctx.fill();
      ctx.restore();
    }
}

function horizon(ctx: Ctx, w: number, h: number, p: string[], r: () => number) {
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, p[0]);
  sky.addColorStop(0.65, p[3]);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = p[1];
  ctx.beginPath();
  ctx.arc(w * (0.3 + r() * 0.4), h * (0.35 + r() * 0.15), w * (0.1 + r() * 0.08), 0, Math.PI * 2);
  ctx.fill();
  for (let l = 0; l < 4; l++) {
    const base = h * (0.55 + l * 0.12), fr = 1 + r() * 3, ph = r() * 6;
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= w; x += 4) ctx.lineTo(x, base + Math.sin((x / w) * fr * Math.PI + ph) * h * 0.05);
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fillStyle = p[[2, 4, 1, 0][l]];
    ctx.globalAlpha = 0.65 + l * 0.1;
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function shards(ctx: Ctx, w: number, h: number, p: string[], r: () => number) {
  ctx.fillStyle = p[0];
  ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 26; i++) {
    ctx.beginPath();
    const x = r() * w, y = r() * h;
    ctx.moveTo(x, y);
    ctx.lineTo(x + (r() - 0.5) * w * 0.8, y + (r() - 0.5) * h * 0.8);
    ctx.lineTo(x + (r() - 0.5) * w * 0.8, y + (r() - 0.5) * h * 0.8);
    ctx.closePath();
    ctx.fillStyle = p[1 + (i % 4)];
    ctx.globalAlpha = 0.55 + r() * 0.4;
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

const KINDS = [flow, rings, blur, stripes, dots, horizon, shards];

/** Paint study `seed` onto a new canvas of the given size. */
export function paintStudy(seed: number, w = 512, h = w): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d", { willReadFrequently: true })!;
  const r = rng(seed * 7919 + 13);
  const pal = STUDY_PALETTES[seed % STUDY_PALETTES.length];
  KINDS[seed % KINDS.length](ctx, w, h, pal, r);
  grain(ctx, w, h, r);
  return c;
}

/** The same study as a data URL, for <img> tags. */
export const studyURL = (seed: number, w = 640, h = Math.round(w * 0.75), type = "image/jpeg") => paintStudy(seed, w, h).toDataURL(type, 0.86);
