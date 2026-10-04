"use client";

import { EmberButton } from "./EmberButton";

export default function Demo({ variant = "trace" }: { variant?: string }) {
  return (
    <div className="flex min-h-full w-full flex-col items-center justify-center gap-10 bg-[#0c0b0a] p-12">
      {variant === "variants" ? (
        <div className="flex flex-wrap items-center justify-center gap-3">
          <EmberButton arrow>Get started</EmberButton>
          <EmberButton variant="secondary">Read the docs</EmberButton>
          <EmberButton variant="ghost">Maybe later</EmberButton>
        </div>
      ) : (
        <EmberButton ornament={variant === "sparkle" ? "sparkle" : "trace"} size="lg" arrow className="h-14 px-8 text-[1.05rem]">
          {variant === "sparkle" ? "Claim your seat" : "Open the console"}
        </EmberButton>
      )}
    </div>
  );
}
