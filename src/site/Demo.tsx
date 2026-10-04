"use client";

import { getDemo } from "@/registry/demos";

export function Demo({ slug, variant }: { slug: string; variant?: string }) {
  const Component = getDemo(slug);
  if (!Component) return null;
  return <Component variant={variant} />;
}
