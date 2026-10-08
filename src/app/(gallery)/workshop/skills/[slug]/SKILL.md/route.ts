import { SKILLS } from "@/workshop/skills";
import { loadSkill } from "@/workshop/skill-source";

export const dynamic = "force-static";

/* Only the pages built from the registry exist; any other slug is a plain 404 and is never cached. */
export const dynamicParams = false;

export function generateStaticParams() {
  return SKILLS.map((s) => ({ slug: s.slug }));
}

/** The raw skill file, as a download. */
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!SKILLS.some((s) => s.slug === slug)) return new Response("Not found", { status: 404 });
  const { raw } = await loadSkill(slug);
  return new Response(raw, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="${slug}-SKILL.md"`,
    },
  });
}
