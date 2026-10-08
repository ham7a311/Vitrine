"use client";
import { DialComposer } from "./DialComposer";

export default function Demo({ variant = "dark" }: { variant?: string }) {
  const light = variant === "light";
  return (
    <div className={`flex min-h-full w-full items-center justify-center px-4 py-12 sm:px-8 ${light ? "bg-[#f1f1f0]" : "bg-[#0c0c0c]"}`}>
      <DialComposer theme={light ? "light" : "dark"} />
    </div>
  );
}
