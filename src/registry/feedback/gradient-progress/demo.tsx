"use client";
import { useEffect, useState } from "react";
import { GradientProgress } from "./GradientProgress";

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
    <div className={`gpbr-demo gpbr-demo--${theme}`}>
      <GradientProgress theme={theme} label="Generating your video" value={job} size="lg" />
      <GradientProgress theme={theme} label="Monthly goal" value={68} detail="6,800 of 10,000 visits" />
      <GradientProgress theme={theme} label="Training run" value={slow} size="sm" />
    </div>
  );
}
