import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  eslint: {
    // Ignora los errores de ESLint durante el build (deploy)
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
