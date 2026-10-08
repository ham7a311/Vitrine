"use client";
import { PortfolioTerminal } from "./PortfolioTerminal";
import type { Portfolio } from "./shell";

// A fictional designer-engineer. Every name, project and address here is invented.
const NOOR: Portfolio = {
  handle: "noor@studio",
  name: "Noor Haddad",
  role: "Product designer who writes the front end",
  place: "Lisbon, GMT+0",
  bio: [
    "I design tools for people who work outdoors and on the move — harbourmasters, field ecologists, delivery crews — and I build the interfaces I draw, so nothing gets lost between the mock-up and the screen.",
    "Ten years in, I still care most about the boring parts: empty states, slow networks, gloves on a touchscreen.",
  ],
  now: "a tide-table app for small harbours, out this spring",
  projects: [
    { slug: "tidewater", name: "Tidewater", year: "2025", kind: "tide tables for small harbours", role: "Design and front end, solo", stack: ["Swift", "MapKit", "a small harmonic tide model"], summary: "Harbourmasters were reading tides off photocopied tables. Tidewater draws the next 48 hours as one line you can scrub with a thumb, and works with no signal at all.", outcome: "Used daily in 31 harbours; the printed tables were retired in two." },
    { slug: "ledgerline", name: "Ledgerline", year: "2024", kind: "bookkeeping for co-ops", role: "Lead designer, team of six", stack: ["React", "TypeScript", "Postgres"], summary: "A ledger that reads like a conversation: every entry says who, why and what changed, and nothing is ever deleted — only corrected, in the open.", outcome: "Month-end close went from four days to one afternoon." },
    { slug: "quiet-hours", name: "Quiet Hours", year: "2023", kind: "focus timer for shared studios", role: "Design, front end, hardware prototype", stack: ["Svelte", "Web Bluetooth", "an e-ink sign"], summary: "A small e-ink sign on the studio door shows who is heads-down and until when. Booking a quiet hour is one tap; breaking one costs a coffee.", outcome: "Adopted by 12 studios; interruptions halved in the pilot." },
    { slug: "field-notes", name: "Field Notes", year: "2022", kind: "survey app for ecologists", role: "Design lead, contract", stack: ["React Native", "SQLite", "offline sync"], summary: "Ecologists count species in the rain with wet fingers. Big targets, voice notes, and a sync that never asks you to choose which version wins.", outcome: "Replaced paper forms across 4 regional surveys." },
  ],
  experience: [
    { years: "2023 — now", title: "Independent", org: "Studio Haddad", note: "Design and front end for small, careful teams." },
    { years: "2019 — 2023", title: "Lead designer", org: "Harbour Labs", note: "Grew the design team from one to five; shipped Ledgerline." },
    { years: "2016 — 2019", title: "Designer & developer", org: "Atlas Field Co.", note: "Offline-first tools for survey crews." },
    { years: "2014 — 2016", title: "Junior designer", org: "Folio & Frame", note: "Editorial layouts, then my first React code." },
  ],
  skills: [
    { group: "Design", items: [["Interaction design", 0.95], ["Prototyping", 0.9], ["Type & layout", 0.8], ["Research", 0.65]] },
    { group: "Build", items: [["TypeScript & React", 0.9], ["CSS", 0.95], ["Swift", 0.6], ["Accessibility", 0.85]] },
  ],
  email: "hello@noorhaddad.example",
  links: [
    { label: "elsewhere", handle: "@noorhaddad (most places)" },
    { label: "studio", handle: "Rua das Gaivotas 14, Lisboa" },
  ],
};

export default function Demo({ variant = "night" }: { variant?: string }) {
  const paper = variant === "paper";
  return (
    <div className={`flex min-h-full w-full items-center justify-center p-3 sm:p-8 ${paper ? "bg-[#e4dfd2]" : "bg-[#0b0b0a]"}`}>
      <PortfolioTerminal portfolio={NOOR} theme={paper ? "paper" : "night"} />
    </div>
  );
}
