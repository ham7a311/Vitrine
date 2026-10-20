"use client";

import Link from "next/link";
import type { CardView } from "@/registry";
import { CATEGORIES, TRAIT_LABEL } from "@/registry/types";
import { Demo } from "./Demo";
import { ArrowRight, ExpandIcon } from "./icons";
import { LazyMount } from "./LazyMount";
import { ScaledFrame } from "./ScaledFrame";

export function GalleryCard({ item, size = "default" }: { item: CardView; size?: "default" | "large" }) {
  const category = CATEGORIES.find((c) => c.id === item.category)?.label;
  const href = `/components/${item.slug}`;
  const frame = item.preview.frame ?? (item.preview.mode === "page" ? ([1280, 800] as [number, number]) : null);

  return (
    <article className="group/card flex flex-col">
      <div
        className={`vitrine-card-preview ${
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
        {/* No prefetch: a grid of cards would otherwise fetch every component page as it scrolls into view. */}
        <Link
          href={href}
          prefetch={false}
          aria-label={`Open ${item.name}`}
          tabIndex={-1}
          className="vitrine-card-expand"
        >
          <ExpandIcon className="size-3.5" />
        </Link>
      </div>

      <div className="vitrine-card-meta">
        <span className="vitrine-card-num">No.{String(item.index).padStart(2, "0")}</span>
        <div className="min-w-0 flex-1">
          <h3 className="vitrine-card-title">
            <Link href={href} prefetch={false} className="vitrine-card-link">
              {item.name}
            </Link>
            {item.isNew && (
              <span className="vitrine-card-new">New</span>
            )}
          </h3>
          <p className="vitrine-card-desc">{item.description}</p>
          <p className="vitrine-card-traits">
            <span className="text-ink-2">{category}</span>
            {item.traits.slice(0, 3).map((t) => (
              <span key={t} className="flex items-center gap-3">
                <span aria-hidden="true" className="vitrine-card-dot" />
                {TRAIT_LABEL[t]}
              </span>
            ))}
          </p>
        </div>
        <ArrowRight className="vitrine-card-arrow" aria-hidden="true" />
      </div>
    </article>
  );
}
