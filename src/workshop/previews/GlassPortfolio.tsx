"use client";

import { useState, useRef } from "react";
import { GlassTiles } from "@/registry/backgrounds/glass-tiles/GlassTiles";
import { GlowPointer } from "@/registry/cursors/glow-pointer/GlowPointer";
import { HighlightSweep, SweepText } from "@/registry/cursors/highlight-sweep/HighlightSweep";
import { Highlight, HighlightCursor } from "@/registry/cursors/highlight-cursor/HighlightCursor";
import { IntentLabel } from "@/registry/cursors/intent-label/IntentLabel";
import { HoverReel, type ReelProject } from "@/registry/media/hover-reel/HoverReel";
import { GlassCard } from "@/registry/cards/glass-card/GlassCard";
import { TidefillButton } from "@/registry/buttons/tidefill-button/TidefillButton";
import { LedgerCylinder } from "@/registry/stats/ledger-cylinder/LedgerCylinder";

const PALETTE = { glow: "#9ec4e8", deep: "#16324d", ground: "#05060c" };
const serif = { fontFamily: "'Instrument Serif', Georgia, serif" };

const PROJECTS: ReelProject[] = [
  { title: "Masar", label: "Wayfinding · 2025", href: "#gp-case" },
  { title: "Qalam", label: "Identity · 2025", href: "#gp-work" },
  { title: "Wally", label: "Product · 2024", href: "#gp-work" },
  { title: "OCS", label: "Design system · 2024", href: "#gp-work" },
];

export default function GlassPortfolio() {
  const scroller = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const go = (id: string) => {
    const target = scroller.current?.querySelector<HTMLElement>(`#${CSS.escape(id)}`);
    if (!target) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  return (
    <div
      ref={scroller}
      className="gp-scroll h-full w-full overflow-y-auto bg-[#05060c] text-[#efe8dc]"
      style={{ fontFamily: "Geist, ui-sans-serif, system-ui" }}
    >
      <GlowPointer color="#b9cce4" arrow="light" className="bg-[#05060c]">
        <GlassTiles palette={PALETTE} columns={7} speed={0.75} style={{ minHeight: "100svh" }}>
          <div className="flex min-h-[100svh] flex-col px-5 pb-12 pt-6 sm:px-10 sm:pt-8">
            <header className="flex items-center justify-between gap-4 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-[#d5e4f4]/75">
              <span>Hamza Al-Bulushi</span>
              <span>Muscat</span>
            </header>
            <div className="mt-auto max-w-[42rem] bg-[linear-gradient(90deg,rgb(5_6_12/0.82)_0%,rgb(5_6_12/0.62)_58%,transparent_100%)] py-3 pr-6 sm:pr-16">
              <p className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-[#b9cce4]">Product design</p>
              <h1 className="mt-4 max-w-[11ch] text-[clamp(3.25rem,9vw,6.5rem)] leading-[0.9] tracking-[-0.03em] text-[#efe8dc]" style={serif}>
                Work you can pick up.
              </h1>
              <p className="mt-5 max-w-[36ch] text-[1.05rem] leading-relaxed text-[#efe8dc]" style={{ textShadow: "0 1px 14px #05060c" }}>
                I design products for people who already know what they need. Four projects below. Two open seats from November.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <TidefillButton tone="cream" onClick={() => go("gp-work")}>
                  See the work
                </TidefillButton>
                <TidefillButton tone="frost" onClick={() => go("gp-contact")}>
                  Start a project
                </TidefillButton>
              </div>
            </div>
          </div>
        </GlassTiles>
      </GlowPointer>

      <HighlightSweep color="#b9cce4" loop={false} className="bg-[#05060c] text-[#efe8dc]" style={{ fontFamily: "Geist, ui-sans-serif, system-ui" }}>
        <div className="mx-auto flex min-h-[70svh] max-w-[62rem] flex-col justify-center px-5 py-24 sm:px-10">
          <p className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-[#8ea4bb]">The practice</p>
          <SweepText
            as="h2"
            order={0}
            text={"[[The work should still make sense]]\nwhen the glass comes off."}
            className="mt-5 max-w-[16ch] text-[clamp(2.4rem,6vw,4.25rem)] leading-[1.02] tracking-[-0.03em]"
            style={serif}
          />
        </div>
      </HighlightSweep>

      <section id="gp-work" className="scroll-mt-8 border-t border-white/[0.06] py-20 sm:py-28">
        <div className="mx-auto mb-8 flex max-w-[72rem] flex-wrap items-baseline justify-between gap-3 px-[clamp(1.25rem,5vw,4rem)]">
          <h2 className="text-[clamp(2rem,5vw,3rem)] leading-none" style={serif}>
            Selected work
          </h2>
          <p className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-[#8ea4bb]">Four of twenty-one</p>
        </div>
        <IntentLabel theme="night" className="bg-[#05060c] text-[#efe8dc]">
          <div data-intent="Browse the work" data-intent-icon="view">
            <HoverReel theme="night" projects={PROJECTS} />
          </div>
        </IntentLabel>
      </section>

      <section className="border-y border-white/[0.06] bg-[#070910] px-5 py-24 sm:px-10">
        <div className="mx-auto grid max-w-[70rem] items-center gap-14 md:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="max-w-[34rem]">
            <p className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-[#8ea4bb]">Engagement</p>
            <h2 className="mt-4 text-[clamp(2rem,4.5vw,3rem)] leading-[1.05]" style={serif}>
              One engagement, written down before any screens.
            </h2>
            <p className="mt-5 text-[1rem] leading-relaxed text-[#c5d3e2]">
              Identity or product, not both in the same month. You get a plan with the decisions in it, then the work, then the files.
            </p>
          </div>
          <IntentLabel theme="night" className="justify-self-center">
            <GlassCard
              eyebrow="From November"
              title="Two projects at a time"
              price="Muscat, or remote"
              palette={PALETTE}
              features={["A written plan first", "You keep every file", "One button, the whole way"]}
              action={
                <TidefillButton tone="cream" data-intent="Start a project" data-intent-icon="view" onClick={() => go("gp-contact")}>
                  Start a project
                </TidefillButton>
              }
            />
          </IntentLabel>
        </div>
      </section>

      <HighlightCursor color="#b9cce4" className="bg-[#05060c] text-[#efe8dc]" style={{ fontFamily: "Geist, ui-sans-serif, system-ui" }}>
        <div id="gp-case" className="mx-auto flex min-h-[60svh] max-w-[46rem] scroll-mt-8 flex-col justify-center px-5 py-24 sm:px-10">
          <p className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-[#8ea4bb]">Case line · Masar</p>
          <Highlight
            as="h2"
            text={"The route was already known.\nThe sign was the part that failed."}
            className="mt-5 text-[clamp(2rem,5vw,3.4rem)] leading-[1.08] tracking-[-0.03em]"
            style={serif}
          />
        </div>
      </HighlightCursor>

      <LedgerCylinder
        scrollRoot={scroller}
        background="#05060c"
        stats={[
          { value: "21", label: "Projects shipped", color: "#b9cce4" },
          { value: "4 yrs", label: "In practice", color: "#efe8dc" },
          { value: "2", label: "At a time", color: "#9fd4c8" },
        ]}
        notes={{
          label: "Currently",
          items: ["Masar sign system, last round", "Qalam's reading room", "A calmer onboarding for Wally"],
          color: "#e8d5b5",
        }}
        status={{ lines: ["> studio: open from November", "> based: Muscat"], color: "#9fd4c8" }}
      />

      <section id="gp-contact" className="scroll-mt-8 border-t border-white/[0.06] px-5 py-24 sm:px-10">
        <IntentLabel theme="night" className="mx-auto max-w-[46rem]">
          <h2 className="max-w-[14ch] text-[clamp(2.4rem,6vw,4rem)] leading-[0.98]" style={serif}>
            Tell me what needs to exist.
          </h2>
          <p className="mt-5 max-w-[42ch] text-[1rem] leading-relaxed text-[#c5d3e2]">
            A paragraph is enough: what it is, who it is for, and when it has to be in the world.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <TidefillButton tone="frost" data-intent="Write to Hamza" data-intent-icon="external" onClick={() => { window.location.href = "mailto:hello@hamza.dev"; }}>
              Write to Hamza
            </TidefillButton>
            <button
              type="button"
              data-intent={copied ? "Copied" : "Copy email"}
              data-intent-icon={copied ? "check" : "copy"}
              className="rounded-sm font-mono text-[0.8125rem] text-[#b9cce4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b9cce4]"
              onClick={() => {
                navigator.clipboard?.writeText("hello@hamza.dev").then(() => {
                  setCopied(true);
                  window.setTimeout(() => setCopied(false), 1600);
                }, () => {});
              }}
            >
              hello@hamza.dev
            </button>
          </div>
        </IntentLabel>
        <footer className="mx-auto mt-20 flex max-w-[70rem] flex-wrap justify-between gap-3 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-[#8ea4bb]">
          <span>© 2026 Hamza Al-Bulushi</span>
          <span>Muscat</span>
        </footer>
      </section>

      <style>{`
        .gp-scroll { scroll-behavior: smooth; }
        @media (prefers-reduced-motion: reduce) {
          .gp-scroll { scroll-behavior: auto; }
        }
      `}</style>
    </div>
  );
}
