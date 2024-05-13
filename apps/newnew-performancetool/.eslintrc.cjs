module.exports = {
  env: { browser: true, es2020: true },
  ignorePatterns: ["dist", ".eslintrc.cjs", "vite.config.ts"],
  parser: "@typescript-eslint/parser",
  plugins: ["react-refresh"],
  root: true,
  rules: {
    "@typescript-eslint/no-unnecessary-condition": 0,
    "@typescript-eslint/no-unsafe-assignment": 0,
    "@typescript-eslint/no-unsafe-call": 0,
  },
};
