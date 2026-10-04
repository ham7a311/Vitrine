"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { dither } from "../../media/dither-portrait/dither";
import "./dither-logo.css";

/**
 * Dither Logo
 * A mark turned into a field of square dots by error diffusion. The pointer pushes dots
 * away and they ease home; a click sends a ripple through the field. With `invert`, the mark
 * is cut out of a rounded tile of dots instead of being drawn by them.
 */

type Props = {
  /** Image or SVG URL. Without it, `text` is set in Instrument Serif and used as the mark. */
  imageSrc?: string;
  text?: string;
  /** Accessible name of the mark. */
  label?: string;
  gridSize?: number;
  /** Size of the mark relative to the smaller side of the canvas. */
  scale?: number;
  dotScale?: number;
  invert?: boolean;
  cornerRadius?: number;
  threshold?: number;
  contrast?: number;
  gamma?: number;
  blur?: number;
  diffusionStrength?: number;
  serpentine?: boolean;
  /** Dot colour; defaults to the element's text colour. */
  color?: string;
  motion?: "full" | "reduced";
  className?: string;
  style?: CSSProperties;
};

const R = { speed: 225, width: 37, force: 20, life: 675 };
const CURSOR = { radius: 100, force: 40 };

function sourceFrom(props: Props): Promise<HTMLCanvasElement | HTMLImageElement> {
  if (props.imageSrc) {
    return new Promise((res, rej) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => res(img);
      img.onerror = rej;
      img.src = props.imageSrc!;
    });
  }
  return document.fonts.ready.then(() => {
    const c = document.createElement("canvas");
    const t = props.text ?? "V";
    c.width = 600;
    c.height = 600;
    const x = c.getContext("2d")!;
    x.fillStyle = "#fff";
    x.textAlign = "center";
    x.textBaseline = "middle";
    let size = 520;
    x.font = `italic ${size}px "Instrument Serif", Georgia, serif`;
    while (x.measureText(t).width > 560 && size > 40) x.font = `italic ${(size -= 10)}px "Instrument Serif", Georgia, serif`;
    x.fillText(t, 300, 330);
    // Trim to the mark's own box so `scale` means the mark, not the canvas.
    const m = x.measureText(t);
    const mw = Math.ceil(m.actualBoundingBoxLeft + m.actualBoundingBoxRight), mh = Math.ceil(m.actualBoundingBoxAscent + m.actualBoundingBoxDescent);
    // A square-ish margin round the mark, so an inverted tile has room on every side.
    const side = Math.max(mw, mh) * 1.36;
    const out = document.createElement("canvas");
    out.width = Math.round(Math.max(side, mw * 1.2));
    out.height = Math.round(side);
    out.getContext("2d")!.drawImage(c, 300 - m.actualBoundingBoxLeft, 330 - m.actualBoundingBoxAscent, mw, mh, (out.width - mw) / 2, (out.height - mh) / 2, mw, mh);
    return out;
  });
}

export function DitherLogo(props: Props) {
  const { label = props.text ?? "Logo", gridSize = 200, scale = 0.5, dotScale = 0.72, invert = true, cornerRadius = 0.2, threshold = 180, contrast = 0, gamma = 1, blur = 3.75, diffusionStrength = 1, serpentine = true, color, motion = "full", className = "", style } = props;
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = canvas.current;
    if (!cv) return;
    const ctx = cv.getContext("2d")!;
    const reduced = motion === "reduced" || matchMedia("(prefers-reduced-motion: reduce)").matches;
    let alive = true, raf = 0;
    let bx = new Float32Array(0), by = new Float32Array(0), ox = new Float32Array(0), oy = new Float32Array(0), size = 1;
    const cursor = { x: 0, y: 0, on: false };
    const ripples: { x: number; y: number; t: number }[] = [];
    let src: HTMLCanvasElement | HTMLImageElement | null = null;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const build = () => {
      if (!src) return;
      const rect = cv.getBoundingClientRect();
      const dpr = Math.min(devicePixelRatio || 1, 2);
      cv.width = Math.max(1, Math.round(rect.width * dpr));
      cv.height = Math.max(1, Math.round(rect.height * dpr));
      const sw = src.width, sh = src.height, aspect = sw / sh;
      const gw = aspect >= 1 ? gridSize : Math.round(gridSize * aspect), gh = aspect >= 1 ? Math.round(gridSize / aspect) : gridSize;
      // Blur the source a little first, so the dither reads as tone rather than aliasing.
      const pad = Math.ceil(blur * 3);
      const big = document.createElement("canvas");
      big.width = sw + pad * 2;
      big.height = sh + pad * 2;
      const bctx = big.getContext("2d")!;
      if (blur > 0) bctx.filter = `blur(${blur}px)`;
      bctx.drawImage(src, pad, pad);
      const small = document.createElement("canvas");
      small.width = gw;
      small.height = gh;
      const sctx = small.getContext("2d", { willReadFrequently: true })!;
      sctx.drawImage(big, pad, pad, sw, sh, 0, 0, gw, gh);
      const px = sctx.getImageData(0, 0, gw, gh).data;
      const sharp = document.createElement("canvas");
      sharp.width = gw;
      sharp.height = gh;
      const shx = sharp.getContext("2d", { willReadFrequently: true })!;
      shx.drawImage(src, 0, 0, gw, gh);
      const alpha = shx.getImageData(0, 0, gw, gh).data;
      const cf = (259 * (contrast + 255)) / (255 * (259 - contrast));
      const gray = new Float32Array(gw * gh);
      const inside = new Uint8Array(gw * gh);
      for (let i = 0; i < gw * gh; i++) {
        const a = px[i * 4 + 3] / 255;
        let l = a > 0.01 ? (0.299 * px[i * 4] + 0.587 * px[i * 4 + 1] + 0.114 * px[i * 4 + 2]) / a : 0;
        if (contrast) l = cf * (l - 128) + 128;
        if (gamma !== 1) l = 255 * Math.pow(Math.max(0, l / 255), 1 / gamma);
        // Ink is "dark" in dither(); a bright mark should become dots, so invert luma.
        gray[i] = 255 - Math.max(0, Math.min(255, l));
        inside[i] = alpha[i * 4 + 3] >= 128 ? 1 : 0;
      }
      const mask = dither(gray, gw, gh, "floyd", 255 - threshold, serpentine, diffusionStrength);
      const pts: number[] = [];
      const r = Math.round(cornerRadius * Math.min(gw, gh));
      const inRounded = (x: number, y: number) => {
        if ((x >= r && x < gw - r) || (y >= r && y < gh - r)) return true;
        const cx = x < r ? r : gw - r - 1, cy = y < r ? r : gh - r - 1;
        return (x - cx) ** 2 + (y - cy) ** 2 <= r * r;
      };
      for (let y = 0; y < gh; y++)
        for (let x = 0; x < gw; x++) {
          const i = y * gw + x;
          const dot = inside[i] && mask[i];
          if (invert ? inRounded(x, y) && !dot : dot) pts.push(x, y);
        }
      const W = rect.width, H = rect.height;
      const k = Math.max(1, (Math.min(W, H) * scale) / Math.max(gw, gh));
      const x0 = Math.round((W - gw * k) / 2), y0 = Math.round((H - gh * k) / 2);
      const n = pts.length / 2;
      bx = new Float32Array(n);
      by = new Float32Array(n);
      ox = new Float32Array(n);
      oy = new Float32Array(n);
      for (let i = 0; i < n; i++) {
        bx[i] = x0 + pts[i * 2] * k;
        by[i] = y0 + pts[i * 2 + 1] * k;
      }
      size = k * dotScale * (W < 640 ? 0.8 : 1);
      draw();
    };

    const draw = () => {
      const dpr = cv.width / Math.max(1, cv.getBoundingClientRect().width);
      ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.fillStyle = color ?? getComputedStyle(cv).color;
      const s = Math.max(1, size) * dpr;
      for (let i = 0; i < bx.length; i++) ctx.fillRect((bx[i] + ox[i]) * dpr, (by[i] + oy[i]) * dpr, s, s);
    };

    const step = (now: number) => {
      for (let k = ripples.length - 1; k >= 0; k--) if (now - ripples[k].t >= R.life) ripples.splice(k, 1);
      const boost = ripples.length ? 1 + 0.5 * (ripples.length - 1) : 0;
      let moving = false;
      for (let i = 0; i < bx.length; i++) {
        let fx = 0, fy = 0;
        if (cursor.on) {
          const vx = bx[i] + ox[i] - cursor.x, vy = by[i] + oy[i] - cursor.y, d2 = vx * vx + vy * vy;
          if (d2 > 0.1 && d2 < CURSOR.radius ** 2) {
            const d = Math.sqrt(d2), f = (1 - d / CURSOR.radius) ** 3 * CURSOR.force;
            fx += (vx / d) * f;
            fy += (vy / d) * f;
          }
        }
        for (const rp of ripples) {
          const el = now - rp.t, radius = (el / 1000) * R.speed, life = 1 - el / R.life;
          const sx = bx[i] - rp.x, sy = by[i] - rp.y, d = Math.hypot(sx, sy);
          const band = Math.abs(d - radius);
          if (d > 0.1 && band < R.width) {
            const f = (1 - band / R.width) * life * R.force * boost;
            fx += (sx / d) * f;
            fy += (sy / d) * f;
          }
        }
        ox[i] += (fx - ox[i]) * 0.12;
        oy[i] += (fy - oy[i]) * 0.12;
        if (Math.abs(ox[i]) < 0.01) ox[i] = 0;
        if (Math.abs(oy[i]) < 0.01) oy[i] = 0;
        if (ox[i] || oy[i]) moving = true;
      }
      return moving || ripples.length > 0 || cursor.on;
    };

    const tick = (now: number) => {
      raf = 0;
      if (!alive) return;
      const more = step(now);
      draw();
      if (more) raf = requestAnimationFrame(tick);
    };
    const wake = () => {
      if (!reduced && !raf && alive) raf = requestAnimationFrame(tick);
    };
    const at = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      const k = r.width / cv.offsetWidth || 1;
      return [(e.clientX - r.left) / k, (e.clientY - r.top) / k];
    };
    const onMove = (e: PointerEvent) => {
      [cursor.x, cursor.y] = at(e);
      cursor.on = true;
      wake();
    };
    const onLeave = () => {
      cursor.on = false;
      wake();
    };
    const onUp = (e: PointerEvent) => {
      const [x, y] = at(e);
      ripples.push({ x, y, t: performance.now() });
      if (e.pointerType !== "mouse") cursor.on = false;
      wake();
    };
    cv.addEventListener("pointermove", onMove);
    cv.addEventListener("pointerleave", onLeave);
    cv.addEventListener("pointercancel", onLeave);
    cv.addEventListener("pointerup", onUp);
    let lastW = 0;
    const ro = new ResizeObserver(() => {
      const w = Math.round(cv.getBoundingClientRect().width);
      if (w === lastW) return;
      lastW = w;
      clearTimeout(timer);
      timer = setTimeout(build, 120);
    });
    ro.observe(cv);
    sourceFrom(props).then((s) => {
      if (!alive) return;
      src = s;
      build();
    });
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      ro.disconnect();
      cv.removeEventListener("pointermove", onMove);
      cv.removeEventListener("pointerleave", onLeave);
      cv.removeEventListener("pointercancel", onLeave);
      cv.removeEventListener("pointerup", onUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.imageSrc, props.text, gridSize, scale, dotScale, invert, cornerRadius, threshold, contrast, gamma, blur, diffusionStrength, serpentine, color, motion]);

  return (
    <div className={`dl ${className}`} style={style}>
      <canvas ref={canvas} className="dl__canvas" role="img" aria-label={label} />
    </div>
  );
}
