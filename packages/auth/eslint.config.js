const { FlatCompat } = require("@eslint/eslintrc");
const js = require("@eslint/js");

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

module.exports = [
  ...compat.extends("eslint-config-vujita/base"),
  {
    rules: {
      "no-relative-import-paths/no-relative-import-paths": "off",
    },
  },
];
