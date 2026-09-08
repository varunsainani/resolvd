import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // These react-hooks v6 rules (still RC) flag patterns we use on purpose:
      // initializing loading/error state at the top of an async data effect, and
      // syncing the latest callback into a ref during render. Both are idiomatic
      // and correct here, so keep them as warnings rather than build-failing errors.
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/refs": "warn",
    },
  },
]);

export default eslintConfig;
