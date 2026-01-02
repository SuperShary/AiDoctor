import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Empty turbopack config to silence the warning
  turbopack: {},

  // Standalone output for deployment
  output: 'standalone',
};

export default nextConfig;
