"use client";
import { useState } from "react";
import { LessonSummary } from "./LessonSummary";

export default function Demo({ variant = "light" }: { variant?: string }) {
  const [run, setRun] = useState(0);
  return (
    <div className={`min-h-full w-full ${variant === "dark" ? "bg-[#131f24]" : "bg-white"}`}>
      <LessonSummary
        key={run}
        xp={27}
        accuracy={94}
        seconds={104}
        streak={6}
        week={[false, true, true, true, true, true, true]}
        dayLabels={["T", "F", "S", "S", "M", "T", "W"]}
        theme={variant === "dark" ? "dark" : "light"}
        onContinue={() => setRun((r) => r + 1)}
        onReview={() => setRun((r) => r + 1)}
      />
    </div>
  );
}
