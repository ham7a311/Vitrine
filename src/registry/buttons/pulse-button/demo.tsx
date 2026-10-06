"use client";
import { useEffect, useState } from "react";
import { PulseButton } from "./PulseButton";

const Play = () => <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M5 3.4v9.2a.6.6 0 0 0 .9.5l7.3-4.6a.6.6 0 0 0 0-1L5.9 2.9a.6.6 0 0 0-.9.5Z" /></svg>;

export default function Demo({ variant = "light" }: { variant?: string }) {
  const theme = variant === "dark" ? "dark" : "light";
  const [on, setOn] = useState(false);
  const [n, setN] = useState(2480);
  // The viewer count drifts, so the button has something live to say.
  useEffect(() => { const t = setInterval(() => setN((v) => v + Math.round(Math.random() * 14 - 4)), 1800); return () => clearInterval(t); }, []);
  return (
    <div className={`pulb-demo pulb-demo--${theme}`}>
      <PulseButton theme={theme} label={on ? "Watching" : "Watch live"} icon={<Play />} count={n} active={on} aria-pressed={on} onClick={() => setOn((v) => !v)} />
    </div>
  );
}
