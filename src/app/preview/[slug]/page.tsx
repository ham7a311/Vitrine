import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getComponent, registry } from "@/registry";
import { Demo } from "@/site/Demo";

export function generateStaticParams() {
  return registry.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const meta = getComponent((await params).slug);
  return meta ? { title: `${meta.name} — preview`, robots: { index: false } } : {};
}

/** Full-window preview of one component, laid over the site chrome. */
export default async function PreviewPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ variant?: string }> }) {
  const { slug } = await params;
  const { variant } = await searchParams;
  const meta = getComponent(slug);
  if (!meta) notFound();
  // Always scrollable: a demo that stacks taller than a phone screen must never be clipped.
  return (
    <div className="fixed inset-0 z-[1000] overflow-x-hidden overflow-y-auto" style={{ background: meta.preview.bg }}>
      <div className="relative h-full w-full">
        <Demo slug={slug} variant={variant} />
      </div>
    </div>
  );
}
