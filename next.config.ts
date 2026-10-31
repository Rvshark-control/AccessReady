import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  /*
   * `next dev` blocks its CSS/JS for any origin other than localhost. Opening the app
   * through a cloud editor's forwarded port (CloudFront, Codespaces, dev tunnels, ...)
   * then renders unstyled HTML. These hostnames are allowed in development only;
   * production builds (`next build && next start`) serve assets to any origin.
   */
  allowedDevOrigins: [
    "**.cloudfront.net",
    "**.amazonaws.com",
    "**.aws",
    "**.github.dev",
    "**.devtunnels.ms",
    "**.gitpod.io",
    "**.ngrok-free.app",
    "**.ngrok.app",
    "**.trycloudflare.com",
    "127.0.0.1",
    "172.31.37.241",
  ],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
