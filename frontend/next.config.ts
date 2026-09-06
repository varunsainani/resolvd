import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// Backend origin. In local dev the Express API runs on :8000; in production the
// frontend and API share an origin, so /api is proxied to the deployed API URL.
const apiOrigin = process.env.BACKEND_URL || "http://localhost:8000";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${apiOrigin}/api/:path*`,
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withNextIntl(nextConfig);
