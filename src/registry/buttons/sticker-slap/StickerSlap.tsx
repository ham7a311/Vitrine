"use client";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { ART } from "./art";
import { KINDS, layout, seeded, type Kind } from "./layout";
import { nearest } from "./perimeter";
import "./sticker-slap.css";

export type Finish = "glossy" | "holo" | "kraft";

export type StickerSlapProps = {
  children: ReactNode;
  finish?: Finish;
  /** Button colours. */
  tone?: { face: string; label: string };
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit";
  className?: string;
};

const PAD = 30;
let uid = 0;

function sticker(kind: Kind, size: number) {
  const id = `sslap${++uid}`;
  const { cut, art } = ART[kind];
  const el = document.createElement("span");
  el.className = `sslap__sticker sslap__sticker--${kind}`;
  el.setAttribute("aria-hidden", "true");
  el.style.width = el.style.height = `${size}px`;
  el.innerHTML = `<svg viewBox="-3 -3 46 46" width="100%" height="100%"><defs><clipPath id="${id}c"><path d="${cut}"/></clipPath></defs>`
    + `<path class="k-die" d="${cut}"/>${art}`
    + `<g clip-path="url(#${id}c)"><rect class="k-gloss" x="-40" y="-6" width="18" height="60" transform="rotate(24 20 20)"/></g></svg>`;
  return el;
}

/**
 * Sticker Slap
 * Point at the button and a handful of die-cut stickers get slapped round its edge — a star, a
 * bolt, a heart, a NEW badge — each landing with a squash and a shadow that settles, nearest your
 * pointer first. Every hover brings a different set; pressing slaps one on the face. Leave and
 * they peel away.
 */
export function StickerSlap({ children, finish = "glossy", tone = { face: "#18181d", label: "#f7f7f9" }, onClick, type = "button", className = "" }: StickerSlapProps) {
  const btn = useRef<HTMLButtonElement>(null);
  const layer = useRef<HTMLSpanElement>(null);
  const hovers = useRef(0);
  const calm = useRef(false);
  useEffect(() => { calm.current = matchMedia("(prefers-reduced-motion: reduce)").matches; }, []);

  const slap = (el: HTMLElement, x: number, y: number, tilt: number, delay: number) => {
    Object.assign(el.style, { left: `${x}px`, top: `${y}px` });
    const at = `translate(-50%, -50%) rotate(${tilt}deg)`;
    layer.current?.appendChild(el);
    if (calm.current) { el.animate([{ opacity: 0, transform: at }, { opacity: 1, transform: at }], { duration: 260, delay, fill: "both" }); return; }
    el.animate([
      { transform: `${at} translateY(-16px) rotate(16deg) scale(1.55)`, opacity: 0, filter: "drop-shadow(0 14px 10px rgb(0 0 0 / 0.25))" },
      { transform: `${at} scale(1.08, 0.9)`, opacity: 1, filter: "drop-shadow(0 1px 1px rgb(0 0 0 / 0.35))", offset: 0.55 },
      { transform: `${at} scale(0.97, 1.03)`, offset: 0.78 },
      { transform: `${at} scale(1)`, opacity: 1, filter: "drop-shadow(0 1.5px 1.5px rgb(0 0 0 / 0.28))" },
    ], { duration: 340, delay, easing: "cubic-bezier(0.2, 0.7, 0.2, 1)", fill: "both" });
  };

  const peel = () => {
    const all = [...(layer.current?.children ?? []), ...(btn.current?.querySelectorAll(".sslap__sticker") ?? [])] as HTMLElement[];
    all.forEach((el, i) => {
      if (el.dataset.gone) return;
      el.dataset.gone = "";
      el.getAnimations().forEach((a) => a.commitStyles?.());
      el.getAnimations().forEach((a) => a.cancel());
      const base = el.style.transform || "translate(-50%, -50%)";
      const corner = i % 2 ? "100% 0%" : "0% 0%";
      el.style.transformOrigin = corner;
      const out = calm.current
        ? el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, fill: "forwards" })
        : el.animate([
          { transform: `${base}`, opacity: 1 },
          { transform: `${base} perspective(120px) rotateX(-38deg) rotateY(${i % 2 ? -28 : 28}deg) translateY(-6px)`, opacity: 1, offset: 0.45 },
          { transform: `${base} perspective(120px) rotateX(-70deg) rotateY(${i % 2 ? -40 : 40}deg) translateY(-26px) scale(0.9)`, opacity: 0 },
        ], { duration: 360, delay: i * 40, easing: "cubic-bezier(0.4, 0, 0.6, 1)", fill: "forwards" });
      out.onfinish = () => el.remove();
    });
  };

  const show = (x: number, y: number) => {
    const b = btn.current!, w = b.offsetWidth, h = b.offsetHeight;
    peel();
    hovers.current += 1;
    const s0 = nearest(w, h, h / 2, x, y);
    for (const p of layout(hovers.current, w, h, h / 2, s0)) slap(sticker(p.kind, p.size), p.x + PAD, p.y + PAD, p.tilt, p.delay);
  };

  const local = (e: React.PointerEvent<HTMLButtonElement>) => { const r = e.currentTarget.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };

  return (
    <span className={`sslap sslap--${finish} ${className}`} style={{ ["--ss-face" as string]: tone.face, ["--ss-label" as string]: tone.label, ["--ss-pad" as string]: `${PAD}px` } as CSSProperties}>
      <button ref={btn} type={type} className="sslap__btn" onClick={onClick}
        onPointerEnter={(e) => { if (e.pointerType === "mouse") { const p = local(e); show(p.x, p.y); } }}
        onPointerLeave={(e) => { if (e.pointerType === "mouse") peel(); }}
        onPointerDown={(e) => {
          const p = local(e);
          if (e.pointerType !== "mouse") { show(p.x, p.y); window.setTimeout(peel, 2400); }
          // one more, right where you pressed
          const rand = seeded(hovers.current * 31 + Math.round(p.x));
          const el = sticker(KINDS[Math.floor(rand() * KINDS.length)], 30);
          el.classList.add("sslap__sticker--face");
          btn.current?.appendChild(el);
          const at = `translate(-50%, -50%) rotate(${Math.round((rand() - 0.5) * 30)}deg)`;
          Object.assign(el.style, { left: `${p.x}px`, top: `${p.y}px`, transform: at });
          if (!calm.current) el.animate([{ transform: `${at} scale(1.7)`, opacity: 0 }, { transform: `${at} scale(0.92)`, opacity: 1, offset: 0.6 }, { transform: `${at} scale(1)`, opacity: 1 }], { duration: 260, easing: "ease-out" });
        }}
        onFocus={(e) => { if (e.currentTarget.matches(":focus-visible")) show(e.currentTarget.offsetWidth / 2, 0); }}
        onBlur={peel}>
        <span className="sslap__label">{children}</span>
      </button>
      <span ref={layer} className="sslap__wall" aria-hidden="true" />
    </span>
  );
}

export default StickerSlap;
