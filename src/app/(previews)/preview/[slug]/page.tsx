import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getComponent, registry } from "@/registry";
import { PreviewVariant } from "@/site/PreviewVariant";

/* Only the pages built from the registry exist; any other slug is a plain 404 and is never cached. */
export const dynamicParams = false;

export function generateStaticParams() {
  return registry.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const meta = getComponent((await params).slug);
  return meta ? { title: `${meta.name} — preview`, robots: { index: false } } : {};
}

/**
 * Full-window preview of one component in the bare preview layout. It never reads searchParams, so
 * every slug is prerendered and cacheable; ?variant= is resolved in the browser by PreviewVariant.
 */
export default async function PreviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const meta = getComponent(slug);
  if (!meta) notFound();
  // Always scrollable: a demo that stacks taller than a phone screen must never be clipped.
  return (
    <div className="fixed inset-0 z-[1000] overflow-x-hidden overflow-y-auto" style={{ background: meta.preview.bg }}>
      <div className="relative h-full w-full">
        <PreviewVariant slug={slug} variants={meta.variants} />
      </div>
    </div>
  );
}
