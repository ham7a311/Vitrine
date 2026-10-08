/* Lumen — the drop's shape, its palette, and the small maths behind gaze. Pure; no React. */

export type Hue = "rose" | "blue" | "amber" | "white" | "umber" | "red" | "green";

/**
 * Each hue: light, body and deep tones for the shading; the eye colour that reads on it; `on`, the
 * colour of anything drawn on the body colour (a send arrow); and `ring`, the state-dot colour, tuned
 * to read on both dark and light pages.
 */
export const HUES: Record<Hue, { light: string; body: string; deep: string; eye: string; on: string; ring: string }> = {
  rose: { light: "#ff97bd", body: "#e2457f", deep: "#9b2052", eye: "#1c0a12", on: "#ffffff", ring: "#f0679a" },
  blue: { light: "#9ab8ff", body: "#3d6cf0", deep: "#1f3ca8", eye: "#081430", on: "#ffffff", ring: "#5f87f7" },
  amber: { light: "#ffcf92", body: "#f59a3f", deep: "#b2581a", eye: "#2b1506", on: "#2b1506", ring: "#f5a052" },
  white: { light: "#ffffff", body: "#efebe4", deep: "#bab1a4", eye: "#16130f", on: "#16130f", ring: "#a39a8d" },
  umber: { light: "#c6906a", body: "#8c5a3a", deep: "#56331d", eye: "#1a0e06", on: "#ffffff", ring: "#b07a55" },
  red: { light: "#ff9a84", body: "#ec4a36", deep: "#a3231a", eye: "#200706", on: "#ffffff", ring: "#f2644f" },
  green: { light: "#8ee6be", body: "#27b07a", deep: "#12724d", eye: "#05190f", on: "#ffffff", ring: "#3cc28c" },
};

type P = [number, number];

/*
 * The silhouette: a soft bean on a 100×100 board, a little wider than tall and tipped so its crown
 * sits right of centre and its heel settles to the lower left. Eleven points, closed with a
 * Catmull–Rom spline, so every hue and size shares one shape.
 */
export const OUTLINE: P[] = [
  [50, 11],
  [73, 11],
  [89, 25],
  [94, 48],
  [87, 71],
  [66, 86],
  [40, 89],
  [18, 80],
  [7, 60],
  [12, 36],
  [28, 18],
];

export function splinePath(pts: P[], tension = 1): string {
  const n = pts.length;
  const at = (i: number) => pts[(i + n) % n];
  let d = `M${at(0)[0]},${at(0)[1]}`;
  for (let i = 0; i < n; i++) {
    const [p0, p1, p2, p3] = [at(i - 1), at(i), at(i + 1), at(i + 2)];
    const c1: P = [p1[0] + ((p2[0] - p0[0]) / 6) * tension, p1[1] + ((p2[1] - p0[1]) / 6) * tension];
    const c2: P = [p2[0] - ((p3[0] - p1[0]) / 6) * tension, p2[1] - ((p3[1] - p1[1]) / 6) * tension];
    d += ` C${r(c1[0])},${r(c1[1])} ${r(c2[0])},${r(c2[1])} ${r(p2[0])},${r(p2[1])}`;
  }
  return d + "Z";
}
const r = (n: number) => Math.round(n * 100) / 100;

export const BODY_PATH = splinePath(OUTLINE);

/** How far the eyes may travel from rest, in board units. */
export const REACH = { x: 9, y: 7 };

/*
 * Six forms, so each agent is recognisable by silhouette as well as colour. They share the same
 * board, shading and eyes; only the outline and where the eyes rest change.
 */
export type Form = "bean" | "drop" | "pebble" | "egg" | "lump" | "tilt" | "pear";
const FORM_OUTLINES: Record<Form, { pts: P[]; eyes: { cx: number; cy: number; gap: number } }> = {
  // a soft bean, crown right of centre
  bean: { pts: OUTLINE, eyes: { cx: 63, cy: 39, gap: 13.5 } },
  // a drop whose crown draws up to a soft point
  drop: {
    pts: [[62, 5], [73, 15], [87, 33], [93, 56], [85, 77], [63, 90], [37, 91], [16, 80], [8, 58], [16, 37], [40, 20]],
    eyes: { cx: 61, cy: 46, gap: 13.5 },
  },
  // a wide, low pebble
  pebble: {
    pts: [[30, 22], [55, 17], [79, 22], [94, 40], [95, 61], [82, 79], [56, 86], [28, 83], [9, 67], [7, 45], [15, 30]],
    eyes: { cx: 64, cy: 40, gap: 14 },
  },
  // a tall egg
  egg: {
    pts: [[49, 6], [67, 10], [81, 26], [87, 50], [82, 75], [65, 91], [43, 93], [23, 84], [13, 62], [15, 36], [28, 15]],
    eyes: { cx: 59, cy: 33, gap: 12.5 },
  },
  // a lump with a small nub on its left shoulder
  lump: {
    pts: [[19, 25], [24, 12], [36, 13], [44, 18], [62, 12], [83, 20], [94, 42], [91, 68], [72, 87], [44, 91], [18, 81], [6, 57], [10, 36]],
    eyes: { cx: 64, cy: 40, gap: 13.5 },
  },
  // the bean mirrored: it leans the other way and looks out from the left
  tilt: { pts: OUTLINE.map(([x, y]) => [100 - x, y] as P).reverse(), eyes: { cx: 37, cy: 39, gap: 13.5 } },
  // a pear: narrow shoulders, a wide settled base
  pear: {
    pts: [[48, 9], [63, 11], [72, 25], [75, 41], [87, 58], [89, 77], [73, 91], [50, 94], [27, 91], [11, 77], [13, 58], [25, 41], [29, 24], [35, 13]],
    eyes: { cx: 56, cy: 39, gap: 12 },
  },
};
const pathCache = new Map<Form, string>();
export function form(f: Form) {
  if (!pathCache.has(f)) pathCache.set(f, splinePath(FORM_OUTLINES[f].pts));
  return { path: pathCache.get(f)!, eyes: FORM_OUTLINES[f].eyes };
}

/** What the agent is doing. Each state has its own gaze and body, and is always also given as text. */
export type LumenState = "idle" | "thinking" | "searching" | "working" | "done" | "error";
export const STATE_TEXT: Record<LumenState, string> = {
  idle: "",
  thinking: "thinking",
  searching: "searching",
  working: "working",
  done: "done",
  error: "something went wrong",
};

/** Where each busy state looks, overriding focus, pointer and idle glances. */
export function stateGaze(s: LumenState, t: number): { x: number; y: number } | null {
  if (s === "thinking") return { x: 0.45 + Math.sin(t / 1400) * 0.15, y: -0.85 }; // up and away, drifting
  if (s === "searching") return { x: Math.sin(t / 380) > 0 ? 0.9 : -0.9, y: 0.15 }; // scanning side to side
  if (s === "working") return { x: -0.15, y: 0.9 }; // down at the work
  if (s === "error") return { x: 0, y: 0.35 };
  return null;
}

/** Eye geometry by rendered size: small avatars get bigger, simpler eyes so they still read. */
export function eyeShape(size: number) {
  if (size < 32) return { rx: 4.8, ry: 8.6 };
  if (size < 64) return { rx: 4.2, ry: 8.2 };
  return { rx: 3.8, ry: 8 };
}

/**
 * Where to look: the unit offset (−1…1 on each axis) from the avatar's centre towards a point,
 * eased so near things get a small glance and far things a full one.
 */
export function lookAt(from: { x: number; y: number; size: number }, to: { x: number; y: number }) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const dist = Math.hypot(dx, dy);
  if (dist < 1) return { x: 0, y: 0 };
  const reach = Math.min(1, dist / (from.size * 1.6));
  return { x: (dx / dist) * reach, y: (dy / dist) * reach };
}

/** A critically damped spring step: settles without overshoot, framerate-independent. */
export function spring(x: number, v: number, target: number, dt: number, stiffness = 140) {
  const damping = 2 * Math.sqrt(stiffness);
  const a = stiffness * (target - x) - damping * v;
  const nv = v + a * dt;
  return [x + nv * dt, nv] as const;
}

/** Deterministic per-instance randomness, so a list of avatars never moves in step. */
export function seeded(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  let a = h >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Idle glances: mostly near the centre, now and then a look to one side. */
export function idleGlance(rand: () => number) {
  if (rand() < 0.35) return { x: 0, y: 0 };
  const a = rand() * Math.PI * 2;
  const m = 0.35 + rand() * 0.5;
  return { x: Math.cos(a) * m, y: Math.sin(a) * m * 0.7 };
}

/* ---------- state dots ---------- */

export type DotKind = "thinking" | "searching" | "working";
type Orbit = { cx: number; cy: number; rx: number; ry: number; period: number; n: number; shape: "dot" | "square" };

/*
 * Each busy state circles the drop its own way, on an ellipse seen in perspective: dots on the far side
 * pass behind the body and come back in front.
 *   thinking  — three dots of falling size circling the crown, like thoughts about the head
 *   searching — a ring of nine around the waist; a bright head and a fading tail sweep like radar
 *   working   — four small squares orbiting the base, like parts being assembled
 */
export const ORBITS: Record<DotKind, Orbit> = {
  thinking: { cx: 50, cy: 2, rx: 36, ry: 10, period: 2600, n: 3, shape: "dot" },
  searching: { cx: 50, cy: 58, rx: 64, ry: 19, period: 1300, n: 9, shape: "dot" },
  working: { cx: 50, cy: 93, rx: 48, ry: 9, period: 1900, n: 4, shape: "square" },
};

export type Dot = { x: number; y: number; r: number; alpha: number; front: boolean; rot: number };

/** Where every dot of a state sits at time `t` (ms). Small avatars keep three dots for every state. */
export function orbitDots(kind: DotKind, t: number, small = false): Dot[] {
  const o = ORBITS[kind];
  const n = small ? 3 : o.n;
  const turn = (t / o.period) * Math.PI * 2;
  // thinking eases round (quicker at the front, slower behind); the others turn evenly
  const base = kind === "thinking" ? turn + 0.35 * Math.sin(turn) : turn;
  return Array.from({ length: n }, (_, i) => {
    const phase = kind === "thinking" ? -i * 0.62 : kind === "searching" ? -i * (small ? 0.5 : 0.36) : (i * Math.PI * 2) / n;
    const a = base + phase;
    const depth = Math.sin(a); // +1 nearest the viewer, −1 furthest away
    const near = 0.78 + 0.22 * ((depth + 1) / 2);
    const size =
      kind === "thinking" ? [6.4, 4.8, 3.5][i] ?? 3 : kind === "searching" ? (i === 0 ? 4.4 : 3.3 - i * 0.12) : 4.4;
    const alpha =
      kind === "thinking" ? [1, 0.8, 0.6][i] ?? 0.5 : kind === "searching" ? Math.max(0.14, 1 - i * (small ? 0.35 : 0.11)) : 0.95;
    return {
      x: o.cx + Math.cos(a) * o.rx,
      y: o.cy + depth * o.ry,
      r: size * near,
      alpha: alpha * (0.55 + 0.45 * ((depth + 1) / 2)),
      front: depth > 0,
      rot: (a * 180) / Math.PI,
    };
  });
}
