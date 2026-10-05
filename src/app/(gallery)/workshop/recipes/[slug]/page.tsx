import type { Metadata } from "next";
import { JsonLd, breadcrumbs, pageMeta } from "@/site/seo";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getComponent } from "@/registry";
import { buildBrief, getRecipe, RECIPES } from "@/workshop/recipes";
import { command, SKILLS } from "@/workshop/skills";
import { CopyButton } from "@/site/CopyButton";
import { PreviewStage } from "@/site/PreviewStage";
import { ArrowLeft, ArrowRight } from "@/site/icons";

export function generateStaticParams() {
  return RECIPES.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const r = getRecipe((await params).slug);
  return r ? pageMeta({ title: `${r.name} — site recipe`, description: r.line, path: `/workshop/recipes/${r.slug}` }) : {};
}

export default async function RecipePage({ params }: { params: Promise<{ slug: string }> }) {
  const r = getRecipe((await params).slug);
  if (!r) notFound();
  const brief = buildBrief(r);
  const index = RECIPES.indexOf(r);
  const next = RECIPES[(index + 1) % RECIPES.length];
  const checks = ["template-tells", "responsive-audit", "accessibility-pass", "performance-pass"].map((slug) => SKILLS.find((s) => s.slug === slug)!);

  return (
    <div className="shell-container pb-8 pt-8 md:pt-12">
      <JsonLd data={breadcrumbs([{ name: "Workshop", path: "/workshop" }, { name: r.name, path: `/workshop/recipes/${r.slug}` }])} />
      <nav aria-label="Breadcrumb" className="rise-in">
        <Link href="/workshop" className="inline-flex items-center gap-1.5 text-[0.8125rem] text-ink-3 transition-colors hover:text-cream">
          <ArrowLeft className="size-3.5" /> Workshop
        </Link>
      </nav>

      <header className="rise-in mt-8 max-w-3xl" style={{ animationDelay: "60ms" }}>
        <p className="eyebrow">Recipe R{String(index + 1).padStart(2, "0")}</p>
        <h1 className="mt-3 font-display text-[clamp(2.5rem,6vw,4.25rem)] leading-[0.98] tracking-[-0.025em] text-cream">{r.name}</h1>
        <p className="mt-4 max-w-[58ch] text-[1.0625rem] leading-relaxed text-ink-2">{r.line}</p>
        <p className="mt-2 max-w-[58ch] text-[0.9375rem] leading-relaxed text-ink-3">{r.for}</p>
      </header>

      <div className="rise-in mt-10" style={{ animationDelay: "120ms" }}>
        <PreviewStage slug={r.slug} bg={r.bg} mode="page" height={720} src={`/workshop/recipes/${r.slug}/preview`} title={`${r.name} live preview`} />
      </div>

      <div className="mt-16 grid gap-14 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16">
        <div className="min-w-0 space-y-16">
          <section aria-labelledby="map-h">
            <h2 id="map-h" className="font-display text-[1.75rem] tracking-[-0.015em] text-cream">
              The page, section by section
            </h2>
            <ol className="mt-6 divide-y divide-line border-y border-line">
              {r.sections.map((s, i) => {
                const meta = getComponent(s.component)!;
                return (
                  <li key={`${s.component}-${i}`} className="grid gap-2 py-5 sm:grid-cols-[2.5rem_11rem_minmax(0,1fr)] sm:gap-6">
                    <span className="font-mono text-[0.6875rem] tabular-nums text-ink-3">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <p className="text-[0.9375rem] text-cream">{s.title}</p>
                      <Link href={`/components/${s.component}`} className="mt-1 inline-flex items-center gap-1 text-[0.8125rem] text-frost underline decoration-frost/30 underline-offset-4 hover:decoration-frost">
                        {meta.name}
                      </Link>
                    </div>
                    <p className="text-[0.9375rem] leading-relaxed text-ink-2">{s.why}</p>
                  </li>
                );
              })}
            </ol>
          </section>

          <section aria-labelledby="brief-h">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 id="brief-h" className="font-display text-[1.75rem] tracking-[-0.015em] text-cream">
                The build brief
              </h2>
              <CopyButton text={brief} label="Copy brief" />
            </div>
            <p className="mt-2 max-w-[62ch] text-[0.875rem] leading-relaxed text-ink-3">
              Paste it into Claude, Cursor or ChatGPT with the component files, and ask for your own version: your name, your work, your product. It names each component and where to copy it from.
            </p>
            <pre className="mt-6 max-h-[32rem] overflow-auto whitespace-pre-wrap rounded-[14px] border border-line bg-plum-950/60 p-6 font-mono text-[0.8125rem] leading-[1.7] text-ink-2 md:p-8">{brief}</pre>
          </section>

          <section aria-labelledby="direction-h">
            <h2 id="direction-h" className="font-display text-[1.75rem] tracking-[-0.015em] text-cream">
              Direction
            </h2>
            <ul className="mt-6 max-w-[62ch] list-disc space-y-3 pl-5 text-[0.9375rem] leading-relaxed text-ink-2 marker:text-ink-3">
              {r.direction.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </section>

          {r.guidance?.map((g, i) => (
            <section key={g.title} aria-labelledby={`guidance-h-${i}`}>
              <h2 id={`guidance-h-${i}`} className="font-display text-[1.75rem] tracking-[-0.015em] text-cream">
                {g.title}
              </h2>
              <ul className="mt-6 max-w-[62ch] list-disc space-y-3 pl-5 text-[0.9375rem] leading-relaxed text-ink-2 marker:text-ink-3">
                {g.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[14px] border border-line p-6">
            <p className="eyebrow">Before you ship</p>
            <ul className="mt-4 space-y-4">
              {checks.map((s) => (
                <li key={s.slug}>
                  <Link href={`/workshop/skills/${s.slug}`} className="font-mono text-[0.875rem] text-cream underline decoration-transparent underline-offset-4 hover:decoration-frost/50">
                    {command(s)}
                  </Link>
                  <p className="mt-1 text-[0.8125rem] leading-relaxed text-ink-3">{s.when}</p>
                </li>
              ))}
            </ul>
          </div>
          <Link href={`/workshop/recipes/${next.slug}`} className="group flex items-center justify-between rounded-[14px] border border-line p-6 transition-colors hover:border-line-strong">
            <span>
              <span className="eyebrow block">Next recipe</span>
              <span className="mt-2 block font-display text-[1.375rem] text-cream">{next.name}</span>
            </span>
            <ArrowRight className="size-4 text-ink-3 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </aside>
      </div>
    </div>
  );
}
