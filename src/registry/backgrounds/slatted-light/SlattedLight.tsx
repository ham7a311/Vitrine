import type { CSSProperties, ReactNode } from "react";
import "./slatted-light.css";

/**
 * Slatted Light
 * Late light through window slats: angled volumetric shafts cross a dark room,
 * swaying as if the blinds breathe, while their pattern lands on the floor and
 * a few motes of dust drift through the beams. Pure CSS.
 */

type Props = {
  /** Colour of the light. */
  light?: string;
  /** Colour of the room. */
  room?: string;
  /** Angle of the beams in degrees. */
  angle?: number;
  className?: string;
  children?: ReactNode;
};

// Hand-placed so the motes sit inside the beams: [left %, top %, size px, duration s, delay s]
const MOTES: [number, number, number, number, number][] = [
  [18, 30, 2, 17, -3], [26, 52, 1.5, 21, -11], [34, 22, 2.5, 19, -6], [41, 64, 1.5, 23, -15],
  [47, 38, 2, 18, -9], [55, 58, 1.5, 25, -2], [61, 28, 2, 20, -13], [68, 47, 2.5, 22, -7],
  [74, 69, 1.5, 19, -17], [30, 76, 2, 24, -4], [52, 80, 1.5, 21, -12], [22, 44, 1.5, 26, -19],
];

export function SlattedLight({ light = "#f1e3c8", room = "#0b080d", angle = 24, className = "", children }: Props) {
  return (
    <div className={`slat ${className}`} style={{ "--slat-light": light, "--slat-room": room, "--slat-angle": `${angle}deg` } as CSSProperties}>
      <div className="slat__scene" aria-hidden="true">
        <div className="slat__window" />
        <div className="slat__beams" />
        <div className="slat__beams slat__beams--soft" />
        <div className="slat__floor" />
        <div className="slat__motes">
          {MOTES.map(([x, y, s, d, delay], i) => (
            <span key={i} style={{ left: `${x}%`, top: `${y}%`, width: s, height: s, animationDuration: `${d}s, ${d / 3}s`, animationDelay: `${delay}s, ${delay / 2}s` }} />
          ))}
        </div>
        <div className="slat__grain" />
      </div>
      {children && <div className="slat__content">{children}</div>}
    </div>
  );
}
