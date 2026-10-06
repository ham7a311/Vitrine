"use client";
import { useEffect, useState } from "react";
import { ProgressBar } from "./ProgressBar";
import { amount } from "./progress";

const LOOKS = ["linear", "segmented", "indeterminate", "gradient", "ring"] as const;
type Look = (typeof LOOKS)[number];

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

function Panel({ look, theme }: { look: Look; theme: "light" | "dark" }) {
  const job = useJob(), slow = useJob(0.5);
  const p = { theme };
  return (
    <section className={`prgb-demo__panel prgb-demo__panel--${theme}`} aria-label={theme === "dark" ? "On dark" : "On light"}>
      {look === "linear" && <>
        <ProgressBar {...p} label="Uploading assets" value={job} />
        <ProgressBar {...p} label="Storage" value={72} detail={amount(72, 10, "GB")} size="lg" />
        <ProgressBar {...p} label="Episode 12" value={slow * 0.6} buffer={Math.min(100, slow * 0.6 + 18)} size="sm" detail="Buffered ahead" />
      </>}
      {look === "segmented" && <>
        <ProgressBar {...p} look="segmented" label="Setting up your workspace" value={job} steps={5} detail={`Step ${Math.min(5, Math.floor(job / 20) + 1)} of 5`} />
        <ProgressBar {...p} look="segmented" label="Password strength" value={75} steps={4} detail="Strong" size="sm" />
        <ProgressBar {...p} look="segmented" label="Course" value={slow} steps={12} size="lg" />
      </>}
      {look === "indeterminate" && <>
        <ProgressBar {...p} look="indeterminate" label="Connecting to the database" detail="Usually under a minute" />
        <ProgressBar {...p} look="indeterminate" label="Indexing files" striped size="lg" />
        <ProgressBar {...p} look="indeterminate" label="Syncing" size="sm" />
      </>}
      {look === "gradient" && <>
        <ProgressBar {...p} look="gradient" label="Generating your video" value={job} size="lg" />
        <ProgressBar {...p} look="gradient" label="Monthly goal" value={68} detail="6,800 of 10,000 visits" />
        <ProgressBar {...p} look="gradient" label="Training run" value={slow} size="sm" />
      </>}
      {look === "ring" && <div className="prgb-demo__rings">
        <ProgressBar {...p} look="ring" label="Download" value={job} detail={amount(job, 2.4, "GB")} size="lg" />
        <ProgressBar {...p} look="ring" label="Profile" value={80} detail="4 of 5 done" />
        <ProgressBar {...p} look="ring" label="CPU" value={42} size="sm" />
      </div>}
    </section>
  );
}

export default function Demo({ variant = "linear" }: { variant?: string }) {
  const look = (LOOKS as readonly string[]).includes(variant) ? (variant as Look) : "linear";
  return <div className="prgb-demo"><Panel look={look} theme="light" /><Panel look={look} theme="dark" /></div>;
}
