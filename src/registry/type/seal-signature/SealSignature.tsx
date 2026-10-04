import { useId, type CSSProperties } from "react";
import "./seal-signature.css";

/**
 * Seal Signature
 * A name as a heraldic seal: the given name in italic serif at the centre,
 * the full name and a number repeating on a slowly rotating ring, inside a
 * crown of sixteen palmettes. Geometry and styling are the OCS team-page seal.
 */

type Props = {
  name: string;
  /** Chapter number shown on the ring. */
  number?: string;
  color?: string;
  /** Seconds per full rotation. */
  speed?: number;
  /** Negative delay so several seals never turn in step. */
  offset?: number;
  className?: string;
};

const R = 108;
const LEN = 2 * Math.PI * R;
const CLIP_OUTER = 117;
const CLIP_INNER = 99;

const palmetteTransform = (i: number) =>
  `rotate(${i * 22.5} 140 140) translate(140 140) scale(${i % 2 === 1 ? 0.82 : 1}) translate(-140 -140)`;

function PalmetteMass() {
  return (
    <g>
      <path className="seal-signature__leaflet" d="M126 24 C134 12 146 12 154 24 C148 34 132 34 126 24 Z" />
      <path className="seal-signature__leaf" d="M140 22 C129 8 126 -10 140 -38 C154 -10 151 8 140 22 Z" />
      <path className="seal-signature__leaf" d="M134 20 C114 6 96 12 99 28 C102 40 118 36 128 22 C118 10 126 10 134 20 Z" />
      <path className="seal-signature__leaf" d="M146 20 C166 6 184 12 181 28 C178 40 162 36 152 22 C162 10 154 10 146 20 Z" />
      <path className="seal-signature__leaf" d="M122 8 C106 -8 90 -8 90 8 C91 20 106 16 116 6 C112 -2 116 0 122 8 Z" />
      <path className="seal-signature__leaf" d="M158 8 C174 -8 190 -8 190 8 C189 20 174 16 164 6 C168 -2 164 0 158 8 Z" />
    </g>
  );
}

function PalmetteRidge() {
  return (
    <g>
      <path className="seal-signature__ridge" d="M140 20 C140 4 140 -16 140 -34" />
      <path className="seal-signature__ridge" d="M132 14 C116 2 104 14 110 28" />
      <path className="seal-signature__ridge" d="M148 14 C164 2 176 14 170 28" />
      <path className="seal-signature__ridge" d="M124 6 C110 -8 98 -6 100 8" />
      <path className="seal-signature__ridge" d="M156 6 C170 -8 182 -6 180 8" />
    </g>
  );
}

function Ticks() {
  return (
    <g className="seal-signature__ticks">
      {Array.from({ length: 8 }, (_, i) => {
        const a = ((22.5 + i * 45) * Math.PI) / 180;
        return <line key={i} x1={140 + 90 * Math.sin(a)} y1={140 - 90 * Math.cos(a)} x2={140 + 97 * Math.sin(a)} y2={140 - 97 * Math.cos(a)} />;
      })}
    </g>
  );
}

export function SealSignature({ name, number = "01", color = "#5C7CFA", speed = 40, offset = 0, className = "" }: Props) {
  const uid = useId().replace(/:/g, "");
  const parts = name.split(/\s+/).filter(Boolean);
  // "Al Bulushi" style particles stay with the surname; otherwise the first word is the given name.
  const given = parts[0] === "Al" && parts[1] ? `${parts[0]} ${parts[1]}` : (parts[0] ?? name);
  const givenParts = given.split(/\s+/);
  const legend = `${name}  ·  ${number}  ·  `.repeat(3);
  const path = `M 140 ${140 - R} a ${R} ${R} 0 1 1 0 ${R * 2} a ${R} ${R} 0 1 1 0 -${R * 2}`;
  const style = { "--seal-color": color, "--seal-speed": `${speed}s`, "--seal-delay": `${-offset}s` } as CSSProperties;

  return (
    <figure className={`seal-signature ${className}`} style={style}>
      <svg className="seal-signature__svg" viewBox="0 0 280 280" role="img" aria-label={`${name}, seal ${number}`}>
        <defs>
          <clipPath id={`${uid}-clip`}>
            <path
              fillRule="evenodd"
              d={`M 140 ${140 - CLIP_OUTER} a ${CLIP_OUTER} ${CLIP_OUTER} 0 1 1 0 ${CLIP_OUTER * 2} a ${CLIP_OUTER} ${CLIP_OUTER} 0 1 1 0 -${CLIP_OUTER * 2} M 140 ${140 - CLIP_INNER} a ${CLIP_INNER} ${CLIP_INNER} 0 1 0 0 ${CLIP_INNER * 2} a ${CLIP_INNER} ${CLIP_INNER} 0 1 0 0 -${CLIP_INNER * 2}`}
            />
          </clipPath>
        </defs>
        {Array.from({ length: 16 }, (_, i) => (
          <g key={`leaf-${i}`} className={i % 2 === 1 ? "seal-signature__minor" : "seal-signature__major"} transform={palmetteTransform(i)}>
            <PalmetteMass />
          </g>
        ))}
        {Array.from({ length: 16 }, (_, i) => (
          <g key={`ridge-${i}`} className={i % 2 === 1 ? "seal-signature__minor" : "seal-signature__major"} transform={palmetteTransform(i)}>
            <PalmetteRidge />
          </g>
        ))}
        <circle className="seal-signature__ring" cx="140" cy="140" r="128" fill="none" />
        <g className="seal-signature__spin" clipPath={`url(#${uid}-clip)`}>
          <path id={`${uid}-path`} d={path} fill="none" />
          <text className="seal-signature__legend">
            <textPath href={`#${uid}-path`} textLength={LEN} lengthAdjust="spacing">
              {legend}
            </textPath>
          </text>
        </g>
        <circle className="seal-signature__ring-inner" cx="140" cy="140" r="94" fill="none" />
        <Ticks />
        <text className="seal-signature__given" x="140" y="140" textAnchor="middle">
          {givenParts.length > 1 ? (
            <>
              <tspan x="140" dy="-0.48em">{givenParts[0]}</tspan>
              <tspan x="140" dy="1.08em">{givenParts.slice(1).join(" ")}</tspan>
            </>
          ) : (
            <tspan x="140" dy="0.35em">{given}</tspan>
          )}
        </text>
      </svg>
    </figure>
  );
}
