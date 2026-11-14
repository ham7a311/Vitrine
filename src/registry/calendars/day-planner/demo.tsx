"use client";

import { DayPlanner, type PlannerEvent, type PlannerTask } from "./DayPlanner";

const TASKS: PlannerTask[] = [
  { id: "spec", title: "Write the export spec", minutes: 90, tone: "a" },
  { id: "review", title: "Review Noor's pull request", minutes: 45, tone: "c" },
  { id: "inbox", title: "Clear the inbox", minutes: 30, tone: "b" },
  { id: "deck", title: "Draft the Q1 roadmap deck", minutes: 120, tone: "a" },
  { id: "calls", title: "Call two customers", minutes: 60, tone: "c" },
  { id: "expenses", title: "File October expenses", minutes: 30, tone: "b" },
];
const FIXED: PlannerEvent[] = [
  { title: "Standup", start: 570, end: 585 },
  { title: "Lunch", start: 750, end: 795 },
  { title: "Design review", start: 900, end: 960 },
];

export default function Demo({ variant = "light" }: { variant?: string }) {
  const theme = variant === "dark" ? "dark" : "light";
  return (
    <div className={`flex min-h-full w-full items-start justify-center p-4 sm:p-8 ${theme === "dark" ? "bg-[#09090a]" : "bg-[#ebe8e0]"}`}>
      <DayPlanner theme={theme} heading="Thursday 12 November" tasks={TASKS} fixed={FIXED} defaultPlan={{ spec: 600, inbox: 510 }} start={480} end={1080} now={640} />
    </div>
  );
}
