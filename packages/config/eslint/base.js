/** @type {import("eslint").Linter.Config} */
const config = {
  env: {
    es2022: true,
    node: true,
  },
  extends: ["turbo", "eslint:recommended", "plugin:@typescript-eslint/recommended-type-checked", "plugin:@typescript-eslint/stylistic-type-checked", "prettier"],
  ignorePatterns: ["**/.eslintrc.cjs", "**/*.config.js", "**/*.config.cjs", "packages/config/**", ".next", "dist", "pnpm-lock.yaml"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
  plugins: ["@typescript-eslint", "import", "prettier", "sort-keys-fix", "typescript-sort-keys"],
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
    "import/consistent-type-specifier-style": ["error", "prefer-top-level"],
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
};

module.exports = config;
