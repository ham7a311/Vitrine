import type { Metadata, Viewport } from "next";
import "@fontsource-variable/newsreader/standard.css";
import "@fontsource-variable/newsreader/standard-italic.css";
import "@fontsource-variable/hanken-grotesk/index.css";
import "@fontsource-variable/jetbrains-mono/index.css";
import { site } from "@/site.config";
import "./globals.css";


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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
