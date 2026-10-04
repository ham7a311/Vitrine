"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import "./workspace-sign-in.css";

/**
 * Workspace Sign-in
 * Enterprise sign-in usually feels anonymous. Here, as soon as the workspace
 * name resolves, the panel becomes theirs: a monogram flips into the field,
 * the accent colour of the whole panel eases to the workspace's colour, and
 * the continue button names their identity provider. Unknown names say so and
 * offer to create a workspace.
 */

export type Workspace = { slug: string; name: string; color: string; members: number; sso: string };

type Props = { workspaces: Workspace[]; domain?: string; className?: string };

export function WorkspaceSignIn({ workspaces, domain = "vitrine.app", className = "" }: Props) {
  const [value, setValue] = useState("");
  const [settled, setSettled] = useState("");
  const [looking, setLooking] = useState(false);

  // a short "lookup" after typing stops
  useEffect(() => {
    if (!value) { setSettled(""); setLooking(false); return; }
    setLooking(true);
    const t = setTimeout(() => { setSettled(value.toLowerCase().trim()); setLooking(false); }, 450);
    return () => clearTimeout(t);
  }, [value]);

  const ws = useMemo(() => workspaces.find((w) => w.slug === settled), [workspaces, settled]);
  const state = !value ? "empty" : looking ? "looking" : ws ? "found" : "missing";

  return (
    <section className={`workspace-sign-in ${className}`} data-state={state} style={{ "--ws": ws?.color ?? "#b9cce4" } as CSSProperties}>
      <div className="workspace-sign-in__glow" aria-hidden="true" />
      <p className="workspace-sign-in__eyebrow">Single sign-on</p>
      <h2 className="workspace-sign-in__title">{ws ? <>Sign in to <em>{ws.name}</em></> : "Find your workspace"}</h2>

      <label className="workspace-sign-in__field">
        <span className="workspace-sign-in__mono" aria-hidden="true">
          <span key={ws?.slug ?? "none"}>{ws ? ws.name.charAt(0) : "·"}</span>
        </span>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value.replace(/[^a-zA-Z0-9-]/g, ""))}
          placeholder="your-company"
          aria-label="Workspace name"
          autoComplete="organization"
          spellCheck={false}
        />
        <span className="workspace-sign-in__suffix">.{domain}</span>
        <span className="workspace-sign-in__spin" aria-hidden="true" />
      </label>

      <p className="workspace-sign-in__status" aria-live="polite">
        {state === "found" && ws ? `${ws.members.toLocaleString("en-US")} members · signs in with ${ws.sso}` : state === "missing" ? "No workspace with that name." : state === "looking" ? "Looking it up…" : "Enter the name your team uses — e.g. “northstar”."}
      </p>

      <button type="button" className="workspace-sign-in__go" disabled={state !== "found"}>
        {ws ? `Continue with ${ws.sso}` : "Continue"}
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8h9M8.5 4l4 4-4 4" /></svg>
      </button>
      {state === "missing" && <a className="workspace-sign-in__create" href="#" onClick={(e) => e.preventDefault()}>Create “{value}” as a new workspace →</a>}
    </section>
  );
}
