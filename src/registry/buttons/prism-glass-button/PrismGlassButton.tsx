"use client";

import { useEffect, useRef, type ButtonHTMLAttributes, type CSSProperties, type ReactNode } from "react";
import { attachPrism, type PrismPalette } from "./prism";
import "./prism-glass-button.css";

/**
 * Prism Glass Button
 * A button cut from a slab of clear glass. Its thick edge is a lens: at two opposite corners it shows ink
 * split into colours, one outside, a solid core, another within. Animated, those two fringes travel round
 * the rim at a steady pace; nothing else moves, and nothing follows the pointer.
 */

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: ReactNode;
  /** The page it sits on: light glass for a pale ground, dark glass for a black one. */
  theme?: "light" | "dark";
  palette?: PrismPalette;
  shape?: "pill" | "tile";
  /** The pill's height, or the tile's side, in pixels. */
  size?: number;
  /** "still" draws one settled frame and never moves. */
  motion?: "full" | "still";
  /** Seconds for the fringes to go once round the rim. */
  lap?: number;
  /** "none": the same glass without its edge lines. */
  lines?: "full" | "none";
};

export function PrismGlassButton({ children, theme = "light", palette = "spectrum", shape = "pill", size = shape === "tile" ? 96 : 64, motion = "full", lap = 6, lines = "full", className = "", style, ...rest }: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const glass = attachPrism(ref.current!, canvas.current!, {
      dark: theme === "dark",
      palette,
      still: motion === "still",
      lap,
      lines,
      // Black glass on black with no lines would vanish: a faint face and glow keep its shape.
      face: theme === "dark" && lines === "none" ? 0.075 : 0,
      shape: (w, h) => {
        const m = Math.min(w, h);
        return { radius: m * (shape === "tile" ? 0.27 : 0.42), rim: m * 0.062, depth: m * (shape === "tile" ? 0.24 : 0.3), margin: Math.round(m * 0.34) };
      },
    });
    return () => glass?.destroy();
  }, [theme, palette, shape, motion, lap, lines]);

  return (
    <button ref={ref} type="button" className={`prismb prismb--${theme} prismb--${shape} ${className}`} style={{ ["--prismb-size" as string]: `${size}px`, ...style } as CSSProperties} {...rest}>
      <canvas ref={canvas} className="prismb__glass" aria-hidden="true" />
      <span className="prismb__label">{children}</span>
    </button>
  );
}

export default PrismGlassButton;
