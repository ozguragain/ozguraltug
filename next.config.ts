import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // mdp is linked from ../mdp/npm during development. Turbopack keeps
  // compilation inside the project root by default, so let it reach out for
  // linked packages. Remove this once mdp is installed from a registry.
  experimental: {
    externalDir: true,
  },
};

export default nextConfig;
