export default {
  env: { browser: true, es2020: true },
  extends: ["eslint-config-vujita/base", "eslint-config-vujita/react"],
  ignorePatterns: ["dist", ".eslintrc.mjs", "vite.config.ts"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
  },
  plugins: ["react-refresh"],
  root: true,
  rules: {},
};
