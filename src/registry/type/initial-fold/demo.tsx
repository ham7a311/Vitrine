"use client";
import { InitialFold } from "./InitialFold";
export default function Demo({ variant = "folded" }: { variant?: string }) {
  return <div className="flex min-h-full w-full items-center justify-center bg-[#0c0b0a] p-8"><InitialFold key={variant} name={variant === "long" ? "Hamza Al Bulushi" : "Hamza Al-Bulushi"} folded /></div>;
}
