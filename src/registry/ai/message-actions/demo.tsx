"use client";

import { MessageActions } from "./MessageActions";

const V = [
  <>
    <p>
      The deck and the data mostly agree. The one real mismatch is <strong>slide 12</strong>: it shows 71% week-6 retention, but the March cohort in the CSV
      sits at 64%.
    </p>
    <p>Everything else — revenue, seats, expansion — matches to within a rounding error.</p>
  </>,
  <>
    <p>Short version: one number is off. Slide 12 says 71% week-6 retention; the CSV says 64% for March.</p>
    <p>I&rsquo;d update the slide or add a footnote explaining the cohort difference.</p>
  </>,
  <>
    <p>Slide 12 overstates retention (71% vs 64% in the data). Everything else checks out.</p>
  </>,
];

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  return (
    <div className={`flex min-h-full w-full items-center justify-center p-8 ${night ? "bg-[#0f0e10]" : "bg-[#f5f1e8]"}`}>
      <MessageActions versions={V} theme={night ? "night" : "paper"} />
    </div>
  );
}
