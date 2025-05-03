import withBundleAnalyzer from "@next/bundle-analyzer";

// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.ANALYZE === 'true',
// })
//
// module.exports = withBundleAnalyzer(nextConfig)
/**
 * @type {string[]}
 */

/** @type {import("next").NextConfig} */
const config = {
  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  experimental: {},
  outputFileTracing: true,
  // this includes files from the monorepo base two directories up
  reactStrictMode: true,
  /** Enables hot reloading for local packages without a build step */
  transpilePackages: ["@vujita/api", "@vujita/auth", "@vujita/db"],
  typescript: { ignoreBuildErrors: true },
};

export default withBundleAnalyzer({
  enabled: true,
})(config);
