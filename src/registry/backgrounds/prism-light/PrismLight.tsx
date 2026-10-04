"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Prism
 * A beam of white light crosses a dark room, enters a glass prism and comes
 * out the other side as a spectrum fanned across the far wall. It is worked
 * out, not painted: every wavelength is refracted by Snell's law at both
 * faces with its own index of refraction (a Cauchy curve, dispersion
 * exaggerated so the fan reads), so moving the light — it follows the
 * pointer — swings and spreads the colours the way a real prism does.
 * Dust turns visible where it drifts through the light.
 */

type Props = {
  theme?: "night" | "studio";
  className?: string;
  children?: ReactNode;
};

type V = { x: number; y: number };
const THEMES = {
  night: { bg: "#05060a", wall: "#0b0d14", floor: "#07080d", glass: [200, 220, 255] },
  studio: { bg: "#17181b", wall: "#212226", floor: "#141518", glass: [230, 235, 245] },
};

/** Visible wavelength (nm) to sRGB, with intensity falling off at the ends of the spectrum. */
function spectral(nm: number): [number, number, number] {
  let r = 0, g = 0, b = 0;
  if (nm < 440) { r = -(nm - 440) / 60; b = 1; }
  else if (nm < 490) { g = (nm - 440) / 50; b = 1; }
  else if (nm < 510) { g = 1; b = -(nm - 510) / 20; }
  else if (nm < 580) { r = (nm - 510) / 70; g = 1; }
  else if (nm < 645) { r = 1; g = -(nm - 645) / 65; }
  else r = 1;
  const f = nm < 420 ? 0.3 + (0.7 * (nm - 380)) / 40 : nm > 680 ? 0.3 + (0.7 * (720 - nm)) / 40 : 1;
  return [Math.round(255 * Math.pow(r * f, 0.8)), Math.round(255 * Math.pow(g * f, 0.8)), Math.round(255 * Math.pow(b * f, 0.8))];
}

/** Index of refraction for a wavelength: Cauchy's equation for crown glass, with the dispersion term scaled up ×7. */
const index = (nm: number) => 1.5046 + (0.0042 * 7) / Math.pow(nm / 1000, 2);

const sub = (a: V, b: V): V => ({ x: a.x - b.x, y: a.y - b.y });
const dot = (a: V, b: V) => a.x * b.x + a.y * b.y;
const norm = (a: V): V => { const l = Math.hypot(a.x, a.y) || 1; return { x: a.x / l, y: a.y / l }; };

/** Where a ray (origin o, direction d) crosses segment a–b, as a distance along the ray. */
function hit(o: V, d: V, a: V, b: V) {
  const e = sub(b, a), den = d.x * e.y - d.y * e.x;
  if (Math.abs(den) < 1e-9) return -1;
  const w = sub(a, o);
  const t = (w.x * e.y - w.y * e.x) / den, u = (w.x * d.y - w.y * d.x) / den;
  return t > 1e-6 && u >= 0 && u <= 1 ? t : -1;
}
/** Snell's law in vector form; n faces the incoming side. Null on total internal reflection. */
function refract(d: V, n: V, eta: number): V | null {
  const ci = -dot(n, d);
  const k = 1 - eta * eta * (1 - ci * ci);
  if (k < 0) return null;
  const s = eta * ci - Math.sqrt(k);
  return norm({ x: eta * d.x + s * n.x, y: eta * d.y + s * n.y });
}

const BANDS = 72;

export function PrismLight({ theme = "night", className = "", children }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const T = THEMES[theme];
    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";
    host.prepend(canvas);
    const ctx = canvas.getContext("2d");
    if (!ctx) return () => canvas.remove();

    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = !matchMedia("(hover: hover) and (pointer: fine)").matches;
    const dpr = Math.min(devicePixelRatio, coarse ? 1.5 : 2);
    const bands = Array.from({ length: BANDS }, (_, i) => {
      const nm = 400 + (300 * i) / (BANDS - 1);
      return { nm, n: index(nm), c: spectral(nm) };
    });

    let W = 0, H = 0;
    let tri: V[] = [];
    let dust: { x: number; y: number; vx: number; vy: number; s: number }[] = [];
    let raf = 0, visible = true, last = 0, t = 0;
    const src = { x: 0, y: 0 }, aimSrc = { x: 0, y: 0 };
    let held = false;

    const resize = () => {
      const w = host.clientWidth, h = host.clientHeight;
      if (w === W && h === H) return;
      W = w; H = h;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const s = Math.min(W * (W < 640 ? 0.52 : 0.3), H * 0.5), hh = (s * Math.sqrt(3)) / 2;
      const cx = W * (W < 640 ? 0.5 : 0.52), cy = H * 0.52;
      tri = [{ x: cx, y: cy - (hh * 2) / 3 }, { x: cx + s / 2, y: cy + hh / 3 }, { x: cx - s / 2, y: cy + hh / 3 }];
      dust = Array.from({ length: Math.round((W * H) / 5200) }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 6, vy: (Math.random() - 0.5) * 4, s: 0.5 + Math.random() * 1.3 }));
      home(true);
    };
    /** The resting light: low on the left, aimed up into the left face, breathing a little. */
    const home = (snap = false) => {
      aimSrc.x = -W * 0.04;
      aimSrc.y = H * (0.78 + Math.sin(t * 0.35) * 0.05);
      if (snap) { src.x = aimSrc.x; src.y = aimSrc.y; }
    };

    /** Trace the beam: white to the left face, then every wavelength through the glass and out. */
    const trace = () => {
      const [apex, br, bl] = tri;
      const target = { x: (bl.x + apex.x) / 2 + (apex.x - bl.x) * 0.08, y: (bl.y + apex.y) / 2 + (apex.y - bl.y) * 0.08 };
      const d = norm(sub(target, src));
      const tIn = hit(src, d, bl, apex);
      if (tIn < 0) return null;
      const entry = { x: src.x + d.x * tIn, y: src.y + d.y * tIn };
      const fl = norm(sub(apex, bl)), nIn = { x: fl.y, y: -fl.x }; // outward normal of the left face
      const nL = dot(nIn, d) > 0 ? { x: -nIn.x, y: -nIn.y } : nIn;
      const faces: [V, V][] = [[bl, apex], [apex, br], [br, bl]];
      const out = bands.map((b) => {
        let dir = refract(d, nL, 1 / b.n);
        if (!dir) return null;
        // Inside the glass: find the face it reaches; refract out, or — past the
        // critical angle — reflect internally and carry on (up to three bounces).
        let o = entry, from = 0;
        for (let bounce = 0; bounce < 4; bounce++) {
          let best = -1, bf = -1;
          faces.forEach(([p, q], fi) => {
            if (fi === from) return;
            const ti = hit(o, dir!, p, q);
            if (ti > 0 && (best < 0 || ti < best)) { best = ti; bf = fi; }
          });
          if (best < 0) return null;
          const exit = { x: o.x + dir.x * best, y: o.y + dir.y * best };
          const [p, q] = faces[bf];
          const f = norm(sub(q, p));
          let n = { x: f.y, y: -f.x };
          if (dot(n, dir) < 0) n = { x: -n.x, y: -n.y }; // outward, along the travel
          const dout = refract(dir, { x: -n.x, y: -n.y }, b.n);
          if (dout) return { exit, dir: dout, b, inner: o };
          const k = 2 * dot(dir, n);
          dir = norm({ x: dir.x - k * n.x, y: dir.y - k * n.y });
          o = exit; from = bf;
        }
        return null;
      });
      return { entry, d, out };
    };

    const render = () => {
      // Room: a wall falling into a floor.
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, T.bg);
      g.addColorStop(0.7, T.wall);
      g.addColorStop(0.7001, T.floor);
      g.addColorStop(1, T.bg);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      const tr = trace();
      const [apex, br, bl] = tri;
      ctx.globalCompositeOperation = "lighter";
      if (tr) {
        const { entry, d, out } = tr;
        // The white beam, in a few widening passes for a soft edge.
        const len = Math.hypot(entry.x - src.x, entry.y - src.y);
        const nx = -d.y, ny = d.x;
        for (const [w, a] of [[16, 0.035], [8, 0.07], [3.2, 0.35], [1.4, 0.7]]) {
          const gr = ctx.createLinearGradient(src.x, src.y, entry.x, entry.y);
          gr.addColorStop(0, `rgba(255,250,240,0)`);
          gr.addColorStop(Math.min(0.9, 140 / len), `rgba(255,250,240,${a})`);
          gr.addColorStop(1, `rgba(255,250,240,${a})`);
          ctx.fillStyle = gr;
          ctx.beginPath();
          ctx.moveTo(src.x + nx * w * 0.4, src.y + ny * w * 0.4);
          ctx.lineTo(entry.x + nx * w, entry.y + ny * w);
          ctx.lineTo(entry.x - nx * w, entry.y - ny * w);
          ctx.lineTo(src.x - nx * w * 0.4, src.y - ny * w * 0.4);
          ctx.fill();
        }
        // Inside the glass: a faint fan already splitting.
        const ok = out.filter(Boolean) as NonNullable<(typeof out)[number]>[];
        ctx.lineWidth = 1.2;
        ok.forEach((o, i) => {
          if (i % 6) return;
          ctx.strokeStyle = `rgba(${o.b.c[0]},${o.b.c[1]},${o.b.c[2]},0.16)`;
          ctx.beginPath(); ctx.moveTo(o.inner.x, o.inner.y); ctx.lineTo(o.exit.x, o.exit.y); ctx.stroke();
        });
        // The spectrum: one soft wedge per wavelength, overlapping its neighbours so the colours blend.
        const L = Math.hypot(W, H) * 1.4;
        for (let pass = 0; pass < 2; pass++) {
          ok.forEach((o, i) => {
            const nb = ok[Math.min(ok.length - 1, i + 1)] ?? o, pb = ok[Math.max(0, i - 1)] ?? o;
            const far = { x: o.exit.x + o.dir.x * L, y: o.exit.y + o.dir.y * L };
            const farN = { x: nb.exit.x + nb.dir.x * L, y: nb.exit.y + nb.dir.y * L };
            const farP = { x: pb.exit.x + pb.dir.x * L, y: pb.exit.y + pb.dir.y * L };
            const spread = pass ? 4.2 : 2.3;
            const a = { x: far.x + (farP.x - far.x) * 0.5 * spread, y: far.y + (farP.y - far.y) * 0.5 * spread };
            const b = { x: far.x + (farN.x - far.x) * 0.5 * spread, y: far.y + (farN.y - far.y) * 0.5 * spread };
            const gr = ctx.createLinearGradient(o.exit.x, o.exit.y, far.x, far.y);
            const al = (pass ? 0.03 : 0.095) * (44 / BANDS);
            gr.addColorStop(0, `rgba(${o.b.c[0]},${o.b.c[1]},${o.b.c[2]},${al * 1.6})`);
            gr.addColorStop(0.35, `rgba(${o.b.c[0]},${o.b.c[1]},${o.b.c[2]},${al})`);
            gr.addColorStop(1, `rgba(${o.b.c[0]},${o.b.c[1]},${o.b.c[2]},${al * 0.55})`);
            ctx.fillStyle = gr;
            ctx.beginPath();
            ctx.moveTo(o.exit.x, o.exit.y - 1.2);
            ctx.lineTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.lineTo(o.exit.x, o.exit.y + 1.2);
            ctx.fill();
          });
        }
        // Dust: lit where it drifts through the white beam or the fan, in the colour there.
        const first = ok[0], lastB = ok[ok.length - 1];
        for (const p of dust) {
          let lit = 0, c = [255, 250, 240];
          const v = sub(p, src), along = dot(v, d);
          if (along > 0 && along < len) {
            const dd = Math.abs(v.x * d.y - v.y * d.x);
            if (dd < 10) lit = 1 - dd / 10;
          }
          if (!lit && first && lastB) {
            const e = first.exit, q = sub(p, e);
            const a0 = Math.atan2(first.dir.y, first.dir.x), a1 = Math.atan2(lastB.dir.y, lastB.dir.x), ap = Math.atan2(q.y, q.x);
            const lo = Math.min(a0, a1), hi = Math.max(a0, a1);
            if (ap > lo - 0.01 && ap < hi + 0.01 && dot(q, first.dir) > 0) {
              const k = (ap - a0) / (a1 - a0 || 1);
              const b = ok[Math.max(0, Math.min(ok.length - 1, Math.round(k * (ok.length - 1))))];
              c = b.b.c; lit = 0.8;
            }
          }
          if (lit > 0.02) {
            ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${(0.55 * lit).toFixed(3)})`;
            ctx.fillRect(p.x, p.y, p.s, p.s);
          }
        }
        // Where the light enters, a bright point on the glass.
        const sp = ctx.createRadialGradient(entry.x, entry.y, 0, entry.x, entry.y, 22);
        sp.addColorStop(0, "rgba(255,255,255,0.5)");
        sp.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = sp;
        ctx.fillRect(entry.x - 22, entry.y - 22, 44, 44);
      }
      ctx.globalCompositeOperation = "source-over";
      // The prism: clear glass with lit edges and a faint inner sheen.
      ctx.beginPath();
      ctx.moveTo(apex.x, apex.y); ctx.lineTo(br.x, br.y); ctx.lineTo(bl.x, bl.y); ctx.closePath();
      const gl = ctx.createLinearGradient(bl.x, apex.y, br.x, br.y);
      gl.addColorStop(0, `rgba(${T.glass.join(",")},0.07)`);
      gl.addColorStop(0.55, `rgba(${T.glass.join(",")},0.025)`);
      gl.addColorStop(1, `rgba(${T.glass.join(",")},0.06)`);
      ctx.fillStyle = gl;
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = `rgba(${T.glass.join(",")},0.32)`;
      ctx.stroke();
      ctx.lineWidth = 1.6;
      ctx.strokeStyle = `rgba(255,255,255,0.5)`;
      ctx.beginPath(); ctx.moveTo(bl.x + 2, bl.y - 1); ctx.lineTo(apex.x, apex.y + 3); ctx.stroke();
      // Its reflection on the floor.
      ctx.beginPath();
      ctx.moveTo(bl.x, bl.y + 2); ctx.lineTo(br.x, br.y + 2); ctx.lineTo((bl.x + br.x) / 2, bl.y + 2 + (bl.y - apex.y) * 0.3); ctx.closePath();
      const rf = ctx.createLinearGradient(0, bl.y, 0, bl.y + (bl.y - apex.y) * 0.3);
      rf.addColorStop(0, `rgba(${T.glass.join(",")},0.05)`);
      rf.addColorStop(1, `rgba(${T.glass.join(",")},0)`);
      ctx.fillStyle = rf;
      ctx.fill();
    };

    const loop = (now: number) => {
      if (!visible || document.hidden) { raf = 0; last = 0; return; }
      raf = requestAnimationFrame(loop);
      if (coarse && now - last < 30) return;
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016);
      last = now;
      t += dt;
      resize();
      if (!held) home();
      src.x += (aimSrc.x - src.x) * Math.min(1, dt * 6);
      src.y += (aimSrc.y - src.y) * Math.min(1, dt * 6);
      for (const p of dust) {
        p.x += p.vx * dt; p.y += p.vy * dt;
        p.vx += (Math.random() - 0.5) * 4 * dt; p.vy += (Math.random() - 0.5) * 3 * dt;
        if (p.x < 0) p.x += W; else if (p.x > W) p.x -= W;
        if (p.y < 0) p.y += H; else if (p.y > H) p.y -= H;
      }
      render();
    };
    const wake = () => { if (!reduced && !raf && visible && !document.hidden) raf = requestAnimationFrame(loop); };

    // The pointer is the lamp, kept to the left of the prism so the light always reaches it.
    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      const inside = x >= 0 && y >= 0 && x <= r.width && y <= r.height;
      held = inside;
      if (inside) { aimSrc.x = Math.min(x, tri[2].x - 30); aimSrc.y = Math.max(H * 0.04, Math.min(H * 0.96, y)); }
    };
    const onUp = (e: PointerEvent) => { if (e.pointerType === "touch") held = false; };

    resize();
    render();
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; wake(); });
    io.observe(host);
    const ro = new ResizeObserver(() => { if (reduced) { resize(); render(); } });
    ro.observe(host);
    document.addEventListener("visibilitychange", wake);
    if (!reduced) {
      wake();
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerup", onUp);
    }
    return () => {
      cancelAnimationFrame(raf);
      raf = 0;
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", wake);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      canvas.remove();
    };
  }, [theme]);

  return (
    <div ref={hostRef} className={`relative isolate overflow-hidden ${className}`} style={{ background: THEMES[theme].bg }}>
      {children && <div className="relative z-[1] h-full">{children}</div>}
    </div>
  );
}
