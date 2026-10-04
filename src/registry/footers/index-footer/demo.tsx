"use client";

import { IndexFooter } from "./IndexFooter";

export default function Demo() {
  return (
    <div className="flex min-h-full w-full items-end bg-[#0c0b0a]">
      <IndexFooter
        owner="Hamza Al-Bulushi"
        colophon="Set in Instrument Serif & Hanken Grotesk · Made in Muscat"
        columns={[
          { letter: "A", entries: [{ term: "About", ref: "p. 2" }, { term: "Archive", ref: "2019–" }, { term: "AI & Chat", ref: "12" }] },
          { letter: "C", entries: [{ term: "Case studies", ref: "6" }, { term: "Components", ref: "100" }, { term: "Contact", ref: "@" }] },
          { letter: "M", entries: [{ term: "Masar", ref: "2025" }, { term: "Motion notes", ref: "9" }, { term: "Muscat, Oman", ref: "GMT+4" }] },
          { letter: "W", entries: [{ term: "Wally", ref: "2024" }, { term: "Writing", ref: "14" }, { term: "Work with me", ref: "→" }] },
        ]}
      />
    </div>
  );
}
