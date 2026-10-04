import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "number-match-sign-in",
  name: "Number Match",
  category: "auth",
  description: "Two-step sign-in by number matching, with both screens in view. The laptop shows a number; the phone beside it lights up with the request and three numbers. Pick the right one and a pulse crosses from phone to screen and you're in; pick wrong and a fresh number is issued. The request expires on a ring.",
  tags: ["auth", "mfa", "2fa", "push", "number matching", "phone", "approve", "security"],
  traits: ["click", "keyboard"],
  source: "original",
  files: ["NumberMatchSignIn.tsx", "number-match-sign-in.css"],
  dependencies: [],
  prompt: `Build a number-matching push MFA screen with a live phone mock beside it.

Layout: a grid of the sign-in card, a short dotted "wire", and a phone (rounded bezel, glass with a gradient wallpaper, a dynamic island and a lock-screen clock). Under 760px it stacks with a vertical wire.

Card: "Approve on your phone", one line of instructions, and the two-digit number large in tabular figures inside a 120-unit SVG ring that runs down with the request's time to live (pathLength 1, dashoffset 1 − remaining, linear 1s steps). The number is announced politely and re-animates in (scale 0.7, blur 6px → crisp, slight overshoot) whenever it changes. Below: "Expires in 54s" and "Use another way to sign in".

Phone: about a second after a request is issued, a frosted notification (backdrop blur 18px) springs down with the app icon, "Are you trying to sign in?", the device and place, "Tap the number on your screen", three number buttons — one correct, two random, shuffled — and "No, it's not me". The phone is a labelled group, and its buttons are only tabbable while the request is open.

Outcomes: the correct number → the notification gives way to a green Approved check on the phone, a pulse runs twice along the wire from phone to screen (a gradient dash, 700ms), and the card shows "Signed in" with a drawn check and focus on the heading. A wrong number outlines it in red, turns the ring and message red ("That didn't match — here's a new number"), then issues a fresh number, choices and clock. "No, it's not me" or "Use another way" stops the attempt; the clock reaching zero gives "Request expired" with "Send a new request". Paper and Night.`,
  interaction: "Wait for the notification on the phone, then tap the number shown on the screen. Try a wrong number, or “No, it’s not me”.",
  animation: "Notification springs in (420ms); the number re-enters with blur and overshoot; ring counts down linearly; approval pulse 700ms × 2; checks draw 500ms.",
  a11y: "The number and its status are polite live regions; the phone is a labelled group of real buttons, tabbable only while a request is open; results move focus to their heading. Colour is never the only signal — every state is spelled out. Reduced motion removes the transitions.",
  responsive: "Side by side from 760px; stacked below, with the wire turning vertical.",
  touchFallback: "Identical on touch; the phone buttons are 48px tall.",
  variants: [
    { id: "paper", label: "Paper" },
    { id: "night", label: "Night" },
  ],
  preview: { bg: "#ece8e0", mode: "fill" },
};
