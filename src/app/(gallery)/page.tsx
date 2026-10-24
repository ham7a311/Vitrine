import { ComponentFonts } from "@/site/ComponentFonts";
import Link from "next/link";
import { cardView, summaries } from "@/registry";
import { CATEGORIES } from "@/registry/types";
import { site } from "@/site.config";
import { GalleryCard } from "@/site/GalleryCard";
import { ArrowRight, GitHubIcon, StarIcon } from "@/site/icons";
import { RECIPES } from "@/workshop/recipes";
import { JsonLd, abs } from "@/site/seo";
import { Pane } from "@/site/Pane";

const HERO = ["silk-field", "murmur-rows", "bloom-edge", "tidefill-button", "neon-veins", "sweep-cards"];
/* Chosen by hand, in this order. */
const FEATURED = ["glassbreak-button", "liquid-glass-button", "point-bloom", "agent-composer", "glow-base-pricing", "glass-tiles"];
const FRESH = ["pixel-seam", "field-button", "slipstream-menu", "storm-veil", "mono-sign-in", "tile-breaker"];

export default function Home() {
  const items = summaries();
  const bySlug = (s: string) => cardView(items.find((i) => i.slug === s)!);
  const hero = HERO.map(bySlug);
  const featured = FEATURED.map(bySlug);
  const fresh = FRESH.map(bySlug);
  const studios = site.sponsors.filter((s) => s.tier === "studio");

  return (<> <ComponentFonts />
    <>
      <JsonLd
        data={[
          { "@context": "https://schema.org", "@type": "WebSite", name: site.name, url: abs("/"), description: site.description, inLanguage: "en" },
          { "@context": "https://schema.org", "@type": "Organization", name: site.name, url: abs("/"), logo: abs("/icon.svg"), founder: { "@type": "Person", name: "Hamza Al-Bulushi" } },
        ]}
      />
      {/* Hero: the line, and Pane standing in the dark beside it */}
      <section className="vitrine-hall" aria-labelledby="hero-h">
        <div className="shell-container vitrine-hall-stage">
          <div className="vitrine-hall-copy">
            <p className="eyebrow rise-in">{site.name} · {items.length} components</p>
            <h1 id="hero-h" className="rise-in mt-6 font-display text-[clamp(3.5rem,8.6vw,8.25rem)] leading-[0.9] tracking-[-0.035em] text-cream" style={{ animationDelay: "60ms" }}>
              Kept under{" "}<br /><em className="text-frost">glass</em>.
            </h1>
            <p className="rise-in mt-8 max-w-[31rem] text-[1.125rem] leading-relaxed text-ink-2" style={{ animationDelay: "140ms" }}>
              React components for interfaces that shouldn&rsquo;t look familiar. Copy the source, keep the prompt, make it yours.
            </p>
            <div className="rise-in mt-9 flex flex-wrap items-center gap-3" style={{ animationDelay: "200ms" }}>
              <Link href="/components" className="group inline-flex h-12 items-center gap-2 rounded-md bg-cream px-6 text-[0.9375rem] font-medium text-void transition-colors hover:bg-white">
                Browse the collection
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
              <a href={site.github} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center gap-2 rounded-md border border-line-strong px-5 text-[0.9375rem] text-cream transition-colors hover:border-frost/40">
                <GitHubIcon className="size-4" /> GitHub
              </a>
            </div>
          </div>
          <div aria-hidden="true" className="vitrine-hall-pane">
            <Pane pose="present" priority sizes="(min-width: 1024px) min(44rem, 48vw), (min-width: 768px) 70vw, 100vw" className="vitrine-pane" />
          </div>
        </div>
      </section>

      {/* The collection, as it opens */}
      <section className="shell-container mt-20 md:mt-28" aria-label="From the collection">
        <div className="grid gap-x-6 gap-y-12 md:grid-cols-3">
          {hero.map((item, i) => (
            <div key={item.slug} className={i % 3 === 1 ? "md:mt-14" : i % 3 === 2 ? "md:mt-6" : ""}>
              <GalleryCard item={item} />
            </div>
          ))}
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
                <Link href={`/components?category=${c.id}`} className="group vitrine-home-cat">
                  <div>
                    <span className="vitrine-home-cat-num">{String(inCat.length).padStart(2, "0")}</span>
                    <h3 className="vitrine-home-cat-title">{c.label}</h3>
                    <p className="vitrine-home-cat-blurb">{c.blurb}</p>
                  </div>
                  <p className="vitrine-home-cat-browse">
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

      {/* Support: two choices in one system. Both sides share the same four rows (label, name, line, terms + action),
          so they read as a pair; Sponsor is contained and priced, Partner is open and scoped. */}
      <section className="vitrine-support-section shell-container relative" aria-labelledby="support-h">
        {/* Pane hangs over the boundary: hips hidden behind the Workshop section's rule, hands on this section's edge. */}
        <div aria-hidden="true" className="vitrine-hang">
          <Pane pose="hang" sizes="(min-width: 1024px) 14rem, (min-width: 768px) 12rem, 9rem" className="vitrine-pane" />
        </div>
        <div className="vitrine-support">
          <div className="vitrine-support-intro">
            <h2 id="support-h" className="font-display text-[clamp(1.875rem,3.2vw,2.5rem)] leading-tight tracking-[-0.02em] text-cream">Keep {site.name} growing.</h2>
            <p className="mt-2 text-[0.9375rem] text-ink-2">Support it, or build something with us.</p>
          </div>
          <div className="vitrine-support-choice vitrine-support-sponsor">
            <p className="vitrine-support-label">01 · Support</p>
            <h3 className="font-display text-[1.75rem] leading-tight tracking-[-0.015em] text-cream">Sponsor {site.name}</h3>
            <p className="max-w-[36ch] text-[0.9375rem] leading-relaxed text-ink-2">Fund the time it takes to keep the library free, polished and growing.</p>
            <div className="vitrine-support-terms">
              <p className="flex items-baseline gap-2">
                <span className="font-display text-[2.75rem] leading-none tracking-[-0.03em] text-cream">${site.tiers[0].price}</span>
                <span className="font-mono text-[0.6875rem] text-ink-3">a month, to start</span>
              </p>
              <p className="mt-2 font-mono text-[0.6875rem] text-ink-3">Your name on the sponsor page</p>
            </div>
            <Link href="/sponsor" className="group inline-flex h-12 items-center gap-2 self-start rounded-md border border-line-strong px-5 text-[0.9375rem] text-cream transition-colors hover:border-frost/40">
              See sponsorship plans <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>
          <div className="vitrine-support-choice vitrine-support-partner">
            <p className="vitrine-support-label">02 · Work together</p>
            <h3 className="font-display text-[1.875rem] italic leading-tight tracking-[-0.015em] text-cream">Partner with us</h3>
            <p className="max-w-[36ch] text-[0.9375rem] leading-relaxed text-ink-2">Build something with {site.name}, for your product or ours.</p>
            <div className="vitrine-support-terms">
              <p className="max-w-[30ch] font-mono text-[0.6875rem] leading-relaxed text-ink-3">Components · placements · integrations · custom work</p>
            </div>
            <Link href="/partner" className="group inline-flex h-12 items-center gap-1.5 self-start text-[0.9375rem] text-frost">
              Explore partnerships <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>
          <div aria-hidden="true" className="vitrine-support-peek">
            <Pane pose="peek" sizes="(min-width: 1024px) 15rem, (min-width: 768px) 13rem, 11rem" className="vitrine-pane" />
          </div>
        </div>
        {studios.length > 0 && (
          <ul aria-label="Studio sponsors" className="mt-6 flex flex-wrap items-center gap-x-10 gap-y-4">
            {studios.map((s) => (
              <li key={s.name}>
                <a href={s.href} target="_blank" rel="noreferrer" className="block opacity-60 grayscale transition hover:opacity-100 hover:grayscale-0">
                  {s.logo ? <img src={s.logo} alt={s.name} className="h-7 w-auto" /> : <span className="font-display text-[1.25rem] text-cream">{s.name}</span>}
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* GitHub: the page's last moment. Sits closer to Support (it's the third way to help), on a quiet horizon. */}
      <section className="shell-container mt-16 md:mt-24">
        <div className="vitrine-final px-6 text-center">
          <div aria-hidden="true" className="vitrine-final-field" />
          {/* Pane sits on the horizon with a glass star in his lap. */}
          <div aria-hidden="true" className="vitrine-final-star">
            <Pane pose="star" sizes="(min-width: 1024px) 15rem, (min-width: 768px) 12rem, 8rem" className="vitrine-pane" />
          </div>
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
