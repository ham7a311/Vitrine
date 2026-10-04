"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Cyanotype
 * A sun print. Fern fronds, grasses and umbels lie on paper coated in iron
 * salts; on load the light develops the paper into Prussian blue around them,
 * leaving their shapes white. Your pointer holds a ginkgo leaf above the
 * paper: where it rests, its soft shadow develops too, and when it moves on
 * the paper slowly blues over again.
 */

type Props = {
  /** "sheet" fills the box; "print" shows brush-coated edges on cream paper. */
  edge?: "sheet" | "print";
  /** Seconds for the paper to fully develop. */
  develop?: number;
  motion?: "full" | "reduced";
  className?: string;
  children?: ReactNode;
};

const BLUE: [number, number, number] = [16, 52, 104];
const DEEP: [number, number, number] = [9, 33, 72];
const PAPER: [number, number, number] = [238, 241, 236];
const CREAM = "#f1ece0";
const CELL = 2;

export function Cyanotype({ edge = "sheet", develop = 5, motion = "full", className = "", children }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const box = wrap.current!, canvas = cv.current!, ctx = canvas.getContext("2d")!;
    const reduce = motion === "reduced" || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const grid = document.createElement("canvas"), gctx = grid.getContext("2d", { willReadFrequently: true })!;
    const hand = document.createElement("canvas"), hctx = hand.getContext("2d", { willReadFrequently: true })!;
    let gw = 0, gh = 0, raf = 0, visible = true, last = performance.now(), settled = false;
    let E = new Float32Array(0), occ = new Float32Array(0), grain = new Float32Array(0), coat = new Float32Array(0);
    let img: ImageData | null = null;
    let px = -999, py = -999, angle = -0.4, hold = 0;
    let seed = 3;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

    // ——— The specimens, drawn in grid units ———
    const frond = (c: CanvasRenderingContext2D, x: number, y: number, len: number, rot: number, bend: number) => {
      c.save(); c.translate(x, y); c.rotate(rot);
      const pt = (t: number) => [Math.sin(t * 1.4) * bend * len * 0.25, -t * len] as const;
      c.lineWidth = Math.max(1, len * 0.012); c.lineCap = "round";
      c.beginPath(); for (let t = 0; t <= 1; t += 0.02) { const [a, b] = pt(t); t ? c.lineTo(a, b) : c.moveTo(a, b); } c.stroke();
      for (let t = 0.08; t < 0.97; t += 0.045) {
        const [a, b] = pt(t);
        const size = len * 0.2 * Math.sin(Math.PI * Math.min(1, t * 1.15)) * (1 - t * 0.55);
        for (const side of [-1, 1]) {
          c.save(); c.translate(a, b); c.rotate(side * (1.05 - t * 0.35) + bend * 0.2);
          // A pinna: a row of rounded leaflets tapering to its tip.
          for (let s = 0.1; s < 1; s += 0.12) {
            const r = size * 0.14 * (1 - s * 0.65);
            c.beginPath(); c.ellipse(0, -s * size, r * 1.3, r * 0.95, 0, 0, Math.PI * 2); c.fill();
          }
          c.lineWidth = Math.max(0.6, size * 0.03); c.beginPath(); c.moveTo(0, 0); c.lineTo(0, -size); c.stroke();
          c.restore();
        }
      }
      c.restore();
    };
    const grass = (c: CanvasRenderingContext2D, x: number, y: number, len: number, rot: number) => {
      c.save(); c.translate(x, y); c.rotate(rot);
      c.lineWidth = Math.max(0.8, len * 0.008);
      c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(len * 0.12, -len * 0.5, len * 0.05, -len); c.stroke();
      for (let t = 0.62; t < 1; t += 0.035) {
        const xx = len * 0.12 * 2 * t * (1 - t) + len * 0.05 * t * t, yy = -len * t;
        for (const side of [-1, 1]) { c.beginPath(); c.ellipse(xx + side * len * 0.018, yy, len * 0.014, len * 0.03, side * 0.5, 0, Math.PI * 2); c.fill(); }
      }
      c.restore();
    };
    const umbel = (c: CanvasRenderingContext2D, x: number, y: number, len: number, rot: number) => {
      c.save(); c.translate(x, y); c.rotate(rot);
      c.lineWidth = Math.max(0.8, len * 0.009);
      c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(-len * 0.06, -len * 0.5, 0, -len * 0.8); c.stroke();
      c.translate(0, -len * 0.8);
      for (let i = 0; i < 13; i++) {
        const a = -Math.PI / 2 + (i / 12 - 0.5) * 2.2, r = len * (0.16 + rnd() * 0.05);
        const ex = Math.cos(a) * r, ey = Math.sin(a) * r;
        c.lineWidth = Math.max(0.5, len * 0.004); c.beginPath(); c.moveTo(0, 0); c.lineTo(ex, ey); c.stroke();
        for (let j = 0; j < 7; j++) { const b = a + (j / 6 - 0.5) * 1.6, q = len * 0.05; c.beginPath(); c.arc(ex + Math.cos(b) * q, ey + Math.sin(b) * q, Math.max(0.8, len * 0.008), 0, Math.PI * 2); c.fill(); }
      }
      c.restore();
    };
    const ginkgo = (c: CanvasRenderingContext2D, x: number, y: number, s: number, rot: number) => {
      c.save(); c.translate(x, y); c.rotate(rot);
      c.beginPath();
      c.moveTo(0, s * 0.55);
      c.lineTo(0, s * 0.05);
      c.bezierCurveTo(-s * 0.15, -s * 0.05, -s * 0.62, -s * 0.2, -s * 0.6, -s * 0.55);
      c.quadraticCurveTo(-s * 0.3, -s * 0.78, -s * 0.04, -s * 0.66);
      c.lineTo(0, -s * 0.5);
      c.lineTo(s * 0.04, -s * 0.66);
      c.quadraticCurveTo(s * 0.3, -s * 0.78, s * 0.6, -s * 0.55);
      c.bezierCurveTo(s * 0.62, -s * 0.2, s * 0.15, -s * 0.05, 0, s * 0.05);
      c.fill();
      c.lineWidth = s * 0.04; c.beginPath(); c.moveTo(0, s * 0.05); c.lineTo(0, s * 0.6); c.stroke();
      c.restore();
    };

    const build = () => {
      const w = box.clientWidth, h = box.clientHeight;
      gw = Math.max(2, Math.ceil(w / CELL)); gh = Math.max(2, Math.ceil(h / CELL));
      grid.width = gw; grid.height = gh;
      canvas.width = gw; canvas.height = gh;
      img = ctx.createImageData(gw, gh);
      // Specimens, composed from the lower corners so the middle stays open for words.
      gctx.clearRect(0, 0, gw, gh);
      gctx.fillStyle = gctx.strokeStyle = "#000";
      seed = 3;
      const m = Math.min(gw, gh);
      // On wide sheets the specimens keep to the outer thirds; on tall ones, to the top and bottom.
      const wide = gw > gh * 1.2;
      const L = wide ? Math.min(gh * 0.78, gw * 0.42) : Math.min(gh * 0.42, gw * 0.95);
      frond(gctx, gw * 0.04, gh * 1.03, L, wide ? 0.42 : 0.55, 0.5);
      frond(gctx, gw * 0.96, gh * 1.05, L * 0.9, wide ? -0.38 : -0.5, -0.45);
      frond(gctx, gw * 1.02, gh * (wide ? 0.12 : 0.2), L * 0.6, -1.95, 0.4);
      for (let i = 0; i < 4; i++) {
        const x = wide ? (i < 2 ? 0.14 + i * 0.09 : 0.7 + (i - 2) * 0.09) : 0.22 + i * 0.16;
        grass(gctx, gw * (x + rnd() * 0.03), gh * 1.02, L * (0.55 + rnd() * 0.25) * (wide ? 1 : 0.55), (rnd() - 0.5) * 0.45);
      }
      umbel(gctx, gw * (wide ? 0.84 : 0.74), gh * 1.02, L * (wide ? 0.62 : 0.5), 0.14);
      umbel(gctx, gw * (wide ? 0.1 : 0.2), gh * -0.02, L * 0.52, Math.PI - 0.32);
      const a = gctx.getImageData(0, 0, gw, gh).data;
      occ = new Float32Array(gw * gh);
      grain = new Float32Array(gw * gh);
      coat = new Float32Array(gw * gh);
      for (let i = 0; i < gw * gh; i++) {
        occ[i] = a[i * 4 + 3] / 255;
        grain[i] = 0.82 + Math.random() * 0.3;
        coat[i] = 1;
      }
      // Brush-coated edges: the emulsion stops short of the sheet in a ragged line.
      if (edge === "print") {
        const inset = Math.round(m * 0.07);
        let wob = 0;
        for (let y = 0; y < gh; y++) {
          wob += (Math.random() - 0.5) * 0.9; wob *= 0.96;
          for (let x = 0; x < gw; x++) {
            const dx = Math.min(x, gw - 1 - x) - inset - wob * 1.4, dy = Math.min(y, gh - 1 - y) - inset - Math.sin(x * 0.21) * 1.5 - Math.random() * 2;
            coat[y * gw + x] = Math.max(0, Math.min(1, Math.min(dx, dy) / 3 + (Math.random() < 0.04 ? -0.6 : 0)));
          }
        }
      }
      E = new Float32Array(gw * gh);
      if (reduce) for (let i = 0; i < E.length; i++) E[i] = 1 - occ[i];
      settled = false;
      paint();
    };

    const paint = () => {
      if (!img) return;
      const d = img.data;
      const cream = [241, 236, 224];
      for (let i = 0; i < E.length; i++) {
        const k = 1 - Math.exp(-2.4 * E[i] * grain[i]);
        const deep = Math.max(0, k - 0.75) * 2.2;
        let r = PAPER[0] + (BLUE[0] - PAPER[0]) * k + (DEEP[0] - BLUE[0]) * deep;
        let g = PAPER[1] + (BLUE[1] - PAPER[1]) * k + (DEEP[1] - BLUE[1]) * deep;
        let b = PAPER[2] + (BLUE[2] - PAPER[2]) * k + (DEEP[2] - BLUE[2]) * deep;
        const c = coat[i];
        if (c < 1) { r = cream[0] + (r - cream[0]) * c; g = cream[1] + (g - cream[1]) * c; b = cream[2] + (b - cream[2]) * c; }
        d[i * 4] = r; d[i * 4 + 1] = g; d[i * 4 + 2] = b; d[i * 4 + 3] = 255;
      }
      ctx.putImageData(img, 0, 0);
    };

    const step = (dt: number) => {
      // The held leaf's shadow, soft because it's above the paper.
      const s = Math.min(gw, gh) * 0.22;
      const bx = Math.max(0, Math.floor(px / CELL - s)), by = Math.max(0, Math.floor(py / CELL - s));
      const bw = Math.min(gw - bx, Math.ceil(s * 2)), bh = Math.min(gh - by, Math.ceil(s * 2));
      let leaf: Uint8ClampedArray | null = null;
      if (hold > 0.01 && bw > 0 && bh > 0) {
        hand.width = bw; hand.height = bh;
        hctx.filter = `blur(${Math.max(1, s * 0.06)}px)`;
        hctx.fillStyle = hctx.strokeStyle = `rgba(0,0,0,${0.85 * hold})`;
        ginkgo(hctx, px / CELL - bx, py / CELL - by, s * 0.8, angle);
        leaf = hctx.getImageData(0, 0, bw, bh).data;
      }
      const expose = dt * (3 / develop), recover = dt * 0.55;
      let moving = false;
      for (let y = 0; y < gh; y++) {
        for (let x = 0; x < gw; x++) {
          const i = y * gw + x;
          let o = occ[i];
          if (leaf && x >= bx && x < bx + bw && y >= by && y < by + bh) o = Math.max(o, leaf[((y - by) * bw + (x - bx)) * 4 + 3] / 255);
          const target = 1 - o, e = E[i];
          if (Math.abs(target - e) < 0.002) continue;
          moving = true;
          E[i] = target > e ? Math.min(target, e + expose * (0.6 + grain[i] * 0.4)) : Math.max(target, e - recover);
        }
      }
      settled = !moving && hold <= 0.01;
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!visible) return;
      hold = Math.max(0, Math.min(1, hold + (px > -900 ? dt * 3 : -dt * 3)));
      if (settled && hold <= 0.01) return;
      step(dt);
      paint();
    };

    const move = (e: PointerEvent) => {
      const r = box.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      if (px > -900) angle += (Math.atan2(y - py, x - px) * 0.08 - angle * 0.08) * Math.min(1, Math.hypot(x - px, y - py) / 20);
      px = x; py = y; settled = false;
    };
    const leave = () => { px = -999; py = -999; };

    build();
    const ro = new ResizeObserver(build); ro.observe(box);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting)); io.observe(box);
    if (!reduce) {
      box.addEventListener("pointermove", move);
      box.addEventListener("pointerleave", leave);
      raf = requestAnimationFrame(loop);
    }
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); box.removeEventListener("pointermove", move); box.removeEventListener("pointerleave", leave); };
  }, [edge, develop, motion]);

  return (
    <div ref={wrap} className={className} style={{ position: "relative", width: "100%", height: "100%", minHeight: 240, overflow: "hidden", background: edge === "print" ? CREAM : `rgb()` }}>
      <canvas ref={cv} aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
      {children && <div style={{ position: "relative", height: "100%" }}>{children}</div>}
    </div>
  );
}
