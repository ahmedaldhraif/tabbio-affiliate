import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const appDirectory = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  poweredByHeader: false,
  reactStrictMode: true,
  turbopack: { root: path.resolve(appDirectory, "../..") },
  images: { unoptimized: true },
  transpilePackages: ["@refref/ui"],
};

export default nextConfig;
