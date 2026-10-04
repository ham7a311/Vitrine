"use client";

import type { ReactNode } from "react";
import { SilkField, SILK_PALETTES } from "@/registry/backgrounds/silk-field/SilkField";
import { CausticPool } from "@/registry/backgrounds/caustic-pool/CausticPool";
import { FlourishName } from "@/registry/type/flourish-name/FlourishName";
import { TidefillButton } from "@/registry/buttons/tidefill-button/TidefillButton";
import { SpecimenCard } from "@/registry/cards/specimen-card/SpecimenCard";
import { LenticularCard } from "@/registry/cards/lenticular-card/LenticularCard";
import { HaloFrame } from "@/registry/cards/halo-frame/HaloFrame";

const serif = { fontFamily: "'Instrument Serif', Georgia, serif" };
const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

/** Each project is catalogued as an object: its mark, drawn as a small specimen. */
const Mark = ({ children }: { children: ReactNode }) => (
  <svg viewBox="0 0 200 170" fill="none" aria-hidden="true">
    <ellipse cx="100" cy="154" rx="52" ry="6" fill="#000" opacity="0.35" />
    {children}
  </svg>
);

const WORK = [
  {
    catalogue: "Project Nº 01",
    title: "Qalam",
    subtitle: "Identity and type system for an Arabic writing school in Muscat.",
    tag: [{ label: "Role", value: "Identity" }, { label: "Year", value: "2025" }, { label: "Scope", value: "Logo · Type · Signage" }],
    mark: (
      <Mark>
        <path d="M52 118 C 70 60, 118 38, 150 46 C 128 60, 104 92, 96 130" stroke="#efe8dc" strokeWidth="9" strokeLinecap="round" />
        <circle cx="140" cy="112" r="7" fill="#c8b9ea" />
      </Mark>
    ),
  },
  {
    catalogue: "Project Nº 02",
    title: "Wally",
    subtitle: "Product design for a shared household wallet, from first sketch to 40k users.",
    tag: [{ label: "Role", value: "Product" }, { label: "Year", value: "2024" }, { label: "Scope", value: "iOS · Android" }],
    mark: (
      <Mark>
        <rect x="52" y="44" width="96" height="96" rx="26" fill="#2a1d45" stroke="#c8b9ea" strokeOpacity="0.6" />
        <path d="M74 80 L 88 112 L 100 90 L 112 112 L 126 80" stroke="#efe8dc" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      </Mark>
    ),
  },
  {
    catalogue: "Project Nº 03",
    title: "Masar",
    subtitle: "Wayfinding and trip planner for Oman's heritage routes, with the Ministry of Tourism.",
    tag: [{ label: "Role", value: "Brand + UX" }, { label: "Year", value: "2023" }, { label: "Scope", value: "Web · Print · Maps" }],
    mark: (
      <Mark>
        <path d="M40 128 L 78 64 L 100 100 L 122 72 L 160 128 Z" fill="#1d1430" stroke="#efe8dc" strokeWidth="2" strokeLinejoin="round" />
        <path d="M60 138 C 90 118, 116 142, 148 120" stroke="#c8b9ea" strokeWidth="3" strokeDasharray="2 7" strokeLinecap="round" />
      </Mark>
    ),
  },
];

/** The Wally app icon, before and after the redesign: one tilt shows the whole argument. */
function Icon({ after }: { after?: boolean }) {
  return (
    <div className="flex h-full flex-col justify-between p-6" style={{ background: after ? "radial-gradient(90% 70% at 30% 20%, #3b2a66, #140d24 70%)" : "linear-gradient(160deg, #3a8f4c, #1e5a2e)", color: "#f4efe6" }}>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] opacity-75">Wally · {after ? "2024, after" : "2022, before"}</p>
      <div className="mx-auto grid size-28 place-items-center rounded-[28px]" style={after ? { background: "#2a1d45", boxShadow: "inset 0 0 0 1px rgb(200 185 234 / 0.5), 0 18px 40px rgb(0 0 0 / 0.45)" } : { background: "linear-gradient(180deg,#ffd54a,#f29d1f)", boxShadow: "0 6px 0 #b86d0c" }}>
        {after ? (
          <svg viewBox="0 0 60 40" className="w-16" fill="none" aria-hidden="true">
            <path d="M6 8 L 18 34 L 30 16 L 42 34 L 54 8" stroke="#efe8dc" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <span className="text-[2.6rem] font-black tracking-tight text-[#1e5a2e]" style={{ fontFamily: "Arial Black, sans-serif" }}>$W</span>
        )}
      </div>
      <p className="text-[0.875rem] leading-snug opacity-85">{after ? "One letter, one stroke, readable at 29 px." : "A dollar sign in a country that pays in rials."}</p>
    </div>
  );
}

export default function Showcase() {
  return (
    <div className="h-full w-full overflow-y-auto bg-[#0c0816] text-[#efe8dc]" style={{ fontFamily: "Geist, ui-sans-serif, system-ui" }}>
      <SilkField palette={SILK_PALETTES.violet} lens="drift" lensRadius={0.3} intensity={0.62} className="min-h-[min(46rem,100svh)]">
        <div className="flex min-h-[min(46rem,100svh)] flex-col px-5 pb-12 pt-5 sm:px-10">
          <header className="flex items-center justify-between gap-4 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-[#d9c8ff]/80">
            <span>Hamza Al-Bulushi</span>
            <span className="inline-flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-[#9fe3c4]" aria-hidden="true" />
              Booking from November
            </span>
          </header>
          <div className="mt-auto flex flex-col items-start">
            <FlourishName name="Hamza" ink="#efe8dc" />
            <p className="mt-4 max-w-[30ch] text-[clamp(1.35rem,3.4vw,2rem)] leading-[1.2] text-[#efe8dc]" style={serif}>
              Brand and product designer in Muscat. I make identities that survive contact with software.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <TidefillButton tone="cream" onClick={() => go("sc-work")}>
                See the work
              </TidefillButton>
              <TidefillButton tone="lilac" onClick={() => go("sc-contact")}>
                Start a project
              </TidefillButton>
            </div>
          </div>
        </div>
      </SilkField>

      <section id="sc-work" className="mx-auto max-w-[70rem] px-5 py-24 sm:px-8">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="text-[clamp(2rem,5vw,3rem)] leading-none tracking-[-0.01em]" style={serif}>
            Selected work
          </h2>
          <p className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-[#9d90b8]">Three of twenty-one, 2023–2025</p>
        </div>
        <div className="mt-12 grid justify-items-center gap-x-8 gap-y-14 px-5 sm:grid-cols-2 sm:px-0 lg:grid-cols-3">
          {WORK.map((w) => (
            <SpecimenCard key={w.title} href="#sc-work" specimen={w.mark} catalogue={w.catalogue} title={w.title} subtitle={w.subtitle} tag={w.tag} />
          ))}
        </div>
      </section>

      <section className="border-y border-white/[0.07] bg-[#0f0a1c]">
        <div className="mx-auto grid max-w-[70rem] items-center gap-12 px-5 py-24 sm:px-8 md:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="max-w-[34rem]">
            <p className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-[#9d90b8]">Case note · Wally</p>
            <h2 className="mt-4 text-[clamp(1.9rem,4.4vw,2.75rem)] leading-[1.05]" style={serif}>
              The icon was the whole brief, in miniature.
            </h2>
            <p className="mt-5 text-[1rem] leading-relaxed text-[#c9bedc]">
              The old mark shouted in a currency nobody in the household used. The new one is a single stroke that reads at home-screen size and scales up to the card and the storefront. Tilt the card to compare.
            </p>
          </div>
          <div className="w-full max-w-[20rem] justify-self-center">
            <LenticularCard label="Wally app icon, before and after the redesign" front={<Icon />} back={<Icon after />} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[40rem] px-5 py-24 sm:px-8">
        <HaloFrame speed={9} colors={["#7c5cc4", "#c8b9ea", "#efe8dc"]}>
          <blockquote className="halo-quote" style={{ background: "#0e0a18" }}>
            <p className="halo-quote__kicker" style={{ color: "#c8b9ea" }}>
              Rashid Al-Kindi · Founder, Qalam
            </p>
            <p className="halo-quote__text">Hamza asked better questions about our students than we had ever asked ourselves. The identity came out of those answers.</p>
          </blockquote>
        </HaloFrame>
      </section>

      <div id="sc-contact">
        <CausticPool tint="#b9a6ec" depth="#0a0612" speed={0.6} className="min-h-[30rem]">
          {/* a scrim on the reading side keeps the text on calm water */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#0a0612_0%,rgb(10_6_18/0.82)_38%,rgb(10_6_18/0.2)_75%,transparent)] max-sm:bg-[rgb(10_6_18/0.72)]" aria-hidden="true" />
          <div className="relative mx-auto flex min-h-[30rem] max-w-[70rem] flex-col justify-center px-5 py-20 sm:px-8">
            <h2 className="max-w-[16ch] text-[clamp(2.3rem,6vw,4rem)] leading-[1]" style={serif}>
              Have something that needs a face?
            </h2>
            <p className="mt-5 max-w-[42ch] text-[1rem] leading-relaxed text-[#d4c9e6]">
              I take on two identity projects and one product engagement at a time. Tell me what you're making and when it needs to exist.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <TidefillButton tone="lilac" onClick={() => (window.location.href = "mailto:maya@rahbi.studio")}>
                Write to Hamza
              </TidefillButton>
              <span className="font-mono text-[0.8125rem] text-[#d9c8ff]">maya@rahbi.studio</span>
            </div>
          </div>
        </CausticPool>
        <footer className="flex flex-wrap justify-between gap-3 bg-[#0a0612] px-5 py-6 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-[#8a7fa3] sm:px-10">
          <span>© 2026 Hamza Al-Bulushi</span>
          <span>Muscat · Instagram · Behance · Read.cv</span>
        </footer>
      </div>
    </div>
  );
}
