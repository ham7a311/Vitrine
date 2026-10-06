"use client";
import { useEffect, useId, useRef, type CSSProperties, type ReactNode } from "react";
import { approach, edgeAngle, grid, hash, intensity } from "./edge";
import { Icon, type TileIcon } from "./icons";
import "./signal-tiles.css";

export type { TileIcon } from "./icons";
export type SignalTile = { title: string; href: string; icon: TileIcon | ReactNode };
export type SignalTilesProps = {
  heading: ReactNode;
  tiles: SignalTile[];
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
  theme?: "light" | "dark";
  motion?: boolean;
  className?: string;
};

const STEP = 10;

/** One tile's hover life: dots that twinkle up under the pointer, and a lit arc that slides round the border after it. */
function useTile(motion: boolean, dark: boolean) {
  const tile = useRef<HTMLAnchorElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = tile.current, cv = canvas.current;
    if (!el || !cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const still = !motion || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0, on = false, alpha = 0, w = 0, h = 0, dpr = 1, pts: [number, number][] = [];
    let px = 0, py = 0, angle = 135, target = 135;
    const t0 = performance.now();

    const size = () => {
      const r = el.getBoundingClientRect();
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = r.width; h = r.height;
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      pts = grid(w, h, STEP);
    };
    const draw = () => {
      const t = still ? 0 : (performance.now() - t0) / 1000;
      alpha += ((on ? 1 : 0) - alpha) * (still ? 1 : 0.12);
      angle = still ? target : approach(angle, target, 0.16);
      el.style.setProperty("--sigt-a", `${angle.toFixed(1)}deg`);
      el.style.setProperty("--sigt-on", alpha.toFixed(3));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      if (alpha > 0.01) {
        for (let i = 0; i < pts.length; i++) {
          const [x, y] = pts[i];
          const v = intensity(i, x, y, px, py, t) * alpha;
          if (v < 0.025) continue;
          // About a third of the dots carry the blue; the rest are cool grey.
          const blue = hash(i + 3) < 0.34;
          ctx.fillStyle = dark ? (blue ? `rgba(96,150,255,${v})` : `rgba(190,200,215,${v * 0.8})`) : (blue ? `rgba(37,99,235,${v * 0.9})` : `rgba(40,44,52,${v * 0.55})`);
          ctx.fillRect(x - 0.9, y - 0.9, 1.8, 1.8);
        }
      }
      if (on || alpha > 0.01 || Math.abs(((target - angle + 540) % 360) - 180) > 0.5) raf = requestAnimationFrame(draw);
      else raf = 0;
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(draw); };
    const at = (e: PointerEvent) => { const r = el.getBoundingClientRect(); px = e.clientX - r.left; py = e.clientY - r.top; target = edgeAngle(px, py, w, h); };
    const enter = (e: PointerEvent) => { size(); at(e); if (!on) angle = target; on = true; kick(); };
    const move = (e: PointerEvent) => { at(e); kick(); };
    const leave = () => { on = false; kick(); };
    // Keyboard focus lights the tile with the arc resting on the bottom-right corner.
    const focus = () => { if (!el.matches(":focus-visible")) return; size(); px = w * 0.8; py = h * 0.8; target = angle = 135; on = true; kick(); };

    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    el.addEventListener("focus", focus);
    el.addEventListener("blur", leave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      el.removeEventListener("focus", focus);
      el.removeEventListener("blur", leave);
    };
  }, [motion, dark]);
  return { tile, canvas };
}

function Tile({ t, motion, dark }: { t: SignalTile; motion: boolean; dark: boolean }) {
  const { tile, canvas } = useTile(motion, dark);
  return (
    <li className="sigt__cell">
      <a ref={tile} href={t.href} className="sigt__tile" style={{ "--sigt-a": "135deg", "--sigt-on": 0 } as CSSProperties}>
        <canvas ref={canvas} className="sigt__dots" aria-hidden="true" />
        <span className="sigt__beam" aria-hidden="true" />
        <span className="sigt__beam sigt__beam--glow" aria-hidden="true" />
        <span className="sigt__glyph">{typeof t.icon === "string" ? <Icon name={t.icon as TileIcon} /> : t.icon}</span>
        <span className="sigt__title">{t.title}</span>
      </a>
    </li>
  );
}

/**
 * Signal Tiles
 * A grid of quiet black service tiles. Point at one and it switches on: a
 * field of dots twinkles up around the pointer, a lit arc slides round the
 * border to the nearest edge, and the icon and label come up to white.
 */
export function SignalTiles({ heading, tiles, primary, secondary, theme = "dark", motion = true, className = "" }: SignalTilesProps) {
  const id = useId();
  return (
    <section className={`sigt sigt--${theme} ${className}`} aria-labelledby={`${id}-h`}>
      <header className="sigt__head">
        <h2 id={`${id}-h`}>{heading}</h2>
        {(primary || secondary) && (
          <div className="sigt__actions">
            {primary && <a className="sigt__pill sigt__pill--primary" href={primary.href}>{primary.label}</a>}
            {secondary && <a className="sigt__pill" href={secondary.href}>{secondary.label}</a>}
          </div>
        )}
      </header>
      <ul className="sigt__grid">
        {tiles.map((t) => <Tile key={t.title} t={t} motion={motion} dark={theme === "dark"} />)}
      </ul>
    </section>
  );
}
