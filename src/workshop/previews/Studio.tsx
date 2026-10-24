"use client";

import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import { CrossedTapes, type TapePalette } from "@/registry/sections/crossed-tapes/CrossedTapes";
import { MonoBento, type MonoTile } from "@/registry/cards/mono-bento/MonoBento";
import { Numeral, Shortcut, Specimen, Ticker, Toggle, Uptime } from "@/registry/cards/mono-bento/tiles";
import { DitherCard } from "@/registry/cards/dither-card/DitherCard";
import { MarqueeOutlineText } from "@/registry/text/marquee-outline-text/MarqueeOutlineText";
import { QuickstartChecklist } from "@/registry/sections/quickstart-checklist/QuickstartChecklist";
import { BellSubscribeButton } from "@/registry/buttons/bell-subscribe-button/BellSubscribeButton";
import { CornerCutButton } from "@/registry/buttons/corner-cut-button/CornerCutButton";
import { ColophonFooter } from "@/registry/footers/colophon-footer/ColophonFooter";

/*
 * Brutalism, kept usable: one ground, one ink, one signal colour; 2px rules instead of shadows; no radii;
 * Archivo pushed to its widest and heaviest for display, a mono for every label. Body text stays readable
 * and every control keeps a visible focus. Components take the palette through their tokens.
 */
const INK = "#0a0a0a", GROUND = "#ecebe6", SIGNAL = "#ff4d00", MUTED = "#4a4944";

const TOKENS = `
.bru { --bru-ink: ${INK}; --bru-ground: ${GROUND}; --bru-signal: ${SIGNAL}; --bru-muted: ${MUTED}; font-family: Archivo, ui-sans-serif, system-ui, sans-serif; }
.bru :is(a, button, input, textarea):focus-visible { outline: 3px solid var(--bru-signal); outline-offset: 2px; }
.bru .mono { font-family: "JetBrains Mono", ui-monospace, monospace; }
.bru .wide { font-stretch: 125%; }
.bru .mbento { --mb-ground: ${GROUND}; --mb-ink: ${INK}; --mb-muted: ${MUTED}; --mb-line: ${INK}; font-family: Archivo, sans-serif; }
.bru .dc { --dc-bg: ${GROUND}; --dc-ink: ${INK}; --dc-muted: ${MUTED}; --dc-line: ${INK}; border-radius: 0; font-family: Archivo, sans-serif; }
.bru .dc__title { font-family: Archivo, sans-serif; font-weight: 800; font-stretch: 112%; text-transform: uppercase; font-size: 1.375rem; letter-spacing: -0.01em; }
.bru .qstart { --qs-page: ${GROUND}; --qs-paper: #f7f6f2; --qs-ink: ${INK}; --qs-muted: ${MUTED}; --qs-faint: #8a8880; --qs-line: ${INK}; --qs-shadow: ${INK}; --qs-yellow: ${SIGNAL}; --qs-sky: ${SIGNAL}; --qs-teal: ${INK}; --qs-done-bg: #e0ded6; font-family: Archivo, sans-serif; }
.bru .motx { --motx-page: ${GROUND}; --motx-ink: ${INK}; --motx-accent: ${SIGNAL}; --motx-stroke: 1.5px; font-family: Archivo, sans-serif; font-stretch: 125%; }
.bru .ccut { --ccut-ink: ${INK}; --ccut-paper: ${GROUND}; --ccut-line: ${INK}; --ccut-accent: ${SIGNAL}; --ccut-accent-ink: ${INK}; --ccut-focus: ${SIGNAL}; --ccut-wash: rgb(255 77 0 / 0.12); }
.bru .ctape { font-family: Archivo, sans-serif; }
.bru .ctape__title { font-stretch: 112%; }
.bru .ctape__card { border-radius: 0; box-shadow: 8px 8px 0 ${INK}; }
.bru .ctape__btn { border-radius: 0; }
.bru .colophon-footer { --cf-ink: ${INK}; --cf-muted: ${MUTED}; --cf-line: ${INK}; font-family: Archivo, sans-serif; }
.bru .colophon-footer__row dd { font-family: Archivo, sans-serif; font-weight: 600; font-size: 1rem; }
`;

const TAPES: TapePalette = { ground: GROUND, ink: INK, muted: MUTED, line: "rgba(10, 10, 10, 0.2)", a: SIGNAL, aInk: INK, b: INK, bInk: GROUND };

const series = [2, 3, 3, 4, 6, 5, 7, 6, 8, 9, 8, 11, 10, 12, 14, 13, 15, 17];
const SERVICES: MonoTile[] = [
  { id: "audit", title: "Accessibility audits", body: "Every screen checked by keyboard, screen reader and a phone at arm's length.", visual: <Numeral value={312} caption="Issues fixed for clients in 2026" series={series} />, span: { lg: [2, 2], md: [2, 2], sm: [1, 2] } },
  { id: "eng", title: "Engineering", body: "Web and mobile, shipped and looked after.", visual: <Ticker lines={[{ tag: "v3.2", text: "Masar: offline itineraries" }, { tag: "v2.8", text: "Wally: shared budgets" }, { tag: "v1.4", text: "Qalam: right-to-left editor" }]} />, span: { lg: [2, 1], md: [2, 1] } },
  { id: "product", title: "Product design", visual: <Specimen glyphs="Aa" weights={[400, 600, 800, 900]} /> },
  { id: "keys", title: "Keyboard first", visual: <Shortcut keys={["⌘", "K"]} /> },
  { id: "systems", title: "Design systems", body: "One set of parts, documented, with the states people forget.", visual: <Toggle label="Reduced motion" initial />, span: { lg: [2, 1], md: [2, 1] } },
  { id: "care", title: "Looked after", body: "Twelve months of support on everything we ship.", visual: <Uptime />, span: { lg: [2, 1], md: [2, 1] } },
];

const WORK = [
  { title: "Masar", meta: "Trip planner for Oman. Research, product, iOS and web.", year: "2025", seed: 3 },
  { title: "Wally", meta: "Household wallet. Product design and a design system.", year: "2025", seed: 7 },
  { title: "Qalam", meta: "Arabic-first writing tool. Editor engineering.", year: "2024", seed: 11 },
];

function Head({ n, title, aside }: { n: string; title: string; aside?: ReactNode }) {
  return (
    <div className="grid grid-cols-[auto_1fr] items-end gap-x-4 border-b-2 border-[var(--bru-ink)] px-4 pb-3 pt-14 sm:grid-cols-[auto_1fr_auto] sm:px-6">
      <span className="mono text-[12px] font-medium">[{n}]</span>
      <h2 className="wide text-[clamp(2rem,6vw,4.5rem)] font-black uppercase leading-[0.85] tracking-[-0.03em]">{title}</h2>
      {aside && <div className="mono col-span-2 mt-3 text-[12px] uppercase text-[var(--bru-muted)] sm:col-span-1 sm:mt-0">{aside}</div>}
    </div>
  );
}

export default function Studio() {
  const scroller = useRef<HTMLDivElement>(null);
  const [note, setNote] = useState("");
  const jump = (id: string) => scroller.current?.querySelector(`#${id}`)?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });

  return (
    <div ref={scroller} className="bru h-full w-full overflow-y-auto bg-[var(--bru-ground)] text-[var(--bru-ink)]">
      <style>{TOKENS}</style>

      <header className="sticky top-0 z-20 flex items-stretch border-b-2 border-[var(--bru-ink)] bg-[var(--bru-ground)]">
        <a href="#top" onClick={(e) => { e.preventDefault(); jump("top"); }} className="wide flex items-center border-r-2 border-[var(--bru-ink)] px-4 text-[1.125rem] font-black uppercase tracking-[-0.02em] sm:px-6">
          Halden<sup className="mono ml-0.5 text-[9px] font-medium">®</sup>
        </a>
        <nav aria-label="Sections" className="mono hidden flex-1 items-stretch text-[12px] uppercase md:flex">
          {[["services", "Services"], ["work", "Work"], ["process", "Process"]].map(([id, label], i) => (
            <a key={id} href={`#${id}`} onClick={(e) => { e.preventDefault(); jump(id); }} className="flex items-center border-r-2 border-[var(--bru-ink)] px-5 transition-colors hover:bg-[var(--bru-ink)] hover:text-[var(--bru-ground)]">
              <span className="mr-2 text-[var(--bru-muted)]">0{i + 1}</span>
              {label}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex items-center px-3 py-2 sm:px-4">
          <CornerCutButton size="sm" cut="one" onClick={() => jump("process")}>
            Start a project
          </CornerCutButton>
        </div>
      </header>

      <section id="top" aria-labelledby="bru-h" className="border-b-2 border-[var(--bru-ink)]">
        <dl className="mono grid grid-cols-2 border-b-2 border-[var(--bru-ink)] text-[11px] uppercase sm:grid-cols-4">
          {[["Practice", "Design + engineering"], ["Based", "Muscat, Oman"], ["Since", "2017"], ["Booking", "March 2027"]].map(([k, v], i) => (
            <div key={k} className={`px-4 py-3 sm:px-6 ${i % 2 === 0 ? "border-r-2" : ""} ${i < 2 ? "border-b-2 sm:border-b-0" : ""} border-[var(--bru-ink)] sm:border-r-2 sm:last:border-r-0`}>
              <dt className="text-[var(--bru-muted)]">{k}</dt>
              <dd className="mt-1 font-medium">{v}</dd>
            </div>
          ))}
        </dl>
        <h1 id="bru-h" className="wide overflow-hidden px-3 pt-4 text-[clamp(3.5rem,17.5vw,16rem)] font-black uppercase leading-[0.8] tracking-[-0.045em] sm:px-5">
          Halden
        </h1>
        <div className="grid border-t-2 border-[var(--bru-ink)] md:grid-cols-[1.6fr_1fr]">
          <p className="px-4 py-8 text-[clamp(1.375rem,2.8vw,2.25rem)] font-semibold leading-[1.1] tracking-[-0.02em] sm:px-6 md:border-r-2 md:border-[var(--bru-ink)]">
            We build software for companies that would rather be <span className="bg-[var(--bru-signal)] px-1">useful</span> than impressive. Eleven people. No account managers.
          </p>
          <ol className="mono divide-y-2 divide-[var(--bru-ink)] border-t-2 border-[var(--bru-ink)] text-[12px] uppercase md:border-t-0">
            {["Product design", "Engineering", "Design systems", "Accessibility audits"].map((s, i) => (
              <li key={s} className="flex justify-between px-4 py-3 sm:px-6">
                <span>{s}</span>
                <span className="text-[var(--bru-muted)]">0{i + 1}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CrossedTapes
        palette={TAPES}
        stripes={false}
        words={["Booking 2027", "Design", "Engineering", "Two seats left"]}
        eyebrow="Now booking · 2027"
        title="Two product teams a year. One seat is still open."
        lead="We take on a small number of long projects so the people who start your work are the people who finish it."
        card={{ title: "Next start: March 2027", detail: "8–16 weeks · fixed quote" }}
        primary={{ label: "Start a project", href: "#process" }}
        secondary={{ label: "See the work", href: "#work" }}
        onNavigate={(href, e) => { e.preventDefault(); jump(href.slice(1)); }}
      />

      <section id="services" aria-label="Services" className="border-t-2 border-[var(--bru-ink)]">
        <Head n="01" title="Services" aside="From first sketch to year two" />
        <MonoBento theme="paper" tiles={SERVICES} onNavigate={(_, e) => e.preventDefault()} />
      </section>

      <section id="work" aria-label="Work" className="border-t-2 border-[var(--bru-ink)]">
        <Head n="02" title="Work" aside="Selected · 2024–2026" />
        <div className="grid gap-px bg-[var(--bru-ink)] sm:grid-cols-3">
          {WORK.map((w) => (
            <div key={w.title} className="bg-[var(--bru-ground)] p-4 sm:p-6">
              <DitherCard theme="paper" title={w.title} meta={w.meta} year={w.year} seed={w.seed} href="#work" />
            </div>
          ))}
        </div>
      </section>

      <section aria-label="Clients" className="border-y-2 border-[var(--bru-ink)] py-6">
        <p className="mono px-4 pb-4 text-[12px] uppercase sm:px-6">[03] Clients since 2017</p>
        <MarqueeOutlineText theme="light" words={["Masar", "Wally", "Qalam", "Relay", "Northwind", "Ledger", "Tidewater", "Murmur"]} />
      </section>

      <section id="process" aria-label="Process">
        <Head n="04" title="Start" aside="Four steps, about a week" />
        <div className="grid gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_1.4fr]">
          <p className="max-w-[34ch] text-[1.0625rem] leading-relaxed text-[var(--bru-muted)]">
            Tick them off as you go. Most projects go from first email to a fixed quote in five working days.
          </p>
          <QuickstartChecklist
            title="Start a project"
            theme="light"
            onComplete={() => setNote("All four done. We'll reply within a day.")}
            steps={[
              { id: "brief", title: "Send a short brief", body: <p>What you're making, who it's for and when it needs to exist. Half a page is plenty.</p>, action: { label: "Write the brief", onClick: () => setNote("Would open the brief form.") } },
              { id: "call", title: "Book a 30-minute call", body: <p>With the two people who would lead the work, not a salesperson.</p>, action: { label: "Pick a time", onClick: () => setNote("Would open the calendar.") } },
              { id: "quote", title: "Get a fixed quote", body: <p>Scope, weeks and price on one page, within three working days of the call.</p> },
              { id: "start", title: "Agree a start date", body: <p>We hold the date for two weeks while you decide.</p> },
            ]}
          />
        </div>
        <p className="mono px-4 pb-2 text-[12px] uppercase text-[var(--bru-muted)] sm:px-6" aria-live="polite">{note}</p>
      </section>

      <section aria-label="Studio notes" className="flex flex-wrap items-center justify-between gap-6 border-t-2 border-[var(--bru-ink)] bg-[var(--bru-signal)] px-4 py-10 text-[var(--bru-ink)] sm:px-6">
        <p className="wide max-w-[20ch] text-[clamp(1.5rem,3.5vw,2.5rem)] font-black uppercase leading-[0.95] tracking-[-0.02em]">Studio notes. Monthly. No fluff.</p>
        <BellSubscribeButton accent={GROUND} labels={{ off: "Subscribe", on: "Subscribed" }} style={{ "--bsub-ink": INK, "--bsub-face": GROUND } as CSSProperties} />
      </section>

      <div className="px-4 sm:px-6">
      <ColophonFooter
        theme="paper"
        scrollRef={scroller}
        rows={[
          { label: "Set in", value: "Archivo and JetBrains Mono" },
          { label: "Made in", value: "Muscat, on a 12-column grid" },
          { label: "Last updated", value: "24 October 2026" },
          { label: "Tracking", value: "None" },
        ]}
        legal="© 2026 Halden Studio"
        links={[{ label: "hello@halden.studio", href: "#email" }, { label: "Instagram", href: "#instagram" }]}
      />
      </div>
    </div>
  );
}
