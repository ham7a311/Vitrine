"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { paintStudy } from "../art-gallery/studies";
import { bayer, dither, grayOf, type DitherAlgo } from "./dither";
import "./dither-portrait.css";

/**
 * Dither Portrait
 * A picture printed in two inks by error diffusion. Wherever the pointer goes, a round lens
 * shows the original in full colour, and its edge breaks up into the same dither pattern,
 * so the two prints meet without a hard line. Click to change how the dots are laid.
 */

const ALGOS: { id: DitherAlgo; label: string }[] = [
  { id: "floyd", label: "Floyd–Steinberg" },
  { id: "atkinson", label: "Atkinson" },
  { id: "bayer", label: "Bayer 8×8" },
];

type Props = {
  /** Image URL; defaults to a generated horizon study. */
  src?: string;
  alt?: string;
  ink?: string;
  paper?: string;
  /** CSS pixels per dither cell. */
  cell?: number;
  lensRadius?: number;
  motion?: "full" | "reduced";
  className?: string;
  style?: CSSProperties;
};

export function DitherPortrait({ src, alt = "A sun low over layered hills, printed in two inks", ink = "#1b1a17", paper = "#efe9dc", cell = 2, lensRadius = 110, motion = "full", className = "", style }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [algo, setAlgo] = useState(0);
  const redraw = useRef<(() => void) | null>(null);

  useEffect(() => {
    const el = host.current, cv = canvas.current;
    if (!el || !cv) return;
    const ctx = cv.getContext("2d")!;
    const reduced = motion === "reduced" || matchMedia("(prefers-reduced-motion: reduce)").matches;
    let source: CanvasImageSource | null = null;
    let printed: HTMLCanvasElement | null = null;
    let colour: HTMLCanvasElement | null = null;
    let W = 0, H = 0, cw = 0, chh = 0, dpr = 1, raf = 0, alive = true;
    const lens = { x: -999, y: -999, tx: -999, ty: -999, r: 0, tr: 0 };

    const toRGB = (hex: string) => {
      const n = parseInt(hex.slice(1), 16);
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    };

    const build = () => {
      if (!source) return;
      dpr = Math.min(devicePixelRatio || 1, 2);
      W = el.clientWidth;
      H = el.clientHeight;
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      cw = Math.ceil(W / cell);
      chh = Math.ceil(H / cell);
      // Cover-fit the source into the frame once, at cell resolution and at full resolution.
      const fit = (w: number, h: number) => {
        const c = document.createElement("canvas");
        c.width = w;
        c.height = h;
        const x = c.getContext("2d")!;
        const sw = (source as HTMLCanvasElement).width, sh = (source as HTMLCanvasElement).height;
        const k = Math.max(w / sw, h / sh);
        x.drawImage(source!, (w - sw * k) / 2, (h - sh * k) / 2, sw * k, sh * k);
        return c;
      };
      colour = fit(cv.width, cv.height);
      const g = grayOf(fit(cw, chh), cw, chh, 1.1);
      const mask = dither(g, cw, chh, ALGOS[algo].id);
      printed = document.createElement("canvas");
      printed.width = cw;
      printed.height = chh;
      const p = printed.getContext("2d")!;
      const img = p.createImageData(cw, chh);
      const [ir, ig, ib] = toRGB(ink), [pr, pg, pb] = toRGB(paper);
      for (let i = 0; i < cw * chh; i++) {
        const on = mask[i];
        img.data[i * 4] = on ? ir : pr;
        img.data[i * 4 + 1] = on ? ig : pg;
        img.data[i * 4 + 2] = on ? ib : pb;
        img.data[i * 4 + 3] = 255;
      }
      p.putImageData(img, 0, 0);
      paint();
    };

    // The lens edge: cells within the soft ring show colour only where the falloff beats the Bayer threshold.
    const edge = document.createElement("canvas");
    const paint = () => {
      if (!printed || !colour) return;
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(printed, 0, 0, cw * cell * dpr, chh * cell * dpr);
      if (lens.r < 1) return;
      const R = lens.r, feather = 26;
      const x0 = Math.max(0, Math.floor((lens.x - R - feather) / cell)), y0 = Math.max(0, Math.floor((lens.y - R - feather) / cell));
      const x1 = Math.min(cw, Math.ceil((lens.x + R + feather) / cell)), y1 = Math.min(chh, Math.ceil((lens.y + R + feather) / cell));
      const ew = x1 - x0, eh = y1 - y0;
      if (ew <= 0 || eh <= 0) return;
      edge.width = ew;
      edge.height = eh;
      const ex = edge.getContext("2d")!;
      const m = ex.createImageData(ew, eh);
      for (let y = 0; y < eh; y++)
        for (let x = 0; x < ew; x++) {
          const cx = (x0 + x + 0.5) * cell, cy = (y0 + y + 0.5) * cell;
          const d = Math.hypot(cx - lens.x, cy - lens.y);
          const t = Math.max(0, Math.min(1, (R + feather - d) / (feather * 2)));
          if (t > bayer(x0 + x, y0 + y)) m.data[(y * ew + x) * 4 + 3] = 255;
        }
      ex.putImageData(m, 0, 0);
      // Use the mask as a stencil for the colour picture.
      const tmp = document.createElement("canvas");
      tmp.width = ew * cell * dpr;
      tmp.height = eh * cell * dpr;
      const tx = tmp.getContext("2d")!;
      tx.imageSmoothingEnabled = false;
      tx.drawImage(edge, 0, 0, tmp.width, tmp.height);
      tx.globalCompositeOperation = "source-in";
      tx.drawImage(colour, x0 * cell * dpr, y0 * cell * dpr, tmp.width, tmp.height, 0, 0, tmp.width, tmp.height);
      ctx.drawImage(tmp, x0 * cell * dpr, y0 * cell * dpr);
    };

    const tick = () => {
      raf = 0;
      const k = reduced ? 1 : 0.22;
      lens.x += (lens.tx - lens.x) * k;
      lens.y += (lens.ty - lens.y) * k;
      lens.r += (lens.tr - lens.r) * (reduced ? 1 : 0.18);
      paint();
      if (Math.abs(lens.tx - lens.x) + Math.abs(lens.ty - lens.y) + Math.abs(lens.tr - lens.r) > 0.4) raf = requestAnimationFrame(tick);
    };
    const wake = () => {
      if (!raf && alive) raf = requestAnimationFrame(tick);
    };
    const at = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const k = r.width / el.offsetWidth || 1;
      return [(e.clientX - r.left) / k, (e.clientY - r.top) / k];
    };
    const onMove = (e: PointerEvent) => {
      const [x, y] = at(e);
      if (lens.r < 1) {
        lens.x = x;
        lens.y = y;
      }
      lens.tx = x;
      lens.ty = y;
      lens.tr = Math.min(lensRadius, Math.min(W, H) * 0.3);
      wake();
    };
    const onLeave = () => {
      lens.tr = 0;
      wake();
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerdown", onMove);
    el.addEventListener("pointerleave", onLeave);
    const ro = new ResizeObserver(() => build());
    ro.observe(el);
    redraw.current = build;

    if (src) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        source = img;
        build();
      };
      img.src = src;
    } else {
      source = paintStudy(12, 1200, 900);
      build();
    }
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerdown", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [src, ink, paper, cell, lensRadius, motion, algo]);

  return (
    <div ref={host} className={`dp ${className}`} style={{ background: paper, color: ink, ["--dp-paper" as string]: paper, ...style }}>
      <canvas ref={canvas} className="dp__canvas" role="img" aria-label={alt} />
      <button type="button" className="dp__mode" onClick={() => setAlgo((a) => (a + 1) % ALGOS.length)} aria-label={`Dither: ${ALGOS[algo].label}. Change pattern`}>
        <span aria-hidden="true">◐</span> {ALGOS[algo].label}
      </button>
    </div>
  );
}
