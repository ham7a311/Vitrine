import { getComponent } from "@/registry";
import { site } from "@/site.config";
import { getSkill } from "@/workshop/skills";

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
  /** One realistic brief this recipe answers, the way someone would ask for it. */
  scenario: string;
  /** The first things to replace to make it yours: specific to this recipe, never "colours / copy / imagery". */
  changeFirst: string[];
  /** Skills to use on this recipe, each with why it matters here. responsive-audit and accessibility-pass are always included. */
  skills: { slug: string; why: string }[];
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
    line: "A personal site in two designed themes, light and dark, with the work showing through your name.",
    for: "Designers and engineers who want a site that reads like a considered résumé and still has one moment people remember.",
    scenario: "A personal site for a product designer and engineer with six years of work: the name as a window onto the projects, five products, three pieces of writing, a contact slip, and a light/dark switch that changes everything at once.",
    changeFirst: [
      "Set the word in the hero to your first name, and give each project a real screenshot as its cover.",
      "Replace the reel with your five strongest products, each with what it is and the year.",
      "Swap the writing cards for pieces you've actually published, with honest lengths and dates.",
      "Point the enquiry slip at your real email and time zone, and say how quickly you reply.",
    ],
    skills: [
      { slug: "portfolio-art-director", why: "Decides which projects lead and which one shows through the letters first." },
      { slug: "theme-system", why: "Two themes are two palettes, each checked for contrast, not a light one with the colours flipped." },
      { slug: "copy-quality", why: "A personal site lives on its sentences; this keeps the intro and project lines specific." },
      { slug: "responsive-audit", why: "The letterform hero and the reel need their own phone composition." },
      { slug: "accessibility-pass", why: "The theme switch is a real switch, the transition respects reduced motion, and the reel works without a pointer." },
    ],
    direction: [
      "Two themes, both designed: warm paper (#f4efe6, ink #1d1a16) and a warm night (#100e0d, ink #efe8dc), with terracotta (#b4532a, #e39a6f at night) as the one accent.",
      "Theme Shift wraps the page: the switch in the nav sets the theme, and the new theme blooms out from the switch over a still copy of the old one. Under reduced motion it changes instantly.",
      "Every component takes the page's theme through its own theme prop and its colours through its tokens, so one switch changes the hero, the reel, the cards, the form and the button together.",
      "Fraunces for display, Inter for reading, mono for small labels. The hero's poster letters are the only heavy type on the page.",
      "One content width for every section, matched to the reel's, so the left edges line up all the way down.",
    ],
    sections: [
      { title: "Theme", component: "theme-shift", why: "A light/dark switch where the change is the show: the new theme blooms from the switch, and the page underneath has already switched." },
      { title: "Hero", component: "letterform-hero", why: "Your name set huge, with the work showing through the letters; pointing at a project puts it in the windows." },
      { title: "Call to action", component: "swell-button", why: "The label moves like water under the pointer: one button, one action, start a project." },
      { title: "Selected work", component: "hover-reel", why: "A list you read, with a picture that blooms under the cursor and follows it from project to project." },
      { title: "Writing", component: "folio-card", why: "Article cards as thick as the article, so length is visible before anyone clicks." },
      { title: "Contact", component: "enquiry-slip", why: "A contact form set as a correspondence slip that says when to expect a reply and what time it is where you are." },
    ],
    bg: "#f4efe6",
  },
  {
    slug: "showcase",
    name: "The Showcase",
    line: "A portfolio for visual work: a spiral of real project sites first, words second.",
    for: "Brand, web and visual designers whose work should be looked at before it's read about.",
    scenario: "A portfolio for an independent brand and web designer with a dozen client projects: open on the work itself, then say what she does, show what clients said, and end with one way to book a call.",
    changeFirst: [
      "Replace the spiral's projects with your own work: real screenshots or the mock sites rebuilt in your clients' colours.",
      "Set the brand mark and name in the spiral's bar, and point its links at your real sections.",
      "Write the services list from what you actually sell, and set the two glass buttons to your real actions.",
      "Use quotes from named clients with their roles, and put your real booking link in the closing call.",
    ],
    skills: [
      { slug: "portfolio-art-director", why: "Decides which twelve projects make the spiral and which one leads." },
      { slug: "template-tells", why: "A visual portfolio can tip into effects for their own sake; this keeps the work in front." },
      { slug: "performance-pass", why: "A WebGL spiral, a glass ring and a living CTA field share one page; measure them on a throttled phone." },
      { slug: "responsive-audit", why: "The spiral, the glass ring and the testimonial rows each need checking at 375px." },
      { slug: "accessibility-pass", why: "The spiral is driven by scroll; it must also step by keyboard, and the testimonials must pause." },
    ],
    direction: [
      "Black (#010307) with white type; colour comes only from the work in the spiral, one warm glow behind the about section, and the closing field.",
      "Syne for headings, wide and confident; Inter for everything you read.",
      "The work opens the page. Scrolling turns the spiral, so the first thing a visitor does is look through projects.",
      "Three moving surfaces, separated by quiet dark sections: the spiral, the glass ring, the closing field. Never two on screen at once.",
      "Liquid glass buttons only where there is colour behind them to bend; elsewhere, plain text links.",
    ],
    sections: [
      { title: "Opening and work", component: "helix-showcase", why: "Projects as curved cards on a turning spiral, with the brand and nav on top: the portfolio's first screen is the portfolio." },
      { title: "Calls to action", component: "liquid-glass-button", why: "Glass capsules that bend the warm glow behind them: book a call, download the deck." },
      { title: "Interlude", component: "glass-torus", why: "A glass ring turning in front of two huge words, a pause between the work and the words about it." },
      { title: "Kind words", component: "murmur-rows", why: "Named clients in two rows drifting past each other, with a pause control." },
      { title: "Contact", component: "field-cta", why: "The last screen is one invitation on a living field of warm plumes." },
    ],
    bg: "#010307",
  },
  {
    slug: "studio",
    name: "The Brutalist Studio",
    line: "A studio site in the brutalist tradition: raw grid, 2px rules, one signal colour, and nothing that can't justify itself.",
    for: "Design and engineering studios, agencies and collectives who want a site with a stance, and still want it to be easy to use.",
    scenario: "A site for an eleven-person design and engineering studio in Muscat: who they are in one line, what they do, three projects, who they've worked for, and four steps to start a project.",
    changeFirst: [
      "Set your studio's name in the hero and the bar, and the four facts under them: practice, city, year, when you're booking.",
      "Rewrite the six service tiles from what you actually sell, with one real number in the big tile.",
      "Replace the three dithered projects with your own, each with what you did and the year.",
      "Rewrite the four start-a-project steps from how you really take on work.",
    ],
    skills: [
      { slug: "art-director", why: "Brutalism is a set of decisions, not a look; this keeps every rule, number and colour on purpose." },
      { slug: "accessibility-pass", why: "Raw doesn't mean hostile: contrast, focus rings and readable body text are checked, not assumed." },
      { slug: "design-system-consistency", why: "Seven components from different families have to share one grid, one ink and one signal colour." },
      { slug: "responsive-audit", why: "Giant type and a hairline grid are where narrow screens break first." },
      { slug: "conversion-ux-review", why: "The page exists to start projects; the four steps should make that easier, not more ceremonial." },
    ],
    direction: [
      "One ground (#ecebe6), one ink (#0a0a0a), one signal colour (#ff4d00). No gradients, no shadows except hard offsets, no radii except one deliberate round button.",
      "Archivo at its extremes for display (900 weight, 125% width) and JetBrains Mono for every label, number and index. Body text stays at a readable size and weight.",
      "Structure is visible: 2px rules divide every section, numbers index every heading ([01] Services), and the grid is the decoration.",
      "The signal colour does one job at a time: the highlighted word, the tape, the step numbers, the newsletter strip.",
      "Every component is restyled through its own tokens to the same three colours; the only overrides beyond tokens are square corners and the display face.",
    ],
    sections: [
      { title: "Statement and actions", component: "crossed-tapes", why: "Two tapes crossed like a cordon, then the studio's offer, its next start date and two actions: brutal, but it still tells you what to do." },
      { title: "Header action", component: "corner-cut-button", why: "A chamfered, instrument-panel button: the one call to action in the bar." },
      { title: "Services", component: "mono-bento", why: "Six services on a numbered black-and-white hairline grid, each with a small working figure instead of an icon." },
      { title: "Work", component: "dither-card", why: "Projects as one-bit prints that resolve into the picture on hover." },
      { title: "Clients", component: "marquee-outline-text", why: "Client names as two rows of huge type sliding past each other, alternating outline and solid." },
      { title: "Start a project", component: "quickstart-checklist", why: "Four hard-edged numbered steps the visitor ticks off, from brief to start date." },
      { title: "Studio notes", component: "bell-subscribe-button", why: "A chunky subscribe pill with a hard shadow: the one round shape on the page, on purpose." },
      { title: "Colophon", component: "colophon-footer", why: "The small print as a colophon: typefaces, where it was made, when it changed, and that nothing tracks you." },
    ],
    guidance: [
      {
        title: "Brutalism without hostility",
        points: [
          "Keep body text at 16px or larger with real line height; only display type gets extreme.",
          "Every control keeps a visible focus ring in the signal colour, at least 3px.",
          "Check the signal colour as a background, never as small text: black on #ff4d00 passes, #ff4d00 on paper does not.",
          "Raw structure still needs hierarchy: number the sections, keep one primary action per screen.",
          "Moving type (the tapes, the client marquee) must stop under reduced motion and never sit behind text you need to read.",
        ],
      },
    ],
    bg: "#ecebe6",
  },
  {
    slug: "launch",
    name: "The Launch",
    line: "A pre-launch page for a SaaS product: a waitlist that prints your ticket, the product working, launch pricing and answers.",
    for: "Teams launching a developer tool or SaaS product who want the waitlist itself to feel like part of the product.",
    scenario: "A pre-launch page for a deploy-preview platform in private beta: join the waitlist and see your place in line, see what works today, lock in launch pricing, ask questions, and know when the next wave opens.",
    changeFirst: [
      "Connect the waitlist to your real list, with your real queue size and how many you let in each week.",
      "Rebuild the bento tiles from features that genuinely work in your beta, using your own product screens.",
      "Set the three plans, credit units and launch-pricing promise to what you will honour.",
      "Rewrite the chat FAQ from questions people have actually asked you about the beta.",
    ],
    skills: [
      { slug: "landing-page-art-director", why: "One hero idea (your place in line) and a proof sequence, instead of a stack of blocks." },
      { slug: "conversion-ux-review", why: "The page has one job, joining the waitlist; every section should lead back to it." },
      { slug: "template-tells", why: "SaaS launch pages are where generic patterns gather; this finds them." },
      { slug: "responsive-audit", why: "The ticket, the bento and the pricing cards each recompose at 375px." },
      { slug: "accessibility-pass", why: "The waitlist form, the period switch and the chat FAQ must work by keyboard and announce results." },
    ],
    direction: [
      "Cool night (#07080b) with blue as the only accent (#4f8cff, lighter #8fb4ff for text). The pricing section's dome is the only bright moment below the fold.",
      "Bricolage Grotesque for every heading, tight and confident; Geist for reading; Geist Mono for small labels.",
      "Honest about being early: everything in the bento works today, the pricing says it's kept for waitlist teams, and the closing call names the date of the next wave.",
      "Ring Flood buttons for the main action at the top; the waitlist button inside the hero is the primary one.",
      "Six components share one palette through their tokens; content inside components is checked so nothing names another product.",
    ],
    sections: [
      { title: "Bar action", component: "ring-flood-button", why: "A gradient ring that floods the button on hover: the waitlist action, always in view at the top." },
      { title: "Hero", component: "waitlist-hero", why: "Join with your email and a ticket prints with your place in line, the estimated wait and a link that moves you up." },
      { title: "What works today", component: "bento-grid", why: "Tiles of working interface (live traffic, a command palette, presence, settings, regions) instead of feature icons." },
      { title: "Launch pricing", component: "credit-tier-pricing", why: "Three plans in black glass with a month/year switch and the cost per 100 credits, so the value is comparable." },
      { title: "Questions", component: "chat-thread-faq", why: "An FAQ you ask: each answer suggests the next question, and a person is one tap away." },
      { title: "The ask", component: "ticker-ring-cta", why: "The closing call with the next wave's date, seats per wave and the queue running round its border." },
    ],
    bg: "#07080b",
  },
  {
    slug: "console",
    name: "The Console",
    line: "An operations dashboard: live numbers, a month of errors with their causes, today's latency, activity, deployments and ⌘K.",
    for: "Teams building an internal dashboard, admin panel or the overview page of a developer product.",
    scenario: "The overview page of a deployment platform: key numbers, thirty days of error rate with the deploys and incidents that moved it, today's latency for one API, the day's activity, recent deployments, and a command palette.",
    changeFirst: [
      "Wire the key numbers to your real metrics, with units and time ranges.",
      "Feed the timeline your real deploys, incidents and flag changes, written the way your team would explain them.",
      "Point the latency heatmap at one real endpoint and set its target to your SLO.",
      "Fill the command palette with the actions your users actually repeat, with their real shortcuts.",
    ],
    skills: [
      { slug: "responsive-art-direction", why: "A dashboard has to become a single-column workspace on phones, with the sidebar as a menu." },
      { slug: "design-system-consistency", why: "Dashboards collect one-off cards and badges; this keeps them to one system." },
      { slug: "interface-copy", why: "Incident notes, empty states and command names are the dashboard's real content." },
      { slug: "responsive-audit", why: "Charts and tables are the usual sources of horizontal overflow." },
      { slug: "accessibility-pass", why: "Charts need text alternatives, tables keyboard access, and the palette focus handling." },
    ],
    direction: [
      "Near-black (#09090b) with raised panels and hairline rings; colour is for status only: green ready, amber building, red failed, blue for deploys on the timeline.",
      "Every chart answers a question: the timeline says why the error rate moved, the heatmap shows the whole distribution rather than one average.",
      "Numbers change in place and say how they changed; nothing blinks, nothing pulses for attention.",
      "⌘K is the fastest way to do anything; the button in the header teaches the shortcut.",
      "Geist for the interface, Geist Mono for numbers and keys.",
    ],
    sections: [
      { title: "Navigation", component: "workspace-sidebar", why: "One indicator slides between rows, stepping inward for nested items, so where you are is always drawn." },
      { title: "Key numbers", component: "metric-morph", why: "Only the digits that changed turn over, coloured by whether the change is good; error rate and latency are inverted." },
      { title: "Error rate, with causes", component: "annotated-timeline", why: "Thirty days of error rate with deploys, incidents and flags pinned underneath; selecting one shades its effect." },
      { title: "Latency", component: "latency-heatmap", why: "Every request of the day by time and duration, with p50, p95, p99 and the target drawn across." },
      { title: "Activity", component: "activity-stream", why: "Time has weight: gaps grow with the time between events, and repeated actions fold into one line." },
      { title: "Deployments", component: "focus-table", why: "Sortable, keyboard-navigable, with the rows around the focused one receding; compact records on narrow screens." },
      { title: "Commands", component: "shortcut-palette", why: "⌘K opens a palette that runs the command and teaches its shortcut for next time." },
    ],
    bg: "#09090b",
  },
  {
    slug: "docs",
    name: "The Docs",
    line: "Documentation for a developer tool: install to first command fast, then a reference people come back to.",
    for: "Teams documenting a CLI, SDK or API who want docs that teach first and stay useful as a reference.",
    scenario: "Docs for a CLI that syncs local folders to cloud storage: get someone from install to a working first sync in two minutes, explain how syncing decides what to send, and list every flag.",
    changeFirst: [
      "Replace the install tabs with your real package managers and the exact commands, including how CI signs in.",
      "Rebuild the sidebar from your real page tree, in the order a new user needs the pages, not the order you built the features.",
      "Write the concept page at three depths from your actual design, and define the terms people trip on.",
      "Make the reference match the binary: every flag, its default and what it does, generated from the CLI's own help if you can.",
    ],
    skills: [
      { slug: "content-structure-auditor", why: "Docs fail on order: install, first success, concepts, then reference, in the order questions are asked." },
      { slug: "interface-copy", why: "Commands, flags, warnings and error output are copy too; this keeps them exact and consistent." },
      { slug: "responsive-art-direction", why: "The sidebar becomes the navbar's menu on phones; this designs that hand-off rather than squeezing the rail." },
      { slug: "search-optimization", why: "⌘K search is how returning readers navigate; its results should match what they type." },
      { slug: "responsive-audit", why: "Code blocks and option tables are where docs scroll sideways on a phone." },
      { slug: "accessibility-pass", why: "The sidebar, breadcrumb menus, install tabs, definitions and search all need to work by keyboard." },
    ],
    direction: [
      "Cool and quiet: near-black (#0f1013) with raised panels (#15171b), cool grey text and one blue accent (#8fb5ff) for where you are and what you can press.",
      "Geist for everything you read, Geist Mono for everything you type. Code is copyable and shows real output, not just the command.",
      "Every component shares one palette through its own colour tokens; the sidebar's night values are the reference. The one override beyond tokens: the phone menu's display serif becomes the docs' sans.",
      "Desktop is two columns, sidebar and article. On phones the sidebar goes away and the navbar's menu names the chapter you're in.",
      "Real commands, real flags, real output. A reader should be able to copy the first-sync block and have it work.",
    ],
    sections: [
      { title: "Docs sidebar", component: "chapter-rail", why: "Pages grouped into chapters, each filling as you read it, with a filter on / : the spine of the docs and how far through you are." },
      { title: "Phone navigation", component: "docket-nav", why: "On phones the sidebar gives way to a bar whose Menu names the chapter in view and opens into a numbered list of chapters." },
      { title: "Where you are", component: "pleat-crumbs", why: "Product, version and section; each level unfolds its siblings in place, so switching version is one move." },
      { title: "Search", component: "shortcut-palette", why: "⌘K searches every page by title and chapter, and jumps there." },
      { title: "Install", component: "install-snippet", why: "Tabs per package manager, numbered steps and a copy button on every block: install and sign-in in one place." },
      { title: "Concept page", component: "stretchtext", why: "One explanation at three depths. Beginners read the gist, people debugging read the full mechanism, from the same page." },
      { title: "Definitions", component: "gloss-term", why: "Terms like checksum and manifest open a short definition in place, so the sentence keeps going." },
      { title: "Warnings", component: "alert-callout", why: "The one destructive flag gets a warning beside its reference, with what to do first." },
    ],
    guidance: [
      {
        title: "What to leave out",
        points: [
          "No second table of contents. The sidebar already marks the section you're reading; an 'On this page' column of the same headings is the same information twice.",
          "No hero, no illustrations in the reading column. The first thing on the page is what the tool does, then the install command.",
          "Use Stretchtext for concepts only. Reference pages should be flat: every option visible, nothing to expand.",
          "One warning per page at most; if everything is a callout, nothing is.",
        ],
      },
    ],
    bg: "#0f1013",
  },
  {
    slug: "auth-flow",
    name: "The Auth Flow",
    line: "Welcome back, sign in, reset, sign up and verify, built as one product's flow rather than five borrowed screens.",
    for: "Teams building the account screens for a product, who want every step to look and sound like the same company.",
    scenario: "The account flow for a team product, async stand-ups for remote teams: choose a saved account, sign in with a provider or email, reset a forgotten password, create an account with a handle teammates can @mention, and confirm a one-time code.",
    changeFirst: [
      "Wire the providers to your real OAuth apps and the email path to your auth backend; keep only the providers your users actually have.",
      "Decide what the account chooser remembers on a shared computer, and how someone removes themselves from it.",
      "Set the handle rules to yours: length, allowed characters, reserved names, and what the availability check calls.",
      "Match the reset link's expiry, the code length and the resend cooldown to your provider, and say them on screen.",
    ],
    skills: [
      { slug: "component-adaptation", why: "Five components from different sets have to share one palette, wordmark, typeface and voice; this is the recipe's main job." },
      { slug: "interface-copy", why: "Auth is mostly error, empty and expired states; each needs a plain sentence and a next step." },
      { slug: "conversion-ux-review", why: "Every extra field or step in sign-up costs accounts; this checks what can wait until later." },
      { slug: "responsive-audit", why: "The split sign-in stacks on phones and the code cells must fit 375px without shrinking below a thumb." },
      { slug: "accessibility-pass", why: "Labels, announced errors, focus moved to each new step, and a code input that takes paste and the keyboard." },
    ],
    direction: [
      "Light and calm: warm paper (#f4f2ec), white cards and deep green ink (#14201d), which also fills every primary button; one brand green (#0e6b5e) for focus, success and the wordmark's dot.",
      "One typeface (Geist) across all five screens, set on each component's root, and the same tight lowercase wordmark on each.",
      "Returning people first: the flow opens on the saved accounts, because most visits to an account screen are someone coming back.",
      "Each component is themed through its own colour tokens, never by editing its internals; where a component hard-codes a colour (Handle Sign-up's glow), override that one property and note it.",
      "Brand strings are props, not copy to edit: Envelope Reset takes product and exampleEmail, Code Cascade Verify and Account Chooser take product. Choose components whose fixed copy fits the product.",
    ],
    sections: [
      { title: "Welcome back", component: "account-chooser", why: "Saved accounts with when each was last used, so a returning person is one tap from their workspace." },
      { title: "Sign in", component: "mono-sign-in", why: "Providers first with the last one used marked, then email; the password field opens only once the email checks out." },
      { title: "Forgot password", component: "envelope-reset", why: "The reset you can watch leave: the form folds into an envelope, so people trust the email is on its way." },
      { title: "Create account", component: "handle-sign-up", why: "Three short steps with live handle availability and free alternatives, so the hardest choice in sign-up takes seconds." },
      { title: "Verify", component: "code-cascade-verify", why: "Paste-friendly code cells with a clear wrong state and a resend button that shows its own countdown." },
    ],
    guidance: [
      {
        title: "Making five components one product",
        points: [
          "Pick one theme (paper or night) for every screen before adjusting anything, then set each component's tokens to the same few values: page, card, ink, muted, line, accent, success, error.",
          "Check the parts tokens don't reach: hard-coded glows, shadows and fonts. Override those as single properties from your own stylesheet, scoped to the component's root class.",
          "Read every component's fixed text aloud in your product's voice. If a line doesn't fit, choose a different component rather than patching its internals.",
          "The links between screens are plain hrefs; point them at your real routes and test the whole loop, not each screen alone.",
        ],
      },
    ],
    bg: "#f4f2ec",
  },
  {
    slug: "ai-workspace",
    name: "The AI Workspace",
    line: "A dark AI chat app that works: your conversations in the sidebar, a fresh chat one click away, answers that stream in.",
    for: "Teams building an assistant, a research tool or an internal AI product.",
    scenario: "An internal assistant for a small company: past conversations grouped by when they happened, New chat that opens a clean greeting, replies that stream in, and every conversation there to reopen with its history.",
    changeFirst: [
      "Replace the simulated replies with your model's streaming API, including stop, retry and error states.",
      "Set the models in the bar to the ones you actually offer, with honest one-line descriptions, or remove the menu if there's only one.",
      "Store conversations for real: titles from the first message, renames, and history that survives a reload.",
      "Rewrite the greeting and placeholder in your product's voice.",
    ],
    skills: [
      { slug: "interface-copy", why: "Empty, streaming, stopped and error states are most of an AI interface's text." },
      { slug: "component-adaptation", why: "The sidebar and the chat come from different sets and must read as one dark product." },
      { slug: "conversion-ux-review", why: "The first message is the whole onboarding; nothing should stand between New chat and typing." },
      { slug: "responsive-audit", why: "On phones the sidebar goes and New chat moves to the header; check the bar fits at 375px." },
      { slug: "accessibility-pass", why: "Streaming replies are announced through a live log, menus work by keyboard, and focus returns to the field." },
    ],
    direction: [
      "Dark throughout: the chat's own night (#0e0f14) with a deep blue glow that breathes slowly behind the conversation, and a darker sidebar (#0a0b0f) set to match through its tokens.",
      "The conversation is the interface. The header holds only the chat's title; the model choice lives in the bar, where you use it, not in a corner.",
      "New chat really starts one: a clean greeting, and the chat appears at the top of Today the moment you send, titled from your first words.",
      "Every conversation reopens with its history, in the same component, so past and present chats look the same.",
      "Geist throughout, one blue accent (#8ab4f8) for focus, the active chat and the assistant's mark.",
    ],
    sections: [
      { title: "Conversations", component: "conversation-sidebar", why: "History grouped by time, search and inline rename; its New chat and selection are wired to the app, and collapsing keeps titles as initials." },
      { title: "The chat", component: "ask-bar", why: "A greeting for a new chat, a bar that grows as you write, files, voice and model in one place, and replies that stream in word by word." },
    ],
    bg: "#0e0f14",
  },
  {
    slug: "ai-company",
    name: "The AI Company",
    line: "A company website for an AI product: one light source, the product working on screen, public numbers, a clear price and one confident ask.",
    for: "AI labs, AI product companies and developer-tool startups that need to look credible to engineers and buyers at the same time.",
    scenario: "A company site for AI agents that draft support replies: a calm hero, an agent working a real ticket, what it does on every ticket, thirty days of public numbers, seat pricing and plain answers on security and data.",
    changeFirst: [
      "Replace the agent run with your product's real flow: your own task, steps and output.",
      "Publish numbers you measure and can stand behind, with the month they're from.",
      "Put your real plans, seat prices and what each includes into the pricing cards.",
      "Answer your real security, data-retention and model questions in the FAQ.",
    ],
    skills: [
      { slug: "landing-page-art-director", why: "Puts the product working near the top and gives every section one job." },
      { slug: "template-tells", why: "AI company sites are among the most templated on the web; this finds the defaults." },
      { slug: "copy-quality", why: "Claims about AI need to be specific and true." },
      { slug: "performance-pass", why: "A WebGL dawn and a live demo share the first two screens." },
      { slug: "responsive-audit", why: "The agent demo, the tiles and the pricing cards need to work at phone width." },
      { slug: "accessibility-pass", why: "The running demo must be pausable and its steps announced; the sparklines must work by keyboard." },
    ],
    direction: [
      "One light source: a violet dawn rising behind the hero (#05031a night, #7239ea glow, #ee9cf6 fringe). Everything below is near-black and quiet.",
      "Instrument Sans for everything, tight at display sizes, with Instrument Serif italics for the one or two words that carry a claim.",
      "Show, don't claim: the agent works a real ticket on screen before any adjective about it, and the numbers are public and scrubbable.",
      "Buttons with character, used sparingly: a prism-rim pill for the main action, phosphor-glass text links for the quiet ones.",
      "Never name a model or a lab you don't use. Components that print a third-party model name are left out.",
    ],
    sections: [
      { title: "Hero", component: "orbit-dawn", why: "A ringed light rising over a dark horizon, with the nav and headline set inside it; the page's only bright surface." },
      { title: "Main action", component: "prism-rim-button", why: "A dark pill held in a hairline of graded colour, for the one action that matters." },
      { title: "Quiet actions", component: "phosphor-glass-button", why: "Text links whose light turns toward the pointer: sign in, watch it work." },
      { title: "The product, working", component: "agent-run", why: "The hero's promise proven immediately: the agent plans, searches, reads, drafts and checks, then waits for a person." },
      { title: "What it does", component: "signal-tiles", why: "Ten capabilities as quiet tiles that switch on as you point at them." },
      { title: "Proof", component: "scrub-sparkline-stats", why: "Thirty days of public numbers you can scrub through, with which direction is good news for each." },
      { title: "Pricing", component: "glow-base-pricing", why: "Three plans whose bases glow in their own colour, with a monthly and yearly switch." },
      { title: "Questions", component: "focus-faq", why: "Security, data and model questions answered plainly, one at a time." },
      { title: "The ask", component: "ring-flood-cta", why: "A closing banner framed by the page's own colours; pointing at the action floods it." },
    ],
    guidance: [
      {
        title: "Choose by product and audience",
        points: [
          "Developer tool or API: lead with agent-run, inline-diff or a terminal-like demo; mono labels and real code; pricing by usage (usage-ruler or credit-tier-pricing).",
          "Assistant or chat product: lead with cited-answer, ask-bar or thinking-mark; a paper palette reads warmer than black.",
          "Research lab or model company: a typographic hero and long-form writing; numbers and charts (scrub-sparkline-stats, model-bench) over feature grids.",
          "Enterprise buyers: put security, data handling and SSO in the FAQ and footer, and keep pricing honest (subtractive-pricing shows exactly what each plan leaves out).",
        ],
      },
      {
        title: "Curation: one of each, on purpose",
        points: [
          "One hero treatment: a background or a typographic hero, never both competing.",
          "One navigation system for the whole site, and one primary button style repeated everywhere.",
          "One AI interaction component on the home page; others belong on product pages.",
          "Check every component's fixed text: a demo that names a model, a lab or a customer you don't have is a claim you're making.",
          "If two components are both 'the impressive one', cut one. Restraint is what makes the remaining one feel expensive.",
        ],
      },
      {
        title: "Backgrounds: where they help and where they hurt",
        points: [
          "Ambient backgrounds belong behind the hero or the final call to action: moments with little text and one message.",
          "Never put moving backgrounds behind paragraphs, pricing, forms or tables. Reading and motion compete, and contrast becomes unpredictable.",
          "Check contrast at the background's brightest frame, and keep buttons off the brightest part. If body text drops below 4.5:1, move it or add a scrim; don't lighten the text.",
          "Avoid fatigue: one ambient surface per page, slow, low contrast. Every Vitrine background pauses offscreen and in hidden tabs.",
          "Reduced motion: every Vitrine background renders a designed still frame; check that it still looks intentional.",
          "Performance: WebGL and canvas backgrounds cost GPU time and battery. Load one per page and confirm with /performance-pass on a throttled phone.",
        ],
      },
    ],
    bg: "#05031a",
  },
];

export const getRecipe = (slug: string) => RECIPES.find((r) => r.slug === slug);
export const recipesUsing = (component: string) => RECIPES.filter((r) => r.sections.some((s) => s.component === component));

const SITE = site.url;

/** A recipe's skills, resolved. Throws at build time if a recipe names a skill that doesn't exist. */
export function recipeSkills(r: Recipe) {
  return r.skills.map((k) => {
    const skill = getSkill(k.slug);
    if (!skill) throw new Error(`Recipe "${r.slug}" uses unknown skill "${k.slug}"`);
    return { ...k, skill };
  });
}

/** The copyable build brief. Throws at build time if a recipe names a component or skill that doesn't exist. */
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
    `Scenario: ${r.scenario}`,
    "",
    "## Direction",
    ...r.direction.map((d) => `- ${d}`),
    "",
    ...(r.guidance ? r.guidance.flatMap((g) => ["", `## ${g.title}`, ...g.points.map((p) => `- ${p}`)]) : []),
    "",
    "## Page map",
    ...parts.map((p, i) => `${i + 1}. ${p.title}: ${p.meta.name}. ${p.why}`),
    "",
    "## Change first",
    ...r.changeFirst.map((c) => `- ${c}`),
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
    ...recipeSkills(r).map((k) => `- Run \`/${k.slug}\` (${SITE}/workshop/skills/${k.slug}): ${k.why}`),
    "",
  ].join("\n");
}
