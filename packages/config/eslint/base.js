/** @type {import("eslint").Linter.Config} */
const config = {
  env: {
    es2022: true,
    node: true,
  },
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    // "import/resolver": {
    //   typescript: {
    //     alwaysTryTypes: true, // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`
    //
    //     // Choose from one of the "project" configs below or omit to use <root>/tsconfig.json by default
    //
    //     // use <root>/path/to/folder/tsconfig.json
    //     project: "path/to/folder",
    //
    //     // Multiple tsconfigs (Useful for monorepos)
    //
    //     // use a glob pattern
    //     project: "packages/*/tsconfig.json",
    //
    //     // use an array
    //     project: ["packages/module-a/tsconfig.json", "packages/module-b/tsconfig.json"],
    //
    //     // use an array of glob patterns
    //     project: ["packages/*/tsconfig.json", "other-packages/*/tsconfig.json"],
    //   },
    // },
  },
  extends: ["turbo", "eslint:recommended", "plugin:@typescript-eslint/recommended-type-checked", "plugin:@typescript-eslint/stylistic-type-checked", "prettier", "plugin:import/typescript"],
  ignorePatterns: ["**/.eslintrc.cjs", "**/*.config.js", "**/*.config.cjs", "packages/config/**", ".next", "dist", "pnpm-lock.yaml"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
  plugins: ["@typescript-eslint", "import", "prettier", "sort-keys-fix", "typescript-sort-keys", "no-relative-import-paths"],
  reportUnusedDisableDirectives: true,
  rules: {
    "@typescript-eslint/consistent-type-imports": ["warn", { prefer: "type-imports", fixStyle: "separate-type-imports" }],
    "@typescript-eslint/no-misused-promises": [2, { checksVoidReturn: { attributes: false } }],
    "@typescript-eslint/no-require-imports": "error",
    "@typescript-eslint/no-unnecessary-condition": "warn",
    "@typescript-eslint/no-unsafe-enum-comparison": "error",
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    "@typescript-eslint/prefer-enum-initializers": "error",
    "@typescript-eslint/prefer-for-of": "error",
    "@typescript-eslint/prefer-optional-chain": "error",
    "@typescript-eslint/prefer-reduce-type-parameter": "error",
    "@typescript-eslint/prefer-return-this-type": "error",
    "@typescript-eslint/prefer-string-starts-ends-with": "error",
    "@typescript-eslint/prefer-ts-expect-error": "error",
    "@typescript-eslint/type-annotation-spacing": "error",
    "import/consistent-type-specifier-style": ["error", "prefer-inline"],
    "import/no-extraneous-dependencies": ["error", { includeInternal: true, includeTypes: true }],
    "no-relative-import-paths/no-relative-import-paths": "error",
    indent: "off", // Let pretteir handle this
    "prettier/prettier": [
      "error",
      {},
      {
        usePrettierrc: true,
      },
    ],
    "sort-keys-fix/sort-keys-fix": "error",
    "typescript-sort-keys/interface": "error",
    "typescript-sort-keys/string-enum": "error",
  },
  overrides: [
    {
      files: ["*.test.js", "*.test.jsx", "*.test.ts", "*.test.tsx"],
      rules: {
        "@typescript-eslint/no-unsafe-call": 1,
      },
    },
  ],
};

module.exports = config;
