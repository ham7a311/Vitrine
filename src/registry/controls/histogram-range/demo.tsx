"use client";

import { useMemo } from "react";
import { HistogramRange } from "./HistogramRange";

export default function Demo() {
  // a believable, right-skewed price distribution
  const values = useMemo(() => {
    let s = 7;
    const rand = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    return Array.from({ length: 640 }, () => {
      const u = rand(), v = rand();
      const n = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
      return Math.max(20, Math.min(1000, Math.exp(5.4 + n * 0.55)));
    });
  }, []);
  return (
    <div className="flex min-h-full w-full items-center justify-center bg-[#0b080d] p-8">
      <HistogramRange values={values} />
    </div>
  );
}
