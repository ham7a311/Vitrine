"use client";

import { BlueprintCard } from "./BlueprintCard";

/** A simple exploded turbine-ish drawing built from pathLength=1 strokes so it draws itself. */
const Drawing = (
  <svg viewBox="0 0 320 200" fill="none" stroke="#cfe3fb" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="112" cy="100" r="62" pathLength={1} />
    <circle cx="112" cy="100" r="38" pathLength={1} />
    <circle cx="112" cy="100" r="10" pathLength={1} />
    {[0, 60, 120, 180, 240, 300].map((a) => {
      const r = (a * Math.PI) / 180;
      return <path key={a} pathLength={1} d={`M ${112 + Math.cos(r) * 10} ${100 + Math.sin(r) * 10} L ${112 + Math.cos(r) * 38} ${100 + Math.sin(r) * 38}`} />;
    })}
    <path pathLength={1} d="M174 100 H260 M260 84 V116 M260 84 H286 V116 H260" />
    <path pathLength={1} d="M112 20 V6 M112 194 V180 M40 100 H26" strokeDasharray="0" />
    <path pathLength={1} d="M50 176 H174 M50 170 V182 M174 170 V182" />
  </svg>
);

export default function Demo() {
  return (
    <div className="flex min-h-full w-full items-center justify-center bg-[#050b14] p-8">
      <BlueprintCard
        title="Rotor assembly"
        code="DWG · 024-B"
        drawing={Drawing}
        specs={[
          { key: "Diameter", value: "124 mm" },
          { key: "Blades", value: "6 · forged" },
          { key: "Shaft", value: "Ø 20 h7" },
          { key: "Material", value: "Ti-6Al-4V" },
        ]}
      />
    </div>
  );
}
