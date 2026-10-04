import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { loadSource } from "@/lib/source";
import { getComponent, registry } from "@/registry";
import { CATEGORIES, TRAIT_LABEL } from "@/registry/types";
import { ArrowLeft, ArrowRight } from "@/site/icons";
import { PreviewStage } from "@/site/PreviewStage";
import { CATEGORY_NOUN, JsonLd, abs, breadcrumbs, pageMeta } from "@/site/seo";
import { PromptPanel, VariantProvider } from "@/site/VariantState";
import { recipesUsing } from "@/workshop/recipes";

export function generateStaticParams() {
  return registry.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const meta = getComponent((await params).slug);
  if (!meta) return {};
  return pageMeta({ title: `${meta.name} — React ${CATEGORY_NOUN[meta.category] ?? "component"}`, description: meta.description, path: `/components/${meta.slug}` });
}

export default async function ComponentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const meta = getComponent(slug);
  if (!meta) notFound();

  const files = await loadSource(meta);
  const category = CATEGORIES.find((c) => c.id === meta.category)!;
  const index = registry.indexOf(meta) + 1;
  const siblings = registry.filter((c) => c.category === meta.category);
  const pos = siblings.indexOf(meta);
  const prev = siblings[(pos - 1 + siblings.length) % siblings.length];
  const next = siblings[(pos + 1) % siblings.length];
  const usedIn = recipesUsing(meta.slug);

  const details: { label: string; body: string }[] = [
    { label: "Interaction", body: meta.interaction },
    { label: "Motion", body: meta.animation },
    { label: "Accessibility", body: meta.a11y },
    { label: "Responsive", body: meta.responsive },
    ...(meta.touchFallback ? [{ label: "On touch", body: meta.touchFallback }] : []),
  ];

  return (
    <VariantProvider variants={meta.variants}>
    <div className="shell-container pb-8 pt-8 md:pt-12">
      <JsonLd
        data={[
          breadcrumbs([
            { name: "Components", path: "/components" },
            { name: category.label, path: `/components?category=${category.id}` },
            { name: meta.name, path: `/components/${meta.slug}` },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "SoftwareSourceCode",
            name: meta.name,
            description: meta.description,
            url: abs(`/components/${meta.slug}`),
            keywords: meta.tags.join(", "),
            programmingLanguage: ["TypeScript", "React", "CSS"],
            genre: category.label,
            isPartOf: { "@type": "WebSite", name: "Vitrine", url: abs("/") },
          },
        ]}
      />
      <nav aria-label="Breadcrumb" className="rise-in">
        <ol className="flex items-center gap-2 text-[0.8125rem] text-ink-3">
          <li>
            <Link href="/components" className="inline-flex items-center gap-1.5 transition-colors hover:text-cream">
              <ArrowLeft className="size-3.5" /> Components
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href={`/components?category=${category.id}`} className="transition-colors hover:text-cream">
              {category.label}
            </Link>
          </li>
        </ol>
      </nav>

      <header className="rise-in mt-8 grid gap-6 md:grid-cols-[1fr_auto] md:items-end" style={{ animationDelay: "60ms" }}>
        <div>
          <p className="eyebrow">
            No.{String(index).padStart(2, "0")} · {category.label}
            {meta.isNew && <span className="ml-2 text-lilac">· New</span>}
          </p>
          <h1 className="mt-3 font-display text-[clamp(2.5rem,6vw,4.25rem)] leading-[0.98] tracking-[-0.025em] text-cream">{meta.name}</h1>
          <p className="mt-4 max-w-[58ch] text-[1.0625rem] leading-relaxed text-ink-2">{meta.description}</p>
        </div>
        <ul className="flex flex-wrap gap-1.5 md:max-w-xs md:justify-end" aria-label="Tags">
          {meta.tags.map((t) => (
            <li key={t}>
              <Link
                href={`/components?q=${encodeURIComponent(t)}`}
                className="inline-block rounded-full border border-line px-2.5 py-1 font-mono text-[0.6875rem] text-ink-3 transition-colors hover:border-line-strong hover:text-cream"
              >
                {t}
              </Link>
            </li>
          ))}
        </ul>
      </header>

      <div className="rise-in mt-10" style={{ animationDelay: "120ms" }}>
        <PreviewStage slug={meta.slug} bg={meta.preview.bg} mode={meta.preview.mode} height={meta.preview.height} variants={meta.variants} files={files} />
      </div>

      <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16">
        <div className="min-w-0 space-y-14">
          <PromptPanel prompt={meta.prompt} />

          <section aria-labelledby="notes-h">
            <h2 id="notes-h" className="font-display text-[1.75rem] tracking-[-0.015em] text-cream">
              Notes
            </h2>
            <dl className="mt-6 divide-y divide-line border-y border-line">
              {details.map((d) => (
                <div key={d.label} className="grid gap-2 py-5 sm:grid-cols-[9rem_1fr] sm:gap-6">
                  <dt className="eyebrow pt-0.5">{d.label}</dt>
                  <dd className="text-[0.9375rem] leading-relaxed text-ink-2">{d.body}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <dl className="space-y-6 rounded-[14px] border border-line p-6">
            <div>
              <dt className="eyebrow">Dependencies</dt>
              <dd className="mt-2 text-[0.875rem] text-ink-2">
                {meta.dependencies.length ? (
                  <ul className="space-y-1 font-mono text-[0.8125rem]">
                    {meta.dependencies.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                ) : (
                  "None — React + Tailwind CSS"
                )}
              </dd>
            </div>
            {usedIn.length > 0 && (
              <div>
                <dt className="eyebrow">Used in</dt>
                <dd className="mt-2">
                  <ul className="space-y-1 text-[0.875rem]">
                    {usedIn.map((r) => (
                      <li key={r.slug}>
                        <Link href={`/workshop/recipes/${r.slug}`} className="text-frost underline decoration-frost/30 underline-offset-4 hover:decoration-frost">
                          {r.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            )}
            <div>
              <dt className="eyebrow">Files</dt>
              <dd className="mt-2">
                <ul className="space-y-1 font-mono text-[0.8125rem] text-ink-2">
                  {meta.files.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </dd>
            </div>
            <div>
              <dt className="eyebrow">Responds to</dt>
              <dd className="mt-2 flex flex-wrap gap-1.5">
                {meta.traits.map((t) => (
                  <span key={t} className="rounded-md bg-plum-800 px-2 py-0.5 text-[0.75rem] text-ink-2">
                    {TRAIT_LABEL[t]}
                  </span>
                ))}
              </dd>
            </div>
            {meta.variants && meta.variants.length > 1 && (
              <div>
                <dt className="eyebrow">Variants</dt>
                <dd className="mt-2 text-[0.875rem] text-ink-2">{meta.variants.map((v) => v.label).join(", ")}</dd>
              </div>
            )}
            <div>
              <dt className="eyebrow">How to use</dt>
              <dd className="mt-2 text-[0.8125rem] leading-relaxed text-ink-3">
                Copy each file into your project (e.g. <span className="font-mono text-ink-2">components/{meta.slug}/</span>), keep the CSS import, and adapt the usage example.
              </dd>
            </div>
          </dl>
        </aside>
      </div>

      <nav aria-label={`More ${category.label.toLowerCase()}`} className="mt-20 grid gap-3 border-t border-line pt-8 sm:grid-cols-2">
        {[prev, next].map((c, i) =>
          c && c !== meta ? (
            <Link
              key={c.slug + i}
              href={`/components/${c.slug}`}
              className={`group flex flex-col rounded-[14px] border border-line p-5 transition-colors hover:border-line-strong ${i === 1 ? "sm:items-end sm:text-right" : ""}`}
            >
              <span className="eyebrow inline-flex items-center gap-1.5">
                {i === 0 ? <ArrowLeft className="size-3" /> : null}
                {i === 0 ? "Previous" : "Next"}
                {i === 1 ? <ArrowRight className="size-3" /> : null}
              </span>
              <span className="mt-2 font-display text-[1.375rem] text-cream transition-colors group-hover:text-frost">{c.name}</span>
            </Link>
          ) : null,
        )}
      </nav>
    </div>
    </VariantProvider>
  );
}
