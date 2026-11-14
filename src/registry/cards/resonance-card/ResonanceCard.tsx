"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Sand, modeFor, plate, seeded, type Mode } from "../../backgrounds/chladni-plate/chladni";
import "./resonance-card.css";

/**
 * Resonance Card
 * A card for a sound, where the picture is the sound: sand on a plate tuned to the card's own frequency, so no
 * two values draw the same figure. Pointing at the card strikes the plate; while it plays, the sand keeps
 * dancing on its lines; when it stops, the figure comes to rest.
 */

type Props = {
  title: string;
  subtitle?: string;
  /** The number the figure is drawn from, shown with its unit. */
  value: number;
  unit?: string;
  /** Draw this figure instead of the one the value gives. */
  mode?: Mode;
  /** Controlled. Leave it out and the card keeps its own state. */
  playing?: boolean;
  defaultPlaying?: boolean;
  onPlayingChange?: (playing: boolean) => void;
  theme?: "gold" | "ash";
  motion?: "full" | "reduced";
  className?: string;
};

/** Seconds the plate keeps ringing after it was last struck. */
const RING = 2.8;

export function ResonanceCard({ title, subtitle, value, unit = "Hz", mode, playing: controlled, defaultPlaying = false, onPlayingChange, theme = "gold", motion = "full", className = "" }: Props) {
  const id = useId();
  const [own, setOwn] = useState(defaultPlaying);
  const playing = controlled ?? own;
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const live = useRef({ playing, strike: () => {}, wake: () => {} });
  live.current.playing = playing;
  const figure = mode ?? modeFor(value);

  useEffect(() => {
    const el = root.current!, cv = canvas.current!, ctx = cv.getContext("2d");
    if (!ctx) return;
    const reduced = motion === "reduced" || matchMedia("(prefers-reduced-motion: reduce)").matches;
    let S = 0, dpr = 1, sand: Sand | null = null, grain = "#efe4c4";
    let raf = 0, alive = true, visible = false, seen = false, until = 0;

    const draw = () => {
      if (!sand) return;
      ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.fillStyle = grain;
      ctx.globalAlpha = 0.88;
      const s = Math.max(1, 1.05 * dpr);
      for (let i = 0; i < sand.count; i++) {
        const r = i % 8 === 0 ? s * 1.5 : s;
        ctx.fillRect(sand.x[i] * dpr - r / 2, sand.y[i] * dpr - r / 2, r, r);
      }
    };
    const measure = () => {
      const s = cv.offsetWidth;
      if (!s || s === S) return;
      S = s;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = cv.height = Math.round(S * dpr);
      grain = getComputedStyle(el).getPropertyValue("--rsc-grain").trim() || grain;
      const count = Math.round(Math.min(5200, Math.max(1200, (S * S * 24) / 1000)));
      if (!sand || sand.count !== count) sand = new Sand(count, S, S, reduced ? seeded(Math.round(value) || 3) : Math.random);
      else sand.resize(S, S);
      if (reduced) {
        sand.scatter();
        const f = plate(figure, S);
        for (let i = 0; i < 170; i++) sand.step(f, { shake: 2.2, drift: 1 });
      }
      draw();
    };
    const tick = (now: number) => {
      raf = 0;
      if (!alive || !visible || !sand || document.hidden) return;
      const on = live.current.playing;
      // Playing: the note wavers a little, so the lines breathe and the sand keeps moving on them.
      const waver = on ? 1 + Math.sin(now / 900) * 0.012 : 1;
      sand.step(plate({ n: figure.n * waver, m: figure.m }, S), on ? { shake: 3.4, drift: 1.7 } : { shake: 2.2, drift: 1 });
      draw();
      if (on || now < until) raf = requestAnimationFrame(tick);
    };
    const wake = () => {
      if (reduced) return;
      until = Math.max(until, performance.now() + RING * 1000);
      if (!raf && alive) raf = requestAnimationFrame(tick);
    };
    live.current.wake = wake;
    live.current.strike = () => {
      if (reduced || !sand) return;
      sand.kick(S / 2, S / 2, S * 0.8, 4.2);
      wake();
    };

    const ro = new ResizeObserver(() => { measure(); wake(); });
    ro.observe(cv);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (!visible) return;
      // The first time it is seen, the sand is still loose and settles into the figure.
      if (!seen) { seen = true; measure(); }
      wake();
    }, { threshold: 0.2 });
    io.observe(el);
    const onVis = () => !document.hidden && live.current.playing && wake();
    document.addEventListener("visibilitychange", onVis);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [figure.n, figure.m, value, motion, theme]);

  useEffect(() => { live.current.wake(); }, [playing]);

  const toggle = () => {
    const next = !playing;
    if (controlled === undefined) setOwn(next);
    onPlayingChange?.(next);
    if (next) live.current.strike();
  };

  return (
    <article
      ref={root}
      className={`rsc rsc--${theme} ${className}`}
      data-playing={playing || undefined}
      aria-labelledby={`${id}-t`}
      onPointerEnter={(e) => { if (e.pointerType === "mouse") live.current.strike(); }}
    >
      <div className="rsc__plate">
        <canvas ref={canvas} className="rsc__sand" aria-hidden="true" />
      </div>
      <div className="rsc__body">
        <div className="rsc__text">
          <p className="rsc__value">{value.toLocaleString("en-GB")} {unit}<span className="rsc__state" aria-live="polite">{playing ? " · playing" : ""}</span></p>
          <h3 id={`${id}-t`} className="rsc__title">{title}</h3>
          {subtitle && <p className="rsc__sub">{subtitle}</p>}
        </div>
        <button type="button" className="rsc__play" aria-pressed={playing} aria-label={`${playing ? "Pause" : "Play"} ${title}`} onClick={toggle} onFocus={(e) => { if (e.currentTarget.matches(":focus-visible")) live.current.strike(); }}>
          <svg viewBox="0 0 20 20" aria-hidden="true">{playing ? <path d="M6 4.5h2.6v11H6zM11.4 4.5H14v11h-2.6z" /> : <path d="M6.5 4.2v11.6L16 10z" />}</svg>
        </button>
      </div>
    </article>
  );
}

export default ResonanceCard;
