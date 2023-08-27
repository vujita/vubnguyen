/** @typedef  {import("prettier").Config} PrettierConfig */
/** @typedef {import("prettier-plugin-tailwindcss").PluginOptions} TailwindConfig */
/** @typedef  {import("@ianvs/prettier-plugin-sort-imports").PluginConfig} SortImportsConfig */
/** @typedef {import("prettier-plugin-sort-json")} SortJson */

/** @type { PrettierConfig | SortImportsConfig | TailwindConfig |SortJson} */
const config = {
  importOrder: ["^(react/(.*)$)|^(react$)|^(react-native(.*)$)", "^(next/(.*)$)|^(next$)", "^(expo(.*)$)|^(expo$)", "<THIRD_PARTY_MODULES>", "", "^@vujita/(.*)$", "", "^~/utils/(.*)$", "^~/components/(.*)$", "^~/styles/(.*)$", "^~/(.*)$", "^[./]"],
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  importOrderTypeScriptVersion: "4.4.0",
  plugins: ["@ianvs/prettier-plugin-sort-imports", "prettier-plugin-tailwindcss", "prettier-plugin-sort-json"],
  singleAttributePerLine: true,
  tailwindConfig: "./packages/config/tailwind",
};

export default config;
