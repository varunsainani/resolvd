import type { MetadataRoute } from "next";

// Web app manifest (served at /manifest.webmanifest; Next links it automatically).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Resolvd",
    short_name: "Resolvd",
    description: "AI support desk: a shared inbox with auto triage, SLA timers, and analytics.",
    start_url: "/",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#0d9488",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
