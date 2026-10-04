"use client";

import { PhosphorGlassButton } from "./PhosphorGlassButton";

export default function Demo({ variant = "primary" }: { variant?: string }) {
  return (
    <div className="flex min-h-full w-full flex-wrap items-center justify-center gap-8 bg-[#0e0d0b] p-10">
      {variant === "text" ? (
        <>
          <PhosphorGlassButton variant="text" arrow="→">Read the case study</PhosphorGlassButton>
          <PhosphorGlassButton variant="text">View changelog</PhosphorGlassButton>
        </>
      ) : (
        <>
          <PhosphorGlassButton arrow="→">See the work</PhosphorGlassButton>
          <PhosphorGlassButton variant="text" arrow="↗">Download résumé</PhosphorGlassButton>
        </>
      )}
    </div>
  );
}
