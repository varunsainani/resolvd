import type { MetadataRoute } from "next";

const base = process.env.APP_URL || "http://localhost:3000";

// Allow the public marketing + submit pages; keep the authenticated app out of
// search indexes (those routes bounce to login anyway).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/submit", "/login", "/signup"],
      disallow: [
        "/dashboard",
        "/inbox",
        "/analytics",
        "/customers",
        "/kb",
        "/canned",
        "/team",
        "/settings",
      ],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
