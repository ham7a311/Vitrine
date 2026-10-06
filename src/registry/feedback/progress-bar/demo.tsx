"use client";
import { useEffect, useState } from "react";
import { ProgressBar } from "./ProgressBar";
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
  const job = useJob(), slow = useJob(0.5);
  return (
    <div className={`prgb-demo prgb-demo--${theme}`}>
      <ProgressBar theme={theme} label="Uploading assets" value={job} />
      <ProgressBar theme={theme} label="Storage" value={72} detail={amount(72, 10, "GB")} size="lg" />
      <ProgressBar theme={theme} label="Episode 12" value={slow * 0.6} buffer={Math.min(100, slow * 0.6 + 18)} size="sm" detail="Buffered ahead" />
    </div>
  );
}
