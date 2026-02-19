const nextPlugin = require("@next/eslint-plugin-next");

/** @type {import("eslint").Linter.Config[]} */
const config = [
  {
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      "@next/next/no-html-link-for-pages": "off",
    },
  },
];

module.exports = config;
