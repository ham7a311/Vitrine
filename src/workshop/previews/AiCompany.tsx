"use client";

import { useEffect, useState } from "react";
import { AgentRun, type AgentStep } from "@/registry/ai/agent-run/AgentRun";
import { FeatureTrio } from "@/registry/cards/feature-trio/FeatureTrio";
import { FocusPullCta } from "@/registry/ctas/focus-pull-cta/FocusPullCta";
import { GlowPointer } from "@/registry/cursors/glow-pointer/GlowPointer";
import { FocusFaq } from "@/registry/faq/focus-faq/FocusFaq";
import { IndexFooter } from "@/registry/footers/index-footer/IndexFooter";
import { SILK_PALETTES, SilkField } from "@/registry/backgrounds/silk-field/SilkField";
import { UsageRuler } from "@/registry/pricing/usage-ruler/UsageRuler";
import { MetricMorph } from "@/registry/stats/metric-morph/MetricMorph";

const ACCENT = "#b9cce4";

const STEPS: AgentStep[] = [
  { kind: "think", label: "Planning", ms: 900 },
  { kind: "search", label: "Searched for", target: "refund policy", meta: "3 documents", ms: 1100 },
  { kind: "read", label: "Read", target: "policies/refunds-2026.md", ms: 800 },
  { kind: "edit", label: "Drafted", target: "reply to ticket #4182", meta: "142 words", ms: 1400 },
  { kind: "run", label: "Checked", target: "tone & policy guardrails", meta: "passed", ms: 1300 },
];

const TIERS = [
  { name: "Build", upTo: 10, perSeat: 20, note: "For a team trying it on real work: every model, shared memory, 30-day history." },
  { name: "Team", upTo: 100, perSeat: 16, note: "Admin controls, usage limits per person, and audit logs." },
  { name: "Scale", upTo: 400, perSeat: 12, note: "SSO and SCIM, data residency in Bahrain or Frankfurt, priority support." },
  { name: "Enterprise", upTo: 500, perSeat: 10, note: "Private deployment, custom retention and a named engineer." },
];

const FAQ = [
  { q: "Is our data used to train models?", a: "No. Prompts, files and outputs from your workspace are never used for training, and you can set retention from zero days to a year." },
  { q: "Where is data processed?", a: "In the region you pick when you create the workspace: Bahrain or Frankfurt. It stays there, backups included." },
  { q: "Which models can we use?", a: "All current models on every plan. Admins can limit which models each group may use and set a monthly budget per person." },
  { q: "How do we evaluate it before buying?", a: "Start a Build workspace with your team for 30 days. Nothing to install, no card, and your data is deleted if you don't continue." },
];

export default function AiCompany() {
  const [v, setV] = useState({ tasks: 1_284_032, p50: 1.8, uptime: 0.9997, r: 0 });
  useEffect(() => {
    const t = window.setInterval(() => setV((p) => ({ ...p, tasks: p.tasks + 40 + Math.round(Math.random() * 60), p50: Math.max(1.6, Math.min(2.1, +(p.p50 + (Math.random() - 0.5) * 0.1).toFixed(1))), r: p.r + 1 })), 2600);
    return () => window.clearInterval(t);
  }, []);

  return (
    <div className="h-full w-full overflow-y-auto bg-[#08070a] text-[#efe8dc]" style={{ fontFamily: "Geist, ui-sans-serif, system-ui" }}>
      <SilkField palette={SILK_PALETTES.graphite} lens="none" intensity={0.6} className="h-[min(40rem,92svh)]">
        <div className="flex h-full flex-col px-5 pt-5 sm:px-10">
          <header className="flex items-center justify-between">
            <span className="font-[family-name:Instrument_Serif] text-[1.4rem]">Meridian</span>
            <nav aria-label="Main" className="flex items-center gap-5 text-[0.8125rem] text-[#cfc8bd]">
              <a href="#product" className="hidden sm:inline">Product</a>
              <a href="#pricing" className="hidden sm:inline">Pricing</a>
              <a href="#start" className="rounded-full bg-[#efe8dc] px-4 py-1.5 font-medium text-[#08070a]">Start free</a>
            </nav>
          </header>
          <div className="mt-[11vh] max-w-[38rem]">
            <p className="font-[family-name:Geist_Mono] text-[0.6875rem] uppercase tracking-[0.16em] text-[#a7a1ab]">Agents for support teams · v3</p>
            <h1 className="mt-4 font-[family-name:Instrument_Serif] text-[clamp(2.6rem,7vw,4.8rem)] leading-[0.98] tracking-[-0.025em]">Answers your customers can check.</h1>
            <p className="mt-5 max-w-[42ch] text-[1rem] leading-relaxed text-[#cfc8bd]">Meridian reads your policies and past tickets, drafts the reply, cites where every sentence came from, and waits for a person to send it.</p>
          </div>
        </div>
      </SilkField>

      <section id="product" className="mx-auto max-w-[64rem] px-5 py-20 sm:px-8">
        <p className="font-[family-name:Geist_Mono] text-[0.6875rem] uppercase tracking-[0.16em] text-[#8f8994]">A real task, start to finish</p>
        <h2 className="mt-3 max-w-[22ch] font-[family-name:Instrument_Serif] text-[clamp(1.9rem,4vw,2.8rem)] tracking-[-0.015em]">Watch it work before you read a single claim.</h2>
        <GlowPointer color={ACCENT} arrow="light" className="mt-8 rounded-2xl">
          <div className="flex justify-center rounded-2xl bg-[#0d0c10] p-4 ring-1 ring-white/[0.06] sm:p-8">
            <AgentRun
              task="Reply to ticket #4182: a refund request outside the 30-day window"
              steps={STEPS}
              summary="Drafted a reply offering store credit under the 2026 policy, with two citations. Waiting for approval before sending."
            />
          </div>
        </GlowPointer>
      </section>

      <section className="mx-auto max-w-[64rem] px-5 pb-20 sm:px-8">
        <FeatureTrio accent={ACCENT} />
      </section>

      <section className="mx-auto max-w-[64rem] px-5 pb-20 sm:px-8">
        <p className="font-[family-name:Geist_Mono] text-[0.6875rem] uppercase tracking-[0.16em] text-[#8f8994]">Running right now</p>
        <div className="mt-6 grid grid-cols-1 gap-px overflow-hidden rounded-2xl bg-white/[0.07] ring-1 ring-white/[0.07] sm:grid-cols-3">
          {[
            <MetricMorph key="t" theme="night" label="Tasks completed" compareLabel="since launch" value={v.tasks} revision={v.r} />,
            <MetricMorph key="p" theme="night" label="Median draft time (s)" compareLabel="lower is better" value={v.p50} decimals={1} invert revision={v.r} />,
            <MetricMorph key="u" theme="night" label="Uptime, 90 days" compareLabel="all regions" value={v.uptime} format="percent" decimals={2} />,
          ].map((m, i) => (
            <div key={i} className="bg-[#0f0d12] p-4 sm:p-5">{m}</div>
          ))}
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-[64rem] px-5 pb-20 sm:px-8">
        <h2 className="font-[family-name:Instrument_Serif] text-[clamp(1.9rem,4vw,2.8rem)] tracking-[-0.015em]">Priced by seats. Every model included.</h2>
        <p className="mt-2 max-w-[48ch] text-[0.9375rem] text-[#a7a1ab]">Drag to your team size; the plan follows.</p>
        <div className="mt-8 flex justify-center">
          <UsageRuler tiers={TIERS} accent={ACCENT} />
        </div>
      </section>

      <section className="mx-auto max-w-[48rem] px-5 pb-20 sm:px-8">
        <FocusFaq items={FAQ} title="What security teams ask first" accent={ACCENT} />
      </section>

      <section id="start" className="mx-auto max-w-[64rem] px-5 pb-24 sm:px-8">
        <FocusPullCta
          accent={ACCENT}
          eyebrow="30 days, your team, your data"
          title={<>Put it on <em>real tickets</em> this week.</>}
          primary={{ label: "Start a Build workspace" }}
          secondary={{ label: "Talk to an engineer" }}
          note="No card · deleted if you don't continue"
        />
      </section>

      <IndexFooter
        owner="Meridian Labs"
        colophon="Set in Instrument Serif and Geist."
        accent={ACCENT}
        columns={[
          { letter: "C", entries: [{ term: "Changelog", ref: "v3.2" }, { term: "Careers", ref: "4 open" }] },
          { letter: "D", entries: [{ term: "Docs", ref: "API" }, { term: "Data residency", ref: "2 regions" }] },
          { letter: "S", entries: [{ term: "Security", ref: "SOC 2" }, { term: "Status", ref: "99.97%" }] },
          { letter: "P", entries: [{ term: "Pricing", ref: "§ 4" }, { term: "Privacy", ref: "no training" }] },
        ]}
      />
    </div>
  );
}
