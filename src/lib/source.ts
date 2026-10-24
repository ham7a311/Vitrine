import "server-only";
import { readFileSync } from "node:fs";
import path from "node:path";

/** What a component page knows about each file before the Code tab opens. */
export interface SourceFileName {
  name: string;
  role: "component" | "style" | "usage";
}

/** A file as /source/<slug>.<hash>.json carries it: portable code and its build-time highlighting. */
export interface SourceFile extends SourceFileName {
  code: string;
  html: string;
}

let manifest: Record<string, string> | undefined;

/**
 * The content-hashed URL of a component's source, written by scripts/build-source.mts before the build. A variant
 * that is its own implementation (meta.variantSources) has its own source, under slug#variant.
 */
export function sourceUrl(slug: string, variant?: string) {
  try {
    // Built pages read it once; the dev server reads it per request, since scripts/dev.mts rewrites it on every edit.
    if (!manifest || process.env.NODE_ENV !== "production") manifest = JSON.parse(readFileSync(path.join(process.cwd(), "source-manifest.json"), "utf8")) as Record<string, string>;
  } catch (e) {
    throw new Error("source-manifest.json is missing: run npm run build:source", { cause: e });
  }
  const key = variant ? `${slug}#${variant}` : slug;
  const url = manifest[key];
  if (!url) throw new Error(`No built source for ${key}: run npm run build:source`);
  return url;
}
