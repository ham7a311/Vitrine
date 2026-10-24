"use client";
import { createContext, useCallback, useContext, useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { snapshot } from "./snapshot";
import { EFFECTS, play, type Transition } from "./transitions";
import "./theme-shift.css";

export type Theme = "light" | "dark";
export type { Transition };

type Shift = (next: Theme, from?: { x: number; y: number }) => void;
const ThemeContext = createContext<{ theme: Theme; shift: Shift } | null>(null);

/** The theme and a way to change it with the stage's transition, for controls inside a <ThemeStage>. */
export function useThemeShift() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useThemeShift must be used inside <ThemeStage>");
  return ctx;
}

export type ThemeStageProps = {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  /** How the old theme gives way to the new one. */
  transition?: Transition;
  motion?: "full" | "reduced";
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

/**
 * Theme Shift
 * Wraps a page (or a whole app) whose look follows data-theme. Switching the theme lays a still copy of the page,
 * in its old theme, over the live one, switches the live page underneath, and takes the copy away with the chosen
 * transition — so it works in every browser and stays inside its own box.
 */
export function ThemeStage({ theme, onThemeChange, transition = "bloom", motion = "full", className = "", style, children }: ThemeStageProps) {
  const stage = useRef<HTMLDivElement>(null);
  const page = useRef<HTMLDivElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const running = useRef<{ finish: () => void } | null>(null);

  const shift = useCallback<Shift>((next, from) => {
    // A switch during a transition finishes the one in flight first.
    running.current?.finish();
    const st = stage.current, pg = page.current, hs = host.current;
    const still = motion === "reduced" || matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!st || !pg || !hs || still) { onThemeChange(next); return; }
    const shot = snapshot(st, pg, hs);
    if (shot.box.w < 1 || shot.box.h < 1) { onThemeChange(next); return; }
    const r = st.getBoundingClientRect(), k = r.width / (st.offsetWidth || 1) || 1;
    const at = from ?? { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    const o = { x: (at.x - r.left) / k - shot.box.x, y: (at.y - r.top) / k - shot.box.y };
    // The live page switches before the next paint, so only the copy is ever seen in the old theme.
    flushSync(() => onThemeChange(next));
    running.current = play(EFFECTS[transition] ?? EFFECTS.bloom, { shot, o, w: shot.box.w, h: shot.box.h }, () => { running.current = null; });
  }, [onThemeChange, transition, motion]);

  useEffect(() => () => running.current?.finish(), [transition]);

  return (
    <ThemeContext.Provider value={{ theme, shift }}>
      <div ref={stage} className={`tsw-stage ${className}`} style={style}>
        <div ref={page} className="tsw-page" data-theme={theme}>{children}</div>
        <div ref={host} className="tsw-host" aria-hidden="true" />
      </div>
    </ThemeContext.Provider>
  );
}

const RAYS = Array.from({ length: 8 }, (_, i) => (i / 8) * Math.PI * 2);

/** A sun that turns into a crescent moon. It switches the stage's theme, and the transition starts from it. */
export function ThemeSwitch({ label = "Dark theme", className = "" }: { label?: string; className?: string }) {
  const { theme, shift } = useThemeShift();
  const dark = theme === "dark";
  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label={label}
      className={`tsw-switch ${dark ? "is-dark" : ""} ${className}`}
      onClick={(e) => {
        const b = e.currentTarget.getBoundingClientRect();
        shift(dark ? "light" : "dark", { x: b.left + b.width / 2, y: b.top + b.height / 2 });
      }}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <g className="tsw-switch__rays">
          {RAYS.map((a) => (
            <line key={a} x1={12 + Math.cos(a) * 8} y1={12 + Math.sin(a) * 8} x2={12 + Math.cos(a) * 10.2} y2={12 + Math.sin(a) * 10.2} />
          ))}
        </g>
        <circle className="tsw-switch__body" cx="12" cy="12" r="4.6" />
        {/* The bite that makes the moon: a disc in the switch's own background colour. */}
        <circle className="tsw-switch__bite" cx="12" cy="12" r="5.2" />
      </svg>
    </button>
  );
}

export default ThemeStage;
