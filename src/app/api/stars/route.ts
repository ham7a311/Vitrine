import { site } from "@/site.config";

/*
 * The GitHub star count for the navbar. It lives in its own cached route so that the gallery pages
 * stay static: refreshing one small number regenerates this tiny response, not every page that shows it.
 * GitHub is asked at most once an hour, and every visitor shares the cached answer.
 */
export const revalidate = 3600;

export async function GET() {
  let stars: number | null = null;
  try {
    const res = await fetch(`https://api.github.com/repos/${site.githubRepo}`, { next: { revalidate: 3600 }, signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      const data = (await res.json()) as { stargazers_count?: number };
      if (typeof data.stargazers_count === "number") stars = data.stargazers_count;
    }
  } catch {
    // Offline or rate-limited: the navbar simply shows no count.
  }
  return Response.json({ stars });
}
