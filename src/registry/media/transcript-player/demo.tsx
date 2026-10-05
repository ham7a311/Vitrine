"use client";
import { useEffect, useMemo, useState } from "react";
import { TranscriptPlayer, type Word } from "./TranscriptPlayer";

// A fictional interview, with timings generated at an even speaking pace.
const SCRIPT: [string, string][] = [
  ["a", "Welcome back to Field Notes. Today we are in Muscat with Salma, who builds tools for small teams."],
  ["b", "Thanks for having me. It is good to be back."],
  ["a", "You started Qalam three years ago. What was the first problem you wanted to fix?"],
  ["b", "Meetings. Nobody could ever find the one decision that mattered. So we began by writing every decision down."],
  ["a", "And did it work?"],
  ["b", "Slowly. The real change came when we made decisions searchable. People stopped asking and started reading."],
  ["a", "What would you tell a team starting out?"],
  ["b", "Write it down, keep it short, and date everything. Future you will be grateful."],
];

function build() {
  const words: Word[] = [];
  let t = 0.4;
  for (const [speaker, line] of SCRIPT) {
    for (const text of line.split(" ")) {
      const d = 0.22 + Math.min(text.length, 9) * 0.03;
      words.push({ text, start: +t.toFixed(2), end: +(t + d).toFixed(2), speaker });
      t += d + (/[.?!]$/.test(text) ? 0.55 : /,$/.test(text) ? 0.25 : 0.06);
    }
    t += 0.35;
  }
  return words;
}

/** A soft tone per word, pitched by speaker, laid out on the same timeline: audible proof that the highlight follows real playback. */
function wav(words: Word[]) {
  const rate = 8000, total = Math.ceil((words[words.length - 1].end + 0.5) * rate);
  const pcm = new Int16Array(total);
  for (const w of words) {
    const f = w.speaker === "a" ? 196 : 262, a = Math.floor(w.start * rate), n = Math.floor((w.end - w.start) * rate);
    for (let i = 0; i < n && a + i < total; i++) {
      const env = Math.sin((Math.PI * i) / n);
      pcm[a + i] = Math.round(Math.sin((2 * Math.PI * f * i) / rate) * env * 3500);
    }
  }
  const buf = new ArrayBuffer(44 + pcm.length * 2), v = new DataView(buf);
  const s = (o: number, x: string) => [...x].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
  s(0, "RIFF"); v.setUint32(4, 36 + pcm.length * 2, true); s(8, "WAVEfmt "); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
  v.setUint32(24, rate, true); v.setUint32(28, rate * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true); s(36, "data"); v.setUint32(40, pcm.length * 2, true);
  new Int16Array(buf, 44).set(pcm);
  return new Blob([buf], { type: "audio/wav" });
}

export default function Demo({ variant = "light" }: { variant?: string }) {
  const dark = variant === "dark";
  const words = useMemo(build, []);
  // Chapters start where their first sentence does, so they always match the timing.
  const chapters = useMemo(() => {
    const at = (w: string) => words.find((x) => x.text === w && x.speaker)!.start;
    return [{ title: "Welcome", start: 0 }, { title: "The first problem", start: at("You") }, { title: "Advice", start: words.filter((x) => x.text === "What")[1].start }];
  }, [words]);
  const [src, setSrc] = useState<string>();
  useEffect(() => { const u = URL.createObjectURL(wav(words)); setSrc(u); return () => URL.revokeObjectURL(u); }, [words]);
  return (
    <div className={`min-h-full w-full px-4 py-8 ${dark ? "bg-[#0d0c08]" : "bg-[#e9e4d9]"}`}>
      <div className="mx-auto w-full max-w-[46rem]">
        <TranscriptPlayer title="Field Notes: building Qalam" src={src} words={words} chapters={chapters} speakers={{ a: "Host", b: "Salma" }} theme={dark ? "dark" : "light"} />
        <p className={`mt-3 text-center text-xs ${dark ? "text-[#a39b8f]" : "text-[#77716a]"}`}>The audio here is a synthetic tone per word, generated in the browser. The component plays any audio URL.</p>
      </div>
    </div>
  );
}
