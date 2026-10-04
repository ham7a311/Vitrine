/** Three hand-built SVG scenes for the instant photo (viewBox 0 0 260 260). */

export function Corniche() {
  return (
    <>
      <defs>
        <linearGradient id="ip-sky1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3c2a6b" />
          <stop offset="0.45" stopColor="#c8557a" />
          <stop offset="0.8" stopColor="#ffa25a" />
          <stop offset="1" stopColor="#ffd38a" />
        </linearGradient>
        <linearGradient id="ip-sea1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d97a6a" />
          <stop offset="1" stopColor="#2a2350" />
        </linearGradient>
        <radialGradient id="ip-sun1"><stop offset="0" stopColor="#fff3c6" /><stop offset="0.5" stopColor="#ffd27a" /><stop offset="1" stopColor="#ffd27a" stopOpacity="0" /></radialGradient>
      </defs>
      <rect width="260" height="170" fill="url(#ip-sky1)" />
      {/* The sun, just above the ridge line. */}
      <circle cx="176" cy="112" r="42" fill="url(#ip-sun1)" />
      <circle cx="176" cy="114" r="13" fill="#fff0c2" />
      {/* Far ridges of the Hajar, then the near hills round the bay. */}
      <path d="M0 132 L22 118 L40 126 L64 104 L86 120 L104 112 L128 128 L150 116 L170 130 L196 112 L222 126 L244 114 L260 122 V170 H0Z" fill="#8a4a74" />
      <path d="M0 150 L18 138 L34 144 L52 126 L70 140 L88 134 L96 142 L120 136 L134 146 V170 H0Z" fill="#4a2849" />
      {/* Mutrah fort on its hill. */}
      <path d="M30 132 h6 v-8 h3 v4 h3 v-4 h3 v4 h3 v-4 h3 v8 h5 v-14 h4 v-3 h6 v3 h4 v14 h6 v12 h-46z" fill="#2e1a33" />
      <path d="M200 170 L214 150 L232 142 L260 146 V170Z" fill="#3a2142" />
      <rect y="168" width="260" height="92" fill="url(#ip-sea1)" />
      {/* The sun's path on the water. */}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <rect key={i} x={176 - 22 + i * 2.5} y={174 + i * 9} width={44 - i * 5} height="2.2" rx="1.1" fill="#ffe2a0" opacity={0.85 - i * 0.1} />
      ))}
      {/* Corniche lights along the shore. */}
      {Array.from({ length: 16 }, (_, i) => <circle key={i} cx={8 + i * 8} cy={166 - (i % 3)} r="1.2" fill="#ffe6a6" />)}
      {/* A dhow under sail. */}
      <path d="M78 200 q22 8 46 0 l-4 6 h-38z" fill="#1c1430" />
      <path d="M100 199 V164 L82 196Z" fill="#2a1d3d" />
      <path d="M102 197 V170 L120 196Z" fill="#33244a" />
      <rect x="99.5" y="160" width="1.5" height="40" fill="#1c1430" />
    </>
  );
}

export function Desert() {
  return (
    <>
      <defs>
        <linearGradient id="ip-sky2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6c37a" />
          <stop offset="0.55" stopColor="#ff8f5a" />
          <stop offset="1" stopColor="#ffd9a0" />
        </linearGradient>
        <linearGradient id="ip-dune1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#e9864a" /><stop offset="1" stopColor="#b44e2c" /></linearGradient>
        <linearGradient id="ip-dune2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f2a35e" /><stop offset="1" stopColor="#c2602f" /></linearGradient>
      </defs>
      <rect width="260" height="260" fill="url(#ip-sky2)" />
      <circle cx="70" cy="110" r="24" fill="#fff1c9" opacity="0.95" />
      <path d="M0 150 Q60 120 120 142 T260 130 V260 H0Z" fill="#d9774a" opacity="0.7" />
      <path d="M0 176 Q70 136 150 168 T260 160 V260 H0Z" fill="url(#ip-dune1)" />
      <path d="M150 168 Q200 150 260 160 V200 Q210 182 150 168Z" fill="#8f3a1f" opacity="0.35" />
      <path d="M0 214 Q80 178 170 206 T260 200 V260 H0Z" fill="url(#ip-dune2)" />
      <path d="M0 214 Q50 194 100 200 Q60 214 0 236Z" fill="#9c4423" opacity="0.3" />
      {/* A small caravan along the ridge. */}
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${108 + i * 22} ${150 + i * 2})`} fill="#4a1d10">
          <path d="M0 10 q4 -9 9 -4 q3 -6 7 0 q3 -2 5 -6 l2 1 q-2 6 -4 8 v8 h-1.5 v-7 h-9 v7 h-1.5 v-7 q-3 0 -4 0z" />
        </g>
      ))}
      {/* Wind ripples. */}
      {[0, 1, 2, 3].map((i) => <path key={i} d={`M${20 + i * 30} ${236 + (i % 2) * 6} q14 -5 28 0`} stroke="#ffd2a0" strokeWidth="1.2" fill="none" opacity="0.5" />)}
    </>
  );
}

export function Night() {
  return (
    <>
      <defs>
        <linearGradient id="ip-sky3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0a1030" />
          <stop offset="0.7" stopColor="#1c2a5a" />
          <stop offset="1" stopColor="#3a3f6e" />
        </linearGradient>
        <radialGradient id="ip-moon"><stop offset="0" stopColor="#fffbe8" /><stop offset="0.55" stopColor="#f6eccb" /><stop offset="1" stopColor="#f6eccb" stopOpacity="0" /></radialGradient>
      </defs>
      <rect width="260" height="260" fill="url(#ip-sky3)" />
      {Array.from({ length: 46 }, (_, i) => <circle key={i} cx={(i * 53) % 260} cy={(i * 37) % 140} r={i % 7 ? 0.7 : 1.2} fill="#fff" opacity={0.4 + (i % 5) * 0.12} />)}
      <circle cx="190" cy="60" r="30" fill="url(#ip-moon)" />
      <circle cx="190" cy="60" r="13" fill="#fffbe8" />
      <path d="M0 170 L30 150 L56 160 L84 132 L112 152 L140 140 L170 158 L200 136 L230 154 L260 146 V200 H0Z" fill="#141a38" />
      {/* The city: low white buildings with warm windows, a mosque dome and minaret. */}
      <path d="M0 200 V184 h14 v-6 h12 v10 h10 v-14 h16 v14 h8 v-8 h14 v8 h10 v-12 h4 v-24 h3 v24 h4 v6 q14 -24 28 0 v6 h12 v-10 h18 v12 h10 v-8 h16 v14 h12 v-6 h22 v8 h14 V200Z" fill="#232a4c" />
      {Array.from({ length: 30 }, (_, i) => <rect key={i} x={6 + i * 8.4} y={186 + (i % 3) * 4} width="2.4" height="2.4" fill="#ffd27a" opacity={(i * 7) % 3 ? 0.9 : 0.35} />)}
      <rect y="200" width="260" height="60" fill="#0d1230" />
      {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={190 - 14 + i * 3} y={206 + i * 9} width={28 - i * 6} height="1.8" rx="0.9" fill="#fff6d6" opacity={0.7 - i * 0.12} />)}
    </>
  );
}
