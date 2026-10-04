import type { Metadata } from "next";
import { pageMeta } from "@/site/seo";
import { site } from "@/site.config";

export const metadata: Metadata = pageMeta({ title: "About", description: "What Vitrine is, how its components are chosen, and how to use the source and prompts in your own work.", path: "/about" });

export default function About() {
  return (
    <div className="shell-container max-w-4xl pt-12 md:pt-20">
      <p className="eyebrow rise-in">About</p>
      <h1 className="rise-in mt-4 font-display text-[clamp(2.75rem,6.5vw,5rem)] leading-[0.95] tracking-[-0.03em] text-cream">A small, deliberate collection.</h1>
      <div className="mt-10 max-w-[60ch] space-y-5 text-[1.0625rem] leading-relaxed text-ink-2">
        <p>Vitrine is a curated set of React components, chosen for how they move, react and feel. It favours craft over count: each piece has one clear idea, is built to be read, and works on touch, on keyboard, and with reduced motion.</p>
        <p>There is no package to install. Every component is a file or two you copy into your own project — TypeScript, Tailwind where it helps, and plain CSS for the parts that need real keyframes. No animation libraries.</p>
      </div>

      <h2 id="usage" className="mt-20 font-display text-[2rem] tracking-[-0.015em] text-cream">
        How to use a component
      </h2>
      <ol className="mt-8 divide-y divide-line border-y border-line">
        {[
          ["Discover", "Browse the gallery or press ⌘K to search by name, tag or feel — try “glass”, “hover” or “authentication”."],
          ["Inspect", "Open a component to see it at full size, switch variants, and read the source and the design prompt behind it."],
          ["Copy", "Copy each file into your project, keep any CSS import next to the component, and adjust the usage example."],
          ["Make it yours", "Colours, sizes and timings live in props and CSS variables at the top of each file. Change them."],
        ].map(([t, d], i) => (
          <li key={t} className="grid gap-2 py-6 sm:grid-cols-[3rem_10rem_1fr] sm:gap-6">
            <span className="font-mono text-[0.6875rem] tabular-nums text-ink-3">0{i + 1}</span>
            <span className="font-display text-[1.375rem] text-cream">{t}</span>
            <span className="text-[0.9375rem] leading-relaxed text-ink-2">{d}</span>
          </li>
        ))}
      </ol>

      <h2 className="mt-20 font-display text-[2rem] tracking-[-0.015em] text-cream">Good to know</h2>
      <ul className="mt-6 max-w-[60ch] list-disc space-y-3 pl-5 text-[0.9375rem] leading-relaxed text-ink-2 marker:text-ink-3">
        <li>All demo content is fictional.</li>
        <li>Components that use WebGL or canvas pause when offscreen and fall back gracefully when unavailable.</li>
        <li>Fonts used inside components are named in their CSS; add them to your project (Google Fonts links are in the site&rsquo;s layout).</li>
      </ul>

      <p className="mt-16 text-[0.9375rem] text-ink-2">
        Source and issues live on{" "}
        <a href={site.github} target="_blank" rel="noreferrer" className="text-frost underline decoration-frost/30 underline-offset-4 hover:decoration-frost">
          GitHub
        </a>
        .
      </p>
    </div>
  );
}
