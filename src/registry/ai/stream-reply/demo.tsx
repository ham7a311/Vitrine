"use client";

import { StreamReply, type Block } from "./StreamReply";

const BLOCKS: Block[] = [
  { type: "p", text: "Yes — debounce the search input so you only query after the user pauses. 250ms is a good start for a destination search like this:" },
  {
    type: "code",
    lang: "ts",
    code: [
      { t: "export function ", k: "kw" }, { t: "useDebounced", k: "fn" }, { t: "<T>(value: T, ms = " }, { t: "250", k: "num" }, { t: ") {\n  " },
      { t: "const ", k: "kw" }, { t: "[v, setV] = " }, { t: "useState", k: "fn" }, { t: "(value);\n  " },
      { t: "useEffect", k: "fn" }, { t: "(() => {\n    " }, { t: "const ", k: "kw" }, { t: "id = " }, { t: "setTimeout", k: "fn" }, { t: "(() => setV(value), ms);\n    " },
      { t: "return ", k: "kw" }, { t: "() => " }, { t: "clearTimeout", k: "fn" }, { t: "(id);\n  }, [value, ms]);\n  " }, { t: "return ", k: "kw" }, { t: "v;\n}" },
    ],
  },
  { type: "list", items: ["Show the spinner only after 300ms, so fast answers never flash it.", "Keep the last results on screen while the next ones load.", "Cancel the previous request with an AbortController."] },
];

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  return (
    <div className={`flex min-h-full w-full items-center justify-center p-6 ${night ? "bg-[#0b0a0e]" : "bg-[#efede8]"}`}>
      <StreamReply theme={night ? "night" : "paper"} question="Should I debounce the destination search box?" blocks={BLOCKS} />
    </div>
  );
}
