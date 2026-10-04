"use client";

import { DissolveButton } from "./DissolveButton";

export default function Demo({ variant = "night" }: { variant?: string }) {
  const night = variant !== "paper";
  return (
    <div className="flex min-h-full w-full flex-wrap items-center justify-center gap-5 p-10" style={{ background: night ? "#0d0d0f" : "#f1efe9" }}>
      <DissolveButton onAction={() => new Promise((r) => setTimeout(r, 900))} done="Published">
        Publish the guide
      </DissolveButton>
    </div>
  );
}
