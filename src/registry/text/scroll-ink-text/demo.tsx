"use client";

import { ScrollInkText } from "./ScrollInkText";

const TEXT =
  "We started Vitrine because planning a weekend in Oman shouldn’t take a weekend. {{One place}} for the table at Bait Al Luban, the dhow at sunset and the climb up Wadi Shab — booked together, {{shared with everyone,}} and quietly rearranged when the weather turns. So the only thing left for you to do is {{be there.}}";

export default function Demo({ variant = "night" }: { variant?: string }) {
  const theme = variant === "paper" ? "paper" : "night";
  return (
    <div className="h-full min-h-[560px] w-full">
      <ScrollInkText text={TEXT} theme={theme} signoff="— Hamza Al-Bulushi, for the Vitrine team" />
    </div>
  );
}
