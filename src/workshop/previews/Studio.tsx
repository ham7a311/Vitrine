"use client";

import { useRef } from "react";
import { CurtainFooter } from "@/registry/footers/curtain-footer/CurtainFooter";
import { HighlighterList, type HighlighterItem } from "@/registry/cards/highlighter-row/HighlighterRow";
import { ApproachCard } from "@/registry/cards/approach-card/ApproachCard";
import { VoicesCarousel, type Voice } from "@/registry/sections/voices-carousel/VoicesCarousel";
import { FocusFaq } from "@/registry/faq/focus-faq/FocusFaq";
import { HalftoneCta } from "@/registry/ctas/halftone-cta/HalftoneCta";

const icon = (d: string) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const SERVICES: HighlighterItem[] = [
  { title: "Product design", description: "From the first sketch to a tested prototype: research, flows, interface and the details that make it feel finished.", tags: ["Research", "Interface"], icon: icon("M4 20l4-1 11-11-3-3L5 16l-1 4ZM14 6l3 3") },
  { title: "Engineering", description: "Production web and mobile apps, built by the same people who designed them, so nothing is lost in handover.", tags: ["Web", "Mobile"], icon: icon("M8 8l-4 4 4 4M16 8l4 4-4 4M13 5l-2 14") },
  { title: "Design systems", description: "Components, tokens and documentation your team will actually use, with accessibility built in from day one.", tags: ["Systems", "Accessibility"], icon: icon("M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z") },
];

const VOICES: Voice[] = [
  { id: "v1", name: "Salim Al-Harthy", role: "Director at Harbour Hall", session: "Project: Booking and events platform", quote: "They asked better questions in the first week than we had asked ourselves in a year, and then shipped the answer." },
  { id: "v2", name: "Maryam Al-Kindi", role: "Operations lead at Sohar Port Logistics", session: "Project: Shipment tracking portal", quote: "Our customers stopped calling to ask where their containers were. That was the whole brief, and it worked." },
  { id: "v3", name: "Aisha Al-Balushi", role: "Head of product at Wayfinder", session: "Project: Design system", quote: "Six months later the system is still the first thing new designers reach for. That's the real test." },
];

/** The ground plate under the voices: late light through a window, drawn rather than photographed. */
const PLATE = `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2688 1220" preserveAspectRatio="xMidYMid slice">
<defs>
<radialGradient id="g" cx="62%" cy="38%" r="70%"><stop offset="0" stop-color="#5a3a1c"/><stop offset=".45" stop-color="#2a1d12"/><stop offset="1" stop-color="#120e0a"/></radialGradient>
<linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3c592" stop-opacity=".55"/><stop offset="1" stop-color="#e8a24a" stop-opacity="0"/></linearGradient>
<filter id="b"><feGaussianBlur stdDeviation="18"/></filter>
</defs>
<rect width="2688" height="1220" fill="url(#g)"/>
<g filter="url(#b)" transform="skewX(-28) translate(900 0)">${[0, 1, 2, 3, 4].map((i) => `<rect x="${i * 190}" y="120" width="92" height="1100" fill="url(#s)"/>`).join("")}</g>
<rect y="880" width="2688" height="340" fill="#0c0907" opacity=".55"/>
</svg>`)}`;

const FAQ = [
  { q: "How do projects usually start?", a: "With a two-week discovery: interviews, a look at what you have, and a written plan with a fixed price for the first phase." },
  { q: "Do you work with in-house teams?", a: "Yes. Most projects end with your team owning the code and the design system, so we build alongside them from the start." },
  { q: "What does a typical engagement cost?", a: "Discovery is fixed-price. Build phases are priced per phase, usually between six and sixteen weeks of a small team." },
  { q: "Where are you based?", a: "Muscat, working with clients across the Gulf and Europe. We keep four hours of overlap with every client's working day." },
];

export default function Studio() {
  const scroller = useRef<HTMLDivElement>(null);
  return (
    <div ref={scroller} className="h-full w-full overflow-y-auto bg-[#16130f] text-[#efe8dc]" style={{ fontFamily: "Geist, ui-sans-serif, system-ui" }}>
      <CurtainFooter
        scrollRef={scroller}
        wordmark="Halden"
        columns={[
          { title: "Studio", links: ["Services", "Work", "Clients", "Careers"] },
          { title: "Contact", links: ["hello@halden.studio", "+968 2412 0000", "Muscat, Oman"] },
          { title: "Elsewhere", links: ["LinkedIn", "Dribbble", "GitHub"] },
        ]}
      >
        <div className="bg-[#16130f]">
          <header className="mx-auto flex max-w-[64rem] items-center justify-between px-5 py-5 sm:px-8">
            <span className="font-[family-name:Instrument_Serif] text-[1.4rem] tracking-[-0.01em]">Halden</span>
            <nav aria-label="Studio" className="hidden items-center gap-6 text-[0.875rem] text-[#a8a59c] sm:flex">
              <a href="#services" className="py-2 hover:text-[#efe8dc]">Services</a>
              <a href="#work" className="py-2 hover:text-[#efe8dc]">Work</a>
              <a href="#clients" className="py-2 hover:text-[#efe8dc]">Clients</a>
            </nav>
            <a href="#contact" className="rounded-full bg-[#e8a24a] px-4 py-1.5 text-[0.8125rem] font-medium text-[#1a140c]">Start a project</a>
          </header>

          <section className="mx-auto max-w-[64rem] px-5 pb-20 pt-16 sm:px-8 sm:pt-24">
            <p className="font-[family-name:Geist_Mono] text-[0.6875rem] uppercase tracking-[0.16em] text-[#8a867c]">Design and engineering studio · Muscat</p>
            <h1 className="mt-5 max-w-[15ch] font-[family-name:Instrument_Serif] text-[clamp(2.6rem,7vw,5rem)] leading-[1] tracking-[-0.025em]">
              We build software people <em className="text-[#e8a24a]">keep</em> using.
            </h1>
            <p className="mt-6 max-w-[46ch] text-[1rem] leading-relaxed text-[#a8a59c]">
              A small team that designs and builds products for companies in the Gulf and Europe — from the first interview to the last accessibility pass.
            </p>
          </section>

          <section id="services" className="mx-auto max-w-[64rem] px-5 pb-20 sm:px-8">
            <h2 className="font-[family-name:Geist_Mono] text-[0.6875rem] uppercase tracking-[0.16em] text-[#8a867c]">What we do</h2>
            <div className="mt-6">
              <HighlighterList items={SERVICES} />
            </div>
          </section>

          <section id="work" className="mx-auto max-w-[64rem] px-5 pb-20 sm:px-8">
            <h2 className="font-[family-name:Geist_Mono] text-[0.6875rem] uppercase tracking-[0.16em] text-[#8a867c]">Selected work</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <ApproachCard index="01" year="2026" title="Harbour Hall" summary="A booking and events platform for a waterfront venue: tickets, seating and a calm check-in on the door." stack={["Next.js", "Stripe", "Postgres"]} accent="#e8a24a" />
              <ApproachCard index="02" year="2025" title="Sohar Port" summary="Shipment tracking for customers who used to call to ask where their containers were." stack={["React", "Maps", "Node"]} accent="#e8a24a" />
            </div>
          </section>
        </div>

        <div id="clients">
          <VoicesCarousel
            voices={VOICES}
            eyebrowIndex="03"
            title="Clients"
            image={PLATE}
            lead={
              <>
                In their words, <em>a year after launch</em>.
              </>
            }
          />
        </div>

        <div className="bg-[#16130f] pb-20 pt-4">
          <div className="mx-auto max-w-[64rem] px-5 sm:px-8">
            <FocusFaq items={FAQ} title="Before you ask" accent="#e8a24a" />
          </div>
          <div id="contact" className="mx-auto mt-20 max-w-[40rem] px-5">
            <HalftoneCta
              badge="Taking projects for spring"
              heading={
                <>
                  Have something worth <em>building carefully?</em>
                </>
              }
              subtext="Tell us what you're making. We reply within two working days with honest questions and a first plan."
              action={{ href: "#contact", label: "Start a project" }}
            />
          </div>
        </div>
      </CurtainFooter>
    </div>
  );
}
