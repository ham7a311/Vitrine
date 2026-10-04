"use client";

import { useMemo, useState } from "react";
import { UploadStack, type Uploader } from "./UploadStack";

const SAMPLES: [string, number][] = [
  ["campus-wayfinding-v3.png", 4.2e6],
  ["thesis-draft-v4.pdf", 2.1e6],
  ["interview-recording.mov", 38e6],
  ["site-photos.zip", 18e6],
  ["survey-results.csv", 640e3],
  ["budget-2026.xlsx", 412e3],
  ["q3-roadmap.pdf", 1.4e6],
];

function fakeFile(name: string, size: number) {
  const f = new File([""], name);
  Object.defineProperty(f, "size", { value: size });
  return f;
}

/** Simulated network: ~5 MB/s with jitter; site-photos.zip drops once at 62%. */
function makeUploader(): Uploader {
  const failedOnce = new Set<string>();
  const resumeAt = new Map<string, number>(); // bytes already delivered before a drop
  return (file, report, signal) =>
    new Promise((resolve, reject) => {
      let sent = resumeAt.get(file.name) ?? 0;
      const rate = 3.5e6 + Math.random() * 3e6;
      const t = window.setInterval(() => {
        sent += (rate / 8) * (0.6 + Math.random() * 0.8);
        const p = Math.min(1, sent / Math.max(1, file.size));
        if (file.name === "site-photos.zip" && !failedOnce.has(file.name) && p > 0.62) {
          failedOnce.add(file.name);
          resumeAt.set(file.name, sent);
          window.clearInterval(t);
          return reject(new Error("Connection dropped at 62% — retry to resume"));
        }
        report(p);
        if (p >= 1) {
          window.clearInterval(t);
          resolve();
        }
      }, 125);
      signal.addEventListener("abort", () => {
        window.clearInterval(t);
        reject(new Error("Cancelled"));
      });
    });
}

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  const [run, setRun] = useState(1);
  const uploader = useMemo(() => makeUploader(), [run]); // eslint-disable-line react-hooks/exhaustive-deps
  const files = useMemo(() => SAMPLES.map(([n, s]) => fakeFile(n, s)), [run]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`flex h-full min-h-[620px] w-full items-start justify-center overflow-auto px-4 py-10 ${night ? "bg-[#0f1012] text-[#ececea]" : "bg-[#f3f1ec] text-[#1b1a17]"}`} style={{ fontFamily: "Geist, ui-sans-serif, system-ui" }}>
      <div className="flex w-full flex-col items-center gap-3">
        <UploadStack key={run} theme={night ? "night" : "paper"} uploader={uploader} initialFiles={files} maxSize={25e6} concurrency={2} />
        <button type="button" onClick={() => setRun((r) => r + 1)} className={`h-8 rounded-lg px-3 text-[12.5px] ring-1 ${night ? "ring-white/10 text-[#8b8d93]" : "ring-black/10 text-[#77736b]"}`}>
          Restart with sample files
        </button>
      </div>
    </div>
  );
}
