/** Illustrated story frames drawn in SVG — no photographs. Each takes the person's two colours. */

export type SceneKind = "dawn" | "city" | "sea" | "type";

export function Scene({ kind, a, b, text }: { kind: SceneKind; a: string; b: string; text?: string }) {
  const id = `sc-${kind}-${a.slice(1)}-${b.slice(1)}`;
  if (kind === "type") {
    return (
      <svg viewBox="0 0 90 160" preserveAspectRatio="xMidYMid slice" className="sreel__scene">
        <defs><linearGradient id={id} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={a} /><stop offset="1" stopColor={b} /></linearGradient></defs>
        <rect width="90" height="160" fill={`url(#${id})`} />
        {Array.from({ length: 9 }, (_, i) => <circle key={i} cx={(i * 37) % 90} cy={(i * 53) % 160} r={14 + (i % 3) * 6} fill="#fff" opacity="0.06" />)}
        {text && <foreignObject x="9" y="44" width="72" height="80"><p className="sreel__quote">{text}</p></foreignObject>}
      </svg>
    );
  }
  if (kind === "city") {
    return (
      <svg viewBox="0 0 90 160" preserveAspectRatio="xMidYMid slice" className="sreel__scene">
        <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0b1030" /><stop offset="0.7" stopColor={a} /><stop offset="1" stopColor={b} /></linearGradient></defs>
        <rect width="90" height="160" fill={`url(#${id})`} />
        {Array.from({ length: 24 }, (_, i) => <circle key={i} cx={(i * 29) % 90} cy={(i * 17) % 70} r={0.5} fill="#fff" opacity={0.4 + (i % 3) * 0.2} />)}
        <circle cx="68" cy="28" r="7" fill="#f6eedb" opacity="0.9" />
        {[[0, 92, 16], [14, 76, 14], [27, 100, 12], [38, 64, 18], [55, 86, 14], [68, 70, 22]].map(([x, y, w], i) => (
          <g key={i}>
            <rect x={x} y={y} width={w} height={160 - y} fill="#070914" />
            {Array.from({ length: Math.floor((160 - y) / 7) }, (_, r) => Array.from({ length: Math.floor(w / 5) }, (_, c) => ((r * 7 + c * 3 + i) % 5 < 2 ? <rect key={`${r}-${c}`} x={x + 2 + c * 5} y={y + 4 + r * 7} width="2" height="3" fill="#ffd27a" opacity="0.85" /> : null)))}
          </g>
        ))}
      </svg>
    );
  }
  if (kind === "sea") {
    return (
      <svg viewBox="0 0 90 160" preserveAspectRatio="xMidYMid slice" className="sreel__scene">
        <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={a} /><stop offset="0.55" stopColor="#fbe3c6" /><stop offset="0.56" stopColor={b} /><stop offset="1" stopColor="#0d2f4a" /></linearGradient></defs>
        <rect width="90" height="160" fill={`url(#${id})`} />
        <circle cx="45" cy="86" r="13" fill="#fff4dc" opacity="0.9" />
        {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M${-10 + (i % 2) * 6} ${96 + i * 8}q11 -3 22 0t22 0t22 0t22 0t22 0`} fill="none" stroke="#fff" strokeOpacity={0.25 - i * 0.02} strokeWidth="0.8" />)}
        <path d="M24 104h20l-3 4H27z" fill="#14232e" /><path d="M34 104V88l9 14z" fill="#f6f1e6" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 90 160" preserveAspectRatio="xMidYMid slice" className="sreel__scene">
      <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={a} /><stop offset="1" stopColor="#ffe2b8" /></linearGradient></defs>
      <rect width="90" height="160" fill={`url(#${id})`} />
      <circle cx="58" cy="78" r="16" fill="#fff3d6" />
      <path d="M0 104 26 82 46 98 66 76 90 96V160H0z" fill={b} opacity="0.55" />
      <path d="M0 122 20 108 44 120 70 100 90 112V160H0z" fill={b} opacity="0.8" />
      <path d="M0 140 30 126 60 138 90 124V160H0z" fill={b} />
    </svg>
  );
}
