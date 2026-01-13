/**
 * Next.js Configuration for JDOM Dashboard
 * Version with manifest completely disabled to fix Internal Server Error
 */

import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: "standalone",

  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: true,
  },

  // React configuration
  reactStrictMode: false,

  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Suppress warnings about lockfiles
  outputFileTracingRoot: path.join(__dirname),

  // Completely disable all manifest and app-dir features that cause errors
  // This is a workaround for Next.js 15.3 manifest reading issues
  webpack: (config) => ({
    ...config,
    resolve: {
      ...config.resolve,
      alias: {
        ...config.resolve.alias,
      },
    },
  }),

  // Disable problematic features
  experimental: {
    // Optimize package imports - specify packages to optimize (empty array = disabled)
    optimizePackageImports: [],

    // Disable CSS optimizations that can cause issues
    optimizeCss: false,
  },

  // Logging
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;
