"use client";

import { useRef } from "react";
import { WaitlistHero } from "@/registry/heroes/waitlist-hero/WaitlistHero";
import { BentoGrid, type BentoTile } from "@/registry/cards/bento-grid/BentoGrid";
import { CommandPalette, Globe, Presence, Settings, TrafficChart } from "@/registry/cards/bento-grid/tiles";
import { CreditTierPricing } from "@/registry/pricing/credit-tier-pricing/CreditTierPricing";
import { ChatThreadFaq, type Qa } from "@/registry/faq/chat-thread-faq/ChatThreadFaq";
import { TickerRingCta } from "@/registry/ctas/ticker-ring-cta/TickerRingCta";
import { RingFloodButton } from "@/registry/buttons/ring-flood-button/RingFloodButton";
import { PreviewFonts } from "./fonts";

/* One cool night palette across six components, set through their tokens; Bricolage Grotesque for every heading. */
const BG = "#07080b", INK = "#eef1f6", MUTED = "#8e95a3", ACCENT = "#4f8cff";
const TOKENS = `
.lch { font-family: Geist, ui-sans-serif, system-ui, sans-serif; }
.lch :is(h1, h2, .wlh__number) { font-family: "Bricolage Grotesque", Geist, sans-serif; font-weight: 600; letter-spacing: -0.035em; font-optical-sizing: auto; }
.lch .wlh { --wlh-bg: ${BG}; --wlh-ink: ${INK}; --wlh-muted: ${MUTED}; --wlh-line: rgb(238 241 246 / 0.12); --wlh-field: #10131a; --wlh-btn: ${INK}; --wlh-accent: #8fb4ff; }
.lch .wlh__headline em { font-style: normal; color: #8fb4ff; }
.lch .bento { --bento-ground: ${BG}; --bento-ink: ${INK}; }
.lch .ct--night { --ct-ink: ${INK}; }
.lch .trcta { --tr-page: ${BG}; --tr-ink: ${INK}; }
`;

const TILES: BentoTile[] = [
  { id: "traffic", title: "Every branch, live", body: "Each pull request becomes a link with real traffic numbers, in about 40 seconds.", visual: <TrafficChart />, span: { lg: [2, 2], md: [2, 2], sm: [1, 2] } },
  { id: "command", title: "One shortcut for everything", body: "Deploy, roll back, invite. Press ⌘K and type.", visual: <CommandPalette />, span: { lg: [2, 1], md: [2, 1] }, textFirst: true },
  { id: "presence", title: "Review together", body: "See who's looking at the preview with you.", visual: <Presence /> },
  { id: "settings", title: "Defaults that hold", visual: <Settings />, textFirst: true },
  { id: "globe", title: "32 regions on day one", visual: <Globe />, span: { lg: [4, 1], md: [2, 1] } },
];

const FAQ: Qa[] = [
  { id: "when", q: "When do I get in?", a: "We open a wave every Monday, about 250 teams at a time, in the order people joined. Your ticket shows your place and an estimate; it moves up when you share your link.", next: ["price", "import"] },
  { id: "price", q: "Will the price change after launch?", a: "Not for you. The plan you start on keeps its waitlist price for as long as you stay on it, even when the public price goes up.", next: ["free", "when"] },
  { id: "import", q: "Can I bring my existing projects?", a: "Yes. Connect GitHub or GitLab and pick the repositories; build settings are read from your framework, and anything we can't guess, we ask about once.", next: ["data"] },
  { id: "data", q: "Where does my code run?", a: "Builds run in isolated machines that are destroyed when the build ends. Source and logs stay in the region you choose; nothing is used to train anything.", next: ["price"] },
  { id: "free", q: "Is there a free plan?", a: "Previews for personal projects are free up to 300 build minutes a month. Teams start on Starter after a 14-day trial.", next: ["when"] },
];

export default function Launch() {
  const scroller = useRef<HTMLDivElement>(null);
  const toTop = () => scroller.current?.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });

  return (
    <div ref={scroller} className="lch relative h-full w-full overflow-y-auto" style={{ background: BG, color: INK }}>
      <PreviewFonts families={["Bricolage Grotesque:opsz,wght@12..96,400..700"]} />
      <style>{TOKENS}</style>

      <header className="absolute inset-x-0 top-0 z-20">
        <div className="mx-auto flex h-16 w-[min(72rem,calc(100%-2.5rem))] items-center justify-between">
          <span className="inline-flex items-center gap-2 text-[1rem] font-semibold tracking-[-0.02em]" style={{ fontFamily: '"Bricolage Grotesque", Geist, sans-serif' }}>
            <svg viewBox="0 0 20 20" className="size-5" aria-hidden="true">
              <path d="M10 1.5 12 8l6.5 2-6.5 2-2 6.5L8 12l-6.5-2L8 8Z" fill={ACCENT} />
            </svg>
            Northstar
          </span>
          <nav aria-label="Sections" className="hidden gap-7 text-[0.875rem] text-[#a9b0bd] sm:flex">
            <a href="#product" onClick={(e) => { e.preventDefault(); scroller.current?.querySelector("#product")?.scrollIntoView({ behavior: "smooth" }); }} className="hover:text-white">Product</a>
            <a href="#pricing" onClick={(e) => { e.preventDefault(); scroller.current?.querySelector("#pricing")?.scrollIntoView({ behavior: "smooth" }); }} className="hover:text-white">Pricing</a>
            <a href="#faq" onClick={(e) => { e.preventDefault(); scroller.current?.querySelector("#faq")?.scrollIntoView({ behavior: "smooth" }); }} className="hover:text-white">Questions</a>
          </nav>
          <RingFloodButton theme="night" onClick={toTop}>
            Join the waitlist
          </RingFloodButton>
        </div>
      </header>

      <div className="min-h-[100vh] pt-16">
        <WaitlistHero
          theme="night"
          eyebrow="Northstar · private beta"
          headline={<>A live preview for every branch, <em>without the YAML</em>.</>}
          sub="Northstar builds each pull request into a link your team can open, in about forty seconds. We let teams in every Monday, in the order they joined."
          ahead={2140}
          perWeek={250}
          shareBase="https://northstar.example/beta"
        />
      </div>

      <section id="product" className="scroll-mt-4">
        <BentoGrid
          theme="night"
          eyebrow="What you get on day one"
          title="Previews, deploys and rollbacks in one place."
          lede="Everything below is working in the beta today. Nothing on this page is a roadmap."
          tiles={TILES}
          onNavigate={(_, e) => e.preventDefault()}
        />
      </section>

      <section id="pricing" className="scroll-mt-4">
        <CreditTierPricing
          accent={ACCENT}
          badge="Launch pricing · kept for waitlist teams"
          title={["Pay for builds,", "not for seats."]}
          tiers={[
            { id: "starter", name: "Starter", tagline: "One product, a small team", monthly: 12, credits: 1000 },
            { id: "team", name: "Team", tagline: "Several apps, daily previews", monthly: 39, credits: 5000, featured: true },
            { id: "scale", name: "Scale", tagline: "Monorepos and busy CI", monthly: 119, credits: 20000 },
          ]}
          features={[
            { label: "One credit is one build minute", info: "Unused credits roll over for one month." },
            { label: "A preview link for every branch" },
            { label: "Unlimited teammates", accent: true },
            { label: "Instant rollbacks", info: "Any of your last 50 deploys, in one click." },
            { label: "32 regions" },
            { label: "Audit log and SSO on Team and Scale" },
          ]}
          trial="14-day trial when your wave opens"
          cta="Join the waitlist"
          currency="$"
          onChoose={toTop}
        />
      </section>

      <section id="faq" aria-labelledby="lch-faq" className="scroll-mt-4 px-4 py-24 sm:py-28">
        <div className="mx-auto grid w-full max-w-[64rem] items-start gap-10 md:grid-cols-[1fr_1.15fr]">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#8e95a3]">Questions</p>
            <h2 id="lch-faq" className="mt-3 text-[clamp(2rem,4.2vw,3rem)] leading-[1.02]">
              Ask it the way you&rsquo;d ask us.
            </h2>
            <p className="mt-4 max-w-[36ch] text-[0.9375rem] leading-relaxed text-[#8e95a3]">Pick a question and the answer suggests what people usually ask next. A person is one tap away.</p>
          </div>
          <ChatThreadFaq
            theme="night"
            items={FAQ}
            agent={{ name: "Northstar", role: "Usually answers instantly" }}
            greeting="Hi! What would you like to know about the beta?"
            human={{ label: "Talk to a person", reply: "I've passed this to Aisha on the launch team. She's online and replies here, usually within a few minutes." }}
          />
        </div>
      </section>

      <TickerRingCta
        theme="night"
        eyebrow="Wave 14 opens Monday"
        headline="Get your team on the next wave."
        sub="Join with your work email and you'll see your place in line straight away."
        action="Join the waitlist"
        href="#top"
        secondary={{ label: "Read the changelog", href: "#changelog" }}
        ticker={["Wave 14 · Monday 09:00 GMT", "250 teams per wave", "2,140 waiting", "Launch pricing kept", "No card needed"]}
      />

      <footer className="border-t border-white/[0.07]">
        <div className="mx-auto flex w-[min(72rem,calc(100%-2.5rem))] flex-wrap justify-between gap-3 py-8 font-mono text-[11px] uppercase tracking-[0.14em] text-[#8e95a3]">
          <span>© 2026 Northstar Labs</span>
          <span>Status · Changelog · Security</span>
        </div>
      </footer>
    </div>
  );
}
