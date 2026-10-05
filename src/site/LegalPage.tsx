import type { ReactNode } from "react";

export type LegalSection = { id: string; title: string; body: ReactNode };

/** The shared frame for Terms and Privacy: a plain-language summary first, then numbered sections with a contents list beside them. */
export function LegalPage({ eyebrow, title, updated, summary, sections, children }: { eyebrow: string; title: string; updated: string; summary: ReactNode; sections: LegalSection[]; children?: ReactNode }) {
  const date = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${updated}T00:00:00Z`));
  return (
    <div className="shell-container pt-12 md:pt-20">
      <header className="max-w-4xl">
        <p className="eyebrow rise-in">{eyebrow}</p>
        <h1 className="rise-in mt-4 font-display text-[clamp(2.75rem,6.5vw,5rem)] leading-[0.95] tracking-[-0.03em] text-cream">{title}</h1>
        <p className="mt-6 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ink-3">
          Last updated <time dateTime={updated}>{date}</time>
        </p>
        <div className="mt-10 max-w-[60ch] border-l border-frost/40 pl-5 text-[1.0625rem] leading-relaxed text-ink-2">{summary}</div>
      </header>

      <div className="mt-16 grid gap-12 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-16">
        <nav aria-label="On this page" className="hidden lg:block">
          <ol className="sticky top-24 space-y-2.5 border-l border-line pl-4 text-[0.8125rem]">
            {sections.map((s, i) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="grid grid-cols-[1.5rem_1fr] text-ink-3 transition-colors hover:text-cream">
                  <span className="font-mono text-[0.6875rem] tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <span>{s.title}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="max-w-[62ch] divide-y divide-line border-y border-line">
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`} className="scroll-mt-24 py-9">
              <h2 id={`${s.id}-h`} className="font-display text-[1.75rem] leading-tight tracking-[-0.015em] text-cream">
                <span className="mr-3 font-mono text-[0.6875rem] tabular-nums text-ink-3">{String(i + 1).padStart(2, "0")}</span>
                {s.title}
              </h2>
              <div className="mt-4 space-y-4 text-[0.9375rem] leading-relaxed text-ink-2 [&_a]:text-frost [&_a]:underline [&_a]:decoration-frost/30 [&_a]:underline-offset-4 hover:[&_a]:decoration-frost [&_li]:marker:text-ink-3 [&_strong]:font-medium [&_strong]:text-cream [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
                {s.body}
              </div>
            </section>
          ))}
        </div>
      </div>
      {children}
    </div>
  );
}
