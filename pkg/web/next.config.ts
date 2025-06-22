import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@domain": path.resolve(__dirname, "../domain/src"),
    };
    return config;
  },
};

export default nextConfig;
