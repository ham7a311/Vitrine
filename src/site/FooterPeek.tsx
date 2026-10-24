import { Pane } from "./Pane";

/**
 * Pane peeking up over the footer's bottom rule, on every page with the site footer. His head sits above the rule;
 * the wrapper clips at the rule, so the rest of his body is hidden behind it. Decorative: nothing here is needed to
 * use the footer.
 */
export function FooterPeek() {
  return (
    <div aria-hidden="true" className="footer-peek">
      <Pane pose="footer-peek" sizes="(min-width: 1024px) 11rem, (min-width: 768px) 10rem, 9rem" className="footer-peek-pane" />
    </div>
  );
}
