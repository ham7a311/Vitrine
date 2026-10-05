import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  // Isolate release verification from an active development server.
  distDir: process.env.VITRINE_DIST_DIR || ".next",
  outputFileTracingIncludes: { "/components/[slug]": ["./src/registry/**/*"] },
};

export default nextConfig;
