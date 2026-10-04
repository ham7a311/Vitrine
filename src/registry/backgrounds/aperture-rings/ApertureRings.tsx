import type { CSSProperties, ReactNode } from "react";
import "./aperture-rings.css";

/**
 * Aperture Rings
 * Concentric rings of dashes and ticks, like a camera lens barrel or a watch
 * bezel, each ring turning at its own slow speed and direction. A soft light
 * sits behind them. Pure CSS — no canvas, no JavaScript.
 */

type Props = {
  color?: string;
  background?: string;
  rings?: number;
  className?: string;
  children?: ReactNode;
};

export function ApertureRings({ color = "#b9cce4", background = "#08070c", rings = 7, className = "", children }: Props) {
  return (
    <div className={`apr ${className}`} style={{ "--apr-color": color, "--apr-bg": background } as CSSProperties}>
      <div className="apr__scene" aria-hidden="true">
        <div className="apr__glow" />
        {Array.from({ length: rings }, (_, i) => (
          <div
            key={i}
            className={`apr__ring apr__ring--${i % 4}`}
            style={{
              "--r": 18 + i * 11,
              "--dur": `${70 + i * 34}s`,
              "--dir": i % 2 ? 1 : -1,
              "--a": Math.max(0.1, 0.5 - i * 0.05),
            } as CSSProperties}
          />
        ))}
        <div className="apr__core" />
      </div>
      {children && <div className="apr__content">{children}</div>}
    </div>
  );
}
