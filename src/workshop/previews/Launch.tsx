"use client";

import { useEffect, useState } from "react";
import { BayerHorizon } from "@/registry/backgrounds/bayer-horizon/BayerHorizon";
import { MetricMorph } from "@/registry/stats/metric-morph/MetricMorph";
import { UsageRuler } from "@/registry/pricing/usage-ruler/UsageRuler";
import { SearchFaq } from "@/registry/faq/search-faq/SearchFaq";
import { InlineCta } from "@/registry/ctas/inline-cta/InlineCta";
import { IndexFooter } from "@/registry/footers/index-footer/IndexFooter";

const TIERS = [
  { name: "Starter", upTo: 5, perSeat: 12, note: "For a person or a pair: previews, one production region, community support." },
  { name: "Team", upTo: 50, perSeat: 10, note: "Shared environments, roles and review workflows." },
  { name: "Scale", upTo: 200, perSeat: 8, note: "Audit log, SSO, priority support and usage controls." },
  { name: "Enterprise", upTo: 500, perSeat: 6, note: "Dedicated regions, SLAs and a named engineer." },
];

const FAQ = [
  { q: "Can I bring my own cloud account?", a: "Yes. Northstar deploys into your AWS or GCP account on the Scale plan and above; the control plane stays with us.", tag: "Hosting" },
  { q: "How are seats counted?", a: "A seat is anyone who can deploy. Reviewers who only comment on previews are free.", tag: "Billing" },
  { q: "What happens if a deploy fails?", a: "The previous version keeps serving. Failed builds never replace a healthy one, and rollbacks are a single click.", tag: "Deploys" },
  { q: "Do you support SSO and SCIM?", a: "SAML SSO is included from Scale; SCIM provisioning on Enterprise.", tag: "Security" },
  { q: "Where is my data stored?", a: "In the region you choose at setup: Frankfurt, Bahrain, Virginia or Singapore. Backups stay in the same region.", tag: "Security" },
];

export default function Launch() {
  const [v, setV] = useState({ deploys: 48210, p95: 41, regions: 32, uptime: 0.9998, r: 0 });
  useEffect(() => {
    const t = window.setInterval(() => setV((p) => ({ ...p, deploys: p.deploys + 3 + Math.round(Math.random() * 9), p95: Math.max(36, p.p95 + (Math.random() < 0.5 ? -1 : 1)), r: p.r + 1 })), 2400);
    return () => window.clearInterval(t);
  }, []);

  return (
    <div className="h-full w-full overflow-y-auto bg-[#0b080d] text-[#f3ecf7]" style={{ fontFamily: "Geist, ui-sans-serif, system-ui" }}>
      <BayerHorizon className="h-[min(40rem,92svh)]">
        <div className="flex h-full flex-col px-5 pt-5 sm:px-10">
          <header className="flex items-center justify-between">
            <span className="font-[family-name:Instrument_Serif] text-[1.35rem]">Northstar</span>
            <a href="#pricing" className="rounded-full border border-white/20 px-4 py-1.5 text-[0.8125rem] text-[#e6d6f2]">Pricing</a>
          </header>
          <div className="mt-[10vh] max-w-[36rem]">
            <p className="font-[family-name:Geist_Mono] text-[0.6875rem] uppercase tracking-[0.16em] text-[#b9a9c7]">Release 4.0</p>
            <h1 className="mt-4 font-[family-name:Instrument_Serif] text-[clamp(2.5rem,7vw,4.6rem)] leading-[1] tracking-[-0.02em]">Deploy once. Run everywhere, calmly.</h1>
            <p className="mt-5 max-w-[40ch] text-[1rem] leading-relaxed text-[#cdbfd9]">Every commit builds, previews and goes live in 32 regions — with one dashboard that stays quiet until something needs you.</p>
          </div>
        </div>
      </BayerHorizon>

      <section className="mx-auto max-w-[64rem] px-5 py-20 sm:px-8">
        <p className="font-[family-name:Geist_Mono] text-[0.6875rem] uppercase tracking-[0.16em] text-[#8e8496]">Right now, on Northstar</p>
        <div className="mt-6 grid gap-px overflow-hidden rounded-2xl bg-white/[0.07] ring-1 ring-white/[0.07] grid-cols-2 lg:grid-cols-4">
          {[
            <MetricMorph key="d" theme="night" label="Deploys today" compareLabel="since midnight UTC" value={v.deploys} revision={v.r} />,
            <MetricMorph key="p" theme="night" label="p95 build (s)" compareLabel="lower is better" value={v.p95} invert revision={v.r} />,
            <MetricMorph key="g" theme="night" label="Regions" compareLabel="live" value={v.regions} />,
            <MetricMorph key="u" theme="night" label="Uptime, 90 days" compareLabel="all regions" value={v.uptime} format="percent" decimals={2} />,
          ].map((m, i) => (
            <div key={i} className="bg-[#120e16] p-4 sm:p-5">
              {m}
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-[64rem] px-5 pb-20 sm:px-8">
        <h2 className="font-[family-name:Instrument_Serif] text-[clamp(1.9rem,4vw,2.8rem)] tracking-[-0.015em]">One price, set by your team size.</h2>
        <p className="mt-2 max-w-[48ch] text-[0.9375rem] text-[#b9a9c7]">Drag to your team size. The plan follows.</p>
        <div className="mt-8 flex justify-center">
          <UsageRuler tiers={TIERS} accent="#e6d6f2" />
        </div>
      </section>

      <section className="mx-auto max-w-[48rem] px-5 pb-20 sm:px-8">
        <SearchFaq items={FAQ} contact="support@northstar.dev" accent="#e6d6f2" />
      </section>

      <section className="mx-auto max-w-[48rem] px-5 pb-24 sm:px-8">
        <InlineCta before={<>Ready when you are. </>} action="Start deploying for free" after={<> — no card, and your first project is live in minutes.</>} caption="Free for a person or a pair, forever." accent="#e6d6f2" />
      </section>

      <IndexFooter
        owner="Northstar Systems"
        colophon="Set in Instrument Serif and Geist."
        accent="#e6d6f2"
        columns={[
          { letter: "A", entries: [{ term: "API reference", ref: "docs" }, { term: "Audit log", ref: "Scale" }] },
          { letter: "C", entries: [{ term: "Changelog", ref: "4.0" }, { term: "Careers", ref: "3 open" }] },
          { letter: "P", entries: [{ term: "Pricing", ref: "§ 3" }, { term: "Previews", ref: "all plans" }] },
          { letter: "S", entries: [{ term: "Security", ref: "SOC 2" }, { term: "Status", ref: "99.98%" }] },
        ]}
      />
    </div>
  );
}
