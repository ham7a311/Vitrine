import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getRecipe, RECIPES } from "@/workshop/recipes";
import { RecipePreview } from "@/workshop/previews";

export function generateStaticParams() {
  return RECIPES.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const r = getRecipe((await params).slug);
  return r ? { title: `${r.name} — preview`, robots: { index: false } } : {};
}

/** Full-window live preview in the bare preview layout. The recipe scrolls itself. */
export default async function RecipePreviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const r = getRecipe((await params).slug);
  if (!r) notFound();
  return (
    <div className="fixed inset-0 z-[1000] overflow-hidden" style={{ background: r.bg }}>
      <RecipePreview slug={r.slug} />
    </div>
  );
}
