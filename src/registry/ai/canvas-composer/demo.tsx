"use client";
import { CanvasComposer } from "./CanvasComposer";

export default function Demo({ variant = "dark" }: { variant?: string }) {
  const light = variant === "light";
  return (
    <div className={`flex min-h-full w-full items-center justify-center px-3 py-10 sm:px-8 ${light ? "bg-[#f7f7f6]" : "bg-[#0a0a0a]"}`}>
      <CanvasComposer theme={light ? "light" : "dark"} />
    </div>
  );
}
