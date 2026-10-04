/** Skills: reusable AI workflows, written as Claude Code SKILL.md files. The text lives in ./skills/<slug>/SKILL.md. */

export type Skill = {
  slug: string;
  /** Display name, "Vitrine — …". */
  name: string;
  /** What it does, in one line. */
  line: string;
  /** When to reach for it. */
  when: string;
  stage: Stage;
};

export type Stage = "Design" | "Build" | "Check" | "Grow";
export const STAGES: { stage: Stage; line: string }[] = [
  { stage: "Design", line: "Decide what it should be, and say it in words, colours and motion." },
  { stage: "Build", line: "Make components other people can trust." },
  { stage: "Check", line: "Measure it on real devices before anyone else does." },
  { stage: "Grow", line: "Make it findable, understandable and worth choosing — by people and by search engines." },
];

export const SKILLS: Skill[] = [
  { slug: "art-director", name: "Vitrine — Art Director", line: "Gives a site a distinctive design where every component has one idea of its own, drawn from the product's world and kept useful.", when: "When starting a site or a redesign, or when a design feels like every other one.", stage: "Design" },
  { slug: "interface-critic", name: "Vitrine — Design Critic", line: "Judges a design or component against a clear quality bar and gives a keep, refine or cut verdict.", when: "Before you build an idea, and before you ship anything you added yourself.", stage: "Design" },
  { slug: "template-tells", name: "Vitrine — Template Tells", line: "Finds what makes a site look generated or templated, in the copy, the visuals and the code, and writes the specific replacement for each.", when: "When a site looks like every AI-built site, before a launch, or when reviewing generated UI and copy.", stage: "Design" },
  { slug: "interface-copy", name: "Vitrine — Interface Copy", line: "Writes buttons, errors, empty states and headlines that are specific and consistent, and demo content that reads as real.", when: "When writing or reviewing interface text, or replacing placeholder content.", stage: "Design" },
  { slug: "motion-director", name: "Vitrine — Motion Critic", line: "Makes every animation explain something, with a shared vocabulary and a real reduced-motion version; a script records what a page animates.", when: "When adding animation, when motion feels random or slow, or before shipping animated UI.", stage: "Design" },
  { slug: "theme-system", name: "Vitrine — Theme System", line: "Builds colour, type and space tokens as roles, with designed light and dark themes and a script that checks every contrast pair.", when: "When setting up dark mode or theming, or when colours are hard-coded across components.", stage: "Design" },
  { slug: "component-author", name: "Vitrine — Component Author", line: "The house rules for writing a self-contained React component another developer can copy and trust.", when: "When building a reusable component, or cleaning one up for a library.", stage: "Build" },
  { slug: "responsive-audit", name: "Vitrine — Responsive Auditor", line: "Measures a site at phone, tablet and desktop widths with Playwright, makes a contact sheet, fixes, re-runs.", when: "Whenever something might look wrong on a phone, and before every launch.", stage: "Check" },
  { slug: "accessibility-pass", name: "Vitrine — Accessibility Auditor", line: "A hands-on keyboard, focus, naming, announcement, motion and contrast check, verified in a real browser.", when: "Before shipping any interface, or when asked to fix accessibility.", stage: "Check" },
  { slug: "performance-pass", name: "Vitrine — Performance Auditor", line: "Measures load and responsiveness as a throttled phone, finds the biggest cause, fixes it and measures again.", when: "Before a launch, when a page feels slow on a phone, or after adding heavy visuals.", stage: "Check" },
  { slug: "copy-quality", name: "Vitrine — Copy Quality", line: "Audits and rewrites copy that reads as generic, inflated or machine-written — buzzwords, empty claims, symmetric sentences, vague CTAs — and keeps the personality that belongs to the product.", when: "Before shipping a landing page, product page or portfolio, or whenever copy sounds like it could describe anyone.", stage: "Design" },
  { slug: "landing-page-art-director", name: "Vitrine — Landing Page Art Director", line: "Plans a landing page section by section — one hero idea, a proof sequence, one call to action — and picks the Vitrine components for each slot with a reason.", when: "When starting a product, launch or campaign page, or when a landing page feels like a stack of unrelated blocks.", stage: "Design" },
  { slug: "portfolio-art-director", name: "Vitrine — Portfolio Art Director", line: "Turns a person's real work into a portfolio with a point of view: what to lead with, how to show each project, and which few components carry the personality.", when: "When building or redesigning a personal site, a studio site or a case-study page.", stage: "Design" },
  { slug: "content-structure-auditor", name: "Vitrine — Content Structure Auditor", line: "Maps what a page says against what its visitor came to find out, then fixes the order, headings, labels and length so the page reads in the right sequence.", when: "When a page is long but unclear, before writing copy for a new page, or when headings don't tell the story on their own.", stage: "Design" },
  { slug: "component-architect", name: "Vitrine — Component Architect", line: "Designs a component's API before its looks: what's fixed, what's configurable, which variants exist, and how its prompt, preview and code stay in agreement.", when: "When adding a configurable component to a library, or when one component has grown props that fight each other.", stage: "Build" },
  { slug: "seo-auditor", name: "Vitrine — SEO Auditor", line: "Audits on-page SEO page by page — titles, descriptions, headings, semantic HTML, internal links, alt text and search intent — and writes the exact fix for each.", when: "Before launch, when pages aren't showing up for the searches they should, or after a redesign changed every template.", stage: "Grow" },
  { slug: "technical-seo-audit", name: "Vitrine — Technical SEO Audit", line: "Checks that search engines can crawl, understand and correctly index a site: robots, sitemap, canonicals, metadata, structured data, social cards, redirects and duplicates — with Next.js specifics.", when: "Before a launch or domain move, when pages are missing from the index, or when a site generates many pages from data.", stage: "Grow" },
  { slug: "search-optimization", name: "Vitrine — Search Optimization", line: "Improves a site's own search box: relevance, synonyms, typo tolerance, ranking and empty states, proven with a table of real queries and their expected results.", when: "When people search your library, docs or catalogue and don't find what's there.", stage: "Grow" },
  { slug: "conversion-ux-review", name: "Vitrine — Conversion UX Review", line: "Walks the path from first screen to the action that matters, finds where people hesitate or get lost, and fixes friction without dark patterns.", when: "When traffic is fine but sign-ups, bookings or purchases aren't, or before launching a pricing or sign-up flow.", stage: "Grow" },
];

/** How a skill is named everywhere: the slash command you type to run it. */
export const command = (s: Pick<Skill, "slug">) => `/${s.slug}`;

export const getSkill = (slug: string) => SKILLS.find((s) => s.slug === slug);

export const WORKS_IN = ["Claude Code", "Claude.ai projects", "Cursor rules", "ChatGPT projects"];
