import type { CSSProperties, ReactNode } from "react";
import "./halo-frame.css";

/**
 * Halo Frame
 * A 1px frame with a comet of light orbiting its edge — a bright amber head
 * and a fainter counter-light chasing it from the opposite side.
 */

type Props = {
  children: ReactNode;
  /** Seconds per orbit. */
  speed?: number;
  /** Colours of the orbiting light: [edge, head, core]. */
  colors?: [string, string, string];
  className?: string;
};

export function HaloFrame({ children, speed = 7, colors, className = "" }: Props) {
  const style = {
    "--halo-speed": `${speed}s`,
    ...(colors ? { "--halo-a": colors[0], "--halo-b": colors[1], "--halo-c": colors[2] } : {}),
  } as CSSProperties;

  return (
    <div className={`halo-frame ${className}`} style={style}>
      {children}
    </div>
  );
}

/** The quote card the frame was designed around. */
export function HaloQuote({ kicker, children }: { kicker: string; children: ReactNode }) {
  return (
    <HaloFrame>
      <blockquote className="halo-quote">
        <p className="halo-quote__kicker">{kicker}</p>
        <p className="halo-quote__text">{children}</p>
      </blockquote>
    </HaloFrame>
  );
}
