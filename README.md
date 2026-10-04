<div align="center">

# Vitrine

**Kept under glass.**

300+ hand-built React components, chosen for how they move, react and feel.
Read the source. Read the prompt behind it. Take it and make it yours.

[![License: MIT](https://img.shields.io/badge/license-MIT-b9cce4.svg)](./LICENSE)
![Components](https://img.shields.io/badge/components-301-c8b9ea)
![React](https://img.shields.io/badge/React-19-149eca)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6)
![No animation libraries](https://img.shields.io/badge/animation%20libraries-none-1f1a24)
![Copy/paste](https://img.shields.io/badge/install-copy%2Fpaste-1f1a24)

[Browse the collection](#run-the-gallery-locally) · [How it works](#how-it-works) · [Workshop](#the-workshop) · [Contributing](#contributing)

</div>

<!-- Add a hero GIF or screenshot here once the site is deployed: ![Vitrine gallery](docs/hero.gif) -->

---

## What is Vitrine?

A *vitrine* is a glass display case: you look, you don't touch. Vitrine is the one display where you're allowed to take the object.

It is a curated gallery of React components where each piece has **one clear idea**, drawn from a physical world (shattering glass, letterpress, split-flap boards, wet ink, vinyl sleeves, boarding passes) and kept useful. Every component ships with:

- a **live preview** you can switch between variants,
- the **real source**, exactly what runs in the preview,
- the **design prompt** behind it, precise enough to rebuild or adapt the component with an AI assistant,
- notes on **interaction, animation, accessibility, responsiveness and touch fallback**.

There is no package, no CLI and no registry install. You copy a file or two into your project and it's yours.

## Why Vitrine

| | |
|---|---|
| **Taste over count** | Components have a point of view. A button doesn't just have a hover state, it shatters from one impact point, or fills like a glass being poured. |
| **Prompt-as-artifact** | Each component carries the written brief it was built from, with per-variant prompts. Paste it into an LLM to adapt the piece to your product. |
| **Zero lock-in** | Plain React + TypeScript, Tailwind only where it helps, plain CSS for real keyframes. **No animation libraries.** Nothing to keep updated. |
| **Accessible by rule** | Keyboard access, visible focus, `prefers-reduced-motion` and a touch fallback for anything hover-dependent are requirements, not extras. |
| **Well-behaved visuals** | WebGL and canvas pieces pause offscreen and in hidden tabs, cap device pixel ratio, and fall back gracefully. |
| **More than parts** | Full-page recipes and ready-made AI skills show how to compose the pieces into a site that doesn't look templated. |

## What's inside

**301 components in 27 categories.**

| Category | | Category | | Category | |
|---|---:|---|---:|---|---:|
| Buttons | 45 | Backgrounds | 39 | Cards | 30 |
| Controls | 19 | AI & Chat | 17 | Stats | 15 |
| Authentication | 15 | Cursors | 13 | Analytics | 12 |
| Type & Names | 10 | CTAs | 10 | Text Animations | 8 |
| Micro-animations | 8 | FAQ | 8 | Forms | 7 |
| Pricing | 6 | Navigation | 6 | Media | 5 |
| Feedback | 5 | Data | 5 | Heroes | 4 |
| Overlays | 3 | Maps & Globes | 3 | Footers | 3 |
| Sidebars | 2 | Sections | 2 | Navbars | 1 |

A few to start with:

- **Glassbreak Button**: a plate of dark glass that fractures from a single impact point, pure CSS and fully choreographed.
- **Silk Field**: a shader background you can set type on.
- **Specimen Card**: a card treated as a catalogued object.
- **Iris Shutter Button**: an action that opens and closes like a lens.
- **Prompt Composer, Thinking Trace, Cited Answer, Inline Diff**: the building blocks of a polished AI interface.
- **Split-Flap Text, Chrome Text, Extrude Text**: type that moves with intent.
- **Route Globe, Sankey Flow, Sunburst Drill, Cohort Retention**: data that rewards a closer look.

## Run the gallery locally

Requirements: **Node 22.6+** (24 recommended) and **Python 3** (used by the registry generator).

```bash
git clone https://github.com/ham7a311/vitrine.git
cd vitrine
npm install
npm run dev          # http://localhost:3000
```

Other scripts:

```bash
npm run build        # production build of every page
npm run typecheck    # tsc --noEmit
npm run registry     # regenerate the registry index + run the prompt guard
```

Press **⌘K** (or **Ctrl K**) in the gallery to search by name, tag or feel, for example "glass", "hover" or "authentication".

## How it works

1. **Discover**: browse by category or search.
2. **Inspect**: open a component to see it full size, switch variants, and read the source and the prompt.
3. **Copy**: copy each file into your project. Keep any `.css` next to the component.
4. **Make it yours**: colours, sizes and timings live in props and CSS variables at the top of each file.

The code tab reads the real files from disk at build time, so what you copy is exactly what runs in the preview.

> **Fonts.** Components name their fonts in CSS (Geist, Instrument Serif, Anton, Archivo, IBM Plex…). The site loads them from Google Fonts in `src/app/layout.tsx`. Add the ones you use to your own project.

## The Workshop

Vitrine also shows how to build with the collection.

**Recipes** are complete pages made only from Vitrine components, each with creative direction, a section-by-section component plan, and a copyable build brief:

The Portfolio · The Glass Portfolio · The Showcase · The Studio · The Launch · The Console · The Handbook · The AI Workspace · The AI Company

**Skills** are 19 reusable AI workflows written as `SKILL.md` files that work in Claude Code, Claude.ai projects, Cursor rules and ChatGPT projects:

| Stage | Skills |
|---|---|
| **Design** | Art Director · Design Critic · Template Tells · Interface Copy · Motion Critic · Theme System · Copy Quality · Landing Page Art Director · Portfolio Art Director · Content Structure Auditor |
| **Build** | Component Author · Component Architect |
| **Check** | Responsive Auditor · Accessibility Auditor · Performance Auditor |
| **Grow** | SEO Auditor · Technical SEO Audit · Search Optimization · Conversion UX Review |

The skill files live in `src/workshop/skills/<name>/SKILL.md`.

## Component rules

Every component in the collection follows the same contract:

- React + TypeScript. Tailwind only where it helps. Plain CSS for real keyframes. **No animation libraries.**
- Colours are defined by the component itself (CSS variables or props). Nothing reads the gallery's tokens.
- Keyboard access, visible focus, `prefers-reduced-motion`, and a touch fallback for hover-dependent behaviour.
- WebGL/canvas components pause offscreen and in hidden tabs, cap DPR and degrade gracefully.
- Demo content is fictional.

A **prompt guard** (`scripts/check-prompts.mts`) enforces that variant prompts describe only the selected option, so a component's brief never drifts from what it shows.

## Project structure

```
src/
  app/            Next.js App Router: home, /components, /components/[slug], /categories, /about, /workshop
  site/           the gallery shell (navbar, search palette, preview stage, code viewer), not meant to be copied
  lib/            search scorer, build-time source loader (shiki)
  workshop/       recipes, skills (SKILL.md) and live recipe previews
  registry/
    <category>/<slug>/
      <Name>.tsx  the component
      <name>.css  keyframes / complex selectors, when needed
      demo.tsx    what the gallery renders (also shown as usage.tsx)
      meta.ts     name, category, tags, prompt, interaction, a11y, variants…
    order.txt     curated gallery order
    gen.py        `npm run registry` regenerates index.ts + demos.tsx from order.txt
scripts/          prompt guard
```

## Adding a component

1. Create `src/registry/<category>/<slug>/` with the component, an optional `.css`, a `demo.tsx` (default export, receives `{ variant }`) and a `meta.ts`.
2. Add `<category>/<slug>` to `src/registry/order.txt`.
3. Run `npm run registry`.

Read [CONTRIBUTING.md](./CONTRIBUTING.md) for the full checklist.

## Tech

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · shiki for build-time syntax highlighting. Playwright is used for development tooling only.

## FAQ

**Is there an npm package or CLI?**
No, on purpose. Copy the files you want. You own the code and there is nothing to upgrade.

**Can I use these in commercial projects?**
Yes. Vitrine is MIT licensed.

**Do I have to credit Vitrine?**
No, but a link is always appreciated.

**Do the components need Tailwind or Framer Motion?**
No animation library is used anywhere. The gallery shell uses Tailwind; components use it only where it helps, and plain CSS for the rest. Each component's `meta.ts` lists its dependencies.

**Can I paste a component's prompt into an AI tool?**
That's what it's for. Each prompt describes geometry, timing, states and fallbacks precisely enough to rebuild or adapt the piece.

## Contributing

Contributions are welcome: new components that fit the collection, accessibility fixes, bug fixes and docs. Please read [CONTRIBUTING.md](./CONTRIBUTING.md) first. It covers the component rules, how to add one, and the licence terms for contributions (MIT, with commit sign-off).

## Licence

[MIT](./LICENSE) © 2026 Hamza Al-Bulushi. Copy the components into your own projects, commercial or not.
