import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  // Isolate release verification from an active development server.
  distDir: process.env.VITRINE_DIST_DIR || ".next",
  outputFileTracingIncludes: { "/components/[slug]": ["./src/registry/**/*"] },
  // Components that moved to a new name keep their old links working.
  async redirects() {
    return [
      { source: "/components/obsidian-hero", destination: "/components/obsidian-flow", permanent: true },
      { source: "/preview/obsidian-hero", destination: "/preview/obsidian-flow", permanent: true },
    ];
  },
};

export default nextConfig;
