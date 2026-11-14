"use client";

import { EdgeLitButton } from "./EdgeLitButton";

const LIGHTS = ["ice", "amber", "rose"] as const;

export default function Demo({ variant = "ice" }: { variant?: string }) {
  const light = LIGHTS.find((l) => l === variant) ?? "ice";
  return (
    <div className="flex min-h-full w-full flex-col items-center justify-center gap-8 bg-[#0a0b0d] p-8">
      <EdgeLitButton light={light} size="lg">Open the studio</EdgeLitButton>
      <div className="flex flex-wrap items-center justify-center gap-5">
        <EdgeLitButton light={light}>Save draft</EdgeLitButton>
        <EdgeLitButton light={light}>Export</EdgeLitButton>
        <EdgeLitButton light={light} disabled>Publish</EdgeLitButton>
      </div>
    </div>
  );
}
