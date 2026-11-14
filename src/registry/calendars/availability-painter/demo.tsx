"use client";

import { AvailabilityPainter, type Person } from "./AvailabilityPainter";

const DAYS = ["Mon 16", "Tue 17", "Wed 18", "Thu 19", "Fri 20"];
const h = (hour: number, min = 0) => hour * 60 + min;
const PEOPLE: Person[] = [
  { name: "Amara", free: [{ day: 0, from: h(9), to: h(12) }, { day: 1, from: h(13), to: h(17) }, { day: 2, from: h(9), to: h(11) }, { day: 3, from: h(14), to: h(18) }, { day: 4, from: h(9), to: h(13) }] },
  { name: "Jonas", free: [{ day: 0, from: h(10, 30), to: h(15) }, { day: 1, from: h(14), to: h(18) }, { day: 2, from: h(13), to: h(16) }, { day: 3, from: h(9), to: h(12) }, { day: 3, from: h(15), to: h(17) }, { day: 4, from: h(11), to: h(15) }] },
  { name: "Mei", free: [{ day: 0, from: h(9), to: h(11) }, { day: 1, from: h(9), to: h(10, 30) }, { day: 1, from: h(14, 30), to: h(16, 30) }, { day: 2, from: h(14), to: h(18) }, { day: 3, from: h(15, 30), to: h(18) }, { day: 4, from: h(12), to: h(14) }] },
];
// You have already said Monday morning and Friday first thing: no time is shared yet.
const MINE = ["0:2", "0:3", "0:4", "0:5", "4:0", "4:1", "4:2", "4:3"];

export default function Demo({ variant = "light" }: { variant?: string }) {
  const theme = variant === "dark" ? "dark" : "light";
  return (
    <div className={`flex min-h-full w-full items-center justify-center p-4 sm:p-8 ${theme === "dark" ? "bg-[#09090b]" : "bg-[#f0f0f3]"}`}>
      <AvailabilityPainter theme={theme} days={DAYS} people={PEOPLE} defaultValue={MINE} start={h(9)} end={h(18)} minutes={60} />
    </div>
  );
}
