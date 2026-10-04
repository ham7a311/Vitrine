"use client";

import { VinylSleeveCard, type Album } from "./VinylSleeveCard";

const ALBUMS: Record<string, Album & { bg: string }> = {
  khareef: {
    title: "Khareef Sessions",
    artist: "Lulwa Ensemble",
    year: "2025",
    track: "1. Mist over Ittin",
    seconds: 222,
    label: "#cfe6c2",
    ink: "#18321c",
    bg: "radial-gradient(90% 80% at 40% 30%, #1d2a22, #0a0f0c)",
    cover: (
      <svg viewBox="0 0 200 200">
        <rect width="200" height="200" fill="#163b2a" />
        <circle cx="70" cy="80" r="70" fill="#2f6b4a" opacity="0.8" />
        <circle cx="140" cy="120" r="60" fill="#5fa476" opacity="0.55" />
        <circle cx="110" cy="70" r="34" fill="#cfe6c2" opacity="0.5" />
        {Array.from({ length: 9 }, (_, i) => <rect key={i} x="0" y={120 + i * 9} width="200" height="2" fill="#e8f2e0" opacity={0.08 + i * 0.03} />)}
        <text x="16" y="30" fill="#e8f2e0" fontFamily="Georgia, serif" fontStyle="italic" fontSize="17">Khareef</text>
        <text x="16" y="44" fill="#e8f2e0" fontFamily="monospace" fontSize="7" letterSpacing="2" opacity="0.8">SESSIONS · LULWA ENSEMBLE</text>
      </svg>
    ),
  },
  wadi: {
    title: "Wadi Nights",
    artist: "The Falaj Trio",
    year: "2024",
    track: "3. Water in the dark",
    seconds: 268,
    label: "#e8c46a",
    ink: "#2a1d05",
    bg: "radial-gradient(90% 80% at 40% 30%, #161a2c, #07080e)",
    cover: (
      <svg viewBox="0 0 200 200">
        <rect width="200" height="200" fill="#0f1430" />
        <circle cx="132" cy="62" r="26" fill="none" stroke="#e8c46a" strokeWidth="1.5" />
        <circle cx="132" cy="62" r="18" fill="#e8c46a" opacity="0.9" />
        {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M0 ${110 + i * 7} Q50 ${100 + i * 7} 100 ${110 + i * 7} T200 ${110 + i * 7}`} fill="none" stroke="#e8c46a" strokeWidth="0.8" opacity={0.15 + i * 0.05} />)}
        <text x="16" y="176" fill="#e8c46a" fontFamily="Georgia, serif" fontStyle="italic" fontSize="18">Wadi Nights</text>
        <text x="16" y="189" fill="#e8c46a" fontFamily="monospace" fontSize="7" letterSpacing="2" opacity="0.75">THE FALAJ TRIO</text>
      </svg>
    ),
  },
  corniche: {
    title: "Corniche",
    artist: "Sami & the Dhows",
    year: "2026",
    track: "1. Leaving Mutrah",
    seconds: 198,
    label: "#f6e7cf",
    ink: "#5a1d0c",
    bg: "radial-gradient(90% 80% at 40% 30%, #2c1712, #0e0806)",
    cover: (
      <svg viewBox="0 0 200 200">
        <rect width="200" height="200" fill="#f6e7cf" />
        {["#ff6a3d", "#ff8f4a", "#f2b04c", "#e8572e", "#b5361e"].map((c, i) => <rect key={c} x="0" y={40 + i * 26} width="200" height="20" fill={c} />)}
        <circle cx="150" cy="70" r="28" fill="#f6e7cf" />
        <text x="16" y="28" fill="#5a1d0c" fontFamily="Georgia, serif" fontStyle="italic" fontSize="19">Corniche</text>
        <text x="16" y="190" fill="#5a1d0c" fontFamily="monospace" fontSize="7" letterSpacing="2">SAMI &amp; THE DHOWS</text>
      </svg>
    ),
  },
};

export default function Demo({ variant = "khareef" }: { variant?: string }) {
  const a = ALBUMS[variant] ?? ALBUMS.khareef;
  return (
    <div className="flex min-h-full w-full items-center justify-center overflow-hidden px-4 py-12" style={{ background: a.bg }}>
      <VinylSleeveCard album={a} />
    </div>
  );
}
