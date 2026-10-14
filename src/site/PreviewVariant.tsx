"use client";

import { useEffect, useState } from "react";
import type { Variant } from "@/registry/types";
import { Demo } from "./Demo";

/**
 * The demo for a full-window preview, showing the variant named in ?variant=. The page is prerendered
 * with the first variant, so it hydrates in place for the default and only the query decides
 * otherwise once the page is live — the same pattern VariantProvider uses on component pages.
 */
export function PreviewVariant({ slug, variants }: { slug: string; variants?: Variant[] }) {
  const fallback = variants?.[0]?.id;
  const [variant, setVariant] = useState(fallback);

  useEffect(() => {
    const requested = new URLSearchParams(location.search).get("variant");
    setVariant(variants?.find((v) => v.id === requested)?.id ?? fallback);
  }, [variants, fallback]);

  // Some demos seed state from their variant on mount, so a different variant mounts a fresh demo.
  return <Demo key={variant} slug={slug} variant={variant} />;
}
