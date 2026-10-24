"use client";

import { HelixShowcase, type Project } from "@/registry/media/helix-showcase/HelixShowcase";
import { GlassTorus } from "@/registry/heroes/glass-torus/GlassTorus";
import { MurmurRows, type Murmur } from "@/registry/sections/murmur-rows/MurmurRows";
import { portrait } from "@/registry/sections/murmur-rows/portraits";
import { LiquidGlassButton } from "@/registry/buttons/liquid-glass-button/LiquidGlassButton";
import { FieldCta } from "@/registry/ctas/field-cta/FieldCta";
import { PreviewFonts } from "./fonts";

/* Work first, words second: the spiral of projects is the opening, and every section after it is darker and quieter. */
const P = (title: string, kind: string, headline: string, layout: Project["layout"], scene: Project["scene"], bg: string, ink: string, accent: string, serif = false): Project =>
  ({ title, kind, headline, layout, scene, bg, ink, accent, serif, href: "#work" });

const PROJECTS: Project[] = [
  P("Sable Dunes", "Hospitality", "Nights the desert keeps", "hero", "dunes", "#f4ede4", "#2b1d12", "#c8763f", true),
  P("Harbour Line", "Travel", "Leave on the morning tide", "split", "sea", "#f6f3ee", "#14202c", "#2d6c9c", true),
  P("Qalam Notes", "Software", "Write it once. Find it always.", "dark", "orbit", "#07080b", "#ffffff", "#5b7cff"),
  P("Wadi House", "Architecture", "A house that follows the valley", "editorial", "court", "#f1efe9", "#1c1b18", "#8a6a4a", true),
  P("Kestrel Rentals", "Automotive", "Drive the coast road", "hero", "peaks", "#eef1f5", "#0f1720", "#e05a2b"),
  P("Mira Clinic", "Health", "Careful dentistry, gently done", "split", "figure", "#f5f7f6", "#14302a", "#2f8f78"),
  P("Lantern Studio", "Brand", "Light for small brands", "product", "orbit", "#fbf6ee", "#231a10", "#e8a33c"),
  P("Taraf Grove", "Food", "Grown slow on the terraces", "editorial", "leaf", "#eff3ea", "#1b2a18", "#5f8f4c", true),
  P("Night Market", "Events", "After dark, the city opens", "hero", "city", "#14161c", "#ffffff", "#f2b04a"),
  P("Corniche Run", "Sport", "Ten kilometres of sea air", "split", "sea", "#f1f5f8", "#0e1b26", "#1f8ac2"),
  P("Basalt Hotel", "Hospitality", "Rooms carved from the cliff", "editorial", "peaks", "#ecebe8", "#18191b", "#6b7c8f", true),
  P("Falaj Water", "Utilities", "Every drop, accounted for", "product", "leaf", "#f2f7f7", "#10282a", "#1c9a9a"),
];

const QUOTES: Murmur[] = [
  { id: "a", name: "Salim Al-Rawahi", role: "Founder, Sable Dunes", avatar: portrait("crop", "collar"), text: "Bookings doubled in the first season, and guests started photographing the signage. That never happened before." },
  { id: "b", name: "Mira Haddad", role: "Director, Mira Clinic", avatar: portrait("long", "turtle"), text: "Layla made a dental clinic feel calm before you walk in. Patients mention the website on the phone." },
  { id: "c", name: "Omar Nasser", role: "Head of brand, Harbour Line", avatar: portrait("beard", "tie", true), text: "She asked better questions about our customers than our research agency did, and the identity came straight out of the answers." },
  { id: "d", name: "Huda Al-Kindi", role: "Owner, Taraf Grove", avatar: portrait("bun", "dots"), text: "The labels, the boxes and the site all look like one farm now. Our stockists noticed before we told them." },
  { id: "e", name: "Kai Brandt", role: "CTO, Qalam Notes", avatar: portrait("cap", "hoodie"), text: "Design files that engineers can actually build from. Every state was there, including the empty ones." },
  { id: "f", name: "Aisha Al-Harthy", role: "Producer, Night Market", avatar: portrait("curls", "stripes"), text: "A poster system we can reuse every month without calling her. That's the best handover I've had." },
];

const Mark = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M5 3h3.2v14.6H19V21H5Z" />
    <circle cx="17" cy="6.5" r="3.2" opacity="0.6" />
  </svg>
);

export default function Showcase() {
  return (
    <div className="h-full w-full overflow-y-auto bg-[#010307] text-white" style={{ fontFamily: "Inter, ui-sans-serif, system-ui" }}>
      <PreviewFonts families={["Syne:wght@500..800"]} />
      <HelixShowcase
        projects={PROJECTS}
        brand={{ mark: <Mark />, name: "Layla Al-Said" }}
        links={[{ label: "Work", href: "#work" }, { label: "About", href: "#about" }, { label: "Kind words", href: "#words" }, { label: "Contact", href: "#contact" }]}
        cta={{ label: "Book a call", href: "#contact" }}
        length={3}
        theme="dark"
      />

      <section id="about" aria-labelledby="sc-about" className="relative overflow-hidden px-5 py-28 sm:px-10">
        <div aria-hidden="true" className="absolute right-[-10%] top-[10%] h-[30rem] w-[40rem] rounded-full opacity-60 blur-3xl" style={{ background: "radial-gradient(closest-side, #ff7a59, transparent), radial-gradient(closest-side at 70% 60%, #8b5cf6, transparent)" }} />
        <div className="relative mx-auto grid w-full max-w-[72rem] gap-12 lg:grid-cols-[1.5fr_1fr] lg:items-end">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/55">Brand and web design · Muscat</p>
            <h2 id="sc-about" className="mt-4 text-[clamp(2.25rem,5.5vw,4.5rem)] font-bold leading-[0.98] tracking-[-0.03em]" style={{ fontFamily: "Syne, Inter, sans-serif" }}>
              Brands that hold up on a screen, a sign and a paper bag.
            </h2>
          </div>
          <div>
            <ul className="space-y-3 border-t border-white/15 pt-5 text-[0.9375rem] text-white/75">
              {["Identity and naming", "Websites, designed and built", "Packaging and print", "Poster and campaign systems"].map((s) => (
                <li key={s} className="flex justify-between border-b border-white/10 pb-3">
                  <span>{s}</span>
                  <span aria-hidden="true" className="text-white/35">↗</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <LiquidGlassButton onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>Book a call</LiquidGlassButton>
              <LiquidGlassButton tint="255 196 170">Download the deck ↓</LiquidGlassButton>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Seen first" className="h-[min(78vh,44rem)] border-y border-white/10">
        <GlassTorus lines={["SEEN", "FIRST"]} label="A glass ring turning in front of the words Seen first" className="h-full" />
      </section>

      <section id="words" aria-labelledby="sc-words" className="py-24">
        <div className="mx-auto mb-10 w-[min(72rem,calc(100%-2.5rem))]">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/55">Kind words</p>
          <h2 id="sc-words" className="mt-3 text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1] tracking-[-0.03em]" style={{ fontFamily: "Syne, Inter, sans-serif" }}>
            From the people who hired me.
          </h2>
        </div>
        <MurmurRows quotes={QUOTES} rows={2} look="illustrated" label="What clients say about Layla" />
      </section>

      <section id="contact" className="px-3 pb-6 sm:px-6">
        <FieldCta
          field="plumes"
          layout="split"
          eyebrow="Booking from February"
          title="Have something that should be seen first?"
          lede="Two projects at a time, so each one gets my full attention. Tell me about yours and I'll reply within two days."
          primary={{ label: "Book a call", href: "#call" }}
          secondary={{ label: "layla@alsaid.studio", href: "#email" }}
          onNavigate={(_, e) => e.preventDefault()}
        />
      </section>

      <footer className="mx-auto flex w-[min(72rem,calc(100%-2.5rem))] flex-wrap justify-between gap-3 py-8 font-mono text-[11px] uppercase tracking-[0.14em] text-white/45">
        <span>© 2026 Layla Al-Said</span>
        <span>Instagram · Behance · Read.cv</span>
      </footer>
    </div>
  );
}
