/**
 * One camera, drawn two ways from the same geometry: a colour render and an "inside" render
 * (x-ray, night vision or blueprint). Because both share every coordinate, the halves of an
 * image comparison line up exactly.
 */

export type InsideStyle = "xray" | "night" | "blueprint";

const INK: Record<InsideStyle, { bg: string; line: string; glow: string; soft: string; grid?: string }> = {
  xray: { bg: "#03070f", line: "#dff1ff", glow: "#6fb6ff", soft: "rgb(140 200 255 / 0.22)" },
  night: { bg: "#020a03", line: "#c6ffb8", glow: "#39ff6a", soft: "rgb(80 255 120 / 0.2)" },
  blueprint: { bg: "#123d7a", line: "#e9f2ff", glow: "#e9f2ff", soft: "rgb(233 242 255 / 0.14)", grid: "rgb(233 242 255 / 0.12)" },
};

// Shared geometry (viewBox 0 0 800 500).
const BODY = "M150 170 Q150 140 180 140 L300 140 L330 110 L470 110 L500 140 L620 140 Q650 140 650 170 L650 390 Q650 420 620 420 L180 420 Q150 420 150 390 Z";

export function ColourCamera() {
  return (
    <svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true" style={{ display: "block", width: "100%", height: "100%" }}>
      <defs>
        <linearGradient id="cc-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f3d9b8" /><stop offset="1" stopColor="#e3a77c" /></linearGradient>
        <linearGradient id="cc-top" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f4f4f2" /><stop offset="1" stopColor="#b9bcc0" /></linearGradient>
        <linearGradient id="cc-leather" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2b2a2d" /><stop offset="1" stopColor="#141316" /></linearGradient>
        <radialGradient id="cc-glass" cx="0.38" cy="0.32" r="0.75"><stop offset="0" stopColor="#7fb7d8" /><stop offset="0.35" stopColor="#24456a" /><stop offset="0.8" stopColor="#0a1324" /><stop offset="1" stopColor="#050810" /></radialGradient>
        <linearGradient id="cc-ring" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#e9eaec" /><stop offset="0.5" stopColor="#8b8e93" /><stop offset="1" stopColor="#3d3f43" /></linearGradient>
        <pattern id="cc-grain" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="0.7" fill="#000" opacity="0.25" /><circle cx="4.5" cy="4.2" r="0.6" fill="#fff" opacity="0.05" /></pattern>
      </defs>
      <rect width="800" height="500" fill="url(#cc-bg)" />
      <ellipse cx="400" cy="440" rx="290" ry="22" fill="#7a3f22" opacity="0.28" />
      <path d={BODY} fill="url(#cc-top)" />
      <rect x="150" y="215" width="500" height="170" fill="url(#cc-leather)" />
      <rect x="150" y="215" width="500" height="170" fill="url(#cc-grain)" />
      <path d="M150 385 L650 385 L650 390 Q650 420 620 420 L180 420 Q150 420 150 390 Z" fill="#9ea2a7" />
      <rect x="345" y="122" width="110" height="40" rx="6" fill="#1b1b1e" />
      <rect x="352" y="129" width="96" height="26" rx="3" fill="#2f4d63" opacity="0.9" />
      <circle cx="560" cy="122" r="22" fill="url(#cc-ring)" /><circle cx="560" cy="122" r="14" fill="#c9ccd0" />
      <rect x="196" y="116" width="58" height="24" rx="5" fill="url(#cc-ring)" />
      <circle cx="610" cy="118" r="11" fill="#d23a2c" /><circle cx="607" cy="115" r="4" fill="#ff8a7c" opacity="0.8" />
      <circle cx="400" cy="300" r="118" fill="url(#cc-ring)" />
      <circle cx="400" cy="300" r="104" fill="#1a1a1d" />
      {Array.from({ length: 48 }, (_, i) => {
        const a = (i / 48) * Math.PI * 2;
        return <line key={i} x1={400 + Math.cos(a) * 98} y1={300 + Math.sin(a) * 98} x2={400 + Math.cos(a) * 104} y2={300 + Math.sin(a) * 104} stroke="#5a5c60" strokeWidth="2" />;
      })}
      <circle cx="400" cy="300" r="86" fill="url(#cc-ring)" />
      <circle cx="400" cy="300" r="74" fill="url(#cc-glass)" />
      <circle cx="400" cy="300" r="40" fill="#060a14" />
      <ellipse cx="372" cy="270" rx="24" ry="14" fill="#fff" opacity="0.55" transform="rotate(-35 372 270)" />
      <circle cx="430" cy="330" r="7" fill="#9fd0ff" opacity="0.4" />
      <rect x="560" y="245" width="60" height="16" rx="8" fill="#111" /><text x="590" y="257" fontSize="10" fill="#d9d9d9" textAnchor="middle" fontFamily="ui-monospace, monospace" letterSpacing="1">VTR-1</text>
      <circle cx="200" cy="250" r="9" fill="#c9ccd0" />
    </svg>
  );
}

export function InsideCamera({ style = "xray" }: { style?: InsideStyle }) {
  const k = INK[style];
  const glow = style === "blueprint" ? undefined : `url(#ic-glow-${style})`;
  const stroke = { fill: "none", stroke: k.line, strokeWidth: 2, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
  return (
    <svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true" style={{ display: "block", width: "100%", height: "100%" }}>
      <defs>
        <filter id={`ic-glow-${style}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <radialGradient id={`ic-v-${style}`} cx="0.5" cy="0.55" r="0.7"><stop offset="0" stopColor={k.glow} stopOpacity="0.16" /><stop offset="1" stopColor={k.bg} stopOpacity="0" /></radialGradient>
        {k.grid && (
          <pattern id="ic-grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke={k.grid} strokeWidth="1" /></pattern>
        )}
      </defs>
      <rect width="800" height="500" fill={k.bg} />
      {k.grid && <rect width="800" height="500" fill="url(#ic-grid)" />}
      <rect width="800" height="500" fill={`url(#ic-v-${style})`} />
      <g filter={glow}>
        <path d={BODY} {...stroke} fill={k.soft} strokeWidth="2.5" />
        {/* the inside: battery, board, shutter, sensor, mirror box */}
        <rect x="175" y="240" width="80" height="150" rx="8" {...stroke} fill={k.soft} />
        <path d="M195 240v-10h40v10" {...stroke} />
        <path d="M190 280h50M190 310h50M190 340h50" {...stroke} strokeWidth="1" opacity="0.7" />
        <rect x="515" y="200" width="115" height="190" rx="6" {...stroke} />
        {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M528 ${220 + i * 24}h${30 + (i % 3) * 22}v10h${20 - (i % 2) * 8}`} {...stroke} strokeWidth="1.2" opacity="0.8" />)}
        <rect x="575" y="300" width="36" height="36" rx="3" {...stroke} fill={k.soft} />
        <rect x="345" y="122" width="110" height="40" rx="6" {...stroke} />
        <path d="M352 140 L400 175 L448 140" {...stroke} strokeWidth="1.2" opacity="0.8" />
        <circle cx="560" cy="122" r="22" {...stroke} /><circle cx="560" cy="122" r="14" {...stroke} strokeWidth="1" />
        <rect x="196" y="116" width="58" height="24" rx="5" {...stroke} />
        <circle cx="610" cy="118" r="11" {...stroke} />
        <path d="M560 144 V200 M610 129 V200" {...stroke} strokeWidth="1" strokeDasharray="4 4" opacity="0.7" />
        <circle cx="400" cy="300" r="118" {...stroke} strokeWidth="2.5" />
        <circle cx="400" cy="300" r="104" {...stroke} strokeWidth="1" />
        <circle cx="400" cy="300" r="86" {...stroke} />
        {[74, 60, 46].map((r, i) => <ellipse key={r} cx="400" cy="300" rx={r} ry={r * (0.9 - i * 0.05)} {...stroke} strokeWidth={1.4 - i * 0.2} fill={k.soft} />)}
        <rect x="372" y="272" width="56" height="56" {...stroke} strokeWidth="1.6" />
        <path d="M372 272 L428 328 M428 272 L372 328" {...stroke} strokeWidth="0.8" opacity="0.6" />
        {Array.from({ length: 6 }, (_, i) => {
          const a = (i / 6) * Math.PI * 2;
          return <path key={i} d={`M${400 + Math.cos(a) * 40} ${300 + Math.sin(a) * 40} L${400 + Math.cos(a + 0.9) * 28} ${300 + Math.sin(a + 0.9) * 28}`} {...stroke} strokeWidth="1.2" />;
        })}
        <path d="M255 300 H282 M518 300 H490" {...stroke} strokeWidth="1" strokeDasharray="3 5" />
      </g>
      <g fill={k.line} fontFamily="ui-monospace, monospace" fontSize="11" letterSpacing="1.5" opacity="0.75">
        <text x="175" y="410">CELL 7.4V</text>
        <text x="515" y="410">MAIN BOARD</text>
        <text x="330" y="440">SENSOR 36×24</text>
      </g>
    </svg>
  );
}
