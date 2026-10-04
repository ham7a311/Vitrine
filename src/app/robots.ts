import type { MetadataRoute } from "next";
import { site } from "@/site.config";

/** Previews and film frames are bare stages for iframes and screenshots; they are also noindex. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/preview/", "/film/", "/workshop/recipes/*/preview", "/_brand/"] },
    sitemap: new URL("/sitemap.xml", site.url).toString(),
    host: site.url,
  };
}
