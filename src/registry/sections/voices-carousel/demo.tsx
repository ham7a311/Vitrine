"use client";

import { VoicesCarousel, type Voice } from "./VoicesCarousel";

const VOICES: Voice[] = [
  {
    id: "v1",
    name: "Alex Morgan",
    role: "Product designer at Northstar",
    session: "Workshop: Designing for latency",
    quote: "I came for the talk and stayed for the hallway. Two hours later I had a prototype and three people I now message every week.",
  },
  {
    id: "v2",
    name: "Priya Raman",
    role: "Engineer at Halden & Co.",
    session: "Build night: Ship something small",
    quote: "Nobody asked what I already knew. They asked what I wanted to make — and then helped me make a smaller, better version of it.",
  },
  {
    id: "v3",
    name: "Jonah Okafor",
    role: "Student at Westbrook College",
    session: "Talk: Type on screens, revisited",
    quote: "It was the first room where asking a basic question felt like a contribution instead of an interruption.",
  },
  {
    id: "v4",
    name: "Mei Lindqvist",
    role: "Researcher at Lumen Labs",
    session: "Panel: A year of interviews",
    quote: "Honest, unpolished, useful. I left with a notebook full of things I'll actually try on Monday.",
  },
];

export default function Demo() {
  return (
    <div className="min-h-full w-full bg-[#0c0b0a]">
      <VoicesCarousel
        voices={VOICES}
        eyebrowIndex="04"
        title="Voices"
        lead={
          <>
            One person at a time, <em>after the lights went down</em>.
          </>
        }
        pullA={
          <>
            Rooms worth
            <br />
            being in.
          </>
        }
        pullB={
          <>
            After the
            <br />
            lights went down.
          </>
        }
        archive={{ label: "All past sessions", href: "#archive" }}
      />
    </div>
  );
}
