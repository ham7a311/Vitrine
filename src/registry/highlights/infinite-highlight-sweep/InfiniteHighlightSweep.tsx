"use client";

import type { ComponentProps } from "react";
import { HighlightSweep, SweepText } from "../highlight-sweep/HighlightSweep";

export { SweepText };

/**
 * Infinite Highlight Sweep
 * The same demo cursor as Highlight Sweep, set to loop: it sweeps a phrase,
 * holds, lets the highlight fade, and moves on to the next, round and round
 * for as long as the section is on screen.
 */
export function InfiniteHighlightSweep(props: Omit<ComponentProps<typeof HighlightSweep>, "repeat" | "loop">) {
  return <HighlightSweep {...props} repeat="forever" />;
}
