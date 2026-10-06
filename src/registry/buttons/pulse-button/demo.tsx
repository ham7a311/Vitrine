"use client";
import { useEffect, useState } from "react";
import { PulseButton } from "./PulseButton";

const Play = () => <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M5 3.4v9.2a.6.6 0 0 0 .9.5l7.3-4.6a.6.6 0 0 0 0-1L5.9 2.9a.6.6 0 0 0-.9.5Z" /></svg>;
const Inbox = () => <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true"><path d="M3 11.5 5 4.5h10l2 7v4H3Z" /><path d="M3 11.5h4l1 2h4l1-2h4" /></svg>;
const Arrow = () => <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" /></svg>;

function Live({ theme }: { theme: "light" | "dark" }) {
  const [on, setOn] = useState(false);
  const [n, setN] = useState(2480);
  useEffect(() => { const t = setInterval(() => setN((v) => v + Math.round(Math.random() * 14 - 4)), 1800); return () => clearInterval(t); }, []);
  return <PulseButton kind="live" theme={theme} label={on ? "Watching" : "Watch live"} icon={<Play />} count={n} active={on} aria-pressed={on} onClick={() => setOn((v) => !v)} />;
}

function Ping({ theme }: { theme: "light" | "dark" }) {
  const [n, setN] = useState(3);
  // A new message now and then, so the badge has something to say.
  useEffect(() => { const t = setInterval(() => setN((v) => (v >= 9 ? v : v + 1)), 5200); return () => clearInterval(t); }, []);
  return <PulseButton kind="ping" theme={theme} label="Inbox" icon={<Inbox />} count={n} onClick={() => setN(0)} aria-label={n ? `Inbox, ${n} unread` : "Inbox"} />;
}

export default function Demo({ variant = "live" }: { variant?: string }) {
  const panel = (theme: "light" | "dark") => (
    <div className={`pulb-demo__panel pulb-demo__panel--${theme}`}>
      {variant === "ping" ? <Ping theme={theme} /> : variant === "breathe" ? <PulseButton kind="breathe" theme={theme} label="Start building" icon={<Arrow />} /> : <Live theme={theme} />}
    </div>
  );
  return <div className="pulb-demo">{panel("light")}{panel("dark")}</div>;
}
