import type { NextConfig } from "next";

// Velite: dev mode uses programmatic API for watch mode
// Production build uses "velite build" as a prebuild step (see package.json)
const isDev = process.argv.indexOf("dev") !== -1;
if (isDev && !process.env.VELITE_STARTED) {
  process.env.VELITE_STARTED = "1";
  import("velite").then((m) => m.build({ watch: true, clean: false }));
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "assets.st-note.com" },
    ],
  },
};

export default nextConfig;
