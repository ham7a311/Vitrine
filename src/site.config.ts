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
  /** Who runs the site. Used by the legal pages and the contact page. */
  owner: "Hamza Al-Bulushi",
  location: "Muscat, Oman",
  /** Where to reach the owner. The footer shows none of these directly; they live on /contact and the legal pages. */
  contact: {
    email: "hamzataj371@gmail.com",
    /** Issues are the home for bug reports and component requests. */
    issues: "https://github.com/ham7a311/vitrine/issues/new",
    /** Elsewhere, shown only on /contact. Delete a line to hide a profile. */
    profiles: [
      { label: "GitHub", handle: "ham7a311", href: "https://github.com/ham7a311" },
      { label: "LinkedIn", handle: "in/ham7a311", href: "https://www.linkedin.com/in/ham7a311" },
      { label: "Instagram", handle: "@ham7a311__", href: "https://www.instagram.com/ham7a311__" },
    ],
  },
  /** When Terms and Privacy last changed (ISO date). Bump it whenever either page's meaning changes. */
  legalUpdated: "2026-10-05",
};
