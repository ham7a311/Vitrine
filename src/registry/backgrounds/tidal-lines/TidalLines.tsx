import type { CSSProperties, ReactNode } from "react";
import "./tidal-lines.css";

/**
 * Tidal Lines
 * Two bands of layered waveforms — each line a sum of five sines — drifting
 * sideways at different speeds and directions, like a quiet oscilloscope or
 * a tide chart breathing. Pure SVG + CSS; no JavaScript animation.
 */

type Layer = { id: number; midY: number; amplitude: number; phase: number; opacity: number; duration: number };

const WIDTH = 1200;
const HEIGHT = 400;

const UPPER: Layer[] = [
  { id: 1, midY: 168, amplitude: 26, phase: 1.15, opacity: 0.14, duration: 42 },
  { id: 2, midY: 208, amplitude: 18, phase: 2.65, opacity: 0.11, duration: 56 },
  { id: 3, midY: 248, amplitude: 13, phase: 4.2, opacity: 0.09, duration: 68 },
];
const LOWER: Layer[] = [
  { id: 1, midY: 154, amplitude: 22, phase: 6.35, opacity: 0.13, duration: 49 },
  { id: 2, midY: 198, amplitude: 16, phase: 7.9, opacity: 0.1, duration: 61 },
  { id: 3, midY: 242, amplitude: 12, phase: 9.45, opacity: 0.08, duration: 74 },
];

function waveY(x: number, midY: number, a: number, p: number) {
  return (
    midY +
    Math.sin(x * 0.017 + p) * a * 0.42 +
    Math.sin(x * 0.029 + p * 1.35) * a * 0.31 +
    Math.sin(x * 0.048 + p * 2.15) * a * 0.22 +
    Math.sin(x * 0.0085 + p * 0.65) * a * 0.28 +
    Math.sin(x * 0.063 + p * 3.1) * a * 0.12
  );
}

function wavePath(midY: number, amplitude: number, phase: number, segments = 140) {
  const step = WIDTH / segments;
  let d = "";
  for (let i = 0; i <= segments; i++) {
    const x = i * step;
    d += `${i ? " L" : "M"} ${x.toFixed(2)} ${waveY(x, midY, amplitude, phase).toFixed(2)}`;
  }
  return d;
}

function Band({ layers, position, reverseEven }: { layers: Layer[]; position: "upper" | "lower"; reverseEven?: boolean }) {
  return (
    <div className={`tidal__band tidal__band--${position}`}>
      <svg className="tidal__svg" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="none">
        {layers.map(({ id, midY, amplitude, phase, opacity, duration }) => {
          const d = wavePath(midY, amplitude, phase);
          const reverse = (reverseEven && id % 2 === 0) || (position === "upper" && id === 2);
          return (
            <g
              key={id}
              className={`tidal__track${reverse ? " tidal__track--reverse" : ""}`}
              style={{ "--tidal-opacity": opacity, "--tidal-duration": `${duration}s` } as CSSProperties}
            >
              <path className="tidal__path" d={d} />
              <path className="tidal__path tidal__path--copy" d={d} transform={`translate(${WIDTH} 0)`} />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function TidalLines({ color = "#86efac", background = "#000", className = "", children }: { color?: string; background?: string; className?: string; children?: ReactNode }) {
  return (
    <div className={`tidal ${className}`} style={{ "--tidal-color": color, background } as CSSProperties}>
      <div className="tidal__field" aria-hidden="true">
        <Band layers={UPPER} position="upper" />
        <Band layers={LOWER} position="lower" reverseEven />
      </div>
      {children && <div className="tidal__content">{children}</div>}
    </div>
  );
}
