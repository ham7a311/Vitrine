"use client";

import { InstantPhotoCard } from "./InstantPhotoCard";

export default function Demo({ variant = "corniche" }: { variant?: string }) {
  const scene = (["corniche", "desert", "night"].includes(variant) ? variant : "corniche") as "corniche" | "desert" | "night";
  return (
    <div className="flex min-h-full w-full items-center justify-center px-4 py-12" style={{ background: "radial-gradient(80% 70% at 50% 40%, #d8c9ad, #b9a785)" }}>
      <InstantPhotoCard scene={scene} />
    </div>
  );
}
