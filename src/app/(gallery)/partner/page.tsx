import type { Metadata } from "next";
import Link from "next/link";
import { mailtoUrl, whatsappUrl } from "@/lib/feedback";
import { Pane } from "@/site/Pane";
import { pageMeta } from "@/site/seo";
import { site } from "@/site.config";

export const metadata: Metadata = pageMeta({ title: "Partner with us", description: `Work with ${site.name}: a component made with your product, a featured placement, or custom interface work for your team.`, path: "/partner" });

const KINDS = [
  ["Made-with components", "A component built around your product or API, in the collection like any other, and labelled as a partnership. People see your tool doing something worth copying."],
  ["Featured placements", "Your component, recipe or product shown in the gallery and on the homepage for a set period, with a clear label."],
  ["Custom work", "A component, a set of them or a whole page made for your product, to the same standard as the collection."],
];

const STEPS = [
  ["Write to us", "Say who you are, what you make and what you have in mind. A few lines is enough."],
  ["Scope it together", "A short call or a few emails to agree what gets made, by when, and how it's labelled."],
  ["We build, you review, we publish", "You see it before anyone else does. It goes live once you're happy with it."],
];

const ENQUIRY = `Hi, I'd like to talk about partnering with ${site.name}.`;
const enquiryMail = mailtoUrl({ subject: `${site.name} partnership`, body: `${ENQUIRY}\n\nWho we are:\nWhat we have in mind:\n` });

export default function Partner() {
  return (
    <>
      {/* Header: the line, and Pane standing on the floor that closes it, half out of the frame. */}
      <section className="vitrine-partner-head" aria-labelledby="partner-h">
        <div className="shell-container max-w-6xl vitrine-partner-stage">
          <div className="vitrine-partner-copy">
            <p className="eyebrow rise-in">Partner with us</p>
            <h1 id="partner-h" className="rise-in mt-4 max-w-[11ch] font-display text-[clamp(2.75rem,7vw,5.75rem)] leading-[0.95] tracking-[-0.03em] text-cream">Build something with us.</h1>
            <p className="rise-in mt-8 max-w-[44ch] text-[1.0625rem] leading-relaxed text-ink-2" style={{ animationDelay: "80ms" }}>
              {site.name} works with tools and studios that care how their interfaces feel. This is what that can look like.
            </p>
            <div className="rise-in mt-9 flex flex-wrap items-center gap-3" style={{ animationDelay: "140ms" }}>
              <a href={enquiryMail} className="group inline-flex h-12 items-center gap-2 rounded-md bg-cream px-6 text-[0.9375rem] font-medium text-void transition-colors hover:bg-white">
                Write to us <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
              </a>
              <a href="#contact" className="inline-flex h-12 items-center rounded-md border border-line-strong px-5 text-[0.9375rem] text-cream transition-colors hover:border-frost/40">
                Other ways to reach us
              </a>
            </div>
          </div>
          <div aria-hidden="true" className="vitrine-partner-pane">
            <Pane pose="wave" sizes="(min-width: 768px) 30rem, 80vw" className="vitrine-pane" />
          </div>
        </div>
      </section>

      <div className="shell-container max-w-6xl">
        <section className="mt-20 md:mt-28" aria-labelledby="kinds-h">
          <h2 id="kinds-h" className="eyebrow">Three ways to work together</h2>
          <ul className="mt-6 divide-y divide-line border-y border-line">
            {KINDS.map(([t, d]) => (
              <li key={t} className="vitrine-kind">
                <h3 className="vitrine-kind-title">{t}</h3>
                <p className="vitrine-kind-text">{d}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-24 md:mt-36" aria-labelledby="how-h">
          <h2 id="how-h" className="eyebrow">How it works</h2>
          <ol className="vitrine-steps">
            {STEPS.map(([t, d], i) => (
              <li key={t}>
                <span className="font-mono text-[0.6875rem] tabular-nums text-ink-3">Step {i + 1}</span>
                <p className="mt-3 font-display text-[1.5rem] leading-tight text-cream">{t}</p>
                <p className="mt-2 max-w-[34ch] text-[0.9375rem] leading-relaxed text-ink-2">{d}</p>
              </li>
            ))}
          </ol>
        </section>

        <p className="mt-24 max-w-[24ch] font-display text-[clamp(1.75rem,3.6vw,2.75rem)] leading-[1.15] tracking-[-0.015em] text-cream md:mt-36">
          We only partner with tools we&rsquo;d use. Partner work is always <em className="text-frost">labelled</em>.
        </p>

        <section id="contact" className="mt-24 scroll-mt-24 md:mt-32" aria-labelledby="contact-h">
          <h2 id="contact-h" className="eyebrow">Get in touch</h2>
          <ul className="mt-6 max-w-xl divide-y divide-line border-y border-line">
            <li>
              <a href={enquiryMail} className="flex min-h-14 items-center justify-between gap-4 py-3 text-[0.9375rem] text-ink-2 transition-colors hover:text-cream">
                <span>Email</span>
                <span className="font-mono text-[0.8125rem] text-cream">{site.contact.email}</span>
              </a>
            </li>
            <li>
              <a href={whatsappUrl(ENQUIRY)} target="_blank" rel="noreferrer" className="flex min-h-14 items-center justify-between gap-4 py-3 text-[0.9375rem] text-ink-2 transition-colors hover:text-cream">
                <span>WhatsApp</span>
                <span className="font-mono text-[0.8125rem] text-ink-3">Message us<span aria-hidden="true"> ↗</span><span className="sr-only"> (opens in a new tab)</span></span>
              </a>
            </li>
            <li>
              <a href={site.linkedin} target="_blank" rel="noreferrer" className="flex min-h-14 items-center justify-between gap-4 py-3 text-[0.9375rem] text-ink-2 transition-colors hover:text-cream">
                <span>LinkedIn</span>
                <span className="font-mono text-[0.8125rem] text-ink-3">vitrineui<span aria-hidden="true"> ↗</span><span className="sr-only"> (opens in a new tab)</span></span>
              </a>
            </li>
          </ul>
          <p className="mt-10 text-[0.9375rem] text-ink-2">
            Just want to support the project?{" "}
            <Link href="/sponsor" className="text-frost underline decoration-frost/30 underline-offset-4 hover:decoration-frost">Become a sponsor</Link>.
          </p>
        </section>
      </div>
    </>
  );
}
