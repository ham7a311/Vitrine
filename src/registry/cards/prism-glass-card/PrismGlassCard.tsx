"use client";

import { useEffect, useRef, type HTMLAttributes, type ReactNode } from "react";
import { attachPrism, type PrismPalette } from "../../buttons/prism-glass-button/prism";
import "./prism-glass-card.css";

/**
 * Prism Glass Card
 * A card cut from a slab of clear glass. The face stays clear for the content; the thick edge is a lens, and
 * at two opposite corners it shows ink split into colours. Animated, those two fringes travel round the rim
 * at a steady pace; nothing else moves, and nothing follows the pointer.
 */

type Props = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  /** The page it sits on: light glass for a pale ground, dark glass for a black one. */
  theme?: "light" | "dark";
  palette?: PrismPalette;
  /** "still" draws one settled frame and never moves. */
  motion?: "full" | "still";
  /** Seconds for the fringes to go once round the rim. */
  lap?: number;
  /** "none" (the default): no edge lines. "full": the rim band, outer edge and inner bevel are drawn. */
  lines?: "full" | "none";
};

export function PrismGlassCard({ children, theme = "light", palette = "spectrum", motion = "full", lap = 7, lines = "none", className = "", ...rest }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const glass = attachPrism(ref.current!, canvas.current!, {
      dark: theme === "dark",
      palette,
      still: motion === "still",
      lap,
      lines,
      shape: (w, h) => {
        const m = Math.min(w, h);
        return { radius: Math.min(44, m * 0.16), rim: Math.min(11, m * 0.036), depth: Math.min(36, m * 0.12), margin: Math.round(Math.min(48, m * 0.16)) };
      },
    });
    return () => glass?.destroy();
  }, [theme, palette, motion, lap, lines]);

  return (
    <div ref={ref} className={`prismc prismc--${theme} ${className}`} {...rest}>
      <canvas ref={canvas} className="prismc__glass" aria-hidden="true" />
      <div className="prismc__body">{children}</div>
    </div>
  );
}

export default PrismGlassCard;
