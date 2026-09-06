import { resolve } from "node:path";

import { defineConfig } from "vitest/config";

// Unit tests for pure helpers (formatters, class merge, error mapping). These
// run in node with no DOM. The @/* alias mirrors tsconfig so tests import the
// same way the app does.
export default defineConfig({
  resolve: {
    alias: { "@": resolve(__dirname, "src") },
  },
  test: {
    include: ["test/**/*.test.ts"],
    environment: "node",
  },
});
