"use client";

import { useEffect, useRef, type HTMLAttributes, type ReactNode } from "react";
import { attachPrism, type PrismPalette } from "../../buttons/prism-glass-button/prism";
import "./prism-glass-pane.css";

/**
 * Prism Glass Pane
 * A hero-sized white background whose edges are a slab of clear glass. The face is plain white; only the
 * border is designed: a thick polished rim that, at two opposite corners, splits ink into colours. Animated,
 * those two fringes travel round the edge of the hero at a steady pace. Nothing follows the pointer.
 */

type Props = HTMLAttributes<HTMLDivElement> & {
  /** Optional content, above the white face. */
  children?: ReactNode;
  palette?: PrismPalette;
  /** "still" draws one settled frame and never moves. */
  motion?: "full" | "still";
  /** Seconds for the fringes to go once round the edge. */
  lap?: number;
  /** "outer": keep only the outer edge line. "none": no edge lines at all. */
  lines?: "full" | "outer" | "none";
  /** "inset" sets the glass a little way in from the hero's edge; "flush" makes the hero's own edge the glass. */
  edge?: "inset" | "flush";
};

export function PrismGlassPane({ children, palette = "spectrum", motion = "full", lap = 9, lines = "full", edge = "inset", className = "", ...rest }: Props) {
  const pane = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = pane.current!;
    const glass = attachPrism(host, canvas.current!, {
      dark: false,
      palette,
      still: motion === "still",
      lap,
      lines,
      flat: true,
      shape: (w, h) => {
        const m = Math.min(w, h);
        return { radius: edge === "flush" ? 0 : Math.min(64, m * 0.11), rim: Math.max(8, Math.min(14, m * 0.022)), depth: Math.min(92, m * 0.14), margin: Math.max(4, host.offsetTop) };
      },
    });
    return () => glass?.destroy();
  }, [palette, motion, lap, edge, lines]);

  return (
    <div className={`prismp prismp--${edge} ${className}`} {...rest}>
      <div ref={pane} className="prismp__pane" aria-hidden="true">
        <canvas ref={canvas} className="prismp__glass" />
      </div>
      {children && <div className="prismp__content">{children}</div>}
    </div>
  );
}

export default PrismGlassPane;
