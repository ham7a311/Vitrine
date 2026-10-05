import type { Metadata } from "next";
import { site } from "@/site.config";

/** The shared card from app/opengraph-image.tsx; pages that set openGraph must list it again or it is dropped. */
const OG_IMAGE = { url: "/opengraph-image", width: 1200, height: 630, alt: `${site.name} — ${site.tagline}` };

export const abs = (path: string) => new URL(path, site.url).toString();

/** Per-page metadata with a canonical URL and matching Open Graph / X cards. */
export function pageMeta({ title, description, path, absoluteTitle }: { title: string; description: string; path: string; absoluteTitle?: boolean }): Metadata {
  const full = absoluteTitle ? title : `${title} · ${site.name}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: { title: full, description, url: path, siteName: site.name, type: "website", locale: "en_GB", images: [OG_IMAGE] },
    twitter: { card: "summary_large_image", title: full, description, images: [OG_IMAGE.url] },
  };
}

export function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: abs(it.path) })),
  };
}

/** Structured data, escaped so a "</script>" inside a string can't end the tag. */
export function JsonLd({ data }: { data: object | object[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

/** What one component of each category is called, for titles like "Silk Field — React background". */
export const CATEGORY_NOUN: Record<string, string> = {
  buttons: "button", controls: "control", cards: "card", backgrounds: "background", cursors: "custom cursor", text: "text animation",
  ai: "AI chat component", sidebars: "sidebar", heroes: "hero section", navbars: "navbar", navigation: "navigation component",
  overlays: "dialog & overlay", data: "data component", footers: "footer", pricing: "pricing section", faq: "FAQ section",
  ctas: "call to action", auth: "sign-in component", stats: "stats section", analytics: "chart", forms: "form component",
  feedback: "toast & notice", sections: "page section", type: "typography component", media: "gallery & image component", maps: "map & globe", micro: "micro-animation",
  decisions: "decision component", reading: "reading component", commerce: "commerce component", time: "time & history component",
};
