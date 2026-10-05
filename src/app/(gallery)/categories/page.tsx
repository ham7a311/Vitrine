import type { Metadata } from "next";
import { pageMeta } from "@/site/seo";
import Link from "next/link";
import { registry } from "@/registry";
import { CATEGORIES } from "@/registry/types";
import { ArrowRight } from "@/site/icons";

export const metadata: Metadata = pageMeta({ title: "Categories", description: "Every Vitrine category, from buttons and cursors to analytics and sign-in, with a count and a way into each.", path: "/categories" });

export default function CategoriesPage() {
  const cats = CATEGORIES.filter((c) => registry.some((r) => r.category === c.id));
  const words = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen", "Twenty", "Twenty-one", "Twenty-two", "Twenty-three", "Twenty-four", "Twenty-five", "Twenty-six", "Twenty-seven", "Twenty-eight", "Twenty-nine", "Thirty"];
  return (
    <div className="shell-container pt-12 md:pt-20">
      <header className="rise-in max-w-3xl">
        <p className="eyebrow">{words[cats.length] ?? cats.length} ways in</p>
        <h1 className="mt-4 font-display text-[clamp(2.75rem,6.5vw,5rem)] leading-[0.95] tracking-[-0.03em] text-cream">Categories</h1>
        <p className="mt-5 max-w-[52ch] text-[1.0625rem] leading-relaxed text-ink-2">Organised by what a component is — the word you&rsquo;d type into a search box.</p>
      </header>

      <div className="mt-16 divide-y divide-line border-y border-line">
        {cats.map((c, i) => {
          const list = registry.filter((r) => r.category === c.id);
          return (
            <section key={c.id} className="grid gap-6 py-10 md:grid-cols-[14rem_1fr] md:gap-12" aria-labelledby={`${c.id}-h`}>
              <div>
                <p className="font-mono text-[0.6875rem] tabular-nums text-ink-3">{String(i + 1).padStart(2, "0")}</p>
                <h2 id={`${c.id}-h`} className="mt-2 font-display text-[2rem] leading-none tracking-[-0.01em] text-cream">
                  {c.label}
                </h2>
                <p className="mt-3 text-[0.875rem] leading-relaxed text-ink-3">{c.blurb}</p>
                <Link href={`/components?category=${c.id}`} className="mt-5 inline-flex items-center gap-1.5 text-[0.8125rem] text-frost">
                  View all {list.length} <ArrowRight className="size-3.5" />
                </Link>
              </div>
              <ul className="grid gap-x-8 sm:grid-cols-2">
                {list.map((r) => (
                  <li key={r.slug} className="border-b border-line last:border-0 sm:[&:nth-last-child(2):nth-child(odd)]:border-0">
                    <Link href={`/components/${r.slug}`} className="group flex items-baseline justify-between gap-4 py-3.5">
                      <span className="text-[0.9375rem] text-cream transition-colors group-hover:text-frost">
                        {r.name}
                        {r.isNew && <span className="ml-2 font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-lilac">New</span>}
                      </span>
                      <span className="hidden truncate font-mono text-[0.6875rem] text-ink-3 md:block">{r.traits.slice(0, 2).join(" · ")}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
