"use client";
import { StackedBrief } from "./StackedBrief";

export default function Demo({ variant = "dark" }: { variant?: string }) {
  const light = variant === "light";
  return (
    <div className={`flex min-h-full w-full items-start justify-center px-4 py-14 sm:px-8 ${light ? "bg-[#f1f1f0]" : "bg-[#0c0c0c]"}`}>
      <StackedBrief theme={light ? "light" : "dark"} />
    </div>
  );
}
