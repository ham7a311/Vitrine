"use client";

import { useMemo } from "react";
import { CohortRetention, type Cohort } from "./CohortRetention";

function makeData(): Cohort[] {
  let s = 5;
  const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"];
  const quality = [0.98, 1.0, 1.16, 1.04, 0.92, 0.86, 0.9, 1.02, 1.08, 1.0];
  return names.map((label, i) => {
    const months = names.length - i;
    const kept = Array.from({ length: months }, (_, m) => (m === 0 ? 1 : Math.min(1, (0.28 + 0.72 * Math.exp(-m / 1.7)) * quality[i] * (0.95 + r() * 0.08))));
    return { label, size: Math.round(600 + r() * 700 + (i === 6 ? 500 : 0)), kept };
  });
}

export default function Demo({ variant = "light" }: { variant?: string }) {
  const dark = variant === "dark";
  const data = useMemo(makeData, []);
  return (
    <div className="flex min-h-full w-full items-center justify-center px-4 py-10" style={{ background: dark ? "#0d0d0d" : "#f9f9f7" }}>
      <CohortRetention cohorts={data} theme={dark ? "dark" : "light"} />
    </div>
  );
}
