import { ComponentFonts } from "@/site/ComponentFonts";
import Link from "next/link";
import { summaries } from "@/registry";
import { CATEGORIES } from "@/registry/types";
import { site } from "@/site.config";
import { GalleryCard } from "@/site/GalleryCard";
import { ArrowRight, GitHubIcon, StarIcon } from "@/site/icons";
import { RECIPES } from "@/workshop/recipes";
import { JsonLd, abs } from "@/site/seo";

const HERO = ["silk-field", "specimen-card", "iris-shutter-button"];
/* Chosen by hand, in this order. */
const FEATURED = ["glassbreak-button", "liquid-glass-button", "point-bloom", "agent-composer", "glow-base-pricing", "glass-tiles"];
const FRESH = ["frost-bloom-button", "light-pour", "ember-globe"];

export default function Home() {
  const items = summaries();
  const bySlug = (s: string) => items.find((i) => i.slug === s)!;
  const hero = HERO.map(bySlug);
  const featured = FEATURED.map(bySlug);
  const fresh = FRESH.map(bySlug);

  return (<> <ComponentFonts />
    <>
      <JsonLd
        data={[
          { "@context": "https://schema.org", "@type": "WebSite", name: site.name, url: abs("/"), description: site.description, inLanguage: "en" },
          { "@context": "https://schema.org", "@type": "Organization", name: site.name, url: abs("/"), logo: abs("/icon.svg"), founder: { "@type": "Person", name: "Hamza Al-Bulushi" } },
        ]}
      />
      {/* Hero */}
      <section className="relative">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[38rem] bg-[radial-gradient(60%_60%_at_18%_0%,rgb(46_31_53/0.55),transparent_70%)]" />
        <div className="shell-container relative pb-10 pt-16 md:pt-24">
          <p className="eyebrow rise-in">Vitrine · {items.length} components</p>
          <h1 className="rise-in mt-6 max-w-[12ch] font-display text-[clamp(3.5rem,10vw,8.25rem)] leading-[0.9] tracking-[-0.035em] text-cream" style={{ animationDelay: "60ms" }}>
            Kept under <em className="text-frost">glass</em>.
          </h1>
          <div className="rise-in mt-8 grid gap-8 md:grid-cols-[minmax(0,34rem)_auto] md:items-end md:justify-between" style={{ animationDelay: "140ms" }}>
            <p className="text-[1.125rem] leading-relaxed text-ink-2">
              A curated collection of React components chosen for how they move, react and feel. Open one, read the source and the prompt behind it, and make it yours.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/components" className="group inline-flex h-12 items-center gap-2 rounded-md bg-cream px-6 text-[0.9375rem] font-medium text-void transition-colors hover:bg-white">
                Browse the collection
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
              <a href={site.github} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center gap-2 rounded-md border border-line-strong px-5 text-[0.9375rem] text-cream transition-colors hover:border-frost/40">
                <GitHubIcon className="size-4" /> GitHub
              </a>
            </div>
          </div>

          <div className="rise-in mt-16 grid gap-x-6 gap-y-12 md:grid-cols-3" style={{ animationDelay: "220ms" }}>
            {hero.map((item, i) => (
              <div key={item.slug} className={i === 1 ? "md:mt-14" : i === 2 ? "md:mt-6" : ""}>
                <GalleryCard item={item} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="shell-container mt-28 md:mt-40" aria-labelledby="featured-h">
        <div className="flex items-end justify-between gap-6 border-b border-line pb-5">
          <div>
            <p className="eyebrow">Featured</p>
            <h2 id="featured-h" className="mt-3 font-display text-[clamp(2rem,4vw,3rem)] leading-none tracking-[-0.02em]">
              Start here.
            </h2>
          </div>
          <Link href="/components" className="hidden items-center gap-1.5 text-[0.875rem] text-ink-2 transition-colors hover:text-cream sm:inline-flex">
            All components <ArrowRight className="size-3.5" />
          </Link>
        </div>
        <div className="mt-10 grid gap-x-6 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
          {featured.map((item) => (
            <GalleryCard key={item.slug} item={item} />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="shell-container mt-28 md:mt-40" aria-labelledby="cats-h">
        <p className="eyebrow">Categories</p>
        <h2 id="cats-h" className="mt-3 font-display text-[clamp(2rem,4vw,3rem)] leading-none tracking-[-0.02em]">
          Find it by what it is.
        </h2>
        <ul className="mt-10 grid gap-px overflow-hidden rounded-[14px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.filter((c) => items.some((i) => i.category === c.id)).map((c) => {
            const inCat = items.filter((i) => i.category === c.id);
            return (
              <li key={c.id} className="bg-void">
                <Link href={`/components?category=${c.id}`} className="group flex h-full min-h-[14rem] flex-col justify-between p-6 transition-colors duration-300 hover:bg-plum-950">
                  <div>
                    <span className="font-mono text-[0.6875rem] tabular-nums text-ink-3">{String(inCat.length).padStart(2, "0")}</span>
                    <h3 className="mt-3 font-display text-[1.75rem] leading-none tracking-[-0.01em] text-cream">{c.label}</h3>
                    <p className="mt-3 text-[0.875rem] leading-relaxed text-ink-3">{c.blurb}</p>
                  </div>
                  <p className="mt-6 flex items-center gap-1.5 text-[0.8125rem] text-frost opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 max-md:opacity-100">
                    Browse <ArrowRight className="size-3.5" />
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* New */}
      {fresh.length > 0 && (
        <section className="shell-container mt-28 md:mt-40" aria-labelledby="new-h">
          <div className="flex items-end justify-between gap-6 border-b border-line pb-5">
            <div>
              <p className="eyebrow text-lilac">New in the collection</p>
              <h2 id="new-h" className="mt-3 font-display text-[clamp(2rem,4vw,3rem)] leading-none tracking-[-0.02em]">
                Made here, first.
              </h2>
            </div>
            <Link href="/components?filter=new" className="hidden items-center gap-1.5 text-[0.875rem] text-ink-2 transition-colors hover:text-cream sm:inline-flex">
              All new <ArrowRight className="size-3.5" />
            </Link>
          </div>
          <div className="mt-10 grid gap-x-6 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
            {fresh.map((item) => (
              <GalleryCard key={item.slug} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* Workshop */}
      <section className="shell-container mt-28 md:mt-40" aria-labelledby="workshop-h">
        <div className="grid gap-8 border-y border-line py-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:items-end md:gap-16">
          <div>
            <p className="eyebrow">Workshop</p>
            <h2 id="workshop-h" className="mt-3 font-display text-[clamp(2rem,4vw,3rem)] leading-none tracking-[-0.02em]">
              Ways to build with them.
            </h2>
            <p className="mt-4 max-w-[46ch] text-[0.9375rem] leading-relaxed text-ink-2">
              Whole pages made only from these components, each with a brief to build your own, and the skills we use to check our work.
            </p>
            <Link href="/workshop" className="group mt-6 inline-flex items-center gap-1.5 text-[0.9375rem] text-frost">
              Open the workshop <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>
          <ol className="divide-y divide-line">
            {RECIPES.map((r, i) => (
              <li key={r.slug}>
                <Link href={`/workshop/recipes/${r.slug}`} className="group flex items-baseline gap-4 py-3.5">
                  <span className="font-mono text-[0.6875rem] tabular-nums text-ink-3">R{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-display text-[1.375rem] text-cream transition-colors group-hover:text-frost">{r.name}</span>
                  <span className="ml-auto hidden max-w-[28ch] truncate text-right text-[0.8125rem] text-ink-3 sm:block">{r.line}</span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* GitHub */}
      <section className="shell-container mt-28 md:mt-40">
        <div className="relative overflow-hidden rounded-[14px] border border-line px-6 py-14 text-center md:py-20">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_70%_at_50%_120%,rgb(185_204_228/0.09),transparent_70%)]" />
          <p className="relative mx-auto max-w-[22ch] font-display text-[clamp(1.75rem,3.6vw,2.75rem)] leading-[1.1] tracking-[-0.02em] text-cream">
            If something here earned a second look, a star helps others find it.
          </p>
          <a href={site.github} target="_blank" rel="noreferrer" className="group relative mt-8 inline-flex h-12 items-center gap-2 rounded-md border border-line-strong px-6 text-[0.9375rem] text-cream transition-colors hover:border-frost/40 hover:bg-frost/[0.06]">
            <StarIcon className="size-4 text-frost transition-transform duration-500 group-hover:rotate-[72deg]" />
            Star on GitHub
          </a>
        </div>
      </section>
    </>
  </>);
}
