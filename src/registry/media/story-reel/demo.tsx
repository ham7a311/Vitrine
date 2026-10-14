"use client";
import { StoryReel, type StoryPerson } from "./StoryReel";

const PEOPLE: StoryPerson[] = [
  { name: "Mira Okafor", colors: ["#f2786a", "#7a3cc9"], stories: [
    { id: "a1", kind: "dawn", caption: "First light on the ridge — 5:42 and worth it.", ago: "2h" },
    { id: "a2", kind: "type", caption: "Note to self for the week.", quote: "Make the small thing. Then the next small thing.", ago: "2h" },
  ] },
  { name: "Theo Raines", colors: ["#2f6fd1", "#1b2a66"], stories: [
    { id: "b1", kind: "city", caption: "Studio's still lit at eleven. Launch is Thursday.", ago: "5h" },
    { id: "b2", kind: "type", caption: "Overheard in the lift.", quote: "“Ship it, then make it beautiful.”", ago: "4h" },
    { id: "b3", kind: "sea", caption: "Escaped to the coast for an hour.", ago: "1h" },
  ] },
  { name: "Ines Moreau", colors: ["#f2b33d", "#d2513a"], stories: [
    { id: "c1", kind: "sea", caption: "Sunday sail from Port Lunel.", ago: "8h" },
    { id: "c2", kind: "dawn", caption: "Walked back over the hills.", ago: "7h" },
  ] },
  { name: "Pip Kaur", colors: ["#25b38a", "#0f5c6b"], stories: [
    { id: "d1", kind: "type", caption: "Quote of the day from the reading group.", quote: "Gardens are slow arguments with the weather.", ago: "12h" },
  ] },
];

export default function Demo({ variant = "night" }: { variant?: string }) {
  const paper = variant === "paper";
  return (
    <div style={{ minHeight: "100%", display: "grid", placeItems: "center", padding: "24px 16px", background: paper ? "#e7e2d8" : "#070708" }}>
      <StoryReel people={PEOPLE} theme={paper ? "paper" : "night"} />
    </div>
  );
}
