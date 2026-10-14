import type { ReactNode } from "react";
import { SponsorBoard, type BoardTier } from "./SponsorBoard";

// Fictional companies with original marks drawn inline.
const word = (name: string, glyph: ReactNode, w: number, colour: string) => (
  <svg viewBox={`0 0 ${w} 64`}>
    <g fill={colour}>{glyph}</g>
    <text x="64" y="45" fill="currentColor" fontFamily="Hanken Grotesk, sans-serif" fontSize="42" fontWeight="700" letterSpacing="-1.6">{name}</text>
  </svg>
);
const Saltmarsh = word("Saltmarsh", <><rect x="6" y="14" width="40" height="8" rx="4" /><rect x="6" y="28" width="40" height="8" rx="4" opacity=".7" /><rect x="6" y="42" width="40" height="8" rx="4" opacity=".45" /></>, 270, "#3fb4a2");
const Orchard = word("Orchard", <><circle cx="26" cy="36" r="18" /><path d="M26 18c2-8 8-12 14-12-2 7-7 11-14 12Z" /></>, 232, "#e0703f");
const Fieldnote = word("Fieldnote", <path d="M8 10h32l8 8v36H8Z M40 10v8h8" />, 268, "#8f86f2");
const Hollow = word("Hollow", <path d="M26 6a26 26 0 1 0 0 52 26 26 0 1 0 0-52Zm0 12a14 14 0 1 1 0 28 14 14 0 1 1 0-28Z" fillRule="evenodd" />, 214, "#d4a63a");
const Tern = word("Tern", <path d="M4 40c16-4 28-16 44-30-4 18-14 30-30 34Z" />, 168, "#5c9ee8");

const backers = ["Ada Okafor", "Liam Chen", "Sofia Rossi", "Kai Müller", "Nadia Haddad", "Tomás Silva", "Yuki Sato", "Elif Kaya", "Owen Hart", "Mira Patel"].map((name) => ({ name }));

export default function Demo({ variant = "night" }: { variant?: string }) {
  const paper = variant === "paper";
  const tiers: BoardTier[] = [
    { id: "platinum", name: "Platinum", size: "lg", price: "$1,000 / month", perks: ["Large logo on the home page and README", "A thank-you post each month"], slots: 2, href: "#platinum",
      sponsors: [{ name: "Saltmarsh", logo: Saltmarsh, href: "#saltmarsh", since: "Since May 2025" }] },
    { id: "gold", name: "Gold", size: "md", price: "$400 / month", perks: ["Logo on the home page and docs"], slots: 3, href: "#gold",
      sponsors: paper ? [{ name: "Orchard", logo: Orchard, href: "#orchard", since: "Since January 2026" }, { name: "Fieldnote", logo: Fieldnote, href: "#fieldnote", since: "Since August 2025" }] : [{ name: "Orchard", logo: Orchard, href: "#orchard", since: "Since January 2026" }] },
    { id: "silver", name: "Silver", size: "sm", price: "$100 / month", perks: ["Logo in the README"], slots: 4, href: "#silver",
      sponsors: [{ name: "Hollow", logo: Hollow, href: "#hollow", since: "Since June 2025" }, { name: "Tern", logo: Tern, href: "#tern" }, { name: "Kiln & Co", src: "data:image/png;base64,broken", href: "#kiln" }] },
  ];
  return (
    <div style={{ minHeight: "100%", display: "grid", alignContent: "center", padding: "clamp(12px, 3vw, 40px)", background: paper ? "#f2f1ec" : "#050505" }}>
      <SponsorBoard
        theme={paper ? "paper" : "night"}
        eyebrow="Lumen UI · open source, MIT"
        title="Sponsors"
        lede="Lumen UI is free and maintained in the open. Sponsorship pays for the time it takes to keep it that way."
        goal={{ raised: 245000, target: 400000, note: "Funds one maintainer full-time" }}
        primary={{ label: "Become a sponsor", href: "#sponsor" }}
        secondary={{ label: "One-time gift", href: "#gift" }}
        tiers={tiers}
        backers={{ label: "Individual backers", price: "$5+ / month", people: backers, total: 138, href: "#backers" }}
        onNavigate={(_, e) => e.preventDefault()}
      />
    </div>
  );
}
