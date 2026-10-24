import type { Metadata } from "next";
import Link from "next/link";
import { mailtoUrl, whatsappUrl } from "@/lib/feedback";
import { Pane } from "@/site/Pane";
import { pageMeta } from "@/site/seo";
import { site } from "@/site.config";

export const metadata: Metadata = pageMeta({ title: "Sponsor", description: `Sponsor ${site.name} from $${site.tiers[0].price} a month. Everything stays free and MIT licensed; sponsorship pays for the time each component takes.`, path: "/sponsor" });

const FAQ = [
  ["Is Vitrine still free?", "Yes. Every component, its source and its prompt stay free and MIT licensed. Sponsoring doesn't unlock anything in the library."],
  ["Can I give once instead?", "Yes. Write with the amount you have in mind and we'll arrange it."],
  ["What does the money pay for?", "Time: designing each component, building it, and testing it across browsers, touch, keyboard and reduced motion before it goes in."],
  ["Can I stop any time?", "Yes. Tell us and it stops. There's no contract and no minimum term."],
];

/** Studio's mark: a crown with three points and a base band, cut from frosted glass, with one warm light in the band. */
function StudioMark() {
  return (
    <svg viewBox="0 0 32 26" fill="none" strokeLinejoin="round" aria-hidden="true" className="h-[1.5rem] w-auto">
      <path d="M3 19 1.5 7.5 9 13 16 3.5 23 13 30.5 7.5 29 19z" fill="rgb(185 204 228 / 0.14)" stroke="rgb(226 236 248 / 0.9)" strokeWidth="1.3" />
      <rect x="3" y="19" width="26" height="4.5" rx="1" fill="rgb(185 204 228 / 0.2)" stroke="rgb(226 236 248 / 0.9)" strokeWidth="1.3" />
      <circle cx="1.5" cy="6.5" r="1.6" fill="rgb(226 236 248 / 0.9)" />
      <circle cx="16" cy="2.5" r="1.8" fill="rgb(226 236 248 / 0.9)" />
      <circle cx="30.5" cy="6.5" r="1.6" fill="rgb(226 236 248 / 0.9)" />
      <circle cx="16" cy="21.2" r="1.3" fill="rgb(243 220 176)" />
    </svg>
  );
}

/** A plan's two ways to sign up: email (primary) and WhatsApp, each naming the plan and price. */
function PlanActions({ tier, label }: { tier: (typeof site.tiers)[number]; label: string }) {
  const note = `Hi, I'd like to sponsor ${site.name} as a ${tier.name} ($${tier.price} a month).`;
  return (
    <div className="vitrine-plan-actions">
      <a
        href={mailtoUrl({ subject: `${site.name} sponsorship: ${tier.name} ($${tier.price}/month)`, body: `${note}\n\nName or company to show:\nLink (optional):\n` })}
        className="group inline-flex h-12 items-center gap-2 rounded-md border border-line-strong px-5 text-[0.9375rem] text-cream transition-colors hover:border-frost/40"
      >
        {label} <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
      </a>
      <a href={whatsappUrl(note)} target="_blank" rel="noreferrer" className="text-[0.8125rem] text-ink-3 underline decoration-line-strong underline-offset-4 transition-colors hover:text-cream hover:decoration-frost">
        or WhatsApp<span className="sr-only"> (opens in a new tab)</span>
      </a>
    </div>
  );
}

export default function Sponsor() {
  const named = site.sponsors;
  const supporter = site.tiers.find((t) => t.id === "supporter")!;
  const studio = site.tiers.find((t) => t.id === "studio")!;
  return (
    <div className="shell-container max-w-6xl overflow-x-clip pt-12 md:pt-20">
      {/* Header: the line on the left, and Pane walking in from the right with an armful of glass. */}
      <div className="vitrine-sponsor-head">
        <div className="relative z-[1]">
          <p className="eyebrow rise-in">Sponsor</p>
          <h1 className="rise-in mt-4 max-w-[14ch] font-display text-[clamp(2.75rem,6.5vw,5rem)] leading-[0.95] tracking-[-0.03em] text-cream">Help keep {site.name} free.</h1>
          <p className="rise-in mt-8 max-w-[46ch] text-[1.0625rem] leading-relaxed text-ink-2" style={{ animationDelay: "80ms" }}>
            Everything here is MIT licensed and stays that way. Sponsorship pays for the time it takes to make each piece properly.
          </p>
        </div>
        <div aria-hidden="true" className="vitrine-sponsor-pane">
          <Pane pose="carry" sizes="(min-width: 1024px) 27rem, 40vw" className="vitrine-pane" />
        </div>
      </div>

      {/* Two plans built differently: an individual's card and a company's sponsorship. Never badged. */}
      <h2 id="tiers-h" className="sr-only">Plans</h2>
      <ol className="vitrine-plans" aria-labelledby="tiers-h">
        {/* Supporter: deliberately modest, the easiest way to help. */}
        <li className="vitrine-plan vitrine-plan-supporter">
          <h3 className="vitrine-plan-name">{supporter.name}</h3>
          <p className="vitrine-plan-who">{supporter.who}</p>
          <p className="vitrine-plan-price">
            <span className="vitrine-plan-amount">${supporter.price}</span>
            <span className="vitrine-plan-per">a month</span>
          </p>
          <ul className="vitrine-plan-perks">
            {supporter.perks.map((perk) => <li key={perk}>{perk}</li>)}
          </ul>
          <PlanActions tier={supporter} label="Sponsor by email" />
        </li>

        {/* Studio: the company plan. Wider, with a header band and a stronger frame; that construction is the whole difference. */}
        <li className="vitrine-plan vitrine-plan-studio">
          <div className="vitrine-studio-head">
            <h3 className="vitrine-plan-name flex items-center gap-3">
              {studio.name}
              <StudioMark />
            </h3>
            <p className="vitrine-plan-who">{studio.who}</p>
          </div>
          <div className="vitrine-studio-body">
            <p className="vitrine-plan-price">
              <span className="vitrine-plan-amount">${studio.price}</span>
              <span className="vitrine-plan-per">a month</span>
            </p>
            <ul className="vitrine-plan-perks">
              {studio.perks.map((perk) => <li key={perk}>{perk}</li>)}
            </ul>
            <PlanActions tier={studio} label="Sponsor as a studio" />
          </div>
        </li>
      </ol>
      <div className="mt-6 space-y-1.5 text-[0.8125rem] text-ink-3">
        <p>
          Priority requests stay within {site.name}&rsquo;s scope. Need guaranteed custom work?{" "}
          <Link href="/partner" className="text-frost underline decoration-frost/30 underline-offset-4 hover:decoration-frost">Partner with us</Link>.
        </p>
        <p className="font-mono text-[0.6875rem]">No checkout yet. Write to us and we&rsquo;ll arrange payment directly.</p>
      </div>

      <section className="mt-28 md:mt-40" aria-labelledby="wall-h">
        <h2 id="wall-h" className="font-display text-[clamp(2rem,4vw,3rem)] leading-none tracking-[-0.02em] text-cream">The people keeping it going.</h2>
        {named.length === 0 ? (
          <div className="vitrine-wall">
            <div aria-hidden="true" className="vitrine-wall-pane">
              <Pane pose="idle" sizes="(min-width: 768px) 15rem, 9.5rem" className="vitrine-pane" />
            </div>
            <p className="vitrine-wall-empty">
              No names here yet.<br /><span>Yours could be the first.</span>
            </p>
          </div>
        ) : (
          <div className="vitrine-wall vitrine-wall-named">
            {[...site.tiers].reverse().map((t) => {
              const list = named.filter((s) => s.tier === t.id);
              if (!list.length) return null;
              return (
                <div key={t.id}>
                  <p className="eyebrow">{t.name}</p>
                  <ul className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-3">
                    {list.map((s) => (
                      <li key={s.name}>
                        {s.href ? (
                          <a href={s.href} target="_blank" rel="noreferrer" className="text-[1.0625rem] text-cream underline decoration-line-strong underline-offset-4 hover:decoration-frost">
                            {t.id === "studio" && s.logo ? <img src={s.logo} alt={s.name} className="h-8 w-auto" /> : s.name}
                          </a>
                        ) : (
                          <span className="text-[1.0625rem] text-cream">{s.name}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="mt-28 md:mt-36" aria-labelledby="faq-h">
        <h2 id="faq-h" className="font-display text-[2rem] tracking-[-0.015em] text-cream">Questions</h2>
        <div className="mt-6 max-w-3xl divide-y divide-line border-y border-line">
          {FAQ.map(([q, a]) => (
            <details key={q} className="group">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-[1rem] text-cream [&::-webkit-details-marker]:hidden">
                {q}
                <span aria-hidden="true" className="font-mono text-[0.875rem] text-ink-3 transition-transform duration-300 group-open:rotate-45">+</span>
              </summary>
              <p className="max-w-[60ch] pb-5 text-[0.9375rem] leading-relaxed text-ink-2">{a}</p>
            </details>
          ))}
        </div>
        <p className="mt-10 text-[0.9375rem] text-ink-2">
          Working on something bigger?{" "}
          <Link href="/partner" className="text-frost underline decoration-frost/30 underline-offset-4 hover:decoration-frost">Partner with us</Link>.
        </p>
      </section>
    </div>
  );
}
