"use client";
import { TimezoneOverlap, type Person } from "./TimezoneOverlap";

const TEAM: Person[] = [
  { id: "h", name: "Hamza", tz: "Asia/Muscat", start: "08:00", end: "16:00", workdays: [0, 1, 2, 3, 4] },
  { id: "l", name: "Layla", tz: "Europe/London", start: "09:00", end: "17:30", workdays: [1, 2, 3, 4, 5] },
  { id: "o", name: "Omar", tz: "Asia/Kolkata", start: "10:00", end: "18:30", workdays: [1, 2, 3, 4, 5] },
  { id: "s", name: "Salma", tz: "America/New_York", start: "07:00", end: "15:00", workdays: [1, 2, 3, 4, 5] },
];

export default function Demo({ variant = "light" }: { variant?: string }) {
  const dark = variant === "dark";
  return (
    <div className={`flex min-h-full w-full items-center justify-center px-4 py-10 ${dark ? "bg-[#0c0d0e]" : "bg-[#e6e7e3]"}`}>
      <div className="w-full max-w-[56rem]">
        <TimezoneOverlap title="Masar weekly sync" people={TEAM} reference="Asia/Muscat" date="2026-10-06" theme={dark ? "dark" : "light"} />
      </div>
    </div>
  );
}
