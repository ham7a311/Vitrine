"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { composePrompt, isThemeOnly, type Variant } from "@/registry/types";
import { CopyButton } from "./CopyButton";

type Ctx = { variant: string | undefined; setVariant: (id: string) => void; variants?: Variant[] };
const VariantContext = createContext<Ctx | null>(null);

/** One selection shared by the preview, the code tab and the prompt, mirrored to ?variant= so a reload or shared link shows the same thing. */
export function VariantProvider({ variants, children }: { variants?: Variant[]; children: React.ReactNode }) {
  const [variant, set] = useState(variants?.[0]?.id);

  useEffect(() => {
    const id = new URLSearchParams(location.search).get("variant");
    if (id && variants?.some((v) => v.id === id)) set(id);
  }, [variants]);

  const setVariant = useCallback(
    (id: string) => {
      set(id);
      const url = new URL(location.href);
      if (id === variants?.[0]?.id) url.searchParams.delete("variant");
      else url.searchParams.set("variant", id);
      history.replaceState(history.state, "", url);
    },
    [variants],
  );

  return <VariantContext.Provider value={{ variant, setVariant, variants }}>{children}</VariantContext.Provider>;
}

export const useVariantState = () => useContext(VariantContext);

export function PromptPanel({ prompt }: { prompt: string }) {
  const ctx = useVariantState();
  const variants = ctx?.variants;
  const configurable = variants && variants.length > 1 && !isThemeOnly(variants);
  const selected = variants?.find((v) => v.id === ctx?.variant) ?? variants?.[0];
  const text = composePrompt(prompt, variants, selected?.id);

  return (
    <section aria-labelledby="prompt-h">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 id="prompt-h" className="font-display text-[1.75rem] tracking-[-0.015em] text-cream">
          The prompt
        </h2>
        <CopyButton text={text} label="Copy prompt" />
      </div>
      <p className="mt-2 text-[0.875rem] text-ink-3">
        {configurable ? (
          <>
            Written for the variant you picked above:{" "}
            <span className="rounded-full border border-frost/40 bg-frost/10 px-2 py-0.5 text-[0.75rem] text-frost" aria-live="polite">
              {selected?.label}
            </span>
          </>
        ) : (
          "The design brief behind this component — reuse it to regenerate, remix, or explain it."
        )}
      </p>
      <blockquote className="relative mt-6 rounded-[14px] border border-line bg-plum-950/60 p-6 md:p-8">
        <span aria-hidden="true" className="absolute left-0 top-8 h-10 w-px bg-frost/60" />
        <div data-prompt className="whitespace-pre-line break-words text-[0.9375rem] leading-[1.75] text-ink-2">
          {text}
        </div>
      </blockquote>
    </section>
  );
}
