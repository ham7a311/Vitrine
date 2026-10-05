"use client";

import { DemoBoundary } from "@/registry/DemoBoundary";

import { getDemo } from "@/registry/demos";

export function Demo({ slug, variant }: { slug: string; variant?: string }) {
  const Component = getDemo(slug);
  if (!Component) return null;
  return <div data-demo={slug} className="contents"><DemoBoundary><Component variant={variant} /></DemoBoundary></div>;
}
