import { length, pointAt } from "./perimeter";

export type Pond = "koi" | "goldfish" | "night";
export type Vec = { x: number; y: number };
export type Fish = { x: number; y: number; a: number; s: number; spine: Vec[]; coat: string[]; size: number; phase: number };

/** Water colours (deep, mid, surface glint) and each fish's coat, head to tail. */
export const PONDS: Record<Pond, { deep: string; mid: string; glint: string; label: string; coats: string[][]; glow: boolean }> = {
  koi: {
    deep: "#06313a", mid: "#0f5b5f", glint: "#9fe0d0", label: "#f2fbf7", glow: false,
    coats: [
      ["#f6f1e7", "#e4521e", "#e4521e", "#f6f1e7", "#f6f1e7", "#e4521e", "#f6f1e7", "#f6f1e7"],
      ["#1d1b1a", "#f6f1e7", "#df4a1c", "#df4a1c", "#1d1b1a", "#f6f1e7", "#df4a1c", "#f6f1e7"],
      ["#f2c862", "#f0bd4a", "#eab03a", "#e7a632", "#e7a632", "#eab03a", "#f0bd4a", "#f2c862"],
    ],
  },
  goldfish: {
    deep: "#0b2f55", mid: "#1d5f8f", glint: "#bfe6ff", label: "#f3f9ff", glow: false,
    coats: [
      ["#ffb23a", "#ff9a1f", "#ff8a12", "#ff8a12", "#ff9a1f", "#ffae3a", "#ffc46a", "#ffd890"],
      ["#ff7a2a", "#ff6a1a", "#ff6a1a", "#fff1e0", "#ff6a1a", "#ff7a2a", "#ff9a52", "#ffc08a"],
      ["#ffd27a", "#ffc455", "#ffb83a", "#ffb83a", "#ffc455", "#ffd27a", "#ffe2a8", "#fff0d0"],
    ],
  },
  night: {
    deep: "#050b1f", mid: "#11204a", glint: "#a8c4ff", label: "#f1f4ff", glow: true,
    coats: [
      ["#eaf6ff", "#bfe4ff", "#9fd6ff", "#bfe4ff", "#eaf6ff", "#bfe4ff", "#9fd6ff", "#d8eeff"],
      ["#fff2c8", "#ffe39a", "#ffd56e", "#ffe39a", "#fff2c8", "#ffe39a", "#ffd56e", "#fff2c8"],
      ["#e6dcff", "#c9b6ff", "#b39cff", "#c9b6ff", "#e6dcff", "#c9b6ff", "#b39cff", "#e6dcff"],
    ],
  },
};

/** Body half-width along the spine, as a share of the fish's size. */
export const PROFILE = [0.42, 0.56, 0.6, 0.55, 0.46, 0.34, 0.24, 0.15];
export const SEG = 3.6;

/** The swimming lane: the button's outline pulled in by `m`. */
export function lane(w: number, h: number, r: number, m: number) {
  const lw = Math.max(1, w - 2 * m), lh = Math.max(1, h - 2 * m), lr = Math.max(0, r - m);
  return { L: length(lw, lh, lr), at: (s: number) => { const p = pointAt(lw, lh, lr, s); return { x: p.x + m, y: p.y + m, tx: p.tx, ty: p.ty }; } };
}

/** Lay `n` fish evenly round the lane, bodies trailing behind them. */
export function school(n: number, w: number, h: number, r: number, m: number, coats: string[][], dir: 1 | -1 = 1): Fish[] {
  const { L, at } = lane(w, h, r, m);
  return Array.from({ length: n }, (_, i) => {
    const s = (i / n) * L + 7;
    const p = at(s);
    const spine = PROFILE.map((_, k) => { const q = at(s - dir * k * SEG); return { x: q.x, y: q.y }; });
    return { x: p.x, y: p.y, a: Math.atan2(p.ty * dir, p.tx * dir), s, spine, coat: coats[i % coats.length], size: 9 + (i % 2) * 1.5, phase: i * 2.1 };
  });
}

const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));

/** Turn towards `goal` by at most `turn` radians per second, swim `speed` px/s, and pull the body along behind the head. */
export function swim(f: Fish, goal: Vec, speed: number, turn: number, dt: number) {
  const want = Math.atan2(goal.y - f.y, goal.x - f.x);
  const d = wrap(want - f.a), lim = turn * dt;
  f.a = wrap(f.a + Math.max(-lim, Math.min(lim, d)));
  f.phase += dt * (4 + speed * 0.12);
  // a little side-to-side as the tail drives it
  const sway = Math.sin(f.phase) * 0.12;
  f.x += Math.cos(f.a + sway) * speed * dt;
  f.y += Math.sin(f.a + sway) * speed * dt;
  f.spine[0] = { x: f.x, y: f.y };
  for (let k = 1; k < f.spine.length; k++) {
    const p = f.spine[k - 1], q = f.spine[k];
    const dx = q.x - p.x, dy = q.y - p.y, len = Math.hypot(dx, dy) || 1;
    f.spine[k] = { x: p.x + (dx / len) * SEG, y: p.y + (dy / len) * SEG };
  }
}
