"use client";
import { useEffect, useRef, useState } from "react";
import { hex, runShader } from "./gl";
import { tilt } from "./tilt";
import "./marble-invite.css";

/**
 * Marble Invite
 * An invitation card on slowly folding liquid marble. The marble leans away from the pointer
 * and the card tilts towards it; the send button folds into a paper plane that flies off, and
 * the card says it's sent only when the host confirms.
 */
const FRAG = `precision highp float;
uniform vec2 uRes; uniform float uTime; uniform vec2 uMouse; uniform float uPress;
uniform vec3 uDeep; uniform vec3 uMid; uniform vec3 uLight;
float h1(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h1(i), h1(i + vec2(1, 0)), f.x), mix(h1(i + vec2(0, 1)), h1(i + vec2(1, 1)), f.x), f.y); }
float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int i = 0; i < 4; i++){ v += a * vn(p); p = p * 1.97 + 1.3; a *= 0.47; } return v; }
void main(){
  vec2 p = gl_FragCoord.xy / uRes.y * 1.25;
  p += (uMouse - 0.5) * 0.25 * uPress;
  float t = uTime * 0.05;
  vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, 1.3) - t * 0.8));
  vec2 r = vec2(fbm(p + 3.4 * q + vec2(1.7, 9.2) + t * 0.5), fbm(p + 3.4 * q + vec2(8.3, 2.8) - t * 0.4));
  float v = fbm(p + 3.0 * r);
  vec3 col = mix(uDeep, uMid, smoothstep(0.12, 0.52, v));
  col = mix(col, uLight, smoothstep(0.58, 0.88, v) * 0.75);
  float vein = (1.0 - smoothstep(0.004, 0.04, abs(r.x - 0.56))) * smoothstep(0.25, 0.6, v);
  col = mix(col, uDeep * 0.7, vein * 0.9);
  vec2 uv = gl_FragCoord.xy / uRes;
  // darker at the foot so the date reads
  col *= 0.8 + 0.24 * smoothstep(0.0, 0.6, uv.y);
  gl_FragColor = vec4(col, 1.0);
}`;

export type InvitePalette = { deep: string; mid: string; light: string };

export type MarbleInviteProps = {
  eyebrow?: string;
  title: string;
  date: string;
  detail?: string;
  palette?: InvitePalette;
  /** Called by the send button; resolve to confirm, reject to show it failed. */
  onSend?: () => Promise<void>;
  motion?: "full" | "reduced";
  className?: string;
};

const DEFAULT: InvitePalette = { deep: "#071a4a", mid: "#2a63e0", light: "#a9c6ff" };

export function MarbleInvite({ eyebrow = "You're invited", title, date, detail, palette = DEFAULT, onSend, motion = "full", className = "" }: MarbleInviteProps) {
  const card = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  useEffect(() => {
    const el = card.current, cv = canvas.current;
    if (!el || !cv) return;
    return runShader(el, cv, {
      frag: FRAG, reduced: motion === "reduced", quality: 0.8, start: 24, follow: 0.05,
      uniforms: { uDeep: hex(palette.deep), uMid: hex(palette.mid), uLight: hex(palette.light) },
      onFail: () => setFailed(true),
    });
  }, [palette, motion]);

  // tilt towards the pointer
  useEffect(() => {
    const el = card.current;
    if (!el || motion === "reduced" || !matchMedia("(hover: hover) and (pointer: fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0, x = 0.5, y = 0.5;
    const paint = () => { frame = 0; const t = tilt(x, y); el.style.setProperty("--minv-rx", `${t.rx}deg`); el.style.setProperty("--minv-ry", `${t.ry}deg`); };
    const move = (e: PointerEvent) => { const r = el.getBoundingClientRect(); x = (e.clientX - r.left) / r.width; y = (e.clientY - r.top) / r.height; if (!frame) frame = requestAnimationFrame(paint); };
    const leave = () => { cancelAnimationFrame(frame); frame = 0; el.style.setProperty("--minv-rx", "0deg"); el.style.setProperty("--minv-ry", "0deg"); };
    el.addEventListener("pointermove", move); el.addEventListener("pointerleave", leave);
    return () => { cancelAnimationFrame(frame); el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); };
  }, [motion]);

  const send = async () => {
    if (state === "sending" || state === "sent") return;
    setState("sending");
    try { await (onSend?.() ?? Promise.resolve()); setState("sent"); }
    catch { setState("error"); }
  };

  const [line1, ...rest] = title.split("\n");
  return (
    <div className={`minv-stage ${className}`}>
      <article ref={card} className="minv" data-state={state} data-fallback={failed ? "" : undefined}
        style={{ ["--minv-deep" as string]: palette.deep, ["--minv-mid" as string]: palette.mid, ["--minv-light" as string]: palette.light }}>
        <canvas ref={canvas} className="minv__canvas" aria-hidden="true" />
        <p className="minv__eyebrow">{eyebrow}</p>
        <h2 className="minv__title">{line1}{rest.map((l) => <span key={l}><br />{l}</span>)}</h2>
        <div className="minv__foot">
          <div>
            <p className="minv__date">{date}</p>
            {detail && <p className="minv__detail">{detail}</p>}
          </div>
          <button type="button" className="minv__send" onClick={send} aria-label={state === "sent" ? "Invitation sent" : "Send invitation"} disabled={state === "sending"}>
            <svg className="minv__plane" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" aria-hidden="true"><path d="M21.5 2.5 10.6 13.4" /><path d="M21.5 2.5 14.6 21.5l-4-8.1-8.1-4Z" /></svg>
            <svg className="minv__tick" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
          </button>
        </div>
        <p className="minv__status" role="status">{state === "sent" ? "Sent." : state === "error" ? "Couldn't send. Try again." : ""}</p>
      </article>
    </div>
  );
}

export default MarbleInvite;
