"use client";
import { useEffect, useState } from "react";
import { SegmentedProgress } from "./SegmentedProgress";

// A value that climbs unevenly to 100, rests, and starts again, like a real job.
function useJob(speed = 1) {
  const [v, setV] = useState(8);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { setV(64); return; }
    let rest = 0;
    const t = setInterval(() => {
      setV((x) => {
        if (x >= 100) { rest++; if (rest > 4) { rest = 0; return 0; } return 100; }
        return Math.min(100, x + (Math.random() * 9 + 2) * speed);
      });
    }, 420);
    return () => clearInterval(t);
  }, [speed]);
  return v;
}

export default function Demo({ variant = "light" }: { variant?: string }) {
  const theme = variant === "dark" ? "dark" : "light";
  const job = useJob(), slow = useJob(0.5);
  return (
    <div className={`sgpb-demo sgpb-demo--${theme}`}>
      <SegmentedProgress theme={theme} label="Setting up your workspace" value={job} steps={5} detail={`Step ${Math.min(5, Math.floor(job / 20) + 1)} of 5`} />
      <SegmentedProgress theme={theme} label="Password strength" value={75} steps={4} detail="Strong" size="sm" />
      <SegmentedProgress theme={theme} label="Course" value={slow} steps={12} size="lg" />
    </div>
  );
}
