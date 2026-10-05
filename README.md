<div align="center">

# Vitrine

**Kept under glass.**

300+ hand-built React components, chosen for how they move, react and feel.
Read the source. Read the prompt behind it. Take it and make it yours.

[![License: MIT](https://img.shields.io/badge/license-MIT-b9cce4.svg)](./LICENSE)
![Components](https://img.shields.io/badge/components-333-c8b9ea)
![React](https://img.shields.io/badge/React-19-149eca)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6)
![No animation libraries](https://img.shields.io/badge/animation%20libraries-none-1f1a24)
![Copy/paste](https://img.shields.io/badge/install-copy%2Fpaste-1f1a24)

[Browse the collection](https://tryvitrine.dev) · [How it works](#how-it-works) · [Workshop](#the-workshop) · [Contributing](#contributing)

</div>

[Explore live previews, source files and prompts at tryvitrine.dev](https://tryvitrine.dev/components).

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
| **Zero lock-in** | Plain React + TypeScript, Tailwind only where it helps, plain CSS for real keyframes. **No animation libraries.** You maintain the copied source in your project. |
| **Accessible by rule** | Keyboard access, visible focus, `prefers-reduced-motion` and a touch fallback for anything hover-dependent are requirements, not extras. |
| **Well-behaved visuals** | WebGL and canvas pieces pause offscreen and in hidden tabs, cap device pixel ratio, and fall back gracefully. |
| **More than parts** | Full-page recipes and ready-made AI skills show how to compose the pieces into a site that doesn't look templated. |

## What's inside

**333 components in 27 categories.**

| Category | | Category | | Category | |
|---|---:|---|---:|---|---:|
| Buttons | 46 | Backgrounds | 39 | Cards | 31 |
| Controls | 19 | AI & Chat | 17 | Stats | 17 |
| Authentication | 15 | Cursors | 13 | Analytics | 12 |
| Type & Names | 10 | CTAs | 10 | Text Animations | 8 |
| Micro-animations | 8 | FAQ | 9 | Forms | 12 |
| Pricing | 6 | Navigation | 7 | Media | 5 |
| Feedback | 14 | Data | 13 | Heroes | 4 |
| Overlays | 3 | Maps & Globes | 3 | Footers | 3 |
| Sidebars | 2 | Sections | 6 | Navbars | 1 |

A few to start with:

- **Glassbreak Button**: a plate of dark glass that fractures from a single impact point, pure CSS and fully choreographed.
- **Silk Field**: a shader background you can set type on.
- **Specimen Card**: a card treated as a catalogued object.
- **Iris Shutter Button**: an action that opens and closes like a lens.
- **Prompt Composer, Thinking Trace, Cited Answer, Inline Diff**: the building blocks of a polished AI interface.
- **Split-Flap Text, Chrome Text, Extrude Text**: type that moves with intent.
- **Route Globe, Sankey Flow, Sunburst Drill, Cohort Retention**: data that rewards a closer look.
- **Trace 404, Forwarding 404, Underside 404**: missing pages that explain where the request stopped, where the page moved, or turn over to an index.
- **Insert Menu, Board View, Page Header**: a calm document editor's pieces, from the / menu to drag-and-drop status boards.
- **Lesson Path, Word Bank, League Table**: chunky, pressable learning UI where progress always says what it means.
- **Query Cell, Schema Drop, Column Profile**: a hard-edged data toolkit that parses CSV and profiles columns in the browser.
- **Card Wallet, Transfer Composer, Approval Inbox**: precise banking flows that await real callbacks and never fake success.

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

The code tab reads the real files at build time, follows local imports, and rewrites them into one portable folder. Copy every listed file, including usage.tsx, into the same directory. The exported usage.tsx keeps demonstration links inside the example; reusable components still accept real URLs for your own application. The release check compiles all 333 exported examples in isolation.

> **Fonts.** Components name their fonts in CSS (Geist, Instrument Serif, Anton, Archivo, IBM Plex…). Each component page lists the fonts found in its source. Live demos load them through `src/site/ComponentFonts.tsx`; gallery fonts are self-hosted through Fontsource packages. Add the listed font families to your own project.

## The Workshop

Vitrine also shows how to build with the collection.

**Recipes** are complete pages made only from Vitrine components, each with creative direction, a section-by-section component plan, and a copyable build brief:

The Portfolio · The Glass Portfolio · The Showcase · The Studio · The Launch · The Console · The AI Workspace · The AI Company

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

## Release verification

Run `npm ci` and `npm run release:check`. This validates prompts and variants, registry consistency, CSS isolation, all portable examples, authentication failure/retry behavior, and the production build. `npm audit --audit-level=moderate` checks the installed dependency advisories.

For production route and browser checks, build and start on port 3147, then run `npm run test:routes` and `npm run test:browser`, then `npm run test:expansion-browser`. The expansion browser check saves responsive screenshots and verifies seamless partner loops in both directions. Install the test browser with `npx playwright install chromium`. Set `VITRINE_TEST_URL` to test another deployment. CI runs these checks automatically. To avoid sharing output with a running development server, set `VITRINE_DIST_DIR=.next-release` for both build and start.

Prompts include the selected variant (including theme-only variants), interaction, motion, accessibility, responsive and touch requirements. The checks verify composition and selection; AI-generated results still need review against the live preview and source.

### Authentication examples

The gallery demonstrates UI. It does not authenticate visitors or send email. Passkey Sign-in requires `verify`, One-Field Sign-in requires `sendCode` and `verify`, and Code Cascade Verify requires `verify`. Optional email/resend actions appear only when their callbacks are supplied. Demo callbacks live in `usage.tsx`; replace them with your own server-backed integrations before production use. Never accept an authentication result solely on the client.
