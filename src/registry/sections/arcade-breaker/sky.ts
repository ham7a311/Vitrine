/** The sky through the arches over a day, and the arches themselves. */

type Stop = { t: number; top: string; bottom: string; sun: string };

/** Dawn → morning → noon → afternoon → dusk, keyed 0–1. */
export const DAY: Stop[] = [
  { t: 0, top: "#3b3f7a", bottom: "#f4a77f", sun: "#ffb47a" },
  { t: 0.22, top: "#8fb8e8", bottom: "#fde3c4", sun: "#ffd89a" },
  { t: 0.5, top: "#3d8fe0", bottom: "#cfe8fb", sun: "#fff4d6" },
  { t: 0.78, top: "#6c7fc9", bottom: "#ffc58f", sun: "#ffc06b" },
  { t: 1, top: "#24245c", bottom: "#ee7a52", sun: "#ff8a4c" },
];

const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const lerp = (a: string, b: string, k: number) => `#${hex(a).map((v, i) => Math.round(v + (hex(b)[i] - v) * k).toString(16).padStart(2, "0")).join("")}`;

/** The sky colours at t (0–1), blended between the nearest stops. */
export function skyAt(t: number) {
  const k = Math.max(0, Math.min(1, t));
  const i = Math.max(0, DAY.findIndex((s) => s.t >= k) - 1);
  const a = DAY[i], b = DAY[Math.min(DAY.length - 1, i + 1)];
  const f = b.t === a.t ? 0 : (k - a.t) / (b.t - a.t);
  return { top: lerp(a.top, b.top, f), bottom: lerp(a.bottom, b.bottom, f), sun: lerp(a.sun, b.sun, f) };
}

/** Where the sun sits across the arcade (0–1 across, 0–1 down from its noon height). */
export const sunAt = (t: number) => ({ x: 0.08 + t * 0.84, y: 1 - Math.sin(Math.PI * Math.max(0, Math.min(1, t))) });

/** How far something has travelled up the viewport: 0 as its top enters at the bottom, 1 once its top is `height` above the top edge. */
export const travel = (top: number, height: number, viewport: number) => Math.max(0, Math.min(1, (viewport - top) / (viewport + height)));

/** The arches across a width: an odd number, the middle one wider and taller. */
export function arches(width: number, height: number) {
  const n = width < 560 ? 3 : width < 960 ? 5 : 7;
  const gap = Math.max(14, width * 0.018), big = 1.5;
  const unit = (width - gap * (n + 1)) / (n - 1 + big);
  let x = gap;
  return Array.from({ length: n }, (_, i) => {
    const mid = i === (n - 1) / 2, w = unit * (mid ? big : 1);
    const top = mid ? height * 0.12 : height * 0.26;
    const a = { x, w, top, mid };
    x += w + gap;
    return a;
  });
}

/** An arch's outline: straight jambs up to a semicircular head. */
export function archPath(a: { x: number; w: number; top: number }, base: number) {
  const r = a.w / 2;
  return `M${a.x} ${base}V${a.top + r}A${r} ${r} 0 0 1 ${a.x + a.w} ${a.top + r}V${base}Z`;
}
