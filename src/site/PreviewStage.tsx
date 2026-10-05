"use client";

import { rovingFocus } from "./rovingFocus";

import { useId, useState } from "react";
import type { SourceFile } from "@/lib/source";
import { isThemeOnly, type PreviewMode, type Variant } from "@/registry/types";
import { CodeViewer } from "./CodeViewer";
import { useVariantState } from "./VariantState";
import { DesktopIcon, PhoneIcon, ReplayIcon, TabletIcon } from "./icons";

const VIEWPORTS = [
  { id: "full", label: "Full width", width: "100%", Icon: DesktopIcon },
  { id: "tablet", label: "Tablet · 768px", width: "768px", Icon: TabletIcon },
  { id: "mobile", label: "Mobile · 390px", width: "390px", Icon: PhoneIcon },
] as const;

export function PreviewStage({
  slug,
  bg,
  mode,
  height,
  variants,
  files,
  src,
  title,
}: {
  slug: string;
  bg: string;
  mode: PreviewMode;
  height?: number;
  variants?: Variant[];
  files?: SourceFile[];
  /** Frame this page instead of /preview/<slug> (recipes). */
  src?: string;
  title?: string;
}) {
  const id = useId();
  const [tab, setTab] = useState<"preview" | "code">("preview");
  const shared = useVariantState();
  const [own, setOwn] = useState(variants?.[0]?.id);
  const variant = shared ? shared.variant : own;
  const setVariant = shared ? shared.setVariant : setOwn;
  const selected = variants?.find((v) => v.id === variant);
  const [viewport, setViewport] = useState<(typeof VIEWPORTS)[number]["id"]>("full");
  const [runKey, setRunKey] = useState(0);
  const vp = VIEWPORTS.find((v) => v.id === viewport)!;
  const stageHeight = height ?? (mode === "page" ? 760 : mode === "scroll" ? 640 : 600);
  const frameSrc = src ?? `/preview/${slug}${variant ? `?variant=${variant}` : ""}`;

  return (
    <section aria-label="Component preview">
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <div role="tablist" onKeyDown={rovingFocus} aria-label="View" className="flex rounded-lg border border-line p-0.5">
          {(files ? (["preview", "code"] as const) : (["preview"] as const)).map((t) => (
            <button
              key={t}
              role="tab"
              type="button"
              id={`${id}-${t}`}
              aria-controls={`${id}-panel`}
              tabIndex={tab === t ? 0 : -1}
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={`rounded-md px-3.5 py-1.5 text-[0.8125rem] capitalize transition-colors duration-200 ${
                tab === t ? "bg-plum-700 text-cream" : "text-ink-3 hover:text-ink-2"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {variants && variants.length > 1 && (
          <div role="radiogroup" onKeyDown={rovingFocus} aria-label="Variant" className="flex max-w-full flex-wrap gap-1">
            {variants.map((v) => (
              <button
                key={v.id}
                role="radio"
                type="button"
                tabIndex={variant === v.id ? 0 : -1}
                aria-checked={variant === v.id}
                onClick={() => setVariant(v.id)}
                className={`rounded-full border px-3 py-1 text-[0.75rem] transition-colors duration-200 ${
                  variant === v.id ? "border-frost/40 bg-frost/10 text-frost" : "border-line text-ink-3 hover:border-line-strong hover:text-ink-2"
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
        )}

        {tab === "preview" && (
          <div className="ml-auto flex items-center gap-1">
            <div role="radiogroup" onKeyDown={rovingFocus} aria-label="Preview width" className="hidden items-center gap-0.5 rounded-lg border border-line p-0.5 md:flex">
              {VIEWPORTS.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  role="radio"
                  type="button"
                  tabIndex={viewport === id ? 0 : -1}
                  aria-checked={viewport === id}
                  aria-label={label}
                  title={label}
                  onClick={() => setViewport(id)}
                  className={`grid size-7 place-items-center rounded-md transition-colors ${viewport === id ? "bg-plum-700 text-cream" : "text-ink-3 hover:text-ink-2"}`}
                >
                  <Icon className="size-4" />
                </button>
              ))}
            </div>
            <a
              href={frameSrc}
              target="_blank"
              rel="noreferrer"
              aria-label="Open preview in a new tab"
              title="Open in new tab"
              className="grid size-8 place-items-center rounded-lg border border-line text-ink-3 transition-colors hover:text-cream"
            >
              <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 3h4v4M13 3 7.5 8.5M11 9.5V13H3V5h3.5" /></svg>
            </a>
            <button
              type="button"
              onClick={() => setRunKey((k) => k + 1)}
              aria-label="Replay preview"
              title="Replay"
              className="grid size-8 place-items-center rounded-lg border border-line text-ink-3 transition-colors hover:text-cream"
            >
              <ReplayIcon className="size-4" />
            </button>
          </div>
        )}
      </div>

      <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-${tab}`} tabIndex={0}>
      {tab === "preview" ? (
        <div
          className="h-[min(var(--stage-h),78svh)] overflow-hidden rounded-[14px] border border-line bg-plum-950 md:h-[var(--stage-h)]"
          style={{ ["--stage-h" as string]: `${stageHeight}px` }}
        >
          <div
            className="mx-auto h-full overflow-hidden transition-[width] duration-500 ease-[var(--ease-gallery)]"
            style={{
              width: vp.width,
              maxWidth: "100%",
              background: bg,
              boxShadow: viewport === "full" ? undefined : "0 0 0 1px rgb(239 232 220 / 0.1)",
            }}
          >
            {/* A frame, so the component's own media queries answer to the stage width, not the window. */}
            <iframe
              key={`${runKey}-${variant}`}
              src={frameSrc}
              title={title ?? `${slug} preview`}
              className="block h-full w-full border-0"
              style={{ background: bg, colorScheme: "normal" }}
            />
          </div>
        </div>
      ) : (
        files && (
          <>
            {variants && variants.length > 1 && !isThemeOnly(variants) && selected && (
              <p className="mb-3 text-[0.8125rem] text-ink-3">
                The source implements every variant through props; the demo file shows how each one is set. The prompt below describes <span className="text-ink-2">{selected.label}</span>.
              </p>
            )}
            <CodeViewer files={files} />
          </>
        )
      )}
      </div>
    </section>
  );
}
