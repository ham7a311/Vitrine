import { Analytics } from "@vercel/analytics/next";
import { BackToTop } from "@/site/BackToTop";
import { Footer } from "@/site/Footer";
import { Navbar } from "@/site/Navbar";
import { SearchProvider } from "@/site/SearchPalette";

/*
 * Nothing here is fetched per request: the star count comes from /api/stars and the search index from
 * /search-index.json, both loaded in the browser, so the pages under this layout stay fully static.
 */
export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return <><SearchProvider><Navbar /><main id="main" tabIndex={-1} className="outline-none">{children}</main><Footer /><BackToTop /></SearchProvider><Analytics /></>;
}
