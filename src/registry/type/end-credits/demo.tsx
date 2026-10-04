"use client";
import { EndCredits } from "./EndCredits";
const C = [
  { role: "Designed & built by", names: ["Hamza Al-Bulushi"] },
  { role: "Role", names: ["Software Engineer"] },
  { role: "Studied at", names: ["GUtech", "Muscat, Oman"] },
  { role: "Selected work", names: ["Masar", "Wally", "OCS", "TransOcean"] },
  { role: "Built with", names: ["Next.js", "TypeScript", "WebGL"] },
  { role: "Set in", names: ["Instrument Serif", "Geist Mono"] },
];
export default function Demo({ variant = "amber" }: { variant?: string }) {
  const v = variant === "frost" ? { a: "#9fb8d8", bg: "#080a0e" } : { a: "#e8a24a", bg: "#0c0b0a" };
  return <div className="h-full min-h-[24rem] w-full p-6" style={{ background: v.bg }}><EndCredits credits={C} accent={v.a} className="mx-auto max-w-xl" /></div>;
}
