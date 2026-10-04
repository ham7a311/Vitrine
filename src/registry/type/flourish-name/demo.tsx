"use client";
import { FlourishName } from "./FlourishName";
export default function Demo({ variant = "ivory" }: { variant?: string }) {
  const v = variant === "ember" ? { ink: "#f0a35e", bg: "#100a06" } : variant === "mint" ? { ink: "#9fe3c4", bg: "#07100d" } : { ink: "#f4efe6", bg: "#0c0b0a" };
  return <div className="flex min-h-full w-full items-center justify-center p-8" style={{ background: v.bg }}><FlourishName name="Hamza" ink={v.ink} /></div>;
}
