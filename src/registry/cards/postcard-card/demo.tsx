"use client";

import { PostcardCard, type Place } from "./PostcardCard";

const PLACES: Record<string, Place & { bg: string }> = {
  muscat: {
    name: "Muscat",
    sky: ["#ffe3a3", "#ff9a52", "#d9475c"],
    date: "14 MAR",
    bg: "radial-gradient(80% 70% at 50% 40%, #e9dcc4, #cdb995)",
    message: ["Dear Sami —", "The water here is the colour", "of the bottle you broke in", "Year 9. Wish you were here.", "— M."],
    to: ["Sami Al Harthy", "Way 3021, Shatti Al Qurum", "Muscat, Oman"],
    scene: (
      <svg viewBox="0 0 300 200" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="pcs1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3a6fb0" /><stop offset="0.6" stopColor="#7fb6d8" /><stop offset="1" stopColor="#ffd8a0" /></linearGradient></defs><rect width="300" height="200" fill="url(#pcs1)" /><path d="M0 120 L40 92 L70 108 L110 78 L150 104 L190 84 L230 106 L270 88 L300 100 V200 H0Z" fill="#8f6a6a" /><path d="M0 140 L60 118 L110 134 L170 116 L230 136 L300 122 V200 H0Z" fill="#6b4a52" /><rect y="150" width="300" height="50" fill="#1e7fa0" />{[0, 1, 2, 3].map((i) => <path key={i} d={`M0 ${160 + i * 10} q25 -4 50 0 t50 0 t50 0 t50 0 t50 0 t50 0`} stroke="#9fe0f0" strokeWidth="1.2" fill="none" opacity="0.5" />)}<path d="M40 152 V96 M40 96 q-14 4 -22 14 M40 96 q12 0 22 10 M40 96 q-4 -10 -14 -14 M40 96 q8 -8 18 -8" stroke="#2a3a20" strokeWidth="3" fill="none" strokeLinecap="round" /><path d="M262 152 V104 M262 104 q-12 4 -20 12 M262 104 q12 2 20 12 M262 104 q2 -10 12 -14" stroke="#2a3a20" strokeWidth="3" fill="none" strokeLinecap="round" /></svg>
    ),
    stamp: (
      <svg viewBox="0 0 40 46" preserveAspectRatio="xMidYMid slice"><rect width="40" height="46" fill="#e9a33a" /><circle cx="28" cy="14" r="6" fill="#fff1c4" /><rect y="30" width="40" height="16" fill="#1e6f95" /><path d="M8 30 q8 4 18 0 l-2 4 h-14z" fill="#3a1c10" /><path d="M17 29 V12 L9 27Z" fill="#fff8e8" /></svg>
    ),
  },
  salalah: {
    name: "Salalah",
    sky: ["#eaffd6", "#8fd46a", "#2f8a4a"],
    date: "02 AUG",
    bg: "radial-gradient(80% 70% at 50% 40%, #dfe6cf, #b7c39b)",
    message: ["Habibti —", "It's raining in August and", "everything is green. The", "coconuts are the size of my head.", "— Y."],
    to: ["Noor Al Balushi", "Al Khuwair 33", "Muscat, Oman"],
    scene: (
      <svg viewBox="0 0 300 200" preserveAspectRatio="xMidYMid slice"><rect width="300" height="200" fill="#cfe3dc" /><path d="M0 100 Q60 70 120 92 T240 80 T300 90 V200 H0Z" fill="#7fb56a" /><path d="M0 130 Q80 104 160 126 T300 118 V200 H0Z" fill="#4f9a50" />{Array.from({ length: 14 }, (_, i) => <path key={i} d={`M${i * 23} 0 l-6 200`} stroke="#fff" strokeWidth="0.6" opacity="0.35" />)}<path d="M70 200 V112 M70 112 q-16 4 -26 16 M70 112 q14 0 26 12 M70 112 q-4 -12 -18 -16 M70 112 q10 -10 22 -10" stroke="#24461f" strokeWidth="4" fill="none" strokeLinecap="round" /><path d="M230 200 V120 M230 120 q-14 6 -22 16 M230 120 q14 2 24 14 M230 120 q4 -12 16 -14" stroke="#24461f" strokeWidth="4" fill="none" strokeLinecap="round" /></svg>
    ),
    stamp: (
      <svg viewBox="0 0 40 46" preserveAspectRatio="xMidYMid slice"><rect width="40" height="46" fill="#6fbf6a" /><path d="M20 46 V20 M20 20 q-8 2 -12 8 M20 20 q8 0 12 6 M20 20 q-2 -6 -8 -8 M20 20 q4 -5 10 -5" stroke="#1f3d1a" strokeWidth="2" fill="none" /></svg>
    ),
  },
  nizwa: {
    name: "Nizwa",
    sky: ["#fff0c8", "#f2b04c", "#b8582a"],
    date: "21 NOV",
    bg: "radial-gradient(80% 70% at 50% 40%, #eadbc1, #c9ae86)",
    message: ["Dad —", "Bought you a khanjar at the", "Friday goat market. Don't", "ask what it cost.", "— your favourite."],
    to: ["Khalid Al Rawahi", "Way 1405, Al Hail", "Muscat, Oman"],
    scene: (
      <svg viewBox="0 0 300 200" preserveAspectRatio="xMidYMid slice"><rect width="300" height="200" fill="#f6d9a6" /><path d="M0 110 L50 80 L90 98 L140 66 L190 92 L240 72 L300 90 V200 H0Z" fill="#b4825a" /><path d="M110 150 V108 a40 40 0 0 1 80 0 V150Z" fill="#8a5a36" />{[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={112 + i * 13} y="100" width="7" height="8" fill="#8a5a36" />)}<rect y="150" width="300" height="50" fill="#d9a46a" /><path d="M24 150 q-2 -20 2 -40 M26 110 q-14 2 -22 14 M26 110 q12 -2 22 10 M26 110 q-6 -10 -18 -12 M26 110 q6 -10 18 -10 M26 110 q0 -8 -4 -14" stroke="#3a4a20" strokeWidth="3" fill="none" strokeLinecap="round" /><path d="M274 150 q2 -20 -2 -38 M272 112 q-14 2 -22 14 M272 112 q12 -2 22 10 M272 112 q-6 -10 -18 -12 M272 112 q6 -10 18 -10" stroke="#3a4a20" strokeWidth="3" fill="none" strokeLinecap="round" /></svg>
    ),
    stamp: (
      <svg viewBox="0 0 40 46" preserveAspectRatio="xMidYMid slice"><rect width="40" height="46" fill="#c97a3a" /><path d="M10 40 V24 a10 10 0 0 1 20 0 V40Z" fill="#6a3a1a" /><rect y="40" width="40" height="6" fill="#e9c08a" /></svg>
    ),
  },
};

export default function Demo({ variant = "muscat" }: { variant?: string }) {
  const p = PLACES[variant] ?? PLACES.muscat;
  return (
    <div className="flex min-h-full w-full items-center justify-center px-4 py-12" style={{ background: p.bg }}>
      <PostcardCard place={p} />
    </div>
  );
}
