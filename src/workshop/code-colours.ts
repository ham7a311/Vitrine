/**
 * The skill pages' code theme, and a short class for each of its token colours, so a highlighted token carries
 * `class="sk2"` instead of `style="color:#FF7B72"`. globals.css defines the classes (under `.skill-doc .md-code`);
 * markdown.ts refuses to build if the theme has a colour missing here, and check-workshop verifies the CSS.
 */
export const CODE_THEME = "github-dark-default";

export const TOKEN_CLASS: Record<string, string> = {
  "#E6EDF3": "sk0",
  "#8B949E": "sk1",
  "#FF7B72": "sk2",
  "#79C0FF": "sk3",
  "#FFA657": "sk4",
  "#D2A8FF": "sk5",
  "#7EE787": "sk6",
  "#A5D6FF": "sk7",
  "#FFA198": "sk8",
  "#F0F6FC": "sk9",
  "#161B22": "sk10",
};
