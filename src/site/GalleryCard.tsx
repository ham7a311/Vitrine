"use client";

import Link from "next/link";
import type { ComponentSummary } from "@/registry";
import { CATEGORIES, TRAIT_LABEL } from "@/registry/types";
import { Demo } from "./Demo";
import { ArrowRight, ExpandIcon } from "./icons";
import { LazyMount } from "./LazyMount";
import { ScaledFrame } from "./ScaledFrame";

export function GalleryCard({ item, size = "default" }: { item: ComponentSummary; size?: "default" | "large" }) {
  const category = CATEGORIES.find((c) => c.id === item.category)?.label;
  const href = `/components/${item.slug}`;
  const frame = item.preview.frame ?? (item.preview.mode === "page" ? ([1280, 800] as [number, number]) : null);

  return (
    <article className="group/card flex flex-col">
      <div
        className={`relative isolate overflow-hidden rounded-[14px] border border-line transition-[border-color] duration-500 group-hover/card:border-line-strong ${
          size === "large" ? "aspect-[4/3] sm:aspect-[16/9]" : "aspect-[4/3] sm:aspect-[16/10]"
        }`}
        style={{ background: item.preview.bg }}
      >
        <LazyMount className="absolute inset-0 [contain:strict]">
          {frame ? (
            <ScaledFrame width={frame[0]} height={frame[1]}>
              <Demo slug={item.slug} />
            </ScaledFrame>
          ) : (
            <div className="absolute inset-0 overflow-hidden">
              <Demo slug={item.slug} />
            </div>
          )}
        </LazyMount>
        <Link
          href={href}
          aria-label={`Open ${item.name}`}
          tabIndex={-1}
          className="absolute right-3 top-3 z-10 grid size-8 place-items-center rounded-md border border-white/10 bg-black/40 text-white/80 opacity-0 backdrop-blur-md transition-opacity duration-300 hover:text-white group-hover/card:opacity-100 max-md:opacity-100"
        >
          <ExpandIcon className="size-3.5" />
        </Link>
      </div>

      <div className="flex items-start gap-4 px-1 pt-4">
        <span className="pt-[0.3rem] font-mono text-[0.6875rem] tabular-nums text-ink-3">No.{String(item.index).padStart(2, "0")}</span>
        <div className="min-w-0 flex-1">
          <h3 className="flex items-center gap-2 font-display text-[1.375rem] leading-tight tracking-[-0.01em] text-cream">
            <Link href={href} className="rounded-sm transition-colors hover:text-frost focus-visible:outline-offset-4">
              {item.name}
            </Link>
            {item.isNew && (
              <span className="rounded-full border border-lilac/30 px-1.5 py-px font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-lilac">New</span>
            )}
          </h3>
          <p className="mt-1 line-clamp-2 text-[0.875rem] leading-relaxed text-ink-3">{item.description}</p>
          <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-ink-3">
            <span className="text-ink-2">{category}</span>
            {item.traits.slice(0, 3).map((t) => (
              <span key={t} className="flex items-center gap-3">
                <span aria-hidden="true" className="size-[3px] rounded-full bg-line-strong" />
                {TRAIT_LABEL[t]}
              </span>
            ))}
          </p>
        </div>
        <ArrowRight className="mt-1.5 size-4 shrink-0 -translate-x-1 text-frost opacity-0 transition-[opacity,transform] duration-300 group-hover/card:translate-x-0 group-hover/card:opacity-100" aria-hidden="true" />
      </div>
    </article>
  );
}
