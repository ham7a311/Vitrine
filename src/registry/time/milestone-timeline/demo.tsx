"use client";
import { MilestoneTimeline, type Milestone } from "./MilestoneTimeline";

const NOW = Date.UTC(2026, 9, 6, 15, 20);
const d = (y: number, mo: number, day: number) => new Date(Date.UTC(y, mo, day, 9));

const MILESTONES: Milestone[] = [
  { title: "Research", at: d(2026, 7, 3), note: "Interviews with 24 teams" },
  { title: "Design", at: d(2026, 7, 31), note: "Prototype signed off" },
  { title: "Private beta", at: d(2026, 8, 21), note: "40 workspaces" },
  { title: "Public beta", at: d(2026, 9, 19), note: "Open sign-ups" },
  { title: "Launch", at: d(2026, 10, 16), note: "Pricing goes live" },
];

export default function Demo({ variant = "light" }: { variant?: string }) {
  const theme = variant === "dark" ? "dark" : "light";
  return (
    <div className={`mltl-demo mltl-demo--${theme}`}>
      <MilestoneTimeline milestones={MILESTONES} now={new Date(NOW)} theme={theme} />
    </div>
  );
}
