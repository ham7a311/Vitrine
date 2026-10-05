import { ComponentFonts } from "@/site/ComponentFonts";
import type { Metadata } from "next";
import { pageMeta } from "@/site/seo";
import { Suspense } from "react";
import { registry, summaries } from "@/registry";
import { Gallery } from "@/site/Gallery";

export const metadata: Metadata = pageMeta({ title: "Components", description: `Browse ${registry.length} React components — buttons, backgrounds, cursors, cards, charts, AI chat and more — each with source, a live preview and the prompt behind it.`, path: "/components" });

export default function ComponentsPage() {
  return (<> <ComponentFonts />
    <div className="shell-container pt-12 md:pt-20">
      <header className="rise-in max-w-3xl">
        <p className="eyebrow">The collection · {registry.length} pieces</p>
        <h1 className="mt-4 font-display text-[clamp(2.75rem,6.5vw,5rem)] leading-[0.95] tracking-[-0.03em] text-cream">
          Every component, <em className="text-frost">live</em>.
        </h1>
        <p className="mt-5 max-w-[52ch] text-[1.0625rem] leading-relaxed text-ink-2">
          Hover, click, drag — every preview below is the real component running. Open one to read its source and the prompt behind it.
        </p>
      </header>
      <div className="mt-14">
        <Suspense fallback={<div className="min-h-[70vh]" aria-hidden="true" />}>
          <Gallery items={summaries()} />
        </Suspense>
      </div>
    </div>
  </>);
}
