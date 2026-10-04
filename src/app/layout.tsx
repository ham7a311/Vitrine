import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, JetBrains_Mono, Newsreader } from "next/font/google";
import { summaries } from "@/registry";
import { site } from "@/site.config";
import { BackToTop } from "@/site/BackToTop";
import { Footer } from "@/site/Footer";
import { Navbar } from "@/site/Navbar";
import { SearchProvider } from "@/site/SearchPalette";
import "./globals.css";

const newsreader = Newsreader({ subsets: ["latin"], variable: "--font-newsreader", style: ["normal", "italic"], axes: ["opsz"] });
const hanken = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-hanken" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

const COMPONENT_FONTS =
  "https://fonts.googleapis.com/css2?family=Anton&family=Cinzel:wght@400..900&family=Cinzel+Decorative:wght@700;900&family=Pinyon+Script&family=Poiret+One&family=UnifrakturMaguntia&family=Archivo:wdth,wght@100,400..700&family=Geist:wght@400..700&family=Geist+Mono:wght@400;500&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500&family=Instrument+Serif:ital@0;1&display=swap";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — ${site.tagline}`, template: `%s · ${site.name}` },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: "/" },
  openGraph: { siteName: site.name, type: "website", locale: "en_GB", url: "/", title: `${site.name} — ${site.tagline}`, description: site.description, images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: `${site.name} — ${site.tagline}` }] },
  twitter: { card: "summary_large_image", title: `${site.name} — ${site.tagline}`, description: site.description, images: ["/opengraph-image"] },
};

export const viewport: Viewport = { themeColor: "#09080b", colorScheme: "dark" };

async function getStars(): Promise<number | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${site.githubRepo}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const data = (await res.json()) as { stargazers_count?: number };
    return typeof data.stargazers_count === "number" ? data.stargazers_count : null;
  } catch {
    return null;
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const stars = await getStars();
  return (
    <html lang="en" className={`${newsreader.variable} ${hanken.variable} ${jetbrains.variable}`}>
      <head>
        {/* Fonts used *inside* components (by their real family names), so copied CSS renders as designed. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="stylesheet" href={COMPONENT_FONTS} />
      </head>
      <body>
        <SearchProvider items={summaries()}>
          <Navbar stars={stars} />
          <main id="main" tabIndex={-1} className="outline-none">{children}</main>
          <Footer />
          <BackToTop />
        </SearchProvider>
      </body>
    </html>
  );
}
