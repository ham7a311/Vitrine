/* Small abstract illustrations for the demo tiles, drawn in the tile's own ink. */
const ink = "#16120e";
const W = "rgba(255,255,255,0.62)";

export const Plan = () => (
  <svg viewBox="0 0 220 200" preserveAspectRatio="xMidYMid meet">
    {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={20 + (i % 2) * 30 + i * 8} y={22 + i * 34} width={[120, 90, 150, 70, 110][i]} height="22" rx="11" fill={i === 2 ? ink : W} />)}
    <path d="M14 14v176" stroke={ink} strokeOpacity=".25" strokeDasharray="3 5" />
    <circle cx="14" cy="101" r="5" fill={ink} />
  </svg>
);
export const Write = () => (
  <svg viewBox="0 0 320 120" preserveAspectRatio="xMidYMid meet">
    <rect x="10" y="10" width="300" height="100" rx="18" fill={W} />
    {[0, 1, 2].map((i) => <rect key={i} x="30" y={30 + i * 22} width={[230, 190, 120][i]} height="10" rx="5" fill={ink} opacity={i === 2 ? 1 : 0.35} />)}
    <rect x="156" y="70" width="3" height="18" fill={ink}><animate attributeName="opacity" values="1;0;1" dur="1.1s" repeatCount="indefinite" /></rect>
  </svg>
);
export const Review = () => (
  <svg viewBox="0 0 140 120" preserveAspectRatio="xMidYMid meet">
    <circle cx="56" cy="60" r="36" fill={W} />
    <circle cx="86" cy="60" r="36" fill="none" stroke={ink} strokeWidth="3" />
    <path d="m70 60 10 10 20-22" fill="none" stroke={ink} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const Ship = () => (
  <svg viewBox="0 0 140 120" preserveAspectRatio="xMidYMid meet">
    {[0, 1, 2, 3].map((i) => <rect key={i} x={18 + i * 28} y={92 - i * 22} width="20" height={18 + i * 22} rx="6" fill={i === 3 ? ink : W} />)}
    <path d="M24 30 104 12M104 12l-14-4M104 12l-8 12" fill="none" stroke={ink} strokeWidth="3" strokeLinecap="round" />
  </svg>
);
export const Measure = () => (
  <svg viewBox="0 0 320 120" preserveAspectRatio="xMidYMid meet">
    <path d="M10 96C50 92 60 60 100 64s60 26 90 4 50-50 120-52" fill="none" stroke={ink} strokeWidth="4" strokeLinecap="round" />
    <path d="M10 96C50 92 60 60 100 64s60 26 90 4 50-50 120-52V110H10Z" fill={W} />
    <circle cx="190" cy="68" r="7" fill={ink} />
    <rect x="200" y="30" width="62" height="26" rx="13" fill={ink} /><text x="231" y="48" textAnchor="middle" fontSize="13" fontWeight="700" fill="#fff" fontFamily="Hanken Grotesk, sans-serif">+18%</text>
  </svg>
);
export const Share = () => (
  <svg viewBox="0 0 640 120" preserveAspectRatio="xMidYMid meet">
    <path d="M90 60H550" stroke={ink} strokeOpacity=".3" strokeWidth="3" strokeDasharray="2 10" strokeLinecap="round" />
    {[90, 200, 320, 440, 550].map((x, i) => (
      <g key={x}><circle cx={x} cy="60" r={i === 2 ? 34 : 26} fill={i === 2 ? ink : W} />
        <circle cx={x} cy={i === 2 ? 52 : 54} r={i === 2 ? 10 : 8} fill={i === 2 ? W : ink} opacity={i === 2 ? 1 : 0.7} />
        <path d={`M${x - (i === 2 ? 16 : 12)} ${i === 2 ? 78 : 74}a${i === 2 ? 16 : 12} ${i === 2 ? 12 : 9} 0 0 1 ${i === 2 ? 32 : 24} 0`} fill={i === 2 ? W : ink} opacity={i === 2 ? 1 : 0.7} /></g>
    ))}
  </svg>
);
