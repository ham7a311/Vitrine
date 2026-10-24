"use client";

import { useRef, useState, type ReactNode } from "react";
import { ThemeStage, ThemeSwitch, type Theme } from "@/registry/controls/theme-shift/ThemeShift";
import { LetterformHero, type LetterformProject } from "@/registry/heroes/letterform-hero/LetterformHero";
import { HoverReel, type ReelProject } from "@/registry/media/hover-reel/HoverReel";
import { FolioCard } from "@/registry/cards/folio-card/FolioCard";
import { EnquirySlip } from "@/registry/forms/enquiry-slip/EnquirySlip";
import { SwellButton } from "@/registry/buttons/swell-button/SwellButton";
import { PreviewFonts } from "./fonts";

/*
 * Two designed themes, not an inversion: warm paper and a warm night. Every component takes the page's theme
 * through its own theme prop, and its colours through its tokens, so the switch changes everything at once.
 */
const TOKENS = `
.pf { font-family: Inter, ui-sans-serif, system-ui, sans-serif; }
.pf [data-theme="light"] { --pf-bg: #f4efe6; --pf-ink: #1d1a16; --pf-muted: #6a6358; --pf-line: rgb(29 26 22 / 0.12); --pf-accent: #b4532a; }
.pf [data-theme="dark"] { --pf-bg: #100e0d; --pf-ink: #efe8dc; --pf-muted: #a1998d; --pf-line: rgb(239 232 220 / 0.1); --pf-accent: #e39a6f; }
.pf .tsw-page { background: var(--pf-bg); color: var(--pf-ink); }
.pf .tsw-switch { --tsw-switch-bg: var(--pf-bg); --tsw-switch-line: var(--pf-line); --tsw-switch-ink: var(--pf-ink); }
.pf .lfh { --lfh-bg: var(--pf-bg); --lfh-ink: var(--pf-ink); --lfh-muted: var(--pf-muted); --lfh-accent: var(--pf-accent); }
.pf .hr { --hr-bg: var(--pf-bg); --hr-ink: var(--pf-ink); --hr-muted: var(--pf-muted); --hr-rule: var(--pf-line); }
.pf .folio--paper { --fc-sheet: #fffcf6; --fc-page-a: #ece5d8; --fc-page-b: #d8cfbf; --fc-ink: #1d1a16; --fc-muted: #6a6358; --fc-accent: #b4532a; --fc-ribbon-c: #b4532a; }
.pf .folio--night { --fc-sheet: #1c1917; --fc-page-a: #2a2522; --fc-page-b: #12100e; --fc-ink: #efe8dc; --fc-muted: #a1998d; --fc-accent: #e39a6f; --fc-ribbon-c: #c9673f; }
.pf .enquiry-slip { --es-ink: var(--pf-ink); --es-muted: var(--pf-muted); --es-line: var(--pf-line); --es-accent: var(--pf-accent); --es-stamp: var(--pf-accent); }
.pf .enquiry-slip:not(.enquiry-slip--night) { --es-paper: #fffcf6; }
.pf .enquiry-slip--night { --es-paper: #1c1917; }
.pf .swb--paper { --swb-face: #1d1a16; --swb-ink: #f4efe6; --swb-crest: #e39a6f; --swb-glow: rgb(180 83 42 / 0.2); }
.pf .swb--night { --swb-face: #efe8dc; --swb-edge: transparent; --swb-ink: #100e0d; --swb-crest: #e39a6f; --swb-glow: rgb(227 154 111 / 0.22); }
.pf .folio__title, .pf .lfh__title, .pf .enquiry-slip__to-name { font-family: Fraunces, Georgia, serif; font-optical-sizing: auto; }
.pf-display { font-family: Fraunces, Georgia, serif; font-optical-sizing: auto; font-variation-settings: "SOFT" 50; }
`;

const COVERS: LetterformProject[] = [
  { title: "Masar", kind: "Trip planner, Oman", year: "2025", href: "#work", cover: "repeating-radial-gradient(circle at 68% 58%, transparent 0 13px, rgb(96 40 18 / 0.4) 14px 15px), radial-gradient(circle at 30% 30%, #ffe2a6 0, transparent 45%), linear-gradient(165deg, #f4c27a, #d9813f 55%, #8f3f1d)" },
  { title: "Wally", kind: "Wallet app", year: "2025", href: "#work", cover: "radial-gradient(circle at 70% 35%, #d8ffe6 0, transparent 30%), conic-gradient(from 210deg at 62% 52%, #0c4a2e, #2fae6f, #a9ecc4, #1d7a4c, #0c4a2e)" },
  { title: "Qalam", kind: "Arabic writing tool", year: "2024", href: "#work", cover: "radial-gradient(ellipse at 18% 75%, #c8b9ea 0, transparent 48%), radial-gradient(ellipse at 82% 22%, #7c5cc4 0, transparent 55%), repeating-linear-gradient(118deg, rgb(255 255 255 / 0.05) 0 2px, transparent 2px 9px), #1d1430" },
  { title: "Vitrine", kind: "Component library", year: "2026", href: "#work", cover: "repeating-linear-gradient(0deg, rgb(255 255 255 / 0.09) 0 1px, transparent 1px 22px), repeating-linear-gradient(90deg, rgb(255 255 255 / 0.09) 0 1px, transparent 1px 22px), radial-gradient(ellipse at 28% 38%, #8fb4ff 0, transparent 42%), linear-gradient(160deg, #1b2a4a, #0d1424)" },
];

const WORK: ReelProject[] = [
  { title: "Masar", label: "Trip planner · 2025" },
  { title: "Wally", label: "Wallet app · 2025" },
  { title: "Qalam", label: "Arabic writing · 2024" },
  { title: "Vitrine", label: "Component library · 2026" },
  { title: "Relay", label: "Deploy previews · 2023" },
];

function Section({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: ReactNode; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-16 border-t border-[var(--pf-line)] py-20 sm:py-28">
      <div className="mx-auto w-[min(72rem,calc(100%-2.5rem))]">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--pf-muted)]">{eyebrow}</p>
        <h2 id={`${id}-h`} className="pf-display mt-3 max-w-[22ch] text-[clamp(2rem,4.5vw,3.25rem)] font-[350] leading-[1.05] tracking-[-0.02em]">
          {title}
        </h2>
      </div>
      <div className="mt-10 sm:mt-14">{children}</div>
    </section>
  );
}

export default function Portfolio() {
  const [theme, setTheme] = useState<Theme>("light");
  const scroller = useRef<HTMLDivElement>(null);
  const dark = theme === "dark";
  const t = dark ? "night" : "paper";
  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    scroller.current?.querySelector(`#${id}`)?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };

  return (
    <div ref={scroller} className="pf h-full w-full overflow-y-auto" style={{ background: dark ? "#100e0d" : "#f4efe6" }}>
      <PreviewFonts families={["Fraunces:opsz,wght,SOFT@9..144,300..600,0..100", "Inter:wght@400..600"]} />
      <style>{TOKENS}</style>
      <ThemeStage theme={theme} onThemeChange={setTheme} transition="bloom">
        <header className="sticky top-0 z-20 border-b border-[var(--pf-line)] bg-[var(--pf-bg)]/90 backdrop-blur">
          <div className="mx-auto flex h-14 w-[min(72rem,calc(100%-2.5rem))] items-center justify-between gap-4">
            <a href="#top" onClick={go("top")} className="pf-display text-[1.125rem] font-medium tracking-[-0.01em]">
              Hamza Al-Bulushi
            </a>
            <nav aria-label="Sections" className="flex items-center gap-1 sm:gap-5">
              {[
                ["work", "Work"],
                ["writing", "Writing"],
                ["contact", "Contact"],
              ].map(([id, label]) => (
                <a key={id} href={`#${id}`} onClick={go(id)} className="hidden rounded px-1 text-[0.875rem] text-[var(--pf-muted)] transition-colors hover:text-[var(--pf-ink)] sm:inline">
                  {label}
                </a>
              ))}
              <ThemeSwitch label="Dark theme" />
            </nav>
          </div>
        </header>

        <div id="top" className="h-[30rem] sm:h-[calc(100vh-3.5rem)] sm:min-h-[34rem]">
          <LetterformHero theme={t} word="Hamza" name="Hamza Al-Bulushi" role="Product designer and engineer · Muscat" note="Booking projects from January" projects={COVERS} />
        </div>

        <section aria-label="About" className="border-t border-[var(--pf-line)] py-20 sm:py-28">
          <div className="mx-auto grid w-[min(72rem,calc(100%-2.5rem))] gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-end">
            <p className="pf-display text-[clamp(1.75rem,3.6vw,2.75rem)] font-[330] leading-[1.15] tracking-[-0.015em]">
              I design and build calm software for people who already know what they need, and I stay until it&rsquo;s{" "}
              <em className="text-[var(--pf-accent)]">used</em>, not just shipped.
            </p>
            <div className="max-w-[34ch]">
              <p className="text-[0.9375rem] leading-relaxed text-[var(--pf-muted)]">
                Six years across product teams in Muscat and Berlin. Two seats open from January, for one product and one smaller piece of work.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <SwellButton theme={t} onClick={() => scroller.current?.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}>
                  Start a project
                </SwellButton>
                <a href="#cv" onClick={(e) => e.preventDefault()} className="text-[0.875rem] underline decoration-[var(--pf-line)] underline-offset-4 hover:decoration-[var(--pf-ink)]">
                  Read the CV
                </a>
              </div>
            </div>
          </div>
        </section>

        <Section id="work" eyebrow="Selected work · 2023–2026" title="Five products, each still in use.">
          <HoverReel theme={t} projects={WORK} />
        </Section>

        <Section id="writing" eyebrow="Writing" title="Notes from the work.">
          <div className="mx-auto grid w-[min(72rem,calc(100%-2.5rem))] items-start gap-8 sm:grid-cols-3 sm:gap-6">
            <FolioCard theme={t} href="#writing" kicker="Note" title="Why I prototype in the browser first" dek="Figma shows the screen; the browser shows the wait, the error and the phone." author="Hamza Al-Bulushi" date="12 Sep 2026" words={1100} />
            <FolioCard theme={t} href="#writing" kicker="Case study" title="Masar: one itinerary out of forty tabs" dek="How a trip planner learned to read booking emails." author="Hamza Al-Bulushi" date="28 Jun 2026" words={3400} progress={0.4} />
            <FolioCard theme={t} href="#writing" kicker="Essay" title="Designing Arabic interfaces that don't feel translated" dek="Mirroring is the start. Rhythm, numerals and tone are the rest." author="Hamza Al-Bulushi" date="3 Mar 2026" words={6200} />
          </div>
        </Section>

        <Section id="contact" eyebrow="Contact" title="Tell me what you're making.">
          <div className="mx-auto flex w-[min(72rem,calc(100%-2.5rem))] justify-start">
            <EnquirySlip
              theme={t}
              to={{ name: "Hamza Al-Bulushi", email: "hello@hamza.studio" }}
              topics={["A new product", "A redesign", "Something small", "Just a question"]}
              timeZone="Asia/Muscat"
              replyWithin="within two working days"
              referencePrefix="HB"
              onSend={() => new Promise((r) => setTimeout(r, 900))}
            />
          </div>
        </Section>

        <footer className="border-t border-[var(--pf-line)]">
          <div className="mx-auto flex w-[min(72rem,calc(100%-2.5rem))] flex-wrap justify-between gap-3 py-8 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--pf-muted)]">
            <span>© 2026 Hamza Al-Bulushi</span>
            <span>Muscat · GMT+4</span>
          </div>
        </footer>
      </ThemeStage>
    </div>
  );
}
