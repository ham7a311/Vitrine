import type { Metadata } from "next";
import { pageMeta } from "@/site/seo";
import Link from "next/link";
import { getComponent } from "@/registry";
import { RECIPES } from "@/workshop/recipes";
import { command, SKILLS, STAGES } from "@/workshop/skills";
import { loadSkill } from "@/workshop/skill-source";
import { CopyButton } from "@/site/CopyButton";
import { RecipeThumb } from "@/site/RecipeThumb";
import { ArrowRight } from "@/site/icons";

export const metadata: Metadata = pageMeta({
  title: "Workshop",
  description: "Ways to build with Vitrine: complete recipes made from real components, and skills for the AI tools you build with.",
  path: "/workshop",
});

export default async function Workshop() {
  const skills = await Promise.all(SKILLS.map(async (s) => ({ ...s, raw: (await loadSkill(s.slug)).raw })));
  return (
    <div className="shell-container pb-10 pt-12 md:pt-20">
      <header className="max-w-3xl">
        <p className="eyebrow rise-in">Workshop</p>
        <h1 className="rise-in mt-4 font-display text-[clamp(2.75rem,6.5vw,5rem)] leading-[0.95] tracking-[-0.03em] text-cream" style={{ animationDelay: "40ms" }}>
          Ways to build with them.
        </h1>
        <p className="rise-in mt-6 max-w-[56ch] text-[1.0625rem] leading-relaxed text-ink-2" style={{ animationDelay: "80ms" }}>
          Components are objects to build with. The workshop is how: complete pages made only from real Vitrine components, and the skills we use to check our own work, written for the AI tools you build with.
        </p>
      </header>

      <section aria-labelledby="recipes-h" className="mt-20">
        <div className="flex items-baseline justify-between gap-4 border-b border-line pb-4">
          <h2 id="recipes-h" className="font-display text-[2rem] tracking-[-0.015em] text-cream">
            Recipes
          </h2>
          <p className="hidden text-[0.875rem] text-ink-3 sm:block">A live page, the components it uses, and a brief to build your own.</p>
        </div>
        <ol>
          {RECIPES.map((r, i) => (
            <li key={r.slug} className="border-b border-line">
              <Link href={`/workshop/recipes/${r.slug}`} className="group grid gap-5 py-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:items-center md:gap-10">
                <div className="min-w-0">
                  <p className="font-mono text-[0.6875rem] tabular-nums text-ink-3">R{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="mt-2 font-display text-[clamp(1.75rem,3.2vw,2.5rem)] leading-[1.02] tracking-[-0.02em] text-cream">{r.name}</h3>
                  <p className="mt-3 max-w-[44ch] text-[0.9375rem] leading-relaxed text-ink-2">{r.line}</p>
                  <p className="mt-4 text-[0.8125rem] leading-relaxed text-ink-3">
                    {r.sections
                      .map((s) => getComponent(s.component)?.name)
                      .filter((n, k, a) => n && a.indexOf(n) === k)
                      .join(" · ")}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-[0.875rem] text-frost transition-[gap] duration-200 group-hover:gap-2.5">
                    Open the recipe <ArrowRight className="size-3.5" />
                  </span>
                </div>
                <div className="aspect-[16/10] overflow-hidden rounded-[12px] border border-line transition-[border-color] duration-300 group-hover:border-line-strong">
                  <RecipeThumb slug={r.slug} bg={r.bg} />
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="skills-h" className="mt-24">
        <div className="flex items-baseline justify-between gap-4 border-b border-line pb-4">
          <h2 id="skills-h" className="font-display text-[2rem] tracking-[-0.015em] text-cream">
            Skills
          </h2>
          <p className="hidden text-[0.875rem] text-ink-3 sm:block">Each has its own page with the full text. For Claude Code, Cursor and ChatGPT.</p>
        </div>
        {STAGES.map(({ stage, line }) => (
          <div key={stage} className="mt-10 first-of-type:mt-8">
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <h3 className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-frost">{stage}</h3>
              <p className="text-[0.8125rem] text-ink-3">{line}</p>
            </div>
            <ol className="mt-3 divide-y divide-line border-y border-line">
              {skills
                .map((s, i) => ({ ...s, n: i + 1 }))
                .filter((s) => s.stage === stage)
                .map((s) => (
                  <li key={s.slug} className="group relative grid gap-3 py-6 transition-colors sm:grid-cols-[3rem_minmax(0,1fr)_auto_auto] sm:items-center sm:gap-6">
                    <span className="font-mono text-[0.6875rem] tabular-nums text-ink-3">S{String(s.n).padStart(2, "0")}</span>
                    <div className="min-w-0">
                      <h4 className="font-mono text-[1.0625rem] leading-tight tracking-[-0.01em] text-cream sm:text-[1.1875rem]">
                        {/* The name's link covers the whole row, so the row is the way to the skill's page. */}
                        <Link href={`/workshop/skills/${s.slug}`} className="rounded-sm after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:rounded-[10px] focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-frost">
                          {command(s)}
                        </Link>
                      </h4>
                      <p className="mt-1 text-[0.8125rem] text-ink-3">{s.name}</p>
                      <p className="mt-1.5 max-w-[60ch] text-[0.9375rem] leading-relaxed text-ink-2">{s.line}</p>
                      <span aria-hidden="true" className="mt-3 inline-flex items-center gap-1.5 text-[0.8125rem] text-frost transition-[gap] duration-200 group-hover:gap-2.5">
                        Read the skill <ArrowRight className="size-3.5" />
                      </span>
                    </div>
                    <div className="relative z-[1] flex items-center gap-2">
                      <CopyButton text={s.raw} label="Copy" />
                      <a href={`/workshop/skills/${s.slug}/SKILL.md`} download={`${s.slug}-SKILL.md`} aria-label={`Download ${command(s)} SKILL.md`} className="inline-flex h-8 items-center rounded-lg border border-line px-3 text-[0.8125rem] text-ink-2 transition-colors hover:border-line-strong hover:text-cream">
                        Download
                      </a>
                    </div>
                    <span aria-hidden="true" className="hidden size-10 place-items-center rounded-full border border-line text-ink-2 transition-[border-color,color,transform] duration-200 group-hover:translate-x-0.5 group-hover:border-frost/50 group-hover:text-frost sm:grid">
                      <ArrowRight className="size-4" />
                    </span>
                  </li>
                ))}
            </ol>
          </div>
        ))}
      </section>

      <p className="mt-16 max-w-[60ch] text-[0.9375rem] leading-relaxed text-ink-3">
        Every component also carries its own build prompt on its page. The workshop is for what comes after: putting several of them together, and checking the result.
      </p>
    </div>
  );
}
