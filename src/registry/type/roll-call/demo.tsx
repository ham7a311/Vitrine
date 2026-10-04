"use client";
import { RollCall } from "./RollCall";
const A = [
  { name: "Masar", role: "Product & frontend", color: "#7c9cff" },
  { name: "Wally", role: "Mobile app", color: "#ff7fb6" },
  { name: "OCS", role: "Website & design system", color: "#4fd68a" },
  { name: "TransOcean", role: "Logistics platform", color: "#ffc35c" },
  { name: "Vitrine", role: "Component library", color: "#5fd6e8" },
];
export default function Demo({ variant = "roster" }: { variant?: string }) {
  const people = variant === "short" ? A.slice(0, 3) : A;
  return <div className="flex min-h-full w-full items-center justify-center bg-[#0c0b0a] p-8"><RollCall people={people} className="w-full max-w-xl" /></div>;
}
