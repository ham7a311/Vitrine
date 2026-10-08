import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getComponent, registry } from "@/registry";
import { Demo } from "@/site/Demo";

/* Only the pages built from the registry exist; any other slug is a plain 404 and is never cached. */
export const dynamicParams = false;

export function generateStaticParams() {
  return registry.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const meta = getComponent((await params).slug);
  return meta ? { title: `${meta.name} — preview`, robots: { index: false } } : {};
}

/** Full-window preview of one component in the bare preview layout. */
export default async function PreviewPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ variant?: string }> }) {
  const { slug } = await params;
  const requested = (await searchParams).variant;
  const meta = getComponent(slug);
  if (!meta) notFound();
  const variant = meta.variants?.find((v) => v.id === requested)?.id ?? meta.variants?.[0]?.id;
  // Always scrollable: a demo that stacks taller than a phone screen must never be clipped.
  return (
    <div className="fixed inset-0 z-[1000] overflow-x-hidden overflow-y-auto" style={{ background: meta.preview.bg }}>
      <div className="relative h-full w-full">
        <Demo slug={slug} variant={variant} />
      </div>
    </div>
  );
}
