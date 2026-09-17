import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Static export: `next build` writes plain HTML/CSS/JS to `out/`, which Netlify
 * serves as before. The legal pages and the waitlist form stub live in `public/`.
 */
const nextConfig: NextConfig = {
  output: "export",
  /** Pin the root so a stray package-lock.json in a parent folder isn't picked as the workspace. */
  turbopack: { root: path.dirname(fileURLToPath(import.meta.url)) },
};

export default nextConfig;
