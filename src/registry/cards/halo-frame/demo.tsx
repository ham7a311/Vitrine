"use client";

import { HaloFrame, HaloQuote } from "./HaloFrame";

export default function Demo({ variant = "quote" }: { variant?: string }) {
  return (
    <div className="flex min-h-full w-full items-center justify-center bg-[#0c0b0a] p-8">
      <div className="w-full max-w-md">
        {variant === "panel" ? (
          <HaloFrame speed={9} colors={["#7e93ae", "#b9cce4", "#eef3fa"]}>
            <div className="rounded-[9px] bg-[#0d0f14] p-6 text-[#e6e9ef]">
              <p className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-[#9fb3cc]">Build status</p>
              <p className="mt-3 text-2xl font-medium tracking-tight">Deploying to production</p>
              <p className="mt-2 text-sm text-[#8b95a3]">Step 3 of 5 · Optimising assets</p>
            </div>
          </HaloFrame>
        ) : (
          <HaloQuote kicker="Our intent">Make the difficult thing feel obvious, then make it feel inevitable.</HaloQuote>
        )}
      </div>
    </div>
  );
}
