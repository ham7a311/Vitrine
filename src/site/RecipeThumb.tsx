"use client";

import { ScaledFrame } from "./ScaledFrame";
import { LazyMount } from "./LazyMount";

/** A live, non-interactive thumbnail of a recipe: its preview framed at desktop width and scaled to fit. */
export function RecipeThumb({ slug, bg }: { slug: string; bg: string }) {
  return (
    <div className="h-full w-full" style={{ background: bg }} aria-hidden="true">
      <LazyMount className="h-full w-full">
        <ScaledFrame width={1280} height={800}>
          <iframe src={`/workshop/recipes/${slug}/preview`} title="" tabIndex={-1} loading="lazy" className="pointer-events-none block h-full w-full border-0" style={{ background: bg }} />
        </ScaledFrame>
      </LazyMount>
    </div>
  );
}
