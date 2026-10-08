"use client";
import { SentenceComposer } from "./SentenceComposer";

export default function Demo({ variant = "dark" }: { variant?: string }) {
  const light = variant === "light";
  return (
    <div className={`flex min-h-full w-full items-center justify-center px-4 pb-48 pt-16 sm:px-8 ${light ? "bg-[#f1f1f0]" : "bg-[#0c0c0c]"}`}>
      <SentenceComposer theme={light ? "light" : "dark"} />
    </div>
  );
}
