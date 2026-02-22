const { FlatCompat } = require("@eslint/eslintrc");
const js = require("@eslint/js");

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

module.exports = [
  { ignores: ["coverage"] },
  ...compat.extends("eslint-config-vujita/base"),
  {
    rules: {
      // Within a single package, relative imports between files are expected
      "no-relative-import-paths/no-relative-import-paths": "off",
    },
  },
];
