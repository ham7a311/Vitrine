"use client";
import { MixedInspector } from "./MixedInspector";

export default function Demo({ variant = "dark" }: { variant?: string }) {
  const light = variant === "light";
  return (
    <div className={`flex min-h-full w-full items-center justify-center px-4 py-12 sm:px-10 ${light ? "bg-[#ecebe8]" : "bg-[#0c0c0c]"}`}>
      <MixedInspector theme={light ? "light" : "dark"} />
    </div>
  );
}
