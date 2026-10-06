"use client";

import { NextIssue } from "./NextIssue";

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  return (
    <div className={`flex min-h-full w-full items-center justify-center px-6 py-12 sm:px-10 ${night ? "bg-[#0f1012]" : "bg-[#f6f5f1]"}`}>
      <div className="w-full max-w-[60rem]">
        <NextIssue
          theme={night ? "night" : "paper"}
          title="Field Notes from Muscat"
          blurb="One essay about building software for people who read right to left, every other Thursday. About 900 words. One-click unsubscribe."
          next={{ no: 25, date: "2026-10-15" }}
          issues={[
            { no: 24, date: "2026-10-01", subject: "A wallet that knows how to say no" },
            { no: 23, date: "2026-09-17", subject: "Right-to-left is not a mirror" },
            { no: 22, date: "2026-09-03", subject: "Why the map is not the route" },
          ]}
          onSubscribe={() => new Promise((r) => setTimeout(r, 700))}
        />
      </div>
    </div>
  );
}
