import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

const baseConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

/*
 * TEMPORARY, DEV-ONLY MOCK API PROXY. Delete this block and dev-mock/ before the demo.
 *
 * Only active during `next dev` and only when ACCESSREADY_DEV_MOCK_API is set,
 * for example ACCESSREADY_DEV_MOCK_API=http://127.0.0.1:4010.
 * `fallback` rewrites run after every real route is checked, so real handlers
 * in app/api/** always win. The mock only answers endpoints the backend hasn't built yet.
 */
export default function nextConfig(phase: string): NextConfig {
  const devMockApi =
    phase === PHASE_DEVELOPMENT_SERVER ? process.env.ACCESSREADY_DEV_MOCK_API : undefined;

  if (!devMockApi) return baseConfig;

  return {
    ...baseConfig,
    async rewrites() {
      return {
        beforeFiles: [],
        afterFiles: [],
        fallback: [{ source: "/api/:path*", destination: `${devMockApi}/api/:path*` }],
      };
    },
  };
}
