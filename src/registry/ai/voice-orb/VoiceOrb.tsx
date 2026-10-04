"use client";

import { useEffect, useRef, useState } from "react";
import "./voice-orb.css";

/**
 * Voice Orb
 * A voice conversation reduced to one object. Inside a sphere, three soft
 * clouds drift at different speeds; the conversation state changes how they
 * behave rather than swapping icons:
 *   listening → the sphere breathes with your voice level
 *   thinking  → the clouds gather and spin tighter
 *   speaking  → the sphere pulses with the reply's syllables
 * A single caption line under it says what is happening.
 */

type Phase = "idle" | "listening" | "thinking" | "speaking";

type Props = { theme?: "light" | "dark"; className?: string };

const REPLY = "Sure — Thursday works. I'll move the launch and let the team know.";

export function VoiceOrb({ theme = "light", className = "" }: Props) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [muted, setMuted] = useState(false);
  const [caption, setCaption] = useState("Tap to start talking");
  const orb = useRef<HTMLDivElement>(null);
  const raf = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // one level signal drives the orb; its character depends on the phase
  useEffect(() => {
    const el = orb.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let lv = 0;
    const tick = (now: number) => {
      raf.current = requestAnimationFrame(tick);
      let target = 0;
      if (phase === "listening" && !muted) target = Math.max(0, Math.sin(now / 110) * Math.sin(now / 47 + 1)) * (0.6 + 0.4 * Math.sin(now / 800));
      if (phase === "speaking") target = 0.35 + 0.65 * Math.max(0, Math.sin(now / 130)) * (0.6 + 0.4 * Math.sin(now / 520));
      lv += (target - lv) * 0.18;
      el.style.setProperty("--lv", (reduce ? 0 : lv).toFixed(3));
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [phase, muted]);

  const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  useEffect(() => clear, []);

  const start = () => {
    if (phase !== "idle") return;
    clear();
    setPhase("listening");
    setCaption("Listening…");
    timers.current.push(setTimeout(() => { setPhase("thinking"); setCaption("Can we move the launch to Thursday?"); }, 3200));
    timers.current.push(setTimeout(() => {
      setPhase("speaking");
      const words = REPLY.split(" ");
      words.forEach((_, i) => timers.current.push(setTimeout(() => setCaption(words.slice(0, i + 1).join(" ")), i * 190)));
    }, 4800));
    timers.current.push(setTimeout(() => setPhase("listening"), 4800 + REPLY.split(" ").length * 190 + 900));
  };
  const end = () => { clear(); setPhase("idle"); setCaption("Tap to start talking"); };

  return (
    <div className={`voice-orb voice-orb--${theme} ${className}`} data-phase={phase} data-muted={muted || undefined}>
      <button type="button" className="voice-orb__sphere-btn" onClick={start} aria-label={phase === "idle" ? "Start voice conversation" : `Voice conversation: ${phase}`}>
        <div ref={orb} className="voice-orb__sphere" aria-hidden="true">
          <span className="voice-orb__cloud voice-orb__cloud--a" />
          <span className="voice-orb__cloud voice-orb__cloud--b" />
          <span className="voice-orb__cloud voice-orb__cloud--c" />
          <span className="voice-orb__sheen" />
        </div>
      </button>

      <p className="voice-orb__caption" aria-live="polite">
        <span key={phase === "speaking" ? "speak" : caption}>{caption}</span>
      </p>

      <div className="voice-orb__controls">
        <button type="button" className="voice-orb__ctl" aria-pressed={muted} aria-label={muted ? "Unmute microphone" : "Mute microphone"} onClick={() => setMuted((m) => !m)} disabled={phase === "idle"}>
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <rect x="7.5" y="3" width="5" height="9" rx="2.5" />
            <path d="M4.5 9.5a5.5 5.5 0 0 0 11 0M10 15v2" />
            {muted && <path d="M3.5 3.5l13 13" />}
          </svg>
        </button>
        <button type="button" className="voice-orb__ctl voice-orb__ctl--end" aria-label="End conversation" onClick={end} disabled={phase === "idle"}>
          <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15" /></svg>
        </button>
      </div>
    </div>
  );
}
