"use client";

import { OrbitCard, OrbitMarquee, type OrbitPerson } from "./OrbitCard";

const PEOPLE: OrbitPerson[] = [
  { id: "am", name: "Alex Morgan", role: "Design Lead · Interfaces and motion systems", color: "#5C7CFA" },
  { id: "pr", name: "Priya Raman", role: "Staff Engineer · Rendering pipeline", color: "#EF6FA7" },
  { id: "jo", name: "Jonah Okafor", role: "Product Manager · Onboarding", color: "#9B5DE5" },
  { id: "ml", name: "Mei Lindqvist", role: "Research · Accessibility and inclusive testing", color: "#2FBF71" },
  { id: "rv", name: "Rafael Vidal", role: "Engineer · Realtime collaboration", color: "#E07A3D" },
  { id: "sn", name: "Sana Noor", role: "Brand Designer · Type and identity", color: "#4ECDC4" },
];

export default function Demo({ variant = "marquee" }: { variant?: string }) {
  return (
    <div className="flex min-h-full w-full flex-col justify-center bg-[#0c0b0a] py-10">
      {variant === "single" ? (
        <div className="flex flex-wrap justify-center gap-5 px-6">
          {PEOPLE.slice(0, 2).map((p) => (
            <OrbitCard key={p.id} person={p} />
          ))}
        </div>
      ) : (
        <OrbitMarquee people={PEOPLE} label="Team" />
      )}
    </div>
  );
}
