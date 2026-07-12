import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";

// Minimal, low-noise guardrail. Type-aware correctness is owned by `tsc`
// (npm run check); this catches hook misuse and obvious JS mistakes.
export default tseslint.config(
  { ignores: ["dist/**", "node_modules/**"] },
  {
    files: ["client/src/**/*.{ts,tsx}", "server/**/*.ts"],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    plugins: { "react-hooks": reactHooks },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      // TypeScript already resolves identifiers; core no-undef only adds noise.
      "no-undef": "off",
      // Express `catch (err: any)` is an accepted, deliberate pattern here.
      "@typescript-eslint/no-explicit-any": "off",
      // Surface unused code without failing the build; allow _-prefixed args
      // (e.g. Express's required 4-arg error middleware) and caught errors.
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrors: "none" },
      ],
      // New-in-v10 stylistic rules — too aggressive/false-positive-prone here.
      "no-useless-assignment": "off",
      "preserve-caught-error": "off",
    },
  },
);
