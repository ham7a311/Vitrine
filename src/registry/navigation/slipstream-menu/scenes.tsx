// Original poster-style scenes drawn in SVG, used as stand-ins for photographs in demos.
import type { ReactElement } from "react";

const S = (id: string, body: ReactElement) => (
  <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" aria-hidden="true" data-scene={id}>{body}</svg>
);

export const scenes = {
  dawn: S("dawn", <>
    <defs>
      <linearGradient id="sc-dawn-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5d6fba" /><stop offset=".5" stopColor="#ee9fa4" /><stop offset="1" stopColor="#ffd6a6" /></linearGradient>
      <linearGradient id="sc-dawn-mist" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#fff" stopOpacity=".35" /></linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(#sc-dawn-sky)" />
    <circle cx="300" cy="118" r="30" fill="#fff4dc" />
    <circle cx="300" cy="118" r="54" fill="#fff4dc" opacity=".18" />
    <path d="M118 40l8 4 8-4M140 56l6 3 6-3M98 62l5 3 5-3" stroke="#3b3466" strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M0 196 90 132l48 30 46-34 70 52 70-40 76 48v112H0Z" fill="#8c78a8" />
    <rect y="170" width="400" height="60" fill="url(#sc-dawn-mist)" />
    <path d="M120 300 222 86l30 30 20-16 128 200Z" fill="#4c4478" />
    <path d="m222 86 30 30 20-16 26 46-26-16-18 20-20-24-30 24Z" fill="#f6f2ff" />
    <path d="M0 246c60-22 130-14 190 4s140 12 210-16v66H0Z" fill="#2b2848" />
  </>),
  neon: S("neon", <>
    <rect width="400" height="300" fill="#0d0b1f" />
    {[[0, 40, 90, 260], [80, 10, 80, 290], [150, 60, 70, 240], [215, 0, 95, 300], [300, 30, 100, 270]].map(([x, y, w, h], i) => (
      <g key={i}>
        <rect x={x} y={y} width={w} height={h} fill={["#1b1638", "#221a44", "#17132e", "#261d4d", "#1c1739"][i]} />
        {Array.from({ length: 30 }, (_, k) => <rect key={k} x={x + 8 + (k % 4) * (w - 16) / 4} y={y + 14 + Math.floor(k / 4) * 20} width={(w - 16) / 4 - 6} height="8" fill={(k * 7 + i) % 5 ? "#f7c35f" : "#3b3166"} opacity={(k * 3 + i) % 4 ? 0.7 : 0.15} />)}
      </g>
    ))}
    <rect x="96" y="70" width="46" height="110" rx="4" fill="#ff3d8b" opacity=".9" />
    <rect x="232" y="40" width="58" height="22" rx="4" fill="#3de0ff" opacity=".9" />
    <rect x="312" y="120" width="70" height="20" rx="4" fill="#b45cff" opacity=".9" />
    <rect x="160" y="150" width="40" height="70" rx="4" fill="#ffb13d" opacity=".85" />
    <rect y="240" width="400" height="60" fill="#120f26" />
    {[110, 250, 340, 180].map((x, i) => <rect key={i} x={x} y="246" width="14" height="54" fill={["#ff3d8b", "#3de0ff", "#b45cff", "#ffb13d"][i]} opacity=".35" />)}
  </>),
  canal: S("canal", <>
    <defs>
      <linearGradient id="sc-canal-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0a0d2a" /><stop offset="1" stopColor="#3a2463" /></linearGradient>
      <linearGradient id="sc-canal-water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#24184a" /><stop offset="1" stopColor="#07081c" /></linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(#sc-canal-sky)" />
    <circle cx="300" cy="46" r="14" fill="#f4e9cf" opacity=".9" />
    <path d="M0 176V60h34V30h40v40h30v-24h36v130Z" fill="#161433" />
    <path d="M400 176V40h-30V18h-44v52h-36V54h-38v122Z" fill="#191637" />
    <path d="M150 176c10-40 90-40 100 0Z" fill="none" stroke="#2c2858" strokeWidth="6" />
    {[[8, 80], [44, 44], [84, 84], [116, 60], [260, 70], [300, 84], [334, 32], [372, 54]].map(([x, y], i) => (
      <g key={i}>{Array.from({ length: 6 }, (_, k) => <rect key={k} x={x + (k % 2) * 12} y={y + Math.floor(k / 2) * 18} width="7" height="10" fill={(i + k) % 3 ? "#ffcf73" : "#3a3270"} opacity={(i + k) % 3 ? 0.85 : 0.4} />)}</g>
    ))}
    <rect x="62" y="96" width="14" height="60" rx="3" fill="#ff4f88" />
    <rect x="122" y="112" width="12" height="44" rx="3" fill="#5ee6ff" />
    <rect x="282" y="104" width="14" height="52" rx="3" fill="#ffb13d" />
    <rect x="352" y="96" width="12" height="60" rx="3" fill="#b77bff" />
    <rect y="176" width="400" height="124" fill="url(#sc-canal-water)" />
    {[[69, "#ff4f88"], [128, "#5ee6ff"], [289, "#ffb13d"], [358, "#b77bff"]].map(([x, c], i) => (
      <g key={i} opacity=".55">{Array.from({ length: 7 }, (_, k) => <rect key={k} x={(x as number) - 6 + (k % 2) * 4} y={184 + k * 14} width={14 - k} height="5" rx="2" fill={c as string} opacity={1 - k * 0.12} />)}</g>
    ))}
    {[200, 222, 248, 280].map((y, i) => <rect key={i} x={40 + i * 30} y={y} width={320 - i * 60} height="1.5" fill="#fff" opacity=".1" />)}
  </>),
  gate: S("gate", <>
    <rect width="400" height="300" fill="#2a1408" />
    {Array.from({ length: 9 }, (_, i) => {
      const s = 1 - i * 0.1, w = 380 * s, h = 300 * s, x = 200 - w / 2 - i * 10, y = 150 - h / 2 + i * 6;
      return <g key={i} opacity={1 - i * 0.06}>
        <rect x={x} y={y} width={w * 0.07} height={h} fill={i % 2 ? "#e2531f" : "#f06a2a"} />
        <rect x={x + w * 0.93} y={y} width={w * 0.07} height={h} fill={i % 2 ? "#c9461a" : "#e2531f"} />
        <rect x={x - w * 0.02} y={y} width={w * 1.04} height={h * 0.06} fill="#1a0b05" />
        <rect x={x} y={y + h * 0.1} width={w} height={h * 0.035} fill="#e2531f" />
      </g>;
    })}
    <path d="M150 300c20-40 40-80 60-120 10 40 20 80 40 120Z" fill="#7d6a5a" opacity=".5" />
  </>),
  noodle: S("noodle", <>
    <rect width="400" height="300" fill="#6b4a32" />
    <circle cx="200" cy="160" r="150" fill="#e9e3d6" />
    <circle cx="200" cy="160" r="150" fill="none" stroke="#2c4f8a" strokeWidth="10" strokeDasharray="18 10" opacity=".7" />
    <circle cx="200" cy="160" r="122" fill="#a5632c" />
    <circle cx="200" cy="160" r="122" fill="#c98a43" opacity=".45" />
    {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${110 + i * 15} 120c10 30-10 60 4 90`} stroke="#f2d17a" strokeWidth="5" fill="none" strokeLinecap="round" />)}
    <ellipse cx="160" cy="128" rx="30" ry="22" fill="#fff" /><ellipse cx="160" cy="128" rx="15" ry="11" fill="#f5a524" />
    <ellipse cx="238" cy="134" rx="30" ry="22" fill="#fff" /><ellipse cx="238" cy="134" rx="15" ry="11" fill="#f5a524" />
    <path d="M200 190c30-6 60 10 64 36-34 8-60-4-64-36Z" fill="#7a3c22" />
    {[[180, 100], [205, 95], [228, 105], [196, 112]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="5" fill="#5aa85a" />)}
  </>),
  lighthouse: S("lighthouse", <>
    <defs><linearGradient id="sc-lh-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1d2b55" /><stop offset="1" stopColor="#e88a6a" /></linearGradient></defs>
    <rect width="400" height="300" fill="url(#sc-lh-sky)" />
    <path d="M250 120 400 60v60Z" fill="#fff3c4" opacity=".35" />
    <path d="M250 120 400 180v-60Z" fill="#fff3c4" opacity=".2" />
    <path d="M226 230 236 128h28l10 102Z" fill="#f2efe8" />
    <path d="M230 196h40v12h-40Z M233 162h34v12h-34Z" fill="#d1453b" />
    <rect x="234" y="110" width="32" height="20" fill="#fff3c4" />
    <path d="M228 110h44l-22-16Z" fill="#2c2a3d" />
    <path d="M0 240c80-30 160-30 200-10 50-30 140-40 200-10v80H0Z" fill="#2b2c45" />
    <path d="M0 270c90-12 220-12 400 0v30H0Z" fill="#1c1d33" />
  </>),
  lake: S("lake", <>
    <defs><linearGradient id="sc-lake-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f7b8c4" /><stop offset="1" stopColor="#c7a6d9" /></linearGradient></defs>
    <rect width="400" height="150" fill="url(#sc-lake-sky)" />
    <path d="M60 150 170 60l28 18 22-16 120 88Z" fill="#7f6aa3" />
    <path d="M170 60l28 18 22-16 18 22-22-8-18 14-20-10-24 12Z" fill="#fff" />
    <path d="M0 150h400v150H0Z" fill="#6f5d95" />
    <path d="M60 150 170 240l28-18 22 16 120-88Z" fill="#9a86c0" opacity=".6" />
    <path d="M0 120c40-10 80 0 110 30H0Z M290 150c30-30 70-40 110-30v30Z" fill="#2f2a4a" />
    {[170, 190, 210, 230, 250].map((y, i) => <rect key={i} x={60 + i * 20} y={y} width={180 - i * 30} height="2" fill="#fff" opacity=".25" />)}
  </>),
  train: S("train", <>
    <rect width="400" height="300" fill="#a9cdea" />
    <path d="M110 170 210 70l100 100Z" fill="#8a9ab3" />
    <path d="M210 70 236 96l-14-4-12 12-12-12-12 6Z" fill="#fff" />
    <path d="M0 40c120 30 280 30 400 10M0 70c140 20 260 20 400 0" stroke="#2c3442" strokeWidth="1.5" fill="none" />
    <rect x="300" y="20" width="4" height="170" fill="#3a3f4a" />
    <rect y="170" width="400" height="130" fill="#3d4652" />
    <rect x="40" y="160" width="330" height="80" rx="14" fill="#f2f2ee" />
    <rect x="40" y="208" width="330" height="18" fill="#2a4f8f" />
    {[70, 130, 190, 250, 310].map((x) => <rect key={x} x={x} y="174" width="42" height="26" rx="4" fill="#33465f" />)}
    <rect y="246" width="400" height="8" fill="#252a31" />
  </>),
  blossom: S("blossom", <>
    <rect width="400" height="300" fill="#c9d7ea" />
    <path d="M-20 300C60 220 120 200 160 120 190 60 260 30 420 20" stroke="#4a3a3a" strokeWidth="10" fill="none" strokeLinecap="round" />
    <path d="M160 120c40 10 80 60 120 70M100 230c40-10 70 10 110 0" stroke="#4a3a3a" strokeWidth="6" fill="none" strokeLinecap="round" />
    {Array.from({ length: 70 }, (_, i) => {
      const x = (i * 97) % 400, y = (i * 53) % 260 + 10;
      return <circle key={i} cx={x} cy={y} r={8 + (i % 4) * 3} fill={["#f7c6d6", "#f2a9c2", "#fbe0ea", "#efb3c8"][i % 4]} opacity=".9" />;
    })}
  </>),
};

export type SceneName = keyof typeof scenes;
