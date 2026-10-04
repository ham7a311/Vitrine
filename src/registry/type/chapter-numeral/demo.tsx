"use client";
import { ChapterNumeral } from "./ChapterNumeral";
export default function Demo({ variant = "cyan" }: { variant?: string }) {
  const v = variant === "rose" ? { c: "#ff7fb6", n: "07" } : variant === "gold" ? { c: "#ffc35c", n: "12" } : { c: "#5fd6e8", n: "03" };
  return <div className="flex min-h-full w-full items-center justify-center bg-[#0c0b0a] p-8"><ChapterNumeral number={v.n} name="Hamza Al-Bulushi" role="Software Engineer" color={v.c} /></div>;
}
