"use client";
import { useState } from "react";
import { LessonPath, type PathUnit } from "./LessonPath";

const UNITS: PathUnit[] = [
  { id: "u1", title: "Getting around Muscat", subtitle: "Ask for directions, read signs", color: "green", lessons: [
    { id: "l1", title: "Greetings", xp: 10, state: "done" },
    { id: "l2", title: "At the souq", xp: 10, state: "done" },
    { id: "l3", title: "Ordering coffee", xp: 15, state: "current" },
    { id: "l4", title: "Taking a taxi", xp: 15, state: "locked" },
    { id: "l5", title: "Unit review", xp: 20, state: "locked" },
  ] },
  { id: "u2", title: "Working days", subtitle: "Meetings, emails and small talk", color: "blue", lessons: [
    { id: "l6", title: "Introductions", xp: 10, state: "locked" },
    { id: "l7", title: "Scheduling", xp: 15, state: "locked" },
  ] },
];

export default function Demo({ variant = "light" }: { variant?: string }) {
  const dark = variant === "dark";
  const [started, setStarted] = useState("");
  return (
    <div className={`flex min-h-full w-full justify-center px-4 py-10 ${dark ? "bg-[#131f24]" : "bg-white"}`}>
      <div className="w-full max-w-[26rem]">
        <LessonPath units={UNITS} theme={dark ? "dark" : "light"} onStart={(id) => setStarted(UNITS.flatMap((u) => u.lessons).find((l) => l.id === id)?.title ?? "")} />
        <p role="status" className={`mt-6 text-center text-[13px] font-bold ${dark ? "text-[#8ea3ad]" : "text-[#777]"}`} style={{ fontFamily: "Nunito, system-ui, sans-serif" }}>{started ? `Demo · would open “${started}”` : "Press a lesson to see what it holds."}</p>
      </div>
    </div>
  );
}
