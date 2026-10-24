"use client";

import { useRef } from "react";
import { OrbitDawn } from "@/registry/backgrounds/orbit-dawn/OrbitDawn";
import { AgentRun, type AgentStep } from "@/registry/ai/agent-run/AgentRun";
import { SignalTiles, type SignalTile } from "@/registry/cards/signal-tiles/SignalTiles";
import { ScrubSparklineStats } from "@/registry/stats/scrub-sparkline-stats/ScrubSparklineStats";
import { GlowBasePricing } from "@/registry/pricing/glow-base-pricing/GlowBasePricing";
import { FocusFaq } from "@/registry/faq/focus-faq/FocusFaq";
import { RingFloodCta } from "@/registry/ctas/ring-flood-cta/RingFloodCta";
import { PrismRimButton } from "@/registry/buttons/prism-rim-button/PrismRimButton";
import { RIMS } from "@/registry/buttons/prism-rim-button/rim";
import { PhosphorGlassButton } from "@/registry/buttons/phosphor-glass-button/PhosphorGlassButton";
import { PreviewFonts } from "./fonts";

/*
 * One light source for the whole page: the violet dawn behind the hero. Everything below is near-black and quiet,
 * so the product demo is the only thing that moves in the foreground. Instrument Sans throughout, with Instrument
 * Serif italics for the one or two words that carry the claim.
 */
const ACCENT = "#c9a8ff";
const TOKENS = `.aic .rfcta { --rf-page: #07060c; --rf-ring: conic-gradient(from var(--rf-a) at 50% 50%, #c9a8ff, #ee9cf6, #7a4dff, #14b8c9, #c9a8ff); }`;
const FONT = '"Instrument Sans", Geist, ui-sans-serif, system-ui, sans-serif';

const STEPS: AgentStep[] = [
  { kind: "think", label: "Planning", ms: 900 },
  { kind: "search", label: "Searched for", target: "refund policy", meta: "3 documents", ms: 1100 },
  { kind: "read", label: "Read", target: "policies/refunds-2026.md", ms: 800 },
  { kind: "edit", label: "Drafted", target: "reply to ticket #4182", meta: "142 words", ms: 1400 },
  { kind: "run", label: "Checked", target: "tone and policy guardrails", meta: "passed", ms: 1300 },
];

const TILES: SignalTile[] = [
  { title: "Reads your policies", href: "#product", icon: "stack" },
  { title: "Cites every sentence", href: "#product", icon: "puzzle" },
  { title: "Drafts in your voice", href: "#product", icon: "send" },
  { title: "Waits for a person", href: "#product", icon: "pointer" },
  { title: "Learns from edits", href: "#product", icon: "redesign" },
  { title: "Works in 31 languages", href: "#product", icon: "globe" },
  { title: "Answers in seconds", href: "#product", icon: "bolt" },
  { title: "Fits your help desk", href: "#product", icon: "tools" },
  { title: "Handles refunds and orders", href: "#product", icon: "cart" },
  { title: "Live in a week", href: "#product", icon: "rocket" },
];

/** A repeatable month: a trend, a weekday rhythm and a little noise. */
function month(seed: number, base: number, trend: number, noise: number, decimals = 0) {
  let s = seed;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647) - 0.5;
  const f = 10 ** decimals;
  return Array.from({ length: 30 }, (_, i) => {
    const weekend = (i + 3) % 7 >= 5;
    const v = base * (1 + trend * (i / 29) + (weekend ? -0.18 : 0.04) + noise * rnd());
    return Math.round(v * f) / f;
  });
}

const FAQ = [
  { q: "Is our data used to train models?", a: "No. Prompts, files and outputs from your workspace are never used for training, and you set retention from zero days to a year." },
  { q: "Where is data processed?", a: "In the region you pick when you create the workspace: Bahrain or Frankfurt. It stays there, backups included." },
  { q: "Can it send replies on its own?", a: "Only if you allow it, per queue. By default every draft waits for a person, and the audit log shows who approved what." },
  { q: "How do we evaluate it before buying?", a: "Start a Build workspace with your team for 30 days. Nothing to install, no card, and your data is deleted if you don't continue." },
];

export default function AiCompany() {
  const scroller = useRef<HTMLDivElement>(null);
  const go = (id: string) => scroller.current?.querySelector(`#${id}`)?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });

  return (
    <div ref={scroller} className="aic h-full w-full overflow-y-auto bg-[#05031a] text-[#f4f1fb]" style={{ fontFamily: FONT }}>
      <PreviewFonts families={["Instrument Sans:wdth,wght@75..100,400..700"]} />
      <style>{TOKENS}</style>

      <OrbitDawn palette={["#05031a", "#7239ea", "#ee9cf6", "#fbf6ff"]} lift={1.05} speed={0.8} className="min-h-[min(46rem,100vh)]">
        <div className="flex min-h-[min(46rem,100vh)] flex-col px-5 pb-16 pt-5 sm:px-10">
          <header className="flex items-center justify-between gap-4">
            <span className="text-[1.25rem] font-semibold tracking-[-0.02em]">
              Meridian<span className="text-[#ee9cf6]">.</span>
            </span>
            <nav aria-label="Main" className="flex items-center gap-6 text-[0.875rem] text-[#d6cfe6]">
              <a href="#product" onClick={(e) => { e.preventDefault(); go("product"); }} className="hidden hover:text-white sm:inline">Product</a>
              <a href="#pricing" onClick={(e) => { e.preventDefault(); go("pricing"); }} className="hidden hover:text-white sm:inline">Pricing</a>
              <PhosphorGlassButton variant="text" arrow="→" onClick={() => go("start")}>Sign in</PhosphorGlassButton>
            </nav>
          </header>
          <div className="mx-auto mt-[7vh] flex max-w-[46rem] flex-col items-center text-center">
            <p className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-[#d6cfe6]">Agents for support teams · v3</p>
            <h1 className="mt-5 text-[clamp(2.75rem,7.5vw,5.5rem)] font-semibold leading-[0.95] tracking-[-0.04em]">
              Answers your customers{" "}
              <em className="font-normal" style={{ fontFamily: '"Instrument Serif", Georgia, serif' }}>
                can check
              </em>
              .
            </h1>
            <p className="mt-6 max-w-[44ch] text-[1.0625rem] leading-relaxed text-[#d6cfe6]">
              Meridian reads your policies and past tickets, drafts the reply, cites where every sentence came from, and waits for a person to send it.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-5">
              <PrismRimButton rim={RIMS.twilight} size={17} onClick={() => go("start")}>
                Start a 30-day trial
              </PrismRimButton>
              <PhosphorGlassButton variant="text" arrow="↓" onClick={() => go("product")}>
                Watch it work
              </PhosphorGlassButton>
            </div>
          </div>
        </div>
      </OrbitDawn>

      <section id="product" aria-labelledby="ai-product" className="scroll-mt-4 bg-[#07060c] px-5 py-24 sm:px-8">
        <div className="mx-auto grid w-full max-w-[68rem] items-center gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-[#a79fbb]">A real ticket, start to finish</p>
            <h2 id="ai-product" className="mt-3 text-[clamp(2rem,4.2vw,3.25rem)] font-semibold leading-[1] tracking-[-0.035em]">
              Watch it work before you read a single claim.
            </h2>
            <p className="mt-5 max-w-[40ch] text-[0.9375rem] leading-relaxed text-[#a79fbb]">
              Every step is shown: what it searched, what it read, what it wrote and which checks it passed. Nothing goes to a customer until someone on your team sends it.
            </p>
          </div>
          <div className="flex justify-center rounded-3xl bg-[#0d0b15] p-4 ring-1 ring-white/[0.07] sm:p-8">
            <AgentRun
              task="Reply to ticket #4182: a refund request outside the 30-day window"
              steps={STEPS}
              summary="Drafted a reply offering store credit under the 2026 policy, with two citations. Waiting for approval before sending."
            />
          </div>
        </div>
      </section>

      <SignalTiles
        heading={<>What Meridian does on <em style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontWeight: 400 }}>every</em> ticket.</>}
        tiles={TILES}
        primary={{ label: "Read the docs", href: "#docs" }}
        secondary={{ label: "Book a demo", href: "#start" }}
        theme="dark"
      />

      <section aria-labelledby="ai-proof" className="bg-[#07060c] px-5 py-24 sm:px-8">
        <div className="mx-auto w-full max-w-[68rem]">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-[#a79fbb]">Across all customers · September</p>
              <h2 id="ai-proof" className="mt-3 text-[clamp(2rem,4.2vw,3.25rem)] font-semibold leading-[1] tracking-[-0.035em]">The last 30 days, in public.</h2>
            </div>
            <p className="text-[0.875rem] text-[#a79fbb]">Drag along a line, or focus it and use the arrow keys.</p>
          </div>
          <ScrubSparklineStats
            className="mt-8"
            theme="night"
            end={new Date(Date.UTC(2026, 8, 30))}
            metrics={[
              { label: "Tickets drafted", series: month(11, 48200, 0.16, 0.08) },
              { label: "Sent without edits", suffix: "%", decimals: 1, series: month(29, 71, 0.06, 0.03, 1) },
              { label: "First reply (min)", decimals: 1, better: "down", series: month(7, 3.6, -0.25, 0.1, 1) },
              { label: "Escalated to a person", suffix: "%", decimals: 1, better: "down", series: month(3, 9.2, -0.2, 0.12, 1) },
            ]}
          />
        </div>
      </section>

      <section id="pricing" className="scroll-mt-4">
        <GlowBasePricing
          eyebrow="Priced by seats"
          title="Every model and every agent, on every plan."
          intro="Pay for the people who review drafts. Agents, models and storage are included on every plan."
          currency="$"
          plans={[
            { id: "build", name: "Build", blurb: "A team trying it on real tickets", monthly: 20, features: ["Every model", "Shared memory", "30-day history", "Email support"], cta: "Start a trial", glow: "#19c37d" },
            { id: "team", name: "Team", blurb: "Support teams of 10 to 100", monthly: 16, features: ["Everything in Build", "Admin controls", "Per-person limits", "Audit log"], cta: "Start a trial", glow: "#14b8c9" },
            { id: "scale", name: "Scale", blurb: "Several regions, strict rules", monthly: 12, features: ["Everything in Team", "SSO and SCIM", "Data residency", "Priority support"], cta: "Talk to sales", glow: "#7a4dff" },
          ]}
          onChoose={() => go("start")}
        />
      </section>

      <section aria-label="Questions" className="bg-[#07060c] px-5 py-24 sm:px-8">
        <div className="mx-auto w-full max-w-[48rem]">
          <FocusFaq items={FAQ} title="What security teams ask first" accent={ACCENT} />
        </div>
      </section>

      <section id="start" className="flex bg-[#07060c] px-3 pb-6 sm:px-6">
        <RingFloodCta
          theme="night"
          eyebrow="30 days, your team, your data"
          headline="Put it on real tickets this week."
          sub="Connect your help desk, point it at your policies and let your team review the first hundred drafts. Most teams decide within a week."
          action="Start a Build workspace"
          secondary={{ label: "Talk to an engineer", href: "#talk" }}
          note="No card · deleted if you don't continue"
        />
      </section>

      <footer className="bg-[#07060c]">
        <div className="mx-auto flex w-[min(68rem,calc(100%-2.5rem))] flex-wrap justify-between gap-3 border-t border-white/[0.07] py-8 font-mono text-[11px] uppercase tracking-[0.14em] text-[#a79fbb]">
          <span>© 2026 Meridian Labs</span>
          <span>Security · Status · Changelog · Careers</span>
        </div>
      </footer>
    </div>
  );
}
