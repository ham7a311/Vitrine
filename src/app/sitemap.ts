import type { MetadataRoute } from "next";
import { registry } from "@/registry";
import { site } from "@/site.config";
import { RECIPES } from "@/workshop/recipes";
import { SKILLS } from "@/workshop/skills";

export default function sitemap(): MetadataRoute.Sitemap {
  const u = (p: string) => new URL(p, site.url).toString();
  return [
    { url: u("/"), changeFrequency: "weekly", priority: 1 },
    { url: u("/components"), changeFrequency: "weekly", priority: 0.9 },
    { url: u("/categories"), changeFrequency: "monthly", priority: 0.6 },
    { url: u("/workshop"), changeFrequency: "monthly", priority: 0.7 },
    { url: u("/about"), changeFrequency: "yearly", priority: 0.3 },
    { url: u("/contact"), changeFrequency: "yearly", priority: 0.3 },
    { url: u("/terms"), changeFrequency: "yearly", priority: 0.2 },
    { url: u("/privacy"), changeFrequency: "yearly", priority: 0.2 },
    ...registry.map((c) => ({ url: u(`/components/${c.slug}`), changeFrequency: "monthly" as const, priority: 0.8 })),
    ...SKILLS.map((s) => ({ url: u(`/workshop/skills/${s.slug}`), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...RECIPES.map((r) => ({ url: u(`/workshop/recipes/${r.slug}`), changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
