"use client";
import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import "./card-wallet.css";

export type WalletCard = {
  id: string;
  nickname: string;
  holder: string;
  last4: string;
  expires: string;
  /** Face colour. */
  color: "graphite" | "ink" | "plum" | "moss" | "sand";
  /** Monthly limit and spend so far, in minor units. */
  limit: number;
  spent: number;
  frozen?: boolean;
};
export type CardSecrets = { number: string; cvc: string };
export type CardWalletProps = {
  cards: WalletCard[];
  /** Fetch the full number and CVC from your server, after any step-up check. */
  reveal: (id: string) => Promise<CardSecrets>;
  /** Persist a freeze change; reject to roll it back. */
  onFreeze: (id: string, frozen: boolean) => Promise<void>;
  currency?: string;
  locale?: string;
  /** Seconds before revealed details hide again. */
  revealFor?: number;
  theme?: "dark" | "light";
  className?: string;
};

const groups = (n: string) => n.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim();

/**
 * Card Wallet
 * Virtual cards as a small physical stack: the chosen card sits in front,
 * the rest peek behind it. Its details stay masked until asked for, then
 * hide themselves again on a visible countdown; a frozen card is hatched.
 */
export function CardWallet({ cards, reveal, onFreeze, currency = "USD", locale, revealFor = 30, theme = "dark", className = "" }: CardWalletProps) {
  const id = useId();
  const [selected, setSelected] = useState(cards[0]?.id);
  const [frozen, setFrozen] = useState<Record<string, boolean>>(() => Object.fromEntries(cards.map((c) => [c.id, !!c.frozen])));
  const [freezeBusy, setFreezeBusy] = useState(false);
  const [freezeError, setFreezeError] = useState("");
  const [secrets, setSecrets] = useState<{ id: string; data: CardSecrets; until: number } | null>(null);
  const [revealing, setRevealing] = useState(false);
  const [revealError, setRevealError] = useState("");
  const [left, setLeft] = useState(0);
  const [copied, setCopied] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const money = new Intl.NumberFormat(locale, { style: "currency", currency });
  const card = cards.find((c) => c.id === selected) ?? cards[0];
  const order = [card, ...cards.filter((c) => c.id !== card.id)];

  // The countdown that hides revealed details again.
  useEffect(() => {
    if (!secrets) return;
    const tick = () => {
      const remaining = Math.max(0, Math.ceil((secrets.until - Date.now()) / 1000));
      setLeft(remaining);
      if (!remaining) setSecrets(null);
    };
    tick();
    const t = setInterval(tick, 250);
    return () => clearInterval(t);
  }, [secrets]);
  useEffect(() => { setSecrets(null); setRevealError(""); setFreezeError(""); }, [selected]);
  useEffect(() => () => clearTimeout(timer.current), []);

  const doReveal = async () => {
    if (revealing) return;
    setRevealing(true); setRevealError("");
    const target = card.id;
    try {
      const data = await reveal(target);
      setSecrets({ id: target, data, until: Date.now() + revealFor * 1000 });
    } catch { setRevealError("The card details couldn't be shown. Try again."); }
    finally { setRevealing(false); }
  };
  const toggleFreeze = async () => {
    if (freezeBusy) return;
    const target = card.id, next = !frozen[target];
    setFrozen((f) => ({ ...f, [target]: next }));
    setFreezeBusy(true); setFreezeError("");
    try { await onFreeze(target, next); }
    catch { setFrozen((f) => ({ ...f, [target]: !next })); setFreezeError(next ? "The card couldn't be frozen. It's still active." : "The card couldn't be unfrozen. It's still frozen."); }
    finally { setFreezeBusy(false); }
  };
  const copy = async (label: string, value: string) => {
    clearTimeout(timer.current);
    try { await navigator.clipboard.writeText(value); setCopied(label); }
    catch { setCopied(`fail:${label}`); }
    timer.current = setTimeout(() => setCopied(""), 1800);
  };

  const shown = secrets?.id === card.id ? secrets.data : null;
  const isFrozen = frozen[card.id];
  const used = Math.min(1, card.spent / Math.max(1, card.limit));

  return (
    <div className={`cwal cwal--${theme} ${className}`}>
      <div className="cwal__grid">
      <div className="cwal__stage">
        <div className="cwal__deck" aria-hidden="true">
          {/* DOM order stays fixed so faces transition between depths instead of being re-inserted. */}
          {cards.map((c) => { const depth = order.indexOf(c); return (
            <div key={c.id} className="cwal__face" data-color={c.color} data-frozen={frozen[c.id] || undefined} data-hidden={depth > 3 || undefined} style={{ "--depth": Math.min(depth, 3), zIndex: cards.length - depth } as CSSProperties} onClick={depth > 0 ? () => setSelected(c.id) : undefined}>
              <span className="cwal__face-top"><span className="cwal__face-name">{c.nickname}</span><span className="cwal__face-kind">Virtual</span></span>
              <span className="cwal__chip" />
              <span className="cwal__face-bottom">
                <span className="cwal__face-num">{depth === 0 && shown ? groups(shown.number) : `•••• ${c.last4}`}</span>
                <span className="cwal__face-exp">{c.expires}</span>
              </span>
              {frozen[c.id] && <span className="cwal__frozen">Frozen</span>}
            </div>
          ); })}
        </div>

        <fieldset className="cwal__list">
          <legend className="cwal__sr">Choose a card</legend>
          {cards.map((c) => (
            <label key={c.id} className="cwal__option" data-checked={c.id === card.id || undefined}>
              <input type="radio" name={`${id}-card`} value={c.id} checked={c.id === card.id} onChange={() => setSelected(c.id)} />
              <span className="cwal__swatch" data-color={c.color} aria-hidden="true" />
              <span className="cwal__option-name">{c.nickname}<span className="cwal__option-sub">•••• {c.last4}{frozen[c.id] ? " · Frozen" : ""}</span></span>
              <span className="cwal__option-spent">{money.format(c.spent / 100)}</span>
            </label>
          ))}
        </fieldset>
      </div>

      <section className="cwal__details" aria-labelledby={`${id}-name`}>
        <header className="cwal__details-head">
          <h3 id={`${id}-name`} className="cwal__name">{card.nickname}</h3>
          <p className="cwal__holder">{card.holder}</p>
        </header>

        <div className="cwal__spend">
          <p><span className="cwal__amount">{money.format(card.spent / 100)}</span> of {money.format(card.limit / 100)} this month</p>
          <div className="cwal__meter" role="meter" aria-label="Monthly spend" aria-valuemin={0} aria-valuemax={card.limit / 100} aria-valuenow={card.spent / 100} aria-valuetext={`${money.format(card.spent / 100)} of ${money.format(card.limit / 100)}`}>
            <span style={{ "--used": used } as CSSProperties} data-high={used > 0.85 || undefined} />
          </div>
        </div>

        <dl className="cwal__secrets" data-shown={!!shown || undefined}>
          <div className="cwal__secret cwal__secret--wide">
            <dt>Card number</dt>
            <dd>
              <span className="cwal__mono">{shown ? groups(shown.number) : `•••• •••• •••• ${card.last4}`}</span>
              {shown && <button type="button" className="cwal__copy" onClick={() => copy("number", shown.number.replace(/\D/g, ""))}>{copied === "number" ? "Copied" : copied === "fail:number" ? "Copy failed" : "Copy"}</button>}
            </dd>
          </div>
          <div className="cwal__secret">
            <dt>Expires</dt>
            <dd><span className="cwal__mono">{card.expires}</span>{shown && <button type="button" className="cwal__copy" onClick={() => copy("exp", card.expires)}>{copied === "exp" ? "Copied" : copied === "fail:exp" ? "Copy failed" : "Copy"}</button>}</dd>
          </div>
          <div className="cwal__secret">
            <dt>CVC</dt>
            <dd><span className="cwal__mono">{shown ? shown.cvc : "•••"}</span>{shown && <button type="button" className="cwal__copy" onClick={() => copy("cvc", shown.cvc)}>{copied === "cvc" ? "Copied" : copied === "fail:cvc" ? "Copy failed" : "Copy"}</button>}</dd>
          </div>
        </dl>

        <div className="cwal__row">
          {shown ? (
            <button type="button" className="cwal__btn" onClick={() => setSecrets(null)}>
              <svg className="cwal__ring" viewBox="0 0 20 20" aria-hidden="true" style={{ "--p": left / revealFor } as CSSProperties}><circle cx="10" cy="10" r="8" /><circle cx="10" cy="10" r="8" /></svg>
              Hide details<span className="cwal__sr"> (hiding automatically in {left} seconds)</span>
            </button>
          ) : (
            <button type="button" className="cwal__btn" onClick={doReveal} disabled={revealing || isFrozen}>
              {revealing ? "Checking…" : "Show details"}
            </button>
          )}
          <button type="button" role="switch" aria-checked={isFrozen} className="cwal__switch" onClick={toggleFreeze} disabled={freezeBusy}>
            <span className="cwal__track" aria-hidden="true"><span /></span>
            {isFrozen ? "Frozen" : "Freeze card"}
          </button>
        </div>
        <p className="cwal__note" role="status">{revealError || freezeError || (shown ? `Details hide in ${left}s.` : isFrozen ? "Frozen cards decline every purchase until unfrozen." : "")}</p>
      </section>
      </div>
    </div>
  );
}
