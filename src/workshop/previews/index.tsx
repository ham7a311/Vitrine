"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

/** Live recipe previews, loaded on demand (each pulls in several real components). */
const PREVIEWS: Record<string, ComponentType> = {
  portfolio: dynamic(() => import("./Portfolio"), { ssr: false }),
  showcase: dynamic(() => import("./Showcase"), { ssr: false }),
  studio: dynamic(() => import("./Studio"), { ssr: false }),
  launch: dynamic(() => import("./Launch"), { ssr: false }),
  console: dynamic(() => import("./Console"), { ssr: false }),
  handbook: dynamic(() => import("./Handbook"), { ssr: false }),
  "ai-workspace": dynamic(() => import("./AiWorkspace"), { ssr: false }),
  "ai-company": dynamic(() => import("./AiCompany"), { ssr: false }),
};

export function RecipePreview({ slug }: { slug: string }) {
  const P = PREVIEWS[slug];
  return P ? <P /> : null;
}
