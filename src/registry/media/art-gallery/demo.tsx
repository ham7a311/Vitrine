"use client";

import { ArtGallery } from "./ArtGallery";

export default function Demo({ variant = "night" }: { variant?: string }) {
  return <ArtGallery theme={variant === "paper" ? "paper" : "night"} className="h-full min-h-full" label="Vitrine studies, 2022 to 2026" />;
}
