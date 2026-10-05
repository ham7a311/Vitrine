import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "strength-ring-sign-up",
  name: "Strength Ring Sign-up",
  category: "auth",
  description: "A sign-up form whose password border is the strength meter: a gradient line draws round the field as the password improves, closes the loop and floods the edge with light when every rule is met, while the rules tick off below.",
  tags: ["auth", "sign up", "register", "password", "strength", "form", "validation"],
  traits: ["keyboard", "click"],
  source: "original",
  files: ["StrengthRingSignUp.tsx", "strength-ring-sign-up.css"],
  dependencies: [],
  prompt: `Build a create-account card (25rem): name, work email and password, a submit button and a sign-in link.

The password field has no ordinary border. Measure it with a ResizeObserver and draw an SVG rounded-rect outline (14px radius) that starts just after the top-left corner and runs clockwise: a hairline track, and over it the same path with pathLength=1, a userSpace linear gradient stroke (blue → violet → amber) and stroke-dashoffset: 1 − p. p comes from the rules — at least 12 characters, a number, mixed case or a symbol, and not containing your name or email's local part — weighted 78% on rules met and 22% on length (capped below 1 until every rule is met), so the line keeps moving as you type and only closes when the password is actually good. Transition the offset with a slight overshoot (620ms). The stroke's opacity rises with the level, so a weak password draws a faint line.

When every rule is met, a gradient layer under the input flashes to 26% with a spreading halo, then settles to a 7% tint (1.4s) — the ring 'floods' its edge. A mono label above the field reads Too short / Weak / Fair / Good / Strong (aria-live polite), coloured at the ends.

Below, the rules are a two-column list; each has a circle that fills green as a white check draws itself in (pathLength dash). The input is aria-describedby the list, and each rule carries a hidden ', done' / ', not yet'. Show/hide is an aria-pressed eye button. Submit validates in order and shows one role=alert error in plain language; success replaces the form with a drawn check and 'We sent a link to …'. Paper and Night.`,
  interaction: "Type a password and watch the ring draw round the field; meet every rule to close and flood it. Show/hide with the eye.",
  animation: "Ring 620ms with overshoot; flood 1.4s once on reaching Strong; rule checks draw in 380ms; success check draws in 700ms.",
  a11y: "Real labels and autocomplete (name, email, new-password). The strength word is a polite live region, the rules are linked with aria-describedby and say whether each is met, and errors use role=alert with aria-invalid on the field. The eye is a pressed toggle. Reduced motion jumps the ring and drops the flood flash.",
  responsive: "Up to 25rem; rules fall to one column under 420px. The ring is remeasured on resize.",
  touchFallback: "Identical on touch.",
  variants: [
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --srs-bg #fffdf8; --srs-btn #1b1a17; --srs-btn-ink #fffdf8; --srs-err #b4372a; --srs-field #f7f4ee; --srs-focus #2f5fd0; --srs-g1 #2f5fd0; --srs-g2 #7c5cc4; --srs-g3 #d9733a; --srs-ink #1b1a17; --srs-muted #6f6a62; --srs-ok #1f7a4d; --srs-rim rgb(27 26 23 / 0.1); --srs-track rgb(27 26 23 / 0.14). Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --srs-bg #141217; --srs-btn #efe8dc; --srs-btn-ink #141217; --srs-err #f08a7a; --srs-field #1b191f; --srs-focus #b9cce4; --srs-g1 #b9cce4; --srs-g2 #c8b9ea; --srs-g3 #f0b37a; --srs-ink #efe8dc; --srs-muted #9c96a1; --srs-ok #7fd1a8; --srs-rim rgb(239 232 220 / 0.1); --srs-track rgb(239 232 220 / 0.14). Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#f3f1ec", mode: "fill" },
};
