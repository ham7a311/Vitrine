"use client";
import { useEffect, useState } from "react";
import { PingButton } from "./PingButton";

const Inbox = () => <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true"><path d="M3 11.5 5 4.5h10l2 7v4H3Z" /><path d="M3 11.5h4l1 2h4l1-2h4" /></svg>;

export default function Demo({ variant = "light" }: { variant?: string }) {
  const theme = variant === "dark" ? "dark" : "light";
  const [n, setN] = useState(3);
  // A new message now and then, so the badge has something to say.
  useEffect(() => { const t = setInterval(() => setN((v) => (v >= 9 ? v : v + 1)), 5200); return () => clearInterval(t); }, []);
  return (
    <div className={`pngb-demo pngb-demo--${theme}`}>
      <PingButton theme={theme} label="Inbox" icon={<Inbox />} count={n} onClick={() => setN(0)} aria-label={n ? `Inbox, ${n} unread` : "Inbox"} />
    </div>
  );
}
