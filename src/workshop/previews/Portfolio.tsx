"use client";

import { useRef } from "react";
import { MastheadNav } from "@/registry/navbars/masthead-nav/MastheadNav";
import { DrawLink } from "@/registry/buttons/draw-link/DrawLink";
import { HighlighterList, type HighlighterItem } from "@/registry/cards/highlighter-row/HighlighterRow";
import { MeanderTimeline, type TimelineEntry } from "@/registry/cards/meander-timeline/MeanderTimeline";
import { SignOffFooter } from "@/registry/footers/sign-off-footer/SignOffFooter";

const icon = (d: string) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const WORK: HighlighterItem[] = [
  { title: "Masar", description: "A trip planner for Oman that turns scattered bookings, routes and tickets into one calm itinerary.", tags: ["Product", "2025"], icon: icon("M3 18l6-12 4 8 3-5 5 9H3Z") },
  { title: "Wally", description: "A shared wallet for households: split, settle and see where the month went, without a spreadsheet.", tags: ["Mobile", "2024"], icon: icon("M4 7h16v12H4zM4 7l2-3h12l2 3M16 13h2") },
  { title: "OCS", description: "Website and design system for Oman Computing Society: events, membership and a team page with seals.", tags: ["Web", "2024"], icon: icon("M12 3l8 4v6c0 4-3.5 7-8 8-4.5-1-8-4-8-8V7l8-4Z") },
  { title: "Vitrine", description: "A library of interface components with a point of view, and the workshop for building with them.", tags: ["Open source", "2026"], icon: icon("M4 13h16v6H4zM4 11l14-6") },
];

const ROLES: TimelineEntry[] = [
  { id: "r1", day: "01", month: "Sep", year: "2025", title: "Software engineer, TransOcean", tag: "Current", description: "Building the booking and tracking platform for a regional logistics company: route planning, live shipment status and the customer portal.", meta: [{ label: "Stack", value: "Next.js · Postgres" }, { label: "Where", value: "Muscat" }] },
  { id: "r2", day: "15", month: "Jan", year: "2024", title: "Design lead, Oman Computing Society", tag: "Volunteer", description: "Led the society's website and design system, and ran monthly critique sessions for student designers.", meta: [{ label: "Team", value: "8 people" }] },
  { id: "r3", day: "05", month: "Sep", year: "2021", title: "BSc Computer Science, GUtech", tag: "Education", description: "Human–computer interaction focus. Thesis on how people describe routes on a campus without street names.", meta: [{ label: "Where", value: "Halban, Muscat" }] },
];

export default function Portfolio() {
  const scroller = useRef<HTMLDivElement>(null);
  return (
    <div ref={scroller} className="h-full w-full overflow-y-auto bg-[#0b080d] text-[#efe8dc]" style={{ fontFamily: "Geist, ui-sans-serif, system-ui" }}>
      <MastheadNav
        name="Hamza Al-Bulushi"
        links={[
          { label: "Work", href: "#work" },
          { label: "Experience", href: "#experience" },
          { label: "Contact", href: "#contact" },
        ]}
        cta={{ label: "Email", href: "mailto:hello@hamza.dev" }}
        meta={["Muscat · Software engineer", "Available for new work"]}
        scrollRef={scroller}
      />
      <main className="mx-auto max-w-[62rem] px-5 pb-20 pt-[8.5rem] sm:px-8">
        <p className="max-w-[34ch] font-[family-name:Instrument_Serif] text-[clamp(1.6rem,4vw,2.4rem)] leading-[1.2] tracking-[-0.01em] text-[#d9d2c6]">
          I design and build calm, careful software. Currently building <DrawLink href="#work">Vitrine</DrawLink>, writing about{" "}
          <DrawLink href="#work">interface motion</DrawLink>, and working at <DrawLink href="#experience">TransOcean</DrawLink>.
        </p>

        <section id="work" className="mt-24">
          <h2 className="font-[family-name:Geist_Mono] text-[0.6875rem] uppercase tracking-[0.16em] text-[#6f6a74]">Selected work</h2>
          <div className="mt-6">
            <HighlighterList items={WORK} />
          </div>
        </section>

        <section id="experience" className="mt-24">
          <h2 className="font-[family-name:Geist_Mono] text-[0.6875rem] uppercase tracking-[0.16em] text-[#6f6a74]">Experience</h2>
          <div className="mt-6">
            <MeanderTimeline entries={ROLES} expandFirst />
          </div>
        </section>
      </main>
      <div id="contact">
        <SignOffFooter
          line="Let's make something careful."
          email="hello@hamza.dev"
          city="Muscat"
          timeZone="Asia/Muscat"
          owner="Hamza Al-Bulushi"
          links={[
            { label: "GitHub", href: "#" },
            { label: "LinkedIn", href: "#" },
            { label: "Read.cv", href: "#" },
          ]}
        />
      </div>
    </div>
  );
}
