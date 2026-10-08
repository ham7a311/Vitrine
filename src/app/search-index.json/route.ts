import { summaries } from "@/registry";

/*
 * The search palette's index, served once as a static file instead of being embedded in every gallery
 * page. It changes only when the registry does, so it is built at deploy time and never regenerated.
 */
export const dynamic = "force-static";

export function GET() {
  // Only the fields the palette reads; preview settings stay out.
  const items = summaries().map(({ preview: _preview, ...rest }) => rest);
  return Response.json(items);
}
