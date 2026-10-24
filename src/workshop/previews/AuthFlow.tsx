"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { MonoSignIn } from "@/registry/auth/mono-sign-in/MonoSignIn";
import { HandleSignUp } from "@/registry/auth/handle-sign-up/HandleSignUp";
import { EnvelopeReset } from "@/registry/auth/envelope-reset/EnvelopeReset";
import { CodeCascadeVerify } from "@/registry/auth/code-cascade-verify/CodeCascadeVerify";
import { AccountChooser, type Account } from "@/registry/auth/account-chooser/AccountChooser";

/* Five components, one product: each takes Falaj's palette through its own tokens, and Geist throughout. */
const TOKENS = `
.falaj :is(.msign, .hsign, .er, .ccv, .ac) { font-family: Geist, ui-sans-serif, system-ui, sans-serif; }
.falaj .ac--paper { --ac-card: #ffffff; --ac-ink: #14201d; --ac-muted: #56625e; --ac-line: rgb(20 32 29 / 0.12); --ac-hover: rgb(20 32 29 / 0.04); --ac-accent: #0e6b5e; --ac-err: #b3261e; }
.falaj .msign--paper { --ms-page: #f4f2ec; --ms-ink: #14201d; --ms-muted: #56625e; --ms-line: rgb(20 32 29 / 0.16); --ms-hover: rgb(20 32 29 / 0.05); --ms-slab: #0f3b35; --ms-slab-ink: #e8f1ed; --ms-error: #b3261e; }
.falaj .hsign--paper { --hs-page: #f4f2ec; --hs-card: #ffffff; --hs-field: #f8f7f2; --hs-line: rgb(20 32 29 / 0.13); --hs-ink: #14201d; --hs-muted: #56625e; --hs-accent: #14201d; --hs-on-accent: #ffffff; --hs-good: #0e6b5e; --hs-bad: #b3261e; background: var(--hs-page); }
.falaj .er--paper { --er-card: #ffffff; --er-ink: #14201d; --er-muted: #56625e; --er-line: rgb(20 32 29 / 0.13); --er-accent: #0e6b5e; --er-ok: #0e6b5e; --er-err: #b3261e; --er-env: #d9e4df; --er-env-front: #e3ebe7; --er-env-flap: #cddad4; --er-wax: #0e6b5e; }
.falaj .ccv--paper { --ccv-bg: #ffffff; --ccv-rim: rgb(20 32 29 / 0.1); --ccv-ink: #14201d; --ccv-muted: #56625e; --ccv-cell: #f8f7f2; --ccv-line: rgb(20 32 29 / 0.16); --ccv-accent: #0e6b5e; --ccv-ok: #0e6b5e; --ccv-err: #b3261e; --ccv-focus: #0e6b5e; box-shadow: inset 0 0 0 1px var(--ccv-rim), 0 24px 48px -36px rgb(15 59 53 / 0.45); }
`;

/* Returning people first: most visits to an account screen are someone coming back. */
const SCREENS = [
  { id: "accounts", label: "Welcome back", group: "Returning" },
  { id: "sign-in", label: "Sign in", group: "Returning" },
  { id: "reset", label: "Reset", group: "Returning" },
  { id: "sign-up", label: "Sign up", group: "New" },
  { id: "verify", label: "Verify", group: "New" },
] as const;
type Screen = (typeof SCREENS)[number]["id"];

const CODE = "204816";
const ACCOUNTS: Account[] = [
  { id: "a", name: "Aisha Al-Harthy", email: "aisha@nizwa-labs.com", last: "Today", hue: 168 },
  { id: "o", name: "Omar Nasser", email: "omar@harbourline.co", last: "4 days ago", hue: 28 },
];
const TAKEN = ["aisha", "aisha_harthy", "admin", "falaj"];
const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/** The page the card-sized screens sit on: Falaj's wordmark, the card centred. */
function Frame({ children, note }: { children: ReactNode; note?: string }) {
  return (
    <div className="relative flex min-h-full flex-col items-center justify-center gap-5 bg-[#f4f2ec] px-4 pb-12 pt-20">
      <Wordmark />
      {children}
      {note && <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[#56625e]">{note}</p>}
    </div>
  );
}

const Wordmark = () => (
  <p className="absolute left-5 top-5 m-0 text-[1.375rem] font-semibold tracking-[-0.045em] text-[#14201d] sm:left-8 sm:top-7" style={{ fontFamily: "Geist, ui-sans-serif, system-ui" }}>
    falaj<span className="text-[#0e6b5e]">.</span>
  </p>
);

export default function AuthFlow() {
  const [screen, setScreen] = useState<Screen>("accounts");
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const panel = useRef<HTMLDivElement>(null);

  // In-screen links ("Create an account", "Forgot password?") are plain hash links; follow them here.
  useEffect(() => {
    const read = (focus: boolean) => {
      const id = location.hash.slice(1);
      if (!SCREENS.some((s) => s.id === id)) return;
      setScreen(id as Screen);
      if (focus) requestAnimationFrame(() => panel.current?.focus({ preventScroll: true }));
    };
    read(false);
    const onHash = () => read(true);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const show = (id: Screen) => {
    setScreen(id);
    history.replaceState(null, "", `#${id}`);
    panel.current?.scrollTo({ top: 0 });
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = SCREENS.findIndex((s) => s.id === screen);
    const to = e.key === "ArrowRight" ? (i + 1) % SCREENS.length : e.key === "ArrowLeft" ? (i - 1 + SCREENS.length) % SCREENS.length : e.key === "Home" ? 0 : e.key === "End" ? SCREENS.length - 1 : -1;
    if (to < 0) return;
    e.preventDefault();
    show(SCREENS[to].id);
    tabs.current[to]?.focus();
  };

  return (
    <div className="falaj flex h-full w-full flex-col bg-[#f4f2ec]">
      <style>{TOKENS}</style>

      {/* Preview chrome, not part of the product: jumps between the four screens. */}
      <div className="flex h-11 flex-none items-center gap-4 bg-[#121413] px-3 font-mono text-[11px] uppercase tracking-[0.08em] text-white/60 sm:px-5">
        <span className="hidden whitespace-nowrap sm:inline">Account flow</span>
        <div role="tablist" aria-label="Account flow screens" className="flex min-w-0 flex-1 gap-1 overflow-x-auto sm:flex-none" onKeyDown={onKey}>
          {SCREENS.map((s, i) => {
            const on = s.id === screen;
            const first = i === 0 || SCREENS[i - 1].group !== s.group;
            return (
              <span key={s.id} className="flex flex-none items-center gap-1">
                {first && (
                  <span aria-hidden="true" className={`hidden pl-1 pr-1.5 text-[10px] tracking-[0.12em] text-white/35 sm:inline ${i ? "ml-2 border-l border-white/15 pl-3" : ""}`}>
                    {s.group}
                  </span>
                )}
              <button
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                id={`af-tab-${s.id}`}
                type="button"
                role="tab"
                aria-label={`${s.label} (${s.group.toLowerCase()})`}
                aria-selected={on}
                aria-controls="af-panel"
                tabIndex={on ? 0 : -1}
                onClick={() => show(s.id)}
                className={`flex h-8 flex-none items-center gap-1.5 rounded-md px-2.5 uppercase tracking-[0.08em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-white/70 ${on ? "bg-white/[0.12] text-white" : "hover:text-white/90"}`}
              >
                <span className="text-white/40">{String(i + 1).padStart(2, "0")}</span>
                {s.label}
              </button>
              </span>
            );
          })}
        </div>
      </div>

      <div ref={panel} id="af-panel" role="tabpanel" aria-labelledby={`af-tab-${screen}`} tabIndex={-1} className="min-h-0 flex-1 overflow-y-auto outline-none">
        {screen === "accounts" && (
          <Frame>
            <AccountChooser theme="paper" product="Falaj" accounts={ACCOUNTS} onSignIn={() => wait(900)} />
          </Frame>
        )}
        {screen === "sign-in" && (
          <MonoSignIn
            theme="paper"
            brand="falaj"
            tagline="Async stand-ups for teams across time zones. Post when your day starts; read the team's when yours does."
            lastUsed="google"
            signUpHref="#sign-up"
            forgotHref="#reset"
            onProvider={() => wait(1200)}
            onSignIn={async (_, password) => {
              await wait(900);
              if (password.length < 10) throw new Error("wrong");
            }}
          />
        )}
        {screen === "sign-up" && (
          <div className="relative min-h-full pt-14 sm:pt-0">
            <Wordmark />
            <HandleSignUp
              theme="paper"
              brand="Falaj"
              onStart={async (how) => {
                await wait(900);
                return "provider" in how ? { name: "Aisha Al-Harthy", via: how.provider } : { name: "" };
              }}
              checkHandle={async (h) => {
                await wait(450);
                return !TAKEN.includes(h);
              }}
              onFinish={() => wait(700)}
              homeHref="#feed"
            />
          </div>
        )}
        {screen === "reset" && (
          <Frame>
            <EnvelopeReset theme="paper" product="Falaj" exampleEmail="aisha@nizwa-labs.com" onSend={() => wait(700)} onReset={() => wait(800)} />
          </Frame>
        )}
        {screen === "verify" && (
          <Frame note={`Preview · the code is ${CODE}`}>
            <CodeCascadeVerify theme="paper" product="Falaj" sentTo="a•••@nizwa-labs.com" changeEmailHref="#sign-up" verify={async (code) => (await wait(700), code === CODE)} onResend={() => wait(500)} />
          </Frame>
        )}
      </div>
    </div>
  );
}
