import { summaries } from "@/registry";
import { site } from "@/site.config";
import { Analytics } from "@vercel/analytics/next";
import { BackToTop } from "@/site/BackToTop";
import { Footer } from "@/site/Footer";
import { Navbar } from "@/site/Navbar";
import { SearchProvider } from "@/site/SearchPalette";

async function getStars(): Promise<number | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${site.githubRepo}`, { next: { revalidate: 3600 }, signal: AbortSignal.timeout(3000) });
    if (!res.ok) return null;
    const data = (await res.json()) as { stargazers_count?: number };
    return typeof data.stargazers_count === "number" ? data.stargazers_count : null;
  } catch {
    return null;
  }
}

export default async function GalleryLayout({ children }: { children: React.ReactNode }) {
  const stars = await getStars();
  return <><SearchProvider items={summaries()}><Navbar stars={stars} /><main id="main" tabIndex={-1} className="outline-none">{children}</main><Footer /><BackToTop /></SearchProvider><Analytics /></>;
}
