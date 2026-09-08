import { resolve } from "node:path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// Two kinds of tests: pure-helper unit tests run in node (fast, no DOM), and
// component render tests under test/components/** run in jsdom. The @/* alias
// mirrors tsconfig so tests import the same way the app does.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": resolve(__dirname, "src") },
  },
  test: {
    globals: true,
    include: ["test/**/*.test.{ts,tsx}"],
    environment: "node",
    environmentMatchGlobs: [["test/components/**", "jsdom"]],
    setupFiles: ["./test/setup-dom.ts"],
  },
});
