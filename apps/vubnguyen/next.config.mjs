const ignoreList = ["node_modules/@swc/core-linux-x64-musl", "node_modules/@swc/core-linux-x64-gnu"];
/**
 * @type {string[]}
 */

/** @type {import("next").NextConfig} */
const config = {
  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  experimental: {
    outputFileTracingExcludes: {
      "*": [...ignoreList, ...ignoreList.map((p) => `./${p}`), ...ignoreList.map((p) => `../../${p}`)],
    },
    outputFileTracingIgnores: [...ignoreList, ...ignoreList.map((p) => `**${p.replaceAll("node_modules", "")}**`)],
  },
  outputFileTracing: true,
  // this includes files from the monorepo base two directories up
  reactStrictMode: true,
  /** Enables hot reloading for local packages without a build step */
  transpilePackages: ["@vujita/api", "@vujita/auth", "@vujita/db"],
  typescript: { ignoreBuildErrors: true },
};

export default config;
