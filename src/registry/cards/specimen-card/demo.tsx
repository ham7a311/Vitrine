"use client";

import { SpecimenCard } from "./SpecimenCard";

function Lens() {
  return (
    <svg viewBox="0 0 200 170" fill="none">
      <defs>
        <radialGradient id="spec-obsidian" cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#8f84c4" />
          <stop offset="35%" stopColor="#2e1f45" />
          <stop offset="100%" stopColor="#07050b" />
        </radialGradient>
        <linearGradient id="spec-rim" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f1e3c8" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#c9a86a" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <ellipse cx="100" cy="152" rx="54" ry="7" fill="#000" opacity="0.35" />
      <ellipse cx="100" cy="82" rx="62" ry="64" fill="url(#spec-obsidian)" />
      <ellipse cx="100" cy="82" rx="62" ry="64" stroke="url(#spec-rim)" strokeWidth="1.2" />
      <ellipse cx="100" cy="82" rx="44" ry="46" stroke="#b9cce4" strokeOpacity="0.25" />
      <ellipse cx="100" cy="82" rx="26" ry="28" stroke="#b9cce4" strokeOpacity="0.18" />
      <path d="M68 50 C 80 38, 98 34, 112 38" stroke="#fff" strokeOpacity="0.55" strokeWidth="3" strokeLinecap="round" />
      <circle cx="120" cy="104" r="3" fill="#c8b9ea" opacity="0.6" />
    </svg>
  );
}

export default function Demo() {
  return (
    <div className="flex min-h-full w-full items-center justify-center bg-[#0b080d] p-10">
      <SpecimenCard
        href="#specimen"
        specimen={<Lens />}
        catalogue="Specimen Nº 024"
        title="Obsidian Lens"
        subtitle="Volcanic glass, hand-polished. Collection B, drawer 7."
        tag={[
          { label: "Catalogued", value: "12 · 03 · 2026" },
          { label: "Origin", value: "Northstar Survey" },
          { label: "Condition", value: "Excellent" },
        ]}
      />
    </div>
  );
}
