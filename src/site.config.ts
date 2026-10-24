export type SponsorTier = "supporter" | "studio";

export const site = {
  name: "Vitrine",
  tagline: "Kept under glass.",
  description:
    "A curated collection of React components chosen for how they move, react and feel. Read the source and the prompt behind each one, then make it yours.",
  /** Production origin: canonicals, sitemap, Open Graph, structured data and copyable briefs. */
  url: "https://tryvitrine.dev",
  domain: "tryvitrine.dev",
  /** Public repository. The navbar star count reads from githubRepo. */
  github: "https://github.com/ham7a311/vitrine",
  githubRepo: "ham7a311/vitrine",
  /** Vitrine's company page, linked from the footer. The owner's own profiles stay on /contact. */
  linkedin: "https://linkedin.com/company/vitrineui",
  /** Who runs the site. Used by the legal pages and the contact page. */
  owner: "Hamza Al-Bulushi",
  location: "Muscat, Oman",
  /** Where to reach the owner. The footer shows none of these directly; they live on /contact and the legal pages. */
  contact: {
    email: "hamzataj371@gmail.com",
    /** WhatsApp number in international form, digits only. Offered only as a second option on /sponsor and /partner. */
    whatsapp: "96894990747",
    /** Issues are the home for bug reports and component requests. */
    issues: "https://github.com/ham7a311/vitrine/issues/new",
    /** Elsewhere, shown only on /contact. Delete a line to hide a profile. */
    profiles: [
      { label: "GitHub", handle: "ham7a311", href: "https://github.com/ham7a311" },
      { label: "LinkedIn", handle: "in/ham7a311", href: "https://www.linkedin.com/in/ham7a311" },
      { label: "Instagram", handle: "@ham7a311__", href: "https://www.instagram.com/ham7a311__" },
    ],
  },
  /** Sponsorship tiers on /sponsor. There's no checkout: each tier's buttons open an email or a WhatsApp message naming it. */
  tiers: [
    { id: "supporter", name: "Supporter", price: 5, who: "For anyone who uses Vitrine.", perks: ["Your name on the sponsor page", "Included in a sponsor thank-you post on LinkedIn"] },
    {
      id: "studio",
      name: "Studio",
      price: 25,
      who: "For companies and studios.",
      perks: ["Your logo and link on the sponsor page", "Your logo featured on the Vitrine homepage", "One priority component request each quarter"],
    },
  ] as { id: SponsorTier; name: string; price: number; who: string; perks: string[] }[],
  /** Current sponsors, newest last. Studio logos also appear on the homepage. Example: { name: "Acme", href: "https://acme.dev", tier: "studio", logo: "/sponsors/acme.svg" } */
  sponsors: [] as { name: string; href?: string; tier: SponsorTier; logo?: string }[],
  /** When Terms and Privacy last changed (ISO date). Bump it whenever either page's meaning changes. */
  legalUpdated: "2026-10-05",
};
