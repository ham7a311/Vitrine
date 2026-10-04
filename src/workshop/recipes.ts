import { getComponent } from "@/registry";
import { site } from "@/site.config";

/**
 * Recipes: complete pages built from real Vitrine components. Each one is proven by a live
 * preview (src/workshop/previews) and carries a build brief generated from the registry, so
 * component names and links can never drift from the library.
 */

export type RecipeSection = { title: string; component: string; why: string };

export type Recipe = {
  slug: string;
  name: string;
  /** What it is, in one line. */
  line: string;
  /** Who it's for. */
  for: string;
  /** Creative direction: tone, type, colour, restraint. */
  direction: string[];
  sections: RecipeSection[];
  /** How to choose and how much: curation rules that go beyond this one page. */
  guidance?: { title: string; points: string[] }[];
  /** Page background, for the preview stage while it loads. */
  bg: string;
};

export const RECIPES: Recipe[] = [
  {
    slug: "portfolio",
    name: "The Portfolio",
    line: "A personal site that leads with the work and ends with a way to reach you.",
    for: "Designers and engineers who want a site that reads like a considered résumé, not a template.",
    direction: [
      "Dark, warm and quiet: near-black plum (#0b080d) with cream text (#efe8dc) and one cool accent (#b9cce4).",
      "An editorial serif (Instrument Serif) for names and headings, a plain sans for reading, a mono for small labels and dates.",
      "Nothing moves unless it says something: the masthead folds away as you read, links draw an underline, work rows mark their title when you point at them.",
      "Real copy only. Name the projects, the years and the city.",
    ],
    sections: [
      { title: "Masthead and intro", component: "masthead-nav", why: "Your name set large, folding into a compact bar as the page scrolls, so the header is an introduction first and navigation second." },
      { title: "Inline links", component: "draw-link", why: "Links inside the intro sentence draw their underline on hover, so the sentence stays a sentence." },
      { title: "Selected work", component: "highlighter-row", why: "Editorial rows where a marker stroke swipes the project title: a list you read, not a grid you scan." },
      { title: "Experience", component: "meander-timeline", why: "Roles as dated entries that open for detail, so the page stays short but nothing is hidden." },
      { title: "Contact", component: "sign-off-footer", why: "Ends the page with one line, your email to copy, your local time and whether you're available." },
    ],
    bg: "#0b080d",
  },
  {
    slug: "glass-portfolio",
    name: "The Glass Portfolio",
    line: "A portfolio under glass: the work first, the proof in numbers, and one way to begin.",
    for: "Designers and engineers who want the portfolio people actually send, with atmosphere that never outruns the work.",
    direction: [
      "Night glass: ground #05060c, frost #b9cce4, cream #efe8dc. Glass appears twice — the hero field and one card — and nowhere else.",
      "Instrument Serif for the name and the two statements. Geist for reading. Geist Mono for labels, years and counts.",
      "Each pointer stays in its own section: a glow in the hero, a sweep on the opening line, a highlight on the case line, an intent label on the work and the contact. They are stacked, never nested.",
      "In-page links scroll smoothly inside the page. Reduced motion jumps. Real projects, years and counts. One invitation, repeated: start a project.",
    ],
    sections: [
      { title: "Hero", component: "glass-tiles", why: "A field of glass tiles behind the name gives the first screen a material without a photograph; the light follows the pointer and holds still under reduced motion." },
      { title: "Hero pointer", component: "glow-pointer", why: "A frost glow scoped to the hero makes that first screen feel present. It stops at the hero, so the rest of the page keeps a readable cursor." },
      { title: "Opening line", component: "highlight-sweep", why: "One sentence is swept once, as if someone were underlining the point, then the page gets on with the work." },
      { title: "Selected work", component: "hover-reel", why: "Projects as a list you can read, with the image arriving beside the row you are on, instead of a grid of equal cards." },
      { title: "How to work together", component: "glass-card", why: "The offer sits on one glass card: what you take on, when, and the single action." },
      { title: "The invitation", component: "tidefill-button", why: "The same button in the hero and on the card fills like a glass being poured, so the invitation is recognisable wherever it appears." },
      { title: "Case line", component: "highlight-cursor", why: "A shorter statement the reader can mark themselves, kept apart from the opening sweep so the two gestures do not fight." },
      { title: "The practice", component: "ledger-cylinder", why: "Years, projects and how many you take at once turn past as you scroll, so the numbers are a passage rather than a row of statistics." },
      { title: "Work and contact", component: "intent-label", why: "Pointing at a project or the email says what will happen — open the case, copy the address — before you commit to the click." },
    ],
    guidance: [
      {
        title: "Why this is the portfolio to send",
        points: [
          "Lead with a name and one sentence. The glass is the room, not the subject.",
          "Show four projects, not twenty. The reel is a contents page; the case line is the one argument you expand.",
          "Repeat one button. A second style makes the page look assembled.",
          "Put the numbers after the work, where they confirm what the reader has already seen.",
        ],
      },
    ],
    bg: "#05060c",
  },
  {
    slug: "showcase",
    name: "The Showcase",
    line: "A second portfolio, for visual work: a living backdrop, a signature, and projects catalogued like objects.",
    for: "Brand, product and visual designers whose work should be looked at before it is read about.",
    direction: [
      "Violet night: #0c0816 ground, cream text (#efe8dc), lilac (#c8b9ea) as the only accent. Two moving backgrounds, never more: silk at the top, water at the bottom.",
      "The name is signed, not typeset. After that, one editorial serif (Instrument Serif) for headings and a plain sans for reading.",
      "Calls to action fill like a glass being poured, and there are only two of them: see the work, start a project.",
      "Every project gets a year, a role and a scope. Show one before-and-after argument in depth instead of twelve thumbnails.",
    ],
    sections: [
      { title: "Hero backdrop", component: "silk-field", why: "Slow liquid light behind the name gives the page a mood without a stock photo; the glass lens drifts on its own on phones." },
      { title: "Signature", component: "flourish-name", why: "The first name draws itself with a swash when it comes into view: a personal mark, not a logo." },
      { title: "Calls to action", component: "tidefill-button", why: "Two buttons that fill with liquid on hover; the ink label appears exactly where the fill is, so the hover reads as an invitation." },
      { title: "Selected work", component: "specimen-card", why: "Each project is catalogued like a museum object, with its mark, a catalogue number and a tag for role, year and scope." },
      { title: "Case note", component: "lenticular-card", why: "Before and after on one card: tilt it and the redesign argues for itself." },
      { title: "Kind words", component: "halo-frame", why: "One client quote inside a frame with light travelling its edge; one is enough." },
      { title: "Contact", component: "caustic-pool", why: "The page ends underwater: caustic light behind the invitation, so the last screen feels like a place, not a form." },
    ],
    bg: "#0c0816",
  },
  {
    slug: "studio",
    name: "The Studio",
    line: "A company site for a small studio or agency: what you do, what you've done, who says so.",
    for: "Studios, agencies and small companies selling a service rather than a product.",
    direction: [
      "Warm dark ground (#16130f) with cream and one amber accent (#e8a24a) used only for calls to action.",
      "Large serif headings with generous measure; services and case studies set as lists and cards, never as icon grids.",
      "The page ends like a sheet being lifted: the footer is underneath the whole site.",
      "Testimonials are real sentences from named people, one at a time.",
    ],
    sections: [
      { title: "Page and footer", component: "curtain-footer", why: "The whole page is a sheet that lifts at the end to reveal the footer: the company's name, set large, underneath everything." },
      { title: "Services", component: "highlighter-row", why: "Three services as readable rows with a short description and tags, instead of three identical cards." },
      { title: "Selected work", component: "approach-card", why: "Case studies as cards whose title and stack come forward on approach, each linking to the full story." },
      { title: "Clients", component: "voices-carousel", why: "One named voice at a time, with the session or project it came from." },
      { title: "Questions", component: "focus-faq", why: "The question you open comes into focus and the others recede, so a long FAQ never becomes a wall." },
      { title: "Call to action", component: "halftone-cta", why: "One closing invitation on a halftone plate: badge, heading, one sentence, one button." },
    ],
    bg: "#16130f",
  },
  {
    slug: "launch",
    name: "The Launch",
    line: "A product page for a SaaS launch: atmosphere, live proof, honest pricing, answers.",
    for: "Teams launching a developer tool or SaaS product who want the page to feel like the product.",
    direction: [
      "Night palette: #0b080d ground, lilac and cream, with a dithered horizon as the only illustration.",
      "Show the product working instead of describing it: numbers that update in place.",
      "Pricing on one ruler, not three columns, so the price is a consequence of your team size.",
      "An index footer that doubles as a sitemap.",
    ],
    sections: [
      { title: "Hero", component: "bayer-horizon", why: "An ordered-dither sunset behind the headline: atmosphere with a point of view, and no stock imagery." },
      { title: "Live proof", component: "metric-morph", why: "Real metrics where only the changed digits turn over, so the page demonstrates the product's liveness." },
      { title: "Pricing", component: "usage-ruler", why: "Drag the team size along one ruler and watch the tier and price follow." },
      { title: "Questions", component: "search-faq", why: "A searchable FAQ with tags, for a product people evaluate carefully." },
      { title: "Call to action", component: "inline-cta", why: "The call to action is part of a sentence, which reads as confidence rather than a banner." },
      { title: "Footer", component: "index-footer", why: "An alphabetical index of the site: a sitemap with character." },
    ],
    bg: "#0b080d",
  },
  {
    slug: "console",
    name: "The Console",
    line: "An operations dashboard: live numbers, ninety days of uptime, deployments and the day's activity.",
    for: "Teams building an internal dashboard, admin panel or the overview page of a developer product.",
    direction: [
      "Near-black (#09090b) with raised panels (#111114) and hairline rings; colour is reserved for status: green ready, amber building, red failed.",
      "Numbers change in place and say how they changed; nothing blinks, nothing pulses for attention.",
      "Density where it helps: a table that focuses the row you're on and becomes records on a phone, an activity log where the gaps show how quiet the afternoon was.",
      "The sidebar is the only navigation; on a phone it goes away and the page is one column.",
    ],
    sections: [
      { title: "Navigation", component: "workspace-sidebar", why: "One indicator slides between rows, stepping inward for nested items, so where you are is always drawn." },
      { title: "Key numbers", component: "metric-morph", why: "Only the digits that changed turn over, coloured by whether the change is good; error rate and latency are inverted." },
      { title: "Uptime", component: "uptime-ribbon", why: "Ninety days per service as bars you can scrub; incidents carry their one-line explanation." },
      { title: "Deployments", component: "focus-table", why: "Sortable, keyboard-navigable, with the rows around the focused one receding; compact records on narrow screens." },
      { title: "Activity", component: "activity-stream", why: "Time has weight: gaps grow with the time between events, and repeated actions fold into one line." },
    ],
    bg: "#09090b",
  },
  {
    slug: "ai-workspace",
    name: "The AI Workspace",
    line: "An AI application: conversations, a model choice, visible reasoning, cited answers and a composer.",
    for: "Teams building an assistant, research tool or internal AI product.",
    direction: [
      "Paper palette: warm off-white (#f5f1e8) with ink text and a restrained serif for the assistant's answers.",
      "Show the work: reasoning as a line you can open, answers with numbered sources that highlight on hover.",
      "Chrome stays quiet so the conversation is the interface.",
      "Everything works on a phone: the sidebar collapses to a rail or goes full width.",
    ],
    sections: [
      { title: "Conversations", component: "conversation-sidebar", why: "History grouped by time; collapsing turns titles into initials rather than hiding them." },
      { title: "Model", component: "model-picker", why: "Models compared by speed and depth, so the choice is informed." },
      { title: "Reasoning", component: "thinking-trace", why: "What the assistant is doing, one line at a time, open for detail." },
      { title: "Answer", component: "cited-answer", why: "Every sentence carries its sources; hovering a citation lights the source card." },
      { title: "Answer actions", component: "message-actions", why: "Copy, retry through versions, and feedback with a reason." },
      { title: "Composer", component: "prompt-composer", why: "Attachments tuck into the composer's top edge like folder tabs; model and send stay in reach." },
    ],
    bg: "#f5f1e8",
  },
  {
    slug: "ai-company",
    name: "The AI Company",
    line: "A company website for an AI product: a calm hero, the product working on screen, proof, a clear price and one confident ask.",
    for: "AI labs, AI product companies and developer-tool startups that need to look credible to engineers and buyers at the same time.",
    direction: [
      "Restrained colour: a near-black ground (#08070a), warm off-white text (#efe8dc) and one cool accent (#b9cce4). Colour comes from the product and one background, not from decoration.",
      "Strong type, generous space: a serif for headlines (Instrument Serif), a plain sans for reading (Geist), mono only for small technical labels. Big headings, short lines, long pauses between sections.",
      "Show, don't claim: the product is shown doing a real task (an agent run, a cited answer, a diff) before any adjective about it.",
      "Technical credibility: real numbers with units and timeframes, real model and API names, a changelog-dated tone. Never 'revolutionary' or 'AI-powered' as a headline.",
      "Calm rhythm: one moving surface at a time. Motion explains (a step completes, a number updates), it never decorates.",
    ],
    sections: [
      { title: "Hero backdrop", component: "silk-field", why: "One slow, low-contrast field behind the headline gives the brand a mood without a stock render; it renders a still frame under reduced motion and pauses offscreen." },
      { title: "The product, working", component: "agent-run", why: "The hero's promise proven immediately: an agent plans, searches, edits and runs tests on screen, with a summary at the end." },
      { title: "Pointer, in the demo only", component: "glow-pointer", why: "A soft glow scoped to the product demo makes that section feel live; the rest of the site keeps the system cursor." },
      { title: "What it does", component: "feature-trio", why: "Three capabilities, each shown with a miniature working interface instead of an icon." },
      { title: "Proof in numbers", component: "metric-morph", why: "Live, unit-labelled metrics (latency, uptime, tasks run) that update calmly, the credibility layer for technical buyers." },
      { title: "Pricing", component: "usage-ruler", why: "One instrument instead of three cards: drag to your usage and the plan follows, so the price is never a mystery." },
      { title: "Questions", component: "focus-faq", why: "Security, data retention and model questions answered plainly, one at a time." },
      { title: "The ask", component: "focus-pull-cta", why: "A closing headline with one primary and one secondary action; focus racks to whichever you're about to choose." },
      { title: "Footer", component: "index-footer", why: "An index of docs, changelog, security and status: the pages a careful buyer looks for." },
    ],
    guidance: [
      {
        title: "Choose by product and audience",
        points: [
          "Developer tool or API: lead with agent-run, inline-diff or a terminal-like demo; mono labels and real code; pricing by usage (usage-ruler).",
          "Assistant or chat product: lead with cited-answer, thinking-trace or prompt-composer; a paper palette reads warmer than black.",
          "Research lab or model company: a typographic hero (letterform-hero or a quiet background) and long-form writing; numbers and charts (pulse-line-chart, percentile-curve-stats) over feature grids.",
          "Enterprise buyers: put security, data handling and SSO in the FAQ and footer, and keep pricing honest (subtractive-pricing shows exactly what each plan leaves out).",
        ],
      },
      {
        title: "Curation: one of each, on purpose",
        points: [
          "One hero treatment: a background or a typographic hero, never both competing.",
          "One navigation system for the whole site, and one primary button style repeated everywhere.",
          "One AI interaction component on the home page; others belong on product pages.",
          "Cursors: at most one or two styles (for example glow-pointer in the demo, highlight-sweep for a single headline), scoped to the sections that benefit; never site-wide.",
          "If two components are both 'the impressive one', cut one. Restraint is what makes the remaining one feel expensive.",
        ],
      },
      {
        title: "Backgrounds: where they help and where they hurt",
        points: [
          "Ambient backgrounds belong behind the hero or the final call to action: moments with little text and one message.",
          "Never put moving backgrounds behind paragraphs, pricing, forms or tables. Reading and motion compete, and contrast becomes unpredictable.",
          "Check contrast at the background's brightest frame. If body text drops below 4.5:1, add a scrim or reduce the background's intensity; don't lighten the text.",
          "Motion supports hierarchy: the slowest, largest motion sits furthest back, and only the product demo moves in the foreground.",
          "Avoid fatigue: one ambient surface per page, slow (cycles of 10s or more), low contrast. Every Vitrine background pauses offscreen and in hidden tabs.",
          "Reduced motion: every Vitrine background renders a designed still frame; check that it still looks intentional.",
          "Performance: WebGL and canvas backgrounds cost GPU time and battery. Load one per page, below the LCP element's text, and confirm with /performance-pass on a throttled phone.",
        ],
      },
    ],
    bg: "#08070a",
  },
];

export const getRecipe = (slug: string) => RECIPES.find((r) => r.slug === slug);
export const recipesUsing = (component: string) => RECIPES.filter((r) => r.sections.some((s) => s.component === component));

const SITE = site.url;

/** The copyable build brief. Throws at build time if a recipe names a component that doesn't exist. */
export function buildBrief(r: Recipe): string {
  const parts = r.sections.map((s) => {
    const meta = getComponent(s.component);
    if (!meta) throw new Error(`Recipe "${r.slug}" uses unknown component "${s.component}"`);
    return { ...s, meta };
  });
  const unique = parts.filter((p, i) => parts.findIndex((q) => q.component === p.component) === i);
  return [
    `# Build brief: ${r.name}`,
    "",
    r.line,
    `For: ${r.for}`,
    "",
    "## Direction",
    ...r.direction.map((d) => `- ${d}`),
    "",
    ...(r.guidance ? r.guidance.flatMap((g) => ["", `## ${g.title}`, ...g.points.map((p) => `- ${p}`)]) : []),
    "",
    "## Page map",
    ...parts.map((p, i) => `${i + 1}. ${p.title}: ${p.meta.name}. ${p.why}`),
    "",
    "## Components",
    "Copy each component's files from its page (Code tab) into your project before you start, and use them as given: change props and content, not internals.",
    ...unique.map((p) => `- ${p.meta.name}: ${SITE}/components/${p.component} (${p.meta.description.split(". ")[0].replace(/\.$/, "")}.)`),
    "",
    "## Build",
    "- Next.js (App Router), TypeScript, Tailwind CSS. No extra UI libraries.",
    "- Write real content for this site: real names, dates, numbers and sentences. No lorem ipsum, no \"Feature one\".",
    "- Compose the sections in the order of the page map. Keep each component's own spacing; add page rhythm with consistent section padding.",
    "- Mobile first: every section must work at 375px wide without horizontal scrolling.",
    "- Respect prefers-reduced-motion everywhere; every Vitrine component already does.",
    "",
    "## Before you ship",
    `- Run \`/template-tells\` (${SITE}/workshop/skills/template-tells) on everything you wrote yourself: copy, sections, styles.`,
    `- Run \`/responsive-audit\` (${SITE}/workshop/skills/responsive-audit) at 375, 768 and 1280.`,
    `- Run \`/accessibility-pass\` (${SITE}/workshop/skills/accessibility-pass).`,
    `- Run \`/performance-pass\` (${SITE}/workshop/skills/performance-pass) on a production build.`,
    `- Run \`/technical-seo-audit\` (${SITE}/workshop/skills/technical-seo-audit) and \`/seo-auditor\` (${SITE}/workshop/skills/seo-auditor) before launch.`,
    "",
  ].join("\n");
}
