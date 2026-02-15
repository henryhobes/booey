import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  
  // Global ignores
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),

  // Base TypeScript rules for all files
  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.json",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      // No `any` types - enforce strict typing
      "@typescript-eslint/no-explicit-any": ["error", {
        fixToUnknown: false,
      }],

      // File size limits (warn at 250, error at 300)
      "max-lines": ["error", {
        max: 300,
        skipBlankLines: true,
        skipComments: true,
      }],
    },
  },

  // types/ layer - cannot import from any other src/ layers
  {
    files: ["src/types/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": ["error", {
        patterns: [
          {
            group: ["@/lib/*", "@/hooks/*", "@/components/*", "@/app/*", "@/data/*", "@/styles/*"],
            message: "types/ cannot import from other src/ layers. Keep types pure and dependency-free. See docs/CONVENTIONS.md.",
          },
        ],
      }],
    },
  },

  // lib/utils/ layer - can only import from types/
  {
    files: ["src/lib/utils/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": ["error", {
        patterns: [
          {
            group: ["@/lib/supabase/*", "@/lib/ai/*", "@/hooks/*", "@/components/*", "@/app/*"],
            message: "lib/utils/ can only import from types/. Move dependencies to lib/utils/ or refactor. See docs/CONVENTIONS.md.",
          },
        ],
      }],
    },
  },

  // lib/supabase/ layer - can import types/, lib/utils/
  {
    files: ["src/lib/supabase/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": ["error", {
        patterns: [
          {
            group: ["@/lib/ai/*", "@/hooks/*", "@/components/*", "@/app/*"],
            message: "lib/supabase/ can only import from types/ and lib/utils/. Move dependencies or refactor. See docs/CONVENTIONS.md.",
          },
        ],
      }],
    },
  },

  // lib/ai/ layer - can import types/, lib/utils/
  {
    files: ["src/lib/ai/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": ["error", {
        patterns: [
          {
            group: ["@/lib/supabase/*", "@/hooks/*", "@/components/*", "@/app/*"],
            message: "lib/ai/ can only import from types/ and lib/utils/. Move dependencies or refactor. See docs/CONVENTIONS.md.",
          },
        ],
      }],
    },
  },

  // hooks/ layer - can import lib/, types/
  {
    files: ["src/hooks/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": ["error", {
        patterns: [
          {
            group: ["@/components/*", "@/app/*"],
            message: "hooks/ cannot import from components/ or app/. Extract shared logic to lib/ or pass as hook parameters. See docs/CONVENTIONS.md.",
          },
        ],
      }],
    },
  },

  // components/ layer - can import hooks/, lib/, types/
  {
    files: ["src/components/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": ["error", {
        patterns: [
          {
            group: ["@/app/*"],
            message: "components/ cannot import from app/ pages. Move shared logic to lib/ or hooks/. See docs/CONVENTIONS.md.",
          },
        ],
      }],
    },
  },

  // app/api/ routes - can ONLY import lib/, types/ (NO components or hooks)
  {
    files: ["src/app/api/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": ["error", {
        patterns: [
          {
            group: ["@/components/*", "@/hooks/*"],
            message: "API routes cannot import components or hooks. API routes are server-side only. Extract logic to lib/ or use server actions. See docs/CONVENTIONS.md.",
          },
        ],
      }],
    },
  },

  // Naming conventions for components
  {
    files: ["src/components/**/*.{ts,tsx}"],
    rules: {
      // Component files should be PascalCase
      "no-restricted-syntax": ["error", {
        selector: "ExportDefaultDeclaration > Identifier[name=/^[a-z]/]",
        message: "Component names must be PascalCase. Rename the component to start with an uppercase letter. See docs/CONVENTIONS.md.",
      }],
    },
  },

  // Naming conventions for hooks
  {
    files: ["src/hooks/**/*.{ts,tsx}"],
    rules: {
      // Hook files should export functions starting with 'use'
      "no-restricted-syntax": ["error", {
        selector: "ExportNamedDeclaration > FunctionDeclaration[id.name!=/^use/]",
        message: "Hook functions must start with 'use'. Rename to follow React hook naming convention (e.g., useCustomHook). See docs/CONVENTIONS.md.",
      }],
    },
  },
]);

export default eslintConfig;
