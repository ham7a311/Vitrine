"use client";

import { FanDeckCard, type DeckCard } from "./FanDeckCard";

const CARDS: DeckCard[] = [
  {
    id: "akhdar", title: "Jabal Akhdar", meta: "2 days · from OMR 85", tint: "#3f8f5a",
    blurb: "Rose terraces at dawn, a night in the clouds and the walk along the canyon rim.",
    art: (
      <svg viewBox="0 0 200 140" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="fa1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#bfe3f0" /><stop offset="1" stopColor="#f6e2c8" /></linearGradient></defs><rect width="200" height="140" fill="url(#fa1)" /><path d="M0 100 L40 58 L70 82 L110 40 L150 76 L200 50 V140 H0Z" fill="#6b8f7a" /><path d="M0 120 L50 88 L90 108 L140 80 L200 104 V140 H0Z" fill="#3f6b50" />{[0, 1, 2, 3].map((i) => <path key={i} d={`M0 ${124 + i * 5} Q100 ${112 + i * 5} 200 ${124 + i * 5}`} stroke="#e98aa5" strokeWidth="1.6" fill="none" opacity="0.7" />)}</svg>
    ),
  },
  {
    id: "shab", title: "Wadi Shab", meta: "1 day · from OMR 30", tint: "#1c9aa6",
    blurb: "Wade the turquoise pools, swim through the gap, and find the waterfall in the cave.",
    art: (
      <svg viewBox="0 0 200 140" preserveAspectRatio="xMidYMid slice"><rect width="200" height="140" fill="#e8c9a0" /><path d="M0 0 H70 L60 140 H0Z" fill="#c98f5e" /><path d="M200 0 H130 L142 140 H200Z" fill="#b97a4a" /><path d="M64 140 Q100 90 136 140Z" fill="#2fc4c8" /><path d="M70 140 Q100 104 130 140Z" fill="#7fe3e0" opacity="0.6" /></svg>
    ),
  },
  {
    id: "wahiba", title: "Wahiba Sands", meta: "2 days · from OMR 110", tint: "#d9682f",
    blurb: "Dune bashing at sunset, a Bedouin camp and more stars than you knew there were.",
    art: (
      <svg viewBox="0 0 200 140" preserveAspectRatio="xMidYMid slice"><rect width="200" height="140" fill="#ffb877" /><circle cx="150" cy="50" r="18" fill="#fff1cf" /><path d="M0 92 Q60 60 120 86 T200 78 V140 H0Z" fill="#e9864a" /><path d="M0 116 Q80 84 160 112 T200 108 V140 H0Z" fill="#c2602f" /></svg>
    ),
  },
  {
    id: "jinz", title: "Ras al Jinz", meta: "1 night · from OMR 60", tint: "#5a5fd6",
    blurb: "Walk the beach at night with a ranger and watch green turtles come ashore to nest.",
    art: (
      <svg viewBox="0 0 200 140" preserveAspectRatio="xMidYMid slice"><rect width="200" height="140" fill="#141a44" /><circle cx="148" cy="38" r="14" fill="#f4efd8" />{Array.from({ length: 20 }, (_, i) => <circle key={i} cx={(i * 47) % 200} cy={(i * 29) % 70} r="0.9" fill="#fff" opacity="0.7" />)}<rect y="88" width="200" height="22" fill="#1f2a66" /><path d="M0 110 H200 V140 H0Z" fill="#c8b48e" /><ellipse cx="80" cy="120" rx="12" ry="6" fill="#3a3a2a" /></svg>
    ),
  },
  {
    id: "muscat", title: "Old Muscat", meta: "Half day · from OMR 20", tint: "#b04a4a",
    blurb: "The forts either side of the harbour, the palace gates and coffee in Mutrah souq.",
    art: (
      <svg viewBox="0 0 200 140" preserveAspectRatio="xMidYMid slice"><rect width="200" height="140" fill="#f4dcc0" /><path d="M0 96 L30 70 L52 84 L80 60 L110 88 L140 64 L170 82 L200 70 V140 H0Z" fill="#a8786a" /><path d="M20 140 V104 h12 v-6 h6 v6 h4 v-8 h8 v8 h4 v-6 h6 v6 h12 V140Z" fill="#7a3b33" /><rect y="118" width="200" height="22" fill="#4f8fb0" /></svg>
    ),
  },
];

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  return (
    <div className="flex min-h-full w-full items-center justify-center overflow-hidden px-4 py-12" style={{ background: night ? "#0b0b0d" : "#ede6da" }}>
      <FanDeckCard cards={CARDS} theme={night ? "night" : "paper"} />
    </div>
  );
}
