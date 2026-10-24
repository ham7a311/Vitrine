import { bezier, box, centroid, circle, clamp, farthest, keep, mirror, poly, polygon, rect, seeded, voronoi, type Vec } from "./shapes";
import type { Shot } from "./snapshot";

export type Transition = "bloom" | "shatter" | "ink" | "peel" | "blinds" | "dissolve" | "melt";

/** One run of a transition: the capture, where the switch is (in the capture's own pixels) and the capture's size. */
export type Run = { shot: Shot; o: Vec; w: number; h: number };
/** A transition: how long it lasts, and a setup that returns the frame for progress 0–1. */
export type Effect = { duration: number; start: (run: Run) => (p: number) => void };

const inOut = bezier(0.65, 0, 0.35, 1);
const easeIn = bezier(0.55, 0, 0.8, 0.35);
const easeInOut = bezier(0.45, 0, 0.25, 1);
const NS = "http://www.w3.org/2000/svg";
const clipBox = (pts: Vec[], w: number, h: number) =>
  keep(keep(keep(keep(pts, { x: 0, y: 0 }, { x: 1, y: 0 }), { x: w, y: 0 }, { x: -1, y: 0 }), { x: 0, y: 0 }, { x: 0, y: 1 }), { x: 0, y: h }, { x: 0, y: -1 });

export const EFFECTS: Record<Transition, Effect> = {
  // The new theme grows as a circle out of the switch until it reaches the farthest corner.
  bloom: {
    duration: 820,
    start({ shot, o, w, h }) {
      const el = shot.layer(), R = farthest(o, w, h), whole = rect(0, 0, w, h);
      return (p) => { el.style.clipPath = `path(evenodd, "${whole}${circle(o.x, o.y, R * inOut(p))}")`; };
    },
  },

  // Cracks flash out from the switch, then the old theme breaks into shards that fall away, nearest first.
  shatter: {
    duration: 1400,
    start({ shot, o, w, h }) {
      const rand = seeded(97), count = shot.nodes > 1500 ? 7 : 14, D = farthest(o, w, h), seeds: Vec[] = [];
      for (let i = 0; i < count; i++) {
        if (i < Math.round(count * 0.4)) {
          const a = rand() * Math.PI * 2, d = D * 0.28 * Math.sqrt(rand());
          seeds.push({ x: clamp(o.x + Math.cos(a) * d, 1, w - 1), y: clamp(o.y + Math.sin(a) * d, 1, h - 1) });
        } else seeds.push({ x: rand() * w, y: rand() * h });
      }
      const cells = voronoi(seeds, w, h).filter((c) => c.length >= 3);
      const shards = cells.map((cell) => {
        const el = shot.layer(), c = centroid(cell), dx = c.x - o.x, dy = c.y - o.y, l = Math.hypot(dx, dy) || 1;
        el.style.clipPath = polygon(cell);
        el.style.transformOrigin = `${c.x}px ${c.y}px`;
        return { el, dir: { x: dx / l, y: dy / l }, delay: (l / D) * 0.22, speed: 160 + rand() * 300, lift: 40 + rand() * 140, spin: (rand() - 0.5) * 260, tilt: { x: (rand() - 0.5) * 50, y: (rand() - 0.5) * 50 } };
      });
      // The crack lines, over the shards, in the old page's text colour.
      const sheet = shot.sheet(), svg = document.createElementNS(NS, "svg");
      svg.setAttribute("width", String(w)); svg.setAttribute("height", String(h)); svg.classList.add("tsw-cracks");
      for (const cell of cells) {
        const line = document.createElementNS(NS, "polygon");
        line.setAttribute("points", cell.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" "));
        line.setAttribute("stroke", shot.colours.text);
        svg.appendChild(line);
      }
      sheet.appendChild(svg);
      const crack = 0.09, secs = 1.4;
      return (p) => {
        svg.style.opacity = String(p < crack ? p / crack : Math.max(0, 1 - (p - crack) / 0.22));
        for (const s of shards) {
          const t0 = crack + s.delay, t = Math.max(0, p - t0) * secs, jolt = Math.min(1, p / crack) * 2.5;
          const x = s.dir.x * (jolt + s.speed * t), y = s.dir.y * (jolt + s.speed * t) - s.lift * t + 1300 * t * t;
          const k = Math.min(1, t * 3);
          s.el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${(s.spin * t).toFixed(1)}deg) rotateX(${(s.tilt.x * k).toFixed(1)}deg) rotateY(${(s.tilt.y * k).toFixed(1)}deg)`;
          s.el.style.opacity = String(1 - clamp((clamp((p - t0) / (1 - t0)) - 0.55) / 0.45));
        }
      };
    },
  },

  // The new theme spreads from the switch like an ink blot: a wobbling edge, with droplets running ahead and merging in.
  ink: {
    duration: 1150,
    start({ shot, o, w, h }) {
      shot.layer("old");
      const fresh = shot.layer("new"), R = farthest(o, w, h) * 1.18, rand = seeded(31);
      // Small spatter just ahead of the edge, which the blot swallows as it spreads.
      const drops = Array.from({ length: 12 }, () => ({ a: rand() * Math.PI * 2, gap: 6 + rand() * 18, s: 2.5 + rand() * 4.5, lag: 0.05 + rand() * 0.35 }));
      const ease = bezier(0.55, 0, 0.3, 1);
      const edge = (a: number, e: number, t: number) =>
        R * e * (1 + 0.07 * Math.sin(3 * a + 4 * t + 0.3) + 0.045 * Math.sin(5 * a - 6 * t + 1.2) + 0.03 * Math.sin(11 * a + 9 * t + 2.1) + 0.014 * Math.sin(23 * a - 13 * t + 0.7));
      return (p) => {
        const e = ease(p), t = p * 1.3, pts: Vec[] = [];
        for (let i = 0; i < 180; i++) {
          const a = (i / 180) * Math.PI * 2, r = edge(a, e, t);
          pts.push({ x: o.x + Math.cos(a) * r, y: o.y + Math.sin(a) * r });
        }
        let d = poly(pts);
        for (const drop of drops) {
          const q = clamp((e - drop.lag) / (1 - drop.lag));
          if (q <= 0) continue;
          // Just ahead of the edge where it is at that angle, closing in as the drop swells, so the blot takes it.
          const dist = edge(drop.a, e, t) + drop.gap * (1 - q);
          d += circle(o.x + Math.cos(drop.a) * dist, o.y + Math.sin(drop.a) * dist, drop.s * (0.5 + Math.sin(Math.PI * Math.min(1, q * 1.4)) * 0.8));
        }
        fresh.style.clipPath = `path(nonzero, "${d}")`;
      };
    },
  },

  // The old theme peels off from the corner nearest the switch, its blank back folding over with a shadow under it.
  peel: {
    duration: 1150,
    start({ shot, o, w, h }) {
      const old = shot.layer(), corners = box(w, h);
      let ci = 0;
      corners.forEach((c, i) => { if (Math.hypot(c.x - o.x, c.y - o.y) < Math.hypot(corners[ci].x - o.x, corners[ci].y - o.y)) ci = i; });
      const C = corners[ci], far = corners[(ci + 2) % 4], L = Math.hypot(far.x - C.x, far.y - C.y), u = { x: (far.x - C.x) / L, y: (far.y - C.y) / L };
      const sheet = shot.sheet();
      sheet.classList.add("tsw-fold");
      const flap = document.createElement("div");
      flap.className = "tsw-flap";
      sheet.appendChild(flap);
      // The flap's shading runs along u, from the fold (shadowed) to the tip (lit); place it on the CSS gradient line.
      const angle = (Math.atan2(u.x, -u.y) * 180) / Math.PI, A = (angle * Math.PI) / 180;
      const G = Math.abs(w * Math.sin(A)) + Math.abs(h * Math.cos(A)), from = { x: w / 2 - u.x * (G / 2), y: h / 2 - u.y * (G / 2) };
      const bg = shot.colours.bg;
      return (p) => {
        const s = inOut(p) * L * 1.02, at = { x: C.x + u.x * s, y: C.y + u.y * s };
        old.style.clipPath = polygon(keep(box(w, h), at, u));
        const gone = keep(box(w, h), at, { x: -u.x, y: -u.y });
        flap.style.clipPath = polygon(clipBox(gone.map((q) => mirror(q, at, u)), w, h));
        const f = (at.x - from.x) * u.x + (at.y - from.y) * u.y;
        flap.style.background = `linear-gradient(${angle.toFixed(1)}deg, transparent ${(f - 1).toFixed(1)}px, color-mix(in srgb, ${bg} 72%, #000) ${f.toFixed(1)}px, color-mix(in srgb, ${bg} 90%, #fff) ${(f + s * 0.45).toFixed(1)}px, color-mix(in srgb, ${bg} 82%, #fff) ${(f + s).toFixed(1)}px)`;
      };
    },
  },

  // The old theme closes like blinds: slats shut to their centre lines in a wave away from the switch's row.
  blinds: {
    duration: 950,
    start({ shot, o, w, h }) {
      const el = shot.layer(), n = 14, hs = h / n, row = clamp(Math.floor(o.y / hs), 0, n - 1);
      const sheet = shot.sheet(), svg = document.createElementNS(NS, "svg");
      svg.setAttribute("width", String(w)); svg.setAttribute("height", String(h)); svg.classList.add("tsw-slats");
      const lines = Array.from({ length: n * 2 }, () => { const l = document.createElementNS(NS, "line"); l.setAttribute("x1", "0"); l.setAttribute("x2", String(w)); svg.appendChild(l); return l; });
      sheet.appendChild(svg);
      return (p) => {
        let d = "";
        for (let i = 0; i < n; i++) {
          const q = clamp((p - (Math.abs(i - row) / n) * 0.5) / 0.5), open = hs * (1 - easeInOut(q)), cy = i * hs + hs / 2;
          if (open > 0.2) d += rect(0, cy - open / 2, w, open);
          const glint = String(open > 0.2 ? 0.5 * Math.sin(Math.PI * q) : 0);
          for (const [j, y] of [[i * 2, cy - open / 2], [i * 2 + 1, cy + open / 2]] as const) {
            lines[j].setAttribute("y1", y.toFixed(1)); lines[j].setAttribute("y2", y.toFixed(1)); lines[j].setAttribute("opacity", glint);
          }
        }
        el.style.clipPath = d ? `path("${d}")` : "polygon(0 0, 0 0, 0 0)";
      };
    },
  },

  // The old theme breaks into pixels that shrink away in a ripple out from the switch, with a little noise.
  dissolve: {
    duration: 1050,
    start({ shot, o, w, h }) {
      const el = shot.layer(), size = 22, cols = Math.ceil(w / size), rows = Math.ceil(h / size), D = farthest(o, w, h), rand = seeded(53);
      const delay = new Float32Array(cols * rows);
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        const dist = Math.hypot((c + 0.5) * size - o.x, (r + 0.5) * size - o.y);
        delay[r * cols + c] = (dist / D) * 0.64 + rand() * 0.26;
      }
      const life = 0.14;
      return (p) => {
        let d = "";
        for (let r = 0; r < rows; r++) {
          let run = -1;
          for (let c = 0; c <= cols; c++) {
            const q = c < cols ? clamp((p - delay[r * cols + c]) / life) : 1;
            // Untouched cells in a row merge into one rectangle; shrinking ones are drawn inset.
            if (q === 0) { if (run < 0) run = c; continue; }
            if (run >= 0) { d += rect(run * size, r * size, (c - run) * size, size); run = -1; }
            if (c < cols && q < 1) { const k = (1 - q * q) * size, m = (size - k) / 2; d += rect(c * size + m, r * size + m, k, k); }
          }
        }
        el.style.clipPath = d ? `path("${d}")` : "polygon(0 0, 0 0, 0 0)";
      };
    },
  },

  // The old theme melts from the top: its edge sinks unevenly and runs down in rounded drips.
  melt: {
    duration: 1300,
    start({ shot, w, h }) {
      const el = shot.layer(), rand = seeded(71), travel = h * 1.45;
      const drips = Array.from({ length: Math.max(6, Math.round(w / 140)) }, () => ({ x: rand() * w, width: 16 + rand() * 24, reach: 0.1 + rand() * 0.28, lag: rand() * 0.2 }));
      const lagAt = (x: number) => 0.2 * (0.5 + 0.5 * (0.55 * Math.sin(x * 0.011 + 1.3) + 0.3 * Math.sin(x * 0.027 + 0.4) + 0.15 * Math.sin(x * 0.061 + 2.2)));
      return (p) => {
        const pts: Vec[] = [{ x: 0, y: h + 2 }];
        for (let x = 0; x <= w + 3; x += 3) {
          const q = clamp((p - lagAt(x)) / 0.8);
          let y = easeIn(q) * travel;
          // Each drip: steep sides and a rounded bulb at the end (a superellipse profile), not a pointed spike.
          for (const d of drips) {
            const u = Math.abs(x - d.x) / d.width;
            if (u < 1) y += d.reach * h * Math.pow(1 - Math.pow(u, 2.6), 1 / 2.6) * clamp((q - d.lag) * 2.2);
          }
          pts.push({ x: Math.min(x, w), y: Math.min(y, h + 2) });
        }
        pts.push({ x: w, y: h + 2 });
        el.style.clipPath = polygon(pts);
        el.style.transform = `translateY(${(easeIn(p) * 14).toFixed(1)}px)`;
      };
    },
  },
};

/** Run a transition frame by frame; finish() jumps to the end and removes its layers (safe to call twice). */
export function play(effect: Effect, run: Run, done: () => void) {
  const frame = effect.start(run);
  let raf = 0, t0 = 0, over = false;
  const finish = () => {
    if (over) return;
    over = true;
    cancelAnimationFrame(raf);
    run.shot.clear();
    done();
  };
  const tick = (now: number) => {
    if (!t0) t0 = now;
    const p = Math.min(1, (now - t0) / effect.duration);
    frame(p);
    if (p < 1) raf = requestAnimationFrame(tick);
    else finish();
  };
  frame(0);
  raf = requestAnimationFrame(tick);
  return { finish };
}
