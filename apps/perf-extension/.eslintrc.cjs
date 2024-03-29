module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: ["eslint-config-vujita/base", "eslint-config-vujita/react"],
  ignorePatterns: ["dist", ".eslintrc.cjs", "vite.config.ts"],
  parser: "@typescript-eslint/parser",
  plugins: ["react-refresh"],
  rules: {},
};
