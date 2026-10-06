"use client";
import { SatinHero } from "./SatinHero";

const Pen = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"><path d="M4 20l1.2-4.6L15.6 5a2.1 2.1 0 0 1 3 3L8.2 18.4Z" /><path d="M13.8 6.8l3 3" /></svg>
);
const Lens = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" /></svg>
);

export default function Demo({ variant = "light" }: { variant?: string }) {
  return (
    <div className="flex min-h-full w-full">
      <SatinHero
        className="w-full"
        name="Salma Haddad"
        links={[{ label: "Work", href: "#" }, { label: "Notes", href: "#" }, { label: "About", href: "#" }, { label: "Contact", href: "#" }]}
        headline={["Care is a slow signal.", "I make it carry."]}
        intro="I'm Salma, a designer in Muscat working where software, small business and craft meet, and on how design can carry between them."
        primary={{ label: "Write to me", href: "#" }}
        secondary={{ label: "See the work", href: "#" }}
        socials={[{ label: "Writing", href: "#", icon: <Pen /> }, { label: "Photographs", href: "#", icon: <Lens /> }]}
        year={2026}
        theme={variant === "dark" ? "dark" : "light"}
      />
    </div>
  );
}
