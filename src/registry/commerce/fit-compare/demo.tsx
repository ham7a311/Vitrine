"use client";
import { FitCompare, type FitItem } from "./FitCompare";

const SIZES: FitItem[] = [
  { id: "s", label: "Small", w: 120, h: 190, radius: 10 },
  { id: "m", label: "Medium", w: 180, h: 250, radius: 12 },
  { id: "l", label: "Large", w: 260, h: 340, radius: 14 },
];

export default function Demo({ variant = "light" }: { variant?: string }) {
  const dark = variant === "dark";
  return (
    <div className={`min-h-full w-full px-4 py-8 ${dark ? "bg-[#0e0d10]" : "bg-[#e7e2d9]"}`}>
      <div className="mx-auto w-full max-w-[60rem]">
        <FitCompare name="Muttrah tech pouch" sizes={SIZES} holds defaultReference="laptop" theme={dark ? "dark" : "light"} />
      </div>
    </div>
  );
}
