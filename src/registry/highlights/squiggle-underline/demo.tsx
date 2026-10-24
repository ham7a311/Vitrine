"use client";

import { SquiggleUnderline } from "./SquiggleUnderline";
import type { Kind } from "./squiggle";

const LOOKS: Record<string, { kind: Kind; a: string; b: string }> = {
  wave: { kind: "wave", a: "#ff5a36", b: "#2f6bff" },
  zigzag: { kind: "zigzag", a: "#e8366f", b: "#0f9d74" },
  double: { kind: "double", a: "#1f5bd8", b: "#e2531d" },
  scribble: { kind: "scribble", a: "#7b3fe4", b: "#d48a00" },
};

export default function Demo({ variant = "wave" }: { variant?: string }) {
  const { kind, a, b } = LOOKS[variant] ?? LOOKS.wave;
  return (
    <div className="flex min-h-full w-full items-center bg-[#fbfaf6] px-6 py-16 text-[#17161a] sm:px-14">
      <div className="mx-auto w-full max-w-[44rem]">
        <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.18em] text-black/45">Vitrine · Reading list</p>
        <h2 className="m-0 font-[family-name:Newsreader] text-[clamp(2.2rem,6.4vw,4.4rem)] font-medium leading-[1.12] tracking-[-0.025em]">
          Books that are <SquiggleUnderline kind={kind} color={a} delay={250}>worth reading twice</SquiggleUnderline>.
        </h2>
        <p className="mt-8 font-[family-name:Newsreader] text-[clamp(1.15rem,1.8vw,1.4rem)] leading-[1.7] text-black/75">
          A short list, chosen slowly: novels you finish and immediately start again, essays that{" "}
          <SquiggleUnderline kind={kind} color={b} delay={1400}>quietly change how you see an ordinary Tuesday afternoon in the kitchen</SquiggleUnderline>, and one very good cookbook.
        </p>
      </div>
    </div>
  );
}
