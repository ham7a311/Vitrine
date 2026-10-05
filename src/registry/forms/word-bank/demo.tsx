"use client";
import { useState } from "react";
import { WordBank } from "./WordBank";

const EXERCISES = [
  { prompt: "القهوة ساخنة جداً", answers: ["The coffee is very hot"], words: ["hot", "tea", "is", "The", "very", "cold", "coffee", "not"] },
  { prompt: "أين محطة الحافلات؟", answers: ["Where is the bus station?", "Where's the bus station?"], words: ["station", "the", "Where", "bus", "is", "train", "when"] },
];

export default function Demo({ variant = "light" }: { variant?: string }) {
  const [n, setN] = useState(0);
  const ex = EXERCISES[n % EXERCISES.length];
  return (
    <div className={`flex min-h-full w-full flex-col ${variant === "dark" ? "bg-[#131f24]" : "bg-white"}`}>
      <WordBank key={n} prompt={ex.prompt} promptLang="ar" words={ex.words} answers={ex.answers} theme={variant === "dark" ? "dark" : "light"} onContinue={() => setN((x) => x + 1)} onSkip={() => setN((x) => x + 1)} />
    </div>
  );
}
