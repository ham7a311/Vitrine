import type { Metadata } from "next";
import Link from "next/link";
import { CopyButton } from "@/site/CopyButton";
import { issueUrl, mailtoUrl } from "@/lib/feedback";
import { pageMeta } from "@/site/seo";
import { site } from "@/site.config";

export const metadata: Metadata = pageMeta({ title: "Contact", description: "Report a bug, suggest a component, send feedback or just say hello. Which channel fits which message.", path: "/contact" });

const ROUTES = [
  {
    id: "bug",
    title: "Something looks or behaves wrong",
    detail: "Open an issue and name the component, the variant, your browser and what you expected. A screenshot or a short recording helps more than a long description.",
    action: "Report an issue",
    href: issueUrl({ title: "Bug: ", body: "**Component and variant**\n\n**Browser and device**\n\n**What happened**\n\n**What I expected**\n" }),
    external: true,
  },
  {
    id: "request",
    title: "A component you wish existed",
    detail: "Describe the job it does and the one design idea that would make it worth having. Fewer, stronger components beat a long list, so a clear reason goes a long way.",
    action: "Suggest a component",
    href: issueUrl({ title: "Component idea: ", body: "**The job it does**\n\n**The design idea**\n\n**Closest existing component, and why it isn't enough**\n" }),
    external: true,
  },
  {
    id: "feedback",
    title: "Feedback, questions, or working together",
    detail: "Anything that doesn't belong in a public issue: what you liked, what you'd change, a question about using a component in your project, or a collaboration. It goes straight to my inbox.",
    action: "Send an email",
    href: mailtoUrl({ subject: `${site.name} feedback` }),
    external: false,
  },
];

export default function Contact() {
  return (
    <div className="shell-container max-w-4xl pt-12 md:pt-20">
      <p className="eyebrow rise-in">Contact</p>
      <h1 className="rise-in mt-4 font-display text-[clamp(2.75rem,6.5vw,5rem)] leading-[0.95] tracking-[-0.03em] text-cream">Write to me directly.</h1>
      <p className="mt-8 max-w-[56ch] text-[1.0625rem] leading-relaxed text-ink-2">
        {site.name} is made by one person. If something is broken, missing or good, I&rsquo;d like to know. The right place depends on what you&rsquo;re writing about.
      </p>

      <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-y border-line py-6">
        <div>
          <p className="eyebrow">Email</p>
          <a href={mailtoUrl({ subject: `${site.name} feedback` })} className="mt-2 inline-block font-mono text-[1.0625rem] text-cream underline decoration-frost/30 underline-offset-4 hover:decoration-frost sm:text-[1.25rem]">
            {site.contact.email}
          </a>
        </div>
        <CopyButton text={site.contact.email} label="Copy address" />
      </div>

      <h2 id="routes" className="mt-20 font-display text-[2rem] tracking-[-0.015em] text-cream">Which way is best</h2>
      <ol className="mt-8 divide-y divide-line border-y border-line">
        {ROUTES.map((r, i) => (
          <li key={r.id} id={r.id} className="grid scroll-mt-24 gap-3 py-7 sm:grid-cols-[3rem_1fr_auto] sm:items-start sm:gap-6">
            <span className="font-mono text-[0.6875rem] tabular-nums text-ink-3">0{i + 1}</span>
            <div>
              <h3 className="font-display text-[1.375rem] leading-tight text-cream">{r.title}</h3>
              <p className="mt-2 max-w-[52ch] text-[0.9375rem] leading-relaxed text-ink-2">{r.detail}</p>
            </div>
            <a
              href={r.href}
              {...(r.external ? { target: "_blank", rel: "noreferrer" } : {})}
              className="inline-flex min-h-11 items-center gap-2 self-start rounded-md border border-line-strong px-4 text-[0.875rem] text-cream transition-colors hover:border-frost/60 hover:text-frost"
            >
              {r.action}
              <span aria-hidden="true">{r.external ? "↗" : "→"}</span>
              {r.external && <span className="sr-only"> (opens GitHub in a new tab)</span>}
            </a>
          </li>
        ))}
      </ol>

      <h2 className="mt-20 font-display text-[2rem] tracking-[-0.015em] text-cream">Elsewhere</h2>
      <ul className="mt-6 max-w-md divide-y divide-line border-y border-line">
        {site.contact.profiles.map((p) => (
          <li key={p.label}>
            <a href={p.href} target="_blank" rel="noreferrer" className="flex min-h-12 items-center justify-between gap-4 py-3 text-[0.9375rem] text-ink-2 transition-colors hover:text-cream">
              <span>{p.label}</span>
              <span className="font-mono text-[0.8125rem] text-ink-3">
                {p.handle}
                <span aria-hidden="true"> ↗</span>
                <span className="sr-only"> (opens in a new tab)</span>
              </span>
            </a>
          </li>
        ))}
      </ul>

      <p className="mt-16 max-w-[60ch] text-[0.875rem] leading-relaxed text-ink-3">
        What happens to your message is explained in the{" "}
        <Link href="/privacy#email" className="text-frost underline decoration-frost/30 underline-offset-4 hover:decoration-frost">Privacy</Link> page.
      </p>
    </div>
  );
}
