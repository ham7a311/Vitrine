"use client";

import { useMemo, type CSSProperties, type HTMLAttributes, type ReactNode } from "react";
import "./paper-strata.css";

/**
 * Paper Strata
 * Layers of cut paper, stacked like hills, each casting a soft shadow on the one behind. They drift sideways
 * at different speeds and shift a little with the pointer, so the stack has depth. The top of the section is
 * flat colour: an obvious place for a headline.
 */

type Palette = "clay" | "tide" | "ink";
type Props = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  palette?: Palette;
  /** How many sheets, 3 to 7. */
  layers?: number;
  /** Where the hills begin, as a share of the height from the top. */
  horizon?: number;
  motion?: "full" | "still";
};

/** The backdrop, then the sheets from the farthest to the nearest. */
const PALETTES: Record<Palette, string[]> = {
  clay: ["#f4e9db", "#efd3b6", "#e6b48c", "#d98f63", "#c56c41", "#a34d2c", "#7a321d", "#55200f"],
  tide: ["#eaf2f1", "#cfe3e2", "#a9cdd0", "#7fb1ba", "#5592a2", "#357285", "#1f5367", "#123848"],
  ink: ["#1d1e22", "#2a2b31", "#24252a", "#1e1f24", "#18191d", "#131417", "#0e0f11", "#09090b"],
};

const W = 1000, H = 600;
/** One sheet's top edge: three sines that repeat every W units, so two copies side by side loop without a seam. */
export function ridge(seed: number, base: number, amp: number) {
  const p = [seed * 2.399, seed * 4.211 + 1, seed * 7.13 + 2];
  let d = `M0 ${H}`;
  for (let x = 0; x <= W * 2; x += 20) {
    const a = (x / W) * Math.PI * 2;
    const y = base + amp * (Math.sin(a + p[0]) * 0.56 + Math.sin(a * 2 + p[1]) * 0.29 + Math.sin(a * 3 + p[2]) * 0.15);
    d += ` L${x} ${y.toFixed(1)}`;
  }
  return `${d} L${W * 2} ${H} Z`;
}

export function PaperStrata({ children, palette = "clay", layers = 6, horizon = 0.46, motion = "full", className = "", style, onPointerMove, onPointerLeave, ...rest }: Props) {
  const count = Math.max(3, Math.min(7, Math.round(layers)));
  const colours = PALETTES[palette];
  const sheets = useMemo(() => Array.from({ length: count }, (_, i) => {
    const depth = i / (count - 1);
    return { d: ridge(i + 1, H * (horizon + (0.9 - horizon) * depth), 62 - depth * 30), depth };
  }), [count, horizon]);

  return (
    <div
      className={`strata strata--${palette} ${motion === "still" ? "strata--still" : ""} ${className}`}
      style={{ ["--strata-ground" as string]: colours[0], ...style } as CSSProperties}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--strata-x", String(((e.clientX - r.left) / r.width) * 2 - 1));
        e.currentTarget.style.setProperty("--strata-y", String(((e.clientY - r.top) / r.height) * 2 - 1));
        onPointerMove?.(e);
      }}
      onPointerLeave={(e) => { e.currentTarget.style.setProperty("--strata-x", "0"); e.currentTarget.style.setProperty("--strata-y", "0"); onPointerLeave?.(e); }}
      {...rest}
    >
      <div className="strata__stack" aria-hidden="true">
        {sheets.map((s, i) => (
          <div key={i} className="strata__sheet" style={{ ["--depth" as string]: s.depth.toFixed(3) } as CSSProperties}>
            {/* Nearer sheets move faster; alternate sheets move the other way. */}
            <svg viewBox={`0 0 ${W * 2} ${H}`} preserveAspectRatio="none" style={{ animationDuration: `${190 - s.depth * 90}s`, animationDirection: i % 2 ? "reverse" : "normal", animationDelay: `${-i * 23}s` }}>
              <path d={s.d} fill={colours[Math.min(colours.length - 1, 1 + Math.round((i / (count - 1)) * (colours.length - 2)))]} />
            </svg>
          </div>
        ))}
      </div>
      {children && <div className="strata__content">{children}</div>}
    </div>
  );
}

export default PaperStrata;
