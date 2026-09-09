import type { MetadataRoute } from "next";

const base = process.env.APP_URL || "http://localhost:3000";

// The publicly indexable routes (the marketing landing and the customer-facing
// submit/auth pages). The authenticated app is intentionally excluded.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: `${base}/`, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/submit`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/login`, lastModified, changeFrequency: "yearly", priority: 0.5 },
    { url: `${base}/signup`, lastModified, changeFrequency: "yearly", priority: 0.5 },
  ];
}
