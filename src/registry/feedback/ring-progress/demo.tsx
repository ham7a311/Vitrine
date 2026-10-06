"use client";
import { useEffect, useState } from "react";
import { RingProgress } from "./RingProgress";
import { amount } from "./progress";

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
  const job = useJob();
  return (
    <div className={`rprg-demo rprg-demo--${theme}`}>
      <RingProgress theme={theme} label="Download" value={job} detail={amount(job, 2.4, "GB")} size="lg" />
      <RingProgress theme={theme} label="Profile" value={80} detail="4 of 5 done" />
      <RingProgress theme={theme} label="CPU" value={42} size="sm" />
    </div>
  );
}
