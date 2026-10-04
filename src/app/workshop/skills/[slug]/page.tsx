import type { Metadata } from "next";
import { JsonLd, breadcrumbs, pageMeta } from "@/site/seo";
import Link from "next/link";
import { notFound } from "next/navigation";
import { command, getSkill, SKILLS, WORKS_IN } from "@/workshop/skills";
import { loadSkill } from "@/workshop/skill-source";
import { renderMarkdown } from "@/workshop/markdown";
import { CopyButton } from "@/site/CopyButton";
import { ArrowLeft } from "@/site/icons";

export function generateStaticParams() {
  return SKILLS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const s = getSkill((await params).slug);
  return s ? pageMeta({ title: `${s.name} — AI skill`, description: s.line, path: `/workshop/skills/${s.slug}` }) : {};
}

export default async function SkillPage({ params }: { params: Promise<{ slug: string }> }) {
  const s = getSkill((await params).slug);
  if (!s) notFound();
  const file = await loadSkill(s.slug);
  const html = await renderMarkdown(file.body.replace(/^\s*# .*\n/, ""));
  const index = SKILLS.indexOf(s);

  return (
    <div className="shell-container pb-8 pt-8 md:pt-12">
      <JsonLd data={breadcrumbs([{ name: "Workshop", path: "/workshop" }, { name: s.name, path: `/workshop/skills/${s.slug}` }])} />
      <nav aria-label="Breadcrumb" className="rise-in">
        <Link href="/workshop" className="inline-flex items-center gap-1.5 text-[0.8125rem] text-ink-3 transition-colors hover:text-cream">
          <ArrowLeft className="size-3.5" /> Workshop
        </Link>
      </nav>

      <div className="mt-8 grid gap-12 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16">
        <div className="min-w-0">
          <header className="rise-in" style={{ animationDelay: "60ms" }}>
            <p className="eyebrow">Skill S{String(index + 1).padStart(2, "0")} · {s.name}</p>
            <h1 className="mt-3 break-words font-mono text-[clamp(1.75rem,4.6vw,3rem)] font-medium leading-[1.05] tracking-[-0.035em] text-cream">{command(s)}</h1>
            <p className="mt-4 max-w-[58ch] text-[1.0625rem] leading-relaxed text-ink-2">{s.line}</p>
            <p className="mt-2 max-w-[58ch] text-[0.9375rem] leading-relaxed text-ink-3">{s.when}</p>
          </header>

          <article className="skill-doc mt-12 max-w-[68ch] border-t border-line pt-10" dangerouslySetInnerHTML={{ __html: html }} />
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[14px] border border-line p-6">
            <p className="eyebrow">Get it</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a href={`/workshop/skills/${s.slug}/SKILL.md`} download={`${s.slug}-SKILL.md`} className="inline-flex h-8 items-center rounded-md border border-frost/40 bg-frost/10 px-3 text-[0.75rem] font-medium text-frost transition-colors hover:bg-frost/15">
                Download SKILL.md
              </a>
              <CopyButton text={file.raw} label="Copy text" />
            </div>
            <p className="eyebrow mt-7">Install in Claude Code</p>
            <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink-2">
              Save it as <code className="font-mono text-[0.75rem] text-cream">~/.claude/skills/{s.slug}/SKILL.md</code> for every project, or in a project&rsquo;s <code className="font-mono text-[0.75rem] text-cream">.claude/skills/{s.slug}/</code>. Claude uses it when the task matches, or when you ask for it by name.
            </p>
            <p className="eyebrow mt-7">Elsewhere</p>
            <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink-2">Paste the text as a Cursor rule, or into the instructions of a Claude or ChatGPT project.</p>
            <p className="eyebrow mt-7">Works in</p>
            <p className="mt-2 text-[0.8125rem] text-ink-2">{WORKS_IN.join(" · ")}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
