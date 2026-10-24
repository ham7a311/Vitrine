"use client";
import { useEffect, useRef, useState } from "react";
import { ThemeStage, ThemeSwitch, useThemeShift, type Theme, type Transition } from "./ThemeShift";
import "./site.css";

const TRANSITIONS: Transition[] = ["bloom", "shatter", "ink", "peel", "blinds", "dissolve", "melt"];

/** Switches by itself every few seconds, from the switch, until the visitor touches the page. */
function Autoplay({ root }: { root: React.RefObject<HTMLDivElement | null> }) {
  const { theme, shift } = useThemeShift();
  const current = useRef(theme);
  current.current = theme;
  useEffect(() => {
    const el = root.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let on = true;
    const stop = (e: Event) => { if (e.isTrusted) on = false; };
    el.addEventListener("pointerdown", stop);
    el.addEventListener("keydown", stop);
    const go = () => {
      if (!on || document.hidden) return;
      const b = el.querySelector(".tsw-switch")?.getBoundingClientRect();
      shift(current.current === "dark" ? "light" : "dark", b && { x: b.left + b.width / 2, y: b.top + b.height / 2 });
    };
    const first = window.setTimeout(go, 1400), every = window.setInterval(go, 3400);
    return () => { clearTimeout(first); clearInterval(every); el.removeEventListener("pointerdown", stop); el.removeEventListener("keydown", stop); };
  }, [root, shift]);
  return null;
}

function Site() {
  return (
    <div className="nws">
      <div className="nws-wrap">
        <nav className="nws-nav" aria-label="Northwind Studio">
          <span className="nws-logo"><i aria-hidden="true" />Northwind</span>
          <div className="nws-links"><a href="#work">Work</a><a href="#studio">Studio</a><a href="#journal">Journal</a><a href="#contact">Contact</a></div>
          <ThemeSwitch />
        </nav>
        <header className="nws-hero">
          <div>
            <p className="nws-eyebrow"><b aria-hidden="true" />Independent design studio</p>
            <h1>Quiet tools for <em>loud</em> ideas.</h1>
            <p>We design and build product interfaces with a small team, a short list of clients and a long view of what good software feels like.</p>
            <div className="nws-actions"><button type="button" className="nws-btn nws-btn--primary">Start a project</button><button type="button" className="nws-btn">See our work</button></div>
          </div>
          <div className="nws-art" aria-hidden="true"><i /><i /><i /></div>
        </header>
        <section className="nws-cards" aria-label="What we do">
          <article className="nws-card"><div className="nws-vis nws-bars" aria-hidden="true">{[38, 56, 44, 70, 88, 62].map((h, i) => <span key={i} style={{ height: `${h}%` }} />)}</div><h3>Product strategy</h3><p>Find the one thing worth building first.</p></article>
          <article className="nws-card"><div className="nws-vis nws-dots" aria-hidden="true" /><h3>Interface design</h3><p>Systems that stay calm as they grow.</p></article>
          <article className="nws-card"><div className="nws-vis nws-wave" aria-hidden="true" /><h3>Engineering</h3><p>Shipped, measured and looked after.</p></article>
        </section>
        <div className="nws-stats"><div><b>120+</b><span>products launched</span></div><div><b>14 yrs</b><span>working together</span></div><div><b>98%</b><span>clients who return</span></div></div>
        <footer className="nws-foot"><span>Northwind Studio · Muscat</span><span>hello@northwind.studio</span></footer>
      </div>
    </div>
  );
}

export default function Demo({ variant = "bloom" }: { variant?: string }) {
  const transition = (TRANSITIONS.includes(variant as Transition) ? variant : "bloom") as Transition;
  const [theme, setTheme] = useState<Theme>("light");
  const root = useRef<HTMLDivElement>(null);
  return (
    <div ref={root} style={{ height: "100%", minHeight: 640 }}>
      <ThemeStage theme={theme} onThemeChange={setTheme} transition={transition} style={{ height: "100%" }}>
        <Site />
        <Autoplay root={root} />
      </ThemeStage>
    </div>
  );
}
