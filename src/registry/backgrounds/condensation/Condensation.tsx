"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Condensation
 * A misted window over blurred lights. Drops gather, grow heavy and run down
 * the glass, clearing a trail that slowly fogs over again; each drop is a
 * small lens showing the scene behind it upside down. Your pointer wipes a
 * clear streak. Canvas 2D, no filters, so it works in every browser.
 */

type Light = { x: number; y: number; r: number; c: string; a: number };
type Drop = { x: number; y: number; r: number; vy: number; wob: number; still: number };

const SCENES = {
  night: {
    sky: ["#0a0e1d", "#1a1530", "#2a1a2a"],
    lights: ["#ffb45c", "#ff6a4d", "#fff0d2", "#5fc8d6", "#ffd27a", "#ff8f6b"],
    haze: "rgba(190, 200, 222, 0.16)",
    bead: "rgba(255, 255, 255, 0.22)",
    city: true,
  },
  morning: {
    sky: ["#c9d6df", "#dfe4dc", "#b9c7b1"],
    lights: ["#ffffff", "#e8f0d8", "#9fb88f", "#6f8f72", "#f6e7c8", "#c4d7e6"],
    haze: "rgba(240, 244, 246, 0.3)",
    bead: "rgba(255, 255, 255, 0.5)",
    city: false,
  },
};

type Props = {
  scene?: keyof typeof SCENES;
  /** New drops per second across the pane. */
  rain?: number;
  /** Seconds for a cleared streak to mist over again. */
  remist?: number;
  motion?: "full" | "reduced";
  className?: string;
  children?: ReactNode;
};

export function Condensation({ scene = "night", rain = 2.2, remist = 9, motion = "full", className = "", children }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const box = wrap.current!, canvas = cv.current!, ctx = canvas.getContext("2d")!;
    const S = SCENES[scene];
    const reduce = motion === "reduced" || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mk = () => document.createElement("canvas");
    const sharp = mk(), fog = mk(), mask = mk(), layer = mk(), small = mk();
    const sctx = sharp.getContext("2d")!, fctx = fog.getContext("2d")!, mctx = mask.getContext("2d")!, lctx = layer.getContext("2d")!, smctx = small.getContext("2d")!;
    let w = 0, h = 0, dpr = 1, raf = 0, visible = true, last = performance.now(), spawn = 0;
    let drops: Drop[] = [];
    let beads: { x: number; y: number; r: number }[] = [];
    let lights: Light[] = [];
    let seed = 11;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

    // A cheap blur that works everywhere: draw small, then scale back up with smoothing.
    const blurInto = (target: CanvasRenderingContext2D, src: HTMLCanvasElement, factor: number) => {
      small.width = Math.max(1, Math.round(src.width / factor));
      small.height = Math.max(1, Math.round(src.height / factor));
      smctx.imageSmoothingQuality = "high";
      smctx.drawImage(src, 0, 0, small.width, small.height);
      target.imageSmoothingQuality = "high";
      target.drawImage(small, 0, 0, target.canvas.width, target.canvas.height);
    };

    const paintScene = () => {
      const base = mk();
      base.width = sharp.width; base.height = sharp.height;
      const b = base.getContext("2d")!;
      b.scale(dpr, dpr);
      const g = b.createLinearGradient(0, 0, 0, h);
      S.sky.forEach((c, i) => g.addColorStop(i / (S.sky.length - 1), c));
      b.fillStyle = g; b.fillRect(0, 0, w, h);
      // Buildings with lit windows: a blur of glow through the fog, detail once wiped.
      if (S.city) {
        let bx = -20;
        seed = 29;
        while (bx < w) {
          const bw = 50 + rnd() * 110, top = h * (0.18 + rnd() * 0.45);
          b.fillStyle = `rgba(8, 9, 20, ${0.75 + rnd() * 0.2})`;
          b.fillRect(bx, top, bw, h - top);
          for (let wy = top + 10; wy < h - 6; wy += 13) {
            for (let wx = bx + 7; wx < bx + bw - 8; wx += 11) {
              if (rnd() < 0.3) { b.fillStyle = rnd() < 0.75 ? "rgba(255, 196, 120, 0.85)" : "rgba(220, 235, 255, 0.8)"; b.fillRect(wx, wy, 5, 7); }
            }
          }
          bx += bw + 4 + rnd() * 20;
        }
      }
      // A garden: layered leaves in greens, a path of light between them.
      if (!S.city) {
        seed = 41;
        const greens = ["#5f7d55", "#7d9a66", "#3f5a3c", "#9cb67f", "#2f4630", "#b7c99a"];
        for (let i = 0; i < (w * h) / 1400; i++) {
          const x = rnd() * w, y = h * (0.15 + rnd() * 0.9), r = 6 + rnd() * 26;
          b.globalAlpha = 0.45 + rnd() * 0.45;
          b.fillStyle = greens[Math.floor(rnd() * greens.length)];
          b.beginPath(); b.ellipse(x, y, r, r * (0.5 + rnd() * 0.5), rnd() * Math.PI, 0, Math.PI * 2); b.fill();
        }
        b.globalAlpha = 1;
      }
      for (const l of lights) {
        const rg = b.createRadialGradient(l.x, l.y, 0, l.x, l.y, l.r);
        rg.addColorStop(0, l.c); rg.addColorStop(0.55, l.c); rg.addColorStop(1, "transparent");
        b.globalAlpha = l.a; b.fillStyle = rg; b.beginPath(); b.arc(l.x, l.y, l.r, 0, Math.PI * 2); b.fill();
      }
      b.globalAlpha = 1;
      sctx.clearRect(0, 0, sharp.width, sharp.height);
      blurInto(sctx, base, 2);
      // Clear glass still carries a trace of the haze, so a wipe reads as glass, not a hole.
      sctx.save(); sctx.scale(dpr, dpr); sctx.globalAlpha = 0.45; sctx.fillStyle = S.haze; sctx.fillRect(0, 0, w, h); sctx.restore();
      fctx.clearRect(0, 0, fog.width, fog.height);
      blurInto(fctx, base, 18);
      fctx.save(); fctx.scale(dpr, dpr); fctx.fillStyle = S.haze; fctx.fillRect(0, 0, w, h);
      // Fine condensation: beads on the fogged glass.
      fctx.fillStyle = S.bead;
      for (const d of beads) { fctx.beginPath(); fctx.arc(d.x, d.y, d.r, 0, Math.PI * 2); fctx.fill(); }
      fctx.restore();
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = box.clientWidth; h = box.clientHeight;
      for (const c of [canvas, sharp, fog, mask, layer]) { c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); }
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      seed = 11;
      const n = Math.round((w * h) / 9000);
      lights = Array.from({ length: n }, () => {
        const y = h * (0.25 + Math.pow(rnd(), 0.7) * 0.8);
        return { x: rnd() * w, y, r: 8 + rnd() * rnd() * 46 * (y / h + 0.4), c: S.lights[Math.floor(rnd() * S.lights.length)], a: 0.35 + rnd() * 0.55 };
      });
      beads = Array.from({ length: Math.round((w * h) / 260) }, () => ({ x: rnd() * w, y: rnd() * h, r: 0.4 + rnd() * rnd() * 1.6 }));
      drops = Array.from({ length: Math.round((w * h) / 16000) }, () => ({ x: rnd() * w, y: rnd() * h, r: 1.5 + rnd() * rnd() * 5, vy: 0, wob: rnd() * 10, still: 1 }));
      paintScene();
      mctx.clearRect(0, 0, mask.width, mask.height);
      draw(0);
    };

    const clearAt = (x: number, y: number, r: number, a = 1) => {
      mctx.save(); mctx.scale(dpr, dpr);
      const g = mctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, `rgba(0,0,0,${a})`); g.addColorStop(0.5, `rgba(0,0,0,${a * 0.85})`); g.addColorStop(1, "rgba(0,0,0,0)");
      mctx.fillStyle = g; mctx.beginPath(); mctx.arc(x, y, r, 0, Math.PI * 2); mctx.fill();
      mctx.restore();
    };

    const lens = (d: Drop) => {
      const { x, y, r } = d;
      if (r < 1.2) return;
      ctx.save(); ctx.scale(dpr, dpr);
      ctx.beginPath(); ctx.ellipse(x, y, r, r * 1.08, 0, 0, Math.PI * 2); ctx.clip();
      // The scene behind, gathered from a wider area and flipped, as a real drop does.
      ctx.translate(x, y); ctx.scale(1, -1);
      const k = 3.2;
      ctx.drawImage(sharp, (x - r * k) * dpr, (y - r * k) * dpr, r * 2 * k * dpr, r * 2 * k * dpr, -r, -r, r * 2, r * 2);
      ctx.restore();
      ctx.save(); ctx.scale(dpr, dpr);
      const rim = ctx.createRadialGradient(x, y - r * 0.25, r * 0.3, x, y, r * 1.08);
      rim.addColorStop(0, "rgba(0,0,0,0)"); rim.addColorStop(0.8, "rgba(0,0,0,0.12)"); rim.addColorStop(1, "rgba(0,0,0,0.38)");
      ctx.fillStyle = "rgba(255,255,255,0.07)"; ctx.beginPath(); ctx.ellipse(x, y, r, r * 1.08, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = rim; ctx.fill();
      // Light gathers along the bottom edge of a real drop.
      ctx.strokeStyle = "rgba(255,255,255,0.28)"; ctx.lineWidth = Math.max(0.6, r * 0.12);
      ctx.beginPath(); ctx.ellipse(x, y, r * 0.82, r * 0.88, 0, Math.PI * 0.2, Math.PI * 0.8); ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,0.55)";
      ctx.beginPath(); ctx.ellipse(x - r * 0.32, y - r * 0.42, r * 0.22, r * 0.14, -0.5, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    };

    const step = (dt: number) => {
      // Mist returns: the clear mask fades a little every frame.
      mctx.globalCompositeOperation = "destination-out";
      mctx.fillStyle = `rgba(0,0,0,${Math.min(1, dt / remist) * 1.6})`;
      mctx.fillRect(0, 0, mask.width, mask.height);
      mctx.globalCompositeOperation = "source-over";

      spawn += dt * rain;
      while (spawn > 1) {
        spawn -= 1;
        drops.push({ x: Math.random() * w, y: Math.random() * h * 0.7, r: 1.5 + Math.random() * 2.5, vy: 0, wob: Math.random() * 10, still: 1 });
      }
      for (const d of drops) {
        if (d.still) {
          d.r += dt * 0.35 * Math.random(); // gathers moisture
          if (d.r > 5.5 && Math.random() < dt * 0.6) d.still = 0;
          continue;
        }
        d.vy = Math.min(d.vy + dt * (40 + d.r * 22), 60 + d.r * 34);
        const ny = d.y + d.vy * dt;
        d.wob += dt * 4;
        const nx = d.x + Math.sin(d.wob + d.y * 0.05) * dt * 9;
        // The trail: clear glass behind the drop, and the odd droplet left on it.
        for (let t = 0; t < 1; t += 0.34) clearAt(d.x + (nx - d.x) * t, d.y + (ny - d.y) * t, d.r * 0.95);
        if (Math.random() < dt * 3.5 && d.r > 3) {
          drops.push({ x: d.x, y: d.y, r: 0.8 + Math.random() * 1.4, vy: 0, wob: 0, still: 1 });
          d.r -= 0.12;
        }
        d.x = nx; d.y = ny;
        // Running drops swallow the still ones they pass.
        for (const o of drops) {
          if (o !== d && o.still && o.r > 0 && Math.abs(o.x - d.x) < d.r && Math.abs(o.y - d.y) < d.r) { d.r = Math.min(11, Math.hypot(d.r, o.r)); o.r = 0; }
        }
      }
      drops = drops.filter((d) => d.r > 0.6 && d.y < h + 20).slice(-420);
    };

    const draw = (dt: number) => {
      if (!reduce && dt) step(dt);
      ctx.globalCompositeOperation = "source-over";
      ctx.drawImage(fog, 0, 0);
      // Clear glass: the sharper scene, only where the mask says so.
      lctx.globalCompositeOperation = "source-over";
      lctx.clearRect(0, 0, layer.width, layer.height);
      lctx.drawImage(sharp, 0, 0);
      lctx.globalCompositeOperation = "destination-in";
      lctx.drawImage(mask, 0, 0);
      ctx.drawImage(layer, 0, 0);
      for (const d of drops) lens(d);
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (visible) draw(dt);
    };

    let px = -1, py = -1;
    const wipe = (e: PointerEvent) => {
      if (e.pointerType === "touch" && e.buttons === 0) return;
      const r = box.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      if (px < 0) { px = x; py = y; }
      const dist = Math.hypot(x - px, y - py), n = Math.max(1, Math.ceil(dist / 6));
      for (let i = 1; i <= n; i++) clearAt(px + ((x - px) * i) / n, py + ((y - py) * i) / n, 24, 0.9);
      px = x; py = y;
      if (reduce) draw(0);
    };
    const leave = () => { px = -1; py = -1; };

    resize();
    const ro = new ResizeObserver(resize); ro.observe(box);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting)); io.observe(box);
    box.addEventListener("pointermove", wipe);
    box.addEventListener("pointerleave", leave);
    box.addEventListener("pointerup", leave);
    if (!reduce) raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); box.removeEventListener("pointermove", wipe); box.removeEventListener("pointerleave", leave); box.removeEventListener("pointerup", leave); };
  }, [scene, rain, remist, motion]);

  return (
    <div ref={wrap} className={className} style={{ position: "relative", width: "100%", height: "100%", minHeight: 240, overflow: "hidden", touchAction: "pan-y" }}>
      <canvas ref={cv} aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
      {children && <div style={{ position: "relative", height: "100%" }}>{children}</div>}
    </div>
  );
}
