import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  outputFileTracingIncludes: { "/components/[slug]": ["./src/registry/**/*"] },
};

export default nextConfig;
