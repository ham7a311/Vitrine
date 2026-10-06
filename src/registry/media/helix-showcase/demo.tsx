"use client";
import { HelixShowcase, type Project } from "./HelixShowcase";

const P = (title: string, kind: string, headline: string, layout: Project["layout"], scene: Project["scene"], bg: string, ink: string, accent: string, serif = false): Project =>
  ({ title, kind, headline, layout, scene, bg, ink, accent, serif, href: "#" });

// Sixteen fictional studio projects; every mock site is painted in code.
const PROJECTS: Project[] = [
  P("Sable Dunes", "Hospitality", "Nights the desert keeps", "hero", "dunes", "#f4ede4", "#2b1d12", "#c8763f", true),
  P("Harbour Line", "Travel", "Leave on the morning tide", "split", "sea", "#f6f3ee", "#14202c", "#2d6c9c", true),
  P("Qalam Notes", "Software", "Write it once. Find it always.", "dark", "orbit", "#07080b", "#ffffff", "#5b7cff"),
  P("Wadi House", "Architecture", "A house that follows the valley", "editorial", "court", "#f1efe9", "#1c1b18", "#8a6a4a", true),
  P("Kestrel Rentals", "Automotive", "Drive the coast road", "hero", "peaks", "#eef1f5", "#0f1720", "#e05a2b"),
  P("Mira Clinic", "Health", "Careful dentistry, gently done", "split", "figure", "#f5f7f6", "#14302a", "#2f8f78"),
  P("Lantern Studio", "Brand", "Light for small brands", "product", "orbit", "#fbf6ee", "#231a10", "#e8a33c"),
  P("Taraf Grove", "Food", "Grown slow on the terraces", "editorial", "leaf", "#eff3ea", "#1b2a18", "#5f8f4c", true),
  P("Nadia Saleh", "Portrait", "Faces from the old souq", "hero", "figure", "#efe8e0", "#201a16", "#b0743f", true),
  P("Orbit Labs", "Research", "Sensing the sky above us", "dark", "orbit", "#06070a", "#ffffff", "#ff7a3d"),
  P("Corniche Run", "Sport", "Ten kilometres of sea air", "split", "sea", "#f1f5f8", "#0e1b26", "#1f8ac2"),
  P("Basalt Hotel", "Hospitality", "Rooms carved from the cliff", "editorial", "peaks", "#ecebe8", "#18191b", "#6b7c8f", true),
  P("Falaj Water", "Utilities", "Every drop, accounted for", "product", "leaf", "#f2f7f7", "#10282a", "#1c9a9a"),
  P("Night Market", "Events", "After dark, the city opens", "hero", "city", "#14161c", "#ffffff", "#f2b04a"),
  P("Ferns & Co", "Retail", "Plants that like your flat", "split", "leaf", "#f4f6ef", "#1d2a17", "#4e8a3b", true),
  P("Eighteen Courts", "Real estate", "A quiet green in the city", "editorial", "court", "#f0efe9", "#1b1d17", "#4d6e3a", true),
];

const Mark = () => (
  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 4h4.4L12 15.2 16.6 4H21l-7.4 16h-3.2Z" opacity="0.92" /><path d="M8.6 4h3.2L12 4.6 12.2 4h3.2L12 12.1Z" opacity="0.5" /></svg>
);

export default function Demo({ variant = "dark" }: { variant?: string }) {
  return (
    <HelixShowcase
      projects={PROJECTS}
      brand={{ mark: <Mark />, name: "Vela" }}
      links={[{ label: "Home", href: "#" }, { label: "Studio", href: "#" }, { label: "Work", href: "#" }, { label: "Services", href: "#" }, { label: "Journal", href: "#" }]}
      cta={{ label: "Let's talk", href: "#" }}
      theme={variant === "light" ? "light" : "dark"}
    />
  );
}
