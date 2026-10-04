import type { CSSProperties } from "react";
import "./pulse-loader.css";

/**
 * Pulse Loader
 * A loading indicator drawn as a heartbeat trace. The full trace sits faintly
 * in the background; a bright, glowing dash travels along it, spiking as it
 * crosses the beat. Calm and a little alive — "working on it", not "waiting".
 */

type Props = {
  label?: string;
  size?: "sm" | "md" | "lg";
  color?: string;
};

const TRACE = "M0 20 H14 Q18 13 22 20 H28 L31 25 L37 3 L43 36 L47 20 H57 Q63 10 69 20 H100";

export function PulseLoader({ label = "Loading", size = "md", color = "#b9cce4" }: Props) {
  return (
    <span className={`pl pl--${size}`} role="status" style={{ "--pl-color": color } as CSSProperties}>
      <svg className="pl__svg" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
        <path className="pl__ghost" d={TRACE} pathLength={1} />
        <path className="pl__line" d={TRACE} pathLength={1} />
      </svg>
      <span className="pl__label">{label}</span>
    </span>
  );
}
