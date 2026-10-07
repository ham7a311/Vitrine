"use client";

import { useId, type CSSProperties, type ReactNode } from "react";
import { bellPath } from "./bell";
import "./conduit-card.css";

/**
 * Conduit Card
 * A square card set in the path of a beam of light: it pours down from above, spreads across the
 * card's top edge, and runs out of the bottom to the floor, while circuit traces carry pulses in
 * from either side. The card itself is deep colour with a fine hatch, a striped mark and a numbered
 * title.
 */

export type ConduitTone = { card: [string, string]; halo: string; trace: string; ink: string; muted: string; page: string };

type Props = {
  index?: string;
  title?: ReactNode;
  children?: ReactNode;
  tone?: ConduitTone;
  className?: string;
  style?: CSSProperties;
};

const VIOLET: ConduitTone = { card: ["#3524ab", "#2a1d88"], halo: "#7c5cff", trace: "#3f33b8", ink: "#ece8ff", muted: "#a198e6", page: "#07071a" };

// Circuit traces in the scene's 1200 × 900 frame; each runs from a side edge into the card.
const TRACES = [
  "M0 323H244L292 362L330 392H375",
  "M0 400H168L196 378H262L292 362",
  "M0 426H196L222 405H330L352 392",
  "M0 505H170L232 452H330L375 430",
  "M1200 322H1035L960 380H825",
  "M1200 345H1062L1000 400H905L880 380",
  "M1200 405H1030L1000 430H825",
  "M1200 430H985L915 470L955 505H1200",
];

// A few fixed stars so every render matches.
const STARS = [
  [140, 120, 1.1], [262, 610, 0.8], [318, 760, 1], [455, 92, 0.9], [520, 186, 1.2], [690, 150, 0.8], [742, 92, 1],
  [812, 700, 0.9], [900, 168, 1.1], [1010, 640, 0.8], [1090, 230, 1], [565, 735, 0.9], [640, 790, 1.2], [205, 250, 0.8],
] as const;

const TOP = { core: bellPath(602, -10, 214, 2, 420, 5), mid: bellPath(602, -10, 214, 6, 1250, 6), halo: bellPath(602, -10, 214, 18, 1500, 7) };
const BOTTOM = { core: bellPath(602, 910, 656, 2, 420, 5), mid: bellPath(602, 910, 656, 6, 1250, 6), halo: bellPath(602, 910, 656, 18, 1500, 7) };

function Mark() {
  const id = useId();
  return (
    <svg className="cndc__mark" viewBox="0 0 100 130" aria-hidden="true">
      <defs>
        <pattern id={`${id}-h`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(-38)">
          <rect width="2.2" height="6" fill="currentColor" />
        </pattern>
      </defs>
      {/* an original mark: a split bolt, two hatched shards offset like a spark */}
      <path d="M58 2 18 70h26L30 128l52-76H56Z" fill={`url(#${id}-h)`} />
    </svg>
  );
}

export function ConduitCard({
  index = "01",
  title = "Quick–fire settlements",
  children = "Move money between accounts in seconds, with every transfer checked, signed and settled before you blink.",
  tone = VIOLET,
  className = "",
  style,
}: Props) {
  const id = useId();
  const beams = (b: typeof TOP, k: string) => (
    <g className={`cndc__beam cndc__beam--${k}`}>
      <path d={b.halo} fill={tone.halo} filter={`url(#${id}-b20)`} opacity="0.85" />
      <path d={b.mid} style={{ fill: "var(--cndc-mid)" }} filter={`url(#${id}-b6)`} opacity="0.9" />
      <path d={b.core} fill="#fff" filter={`url(#${id}-b1)`} />
    </g>
  );
  return (
    <div
      className={`cndc ${className}`}
      style={{
        ["--cndc-a" as string]: tone.card[0],
        ["--cndc-b" as string]: tone.card[1],
        ["--cndc-halo" as string]: tone.halo,
        ["--cndc-mid" as string]: `color-mix(in srgb, ${tone.halo}, #fff 45%)`,
        ["--cndc-ink" as string]: tone.ink,
        ["--cndc-muted" as string]: tone.muted,
        ["--cndc-page" as string]: tone.page,
        ...style,
      }}
    >
      <div className="cndc__scene">
        <svg className="cndc__fx" viewBox="0 0 1200 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <filter id={`${id}-b20`} x="-80%" y="-40%" width="260%" height="180%"><feGaussianBlur stdDeviation="30" /></filter>
            <filter id={`${id}-b60`} x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="60" /></filter>
            <filter id={`${id}-b6`} x="-50%" y="-20%" width="200%" height="140%"><feGaussianBlur stdDeviation="6" /></filter>
            <filter id={`${id}-b1`} x="-50%" y="-20%" width="200%" height="140%"><feGaussianBlur stdDeviation="1.4" /></filter>
            <radialGradient id={`${id}-room`} cx="50%" cy="50%" r="60%">
              <stop offset="0" stopColor={tone.halo} stopOpacity="0.16" />
              <stop offset="1" stopColor={tone.halo} stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="1200" height="900" fill={`url(#${id}-room)`} />
          {/* broad blooms where the beam strikes the card */}
          <ellipse className="cndc__bloom" cx="602" cy="210" rx="230" ry="70" fill={tone.halo} filter={`url(#${id}-b60)`} />
          <ellipse className="cndc__bloom" cx="602" cy="672" rx="260" ry="110" fill={tone.halo} filter={`url(#${id}-b60)`} />
          {STARS.map(([x, y, r], i) => (
            <circle key={i} className="cndc__star" cx={x} cy={y} r={r} style={{ animationDelay: `${-i * 0.7}s` }} />
          ))}
          <g className="cndc__traces" stroke={tone.trace}>
            {TRACES.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </g>
          <g className="cndc__pulses">
            {TRACES.map((d, i) => (
              <path key={i} d={d} pathLength={1000} style={{ animationDelay: `${-i * 0.9}s` }} />
            ))}
          </g>
          {beams(TOP, "top")}
          {beams(BOTTOM, "bottom")}
        </svg>

        <article className="cndc__card">
          <span className="cndc__rim" aria-hidden="true" />
          <span className="cndc__rim cndc__rim--glow" aria-hidden="true" />
          <Mark />
          <div className="cndc__body">
            <span className="cndc__index">{index}</span>
            <h3 className="cndc__title">{title}</h3>
            <p className="cndc__text">{children}</p>
          </div>
        </article>
      </div>
    </div>
  );
}
