const { FlatCompat } = require("@eslint/eslintrc");
const js = require("@eslint/js");

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

module.exports = [
  {
    ignores: ["*.md", "packages/vujita-ui/*.js", "packages/vujita-ui/*.d.ts", "packages/vujita-ui/*.ts", "packages/vujita-ui/*.mts", "packages/vujita-ui/*.d.mts", "packages/vujita-ui/*.mjs"],
  },
  ...compat.extends("./packages/config/eslint/base.js"),
];
